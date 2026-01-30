"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowHistory = exports.WorkflowHistoryEvent = void 0;
const compat_1 = require("es-toolkit/compat");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const reactflow_1 = require("reactflow");
const workflow_history_store_1 = require("../workflow-history-store");
/**
 * All supported Events that create a new history state.
 * Current limitations:
 * - InputChange events in Node Panels do not trigger state changes.
 * - Resizing UI elements does not trigger state changes.
 */
exports.WorkflowHistoryEvent = {
    NodeTitleChange: 'NodeTitleChange',
    NodeDescriptionChange: 'NodeDescriptionChange',
    NodeDragStop: 'NodeDragStop',
    NodeChange: 'NodeChange',
    NodeConnect: 'NodeConnect',
    NodePaste: 'NodePaste',
    NodeDelete: 'NodeDelete',
    EdgeDelete: 'EdgeDelete',
    EdgeDeleteByDeleteBranch: 'EdgeDeleteByDeleteBranch',
    NodeAdd: 'NodeAdd',
    NodeResize: 'NodeResize',
    NoteAdd: 'NoteAdd',
    NoteChange: 'NoteChange',
    NoteDelete: 'NoteDelete',
    LayoutOrganize: 'LayoutOrganize',
};
const useWorkflowHistory = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const { store: workflowHistoryStore } = (0, workflow_history_store_1.useWorkflowHistoryStore)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [undoCallbacks, setUndoCallbacks] = (0, react_1.useState)([]);
    const [redoCallbacks, setRedoCallbacks] = (0, react_1.useState)([]);
    const onUndo = (0, react_1.useCallback)((callback) => {
        setUndoCallbacks(prev => [...prev, callback]);
        return () => setUndoCallbacks(prev => prev.filter(cb => cb !== callback));
    }, []);
    const onRedo = (0, react_1.useCallback)((callback) => {
        setRedoCallbacks(prev => [...prev, callback]);
        return () => setRedoCallbacks(prev => prev.filter(cb => cb !== callback));
    }, []);
    const undo = (0, react_1.useCallback)(() => {
        workflowHistoryStore.temporal.getState().undo();
        undoCallbacks.forEach(callback => callback());
    }, [undoCallbacks, workflowHistoryStore.temporal]);
    const redo = (0, react_1.useCallback)(() => {
        workflowHistoryStore.temporal.getState().redo();
        redoCallbacks.forEach(callback => callback());
    }, [redoCallbacks, workflowHistoryStore.temporal]);
    // Some events may be triggered multiple times in a short period of time.
    // We debounce the history state update to avoid creating multiple history states
    // with minimal changes.
    const saveStateToHistoryRef = (0, react_1.useRef)((0, compat_1.debounce)((event, meta) => {
        workflowHistoryStore.setState({
            workflowHistoryEvent: event,
            workflowHistoryEventMeta: meta,
            nodes: store.getState().getNodes(),
            edges: store.getState().edges,
        });
    }, 500));
    const saveStateToHistory = (0, react_1.useCallback)((event, meta) => {
        switch (event) {
            case exports.WorkflowHistoryEvent.NoteChange:
                // Hint: Note change does not trigger when note text changes,
                // because the note editors have their own history states.
                saveStateToHistoryRef.current(event, meta);
                break;
            case exports.WorkflowHistoryEvent.NodeTitleChange:
            case exports.WorkflowHistoryEvent.NodeDescriptionChange:
            case exports.WorkflowHistoryEvent.NodeDragStop:
            case exports.WorkflowHistoryEvent.NodeChange:
            case exports.WorkflowHistoryEvent.NodeConnect:
            case exports.WorkflowHistoryEvent.NodePaste:
            case exports.WorkflowHistoryEvent.NodeDelete:
            case exports.WorkflowHistoryEvent.EdgeDelete:
            case exports.WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
            case exports.WorkflowHistoryEvent.NodeAdd:
            case exports.WorkflowHistoryEvent.NodeResize:
            case exports.WorkflowHistoryEvent.NoteAdd:
            case exports.WorkflowHistoryEvent.LayoutOrganize:
            case exports.WorkflowHistoryEvent.NoteDelete:
                saveStateToHistoryRef.current(event, meta);
                break;
            default:
                // We do not create a history state for every event.
                // Some events of reactflow may change things the user would not want to undo/redo.
                // For example: UI state changes like selecting a node.
                break;
        }
    }, []);
    const getHistoryLabel = (0, react_1.useCallback)((event) => {
        switch (event) {
            case exports.WorkflowHistoryEvent.NodeTitleChange:
                return t('changeHistory.nodeTitleChange', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NodeDescriptionChange:
                return t('changeHistory.nodeDescriptionChange', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.LayoutOrganize:
            case exports.WorkflowHistoryEvent.NodeDragStop:
                return t('changeHistory.nodeDragStop', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NodeChange:
                return t('changeHistory.nodeChange', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NodeConnect:
                return t('changeHistory.nodeConnect', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NodePaste:
                return t('changeHistory.nodePaste', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NodeDelete:
                return t('changeHistory.nodeDelete', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NodeAdd:
                return t('changeHistory.nodeAdd', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.EdgeDelete:
            case exports.WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
                return t('changeHistory.edgeDelete', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NodeResize:
                return t('changeHistory.nodeResize', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NoteAdd:
                return t('changeHistory.noteAdd', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NoteChange:
                return t('changeHistory.noteChange', { ns: 'workflow' });
            case exports.WorkflowHistoryEvent.NoteDelete:
                return t('changeHistory.noteDelete', { ns: 'workflow' });
            default:
                return 'Unknown Event';
        }
    }, [t]);
    return {
        store: workflowHistoryStore,
        saveStateToHistory,
        getHistoryLabel,
        undo,
        redo,
        onUndo,
        onRedo,
    };
};
exports.useWorkflowHistory = useWorkflowHistory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LWhpc3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctaGlzdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw4Q0FBNEM7QUFDNUMsaUNBSWM7QUFDZCxpREFBOEM7QUFDOUMseUNBRWtCO0FBQ2xCLHNFQUFtRTtBQUVuRTs7Ozs7R0FLRztBQUNVLFFBQUEsb0JBQW9CLEdBQUc7SUFDbEMsZUFBZSxFQUFFLGlCQUFpQjtJQUNsQyxxQkFBcUIsRUFBRSx1QkFBdUI7SUFDOUMsWUFBWSxFQUFFLGNBQWM7SUFDNUIsVUFBVSxFQUFFLFlBQVk7SUFDeEIsV0FBVyxFQUFFLGFBQWE7SUFDMUIsU0FBUyxFQUFFLFdBQVc7SUFDdEIsVUFBVSxFQUFFLFlBQVk7SUFDeEIsVUFBVSxFQUFFLFlBQVk7SUFDeEIsd0JBQXdCLEVBQUUsMEJBQTBCO0lBQ3BELE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLGNBQWMsRUFBRSxnQkFBZ0I7Q0FDeEIsQ0FBQTtBQUlILE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxFQUFFO0lBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBQzNCLE1BQU0sRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxJQUFBLGdEQUF1QixHQUFFLENBQUE7SUFDakUsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE1BQU0sQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQWlCLEVBQUUsQ0FBQyxDQUFBO0lBQ3RFLE1BQU0sQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQWlCLEVBQUUsQ0FBQyxD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QUFPLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1lBQzFEO2dCQUNFLE9BQU8sZUFBZSxDQUFBO1FBQzFCLENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRVAsT0FBTztRQUNMLEtBQUssRUFBRSxvQkFBb0I7UUFDM0Isa0JBQWtCO1FBQ2xCLGVBQWU7UUFDZixJQUFJO1FBQ0osSUFBSTtRQUNKLE1BQU07UUFDTixNQUFNO0tBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQW5IWSxRQUFBLGtCQUFrQixzQkFtSDlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBXb3JrZmxvd0hpc3RvcnlFdmVudE1ldGEgfSBmcm9tICcuLi93b3JrZmxvdy1oaXN0b3J5LXN0b3JlJ1xuaW1wb3J0IHsgZGVib3VuY2UgfSBmcm9tICdlcy10b29sa2l0L2NvbXBhdCdcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxuICB1c2VSZWYsXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7XG4gIHVzZVN0b3JlQXBpLFxufSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd0hpc3RvcnlTdG9yZSB9IGZyb20gJy4uL3dvcmtmbG93LWhpc3Rvcnktc3RvcmUnXG5cbi8qKlxuICogQWxsIHN1cHBvcnRlZCBFdmVudHMgdGhhdCBjcmVhdGUgYSBuZXcgaGlzdG9yeSBzdGF0ZS5cbiAqIEN1cnJlbnQgbGltaXRhdGlvbnM6XG4gKiAtIElucHV0Q2hhbmdlIGV2ZW50cyBpbiBOb2RlIFBhbmVscyBkbyBub3QgdHJpZ2dlciBzdGF0ZSBjaGFuZ2VzLlxuICogLSBSZXNpemluZyBVSSBlbGVtZW50cyBkb2VzIG5vdCB0cmlnZ2VyIHN0YXRlIGNoYW5nZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBXb3JrZmxvd0hpc3RvcnlFdmVudCA9IHtcbiAgTm9kZVRpdGxlQ2hhbmdlOiAnTm9kZVRpdGxlQ2hhbmdlJyxcbiAgTm9kZURlc2NyaXB0aW9uQ2hhbmdlOiAnTm9kZURlc2NyaXB0aW9uQ2hhbmdlJyxcbiAgTm9kZURyYWdTdG9wOiAnTm9kZURyYWdTdG9wJyxcbiAgTm9kZUNoYW5nZTogJ05vZGVDaGFuZ2UnLFxuICBOb2RlQ29ubmVjdDogJ05vZGVDb25uZWN0JyxcbiAgTm9kZVBhc3RlOiAnTm9kZVBhc3RlJyxcbiAgTm9kZURlbGV0ZTogJ05vZGVEZWxldGUnLFxuICBFZGdlRGVsZXRlOiAnRWRnZURlbGV0ZScsXG4gIEVkZ2VEZWxldGVCeURlbGV0ZUJyYW5jaDogJ0VkZ2VEZWxldGVCeURlbGV0ZUJyYW5jaCcsXG4gIE5vZGVBZGQ6ICdOb2RlQWRkJyxcbiAgTm9kZVJlc2l6ZTogJ05vZGVSZXNpemUnLFxuICBOb3RlQWRkOiAnTm90ZUFkZCcsXG4gIE5vdGVDaGFuZ2U6ICdOb3RlQ2hhbmdlJyxcbiAgTm90ZURlbGV0ZTogJ05vdGVEZWxldGUnLFxuICBMYXlvdXRPcmdhbml6ZTogJ0xheW91dE9yZ2FuaXplJyxcbn0gYXMgY29uc3RcblxuZXhwb3J0IHR5cGUgV29ya2Zsb3dIaXN0b3J5RXZlbnRUID0ga2V5b2YgdHlwZW9mIFdvcmtmbG93SGlzdG9yeUV2ZW50XG5cbmV4cG9ydCBjb25zdCB1c2VXb3JrZmxvd0hpc3RvcnkgPSAoKSA9PiB7XG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuICBjb25zdCB7IHN0b3JlOiB3b3JrZmxvd0hpc3RvcnlTdG9yZSB9ID0gdXNlV29ya2Zsb3dIaXN0b3J5U3RvcmUoKVxuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICBjb25zdCBbdW5kb0NhbGxiYWNrcywgc2V0VW5kb0NhbGxiYWNrc10gPSB1c2VTdGF0ZTwoKCkgPT4gdm9pZClbXT4oW10pXG4gIGNvbnN0IFtyZWRvQ2FsbGJhY2tzLCBzZXRSZWRvQ2FsbGJhY2tzXSA9IHVzZVN0YXRlPCgoKSA9PiB2b2lkKVtdPihbXSlcblxuICBjb25zdCBvblVuZG8gPSB1c2VDYWxsYmFjaygoY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHtcbiAgICBzZXRVbmRvQ2FsbGJhY2tzKHByZXYgPT4gWy4uLnByZXYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gKCkgPT4gc2V0VW5kb0NhbGxiYWNrcyhwcmV2ID0+IHByZXYuZmlsdGVyKGNiID0+IGNiICE9PSBjYWxsYmFjaykpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IG9uUmVkbyA9IHVzZUNhbGxiYWNrKChjYWxsYmFjazogKCkgPT4gdm9pZCkgPT4ge1xuICAgIHNldFJlZG9DYWxsYmFja3MocHJldiA9PiBbLi4ucHJldiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiAoKSA9PiBzZXRSZWRvQ2FsbGJhY2tzKHByZXYgPT4gcHJldi5maWx0ZXIoY2IgPT4gY2IgIT09IGNhbGxiYWNrKSlcbiAgfSwgW10pXG5cbiAgY29uc3QgdW5kbyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICB3b3JrZmxvd0hpc3RvcnlTdG9yZS50ZW1wb3JhbC5nZXRTdGF0ZSgpLnVuZG8oKVxuICAgIHVuZG9DYWxsYmFja3MuZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjaygpKVxuICB9LCBbdW5kb0NhbGxiYWNrcywgd29ya2Zsb3dIaXN0b3J5U3RvcmUudGVtcG9yYWxdKVxuXG4gIGNvbnN0IHJlZG8gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgd29ya2Zsb3dIaXN0b3J5U3RvcmUudGVtcG9yYWwuZ2V0U3RhdGUoKS5yZWRvKClcbiAgICByZWRvQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soKSlcbiAgfSwgW3JlZG9DYWxsYmFja3MsIHdvcmtmbG93SGlzdG9yeVN0b3JlLnRlbXBvcmFsXSlcblxuICAvLyBTb21lIGV2ZW50cyBtYXkgYmUgdHJpZ2dlcmVkIG11bHRpcGxlIHRpbWVzIGluIGEgc2hvcnQgcGVyaW9kIG9mIHRpbWUuXG4gIC8vIFdlIGRlYm91bmNlIHRoZSBoaXN0b3J5IHN0YXRlIHVwZGF0ZSB0byBhdm9pZCBjcmVhdGluZyBtdWx0aXBsZSBoaXN0b3J5IHN0YXRlc1xuICAvLyB3aXRoIG1pbmltYWwgY2hhbmdlcy5cbiAgY29uc3Qgc2F2ZVN0YXRlVG9IaXN0b3J5UmVmID0gdXNlUmVmKGRlYm91bmNlKChldmVudDogV29ya2Zsb3dIaXN0b3J5RXZlbnRULCBtZXRhPzogV29ya2Zsb3dIaXN0b3J5RXZlbnRNZXRhKSA9PiB7XG4gICAgd29ya2Zsb3dIaXN0b3J5U3RvcmUuc2V0U3RhdGUoe1xuICAgICAgd29ya2Zsb3dIaXN0b3J5RXZlbnQ6IGV2ZW50LFxuICAgICAgd29ya2Zsb3dIaXN0b3J5RXZlbnRNZXRhOiBtZXRhLFxuICAgICAgbm9kZXM6IHN0b3JlLmdldFN0YXRlKCkuZ2V0Tm9kZXMoKSxcbiAgICAgIGVkZ2VzOiBzdG9yZS5nZXRTdGF0ZSgpLmVkZ2VzLFxuICAgIH0pXG4gIH0sIDUwMCkpXG5cbiAgY29uc3Qgc2F2ZVN0YXRlVG9IaXN0b3J5ID0gdXNlQ2FsbGJhY2soKGV2ZW50OiBXb3JrZmxvd0hpc3RvcnlFdmVudFQsIG1ldGE/OiBXb3JrZmxvd0hpc3RvcnlFdmVudE1ldGEpID0+IHtcbiAgICBzd2l0Y2ggKGV2ZW50KSB7XG4gICAgICBjYXNlIFdvcmtmbG93SGlzdG9yeUV2ZW50Lk5vdGVDaGFuZ2U6XG4gICAgICAgIC8vIEhpbnQ6IE5vdGUgY2hhbmdlIGRvZXMgbm90IHRyaWdnZXIgd2hlbiBub3RlIHRleHQgY2hhbmdlcyxcbiAgICAgICAgLy8gYmVjYXVzZSB0aGUgbm90ZSBlZGl0b3JzIGhhdmUgdGhlaXIgb3duIGhpc3Rvcnkgc3RhdGVzLlxuICAgICAgICBzYXZlU3RhdGVUb0hpc3RvcnlSZWYuY3VycmVudChldmVudCwgbWV0YSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZVRpdGxlQ2hhbmdlOlxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlRGVzY3JpcHRpb25DaGFuZ2U6XG4gICAgICBjYXNlIFdvcmtmbG93SGlzdG9yeUV2ZW50Lk5vZGVEcmFnU3RvcDpcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZUNoYW5nZTpcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZUNvbm5lY3Q6XG4gICAgICBjYXNlIFdvcmtmbG93SGlzdG9yeUV2ZW50Lk5vZGVQYXN0ZTpcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZURlbGV0ZTpcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuRWRnZURlbGV0ZTpcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuRWRnZURlbGV0ZUJ5RGVsZXRlQnJhbmNoOlxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlQWRkOlxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlUmVzaXplOlxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob3RlQWRkOlxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5MYXlvdXRPcmdhbml6ZTpcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm90ZURlbGV0ZTpcbiAgICAgICAgc2F2ZVN0YXRlVG9IaXN0b3J5UmVmLmN1cnJlbnQoZXZlbnQsIG1ldGEpXG4gICAgICAgIGJyZWFrXG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBXZSBkbyBub3QgY3JlYXRlIGEgaGlzdG9yeSBzdGF0ZSBmb3IgZXZlcnkgZXZlbnQuXG4gICAgICAgIC8vIFNvbWUgZXZlbnRzIG9mIHJlYWN0ZmxvdyBtYXkgY2hhbmdlIHRoaW5ncyB0aGUgdXNlciB3b3VsZCBub3Qgd2FudCB0byB1bmRvL3JlZG8uXG4gICAgICAgIC8vIEZvciBleGFtcGxlOiBVSSBzdGF0ZSBjaGFuZ2VzIGxpa2Ugc2VsZWN0aW5nIGEgbm9kZS5cbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH0sIFtdKVxuXG4gIGNvbnN0IGdldEhpc3RvcnlMYWJlbCA9IHVzZUNhbGxiYWNrKChldmVudDogV29ya2Zsb3dIaXN0b3J5RXZlbnRUKSA9PiB7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlVGl0bGVDaGFuZ2U6XG4gICAgICAgIHJldHVybiB0KCdjaGFuZ2VIaXN0b3J5Lm5vZGVUaXRsZUNoYW5nZScsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZURlc2NyaXB0aW9uQ2hhbmdlOlxuICAgICAgICByZXR1cm4gdCgnY2hhbmdlSGlzdG9yeS5ub2RlRGVzY3JpcHRpb25DaGFuZ2UnLCB7IG5zOiAnd29ya2Zsb3cnIH0pXG4gICAgICBjYXNlIFdvcmtmbG93SGlzdG9yeUV2ZW50LkxheW91dE9yZ2FuaXplOlxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlRHJhZ1N0b3A6XG4gICAgICAgIHJldHVybiB0KCdjaGFuZ2VIaXN0b3J5Lm5vZGVEcmFnU3RvcCcsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZUNoYW5nZTpcbiAgICAgICAgcmV0dXJuIHQoJ2NoYW5nZUhpc3Rvcnkubm9kZUNoYW5nZScsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZUNvbm5lY3Q6XG4gICAgICAgIHJldHVybiB0KCdjaGFuZ2VIaXN0b3J5Lm5vZGVDb25uZWN0JywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlUGFzdGU6XG4gICAgICAgIHJldHVybiB0KCdjaGFuZ2VIaXN0b3J5Lm5vZGVQYXN0ZScsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZURlbGV0ZTpcbiAgICAgICAgcmV0dXJuIHQoJ2NoYW5nZUhpc3Rvcnkubm9kZURlbGV0ZScsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuTm9kZUFkZDpcbiAgICAgICAgcmV0dXJuIHQoJ2NoYW5nZUhpc3Rvcnkubm9kZUFkZCcsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuRWRnZURlbGV0ZTpcbiAgICAgIGNhc2UgV29ya2Zsb3dIaXN0b3J5RXZlbnQuRWRnZURlbGV0ZUJ5RGVsZXRlQnJhbmNoOlxuICAgICAgICByZXR1cm4gdCgnY2hhbmdlSGlzdG9yeS5lZGdlRGVsZXRlJywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob2RlUmVzaXplOlxuICAgICAgICByZXR1cm4gdCgnY2hhbmdlSGlzdG9yeS5ub2RlUmVzaXplJywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob3RlQWRkOlxuICAgICAgICByZXR1cm4gdCgnY2hhbmdlSGlzdG9yeS5ub3RlQWRkJywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob3RlQ2hhbmdlOlxuICAgICAgICByZXR1cm4gdCgnY2hhbmdlSGlzdG9yeS5ub3RlQ2hhbmdlJywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgY2FzZSBXb3JrZmxvd0hpc3RvcnlFdmVudC5Ob3RlRGVsZXRlOlxuICAgICAgICByZXR1cm4gdCgnY2hhbmdlSGlzdG9yeS5ub3RlRGVsZXRlJywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICdVbmtub3duIEV2ZW50J1xuICAgIH1cbiAgfSwgW3RdKVxuXG4gIHJldHVybiB7XG4gICAgc3RvcmU6IHdvcmtmbG93SGlzdG9yeVN0b3JlLFxuICAgIHNhdmVTdGF0ZVRvSGlzdG9yeSxcbiAgICBnZXRIaXN0b3J5TGFiZWwsXG4gICAgdW5kbyxcbiAgICByZWRvLFxuICAgIG9uVW5kbyxcbiAgICBvblJlZG8sXG4gIH1cbn1cbiJdfQ==