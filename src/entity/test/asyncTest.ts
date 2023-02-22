import { Session } from '../Session.js';
import { getPeriods } from '../../api/getPeriods.js';
import { getStadiums } from '../../api/getStadiums.js';
import { Account } from '../Account.js';
import { PublicLogManager } from '../PublicLogManager.js';
import { Allocator, AllocatorFailResult } from '../Allocator.js';
import { getToken } from '../../api/Utils.js';

(async function () {
    const account1 = new Account('a1', getToken());
    const account2 = new Account('a2', 'token2');
    const account3 = new Account('a3', 'token3');
    const validAccount = account1;
    const accounts = [account1, account2, account3];

    // GET Periods Stadiums
    // TODO 这里的结果应该经过优先级排序
    const periodsRes = await getPeriods(validAccount.token);
    const stadiumsRes = await getStadiums(validAccount.token);
    if (!periodsRes.success || !stadiumsRes.success) {
        return;
    }
    const periods = periodsRes.data;
    const stadiums = stadiumsRes.data.filter((stadium) => {
        return stadium.name.includes('三牌楼');
    });

    // UPDATE publicLogManager
    await PublicLogManager.initInstance(validAccount);
    const publicLogManager = PublicLogManager.getInstance();
    if (!publicLogManager) {
        return;
    }
    for (const period of periods) {
        await publicLogManager.update(period.id);
    }

    // CREATE the sessionAllocators
    const allocators = periods.map((period) => {
        const samePeriodSessions = stadiums.map((stadium) => {
            return new Session(period, stadium);
        });
        return new Allocator(2, samePeriodSessions);
    });

    // START async task
    for (const account of accounts) {
        run(account, allocators);
    }

    // THE ASYNC TASK
    // TODO 何时更新PublicLogManager一直没有想清楚
    async function run(account: Account, allocators: Allocator[]) {
        while (true) {
            const allocateFailResults: AllocatorFailResult[] = [];

            for (const allocator of allocators) {
                const allocateResult = allocator.allocate();
                if (allocateResult.success) {
                    const session = allocateResult.session;
                    const bookResult = await session.book(account);
                    console.log('完成一次预约尝试', bookResult);
                } else {
                    allocateFailResults.push(allocateResult);
                }
            }

            // IF accout invalid
            if (account.remainTime === 0) {
                return;
            }

            // IF has chance
            let stillHasChance = true;
            if (allocateFailResults.length === allocators.length) {
                // 表示拿不到 session
                let i = 0;
                for (i = 0; i < allocateFailResults.length; i++) {
                    const result = allocateFailResults[i];
                    if (result.allocatedCount + result.bookingCount > 0) {
                        break;
                    }
                }
                if (i === allocateFailResults.length) {
                    stillHasChance = false;
                }
            }

            // has no chance
            if (!stillHasChance) {
                return;
            }

            // has chance
            // TODO 为防止以外，当然也不能因为有可能就一直尝试，应设置一个MaxTry
            if (allocateFailResults.length === allocators.length) {
                // 拿不到 session，所有之后没有机会发送预约请求，只需要 sleep 50ms
                await sleep(50);
            } else {
                // 拿到 session，就说明之后发送了预约请求，需要 sleep 2000ms
                await sleep(2000);
            }
        }
    }
})();

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
