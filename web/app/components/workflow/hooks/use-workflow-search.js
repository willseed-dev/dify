"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowSearch = void 0;
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const workflow_nodes_1 = require("@/app/components/goto-anything/actions/workflow-nodes");
const types_1 = require("@/app/components/tools/types");
const block_icon_1 = require("@/app/components/workflow/block-icon");
const use_tools_1 = require("@/service/use-tools");
const utils_1 = require("@/utils");
const types_2 = require("../types");
const node_navigation_1 = require("../utils/node-navigation");
const use_nodes_interactions_1 = require("./use-nodes-interactions");
/**
 * Hook to register workflow nodes search functionality
 */
const useWorkflowSearch = () => {
    const nodes = (0, reactflow_1.useNodes)();
    const { handleNodeSelect } = (0, use_nodes_interactions_1.useNodesInteractions)();
    // Filter and process nodes for search
    const { data: buildInTools } = (0, use_tools_1.useAllBuiltInTools)();
    const { data: customTools } = (0, use_tools_1.useAllCustomTools)();
    const { data: workflowTools } = (0, use_tools_1.useAllWorkflowTools)();
    const { data: mcpTools } = (0, use_tools_1.useAllMCPTools)();
    // Extract tool icon logic - clean separation of concerns
    const getToolIcon = (0, react_1.useCallback)((nodeData) => {
        if (nodeData?.type !== types_2.BlockEnum.Tool)
            return undefined;
        const toolCollections = {
            [types_1.CollectionType.builtIn]: buildInTools || [],
            [types_1.CollectionType.custom]: customTools || [],
            [types_1.CollectionType.mcp]: mcpTools || [],
        };
        const targetTools = (nodeData.provider_type && toolCollections[nodeData.provider_type]) || workflowTools;
        return targetTools?.find((tool) => (0, utils_1.canFindTool)(tool.id, nodeData.provider_id))?.icon;
    }, [buildInTools, customTools, workflowTools, mcpTools]);
    // Extract model info logic - clean extraction
    const getModelInfo = (0, react_1.useCallback)((nodeData) => {
        if (nodeData?.type !== types_2.BlockEnum.LLM)
            return {};
        const llmNodeData = nodeData;
        return llmNodeData.model
            ? {
                provider: llmNodeData.model.provider,
                name: llmNodeData.model.name,
                mode: llmNodeData.model.mode,
            }
            : {};
    }, []);
    const searchableNodes = (0, react_1.useMemo)(() => {
        const filteredNodes = nodes.filter((node) => {
            if (!node.id || !node.data || node.type === 'sticky')
                return false;
            const nodeData = node.data;
            const nodeType = nodeData?.type;
            const internalStartNodes = ['iteration-start', 'loop-start'];
            return !internalStartNodes.includes(nodeType);
        });
        return filteredNodes.map((node) => {
            const nodeData = node.data;
            return {
                id: node.id,
                title: nodeData?.title || nodeData?.type || 'Untitled',
                type: nodeData?.type || '',
                desc: nodeData?.desc || '',
                blockType: nodeData?.type,
                nodeData,
                toolIcon: getToolIcon(nodeData),
                modelInfo: getModelInfo(nodeData),
            };
        });
    }, [nodes, getToolIcon, getModelInfo]);
    // Calculate search score - clean scoring logic
    const calculateScore = (0, react_1.useCallback)((node, searchTerm) => {
        if (!searchTerm)
            return 1;
        const titleMatch = node.title.toLowerCase();
        const typeMatch = node.type.toLowerCase();
        const descMatch = node.desc?.toLowerCase() || '';
        const modelProviderMatch = node.modelInfo?.provider?.toLowerCase() || '';
        const modelNameMatch = node.modelInfo?.name?.toLowerCase() || '';
        const modelModeMatch = node.modelInfo?.mode?.toLowerCase() || '';
        let score = 0;
        // Title matching (exact prefix > partial match)
        if (titleMatch.startsWith(searchTerm))
            score += 100;
        else if (titleMatch.includes(searchTerm))
            score += 50;
        // Type matching (exact > partial)
        if (typeMatch === searchTerm)
            score += 80;
        else if (typeMatch.includes(searchTerm))
            score += 30;
        // Description matching (additive)
        if (descMatch.includes(searchTerm))
            score += 20;
        // LLM model matching (additive - can combine multiple matches)
        if (modelNameMatch && modelNameMatch.includes(searchTerm))
            score += 60;
        if (modelProviderMatch && modelProviderMatch.includes(searchTerm))
            score += 40;
        if (modelModeMatch && modelModeMatch.includes(searchTerm))
            score += 30;
        return score;
    }, []);
    // Create search function for workflow nodes
    const searchWorkflowNodes = (0, react_1.useCallback)((query) => {
        if (!searchableNodes.length)
            return [];
        const searchTerm = query.toLowerCase().trim();
        const results = searchableNodes
            .map((node) => {
            const score = calculateScore(node, searchTerm);
            return score > 0
                ? {
                    id: node.id,
                    title: node.title,
                    description: node.desc || node.type,
                    type: 'workflow-node',
                    path: `#${node.id}`,
                    icon: (<block_icon_1.default type={node.blockType} className="shrink-0" size="sm" toolIcon={node.toolIcon}/>),
                    metadata: {
                        nodeId: node.id,
                        nodeData: node.nodeData,
                    },
                    data: node.nodeData,
                    score,
                }
                : null;
        })
            .filter((node) => node !== null)
            .sort((a, b) => {
            // If no search term, sort alphabetically
            if (!searchTerm)
                return a.title.localeCompare(b.title);
            // Sort by relevance score (higher score first)
            return (b.score || 0) - (a.score || 0);
        });
        return results;
    }, [searchableNodes, calculateScore]);
    // Directly set the search function on the action object
    (0, react_1.useEffect)(() => {
        if (searchableNodes.length > 0) {
            // Set the search function directly on the action
            workflow_nodes_1.workflowNodesAction.searchFn = searchWorkflowNodes;
        }
        return () => {
            // Clean up when component unmounts
            workflow_nodes_1.workflowNodesAction.searchFn = undefined;
        };
    }, [searchableNodes, searchWorkflowNodes]);
    // Set up node selection event listener using the utility function
    (0, react_1.useEffect)(() => {
        return (0, node_navigation_1.setupNodeSelectionListener)(handleNodeSelect);
    }, [handleNodeSelect]);
    return null;
};
exports.useWorkflowSearch = useWorkflowSearch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LXNlYXJjaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS13b3JrZmxvdy1zZWFyY2gudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7OztBQUtaLGlDQUF1RDtBQUN2RCx5Q0FBb0M7QUFDcEMsMEZBQTJGO0FBQzNGLHdEQUE2RDtBQUM3RCxxRUFBNEQ7QUFDNUQsbURBSzRCO0FBQzVCLG1DQUFxQztBQUNyQyxvQ0FBb0M7QUFDcEMsOERBQXFFO0FBQ3JFLHFFQUErRDtBQUUvRDs7R0FFRztBQUNJLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQ3BDLE1BQU0sS0FBSyxHQUFHLElBQUEsb0JBQVEsR0FBRSxDQUFBO0lBQ3hCLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLElBQUEsNkNBQW9CLEdBQUUsQ0FBQTtJQUVuRCxzQ0FBc0M7SUFDdEMsTUFBTSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFBLDhCQUFrQixHQUFFLENBQUE7SUFDbkQsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFBLDZCQUFpQixHQUFFLENBQUE7SUFDakQsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsR0FBRyxJQUFBLCtCQUFtQixHQUFFLENBQUE7SUFDckQsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLDBCQUFjLEdBQUUsQ0FBQTtJQUUzQyx5REFBeUQ7SUFDekQsTUFBTSxXQUFXLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsUUFBd0IsRUFBOEIsRUFBRTtRQUN2RixJQUFJLFFBQVEsRUFBRSxJQUFJLEtBQUssaUJBQVMsQ0FBQyxJQUFJO1lBQ25DLE9BQU8sU0FBUyxDQUFBO1FBRWxCLE1BQU0sZUFBZSxHQUEwQjtZQUM3QyxDQUFDLHNCQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWSxJQUFJLEVBQUU7WUFDNUMsQ0FBQyxz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LGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsT0FBTyxJQUFBLDRDQUEwQixFQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDckQsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO0lBRXRCLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBcExZLFFBQUEsaUJBQWlCLHFCQW9MN0IiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcblxuaW1wb3J0IHR5cGUgeyBMTE1Ob2RlVHlwZSB9IGZyb20gJy4uL25vZGVzL2xsbS90eXBlcydcbmltcG9ydCB0eXBlIHsgQ29tbW9uTm9kZVR5cGUgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgRW1vamkgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3Rvb2xzL3R5cGVzJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlTm9kZXMgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyB3b3JrZmxvd05vZGVzQWN0aW9uIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9nb3RvLWFueXRoaW5nL2FjdGlvbnMvd29ya2Zsb3ctbm9kZXMnXG5pbXBvcnQgeyBDb2xsZWN0aW9uVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvdG9vbHMvdHlwZXMnXG5pbXBvcnQgQmxvY2tJY29uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2staWNvbidcbmltcG9ydCB7XG4gIHVzZUFsbEJ1aWx0SW5Ub29scyxcbiAgdXNlQWxsQ3VzdG9tVG9vbHMsXG4gIHVzZUFsbE1DUFRvb2xzLFxuICB1c2VBbGxXb3JrZmxvd1Rvb2xzLFxufSBmcm9tICdAL3NlcnZpY2UvdXNlLXRvb2xzJ1xuaW1wb3J0IHsgY2FuRmluZFRvb2wgfSBmcm9tICdAL3V0aWxzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBzZXR1cE5vZGVTZWxlY3Rpb25MaXN0ZW5lciB9IGZyb20gJy4uL3V0aWxzL25vZGUtbmF2aWdhdGlvbidcbmltcG9ydCB7IHVzZU5vZGVzSW50ZXJhY3Rpb25zIH0gZnJvbSAnLi91c2Utbm9kZXMtaW50ZXJhY3Rpb25zJ1xuXG4vKipcbiAqIEhvb2sgdG8gcmVnaXN0ZXIgd29ya2Zsb3cgbm9kZXMgc2VhcmNoIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZXhwb3J0IGNvbnN0IHVzZVdvcmtmbG93U2VhcmNoID0gKCkgPT4ge1xuICBjb25zdCBub2RlcyA9IHVzZU5vZGVzKClcbiAgY29uc3QgeyBoYW5kbGVOb2RlU2VsZWN0IH0gPSB1c2VOb2Rlc0ludGVyYWN0aW9ucygpXG5cbiAgLy8gRmlsdGVyIGFuZCBwcm9jZXNzIG5vZGVzIGZvciBzZWFyY2hcbiAgY29uc3QgeyBkYXRhOiBidWlsZEluVG9vbHMgfSA9IHVzZUFsbEJ1aWx0SW5Ub29scygpXG4gIGNvbnN0IHsgZGF0YTogY3VzdG9tVG9vbHMgfSA9IHVzZUFsbEN1c3RvbVRvb2xzKClcbiAgY29uc3QgeyBkYXRhOiB3b3JrZmxvd1Rvb2xzIH0gPSB1c2VBbGxXb3JrZmxvd1Rvb2xzKClcbiAgY29uc3QgeyBkYXRhOiBtY3BUb29scyB9ID0gdXNlQWxsTUNQVG9vbHMoKVxuXG4gIC8vIEV4dHJhY3QgdG9vbCBpY29uIGxvZ2ljIC0gY2xlYW4gc2VwYXJhdGlvbiBvZiBjb25jZXJuc1xuICBjb25zdCBnZXRUb29sSWNvbiA9IHVzZUNhbGxiYWNrKChub2RlRGF0YTogQ29tbW9uTm9kZVR5cGUpOiBzdHJpbmcgfCBFbW9qaSB8IHVuZGVmaW5lZCA9PiB7XG4gICAgaWYgKG5vZGVEYXRhPy50eXBlICE9PSBCbG9ja0VudW0uVG9vbClcbiAgICAgIHJldHVybiB1bmRlZmluZWRcblxuICAgIGNvbnN0IHRvb2xDb2xsZWN0aW9uczogUmVjb3JkPHN0cmluZywgYW55W10+ID0ge1xuICAgICAgW0NvbGxlY3Rpb25UeXBlLmJ1aWx0SW5dOiBidWlsZEluVG9vbHMgfHwgW10sXG4gICAgICBbQ29sbGVjdGlvblR5cGUuY3VzdG9tXTogY3VzdG9tVG9vbHMgfHwgW10sXG4gICAgICBbQ29sbGVjdGlvblR5cGUubWNwXTogbWNwVG9vbHMgfHwgW10sXG4gICAgfVxuXG4gICAgY29uc3QgdGFyZ2V0VG9vbHMgPSAobm9kZURhdGEucHJvdmlkZXJfdHlwZSAmJiB0b29sQ29sbGVjdGlvbnNbbm9kZURhdGEucHJvdmlkZXJfdHlwZV0pIHx8IHdvcmtmbG93VG9vbHNcbiAgICByZXR1cm4gdGFyZ2V0VG9vbHM/LmZpbmQoKHRvb2w6IGFueSkgPT4gY2FuRmluZFRvb2wodG9vbC5pZCwgbm9kZURhdGEucHJvdmlkZXJfaWQpKT8uaWNvblxuICB9LCBbYnVpbGRJblRvb2xzLCBjdXN0b21Ub29scywgd29ya2Zsb3dUb29scywgbWNwVG9vbHNdKVxuXG4gIC8vIEV4dHJhY3QgbW9kZWwgaW5mbyBsb2dpYyAtIGNsZWFuIGV4dHJhY3Rpb25cbiAgY29uc3QgZ2V0TW9kZWxJbmZvID0gdXNlQ2FsbGJhY2soKG5vZGVEYXRhOiBDb21tb25Ob2RlVHlwZSkgPT4ge1xuICAgIGlmIChub2RlRGF0YT8udHlwZSAhPT0gQmxvY2tFbnVtLkxMTSlcbiAgICAgIHJldHVybiB7fVxuXG4gICAgY29uc3QgbGxtTm9kZURhdGEgPSBub2RlRGF0YSBhcyBMTE1Ob2RlVHlwZVxuICAgIHJldHVybiBsbG1Ob2RlRGF0YS5tb2RlbFxuICAgICAgPyB7XG4gICAgICAgICAgcHJvdmlkZXI6IGxsbU5vZGVEYXRhLm1vZGVsLnByb3ZpZGVyLFxuICAgICAgICAgIG5hbWU6IGxsbU5vZGVEYXRhLm1vZGVsLm5hbWUsXG4gICAgICAgICAgbW9kZTogbGxtTm9kZURhdGEubW9kZWwubW9kZSxcbiAgICAgICAgfVxuICAgICAgOiB7fVxuICB9LCBbXSlcblxuICBjb25zdCBzZWFyY2hhYmxlTm9kZXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBmaWx0ZXJlZE5vZGVzID0gbm9kZXMuZmlsdGVyKChub2RlKSA9PiB7XG4gICAgICBpZiAoIW5vZGUuaWQgfHwgIW5vZGUuZGF0YSB8fCBub2RlLnR5cGUgPT09ICdzdGlja3knKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgICAgY29uc3Qgbm9kZURhdGEgPSBub2RlLmRhdGEgYXMgQ29tbW9uTm9kZVR5cGVcbiAgICAgIGNvbnN0IG5vZGVUeXBlID0gbm9kZURhdGE/LnR5cGVcblxuICAgICAgY29uc3QgaW50ZXJuYWxTdGFydE5vZGVzID0gWydpdGVyYXRpb24tc3RhcnQnLCAnbG9vcC1zdGFydCddXG4gICAgICByZXR1cm4gIWludGVybmFsU3RhcnROb2Rlcy5pbmNsdWRlcyhub2RlVHlwZSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGZpbHRlcmVkTm9kZXMubWFwKChub2RlKSA9PiB7XG4gICAgICBjb25zdCBub2RlRGF0YSA9IG5vZGUuZGF0YSBhcyBDb21tb25Ob2RlVHlwZVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgdGl0bGU6IG5vZGVEYXRhPy50aXRsZSB8fCBub2RlRGF0YT8udHlwZSB8fCAnVW50aXRsZWQnLFxuICAgICAgICB0eXBlOiBub2RlRGF0YT8udHlwZSB8fCAnJyxcbiAgICAgICAgZGVzYzogbm9kZURhdGE/LmRlc2MgfHwgJycsXG4gICAgICAgIGJsb2NrVHlwZTogbm9kZURhdGE/LnR5cGUsXG4gICAgICAgIG5vZGVEYXRhLFxuICAgICAgICB0b29sSWNvbjogZ2V0VG9vbEljb24obm9kZURhdGEpLFxuICAgICAgICBtb2RlbEluZm86IGdldE1vZGVsSW5mbyhub2RlRGF0YSksXG4gICAgICB9XG4gICAgfSlcbiAgfSwgW25vZGVzLCBnZXRUb29sSWNvbiwgZ2V0TW9kZWxJbmZvXSlcblxuICAvLyBDYWxjdWxhdGUgc2VhcmNoIHNjb3JlIC0gY2xlYW4gc2NvcmluZyBsb2dpY1xuICBjb25zdCBjYWxjdWxhdGVTY29yZSA9IHVzZUNhbGxiYWNrKChub2RlOiB7XG4gICAgdGl0bGU6IHN0cmluZ1xuICAgIHR5cGU6IHN0cmluZ1xuICAgIGRlc2M6IHN0cmluZ1xuICAgIG1vZGVsSW5mbzogeyBwcm92aWRlcj86IHN0cmluZywgbmFtZT86IHN0cmluZywgbW9kZT86IHN0cmluZyB9XG4gIH0sIHNlYXJjaFRlcm06IHN0cmluZyk6IG51bWJlciA9PiB7XG4gICAgaWYgKCFzZWFyY2hUZXJtKVxuICAgICAgcmV0dXJuIDFcblxuICAgIGNvbnN0IHRpdGxlTWF0Y2ggPSBub2RlLnRpdGxlLnRvTG93ZXJDYXNlKClcbiAgICBjb25zdCB0eXBlTWF0Y2ggPSBub2RlLnR5cGUudG9Mb3dlckNhc2UoKVxuICAgIGNvbnN0IGRlc2NNYXRjaCA9IG5vZGUuZGVzYz8udG9Mb3dlckNhc2UoKSB8fCAnJ1xuICAgIGNvbnN0IG1vZGVsUHJvdmlkZXJNYXRjaCA9IG5vZGUubW9kZWxJbmZvPy5wcm92aWRlcj8udG9Mb3dlckNhc2UoKSB8fCAnJ1xuICAgIGNvbnN0IG1vZGVsTmFtZU1hdGNoID0gbm9kZS5tb2RlbEluZm8/Lm5hbWU/LnRvTG93ZXJDYXNlKCkgfHwgJydcbiAgICBjb25zdCBtb2RlbE1vZGVNYXRjaCA9IG5vZGUubW9kZWxJbmZvPy5tb2RlPy50b0xvd2VyQ2FzZSgpIHx8ICcnXG5cbiAgICBsZXQgc2NvcmUgPSAwXG5cbiAgICAvLyBUaXRsZSBtYXRjaGluZyAoZXhhY3QgcHJlZml4ID4gcGFydGlhbCBtYXRjaClcbiAgICBpZiAodGl0bGVNYXRjaC5zdGFydHNXaXRoKHNlYXJjaFRlcm0pKVxuICAgICAgc2NvcmUgKz0gMTAwXG4gICAgZWxzZSBpZiAodGl0bGVNYXRjaC5pbmNsdWRlcyhzZWFyY2hUZXJtKSlcbiAgICAgIHNjb3JlICs9IDUwXG5cbiAgICAvLyBUeXBlIG1hdGNoaW5nIChleGFjdCA+IHBhcnRpYWwpXG4gICAgaWYgKHR5cGVNYXRjaCA9PT0gc2VhcmNoVGVybSlcbiAgICAgIHNjb3JlICs9IDgwXG4gICAgZWxzZSBpZiAodHlwZU1hdGNoLmluY2x1ZGVzKHNlYXJjaFRlcm0pKVxuICAgICAgc2NvcmUgKz0gMzBcblxuICAgIC8vIERlc2NyaXB0aW9uIG1hdGNoaW5nIChhZGRpdGl2ZSlcbiAgICBpZiAoZGVzY01hdGNoLmluY2x1ZGVzKHNlYXJjaFRlcm0pKVxuICAgICAgc2NvcmUgKz0gMjBcblxuICAgIC8vIExMTSBtb2RlbCBtYXRjaGluZyAoYWRkaXRpdmUgLSBjYW4gY29tYmluZSBtdWx0aXBsZSBtYXRjaGVzKVxuICAgIGlmIChtb2RlbE5hbWVNYXRjaCAmJiBtb2RlbE5hbWVNYXRjaC5pbmNsdWRlcyhzZWFyY2hUZXJtKSlcbiAgICAgIHNjb3JlICs9IDYwXG4gICAgaWYgKG1vZGVsUHJvdmlkZXJNYXRjaCAmJiBtb2RlbFByb3ZpZGVyTWF0Y2guaW5jbHVkZXMoc2VhcmNoVGVybSkpXG4gICAgICBzY29yZSArPSA0MFxuICAgIGlmIChtb2RlbE1vZGVNYXRjaCAmJiBtb2RlbE1vZGVNYXRjaC5pbmNsdWRlcyhzZWFyY2hUZXJtKSlcbiAgICAgIHNjb3JlICs9IDMwXG5cbiAgICByZXR1cm4gc2NvcmVcbiAgfSwgW10pXG5cbiAgLy8gQ3JlYXRlIHNlYXJjaCBmdW5jdGlvbiBmb3Igd29ya2Zsb3cgbm9kZXNcbiAgY29uc3Qgc2VhcmNoV29ya2Zsb3dOb2RlcyA9IHVzZUNhbGxiYWNrKChxdWVyeTogc3RyaW5nKSA9PiB7XG4gICAgaWYgKCFzZWFyY2hhYmxlTm9kZXMubGVuZ3RoKVxuICAgICAgcmV0dXJuIFtdXG5cbiAgICBjb25zdCBzZWFyY2hUZXJtID0gcXVlcnkudG9Mb3dlckNhc2UoKS50cmltKClcblxuICAgIGNvbnN0IHJlc3VsdHMgPSBzZWFyY2hhYmxlTm9kZXNcbiAgICAgIC5tYXAoKG5vZGUpID0+IHtcbiAgICAgICAgY29uc3Qgc2NvcmUgPSBjYWxjdWxhdGVTY29yZShub2RlLCBzZWFyY2hUZXJtKVxuXG4gICAgICAgIHJldHVybiBzY29yZSA+IDBcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICAgIHRpdGxlOiBub2RlLnRpdGxlLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogbm9kZS5kZXNjIHx8IG5vZGUudHlwZSxcbiAgICAgICAgICAgICAgdHlwZTogJ3dvcmtmbG93LW5vZGUnIGFzIGNvbnN0LFxuICAgICAgICAgICAgICBwYXRoOiBgIyR7bm9kZS5pZH1gLFxuICAgICAgICAgICAgICBpY29uOiAoXG4gICAgICAgICAgICAgICAgPEJsb2NrSWNvblxuICAgICAgICAgICAgICAgICAgdHlwZT17bm9kZS5ibG9ja1R5cGV9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJzaHJpbmstMFwiXG4gICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICAgICAgdG9vbEljb249e25vZGUudG9vbEljb259XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IHtcbiAgICAgICAgICAgICAgICBub2RlSWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICAgICAgbm9kZURhdGE6IG5vZGUubm9kZURhdGEsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGRhdGE6IG5vZGUubm9kZURhdGEsXG4gICAgICAgICAgICAgIHNjb3JlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIDogbnVsbFxuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoKG5vZGUpOiBub2RlIGlzIE5vbk51bGxhYmxlPHR5cGVvZiBub2RlPiA9PiBub2RlICE9PSBudWxsKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgLy8gSWYgbm8gc2VhcmNoIHRlcm0sIHNvcnQgYWxwaGFiZXRpY2FsbHlcbiAgICAgICAgaWYgKCFzZWFyY2hUZXJtKVxuICAgICAgICAgIHJldHVybiBhLnRpdGxlLmxvY2FsZUNvbXBhcmUoYi50aXRsZSlcbiAgICAgICAgLy8gU29ydCBieSByZWxldmFuY2Ugc2NvcmUgKGhpZ2hlciBzY29yZSBmaXJzdClcbiAgICAgICAgcmV0dXJuIChiLnNjb3JlIHx8IDApIC0gKGEuc2NvcmUgfHwgMClcbiAgICAgIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9LCBbc2VhcmNoYWJsZU5vZGVzLCBjYWxjdWxhdGVTY29yZV0pXG5cbiAgLy8gRGlyZWN0bHkgc2V0IHRoZSBzZWFyY2ggZnVuY3Rpb24gb24gdGhlIGFjdGlvbiBvYmplY3RcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2VhcmNoYWJsZU5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFNldCB0aGUgc2VhcmNoIGZ1bmN0aW9uIGRpcmVjdGx5IG9uIHRoZSBhY3Rpb25cbiAgICAgIHdvcmtmbG93Tm9kZXNBY3Rpb24uc2VhcmNoRm4gPSBzZWFyY2hXb3JrZmxvd05vZGVzXG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIENsZWFuIHVwIHdoZW4gY29tcG9uZW50IHVubW91bnRzXG4gICAgICB3b3JrZmxvd05vZGVzQWN0aW9uLnNlYXJjaEZuID0gdW5kZWZpbmVkXG4gICAgfVxuICB9LCBbc2VhcmNoYWJsZU5vZGVzLCBzZWFyY2hXb3JrZmxvd05vZGVzXSlcblxuICAvLyBTZXQgdXAgbm9kZSBzZWxlY3Rpb24gZXZlbnQgbGlzdGVuZXIgdXNpbmcgdGhlIHV0aWxpdHkgZnVuY3Rpb25cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICByZXR1cm4gc2V0dXBOb2RlU2VsZWN0aW9uTGlzdGVuZXIoaGFuZGxlTm9kZVNlbGVjdClcbiAgfSwgW2hhbmRsZU5vZGVTZWxlY3RdKVxuXG4gIHJldHVybiBudWxsXG59XG4iXX0=