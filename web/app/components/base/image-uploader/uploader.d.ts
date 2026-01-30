import type { FC } from 'react';
import type { ImageFile } from '@/types/app';
type UploaderProps = {
    children: (hovering: boolean) => React.JSX.Element;
    onUpload: (imageFile: ImageFile) => void;
    closePopover?: () => void;
    limit?: number;
    disabled?: boolean;
};
declare const Uploader: FC<UploaderProps>;
export default Uploader;
