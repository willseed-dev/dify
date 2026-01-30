import type { FC } from 'react';
import { BlockEnum } from './types';
type BlockIconProps = {
    type: BlockEnum;
    size?: string;
    className?: string;
    toolIcon?: string | {
        content: string;
        background: string;
    };
};
export declare const VarBlockIcon: FC<BlockIconProps>;
declare const _default: any;
export default _default;
