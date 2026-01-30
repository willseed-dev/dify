import type { PropsWithChildren } from 'react';
type IChildrenProps = {
    children: React.ReactNode;
    id?: string;
    tag?: any;
    label?: any;
    anchor: boolean;
};
type IHeaderingProps = {
    url: string;
    method: 'PUT' | 'DELETE' | 'GET' | 'POST' | 'PATCH';
    title: string;
    name: string;
};
export declare const Heading: ({ url, method, title, name, }: IHeaderingProps) => any;
export declare function Row({ children }: IChildrenProps): any;
type IColProps = IChildrenProps & {
    sticky: boolean;
};
export declare function Col({ children, sticky }: IColProps): any;
export declare function Properties({ children }: IChildrenProps): any;
type IProperty = IChildrenProps & {
    name: string;
    type: string;
};
export declare function Property({ name, type, children }: IProperty): any;
type ISubProperty = IChildrenProps & {
    name: string;
    type: string;
};
export declare function SubProperty({ name, type, children }: ISubProperty): any;
export declare function PropertyInstruction({ children }: PropsWithChildren<{}>): any;
export {};
