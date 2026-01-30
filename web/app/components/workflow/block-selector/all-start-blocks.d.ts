import type { BlockEnum } from '../types';
import type { TriggerDefaultValue } from './types';
type AllStartBlocksProps = {
    className?: string;
    searchText: string;
    onSelect: (type: BlockEnum, trigger?: TriggerDefaultValue) => void;
    availableBlocksTypes?: BlockEnum[];
    tags?: string[];
    allowUserInputSelection?: boolean;
};
declare const AllStartBlocks: ({ className, searchText, onSelect, availableBlocksTypes, tags, allowUserInputSelection, }: AllStartBlocksProps) => any;
export default AllStartBlocks;
