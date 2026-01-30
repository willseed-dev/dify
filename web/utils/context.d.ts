import type { Context, Provider } from 'react';
type CreateCtxOptions<T> = {
    defaultValue?: T;
    name?: string;
};
type CreateCtxReturn<T> = [Provider<T>, () => T, Context<T>] & {
    context: Context<T>;
    provider: Provider<T>;
    useContextValue: () => T;
};
export declare const createCtx: <T>({ name, defaultValue }?: CreateCtxOptions<T>) => CreateCtxReturn<T>;
export declare const createSelectorCtx: <T>({ name, defaultValue }?: CreateCtxOptions<T>) => CreateCtxReturn<T>;
export {};
