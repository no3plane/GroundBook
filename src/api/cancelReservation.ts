import { SuccessResponse } from "../responseEntity/Response.js";
import { AxiosWrapper } from "./AxiosWrapper.js";
import { baseURL } from "./Utils.js";

// TODO 缺少响应结构实体
// TODO 缺少测试

export async function cancelReservation(token: string, logId: string) {
    const res = await AxiosWrapper({
        method: 'POST',
        url: '/user/cancel',
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: token,
        },
        data: `logId=${logId}`,
    });

    if (res.success) {
        // TODO 待补充响应体
        // return res as SuccessResponse<>;
    } else {
        return res;
    }
}
