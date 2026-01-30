import type { OffsetOptions, Placement } from '@floating-ui/react';
import * as React from 'react';
export type PortalToFollowElemOptions = {
    placement?: Placement;
    open?: boolean;
    offset?: number | OffsetOptions;
    onOpenChange?: (open: boolean) => void;
    triggerPopupSameWidth?: boolean;
};
export declare function usePortalToFollowElem({ placement, open: controlledOpen, offset: offsetValue, onOpenChange: setControlledOpen, triggerPopupSameWidth, }?: PortalToFollowElemOptions): any;
export declare function usePortalToFollowElemContext(): any;
export declare function PortalToFollowElem({ children, ...options }: {
    children: React.ReactNode;
} & PortalToFollowElemOptions): any;
export declare const PortalToFollowElemTrigger: {
    ({ ref: propRef, children, asChild, ...props }: React.HTMLProps<HTMLElement> & {
        ref?: React.RefObject<HTMLElement | null>;
        asChild?: boolean;
    }): any;
    displayName: string;
};
export declare const PortalToFollowElemContent: {
    ({ ref: propRef, style, ...props }: React.HTMLProps<HTMLDivElement> & {
        ref?: React.RefObject<HTMLDivElement | null>;
    }): any;
    displayName: string;
};
