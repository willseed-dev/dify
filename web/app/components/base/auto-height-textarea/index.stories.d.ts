import type { StoryObj } from '@storybook/nextjs';
declare const meta: Meta<{
    ({ ref: outerRef, value, onChange, placeholder, className, wrapperClassName, minHeight, maxHeight, autoFocus, controlFocus, onKeyDown, onKeyUp, }: {
        placeholder?: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        className?: string;
        wrapperClassName?: string;
        minHeight?: number;
        maxHeight?: number;
        autoFocus?: boolean;
        controlFocus?: number;
        onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
        onKeyUp?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    } & {
        ref?: React.RefObject<HTMLTextAreaElement>;
    }): any;
    displayName: string;
}>;
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithInitialValue: Story;
export declare const MultilineContent: Story;
export declare const CustomMinHeight: Story;
export declare const SmallMaxHeight: Story;
export declare const AutoFocus: Story;
export declare const CustomStyling: Story;
export declare const LongContent: Story;
export declare const ChatInput: Story;
export declare const CommentBox: Story;
export declare const Playground: Story;
