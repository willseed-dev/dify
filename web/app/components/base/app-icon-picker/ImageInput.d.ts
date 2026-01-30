import type { FC } from 'react';
import type { Area, CropperProps } from 'react-easy-crop';
export type OnImageInput = {
    (isCropped: true, tempUrl: string, croppedAreaPixels: Area, fileName: string): void;
    (isCropped: false, file: File): void;
};
type UploaderProps = {
    className?: string;
    cropShape?: CropperProps['cropShape'];
    onImageInput?: OnImageInput;
};
declare const ImageInput: FC<UploaderProps>;
export default ImageInput;
