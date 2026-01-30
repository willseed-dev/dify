import type { Node } from 'reactflow';
import type { NodeOutPutVar } from '../../../types';
import type { ToolVarInputs } from '../../tool/types';
import type { CredentialFormSchema } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { PluginMeta } from '@/app/components/plugins/types';
export type Strategy = {
    agent_strategy_provider_name: string;
    agent_strategy_name: string;
    agent_strategy_label: string;
    agent_output_schema: Record<string, any>;
    plugin_unique_identifier: string;
    meta?: PluginMeta;
};
export type AgentStrategyProps = {
    strategy?: Strategy;
    onStrategyChange: (strategy?: Strategy) => void;
    formSchema: CredentialFormSchema[];
    formValue: ToolVarInputs;
    onFormValueChange: (value: ToolVarInputs) => void;
    nodeOutputVars?: NodeOutPutVar[];
    availableNodes?: Node[];
    nodeId?: string;
    canChooseMCPTool: boolean;
};
export declare const AgentStrategy: any;
