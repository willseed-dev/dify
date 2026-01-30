type SearchBoxProps = {
    searchQuery: string;
    onChange: (query: string) => void;
};
declare const SearchBox: React.FC<SearchBoxProps>;
export default SearchBox;
