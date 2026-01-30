"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const config_1 = require("@/config");
const app_1 = require("@/types/app");
const utils_2 = require("./utils");
const i18nPrefix = '';
const metaData = (0, utils_1.genNodeMetaData)({
    sort: 2,
    type: types_1.BlockEnum.KnowledgeRetrieval,
});
const nodeDefault = {
    metaData,
    defaultValue: {
        query_variable_selector: [],
        query_attachment_selector: [],
        dataset_ids: [],
        retrieval_mode: app_1.RETRIEVE_TYPE.multiWay,
        multiple_retrieval_config: {
            top_k: config_1.DATASET_DEFAULT.top_k,
            score_threshold: undefined,
            reranking_enable: false,
        },
    },
    checkValid(payload, t) {
        let errorMessages = '';
        if (!errorMessages && (!payload.dataset_ids || payload.dataset_ids.length === 0))
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}nodes.knowledgeRetrieval.knowledge`, { ns: 'workflow' }) });
        if (!errorMessages && payload.retrieval_mode === app_1.RETRIEVE_TYPE.oneWay && !payload.single_retrieval_config?.model?.provider)
            errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t('modelProvider.systemReasoningModel.key', { ns: 'common' }) });
        const { _datasets, multiple_retrieval_config, retrieval_mode } = payload;
        if (retrieval_mode === app_1.RETRIEVE_TYPE.multiWay) {
            const checked = (0, utils_2.checkoutRerankModelConfiguredInRetrievalSettings)(_datasets || [], multiple_retrieval_config);
            if (!errorMessages && !checked)
                errorMessages = t(`${i18nPrefix}errorMsg.fieldRequired`, { ns: 'workflow', field: t(`${i18nPrefix}errorMsg.fields.rerankModel`, { ns: 'workflow' }) });
        }
        return {
            isValid: !errorMessages,
            errorMessage: errorMessages,
        };
    },
};
exports.default = nodeDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlZmF1bHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwyREFBMkQ7QUFDM0QsMkRBQWlFO0FBQ2pFLHFDQUEwQztBQUMxQyxxQ0FBMkM7QUFDM0MsbUNBQTBFO0FBRTFFLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQTtBQUVyQixNQUFNLFFBQVEsR0FBRyxJQUFBLHVCQUFlLEVBQUM7SUFDL0IsSUFBSSxFQUFFLENBQUM7SUFDUCxJQUFJLEVBQUUsaUJBQVMsQ0FBQyxrQkFBa0I7Q0FDbkMsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxXQUFXLEdBQTRDO0lBQzNELFFBQVE7SUFDUixZQUFZLEVBQUU7UUFDWix1QkFBdUIsRUFBRSxFQUFFO1FBQzNCLHlCQUF5QixFQUFFLEVBQUU7UUFDN0IsV0FBVyxFQUFFLEVBQUU7UUFDZixjQUFjLEVBQUUsbUJBQWEsQ0FBQyxRQUFRO1FBQ3RDLHlCQUF5QixFQUFFO1lBQ3pCLEtBQUssRUFBRSx3QkFBZSxDQUFDLEtBQUs7WUFDNUIsZUFBZSxFQUFFLFNBQVM7WUFDMUIsZ0JBQWdCLEVBQUUsS0FBSztTQUN4QjtLQUNGO0lBQ0QsVUFBVSxDQUFDLE9BQW1DLEVBQUUsQ0FBTTtRQUNwRCxJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUE7UUFFdEIsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7WUFDOUUsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxVQUFVLG9DQUFvQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRS9KLElBQUksQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDLGNBQWMsS0FBSyxtQkFBYSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLEVBQUUsUUFBUTtZQUN4SCxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyx3Q0FBd0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUVwSixNQUFNLEVBQUUsU0FBUyxFQUFFLHlCQUF5QixFQUFFLGNBQWMsRUFBRSxHQUFHLE9BQU8sQ0FBQTtRQUN4RSxJQUFJLGNBQWMsS0FBSyxtQkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzlDLE1BQU0sT0FBTyxHQUFHLElBQUEsd0RBQWdELEVBQUMsU0FBUyxJQUFJLEVBQUUsRUFBRSx5QkFBeUIsQ0FBQyxDQUFBO1lBRTVHLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxPQUFPO2dCQUM1QixhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSx3QkFBd0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLFVBQVUsNkJBQTZCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDMUosQ0FBQztRQUVELE9BQU87WUFDTCxPQUFPLEVBQUUsQ0FBQyxhQUFhO1lBQ3ZCLFlBQVksRUFBRSxhQUFhO1NBQzVCLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZURlZmF1bHQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgS25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGdlbk5vZGVNZXRhRGF0YSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMnXG5pbXBvcnQgeyBEQVRBU0VUX0RFRkFVTFQgfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IFJFVFJJRVZFX1RZUEUgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IGNoZWNrb3V0UmVyYW5rTW9kZWxDb25maWd1cmVkSW5SZXRyaWV2YWxTZXR0aW5ncyB9IGZyb20gJy4vdXRpbHMnXG5cbmNvbnN0IGkxOG5QcmVmaXggPSAnJ1xuXG5jb25zdCBtZXRhRGF0YSA9IGdlbk5vZGVNZXRhRGF0YSh7XG4gIHNvcnQ6IDIsXG4gIHR5cGU6IEJsb2NrRW51bS5Lbm93bGVkZ2VSZXRyaWV2YWwsXG59KVxuY29uc3Qgbm9kZURlZmF1bHQ6IE5vZGVEZWZhdWx0PEtub3dsZWRnZVJldHJpZXZhbE5vZGVUeXBlPiA9IHtcbiAgbWV0YURhdGEsXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIHF1ZXJ5X3ZhcmlhYmxlX3NlbGVjdG9yOiBbXSxcbiAgICBxdWVyeV9hdHRhY2htZW50X3NlbGVjdG9yOiBbXSxcbiAgICBkYXRhc2V0X2lkczogW10sXG4gICAgcmV0cmlldmFsX21vZGU6IFJFVFJJRVZFX1RZUEUubXVsdGlXYXksXG4gICAgbXVsdGlwbGVfcmV0cmlldmFsX2NvbmZpZzoge1xuICAgICAgdG9wX2s6IERBVEFTRVRfREVGQVVMVC50b3BfayxcbiAgICAgIHNjb3JlX3RocmVzaG9sZDogdW5kZWZpbmVkLFxuICAgICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbiAgY2hlY2tWYWxpZChwYXlsb2FkOiBLbm93bGVkZ2VSZXRyaWV2YWxOb2RlVHlwZSwgdDogYW55KSB7XG4gICAgbGV0IGVycm9yTWVzc2FnZXMgPSAnJ1xuXG4gICAgaWYgKCFlcnJvck1lc3NhZ2VzICYmICghcGF5bG9hZC5kYXRhc2V0X2lkcyB8fCBwYXlsb2FkLmRhdGFzZXRfaWRzLmxlbmd0aCA9PT0gMCkpXG4gICAgICBlcnJvck1lc3NhZ2VzID0gdChgJHtpMThuUHJlZml4fWVycm9yTXNnLmZpZWxkUmVxdWlyZWRgLCB7IG5zOiAnd29ya2Zsb3cnLCBmaWVsZDogdChgJHtpMThuUHJlZml4fW5vZGVzLmtub3dsZWRnZVJldHJpZXZhbC5rbm93bGVkZ2VgLCB7IG5zOiAnd29ya2Zsb3cnIH0pIH0pXG5cbiAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgcGF5bG9hZC5yZXRyaWV2YWxfbW9kZSA9PT0gUkVUUklFVkVfVFlQRS5vbmVXYXkgJiYgIXBheWxvYWQuc2luZ2xlX3JldHJpZXZhbF9jb25maWc/Lm1vZGVsPy5wcm92aWRlcilcbiAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KCdtb2RlbFByb3ZpZGVyLnN5c3RlbVJlYXNvbmluZ01vZGVsLmtleScsIHsgbnM6ICdjb21tb24nIH0pIH0pXG5cbiAgICBjb25zdCB7IF9kYXRhc2V0cywgbXVsdGlwbGVfcmV0cmlldmFsX2NvbmZpZywgcmV0cmlldmFsX21vZGUgfSA9IHBheWxvYWRcbiAgICBpZiAocmV0cmlldmFsX21vZGUgPT09IFJFVFJJRVZFX1RZUEUubXVsdGlXYXkpIHtcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSBjaGVja291dFJlcmFua01vZGVsQ29uZmlndXJlZEluUmV0cmlldmFsU2V0dGluZ3MoX2RhdGFzZXRzIHx8IFtdLCBtdWx0aXBsZV9yZXRyaWV2YWxfY29uZmlnKVxuXG4gICAgICBpZiAoIWVycm9yTWVzc2FnZXMgJiYgIWNoZWNrZWQpXG4gICAgICAgIGVycm9yTWVzc2FnZXMgPSB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRSZXF1aXJlZGAsIHsgbnM6ICd3b3JrZmxvdycsIGZpZWxkOiB0KGAke2kxOG5QcmVmaXh9ZXJyb3JNc2cuZmllbGRzLnJlcmFua01vZGVsYCwgeyBuczogJ3dvcmtmbG93JyB9KSB9KVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBpc1ZhbGlkOiAhZXJyb3JNZXNzYWdlcyxcbiAgICAgIGVycm9yTWVzc2FnZTogZXJyb3JNZXNzYWdlcyxcbiAgICB9XG4gIH0sXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVEZWZhdWx0XG4iXX0=