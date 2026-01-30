import type { FC } from 'react';
import type { ImageFile, VisionSettings } from '@/types/app';
type TextGenerationImageUploaderProps = {
    settings: VisionSettings;
    onFilesChange: (files: ImageFile[]) => void;
};
declare const TextGenerationImageUploader: FC<TextGenerationImageUploaderProps>;
export default TextGenerationImageUploader;
