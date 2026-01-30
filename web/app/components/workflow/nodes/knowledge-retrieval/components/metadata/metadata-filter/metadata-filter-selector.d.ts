import { MetadataFilteringModeEnum } from '@/app/components/workflow/nodes/knowledge-retrieval/types';
type MetadataFilterSelectorProps = {
    value?: MetadataFilteringModeEnum;
    onSelect: (value: MetadataFilteringModeEnum) => void;
};
declare const MetadataFilterSelector: ({ value, onSelect, }: MetadataFilterSelectorProps) => any;
export default MetadataFilterSelector;
