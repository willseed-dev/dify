"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_1 = require("es-toolkit/function");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const types_1 = require("@/app/components/workflow/types");
const use_config_vision_1 = require("../../hooks/use-config-vision");
const use_available_var_list_1 = require("../_base/hooks/use-available-var-list");
const use_node_crud_1 = require("../_base/hooks/use-node-crud");
const utils_1 = require("../utils");
const i18nPrefix = 'nodes.questionClassifiers';
const useSingleRunFormParams = ({ id, payload, runInputData, runInputDataRef, getInputVars, setRunInputData, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { inputs } = (0, use_node_crud_1.default)(id, payload);
    const model = inputs.model;
    const { isVisionModel, } = (0, use_config_vision_1.default)(model, {
        payload: inputs.vision,
        onChange: function_1.noop,
    });
    const visionFiles = runInputData['#files#'];
    const setVisionFiles = (0, react_1.useCallback)((newFiles) => {
        setRunInputData?.({
            ...runInputDataRef.current,
            '#files#': newFiles,
        });
    }, [runInputDataRef, setRunInputData]);
    const varInputs = getInputVars([inputs.instruction]);
    const inputVarValues = (() => {
        const vars = {};
        Object.keys(runInputData)
            .filter(key => !['#files#'].includes(key))
            .forEach((key) => {
            vars[key] = runInputData[key];
        });
        return vars;
    })();
    const setInputVarValues = (0, react_1.useCallback)((newPayload) => {
        const newVars = {
            ...newPayload,
            '#files#': runInputDataRef.current['#files#'],
        };
        setRunInputData?.(newVars);
    }, [runInputDataRef, setRunInputData]);
    const filterVisionInputVar = (0, react_1.useCallback)((varPayload) => {
        return [types_1.VarType.file, types_1.VarType.arrayFile].includes(varPayload.type);
    }, []);
    const { availableVars: availableVisionVars, } = (0, use_available_var_list_1.default)(id, {
        onlyLeafNodeVar: false,
        filterVar: filterVisionInputVar,
    });
    const forms = (() => {
        const forms = [];
        forms.push({
            label: t('nodes.llm.singleRun.variable', { ns: 'workflow' }),
            inputs: [{
                    label: t(`${i18nPrefix}.inputVars`, { ns: 'workflow' }),
                    variable: 'query',
                    type: types_1.InputVarType.paragraph,
                    required: true,
                }, ...varInputs],
            values: inputVarValues,
            onChange: setInputVarValues,
        });
        if (isVisionModel && payload.vision?.enabled && payload.vision?.configs?.variable_selector) {
            const currentVariable = (0, utils_1.findVariableWhenOnLLMVision)(payload.vision.configs.variable_selector, availableVisionVars);
            forms.push({
                label: t('nodes.llm.vision', { ns: 'workflow' }),
                inputs: [{
                        label: currentVariable?.variable,
                        variable: '#files#',
                        type: currentVariable?.formType,
                        required: false,
                    }],
                values: { '#files#': visionFiles },
                onChange: keyValue => setVisionFiles(keyValue['#files#']),
            });
        }
        return forms;
    })();
    const getDependentVars = () => {
        const promptVars = varInputs.map((item) => {
            // Guard against null/undefined variable to prevent app crash
            if (!item.variable || typeof item.variable !== 'string')
                return [];
            return item.variable.slice(1, -1).split('.');
        }).filter(arr => arr.length > 0);
        const vars = [payload.query_variable_selector, ...promptVars];
        if (isVisionModel && payload.vision?.enabled && payload.vision?.configs?.variable_selector) {
            const visionVar = payload.vision.configs.variable_selector;
            vars.push(visionVar);
        }
        return vars;
    };
    const getDependentVar = (variable) => {
        if (variable === 'query')
            return payload.query_variable_selector;
        if (variable === '#files#')
            return payload.vision.configs?.variable_selector;
        return false;
    };
    return {
        forms,
        getDependentVars,
        getDependentVar,
    };
};
exports.default = useSingleRunFormParams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLGtEQUEwQztBQUMxQyxpQ0FBbUM7QUFDbkMsaURBQThDO0FBQzlDLDJEQUF1RTtBQUN2RSxxRUFBMkQ7QUFDM0Qsa0ZBQXVFO0FBQ3ZFLGdFQUFzRDtBQUN0RCxvQ0FBc0Q7QUFFdEQsTUFBTSxVQUFVLEdBQUcsMkJBQTJCLENBQUE7QUFXOUMsTUFBTSxzQkFBc0IsR0FBRyxDQUFDLEVBQzlCLEVBQUUsRUFDRixPQUFPLEVBQ1AsWUFBWSxFQUNaLGVBQWUsRUFDZixZQUFZLEVBQ1osZUFBZSxHQUNSLEVBQUUsRUFBRTtJQUNYLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBVyxFQUE2QixFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFFdkUsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUUxQixNQUFNLEVBQ0osYUFBYSxHQUNkLEdBQUcsSUFBQSwyQkFBZSxFQUFDLEtBQUssRUFBRTtRQUN6QixPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU07UUFDdEIsUUFBUSxFQUFFLGVBQUk7S0FDZixDQUFDLENBQUE7SUFFRixNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDM0MsTUFBTSxjQUFjLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsUUFBZSxFQUFFLEVBQUU7UUFDckQsZUFBZSxFQUFFLENBQUM7WUFDaEIsR0FBRyxlQUFlLENBQUMsT0FBTztZQUMxQixTQUFTLEVBQUUsUUFBUTtTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FB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TSxlQUFlLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7UUFDM0MsSUFBSSxRQUFRLEtBQUssT0FBTztZQUN0QixPQUFPLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQTtRQUN4QyxJQUFJLFFBQVEsS0FBSyxTQUFTO1lBQ3hCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUE7UUFFbEQsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDLENBQUE7SUFFRCxPQUFPO1FBQ0wsS0FBSztRQUNMLGdCQUFnQjtRQUNoQixlQUFlO0tBQ2hCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxzQkFBc0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUmVmT2JqZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFF1ZXN0aW9uQ2xhc3NpZmllck5vZGVUeXBlIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIHsgUHJvcHMgYXMgRm9ybVByb3BzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL2JlZm9yZS1ydW4tZm9ybS9mb3JtJ1xuaW1wb3J0IHR5cGUgeyBJbnB1dFZhciwgVmFyLCBWYXJpYWJsZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBub29wIH0gZnJvbSAnZXMtdG9vbGtpdC9mdW5jdGlvbidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBJbnB1dFZhclR5cGUsIFZhclR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHVzZUNvbmZpZ1Zpc2lvbiBmcm9tICcuLi8uLi9ob29rcy91c2UtY29uZmlnLXZpc2lvbidcbmltcG9ydCB1c2VBdmFpbGFibGVWYXJMaXN0IGZyb20gJy4uL19iYXNlL2hvb2tzL3VzZS1hdmFpbGFibGUtdmFyLWxpc3QnXG5pbXBvcnQgdXNlTm9kZUNydWQgZnJvbSAnLi4vX2Jhc2UvaG9va3MvdXNlLW5vZGUtY3J1ZCdcbmltcG9ydCB7IGZpbmRWYXJpYWJsZVdoZW5PbkxMTVZpc2lvbiB9IGZyb20gJy4uL3V0aWxzJ1xuXG5jb25zdCBpMThuUHJlZml4ID0gJ25vZGVzLnF1ZXN0aW9uQ2xhc3NpZmllcnMnXG5cbnR5cGUgUGFyYW1zID0ge1xuICBpZDogc3RyaW5nXG4gIHBheWxvYWQ6IFF1ZXN0aW9uQ2xhc3NpZmllck5vZGVUeXBlXG4gIHJ1bklucHV0RGF0YTogUmVjb3JkPHN0cmluZywgYW55PlxuICBydW5JbnB1dERhdGFSZWY6IFJlZk9iamVjdDxSZWNvcmQ8c3RyaW5nLCBhbnk+PlxuICBnZXRJbnB1dFZhcnM6ICh0ZXh0TGlzdDogc3RyaW5nW10pID0+IElucHV0VmFyW11cbiAgc2V0UnVuSW5wdXREYXRhOiAoZGF0YTogUmVjb3JkPHN0cmluZywgYW55PikgPT4gdm9pZFxuICB0b1ZhcklucHV0czogKHZhcmlhYmxlczogVmFyaWFibGVbXSkgPT4gSW5wdXRWYXJbXVxufVxuY29uc3QgdXNlU2luZ2xlUnVuRm9ybVBhcmFtcyA9ICh7XG4gIGlkLFxuICBwYXlsb2FkLFxuICBydW5JbnB1dERhdGEsXG4gIHJ1bklucHV0RGF0YVJlZixcbiAgZ2V0SW5wdXRWYXJzLFxuICBzZXRSdW5JbnB1dERhdGEsXG59OiBQYXJhbXMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgaW5wdXRzIH0gPSB1c2VOb2RlQ3J1ZDxRdWVzdGlvbkNsYXNzaWZpZXJOb2RlVHlwZT4oaWQsIHBheWxvYWQpXG5cbiAgY29uc3QgbW9kZWwgPSBpbnB1dHMubW9kZWxcblxuICBjb25zdCB7XG4gICAgaXNWaXNpb25Nb2RlbCxcbiAgfSA9IHVzZUNvbmZpZ1Zpc2lvbihtb2RlbCwge1xuICAgIHBheWxvYWQ6IGlucHV0cy52aXNpb24sXG4gICAgb25DaGFuZ2U6IG5vb3AsXG4gIH0pXG5cbiAgY29uc3QgdmlzaW9uRmlsZXMgPSBydW5JbnB1dERhdGFbJyNmaWxlcyMnXVxuICBjb25zdCBzZXRWaXNpb25GaWxlcyA9IHVzZUNhbGxiYWNrKChuZXdGaWxlczogYW55W10pID0+IHtcbiAgICBzZXRSdW5JbnB1dERhdGE/Lih7XG4gICAgICAuLi5ydW5JbnB1dERhdGFSZWYuY3VycmVudCxcbiAgICAgICcjZmlsZXMjJzogbmV3RmlsZXMsXG4gICAgfSlcbiAgfSwgW3J1bklucHV0RGF0YVJlZiwgc2V0UnVuSW5wdXREYXRhXSlcblxuICBjb25zdCB2YXJJbnB1dHMgPSBnZXRJbnB1dFZhcnMoW2lucHV0cy5pbnN0cnVjdGlvbl0pXG5cbiAgY29uc3QgaW5wdXRWYXJWYWx1ZXMgPSAoKCkgPT4ge1xuICAgIGNvbnN0IHZhcnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuICAgIE9iamVjdC5rZXlzKHJ1bklucHV0RGF0YSlcbiAgICAgIC5maWx0ZXIoa2V5ID0+ICFbJyNmaWxlcyMnXS5pbmNsdWRlcyhrZXkpKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICB2YXJzW2tleV0gPSBydW5JbnB1dERhdGFba2V5XVxuICAgICAgfSlcbiAgICByZXR1cm4gdmFyc1xuICB9KSgpXG5cbiAgY29uc3Qgc2V0SW5wdXRWYXJWYWx1ZXMgPSB1c2VDYWxsYmFjaygobmV3UGF5bG9hZDogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICAgIGNvbnN0IG5ld1ZhcnMgPSB7XG4gICAgICAuLi5uZXdQYXlsb2FkLFxuICAgICAgJyNmaWxlcyMnOiBydW5JbnB1dERhdGFSZWYuY3VycmVudFsnI2ZpbGVzIyddLFxuICAgIH1cbiAgICBzZXRSdW5JbnB1dERhdGE/LihuZXdWYXJzKVxuICB9LCBbcnVuSW5wdXREYXRhUmVmLCBzZXRSdW5JbnB1dERhdGFdKVxuXG4gIGNvbnN0IGZpbHRlclZpc2lvbklucHV0VmFyID0gdXNlQ2FsbGJhY2soKHZhclBheWxvYWQ6IFZhcikgPT4ge1xuICAgIHJldHVybiBbVmFyVHlwZS5maWxlLCBWYXJUeXBlLmFycmF5RmlsZV0uaW5jbHVkZXModmFyUGF5bG9hZC50eXBlKVxuICB9LCBbXSlcbiAgY29uc3Qge1xuICAgIGF2YWlsYWJsZVZhcnM6IGF2YWlsYWJsZVZpc2lvblZhcnMsXG4gIH0gPSB1c2VBdmFpbGFibGVWYXJMaXN0KGlkLCB7XG4gICAgb25seUxlYWZOb2RlVmFyOiBmYWxzZSxcbiAgICBmaWx0ZXJWYXI6IGZpbHRlclZpc2lvbklucHV0VmFyLFxuICB9KVxuXG4gIGNvbnN0IGZvcm1zID0gKCgpID0+IHtcbiAgICBjb25zdCBmb3JtczogRm9ybVByb3BzW10gPSBbXVxuXG4gICAgZm9ybXMucHVzaChcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IHQoJ25vZGVzLmxsbS5zaW5nbGVSdW4udmFyaWFibGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pISxcbiAgICAgICAgaW5wdXRzOiBbe1xuICAgICAgICAgIGxhYmVsOiB0KGAke2kxOG5QcmVmaXh9LmlucHV0VmFyc2AsIHsgbnM6ICd3b3JrZmxvdycgfSkhLFxuICAgICAgICAgIHZhcmlhYmxlOiAncXVlcnknLFxuICAgICAgICAgIHR5cGU6IElucHV0VmFyVHlwZS5wYXJhZ3JhcGgsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIH0sIC4uLnZhcklucHV0c10sXG4gICAgICAgIHZhbHVlczogaW5wdXRWYXJWYWx1ZXMsXG4gICAgICAgIG9uQ2hhbmdlOiBzZXRJbnB1dFZhclZhbHVlcyxcbiAgICAgIH0sXG4gICAgKVxuXG4gICAgaWYgKGlzVmlzaW9uTW9kZWwgJiYgcGF5bG9hZC52aXNpb24/LmVuYWJsZWQgJiYgcGF5bG9hZC52aXNpb24/LmNvbmZpZ3M/LnZhcmlhYmxlX3NlbGVjdG9yKSB7XG4gICAgICBjb25zdCBjdXJyZW50VmFyaWFibGUgPSBmaW5kVmFyaWFibGVXaGVuT25MTE1WaXNpb24ocGF5bG9hZC52aXNpb24uY29uZmlncy52YXJpYWJsZV9zZWxlY3RvciwgYXZhaWxhYmxlVmlzaW9uVmFycylcblxuICAgICAgZm9ybXMucHVzaChcbiAgICAgICAge1xuICAgICAgICAgIGxhYmVsOiB0KCdub2Rlcy5sbG0udmlzaW9uJywgeyBuczogJ3dvcmtmbG93JyB9KSEsXG4gICAgICAgICAgaW5wdXRzOiBbe1xuICAgICAgICAgICAgbGFiZWw6IGN1cnJlbnRWYXJpYWJsZT8udmFyaWFibGUgYXMgYW55LFxuICAgICAgICAgICAgdmFyaWFibGU6ICcjZmlsZXMjJyxcbiAgICAgICAgICAgIHR5cGU6IGN1cnJlbnRWYXJpYWJsZT8uZm9ybVR5cGUgYXMgYW55LFxuICAgICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIHZhbHVlczogeyAnI2ZpbGVzIyc6IHZpc2lvbkZpbGVzIH0sXG4gICAgICAgICAgb25DaGFuZ2U6IGtleVZhbHVlID0+IHNldFZpc2lvbkZpbGVzKGtleVZhbHVlWycjZmlsZXMjJ10pLFxuICAgICAgICB9LFxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gZm9ybXNcbiAgfSkoKVxuXG4gIGNvbnN0IGdldERlcGVuZGVudFZhcnMgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvbXB0VmFycyA9IHZhcklucHV0cy5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIC8vIEd1YXJkIGFnYWluc3QgbnVsbC91bmRlZmluZWQgdmFyaWFibGUgdG8gcHJldmVudCBhcHAgY3Jhc2hcbiAgICAgIGlmICghaXRlbS52YXJpYWJsZSB8fCB0eXBlb2YgaXRlbS52YXJpYWJsZSAhPT0gJ3N0cmluZycpXG4gICAgICAgIHJldHVybiBbXVxuXG4gICAgICByZXR1cm4gaXRlbS52YXJpYWJsZS5zbGljZSgxLCAtMSkuc3BsaXQoJy4nKVxuICAgIH0pLmZpbHRlcihhcnIgPT4gYXJyLmxlbmd0aCA+IDApXG4gICAgY29uc3QgdmFycyA9IFtwYXlsb2FkLnF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yLCAuLi5wcm9tcHRWYXJzXVxuICAgIGlmIChpc1Zpc2lvbk1vZGVsICYmIHBheWxvYWQudmlzaW9uPy5lbmFibGVkICYmIHBheWxvYWQudmlzaW9uPy5jb25maWdzPy52YXJpYWJsZV9zZWxlY3Rvcikge1xuICAgICAgY29uc3QgdmlzaW9uVmFyID0gcGF5bG9hZC52aXNpb24uY29uZmlncy52YXJpYWJsZV9zZWxlY3RvclxuICAgICAgdmFycy5wdXNoKHZpc2lvblZhcilcbiAgICB9XG4gICAgcmV0dXJuIHZhcnNcbiAgfVxuXG4gIGNvbnN0IGdldERlcGVuZGVudFZhciA9ICh2YXJpYWJsZTogc3RyaW5nKSA9PiB7XG4gICAgaWYgKHZhcmlhYmxlID09PSAncXVlcnknKVxuICAgICAgcmV0dXJuIHBheWxvYWQucXVlcnlfdmFyaWFibGVfc2VsZWN0b3JcbiAgICBpZiAodmFyaWFibGUgPT09ICcjZmlsZXMjJylcbiAgICAgIHJldHVybiBwYXlsb2FkLnZpc2lvbi5jb25maWdzPy52YXJpYWJsZV9zZWxlY3RvclxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZvcm1zLFxuICAgIGdldERlcGVuZGVudFZhcnMsXG4gICAgZ2V0RGVwZW5kZW50VmFyLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVNpbmdsZVJ1bkZvcm1QYXJhbXNcbiJdfQ==