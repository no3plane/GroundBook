import { PrivateLog } from '../responseEntity/Log.js';
import { SuccessResponse } from '../responseEntity/Response.js';
import { AxiosWrapper } from './AxiosWrapper.js';
import { baseURL } from './Utils.js';

interface GetPersonalLogConfig {
    containCanceled: boolean; // 包括自己撤销掉的预约
    desc: boolean; // 按时间倒序
    limit: number;
    offset: number;
}

export async function getPersonalLog(token: string, config: GetPersonalLogConfig) {
    const res = await AxiosWrapper({
        method: 'POST',
        url: '/user/getPriLogs',
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
            token: token,
        },
        data: config,
    });

    if (res.success) {
        return res as SuccessResponse<PrivateLog[]>;
    } else {
        return res;
    }
}
