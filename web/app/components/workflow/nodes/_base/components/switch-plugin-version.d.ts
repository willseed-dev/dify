import type { FC, ReactNode } from 'react';
export type SwitchPluginVersionProps = {
    uniqueIdentifier: string;
    tooltip?: ReactNode;
    onChange?: (version: string) => void;
    className?: string;
};
export declare const SwitchPluginVersion: FC<SwitchPluginVersionProps>;
