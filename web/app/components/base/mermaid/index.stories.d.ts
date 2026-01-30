import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ theme, }: {
    theme?: "light" | "dark";
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
