import type { ToolWithProvider } from '../../types';
import type { Plugin } from '@/app/components/plugins/types';
import type { OnSelectBlock } from '@/app/components/workflow/types';
import { ViewType } from '../view-type-select';
type ListProps = {
    onSelect: OnSelectBlock;
    tools: ToolWithProvider[];
    viewType: ViewType;
    unInstalledPlugins: Plugin[];
    className?: string;
};
declare const List: ({ onSelect, tools, viewType, unInstalledPlugins, className, }: ListProps) => any;
export default List;
