import type { IconInfo } from '@/models/datasets';
type PublishAsKnowledgePipelineModalProps = {
    confirmDisabled?: boolean;
    onCancel: () => void;
    onConfirm: (name: string, icon: IconInfo, description?: string) => Promise<void>;
};
declare const PublishAsKnowledgePipelineModal: ({ confirmDisabled, onCancel, onConfirm, }: PublishAsKnowledgePipelineModalProps) => any;
export default PublishAsKnowledgePipelineModal;
