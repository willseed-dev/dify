import type { CommonNodeType, ValueSelector, Variable } from '@/app/components/workflow/types';
export declare enum Method {
    get = "get",
    post = "post",
    head = "head",
    patch = "patch",
    put = "put",
    delete = "delete"
}
export declare enum BodyType {
    none = "none",
    formData = "form-data",
    xWwwFormUrlencoded = "x-www-form-urlencoded",
    rawText = "raw-text",
    json = "json",
    binary = "binary"
}
export type KeyValue = {
    id?: string;
    key: string;
    value: string;
    type?: string;
    file?: ValueSelector;
};
export declare enum BodyPayloadValueType {
    text = "text",
    file = "file"
}
export type BodyPayload = {
    id?: string;
    key?: string;
    type: BodyPayloadValueType;
    file?: ValueSelector;
    value?: string;
}[];
export type Body = {
    type: BodyType;
    data: string | BodyPayload;
};
export declare enum AuthorizationType {
    none = "no-auth",
    apiKey = "api-key"
}
export declare enum APIType {
    basic = "basic",
    bearer = "bearer",
    custom = "custom"
}
export type Authorization = {
    type: AuthorizationType;
    config?: {
        type: APIType;
        api_key: string;
        header?: string;
    } | null;
};
export type Timeout = {
    connect?: number;
    read?: number;
    write?: number;
    max_connect_timeout?: number;
    max_read_timeout?: number;
    max_write_timeout?: number;
};
export type HttpNodeType = CommonNodeType & {
    variables: Variable[];
    method: Method;
    url: string;
    headers: string;
    params: string;
    body: Body;
    authorization: Authorization;
    timeout: Timeout;
    ssl_verify?: boolean;
};
