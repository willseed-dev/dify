"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parses a DSL string into an array of node objects.
 * @param dsl - The input DSL string.
 * @returns An array of parsed nodes.
 */
function parseDSL(dsl) {
    return convertToNodeData(parseTopLevelFlow(dsl).map(nodeStr => parseNode(nodeStr)));
}
/**
 * Splits a top-level flow string by "->", respecting nested structures.
 * @param dsl - The DSL string to split.
 * @returns An array of top-level segments.
 */
function parseTopLevelFlow(dsl) {
    const segments = [];
    let buffer = '';
    let nested = 0;
    for (let i = 0; i < dsl.length; i++) {
        const char = dsl[i];
        if (char === '(')
            nested++;
        if (char === ')')
            nested--;
        if (char === '-' && dsl[i + 1] === '>' && nested === 0) {
            segments.push(buffer.trim());
            buffer = '';
            i++; // Skip the ">" character
        }
        else {
            buffer += char;
        }
    }
    if (buffer.trim())
        segments.push(buffer.trim());
    return segments;
}
/**
 * Parses a single node string.
 * If the node is complex (e.g., has parentheses), it extracts the node type, node ID, and parameters.
 * @param nodeStr - The node string to parse.
 * @param parentIterationId - The ID of the parent iteration node (if applicable).
 * @param parentLoopId - The ID of the parent loop node (if applicable).
 * @returns A parsed node object.
 */
function parseNode(nodeStr, parentIterationId, parentLoopId) {
    // Check if the node is a complex node
    if (nodeStr.startsWith('(') && nodeStr.endsWith(')')) {
        const innerContent = nodeStr.slice(1, -1).trim(); // Remove outer parentheses
        let nested = 0;
        let buffer = '';
        const parts = [];
        // Split the inner content by commas, respecting nested parentheses
        for (let i = 0; i < innerContent.length; i++) {
            const char = innerContent[i];
            if (char === '(')
                nested++;
            if (char === ')')
                nested--;
            if (char === ',' && nested === 0) {
                parts.push(buffer.trim());
                buffer = '';
            }
            else {
                buffer += char;
            }
        }
        parts.push(buffer.trim());
        // Extract nodeType, nodeId, and params
        const [nodeType, nodeId, ...paramsRaw] = parts;
        const params = parseParams(paramsRaw, nodeType === 'iteration' ? nodeId.trim() : parentIterationId, nodeType === 'loop' ? nodeId.trim() : parentLoopId);
        const complexNode = {
            nodeType: nodeType.trim(),
            nodeId: nodeId.trim(),
            params,
        };
        if (parentIterationId) {
            complexNode.iterationId = parentIterationId;
            complexNode.iterationIndex = 0; // Fixed as 0
        }
        if (parentLoopId) {
            complexNode.loopId = parentLoopId;
            complexNode.loopIndex = 0; // Fixed as 0
        }
        return complexNode;
    }
    // If it's not a complex node, treat it as a plain node
    const plainNode = { nodeType: 'plain', nodeId: nodeStr.trim() };
    if (parentIterationId) {
        plainNode.iterationId = parentIterationId;
        plainNode.iterationIndex = 0; // Fixed as 0
    }
    if (parentLoopId) {
        plainNode.loopId = parentLoopId;
        plainNode.loopIndex = 0; // Fixed as 0
    }
    return plainNode;
}
/**
 * Parses parameters of a complex node.
 * Supports nested flows and complex sub-nodes.
 * Adds iteration-specific metadata recursively.
 * @param paramParts - The parameters string split by commas.
 * @param parentIterationId - The ID of the parent iteration node (if applicable).
 * @param parentLoopId - The ID of the parent loop node (if applicable).
 * @returns An array of parsed parameters (plain nodes, nested nodes, or flows).
 */
function parseParams(paramParts, parentIteration, parentLoopId) {
    return paramParts.map((part) => {
        if (part.includes('->')) {
            // Parse as a flow and return an array of nodes
            return parseTopLevelFlow(part).map(node => parseNode(node, parentIteration || undefined, parentLoopId || undefined));
        }
        else if (part.startsWith('(')) {
            // Parse as a nested complex node
            return parseNode(part, parentIteration || undefined, parentLoopId || undefined);
        }
        else if (!Number.isNaN(Number(part.trim()))) {
            // Parse as a numeric parameter
            return Number(part.trim());
        }
        else {
            // Parse as a plain node
            return parseNode(part, parentIteration || undefined, parentLoopId || undefined);
        }
    });
}
/**
 * Converts a plain node to node data.
 */
function convertPlainNode(node) {
    return [
        {
            id: node.nodeId,
            node_id: node.nodeId,
            title: node.nodeId,
            execution_metadata: {},
            status: 'succeeded',
        },
    ];
}
/**
 * Converts a retry node to node data.
 */
