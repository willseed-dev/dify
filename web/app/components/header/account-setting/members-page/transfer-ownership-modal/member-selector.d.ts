import type { FC } from 'react';
type Props = {
    value?: any;
    onSelect: (value: any) => void;
    exclude?: string[];
};
declare const MemberSelector: FC<Props>;
export default MemberSelector;
