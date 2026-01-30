"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const compat_1 = require("es-toolkit/compat");
const immer_1 = require("immer");
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const uuid_1 = require("uuid");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const metadata_filter_1 = require("@/app/components/workflow/nodes/knowledge-retrieval/components/metadata/metadata-filter");
const types_1 = require("@/app/components/workflow/nodes/knowledge-retrieval/types");
const utils_1 = require("@/app/components/workflow/nodes/knowledge-retrieval/utils");
const app_context_1 = require("@/context/app-context");
const debug_configuration_1 = require("@/context/debug-configuration");
const app_1 = require("@/types/app");
const permission_1 = require("@/utils/permission");
const feature_panel_1 = require("../base/feature-panel");
const operation_btn_1 = require("../base/operation-btn");
const hooks_2 = require("../debug/hooks");
const card_item_1 = require("./card-item");
const context_var_1 = require("./context-var");
const params_config_1 = require("./params-config");
const DatasetConfig = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const userProfile = (0, app_context_1.useSelector)(s => s.userProfile);
    const { mode, dataSets: dataSet, setDataSets: setDataSet, modelConfig, setModelConfig, showSelectDataSet, isAgent, datasetConfigs, datasetConfigsRef, setDatasetConfigs, setRerankSettingModalOpen, } = (0, use_context_selector_1.useContext)(debug_configuration_1.default);
    const formattingChangedDispatcher = (0, hooks_2.useFormattingChangedDispatcher)();
    const hasData = dataSet.length > 0;
    const { currentModel: currentRerankModel, currentProvider: currentRerankProvider, } = (0, hooks_1.useModelListAndDefaultModelAndCurrentProviderAndModel)(declarations_1.ModelTypeEnum.rerank);
    const onRemove = (id) => {
        const filteredDataSets = dataSet.filter(item => item.id !== id);
        setDataSet(filteredDataSets);
        const { datasets, retrieval_model, score_threshold_enabled, ...restConfigs } = datasetConfigs;
        const { top_k, score_threshold, reranking_model, reranking_mode, weights, reranking_enable, } = restConfigs;
        const oldRetrievalConfig = {
            top_k,
            score_threshold,
            reranking_model: (reranking_model && reranking_model.reranking_provider_name && reranking_model.reranking_model_name)
                ? {
                    provider: reranking_model.reranking_provider_name,
                    model: reranking_model.reranking_model_name,
                }
                : undefined,
            reranking_mode,
            weights,
            reranking_enable,
        };
        const retrievalConfig = (0, utils_1.getMultipleRetrievalConfig)(oldRetrievalConfig, filteredDataSets, dataSet, {
            provider: currentRerankProvider?.provider,
            model: currentRerankModel?.model,
        });
        setDatasetConfigs({
            ...datasetConfigsRef.current,
            ...retrievalConfig,
            reranking_model: {
                reranking_provider_name: retrievalConfig?.reranking_model?.provider || '',
                reranking_model_name: retrievalConfig?.reranking_model?.model || '',
            },
            retrieval_model,
            score_threshold_enabled,
            datasets,
        });
        const { allExternal, allInternal, mixtureInternalAndExternal, mixtureHighQualityAndEconomic, inconsistentEmbeddingModel, } = (0, utils_1.getSelectedDatasetsMode)(filteredDataSets);
        if ((allInternal && (mixtureHighQualityAndEconomic || inconsistentEmbeddingModel))
            || mixtureInternalAndExternal
            || allExternal) {
            setRerankSettingModalOpen(true);
        }
        formattingChangedDispatcher();
    };
    const handleSave = (newDataset) => {
        const index = dataSet.findIndex(item => item.id === newDataset.id);
        const newDatasets = [...dataSet.slice(0, index), newDataset, ...dataSet.slice(index + 1)];
        setDataSet(newDatasets);
        formattingChangedDispatcher();
    };
    const promptVariables = modelConfig.configs.prompt_variables;
    const promptVariablesToSelect = promptVariables.map(item => ({
        name: item.name,
        type: item.type,
        value: item.key,
    }));
    const selectedContextVar = promptVariables?.find(item => item.is_context_var);
    const handleSelectContextVar = (selectedValue) => {
        const newModelConfig = (0, immer_1.produce)(modelConfig, (draft) => {
            draft.configs.prompt_variables = modelConfig.configs.prompt_variables.map((item) => {
                return ({
                    ...item,
                    is_context_var: item.key === selectedValue,
                });
            });
        });
        setModelConfig(newModelConfig);
    };
    const formattedDataset = (0, react_1.useMemo)(() => {
        return dataSet.map((item) => {
            const datasetConfig = {
                createdBy: item.created_by,
                partialMemberList: item.partial_member_list || [],
                permission: item.permission,
            };
            return {
                ...item,
                editable: (0, permission_1.hasEditPermissionForDataset)(userProfile?.id || '', datasetConfig),
            };
        });
    }, [dataSet, userProfile?.id]);
    const metadataList = (0, react_1.useMemo)(() => {
        return (0, compat_1.intersectionBy)(...formattedDataset.filter((dataset) => {
            return !!dataset.doc_metadata;
        }).map((dataset) => {
            return dataset.doc_metadata;
        }), 'name');
    }, [formattedDataset]);
    const handleMetadataFilterModeChange = (0, react_1.useCallback)((newMode) => {
        setDatasetConfigs((0, immer_1.produce)(datasetConfigsRef.current, (draft) => {
            draft.metadata_filtering_mode = newMode;
        }));
    }, [setDatasetConfigs, datasetConfigsRef]);
    const handleAddCondition = (0, react_1.useCallback)(({ id, name, type }) => {
        let operator = types_1.ComparisonOperator.is;
        if (type === types_1.MetadataFilteringVariableType.number)
            operator = types_1.ComparisonOperator.equal;
        const newCondition = {
            id: (0, uuid_1.v4)(),
            metadata_id: id, // Save metadata.id for reliable reference
            name,
            comparison_operator: operator,
        };
        const newInputs = (0, immer_1.produce)(datasetConfigsRef.current, (draft) => {
            if (draft.metadata_filtering_conditions) {
                draft.metadata_filtering_conditions.conditions.push(newCondition);
            }
            else {
                draft.metadata_filtering_conditions = {
                    logical_operator: types_1.LogicalOperator.and,
                    conditions: [newCondition],
                };
            }
        });
        setDatasetConfigs(newInputs);
    }, [setDatasetConfigs, datasetConfigsRef]);
    const handleRemoveCondition = (0, react_1.useCallback)((id) => {
        const conditions = datasetConfigsRef.current.metadata_filtering_conditions?.conditions || [];
        const index = conditions.findIndex(c => c.id === id);
        const newInputs = (0, immer_1.produce)(datasetConfigsRef.current, (draft) => {
            if (index > -1)
                draft.metadata_filtering_conditions?.conditions.splice(index, 1);
        });
        setDatasetConfigs(newInputs);
    }, [setDatasetConfigs, datasetConfigsRef]);
    const handleUpdateCondition = (0, react_1.useCallback)((id, newCondition) => {
        const conditions = datasetConfigsRef.current.metadata_filtering_conditions?.conditions || [];
        const index = conditions.findIndex(c => c.id === id);
        const newInputs = (0, immer_1.produce)(datasetConfigsRef.current, (draft) => {
            if (index > -1)
                draft.metadata_filtering_conditions.conditions[index] = newCondition;
        });
        setDatasetConfigs(newInputs);
    }, [setDatasetConfigs, datasetConfigsRef]);
    const handleToggleConditionLogicalOperator = (0, react_1.useCallback)(() => {
        const oldLogicalOperator = datasetConfigsRef.current.metadata_filtering_conditions?.logical_operator;
        const newLogicalOperator = oldLogicalOperator === types_1.LogicalOperator.and ? types_1.LogicalOperator.or : types_1.LogicalOperator.and;
        const newInputs = (0, immer_1.produce)(datasetConfigsRef.current, (draft) => {
            draft.metadata_filtering_conditions.logical_operator = newLogicalOperator;
        });
        setDatasetConfigs(newInputs);
    }, [setDatasetConfigs, datasetConfigsRef]);
    const handleMetadataModelChange = (0, react_1.useCallback)((model) => {
        const newInputs = (0, immer_1.produce)(datasetConfigsRef.current, (draft) => {
            draft.metadata_model_config = {
                provider: model.provider,
                name: model.modelId,
                mode: model.mode || app_1.AppModeEnum.CHAT,
                completion_params: draft.metadata_model_config?.completion_params || { temperature: 0.7 },
            };
        });
        setDatasetConfigs(newInputs);
    }, [setDatasetConfigs, datasetConfigsRef]);
    const handleMetadataCompletionParamsChange = (0, react_1.useCallback)((newParams) => {
        const newInputs = (0, immer_1.produce)(datasetConfigsRef.current, (draft) => {
            draft.metadata_model_config = {
                ...draft.metadata_model_config,
                completion_params: newParams,
            };
        });
        setDatasetConfigs(newInputs);
    }, [setDatasetConfigs, datasetConfigsRef]);
    return (<feature_panel_1.default className="mt-2" title={t('feature.dataSet.title', { ns: 'appDebug' })} headerRight={(<div className="flex items-center gap-1">
          {!isAgent && <params_config_1.default disabled={!hasData} selectedDatasets={dataSet}/>}
          <operation_btn_1.default type="add" onClick={showSelectDataSet}/>
        </div>)} hasHeaderBottomBorder={!hasData} noBodySpacing>
      {hasData
            ? (<div className="mt-1 flex flex-wrap justify-between px-3 pb-3">
              {formattedDataset.map(item => (<card_item_1.default key={item.id} config={item} onRemove={onRemove} onSave={handleSave} editable={item.editable}/>))}
            </div>)
            : (<div className="mt-1 px-3 pb-3">
              <div className="pb-1 pt-2 text-xs text-text-tertiary">{t('feature.dataSet.noData', { ns: 'appDebug' })}</div>
            </div>)}

      <div className="border-t border-t-divider-subtle py-2">
        <metadata_filter_1.default metadataList={metadataList} selectedDatasetsLoaded metadataFilterMode={datasetConfigs.metadata_filtering_mode} metadataFilteringConditions={datasetConfigs.metadata_filtering_conditions} handleAddCondition={handleAddCondition} handleMetadataFilterModeChange={handleMetadataFilterModeChange} handleRemoveCondition={handleRemoveCondition} handleToggleConditionLogicalOperator={handleToggleConditionLogicalOperator} handleUpdateCondition={handleUpdateCondition} metadataModelConfig={datasetConfigs.metadata_model_config} handleMetadataModelChange={handleMetadataModelChange} handleMetadataCompletionParamsChange={handleMetadataCompletionParamsChange} isCommonVariable availableCommonStringVars={promptVariablesToSelect.filter(item => item.type === types_1.MetadataFilteringVariableType.string || item.type === types_1.MetadataFilteringVariableType.select)} availableCommonNumberVars={promptVariablesToSelect.filter(item => item.type === types_1.MetadataFilteringVariableType.number)}/>
      </div>

      {mode === app_1.AppModeEnum.COMPLETION && dataSet.length > 0 && (<context_var_1.default value={selectedContextVar?.key} options={promptVariablesToSelect} onChange={handleSelectContextVar}/>)}
    </feature_panel_1.default>);
};
exports.default = React.memo(DatasetConfig);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFVWiw4Q0FBa0Q7QUFDbEQsaUNBQStCO0FBQy9CLCtCQUE4QjtBQUM5QixpQ0FBNEM7QUFDNUMsaURBQThDO0FBQzlDLCtEQUFpRDtBQUNqRCwrQkFBa0M7QUFDbEMsMkdBQXdHO0FBQ3hHLDZGQUF5STtBQUN6SSw2SEFBb0g7QUFDcEgscUZBSWtFO0FBQ2xFLHFGQUdrRTtBQUNsRSx1REFBNEU7QUFDNUUsdUVBQXlEO0FBQ3pELHFDQUF5QztBQUN6QyxtREFBZ0U7QUFDaEUseURBQWdEO0FBQ2hELHlEQUFnRDtBQUNoRCwwQ0FBK0Q7QUFDL0QsMkNBQWtDO0FBQ2xDLCtDQUFzQztBQUN0QyxtREFBMEM7QUFFMUMsTUFBTSxhQUFhLEdBQU8sR0FBRyxFQUFFO0lBQzdCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLFdBQVcsR0FBRyxJQUFBLHlCQUFxQixFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzdELE1BQU0sRUFDSixJQUFJLEVBQ0osUUFBUSxFQUFFLE9BQU8sRUFDakIsV0FBVyxFQUFFLFVBQVUsRUFDdkIsV0FBVyxFQUNYLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsT0FBTyxFQUNQLGNBQWMsRUFDZCxpQkFBaUIsRUFDakIsaUJBQWlCLEVBQ2pCLHlCQUF5QixHQUMxQixHQUFHLElBQUEsaUNBQVUsRUFBQyw2QkFBYSxDQUFDLENBQUE7SUFDN0IsTUFBTSwyQkFBMkIsR0FBRyxJQUFBLHNDQUE4QixHQUFFLENBQUE7SUFFcEUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7SUFFbEMsTUFBTSxFQUNKLFlBQVksRUFBRSxrQkFBa0IsRUFDaEMsZUFBZSxF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QUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUsscUNBQTZCLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUsscUNBQTZCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDNUsseUJBQXlCLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLHFDQUE2QixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBRTFIO01BQUEsRUFBRSxHQUFHLENBRUw7O01BQUEsQ0FBQyxJQUFJLEtBQUssaUJBQVcsQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FDeEQsQ0FBQyxxQkFBVSxDQUNULEtBQUssQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxDQUMvQixPQUFPLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUNqQyxRQUFRLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUNqQyxDQUNILENBQ0g7SUFBQSxFQUFFLHVCQUFZLENBQUMsQ0FDaEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUNELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHtcbiAgSGFuZGxlQWRkQ29uZGl0aW9uLFxuICBIYW5kbGVSZW1vdmVDb25kaXRpb24sXG4gIEhhbmRsZVRvZ2dsZUNvbmRpdGlvbkxvZ2ljYWxPcGVyYXRvcixcbiAgSGFuZGxlVXBkYXRlQ29uZGl0aW9uLFxuICBNZXRhZGF0YUZpbHRlcmluZ01vZGVFbnVtLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IERhdGFTZXQgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IGludGVyc2VjdGlvbkJ5IH0gZnJvbSAnZXMtdG9vbGtpdC9jb21wYXQnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VDb250ZXh0IH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG5pbXBvcnQgeyB2NCBhcyB1dWlkNCB9IGZyb20gJ3V1aWQnXG5pbXBvcnQgeyBNb2RlbFR5cGVFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHsgdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcydcbmltcG9ydCBNZXRhZGF0YUZpbHRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvY29tcG9uZW50cy9tZXRhZGF0YS9tZXRhZGF0YS1maWx0ZXInXG5pbXBvcnQge1xuICBDb21wYXJpc29uT3BlcmF0b3IsXG4gIExvZ2ljYWxPcGVyYXRvcixcbiAgTWV0YWRhdGFGaWx0ZXJpbmdWYXJpYWJsZVR5cGUsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMva25vd2xlZGdlLXJldHJpZXZhbC90eXBlcydcbmltcG9ydCB7XG4gIGdldE11bHRpcGxlUmV0cmlldmFsQ29uZmlnLFxuICBnZXRTZWxlY3RlZERhdGFzZXRzTW9kZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9rbm93bGVkZ2UtcmV0cmlldmFsL3V0aWxzJ1xuaW1wb3J0IHsgdXNlU2VsZWN0b3IgYXMgdXNlQXBwQ29udGV4dFNlbGVjdG9yIH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IENvbmZpZ0NvbnRleHQgZnJvbSAnQC9jb250ZXh0L2RlYnVnLWNvbmZpZ3VyYXRpb24nXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0IH0gZnJvbSAnQC91dGlscy9wZXJtaXNzaW9uJ1xuaW1wb3J0IEZlYXR1cmVQYW5lbCBmcm9tICcuLi9iYXNlL2ZlYXR1cmUtcGFuZWwnXG5pbXBvcnQgT3BlcmF0aW9uQnRuIGZyb20gJy4uL2Jhc2Uvb3BlcmF0aW9uLWJ0bidcbmltcG9ydCB7IHVzZUZvcm1hdHRpbmdDaGFuZ2VkRGlzcGF0Y2hlciB9IGZyb20gJy4uL2RlYnVnL2hvb2tzJ1xuaW1wb3J0IENhcmRJdGVtIGZyb20gJy4vY2FyZC1pdGVtJ1xuaW1wb3J0IENvbnRleHRWYXIgZnJvbSAnLi9jb250ZXh0LXZhcidcbmltcG9ydCBQYXJhbXNDb25maWcgZnJvbSAnLi9wYXJhbXMtY29uZmlnJ1xuXG5jb25zdCBEYXRhc2V0Q29uZmlnOiBGQyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHVzZXJQcm9maWxlID0gdXNlQXBwQ29udGV4dFNlbGVjdG9yKHMgPT4gcy51c2VyUHJvZmlsZSlcbiAgY29uc3Qge1xuICAgIG1vZGUsXG4gICAgZGF0YVNldHM6IGRhdGFTZXQsXG4gICAgc2V0RGF0YVNldHM6IHNldERhdGFTZXQsXG4gICAgbW9kZWxDb25maWcsXG4gICAgc2V0TW9kZWxDb25maWcsXG4gICAgc2hvd1NlbGVjdERhdGFTZXQsXG4gICAgaXNBZ2VudCxcbiAgICBkYXRhc2V0Q29uZmlncyxcbiAgICBkYXRhc2V0Q29uZmlnc1JlZixcbiAgICBzZXREYXRhc2V0Q29uZmlncyxcbiAgICBzZXRSZXJhbmtTZXR0aW5nTW9kYWxPcGVuLFxuICB9ID0gdXNlQ29udGV4dChDb25maWdDb250ZXh0KVxuICBjb25zdCBmb3JtYXR0aW5nQ2hhbmdlZERpc3BhdGNoZXIgPSB1c2VGb3JtYXR0aW5nQ2hhbmdlZERpc3BhdGNoZXIoKVxuXG4gIGNvbnN0IGhhc0RhdGEgPSBkYXRhU2V0Lmxlbmd0aCA+IDBcblxuICBjb25zdCB7XG4gICAgY3VycmVudE1vZGVsOiBjdXJyZW50UmVyYW5rTW9kZWwsXG4gICAgY3VycmVudFByb3ZpZGVyOiBjdXJyZW50UmVyYW5rUHJvdmlkZXIsXG4gIH0gPSB1c2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWxBbmRDdXJyZW50UHJvdmlkZXJBbmRNb2RlbChNb2RlbFR5cGVFbnVtLnJlcmFuaylcblxuICBjb25zdCBvblJlbW92ZSA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZmlsdGVyZWREYXRhU2V0cyA9IGRhdGFTZXQuZmlsdGVyKGl0ZW0gPT4gaXRlbS5pZCAhPT0gaWQpXG4gICAgc2V0RGF0YVNldChmaWx0ZXJlZERhdGFTZXRzKVxuICAgIGNvbnN0IHsgZGF0YXNldHMsIHJldHJpZXZhbF9tb2RlbCwgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQsIC4uLnJlc3RDb25maWdzIH0gPSBkYXRhc2V0Q29uZmlnc1xuICAgIGNvbnN0IHtcbiAgICAgIHRvcF9rLFxuICAgICAgc2NvcmVfdGhyZXNob2xkLFxuICAgICAgcmVyYW5raW5nX21vZGVsLFxuICAgICAgcmVyYW5raW5nX21vZGUsXG4gICAgICB3ZWlnaHRzLFxuICAgICAgcmVyYW5raW5nX2VuYWJsZSxcbiAgICB9ID0gcmVzdENvbmZpZ3NcbiAgICBjb25zdCBvbGRSZXRyaWV2YWxDb25maWcgPSB7XG4gICAgICB0b3BfayxcbiAgICAgIHNjb3JlX3RocmVzaG9sZCxcbiAgICAgIHJlcmFua2luZ19tb2RlbDogKHJlcmFua2luZ19tb2RlbCAmJiByZXJhbmtpbmdfbW9kZWwucmVyYW5raW5nX3Byb3ZpZGVyX25hbWUgJiYgcmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19tb2RlbF9uYW1lKVxuICAgICAgICA/IHtcbiAgICAgICAgICAgIHByb3ZpZGVyOiByZXJhbmtpbmdfbW9kZWwucmVyYW5raW5nX3Byb3ZpZGVyX25hbWUsXG4gICAgICAgICAgICBtb2RlbDogcmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19tb2RlbF9uYW1lLFxuICAgICAgICAgIH1cbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICByZXJhbmtpbmdfbW9kZSxcbiAgICAgIHdlaWdodHMsXG4gICAgICByZXJhbmtpbmdfZW5hYmxlLFxuICAgIH1cbiAgICBjb25zdCByZXRyaWV2YWxDb25maWcgPSBnZXRNdWx0aXBsZVJldHJpZXZhbENvbmZpZyhvbGRSZXRyaWV2YWxDb25maWcsIGZpbHRlcmVkRGF0YVNldHMsIGRhdGFTZXQsIHtcbiAgICAgIHByb3ZpZGVyOiBjdXJyZW50UmVyYW5rUHJvdmlkZXI/LnByb3ZpZGVyLFxuICAgICAgbW9kZWw6IGN1cnJlbnRSZXJhbmtNb2RlbD8ubW9kZWwsXG4gICAgfSlcbiAgICBzZXREYXRhc2V0Q29uZmlncyh7XG4gICAgICAuLi5kYXRhc2V0Q29uZmlnc1JlZi5jdXJyZW50LFxuICAgICAgLi4ucmV0cmlldmFsQ29uZmlnLFxuICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiByZXRyaWV2YWxDb25maWc/LnJlcmFua2luZ19tb2RlbD8ucHJvdmlkZXIgfHwgJycsXG4gICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiByZXRyaWV2YWxDb25maWc/LnJlcmFua2luZ19tb2RlbD8ubW9kZWwgfHwgJycsXG4gICAgICB9LFxuICAgICAgcmV0cmlldmFsX21vZGVsLFxuICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQsXG4gICAgICBkYXRhc2V0cyxcbiAgICB9KVxuICAgIGNvbnN0IHtcbiAgICAgIGFsbEV4dGVybmFsLFxuICAgICAgYWxsSW50ZXJuYWwsXG4gICAgICBtaXh0dXJlSW50ZXJuYWxBbmRFeHRlcm5hbCxcbiAgICAgIG1peHR1cmVIaWdoUXVhbGl0eUFuZEVjb25vbWljLFxuICAgICAgaW5jb25zaXN0ZW50RW1iZWRkaW5nTW9kZWwsXG4gICAgfSA9IGdldFNlbGVjdGVkRGF0YXNldHNNb2RlKGZpbHRlcmVkRGF0YVNldHMpXG5cbiAgICBpZiAoXG4gICAgICAoYWxsSW50ZXJuYWwgJiYgKG1peHR1cmVIaWdoUXVhbGl0eUFuZEVjb25vbWljIHx8IGluY29uc2lzdGVudEVtYmVkZGluZ01vZGVsKSlcbiAgICAgIHx8IG1peHR1cmVJbnRlcm5hbEFuZEV4dGVybmFsXG4gICAgICB8fCBhbGxFeHRlcm5hbFxuICAgICkge1xuICAgICAgc2V0UmVyYW5rU2V0dGluZ01vZGFsT3Blbih0cnVlKVxuICAgIH1cbiAgICBmb3JtYXR0aW5nQ2hhbmdlZERpc3BhdGNoZXIoKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU2F2ZSA9IChuZXdEYXRhc2V0OiBEYXRhU2V0KSA9PiB7XG4gICAgY29uc3QgaW5kZXggPSBkYXRhU2V0LmZpbmRJbmRleChpdGVtID0+IGl0ZW0uaWQgPT09IG5ld0RhdGFzZXQuaWQpXG5cbiAgICBjb25zdCBuZXdEYXRhc2V0cyA9IFsuLi5kYXRhU2V0LnNsaWNlKDAsIGluZGV4KSwgbmV3RGF0YXNldCwgLi4uZGF0YVNldC5zbGljZShpbmRleCArIDEpXVxuICAgIHNldERhdGFTZXQobmV3RGF0YXNldHMpXG4gICAgZm9ybWF0dGluZ0NoYW5nZWREaXNwYXRjaGVyKClcbiAgfVxuXG4gIGNvbnN0IHByb21wdFZhcmlhYmxlcyA9IG1vZGVsQ29uZmlnLmNvbmZpZ3MucHJvbXB0X3ZhcmlhYmxlc1xuICBjb25zdCBwcm9tcHRWYXJpYWJsZXNUb1NlbGVjdCA9IHByb21wdFZhcmlhYmxlcy5tYXAoaXRlbSA9PiAoe1xuICAgIG5hbWU6IGl0ZW0ubmFtZSxcbiAgICB0eXBlOiBpdGVtLnR5cGUsXG4gICAgdmFsdWU6IGl0ZW0ua2V5LFxuICB9KSlcbiAgY29uc3Qgc2VsZWN0ZWRDb250ZXh0VmFyID0gcHJvbXB0VmFyaWFibGVzPy5maW5kKGl0ZW0gPT4gaXRlbS5pc19jb250ZXh0X3ZhcilcbiAgY29uc3QgaGFuZGxlU2VsZWN0Q29udGV4dFZhciA9IChzZWxlY3RlZFZhbHVlOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBuZXdNb2RlbENvbmZpZyA9IHByb2R1Y2UobW9kZWxDb25maWcsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQuY29uZmlncy5wcm9tcHRfdmFyaWFibGVzID0gbW9kZWxDb25maWcuY29uZmlncy5wcm9tcHRfdmFyaWFibGVzLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAuLi5pdGVtLFxuICAgICAgICAgIGlzX2NvbnRleHRfdmFyOiBpdGVtLmtleSA9PT0gc2VsZWN0ZWRWYWx1ZSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICBzZXRNb2RlbENvbmZpZyhuZXdNb2RlbENvbmZpZylcbiAgfVxuXG4gIGNvbnN0IGZvcm1hdHRlZERhdGFzZXQgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gZGF0YVNldC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGRhdGFzZXRDb25maWcgPSB7XG4gICAgICAgIGNyZWF0ZWRCeTogaXRlbS5jcmVhdGVkX2J5LFxuICAgICAgICBwYXJ0aWFsTWVtYmVyTGlzdDogaXRlbS5wYXJ0aWFsX21lbWJlcl9saXN0IHx8IFtdLFxuICAgICAgICBwZXJtaXNzaW9uOiBpdGVtLnBlcm1pc3Npb24sXG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5pdGVtLFxuICAgICAgICBlZGl0YWJsZTogaGFzRWRpdFBlcm1pc3Npb25Gb3JEYXRhc2V0KHVzZXJQcm9maWxlPy5pZCB8fCAnJywgZGF0YXNldENvbmZpZyksXG4gICAgICB9XG4gICAgfSlcbiAgfSwgW2RhdGFTZXQsIHVzZXJQcm9maWxlPy5pZF0pXG5cbiAgY29uc3QgbWV0YWRhdGFMaXN0ID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbkJ5KC4uLmZvcm1hdHRlZERhdGFzZXQuZmlsdGVyKChkYXRhc2V0KSA9PiB7XG4gICAgICByZXR1cm4gISFkYXRhc2V0LmRvY19tZXRhZGF0YVxuICAgIH0pLm1hcCgoZGF0YXNldCkgPT4ge1xuICAgICAgcmV0dXJuIGRhdGFzZXQuZG9jX21ldGFkYXRhIVxuICAgIH0pLCAnbmFtZScpXG4gIH0sIFtmb3JtYXR0ZWREYXRhc2V0XSlcblxuICBjb25zdCBoYW5kbGVNZXRhZGF0YUZpbHRlck1vZGVDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3TW9kZTogTWV0YWRhdGFGaWx0ZXJpbmdNb2RlRW51bSkgPT4ge1xuICAgIHNldERhdGFzZXRDb25maWdzKHByb2R1Y2UoZGF0YXNldENvbmZpZ3NSZWYuY3VycmVudCEsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQubWV0YWRhdGFfZmlsdGVyaW5nX21vZGUgPSBuZXdNb2RlXG4gICAgfSkpXG4gIH0sIFtzZXREYXRhc2V0Q29uZmlncywgZGF0YXNldENvbmZpZ3NSZWZdKVxuXG4gIGNvbnN0IGhhbmRsZUFkZENvbmRpdGlvbiA9IHVzZUNhbGxiYWNrPEhhbmRsZUFkZENvbmRpdGlvbj4oKHsgaWQsIG5hbWUsIHR5cGUgfSkgPT4ge1xuICAgIGxldCBvcGVyYXRvcjogQ29tcGFyaXNvbk9wZXJhdG9yID0gQ29tcGFyaXNvbk9wZXJhdG9yLmlzXG5cbiAgICBpZiAodHlwZSA9PT0gTWV0YWRhdGFGaWx0ZXJpbmdWYXJpYWJsZVR5cGUubnVtYmVyKVxuICAgICAgb3BlcmF0b3IgPSBDb21wYXJpc29uT3BlcmF0b3IuZXF1YWxcblxuICAgIGNvbnN0IG5ld0NvbmRpdGlvbiA9IHtcbiAgICAgIGlkOiB1dWlkNCgpLFxuICAgICAgbWV0YWRhdGFfaWQ6IGlkLCAvLyBTYXZlIG1ldGFkYXRhLmlkIGZvciByZWxpYWJsZSByZWZlcmVuY2VcbiAgICAgIG5hbWUsXG4gICAgICBjb21wYXJpc29uX29wZXJhdG9yOiBvcGVyYXRvcixcbiAgICB9XG5cbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGRhdGFzZXRDb25maWdzUmVmLmN1cnJlbnQhLCAoZHJhZnQpID0+IHtcbiAgICAgIGlmIChkcmFmdC5tZXRhZGF0YV9maWx0ZXJpbmdfY29uZGl0aW9ucykge1xuICAgICAgICBkcmFmdC5tZXRhZGF0YV9maWx0ZXJpbmdfY29uZGl0aW9ucy5jb25kaXRpb25zLnB1c2gobmV3Q29uZGl0aW9uKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRyYWZ0Lm1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zID0ge1xuICAgICAgICAgIGxvZ2ljYWxfb3BlcmF0b3I6IExvZ2ljYWxPcGVyYXRvci5hbmQsXG4gICAgICAgICAgY29uZGl0aW9uczogW25ld0NvbmRpdGlvbl0sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIHNldERhdGFzZXRDb25maWdzKG5ld0lucHV0cylcbiAgfSwgW3NldERhdGFzZXRDb25maWdzLCBkYXRhc2V0Q29uZmlnc1JlZl0pXG5cbiAgY29uc3QgaGFuZGxlUmVtb3ZlQ29uZGl0aW9uID0gdXNlQ2FsbGJhY2s8SGFuZGxlUmVtb3ZlQ29uZGl0aW9uPigoaWQpID0+IHtcbiAgICBjb25zdCBjb25kaXRpb25zID0gZGF0YXNldENvbmZpZ3NSZWYuY3VycmVudCEubWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnM/LmNvbmRpdGlvbnMgfHwgW11cbiAgICBjb25zdCBpbmRleCA9IGNvbmRpdGlvbnMuZmluZEluZGV4KGMgPT4gYy5pZCA9PT0gaWQpXG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShkYXRhc2V0Q29uZmlnc1JlZi5jdXJyZW50ISwgKGRyYWZ0KSA9PiB7XG4gICAgICBpZiAoaW5kZXggPiAtMSlcbiAgICAgICAgZHJhZnQubWV0YWRhdGFfZmlsdGVyaW5nX2NvbmRpdGlvbnM/LmNvbmRpdGlvbnMuc3BsaWNlKGluZGV4LCAxKVxuICAgIH0pXG4gICAgc2V0RGF0YXNldENvbmZpZ3MobmV3SW5wdXRzKVxuICB9LCBbc2V0RGF0YXNldENvbmZpZ3MsIGRhdGFzZXRDb25maWdzUmVmXSlcblxuICBjb25zdCBoYW5kbGVVcGRhdGVDb25kaXRpb24gPSB1c2VDYWxsYmFjazxIYW5kbGVVcGRhdGVDb25kaXRpb24+KChpZCwgbmV3Q29uZGl0aW9uKSA9PiB7XG4gICAgY29uc3QgY29uZGl0aW9ucyA9IGRhdGFzZXRDb25maWdzUmVmLmN1cnJlbnQhLm1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zPy5jb25kaXRpb25zIHx8IFtdXG4gICAgY29uc3QgaW5kZXggPSBjb25kaXRpb25zLmZpbmRJbmRleChjID0+IGMuaWQgPT09IGlkKVxuICAgIGNvbnN0IG5ld0lucHV0cyA9IHByb2R1Y2UoZGF0YXNldENvbmZpZ3NSZWYuY3VycmVudCEsIChkcmFmdCkgPT4ge1xuICAgICAgaWYgKGluZGV4ID4gLTEpXG4gICAgICAgIGRyYWZ0Lm1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zIS5jb25kaXRpb25zW2luZGV4XSA9IG5ld0NvbmRpdGlvblxuICAgIH0pXG4gICAgc2V0RGF0YXNldENvbmZpZ3MobmV3SW5wdXRzKVxuICB9LCBbc2V0RGF0YXNldENvbmZpZ3MsIGRhdGFzZXRDb25maWdzUmVmXSlcblxuICBjb25zdCBoYW5kbGVUb2dnbGVDb25kaXRpb25Mb2dpY2FsT3BlcmF0b3IgPSB1c2VDYWxsYmFjazxIYW5kbGVUb2dnbGVDb25kaXRpb25Mb2dpY2FsT3BlcmF0b3I+KCgpID0+IHtcbiAgICBjb25zdCBvbGRMb2dpY2FsT3BlcmF0b3IgPSBkYXRhc2V0Q29uZmlnc1JlZi5jdXJyZW50IS5tZXRhZGF0YV9maWx0ZXJpbmdfY29uZGl0aW9ucz8ubG9naWNhbF9vcGVyYXRvclxuICAgIGNvbnN0IG5ld0xvZ2ljYWxPcGVyYXRvciA9IG9sZExvZ2ljYWxPcGVyYXRvciA9PT0gTG9naWNhbE9wZXJhdG9yLmFuZCA/IExvZ2ljYWxPcGVyYXRvci5vciA6IExvZ2ljYWxPcGVyYXRvci5hbmRcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGRhdGFzZXRDb25maWdzUmVmLmN1cnJlbnQhLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0Lm1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zIS5sb2dpY2FsX29wZXJhdG9yID0gbmV3TG9naWNhbE9wZXJhdG9yXG4gICAgfSlcbiAgICBzZXREYXRhc2V0Q29uZmlncyhuZXdJbnB1dHMpXG4gIH0sIFtzZXREYXRhc2V0Q29uZmlncywgZGF0YXNldENvbmZpZ3NSZWZdKVxuXG4gIGNvbnN0IGhhbmRsZU1ldGFkYXRhTW9kZWxDaGFuZ2UgPSB1c2VDYWxsYmFjaygobW9kZWw6IHsgcHJvdmlkZXI6IHN0cmluZywgbW9kZWxJZDogc3RyaW5nLCBtb2RlPzogc3RyaW5nIH0pID0+IHtcbiAgICBjb25zdCBuZXdJbnB1dHMgPSBwcm9kdWNlKGRhdGFzZXRDb25maWdzUmVmLmN1cnJlbnQhLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0Lm1ldGFkYXRhX21vZGVsX2NvbmZpZyA9IHtcbiAgICAgICAgcHJvdmlkZXI6IG1vZGVsLnByb3ZpZGVyLFxuICAgICAgICBuYW1lOiBtb2RlbC5tb2RlbElkLFxuICAgICAgICBtb2RlOiBtb2RlbC5tb2RlIHx8IEFwcE1vZGVFbnVtLkNIQVQsXG4gICAgICAgIGNvbXBsZXRpb25fcGFyYW1zOiBkcmFmdC5tZXRhZGF0YV9tb2RlbF9jb25maWc/LmNvbXBsZXRpb25fcGFyYW1zIHx8IHsgdGVtcGVyYXR1cmU6IDAuNyB9LFxuICAgICAgfVxuICAgIH0pXG4gICAgc2V0RGF0YXNldENvbmZpZ3MobmV3SW5wdXRzKVxuICB9LCBbc2V0RGF0YXNldENvbmZpZ3MsIGRhdGFzZXRDb25maWdzUmVmXSlcblxuICBjb25zdCBoYW5kbGVNZXRhZGF0YUNvbXBsZXRpb25QYXJhbXNDaGFuZ2UgPSB1c2VDYWxsYmFjaygobmV3UGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgY29uc3QgbmV3SW5wdXRzID0gcHJvZHVjZShkYXRhc2V0Q29uZmlnc1JlZi5jdXJyZW50ISwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5tZXRhZGF0YV9tb2RlbF9jb25maWcgPSB7XG4gICAgICAgIC4uLmRyYWZ0Lm1ldGFkYXRhX21vZGVsX2NvbmZpZyEsXG4gICAgICAgIGNvbXBsZXRpb25fcGFyYW1zOiBuZXdQYXJhbXMsXG4gICAgICB9XG4gICAgfSlcbiAgICBzZXREYXRhc2V0Q29uZmlncyhuZXdJbnB1dHMpXG4gIH0sIFtzZXREYXRhc2V0Q29uZmlncywgZGF0YXNldENvbmZpZ3NSZWZdKVxuXG4gIHJldHVybiAoXG4gICAgPEZlYXR1cmVQYW5lbFxuICAgICAgY2xhc3NOYW1lPVwibXQtMlwiXG4gICAgICB0aXRsZT17dCgnZmVhdHVyZS5kYXRhU2V0LnRpdGxlJywgeyBuczogJ2FwcERlYnVnJyB9KX1cbiAgICAgIGhlYWRlclJpZ2h0PXsoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTFcIj5cbiAgICAgICAgICB7IWlzQWdlbnQgJiYgPFBhcmFtc0NvbmZpZyBkaXNhYmxlZD17IWhhc0RhdGF9IHNlbGVjdGVkRGF0YXNldHM9e2RhdGFTZXR9IC8+fVxuICAgICAgICAgIDxPcGVyYXRpb25CdG4gdHlwZT1cImFkZFwiIG9uQ2xpY2s9e3Nob3dTZWxlY3REYXRhU2V0fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICBoYXNIZWFkZXJCb3R0b21Cb3JkZXI9eyFoYXNEYXRhfVxuICAgICAgbm9Cb2R5U3BhY2luZ1xuICAgID5cbiAgICAgIHtoYXNEYXRhXG4gICAgICAgID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIGZsZXggZmxleC13cmFwIGp1c3RpZnktYmV0d2VlbiBweC0zIHBiLTNcIj5cbiAgICAgICAgICAgICAge2Zvcm1hdHRlZERhdGFzZXQubWFwKGl0ZW0gPT4gKFxuICAgICAgICAgICAgICAgIDxDYXJkSXRlbVxuICAgICAgICAgICAgICAgICAga2V5PXtpdGVtLmlkfVxuICAgICAgICAgICAgICAgICAgY29uZmlnPXtpdGVtfVxuICAgICAgICAgICAgICAgICAgb25SZW1vdmU9e29uUmVtb3ZlfVxuICAgICAgICAgICAgICAgICAgb25TYXZlPXtoYW5kbGVTYXZlfVxuICAgICAgICAgICAgICAgICAgZWRpdGFibGU9e2l0ZW0uZWRpdGFibGV9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApXG4gICAgICAgIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xIHB4LTMgcGItM1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBiLTEgcHQtMiB0ZXh0LXhzIHRleHQtdGV4dC10ZXJ0aWFyeVwiPnt0KCdmZWF0dXJlLmRhdGFTZXQubm9EYXRhJywgeyBuczogJ2FwcERlYnVnJyB9KX08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLXQtZGl2aWRlci1zdWJ0bGUgcHktMlwiPlxuICAgICAgICA8TWV0YWRhdGFGaWx0ZXJcbiAgICAgICAgICBtZXRhZGF0YUxpc3Q9e21ldGFkYXRhTGlzdH1cbiAgICAgICAgICBzZWxlY3RlZERhdGFzZXRzTG9hZGVkXG4gICAgICAgICAgbWV0YWRhdGFGaWx0ZXJNb2RlPXtkYXRhc2V0Q29uZmlncy5tZXRhZGF0YV9maWx0ZXJpbmdfbW9kZX1cbiAgICAgICAgICBtZXRhZGF0YUZpbHRlcmluZ0NvbmRpdGlvbnM9e2RhdGFzZXRDb25maWdzLm1ldGFkYXRhX2ZpbHRlcmluZ19jb25kaXRpb25zfVxuICAgICAgICAgIGhhbmRsZUFkZENvbmRpdGlvbj17aGFuZGxlQWRkQ29uZGl0aW9ufVxuICAgICAgICAgIGhhbmRsZU1ldGFkYXRhRmlsdGVyTW9kZUNoYW5nZT17aGFuZGxlTWV0YWRhdGFGaWx0ZXJNb2RlQ2hhbmdlfVxuICAgICAgICAgIGhhbmRsZVJlbW92ZUNvbmRpdGlvbj17aGFuZGxlUmVtb3ZlQ29uZGl0aW9ufVxuICAgICAgICAgIGhhbmRsZVRvZ2dsZUNvbmRpdGlvbkxvZ2ljYWxPcGVyYXRvcj17aGFuZGxlVG9nZ2xlQ29uZGl0aW9uTG9naWNhbE9wZXJhdG9yfVxuICAgICAgICAgIGhhbmRsZVVwZGF0ZUNvbmRpdGlvbj17aGFuZGxlVXBkYXRlQ29uZGl0aW9ufVxuICAgICAgICAgIG1ldGFkYXRhTW9kZWxDb25maWc9e2RhdGFzZXRDb25maWdzLm1ldGFkYXRhX21vZGVsX2NvbmZpZ31cbiAgICAgICAgICBoYW5kbGVNZXRhZGF0YU1vZGVsQ2hhbmdlPXtoYW5kbGVNZXRhZGF0YU1vZGVsQ2hhbmdlfVxuICAgICAgICAgIGhhbmRsZU1ldGFkYXRhQ29tcGxldGlvblBhcmFtc0NoYW5nZT17aGFuZGxlTWV0YWRhdGFDb21wbGV0aW9uUGFyYW1zQ2hhbmdlfVxuICAgICAgICAgIGlzQ29tbW9uVmFyaWFibGVcbiAgICAgICAgICBhdmFpbGFibGVDb21tb25TdHJpbmdWYXJzPXtwcm9tcHRWYXJpYWJsZXNUb1NlbGVjdC5maWx0ZXIoaXRlbSA9PiBpdGVtLnR5cGUgPT09IE1ldGFkYXRhRmlsdGVyaW5nVmFyaWFibGVUeXBlLnN0cmluZyB8fCBpdGVtLnR5cGUgPT09IE1ldGFkYXRhRmlsdGVyaW5nVmFyaWFibGVUeXBlLnNlbGVjdCl9XG4gICAgICAgICAgYXZhaWxhYmxlQ29tbW9uTnVtYmVyVmFycz17cHJvbXB0VmFyaWFibGVzVG9TZWxlY3QuZmlsdGVyKGl0ZW0gPT4gaXRlbS50eXBlID09PSBNZXRhZGF0YUZpbHRlcmluZ1ZhcmlhYmxlVHlwZS5udW1iZXIpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHttb2RlID09PSBBcHBNb2RlRW51bS5DT01QTEVUSU9OICYmIGRhdGFTZXQubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgIDxDb250ZXh0VmFyXG4gICAgICAgICAgdmFsdWU9e3NlbGVjdGVkQ29udGV4dFZhcj8ua2V5fVxuICAgICAgICAgIG9wdGlvbnM9e3Byb21wdFZhcmlhYmxlc1RvU2VsZWN0fVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVTZWxlY3RDb250ZXh0VmFyfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L0ZlYXR1cmVQYW5lbD5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhEYXRhc2V0Q29uZmlnKVxuIl19