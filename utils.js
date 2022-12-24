import CryptoJS from "crypto-js";
import fs from "fs";

export {getToken, getTimestamp, calcTimestampSign, fillNumberByZero, formatDate, getNextTwelvePm, getTodayTwelvePm};

const TOKEN_FILE_PATH = 'C:\\tybToken.txt';

let tokenCache = null;

function getToken() {
    if (tokenCache) {
        return tokenCache;
    } else {
        return tokenCache = fs.readFileSync(TOKEN_FILE_PATH).toString();
    }
}

function getTimestamp(date = new Date()) {
    return date.getTime().toString();
}

function calcTimestampSign(timestamp) {
    const plainText = CryptoJS.enc.Utf8.parse(timestamp);
    const key = CryptoJS.enc.Utf8.parse("6f00cd9cade84e52");

    const cipherTextObj = CryptoJS.AES.encrypt(plainText, key, {
        iv: CryptoJS.enc.Utf8.parse("25d82196341548ef"),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return CryptoJS.enc.Base64.stringify(cipherTextObj.ciphertext);
}

function fillNumberByZero(number, newLength) {
    let oldLength = number.toString().length;
    let result = number.toString();
    for (let i = 0; i < newLength - oldLength; i++) {
        result = '0' + result;
    }
    return result;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = fillNumberByZero(date.getMonth() + 1, 2);
    const day = fillNumberByZero(date.getDate(), 2);
    return `${year}-${month}-${day}`;
}

function getNextTwelvePm() {
    const twelvePM = new Date();
    twelvePM.setHours(12, 0, 0, 0);
    if (new Date() >= twelvePM) {
        twelvePM.setDate(twelvePM.getDate() + 1);
        return twelvePM;
    }
    return twelvePM;
}

function getTodayTwelvePm() {
    const twelvePM = new Date();
    twelvePM.setHours(12, 0, 0, 0);
    return twelvePM;
}

export class PeriodStatus {
    static PERIOD_OPEN = 1;
    static PERIOD_CLOSE = 0;

    static read(period, date) {
        if (period.dateType[date.getDay()] === true) {
            return PeriodStatus.PERIOD_OPEN;
        }
        return PeriodStatus.PERIOD_CLOSE;
    }
}

export class GroundStatus {
    static BOOKABLE = 0;
    static USER_BOOK = 1;
    static ADMIN_BOOK = 2;

    static read(ground) {
        if (!ground.log) {
            return GroundStatus.BOOKABLE;
        }
        if (ground.log.status === 1) {
            return GroundStatus.USER_BOOK;
        }
        if (ground.log.status === 2) {
            return GroundStatus.ADMIN_BOOK;
        }
        return -1;
    }

    static isBookable(ground) {
        return this.read(ground) === this.BOOKABLE;
    }

    static isUserBook(ground) {
        return this.read(ground) === this.USER_BOOK;
    }

    static isAdminBook(ground) {
        return this.read(ground) === this.ADMIN_BOOK;
    }
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export {sleep};