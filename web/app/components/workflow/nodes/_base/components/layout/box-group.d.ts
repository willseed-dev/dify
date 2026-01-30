import type { ReactNode } from 'react';
import type { BoxProps, GroupProps } from '.';
export type BoxGroupProps = {
    children?: ReactNode;
    boxProps?: Omit<BoxProps, 'children'>;
    groupProps?: Omit<GroupProps, 'children'>;
};
export declare const BoxGroup: any;
