"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePipelineInit = void 0;
const react_1 = require("react");
const store_1 = require("@/app/components/workflow/store");
const dataset_detail_1 = require("@/context/dataset-detail");
const workflow_1 = require("@/service/workflow");
const use_pipeline_config_1 = require("./use-pipeline-config");
const use_pipeline_template_1 = require("./use-pipeline-template");
const usePipelineInit = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { nodes: nodesTemplate, edges: edgesTemplate, } = (0, use_pipeline_template_1.usePipelineTemplate)();
    const [data, setData] = (0, react_1.useState)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const datasetId = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(s => s.dataset)?.pipeline_id;
    const knowledgeName = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(s => s.dataset)?.name;
    const knowledgeIcon = (0, dataset_detail_1.useDatasetDetailContextWithSelector)(s => s.dataset)?.icon_info;
    (0, react_1.useEffect)(() => {
        workflowStore.setState({ pipelineId: datasetId, knowledgeName, knowledgeIcon });
    }, [datasetId, workflowStore, knowledgeName, knowledgeIcon]);
    (0, use_pipeline_config_1.usePipelineConfig)();
    const handleGetInitialWorkflowData = (0, react_1.useCallback)(async () => {
        const { setEnvSecrets, setEnvironmentVariables, setSyncWorkflowDraftHash, setDraftUpdatedAt, setToolPublished, setRagPipelineVariables, } = workflowStore.getState();
        try {
            const res = await (0, workflow_1.fetchWorkflowDraft)(`/rag/pipelines/${datasetId}/workflows/draft`);
            setData(res);
            setDraftUpdatedAt(res.updated_at);
            setToolPublished(res.tool_published);
            setEnvSecrets((res.environment_variables || []).filter(env => env.value_type === 'secret').reduce((acc, env) => {
                acc[env.id] = env.value;
                return acc;
            }, {}));
            setEnvironmentVariables(res.environment_variables?.map(env => env.value_type === 'secret' ? { ...env, value: '[__HIDDEN__]' } : env) || []);
            setSyncWorkflowDraftHash(res.hash);
            setRagPipelineVariables?.(res.rag_pipeline_variables || []);
            setIsLoading(false);
        }
        catch (error) {
            if (error && error.json && !error.bodyUsed && datasetId) {
                error.json().then((err) => {
                    if (err.code === 'draft_workflow_not_exist') {
                        workflowStore.setState({
                            notInitialWorkflow: true,
                            shouldAutoOpenStartNodeSelector: true,
                        });
                        (0, workflow_1.syncWorkflowDraft)({
                            url: `/rag/pipelines/${datasetId}/workflows/draft`,
                            params: {
                                graph: {
                                    nodes: nodesTemplate,
                                    edges: edgesTemplate,
                                },
                                environment_variables: [],
                            },
                        }).then((res) => {
                            const { setDraftUpdatedAt } = workflowStore.getState();
                            setDraftUpdatedAt(res.updated_at);
                            handleGetInitialWorkflowData();
                        });
                    }
                });
            }
        }
    }, [nodesTemplate, edgesTemplate, workflowStore, datasetId]);
    (0, react_1.useEffect)(() => {
        handleGetInitialWorkflowData();
    }, []);
    return {
        data,
        isLoading,
    };
};
exports.usePipelineInit = usePipelineInit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBpcGVsaW5lLWluaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtcGlwZWxpbmUtaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FJYztBQUNkLDJEQUV3QztBQUN4Qyw2REFBOEU7QUFDOUUsaURBRzJCO0FBQzNCLCtEQUF5RDtBQUN6RCxtRUFBNkQ7QUFFdEQsTUFBTSxlQUFlLEdBQUcsR0FBRyxFQUFFO0lBQ2xDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLEVBQ0osS0FBSyxFQUFFLGFBQWEsRUFDcEIsS0FBSyxFQUFFLGFBQWEsR0FDckIsR0FBRyxJQUFBLDJDQUFtQixHQUFFLENBQUE7SUFDekIsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFBLGdCQUFRLEdBQThCLENBQUE7SUFDOUQsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsSUFBSSxDQUFDLENBQUE7SUFDaEQsTUFBTSxTQUFTLEdBQUcsSUFBQSxvREFBbUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxXQUFXLENBQUE7SUFDbEYsTUFBTSxhQUFhLEdBQUcsSUFBQSxvREFBbUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUE7SUFDL0UsTUFBTSxhQUFhLEdBQUcsSUFBQSxvREFBbUMsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLENBQUE7SUFFcEYsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFBO0lBQ2pGLENBQUMsRUFBRSxDQUFD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SCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUU1RCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsNEJBQTRCLEVBQUUsQ0FBQTtJQUNoQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFTixPQUFPO1FBQ0wsSUFBSTtRQUNKLFNBQVM7S0FDVixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBN0VZLFFBQUEsZUFBZSxtQkE2RTNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGZXRjaFdvcmtmbG93RHJhZnRSZXNwb25zZSB9IGZyb20gJ0AvdHlwZXMvd29ya2Zsb3cnXG5pbXBvcnQge1xuICB1c2VDYWxsYmFjayxcbiAgdXNlRWZmZWN0LFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICB1c2VXb3JrZmxvd1N0b3JlLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHsgdXNlRGF0YXNldERldGFpbENvbnRleHRXaXRoU2VsZWN0b3IgfSBmcm9tICdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnXG5pbXBvcnQge1xuICBmZXRjaFdvcmtmbG93RHJhZnQsXG4gIHN5bmNXb3JrZmxvd0RyYWZ0LFxufSBmcm9tICdAL3NlcnZpY2Uvd29ya2Zsb3cnXG5pbXBvcnQgeyB1c2VQaXBlbGluZUNvbmZpZyB9IGZyb20gJy4vdXNlLXBpcGVsaW5lLWNvbmZpZydcbmltcG9ydCB7IHVzZVBpcGVsaW5lVGVtcGxhdGUgfSBmcm9tICcuL3VzZS1waXBlbGluZS10ZW1wbGF0ZSdcblxuZXhwb3J0IGNvbnN0IHVzZVBpcGVsaW5lSW5pdCA9ICgpID0+IHtcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCB7XG4gICAgbm9kZXM6IG5vZGVzVGVtcGxhdGUsXG4gICAgZWRnZXM6IGVkZ2VzVGVtcGxhdGUsXG4gIH0gPSB1c2VQaXBlbGluZVRlbXBsYXRlKClcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGU8RmV0Y2hXb3JrZmxvd0RyYWZ0UmVzcG9uc2U+KClcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpXG4gIGNvbnN0IGRhdGFzZXRJZCA9IHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yKHMgPT4gcy5kYXRhc2V0KT8ucGlwZWxpbmVfaWRcbiAgY29uc3Qga25vd2xlZGdlTmFtZSA9IHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yKHMgPT4gcy5kYXRhc2V0KT8ubmFtZVxuICBjb25zdCBrbm93bGVkZ2VJY29uID0gdXNlRGF0YXNldERldGFpbENvbnRleHRXaXRoU2VsZWN0b3IocyA9PiBzLmRhdGFzZXQpPy5pY29uX2luZm9cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBwaXBlbGluZUlkOiBkYXRhc2V0SWQsIGtub3dsZWRnZU5hbWUsIGtub3dsZWRnZUljb24gfSlcbiAgfSwgW2RhdGFzZXRJZCwgd29ya2Zsb3dTdG9yZSwga25vd2xlZGdlTmFtZSwga25vd2xlZGdlSWNvbl0pXG5cbiAgdXNlUGlwZWxpbmVDb25maWcoKVxuXG4gIGNvbnN0IGhhbmRsZUdldEluaXRpYWxXb3JrZmxvd0RhdGEgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgc2V0RW52U2VjcmV0cyxcbiAgICAgIHNldEVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgc2V0U3luY1dvcmtmbG93RHJhZnRIYXNoLFxuICAgICAgc2V0RHJhZnRVcGRhdGVkQXQsXG4gICAgICBzZXRUb29sUHVibGlzaGVkLFxuICAgICAgc2V0UmFnUGlwZWxpbmVWYXJpYWJsZXMsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaFdvcmtmbG93RHJhZnQoYC9yYWcvcGlwZWxpbmVzLyR7ZGF0YXNldElkfS93b3JrZmxvd3MvZHJhZnRgKVxuICAgICAgc2V0RGF0YShyZXMpXG4gICAgICBzZXREcmFmdFVwZGF0ZWRBdChyZXMudXBkYXRlZF9hdClcbiAgICAgIHNldFRvb2xQdWJsaXNoZWQocmVzLnRvb2xfcHVibGlzaGVkKVxuICAgICAgc2V0RW52U2VjcmV0cygocmVzLmVudmlyb25tZW50X3ZhcmlhYmxlcyB8fCBbXSkuZmlsdGVyKGVudiA9PiBlbnYudmFsdWVfdHlwZSA9PT0gJ3NlY3JldCcpLnJlZHVjZSgoYWNjLCBlbnYpID0+IHtcbiAgICAgICAgYWNjW2Vudi5pZF0gPSBlbnYudmFsdWVcbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikpXG4gICAgICBzZXRFbnZpcm9ubWVudFZhcmlhYmxlcyhyZXMuZW52aXJvbm1lbnRfdmFyaWFibGVzPy5tYXAoZW52ID0+IGVudi52YWx1ZV90eXBlID09PSAnc2VjcmV0JyA/IHsgLi4uZW52LCB2YWx1ZTogJ1tfX0hJRERFTl9fXScgfSA6IGVudikgfHwgW10pXG4gICAgICBzZXRTeW5jV29ya2Zsb3dEcmFmdEhhc2gocmVzLmhhc2gpXG4gICAgICBzZXRSYWdQaXBlbGluZVZhcmlhYmxlcz8uKHJlcy5yYWdfcGlwZWxpbmVfdmFyaWFibGVzIHx8IFtdKVxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yICYmIGVycm9yLmpzb24gJiYgIWVycm9yLmJvZHlVc2VkICYmIGRhdGFzZXRJZCkge1xuICAgICAgICBlcnJvci5qc29uKCkudGhlbigoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdkcmFmdF93b3JrZmxvd19ub3RfZXhpc3QnKSB7XG4gICAgICAgICAgICB3b3JrZmxvd1N0b3JlLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgbm90SW5pdGlhbFdvcmtmbG93OiB0cnVlLFxuICAgICAgICAgICAgICBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yOiB0cnVlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHN5bmNXb3JrZmxvd0RyYWZ0KHtcbiAgICAgICAgICAgICAgdXJsOiBgL3JhZy9waXBlbGluZXMvJHtkYXRhc2V0SWR9L3dvcmtmbG93cy9kcmFmdGAsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGdyYXBoOiB7XG4gICAgICAgICAgICAgICAgICBub2Rlczogbm9kZXNUZW1wbGF0ZSxcbiAgICAgICAgICAgICAgICAgIGVkZ2VzOiBlZGdlc1RlbXBsYXRlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRfdmFyaWFibGVzOiBbXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB7IHNldERyYWZ0VXBkYXRlZEF0IH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICAgICAgICAgICAgc2V0RHJhZnRVcGRhdGVkQXQocmVzLnVwZGF0ZWRfYXQpXG4gICAgICAgICAgICAgIGhhbmRsZUdldEluaXRpYWxXb3JrZmxvd0RhdGEoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9LCBbbm9kZXNUZW1wbGF0ZSwgZWRnZXNUZW1wbGF0ZSwgd29ya2Zsb3dTdG9yZSwgZGF0YXNldElkXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGhhbmRsZUdldEluaXRpYWxXb3JrZmxvd0RhdGEoKVxuICB9LCBbXSlcblxuICByZXR1cm4ge1xuICAgIGRhdGEsXG4gICAgaXNMb2FkaW5nLFxuICB9XG59XG4iXX0=