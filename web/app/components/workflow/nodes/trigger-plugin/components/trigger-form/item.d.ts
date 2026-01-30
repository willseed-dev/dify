import type { FC } from 'react';
import type { CredentialFormSchema } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { Event } from '@/app/components/tools/types';
import type { TriggerWithProvider } from '@/app/components/workflow/block-selector/types';
import type { PluginTriggerVarInputs } from '@/app/components/workflow/nodes/trigger-plugin/types';
type Props = {
    readOnly: boolean;
    nodeId: string;
    schema: CredentialFormSchema;
    value: PluginTriggerVarInputs;
    onChange: (value: PluginTriggerVarInputs) => void;
    inPanel?: boolean;
    currentEvent?: Event;
    currentProvider?: TriggerWithProvider;
    extraParams?: Record<string, any>;
    disableVariableInsertion?: boolean;
};
declare const TriggerFormItem: FC<Props>;
export default TriggerFormItem;
