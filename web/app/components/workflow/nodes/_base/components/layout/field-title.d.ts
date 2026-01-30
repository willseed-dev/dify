import type { ReactNode } from 'react';
export type FieldTitleProps = {
    title?: string;
    operation?: ReactNode;
    subTitle?: string | ReactNode;
    tooltip?: string;
    showArrow?: boolean;
    disabled?: boolean;
    collapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
};
export declare const FieldTitle: any;
