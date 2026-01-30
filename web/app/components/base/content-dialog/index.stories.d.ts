import type { Meta, StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ className, show, onClose, children, }: {
    className?: string;
    show: boolean;
    onClose?: () => void;
    children: Meta;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const NarrowPanel: Story;
