import type { InputVar } from '@/models/pipeline';
type useFieldListProps = {
    initialInputFields: InputVar[];
    onInputFieldsChange: (value: InputVar[]) => void;
    nodeId: string;
    allVariableNames: string[];
};
export declare const useFieldList: ({ initialInputFields, onInputFieldsChange, nodeId, allVariableNames, }: useFieldListProps) => {
    inputFields: any;
    handleListSortChange: any;
    handleRemoveField: any;
    handleOpenInputFieldEditor: any;
    isShowRemoveVarConfirm: any;
    hideRemoveVarConfirm: any;
    onRemoveVarConfirm: any;
};
export {};
