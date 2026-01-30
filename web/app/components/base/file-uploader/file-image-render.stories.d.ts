import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ imageUrl, className, alt, onLoad, onError, showDownloadAction, }: {
    imageUrl: string;
    className?: string;
    alt?: string;
    onLoad?: () => void;
    onError?: () => void;
    showDownloadAction?: boolean;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
