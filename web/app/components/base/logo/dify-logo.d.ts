import type { FC } from 'react';
export type LogoStyle = 'default' | 'monochromeWhite';
export declare const logoPathMap: Record<LogoStyle, string>;
export type LogoSize = 'large' | 'medium' | 'small';
export declare const logoSizeMap: Record<LogoSize, string>;
type DifyLogoProps = {
    style?: LogoStyle;
    size?: LogoSize;
    className?: string;
};
declare const DifyLogo: FC<DifyLogoProps>;
export default DifyLogo;
