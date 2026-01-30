import type { ComponentProps } from 'react';
import Button from '@/app/components/base/button';
type InstallPluginButtonProps = Omit<ComponentProps<typeof Button>, 'children' | 'loading'> & {
    uniqueIdentifier: string;
    extraIdentifiers?: string[];
    onSuccess?: () => void;
};
export declare const InstallPluginButton: (props: InstallPluginButtonProps) => any;
export {};
