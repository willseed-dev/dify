import type { ComponentProps, FC, ReactNode } from 'react';
type OptionCardHeaderProps = {
    icon: ReactNode;
    title: ReactNode;
    description: string;
    isActive?: boolean;
    activeClassName?: string;
    effectImg?: string;
    disabled?: boolean;
};
export declare const OptionCardHeader: FC<OptionCardHeaderProps>;
type OptionCardProps = {
    icon: ReactNode;
    className?: string;
    activeHeaderClassName?: string;
    title: ReactNode;
    description: string;
    isActive?: boolean;
    actions?: ReactNode;
    effectImg?: string;
    onSwitched?: () => void;
    noHighlight?: boolean;
    disabled?: boolean;
} & Omit<ComponentProps<'div'>, 'title' | 'onClick'>;
export declare const OptionCard: FC<OptionCardProps>;
export {};
