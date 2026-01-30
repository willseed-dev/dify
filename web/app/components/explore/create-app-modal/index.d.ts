import type { AppIconType } from '@/types/app';
export type CreateAppModalProps = {
    show: boolean;
    isEditModal?: boolean;
    appName: string;
    appDescription: string;
    appIconType: AppIconType | null;
    appIcon: string;
    appIconBackground?: string | null;
    appIconUrl?: string | null;
    appMode?: string;
    appUseIconAsAnswerIcon?: boolean;
    max_active_requests?: number | null;
    onConfirm: (info: {
        name: string;
        icon_type: AppIconType;
        icon: string;
        icon_background?: string;
        description: string;
        use_icon_as_answer_icon?: boolean;
        max_active_requests?: number | null;
    }) => Promise<void>;
    confirmDisabled?: boolean;
    onHide: () => void;
};
declare const CreateAppModal: ({ show, isEditModal, appIconType, appIcon: _appIcon, appIconBackground, appIconUrl, appName, appDescription, appMode, appUseIconAsAnswerIcon, max_active_requests, onConfirm, confirmDisabled, onHide, }: CreateAppModalProps) => any;
export default CreateAppModal;
