import type { FC } from 'react';
type IEmojiPickerProps = {
    isModal?: boolean;
    onSelect?: (emoji: string, background: string) => void;
    onClose?: () => void;
    className?: string;
};
declare const EmojiPicker: FC<IEmojiPickerProps>;
export default EmojiPicker;
