/**
 * All supported Events that create a new history state.
 * Current limitations:
 * - InputChange events in Node Panels do not trigger state changes.
 * - Resizing UI elements does not trigger state changes.
 */
export declare const WorkflowHistoryEvent: {
    readonly NodeTitleChange: "NodeTitleChange";
    readonly NodeDescriptionChange: "NodeDescriptionChange";
    readonly NodeDragStop: "NodeDragStop";
    readonly NodeChange: "NodeChange";
    readonly NodeConnect: "NodeConnect";
    readonly NodePaste: "NodePaste";
    readonly NodeDelete: "NodeDelete";
    readonly EdgeDelete: "EdgeDelete";
    readonly EdgeDeleteByDeleteBranch: "EdgeDeleteByDeleteBranch";
    readonly NodeAdd: "NodeAdd";
    readonly NodeResize: "NodeResize";
    readonly NoteAdd: "NoteAdd";
    readonly NoteChange: "NoteChange";
    readonly NoteDelete: "NoteDelete";
    readonly LayoutOrganize: "LayoutOrganize";
};
export type WorkflowHistoryEventT = keyof typeof WorkflowHistoryEvent;
export declare const useWorkflowHistory: () => {
    store: any;
    saveStateToHistory: any;
    getHistoryLabel: any;
    undo: any;
    redo: any;
    onUndo: any;
    onRedo: any;
};
