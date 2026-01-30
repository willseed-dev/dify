import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ compact, }: {
    compact?: boolean;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const Compact: Story;
