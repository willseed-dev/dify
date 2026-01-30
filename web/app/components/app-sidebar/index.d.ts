import type { NavIcon } from './navLink';
import * as React from 'react';
export type IAppDetailNavProps = {
    iconType?: 'app' | 'dataset';
    navigation: Array<{
        name: string;
        href: string;
        icon: NavIcon;
        selectedIcon: NavIcon;
        disabled?: boolean;
    }>;
    extraInfo?: (modeState: string) => React.ReactNode;
};
declare const _default: any;
export default _default;
