"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppContext = exports.AppContextProvider = void 0;
exports.useSelector = useSelector;
const react_query_1 = require("@tanstack/react-query");
const function_1 = require("es-toolkit/function");
const react_1 = require("react");
const use_context_selector_1 = require("use-context-selector");
const amplitude_1 = require("@/app/components/base/amplitude");
const utils_1 = require("@/app/components/base/zendesk/utils");
const maintenance_notice_1 = require("@/app/components/header/maintenance-notice");
const config_1 = require("@/config");
const use_common_1 = require("@/service/use-common");
const global_public_context_1 = require("./global-public-context");
const userProfilePlaceholder = {
    id: '',
    name: '',
    email: '',
    avatar: '',
    avatar_url: '',
    is_password_set: false,
};
const initialLangGeniusVersionInfo = {
    current_env: '',
    current_version: '',
    latest_version: '',
    release_date: '',
    release_notes: '',
    version: '',
    can_auto_update: false,
};
const initialWorkspaceInfo = {
    id: '',
    name: '',
    plan: '',
    status: '',
    created_at: 0,
    role: 'normal',
    providers: [],
    trial_credits: 200,
    trial_credits_used: 0,
    next_credit_reset_date: 0,
};
const AppContext = (0, use_context_selector_1.createContext)({
    userProfile: userProfilePlaceholder,
    currentWorkspace: initialWorkspaceInfo,
    isCurrentWorkspaceManager: false,
    isCurrentWorkspaceOwner: false,
    isCurrentWorkspaceEditor: false,
    isCurrentWorkspaceDatasetOperator: false,
    mutateUserProfile: function_1.noop,
    mutateCurrentWorkspace: function_1.noop,
    langGeniusVersionInfo: initialLangGeniusVersionInfo,
    useSelector,
    isLoadingCurrentWorkspace: false,
    isValidatingCurrentWorkspace: false,
});
function useSelector(selector) {
    return (0, use_context_selector_1.useContextSelector)(AppContext, selector);
}
const AppContextProvider = ({ children }) => {
    const queryClient = (0, react_query_1.useQueryClient)();
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const { data: userProfileResp } = (0, use_common_1.useUserProfile)();
    const { data: currentWorkspaceResp, isPending: isLoadingCurrentWorkspace, isFetching: isValidatingCurrentWorkspace } = (0, use_common_1.useCurrentWorkspace)();
    const langGeniusVersionQuery = (0, use_common_1.useLangGeniusVersion)(userProfileResp?.meta.currentVersion, !systemFeatures.branding.enabled);
    const userProfile = (0, react_1.useMemo)(() => userProfileResp?.profile || userProfilePlaceholder, [userProfileResp?.profile]);
    const currentWorkspace = (0, react_1.useMemo)(() => currentWorkspaceResp || initialWorkspaceInfo, [currentWorkspaceResp]);
    const langGeniusVersionInfo = (0, react_1.useMemo)(() => {
        if (!userProfileResp?.meta?.currentVersion || !langGeniusVersionQuery.data)
            return initialLangGeniusVersionInfo;
        const current_version = userProfileResp.meta.currentVersion;
        const current_env = userProfileResp.meta.currentEnv || '';
        const versionData = langGeniusVersionQuery.data;
        return {
            ...versionData,
            current_version,
            latest_version: versionData.version,
            current_env,
        };
    }, [langGeniusVersionQuery.data, userProfileResp?.meta]);
    const isCurrentWorkspaceManager = (0, react_1.useMemo)(() => ['owner', 'admin'].includes(currentWorkspace.role), [currentWorkspace.role]);
    const isCurrentWorkspaceOwner = (0, react_1.useMemo)(() => currentWorkspace.role === 'owner', [currentWorkspace.role]);
    const isCurrentWorkspaceEditor = (0, react_1.useMemo)(() => ['owner', 'admin', 'editor'].includes(currentWorkspace.role), [currentWorkspace.role]);
    const isCurrentWorkspaceDatasetOperator = (0, react_1.useMemo)(() => currentWorkspace.role === 'dataset_operator', [currentWorkspace.role]);
    const mutateUserProfile = (0, react_1.useCallback)(() => {
        queryClient.invalidateQueries({ queryKey: ['common', 'user-profile'] });
    }, [queryClient]);
    const mutateCurrentWorkspace = (0, react_1.useCallback)(() => {
        queryClient.invalidateQueries({ queryKey: ['common', 'current-workspace'] });
    }, [queryClient]);
    // #region Zendesk conversation fields
    (0, react_1.useEffect)(() => {
        if (config_1.ZENDESK_FIELD_IDS.ENVIRONMENT && langGeniusVersionInfo?.current_env) {
            (0, utils_1.setZendeskConversationFields)([{
                    id: config_1.ZENDESK_FIELD_IDS.ENVIRONMENT,
                    value: langGeniusVersionInfo.current_env.toLowerCase(),
                }]);
        }
    }, [langGeniusVersionInfo?.current_env]);
    (0, react_1.useEffect)(() => {
        if (config_1.ZENDESK_FIELD_IDS.VERSION && langGeniusVersionInfo?.version) {
            (0, utils_1.setZendeskConversationFields)([{
                    id: config_1.ZENDESK_FIELD_IDS.VERSION,
                    value: langGeniusVersionInfo.version,
                }]);
        }
    }, [langGeniusVersionInfo?.version]);
    (0, react_1.useEffect)(() => {
        if (config_1.ZENDESK_FIELD_IDS.EMAIL && userProfile?.email) {
            (0, utils_1.setZendeskConversationFields)([{
                    id: config_1.ZENDESK_FIELD_IDS.EMAIL,
                    value: userProfile.email,
                }]);
        }
    }, [userProfile?.email]);
    (0, react_1.useEffect)(() => {
        if (config_1.ZENDESK_FIELD_IDS.WORKSPACE_ID && currentWorkspace?.id) {
            (0, utils_1.setZendeskConversationFields)([{
                    id: config_1.ZENDESK_FIELD_IDS.WORKSPACE_ID,
                    value: currentWorkspace.id,
                }]);
        }
    }, [currentWorkspace?.id]);
    // #endregion Zendesk conversation fields
    (0, react_1.useEffect)(() => {
        // Report user and workspace info to Amplitude when loaded
        if (userProfile?.id) {
            (0, amplitude_1.setUserId)(userProfile.email);
            const properties = {
                email: userProfile.email,
                name: userProfile.name,
                has_password: userProfile.is_password_set,
            };
            if (currentWorkspace?.id) {
                properties.workspace_id = currentWorkspace.id;
                properties.workspace_name = currentWorkspace.name;
                properties.workspace_plan = currentWorkspace.plan;
                properties.workspace_status = currentWorkspace.status;
                properties.workspace_role = currentWorkspace.role;
            }
            (0, amplitude_1.setUserProperties)(properties);
        }
    }, [userProfile, currentWorkspace]);
    return (<AppContext.Provider value={{
            userProfile,
            mutateUserProfile,
            langGeniusVersionInfo,
            useSelector,
            currentWorkspace,
            isCurrentWorkspaceManager,
            isCurrentWorkspaceOwner,
            isCurrentWorkspaceEditor,
            isCurrentWorkspaceDatasetOperator,
            mutateCurrentWorkspace,
            isLoadingCurrentWorkspace,
            isValidatingCurrentWorkspace,
        }}>
      <div className="flex h-full flex-col overflow-y-auto">
        {globalThis.document?.body?.getAttribute('data-public-maintenance-notice') && <maintenance_notice_1.default />}
        <div className="relative flex grow flex-col overflow-y-auto overflow-x-hidden bg-background-body">
          {children}
        </div>
      </div>
    </AppContext.Provider>);
};
exports.AppContextProvider = AppContextProvider;
const useAppContext = () => (0, use_context_selector_1.useContext)(AppContext);
exports.useAppContext = useAppContext;
exports.default = AppContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHAtY29udGV4dC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBaUZaLGtDQUVDO0FBL0VELHVEQUFzRDtBQUN0RCxrREFBMEM7QUFDMUMsaUNBQXVEO0FBQ3ZELCtEQUFvRjtBQUNwRiwrREFBOEU7QUFDOUUsK0RBQWtGO0FBQ2xGLG1GQUEwRTtBQUMxRSxxQ0FBNEM7QUFDNUMscURBSTZCO0FBQzdCLG1FQUE4RDtBQWlCOUQsTUFBTSxzQkFBc0IsR0FBRztJQUM3QixFQUFFLEVBQUUsRUFBRTtJQUNOLElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxNQUFNLEVBQUUsRUFBRTtJQUNWLFVBQVUsRUFBRSxFQUFFO0lBQ2QsZUFBZSxFQUFFLEtBQUs7Q0FDdkIsQ0FBQTtBQUVELE1BQU0sNEJBQTRCLEdBQUc7SUFDbkMsV0FBVyxFQUFFLEVBQUU7SUFDZixlQUFlLEVBQUUsRUFBRTtJQUNuQixjQUFjLEVBQUUsRUFBRTtJQUNsQixZQUFZLEVBQUUsRUFBRTtJQUNoQixhQUFhLEVBQUUsRUFBRTtJQUNqQixPQUFPLEVBQUUsRUFBRTtJQUNYLGVBQWUsRUFBRSxLQUFLO0NBQ3ZCLENBQUE7QUFFRCxNQUFNLG9CQUFvQixHQUFzQjtJQUM5QyxFQUFFLEVBQUUsRUFBRTtJQUNOLElBQUksRUFBRSxFQUFFO0lBQ1IsSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUUsRUFBRTtJQUNWLFVBQVUsRUFBRSxDQUFDO0lBQ2IsSUFBSSxFQUFFLFFBQVE7SUFDZCxTQUFTLEVBQUUsRUFBRTtJQUNiLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLGtCQUFrQixFQUFFLENBQUM7SUFDckIsc0JBQXNCLEVBQUUsQ0FBQztDQUMxQixDQUFBO0FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBQSxvQ0FBYSxFQUFrQjtJQUNoRCxXQUFXLEVBQUUsc0JBQXNC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LENBQUMsSUFBSSxDQUFDLDRCQUFpQixDQUFDLEFBQUQsRUFBRyxDQUNuRztRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrRkFBa0YsQ0FDL0Y7VUFBQSxDQUFDLFFBQVEsQ0FDWDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FDdkIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQTVIWSxRQUFBLGtCQUFrQixzQkE0SDlCO0FBRU0sTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBQSxpQ0FBVSxFQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQTVDLFFBQUEsYUFBYSxpQkFBK0I7QUFFekQsa0JBQWUsVUFBVSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgRkMsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBJQ3VycmVudFdvcmtzcGFjZSwgTGFuZ0dlbml1c1ZlcnNpb25SZXNwb25zZSwgVXNlclByb2ZpbGVSZXNwb25zZSB9IGZyb20gJ0AvbW9kZWxzL2NvbW1vbidcbmltcG9ydCB7IHVzZVF1ZXJ5Q2xpZW50IH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJ2VzLXRvb2xraXQvZnVuY3Rpb24nXG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VDb250ZXh0U2VsZWN0b3IgfSBmcm9tICd1c2UtY29udGV4dC1zZWxlY3RvcidcbmltcG9ydCB7IHNldFVzZXJJZCwgc2V0VXNlclByb3BlcnRpZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYW1wbGl0dWRlJ1xuaW1wb3J0IHsgc2V0WmVuZGVza0NvbnZlcnNhdGlvbkZpZWxkcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS96ZW5kZXNrL3V0aWxzJ1xuaW1wb3J0IE1haW50ZW5hbmNlTm90aWNlIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL21haW50ZW5hbmNlLW5vdGljZSdcbmltcG9ydCB7IFpFTkRFU0tfRklFTERfSURTIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQge1xuICB1c2VDdXJyZW50V29ya3NwYWNlLFxuICB1c2VMYW5nR2VuaXVzVmVyc2lvbixcbiAgdXNlVXNlclByb2ZpbGUsXG59IGZyb20gJ0Avc2VydmljZS91c2UtY29tbW9uJ1xuaW1wb3J0IHsgdXNlR2xvYmFsUHVibGljU3RvcmUgfSBmcm9tICcuL2dsb2JhbC1wdWJsaWMtY29udGV4dCdcblxuZXhwb3J0IHR5cGUgQXBwQ29udGV4dFZhbHVlID0ge1xuICB1c2VyUHJvZmlsZTogVXNlclByb2ZpbGVSZXNwb25zZVxuICBtdXRhdGVVc2VyUHJvZmlsZTogVm9pZEZ1bmN0aW9uXG4gIGN1cnJlbnRXb3Jrc3BhY2U6IElDdXJyZW50V29ya3NwYWNlXG4gIGlzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXI6IGJvb2xlYW5cbiAgaXNDdXJyZW50V29ya3NwYWNlT3duZXI6IGJvb2xlYW5cbiAgaXNDdXJyZW50V29ya3NwYWNlRWRpdG9yOiBib29sZWFuXG4gIGlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvcjogYm9vbGVhblxuICBtdXRhdGVDdXJyZW50V29ya3NwYWNlOiBWb2lkRnVuY3Rpb25cbiAgbGFuZ0dlbml1c1ZlcnNpb25JbmZvOiBMYW5nR2VuaXVzVmVyc2lvblJlc3BvbnNlXG4gIHVzZVNlbGVjdG9yOiB0eXBlb2YgdXNlU2VsZWN0b3JcbiAgaXNMb2FkaW5nQ3VycmVudFdvcmtzcGFjZTogYm9vbGVhblxuICBpc1ZhbGlkYXRpbmdDdXJyZW50V29ya3NwYWNlOiBib29sZWFuXG59XG5cbmNvbnN0IHVzZXJQcm9maWxlUGxhY2Vob2xkZXIgPSB7XG4gIGlkOiAnJyxcbiAgbmFtZTogJycsXG4gIGVtYWlsOiAnJyxcbiAgYXZhdGFyOiAnJyxcbiAgYXZhdGFyX3VybDogJycsXG4gIGlzX3Bhc3N3b3JkX3NldDogZmFsc2UsXG59XG5cbmNvbnN0IGluaXRpYWxMYW5nR2VuaXVzVmVyc2lvbkluZm8gPSB7XG4gIGN1cnJlbnRfZW52OiAnJyxcbiAgY3VycmVudF92ZXJzaW9uOiAnJyxcbiAgbGF0ZXN0X3ZlcnNpb246ICcnLFxuICByZWxlYXNlX2RhdGU6ICcnLFxuICByZWxlYXNlX25vdGVzOiAnJyxcbiAgdmVyc2lvbjogJycsXG4gIGNhbl9hdXRvX3VwZGF0ZTogZmFsc2UsXG59XG5cbmNvbnN0IGluaXRpYWxXb3Jrc3BhY2VJbmZvOiBJQ3VycmVudFdvcmtzcGFjZSA9IHtcbiAgaWQ6ICcnLFxuICBuYW1lOiAnJyxcbiAgcGxhbjogJycsXG4gIHN0YXR1czogJycsXG4gIGNyZWF0ZWRfYXQ6IDAsXG4gIHJvbGU6ICdub3JtYWwnLFxuICBwcm92aWRlcnM6IFtdLFxuICB0cmlhbF9jcmVkaXRzOiAyMDAsXG4gIHRyaWFsX2NyZWRpdHNfdXNlZDogMCxcbiAgbmV4dF9jcmVkaXRfcmVzZXRfZGF0ZTogMCxcbn1cblxuY29uc3QgQXBwQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8QXBwQ29udGV4dFZhbHVlPih7XG4gIHVzZXJQcm9maWxlOiB1c2VyUHJvZmlsZVBsYWNlaG9sZGVyLFxuICBjdXJyZW50V29ya3NwYWNlOiBpbml0aWFsV29ya3NwYWNlSW5mbyxcbiAgaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlcjogZmFsc2UsXG4gIGlzQ3VycmVudFdvcmtzcGFjZU93bmVyOiBmYWxzZSxcbiAgaXNDdXJyZW50V29ya3NwYWNlRWRpdG9yOiBmYWxzZSxcbiAgaXNDdXJyZW50V29ya3NwYWNlRGF0YXNldE9wZXJhdG9yOiBmYWxzZSxcbiAgbXV0YXRlVXNlclByb2ZpbGU6IG5vb3AsXG4gIG11dGF0ZUN1cnJlbnRXb3Jrc3BhY2U6IG5vb3AsXG4gIGxhbmdHZW5pdXNWZXJzaW9uSW5mbzogaW5pdGlhbExhbmdHZW5pdXNWZXJzaW9uSW5mbyxcbiAgdXNlU2VsZWN0b3IsXG4gIGlzTG9hZGluZ0N1cnJlbnRXb3Jrc3BhY2U6IGZhbHNlLFxuICBpc1ZhbGlkYXRpbmdDdXJyZW50V29ya3NwYWNlOiBmYWxzZSxcbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTZWxlY3RvcjxUPihzZWxlY3RvcjogKHZhbHVlOiBBcHBDb250ZXh0VmFsdWUpID0+IFQpOiBUIHtcbiAgcmV0dXJuIHVzZUNvbnRleHRTZWxlY3RvcihBcHBDb250ZXh0LCBzZWxlY3Rvcilcbn1cblxuZXhwb3J0IHR5cGUgQXBwQ29udGV4dFByb3ZpZGVyUHJvcHMgPSB7XG4gIGNoaWxkcmVuOiBSZWFjdE5vZGVcbn1cblxuZXhwb3J0IGNvbnN0IEFwcENvbnRleHRQcm92aWRlcjogRkM8QXBwQ29udGV4dFByb3ZpZGVyUHJvcHM+ID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IHVzZVF1ZXJ5Q2xpZW50KClcbiAgY29uc3Qgc3lzdGVtRmVhdHVyZXMgPSB1c2VHbG9iYWxQdWJsaWNTdG9yZShzID0+IHMuc3lzdGVtRmVhdHVyZXMpXG4gIGNvbnN0IHsgZGF0YTogdXNlclByb2ZpbGVSZXNwIH0gPSB1c2VVc2VyUHJvZmlsZSgpXG4gIGNvbnN0IHsgZGF0YTogY3VycmVudFdvcmtzcGFjZVJlc3AsIGlzUGVuZGluZzogaXNMb2FkaW5nQ3VycmVudFdvcmtzcGFjZSwgaXNGZXRjaGluZzogaXNWYWxpZGF0aW5nQ3VycmVudFdvcmtzcGFjZSB9ID0gdXNlQ3VycmVudFdvcmtzcGFjZSgpXG4gIGNvbnN0IGxhbmdHZW5pdXNWZXJzaW9uUXVlcnkgPSB1c2VMYW5nR2VuaXVzVmVyc2lvbihcbiAgICB1c2VyUHJvZmlsZVJlc3A/Lm1ldGEuY3VycmVudFZlcnNpb24sXG4gICAgIXN5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLmVuYWJsZWQsXG4gIClcblxuICBjb25zdCB1c2VyUHJvZmlsZSA9IHVzZU1lbW88VXNlclByb2ZpbGVSZXNwb25zZT4oKCkgPT4gdXNlclByb2ZpbGVSZXNwPy5wcm9maWxlIHx8IHVzZXJQcm9maWxlUGxhY2Vob2xkZXIsIFt1c2VyUHJvZmlsZVJlc3A/LnByb2ZpbGVdKVxuICBjb25zdCBjdXJyZW50V29ya3NwYWNlID0gdXNlTWVtbzxJQ3VycmVudFdvcmtzcGFjZT4oKCkgPT4gY3VycmVudFdvcmtzcGFjZVJlc3AgfHwgaW5pdGlhbFdvcmtzcGFjZUluZm8sIFtjdXJyZW50V29ya3NwYWNlUmVzcF0pXG4gIGNvbnN0IGxhbmdHZW5pdXNWZXJzaW9uSW5mbyA9IHVzZU1lbW88TGFuZ0dlbml1c1ZlcnNpb25SZXNwb25zZT4oKCkgPT4ge1xuICAgIGlmICghdXNlclByb2ZpbGVSZXNwPy5tZXRhPy5jdXJyZW50VmVyc2lvbiB8fCAhbGFuZ0dlbml1c1ZlcnNpb25RdWVyeS5kYXRhKVxuICAgICAgcmV0dXJuIGluaXRpYWxMYW5nR2VuaXVzVmVyc2lvbkluZm9cblxuICAgIGNvbnN0IGN1cnJlbnRfdmVyc2lvbiA9IHVzZXJQcm9maWxlUmVzcC5tZXRhLmN1cnJlbnRWZXJzaW9uXG4gICAgY29uc3QgY3VycmVudF9lbnYgPSB1c2VyUHJvZmlsZVJlc3AubWV0YS5jdXJyZW50RW52IHx8ICcnXG4gICAgY29uc3QgdmVyc2lvbkRhdGEgPSBsYW5nR2VuaXVzVmVyc2lvblF1ZXJ5LmRhdGFcbiAgICByZXR1cm4ge1xuICAgICAgLi4udmVyc2lvbkRhdGEsXG4gICAgICBjdXJyZW50X3ZlcnNpb24sXG4gICAgICBsYXRlc3RfdmVyc2lvbjogdmVyc2lvbkRhdGEudmVyc2lvbixcbiAgICAgIGN1cnJlbnRfZW52LFxuICAgIH1cbiAgfSwgW2xhbmdHZW5pdXNWZXJzaW9uUXVlcnkuZGF0YSwgdXNlclByb2ZpbGVSZXNwPy5tZXRhXSlcblxuICBjb25zdCBpc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyID0gdXNlTWVtbygoKSA9PiBbJ293bmVyJywgJ2FkbWluJ10uaW5jbHVkZXMoY3VycmVudFdvcmtzcGFjZS5yb2xlKSwgW2N1cnJlbnRXb3Jrc3BhY2Uucm9sZV0pXG4gIGNvbnN0IGlzQ3VycmVudFdvcmtzcGFjZU93bmVyID0gdXNlTWVtbygoKSA9PiBjdXJyZW50V29ya3NwYWNlLnJvbGUgPT09ICdvd25lcicsIFtjdXJyZW50V29ya3NwYWNlLnJvbGVdKVxuICBjb25zdCBpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3IgPSB1c2VNZW1vKCgpID0+IFsnb3duZXInLCAnYWRtaW4nLCAnZWRpdG9yJ10uaW5jbHVkZXMoY3VycmVudFdvcmtzcGFjZS5yb2xlKSwgW2N1cnJlbnRXb3Jrc3BhY2Uucm9sZV0pXG4gIGNvbnN0IGlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvciA9IHVzZU1lbW8oKCkgPT4gY3VycmVudFdvcmtzcGFjZS5yb2xlID09PSAnZGF0YXNldF9vcGVyYXRvcicsIFtjdXJyZW50V29ya3NwYWNlLnJvbGVdKVxuXG4gIGNvbnN0IG11dGF0ZVVzZXJQcm9maWxlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHF1ZXJ5Q2xpZW50LmludmFsaWRhdGVRdWVyaWVzKHsgcXVlcnlLZXk6IFsnY29tbW9uJywgJ3VzZXItcHJvZmlsZSddIH0pXG4gIH0sIFtxdWVyeUNsaWVudF0pXG5cbiAgY29uc3QgbXV0YXRlQ3VycmVudFdvcmtzcGFjZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyh7IHF1ZXJ5S2V5OiBbJ2NvbW1vbicsICdjdXJyZW50LXdvcmtzcGFjZSddIH0pXG4gIH0sIFtxdWVyeUNsaWVudF0pXG5cbiAgLy8gI3JlZ2lvbiBaZW5kZXNrIGNvbnZlcnNhdGlvbiBmaWVsZHNcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoWkVOREVTS19GSUVMRF9JRFMuRU5WSVJPTk1FTlQgJiYgbGFuZ0dlbml1c1ZlcnNpb25JbmZvPy5jdXJyZW50X2Vudikge1xuICAgICAgc2V0WmVuZGVza0NvbnZlcnNhdGlvbkZpZWxkcyhbe1xuICAgICAgICBpZDogWkVOREVTS19GSUVMRF9JRFMuRU5WSVJPTk1FTlQsXG4gICAgICAgIHZhbHVlOiBsYW5nR2VuaXVzVmVyc2lvbkluZm8uY3VycmVudF9lbnYudG9Mb3dlckNhc2UoKSxcbiAgICAgIH1dKVxuICAgIH1cbiAgfSwgW2xhbmdHZW5pdXNWZXJzaW9uSW5mbz8uY3VycmVudF9lbnZdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKFpFTkRFU0tfRklFTERfSURTLlZFUlNJT04gJiYgbGFuZ0dlbml1c1ZlcnNpb25JbmZvPy52ZXJzaW9uKSB7XG4gICAgICBzZXRaZW5kZXNrQ29udmVyc2F0aW9uRmllbGRzKFt7XG4gICAgICAgIGlkOiBaRU5ERVNLX0ZJRUxEX0lEUy5WRVJTSU9OLFxuICAgICAgICB2YWx1ZTogbGFuZ0dlbml1c1ZlcnNpb25JbmZvLnZlcnNpb24sXG4gICAgICB9XSlcbiAgICB9XG4gIH0sIFtsYW5nR2VuaXVzVmVyc2lvbkluZm8/LnZlcnNpb25dKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKFpFTkRFU0tfRklFTERfSURTLkVNQUlMICYmIHVzZXJQcm9maWxlPy5lbWFpbCkge1xuICAgICAgc2V0WmVuZGVza0NvbnZlcnNhdGlvbkZpZWxkcyhbe1xuICAgICAgICBpZDogWkVOREVTS19GSUVMRF9JRFMuRU1BSUwsXG4gICAgICAgIHZhbHVlOiB1c2VyUHJvZmlsZS5lbWFpbCxcbiAgICAgIH1dKVxuICAgIH1cbiAgfSwgW3VzZXJQcm9maWxlPy5lbWFpbF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoWkVOREVTS19GSUVMRF9JRFMuV09SS1NQQUNFX0lEICYmIGN1cnJlbnRXb3Jrc3BhY2U/LmlkKSB7XG4gICAgICBzZXRaZW5kZXNrQ29udmVyc2F0aW9uRmllbGRzKFt7XG4gICAgICAgIGlkOiBaRU5ERVNLX0ZJRUxEX0lEUy5XT1JLU1BBQ0VfSUQsXG4gICAgICAgIHZhbHVlOiBjdXJyZW50V29ya3NwYWNlLmlkLFxuICAgICAgfV0pXG4gICAgfVxuICB9LCBbY3VycmVudFdvcmtzcGFjZT8uaWRdKVxuICAvLyAjZW5kcmVnaW9uIFplbmRlc2sgY29udmVyc2F0aW9uIGZpZWxkc1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gUmVwb3J0IHVzZXIgYW5kIHdvcmtzcGFjZSBpbmZvIHRvIEFtcGxpdHVkZSB3aGVuIGxvYWRlZFxuICAgIGlmICh1c2VyUHJvZmlsZT8uaWQpIHtcbiAgICAgIHNldFVzZXJJZCh1c2VyUHJvZmlsZS5lbWFpbClcbiAgICAgIGNvbnN0IHByb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7XG4gICAgICAgIGVtYWlsOiB1c2VyUHJvZmlsZS5lbWFpbCxcbiAgICAgICAgbmFtZTogdXNlclByb2ZpbGUubmFtZSxcbiAgICAgICAgaGFzX3Bhc3N3b3JkOiB1c2VyUHJvZmlsZS5pc19wYXNzd29yZF9zZXQsXG4gICAgICB9XG5cbiAgICAgIGlmIChjdXJyZW50V29ya3NwYWNlPy5pZCkge1xuICAgICAgICBwcm9wZXJ0aWVzLndvcmtzcGFjZV9pZCA9IGN1cnJlbnRXb3Jrc3BhY2UuaWRcbiAgICAgICAgcHJvcGVydGllcy53b3Jrc3BhY2VfbmFtZSA9IGN1cnJlbnRXb3Jrc3BhY2UubmFtZVxuICAgICAgICBwcm9wZXJ0aWVzLndvcmtzcGFjZV9wbGFuID0gY3VycmVudFdvcmtzcGFjZS5wbGFuXG4gICAgICAgIHByb3BlcnRpZXMud29ya3NwYWNlX3N0YXR1cyA9IGN1cnJlbnRXb3Jrc3BhY2Uuc3RhdHVzXG4gICAgICAgIHByb3BlcnRpZXMud29ya3NwYWNlX3JvbGUgPSBjdXJyZW50V29ya3NwYWNlLnJvbGVcbiAgICAgIH1cblxuICAgICAgc2V0VXNlclByb3BlcnRpZXMocHJvcGVydGllcylcbiAgICB9XG4gIH0sIFt1c2VyUHJvZmlsZSwgY3VycmVudFdvcmtzcGFjZV0pXG5cbiAgcmV0dXJuIChcbiAgICA8QXBwQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17e1xuICAgICAgdXNlclByb2ZpbGUsXG4gICAgICBtdXRhdGVVc2VyUHJvZmlsZSxcbiAgICAgIGxhbmdHZW5pdXNWZXJzaW9uSW5mbyxcbiAgICAgIHVzZVNlbGVjdG9yLFxuICAgICAgY3VycmVudFdvcmtzcGFjZSxcbiAgICAgIGlzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXIsXG4gICAgICBpc0N1cnJlbnRXb3Jrc3BhY2VPd25lcixcbiAgICAgIGlzQ3VycmVudFdvcmtzcGFjZUVkaXRvcixcbiAgICAgIGlzQ3VycmVudFdvcmtzcGFjZURhdGFzZXRPcGVyYXRvcixcbiAgICAgIG11dGF0ZUN1cnJlbnRXb3Jrc3BhY2UsXG4gICAgICBpc0xvYWRpbmdDdXJyZW50V29ya3NwYWNlLFxuICAgICAgaXNWYWxpZGF0aW5nQ3VycmVudFdvcmtzcGFjZSxcbiAgICB9fVxuICAgID5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLWZ1bGwgZmxleC1jb2wgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgIHtnbG9iYWxUaGlzLmRvY3VtZW50Py5ib2R5Py5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHVibGljLW1haW50ZW5hbmNlLW5vdGljZScpICYmIDxNYWludGVuYW5jZU5vdGljZSAvPn1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4IGdyb3cgZmxleC1jb2wgb3ZlcmZsb3cteS1hdXRvIG92ZXJmbG93LXgtaGlkZGVuIGJnLWJhY2tncm91bmQtYm9keVwiPlxuICAgICAgICAgIHtjaGlsZHJlbn1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0FwcENvbnRleHQuUHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUFwcENvbnRleHQgPSAoKSA9PiB1c2VDb250ZXh0KEFwcENvbnRleHQpXG5cbmV4cG9ydCBkZWZhdWx0IEFwcENvbnRleHRcbiJdfQ==