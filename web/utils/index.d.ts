export declare const sleep: (ms: number) => Promise<unknown>;
export declare function asyncRunSafe<T = any>(fn: Promise<T>): Promise<[Error] | [null, T]>;
export declare const getTextWidthWithCanvas: (text: string, font?: string) => number;
export declare function randomString(length: number): string;
export declare const getPurifyHref: (href: string) => any;
export declare function fetchWithRetry<T = any>(fn: Promise<T>, retries?: number): Promise<[Error] | [null, T]>;
export declare const correctModelProvider: (provider: string) => string;
export declare const correctToolProvider: (provider: string, toolInCollectionList?: boolean) => string;
export declare const canFindTool: (providerId: string, oldToolId?: string) => boolean;
