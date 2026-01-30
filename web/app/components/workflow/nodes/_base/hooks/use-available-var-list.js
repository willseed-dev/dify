"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("@/app/components/workflow/hooks");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("../../data-source/utils");
const use_node_info_1 = require("./use-node-info");
// TODO: loop type?
const useAvailableVarList = (nodeId, { onlyLeafNodeVar, filterVar, hideEnv, hideChatVar, passedInAvailableNodes, } = {
    onlyLeafNodeVar: false,
    filterVar: () => true,
}) => {
    const { getTreeLeafNodes, getNodeById, getBeforeNodesInSameBranchIncludeParent } = (0, hooks_1.useWorkflow)();
    const { getNodeAvailableVars } = (0, hooks_1.useWorkflowVariables)();
    const isChatMode = (0, hooks_1.useIsChatMode)();
    const availableNodes = passedInAvailableNodes || (onlyLeafNodeVar ? getTreeLeafNodes(nodeId) : getBeforeNodesInSameBranchIncludeParent(nodeId));
    const { parentNode: iterationNode, } = (0, use_node_info_1.default)(nodeId);
    const currNode = getNodeById(nodeId);
    const ragPipelineVariables = (0, store_1.useStore)(s => s.ragPipelineVariables);
    const isDataSourceNode = currNode?.data?.type === types_1.BlockEnum.DataSource;
    const dataSourceRagVars = [];
    if (isDataSourceNode) {
        const ragVariablesInDataSource = ragPipelineVariables?.filter(ragVariable => ragVariable.belong_to_node_id === nodeId);
        const filterVars = ragVariablesInDataSource?.filter(v => filterVar({
            variable: v.variable,
            type: (0, utils_1.inputVarTypeToVarType)(v.type),
            nodeId,
            isRagVariable: true,
        }, ['rag', nodeId, v.variable]));
        if (filterVars?.length) {
            dataSourceRagVars.push({
                nodeId,
                title: currNode.data?.title,
                vars: filterVars.map((v) => {
                    return {
                        variable: `rag.${nodeId}.${v.variable}`,
                        type: (0, utils_1.inputVarTypeToVarType)(v.type),
                        description: v.label,
                        isRagVariable: true,
                    };
                }),
            });
        }
    }
    const availableVars = [...getNodeAvailableVars({
            parentNode: iterationNode,
            beforeNodes: availableNodes,
            isChatMode,
            filterVar,
            hideEnv,
            hideChatVar,
        }), ...dataSourceRagVars];
    return {
        availableVars,
        availableNodes,
        availableNodesWithParent: [
            ...availableNodes,
            ...(isDataSourceNode ? [currNode] : []),
        ],
    };
};
exports.default = useAvailableVarList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWF2YWlsYWJsZS12YXItbGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1hdmFpbGFibGUtdmFyLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyREFJd0M7QUFDeEMsMkRBQThFO0FBQzlFLDJEQUEyRDtBQUMzRCxtREFBK0Q7QUFDL0QsbURBQXlDO0FBVXpDLG1CQUFtQjtBQUNuQixNQUFNLG1CQUFtQixHQUFHLENBQUMsTUFBYyxFQUFFLEVBQzNDLGVBQWUsRUFDZixTQUFTLEVBQ1QsT0FBTyxFQUNQLFdBQVcsRUFDWCxzQkFBc0IsTUFDWjtJQUNWLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJO0NBQ3RCLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsdUNBQXVDLEVBQUUsR0FBRyxJQUFBLG1CQUFXLEdBQUUsQ0FBQTtJQUNoRyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxJQUFBLDRCQUFvQixHQUFFLENBQUE7SUFDdkQsTUFBTSxVQUFVLEdBQUcsSUFBQSxxQkFBYSxHQUFFLENBQUE7SUFDbEMsTUFBTSxjQUFjLEdBQUcsc0JBQXNCLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyx1Q0FBdUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBQy9JLE1BQU0sRUFDSixVQUFVLEVBQUUsYUFBYSxHQUMxQixHQUFHLElBQUEsdUJBQVcsRUFBQyxNQUFNLENBQUMsQ0FBQTtJQUV2QixNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDcEMsTUFBTSxvQkFBb0IsR0FBRyxJQUFBLGdCQUFnQixFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFDMUUsTUFBTSxnQkFBZ0IsR0FBRyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksS0FBSyxpQkFBUyxDQUFDLFVBQVUsQ0FBQTtJQUN0RSxNQUFNLGlCQUFpQixHQUFvQixFQUFFLENBQUE7SUFDN0MsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sd0JBQXdCLEdBQUcsb0JBQW9CLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLGlCQUFpQixLQUFLLE1BQU0sQ0FBQyxDQUFBO1FBQ3RILE1BQU0sVUFBVSxHQUFHLHdCQUF3QixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNqRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLFFBQVE7WUFDcEIsSUFBSSxFQUFFLElBQUEsNkJBQXFCLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQyxNQUFNO1lBQ04sYUFBYSxFQUFFLElBQUk7U0FDcEIsRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxJQUFJLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUN2QixpQkFBaUIsQ0FBQyxJQUFJLENBQUM7Z0JBQ3JCLE1BQU07Z0JBQ04sS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSztnQkFDM0IsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDekIsT0FBTzt3QkFDTCxRQUFRLEVBQUUsT0FBTyxNQUFNLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTt3QkFDdkMsSUFBSSxFQUFFLElBQUEsNkJBQXFCLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDbkMsV0FBVyxFQUFFLENBQUMsQ0FBQyxLQUFLO3dCQUNwQixhQUFhLEVBQUUsSUFBSTtxQkFDYixDQUFBO2dCQUNWLENBQUMsQ0FBQzthQUNILENBQUMsQ0FBQTtRQUNKLENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLG9CQUFvQixDQUFDO1lBQzdDLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLFdBQVcsRUFBRSxjQUFjO1lBQzNCLFVBQVU7WUFDVixTQUFTO1lBQ1QsT0FBTztZQUNQLFdBQVc7U0FDWixDQUFDLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFBO0lBRXpCLE9BQU87UUFDTCxhQUFhO1FBQ2IsY0FBYztRQUNkLHdCQUF3QixFQUFFO1lBQ3hCLEdBQUcsY0FBYztZQUNqQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztTQUN4QztLQUNGLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxtQkFBbUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTm9kZSwgTm9kZU91dFB1dFZhciwgVmFsdWVTZWxlY3RvciwgVmFyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7XG4gIHVzZUlzQ2hhdE1vZGUsXG4gIHVzZVdvcmtmbG93LFxuICB1c2VXb3JrZmxvd1ZhcmlhYmxlcyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcbmltcG9ydCB7IHVzZVN0b3JlIGFzIHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IGlucHV0VmFyVHlwZVRvVmFyVHlwZSB9IGZyb20gJy4uLy4uL2RhdGEtc291cmNlL3V0aWxzJ1xuaW1wb3J0IHVzZU5vZGVJbmZvIGZyb20gJy4vdXNlLW5vZGUtaW5mbydcblxudHlwZSBQYXJhbXMgPSB7XG4gIG9ubHlMZWFmTm9kZVZhcj86IGJvb2xlYW5cbiAgaGlkZUVudj86IGJvb2xlYW5cbiAgaGlkZUNoYXRWYXI/OiBib29sZWFuXG4gIGZpbHRlclZhcjogKHBheWxvYWQ6IFZhciwgc2VsZWN0b3I6IFZhbHVlU2VsZWN0b3IpID0+IGJvb2xlYW5cbiAgcGFzc2VkSW5BdmFpbGFibGVOb2Rlcz86IE5vZGVbXVxufVxuXG4vLyBUT0RPOiBsb29wIHR5cGU/XG5jb25zdCB1c2VBdmFpbGFibGVWYXJMaXN0ID0gKG5vZGVJZDogc3RyaW5nLCB7XG4gIG9ubHlMZWFmTm9kZVZhcixcbiAgZmlsdGVyVmFyLFxuICBoaWRlRW52LFxuICBoaWRlQ2hhdFZhcixcbiAgcGFzc2VkSW5BdmFpbGFibGVOb2Rlcyxcbn06IFBhcmFtcyA9IHtcbiAgb25seUxlYWZOb2RlVmFyOiBmYWxzZSxcbiAgZmlsdGVyVmFyOiAoKSA9PiB0cnVlLFxufSkgPT4ge1xuICBjb25zdCB7IGdldFRyZWVMZWFmTm9kZXMsIGdldE5vZGVCeUlkLCBnZXRCZWZvcmVOb2Rlc0luU2FtZUJyYW5jaEluY2x1ZGVQYXJlbnQgfSA9IHVzZVdvcmtmbG93KClcbiAgY29uc3QgeyBnZXROb2RlQXZhaWxhYmxlVmFycyB9ID0gdXNlV29ya2Zsb3dWYXJpYWJsZXMoKVxuICBjb25zdCBpc0NoYXRNb2RlID0gdXNlSXNDaGF0TW9kZSgpXG4gIGNvbnN0IGF2YWlsYWJsZU5vZGVzID0gcGFzc2VkSW5BdmFpbGFibGVOb2RlcyB8fCAob25seUxlYWZOb2RlVmFyID8gZ2V0VHJlZUxlYWZOb2Rlcyhub2RlSWQpIDogZ2V0QmVmb3JlTm9kZXNJblNhbWVCcmFuY2hJbmNsdWRlUGFyZW50KG5vZGVJZCkpXG4gIGNvbnN0IHtcbiAgICBwYXJlbnROb2RlOiBpdGVyYXRpb25Ob2RlLFxuICB9ID0gdXNlTm9kZUluZm8obm9kZUlkKVxuXG4gIGNvbnN0IGN1cnJOb2RlID0gZ2V0Tm9kZUJ5SWQobm9kZUlkKVxuICBjb25zdCByYWdQaXBlbGluZVZhcmlhYmxlcyA9IHVzZVdvcmtmbG93U3RvcmUocyA9PiBzLnJhZ1BpcGVsaW5lVmFyaWFibGVzKVxuICBjb25zdCBpc0RhdGFTb3VyY2VOb2RlID0gY3Vyck5vZGU/LmRhdGE/LnR5cGUgPT09IEJsb2NrRW51bS5EYXRhU291cmNlXG4gIGNvbnN0IGRhdGFTb3VyY2VSYWdWYXJzOiBOb2RlT3V0UHV0VmFyW10gPSBbXVxuICBpZiAoaXNEYXRhU291cmNlTm9kZSkge1xuICAgIGNvbnN0IHJhZ1ZhcmlhYmxlc0luRGF0YVNvdXJjZSA9IHJhZ1BpcGVsaW5lVmFyaWFibGVzPy5maWx0ZXIocmFnVmFyaWFibGUgPT4gcmFnVmFyaWFibGUuYmVsb25nX3RvX25vZGVfaWQgPT09IG5vZGVJZClcbiAgICBjb25zdCBmaWx0ZXJWYXJzID0gcmFnVmFyaWFibGVzSW5EYXRhU291cmNlPy5maWx0ZXIodiA9PiBmaWx0ZXJWYXIoe1xuICAgICAgdmFyaWFibGU6IHYudmFyaWFibGUsXG4gICAgICB0eXBlOiBpbnB1dFZhclR5cGVUb1ZhclR5cGUodi50eXBlKSxcbiAgICAgIG5vZGVJZCxcbiAgICAgIGlzUmFnVmFyaWFibGU6IHRydWUsXG4gICAgfSwgWydyYWcnLCBub2RlSWQsIHYudmFyaWFibGVdKSlcbiAgICBpZiAoZmlsdGVyVmFycz8ubGVuZ3RoKSB7XG4gICAgICBkYXRhU291cmNlUmFnVmFycy5wdXNoKHtcbiAgICAgICAgbm9kZUlkLFxuICAgICAgICB0aXRsZTogY3Vyck5vZGUuZGF0YT8udGl0bGUsXG4gICAgICAgIHZhcnM6IGZpbHRlclZhcnMubWFwKCh2KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiBgcmFnLiR7bm9kZUlkfS4ke3YudmFyaWFibGV9YCxcbiAgICAgICAgICAgIHR5cGU6IGlucHV0VmFyVHlwZVRvVmFyVHlwZSh2LnR5cGUpLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IHYubGFiZWwsXG4gICAgICAgICAgICBpc1JhZ1ZhcmlhYmxlOiB0cnVlLFxuICAgICAgICAgIH0gYXMgVmFyXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgY29uc3QgYXZhaWxhYmxlVmFycyA9IFsuLi5nZXROb2RlQXZhaWxhYmxlVmFycyh7XG4gICAgcGFyZW50Tm9kZTogaXRlcmF0aW9uTm9kZSxcbiAgICBiZWZvcmVOb2RlczogYXZhaWxhYmxlTm9kZXMsXG4gICAgaXNDaGF0TW9kZSxcbiAgICBmaWx0ZXJWYXIsXG4gICAgaGlkZUVudixcbiAgICBoaWRlQ2hhdFZhcixcbiAgfSksIC4uLmRhdGFTb3VyY2VSYWdWYXJzXVxuXG4gIHJldHVybiB7XG4gICAgYXZhaWxhYmxlVmFycyxcbiAgICBhdmFpbGFibGVOb2RlcyxcbiAgICBhdmFpbGFibGVOb2Rlc1dpdGhQYXJlbnQ6IFtcbiAgICAgIC4uLmF2YWlsYWJsZU5vZGVzLFxuICAgICAgLi4uKGlzRGF0YVNvdXJjZU5vZGUgPyBbY3Vyck5vZGVdIDogW10pLFxuICAgIF0sXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQXZhaWxhYmxlVmFyTGlzdFxuIl19