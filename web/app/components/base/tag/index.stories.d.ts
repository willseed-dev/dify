import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ bordered, hideBg, }: {
    bordered?: boolean;
    hideBg?: boolean;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const Outlined: Story;
