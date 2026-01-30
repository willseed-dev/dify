import type { StoryObj } from '@storybook/nextjs';
import PromptLogModal from '.';
type PromptLogModalProps = React.ComponentProps<typeof PromptLogModal>;
declare const meta: Meta<(props: PromptLogModalProps) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
