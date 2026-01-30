import type { QueryOptions } from '@tanstack/react-query';
import type { StrategyPluginDetail } from '@/app/components/plugins/types';
export declare const useStrategyProviders: () => any;
export declare const useInvalidateStrategyProviders: () => () => void;
export declare const useStrategyProviderDetail: (agentProvider: string, options?: QueryOptions<StrategyPluginDetail>) => any;
export declare const useInvalidateStrategyProviderDetail: (agentProvider: string) => () => void;