function convertRetryNode(node) {
    const { nodeId, iterationId, iterationIndex, loopId, loopIndex, params } = node;
    const retryCount = params ? Number.parseInt(params[0], 10) : 0;
    const result = [
        {
            id: nodeId,
            node_id: nodeId,
            title: nodeId,
            execution_metadata: {},
            status: 'succeeded',
        },
    ];
    for (let i = 0; i < retryCount; i++) {
        result.push({
            id: nodeId,
            node_id: nodeId,
            title: nodeId,
            execution_metadata: iterationId
                ? {
                    iteration_id: iterationId,
                    iteration_index: iterationIndex || 0,
                }
                : loopId
                    ? {
                        loop_id: loopId,
                        loop_index: loopIndex || 0,
                    }
                    : {},
            status: 'retry',
        });
    }
    return result;
}
/**
 * Converts an iteration node to node data.
 */
function convertIterationNode(node) {
    const { nodeId, params } = node;
    const result = [
        {
            id: nodeId,
            node_id: nodeId,
            title: nodeId,
            node_type: 'iteration',
            status: 'succeeded',
            execution_metadata: {},
        },
    ];
    params?.forEach((param) => {
        if (Array.isArray(param)) {
            param.forEach((childNode) => {
                const childData = convertToNodeData([childNode]);
                childData.forEach((data) => {
                    data.execution_metadata = {
                        ...data.execution_metadata,
                        iteration_id: nodeId,
                        iteration_index: 0,
                    };
                });
                result.push(...childData);
            });
        }
    });
    return result;
}
/**
 * Converts an loop node to node data.
 */
function convertLoopNode(node) {
    const { nodeId, params } = node;
    const result = [
        {
            id: nodeId,
            node_id: nodeId,
            title: nodeId,
            node_type: 'loop',
            status: 'succeeded',
            execution_metadata: {},
        },
    ];
    params?.forEach((param) => {
        if (Array.isArray(param)) {
            param.forEach((childNode) => {
                const childData = convertToNodeData([childNode]);
                childData.forEach((data) => {
                    data.execution_metadata = {
                        ...data.execution_metadata,
                        loop_id: nodeId,
                        loop_index: 0,
                    };
                });
                result.push(...childData);
            });
        }
    });
    return result;
}
/**
 * Converts a parallel node to node data.
 */
function convertParallelNode(node, parentParallelId, parentStartNodeId) {
    const { nodeId, params } = node;
    const result = [
        {
            id: nodeId,
            node_id: nodeId,
            title: nodeId,
            execution_metadata: {
                parallel_id: nodeId,
            },
            status: 'succeeded',
        },
    ];
    params?.forEach((param) => {
        if (Array.isArray(param)) {
            const startNodeId = param[0]?.nodeId;
            param.forEach((childNode) => {
                const childData = convertToNodeData([childNode]);
                childData.forEach((data) => {
                    data.execution_metadata = {
                        ...data.execution_metadata,
                        parallel_id: nodeId,
                        parallel_start_node_id: startNodeId,
                        ...(parentParallelId && {
                            parent_parallel_id: parentParallelId,
                            parent_parallel_start_node_id: parentStartNodeId,
                        }),
                    };
                });
                result.push(...childData);
            });
        }
        else if (param && typeof param === 'object') {
            const startNodeId = param.nodeId;
            const childData = convertToNodeData([param]);
            childData.forEach((data) => {
                data.execution_metadata = {
                    ...data.execution_metadata,
                    parallel_id: nodeId,
                    parallel_start_node_id: startNodeId,
                    ...(parentParallelId && {
                        parent_parallel_id: parentParallelId,
                        parent_parallel_start_node_id: parentStartNodeId,
                    }),
                };
            });
            result.push(...childData);
        }
    });
    return result;
}
/**
 * Main function to convert nodes to node data.
 */
