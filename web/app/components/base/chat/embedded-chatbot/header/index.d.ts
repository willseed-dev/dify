import type { Theme } from '../theme/theme-context';
import * as React from 'react';
export type IHeaderProps = {
    isMobile?: boolean;
    allowResetChat?: boolean;
    customerIcon?: React.ReactNode;
    title: string;
    theme?: Theme;
    onCreateNewChat?: () => void;
};
declare const _default: any;
export default _default;
