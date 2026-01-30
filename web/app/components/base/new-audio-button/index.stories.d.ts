import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ id, voice, value, }: {
    id?: string;
    voice?: string;
    value?: string;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
