import type { AppIconType } from '@/types/app';
export type IAppNavItemProps = {
    isMobile: boolean;
    name: string;
    id: string;
    icon_type: AppIconType | null;
    icon: string;
    icon_background: string;
    icon_url: string;
    isSelected: boolean;
    isPinned: boolean;
    togglePin: () => void;
    uninstallable: boolean;
    onDelete: (id: string) => void;
};
export default function AppNavItem({ isMobile, name, id, icon_type, icon, icon_background, icon_url, isSelected, isPinned, togglePin, uninstallable, onDelete, }: IAppNavItemProps): any;
