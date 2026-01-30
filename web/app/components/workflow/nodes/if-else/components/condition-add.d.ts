import type { HandleAddCondition } from '../types';
import type { NodeOutPutVar } from '@/app/components/workflow/types';
type ConditionAddProps = {
    className?: string;
    caseId: string;
    variables: NodeOutPutVar[];
    onSelectVariable: HandleAddCondition;
    disabled?: boolean;
};
declare const ConditionAdd: ({ className, caseId, variables, onSelectVariable, disabled, }: ConditionAddProps) => any;
export default ConditionAdd;
