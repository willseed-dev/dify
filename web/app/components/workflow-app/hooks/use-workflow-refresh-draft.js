"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowRefreshDraft = void 0;
const react_1 = require("react");
const hooks_1 = require("@/app/components/workflow/hooks");
const store_1 = require("@/app/components/workflow/store");
const workflow_1 = require("@/service/workflow");
const useWorkflowRefreshDraft = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { handleUpdateWorkflowCanvas } = (0, hooks_1.useWorkflowUpdate)();
    const handleRefreshWorkflowDraft = (0, react_1.useCallback)(() => {
        const { appId, setSyncWorkflowDraftHash, setIsSyncingWorkflowDraft, setEnvironmentVariables, setEnvSecrets, setConversationVariables, setIsWorkflowDataLoaded, isWorkflowDataLoaded, debouncedSyncWorkflowDraft, } = workflowStore.getState();
        if (debouncedSyncWorkflowDraft && typeof debouncedSyncWorkflowDraft.cancel === 'function')
            debouncedSyncWorkflowDraft.cancel();
        const wasLoaded = isWorkflowDataLoaded;
        if (wasLoaded)
            setIsWorkflowDataLoaded(false);
        setIsSyncingWorkflowDraft(true);
        (0, workflow_1.fetchWorkflowDraft)(`/apps/${appId}/workflows/draft`)
            .then((response) => {
            // Ensure we have a valid workflow structure with viewport
            const workflowData = {
                nodes: response.graph?.nodes || [],
                edges: response.graph?.edges || [],
                viewport: response.graph?.viewport || { x: 0, y: 0, zoom: 1 },
            };
            handleUpdateWorkflowCanvas(workflowData);
            setSyncWorkflowDraftHash(response.hash);
            setEnvSecrets((response.environment_variables || []).filter(env => env.value_type === 'secret').reduce((acc, env) => {
                acc[env.id] = env.value;
                return acc;
            }, {}));
            setEnvironmentVariables(response.environment_variables?.map(env => env.value_type === 'secret' ? { ...env, value: '[__HIDDEN__]' } : env) || []);
            setConversationVariables(response.conversation_variables || []);
            setIsWorkflowDataLoaded(true);
        })
            .catch(() => {
            if (wasLoaded)
                setIsWorkflowDataLoaded(true);
        })
            .finally(() => {
            setIsSyncingWorkflowDraft(false);
        });
    }, [handleUpdateWorkflowCanvas, workflowStore]);
    return {
        handleRefreshWorkflowDraft,
    };
};
exports.useWorkflowRefreshDraft = useWorkflowRefreshDraft;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LXJlZnJlc2gtZHJhZnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctcmVmcmVzaC1kcmFmdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBbUM7QUFDbkMsMkRBQW1FO0FBQ25FLDJEQUFrRTtBQUNsRSxpREFBdUQ7QUFFaEQsTUFBTSx1QkFBdUIsR0FBRyxHQUFHLEVBQUU7SUFDMUMsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQ3hDLE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxHQUFHLElBQUEseUJBQWlCLEdBQUUsQ0FBQTtJQUUxRCxNQUFNLDBCQUEwQixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDbEQsTUFBTSxFQUNKLEtBQUssRUFDTCx3QkFBd0IsRUFDeEIseUJBQXlCLEVBQ3pCLHVCQUF1QixFQUN2QixhQUFhLEVBQ2Isd0JBQXdCLEVBQ3hCLHVCQUF1QixFQUN2QixvQkFBb0IsRUFDcEIsMEJBQTBCLEdBQzNCLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRTVCLElBQUksMEJBQTBCLElBQUksT0FBUSwwQkFBa0MsQ0FBQyxNQUFNLEtBQUssVUFBVTtZQUMvRiwwQkFBa0MsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUU5QyxNQUFNLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQTtRQUN0QyxJQUFJLFNBQVM7WUFDWCx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNoQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMvQixJQUFBLDZCQUFrQixFQUFDLFNBQVMsS0FBSyxrQkFBa0IsQ0FBQzthQUNqRCxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNqQiwwREFBMEQ7WUFDMUQsTUFBTSxZQUFZLEdBQXdCO2dCQUN4QyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLElBQUksRUFBRTtnQkFDbEMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLEVBQUU7Z0JBQ2xDLFFBQVEsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFO2FBQzlELENBQUE7WUFDRCwwQkFBMEIsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUN4Qyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdkMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUNsSCxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7Z0JBQ3ZCLE9BQU8sR0FBRyxDQUFBO1lBQ1osQ0FBQyxFQUFFLEVBQTRCLENBQUMsQ0FBQyxDQUFBO1lBQ2pDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQ2hKLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUMvRCx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMvQixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxTQUFTO2dCQUNYLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pDLENBQUMsQ0FBQzthQUNELE9BQU8sQ0FBQyxHQUFHLEVBQUU7WUFDWix5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNsQyxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUMsRUFBRSxDQUFDLDBCQUEwQixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFL0MsT0FBTztRQUNMLDBCQUEwQjtLQUMzQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBdERZLFFBQUEsdUJBQXVCLDJCQXNEbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFdvcmtmbG93RGF0YVVwZGF0ZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVdvcmtmbG93VXBkYXRlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcbmltcG9ydCB7IHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHsgZmV0Y2hXb3JrZmxvd0RyYWZ0IH0gZnJvbSAnQC9zZXJ2aWNlL3dvcmtmbG93J1xuXG5leHBvcnQgY29uc3QgdXNlV29ya2Zsb3dSZWZyZXNoRHJhZnQgPSAoKSA9PiB7XG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3QgeyBoYW5kbGVVcGRhdGVXb3JrZmxvd0NhbnZhcyB9ID0gdXNlV29ya2Zsb3dVcGRhdGUoKVxuXG4gIGNvbnN0IGhhbmRsZVJlZnJlc2hXb3JrZmxvd0RyYWZ0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGFwcElkLFxuICAgICAgc2V0U3luY1dvcmtmbG93RHJhZnRIYXNoLFxuICAgICAgc2V0SXNTeW5jaW5nV29ya2Zsb3dEcmFmdCxcbiAgICAgIHNldEVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgc2V0RW52U2VjcmV0cyxcbiAgICAgIHNldENvbnZlcnNhdGlvblZhcmlhYmxlcyxcbiAgICAgIHNldElzV29ya2Zsb3dEYXRhTG9hZGVkLFxuICAgICAgaXNXb3JrZmxvd0RhdGFMb2FkZWQsXG4gICAgICBkZWJvdW5jZWRTeW5jV29ya2Zsb3dEcmFmdCxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoZGVib3VuY2VkU3luY1dvcmtmbG93RHJhZnQgJiYgdHlwZW9mIChkZWJvdW5jZWRTeW5jV29ya2Zsb3dEcmFmdCBhcyBhbnkpLmNhbmNlbCA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIChkZWJvdW5jZWRTeW5jV29ya2Zsb3dEcmFmdCBhcyBhbnkpLmNhbmNlbCgpXG5cbiAgICBjb25zdCB3YXNMb2FkZWQgPSBpc1dvcmtmbG93RGF0YUxvYWRlZFxuICAgIGlmICh3YXNMb2FkZWQpXG4gICAgICBzZXRJc1dvcmtmbG93RGF0YUxvYWRlZChmYWxzZSlcbiAgICBzZXRJc1N5bmNpbmdXb3JrZmxvd0RyYWZ0KHRydWUpXG4gICAgZmV0Y2hXb3JrZmxvd0RyYWZ0KGAvYXBwcy8ke2FwcElkfS93b3JrZmxvd3MvZHJhZnRgKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIC8vIEVuc3VyZSB3ZSBoYXZlIGEgdmFsaWQgd29ya2Zsb3cgc3RydWN0dXJlIHdpdGggdmlld3BvcnRcbiAgICAgICAgY29uc3Qgd29ya2Zsb3dEYXRhOiBXb3JrZmxvd0RhdGFVcGRhdGVyID0ge1xuICAgICAgICAgIG5vZGVzOiByZXNwb25zZS5ncmFwaD8ubm9kZXMgfHwgW10sXG4gICAgICAgICAgZWRnZXM6IHJlc3BvbnNlLmdyYXBoPy5lZGdlcyB8fCBbXSxcbiAgICAgICAgICB2aWV3cG9ydDogcmVzcG9uc2UuZ3JhcGg/LnZpZXdwb3J0IHx8IHsgeDogMCwgeTogMCwgem9vbTogMSB9LFxuICAgICAgICB9XG4gICAgICAgIGhhbmRsZVVwZGF0ZVdvcmtmbG93Q2FudmFzKHdvcmtmbG93RGF0YSlcbiAgICAgICAgc2V0U3luY1dvcmtmbG93RHJhZnRIYXNoKHJlc3BvbnNlLmhhc2gpXG4gICAgICAgIHNldEVudlNlY3JldHMoKHJlc3BvbnNlLmVudmlyb25tZW50X3ZhcmlhYmxlcyB8fCBbXSkuZmlsdGVyKGVudiA9PiBlbnYudmFsdWVfdHlwZSA9PT0gJ3NlY3JldCcpLnJlZHVjZSgoYWNjLCBlbnYpID0+IHtcbiAgICAgICAgICBhY2NbZW52LmlkXSA9IGVudi52YWx1ZVxuICAgICAgICAgIHJldHVybiBhY2NcbiAgICAgICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikpXG4gICAgICAgIHNldEVudmlyb25tZW50VmFyaWFibGVzKHJlc3BvbnNlLmVudmlyb25tZW50X3ZhcmlhYmxlcz8ubWFwKGVudiA9PiBlbnYudmFsdWVfdHlwZSA9PT0gJ3NlY3JldCcgPyB7IC4uLmVudiwgdmFsdWU6ICdbX19ISURERU5fX10nIH0gOiBlbnYpIHx8IFtdKVxuICAgICAgICBzZXRDb252ZXJzYXRpb25WYXJpYWJsZXMocmVzcG9uc2UuY29udmVyc2F0aW9uX3ZhcmlhYmxlcyB8fCBbXSlcbiAgICAgICAgc2V0SXNXb3JrZmxvd0RhdGFMb2FkZWQodHJ1ZSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAod2FzTG9hZGVkKVxuICAgICAgICAgIHNldElzV29ya2Zsb3dEYXRhTG9hZGVkKHRydWUpXG4gICAgICB9KVxuICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICBzZXRJc1N5bmNpbmdXb3JrZmxvd0RyYWZ0KGZhbHNlKVxuICAgICAgfSlcbiAgfSwgW2hhbmRsZVVwZGF0ZVdvcmtmbG93Q2FudmFzLCB3b3JrZmxvd1N0b3JlXSlcblxuICByZXR1cm4ge1xuICAgIGhhbmRsZVJlZnJlc2hXb3JrZmxvd0RyYWZ0LFxuICB9XG59XG4iXX0=