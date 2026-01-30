import type { Meta, StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ className, titleClassName, bodyClassName, footerClassName, titleAs, title, children, footer, show, onClose, }: {
    className?: string;
    titleClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    titleAs?: Meta;
    title?: Meta;
    children: Meta;
    footer?: Meta;
    show: boolean;
    onClose?: () => void;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithoutFooter: Story;
export declare const CustomStyling: Story;
