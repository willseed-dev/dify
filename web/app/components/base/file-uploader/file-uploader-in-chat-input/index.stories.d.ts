import type { StoryObj } from '@storybook/nextjs';
import type { FileEntity } from '../types';
import FileUploaderInChatInput from '.';
type ChatInputDemoProps = React.ComponentProps<typeof FileUploaderInChatInput> & {
    initialFiles?: FileEntity[];
};
declare const meta: Meta<({ initialFiles, ...props }: ChatInputDemoProps) => any>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Playground: Story;
export declare const RemoteOnly: Story;
