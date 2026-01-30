import type { FC } from 'react';
import type { ImageFile } from '@/types/app';
type ImageLinkInputProps = {
    onUpload: (imageFile: ImageFile) => void;
    disabled?: boolean;
};
declare const ImageLinkInput: FC<ImageLinkInputProps>;
export default ImageLinkInput;
