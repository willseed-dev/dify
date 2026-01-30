"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const types_1 = require("@/app/components/workflow/types");
const hooks_1 = require("../../hooks");
const useSingleRunFormParams = ({ id, payload, runInputData, setRunInputData, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isChatMode = (0, hooks_1.useIsChatMode)();
    const forms = (() => {
        const forms = [];
        const inputs = payload.variables.map((item) => {
            return {
                ...item,
                getVarValueFromDependent: true,
            };
        });
        if (isChatMode) {
            inputs.push({
                label: 'sys.query',
                variable: '#sys.query#',
                type: types_1.InputVarType.textInput,
                required: true,
            });
        }
        inputs.push({
            label: 'sys.files',
            variable: '#sys.files#',
            type: types_1.InputVarType.multiFiles,
            required: false,
        });
        forms.push({
            label: t('nodes.llm.singleRun.variable', { ns: 'workflow' }),
            inputs,
            values: runInputData,
            onChange: setRunInputData,
        });
        return forms;
    })();
    const getDependentVars = () => {
        const inputVars = payload.variables.map((item) => {
            return [id, item.variable];
        });
        const vars = [...inputVars, ['sys', 'files']];
        if (isChatMode)
            vars.push(['sys', 'query']);
        return vars;
    };
    const getDependentVar = (variable) => {
        return [id, variable];
    };
    return {
        forms,
        getDependentVars,
        getDependentVar,
    };
};
exports.default = useSingleRunFormParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLGlEQUE4QztBQUM5QywyREFBOEQ7QUFDOUQsdUNBQTJDO0FBVzNDLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxFQUM5QixFQUFFLEVBQ0YsT0FBTyxFQUNQLFlBQVksRUFDWixlQUFlLEdBQ1IsRUFBRSxFQUFFO0lBQ1gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sVUFBVSxHQUFHLElBQUEscUJBQWEsR0FBRSxDQUFBO0lBRWxDLE1BQU0sS0FBSyxHQUFHLENBQUMsR0FBRyxFQUFFO1FBQ2xCLE1BQU0sS0FBSyxHQUFnQixFQUFFLENBQUE7UUFDN0IsTUFBTSxNQUFNLEdBQWUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN4RCxPQUFPO2dCQUNMLEdBQUcsSUFBSTtnQkFDUCx3QkFBd0IsRUFBRSxJQUFJO2FBQy9CLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUksVUFBVSxFQUFFLENBQUM7WUFDZixNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNWLEtBQUssRUFBRSxXQUFXO2dCQUNsQixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsSUFBSSxFQUFFLG9CQUFZLENBQUMsU0FBUztnQkFDNUIsUUFBUSxFQUFFLElBQUk7YUFDZixDQUFDLENBQUE7UUFDSixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNWLEtBQUssRUFBRSxXQUFXO1lBQ2xCLFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLElBQUksRUFBRSxvQkFBWSxDQUFDLFVBQVU7WUFDN0IsUUFBUSxFQUFFLEtBQUs7U0FDaEIsQ0FBQyxDQUFBO1FBRUYsS0FBSyxDQUFDLElBQUksQ0FDUjtZQUNFLEtBQUssRUFBRSxDQUFDLENBQUMsOEJBQThCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUU7WUFDN0QsTUFBTTtZQUNOLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLFFBQVEsRUFBRSxlQUFlO1NBQzFCLENBQ0YsQ0FBQTtRQUVELE9BQU8sS0FBSyxDQUFBO0lBQ2QsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUVKLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO1FBQzVCLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDL0MsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDNUIsQ0FBQyxDQUFDLENBQUE7UUFDRixNQUFNLElBQUksR0FBb0IsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBRTlELElBQUksVUFBVTtZQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUU3QixPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMsQ0FBQTtJQUVELE1BQU0sZUFBZSxHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFFO1FBQzNDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDdkIsQ0FBQyxDQUFBO0lBRUQsT0FBTztRQUNMLEtBQUs7UUFDTCxnQkFBZ0I7UUFDaEIsZUFBZTtLQUNoQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsc0JBQXNCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJlZk9iamVjdCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBTdGFydE5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIHsgUHJvcHMgYXMgRm9ybVByb3BzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL2JlZm9yZS1ydW4tZm9ybS9mb3JtJ1xuaW1wb3J0IHR5cGUgeyBJbnB1dFZhciwgVmFsdWVTZWxlY3RvciwgVmFyaWFibGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgSW5wdXRWYXJUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZUlzQ2hhdE1vZGUgfSBmcm9tICcuLi8uLi9ob29rcydcblxudHlwZSBQYXJhbXMgPSB7XG4gIGlkOiBzdHJpbmdcbiAgcGF5bG9hZDogU3RhcnROb2RlVHlwZVxuICBydW5JbnB1dERhdGE6IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgcnVuSW5wdXREYXRhUmVmOiBSZWZPYmplY3Q8UmVjb3JkPHN0cmluZywgYW55Pj5cbiAgZ2V0SW5wdXRWYXJzOiAodGV4dExpc3Q6IHN0cmluZ1tdKSA9PiBJbnB1dFZhcltdXG4gIHNldFJ1bklucHV0RGF0YTogKGRhdGE6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHZvaWRcbiAgdG9WYXJJbnB1dHM6ICh2YXJpYWJsZXM6IFZhcmlhYmxlW10pID0+IElucHV0VmFyW11cbn1cbmNvbnN0IHVzZVNpbmdsZVJ1bkZvcm1QYXJhbXMgPSAoe1xuICBpZCxcbiAgcGF5bG9hZCxcbiAgcnVuSW5wdXREYXRhLFxuICBzZXRSdW5JbnB1dERhdGEsXG59OiBQYXJhbXMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGlzQ2hhdE1vZGUgPSB1c2VJc0NoYXRNb2RlKClcblxuICBjb25zdCBmb3JtcyA9ICgoKSA9PiB7XG4gICAgY29uc3QgZm9ybXM6IEZvcm1Qcm9wc1tdID0gW11cbiAgICBjb25zdCBpbnB1dHM6IElucHV0VmFyW10gPSBwYXlsb2FkLnZhcmlhYmxlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLml0ZW0sXG4gICAgICAgIGdldFZhclZhbHVlRnJvbURlcGVuZGVudDogdHJ1ZSxcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKGlzQ2hhdE1vZGUpIHtcbiAgICAgIGlucHV0cy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICdzeXMucXVlcnknLFxuICAgICAgICB2YXJpYWJsZTogJyNzeXMucXVlcnkjJyxcbiAgICAgICAgdHlwZTogSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlucHV0cy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnc3lzLmZpbGVzJyxcbiAgICAgIHZhcmlhYmxlOiAnI3N5cy5maWxlcyMnLFxuICAgICAgdHlwZTogSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMsXG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgfSlcblxuICAgIGZvcm1zLnB1c2goXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiB0KCdub2Rlcy5sbG0uc2luZ2xlUnVuLnZhcmlhYmxlJywgeyBuczogJ3dvcmtmbG93JyB9KSEsXG4gICAgICAgIGlucHV0cyxcbiAgICAgICAgdmFsdWVzOiBydW5JbnB1dERhdGEsXG4gICAgICAgIG9uQ2hhbmdlOiBzZXRSdW5JbnB1dERhdGEsXG4gICAgICB9LFxuICAgIClcblxuICAgIHJldHVybiBmb3Jtc1xuICB9KSgpXG5cbiAgY29uc3QgZ2V0RGVwZW5kZW50VmFycyA9ICgpID0+IHtcbiAgICBjb25zdCBpbnB1dFZhcnMgPSBwYXlsb2FkLnZhcmlhYmxlcy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIHJldHVybiBbaWQsIGl0ZW0udmFyaWFibGVdXG4gICAgfSlcbiAgICBjb25zdCB2YXJzOiBWYWx1ZVNlbGVjdG9yW10gPSBbLi4uaW5wdXRWYXJzLCBbJ3N5cycsICdmaWxlcyddXVxuXG4gICAgaWYgKGlzQ2hhdE1vZGUpXG4gICAgICB2YXJzLnB1c2goWydzeXMnLCAncXVlcnknXSlcblxuICAgIHJldHVybiB2YXJzXG4gIH1cblxuICBjb25zdCBnZXREZXBlbmRlbnRWYXIgPSAodmFyaWFibGU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBbaWQsIHZhcmlhYmxlXVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBmb3JtcyxcbiAgICBnZXREZXBlbmRlbnRWYXJzLFxuICAgIGdldERlcGVuZGVudFZhcixcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VTaW5nbGVSdW5Gb3JtUGFyYW1zXG4iXX0=