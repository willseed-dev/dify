import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ initialPercentage, fill, stroke, }: {
    initialPercentage?: number;
    fill?: string;
    stroke?: string;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const BrandAccent: Story;
