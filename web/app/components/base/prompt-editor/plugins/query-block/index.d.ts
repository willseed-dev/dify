export declare const INSERT_QUERY_BLOCK_COMMAND: any;
export declare const DELETE_QUERY_BLOCK_COMMAND: any;
export type QueryBlockProps = {
    onInsert?: () => void;
    onDelete?: () => void;
};
declare const QueryBlock: any;
export { QueryBlock };
export { QueryBlockNode } from './node';
export { default as QueryBlockReplacementBlock } from './query-block-replacement-block';
