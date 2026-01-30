import type { CommonNodeType } from '../types';
export declare enum NoteTheme {
    blue = "blue",
    cyan = "cyan",
    green = "green",
    yellow = "yellow",
    pink = "pink",
    violet = "violet"
}
export type NoteNodeType = CommonNodeType & {
    text: string;
    theme: NoteTheme;
    author: string;
    showAuthor: boolean;
};
