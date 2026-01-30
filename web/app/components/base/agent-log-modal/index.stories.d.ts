import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ width, }: {
    width?: number;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
