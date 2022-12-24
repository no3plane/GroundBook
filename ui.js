import Readline from "readline";
import {GroundStatus, PeriodStatus} from "./utils.js";

function selectPeriod(periods, date = new Date()) {
    for (let period of periods) {
        let note = PeriodStatus.read(period, date) === PeriodStatus.PERIOD_OPEN ? '' : '（时间段已关闭）';
        console.log(`id: %s\t period: %s - %s%s`,
            period.id,
            period.start.slice(0, -3),
            period.end.slice(0, -3),
            note
        );
    }
    return readLine('请输入要查询的时间段ID: ')
        .then(id => {
            for (let period of periods) {
                if (period.id === +id) {
                    if (PeriodStatus.read(period, date) === PeriodStatus.PERIOD_CLOSE) {
                        throw new Error('时间段已关闭');
                    }
                    return period;
                }
            }
            throw new Error(`不存在时间${id}`);
        });
}


function selectGround(grounds) {
    for (let ground of grounds) {
        let line = `id: ${ground.id}\t name: ${ground.name}`;
        const groundStatus = GroundStatus.read(ground);
        if (groundStatus === GroundStatus.ADMIN_BOOK) {
            line += '（已被管理员占用）';
        } else if (groundStatus === GroundStatus.USER_BOOK) {
            line += '（已被预约）';
        }
        console.log(line);
    }
    return readLine('请选择要预约的场地ID: ')
        .then(id => {
            for (let ground of grounds) {
                if (ground.id === +id) {
                    if (GroundStatus.read(ground) !== GroundStatus.BOOKABLE) {
                        throw new Error(`场地已被预约或被占用`);
                    }
                    return ground;
                }
            }
            throw new Error(`不存在场地${id}`);
        });
}

function readLine(message) {
    return new Promise(resolve => {
        const reader = Readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        reader.question(message, answer => {
            resolve(answer);
            reader.close();
        });
    });
}

export {selectGround};
export {selectPeriod};
export {readLine};
