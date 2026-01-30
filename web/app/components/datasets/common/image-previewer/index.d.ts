export type ImageInfo = {
    url: string;
    name: string;
    size: number;
};
type ImagePreviewerProps = {
    images: ImageInfo[];
    initialIndex?: number;
    onClose: () => void;
};
declare const ImagePreviewer: ({ images, initialIndex, onClose, }: ImagePreviewerProps) => any;
export default ImagePreviewer;
