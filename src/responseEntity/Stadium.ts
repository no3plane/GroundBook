/**
 * 涉及到的API：
 *   /user/getStadiums/ 返回Stadium数组
 */
interface Stadium {
    id: number;
    name: string;
    sportType: 1 | 2;
    status: boolean;
    createTime: string; // '2021-07-06 18:17:01'
    updateTime: string; // '2021-07-23 23:57:21'
}
