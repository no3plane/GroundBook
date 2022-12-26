import fs from "fs";
import { Ground, Period } from "./entity/result.entity";

const TOKEN_FILE_PATH = 'C:\\tybToken.txt';

let tokenCache: string | null = null;

export function getToken(): string {
    if (tokenCache) {
        return tokenCache;
    } else {
        return tokenCache = fs.readFileSync(TOKEN_FILE_PATH).toString();
    }
}

export function getNextTwelvePm(): Date {
    const twelvePM = new Date();
    twelvePM.setHours(12, 0, 0, 0);
    if (new Date() >= twelvePM) {
        twelvePM.setDate(twelvePM.getDate() + 1);
        return twelvePM;
    }
    return twelvePM;
}

export function getTodayTwelvePm(): Date {
    const twelvePM = new Date();
    twelvePM.setHours(12, 0, 0, 0);
    return twelvePM;
}

export class PeriodStatus {
    static PERIOD_OPEN = 1;
    static PERIOD_CLOSE = 0;

    static read(period: Period, date: Date) {
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

    static read(ground: Ground) {
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

    static isBookable(ground: Ground) {
        return this.read(ground) === this.BOOKABLE;
    }

    static isUserBook(ground: Ground) {
        return this.read(ground) === this.USER_BOOK;
    }

    static isAdminBook(ground: Ground) {
        return this.read(ground) === this.ADMIN_BOOK;
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
