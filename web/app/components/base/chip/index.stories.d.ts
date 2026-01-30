import type { StoryObj } from '@storybook/nextjs';
import type { Item } from '.';
declare const meta: Meta<FC<{
    className?: string;
    panelClassName?: string;
    showLeftIcon?: boolean;
    leftIcon?: any;
    value: number | string;
    items: Item[];
    onSelect: (item: any) => void;
    onClear: () => void;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const WithoutLeftIcon: Story;
