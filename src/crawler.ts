import { getGrounds, getPeriods } from './api.js'
import { getToken } from "./utils.js";
import fs from "fs";
import { GroundLog } from './entity/result.entity.js';

try {
    const path = 'C:\\Users\\Solstice\\Downloads\\records.csv';
    // const startDate = new Date(2022, 8, 1);
    const startDate = new Date();
    const endDate = new Date();
    const records = await fetchRecords(getToken(), startDate, endDate);
    await saveRecords(records, path);
} catch (e) {
    console.log(e);
}


async function fetchRecords(token: string, startDate: Date, endDate: Date): Promise<Array<GroundLog>> {
    let records = [];
    const periods = await getPeriods(token);
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        console.log(`正在处理：${currentDate}`)
        for (let period of periods) {
            const grounds = await getGrounds(token, currentDate, period.id);
            for (let ground of grounds) {
                if (!ground.log) {
                    continue;
                }
                records.push(ground.log);
            }
        }
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return records;
}

function saveRecords(records: Array<GroundLog>, path: string): void {
    let result = getCsvHead(records[0]) + '\n';
    const colNames = getCsvColNames(records[0]);
    for (let record of records) {
        result += getCsvRow(colNames, record) + '\n';
    }
    fs.writeFileSync(path, result);
}


function getCsvHead(obj: object): string {
    return Object.keys(obj).join(',') + ',';
}

function getCsvColNames(obj: object): string[] {
    return Object.keys(obj);
}

function getCsvRow(keys: Array<string>, obj: object) {
    let result = '';
    for (let key of keys) {
        if (obj[key] === undefined) {
            result += ',';
        } else {
            result += obj[key] + ',';
        }
    }
    return result;
}

export async function printBookableGrounds(token: string): Promise<void> {
    const bookableGrounds = await findBookableGrounds(token, [21, 22, 2, 3, 4, 5, 6], [5, 6, 7, 8, 13, 14, 15, 1, 2, 3, 4]);
    console.log(`可以预约的场地个数：${bookableGrounds.length}`);
    for (const ground of bookableGrounds) {
        console.log('%s-%s\t%s', ground.period.start, ground.period.end, ground.name);
    }
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

