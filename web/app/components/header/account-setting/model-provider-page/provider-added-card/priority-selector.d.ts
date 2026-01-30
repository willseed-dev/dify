import type { FC } from 'react';
import { PreferredProviderTypeEnum } from '../declarations';
type SelectorProps = {
    value?: string;
    onSelect: (key: PreferredProviderTypeEnum) => void;
};
declare const Selector: FC<SelectorProps>;
export default Selector;
