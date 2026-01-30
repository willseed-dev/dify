import type { AppIconType } from '@/types/app';
export type DuplicateAppModalProps = {
    appName: string;
    icon_type: AppIconType | null;
    icon: string;
    icon_background?: string | null;
    icon_url?: string | null;
    show: boolean;
    onConfirm: (info: {
        name: string;
        icon_type: AppIconType;
        icon: string;
        icon_background?: string | null;
    }) => Promise<void>;
    onHide: () => void;
};
declare const DuplicateAppModal: ({ appName, icon_type, icon, icon_background, icon_url, show, onConfirm, onHide, }: DuplicateAppModalProps) => any;
export default DuplicateAppModal;
