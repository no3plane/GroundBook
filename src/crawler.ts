import { getGrounds, getPeriods } from './api.js'
import { getToken } from "./utils.js";
import fs from "fs";
import { GroundLog } from './entity/result.entity.js';

try {
    const path = 'C:\\Users\\Solstice\\Downloads\\records.csv';
    // const startDate = new Date(2022, 8, 1);
    const startDate = new Date();
    const endDate = new Date();
    const records = await fetchRecords(getToken(), startDate, endDate);
    await saveRecords(records, path);
} catch (e) {
    console.log(e);
}


async function fetchRecords(token: string, startDate: Date, endDate: Date): Promise<Array<GroundLog>> {
    let records = [];
    const periods = await getPeriods(token);
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        console.log(`正在处理：${currentDate}`)
        for (let period of periods) {
            const grounds = await getGrounds(token, currentDate, period.id);
            for (let ground of grounds) {
                if (!ground.log) {
                    continue;
                }
                records.push(ground.log);
            }
        }
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return records;
}

function saveRecords(records: Array<GroundLog>, path: string): void {
    let result = getCsvHead(records[0]) + '\n';
    const colNames = getCsvColNames(records[0]);
    for (let record of records) {
        result += getCsvRow(colNames, record) + '\n';
    }
    fs.writeFileSync(path, result);
}


function getCsvHead(obj: object): string {
    return Object.keys(obj).join(',') + ',';
}

function getCsvColNames(obj: object): string[] {
    return Object.keys(obj);
}

function getCsvRow(keys: Array<string>, obj: object) {
    let result = '';
    for (let key of keys) {
        if (obj[key] === undefined) {
            result += ',';
        } else {
            result += obj[key] + ',';
        }
    }
    return result;
}