import type { PropsWithChildren, ReactNode } from 'react';
type IChildrenProps = {
    children: React.ReactNode;
    [key: string]: any;
};
type CodeExample = {
    title?: string;
    tag?: string;
    code: string;
};
type CodeGroupProps = PropsWithChildren<{
    /** Code example(s) to display */
    targetCode?: string | CodeExample[];
    /** Example block title */
    title?: string;
    /** HTTP method tag, e.g. GET, POST */
    tag?: string;
    /** API path */
    label?: string;
}>;
export declare function CodeGroup({ children, title, targetCode, ...props }: CodeGroupProps): any;
type IChildProps = {
    children: ReactNode;
    [key: string]: any;
};
export declare function Code({ children, ...props }: IChildProps): any;
export declare function Pre({ children, ...props }: IChildrenProps): any;
export declare function Embed({ value, ...props }: IChildrenProps): any;
export {};
