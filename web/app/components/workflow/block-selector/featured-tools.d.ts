import type { ToolWithProvider } from '../types';
import type { ToolDefaultValue, ToolValue } from './types';
import type { Plugin } from '@/app/components/plugins/types';
import { BlockEnum } from '../types';
type FeaturedToolsProps = {
    plugins: Plugin[];
    providerMap: Map<string, ToolWithProvider>;
    onSelect: (type: BlockEnum, tool: ToolDefaultValue) => void;
    selectedTools?: ToolValue[];
    canChooseMCPTool?: boolean;
    isLoading?: boolean;
    onInstallSuccess?: () => void;
};
declare const FeaturedTools: ({ plugins, providerMap, onSelect, selectedTools, canChooseMCPTool, isLoading, onInstallSuccess, }: FeaturedToolsProps) => any;
export default FeaturedTools;
