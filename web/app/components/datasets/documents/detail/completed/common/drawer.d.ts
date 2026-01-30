import * as React from 'react';
type DrawerProps = {
    open: boolean;
    onClose: () => void;
    side?: 'right' | 'left' | 'bottom' | 'top';
    showOverlay?: boolean;
    modal?: boolean;
    closeOnOutsideClick?: boolean;
    panelClassName?: string;
    panelContentClassName?: string;
    needCheckChunks?: boolean;
};
declare const Drawer: ({ open, onClose, side, showOverlay, modal, needCheckChunks, children, panelClassName, panelContentClassName, }: React.PropsWithChildren<DrawerProps>) => any;
export default Drawer;
