import {bookGround, getGrounds, getPeriods} from './service.js'
import {readLine, selectGround, selectPeriod} from "./ui.js";
import {getToken, getNextTwelvePm, sleep} from "./utils.js";

let token = getToken();

try {
    await book(token);
} catch (e) {
    console.log(e);
}

async function book(token) {
    const periods = await getPeriods(token);
    const period = await selectPeriod(periods);
    const grounds = await getGrounds(token, new Date(), period.id);
    const ground = await selectGround(grounds);

    const answer = await readLine('1: 在12点的时候自动预约\n2: 立即预约\n请选择: ');
    if (+answer === 2) {
        await bookImmediately(token, period, ground);
    } else {
        await bookAtTwelve(period, ground);
    }
}

async function bookImmediately(token, period, ground) {
    const result = await bookGround(token, period.id, ground.id, new Date());
    console.log(result);
}

async function bookAtTwelve(period, ground) {
    const OFFSET = 2;
    const twelvePm = getNextTwelvePm();

    const countDown = twelvePm - new Date();
    if (countDown > 2000) {
        await sleep(countDown - 2000);
    }
    while (+twelvePm + OFFSET > new Date()) {
    }

    const results = await Promise.allSettled(
        [0].map(ms => new Promise(resolve => {
            setTimeout(() => resolve(bookGround(token, period.id, ground.id, new Date())), ms);
        }))
    );
    results.forEach((result) => {
        if (result.status === "fulfilled") {
            console.log(result);
        }
        if (result.status === "rejected") {
            console.log(`预约失败\terrMsg: ${result.reason?.errMsg}`)
        }
    });
}
