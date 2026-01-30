import { AppModeEnum } from '@/types/app';
type CreateAppProps = {
    onSuccess: () => void;
    onClose: () => void;
    onCreateFromTemplate?: () => void;
    defaultAppMode?: AppModeEnum;
};
type CreateAppDialogProps = CreateAppProps & {
    show: boolean;
};
declare const CreateAppModal: ({ show, onClose, onSuccess, onCreateFromTemplate, defaultAppMode }: CreateAppDialogProps) => any;
export default CreateAppModal;
