import fs from 'fs';
export const baseURL = 'https://tyb.qingyou.ren/';

const TOKEN_FILE_PATH = 'C:\\tybToken.txt';

let tokenCache: string | null = null;

export function getToken(): string {
    if (tokenCache) {
        return tokenCache;
    } else {
        return (tokenCache = fs.readFileSync(TOKEN_FILE_PATH).toString());
    }
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1; // 如果是个位数前面要补0
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return `${year}-${month}-${day}`;
}
