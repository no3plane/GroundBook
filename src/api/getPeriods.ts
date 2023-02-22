import { SuccessResponse } from '../responseEntity/Response.js';
import { AxiosWrapper } from './AxiosWrapper.js';
import { baseURL } from './Utils.js';

export async function getPeriods(token: string) {
    const res = await AxiosWrapper({
        method: 'GET',
        url: '/user/getPeriods/',
        baseURL: baseURL,
        params: {
            sportType: 1,
        },
        headers: {
            token: token,
        },
    });

    if (res.success) {
        return res as SuccessResponse<Period[]>;
    } else {
        return res;
    }
}
