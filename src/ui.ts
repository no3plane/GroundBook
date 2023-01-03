import Readline from "readline";
import Period from "./entity/Period.js";
import Ground from "./entity/Ground.js";

export function selectPeriod(periods: Array<Period>, date: Date = new Date()) {
    for (let period of periods) {
        let note = period.isOpen() ? '' : '（时间段已关闭）';
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
                    if (period.isClosed()) {
                        throw new Error('时间段已关闭');
                    }
                    return period;
                }
            }
            throw new Error(`不存在时间${id}`);
        });
}


export function selectGround(grounds: Array<Ground>) {
    for (let ground of grounds) {
        let line = `id: ${ground.id}\t name: ${ground.name}`;
        if (ground.isAdminBooked()) {
            line += '（已被管理员占用）';
        } else if (ground.isUserBooked()) {
            line += '（已被预约）';
        }
        console.log(line);
    }
    return readLine('请选择要预约的场地ID: ')
        .then(id => {
            for (let ground of grounds) {
                if (ground.id === +id) {
                    if (!ground.isBookable()) {
                        throw new Error(`场地已被预约或被占用`);
                    }
                    return ground;
                }
            }
            throw new Error(`不存在场地${id}`);
        });
}

export function readLine(message: string): Promise<string> {
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
