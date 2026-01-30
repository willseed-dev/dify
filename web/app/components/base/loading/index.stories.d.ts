import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ type }?: {
    type?: "area" | "app";
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const AreaSpinner: Story;
export declare const AppSpinner: Story;
