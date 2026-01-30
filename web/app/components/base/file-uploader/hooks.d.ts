import type { FileUpload } from '@/app/components/base/features/types';
import type { FileUploadConfigResponse } from '@/models/common';
export declare const useFileSizeLimit: (fileUploadConfig?: FileUploadConfigResponse) => {
    imgSizeLimit: any;
    docSizeLimit: any;
    audioSizeLimit: any;
    videoSizeLimit: any;
    maxFileUploadLimit: any;
};
export declare const useFile: (fileConfig: FileUpload, noNeedToCheckEnable?: boolean) => {
    handleAddFile: any;
    handleUpdateFile: any;
    handleRemoveFile: any;
    handleReUploadFile: any;
    handleLoadFileFromLink: any;
    handleLoadFileFromLinkSuccess: any;
    handleLoadFileFromLinkError: any;
    handleClearFiles: any;
    handleLocalFileUpload: any;
    handleClipboardPasteFile: any;
    isDragActive: any;
    handleDragFileEnter: any;
    handleDragFileOver: any;
    handleDragFileLeave: any;
    handleDropFile: any;
};
