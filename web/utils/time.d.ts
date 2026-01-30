import type { ConfigType } from 'dayjs';
export declare const isAfter: (date: ConfigType, compare: ConfigType) => any;
export declare const formatTime: ({ date, dateFormat }: {
    date: ConfigType;
    dateFormat: string;
}) => any;
export declare const getDaysUntilEndOfMonth: (date?: ConfigType) => number;
