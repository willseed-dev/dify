import type { StoryObj } from '@storybook/nextjs';
import type { AppIconSelection } from '.';
declare const meta: Meta<FC<{
    onSelect?: (payload: AppIconSelection) => void;
    onClose?: () => void;
    className?: string;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
