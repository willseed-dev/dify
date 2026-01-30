import type { VarType as NumberVarType } from '../tool/types';
import type { BlockEnum, CommonNodeType, ErrorHandleMode, ValueSelector, ValueType, Var, VarType } from '@/app/components/workflow/types';
export declare enum LogicalOperator {
    and = "and",
    or = "or"
}
export declare enum ComparisonOperator {
    contains = "contains",
    notContains = "not contains",
    startWith = "start with",
    endWith = "end with",
    is = "is",
    isNot = "is not",
    empty = "empty",
    notEmpty = "not empty",
    equal = "=",
    notEqual = "\u2260",
    largerThan = ">",
    lessThan = "<",
    largerThanOrEqual = "\u2265",
    lessThanOrEqual = "\u2264",
    isNull = "is null",
    isNotNull = "is not null",
    in = "in",
    notIn = "not in",
    allOf = "all of",
    exists = "exists",
    notExists = "not exists"
}
export type Condition = {
    id: string;
    varType: VarType;
    variable_selector?: ValueSelector;
    key?: string;
    comparison_operator?: ComparisonOperator;
    value: string | string[] | boolean;
    numberVarType?: NumberVarType;
    sub_variable_condition?: CaseItem;
};
export type CaseItem = {
    logical_operator: LogicalOperator;
    conditions: Condition[];
};
export type HandleAddCondition = (valueSelector: ValueSelector, varItem: Var) => void;
export type HandleRemoveCondition = (conditionId: string) => void;
export type HandleUpdateCondition = (conditionId: string, newCondition: Condition) => void;
export type HandleUpdateConditionLogicalOperator = (value: LogicalOperator) => void;
export type HandleToggleConditionLogicalOperator = () => void;
export type HandleAddSubVariableCondition = (conditionId: string, key?: string) => void;
export type handleRemoveSubVariableCondition = (conditionId: string, subConditionId: string) => void;
export type HandleUpdateSubVariableCondition = (conditionId: string, subConditionId: string, newSubCondition: Condition) => void;
export type HandleToggleSubVariableConditionLogicalOperator = (conditionId: string) => void;
export type LoopVariable = {
    id: string;
    label: string;
    var_type: VarType;
    value_type: ValueType;
    value: any;
};
export type LoopNodeType = CommonNodeType & {
    startNodeType?: BlockEnum;
    start_node_id: string;
    loop_id?: string;
    logical_operator?: LogicalOperator;
    break_conditions?: Condition[];
    loop_count: number;
    error_handle_mode: ErrorHandleMode;
    loop_variables?: LoopVariable[];
};
export type HandleUpdateLoopVariable = (id: string, updateData: Partial<LoopVariable>) => void;
export type HandleRemoveLoopVariable = (id: string) => void;
export type LoopVariablesComponentShape = {
    nodeId: string;
    handleRemoveLoopVariable: HandleRemoveLoopVariable;
    handleUpdateLoopVariable: HandleUpdateLoopVariable;
};
