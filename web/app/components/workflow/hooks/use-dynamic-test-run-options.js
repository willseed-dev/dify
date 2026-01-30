"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDynamicTestRunOptions = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const workflow_1 = require("@/app/components/base/icons/src/vender/workflow");
const use_nodes_1 = require("@/app/components/workflow/store/workflow/use-nodes");
const use_triggers_1 = require("@/service/use-triggers");
const block_icon_1 = require("../block-icon");
const test_run_menu_1 = require("../header/test-run-menu");
const store_1 = require("../store");
const types_1 = require("../types");
const workflow_entry_1 = require("../utils/workflow-entry");
const useDynamicTestRunOptions = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const nodes = (0, use_nodes_1.default)();
    const buildInTools = (0, store_1.useStore)(s => s.buildInTools);
    const customTools = (0, store_1.useStore)(s => s.customTools);
    const workflowTools = (0, store_1.useStore)(s => s.workflowTools);
    const mcpTools = (0, store_1.useStore)(s => s.mcpTools);
    const { data: triggerPlugins } = (0, use_triggers_1.useAllTriggerPlugins)();
    return (0, react_1.useMemo)(() => {
        const allTriggers = [];
        let userInput;
        for (const node of nodes) {
            const nodeData = node.data;
            if (!nodeData?.type)
                continue;
            if (nodeData.type === types_1.BlockEnum.Start) {
                userInput = {
                    id: node.id,
                    type: test_run_menu_1.TriggerType.UserInput,
                    name: nodeData.title || t('blocks.start', { ns: 'workflow' }),
                    icon: (<block_icon_1.default type={types_1.BlockEnum.Start} size="md"/>),
                    nodeId: node.id,
                    enabled: true,
                };
            }
            else if (nodeData.type === types_1.BlockEnum.TriggerSchedule) {
                allTriggers.push({
                    id: node.id,
                    type: test_run_menu_1.TriggerType.Schedule,
                    name: nodeData.title || t('blocks.trigger-schedule', { ns: 'workflow' }),
                    icon: (<block_icon_1.default type={types_1.BlockEnum.TriggerSchedule} size="md"/>),
                    nodeId: node.id,
                    enabled: true,
                });
            }
            else if (nodeData.type === types_1.BlockEnum.TriggerWebhook) {
                allTriggers.push({
                    id: node.id,
                    type: test_run_menu_1.TriggerType.Webhook,
                    name: nodeData.title || t('blocks.trigger-webhook', { ns: 'workflow' }),
                    icon: (<block_icon_1.default type={types_1.BlockEnum.TriggerWebhook} size="md"/>),
                    nodeId: node.id,
                    enabled: true,
                });
            }
            else if (nodeData.type === types_1.BlockEnum.TriggerPlugin) {
                let triggerIcon;
                if (nodeData.provider_id) {
                    const targetTriggers = triggerPlugins || [];
                    triggerIcon = targetTriggers.find(toolWithProvider => toolWithProvider.name === nodeData.provider_id)?.icon;
                }
                const icon = (<block_icon_1.default type={types_1.BlockEnum.TriggerPlugin} size="md" toolIcon={triggerIcon}/>);
                allTriggers.push({
                    id: node.id,
                    type: test_run_menu_1.TriggerType.Plugin,
                    name: nodeData.title || nodeData.plugin_name || t('blocks.trigger-plugin', { ns: 'workflow' }),
                    icon,
                    nodeId: node.id,
                    enabled: true,
                });
            }
        }
        if (!userInput) {
            const startNode = (0, workflow_entry_1.getWorkflowEntryNode)(nodes);
            if (startNode && startNode.data?.type === types_1.BlockEnum.Start) {
                userInput = {
                    id: startNode.id,
                    type: test_run_menu_1.TriggerType.UserInput,
                    name: startNode.data?.title || t('blocks.start', { ns: 'workflow' }),
                    icon: (<block_icon_1.default type={types_1.BlockEnum.Start} size="md"/>),
                    nodeId: startNode.id,
                    enabled: true,
                };
            }
        }
        const triggerNodeIds = allTriggers
            .map(trigger => trigger.nodeId)
            .filter((nodeId) => Boolean(nodeId));
        const runAll = triggerNodeIds.length > 1
            ? {
                id: 'run-all',
                type: test_run_menu_1.TriggerType.All,
                name: t('common.runAllTriggers', { ns: 'workflow' }),
                icon: (<div className="flex h-6 w-6 items-center justify-center rounded-lg border-[0.5px] border-white/2 bg-util-colors-purple-purple-500 text-white shadow-md">
              <workflow_1.TriggerAll className="h-4.5 w-4.5"/>
            </div>),
                relatedNodeIds: triggerNodeIds,
                enabled: true,
            }
            : undefined;
        return {
            userInput,
            triggers: allTriggers,
            runAll,
        };
    }, [nodes, buildInTools, customTools, workflowTools, mcpTools, triggerPlugins, t]);
};
exports.useDynamicTestRunOptions = useDynamicTestRunOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWR5bmFtaWMtdGVzdC1ydW4tb3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1keW5hbWljLXRlc3QtcnVuLW9wdGlvbnMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUErQjtBQUMvQixpREFBOEM7QUFDOUMsOEVBQTRFO0FBQzVFLGtGQUF5RTtBQUN6RSx5REFBNkQ7QUFDN0QsOENBQXFDO0FBQ3JDLDJEQUFxRDtBQUNyRCxvQ0FBbUM7QUFDbkMsb0NBQW9DO0FBQ3BDLDREQUE4RDtBQUV2RCxNQUFNLHdCQUF3QixHQUFHLEdBQW1CLEVBQUU7SUFDM0QsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUEsbUJBQVEsR0FBRSxDQUFBO0lBQ3hCLE1BQU0sWUFBWSxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUNsRCxNQUFNLFdBQVcsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDaEQsTUFBTSxhQUFhLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ3BELE1BQU0sUUFBUSxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMxQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxHQUFHLElBQUEsbUNBQW9CLEdBQUUsQ0FBQTtJQUV2RCxPQUFPLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUNsQixNQUFNLFdBQVcsR0FBb0IsRUFBRSxDQUFBO1FBQ3ZDLElBQUksU0FBb0MsQ0FBQTtRQUV4QyxLQUFLLE1BQU0sSUFB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LENBQUMsTUFBTSxFQUFvQixFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7UUFFeEQsTUFBTSxNQUFNLEdBQThCLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNqRSxDQUFDLENBQUM7Z0JBQ0UsRUFBRSxFQUFFLFNBQVM7Z0JBQ2IsSUFBSSxFQUFFLDJCQUFXLENBQUMsR0FBRztnQkFDckIsSUFBSSxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztnQkFDcEQsSUFBSSxFQUFFLENBQ0osQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlJQUF5SSxDQUN0SjtjQUFBLENBQUMscUJBQVUsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUNyQztZQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7Z0JBQ0QsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLE9BQU8sRUFBRSxJQUFJO2FBQ2Q7WUFDSCxDQUFDLENBQUMsU0FBUyxDQUFBO1FBRWIsT0FBTztZQUNMLFNBQVM7WUFDVCxRQUFRLEVBQUUsV0FBVztZQUNyQixNQUFNO1NBQ1AsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEYsQ0FBQyxDQUFBO0FBdklZLFFBQUEsd0JBQXdCLDRCQXVJcEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFRlc3RSdW5PcHRpb25zLCBUcmlnZ2VyT3B0aW9uIH0gZnJvbSAnLi4vaGVhZGVyL3Rlc3QtcnVuLW1lbnUnXG5pbXBvcnQgdHlwZSB7IENvbW1vbk5vZGVUeXBlIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBUcmlnZ2VyQWxsIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvd29ya2Zsb3cnXG5pbXBvcnQgdXNlTm9kZXMgZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZS93b3JrZmxvdy91c2Utbm9kZXMnXG5pbXBvcnQgeyB1c2VBbGxUcmlnZ2VyUGx1Z2lucyB9IGZyb20gJ0Avc2VydmljZS91c2UtdHJpZ2dlcnMnXG5pbXBvcnQgQmxvY2tJY29uIGZyb20gJy4uL2Jsb2NrLWljb24nXG5pbXBvcnQgeyBUcmlnZ2VyVHlwZSB9IGZyb20gJy4uL2hlYWRlci90ZXN0LXJ1bi1tZW51J1xuaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICcuLi9zdG9yZSdcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgZ2V0V29ya2Zsb3dFbnRyeU5vZGUgfSBmcm9tICcuLi91dGlscy93b3JrZmxvdy1lbnRyeSdcblxuZXhwb3J0IGNvbnN0IHVzZUR5bmFtaWNUZXN0UnVuT3B0aW9ucyA9ICgpOiBUZXN0UnVuT3B0aW9ucyA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBub2RlcyA9IHVzZU5vZGVzKClcbiAgY29uc3QgYnVpbGRJblRvb2xzID0gdXNlU3RvcmUocyA9PiBzLmJ1aWxkSW5Ub29scylcbiAgY29uc3QgY3VzdG9tVG9vbHMgPSB1c2VTdG9yZShzID0+IHMuY3VzdG9tVG9vbHMpXG4gIGNvbnN0IHdvcmtmbG93VG9vbHMgPSB1c2VTdG9yZShzID0+IHMud29ya2Zsb3dUb29scylcbiAgY29uc3QgbWNwVG9vbHMgPSB1c2VTdG9yZShzID0+IHMubWNwVG9vbHMpXG4gIGNvbnN0IHsgZGF0YTogdHJpZ2dlclBsdWdpbnMgfSA9IHVzZUFsbFRyaWdnZXJQbHVnaW5zKClcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgYWxsVHJpZ2dlcnM6IFRyaWdnZXJPcHRpb25bXSA9IFtdXG4gICAgbGV0IHVzZXJJbnB1dDogVHJpZ2dlck9wdGlvbiB8IHVuZGVmaW5lZFxuXG4gICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICBjb25zdCBub2RlRGF0YSA9IG5vZGUuZGF0YSBhcyBDb21tb25Ob2RlVHlwZVxuXG4gICAgICBpZiAoIW5vZGVEYXRhPy50eXBlKVxuICAgICAgICBjb250aW51ZVxuXG4gICAgICBpZiAobm9kZURhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlN0YXJ0KSB7XG4gICAgICAgIHVzZXJJbnB1dCA9IHtcbiAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICB0eXBlOiBUcmlnZ2VyVHlwZS5Vc2VySW5wdXQsXG4gICAgICAgICAgbmFtZTogbm9kZURhdGEudGl0bGUgfHwgdCgnYmxvY2tzLnN0YXJ0JywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICAgICAgICBpY29uOiAoXG4gICAgICAgICAgICA8QmxvY2tJY29uXG4gICAgICAgICAgICAgIHR5cGU9e0Jsb2NrRW51bS5TdGFydH1cbiAgICAgICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSxcbiAgICAgICAgICBub2RlSWQ6IG5vZGUuaWQsXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAobm9kZURhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZSkge1xuICAgICAgICBhbGxUcmlnZ2Vycy5wdXNoKHtcbiAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICB0eXBlOiBUcmlnZ2VyVHlwZS5TY2hlZHVsZSxcbiAgICAgICAgICBuYW1lOiBub2RlRGF0YS50aXRsZSB8fCB0KCdibG9ja3MudHJpZ2dlci1zY2hlZHVsZScsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgaWNvbjogKFxuICAgICAgICAgICAgPEJsb2NrSWNvblxuICAgICAgICAgICAgICB0eXBlPXtCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlfVxuICAgICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApLFxuICAgICAgICAgIG5vZGVJZDogbm9kZS5pZCxcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZWxzZSBpZiAobm9kZURhdGEudHlwZSA9PT0gQmxvY2tFbnVtLlRyaWdnZXJXZWJob29rKSB7XG4gICAgICAgIGFsbFRyaWdnZXJzLnB1c2goe1xuICAgICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICAgIHR5cGU6IFRyaWdnZXJUeXBlLldlYmhvb2ssXG4gICAgICAgICAgbmFtZTogbm9kZURhdGEudGl0bGUgfHwgdCgnYmxvY2tzLnRyaWdnZXItd2ViaG9vaycsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgaWNvbjogKFxuICAgICAgICAgICAgPEJsb2NrSWNvblxuICAgICAgICAgICAgICB0eXBlPXtCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2t9XG4gICAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICksXG4gICAgICAgICAgbm9kZUlkOiBub2RlLmlkLFxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBlbHNlIGlmIChub2RlRGF0YS50eXBlID09PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbikge1xuICAgICAgICBsZXQgdHJpZ2dlckljb246IHN0cmluZyB8IGFueVxuXG4gICAgICAgIGlmIChub2RlRGF0YS5wcm92aWRlcl9pZCkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldFRyaWdnZXJzID0gdHJpZ2dlclBsdWdpbnMgfHwgW11cbiAgICAgICAgICB0cmlnZ2VySWNvbiA9IHRhcmdldFRyaWdnZXJzLmZpbmQodG9vbFdpdGhQcm92aWRlciA9PiB0b29sV2l0aFByb3ZpZGVyLm5hbWUgPT09IG5vZGVEYXRhLnByb3ZpZGVyX2lkKT8uaWNvblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaWNvbiA9IChcbiAgICAgICAgICA8QmxvY2tJY29uXG4gICAgICAgICAgICB0eXBlPXtCbG9ja0VudW0uVHJpZ2dlclBsdWdpbn1cbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICB0b29sSWNvbj17dHJpZ2dlckljb259XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuXG4gICAgICAgIGFsbFRyaWdnZXJzLnB1c2goe1xuICAgICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICAgIHR5cGU6IFRyaWdnZXJUeXBlLlBsdWdpbixcbiAgICAgICAgICBuYW1lOiBub2RlRGF0YS50aXRsZSB8fCAobm9kZURhdGEgYXMgYW55KS5wbHVnaW5fbmFtZSB8fCB0KCdibG9ja3MudHJpZ2dlci1wbHVnaW4nLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICAgIGljb24sXG4gICAgICAgICAgbm9kZUlkOiBub2RlLmlkLFxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF1c2VySW5wdXQpIHtcbiAgICAgIGNvbnN0IHN0YXJ0Tm9kZSA9IGdldFdvcmtmbG93RW50cnlOb2RlKG5vZGVzIGFzIGFueVtdKVxuICAgICAgaWYgKHN0YXJ0Tm9kZSAmJiBzdGFydE5vZGUuZGF0YT8udHlwZSA9PT0gQmxvY2tFbnVtLlN0YXJ0KSB7XG4gICAgICAgIHVzZXJJbnB1dCA9IHtcbiAgICAgICAgICBpZDogc3RhcnROb2RlLmlkLFxuICAgICAgICAgIHR5cGU6IFRyaWdnZXJUeXBlLlVzZXJJbnB1dCxcbiAgICAgICAgICBuYW1lOiAoc3RhcnROb2RlLmRhdGEgYXMgQ29tbW9uTm9kZVR5cGUpPy50aXRsZSB8fCB0KCdibG9ja3Muc3RhcnQnLCB7IG5zOiAnd29ya2Zsb3cnIH0pLFxuICAgICAgICAgIGljb246IChcbiAgICAgICAgICAgIDxCbG9ja0ljb25cbiAgICAgICAgICAgICAgdHlwZT17QmxvY2tFbnVtLlN0YXJ0fVxuICAgICAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApLFxuICAgICAgICAgIG5vZGVJZDogc3RhcnROb2RlLmlkLFxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0cmlnZ2VyTm9kZUlkcyA9IGFsbFRyaWdnZXJzXG4gICAgICAubWFwKHRyaWdnZXIgPT4gdHJpZ2dlci5ub2RlSWQpXG4gICAgICAuZmlsdGVyKChub2RlSWQpOiBub2RlSWQgaXMgc3RyaW5nID0+IEJvb2xlYW4obm9kZUlkKSlcblxuICAgIGNvbnN0IHJ1bkFsbDogVHJpZ2dlck9wdGlvbiB8IHVuZGVmaW5lZCA9IHRyaWdnZXJOb2RlSWRzLmxlbmd0aCA+IDFcbiAgICAgID8ge1xuICAgICAgICAgIGlkOiAncnVuLWFsbCcsXG4gICAgICAgICAgdHlwZTogVHJpZ2dlclR5cGUuQWxsLFxuICAgICAgICAgIG5hbWU6IHQoJ2NvbW1vbi5ydW5BbGxUcmlnZ2VycycsIHsgbnM6ICd3b3JrZmxvdycgfSksXG4gICAgICAgICAgaWNvbjogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtNiB3LTYgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbGcgYm9yZGVyLVswLjVweF0gYm9yZGVyLXdoaXRlLzIgYmctdXRpbC1jb2xvcnMtcHVycGxlLXB1cnBsZS01MDAgdGV4dC13aGl0ZSBzaGFkb3ctbWRcIj5cbiAgICAgICAgICAgICAgPFRyaWdnZXJBbGwgY2xhc3NOYW1lPVwiaC00LjUgdy00LjVcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSxcbiAgICAgICAgICByZWxhdGVkTm9kZUlkczogdHJpZ2dlck5vZGVJZHMsXG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgOiB1bmRlZmluZWRcblxuICAgIHJldHVybiB7XG4gICAgICB1c2VySW5wdXQsXG4gICAgICB0cmlnZ2VyczogYWxsVHJpZ2dlcnMsXG4gICAgICBydW5BbGwsXG4gICAgfVxuICB9LCBbbm9kZXMsIGJ1aWxkSW5Ub29scywgY3VzdG9tVG9vbHMsIHdvcmtmbG93VG9vbHMsIG1jcFRvb2xzLCB0cmlnZ2VyUGx1Z2lucywgdF0pXG59XG4iXX0=