import type { FC } from 'react';
export type AppIconEmojiSelection = {
    type: 'emoji';
    icon: string;
    background: string;
};
export type AppIconImageSelection = {
    type: 'image';
    fileId: string;
    url: string;
};
export type AppIconSelection = AppIconEmojiSelection | AppIconImageSelection;
type AppIconPickerProps = {
    onSelect?: (payload: AppIconSelection) => void;
    onClose?: () => void;
    className?: string;
};
declare const AppIconPicker: FC<AppIconPickerProps>;
export default AppIconPicker;
