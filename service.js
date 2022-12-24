import fetch from "node-fetch";
import { getTimestamp, calcTimestampSign, formatDate } from "./utils.js";

export { bookGround, getPeriods, getGrounds, cancelBook, getPriLogs };

const ORIGIN = 'https://tyb.qingyou.ren';

function bookGround(token, periodId, stadiumId, date) {
    const url = ORIGIN + '/user/book/';
    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            token: token,
            resultJSON: getTimestamp(date),
            resultJSONSignature: calcTimestampSign(getTimestamp(date))
        },
        body: JSON.stringify({
            periodId: periodId,
            date: formatDate(date),
            stadiumId: stadiumId
        }),
    })
        .then(res => res.json())
        .then(res =>
            new Promise((resolve, reject) => {
                res.success ? resolve(res) : reject(res);
            })
        );
}

function getPeriods(token, sportType = 1) {
    const url = ORIGIN + '/user/getPeriods/?sportType=' + sportType;
    return fetch(url, {
        method: 'GET',
        headers: {
            token: token,
        }
    })
        .then(res => res.json())
        .then(res => {
            return new Promise((resolve, reject) => {
                res.success ? resolve(res.data) : reject(res);
            })
        }
        );
}

function getGrounds(token, date, periodId) {
    const today = formatDate(date);
    const url = ORIGIN + `/user/getPubLogs/?date=${today}&periodId=${periodId}`;
    return fetch(url, {
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
        .then(res => res.json())
        .then(res => {
            return new Promise((resolve, reject) => {
                res.success ? resolve(res.data) : reject(res);
            })
        });
}

function cancelBook(token, logId) {
    return fetch(ORIGIN + '/user/cancel', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            token: token
        },
        body: `logId=${logId}`
    })
        .then(res => res.json())
        .then(res => new Promise((resolve, reject) => {
            res.success ? resolve(res) : reject(res);
        }))
}

function getPriLogs(token, containCanceled, desc, limit, offset) {
    return fetch(ORIGIN + '/user/getPriLogs', {
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
    })
        .then(res => res.json())
        .then(res => new Promise((resolve, reject) => {
            res.success ? resolve(res.data) : reject(res);
        }))
}