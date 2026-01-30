import type { FC } from 'react';
type IEmojiPickerInnerProps = {
    emoji?: string;
    background?: string;
    onSelect?: (emoji: string, background: string) => void;
    className?: string;
};
declare const EmojiPickerInner: FC<IEmojiPickerInnerProps>;
export default EmojiPickerInner;
