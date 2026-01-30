import type { FC } from 'react';
import type { ImageFile } from '@/types/app';
type ImageListProps = {
    list: ImageFile[];
    readonly?: boolean;
    onRemove?: (imageFileId: string) => void;
    onReUpload?: (imageFileId: string) => void;
    onImageLinkLoadSuccess?: (imageFileId: string) => void;
    onImageLinkLoadError?: (imageFileId: string) => void;
};
declare const ImageList: FC<ImageListProps>;
export default ImageList;
