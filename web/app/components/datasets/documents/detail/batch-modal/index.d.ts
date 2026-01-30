import type { ChunkingMode, FileItem } from '@/models/datasets';
export type IBatchModalProps = {
    isShow: boolean;
    docForm: ChunkingMode;
    onCancel: () => void;
    onConfirm: (file: FileItem) => void;
};
declare const _default: any;
export default _default;
