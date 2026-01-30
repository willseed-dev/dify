"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const button_1 = require("@/app/components/base/button");
const modal_1 = require("@/app/components/base/modal");
const toast_1 = require("@/app/components/base/toast");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const utils_1 = require("@/app/components/workflow/nodes/knowledge-retrieval/utils");
const debug_configuration_1 = require("@/context/debug-configuration");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const config_content_1 = require("./config-content");
const ParamsConfig = ({ disabled, selectedDatasets, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { datasetConfigs, setDatasetConfigs, rerankSettingModalOpen, setRerankSettingModalOpen, } = (0, use_context_selector_1.useContext)(debug_configuration_1.default);
    const [tempDataSetConfigs, setTempDataSetConfigs] = (0, react_2.useState)(datasetConfigs);
    (0, react_2.useEffect)(() => {
        setTempDataSetConfigs(datasetConfigs);
    }, [datasetConfigs]);
    const { modelList: rerankModelList, currentModel: rerankDefaultModel, currentProvider: rerankDefaultProvider, } = (0, hooks_1.useModelListAndDefaultModelAndCurrentProviderAndModel)(declarations_1.ModelTypeEnum.rerank);
    const { currentModel: isCurrentRerankModelValid, } = (0, hooks_1.useCurrentProviderAndModel)(rerankModelList, {
        provider: tempDataSetConfigs.reranking_model?.reranking_provider_name ?? '',
        model: tempDataSetConfigs.reranking_model?.reranking_model_name ?? '',
    });
    const isValid = () => {
        let errMsg = '';
        if (tempDataSetConfigs.retrieval_model === app_1.RETRIEVE_TYPE.multiWay) {
            if (tempDataSetConfigs.reranking_enable
                && tempDataSetConfigs.reranking_mode === datasets_1.RerankingModeEnum.RerankingModel
                && !isCurrentRerankModelValid) {
                errMsg = t('datasetConfig.rerankModelRequired', { ns: 'appDebug' });
            }
        }
        if (errMsg) {
            toast_1.default.notify({
                type: 'error',
                message: errMsg,
            });
        }
        return !errMsg;
    };
    const handleSave = () => {
        if (!isValid())
            return;
        setDatasetConfigs(tempDataSetConfigs);
        setRerankSettingModalOpen(false);
    };
    const handleSetTempDataSetConfigs = (newDatasetConfigs) => {
        const { datasets, retrieval_model, score_threshold_enabled, ...restConfigs } = newDatasetConfigs;
        const retrievalConfig = (0, utils_1.getMultipleRetrievalConfig)({
            top_k: restConfigs.top_k,
            score_threshold: restConfigs.score_threshold,
            reranking_model: restConfigs.reranking_model && {
                provider: restConfigs.reranking_model.reranking_provider_name,
                model: restConfigs.reranking_model.reranking_model_name,
            },
            reranking_mode: restConfigs.reranking_mode,
            weights: restConfigs.weights,
            reranking_enable: restConfigs.reranking_enable,
        }, selectedDatasets, selectedDatasets, {
            provider: rerankDefaultProvider?.provider,
            model: rerankDefaultModel?.model,
        });
        setTempDataSetConfigs({
            ...retrievalConfig,
            reranking_model: {
                reranking_provider_name: retrievalConfig.reranking_model?.provider || '',
                reranking_model_name: retrievalConfig.reranking_model?.model || '',
            },
            retrieval_model,
            score_threshold_enabled,
            datasets,
        });
    };
    return (<div>
      <button_1.default variant="ghost" size="small" className={(0, classnames_1.cn)('h-7', rerankSettingModalOpen && 'bg-components-button-ghost-bg-hover')} onClick={() => {
            setRerankSettingModalOpen(true);
        }} disabled={disabled}>
        <react_1.RiEqualizer2Line className="mr-1 h-3.5 w-3.5"/>
        {t('retrievalSettings', { ns: 'dataset' })}
      </button_1.default>
      {rerankSettingModalOpen && (<modal_1.default isShow={rerankSettingModalOpen} onClose={() => {
                setRerankSettingModalOpen(false);
            }} className="sm:min-w-[528px]">
            <config_content_1.default datasetConfigs={tempDataSetConfigs} onChange={handleSetTempDataSetConfigs} selectedDatasets={selectedDatasets}/>

            <div className="mt-6 flex justify-end">
              <button_1.default className="mr-2 shrink-0" onClick={() => {
                setTempDataSetConfigs(datasetConfigs);
                setRerankSettingModalOpen(false);
            }}>
                {t('operation.cancel', { ns: 'common' })}
              </button_1.default>
              <button_1.default variant="primary" className="shrink-0" onClick={handleSave}>{t('operation.save', { ns: 'common' })}</button_1.default>
            </div>
          </modal_1.default>)}

    </div>);
};
exports.default = (0, react_2.memo)(ParamsConfig);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWiw0Q0FBbUQ7QUFDbkQsaUNBQWlEO0FBQ2pELGlEQUE4QztBQUM5QywrREFBaUQ7QUFDakQseURBQWlEO0FBQ2pELHVEQUErQztBQUMvQyx1REFBK0M7QUFDL0MsMkdBQXdHO0FBQ3hHLDZGQUFxSztBQUNySyxxRkFFa0U7QUFDbEUsdUVBQXlEO0FBQ3pELGdEQUFxRDtBQUNyRCxxQ0FBMkM7QUFDM0MsbURBQXVDO0FBQ3ZDLHFEQUE0QztBQU01QyxNQUFNLFlBQVksR0FBRyxDQUFDLEVBQ3BCLFFBQVEsRUFDUixnQkFBZ0IsR0FDRSxFQUFFLEVBQUU7SUFDdEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFDSixjQUFjLEVBQ2QsaUJBQWlCLEVBQ2pCLHNCQUFzQixFQUN0Qix5QkFBeUIsR0FDMUIsR0FBRyxJQUFBLGlDQUFVLEVBQUMsNkJBQWEsQ0FBQyxDQUFBO0lBQzdCLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxxQkFBcUIsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxjQUFjLENBQUMsQ0FBQTtJQUU1RSxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IscUJBQXFCLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDdkMsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtJQUVwQixNQUFNLEVBQ0osU0FBUyxFQUFFLGVBQWUsRUFDMUIsWUFBWSxFQUFFLGtCQUFrQixFQUNoQyxlQUFlLEVBQUUscUJBQXFCLEdBQ3ZDLEdBQUcsSUFBQSw2REFBcUQsRUFBQyw0QkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRS9FLE1BQU0sRUFDSixZQUFZLEVBQUUseUJBQXlCLEdBQ3hDLEdBQUcsSUFBQSxrQ0FBMEIsRUFDNUIsZUFB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QyxFQUFFLGdCQUFNLENBQ3JIO1lBQUEsRUFBRSxHQUFHLENBQ1A7VUFBQSxFQUFFLGVBQUssQ0FBQyxDQUVaLENBRUY7O0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsSUFBQSxZQUFJLEVBQUMsWUFBWSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRGF0YVNldCB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhc2V0Q29uZmlncyB9IGZyb20gJ0AvbW9kZWxzL2RlYnVnJ1xuaW1wb3J0IHsgUmlFcXVhbGl6ZXIyTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyBtZW1vLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VDb250ZXh0IH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgTW9kYWwgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL21vZGFsJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IE1vZGVsVHlwZUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9kZWNsYXJhdGlvbnMnXG5pbXBvcnQgeyB1c2VDdXJyZW50UHJvdmlkZXJBbmRNb2RlbCwgdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcydcbmltcG9ydCB7XG4gIGdldE11bHRpcGxlUmV0cmlldmFsQ29uZmlnLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvdXRpbHMnXG5pbXBvcnQgQ29uZmlnQ29udGV4dCBmcm9tICdAL2NvbnRleHQvZGVidWctY29uZmlndXJhdGlvbidcbmltcG9ydCB7IFJlcmFua2luZ01vZGVFbnVtIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBSRVRSSUVWRV9UWVBFIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCBDb25maWdDb250ZW50IGZyb20gJy4vY29uZmlnLWNvbnRlbnQnXG5cbnR5cGUgUGFyYW1zQ29uZmlnUHJvcHMgPSB7XG4gIGRpc2FibGVkPzogYm9vbGVhblxuICBzZWxlY3RlZERhdGFzZXRzOiBEYXRhU2V0W11cbn1cbmNvbnN0IFBhcmFtc0NvbmZpZyA9ICh7XG4gIGRpc2FibGVkLFxuICBzZWxlY3RlZERhdGFzZXRzLFxufTogUGFyYW1zQ29uZmlnUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHtcbiAgICBkYXRhc2V0Q29uZmlncyxcbiAgICBzZXREYXRhc2V0Q29uZmlncyxcbiAgICByZXJhbmtTZXR0aW5nTW9kYWxPcGVuLFxuICAgIHNldFJlcmFua1NldHRpbmdNb2RhbE9wZW4sXG4gIH0gPSB1c2VDb250ZXh0KENvbmZpZ0NvbnRleHQpXG4gIGNvbnN0IFt0ZW1wRGF0YVNldENvbmZpZ3MsIHNldFRlbXBEYXRhU2V0Q29uZmlnc10gPSB1c2VTdGF0ZShkYXRhc2V0Q29uZmlncylcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFRlbXBEYXRhU2V0Q29uZmlncyhkYXRhc2V0Q29uZmlncylcbiAgfSwgW2RhdGFzZXRDb25maWdzXSlcblxuICBjb25zdCB7XG4gICAgbW9kZWxMaXN0OiByZXJhbmtNb2RlbExpc3QsXG4gICAgY3VycmVudE1vZGVsOiByZXJhbmtEZWZhdWx0TW9kZWwsXG4gICAgY3VycmVudFByb3ZpZGVyOiByZXJhbmtEZWZhdWx0UHJvdmlkZXIsXG4gIH0gPSB1c2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWxBbmRDdXJyZW50UHJvdmlkZXJBbmRNb2RlbChNb2RlbFR5cGVFbnVtLnJlcmFuaylcblxuICBjb25zdCB7XG4gICAgY3VycmVudE1vZGVsOiBpc0N1cnJlbnRSZXJhbmtNb2RlbFZhbGlkLFxuICB9ID0gdXNlQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwoXG4gICAgcmVyYW5rTW9kZWxMaXN0LFxuICAgIHtcbiAgICAgIHByb3ZpZGVyOiB0ZW1wRGF0YVNldENvbmZpZ3MucmVyYW5raW5nX21vZGVsPy5yZXJhbmtpbmdfcHJvdmlkZXJfbmFtZSA/PyAnJyxcbiAgICAgIG1vZGVsOiB0ZW1wRGF0YVNldENvbmZpZ3MucmVyYW5raW5nX21vZGVsPy5yZXJhbmtpbmdfbW9kZWxfbmFtZSA/PyAnJyxcbiAgICB9LFxuICApXG5cbiAgY29uc3QgaXNWYWxpZCA9ICgpID0+IHtcbiAgICBsZXQgZXJyTXNnID0gJydcbiAgICBpZiAodGVtcERhdGFTZXRDb25maWdzLnJldHJpZXZhbF9tb2RlbCA9PT0gUkVUUklFVkVfVFlQRS5tdWx0aVdheSkge1xuICAgICAgaWYgKHRlbXBEYXRhU2V0Q29uZmlncy5yZXJhbmtpbmdfZW5hYmxlXG4gICAgICAgICYmIHRlbXBEYXRhU2V0Q29uZmlncy5yZXJhbmtpbmdfbW9kZSA9PT0gUmVyYW5raW5nTW9kZUVudW0uUmVyYW5raW5nTW9kZWxcbiAgICAgICAgJiYgIWlzQ3VycmVudFJlcmFua01vZGVsVmFsaWRcbiAgICAgICkge1xuICAgICAgICBlcnJNc2cgPSB0KCdkYXRhc2V0Q29uZmlnLnJlcmFua01vZGVsUmVxdWlyZWQnLCB7IG5zOiAnYXBwRGVidWcnIH0pXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlcnJNc2cpIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IGVyck1zZyxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiAhZXJyTXNnXG4gIH1cbiAgY29uc3QgaGFuZGxlU2F2ZSA9ICgpID0+IHtcbiAgICBpZiAoIWlzVmFsaWQoKSlcbiAgICAgIHJldHVyblxuICAgIHNldERhdGFzZXRDb25maWdzKHRlbXBEYXRhU2V0Q29uZmlncylcbiAgICBzZXRSZXJhbmtTZXR0aW5nTW9kYWxPcGVuKGZhbHNlKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlU2V0VGVtcERhdGFTZXRDb25maWdzID0gKG5ld0RhdGFzZXRDb25maWdzOiBEYXRhc2V0Q29uZmlncykgPT4ge1xuICAgIGNvbnN0IHsgZGF0YXNldHMsIHJldHJpZXZhbF9tb2RlbCwgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQsIC4uLnJlc3RDb25maWdzIH0gPSBuZXdEYXRhc2V0Q29uZmlnc1xuXG4gICAgY29uc3QgcmV0cmlldmFsQ29uZmlnID0gZ2V0TXVsdGlwbGVSZXRyaWV2YWxDb25maWcoe1xuICAgICAgdG9wX2s6IHJlc3RDb25maWdzLnRvcF9rLFxuICAgICAgc2NvcmVfdGhyZXNob2xkOiByZXN0Q29uZmlncy5zY29yZV90aHJlc2hvbGQsXG4gICAgICByZXJhbmtpbmdfbW9kZWw6IHJlc3RDb25maWdzLnJlcmFua2luZ19tb2RlbCAmJiB7XG4gICAgICAgIHByb3ZpZGVyOiByZXN0Q29uZmlncy5yZXJhbmtpbmdfbW9kZWwucmVyYW5raW5nX3Byb3ZpZGVyX25hbWUsXG4gICAgICAgIG1vZGVsOiByZXN0Q29uZmlncy5yZXJhbmtpbmdfbW9kZWwucmVyYW5raW5nX21vZGVsX25hbWUsXG4gICAgICB9LFxuICAgICAgcmVyYW5raW5nX21vZGU6IHJlc3RDb25maWdzLnJlcmFua2luZ19tb2RlLFxuICAgICAgd2VpZ2h0czogcmVzdENvbmZpZ3Mud2VpZ2h0cyxcbiAgICAgIHJlcmFua2luZ19lbmFibGU6IHJlc3RDb25maWdzLnJlcmFua2luZ19lbmFibGUsXG4gICAgfSwgc2VsZWN0ZWREYXRhc2V0cywgc2VsZWN0ZWREYXRhc2V0cywge1xuICAgICAgcHJvdmlkZXI6IHJlcmFua0RlZmF1bHRQcm92aWRlcj8ucHJvdmlkZXIsXG4gICAgICBtb2RlbDogcmVyYW5rRGVmYXVsdE1vZGVsPy5tb2RlbCxcbiAgICB9KVxuXG4gICAgc2V0VGVtcERhdGFTZXRDb25maWdzKHtcbiAgICAgIC4uLnJldHJpZXZhbENvbmZpZyxcbiAgICAgIHJlcmFua2luZ19tb2RlbDoge1xuICAgICAgICByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogcmV0cmlldmFsQ29uZmlnLnJlcmFua2luZ19tb2RlbD8ucHJvdmlkZXIgfHwgJycsXG4gICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiByZXRyaWV2YWxDb25maWcucmVyYW5raW5nX21vZGVsPy5tb2RlbCB8fCAnJyxcbiAgICAgIH0sXG4gICAgICByZXRyaWV2YWxfbW9kZWwsXG4gICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZCxcbiAgICAgIGRhdGFzZXRzLFxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8QnV0dG9uXG4gICAgICAgIHZhcmlhbnQ9XCJnaG9zdFwiXG4gICAgICAgIHNpemU9XCJzbWFsbFwiXG4gICAgICAgIGNsYXNzTmFtZT17Y24oJ2gtNycsIHJlcmFua1NldHRpbmdNb2RhbE9wZW4gJiYgJ2JnLWNvbXBvbmVudHMtYnV0dG9uLWdob3N0LWJnLWhvdmVyJyl9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBzZXRSZXJhbmtTZXR0aW5nTW9kYWxPcGVuKHRydWUpXG4gICAgICAgIH19XG4gICAgICAgIGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgID5cbiAgICAgICAgPFJpRXF1YWxpemVyMkxpbmUgY2xhc3NOYW1lPVwibXItMSBoLTMuNSB3LTMuNVwiIC8+XG4gICAgICAgIHt0KCdyZXRyaWV2YWxTZXR0aW5ncycsIHsgbnM6ICdkYXRhc2V0JyB9KX1cbiAgICAgIDwvQnV0dG9uPlxuICAgICAge1xuICAgICAgICByZXJhbmtTZXR0aW5nTW9kYWxPcGVuICYmIChcbiAgICAgICAgICA8TW9kYWxcbiAgICAgICAgICAgIGlzU2hvdz17cmVyYW5rU2V0dGluZ01vZGFsT3Blbn1cbiAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHtcbiAgICAgICAgICAgICAgc2V0UmVyYW5rU2V0dGluZ01vZGFsT3BlbihmYWxzZSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzbTptaW4tdy1bNTI4cHhdXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Q29uZmlnQ29udGVudFxuICAgICAgICAgICAgICBkYXRhc2V0Q29uZmlncz17dGVtcERhdGFTZXRDb25maWdzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlU2V0VGVtcERhdGFTZXRDb25maWdzfVxuICAgICAgICAgICAgICBzZWxlY3RlZERhdGFzZXRzPXtzZWxlY3RlZERhdGFzZXRzfVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC02IGZsZXgganVzdGlmeS1lbmRcIj5cbiAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTIgc2hyaW5rLTBcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHNldFRlbXBEYXRhU2V0Q29uZmlncyhkYXRhc2V0Q29uZmlncylcbiAgICAgICAgICAgICAgICAgIHNldFJlcmFua1NldHRpbmdNb2RhbE9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0KCdvcGVyYXRpb24uY2FuY2VsJywgeyBuczogJ2NvbW1vbicgfSl9XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJwcmltYXJ5XCIgY2xhc3NOYW1lPVwic2hyaW5rLTBcIiBvbkNsaWNrPXtoYW5kbGVTYXZlfT57dCgnb3BlcmF0aW9uLnNhdmUnLCB7IG5zOiAnY29tbW9uJyB9KX08L0J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvTW9kYWw+XG4gICAgICAgIClcbiAgICAgIH1cblxuICAgIDwvZGl2PlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBtZW1vKFBhcmFtc0NvbmZpZylcbiJdfQ==