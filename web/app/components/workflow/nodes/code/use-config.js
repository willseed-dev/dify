"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const react_1 = require("react");
const hooks_1 = require("@/app/components/workflow/hooks");
const use_node_crud_1 = require("@/app/components/workflow/nodes/_base/hooks/use-node-crud");
const workflow_1 = require("@/service/workflow");
const store_1 = require("../../store");
const types_1 = require("../../types");
const use_output_var_list_1 = require("../_base/hooks/use-output-var-list");
const use_var_list_1 = require("../_base/hooks/use-var-list");
const types_2 = require("./types");
const useConfig = (id, payload) => {
    const { nodesReadOnly: readOnly } = (0, hooks_1.useNodesReadOnly)();
    const appId = (0, store_1.useStore)(s => s.appId);
    const pipelineId = (0, store_1.useStore)(s => s.pipelineId);
    const [allLanguageDefault, setAllLanguageDefault] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (appId) {
            (async () => {
                const { config: javaScriptConfig } = await (0, workflow_1.fetchNodeDefault)(appId, types_1.BlockEnum.Code, { code_language: types_2.CodeLanguage.javascript });
                const { config: pythonConfig } = await (0, workflow_1.fetchNodeDefault)(appId, types_1.BlockEnum.Code, { code_language: types_2.CodeLanguage.python3 });
                setAllLanguageDefault({
                    [types_2.CodeLanguage.javascript]: javaScriptConfig,
                    [types_2.CodeLanguage.python3]: pythonConfig,
                });
            })();
        }
    }, [appId]);
    (0, react_1.useEffect)(() => {
        if (pipelineId) {
            (async () => {
                const { config: javaScriptConfig } = await (0, workflow_1.fetchPipelineNodeDefault)(pipelineId, types_1.BlockEnum.Code, { code_language: types_2.CodeLanguage.javascript });
                const { config: pythonConfig } = await (0, workflow_1.fetchPipelineNodeDefault)(pipelineId, types_1.BlockEnum.Code, { code_language: types_2.CodeLanguage.python3 });
                setAllLanguageDefault({
                    [types_2.CodeLanguage.javascript]: javaScriptConfig,
                    [types_2.CodeLanguage.python3]: pythonConfig,
                });
            })();
        }
    }, [pipelineId]);
    const defaultConfig = (0, store_1.useStore)(s => s.nodesDefaultConfigs)?.[payload.type];
    const { inputs, setInputs } = (0, use_node_crud_1.default)(id, payload);
    const { handleVarListChange, handleAddVariable } = (0, use_var_list_1.default)({
        inputs,
        setInputs,
    });
    const [outputKeyOrders, setOutputKeyOrders] = (0, react_1.useState)([]);
    const syncOutputKeyOrders = (0, react_1.useCallback)((outputs) => {
        setOutputKeyOrders(Object.keys(outputs));
    }, []);
    (0, react_1.useEffect)(() => {
        if (inputs.code) {
            if (inputs.outputs && Object.keys(inputs.outputs).length > 0)
                syncOutputKeyOrders(inputs.outputs);
            return;
        }
        const isReady = defaultConfig && Object.keys(defaultConfig).length > 0;
        if (isReady) {
            setInputs({
                ...inputs,
                ...defaultConfig,
            });
            syncOutputKeyOrders(defaultConfig.outputs);
        }
    }, [defaultConfig]);
    const handleCodeChange = (0, react_1.useCallback)((code) => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.code = code;
        });
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const handleCodeLanguageChange = (0, react_1.useCallback)((codeLanguage) => {
        const currDefaultConfig = allLanguageDefault?.[codeLanguage];
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.code_language = codeLanguage;
            if (!currDefaultConfig)
                return;
            draft.code = currDefaultConfig.code;
            draft.variables = currDefaultConfig.variables;
            draft.outputs = currDefaultConfig.outputs;
        });
        setInputs(newInputs);
    }, [allLanguageDefault, inputs, setInputs]);
    const handleSyncFunctionSignature = (0, react_1.useCallback)(() => {
        const generateSyncSignatureCode = (code) => {
            let mainDefRe;
            let newMainDef;
            if (inputs.code_language === types_2.CodeLanguage.javascript) {
                mainDefRe = /function\s+main\b\s*\([\s\S]*?\)/g;
                newMainDef = 'function main({{var_list}})';
                let param_list = inputs.variables?.map(item => item.variable).join(', ') || '';
                param_list = param_list ? `{${param_list}}` : '';
                newMainDef = newMainDef.replace('{{var_list}}', param_list);
            }
            else if (inputs.code_language === types_2.CodeLanguage.python3) {
                mainDefRe = /def\s+main\b\s*\([\s\S]*?\)/g;
                const param_list = [];
                for (const item of inputs.variables) {
                    let param = item.variable;
                    let param_type = '';
                    switch (item.value_type) {
                        case types_1.VarType.string:
                            param_type = ': str';
                            break;
                        case types_1.VarType.number:
                            param_type = ': float';
                            break;
                        case types_1.VarType.object:
                            param_type = ': dict';
                            break;
                        case types_1.VarType.array:
                            param_type = ': list';
                            break;
                        case types_1.VarType.arrayNumber:
                            param_type = ': list[float]';
                            break;
                        case types_1.VarType.arrayString:
                            param_type = ': list[str]';
                            break;
                        case types_1.VarType.arrayObject:
                            param_type = ': list[dict]';
                            break;
                    }
                    param += param_type;
                    param_list.push(`${param}`);
                }
                newMainDef = `def main(${param_list.join(', ')})`;
            }
            else {
                return code;
            }
            const newCode = code.replace(mainDefRe, newMainDef);
            return newCode;
        };
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.code = generateSyncSignatureCode(draft.code);
        });
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const { handleVarsChange, handleAddVariable: handleAddOutputVariable, handleRemoveVariable, isShowRemoveVarConfirm, hideRemoveVarConfirm, onRemoveVarConfirm, } = (0, use_output_var_list_1.default)({
        id,
        inputs,
        setInputs,
        outputKeyOrders,
        onOutputKeyOrdersChange: setOutputKeyOrders,
    });
    const filterVar = (0, react_1.useCallback)((varPayload) => {
        return [types_1.VarType.string, types_1.VarType.number, types_1.VarType.boolean, types_1.VarType.secret, types_1.VarType.object, types_1.VarType.array, types_1.VarType.arrayNumber, types_1.VarType.arrayString, types_1.VarType.arrayObject, types_1.VarType.arrayBoolean, types_1.VarType.file, types_1.VarType.arrayFile].includes(varPayload.type);
    }, []);
    const handleCodeAndVarsChange = (0, react_1.useCallback)((code, inputVariables, outputVariables) => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.code = code;
            draft.variables = inputVariables;
            draft.outputs = outputVariables;
        });
        setInputs(newInputs);
        syncOutputKeyOrders(outputVariables);
    }, [inputs, setInputs, syncOutputKeyOrders]);
    return {
        readOnly,
        inputs,
        outputKeyOrders,
        handleVarListChange,
        handleAddVariable,
        handleRemoveVariable,
        handleSyncFunctionSignature,
        handleCodeChange,
        handleCodeLanguageChange,
        handleVarsChange,
        filterVar,
        handleAddOutputVariable,
        isShowRemoveVarConfirm,
        hideRemoveVarConfirm,
        onRemoveVarConfirm,
        handleCodeAndVarsChange,
    };
};
exports.default = useConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBK0I7QUFDL0IsaUNBQXdEO0FBQ3hELDJEQUV3QztBQUN4Qyw2RkFBbUY7QUFDbkYsaURBRzJCO0FBQzNCLHVDQUFzQztBQUN0Qyx1Q0FBZ0Q7QUFDaEQsNEVBQWlFO0FBQ2pFLDhEQUFvRDtBQUNwRCxtQ0FBc0M7QUFFdEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxFQUFVLEVBQUUsT0FBcUIsRUFBRSxFQUFFO0lBQ3RELE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBRXRELE1BQU0sS0FBSyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNwQyxNQUFNLFVBQVUsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUE7SUFFOUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUE0QyxJQUFJLENBQUMsQ0FBQTtJQUM3RyxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsSUFBSSxLQUFLLEVBQUUsQ0FBQztZQUNWLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLE1BQU0sSUFBQSwyQkFBZ0IsRUFBQyxLQUFLLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxhQUFhLEVBQUUsb0JBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBUSxDQUFBO2dCQUNySSxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sSUFBQSwyQkFBZ0IsRUFBQyxLQUFLLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxhQUFhLEVBQUUsb0JBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBUSxDQUFBO2dCQUM5SCxxQkFBcUIsQ0FBQztvQkFDcEIsQ0FBQyxvQkFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLGdCQUFnQztvQkFDM0QsQ0FBQyxvQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQTRCO2lCQUM5QyxDQUFDLENBQUE7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQ04sQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFFWCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUNmLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLE1BQU0sSUFBQSxtQ0FBd0IsRUFBQyxVQUFVLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxhQUFhLEVBQUUsb0JBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBUSxDQUFBO2dCQUNsSixNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE1BQU0sSUFBQSxtQ0FBd0IsRUFBQyxVQUFVLEVBQUUsaUJBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxhQUFhLEVBQUUsb0JBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBUSxDQUFBO2dCQUMzSSxxQkFBcUIsQ0FBQztvQkFDcEIsQ0FBQyxvQkFBWSxDQUFDLFVBQVUsQ0FBQyxFQUFFLGdCQUFnQztvQkFDM0QsQ0FBQyxvQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQTRCO2lCQUM5QyxDQUFDLENBQUE7WUFDWCxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQ04sQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7SUFFaEIsTUFBTSxhQUFhLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLHVCQUFXLEVBQWUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3BFLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLElBQUEsc0JBQVUsRUFBZTtRQUMxRSxNQUFNO1FBQ04sU0FBUztLQUNWLENBQUMsQ0FBQTtJQUVGLE1BQU0sQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQVcsRUFBRSxDQUFDLENBQUE7SUFDcEUsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxPQUFrQixFQUFFLEVBQUU7UUFDN0Qsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQzFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNOLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDYixJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoQixJQUFJLE1BQU0sQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQzFELG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVyQyxPQUFNO1FBQ1IsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFHLGFBQWEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7UUFDdEUsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNaLFNBQVMsQ0FBQztnQkFDUixHQUFHLE1BQU07Z0JBQ1QsR0FBRyxhQUFhO2FBQ2pCLENBQUMsQ0FBQTtZQUNGLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM1QyxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUVuQixNQUFNLGdCQUFnQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQVksRUFBRSxFQUFFO1FBQ3BELE1BQU0sU0FBUyxHQUFHLElBQUEsZUFBTyxFQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ25CLENBQUMsQ0FBQyxDQUFBO1FBQ0YsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3RCLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFBO0lBRXZCLE1BQU0sd0JBQXdCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsWUFBMEIsRUFBRSxFQUFFO1FBQzFFLE1BQU0saUJBQWlCLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUU1RCxNQUFNLFNBQVMsR0FBRyxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMxQyxLQUFLLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQTtZQUNsQyxJQUFJLENBQUMsaUJBQWlCO2dCQUNwQixPQUFNO1lBQ1IsS0FBSyxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUE7WUFDbkMsS0FBSyxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUE7WUFDN0MsS0FBSyxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUE7UUFDM0MsQ0FBQyxDQUFDLENBQUE7UUFDRixTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEIsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7SUFFM0MsTUFBTSwyQkFBMkIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ25ELE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRTtZQUNqRCxJQUFJLFNBQVMsQ0FBQTtZQUNiLElBQUksVUFBVSxDQUFBO1lBQ2QsSUFBSSxNQUFNLENBQUMsYUFBYSxLQUFLLG9CQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3JELFNBQVMsR0FBRyxtQ0FBbUMsQ0FBQTtnQkFDL0MsVUFBVSxHQUFHLDZCQUE2QixDQUFBO2dCQUMxQyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO2dCQUM5RSxVQUFVLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7Z0JBQ2hELFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQTtZQUM3RCxDQUFDO2lCQUVJLElBQUksTUFBTSxDQUFDLGFBQWEsS0FBSyxvQkFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN2RCxTQUFTLEdBQUcsOEJBQThCLENBQUE7Z0JBQzFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQTtnQkFDckIsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3BDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7b0JBQ3pCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQTtvQkFDbkIsUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7d0JBQ3hCLEtBQUssZUFBTyxDQUFDLE1BQU07NEJBQ2pCLFVBQVUsR0FBRyxPQUFPLENBQUE7NEJBQ3BCLE1BQUs7d0JBQ1AsS0FBSyxlQUFPLENBQUMsTUFBTTs0QkFDakIsVUFBVSxHQUFHLFNBQVMsQ0FBQTs0QkFDdEIsTUFBSzt3QkFDUCxLQUFLLGVBQU8sQ0FBQyxNQUFNOzRCQUNqQixVQUFVLEdBQUcsUUFBUSxDQUFBOzRCQUNyQixNQUFLO3dCQUNQLEtBQUssZUFBTyxDQUFDLEtBQUs7NEJBQ2hCLFVBQVUsR0FBRyxRQUFRLENBQUE7NEJBQ3JCLE1BQUs7d0JBQ1AsS0FBSyxlQUFPLENBQUMsV0FBVzs0QkFDdEIsVUFBVSxHQUFHLGVBQWUsQ0FBQTs0QkFDNUIsTUFBSzt3QkFDUCxLQUFLLGVBQU8sQ0FBQyxXQUFXOzRCQUN0QixVQUFVLEdBQUcsYUFBYSxDQUFBOzRCQUMxQixNQUFLO3dCQUNQLEtBQUssZUFBTyxDQUFDLFdBQVc7NEJBQ3RCLFVBQVUsR0FBRyxjQUFjLENBQUE7NEJBQzNCLE1BQUs7b0JBQ1QsQ0FBQztvQkFDRCxLQUFLLElBQUksVUFBVSxDQUFBO29CQUNuQixVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQTtnQkFDN0IsQ0FBQztnQkFFRCxVQUFVLEdBQUcsWUFBWSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUE7WUFDbkQsQ0FBQztpQkFDSSxDQUFDO2dCQUFDLE9BQU8sSUFBSSxDQUFBO1lBQUMsQ0FBQztZQUVwQixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQTtZQUNuRCxPQUFPLE9BQU8sQ0FBQTtRQUNoQixDQUFDLENBQUE7UUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMxQyxLQUFLLENBQUMsSUFBSSxHQUFHLHlCQUF5QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwRCxDQUFDLENBQUMsQ0FBQTtRQUNGLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN0QixDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUV2QixNQUFNLEVBQ0osZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUFFLHVCQUF1QixFQUMxQyxvQkFBb0IsRUFDcEIsc0JBQXNCLEVBQ3RCLG9CQUFvQixFQUNwQixrQkFBa0IsR0FDbkIsR0FBRyxJQUFBLDZCQUFnQixFQUFlO1FBQ2pDLEVBQUU7UUFDRixNQUFNO1FBQ04sU0FBUztRQUNULGVBQWU7UUFDZix1QkFBdUIsRUFBRSxrQkFBa0I7S0FDNUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsVUFBZSxFQUFFLEVBQUU7UUFDaEQsT0FBTyxDQUFDLGVBQU8sQ0FBQyxNQUFNLEVBQUUsZUFBTyxDQUFDLE1BQU0sRUFBRSxlQUFPLENBQUMsT0FBTyxFQUFFLGVBQU8sQ0FBQyxNQUFNLEVBQUUsZUFBTyxDQUFDLE1BQU0sRUFBRSxlQUFPLENBQUMsS0FBSyxFQUFFLGVBQU8sQ0FBQyxXQUFXLEVBQUUsZUFBTyxDQUFDLFdBQVcsRUFBRSxlQUFPLENBQUMsV0FBVyxFQUFFLGVBQU8sQ0FBQyxZQUFZLEVBQUUsZUFBTyxDQUFDLElBQUksRUFBRSxlQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN6UCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFTixNQUFNLHVCQUF1QixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQVksRUFBRSxjQUEwQixFQUFFLGVBQTBCLEVBQUUsRUFBRTtRQUNuSCxNQUFNLFNBQVMsR0FBRyxJQUFBLGVBQU8sRUFBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMxQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtZQUNqQixLQUFLLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQTtZQUNoQyxLQUFLLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQTtRQUNqQyxDQUFDLENBQUMsQ0FBQTtRQUNGLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNwQixtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUN0QyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQTtJQUM1QyxPQUFPO1FBQ0wsUUFBUTtRQUNSLE1BQU07UUFDTixlQUFlO1FBQ2YsbUJBQW1CO1FBQ25CLGlCQUFpQjtRQUNqQixvQkFBb0I7UUFDcEIsMkJBQTJCO1FBQzNCLGdCQUFnQjtRQUNoQix3QkFBd0I7UUFDeEIsZ0JBQWdCO1FBQ2hCLFNBQVM7UUFDVCx1QkFBdUI7UUFDdkIsc0JBQXNCO1FBQ3RCLG9CQUFvQjtRQUNwQixrQkFBa0I7UUFDbEIsdUJBQXVCO0tBQ3hCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFZhciwgVmFyaWFibGUgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgQ29kZU5vZGVUeXBlLCBPdXRwdXRWYXIgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7XG4gIHVzZU5vZGVzUmVhZE9ubHksXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MnXG5pbXBvcnQgdXNlTm9kZUNydWQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9ob29rcy91c2Utbm9kZS1jcnVkJ1xuaW1wb3J0IHtcbiAgZmV0Y2hOb2RlRGVmYXVsdCxcbiAgZmV0Y2hQaXBlbGluZU5vZGVEZWZhdWx0LFxufSBmcm9tICdAL3NlcnZpY2Uvd29ya2Zsb3cnXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJy4uLy4uL3N0b3JlJ1xuaW1wb3J0IHsgQmxvY2tFbnVtLCBWYXJUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdXNlT3V0cHV0VmFyTGlzdCBmcm9tICcuLi9fYmFzZS9ob29rcy91c2Utb3V0cHV0LXZhci1saXN0J1xuaW1wb3J0IHVzZVZhckxpc3QgZnJvbSAnLi4vX2Jhc2UvaG9va3MvdXNlLXZhci1saXN0J1xuaW1wb3J0IHsgQ29kZUxhbmd1YWdlIH0gZnJvbSAnLi90eXBlcydcblxuY29uc3QgdXNlQ29uZmlnID0gKGlkOiBzdHJpbmcsIHBheWxvYWQ6IENvZGVOb2RlVHlwZSkgPT4ge1xuICBjb25zdCB7IG5vZGVzUmVhZE9ubHk6IHJlYWRPbmx5IH0gPSB1c2VOb2Rlc1JlYWRPbmx5KClcblxuICBjb25zdCBhcHBJZCA9IHVzZVN0b3JlKHMgPT4gcy5hcHBJZClcbiAgY29uc3QgcGlwZWxpbmVJZCA9IHVzZVN0b3JlKHMgPT4gcy5waXBlbGluZUlkKVxuXG4gIGNvbnN0IFthbGxMYW5ndWFnZURlZmF1bHQsIHNldEFsbExhbmd1YWdlRGVmYXVsdF0gPSB1c2VTdGF0ZTxSZWNvcmQ8Q29kZUxhbmd1YWdlLCBDb2RlTm9kZVR5cGU+IHwgbnVsbD4obnVsbClcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoYXBwSWQpIHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29uZmlnOiBqYXZhU2NyaXB0Q29uZmlnIH0gPSBhd2FpdCBmZXRjaE5vZGVEZWZhdWx0KGFwcElkLCBCbG9ja0VudW0uQ29kZSwgeyBjb2RlX2xhbmd1YWdlOiBDb2RlTGFuZ3VhZ2UuamF2YXNjcmlwdCB9KSBhcyBhbnlcbiAgICAgICAgY29uc3QgeyBjb25maWc6IHB5dGhvbkNvbmZpZyB9ID0gYXdhaXQgZmV0Y2hOb2RlRGVmYXVsdChhcHBJZCwgQmxvY2tFbnVtLkNvZGUsIHsgY29kZV9sYW5ndWFnZTogQ29kZUxhbmd1YWdlLnB5dGhvbjMgfSkgYXMgYW55XG4gICAgICAgIHNldEFsbExhbmd1YWdlRGVmYXVsdCh7XG4gICAgICAgICAgW0NvZGVMYW5ndWFnZS5qYXZhc2NyaXB0XTogamF2YVNjcmlwdENvbmZpZyBhcyBDb2RlTm9kZVR5cGUsXG4gICAgICAgICAgW0NvZGVMYW5ndWFnZS5weXRob24zXTogcHl0aG9uQ29uZmlnIGFzIENvZGVOb2RlVHlwZSxcbiAgICAgICAgfSBhcyBhbnkpXG4gICAgICB9KSgpXG4gICAgfVxuICB9LCBbYXBwSWRdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHBpcGVsaW5lSWQpIHtcbiAgICAgIChhc3luYyAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY29uZmlnOiBqYXZhU2NyaXB0Q29uZmlnIH0gPSBhd2FpdCBmZXRjaFBpcGVsaW5lTm9kZURlZmF1bHQocGlwZWxpbmVJZCwgQmxvY2tFbnVtLkNvZGUsIHsgY29kZV9sYW5ndWFnZTogQ29kZUxhbmd1YWdlLmphdmFzY3JpcHQgfSkgYXMgYW55XG4gICAgICAgIGNvbnN0IHsgY29uZmlnOiBweXRob25Db25maWcgfSA9IGF3YWl0IGZldGNoUGlwZWxpbmVOb2RlRGVmYXVsdChwaXBlbGluZUlkLCBCbG9ja0VudW0uQ29kZSwgeyBjb2RlX2xhbmd1YWdlOiBDb2RlTGFuZ3VhZ2UucHl0aG9uMyB9KSBhcyBhbnlcbiAgICAgICAgc2V0QWxsTGFuZ3VhZ2VEZWZhdWx0KHtcbiAgICAgICAgICBbQ29kZUxhbmd1YWdlLmphdmFzY3JpcHRdOiBqYXZhU2NyaXB0Q29uZmlnIGFzIENvZGVOb2RlVHlwZSxcbiAgICAgICAgICBbQ29kZUxhbmd1YWdlLnB5dGhvbjNdOiBweXRob25Db25maWcgYXMgQ29kZU5vZGVUeXBlLFxuICAgICAgICB9IGFzIGFueSlcbiAgICAgIH0pKClcbiAgICB9XG4gIH0sIFtwaXBlbGluZUlkXSlcblxuICBjb25zdCBkZWZhdWx0Q29uZmlnID0gdXNlU3RvcmUocyA9PiBzLm5vZGVzRGVmYXVsdENvbmZpZ3MpPy5bcGF5bG9hZC50eXBlXVxuICBjb25zdCB7IGlucHV0cywgc2V0SW5wdXRzIH0gPSB1c2VOb2RlQ3J1ZDxDb2RlTm9kZVR5cGU+KGlkLCBwYXlsb2FkKVxuICBjb25zdCB7IGhhbmRsZVZhckxpc3RDaGFuZ2UsIGhhbmRsZUFkZFZhcmlhYmxlIH0gPSB1c2VWYXJMaXN0PENvZGVOb2RlVHlwZT4oe1xuICAgIGlucHV0cyxcbiAgICBzZXRJbnB1dHMsXG4gIH0pXG5cbiAgY29uc3QgW291dHB1dEtleU9yZGVycywgc2V0T3V0cHV0S2V5T3JkZXJzXSA9IHVzZVN0YXRlPHN0cmluZ1tdPihbXSlcbiAgY29uc3Qgc3luY091dHB1dEtleU9yZGVycyA9IHVzZUNhbGxiYWNrKChvdXRwdXRzOiBPdXRwdXRWYXIpID0+IHtcbiAgICBzZXRPdXRwdXRLZXlPcmRlcnMoT2JqZWN0LmtleXMob3V0cHV0cykpXG4gIH0sIFtdKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpbnB1dHMuY29kZSkge1xuICAgICAgaWYgKGlucHV0cy5vdXRwdXRzICYmIE9iamVjdC5rZXlzKGlucHV0cy5vdXRwdXRzKS5sZW5ndGggPiAwKVxuICAgICAgICBzeW5jT3V0cHV0S2V5T3JkZXJzKGlucHV0cy5vdXRwdXRzKVxuXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBpc1JlYWR5ID0gZGVmYXVsdENvbmZpZyAmJiBPYmplY3Qua2V5cyhkZWZhdWx0Q29uZmlnKS5sZW5ndGggPiAwXG4gICAgaWYgKGlzUmVhZHkpIHtcbiAgICAgIHNldElucHV0cyh7XG4gICAgICAgIC4uLmlucHV0cyxcbiAgICAgICAgLi4uZGVmYXVsdENvbmZpZyxcbiAgICAgIH0pXG4gICAgICBzeW5jT3V0cHV0S2V5T3JkZXJzKGRlZmF1bHRDb25maWcub3V0cHV0cylcbiAgICB9XG4gIH0sIFtkZWZhdWx0Q29uZmlnXSlcblxuICBjb25zdCBoYW5kbGVDb2RlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGNvZGU6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRzLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmNvZGUgPSBjb2RlXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbaW5wdXRzLCBzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZUNvZGVMYW5ndWFnZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChjb2RlTGFuZ3VhZ2U6IENvZGVMYW5ndWFnZSkgPT4ge1xuICAgIGNvbnN0IGN1cnJEZWZhdWx0Q29uZmlnID0gYWxsTGFuZ3VhZ2VEZWZhdWx0Py5bY29kZUxhbmd1YWdlXVxuXG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dHMsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQuY29kZV9sYW5ndWFnZSA9IGNvZGVMYW5ndWFnZVxuICAgICAgaWYgKCFjdXJyRGVmYXVsdENvbmZpZylcbiAgICAgICAgcmV0dXJuXG4gICAgICBkcmFmdC5jb2RlID0gY3VyckRlZmF1bHRDb25maWcuY29kZVxuICAgICAgZHJhZnQudmFyaWFibGVzID0gY3VyckRlZmF1bHRDb25maWcudmFyaWFibGVzXG4gICAgICBkcmFmdC5vdXRwdXRzID0gY3VyckRlZmF1bHRDb25maWcub3V0cHV0c1xuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW2FsbExhbmd1YWdlRGVmYXVsdCwgaW5wdXRzLCBzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZVN5bmNGdW5jdGlvblNpZ25hdHVyZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBnZW5lcmF0ZVN5bmNTaWduYXR1cmVDb2RlID0gKGNvZGU6IHN0cmluZykgPT4ge1xuICAgICAgbGV0IG1haW5EZWZSZVxuICAgICAgbGV0IG5ld01haW5EZWZcbiAgICAgIGlmIChpbnB1dHMuY29kZV9sYW5ndWFnZSA9PT0gQ29kZUxhbmd1YWdlLmphdmFzY3JpcHQpIHtcbiAgICAgICAgbWFpbkRlZlJlID0gL2Z1bmN0aW9uXFxzK21haW5cXGJcXHMqXFwoW1xcc1xcU10qP1xcKS9nXG4gICAgICAgIG5ld01haW5EZWYgPSAnZnVuY3Rpb24gbWFpbih7e3Zhcl9saXN0fX0pJ1xuICAgICAgICBsZXQgcGFyYW1fbGlzdCA9IGlucHV0cy52YXJpYWJsZXM/Lm1hcChpdGVtID0+IGl0ZW0udmFyaWFibGUpLmpvaW4oJywgJykgfHwgJydcbiAgICAgICAgcGFyYW1fbGlzdCA9IHBhcmFtX2xpc3QgPyBgeyR7cGFyYW1fbGlzdH19YCA6ICcnXG4gICAgICAgIG5ld01haW5EZWYgPSBuZXdNYWluRGVmLnJlcGxhY2UoJ3t7dmFyX2xpc3R9fScsIHBhcmFtX2xpc3QpXG4gICAgICB9XG5cbiAgICAgIGVsc2UgaWYgKGlucHV0cy5jb2RlX2xhbmd1YWdlID09PSBDb2RlTGFuZ3VhZ2UucHl0aG9uMykge1xuICAgICAgICBtYWluRGVmUmUgPSAvZGVmXFxzK21haW5cXGJcXHMqXFwoW1xcc1xcU10qP1xcKS9nXG4gICAgICAgIGNvbnN0IHBhcmFtX2xpc3QgPSBbXVxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgaW5wdXRzLnZhcmlhYmxlcykge1xuICAgICAgICAgIGxldCBwYXJhbSA9IGl0ZW0udmFyaWFibGVcbiAgICAgICAgICBsZXQgcGFyYW1fdHlwZSA9ICcnXG4gICAgICAgICAgc3dpdGNoIChpdGVtLnZhbHVlX3R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgVmFyVHlwZS5zdHJpbmc6XG4gICAgICAgICAgICAgIHBhcmFtX3R5cGUgPSAnOiBzdHInXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFZhclR5cGUubnVtYmVyOlxuICAgICAgICAgICAgICBwYXJhbV90eXBlID0gJzogZmxvYXQnXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFZhclR5cGUub2JqZWN0OlxuICAgICAgICAgICAgICBwYXJhbV90eXBlID0gJzogZGljdCdcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgVmFyVHlwZS5hcnJheTpcbiAgICAgICAgICAgICAgcGFyYW1fdHlwZSA9ICc6IGxpc3QnXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlIFZhclR5cGUuYXJyYXlOdW1iZXI6XG4gICAgICAgICAgICAgIHBhcmFtX3R5cGUgPSAnOiBsaXN0W2Zsb2F0XSdcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgVmFyVHlwZS5hcnJheVN0cmluZzpcbiAgICAgICAgICAgICAgcGFyYW1fdHlwZSA9ICc6IGxpc3Rbc3RyXSdcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgVmFyVHlwZS5hcnJheU9iamVjdDpcbiAgICAgICAgICAgICAgcGFyYW1fdHlwZSA9ICc6IGxpc3RbZGljdF0nXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICAgIHBhcmFtICs9IHBhcmFtX3R5cGVcbiAgICAgICAgICBwYXJhbV9saXN0LnB1c2goYCR7cGFyYW19YClcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld01haW5EZWYgPSBgZGVmIG1haW4oJHtwYXJhbV9saXN0LmpvaW4oJywgJyl9KWBcbiAgICAgIH1cbiAgICAgIGVsc2UgeyByZXR1cm4gY29kZSB9XG5cbiAgICAgIGNvbnN0IG5ld0NvZGUgPSBjb2RlLnJlcGxhY2UobWFpbkRlZlJlLCBuZXdNYWluRGVmKVxuICAgICAgcmV0dXJuIG5ld0NvZGVcbiAgICB9XG5cbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0cywgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5jb2RlID0gZ2VuZXJhdGVTeW5jU2lnbmF0dXJlQ29kZShkcmFmdC5jb2RlKVxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW2lucHV0cywgc2V0SW5wdXRzXSlcblxuICBjb25zdCB7XG4gICAgaGFuZGxlVmFyc0NoYW5nZSxcbiAgICBoYW5kbGVBZGRWYXJpYWJsZTogaGFuZGxlQWRkT3V0cHV0VmFyaWFibGUsXG4gICAgaGFuZGxlUmVtb3ZlVmFyaWFibGUsXG4gICAgaXNTaG93UmVtb3ZlVmFyQ29uZmlybSxcbiAgICBoaWRlUmVtb3ZlVmFyQ29uZmlybSxcbiAgICBvblJlbW92ZVZhckNvbmZpcm0sXG4gIH0gPSB1c2VPdXRwdXRWYXJMaXN0PENvZGVOb2RlVHlwZT4oe1xuICAgIGlkLFxuICAgIGlucHV0cyxcbiAgICBzZXRJbnB1dHMsXG4gICAgb3V0cHV0S2V5T3JkZXJzLFxuICAgIG9uT3V0cHV0S2V5T3JkZXJzQ2hhbmdlOiBzZXRPdXRwdXRLZXlPcmRlcnMsXG4gIH0pXG5cbiAgY29uc3QgZmlsdGVyVmFyID0gdXNlQ2FsbGJhY2soKHZhclBheWxvYWQ6IFZhcikgPT4ge1xuICAgIHJldHVybiBbVmFyVHlwZS5zdHJpbmcsIFZhclR5cGUubnVtYmVyLCBWYXJUeXBlLmJvb2xlYW4sIFZhclR5cGUuc2VjcmV0LCBWYXJUeXBlLm9iamVjdCwgVmFyVHlwZS5hcnJheSwgVmFyVHlwZS5hcnJheU51bWJlciwgVmFyVHlwZS5hcnJheVN0cmluZywgVmFyVHlwZS5hcnJheU9iamVjdCwgVmFyVHlwZS5hcnJheUJvb2xlYW4sIFZhclR5cGUuZmlsZSwgVmFyVHlwZS5hcnJheUZpbGVdLmluY2x1ZGVzKHZhclBheWxvYWQudHlwZSlcbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlQ29kZUFuZFZhcnNDaGFuZ2UgPSB1c2VDYWxsYmFjaygoY29kZTogc3RyaW5nLCBpbnB1dFZhcmlhYmxlczogVmFyaWFibGVbXSwgb3V0cHV0VmFyaWFibGVzOiBPdXRwdXRWYXIpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0cywgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5jb2RlID0gY29kZVxuICAgICAgZHJhZnQudmFyaWFibGVzID0gaW5wdXRWYXJpYWJsZXNcbiAgICAgIGRyYWZ0Lm91dHB1dHMgPSBvdXRwdXRWYXJpYWJsZXNcbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gICAgc3luY091dHB1dEtleU9yZGVycyhvdXRwdXRWYXJpYWJsZXMpXG4gIH0sIFtpbnB1dHMsIHNldElucHV0cywgc3luY091dHB1dEtleU9yZGVyc10pXG4gIHJldHVybiB7XG4gICAgcmVhZE9ubHksXG4gICAgaW5wdXRzLFxuICAgIG91dHB1dEtleU9yZGVycyxcbiAgICBoYW5kbGVWYXJMaXN0Q2hhbmdlLFxuICAgIGhhbmRsZUFkZFZhcmlhYmxlLFxuICAgIGhhbmRsZVJlbW92ZVZhcmlhYmxlLFxuICAgIGhhbmRsZVN5bmNGdW5jdGlvblNpZ25hdHVyZSxcbiAgICBoYW5kbGVDb2RlQ2hhbmdlLFxuICAgIGhhbmRsZUNvZGVMYW5ndWFnZUNoYW5nZSxcbiAgICBoYW5kbGVWYXJzQ2hhbmdlLFxuICAgIGZpbHRlclZhcixcbiAgICBoYW5kbGVBZGRPdXRwdXRWYXJpYWJsZSxcbiAgICBpc1Nob3dSZW1vdmVWYXJDb25maXJtLFxuICAgIGhpZGVSZW1vdmVWYXJDb25maXJtLFxuICAgIG9uUmVtb3ZlVmFyQ29uZmlybSxcbiAgICBoYW5kbGVDb2RlQW5kVmFyc0NoYW5nZSxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VDb25maWdcbiJdfQ==