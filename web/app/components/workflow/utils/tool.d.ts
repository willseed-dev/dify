import type { ToolNodeType } from '../nodes/tool/types';
import type { InputVar, ToolWithProvider } from '../types';
import type { StructuredOutput } from '@/app/components/workflow/nodes/llm/types';
export declare const getToolCheckParams: (toolData: ToolNodeType, buildInTools: ToolWithProvider[], customTools: ToolWithProvider[], workflowTools: ToolWithProvider[], language: string) => {
    toolInputsSchema: InputVar[];
    notAuthed: boolean;
    toolSettingSchema: any;
    language: string;
};
export declare const CHUNK_TYPE_MAP: {
    general_chunks: string;
    parent_child_chunks: string;
    qa_chunks: string;
};
export declare const wrapStructuredVarItem: (outputItem: any, matchedSchemaType: string) => StructuredOutput;
