import type { OffsetOptions, Placement } from '@floating-ui/react';
import * as React from 'react';
export type TooltipProps = {
    position?: Placement;
    triggerMethod?: 'hover' | 'click';
    triggerClassName?: string;
    triggerTestId?: string;
    disabled?: boolean;
    popupContent?: React.ReactNode;
    children?: React.ReactNode;
    popupClassName?: string;
    portalContentClassName?: string;
    noDecoration?: boolean;
    offset?: OffsetOptions;
    needsDelay?: boolean;
    asChild?: boolean;
};
declare const _default: any;
export default _default;
