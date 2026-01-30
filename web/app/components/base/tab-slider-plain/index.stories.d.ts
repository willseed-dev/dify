import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ initialValue, }: {
    initialValue?: string;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
