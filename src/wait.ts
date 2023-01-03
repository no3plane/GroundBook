import { getGrounds, getPeriods } from "./api";
import { sleep, getToken } from "./utils";

export async function waitUntilBookAvailable() {
    if (new Date() < getTodayTwelvePm()) {
        console.debug('正在等待12点的来临...');
        await waitUntilTwelve(-300);
        console.debug('12点到了');
    }

    const checkCount = await waitUntilAnyoneBook(2000);
    console.debug(`已经有人预约成功了（检测次数：${checkCount}）`);
}

async function waitUntilTwelve(offset: number = 0) {
    const twelvePm = getNextTwelvePm();
    const countDown = +twelvePm - +new Date();
    if (countDown > 2000) {
        await sleep(countDown - 2000);
    }
    while (+twelvePm + offset > +new Date()) {
    }
}

async function waitUntilAnyoneBook(timeout: number): Promise<number> {
    let token = getToken();
    let checkCount = 0;
    const expire = +new Date() + timeout;
    while ((!await hasAnyoneBook(token)) && (+new Date() < expire)) {
        checkCount++;
    }
    return ++checkCount;
}

async function hasAnyoneBook(token: string) {
    const date = new Date();
    const periods = (await getPeriods(token)).data;
    for (const period of periods) {
        if (period.isClosed()) {
            continue;
        }
        const grounds = (await getGrounds(token, period.id, date)).data;
        for (const ground of grounds) {
            if (ground.isUserBooked()) {
                console.debug('检测到有预约成功记录', ground);
                return true;
            }
        }
    }
    return false;
}

function getNextTwelvePm() {
    const twelvePM = new Date();
    twelvePM.setHours(12, 0, 0, 0);
    if (new Date() >= twelvePM) {
        twelvePM.setDate(twelvePM.getDate() + 1);
        return twelvePM;
    }
    return twelvePM;
}

function getTodayTwelvePm() {
    const twelvePM = new Date();
    twelvePM.setHours(12, 0, 0, 0);
    return twelvePM;
}
