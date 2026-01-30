import type { FC, PropsWithChildren, ReactNode } from 'react';
export type ToolTipContentProps = {
    title?: ReactNode;
    action?: ReactNode;
} & PropsWithChildren;
export declare const ToolTipContent: FC<ToolTipContentProps>;
