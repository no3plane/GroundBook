type TybDate = string; // '2023-02-18'
type TybTime = string; // '2023-02-18 14:30:34'
type PeriodName = string; // '17:00-18:00'

export const enum SportType {
    badminton = 1,
    tennis = 2,
}

export const enum BookerRole {
    user = 1,
    admin = 2,
}

export interface PrivateLog {
    id: number;
    openId: string;
    username: string;
    nickName: string;
    sportType: SportType;
    stadiumId: number;
    date: TybDate;
    period: string;
    status: BookerRole;
    createTime: TybTime;
    updateTime: TybTime;
}

export interface PublicLog {
    id: number;
    sportType: SportType;
    stadiumId: number;
    date: TybDate;
    periodId: number;
    status: BookerRole;
    createTime: TybTime;
    updateTime: TybTime;
}

export interface ReserveSuccessLog {
    openId: string;
    username: string;
    nickName: string;
    sportType: SportType;
    stadiumId: number;
    date: TybDate;
    periodId: number;
    status: BookerRole;
}
