"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const predicate_1 = require("es-toolkit/predicate");
const immer_1 = require("immer");
const react_1 = require("react");
const uuid_1 = require("uuid");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const use_available_var_list_1 = require("@/app/components/workflow/nodes/_base/hooks/use-available-var-list");
const use_node_crud_1 = require("@/app/components/workflow/nodes/_base/hooks/use-node-crud");
const config_1 = require("@/config");
const datasets_1 = require("@/service/datasets");
const app_1 = require("@/types/app");
const store_1 = require("../../datasets-detail-store/store");
const hooks_2 = require("../../hooks");
const types_1 = require("../../types");
const types_2 = require("./types");
const utils_1 = require("./utils");
const useConfig = (id, payload) => {
    const { nodesReadOnly: readOnly } = (0, hooks_2.useNodesReadOnly)();
    const isChatMode = (0, hooks_2.useIsChatMode)();
    const { getBeforeNodesInSameBranch } = (0, hooks_2.useWorkflow)();
    const startNode = getBeforeNodesInSameBranch(id).find(node => node.data.type === types_1.BlockEnum.Start);
    const startNodeId = startNode?.id;
    const { inputs, setInputs: doSetInputs } = (0, use_node_crud_1.default)(id, payload);
    const updateDatasetsDetail = (0, store_1.useDatasetsDetailStore)(s => s.updateDatasetsDetail);
    const inputRef = (0, react_1.useRef)(inputs);
    const setInputs = (0, react_1.useCallback)((s) => {
        const newInputs = (0, immer_1.produce)(s, (draft) => {
            if (s.retrieval_mode === app_1.RETRIEVE_TYPE.multiWay)
                delete draft.single_retrieval_config;
            else
                delete draft.multiple_retrieval_config;
        });
        // not work in pass to draft...
        doSetInputs(newInputs);
        inputRef.current = newInputs;
    }, [doSetInputs]);
    const handleQueryVarChange = (0, react_1.useCallback)((newVar) => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.query_variable_selector = newVar;
        });
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const handleQueryAttachmentChange = (0, react_1.useCallback)((newVar) => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.query_attachment_selector = newVar;
        });
        setInputs(newInputs);
    }, [inputs, setInputs]);
    const { currentProvider, currentModel, } = (0, hooks_1.useModelListAndDefaultModelAndCurrentProviderAndModel)(declarations_1.ModelTypeEnum.textGeneration);
    const { modelList: rerankModelList, defaultModel: rerankDefaultModel, } = (0, hooks_1.useModelListAndDefaultModelAndCurrentProviderAndModel)(declarations_1.ModelTypeEnum.rerank);
    const { currentModel: currentRerankModel, currentProvider: currentRerankProvider, } = (0, hooks_1.useCurrentProviderAndModel)(rerankModelList, rerankDefaultModel
        ? {
            ...rerankDefaultModel,
            provider: rerankDefaultModel.provider.provider,
        }
        : undefined);
    const handleModelChanged = (0, react_1.useCallback)((model) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (!draft.single_retrieval_config) {
                draft.single_retrieval_config = {
                    model: {
                        provider: '',
                        name: '',
                        mode: '',
                        completion_params: {},
                    },
                };
            }
            const draftModel = draft.single_retrieval_config?.model;
            draftModel.provider = model.provider;
            draftModel.name = model.modelId;
            draftModel.mode = model.mode;
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleCompletionParamsChange = (0, react_1.useCallback)((newParams) => {
        // inputRef.current.single_retrieval_config?.model is old  when change the provider...
        if ((0, predicate_1.isEqual)(newParams, inputRef.current.single_retrieval_config?.model.completion_params))
            return;
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (!draft.single_retrieval_config) {
                draft.single_retrieval_config = {
                    model: {
                        provider: '',
                        name: '',
                        mode: '',
                        completion_params: {},
                    },
                };
            }
            draft.single_retrieval_config.model.completion_params = newParams;
        });
        setInputs(newInputs);
    }, [setInputs]);
    // set defaults models
    (0, react_1.useEffect)(() => {
        const inputs = inputRef.current;
        if (inputs.retrieval_mode === app_1.RETRIEVE_TYPE.multiWay && inputs.multiple_retrieval_config?.reranking_model?.provider && currentRerankModel && rerankDefaultModel)
            return;
        if (inputs.retrieval_mode === app_1.RETRIEVE_TYPE.oneWay && inputs.single_retrieval_config?.model?.provider)
            return;
        const newInput = (0, immer_1.produce)(inputs, (draft) => {
            if (currentProvider?.provider && currentModel?.model) {
                const hasSetModel = draft.single_retrieval_config?.model?.provider;
                if (!hasSetModel) {
                    draft.single_retrieval_config = {
                        model: {
                            provider: currentProvider?.provider,
                            name: currentModel?.model,
                            mode: currentModel?.model_properties?.mode,
                            completion_params: {},
                        },
                    };
                }
            }
            const multipleRetrievalConfig = draft.multiple_retrieval_config;
            draft.multiple_retrieval_config = {
                top_k: multipleRetrievalConfig?.top_k || config_1.DATASET_DEFAULT.top_k,
                score_threshold: multipleRetrievalConfig?.score_threshold,
                reranking_model: multipleRetrievalConfig?.reranking_model,
                reranking_mode: multipleRetrievalConfig?.reranking_mode,
                weights: multipleRetrievalConfig?.weights,
                reranking_enable: multipleRetrievalConfig?.reranking_enable !== undefined
                    ? multipleRetrievalConfig.reranking_enable
                    : Boolean(currentRerankModel && rerankDefaultModel),
            };
        });
        setInputs(newInput);
    }, [currentProvider?.provider, currentModel, currentRerankModel, rerankDefaultModel]);
    const [selectedDatasets, setSelectedDatasets] = (0, react_1.useState)([]);
    const [rerankModelOpen, setRerankModelOpen] = (0, react_1.useState)(false);
    const handleRetrievalModeChange = (0, react_1.useCallback)((newMode) => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.retrieval_mode = newMode;
            if (newMode === app_1.RETRIEVE_TYPE.multiWay) {
                const multipleRetrievalConfig = draft.multiple_retrieval_config;
                draft.multiple_retrieval_config = (0, utils_1.getMultipleRetrievalConfig)(multipleRetrievalConfig, selectedDatasets, selectedDatasets, {
                    provider: currentRerankProvider?.provider,
                    model: currentRerankModel?.model,
                });
            }
            else {
                const hasSetModel = draft.single_retrieval_config?.model?.provider;
                if (!hasSetModel) {
                    draft.single_retrieval_config = {
                        model: {
                            provider: currentProvider?.provider || '',
                            name: currentModel?.model || '',
                            mode: currentModel?.model_properties?.mode,
                            completion_params: {},
                        },
                    };
                }
            }
        });
        setInputs(newInputs);
    }, [currentModel?.model, currentModel?.model_properties?.mode, currentProvider?.provider, inputs, setInputs, selectedDatasets, currentRerankModel, currentRerankProvider]);
    const handleMultipleRetrievalConfigChange = (0, react_1.useCallback)((newConfig) => {
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            const newMultipleRetrievalConfig = (0, utils_1.getMultipleRetrievalConfig)(newConfig, selectedDatasets, selectedDatasets, {
                provider: currentRerankProvider?.provider,
                model: currentRerankModel?.model,
            });
            draft.multiple_retrieval_config = newMultipleRetrievalConfig;
        });
        setInputs(newInputs);
    }, [inputs, setInputs, selectedDatasets, currentRerankModel, currentRerankProvider]);
    const [selectedDatasetsLoaded, setSelectedDatasetsLoaded] = (0, react_1.useState)(false);
    // datasets
    (0, react_1.useEffect)(() => {
        (async () => {
            const inputs = inputRef.current;
            const datasetIds = inputs.dataset_ids;
            if (datasetIds?.length > 0) {
                const { data: dataSetsWithDetail } = await (0, datasets_1.fetchDatasets)({ url: '/datasets', params: { page: 1, ids: datasetIds } });
                setSelectedDatasets(dataSetsWithDetail);
            }
            const newInputs = (0, immer_1.produce)(inputs, (draft) => {
                draft.dataset_ids = datasetIds;
            });
            setInputs(newInputs);
            setSelectedDatasetsLoaded(true);
        })();
    }, []);
    (0, react_1.useEffect)(() => {
        const inputs = inputRef.current;
        let query_variable_selector = inputs.query_variable_selector;
        if (isChatMode && inputs.query_variable_selector.length === 0 && startNodeId)
            query_variable_selector = [startNodeId, 'sys.query'];
        setInputs((0, immer_1.produce)(inputs, (draft) => {
            draft.query_variable_selector = query_variable_selector;
        }));
    }, []);
    const handleOnDatasetsChange = (0, react_1.useCallback)((newDatasets) => {
        const { mixtureHighQualityAndEconomic, mixtureInternalAndExternal, inconsistentEmbeddingModel, allInternal, allExternal, } = (0, utils_1.getSelectedDatasetsMode)(newDatasets);
        const noMultiModalDatasets = newDatasets.every(d => !d.is_multimodal);
        const newInputs = (0, immer_1.produce)(inputs, (draft) => {
            draft.dataset_ids = newDatasets.map(d => d.id);
            if (payload.retrieval_mode === app_1.RETRIEVE_TYPE.multiWay && newDatasets.length > 0) {
                const multipleRetrievalConfig = draft.multiple_retrieval_config;
                const newMultipleRetrievalConfig = (0, utils_1.getMultipleRetrievalConfig)(multipleRetrievalConfig, newDatasets, selectedDatasets, {
                    provider: currentRerankProvider?.provider,
                    model: currentRerankModel?.model,
                });
                draft.multiple_retrieval_config = newMultipleRetrievalConfig;
            }
            if (noMultiModalDatasets)
                draft.query_attachment_selector = [];
        });
        updateDatasetsDetail(newDatasets);
        setInputs(newInputs);
        setSelectedDatasets(newDatasets);
        if ((allInternal && (mixtureHighQualityAndEconomic || inconsistentEmbeddingModel))
            || mixtureInternalAndExternal
            || allExternal) {
            setRerankModelOpen(true);
        }
    }, [inputs, setInputs, payload.retrieval_mode, selectedDatasets, currentRerankModel, currentRerankProvider, updateDatasetsDetail]);
    const filterStringVar = (0, react_1.useCallback)((varPayload) => {
        return varPayload.type === types_1.VarType.string;
    }, []);
    const filterNumberVar = (0, react_1.useCallback)((varPayload) => {
        return varPayload.type === types_1.VarType.number;
    }, []);
    const filterFileVar = (0, react_1.useCallback)((varPayload) => {
        return varPayload.type === types_1.VarType.file || varPayload.type === types_1.VarType.arrayFile;
    }, []);
    const handleMetadataFilterModeChange = (0, react_1.useCallback)((newMode) => {
        setInputs((0, immer_1.produce)(inputRef.current, (draft) => {
            draft.metadata_filtering_mode = newMode;
        }));
    }, [setInputs]);
    const handleAddCondition = (0, react_1.useCallback)(({ id, name, type }) => {
        let operator = types_2.ComparisonOperator.is;
        if (type === types_2.MetadataFilteringVariableType.number)
            operator = types_2.ComparisonOperator.equal;
        const newCondition = {
            id: (0, uuid_1.v4)(),
            metadata_id: id, // Save metadata.id for reliable reference
            name,
            comparison_operator: operator,
        };
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (draft.metadata_filtering_conditions) {
                draft.metadata_filtering_conditions.conditions.push(newCondition);
            }
            else {
                draft.metadata_filtering_conditions = {
                    logical_operator: types_2.LogicalOperator.and,
                    conditions: [newCondition],
                };
            }
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleRemoveCondition = (0, react_1.useCallback)((id) => {
        const conditions = inputRef.current.metadata_filtering_conditions?.conditions || [];
        const index = conditions.findIndex(c => c.id === id);
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (index > -1)
                draft.metadata_filtering_conditions?.conditions.splice(index, 1);
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleUpdateCondition = (0, react_1.useCallback)((id, newCondition) => {
        const conditions = inputRef.current.metadata_filtering_conditions?.conditions || [];
        const index = conditions.findIndex(c => c.id === id);
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            if (index > -1)
                draft.metadata_filtering_conditions.conditions[index] = newCondition;
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleToggleConditionLogicalOperator = (0, react_1.useCallback)(() => {
        const oldLogicalOperator = inputRef.current.metadata_filtering_conditions?.logical_operator;
        const newLogicalOperator = oldLogicalOperator === types_2.LogicalOperator.and ? types_2.LogicalOperator.or : types_2.LogicalOperator.and;
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.metadata_filtering_conditions.logical_operator = newLogicalOperator;
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleMetadataModelChange = (0, react_1.useCallback)((model) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.metadata_model_config = {
                provider: model.provider,
                name: model.modelId,
                mode: model.mode || app_1.AppModeEnum.CHAT,
                completion_params: draft.metadata_model_config?.completion_params || { temperature: 0.7 },
            };
        });
        setInputs(newInputs);
    }, [setInputs]);
    const handleMetadataCompletionParamsChange = (0, react_1.useCallback)((newParams) => {
        const newInputs = (0, immer_1.produce)(inputRef.current, (draft) => {
            draft.metadata_model_config = {
                ...draft.metadata_model_config,
                completion_params: newParams,
            };
        });
        setInputs(newInputs);
    }, [setInputs]);
    const { availableVars: availableStringVars, availableNodesWithParent: availableStringNodesWithParent, } = (0, use_available_var_list_1.default)(id, {
        onlyLeafNodeVar: false,
        filterVar: filterStringVar,
    });
    const { availableVars: availableNumberVars, availableNodesWithParent: availableNumberNodesWithParent, } = (0, use_available_var_list_1.default)(id, {
        onlyLeafNodeVar: false,
        filterVar: filterNumberVar,
    });
    const showImageQueryVarSelector = (0, react_1.useMemo)(() => {
        return selectedDatasets.some(d => d.is_multimodal);
    }, [selectedDatasets]);
    return {
        readOnly,
        inputs,
        handleQueryVarChange,
        handleQueryAttachmentChange,
        filterStringVar,
        filterFileVar,
        handleRetrievalModeChange,
        handleMultipleRetrievalConfigChange,
        handleModelChanged,
        handleCompletionParamsChange,
        selectedDatasets: selectedDatasets.filter(d => d.name),
        selectedDatasetsLoaded,
        handleOnDatasetsChange,
        rerankModelOpen,
        setRerankModelOpen,
        handleMetadataFilterModeChange,
        handleUpdateCondition,
        handleAddCondition,
        handleRemoveCondition,
        handleToggleConditionLogicalOperator,
        handleMetadataModelChange,
        handleMetadataCompletionParamsChange,
        availableStringVars,
        availableStringNodesWithParent,
        availableNumberVars,
        availableNumberNodesWithParent,
        showImageQueryVarSelector,
    };
};
exports.default = useConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFXQSxvREFBOEM7QUFDOUMsaUNBQStCO0FBQy9CLGlDQU1jO0FBQ2QsK0JBQWtDO0FBQ2xDLDJHQUF3RztBQUN4Ryw2RkFBcUs7QUFDckssK0dBQW9HO0FBQ3BHLDZGQUFtRjtBQUNuRixxQ0FBMEM7QUFDMUMsaURBQWtEO0FBQ2xELHFDQUF3RDtBQUN4RCw2REFBMEU7QUFDMUUsdUNBSW9CO0FBQ3BCLHVDQUFnRDtBQUNoRCxtQ0FJZ0I7QUFDaEIsbUNBR2dCO0FBRWhCLE1BQU0sU0FBUyxHQUFHLENBQUMsRUFBVSxFQUFFLE9BQW1DLEVBQUUsRUFBRTtJQUNwRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN0RCxNQUFNLFVBQVUsR0FBRyxJQUFBLHFCQUFhLEdBQUUsQ0FBQTtJQUNsQyxNQUFNLEVBQUUsMEJBQTBCLEVBQUUsR0FBRyxJQUFBLG1CQUFXLEdBQUUsQ0FBQTtJQUNwRCxNQUFNLFNBQVMsR0FBRywwQkFBMEIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2pHLE1BQU0sV0FBVyxHQUFHLFNBQVMsRUFBRSxFQUFFLENBQUE7SUFDakMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBQSx1QkFBVyxFQUE2QixFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDL0YsTUFBTSxvQkFBb0IsR0FBRyxJQUFBLDhCQUFzQixFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFFaEYsTUFBTSxRQUFRLEdBQUcsSUFB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LGVBQWU7S0FDM0IsQ0FBQyxDQUFBO0lBRUYsTUFBTSx5QkFBeUIsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDN0MsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDcEQsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO0lBRXRCLE9BQU87UUFDTCxRQUFRO1FBQ1IsTUFBTTtRQUNOLG9CQUFvQjtRQUNwQiwyQkFBMkI7UUFDM0IsZUFBZTtRQUNmLGFBQWE7UUFDYix5QkFBeUI7UUFDekIsbUNBQW1DO1FBQ25DLGtCQUFrQjtRQUNsQiw0QkFBNEI7UUFDNUIsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN0RCxzQkFBc0I7UUFDdEIsc0JBQXNCO1FBQ3RCLGVBQWU7UUFDZixrQkFBa0I7UUFDbEIsOEJBQThCO1FBQzlCLHFCQUFxQjtRQUNyQixrQkFBa0I7UUFDbEIscUJBQXFCO1FBQ3JCLG9DQUFvQztRQUNwQyx5QkFBeUI7UUFDekIsb0NBQW9DO1FBQ3BDLG1CQUFtQjtRQUNuQiw4QkFBOEI7UUFDOUIsbUJBQW1CO1FBQ25CLDhCQUE4QjtRQUM5Qix5QkFBeUI7S0FDMUIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFNBQVMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVmFsdWVTZWxlY3RvciwgVmFyIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7XG4gIEhhbmRsZUFkZENvbmRpdGlvbixcbiAgSGFuZGxlUmVtb3ZlQ29uZGl0aW9uLFxuICBIYW5kbGVUb2dnbGVDb25kaXRpb25Mb2dpY2FsT3BlcmF0b3IsXG4gIEhhbmRsZVVwZGF0ZUNvbmRpdGlvbixcbiAgS25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGUsXG4gIE1ldGFkYXRhRmlsdGVyaW5nTW9kZUVudW0sXG4gIE11bHRpcGxlUmV0cmlldmFsQ29uZmlnLFxufSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU2V0IH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBpc0VxdWFsIH0gZnJvbSAnZXMtdG9vbGtpdC9wcmVkaWNhdGUnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQge1xuICB1c2VDYWxsYmFjayxcbiAgdXNlRWZmZWN0LFxuICB1c2VNZW1vLFxuICB1c2VSZWYsXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHY0IGFzIHV1aWQ0IH0gZnJvbSAndXVpZCdcbmltcG9ydCB7IE1vZGVsVHlwZUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9kZWNsYXJhdGlvbnMnXG5pbXBvcnQgeyB1c2VDdXJyZW50UHJvdmlkZXJBbmRNb2RlbCwgdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcydcbmltcG9ydCB1c2VBdmFpbGFibGVWYXJMaXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvX2Jhc2UvaG9va3MvdXNlLWF2YWlsYWJsZS12YXItbGlzdCdcbmltcG9ydCB1c2VOb2RlQ3J1ZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL19iYXNlL2hvb2tzL3VzZS1ub2RlLWNydWQnXG5pbXBvcnQgeyBEQVRBU0VUX0RFRkFVTFQgfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IGZldGNoRGF0YXNldHMgfSBmcm9tICdAL3NlcnZpY2UvZGF0YXNldHMnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSwgUkVUUklFVkVfVFlQRSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgdXNlRGF0YXNldHNEZXRhaWxTdG9yZSB9IGZyb20gJy4uLy4uL2RhdGFzZXRzLWRldGFpbC1zdG9yZS9zdG9yZSdcbmltcG9ydCB7XG4gIHVzZUlzQ2hhdE1vZGUsXG4gIHVzZU5vZGVzUmVhZE9ubHksXG4gIHVzZVdvcmtmbG93LFxufSBmcm9tICcuLi8uLi9ob29rcydcbmltcG9ydCB7IEJsb2NrRW51bSwgVmFyVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHtcbiAgQ29tcGFyaXNvbk9wZXJhdG9yLFxuICBMb2dpY2FsT3BlcmF0b3IsXG4gIE1ldGFkYXRhRmlsdGVyaW5nVmFyaWFibGVUeXBlLFxufSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHtcbiAgZ2V0TXVsdGlwbGVSZXRyaWV2YWxDb25maWcsXG4gIGdldFNlbGVjdGVkRGF0YXNldHNNb2RlLFxufSBmcm9tICcuL3V0aWxzJ1xuXG5jb25zdCB1c2VDb25maWcgPSAoaWQ6IHN0cmluZywgcGF5bG9hZDogS25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGUpID0+IHtcbiAgY29uc3QgeyBub2Rlc1JlYWRPbmx5OiByZWFkT25seSB9ID0gdXNlTm9kZXNSZWFkT25seSgpXG4gIGNvbnN0IGlzQ2hhdE1vZGUgPSB1c2VJc0NoYXRNb2RlKClcbiAgY29uc3QgeyBnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaCB9ID0gdXNlV29ya2Zsb3coKVxuICBjb25zdCBzdGFydE5vZGUgPSBnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaChpZCkuZmluZChub2RlID0+IG5vZGUuZGF0YS50eXBlID09PSBCbG9ja0VudW0uU3RhcnQpXG4gIGNvbnN0IHN0YXJ0Tm9kZUlkID0gc3RhcnROb2RlPy5pZFxuICBjb25zdCB7IGlucHV0cywgc2V0SW5wdXRzOiBkb1NldElucHV0cyB9ID0gdXNlTm9kZUNydWQ8S25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGU+KGlkLCBwYXlsb2FkKVxuICBjb25zdCB1cGRhdGVEYXRhc2V0c0RldGFpbCA9IHVzZURhdGFzZXRzRGV0YWlsU3RvcmUocyA9PiBzLnVwZGF0ZURhdGFzZXRzRGV0YWlsKVxuXG4gIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmKGlucHV0cylcblxuICBjb25zdCBzZXRJbnB1dHMgPSB1c2VDYWxsYmFjaygoczogS25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGUpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKHMsIChkcmFmdCkgPT4ge1xuICAgICAgaWYgKHMucmV0cmlldmFsX21vZGUgPT09IFJFVFJJRVZFX1RZUEUubXVsdGlXYXkpXG4gICAgICAgIGRlbGV0ZSBkcmFmdC5zaW5nbGVfcmV0cmlldmFsX2NvbmZpZ1xuICAgICAgZWxzZVxuICAgICAgICBkZWxldGUgZHJhZnQubXVsdGlwbGVfcmV0cmlldmFsX2NvbmZpZ1xuICAgIH0pXG4gICAgLy8gbm90IHdvcmsgaW4gcGFzcyB0byBkcmFmdC4uLlxuICAgIGRvU2V0SW5wdXRzKG5ld0lucHV0cylcbiAgICBpbnB1dFJlZi5jdXJyZW50ID0gbmV3SW5wdXRzXG4gIH0sIFtkb1NldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlUXVlcnlWYXJDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3VmFyOiBWYWx1ZVNlbGVjdG9yIHwgc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dHMsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQucXVlcnlfdmFyaWFibGVfc2VsZWN0b3IgPSBuZXdWYXIgYXMgVmFsdWVTZWxlY3RvclxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW2lucHV0cywgc2V0SW5wdXRzXSlcblxuICBjb25zdCBoYW5kbGVRdWVyeUF0dGFjaG1lbnRDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3VmFyOiBWYWx1ZVNlbGVjdG9yIHwgc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dHMsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQucXVlcnlfYXR0YWNobWVudF9zZWxlY3RvciA9IG5ld1ZhciBhcyBWYWx1ZVNlbGVjdG9yXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbaW5wdXRzLCBzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IHtcbiAgICBjdXJyZW50UHJvdmlkZXIsXG4gICAgY3VycmVudE1vZGVsLFxuICB9ID0gdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwoTW9kZWxUeXBlRW51bS50ZXh0R2VuZXJhdGlvbilcblxuICBjb25zdCB7XG4gICAgbW9kZWxMaXN0OiByZXJhbmtNb2RlbExpc3QsXG4gICAgZGVmYXVsdE1vZGVsOiByZXJhbmtEZWZhdWx0TW9kZWwsXG4gIH0gPSB1c2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWxBbmRDdXJyZW50UHJvdmlkZXJBbmRNb2RlbChNb2RlbFR5cGVFbnVtLnJlcmFuaylcblxuICBjb25zdCB7XG4gICAgY3VycmVudE1vZGVsOiBjdXJyZW50UmVyYW5rTW9kZWwsXG4gICAgY3VycmVudFByb3ZpZGVyOiBjdXJyZW50UmVyYW5rUHJvdmlkZXIsXG4gIH0gPSB1c2VDdXJyZW50UHJvdmlkZXJBbmRNb2RlbChcbiAgICByZXJhbmtNb2RlbExpc3QsXG4gICAgcmVyYW5rRGVmYXVsdE1vZGVsXG4gICAgICA/IHtcbiAgICAgICAgICAuLi5yZXJhbmtEZWZhdWx0TW9kZWwsXG4gICAgICAgICAgcHJvdmlkZXI6IHJlcmFua0RlZmF1bHRNb2RlbC5wcm92aWRlci5wcm92aWRlcixcbiAgICAgICAgfVxuICAgICAgOiB1bmRlZmluZWQsXG4gIClcblxuICBjb25zdCBoYW5kbGVNb2RlbENoYW5nZWQgPSB1c2VDYWxsYmFjaygobW9kZWw6IHsgcHJvdmlkZXI6IHN0cmluZywgbW9kZWxJZDogc3RyaW5nLCBtb2RlPzogc3RyaW5nIH0pID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0UmVmLmN1cnJlbnQsIChkcmFmdCkgPT4ge1xuICAgICAgaWYgKCFkcmFmdC5zaW5nbGVfcmV0cmlldmFsX2NvbmZpZykge1xuICAgICAgICBkcmFmdC5zaW5nbGVfcmV0cmlldmFsX2NvbmZpZyA9IHtcbiAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgcHJvdmlkZXI6ICcnLFxuICAgICAgICAgICAgbmFtZTogJycsXG4gICAgICAgICAgICBtb2RlOiAnJyxcbiAgICAgICAgICAgIGNvbXBsZXRpb25fcGFyYW1zOiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBkcmFmdE1vZGVsID0gZHJhZnQuc2luZ2xlX3JldHJpZXZhbF9jb25maWc/Lm1vZGVsXG4gICAgICBkcmFmdE1vZGVsLnByb3ZpZGVyID0gbW9kZWwucHJvdmlkZXJcbiAgICAgIGRyYWZ0TW9kZWwubmFtZSA9IG1vZGVsLm1vZGVsSWRcbiAgICAgIGRyYWZ0TW9kZWwubW9kZSA9IG1vZGVsLm1vZGUhXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbc2V0SW5wdXRzXSlcblxuICBjb25zdCBoYW5kbGVDb21wbGV0aW9uUGFyYW1zQ2hhbmdlID0gdXNlQ2FsbGJhY2soKG5ld1BhcmFtczogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICAgIC8vIGlucHV0UmVmLmN1cnJlbnQuc2luZ2xlX3JldHJpZXZhbF9jb25maWc/Lm1vZGVsIGlzIG9sZCAgd2hlbiBjaGFuZ2UgdGhlIHByb3ZpZGVyLi4uXG4gICAgaWYgKGlzRXF1YWwobmV3UGFyYW1zLCBpbnB1dFJlZi5jdXJyZW50LnNpbmdsZV9yZXRyaWV2YWxfY29uZmlnPy5tb2RlbC5jb21wbGV0aW9uX3BhcmFtcykpXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBpZiAoIWRyYWZ0LnNpbmdsZV9yZXRyaWV2YWxfY29uZmlnKSB7XG4gICAgICAgIGRyYWZ0LnNpbmdsZV9yZXRyaWV2YWxfY29uZmlnID0ge1xuICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICBwcm92aWRlcjogJycsXG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIG1vZGU6ICcnLFxuICAgICAgICAgICAgY29tcGxldGlvbl9wYXJhbXM6IHt9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGRyYWZ0LnNpbmdsZV9yZXRyaWV2YWxfY29uZmlnLm1vZGVsLmNvbXBsZXRpb25fcGFyYW1zID0gbmV3UGFyYW1zXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbc2V0SW5wdXRzXSlcblxuICAvLyBzZXQgZGVmYXVsdHMgbW9kZWxzXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaW5wdXRzID0gaW5wdXRSZWYuY3VycmVudFxuICAgIGlmIChpbnB1dHMucmV0cmlldmFsX21vZGUgPT09IFJFVFJJRVZFX1RZUEUubXVsdGlXYXkgJiYgaW5wdXRzLm11bHRpcGxlX3JldHJpZXZhbF9jb25maWc/LnJlcmFua2luZ19tb2RlbD8ucHJvdmlkZXIgJiYgY3VycmVudFJlcmFua01vZGVsICYmIHJlcmFua0RlZmF1bHRNb2RlbClcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKGlucHV0cy5yZXRyaWV2YWxfbW9kZSA9PT0gUkVUUklFVkVfVFlQRS5vbmVXYXkgJiYgaW5wdXRzLnNpbmdsZV9yZXRyaWV2YWxfY29uZmlnPy5tb2RlbD8ucHJvdmlkZXIpXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IG5ld0lucHV0ID0gcHJvZHVjZShpbnB1dHMsIChkcmFmdCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRQcm92aWRlcj8ucHJvdmlkZXIgJiYgY3VycmVudE1vZGVsPy5tb2RlbCkge1xuICAgICAgICBjb25zdCBoYXNTZXRNb2RlbCA9IGRyYWZ0LnNpbmdsZV9yZXRyaWV2YWxfY29uZmlnPy5tb2RlbD8ucHJvdmlkZXJcbiAgICAgICAgaWYgKCFoYXNTZXRNb2RlbCkge1xuICAgICAgICAgIGRyYWZ0LnNpbmdsZV9yZXRyaWV2YWxfY29uZmlnID0ge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IGN1cnJlbnRQcm92aWRlcj8ucHJvdmlkZXIsXG4gICAgICAgICAgICAgIG5hbWU6IGN1cnJlbnRNb2RlbD8ubW9kZWwsXG4gICAgICAgICAgICAgIG1vZGU6IGN1cnJlbnRNb2RlbD8ubW9kZWxfcHJvcGVydGllcz8ubW9kZSBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgIGNvbXBsZXRpb25fcGFyYW1zOiB7fSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBtdWx0aXBsZVJldHJpZXZhbENvbmZpZyA9IGRyYWZ0Lm11bHRpcGxlX3JldHJpZXZhbF9jb25maWdcbiAgICAgIGRyYWZ0Lm11bHRpcGxlX3JldHJpZXZhbF9jb25maWcgPSB7XG4gICAgICAgIHRvcF9rOiBtdWx0aXBsZVJldHJpZXZhbENvbmZpZz8udG9wX2sgfHwgREFUQVNFVF9ERUZBVUxULnRvcF9rLFxuICAgICAgICBzY29yZV90aHJlc2hvbGQ6IG11bHRpcGxlUmV0cmlldmFsQ29uZmlnPy5zY29yZV90aHJlc2hvbGQsXG4gICAgICAgIHJlcmFua2luZ19tb2RlbDogbXVsdGlwbGVSZXRyaWV2YWxDb25maWc/LnJlcmFua2luZ19tb2RlbCxcbiAgICAgICAgcmVyYW5raW5nX21vZGU6IG11bHRpcGxlUmV0cmlldmFsQ29uZmlnPy5yZXJhbmtpbmdfbW9kZSxcbiAgICAgICAgd2VpZ2h0czogbXVsdGlwbGVSZXRyaWV2YWxDb25maWc/LndlaWdodHMsXG4gICAgICAgIHJlcmFua2luZ19lbmFibGU6IG11bHRpcGxlUmV0cmlldmFsQ29uZmlnPy5yZXJhbmtpbmdfZW5hYmxlICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IG11bHRpcGxlUmV0cmlldmFsQ29uZmlnLnJlcmFua2luZ19lbmFibGVcbiAgICAgICAgICA6IEJvb2xlYW4oY3VycmVudFJlcmFua01vZGVsICYmIHJlcmFua0RlZmF1bHRNb2RlbCksXG4gICAgICB9XG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXQpXG4gIH0sIFtjdXJyZW50UHJvdmlkZXI/LnByb3ZpZGVyLCBjdXJyZW50TW9kZWwsIGN1cnJlbnRSZXJhbmtNb2RlbCwgcmVyYW5rRGVmYXVsdE1vZGVsXSlcbiAgY29uc3QgW3NlbGVjdGVkRGF0YXNldHMsIHNldFNlbGVjdGVkRGF0YXNldHNdID0gdXNlU3RhdGU8RGF0YVNldFtdPihbXSlcbiAgY29uc3QgW3JlcmFua01vZGVsT3Blbiwgc2V0UmVyYW5rTW9kZWxPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBoYW5kbGVSZXRyaWV2YWxNb2RlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKG5ld01vZGU6IFJFVFJJRVZFX1RZUEUpID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0cywgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5yZXRyaWV2YWxfbW9kZSA9IG5ld01vZGVcbiAgICAgIGlmIChuZXdNb2RlID09PSBSRVRSSUVWRV9UWVBFLm11bHRpV2F5KSB7XG4gICAgICAgIGNvbnN0IG11bHRpcGxlUmV0cmlldmFsQ29uZmlnID0gZHJhZnQubXVsdGlwbGVfcmV0cmlldmFsX2NvbmZpZ1xuICAgICAgICBkcmFmdC5tdWx0aXBsZV9yZXRyaWV2YWxfY29uZmlnID0gZ2V0TXVsdGlwbGVSZXRyaWV2YWxDb25maWcobXVsdGlwbGVSZXRyaWV2YWxDb25maWchLCBzZWxlY3RlZERhdGFzZXRzLCBzZWxlY3RlZERhdGFzZXRzLCB7XG4gICAgICAgICAgcHJvdmlkZXI6IGN1cnJlbnRSZXJhbmtQcm92aWRlcj8ucHJvdmlkZXIsXG4gICAgICAgICAgbW9kZWw6IGN1cnJlbnRSZXJhbmtNb2RlbD8ubW9kZWwsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgaGFzU2V0TW9kZWwgPSBkcmFmdC5zaW5nbGVfcmV0cmlldmFsX2NvbmZpZz8ubW9kZWw/LnByb3ZpZGVyXG4gICAgICAgIGlmICghaGFzU2V0TW9kZWwpIHtcbiAgICAgICAgICBkcmFmdC5zaW5nbGVfcmV0cmlldmFsX2NvbmZpZyA9IHtcbiAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgIHByb3ZpZGVyOiBjdXJyZW50UHJvdmlkZXI/LnByb3ZpZGVyIHx8ICcnLFxuICAgICAgICAgICAgICBuYW1lOiBjdXJyZW50TW9kZWw/Lm1vZGVsIHx8ICcnLFxuICAgICAgICAgICAgICBtb2RlOiBjdXJyZW50TW9kZWw/Lm1vZGVsX3Byb3BlcnRpZXM/Lm1vZGUgYXMgc3RyaW5nLFxuICAgICAgICAgICAgICBjb21wbGV0aW9uX3BhcmFtczoge30sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW2N1cnJlbnRNb2RlbD8ubW9kZWwsIGN1cnJlbnRNb2RlbD8ubW9kZWxfcHJvcGVydGllcz8ubW9kZSwgY3VycmVudFByb3ZpZGVyPy5wcm92aWRlciwgaW5wdXRzLCBzZXRJbnB1dHMsIHNlbGVjdGVkRGF0YXNldHMsIGN1cnJlbnRSZXJhbmtNb2RlbCwgY3VycmVudFJlcmFua1Byb3ZpZGVyXSlcblxuICBjb25zdCBoYW5kbGVNdWx0aXBsZVJldHJpZXZhbENvbmZpZ0NoYW5nZSA9IHVzZUNhbGxiYWNrKChuZXdDb25maWc6IE11bHRpcGxlUmV0cmlldmFsQ29uZmlnKSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dHMsIChkcmFmdCkgPT4ge1xuICAgICAgY29uc3QgbmV3TXVsdGlwbGVSZXRyaWV2YWxDb25maWcgPSBnZXRNdWx0aXBsZVJldHJpZXZhbENvbmZpZyhuZXdDb25maWchLCBzZWxlY3RlZERhdGFzZXRzLCBzZWxlY3RlZERhdGFzZXRzLCB7XG4gICAgICAgIHByb3ZpZGVyOiBjdXJyZW50UmVyYW5rUHJvdmlkZXI/LnByb3ZpZGVyLFxuICAgICAgICBtb2RlbDogY3VycmVudFJlcmFua01vZGVsPy5tb2RlbCxcbiAgICAgIH0pXG4gICAgICBkcmFmdC5tdWx0aXBsZV9yZXRyaWV2YWxfY29uZmlnID0gbmV3TXVsdGlwbGVSZXRyaWV2YWxDb25maWdcbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtpbnB1dHMsIHNldElucHV0cywgc2VsZWN0ZWREYXRhc2V0cywgY3VycmVudFJlcmFua01vZGVsLCBjdXJyZW50UmVyYW5rUHJvdmlkZXJdKVxuXG4gIGNvbnN0IFtzZWxlY3RlZERhdGFzZXRzTG9hZGVkLCBzZXRTZWxlY3RlZERhdGFzZXRzTG9hZGVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuICAvLyBkYXRhc2V0c1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBpbnB1dHMgPSBpbnB1dFJlZi5jdXJyZW50XG4gICAgICBjb25zdCBkYXRhc2V0SWRzID0gaW5wdXRzLmRhdGFzZXRfaWRzXG4gICAgICBpZiAoZGF0YXNldElkcz8ubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCB7IGRhdGE6IGRhdGFTZXRzV2l0aERldGFpbCB9ID0gYXdhaXQgZmV0Y2hEYXRhc2V0cyh7IHVybDogJy9kYXRhc2V0cycsIHBhcmFtczogeyBwYWdlOiAxLCBpZHM6IGRhdGFzZXRJZHMgfSBhcyBhbnkgfSlcbiAgICAgICAgc2V0U2VsZWN0ZWREYXRhc2V0cyhkYXRhU2V0c1dpdGhEZXRhaWwpXG4gICAgICB9XG4gICAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0cywgKGRyYWZ0KSA9PiB7XG4gICAgICAgIGRyYWZ0LmRhdGFzZXRfaWRzID0gZGF0YXNldElkc1xuICAgICAgfSlcbiAgICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gICAgICBzZXRTZWxlY3RlZERhdGFzZXRzTG9hZGVkKHRydWUpXG4gICAgfSkoKVxuICB9LCBbXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0cyA9IGlucHV0UmVmLmN1cnJlbnRcbiAgICBsZXQgcXVlcnlfdmFyaWFibGVfc2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IgPSBpbnB1dHMucXVlcnlfdmFyaWFibGVfc2VsZWN0b3JcbiAgICBpZiAoaXNDaGF0TW9kZSAmJiBpbnB1dHMucXVlcnlfdmFyaWFibGVfc2VsZWN0b3IubGVuZ3RoID09PSAwICYmIHN0YXJ0Tm9kZUlkKVxuICAgICAgcXVlcnlfdmFyaWFibGVfc2VsZWN0b3IgPSBbc3RhcnROb2RlSWQsICdzeXMucXVlcnknXVxuXG4gICAgc2V0SW5wdXRzKHByb2R1Y2UoaW5wdXRzLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LnF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yID0gcXVlcnlfdmFyaWFibGVfc2VsZWN0b3JcbiAgICB9KSlcbiAgfSwgW10pXG5cbiAgY29uc3QgaGFuZGxlT25EYXRhc2V0c0NoYW5nZSA9IHVzZUNhbGxiYWNrKChuZXdEYXRhc2V0czogRGF0YVNldFtdKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgbWl4dHVyZUhpZ2hRdWFsaXR5QW5kRWNvbm9taWMsXG4gICAgICBtaXh0dXJlSW50ZXJuYWxBbmRFeHRlcm5hbCxcbiAgICAgIGluY29uc2lzdGVudEVtYmVkZGluZ01vZGVsLFxuICAgICAgYWxsSW50ZXJuYWwsXG4gICAgICBhbGxFeHRlcm5hbCxcbiAgICB9ID0gZ2V0U2VsZWN0ZWREYXRhc2V0c01vZGUobmV3RGF0YXNldHMpXG4gICAgY29uc3Qgbm9NdWx0aU1vZGFsRGF0YXNldHMgPSBuZXdEYXRhc2V0cy5ldmVyeShkID0+ICFkLmlzX211bHRpbW9kYWwpXG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShpbnB1dHMsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQuZGF0YXNldF9pZHMgPSBuZXdEYXRhc2V0cy5tYXAoZCA9PiBkLmlkKVxuXG4gICAgICBpZiAocGF5bG9hZC5yZXRyaWV2YWxfbW9kZSA9PT0gUkVUUklFVkVfVFlQRS5tdWx0aVdheSAmJiBuZXdEYXRhc2V0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IG11bHRpcGxlUmV0cmlldmFsQ29uZmlnID0gZHJhZnQubXVsdGlwbGVfcmV0cmlldmFsX2NvbmZpZ1xuICAgICAgICBjb25zdCBuZXdNdWx0aXBsZVJldHJpZXZhbENvbmZpZyA9IGdldE11bHRpcGxlUmV0cmlldmFsQ29uZmlnKG11bHRpcGxlUmV0cmlldmFsQ29uZmlnISwgbmV3RGF0YXNldHMsIHNlbGVjdGVkRGF0YXNldHMsIHtcbiAgICAgICAgICBwcm92aWRlcjogY3VycmVudFJlcmFua1Byb3ZpZGVyPy5wcm92aWRlcixcbiAgICAgICAgICBtb2RlbDogY3VycmVudFJlcmFua01vZGVsPy5tb2RlbCxcbiAgICAgICAgfSlcbiAgICAgICAgZHJhZnQubXVsdGlwbGVfcmV0cmlldmFsX2NvbmZpZyA9IG5ld011bHRpcGxlUmV0cmlldmFsQ29uZmlnXG4gICAgICB9XG5cbiAgICAgIGlmIChub011bHRpTW9kYWxEYXRhc2V0cylcbiAgICAgICAgZHJhZnQucXVlcnlfYXR0YWNobWVudF9zZWxlY3RvciA9IFtdXG4gICAgfSlcbiAgICB1cGRhdGVEYXRhc2V0c0RldGFpbChuZXdEYXRhc2V0cylcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICAgIHNldFNlbGVjdGVkRGF0YXNldHMobmV3RGF0YXNldHMpXG5cbiAgICBpZiAoXG4gICAgICAoYWxsSW50ZXJuYWwgJiYgKG1peHR1cmVIaWdoUXVhbGl0eUFuZEVjb25vbWljIHx8IGluY29uc2lzdGVudEVtYmVkZGluZ01vZGVsKSlcbiAgICAgIHx8IG1peHR1cmVJbnRlcm5hbEFuZEV4dGVybmFsXG4gICAgICB8fCBhbGxFeHRlcm5hbFxuICAgICkge1xuICAgICAgc2V0UmVyYW5rTW9kZWxPcGVuKHRydWUpXG4gICAgfVxuICB9LCBbaW5wdXRzLCBzZXRJbnB1dHMsIHBheWxvYWQucmV0cmlldmFsX21vZGUsIHNlbGVjdGVkRGF0YXNldHMsIGN1cnJlbnRSZXJhbmtNb2RlbCwgY3VycmVudFJlcmFua1Byb3ZpZGVyLCB1cGRhdGVEYXRhc2V0c0RldGFpbF0pXG5cbiAgY29uc3QgZmlsdGVyU3RyaW5nVmFyID0gdXNlQ2FsbGJhY2soKHZhclBheWxvYWQ6IFZhcikgPT4ge1xuICAgIHJldHVybiB2YXJQYXlsb2FkLnR5cGUgPT09IFZhclR5cGUuc3RyaW5nXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGZpbHRlck51bWJlclZhciA9IHVzZUNhbGxiYWNrKCh2YXJQYXlsb2FkOiBWYXIpID0+IHtcbiAgICByZXR1cm4gdmFyUGF5bG9hZC50eXBlID09PSBWYXJUeXBlLm51bWJlclxuICB9LCBbXSlcblxuICBjb25zdCBmaWx0ZXJGaWxlVmFyID0gdXNlQ2FsbGJhY2soKHZhclBheWxvYWQ6IFZhcikgPT4ge1xuICAgIHJldHVybiB2YXJQYXlsb2FkLnR5cGUgPT09IFZhclR5cGUuZmlsZSB8fCB2YXJQYXlsb2FkLnR5cGUgPT09IFZhclR5cGUuYXJyYXlGaWxlXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZU1ldGFkYXRhRmlsdGVyTW9kZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChuZXdNb2RlOiBNZXRhZGF0YUZpbHRlcmluZ01vZGVFbnVtKSA9PiB7XG4gICAgc2V0SW5wdXRzKHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5tZXRhZGF0YV9maWx0ZXJpbmdfbW9kZSA9IG5ld01vZGVcbiAgICB9KSlcbiAgfSwgW3NldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlQWRkQ29uZGl0aW9uID0gdXNlQ2FsbGJhY2s8SGFuZGxlQWRkQ29uZGl0aW9uPigoeyBpZCwgbmFtZSwgdHlwZSB9KSA9PiB7XG4gICAgbGV0IG9wZXJhdG9yOiBDb21wYXJpc29uT3BlcmF0b3IgPSBDb21wYXJpc29uT3BlcmF0b3IuaXNcblxuICAgIGlmICh0eXBlID09PSBNZXRhZGF0YUZpbHRlcmluZ1ZhcmlhYmxlVHlwZS5udW1iZXIpXG4gICAgICBvcGVyYXRvciA9IENvbXBhcmlzb25PcGVyYXRvci5lcXVhbFxuXG4gICAgY29uc3QgbmV3Q29uZGl0aW9uID0ge1xuICAgICAgaWQ6IHV1aWQ0KCksXG4gICAgICBtZXRhZGF0YV9pZDogaWQsIC8vIFNhdmUgbWV0YWRhdGEuaWQgZm9yIHJlbGlhYmxlIHJlZmVyZW5jZVxuICAgICAgbmFtZSxcbiAgICAgIGNvbXBhcmlzb25fb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIH1cblxuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBpZiAoZHJhZnQubWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnMpIHtcbiAgICAgICAgZHJhZnQubWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnMuY29uZGl0aW9ucy5wdXNoKG5ld0NvbmRpdGlvbilcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkcmFmdC5tZXRhZGF0YV9maWx0ZXJpbmdfY29uZGl0aW9ucyA9IHtcbiAgICAgICAgICBsb2dpY2FsX29wZXJhdG9yOiBMb2dpY2FsT3BlcmF0b3IuYW5kLFxuICAgICAgICAgIGNvbmRpdGlvbnM6IFtuZXdDb25kaXRpb25dLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbc2V0SW5wdXRzXSlcblxuICBjb25zdCBoYW5kbGVSZW1vdmVDb25kaXRpb24gPSB1c2VDYWxsYmFjazxIYW5kbGVSZW1vdmVDb25kaXRpb24+KChpZCkgPT4ge1xuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBpbnB1dFJlZi5jdXJyZW50Lm1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zPy5jb25kaXRpb25zIHx8IFtdXG4gICAgY29uc3QgaW5kZXggPSBjb25kaXRpb25zLmZpbmRJbmRleChjID0+IGMuaWQgPT09IGlkKVxuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgZHJhZnQubWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnM/LmNvbmRpdGlvbnMuc3BsaWNlKGluZGV4LCAxKVxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW3NldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlVXBkYXRlQ29uZGl0aW9uID0gdXNlQ2FsbGJhY2s8SGFuZGxlVXBkYXRlQ29uZGl0aW9uPigoaWQsIG5ld0NvbmRpdGlvbikgPT4ge1xuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBpbnB1dFJlZi5jdXJyZW50Lm1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zPy5jb25kaXRpb25zIHx8IFtdXG4gICAgY29uc3QgaW5kZXggPSBjb25kaXRpb25zLmZpbmRJbmRleChjID0+IGMuaWQgPT09IGlkKVxuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgZHJhZnQubWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnMhLmNvbmRpdGlvbnNbaW5kZXhdID0gbmV3Q29uZGl0aW9uXG4gICAgfSlcbiAgICBzZXRJbnB1dHMobmV3SW5wdXRzKVxuICB9LCBbc2V0SW5wdXRzXSlcblxuICBjb25zdCBoYW5kbGVUb2dnbGVDb25kaXRpb25Mb2dpY2FsT3BlcmF0b3IgPSB1c2VDYWxsYmFjazxIYW5kbGVUb2dnbGVDb25kaXRpb25Mb2dpY2FsT3BlcmF0b3I+KCgpID0+IHtcbiAgICBjb25zdCBvbGRMb2dpY2FsT3BlcmF0b3IgPSBpbnB1dFJlZi5jdXJyZW50Lm1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zPy5sb2dpY2FsX29wZXJhdG9yXG4gICAgY29uc3QgbmV3TG9naWNhbE9wZXJhdG9yID0gb2xkTG9naWNhbE9wZXJhdG9yID09PSBMb2dpY2FsT3BlcmF0b3IuYW5kID8gTG9naWNhbE9wZXJhdG9yLm9yIDogTG9naWNhbE9wZXJhdG9yLmFuZFxuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5tZXRhZGF0YV9maWx0ZXJpbmdfY29uZGl0aW9ucyEubG9naWNhbF9vcGVyYXRvciA9IG5ld0xvZ2ljYWxPcGVyYXRvclxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW3NldElucHV0c10pXG5cbiAgY29uc3QgaGFuZGxlTWV0YWRhdGFNb2RlbENoYW5nZSA9IHVzZUNhbGxiYWNrKChtb2RlbDogeyBwcm92aWRlcjogc3RyaW5nLCBtb2RlbElkOiBzdHJpbmcsIG1vZGU/OiBzdHJpbmcgfSkgPT4ge1xuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoaW5wdXRSZWYuY3VycmVudCwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5tZXRhZGF0YV9tb2RlbF9jb25maWcgPSB7XG4gICAgICAgIHByb3ZpZGVyOiBtb2RlbC5wcm92aWRlcixcbiAgICAgICAgbmFtZTogbW9kZWwubW9kZWxJZCxcbiAgICAgICAgbW9kZTogbW9kZWwubW9kZSB8fCBBcHBNb2RlRW51bS5DSEFULFxuICAgICAgICBjb21wbGV0aW9uX3BhcmFtczogZHJhZnQubWV0YWRhdGFfbW9kZWxfY29uZmlnPy5jb21wbGV0aW9uX3BhcmFtcyB8fCB7IHRlbXBlcmF0dXJlOiAwLjcgfSxcbiAgICAgIH1cbiAgICB9KVxuICAgIHNldElucHV0cyhuZXdJbnB1dHMpXG4gIH0sIFtzZXRJbnB1dHNdKVxuXG4gIGNvbnN0IGhhbmRsZU1ldGFkYXRhQ29tcGxldGlvblBhcmFtc0NoYW5nZSA9IHVzZUNhbGxiYWNrKChuZXdQYXJhbXM6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGlucHV0UmVmLmN1cnJlbnQsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQubWV0YWRhdGFfbW9kZWxfY29uZmlnID0ge1xuICAgICAgICAuLi5kcmFmdC5tZXRhZGF0YV9tb2RlbF9jb25maWchLFxuICAgICAgICBjb21wbGV0aW9uX3BhcmFtczogbmV3UGFyYW1zLFxuICAgICAgfVxuICAgIH0pXG4gICAgc2V0SW5wdXRzKG5ld0lucHV0cylcbiAgfSwgW3NldElucHV0c10pXG5cbiAgY29uc3Qge1xuICAgIGF2YWlsYWJsZVZhcnM6IGF2YWlsYWJsZVN0cmluZ1ZhcnMsXG4gICAgYXZhaWxhYmxlTm9kZXNXaXRoUGFyZW50OiBhdmFpbGFibGVTdHJpbmdOb2Rlc1dpdGhQYXJlbnQsXG4gIH0gPSB1c2VBdmFpbGFibGVWYXJMaXN0KGlkLCB7XG4gICAgb25seUxlYWZOb2RlVmFyOiBmYWxzZSxcbiAgICBmaWx0ZXJWYXI6IGZpbHRlclN0cmluZ1ZhcixcbiAgfSlcblxuICBjb25zdCB7XG4gICAgYXZhaWxhYmxlVmFyczogYXZhaWxhYmxlTnVtYmVyVmFycyxcbiAgICBhdmFpbGFibGVOb2Rlc1dpdGhQYXJlbnQ6IGF2YWlsYWJsZU51bWJlck5vZGVzV2l0aFBhcmVudCxcbiAgfSA9IHVzZUF2YWlsYWJsZVZhckxpc3QoaWQsIHtcbiAgICBvbmx5TGVhZk5vZGVWYXI6IGZhbHNlLFxuICAgIGZpbHRlclZhcjogZmlsdGVyTnVtYmVyVmFyLFxuICB9KVxuXG4gIGNvbnN0IHNob3dJbWFnZVF1ZXJ5VmFyU2VsZWN0b3IgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gc2VsZWN0ZWREYXRhc2V0cy5zb21lKGQgPT4gZC5pc19tdWx0aW1vZGFsKVxuICB9LCBbc2VsZWN0ZWREYXRhc2V0c10pXG5cbiAgcmV0dXJuIHtcbiAgICByZWFkT25seSxcbiAgICBpbnB1dHMsXG4gICAgaGFuZGxlUXVlcnlWYXJDaGFuZ2UsXG4gICAgaGFuZGxlUXVlcnlBdHRhY2htZW50Q2hhbmdlLFxuICAgIGZpbHRlclN0cmluZ1ZhcixcbiAgICBmaWx0ZXJGaWxlVmFyLFxuICAgIGhhbmRsZVJldHJpZXZhbE1vZGVDaGFuZ2UsXG4gICAgaGFuZGxlTXVsdGlwbGVSZXRyaWV2YWxDb25maWdDaGFuZ2UsXG4gICAgaGFuZGxlTW9kZWxDaGFuZ2VkLFxuICAgIGhhbmRsZUNvbXBsZXRpb25QYXJhbXNDaGFuZ2UsXG4gICAgc2VsZWN0ZWREYXRhc2V0czogc2VsZWN0ZWREYXRhc2V0cy5maWx0ZXIoZCA9PiBkLm5hbWUpLFxuICAgIHNlbGVjdGVkRGF0YXNldHNMb2FkZWQsXG4gICAgaGFuZGxlT25EYXRhc2V0c0NoYW5nZSxcbiAgICByZXJhbmtNb2RlbE9wZW4sXG4gICAgc2V0UmVyYW5rTW9kZWxPcGVuLFxuICAgIGhhbmRsZU1ldGFkYXRhRmlsdGVyTW9kZUNoYW5nZSxcbiAgICBoYW5kbGVVcGRhdGVDb25kaXRpb24sXG4gICAgaGFuZGxlQWRkQ29uZGl0aW9uLFxuICAgIGhhbmRsZVJlbW92ZUNvbmRpdGlvbixcbiAgICBoYW5kbGVUb2dnbGVDb25kaXRpb25Mb2dpY2FsT3BlcmF0b3IsXG4gICAgaGFuZGxlTWV0YWRhdGFNb2RlbENoYW5nZSxcbiAgICBoYW5kbGVNZXRhZGF0YUNvbXBsZXRpb25QYXJhbXNDaGFuZ2UsXG4gICAgYXZhaWxhYmxlU3RyaW5nVmFycyxcbiAgICBhdmFpbGFibGVTdHJpbmdOb2Rlc1dpdGhQYXJlbnQsXG4gICAgYXZhaWxhYmxlTnVtYmVyVmFycyxcbiAgICBhdmFpbGFibGVOdW1iZXJOb2Rlc1dpdGhQYXJlbnQsXG4gICAgc2hvd0ltYWdlUXVlcnlWYXJTZWxlY3RvcixcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VDb25maWdcbiJdfQ==