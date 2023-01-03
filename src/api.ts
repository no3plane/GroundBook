import fetch from "node-fetch";
import CryptoJS from "crypto-js";
import Period from "./entity/Period.js";
import ResponseData from "./entity/ResponseData.js";
import Ground from "./entity/Ground.js";
import { plainToClass, plainToInstance } from "class-transformer";

const ORIGIN = 'https://tyb.qingyou.ren';

type bookGroundOptions = {
    periodId: number,
    stadiumId: number,
    date: Date
};

type getPeriodsOptions = {
    containCanceled: boolean,
    desc: boolean,
    limit: number,
    offset: number
}

export const enum SportType {
    badminton = 1
}

export async function bookGround(token: string, options: bookGroundOptions) {
    const result = await fetchJSON({
        method: 'POST',
        url: ORIGIN + '/user/book/',
        headers: {
            "Content-Type": "application/json",
            token: token,
            resultJSON: options.date.getTime().toString(),
            resultJSONSignature: calcTimestampSign(options.date.getTime().toString())
        },
        body: {
            periodId: options.periodId,
            date: formatDate(options.date),
            stadiumId: options.stadiumId
        }
    })
    result.data = plainToClass(Ground, result.data);
    return result as ResponseData<Ground>;
}

export async function getPeriods(token: string, sportType: SportType = SportType.badminton) {
    const result = await fetchJSON({
        method: 'GET',
        url: ORIGIN + '/user/getPeriods/?sportType=' + sportType,
        headers: {
            token: token,
        }
    })
    result.data = plainToInstance(Period, result.data);
    return result as ResponseData<Period[]>;
}

export async function getGrounds(token: string, periodId: number, date: Date) {
    const today = formatDate(date);
    const result = await fetchJSON({
        method: 'POST',
        url: ORIGIN + `/user/getPubLogs/?date=${today}&periodId=${periodId}`,
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: {
            date: today,
            periodId: +periodId,
        }
    })
    result.data = plainToInstance(Ground, result.data);
    return result as ResponseData<Ground[]>
}

export async function cancelBook(token: string, logId: number) {
    const response = await fetch(
        ORIGIN + '/user/cancel', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            token: token
        },
        body: `logId=${logId}`
    });
    const result = await response.json() as ResponseData<unknown>;
    // TODO result.data = plainToClass(xx, xxx);
    return result as ResponseData<unknown>;
}

export async function getPriLogs(token: string, options: getPeriodsOptions) {
    const result = await fetchJSON({
        method: 'POST',
        url: ORIGIN + '/user/getPriLogs',
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: {
            containCanceled: options.containCanceled,
            desc: options.desc,
            limit: options.limit,
            offset: options.offset
        }
    })
    // TODO result.data = plainToInstance(xx, xxx);
    return result as ResponseData<unknown>;
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

type RequestOptions = {
    method: 'GET' | 'POST',
    url: string,
    headers: HeadersInit,
    body?: object
};

async function fetchJSON(options: RequestOptions) {
    const response = await fetch(options.url, {
        method: options.method,
        headers: options.headers,
        body: JSON.stringify(options.body),
    })
    return (await response.json()) as ResponseData<unknown>;
}
