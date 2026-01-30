import type { HeaderInNormalProps } from './header-in-normal';
import type { HeaderInRestoringProps } from './header-in-restoring';
import type { HeaderInHistoryProps } from './header-in-view-history';
export type HeaderProps = {
    normal?: HeaderInNormalProps;
    viewHistory?: HeaderInHistoryProps;
    restoring?: HeaderInRestoringProps;
};
declare const Header: ({ normal: normalProps, viewHistory: viewHistoryProps, restoring: restoringProps, }: HeaderProps) => any;
export default Header;
