/**
 * 涉及到的API：
 *   /user/getPeriods/ 返回Period数组
 */
export interface Period {
    id: number;
    sportType: 1 | 2;
    status: boolean;
    start: string; // '20:00:00'
    end: string; // '21:00:00'
    dateType: boolean[];
}

export function checkPeriodOpen(period: Period, date: Date = new Date()) {
    return period.dateType[date.getDay()] === true;
}
