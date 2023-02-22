// 查询的自己的预约记录
// interface PriorLog {
interface PriorLog {
    id: number;
    openId: string;
    username: string;
    nickName: string;
    sportType: 1 | 2;
    stadiumId: number;
    date: string; // '2023-02-18'
    period: string; // '17:00-18:00'
    status: 1 | 2;
    createTime: string; // '2023-02-18 14:30:34'
    updateTime: string; // '2023-02-18 14:30:34'
}
