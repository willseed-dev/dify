"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoGenerateWebhookUrl = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const store_1 = require("@/app/components/app/store");
const types_1 = require("@/app/components/workflow/types");
const apps_1 = require("@/service/apps");
const useAutoGenerateWebhookUrl = () => {
    const reactFlowStore = (0, reactflow_1.useStoreApi)();
    return (0, react_1.useCallback)(async (nodeId) => {
        const appId = store_1.useStore.getState().appDetail?.id;
        if (!appId)
            return;
        const { getNodes } = reactFlowStore.getState();
        const node = getNodes().find(n => n.id === nodeId);
        if (!node || node.data.type !== types_1.BlockEnum.TriggerWebhook)
            return;
        if (node.data.webhook_url && node.data.webhook_url.length > 0)
            return;
        try {
            const response = await (0, apps_1.fetchWebhookUrl)({ appId, nodeId });
            const { getNodes: getLatestNodes, setNodes } = reactFlowStore.getState();
            let hasUpdated = false;
            const updatedNodes = (0, immer_1.produce)(getLatestNodes(), (draft) => {
                const targetNode = draft.find(n => n.id === nodeId);
                if (!targetNode || targetNode.data.type !== types_1.BlockEnum.TriggerWebhook)
                    return;
                targetNode.data = {
                    ...targetNode.data,
                    webhook_url: response.webhook_url,
                    webhook_debug_url: response.webhook_debug_url,
                };
                hasUpdated = true;
            });
            if (hasUpdated)
                setNodes(updatedNodes);
        }
        catch (error) {
            console.error('Failed to auto-generate webhook URL:', error);
        }
    }, [reactFlowStore]);
};
exports.useAutoGenerateWebhookUrl = useAutoGenerateWebhookUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWF1dG8tZ2VuZXJhdGUtd2ViaG9vay11cmwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtYXV0by1nZW5lcmF0ZS13ZWJob29rLXVybC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUN2QyxzREFBb0U7QUFDcEUsMkRBQTJEO0FBQzNELHlDQUFnRDtBQUV6QyxNQUFNLHlCQUF5QixHQUFHLEdBQUcsRUFBRTtJQUM1QyxNQUFNLGNBQWMsR0FBRyxJQUFBLHVCQUFXLEdBQUUsQ0FBQTtJQUVwQyxPQUFPLElBQUEsbUJBQVcsRUFBQyxLQUFLLEVBQUUsTUFBYyxFQUFFLEVBQUU7UUFDMUMsTUFBTSxLQUFLLEdBQUcsZ0JBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFBO1FBQ2xELElBQUksQ0FBQyxLQUFLO1lBQ1IsT0FBTTtRQUVSLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDOUMsTUFBTSxJQUFJLEdBQUcsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsQ0FBQTtRQUNsRCxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsY0FBYztZQUN0RCxPQUFNO1FBRVIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUMzRCxPQUFNO1FBRVIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHNCQUFlLEVBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtZQUN6RCxNQUFNLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDeEUsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFBO1lBQ3RCLE1BQU0sWUFBWSxHQUFHLElBQUEsZUFBTyxFQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3ZELE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFBO2dCQUNuRCxJQUFJLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsY0FBYztvQkFDbEUsT0FBTTtnQkFFUixVQUFVLENBQUMsSUFBSSxHQUFHO29CQUNoQixHQUFHLFVBQVUsQ0FBQyxJQUFJO29CQUNsQixXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVc7b0JBQ2pDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxpQkFBaUI7aUJBQzlDLENBQUE7Z0JBQ0QsVUFBVSxHQUFHLElBQUksQ0FBQTtZQUNuQixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUksVUFBVTtnQkFDWixRQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDMUIsQ0FBQztRQUNELE9BQU8sS0FBYyxFQUFFLENBQUM7WUFDdEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM5RCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQTtBQUN0QixDQUFDLENBQUE7QUF4Q1ksUUFBQSx5QkFBeUIsNkJBd0NyQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VTdG9yZUFwaSB9IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IHVzZVN0b3JlIGFzIHVzZUFwcFN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvc3RvcmUnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgZmV0Y2hXZWJob29rVXJsIH0gZnJvbSAnQC9zZXJ2aWNlL2FwcHMnXG5cbmV4cG9ydCBjb25zdCB1c2VBdXRvR2VuZXJhdGVXZWJob29rVXJsID0gKCkgPT4ge1xuICBjb25zdCByZWFjdEZsb3dTdG9yZSA9IHVzZVN0b3JlQXBpKClcblxuICByZXR1cm4gdXNlQ2FsbGJhY2soYXN5bmMgKG5vZGVJZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgYXBwSWQgPSB1c2VBcHBTdG9yZS5nZXRTdGF0ZSgpLmFwcERldGFpbD8uaWRcbiAgICBpZiAoIWFwcElkKVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCB7IGdldE5vZGVzIH0gPSByZWFjdEZsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qgbm9kZSA9IGdldE5vZGVzKCkuZmluZChuID0+IG4uaWQgPT09IG5vZGVJZClcbiAgICBpZiAoIW5vZGUgfHwgbm9kZS5kYXRhLnR5cGUgIT09IEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vaylcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKG5vZGUuZGF0YS53ZWJob29rX3VybCAmJiBub2RlLmRhdGEud2ViaG9va191cmwubGVuZ3RoID4gMClcbiAgICAgIHJldHVyblxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2hXZWJob29rVXJsKHsgYXBwSWQsIG5vZGVJZCB9KVxuICAgICAgY29uc3QgeyBnZXROb2RlczogZ2V0TGF0ZXN0Tm9kZXMsIHNldE5vZGVzIH0gPSByZWFjdEZsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBsZXQgaGFzVXBkYXRlZCA9IGZhbHNlXG4gICAgICBjb25zdCB1cGRhdGVkTm9kZXMgPSBwcm9kdWNlKGdldExhdGVzdE5vZGVzKCksIChkcmFmdCkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXROb2RlID0gZHJhZnQuZmluZChuID0+IG4uaWQgPT09IG5vZGVJZClcbiAgICAgICAgaWYgKCF0YXJnZXROb2RlIHx8IHRhcmdldE5vZGUuZGF0YS50eXBlICE9PSBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2spXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgdGFyZ2V0Tm9kZS5kYXRhID0ge1xuICAgICAgICAgIC4uLnRhcmdldE5vZGUuZGF0YSxcbiAgICAgICAgICB3ZWJob29rX3VybDogcmVzcG9uc2Uud2ViaG9va191cmwsXG4gICAgICAgICAgd2ViaG9va19kZWJ1Z191cmw6IHJlc3BvbnNlLndlYmhvb2tfZGVidWdfdXJsLFxuICAgICAgICB9XG4gICAgICAgIGhhc1VwZGF0ZWQgPSB0cnVlXG4gICAgICB9KVxuXG4gICAgICBpZiAoaGFzVXBkYXRlZClcbiAgICAgICAgc2V0Tm9kZXModXBkYXRlZE5vZGVzKVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBhdXRvLWdlbmVyYXRlIHdlYmhvb2sgVVJMOicsIGVycm9yKVxuICAgIH1cbiAgfSwgW3JlYWN0Rmxvd1N0b3JlXSlcbn1cbiJdfQ==