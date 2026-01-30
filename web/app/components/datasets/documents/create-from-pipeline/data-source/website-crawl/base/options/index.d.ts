import type { RAGPipelineVariables } from '@/models/pipeline';
import { CrawlStep } from '@/models/datasets';
type OptionsProps = {
    variables: RAGPipelineVariables;
    step: CrawlStep;
    runDisabled?: boolean;
    onSubmit: (data: Record<string, any>) => void;
};
declare const Options: ({ variables, step, runDisabled, onSubmit, }: OptionsProps) => any;
export default Options;
