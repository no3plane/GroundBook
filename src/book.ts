import * as Api from './api.js';
import { sleep, sortBySpecifiedFieldOrder } from "./utils.js";
import ResponseData from "./entity/ResponseData.js";
import Ground from "./entity/Ground.js";
import { getToken } from "./utils.js";

export default class Booker {

    private token: string;
    private periodRanking: number[];
    private groundRanking: number[];
    private onSuccess: (ground: Ground) => void;
    private onFail: (ground: Ground, responseData: ResponseData<any>) => void;
    private goal: number;
    private maxAttempts: number;

    constructor(config: {
        periodRanking: number[],
        groundRanking: number[],
        goal: number,
        onSuccess: (ground: Ground) => void,
        onFail: (ground: Ground, responseData: ResponseData<any>) => void
    }) {
        this.token = getToken();
        this.periodRanking = [...config.periodRanking];
        this.groundRanking = [...config.groundRanking];
        this.goal = config.goal;
        this.onSuccess = config.onSuccess;
        this.onFail = config.onFail;
        this.maxAttempts = this.goal * 3;
    }

    public async book() {
        let bookedCount = 0;
        for (let i = 0; (i < this.maxAttempts) && (bookedCount < this.goal); i++) {
            const bookableGround = await this.getBookableGround();
            if (!bookableGround) {
                continue;
            }

            const result = await Api.bookGround(this.token, {
                periodId: bookableGround.period.id,
                stadiumId: bookableGround.id,
                date: this.generateBookTimestamp(),
            });

            console.debug('一次预约请求：', {
                currentGround: bookableGround,
                result: result
            });

            if (result.success) {
                bookedCount++;
                this.removeBookedPeriod(result.data.log.periodId);
                this.onSuccess(result.data);
            } else {
                this.onFail(bookableGround, result);
            }

            await sleep(2000);
        }
    }

    private removeBookedPeriod(periodId: number) {
        this.periodRanking.splice(this.periodRanking.indexOf(periodId), 1);
    }

    private generateBookTimestamp() {
        const TIMESTAMP_OFFSET: number = 1;
        const timestamp = new Date();
        timestamp.setSeconds(timestamp.getSeconds() + TIMESTAMP_OFFSET); // 发送的时间戳延后一秒，防止“预约未开放”
        return timestamp;
    }

    private async getBookableGround(): Promise<Ground | null> {
        const allPeriods = (await Api.getPeriods(this.token)).data;
        const rankedPeriods = sortBySpecifiedFieldOrder(allPeriods, 'id', this.periodRanking)
            .filter(period => period.isOpen());

        for (const period of rankedPeriods) {
            const allGrounds = (await Api.getGrounds(this.token, period.id, new Date())).data;
            const rankedGrounds = sortBySpecifiedFieldOrder(allGrounds, 'id', this.groundRanking)
                .filter(ground => ground.isBookable());

            if (rankedGrounds.length !== 0) {
                return rankedGrounds[0];
            }
        }
        return null;
    }
}
