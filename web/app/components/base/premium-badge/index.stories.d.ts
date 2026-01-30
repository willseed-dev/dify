import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ size, allowHover, }: {
    size?: "s" | "m";
    allowHover?: boolean;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const HoverEnabled: Story;
