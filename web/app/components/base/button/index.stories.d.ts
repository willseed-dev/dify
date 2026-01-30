import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<{
    ({ className, variant, size, destructive, loading, styleCss, children, spinnerClassName, ref, ...props }: import(".").ButtonProps): any;
    displayName: string;
}>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Secondary: Story;
export declare const SecondaryAccent: Story;
export declare const Ghost: Story;
export declare const GhostAccent: Story;
export declare const Tertiary: Story;
export declare const Warning: Story;
export declare const Disabled: Story;
export declare const Loading: Story;
export declare const WithIcon: Story;
