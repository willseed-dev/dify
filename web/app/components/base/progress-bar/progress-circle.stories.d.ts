import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ initialPercentage, size, }: {
    initialPercentage?: number;
    size?: number;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const NearComplete: Story;
