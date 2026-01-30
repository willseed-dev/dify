import type { ScheduleTriggerNodeType } from './types';
export declare const getDefaultScheduleConfig: () => Partial<ScheduleTriggerNodeType>;
export declare const getDefaultVisualConfig: () => {
    time: string;
    weekdays: string[];
    on_minute: number;
    monthly_days: number[];
};
