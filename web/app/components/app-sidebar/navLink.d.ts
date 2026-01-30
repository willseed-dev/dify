import type { RemixiconComponentType } from '@remixicon/react';
import * as React from 'react';
export type NavIcon = React.ComponentType<React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?: string | undefined;
    titleId?: string | undefined;
}> | RemixiconComponentType;
export type NavLinkProps = {
    name: string;
    href: string;
    iconMap: {
        selected: NavIcon;
        normal: NavIcon;
    };
    mode?: string;
    disabled?: boolean;
};
declare const _default: any;
export default _default;
