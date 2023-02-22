import { SendReservationResponse } from '../api/sendReservation.js';
import { ReserveSuccessLog } from '../responseEntity/Log.js';
import { FailResponse, SuccessResponse } from '../responseEntity/Response.js';
import { Account } from './Account.js';
import { Session } from './Session.js';

export interface Result {
    session: Session;
    account: Account;
    rawResponse: SuccessResponse<SendReservationResponse> | FailResponse;
    sendTime: Date;
    reciveTime: Date;
}
