import type { VariantProps } from 'class-variance-authority';
import type { CSSProperties, FC } from 'react';
declare const dividerVariants: any;
export type DividerProps = {
    className?: string;
    style?: CSSProperties;
} & VariantProps<typeof dividerVariants>;
declare const Divider: FC<DividerProps>;
export default Divider;
