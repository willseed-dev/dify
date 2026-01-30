type FileImageRenderProps = {
    imageUrl: string;
    className?: string;
    alt?: string;
    onLoad?: () => void;
    onError?: () => void;
    showDownloadAction?: boolean;
};
declare const FileImageRender: ({ imageUrl, className, alt, onLoad, onError, showDownloadAction, }: FileImageRenderProps) => any;
export default FileImageRender;
