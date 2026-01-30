export type ConversationField = {
    id: string;
    value: any;
};
declare global {
    interface Window {
        zE?: (command: string, value: string, payload?: ConversationField[] | string | string[] | (() => any), callback?: () => any) => void;
    }
}
export declare const setZendeskConversationFields: (fields: ConversationField[], callback?: () => any) => void;
export declare const setZendeskWidgetVisibility: (visible: boolean) => void;
export declare const toggleZendeskWindow: (open: boolean) => void;
