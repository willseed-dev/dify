import type { Dayjs } from 'dayjs';
import type { Day } from '../types';
import dayjs from 'dayjs';
export default dayjs;
export declare const cloneTime: (targetDate: Dayjs, sourceDate: Dayjs) => any;
export declare const getDaysInMonth: (currentDate: Dayjs) => Day[];
export declare const clearMonthMapCache: () => void;
export declare const getHourIn12Hour: (date: Dayjs) => any;
export declare const getDateWithTimezone: ({ date, timezone }: {
    date?: Dayjs;
    timezone?: string;
}) => any;
export declare const convertTimezoneToOffsetStr: (timezone?: string) => string;
export declare const isDayjsObject: (value: unknown) => value is Dayjs;
export type ToDayjsOptions = {
    timezone?: string;
    format?: string;
    formats?: string[];
};
export declare const toDayjs: (value: string | Dayjs | undefined, options?: ToDayjsOptions) => Dayjs | undefined;
export declare const parseDateWithFormat: (dateString: string, format?: string) => Dayjs | null;
export declare const formatDateForOutput: (date: Dayjs, includeTime?: boolean, _locale?: string) => string;
