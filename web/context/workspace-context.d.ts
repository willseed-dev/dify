import type { IWorkspace } from '@/models/common';
export type WorkspacesContextValue = {
    workspaces: IWorkspace[];
};
declare const WorkspacesContext: any;
type IWorkspaceProviderProps = {
    children: React.ReactNode;
};
export declare const WorkspaceProvider: ({ children, }: IWorkspaceProviderProps) => any;
export declare const useWorkspacesContext: () => any;
export default WorkspacesContext;
