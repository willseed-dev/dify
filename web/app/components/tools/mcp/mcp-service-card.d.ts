import type { AppDetailResponse } from '@/models/app';
import type { AppSSO } from '@/types/app';
import * as React from 'react';
export type IAppCardProps = {
    appInfo: AppDetailResponse & Partial<AppSSO>;
    triggerModeDisabled?: boolean;
    triggerModeMessage?: React.ReactNode;
};
declare function MCPServiceCard({ appInfo, triggerModeDisabled, triggerModeMessage, }: IAppCardProps): any;
export default MCPServiceCard;
