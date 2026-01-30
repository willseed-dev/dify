import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ trigger, position, manualClose, disabled, }: {
    trigger?: "click" | "hover";
    position?: "bottom" | "bl" | "br";
    manualClose?: boolean;
    disabled?: boolean;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const HoverPopover: Story;
export declare const ClickPopover: Story;
export declare const DisabledState: Story;
