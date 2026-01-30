import type { Headers } from "../types/common";
export type FormDataLike = {
    append: (...args: unknown[]) => void;
    getHeaders?: () => Headers;
    constructor?: {
        name?: string;
    };
};
export declare const isFormData: (value: unknown) => value is FormDataLike;
export declare const getFormDataHeaders: (form: FormDataLike) => Headers;
