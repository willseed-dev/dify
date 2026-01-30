import type { ReactNode } from 'react';
import type { ChunkStructureEnum } from '../../types';
import type { Option } from './type';
type SelectorProps = {
    options: Option[];
    value?: ChunkStructureEnum;
    onChange: (key: ChunkStructureEnum) => void;
    readonly?: boolean;
    trigger?: ReactNode;
};
declare const Selector: ({ options, value, onChange, readonly, trigger, }: SelectorProps) => any;
export default Selector;
