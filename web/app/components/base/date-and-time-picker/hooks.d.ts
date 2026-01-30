import { Period } from './types';
export declare const useDaysOfWeek: () => any[];
export declare const useMonths: () => any[];
export declare const useYearOptions: () => number[];
export declare const useTimeOptions: () => {
    hourOptions: string[];
    minuteOptions: string[];
    periodOptions: Period[];
};
