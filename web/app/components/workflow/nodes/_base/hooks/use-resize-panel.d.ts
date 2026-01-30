export type UseResizePanelParams = {
    direction?: 'horizontal' | 'vertical' | 'both';
    triggerDirection?: 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    onResized?: (width: number, height: number) => void;
    onResize?: (width: number, height: number) => void;
};
export declare const useResizePanel: (params?: UseResizePanelParams) => {
    triggerRef: any;
    containerRef: any;
};
