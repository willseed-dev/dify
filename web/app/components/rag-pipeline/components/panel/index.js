"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamic_1 = require("next/dynamic");
const react_1 = require("react");
const panel_1 = require("@/app/components/workflow/panel");
const store_1 = require("@/app/components/workflow/store");
const Record = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/workflow/panel/record')), {
    ssr: false,
});
const TestRunPanel = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/rag-pipeline/components/panel/test-run')), {
    ssr: false,
});
const InputFieldPanel = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('./input-field')), {
    ssr: false,
});
const InputFieldEditorPanel = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('./input-field/editor')), {
    ssr: false,
});
const PreviewPanel = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('./input-field/preview')), {
    ssr: false,
});
const GlobalVariablePanel = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/workflow/panel/global-variable-panel')), {
    ssr: false,
});
const RagPipelinePanelOnRight = () => {
    const historyWorkflowData = (0, store_1.useStore)(s => s.historyWorkflowData);
    const showDebugAndPreviewPanel = (0, store_1.useStore)(s => s.showDebugAndPreviewPanel);
    const showGlobalVariablePanel = (0, store_1.useStore)(s => s.showGlobalVariablePanel);
    return (<>
      {historyWorkflowData && <Record />}
      {showDebugAndPreviewPanel && <TestRunPanel />}
      {showGlobalVariablePanel && <GlobalVariablePanel />}
    </>);
};
const RagPipelinePanelOnLeft = () => {
    const showInputFieldPanel = (0, store_1.useStore)(s => s.showInputFieldPanel);
    const showInputFieldPreviewPanel = (0, store_1.useStore)(s => s.showInputFieldPreviewPanel);
    const inputFieldEditPanelProps = (0, store_1.useStore)(s => s.inputFieldEditPanelProps);
    return (<>
      {showInputFieldPreviewPanel && <PreviewPanel />}
      {inputFieldEditPanelProps && (<InputFieldEditorPanel {...inputFieldEditPanelProps}/>)}
      {showInputFieldPanel && <InputFieldPanel />}
    </>);
};
const RagPipelinePanel = () => {
    const pipelineId = (0, store_1.useStore)(s => s.pipelineId);
    const versionHistoryPanelProps = (0, react_1.useMemo)(() => {
        return {
            getVersionListUrl: `/rag/pipelines/${pipelineId}/workflows`,
            deleteVersionUrl: (versionId) => `/rag/pipelines/${pipelineId}/workflows/${versionId}`,
            updateVersionUrl: (versionId) => `/rag/pipelines/${pipelineId}/workflows/${versionId}`,
            latestVersionId: '',
        };
    }, [pipelineId]);
    const panelProps = (0, react_1.useMemo)(() => {
        return {
            components: {
                left: <RagPipelinePanelOnLeft />,
                right: <RagPipelinePanelOnRight />,
            },
            versionHistoryPanelProps,
        };
    }, [versionHistoryPanelProps]);
    return (<panel_1.default {...panelProps}/>);
};
exports.default = (0, react_1.memo)(RagPipelinePanel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwwQ0FBa0M7QUFDbEMsaUNBR2M7QUFDZCwyREFBbUQ7QUFDbkQsMkRBQTBEO0FBRTFELE1BQU0sTUFBTSxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsd0NBQXdDLEVBQUMsRUFBRTtJQUM3RSxHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUNGLE1BQU0sWUFBWSxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEseURBQXlELEVBQUMsRUFBRTtJQUNwRyxHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUNGLE1BQU0sZUFBZSxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsZUFBZSxFQUFDLEVBQUU7SUFDN0QsR0FBRyxFQUFFLEtBQUs7Q0FDWCxDQUFDLENBQUE7QUFDRixNQUFNLHFCQUFxQixHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsc0JBQXNCLEVBQUMsRUFBRTtJQUMxRSxHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUNGLE1BQU0sWUFBWSxHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsdUJBQXVCLEVBQUMsRUFBRTtJQUNsRSxHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUNGLE1BQU0sbUJBQW1CLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSx1REFBdUQsRUFBQyxFQUFFO0lBQ3pHLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQyxDQUFBO0FBQ0YsTUFBTSx1QkFBdUIsR0FBRyxHQUFHLEVBQUU7SUFDbkMsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtJQUNoRSxNQUFNLHdCQUF3QixHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBQzFFLE1BQU0sdUJBQXVCLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLENBQUE7SUFFeEUsT0FBTyxDQUNMLEVBQ0U7TUFBQSxDQUFDLG1CQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEFBQUQsRUFBRyxDQUNsQztNQUFBLENBQUMsd0JBQXdCLElBQUksQ0FBQyxZQUFZLENBQUMsQUFBRCxFQUFHLENBQzdDO01BQUEsQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEFBQUQsRUFBRyxDQUNyRDtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxzQkFBc0IsR0FBRyxHQUFHLEVBQUU7SUFDbEMsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtJQUNoRSxNQUFNLDBCQUEwQixHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQzlFLE1BQU0sd0JBQXdCLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUE7SUFDMUUsT0FBTyxDQUNMLEVBQ0U7TUFBQSxDQUFDLDBCQUEwQixJQUFJLENBQUMsWUFBWSxDQUFDLEFBQUQsRUFBRyxDQUMvQztNQUFBLENBQUMsd0JBQXdCLElBQUksQ0FDM0IsQ0FBQyxxQkFBcUIsQ0FDcEIsSUFBSSx3QkFBd0IsQ0FBQyxFQUM3QixDQUNILENBQ0Q7TUFBQSxDQUFDLG1CQUFtQixJQUFJLENBQUMsZUFBZSxDQUFDLEFBQUQsRUFBRyxDQUM3QztJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUU7SUFDNUIsTUFBTSxVQUFVLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQzlDLE1BQU0sd0JBQXdCLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQzVDLE9BQU87WUFDTCxpQkFBaUIsRUFBRSxrQkFBa0IsVUFBVSxZQUFZO1lBQzNELGdCQUFnQixFQUFFLENBQUMsU0FBaUIsRUFBRSxFQUFFLENBQUMsa0JBQWtCLFVBQVUsY0FBYyxTQUFTLEVBQUU7WUFDOUYsZ0JBQWdCLEVBQUUsQ0FBQyxTQUFpQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsVUFBVSxjQUFjLFNBQVMsRUFBRTtZQUM5RixlQUFlLEVBQUUsRUFBRTtTQUNwQixDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtJQUVoQixNQUFNLFVBQVUsR0FBZSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDMUMsT0FBTztZQUNMLFVBQVUsRUFBRTtnQkFDVixJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxBQUFELEVBQUc7Z0JBQ2hDLEtBQUssRUFBRSxDQUFDLHVCQUF1QixDQUFDLEFBQUQsRUFBRzthQUNuQztZQUNELHdCQUF3QjtTQUN6QixDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFBO0lBRTlCLE9BQU8sQ0FDTCxDQUFDLGVBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxFQUFHLENBQzFCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxJQUFBLFlBQUksRUFBQyxnQkFBZ0IsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQYW5lbFByb3BzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9wYW5lbCdcbmltcG9ydCBkeW5hbWljIGZyb20gJ25leHQvZHluYW1pYydcbmltcG9ydCB7XG4gIG1lbW8sXG4gIHVzZU1lbW8sXG59IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFBhbmVsIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcGFuZWwnXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5cbmNvbnN0IFJlY29yZCA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3BhbmVsL3JlY29yZCcpLCB7XG4gIHNzcjogZmFsc2UsXG59KVxuY29uc3QgVGVzdFJ1blBhbmVsID0gZHluYW1pYygoKSA9PiBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvcmFnLXBpcGVsaW5lL2NvbXBvbmVudHMvcGFuZWwvdGVzdC1ydW4nKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IElucHV0RmllbGRQYW5lbCA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCcuL2lucHV0LWZpZWxkJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5jb25zdCBJbnB1dEZpZWxkRWRpdG9yUGFuZWwgPSBkeW5hbWljKCgpID0+IGltcG9ydCgnLi9pbnB1dC1maWVsZC9lZGl0b3InKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IFByZXZpZXdQYW5lbCA9IGR5bmFtaWMoKCkgPT4gaW1wb3J0KCcuL2lucHV0LWZpZWxkL3ByZXZpZXcnKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IEdsb2JhbFZhcmlhYmxlUGFuZWwgPSBkeW5hbWljKCgpID0+IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9wYW5lbC9nbG9iYWwtdmFyaWFibGUtcGFuZWwnKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IFJhZ1BpcGVsaW5lUGFuZWxPblJpZ2h0ID0gKCkgPT4ge1xuICBjb25zdCBoaXN0b3J5V29ya2Zsb3dEYXRhID0gdXNlU3RvcmUocyA9PiBzLmhpc3RvcnlXb3JrZmxvd0RhdGEpXG4gIGNvbnN0IHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCA9IHVzZVN0b3JlKHMgPT4gcy5zaG93RGVidWdBbmRQcmV2aWV3UGFuZWwpXG4gIGNvbnN0IHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsID0gdXNlU3RvcmUocyA9PiBzLnNob3dHbG9iYWxWYXJpYWJsZVBhbmVsKVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtoaXN0b3J5V29ya2Zsb3dEYXRhICYmIDxSZWNvcmQgLz59XG4gICAgICB7c2hvd0RlYnVnQW5kUHJldmlld1BhbmVsICYmIDxUZXN0UnVuUGFuZWwgLz59XG4gICAgICB7c2hvd0dsb2JhbFZhcmlhYmxlUGFuZWwgJiYgPEdsb2JhbFZhcmlhYmxlUGFuZWwgLz59XG4gICAgPC8+XG4gIClcbn1cblxuY29uc3QgUmFnUGlwZWxpbmVQYW5lbE9uTGVmdCA9ICgpID0+IHtcbiAgY29uc3Qgc2hvd0lucHV0RmllbGRQYW5lbCA9IHVzZVN0b3JlKHMgPT4gcy5zaG93SW5wdXRGaWVsZFBhbmVsKVxuICBjb25zdCBzaG93SW5wdXRGaWVsZFByZXZpZXdQYW5lbCA9IHVzZVN0b3JlKHMgPT4gcy5zaG93SW5wdXRGaWVsZFByZXZpZXdQYW5lbClcbiAgY29uc3QgaW5wdXRGaWVsZEVkaXRQYW5lbFByb3BzID0gdXNlU3RvcmUocyA9PiBzLmlucHV0RmllbGRFZGl0UGFuZWxQcm9wcylcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge3Nob3dJbnB1dEZpZWxkUHJldmlld1BhbmVsICYmIDxQcmV2aWV3UGFuZWwgLz59XG4gICAgICB7aW5wdXRGaWVsZEVkaXRQYW5lbFByb3BzICYmIChcbiAgICAgICAgPElucHV0RmllbGRFZGl0b3JQYW5lbFxuICAgICAgICAgIHsuLi5pbnB1dEZpZWxkRWRpdFBhbmVsUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge3Nob3dJbnB1dEZpZWxkUGFuZWwgJiYgPElucHV0RmllbGRQYW5lbCAvPn1cbiAgICA8Lz5cbiAgKVxufVxuXG5jb25zdCBSYWdQaXBlbGluZVBhbmVsID0gKCkgPT4ge1xuICBjb25zdCBwaXBlbGluZUlkID0gdXNlU3RvcmUocyA9PiBzLnBpcGVsaW5lSWQpXG4gIGNvbnN0IHZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBnZXRWZXJzaW9uTGlzdFVybDogYC9yYWcvcGlwZWxpbmVzLyR7cGlwZWxpbmVJZH0vd29ya2Zsb3dzYCxcbiAgICAgIGRlbGV0ZVZlcnNpb25Vcmw6ICh2ZXJzaW9uSWQ6IHN0cmluZykgPT4gYC9yYWcvcGlwZWxpbmVzLyR7cGlwZWxpbmVJZH0vd29ya2Zsb3dzLyR7dmVyc2lvbklkfWAsXG4gICAgICB1cGRhdGVWZXJzaW9uVXJsOiAodmVyc2lvbklkOiBzdHJpbmcpID0+IGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lSWR9L3dvcmtmbG93cy8ke3ZlcnNpb25JZH1gLFxuICAgICAgbGF0ZXN0VmVyc2lvbklkOiAnJyxcbiAgICB9XG4gIH0sIFtwaXBlbGluZUlkXSlcblxuICBjb25zdCBwYW5lbFByb3BzOiBQYW5lbFByb3BzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgbGVmdDogPFJhZ1BpcGVsaW5lUGFuZWxPbkxlZnQgLz4sXG4gICAgICAgIHJpZ2h0OiA8UmFnUGlwZWxpbmVQYW5lbE9uUmlnaHQgLz4sXG4gICAgICB9LFxuICAgICAgdmVyc2lvbkhpc3RvcnlQYW5lbFByb3BzLFxuICAgIH1cbiAgfSwgW3ZlcnNpb25IaXN0b3J5UGFuZWxQcm9wc10pXG5cbiAgcmV0dXJuIChcbiAgICA8UGFuZWwgey4uLnBhbmVsUHJvcHN9IC8+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhSYWdQaXBlbGluZVBhbmVsKVxuIl19