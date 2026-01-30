"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutRerankModelConfiguredInRetrievalSettings = exports.getMultipleRetrievalConfig = exports.getSelectedDatasetsMode = exports.checkNodeValid = void 0;
const array_1 = require("es-toolkit/array");
const compat_1 = require("es-toolkit/compat");
const config_1 = require("@/config");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const checkNodeValid = () => {
    return true;
};
exports.checkNodeValid = checkNodeValid;
const getSelectedDatasetsMode = (datasets = []) => {
    if (datasets === null)
        datasets = [];
    let allHighQuality = true;
    let allHighQualityVectorSearch = true;
    let allHighQualityFullTextSearch = true;
    let allEconomic = true;
    let mixtureHighQualityAndEconomic = true;
    let allExternal = true;
    let allInternal = true;
    let mixtureInternalAndExternal = true;
    let inconsistentEmbeddingModel = false;
    if (!datasets.length) {
        allHighQuality = false;
        allHighQualityVectorSearch = false;
        allHighQualityFullTextSearch = false;
        allEconomic = false;
        mixtureHighQualityAndEconomic = false;
        allExternal = false;
        allInternal = false;
        mixtureInternalAndExternal = false;
    }
    datasets.forEach((dataset) => {
        if (dataset.indexing_technique === 'economy') {
            allHighQuality = false;
            allHighQualityVectorSearch = false;
            allHighQualityFullTextSearch = false;
        }
        if (dataset.indexing_technique === 'high_quality') {
            allEconomic = false;
            if (dataset.retrieval_model_dict.search_method !== app_1.RETRIEVE_METHOD.semantic)
                allHighQualityVectorSearch = false;
            if (dataset.retrieval_model_dict.search_method !== app_1.RETRIEVE_METHOD.fullText)
                allHighQualityFullTextSearch = false;
        }
        if (dataset.provider !== 'external') {
            allExternal = false;
        }
        else {
            allInternal = false;
            allHighQuality = false;
            allHighQualityVectorSearch = false;
            allHighQualityFullTextSearch = false;
            mixtureHighQualityAndEconomic = false;
        }
    });
    if (allExternal || allInternal)
        mixtureInternalAndExternal = false;
    if (allHighQuality || allEconomic)
        mixtureHighQualityAndEconomic = false;
    if (allHighQuality)
        inconsistentEmbeddingModel = (0, array_1.uniq)(datasets.map(item => item.embedding_model)).length > 1;
    return {
        allHighQuality,
        allHighQualityVectorSearch,
        allHighQualityFullTextSearch,
        allEconomic,
        mixtureHighQualityAndEconomic,
        allInternal,
        allExternal,
        mixtureInternalAndExternal,
        inconsistentEmbeddingModel,
    };
};
exports.getSelectedDatasetsMode = getSelectedDatasetsMode;
const getMultipleRetrievalConfig = (multipleRetrievalConfig, selectedDatasets, originalDatasets, fallbackRerankModel) => {
    // Check if the selected datasets are different from the original datasets
    const isDatasetsChanged = (0, compat_1.xorBy)(selectedDatasets, originalDatasets, 'id').length > 0;
    // Check if the rerank model is valid
    const isFallbackRerankModelValid = !!(fallbackRerankModel?.provider && fallbackRerankModel?.model);
    const { allHighQuality, allHighQualityVectorSearch, allHighQualityFullTextSearch, allEconomic, mixtureHighQualityAndEconomic, allInternal, allExternal, mixtureInternalAndExternal, inconsistentEmbeddingModel, } = (0, exports.getSelectedDatasetsMode)(selectedDatasets);
    const { top_k = config_1.DATASET_DEFAULT.top_k, score_threshold, reranking_mode, reranking_model, weights, reranking_enable, } = multipleRetrievalConfig || { top_k: config_1.DATASET_DEFAULT.top_k };
    const result = {
        top_k,
        score_threshold,
        reranking_mode,
        reranking_model,
        weights,
        reranking_enable,
    };
    const setDefaultWeights = () => {
        result.weights = {
            weight_type: datasets_1.WeightedScoreEnum.Customized,
            vector_setting: {
                vector_weight: allHighQualityVectorSearch
                    ? datasets_1.DEFAULT_WEIGHTED_SCORE.allHighQualityVectorSearch.semantic
                    // eslint-disable-next-line sonarjs/no-nested-conditional
                    : allHighQualityFullTextSearch
                        ? datasets_1.DEFAULT_WEIGHTED_SCORE.allHighQualityFullTextSearch.semantic
                        : datasets_1.DEFAULT_WEIGHTED_SCORE.other.semantic,
                embedding_provider_name: selectedDatasets[0].embedding_model_provider,
                embedding_model_name: selectedDatasets[0].embedding_model,
            },
            keyword_setting: {
                keyword_weight: allHighQualityVectorSearch
                    ? datasets_1.DEFAULT_WEIGHTED_SCORE.allHighQualityVectorSearch.keyword
                    // eslint-disable-next-line sonarjs/no-nested-conditional
                    : allHighQualityFullTextSearch
                        ? datasets_1.DEFAULT_WEIGHTED_SCORE.allHighQualityFullTextSearch.keyword
                        : datasets_1.DEFAULT_WEIGHTED_SCORE.other.keyword,
            },
        };
    };
    /**
     * In this case, user can manually toggle reranking
     * So should keep the reranking_enable value
     * But the default reranking_model should be set
     */
    if ((allEconomic && allInternal) || allExternal) {
        result.reranking_mode = datasets_1.RerankingModeEnum.RerankingModel;
        // Need to check if the reranking model should be set to default when first time initialized
        if ((!result.reranking_model?.provider || !result.reranking_model?.model) && isFallbackRerankModelValid) {
            result.reranking_model = {
                provider: fallbackRerankModel.provider || '',
                model: fallbackRerankModel.model || '',
            };
        }
        result.reranking_enable = reranking_enable;
    }
    /**
     * In this case, reranking_enable must be true
     * And if rerank model is not set, should set the default rerank model
     */
    if (mixtureHighQualityAndEconomic || inconsistentEmbeddingModel || mixtureInternalAndExternal) {
        result.reranking_mode = datasets_1.RerankingModeEnum.RerankingModel;
        // Need to check if the reranking model should be set to default when first time initialized
        if ((!result.reranking_model?.provider || !result.reranking_model?.model) && isFallbackRerankModelValid) {
            result.reranking_model = {
                provider: fallbackRerankModel.provider || '',
                model: fallbackRerankModel.model || '',
            };
        }
        result.reranking_enable = true;
    }
    /**
     * In this case, user can choose to use weighted score or rerank model
     * But if the reranking_mode is not initialized, should set the default rerank model and reranking_enable to true
     * and set reranking_mode to reranking_model
     */
    if (allHighQuality && !inconsistentEmbeddingModel && allInternal) {
        // If not initialized, check if the default rerank model is valid
        if (!reranking_mode) {
            if (isFallbackRerankModelValid) {
                result.reranking_mode = datasets_1.RerankingModeEnum.RerankingModel;
                result.reranking_enable = true;
                result.reranking_model = {
                    provider: fallbackRerankModel.provider || '',
                    model: fallbackRerankModel.model || '',
                };
            }
            else {
                result.reranking_mode = datasets_1.RerankingModeEnum.WeightedScore;
                result.reranking_enable = false;
                setDefaultWeights();
            }
        }
        // After initialization, if datasets has no change, make sure the config has correct value
        if (reranking_mode === datasets_1.RerankingModeEnum.WeightedScore) {
            result.reranking_enable = false;
            if (!weights)
                setDefaultWeights();
        }
        if (reranking_mode === datasets_1.RerankingModeEnum.RerankingModel) {
            if ((!result.reranking_model?.provider || !result.reranking_model?.model) && isFallbackRerankModelValid) {
                result.reranking_model = {
                    provider: fallbackRerankModel.provider || '',
                    model: fallbackRerankModel.model || '',
                };
            }
            result.reranking_enable = true;
        }
        // Need to check if reranking_mode should be set to reranking_model when datasets changed
        if (reranking_mode === datasets_1.RerankingModeEnum.WeightedScore && weights && isDatasetsChanged) {
            if ((result.reranking_model?.provider && result.reranking_model?.model) || isFallbackRerankModelValid) {
                result.reranking_mode = datasets_1.RerankingModeEnum.RerankingModel;
                result.reranking_enable = true;
                // eslint-disable-next-line sonarjs/nested-control-flow
                if ((!result.reranking_model?.provider || !result.reranking_model?.model) && isFallbackRerankModelValid) {
                    result.reranking_model = {
                        provider: fallbackRerankModel.provider || '',
                        model: fallbackRerankModel.model || '',
                    };
                }
            }
            else {
                setDefaultWeights();
            }
        }
        // Need to switch to weighted score when reranking model is not valid and datasets changed
        if (reranking_mode === datasets_1.RerankingModeEnum.RerankingModel
            && (!result.reranking_model?.provider || !result.reranking_model?.model)
            && !isFallbackRerankModelValid
            && isDatasetsChanged) {
            result.reranking_mode = datasets_1.RerankingModeEnum.WeightedScore;
            result.reranking_enable = false;
            setDefaultWeights();
        }
    }
    return result;
};
exports.getMultipleRetrievalConfig = getMultipleRetrievalConfig;
const checkoutRerankModelConfiguredInRetrievalSettings = (datasets, multipleRetrievalConfig) => {
    if (!multipleRetrievalConfig)
        return true;
    const { allEconomic, allExternal, allInternal, } = (0, exports.getSelectedDatasetsMode)(datasets);
    const { reranking_enable, reranking_mode, reranking_model, } = multipleRetrievalConfig;
    if (reranking_mode === datasets_1.RerankingModeEnum.RerankingModel && (!reranking_model?.provider || !reranking_model?.model))
        return ((allEconomic && allInternal) || allExternal) && !reranking_enable;
    return true;
};
exports.checkoutRerankModelConfiguredInRetrievalSettings = checkoutRerankModelConfiguredInRetrievalSettings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLQSw0Q0FBdUM7QUFDdkMsOENBQXlDO0FBQ3pDLHFDQUEwQztBQUMxQyxnREFJMEI7QUFDMUIscUNBQTZDO0FBRXRDLE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRTtJQUNqQyxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUMsQ0FBQTtBQUZZLFFBQUEsY0FBYyxrQkFFMUI7QUFFTSxNQUFNLHVCQUF1QixHQUFHLENBQUMsV0FBc0IsRUFBRSxFQUFFLEVBQUU7SUFDbEUsSUFBSSxRQUFRLEtBQUssSUFBSTtRQUNuQixRQUFRLEdBQUcsRUFBRSxDQUFBO0lBQ2YsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFBO0lBQ3pCLElBQUksMEJBQTBCLEdBQUcsSUFBSSxDQUFBO0lBQ3JDLElBQUksNEJBQTRCLEdBQUcsSUFBSSxDQUFBO0lBQ3ZDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQTtJQUN0QixJQUFJLDZCQUE2QixHQUFHLElBQUksQ0FBQTtJQUN4QyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUE7SUFDdEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFBO0lBQ3RCLElBQUksMEJBQTBCLEdBQUcsSUFBSSxDQUFBO0lBQ3JDLElBQUksMEJBQTBCLEdBQUcsS0FBSyxDQUFBO0lBQ3RDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDckIsY0FBYyxHQUFHLEtBQUssQ0FBQTtRQUN0QiwwQkFBMEIsR0FBRyxLQUFLLENBQUE7UUFDbEMsNEJBQTRCLEdBQUcsS0FBSyxDQUFBO1FBQ3BDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDbkIsNkJBQTZCLEdBQUcsS0FBSyxDQUFBO1FBQ3JDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDbkIsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUNuQiwwQkFBMEIsR0FBRyxLQUFLLENBQUE7SUFDcEMsQ0FBQztJQUNELFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUMzQixJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUM3QyxjQUFjLEdBQUcsS0FBSyxDQUFBO1lBQ3RCLDBCQUEwQixHQUFHLEtBQUssQ0FBQTtZQUNsQyw0QkFBNEIsR0FBRyxLQUFLLENBQUE7UUFDdEMsQ0FBQztRQUNELElBQUksT0FBTyxDQUFDLGtCQUFrQixLQUFLLGNBQWMsRUFBRSxDQUFDO1lBQ2xELFdBQVcsR0FBRyxLQUFLLENBQUE7WUFFbkIsSUFBSSxPQUFPLENBQUMsb0JBQW9CLENBQUMsYUFBYSxLQUFLLHFCQUFlLENBQUMsUUFBUTtnQkFDekUsMEJBQTBCLEdBQUcsS0FBSyxDQUFBO1lBRXBDLElBQUksT0FBTyxDQUFDLG9CQUFvQixDQUFDLGFBQWEsS0FBSyxxQkFBZSxDQUFDLFFBQVE7Z0JBQ3pFLDRCQUE0QixHQUFHLEtBQUssQ0FBQTtRQUN4QyxDQUFDO1FBQ0QsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRSxDQUFDO1lBQ3BDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDckIsQ0FBQzthQUNJLENBQUM7WUFDSixXQUFXLEdBQUcsS0FBSyxDQUFBO1lBQ25CLGNBQWMsR0FBRyxLQUFLLENBQUE7WUFDdEIsMEJBQTBCLEdBQUcsS0FBSyxDQUFBO1lBQ2xDLDRCQUE0QixHQUFHLEtBQUssQ0FBQTtZQUNwQyw2QkFBNkIsR0FBRyxLQUFLLENBQUE7UUFDdkMsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBSSxXQUFXLElBQUksV0FBVztRQUM1QiwwQkFBMEIsR0FBRyxLQUFLLENBQUE7SUFFcEMsSUFBSSxjQUFjLElBQUksV0FBVztRQUMvQiw2QkFBNkIsR0FBRyxLQUFLLENBQUE7SUFFdkMsSUFBSSxjQUFjO1FBQ2hCLDBCQUEwQixHQUFHLElBQUEsWUFBSSxFQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0lBRTFGLE9BQU87UUFDTCxjQUFjO1FBQ2QsMEJBQTBCO1FBQzFCLDRCQUE0QjtRQUM1QixXQUFXO1FBQ1gsNkJBQTZCO1FBQzdCLFdBQVc7UUFDWCxXQUFXO1FBQ1gsMEJBQTBCO1FBQzFCLDBCQUEwQjtLQUNILENBQUE7QUFDM0IsQ0FBQyxDQUFBO0FBckVZLFFBQUEsdUJBQXVCLDJCQXFFbkM7QUFFTSxNQUFNLDBCQUEwQixHQUFHLENBQ3hDLHVCQUFnRCxFQUNoRCxnQkFBMkIsRUFDM0IsZ0JBQTJCLEVBQzNCLG1CQUEyRCxFQUMzRCxFQUFFO0lBQ0YsMEVBQTBFO0lBQzFFLE1BQU0saUJBQWlCLEdBQUcsSUFBQSxjQUFLLEVBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtJQUNwRixxQ0FBcUM7SUFDckMsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLElBQUksbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFFbEcsTUFBTSxFQUNKLGNBQWMsRUFDZCwwQkFBMEIsRUFDMUIsNEJBQTRCLEVBQzVCLFdBQVcsRUFDWCw2QkFBNkIsRUFDN0IsV0FBVyxFQUNYLFdBQVcsRUFDWCwwQkFBMEIsRUFDMUIsMEJBQTBCLEdBQzNCLEdBQUcsSUFBQSwrQkFBdUIsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBRTdDLE1BQU0sRUFDSixLQUFLLEdBQUcsd0JBQWUsQ0FBQyxLQUFLLEVBQzdCLGVBQWUsRUFDZixjQUFjLEVBQ2QsZUFBZSxFQUNmLE9BQU8sRUFDUCxnQkFBZ0IsR0FDakIsR0FBRyx1QkFBdUIsSUFBSSxFQUFFLEtBQUssRUFBRSx3QkFBZSxDQUFDLEtBQUssRUFBRSxDQUFBO0lBRS9ELE1BQU0sTUFBTSxHQUFHO1FBQ2IsS0FBSztRQUNMLGVBQWU7UUFDZixjQUFjO1FBQ2QsZUFBZTtRQUNmLE9BQU87UUFDUCxnQkFBZ0I7S0FDakIsQ0FBQTtJQUVELE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxPQUFPLEdBQUc7WUFDZixXQUFXLEVBQUUsNEJBQWlCLENBQUMsVUFBVTtZQUN6QyxjQUFjLEVBQUU7Z0JBQ2QsYUFBYSxFQUFFLDBCQUEwQjtvQkFDdkMsQ0FBQyxDQUFDLGlDQUFzQixDQUFDLDBCQUEwQixDQUFDLFFBQVE7b0JBQzVELHlEQUF5RDtvQkFDekQsQ0FBQyxDQUFDLDRCQUE0Qjt3QkFDNUIsQ0FBQyxDQUFDLGlDQUFzQixDQUFDLDRCQUE0QixDQUFDLFFBQVE7d0JBQzlELENBQUMsQ0FBQyxpQ0FBc0IsQ0FBQyxLQUFLLENBQUMsUUFBUTtnQkFDM0MsdUJBQXVCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsd0JBQXdCO2dCQUNyRSxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlO2FBQzFEO1lBQ0QsZUFBZSxFQUFFO2dCQUNmLGNBQWMsRUFBRSwwQkFBMEI7b0JBQ3hDLENBQUMsQ0FBQyxpQ0FBc0IsQ0FBQywwQkFBMEIsQ0FBQyxPQUFPO29CQUMzRCx5REFBeUQ7b0JBQ3pELENBQUMsQ0FBQyw0QkFBNEI7d0JBQzVCLENBQUMsQ0FBQyxpQ0FBc0IsQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPO3dCQUM3RCxDQUFDLENBQUMsaUNBQXNCLENBQUMsS0FBSyxDQUFDLE9BQU87YUFDM0M7U0FDRixDQUFBO0lBQ0gsQ0FBQyxDQUFBO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLElBQUksV0FBVyxFQUFFLENBQUM7UUFDaEQsTUFBTSxDQUFDLGNBQWMsR0FBRyw0QkFBaUIsQ0FBQyxjQUFjLENBQUE7UUFDeEQsNEZBQTRGO1FBQzVGLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsSUFBSSwwQkFBMEIsRUFBRSxDQUFDO1lBQ3hHLE1BQU0sQ0FBQyxlQUFlLEdBQUc7Z0JBQ3ZCLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxRQUFRLElBQUksRUFBRTtnQkFDNUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLEtBQUssSUFBSSxFQUFFO2FBQ3ZDLENBQUE7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBO0lBQzVDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLDZCQUE2QixJQUFJLDBCQUEwQixJQUFJLDBCQUEwQixFQUFFLENBQUM7UUFDOUYsTUFBTSxDQUFDLGNBQWMsR0FBRyw0QkFBaUIsQ0FBQyxjQUFjLENBQUE7UUFDeEQsNEZBQTRGO1FBQzVGLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsSUFBSSwwQkFBMEIsRUFBRSxDQUFDO1lBQ3hHLE1BQU0sQ0FBQyxlQUFlLEdBQUc7Z0JBQ3ZCLFFBQVEsRUFBRSxtQkFBbUIsQ0FBQyxRQUFRLElBQUksRUFBRTtnQkFDNUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLEtBQUssSUFBSSxFQUFFO2FBQ3ZDLENBQUE7UUFDSCxDQUFDO1FBQ0QsTUFBTSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQTtJQUNoQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksY0FBYyxJQUFJLENBQUMsMEJBQTBCLElBQUksV0FBVyxFQUFFLENBQUM7UUFDakUsaUVBQWlFO1FBQ2pFLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNwQixJQUFJLDBCQUEwQixFQUFFLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxjQUFjLEdBQUcsNEJBQWlCLENBQUMsY0FBYyxDQUFBO2dCQUN4RCxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFBO2dCQUU5QixNQUFNLENBQUMsZUFBZSxHQUFHO29CQUN2QixRQUFRLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxJQUFJLEVBQUU7b0JBQzVDLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLElBQUksRUFBRTtpQkFDdkMsQ0FBQTtZQUNILENBQUM7aUJBQ0ksQ0FBQztnQkFDSixNQUFNLENBQUMsY0FBYyxHQUFHLDRCQUFpQixDQUFDLGFBQWEsQ0FBQTtnQkFDdkQsTUFBTSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQTtnQkFDL0IsaUJBQWlCLEVBQUUsQ0FBQTtZQUNyQixDQUFDO1FBQ0gsQ0FBQztRQUVELDBGQUEwRjtRQUMxRixJQUFJLGNBQWMsS0FBSyw0QkFBaUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN2RCxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFBO1lBQy9CLElBQUksQ0FBQyxPQUFPO2dCQUNWLGlCQUFpQixFQUFFLENBQUE7UUFDdkIsQ0FBQztRQUNELElBQUksY0FBYyxLQUFLLDRCQUFpQixDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3hELElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsSUFBSSwwQkFBMEIsRUFBRSxDQUFDO2dCQUN4RyxNQUFNLENBQUMsZUFBZSxHQUFHO29CQUN2QixRQUFRLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxJQUFJLEVBQUU7b0JBQzVDLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLElBQUksRUFBRTtpQkFDdkMsQ0FBQTtZQUNILENBQUM7WUFDRCxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFBO1FBQ2hDLENBQUM7UUFFRCx5RkFBeUY7UUFDekYsSUFBSSxjQUFjLEtBQUssNEJBQWlCLENBQUMsYUFBYSxJQUFJLE9BQU8sSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1lBQ3ZGLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLFFBQVEsSUFBSSxNQUFNLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxJQUFJLDBCQUEwQixFQUFFLENBQUM7Z0JBQ3RHLE1BQU0sQ0FBQyxjQUFjLEdBQUcsNEJBQWlCLENBQUMsY0FBYyxDQUFBO2dCQUN4RCxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFBO2dCQUU5Qix1REFBdUQ7Z0JBQ3ZELElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsSUFBSSwwQkFBMEIsRUFBRSxDQUFDO29CQUN4RyxNQUFNLENBQUMsZUFBZSxHQUFHO3dCQUN2QixRQUFRLEVBQUUsbUJBQW1CLENBQUMsUUFBUSxJQUFJLEVBQUU7d0JBQzVDLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxLQUFLLElBQUksRUFBRTtxQkFDdkMsQ0FBQTtnQkFDSCxDQUFDO1lBQ0gsQ0FBQztpQkFDSSxDQUFDO2dCQUNKLGlCQUFpQixFQUFFLENBQUE7WUFDckIsQ0FBQztRQUNILENBQUM7UUFDRCwwRkFBMEY7UUFDMUYsSUFDRSxjQUFjLEtBQUssNEJBQWlCLENBQUMsY0FBYztlQUNoRCxDQUFDLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQztlQUNyRSxDQUFDLDBCQUEwQjtlQUMzQixpQkFBaUIsRUFDcEIsQ0FBQztZQUNELE1BQU0sQ0FBQyxjQUFjLEdBQUcsNEJBQWlCLENBQUMsYUFBYSxDQUFBO1lBQ3ZELE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUE7WUFDL0IsaUJBQWlCLEVBQUUsQ0FBQTtRQUNyQixDQUFDO0lBQ0gsQ0FBQztJQUVELE9BQU8sTUFBTSxDQUFBO0FBQ2YsQ0FBQyxDQUFBO0FBMUtZLFFBQUEsMEJBQTBCLDhCQTBLdEM7QUFFTSxNQUFNLGdEQUFnRCxHQUFHLENBQzlELFFBQW1CLEVBQ25CLHVCQUFpRCxFQUNqRCxFQUFFO0lBQ0YsSUFBSSxDQUFDLHVCQUF1QjtRQUMxQixPQUFPLElBQUksQ0FBQTtJQUViLE1BQU0sRUFDSixXQUFXLEVBQ1gsV0FBVyxFQUNYLFdBQVcsR0FDWixHQUFHLElBQUEsK0JBQXVCLEVBQUMsUUFBUSxDQUFDLENBQUE7SUFFckMsTUFBTSxFQUNKLGdCQUFnQixFQUNoQixjQUFjLEVBQ2QsZUFBZSxHQUNoQixHQUFHLHVCQUF1QixDQUFBO0lBRTNCLElBQUksY0FBYyxLQUFLLDRCQUFpQixDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFLFFBQVEsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUM7UUFDaEgsT0FBTyxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7SUFFM0UsT0FBTyxJQUFJLENBQUE7QUFDYixDQUFDLENBQUE7QUF2QlksUUFBQSxnREFBZ0Qsb0RBdUI1RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTXVsdGlwbGVSZXRyaWV2YWxDb25maWcgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUge1xuICBEYXRhU2V0LFxuICBTZWxlY3RlZERhdGFzZXRzTW9kZSxcbn0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyB1bmlxIH0gZnJvbSAnZXMtdG9vbGtpdC9hcnJheSdcbmltcG9ydCB7IHhvckJ5IH0gZnJvbSAnZXMtdG9vbGtpdC9jb21wYXQnXG5pbXBvcnQgeyBEQVRBU0VUX0RFRkFVTFQgfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7XG4gIERFRkFVTFRfV0VJR0hURURfU0NPUkUsXG4gIFJlcmFua2luZ01vZGVFbnVtLFxuICBXZWlnaHRlZFNjb3JlRW51bSxcbn0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBSRVRSSUVWRV9NRVRIT0QgfSBmcm9tICdAL3R5cGVzL2FwcCdcblxuZXhwb3J0IGNvbnN0IGNoZWNrTm9kZVZhbGlkID0gKCkgPT4ge1xuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgY29uc3QgZ2V0U2VsZWN0ZWREYXRhc2V0c01vZGUgPSAoZGF0YXNldHM6IERhdGFTZXRbXSA9IFtdKSA9PiB7XG4gIGlmIChkYXRhc2V0cyA9PT0gbnVsbClcbiAgICBkYXRhc2V0cyA9IFtdXG4gIGxldCBhbGxIaWdoUXVhbGl0eSA9IHRydWVcbiAgbGV0IGFsbEhpZ2hRdWFsaXR5VmVjdG9yU2VhcmNoID0gdHJ1ZVxuICBsZXQgYWxsSGlnaFF1YWxpdHlGdWxsVGV4dFNlYXJjaCA9IHRydWVcbiAgbGV0IGFsbEVjb25vbWljID0gdHJ1ZVxuICBsZXQgbWl4dHVyZUhpZ2hRdWFsaXR5QW5kRWNvbm9taWMgPSB0cnVlXG4gIGxldCBhbGxFeHRlcm5hbCA9IHRydWVcbiAgbGV0IGFsbEludGVybmFsID0gdHJ1ZVxuICBsZXQgbWl4dHVyZUludGVybmFsQW5kRXh0ZXJuYWwgPSB0cnVlXG4gIGxldCBpbmNvbnNpc3RlbnRFbWJlZGRpbmdNb2RlbCA9IGZhbHNlXG4gIGlmICghZGF0YXNldHMubGVuZ3RoKSB7XG4gICAgYWxsSGlnaFF1YWxpdHkgPSBmYWxzZVxuICAgIGFsbEhpZ2hRdWFsaXR5VmVjdG9yU2VhcmNoID0gZmFsc2VcbiAgICBhbGxIaWdoUXVhbGl0eUZ1bGxUZXh0U2VhcmNoID0gZmFsc2VcbiAgICBhbGxFY29ub21pYyA9IGZhbHNlXG4gICAgbWl4dHVyZUhpZ2hRdWFsaXR5QW5kRWNvbm9taWMgPSBmYWxzZVxuICAgIGFsbEV4dGVybmFsID0gZmFsc2VcbiAgICBhbGxJbnRlcm5hbCA9IGZhbHNlXG4gICAgbWl4dHVyZUludGVybmFsQW5kRXh0ZXJuYWwgPSBmYWxzZVxuICB9XG4gIGRhdGFzZXRzLmZvckVhY2goKGRhdGFzZXQpID0+IHtcbiAgICBpZiAoZGF0YXNldC5pbmRleGluZ190ZWNobmlxdWUgPT09ICdlY29ub215Jykge1xuICAgICAgYWxsSGlnaFF1YWxpdHkgPSBmYWxzZVxuICAgICAgYWxsSGlnaFF1YWxpdHlWZWN0b3JTZWFyY2ggPSBmYWxzZVxuICAgICAgYWxsSGlnaFF1YWxpdHlGdWxsVGV4dFNlYXJjaCA9IGZhbHNlXG4gICAgfVxuICAgIGlmIChkYXRhc2V0LmluZGV4aW5nX3RlY2huaXF1ZSA9PT0gJ2hpZ2hfcXVhbGl0eScpIHtcbiAgICAgIGFsbEVjb25vbWljID0gZmFsc2VcblxuICAgICAgaWYgKGRhdGFzZXQucmV0cmlldmFsX21vZGVsX2RpY3Quc2VhcmNoX21ldGhvZCAhPT0gUkVUUklFVkVfTUVUSE9ELnNlbWFudGljKVxuICAgICAgICBhbGxIaWdoUXVhbGl0eVZlY3RvclNlYXJjaCA9IGZhbHNlXG5cbiAgICAgIGlmIChkYXRhc2V0LnJldHJpZXZhbF9tb2RlbF9kaWN0LnNlYXJjaF9tZXRob2QgIT09IFJFVFJJRVZFX01FVEhPRC5mdWxsVGV4dClcbiAgICAgICAgYWxsSGlnaFF1YWxpdHlGdWxsVGV4dFNlYXJjaCA9IGZhbHNlXG4gICAgfVxuICAgIGlmIChkYXRhc2V0LnByb3ZpZGVyICE9PSAnZXh0ZXJuYWwnKSB7XG4gICAgICBhbGxFeHRlcm5hbCA9IGZhbHNlXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYWxsSW50ZXJuYWwgPSBmYWxzZVxuICAgICAgYWxsSGlnaFF1YWxpdHkgPSBmYWxzZVxuICAgICAgYWxsSGlnaFF1YWxpdHlWZWN0b3JTZWFyY2ggPSBmYWxzZVxuICAgICAgYWxsSGlnaFF1YWxpdHlGdWxsVGV4dFNlYXJjaCA9IGZhbHNlXG4gICAgICBtaXh0dXJlSGlnaFF1YWxpdHlBbmRFY29ub21pYyA9IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIGlmIChhbGxFeHRlcm5hbCB8fCBhbGxJbnRlcm5hbClcbiAgICBtaXh0dXJlSW50ZXJuYWxBbmRFeHRlcm5hbCA9IGZhbHNlXG5cbiAgaWYgKGFsbEhpZ2hRdWFsaXR5IHx8IGFsbEVjb25vbWljKVxuICAgIG1peHR1cmVIaWdoUXVhbGl0eUFuZEVjb25vbWljID0gZmFsc2VcblxuICBpZiAoYWxsSGlnaFF1YWxpdHkpXG4gICAgaW5jb25zaXN0ZW50RW1iZWRkaW5nTW9kZWwgPSB1bmlxKGRhdGFzZXRzLm1hcChpdGVtID0+IGl0ZW0uZW1iZWRkaW5nX21vZGVsKSkubGVuZ3RoID4gMVxuXG4gIHJldHVybiB7XG4gICAgYWxsSGlnaFF1YWxpdHksXG4gICAgYWxsSGlnaFF1YWxpdHlWZWN0b3JTZWFyY2gsXG4gICAgYWxsSGlnaFF1YWxpdHlGdWxsVGV4dFNlYXJjaCxcbiAgICBhbGxFY29ub21pYyxcbiAgICBtaXh0dXJlSGlnaFF1YWxpdHlBbmRFY29ub21pYyxcbiAgICBhbGxJbnRlcm5hbCxcbiAgICBhbGxFeHRlcm5hbCxcbiAgICBtaXh0dXJlSW50ZXJuYWxBbmRFeHRlcm5hbCxcbiAgICBpbmNvbnNpc3RlbnRFbWJlZGRpbmdNb2RlbCxcbiAgfSBhcyBTZWxlY3RlZERhdGFzZXRzTW9kZVxufVxuXG5leHBvcnQgY29uc3QgZ2V0TXVsdGlwbGVSZXRyaWV2YWxDb25maWcgPSAoXG4gIG11bHRpcGxlUmV0cmlldmFsQ29uZmlnOiBNdWx0aXBsZVJldHJpZXZhbENvbmZpZyxcbiAgc2VsZWN0ZWREYXRhc2V0czogRGF0YVNldFtdLFxuICBvcmlnaW5hbERhdGFzZXRzOiBEYXRhU2V0W10sXG4gIGZhbGxiYWNrUmVyYW5rTW9kZWw/OiB7IHByb3ZpZGVyPzogc3RyaW5nLCBtb2RlbD86IHN0cmluZyB9LCAvLyBmYWxsYmFjayByZXJhbmsgbW9kZWxcbikgPT4ge1xuICAvLyBDaGVjayBpZiB0aGUgc2VsZWN0ZWQgZGF0YXNldHMgYXJlIGRpZmZlcmVudCBmcm9tIHRoZSBvcmlnaW5hbCBkYXRhc2V0c1xuICBjb25zdCBpc0RhdGFzZXRzQ2hhbmdlZCA9IHhvckJ5KHNlbGVjdGVkRGF0YXNldHMsIG9yaWdpbmFsRGF0YXNldHMsICdpZCcpLmxlbmd0aCA+IDBcbiAgLy8gQ2hlY2sgaWYgdGhlIHJlcmFuayBtb2RlbCBpcyB2YWxpZFxuICBjb25zdCBpc0ZhbGxiYWNrUmVyYW5rTW9kZWxWYWxpZCA9ICEhKGZhbGxiYWNrUmVyYW5rTW9kZWw/LnByb3ZpZGVyICYmIGZhbGxiYWNrUmVyYW5rTW9kZWw/Lm1vZGVsKVxuXG4gIGNvbnN0IHtcbiAgICBhbGxIaWdoUXVhbGl0eSxcbiAgICBhbGxIaWdoUXVhbGl0eVZlY3RvclNlYXJjaCxcbiAgICBhbGxIaWdoUXVhbGl0eUZ1bGxUZXh0U2VhcmNoLFxuICAgIGFsbEVjb25vbWljLFxuICAgIG1peHR1cmVIaWdoUXVhbGl0eUFuZEVjb25vbWljLFxuICAgIGFsbEludGVybmFsLFxuICAgIGFsbEV4dGVybmFsLFxuICAgIG1peHR1cmVJbnRlcm5hbEFuZEV4dGVybmFsLFxuICAgIGluY29uc2lzdGVudEVtYmVkZGluZ01vZGVsLFxuICB9ID0gZ2V0U2VsZWN0ZWREYXRhc2V0c01vZGUoc2VsZWN0ZWREYXRhc2V0cylcblxuICBjb25zdCB7XG4gICAgdG9wX2sgPSBEQVRBU0VUX0RFRkFVTFQudG9wX2ssXG4gICAgc2NvcmVfdGhyZXNob2xkLFxuICAgIHJlcmFua2luZ19tb2RlLFxuICAgIHJlcmFua2luZ19tb2RlbCxcbiAgICB3ZWlnaHRzLFxuICAgIHJlcmFua2luZ19lbmFibGUsXG4gIH0gPSBtdWx0aXBsZVJldHJpZXZhbENvbmZpZyB8fCB7IHRvcF9rOiBEQVRBU0VUX0RFRkFVTFQudG9wX2sgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICB0b3BfayxcbiAgICBzY29yZV90aHJlc2hvbGQsXG4gICAgcmVyYW5raW5nX21vZGUsXG4gICAgcmVyYW5raW5nX21vZGVsLFxuICAgIHdlaWdodHMsXG4gICAgcmVyYW5raW5nX2VuYWJsZSxcbiAgfVxuXG4gIGNvbnN0IHNldERlZmF1bHRXZWlnaHRzID0gKCkgPT4ge1xuICAgIHJlc3VsdC53ZWlnaHRzID0ge1xuICAgICAgd2VpZ2h0X3R5cGU6IFdlaWdodGVkU2NvcmVFbnVtLkN1c3RvbWl6ZWQsXG4gICAgICB2ZWN0b3Jfc2V0dGluZzoge1xuICAgICAgICB2ZWN0b3Jfd2VpZ2h0OiBhbGxIaWdoUXVhbGl0eVZlY3RvclNlYXJjaFxuICAgICAgICAgID8gREVGQVVMVF9XRUlHSFRFRF9TQ09SRS5hbGxIaWdoUXVhbGl0eVZlY3RvclNlYXJjaC5zZW1hbnRpY1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBzb25hcmpzL25vLW5lc3RlZC1jb25kaXRpb25hbFxuICAgICAgICAgIDogYWxsSGlnaFF1YWxpdHlGdWxsVGV4dFNlYXJjaFxuICAgICAgICAgICAgPyBERUZBVUxUX1dFSUdIVEVEX1NDT1JFLmFsbEhpZ2hRdWFsaXR5RnVsbFRleHRTZWFyY2guc2VtYW50aWNcbiAgICAgICAgICAgIDogREVGQVVMVF9XRUlHSFRFRF9TQ09SRS5vdGhlci5zZW1hbnRpYyxcbiAgICAgICAgZW1iZWRkaW5nX3Byb3ZpZGVyX25hbWU6IHNlbGVjdGVkRGF0YXNldHNbMF0uZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyLFxuICAgICAgICBlbWJlZGRpbmdfbW9kZWxfbmFtZTogc2VsZWN0ZWREYXRhc2V0c1swXS5lbWJlZGRpbmdfbW9kZWwsXG4gICAgICB9LFxuICAgICAga2V5d29yZF9zZXR0aW5nOiB7XG4gICAgICAgIGtleXdvcmRfd2VpZ2h0OiBhbGxIaWdoUXVhbGl0eVZlY3RvclNlYXJjaFxuICAgICAgICAgID8gREVGQVVMVF9XRUlHSFRFRF9TQ09SRS5hbGxIaWdoUXVhbGl0eVZlY3RvclNlYXJjaC5rZXl3b3JkXG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHNvbmFyanMvbm8tbmVzdGVkLWNvbmRpdGlvbmFsXG4gICAgICAgICAgOiBhbGxIaWdoUXVhbGl0eUZ1bGxUZXh0U2VhcmNoXG4gICAgICAgICAgICA/IERFRkFVTFRfV0VJR0hURURfU0NPUkUuYWxsSGlnaFF1YWxpdHlGdWxsVGV4dFNlYXJjaC5rZXl3b3JkXG4gICAgICAgICAgICA6IERFRkFVTFRfV0VJR0hURURfU0NPUkUub3RoZXIua2V5d29yZCxcbiAgICAgIH0sXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluIHRoaXMgY2FzZSwgdXNlciBjYW4gbWFudWFsbHkgdG9nZ2xlIHJlcmFua2luZ1xuICAgKiBTbyBzaG91bGQga2VlcCB0aGUgcmVyYW5raW5nX2VuYWJsZSB2YWx1ZVxuICAgKiBCdXQgdGhlIGRlZmF1bHQgcmVyYW5raW5nX21vZGVsIHNob3VsZCBiZSBzZXRcbiAgICovXG4gIGlmICgoYWxsRWNvbm9taWMgJiYgYWxsSW50ZXJuYWwpIHx8IGFsbEV4dGVybmFsKSB7XG4gICAgcmVzdWx0LnJlcmFua2luZ19tb2RlID0gUmVyYW5raW5nTW9kZUVudW0uUmVyYW5raW5nTW9kZWxcbiAgICAvLyBOZWVkIHRvIGNoZWNrIGlmIHRoZSByZXJhbmtpbmcgbW9kZWwgc2hvdWxkIGJlIHNldCB0byBkZWZhdWx0IHdoZW4gZmlyc3QgdGltZSBpbml0aWFsaXplZFxuICAgIGlmICgoIXJlc3VsdC5yZXJhbmtpbmdfbW9kZWw/LnByb3ZpZGVyIHx8ICFyZXN1bHQucmVyYW5raW5nX21vZGVsPy5tb2RlbCkgJiYgaXNGYWxsYmFja1JlcmFua01vZGVsVmFsaWQpIHtcbiAgICAgIHJlc3VsdC5yZXJhbmtpbmdfbW9kZWwgPSB7XG4gICAgICAgIHByb3ZpZGVyOiBmYWxsYmFja1JlcmFua01vZGVsLnByb3ZpZGVyIHx8ICcnLFxuICAgICAgICBtb2RlbDogZmFsbGJhY2tSZXJhbmtNb2RlbC5tb2RlbCB8fCAnJyxcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0LnJlcmFua2luZ19lbmFibGUgPSByZXJhbmtpbmdfZW5hYmxlXG4gIH1cblxuICAvKipcbiAgICogSW4gdGhpcyBjYXNlLCByZXJhbmtpbmdfZW5hYmxlIG11c3QgYmUgdHJ1ZVxuICAgKiBBbmQgaWYgcmVyYW5rIG1vZGVsIGlzIG5vdCBzZXQsIHNob3VsZCBzZXQgdGhlIGRlZmF1bHQgcmVyYW5rIG1vZGVsXG4gICAqL1xuICBpZiAobWl4dHVyZUhpZ2hRdWFsaXR5QW5kRWNvbm9taWMgfHwgaW5jb25zaXN0ZW50RW1iZWRkaW5nTW9kZWwgfHwgbWl4dHVyZUludGVybmFsQW5kRXh0ZXJuYWwpIHtcbiAgICByZXN1bHQucmVyYW5raW5nX21vZGUgPSBSZXJhbmtpbmdNb2RlRW51bS5SZXJhbmtpbmdNb2RlbFxuICAgIC8vIE5lZWQgdG8gY2hlY2sgaWYgdGhlIHJlcmFua2luZyBtb2RlbCBzaG91bGQgYmUgc2V0IHRvIGRlZmF1bHQgd2hlbiBmaXJzdCB0aW1lIGluaXRpYWxpemVkXG4gICAgaWYgKCghcmVzdWx0LnJlcmFua2luZ19tb2RlbD8ucHJvdmlkZXIgfHwgIXJlc3VsdC5yZXJhbmtpbmdfbW9kZWw/Lm1vZGVsKSAmJiBpc0ZhbGxiYWNrUmVyYW5rTW9kZWxWYWxpZCkge1xuICAgICAgcmVzdWx0LnJlcmFua2luZ19tb2RlbCA9IHtcbiAgICAgICAgcHJvdmlkZXI6IGZhbGxiYWNrUmVyYW5rTW9kZWwucHJvdmlkZXIgfHwgJycsXG4gICAgICAgIG1vZGVsOiBmYWxsYmFja1JlcmFua01vZGVsLm1vZGVsIHx8ICcnLFxuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQucmVyYW5raW5nX2VuYWJsZSA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBJbiB0aGlzIGNhc2UsIHVzZXIgY2FuIGNob29zZSB0byB1c2Ugd2VpZ2h0ZWQgc2NvcmUgb3IgcmVyYW5rIG1vZGVsXG4gICAqIEJ1dCBpZiB0aGUgcmVyYW5raW5nX21vZGUgaXMgbm90IGluaXRpYWxpemVkLCBzaG91bGQgc2V0IHRoZSBkZWZhdWx0IHJlcmFuayBtb2RlbCBhbmQgcmVyYW5raW5nX2VuYWJsZSB0byB0cnVlXG4gICAqIGFuZCBzZXQgcmVyYW5raW5nX21vZGUgdG8gcmVyYW5raW5nX21vZGVsXG4gICAqL1xuICBpZiAoYWxsSGlnaFF1YWxpdHkgJiYgIWluY29uc2lzdGVudEVtYmVkZGluZ01vZGVsICYmIGFsbEludGVybmFsKSB7XG4gICAgLy8gSWYgbm90IGluaXRpYWxpemVkLCBjaGVjayBpZiB0aGUgZGVmYXVsdCByZXJhbmsgbW9kZWwgaXMgdmFsaWRcbiAgICBpZiAoIXJlcmFua2luZ19tb2RlKSB7XG4gICAgICBpZiAoaXNGYWxsYmFja1JlcmFua01vZGVsVmFsaWQpIHtcbiAgICAgICAgcmVzdWx0LnJlcmFua2luZ19tb2RlID0gUmVyYW5raW5nTW9kZUVudW0uUmVyYW5raW5nTW9kZWxcbiAgICAgICAgcmVzdWx0LnJlcmFua2luZ19lbmFibGUgPSB0cnVlXG5cbiAgICAgICAgcmVzdWx0LnJlcmFua2luZ19tb2RlbCA9IHtcbiAgICAgICAgICBwcm92aWRlcjogZmFsbGJhY2tSZXJhbmtNb2RlbC5wcm92aWRlciB8fCAnJyxcbiAgICAgICAgICBtb2RlbDogZmFsbGJhY2tSZXJhbmtNb2RlbC5tb2RlbCB8fCAnJyxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdC5yZXJhbmtpbmdfbW9kZSA9IFJlcmFua2luZ01vZGVFbnVtLldlaWdodGVkU2NvcmVcbiAgICAgICAgcmVzdWx0LnJlcmFua2luZ19lbmFibGUgPSBmYWxzZVxuICAgICAgICBzZXREZWZhdWx0V2VpZ2h0cygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWZ0ZXIgaW5pdGlhbGl6YXRpb24sIGlmIGRhdGFzZXRzIGhhcyBubyBjaGFuZ2UsIG1ha2Ugc3VyZSB0aGUgY29uZmlnIGhhcyBjb3JyZWN0IHZhbHVlXG4gICAgaWYgKHJlcmFua2luZ19tb2RlID09PSBSZXJhbmtpbmdNb2RlRW51bS5XZWlnaHRlZFNjb3JlKSB7XG4gICAgICByZXN1bHQucmVyYW5raW5nX2VuYWJsZSA9IGZhbHNlXG4gICAgICBpZiAoIXdlaWdodHMpXG4gICAgICAgIHNldERlZmF1bHRXZWlnaHRzKClcbiAgICB9XG4gICAgaWYgKHJlcmFua2luZ19tb2RlID09PSBSZXJhbmtpbmdNb2RlRW51bS5SZXJhbmtpbmdNb2RlbCkge1xuICAgICAgaWYgKCghcmVzdWx0LnJlcmFua2luZ19tb2RlbD8ucHJvdmlkZXIgfHwgIXJlc3VsdC5yZXJhbmtpbmdfbW9kZWw/Lm1vZGVsKSAmJiBpc0ZhbGxiYWNrUmVyYW5rTW9kZWxWYWxpZCkge1xuICAgICAgICByZXN1bHQucmVyYW5raW5nX21vZGVsID0ge1xuICAgICAgICAgIHByb3ZpZGVyOiBmYWxsYmFja1JlcmFua01vZGVsLnByb3ZpZGVyIHx8ICcnLFxuICAgICAgICAgIG1vZGVsOiBmYWxsYmFja1JlcmFua01vZGVsLm1vZGVsIHx8ICcnLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXN1bHQucmVyYW5raW5nX2VuYWJsZSA9IHRydWVcbiAgICB9XG5cbiAgICAvLyBOZWVkIHRvIGNoZWNrIGlmIHJlcmFua2luZ19tb2RlIHNob3VsZCBiZSBzZXQgdG8gcmVyYW5raW5nX21vZGVsIHdoZW4gZGF0YXNldHMgY2hhbmdlZFxuICAgIGlmIChyZXJhbmtpbmdfbW9kZSA9PT0gUmVyYW5raW5nTW9kZUVudW0uV2VpZ2h0ZWRTY29yZSAmJiB3ZWlnaHRzICYmIGlzRGF0YXNldHNDaGFuZ2VkKSB7XG4gICAgICBpZiAoKHJlc3VsdC5yZXJhbmtpbmdfbW9kZWw/LnByb3ZpZGVyICYmIHJlc3VsdC5yZXJhbmtpbmdfbW9kZWw/Lm1vZGVsKSB8fCBpc0ZhbGxiYWNrUmVyYW5rTW9kZWxWYWxpZCkge1xuICAgICAgICByZXN1bHQucmVyYW5raW5nX21vZGUgPSBSZXJhbmtpbmdNb2RlRW51bS5SZXJhbmtpbmdNb2RlbFxuICAgICAgICByZXN1bHQucmVyYW5raW5nX2VuYWJsZSA9IHRydWVcblxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc29uYXJqcy9uZXN0ZWQtY29udHJvbC1mbG93XG4gICAgICAgIGlmICgoIXJlc3VsdC5yZXJhbmtpbmdfbW9kZWw/LnByb3ZpZGVyIHx8ICFyZXN1bHQucmVyYW5raW5nX21vZGVsPy5tb2RlbCkgJiYgaXNGYWxsYmFja1JlcmFua01vZGVsVmFsaWQpIHtcbiAgICAgICAgICByZXN1bHQucmVyYW5raW5nX21vZGVsID0ge1xuICAgICAgICAgICAgcHJvdmlkZXI6IGZhbGxiYWNrUmVyYW5rTW9kZWwucHJvdmlkZXIgfHwgJycsXG4gICAgICAgICAgICBtb2RlbDogZmFsbGJhY2tSZXJhbmtNb2RlbC5tb2RlbCB8fCAnJyxcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBzZXREZWZhdWx0V2VpZ2h0cygpXG4gICAgICB9XG4gICAgfVxuICAgIC8vIE5lZWQgdG8gc3dpdGNoIHRvIHdlaWdodGVkIHNjb3JlIHdoZW4gcmVyYW5raW5nIG1vZGVsIGlzIG5vdCB2YWxpZCBhbmQgZGF0YXNldHMgY2hhbmdlZFxuICAgIGlmIChcbiAgICAgIHJlcmFua2luZ19tb2RlID09PSBSZXJhbmtpbmdNb2RlRW51bS5SZXJhbmtpbmdNb2RlbFxuICAgICAgJiYgKCFyZXN1bHQucmVyYW5raW5nX21vZGVsPy5wcm92aWRlciB8fCAhcmVzdWx0LnJlcmFua2luZ19tb2RlbD8ubW9kZWwpXG4gICAgICAmJiAhaXNGYWxsYmFja1JlcmFua01vZGVsVmFsaWRcbiAgICAgICYmIGlzRGF0YXNldHNDaGFuZ2VkXG4gICAgKSB7XG4gICAgICByZXN1bHQucmVyYW5raW5nX21vZGUgPSBSZXJhbmtpbmdNb2RlRW51bS5XZWlnaHRlZFNjb3JlXG4gICAgICByZXN1bHQucmVyYW5raW5nX2VuYWJsZSA9IGZhbHNlXG4gICAgICBzZXREZWZhdWx0V2VpZ2h0cygpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgY29uc3QgY2hlY2tvdXRSZXJhbmtNb2RlbENvbmZpZ3VyZWRJblJldHJpZXZhbFNldHRpbmdzID0gKFxuICBkYXRhc2V0czogRGF0YVNldFtdLFxuICBtdWx0aXBsZVJldHJpZXZhbENvbmZpZz86IE11bHRpcGxlUmV0cmlldmFsQ29uZmlnLFxuKSA9PiB7XG4gIGlmICghbXVsdGlwbGVSZXRyaWV2YWxDb25maWcpXG4gICAgcmV0dXJuIHRydWVcblxuICBjb25zdCB7XG4gICAgYWxsRWNvbm9taWMsXG4gICAgYWxsRXh0ZXJuYWwsXG4gICAgYWxsSW50ZXJuYWwsXG4gIH0gPSBnZXRTZWxlY3RlZERhdGFzZXRzTW9kZShkYXRhc2V0cylcblxuICBjb25zdCB7XG4gICAgcmVyYW5raW5nX2VuYWJsZSxcbiAgICByZXJhbmtpbmdfbW9kZSxcbiAgICByZXJhbmtpbmdfbW9kZWwsXG4gIH0gPSBtdWx0aXBsZVJldHJpZXZhbENvbmZpZ1xuXG4gIGlmIChyZXJhbmtpbmdfbW9kZSA9PT0gUmVyYW5raW5nTW9kZUVudW0uUmVyYW5raW5nTW9kZWwgJiYgKCFyZXJhbmtpbmdfbW9kZWw/LnByb3ZpZGVyIHx8ICFyZXJhbmtpbmdfbW9kZWw/Lm1vZGVsKSlcbiAgICByZXR1cm4gKChhbGxFY29ub21pYyAmJiBhbGxJbnRlcm5hbCkgfHwgYWxsRXh0ZXJuYWwpICYmICFyZXJhbmtpbmdfZW5hYmxlXG5cbiAgcmV0dXJuIHRydWVcbn1cbiJdfQ==