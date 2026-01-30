type CreateFromDSLModalProps = {
    show: boolean;
    onSuccess?: () => void;
    onClose: () => void;
    activeTab?: string;
    dslUrl?: string;
    droppedFile?: File;
};
export declare enum CreateFromDSLModalTab {
    FROM_FILE = "from-file",
    FROM_URL = "from-url"
}
declare const CreateFromDSLModal: ({ show, onSuccess, onClose, activeTab, dslUrl, droppedFile }: CreateFromDSLModalProps) => any;
export default CreateFromDSLModal;
