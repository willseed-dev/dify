import type { StoryObj } from '@storybook/nextjs';
import MessageLogModal from '.';
type MessageLogModalProps = React.ComponentProps<typeof MessageLogModal>;
declare const meta: Meta<(props: MessageLogModalProps) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const FixedPanel: Story;
export declare const FloatingPanel: Story;
