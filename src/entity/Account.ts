import { getPeriods } from '../api/getPeriods.js';

export class Account {
    name: string;
    token: string;
    isConcurrencyLimited: boolean; // 该账号是否受到“请xxx秒后重试的限制”。特殊情况：在book api中，如果token错误，返回的错误信息不是“请先登录”，而是“请259200秒后重试”。所以对于这个返回结果，无法判断它是token错误还是该账号确实是被封号了3天。
    remainTime: number; // 每个账号每天最多只能预约两个场地

    constructor(name: string, token: string) {
        this.name = name;
        this.token = token;
        this.isConcurrencyLimited = false;
        this.remainTime = 2;
    }

    async isValid() {
        const res = await getPeriods(this.token);
        return !res.success;
    }
}
