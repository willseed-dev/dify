import type { ComponentProps, FC } from 'react';
export type SliceContainerProps = ComponentProps<'span'>;
export declare const SliceContainer: FC<SliceContainerProps>;
export type SliceLabelProps = ComponentProps<'span'> & {
    labelInnerClassName?: string;
};
export declare const SliceLabel: FC<SliceLabelProps>;
export type SliceContentProps = ComponentProps<'span'>;
export declare const SliceContent: FC<SliceContentProps>;
export type SliceDividerProps = ComponentProps<'span'>;
export declare const SliceDivider: FC<SliceDividerProps>;
