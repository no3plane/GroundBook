import { SuccessResponse } from "../responseEntity/Response.js";
import { AxiosWrapper } from "./AxiosWrapper.js";
import { baseURL } from "./Utils.js";

export async function getNotice(token: string) {
    const res = await AxiosWrapper({
        method: 'GET',
        url: '/user/getNotice',
        baseURL: baseURL,
        headers: {
            token: token,
        },
    });

    if (res.success) {
        return res as SuccessResponse<Notice>;
    } else {
        return res;
    }
}
