import type { FC, ReactNode } from 'react';
import type { ICurrentWorkspace, LangGeniusVersionResponse, UserProfileResponse } from '@/models/common';
export type AppContextValue = {
    userProfile: UserProfileResponse;
    mutateUserProfile: VoidFunction;
    currentWorkspace: ICurrentWorkspace;
    isCurrentWorkspaceManager: boolean;
    isCurrentWorkspaceOwner: boolean;
    isCurrentWorkspaceEditor: boolean;
    isCurrentWorkspaceDatasetOperator: boolean;
    mutateCurrentWorkspace: VoidFunction;
    langGeniusVersionInfo: LangGeniusVersionResponse;
    useSelector: typeof useSelector;
    isLoadingCurrentWorkspace: boolean;
    isValidatingCurrentWorkspace: boolean;
};
declare const AppContext: any;
export declare function useSelector<T>(selector: (value: AppContextValue) => T): T;
export type AppContextProviderProps = {
    children: ReactNode;
};
export declare const AppContextProvider: FC<AppContextProviderProps>;
export declare const useAppContext: () => any;
export default AppContext;
