import type { TFunction } from 'i18next';
import type { FileEntity } from './types';
import type { FileResponse } from '@/types/workflow';
import { FileAppearanceTypeEnum } from './types';
/**
 * Get appropriate error message for file upload errors
 * @param error - The error object from upload failure
 * @param defaultMessage - Default error message to use if no specific error is matched
 * @param t - Translation function
 * @returns Localized error message
 */
export declare const getFileUploadErrorMessage: (error: any, defaultMessage: string, t: TFunction) => string;
type FileUploadResponse = {
    created_at: number;
    created_by: string;
    extension: string;
    id: string;
    mime_type: string;
    name: string;
    preview_url: string | null;
    size: number;
    source_url: string;
};
type FileUploadParams = {
    file: File;
    onProgressCallback: (progress: number) => void;
    onSuccessCallback: (res: FileUploadResponse) => void;
    onErrorCallback: (error?: any) => void;
};
type FileUpload = (v: FileUploadParams, isPublic?: boolean, url?: string) => void;
export declare const fileUpload: FileUpload;
export declare const getFileExtension: (fileName: string, fileMimetype: string, isRemote?: boolean) => string;
export declare const getFileAppearanceType: (fileName: string, fileMimetype: string) => FileAppearanceTypeEnum;
export declare const getSupportFileType: (fileName: string, fileMimetype: string, isCustom?: boolean) => any;
export declare const getProcessedFiles: (files: FileEntity[]) => {
    type: string;
    transfer_method: TransferMethod;
    url: string;
    upload_file_id: string;
}[];
export declare const getProcessedFilesFromResponse: (files: FileResponse[]) => {
    id: any;
    name: any;
    size: any;
    type: any;
    progress: number;
    transferMethod: any;
    supportFileType: any;
    uploadedId: any;
    url: any;
}[];
export declare const getFileNameFromUrl: (url: string) => string;
export declare const getSupportFileExtensionList: (allowFileTypes: string[], allowFileExtensions: string[]) => any[];
export declare const isAllowedFileExtension: (fileName: string, fileMimetype: string, allowFileTypes: string[], allowFileExtensions: string[]) => boolean;
export declare const getFilesInLogs: (rawData: any) => ({
    varName: string;
    list: {
        id: any;
        name: any;
        size: any;
        type: any;
        progress: number;
        transferMethod: any;
        supportFileType: any;
        uploadedId: any;
        url: any;
    }[];
} | undefined)[];
export declare const fileIsUploaded: (file: FileEntity) => true | undefined;
export declare const downloadFile: (url: string, filename: string) => void;
export {};
