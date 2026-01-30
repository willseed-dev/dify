import type { FC, RefObject } from 'react';
import type { ToolWithProvider } from '../types';
export declare const CUSTOM_GROUP_NAME = "@@@custom@@@";
export declare const WORKFLOW_GROUP_NAME = "@@@workflow@@@";
export declare const DATA_SOURCE_GROUP_NAME = "@@@data_source@@@";
export declare const AGENT_GROUP_NAME = "@@@agent@@@";
export declare const groupItems: (items: ToolWithProvider[], getFirstChar: (item: ToolWithProvider) => string) => {
    letters: string[];
    groups: Record<string, Record<string, any[]>>;
};
type IndexBarProps = {
    letters: string[];
    itemRefs: RefObject<{
        [key: string]: HTMLElement | null;
    }>;
    className?: string;
};
declare const IndexBar: FC<IndexBarProps>;
export default IndexBar;
