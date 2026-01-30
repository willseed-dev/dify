import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<FC<{
    isModal?: boolean;
    onSelect?: (emoji: string, background: string) => void;
    onClose?: () => void;
    className?: string;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
