import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ children, ...props }: {
    children: React.ReactNode;
} & Partial<import("./store").FeaturesState>) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
