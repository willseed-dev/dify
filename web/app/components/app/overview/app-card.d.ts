import type { ConfigParams } from './settings';
import type { AppDetailResponse } from '@/models/app';
import type { AppSSO } from '@/types/app';
import * as React from 'react';
export type IAppCardProps = {
    className?: string;
    appInfo: AppDetailResponse & Partial<AppSSO>;
    isInPanel?: boolean;
    cardType?: 'api' | 'webapp';
    customBgColor?: string;
    triggerModeDisabled?: boolean;
    triggerModeMessage?: React.ReactNode;
    onChangeStatus: (val: boolean) => Promise<void>;
    onSaveSiteConfig?: (params: ConfigParams) => Promise<void>;
    onGenerateCode?: () => Promise<void>;
};
declare function AppCard({ appInfo, isInPanel, cardType, customBgColor, triggerModeDisabled, triggerModeMessage, onChangeStatus, onSaveSiteConfig, onGenerateCode, className, }: IAppCardProps): any;
export default AppCard;
