import * as React from 'react';
type IFullScreenDrawerProps = {
    isOpen: boolean;
    onClose?: () => void;
    fullScreen: boolean;
    showOverlay?: boolean;
    needCheckChunks?: boolean;
    modal?: boolean;
};
declare const FullScreenDrawer: ({ isOpen, onClose, fullScreen, children, showOverlay, needCheckChunks, modal, }: React.PropsWithChildren<IFullScreenDrawerProps>) => any;
export default FullScreenDrawer;
