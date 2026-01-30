import type { MetadataShape } from '@/app/components/workflow/nodes/knowledge-retrieval/types';
type MetadataPanelProps = {
    onCancel: () => void;
} & MetadataShape;
declare const MetadataPanel: ({ metadataFilteringConditions, metadataList, onCancel, handleAddCondition, ...restProps }: MetadataPanelProps) => any;
export default MetadataPanel;
