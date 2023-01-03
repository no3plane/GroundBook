export default interface ResponseData<T> {
    success: boolean;
    errMsg: string;
    data: T;
}
