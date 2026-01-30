import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ id, voice, value, className, isAudition, }: {
    id?: string;
    voice?: string;
    value?: string;
    className?: string;
    isAudition?: boolean;
    noCache?: boolean;
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
