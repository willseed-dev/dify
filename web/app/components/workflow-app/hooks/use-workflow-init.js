"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowInit = void 0;
const react_1 = require("react");
const store_1 = require("@/app/components/app/store");
const store_2 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const use_workflow_1 = require("@/service/use-workflow");
const workflow_1 = require("@/service/workflow");
const app_1 = require("@/types/app");
const use_workflow_template_1 = require("./use-workflow-template");
const hasConnectedUserInput = (nodes = [], edges = []) => {
    const startNodeIds = nodes
        .filter(node => node?.data?.type === types_1.BlockEnum.Start)
        .map(node => node.id);
    if (!startNodeIds.length)
        return false;
    return edges.some(edge => startNodeIds.includes(edge.source));
};
const useWorkflowInit = () => {
    const workflowStore = (0, store_2.useWorkflowStore)();
    const { nodes: nodesTemplate, edges: edgesTemplate, } = (0, use_workflow_template_1.useWorkflowTemplate)();
    const appDetail = (0, store_1.useStore)(state => state.appDetail);
    const setSyncWorkflowDraftHash = (0, store_2.useStore)(s => s.setSyncWorkflowDraftHash);
    const [data, setData] = (0, react_1.useState)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        workflowStore.setState({ appId: appDetail.id, appName: appDetail.name });
    }, [appDetail.id, workflowStore]);
    const handleUpdateWorkflowFileUploadConfig = (0, react_1.useCallback)((config) => {
        const { setFileUploadConfig } = workflowStore.getState();
        setFileUploadConfig(config);
    }, [workflowStore]);
    const { data: fileUploadConfigResponse, isLoading: isFileUploadConfigLoading, } = (0, use_workflow_1.useWorkflowConfig)('/files/upload', handleUpdateWorkflowFileUploadConfig);
    const handleGetInitialWorkflowData = (0, react_1.useCallback)(async () => {
        try {
            const res = await (0, workflow_1.fetchWorkflowDraft)(`/apps/${appDetail.id}/workflows/draft`);
            setData(res);
            workflowStore.setState({
                envSecrets: (res.environment_variables || []).filter(env => env.value_type === 'secret').reduce((acc, env) => {
                    acc[env.id] = env.value;
                    return acc;
                }, {}),
                environmentVariables: res.environment_variables?.map(env => env.value_type === 'secret' ? { ...env, value: '[__HIDDEN__]' } : env) || [],
                conversationVariables: res.conversation_variables || [],
                isWorkflowDataLoaded: true,
            });
            setSyncWorkflowDraftHash(res.hash);
            setIsLoading(false);
        }
        catch (error) {
            if (error && error.json && !error.bodyUsed && appDetail) {
                error.json().then((err) => {
                    if (err.code === 'draft_workflow_not_exist') {
                        const isAdvancedChat = appDetail.mode === app_1.AppModeEnum.ADVANCED_CHAT;
                        workflowStore.setState({
                            notInitialWorkflow: true,
                            showOnboarding: !isAdvancedChat,
                            shouldAutoOpenStartNodeSelector: !isAdvancedChat,
                            hasShownOnboarding: false,
                        });
                        const nodesData = isAdvancedChat ? nodesTemplate : [];
                        const edgesData = isAdvancedChat ? edgesTemplate : [];
                        (0, workflow_1.syncWorkflowDraft)({
                            url: `/apps/${appDetail.id}/workflows/draft`,
                            params: {
                                graph: {
                                    nodes: nodesData,
                                    edges: edgesData,
                                },
                                features: {
                                    retriever_resource: { enabled: true },
                                },
                                environment_variables: [],
                                conversation_variables: [],
                            },
                        }).then((res) => {
                            workflowStore.getState().setDraftUpdatedAt(res.updated_at);
                            handleGetInitialWorkflowData();
                        });
                    }
                });
            }
        }
    }, [appDetail, nodesTemplate, edgesTemplate, workflowStore, setSyncWorkflowDraftHash]);
    (0, react_1.useEffect)(() => {
        handleGetInitialWorkflowData();
    }, []);
    const handleFetchPreloadData = (0, react_1.useCallback)(async () => {
        try {
            const nodesDefaultConfigsData = await (0, workflow_1.fetchNodesDefaultConfigs)(`/apps/${appDetail?.id}/workflows/default-workflow-block-configs`);
            const publishedWorkflow = await (0, workflow_1.fetchPublishedWorkflow)(`/apps/${appDetail?.id}/workflows/publish`);
            workflowStore.setState({
                nodesDefaultConfigs: nodesDefaultConfigsData.reduce((acc, block) => {
                    if (!acc[block.type])
                        acc[block.type] = { ...block.config };
                    return acc;
                }, {}),
            });
            workflowStore.getState().setPublishedAt(publishedWorkflow?.created_at);
            const graph = publishedWorkflow?.graph;
            workflowStore.getState().setLastPublishedHasUserInput(hasConnectedUserInput(graph?.nodes, graph?.edges));
        }
        catch (e) {
            console.error(e);
            workflowStore.getState().setLastPublishedHasUserInput(false);
        }
    }, [workflowStore, appDetail]);
    (0, react_1.useEffect)(() => {
        handleFetchPreloadData();
    }, [handleFetchPreloadData]);
    (0, react_1.useEffect)(() => {
        if (data) {
            workflowStore.getState().setDraftUpdatedAt(data.updated_at);
            workflowStore.getState().setToolPublished(data.tool_published);
        }
    }, [data, workflowStore]);
    return {
        data,
        isLoading: isLoading || isFileUploadConfigLoading,
        fileUploadConfigResponse,
    };
};
exports.useWorkflowInit = useWorkflowInit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LWluaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctaW5pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxpQ0FJYztBQUNkLHNEQUFvRTtBQUNwRSwyREFHd0M7QUFDeEMsMkRBQTJEO0FBQzNELHlEQUEwRDtBQUMxRCxpREFLMkI7QUFDM0IscUNBQXlDO0FBQ3pDLG1FQUE2RDtBQUU3RCxNQUFNLHFCQUFxQixHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFFLFFBQWdCLEVBQUUsRUFBVyxFQUFFO0lBQ2hGLE1BQU0sWUFBWSxHQUFHLEtBQUs7U0FDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEtBQUssaUJBQVMsQ0FBQyxLQUFLLENBQUM7U0FDcEQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRXZCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTTtRQUN0QixPQUFPLEtBQUssQ0FBQTtJQUVkLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7QUFDL0QsQ0FBQyxDQUFBO0FBQ00sTUFBTSxlQUFlLEdBQUcsR0FBRyxFQUFFO0lBQ2xDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLEVBQ0osS0FBSyxFQUFFLGFBQWEsRUFDcEIsS0FBSyxFQUFFLGFBQWEsR0FDckIsR0FBRyxJQUFBLDJDQUFtQixHQUFFLENBQUE7SUFDekIsTUFBTSxTQUFTLEdBQUcsSUFBQSxnQkFBVyxFQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBRSxDQUFBO0lBQ3hELE1BQU0sd0JBQXdCLEdBQUcsSUFBQSxnQkFB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Q0FBQyxDQUFBO1FBQzlELENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtJQUU5QixJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2Isc0JBQXNCLEVBQUUsQ0FBQTtJQUMxQixDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUE7SUFFNUIsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLElBQUksSUFBSSxFQUFFLENBQUM7WUFDVCxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzNELGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDaEUsQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBRXpCLE9BQU87UUFDTCxJQUFJO1FBQ0osU0FBUyxFQUFFLFNBQVMsSUFBSSx5QkFBeUI7UUFDakQsd0JBQXdCO0tBQ3pCLENBQUE7QUFDSCxDQUFDLENBQUE7QUF2SFksUUFBQSxlQUFlLG1CQXVIM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEVkZ2UsIE5vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBGaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2UgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgdHlwZSB7IEZldGNoV29ya2Zsb3dEcmFmdFJlc3BvbnNlIH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxuICB1c2VFZmZlY3QsXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0b3JlIGFzIHVzZUFwcFN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvc3RvcmUnXG5pbXBvcnQge1xuICB1c2VTdG9yZSxcbiAgdXNlV29ya2Zsb3dTdG9yZSxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd0NvbmZpZyB9IGZyb20gJ0Avc2VydmljZS91c2Utd29ya2Zsb3cnXG5pbXBvcnQge1xuICBmZXRjaE5vZGVzRGVmYXVsdENvbmZpZ3MsXG4gIGZldGNoUHVibGlzaGVkV29ya2Zsb3csXG4gIGZldGNoV29ya2Zsb3dEcmFmdCxcbiAgc3luY1dvcmtmbG93RHJhZnQsXG59IGZyb20gJ0Avc2VydmljZS93b3JrZmxvdydcbmltcG9ydCB7IEFwcE1vZGVFbnVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1RlbXBsYXRlIH0gZnJvbSAnLi91c2Utd29ya2Zsb3ctdGVtcGxhdGUnXG5cbmNvbnN0IGhhc0Nvbm5lY3RlZFVzZXJJbnB1dCA9IChub2RlczogTm9kZVtdID0gW10sIGVkZ2VzOiBFZGdlW10gPSBbXSk6IGJvb2xlYW4gPT4ge1xuICBjb25zdCBzdGFydE5vZGVJZHMgPSBub2Rlc1xuICAgIC5maWx0ZXIobm9kZSA9PiBub2RlPy5kYXRhPy50eXBlID09PSBCbG9ja0VudW0uU3RhcnQpXG4gICAgLm1hcChub2RlID0+IG5vZGUuaWQpXG5cbiAgaWYgKCFzdGFydE5vZGVJZHMubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHJldHVybiBlZGdlcy5zb21lKGVkZ2UgPT4gc3RhcnROb2RlSWRzLmluY2x1ZGVzKGVkZ2Uuc291cmNlKSlcbn1cbmV4cG9ydCBjb25zdCB1c2VXb3JrZmxvd0luaXQgPSAoKSA9PiB7XG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3Qge1xuICAgIG5vZGVzOiBub2Rlc1RlbXBsYXRlLFxuICAgIGVkZ2VzOiBlZGdlc1RlbXBsYXRlLFxuICB9ID0gdXNlV29ya2Zsb3dUZW1wbGF0ZSgpXG4gIGNvbnN0IGFwcERldGFpbCA9IHVzZUFwcFN0b3JlKHN0YXRlID0+IHN0YXRlLmFwcERldGFpbCkhXG4gIGNvbnN0IHNldFN5bmNXb3JrZmxvd0RyYWZ0SGFzaCA9IHVzZVN0b3JlKHMgPT4gcy5zZXRTeW5jV29ya2Zsb3dEcmFmdEhhc2gpXG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlPEZldGNoV29ya2Zsb3dEcmFmdFJlc3BvbnNlPigpXG4gIGNvbnN0IFtpc0xvYWRpbmcsIHNldElzTG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKVxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBhcHBJZDogYXBwRGV0YWlsLmlkLCBhcHBOYW1lOiBhcHBEZXRhaWwubmFtZSB9KVxuICB9LCBbYXBwRGV0YWlsLmlkLCB3b3JrZmxvd1N0b3JlXSlcblxuICBjb25zdCBoYW5kbGVVcGRhdGVXb3JrZmxvd0ZpbGVVcGxvYWRDb25maWcgPSB1c2VDYWxsYmFjaygoY29uZmlnOiBGaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2UpID0+IHtcbiAgICBjb25zdCB7IHNldEZpbGVVcGxvYWRDb25maWcgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgIHNldEZpbGVVcGxvYWRDb25maWcoY29uZmlnKVxuICB9LCBbd29ya2Zsb3dTdG9yZV0pXG4gIGNvbnN0IHtcbiAgICBkYXRhOiBmaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2UsXG4gICAgaXNMb2FkaW5nOiBpc0ZpbGVVcGxvYWRDb25maWdMb2FkaW5nLFxuICB9ID0gdXNlV29ya2Zsb3dDb25maWcoJy9maWxlcy91cGxvYWQnLCBoYW5kbGVVcGRhdGVXb3JrZmxvd0ZpbGVVcGxvYWRDb25maWcpXG5cbiAgY29uc3QgaGFuZGxlR2V0SW5pdGlhbFdvcmtmbG93RGF0YSA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2hXb3JrZmxvd0RyYWZ0KGAvYXBwcy8ke2FwcERldGFpbC5pZH0vd29ya2Zsb3dzL2RyYWZ0YClcbiAgICAgIHNldERhdGEocmVzKVxuICAgICAgd29ya2Zsb3dTdG9yZS5zZXRTdGF0ZSh7XG4gICAgICAgIGVudlNlY3JldHM6IChyZXMuZW52aXJvbm1lbnRfdmFyaWFibGVzIHx8IFtdKS5maWx0ZXIoZW52ID0+IGVudi52YWx1ZV90eXBlID09PSAnc2VjcmV0JykucmVkdWNlKChhY2MsIGVudikgPT4ge1xuICAgICAgICAgIGFjY1tlbnYuaWRdID0gZW52LnZhbHVlXG4gICAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSxcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHJlcy5lbnZpcm9ubWVudF92YXJpYWJsZXM/Lm1hcChlbnYgPT4gZW52LnZhbHVlX3R5cGUgPT09ICdzZWNyZXQnID8geyAuLi5lbnYsIHZhbHVlOiAnW19fSElEREVOX19dJyB9IDogZW52KSB8fCBbXSxcbiAgICAgICAgY29udmVyc2F0aW9uVmFyaWFibGVzOiByZXMuY29udmVyc2F0aW9uX3ZhcmlhYmxlcyB8fCBbXSxcbiAgICAgICAgaXNXb3JrZmxvd0RhdGFMb2FkZWQ6IHRydWUsXG4gICAgICB9KVxuICAgICAgc2V0U3luY1dvcmtmbG93RHJhZnRIYXNoKHJlcy5oYXNoKVxuICAgICAgc2V0SXNMb2FkaW5nKGZhbHNlKVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgaWYgKGVycm9yICYmIGVycm9yLmpzb24gJiYgIWVycm9yLmJvZHlVc2VkICYmIGFwcERldGFpbCkge1xuICAgICAgICBlcnJvci5qc29uKCkudGhlbigoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoZXJyLmNvZGUgPT09ICdkcmFmdF93b3JrZmxvd19ub3RfZXhpc3QnKSB7XG4gICAgICAgICAgICBjb25zdCBpc0FkdmFuY2VkQ2hhdCA9IGFwcERldGFpbC5tb2RlID09PSBBcHBNb2RlRW51bS5BRFZBTkNFRF9DSEFUXG4gICAgICAgICAgICB3b3JrZmxvd1N0b3JlLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgbm90SW5pdGlhbFdvcmtmbG93OiB0cnVlLFxuICAgICAgICAgICAgICBzaG93T25ib2FyZGluZzogIWlzQWR2YW5jZWRDaGF0LFxuICAgICAgICAgICAgICBzaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yOiAhaXNBZHZhbmNlZENoYXQsXG4gICAgICAgICAgICAgIGhhc1Nob3duT25ib2FyZGluZzogZmFsc2UsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgY29uc3Qgbm9kZXNEYXRhID0gaXNBZHZhbmNlZENoYXQgPyBub2Rlc1RlbXBsYXRlIDogW11cbiAgICAgICAgICAgIGNvbnN0IGVkZ2VzRGF0YSA9IGlzQWR2YW5jZWRDaGF0ID8gZWRnZXNUZW1wbGF0ZSA6IFtdXG5cbiAgICAgICAgICAgIHN5bmNXb3JrZmxvd0RyYWZ0KHtcbiAgICAgICAgICAgICAgdXJsOiBgL2FwcHMvJHthcHBEZXRhaWwuaWR9L3dvcmtmbG93cy9kcmFmdGAsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGdyYXBoOiB7XG4gICAgICAgICAgICAgICAgICBub2Rlczogbm9kZXNEYXRhLFxuICAgICAgICAgICAgICAgICAgZWRnZXM6IGVkZ2VzRGF0YSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgICAgICAgICAgICByZXRyaWV2ZXJfcmVzb3VyY2U6IHsgZW5hYmxlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRfdmFyaWFibGVzOiBbXSxcbiAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25fdmFyaWFibGVzOiBbXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgICAgICB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKCkuc2V0RHJhZnRVcGRhdGVkQXQocmVzLnVwZGF0ZWRfYXQpXG4gICAgICAgICAgICAgIGhhbmRsZUdldEluaXRpYWxXb3JrZmxvd0RhdGEoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9LCBbYXBwRGV0YWlsLCBub2Rlc1RlbXBsYXRlLCBlZGdlc1RlbXBsYXRlLCB3b3JrZmxvd1N0b3JlLCBzZXRTeW5jV29ya2Zsb3dEcmFmdEhhc2hdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaGFuZGxlR2V0SW5pdGlhbFdvcmtmbG93RGF0YSgpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGhhbmRsZUZldGNoUHJlbG9hZERhdGEgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG5vZGVzRGVmYXVsdENvbmZpZ3NEYXRhID0gYXdhaXQgZmV0Y2hOb2Rlc0RlZmF1bHRDb25maWdzKGAvYXBwcy8ke2FwcERldGFpbD8uaWR9L3dvcmtmbG93cy9kZWZhdWx0LXdvcmtmbG93LWJsb2NrLWNvbmZpZ3NgKVxuICAgICAgY29uc3QgcHVibGlzaGVkV29ya2Zsb3cgPSBhd2FpdCBmZXRjaFB1Ymxpc2hlZFdvcmtmbG93KGAvYXBwcy8ke2FwcERldGFpbD8uaWR9L3dvcmtmbG93cy9wdWJsaXNoYClcbiAgICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoe1xuICAgICAgICBub2Rlc0RlZmF1bHRDb25maWdzOiBub2Rlc0RlZmF1bHRDb25maWdzRGF0YS5yZWR1Y2UoKGFjYywgYmxvY2spID0+IHtcbiAgICAgICAgICBpZiAoIWFjY1tibG9jay50eXBlXSlcbiAgICAgICAgICAgIGFjY1tibG9jay50eXBlXSA9IHsgLi4uYmxvY2suY29uZmlnIH1cbiAgICAgICAgICByZXR1cm4gYWNjXG4gICAgICAgIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIGFueT4pLFxuICAgICAgfSlcbiAgICAgIHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKS5zZXRQdWJsaXNoZWRBdChwdWJsaXNoZWRXb3JrZmxvdz8uY3JlYXRlZF9hdClcbiAgICAgIGNvbnN0IGdyYXBoID0gcHVibGlzaGVkV29ya2Zsb3c/LmdyYXBoXG4gICAgICB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKCkuc2V0TGFzdFB1Ymxpc2hlZEhhc1VzZXJJbnB1dChcbiAgICAgICAgaGFzQ29ubmVjdGVkVXNlcklucHV0KGdyYXBoPy5ub2RlcywgZ3JhcGg/LmVkZ2VzKSxcbiAgICAgIClcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSlcbiAgICAgIHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKS5zZXRMYXN0UHVibGlzaGVkSGFzVXNlcklucHV0KGZhbHNlKVxuICAgIH1cbiAgfSwgW3dvcmtmbG93U3RvcmUsIGFwcERldGFpbF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBoYW5kbGVGZXRjaFByZWxvYWREYXRhKClcbiAgfSwgW2hhbmRsZUZldGNoUHJlbG9hZERhdGFdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKS5zZXREcmFmdFVwZGF0ZWRBdChkYXRhLnVwZGF0ZWRfYXQpXG4gICAgICB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKCkuc2V0VG9vbFB1Ymxpc2hlZChkYXRhLnRvb2xfcHVibGlzaGVkKVxuICAgIH1cbiAgfSwgW2RhdGEsIHdvcmtmbG93U3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgZGF0YSxcbiAgICBpc0xvYWRpbmc6IGlzTG9hZGluZyB8fCBpc0ZpbGVVcGxvYWRDb25maWdMb2FkaW5nLFxuICAgIGZpbGVVcGxvYWRDb25maWdSZXNwb25zZSxcbiAgfVxufVxuIl19