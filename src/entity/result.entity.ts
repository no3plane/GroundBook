export interface ResponseData<T> {
    success: boolean;
    errMsg: string;
    data: T;
};

export interface Ground {
    id: number;
    name: string;
    type: number;
    log: GroundLog;
};

export interface GroundLog {
    id: number;
    sportType: number;
    stadiumId: number;
    date: number;
    periodId: number;
    status: number;
    createTime: string;
    updateTime: string;
}

export interface Period {
    id: number,
    sportType: number,
    status: boolean,
    start: string,
    end: string,
    dateType: Array<boolean>
}

export interface BookReq {
    periodId: number;
    date: string;
    stadiumId: number;
}

export interface getGroundReq {
    date: string;
    periodId: number;
}
