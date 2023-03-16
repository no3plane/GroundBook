import { Period } from "../../responseEntity/Period";

const periods: Period[] = [
    {
        id: 22,
        sportType: 1,
        status: true,
        start: '15:00:00',
        end: '16:00:00',
        dateType: [true, false, false, false, false, false, true],
    },
    {
        id: 21,
        sportType: 1,
        status: true,
        start: '15:30:00',
        end: '16:00:00',
        dateType: [false, true, true, true, true, true, false],
    },
    {
        id: 2,
        sportType: 1,
        status: true,
        start: '16:00:00',
        end: '17:00:00',
        dateType: [true, true, true, true, true, true, true],
    },
    {
        id: 3,
        sportType: 1,
        status: true,
        start: '17:00:00',
        end: '18:00:00',
        dateType: [true, true, true, true, true, true, true],
    },
    {
        id: 4,
        sportType: 1,
        status: true,
        start: '18:00:00',
        end: '19:00:00',
        dateType: [true, true, true, true, true, true, true],
    },
    {
        id: 5,
        sportType: 1,
        status: true,
        start: '19:00:00',
        end: '20:00:00',
        dateType: [true, true, true, true, true, true, true],
    },
    {
        id: 6,
        sportType: 1,
        status: true,
        start: '20:00:00',
        end: '21:00:00',
        dateType: [true, true, true, true, true, true, true],
    },
];

export const prefered = [periods[2], periods[3], periods[4], periods[5]];
