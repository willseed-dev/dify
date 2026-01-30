import type { FC } from 'react';
import type { ImageFile, VisionSettings } from '@/types/app';
type ChatImageUploaderProps = {
    settings: VisionSettings;
    onUpload: (imageFile: ImageFile) => void;
    disabled?: boolean;
};
declare const ChatImageUploader: FC<ChatImageUploaderProps>;
export default ChatImageUploader;
