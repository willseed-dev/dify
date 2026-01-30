import type { CustomFile as File, FileItem } from '@/models/datasets';
type IFileUploaderProps = {
    fileList: FileItem[];
    titleClassName?: string;
    prepareFileList: (files: FileItem[]) => void;
    onFileUpdate: (fileItem: FileItem, progress: number, list: FileItem[]) => void;
    onFileListUpdate?: (files: FileItem[]) => void;
    onPreview: (file: File) => void;
    supportBatchUpload?: boolean;
};
declare const FileUploader: ({ fileList, titleClassName, prepareFileList, onFileUpdate, onFileListUpdate, onPreview, supportBatchUpload, }: IFileUploaderProps) => any;
export default FileUploader;
