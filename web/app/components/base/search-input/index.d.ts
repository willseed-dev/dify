import type { FC } from 'react';
type SearchInputProps = {
    placeholder?: string;
    className?: string;
    value: string;
    onChange: (v: string) => void;
    white?: boolean;
};
declare const SearchInput: FC<SearchInputProps>;
export default SearchInput;
