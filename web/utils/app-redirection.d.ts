import { AppModeEnum } from '@/types/app';
export declare const getRedirectionPath: (isCurrentWorkspaceEditor: boolean, app: {
    id: string;
    mode: AppModeEnum;
}) => string;
export declare const getRedirection: (isCurrentWorkspaceEditor: boolean, app: {
    id: string;
    mode: AppModeEnum;
}, redirectionFunc: (href: string) => void) => void;
