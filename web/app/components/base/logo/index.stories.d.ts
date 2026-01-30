import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<FC<{
    style?: import("./dify-logo").LogoStyle;
    size?: import("./dify-logo").LogoSize;
    className?: string;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
