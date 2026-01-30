import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin';
/**
 * Corresponds to the `MenuRenderFn` type from `@lexical/react/LexicalTypeaheadMenuPlugin`.
 */
type MenuOptionRenderProps = {
    isSelected: boolean;
    onSelect: () => void;
    onSetHighlight: () => void;
    queryString: string | null;
};
export declare class PickerBlockMenuOption extends MenuOption {
    private data;
    group?: string;
    constructor(data: {
        key: string;
        group?: string;
        onSelect?: () => void;
        render: (menuRenderProps: MenuOptionRenderProps) => React.JSX.Element;
    });
    onSelectMenuOption: () => void | undefined;
    renderMenuOption: (menuRenderProps: MenuOptionRenderProps) => any;
}
export {};
