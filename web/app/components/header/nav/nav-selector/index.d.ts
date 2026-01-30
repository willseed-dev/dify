import type { AppIconType, AppModeEnum } from '@/types/app';
export type NavItem = {
    id: string;
    name: string;
    link: string;
    icon_type: AppIconType | null;
    icon: string;
    icon_background: string | null;
    icon_url: string | null;
    mode?: AppModeEnum;
};
export type INavSelectorProps = {
    navigationItems: NavItem[];
    curNav?: Omit<NavItem, 'link'>;
    createText: string;
    isApp?: boolean;
    onCreate: (state: string) => void;
    onLoadMore?: () => void;
};
declare const NavSelector: ({ curNav, navigationItems, createText, isApp, onCreate, onLoadMore }: INavSelectorProps) => any;
export default NavSelector;
