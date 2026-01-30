import type { FC } from 'react';
import type { InputProps } from '../input';
export type InputNumberProps = {
    unit?: string;
    value?: number;
    onChange: (value: number) => void;
    amount?: number;
    size?: 'regular' | 'large';
    max?: number;
    min?: number;
    defaultValue?: number;
    disabled?: boolean;
    wrapClassName?: string;
    controlWrapClassName?: string;
    controlClassName?: string;
} & Omit<InputProps, 'value' | 'onChange' | 'size' | 'min' | 'max' | 'defaultValue'>;
export declare const InputNumber: FC<InputNumberProps>;
