import type { VariantProps } from 'class-variance-authority';
import type { CSSProperties, ReactNode } from 'react';
import * as React from 'react';
import './index.css';
declare const PremiumBadgeVariants: any;
type PremiumBadgeProps = {
    size?: 's' | 'm' | 'custom';
    color?: 'blue' | 'indigo' | 'gray' | 'orange';
    allowHover?: boolean;
    styleCss?: CSSProperties;
    children?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof PremiumBadgeVariants>;
declare const PremiumBadge: React.FC<PremiumBadgeProps>;
export default PremiumBadge;
export { PremiumBadge, PremiumBadgeVariants };
