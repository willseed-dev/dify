import type { TFunction } from 'i18next';
/**
 * Get appropriate error message for image upload errors
 * @param error - The error object from upload failure
 * @param defaultMessage - Default error message to use if no specific error is matched
 * @param t - Translation function
 * @returns Localized error message
 */
export declare const getImageUploadErrorMessage: (error: any, defaultMessage: string, t: TFunction) => string;
type ImageUploadParams = {
    file: File;
    onProgressCallback: (progress: number) => void;
    onSuccessCallback: (res: {
        id: string;
    }) => void;
    onErrorCallback: (error?: any) => void;
};
type ImageUpload = (v: ImageUploadParams, isPublic?: boolean, url?: string) => void;
export declare const imageUpload: ImageUpload;
export {};
