"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowVariableType = exports.useWorkflowVariables = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const reactflow_1 = require("reactflow");
const utils_1 = require("@/app/components/workflow/nodes/_base/components/variable/utils");
const use_tools_1 = require("@/service/use-tools");
const use_match_schema_type_1 = require("../nodes/_base/components/variable/use-match-schema-type");
const store_1 = require("../store");
const use_workflow_1 = require("./use-workflow");
const useWorkflowVariables = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { schemaTypeDefinitions } = (0, use_match_schema_type_1.default)();
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const { data: mcpTools } = (0, use_tools_1.useAllMCPTools)();
    const getNodeAvailableVars = (0, react_1.useCallback)(({ parentNode, beforeNodes, isChatMode, filterVar, hideEnv, hideChatVar, }) => {
        const { conversationVariables, environmentVariables, ragPipelineVariables, dataSourceList, } = workflowStore.getState();
        return (0, utils_1.toNodeAvailableVars)({
            parentNode,
            t,
            beforeNodes,
            isChatMode,
            environmentVariables: hideEnv ? [] : environmentVariables,
            conversationVariables: (isChatMode && !hideChatVar) ? conversationVariables : [],
            ragVariables: ragPipelineVariables,
            filterVar,
            allPluginInfoList: {
                buildInTools: buildInTools || [],
                customTools: customTools || [],
                workflowTools: workflowTools || [],
                mcpTools: mcpTools || [],
                dataSourceList: dataSourceList || [],
            },
            schemaTypeDefinitions,
        });
    }, [t, workflowStore, schemaTypeDefinitions, buildInTools, customTools, workflowTools, mcpTools]);
    const getCurrentVariableType = (0, react_1.useCallback)(({ parentNode, valueSelector, isIterationItem, isLoopItem, availableNodes, isChatMode, isConstant, preferSchemaType, }) => {
        const { conversationVariables, environmentVariables, ragPipelineVariables, dataSourceList, } = workflowStore.getState();
        return (0, utils_1.getVarType)({
            parentNode,
            valueSelector,
            isIterationItem,
            isLoopItem,
            availableNodes,
            isChatMode,
            isConstant,
            environmentVariables,
            conversationVariables,
            ragVariables: ragPipelineVariables,
            allPluginInfoList: {
                buildInTools: buildInTools || [],
                customTools: customTools || [],
                workflowTools: workflowTools || [],
                mcpTools: mcpTools || [],
                dataSourceList: dataSourceList ?? [],
            },
            schemaTypeDefinitions,
            preferSchemaType,
        });
    }, [workflowStore, utils_1.getVarType, schemaTypeDefinitions, buildInTools, customTools, workflowTools, mcpTools]);
    return {
        getNodeAvailableVars,
        getCurrentVariableType,
    };
};
exports.useWorkflowVariables = useWorkflowVariables;
const useWorkflowVariableType = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const { getNodes, } = store.getState();
    const { getCurrentVariableType } = (0, exports.useWorkflowVariables)();
    const isChatMode = (0, use_workflow_1.useIsChatMode)();
    const getVarType = ({ nodeId, valueSelector, }) => {
        const node = getNodes().find(n => n.id === nodeId);
        const isInIteration = !!node?.data.isInIteration;
        const iterationNode = isInIteration ? getNodes().find(n => n.id === node.parentId) : null;
        const availableNodes = [node];
        const type = getCurrentVariableType({
            parentNode: iterationNode,
            valueSelector,
            availableNodes,
            isChatMode,
            isConstant: false,
        });
        return type;
    };
    return getVarType;
};
exports.useWorkflowVariableType = useWorkflowVariableType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LXZhcmlhYmxlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS13b3JrZmxvdy12YXJpYWJsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsaUNBQW1DO0FBQ25DLGlEQUE4QztBQUM5Qyx5Q0FBdUM7QUFDdkMsMkZBQWlIO0FBQ2pILG1EQUs0QjtBQUM1QixvR0FBeUY7QUFDekYsb0NBQTJDO0FBQzNDLGlEQUE4QztBQUV2QyxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUN2QyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQ3hDLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxHQUFHLElBQUEsK0JBQWtCLEdBQUUsQ0FBQTtJQUV0RCxNQUFNLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUEsOEJBQWtCLEdBQUUsQ0FBQTtJQUNuRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUEsNkJBQWlCLEdBQUUsQ0FBQTtJQUNqRCxNQUFNLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxHQUFHLElBQUEsK0JBQW1CLEdBQUUsQ0FBQTtJQUNyRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsMEJBQWMsR0FBRSxDQUFBO0lBRTNDLE1BQU0sb0JBQW9CLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsRUFDeEMsVUFBVSxFQUNWLFdBQVcsRUFDWCxVQUFVLEVBQ1YsU0FBUyxFQUNULE9BQU8sRUFDUCxXQUFXLEdBUVosRUFBbUIsRUFBRTtRQUNwQixNQUFNLEVBQ0oscUJBQXFCLEVBQ3JCLG9CQUFvQixFQUNwQixvQkFBb0IsRUFDcEIsY0FBYyxHQUNmLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzVCLE9BQU8sSUFBQSwy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QTtRQUNoRCxNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDekYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUU3QixNQUFNLElBQUksR0FBRyxzQkFBc0IsQ0FBQztZQUNsQyxVQUFVLEVBQUUsYUFBYTtZQUN6QixhQUFhO1lBQ2IsY0FBYztZQUNkLFVBQVU7WUFDVixVQUFVLEVBQUUsS0FBSztTQUNsQixDQUFDLENBQUE7UUFDRixPQUFPLElBQXVCLENBQUE7SUFDaEMsQ0FBQyxDQUFBO0lBRUQsT0FBTyxVQUFVLENBQUE7QUFDbkIsQ0FBQyxDQUFBO0FBaENZLFFBQUEsdUJBQXVCLDJCQWdDbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFR5cGUgfSBmcm9tICcuLi9ub2Rlcy9sbG0vdHlwZXMnXG5pbXBvcnQgdHlwZSB7XG4gIE5vZGUsXG4gIE5vZGVPdXRQdXRWYXIsXG4gIFZhbHVlU2VsZWN0b3IsXG4gIFZhcixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VTdG9yZUFwaSB9IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IGdldFZhclR5cGUsIHRvTm9kZUF2YWlsYWJsZVZhcnMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL19iYXNlL2NvbXBvbmVudHMvdmFyaWFibGUvdXRpbHMnXG5pbXBvcnQge1xuICB1c2VBbGxCdWlsdEluVG9vbHMsXG4gIHVzZUFsbEN1c3RvbVRvb2xzLFxuICB1c2VBbGxNQ1BUb29scyxcbiAgdXNlQWxsV29ya2Zsb3dUb29scyxcbn0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10b29scydcbmltcG9ydCB1c2VNYXRjaFNjaGVtYVR5cGUgZnJvbSAnLi4vbm9kZXMvX2Jhc2UvY29tcG9uZW50cy92YXJpYWJsZS91c2UtbWF0Y2gtc2NoZW1hLXR5cGUnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnLi4vc3RvcmUnXG5pbXBvcnQgeyB1c2VJc0NoYXRNb2RlIH0gZnJvbSAnLi91c2Utd29ya2Zsb3cnXG5cbmV4cG9ydCBjb25zdCB1c2VXb3JrZmxvd1ZhcmlhYmxlcyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3QgeyBzY2hlbWFUeXBlRGVmaW5pdGlvbnMgfSA9IHVzZU1hdGNoU2NoZW1hVHlwZSgpXG5cbiAgY29uc3QgeyBkYXRhOiBidWlsZEluVG9vbHMgfSA9IHVzZUFsbEJ1aWx0SW5Ub29scygpXG4gIGNvbnN0IHsgZGF0YTogY3VzdG9tVG9vbHMgfSA9IHVzZUFsbEN1c3RvbVRvb2xzKClcbiAgY29uc3QgeyBkYXRhOiB3b3JrZmxvd1Rvb2xzIH0gPSB1c2VBbGxXb3JrZmxvd1Rvb2xzKClcbiAgY29uc3QgeyBkYXRhOiBtY3BUb29scyB9ID0gdXNlQWxsTUNQVG9vbHMoKVxuXG4gIGNvbnN0IGdldE5vZGVBdmFpbGFibGVWYXJzID0gdXNlQ2FsbGJhY2soKHtcbiAgICBwYXJlbnROb2RlLFxuICAgIGJlZm9yZU5vZGVzLFxuICAgIGlzQ2hhdE1vZGUsXG4gICAgZmlsdGVyVmFyLFxuICAgIGhpZGVFbnYsXG4gICAgaGlkZUNoYXRWYXIsXG4gIH06IHtcbiAgICBwYXJlbnROb2RlPzogTm9kZSB8IG51bGxcbiAgICBiZWZvcmVOb2RlczogTm9kZVtdXG4gICAgaXNDaGF0TW9kZTogYm9vbGVhblxuICAgIGZpbHRlclZhcjogKHBheWxvYWQ6IFZhciwgc2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpID0+IGJvb2xlYW5cbiAgICBoaWRlRW52PzogYm9vbGVhblxuICAgIGhpZGVDaGF0VmFyPzogYm9vbGVhblxuICB9KTogTm9kZU91dFB1dFZhcltdID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBjb252ZXJzYXRpb25WYXJpYWJsZXMsXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICAgIHJhZ1BpcGVsaW5lVmFyaWFibGVzLFxuICAgICAgZGF0YVNvdXJjZUxpc3QsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgIHJldHVybiB0b05vZGVBdmFpbGFibGVWYXJzKHtcbiAgICAgIHBhcmVudE5vZGUsXG4gICAgICB0LFxuICAgICAgYmVmb3JlTm9kZXMsXG4gICAgICBpc0NoYXRNb2RlLFxuICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IGhpZGVFbnYgPyBbXSA6IGVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgY29udmVyc2F0aW9uVmFyaWFibGVzOiAoaXNDaGF0TW9kZSAmJiAhaGlkZUNoYXRWYXIpID8gY29udmVyc2F0aW9uVmFyaWFibGVzIDogW10sXG4gICAgICByYWdWYXJpYWJsZXM6IHJhZ1BpcGVsaW5lVmFyaWFibGVzLFxuICAgICAgZmlsdGVyVmFyLFxuICAgICAgYWxsUGx1Z2luSW5mb0xpc3Q6IHtcbiAgICAgICAgYnVpbGRJblRvb2xzOiBidWlsZEluVG9vbHMgfHwgW10sXG4gICAgICAgIGN1c3RvbVRvb2xzOiBjdXN0b21Ub29scyB8fCBbXSxcbiAgICAgICAgd29ya2Zsb3dUb29sczogd29ya2Zsb3dUb29scyB8fCBbXSxcbiAgICAgICAgbWNwVG9vbHM6IG1jcFRvb2xzIHx8IFtdLFxuICAgICAgICBkYXRhU291cmNlTGlzdDogZGF0YVNvdXJjZUxpc3QgfHwgW10sXG4gICAgICB9LFxuICAgICAgc2NoZW1hVHlwZURlZmluaXRpb25zLFxuICAgIH0pXG4gIH0sIFt0LCB3b3JrZmxvd1N0b3JlLCBzY2hlbWFUeXBlRGVmaW5pdGlvbnMsIGJ1aWxkSW5Ub29scywgY3VzdG9tVG9vbHMsIHdvcmtmbG93VG9vbHMsIG1jcFRvb2xzXSlcblxuICBjb25zdCBnZXRDdXJyZW50VmFyaWFibGVUeXBlID0gdXNlQ2FsbGJhY2soKHtcbiAgICBwYXJlbnROb2RlLFxuICAgIHZhbHVlU2VsZWN0b3IsXG4gICAgaXNJdGVyYXRpb25JdGVtLFxuICAgIGlzTG9vcEl0ZW0sXG4gICAgYXZhaWxhYmxlTm9kZXMsXG4gICAgaXNDaGF0TW9kZSxcbiAgICBpc0NvbnN0YW50LFxuICAgIHByZWZlclNjaGVtYVR5cGUsXG4gIH06IHtcbiAgICB2YWx1ZVNlbGVjdG9yOiBWYWx1ZVNlbGVjdG9yXG4gICAgcGFyZW50Tm9kZT86IE5vZGUgfCBudWxsXG4gICAgaXNJdGVyYXRpb25JdGVtPzogYm9vbGVhblxuICAgIGlzTG9vcEl0ZW0/OiBib29sZWFuXG4gICAgYXZhaWxhYmxlTm9kZXM6IGFueVtdXG4gICAgaXNDaGF0TW9kZTogYm9vbGVhblxuICAgIGlzQ29uc3RhbnQ/OiBib29sZWFuXG4gICAgcHJlZmVyU2NoZW1hVHlwZT86IGJvb2xlYW5cbiAgfSkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbnZlcnNhdGlvblZhcmlhYmxlcyxcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgcmFnUGlwZWxpbmVWYXJpYWJsZXMsXG4gICAgICBkYXRhU291cmNlTGlzdCxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGdldFZhclR5cGUoe1xuICAgICAgcGFyZW50Tm9kZSxcbiAgICAgIHZhbHVlU2VsZWN0b3IsXG4gICAgICBpc0l0ZXJhdGlvbkl0ZW0sXG4gICAgICBpc0xvb3BJdGVtLFxuICAgICAgYXZhaWxhYmxlTm9kZXMsXG4gICAgICBpc0NoYXRNb2RlLFxuICAgICAgaXNDb25zdGFudCxcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzLFxuICAgICAgY29udmVyc2F0aW9uVmFyaWFibGVzLFxuICAgICAgcmFnVmFyaWFibGVzOiByYWdQaXBlbGluZVZhcmlhYmxlcyxcbiAgICAgIGFsbFBsdWdpbkluZm9MaXN0OiB7XG4gICAgICAgIGJ1aWxkSW5Ub29sczogYnVpbGRJblRvb2xzIHx8IFtdLFxuICAgICAgICBjdXN0b21Ub29sczogY3VzdG9tVG9vbHMgfHwgW10sXG4gICAgICAgIHdvcmtmbG93VG9vbHM6IHdvcmtmbG93VG9vbHMgfHwgW10sXG4gICAgICAgIG1jcFRvb2xzOiBtY3BUb29scyB8fCBbXSxcbiAgICAgICAgZGF0YVNvdXJjZUxpc3Q6IGRhdGFTb3VyY2VMaXN0ID8/IFtdLFxuICAgICAgfSxcbiAgICAgIHNjaGVtYVR5cGVEZWZpbml0aW9ucyxcbiAgICAgIHByZWZlclNjaGVtYVR5cGUsXG4gICAgfSlcbiAgfSwgW3dvcmtmbG93U3RvcmUsIGdldFZhclR5cGUsIHNjaGVtYVR5cGVEZWZpbml0aW9ucywgYnVpbGRJblRvb2xzLCBjdXN0b21Ub29scywgd29ya2Zsb3dUb29scywgbWNwVG9vbHNdKVxuXG4gIHJldHVybiB7XG4gICAgZ2V0Tm9kZUF2YWlsYWJsZVZhcnMsXG4gICAgZ2V0Q3VycmVudFZhcmlhYmxlVHlwZSxcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdXNlV29ya2Zsb3dWYXJpYWJsZVR5cGUgPSAoKSA9PiB7XG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuICBjb25zdCB7XG4gICAgZ2V0Tm9kZXMsXG4gIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gIGNvbnN0IHsgZ2V0Q3VycmVudFZhcmlhYmxlVHlwZSB9ID0gdXNlV29ya2Zsb3dWYXJpYWJsZXMoKVxuXG4gIGNvbnN0IGlzQ2hhdE1vZGUgPSB1c2VJc0NoYXRNb2RlKClcblxuICBjb25zdCBnZXRWYXJUeXBlID0gKHtcbiAgICBub2RlSWQsXG4gICAgdmFsdWVTZWxlY3RvcixcbiAgfToge1xuICAgIG5vZGVJZDogc3RyaW5nXG4gICAgdmFsdWVTZWxlY3RvcjogVmFsdWVTZWxlY3RvclxuICB9KSA9PiB7XG4gICAgY29uc3Qgbm9kZSA9IGdldE5vZGVzKCkuZmluZChuID0+IG4uaWQgPT09IG5vZGVJZClcbiAgICBjb25zdCBpc0luSXRlcmF0aW9uID0gISFub2RlPy5kYXRhLmlzSW5JdGVyYXRpb25cbiAgICBjb25zdCBpdGVyYXRpb25Ob2RlID0gaXNJbkl0ZXJhdGlvbiA/IGdldE5vZGVzKCkuZmluZChuID0+IG4uaWQgPT09IG5vZGUucGFyZW50SWQpIDogbnVsbFxuICAgIGNvbnN0IGF2YWlsYWJsZU5vZGVzID0gW25vZGVdXG5cbiAgICBjb25zdCB0eXBlID0gZ2V0Q3VycmVudFZhcmlhYmxlVHlwZSh7XG4gICAgICBwYXJlbnROb2RlOiBpdGVyYXRpb25Ob2RlLFxuICAgICAgdmFsdWVTZWxlY3RvcixcbiAgICAgIGF2YWlsYWJsZU5vZGVzLFxuICAgICAgaXNDaGF0TW9kZSxcbiAgICAgIGlzQ29uc3RhbnQ6IGZhbHNlLFxuICAgIH0pXG4gICAgcmV0dXJuIHR5cGUgYXMgdW5rbm93biBhcyBUeXBlXG4gIH1cblxuICByZXR1cm4gZ2V0VmFyVHlwZVxufVxuIl19