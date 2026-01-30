import type { RemixiconComponentType } from '@remixicon/react';
import type { VariantProps } from 'class-variance-authority';
import './index.css';
type SegmentedControlOption<T> = {
    value: T;
    text?: string;
    Icon?: RemixiconComponentType;
    count?: number;
    disabled?: boolean;
};
type SegmentedControlProps<T extends string | number | symbol> = {
    options: SegmentedControlOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
    activeClassName?: string;
    btnClassName?: string;
};
declare const SegmentedControlVariants: any;
declare const SegmentedControlItemVariants: any;
declare const ItemTextWrapperVariants: any;
export declare const SegmentedControl: <T extends string | number | symbol>({ options, value, onChange, className, size, padding, activeState, activeClassName, btnClassName, }: SegmentedControlProps<T> & VariantProps<typeof SegmentedControlVariants> & VariantProps<typeof SegmentedControlItemVariants> & VariantProps<typeof ItemTextWrapperVariants>) => any;
declare const _default: any;
export default _default;
