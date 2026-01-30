import type { FC } from 'react';
type VideoPreviewProps = {
    url: string;
    title: string;
    onCancel: () => void;
};
declare const VideoPreview: FC<VideoPreviewProps>;
export default VideoPreview;
