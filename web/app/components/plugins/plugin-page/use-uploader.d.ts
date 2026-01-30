import type { RefObject } from 'react';
type UploaderHookProps = {
    onFileChange: (file: File | null) => void;
    containerRef: RefObject<HTMLDivElement | null>;
    enabled?: boolean;
};
export declare const useUploader: ({ onFileChange, containerRef, enabled }: UploaderHookProps) => {
    dragging: any;
    fileUploader: any;
    fileChangeHandle: ((e: React.ChangeEvent<HTMLInputElement>) => void) | null;
    removeFile: (() => void) | null;
};
export {};
