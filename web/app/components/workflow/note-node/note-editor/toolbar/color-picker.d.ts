import { NoteTheme } from '../../types';
export declare const COLOR_LIST: {
    key: NoteTheme;
    inner: string;
    outer: string;
}[];
export type ColorPickerProps = {
    theme: NoteTheme;
    onThemeChange: (theme: NoteTheme) => void;
};
declare const _default: any;
export default _default;
