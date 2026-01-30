export declare const sleep: (ms: number) => Promise<void>;
export declare const getRetryDelayMs: (attempt: number, retryDelaySeconds: number, retryAfterSeconds?: number) => number;
export declare const shouldRetry: (error: unknown, attempt: number, maxRetries: number) => boolean;
