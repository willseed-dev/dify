"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSetWorkflowVarsWithValue = void 0;
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const use_nodes_interactions_without_sync_1 = require("@/app/components/workflow/hooks/use-nodes-interactions-without-sync");
const store_1 = require("@/app/components/workflow/store");
const use_tools_1 = require("@/service/use-tools");
const use_workflow_1 = require("@/service/use-workflow");
const workflow_1 = require("@/service/workflow");
const use_match_schema_type_1 = require("../nodes/_base/components/variable/use-match-schema-type");
const utils_1 = require("../nodes/_base/components/variable/utils");
const useSetWorkflowVarsWithValue = ({ flowType, flowId, }) => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const store = (0, reactflow_1.useStoreApi)();
    const invalidateConversationVarValues = (0, use_workflow_1.useInvalidateConversationVarValues)(flowType, flowId);
    const invalidateSysVarValues = (0, use_workflow_1.useInvalidateSysVarValues)(flowType, flowId);
    const { handleCancelAllNodeSuccessStatus } = (0, use_nodes_interactions_without_sync_1.useNodesInteractionsWithoutSync)();
    const { schemaTypeDefinitions } = (0, use_match_schema_type_1.default)();
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const { data: mcpTools } = (0, use_tools_1.useAllMCPTools)();
    const dataSourceList = (0, store_1.useStore)(s => s.dataSourceList);
    const allPluginInfoList = {
        buildInTools: buildInTools || [],
        customTools: customTools || [],
        workflowTools: workflowTools || [],
        mcpTools: mcpTools || [],
        dataSourceList: dataSourceList || [],
    };
    const setInspectVarsToStore = (inspectVars, passedInAllPluginInfoList, passedInSchemaTypeDefinitions) => {
        const { setNodesWithInspectVars } = workflowStore.getState();
        const { getNodes } = store.getState();
        const nodeArr = getNodes();
        const allNodesOutputVars = (0, utils_1.toNodeOutputVars)(nodeArr, false, () => true, [], [], [], passedInAllPluginInfoList || allPluginInfoList, passedInSchemaTypeDefinitions || schemaTypeDefinitions);
        const nodesKeyValue = {};
        nodeArr.forEach((node) => {
            nodesKeyValue[node.id] = node;
        });
        const withValueNodeIds = {};
        inspectVars.forEach((varItem) => {
            const nodeId = varItem.selector[0];
            const node = nodesKeyValue[nodeId];
            if (!node)
                return;
            withValueNodeIds[nodeId] = true;
        });
        const withValueNodes = Object.keys(withValueNodeIds).map((nodeId) => {
            return nodesKeyValue[nodeId];
        });
        const res = withValueNodes.map((node) => {
            const nodeId = node.id;
            const varsUnderTheNode = inspectVars.filter((varItem) => {
                return varItem.selector[0] === nodeId;
            });
            const nodeVar = allNodesOutputVars.find(item => item.nodeId === nodeId);
            const nodeWithVar = {
                nodeId,
                nodePayload: node.data,
                nodeType: node.data.type,
                title: node.data.title,
                vars: varsUnderTheNode.map((item) => {
                    const schemaType = nodeVar ? nodeVar.vars.find(v => v.variable === item.name)?.schemaType : '';
                    return {
                        ...item,
                        schemaType,
                    };
                }),
                isSingRunRunning: false,
                isValueFetched: false,
            };
            return nodeWithVar;
        });
        setNodesWithInspectVars(res);
    };
    const fetchInspectVars = (0, react_1.useCallback)(async (params) => {
        const { passInVars, vars, passedInAllPluginInfoList, passedInSchemaTypeDefinitions } = params;
        invalidateConversationVarValues();
        invalidateSysVarValues();
        const data = passInVars ? vars : await (0, workflow_1.fetchAllInspectVars)(flowType, flowId);
        setInspectVarsToStore(data, passedInAllPluginInfoList, passedInSchemaTypeDefinitions);
        handleCancelAllNodeSuccessStatus(); // to make sure clear node output show the unset status
    }, [invalidateConversationVarValues, invalidateSysVarValues, flowType, flowId, setInspectVarsToStore, handleCancelAllNodeSuccessStatus, schemaTypeDefinitions, use_match_schema_type_1.getMatchedSchemaType]);
    return {
        fetchInspectVars,
    };
};
exports.useSetWorkflowVarsWithValue = useSetWorkflowVarsWithValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWZldGNoLXdvcmtmbG93LWluc3BlY3QtdmFycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1mZXRjaC13b3JrZmxvdy1pbnNwZWN0LXZhcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUN2Qyw2SEFBcUg7QUFDckgsMkRBQTRFO0FBQzVFLG1EQUs0QjtBQUM1Qix5REFBc0c7QUFDdEcsaURBQXdEO0FBQ3hELG9HQUFtSDtBQUNuSCxvRUFBMkU7QUFPcEUsTUFBTSwyQkFBMkIsR0FBRyxDQUFDLEVBQzFDLFFBQVEsRUFDUixNQUFNLEdBQ0MsRUFBRSxFQUFFO0lBQ1gsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBQzNCLE1BQU0sK0JBQStCLEdBQUcsSUFBQSxpREFBa0MsRUFBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDNUYsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLHdDQUF5QixFQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUMxRSxNQUFNLEVBQUUsZ0NBQWdDLEVBQUUsR0FBRyxJQUFBLHFFQUErQixHQUFFLENBQUE7SUFDOUUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsSUFBQSwrQkFBa0IsR0FBRSxDQUFBO0lBQ3RELE1BQU0sRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBQSw4QkFBa0IsR0FBRSxDQUFBO0lBQ25ELE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBQSw2QkFBaUIsR0FBRSxDQUFBO0lBQ2pELE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEdBQUcsSUFBQSwrQkFBbUIsR0FBRSxDQUFBO0lBQ3JELE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSwwQkFBYyxHQUFFLENB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Q0FBQyxDQUFBO0FBM0ZZLFFBQUEsMkJBQTJCLCtCQTJGdkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGUsIFRvb2xXaXRoUHJvdmlkZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBTY2hlbWFUeXBlRGVmaW5pdGlvbiB9IGZyb20gJ0Avc2VydmljZS91c2UtY29tbW9uJ1xuaW1wb3J0IHR5cGUgeyBGbG93VHlwZSB9IGZyb20gJ0AvdHlwZXMvY29tbW9uJ1xuaW1wb3J0IHR5cGUgeyBOb2RlV2l0aFZhciwgVmFySW5JbnNwZWN0IH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VTdG9yZUFwaSB9IGZyb20gJ3JlYWN0ZmxvdydcbmltcG9ydCB7IHVzZU5vZGVzSW50ZXJhY3Rpb25zV2l0aG91dFN5bmMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1ub2Rlcy1pbnRlcmFjdGlvbnMtd2l0aG91dC1zeW5jJ1xuaW1wb3J0IHsgdXNlU3RvcmUsIHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHtcbiAgdXNlQWxsQnVpbHRJblRvb2xzLFxuICB1c2VBbGxDdXN0b21Ub29scyxcbiAgdXNlQWxsTUNQVG9vbHMsXG4gIHVzZUFsbFdvcmtmbG93VG9vbHMsXG59IGZyb20gJ0Avc2VydmljZS91c2UtdG9vbHMnXG5pbXBvcnQgeyB1c2VJbnZhbGlkYXRlQ29udmVyc2F0aW9uVmFyVmFsdWVzLCB1c2VJbnZhbGlkYXRlU3lzVmFyVmFsdWVzIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS13b3JrZmxvdydcbmltcG9ydCB7IGZldGNoQWxsSW5zcGVjdFZhcnMgfSBmcm9tICdAL3NlcnZpY2Uvd29ya2Zsb3cnXG5pbXBvcnQgdXNlTWF0Y2hTY2hlbWFUeXBlLCB7IGdldE1hdGNoZWRTY2hlbWFUeXBlIH0gZnJvbSAnLi4vbm9kZXMvX2Jhc2UvY29tcG9uZW50cy92YXJpYWJsZS91c2UtbWF0Y2gtc2NoZW1hLXR5cGUnXG5pbXBvcnQgeyB0b05vZGVPdXRwdXRWYXJzIH0gZnJvbSAnLi4vbm9kZXMvX2Jhc2UvY29tcG9uZW50cy92YXJpYWJsZS91dGlscydcblxudHlwZSBQYXJhbXMgPSB7XG4gIGZsb3dUeXBlOiBGbG93VHlwZVxuICBmbG93SWQ6IHN0cmluZ1xufVxuXG5leHBvcnQgY29uc3QgdXNlU2V0V29ya2Zsb3dWYXJzV2l0aFZhbHVlID0gKHtcbiAgZmxvd1R5cGUsXG4gIGZsb3dJZCxcbn06IFBhcmFtcykgPT4ge1xuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuICBjb25zdCBpbnZhbGlkYXRlQ29udmVyc2F0aW9uVmFyVmFsdWVzID0gdXNlSW52YWxpZGF0ZUNvbnZlcnNhdGlvblZhclZhbHVlcyhmbG93VHlwZSwgZmxvd0lkKVxuICBjb25zdCBpbnZhbGlkYXRlU3lzVmFyVmFsdWVzID0gdXNlSW52YWxpZGF0ZVN5c1ZhclZhbHVlcyhmbG93VHlwZSwgZmxvd0lkKVxuICBjb25zdCB7IGhhbmRsZUNhbmNlbEFsbE5vZGVTdWNjZXNzU3RhdHVzIH0gPSB1c2VOb2Rlc0ludGVyYWN0aW9uc1dpdGhvdXRTeW5jKClcbiAgY29uc3QgeyBzY2hlbWFUeXBlRGVmaW5pdGlvbnMgfSA9IHVzZU1hdGNoU2NoZW1hVHlwZSgpXG4gIGNvbnN0IHsgZGF0YTogYnVpbGRJblRvb2xzIH0gPSB1c2VBbGxCdWlsdEluVG9vbHMoKVxuICBjb25zdCB7IGRhdGE6IGN1c3RvbVRvb2xzIH0gPSB1c2VBbGxDdXN0b21Ub29scygpXG4gIGNvbnN0IHsgZGF0YTogd29ya2Zsb3dUb29scyB9ID0gdXNlQWxsV29ya2Zsb3dUb29scygpXG4gIGNvbnN0IHsgZGF0YTogbWNwVG9vbHMgfSA9IHVzZUFsbE1DUFRvb2xzKClcbiAgY29uc3QgZGF0YVNvdXJjZUxpc3QgPSB1c2VTdG9yZShzID0+IHMuZGF0YVNvdXJjZUxpc3QpXG4gIGNvbnN0IGFsbFBsdWdpbkluZm9MaXN0ID0ge1xuICAgIGJ1aWxkSW5Ub29sczogYnVpbGRJblRvb2xzIHx8IFtdLFxuICAgIGN1c3RvbVRvb2xzOiBjdXN0b21Ub29scyB8fCBbXSxcbiAgICB3b3JrZmxvd1Rvb2xzOiB3b3JrZmxvd1Rvb2xzIHx8IFtdLFxuICAgIG1jcFRvb2xzOiBtY3BUb29scyB8fCBbXSxcbiAgICBkYXRhU291cmNlTGlzdDogZGF0YVNvdXJjZUxpc3QgfHwgW10sXG4gIH1cblxuICBjb25zdCBzZXRJbnNwZWN0VmFyc1RvU3RvcmUgPSAoaW5zcGVjdFZhcnM6IFZhckluSW5zcGVjdFtdLCBwYXNzZWRJbkFsbFBsdWdpbkluZm9MaXN0PzogUmVjb3JkPHN0cmluZywgVG9vbFdpdGhQcm92aWRlcltdPiwgcGFzc2VkSW5TY2hlbWFUeXBlRGVmaW5pdGlvbnM/OiBTY2hlbWFUeXBlRGVmaW5pdGlvbltdKSA9PiB7XG4gICAgY29uc3QgeyBzZXROb2Rlc1dpdGhJbnNwZWN0VmFycyB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3QgeyBnZXROb2RlcyB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3Qgbm9kZUFyciA9IGdldE5vZGVzKClcbiAgICBjb25zdCBhbGxOb2Rlc091dHB1dFZhcnMgPSB0b05vZGVPdXRwdXRWYXJzKG5vZGVBcnIsIGZhbHNlLCAoKSA9PiB0cnVlLCBbXSwgW10sIFtdLCBwYXNzZWRJbkFsbFBsdWdpbkluZm9MaXN0IHx8IGFsbFBsdWdpbkluZm9MaXN0LCBwYXNzZWRJblNjaGVtYVR5cGVEZWZpbml0aW9ucyB8fCBzY2hlbWFUeXBlRGVmaW5pdGlvbnMpXG5cbiAgICBjb25zdCBub2Rlc0tleVZhbHVlOiBSZWNvcmQ8c3RyaW5nLCBOb2RlPiA9IHt9XG4gICAgbm9kZUFyci5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICBub2Rlc0tleVZhbHVlW25vZGUuaWRdID0gbm9kZVxuICAgIH0pXG5cbiAgICBjb25zdCB3aXRoVmFsdWVOb2RlSWRzOiBSZWNvcmQ8c3RyaW5nLCBib29sZWFuPiA9IHt9XG4gICAgaW5zcGVjdFZhcnMuZm9yRWFjaCgodmFySXRlbSkgPT4ge1xuICAgICAgY29uc3Qgbm9kZUlkID0gdmFySXRlbS5zZWxlY3RvclswXVxuXG4gICAgICBjb25zdCBub2RlID0gbm9kZXNLZXlWYWx1ZVtub2RlSWRdXG4gICAgICBpZiAoIW5vZGUpXG4gICAgICAgIHJldHVyblxuICAgICAgd2l0aFZhbHVlTm9kZUlkc1tub2RlSWRdID0gdHJ1ZVxuICAgIH0pXG4gICAgY29uc3Qgd2l0aFZhbHVlTm9kZXMgPSBPYmplY3Qua2V5cyh3aXRoVmFsdWVOb2RlSWRzKS5tYXAoKG5vZGVJZCkgPT4ge1xuICAgICAgcmV0dXJuIG5vZGVzS2V5VmFsdWVbbm9kZUlkXVxuICAgIH0pXG5cbiAgICBjb25zdCByZXM6IE5vZGVXaXRoVmFyW10gPSB3aXRoVmFsdWVOb2Rlcy5tYXAoKG5vZGUpID0+IHtcbiAgICAgIGNvbnN0IG5vZGVJZCA9IG5vZGUuaWRcbiAgICAgIGNvbnN0IHZhcnNVbmRlclRoZU5vZGUgPSBpbnNwZWN0VmFycy5maWx0ZXIoKHZhckl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIHZhckl0ZW0uc2VsZWN0b3JbMF0gPT09IG5vZGVJZFxuICAgICAgfSlcbiAgICAgIGNvbnN0IG5vZGVWYXIgPSBhbGxOb2Rlc091dHB1dFZhcnMuZmluZChpdGVtID0+IGl0ZW0ubm9kZUlkID09PSBub2RlSWQpXG5cbiAgICAgIGNvbnN0IG5vZGVXaXRoVmFyID0ge1xuICAgICAgICBub2RlSWQsXG4gICAgICAgIG5vZGVQYXlsb2FkOiBub2RlLmRhdGEsXG4gICAgICAgIG5vZGVUeXBlOiBub2RlLmRhdGEudHlwZSxcbiAgICAgICAgdGl0bGU6IG5vZGUuZGF0YS50aXRsZSxcbiAgICAgICAgdmFyczogdmFyc1VuZGVyVGhlTm9kZS5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICBjb25zdCBzY2hlbWFUeXBlID0gbm9kZVZhciA/IG5vZGVWYXIudmFycy5maW5kKHYgPT4gdi52YXJpYWJsZSA9PT0gaXRlbS5uYW1lKT8uc2NoZW1hVHlwZSA6ICcnXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLml0ZW0sXG4gICAgICAgICAgICBzY2hlbWFUeXBlLFxuICAgICAgICAgIH1cbiAgICAgICAgfSksXG4gICAgICAgIGlzU2luZ1J1blJ1bm5pbmc6IGZhbHNlLFxuICAgICAgICBpc1ZhbHVlRmV0Y2hlZDogZmFsc2UsXG4gICAgICB9XG4gICAgICByZXR1cm4gbm9kZVdpdGhWYXJcbiAgICB9KVxuICAgIHNldE5vZGVzV2l0aEluc3BlY3RWYXJzKHJlcylcbiAgfVxuXG4gIGNvbnN0IGZldGNoSW5zcGVjdFZhcnMgPSB1c2VDYWxsYmFjayhhc3luYyAocGFyYW1zOiB7XG4gICAgcGFzc0luVmFycz86IGJvb2xlYW5cbiAgICB2YXJzPzogVmFySW5JbnNwZWN0W11cbiAgICBwYXNzZWRJbkFsbFBsdWdpbkluZm9MaXN0PzogUmVjb3JkPHN0cmluZywgVG9vbFdpdGhQcm92aWRlcltdPlxuICAgIHBhc3NlZEluU2NoZW1hVHlwZURlZmluaXRpb25zPzogU2NoZW1hVHlwZURlZmluaXRpb25bXVxuICB9KSA9PiB7XG4gICAgY29uc3QgeyBwYXNzSW5WYXJzLCB2YXJzLCBwYXNzZWRJbkFsbFBsdWdpbkluZm9MaXN0LCBwYXNzZWRJblNjaGVtYVR5cGVEZWZpbml0aW9ucyB9ID0gcGFyYW1zXG4gICAgaW52YWxpZGF0ZUNvbnZlcnNhdGlvblZhclZhbHVlcygpXG4gICAgaW52YWxpZGF0ZVN5c1ZhclZhbHVlcygpXG4gICAgY29uc3QgZGF0YSA9IHBhc3NJblZhcnMgPyB2YXJzISA6IGF3YWl0IGZldGNoQWxsSW5zcGVjdFZhcnMoZmxvd1R5cGUsIGZsb3dJZClcbiAgICBzZXRJbnNwZWN0VmFyc1RvU3RvcmUoZGF0YSwgcGFzc2VkSW5BbGxQbHVnaW5JbmZvTGlzdCwgcGFzc2VkSW5TY2hlbWFUeXBlRGVmaW5pdGlvbnMpXG4gICAgaGFuZGxlQ2FuY2VsQWxsTm9kZVN1Y2Nlc3NTdGF0dXMoKSAvLyB0byBtYWtlIHN1cmUgY2xlYXIgbm9kZSBvdXRwdXQgc2hvdyB0aGUgdW5zZXQgc3RhdHVzXG4gIH0sIFtpbnZhbGlkYXRlQ29udmVyc2F0aW9uVmFyVmFsdWVzLCBpbnZhbGlkYXRlU3lzVmFyVmFsdWVzLCBmbG93VHlwZSwgZmxvd0lkLCBzZXRJbnNwZWN0VmFyc1RvU3RvcmUsIGhhbmRsZUNhbmNlbEFsbE5vZGVTdWNjZXNzU3RhdHVzLCBzY2hlbWFUeXBlRGVmaW5pdGlvbnMsIGdldE1hdGNoZWRTY2hlbWFUeXBlXSlcbiAgcmV0dXJuIHtcbiAgICBmZXRjaEluc3BlY3RWYXJzLFxuICB9XG59XG4iXX0=