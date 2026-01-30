import type { StoryObj } from '@storybook/nextjs';
import type { FileEntity } from './types';
declare const meta: Meta<({ className, files, onReUpload, onRemove, showDeleteAction, showDownloadAction, canPreview, }: {
    className?: string;
    files: FileEntity[];
    onRemove?: (fileId: string) => void;
    onReUpload?: (fileId: string) => void;
    showDeleteAction?: boolean;
    showDownloadAction?: boolean;
    canPreview?: boolean;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const UploadStates: Story;
