import { Account } from '../Account.js';
import { PublicLogManager } from '../PublicLogManager.js';

(async () => {
    // 错误Token。getInstance创建。
    console.log('1');
    // const account1 = new Account('LG', '666');
    const account1 = new Account('ff', 'cd704a7f-e9f5-4e43-8798-accb6d23c871');
    // const plm1 = await PublicLogManager.getInstance(account1);
    const plm1 = new PublicLogManager(account1);
    if (plm1) {
        await plm1.update(2);
        const logs1 = plm1.getLogs();
        console.log(logs1);
    }

    // 正确Token。getInstance创建
    console.log('2');
    const account2 = new Account('ff', 'cd704a7f-e9f5-4e43-8798-accb6d23c871');
    const plm2 = await PublicLogManager.getInstance(account2);
    if (plm2) {
        await plm2.update(2);
        const logs2 = plm2.getLogs();
        console.log(logs2);
    }

    // 错误Token。new方式创建
    console.log('3');
    const account3 = new Account('gg', 'fjewo');
    const plm3 = new PublicLogManager(account3);
    if (plm3) {
        await plm3.update(2);
        const logs3 = plm3.getLogs();
        console.log(logs3);
    }

    console.log(plm1 === plm2);
    console.log(plm1 === plm3);
    console.log(plm2 === plm3);
})();
