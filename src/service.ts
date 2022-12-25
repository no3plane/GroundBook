import fetch from "node-fetch";
import { calcTimestampSign, formatDate, GroundStatus } from "./utils";
import { ResponseData, Ground, Period } from "./entity/result.entity"

export { bookGround, getPeriods, getGrounds, cancelBook, getPriLogs };

const ORIGIN = 'https://tyb.qingyou.ren';

async function bookGround(token: string, periodId: number, stadiumId: number, date: Date) {
    const url = ORIGIN + '/user/book/';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            token: token,
            resultJSON: date.getTime().toString(),
            resultJSONSignature: calcTimestampSign(date.getTime().toString())
        },
        body: JSON.stringify({
            periodId: periodId,
            date: formatDate(date),
            stadiumId: stadiumId
        }),
    });
    const result = await response.json();
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve(result) : reject(result);
    })
}

async function getPeriods(token: string, sportType = 1): Promise<Array<Period>> {
    const url = ORIGIN + '/user/getPeriods/?sportType=' + sportType;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            token: token,
        }
    });
    const result = await response.json();
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve((result as ResponseData<any>).data) : reject(result);
    })
}

async function getGrounds(token: string, date: Date, periodId: number): Promise<Array<Ground>> {
    const today = formatDate(date);
    const url = ORIGIN + `/user/getPubLogs/?date=${today}&periodId=${periodId}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            token: token
        },
        body: JSON.stringify({
            date: today,
            periodId: +periodId,
        })
    })
    const result = await response.json();
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve((result as ResponseData<any>).data) : reject(result);
    })
}

async function cancelBook(token: string, logId: number) {
    const url = ORIGIN + '/user/cancel';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            token: token
        },
        body: `logId=${logId}`
    });
    const result = await response.json();
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve(result) : reject(result);
    })
}

async function getPriLogs(token: string, containCanceled: boolean, desc: boolean, limit: number, offset: number) {
    const url = ORIGIN + '/user/getPriLogs';
    const response = await fetch(url, {
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
    });
    const result = await response.json();
    return new Promise((resolve, reject) => {
        (result as ResponseData<any>).success ? resolve((result as ResponseData<any>).data) : reject(result);
    })
}