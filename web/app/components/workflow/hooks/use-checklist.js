"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowRunValidation = exports.useChecklistBeforePublish = exports.useChecklist = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const reactflow_1 = require("reactflow");
const store_1 = require("@/app/components/app/store");
const toast_1 = require("@/app/components/base/toast");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const use_nodes_1 = require("@/app/components/workflow/store/workflow/use-nodes");
const config_1 = require("@/config");
const i18n_1 = require("@/context/i18n");
const datasets_1 = require("@/service/datasets");
const use_strategy_1 = require("@/service/use-strategy");
const use_tools_1 = require("@/service/use-tools");
const use_triggers_1 = require("@/service/use-triggers");
const app_1 = require("@/types/app");
const constants_1 = require("../constants");
const store_2 = require("../datasets-detail-store/store");
const hooks_2 = require("../hooks");
const utils_1 = require("../nodes/_base/components/variable/utils");
const store_3 = require("../store");
const types_1 = require("../types");
const utils_2 = require("../utils");
const trigger_1 = require("../utils/trigger");
const use_nodes_available_var_list_1 = require("./use-nodes-available-var-list");
const START_NODE_TYPES = [
    types_1.BlockEnum.Start,
    types_1.BlockEnum.TriggerSchedule,
    types_1.BlockEnum.TriggerWebhook,
    types_1.BlockEnum.TriggerPlugin,
];
// Node types that depend on plugins
const PLUGIN_DEPENDENT_TYPES = [
    types_1.BlockEnum.Tool,
    types_1.BlockEnum.DataSource,
    types_1.BlockEnum.TriggerPlugin,
];
const useChecklist = (nodes, edges) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const language = (0, i18n_1.useGetLanguage)();
    const { nodesMap: nodesExtraData } = (0, hooks_2.useNodesMetaData)();
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const dataSourceList = (0, store_3.useStore)(s => s.dataSourceList);
    const { data: strategyProviders } = (0, use_strategy_1.useStrategyProviders)();
    const { data: triggerPlugins } = (0, use_triggers_1.useAllTriggerPlugins)();
    const datasetsDetail = (0, store_2.useDatasetsDetailStore)(s => s.datasetsDetail);
    const getToolIcon = (0, hooks_2.useGetToolIcon)();
    const appMode = store_1.useStore.getState().appDetail?.mode;
    const shouldCheckStartNode = appMode === app_1.AppModeEnum.WORKFLOW || appMode === app_1.AppModeEnum.ADVANCED_CHAT;
    const map = (0, use_nodes_available_var_list_1.default)(nodes);
    const { data: embeddingModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.textEmbedding);
    const { data: rerankModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.rerank);
    const getCheckData = (0, react_1.useCallback)((data) => {
        let checkData = data;
        if (data.type === types_1.BlockEnum.KnowledgeRetrieval) {
            const datasetIds = data.dataset_ids;
            const _datasets = datasetIds.reduce((acc, id) => {
                if (datasetsDetail[id])
                    acc.push(datasetsDetail[id]);
                return acc;
            }, []);
            checkData = {
                ...data,
                _datasets,
            };
        }
        else if (data.type === types_1.BlockEnum.KnowledgeBase) {
            checkData = {
                ...data,
                _embeddingModelList: embeddingModelList,
                _rerankModelList: rerankModelList,
            };
        }
        return checkData;
    }, [datasetsDetail, embeddingModelList, rerankModelList]);
    const needWarningNodes = (0, react_1.useMemo)(() => {
        const list = [];
        const filteredNodes = nodes.filter(node => node.type === constants_1.CUSTOM_NODE);
        const { validNodes } = (0, utils_2.getValidTreeNodes)(filteredNodes, edges);
        for (let i = 0; i < filteredNodes.length; i++) {
            const node = filteredNodes[i];
            let moreDataForCheckValid;
            let usedVars = [];
            if (node.data.type === types_1.BlockEnum.Tool)
                moreDataForCheckValid = (0, utils_2.getToolCheckParams)(node.data, buildInTools || [], customTools || [], workflowTools || [], language);
            if (node.data.type === types_1.BlockEnum.DataSource)
                moreDataForCheckValid = (0, utils_2.getDataSourceCheckParams)(node.data, dataSourceList || [], language);
            if (node.data.type === types_1.BlockEnum.TriggerPlugin)
                moreDataForCheckValid = (0, trigger_1.getTriggerCheckParams)(node.data, triggerPlugins, language);
            const toolIcon = getToolIcon(node.data);
            if (node.data.type === types_1.BlockEnum.Agent) {
                const data = node.data;
                const isReadyForCheckValid = !!strategyProviders;
                const provider = strategyProviders?.find(provider => provider.declaration.identity.name === data.agent_strategy_provider_name);
                const strategy = provider?.declaration.strategies?.find(s => s.identity.name === data.agent_strategy_name);
                moreDataForCheckValid = {
                    provider,
                    strategy,
                    language,
                    isReadyForCheckValid,
                };
            }
            else {
                usedVars = (0, utils_1.getNodeUsedVars)(node).filter(v => v.length > 0);
            }
            if (node.type === constants_1.CUSTOM_NODE) {
                const checkData = getCheckData(node.data);
                const validator = nodesExtraData?.[node.data.type]?.checkValid;
                const isPluginMissing = PLUGIN_DEPENDENT_TYPES.includes(node.data.type) && node.data._pluginInstallLocked;
                // Check if plugin is installed for plugin-dependent nodes first
                let errorMessage;
                if (isPluginMissing)
                    errorMessage = t('nodes.common.pluginNotInstalled', { ns: 'workflow' });
                else if (validator)
                    errorMessage = validator(checkData, t, moreDataForCheckValid).errorMessage;
                if (!errorMessage) {
                    const availableVars = map[node.id].availableVars;
                    for (const variable of usedVars) {
                        const isSpecialVars = (0, utils_1.isSpecialVar)(variable[0]);
                        if (!isSpecialVars) {
                            const usedNode = availableVars.find(v => v.nodeId === variable?.[0]);
                            if (usedNode) {
                                const usedVar = usedNode.vars.find(v => v.variable === variable?.[1]);
                                if (!usedVar)
                                    errorMessage = t('errorMsg.invalidVariable', { ns: 'workflow' });
                            }
                            else {
                                errorMessage = t('errorMsg.invalidVariable', { ns: 'workflow' });
                            }
                        }
                    }
                }
                // Start nodes and Trigger nodes should not show unConnected error if they have validation errors
                // or if they are valid start nodes (even without incoming connections)
                const isStartNodeMeta = nodesExtraData?.[node.data.type]?.metaData.isStart ?? false;
                const canSkipConnectionCheck = shouldCheckStartNode ? isStartNodeMeta : true;
                const isUnconnected = !validNodes.find(n => n.id === node.id);
                const shouldShowError = errorMessage || (isUnconnected && !canSkipConnectionCheck);
                if (shouldShowError) {
                    list.push({
                        id: node.id,
                        type: node.data.type,
                        title: node.data.title,
                        toolIcon,
                        unConnected: isUnconnected && !canSkipConnectionCheck,
                        errorMessage,
                        canNavigate: !isPluginMissing,
                        disableGoTo: isPluginMissing,
                    });
                }
            }
        }
        // Check for start nodes (including triggers)
        if (shouldCheckStartNode) {
            const startNodesFiltered = nodes.filter(node => START_NODE_TYPES.includes(node.data.type));
            if (startNodesFiltered.length === 0) {
                list.push({
                    id: 'start-node-required',
                    type: types_1.BlockEnum.Start,
                    title: t('panel.startNode', { ns: 'workflow' }),
                    errorMessage: t('common.needStartNode', { ns: 'workflow' }),
                    canNavigate: false,
                });
            }
        }
        const isRequiredNodesType = Object.keys(nodesExtraData).filter((key) => nodesExtraData[key].metaData.isRequired);
        isRequiredNodesType.forEach((type) => {
            if (!filteredNodes.find(node => node.data.type === type)) {
                list.push({
                    id: `${type}-need-added`,
                    type,
                    // We don't have enough type info for t() here
                    title: t(`blocks.${type}`, { ns: 'workflow' }),
                    errorMessage: t('common.needAdd', { ns: 'workflow', node: t(`blocks.${type}`, { ns: 'workflow' }) }),
                    canNavigate: false,
                });
            }
        });
        return list;
    }, [nodes, nodesExtraData, edges, buildInTools, customTools, workflowTools, language, dataSourceList, getToolIcon, strategyProviders, getCheckData, t, map, shouldCheckStartNode]);
    return needWarningNodes;
};
exports.useChecklist = useChecklist;
const useChecklistBeforePublish = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const language = (0, i18n_1.useGetLanguage)();
    const { notify } = (0, toast_1.useToastContext)();
    const store = (0, reactflow_1.useStoreApi)();
    const { nodesMap: nodesExtraData } = (0, hooks_2.useNodesMetaData)();
    const { data: strategyProviders } = (0, use_strategy_1.useStrategyProviders)();
    const updateDatasetsDetail = (0, store_2.useDatasetsDetailStore)(s => s.updateDatasetsDetail);
    const updateTime = (0, react_1.useRef)(0);
    const workflowStore = (0, store_3.useWorkflowStore)();
    const { getNodesAvailableVarList } = (0, use_nodes_available_var_list_1.useGetNodesAvailableVarList)();
    const { data: embeddingModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.textEmbedding);
    const { data: rerankModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.rerank);
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const appMode = store_1.useStore.getState().appDetail?.mode;
    const shouldCheckStartNode = appMode === app_1.AppModeEnum.WORKFLOW || appMode === app_1.AppModeEnum.ADVANCED_CHAT;
    const getCheckData = (0, react_1.useCallback)((data, datasets) => {
        let checkData = data;
        if (data.type === types_1.BlockEnum.KnowledgeRetrieval) {
            const datasetIds = data.dataset_ids;
            const datasetsDetail = datasets.reduce((acc, dataset) => {
                acc[dataset.id] = dataset;
                return acc;
            }, {});
            const _datasets = datasetIds.reduce((acc, id) => {
                if (datasetsDetail[id])
                    acc.push(datasetsDetail[id]);
                return acc;
            }, []);
            checkData = {
                ...data,
                _datasets,
            };
        }
        else if (data.type === types_1.BlockEnum.KnowledgeBase) {
            checkData = {
                ...data,
                _embeddingModelList: embeddingModelList,
                _rerankModelList: rerankModelList,
            };
        }
        return checkData;
    }, [embeddingModelList, rerankModelList]);
    const handleCheckBeforePublish = (0, react_1.useCallback)(async () => {
        const { getNodes, edges, } = store.getState();
        const { dataSourceList, } = workflowStore.getState();
        const nodes = getNodes();
        const filteredNodes = nodes.filter(node => node.type === constants_1.CUSTOM_NODE);
        const { validNodes, maxDepth } = (0, utils_2.getValidTreeNodes)(filteredNodes, edges);
        if (maxDepth > config_1.MAX_TREE_DEPTH) {
            notify({ type: 'error', message: t('common.maxTreeDepth', { ns: 'workflow', depth: config_1.MAX_TREE_DEPTH }) });
            return false;
        }
        // Before publish, we need to fetch datasets detail, in case of the settings of datasets have been changed
        const knowledgeRetrievalNodes = filteredNodes.filter(node => node.data.type === types_1.BlockEnum.KnowledgeRetrieval);
        const allDatasetIds = knowledgeRetrievalNodes.reduce((acc, node) => {
            return Array.from(new Set([...acc, ...node.data.dataset_ids]));
        }, []);
        let datasets = [];
        if (allDatasetIds.length > 0) {
            updateTime.current = updateTime.current + 1;
            const currUpdateTime = updateTime.current;
            const { data: datasetsDetail } = await (0, datasets_1.fetchDatasets)({ url: '/datasets', params: { page: 1, ids: allDatasetIds } });
            if (datasetsDetail && datasetsDetail.length > 0) {
                // avoid old data to overwrite the new data
                if (currUpdateTime < updateTime.current)
                    return false;
                datasets = datasetsDetail;
                updateDatasetsDetail(datasetsDetail);
            }
        }
        const map = getNodesAvailableVarList(nodes);
        for (let i = 0; i < filteredNodes.length; i++) {
            const node = filteredNodes[i];
            let moreDataForCheckValid;
            let usedVars = [];
            if (node.data.type === types_1.BlockEnum.Tool)
                moreDataForCheckValid = (0, utils_2.getToolCheckParams)(node.data, buildInTools || [], customTools || [], workflowTools || [], language);
            if (node.data.type === types_1.BlockEnum.DataSource)
                moreDataForCheckValid = (0, utils_2.getDataSourceCheckParams)(node.data, dataSourceList || [], language);
            if (node.data.type === types_1.BlockEnum.Agent) {
                const data = node.data;
                const isReadyForCheckValid = !!strategyProviders;
                const provider = strategyProviders?.find(provider => provider.declaration.identity.name === data.agent_strategy_provider_name);
                const strategy = provider?.declaration.strategies?.find(s => s.identity.name === data.agent_strategy_name);
                moreDataForCheckValid = {
                    provider,
                    strategy,
                    language,
                    isReadyForCheckValid,
                };
            }
            else {
                usedVars = (0, utils_1.getNodeUsedVars)(node).filter(v => v.length > 0);
            }
            const checkData = getCheckData(node.data, datasets);
            const { errorMessage } = nodesExtraData[node.data.type].checkValid(checkData, t, moreDataForCheckValid);
            if (errorMessage) {
                notify({ type: 'error', message: `[${node.data.title}] ${errorMessage}` });
                return false;
            }
            const availableVars = map[node.id].availableVars;
            for (const variable of usedVars) {
                const isSpecialVars = (0, utils_1.isSpecialVar)(variable[0]);
                if (!isSpecialVars) {
                    const usedNode = availableVars.find(v => v.nodeId === variable?.[0]);
                    if (usedNode) {
                        const usedVar = usedNode.vars.find(v => v.variable === variable?.[1]);
                        if (!usedVar) {
                            notify({ type: 'error', message: `[${node.data.title}] ${t('errorMsg.invalidVariable', { ns: 'workflow' })}` });
                            return false;
                        }
                    }
                    else {
                        notify({ type: 'error', message: `[${node.data.title}] ${t('errorMsg.invalidVariable', { ns: 'workflow' })}` });
                        return false;
                    }
                }
            }
            const isStartNodeMeta = nodesExtraData?.[node.data.type]?.metaData.isStart ?? false;
            const canSkipConnectionCheck = shouldCheckStartNode ? isStartNodeMeta : true;
            const isUnconnected = !validNodes.find(n => n.id === node.id);
            if (isUnconnected && !canSkipConnectionCheck) {
                notify({ type: 'error', message: `[${node.data.title}] ${t('common.needConnectTip', { ns: 'workflow' })}` });
                return false;
            }
        }
        if (shouldCheckStartNode) {
            const startNodesFiltered = nodes.filter(node => START_NODE_TYPES.includes(node.data.type));
            if (startNodesFiltered.length === 0) {
                notify({ type: 'error', message: t('common.needStartNode', { ns: 'workflow' }) });
                return false;
            }
        }
        const isRequiredNodesType = Object.keys(nodesExtraData).filter((key) => nodesExtraData[key].metaData.isRequired);
        for (let i = 0; i < isRequiredNodesType.length; i++) {
            const type = isRequiredNodesType[i];
            if (!filteredNodes.find(node => node.data.type === type)) {
                notify({ type: 'error', message: t('common.needAdd', { ns: 'workflow', node: t(`blocks.${type}`, { ns: 'workflow' }) }) });
                return false;
            }
        }
        return true;
    }, [store, notify, t, language, nodesExtraData, strategyProviders, updateDatasetsDetail, getCheckData, workflowStore, buildInTools, customTools, workflowTools, shouldCheckStartNode]);
    return {
        handleCheckBeforePublish,
    };
};
exports.useChecklistBeforePublish = useChecklistBeforePublish;
const useWorkflowRunValidation = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const nodes = (0, use_nodes_1.default)();
    const edges = (0, reactflow_1.useEdges)();
    const needWarningNodes = (0, exports.useChecklist)(nodes, edges);
    const { notify } = (0, toast_1.useToastContext)();
    const validateBeforeRun = (0, react_1.useCallback)(() => {
        if (needWarningNodes.length > 0) {
            notify({ type: 'error', message: t('panel.checklistTip', { ns: 'workflow' }) });
            return false;
        }
        return true;
    }, [needWarningNodes, notify, t]);
    return {
        validateBeforeRun,
        hasValidationErrors: needWarningNodes.length > 0,
        warningNodes: needWarningNodes,
    };
};
exports.useWorkflowRunValidation = useWorkflowRunValidation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNoZWNrbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jaGVja2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBZ0JBLGlDQUljO0FBQ2QsaURBQThDO0FBQzlDLHlDQUFpRDtBQUNqRCxzREFBb0U7QUFDcEUsdURBQTZEO0FBQzdELDJHQUF3RztBQUN4Ryw2RkFBZ0c7QUFDaEcsa0ZBQXlFO0FBQ3pFLHFDQUF5QztBQUN6Qyx5Q0FBK0M7QUFDL0MsaURBQWtEO0FBQ2xELHlEQUE2RDtBQUM3RCxtREFJNEI7QUFDNUIseURBQTZEO0FBQzdELHFDQUF5QztBQUN6Qyw0Q0FFcUI7QUFDckIsMERBQXVFO0FBQ3ZFLG9DQUdpQjtBQUNqQixvRUFBd0Y7QUFDeEYsb0NBR2lCO0FBQ2pCLG9DQUFvQztBQUNwQyxvQ0FJaUI7QUFDakIsOENBQXdEO0FBQ3hELGlGQUFzRztBQWF0RyxNQUFNLGdCQUFnQixHQUFnQjtJQUNwQyxpQkFBUyxDQUFDLEtBQUs7SUFDZixpQkFBUyxDQUFDLGVBQWU7SUFDekIsaUJBQVMsQ0FBQyxjQUFjO0lBQ3hCLGlCQUFTLENBQUMsYUFBYTtDQUN4QixDQUFBO0FBRUQsb0NBQW9DO0FBQ3BDLE1BQU0sc0JBQXNCLEdBQWdCO0lBQzFDLGlCQUFTLENBQUMsSUFBSTtJQUNkLGlCQUFTLENBQUMsVUFBVTtJQUNwQixpQkFBUyxDQUFDLGFBQWE7Q0FDeEIsQ0FBQTtBQUVNLE1BQU0sWUFBWSxHQUFHLENBQUMsS0FBYSxFQUFFLEtBQWEsRUFBRSxFQUFFO0lBQzNELE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLFFBQVEsR0FBRyxJQUFBLHFCQUFjLEdBQUUsQ0FBQTtJQUNqQyxNQUFNLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN2RCxNQUFNLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxH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LEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxLQUFLLEdBQUcsSUFBQSxtQkFBUSxHQUFFLENBQUE7SUFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBQSxvQkFBUSxHQUFrQixDQUFBO0lBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBQSxvQkFBWSxFQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNuRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx1QkFBZSxHQUFFLENBQUE7SUFFcEMsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3pDLElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUMvRSxPQUFPLEtBQUssQ0FBQTtRQUNkLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMsRUFBRSxDQUFDLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRWpDLE9BQU87UUFDTCxpQkFBaUI7UUFDakIsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLENBQUM7UUFDaEQsWUFBWSxFQUFFLGdCQUFnQjtLQUMvQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBcEJZLFFBQUEsd0JBQXdCLDRCQW9CcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEFnZW50Tm9kZVR5cGUgfSBmcm9tICcuLi9ub2Rlcy9hZ2VudC90eXBlcydcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZU5vZGVUeXBlIH0gZnJvbSAnLi4vbm9kZXMvZGF0YS1zb3VyY2UvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEtub3dsZWRnZUJhc2VOb2RlVHlwZSB9IGZyb20gJy4uL25vZGVzL2tub3dsZWRnZS1iYXNlL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBLbm93bGVkZ2VSZXRyaWV2YWxOb2RlVHlwZSB9IGZyb20gJy4uL25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFRvb2xOb2RlVHlwZSB9IGZyb20gJy4uL25vZGVzL3Rvb2wvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFBsdWdpblRyaWdnZXJOb2RlVHlwZSB9IGZyb20gJy4uL25vZGVzL3RyaWdnZXItcGx1Z2luL3R5cGVzJ1xuaW1wb3J0IHR5cGUge1xuICBDb21tb25FZGdlVHlwZSxcbiAgQ29tbW9uTm9kZVR5cGUsXG4gIEVkZ2UsXG4gIE5vZGUsXG4gIFZhbHVlU2VsZWN0b3IsXG59IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBFbW9qaSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IERhdGFTZXQgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB0eXBlIHsgSTE4bktleXNXaXRoUHJlZml4IH0gZnJvbSAnQC90eXBlcy9pMThuJ1xuaW1wb3J0IHtcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZU1lbW8sXG4gIHVzZVJlZixcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VFZGdlcywgdXNlU3RvcmVBcGkgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyB1c2VTdG9yZSBhcyB1c2VBcHBTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJ1xuaW1wb3J0IHsgdXNlVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgTW9kZWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7IHVzZU1vZGVsTGlzdCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJ1xuaW1wb3J0IHVzZU5vZGVzIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUvd29ya2Zsb3cvdXNlLW5vZGVzJ1xuaW1wb3J0IHsgTUFYX1RSRUVfREVQVEggfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IHVzZUdldExhbmd1YWdlIH0gZnJvbSAnQC9jb250ZXh0L2kxOG4nXG5pbXBvcnQgeyBmZXRjaERhdGFzZXRzIH0gZnJvbSAnQC9zZXJ2aWNlL2RhdGFzZXRzJ1xuaW1wb3J0IHsgdXNlU3RyYXRlZ3lQcm92aWRlcnMgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXN0cmF0ZWd5J1xuaW1wb3J0IHtcbiAgdXNlQWxsQnVpbHRJblRvb2xzLFxuICB1c2VBbGxDdXN0b21Ub29scyxcbiAgdXNlQWxsV29ya2Zsb3dUb29scyxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10b29scydcbmltcG9ydCB7IHVzZUFsbFRyaWdnZXJQbHVnaW5zIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10cmlnZ2VycydcbmltcG9ydCB7IEFwcE1vZGVFbnVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQge1xuICBDVVNUT01fTk9ERSxcbn0gZnJvbSAnLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgdXNlRGF0YXNldHNEZXRhaWxTdG9yZSB9IGZyb20gJy4uL2RhdGFzZXRzLWRldGFpbC1zdG9yZS9zdG9yZSdcbmltcG9ydCB7XG4gIHVzZUdldFRvb2xJY29uLFxuICB1c2VOb2Rlc01ldGFEYXRhLFxufSBmcm9tICcuLi9ob29rcydcbmltcG9ydCB7IGdldE5vZGVVc2VkVmFycywgaXNTcGVjaWFsVmFyIH0gZnJvbSAnLi4vbm9kZXMvX2Jhc2UvY29tcG9uZW50cy92YXJpYWJsZS91dGlscydcbmltcG9ydCB7XG4gIHVzZVN0b3JlLFxuICB1c2VXb3JrZmxvd1N0b3JlLFxufSBmcm9tICcuLi9zdG9yZSdcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHtcbiAgZ2V0RGF0YVNvdXJjZUNoZWNrUGFyYW1zLFxuICBnZXRUb29sQ2hlY2tQYXJhbXMsXG4gIGdldFZhbGlkVHJlZU5vZGVzLFxufSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IGdldFRyaWdnZXJDaGVja1BhcmFtcyB9IGZyb20gJy4uL3V0aWxzL3RyaWdnZXInXG5pbXBvcnQgdXNlTm9kZXNBdmFpbGFibGVWYXJMaXN0LCB7IHVzZUdldE5vZGVzQXZhaWxhYmxlVmFyTGlzdCB9IGZyb20gJy4vdXNlLW5vZGVzLWF2YWlsYWJsZS12YXItbGlzdCdcblxuZXhwb3J0IHR5cGUgQ2hlY2tsaXN0SXRlbSA9IHtcbiAgaWQ6IHN0cmluZ1xuICB0eXBlOiBCbG9ja0VudW0gfCBzdHJpbmdcbiAgdGl0bGU6IHN0cmluZ1xuICB0b29sSWNvbj86IHN0cmluZyB8IEVtb2ppXG4gIHVuQ29ubmVjdGVkPzogYm9vbGVhblxuICBlcnJvck1lc3NhZ2U/OiBzdHJpbmdcbiAgY2FuTmF2aWdhdGU6IGJvb2xlYW5cbiAgZGlzYWJsZUdvVG8/OiBib29sZWFuXG59XG5cbmNvbnN0IFNUQVJUX05PREVfVFlQRVM6IEJsb2NrRW51bVtdID0gW1xuICBCbG9ja0VudW0uU3RhcnQsXG4gIEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUsXG4gIEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vayxcbiAgQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW4sXG5dXG5cbi8vIE5vZGUgdHlwZXMgdGhhdCBkZXBlbmQgb24gcGx1Z2luc1xuY29uc3QgUExVR0lOX0RFUEVOREVOVF9UWVBFUzogQmxvY2tFbnVtW10gPSBbXG4gIEJsb2NrRW51bS5Ub29sLFxuICBCbG9ja0VudW0uRGF0YVNvdXJjZSxcbiAgQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW4sXG5dXG5cbmV4cG9ydCBjb25zdCB1c2VDaGVja2xpc3QgPSAobm9kZXM6IE5vZGVbXSwgZWRnZXM6IEVkZ2VbXSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgbGFuZ3VhZ2UgPSB1c2VHZXRMYW5ndWFnZSgpXG4gIGNvbnN0IHsgbm9kZXNNYXA6IG5vZGVzRXh0cmFEYXRhIH0gPSB1c2VOb2Rlc01ldGFEYXRhKClcbiAgY29uc3QgeyBkYXRhOiBidWlsZEluVG9vbHMgfSA9IHVzZUFsbEJ1aWx0SW5Ub29scygpXG4gIGNvbnN0IHsgZGF0YTogY3VzdG9tVG9vbHMgfSA9IHVzZUFsbEN1c3RvbVRvb2xzKClcbiAgY29uc3QgeyBkYXRhOiB3b3JrZmxvd1Rvb2xzIH0gPSB1c2VBbGxXb3JrZmxvd1Rvb2xzKClcbiAgY29uc3QgZGF0YVNvdXJjZUxpc3QgPSB1c2VTdG9yZShzID0+IHMuZGF0YVNvdXJjZUxpc3QpXG4gIGNvbnN0IHsgZGF0YTogc3RyYXRlZ3lQcm92aWRlcnMgfSA9IHVzZVN0cmF0ZWd5UHJvdmlkZXJzKClcbiAgY29uc3QgeyBkYXRhOiB0cmlnZ2VyUGx1Z2lucyB9ID0gdXNlQWxsVHJpZ2dlclBsdWdpbnMoKVxuICBjb25zdCBkYXRhc2V0c0RldGFpbCA9IHVzZURhdGFzZXRzRGV0YWlsU3RvcmUocyA9PiBzLmRhdGFzZXRzRGV0YWlsKVxuICBjb25zdCBnZXRUb29sSWNvbiA9IHVzZUdldFRvb2xJY29uKClcbiAgY29uc3QgYXBwTW9kZSA9IHVzZUFwcFN0b3JlLmdldFN0YXRlKCkuYXBwRGV0YWlsPy5tb2RlXG4gIGNvbnN0IHNob3VsZENoZWNrU3RhcnROb2RlID0gYXBwTW9kZSA9PT0gQXBwTW9kZUVudW0uV09SS0ZMT1cgfHwgYXBwTW9kZSA9PT0gQXBwTW9kZUVudW0uQURWQU5DRURfQ0hBVFxuXG4gIGNvbnN0IG1hcCA9IHVzZU5vZGVzQXZhaWxhYmxlVmFyTGlzdChub2RlcylcbiAgY29uc3QgeyBkYXRhOiBlbWJlZGRpbmdNb2RlbExpc3QgfSA9IHVzZU1vZGVsTGlzdChNb2RlbFR5cGVFbnVtLnRleHRFbWJlZGRpbmcpXG4gIGNvbnN0IHsgZGF0YTogcmVyYW5rTW9kZWxMaXN0IH0gPSB1c2VNb2RlbExpc3QoTW9kZWxUeXBlRW51bS5yZXJhbmspXG5cbiAgY29uc3QgZ2V0Q2hlY2tEYXRhID0gdXNlQ2FsbGJhY2soKGRhdGE6IENvbW1vbk5vZGVUeXBlPHt9PikgPT4ge1xuICAgIGxldCBjaGVja0RhdGEgPSBkYXRhXG4gICAgaWYgKGRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLktub3dsZWRnZVJldHJpZXZhbCkge1xuICAgICAgY29uc3QgZGF0YXNldElkcyA9IChkYXRhIGFzIENvbW1vbk5vZGVUeXBlPEtub3dsZWRnZVJldHJpZXZhbE5vZGVUeXBlPikuZGF0YXNldF9pZHNcbiAgICAgIGNvbnN0IF9kYXRhc2V0cyA9IGRhdGFzZXRJZHMucmVkdWNlPERhdGFTZXRbXT4oKGFjYywgaWQpID0+IHtcbiAgICAgICAgaWYgKGRhdGFzZXRzRGV0YWlsW2lkXSlcbiAgICAgICAgICBhY2MucHVzaChkYXRhc2V0c0RldGFpbFtpZF0pXG4gICAgICAgIHJldHVybiBhY2NcbiAgICAgIH0sIFtdKVxuICAgICAgY2hlY2tEYXRhID0ge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBfZGF0YXNldHMsXG4gICAgICB9IGFzIENvbW1vbk5vZGVUeXBlPEtub3dsZWRnZVJldHJpZXZhbE5vZGVUeXBlPlxuICAgIH1cbiAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Lbm93bGVkZ2VCYXNlKSB7XG4gICAgICBjaGVja0RhdGEgPSB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIF9lbWJlZGRpbmdNb2RlbExpc3Q6IGVtYmVkZGluZ01vZGVsTGlzdCxcbiAgICAgICAgX3JlcmFua01vZGVsTGlzdDogcmVyYW5rTW9kZWxMaXN0LFxuICAgICAgfSBhcyBDb21tb25Ob2RlVHlwZTxLbm93bGVkZ2VCYXNlTm9kZVR5cGU+XG4gICAgfVxuICAgIHJldHVybiBjaGVja0RhdGFcbiAgfSwgW2RhdGFzZXRzRGV0YWlsLCBlbWJlZGRpbmdNb2RlbExpc3QsIHJlcmFua01vZGVsTGlzdF0pXG5cbiAgY29uc3QgbmVlZFdhcm5pbmdOb2RlcyA9IHVzZU1lbW88Q2hlY2tsaXN0SXRlbVtdPigoKSA9PiB7XG4gICAgY29uc3QgbGlzdDogQ2hlY2tsaXN0SXRlbVtdID0gW11cbiAgICBjb25zdCBmaWx0ZXJlZE5vZGVzID0gbm9kZXMuZmlsdGVyKG5vZGUgPT4gbm9kZS50eXBlID09PSBDVVNUT01fTk9ERSlcbiAgICBjb25zdCB7IHZhbGlkTm9kZXMgfSA9IGdldFZhbGlkVHJlZU5vZGVzKGZpbHRlcmVkTm9kZXMsIGVkZ2VzKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWx0ZXJlZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBub2RlID0gZmlsdGVyZWROb2Rlc1tpXVxuICAgICAgbGV0IG1vcmVEYXRhRm9yQ2hlY2tWYWxpZFxuICAgICAgbGV0IHVzZWRWYXJzOiBWYWx1ZVNlbGVjdG9yW10gPSBbXVxuXG4gICAgICBpZiAobm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Ub29sKVxuICAgICAgICBtb3JlRGF0YUZvckNoZWNrVmFsaWQgPSBnZXRUb29sQ2hlY2tQYXJhbXMobm9kZS5kYXRhIGFzIFRvb2xOb2RlVHlwZSwgYnVpbGRJblRvb2xzIHx8IFtdLCBjdXN0b21Ub29scyB8fCBbXSwgd29ya2Zsb3dUb29scyB8fCBbXSwgbGFuZ3VhZ2UpXG5cbiAgICAgIGlmIChub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UpXG4gICAgICAgIG1vcmVEYXRhRm9yQ2hlY2tWYWxpZCA9IGdldERhdGFTb3VyY2VDaGVja1BhcmFtcyhub2RlLmRhdGEgYXMgRGF0YVNvdXJjZU5vZGVUeXBlLCBkYXRhU291cmNlTGlzdCB8fCBbXSwgbGFuZ3VhZ2UpXG5cbiAgICAgIGlmIChub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJQbHVnaW4pXG4gICAgICAgIG1vcmVEYXRhRm9yQ2hlY2tWYWxpZCA9IGdldFRyaWdnZXJDaGVja1BhcmFtcyhub2RlLmRhdGEgYXMgUGx1Z2luVHJpZ2dlck5vZGVUeXBlLCB0cmlnZ2VyUGx1Z2lucywgbGFuZ3VhZ2UpXG5cbiAgICAgIGNvbnN0IHRvb2xJY29uID0gZ2V0VG9vbEljb24obm9kZS5kYXRhKVxuICAgICAgaWYgKG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uQWdlbnQpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IG5vZGUuZGF0YSBhcyBBZ2VudE5vZGVUeXBlXG4gICAgICAgIGNvbnN0IGlzUmVhZHlGb3JDaGVja1ZhbGlkID0gISFzdHJhdGVneVByb3ZpZGVyc1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IHN0cmF0ZWd5UHJvdmlkZXJzPy5maW5kKHByb3ZpZGVyID0+IHByb3ZpZGVyLmRlY2xhcmF0aW9uLmlkZW50aXR5Lm5hbWUgPT09IGRhdGEuYWdlbnRfc3RyYXRlZ3lfcHJvdmlkZXJfbmFtZSlcbiAgICAgICAgY29uc3Qgc3RyYXRlZ3kgPSBwcm92aWRlcj8uZGVjbGFyYXRpb24uc3RyYXRlZ2llcz8uZmluZChzID0+IHMuaWRlbnRpdHkubmFtZSA9PT0gZGF0YS5hZ2VudF9zdHJhdGVneV9uYW1lKVxuICAgICAgICBtb3JlRGF0YUZvckNoZWNrVmFsaWQgPSB7XG4gICAgICAgICAgcHJvdmlkZXIsXG4gICAgICAgICAgc3RyYXRlZ3ksXG4gICAgICAgICAgbGFuZ3VhZ2UsXG4gICAgICAgICAgaXNSZWFkeUZvckNoZWNrVmFsaWQsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB1c2VkVmFycyA9IGdldE5vZGVVc2VkVmFycyhub2RlKS5maWx0ZXIodiA9PiB2Lmxlbmd0aCA+IDApXG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlLnR5cGUgPT09IENVU1RPTV9OT0RFKSB7XG4gICAgICAgIGNvbnN0IGNoZWNrRGF0YSA9IGdldENoZWNrRGF0YShub2RlLmRhdGEpXG4gICAgICAgIGNvbnN0IHZhbGlkYXRvciA9IG5vZGVzRXh0cmFEYXRhPy5bbm9kZS5kYXRhLnR5cGUgYXMgQmxvY2tFbnVtXT8uY2hlY2tWYWxpZFxuICAgICAgICBjb25zdCBpc1BsdWdpbk1pc3NpbmcgPSBQTFVHSU5fREVQRU5ERU5UX1RZUEVTLmluY2x1ZGVzKG5vZGUuZGF0YS50eXBlIGFzIEJsb2NrRW51bSkgJiYgbm9kZS5kYXRhLl9wbHVnaW5JbnN0YWxsTG9ja2VkXG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgcGx1Z2luIGlzIGluc3RhbGxlZCBmb3IgcGx1Z2luLWRlcGVuZGVudCBub2RlcyBmaXJzdFxuICAgICAgICBsZXQgZXJyb3JNZXNzYWdlOiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgICAgICAgaWYgKGlzUGx1Z2luTWlzc2luZylcbiAgICAgICAgICBlcnJvck1lc3NhZ2UgPSB0KCdub2Rlcy5jb21tb24ucGx1Z2luTm90SW5zdGFsbGVkJywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgICBlbHNlIGlmICh2YWxpZGF0b3IpXG4gICAgICAgICAgZXJyb3JNZXNzYWdlID0gdmFsaWRhdG9yKGNoZWNrRGF0YSwgdCwgbW9yZURhdGFGb3JDaGVja1ZhbGlkKS5lcnJvck1lc3NhZ2VcblxuICAgICAgICBpZiAoIWVycm9yTWVzc2FnZSkge1xuICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZVZhcnMgPSBtYXBbbm9kZS5pZF0uYXZhaWxhYmxlVmFyc1xuXG4gICAgICAgICAgZm9yIChjb25zdCB2YXJpYWJsZSBvZiB1c2VkVmFycykge1xuICAgICAgICAgICAgY29uc3QgaXNTcGVjaWFsVmFycyA9IGlzU3BlY2lhbFZhcih2YXJpYWJsZVswXSlcbiAgICAgICAgICAgIGlmICghaXNTcGVjaWFsVmFycykge1xuICAgICAgICAgICAgICBjb25zdCB1c2VkTm9kZSA9IGF2YWlsYWJsZVZhcnMuZmluZCh2ID0+IHYubm9kZUlkID09PSB2YXJpYWJsZT8uWzBdKVxuICAgICAgICAgICAgICBpZiAodXNlZE5vZGUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VkVmFyID0gdXNlZE5vZGUudmFycy5maW5kKHYgPT4gdi52YXJpYWJsZSA9PT0gdmFyaWFibGU/LlsxXSlcbiAgICAgICAgICAgICAgICBpZiAoIXVzZWRWYXIpXG4gICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSB0KCdlcnJvck1zZy5pbnZhbGlkVmFyaWFibGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gdCgnZXJyb3JNc2cuaW52YWxpZFZhcmlhYmxlJywgeyBuczogJ3dvcmtmbG93JyB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3RhcnQgbm9kZXMgYW5kIFRyaWdnZXIgbm9kZXMgc2hvdWxkIG5vdCBzaG93IHVuQ29ubmVjdGVkIGVycm9yIGlmIHRoZXkgaGF2ZSB2YWxpZGF0aW9uIGVycm9yc1xuICAgICAgICAvLyBvciBpZiB0aGV5IGFyZSB2YWxpZCBzdGFydCBub2RlcyAoZXZlbiB3aXRob3V0IGluY29taW5nIGNvbm5lY3Rpb25zKVxuICAgICAgICBjb25zdCBpc1N0YXJ0Tm9kZU1ldGEgPSBub2Rlc0V4dHJhRGF0YT8uW25vZGUuZGF0YS50eXBlIGFzIEJsb2NrRW51bV0/Lm1ldGFEYXRhLmlzU3RhcnQgPz8gZmFsc2VcbiAgICAgICAgY29uc3QgY2FuU2tpcENvbm5lY3Rpb25DaGVjayA9IHNob3VsZENoZWNrU3RhcnROb2RlID8gaXNTdGFydE5vZGVNZXRhIDogdHJ1ZVxuXG4gICAgICAgIGNvbnN0IGlzVW5jb25uZWN0ZWQgPSAhdmFsaWROb2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gbm9kZS5pZClcbiAgICAgICAgY29uc3Qgc2hvdWxkU2hvd0Vycm9yID0gZXJyb3JNZXNzYWdlIHx8IChpc1VuY29ubmVjdGVkICYmICFjYW5Ta2lwQ29ubmVjdGlvbkNoZWNrKVxuXG4gICAgICAgIGlmIChzaG91bGRTaG93RXJyb3IpIHtcbiAgICAgICAgICBsaXN0LnB1c2goe1xuICAgICAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICB0eXBlOiBub2RlLmRhdGEudHlwZSxcbiAgICAgICAgICAgIHRpdGxlOiBub2RlLmRhdGEudGl0bGUsXG4gICAgICAgICAgICB0b29sSWNvbixcbiAgICAgICAgICAgIHVuQ29ubmVjdGVkOiBpc1VuY29ubmVjdGVkICYmICFjYW5Ta2lwQ29ubmVjdGlvbkNoZWNrLFxuICAgICAgICAgICAgZXJyb3JNZXNzYWdlLFxuICAgICAgICAgICAgY2FuTmF2aWdhdGU6ICFpc1BsdWdpbk1pc3NpbmcsXG4gICAgICAgICAgICBkaXNhYmxlR29UbzogaXNQbHVnaW5NaXNzaW5nLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3Igc3RhcnQgbm9kZXMgKGluY2x1ZGluZyB0cmlnZ2VycylcbiAgICBpZiAoc2hvdWxkQ2hlY2tTdGFydE5vZGUpIHtcbiAgICAgIGNvbnN0IHN0YXJ0Tm9kZXNGaWx0ZXJlZCA9IG5vZGVzLmZpbHRlcihub2RlID0+IFNUQVJUX05PREVfVFlQRVMuaW5jbHVkZXMobm9kZS5kYXRhLnR5cGUgYXMgQmxvY2tFbnVtKSlcbiAgICAgIGlmIChzdGFydE5vZGVzRmlsdGVyZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGxpc3QucHVzaCh7XG4gICAgICAgICAgaWQ6ICdzdGFydC1ub2RlLXJlcXVpcmVkJyxcbiAgICAgICAgICB0eXBlOiBCbG9ja0VudW0uU3RhcnQsXG4gICAgICAgICAgdGl0bGU6IHQoJ3BhbmVsLnN0YXJ0Tm9kZScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdjb21tb24ubmVlZFN0YXJ0Tm9kZScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgY2FuTmF2aWdhdGU6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzUmVxdWlyZWROb2Rlc1R5cGUgPSBPYmplY3Qua2V5cyhub2Rlc0V4dHJhRGF0YSEpLmZpbHRlcigoa2V5OiBhbnkpID0+IChub2Rlc0V4dHJhRGF0YSBhcyBhbnkpW2tleV0ubWV0YURhdGEuaXNSZXF1aXJlZClcblxuICAgIGlzUmVxdWlyZWROb2Rlc1R5cGUuZm9yRWFjaCgodHlwZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIWZpbHRlcmVkTm9kZXMuZmluZChub2RlID0+IG5vZGUuZGF0YS50eXBlID09PSB0eXBlKSkge1xuICAgICAgICBsaXN0LnB1c2goe1xuICAgICAgICAgIGlkOiBgJHt0eXBlfS1uZWVkLWFkZGVkYCxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIC8vIFdlIGRvbid0IGhhdmUgZW5vdWdoIHR5cGUgaW5mbyBmb3IgdCgpIGhlcmVcblxuICAgICAgICAgIHRpdGxlOiB0KGBibG9ja3MuJHt0eXBlfWAgYXMgSTE4bktleXNXaXRoUHJlZml4PCd3b3JrZmxvdycsICdibG9ja3MuJz4sIHsgbnM6ICd3b3JrZmxvdycgfSksXG5cbiAgICAgICAgICBlcnJvck1lc3NhZ2U6IHQoJ2NvbW1vbi5uZWVkQWRkJywgeyBuczogJ3dvcmtmbG93Jywgbm9kZTogdChgYmxvY2tzLiR7dHlwZX1gIGFzIEkxOG5LZXlzV2l0aFByZWZpeDwnd29ya2Zsb3cnLCAnYmxvY2tzLic+LCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pLFxuICAgICAgICAgIGNhbk5hdmlnYXRlOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGxpc3RcbiAgfSwgW25vZGVzLCBub2Rlc0V4dHJhRGF0YSwgZWRnZXMsIGJ1aWxkSW5Ub29scywgY3VzdG9tVG9vbHMsIHdvcmtmbG93VG9vbHMsIGxhbmd1YWdlLCBkYXRhU291cmNlTGlzdCwgZ2V0VG9vbEljb24sIHN0cmF0ZWd5UHJvdmlkZXJzLCBnZXRDaGVja0RhdGEsIHQsIG1hcCwgc2hvdWxkQ2hlY2tTdGFydE5vZGVdKVxuXG4gIHJldHVybiBuZWVkV2FybmluZ05vZGVzXG59XG5cbmV4cG9ydCBjb25zdCB1c2VDaGVja2xpc3RCZWZvcmVQdWJsaXNoID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgbGFuZ3VhZ2UgPSB1c2VHZXRMYW5ndWFnZSgpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VUb2FzdENvbnRleHQoKVxuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3QgeyBub2Rlc01hcDogbm9kZXNFeHRyYURhdGEgfSA9IHVzZU5vZGVzTWV0YURhdGEoKVxuICBjb25zdCB7IGRhdGE6IHN0cmF0ZWd5UHJvdmlkZXJzIH0gPSB1c2VTdHJhdGVneVByb3ZpZGVycygpXG4gIGNvbnN0IHVwZGF0ZURhdGFzZXRzRGV0YWlsID0gdXNlRGF0YXNldHNEZXRhaWxTdG9yZShzID0+IHMudXBkYXRlRGF0YXNldHNEZXRhaWwpXG4gIGNvbnN0IHVwZGF0ZVRpbWUgPSB1c2VSZWYoMClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCB7IGdldE5vZGVzQXZhaWxhYmxlVmFyTGlzdCB9ID0gdXNlR2V0Tm9kZXNBdmFpbGFibGVWYXJMaXN0KClcbiAgY29uc3QgeyBkYXRhOiBlbWJlZGRpbmdNb2RlbExpc3QgfSA9IHVzZU1vZGVsTGlzdChNb2RlbFR5cGVFbnVtLnRleHRFbWJlZGRpbmcpXG4gIGNvbnN0IHsgZGF0YTogcmVyYW5rTW9kZWxMaXN0IH0gPSB1c2VNb2RlbExpc3QoTW9kZWxUeXBlRW51bS5yZXJhbmspXG4gIGNvbnN0IHsgZGF0YTogYnVpbGRJblRvb2xzIH0gPSB1c2VBbGxCdWlsdEluVG9vbHMoKVxuICBjb25zdCB7IGRhdGE6IGN1c3RvbVRvb2xzIH0gPSB1c2VBbGxDdXN0b21Ub29scygpXG4gIGNvbnN0IHsgZGF0YTogd29ya2Zsb3dUb29scyB9ID0gdXNlQWxsV29ya2Zsb3dUb29scygpXG4gIGNvbnN0IGFwcE1vZGUgPSB1c2VBcHBTdG9yZS5nZXRTdGF0ZSgpLmFwcERldGFpbD8ubW9kZVxuICBjb25zdCBzaG91bGRDaGVja1N0YXJ0Tm9kZSA9IGFwcE1vZGUgPT09IEFwcE1vZGVFbnVtLldPUktGTE9XIHx8IGFwcE1vZGUgPT09IEFwcE1vZGVFbnVtLkFEVkFOQ0VEX0NIQVRcblxuICBjb25zdCBnZXRDaGVja0RhdGEgPSB1c2VDYWxsYmFjaygoZGF0YTogQ29tbW9uTm9kZVR5cGU8e30+LCBkYXRhc2V0czogRGF0YVNldFtdKSA9PiB7XG4gICAgbGV0IGNoZWNrRGF0YSA9IGRhdGFcbiAgICBpZiAoZGF0YS50eXBlID09PSBCbG9ja0VudW0uS25vd2xlZGdlUmV0cmlldmFsKSB7XG4gICAgICBjb25zdCBkYXRhc2V0SWRzID0gKGRhdGEgYXMgQ29tbW9uTm9kZVR5cGU8S25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGU+KS5kYXRhc2V0X2lkc1xuICAgICAgY29uc3QgZGF0YXNldHNEZXRhaWwgPSBkYXRhc2V0cy5yZWR1Y2U8UmVjb3JkPHN0cmluZywgRGF0YVNldD4+KChhY2MsIGRhdGFzZXQpID0+IHtcbiAgICAgICAgYWNjW2RhdGFzZXQuaWRdID0gZGF0YXNldFxuICAgICAgICByZXR1cm4gYWNjXG4gICAgICB9LCB7fSlcbiAgICAgIGNvbnN0IF9kYXRhc2V0cyA9IGRhdGFzZXRJZHMucmVkdWNlPERhdGFTZXRbXT4oKGFjYywgaWQpID0+IHtcbiAgICAgICAgaWYgKGRhdGFzZXRzRGV0YWlsW2lkXSlcbiAgICAgICAgICBhY2MucHVzaChkYXRhc2V0c0RldGFpbFtpZF0pXG4gICAgICAgIHJldHVybiBhY2NcbiAgICAgIH0sIFtdKVxuICAgICAgY2hlY2tEYXRhID0ge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBfZGF0YXNldHMsXG4gICAgICB9IGFzIENvbW1vbk5vZGVUeXBlPEtub3dsZWRnZVJldHJpZXZhbE5vZGVUeXBlPlxuICAgIH1cbiAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Lbm93bGVkZ2VCYXNlKSB7XG4gICAgICBjaGVja0RhdGEgPSB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIF9lbWJlZGRpbmdNb2RlbExpc3Q6IGVtYmVkZGluZ01vZGVsTGlzdCxcbiAgICAgICAgX3JlcmFua01vZGVsTGlzdDogcmVyYW5rTW9kZWxMaXN0LFxuICAgICAgfSBhcyBDb21tb25Ob2RlVHlwZTxLbm93bGVkZ2VCYXNlTm9kZVR5cGU+XG4gICAgfVxuICAgIHJldHVybiBjaGVja0RhdGFcbiAgfSwgW2VtYmVkZGluZ01vZGVsTGlzdCwgcmVyYW5rTW9kZWxMaXN0XSlcblxuICBjb25zdCBoYW5kbGVDaGVja0JlZm9yZVB1Ymxpc2ggPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBlZGdlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IHtcbiAgICAgIGRhdGFTb3VyY2VMaXN0LFxuICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcbiAgICBjb25zdCBmaWx0ZXJlZE5vZGVzID0gbm9kZXMuZmlsdGVyKG5vZGUgPT4gbm9kZS50eXBlID09PSBDVVNUT01fTk9ERSlcbiAgICBjb25zdCB7IHZhbGlkTm9kZXMsIG1heERlcHRoIH0gPSBnZXRWYWxpZFRyZWVOb2RlcyhmaWx0ZXJlZE5vZGVzLCBlZGdlcylcblxuICAgIGlmIChtYXhEZXB0aCA+IE1BWF9UUkVFX0RFUFRIKSB7XG4gICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdjb21tb24ubWF4VHJlZURlcHRoJywgeyBuczogJ3dvcmtmbG93JywgZGVwdGg6IE1BWF9UUkVFX0RFUFRIIH0pIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgLy8gQmVmb3JlIHB1Ymxpc2gsIHdlIG5lZWQgdG8gZmV0Y2ggZGF0YXNldHMgZGV0YWlsLCBpbiBjYXNlIG9mIHRoZSBzZXR0aW5ncyBvZiBkYXRhc2V0cyBoYXZlIGJlZW4gY2hhbmdlZFxuICAgIGNvbnN0IGtub3dsZWRnZVJldHJpZXZhbE5vZGVzID0gZmlsdGVyZWROb2Rlcy5maWx0ZXIobm9kZSA9PiBub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLktub3dsZWRnZVJldHJpZXZhbClcbiAgICBjb25zdCBhbGxEYXRhc2V0SWRzID0ga25vd2xlZGdlUmV0cmlldmFsTm9kZXMucmVkdWNlPHN0cmluZ1tdPigoYWNjLCBub2RlKSA9PiB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5hY2MsIC4uLihub2RlLmRhdGEgYXMgQ29tbW9uTm9kZVR5cGU8S25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGU+KS5kYXRhc2V0X2lkc10pKVxuICAgIH0sIFtdKVxuICAgIGxldCBkYXRhc2V0czogRGF0YVNldFtdID0gW11cbiAgICBpZiAoYWxsRGF0YXNldElkcy5sZW5ndGggPiAwKSB7XG4gICAgICB1cGRhdGVUaW1lLmN1cnJlbnQgPSB1cGRhdGVUaW1lLmN1cnJlbnQgKyAxXG4gICAgICBjb25zdCBjdXJyVXBkYXRlVGltZSA9IHVwZGF0ZVRpbWUuY3VycmVudFxuICAgICAgY29uc3QgeyBkYXRhOiBkYXRhc2V0c0RldGFpbCB9ID0gYXdhaXQgZmV0Y2hEYXRhc2V0cyh7IHVybDogJy9kYXRhc2V0cycsIHBhcmFtczogeyBwYWdlOiAxLCBpZHM6IGFsbERhdGFzZXRJZHMgfSB9KVxuICAgICAgaWYgKGRhdGFzZXRzRGV0YWlsICYmIGRhdGFzZXRzRGV0YWlsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gYXZvaWQgb2xkIGRhdGEgdG8gb3ZlcndyaXRlIHRoZSBuZXcgZGF0YVxuICAgICAgICBpZiAoY3VyclVwZGF0ZVRpbWUgPCB1cGRhdGVUaW1lLmN1cnJlbnQpXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIGRhdGFzZXRzID0gZGF0YXNldHNEZXRhaWxcbiAgICAgICAgdXBkYXRlRGF0YXNldHNEZXRhaWwoZGF0YXNldHNEZXRhaWwpXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG1hcCA9IGdldE5vZGVzQXZhaWxhYmxlVmFyTGlzdChub2RlcylcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbHRlcmVkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBmaWx0ZXJlZE5vZGVzW2ldXG4gICAgICBsZXQgbW9yZURhdGFGb3JDaGVja1ZhbGlkXG4gICAgICBsZXQgdXNlZFZhcnM6IFZhbHVlU2VsZWN0b3JbXSA9IFtdXG4gICAgICBpZiAobm9kZS5kYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Ub29sKVxuICAgICAgICBtb3JlRGF0YUZvckNoZWNrVmFsaWQgPSBnZXRUb29sQ2hlY2tQYXJhbXMobm9kZS5kYXRhIGFzIFRvb2xOb2RlVHlwZSwgYnVpbGRJblRvb2xzIHx8IFtdLCBjdXN0b21Ub29scyB8fCBbXSwgd29ya2Zsb3dUb29scyB8fCBbXSwgbGFuZ3VhZ2UpXG5cbiAgICAgIGlmIChub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkRhdGFTb3VyY2UpXG4gICAgICAgIG1vcmVEYXRhRm9yQ2hlY2tWYWxpZCA9IGdldERhdGFTb3VyY2VDaGVja1BhcmFtcyhub2RlLmRhdGEgYXMgRGF0YVNvdXJjZU5vZGVUeXBlLCBkYXRhU291cmNlTGlzdCB8fCBbXSwgbGFuZ3VhZ2UpXG5cbiAgICAgIGlmIChub2RlLmRhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkFnZW50KSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBub2RlLmRhdGEgYXMgQWdlbnROb2RlVHlwZVxuICAgICAgICBjb25zdCBpc1JlYWR5Rm9yQ2hlY2tWYWxpZCA9ICEhc3RyYXRlZ3lQcm92aWRlcnNcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBzdHJhdGVneVByb3ZpZGVycz8uZmluZChwcm92aWRlciA9PiBwcm92aWRlci5kZWNsYXJhdGlvbi5pZGVudGl0eS5uYW1lID09PSBkYXRhLmFnZW50X3N0cmF0ZWd5X3Byb3ZpZGVyX25hbWUpXG4gICAgICAgIGNvbnN0IHN0cmF0ZWd5ID0gcHJvdmlkZXI/LmRlY2xhcmF0aW9uLnN0cmF0ZWdpZXM/LmZpbmQocyA9PiBzLmlkZW50aXR5Lm5hbWUgPT09IGRhdGEuYWdlbnRfc3RyYXRlZ3lfbmFtZSlcbiAgICAgICAgbW9yZURhdGFGb3JDaGVja1ZhbGlkID0ge1xuICAgICAgICAgIHByb3ZpZGVyLFxuICAgICAgICAgIHN0cmF0ZWd5LFxuICAgICAgICAgIGxhbmd1YWdlLFxuICAgICAgICAgIGlzUmVhZHlGb3JDaGVja1ZhbGlkLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdXNlZFZhcnMgPSBnZXROb2RlVXNlZFZhcnMobm9kZSkuZmlsdGVyKHYgPT4gdi5sZW5ndGggPiAwKVxuICAgICAgfVxuICAgICAgY29uc3QgY2hlY2tEYXRhID0gZ2V0Q2hlY2tEYXRhKG5vZGUuZGF0YSwgZGF0YXNldHMpXG4gICAgICBjb25zdCB7IGVycm9yTWVzc2FnZSB9ID0gbm9kZXNFeHRyYURhdGEhW25vZGUuZGF0YS50eXBlIGFzIEJsb2NrRW51bV0uY2hlY2tWYWxpZChjaGVja0RhdGEsIHQsIG1vcmVEYXRhRm9yQ2hlY2tWYWxpZClcblxuICAgICAgaWYgKGVycm9yTWVzc2FnZSkge1xuICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBgWyR7bm9kZS5kYXRhLnRpdGxlfV0gJHtlcnJvck1lc3NhZ2V9YCB9KVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgYXZhaWxhYmxlVmFycyA9IG1hcFtub2RlLmlkXS5hdmFpbGFibGVWYXJzXG5cbiAgICAgIGZvciAoY29uc3QgdmFyaWFibGUgb2YgdXNlZFZhcnMpIHtcbiAgICAgICAgY29uc3QgaXNTcGVjaWFsVmFycyA9IGlzU3BlY2lhbFZhcih2YXJpYWJsZVswXSlcbiAgICAgICAgaWYgKCFpc1NwZWNpYWxWYXJzKSB7XG4gICAgICAgICAgY29uc3QgdXNlZE5vZGUgPSBhdmFpbGFibGVWYXJzLmZpbmQodiA9PiB2Lm5vZGVJZCA9PT0gdmFyaWFibGU/LlswXSlcbiAgICAgICAgICBpZiAodXNlZE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHVzZWRWYXIgPSB1c2VkTm9kZS52YXJzLmZpbmQodiA9PiB2LnZhcmlhYmxlID09PSB2YXJpYWJsZT8uWzFdKVxuICAgICAgICAgICAgaWYgKCF1c2VkVmFyKSB7XG4gICAgICAgICAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IGBbJHtub2RlLmRhdGEudGl0bGV9XSAke3QoJ2Vycm9yTXNnLmludmFsaWRWYXJpYWJsZScsIHsgbnM6ICd3b3JrZmxvdycgfSl9YCB9KVxuICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBgWyR7bm9kZS5kYXRhLnRpdGxlfV0gJHt0KCdlcnJvck1zZy5pbnZhbGlkVmFyaWFibGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pfWAgfSlcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBpc1N0YXJ0Tm9kZU1ldGEgPSBub2Rlc0V4dHJhRGF0YT8uW25vZGUuZGF0YS50eXBlIGFzIEJsb2NrRW51bV0/Lm1ldGFEYXRhLmlzU3RhcnQgPz8gZmFsc2VcbiAgICAgIGNvbnN0IGNhblNraXBDb25uZWN0aW9uQ2hlY2sgPSBzaG91bGRDaGVja1N0YXJ0Tm9kZSA/IGlzU3RhcnROb2RlTWV0YSA6IHRydWVcbiAgICAgIGNvbnN0IGlzVW5jb25uZWN0ZWQgPSAhdmFsaWROb2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gbm9kZS5pZClcblxuICAgICAgaWYgKGlzVW5jb25uZWN0ZWQgJiYgIWNhblNraXBDb25uZWN0aW9uQ2hlY2spIHtcbiAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogYFske25vZGUuZGF0YS50aXRsZX1dICR7dCgnY29tbW9uLm5lZWRDb25uZWN0VGlwJywgeyBuczogJ3dvcmtmbG93JyB9KX1gIH0pXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaG91bGRDaGVja1N0YXJ0Tm9kZSkge1xuICAgICAgY29uc3Qgc3RhcnROb2Rlc0ZpbHRlcmVkID0gbm9kZXMuZmlsdGVyKG5vZGUgPT4gU1RBUlRfTk9ERV9UWVBFUy5pbmNsdWRlcyhub2RlLmRhdGEudHlwZSBhcyBCbG9ja0VudW0pKVxuICAgICAgaWYgKHN0YXJ0Tm9kZXNGaWx0ZXJlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnY29tbW9uLm5lZWRTdGFydE5vZGUnLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzUmVxdWlyZWROb2Rlc1R5cGUgPSBPYmplY3Qua2V5cyhub2Rlc0V4dHJhRGF0YSEpLmZpbHRlcigoa2V5OiBhbnkpID0+IChub2Rlc0V4dHJhRGF0YSBhcyBhbnkpW2tleV0ubWV0YURhdGEuaXNSZXF1aXJlZClcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXNSZXF1aXJlZE5vZGVzVHlwZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdHlwZSA9IGlzUmVxdWlyZWROb2Rlc1R5cGVbaV1cblxuICAgICAgaWYgKCFmaWx0ZXJlZE5vZGVzLmZpbmQobm9kZSA9PiBub2RlLmRhdGEudHlwZSA9PT0gdHlwZSkpIHtcbiAgICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnY29tbW9uLm5lZWRBZGQnLCB7IG5zOiAnd29ya2Zsb3cnLCBub2RlOiB0KGBibG9ja3MuJHt0eXBlfWAgYXMgSTE4bktleXNXaXRoUHJlZml4PCd3b3JrZmxvdycsICdibG9ja3MuJz4sIHsgbnM6ICd3b3JrZmxvdycgfSkgfSkgfSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfSwgW3N0b3JlLCBub3RpZnksIHQsIGxhbmd1YWdlLCBub2Rlc0V4dHJhRGF0YSwgc3RyYXRlZ3lQcm92aWRlcnMsIHVwZGF0ZURhdGFzZXRzRGV0YWlsLCBnZXRDaGVja0RhdGEsIHdvcmtmbG93U3RvcmUsIGJ1aWxkSW5Ub29scywgY3VzdG9tVG9vbHMsIHdvcmtmbG93VG9vbHMsIHNob3VsZENoZWNrU3RhcnROb2RlXSlcblxuICByZXR1cm4ge1xuICAgIGhhbmRsZUNoZWNrQmVmb3JlUHVibGlzaCxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlV29ya2Zsb3dSdW5WYWxpZGF0aW9uID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3Qgbm9kZXMgPSB1c2VOb2RlcygpXG4gIGNvbnN0IGVkZ2VzID0gdXNlRWRnZXM8Q29tbW9uRWRnZVR5cGU+KClcbiAgY29uc3QgbmVlZFdhcm5pbmdOb2RlcyA9IHVzZUNoZWNrbGlzdChub2RlcywgZWRnZXMpXG4gIGNvbnN0IHsgbm90aWZ5IH0gPSB1c2VUb2FzdENvbnRleHQoKVxuXG4gIGNvbnN0IHZhbGlkYXRlQmVmb3JlUnVuID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChuZWVkV2FybmluZ05vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ3BhbmVsLmNoZWNrbGlzdFRpcCcsIHsgbnM6ICd3b3JrZmxvdycgfSkgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9LCBbbmVlZFdhcm5pbmdOb2Rlcywgbm90aWZ5LCB0XSlcblxuICByZXR1cm4ge1xuICAgIHZhbGlkYXRlQmVmb3JlUnVuLFxuICAgIGhhc1ZhbGlkYXRpb25FcnJvcnM6IG5lZWRXYXJuaW5nTm9kZXMubGVuZ3RoID4gMCxcbiAgICB3YXJuaW5nTm9kZXM6IG5lZWRXYXJuaW5nTm9kZXMsXG4gIH1cbn1cbiJdfQ==