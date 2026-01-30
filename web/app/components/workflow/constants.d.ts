import type { Var } from './types';
import { BlockEnum, VarType } from './types';
export declare const MAX_ITERATION_PARALLEL_NUM = 10;
export declare const MIN_ITERATION_PARALLEL_NUM = 1;
export declare const DEFAULT_ITER_TIMES = 1;
export declare const DEFAULT_LOOP_TIMES = 1;
export declare const NODE_WIDTH = 240;
export declare const X_OFFSET = 60;
export declare const NODE_WIDTH_X_OFFSET: number;
export declare const Y_OFFSET = 39;
export declare const START_INITIAL_POSITION: {
    x: number;
    y: number;
};
export declare const AUTO_LAYOUT_OFFSET: {
    x: number;
    y: number;
};
export declare const ITERATION_NODE_Z_INDEX = 1;
export declare const ITERATION_CHILDREN_Z_INDEX = 1002;
export declare const ITERATION_PADDING: {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare const LOOP_NODE_Z_INDEX = 1;
export declare const LOOP_CHILDREN_Z_INDEX = 1002;
export declare const LOOP_PADDING: {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare const NODE_LAYOUT_HORIZONTAL_PADDING = 60;
export declare const NODE_LAYOUT_VERTICAL_PADDING = 60;
export declare const NODE_LAYOUT_MIN_DISTANCE = 100;
export declare const isInWorkflowPage: () => boolean;
export declare const getGlobalVars: (isChatMode: boolean) => Var[];
export declare const VAR_SHOW_NAME_MAP: Record<string, string>;
export declare const RETRIEVAL_OUTPUT_STRUCT = "{\n  \"content\": \"\",\n  \"title\": \"\",\n  \"url\": \"\",\n  \"icon\": \"\",\n  \"metadata\": {\n    \"dataset_id\": \"\",\n    \"dataset_name\": \"\",\n    \"document_id\": [],\n    \"document_name\": \"\",\n    \"document_data_source_type\": \"\",\n    \"segment_id\": \"\",\n    \"segment_position\": \"\",\n    \"segment_word_count\": \"\",\n    \"segment_hit_count\": \"\",\n    \"segment_index_node_hash\": \"\",\n    \"score\": \"\"\n  }\n}";
export declare const SUPPORT_OUTPUT_VARS_NODE: BlockEnum[];
export declare const AGENT_OUTPUT_STRUCT: Var[];
export declare const LLM_OUTPUT_STRUCT: Var[];
export declare const KNOWLEDGE_RETRIEVAL_OUTPUT_STRUCT: Var[];
export declare const TEMPLATE_TRANSFORM_OUTPUT_STRUCT: Var[];
export declare const QUESTION_CLASSIFIER_OUTPUT_STRUCT: {
    variable: string;
    type: VarType;
}[];
export declare const HTTP_REQUEST_OUTPUT_STRUCT: Var[];
export declare const TOOL_OUTPUT_STRUCT: Var[];
export declare const PARAMETER_EXTRACTOR_COMMON_STRUCT: Var[];
export declare const FILE_STRUCT: Var[];
export declare const DEFAULT_FILE_UPLOAD_SETTING: {
    allowed_file_upload_methods: string[];
    max_length: number;
    allowed_file_types: string[];
    allowed_file_extensions: never[];
};
export declare const WORKFLOW_DATA_UPDATE = "WORKFLOW_DATA_UPDATE";
export declare const CUSTOM_NODE = "custom";
export declare const CUSTOM_EDGE = "custom";
export declare const DSL_EXPORT_CHECK = "DSL_EXPORT_CHECK";
export declare const DEFAULT_RETRY_MAX = 3;
export declare const DEFAULT_RETRY_INTERVAL = 100;
