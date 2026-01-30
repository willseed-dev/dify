"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePipelineRefreshDraft = void 0;
const react_1 = require("react");
const hooks_1 = require("@/app/components/workflow/hooks");
const store_1 = require("@/app/components/workflow/store");
const workflow_1 = require("@/service/workflow");
const utils_1 = require("../utils");
const usePipelineRefreshDraft = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { handleUpdateWorkflowCanvas } = (0, hooks_1.useWorkflowUpdate)();
    const handleRefreshWorkflowDraft = (0, react_1.useCallback)(() => {
        const { pipelineId, setSyncWorkflowDraftHash, setIsSyncingWorkflowDraft, setEnvironmentVariables, setEnvSecrets, } = workflowStore.getState();
        setIsSyncingWorkflowDraft(true);
        (0, workflow_1.fetchWorkflowDraft)(`/rag/pipelines/${pipelineId}/workflows/draft`).then((response) => {
            const { nodes: processedNodes, viewport, } = (0, utils_1.processNodesWithoutDataSource)(response.graph.nodes, response.graph.viewport);
            handleUpdateWorkflowCanvas({
                ...response.graph,
                nodes: processedNodes,
                viewport,
            });
            setSyncWorkflowDraftHash(response.hash);
            setEnvSecrets((response.environment_variables || []).filter(env => env.value_type === 'secret').reduce((acc, env) => {
                acc[env.id] = env.value;
                return acc;
            }, {}));
            setEnvironmentVariables(response.environment_variables?.map(env => env.value_type === 'secret' ? { ...env, value: '[__HIDDEN__]' } : env) || []);
        }).finally(() => setIsSyncingWorkflowDraft(false));
    }, [handleUpdateWorkflowCanvas, workflowStore]);
    return {
        handleRefreshWorkflowDraft,
    };
};
exports.usePipelineRefreshDraft = usePipelineRefreshDraft;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBpcGVsaW5lLXJlZnJlc2gtZHJhZnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtcGlwZWxpbmUtcmVmcmVzaC1kcmFmdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBbUM7QUFDbkMsMkRBQW1FO0FBQ25FLDJEQUFrRTtBQUNsRSxpREFBdUQ7QUFDdkQsb0NBQXdEO0FBRWpELE1BQU0sdUJBQXVCLEdBQUcsR0FBRyxFQUFFO0lBQzFDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLEVBQUUsMEJBQTBCLEVBQUUsR0FBRyxJQUFBLHlCQUFpQixHQUFFLENBQUE7SUFFMUQsTUFBTSwwQkFBMEIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ2xELE1BQU0sRUFDSixVQUFVLEVBQ1Ysd0JBQXdCLEVBQ3hCLHlCQUF5QixFQUN6Qix1QkFBdUIsRUFDdkIsYUFBYSxHQUNkLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzVCLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9CLElBQUEsNkJBQWtCLEVBQUMsa0JBQWtCLFVBQVUsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNuRixNQUFNLEVBQ0osS0FBSyxFQUFFLGNBQWMsRUFDckIsUUFBUSxHQUNULEdBQUcsSUFBQSxxQ0FBNkIsRUFBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ2hGLDBCQUEwQixDQUFDO2dCQUN6QixHQUFHLFFBQVEsQ0FBQyxLQUFLO2dCQUNqQixLQUFLLEVBQUUsY0FBYztnQkFDckIsUUFBUTthQUNjLENBQUMsQ0FBQTtZQUN6Qix3QkFBd0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdkMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUNsSCxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7Z0JBQ3ZCLE9BQU8sR0FBRyxDQUFBO1lBQ1osQ0FBQyxFQUFFLEVBQTRCLENBQUMsQ0FBQyxDQUFBO1lBQ2pDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ2xKLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQ3BELENBQUMsRUFBRSxDQUFDLDBCQUEwQixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFL0MsT0FBTztRQUNMLDBCQUEwQjtLQUMzQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBbkNZLFFBQUEsdUJBQXVCLDJCQW1DbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFdvcmtmbG93RGF0YVVwZGF0ZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVdvcmtmbG93VXBkYXRlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcbmltcG9ydCB7IHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHsgZmV0Y2hXb3JrZmxvd0RyYWZ0IH0gZnJvbSAnQC9zZXJ2aWNlL3dvcmtmbG93J1xuaW1wb3J0IHsgcHJvY2Vzc05vZGVzV2l0aG91dERhdGFTb3VyY2UgfSBmcm9tICcuLi91dGlscydcblxuZXhwb3J0IGNvbnN0IHVzZVBpcGVsaW5lUmVmcmVzaERyYWZ0ID0gKCkgPT4ge1xuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IHsgaGFuZGxlVXBkYXRlV29ya2Zsb3dDYW52YXMgfSA9IHVzZVdvcmtmbG93VXBkYXRlKClcblxuICBjb25zdCBoYW5kbGVSZWZyZXNoV29ya2Zsb3dEcmFmdCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBwaXBlbGluZUlkLFxuICAgICAgc2V0U3luY1dvcmtmbG93RHJhZnRIYXNoLFxuICAgICAgc2V0SXNTeW5jaW5nV29ya2Zsb3dEcmFmdCxcbiAgICAgIHNldEVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgc2V0RW52U2VjcmV0cyxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgc2V0SXNTeW5jaW5nV29ya2Zsb3dEcmFmdCh0cnVlKVxuICAgIGZldGNoV29ya2Zsb3dEcmFmdChgL3JhZy9waXBlbGluZXMvJHtwaXBlbGluZUlkfS93b3JrZmxvd3MvZHJhZnRgKS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICBub2RlczogcHJvY2Vzc2VkTm9kZXMsXG4gICAgICAgIHZpZXdwb3J0LFxuICAgICAgfSA9IHByb2Nlc3NOb2Rlc1dpdGhvdXREYXRhU291cmNlKHJlc3BvbnNlLmdyYXBoLm5vZGVzLCByZXNwb25zZS5ncmFwaC52aWV3cG9ydClcbiAgICAgIGhhbmRsZVVwZGF0ZVdvcmtmbG93Q2FudmFzKHtcbiAgICAgICAgLi4ucmVzcG9uc2UuZ3JhcGgsXG4gICAgICAgIG5vZGVzOiBwcm9jZXNzZWROb2RlcyxcbiAgICAgICAgdmlld3BvcnQsXG4gICAgICB9IGFzIFdvcmtmbG93RGF0YVVwZGF0ZXIpXG4gICAgICBzZXRTeW5jV29ya2Zsb3dEcmFmdEhhc2gocmVzcG9uc2UuaGFzaClcbiAgICAgIHNldEVudlNlY3JldHMoKHJlc3BvbnNlLmVudmlyb25tZW50X3ZhcmlhYmxlcyB8fCBbXSkuZmlsdGVyKGVudiA9PiBlbnYudmFsdWVfdHlwZSA9PT0gJ3NlY3JldCcpLnJlZHVjZSgoYWNjLCBlbnYpID0+IHtcbiAgICAgICAgYWNjW2Vudi5pZF0gPSBlbnYudmFsdWVcbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikpXG4gICAgICBzZXRFbnZpcm9ubWVudFZhcmlhYmxlcyhyZXNwb25zZS5lbnZpcm9ubWVudF92YXJpYWJsZXM/Lm1hcChlbnYgPT4gZW52LnZhbHVlX3R5cGUgPT09ICdzZWNyZXQnID8geyAuLi5lbnYsIHZhbHVlOiAnW19fSElEREVOX19dJyB9IDogZW52KSB8fCBbXSlcbiAgICB9KS5maW5hbGx5KCgpID0+IHNldElzU3luY2luZ1dvcmtmbG93RHJhZnQoZmFsc2UpKVxuICB9LCBbaGFuZGxlVXBkYXRlV29ya2Zsb3dDYW52YXMsIHdvcmtmbG93U3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlUmVmcmVzaFdvcmtmbG93RHJhZnQsXG4gIH1cbn1cbiJdfQ==