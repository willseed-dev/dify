type SearchBoxProps = {
    search: string;
    onSearchChange: (search: string) => void;
    wrapperClassName?: string;
    inputClassName?: string;
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
    supportAddCustomTool?: boolean;
    usedInMarketplace?: boolean;
    onShowAddCustomCollectionModal?: () => void;
    onAddedCustomTool?: () => void;
    autoFocus?: boolean;
};
declare const SearchBox: ({ search, onSearchChange, wrapperClassName, inputClassName, tags, onTagsChange, placeholder, usedInMarketplace, supportAddCustomTool, onShowAddCustomCollectionModal, autoFocus, }: SearchBoxProps) => any;
export default SearchBox;
