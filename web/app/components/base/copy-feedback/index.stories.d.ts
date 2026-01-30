import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ content }: {
    content: string;
    className?: string;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
