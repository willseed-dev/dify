export type FileEntity = {
    id: string;
    name: string;
    size: number;
    extension: string;
    mimeType: string;
    progress: number;
    originalFile?: File;
    uploadedId?: string;
    sourceUrl?: string;
    base64Url?: string;
};
export type FileUploadConfig = {
    imageFileSizeLimit: number;
    imageFileBatchLimit: number;
    singleChunkAttachmentLimit: number;
};
