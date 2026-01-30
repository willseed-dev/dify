"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRagPipelineSearch = void 0;
const react_1 = require("react");
const rag_pipeline_nodes_1 = require("@/app/components/goto-anything/actions/rag-pipeline-nodes");
const block_icon_1 = require("@/app/components/workflow/block-icon");
const use_nodes_interactions_1 = require("@/app/components/workflow/hooks/use-nodes-interactions");
const use_tool_icon_1 = require("@/app/components/workflow/hooks/use-tool-icon");
const use_nodes_1 = require("@/app/components/workflow/store/workflow/use-nodes");
const types_1 = require("@/app/components/workflow/types");
const node_navigation_1 = require("@/app/components/workflow/utils/node-navigation");
/**
 * Hook to register RAG pipeline nodes search functionality
 */
const useRagPipelineSearch = () => {
    const nodes = (0, use_nodes_1.default)();
    const { handleNodeSelect } = (0, use_nodes_interactions_1.useNodesInteractions)();
    const getToolIcon = (0, use_tool_icon_1.useGetToolIcon)();
    // Process nodes to create searchable data structure
    const searchableNodes = (0, react_1.useMemo)(() => {
        return nodes.map((node) => {
            const nodeData = node.data;
            const title = nodeData.title || nodeData.type || 'Untitled Node';
            let desc = nodeData.desc || '';
            // Keep the original node title for consistency with workflow display
            // Only enhance description for better search context
            if (nodeData.type === types_1.BlockEnum.Tool) {
                const toolData = nodeData;
                desc = toolData.tool_description || toolData.tool_label || desc;
            }
            if (nodeData.type === types_1.BlockEnum.LLM) {
                const llmData = nodeData;
                if (llmData.model?.provider && llmData.model?.name)
                    desc = `${llmData.model.name} (${llmData.model.provider}) - ${llmData.model.mode || desc}`;
            }
            if (nodeData.type === types_1.BlockEnum.KnowledgeRetrieval) {
                const knowledgeData = nodeData;
                if (knowledgeData.dataset_ids?.length)
                    desc = `Knowledge Retrieval with ${knowledgeData.dataset_ids.length} datasets - ${desc}`;
            }
            return {
                id: node.id,
                title,
                desc,
                type: nodeData.type,
                blockType: nodeData.type,
                nodeData,
                toolIcon: getToolIcon(nodeData),
                modelInfo: nodeData.type === types_1.BlockEnum.LLM
                    ? {
                        provider: nodeData.model?.provider,
                        name: nodeData.model?.name,
                        mode: nodeData.model?.mode,
                    }
                    : {
                        provider: undefined,
                        name: undefined,
                        mode: undefined,
                    },
            };
        });
    }, [nodes, getToolIcon]);
    // Calculate relevance score for search results
    const calculateScore = (0, react_1.useCallback)((node, searchTerm) => {
        if (!searchTerm)
            return 1;
        let score = 0;
        const term = searchTerm.toLowerCase();
        // Title match (highest priority)
        if (node.title.toLowerCase().includes(term))
            score += 10;
        // Type match
        if (node.type.toLowerCase().includes(term))
            score += 8;
        // Description match
        if (node.desc.toLowerCase().includes(term))
            score += 5;
        // Model info matches (for LLM nodes)
        if (node.modelInfo.provider?.toLowerCase().includes(term))
            score += 6;
        if (node.modelInfo.name?.toLowerCase().includes(term))
            score += 6;
        if (node.modelInfo.mode?.toLowerCase().includes(term))
            score += 4;
        return score;
    }, []);
    // Create search function for RAG pipeline nodes
    const searchRagPipelineNodes = (0, react_1.useCallback)((query) => {
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
            rag_pipeline_nodes_1.ragPipelineNodesAction.searchFn = searchRagPipelineNodes;
        }
        return () => {
            // Clean up when component unmounts
            rag_pipeline_nodes_1.ragPipelineNodesAction.searchFn = undefined;
        };
    }, [searchableNodes, searchRagPipelineNodes]);
    // Set up node selection event listener using the utility function
    (0, react_1.useEffect)(() => {
        return (0, node_navigation_1.setupNodeSelectionListener)(handleNodeSelect);
    }, [handleNodeSelect]);
    return null;
};
exports.useRagPipelineSearch = useRagPipelineSearch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXJhZy1waXBlbGluZS1zZWFyY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtcmFnLXBpcGVsaW5lLXNlYXJjaC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBTVosaUNBQXVEO0FBQ3ZELGtHQUFrRztBQUNsRyxxRUFBNEQ7QUFDNUQsbUdBQTZGO0FBQzdGLGlGQUE4RTtBQUM5RSxrRkFBeUU7QUFDekUsMkRBQTJEO0FBQzNELHFGQUE0RjtBQUU1Rjs7R0FFRztBQUNJLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxFQUFFO0lBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUEsbUJBQVEsR0FBRSxDQUFBO0lBQ3hCLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLElBQUEsNkNBQW9CLEdBQUUsQ0FBQTtJQUNuRCxNQUFNLFdBQVcsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUVwQyxvREFBb0Q7SUFDcEQsTUFBTSxlQUFlLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ25DLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ3hCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFzQixDQUFBO1lBQzVDLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLElBQUksUUFBUSxDQUFDLElBQUksSUFBSSxlQUFlLENBQUE7WUFDaEUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7WUFFOUIscUVBQXFFO1lBQ3JFLHFEQUFxRDtZQUNyRCxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDckMsTUFBTSxRQUFRLEdBQUcsUUFBd0IsQ0FBQTtnQkFDekMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsSUFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQTtZQUNqRSxDQUFDO1lBRUQsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQ3BDLE1BQU0sT0FBTyxHQUFHLFFBQXVCLENBQUE7Z0JBQ3ZDLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJO29CQUNoRCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQTtZQUM5RixDQUFDO1lBRUQsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLGlCQUFTLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDbkQsTUFBTSxhQUFhLEdBQUcsUUFBc0MsQ0FBQTtnQkFDNUQsSUFBSSxhQUFhLENBQUMsV0FBVyxFQUFFLE1BQU07b0JBQ25DLElBQUksR0FBRyw0QkFBNEIsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLGVBQWUsSUFBSSxFQUFFLENBQUE7WUFDNUYsQ0FBQztZQUVELE9BQU87Z0JBQ0wsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUNYLEtBQUs7Z0JBQ0wsSUFBSTtnQkFDSixJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ25CLFNBQVMsRUFBRSxRQUFRLENBQUMsSUFBSTtnQkFDeEIsUUFBUTtnQkFDUixRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVEsQ0FBQztnQkFDL0IsU0FBUyxFQUFFLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQVMsQ0FBQyxHQUFHO29CQUN4QyxDQUFDLENBQUM7d0JBQ0UsUUFBUSxFQUFHLFFBQXdCLENBQUMsS0FBSyxFQUFFLFFBQVE7d0JBQ25ELElBQUksRUFBRyxRQUF3QixDQUFDLEtBQUssRUFBRSxJQUFJO3dCQUMzQyxJQUFJLEVBQUcsUUFBd0IsQ0FBQyxLQUFLLEVBQUUsSUFBSTtxQkFDNUM7b0JBQ0gsQ0FBQyxDQUFDO3dCQUNFLFFBQVEsRUFBRSxTQUFTO3dCQUNuQixJQUFJLEVBQUUsU0FBUzt3QkFDZixJQUFJLEVBQUUsU0FBUztxQkFDaEI7YUFDTixDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQTtJQUV4QiwrQ0FBK0M7SUFDL0MsTUFBTSxjQUFjLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsSUFLbkMsRUFBRSxVQUFrQixFQUFVLEVBQUU7UUFDL0IsSUFBSSxDQUFDLFVBQVU7WUFDYixPQUFPLENBQUMsQ0FBQTtRQUVWLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQTtRQUNiLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUVyQyxpQ0FBaUM7UUFDakMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDekMsS0FBSyxJQUFJLEVBQUUsQ0FBQTtRQUViLGFBQWE7UUFDYixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUN4QyxLQUFLLElBQUksQ0FBQyxDQUFBO1FBRVosb0JBQW9CO1FBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3hDLEtBQUssSUFBSSxDQUFDLENBQUE7UUFFWixxQ0FBcUM7UUFDckMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3ZELEtBQUssSUFBSSxDQUFDLENBQUE7UUFDWixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDbkQsS0FBSyxJQUFJLENBQUMsQ0FBQTtRQUNaLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUNuRCxLQUFLLElBQUksQ0FBQyxDQUFBO1FBRVosT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFFTixnREFBZ0Q7SUFDaEQsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxLQUFhLEVBQUUsRUFBRTtRQUMzRCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU07WUFDekIsT0FBTyxFQUFFLENBQUE7UUFFWCxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUE7UUFFN0MsTUFBTSxPQUFPLEdBQUcsZUFBZTthQUM1QixHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNaLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUE7WUFFOUMsT0FBTyxLQUFLLEdBQUcsQ0FBQztnQkFDZCxDQUFDLENBQUM7b0JBQ0UsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO29CQUNYLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUk7b0JBQ25DLElBQUksRUFBRSxlQUF3QjtvQkFDOUIsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRTtvQkFDbkIsSUFBSSxFQUFFLENBQ0osQ0FBQyxvQkFBUyxDQUNSLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FDckIsU0FBUyxDQUFDLFVBQVUsQ0FDcEIsSUFBSSxDQUFDLElBQUksQ0FDVCxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQ3hCLENBQ0g7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTt3QkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7cUJBQ3hCO29CQUNELElBQUksRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDbkIsS0FBSztpQkFDTjtnQkFDSCxDQUFDLENBQUMsSUFBSSxDQUFBO1FBQ1YsQ0FBQyxDQUFDO2FBQ0QsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFvQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQzthQUNqRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDYix5Q0FBeUM7WUFDekMsSUFBSSxDQUFDLFVBQVU7Z0JBQ2IsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDdkMsK0NBQStDO1lBQy9DLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUN4QyxDQUFDLENBQUMsQ0FBQTtRQUVKLE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFBO0lBRXJDLHdEQUF3RDtJQUN4RCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsSUFBSSxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQy9CLGlEQUFpRDtZQUNqRCwyQ0FBc0IsQ0FBQyxRQUFRLEdBQUcsc0JBQXNCLENBQUE7UUFDMUQsQ0FBQztRQUVELE9BQU8sR0FBRyxFQUFFO1lBQ1YsbUNBQW1DO1lBQ25DLDJDQUFzQixDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUE7UUFDN0MsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQTtJQUU3QyxrRUFBa0U7SUFDbEUsSUFBQSxpQkFBUyxFQUFDLEdBQUcsRUFBRTtRQUNiLE9BQU8sSUFBQSw0Q0FBMEIsRUFBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBQ3JELENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtJQUV0QixPQUFPLElBQUksQ0FBQTtBQUNiLENBQUMsQ0FBQTtBQTVKWSxRQUFBLG9CQUFvQix3QkE0SmhDIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgS25vd2xlZGdlUmV0cmlldmFsTm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2tub3dsZWRnZS1yZXRyaWV2YWwvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IExMTU5vZGVUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9sbG0vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IFRvb2xOb2RlVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvdG9vbC90eXBlcydcbmltcG9ydCB0eXBlIHsgQ29tbW9uTm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgcmFnUGlwZWxpbmVOb2Rlc0FjdGlvbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvZ290by1hbnl0aGluZy9hY3Rpb25zL3JhZy1waXBlbGluZS1ub2RlcydcbmltcG9ydCBCbG9ja0ljb24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1pY29uJ1xuaW1wb3J0IHsgdXNlTm9kZXNJbnRlcmFjdGlvbnMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1ub2Rlcy1pbnRlcmFjdGlvbnMnXG5pbXBvcnQgeyB1c2VHZXRUb29sSWNvbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MvdXNlLXRvb2wtaWNvbidcbmltcG9ydCB1c2VOb2RlcyBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlL3dvcmtmbG93L3VzZS1ub2RlcydcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBzZXR1cE5vZGVTZWxlY3Rpb25MaXN0ZW5lciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdXRpbHMvbm9kZS1uYXZpZ2F0aW9uJ1xuXG4vKipcbiAqIEhvb2sgdG8gcmVnaXN0ZXIgUkFHIHBpcGVsaW5lIG5vZGVzIHNlYXJjaCBmdW5jdGlvbmFsaXR5XG4gKi9cbmV4cG9ydCBjb25zdCB1c2VSYWdQaXBlbGluZVNlYXJjaCA9ICgpID0+IHtcbiAgY29uc3Qgbm9kZXMgPSB1c2VOb2RlcygpXG4gIGNvbnN0IHsgaGFuZGxlTm9kZVNlbGVjdCB9ID0gdXNlTm9kZXNJbnRlcmFjdGlvbnMoKVxuICBjb25zdCBnZXRUb29sSWNvbiA9IHVzZUdldFRvb2xJY29uKClcblxuICAvLyBQcm9jZXNzIG5vZGVzIHRvIGNyZWF0ZSBzZWFyY2hhYmxlIGRhdGEgc3RydWN0dXJlXG4gIGNvbnN0IHNlYXJjaGFibGVOb2RlcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBub2Rlcy5tYXAoKG5vZGUpID0+IHtcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0gbm9kZS5kYXRhIGFzIENvbW1vbk5vZGVUeXBlXG4gICAgICBjb25zdCB0aXRsZSA9IG5vZGVEYXRhLnRpdGxlIHx8IG5vZGVEYXRhLnR5cGUgfHwgJ1VudGl0bGVkIE5vZGUnXG4gICAgICBsZXQgZGVzYyA9IG5vZGVEYXRhLmRlc2MgfHwgJydcblxuICAgICAgLy8gS2VlcCB0aGUgb3JpZ2luYWwgbm9kZSB0aXRsZSBmb3IgY29uc2lzdGVuY3kgd2l0aCB3b3JrZmxvdyBkaXNwbGF5XG4gICAgICAvLyBPbmx5IGVuaGFuY2UgZGVzY3JpcHRpb24gZm9yIGJldHRlciBzZWFyY2ggY29udGV4dFxuICAgICAgaWYgKG5vZGVEYXRhLnR5cGUgPT09IEJsb2NrRW51bS5Ub29sKSB7XG4gICAgICAgIGNvbnN0IHRvb2xEYXRhID0gbm9kZURhdGEgYXMgVG9vbE5vZGVUeXBlXG4gICAgICAgIGRlc2MgPSB0b29sRGF0YS50b29sX2Rlc2NyaXB0aW9uIHx8IHRvb2xEYXRhLnRvb2xfbGFiZWwgfHwgZGVzY1xuICAgICAgfVxuXG4gICAgICBpZiAobm9kZURhdGEudHlwZSA9PT0gQmxvY2tFbnVtLkxMTSkge1xuICAgICAgICBjb25zdCBsbG1EYXRhID0gbm9kZURhdGEgYXMgTExNTm9kZVR5cGVcbiAgICAgICAgaWYgKGxsbURhdGEubW9kZWw/LnByb3ZpZGVyICYmIGxsbURhdGEubW9kZWw/Lm5hbWUpXG4gICAgICAgICAgZGVzYyA9IGAke2xsbURhdGEubW9kZWwubmFtZX0gKCR7bGxtRGF0YS5tb2RlbC5wcm92aWRlcn0pIC0gJHtsbG1EYXRhLm1vZGVsLm1vZGUgfHwgZGVzY31gXG4gICAgICB9XG5cbiAgICAgIGlmIChub2RlRGF0YS50eXBlID09PSBCbG9ja0VudW0uS25vd2xlZGdlUmV0cmlldmFsKSB7XG4gICAgICAgIGNvbnN0IGtub3dsZWRnZURhdGEgPSBub2RlRGF0YSBhcyBLbm93bGVkZ2VSZXRyaWV2YWxOb2RlVHlwZVxuICAgICAgICBpZiAoa25vd2xlZGdlRGF0YS5kYXRhc2V0X2lkcz8ubGVuZ3RoKVxuICAgICAgICAgIGRlc2MgPSBgS25vd2xlZGdlIFJldHJpZXZhbCB3aXRoICR7a25vd2xlZGdlRGF0YS5kYXRhc2V0X2lkcy5sZW5ndGh9IGRhdGFzZXRzIC0gJHtkZXNjfWBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgIHRpdGxlLFxuICAgICAgICBkZXNjLFxuICAgICAgICB0eXBlOiBub2RlRGF0YS50eXBlLFxuICAgICAgICBibG9ja1R5cGU6IG5vZGVEYXRhLnR5cGUsXG4gICAgICAgIG5vZGVEYXRhLFxuICAgICAgICB0b29sSWNvbjogZ2V0VG9vbEljb24obm9kZURhdGEpLFxuICAgICAgICBtb2RlbEluZm86IG5vZGVEYXRhLnR5cGUgPT09IEJsb2NrRW51bS5MTE1cbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgcHJvdmlkZXI6IChub2RlRGF0YSBhcyBMTE1Ob2RlVHlwZSkubW9kZWw/LnByb3ZpZGVyLFxuICAgICAgICAgICAgICBuYW1lOiAobm9kZURhdGEgYXMgTExNTm9kZVR5cGUpLm1vZGVsPy5uYW1lLFxuICAgICAgICAgICAgICBtb2RlOiAobm9kZURhdGEgYXMgTExNTm9kZVR5cGUpLm1vZGVsPy5tb2RlLFxuICAgICAgICAgICAgfVxuICAgICAgICAgIDoge1xuICAgICAgICAgICAgICBwcm92aWRlcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICBuYW1lOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIG1vZGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIH0sXG4gICAgICB9XG4gICAgfSlcbiAgfSwgW25vZGVzLCBnZXRUb29sSWNvbl0pXG5cbiAgLy8gQ2FsY3VsYXRlIHJlbGV2YW5jZSBzY29yZSBmb3Igc2VhcmNoIHJlc3VsdHNcbiAgY29uc3QgY2FsY3VsYXRlU2NvcmUgPSB1c2VDYWxsYmFjaygobm9kZToge1xuICAgIHRpdGxlOiBzdHJpbmdcbiAgICB0eXBlOiBzdHJpbmdcbiAgICBkZXNjOiBzdHJpbmdcbiAgICBtb2RlbEluZm86IHsgcHJvdmlkZXI/OiBzdHJpbmcsIG5hbWU/OiBzdHJpbmcsIG1vZGU/OiBzdHJpbmcgfVxuICB9LCBzZWFyY2hUZXJtOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xuICAgIGlmICghc2VhcmNoVGVybSlcbiAgICAgIHJldHVybiAxXG5cbiAgICBsZXQgc2NvcmUgPSAwXG4gICAgY29uc3QgdGVybSA9IHNlYXJjaFRlcm0udG9Mb3dlckNhc2UoKVxuXG4gICAgLy8gVGl0bGUgbWF0Y2ggKGhpZ2hlc3QgcHJpb3JpdHkpXG4gICAgaWYgKG5vZGUudGl0bGUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh0ZXJtKSlcbiAgICAgIHNjb3JlICs9IDEwXG5cbiAgICAvLyBUeXBlIG1hdGNoXG4gICAgaWYgKG5vZGUudHlwZS50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm0pKVxuICAgICAgc2NvcmUgKz0gOFxuXG4gICAgLy8gRGVzY3JpcHRpb24gbWF0Y2hcbiAgICBpZiAobm9kZS5kZXNjLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGVybSkpXG4gICAgICBzY29yZSArPSA1XG5cbiAgICAvLyBNb2RlbCBpbmZvIG1hdGNoZXMgKGZvciBMTE0gbm9kZXMpXG4gICAgaWYgKG5vZGUubW9kZWxJbmZvLnByb3ZpZGVyPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm0pKVxuICAgICAgc2NvcmUgKz0gNlxuICAgIGlmIChub2RlLm1vZGVsSW5mby5uYW1lPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm0pKVxuICAgICAgc2NvcmUgKz0gNlxuICAgIGlmIChub2RlLm1vZGVsSW5mby5tb2RlPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKHRlcm0pKVxuICAgICAgc2NvcmUgKz0gNFxuXG4gICAgcmV0dXJuIHNjb3JlXG4gIH0sIFtdKVxuXG4gIC8vIENyZWF0ZSBzZWFyY2ggZnVuY3Rpb24gZm9yIFJBRyBwaXBlbGluZSBub2Rlc1xuICBjb25zdCBzZWFyY2hSYWdQaXBlbGluZU5vZGVzID0gdXNlQ2FsbGJhY2soKHF1ZXJ5OiBzdHJpbmcpID0+IHtcbiAgICBpZiAoIXNlYXJjaGFibGVOb2Rlcy5sZW5ndGgpXG4gICAgICByZXR1cm4gW11cblxuICAgIGNvbnN0IHNlYXJjaFRlcm0gPSBxdWVyeS50b0xvd2VyQ2FzZSgpLnRyaW0oKVxuXG4gICAgY29uc3QgcmVzdWx0cyA9IHNlYXJjaGFibGVOb2Rlc1xuICAgICAgLm1hcCgobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBzY29yZSA9IGNhbGN1bGF0ZVNjb3JlKG5vZGUsIHNlYXJjaFRlcm0pXG5cbiAgICAgICAgcmV0dXJuIHNjb3JlID4gMFxuICAgICAgICAgID8ge1xuICAgICAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICAgICAgdGl0bGU6IG5vZGUudGl0bGUsXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBub2RlLmRlc2MgfHwgbm9kZS50eXBlLFxuICAgICAgICAgICAgICB0eXBlOiAnd29ya2Zsb3ctbm9kZScgYXMgY29uc3QsXG4gICAgICAgICAgICAgIHBhdGg6IGAjJHtub2RlLmlkfWAsXG4gICAgICAgICAgICAgIGljb246IChcbiAgICAgICAgICAgICAgICA8QmxvY2tJY29uXG4gICAgICAgICAgICAgICAgICB0eXBlPXtub2RlLmJsb2NrVHlwZX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNocmluay0wXCJcbiAgICAgICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgICAgICB0b29sSWNvbj17bm9kZS50b29sSWNvbn1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBtZXRhZGF0YToge1xuICAgICAgICAgICAgICAgIG5vZGVJZDogbm9kZS5pZCxcbiAgICAgICAgICAgICAgICBub2RlRGF0YTogbm9kZS5ub2RlRGF0YSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZGF0YTogbm9kZS5ub2RlRGF0YSxcbiAgICAgICAgICAgICAgc2NvcmUsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiBudWxsXG4gICAgICB9KVxuICAgICAgLmZpbHRlcigobm9kZSk6IG5vZGUgaXMgTm9uTnVsbGFibGU8dHlwZW9mIG5vZGU+ID0+IG5vZGUgIT09IG51bGwpXG4gICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAvLyBJZiBubyBzZWFyY2ggdGVybSwgc29ydCBhbHBoYWJldGljYWxseVxuICAgICAgICBpZiAoIXNlYXJjaFRlcm0pXG4gICAgICAgICAgcmV0dXJuIGEudGl0bGUubG9jYWxlQ29tcGFyZShiLnRpdGxlKVxuICAgICAgICAvLyBTb3J0IGJ5IHJlbGV2YW5jZSBzY29yZSAoaGlnaGVyIHNjb3JlIGZpcnN0KVxuICAgICAgICByZXR1cm4gKGIuc2NvcmUgfHwgMCkgLSAoYS5zY29yZSB8fCAwKVxuICAgICAgfSlcblxuICAgIHJldHVybiByZXN1bHRzXG4gIH0sIFtzZWFyY2hhYmxlTm9kZXMsIGNhbGN1bGF0ZVNjb3JlXSlcblxuICAvLyBEaXJlY3RseSBzZXQgdGhlIHNlYXJjaCBmdW5jdGlvbiBvbiB0aGUgYWN0aW9uIG9iamVjdFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzZWFyY2hhYmxlTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gU2V0IHRoZSBzZWFyY2ggZnVuY3Rpb24gZGlyZWN0bHkgb24gdGhlIGFjdGlvblxuICAgICAgcmFnUGlwZWxpbmVOb2Rlc0FjdGlvbi5zZWFyY2hGbiA9IHNlYXJjaFJhZ1BpcGVsaW5lTm9kZXNcbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgLy8gQ2xlYW4gdXAgd2hlbiBjb21wb25lbnQgdW5tb3VudHNcbiAgICAgIHJhZ1BpcGVsaW5lTm9kZXNBY3Rpb24uc2VhcmNoRm4gPSB1bmRlZmluZWRcbiAgICB9XG4gIH0sIFtzZWFyY2hhYmxlTm9kZXMsIHNlYXJjaFJhZ1BpcGVsaW5lTm9kZXNdKVxuXG4gIC8vIFNldCB1cCBub2RlIHNlbGVjdGlvbiBldmVudCBsaXN0ZW5lciB1c2luZyB0aGUgdXRpbGl0eSBmdW5jdGlvblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiBzZXR1cE5vZGVTZWxlY3Rpb25MaXN0ZW5lcihoYW5kbGVOb2RlU2VsZWN0KVxuICB9LCBbaGFuZGxlTm9kZVNlbGVjdF0pXG5cbiAgcmV0dXJuIG51bGxcbn1cbiJdfQ==