"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDatasourceSingleRun = exports.useConvertDatasetToPipeline = exports.usePreviewOnlineDocument = exports.usePipelineExecutionLog = exports.usePublishAsCustomizedPipeline = exports.useExportPipelineDSL = exports.usePublishedPipelinePreProcessingParams = exports.useDraftPipelinePreProcessingParams = exports.useUpdateDataSourceCredentials = exports.useDataSourceCredentials = exports.useRunPublishedPipeline = exports.usePublishedPipelineInfo = exports.publishedPipelineInfoQueryKeyPrefix = exports.useInvalidDataSourceList = exports.useDataSourceList = exports.usePublishedPipelineProcessingParams = exports.useDraftPipelineProcessingParams = exports.useCheckPipelineDependencies = exports.useImportPipelineDSLConfirm = exports.useImportPipelineDSL = exports.useExportTemplateDSL = exports.useDeleteTemplate = exports.useUpdateTemplateInfo = exports.usePipelineTemplateById = exports.useInvalidCustomizedTemplateList = exports.usePipelineTemplateList = exports.PipelineTemplateListQueryKeyPrefix = void 0;
const react_query_1 = require("@tanstack/react-query");
const pipeline_1 = require("@/models/pipeline");
const base_1 = require("./base");
const use_base_1 = require("./use-base");
const NAME_SPACE = 'pipeline';
exports.PipelineTemplateListQueryKeyPrefix = [NAME_SPACE, 'template-list'];
const usePipelineTemplateList = (params, enabled = true) => {
    return (0, react_query_1.useQuery)({
        queryKey: [...exports.PipelineTemplateListQueryKeyPrefix, params],
        queryFn: () => {
            return (0, base_1.get)('/rag/pipeline/templates', { params });
        },
        enabled,
    });
};
exports.usePipelineTemplateList = usePipelineTemplateList;
const useInvalidCustomizedTemplateList = () => {
    return (0, use_base_1.useInvalid)([...exports.PipelineTemplateListQueryKeyPrefix, 'customized']);
};
exports.useInvalidCustomizedTemplateList = useInvalidCustomizedTemplateList;
const usePipelineTemplateById = (params, enabled) => {
    const { template_id, type } = params;
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'template', type, template_id],
        queryFn: () => {
            return (0, base_1.get)(`/rag/pipeline/templates/${template_id}`, {
                params: {
                    type,
                },
            });
        },
        enabled,
        staleTime: 0,
    });
};
exports.usePipelineTemplateById = usePipelineTemplateById;
const useUpdateTemplateInfo = (mutationOptions = {}) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'template-update'],
        mutationFn: (request) => {
            const { template_id, ...rest } = request;
            return (0, base_1.patch)(`/rag/pipeline/customized/templates/${template_id}`, {
                body: rest,
            });
        },
        ...mutationOptions,
    });
};
exports.useUpdateTemplateInfo = useUpdateTemplateInfo;
const useDeleteTemplate = (mutationOptions = {}) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'template-delete'],
        mutationFn: (templateId) => {
            return (0, base_1.del)(`/rag/pipeline/customized/templates/${templateId}`);
        },
        ...mutationOptions,
    });
};
exports.useDeleteTemplate = useDeleteTemplate;
const useExportTemplateDSL = (mutationOptions = {}) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'template-dsl-export'],
        mutationFn: (templateId) => {
            return (0, base_1.post)(`/rag/pipeline/customized/templates/${templateId}`);
        },
        ...mutationOptions,
    });
};
exports.useExportTemplateDSL = useExportTemplateDSL;
const useImportPipelineDSL = (mutationOptions = {}) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'dsl-import'],
        mutationFn: (request) => {
            return (0, base_1.post)('/rag/pipelines/imports', { body: request });
        },
        ...mutationOptions,
    });
};
exports.useImportPipelineDSL = useImportPipelineDSL;
const useImportPipelineDSLConfirm = (mutationOptions = {}) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'dsl-import-confirm'],
        mutationFn: (importId) => {
            return (0, base_1.post)(`/rag/pipelines/imports/${importId}/confirm`);
        },
        ...mutationOptions,
    });
};
exports.useImportPipelineDSLConfirm = useImportPipelineDSLConfirm;
const useCheckPipelineDependencies = (mutationOptions = {}) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'check-dependencies'],
        mutationFn: (pipelineId) => {
            return (0, base_1.get)(`/rag/pipelines/imports/${pipelineId}/check-dependencies`);
        },
        ...mutationOptions,
    });
};
exports.useCheckPipelineDependencies = useCheckPipelineDependencies;
const useDraftPipelineProcessingParams = (params, enabled = true) => {
    const { pipeline_id, node_id } = params;
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'draft-pipeline-processing-params', pipeline_id, node_id],
        queryFn: () => {
            return (0, base_1.get)(`/rag/pipelines/${pipeline_id}/workflows/draft/processing/parameters`, {
                params: {
                    node_id,
                },
            });
        },
        staleTime: 0,
        enabled,
    });
};
exports.useDraftPipelineProcessingParams = useDraftPipelineProcessingParams;
const usePublishedPipelineProcessingParams = (params) => {
    const { pipeline_id, node_id } = params;
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'published-pipeline-processing-params', pipeline_id, node_id],
        queryFn: () => {
            return (0, base_1.get)(`/rag/pipelines/${pipeline_id}/workflows/published/processing/parameters`, {
                params: {
                    node_id,
                },
            });
        },
        staleTime: 0,
    });
};
exports.usePublishedPipelineProcessingParams = usePublishedPipelineProcessingParams;
const useDataSourceList = (enabled, onSuccess) => {
    return (0, react_query_1.useQuery)({
        enabled,
        queryKey: [NAME_SPACE, 'datasource'],
        staleTime: 0,
        queryFn: async () => {
            const data = await (0, base_1.get)('/rag/pipelines/datasource-plugins');
            onSuccess?.(data);
            return data;
        },
        retry: false,
    });
};
exports.useDataSourceList = useDataSourceList;
const useInvalidDataSourceList = () => {
    return (0, use_base_1.useInvalid)([NAME_SPACE, 'datasource']);
};
exports.useInvalidDataSourceList = useInvalidDataSourceList;
exports.publishedPipelineInfoQueryKeyPrefix = [NAME_SPACE, 'published-pipeline'];
const usePublishedPipelineInfo = (pipelineId) => {
    return (0, react_query_1.useQuery)({
        queryKey: [...exports.publishedPipelineInfoQueryKeyPrefix, pipelineId],
        queryFn: () => {
            return (0, base_1.get)(`/rag/pipelines/${pipelineId}/workflows/publish`);
        },
        enabled: !!pipelineId,
    });
};
exports.usePublishedPipelineInfo = usePublishedPipelineInfo;
const useRunPublishedPipeline = (mutationOptions = {}) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'run-published-pipeline'],
        mutationFn: (request) => {
            const { pipeline_id: pipelineId, is_preview, ...rest } = request;
            return (0, base_1.post)(`/rag/pipelines/${pipelineId}/workflows/published/run`, {
                body: {
                    ...rest,
                    is_preview,
                    response_mode: 'blocking',
                },
            });
        },
        ...mutationOptions,
    });
};
exports.useRunPublishedPipeline = useRunPublishedPipeline;
const useDataSourceCredentials = (provider, pluginId, onSuccess) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'datasource-credentials', provider, pluginId],
        queryFn: async () => {
            const result = await (0, base_1.get)(`/auth/plugin/datasource?provider=${provider}&plugin_id=${pluginId}`);
            onSuccess(result.result);
            return result.result;
        },
        enabled: !!provider && !!pluginId,
        retry: 2,
    });
};
exports.useDataSourceCredentials = useDataSourceCredentials;
const useUpdateDataSourceCredentials = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'update-datasource-credentials'],
        mutationFn: ({ provider, pluginId, credentials, name, }) => {
            return (0, base_1.post)('/auth/plugin/datasource', {
                body: {
                    provider,
                    plugin_id: pluginId,
                    credentials,
                    name,
                },
            }).then(() => {
                queryClient.invalidateQueries({
                    queryKey: [NAME_SPACE, 'datasource'],
                });
            });
        },
    });
};
exports.useUpdateDataSourceCredentials = useUpdateDataSourceCredentials;
const useDraftPipelinePreProcessingParams = (params, enabled = true) => {
    const { pipeline_id, node_id } = params;
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'draft-pipeline-pre-processing-params', pipeline_id, node_id],
        queryFn: () => {
            return (0, base_1.get)(`/rag/pipelines/${pipeline_id}/workflows/draft/pre-processing/parameters`, {
                params: {
                    node_id,
                },
            });
        },
        staleTime: 0,
        enabled,
    });
};
exports.useDraftPipelinePreProcessingParams = useDraftPipelinePreProcessingParams;
const usePublishedPipelinePreProcessingParams = (params, enabled = true) => {
    const { pipeline_id, node_id } = params;
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'published-pipeline-pre-processing-params', pipeline_id, node_id],
        queryFn: () => {
            return (0, base_1.get)(`/rag/pipelines/${pipeline_id}/workflows/published/pre-processing/parameters`, {
                params: {
                    node_id,
                },
            });
        },
        staleTime: 0,
        enabled,
    });
};
exports.usePublishedPipelinePreProcessingParams = usePublishedPipelinePreProcessingParams;
const useExportPipelineDSL = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'export-pipeline-dsl'],
        mutationFn: ({ pipelineId, include = false, }) => {
            return (0, base_1.get)(`/rag/pipelines/${pipelineId}/exports?include_secret=${include}`);
        },
    });
};
exports.useExportPipelineDSL = useExportPipelineDSL;
const usePublishAsCustomizedPipeline = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'publish-as-customized-pipeline'],
        mutationFn: ({ pipelineId, name, icon_info, description, }) => {
            return (0, base_1.post)(`/rag/pipelines/${pipelineId}/customized/publish`, {
                body: {
                    name,
                    icon_info,
                    description,
                },
            });
        },
    });
};
exports.usePublishAsCustomizedPipeline = usePublishAsCustomizedPipeline;
const usePipelineExecutionLog = (params) => {
    const { dataset_id, document_id } = params;
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'pipeline-execution-log', dataset_id, document_id],
        queryFn: () => {
            return (0, base_1.get)(`/datasets/${dataset_id}/documents/${document_id}/pipeline-execution-log`);
        },
        staleTime: 0,
    });
};
exports.usePipelineExecutionLog = usePipelineExecutionLog;
const usePreviewOnlineDocument = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'preview-online-document'],
        mutationFn: (params) => {
            const { pipelineId, datasourceNodeId, workspaceID, pageID, pageType, credentialId } = params;
            return (0, base_1.post)(`/rag/pipelines/${pipelineId}/workflows/published/datasource/nodes/${datasourceNodeId}/preview`, {
                body: {
                    datasource_type: pipeline_1.DatasourceType.onlineDocument,
                    credential_id: credentialId,
                    inputs: {
                        workspace_id: workspaceID,
                        page_id: pageID,
                        type: pageType,
                    },
                },
            });
        },
    });
};
exports.usePreviewOnlineDocument = usePreviewOnlineDocument;
const useConvertDatasetToPipeline = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'convert-dataset-to-pipeline'],
        mutationFn: (datasetId) => {
            return (0, base_1.post)(`/rag/pipelines/transform/datasets/${datasetId}`);
        },
    });
};
exports.useConvertDatasetToPipeline = useConvertDatasetToPipeline;
const useDatasourceSingleRun = (mutationOptions = {}) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'datasource-node-single-run'],
        mutationFn: (params) => {
            const { pipeline_id: pipelineId, ...rest } = params;
            return (0, base_1.post)(`/rag/pipelines/${pipelineId}/workflows/draft/datasource/variables-inspect`, {
                body: rest,
            });
        },
        ...mutationOptions,
    });
};
exports.useDatasourceSingleRun = useDatasourceSingleRun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBpcGVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXBpcGVsaW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWlDQSx1REFBNkU7QUFDN0UsZ0RBQWtEO0FBQ2xELGlDQUE4QztBQUM5Qyx5Q0FBdUM7QUFFdkMsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBRWhCLFFBQUEsa0NBQWtDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUE7QUFDeEUsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLE1BQWtDLEVBQUUsT0FBTyxHQUFHLElBQUksRUFBRSxFQUFFO0lBQzVGLE9BQU8sSUFBQSxzQkFBUSxFQUErQjtRQUM1QyxRQUFRLEVBQUUsQ0FBQyxHQUFHLDBDQUFrQyxFQUFFLE1BQU0sQ0FBQztRQUN6RCxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ1osT0FBTyxJQUFBLFVBQUcsRUFBK0IseUJBQXlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2pGLENBQUM7UUFDRCxPQUFPO0tBQ1IsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBUlksUUFBQSx1QkFBdUIsMkJBUW5DO0FBRU0sTUFBTSxnQ0FBZ0MsR0FBRyxHQUFHLEVBQUU7SUFDbkQsT0FBTyxJQUFBLHFCQUFVLEVBQUMsQ0FBQyxHQUFHLDBDQUFrQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUE7QUFDMUUsQ0FBQyxDQUFBO0FBRlksUUFBQSxnQ0FBZ0Msb0NBRTVDO0FBRU0sTUFBTSx1QkFBdUIsR0FBRyxDQUFDLE1BQW1DLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO0lBQy9GLE1BQU0sRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFBO0lBQ3BDLE9BQU8sSUFBQSxzQkFBUSxFQUErQjtRQUM1QyxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUM7UUFDckQsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNaLE9BQU8sSUFBQSxVQUFHLEVBQStCLDJCQUEyQixXQUFXLEVBQUUsRUFBRTtnQkFDakYsTUFBTSxFQUFFO29CQUNOLElBQUk7aUJBQ0w7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsT0FBTztRQUNQLFNBQVMsRUFBRSxDQUFDO0tBQ2IsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBZFksUUFBQSx1QkFBdUIsMkJBY25DO0FBRU0sTUFBTSxxQkFBcUIsR0FBRyxDQUNuQyxrQkFBaUcsRUFBRSxFQUNuRyxFQUFFO0lBQ0YsT0FBTyxJQUFBLHlCQUFXLEVBQUM7UUFDakIsV0FBVyxFQUFFLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDO1FBQzVDLFVBQVUsRUFBRSxDQUFDLE9BQWtDLEVBQUUsRUFBRTtZQUNqRCxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFBO1lBQ3hDLE9BQU8sSUFBQSxZQUFLLEVBQTZCLHNDQUFzQyxXQUFXLEVBQUUsRUFBRTtnQkFDNUYsSUFBSSxFQUFFLElBQUk7YUFDWCxDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsR0FBRyxlQUFlO0tBQ25CLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQWJZLFFBQUEscUJBQXFCLHlCQWFqQztBQUVNLE1BQU0saUJBQWlCLEdBQUcsQ0FDL0Isa0JBQTBFLEVBQUUsRUFDNUUsRUFBRTtJQUNGLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFdBQVcsRUFBRSxDQUFDLFVBQVUsRUFBRSxpQkFBaUIsQ0FBQztRQUM1QyxVQUFVLEVBQUUsQ0FBQyxVQUFrQixFQUFFLEVBQUU7WUFDakMsT0FBTyxJQUFBLFVBQUcsRUFBeUIsc0NBQXNDLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFDeEYsQ0FBQztRQUNELEdBQUcsZUFBZTtLQUNuQixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFWWSxRQUFBLGlCQUFpQixxQkFVN0I7QUFFTSxNQUFNLG9CQUFvQixHQUFHLENBQ2xDLGtCQUE2RSxFQUFFLEVBQy9FLEVBQUU7SUFDRixPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUM7UUFDaEQsVUFBVSxFQUFFLENBQUMsVUFBa0IsRUFBRSxFQUFFO1lBQ2pDLE9BQU8sSUFBQSxXQUFJLEVBQTRCLHNDQUFzQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQzVGLENBQUM7UUFDRCxHQUFHLGVBQWU7S0FDbkIsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBVlksUUFBQSxvQkFBb0Isd0JBVWhDO0FBRU0sTUFBTSxvQkFBb0IsR0FBRyxDQUNsQyxrQkFBK0YsRUFBRSxFQUNqRyxFQUFFO0lBQ0YsT0FBTyxJQUFBLHlCQUFXLEVBQUM7UUFDakIsV0FBVyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQztRQUN2QyxVQUFVLEVBQUUsQ0FBQyxPQUFpQyxFQUFFLEVBQUU7WUFDaEQsT0FBTyxJQUFBLFdBQUksRUFBNEIsd0JBQXdCLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNyRixDQUFDO1FBQ0QsR0FBRyxlQUFlO0tBQ25CLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVZZLFFBQUEsb0JBQW9CLHdCQVVoQztBQUVNLE1BQU0sMkJBQTJCLEdBQUcsQ0FDekMsa0JBQW9GLEVBQUUsRUFDdEYsRUFBRTtJQUNGLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFdBQVcsRUFBRSxDQUFDLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQztRQUMvQyxVQUFVLEVBQUUsQ0FBQyxRQUFnQixFQUFFLEVBQUU7WUFDL0IsT0FBTyxJQUFBLFdBQUksRUFBbUMsMEJBQTBCLFFBQVEsVUFBVSxDQUFDLENBQUE7UUFDN0YsQ0FBQztRQUNELEdBQUcsZUFBZTtLQUNuQixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFWWSxRQUFBLDJCQUEyQiwrQkFVdkM7QUFFTSxNQUFNLDRCQUE0QixHQUFHLENBQzFDLGtCQUFxRixFQUFFLEVBQ3ZGLEVBQUU7SUFDRixPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUsb0JBQW9CLENBQUM7UUFDL0MsVUFBVSxFQUFFLENBQUMsVUFBa0IsRUFBRSxFQUFFO1lBQ2pDLE9BQU8sSUFBQSxVQUFHLEVBQW9DLDBCQUEwQixVQUFVLHFCQUFxQixDQUFDLENBQUE7UUFDMUcsQ0FBQztRQUNELEdBQUcsZUFBZTtLQUNuQixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFWWSxRQUFBLDRCQUE0QixnQ0FVeEM7QUFFTSxNQUFNLGdDQUFnQyxHQUFHLENBQUMsTUFBdUMsRUFBRSxPQUFPLEdBQUcsSUFBSSxFQUFFLEVBQUU7SUFDMUcsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUE7SUFDdkMsT0FBTyxJQUFBLHNCQUFRLEVBQW1DO1FBQ2hELFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxrQ0FBa0MsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDO1FBQ2hGLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDWixPQUFPLElBQUEsVUFBRyxFQUFtQyxrQkFBa0IsV0FBVyx3Q0FBd0MsRUFBRTtnQkFDbEgsTUFBTSxFQUFFO29CQUNOLE9BQU87aUJBQ1I7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsU0FBUyxFQUFFLENBQUM7UUFDWixPQUFPO0tBQ1IsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBZFksUUFBQSxnQ0FBZ0Msb0NBYzVDO0FBRU0sTUFBTSxvQ0FBb0MsR0FBRyxDQUFDLE1BQXVDLEVBQUUsRUFBRTtJQUM5RixNQUFNLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQTtJQUN2QyxPQUFPLElBQUEsc0JBQVEsRUFBbUM7UUFDaEQsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLHNDQUFzQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUM7UUFDcEYsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNaLE9BQU8sSUFBQSxVQUFHLEVBQW1DLGtCQUFrQixXQUFXLDRDQUE0QyxFQUFFO2dCQUN0SCxNQUFNLEVBQUU7b0JBQ04sT0FBTztpQkFDUjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxTQUFTLEVBQUUsQ0FBQztLQUNiLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQWJZLFFBQUEsb0NBQW9DLHdDQWFoRDtBQUVNLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxPQUFnQixFQUFFLFNBQXlDLEVBQUUsRUFBRTtJQUMvRixPQUFPLElBQUEsc0JBQVEsRUFBbUI7UUFDaEMsT0FBTztRQUNQLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7UUFDcEMsU0FBUyxFQUFFLENBQUM7UUFDWixPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLFVBQUcsRUFBbUIsbUNBQW1DLENBQUMsQ0FBQTtZQUM3RSxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQixPQUFPLElBQUksQ0FBQTtRQUNiLENBQUM7UUFDRCxLQUFLLEVBQUUsS0FBSztLQUNiLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVpZLFFBQUEsaUJBQWlCLHFCQVk3QjtBQUVNLE1BQU0sd0JBQXdCLEdBQUcsR0FBRyxFQUFFO0lBQzNDLE9BQU8sSUFBQSxxQkFBVSxFQUFDLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUE7QUFDL0MsQ0FBQyxDQUFBO0FBRlksUUFBQSx3QkFBd0IsNEJBRXBDO0FBRVksUUFBQSxtQ0FBbUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO0FBRTlFLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxVQUFrQixFQUFFLEVBQUU7SUFDN0QsT0FBTyxJQUFBLHNCQUFRLEVBQWdDO1FBQzdDLFFBQVEsRUFBRSxDQUFDLEdBQUcsMkNBQW1DLEVBQUUsVUFBVSxDQUFDO1FBQzlELE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDWixPQUFPLElBQUEsVUFBRyxFQUFnQyxrQkFBa0IsVUFBVSxvQkFBb0IsQ0FBQyxDQUFBO1FBQzdGLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVU7S0FDdEIsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBUlksUUFBQSx3QkFBd0IsNEJBUXBDO0FBRU0sTUFBTSx1QkFBdUIsR0FBRyxDQUNyQyxrQkFBMkksRUFBRSxFQUM3SSxFQUFFO0lBQ0YsT0FBTyxJQUFBLHlCQUFXLEVBQUM7UUFDakIsV0FBVyxFQUFFLENBQUMsVUFBVSxFQUFFLHdCQUF3QixDQUFDO1FBQ25ELFVBQVUsRUFBRSxDQUFDLE9BQW9DLEVBQUUsRUFBRTtZQUNuRCxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUE7WUFDaEUsT0FBTyxJQUFBLFdBQUksRUFBcUUsa0JBQWtCLFVBQVUsMEJBQTBCLEVBQUU7Z0JBQ3RJLElBQUksRUFBRTtvQkFDSixHQUFHLElBQUk7b0JBQ1AsVUFBVTtvQkFDVixhQUFhLEVBQUUsVUFBVTtpQkFDMUI7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsR0FBRyxlQUFlO0tBQ25CLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQWpCWSxRQUFBLHVCQUF1QiwyQkFpQm5DO0FBRU0sTUFBTSx3QkFBd0IsR0FBRyxDQUFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxTQUE0QyxFQUFFLEVBQUU7SUFDM0gsT0FBTyxJQUFBLHNCQUFRLEVBQUM7UUFDZCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQztRQUNwRSxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFBLFVBQUcsRUFBK0Isb0NBQW9DLFFBQVEsY0FBYyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQzVILFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDeEIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFBO1FBQ3RCLENBQUM7UUFDRCxPQUFPLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsUUFBUTtRQUNqQyxLQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVhZLFFBQUEsd0JBQXdCLDRCQVdwQztBQUVNLE1BQU0sOEJBQThCLEdBQUcsR0FDNUMsRUFBRTtJQUNGLE1BQU0sV0FBVyxHQUFHLElBQUEsNEJBQWMsR0FBRSxDQUFBO0lBQ3BDLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFdBQVcsRUFBRSxDQUFDLFVBQVUsRUFBRSwrQkFBK0IsQ0FBQztRQUMxRCxVQUFVLEVBQUUsQ0FBQyxFQUNYLFFBQVEsRUFDUixRQUFRLEVBQ1IsV0FBVyxFQUNYLElBQUksR0FDbUYsRUFBRSxFQUFFO1lBQzNGLE9BQU8sSUFBQSxXQUFJLEVBQUMseUJBQXlCLEVBQUU7Z0JBQ3JDLElBQUksRUFBRTtvQkFDSixRQUFRO29CQUNSLFNBQVMsRUFBRSxRQUFRO29CQUNuQixXQUFXO29CQUNYLElBQUk7aUJBQ0w7YUFDRixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDWCxXQUFXLENBQUMsaUJBQWlCLENBQUM7b0JBQzVCLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUM7aUJBQ3JDLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQXpCWSxRQUFBLDhCQUE4QixrQ0F5QjFDO0FBRU0sTUFBTSxtQ0FBbUMsR0FBRyxDQUFDLE1BQTBDLEVBQUUsT0FBTyxHQUFHLElBQUksRUFBRSxFQUFFO0lBQ2hILE1BQU0sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFBO0lBQ3ZDLE9BQU8sSUFBQSxzQkFBUSxFQUFzQztRQUNuRCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsc0NBQXNDLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQztRQUNwRixPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ1osT0FBTyxJQUFBLFVBQUcsRUFBc0Msa0JBQWtCLFdBQVcsNENBQTRDLEVBQUU7Z0JBQ3pILE1BQU0sRUFBRTtvQkFDTixPQUFPO2lCQUNSO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFNBQVMsRUFBRSxDQUFDO1FBQ1osT0FBTztLQUNSLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQWRZLFFBQUEsbUNBQW1DLHVDQWMvQztBQUVNLE1BQU0sdUNBQXVDLEdBQUcsQ0FBQyxNQUEwQyxFQUFFLE9BQU8sR0FBRyxJQUFJLEVBQUUsRUFBRTtJQUNwSCxNQUFNLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQTtJQUN2QyxPQUFPLElBQUEsc0JBQVEsRUFBc0M7UUFDbkQsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLDBDQUEwQyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUM7UUFDeEYsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNaLE9BQU8sSUFBQSxVQUFHLEVBQXNDLGtCQUFrQixXQUFXLGdEQUFnRCxFQUFFO2dCQUM3SCxNQUFNLEVBQUU7b0JBQ04sT0FBTztpQkFDUjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFDRCxTQUFTLEVBQUUsQ0FBQztRQUNaLE9BQU87S0FDUixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFkWSxRQUFBLHVDQUF1QywyQ0FjbkQ7QUFFTSxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUN2QyxPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUM7UUFDaEQsVUFBVSxFQUFFLENBQUMsRUFDWCxVQUFVLEVBQ1YsT0FBTyxHQUFHLEtBQUssR0FDMkIsRUFBRSxFQUFFO1lBQzlDLE9BQU8sSUFBQSxVQUFHLEVBQTRCLGtCQUFrQixVQUFVLDJCQUEyQixPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ3pHLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFWWSxRQUFBLG9CQUFvQix3QkFVaEM7QUFFTSxNQUFNLDhCQUE4QixHQUFHLEdBQUcsRUFBRTtJQUNqRCxPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0NBQWdDLENBQUM7UUFDM0QsVUFBVSxFQUFFLENBQUMsRUFDWCxVQUFVLEVBQ1YsSUFBSSxFQUNKLFNBQVMsRUFDVCxXQUFXLEdBTVosRUFBRSxFQUFFO1lBQ0gsT0FBTyxJQUFBLFdBQUksRUFBQyxrQkFBa0IsVUFBVSxxQkFBcUIsRUFBRTtnQkFDN0QsSUFBSSxFQUFFO29CQUNKLElBQUk7b0JBQ0osU0FBUztvQkFDVCxXQUFXO2lCQUNaO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQXZCWSxRQUFBLDhCQUE4QixrQ0F1QjFDO0FBRU0sTUFBTSx1QkFBdUIsR0FBRyxDQUFDLE1BQW1DLEVBQUUsRUFBRTtJQUM3RSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQTtJQUMxQyxPQUFPLElBQUEsc0JBQVEsRUFBK0I7UUFDNUMsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLHdCQUF3QixFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUM7UUFDekUsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNaLE9BQU8sSUFBQSxVQUFHLEVBQStCLGFBQWEsVUFBVSxjQUFjLFdBQVcseUJBQXlCLENBQUMsQ0FBQTtRQUNySCxDQUFDO1FBQ0QsU0FBUyxFQUFFLENBQUM7S0FDYixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFUWSxRQUFBLHVCQUF1QiwyQkFTbkM7QUFFTSxNQUFNLHdCQUF3QixHQUFHLEdBQUcsRUFBRTtJQUMzQyxPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUseUJBQXlCLENBQUM7UUFDcEQsVUFBVSxFQUFFLENBQUMsTUFBb0MsRUFBRSxFQUFFO1lBQ25ELE1BQU0sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxDQUFBO1lBQzVGLE9BQU8sSUFBQSxXQUFJLEVBQ1Qsa0JBQWtCLFVBQVUseUNBQXlDLGdCQUFnQixVQUFVLEVBQy9GO2dCQUNFLElBQUksRUFBRTtvQkFDSixlQUFlLEVBQUUseUJBQWMsQ0FBQyxjQUFjO29CQUM5QyxhQUFhLEVBQUUsWUFBWTtvQkFDM0IsTUFBTSxFQUFFO3dCQUNOLFlBQVksRUFBRSxXQUFXO3dCQUN6QixPQUFPLEVBQUUsTUFBTTt3QkFDZixJQUFJLEVBQUUsUUFBUTtxQkFDZjtpQkFDRjthQUNGLENBQ0YsQ0FBQTtRQUNILENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFyQlksUUFBQSx3QkFBd0IsNEJBcUJwQztBQUVNLE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxFQUFFO0lBQzlDLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFdBQVcsRUFBRSxDQUFDLFVBQVUsRUFBRSw2QkFBNkIsQ0FBQztRQUN4RCxVQUFVLEVBQUUsQ0FBQyxTQUFpQixFQUFFLEVBQUU7WUFDaEMsT0FBTyxJQUFBLFdBQUksRUFBcUIscUNBQXFDLFNBQVMsRUFBRSxDQUFDLENBQUE7UUFDbkYsQ0FBQztLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVBZLFFBQUEsMkJBQTJCLCtCQU92QztBQUVNLE1BQU0sc0JBQXNCLEdBQUcsQ0FDcEMsa0JBQTJHLEVBQUUsRUFDN0csRUFBRTtJQUNGLE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFdBQVcsRUFBRSxDQUFDLFVBQVUsRUFBRSw0QkFBNEIsQ0FBQztRQUN2RCxVQUFVLEVBQUUsQ0FBQyxNQUFzQyxFQUFFLEVBQUU7WUFDckQsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUE7WUFDbkQsT0FBTyxJQUFBLFdBQUksRUFBa0Msa0JBQWtCLFVBQVUsK0NBQStDLEVBQUU7Z0JBQ3hILElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELEdBQUcsZUFBZTtLQUNuQixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFiWSxRQUFBLHNCQUFzQiwwQkFhbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE11dGF0aW9uT3B0aW9ucyB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB0eXBlIHsgVG9vbENyZWRlbnRpYWwgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3Rvb2xzL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlSXRlbSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEljb25JbmZvIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7XG4gIENvbnZlcnNpb25SZXNwb25zZSxcbiAgRGF0YXNvdXJjZU5vZGVTaW5nbGVSdW5SZXF1ZXN0LFxuICBEYXRhc291cmNlTm9kZVNpbmdsZVJ1blJlc3BvbnNlLFxuICBEZWxldGVUZW1wbGF0ZVJlc3BvbnNlLFxuICBFeHBvcnRUZW1wbGF0ZURTTFJlc3BvbnNlLFxuICBJbXBvcnRQaXBlbGluZURTTENvbmZpcm1SZXNwb25zZSxcbiAgSW1wb3J0UGlwZWxpbmVEU0xSZXF1ZXN0LFxuICBJbXBvcnRQaXBlbGluZURTTFJlc3BvbnNlLFxuICBPbmxpbmVEb2N1bWVudFByZXZpZXdSZXF1ZXN0LFxuICBPbmxpbmVEb2N1bWVudFByZXZpZXdSZXNwb25zZSxcbiAgUGlwZWxpbmVDaGVja0RlcGVuZGVuY2llc1Jlc3BvbnNlLFxuICBQaXBlbGluZUV4ZWN1dGlvbkxvZ1JlcXVlc3QsXG4gIFBpcGVsaW5lRXhlY3V0aW9uTG9nUmVzcG9uc2UsXG4gIFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtc1JlcXVlc3QsXG4gIFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtc1Jlc3BvbnNlLFxuICBQaXBlbGluZVByb2Nlc3NpbmdQYXJhbXNSZXF1ZXN0LFxuICBQaXBlbGluZVByb2Nlc3NpbmdQYXJhbXNSZXNwb25zZSxcbiAgUGlwZWxpbmVUZW1wbGF0ZUJ5SWRSZXF1ZXN0LFxuICBQaXBlbGluZVRlbXBsYXRlQnlJZFJlc3BvbnNlLFxuICBQaXBlbGluZVRlbXBsYXRlTGlzdFBhcmFtcyxcbiAgUGlwZWxpbmVUZW1wbGF0ZUxpc3RSZXNwb25zZSxcbiAgUHVibGlzaGVkUGlwZWxpbmVJbmZvUmVzcG9uc2UsXG4gIFB1Ymxpc2hlZFBpcGVsaW5lUnVuUHJldmlld1Jlc3BvbnNlLFxuICBQdWJsaXNoZWRQaXBlbGluZVJ1blJlcXVlc3QsXG4gIFB1Ymxpc2hlZFBpcGVsaW5lUnVuUmVzcG9uc2UsXG4gIFVwZGF0ZVRlbXBsYXRlSW5mb1JlcXVlc3QsXG4gIFVwZGF0ZVRlbXBsYXRlSW5mb1Jlc3BvbnNlLFxufSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IHVzZU11dGF0aW9uLCB1c2VRdWVyeSwgdXNlUXVlcnlDbGllbnQgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBEYXRhc291cmNlVHlwZSB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgZGVsLCBnZXQsIHBhdGNoLCBwb3N0IH0gZnJvbSAnLi9iYXNlJ1xuaW1wb3J0IHsgdXNlSW52YWxpZCB9IGZyb20gJy4vdXNlLWJhc2UnXG5cbmNvbnN0IE5BTUVfU1BBQ0UgPSAncGlwZWxpbmUnXG5cbmV4cG9ydCBjb25zdCBQaXBlbGluZVRlbXBsYXRlTGlzdFF1ZXJ5S2V5UHJlZml4ID0gW05BTUVfU1BBQ0UsICd0ZW1wbGF0ZS1saXN0J11cbmV4cG9ydCBjb25zdCB1c2VQaXBlbGluZVRlbXBsYXRlTGlzdCA9IChwYXJhbXM6IFBpcGVsaW5lVGVtcGxhdGVMaXN0UGFyYW1zLCBlbmFibGVkID0gdHJ1ZSkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8UGlwZWxpbmVUZW1wbGF0ZUxpc3RSZXNwb25zZT4oe1xuICAgIHF1ZXJ5S2V5OiBbLi4uUGlwZWxpbmVUZW1wbGF0ZUxpc3RRdWVyeUtleVByZWZpeCwgcGFyYW1zXSxcbiAgICBxdWVyeUZuOiAoKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0PFBpcGVsaW5lVGVtcGxhdGVMaXN0UmVzcG9uc2U+KCcvcmFnL3BpcGVsaW5lL3RlbXBsYXRlcycsIHsgcGFyYW1zIH0pXG4gICAgfSxcbiAgICBlbmFibGVkLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW52YWxpZEN1c3RvbWl6ZWRUZW1wbGF0ZUxpc3QgPSAoKSA9PiB7XG4gIHJldHVybiB1c2VJbnZhbGlkKFsuLi5QaXBlbGluZVRlbXBsYXRlTGlzdFF1ZXJ5S2V5UHJlZml4LCAnY3VzdG9taXplZCddKVxufVxuXG5leHBvcnQgY29uc3QgdXNlUGlwZWxpbmVUZW1wbGF0ZUJ5SWQgPSAocGFyYW1zOiBQaXBlbGluZVRlbXBsYXRlQnlJZFJlcXVlc3QsIGVuYWJsZWQ6IGJvb2xlYW4pID0+IHtcbiAgY29uc3QgeyB0ZW1wbGF0ZV9pZCwgdHlwZSB9ID0gcGFyYW1zXG4gIHJldHVybiB1c2VRdWVyeTxQaXBlbGluZVRlbXBsYXRlQnlJZFJlc3BvbnNlPih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAndGVtcGxhdGUnLCB0eXBlLCB0ZW1wbGF0ZV9pZF0sXG4gICAgcXVlcnlGbjogKCkgPT4ge1xuICAgICAgcmV0dXJuIGdldDxQaXBlbGluZVRlbXBsYXRlQnlJZFJlc3BvbnNlPihgL3JhZy9waXBlbGluZS90ZW1wbGF0ZXMvJHt0ZW1wbGF0ZV9pZH1gLCB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHR5cGUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgZW5hYmxlZCxcbiAgICBzdGFsZVRpbWU6IDAsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VVcGRhdGVUZW1wbGF0ZUluZm8gPSAoXG4gIG11dGF0aW9uT3B0aW9uczogTXV0YXRpb25PcHRpb25zPFVwZGF0ZVRlbXBsYXRlSW5mb1Jlc3BvbnNlLCBFcnJvciwgVXBkYXRlVGVtcGxhdGVJbmZvUmVxdWVzdD4gPSB7fSxcbikgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ3RlbXBsYXRlLXVwZGF0ZSddLFxuICAgIG11dGF0aW9uRm46IChyZXF1ZXN0OiBVcGRhdGVUZW1wbGF0ZUluZm9SZXF1ZXN0KSA9PiB7XG4gICAgICBjb25zdCB7IHRlbXBsYXRlX2lkLCAuLi5yZXN0IH0gPSByZXF1ZXN0XG4gICAgICByZXR1cm4gcGF0Y2g8VXBkYXRlVGVtcGxhdGVJbmZvUmVzcG9uc2U+KGAvcmFnL3BpcGVsaW5lL2N1c3RvbWl6ZWQvdGVtcGxhdGVzLyR7dGVtcGxhdGVfaWR9YCwge1xuICAgICAgICBib2R5OiByZXN0LFxuICAgICAgfSlcbiAgICB9LFxuICAgIC4uLm11dGF0aW9uT3B0aW9ucyxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURlbGV0ZVRlbXBsYXRlID0gKFxuICBtdXRhdGlvbk9wdGlvbnM6IE11dGF0aW9uT3B0aW9uczxEZWxldGVUZW1wbGF0ZVJlc3BvbnNlLCBFcnJvciwgc3RyaW5nPiA9IHt9LFxuKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAndGVtcGxhdGUtZGVsZXRlJ10sXG4gICAgbXV0YXRpb25GbjogKHRlbXBsYXRlSWQ6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIGRlbDxEZWxldGVUZW1wbGF0ZVJlc3BvbnNlPihgL3JhZy9waXBlbGluZS9jdXN0b21pemVkL3RlbXBsYXRlcy8ke3RlbXBsYXRlSWR9YClcbiAgICB9LFxuICAgIC4uLm11dGF0aW9uT3B0aW9ucyxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUV4cG9ydFRlbXBsYXRlRFNMID0gKFxuICBtdXRhdGlvbk9wdGlvbnM6IE11dGF0aW9uT3B0aW9uczxFeHBvcnRUZW1wbGF0ZURTTFJlc3BvbnNlLCBFcnJvciwgc3RyaW5nPiA9IHt9LFxuKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAndGVtcGxhdGUtZHNsLWV4cG9ydCddLFxuICAgIG11dGF0aW9uRm46ICh0ZW1wbGF0ZUlkOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBwb3N0PEV4cG9ydFRlbXBsYXRlRFNMUmVzcG9uc2U+KGAvcmFnL3BpcGVsaW5lL2N1c3RvbWl6ZWQvdGVtcGxhdGVzLyR7dGVtcGxhdGVJZH1gKVxuICAgIH0sXG4gICAgLi4ubXV0YXRpb25PcHRpb25zLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlSW1wb3J0UGlwZWxpbmVEU0wgPSAoXG4gIG11dGF0aW9uT3B0aW9uczogTXV0YXRpb25PcHRpb25zPEltcG9ydFBpcGVsaW5lRFNMUmVzcG9uc2UsIEVycm9yLCBJbXBvcnRQaXBlbGluZURTTFJlcXVlc3Q+ID0ge30sXG4pID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdkc2wtaW1wb3J0J10sXG4gICAgbXV0YXRpb25GbjogKHJlcXVlc3Q6IEltcG9ydFBpcGVsaW5lRFNMUmVxdWVzdCkgPT4ge1xuICAgICAgcmV0dXJuIHBvc3Q8SW1wb3J0UGlwZWxpbmVEU0xSZXNwb25zZT4oJy9yYWcvcGlwZWxpbmVzL2ltcG9ydHMnLCB7IGJvZHk6IHJlcXVlc3QgfSlcbiAgICB9LFxuICAgIC4uLm11dGF0aW9uT3B0aW9ucyxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUltcG9ydFBpcGVsaW5lRFNMQ29uZmlybSA9IChcbiAgbXV0YXRpb25PcHRpb25zOiBNdXRhdGlvbk9wdGlvbnM8SW1wb3J0UGlwZWxpbmVEU0xDb25maXJtUmVzcG9uc2UsIEVycm9yLCBzdHJpbmc+ID0ge30sXG4pID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdkc2wtaW1wb3J0LWNvbmZpcm0nXSxcbiAgICBtdXRhdGlvbkZuOiAoaW1wb3J0SWQ6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIHBvc3Q8SW1wb3J0UGlwZWxpbmVEU0xDb25maXJtUmVzcG9uc2U+KGAvcmFnL3BpcGVsaW5lcy9pbXBvcnRzLyR7aW1wb3J0SWR9L2NvbmZpcm1gKVxuICAgIH0sXG4gICAgLi4ubXV0YXRpb25PcHRpb25zLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlQ2hlY2tQaXBlbGluZURlcGVuZGVuY2llcyA9IChcbiAgbXV0YXRpb25PcHRpb25zOiBNdXRhdGlvbk9wdGlvbnM8UGlwZWxpbmVDaGVja0RlcGVuZGVuY2llc1Jlc3BvbnNlLCBFcnJvciwgc3RyaW5nPiA9IHt9LFxuKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAnY2hlY2stZGVwZW5kZW5jaWVzJ10sXG4gICAgbXV0YXRpb25GbjogKHBpcGVsaW5lSWQ6IHN0cmluZykgPT4ge1xuICAgICAgcmV0dXJuIGdldDxQaXBlbGluZUNoZWNrRGVwZW5kZW5jaWVzUmVzcG9uc2U+KGAvcmFnL3BpcGVsaW5lcy9pbXBvcnRzLyR7cGlwZWxpbmVJZH0vY2hlY2stZGVwZW5kZW5jaWVzYClcbiAgICB9LFxuICAgIC4uLm11dGF0aW9uT3B0aW9ucyxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURyYWZ0UGlwZWxpbmVQcm9jZXNzaW5nUGFyYW1zID0gKHBhcmFtczogUGlwZWxpbmVQcm9jZXNzaW5nUGFyYW1zUmVxdWVzdCwgZW5hYmxlZCA9IHRydWUpID0+IHtcbiAgY29uc3QgeyBwaXBlbGluZV9pZCwgbm9kZV9pZCB9ID0gcGFyYW1zXG4gIHJldHVybiB1c2VRdWVyeTxQaXBlbGluZVByb2Nlc3NpbmdQYXJhbXNSZXNwb25zZT4oe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2RyYWZ0LXBpcGVsaW5lLXByb2Nlc3NpbmctcGFyYW1zJywgcGlwZWxpbmVfaWQsIG5vZGVfaWRdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IHtcbiAgICAgIHJldHVybiBnZXQ8UGlwZWxpbmVQcm9jZXNzaW5nUGFyYW1zUmVzcG9uc2U+KGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lX2lkfS93b3JrZmxvd3MvZHJhZnQvcHJvY2Vzc2luZy9wYXJhbWV0ZXJzYCwge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBub2RlX2lkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIHN0YWxlVGltZTogMCxcbiAgICBlbmFibGVkLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlUHVibGlzaGVkUGlwZWxpbmVQcm9jZXNzaW5nUGFyYW1zID0gKHBhcmFtczogUGlwZWxpbmVQcm9jZXNzaW5nUGFyYW1zUmVxdWVzdCkgPT4ge1xuICBjb25zdCB7IHBpcGVsaW5lX2lkLCBub2RlX2lkIH0gPSBwYXJhbXNcbiAgcmV0dXJuIHVzZVF1ZXJ5PFBpcGVsaW5lUHJvY2Vzc2luZ1BhcmFtc1Jlc3BvbnNlPih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAncHVibGlzaGVkLXBpcGVsaW5lLXByb2Nlc3NpbmctcGFyYW1zJywgcGlwZWxpbmVfaWQsIG5vZGVfaWRdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IHtcbiAgICAgIHJldHVybiBnZXQ8UGlwZWxpbmVQcm9jZXNzaW5nUGFyYW1zUmVzcG9uc2U+KGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lX2lkfS93b3JrZmxvd3MvcHVibGlzaGVkL3Byb2Nlc3NpbmcvcGFyYW1ldGVyc2AsIHtcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgbm9kZV9pZCxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBzdGFsZVRpbWU6IDAsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VEYXRhU291cmNlTGlzdCA9IChlbmFibGVkOiBib29sZWFuLCBvblN1Y2Nlc3M/OiAodjogRGF0YVNvdXJjZUl0ZW1bXSkgPT4gdm9pZCkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnk8RGF0YVNvdXJjZUl0ZW1bXT4oe1xuICAgIGVuYWJsZWQsXG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnZGF0YXNvdXJjZSddLFxuICAgIHN0YWxlVGltZTogMCxcbiAgICBxdWVyeUZuOiBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0PERhdGFTb3VyY2VJdGVtW10+KCcvcmFnL3BpcGVsaW5lcy9kYXRhc291cmNlLXBsdWdpbnMnKVxuICAgICAgb25TdWNjZXNzPy4oZGF0YSlcbiAgICAgIHJldHVybiBkYXRhXG4gICAgfSxcbiAgICByZXRyeTogZmFsc2UsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VJbnZhbGlkRGF0YVNvdXJjZUxpc3QgPSAoKSA9PiB7XG4gIHJldHVybiB1c2VJbnZhbGlkKFtOQU1FX1NQQUNFLCAnZGF0YXNvdXJjZSddKVxufVxuXG5leHBvcnQgY29uc3QgcHVibGlzaGVkUGlwZWxpbmVJbmZvUXVlcnlLZXlQcmVmaXggPSBbTkFNRV9TUEFDRSwgJ3B1Ymxpc2hlZC1waXBlbGluZSddXG5cbmV4cG9ydCBjb25zdCB1c2VQdWJsaXNoZWRQaXBlbGluZUluZm8gPSAocGlwZWxpbmVJZDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeTxQdWJsaXNoZWRQaXBlbGluZUluZm9SZXNwb25zZT4oe1xuICAgIHF1ZXJ5S2V5OiBbLi4ucHVibGlzaGVkUGlwZWxpbmVJbmZvUXVlcnlLZXlQcmVmaXgsIHBpcGVsaW5lSWRdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IHtcbiAgICAgIHJldHVybiBnZXQ8UHVibGlzaGVkUGlwZWxpbmVJbmZvUmVzcG9uc2U+KGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lSWR9L3dvcmtmbG93cy9wdWJsaXNoYClcbiAgICB9LFxuICAgIGVuYWJsZWQ6ICEhcGlwZWxpbmVJZCxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVJ1blB1Ymxpc2hlZFBpcGVsaW5lID0gKFxuICBtdXRhdGlvbk9wdGlvbnM6IE11dGF0aW9uT3B0aW9uczxQdWJsaXNoZWRQaXBlbGluZVJ1blByZXZpZXdSZXNwb25zZSB8IFB1Ymxpc2hlZFBpcGVsaW5lUnVuUmVzcG9uc2UsIEVycm9yLCBQdWJsaXNoZWRQaXBlbGluZVJ1blJlcXVlc3Q+ID0ge30sXG4pID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdydW4tcHVibGlzaGVkLXBpcGVsaW5lJ10sXG4gICAgbXV0YXRpb25GbjogKHJlcXVlc3Q6IFB1Ymxpc2hlZFBpcGVsaW5lUnVuUmVxdWVzdCkgPT4ge1xuICAgICAgY29uc3QgeyBwaXBlbGluZV9pZDogcGlwZWxpbmVJZCwgaXNfcHJldmlldywgLi4ucmVzdCB9ID0gcmVxdWVzdFxuICAgICAgcmV0dXJuIHBvc3Q8UHVibGlzaGVkUGlwZWxpbmVSdW5QcmV2aWV3UmVzcG9uc2UgfCBQdWJsaXNoZWRQaXBlbGluZVJ1blJlc3BvbnNlPihgL3JhZy9waXBlbGluZXMvJHtwaXBlbGluZUlkfS93b3JrZmxvd3MvcHVibGlzaGVkL3J1bmAsIHtcbiAgICAgICAgYm9keToge1xuICAgICAgICAgIC4uLnJlc3QsXG4gICAgICAgICAgaXNfcHJldmlldyxcbiAgICAgICAgICByZXNwb25zZV9tb2RlOiAnYmxvY2tpbmcnLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIC4uLm11dGF0aW9uT3B0aW9ucyxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURhdGFTb3VyY2VDcmVkZW50aWFscyA9IChwcm92aWRlcjogc3RyaW5nLCBwbHVnaW5JZDogc3RyaW5nLCBvblN1Y2Nlc3M6ICh2YWx1ZTogVG9vbENyZWRlbnRpYWxbXSkgPT4gdm9pZCkgPT4ge1xuICByZXR1cm4gdXNlUXVlcnkoe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2RhdGFzb3VyY2UtY3JlZGVudGlhbHMnLCBwcm92aWRlciwgcGx1Z2luSWRdLFxuICAgIHF1ZXJ5Rm46IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdldDx7IHJlc3VsdDogVG9vbENyZWRlbnRpYWxbXSB9PihgL2F1dGgvcGx1Z2luL2RhdGFzb3VyY2U/cHJvdmlkZXI9JHtwcm92aWRlcn0mcGx1Z2luX2lkPSR7cGx1Z2luSWR9YClcbiAgICAgIG9uU3VjY2VzcyhyZXN1bHQucmVzdWx0KVxuICAgICAgcmV0dXJuIHJlc3VsdC5yZXN1bHRcbiAgICB9LFxuICAgIGVuYWJsZWQ6ICEhcHJvdmlkZXIgJiYgISFwbHVnaW5JZCxcbiAgICByZXRyeTogMixcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVVwZGF0ZURhdGFTb3VyY2VDcmVkZW50aWFscyA9IChcbikgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICd1cGRhdGUtZGF0YXNvdXJjZS1jcmVkZW50aWFscyddLFxuICAgIG11dGF0aW9uRm46ICh7XG4gICAgICBwcm92aWRlcixcbiAgICAgIHBsdWdpbklkLFxuICAgICAgY3JlZGVudGlhbHMsXG4gICAgICBuYW1lLFxuICAgIH06IHsgcHJvdmlkZXI6IHN0cmluZywgcGx1Z2luSWQ6IHN0cmluZywgY3JlZGVudGlhbHM6IFJlY29yZDxzdHJpbmcsIGFueT4sIG5hbWU6IHN0cmluZyB9KSA9PiB7XG4gICAgICByZXR1cm4gcG9zdCgnL2F1dGgvcGx1Z2luL2RhdGFzb3VyY2UnLCB7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBwcm92aWRlcixcbiAgICAgICAgICBwbHVnaW5faWQ6IHBsdWdpbklkLFxuICAgICAgICAgIGNyZWRlbnRpYWxzLFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgIH0sXG4gICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcXVlcnlDbGllbnQuaW52YWxpZGF0ZVF1ZXJpZXMoe1xuICAgICAgICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2RhdGFzb3VyY2UnXSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURyYWZ0UGlwZWxpbmVQcmVQcm9jZXNzaW5nUGFyYW1zID0gKHBhcmFtczogUGlwZWxpbmVQcmVQcm9jZXNzaW5nUGFyYW1zUmVxdWVzdCwgZW5hYmxlZCA9IHRydWUpID0+IHtcbiAgY29uc3QgeyBwaXBlbGluZV9pZCwgbm9kZV9pZCB9ID0gcGFyYW1zXG4gIHJldHVybiB1c2VRdWVyeTxQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXNSZXNwb25zZT4oe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ2RyYWZ0LXBpcGVsaW5lLXByZS1wcm9jZXNzaW5nLXBhcmFtcycsIHBpcGVsaW5lX2lkLCBub2RlX2lkXSxcbiAgICBxdWVyeUZuOiAoKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0PFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtc1Jlc3BvbnNlPihgL3JhZy9waXBlbGluZXMvJHtwaXBlbGluZV9pZH0vd29ya2Zsb3dzL2RyYWZ0L3ByZS1wcm9jZXNzaW5nL3BhcmFtZXRlcnNgLCB7XG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIG5vZGVfaWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgc3RhbGVUaW1lOiAwLFxuICAgIGVuYWJsZWQsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VQdWJsaXNoZWRQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXMgPSAocGFyYW1zOiBQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXNSZXF1ZXN0LCBlbmFibGVkID0gdHJ1ZSkgPT4ge1xuICBjb25zdCB7IHBpcGVsaW5lX2lkLCBub2RlX2lkIH0gPSBwYXJhbXNcbiAgcmV0dXJuIHVzZVF1ZXJ5PFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtc1Jlc3BvbnNlPih7XG4gICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAncHVibGlzaGVkLXBpcGVsaW5lLXByZS1wcm9jZXNzaW5nLXBhcmFtcycsIHBpcGVsaW5lX2lkLCBub2RlX2lkXSxcbiAgICBxdWVyeUZuOiAoKSA9PiB7XG4gICAgICByZXR1cm4gZ2V0PFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtc1Jlc3BvbnNlPihgL3JhZy9waXBlbGluZXMvJHtwaXBlbGluZV9pZH0vd29ya2Zsb3dzL3B1Ymxpc2hlZC9wcmUtcHJvY2Vzc2luZy9wYXJhbWV0ZXJzYCwge1xuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBub2RlX2lkLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIHN0YWxlVGltZTogMCxcbiAgICBlbmFibGVkLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlRXhwb3J0UGlwZWxpbmVEU0wgPSAoKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAnZXhwb3J0LXBpcGVsaW5lLWRzbCddLFxuICAgIG11dGF0aW9uRm46ICh7XG4gICAgICBwaXBlbGluZUlkLFxuICAgICAgaW5jbHVkZSA9IGZhbHNlLFxuICAgIH06IHsgcGlwZWxpbmVJZDogc3RyaW5nLCBpbmNsdWRlPzogYm9vbGVhbiB9KSA9PiB7XG4gICAgICByZXR1cm4gZ2V0PEV4cG9ydFRlbXBsYXRlRFNMUmVzcG9uc2U+KGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lSWR9L2V4cG9ydHM/aW5jbHVkZV9zZWNyZXQ9JHtpbmNsdWRlfWApXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVB1Ymxpc2hBc0N1c3RvbWl6ZWRQaXBlbGluZSA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdwdWJsaXNoLWFzLWN1c3RvbWl6ZWQtcGlwZWxpbmUnXSxcbiAgICBtdXRhdGlvbkZuOiAoe1xuICAgICAgcGlwZWxpbmVJZCxcbiAgICAgIG5hbWUsXG4gICAgICBpY29uX2luZm8sXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICB9OiB7XG4gICAgICBwaXBlbGluZUlkOiBzdHJpbmdcbiAgICAgIG5hbWU6IHN0cmluZ1xuICAgICAgaWNvbl9pbmZvOiBJY29uSW5mb1xuICAgICAgZGVzY3JpcHRpb24/OiBzdHJpbmdcbiAgICB9KSA9PiB7XG4gICAgICByZXR1cm4gcG9zdChgL3JhZy9waXBlbGluZXMvJHtwaXBlbGluZUlkfS9jdXN0b21pemVkL3B1Ymxpc2hgLCB7XG4gICAgICAgIGJvZHk6IHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIGljb25faW5mbyxcbiAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVBpcGVsaW5lRXhlY3V0aW9uTG9nID0gKHBhcmFtczogUGlwZWxpbmVFeGVjdXRpb25Mb2dSZXF1ZXN0KSA9PiB7XG4gIGNvbnN0IHsgZGF0YXNldF9pZCwgZG9jdW1lbnRfaWQgfSA9IHBhcmFtc1xuICByZXR1cm4gdXNlUXVlcnk8UGlwZWxpbmVFeGVjdXRpb25Mb2dSZXNwb25zZT4oe1xuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ3BpcGVsaW5lLWV4ZWN1dGlvbi1sb2cnLCBkYXRhc2V0X2lkLCBkb2N1bWVudF9pZF0sXG4gICAgcXVlcnlGbjogKCkgPT4ge1xuICAgICAgcmV0dXJuIGdldDxQaXBlbGluZUV4ZWN1dGlvbkxvZ1Jlc3BvbnNlPihgL2RhdGFzZXRzLyR7ZGF0YXNldF9pZH0vZG9jdW1lbnRzLyR7ZG9jdW1lbnRfaWR9L3BpcGVsaW5lLWV4ZWN1dGlvbi1sb2dgKVxuICAgIH0sXG4gICAgc3RhbGVUaW1lOiAwLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlUHJldmlld09ubGluZURvY3VtZW50ID0gKCkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ3ByZXZpZXctb25saW5lLWRvY3VtZW50J10sXG4gICAgbXV0YXRpb25GbjogKHBhcmFtczogT25saW5lRG9jdW1lbnRQcmV2aWV3UmVxdWVzdCkgPT4ge1xuICAgICAgY29uc3QgeyBwaXBlbGluZUlkLCBkYXRhc291cmNlTm9kZUlkLCB3b3Jrc3BhY2VJRCwgcGFnZUlELCBwYWdlVHlwZSwgY3JlZGVudGlhbElkIH0gPSBwYXJhbXNcbiAgICAgIHJldHVybiBwb3N0PE9ubGluZURvY3VtZW50UHJldmlld1Jlc3BvbnNlPihcbiAgICAgICAgYC9yYWcvcGlwZWxpbmVzLyR7cGlwZWxpbmVJZH0vd29ya2Zsb3dzL3B1Ymxpc2hlZC9kYXRhc291cmNlL25vZGVzLyR7ZGF0YXNvdXJjZU5vZGVJZH0vcHJldmlld2AsXG4gICAgICAgIHtcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBkYXRhc291cmNlX3R5cGU6IERhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50LFxuICAgICAgICAgICAgY3JlZGVudGlhbF9pZDogY3JlZGVudGlhbElkLFxuICAgICAgICAgICAgaW5wdXRzOiB7XG4gICAgICAgICAgICAgIHdvcmtzcGFjZV9pZDogd29ya3NwYWNlSUQsXG4gICAgICAgICAgICAgIHBhZ2VfaWQ6IHBhZ2VJRCxcbiAgICAgICAgICAgICAgdHlwZTogcGFnZVR5cGUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICApXG4gICAgfSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUNvbnZlcnREYXRhc2V0VG9QaXBlbGluZSA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdjb252ZXJ0LWRhdGFzZXQtdG8tcGlwZWxpbmUnXSxcbiAgICBtdXRhdGlvbkZuOiAoZGF0YXNldElkOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBwb3N0PENvbnZlcnNpb25SZXNwb25zZT4oYC9yYWcvcGlwZWxpbmVzL3RyYW5zZm9ybS9kYXRhc2V0cy8ke2RhdGFzZXRJZH1gKVxuICAgIH0sXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VEYXRhc291cmNlU2luZ2xlUnVuID0gKFxuICBtdXRhdGlvbk9wdGlvbnM6IE11dGF0aW9uT3B0aW9uczxEYXRhc291cmNlTm9kZVNpbmdsZVJ1blJlc3BvbnNlLCBFcnJvciwgRGF0YXNvdXJjZU5vZGVTaW5nbGVSdW5SZXF1ZXN0PiA9IHt9LFxuKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAnZGF0YXNvdXJjZS1ub2RlLXNpbmdsZS1ydW4nXSxcbiAgICBtdXRhdGlvbkZuOiAocGFyYW1zOiBEYXRhc291cmNlTm9kZVNpbmdsZVJ1blJlcXVlc3QpID0+IHtcbiAgICAgIGNvbnN0IHsgcGlwZWxpbmVfaWQ6IHBpcGVsaW5lSWQsIC4uLnJlc3QgfSA9IHBhcmFtc1xuICAgICAgcmV0dXJuIHBvc3Q8RGF0YXNvdXJjZU5vZGVTaW5nbGVSdW5SZXNwb25zZT4oYC9yYWcvcGlwZWxpbmVzLyR7cGlwZWxpbmVJZH0vd29ya2Zsb3dzL2RyYWZ0L2RhdGFzb3VyY2UvdmFyaWFibGVzLWluc3BlY3RgLCB7XG4gICAgICAgIGJvZHk6IHJlc3QsXG4gICAgICB9KVxuICAgIH0sXG4gICAgLi4ubXV0YXRpb25PcHRpb25zLFxuICB9KVxufVxuIl19