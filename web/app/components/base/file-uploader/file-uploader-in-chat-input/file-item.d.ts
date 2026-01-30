import type { FileEntity } from '../types';
type FileItemProps = {
    file: FileEntity;
    showDeleteAction?: boolean;
    showDownloadAction?: boolean;
    canPreview?: boolean;
    onRemove?: (fileId: string) => void;
    onReUpload?: (fileId: string) => void;
};
declare const FileItem: ({ file, showDeleteAction, showDownloadAction, onRemove, onReUpload, canPreview, }: FileItemProps) => any;
export default FileItem;
