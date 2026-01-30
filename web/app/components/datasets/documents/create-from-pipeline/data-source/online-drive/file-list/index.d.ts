import type { OnlineDriveFile } from '@/models/pipeline';
type FileListProps = {
    fileList: OnlineDriveFile[];
    selectedFileIds: string[];
    breadcrumbs: string[];
    keywords: string;
    bucket: string;
    isInPipeline: boolean;
    resetKeywords: () => void;
    updateKeywords: (keywords: string) => void;
    searchResultsLength: number;
    handleSelectFile: (file: OnlineDriveFile) => void;
    handleOpenFolder: (file: OnlineDriveFile) => void;
    isLoading: boolean;
    supportBatchUpload: boolean;
};
declare const FileList: ({ fileList, selectedFileIds, breadcrumbs, keywords, bucket, resetKeywords, updateKeywords, searchResultsLength, handleSelectFile, handleOpenFolder, isInPipeline, isLoading, supportBatchUpload, }: FileListProps) => any;
export default FileList;
