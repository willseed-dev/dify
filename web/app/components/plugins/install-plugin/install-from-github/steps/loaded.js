"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const use_check_installed_1 = require("@/app/components/plugins/install-plugin/hooks/use-check-installed");
const plugins_1 = require("@/service/plugins");
const use_plugins_1 = require("@/service/use-plugins");
const card_1 = require("../../../card");
const types_1 = require("../../../types");
const check_task_status_1 = require("../../base/check-task-status");
const version_1 = require("../../base/version");
const utils_1 = require("../../utils");
const i18nPrefix = 'installModal';
const Loaded = ({ updatePayload, uniqueIdentifier, payload, repoUrl, selectedVersion, selectedPackage, onBack, onStartToInstall, onInstalled, onFailed, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const toInstallVersion = payload.version;
    const pluginId = payload.plugin_id;
    const { installedInfo, isLoading } = (0, use_check_installed_1.default)({
        pluginIds: [pluginId],
        enabled: !!pluginId,
    });
    const installedInfoPayload = installedInfo?.[pluginId];
    const installedVersion = installedInfoPayload?.installedVersion;
    const hasInstalled = !!installedVersion;
    const [isInstalling, setIsInstalling] = React.useState(false);
    const { mutateAsync: installPackageFromGitHub } = (0, use_plugins_1.useInstallPackageFromGitHub)();
    const { handleRefetch } = (0, use_plugins_1.usePluginTaskList)(payload.category);
    const { check } = (0, check_task_status_1.default)();
    (0, react_2.useEffect)(() => {
        if (hasInstalled && uniqueIdentifier === installedInfoPayload.uniqueIdentifier)
            onInstalled();
    }, [hasInstalled]);
    const handleInstall = async () => {
        if (isInstalling)
            return;
        setIsInstalling(true);
        onStartToInstall?.();
        try {
            const { owner, repo } = (0, utils_1.parseGitHubUrl)(repoUrl);
            let taskId;
            let isInstalled;
            if (updatePayload) {
                const { all_installed, task_id } = await (0, plugins_1.updateFromGitHub)(`${owner}/${repo}`, selectedVersion, selectedPackage, updatePayload.originalPackageInfo.id, uniqueIdentifier);
                taskId = task_id;
                isInstalled = all_installed;
            }
            else {
                if (hasInstalled) {
                    const { all_installed, task_id, } = await (0, plugins_1.updateFromGitHub)(`${owner}/${repo}`, selectedVersion, selectedPackage, installedInfoPayload.uniqueIdentifier, uniqueIdentifier);
                    taskId = task_id;
                    isInstalled = all_installed;
                }
                else {
                    const { all_installed, task_id } = await installPackageFromGitHub({
                        repoUrl: `${owner}/${repo}`,
                        selectedVersion,
                        selectedPackage,
                        uniqueIdentifier,
                    });
                    taskId = task_id;
                    isInstalled = all_installed;
                }
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
        finally {
            setIsInstalling(false);
        }
    };
    return (<>
      <div className="system-md-regular text-text-secondary">
        <p>{t(`${i18nPrefix}.readyToInstall`, { ns: 'plugin' })}</p>
      </div>
      <div className="flex flex-wrap content-start items-start gap-1 self-stretch rounded-2xl bg-background-section-burn p-2">
        <card_1.default className="w-full" payload={(0, utils_1.pluginManifestToCardPluginProps)(payload)} titleLeft={!isLoading && (<version_1.default hasInstalled={hasInstalled} installedVersion={installedVersion} toInstallVersion={toInstallVersion}/>)}/>
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 self-stretch">
        {!isInstalling && (<button_1.default variant="secondary" className="min-w-[72px]" onClick={onBack}>
            {t('installModal.back', { ns: 'plugin' })}
          </button_1.default>)}
        <button_1.default variant="primary" className="flex min-w-[72px] space-x-0.5" onClick={handleInstall} disabled={isInstalling || isLoading}>
          {isInstalling && <react_1.RiLoader2Line className="h-4 w-4 animate-spin-slow"/>}
          <span>{t(`${i18nPrefix}.${isInstalling ? 'installing' : 'install'}`, { ns: 'plugin' })}</span>
        </button_1.default>
      </div>
    </>);
};
exports.default = Loaded;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9hZGVkLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUdaLDRDQUFnRDtBQUNoRCwrQkFBOEI7QUFDOUIsaUNBQWlDO0FBQ2pDLGlEQUE4QztBQUM5Qyx5REFBaUQ7QUFDakQsMkdBQWlHO0FBQ2pHLCtDQUFvRDtBQUNwRCx1REFBc0Y7QUFDdEYsd0NBQWdDO0FBQ2hDLDBDQUEyQztBQUMzQyxvRUFBMEQ7QUFDMUQsZ0RBQXdDO0FBQ3hDLHVDQUE2RTtBQWU3RSxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUE7QUFFakMsTUFBTSxNQUFNLEdBQTBCLENBQUMsRUFDckMsYUFBYSxFQUNiLGdCQUFnQixFQUNoQixPQUFPLEVBQ1AsT0FBTyxFQUNQLGVBQWUsRUFDZixlQUFlLEVBQ2YsTUFBTSxFQUNOLGdCQUFnQixFQUNoQixXQUFXLEVBQ1gsUUFBUSxHQUNULEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUE7SUFDeEMsTUFBTSxRQUFRLEdBQUksT0FBa0IsQ0FBQyxTQUFTLENBQUE7SUFDOUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLDZCQUFpQixFQUFDO1FBQ3JELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUNyQixPQUFPLEVBQUUsQ0FBQyxDQUFDLFFBQVE7S0FDcEIsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxvQkFBb0IsR0FBRyxhQUFhLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN0RCxNQUFNLGdCQUFnQixHQUFHLG9CQUFvQixFQUFFLGdCQUFnQixDQUFBO0lBQy9ELE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQTtJQUV2QyxNQUFNLENBQUMsWUFBWSxFQUFF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QU0sQ0FBQyxDQUNWLENBQ0Q7UUFBQSxDQUFDLGdCQUFNLENBQ0wsT0FBTyxDQUFDLFNBQVMsQ0FDakIsU0FBUyxDQUFDLCtCQUErQixDQUN6QyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FDdkIsUUFBUSxDQUFDLENBQUMsWUFBWSxJQUFJLFNBQVMsQ0FBQyxDQUVwQztVQUFBLENBQUMsWUFBWSxJQUFJLENBQUMscUJBQWEsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLEVBQUcsQ0FDeEU7VUFBQSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FDL0Y7UUFBQSxFQUFFLGdCQUFNLENBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEdBQUcsQ0FDSixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsTUFBTSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgUGx1Z2luLCBQbHVnaW5EZWNsYXJhdGlvbiwgVXBkYXRlRnJvbUdpdEh1YlBheWxvYWQgfSBmcm9tICcuLi8uLi8uLi90eXBlcydcbmltcG9ydCB7IFJpTG9hZGVyMkxpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCB1c2VDaGVja0luc3RhbGxlZCBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvaW5zdGFsbC1wbHVnaW4vaG9va3MvdXNlLWNoZWNrLWluc3RhbGxlZCdcbmltcG9ydCB7IHVwZGF0ZUZyb21HaXRIdWIgfSBmcm9tICdAL3NlcnZpY2UvcGx1Z2lucydcbmltcG9ydCB7IHVzZUluc3RhbGxQYWNrYWdlRnJvbUdpdEh1YiwgdXNlUGx1Z2luVGFza0xpc3QgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXBsdWdpbnMnXG5pbXBvcnQgQ2FyZCBmcm9tICcuLi8uLi8uLi9jYXJkJ1xuaW1wb3J0IHsgVGFza1N0YXR1cyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IGNoZWNrVGFza1N0YXR1cyBmcm9tICcuLi8uLi9iYXNlL2NoZWNrLXRhc2stc3RhdHVzJ1xuaW1wb3J0IFZlcnNpb24gZnJvbSAnLi4vLi4vYmFzZS92ZXJzaW9uJ1xuaW1wb3J0IHsgcGFyc2VHaXRIdWJVcmwsIHBsdWdpbk1hbmlmZXN0VG9DYXJkUGx1Z2luUHJvcHMgfSBmcm9tICcuLi8uLi91dGlscydcblxudHlwZSBMb2FkZWRQcm9wcyA9IHtcbiAgdXBkYXRlUGF5bG9hZD86IFVwZGF0ZUZyb21HaXRIdWJQYXlsb2FkXG4gIHVuaXF1ZUlkZW50aWZpZXI6IHN0cmluZ1xuICBwYXlsb2FkOiBQbHVnaW5EZWNsYXJhdGlvbiB8IFBsdWdpblxuICByZXBvVXJsOiBzdHJpbmdcbiAgc2VsZWN0ZWRWZXJzaW9uOiBzdHJpbmdcbiAgc2VsZWN0ZWRQYWNrYWdlOiBzdHJpbmdcbiAgb25CYWNrOiAoKSA9PiB2b2lkXG4gIG9uU3RhcnRUb0luc3RhbGw/OiAoKSA9PiB2b2lkXG4gIG9uSW5zdGFsbGVkOiAobm90UmVmcmVzaD86IGJvb2xlYW4pID0+IHZvaWRcbiAgb25GYWlsZWQ6IChtZXNzYWdlPzogc3RyaW5nKSA9PiB2b2lkXG59XG5cbmNvbnN0IGkxOG5QcmVmaXggPSAnaW5zdGFsbE1vZGFsJ1xuXG5jb25zdCBMb2FkZWQ6IFJlYWN0LkZDPExvYWRlZFByb3BzPiA9ICh7XG4gIHVwZGF0ZVBheWxvYWQsXG4gIHVuaXF1ZUlkZW50aWZpZXIsXG4gIHBheWxvYWQsXG4gIHJlcG9VcmwsXG4gIHNlbGVjdGVkVmVyc2lvbixcbiAgc2VsZWN0ZWRQYWNrYWdlLFxuICBvbkJhY2ssXG4gIG9uU3RhcnRUb0luc3RhbGwsXG4gIG9uSW5zdGFsbGVkLFxuICBvbkZhaWxlZCxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHRvSW5zdGFsbFZlcnNpb24gPSBwYXlsb2FkLnZlcnNpb25cbiAgY29uc3QgcGx1Z2luSWQgPSAocGF5bG9hZCBhcyBQbHVnaW4pLnBsdWdpbl9pZFxuICBjb25zdCB7IGluc3RhbGxlZEluZm8sIGlzTG9hZGluZyB9ID0gdXNlQ2hlY2tJbnN0YWxsZWQoe1xuICAgIHBsdWdpbklkczogW3BsdWdpbklkXSxcbiAgICBlbmFibGVkOiAhIXBsdWdpbklkLFxuICB9KVxuICBjb25zdCBpbnN0YWxsZWRJbmZvUGF5bG9hZCA9IGluc3RhbGxlZEluZm8/LltwbHVnaW5JZF1cbiAgY29uc3QgaW5zdGFsbGVkVmVyc2lvbiA9IGluc3RhbGxlZEluZm9QYXlsb2FkPy5pbnN0YWxsZWRWZXJzaW9uXG4gIGNvbnN0IGhhc0luc3RhbGxlZCA9ICEhaW5zdGFsbGVkVmVyc2lvblxuXG4gIGNvbnN0IFtpc0luc3RhbGxpbmcsIHNldElzSW5zdGFsbGluZ10gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyBtdXRhdGVBc3luYzogaW5zdGFsbFBhY2thZ2VGcm9tR2l0SHViIH0gPSB1c2VJbnN0YWxsUGFja2FnZUZyb21HaXRIdWIoKVxuICBjb25zdCB7IGhhbmRsZVJlZmV0Y2ggfSA9IHVzZVBsdWdpblRhc2tMaXN0KHBheWxvYWQuY2F0ZWdvcnkpXG4gIGNvbnN0IHsgY2hlY2sgfSA9IGNoZWNrVGFza1N0YXR1cygpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoaGFzSW5zdGFsbGVkICYmIHVuaXF1ZUlkZW50aWZpZXIgPT09IGluc3RhbGxlZEluZm9QYXlsb2FkLnVuaXF1ZUlkZW50aWZpZXIpXG4gICAgICBvbkluc3RhbGxlZCgpXG4gIH0sIFtoYXNJbnN0YWxsZWRdKVxuXG4gIGNvbnN0IGhhbmRsZUluc3RhbGwgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKGlzSW5zdGFsbGluZylcbiAgICAgIHJldHVyblxuICAgIHNldElzSW5zdGFsbGluZyh0cnVlKVxuICAgIG9uU3RhcnRUb0luc3RhbGw/LigpXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBvd25lciwgcmVwbyB9ID0gcGFyc2VHaXRIdWJVcmwocmVwb1VybClcbiAgICAgIGxldCB0YXNrSWRcbiAgICAgIGxldCBpc0luc3RhbGxlZFxuICAgICAgaWYgKHVwZGF0ZVBheWxvYWQpIHtcbiAgICAgICAgY29uc3QgeyBhbGxfaW5zdGFsbGVkLCB0YXNrX2lkIH0gPSBhd2FpdCB1cGRhdGVGcm9tR2l0SHViKFxuICAgICAgICAgIGAke293bmVyfS8ke3JlcG99YCxcbiAgICAgICAgICBzZWxlY3RlZFZlcnNpb24sXG4gICAgICAgICAgc2VsZWN0ZWRQYWNrYWdlLFxuICAgICAgICAgIHVwZGF0ZVBheWxvYWQub3JpZ2luYWxQYWNrYWdlSW5mby5pZCxcbiAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICApXG5cbiAgICAgICAgdGFza0lkID0gdGFza19pZFxuICAgICAgICBpc0luc3RhbGxlZCA9IGFsbF9pbnN0YWxsZWRcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoaGFzSW5zdGFsbGVkKSB7XG4gICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgYWxsX2luc3RhbGxlZCxcbiAgICAgICAgICAgIHRhc2tfaWQsXG4gICAgICAgICAgfSA9IGF3YWl0IHVwZGF0ZUZyb21HaXRIdWIoXG4gICAgICAgICAgICBgJHtvd25lcn0vJHtyZXBvfWAsXG4gICAgICAgICAgICBzZWxlY3RlZFZlcnNpb24sXG4gICAgICAgICAgICBzZWxlY3RlZFBhY2thZ2UsXG4gICAgICAgICAgICBpbnN0YWxsZWRJbmZvUGF5bG9hZC51bmlxdWVJZGVudGlmaWVyLFxuICAgICAgICAgICAgdW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICApXG4gICAgICAgICAgdGFza0lkID0gdGFza19pZFxuICAgICAgICAgIGlzSW5zdGFsbGVkID0gYWxsX2luc3RhbGxlZFxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHsgYWxsX2luc3RhbGxlZCwgdGFza19pZCB9ID0gYXdhaXQgaW5zdGFsbFBhY2thZ2VGcm9tR2l0SHViKHtcbiAgICAgICAgICAgIHJlcG9Vcmw6IGAke293bmVyfS8ke3JlcG99YCxcbiAgICAgICAgICAgIHNlbGVjdGVkVmVyc2lvbixcbiAgICAgICAgICAgIHNlbGVjdGVkUGFja2FnZSxcbiAgICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIHRhc2tJZCA9IHRhc2tfaWRcbiAgICAgICAgICBpc0luc3RhbGxlZCA9IGFsbF9pbnN0YWxsZWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzSW5zdGFsbGVkKSB7XG4gICAgICAgIG9uSW5zdGFsbGVkKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGhhbmRsZVJlZmV0Y2goKVxuXG4gICAgICBjb25zdCB7IHN0YXR1cywgZXJyb3IgfSA9IGF3YWl0IGNoZWNrKHtcbiAgICAgICAgdGFza0lkLFxuICAgICAgICBwbHVnaW5VbmlxdWVJZGVudGlmaWVyOiB1bmlxdWVJZGVudGlmaWVyLFxuICAgICAgfSlcbiAgICAgIGlmIChzdGF0dXMgPT09IFRhc2tTdGF0dXMuZmFpbGVkKSB7XG4gICAgICAgIG9uRmFpbGVkKGVycm9yKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIG9uSW5zdGFsbGVkKHRydWUpXG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBpZiAodHlwZW9mIGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG9uRmFpbGVkKGUpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgb25GYWlsZWQoKVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIHNldElzSW5zdGFsbGluZyhmYWxzZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1tZC1yZWd1bGFyIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgPHA+e3QoYCR7aTE4blByZWZpeH0ucmVhZHlUb0luc3RhbGxgLCB7IG5zOiAncGx1Z2luJyB9KX08L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAgY29udGVudC1zdGFydCBpdGVtcy1zdGFydCBnYXAtMSBzZWxmLXN0cmV0Y2ggcm91bmRlZC0yeGwgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcC0yXCI+XG4gICAgICAgIDxDYXJkXG4gICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsXCJcbiAgICAgICAgICBwYXlsb2FkPXtwbHVnaW5NYW5pZmVzdFRvQ2FyZFBsdWdpblByb3BzKHBheWxvYWQgYXMgUGx1Z2luRGVjbGFyYXRpb24pfVxuICAgICAgICAgIHRpdGxlTGVmdD17IWlzTG9hZGluZyAmJiAoXG4gICAgICAgICAgICA8VmVyc2lvblxuICAgICAgICAgICAgICBoYXNJbnN0YWxsZWQ9e2hhc0luc3RhbGxlZH1cbiAgICAgICAgICAgICAgaW5zdGFsbGVkVmVyc2lvbj17aW5zdGFsbGVkVmVyc2lvbn1cbiAgICAgICAgICAgICAgdG9JbnN0YWxsVmVyc2lvbj17dG9JbnN0YWxsVmVyc2lvbn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktZW5kIGdhcC0yIHNlbGYtc3RyZXRjaFwiPlxuICAgICAgICB7IWlzSW5zdGFsbGluZyAmJiAoXG4gICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwic2Vjb25kYXJ5XCIgY2xhc3NOYW1lPVwibWluLXctWzcycHhdXCIgb25DbGljaz17b25CYWNrfT5cbiAgICAgICAgICAgIHt0KCdpbnN0YWxsTW9kYWwuYmFjaycsIHsgbnM6ICdwbHVnaW4nIH0pfVxuICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICApfVxuICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggbWluLXctWzcycHhdIHNwYWNlLXgtMC41XCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVJbnN0YWxsfVxuICAgICAgICAgIGRpc2FibGVkPXtpc0luc3RhbGxpbmcgfHwgaXNMb2FkaW5nfVxuICAgICAgICA+XG4gICAgICAgICAge2lzSW5zdGFsbGluZyAmJiA8UmlMb2FkZXIyTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IGFuaW1hdGUtc3Bpbi1zbG93XCIgLz59XG4gICAgICAgICAgPHNwYW4+e3QoYCR7aTE4blByZWZpeH0uJHtpc0luc3RhbGxpbmcgPyAnaW5zdGFsbGluZycgOiAnaW5zdGFsbCd9YCwgeyBuczogJ3BsdWdpbicgfSl9PC9zcGFuPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWRlZFxuIl19