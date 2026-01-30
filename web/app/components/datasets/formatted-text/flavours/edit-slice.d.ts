import type { OffsetOptions } from '@floating-ui/react';
import type { FC, ReactNode } from 'react';
import type { SliceProps } from './type';
type EditSliceProps = SliceProps<{
    label: ReactNode;
    onDelete: () => void;
    labelClassName?: string;
    labelInnerClassName?: string;
    contentClassName?: string;
    showDivider?: boolean;
    offsetOptions?: OffsetOptions;
}>;
export declare const EditSlice: FC<EditSliceProps>;
export {};
