import type { Meta, StoryObj } from '@storybook/nextjs';
declare const meta: Meta<({ type, src, name, className, }: {
    type?: "page" | "workspace";
    name?: string | null;
    className?: string;
    src?: string | null | Meta["page_icon"];
}) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const WorkspaceIcon: Story;
export declare const WorkspaceInitials: Story;
export declare const PageEmoji: Story;
export declare const PageImage: Story;
export declare const DefaultIcon: Story;
