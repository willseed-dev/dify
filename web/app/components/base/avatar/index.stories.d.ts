import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ name, avatar, size, className, textClassName, onError, }: import(".").AvatarProps) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithFallback: Story;
export declare const CustomSizes: Story;
