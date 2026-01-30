import type { PropsWithChildren, ReactNode } from 'react';
export type SettingItemProps = PropsWithChildren<{
    label: string;
    status?: 'error' | 'warning';
    tooltip?: ReactNode;
}>;
export declare const SettingItem: any;
