import type { NavIcon } from './navLink';
type DatasetSidebarDropdownProps = {
    navigation: Array<{
        name: string;
        href: string;
        icon: NavIcon;
        selectedIcon: NavIcon;
        disabled?: boolean;
    }>;
};
declare const DatasetSidebarDropdown: ({ navigation, }: DatasetSidebarDropdownProps) => any;
export default DatasetSidebarDropdown;
