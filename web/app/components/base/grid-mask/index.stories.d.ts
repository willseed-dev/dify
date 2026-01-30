import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<FC<{
    children: React.ReactNode;
    wrapperClassName?: string;
    canvasClassName?: string;
    gradientClassName?: string;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const CustomBackground: Story;
