import { sortBySpecifiedFieldOrder } from "../utils";

export default class Ground {
    public id: number;
    public name: string;
    public type: number;
    public log?: GroundLog;

    public static data: { id: number, name: string }[] = [
        { id: 1, name: '仙林1号' },
        { id: 2, name: '仙林2号' },
        { id: 3, name: '仙林3号' },
        { id: 4, name: '仙林4号' },
        { id: 5, name: '三牌楼1号' },
        { id: 6, name: '三牌楼2号' },
        { id: 7, name: '三牌楼3号' },
        { id: 8, name: '三牌楼4号' },
        { id: 13, name: '三牌楼5号' },
        { id: 14, name: '三牌楼6号' },
        { id: 15, name: '场地不可用' }
    ];

    public static getIdsFromNames(names: string[]) {
        return sortBySpecifiedFieldOrder(Ground.data, 'name', names).map(item => item.id);
    }

    public static getReadableNameById(id: number) {
        const readableName = Ground.data.find(item => item.id === id)?.name;
        if (!readableName) {
            console.debug('未知名称的时间段', this, Ground.data);
            return '未知名称时间段';
        }
        return readableName;
    }

    public isBookable() {
        return !this.log;
    }

    public isUserBooked() {
        return this?.log?.status === 1;
    }

    public isAdminBooked() {
        return this?.log?.status === 2;
    }

}

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