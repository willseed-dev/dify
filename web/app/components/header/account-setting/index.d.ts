import type { AccountSettingTab } from '@/app/components/header/account-setting/constants';
type IAccountSettingProps = {
    onCancel: () => void;
    activeTab?: AccountSettingTab;
    onTabChange?: (tab: AccountSettingTab) => void;
};
export default function AccountSetting({ onCancel, activeTab, onTabChange, }: IAccountSettingProps): any;
export {};
