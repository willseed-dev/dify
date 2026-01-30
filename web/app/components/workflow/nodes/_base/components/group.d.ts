import type { ComponentProps, FC, PropsWithChildren, ReactNode } from 'react';
export type GroupLabelProps = ComponentProps<'div'>;
export declare const GroupLabel: FC<GroupLabelProps>;
export type GroupProps = PropsWithChildren<{
    label: ReactNode;
}>;
export declare const Group: FC<GroupProps>;
