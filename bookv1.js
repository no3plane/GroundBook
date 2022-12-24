import { bookGround, getPeriods, getGrounds } from './service.js'
import { selectGround, selectPeriod, readLine } from "./ui.js";
import { getToken, getNextTwelvePm, sleep } from "./utils.js";

let token = getToken();

let selectedPeriodId;
let selectedGroundId;
let bookImmediately;

getPeriods(token)
    .then(periods => selectPeriod(periods))
    .then(period => getGrounds(token, new Date(), selectedPeriodId = period.id))
    .then(grounds => selectGround(grounds))
    .then(ground => {
        selectedGroundId = ground.id;
        return readLine('1: 在12点的时候自动预约\n2: 立即预约\n请选择: ');
    })
    .then(answer => {
        bookImmediately = +answer === 2;
        if (bookImmediately) {
            return;
        }
        const countDown = getNextTwelvePm() - new Date();
        if (countDown > 2000) {
            return sleep(countDown - 2000);
        }
    })
    .then(() => {
        if (bookImmediately) {
            return bookGround(token, selectedPeriodId, selectedGroundId, new Date());
        }
        const twelvePm = getNextTwelvePm();
        while (twelvePm - new Date() > 0) {
        }
        return Promise.allSettled(
            [0].map(ms => new Promise(resolve => {
                setTimeout(() => resolve(bookGround(token, selectedPeriodId, selectedGroundId, new Date())), ms);
            }))
        );
    })
    .then(results => {
        if (bookImmediately) {
            console.log(results);
        }
        results.forEach((result) => {
            if (result.status === "fulfilled") {
                console.log(result);
            }
            if (result.status === "rejected") {
                console.log(`预约失败\terrMsg: ${result.reason?.errMsg}`)
            }
        });
    })
    .catch(err => console.log(err));
