import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<FC<{
    emoji?: string;
    background?: string;
    onSelect?: (emoji: string, background: string) => void;
    className?: string;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
