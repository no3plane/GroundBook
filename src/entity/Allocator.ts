import { Session, SessionStatus } from './Session.js';

export interface AllocatorResult {
    success: boolean;
    waittingCount: number;
    allocatedCount: number;
    bookingCount: number;
    bookedByMeCount: number;
    bookedByOthersCount: number;
}

export interface AllocatorSuccessResult extends AllocatorResult {
    success: true;
    session: Session;
}

export interface AllocatorFailResult extends AllocatorResult {
    success: false;
}

export class Allocator {
    private target: number;
    private preferred: Session[];

    constructor(target: number, preferred: Session[]) {
        this.target = target;
        this.preferred = preferred;
    }

    allocate() {
        let waittingCount = 0;
        let allocatedCount = 0;
        let bookingCount = 0;
        let bookedByMeCount = 0;
        let bookedByOthersCount = 0;
        const wattingSessions: Session[] = [];

        for (let i = 0; i < this.preferred.length; i++) {
            const session = this.preferred[i];
            switch (session.status) {
                case SessionStatus.waitting:
                    wattingSessions.push(session);
                    waittingCount++;
                    break;
                case SessionStatus.allocated:
                    allocatedCount++;
                    break;
                case SessionStatus.booking:
                    bookingCount++;
                    break;
                case SessionStatus.bookedByMe:
                    bookedByMeCount++;
                    break;
                case SessionStatus.bookedByOthers:
                    bookedByOthersCount++;
                    break;
                default:
                    break;
            }
        }

        if (waittingCount > 0 && bookedByMeCount + allocatedCount + bookingCount < this.target) {
            wattingSessions[0].status = SessionStatus.allocated;
            const result: AllocatorSuccessResult = {
                success: true,
                waittingCount,
                allocatedCount,
                bookingCount,
                bookedByMeCount,
                bookedByOthersCount,
                session: wattingSessions[0],
            };
            return result;
        }

        const result: AllocatorFailResult = {
            success: false,
            waittingCount,
            allocatedCount,
            bookingCount,
            bookedByMeCount,
            bookedByOthersCount,
        };
        return result;
    }
}
