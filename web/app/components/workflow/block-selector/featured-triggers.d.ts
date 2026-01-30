import type { TriggerDefaultValue, TriggerWithProvider } from './types';
import type { Plugin } from '@/app/components/plugins/types';
import { BlockEnum } from '../types';
type FeaturedTriggersProps = {
    plugins: Plugin[];
    providerMap: Map<string, TriggerWithProvider>;
    onSelect: (type: BlockEnum, trigger?: TriggerDefaultValue) => void;
    isLoading?: boolean;
    onInstallSuccess?: () => void | Promise<void>;
};
declare const FeaturedTriggers: ({ plugins, providerMap, onSelect, isLoading, onInstallSuccess, }: FeaturedTriggersProps) => any;
export default FeaturedTriggers;
