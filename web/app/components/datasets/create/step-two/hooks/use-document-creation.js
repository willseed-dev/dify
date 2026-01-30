"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocumentCreation = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const amplitude_1 = require("@/app/components/base/amplitude");
const toast_1 = require("@/app/components/base/toast");
const check_rerank_model_1 = require("@/app/components/datasets/common/check-rerank-model");
const common_1 = require("@/models/common");
const datasets_1 = require("@/models/datasets");
const use_create_dataset_1 = require("@/service/knowledge/use-create-dataset");
const use_dataset_1 = require("@/service/knowledge/use-dataset");
const use_indexing_config_1 = require("./use-indexing-config");
const use_segmentation_state_1 = require("./use-segmentation-state");
const useDocumentCreation = (options) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { datasetId, isSetting, documentDetail, dataSourceType, files, notionPages, notionCredentialId, websitePages, crawlOptions, websiteCrawlProvider = common_1.DataSourceProvider.jinaReader, websiteCrawlJobId = '', onStepChange, updateIndexingTypeCache, updateResultCache, updateRetrievalMethodCache, onSave, mutateDatasetRes, } = options;
    const createFirstDocumentMutation = (0, use_create_dataset_1.useCreateFirstDocument)();
    const createDocumentMutation = (0, use_create_dataset_1.useCreateDocument)(datasetId);
    const invalidDatasetList = (0, use_dataset_1.useInvalidDatasetList)();
    const isCreating = createFirstDocumentMutation.isPending || createDocumentMutation.isPending;
    // Validate creation params
    const validateParams = (0, react_1.useCallback)((params) => {
        const { segmentationType, maxChunkLength, limitMaxChunkLength, overlap, indexType, embeddingModel, rerankModelList, retrievalConfig, } = params;
        if (segmentationType === 'general' && overlap > maxChunkLength) {
            toast_1.default.notify({ type: 'error', message: t('stepTwo.overlapCheck', { ns: 'datasetCreation' }) });
            return false;
        }
        if (segmentationType === 'general' && maxChunkLength > limitMaxChunkLength) {
            toast_1.default.notify({
                type: 'error',
                message: t('stepTwo.maxLengthCheck', { ns: 'datasetCreation', limit: limitMaxChunkLength }),
            });
            return false;
        }
        if (!isSetting) {
            if (indexType === use_indexing_config_1.IndexingType.QUALIFIED && (!embeddingModel.model || !embeddingModel.provider)) {
                toast_1.default.notify({
                    type: 'error',
                    message: t('datasetConfig.embeddingModelRequired', { ns: 'appDebug' }),
                });
                return false;
            }
            if (!(0, check_rerank_model_1.isReRankModelSelected)({
                rerankModelList,
                retrievalConfig,
                indexMethod: indexType,
            })) {
                toast_1.default.notify({ type: 'error', message: t('datasetConfig.rerankModelRequired', { ns: 'appDebug' }) });
                return false;
            }
        }
        return true;
    }, [t, isSetting]);
    // Build creation params
    const buildCreationParams = (0, react_1.useCallback)((currentDocForm, docLanguage, processRule, retrievalConfig, embeddingModel, indexingTechnique) => {
        if (isSetting) {
            return {
                original_document_id: documentDetail?.id,
                doc_form: currentDocForm,
                doc_language: docLanguage,
                process_rule: processRule,
                retrieval_model: retrievalConfig,
                embedding_model: embeddingModel.model,
                embedding_model_provider: embeddingModel.provider,
                indexing_technique: indexingTechnique,
            };
        }
        const params = {
            data_source: {
                type: dataSourceType,
                info_list: {
                    data_source_type: dataSourceType,
                },
            },
            indexing_technique: indexingTechnique,
            process_rule: processRule,
            doc_form: currentDocForm,
            doc_language: docLanguage,
            retrieval_model: retrievalConfig,
            embedding_model: embeddingModel.model,
            embedding_model_provider: embeddingModel.provider,
        };
        // Add data source specific info
        if (dataSourceType === datasets_1.DataSourceType.FILE) {
            params.data_source.info_list.file_info_list = {
                file_ids: files.map(file => file.id || '').filter(Boolean),
            };
        }
        if (dataSourceType === datasets_1.DataSourceType.NOTION)
            params.data_source.info_list.notion_info_list = (0, use_create_dataset_1.getNotionInfo)(notionPages, notionCredentialId);
        if (dataSourceType === datasets_1.DataSourceType.WEB) {
            params.data_source.info_list.website_info_list = (0, use_create_dataset_1.getWebsiteInfo)({
                websiteCrawlProvider,
                websiteCrawlJobId,
                websitePages,
                crawlOptions,
            });
        }
        return params;
    }, [
        isSetting,
        documentDetail,
        dataSourceType,
        files,
        notionPages,
        notionCredentialId,
        websitePages,
        websiteCrawlProvider,
        websiteCrawlJobId,
        crawlOptions,
    ]);
    // Execute creation
    const executeCreation = (0, react_1.useCallback)(async (params, indexType, retrievalConfig) => {
        if (!datasetId) {
            await createFirstDocumentMutation.mutateAsync(params, {
                onSuccess(data) {
                    updateIndexingTypeCache?.(indexType);
                    updateResultCache?.(data);
                    updateRetrievalMethodCache?.(retrievalConfig.search_method);
                },
            });
        }
        else {
            await createDocumentMutation.mutateAsync(params, {
                onSuccess(data) {
                    updateIndexingTypeCache?.(indexType);
                    updateResultCache?.(data);
                    updateRetrievalMethodCache?.(retrievalConfig.search_method);
                },
            });
        }
        mutateDatasetRes?.();
        invalidDatasetList();
        (0, amplitude_1.trackEvent)('create_datasets', {
            data_source_type: dataSourceType,
            indexing_technique: indexType,
        });
        onStepChange?.(+1);
        if (isSetting)
            onSave?.();
    }, [
        datasetId,
        createFirstDocumentMutation,
        createDocumentMutation,
        updateIndexingTypeCache,
        updateResultCache,
        updateRetrievalMethodCache,
        mutateDatasetRes,
        invalidDatasetList,
        dataSourceType,
        onStepChange,
        isSetting,
        onSave,
    ]);
    // Validate preview params
    const validatePreviewParams = (0, react_1.useCallback)((maxChunkLength) => {
        if (maxChunkLength > use_segmentation_state_1.MAXIMUM_CHUNK_TOKEN_LENGTH) {
            toast_1.default.notify({
                type: 'error',
                message: t('stepTwo.maxLengthCheck', { ns: 'datasetCreation', limit: use_segmentation_state_1.MAXIMUM_CHUNK_TOKEN_LENGTH }),
            });
            return false;
        }
        return true;
    }, [t]);
    return {
        isCreating,
        validateParams,
        buildCreationParams,
        executeCreation,
        validatePreviewParams,
    };
};
exports.useDocumentCreation = useDocumentCreation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWRvY3VtZW50LWNyZWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWRvY3VtZW50LWNyZWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWFBLGlDQUFtQztBQUNuQyxpREFBOEM7QUFDOUMsK0RBQTREO0FBQzVELHVEQUErQztBQUMvQyw0RkFBMkY7QUFDM0YsNENBQW9EO0FBQ3BELGdEQUUwQjtBQUMxQiwrRUFBaUk7QUFDakksaUVBQXVFO0FBQ3ZFLCtEQUFvRDtBQUNwRCxxRUFBcUU7QUFrQzlELE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxPQUFtQyxFQUFFLEVBQUU7SUFDekUsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sRUFDSixTQUFTLEVBQ1QsU0FBUyxFQUNULGNBQWMsRUFDZCxjQUFjLEVBQ2QsS0FBSyxFQUNMLFdBQVcsRUFDWCxrQkFBa0IsRUFDbEIsWUFBWSxFQUNaLFlBQVksRUFDWixvQkFBb0IsR0FBRywyQkFBa0IsQ0FBQyxVQUFVLEVBQ3BELGlCQUFpQixHQUFHLEVBQUUsRUFDdEIsWUFBWSxFQUNaLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsMEJBQTBCLEVBQzFCLE1BQU0sRUFDTixnQkFBZ0IsR0FDakIsR0FBRyxPQUFPLENBQUE7SUFFWCxNQUFNLDJCQUEyQixHQUFHLElBQUEsMkNBQXNCLEdBQUUsQ0FBQTtJQUM1RCxNQUFNLHNCQUFzQixHQUFHLElBQUEsc0NBQWlCLEVBQUMsU0FBVSxDQUFDLENBQUE7SUFDNUQsTUFBTSxrQkFBa0IsR0FBRyxJQUFBLG1DQUFxQixHQUFFLENBQUE7SUFFbEQsTUFBTSxVQUFVLEdBQUcsMkJBQTJCLENBQUMsU0FBUyxJQUFJLHNCQUFzQixDQUFDLFNBQVMsQ0FBQTtJQUU1RiwyQkFBMkI7SUFDM0IsTUFBTSxjQUFjLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBd0IsRUFBVyxFQUFF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QUNULE1BQU07S0FDUCxDQUFDLENBQUE7SUFFRiwwQkFBMEI7SUFDMUIsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxjQUFzQixFQUFXLEVBQUU7UUFDNUUsSUFBSSxjQUFjLEdBQUcsbURBQTBCLEVBQUUsQ0FBQztZQUNoRCxlQUFLLENBQUMsTUFBTSxDQUFDO2dCQUNYLElBQUksRUFBRSxPQUFPO2dCQUNiLE9BQU8sRUFBRSxDQUFDLENBQUMsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLG1EQUEwQixFQUFFLENBQUM7YUFDbkcsQ0FBQyxDQUFBO1lBQ0YsT0FBTyxLQUFLLENBQUE7UUFDZCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRVAsT0FBTztRQUNMLFVBQVU7UUFDVixjQUFjO1FBQ2QsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixxQkFBcUI7S0FDdEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQXpOWSxRQUFBLG1CQUFtQix1QkF5Ti9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBEZWZhdWx0TW9kZWwsIE1vZGVsIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHR5cGUgeyBOb3Rpb25QYWdlIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHR5cGUge1xuICBDaHVua2luZ01vZGUsXG4gIENyYXdsT3B0aW9ucyxcbiAgQ3Jhd2xSZXN1bHRJdGVtLFxuICBDcmVhdGVEb2N1bWVudFJlcSxcbiAgY3JlYXRlRG9jdW1lbnRSZXNwb25zZSxcbiAgQ3VzdG9tRmlsZSxcbiAgRnVsbERvY3VtZW50RGV0YWlsLFxuICBQcm9jZXNzUnVsZSxcbn0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7IFJldHJpZXZhbENvbmZpZywgUkVUUklFVkVfTUVUSE9EIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdHJhY2tFdmVudCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hbXBsaXR1ZGUnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgaXNSZVJhbmtNb2RlbFNlbGVjdGVkIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9jb21tb24vY2hlY2stcmVyYW5rLW1vZGVsJ1xuaW1wb3J0IHsgRGF0YVNvdXJjZVByb3ZpZGVyIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHtcbiAgRGF0YVNvdXJjZVR5cGUsXG59IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgZ2V0Tm90aW9uSW5mbywgZ2V0V2Vic2l0ZUluZm8sIHVzZUNyZWF0ZURvY3VtZW50LCB1c2VDcmVhdGVGaXJzdERvY3VtZW50IH0gZnJvbSAnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtY3JlYXRlLWRhdGFzZXQnXG5pbXBvcnQgeyB1c2VJbnZhbGlkRGF0YXNldExpc3QgfSBmcm9tICdAL3NlcnZpY2Uva25vd2xlZGdlL3VzZS1kYXRhc2V0J1xuaW1wb3J0IHsgSW5kZXhpbmdUeXBlIH0gZnJvbSAnLi91c2UtaW5kZXhpbmctY29uZmlnJ1xuaW1wb3J0IHsgTUFYSU1VTV9DSFVOS19UT0tFTl9MRU5HVEggfSBmcm9tICcuL3VzZS1zZWdtZW50YXRpb24tc3RhdGUnXG5cbmV4cG9ydCB0eXBlIFVzZURvY3VtZW50Q3JlYXRpb25PcHRpb25zID0ge1xuICBkYXRhc2V0SWQ/OiBzdHJpbmdcbiAgaXNTZXR0aW5nPzogYm9vbGVhblxuICBkb2N1bWVudERldGFpbD86IEZ1bGxEb2N1bWVudERldGFpbFxuICBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGVcbiAgZmlsZXM6IEN1c3RvbUZpbGVbXVxuICBub3Rpb25QYWdlczogTm90aW9uUGFnZVtdXG4gIG5vdGlvbkNyZWRlbnRpYWxJZDogc3RyaW5nXG4gIHdlYnNpdGVQYWdlczogQ3Jhd2xSZXN1bHRJdGVtW11cbiAgY3Jhd2xPcHRpb25zPzogQ3Jhd2xPcHRpb25zXG4gIHdlYnNpdGVDcmF3bFByb3ZpZGVyPzogRGF0YVNvdXJjZVByb3ZpZGVyXG4gIHdlYnNpdGVDcmF3bEpvYklkPzogc3RyaW5nXG4gIC8vIENhbGxiYWNrc1xuICBvblN0ZXBDaGFuZ2U/OiAoZGVsdGE6IG51bWJlcikgPT4gdm9pZFxuICB1cGRhdGVJbmRleGluZ1R5cGVDYWNoZT86ICh0eXBlOiBzdHJpbmcpID0+IHZvaWRcbiAgdXBkYXRlUmVzdWx0Q2FjaGU/OiAocmVzOiBjcmVhdGVEb2N1bWVudFJlc3BvbnNlKSA9PiB2b2lkXG4gIHVwZGF0ZVJldHJpZXZhbE1ldGhvZENhY2hlPzogKG1ldGhvZDogUkVUUklFVkVfTUVUSE9EIHwgJycpID0+IHZvaWRcbiAgb25TYXZlPzogKCkgPT4gdm9pZFxuICBtdXRhdGVEYXRhc2V0UmVzPzogKCkgPT4gdm9pZFxufVxuXG5leHBvcnQgdHlwZSBWYWxpZGF0aW9uUGFyYW1zID0ge1xuICBzZWdtZW50YXRpb25UeXBlOiBzdHJpbmdcbiAgbWF4Q2h1bmtMZW5ndGg6IG51bWJlclxuICBsaW1pdE1heENodW5rTGVuZ3RoOiBudW1iZXJcbiAgb3ZlcmxhcDogbnVtYmVyXG4gIGluZGV4VHlwZTogSW5kZXhpbmdUeXBlXG4gIGVtYmVkZGluZ01vZGVsOiBEZWZhdWx0TW9kZWxcbiAgcmVyYW5rTW9kZWxMaXN0OiBNb2RlbFtdXG4gIHJldHJpZXZhbENvbmZpZzogUmV0cmlldmFsQ29uZmlnXG59XG5cbmV4cG9ydCBjb25zdCB1c2VEb2N1bWVudENyZWF0aW9uID0gKG9wdGlvbnM6IFVzZURvY3VtZW50Q3JlYXRpb25PcHRpb25zKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7XG4gICAgZGF0YXNldElkLFxuICAgIGlzU2V0dGluZyxcbiAgICBkb2N1bWVudERldGFpbCxcbiAgICBkYXRhU291cmNlVHlwZSxcbiAgICBmaWxlcyxcbiAgICBub3Rpb25QYWdlcyxcbiAgICBub3Rpb25DcmVkZW50aWFsSWQsXG4gICAgd2Vic2l0ZVBhZ2VzLFxuICAgIGNyYXdsT3B0aW9ucyxcbiAgICB3ZWJzaXRlQ3Jhd2xQcm92aWRlciA9IERhdGFTb3VyY2VQcm92aWRlci5qaW5hUmVhZGVyLFxuICAgIHdlYnNpdGVDcmF3bEpvYklkID0gJycsXG4gICAgb25TdGVwQ2hhbmdlLFxuICAgIHVwZGF0ZUluZGV4aW5nVHlwZUNhY2hlLFxuICAgIHVwZGF0ZVJlc3VsdENhY2hlLFxuICAgIHVwZGF0ZVJldHJpZXZhbE1ldGhvZENhY2hlLFxuICAgIG9uU2F2ZSxcbiAgICBtdXRhdGVEYXRhc2V0UmVzLFxuICB9ID0gb3B0aW9uc1xuXG4gIGNvbnN0IGNyZWF0ZUZpcnN0RG9jdW1lbnRNdXRhdGlvbiA9IHVzZUNyZWF0ZUZpcnN0RG9jdW1lbnQoKVxuICBjb25zdCBjcmVhdGVEb2N1bWVudE11dGF0aW9uID0gdXNlQ3JlYXRlRG9jdW1lbnQoZGF0YXNldElkISlcbiAgY29uc3QgaW52YWxpZERhdGFzZXRMaXN0ID0gdXNlSW52YWxpZERhdGFzZXRMaXN0KClcblxuICBjb25zdCBpc0NyZWF0aW5nID0gY3JlYXRlRmlyc3REb2N1bWVudE11dGF0aW9uLmlzUGVuZGluZyB8fCBjcmVhdGVEb2N1bWVudE11dGF0aW9uLmlzUGVuZGluZ1xuXG4gIC8vIFZhbGlkYXRlIGNyZWF0aW9uIHBhcmFtc1xuICBjb25zdCB2YWxpZGF0ZVBhcmFtcyA9IHVzZUNhbGxiYWNrKChwYXJhbXM6IFZhbGlkYXRpb25QYXJhbXMpOiBib29sZWFuID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBzZWdtZW50YXRpb25UeXBlLFxuICAgICAgbWF4Q2h1bmtMZW5ndGgsXG4gICAgICBsaW1pdE1heENodW5rTGVuZ3RoLFxuICAgICAgb3ZlcmxhcCxcbiAgICAgIGluZGV4VHlwZSxcbiAgICAgIGVtYmVkZGluZ01vZGVsLFxuICAgICAgcmVyYW5rTW9kZWxMaXN0LFxuICAgICAgcmV0cmlldmFsQ29uZmlnLFxuICAgIH0gPSBwYXJhbXNcblxuICAgIGlmIChzZWdtZW50YXRpb25UeXBlID09PSAnZ2VuZXJhbCcgJiYgb3ZlcmxhcCA+IG1heENodW5rTGVuZ3RoKSB7XG4gICAgICBUb2FzdC5ub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiB0KCdzdGVwVHdvLm92ZXJsYXBDaGVjaycsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoc2VnbWVudGF0aW9uVHlwZSA9PT0gJ2dlbmVyYWwnICYmIG1heENodW5rTGVuZ3RoID4gbGltaXRNYXhDaHVua0xlbmd0aCkge1xuICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogdCgnc3RlcFR3by5tYXhMZW5ndGhDaGVjaycsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nLCBsaW1pdDogbGltaXRNYXhDaHVua0xlbmd0aCB9KSxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAoIWlzU2V0dGluZykge1xuICAgICAgaWYgKGluZGV4VHlwZSA9PT0gSW5kZXhpbmdUeXBlLlFVQUxJRklFRCAmJiAoIWVtYmVkZGluZ01vZGVsLm1vZGVsIHx8ICFlbWJlZGRpbmdNb2RlbC5wcm92aWRlcikpIHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IHQoJ2RhdGFzZXRDb25maWcuZW1iZWRkaW5nTW9kZWxSZXF1aXJlZCcsIHsgbnM6ICdhcHBEZWJ1ZycgfSksXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoIWlzUmVSYW5rTW9kZWxTZWxlY3RlZCh7XG4gICAgICAgIHJlcmFua01vZGVsTGlzdCxcbiAgICAgICAgcmV0cmlldmFsQ29uZmlnLFxuICAgICAgICBpbmRleE1ldGhvZDogaW5kZXhUeXBlLFxuICAgICAgfSkpIHtcbiAgICAgICAgVG9hc3Qubm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnZGF0YXNldENvbmZpZy5yZXJhbmtNb2RlbFJlcXVpcmVkJywgeyBuczogJ2FwcERlYnVnJyB9KSB9KVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9LCBbdCwgaXNTZXR0aW5nXSlcblxuICAvLyBCdWlsZCBjcmVhdGlvbiBwYXJhbXNcbiAgY29uc3QgYnVpbGRDcmVhdGlvblBhcmFtcyA9IHVzZUNhbGxiYWNrKChcbiAgICBjdXJyZW50RG9jRm9ybTogQ2h1bmtpbmdNb2RlLFxuICAgIGRvY0xhbmd1YWdlOiBzdHJpbmcsXG4gICAgcHJvY2Vzc1J1bGU6IFByb2Nlc3NSdWxlLFxuICAgIHJldHJpZXZhbENvbmZpZzogUmV0cmlldmFsQ29uZmlnLFxuICAgIGVtYmVkZGluZ01vZGVsOiBEZWZhdWx0TW9kZWwsXG4gICAgaW5kZXhpbmdUZWNobmlxdWU6IHN0cmluZyxcbiAgKTogQ3JlYXRlRG9jdW1lbnRSZXEgfCBudWxsID0+IHtcbiAgICBpZiAoaXNTZXR0aW5nKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvcmlnaW5hbF9kb2N1bWVudF9pZDogZG9jdW1lbnREZXRhaWw/LmlkLFxuICAgICAgICBkb2NfZm9ybTogY3VycmVudERvY0Zvcm0sXG4gICAgICAgIGRvY19sYW5ndWFnZTogZG9jTGFuZ3VhZ2UsXG4gICAgICAgIHByb2Nlc3NfcnVsZTogcHJvY2Vzc1J1bGUsXG4gICAgICAgIHJldHJpZXZhbF9tb2RlbDogcmV0cmlldmFsQ29uZmlnLFxuICAgICAgICBlbWJlZGRpbmdfbW9kZWw6IGVtYmVkZGluZ01vZGVsLm1vZGVsLFxuICAgICAgICBlbWJlZGRpbmdfbW9kZWxfcHJvdmlkZXI6IGVtYmVkZGluZ01vZGVsLnByb3ZpZGVyLFxuICAgICAgICBpbmRleGluZ190ZWNobmlxdWU6IGluZGV4aW5nVGVjaG5pcXVlLFxuICAgICAgfSBhcyBDcmVhdGVEb2N1bWVudFJlcVxuICAgIH1cblxuICAgIGNvbnN0IHBhcmFtczogQ3JlYXRlRG9jdW1lbnRSZXEgPSB7XG4gICAgICBkYXRhX3NvdXJjZToge1xuICAgICAgICB0eXBlOiBkYXRhU291cmNlVHlwZSxcbiAgICAgICAgaW5mb19saXN0OiB7XG4gICAgICAgICAgZGF0YV9zb3VyY2VfdHlwZTogZGF0YVNvdXJjZVR5cGUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaW5kZXhpbmdfdGVjaG5pcXVlOiBpbmRleGluZ1RlY2huaXF1ZSxcbiAgICAgIHByb2Nlc3NfcnVsZTogcHJvY2Vzc1J1bGUsXG4gICAgICBkb2NfZm9ybTogY3VycmVudERvY0Zvcm0sXG4gICAgICBkb2NfbGFuZ3VhZ2U6IGRvY0xhbmd1YWdlLFxuICAgICAgcmV0cmlldmFsX21vZGVsOiByZXRyaWV2YWxDb25maWcsXG4gICAgICBlbWJlZGRpbmdfbW9kZWw6IGVtYmVkZGluZ01vZGVsLm1vZGVsLFxuICAgICAgZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyOiBlbWJlZGRpbmdNb2RlbC5wcm92aWRlcixcbiAgICB9IGFzIENyZWF0ZURvY3VtZW50UmVxXG5cbiAgICAvLyBBZGQgZGF0YSBzb3VyY2Ugc3BlY2lmaWMgaW5mb1xuICAgIGlmIChkYXRhU291cmNlVHlwZSA9PT0gRGF0YVNvdXJjZVR5cGUuRklMRSkge1xuICAgICAgcGFyYW1zLmRhdGFfc291cmNlIS5pbmZvX2xpc3QuZmlsZV9pbmZvX2xpc3QgPSB7XG4gICAgICAgIGZpbGVfaWRzOiBmaWxlcy5tYXAoZmlsZSA9PiBmaWxlLmlkIHx8ICcnKS5maWx0ZXIoQm9vbGVhbiksXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkYXRhU291cmNlVHlwZSA9PT0gRGF0YVNvdXJjZVR5cGUuTk9USU9OKVxuICAgICAgcGFyYW1zLmRhdGFfc291cmNlIS5pbmZvX2xpc3Qubm90aW9uX2luZm9fbGlzdCA9IGdldE5vdGlvbkluZm8obm90aW9uUGFnZXMsIG5vdGlvbkNyZWRlbnRpYWxJZClcblxuICAgIGlmIChkYXRhU291cmNlVHlwZSA9PT0gRGF0YVNvdXJjZVR5cGUuV0VCKSB7XG4gICAgICBwYXJhbXMuZGF0YV9zb3VyY2UhLmluZm9fbGlzdC53ZWJzaXRlX2luZm9fbGlzdCA9IGdldFdlYnNpdGVJbmZvKHtcbiAgICAgICAgd2Vic2l0ZUNyYXdsUHJvdmlkZXIsXG4gICAgICAgIHdlYnNpdGVDcmF3bEpvYklkLFxuICAgICAgICB3ZWJzaXRlUGFnZXMsXG4gICAgICAgIGNyYXdsT3B0aW9ucyxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcmFtc1xuICB9LCBbXG4gICAgaXNTZXR0aW5nLFxuICAgIGRvY3VtZW50RGV0YWlsLFxuICAgIGRhdGFTb3VyY2VUeXBlLFxuICAgIGZpbGVzLFxuICAgIG5vdGlvblBhZ2VzLFxuICAgIG5vdGlvbkNyZWRlbnRpYWxJZCxcbiAgICB3ZWJzaXRlUGFnZXMsXG4gICAgd2Vic2l0ZUNyYXdsUHJvdmlkZXIsXG4gICAgd2Vic2l0ZUNyYXdsSm9iSWQsXG4gICAgY3Jhd2xPcHRpb25zLFxuICBdKVxuXG4gIC8vIEV4ZWN1dGUgY3JlYXRpb25cbiAgY29uc3QgZXhlY3V0ZUNyZWF0aW9uID0gdXNlQ2FsbGJhY2soYXN5bmMgKFxuICAgIHBhcmFtczogQ3JlYXRlRG9jdW1lbnRSZXEsXG4gICAgaW5kZXhUeXBlOiBJbmRleGluZ1R5cGUsXG4gICAgcmV0cmlldmFsQ29uZmlnOiBSZXRyaWV2YWxDb25maWcsXG4gICkgPT4ge1xuICAgIGlmICghZGF0YXNldElkKSB7XG4gICAgICBhd2FpdCBjcmVhdGVGaXJzdERvY3VtZW50TXV0YXRpb24ubXV0YXRlQXN5bmMocGFyYW1zLCB7XG4gICAgICAgIG9uU3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgdXBkYXRlSW5kZXhpbmdUeXBlQ2FjaGU/LihpbmRleFR5cGUpXG4gICAgICAgICAgdXBkYXRlUmVzdWx0Q2FjaGU/LihkYXRhKVxuICAgICAgICAgIHVwZGF0ZVJldHJpZXZhbE1ldGhvZENhY2hlPy4ocmV0cmlldmFsQ29uZmlnLnNlYXJjaF9tZXRob2QgYXMgUkVUUklFVkVfTUVUSE9EKVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBhd2FpdCBjcmVhdGVEb2N1bWVudE11dGF0aW9uLm11dGF0ZUFzeW5jKHBhcmFtcywge1xuICAgICAgICBvblN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgIHVwZGF0ZUluZGV4aW5nVHlwZUNhY2hlPy4oaW5kZXhUeXBlKVxuICAgICAgICAgIHVwZGF0ZVJlc3VsdENhY2hlPy4oZGF0YSlcbiAgICAgICAgICB1cGRhdGVSZXRyaWV2YWxNZXRob2RDYWNoZT8uKHJldHJpZXZhbENvbmZpZy5zZWFyY2hfbWV0aG9kIGFzIFJFVFJJRVZFX01FVEhPRClcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbXV0YXRlRGF0YXNldFJlcz8uKClcbiAgICBpbnZhbGlkRGF0YXNldExpc3QoKVxuXG4gICAgdHJhY2tFdmVudCgnY3JlYXRlX2RhdGFzZXRzJywge1xuICAgICAgZGF0YV9zb3VyY2VfdHlwZTogZGF0YVNvdXJjZVR5cGUsXG4gICAgICBpbmRleGluZ190ZWNobmlxdWU6IGluZGV4VHlwZSxcbiAgICB9KVxuXG4gICAgb25TdGVwQ2hhbmdlPy4oKzEpXG5cbiAgICBpZiAoaXNTZXR0aW5nKVxuICAgICAgb25TYXZlPy4oKVxuICB9LCBbXG4gICAgZGF0YXNldElkLFxuICAgIGNyZWF0ZUZpcnN0RG9jdW1lbnRNdXRhdGlvbixcbiAgICBjcmVhdGVEb2N1bWVudE11dGF0aW9uLFxuICAgIHVwZGF0ZUluZGV4aW5nVHlwZUNhY2hlLFxuICAgIHVwZGF0ZVJlc3VsdENhY2hlLFxuICAgIHVwZGF0ZVJldHJpZXZhbE1ldGhvZENhY2hlLFxuICAgIG11dGF0ZURhdGFzZXRSZXMsXG4gICAgaW52YWxpZERhdGFzZXRMaXN0LFxuICAgIGRhdGFTb3VyY2VUeXBlLFxuICAgIG9uU3RlcENoYW5nZSxcbiAgICBpc1NldHRpbmcsXG4gICAgb25TYXZlLFxuICBdKVxuXG4gIC8vIFZhbGlkYXRlIHByZXZpZXcgcGFyYW1zXG4gIGNvbnN0IHZhbGlkYXRlUHJldmlld1BhcmFtcyA9IHVzZUNhbGxiYWNrKChtYXhDaHVua0xlbmd0aDogbnVtYmVyKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKG1heENodW5rTGVuZ3RoID4gTUFYSU1VTV9DSFVOS19UT0tFTl9MRU5HVEgpIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6IHQoJ3N0ZXBUd28ubWF4TGVuZ3RoQ2hlY2snLCB7IG5zOiAnZGF0YXNldENyZWF0aW9uJywgbGltaXQ6IE1BWElNVU1fQ0hVTktfVE9LRU5fTEVOR1RIIH0pLFxuICAgICAgfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9LCBbdF0pXG5cbiAgcmV0dXJuIHtcbiAgICBpc0NyZWF0aW5nLFxuICAgIHZhbGlkYXRlUGFyYW1zLFxuICAgIGJ1aWxkQ3JlYXRpb25QYXJhbXMsXG4gICAgZXhlY3V0ZUNyZWF0aW9uLFxuICAgIHZhbGlkYXRlUHJldmlld1BhcmFtcyxcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBEb2N1bWVudENyZWF0aW9uID0gUmV0dXJuVHlwZTx0eXBlb2YgdXNlRG9jdW1lbnRDcmVhdGlvbj5cbiJdfQ==