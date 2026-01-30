import type { AppIconType } from '@/types/app';
import * as React from 'react';
export type AppIconProps = {
    size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large' | 'xl' | 'xxl';
    rounded?: boolean;
    iconType?: AppIconType | null;
    icon?: string;
    background?: string | null;
    imageUrl?: string | null;
    className?: string;
    innerIcon?: React.ReactNode;
    coverElement?: React.ReactNode;
    showEditIcon?: boolean;
    onClick?: () => void;
};
declare const _default: any;
export default _default;
