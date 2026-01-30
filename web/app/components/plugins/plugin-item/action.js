"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const toast_1 = require("@/app/components/base/toast");
const modal_context_1 = require("@/context/modal-context");
const plugins_1 = require("@/service/plugins");
const use_plugins_1 = require("@/service/use-plugins");
const action_button_1 = require("../../base/action-button");
const confirm_1 = require("../../base/confirm");
const tooltip_1 = require("../../base/tooltip");
const hooks_1 = require("../install-plugin/hooks");
const plugin_info_1 = require("../plugin-page/plugin-info");
const types_1 = require("../types");
const i18nPrefix = 'action';
const Action = ({ author, installationId, pluginUniqueIdentifier, pluginName, category, isShowFetchNewVersion, isShowInfo, isShowDelete, onDelete, meta, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isShowPluginInfo, { setTrue: showPluginInfo, setFalse: hidePluginInfo, }] = (0, ahooks_1.useBoolean)(false);
    const [deleting, { setTrue: showDeleting, setFalse: hideDeleting, }] = (0, ahooks_1.useBoolean)(false);
    const { checkForUpdates, fetchReleases } = (0, hooks_1.useGitHubReleases)();
    const { setShowUpdatePluginModal } = (0, modal_context_1.useModalContext)();
    const invalidateInstalledPluginList = (0, use_plugins_1.useInvalidateInstalledPluginList)();
    const handleFetchNewVersion = async () => {
        const owner = meta.repo.split('/')[0] || author;
        const repo = meta.repo.split('/')[1] || pluginName;
        const fetchedReleases = await fetchReleases(owner, repo);
        if (fetchedReleases.length === 0)
            return;
        const { needUpdate, toastProps } = checkForUpdates(fetchedReleases, meta.version);
        toast_1.default.notify(toastProps);
        if (needUpdate) {
            setShowUpdatePluginModal({
                onSaveCallback: () => {
                    invalidateInstalledPluginList();
                },
                payload: {
                    type: types_1.PluginSource.github,
                    category,
                    github: {
                        originalPackageInfo: {
                            id: pluginUniqueIdentifier,
                            repo: meta.repo,
                            version: meta.version,
                            package: meta.package,
                            releases: fetchedReleases,
                        },
                    },
                },
            });
        }
    };
    const [isShowDeleteConfirm, { setTrue: showDeleteConfirm, setFalse: hideDeleteConfirm, }] = (0, ahooks_1.useBoolean)(false);
    const handleDelete = (0, react_2.useCallback)(async () => {
        showDeleting();
        try {
            const res = await (0, plugins_1.uninstallPlugin)(installationId);
            if (res.success) {
                hideDeleteConfirm();
                onDelete();
            }
        }
        catch (error) {
            console.error('uninstallPlugin error', error);
        }
        finally {
            hideDeleting();
        }
    }, [installationId, onDelete]);
    return (<div className="flex space-x-1">
      {/* Only plugin installed from GitHub need to check if it's the new version  */}
      {isShowFetchNewVersion
            && (<tooltip_1.default popupContent={t(`${i18nPrefix}.checkForUpdates`, { ns: 'plugin' })}>
            <action_button_1.default onClick={handleFetchNewVersion}>
              <react_1.RiLoopLeftLine className="h-4 w-4 text-text-tertiary"/>
            </action_button_1.default>
          </tooltip_1.default>)}
      {isShowInfo
            && (<tooltip_1.default popupContent={t(`${i18nPrefix}.pluginInfo`, { ns: 'plugin' })}>
            <action_button_1.default onClick={showPluginInfo}>
              <react_1.RiInformation2Line className="h-4 w-4 text-text-tertiary"/>
            </action_button_1.default>
          </tooltip_1.default>)}
      {isShowDelete
            && (<tooltip_1.default popupContent={t(`${i18nPrefix}.delete`, { ns: 'plugin' })}>
            <action_button_1.default className="text-text-tertiary hover:bg-state-destructive-hover hover:text-text-destructive" onClick={showDeleteConfirm}>
              <react_1.RiDeleteBinLine className="h-4 w-4"/>
            </action_button_1.default>
          </tooltip_1.default>)}

      {isShowPluginInfo && (<plugin_info_1.default repository={meta.repo} release={meta.version} packageName={meta.package} onHide={hidePluginInfo}/>)}
      <confirm_1.default isShow={isShowDeleteConfirm} title={t(`${i18nPrefix}.delete`, { ns: 'plugin' })} content={(<div>
            {t(`${i18nPrefix}.deleteContentLeft`, { ns: 'plugin' })}
            <span className="system-md-semibold">{pluginName}</span>
            {t(`${i18nPrefix}.deleteContentRight`, { ns: 'plugin' })}
            <br />
            {/* // todo: add usedInApps */}
            {/* {usedInApps > 0 && t(`${i18nPrefix}.usedInApps`, { num: usedInApps })} */}
          </div>)} onCancel={hideDeleteConfirm} onConfirm={handleDelete} isLoading={deleting} isDisabled={deleting}/>
    </div>);
};
exports.default = React.memo(Action);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aW9uLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUlaLDRDQUFzRjtBQUN0RixtQ0FBbUM7QUFDbkMsK0JBQThCO0FBQzlCLGlDQUFtQztBQUNuQyxpREFBOEM7QUFDOUMsdURBQStDO0FBQy9DLDJEQUF5RDtBQUN6RCwrQ0FBbUQ7QUFDbkQsdURBQXdFO0FBQ3hFLDREQUFtRDtBQUNuRCxnREFBd0M7QUFDeEMsZ0RBQXdDO0FBQ3hDLG1EQUEyRDtBQUMzRCw0REFBbUQ7QUFDbkQsb0NBQXVDO0FBRXZDLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQTtBQWUzQixNQUFNLE1BQU0sR0FBYyxDQUFDLEVBQ3pCLE1BQU0sRUFDTixjQUFjLEVBQ2Qsc0JBQXNCLEVBQ3RCLFVBQVUsRUFDVixRQUFRLEVBQ1IscUJBQXFCLEVBQ3JCLFVBQVUsRUFDVixZQUFZLEVBQ1osUUFBUSxFQUNSLElBQUksR0FDTCxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxDQUFDLGdCQUFnQixFQUFFLEVBQ3ZCLE9BQU8sRUFBRSxjQUFjLEVBQ3ZCLFFBQVEsRUFBRSxjQUFjLEdBQ3pCLENBQUMsR0FBRyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDdEIsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUNmLE9BQU8sRUFBRSxZQUFZLEVBQ3JCLFFBQVEsRUFBRSxZQUFZLEdBQ3ZCLENBQUMsR0FBRyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDdEIsTUFBTSxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsR0FBRyxJQUFBLHlCQUFpQixHQUFFLENBQUE7SUFDOUQsTUFBTSxFQUFFLHdCQUF3QixFQUFFLEdBQUcsSUFBQSwrQkFBZSxHQUFFLENBQUE7SUFDdEQsTUFBTSw2QkFBNkIsR0FBRyxJQUFBLDhDQUFnQyxHQUFFLENBQUE7SUFFeEUsTUFBTSxxQkFBcUIsR0FBRyxLQUFLLElBQUksRUFBRTtRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUE7UUFDaEQsTUFBTSxJQUFJLEdBQUcsSUFBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFBO1FBQ25ELE1BQU0sZUFBZSxHQUFHLE1BQU0sYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUN4RCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUM5QixPQUFNO1FBQ1IsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsR0FBRyxlQUFlLENBQUMsZUFBZSxFQUFFLElBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNsRixlQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3hCLElBQUksVUFBVSxFQUFFLENBQUM7WUFDZix3QkFBd0IsQ0FBQztnQkFDdkIsY0FBYyxFQUFFLEdBQUcsRUFBRTtvQkFDbkIsNkJBQTZCLEVBQUUsQ0FBQTtnQkFDakMsQ0FBQztnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLG9CQUFZLENBQUMsTUFBTTtvQkFDekIsUUFBUTtvQkFDUixNQUFNLEVBQUU7d0JBQ04sbUJBQW1CLEVBQUU7NEJBQ25CLEVBQUUsRUFBRSxzQkFBc0I7NEJBQzFCLElBQUksRUFBRSxJQUFLLENBQUMsSUFBSTs0QkFDaEIsT0FBTyxFQUFFLElBQUssQ0FBQyxPQUFPOzRCQUN0QixPQUFPLEVBQUUsSUFBSyxDQUFDLE9BQU87NEJBQ3RCLFFBQVEsRUFBRSxlQUFlO3lCQUMxQjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUM7SUFDSCxDQUFDLENBQUE7SUFFRCxNQUFNLENBQUMsbUJBQW1CLEVBQUUsRUFDMUIsT0FBTyxFQUFFLGlCQUFpQixFQUMxQixRQUFRLEVBQUUsaUJBQWlCLEdBQzVCLENBQUMsR0FBRyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFFdEIsTUFBTSxZQUFZLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEtBQUssSUFBSSxFQUFFO1FBQzFDLFlBQVksRUFBRSxDQUFBO1FBQ2QsSUFBSSxDQUFDO1lBQ0gsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLHlCQUFlLEVBQUMsY0FBYyxDQUFDLENBQUE7WUFDakQsSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2hCLGlCQUFpQixFQUFFLENBQUE7Z0JBQ25CLFFBQVEsRUFBRSxDQUFBO1lBQ1osQ0FBQztRQUNILENBQUM7UUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMvQyxDQUFDO2dCQUNPLENBQUM7WUFDUCxZQUFZLEVBQUUsQ0FBQTtRQUNoQixDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFDOUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FDN0I7TUFBQSxDQUFDLDhFQUE4RSxDQUMvRTtNQUFBLENBQUMscUJBQXFCO2VBQ2pCLENBQ0QsQ0FBQyxpQkFBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsa0JBQWtCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUMxRTtZQUFBLENBQUMsdUJBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUMzQztjQUFBLENBQUMsc0JBQWMsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLEVBQ3hEO1lBQUEsRUFBRSx1QkFBWSxDQUNoQjtVQUFBLEVBQUUsaUJBQU8sQ0FBQyxDQUNYLENBQ0g7TUFBQSxDQUNFLFVBQVU7ZUFDUCxDQUNELENBQUMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLGFBQWEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQ3JFO1lBQUEsQ0FBQyx1QkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUNwQztjQUFBLENBQUMsMEJBQWtCLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUM1RDtZQUFBLEVBQUUsdUJBQVksQ0FDaEI7VUFBQSxFQUFFLGlCQUFPLENBQUMsQ0FFZCxDQUNBO01BQUEsQ0FDRSxZQUFZO2VBQ1QsQ0FDRCxDQUFDLGlCQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxTQUFTLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUNqRTtZQUFBLENBQUMsdUJBQVksQ0FDWCxTQUFTLENBQUMsaUZBQWlGLENBQzNGLE9BQU8sQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBRTNCO2NBQUEsQ0FBQyx1QkFBZSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQ3RDO1lBQUEsRUFBRSx1QkFBWSxDQUNoQjtVQUFBLEVBQUUsaUJBQU8sQ0FBQyxDQUVkLENBRUE7O01BQUEsQ0FBQyxnQkFBZ0IsSUFBSSxDQUNuQixDQUFDLHFCQUFVLENBQ1QsVUFBVSxDQUFDLENBQUMsSUFBSyxDQUFDLElBQUksQ0FBQyxDQUN2QixPQUFPLENBQUMsQ0FBQyxJQUFLLENBQUMsT0FBTyxDQUFDLENBQ3ZCLFdBQVcsQ0FBQyxDQUFDLElBQUssQ0FBQyxPQUFPLENBQUMsQ0FDM0IsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQ3ZCLENBQ0gsQ0FDRDtNQUFBLENBQUMsaUJBQU8sQ0FDTixNQUFNLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUM1QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLFNBQVMsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQ25ELE9BQU8sQ0FBQyxDQUFDLENBQ1AsQ0FBQyxHQUFHLENBQ0Y7WUFBQSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsb0JBQW9CLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FDdkQ7WUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQ3ZEO1lBQUEsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLHFCQUFxQixFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQ3hEO1lBQUEsQ0FBQyxFQUFFLENBQUMsQUFBRCxFQUNIO1lBQUEsQ0FBQyw2QkFBNkIsQ0FDOUI7WUFBQSxDQUFDLDRFQUE0RSxDQUMvRTtVQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyxDQUNGLFFBQVEsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQzVCLFNBQVMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUN4QixTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDcEIsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBRXpCO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBNZXRhRGF0YSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5DYXRlZ29yeUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvdHlwZXMnXG5pbXBvcnQgeyBSaURlbGV0ZUJpbkxpbmUsIFJpSW5mb3JtYXRpb24yTGluZSwgUmlMb29wTGVmdExpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlQm9vbGVhbiB9IGZyb20gJ2Fob29rcydcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyB1c2VNb2RhbENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvbW9kYWwtY29udGV4dCdcbmltcG9ydCB7IHVuaW5zdGFsbFBsdWdpbiB9IGZyb20gJ0Avc2VydmljZS9wbHVnaW5zJ1xuaW1wb3J0IHsgdXNlSW52YWxpZGF0ZUluc3RhbGxlZFBsdWdpbkxpc3QgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXBsdWdpbnMnXG5pbXBvcnQgQWN0aW9uQnV0dG9uIGZyb20gJy4uLy4uL2Jhc2UvYWN0aW9uLWJ1dHRvbidcbmltcG9ydCBDb25maXJtIGZyb20gJy4uLy4uL2Jhc2UvY29uZmlybSdcbmltcG9ydCBUb29sdGlwIGZyb20gJy4uLy4uL2Jhc2UvdG9vbHRpcCdcbmltcG9ydCB7IHVzZUdpdEh1YlJlbGVhc2VzIH0gZnJvbSAnLi4vaW5zdGFsbC1wbHVnaW4vaG9va3MnXG5pbXBvcnQgUGx1Z2luSW5mbyBmcm9tICcuLi9wbHVnaW4tcGFnZS9wbHVnaW4taW5mbydcbmltcG9ydCB7IFBsdWdpblNvdXJjZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jb25zdCBpMThuUHJlZml4ID0gJ2FjdGlvbidcblxudHlwZSBQcm9wcyA9IHtcbiAgYXV0aG9yOiBzdHJpbmdcbiAgaW5zdGFsbGF0aW9uSWQ6IHN0cmluZ1xuICBwbHVnaW5VbmlxdWVJZGVudGlmaWVyOiBzdHJpbmdcbiAgcGx1Z2luTmFtZTogc3RyaW5nXG4gIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW1cbiAgdXNlZEluQXBwczogbnVtYmVyXG4gIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogYm9vbGVhblxuICBpc1Nob3dJbmZvOiBib29sZWFuXG4gIGlzU2hvd0RlbGV0ZTogYm9vbGVhblxuICBvbkRlbGV0ZTogKCkgPT4gdm9pZFxuICBtZXRhPzogTWV0YURhdGFcbn1cbmNvbnN0IEFjdGlvbjogRkM8UHJvcHM+ID0gKHtcbiAgYXV0aG9yLFxuICBpbnN0YWxsYXRpb25JZCxcbiAgcGx1Z2luVW5pcXVlSWRlbnRpZmllcixcbiAgcGx1Z2luTmFtZSxcbiAgY2F0ZWdvcnksXG4gIGlzU2hvd0ZldGNoTmV3VmVyc2lvbixcbiAgaXNTaG93SW5mbyxcbiAgaXNTaG93RGVsZXRlLFxuICBvbkRlbGV0ZSxcbiAgbWV0YSxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IFtpc1Nob3dQbHVnaW5JbmZvLCB7XG4gICAgc2V0VHJ1ZTogc2hvd1BsdWdpbkluZm8sXG4gICAgc2V0RmFsc2U6IGhpZGVQbHVnaW5JbmZvLFxuICB9XSA9IHVzZUJvb2xlYW4oZmFsc2UpXG4gIGNvbnN0IFtkZWxldGluZywge1xuICAgIHNldFRydWU6IHNob3dEZWxldGluZyxcbiAgICBzZXRGYWxzZTogaGlkZURlbGV0aW5nLFxuICB9XSA9IHVzZUJvb2xlYW4oZmFsc2UpXG4gIGNvbnN0IHsgY2hlY2tGb3JVcGRhdGVzLCBmZXRjaFJlbGVhc2VzIH0gPSB1c2VHaXRIdWJSZWxlYXNlcygpXG4gIGNvbnN0IHsgc2V0U2hvd1VwZGF0ZVBsdWdpbk1vZGFsIH0gPSB1c2VNb2RhbENvbnRleHQoKVxuICBjb25zdCBpbnZhbGlkYXRlSW5zdGFsbGVkUGx1Z2luTGlzdCA9IHVzZUludmFsaWRhdGVJbnN0YWxsZWRQbHVnaW5MaXN0KClcblxuICBjb25zdCBoYW5kbGVGZXRjaE5ld1ZlcnNpb24gPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3Qgb3duZXIgPSBtZXRhIS5yZXBvLnNwbGl0KCcvJylbMF0gfHwgYXV0aG9yXG4gICAgY29uc3QgcmVwbyA9IG1ldGEhLnJlcG8uc3BsaXQoJy8nKVsxXSB8fCBwbHVnaW5OYW1lXG4gICAgY29uc3QgZmV0Y2hlZFJlbGVhc2VzID0gYXdhaXQgZmV0Y2hSZWxlYXNlcyhvd25lciwgcmVwbylcbiAgICBpZiAoZmV0Y2hlZFJlbGVhc2VzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IHsgbmVlZFVwZGF0ZSwgdG9hc3RQcm9wcyB9ID0gY2hlY2tGb3JVcGRhdGVzKGZldGNoZWRSZWxlYXNlcywgbWV0YSEudmVyc2lvbilcbiAgICBUb2FzdC5ub3RpZnkodG9hc3RQcm9wcylcbiAgICBpZiAobmVlZFVwZGF0ZSkge1xuICAgICAgc2V0U2hvd1VwZGF0ZVBsdWdpbk1vZGFsKHtcbiAgICAgICAgb25TYXZlQ2FsbGJhY2s6ICgpID0+IHtcbiAgICAgICAgICBpbnZhbGlkYXRlSW5zdGFsbGVkUGx1Z2luTGlzdCgpXG4gICAgICAgIH0sXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICB0eXBlOiBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgIGdpdGh1Yjoge1xuICAgICAgICAgICAgb3JpZ2luYWxQYWNrYWdlSW5mbzoge1xuICAgICAgICAgICAgICBpZDogcGx1Z2luVW5pcXVlSWRlbnRpZmllcixcbiAgICAgICAgICAgICAgcmVwbzogbWV0YSEucmVwbyxcbiAgICAgICAgICAgICAgdmVyc2lvbjogbWV0YSEudmVyc2lvbixcbiAgICAgICAgICAgICAgcGFja2FnZTogbWV0YSEucGFja2FnZSxcbiAgICAgICAgICAgICAgcmVsZWFzZXM6IGZldGNoZWRSZWxlYXNlcyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29uc3QgW2lzU2hvd0RlbGV0ZUNvbmZpcm0sIHtcbiAgICBzZXRUcnVlOiBzaG93RGVsZXRlQ29uZmlybSxcbiAgICBzZXRGYWxzZTogaGlkZURlbGV0ZUNvbmZpcm0sXG4gIH1dID0gdXNlQm9vbGVhbihmYWxzZSlcblxuICBjb25zdCBoYW5kbGVEZWxldGUgPSB1c2VDYWxsYmFjayhhc3luYyAoKSA9PiB7XG4gICAgc2hvd0RlbGV0aW5nKClcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgdW5pbnN0YWxsUGx1Z2luKGluc3RhbGxhdGlvbklkKVxuICAgICAgaWYgKHJlcy5zdWNjZXNzKSB7XG4gICAgICAgIGhpZGVEZWxldGVDb25maXJtKClcbiAgICAgICAgb25EZWxldGUoKVxuICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3VuaW5zdGFsbFBsdWdpbiBlcnJvcicsIGVycm9yKVxuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgIGhpZGVEZWxldGluZygpXG4gICAgfVxuICB9LCBbaW5zdGFsbGF0aW9uSWQsIG9uRGVsZXRlXSlcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc3BhY2UteC0xXCI+XG4gICAgICB7LyogT25seSBwbHVnaW4gaW5zdGFsbGVkIGZyb20gR2l0SHViIG5lZWQgdG8gY2hlY2sgaWYgaXQncyB0aGUgbmV3IHZlcnNpb24gICovfVxuICAgICAge2lzU2hvd0ZldGNoTmV3VmVyc2lvblxuICAgICAgICAmJiAoXG4gICAgICAgICAgPFRvb2x0aXAgcG9wdXBDb250ZW50PXt0KGAke2kxOG5QcmVmaXh9LmNoZWNrRm9yVXBkYXRlc2AsIHsgbnM6ICdwbHVnaW4nIH0pfT5cbiAgICAgICAgICAgIDxBY3Rpb25CdXR0b24gb25DbGljaz17aGFuZGxlRmV0Y2hOZXdWZXJzaW9ufT5cbiAgICAgICAgICAgICAgPFJpTG9vcExlZnRMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgICAgIDwvQWN0aW9uQnV0dG9uPlxuICAgICAgICAgIDwvVG9vbHRpcD5cbiAgICAgICAgKX1cbiAgICAgIHtcbiAgICAgICAgaXNTaG93SW5mb1xuICAgICAgICAmJiAoXG4gICAgICAgICAgPFRvb2x0aXAgcG9wdXBDb250ZW50PXt0KGAke2kxOG5QcmVmaXh9LnBsdWdpbkluZm9gLCB7IG5zOiAncGx1Z2luJyB9KX0+XG4gICAgICAgICAgICA8QWN0aW9uQnV0dG9uIG9uQ2xpY2s9e3Nob3dQbHVnaW5JbmZvfT5cbiAgICAgICAgICAgICAgPFJpSW5mb3JtYXRpb24yTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICA8L0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgaXNTaG93RGVsZXRlXG4gICAgICAgICYmIChcbiAgICAgICAgICA8VG9vbHRpcCBwb3B1cENvbnRlbnQ9e3QoYCR7aTE4blByZWZpeH0uZGVsZXRlYCwgeyBuczogJ3BsdWdpbicgfSl9PlxuICAgICAgICAgICAgPEFjdGlvbkJ1dHRvblxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXRleHQtdGVydGlhcnkgaG92ZXI6Ymctc3RhdGUtZGVzdHJ1Y3RpdmUtaG92ZXIgaG92ZXI6dGV4dC10ZXh0LWRlc3RydWN0aXZlXCJcbiAgICAgICAgICAgICAgb25DbGljaz17c2hvd0RlbGV0ZUNvbmZpcm19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxSaURlbGV0ZUJpbkxpbmUgY2xhc3NOYW1lPVwiaC00IHctNFwiIC8+XG4gICAgICAgICAgICA8L0FjdGlvbkJ1dHRvbj5cbiAgICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAge2lzU2hvd1BsdWdpbkluZm8gJiYgKFxuICAgICAgICA8UGx1Z2luSW5mb1xuICAgICAgICAgIHJlcG9zaXRvcnk9e21ldGEhLnJlcG99XG4gICAgICAgICAgcmVsZWFzZT17bWV0YSEudmVyc2lvbn1cbiAgICAgICAgICBwYWNrYWdlTmFtZT17bWV0YSEucGFja2FnZX1cbiAgICAgICAgICBvbkhpZGU9e2hpZGVQbHVnaW5JbmZvfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIDxDb25maXJtXG4gICAgICAgIGlzU2hvdz17aXNTaG93RGVsZXRlQ29uZmlybX1cbiAgICAgICAgdGl0bGU9e3QoYCR7aTE4blByZWZpeH0uZGVsZXRlYCwgeyBuczogJ3BsdWdpbicgfSl9XG4gICAgICAgIGNvbnRlbnQ9eyhcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAge3QoYCR7aTE4blByZWZpeH0uZGVsZXRlQ29udGVudExlZnRgLCB7IG5zOiAncGx1Z2luJyB9KX1cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS1tZC1zZW1pYm9sZFwiPntwbHVnaW5OYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIHt0KGAke2kxOG5QcmVmaXh9LmRlbGV0ZUNvbnRlbnRSaWdodGAsIHsgbnM6ICdwbHVnaW4nIH0pfVxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICB7LyogLy8gdG9kbzogYWRkIHVzZWRJbkFwcHMgKi99XG4gICAgICAgICAgICB7Lyoge3VzZWRJbkFwcHMgPiAwICYmIHQoYCR7aTE4blByZWZpeH0udXNlZEluQXBwc2AsIHsgbnVtOiB1c2VkSW5BcHBzIH0pfSAqL31cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgb25DYW5jZWw9e2hpZGVEZWxldGVDb25maXJtfVxuICAgICAgICBvbkNvbmZpcm09e2hhbmRsZURlbGV0ZX1cbiAgICAgICAgaXNMb2FkaW5nPXtkZWxldGluZ31cbiAgICAgICAgaXNEaXNhYmxlZD17ZGVsZXRpbmd9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEFjdGlvbilcbiJdfQ==