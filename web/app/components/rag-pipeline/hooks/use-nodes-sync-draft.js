"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNodesSyncDraft = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const use_serial_async_callback_1 = require("@/app/components/workflow/hooks/use-serial-async-callback");
const use_workflow_1 = require("@/app/components/workflow/hooks/use-workflow");
const store_1 = require("@/app/components/workflow/store");
const config_1 = require("@/config");
const workflow_1 = require("@/service/workflow");
const _1 = require(".");
const useNodesSyncDraft = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { getNodesReadOnly } = (0, use_workflow_1.useNodesReadOnly)();
    const { handleRefreshWorkflowDraft } = (0, _1.usePipelineRefreshDraft)();
    const getPostParams = (0, react_1.useCallback)(() => {
        const { getNodes, edges, transform, } = store.getState();
        const nodesOriginal = getNodes();
        const nodes = nodesOriginal.filter(node => !node.data._isTempNode);
        const [x, y, zoom] = transform;
        const { pipelineId, environmentVariables, syncWorkflowDraftHash, ragPipelineVariables, } = workflowStore.getState();
        if (pipelineId && !!nodes.length) {
            const producedNodes = (0, immer_1.produce)(nodes, (draft) => {
                draft.forEach((node) => {
                    Object.keys(node.data).forEach((key) => {
                        if (key.startsWith('_'))
                            delete node.data[key];
                    });
                });
            });
            const producedEdges = (0, immer_1.produce)(edges, (draft) => {
                draft.forEach((edge) => {
                    Object.keys(edge.data).forEach((key) => {
                        if (key.startsWith('_'))
                            delete edge.data[key];
                    });
                });
            });
            return {
                url: `/rag/pipelines/${pipelineId}/workflows/draft`,
                params: {
                    graph: {
                        nodes: producedNodes,
                        edges: producedEdges,
                        viewport: {
                            x,
                            y,
                            zoom,
                        },
                    },
                    environment_variables: environmentVariables,
                    rag_pipeline_variables: ragPipelineVariables,
                    hash: syncWorkflowDraftHash,
                },
            };
        }
    }, [store, workflowStore]);
    const syncWorkflowDraftWhenPageClose = (0, react_1.useCallback)(() => {
        if (getNodesReadOnly())
            return;
        const postParams = getPostParams();
        if (postParams) {
            navigator.sendBeacon(`${config_1.API_PREFIX}${postParams.url}`, JSON.stringify(postParams.params));
        }
    }, [getPostParams, getNodesReadOnly]);
    const performSync = (0, react_1.useCallback)(async (notRefreshWhenSyncError, callback) => {
        if (getNodesReadOnly())
            return;
        const postParams = getPostParams();
        if (postParams) {
            const { setSyncWorkflowDraftHash, setDraftUpdatedAt, } = workflowStore.getState();
            try {
                const res = await (0, workflow_1.syncWorkflowDraft)(postParams);
                setSyncWorkflowDraftHash(res.hash);
                setDraftUpdatedAt(res.updated_at);
                callback?.onSuccess?.();
            }
            catch (error) {
                if (error && error.json && !error.bodyUsed) {
                    error.json().then((err) => {
                        if (err.code === 'draft_workflow_not_sync' && !notRefreshWhenSyncError)
                            handleRefreshWorkflowDraft();
                    });
                }
                callback?.onError?.();
            }
            finally {
                callback?.onSettled?.();
            }
        }
    }, [getPostParams, getNodesReadOnly, workflowStore, handleRefreshWorkflowDraft]);
    const doSyncWorkflowDraft = (0, use_serial_async_callback_1.useSerialAsyncCallback)(performSync, getNodesReadOnly);
    return {
        doSyncWorkflowDraft,
        syncWorkflowDraftWhenPageClose,
    };
};
exports.useNodesSyncDraft = useNodesSyncDraft;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW5vZGVzLXN5bmMtZHJhZnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utbm9kZXMtc3luYy1kcmFmdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUN2Qyx5R0FBa0c7QUFDbEcsK0VBRXFEO0FBQ3JELDJEQUV3QztBQUN4QyxxQ0FBcUM7QUFDckMsaURBQXNEO0FBQ3RELHdCQUEyQztBQUVwQyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRTtJQUNwQyxNQUFNLEtBQUssR0FBRyxJQUFBLHVCQUFXLEdBQUUsQ0FBQTtJQUMzQixNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDeEMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsSUFBQSwrQkFBZ0IsR0FBRSxDQUFBO0lBQy9DLE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxHQUFHLElBQUEsMEJBQXVCLEdBQUUsQ0FBQTtJQUVoRSxNQUFNLGFBQWEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3JDLE1BQU0sRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLFNBQVMsR0FDVixHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNwQixNQUFNLGFBQWEsR0FBRyxRQUFRLEVBQUUsQ0FBQTtRQUNoQyxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2xFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQTtRQUM5QixNQUFNLEVBQ0osVUFBVSxFQUNWLG9CQUFvQixFQUNwQixxQkFBcUIsRUFDckIsb0JBQW9CLEdBQ3JCLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRTVCLElBQUksVUFB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QUNqQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQTtZQUN6QixDQUFDO1lBQ0QsT0FBTyxLQUFVLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDM0MsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO3dCQUM3QixJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUsseUJBQXlCLElBQUksQ0FBQyx1QkFBdUI7NEJBQ3BFLDBCQUEwQixFQUFFLENBQUE7b0JBQ2hDLENBQUMsQ0FBQyxDQUFBO2dCQUNKLENBQUM7Z0JBQ0QsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUE7WUFDdkIsQ0FBQztvQkFDTyxDQUFDO2dCQUNQLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFBO1lBQ3pCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLENBQUE7SUFFaEYsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLGtEQUFzQixFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0lBRWpGLE9BQU87UUFDTCxtQkFBbUI7UUFDbkIsOEJBQThCO0tBQy9CLENBQUE7QUFDSCxDQUFDLENBQUE7QUFwSFksUUFBQSxpQkFBaUIscUJBb0g3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VTdG9yZUFwaSB9IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IHVzZVNlcmlhbEFzeW5jQ2FsbGJhY2sgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1zZXJpYWwtYXN5bmMtY2FsbGJhY2snXG5pbXBvcnQge1xuICB1c2VOb2Rlc1JlYWRPbmx5LFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS13b3JrZmxvdydcbmltcG9ydCB7XG4gIHVzZVdvcmtmbG93U3RvcmUsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBBUElfUFJFRklYIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyBzeW5jV29ya2Zsb3dEcmFmdCB9IGZyb20gJ0Avc2VydmljZS93b3JrZmxvdydcbmltcG9ydCB7IHVzZVBpcGVsaW5lUmVmcmVzaERyYWZ0IH0gZnJvbSAnLidcblxuZXhwb3J0IGNvbnN0IHVzZU5vZGVzU3luY0RyYWZ0ID0gKCkgPT4ge1xuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCB7IGdldE5vZGVzUmVhZE9ubHkgfSA9IHVzZU5vZGVzUmVhZE9ubHkoKVxuICBjb25zdCB7IGhhbmRsZVJlZnJlc2hXb3JrZmxvd0RyYWZ0IH0gPSB1c2VQaXBlbGluZVJlZnJlc2hEcmFmdCgpXG5cbiAgY29uc3QgZ2V0UG9zdFBhcmFtcyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICAgIGVkZ2VzLFxuICAgICAgdHJhbnNmb3JtLFxuICAgIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qgbm9kZXNPcmlnaW5hbCA9IGdldE5vZGVzKClcbiAgICBjb25zdCBub2RlcyA9IG5vZGVzT3JpZ2luYWwuZmlsdGVyKG5vZGUgPT4gIW5vZGUuZGF0YS5faXNUZW1wTm9kZSlcbiAgICBjb25zdCBbeCwgeSwgem9vbV0gPSB0cmFuc2Zvcm1cbiAgICBjb25zdCB7XG4gICAgICBwaXBlbGluZUlkLFxuICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXMsXG4gICAgICBzeW5jV29ya2Zsb3dEcmFmdEhhc2gsXG4gICAgICByYWdQaXBlbGluZVZhcmlhYmxlcyxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICBpZiAocGlwZWxpbmVJZCAmJiAhIW5vZGVzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcHJvZHVjZWROb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgICBkcmFmdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgT2JqZWN0LmtleXMobm9kZS5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aCgnXycpKVxuICAgICAgICAgICAgICBkZWxldGUgbm9kZS5kYXRhW2tleV1cbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb2R1Y2VkRWRnZXMgPSBwcm9kdWNlKGVkZ2VzLCAoZHJhZnQpID0+IHtcbiAgICAgICAgZHJhZnQuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgICAgICAgIE9iamVjdC5rZXlzKGVkZ2UuZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ18nKSlcbiAgICAgICAgICAgICAgZGVsZXRlIGVkZ2UuZGF0YVtrZXldXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICByZXR1cm4ge1xuICAgICAgICB1cmw6IGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lSWR9L3dvcmtmbG93cy9kcmFmdGAsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGdyYXBoOiB7XG4gICAgICAgICAgICBub2RlczogcHJvZHVjZWROb2RlcyxcbiAgICAgICAgICAgIGVkZ2VzOiBwcm9kdWNlZEVkZ2VzLFxuICAgICAgICAgICAgdmlld3BvcnQ6IHtcbiAgICAgICAgICAgICAgeCxcbiAgICAgICAgICAgICAgeSxcbiAgICAgICAgICAgICAgem9vbSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbnZpcm9ubWVudF92YXJpYWJsZXM6IGVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgICAgIHJhZ19waXBlbGluZV92YXJpYWJsZXM6IHJhZ1BpcGVsaW5lVmFyaWFibGVzLFxuICAgICAgICAgIGhhc2g6IHN5bmNXb3JrZmxvd0RyYWZ0SGFzaCxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICB9XG4gIH0sIFtzdG9yZSwgd29ya2Zsb3dTdG9yZV0pXG5cbiAgY29uc3Qgc3luY1dvcmtmbG93RHJhZnRXaGVuUGFnZUNsb3NlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChnZXROb2Rlc1JlYWRPbmx5KCkpXG4gICAgICByZXR1cm5cbiAgICBjb25zdCBwb3N0UGFyYW1zID0gZ2V0UG9zdFBhcmFtcygpXG5cbiAgICBpZiAocG9zdFBhcmFtcykge1xuICAgICAgbmF2aWdhdG9yLnNlbmRCZWFjb24oXG4gICAgICAgIGAke0FQSV9QUkVGSVh9JHtwb3N0UGFyYW1zLnVybH1gLFxuICAgICAgICBKU09OLnN0cmluZ2lmeShwb3N0UGFyYW1zLnBhcmFtcyksXG4gICAgICApXG4gICAgfVxuICB9LCBbZ2V0UG9zdFBhcmFtcywgZ2V0Tm9kZXNSZWFkT25seV0pXG5cbiAgY29uc3QgcGVyZm9ybVN5bmMgPSB1c2VDYWxsYmFjayhhc3luYyAoXG4gICAgbm90UmVmcmVzaFdoZW5TeW5jRXJyb3I/OiBib29sZWFuLFxuICAgIGNhbGxiYWNrPzoge1xuICAgICAgb25TdWNjZXNzPzogKCkgPT4gdm9pZFxuICAgICAgb25FcnJvcj86ICgpID0+IHZvaWRcbiAgICAgIG9uU2V0dGxlZD86ICgpID0+IHZvaWRcbiAgICB9LFxuICApID0+IHtcbiAgICBpZiAoZ2V0Tm9kZXNSZWFkT25seSgpKVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBwb3N0UGFyYW1zID0gZ2V0UG9zdFBhcmFtcygpXG4gICAgaWYgKHBvc3RQYXJhbXMpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgc2V0U3luY1dvcmtmbG93RHJhZnRIYXNoLFxuICAgICAgICBzZXREcmFmdFVwZGF0ZWRBdCxcbiAgICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHN5bmNXb3JrZmxvd0RyYWZ0KHBvc3RQYXJhbXMpXG4gICAgICAgIHNldFN5bmNXb3JrZmxvd0RyYWZ0SGFzaChyZXMuaGFzaClcbiAgICAgICAgc2V0RHJhZnRVcGRhdGVkQXQocmVzLnVwZGF0ZWRfYXQpXG4gICAgICAgIGNhbGxiYWNrPy5vblN1Y2Nlc3M/LigpXG4gICAgICB9XG4gICAgICBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICBpZiAoZXJyb3IgJiYgZXJyb3IuanNvbiAmJiAhZXJyb3IuYm9keVVzZWQpIHtcbiAgICAgICAgICBlcnJvci5qc29uKCkudGhlbigoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ2RyYWZ0X3dvcmtmbG93X25vdF9zeW5jJyAmJiAhbm90UmVmcmVzaFdoZW5TeW5jRXJyb3IpXG4gICAgICAgICAgICAgIGhhbmRsZVJlZnJlc2hXb3JrZmxvd0RyYWZ0KClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGNhbGxiYWNrPy5vbkVycm9yPy4oKVxuICAgICAgfVxuICAgICAgZmluYWxseSB7XG4gICAgICAgIGNhbGxiYWNrPy5vblNldHRsZWQ/LigpXG4gICAgICB9XG4gICAgfVxuICB9LCBbZ2V0UG9zdFBhcmFtcywgZ2V0Tm9kZXNSZWFkT25seSwgd29ya2Zsb3dTdG9yZSwgaGFuZGxlUmVmcmVzaFdvcmtmbG93RHJhZnRdKVxuXG4gIGNvbnN0IGRvU3luY1dvcmtmbG93RHJhZnQgPSB1c2VTZXJpYWxBc3luY0NhbGxiYWNrKHBlcmZvcm1TeW5jLCBnZXROb2Rlc1JlYWRPbmx5KVxuXG4gIHJldHVybiB7XG4gICAgZG9TeW5jV29ya2Zsb3dEcmFmdCxcbiAgICBzeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UsXG4gIH1cbn1cbiJdfQ==