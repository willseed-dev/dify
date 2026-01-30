export type DifyErrorOptions = {
    statusCode?: number;
    responseBody?: unknown;
    requestId?: string;
    retryAfter?: number;
    cause?: unknown;
};
export declare class DifyError extends Error {
    statusCode?: number;
    responseBody?: unknown;
    requestId?: string;
    retryAfter?: number;
    constructor(message: string, options?: DifyErrorOptions);
}
export declare class APIError extends DifyError {
    constructor(message: string, options?: DifyErrorOptions);
}
export declare class AuthenticationError extends APIError {
    constructor(message: string, options?: DifyErrorOptions);
}
export declare class RateLimitError extends APIError {
    constructor(message: string, options?: DifyErrorOptions);
}
export declare class ValidationError extends APIError {
    constructor(message: string, options?: DifyErrorOptions);
}
export declare class NetworkError extends DifyError {
    constructor(message: string, options?: DifyErrorOptions);
}
export declare class TimeoutError extends DifyError {
    constructor(message: string, options?: DifyErrorOptions);
}
export declare class FileUploadError extends DifyError {
    constructor(message: string, options?: DifyErrorOptions);
}
