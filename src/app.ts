import { getToken } from "./utils.js";
import { mapGroundId, mapPeriodId } from "./id.js";
import { readLine } from "./ui.js";
import { book, printBookableGrounds } from "./book.js";

async function main() {
    const periodIdRank = mapPeriodId([
        '15:00-16:00', '16:00-17:00', '17:00-18:00', '15:30-16:00',
        '19:00-20:00', '20:00-21:00', '18:00-19:00']);
    const groundIdRank = mapGroundId([
        '三牌楼3号', '三牌楼4号', '三牌楼2号',
        '三牌楼1号', '三牌楼5号', '三牌楼6号',]);

    try {
        const select = await readLine('1：预约 2：查看剩余可预约场地\n请选择：');
        if (select === '1') {
            await book(getToken(), periodIdRank, groundIdRank, 2);
        } else {
            await printBookableGrounds(getToken());
        }
    } catch (e) {
        console.log(e);
    }
}

main();