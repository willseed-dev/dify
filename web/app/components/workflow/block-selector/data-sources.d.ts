import type { OnSelectBlock, ToolWithProvider } from '../types';
type AllToolsProps = {
    className?: string;
    toolContentClassName?: string;
    searchText: string;
    onSelect: OnSelectBlock;
    dataSources: ToolWithProvider[];
};
declare const DataSources: ({ className, toolContentClassName, searchText, onSelect, dataSources, }: AllToolsProps) => any;
export default DataSources;
