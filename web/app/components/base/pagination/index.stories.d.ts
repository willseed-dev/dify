import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ initialPage, initialLimit, }: {
    initialPage?: number;
    initialLimit?: number;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const StartAtMiddle: Story;