function convertToNodeData(nodes, parentParallelId, parentStartNodeId) {
    const result = [];
    nodes.forEach((node) => {
        switch (node.nodeType) {
            case 'plain':
                result.push(...convertPlainNode(node));
                break;
            case 'retry':
                result.push(...convertRetryNode(node));
                break;
            case 'iteration':
                result.push(...convertIterationNode(node));
                break;
            case 'loop':
                result.push(...convertLoopNode(node));
                break;
            case 'parallel':
                result.push(...convertParallelNode(node, parentParallelId, parentStartNodeId));
                break;
            default:
                throw new Error(`Unknown nodeType: ${node.nodeType}`);
        }
    });
    return result;
}
exports.default = parseDSL;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGgtdG8tbG9nLXN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdyYXBoLXRvLWxvZy1zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQTs7OztHQUlHO0FBQ0gsU0FBUyxRQUFRLENBQUMsR0FBVztJQUMzQixPQUFPLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDckYsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLGlCQUFpQixDQUFDLEdBQVc7SUFDcEMsTUFBTSxRQUFRLEdBQWEsRUFBRSxDQUFBO0lBQzdCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNmLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQTtJQUVkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDcEMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ25CLElBQUksSUFBSSxLQUFLLEdBQUc7WUFDZCxNQUFNLEVBQUUsQ0FBQTtRQUNWLElBQUksSUFBSSxLQUFLLEdBQUc7WUFDZCxNQUFNLEVBQUUsQ0FBQTtRQUNWLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkQsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUM1QixNQUFNLEdBQUcsRUFBRSxDQUFBO1lBQ1gsQ0FBQyxFQUFFLENBQUEsQ0FBQyx5QkFBeUI7UUFDL0IsQ0FBQzthQUNJLENBQUM7WUFDSixNQUFNLElBQUksSUFBSSxDQUFB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QUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtnQkFDMUMsTUFBSztZQUNQLEtBQUssTUFBTTtnQkFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7Z0JBQ3JDLE1BQUs7WUFDUCxLQUFLLFVBQVU7Z0JBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLG1CQUFtQixDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7Z0JBQzlFLE1BQUs7WUFDUDtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUN6RCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUE7SUFFRixPQUFPLE1BQU0sQ0FBQTtBQUNmLENBQUM7QUFFRCxrQkFBZSxRQUFRLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJ0eXBlIEl0ZXJhdGlvbkluZm8gPSB7IGl0ZXJhdGlvbklkOiBzdHJpbmcsIGl0ZXJhdGlvbkluZGV4OiBudW1iZXIgfVxudHlwZSBMb29wSW5mbyA9IHsgbG9vcElkOiBzdHJpbmcsIGxvb3BJbmRleDogbnVtYmVyIH1cbnR5cGUgTm9kZVBsYWluID0geyBub2RlVHlwZTogJ3BsYWluJywgbm9kZUlkOiBzdHJpbmcgfSAmIChQYXJ0aWFsPEl0ZXJhdGlvbkluZm8+ICYgUGFydGlhbDxMb29wSW5mbz4pXG50eXBlIE5vZGVDb21wbGV4ID0geyBub2RlVHlwZTogc3RyaW5nLCBub2RlSWQ6IHN0cmluZywgcGFyYW1zOiAoTm9kZVBsYWluIHwgKE5vZGVDb21wbGV4ICYgKFBhcnRpYWw8SXRlcmF0aW9uSW5mbz4gJiBQYXJ0aWFsPExvb3BJbmZvPikpIHwgTm9kZVtdIHwgbnVtYmVyKVtdIH0gJiAoUGFydGlhbDxJdGVyYXRpb25JbmZvPiAmIFBhcnRpYWw8TG9vcEluZm8+KVxudHlwZSBOb2RlID0gTm9kZVBsYWluIHwgTm9kZUNvbXBsZXhcblxuLyoqXG4gKiBQYXJzZXMgYSBEU0wgc3RyaW5nIGludG8gYW4gYXJyYXkgb2Ygbm9kZSBvYmplY3RzLlxuICogQHBhcmFtIGRzbCAtIFRoZSBpbnB1dCBEU0wgc3RyaW5nLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2YgcGFyc2VkIG5vZGVzLlxuICovXG5mdW5jdGlvbiBwYXJzZURTTChkc2w6IHN0cmluZyk6IE5vZGVEYXRhW10ge1xuICByZXR1cm4gY29udmVydFRvTm9kZURhdGEocGFyc2VUb3BMZXZlbEZsb3coZHNsKS5tYXAobm9kZVN0ciA9PiBwYXJzZU5vZGUobm9kZVN0cikpKVxufVxuXG4vKipcbiAqIFNwbGl0cyBhIHRvcC1sZXZlbCBmbG93IHN0cmluZyBieSBcIi0+XCIsIHJlc3BlY3RpbmcgbmVzdGVkIHN0cnVjdHVyZXMuXG4gKiBAcGFyYW0gZHNsIC0gVGhlIERTTCBzdHJpbmcgdG8gc3BsaXQuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiB0b3AtbGV2ZWwgc2VnbWVudHMuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlVG9wTGV2ZWxGbG93KGRzbDogc3RyaW5nKTogc3RyaW5nW10ge1xuICBjb25zdCBzZWdtZW50czogc3RyaW5nW10gPSBbXVxuICBsZXQgYnVmZmVyID0gJydcbiAgbGV0IG5lc3RlZCA9IDBcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRzbC5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoYXIgPSBkc2xbaV1cbiAgICBpZiAoY2hhciA9PT0gJygnKVxuICAgICAgbmVzdGVkKytcbiAgICBpZiAoY2hhciA9PT0gJyknKVxuICAgICAgbmVzdGVkLS1cbiAgICBpZiAoY2hhciA9PT0gJy0nICYmIGRzbFtpICsgMV0gPT09ICc+JyAmJiBuZXN0ZWQgPT09IDApIHtcbiAgICAgIHNlZ21lbnRzLnB1c2goYnVmZmVyLnRyaW0oKSlcbiAgICAgIGJ1ZmZlciA9ICcnXG4gICAgICBpKysgLy8gU2tpcCB0aGUgXCI+XCIgY2hhcmFjdGVyXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYnVmZmVyICs9IGNoYXJcbiAgICB9XG4gIH1cbiAgaWYgKGJ1ZmZlci50cmltKCkpXG4gICAgc2VnbWVudHMucHVzaChidWZmZXIudHJpbSgpKVxuXG4gIHJldHVybiBzZWdtZW50c1xufVxuXG4vKipcbiAqIFBhcnNlcyBhIHNpbmdsZSBub2RlIHN0cmluZy5cbiAqIElmIHRoZSBub2RlIGlzIGNvbXBsZXggKGUuZy4sIGhhcyBwYXJlbnRoZXNlcyksIGl0IGV4dHJhY3RzIHRoZSBub2RlIHR5cGUsIG5vZGUgSUQsIGFuZCBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIG5vZGVTdHIgLSBUaGUgbm9kZSBzdHJpbmcgdG8gcGFyc2UuXG4gKiBAcGFyYW0gcGFyZW50SXRlcmF0aW9uSWQgLSBUaGUgSUQgb2YgdGhlIHBhcmVudCBpdGVyYXRpb24gbm9kZSAoaWYgYXBwbGljYWJsZSkuXG4gKiBAcGFyYW0gcGFyZW50TG9vcElkIC0gVGhlIElEIG9mIHRoZSBwYXJlbnQgbG9vcCBub2RlIChpZiBhcHBsaWNhYmxlKS5cbiAqIEByZXR1cm5zIEEgcGFyc2VkIG5vZGUgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBwYXJzZU5vZGUobm9kZVN0cjogc3RyaW5nLCBwYXJlbnRJdGVyYXRpb25JZD86IHN0cmluZywgcGFyZW50TG9vcElkPzogc3RyaW5nKTogTm9kZSB7XG4gIC8vIENoZWNrIGlmIHRoZSBub2RlIGlzIGEgY29tcGxleCBub2RlXG4gIGlmIChub2RlU3RyLnN0YXJ0c1dpdGgoJygnKSAmJiBub2RlU3RyLmVuZHNXaXRoKCcpJykpIHtcbiAgICBjb25zdCBpbm5lckNvbnRlbnQgPSBub2RlU3RyLnNsaWNlKDEsIC0xKS50cmltKCkgLy8gUmVtb3ZlIG91dGVyIHBhcmVudGhlc2VzXG4gICAgbGV0IG5lc3RlZCA9IDBcbiAgICBsZXQgYnVmZmVyID0gJydcbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXVxuXG4gICAgLy8gU3BsaXQgdGhlIGlubmVyIGNvbnRlbnQgYnkgY29tbWFzLCByZXNwZWN0aW5nIG5lc3RlZCBwYXJlbnRoZXNlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5uZXJDb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gaW5uZXJDb250ZW50W2ldXG4gICAgICBpZiAoY2hhciA9PT0gJygnKVxuICAgICAgICBuZXN0ZWQrK1xuICAgICAgaWYgKGNoYXIgPT09ICcpJylcbiAgICAgICAgbmVzdGVkLS1cblxuICAgICAgaWYgKGNoYXIgPT09ICcsJyAmJiBuZXN0ZWQgPT09IDApIHtcbiAgICAgICAgcGFydHMucHVzaChidWZmZXIudHJpbSgpKVxuICAgICAgICBidWZmZXIgPSAnJ1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGJ1ZmZlciArPSBjaGFyXG4gICAgICB9XG4gICAgfVxuICAgIHBhcnRzLnB1c2goYnVmZmVyLnRyaW0oKSlcblxuICAgIC8vIEV4dHJhY3Qgbm9kZVR5cGUsIG5vZGVJZCwgYW5kIHBhcmFtc1xuICAgIGNvbnN0IFtub2RlVHlwZSwgbm9kZUlkLCAuLi5wYXJhbXNSYXddID0gcGFydHNcbiAgICBjb25zdCBwYXJhbXMgPSBwYXJzZVBhcmFtcyhwYXJhbXNSYXcsIG5vZGVUeXBlID09PSAnaXRlcmF0aW9uJyA/IG5vZGVJZC50cmltKCkgOiBwYXJlbnRJdGVyYXRpb25JZCwgbm9kZVR5cGUgPT09ICdsb29wJyA/IG5vZGVJZC50cmltKCkgOiBwYXJlbnRMb29wSWQpXG4gICAgY29uc3QgY29tcGxleE5vZGUgPSB7XG4gICAgICBub2RlVHlwZTogbm9kZVR5cGUudHJpbSgpLFxuICAgICAgbm9kZUlkOiBub2RlSWQudHJpbSgpLFxuICAgICAgcGFyYW1zLFxuICAgIH1cbiAgICBpZiAocGFyZW50SXRlcmF0aW9uSWQpIHtcbiAgICAgIChjb21wbGV4Tm9kZSBhcyBhbnkpLml0ZXJhdGlvbklkID0gcGFyZW50SXRlcmF0aW9uSWQ7XG4gICAgICAoY29tcGxleE5vZGUgYXMgYW55KS5pdGVyYXRpb25JbmRleCA9IDAgLy8gRml4ZWQgYXMgMFxuICAgIH1cbiAgICBpZiAocGFyZW50TG9vcElkKSB7XG4gICAgICAoY29tcGxleE5vZGUgYXMgYW55KS5sb29wSWQgPSBwYXJlbnRMb29wSWQ7XG4gICAgICAoY29tcGxleE5vZGUgYXMgYW55KS5sb29wSW5kZXggPSAwIC8vIEZpeGVkIGFzIDBcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBsZXhOb2RlXG4gIH1cblxuICAvLyBJZiBpdCdzIG5vdCBhIGNvbXBsZXggbm9kZSwgdHJlYXQgaXQgYXMgYSBwbGFpbiBub2RlXG4gIGNvbnN0IHBsYWluTm9kZTogTm9kZVBsYWluID0geyBub2RlVHlwZTogJ3BsYWluJywgbm9kZUlkOiBub2RlU3RyLnRyaW0oKSB9XG4gIGlmIChwYXJlbnRJdGVyYXRpb25JZCkge1xuICAgIHBsYWluTm9kZS5pdGVyYXRpb25JZCA9IHBhcmVudEl0ZXJhdGlvbklkXG4gICAgcGxhaW5Ob2RlLml0ZXJhdGlvbkluZGV4ID0gMCAvLyBGaXhlZCBhcyAwXG4gIH1cbiAgaWYgKHBhcmVudExvb3BJZCkge1xuICAgIHBsYWluTm9kZS5sb29wSWQgPSBwYXJlbnRMb29wSWRcbiAgICBwbGFpbk5vZGUubG9vcEluZGV4ID0gMCAvLyBGaXhlZCBhcyAwXG4gIH1cbiAgcmV0dXJuIHBsYWluTm9kZVxufVxuXG4vKipcbiAqIFBhcnNlcyBwYXJhbWV0ZXJzIG9mIGEgY29tcGxleCBub2RlLlxuICogU3VwcG9ydHMgbmVzdGVkIGZsb3dzIGFuZCBjb21wbGV4IHN1Yi1ub2Rlcy5cbiAqIEFkZHMgaXRlcmF0aW9uLXNwZWNpZmljIG1ldGFkYXRhIHJlY3Vyc2l2ZWx5LlxuICogQHBhcmFtIHBhcmFtUGFydHMgLSBUaGUgcGFyYW1ldGVycyBzdHJpbmcgc3BsaXQgYnkgY29tbWFzLlxuICogQHBhcmFtIHBhcmVudEl0ZXJhdGlvbklkIC0gVGhlIElEIG9mIHRoZSBwYXJlbnQgaXRlcmF0aW9uIG5vZGUgKGlmIGFwcGxpY2FibGUpLlxuICogQHBhcmFtIHBhcmVudExvb3BJZCAtIFRoZSBJRCBvZiB0aGUgcGFyZW50IGxvb3Agbm9kZSAoaWYgYXBwbGljYWJsZSkuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiBwYXJzZWQgcGFyYW1ldGVycyAocGxhaW4gbm9kZXMsIG5lc3RlZCBub2Rlcywgb3IgZmxvd3MpLlxuICovXG5mdW5jdGlvbiBwYXJzZVBhcmFtcyhwYXJhbVBhcnRzOiBzdHJpbmdbXSwgcGFyZW50SXRlcmF0aW9uPzogc3RyaW5nLCBwYXJlbnRMb29wSWQ/OiBzdHJpbmcpOiAoTm9kZSB8IE5vZGVbXSB8IG51bWJlcilbXSB7XG4gIHJldHVybiBwYXJhbVBhcnRzLm1hcCgocGFydCkgPT4ge1xuICAgIGlmIChwYXJ0LmluY2x1ZGVzKCctPicpKSB7XG4gICAgICAvLyBQYXJzZSBhcyBhIGZsb3cgYW5kIHJldHVybiBhbiBhcnJheSBvZiBub2Rlc1xuICAgICAgcmV0dXJuIHBhcnNlVG9wTGV2ZWxGbG93KHBhcnQpLm1hcChub2RlID0+IHBhcnNlTm9kZShub2RlLCBwYXJlbnRJdGVyYXRpb24gfHwgdW5kZWZpbmVkLCBwYXJlbnRMb29wSWQgfHwgdW5kZWZpbmVkKSlcbiAgICB9XG4gICAgZWxzZSBpZiAocGFydC5zdGFydHNXaXRoKCcoJykpIHtcbiAgICAgIC8vIFBhcnNlIGFzIGEgbmVzdGVkIGNvbXBsZXggbm9kZVxuICAgICAgcmV0dXJuIHBhcnNlTm9kZShwYXJ0LCBwYXJlbnRJdGVyYXRpb24gfHwgdW5kZWZpbmVkLCBwYXJlbnRMb29wSWQgfHwgdW5kZWZpbmVkKVxuICAgIH1cbiAgICBlbHNlIGlmICghTnVtYmVyLmlzTmFOKE51bWJlcihwYXJ0LnRyaW0oKSkpKSB7XG4gICAgICAvLyBQYXJzZSBhcyBhIG51bWVyaWMgcGFyYW1ldGVyXG4gICAgICByZXR1cm4gTnVtYmVyKHBhcnQudHJpbSgpKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIFBhcnNlIGFzIGEgcGxhaW4gbm9kZVxuICAgICAgcmV0dXJuIHBhcnNlTm9kZShwYXJ0LCBwYXJlbnRJdGVyYXRpb24gfHwgdW5kZWZpbmVkLCBwYXJlbnRMb29wSWQgfHwgdW5kZWZpbmVkKVxuICAgIH1cbiAgfSlcbn1cblxudHlwZSBOb2RlRGF0YSA9IHtcbiAgaWQ6IHN0cmluZ1xuICBub2RlX2lkOiBzdHJpbmdcbiAgdGl0bGU6IHN0cmluZ1xuICBub2RlX3R5cGU/OiBzdHJpbmdcbiAgZXhlY3V0aW9uX21ldGFkYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+XG4gIHN0YXR1czogc3RyaW5nXG59XG5cbi8qKlxuICogQ29udmVydHMgYSBwbGFpbiBub2RlIHRvIG5vZGUgZGF0YS5cbiAqL1xuZnVuY3Rpb24gY29udmVydFBsYWluTm9kZShub2RlOiBOb2RlKTogTm9kZURhdGFbXSB7XG4gIHJldHVybiBbXG4gICAge1xuICAgICAgaWQ6IG5vZGUubm9kZUlkLFxuICAgICAgbm9kZV9pZDogbm9kZS5ub2RlSWQsXG4gICAgICB0aXRsZTogbm9kZS5ub2RlSWQsXG4gICAgICBleGVjdXRpb25fbWV0YWRhdGE6IHt9LFxuICAgICAgc3RhdHVzOiAnc3VjY2VlZGVkJyxcbiAgICB9LFxuICBdXG59XG5cbi8qKlxuICogQ29udmVydHMgYSByZXRyeSBub2RlIHRvIG5vZGUgZGF0YS5cbiAqL1xuZnVuY3Rpb24gY29udmVydFJldHJ5Tm9kZShub2RlOiBOb2RlKTogTm9kZURhdGFbXSB7XG4gIGNvbnN0IHsgbm9kZUlkLCBpdGVyYXRpb25JZCwgaXRlcmF0aW9uSW5kZXgsIGxvb3BJZCwgbG9vcEluZGV4LCBwYXJhbXMgfSA9IG5vZGUgYXMgTm9kZUNvbXBsZXhcbiAgY29uc3QgcmV0cnlDb3VudCA9IHBhcmFtcyA/IE51bWJlci5wYXJzZUludChwYXJhbXNbMF0gYXMgdW5rbm93biBhcyBzdHJpbmcsIDEwKSA6IDBcbiAgY29uc3QgcmVzdWx0OiBOb2RlRGF0YVtdID0gW1xuICAgIHtcbiAgICAgIGlkOiBub2RlSWQsXG4gICAgICBub2RlX2lkOiBub2RlSWQsXG4gICAgICB0aXRsZTogbm9kZUlkLFxuICAgICAgZXhlY3V0aW9uX21ldGFkYXRhOiB7fSxcbiAgICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gICAgfSxcbiAgXVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcmV0cnlDb3VudDsgaSsrKSB7XG4gICAgcmVzdWx0LnB1c2goe1xuICAgICAgaWQ6IG5vZGVJZCxcbiAgICAgIG5vZGVfaWQ6IG5vZGVJZCxcbiAgICAgIHRpdGxlOiBub2RlSWQsXG4gICAgICBleGVjdXRpb25fbWV0YWRhdGE6IGl0ZXJhdGlvbklkXG4gICAgICAgID8ge1xuICAgICAgICAgICAgaXRlcmF0aW9uX2lkOiBpdGVyYXRpb25JZCxcbiAgICAgICAgICAgIGl0ZXJhdGlvbl9pbmRleDogaXRlcmF0aW9uSW5kZXggfHwgMCxcbiAgICAgICAgICB9XG4gICAgICAgIDogbG9vcElkXG4gICAgICAgICAgPyB7XG4gICAgICAgICAgICAgIGxvb3BfaWQ6IGxvb3BJZCxcbiAgICAgICAgICAgICAgbG9vcF9pbmRleDogbG9vcEluZGV4IHx8IDAsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgOiB7fSxcbiAgICAgIHN0YXR1czogJ3JldHJ5JyxcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGl0ZXJhdGlvbiBub2RlIHRvIG5vZGUgZGF0YS5cbiAqL1xuZnVuY3Rpb24gY29udmVydEl0ZXJhdGlvbk5vZGUobm9kZTogTm9kZSk6IE5vZGVEYXRhW10ge1xuICBjb25zdCB7IG5vZGVJZCwgcGFyYW1zIH0gPSBub2RlIGFzIE5vZGVDb21wbGV4XG4gIGNvbnN0IHJlc3VsdDogTm9kZURhdGFbXSA9IFtcbiAgICB7XG4gICAgICBpZDogbm9kZUlkLFxuICAgICAgbm9kZV9pZDogbm9kZUlkLFxuICAgICAgdGl0bGU6IG5vZGVJZCxcbiAgICAgIG5vZGVfdHlwZTogJ2l0ZXJhdGlvbicsXG4gICAgICBzdGF0dXM6ICdzdWNjZWVkZWQnLFxuICAgICAgZXhlY3V0aW9uX21ldGFkYXRhOiB7fSxcbiAgICB9LFxuICBdXG5cbiAgcGFyYW1zPy5mb3JFYWNoKChwYXJhbTogYW55KSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW0pKSB7XG4gICAgICBwYXJhbS5mb3JFYWNoKChjaGlsZE5vZGU6IE5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGREYXRhID0gY29udmVydFRvTm9kZURhdGEoW2NoaWxkTm9kZV0pXG4gICAgICAgIGNoaWxkRGF0YS5mb3JFYWNoKChkYXRhKSA9PiB7XG4gICAgICAgICAgZGF0YS5leGVjdXRpb25fbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICAuLi5kYXRhLmV4ZWN1dGlvbl9tZXRhZGF0YSxcbiAgICAgICAgICAgIGl0ZXJhdGlvbl9pZDogbm9kZUlkLFxuICAgICAgICAgICAgaXRlcmF0aW9uX2luZGV4OiAwLFxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmVzdWx0LnB1c2goLi4uY2hpbGREYXRhKVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGxvb3Agbm9kZSB0byBub2RlIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGNvbnZlcnRMb29wTm9kZShub2RlOiBOb2RlKTogTm9kZURhdGFbXSB7XG4gIGNvbnN0IHsgbm9kZUlkLCBwYXJhbXMgfSA9IG5vZGUgYXMgTm9kZUNvbXBsZXhcbiAgY29uc3QgcmVzdWx0OiBOb2RlRGF0YVtdID0gW1xuICAgIHtcbiAgICAgIGlkOiBub2RlSWQsXG4gICAgICBub2RlX2lkOiBub2RlSWQsXG4gICAgICB0aXRsZTogbm9kZUlkLFxuICAgICAgbm9kZV90eXBlOiAnbG9vcCcsXG4gICAgICBzdGF0dXM6ICdzdWNjZWVkZWQnLFxuICAgICAgZXhlY3V0aW9uX21ldGFkYXRhOiB7fSxcbiAgICB9LFxuICBdXG5cbiAgcGFyYW1zPy5mb3JFYWNoKChwYXJhbTogYW55KSA9PiB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW0pKSB7XG4gICAgICBwYXJhbS5mb3JFYWNoKChjaGlsZE5vZGU6IE5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgY2hpbGREYXRhID0gY29udmVydFRvTm9kZURhdGEoW2NoaWxkTm9kZV0pXG4gICAgICAgIGNoaWxkRGF0YS5mb3JFYWNoKChkYXRhKSA9PiB7XG4gICAgICAgICAgZGF0YS5leGVjdXRpb25fbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICAuLi5kYXRhLmV4ZWN1dGlvbl9tZXRhZGF0YSxcbiAgICAgICAgICAgIGxvb3BfaWQ6IG5vZGVJZCxcbiAgICAgICAgICAgIGxvb3BfaW5kZXg6IDAsXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZERhdGEpXG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbi8qKlxuICogQ29udmVydHMgYSBwYXJhbGxlbCBub2RlIHRvIG5vZGUgZGF0YS5cbiAqL1xuZnVuY3Rpb24gY29udmVydFBhcmFsbGVsTm9kZShub2RlOiBOb2RlLCBwYXJlbnRQYXJhbGxlbElkPzogc3RyaW5nLCBwYXJlbnRTdGFydE5vZGVJZD86IHN0cmluZyk6IE5vZGVEYXRhW10ge1xuICBjb25zdCB7IG5vZGVJZCwgcGFyYW1zIH0gPSBub2RlIGFzIE5vZGVDb21wbGV4XG4gIGNvbnN0IHJlc3VsdDogTm9kZURhdGFbXSA9IFtcbiAgICB7XG4gICAgICBpZDogbm9kZUlkLFxuICAgICAgbm9kZV9pZDogbm9kZUlkLFxuICAgICAgdGl0bGU6IG5vZGVJZCxcbiAgICAgIGV4ZWN1dGlvbl9tZXRhZGF0YToge1xuICAgICAgICBwYXJhbGxlbF9pZDogbm9kZUlkLFxuICAgICAgfSxcbiAgICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gICAgfSxcbiAgXVxuXG4gIHBhcmFtcz8uZm9yRWFjaCgocGFyYW0pID0+IHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbSkpIHtcbiAgICAgIGNvbnN0IHN0YXJ0Tm9kZUlkID0gcGFyYW1bMF0/Lm5vZGVJZFxuICAgICAgcGFyYW0uZm9yRWFjaCgoY2hpbGROb2RlOiBOb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IGNoaWxkRGF0YSA9IGNvbnZlcnRUb05vZGVEYXRhKFtjaGlsZE5vZGVdKVxuICAgICAgICBjaGlsZERhdGEuZm9yRWFjaCgoZGF0YSkgPT4ge1xuICAgICAgICAgIGRhdGEuZXhlY3V0aW9uX21ldGFkYXRhID0ge1xuICAgICAgICAgICAgLi4uZGF0YS5leGVjdXRpb25fbWV0YWRhdGEsXG4gICAgICAgICAgICBwYXJhbGxlbF9pZDogbm9kZUlkLFxuICAgICAgICAgICAgcGFyYWxsZWxfc3RhcnRfbm9kZV9pZDogc3RhcnROb2RlSWQsXG4gICAgICAgICAgICAuLi4ocGFyZW50UGFyYWxsZWxJZCAmJiB7XG4gICAgICAgICAgICAgIHBhcmVudF9wYXJhbGxlbF9pZDogcGFyZW50UGFyYWxsZWxJZCxcbiAgICAgICAgICAgICAgcGFyZW50X3BhcmFsbGVsX3N0YXJ0X25vZGVfaWQ6IHBhcmVudFN0YXJ0Tm9kZUlkLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXN1bHQucHVzaCguLi5jaGlsZERhdGEpXG4gICAgICB9KVxuICAgIH1cbiAgICBlbHNlIGlmIChwYXJhbSAmJiB0eXBlb2YgcGFyYW0gPT09ICdvYmplY3QnKSB7XG4gICAgICBjb25zdCBzdGFydE5vZGVJZCA9IHBhcmFtLm5vZGVJZFxuICAgICAgY29uc3QgY2hpbGREYXRhID0gY29udmVydFRvTm9kZURhdGEoW3BhcmFtXSlcbiAgICAgIGNoaWxkRGF0YS5mb3JFYWNoKChkYXRhKSA9PiB7XG4gICAgICAgIGRhdGEuZXhlY3V0aW9uX21ldGFkYXRhID0ge1xuICAgICAgICAgIC4uLmRhdGEuZXhlY3V0aW9uX21ldGFkYXRhLFxuICAgICAgICAgIHBhcmFsbGVsX2lkOiBub2RlSWQsXG4gICAgICAgICAgcGFyYWxsZWxfc3RhcnRfbm9kZV9pZDogc3RhcnROb2RlSWQsXG4gICAgICAgICAgLi4uKHBhcmVudFBhcmFsbGVsSWQgJiYge1xuICAgICAgICAgICAgcGFyZW50X3BhcmFsbGVsX2lkOiBwYXJlbnRQYXJhbGxlbElkLFxuICAgICAgICAgICAgcGFyZW50X3BhcmFsbGVsX3N0YXJ0X25vZGVfaWQ6IHBhcmVudFN0YXJ0Tm9kZUlkLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcmVzdWx0LnB1c2goLi4uY2hpbGREYXRhKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbi8qKlxuICogTWFpbiBmdW5jdGlvbiB0byBjb252ZXJ0IG5vZGVzIHRvIG5vZGUgZGF0YS5cbiAqL1xuZnVuY3Rpb24gY29udmVydFRvTm9kZURhdGEobm9kZXM6IE5vZGVbXSwgcGFyZW50UGFyYWxsZWxJZD86IHN0cmluZywgcGFyZW50U3RhcnROb2RlSWQ/OiBzdHJpbmcpOiBOb2RlRGF0YVtdIHtcbiAgY29uc3QgcmVzdWx0OiBOb2RlRGF0YVtdID0gW11cblxuICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICBjYXNlICdwbGFpbic6XG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLmNvbnZlcnRQbGFpbk5vZGUobm9kZSkpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdyZXRyeSc6XG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLmNvbnZlcnRSZXRyeU5vZGUobm9kZSkpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdpdGVyYXRpb24nOlxuICAgICAgICByZXN1bHQucHVzaCguLi5jb252ZXJ0SXRlcmF0aW9uTm9kZShub2RlKSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ2xvb3AnOlxuICAgICAgICByZXN1bHQucHVzaCguLi5jb252ZXJ0TG9vcE5vZGUobm9kZSkpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdwYXJhbGxlbCc6XG4gICAgICAgIHJlc3VsdC5wdXNoKC4uLmNvbnZlcnRQYXJhbGxlbE5vZGUobm9kZSwgcGFyZW50UGFyYWxsZWxJZCwgcGFyZW50U3RhcnROb2RlSWQpKVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIG5vZGVUeXBlOiAke25vZGUubm9kZVR5cGV9YClcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZURTTFxuIl19