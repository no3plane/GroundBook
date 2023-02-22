import { sortBySpecifiedFieldOrder } from "../utils.js";

export default class Period {
    public id: number;
    public sportType: number;
    public status: boolean;
    public start: string;
    public end: string;
    public dateType: Array<boolean>;

    public static data: { id: number, name: string }[] = [
        { id: 21, name: '15:30-16:00' },
        { id: 22, name: '15:00-16:00' },
        { id: 2, name: '16:00-17:00' },
        { id: 3, name: '17:00-18:00' },
        { id: 4, name: '18:00-19:00' },
        { id: 5, name: '19:00-20:00' },
        { id: 6, name: '20:00-21:00' },
    ]

    public static getIdsFromNames(names: string[]) {
        return sortBySpecifiedFieldOrder(Period.data, 'name', names).map(item => item.id);
    }

    public static getReadableNameById(id: number) {
        const readableName = Period.data.find(item => item.id === id)?.name;
        if (!readableName) {
            console.debug('未知名称的时间段', this, Period.data);
            return '未知名称时间段';
        }
        return readableName;
    }

    public isClosed(date: Date = new Date()) {
        return this.dateType[date.getDay()] !== true;
    }

    public isOpen(date: Date = new Date()) {
        return this.dateType[date.getDay()] === true;
    }
}
