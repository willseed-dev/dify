import type { FileEntity } from '../types';
import type { FileUpload } from '@/app/components/base/features/types';
type FileListProps = {
    className?: string;
    files: FileEntity[];
    onRemove?: (fileId: string) => void;
    onReUpload?: (fileId: string) => void;
    showDeleteAction?: boolean;
    showDownloadAction?: boolean;
    canPreview?: boolean;
};
export declare const FileList: ({ className, files, onReUpload, onRemove, showDeleteAction, showDownloadAction, canPreview, }: FileListProps) => any;
type FileListInChatInputProps = {
    fileConfig: FileUpload;
};
export declare const FileListInChatInput: ({ fileConfig, }: FileListInChatInputProps) => any;
export {};
