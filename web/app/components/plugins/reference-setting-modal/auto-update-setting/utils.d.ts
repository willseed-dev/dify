import type { Dayjs } from 'dayjs';
export declare const timeOfDayToDayjs: (timeOfDay: number) => Dayjs;
export declare const convertLocalSecondsToUTCDaySeconds: (secondsInDay: number, localTimezone: string) => number;
export declare const dayjsToTimeOfDay: (date?: Dayjs) => number;
export declare const convertUTCDaySecondsToLocalSeconds: (utcDaySeconds: number, localTimezone: string) => number;
