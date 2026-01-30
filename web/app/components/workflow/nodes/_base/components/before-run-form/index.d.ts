import type { Props as FormProps } from './form';
import type { Emoji } from '@/app/components/tools/types';
import type { SpecialResultPanelProps } from '@/app/components/workflow/run/special-result-panel';
import type { BlockEnum, NodeRunningStatus } from '@/app/components/workflow/types';
export type BeforeRunFormProps = {
    nodeName: string;
    nodeType?: BlockEnum;
    toolIcon?: string | Emoji;
    onHide: () => void;
    onRun: (submitData: Record<string, any>) => void;
    onStop: () => void;
    runningStatus: NodeRunningStatus;
    forms: FormProps[];
    showSpecialResultPanel?: boolean;
    existVarValuesInForms: Record<string, any>[];
    filteredExistVarForms: FormProps[];
} & Partial<SpecialResultPanelProps>;
declare const _default: any;
export default _default;
