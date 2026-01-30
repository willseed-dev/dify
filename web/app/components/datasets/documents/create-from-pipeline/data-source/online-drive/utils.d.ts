import type { OnlineDriveFile } from '@/models/pipeline';
import type { OnlineDriveData } from '@/types/pipeline';
export declare const isFile: (type: "file" | "folder") => boolean;
export declare const isBucketListInitiation: (data: OnlineDriveData[], prefix: string[], bucket: string) => boolean;
export declare const convertOnlineDriveData: (data: OnlineDriveData[], prefix: string[], bucket: string) => {
    fileList: OnlineDriveFile[];
    isTruncated: boolean;
    nextPageParameters: Record<string, any>;
    hasBucket: boolean;
};
