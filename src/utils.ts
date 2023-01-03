import fs from "fs";
import { getPeriods } from "./api.js";

const TOKEN_FILE_PATH = 'C:\\tybToken.txt';

let tokenCache: string | null = null;

export function getToken(): string {
    if (tokenCache) {
        return tokenCache;
    } else {
        return tokenCache = fs.readFileSync(TOKEN_FILE_PATH).toString();
    }
}

export async function checkTokenValidity(token: string = getToken()) {
    const result = await getPeriods(token);
    if (result.errMsg === '请先登录') {
        return false;
    }
    if (!result.success) {
        throw new Error("检测Token有效性时，响应了未知的结果");
    }
    return true;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export function sortBySpecifiedFieldOrder<T>(objs: T[], field: string, fieldOrder: any[]): T[] {
    const map = new Map();
    for (const obj of objs) {
        map.set(obj[field], obj);
    }
    const result = [];
    for (const value of fieldOrder) {
        const obj = map.get(value);
        if (obj !== undefined) {
            result.push(obj);
        }
    }
    return result;
}
