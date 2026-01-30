import type { MetadataShape } from '@/app/components/workflow/nodes/knowledge-retrieval/types';
import { MetadataFilteringModeEnum } from '@/app/components/workflow/nodes/knowledge-retrieval/types';
type MetadataFilterProps = {
    metadataFilterMode?: MetadataFilteringModeEnum;
    handleMetadataFilterModeChange: (mode: MetadataFilteringModeEnum) => void;
} & MetadataShape;
declare const MetadataFilter: ({ metadataFilterMode, handleMetadataFilterModeChange, metadataModelConfig, handleMetadataModelChange, handleMetadataCompletionParamsChange, ...restProps }: MetadataFilterProps) => any;
export default MetadataFilter;
