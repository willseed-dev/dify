type DSLDragDropHookProps = {
    onDSLFileDropped: (file: File) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    enabled?: boolean;
};
export declare const useDSLDragDrop: ({ onDSLFileDropped, containerRef, enabled }: DSLDragDropHookProps) => {
    dragging: any;
};
export {};
