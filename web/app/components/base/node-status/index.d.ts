import type { VariantProps } from 'class-variance-authority';
import type { CSSProperties } from 'react';
import * as React from 'react';
export declare enum NodeStatusEnum {
    warning = "warning",
    error = "error"
}
declare const nodeStatusVariants: any;
export type NodeStatusProps = {
    message?: string;
    styleCss?: CSSProperties;
    iconClassName?: string;
} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof nodeStatusVariants>;
declare const _default: any;
export default _default;
