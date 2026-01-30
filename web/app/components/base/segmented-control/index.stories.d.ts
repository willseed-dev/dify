import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ initialValue, size, padding, activeState, }: {
    initialValue?: string;
    size?: "regular" | "small" | "large";
    padding?: "none" | "with";
    activeState?: "default" | "accent" | "accentLight";
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const AccentState: Story;
