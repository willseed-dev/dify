export declare const INSERT_HISTORY_BLOCK_COMMAND: any;
export declare const DELETE_HISTORY_BLOCK_COMMAND: any;
export type RoleName = {
    user: string;
    assistant: string;
};
export type HistoryBlockProps = {
    roleName: RoleName;
    onEditRole: () => void;
    onInsert?: () => void;
    onDelete?: () => void;
};
declare const HistoryBlock: any;
export { HistoryBlock };
export { default as HistoryBlockReplacementBlock } from './history-block-replacement-block';
export { HistoryBlockNode } from './node';
