import type { FlowType } from '@/types/common';
type Params = {
    flowType: FlowType;
};
declare const useFLow: ({ flowType, }: Params) => {
    useInvalidateConversationVarValues: any;
    useInvalidateSysVarValues: any;
    useResetConversationVar: any;
    useResetToLastRunValue: any;
    useDeleteAllInspectorVars: any;
    useDeleteNodeInspectorVars: any;
    useDeleteInspectVar: any;
    useEditInspectorVar: any;
};
export default useFLow;
