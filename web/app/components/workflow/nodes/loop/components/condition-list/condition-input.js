"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const prompt_editor_1 = require("@/app/components/base/prompt-editor");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const ConditionInput = ({ value, onChange, disabled, availableNodes, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const controlPromptEditorRerenderKey = (0, store_1.useStore)(s => s.controlPromptEditorRerenderKey);
    const pipelineId = (0, store_1.useStore)(s => s.pipelineId);
    const setShowInputFieldPanel = (0, store_1.useStore)(s => s.setShowInputFieldPanel);
    return (<prompt_editor_1.default key={controlPromptEditorRerenderKey} compact value={value} placeholder={t('nodes.ifElse.enterValue', { ns: 'workflow' }) || ''} workflowVariableBlock={{
            show: true,
            variables: [],
            workflowNodesMap: availableNodes.reduce((acc, node) => {
                acc[node.id] = {
                    title: node.data.title,
                    type: node.data.type,
                };
                if (node.data.type === types_1.BlockEnum.Start) {
                    acc.sys = {
                        title: t('blocks.start', { ns: 'workflow' }),
                        type: types_1.BlockEnum.Start,
                    };
                }
                return acc;
            }, {}),
            showManageInputField: !!pipelineId,
            onManageInputField: () => setShowInputFieldPanel?.(true),
        }} onChange={onChange} editable={!disabled}/>);
};
exports.default = ConditionInput;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uLWlucHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZGl0aW9uLWlucHV0LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGlEQUE4QztBQUM5Qyx1RUFBOEQ7QUFDOUQsMkRBQTBEO0FBQzFELDJEQUEyRDtBQVEzRCxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQ3RCLEtBQUssRUFDTCxRQUFRLEVBQ1IsUUFBUSxFQUNSLGNBQWMsR0FDTSxFQUFFLEVBQUU7SUFDeEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sOEJBQThCLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUFDdEYsTUFBTSxVQUFVLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQzlDLE1BQU0sc0JBQXNCLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUE7SUFFdEUsT0FBTyxDQUNMLENBQUMsdUJBQVksQ0FDWCxHQUFHLENBQUMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUNwQyxPQUFPLENBQ1AsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2IsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQ3BFLHFCQUFxQixDQUFDLENBQUM7WUFDckIsSUFBSSxFQUFFLElBQUk7WUFDVixTQUFTLEVBQUUsRUFBRTtZQUNiLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQ3BELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUc7b0JBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSztvQkFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtpQkFDckIsQ0FBQTtnQkFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ3ZDLEdBQUcsQ0FBQyxHQUFHLEdBQUc7d0JBQ1IsS0FBSyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUM7d0JBQzVDLElBQUksRUFBRSxpQkFBUyxDQUFDLEtBQUs7cUJBQ3RCLENBQUE7Z0JBQ0gsQ0FBQztnQkFDRCxPQUFPLEdBQUcsQ0FBQTtZQUNaLENBQUMsRUFBRSxFQUFTLENBQUM7WUFDYixvQkFBb0IsRUFBRSxDQUFDLENBQUMsVUFBVTtZQUNsQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLElBQUksQ0FBQztTQUN6RCxDQUFDLENBQ0YsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ25CLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQ3BCLENBQ0gsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgTm9kZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBQcm9tcHRFZGl0b3IgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Byb21wdC1lZGl0b3InXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG50eXBlIENvbmRpdGlvbklucHV0UHJvcHMgPSB7XG4gIGRpc2FibGVkPzogYm9vbGVhblxuICB2YWx1ZTogc3RyaW5nXG4gIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZFxuICBhdmFpbGFibGVOb2RlczogTm9kZVtdXG59XG5jb25zdCBDb25kaXRpb25JbnB1dCA9ICh7XG4gIHZhbHVlLFxuICBvbkNoYW5nZSxcbiAgZGlzYWJsZWQsXG4gIGF2YWlsYWJsZU5vZGVzLFxufTogQ29uZGl0aW9uSW5wdXRQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgY29udHJvbFByb21wdEVkaXRvclJlcmVuZGVyS2V5ID0gdXNlU3RvcmUocyA9PiBzLmNvbnRyb2xQcm9tcHRFZGl0b3JSZXJlbmRlcktleSlcbiAgY29uc3QgcGlwZWxpbmVJZCA9IHVzZVN0b3JlKHMgPT4gcy5waXBlbGluZUlkKVxuICBjb25zdCBzZXRTaG93SW5wdXRGaWVsZFBhbmVsID0gdXNlU3RvcmUocyA9PiBzLnNldFNob3dJbnB1dEZpZWxkUGFuZWwpXG5cbiAgcmV0dXJuIChcbiAgICA8UHJvbXB0RWRpdG9yXG4gICAgICBrZXk9e2NvbnRyb2xQcm9tcHRFZGl0b3JSZXJlbmRlcktleX1cbiAgICAgIGNvbXBhY3RcbiAgICAgIHZhbHVlPXt2YWx1ZX1cbiAgICAgIHBsYWNlaG9sZGVyPXt0KCdub2Rlcy5pZkVsc2UuZW50ZXJWYWx1ZScsIHsgbnM6ICd3b3JrZmxvdycgfSkgfHwgJyd9XG4gICAgICB3b3JrZmxvd1ZhcmlhYmxlQmxvY2s9e3tcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgdmFyaWFibGVzOiBbXSxcbiAgICAgICAgd29ya2Zsb3dOb2Rlc01hcDogYXZhaWxhYmxlTm9kZXMucmVkdWNlKChhY2MsIG5vZGUpID0+IHtcbiAgICAgICAgICBhY2Nbbm9kZS5pZF0gPSB7XG4gICAgICAgICAgICB0aXRsZTogbm9kZS5kYXRhLnRpdGxlLFxuICAgICAgICAgICAgdHlwZTogbm9kZS5kYXRhLnR5cGUsXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlN0YXJ0KSB7XG4gICAgICAgICAgICBhY2Muc3lzID0ge1xuICAgICAgICAgICAgICB0aXRsZTogdCgnYmxvY2tzLnN0YXJ0JywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgICAgICAgICAgdHlwZTogQmxvY2tFbnVtLlN0YXJ0LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgIH0sIHt9IGFzIGFueSksXG4gICAgICAgIHNob3dNYW5hZ2VJbnB1dEZpZWxkOiAhIXBpcGVsaW5lSWQsXG4gICAgICAgIG9uTWFuYWdlSW5wdXRGaWVsZDogKCkgPT4gc2V0U2hvd0lucHV0RmllbGRQYW5lbD8uKHRydWUpLFxuICAgICAgfX1cbiAgICAgIG9uQ2hhbmdlPXtvbkNoYW5nZX1cbiAgICAgIGVkaXRhYmxlPXshZGlzYWJsZWR9XG4gICAgLz5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25kaXRpb25JbnB1dFxuIl19