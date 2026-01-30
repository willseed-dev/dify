"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const semver_1 = require("semver");
const button_1 = require("@/app/components/base/button");
const use_check_installed_1 = require("@/app/components/plugins/install-plugin/hooks/use-check-installed");
const app_context_1 = require("@/context/app-context");
const plugins_1 = require("@/service/plugins");
const use_plugins_1 = require("@/service/use-plugins");
const card_1 = require("../../../card");
const types_1 = require("../../../types");
const check_task_status_1 = require("../../base/check-task-status");
const version_1 = require("../../base/version");
const utils_1 = require("../../utils");
const i18nPrefix = 'installModal';
const Installed = ({ uniqueIdentifier, payload, onCancel, onStartToInstall, onInstalled, onFailed, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const toInstallVersion = payload.version;
    const pluginId = `${payload.author}/${payload.name}`;
    const { installedInfo, isLoading } = (0, use_check_installed_1.default)({
        pluginIds: [pluginId],
        enabled: !!pluginId,
    });
    const installedInfoPayload = installedInfo?.[pluginId];
    const installedVersion = installedInfoPayload?.installedVersion;
    const hasInstalled = !!installedVersion;
    (0, react_2.useEffect)(() => {
        if (hasInstalled && uniqueIdentifier === installedInfoPayload.uniqueIdentifier)
            onInstalled();
    }, [hasInstalled]);
    const [isInstalling, setIsInstalling] = React.useState(false);
    const { mutateAsync: installPackageFromLocal } = (0, use_plugins_1.useInstallPackageFromLocal)();
    const { check, stop, } = (0, check_task_status_1.default)();
    const handleCancel = () => {
        stop();
        onCancel();
    };
    const { handleRefetch } = (0, use_plugins_1.usePluginTaskList)(payload.category);
    const handleInstall = async () => {
        if (isInstalling)
            return;
        setIsInstalling(true);
        onStartToInstall?.();
        try {
            if (hasInstalled)
                await (0, plugins_1.uninstallPlugin)(installedInfoPayload.installedId);
            const { all_installed, task_id, } = await installPackageFromLocal(uniqueIdentifier);
            const taskId = task_id;
            const isInstalled = all_installed;
            if (isInstalled) {
                onInstalled();
                return;
            }
            handleRefetch();
            const { status, error } = await check({
                taskId,
                pluginUniqueIdentifier: uniqueIdentifier,
            });
            if (status === types_1.TaskStatus.failed) {
                onFailed(error);
                return;
            }
            onInstalled(true);
        }
        catch (e) {
            if (typeof e === 'string') {
                onFailed(e);
                return;
            }
            onFailed();
        }
    };
    const { langGeniusVersionInfo } = (0, app_context_1.useAppContext)();
    const isDifyVersionCompatible = (0, react_2.useMemo)(() => {
        if (!langGeniusVersionInfo.current_version)
            return true;
        return (0, semver_1.gte)(langGeniusVersionInfo.current_version, payload.meta.minimum_dify_version ?? '0.0.0');
    }, [langGeniusVersionInfo.current_version, payload.meta.minimum_dify_version]);
    return (<>
      <div className="flex flex-col items-start justify-center gap-4 self-stretch px-6 py-3">
        <div className="system-md-regular text-text-secondary">
          <p>{t(`${i18nPrefix}.readyToInstall`, { ns: 'plugin' })}</p>
          <p>
            <react_i18next_1.Trans i18nKey={`${i18nPrefix}.fromTrustSource`} ns="plugin" components={{ trustSource: <span className="system-md-semibold"/> }}/>
          </p>
          {!isDifyVersionCompatible && (<p className="system-md-regular flex items-center gap-1 text-text-warning">
              {t('difyVersionNotCompatible', { ns: 'plugin', minimalDifyVersion: payload.meta.minimum_dify_version })}
            </p>)}
        </div>
        <div className="flex flex-wrap content-start items-start gap-1 self-stretch rounded-2xl bg-background-section-burn p-2">
          <card_1.default className="w-full" payload={(0, utils_1.pluginManifestToCardPluginProps)(payload)} titleLeft={!isLoading && (<version_1.default hasInstalled={hasInstalled} installedVersion={installedVersion} toInstallVersion={toInstallVersion}/>)}/>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 self-stretch p-6 pt-5">
        {!isInstalling && (<button_1.default variant="secondary" className="min-w-[72px]" onClick={handleCancel}>
            {t('operation.cancel', { ns: 'common' })}
          </button_1.default>)}
        <button_1.default variant="primary" className="flex min-w-[72px] space-x-0.5" disabled={isInstalling || isLoading} onClick={handleInstall}>
          {isInstalling && <react_1.RiLoader2Line className="h-4 w-4 animate-spin-slow"/>}
          <span>{t(`${i18nPrefix}.${isInstalling ? 'installing' : 'install'}`, { ns: 'plugin' })}</span>
        </button_1.default>
      </div>
    </>);
};
exports.default = React.memo(Installed);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3RhbGwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBR1osNENBQWdEO0FBQ2hELCtCQUE4QjtBQUM5QixpQ0FBMEM7QUFDMUMsaURBQXFEO0FBQ3JELG1DQUE0QjtBQUM1Qix5REFBaUQ7QUFDakQsMkdBQWlHO0FBQ2pHLHVEQUFxRDtBQUNyRCwrQ0FBbUQ7QUFDbkQsdURBQXFGO0FBQ3JGLHdDQUFnQztBQUNoQywwQ0FBMkM7QUFDM0Msb0VBQTBEO0FBQzFELGdEQUF3QztBQUN4Qyx1Q0FBNkQ7QUFFN0QsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFBO0FBV2pDLE1BQU0sU0FBUyxHQUFjLENBQUMsRUFDNUIsZ0JBQWdCLEVBQ2hCLE9BQU8sRUFDUCxRQUFRLEVBQ1IsZ0JBQWdCLEVBQ2hCLFdBQVcsRUFDWCxRQUFRLEdBQ1QsRUFBRSxFQUFFO0lBQ0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQTtJQUN4QyxNQUFNLFFBQVEsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ3BELE1BQU0sRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSw2QkFBaUIsRUFBQztRQUNyRCxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDckIsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRO0tBQ3BCLENBQUMsQ0FBQTtJQUNGLE1BQU0sb0JBQW9CLEdBQUcsYUFBYSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDdEQsTUFBTSxnQkFBZ0IsR0FBRyxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQTtJQUMvRCxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUE7SUFFdkMsSUFB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QSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkRBQTJELENBQ3hFO1FBQUEsQ0FBQyxDQUFDLFlBQVksSUFBSSxDQUNoQixDQUFDLGdCQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUN6RTtZQUFBLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQzFDO1VBQUEsRUFBRSxnQkFBTSxDQUFDLENBQ1YsQ0FDRDtRQUFBLENBQUMsZ0JBQU0sQ0FDTCxPQUFPLENBQUMsU0FBUyxDQUNqQixTQUFTLENBQUMsK0JBQStCLENBQ3pDLFFBQVEsQ0FBQyxDQUFDLFlBQVksSUFBSSxTQUFTLENBQUMsQ0FDcEMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBRXZCO1VBQUEsQ0FBQyxZQUFZLElBQUksQ0FBQyxxQkFBYSxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsRUFBRyxDQUN4RTtVQUFBLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUMvRjtRQUFBLEVBQUUsZ0JBQU0sQ0FDVjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFBsdWdpbkRlY2xhcmF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBSaUxvYWRlcjJMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBUcmFucywgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgZ3RlIH0gZnJvbSAnc2VtdmVyJ1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuaW1wb3J0IHVzZUNoZWNrSW5zdGFsbGVkIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9pbnN0YWxsLXBsdWdpbi9ob29rcy91c2UtY2hlY2staW5zdGFsbGVkJ1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IHVuaW5zdGFsbFBsdWdpbiB9IGZyb20gJ0Avc2VydmljZS9wbHVnaW5zJ1xuaW1wb3J0IHsgdXNlSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwsIHVzZVBsdWdpblRhc2tMaXN0IH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJ1xuaW1wb3J0IENhcmQgZnJvbSAnLi4vLi4vLi4vY2FyZCdcbmltcG9ydCB7IFRhc2tTdGF0dXMgfSBmcm9tICcuLi8uLi8uLi90eXBlcydcbmltcG9ydCBjaGVja1Rhc2tTdGF0dXMgZnJvbSAnLi4vLi4vYmFzZS9jaGVjay10YXNrLXN0YXR1cydcbmltcG9ydCBWZXJzaW9uIGZyb20gJy4uLy4uL2Jhc2UvdmVyc2lvbidcbmltcG9ydCB7IHBsdWdpbk1hbmlmZXN0VG9DYXJkUGx1Z2luUHJvcHMgfSBmcm9tICcuLi8uLi91dGlscydcblxuY29uc3QgaTE4blByZWZpeCA9ICdpbnN0YWxsTW9kYWwnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIHVuaXF1ZUlkZW50aWZpZXI6IHN0cmluZ1xuICBwYXlsb2FkOiBQbHVnaW5EZWNsYXJhdGlvblxuICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICBvblN0YXJ0VG9JbnN0YWxsPzogKCkgPT4gdm9pZFxuICBvbkluc3RhbGxlZDogKG5vdFJlZnJlc2g/OiBib29sZWFuKSA9PiB2b2lkXG4gIG9uRmFpbGVkOiAobWVzc2FnZT86IHN0cmluZykgPT4gdm9pZFxufVxuXG5jb25zdCBJbnN0YWxsZWQ6IEZDPFByb3BzPiA9ICh7XG4gIHVuaXF1ZUlkZW50aWZpZXIsXG4gIHBheWxvYWQsXG4gIG9uQ2FuY2VsLFxuICBvblN0YXJ0VG9JbnN0YWxsLFxuICBvbkluc3RhbGxlZCxcbiAgb25GYWlsZWQsXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB0b0luc3RhbGxWZXJzaW9uID0gcGF5bG9hZC52ZXJzaW9uXG4gIGNvbnN0IHBsdWdpbklkID0gYCR7cGF5bG9hZC5hdXRob3J9LyR7cGF5bG9hZC5uYW1lfWBcbiAgY29uc3QgeyBpbnN0YWxsZWRJbmZvLCBpc0xvYWRpbmcgfSA9IHVzZUNoZWNrSW5zdGFsbGVkKHtcbiAgICBwbHVnaW5JZHM6IFtwbHVnaW5JZF0sXG4gICAgZW5hYmxlZDogISFwbHVnaW5JZCxcbiAgfSlcbiAgY29uc3QgaW5zdGFsbGVkSW5mb1BheWxvYWQgPSBpbnN0YWxsZWRJbmZvPy5bcGx1Z2luSWRdXG4gIGNvbnN0IGluc3RhbGxlZFZlcnNpb24gPSBpbnN0YWxsZWRJbmZvUGF5bG9hZD8uaW5zdGFsbGVkVmVyc2lvblxuICBjb25zdCBoYXNJbnN0YWxsZWQgPSAhIWluc3RhbGxlZFZlcnNpb25cblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChoYXNJbnN0YWxsZWQgJiYgdW5pcXVlSWRlbnRpZmllciA9PT0gaW5zdGFsbGVkSW5mb1BheWxvYWQudW5pcXVlSWRlbnRpZmllcilcbiAgICAgIG9uSW5zdGFsbGVkKClcbiAgfSwgW2hhc0luc3RhbGxlZF0pXG5cbiAgY29uc3QgW2lzSW5zdGFsbGluZywgc2V0SXNJbnN0YWxsaW5nXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBpbnN0YWxsUGFja2FnZUZyb21Mb2NhbCB9ID0gdXNlSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwoKVxuXG4gIGNvbnN0IHtcbiAgICBjaGVjayxcbiAgICBzdG9wLFxuICB9ID0gY2hlY2tUYXNrU3RhdHVzKClcblxuICBjb25zdCBoYW5kbGVDYW5jZWwgPSAoKSA9PiB7XG4gICAgc3RvcCgpXG4gICAgb25DYW5jZWwoKVxuICB9XG5cbiAgY29uc3QgeyBoYW5kbGVSZWZldGNoIH0gPSB1c2VQbHVnaW5UYXNrTGlzdChwYXlsb2FkLmNhdGVnb3J5KVxuICBjb25zdCBoYW5kbGVJbnN0YWxsID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmIChpc0luc3RhbGxpbmcpXG4gICAgICByZXR1cm5cbiAgICBzZXRJc0luc3RhbGxpbmcodHJ1ZSlcbiAgICBvblN0YXJ0VG9JbnN0YWxsPy4oKVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChoYXNJbnN0YWxsZWQpXG4gICAgICAgIGF3YWl0IHVuaW5zdGFsbFBsdWdpbihpbnN0YWxsZWRJbmZvUGF5bG9hZC5pbnN0YWxsZWRJZClcblxuICAgICAgY29uc3Qge1xuICAgICAgICBhbGxfaW5zdGFsbGVkLFxuICAgICAgICB0YXNrX2lkLFxuICAgICAgfSA9IGF3YWl0IGluc3RhbGxQYWNrYWdlRnJvbUxvY2FsKHVuaXF1ZUlkZW50aWZpZXIpXG4gICAgICBjb25zdCB0YXNrSWQgPSB0YXNrX2lkXG4gICAgICBjb25zdCBpc0luc3RhbGxlZCA9IGFsbF9pbnN0YWxsZWRcblxuICAgICAgaWYgKGlzSW5zdGFsbGVkKSB7XG4gICAgICAgIG9uSW5zdGFsbGVkKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBoYW5kbGVSZWZldGNoKClcbiAgICAgIGNvbnN0IHsgc3RhdHVzLCBlcnJvciB9ID0gYXdhaXQgY2hlY2soe1xuICAgICAgICB0YXNrSWQsXG4gICAgICAgIHBsdWdpblVuaXF1ZUlkZW50aWZpZXI6IHVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICB9KVxuICAgICAgaWYgKHN0YXR1cyA9PT0gVGFza1N0YXR1cy5mYWlsZWQpIHtcbiAgICAgICAgb25GYWlsZWQoZXJyb3IpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgb25JbnN0YWxsZWQodHJ1ZSlcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgIGlmICh0eXBlb2YgZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgb25GYWlsZWQoZSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBvbkZhaWxlZCgpXG4gICAgfVxuICB9XG5cbiAgY29uc3QgeyBsYW5nR2VuaXVzVmVyc2lvbkluZm8gfSA9IHVzZUFwcENvbnRleHQoKVxuICBjb25zdCBpc0RpZnlWZXJzaW9uQ29tcGF0aWJsZSA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghbGFuZ0dlbml1c1ZlcnNpb25JbmZvLmN1cnJlbnRfdmVyc2lvbilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGd0ZShsYW5nR2VuaXVzVmVyc2lvbkluZm8uY3VycmVudF92ZXJzaW9uLCBwYXlsb2FkLm1ldGEubWluaW11bV9kaWZ5X3ZlcnNpb24gPz8gJzAuMC4wJylcbiAgfSwgW2xhbmdHZW5pdXNWZXJzaW9uSW5mby5jdXJyZW50X3ZlcnNpb24sIHBheWxvYWQubWV0YS5taW5pbXVtX2RpZnlfdmVyc2lvbl0pXG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLXN0YXJ0IGp1c3RpZnktY2VudGVyIGdhcC00IHNlbGYtc3RyZXRjaCBweC02IHB5LTNcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgPHA+e3QoYCR7aTE4blByZWZpeH0ucmVhZHlUb0luc3RhbGxgLCB7IG5zOiAncGx1Z2luJyB9KX08L3A+XG4gICAgICAgICAgPHA+XG4gICAgICAgICAgICA8VHJhbnNcbiAgICAgICAgICAgICAgaTE4bktleT17YCR7aTE4blByZWZpeH0uZnJvbVRydXN0U291cmNlYH1cbiAgICAgICAgICAgICAgbnM9XCJwbHVnaW5cIlxuICAgICAgICAgICAgICBjb21wb25lbnRzPXt7IHRydXN0U291cmNlOiA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGRcIiAvPiB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3A+XG4gICAgICAgICAgeyFpc0RpZnlWZXJzaW9uQ29tcGF0aWJsZSAmJiAoXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtcmVndWxhciBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0ZXh0LXRleHQtd2FybmluZ1wiPlxuICAgICAgICAgICAgICB7dCgnZGlmeVZlcnNpb25Ob3RDb21wYXRpYmxlJywgeyBuczogJ3BsdWdpbicsIG1pbmltYWxEaWZ5VmVyc2lvbjogcGF5bG9hZC5tZXRhLm1pbmltdW1fZGlmeV92ZXJzaW9uIH0pfVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGNvbnRlbnQtc3RhcnQgaXRlbXMtc3RhcnQgZ2FwLTEgc2VsZi1zdHJldGNoIHJvdW5kZWQtMnhsIGJnLWJhY2tncm91bmQtc2VjdGlvbi1idXJuIHAtMlwiPlxuICAgICAgICAgIDxDYXJkXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGxcIlxuICAgICAgICAgICAgcGF5bG9hZD17cGx1Z2luTWFuaWZlc3RUb0NhcmRQbHVnaW5Qcm9wcyhwYXlsb2FkKX1cbiAgICAgICAgICAgIHRpdGxlTGVmdD17IWlzTG9hZGluZyAmJiAoXG4gICAgICAgICAgICAgIDxWZXJzaW9uXG4gICAgICAgICAgICAgICAgaGFzSW5zdGFsbGVkPXtoYXNJbnN0YWxsZWR9XG4gICAgICAgICAgICAgICAgaW5zdGFsbGVkVmVyc2lvbj17aW5zdGFsbGVkVmVyc2lvbn1cbiAgICAgICAgICAgICAgICB0b0luc3RhbGxWZXJzaW9uPXt0b0luc3RhbGxWZXJzaW9ufVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgey8qIEFjdGlvbiBCdXR0b25zICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWVuZCBnYXAtMiBzZWxmLXN0cmV0Y2ggcC02IHB0LTVcIj5cbiAgICAgICAgeyFpc0luc3RhbGxpbmcgJiYgKFxuICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInNlY29uZGFyeVwiIGNsYXNzTmFtZT1cIm1pbi13LVs3MnB4XVwiIG9uQ2xpY2s9e2hhbmRsZUNhbmNlbH0+XG4gICAgICAgICAgICB7dCgnb3BlcmF0aW9uLmNhbmNlbCcsIHsgbnM6ICdjb21tb24nIH0pfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICApfVxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggbWluLXctWzcycHhdIHNwYWNlLXgtMC41XCJcbiAgICAgICAgICBkaXNhYmxlZD17aXNJbnN0YWxsaW5nIHx8IGlzTG9hZGluZ31cbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVJbnN0YWxsfVxuICAgICAgICA+XG4gICAgICAgICAge2lzSW5zdGFsbGluZyAmJiA8UmlMb2FkZXIyTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IGFuaW1hdGUtc3Bpbi1zbG93XCIgLz59XG4gICAgICAgICAgPHNwYW4+e3QoYCR7aTE4blByZWZpeH0uJHtpc0luc3RhbGxpbmcgPyAnaW5zdGFsbGluZycgOiAnaW5zdGFsbCd9YCwgeyBuczogJ3BsdWdpbicgfSl9PC9zcGFuPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEluc3RhbGxlZClcbiJdfQ==