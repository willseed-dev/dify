"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIndexingConfig = exports.IndexingType = void 0;
const react_1 = require("react");
const utils_1 = require("@/app/components/datasets/settings/utils");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const app_1 = require("@/types/app");
var IndexingType;
(function (IndexingType) {
    IndexingType["QUALIFIED"] = "high_quality";
    IndexingType["ECONOMICAL"] = "economy";
})(IndexingType || (exports.IndexingType = IndexingType = {}));
const DEFAULT_RETRIEVAL_CONFIG = {
    search_method: app_1.RETRIEVE_METHOD.semantic,
    reranking_enable: false,
    reranking_model: {
        reranking_provider_name: '',
        reranking_model_name: '',
    },
    top_k: 3,
    score_threshold_enabled: false,
    score_threshold: 0.5,
};
const useIndexingConfig = (options) => {
    const { initialIndexType, initialEmbeddingModel, initialRetrievalConfig, isAPIKeySet, hasSetIndexType, } = options;
    // Rerank model
    const { modelList: rerankModelList, defaultModel: rerankDefaultModel, currentModel: isRerankDefaultModelValid, } = (0, hooks_1.useModelListAndDefaultModelAndCurrentProviderAndModel)(declarations_1.ModelTypeEnum.rerank);
    // Embedding model list
    const { data: embeddingModelList } = (0, hooks_1.useModelList)(declarations_1.ModelTypeEnum.textEmbedding);
    const { data: defaultEmbeddingModel } = (0, hooks_1.useDefaultModel)(declarations_1.ModelTypeEnum.textEmbedding);
    // Index type state
    const [indexType, setIndexType] = (0, react_1.useState)(() => {
        if (initialIndexType)
            return initialIndexType;
        return isAPIKeySet ? IndexingType.QUALIFIED : IndexingType.ECONOMICAL;
    });
    // Embedding model state
    const [embeddingModel, setEmbeddingModel] = (0, react_1.useState)(initialEmbeddingModel ?? {
        provider: defaultEmbeddingModel?.provider.provider || '',
        model: defaultEmbeddingModel?.model || '',
    });
    // Retrieval config state
    const [retrievalConfig, setRetrievalConfig] = (0, react_1.useState)(initialRetrievalConfig ?? DEFAULT_RETRIEVAL_CONFIG);
    // Sync retrieval config with rerank model when available
    (0, react_1.useEffect)(() => {
        if (initialRetrievalConfig)
            return;
        setRetrievalConfig({
            search_method: app_1.RETRIEVE_METHOD.semantic,
            reranking_enable: !!isRerankDefaultModelValid,
            reranking_model: {
                reranking_provider_name: isRerankDefaultModelValid ? rerankDefaultModel?.provider.provider ?? '' : '',
                reranking_model_name: isRerankDefaultModelValid ? rerankDefaultModel?.model ?? '' : '',
            },
            top_k: 3,
            score_threshold_enabled: false,
            score_threshold: 0.5,
        });
    }, [rerankDefaultModel, isRerankDefaultModelValid, initialRetrievalConfig]);
    // Sync index type with props
    (0, react_1.useEffect)(() => {
        if (initialIndexType)
            setIndexType(initialIndexType);
        else
            setIndexType(isAPIKeySet ? IndexingType.QUALIFIED : IndexingType.ECONOMICAL);
    }, [isAPIKeySet, initialIndexType]);
    // Show multimodal tip
    const showMultiModalTip = (0, react_1.useMemo)(() => {
        return (0, utils_1.checkShowMultiModalTip)({
            embeddingModel,
            rerankingEnable: retrievalConfig.reranking_enable,
            rerankModel: {
                rerankingProviderName: retrievalConfig.reranking_model.reranking_provider_name,
                rerankingModelName: retrievalConfig.reranking_model.reranking_model_name,
            },
            indexMethod: indexType,
            embeddingModelList,
            rerankModelList,
        });
    }, [embeddingModel, retrievalConfig, indexType, embeddingModelList, rerankModelList]);
    // Get effective indexing technique
    const getIndexingTechnique = () => initialIndexType || indexType;
    return {
        // Index type
        indexType,
        setIndexType,
        hasSetIndexType,
        getIndexingTechnique,
        // Embedding model
        embeddingModel,
        setEmbeddingModel,
        embeddingModelList,
        defaultEmbeddingModel,
        // Retrieval config
        retrievalConfig,
        setRetrievalConfig,
        rerankModelList,
        rerankDefaultModel,
        isRerankDefaultModelValid,
        // Computed
        showMultiModalTip,
    };
};
exports.useIndexingConfig = useIndexingConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWluZGV4aW5nLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1pbmRleGluZy1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsaUNBQW9EO0FBQ3BELG9FQUFpRjtBQUNqRiwyR0FBd0c7QUFDeEcsNkZBQXdLO0FBQ3hLLHFDQUE2QztBQUU3QyxJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDdEIsMENBQTBCLENBQUE7SUFDMUIsc0NBQXNCLENBQUE7QUFDeEIsQ0FBQyxFQUhXLFlBQVksNEJBQVosWUFBWSxRQUd2QjtBQUVELE1BQU0sd0JBQXdCLEdBQW9CO0lBQ2hELGFBQWEsRUFBRSxxQkFBZSxDQUFDLFFBQVE7SUFDdkMsZ0JBQWdCLEVBQUUsS0FBSztJQUN2QixlQUFlLEVBQUU7UUFDZix1QkFBdUIsRUFBRSxFQUFFO1FBQzNCLG9CQUFvQixFQUFFLEVBQUU7S0FDekI7SUFDRCxLQUFLLEVBQUUsQ0FBQztJQUNSLHVCQUF1QixFQUFFLEtBQUs7SUFDOUIsZUFBZSxFQUFFLEdBQUc7Q0FDckIsQ0FBQTtBQVVNLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxPQUFpQyxFQUFFLEVBQUU7SUFDckUsTUFBTSxFQUNKLGdCQUFnQixFQUNoQixxQkFBcUIsRUFDckIsc0JBQXNCLEVBQ3RCLFdBQVcsRUFDWCxlQUFlLEdBQ2hCLEdBQUcsT0FBTyxDQUFBO0lBRVgsZUFBZTtJQUNmLE1BQU0sRUFDSixTQUFTLEVBQUUsZUFBZSxFQUMxQixZQUFZLEVBQUUsa0JBQWtCLEVBQ2hDLFlBQVksRUFBRSx5QkFBeUIsR0FDeEMsR0FBRyxJQUFBLDZEQUFxRCxFQUFDLDRCQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFL0UsdUJBQXVCO0lBQ3ZCLE1BQU0sRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxJQUFBLG9CQUFZLEVBQUMsNEJBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUM5RSxNQUFNLEVBQUUs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RWhFLE9BQU87UUFDTCxhQUFhO1FBQ2IsU0FBUztRQUNULFlBQVk7UUFDWixlQUFlO1FBQ2Ysb0JBQW9CO1FBRXBCLGtCQUFrQjtRQUNsQixjQUFjO1FBQ2QsaUJBQWlCO1FBQ2pCLGtCQUFrQjtRQUNsQixxQkFBcUI7UUFFckIsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixrQkFBa0I7UUFDbEIsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQix5QkFBeUI7UUFFekIsV0FBVztRQUNYLGlCQUFpQjtLQUNsQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBM0dZLFFBQUEsaUJBQWlCLHFCQTJHN0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IERlZmF1bHRNb2RlbCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB0eXBlIHsgUmV0cmlldmFsQ29uZmlnIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjaGVja1Nob3dNdWx0aU1vZGFsVGlwIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9zZXR0aW5ncy91dGlscydcbmltcG9ydCB7IE1vZGVsVHlwZUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9kZWNsYXJhdGlvbnMnXG5pbXBvcnQgeyB1c2VEZWZhdWx0TW9kZWwsIHVzZU1vZGVsTGlzdCwgdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcydcbmltcG9ydCB7IFJFVFJJRVZFX01FVEhPRCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuXG5leHBvcnQgZW51bSBJbmRleGluZ1R5cGUge1xuICBRVUFMSUZJRUQgPSAnaGlnaF9xdWFsaXR5JyxcbiAgRUNPTk9NSUNBTCA9ICdlY29ub215Jyxcbn1cblxuY29uc3QgREVGQVVMVF9SRVRSSUVWQUxfQ09ORklHOiBSZXRyaWV2YWxDb25maWcgPSB7XG4gIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gIHJlcmFua2luZ19tb2RlbDoge1xuICAgIHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJyxcbiAgICByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycsXG4gIH0sXG4gIHRvcF9rOiAzLFxuICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gIHNjb3JlX3RocmVzaG9sZDogMC41LFxufVxuXG5leHBvcnQgdHlwZSBVc2VJbmRleGluZ0NvbmZpZ09wdGlvbnMgPSB7XG4gIGluaXRpYWxJbmRleFR5cGU/OiBJbmRleGluZ1R5cGVcbiAgaW5pdGlhbEVtYmVkZGluZ01vZGVsPzogRGVmYXVsdE1vZGVsXG4gIGluaXRpYWxSZXRyaWV2YWxDb25maWc/OiBSZXRyaWV2YWxDb25maWdcbiAgaXNBUElLZXlTZXQ6IGJvb2xlYW5cbiAgaGFzU2V0SW5kZXhUeXBlOiBib29sZWFuXG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbmRleGluZ0NvbmZpZyA9IChvcHRpb25zOiBVc2VJbmRleGluZ0NvbmZpZ09wdGlvbnMpID0+IHtcbiAgY29uc3Qge1xuICAgIGluaXRpYWxJbmRleFR5cGUsXG4gICAgaW5pdGlhbEVtYmVkZGluZ01vZGVsLFxuICAgIGluaXRpYWxSZXRyaWV2YWxDb25maWcsXG4gICAgaXNBUElLZXlTZXQsXG4gICAgaGFzU2V0SW5kZXhUeXBlLFxuICB9ID0gb3B0aW9uc1xuXG4gIC8vIFJlcmFuayBtb2RlbFxuICBjb25zdCB7XG4gICAgbW9kZWxMaXN0OiByZXJhbmtNb2RlbExpc3QsXG4gICAgZGVmYXVsdE1vZGVsOiByZXJhbmtEZWZhdWx0TW9kZWwsXG4gICAgY3VycmVudE1vZGVsOiBpc1JlcmFua0RlZmF1bHRNb2RlbFZhbGlkLFxuICB9ID0gdXNlTW9kZWxMaXN0QW5kRGVmYXVsdE1vZGVsQW5kQ3VycmVudFByb3ZpZGVyQW5kTW9kZWwoTW9kZWxUeXBlRW51bS5yZXJhbmspXG5cbiAgLy8gRW1iZWRkaW5nIG1vZGVsIGxpc3RcbiAgY29uc3QgeyBkYXRhOiBlbWJlZGRpbmdNb2RlbExpc3QgfSA9IHVzZU1vZGVsTGlzdChNb2RlbFR5cGVFbnVtLnRleHRFbWJlZGRpbmcpXG4gIGNvbnN0IHsgZGF0YTogZGVmYXVsdEVtYmVkZGluZ01vZGVsIH0gPSB1c2VEZWZhdWx0TW9kZWwoTW9kZWxUeXBlRW51bS50ZXh0RW1iZWRkaW5nKVxuXG4gIC8vIEluZGV4IHR5cGUgc3RhdGVcbiAgY29uc3QgW2luZGV4VHlwZSwgc2V0SW5kZXhUeXBlXSA9IHVzZVN0YXRlPEluZGV4aW5nVHlwZT4oKCkgPT4ge1xuICAgIGlmIChpbml0aWFsSW5kZXhUeXBlKVxuICAgICAgcmV0dXJuIGluaXRpYWxJbmRleFR5cGVcbiAgICByZXR1cm4gaXNBUElLZXlTZXQgPyBJbmRleGluZ1R5cGUuUVVBTElGSUVEIDogSW5kZXhpbmdUeXBlLkVDT05PTUlDQUxcbiAgfSlcblxuICAvLyBFbWJlZGRpbmcgbW9kZWwgc3RhdGVcbiAgY29uc3QgW2VtYmVkZGluZ01vZGVsLCBzZXRFbWJlZGRpbmdNb2RlbF0gPSB1c2VTdGF0ZTxEZWZhdWx0TW9kZWw+KFxuICAgIGluaXRpYWxFbWJlZGRpbmdNb2RlbCA/PyB7XG4gICAgICBwcm92aWRlcjogZGVmYXVsdEVtYmVkZGluZ01vZGVsPy5wcm92aWRlci5wcm92aWRlciB8fCAnJyxcbiAgICAgIG1vZGVsOiBkZWZhdWx0RW1iZWRkaW5nTW9kZWw/Lm1vZGVsIHx8ICcnLFxuICAgIH0sXG4gIClcblxuICAvLyBSZXRyaWV2YWwgY29uZmlnIHN0YXRlXG4gIGNvbnN0IFtyZXRyaWV2YWxDb25maWcsIHNldFJldHJpZXZhbENvbmZpZ10gPSB1c2VTdGF0ZTxSZXRyaWV2YWxDb25maWc+KFxuICAgIGluaXRpYWxSZXRyaWV2YWxDb25maWcgPz8gREVGQVVMVF9SRVRSSUVWQUxfQ09ORklHLFxuICApXG5cbiAgLy8gU3luYyByZXRyaWV2YWwgY29uZmlnIHdpdGggcmVyYW5rIG1vZGVsIHdoZW4gYXZhaWxhYmxlXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGluaXRpYWxSZXRyaWV2YWxDb25maWcpXG4gICAgICByZXR1cm5cblxuICAgIHNldFJldHJpZXZhbENvbmZpZyh7XG4gICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICByZXJhbmtpbmdfZW5hYmxlOiAhIWlzUmVyYW5rRGVmYXVsdE1vZGVsVmFsaWQsXG4gICAgICByZXJhbmtpbmdfbW9kZWw6IHtcbiAgICAgICAgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6IGlzUmVyYW5rRGVmYXVsdE1vZGVsVmFsaWQgPyByZXJhbmtEZWZhdWx0TW9kZWw/LnByb3ZpZGVyLnByb3ZpZGVyID8/ICcnIDogJycsXG4gICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiBpc1JlcmFua0RlZmF1bHRNb2RlbFZhbGlkID8gcmVyYW5rRGVmYXVsdE1vZGVsPy5tb2RlbCA/PyAnJyA6ICcnLFxuICAgICAgfSxcbiAgICAgIHRvcF9rOiAzLFxuICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgfSlcbiAgfSwgW3JlcmFua0RlZmF1bHRNb2RlbCwgaXNSZXJhbmtEZWZhdWx0TW9kZWxWYWxpZCwgaW5pdGlhbFJldHJpZXZhbENvbmZpZ10pXG5cbiAgLy8gU3luYyBpbmRleCB0eXBlIHdpdGggcHJvcHNcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaW5pdGlhbEluZGV4VHlwZSlcbiAgICAgIHNldEluZGV4VHlwZShpbml0aWFsSW5kZXhUeXBlKVxuICAgIGVsc2VcbiAgICAgIHNldEluZGV4VHlwZShpc0FQSUtleVNldCA/IEluZGV4aW5nVHlwZS5RVUFMSUZJRUQgOiBJbmRleGluZ1R5cGUuRUNPTk9NSUNBTClcbiAgfSwgW2lzQVBJS2V5U2V0LCBpbml0aWFsSW5kZXhUeXBlXSlcblxuICAvLyBTaG93IG11bHRpbW9kYWwgdGlwXG4gIGNvbnN0IHNob3dNdWx0aU1vZGFsVGlwID0gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIGNoZWNrU2hvd011bHRpTW9kYWxUaXAoe1xuICAgICAgZW1iZWRkaW5nTW9kZWwsXG4gICAgICByZXJhbmtpbmdFbmFibGU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfZW5hYmxlLFxuICAgICAgcmVyYW5rTW9kZWw6IHtcbiAgICAgICAgcmVyYW5raW5nUHJvdmlkZXJOYW1lOiByZXRyaWV2YWxDb25maWcucmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19wcm92aWRlcl9uYW1lLFxuICAgICAgICByZXJhbmtpbmdNb2RlbE5hbWU6IHJldHJpZXZhbENvbmZpZy5yZXJhbmtpbmdfbW9kZWwucmVyYW5raW5nX21vZGVsX25hbWUsXG4gICAgICB9LFxuICAgICAgaW5kZXhNZXRob2Q6IGluZGV4VHlwZSxcbiAgICAgIGVtYmVkZGluZ01vZGVsTGlzdCxcbiAgICAgIHJlcmFua01vZGVsTGlzdCxcbiAgICB9KVxuICB9LCBbZW1iZWRkaW5nTW9kZWwsIHJldHJpZXZhbENvbmZpZywgaW5kZXhUeXBlLCBlbWJlZGRpbmdNb2RlbExpc3QsIHJlcmFua01vZGVsTGlzdF0pXG5cbiAgLy8gR2V0IGVmZmVjdGl2ZSBpbmRleGluZyB0ZWNobmlxdWVcbiAgY29uc3QgZ2V0SW5kZXhpbmdUZWNobmlxdWUgPSAoKSA9PiBpbml0aWFsSW5kZXhUeXBlIHx8IGluZGV4VHlwZVxuXG4gIHJldHVybiB7XG4gICAgLy8gSW5kZXggdHlwZVxuICAgIGluZGV4VHlwZSxcbiAgICBzZXRJbmRleFR5cGUsXG4gICAgaGFzU2V0SW5kZXhUeXBlLFxuICAgIGdldEluZGV4aW5nVGVjaG5pcXVlLFxuXG4gICAgLy8gRW1iZWRkaW5nIG1vZGVsXG4gICAgZW1iZWRkaW5nTW9kZWwsXG4gICAgc2V0RW1iZWRkaW5nTW9kZWwsXG4gICAgZW1iZWRkaW5nTW9kZWxMaXN0LFxuICAgIGRlZmF1bHRFbWJlZGRpbmdNb2RlbCxcblxuICAgIC8vIFJldHJpZXZhbCBjb25maWdcbiAgICByZXRyaWV2YWxDb25maWcsXG4gICAgc2V0UmV0cmlldmFsQ29uZmlnLFxuICAgIHJlcmFua01vZGVsTGlzdCxcbiAgICByZXJhbmtEZWZhdWx0TW9kZWwsXG4gICAgaXNSZXJhbmtEZWZhdWx0TW9kZWxWYWxpZCxcblxuICAgIC8vIENvbXB1dGVkXG4gICAgc2hvd011bHRpTW9kYWxUaXAsXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgSW5kZXhpbmdDb25maWcgPSBSZXR1cm5UeXBlPHR5cGVvZiB1c2VJbmRleGluZ0NvbmZpZz5cbiJdfQ==