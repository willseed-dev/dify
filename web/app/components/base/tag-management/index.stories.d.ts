import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ type, }: {
    type?: "app" | "knowledge";
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
