import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { FailResponse, SuccessResponse } from '../responseEntity/Response.js';

/**
 * 对Axios的简单封装，使成功时统一返回SuccessResponse，失败时统一返回FailResponse。
 * 返回的promise的结果不会是rejected，成功与否可由SuccessResponse和FailResponse的success属性判断
 * 模板参数T指定成功时，对象的data属性的数据类型
 * @param config 和Axios的请求配置一样
 * @returns 成功-SuccessResponse，失败-FailResponse
 */
export function AxiosWrapper(config: AxiosRequestConfig) {
    return axios(config).then(handleSuccess).catch(handleFail);
}

function handleSuccess<T>(res: AxiosResponse) {
    if (res.data.success) {
        return res.data as SuccessResponse<T>;
    } else {
        return res.data as FailResponse;
    }
}

function handleFail(err: AxiosError<FailResponse>) {
    if (err?.response?.data?.success === false) {
        // 存在 data.success 属性，且 === false
        return err.response.data as FailResponse;
    } else {
        console.error('未知响应类型', err);
        return {
            success: false,
            errCode: '-1',
            errMsg: '未知错误！请查看控制台输出的响应数据详情，并依此及时修改代码。',
        } as FailResponse;
    }
}
