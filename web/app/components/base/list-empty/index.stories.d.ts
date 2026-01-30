import type { Meta, StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ title, description, icon, }: {
    title?: string;
    description?: Meta;
    icon?: Meta;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithCustomIcon: Story;
