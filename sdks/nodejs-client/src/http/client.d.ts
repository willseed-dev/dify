import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { DifyClientConfig, DifyResponse, Headers, QueryParams, RequestMethod } from "../types/common";
export type RequestOptions = {
    method: RequestMethod;
    path: string;
    query?: QueryParams;
    data?: unknown;
    headers?: Headers;
    responseType?: AxiosRequestConfig["responseType"];
};
export type HttpClientSettings = Required<Omit<DifyClientConfig, "apiKey">> & {
    apiKey: string;
};
export declare class HttpClient {
    private axios;
    private settings;
    constructor(config: DifyClientConfig);
    updateApiKey(apiKey: string): void;
    getSettings(): HttpClientSettings;
    request<T>(options: RequestOptions): Promise<DifyResponse<T>>;
    requestStream<T>(options: RequestOptions): Promise<import("../types/common").DifyStream<T>>;
    requestBinaryStream(options: RequestOptions): Promise<import("../types/common").BinaryStream>;
    requestRaw(options: RequestOptions): Promise<AxiosResponse>;
}
