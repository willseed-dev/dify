import type { LangGeniusVersionResponse } from '@/models/common';
type IAccountSettingProps = {
    langGeniusVersionInfo: LangGeniusVersionResponse;
    onCancel: () => void;
};
export default function AccountAbout({ langGeniusVersionInfo, onCancel, }: IAccountSettingProps): any;
export {};
