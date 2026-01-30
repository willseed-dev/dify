import type { VariantProps } from 'class-variance-authority';
import type { CSSProperties } from 'react';
import * as React from 'react';
declare const textareaVariants: any;
export type TextareaProps = {
    value: string | number;
    disabled?: boolean;
    destructive?: boolean;
    styleCss?: CSSProperties;
    ref?: React.Ref<HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<typeof textareaVariants>;
declare const Textarea: any;
export default Textarea;
export { Textarea, textareaVariants };
