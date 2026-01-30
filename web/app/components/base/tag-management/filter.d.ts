import type { FC } from 'react';
type TagFilterProps = {
    type: 'knowledge' | 'app';
    value: string[];
    onChange: (v: string[]) => void;
};
declare const TagFilter: FC<TagFilterProps>;
export default TagFilter;
