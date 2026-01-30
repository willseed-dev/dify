type Image = {
    name: string;
    mimeType: string;
    sourceUrl: string;
    size: number;
    extension: string;
};
type ImageListProps = {
    images: Image[];
    size: 'sm' | 'md';
    limit?: number;
    className?: string;
};
declare const ImageList: ({ images, size, limit, className, }: ImageListProps) => any;
export default ImageList;
