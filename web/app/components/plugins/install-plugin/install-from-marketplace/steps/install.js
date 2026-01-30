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
const use_plugins_1 = require("@/service/use-plugins");
const card_1 = require("../../../card");
// import { RiInformation2Line } from '@remixicon/react'
const types_1 = require("../../../types");
const check_task_status_1 = require("../../base/check-task-status");
const version_1 = require("../../base/version");
const use_install_plugin_limit_1 = require("../../hooks/use-install-plugin-limit");
const utils_1 = require("../../utils");
const i18nPrefix = 'installModal';
const Installed = ({ uniqueIdentifier, payload, onCancel, onStartToInstall, onInstalled, onFailed, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const toInstallVersion = payload.version || payload.latest_version;
    const pluginId = payload.plugin_id;
    const { installedInfo, isLoading } = (0, use_check_installed_1.default)({
        pluginIds: [pluginId],
        enabled: !!pluginId,
    });
    const installedInfoPayload = installedInfo?.[pluginId];
    const installedVersion = installedInfoPayload?.installedVersion;
    const hasInstalled = !!installedVersion;
    const { mutateAsync: installPackageFromMarketPlace } = (0, use_plugins_1.useInstallPackageFromMarketPlace)();
    const { mutateAsync: updatePackageFromMarketPlace } = (0, use_plugins_1.useUpdatePackageFromMarketPlace)();
    const [isInstalling, setIsInstalling] = React.useState(false);
    const { check, stop, } = (0, check_task_status_1.default)();
    const { handleRefetch } = (0, use_plugins_1.usePluginTaskList)(payload.category);
    (0, react_2.useEffect)(() => {
        if (hasInstalled && uniqueIdentifier === installedInfoPayload.uniqueIdentifier)
            onInstalled();
    }, [hasInstalled]);
    const handleCancel = () => {
        stop();
        onCancel();
    };
    const handleInstall = async () => {
        if (isInstalling)
            return;
        onStartToInstall?.();
        setIsInstalling(true);
        try {
            let taskId;
            let isInstalled;
            if (hasInstalled) {
                const { all_installed, task_id, } = await updatePackageFromMarketPlace({
                    original_plugin_unique_identifier: installedInfoPayload.uniqueIdentifier,
                    new_plugin_unique_identifier: uniqueIdentifier,
                });
                taskId = task_id;
                isInstalled = all_installed;
            }
            else {
                const { all_installed, task_id, } = await installPackageFromMarketPlace(uniqueIdentifier);
                taskId = task_id;
                isInstalled = all_installed;
            }
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
    const { data: pluginDeclaration } = (0, use_plugins_1.usePluginDeclarationFromMarketPlace)(uniqueIdentifier);
    const isDifyVersionCompatible = (0, react_2.useMemo)(() => {
        if (!pluginDeclaration || !langGeniusVersionInfo.current_version)
            return true;
        return (0, semver_1.gte)(langGeniusVersionInfo.current_version, pluginDeclaration?.manifest.meta.minimum_dify_version ?? '0.0.0');
    }, [langGeniusVersionInfo.current_version, pluginDeclaration]);
    const { canInstall } = (0, use_install_plugin_limit_1.default)({ ...payload, from: 'marketplace' });
    return (<>
      <div className="flex flex-col items-start justify-center gap-4 self-stretch px-6 py-3">
        <div className="system-md-regular text-text-secondary">
          <p>{t(`${i18nPrefix}.readyToInstall`, { ns: 'plugin' })}</p>
          {!isDifyVersionCompatible && (<p className="system-md-regular text-text-warning">
              {t('difyVersionNotCompatible', { ns: 'plugin', minimalDifyVersion: pluginDeclaration?.manifest.meta.minimum_dify_version })}
            </p>)}
        </div>
        <div className="flex flex-wrap content-start items-start gap-1 self-stretch rounded-2xl bg-background-section-burn p-2">
          <card_1.default className="w-full" payload={(0, utils_1.pluginManifestInMarketToPluginProps)(payload)} titleLeft={!isLoading && (<version_1.default hasInstalled={hasInstalled} installedVersion={installedVersion} toInstallVersion={toInstallVersion}/>)} limitedInstall={!canInstall}/>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 self-stretch p-6 pt-5">
        {!isInstalling && (<button_1.default variant="secondary" className="min-w-[72px]" onClick={handleCancel}>
            {t('operation.cancel', { ns: 'common' })}
          </button_1.default>)}
        <button_1.default variant="primary" className="flex min-w-[72px] space-x-0.5" disabled={isInstalling || isLoading || !canInstall} onClick={handleInstall}>
          {isInstalling && <react_1.RiLoader2Line className="h-4 w-4 animate-spin-slow"/>}
          <span>{t(`${i18nPrefix}.${isInstalling ? 'installing' : 'install'}`, { ns: 'plugin' })}</span>
        </button_1.default>
      </div>
    </>);
};
exports.default = React.memo(Installed);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3RhbGwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7O0FBR1osNENBQWdEO0FBQ2hELCtCQUE4QjtBQUM5QixpQ0FBMEM7QUFDMUMsaURBQThDO0FBQzlDLG1DQUE0QjtBQUM1Qix5REFBaUQ7QUFDakQsMkdBQWlHO0FBQ2pHLHVEQUFxRDtBQUNyRCx1REFBaUs7QUFDakssd0NBQWdDO0FBQ2hDLHdEQUF3RDtBQUN4RCwwQ0FBMkM7QUFDM0Msb0VBQTBEO0FBQzFELGdEQUF3QztBQUN4QyxtRkFBd0U7QUFDeEUsdUNBQWlFO0FBRWpFLE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQTtBQVdqQyxNQUFNLFNBQVMsR0FBYyxDQUFDLEVBQzVCLGdCQUFnQixFQUNoQixPQUFPLEVBQ1AsUUFBUSxFQUNSLGdCQUFnQixFQUNoQixXQUFXLEVBQ1gsUUFBUSxHQUNULEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQTtJQUNsRSxNQUFNLFFBQVEsR0FBSSxPQUFrQixDQUFDLFNBQVMsQ0FBQTtJQUM5QyxNQUFNLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsNkJBQWlCLEVBQUM7UUFDckQsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBQ3JCLE9BQU8sRUFBRSxDQUFDLENBQUMsUUFBUTtLQUNwQixDQUFDLENBQUE7SUFDRixNQUFNLG9CQUFvQixHQUFHLGFBQWEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3RELE1BQU0sZ0JBQWdCLEdBQUcsb0JBQW9CLEVBQUUsZ0JBQWdCLENBQUE7SUFDL0QsTUFBTSxZQUFZLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFBO0lBRXZD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LFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQy9GO1FBQUEsRUFBRSxnQkFBTSxDQUNWO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxHQUFHLENBQ0osQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUNELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgUGx1Z2luLCBQbHVnaW5NYW5pZmVzdEluTWFya2V0IH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBSaUxvYWRlcjJMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBndGUgfSBmcm9tICdzZW12ZXInXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgdXNlQ2hlY2tJbnN0YWxsZWQgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL2luc3RhbGwtcGx1Z2luL2hvb2tzL3VzZS1jaGVjay1pbnN0YWxsZWQnXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgdXNlSW5zdGFsbFBhY2thZ2VGcm9tTWFya2V0UGxhY2UsIHVzZVBsdWdpbkRlY2xhcmF0aW9uRnJvbU1hcmtldFBsYWNlLCB1c2VQbHVnaW5UYXNrTGlzdCwgdXNlVXBkYXRlUGFja2FnZUZyb21NYXJrZXRQbGFjZSB9IGZyb20gJ0Avc2VydmljZS91c2UtcGx1Z2lucydcbmltcG9ydCBDYXJkIGZyb20gJy4uLy4uLy4uL2NhcmQnXG4vLyBpbXBvcnQgeyBSaUluZm9ybWF0aW9uMkxpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgVGFza1N0YXR1cyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IGNoZWNrVGFza1N0YXR1cyBmcm9tICcuLi8uLi9iYXNlL2NoZWNrLXRhc2stc3RhdHVzJ1xuaW1wb3J0IFZlcnNpb24gZnJvbSAnLi4vLi4vYmFzZS92ZXJzaW9uJ1xuaW1wb3J0IHVzZUluc3RhbGxQbHVnaW5MaW1pdCBmcm9tICcuLi8uLi9ob29rcy91c2UtaW5zdGFsbC1wbHVnaW4tbGltaXQnXG5pbXBvcnQgeyBwbHVnaW5NYW5pZmVzdEluTWFya2V0VG9QbHVnaW5Qcm9wcyB9IGZyb20gJy4uLy4uL3V0aWxzJ1xuXG5jb25zdCBpMThuUHJlZml4ID0gJ2luc3RhbGxNb2RhbCdcblxudHlwZSBQcm9wcyA9IHtcbiAgdW5pcXVlSWRlbnRpZmllcjogc3RyaW5nXG4gIHBheWxvYWQ6IFBsdWdpbk1hbmlmZXN0SW5NYXJrZXQgfCBQbHVnaW5cbiAgb25DYW5jZWw6ICgpID0+IHZvaWRcbiAgb25TdGFydFRvSW5zdGFsbD86ICgpID0+IHZvaWRcbiAgb25JbnN0YWxsZWQ6IChub3RSZWZyZXNoPzogYm9vbGVhbikgPT4gdm9pZFxuICBvbkZhaWxlZDogKG1lc3NhZ2U/OiBzdHJpbmcpID0+IHZvaWRcbn1cblxuY29uc3QgSW5zdGFsbGVkOiBGQzxQcm9wcz4gPSAoe1xuICB1bmlxdWVJZGVudGlmaWVyLFxuICBwYXlsb2FkLFxuICBvbkNhbmNlbCxcbiAgb25TdGFydFRvSW5zdGFsbCxcbiAgb25JbnN0YWxsZWQsXG4gIG9uRmFpbGVkLFxufSkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgdG9JbnN0YWxsVmVyc2lvbiA9IHBheWxvYWQudmVyc2lvbiB8fCBwYXlsb2FkLmxhdGVzdF92ZXJzaW9uXG4gIGNvbnN0IHBsdWdpbklkID0gKHBheWxvYWQgYXMgUGx1Z2luKS5wbHVnaW5faWRcbiAgY29uc3QgeyBpbnN0YWxsZWRJbmZvLCBpc0xvYWRpbmcgfSA9IHVzZUNoZWNrSW5zdGFsbGVkKHtcbiAgICBwbHVnaW5JZHM6IFtwbHVnaW5JZF0sXG4gICAgZW5hYmxlZDogISFwbHVnaW5JZCxcbiAgfSlcbiAgY29uc3QgaW5zdGFsbGVkSW5mb1BheWxvYWQgPSBpbnN0YWxsZWRJbmZvPy5bcGx1Z2luSWRdXG4gIGNvbnN0IGluc3RhbGxlZFZlcnNpb24gPSBpbnN0YWxsZWRJbmZvUGF5bG9hZD8uaW5zdGFsbGVkVmVyc2lvblxuICBjb25zdCBoYXNJbnN0YWxsZWQgPSAhIWluc3RhbGxlZFZlcnNpb25cblxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiBpbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZSB9ID0gdXNlSW5zdGFsbFBhY2thZ2VGcm9tTWFya2V0UGxhY2UoKVxuICBjb25zdCB7IG11dGF0ZUFzeW5jOiB1cGRhdGVQYWNrYWdlRnJvbU1hcmtldFBsYWNlIH0gPSB1c2VVcGRhdGVQYWNrYWdlRnJvbU1hcmtldFBsYWNlKClcbiAgY29uc3QgW2lzSW5zdGFsbGluZywgc2V0SXNJbnN0YWxsaW5nXSA9IFJlYWN0LnVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCB7XG4gICAgY2hlY2ssXG4gICAgc3RvcCxcbiAgfSA9IGNoZWNrVGFza1N0YXR1cygpXG4gIGNvbnN0IHsgaGFuZGxlUmVmZXRjaCB9ID0gdXNlUGx1Z2luVGFza0xpc3QocGF5bG9hZC5jYXRlZ29yeSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChoYXNJbnN0YWxsZWQgJiYgdW5pcXVlSWRlbnRpZmllciA9PT0gaW5zdGFsbGVkSW5mb1BheWxvYWQudW5pcXVlSWRlbnRpZmllcilcbiAgICAgIG9uSW5zdGFsbGVkKClcbiAgfSwgW2hhc0luc3RhbGxlZF0pXG5cbiAgY29uc3QgaGFuZGxlQ2FuY2VsID0gKCkgPT4ge1xuICAgIHN0b3AoKVxuICAgIG9uQ2FuY2VsKClcbiAgfVxuXG4gIGNvbnN0IGhhbmRsZUluc3RhbGwgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGlzSW5zdGFsbGluZylcbiAgICAgIHJldHVyblxuICAgIG9uU3RhcnRUb0luc3RhbGw/LigpXG4gICAgc2V0SXNJbnN0YWxsaW5nKHRydWUpXG4gICAgdHJ5IHtcbiAgICAgIGxldCB0YXNrSWRcbiAgICAgIGxldCBpc0luc3RhbGxlZFxuICAgICAgaWYgKGhhc0luc3RhbGxlZCkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgYWxsX2luc3RhbGxlZCxcbiAgICAgICAgICB0YXNrX2lkLFxuICAgICAgICB9ID0gYXdhaXQgdXBkYXRlUGFja2FnZUZyb21NYXJrZXRQbGFjZSh7XG4gICAgICAgICAgb3JpZ2luYWxfcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiBpbnN0YWxsZWRJbmZvUGF5bG9hZC51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgIG5ld19wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6IHVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgIH0pXG4gICAgICAgIHRhc2tJZCA9IHRhc2tfaWRcbiAgICAgICAgaXNJbnN0YWxsZWQgPSBhbGxfaW5zdGFsbGVkXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgIGFsbF9pbnN0YWxsZWQsXG4gICAgICAgICAgdGFza19pZCxcbiAgICAgICAgfSA9IGF3YWl0IGluc3RhbGxQYWNrYWdlRnJvbU1hcmtldFBsYWNlKHVuaXF1ZUlkZW50aWZpZXIpXG4gICAgICAgIHRhc2tJZCA9IHRhc2tfaWRcbiAgICAgICAgaXNJbnN0YWxsZWQgPSBhbGxfaW5zdGFsbGVkXG4gICAgICB9XG5cbiAgICAgIGlmIChpc0luc3RhbGxlZCkge1xuICAgICAgICBvbkluc3RhbGxlZCgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBoYW5kbGVSZWZldGNoKClcblxuICAgICAgY29uc3QgeyBzdGF0dXMsIGVycm9yIH0gPSBhd2FpdCBjaGVjayh7XG4gICAgICAgIHRhc2tJZCxcbiAgICAgICAgcGx1Z2luVW5pcXVlSWRlbnRpZmllcjogdW5pcXVlSWRlbnRpZmllcixcbiAgICAgIH0pXG4gICAgICBpZiAoc3RhdHVzID09PSBUYXNrU3RhdHVzLmZhaWxlZCkge1xuICAgICAgICBvbkZhaWxlZChlcnJvcilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBvbkluc3RhbGxlZCh0cnVlKVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgaWYgKHR5cGVvZiBlID09PSAnc3RyaW5nJykge1xuICAgICAgICBvbkZhaWxlZChlKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIG9uRmFpbGVkKClcbiAgICB9XG4gIH1cblxuICBjb25zdCB7IGxhbmdHZW5pdXNWZXJzaW9uSW5mbyB9ID0gdXNlQXBwQ29udGV4dCgpXG4gIGNvbnN0IHsgZGF0YTogcGx1Z2luRGVjbGFyYXRpb24gfSA9IHVzZVBsdWdpbkRlY2xhcmF0aW9uRnJvbU1hcmtldFBsYWNlKHVuaXF1ZUlkZW50aWZpZXIpXG4gIGNvbnN0IGlzRGlmeVZlcnNpb25Db21wYXRpYmxlID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFwbHVnaW5EZWNsYXJhdGlvbiB8fCAhbGFuZ0dlbml1c1ZlcnNpb25JbmZvLmN1cnJlbnRfdmVyc2lvbilcbiAgICAgIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGd0ZShsYW5nR2VuaXVzVmVyc2lvbkluZm8uY3VycmVudF92ZXJzaW9uLCBwbHVnaW5EZWNsYXJhdGlvbj8ubWFuaWZlc3QubWV0YS5taW5pbXVtX2RpZnlfdmVyc2lvbiA/PyAnMC4wLjAnKVxuICB9LCBbbGFuZ0dlbml1c1ZlcnNpb25JbmZvLmN1cnJlbnRfdmVyc2lvbiwgcGx1Z2luRGVjbGFyYXRpb25dKVxuXG4gIGNvbnN0IHsgY2FuSW5zdGFsbCB9ID0gdXNlSW5zdGFsbFBsdWdpbkxpbWl0KHsgLi4ucGF5bG9hZCwgZnJvbTogJ21hcmtldHBsYWNlJyB9KVxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtc3RhcnQganVzdGlmeS1jZW50ZXIgZ2FwLTQgc2VsZi1zdHJldGNoIHB4LTYgcHktM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1tZC1yZWd1bGFyIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICA8cD57dChgJHtpMThuUHJlZml4fS5yZWFkeVRvSW5zdGFsbGAsIHsgbnM6ICdwbHVnaW4nIH0pfTwvcD5cbiAgICAgICAgICB7IWlzRGlmeVZlcnNpb25Db21wYXRpYmxlICYmIChcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInN5c3RlbS1tZC1yZWd1bGFyIHRleHQtdGV4dC13YXJuaW5nXCI+XG4gICAgICAgICAgICAgIHt0KCdkaWZ5VmVyc2lvbk5vdENvbXBhdGlibGUnLCB7IG5zOiAncGx1Z2luJywgbWluaW1hbERpZnlWZXJzaW9uOiBwbHVnaW5EZWNsYXJhdGlvbj8ubWFuaWZlc3QubWV0YS5taW5pbXVtX2RpZnlfdmVyc2lvbiB9KX1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBjb250ZW50LXN0YXJ0IGl0ZW1zLXN0YXJ0IGdhcC0xIHNlbGYtc3RyZXRjaCByb3VuZGVkLTJ4bCBiZy1iYWNrZ3JvdW5kLXNlY3Rpb24tYnVybiBwLTJcIj5cbiAgICAgICAgICA8Q2FyZFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsXCJcbiAgICAgICAgICAgIHBheWxvYWQ9e3BsdWdpbk1hbmlmZXN0SW5NYXJrZXRUb1BsdWdpblByb3BzKHBheWxvYWQgYXMgUGx1Z2luTWFuaWZlc3RJbk1hcmtldCl9XG4gICAgICAgICAgICB0aXRsZUxlZnQ9eyFpc0xvYWRpbmcgJiYgKFxuICAgICAgICAgICAgICA8VmVyc2lvblxuICAgICAgICAgICAgICAgIGhhc0luc3RhbGxlZD17aGFzSW5zdGFsbGVkfVxuICAgICAgICAgICAgICAgIGluc3RhbGxlZFZlcnNpb249e2luc3RhbGxlZFZlcnNpb259XG4gICAgICAgICAgICAgICAgdG9JbnN0YWxsVmVyc2lvbj17dG9JbnN0YWxsVmVyc2lvbn1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICBsaW1pdGVkSW5zdGFsbD17IWNhbkluc3RhbGx9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiBBY3Rpb24gQnV0dG9ucyAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1lbmQgZ2FwLTIgc2VsZi1zdHJldGNoIHAtNiBwdC01XCI+XG4gICAgICAgIHshaXNJbnN0YWxsaW5nICYmIChcbiAgICAgICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIiBjbGFzc05hbWU9XCJtaW4tdy1bNzJweF1cIiBvbkNsaWNrPXtoYW5kbGVDYW5jZWx9PlxuICAgICAgICAgICAge3QoJ29wZXJhdGlvbi5jYW5jZWwnLCB7IG5zOiAnY29tbW9uJyB9KX1cbiAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgKX1cbiAgICAgICAgPEJ1dHRvblxuICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcbiAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IG1pbi13LVs3MnB4XSBzcGFjZS14LTAuNVwiXG4gICAgICAgICAgZGlzYWJsZWQ9e2lzSW5zdGFsbGluZyB8fCBpc0xvYWRpbmcgfHwgIWNhbkluc3RhbGx9XG4gICAgICAgICAgb25DbGljaz17aGFuZGxlSW5zdGFsbH1cbiAgICAgICAgPlxuICAgICAgICAgIHtpc0luc3RhbGxpbmcgJiYgPFJpTG9hZGVyMkxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCBhbmltYXRlLXNwaW4tc2xvd1wiIC8+fVxuICAgICAgICAgIDxzcGFuPnt0KGAke2kxOG5QcmVmaXh9LiR7aXNJbnN0YWxsaW5nID8gJ2luc3RhbGxpbmcnIDogJ2luc3RhbGwnfWAsIHsgbnM6ICdwbHVnaW4nIH0pfTwvc3Bhbj5cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8Lz5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhJbnN0YWxsZWQpXG4iXX0=