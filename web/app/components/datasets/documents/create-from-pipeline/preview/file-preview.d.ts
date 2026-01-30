import type { CustomFile as File } from '@/models/datasets';
type FilePreviewProps = {
    file: File;
    hidePreview: () => void;
};
declare const FilePreview: ({ file, hidePreview, }: FilePreviewProps) => any;
export default FilePreview;
