import CryptoJS from 'crypto-js';
import { ReserveSuccessLog } from '../responseEntity/Log.js';
import { SuccessResponse } from '../responseEntity/Response.js';
import { AxiosWrapper } from './AxiosWrapper.js';
import { baseURL, formatDate } from './Utils.js';

// TODO 需要测试

export interface SendReservationResponse {
    log: ReserveSuccessLog;
    orderNo: number;
}

export async function sendReservation(token: string, periodId: number, stadiumId: number) {
    const time = new Date();
    const res = await AxiosWrapper({
        method: 'POST',
        url: '/user/book/',
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
            token: token,
            resultJSON: time.getTime().toString(),
            resultJSONSignature: calcTimestampSign(time.getTime().toString()),
        },
        data: {
            periodId: periodId,
            date: formatDate(time),
            stadiumId: stadiumId,
        },
    });

    if (res.success) {
        return res as SuccessResponse<SendReservationResponse>;
    } else {
        return res;
    }
}

function calcTimestampSign(timestamp: string): string {
    const plainText = CryptoJS.enc.Utf8.parse(timestamp);
    const key = CryptoJS.enc.Utf8.parse('6f00cd9cade84e52');

    const cipherTextObj = CryptoJS.AES.encrypt(plainText, key, {
        iv: CryptoJS.enc.Utf8.parse('25d82196341548ef'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return CryptoJS.enc.Base64.stringify(cipherTextObj.ciphertext);
}
