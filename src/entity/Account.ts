import { getPeriods } from '../api/getPeriods.js';

export class Account {
    name: string;
    token: string;
    remainTime: number; // 每个账号每天最多只能预约两个场地

    constructor(name: string, token: string) {
        this.name = name;
        this.token = token;
        this.remainTime = 2;
    }

    async isExpired() {
        const res = await getPeriods(this.token);
        return !res.success;
    }
}
