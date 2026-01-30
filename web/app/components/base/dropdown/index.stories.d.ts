import type { Meta, StoryObj } from '@storybook/nextjs';
import type { Item } from '.';
declare const meta: Meta<FC<{
    items: Item[];
    secondItems?: Item[];
    onSelect: (item: Item) => void;
    renderTrigger?: (open: boolean) => React.ReactNode;
    triggerProps?: Meta;
    popupClassName?: string;
    itemClassName?: string;
    secondItemClassName?: string;
}>>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const CustomTrigger: Story;
