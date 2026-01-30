import type { FileEntity } from './types';
import type { FileUploadConfigResponse } from '@/models/common';
export declare const getFileType: (currentFile: File) => string;
type FileWithPath = {
    relativePath?: string;
} & File;
export declare const traverseFileEntry: (entry: any, prefix?: string) => Promise<FileWithPath[]>;
export declare const fileIsUploaded: (file: FileEntity) => true | undefined;
export declare const getFileUploadConfig: (fileUploadConfigResponse: FileUploadConfigResponse | undefined) => {
    imageFileSizeLimit: number;
    imageFileBatchLimit: number;
    singleChunkAttachmentLimit: number;
};
export {};
