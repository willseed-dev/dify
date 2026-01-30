import type { VariantProps } from 'class-variance-authority';
import type { CSSProperties } from 'react';
import * as React from 'react';
export declare const inputVariants: any;
export type InputProps = {
    showLeftIcon?: boolean;
    showClearIcon?: boolean;
    showCopyIcon?: boolean;
    onClear?: () => void;
    disabled?: boolean;
    destructive?: boolean;
    wrapperClassName?: string;
    styleCss?: CSSProperties;
    unit?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & VariantProps<typeof inputVariants>;
declare const Input: any;
export default Input;
