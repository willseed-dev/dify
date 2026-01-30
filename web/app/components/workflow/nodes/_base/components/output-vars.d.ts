import type { FC } from 'react';
type VarItemProps = {
    name: string;
    type: string;
    description: string;
    subItems?: {
        name: string;
        type: string;
        description: string;
    }[];
    isIndent?: boolean;
};
export declare const VarItem: FC<VarItemProps>;
declare const _default: any;
export default _default;
