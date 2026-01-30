import type { AppDetailResponse } from '@/models/app';
type IAppSelectorProps = {
    appItems: AppDetailResponse[];
    curApp: AppDetailResponse;
};
export default function AppSelector({ appItems, curApp }: IAppSelectorProps): any;
export {};
