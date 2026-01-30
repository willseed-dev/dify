import type { FileEntity } from '../types';
type FileImageItemProps = {
    file: FileEntity;
    showDeleteAction?: boolean;
    showDownloadAction?: boolean;
    canPreview?: boolean;
    onRemove?: (fileId: string) => void;
    onReUpload?: (fileId: string) => void;
};
declare const FileImageItem: ({ file, showDeleteAction, showDownloadAction, canPreview, onRemove, onReUpload, }: FileImageItemProps) => any;
export default FileImageItem;
