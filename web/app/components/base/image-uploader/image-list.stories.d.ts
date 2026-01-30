import type { StoryObj } from '@storybook/nextjs';
import type { ImageFile } from '@/types/app';
declare const meta: Meta<FC<{
    list: ImageFile[];
    readonly?: boolean;
    onRemove?: (imageFileId: string) => void;
    onReUpload?: (imageFileId: string) => void;
    onImageLinkLoadSuccess?: (imageFileId: string) => void;
    onImageLinkLoadError?: (imageFileId: string) => void;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const ReadonlyList: Story;
