import { PublicLog, SportType } from '../responseEntity/Log.js';
import { SuccessResponse } from '../responseEntity/Response.js';
import { AxiosWrapper } from './AxiosWrapper.js';
import { baseURL, formatDate } from './Utils.js';

interface PublicLogsResponse {
    id: number; // 应该是场地ID
    name: string; // 场地名
    type: SportType;
    log: PublicLog;
}

export async function getPublicLogs(token: string, date: Date, periodId: number) {
    const res = await AxiosWrapper({
        method: 'POST',
        url: '/user/getPubLogs',
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
            token: token,
        },
        data: {
            date: formatDate(date),
            periodId: periodId,
        },
    });

    if (res.success) {
        return res as SuccessResponse<PublicLogsResponse[]>;
    } else {
        return res;
    }
}
