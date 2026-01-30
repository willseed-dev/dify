type TagsFilterProps = {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    usedInMarketplace?: boolean;
};
declare const TagsFilter: ({ tags, onTagsChange, usedInMarketplace, }: TagsFilterProps) => any;
export default TagsFilter;
