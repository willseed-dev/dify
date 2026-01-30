/**
 * Parses a DSL string into an array of node objects.
 * @param dsl - The input DSL string.
 * @returns An array of parsed nodes.
 */
declare function parseDSL(dsl: string): NodeData[];
type NodeData = {
    id: string;
    node_id: string;
    title: string;
    node_type?: string;
    execution_metadata: Record<string, any>;
    status: string;
};
export default parseDSL;
