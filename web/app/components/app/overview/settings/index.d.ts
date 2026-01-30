import type { AppDetailResponse } from '@/models/app';
import type { AppIconType, AppSSO } from '@/types/app';
export type ISettingsModalProps = {
    isChat: boolean;
    appInfo: AppDetailResponse & Partial<AppSSO>;
    isShow: boolean;
    defaultValue?: string;
    onClose: () => void;
    onSave?: (params: ConfigParams) => Promise<void>;
};
export type ConfigParams = {
    title: string;
    description: string;
    default_language: string;
    chat_color_theme: string;
    chat_color_theme_inverted: boolean;
    prompt_public: boolean;
    copyright: string;
    privacy_policy: string;
    custom_disclaimer: string;
    icon_type: AppIconType;
    icon: string;
    icon_background?: string;
    show_workflow_steps: boolean;
    use_icon_as_answer_icon: boolean;
    enable_sso?: boolean;
};
declare const _default: any;
export default _default;
