import Booker from './book.js';
import Ground from './entity/Ground.js';
import Period from './entity/Period.js';
import { checkTokenValidity } from "./utils.js";
import { waitUntilBookAvailable } from "./wait.js";

async function main() {
    if (!await checkTokenValidity()) {
        console.log('Token无效');
        return;
    }

    console.log('等待预约开始...');
    await waitUntilBookAvailable();

    console.log('预约开始了');
    const booker = new Booker({
        goal: 2,
        periodRanking: Period.getIdsFromNames([
            '15:00-16:00', '16:00-17:00', '17:00-18:00', '15:30-16:00',
            '19:00-20:00', '20:00-21:00', '18:00-19:00'
        ]),
        groundRanking: Ground.getIdsFromNames([
            '三牌楼3号', '三牌楼4号', '三牌楼2号',
            '三牌楼1号', '三牌楼5号', '三牌楼6号',
        ]),
        onSuccess: (ground) => {
            console.log(
                '预约成功：%s\t%s',
                // TODO 当时写的时候，这里为什么不用ground.id而是用ground.log.periodId，等开学之后看看预约成功的响应的结构
                Period.getReadableNameById(ground.log.periodId),
                Ground.getReadableNameById(ground.log.stadiumId)
            );
        },
        onFail: (ground, responseData) => {
            console.log(
                '预约失败：%s\t%s\t%s',
                Period.getReadableNameById(ground.period.id),
                Ground.getReadableNameById(ground.id),
                responseData.errMsg
            );
        },
    });
}

main();