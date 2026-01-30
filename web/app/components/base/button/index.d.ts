import type { VariantProps } from 'class-variance-authority';
import type { CSSProperties } from 'react';
import * as React from 'react';
declare const buttonVariants: any;
export type ButtonProps = {
    destructive?: boolean;
    loading?: boolean;
    styleCss?: CSSProperties;
    spinnerClassName?: string;
    ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
declare const Button: {
    ({ className, variant, size, destructive, loading, styleCss, children, spinnerClassName, ref, ...props }: ButtonProps): any;
    displayName: string;
};
export default Button;
export { Button, buttonVariants };
