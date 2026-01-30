import type { ScheduleTriggerNodeType } from '../types';
export declare const getDefaultDateTime: () => Date;
export declare const getNextExecutionTimes: (data: ScheduleTriggerNodeType, count?: number) => Date[];
export declare const formatExecutionTime: (date: Date, timezone: string | undefined, includeWeekday?: boolean, includeTimezone?: boolean) => string;
export declare const getFormattedExecutionTimes: (data: ScheduleTriggerNodeType, count?: number) => string[];
export declare const getNextExecutionTime: (data: ScheduleTriggerNodeType) => string;
