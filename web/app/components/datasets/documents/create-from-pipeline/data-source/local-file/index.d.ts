export type LocalFileProps = {
    allowedExtensions: string[];
    supportBatchUpload?: boolean;
};
declare const LocalFile: ({ allowedExtensions, supportBatchUpload, }: LocalFileProps) => any;
export default LocalFile;
