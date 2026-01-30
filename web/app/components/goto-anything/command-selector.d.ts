import type { FC } from 'react';
import type { ActionItem } from './actions/types';
type Props = {
    actions: Record<string, ActionItem>;
    onCommandSelect: (commandKey: string) => void;
    searchFilter?: string;
    commandValue?: string;
    onCommandValueChange?: (value: string) => void;
    originalQuery?: string;
};
declare const CommandSelector: FC<Props>;
export default CommandSelector;
