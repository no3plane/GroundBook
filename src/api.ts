import fetch from "node-fetch";
import CryptoJS from "crypto-js";
import { ResponseData, Ground, Period } from "./entity/result.entity"

const ORIGIN = 'https://tyb.qingyou.ren';

export async function bookGround(token: string, periodId: number, stadiumId: number, date: Date) {
    const result = await fetchJSON(
        'POST', ORIGIN + '/user/book/',
        {
            "Content-Type": "application/json",
            token: token,
            resultJSON: date.getTime().toString(),
            resultJSONSignature: calcTimestampSign(date.getTime().toString())
        },
        {
            periodId: periodId,
            date: formatDate(date),
            stadiumId: stadiumId
        }
    );
    if (result.success) {
        return result;
    }
    throw new Error(result.errMsg);
}

export async function getPeriods(token: string, sportType = 1): Promise<Array<Period>> {
    const url = ORIGIN + '/user/getPeriods/?sportType=' + sportType;
    const result = await fetch(url, {
        method: 'GET',
        headers: {
            token: token,
        }
    }).then(res => res.json());
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve((result as ResponseData<any>).data) : reject(result);
    })
}

export async function getGrounds(token: string, date: Date, periodId: number): Promise<Array<Ground>> {
    const today = formatDate(date);
    const url = ORIGIN + `/user/getPubLogs/?date=${today}&periodId=${periodId}`;
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: JSON.stringify({
            date: today,
            periodId: +periodId,
        })
    }).then(res => res.json());
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve((result as ResponseData<any>).data) : reject(result);
    })
}

export async function cancelBook(token: string, logId: number) {
    const url = ORIGIN + '/user/cancel';
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            token: token
        },
        body: `logId=${logId}`
    }).then(res => res.json());
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve(result) : reject(result);
    })
}

export async function getPriLogs(token: string, containCanceled: boolean, desc: boolean, limit: number, offset: number) {
    const url = ORIGIN + '/user/getPriLogs';
    const result = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: JSON.stringify({
            containCanceled: containCanceled,
            desc: desc,
            limit: limit,
            offset: offset
        })
    }).then(res => res.json());
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve((result as ResponseData<any>).data) : reject(result);
    })
}

function calcTimestampSign(timestamp: string): string {
    const plainText = CryptoJS.enc.Utf8.parse(timestamp);
    const key = CryptoJS.enc.Utf8.parse("6f00cd9cade84e52");

    const cipherTextObj = CryptoJS.AES.encrypt(plainText, key, {
        iv: CryptoJS.enc.Utf8.parse("25d82196341548ef"),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return CryptoJS.enc.Base64.stringify(cipherTextObj.ciphertext);
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1); // 如果是个位数前面要补0
    const day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
    return `${year}-${month}-${day}`;
}

async function fetchJSON(method: string, url: string, headers: HeadersInit, body: object) {
    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
    })
    const result = await response.json();
    return result as ResponseData<unknown>;
}
