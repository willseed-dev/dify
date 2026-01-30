import type { FC } from 'react';
type LabelSelectorProps = {
    value: string[];
    onChange: (v: string[]) => void;
};
declare const LabelSelector: FC<LabelSelectorProps>;
export default LabelSelector;
