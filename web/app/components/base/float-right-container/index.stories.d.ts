import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ isMobile, children, isOpen, ...drawerProps }: any) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
