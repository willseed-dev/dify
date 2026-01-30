import type { Datasource } from '@/app/components/rag-pipeline/components/panel/test-run/types';
import type { DataSourceNodeType } from '@/app/components/workflow/nodes/data-source/types';
import type { Node } from '@/app/components/workflow/types';
type DataSourceOptionsProps = {
    pipelineNodes: Node<DataSourceNodeType>[];
    datasourceNodeId: string;
    onSelect: (option: Datasource) => void;
};
declare const DataSourceOptions: ({ pipelineNodes, datasourceNodeId, onSelect, }: DataSourceOptionsProps) => any;
export default DataSourceOptions;
