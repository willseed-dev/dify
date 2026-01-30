import type { FC, ReactNode } from 'react';
import type { SliceProps } from './type';
type PreviewSliceProps = SliceProps<{
    label: ReactNode;
    tooltip: ReactNode;
    labelInnerClassName?: string;
    dividerClassName?: string;
}>;
export declare const PreviewSlice: FC<PreviewSliceProps>;
export {};
