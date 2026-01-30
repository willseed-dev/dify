import type { FC } from 'react';
type ImagePreviewProps = {
    url: string;
    title: string;
    onCancel: () => void;
    onPrev?: () => void;
    onNext?: () => void;
};
declare const ImagePreview: FC<ImagePreviewProps>;
export default ImagePreview;
