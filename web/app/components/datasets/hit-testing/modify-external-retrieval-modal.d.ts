type ModifyExternalRetrievalModalProps = {
    onClose: () => void;
    onSave: (data: {
        top_k: number;
        score_threshold: number;
        score_threshold_enabled: boolean;
    }) => void;
    initialTopK: number;
    initialScoreThreshold: number;
    initialScoreThresholdEnabled: boolean;
};
declare const ModifyExternalRetrievalModal: React.FC<ModifyExternalRetrievalModalProps>;
export default ModifyExternalRetrievalModal;
