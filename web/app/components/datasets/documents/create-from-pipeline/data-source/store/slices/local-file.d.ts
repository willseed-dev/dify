import type { StateCreator } from 'zustand';
import type { DocumentItem, CustomFile as File, FileItem } from '@/models/datasets';
export type LocalFileSliceShape = {
    localFileList: FileItem[];
    setLocalFileList: (fileList: FileItem[]) => void;
    currentLocalFile: File | undefined;
    setCurrentLocalFile: (file: File | undefined) => void;
    previewLocalFileRef: React.RefObject<DocumentItem | undefined>;
};
export declare const createLocalFileSlice: StateCreator<LocalFileSliceShape>;
