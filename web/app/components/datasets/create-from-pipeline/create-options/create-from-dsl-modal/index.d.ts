type CreateFromDSLModalProps = {
    show: boolean;
    onSuccess?: () => void;
    onClose: () => void;
    activeTab?: CreateFromDSLModalTab;
    dslUrl?: string;
};
export declare enum CreateFromDSLModalTab {
    FROM_FILE = "from-file",
    FROM_URL = "from-url"
}
declare const CreateFromDSLModal: ({ show, onSuccess, onClose, activeTab, dslUrl, }: CreateFromDSLModalProps) => any;
export default CreateFromDSLModal;
