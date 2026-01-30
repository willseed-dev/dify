"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const divider_1 = require("@/app/components/base/divider");
const communication_1 = require("@/app/components/base/icons/src/vender/solid/communication");
const utils_1 = require("@/app/components/base/image-uploader/utils");
const dify_logo_1 = require("@/app/components/base/logo/dify-logo");
const switch_1 = require("@/app/components/base/switch");
const toast_1 = require("@/app/components/base/toast");
const type_1 = require("@/app/components/billing/type");
const app_context_1 = require("@/context/app-context");
const global_public_context_1 = require("@/context/global-public-context");
const provider_context_1 = require("@/context/provider-context");
const common_1 = require("@/service/common");
const classnames_1 = require("@/utils/classnames");
const ALLOW_FILE_EXTENSIONS = ['svg', 'png'];
const CustomWebAppBrand = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, toast_1.useToastContext)();
    const { plan, enableBilling } = (0, provider_context_1.useProviderContext)();
    const { currentWorkspace, mutateCurrentWorkspace, isCurrentWorkspaceManager, } = (0, app_context_1.useAppContext)();
    const [fileId, setFileId] = (0, react_2.useState)('');
    const [imgKey, setImgKey] = (0, react_2.useState)(() => Date.now());
    const [uploadProgress, setUploadProgress] = (0, react_2.useState)(0);
    const systemFeatures = (0, global_public_context_1.useGlobalPublicStore)(s => s.systemFeatures);
    const isSandbox = enableBilling && plan.type === type_1.Plan.sandbox;
    const uploading = uploadProgress > 0 && uploadProgress < 100;
    const webappLogo = currentWorkspace.custom_config?.replace_webapp_logo || '';
    const webappBrandRemoved = currentWorkspace.custom_config?.remove_webapp_brand;
    const uploadDisabled = isSandbox || webappBrandRemoved || !isCurrentWorkspaceManager;
    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            notify({ type: 'error', message: t('imageUploader.uploadFromComputerLimit', { ns: 'common', size: 5 }) });
            return;
        }
        (0, utils_1.imageUpload)({
            file,
            onProgressCallback: (progress) => {
                setUploadProgress(progress);
            },
            onSuccessCallback: (res) => {
                setUploadProgress(100);
                setFileId(res.id);
            },
            onErrorCallback: (error) => {
                const errorMessage = (0, utils_1.getImageUploadErrorMessage)(error, t('imageUploader.uploadFromComputerUploadError', { ns: 'common' }), t);
                notify({ type: 'error', message: errorMessage });
                setUploadProgress(-1);
            },
        }, false, '/workspaces/custom-config/webapp-logo/upload');
    };
    const handleApply = async () => {
        await (0, common_1.updateCurrentWorkspace)({
            url: '/workspaces/custom-config',
            body: {
                remove_webapp_brand: webappBrandRemoved,
                replace_webapp_logo: fileId,
            },
        });
        mutateCurrentWorkspace();
        setFileId('');
        setImgKey(Date.now());
    };
    const handleRestore = async () => {
        await (0, common_1.updateCurrentWorkspace)({
            url: '/workspaces/custom-config',
            body: {
                remove_webapp_brand: false,
                replace_webapp_logo: '',
            },
        });
        mutateCurrentWorkspace();
    };
    const handleSwitch = async (checked) => {
        await (0, common_1.updateCurrentWorkspace)({
            url: '/workspaces/custom-config',
            body: {
                remove_webapp_brand: checked,
            },
        });
        mutateCurrentWorkspace();
    };
    const handleCancel = () => {
        setFileId('');
        setUploadProgress(0);
    };
    return (<div className="py-4">
      <div className="system-md-medium mb-2 flex items-center justify-between rounded-xl bg-background-section-burn p-4 text-text-primary">
        {t('webapp.removeBrand', { ns: 'custom' })}
        <switch_1.default size="l" defaultValue={webappBrandRemoved} disabled={isSandbox || !isCurrentWorkspaceManager} onChange={handleSwitch}/>
      </div>
      <div className={(0, classnames_1.cn)('flex h-14 items-center justify-between rounded-xl bg-background-section-burn px-4', webappBrandRemoved && 'opacity-30')}>
        <div>
          <div className="system-md-medium text-text-primary">{t('webapp.changeLogo', { ns: 'custom' })}</div>
          <div className="system-xs-regular text-text-tertiary">{t('webapp.changeLogoTip', { ns: 'custom' })}</div>
        </div>
        <div className="flex items-center">
          {(!uploadDisabled && webappLogo && !webappBrandRemoved) && (<>
              <button_1.default variant="ghost" disabled={uploadDisabled || (!webappLogo && !webappBrandRemoved)} onClick={handleRestore}>
                {t('restore', { ns: 'custom' })}
              </button_1.default>
              <div className="mx-2 h-5 w-[1px] bg-divider-regular"></div>
            </>)}
          {!uploading && (<button_1.default className="relative mr-2" disabled={uploadDisabled}>
                <react_1.RiImageAddLine className="mr-1 h-4 w-4"/>
                {(webappLogo || fileId)
                ? t('change', { ns: 'custom' })
                : t('upload', { ns: 'custom' })}
                <input className={(0, classnames_1.cn)('absolute inset-0 block w-full text-[0] opacity-0', uploadDisabled ? 'cursor-not-allowed' : 'cursor-pointer')} onClick={e => e.target.value = ''} type="file" accept={ALLOW_FILE_EXTENSIONS.map(ext => `.${ext}`).join(',')} onChange={handleChange} disabled={uploadDisabled}/>
              </button_1.default>)}
          {uploading && (<button_1.default className="relative mr-2" disabled={true}>
                <react_1.RiLoader2Line className="mr-1 h-4 w-4 animate-spin"/>
                {t('uploading', { ns: 'custom' })}
              </button_1.default>)}
          {fileId && (<>
                <button_1.default className="mr-2" onClick={handleCancel} disabled={webappBrandRemoved || !isCurrentWorkspaceManager}>
                  {t('operation.cancel', { ns: 'common' })}
                </button_1.default>
                <button_1.default variant="primary" className="mr-2" onClick={handleApply} disabled={webappBrandRemoved || !isCurrentWorkspaceManager}>
                  {t('apply', { ns: 'custom' })}
                </button_1.default>
              </>)}
        </div>
      </div>
      {uploadProgress === -1 && (<div className="mt-2 text-xs text-[#D92D20]">{t('uploadedFail', { ns: 'custom' })}</div>)}
      <div className="mb-2 mt-5 flex items-center gap-2">
        <div className="system-xs-medium-uppercase shrink-0 text-text-tertiary">{t('overview.appInfo.preview', { ns: 'appOverview' })}</div>
        <divider_1.default bgStyle="gradient" className="grow"/>
      </div>
      <div className="relative mb-2 flex items-center gap-3">
        {/* chat card */}
        <div className="flex h-[320px] grow basis-1/2 overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border-subtle bg-background-default-burn">
          <div className="flex h-full w-[232px] shrink-0 flex-col p-1 pr-0">
            <div className="flex items-center gap-3 p-3 pr-2">
              <div className={(0, classnames_1.cn)('inline-flex h-8 w-8 items-center justify-center rounded-lg border border-divider-regular', 'bg-components-icon-bg-blue-light-solid')}>
                <communication_1.BubbleTextMod className="h-4 w-4 text-components-avatar-shape-fill-stop-100"/>
              </div>
              <div className="system-md-semibold grow text-text-secondary">Chatflow App</div>
              <div className="p-1.5">
                <react_1.RiLayoutLeft2Line className="h-4 w-4 text-text-tertiary"/>
              </div>
            </div>
            <div className="shrink-0 px-4 py-3">
              <button_1.default variant="secondary-accent" className="w-full justify-center">
                <react_1.RiEditBoxLine className="mr-1 h-4 w-4"/>
                <div className="p-1 opacity-20">
                  <div className="h-2 w-[94px] rounded-sm bg-text-accent-light-mode-only"></div>
                </div>
              </button_1.default>
            </div>
            <div className="grow px-3 pt-5">
              <div className="flex h-8 items-center px-3 py-1">
                <div className="h-2 w-14 rounded-sm bg-text-quaternary opacity-20"></div>
              </div>
              <div className="flex h-8 items-center px-3 py-1">
                <div className="h-2 w-[168px] rounded-sm bg-text-quaternary opacity-20"></div>
              </div>
              <div className="flex h-8 items-center px-3 py-1">
                <div className="h-2 w-[128px] rounded-sm bg-text-quaternary opacity-20"></div>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-between p-3">
              <div className="p-1.5">
                <react_1.RiEqualizer2Line className="h-4 w-4 text-text-tertiary"/>
              </div>
              <div className="flex items-center gap-1.5">
                {!webappBrandRemoved && (<>
                    <div className="system-2xs-medium-uppercase text-text-tertiary">POWERED BY</div>
                    {systemFeatures.branding.enabled && systemFeatures.branding.workspace_logo
                ? <img src={systemFeatures.branding.workspace_logo} alt="logo" className="block h-5 w-auto"/>
                : webappLogo
                    ? <img src={`${webappLogo}?hash=${imgKey}`} alt="logo" className="block h-5 w-auto"/>
                    : <dify_logo_1.default size="small"/>}
                  </>)}
              </div>
            </div>
          </div>
          <div className="flex w-[138px] grow flex-col justify-between p-2 pr-0">
            <div className="flex grow flex-col justify-between rounded-l-2xl border-[0.5px] border-r-0 border-components-panel-border-subtle bg-chatbot-bg pb-4 pl-[22px] pt-16">
              <div className="w-[720px] rounded-2xl border border-divider-subtle bg-chat-bubble-bg px-4 py-3">
                <div className="body-md-regular mb-1 text-text-primary">Hello! How can I assist you today?</div>
                <button_1.default size="small">
                  <div className="h-2 w-[144px] rounded-sm bg-text-quaternary opacity-20"></div>
                </button_1.default>
              </div>
              <div className="body-lg-regular flex h-[52px] w-[578px] items-center rounded-xl border border-components-chat-input-border bg-components-panel-bg-blur pl-3.5 text-text-placeholder shadow-md backdrop-blur-sm">Talk to Dify</div>
            </div>
          </div>
        </div>
        {/* workflow card */}
        <div className="flex h-[320px] grow basis-1/2 flex-col overflow-hidden rounded-2xl border-[0.5px] border-components-panel-border-subtle bg-background-default-burn">
          <div className="w-full border-b-[0.5px] border-divider-subtle p-4 pb-0">
            <div className="mb-2 flex items-center gap-3">
              <div className={(0, classnames_1.cn)('inline-flex h-8 w-8 items-center justify-center rounded-lg border border-divider-regular', 'bg-components-icon-bg-indigo-solid')}>
                <react_1.RiExchange2Fill className="h-4 w-4 text-components-avatar-shape-fill-stop-100"/>
              </div>
              <div className="system-md-semibold grow text-text-secondary">Workflow App</div>
              <div className="p-1.5">
                <react_1.RiLayoutLeft2Line className="h-4 w-4 text-text-tertiary"/>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="system-md-semibold-uppercase flex h-10 shrink-0 items-center border-b-2 border-components-tab-active text-text-primary">RUN ONCE</div>
              <div className="system-md-semibold-uppercase flex h-10 grow items-center border-b-2 border-transparent text-text-tertiary">RUN BATCH</div>
            </div>
          </div>
          <div className="grow bg-components-panel-bg">
            <div className="p-4 pb-1">
              <div className="mb-1 py-2">
                <div className="h-2 w-20 rounded-sm bg-text-quaternary opacity-20"></div>
              </div>
              <div className="h-16 w-full rounded-lg bg-components-input-bg-normal "></div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <button_1.default size="small">
                <div className="h-2 w-10 rounded-sm bg-text-quaternary opacity-20"></div>
              </button_1.default>
              <button_1.default variant="primary" size="small" disabled>
                <react_1.RiPlayLargeLine className="mr-1 h-4 w-4"/>
                <span>Execute</span>
              </button_1.default>
            </div>
          </div>
          <div className="flex h-12 shrink-0 items-center gap-1.5 bg-components-panel-bg p-4 pt-3">
            {!webappBrandRemoved && (<>
                <div className="system-2xs-medium-uppercase text-text-tertiary">POWERED BY</div>
                {systemFeatures.branding.enabled && systemFeatures.branding.workspace_logo
                ? <img src={systemFeatures.branding.workspace_logo} alt="logo" className="block h-5 w-auto"/>
                : webappLogo
                    ? <img src={`${webappLogo}?hash=${imgKey}`} alt="logo" className="block h-5 w-auto"/>
                    : <dify_logo_1.default size="small"/>}
              </>)}
          </div>
        </div>
      </div>
    </div>);
};
exports.default = CustomWebAppBrand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw0Q0FReUI7QUFDekIsaUNBQWdDO0FBQ2hDLGlEQUE4QztBQUM5Qyx5REFBaUQ7QUFDakQsMkRBQW1EO0FBQ25ELDhGQUEwRjtBQUMxRixzRUFBb0c7QUFDcEcsb0VBQTJEO0FBQzNELHlEQUFpRDtBQUNqRCx1REFBNkQ7QUFDN0Qsd0RBQW9EO0FBQ3BELHVEQUFxRDtBQUNyRCwyRUFBc0U7QUFDdEUsaUVBQStEO0FBQy9ELDZDQUV5QjtBQUN6QixtREFBdUM7QUFFdkMsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUU1QyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRTtJQUM3QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsdUJBQWUsR0FBRSxDQUFBO0lBQ3BDLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEdBQUcsSUFBQSxxQ0FBa0IsR0FBRSxDQUFBO0lBQ3BELE1BQU0sRUFDSixnQkFBZ0IsRUFDaEIsc0JBQXNCLEVBQ3RCLHlCQUF5QixHQUMxQixHQUFHLElBQUEsMkJBQWEsR0FBRSxDQUFBO0lBQ25CLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3hDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBQ3RELE1BQU0sQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdkQsTUFBTSxjQUFj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Q0FDckI7Y0FBQSxFQUFFLGdCQUFNLENBQ1Y7WUFBQSxFQUFFLEdBQUcsQ0FDUDtVQUFBLEVBQUUsR0FBRyxDQUNMO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlFQUF5RSxDQUN0RjtZQUFBLENBQUMsQ0FBQyxrQkFBa0IsSUFBSSxDQUN0QixFQUNFO2dCQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnREFBZ0QsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUMvRTtnQkFBQSxDQUNFLGNBQWMsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsY0FBYztnQkFDdkUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsa0JBQWtCLEVBQUc7Z0JBQzlGLENBQUMsQ0FBQyxVQUFVO29CQUNWLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLFVBQVUsU0FBUyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFHO29CQUN0RixDQUFDLENBQUMsQ0FBQyxtQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQzlCLENBQ0Y7Y0FBQSxHQUFHLENBQ0osQ0FDSDtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLGlCQUFpQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDaGFuZ2VFdmVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHtcbiAgUmlFZGl0Qm94TGluZSxcbiAgUmlFcXVhbGl6ZXIyTGluZSxcbiAgUmlFeGNoYW5nZTJGaWxsLFxuICBSaUltYWdlQWRkTGluZSxcbiAgUmlMYXlvdXRMZWZ0MkxpbmUsXG4gIFJpTG9hZGVyMkxpbmUsXG4gIFJpUGxheUxhcmdlTGluZSxcbn0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCB7IEJ1YmJsZVRleHRNb2QgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9jb21tdW5pY2F0aW9uJ1xuaW1wb3J0IHsgZ2V0SW1hZ2VVcGxvYWRFcnJvck1lc3NhZ2UsIGltYWdlVXBsb2FkIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ltYWdlLXVwbG9hZGVyL3V0aWxzJ1xuaW1wb3J0IERpZnlMb2dvIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2dvL2RpZnktbG9nbydcbmltcG9ydCBTd2l0Y2ggZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3N3aXRjaCdcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IFBsYW4gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2JpbGxpbmcvdHlwZSdcbmltcG9ydCB7IHVzZUFwcENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvYXBwLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VHbG9iYWxQdWJsaWNTdG9yZSB9IGZyb20gJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VQcm92aWRlckNvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB7XG4gIHVwZGF0ZUN1cnJlbnRXb3Jrc3BhY2UsXG59IGZyb20gJ0Avc2VydmljZS9jb21tb24nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcblxuY29uc3QgQUxMT1dfRklMRV9FWFRFTlNJT05TID0gWydzdmcnLCAncG5nJ11cblxuY29uc3QgQ3VzdG9tV2ViQXBwQnJhbmQgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCB7IG5vdGlmeSB9ID0gdXNlVG9hc3RDb250ZXh0KClcbiAgY29uc3QgeyBwbGFuLCBlbmFibGVCaWxsaW5nIH0gPSB1c2VQcm92aWRlckNvbnRleHQoKVxuICBjb25zdCB7XG4gICAgY3VycmVudFdvcmtzcGFjZSxcbiAgICBtdXRhdGVDdXJyZW50V29ya3NwYWNlLFxuICAgIGlzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXIsXG4gIH0gPSB1c2VBcHBDb250ZXh0KClcbiAgY29uc3QgW2ZpbGVJZCwgc2V0RmlsZUlkXSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbaW1nS2V5LCBzZXRJbWdLZXldID0gdXNlU3RhdGUoKCkgPT4gRGF0ZS5ub3coKSlcbiAgY29uc3QgW3VwbG9hZFByb2dyZXNzLCBzZXRVcGxvYWRQcm9ncmVzc10gPSB1c2VTdGF0ZSgwKVxuICBjb25zdCBzeXN0ZW1GZWF0dXJlcyA9IHVzZUdsb2JhbFB1YmxpY1N0b3JlKHMgPT4gcy5zeXN0ZW1GZWF0dXJlcylcbiAgY29uc3QgaXNTYW5kYm94ID0gZW5hYmxlQmlsbGluZyAmJiBwbGFuLnR5cGUgPT09IFBsYW4uc2FuZGJveFxuICBjb25zdCB1cGxvYWRpbmcgPSB1cGxvYWRQcm9ncmVzcyA+IDAgJiYgdXBsb2FkUHJvZ3Jlc3MgPCAxMDBcbiAgY29uc3Qgd2ViYXBwTG9nbyA9IGN1cnJlbnRXb3Jrc3BhY2UuY3VzdG9tX2NvbmZpZz8ucmVwbGFjZV93ZWJhcHBfbG9nbyB8fCAnJ1xuICBjb25zdCB3ZWJhcHBCcmFuZFJlbW92ZWQgPSBjdXJyZW50V29ya3NwYWNlLmN1c3RvbV9jb25maWc/LnJlbW92ZV93ZWJhcHBfYnJhbmRcbiAgY29uc3QgdXBsb2FkRGlzYWJsZWQgPSBpc1NhbmRib3ggfHwgd2ViYXBwQnJhbmRSZW1vdmVkIHx8ICFpc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyXG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gKGU6IENoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzPy5bMF1cblxuICAgIGlmICghZmlsZSlcbiAgICAgIHJldHVyblxuXG4gICAgaWYgKGZpbGUuc2l6ZSA+IDUgKiAxMDI0ICogMTAyNCkge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnaW1hZ2VVcGxvYWRlci51cGxvYWRGcm9tQ29tcHV0ZXJMaW1pdCcsIHsgbnM6ICdjb21tb24nLCBzaXplOiA1IH0pIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpbWFnZVVwbG9hZCh7XG4gICAgICBmaWxlLFxuICAgICAgb25Qcm9ncmVzc0NhbGxiYWNrOiAocHJvZ3Jlc3MpID0+IHtcbiAgICAgICAgc2V0VXBsb2FkUHJvZ3Jlc3MocHJvZ3Jlc3MpXG4gICAgICB9LFxuICAgICAgb25TdWNjZXNzQ2FsbGJhY2s6IChyZXMpID0+IHtcbiAgICAgICAgc2V0VXBsb2FkUHJvZ3Jlc3MoMTAwKVxuICAgICAgICBzZXRGaWxlSWQocmVzLmlkKVxuICAgICAgfSxcbiAgICAgIG9uRXJyb3JDYWxsYmFjazogKGVycm9yPzogYW55KSA9PiB7XG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGdldEltYWdlVXBsb2FkRXJyb3JNZXNzYWdlKGVycm9yLCB0KCdpbWFnZVVwbG9hZGVyLnVwbG9hZEZyb21Db21wdXRlclVwbG9hZEVycm9yJywgeyBuczogJ2NvbW1vbicgfSksIHQgYXMgYW55KVxuICAgICAgICBub3RpZnkoeyB0eXBlOiAnZXJyb3InLCBtZXNzYWdlOiBlcnJvck1lc3NhZ2UgfSlcbiAgICAgICAgc2V0VXBsb2FkUHJvZ3Jlc3MoLTEpXG4gICAgICB9LFxuICAgIH0sIGZhbHNlLCAnL3dvcmtzcGFjZXMvY3VzdG9tLWNvbmZpZy93ZWJhcHAtbG9nby91cGxvYWQnKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQXBwbHkgPSBhc3luYyAoKSA9PiB7XG4gICAgYXdhaXQgdXBkYXRlQ3VycmVudFdvcmtzcGFjZSh7XG4gICAgICB1cmw6ICcvd29ya3NwYWNlcy9jdXN0b20tY29uZmlnJyxcbiAgICAgIGJvZHk6IHtcbiAgICAgICAgcmVtb3ZlX3dlYmFwcF9icmFuZDogd2ViYXBwQnJhbmRSZW1vdmVkLFxuICAgICAgICByZXBsYWNlX3dlYmFwcF9sb2dvOiBmaWxlSWQsXG4gICAgICB9LFxuICAgIH0pXG4gICAgbXV0YXRlQ3VycmVudFdvcmtzcGFjZSgpXG4gICAgc2V0RmlsZUlkKCcnKVxuICAgIHNldEltZ0tleShEYXRlLm5vdygpKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlUmVzdG9yZSA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCB1cGRhdGVDdXJyZW50V29ya3NwYWNlKHtcbiAgICAgIHVybDogJy93b3Jrc3BhY2VzL2N1c3RvbS1jb25maWcnLFxuICAgICAgYm9keToge1xuICAgICAgICByZW1vdmVfd2ViYXBwX2JyYW5kOiBmYWxzZSxcbiAgICAgICAgcmVwbGFjZV93ZWJhcHBfbG9nbzogJycsXG4gICAgICB9LFxuICAgIH0pXG4gICAgbXV0YXRlQ3VycmVudFdvcmtzcGFjZSgpXG4gIH1cblxuICBjb25zdCBoYW5kbGVTd2l0Y2ggPSBhc3luYyAoY2hlY2tlZDogYm9vbGVhbikgPT4ge1xuICAgIGF3YWl0IHVwZGF0ZUN1cnJlbnRXb3Jrc3BhY2Uoe1xuICAgICAgdXJsOiAnL3dvcmtzcGFjZXMvY3VzdG9tLWNvbmZpZycsXG4gICAgICBib2R5OiB7XG4gICAgICAgIHJlbW92ZV93ZWJhcHBfYnJhbmQ6IGNoZWNrZWQsXG4gICAgICB9LFxuICAgIH0pXG4gICAgbXV0YXRlQ3VycmVudFdvcmtzcGFjZSgpXG4gIH1cblxuICBjb25zdCBoYW5kbGVDYW5jZWwgPSAoKSA9PiB7XG4gICAgc2V0RmlsZUlkKCcnKVxuICAgIHNldFVwbG9hZFByb2dyZXNzKDApXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicHktNFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtbWVkaXVtIG1iLTIgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQteGwgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcC00IHRleHQtdGV4dC1wcmltYXJ5XCI+XG4gICAgICAgIHt0KCd3ZWJhcHAucmVtb3ZlQnJhbmQnLCB7IG5zOiAnY3VzdG9tJyB9KX1cbiAgICAgICAgPFN3aXRjaFxuICAgICAgICAgIHNpemU9XCJsXCJcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e3dlYmFwcEJyYW5kUmVtb3ZlZH1cbiAgICAgICAgICBkaXNhYmxlZD17aXNTYW5kYm94IHx8ICFpc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyfVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVTd2l0Y2h9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCBoLTE0IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcm91bmRlZC14bCBiZy1iYWNrZ3JvdW5kLXNlY3Rpb24tYnVybiBweC00Jywgd2ViYXBwQnJhbmRSZW1vdmVkICYmICdvcGFjaXR5LTMwJyl9PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLW1kLW1lZGl1bSB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KCd3ZWJhcHAuY2hhbmdlTG9nbycsIHsgbnM6ICdjdXN0b20nIH0pfTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3QoJ3dlYmFwcC5jaGFuZ2VMb2dvVGlwJywgeyBuczogJ2N1c3RvbScgfSl9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgeyghdXBsb2FkRGlzYWJsZWQgJiYgd2ViYXBwTG9nbyAmJiAhd2ViYXBwQnJhbmRSZW1vdmVkKSAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgdmFyaWFudD1cImdob3N0XCJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17dXBsb2FkRGlzYWJsZWQgfHwgKCF3ZWJhcHBMb2dvICYmICF3ZWJhcHBCcmFuZFJlbW92ZWQpfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlc3RvcmV9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7dCgncmVzdG9yZScsIHsgbnM6ICdjdXN0b20nIH0pfVxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJteC0yIGgtNSB3LVsxcHhdIGJnLWRpdmlkZXItcmVndWxhclwiPjwvZGl2PlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICB7XG4gICAgICAgICAgICAhdXBsb2FkaW5nICYmIChcbiAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIG1yLTJcIlxuICAgICAgICAgICAgICAgIGRpc2FibGVkPXt1cGxvYWREaXNhYmxlZH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxSaUltYWdlQWRkTGluZSBjbGFzc05hbWU9XCJtci0xIGgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICh3ZWJhcHBMb2dvIHx8IGZpbGVJZClcbiAgICAgICAgICAgICAgICAgICAgPyB0KCdjaGFuZ2UnLCB7IG5zOiAnY3VzdG9tJyB9KVxuICAgICAgICAgICAgICAgICAgICA6IHQoJ3VwbG9hZCcsIHsgbnM6ICdjdXN0b20nIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjbignYWJzb2x1dGUgaW5zZXQtMCBibG9jayB3LWZ1bGwgdGV4dC1bMF0gb3BhY2l0eS0wJywgdXBsb2FkRGlzYWJsZWQgPyAnY3Vyc29yLW5vdC1hbGxvd2VkJyA6ICdjdXJzb3ItcG9pbnRlcicpfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiAoZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgPSAnJ31cbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgICAgIGFjY2VwdD17QUxMT1dfRklMRV9FWFRFTlNJT05TLm1hcChleHQgPT4gYC4ke2V4dH1gKS5qb2luKCcsJyl9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e3VwbG9hZERpc2FibGVkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cGxvYWRpbmcgJiYgKFxuICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicmVsYXRpdmUgbXItMlwiXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RydWV9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8UmlMb2FkZXIyTGluZSBjbGFzc05hbWU9XCJtci0xIGgtNCB3LTQgYW5pbWF0ZS1zcGluXCIgLz5cbiAgICAgICAgICAgICAgICB7dCgndXBsb2FkaW5nJywgeyBuczogJ2N1c3RvbScgfSl9XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgICB7XG4gICAgICAgICAgICBmaWxlSWQgJiYgKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTJcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQ2FuY2VsfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e3dlYmFwcEJyYW5kUmVtb3ZlZCB8fCAhaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlcn1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7dCgnb3BlcmF0aW9uLmNhbmNlbCcsIHsgbnM6ICdjb21tb24nIH0pfVxuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTJcIlxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQXBwbHl9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17d2ViYXBwQnJhbmRSZW1vdmVkIHx8ICFpc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHt0KCdhcHBseScsIHsgbnM6ICdjdXN0b20nIH0pfVxuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7dXBsb2FkUHJvZ3Jlc3MgPT09IC0xICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0yIHRleHQteHMgdGV4dC1bI0Q5MkQyMF1cIj57dCgndXBsb2FkZWRGYWlsJywgeyBuczogJ2N1c3RvbScgfSl9PC9kaXY+XG4gICAgICApfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIG10LTUgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtbWVkaXVtLXVwcGVyY2FzZSBzaHJpbmstMCB0ZXh0LXRleHQtdGVydGlhcnlcIj57dCgnb3ZlcnZpZXcuYXBwSW5mby5wcmV2aWV3JywgeyBuczogJ2FwcE92ZXJ2aWV3JyB9KX08L2Rpdj5cbiAgICAgICAgPERpdmlkZXIgYmdTdHlsZT1cImdyYWRpZW50XCIgY2xhc3NOYW1lPVwiZ3Jvd1wiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgbWItMiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICB7LyogY2hhdCBjYXJkICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1bMzIwcHhdIGdyb3cgYmFzaXMtMS8yIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLTJ4bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdC1idXJuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtZnVsbCB3LVsyMzJweF0gc2hyaW5rLTAgZmxleC1jb2wgcC0xIHByLTBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgcC0zIHByLTJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKCdpbmxpbmUtZmxleCBoLTggdy04IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1yZWd1bGFyJywgJ2JnLWNvbXBvbmVudHMtaWNvbi1iZy1ibHVlLWxpZ2h0LXNvbGlkJyl9PlxuICAgICAgICAgICAgICAgIDxCdWJibGVUZXh0TW9kIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC1jb21wb25lbnRzLWF2YXRhci1zaGFwZS1maWxsLXN0b3AtMTAwXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLW1kLXNlbWlib2xkIGdyb3cgdGV4dC10ZXh0LXNlY29uZGFyeVwiPkNoYXRmbG93IEFwcDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMS41XCI+XG4gICAgICAgICAgICAgICAgPFJpTGF5b3V0TGVmdDJMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hyaW5rLTAgcHgtNCBweS0zXCI+XG4gICAgICAgICAgICAgIDxCdXR0b24gdmFyaWFudD1cInNlY29uZGFyeS1hY2NlbnRcIiBjbGFzc05hbWU9XCJ3LWZ1bGwganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICA8UmlFZGl0Qm94TGluZSBjbGFzc05hbWU9XCJtci0xIGgtNCB3LTRcIiAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0xIG9wYWNpdHktMjBcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0yIHctWzk0cHhdIHJvdW5kZWQtc20gYmctdGV4dC1hY2NlbnQtbGlnaHQtbW9kZS1vbmx5XCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyb3cgcHgtMyBwdC01XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTggaXRlbXMtY2VudGVyIHB4LTMgcHktMVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0yIHctMTQgcm91bmRlZC1zbSBiZy10ZXh0LXF1YXRlcm5hcnkgb3BhY2l0eS0yMFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtOCBpdGVtcy1jZW50ZXIgcHgtMyBweS0xXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTIgdy1bMTY4cHhdIHJvdW5kZWQtc20gYmctdGV4dC1xdWF0ZXJuYXJ5IG9wYWNpdHktMjBcIj48L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTggaXRlbXMtY2VudGVyIHB4LTMgcHktMVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0yIHctWzEyOHB4XSByb3VuZGVkLXNtIGJnLXRleHQtcXVhdGVybmFyeSBvcGFjaXR5LTIwXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc2hyaW5rLTAgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwLTNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTEuNVwiPlxuICAgICAgICAgICAgICAgIDxSaUVxdWFsaXplcjJMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgIHshd2ViYXBwQnJhbmRSZW1vdmVkICYmIChcbiAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLTJ4cy1tZWRpdW0tdXBwZXJjYXNlIHRleHQtdGV4dC10ZXJ0aWFyeVwiPlBPV0VSRUQgQlk8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHN5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLmVuYWJsZWQgJiYgc3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcud29ya3NwYWNlX2xvZ29cbiAgICAgICAgICAgICAgICAgICAgICAgID8gPGltZyBzcmM9e3N5c3RlbUZlYXR1cmVzLmJyYW5kaW5nLndvcmtzcGFjZV9sb2dvfSBhbHQ9XCJsb2dvXCIgY2xhc3NOYW1lPVwiYmxvY2sgaC01IHctYXV0b1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA6IHdlYmFwcExvZ29cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8aW1nIHNyYz17YCR7d2ViYXBwTG9nb30/aGFzaD0ke2ltZ0tleX1gfSBhbHQ9XCJsb2dvXCIgY2xhc3NOYW1lPVwiYmxvY2sgaC01IHctYXV0b1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogPERpZnlMb2dvIHNpemU9XCJzbWFsbFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctWzEzOHB4XSBncm93IGZsZXgtY29sIGp1c3RpZnktYmV0d2VlbiBwLTIgcHItMFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdyb3cgZmxleC1jb2wganVzdGlmeS1iZXR3ZWVuIHJvdW5kZWQtbC0yeGwgYm9yZGVyLVswLjVweF0gYm9yZGVyLXItMCBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXItc3VidGxlIGJnLWNoYXRib3QtYmcgcGItNCBwbC1bMjJweF0gcHQtMTZcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LVs3MjBweF0gcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jaGF0LWJ1YmJsZS1iZyBweC00IHB5LTNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJvZHktbWQtcmVndWxhciBtYi0xIHRleHQtdGV4dC1wcmltYXJ5XCI+SGVsbG8hIEhvdyBjYW4gSSBhc3Npc3QgeW91IHRvZGF5PzwvZGl2PlxuICAgICAgICAgICAgICAgIDxCdXR0b24gc2l6ZT1cInNtYWxsXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMiB3LVsxNDRweF0gcm91bmRlZC1zbSBiZy10ZXh0LXF1YXRlcm5hcnkgb3BhY2l0eS0yMFwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib2R5LWxnLXJlZ3VsYXIgZmxleCBoLVs1MnB4XSB3LVs1NzhweF0gaXRlbXMtY2VudGVyIHJvdW5kZWQteGwgYm9yZGVyIGJvcmRlci1jb21wb25lbnRzLWNoYXQtaW5wdXQtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmctYmx1ciBwbC0zLjUgdGV4dC10ZXh0LXBsYWNlaG9sZGVyIHNoYWRvdy1tZCBiYWNrZHJvcC1ibHVyLXNtXCI+VGFsayB0byBEaWZ5PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvKiB3b3JrZmxvdyBjYXJkICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1bMzIwcHhdIGdyb3cgYmFzaXMtMS8yIGZsZXgtY29sIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLTJ4bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdC1idXJuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyLWItWzAuNXB4XSBib3JkZXItZGl2aWRlci1zdWJ0bGUgcC00IHBiLTBcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y24oJ2lubGluZS1mbGV4IGgtOCB3LTggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXJlZ3VsYXInLCAnYmctY29tcG9uZW50cy1pY29uLWJnLWluZGlnby1zb2xpZCcpfT5cbiAgICAgICAgICAgICAgICA8UmlFeGNoYW5nZTJGaWxsIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC1jb21wb25lbnRzLWF2YXRhci1zaGFwZS1maWxsLXN0b3AtMTAwXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLW1kLXNlbWlib2xkIGdyb3cgdGV4dC10ZXh0LXNlY29uZGFyeVwiPldvcmtmbG93IEFwcDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMS41XCI+XG4gICAgICAgICAgICAgICAgPFJpTGF5b3V0TGVmdDJMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQtdXBwZXJjYXNlIGZsZXggaC0xMCBzaHJpbmstMCBpdGVtcy1jZW50ZXIgYm9yZGVyLWItMiBib3JkZXItY29tcG9uZW50cy10YWItYWN0aXZlIHRleHQtdGV4dC1wcmltYXJ5XCI+UlVOIE9OQ0U8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQtdXBwZXJjYXNlIGZsZXggaC0xMCBncm93IGl0ZW1zLWNlbnRlciBib3JkZXItYi0yIGJvcmRlci10cmFuc3BhcmVudCB0ZXh0LXRleHQtdGVydGlhcnlcIj5SVU4gQkFUQ0g8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JvdyBiZy1jb21wb25lbnRzLXBhbmVsLWJnXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCBwYi0xXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMSBweS0yXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTIgdy0yMCByb3VuZGVkLXNtIGJnLXRleHQtcXVhdGVybmFyeSBvcGFjaXR5LTIwXCI+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtMTYgdy1mdWxsIHJvdW5kZWQtbGcgYmctY29tcG9uZW50cy1pbnB1dC1iZy1ub3JtYWwgXCI+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB4LTQgcHktM1wiPlxuICAgICAgICAgICAgICA8QnV0dG9uIHNpemU9XCJzbWFsbFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC0yIHctMTAgcm91bmRlZC1zbSBiZy10ZXh0LXF1YXRlcm5hcnkgb3BhY2l0eS0yMFwiPjwvZGl2PlxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgPEJ1dHRvbiB2YXJpYW50PVwicHJpbWFyeVwiIHNpemU9XCJzbWFsbFwiIGRpc2FibGVkPlxuICAgICAgICAgICAgICAgIDxSaVBsYXlMYXJnZUxpbmUgY2xhc3NOYW1lPVwibXItMSBoLTQgdy00XCIgLz5cbiAgICAgICAgICAgICAgICA8c3Bhbj5FeGVjdXRlPC9zcGFuPlxuICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBoLTEyIHNocmluay0wIGl0ZW1zLWNlbnRlciBnYXAtMS41IGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC00IHB0LTNcIj5cbiAgICAgICAgICAgIHshd2ViYXBwQnJhbmRSZW1vdmVkICYmIChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS0yeHMtbWVkaXVtLXVwcGVyY2FzZSB0ZXh0LXRleHQtdGVydGlhcnlcIj5QT1dFUkVEIEJZPC9kaXY+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgc3lzdGVtRmVhdHVyZXMuYnJhbmRpbmcuZW5hYmxlZCAmJiBzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy53b3Jrc3BhY2VfbG9nb1xuICAgICAgICAgICAgICAgICAgICA/IDxpbWcgc3JjPXtzeXN0ZW1GZWF0dXJlcy5icmFuZGluZy53b3Jrc3BhY2VfbG9nb30gYWx0PVwibG9nb1wiIGNsYXNzTmFtZT1cImJsb2NrIGgtNSB3LWF1dG9cIiAvPlxuICAgICAgICAgICAgICAgICAgICA6IHdlYmFwcExvZ29cbiAgICAgICAgICAgICAgICAgICAgICA/IDxpbWcgc3JjPXtgJHt3ZWJhcHBMb2dvfT9oYXNoPSR7aW1nS2V5fWB9IGFsdD1cImxvZ29cIiBjbGFzc05hbWU9XCJibG9jayBoLTUgdy1hdXRvXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICA6IDxEaWZ5TG9nbyBzaXplPVwic21hbGxcIiAvPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEN1c3RvbVdlYkFwcEJyYW5kXG4iXX0=