import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<FC<{
    type: string;
    className?: string;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Gallery: Story;
