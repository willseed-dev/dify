"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCanInstallPluginFromMarketplace = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const app_context_1 = require("@/context/app-context");
const global_public_context_1 = require("@/context/global-public-context");
const use_plugins_1 = require("@/service/use-plugins");
const toast_1 = require("../../base/toast");
const types_1 = require("../types");
const hasPermission = (permission, isAdmin) => {
    if (!permission)
        return false;
    if (permission === types_1.PermissionType.noOne)
        return false;
    if (permission === types_1.PermissionType.everyone)
        return true;
    return isAdmin;
};
const useReferenceSetting = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { isCurrentWorkspaceManager, isCurrentWorkspaceOwner } = (0, app_context_1.useAppContext)();
    const { data } = (0, use_plugins_1.useReferenceSettings)();
    // console.log(data)
    const { permission: permissions } = data || {};
    const invalidateReferenceSettings = (0, use_plugins_1.useInvalidateReferenceSettings)();
    const { mutate: updateReferenceSetting, isPending: isUpdatePending } = (0, use_plugins_1.useMutationReferenceSettings)({
        onSuccess: () => {
            invalidateReferenceSettings();
            toast_1.default.notify({
                type: 'success',
                message: t('api.actionSuccess', { ns: 'common' }),
            });
        },
    });
    const isAdmin = isCurrentWorkspaceManager || isCurrentWorkspaceOwner;
    return {
        referenceSetting: data,
        setReferenceSettings: updateReferenceSetting,
        canManagement: hasPermission(permissions?.install_permission, isAdmin),
        canDebugger: hasPermission(permissions?.debug_permission, isAdmin),
        canSetPermissions: isAdmin,
        isUpdatePending,
    };
};
const useCanInstallPluginFromMarketplace = () => {
    const { enable_marketplace } = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const { canManagement } = useReferenceSetting();
    const canInstallPluginFromMarketplace = (0, react_1.useMemo)(() => {
        return enable_marketplace && canManagement;
    }, [enable_marketplace, canManagement]);
    return {
        canInstallPluginFromMarketplace,
    };
};
exports.useCanInstallPluginFromMarketplace = useCanInstallPluginFromMarketplace;
exports.default = useReferenceSetting;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXJlZmVyZW5jZS1zZXR0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXJlZmVyZW5jZS1zZXR0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUErQjtBQUMvQixpREFBOEM7QUFDOUMsdURBQXFEO0FBQ3JELDJFQUFzRTtBQUN0RSx1REFBMEg7QUFDMUgsNENBQW9DO0FBQ3BDLG9DQUF5QztBQUV6QyxNQUFNLGFBQWEsR0FBRyxDQUFDLFVBQXNDLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO0lBQ2pGLElBQUksQ0FBQyxVQUFVO1FBQ2IsT0FBTyxLQUFLLENBQUE7SUFFZCxJQUFJLFVBQVUsS0FBSyxzQkFBYyxDQUFDLEtBQUs7UUFDckMsT0FBTyxLQUFLLENBQUE7SUFFZCxJQUFJLFVBQVUsS0FBSyxzQkFBYyxDQUFDLFFBQVE7UUFDeEMsT0FBTyxJQUFJLENBQUE7SUFFYixPQUFPLE9BQU8sQ0FBQTtBQUNoQixDQUFDLENBQUE7QUFFRCxNQUFNLG1CQUFtQixHQUFHLEdBQUcsRUFBRTtJQUMvQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLHlCQUF5QixFQUFFLHVCQUF1QixFQUFFLEdBQUcsSUFBQSwyQkFBYSxHQUFFLENBQUE7SUFDOUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUEsa0NBQW9CLEdBQUUsQ0FBQTtJQUN2QyxvQkFBb0I7SUFDcEIsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0lBQzlDLE1BQU0sMkJBQTJCLEdBQUcsSUFBQSw0Q0FBOEIsR0FBRSxDQUFBO0lBQ3BFLE1BQU0sRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxHQUFHLElBQUEsMENBQTRCLEVBQUM7UUFDbEcsU0FBUyxFQUFFLEdBQUcsRUFBRTtZQUNkLDJCQUEyQixFQUFFLENBQUE7WUFDN0IsZUFBSyxDQUFDLE1BQU0sQ0FBQztnQkFDWCxJQUFJLEVBQUUsU0FBUztnQkFDZixPQUFPLEVBQUUsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDO2FBQ2xELENBQUMsQ0FBQTtRQUNKLENBQUM7S0FDRixDQUFDLENBQUE7SUFDRixNQUFNLE9BQU8sR0FBRyx5QkFBeUIsSUFBSSx1QkFBdUIsQ0FBQTtJQUVwRSxPQUFPO1FBQ0wsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixvQkFBb0IsRUFBRSxzQkFBc0I7UUFDNUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLEVBQUUsT0FBTyxDQUFDO1FBQ3RFLFdBQVcsRUFBRSxhQUFhLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQztRQUNsRSxpQkFBaUIsRUFBRSxPQUFPO1FBQzFCLGVBQWU7S0FDaEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVNLE1BQU0sa0NBQWtDLEdBQUcsR0FBRyxFQUFFO0lBQ3JELE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUFHLElBQUEsNENBQW9CLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDMUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLG1CQUFtQixFQUFFLENBQUE7SUFFL0MsTUFBTSwrQkFBK0IsR0FBRyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDbkQsT0FBTyxrQkFBa0IsSUFBSSxhQUFhLENBQUE7SUFDNUMsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUV2QyxPQUFPO1FBQ0wsK0JBQStCO0tBQ2hDLENBQUE7QUFDSCxDQUFDLENBQUE7QUFYWSxRQUFBLGtDQUFrQyxzQ0FXOUM7QUFFRCxrQkFBZSxtQkFBbUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZUFwcENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvYXBwLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VHbG9iYWxQdWJsaWNTdG9yZSB9IGZyb20gJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VJbnZhbGlkYXRlUmVmZXJlbmNlU2V0dGluZ3MsIHVzZU11dGF0aW9uUmVmZXJlbmNlU2V0dGluZ3MsIHVzZVJlZmVyZW5jZVNldHRpbmdzIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJ1xuaW1wb3J0IFRvYXN0IGZyb20gJy4uLy4uL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBQZXJtaXNzaW9uVHlwZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jb25zdCBoYXNQZXJtaXNzaW9uID0gKHBlcm1pc3Npb246IFBlcm1pc3Npb25UeXBlIHwgdW5kZWZpbmVkLCBpc0FkbWluOiBib29sZWFuKSA9PiB7XG4gIGlmICghcGVybWlzc2lvbilcbiAgICByZXR1cm4gZmFsc2VcblxuICBpZiAocGVybWlzc2lvbiA9PT0gUGVybWlzc2lvblR5cGUubm9PbmUpXG4gICAgcmV0dXJuIGZhbHNlXG5cbiAgaWYgKHBlcm1pc3Npb24gPT09IFBlcm1pc3Npb25UeXBlLmV2ZXJ5b25lKVxuICAgIHJldHVybiB0cnVlXG5cbiAgcmV0dXJuIGlzQWRtaW5cbn1cblxuY29uc3QgdXNlUmVmZXJlbmNlU2V0dGluZyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlciwgaXNDdXJyZW50V29ya3NwYWNlT3duZXIgfSA9IHVzZUFwcENvbnRleHQoKVxuICBjb25zdCB7IGRhdGEgfSA9IHVzZVJlZmVyZW5jZVNldHRpbmdzKClcbiAgLy8gY29uc29sZS5sb2coZGF0YSlcbiAgY29uc3QgeyBwZXJtaXNzaW9uOiBwZXJtaXNzaW9ucyB9ID0gZGF0YSB8fCB7fVxuICBjb25zdCBpbnZhbGlkYXRlUmVmZXJlbmNlU2V0dGluZ3MgPSB1c2VJbnZhbGlkYXRlUmVmZXJlbmNlU2V0dGluZ3MoKVxuICBjb25zdCB7IG11dGF0ZTogdXBkYXRlUmVmZXJlbmNlU2V0dGluZywgaXNQZW5kaW5nOiBpc1VwZGF0ZVBlbmRpbmcgfSA9IHVzZU11dGF0aW9uUmVmZXJlbmNlU2V0dGluZ3Moe1xuICAgIG9uU3VjY2VzczogKCkgPT4ge1xuICAgICAgaW52YWxpZGF0ZVJlZmVyZW5jZVNldHRpbmdzKClcbiAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogdCgnYXBpLmFjdGlvblN1Y2Nlc3MnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgIH0pXG4gICAgfSxcbiAgfSlcbiAgY29uc3QgaXNBZG1pbiA9IGlzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXIgfHwgaXNDdXJyZW50V29ya3NwYWNlT3duZXJcblxuICByZXR1cm4ge1xuICAgIHJlZmVyZW5jZVNldHRpbmc6IGRhdGEsXG4gICAgc2V0UmVmZXJlbmNlU2V0dGluZ3M6IHVwZGF0ZVJlZmVyZW5jZVNldHRpbmcsXG4gICAgY2FuTWFuYWdlbWVudDogaGFzUGVybWlzc2lvbihwZXJtaXNzaW9ucz8uaW5zdGFsbF9wZXJtaXNzaW9uLCBpc0FkbWluKSxcbiAgICBjYW5EZWJ1Z2dlcjogaGFzUGVybWlzc2lvbihwZXJtaXNzaW9ucz8uZGVidWdfcGVybWlzc2lvbiwgaXNBZG1pbiksXG4gICAgY2FuU2V0UGVybWlzc2lvbnM6IGlzQWRtaW4sXG4gICAgaXNVcGRhdGVQZW5kaW5nLFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VDYW5JbnN0YWxsUGx1Z2luRnJvbU1hcmtldHBsYWNlID0gKCkgPT4ge1xuICBjb25zdCB7IGVuYWJsZV9tYXJrZXRwbGFjZSB9ID0gdXNlR2xvYmFsUHVibGljU3RvcmUocyA9PiBzLnN5c3RlbUZlYXR1cmVzKVxuICBjb25zdCB7IGNhbk1hbmFnZW1lbnQgfSA9IHVzZVJlZmVyZW5jZVNldHRpbmcoKVxuXG4gIGNvbnN0IGNhbkluc3RhbGxQbHVnaW5Gcm9tTWFya2V0cGxhY2UgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gZW5hYmxlX21hcmtldHBsYWNlICYmIGNhbk1hbmFnZW1lbnRcbiAgfSwgW2VuYWJsZV9tYXJrZXRwbGFjZSwgY2FuTWFuYWdlbWVudF0pXG5cbiAgcmV0dXJuIHtcbiAgICBjYW5JbnN0YWxsUGx1Z2luRnJvbU1hcmtldHBsYWNlLFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVJlZmVyZW5jZVNldHRpbmdcbiJdfQ==