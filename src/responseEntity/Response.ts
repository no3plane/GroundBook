export interface SuccessResponse<T> {
    success: true;
    data: T;
}

export interface FailResponse {
    success: false;
    errCode: string;
    errMsg: string;
}
