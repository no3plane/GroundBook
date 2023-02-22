import { getPublicLogs } from '../api/getPublicLogs.js';
import { PublicLog } from '../responseEntity/Log.js';
import { Account } from './Account.js';

/**
 * 此类为单例。
 * 只要使用getInstance创建成功过一次，之后无论用new还是getInstance方式创建，都会返回同一个单例。
 * 使用new方式创建成功，不会产生单例的效果。
 */
export class PublicLogManager {
    private logs: Map<number, PublicLog>; // key = periodId * 1000 + stadiumId
    private account: Account; // 用它的Token来发起请求获取Logs
    private static instance: PublicLogManager;

    constructor(account: Account) {
        this.logs = new Map();
        this.account = account;
        if (PublicLogManager.instance) {
            return PublicLogManager.instance;
        }
    }

    static async initInstance(account: Account) {
        if (await account.isExpired()) {
            return false;
        }
        PublicLogManager.instance = new PublicLogManager(account);
        return true;
    }

    static getInstance() {
        if (PublicLogManager.instance) {
            return PublicLogManager.instance;
        }
        return null;
    }

    async update(periodId: number) {
        const res = await getPublicLogs(this.account.token, new Date(), periodId);
        if (!res.success) {
            return;
        }
        for (const rawLog of res.data) {
            if (!rawLog.log) {
                continue;
            }
            const key = this.computeLogKey(rawLog.log.periodId, rawLog.log.stadiumId);
            if (this.logs.has(key)) {
                continue;
            }
            this.logs.set(key, rawLog.log);
        }
    }

    /**
     * 如果在检查 hasLog 之前不进行 update 的话，该类将会继续当前缓存进行检测判断
     */
    hasLog(periodId: number, stadiumId: number) {
        const key = this.computeLogKey(periodId, stadiumId);
        return this.logs.has(key);
    }

    private computeLogKey(periodId: number, stadiumId: number) {
        return periodId * 1000 + stadiumId;
    }

    getLogs(): PublicLog[] {
        return [...this.logs.values()];
    }
}
