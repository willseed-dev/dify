"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const step_two_1 = require("@/app/components/datasets/create/step-two");
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const metaData = (0, utils_1.genNodeMetaData)({
    sort: 3.1,
    type: types_1.BlockEnum.KnowledgeBase,
    isRequired: true,
    isUndeletable: true,
    isSingleton: true,
    isTypeFixed: true,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        index_chunk_variable_selector: [],
        keyword_number: 10,
        retrieval_model: {
            top_k: 3,
            score_threshold_enabled: false,
            score_threshold: 0.5,
        },
    },
    checkValid(payload, t) {
        const { chunk_structure, indexing_technique, retrieval_model, embedding_model, embedding_model_provider, index_chunk_variable_selector, _embeddingModelList, _rerankModelList, } = payload;
        const { search_method, reranking_enable, reranking_model, } = retrieval_model || {};
        const currentEmbeddingModelProvider = _embeddingModelList?.find(provider => provider.provider === embedding_model_provider);
        const currentEmbeddingModel = currentEmbeddingModelProvider?.models.find(model => model.model === embedding_model);
        const currentRerankingModelProvider = _rerankModelList?.find(provider => provider.provider === reranking_model?.reranking_provider_name);
        const currentRerankingModel = currentRerankingModelProvider?.models.find(model => model.model === reranking_model?.reranking_model_name);
        if (!chunk_structure) {
            return {
                isValid: false,
                errorMessage: t('nodes.knowledgeBase.chunkIsRequired', { ns: 'workflow' }),
            };
        }
        if (index_chunk_variable_selector.length === 0) {
            return {
                isValid: false,
                errorMessage: t('nodes.knowledgeBase.chunksVariableIsRequired', { ns: 'workflow' }),
            };
        }
        if (!indexing_technique) {
            return {
                isValid: false,
                errorMessage: t('nodes.knowledgeBase.indexMethodIsRequired', { ns: 'workflow' }),
            };
        }
        if (indexing_technique === step_two_1.IndexingType.QUALIFIED) {
            if (!embedding_model || !embedding_model_provider) {
                return {
                    isValid: false,
                    errorMessage: t('nodes.knowledgeBase.embeddingModelIsRequired', { ns: 'workflow' }),
                };
            }
            else if (!currentEmbeddingModel) {
                return {
                    isValid: false,
                    errorMessage: t('nodes.knowledgeBase.embeddingModelIsInvalid', { ns: 'workflow' }),
                };
            }
        }
        if (!retrieval_model || !search_method) {
            return {
                isValid: false,
                errorMessage: t('nodes.knowledgeBase.retrievalSettingIsRequired', { ns: 'workflow' }),
            };
        }
        if (reranking_enable) {
            if (!reranking_model || !reranking_model.reranking_provider_name || !reranking_model.reranking_model_name) {
                return {
                    isValid: false,
                    errorMessage: t('nodes.knowledgeBase.rerankingModelIsRequired', { ns: 'workflow' }),
                };
            }
            else if (!currentRerankingModel) {
                return {
                    isValid: false,
                    errorMessage: t('nodes.knowledgeBase.rerankingModelIsInvalid', { ns: 'workflow' }),
                };
            }
        }
        return {
            isValid: true,
            errorMessage: '',
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx3RUFBd0U7QUFDeEUsMkRBQTJEO0FBQzNELDJEQUFpRTtBQUVqRSxNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFlLEVBQUM7SUFDL0IsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsaUJBQVMsQ0FBQyxhQUFhO0lBQzdCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLFdBQVcsRUFBRSxJQUFJO0NBQ2xCLENBQUMsQ0FBQTtBQUNGLE1BQU0sV0FBVyxHQUF1QztJQUN0RCxRQUFRO0lBQ1IsWUFBWSxFQUFFO1FBQ1osNkJBQTZCLEVBQUUsRUFBRTtRQUNqQyxjQUFjLEVBQUUsRUFBRTtRQUNsQixlQUFlLEVBQUU7WUFDZixLQUFLLEVBQUUsQ0FBQztZQUNSLHVCQUF1QixFQUFFLEtBQUs7WUFDOUIsZUFBZSxFQUFFLEdBQUc7U0FDckI7S0FDRjtJQUNELFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixNQUFNLEVBQ0osZUFBZSxFQUNmLGtCQUFrQixFQUNsQixlQUFlLEVBQ2YsZUFBZSxFQUNmLHdCQUF3QixFQUN4Qiw2QkFBNkIsRUFDN0IsbUJBQW1CLEVBQ25CLGdCQUFnQixHQUNqQixHQUFHLE9BQU8sQ0FBQTtRQUVYLE1BQU0sRUFDSixhQUFhLEVBQ2IsZ0JBQWdCLEVBQ2hCLGVBQWUsR0FDaEIsR0FBRyxlQUFlLElBQUksRUFBRSxDQUFBO1FBRXpCLE1BQU0sNkJBQTZCLEdBQUcsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyx3QkFBd0IsQ0FBQyxDQUFBO1FBQzNILE1BQU0scUJBQXFCLEdBQUcsNkJBQTZCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENB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QUFXLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGVEZWZhdWx0IH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEtub3dsZWRnZUJhc2VOb2RlVHlwZSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBJbmRleGluZ1R5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2NyZWF0ZS9zdGVwLXR3bydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5Ob2RlTWV0YURhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIHNvcnQ6IDMuMSxcbiAgdHlwZTogQmxvY2tFbnVtLktub3dsZWRnZUJhc2UsXG4gIGlzUmVxdWlyZWQ6IHRydWUsXG4gIGlzVW5kZWxldGFibGU6IHRydWUsXG4gIGlzU2luZ2xldG9uOiB0cnVlLFxuICBpc1R5cGVGaXhlZDogdHJ1ZSxcbn0pXG5jb25zdCBub2RlRGVmYXVsdDogTm9kZURlZmF1bHQ8S25vd2xlZGdlQmFzZU5vZGVUeXBlPiA9IHtcbiAgbWV0YURhdGEsXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIGluZGV4X2NodW5rX3ZhcmlhYmxlX3NlbGVjdG9yOiBbXSxcbiAgICBrZXl3b3JkX251bWJlcjogMTAsXG4gICAgcmV0cmlldmFsX21vZGVsOiB7XG4gICAgICB0b3BfazogMyxcbiAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBmYWxzZSxcbiAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgIH0sXG4gIH0sXG4gIGNoZWNrVmFsaWQocGF5bG9hZCwgdCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNodW5rX3N0cnVjdHVyZSxcbiAgICAgIGluZGV4aW5nX3RlY2huaXF1ZSxcbiAgICAgIHJldHJpZXZhbF9tb2RlbCxcbiAgICAgIGVtYmVkZGluZ19tb2RlbCxcbiAgICAgIGVtYmVkZGluZ19tb2RlbF9wcm92aWRlcixcbiAgICAgIGluZGV4X2NodW5rX3ZhcmlhYmxlX3NlbGVjdG9yLFxuICAgICAgX2VtYmVkZGluZ01vZGVsTGlzdCxcbiAgICAgIF9yZXJhbmtNb2RlbExpc3QsXG4gICAgfSA9IHBheWxvYWRcblxuICAgIGNvbnN0IHtcbiAgICAgIHNlYXJjaF9tZXRob2QsXG4gICAgICByZXJhbmtpbmdfZW5hYmxlLFxuICAgICAgcmVyYW5raW5nX21vZGVsLFxuICAgIH0gPSByZXRyaWV2YWxfbW9kZWwgfHwge31cblxuICAgIGNvbnN0IGN1cnJlbnRFbWJlZGRpbmdNb2RlbFByb3ZpZGVyID0gX2VtYmVkZGluZ01vZGVsTGlzdD8uZmluZChwcm92aWRlciA9PiBwcm92aWRlci5wcm92aWRlciA9PT0gZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyKVxuICAgIGNvbnN0IGN1cnJlbnRFbWJlZGRpbmdNb2RlbCA9IGN1cnJlbnRFbWJlZGRpbmdNb2RlbFByb3ZpZGVyPy5tb2RlbHMuZmluZChtb2RlbCA9PiBtb2RlbC5tb2RlbCA9PT0gZW1iZWRkaW5nX21vZGVsKVxuXG4gICAgY29uc3QgY3VycmVudFJlcmFua2luZ01vZGVsUHJvdmlkZXIgPSBfcmVyYW5rTW9kZWxMaXN0Py5maW5kKHByb3ZpZGVyID0+IHByb3ZpZGVyLnByb3ZpZGVyID09PSByZXJhbmtpbmdfbW9kZWw/LnJlcmFua2luZ19wcm92aWRlcl9uYW1lKVxuICAgIGNvbnN0IGN1cnJlbnRSZXJhbmtpbmdNb2RlbCA9IGN1cnJlbnRSZXJhbmtpbmdNb2RlbFByb3ZpZGVyPy5tb2RlbHMuZmluZChtb2RlbCA9PiBtb2RlbC5tb2RlbCA9PT0gcmVyYW5raW5nX21vZGVsPy5yZXJhbmtpbmdfbW9kZWxfbmFtZSlcblxuICAgIGlmICghY2h1bmtfc3RydWN0dXJlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdub2Rlcy5rbm93bGVkZ2VCYXNlLmNodW5rSXNSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGluZGV4X2NodW5rX3ZhcmlhYmxlX3NlbGVjdG9yLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgIGVycm9yTWVzc2FnZTogdCgnbm9kZXMua25vd2xlZGdlQmFzZS5jaHVua3NWYXJpYWJsZUlzUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaW5kZXhpbmdfdGVjaG5pcXVlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdub2Rlcy5rbm93bGVkZ2VCYXNlLmluZGV4TWV0aG9kSXNSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGluZGV4aW5nX3RlY2huaXF1ZSA9PT0gSW5kZXhpbmdUeXBlLlFVQUxJRklFRCkge1xuICAgICAgaWYgKCFlbWJlZGRpbmdfbW9kZWwgfHwgIWVtYmVkZGluZ19tb2RlbF9wcm92aWRlcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlzVmFsaWQ6IGZhbHNlLFxuICAgICAgICAgIGVycm9yTWVzc2FnZTogdCgnbm9kZXMua25vd2xlZGdlQmFzZS5lbWJlZGRpbmdNb2RlbElzUmVxdWlyZWQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghY3VycmVudEVtYmVkZGluZ01vZGVsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdub2Rlcy5rbm93bGVkZ2VCYXNlLmVtYmVkZGluZ01vZGVsSXNJbnZhbGlkJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghcmV0cmlldmFsX21vZGVsIHx8ICFzZWFyY2hfbWV0aG9kKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdub2Rlcy5rbm93bGVkZ2VCYXNlLnJldHJpZXZhbFNldHRpbmdJc1JlcXVpcmVkJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVyYW5raW5nX2VuYWJsZSkge1xuICAgICAgaWYgKCFyZXJhbmtpbmdfbW9kZWwgfHwgIXJlcmFua2luZ19tb2RlbC5yZXJhbmtpbmdfcHJvdmlkZXJfbmFtZSB8fCAhcmVyYW5raW5nX21vZGVsLnJlcmFua2luZ19tb2RlbF9uYW1lKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaXNWYWxpZDogZmFsc2UsXG4gICAgICAgICAgZXJyb3JNZXNzYWdlOiB0KCdub2Rlcy5rbm93bGVkZ2VCYXNlLnJlcmFua2luZ01vZGVsSXNSZXF1aXJlZCcsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFjdXJyZW50UmVyYW5raW5nTW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpc1ZhbGlkOiBmYWxzZSxcbiAgICAgICAgICBlcnJvck1lc3NhZ2U6IHQoJ25vZGVzLmtub3dsZWRnZUJhc2UucmVyYW5raW5nTW9kZWxJc0ludmFsaWQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlzVmFsaWQ6IHRydWUsXG4gICAgICBlcnJvck1lc3NhZ2U6ICcnLFxuICAgIH1cbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgbm9kZURlZmF1bHRcbiJdfQ==