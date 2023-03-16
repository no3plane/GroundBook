import { Session } from '../Session.js';
import { Account } from '../Account.js';
import { PublicLogManager } from '../PublicLogManager.js';
import { Allocator } from '../Allocator.js';
import { getToken } from '../../api/Utils.js';
import { Period } from '../../responseEntity/Period.js';
import { prefered as thePreferedPeriods } from './periodsTest.js';
import { prefered as thePreferedStadiums } from './stadiumsTest.js';

const account1 = new Account('a1', getToken());
// const account2 = new Account('a2', 'hfoweihfjeow');
// const account3 = new Account('a3', 'gh430h04');
const accounts = [account1];

const preferedPeriods = thePreferedPeriods;
const preferedStadiums = thePreferedStadiums;

main(accounts, preferedPeriods, preferedStadiums);

async function main(accounts: Account[], preferedPeriods: Period[], preferedStadiums: Stadium[]) {
    // 筛出可用的 Account
    const validAccounts = await filterValidAccounts(accounts);
    if (validAccounts.length === 0) {
        sendMessage('err', '不存在有效的Token');
        return;
    }

    // 更新一便场次信息
    try {
        await updatePublicLogManager(validAccounts[0], preferedPeriods);
    } catch (error) {
        sendMessage('err', error);
        return;
    }

    // 创建分配器
    const allocators = preferedPeriods.map((period) => {
        const samePeriodSessions = preferedStadiums.map((stadium) => {
            return new Session(period, stadium);
        });
        return new Allocator(2, samePeriodSessions);
    });

    for (const account of accounts) {
        run(account, allocators);
    }
}
function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function filterValidAccounts(accounts: Account[]) {
    const validAccounts: Account[] = [];
    for (const account of accounts) {
        if (!(await account.isValid())) {
            sendMessage('accountInvalid', account);
            continue;
        }
        validAccounts.push(account);
    }
    return validAccounts;
}

async function updatePublicLogManager(account: Account, periods: Period[]) {
    await PublicLogManager.initInstance(account);
    const publicLogManager = PublicLogManager.getInstance();
    if (!publicLogManager) {
        throw '获取publicLogManager失败';
    }
    for (const period of periods) {
        if (!(await publicLogManager.update(period.id))) {
            throw '无法获取publicLog数据';
        }
    }
}

// THE ASYNC TASK
// TODO 何时更新PublicLogManager一直没有想清楚
async function run(account: Account, allocators: Allocator[]) {
    const MAX_TRY = 10;
    for (let i = 0; i < MAX_TRY; i++) {
        let hasSessionHandling = false;
        let allocateSuccess = false;

        for (const allocator of allocators) {
            const allocateResult = allocator.allocate();
            if (allocateResult.success) {
                allocateSuccess = true;
                sendMessage('allocatedSuccess', {
                    account: account,
                    session: allocateResult.session,
                });
                const bookResult = await allocateResult.session.book(account);
                if (bookResult) {
                    sendMessage('bookSuccess', {
                        account: account,
                        bookResult: bookResult,
                    });
                }
                break;
            } else {
                if (allocateResult.allocatedCount + allocateResult.bookingCount > 0) {
                    hasSessionHandling = true;
                }
            }
        }

        if (account.remainTime === 0) {
            sendMessage('hasNoRemainTime', account);
            return;
        }
        if (account.isConcurrencyLimited) {
            sendMessage('concurrencyLimited', account);
            return;
        }

        if (!allocateSuccess && !hasSessionHandling) {
            sendMessage('allSessionBooked', account);
            return;
        }

        // TODO 为防止以外，当然也不能因为有可能就一直尝试，应设置一个MaxTry
        if (!allocateSuccess && hasSessionHandling) {
            await sleep(50);
        }

        if (allocateSuccess) {
            PublicLogManager.getInstance()?.updateCacheds();
            await sleep(2000);
        }
    }
    sendMessage('FailTooManyTime', account);
}

async function sendMessage(type: string, message: any) {
    console.log(type, message);
}
