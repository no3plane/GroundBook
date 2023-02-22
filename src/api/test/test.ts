import { FailResponse, SuccessResponse } from '../../responseEntity/Response.js';
import { getNotice } from '../getNotice.js';
import { getPeriods } from '../getPeriods.js';
import { getPersonalLog } from '../getPersonalLogs.js';
import { getPublicLogs } from '../getPublicLogs.js';
import { getStadiums } from '../getStadiums.js';
import { getToken } from '../Utils.js';

getPublicLogsTest();

function printResponse(res: SuccessResponse<any> | FailResponse) {
    if (res.success) {
        console.log(res.data);
    } else {
        console.log(res.errMsg);
    }
    debugger;
}

function getPublicLogsTest() {
    getPublicLogs(getToken(), new Date(), 2).then(printResponse);
}

function getPersonalLogTest() {
    getPersonalLog(getToken(), {
        containCanceled: false,
        desc: true,
        limit: 10,
        offset: 0,
    }).then(printResponse);
}

function getStadiumsTest() {
    getStadiums(getToken()).then(printResponse);
}

function getNoticeTest() {
    getNotice(getToken()).then(printResponse);
}

function getPeriodsTest() {
    getPeriods(getToken()).then(printResponse);
}
