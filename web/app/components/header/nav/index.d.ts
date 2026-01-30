import type { INavSelectorProps } from './nav-selector';
import * as React from 'react';
type INavProps = {
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    text: string;
    activeSegment: string | string[];
    link: string;
    isApp: boolean;
} & INavSelectorProps;
declare const Nav: ({ icon, activeIcon, text, activeSegment, link, curNav, navigationItems, createText, onCreate, onLoadMore, isApp, }: INavProps) => any;
export default Nav;
