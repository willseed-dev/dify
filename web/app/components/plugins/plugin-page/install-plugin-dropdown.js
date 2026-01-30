"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const function_1 = require("es-toolkit/function");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const files_1 = require("@/app/components/base/icons/src/vender/solid/files");
const general_1 = require("@/app/components/base/icons/src/vender/solid/general");
const mediaAndDevices_1 = require("@/app/components/base/icons/src/vender/solid/mediaAndDevices");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const install_from_github_1 = require("@/app/components/plugins/install-plugin/install-from-github");
const install_from_local_package_1 = require("@/app/components/plugins/install-plugin/install-from-local-package");
const config_1 = require("@/config");
const global_public_context_1 = require("@/context/global-public-context");
const classnames_1 = require("@/utils/classnames");
const InstallPluginDropdown = ({ onSwitchToMarketplaceTab, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const fileInputRef = (0, react_2.useRef)(null);
    const [isMenuOpen, setIsMenuOpen] = (0, react_2.useState)(false);
    const [selectedAction, setSelectedAction] = (0, react_2.useState)(null);
    const [selectedFile, setSelectedFile] = (0, react_2.useState)(null);
    const { enable_marketplace, plugin_installation_permission } = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setSelectedAction('local');
            setIsMenuOpen(false);
        }
    };
    // TODO TEST INSTALL : uninstall
    // const [pluginLists, setPluginLists] = useState<any>([])
    // useEffect(() => {
    //   (async () => {
    //     const list: any = await get('workspaces/current/plugin/list')
    //   })()
    // })
    // const handleUninstall = async (id: string) => {
    //   const res = await post('workspaces/current/plugin/uninstall', { body: { plugin_installation_id: id } })
    //   console.log(res)
    // }
    const [installMethods, setInstallMethods] = (0, react_2.useState)([]);
    (0, react_2.useEffect)(() => {
        const methods = [];
        if (enable_marketplace)
            methods.push({ icon: mediaAndDevices_1.MagicBox, text: t('source.marketplace', { ns: 'plugin' }), action: 'marketplace' });
        if (plugin_installation_permission.restrict_to_marketplace_only) {
            setInstallMethods(methods);
        }
        else {
            methods.push({ icon: general_1.Github, text: t('source.github', { ns: 'plugin' }), action: 'github' });
            methods.push({ icon: files_1.FileZip, text: t('source.local', { ns: 'plugin' }), action: 'local' });
            setInstallMethods(methods);
        }
    }, [plugin_installation_permission, enable_marketplace, t]);
    return (<portal_to_follow_elem_1.PortalToFollowElem open={isMenuOpen} onOpenChange={setIsMenuOpen} placement="bottom-start" offset={4}>
      <div className="relative">
        <portal_to_follow_elem_1.PortalToFollowElemTrigger onClick={() => setIsMenuOpen(v => !v)}>
          <button_1.default className={(0, classnames_1.cn)('h-full w-full p-2 text-components-button-secondary-text', isMenuOpen && 'bg-state-base-hover')}>
            <react_1.RiAddLine className="h-4 w-4"/>
            <span className="pl-1">{t('installPlugin', { ns: 'plugin' })}</span>
            <react_1.RiArrowDownSLine className="ml-1 h-4 w-4"/>
          </button_1.default>
        </portal_to_follow_elem_1.PortalToFollowElemTrigger>
        <portal_to_follow_elem_1.PortalToFollowElemContent className="z-[1002]">
          <div className="shadows-shadow-lg flex w-[200px] flex-col items-start rounded-xl border border-components-panel-border bg-components-panel-bg-blur p-1 pb-2">
            <span className="system-xs-medium-uppercase flex items-start self-stretch pb-0.5 pl-2 pr-3 pt-1 text-text-tertiary">
              {t('installFrom', { ns: 'plugin' })}
            </span>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept={config_1.SUPPORT_INSTALL_LOCAL_FILE_EXTENSIONS}/>
            <div className="w-full">
              {installMethods.map(({ icon: Icon, text, action }) => (<div key={action} className="flex w-full !cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-state-base-hover" onClick={() => {
                if (action === 'local') {
                    fileInputRef.current?.click();
                }
                else if (action === 'marketplace') {
                    onSwitchToMarketplaceTab();
                    setIsMenuOpen(false);
                }
                else {
                    setSelectedAction(action);
                    setIsMenuOpen(false);
                }
            }}>
                  <Icon className="h-4 w-4 text-text-tertiary"/>
                  <span className="system-md-regular px-1 text-text-secondary">{text}</span>
                </div>))}
            </div>
          </div>
        </portal_to_follow_elem_1.PortalToFollowElemContent>
      </div>
      {selectedAction === 'github' && (<install_from_github_1.default onSuccess={function_1.noop} onClose={() => setSelectedAction(null)}/>)}
      {selectedAction === 'local' && selectedFile
            && (<install_from_local_package_1.default file={selectedFile} onClose={() => setSelectedAction(null)} onSuccess={function_1.noop}/>)}
      {/* {pluginLists.map((item: any) => (
          <div key={item.id} onClick={() => handleUninstall(item.id)}>{item.name} 卸载</div>
        ))} */}
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.default = InstallPluginDropdown;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC1wbHVnaW4tZHJvcGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnN0YWxsLXBsdWdpbi1kcm9wZG93bi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiw0Q0FBOEQ7QUFDOUQsa0RBQTBDO0FBQzFDLGlDQUFtRDtBQUNuRCxpREFBOEM7QUFDOUMseURBQWlEO0FBQ2pELDhFQUE0RTtBQUM1RSxrRkFBNkU7QUFDN0Usa0dBQXVGO0FBQ3ZGLHVGQUlvRDtBQUNwRCxxR0FBMkY7QUFDM0YsbUhBQXdHO0FBQ3hHLHFDQUFnRTtBQUNoRSwyRUFBc0U7QUFDdEUsbURBQXVDO0FBWXZDLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxFQUM3Qix3QkFBd0IsR0FDbEIsRUFBRSxFQUFFO0lBQ1YsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUEsY0FBTSxFQUFtQixJQUFJLENBQUMsQ0FBQTtJQUNuRCxNQUFNLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUNuRCxNQUFNLENBQUMsY0FBYyxFQUFFLGlCQUFpQixDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFnQixJQUFJLENBQUMsQ0FBQTtJQUN6RSxNQUFNLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBYyxJQUFJLENBQUMsQ0FBQTtJQUNuRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsOEJBQThCLEVBQUUsR0FBRyxJQUFBLDRDQUFvQixFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRTFHLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUEwQyxFQUFFLEVBQUU7UUFDdEUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxL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QUFDLFNBQVMsQ0FBQyw0QkFBNEIsRUFDNUM7a0JBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDRDQUE0QyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUMzRTtnQkFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUMsQ0FDSjtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLGlEQUF5QixDQUM3QjtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxjQUFjLEtBQUssUUFBUSxJQUFJLENBQzlCLENBQUMsNkJBQWlCLENBQ2hCLFNBQVMsQ0FBQyxDQUFDLGVBQUksQ0FBQyxDQUNoQixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUN2QyxDQUNILENBQ0Q7TUFBQSxDQUFDLGNBQWMsS0FBSyxPQUFPLElBQUksWUFBWTtlQUN0QyxDQUNELENBQUMsb0NBQXVCLENBQ3RCLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUNuQixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUN2QyxTQUFTLENBQUMsQ0FBQyxlQUFJLENBQUMsRUFDaEIsQ0FDSCxDQUNIO01BQUEsQ0FBQzs7Y0FFSyxDQUNSO0lBQUEsRUFBRSwwQ0FBa0IsQ0FBQyxDQUN0QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUscUJBQXFCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcblxuaW1wb3J0IHsgUmlBZGRMaW5lLCBSaUFycm93RG93blNMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IG5vb3AgfSBmcm9tICdlcy10b29sa2l0L2Z1bmN0aW9uJ1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgeyBGaWxlWmlwIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvc29saWQvZmlsZXMnXG5pbXBvcnQgeyBHaXRodWIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9nZW5lcmFsJ1xuaW1wb3J0IHsgTWFnaWNCb3ggfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9tZWRpYUFuZERldmljZXMnXG5pbXBvcnQge1xuICBQb3J0YWxUb0ZvbGxvd0VsZW0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQsXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nXG5pbXBvcnQgSW5zdGFsbEZyb21HaXRIdWIgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL2luc3RhbGwtcGx1Z2luL2luc3RhbGwtZnJvbS1naXRodWInXG5pbXBvcnQgSW5zdGFsbEZyb21Mb2NhbFBhY2thZ2UgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL2luc3RhbGwtcGx1Z2luL2luc3RhbGwtZnJvbS1sb2NhbC1wYWNrYWdlJ1xuaW1wb3J0IHsgU1VQUE9SVF9JTlNUQUxMX0xPQ0FMX0ZJTEVfRVhURU5TSU9OUyB9IGZyb20gJ0AvY29uZmlnJ1xuaW1wb3J0IHsgdXNlR2xvYmFsUHVibGljU3RvcmUgfSBmcm9tICdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0J1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG9uU3dpdGNoVG9NYXJrZXRwbGFjZVRhYjogKCkgPT4gdm9pZFxufVxuXG50eXBlIEluc3RhbGxNZXRob2QgPSB7XG4gIGljb246IFJlYWN0LkZDPHsgY2xhc3NOYW1lPzogc3RyaW5nIH0+XG4gIHRleHQ6IHN0cmluZ1xuICBhY3Rpb246IHN0cmluZ1xufVxuXG5jb25zdCBJbnN0YWxsUGx1Z2luRHJvcGRvd24gPSAoe1xuICBvblN3aXRjaFRvTWFya2V0cGxhY2VUYWIsXG59OiBQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgZmlsZUlucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpXG4gIGNvbnN0IFtpc01lbnVPcGVuLCBzZXRJc01lbnVPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbc2VsZWN0ZWRBY3Rpb24sIHNldFNlbGVjdGVkQWN0aW9uXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtzZWxlY3RlZEZpbGUsIHNldFNlbGVjdGVkRmlsZV0gPSB1c2VTdGF0ZTxGaWxlIHwgbnVsbD4obnVsbClcbiAgY29uc3QgeyBlbmFibGVfbWFya2V0cGxhY2UsIHBsdWdpbl9pbnN0YWxsYXRpb25fcGVybWlzc2lvbiB9ID0gdXNlR2xvYmFsUHVibGljU3RvcmUocyA9PiBzLnN5c3RlbUZlYXR1cmVzKVxuXG4gIGNvbnN0IGhhbmRsZUZpbGVDaGFuZ2UgPSAoZXZlbnQ6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGV2ZW50LnRhcmdldC5maWxlcz8uWzBdXG4gICAgaWYgKGZpbGUpIHtcbiAgICAgIHNldFNlbGVjdGVkRmlsZShmaWxlKVxuICAgICAgc2V0U2VsZWN0ZWRBY3Rpb24oJ2xvY2FsJylcbiAgICAgIHNldElzTWVudU9wZW4oZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyBURVNUIElOU1RBTEwgOiB1bmluc3RhbGxcbiAgLy8gY29uc3QgW3BsdWdpbkxpc3RzLCBzZXRQbHVnaW5MaXN0c10gPSB1c2VTdGF0ZTxhbnk+KFtdKVxuICAvLyB1c2VFZmZlY3QoKCkgPT4ge1xuICAvLyAgIChhc3luYyAoKSA9PiB7XG4gIC8vICAgICBjb25zdCBsaXN0OiBhbnkgPSBhd2FpdCBnZXQoJ3dvcmtzcGFjZXMvY3VycmVudC9wbHVnaW4vbGlzdCcpXG4gIC8vICAgfSkoKVxuICAvLyB9KVxuXG4gIC8vIGNvbnN0IGhhbmRsZVVuaW5zdGFsbCA9IGFzeW5jIChpZDogc3RyaW5nKSA9PiB7XG4gIC8vICAgY29uc3QgcmVzID0gYXdhaXQgcG9zdCgnd29ya3NwYWNlcy9jdXJyZW50L3BsdWdpbi91bmluc3RhbGwnLCB7IGJvZHk6IHsgcGx1Z2luX2luc3RhbGxhdGlvbl9pZDogaWQgfSB9KVxuICAvLyAgIGNvbnNvbGUubG9nKHJlcylcbiAgLy8gfVxuXG4gIGNvbnN0IFtpbnN0YWxsTWV0aG9kcywgc2V0SW5zdGFsbE1ldGhvZHNdID0gdXNlU3RhdGU8SW5zdGFsbE1ldGhvZFtdPihbXSlcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBtZXRob2RzID0gW11cbiAgICBpZiAoZW5hYmxlX21hcmtldHBsYWNlKVxuICAgICAgbWV0aG9kcy5wdXNoKHsgaWNvbjogTWFnaWNCb3gsIHRleHQ6IHQoJ3NvdXJjZS5tYXJrZXRwbGFjZScsIHsgbnM6ICdwbHVnaW4nIH0pLCBhY3Rpb246ICdtYXJrZXRwbGFjZScgfSlcblxuICAgIGlmIChwbHVnaW5faW5zdGFsbGF0aW9uX3Blcm1pc3Npb24ucmVzdHJpY3RfdG9fbWFya2V0cGxhY2Vfb25seSkge1xuICAgICAgc2V0SW5zdGFsbE1ldGhvZHMobWV0aG9kcylcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBtZXRob2RzLnB1c2goeyBpY29uOiBHaXRodWIsIHRleHQ6IHQoJ3NvdXJjZS5naXRodWInLCB7IG5zOiAncGx1Z2luJyB9KSwgYWN0aW9uOiAnZ2l0aHViJyB9KVxuICAgICAgbWV0aG9kcy5wdXNoKHsgaWNvbjogRmlsZVppcCwgdGV4dDogdCgnc291cmNlLmxvY2FsJywgeyBuczogJ3BsdWdpbicgfSksIGFjdGlvbjogJ2xvY2FsJyB9KVxuICAgICAgc2V0SW5zdGFsbE1ldGhvZHMobWV0aG9kcylcbiAgICB9XG4gIH0sIFtwbHVnaW5faW5zdGFsbGF0aW9uX3Blcm1pc3Npb24sIGVuYWJsZV9tYXJrZXRwbGFjZSwgdF0pXG5cbiAgcmV0dXJuIChcbiAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtXG4gICAgICBvcGVuPXtpc01lbnVPcGVufVxuICAgICAgb25PcGVuQ2hhbmdlPXtzZXRJc01lbnVPcGVufVxuICAgICAgcGxhY2VtZW50PVwiYm90dG9tLXN0YXJ0XCJcbiAgICAgIG9mZnNldD17NH1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XG4gICAgICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyIG9uQ2xpY2s9eygpID0+IHNldElzTWVudU9wZW4odiA9PiAhdil9PlxuICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oJ2gtZnVsbCB3LWZ1bGwgcC0yIHRleHQtY29tcG9uZW50cy1idXR0b24tc2Vjb25kYXJ5LXRleHQnLCBpc01lbnVPcGVuICYmICdiZy1zdGF0ZS1iYXNlLWhvdmVyJyl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFJpQWRkTGluZSBjbGFzc05hbWU9XCJoLTQgdy00XCIgLz5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInBsLTFcIj57dCgnaW5zdGFsbFBsdWdpbicsIHsgbnM6ICdwbHVnaW4nIH0pfTwvc3Bhbj5cbiAgICAgICAgICAgIDxSaUFycm93RG93blNMaW5lIGNsYXNzTmFtZT1cIm1sLTEgaC00IHctNFwiIC8+XG4gICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcj5cbiAgICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQgY2xhc3NOYW1lPVwiei1bMTAwMl1cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNoYWRvd3Mtc2hhZG93LWxnIGZsZXggdy1bMjAwcHhdIGZsZXgtY29sIGl0ZW1zLXN0YXJ0IHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnLWJsdXIgcC0xIHBiLTJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0tdXBwZXJjYXNlIGZsZXggaXRlbXMtc3RhcnQgc2VsZi1zdHJldGNoIHBiLTAuNSBwbC0yIHByLTMgcHQtMSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICAgICAge3QoJ2luc3RhbGxGcm9tJywgeyBuczogJ3BsdWdpbicgfSl9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgdHlwZT1cImZpbGVcIlxuICAgICAgICAgICAgICByZWY9e2ZpbGVJbnB1dFJlZn1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGaWxlQ2hhbmdlfVxuICAgICAgICAgICAgICBhY2NlcHQ9e1NVUFBPUlRfSU5TVEFMTF9MT0NBTF9GSUxFX0VYVEVOU0lPTlN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGxcIj5cbiAgICAgICAgICAgICAge2luc3RhbGxNZXRob2RzLm1hcCgoeyBpY29uOiBJY29uLCB0ZXh0LCBhY3Rpb24gfSkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGtleT17YWN0aW9ufVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgIWN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBnYXAtMSByb3VuZGVkLWxnIHB4LTIgcHktMS41IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnbG9jYWwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZmlsZUlucHV0UmVmLmN1cnJlbnQ/LmNsaWNrKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT09ICdtYXJrZXRwbGFjZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICBvblN3aXRjaFRvTWFya2V0cGxhY2VUYWIoKVxuICAgICAgICAgICAgICAgICAgICAgIHNldElzTWVudU9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0U2VsZWN0ZWRBY3Rpb24oYWN0aW9uKVxuICAgICAgICAgICAgICAgICAgICAgIHNldElzTWVudU9wZW4oZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPEljb24gY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLW1kLXJlZ3VsYXIgcHgtMSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3RleHR9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIHtzZWxlY3RlZEFjdGlvbiA9PT0gJ2dpdGh1YicgJiYgKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvblN1Y2Nlc3M9e25vb3B9XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2VsZWN0ZWRBY3Rpb24obnVsbCl9XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgICAge3NlbGVjdGVkQWN0aW9uID09PSAnbG9jYWwnICYmIHNlbGVjdGVkRmlsZVxuICAgICAgICAmJiAoXG4gICAgICAgICAgPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlXG4gICAgICAgICAgICBmaWxlPXtzZWxlY3RlZEZpbGV9XG4gICAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRTZWxlY3RlZEFjdGlvbihudWxsKX1cbiAgICAgICAgICAgIG9uU3VjY2Vzcz17bm9vcH1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgey8qIHtwbHVnaW5MaXN0cy5tYXAoKGl0ZW06IGFueSkgPT4gKFxuICAgICAgICA8ZGl2IGtleT17aXRlbS5pZH0gb25DbGljaz17KCkgPT4gaGFuZGxlVW5pbnN0YWxsKGl0ZW0uaWQpfT57aXRlbS5uYW1lfSDljbjovb08L2Rpdj5cbiAgICAgICkpfSAqL31cbiAgICA8L1BvcnRhbFRvRm9sbG93RWxlbT5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbnN0YWxsUGx1Z2luRHJvcGRvd25cbiJdfQ==