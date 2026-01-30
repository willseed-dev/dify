"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallPluginButton = void 0;
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const check_task_status_1 = require("@/app/components/plugins/install-plugin/base/check-task-status");
const types_1 = require("@/app/components/plugins/types");
const use_plugins_1 = require("@/service/use-plugins");
const classnames_1 = require("@/utils/classnames");
const InstallPluginButton = (props) => {
    const { className, uniqueIdentifier, extraIdentifiers = [], onSuccess, ...rest } = props;
    const { t } = (0, react_i18next_1.useTranslation)();
    const identifiers = Array.from(new Set([uniqueIdentifier, ...extraIdentifiers].filter((item) => Boolean(item))));
    const manifest = (0, use_plugins_1.useCheckInstalled)({
        pluginIds: identifiers,
        enabled: identifiers.length > 0,
    });
    const install = (0, use_plugins_1.useInstallPackageFromMarketPlace)();
    const [isTracking, setIsTracking] = (0, react_2.useState)(false);
    const isLoading = manifest.isLoading || install.isPending || isTracking;
    const handleInstall = (e) => {
        e.stopPropagation();
        if (isLoading)
            return;
        setIsTracking(true);
        install.mutate(uniqueIdentifier, {
            onSuccess: async (response) => {
                const finish = async () => {
                    await manifest.refetch();
                    onSuccess?.();
                    setIsTracking(false);
                    install.reset();
                };
                if (!response) {
                    await finish();
                    return;
                }
                if (response.all_installed) {
                    await finish();
                    return;
                }
                const { check } = (0, check_task_status_1.default)();
                try {
                    const { status } = await check({
                        taskId: response.task_id,
                        pluginUniqueIdentifier: uniqueIdentifier,
                    });
                    if (status === types_1.TaskStatus.failed) {
                        setIsTracking(false);
                        install.reset();
                        return;
                    }
                    await finish();
                }
                catch {
                    setIsTracking(false);
                    install.reset();
                }
            },
            onError: () => {
                setIsTracking(false);
                install.reset();
            },
        });
    };
    if (!manifest.data)
        return null;
    const identifierSet = new Set(identifiers);
    const isInstalled = manifest.data.plugins.some(plugin => (identifierSet.has(plugin.id)
        || (plugin.plugin_unique_identifier && identifierSet.has(plugin.plugin_unique_identifier))
        || (plugin.plugin_id && identifierSet.has(plugin.plugin_id))));
    if (isInstalled)
        return null;
    return (<button_1.default variant="secondary" disabled={isLoading} {...rest} onClick={handleInstall} className={(0, classnames_1.cn)('flex items-center', className)}>
      {!isLoading ? t('nodes.agent.pluginInstaller.install', { ns: 'workflow' }) : t('nodes.agent.pluginInstaller.installing', { ns: 'workflow' })}
      {!isLoading ? <react_1.RiInstallLine className="ml-1 size-3.5"/> : <react_1.RiLoader2Line className="ml-1 size-3.5 animate-spin"/>}
    </button_1.default>);
};
exports.InstallPluginButton = InstallPluginButton;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC1wbHVnaW4tYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5zdGFsbC1wbHVnaW4tYnV0dG9uLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw0Q0FBK0Q7QUFDL0QsaUNBQWdDO0FBQ2hDLGlEQUE4QztBQUM5Qyx5REFBaUQ7QUFDakQsc0dBQTRGO0FBQzVGLDBEQUEyRDtBQUMzRCx1REFBMkY7QUFDM0YsbURBQXVDO0FBUWhDLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxLQUErQixFQUFFLEVBQUU7SUFDckUsTUFBTSxFQUNKLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsZ0JBQWdCLEdBQUcsRUFBRSxFQUNyQixTQUFTLEVBQ1QsR0FBRyxJQUFJLEVBQ1IsR0FBRyxLQUFLLENBQUE7SUFDVCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FDcEMsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLGdCQUFnQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFrQixFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ3hGLENBQUMsQ0FBQTtJQUNGLE1BQU0sUUFBUSxHQUFHLElBQUEsK0JBQWlCLEVBQUM7UUFDakMsU0FBUyxFQUFFLFdBQVc7UUFDdEIsT0FBTyxFQUFFLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQztLQUNoQyxDQUFDLENBQUE7SUFDRixNQUFNLE9BQU8sR0FBRyxJQUFBLDhDQUFnQyxHQUFFLENBQUE7SUFDbEQsTUFBTSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDbkQsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLFVBQVUsQ0FB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QUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQ0FBcUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsd0NBQXdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDNUk7TUFBQSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFhLENBQUMsU0FBUyxDQUFDLGVBQWUsRUFBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFhLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUFHLENBQ3RIO0lBQUEsRUFBRSxnQkFBTSxDQUFDLENBQ1YsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQTNGWSxRQUFBLG1CQUFtQix1QkEyRi9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDb21wb25lbnRQcm9wcywgTW91c2VFdmVudEhhbmRsZXIgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFJpSW5zdGFsbExpbmUsIFJpTG9hZGVyMkxpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCBjaGVja1Rhc2tTdGF0dXMgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL2luc3RhbGwtcGx1Z2luL2Jhc2UvY2hlY2stdGFzay1zdGF0dXMnXG5pbXBvcnQgeyBUYXNrU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0IHsgdXNlQ2hlY2tJbnN0YWxsZWQsIHVzZUluc3RhbGxQYWNrYWdlRnJvbU1hcmtldFBsYWNlIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5cbnR5cGUgSW5zdGFsbFBsdWdpbkJ1dHRvblByb3BzID0gT21pdDxDb21wb25lbnRQcm9wczx0eXBlb2YgQnV0dG9uPiwgJ2NoaWxkcmVuJyB8ICdsb2FkaW5nJz4gJiB7XG4gIHVuaXF1ZUlkZW50aWZpZXI6IHN0cmluZ1xuICBleHRyYUlkZW50aWZpZXJzPzogc3RyaW5nW11cbiAgb25TdWNjZXNzPzogKCkgPT4gdm9pZFxufVxuXG5leHBvcnQgY29uc3QgSW5zdGFsbFBsdWdpbkJ1dHRvbiA9IChwcm9wczogSW5zdGFsbFBsdWdpbkJ1dHRvblByb3BzKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjbGFzc05hbWUsXG4gICAgdW5pcXVlSWRlbnRpZmllcixcbiAgICBleHRyYUlkZW50aWZpZXJzID0gW10sXG4gICAgb25TdWNjZXNzLFxuICAgIC4uLnJlc3RcbiAgfSA9IHByb3BzXG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBpZGVudGlmaWVycyA9IEFycmF5LmZyb20obmV3IFNldChcbiAgICBbdW5pcXVlSWRlbnRpZmllciwgLi4uZXh0cmFJZGVudGlmaWVyc10uZmlsdGVyKChpdGVtKTogaXRlbSBpcyBzdHJpbmcgPT4gQm9vbGVhbihpdGVtKSksXG4gICkpXG4gIGNvbnN0IG1hbmlmZXN0ID0gdXNlQ2hlY2tJbnN0YWxsZWQoe1xuICAgIHBsdWdpbklkczogaWRlbnRpZmllcnMsXG4gICAgZW5hYmxlZDogaWRlbnRpZmllcnMubGVuZ3RoID4gMCxcbiAgfSlcbiAgY29uc3QgaW5zdGFsbCA9IHVzZUluc3RhbGxQYWNrYWdlRnJvbU1hcmtldFBsYWNlKClcbiAgY29uc3QgW2lzVHJhY2tpbmcsIHNldElzVHJhY2tpbmddID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGlzTG9hZGluZyA9IG1hbmlmZXN0LmlzTG9hZGluZyB8fCBpbnN0YWxsLmlzUGVuZGluZyB8fCBpc1RyYWNraW5nXG4gIGNvbnN0IGhhbmRsZUluc3RhbGw6IE1vdXNlRXZlbnRIYW5kbGVyID0gKGUpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgaWYgKGlzTG9hZGluZylcbiAgICAgIHJldHVyblxuICAgIHNldElzVHJhY2tpbmcodHJ1ZSlcbiAgICBpbnN0YWxsLm11dGF0ZSh1bmlxdWVJZGVudGlmaWVyLCB7XG4gICAgICBvblN1Y2Nlc3M6IGFzeW5jIChyZXNwb25zZSkgPT4ge1xuICAgICAgICBjb25zdCBmaW5pc2ggPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgYXdhaXQgbWFuaWZlc3QucmVmZXRjaCgpXG4gICAgICAgICAgb25TdWNjZXNzPy4oKVxuICAgICAgICAgIHNldElzVHJhY2tpbmcoZmFsc2UpXG4gICAgICAgICAgaW5zdGFsbC5yZXNldCgpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgICAgICAgYXdhaXQgZmluaXNoKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXNwb25zZS5hbGxfaW5zdGFsbGVkKSB7XG4gICAgICAgICAgYXdhaXQgZmluaXNoKClcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgY2hlY2sgfSA9IGNoZWNrVGFza1N0YXR1cygpXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgeyBzdGF0dXMgfSA9IGF3YWl0IGNoZWNrKHtcbiAgICAgICAgICAgIHRhc2tJZDogcmVzcG9uc2UudGFza19pZCxcbiAgICAgICAgICAgIHBsdWdpblVuaXF1ZUlkZW50aWZpZXI6IHVuaXF1ZUlkZW50aWZpZXIsXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIGlmIChzdGF0dXMgPT09IFRhc2tTdGF0dXMuZmFpbGVkKSB7XG4gICAgICAgICAgICBzZXRJc1RyYWNraW5nKGZhbHNlKVxuICAgICAgICAgICAgaW5zdGFsbC5yZXNldCgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhd2FpdCBmaW5pc2goKVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIHtcbiAgICAgICAgICBzZXRJc1RyYWNraW5nKGZhbHNlKVxuICAgICAgICAgIGluc3RhbGwucmVzZXQoKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb25FcnJvcjogKCkgPT4ge1xuICAgICAgICBzZXRJc1RyYWNraW5nKGZhbHNlKVxuICAgICAgICBpbnN0YWxsLnJlc2V0KClcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuICBpZiAoIW1hbmlmZXN0LmRhdGEpXG4gICAgcmV0dXJuIG51bGxcbiAgY29uc3QgaWRlbnRpZmllclNldCA9IG5ldyBTZXQoaWRlbnRpZmllcnMpXG4gIGNvbnN0IGlzSW5zdGFsbGVkID0gbWFuaWZlc3QuZGF0YS5wbHVnaW5zLnNvbWUocGx1Z2luID0+IChcbiAgICBpZGVudGlmaWVyU2V0LmhhcyhwbHVnaW4uaWQpXG4gICAgfHwgKHBsdWdpbi5wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXIgJiYgaWRlbnRpZmllclNldC5oYXMocGx1Z2luLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllcikpXG4gICAgfHwgKHBsdWdpbi5wbHVnaW5faWQgJiYgaWRlbnRpZmllclNldC5oYXMocGx1Z2luLnBsdWdpbl9pZCkpXG4gICkpXG4gIGlmIChpc0luc3RhbGxlZClcbiAgICByZXR1cm4gbnVsbFxuICByZXR1cm4gKFxuICAgIDxCdXR0b25cbiAgICAgIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIlxuICAgICAgZGlzYWJsZWQ9e2lzTG9hZGluZ31cbiAgICAgIHsuLi5yZXN0fVxuICAgICAgb25DbGljaz17aGFuZGxlSW5zdGFsbH1cbiAgICAgIGNsYXNzTmFtZT17Y24oJ2ZsZXggaXRlbXMtY2VudGVyJywgY2xhc3NOYW1lKX1cbiAgICA+XG4gICAgICB7IWlzTG9hZGluZyA/IHQoJ25vZGVzLmFnZW50LnBsdWdpbkluc3RhbGxlci5pbnN0YWxsJywgeyBuczogJ3dvcmtmbG93JyB9KSA6IHQoJ25vZGVzLmFnZW50LnBsdWdpbkluc3RhbGxlci5pbnN0YWxsaW5nJywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgIHshaXNMb2FkaW5nID8gPFJpSW5zdGFsbExpbmUgY2xhc3NOYW1lPVwibWwtMSBzaXplLTMuNVwiIC8+IDogPFJpTG9hZGVyMkxpbmUgY2xhc3NOYW1lPVwibWwtMSBzaXplLTMuNSBhbmltYXRlLXNwaW5cIiAvPn1cbiAgICA8L0J1dHRvbj5cbiAgKVxufVxuIl19