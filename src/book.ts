import { bookGround, getGrounds, getPeriods } from './api.js'
import { getNextTwelvePm, GroundStatus, PeriodStatus, sleep, getTodayTwelvePm } from "./utils.js";
import { getGroundNameById, getPeriodNameById } from "./id.js";
import { ResponseData, Ground, Period } from './entity/result.entity.js';

export async function book(token: string, periodIdRank: Array<number>, groundIdRank: Array<number>, bookGroundCount: number = 1) {
    if (!await checkTokenAvailable(token)) {
        console.log('Token无效');
        return;
    }

    if (new Date() < getTodayTwelvePm()) {
        console.log('正在等待12点的来临...');
        await waitUntilTwelve(-300);
        console.log('时间到了');
    }

    const checkCount = await waitUntilAnyoneBook(token, 2000);
    console.log(`已经有人预约成功了（检测次数：${checkCount}）`);

    const pendingPeriodIdRank = [...periodIdRank];
    for (let i = 0; i < bookGroundCount; i++) {
        let successfulGround: ResponseData<Ground> = null;

        const bookSuccessCallback = (successGround: ResponseData<Ground>) => {
            successfulGround = successGround;
            console.log(
                '预约成功：%s\t%s',
                getPeriodNameById(successGround.data.log.periodId),
                getGroundNameById(successGround.data.log.stadiumId),
            );
        }
        const bookFailCallback = (failGround: ResponseData<Ground> | ResponseData<null>) => {
            // TODO 黑名单机制，如果一个失败了，之后就不要再试了！
            const periodName = failGround?.data?.log ? getPeriodNameById(failGround?.data?.log?.periodId) : null;
            const groundName = failGround?.data?.log ? getGroundNameById(failGround?.data?.log?.stadiumId) : null;
            console.log(
                '预约失败：%s\t%s\t%s',
                periodName, groundName, failGround.errMsg
            );
        }

        if (await tryBookTheBestGround(5, token, pendingPeriodIdRank, groundIdRank,
            bookSuccessCallback, bookFailCallback)) {
            pendingPeriodIdRank.splice(pendingPeriodIdRank.indexOf(successfulGround.data.log.periodId), 1);
        }
    }
}

async function checkTokenAvailable(token: string): Promise<boolean> {
    try {
        await getPeriods(token);
    } catch (res) {
        if ((res as ResponseData<unknown>).errMsg === '请先登录') {
            return false;
        }
    }
    return true;
}

async function waitUntilTwelve(offset: number = 0): Promise<void> {
    const twelvePm = getNextTwelvePm();
    const countDown = +twelvePm - +new Date();
    if (countDown > 2000) {
        await sleep(countDown - 2000);
    }
    while (+twelvePm + offset > +new Date()) {
    }
}

async function waitUntilAnyoneBook(token: string, timeout: number): Promise<number> {
    let checkCount = 0;
    const expire = +new Date() + timeout;
    while ((!await hasAnyoneBook(token)) && (+new Date() < expire)) {
        checkCount++;
    }
    return ++checkCount;
}

async function tryBookTheBestGround(time: number, token: string, periodIdRank: Array<number>, groundIdRank: Array<number>,
    successCallback: Function, failCallback: Function): Promise<boolean> {
    const OFFSET_SECOND = 1;
    for (let i = 0; i < time; i++) {
        const bookableGround = await findBookableGround(token, periodIdRank, groundIdRank);
        if (!bookableGround) {
            continue;
        }
        // TODO null
        const timestamp = new Date();
        timestamp.setSeconds(timestamp.getSeconds() + OFFSET_SECOND); // 发送的时间戳延后两秒，防止“预约未开放”
        try {
            const successGround = await bookGround(token, bookableGround.period.id, bookableGround.id, timestamp);
            successCallback(successGround);
            return true;
        } catch (failGround) {
            failCallback(failGround);
        } finally {
            await sleep(2000);
        }
    }
    return false;
}

export async function printBookableGrounds(token: string): Promise<void> {
    const bookableGrounds = await findBookableGrounds(token, [21, 22, 2, 3, 4, 5, 6], [5, 6, 7, 8, 13, 14, 15, 1, 2, 3, 4]);
    console.log(`可以预约的场地个数：${bookableGrounds.length}`);
    for (const ground of bookableGrounds) {
        console.log('%s-%s\t%s', ground.period.start, ground.period.end, ground.name);
    }
}

/*
    按指定优先级找到第一个可以被预约的场地
 */
async function findBookableGround(token: string, periodIdRank: Array<number>, groundIdRank: Array<number>): Promise<Ground | null> {
    const date = new Date();
    const periods = await getPeriods(token);
    for (const periodId of periodIdRank) {
        const period = periods.find(period => period.id === periodId);
        if (!period || PeriodStatus.read(period, date) === PeriodStatus.PERIOD_CLOSE) {
            continue;
        }
        const grounds = await getGrounds(token, date, periodId);
        for (const groundId of groundIdRank) {
            const ground = grounds.find(ground => ground.id === groundId);
            if (!ground || GroundStatus.read(ground) !== GroundStatus.BOOKABLE) {
                continue;
            }
            ground.period = period;
            return ground;
        }
    }
    return null;
}

/*
    按指定优先级找到所有可以被预约的场地
    （尝试使用函数式编程书写此函数）
 */
async function findBookableGrounds(token: string, periodIdRank: Array<number>, groundIdRank: Array<number>): Promise<Array<Ground>> {
    const date = new Date();

    /* 将对象数组objs按照指定属性attrName的值排序
       顺序来源于给定属性数组attrValueRank
       且筛选掉不attrOrderList.include(obj[attrName])的对象 */
    const rankObjsByAttr = (objs: Array<object>, attrName: string, attrValueRank: Array<any>) =>
        attrValueRank.reduce((resultArray, currentAttr) => {
            const obj = objs.find(obj => obj[attrName] === currentAttr);
            if (obj) {
                resultArray.push(obj);
            }
            return resultArray;
        }, []);

    const periods = await getPeriods(token);
    const openPeriods = periods.filter(period => PeriodStatus.read(period, date) === PeriodStatus.PERIOD_OPEN);
    const rankedPeriods = rankObjsByAttr(openPeriods, 'id', periodIdRank);

    const groundsGroupByPeriod = await Promise.all(
        rankedPeriods.map(async (period: Period) => {
            const grounds = await getGrounds(token, date, period.id);
            grounds.forEach(ground => ground.period = period);
            return grounds;
        })
    );

    const rankedGroundsGroupByPeriod = groundsGroupByPeriod.map(
        groundGroup => rankObjsByAttr(groundGroup, 'id', groundIdRank)
    );

    return []
        .concat(...rankedGroundsGroupByPeriod)
        .filter(ground => GroundStatus.read(ground) === GroundStatus.BOOKABLE);
}


async function hasAnyoneBook(token: string): Promise<boolean | Ground> {
    const date = new Date();

    for (const period of await getPeriods(token)) {
        if (PeriodStatus.read(period, date) === PeriodStatus.PERIOD_CLOSE) {
            continue;
        }
        for (const ground of await getGrounds(token, date, period.id)) {
            if (GroundStatus.isUserBook(ground)) {
                return ground;
            }
        }
    }
    return false;
}
