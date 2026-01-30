type CreateAppDialogProps = {
    show: boolean;
    onSuccess: () => void;
    onClose: () => void;
    onCreateFromBlank?: () => void;
};
declare const CreateAppTemplateDialog: ({ show, onSuccess, onClose, onCreateFromBlank }: CreateAppDialogProps) => any;
export default CreateAppTemplateDialog;
