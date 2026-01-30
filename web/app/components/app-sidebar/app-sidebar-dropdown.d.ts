import type { NavIcon } from './navLink';
type Props = {
    navigation: Array<{
        name: string;
        href: string;
        icon: NavIcon;
        selectedIcon: NavIcon;
    }>;
};
declare const AppSidebarDropdown: ({ navigation }: Props) => any;
export default AppSidebarDropdown;
