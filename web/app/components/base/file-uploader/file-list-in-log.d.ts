import type { FileEntity } from './types';
type Props = {
    fileList: {
        varName: string;
        list: FileEntity[];
    }[];
    isExpanded?: boolean;
    noBorder?: boolean;
    noPadding?: boolean;
};
declare const FileListInLog: ({ fileList, isExpanded, noBorder, noPadding }: Props) => any;
export default FileListInLog;
