import type { StateCreator } from 'zustand';
import type { HelpLineHorizontalPosition, HelpLineVerticalPosition } from '@/app/components/workflow/help-line/types';
export type HelpLineSliceShape = {
    helpLineHorizontal?: HelpLineHorizontalPosition;
    setHelpLineHorizontal: (helpLineHorizontal?: HelpLineHorizontalPosition) => void;
    helpLineVertical?: HelpLineVerticalPosition;
    setHelpLineVertical: (helpLineVertical?: HelpLineVerticalPosition) => void;
};
export declare const createHelpLineSlice: StateCreator<HelpLineSliceShape>;
