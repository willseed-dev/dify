import type { CustomFile as File } from '@/models/datasets';
type IProps = {
    file?: File;
    hidePreview: () => void;
};
declare const FilePreview: ({ file, hidePreview, }: IProps) => any;
export default FilePreview;
