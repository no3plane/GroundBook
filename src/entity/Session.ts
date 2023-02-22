import { sendReservation } from '../api/sendReservation.js';
import { Account } from './Account.js';
import { PublicLogManager } from './PublicLogManager.js';
import { Result } from './Result.js';

export const enum SessionStatus {
    waitting, // 未发送请求
    allocated, // 已经被器分配出去了
    booking, // 预约中
    bookedByMe, // 预约成功（终态）
    bookedByOthers, // 不可能预约成功（如已经被别人预约）（终态）
}

export class Session {
    period: Period;
    stadium: Stadium;
    bookResults: Result[];
    private _status: SessionStatus;

    constructor(period: Period, stadium: Stadium) {
        this.period = period;
        this.stadium = stadium;
        this.bookResults = [];
        this._status = SessionStatus.waitting;
    }

    get status() {
        if (
            this._status === SessionStatus.bookedByMe ||
            this._status === SessionStatus.bookedByOthers
        ) {
            return this._status;
        }
        if (this.checkOccupied()) {
            this.status = SessionStatus.bookedByOthers;
        }
        return this._status;
    }

    private checkOccupied() {
        const logManager = PublicLogManager.getInstance();
        if (!logManager) {
            throw '无法检查场次是否已经被别人预约';
        }
        return logManager.hasLog(this.period.id, this.stadium.id);
    }

    set status(newStatus: SessionStatus) {
        switch (this._status) {
            case SessionStatus.waitting:
            case SessionStatus.allocated:
            case SessionStatus.booking:
                this._status = newStatus;
                break;
            case SessionStatus.bookedByMe:
                return;
            case SessionStatus.bookedByOthers:
                return;
            default:
                break;
        }
        this._status = newStatus;
    }

    async book(account: Account) {
        // 发送前
        if (this.status !== SessionStatus.waitting && this.status !== SessionStatus.allocated) {
            return null;
        }
        this.status = SessionStatus.booking;

        // 发送时
        const sendTime = new Date();
        const res = await sendReservation(account.token, this.period.id, this.stadium.id);
        const reciveTime = new Date();

        // 发送后
        const record: Result = {
            account: account,
            rawResponse: res,
            sendTime: sendTime,
            reciveTime: reciveTime,
            session: this,
        };
        this.bookResults.push(record);

        // 成功
        if (res.success) {
            this.status = SessionStatus.bookedByMe;
            if (account.remainTime > 0) {
                account.remainTime--;
            }
            return record;
        }

        // 失败
        this.status = SessionStatus.waitting;
        switch (res.errMsg) {
            case '请重新进入以解限':
                // TODO 不记得这个信息对不对
                account.remainTime = 0;
                break;
        }
        return record;
    }

    getResults() {
        return [...this.bookResults];
    }

    getLastResult() {
        return this.bookResults[this.bookResults.length - 1];
    }
}
