"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNodesSyncDraft = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const hooks_1 = require("@/app/components/base/features/hooks");
const use_serial_async_callback_1 = require("@/app/components/workflow/hooks/use-serial-async-callback");
const use_workflow_1 = require("@/app/components/workflow/hooks/use-workflow");
const store_1 = require("@/app/components/workflow/store");
const config_1 = require("@/config");
const workflow_1 = require("@/service/workflow");
const _1 = require(".");
const useNodesSyncDraft = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const featuresStore = (0, hooks_1.useFeaturesStore)();
    const { getNodesReadOnly } = (0, use_workflow_1.useNodesReadOnly)();
    const { handleRefreshWorkflowDraft } = (0, _1.useWorkflowRefreshDraft)();
    const getPostParams = (0, react_1.useCallback)(() => {
        const { getNodes, edges, transform, } = store.getState();
        const nodes = getNodes().filter(node => !node.data?._isTempNode);
        const [x, y, zoom] = transform;
        const { appId, conversationVariables, environmentVariables, syncWorkflowDraftHash, isWorkflowDataLoaded, } = workflowStore.getState();
        if (!appId || !isWorkflowDataLoaded)
            return null;
        const features = featuresStore.getState().features;
        const producedNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((node) => {
                Object.keys(node.data).forEach((key) => {
                    if (key.startsWith('_'))
                        delete node.data[key];
                });
            });
        });
        const producedEdges = (0, immer_1.produce)(edges.filter(edge => !edge.data?._isTemp), (draft) => {
            draft.forEach((edge) => {
                Object.keys(edge.data).forEach((key) => {
                    if (key.startsWith('_'))
                        delete edge.data[key];
                });
            });
        });
        const viewport = { x, y, zoom };
        return {
            url: `/apps/${appId}/workflows/draft`,
            params: {
                graph: {
                    nodes: producedNodes,
                    edges: producedEdges,
                    viewport,
                },
                features: {
                    opening_statement: features.opening?.enabled ? (features.opening?.opening_statement || '') : '',
                    suggested_questions: features.opening?.enabled ? (features.opening?.suggested_questions || []) : [],
                    suggested_questions_after_answer: features.suggested,
                    text_to_speech: features.text2speech,
                    speech_to_text: features.speech2text,
                    retriever_resource: features.citation,
                    sensitive_word_avoidance: features.moderation,
                    file_upload: features.file,
                },
                environment_variables: environmentVariables,
                conversation_variables: conversationVariables,
                hash: syncWorkflowDraftHash,
            },
        };
    }, [store, featuresStore, workflowStore]);
    const syncWorkflowDraftWhenPageClose = (0, react_1.useCallback)(() => {
        if (getNodesReadOnly())
            return;
        const postParams = getPostParams();
        if (postParams)
            navigator.sendBeacon(`${config_1.API_PREFIX}${postParams.url}`, JSON.stringify(postParams.params));
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
    }, [workflowStore, getPostParams, getNodesReadOnly, handleRefreshWorkflowDraft]);
    const doSyncWorkflowDraft = (0, use_serial_async_callback_1.useSerialAsyncCallback)(performSync, getNodesReadOnly);
    return {
        doSyncWorkflowDraft,
        syncWorkflowDraftWhenPageClose,
    };
};
exports.useNodesSyncDraft = useNodesSyncDraft;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW5vZGVzLXN5bmMtZHJhZnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utbm9kZXMtc3luYy1kcmFmdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUN2QyxnRUFBdUU7QUFDdkUseUdBQWtHO0FBQ2xHLCtFQUErRTtBQUMvRSwyREFBa0U7QUFDbEUscUNBQXFDO0FBQ3JDLGlEQUFzRDtBQUN0RCx3QkFBMkM7QUFFcEMsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLEVBQUU7SUFDcEMsTUFBTSxLQUFLLEdBQUcsSUFBQSx1QkFBVyxHQUFFLENBQUE7SUFDM0IsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQ3hDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxJQUFBLCtCQUFnQixHQUFFLENBQUE7SUFDL0MsTUFBTSxFQUFFLDBCQUEwQixFQUFFLEdBQUcsSUFBQSwwQkFBdUIsR0FBRSxDQUFBO0lBRWhFLE1BQU0sYUFBYSxHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDckMsTUFBTSxFQUNKLFFBQVEsRUFDUixLQUFLLEVBQ0wsU0FBUyxHQUNWLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUNoRSxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUE7UUFDOUIsTUFBTSxFQUNKLEtBQUssRUFDTCxxQkFBcUIsRUFDckIsb0JBQW9CLEVBQ3BCLHFCQUFxQixFQUNyQixvQkFBb0IsR0FDckIsR0FBRyxh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QUFFLENBQUE7b0JBQ2hDLENBQUMsQ0FBQyxDQUFBO2dCQUNKLENBQUM7Z0JBQ0QsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUE7WUFDdkIsQ0FBQztvQkFDTyxDQUFDO2dCQUNQLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFBO1lBQ3pCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLENBQUE7SUFFaEYsTUFBTSxtQkFBbUIsR0FBRyxJQUFBLGtEQUFzQixFQUFDLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0lBRWpGLE9BQU87UUFDTCxtQkFBbUI7UUFDbkIsOEJBQThCO0tBQy9CLENBQUE7QUFDSCxDQUFDLENBQUE7QUEzSFksUUFBQSxpQkFBaUIscUJBMkg3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VTdG9yZUFwaSB9IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IHVzZUZlYXR1cmVzU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMvaG9va3MnXG5pbXBvcnQgeyB1c2VTZXJpYWxBc3luY0NhbGxiYWNrIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcy91c2Utc2VyaWFsLWFzeW5jLWNhbGxiYWNrJ1xuaW1wb3J0IHsgdXNlTm9kZXNSZWFkT25seSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MvdXNlLXdvcmtmbG93J1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBBUElfUFJFRklYIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyBzeW5jV29ya2Zsb3dEcmFmdCB9IGZyb20gJ0Avc2VydmljZS93b3JrZmxvdydcbmltcG9ydCB7IHVzZVdvcmtmbG93UmVmcmVzaERyYWZ0IH0gZnJvbSAnLidcblxuZXhwb3J0IGNvbnN0IHVzZU5vZGVzU3luY0RyYWZ0ID0gKCkgPT4ge1xuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuICBjb25zdCBmZWF0dXJlc1N0b3JlID0gdXNlRmVhdHVyZXNTdG9yZSgpXG4gIGNvbnN0IHsgZ2V0Tm9kZXNSZWFkT25seSB9ID0gdXNlTm9kZXNSZWFkT25seSgpXG4gIGNvbnN0IHsgaGFuZGxlUmVmcmVzaFdvcmtmbG93RHJhZnQgfSA9IHVzZVdvcmtmbG93UmVmcmVzaERyYWZ0KClcblxuICBjb25zdCBnZXRQb3N0UGFyYW1zID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGdldE5vZGVzLFxuICAgICAgZWRnZXMsXG4gICAgICB0cmFuc2Zvcm0sXG4gICAgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKCkuZmlsdGVyKG5vZGUgPT4gIW5vZGUuZGF0YT8uX2lzVGVtcE5vZGUpXG4gICAgY29uc3QgW3gsIHksIHpvb21dID0gdHJhbnNmb3JtXG4gICAgY29uc3Qge1xuICAgICAgYXBwSWQsXG4gICAgICBjb252ZXJzYXRpb25WYXJpYWJsZXMsXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICAgIHN5bmNXb3JrZmxvd0RyYWZ0SGFzaCxcbiAgICAgIGlzV29ya2Zsb3dEYXRhTG9hZGVkLFxuICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcblxuICAgIGlmICghYXBwSWQgfHwgIWlzV29ya2Zsb3dEYXRhTG9hZGVkKVxuICAgICAgcmV0dXJuIG51bGxcblxuICAgIGNvbnN0IGZlYXR1cmVzID0gZmVhdHVyZXNTdG9yZSEuZ2V0U3RhdGUoKS5mZWF0dXJlc1xuICAgIGNvbnN0IHByb2R1Y2VkTm9kZXMgPSBwcm9kdWNlKG5vZGVzLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMobm9kZS5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ18nKSlcbiAgICAgICAgICAgIGRlbGV0ZSBub2RlLmRhdGFba2V5XVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICAgIGNvbnN0IHByb2R1Y2VkRWRnZXMgPSBwcm9kdWNlKGVkZ2VzLmZpbHRlcihlZGdlID0+ICFlZGdlLmRhdGE/Ll9pc1RlbXApLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmZvckVhY2goKGVkZ2UpID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMoZWRnZS5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoJ18nKSlcbiAgICAgICAgICAgIGRlbGV0ZSBlZGdlLmRhdGFba2V5XVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICAgIGNvbnN0IHZpZXdwb3J0ID0geyB4LCB5LCB6b29tIH1cblxuICAgIHJldHVybiB7XG4gICAgICB1cmw6IGAvYXBwcy8ke2FwcElkfS93b3JrZmxvd3MvZHJhZnRgLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIGdyYXBoOiB7XG4gICAgICAgICAgbm9kZXM6IHByb2R1Y2VkTm9kZXMsXG4gICAgICAgICAgZWRnZXM6IHByb2R1Y2VkRWRnZXMsXG4gICAgICAgICAgdmlld3BvcnQsXG4gICAgICAgIH0sXG4gICAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgICAgb3BlbmluZ19zdGF0ZW1lbnQ6IGZlYXR1cmVzLm9wZW5pbmc/LmVuYWJsZWQgPyAoZmVhdHVyZXMub3BlbmluZz8ub3BlbmluZ19zdGF0ZW1lbnQgfHwgJycpIDogJycsXG4gICAgICAgICAgc3VnZ2VzdGVkX3F1ZXN0aW9uczogZmVhdHVyZXMub3BlbmluZz8uZW5hYmxlZCA/IChmZWF0dXJlcy5vcGVuaW5nPy5zdWdnZXN0ZWRfcXVlc3Rpb25zIHx8IFtdKSA6IFtdLFxuICAgICAgICAgIHN1Z2dlc3RlZF9xdWVzdGlvbnNfYWZ0ZXJfYW5zd2VyOiBmZWF0dXJlcy5zdWdnZXN0ZWQsXG4gICAgICAgICAgdGV4dF90b19zcGVlY2g6IGZlYXR1cmVzLnRleHQyc3BlZWNoLFxuICAgICAgICAgIHNwZWVjaF90b190ZXh0OiBmZWF0dXJlcy5zcGVlY2gydGV4dCxcbiAgICAgICAgICByZXRyaWV2ZXJfcmVzb3VyY2U6IGZlYXR1cmVzLmNpdGF0aW9uLFxuICAgICAgICAgIHNlbnNpdGl2ZV93b3JkX2F2b2lkYW5jZTogZmVhdHVyZXMubW9kZXJhdGlvbixcbiAgICAgICAgICBmaWxlX3VwbG9hZDogZmVhdHVyZXMuZmlsZSxcbiAgICAgICAgfSxcbiAgICAgICAgZW52aXJvbm1lbnRfdmFyaWFibGVzOiBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICAgICAgY29udmVyc2F0aW9uX3ZhcmlhYmxlczogY29udmVyc2F0aW9uVmFyaWFibGVzLFxuICAgICAgICBoYXNoOiBzeW5jV29ya2Zsb3dEcmFmdEhhc2gsXG4gICAgICB9LFxuICAgIH1cbiAgfSwgW3N0b3JlLCBmZWF0dXJlc1N0b3JlLCB3b3JrZmxvd1N0b3JlXSlcblxuICBjb25zdCBzeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IHBvc3RQYXJhbXMgPSBnZXRQb3N0UGFyYW1zKClcblxuICAgIGlmIChwb3N0UGFyYW1zKVxuICAgICAgbmF2aWdhdG9yLnNlbmRCZWFjb24oYCR7QVBJX1BSRUZJWH0ke3Bvc3RQYXJhbXMudXJsfWAsIEpTT04uc3RyaW5naWZ5KHBvc3RQYXJhbXMucGFyYW1zKSlcbiAgfSwgW2dldFBvc3RQYXJhbXMsIGdldE5vZGVzUmVhZE9ubHldKVxuXG4gIGNvbnN0IHBlcmZvcm1TeW5jID0gdXNlQ2FsbGJhY2soYXN5bmMgKFxuICAgIG5vdFJlZnJlc2hXaGVuU3luY0Vycm9yPzogYm9vbGVhbixcbiAgICBjYWxsYmFjaz86IHtcbiAgICAgIG9uU3VjY2Vzcz86ICgpID0+IHZvaWRcbiAgICAgIG9uRXJyb3I/OiAoKSA9PiB2b2lkXG4gICAgICBvblNldHRsZWQ/OiAoKSA9PiB2b2lkXG4gICAgfSxcbiAgKSA9PiB7XG4gICAgaWYgKGdldE5vZGVzUmVhZE9ubHkoKSlcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IHBvc3RQYXJhbXMgPSBnZXRQb3N0UGFyYW1zKClcblxuICAgIGlmIChwb3N0UGFyYW1zKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIHNldFN5bmNXb3JrZmxvd0RyYWZ0SGFzaCxcbiAgICAgICAgc2V0RHJhZnRVcGRhdGVkQXQsXG4gICAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBzeW5jV29ya2Zsb3dEcmFmdChwb3N0UGFyYW1zKVxuICAgICAgICBzZXRTeW5jV29ya2Zsb3dEcmFmdEhhc2gocmVzLmhhc2gpXG4gICAgICAgIHNldERyYWZ0VXBkYXRlZEF0KHJlcy51cGRhdGVkX2F0KVxuICAgICAgICBjYWxsYmFjaz8ub25TdWNjZXNzPy4oKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICAgICAgaWYgKGVycm9yICYmIGVycm9yLmpzb24gJiYgIWVycm9yLmJvZHlVc2VkKSB7XG4gICAgICAgICAgZXJyb3IuanNvbigpLnRoZW4oKGVycjogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdkcmFmdF93b3JrZmxvd19ub3Rfc3luYycgJiYgIW5vdFJlZnJlc2hXaGVuU3luY0Vycm9yKVxuICAgICAgICAgICAgICBoYW5kbGVSZWZyZXNoV29ya2Zsb3dEcmFmdCgpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjaz8ub25FcnJvcj8uKClcbiAgICAgIH1cbiAgICAgIGZpbmFsbHkge1xuICAgICAgICBjYWxsYmFjaz8ub25TZXR0bGVkPy4oKVxuICAgICAgfVxuICAgIH1cbiAgfSwgW3dvcmtmbG93U3RvcmUsIGdldFBvc3RQYXJhbXMsIGdldE5vZGVzUmVhZE9ubHksIGhhbmRsZVJlZnJlc2hXb3JrZmxvd0RyYWZ0XSlcblxuICBjb25zdCBkb1N5bmNXb3JrZmxvd0RyYWZ0ID0gdXNlU2VyaWFsQXN5bmNDYWxsYmFjayhwZXJmb3JtU3luYywgZ2V0Tm9kZXNSZWFkT25seSlcblxuICByZXR1cm4ge1xuICAgIGRvU3luY1dvcmtmbG93RHJhZnQsXG4gICAgc3luY1dvcmtmbG93RHJhZnRXaGVuUGFnZUNsb3NlLFxuICB9XG59XG4iXX0=