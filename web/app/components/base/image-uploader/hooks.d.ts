import type { ImageFile, VisionSettings } from '@/types/app';
export declare const useImageFiles: () => {
    files: any;
    onUpload: (imageFile: ImageFile) => void;
    onRemove: (imageFileId: string) => void;
    onImageLinkLoadError: (imageFileId: string) => void;
    onImageLinkLoadSuccess: (imageFileId: string) => void;
    onReUpload: (imageFileId: string) => void;
    onClear: () => void;
};
type useLocalUploaderProps = {
    disabled?: boolean;
    limit?: number;
    onUpload: (imageFile: ImageFile) => void;
};
export declare const useLocalFileUploader: ({ limit, disabled, onUpload }: useLocalUploaderProps) => {
    disabled: boolean;
    handleLocalFileUpload: any;
};
type useClipboardUploaderProps = {
    files: ImageFile[];
    visionConfig?: VisionSettings;
    onUpload: (imageFile: ImageFile) => void;
};
export declare const useClipboardUploader: ({ visionConfig, onUpload, files }: useClipboardUploaderProps) => {
    onPaste: any;
};
type useDraggableUploaderProps = {
    files: ImageFile[];
    visionConfig?: VisionSettings;
    onUpload: (imageFile: ImageFile) => void;
};
export declare const useDraggableUploader: <T extends HTMLElement>({ visionConfig, onUpload, files }: useDraggableUploaderProps) => {
    onDragEnter: any;
    onDragOver: any;
    onDragLeave: any;
    onDrop: any;
    isDragActive: any;
};
export {};
