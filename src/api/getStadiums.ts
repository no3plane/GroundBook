import { SuccessResponse } from '../responseEntity/Response.js';
import { AxiosWrapper } from './AxiosWrapper.js';
import { baseURL } from './Utils.js';

export async function getStadiums(token: string) {
    const res = await AxiosWrapper({
        method: 'GET',
        url: '/user/getStadiums',
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
            token: token,
        },
    });

    if (res.success) {
        return res as SuccessResponse<Stadium[]>;
    } else {
        return res;
    }
}
