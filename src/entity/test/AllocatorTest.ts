import { exit } from 'process';
import { getPeriods } from '../../api/getPeriods.js';
import { getStadiums } from '../../api/getStadiums.js';
import { getToken } from '../../api/Utils.js';
import { Account } from '../Account.js';
import { Allocator } from '../Allocator.js';
import { PublicLogManager } from '../PublicLogManager.js';
import { Session } from '../Session.js';

const account = new Account('LG', getToken());
await PublicLogManager.initInstance(account);
const publicLogManager = PublicLogManager.getInstance() as PublicLogManager;

const period = {
    id: 5,
    sportType: 1,
    status: true,
    start: '19:00:00',
    end: '20:00:00',
    dateType: [true, true, true, true, true, true, true],
};
const stadiums = await getStadiums(account.token);
if (!stadiums.success) {
    exit(-1);
}
const splStadiums = stadiums.data.filter((stadium) => {
    return stadium.name.includes('三牌楼');
});
const sessions = splStadiums.map((stadium) => {
    return new Session(period, stadium);
});

const allocator = new Allocator(2, sessions);

await publicLogManager.update(period.id);
const currSession = await allocator.allocate();
console.log(currSession);
debugger;
