export declare const useSerialAsyncCallback: <Args extends any[], Result = void>(fn: (...args: Args) => Promise<Result> | Result, shouldSkip?: () => boolean) => any;
