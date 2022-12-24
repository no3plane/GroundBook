import { cancelBook, getPriLogs } from "./service.js";
import { readLine } from "./ui.js";
import { getToken } from "./utils.js";

try {
    await listPriLogs();
    const logId = await readLine('要撤销的预约的ID：');
    const res = await cancelBook(getToken(), logId);
    console.log('撤销成功', res);
} catch (e) {
    console.log('撤销失败', e);
}

async function listPriLogs() {
    const logs = await getPriLogs(getToken(), false, true, 10, 0);
    for (const log of logs) {
        console.log(`id: ${log.id}\tdate: ${log.date}\tperiod: ${log.period}\tcreateTime: ${log.createTime}`);
    }
}
