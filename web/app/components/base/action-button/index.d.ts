import type { VariantProps } from 'class-variance-authority';
import type { CSSProperties } from 'react';
import * as React from 'react';
declare enum ActionButtonState {
    Destructive = "destructive",
    Active = "active",
    Disabled = "disabled",
    Default = "",
    Hover = "hover"
}
declare const actionButtonVariants: any;
export type ActionButtonProps = {
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    state?: ActionButtonState;
    styleCss?: CSSProperties;
    ref?: React.Ref<HTMLButtonElement>;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof actionButtonVariants>;
declare const ActionButton: {
    ({ className, size, state, styleCss, children, ref, ...props }: ActionButtonProps): any;
    displayName: string;
};
export default ActionButton;
export { ActionButton, ActionButtonState, actionButtonVariants };
