import type { IOtherOptions } from './base';
export declare const ContentType: {
    json: string;
    stream: string;
    audio: string;
    form: string;
    download: string;
    downloadZip: string;
    upload: string;
};
export type FetchOptionType = Omit<RequestInit, 'body'> & {
    params?: Record<string, any>;
    body?: BodyInit | Record<string, any> | null;
};
export type ResponseError = {
    code: string;
    message: string;
    status: number;
};
export declare const getBaseOptions: () => RequestInit;
declare function base<T>(url: string, options?: FetchOptionType, otherOptions?: IOtherOptions): Promise<T>;
export { base };
