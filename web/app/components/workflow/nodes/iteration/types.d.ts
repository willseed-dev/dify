import type { BlockEnum, CommonNodeType, ErrorHandleMode, ValueSelector, VarType } from '@/app/components/workflow/types';
export type IterationNodeType = CommonNodeType & {
    startNodeType?: BlockEnum;
    start_node_id: string;
    iteration_id?: string;
    iterator_selector: ValueSelector;
    iterator_input_type: VarType;
    output_selector: ValueSelector;
    output_type: VarType;
    is_parallel: boolean;
    parallel_nums: number;
    error_handle_mode: ErrorHandleMode;
    flatten_output: boolean;
    _isShowTips: boolean;
};
