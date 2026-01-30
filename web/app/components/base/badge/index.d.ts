import type { VariantProps } from 'class-variance-authority';
import type { CSSProperties, ReactNode } from 'react';
import * as React from 'react';
import './index.css';
declare enum BadgeState {
    Warning = "warning",
    Accent = "accent",
    Default = ""
}
declare const BadgeVariants: any;
type BadgeProps = {
    size?: 's' | 'm' | 'l';
    iconOnly?: boolean;
    uppercase?: boolean;
    state?: BadgeState;
    styleCss?: CSSProperties;
    children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof BadgeVariants>;
declare const Badge: React.FC<BadgeProps>;
export default Badge;
export { Badge, BadgeState, BadgeVariants };
