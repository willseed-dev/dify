import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<React.FC<{
    label: string;
    className?: string;
    labelClassName?: string;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const OnCard: Story;
