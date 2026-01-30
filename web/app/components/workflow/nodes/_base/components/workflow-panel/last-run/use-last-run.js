"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const toast_1 = require("@/app/components/base/toast");
const hooks_1 = require("@/app/components/workflow/hooks");
const use_checklist_1 = require("@/app/components/workflow/hooks/use-checklist");
const use_inspect_vars_crud_1 = require("@/app/components/workflow/hooks/use-inspect-vars-crud");
const use_one_step_run_1 = require("@/app/components/workflow/nodes/_base/hooks/use-one-step-run");
const use_single_run_form_params_1 = require("@/app/components/workflow/nodes/agent/use-single-run-form-params");
const use_single_run_form_params_2 = require("@/app/components/workflow/nodes/assigner/use-single-run-form-params");
const use_single_run_form_params_3 = require("@/app/components/workflow/nodes/code/use-single-run-form-params");
const use_single_run_form_params_4 = require("@/app/components/workflow/nodes/document-extractor/use-single-run-form-params");
const use_single_run_form_params_5 = require("@/app/components/workflow/nodes/http/use-single-run-form-params");
const use_single_run_form_params_6 = require("@/app/components/workflow/nodes/if-else/use-single-run-form-params");
const use_single_run_form_params_7 = require("@/app/components/workflow/nodes/iteration/use-single-run-form-params");
const use_single_run_form_params_8 = require("@/app/components/workflow/nodes/knowledge-base/use-single-run-form-params");
const use_single_run_form_params_9 = require("@/app/components/workflow/nodes/knowledge-retrieval/use-single-run-form-params");
const use_single_run_form_params_10 = require("@/app/components/workflow/nodes/llm/use-single-run-form-params");
const use_single_run_form_params_11 = require("@/app/components/workflow/nodes/loop/use-single-run-form-params");
const use_single_run_form_params_12 = require("@/app/components/workflow/nodes/parameter-extractor/use-single-run-form-params");
const use_single_run_form_params_13 = require("@/app/components/workflow/nodes/question-classifier/use-single-run-form-params");
const use_single_run_form_params_14 = require("@/app/components/workflow/nodes/start/use-single-run-form-params");
const use_single_run_form_params_15 = require("@/app/components/workflow/nodes/template-transform/use-single-run-form-params");
const use_get_data_for_check_more_1 = require("@/app/components/workflow/nodes/tool/use-get-data-for-check-more");
const use_single_run_form_params_16 = require("@/app/components/workflow/nodes/tool/use-single-run-form-params");
const use_check_params_1 = require("@/app/components/workflow/nodes/trigger-plugin/use-check-params");
const use_single_run_form_params_17 = require("@/app/components/workflow/nodes/variable-assigner/use-single-run-form-params");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const config_1 = require("@/config");
const use_workflow_1 = require("@/service/use-workflow");
const tab_1 = require("../tab");
const singleRunFormParamsHooks = {
    [types_1.BlockEnum.LLM]: use_single_run_form_params_10.default,
    [types_1.BlockEnum.KnowledgeRetrieval]: use_single_run_form_params_9.default,
    [types_1.BlockEnum.Code]: use_single_run_form_params_3.default,
    [types_1.BlockEnum.TemplateTransform]: use_single_run_form_params_15.default,
    [types_1.BlockEnum.QuestionClassifier]: use_single_run_form_params_13.default,
    [types_1.BlockEnum.HttpRequest]: use_single_run_form_params_5.default,
    [types_1.BlockEnum.Tool]: use_single_run_form_params_16.default,
    [types_1.BlockEnum.ParameterExtractor]: use_single_run_form_params_12.default,
    [types_1.BlockEnum.Iteration]: use_single_run_form_params_7.default,
    [types_1.BlockEnum.Agent]: use_single_run_form_params_1.default,
    [types_1.BlockEnum.DocExtractor]: use_single_run_form_params_4.default,
    [types_1.BlockEnum.Loop]: use_single_run_form_params_11.default,
    [types_1.BlockEnum.Start]: use_single_run_form_params_14.default,
    [types_1.BlockEnum.IfElse]: use_single_run_form_params_6.default,
    [types_1.BlockEnum.VariableAggregator]: use_single_run_form_params_17.default,
    [types_1.BlockEnum.Assigner]: use_single_run_form_params_2.default,
    [types_1.BlockEnum.KnowledgeBase]: use_single_run_form_params_8.default,
    [types_1.BlockEnum.VariableAssigner]: undefined,
    [types_1.BlockEnum.End]: undefined,
    [types_1.BlockEnum.Answer]: undefined,
    [types_1.BlockEnum.ListFilter]: undefined,
    [types_1.BlockEnum.IterationStart]: undefined,
    [types_1.BlockEnum.LoopStart]: undefined,
    [types_1.BlockEnum.LoopEnd]: undefined,
    [types_1.BlockEnum.DataSource]: undefined,
    [types_1.BlockEnum.DataSourceEmpty]: undefined,
    [types_1.BlockEnum.TriggerWebhook]: undefined,
    [types_1.BlockEnum.TriggerSchedule]: undefined,
    [types_1.BlockEnum.TriggerPlugin]: undefined,
};
const useSingleRunFormParamsHooks = (nodeType) => {
    return (params) => {
        return singleRunFormParamsHooks[nodeType]?.(params) || {};
    };
};
const getDataForCheckMoreHooks = {
    [types_1.BlockEnum.Tool]: use_get_data_for_check_more_1.default,
    [types_1.BlockEnum.LLM]: undefined,
    [types_1.BlockEnum.KnowledgeRetrieval]: undefined,
    [types_1.BlockEnum.Code]: undefined,
    [types_1.BlockEnum.TemplateTransform]: undefined,
    [types_1.BlockEnum.QuestionClassifier]: undefined,
    [types_1.BlockEnum.HttpRequest]: undefined,
    [types_1.BlockEnum.ParameterExtractor]: undefined,
    [types_1.BlockEnum.Iteration]: undefined,
    [types_1.BlockEnum.Agent]: undefined,
    [types_1.BlockEnum.DocExtractor]: undefined,
    [types_1.BlockEnum.Loop]: undefined,
    [types_1.BlockEnum.Start]: undefined,
    [types_1.BlockEnum.IfElse]: undefined,
    [types_1.BlockEnum.VariableAggregator]: undefined,
    [types_1.BlockEnum.End]: undefined,
    [types_1.BlockEnum.Answer]: undefined,
    [types_1.BlockEnum.VariableAssigner]: undefined,
    [types_1.BlockEnum.ListFilter]: undefined,
    [types_1.BlockEnum.IterationStart]: undefined,
    [types_1.BlockEnum.Assigner]: undefined,
    [types_1.BlockEnum.LoopStart]: undefined,
    [types_1.BlockEnum.LoopEnd]: undefined,
    [types_1.BlockEnum.DataSource]: undefined,
    [types_1.BlockEnum.DataSourceEmpty]: undefined,
    [types_1.BlockEnum.KnowledgeBase]: undefined,
    [types_1.BlockEnum.TriggerWebhook]: undefined,
    [types_1.BlockEnum.TriggerSchedule]: undefined,
    [types_1.BlockEnum.TriggerPlugin]: use_check_params_1.default,
};
const useGetDataForCheckMoreHooks = (nodeType) => {
    return (id, payload) => {
        return getDataForCheckMoreHooks[nodeType]?.({ id, payload }) || {
            getData: () => {
                return {};
            },
        };
    };
};
const useLastRun = ({ ...oneStepRunParams }) => {
    const { conversationVars, systemVars, hasSetInspectVar } = (0, use_inspect_vars_crud_1.default)();
    const blockType = oneStepRunParams.data.type;
    const isStartNode = blockType === types_1.BlockEnum.Start;
    const isIterationNode = blockType === types_1.BlockEnum.Iteration;
    const isLoopNode = blockType === types_1.BlockEnum.Loop;
    const isAggregatorNode = blockType === types_1.BlockEnum.VariableAggregator;
    const isCustomRunNode = (0, utils_1.isSupportCustomRunForm)(blockType);
    const { handleSyncWorkflowDraft } = (0, hooks_1.useNodesSyncDraft)();
    const { getData: getDataForCheckMore, } = useGetDataForCheckMoreHooks(blockType)(oneStepRunParams.id, oneStepRunParams.data);
    const [isRunAfterSingleRun, setIsRunAfterSingleRun] = (0, react_1.useState)(false);
    const { id, flowId, flowType, data, } = oneStepRunParams;
    const oneStepRunRes = (0, use_one_step_run_1.default)({
        ...oneStepRunParams,
        iteratorInputKey: blockType === types_1.BlockEnum.Iteration ? `${id}.input_selector` : '',
        moreDataForCheckValid: getDataForCheckMore(),
        isRunAfterSingleRun,
    });
    const { warningNodes } = (0, use_checklist_1.useWorkflowRunValidation)();
    const blockIfChecklistFailed = (0, react_1.useCallback)(() => {
        const warningForNode = warningNodes.find(item => item.id === id);
        if (!warningForNode)
            return false;
        const message = warningForNode.errorMessage || 'This node has unresolved checklist issues';
        toast_1.default.notify({ type: 'error', message });
        return true;
    }, [warningNodes, id]);
    const { hideSingleRun, handleRun: doCallRunApi, getInputVars, toVarInputs, varSelectorsToVarInputs, runInputData, runInputDataRef, setRunInputData, showSingleRun, runResult, iterationRunResult, loopRunResult, setNodeRunning, checkValid, } = oneStepRunRes;
    const nodeInfo = runResult;
    const { ...singleRunParams } = useSingleRunFormParamsHooks(blockType)({
        id,
        payload: data,
        runInputData,
        runInputDataRef,
        getInputVars,
        setRunInputData,
        toVarInputs,
        varSelectorsToVarInputs,
        runResult,
        iterationRunResult,
        loopRunResult,
    });
    const toSubmitData = (0, react_1.useCallback)((data) => {
        if (!isIterationNode && !isLoopNode)
            return data;
        const allVarObject = singleRunParams?.allVarObject || {};
        const formattedData = {};
        Object.keys(allVarObject).forEach((key) => {
            const [varSectorStr, nodeId] = key.split(config_1.VALUE_SELECTOR_DELIMITER);
            formattedData[`${nodeId}.${allVarObject[key].inSingleRunPassedKey}`] = data[varSectorStr];
        });
        if (isIterationNode) {
            const iteratorInputKey = `${id}.input_selector`;
            formattedData[iteratorInputKey] = data[iteratorInputKey];
        }
        return formattedData;
    }, [isIterationNode, isLoopNode, singleRunParams?.allVarObject, id]);
    const callRunApi = (data, cb) => {
        handleSyncWorkflowDraft(true, true, {
            onSuccess() {
                doCallRunApi(toSubmitData(data));
                cb?.();
            },
        });
    };
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { setInitShowLastRunTab, setShowVariableInspectPanel } = workflowStore.getState();
    const initShowLastRunTab = (0, store_1.useStore)(s => s.initShowLastRunTab);
    const [tabType, setTabType] = (0, react_1.useState)(initShowLastRunTab ? tab_1.TabType.lastRun : tab_1.TabType.settings);
    (0, react_1.useEffect)(() => {
        if (initShowLastRunTab)
            setTabType(tab_1.TabType.lastRun);
        setInitShowLastRunTab(false);
    }, [initShowLastRunTab]);
    const invalidLastRun = (0, use_workflow_1.useInvalidLastRun)(flowType, flowId, id);
    const handleRunWithParams = async (data) => {
        if (blockIfChecklistFailed())
            return;
        const { isValid } = checkValid();
        if (!isValid)
            return;
        setNodeRunning();
        setIsRunAfterSingleRun(true);
        setTabType(tab_1.TabType.lastRun);
        callRunApi(data, () => {
            invalidLastRun();
        });
        hideSingleRun();
    };
    const handleTabClicked = (0, react_1.useCallback)((type) => {
        setIsRunAfterSingleRun(false);
        setTabType(type);
    }, []);
    const getExistVarValuesInForms = (forms) => {
        if (!forms || forms.length === 0)
            return [];
        const valuesArr = forms.map((form) => {
            const values = {};
            form.inputs.forEach(({ variable, getVarValueFromDependent }) => {
                const isGetValueFromDependent = getVarValueFromDependent || !variable.includes('.');
                if (isGetValueFromDependent && !singleRunParams?.getDependentVar)
                    return;
                const selector = isGetValueFromDependent ? (singleRunParams?.getDependentVar(variable) || []) : variable.slice(1, -1).split('.');
                if (!selector || selector.length === 0)
                    return;
                const [nodeId, varName] = selector.slice(0, 2);
                if (!isStartNode && nodeId === id) { // inner vars like loop vars
                    values[variable] = true;
                    return;
                }
                const inspectVarValue = hasSetInspectVar(nodeId, varName, systemVars, conversationVars); // also detect system var , env and  conversation var
                if (inspectVarValue)
                    values[variable] = true;
            });
            return values;
        });
        return valuesArr;
    };
    const isAllVarsHasValue = (vars) => {
        if (!vars || vars.length === 0)
            return true;
        return vars.every((varItem) => {
            const [nodeId, varName] = varItem.slice(0, 2);
            const inspectVarValue = hasSetInspectVar(nodeId, varName, systemVars, conversationVars); // also detect system var , env and  conversation var
            return inspectVarValue;
        });
    };
    const isSomeVarsHasValue = (vars) => {
        if (!vars || vars.length === 0)
            return true;
        return vars.some((varItem) => {
            const [nodeId, varName] = varItem.slice(0, 2);
            const inspectVarValue = hasSetInspectVar(nodeId, varName, systemVars, conversationVars); // also detect system var , env and  conversation var
            return inspectVarValue;
        });
    };
    const getFilteredExistVarForms = (forms) => {
        if (!forms || forms.length === 0)
            return [];
        const existVarValuesInForms = getExistVarValuesInForms(forms);
        const res = forms.map((form, i) => {
            const existVarValuesInForm = existVarValuesInForms[i];
            const newForm = { ...form };
            const inputs = form.inputs.filter((input) => {
                return !(input.variable in existVarValuesInForm);
            });
            newForm.inputs = inputs;
            return newForm;
        }).filter(form => form.inputs.length > 0);
        return res;
    };
    const checkAggregatorVarsSet = (vars) => {
        if (!vars || vars.length === 0)
            return true;
        // in each group, at last one set is ok
        return vars.every((varItem) => {
            return isSomeVarsHasValue(varItem);
        });
    };
    const handleAfterCustomSingleRun = () => {
        invalidLastRun();
        setTabType(tab_1.TabType.lastRun);
        hideSingleRun();
    };
    const handleSingleRun = () => {
        if (blockIfChecklistFailed())
            return;
        const { isValid } = checkValid();
        if (!isValid)
            return;
        if (blockType === types_1.BlockEnum.TriggerWebhook || blockType === types_1.BlockEnum.TriggerPlugin || blockType === types_1.BlockEnum.TriggerSchedule)
            setShowVariableInspectPanel(true);
        if (isCustomRunNode) {
            showSingleRun();
            return;
        }
        const vars = singleRunParams?.getDependentVars?.();
        // no need to input params
        if (isAggregatorNode ? checkAggregatorVarsSet(vars) : isAllVarsHasValue(vars)) {
            callRunApi({}, async () => {
                setIsRunAfterSingleRun(true);
                setNodeRunning();
                invalidLastRun();
                setTabType(tab_1.TabType.lastRun);
            });
        }
        else {
            showSingleRun();
        }
    };
    return {
        ...oneStepRunRes,
        tabType,
        isRunAfterSingleRun,
        setIsRunAfterSingleRun,
        setTabType: handleTabClicked,
        handleAfterCustomSingleRun,
        singleRunParams,
        nodeInfo,
        setRunInputData,
        handleSingleRun,
        handleRunWithParams,
        getExistVarValuesInForms,
        getFilteredExistVarForms,
    };
};
exports.default = useLastRun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWxhc3QtcnVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWxhc3QtcnVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsaUNBQXdEO0FBQ3hELHVEQUErQztBQUMvQywyREFFd0M7QUFDeEMsaUZBQXdGO0FBQ3hGLGlHQUFzRjtBQUN0RixtR0FBd0Y7QUFDeEYsaUhBQTBHO0FBQzFHLG9IQUF3SDtBQUN4SCxnSEFBd0c7QUFDeEcsOEhBQThIO0FBQzlILGdIQUErRztBQUMvRyxtSEFBNkc7QUFDN0cscUhBQWtIO0FBQ2xILDBIQUEySDtBQUMzSCwrSEFBcUk7QUFDckksZ0hBQXNHO0FBQ3RHLGlIQUF3RztBQUN4RyxnSUFBcUk7QUFDckksZ0lBQXFJO0FBRXJJLGtIQUEwRztBQUMxRywrSEFBbUk7QUFDbkksa0hBQXlHO0FBRXpHLGlIQUF3RztBQUN4RyxzR0FBaUg7QUFDakgsOEhBQW1JO0FBQ25JLDJEQUE0RTtBQUM1RSwyREFBMkQ7QUFDM0QsMkRBQXdFO0FBQ3hFLHFDQUFnRTtBQUNoRSx5REFBMEQ7QUFDMUQsZ0NBQWdDO0FBRWhDLE1BQU0sd0JBQXdCLEdBQTJCO0lBQ3ZELENBQUMsaUJBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxxQ0FBeUI7SUFDMUMsQ0FBQyxpQkFBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsb0NBQXdDO0lBQ3hFLENBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxvQ0FBMEI7SUFDNUMsQ0FBQyxpQkFBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUUscUNBQXVDO0lBQ3RFLENBQUMsaUJBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLHFDQUF3QztJQUN4RSxDQUFDLGlCQUFTLENBQUMsV0FBVyxDQUFDLEVBQUUsb0NBQWlDO0lBQzFELENBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxxQ0FBMEI7SUFDNUMsQ0FBQyxpQkFBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUUscUNBQXdDO0lBQ3hF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QUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzlFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ3hCLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUM1QixjQUFjLEVBQUUsQ0FBQTtnQkFDaEIsY0FBYyxFQUFFLENBQUE7Z0JBQ2hCLFVBQVUsQ0FBQyxhQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDN0IsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDO2FBQ0ksQ0FBQztZQUNKLGFBQWEsRUFBRSxDQUFBO1FBQ2pCLENBQUM7SUFDSCxDQUFDLENBQUE7SUFFRCxPQUFPO1FBQ0wsR0FBRyxhQUFhO1FBQ2hCLE9BQU87UUFDUCxtQkFBbUI7UUFDbkIsc0JBQXNCO1FBQ3RCLFVBQVUsRUFBRSxnQkFBZ0I7UUFDNUIsMEJBQTBCO1FBQzFCLGVBQWU7UUFDZixRQUFRO1FBQ1IsZUFBZTtRQUNmLGVBQWU7UUFDZixtQkFBbUI7UUFDbkIsd0JBQXdCO1FBQ3hCLHdCQUF3QjtLQUN6QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQcm9wcyBhcyBGb3JtUHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL19iYXNlL2NvbXBvbmVudHMvYmVmb3JlLXJ1bi1mb3JtL2Zvcm0nXG5pbXBvcnQgdHlwZSB7IFBhcmFtcyBhcyBPbmVTdGVwUnVuUGFyYW1zIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9ob29rcy91c2Utb25lLXN0ZXAtcnVuJ1xuLy8gaW1wb3J0XG5pbXBvcnQgdHlwZSB7IENvbW1vbk5vZGVUeXBlLCBWYWx1ZVNlbGVjdG9yIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHtcbiAgdXNlTm9kZXNTeW5jRHJhZnQsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1J1blZhbGlkYXRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1jaGVja2xpc3QnXG5pbXBvcnQgdXNlSW5zcGVjdFZhcnNDcnVkIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MvdXNlLWluc3BlY3QtdmFycy1jcnVkJ1xuaW1wb3J0IHVzZU9uZVN0ZXBSdW4gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9ob29rcy91c2Utb25lLXN0ZXAtcnVuJ1xuaW1wb3J0IHVzZUFnZW50U2luZ2xlUnVuRm9ybVBhcmFtcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2FnZW50L3VzZS1zaW5nbGUtcnVuLWZvcm0tcGFyYW1zJ1xuaW1wb3J0IHVzZVZhcmlhYmxlQXNzaWduZXJTaW5nbGVSdW5Gb3JtUGFyYW1zIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvYXNzaWduZXIvdXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMnXG5pbXBvcnQgdXNlQ29kZVNpbmdsZVJ1bkZvcm1QYXJhbXMgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9jb2RlL3VzZS1zaW5nbGUtcnVuLWZvcm0tcGFyYW1zJ1xuaW1wb3J0IHVzZURvY0V4dHJhY3RvclNpbmdsZVJ1bkZvcm1QYXJhbXMgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9kb2N1bWVudC1leHRyYWN0b3IvdXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMnXG5pbXBvcnQgdXNlSHR0cFJlcXVlc3RTaW5nbGVSdW5Gb3JtUGFyYW1zIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvaHR0cC91c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcydcbmltcG9ydCB1c2VJZkVsc2VTaW5nbGVSdW5Gb3JtUGFyYW1zIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvaWYtZWxzZS91c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcydcbmltcG9ydCB1c2VJdGVyYXRpb25TaW5nbGVSdW5Gb3JtUGFyYW1zIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvaXRlcmF0aW9uL3VzZS1zaW5nbGUtcnVuLWZvcm0tcGFyYW1zJ1xuaW1wb3J0IHVzZUtub3dsZWRnZUJhc2VTaW5nbGVSdW5Gb3JtUGFyYW1zIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMva25vd2xlZGdlLWJhc2UvdXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMnXG5pbXBvcnQgdXNlS25vd2xlZGdlUmV0cmlldmFsU2luZ2xlUnVuRm9ybVBhcmFtcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvdXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMnXG5pbXBvcnQgdXNlTExNU2luZ2xlUnVuRm9ybVBhcmFtcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2xsbS91c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcydcbmltcG9ydCB1c2VMb29wU2luZ2xlUnVuRm9ybVBhcmFtcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2xvb3AvdXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMnXG5pbXBvcnQgdXNlUGFyYW1ldGVyRXh0cmFjdG9yU2luZ2xlUnVuRm9ybVBhcmFtcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3BhcmFtZXRlci1leHRyYWN0b3IvdXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMnXG5pbXBvcnQgdXNlUXVlc3Rpb25DbGFzc2lmaWVyU2luZ2xlUnVuRm9ybVBhcmFtcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3F1ZXN0aW9uLWNsYXNzaWZpZXIvdXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMnXG5cbmltcG9ydCB1c2VTdGFydFNpbmdsZVJ1bkZvcm1QYXJhbXMgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9zdGFydC91c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcydcbmltcG9ydCB1c2VUZW1wbGF0ZVRyYW5zZm9ybVNpbmdsZVJ1bkZvcm1QYXJhbXMgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy90ZW1wbGF0ZS10cmFuc2Zvcm0vdXNlLXNpbmdsZS1ydW4tZm9ybS1wYXJhbXMnXG5pbXBvcnQgdXNlVG9vbEdldERhdGFGb3JDaGVja01vcmUgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy90b29sL3VzZS1nZXQtZGF0YS1mb3ItY2hlY2stbW9yZSdcblxuaW1wb3J0IHVzZVRvb2xTaW5nbGVSdW5Gb3JtUGFyYW1zIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvdG9vbC91c2Utc2luZ2xlLXJ1bi1mb3JtLXBhcmFtcydcbmltcG9ydCB1c2VUcmlnZ2VyUGx1Z2luR2V0RGF0YUZvckNoZWNrTW9yZSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3RyaWdnZXItcGx1Z2luL3VzZS1jaGVjay1wYXJhbXMnXG5pbXBvcnQgdXNlVmFyaWFibGVBZ2dyZWdhdG9yU2luZ2xlUnVuRm9ybVBhcmFtcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL3ZhcmlhYmxlLWFzc2lnbmVyL3VzZS1zaW5nbGUtcnVuLWZvcm0tcGFyYW1zJ1xuaW1wb3J0IHsgdXNlU3RvcmUsIHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGlzU3VwcG9ydEN1c3RvbVJ1bkZvcm0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuaW1wb3J0IHsgVkFMVUVfU0VMRUNUT1JfREVMSU1JVEVSIGFzIERFTElNSVRFUiB9IGZyb20gJ0AvY29uZmlnJ1xuaW1wb3J0IHsgdXNlSW52YWxpZExhc3RSdW4gfSBmcm9tICdAL3NlcnZpY2UvdXNlLXdvcmtmbG93J1xuaW1wb3J0IHsgVGFiVHlwZSB9IGZyb20gJy4uL3RhYidcblxuY29uc3Qgc2luZ2xlUnVuRm9ybVBhcmFtc0hvb2tzOiBSZWNvcmQ8QmxvY2tFbnVtLCBhbnk+ID0ge1xuICBbQmxvY2tFbnVtLkxMTV06IHVzZUxMTVNpbmdsZVJ1bkZvcm1QYXJhbXMsXG4gIFtCbG9ja0VudW0uS25vd2xlZGdlUmV0cmlldmFsXTogdXNlS25vd2xlZGdlUmV0cmlldmFsU2luZ2xlUnVuRm9ybVBhcmFtcyxcbiAgW0Jsb2NrRW51bS5Db2RlXTogdXNlQ29kZVNpbmdsZVJ1bkZvcm1QYXJhbXMsXG4gIFtCbG9ja0VudW0uVGVtcGxhdGVUcmFuc2Zvcm1dOiB1c2VUZW1wbGF0ZVRyYW5zZm9ybVNpbmdsZVJ1bkZvcm1QYXJhbXMsXG4gIFtCbG9ja0VudW0uUXVlc3Rpb25DbGFzc2lmaWVyXTogdXNlUXVlc3Rpb25DbGFzc2lmaWVyU2luZ2xlUnVuRm9ybVBhcmFtcyxcbiAgW0Jsb2NrRW51bS5IdHRwUmVxdWVzdF06IHVzZUh0dHBSZXF1ZXN0U2luZ2xlUnVuRm9ybVBhcmFtcyxcbiAgW0Jsb2NrRW51bS5Ub29sXTogdXNlVG9vbFNpbmdsZVJ1bkZvcm1QYXJhbXMsXG4gIFtCbG9ja0VudW0uUGFyYW1ldGVyRXh0cmFjdG9yXTogdXNlUGFyYW1ldGVyRXh0cmFjdG9yU2luZ2xlUnVuRm9ybVBhcmFtcyxcbiAgW0Jsb2NrRW51bS5JdGVyYXRpb25dOiB1c2VJdGVyYXRpb25TaW5nbGVSdW5Gb3JtUGFyYW1zLFxuICBbQmxvY2tFbnVtLkFnZW50XTogdXNlQWdlbnRTaW5nbGVSdW5Gb3JtUGFyYW1zLFxuICBbQmxvY2tFbnVtLkRvY0V4dHJhY3Rvcl06IHVzZURvY0V4dHJhY3RvclNpbmdsZVJ1bkZvcm1QYXJhbXMsXG4gIFtCbG9ja0VudW0uTG9vcF06IHVzZUxvb3BTaW5nbGVSdW5Gb3JtUGFyYW1zLFxuICBbQmxvY2tFbnVtLlN0YXJ0XTogdXNlU3RhcnRTaW5nbGVSdW5Gb3JtUGFyYW1zLFxuICBbQmxvY2tFbnVtLklmRWxzZV06IHVzZUlmRWxzZVNpbmdsZVJ1bkZvcm1QYXJhbXMsXG4gIFtCbG9ja0VudW0uVmFyaWFibGVBZ2dyZWdhdG9yXTogdXNlVmFyaWFibGVBZ2dyZWdhdG9yU2luZ2xlUnVuRm9ybVBhcmFtcyxcbiAgW0Jsb2NrRW51bS5Bc3NpZ25lcl06IHVzZVZhcmlhYmxlQXNzaWduZXJTaW5nbGVSdW5Gb3JtUGFyYW1zLFxuICBbQmxvY2tFbnVtLktub3dsZWRnZUJhc2VdOiB1c2VLbm93bGVkZ2VCYXNlU2luZ2xlUnVuRm9ybVBhcmFtcyxcbiAgW0Jsb2NrRW51bS5WYXJpYWJsZUFzc2lnbmVyXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLkVuZF06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5BbnN3ZXJdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uTGlzdEZpbHRlcl06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5JdGVyYXRpb25TdGFydF06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5Mb29wU3RhcnRdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uTG9vcEVuZF06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5EYXRhU291cmNlXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLkRhdGFTb3VyY2VFbXB0eV06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5UcmlnZ2VyV2ViaG9va106IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGVdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uVHJpZ2dlclBsdWdpbl06IHVuZGVmaW5lZCxcbn1cblxuY29uc3QgdXNlU2luZ2xlUnVuRm9ybVBhcmFtc0hvb2tzID0gKG5vZGVUeXBlOiBCbG9ja0VudW0pID0+IHtcbiAgcmV0dXJuIChwYXJhbXM6IGFueSkgPT4ge1xuICAgIHJldHVybiBzaW5nbGVSdW5Gb3JtUGFyYW1zSG9va3Nbbm9kZVR5cGVdPy4ocGFyYW1zKSB8fCB7fVxuICB9XG59XG5cbmNvbnN0IGdldERhdGFGb3JDaGVja01vcmVIb29rczogUmVjb3JkPEJsb2NrRW51bSwgYW55PiA9IHtcbiAgW0Jsb2NrRW51bS5Ub29sXTogdXNlVG9vbEdldERhdGFGb3JDaGVja01vcmUsXG4gIFtCbG9ja0VudW0uTExNXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLktub3dsZWRnZVJldHJpZXZhbF06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5Db2RlXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLlRlbXBsYXRlVHJhbnNmb3JtXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLlF1ZXN0aW9uQ2xhc3NpZmllcl06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5IdHRwUmVxdWVzdF06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5QYXJhbWV0ZXJFeHRyYWN0b3JdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uSXRlcmF0aW9uXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLkFnZW50XTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLkRvY0V4dHJhY3Rvcl06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5Mb29wXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLlN0YXJ0XTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLklmRWxzZV06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3JdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uRW5kXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLkFuc3dlcl06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5WYXJpYWJsZUFzc2lnbmVyXTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLkxpc3RGaWx0ZXJdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uSXRlcmF0aW9uU3RhcnRdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uQXNzaWduZXJdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uTG9vcFN0YXJ0XTogdW5kZWZpbmVkLFxuICBbQmxvY2tFbnVtLkxvb3BFbmRdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uRGF0YVNvdXJjZV06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5EYXRhU291cmNlRW1wdHldOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uS25vd2xlZGdlQmFzZV06IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5UcmlnZ2VyV2ViaG9va106IHVuZGVmaW5lZCxcbiAgW0Jsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGVdOiB1bmRlZmluZWQsXG4gIFtCbG9ja0VudW0uVHJpZ2dlclBsdWdpbl06IHVzZVRyaWdnZXJQbHVnaW5HZXREYXRhRm9yQ2hlY2tNb3JlLFxufVxuXG5jb25zdCB1c2VHZXREYXRhRm9yQ2hlY2tNb3JlSG9va3MgPSA8VD4obm9kZVR5cGU6IEJsb2NrRW51bSkgPT4ge1xuICByZXR1cm4gKGlkOiBzdHJpbmcsIHBheWxvYWQ6IENvbW1vbk5vZGVUeXBlPFQ+KSA9PiB7XG4gICAgcmV0dXJuIGdldERhdGFGb3JDaGVja01vcmVIb29rc1tub2RlVHlwZV0/Lih7IGlkLCBwYXlsb2FkIH0pIHx8IHtcbiAgICAgIGdldERhdGE6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgICB9LFxuICAgIH1cbiAgfVxufVxuXG50eXBlIFBhcmFtczxUPiA9IE9taXQ8T25lU3RlcFJ1blBhcmFtczxUPiwgJ2lzUnVuQWZ0ZXJTaW5nbGVSdW4nPlxuY29uc3QgdXNlTGFzdFJ1biA9IDxUPih7XG4gIC4uLm9uZVN0ZXBSdW5QYXJhbXNcbn06IFBhcmFtczxUPikgPT4ge1xuICBjb25zdCB7IGNvbnZlcnNhdGlvblZhcnMsIHN5c3RlbVZhcnMsIGhhc1NldEluc3BlY3RWYXIgfSA9IHVzZUluc3BlY3RWYXJzQ3J1ZCgpXG4gIGNvbnN0IGJsb2NrVHlwZSA9IG9uZVN0ZXBSdW5QYXJhbXMuZGF0YS50eXBlXG4gIGNvbnN0IGlzU3RhcnROb2RlID0gYmxvY2tUeXBlID09PSBCbG9ja0VudW0uU3RhcnRcbiAgY29uc3QgaXNJdGVyYXRpb25Ob2RlID0gYmxvY2tUeXBlID09PSBCbG9ja0VudW0uSXRlcmF0aW9uXG4gIGNvbnN0IGlzTG9vcE5vZGUgPSBibG9ja1R5cGUgPT09IEJsb2NrRW51bS5Mb29wXG4gIGNvbnN0IGlzQWdncmVnYXRvck5vZGUgPSBibG9ja1R5cGUgPT09IEJsb2NrRW51bS5WYXJpYWJsZUFnZ3JlZ2F0b3JcbiAgY29uc3QgaXNDdXN0b21SdW5Ob2RlID0gaXNTdXBwb3J0Q3VzdG9tUnVuRm9ybShibG9ja1R5cGUpXG4gIGNvbnN0IHsgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQgfSA9IHVzZU5vZGVzU3luY0RyYWZ0KClcbiAgY29uc3Qge1xuICAgIGdldERhdGE6IGdldERhdGFGb3JDaGVja01vcmUsXG4gIH0gPSB1c2VHZXREYXRhRm9yQ2hlY2tNb3JlSG9va3M8VD4oYmxvY2tUeXBlKShvbmVTdGVwUnVuUGFyYW1zLmlkLCBvbmVTdGVwUnVuUGFyYW1zLmRhdGEpXG4gIGNvbnN0IFtpc1J1bkFmdGVyU2luZ2xlUnVuLCBzZXRJc1J1bkFmdGVyU2luZ2xlUnVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIGNvbnN0IHtcbiAgICBpZCxcbiAgICBmbG93SWQsXG4gICAgZmxvd1R5cGUsXG4gICAgZGF0YSxcbiAgfSA9IG9uZVN0ZXBSdW5QYXJhbXNcbiAgY29uc3Qgb25lU3RlcFJ1blJlcyA9IHVzZU9uZVN0ZXBSdW4oe1xuICAgIC4uLm9uZVN0ZXBSdW5QYXJhbXMsXG4gICAgaXRlcmF0b3JJbnB1dEtleTogYmxvY2tUeXBlID09PSBCbG9ja0VudW0uSXRlcmF0aW9uID8gYCR7aWR9LmlucHV0X3NlbGVjdG9yYCA6ICcnLFxuICAgIG1vcmVEYXRhRm9yQ2hlY2tWYWxpZDogZ2V0RGF0YUZvckNoZWNrTW9yZSgpLFxuICAgIGlzUnVuQWZ0ZXJTaW5nbGVSdW4sXG4gIH0pXG5cbiAgY29uc3QgeyB3YXJuaW5nTm9kZXMgfSA9IHVzZVdvcmtmbG93UnVuVmFsaWRhdGlvbigpXG4gIGNvbnN0IGJsb2NrSWZDaGVja2xpc3RGYWlsZWQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3Qgd2FybmluZ0Zvck5vZGUgPSB3YXJuaW5nTm9kZXMuZmluZChpdGVtID0+IGl0ZW0uaWQgPT09IGlkKVxuICAgIGlmICghd2FybmluZ0Zvck5vZGUpXG4gICAgICByZXR1cm4gZmFsc2VcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSB3YXJuaW5nRm9yTm9kZS5lcnJvck1lc3NhZ2UgfHwgJ1RoaXMgbm9kZSBoYXMgdW5yZXNvbHZlZCBjaGVja2xpc3QgaXNzdWVzJ1xuICAgIFRvYXN0Lm5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfSlcbiAgICByZXR1cm4gdHJ1ZVxuICB9LCBbd2FybmluZ05vZGVzLCBpZF0pXG5cbiAgY29uc3Qge1xuICAgIGhpZGVTaW5nbGVSdW4sXG4gICAgaGFuZGxlUnVuOiBkb0NhbGxSdW5BcGksXG4gICAgZ2V0SW5wdXRWYXJzLFxuICAgIHRvVmFySW5wdXRzLFxuICAgIHZhclNlbGVjdG9yc1RvVmFySW5wdXRzLFxuICAgIHJ1bklucHV0RGF0YSxcbiAgICBydW5JbnB1dERhdGFSZWYsXG4gICAgc2V0UnVuSW5wdXREYXRhLFxuICAgIHNob3dTaW5nbGVSdW4sXG4gICAgcnVuUmVzdWx0LFxuICAgIGl0ZXJhdGlvblJ1blJlc3VsdCxcbiAgICBsb29wUnVuUmVzdWx0LFxuICAgIHNldE5vZGVSdW5uaW5nLFxuICAgIGNoZWNrVmFsaWQsXG4gIH0gPSBvbmVTdGVwUnVuUmVzXG5cbiAgY29uc3Qgbm9kZUluZm8gPSBydW5SZXN1bHRcbiAgY29uc3Qge1xuICAgIC4uLnNpbmdsZVJ1blBhcmFtc1xuICB9ID0gdXNlU2luZ2xlUnVuRm9ybVBhcmFtc0hvb2tzKGJsb2NrVHlwZSkoe1xuICAgIGlkLFxuICAgIHBheWxvYWQ6IGRhdGEsXG4gICAgcnVuSW5wdXREYXRhLFxuICAgIHJ1bklucHV0RGF0YVJlZixcbiAgICBnZXRJbnB1dFZhcnMsXG4gICAgc2V0UnVuSW5wdXREYXRhLFxuICAgIHRvVmFySW5wdXRzLFxuICAgIHZhclNlbGVjdG9yc1RvVmFySW5wdXRzLFxuICAgIHJ1blJlc3VsdCxcbiAgICBpdGVyYXRpb25SdW5SZXN1bHQsXG4gICAgbG9vcFJ1blJlc3VsdCxcbiAgfSlcblxuICBjb25zdCB0b1N1Ym1pdERhdGEgPSB1c2VDYWxsYmFjaygoZGF0YTogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICAgIGlmICghaXNJdGVyYXRpb25Ob2RlICYmICFpc0xvb3BOb2RlKVxuICAgICAgcmV0dXJuIGRhdGFcblxuICAgIGNvbnN0IGFsbFZhck9iamVjdCA9IHNpbmdsZVJ1blBhcmFtcz8uYWxsVmFyT2JqZWN0IHx8IHt9XG4gICAgY29uc3QgZm9ybWF0dGVkRGF0YTogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG4gICAgT2JqZWN0LmtleXMoYWxsVmFyT2JqZWN0KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGNvbnN0IFt2YXJTZWN0b3JTdHIsIG5vZGVJZF0gPSBrZXkuc3BsaXQoREVMSU1JVEVSKVxuICAgICAgZm9ybWF0dGVkRGF0YVtgJHtub2RlSWR9LiR7YWxsVmFyT2JqZWN0W2tleV0uaW5TaW5nbGVSdW5QYXNzZWRLZXl9YF0gPSBkYXRhW3ZhclNlY3RvclN0cl1cbiAgICB9KVxuICAgIGlmIChpc0l0ZXJhdGlvbk5vZGUpIHtcbiAgICAgIGNvbnN0IGl0ZXJhdG9ySW5wdXRLZXkgPSBgJHtpZH0uaW5wdXRfc2VsZWN0b3JgXG4gICAgICBmb3JtYXR0ZWREYXRhW2l0ZXJhdG9ySW5wdXRLZXldID0gZGF0YVtpdGVyYXRvcklucHV0S2V5XVxuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0dGVkRGF0YVxuICB9LCBbaXNJdGVyYXRpb25Ob2RlLCBpc0xvb3BOb2RlLCBzaW5nbGVSdW5QYXJhbXM/LmFsbFZhck9iamVjdCwgaWRdKVxuXG4gIGNvbnN0IGNhbGxSdW5BcGkgPSAoZGF0YTogUmVjb3JkPHN0cmluZywgYW55PiwgY2I/OiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQodHJ1ZSwgdHJ1ZSwge1xuICAgICAgb25TdWNjZXNzKCkge1xuICAgICAgICBkb0NhbGxSdW5BcGkodG9TdWJtaXREYXRhKGRhdGEpKVxuICAgICAgICBjYj8uKClcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IHsgc2V0SW5pdFNob3dMYXN0UnVuVGFiLCBzZXRTaG93VmFyaWFibGVJbnNwZWN0UGFuZWwgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICBjb25zdCBpbml0U2hvd0xhc3RSdW5UYWIgPSB1c2VTdG9yZShzID0+IHMuaW5pdFNob3dMYXN0UnVuVGFiKVxuICBjb25zdCBbdGFiVHlwZSwgc2V0VGFiVHlwZV0gPSB1c2VTdGF0ZTxUYWJUeXBlPihpbml0U2hvd0xhc3RSdW5UYWIgPyBUYWJUeXBlLmxhc3RSdW4gOiBUYWJUeXBlLnNldHRpbmdzKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChpbml0U2hvd0xhc3RSdW5UYWIpXG4gICAgICBzZXRUYWJUeXBlKFRhYlR5cGUubGFzdFJ1bilcblxuICAgIHNldEluaXRTaG93TGFzdFJ1blRhYihmYWxzZSlcbiAgfSwgW2luaXRTaG93TGFzdFJ1blRhYl0pXG4gIGNvbnN0IGludmFsaWRMYXN0UnVuID0gdXNlSW52YWxpZExhc3RSdW4oZmxvd1R5cGUsIGZsb3dJZCwgaWQpXG5cbiAgY29uc3QgaGFuZGxlUnVuV2l0aFBhcmFtcyA9IGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgaWYgKGJsb2NrSWZDaGVja2xpc3RGYWlsZWQoKSlcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IHsgaXNWYWxpZCB9ID0gY2hlY2tWYWxpZCgpXG4gICAgaWYgKCFpc1ZhbGlkKVxuICAgICAgcmV0dXJuXG4gICAgc2V0Tm9kZVJ1bm5pbmcoKVxuICAgIHNldElzUnVuQWZ0ZXJTaW5nbGVSdW4odHJ1ZSlcbiAgICBzZXRUYWJUeXBlKFRhYlR5cGUubGFzdFJ1bilcbiAgICBjYWxsUnVuQXBpKGRhdGEsICgpID0+IHtcbiAgICAgIGludmFsaWRMYXN0UnVuKClcbiAgICB9KVxuICAgIGhpZGVTaW5nbGVSdW4oKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVGFiQ2xpY2tlZCA9IHVzZUNhbGxiYWNrKCh0eXBlOiBUYWJUeXBlKSA9PiB7XG4gICAgc2V0SXNSdW5BZnRlclNpbmdsZVJ1bihmYWxzZSlcbiAgICBzZXRUYWJUeXBlKHR5cGUpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGdldEV4aXN0VmFyVmFsdWVzSW5Gb3JtcyA9IChmb3JtczogRm9ybVByb3BzW10pID0+IHtcbiAgICBpZiAoIWZvcm1zIHx8IGZvcm1zLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBbXVxuXG4gICAgY29uc3QgdmFsdWVzQXJyID0gZm9ybXMubWFwKChmb3JtKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZXM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge31cbiAgICAgIGZvcm0uaW5wdXRzLmZvckVhY2goKHsgdmFyaWFibGUsIGdldFZhclZhbHVlRnJvbURlcGVuZGVudCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGlzR2V0VmFsdWVGcm9tRGVwZW5kZW50ID0gZ2V0VmFyVmFsdWVGcm9tRGVwZW5kZW50IHx8ICF2YXJpYWJsZS5pbmNsdWRlcygnLicpXG4gICAgICAgIGlmIChpc0dldFZhbHVlRnJvbURlcGVuZGVudCAmJiAhc2luZ2xlUnVuUGFyYW1zPy5nZXREZXBlbmRlbnRWYXIpXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBpc0dldFZhbHVlRnJvbURlcGVuZGVudCA/IChzaW5nbGVSdW5QYXJhbXM/LmdldERlcGVuZGVudFZhcih2YXJpYWJsZSkgfHwgW10pIDogdmFyaWFibGUuc2xpY2UoMSwgLTEpLnNwbGl0KCcuJylcbiAgICAgICAgaWYgKCFzZWxlY3RvciB8fCBzZWxlY3Rvci5sZW5ndGggPT09IDApXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIGNvbnN0IFtub2RlSWQsIHZhck5hbWVdID0gc2VsZWN0b3Iuc2xpY2UoMCwgMilcbiAgICAgICAgaWYgKCFpc1N0YXJ0Tm9kZSAmJiBub2RlSWQgPT09IGlkKSB7IC8vIGlubmVyIHZhcnMgbGlrZSBsb29wIHZhcnNcbiAgICAgICAgICB2YWx1ZXNbdmFyaWFibGVdID0gdHJ1ZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluc3BlY3RWYXJWYWx1ZSA9IGhhc1NldEluc3BlY3RWYXIobm9kZUlkLCB2YXJOYW1lLCBzeXN0ZW1WYXJzLCBjb252ZXJzYXRpb25WYXJzKSAvLyBhbHNvIGRldGVjdCBzeXN0ZW0gdmFyICwgZW52IGFuZCAgY29udmVyc2F0aW9uIHZhclxuICAgICAgICBpZiAoaW5zcGVjdFZhclZhbHVlKVxuICAgICAgICAgIHZhbHVlc1t2YXJpYWJsZV0gPSB0cnVlXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHZhbHVlc1xuICAgIH0pXG4gICAgcmV0dXJuIHZhbHVlc0FyclxuICB9XG5cbiAgY29uc3QgaXNBbGxWYXJzSGFzVmFsdWUgPSAodmFycz86IFZhbHVlU2VsZWN0b3JbXSkgPT4ge1xuICAgIGlmICghdmFycyB8fCB2YXJzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIHZhcnMuZXZlcnkoKHZhckl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IFtub2RlSWQsIHZhck5hbWVdID0gdmFySXRlbS5zbGljZSgwLCAyKVxuICAgICAgY29uc3QgaW5zcGVjdFZhclZhbHVlID0gaGFzU2V0SW5zcGVjdFZhcihub2RlSWQsIHZhck5hbWUsIHN5c3RlbVZhcnMsIGNvbnZlcnNhdGlvblZhcnMpIC8vIGFsc28gZGV0ZWN0IHN5c3RlbSB2YXIgLCBlbnYgYW5kICBjb252ZXJzYXRpb24gdmFyXG4gICAgICByZXR1cm4gaW5zcGVjdFZhclZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGlzU29tZVZhcnNIYXNWYWx1ZSA9ICh2YXJzPzogVmFsdWVTZWxlY3RvcltdKSA9PiB7XG4gICAgaWYgKCF2YXJzIHx8IHZhcnMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICByZXR1cm4gdmFycy5zb21lKCh2YXJJdGVtKSA9PiB7XG4gICAgICBjb25zdCBbbm9kZUlkLCB2YXJOYW1lXSA9IHZhckl0ZW0uc2xpY2UoMCwgMilcbiAgICAgIGNvbnN0IGluc3BlY3RWYXJWYWx1ZSA9IGhhc1NldEluc3BlY3RWYXIobm9kZUlkLCB2YXJOYW1lLCBzeXN0ZW1WYXJzLCBjb252ZXJzYXRpb25WYXJzKSAvLyBhbHNvIGRldGVjdCBzeXN0ZW0gdmFyICwgZW52IGFuZCAgY29udmVyc2F0aW9uIHZhclxuICAgICAgcmV0dXJuIGluc3BlY3RWYXJWYWx1ZVxuICAgIH0pXG4gIH1cbiAgY29uc3QgZ2V0RmlsdGVyZWRFeGlzdFZhckZvcm1zID0gKGZvcm1zOiBGb3JtUHJvcHNbXSkgPT4ge1xuICAgIGlmICghZm9ybXMgfHwgZm9ybXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBleGlzdFZhclZhbHVlc0luRm9ybXMgPSBnZXRFeGlzdFZhclZhbHVlc0luRm9ybXMoZm9ybXMpXG5cbiAgICBjb25zdCByZXMgPSBmb3Jtcy5tYXAoKGZvcm0sIGkpID0+IHtcbiAgICAgIGNvbnN0IGV4aXN0VmFyVmFsdWVzSW5Gb3JtID0gZXhpc3RWYXJWYWx1ZXNJbkZvcm1zW2ldXG4gICAgICBjb25zdCBuZXdGb3JtID0geyAuLi5mb3JtIH1cbiAgICAgIGNvbnN0IGlucHV0cyA9IGZvcm0uaW5wdXRzLmZpbHRlcigoaW5wdXQpID0+IHtcbiAgICAgICAgcmV0dXJuICEoaW5wdXQudmFyaWFibGUgaW4gZXhpc3RWYXJWYWx1ZXNJbkZvcm0pXG4gICAgICB9KVxuICAgICAgbmV3Rm9ybS5pbnB1dHMgPSBpbnB1dHNcbiAgICAgIHJldHVybiBuZXdGb3JtXG4gICAgfSkuZmlsdGVyKGZvcm0gPT4gZm9ybS5pbnB1dHMubGVuZ3RoID4gMClcbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICBjb25zdCBjaGVja0FnZ3JlZ2F0b3JWYXJzU2V0ID0gKHZhcnM6IFZhbHVlU2VsZWN0b3JbXVtdKSA9PiB7XG4gICAgaWYgKCF2YXJzIHx8IHZhcnMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICAvLyBpbiBlYWNoIGdyb3VwLCBhdCBsYXN0IG9uZSBzZXQgaXMgb2tcbiAgICByZXR1cm4gdmFycy5ldmVyeSgodmFySXRlbSkgPT4ge1xuICAgICAgcmV0dXJuIGlzU29tZVZhcnNIYXNWYWx1ZSh2YXJJdGVtKVxuICAgIH0pXG4gIH1cblxuICBjb25zdCBoYW5kbGVBZnRlckN1c3RvbVNpbmdsZVJ1biA9ICgpID0+IHtcbiAgICBpbnZhbGlkTGFzdFJ1bigpXG4gICAgc2V0VGFiVHlwZShUYWJUeXBlLmxhc3RSdW4pXG4gICAgaGlkZVNpbmdsZVJ1bigpXG4gIH1cblxuICBjb25zdCBoYW5kbGVTaW5nbGVSdW4gPSAoKSA9PiB7XG4gICAgaWYgKGJsb2NrSWZDaGVja2xpc3RGYWlsZWQoKSlcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IHsgaXNWYWxpZCB9ID0gY2hlY2tWYWxpZCgpXG4gICAgaWYgKCFpc1ZhbGlkKVxuICAgICAgcmV0dXJuXG4gICAgaWYgKGJsb2NrVHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rIHx8IGJsb2NrVHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW4gfHwgYmxvY2tUeXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlKVxuICAgICAgc2V0U2hvd1ZhcmlhYmxlSW5zcGVjdFBhbmVsKHRydWUpXG4gICAgaWYgKGlzQ3VzdG9tUnVuTm9kZSkge1xuICAgICAgc2hvd1NpbmdsZVJ1bigpXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgdmFycyA9IHNpbmdsZVJ1blBhcmFtcz8uZ2V0RGVwZW5kZW50VmFycz8uKClcbiAgICAvLyBubyBuZWVkIHRvIGlucHV0IHBhcmFtc1xuICAgIGlmIChpc0FnZ3JlZ2F0b3JOb2RlID8gY2hlY2tBZ2dyZWdhdG9yVmFyc1NldCh2YXJzKSA6IGlzQWxsVmFyc0hhc1ZhbHVlKHZhcnMpKSB7XG4gICAgICBjYWxsUnVuQXBpKHt9LCBhc3luYyAoKSA9PiB7XG4gICAgICAgIHNldElzUnVuQWZ0ZXJTaW5nbGVSdW4odHJ1ZSlcbiAgICAgICAgc2V0Tm9kZVJ1bm5pbmcoKVxuICAgICAgICBpbnZhbGlkTGFzdFJ1bigpXG4gICAgICAgIHNldFRhYlR5cGUoVGFiVHlwZS5sYXN0UnVuKVxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzaG93U2luZ2xlUnVuKClcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm9uZVN0ZXBSdW5SZXMsXG4gICAgdGFiVHlwZSxcbiAgICBpc1J1bkFmdGVyU2luZ2xlUnVuLFxuICAgIHNldElzUnVuQWZ0ZXJTaW5nbGVSdW4sXG4gICAgc2V0VGFiVHlwZTogaGFuZGxlVGFiQ2xpY2tlZCxcbiAgICBoYW5kbGVBZnRlckN1c3RvbVNpbmdsZVJ1bixcbiAgICBzaW5nbGVSdW5QYXJhbXMsXG4gICAgbm9kZUluZm8sXG4gICAgc2V0UnVuSW5wdXREYXRhLFxuICAgIGhhbmRsZVNpbmdsZVJ1bixcbiAgICBoYW5kbGVSdW5XaXRoUGFyYW1zLFxuICAgIGdldEV4aXN0VmFyVmFsdWVzSW5Gb3JtcyxcbiAgICBnZXRGaWx0ZXJlZEV4aXN0VmFyRm9ybXMsXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlTGFzdFJ1blxuIl19