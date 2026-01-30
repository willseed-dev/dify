import type { FC } from 'react';
type LabelFilterProps = {
    value: string[];
    onChange: (v: string[]) => void;
};
declare const LabelFilter: FC<LabelFilterProps>;
export default LabelFilter;
