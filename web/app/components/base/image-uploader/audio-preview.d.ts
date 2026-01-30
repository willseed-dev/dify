import type { FC } from 'react';
type AudioPreviewProps = {
    url: string;
    title: string;
    onCancel: () => void;
};
declare const AudioPreview: FC<AudioPreviewProps>;
export default AudioPreview;
