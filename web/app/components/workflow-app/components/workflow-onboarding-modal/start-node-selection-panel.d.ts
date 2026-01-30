import type { FC } from 'react';
import type { PluginDefaultValue } from '@/app/components/workflow/block-selector/types';
import { BlockEnum } from '@/app/components/workflow/types';
type StartNodeSelectionPanelProps = {
    onSelectUserInput: () => void;
    onSelectTrigger: (nodeType: BlockEnum, toolConfig?: PluginDefaultValue) => void;
};
declare const StartNodeSelectionPanel: FC<StartNodeSelectionPanelProps>;
export default StartNodeSelectionPanel;
