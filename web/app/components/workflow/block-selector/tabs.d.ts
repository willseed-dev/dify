import type { Dispatch, SetStateAction } from 'react';
import type { BlockEnum, NodeDefault, OnSelectBlock, ToolWithProvider } from '../types';
import { TabsEnum } from './types';
export type TabsProps = {
    activeTab: TabsEnum;
    onActiveTabChange: (activeTab: TabsEnum) => void;
    searchText: string;
    tags: string[];
    onTagsChange: Dispatch<SetStateAction<string[]>>;
    onSelect: OnSelectBlock;
    availableBlocksTypes?: BlockEnum[];
    blocks: NodeDefault[];
    dataSources?: ToolWithProvider[];
    tabs: Array<{
        key: TabsEnum;
        name: string;
        disabled?: boolean;
    }>;
    filterElem: React.ReactNode;
    noBlocks?: boolean;
    noTools?: boolean;
    forceShowStartContent?: boolean;
    allowStartNodeSelection?: boolean;
};
declare const _default: any;
export default _default;
