"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const navigation_1 = require("next/navigation");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const divider_1 = require("@/app/components/base/divider");
const tracing_1 = require("@/app/components/base/icons/src/public/tracing");
const loading_1 = require("@/app/components/base/loading");
const toast_1 = require("@/app/components/base/toast");
const indicator_1 = require("@/app/components/header/indicator");
const app_context_1 = require("@/context/app-context");
const apps_1 = require("@/service/apps");
const classnames_1 = require("@/utils/classnames");
const config_button_1 = require("./config-button");
const tracing_icon_1 = require("./tracing-icon");
const type_1 = require("./type");
const I18N_PREFIX = 'tracing';
const Panel = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const pathname = (0, navigation_1.usePathname)();
    const matched = /\/app\/([^/]+)/.exec(pathname);
    const appId = (matched?.length && matched[1]) ? matched[1] : '';
    const { isCurrentWorkspaceEditor } = (0, app_context_1.useAppContext)();
    const readOnly = !isCurrentWorkspaceEditor;
    const [isLoaded, { setTrue: setLoaded, }] = (0, ahooks_1.useBoolean)(false);
    const [tracingStatus, setTracingStatus] = (0, react_2.useState)(null);
    const enabled = tracingStatus?.enabled || false;
    const handleTracingStatusChange = async (tracingStatus, noToast) => {
        await (0, apps_1.updateTracingStatus)({ appId, body: tracingStatus });
        setTracingStatus(tracingStatus);
        if (!noToast) {
            toast_1.default.notify({
                type: 'success',
                message: t('api.success', { ns: 'common' }),
            });
        }
    };
    const handleTracingEnabledChange = (enabled) => {
        handleTracingStatusChange({
            tracing_provider: tracingStatus?.tracing_provider || null,
            enabled,
        });
    };
    const handleChooseProvider = (provider) => {
        handleTracingStatusChange({
            tracing_provider: provider,
            enabled: true,
        });
    };
    const inUseTracingProvider = tracingStatus?.tracing_provider || null;
    const providerIconMap = {
        [type_1.TracingProvider.arize]: tracing_1.ArizeIcon,
        [type_1.TracingProvider.phoenix]: tracing_1.PhoenixIcon,
        [type_1.TracingProvider.langSmith]: tracing_1.LangsmithIcon,
        [type_1.TracingProvider.langfuse]: tracing_1.LangfuseIcon,
        [type_1.TracingProvider.opik]: tracing_1.OpikIcon,
        [type_1.TracingProvider.weave]: tracing_1.WeaveIcon,
        [type_1.TracingProvider.aliyun]: tracing_1.AliyunIcon,
        [type_1.TracingProvider.mlflow]: tracing_1.MlflowIcon,
        [type_1.TracingProvider.databricks]: tracing_1.DatabricksIcon,
        [type_1.TracingProvider.tencent]: tracing_1.TencentIcon,
    };
    const InUseProviderIcon = inUseTracingProvider ? providerIconMap[inUseTracingProvider] : undefined;
    const [arizeConfig, setArizeConfig] = (0, react_2.useState)(null);
    const [phoenixConfig, setPhoenixConfig] = (0, react_2.useState)(null);
    const [langSmithConfig, setLangSmithConfig] = (0, react_2.useState)(null);
    const [langFuseConfig, setLangFuseConfig] = (0, react_2.useState)(null);
    const [opikConfig, setOpikConfig] = (0, react_2.useState)(null);
    const [weaveConfig, setWeaveConfig] = (0, react_2.useState)(null);
    const [aliyunConfig, setAliyunConfig] = (0, react_2.useState)(null);
    const [mlflowConfig, setMLflowConfig] = (0, react_2.useState)(null);
    const [databricksConfig, setDatabricksConfig] = (0, react_2.useState)(null);
    const [tencentConfig, setTencentConfig] = (0, react_2.useState)(null);
    const hasConfiguredTracing = !!(langSmithConfig || langFuseConfig || opikConfig || weaveConfig || arizeConfig || phoenixConfig || aliyunConfig || mlflowConfig || databricksConfig || tencentConfig);
    const fetchTracingConfig = async () => {
        const getArizeConfig = async () => {
            const { tracing_config: arizeConfig, has_not_configured: arizeHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.arize });
            if (!arizeHasNotConfig)
                setArizeConfig(arizeConfig);
        };
        const getPhoenixConfig = async () => {
            const { tracing_config: phoenixConfig, has_not_configured: phoenixHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.phoenix });
            if (!phoenixHasNotConfig)
                setPhoenixConfig(phoenixConfig);
        };
        const getLangSmithConfig = async () => {
            const { tracing_config: langSmithConfig, has_not_configured: langSmithHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.langSmith });
            if (!langSmithHasNotConfig)
                setLangSmithConfig(langSmithConfig);
        };
        const getLangFuseConfig = async () => {
            const { tracing_config: langFuseConfig, has_not_configured: langFuseHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.langfuse });
            if (!langFuseHasNotConfig)
                setLangFuseConfig(langFuseConfig);
        };
        const getOpikConfig = async () => {
            const { tracing_config: opikConfig, has_not_configured: OpikHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.opik });
            if (!OpikHasNotConfig)
                setOpikConfig(opikConfig);
        };
        const getWeaveConfig = async () => {
            const { tracing_config: weaveConfig, has_not_configured: weaveHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.weave });
            if (!weaveHasNotConfig)
                setWeaveConfig(weaveConfig);
        };
        const getAliyunConfig = async () => {
            const { tracing_config: aliyunConfig, has_not_configured: aliyunHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.aliyun });
            if (!aliyunHasNotConfig)
                setAliyunConfig(aliyunConfig);
        };
        const getMLflowConfig = async () => {
            const { tracing_config: mlflowConfig, has_not_configured: mlflowHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.mlflow });
            if (!mlflowHasNotConfig)
                setMLflowConfig(mlflowConfig);
        };
        const getDatabricksConfig = async () => {
            const { tracing_config: databricksConfig, has_not_configured: databricksHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.databricks });
            if (!databricksHasNotConfig)
                setDatabricksConfig(databricksConfig);
        };
        const getTencentConfig = async () => {
            const { tracing_config: tencentConfig, has_not_configured: tencentHasNotConfig } = await (0, apps_1.fetchTracingConfig)({ appId, provider: type_1.TracingProvider.tencent });
            if (!tencentHasNotConfig)
                setTencentConfig(tencentConfig);
        };
        Promise.all([
            getArizeConfig(),
            getPhoenixConfig(),
            getLangSmithConfig(),
            getLangFuseConfig(),
            getOpikConfig(),
            getWeaveConfig(),
            getAliyunConfig(),
            getMLflowConfig(),
            getDatabricksConfig(),
            getTencentConfig(),
        ]);
    };
    const handleTracingConfigUpdated = async (provider) => {
        // call api to hide secret key value
        const { tracing_config } = await (0, apps_1.fetchTracingConfig)({ appId, provider });
        if (provider === type_1.TracingProvider.arize)
            setArizeConfig(tracing_config);
        else if (provider === type_1.TracingProvider.phoenix)
            setPhoenixConfig(tracing_config);
        else if (provider === type_1.TracingProvider.langSmith)
            setLangSmithConfig(tracing_config);
        else if (provider === type_1.TracingProvider.langfuse)
            setLangFuseConfig(tracing_config);
        else if (provider === type_1.TracingProvider.opik)
            setOpikConfig(tracing_config);
        else if (provider === type_1.TracingProvider.weave)
            setWeaveConfig(tracing_config);
        else if (provider === type_1.TracingProvider.aliyun)
            setAliyunConfig(tracing_config);
        else if (provider === type_1.TracingProvider.tencent)
            setTencentConfig(tracing_config);
    };
    const handleTracingConfigRemoved = (provider) => {
        if (provider === type_1.TracingProvider.arize)
            setArizeConfig(null);
        else if (provider === type_1.TracingProvider.phoenix)
            setPhoenixConfig(null);
        else if (provider === type_1.TracingProvider.langSmith)
            setLangSmithConfig(null);
        else if (provider === type_1.TracingProvider.langfuse)
            setLangFuseConfig(null);
        else if (provider === type_1.TracingProvider.opik)
            setOpikConfig(null);
        else if (provider === type_1.TracingProvider.weave)
            setWeaveConfig(null);
        else if (provider === type_1.TracingProvider.aliyun)
            setAliyunConfig(null);
        else if (provider === type_1.TracingProvider.mlflow)
            setMLflowConfig(null);
        else if (provider === type_1.TracingProvider.databricks)
            setDatabricksConfig(null);
        else if (provider === type_1.TracingProvider.tencent)
            setTencentConfig(null);
        if (provider === inUseTracingProvider) {
            handleTracingStatusChange({
                enabled: false,
                tracing_provider: null,
            }, true);
        }
    };
    (0, react_2.useEffect)(() => {
        (async () => {
            const tracingStatus = await (0, apps_1.fetchTracingStatus)({ appId });
            setTracingStatus(tracingStatus);
            await fetchTracingConfig();
            setLoaded();
        })();
    }, []);
    if (!isLoaded) {
        return (<div className="mb-3 flex items-center justify-between">
        <div className="w-[200px]">
          <loading_1.default />
        </div>
      </div>);
    }
    return (<div className={(0, classnames_1.cn)('flex items-center justify-between')}>
      {!inUseTracingProvider && (<config_button_1.default appId={appId} readOnly={readOnly} hasConfigured={false} enabled={enabled} onStatusChange={handleTracingEnabledChange} chosenProvider={inUseTracingProvider} onChooseProvider={handleChooseProvider} arizeConfig={arizeConfig} phoenixConfig={phoenixConfig} langSmithConfig={langSmithConfig} langFuseConfig={langFuseConfig} opikConfig={opikConfig} weaveConfig={weaveConfig} aliyunConfig={aliyunConfig} mlflowConfig={mlflowConfig} databricksConfig={databricksConfig} tencentConfig={tencentConfig} onConfigUpdated={handleTracingConfigUpdated} onConfigRemoved={handleTracingConfigRemoved}>
          <div className={(0, classnames_1.cn)('flex cursor-pointer select-none items-center rounded-xl border-l-[0.5px] border-t border-effects-highlight bg-background-default-dodge p-2 shadow-xs hover:border-effects-highlight-lightmode-off hover:bg-background-default-lighter')}>
            <tracing_icon_1.default size="md"/>
            <div className="system-sm-semibold mx-2 text-text-secondary">{t(`${I18N_PREFIX}.title`, { ns: 'app' })}</div>
            <div className="rounded-md p-1">
              <react_1.RiEqualizer2Line className="h-4 w-4 text-text-tertiary"/>
            </div>
            <divider_1.default type="vertical" className="h-3.5"/>
            <div className="rounded-md p-1">
              <react_1.RiArrowDownDoubleLine className="h-4 w-4 text-text-tertiary"/>
            </div>
          </div>
        </config_button_1.default>)}
      {hasConfiguredTracing && (<config_button_1.default appId={appId} readOnly={readOnly} hasConfigured enabled={enabled} onStatusChange={handleTracingEnabledChange} chosenProvider={inUseTracingProvider} onChooseProvider={handleChooseProvider} arizeConfig={arizeConfig} phoenixConfig={phoenixConfig} langSmithConfig={langSmithConfig} langFuseConfig={langFuseConfig} opikConfig={opikConfig} weaveConfig={weaveConfig} aliyunConfig={aliyunConfig} mlflowConfig={mlflowConfig} databricksConfig={databricksConfig} tencentConfig={tencentConfig} onConfigUpdated={handleTracingConfigUpdated} onConfigRemoved={handleTracingConfigRemoved}>
          <div className={(0, classnames_1.cn)('flex cursor-pointer select-none items-center rounded-xl border-l-[0.5px] border-t border-effects-highlight bg-background-default-dodge p-2 shadow-xs hover:border-effects-highlight-lightmode-off hover:bg-background-default-lighter')}>
            <div className="ml-4 mr-1 flex items-center">
              <indicator_1.default color={enabled ? 'green' : 'gray'}/>
              <div className="system-xs-semibold-uppercase ml-1.5 text-text-tertiary">
                {t(`${I18N_PREFIX}.${enabled ? 'enabled' : 'disabled'}`, { ns: 'app' })}
              </div>
            </div>
            {InUseProviderIcon && <InUseProviderIcon className="ml-1 h-4"/>}
            <div className="ml-2 rounded-md p-1">
              <react_1.RiEqualizer2Line className="h-4 w-4 text-text-tertiary"/>
            </div>
            <divider_1.default type="vertical" className="h-3.5"/>
          </div>
        </config_button_1.default>)}
    </div>);
};
exports.default = React.memo(Panel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwYW5lbC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFJWiw0Q0FHeUI7QUFDekIsbUNBQW1DO0FBQ25DLGdEQUE2QztBQUM3QywrQkFBOEI7QUFDOUIsaUNBQTJDO0FBQzNDLGlEQUE4QztBQUM5QywyREFBbUQ7QUFDbkQsNEVBQThMO0FBQzlMLDJEQUFtRDtBQUNuRCx1REFBK0M7QUFDL0MsaUVBQXlEO0FBQ3pELHVEQUFxRDtBQUNyRCx5Q0FBb0g7QUFDcEgsbURBQXVDO0FBQ3ZDLG1EQUEwQztBQUMxQyxpREFBd0M7QUFDeEMsaUNBQXdDO0FBRXhDLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQTtBQUU3QixNQUFNLEtBQUssR0FBTyxHQUFHLEVBQUU7SUFDckIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUEsd0JBQVcsR0FBRSxDQUFBO0lBQzlCLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMvQyxNQUFNLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO0lBQy9ELE1BQU0sRUFBRSx3QkFBd0IsRUFBRSxHQUFHLElBQUEsMkJBQWEsR0FBRSxDQUFBO0lBQ3BELE1BQU0sUUFBUSxHQUFHLENBQUMsd0JBQXdCLENBQUE7SUFFMUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUNmLE9BQU8sRUFBRSxTQUFTLEdBQ25CLENBQUMsR0FBRyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFFdEIsTUFBTSxDQUFDLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxH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QUFDLDBCQUEwQixDQUFDLENBRTVDO1VBQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQ1gsdU9BQXVPLENBQ3hPLENBQUMsQ0FFRjtZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FDMUM7Y0FBQSxDQUFDLG1CQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUM3QztjQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3REFBd0QsQ0FDckU7Z0JBQUEsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFXLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQ3pFO2NBQUEsRUFBRSxHQUFHLENBQ1A7WUFBQSxFQUFFLEdBQUcsQ0FDTDtZQUFBLENBQUMsaUJBQWlCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFHLENBQ2hFO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUNsQztjQUFBLENBQUMsd0JBQWdCLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUMxRDtZQUFBLEVBQUUsR0FBRyxDQUNMO1lBQUEsQ0FBQyxpQkFBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFDNUM7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsdUJBQVksQ0FBQyxDQUNoQixDQUNIO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHR5cGUgeyBBbGl5dW5Db25maWcsIEFyaXplQ29uZmlnLCBEYXRhYnJpY2tzQ29uZmlnLCBMYW5nRnVzZUNvbmZpZywgTGFuZ1NtaXRoQ29uZmlnLCBNTGZsb3dDb25maWcsIE9waWtDb25maWcsIFBob2VuaXhDb25maWcsIFRlbmNlbnRDb25maWcsIFdlYXZlQ29uZmlnIH0gZnJvbSAnLi90eXBlJ1xuaW1wb3J0IHR5cGUgeyBUcmFjaW5nU3RhdHVzIH0gZnJvbSAnQC9tb2RlbHMvYXBwJ1xuaW1wb3J0IHtcbiAgUmlBcnJvd0Rvd25Eb3VibGVMaW5lLFxuICBSaUVxdWFsaXplcjJMaW5lLFxufSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlQm9vbGVhbiB9IGZyb20gJ2Fob29rcydcbmltcG9ydCB7IHVzZVBhdGhuYW1lIH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgRGl2aWRlciBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZGl2aWRlcidcbmltcG9ydCB7IEFsaXl1bkljb24sIEFyaXplSWNvbiwgRGF0YWJyaWNrc0ljb24sIExhbmdmdXNlSWNvbiwgTGFuZ3NtaXRoSWNvbiwgTWxmbG93SWNvbiwgT3Bpa0ljb24sIFBob2VuaXhJY29uLCBUZW5jZW50SWNvbiwgV2VhdmVJY29uIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy9wdWJsaWMvdHJhY2luZydcbmltcG9ydCBMb2FkaW5nIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCBJbmRpY2F0b3IgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvaW5kaWNhdG9yJ1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IGZldGNoVHJhY2luZ0NvbmZpZyBhcyBkb0ZldGNoVHJhY2luZ0NvbmZpZywgZmV0Y2hUcmFjaW5nU3RhdHVzLCB1cGRhdGVUcmFjaW5nU3RhdHVzIH0gZnJvbSAnQC9zZXJ2aWNlL2FwcHMnXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCBDb25maWdCdXR0b24gZnJvbSAnLi9jb25maWctYnV0dG9uJ1xuaW1wb3J0IFRyYWNpbmdJY29uIGZyb20gJy4vdHJhY2luZy1pY29uJ1xuaW1wb3J0IHsgVHJhY2luZ1Byb3ZpZGVyIH0gZnJvbSAnLi90eXBlJ1xuXG5jb25zdCBJMThOX1BSRUZJWCA9ICd0cmFjaW5nJ1xuXG5jb25zdCBQYW5lbDogRkMgPSAoKSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBwYXRobmFtZSA9IHVzZVBhdGhuYW1lKClcbiAgY29uc3QgbWF0Y2hlZCA9IC9cXC9hcHBcXC8oW14vXSspLy5leGVjKHBhdGhuYW1lKVxuICBjb25zdCBhcHBJZCA9IChtYXRjaGVkPy5sZW5ndGggJiYgbWF0Y2hlZFsxXSkgPyBtYXRjaGVkWzFdIDogJydcbiAgY29uc3QgeyBpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3IgfSA9IHVzZUFwcENvbnRleHQoKVxuICBjb25zdCByZWFkT25seSA9ICFpc0N1cnJlbnRXb3Jrc3BhY2VFZGl0b3JcblxuICBjb25zdCBbaXNMb2FkZWQsIHtcbiAgICBzZXRUcnVlOiBzZXRMb2FkZWQsXG4gIH1dID0gdXNlQm9vbGVhbihmYWxzZSlcblxuICBjb25zdCBbdHJhY2luZ1N0YXR1cywgc2V0VHJhY2luZ1N0YXR1c10gPSB1c2VTdGF0ZTxUcmFjaW5nU3RhdHVzIHwgbnVsbD4obnVsbClcbiAgY29uc3QgZW5hYmxlZCA9IHRyYWNpbmdTdGF0dXM/LmVuYWJsZWQgfHwgZmFsc2VcbiAgY29uc3QgaGFuZGxlVHJhY2luZ1N0YXR1c0NoYW5nZSA9IGFzeW5jICh0cmFjaW5nU3RhdHVzOiBUcmFjaW5nU3RhdHVzLCBub1RvYXN0PzogYm9vbGVhbikgPT4ge1xuICAgIGF3YWl0IHVwZGF0ZVRyYWNpbmdTdGF0dXMoeyBhcHBJZCwgYm9keTogdHJhY2luZ1N0YXR1cyB9KVxuICAgIHNldFRyYWNpbmdTdGF0dXModHJhY2luZ1N0YXR1cylcbiAgICBpZiAoIW5vVG9hc3QpIHtcbiAgICAgIFRvYXN0Lm5vdGlmeSh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogdCgnYXBpLnN1Y2Nlc3MnLCB7IG5zOiAnY29tbW9uJyB9KSxcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVHJhY2luZ0VuYWJsZWRDaGFuZ2UgPSAoZW5hYmxlZDogYm9vbGVhbikgPT4ge1xuICAgIGhhbmRsZVRyYWNpbmdTdGF0dXNDaGFuZ2Uoe1xuICAgICAgdHJhY2luZ19wcm92aWRlcjogdHJhY2luZ1N0YXR1cz8udHJhY2luZ19wcm92aWRlciB8fCBudWxsLFxuICAgICAgZW5hYmxlZCxcbiAgICB9KVxuICB9XG4gIGNvbnN0IGhhbmRsZUNob29zZVByb3ZpZGVyID0gKHByb3ZpZGVyOiBUcmFjaW5nUHJvdmlkZXIpID0+IHtcbiAgICBoYW5kbGVUcmFjaW5nU3RhdHVzQ2hhbmdlKHtcbiAgICAgIHRyYWNpbmdfcHJvdmlkZXI6IHByb3ZpZGVyLFxuICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGNvbnN0IGluVXNlVHJhY2luZ1Byb3ZpZGVyOiBUcmFjaW5nUHJvdmlkZXIgfCBudWxsID0gdHJhY2luZ1N0YXR1cz8udHJhY2luZ19wcm92aWRlciB8fCBudWxsXG5cbiAgY29uc3QgcHJvdmlkZXJJY29uTWFwOiBSZWNvcmQ8VHJhY2luZ1Byb3ZpZGVyLCBSZWFjdC5GQzx7IGNsYXNzTmFtZT86IHN0cmluZyB9Pj4gPSB7XG4gICAgW1RyYWNpbmdQcm92aWRlci5hcml6ZV06IEFyaXplSWNvbixcbiAgICBbVHJhY2luZ1Byb3ZpZGVyLnBob2VuaXhdOiBQaG9lbml4SWNvbixcbiAgICBbVHJhY2luZ1Byb3ZpZGVyLmxhbmdTbWl0aF06IExhbmdzbWl0aEljb24sXG4gICAgW1RyYWNpbmdQcm92aWRlci5sYW5nZnVzZV06IExhbmdmdXNlSWNvbixcbiAgICBbVHJhY2luZ1Byb3ZpZGVyLm9waWtdOiBPcGlrSWNvbixcbiAgICBbVHJhY2luZ1Byb3ZpZGVyLndlYXZlXTogV2VhdmVJY29uLFxuICAgIFtUcmFjaW5nUHJvdmlkZXIuYWxpeXVuXTogQWxpeXVuSWNvbixcbiAgICBbVHJhY2luZ1Byb3ZpZGVyLm1sZmxvd106IE1sZmxvd0ljb24sXG4gICAgW1RyYWNpbmdQcm92aWRlci5kYXRhYnJpY2tzXTogRGF0YWJyaWNrc0ljb24sXG4gICAgW1RyYWNpbmdQcm92aWRlci50ZW5jZW50XTogVGVuY2VudEljb24sXG4gIH1cbiAgY29uc3QgSW5Vc2VQcm92aWRlckljb24gPSBpblVzZVRyYWNpbmdQcm92aWRlciA/IHByb3ZpZGVySWNvbk1hcFtpblVzZVRyYWNpbmdQcm92aWRlcl0gOiB1bmRlZmluZWRcblxuICBjb25zdCBbYXJpemVDb25maWcsIHNldEFyaXplQ29uZmlnXSA9IHVzZVN0YXRlPEFyaXplQ29uZmlnIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW3Bob2VuaXhDb25maWcsIHNldFBob2VuaXhDb25maWddID0gdXNlU3RhdGU8UGhvZW5peENvbmZpZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtsYW5nU21pdGhDb25maWcsIHNldExhbmdTbWl0aENvbmZpZ10gPSB1c2VTdGF0ZTxMYW5nU21pdGhDb25maWcgfCBudWxsPihudWxsKVxuICBjb25zdCBbbGFuZ0Z1c2VDb25maWcsIHNldExhbmdGdXNlQ29uZmlnXSA9IHVzZVN0YXRlPExhbmdGdXNlQ29uZmlnIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW29waWtDb25maWcsIHNldE9waWtDb25maWddID0gdXNlU3RhdGU8T3Bpa0NvbmZpZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFt3ZWF2ZUNvbmZpZywgc2V0V2VhdmVDb25maWddID0gdXNlU3RhdGU8V2VhdmVDb25maWcgfCBudWxsPihudWxsKVxuICBjb25zdCBbYWxpeXVuQ29uZmlnLCBzZXRBbGl5dW5Db25maWddID0gdXNlU3RhdGU8QWxpeXVuQ29uZmlnIHwgbnVsbD4obnVsbClcbiAgY29uc3QgW21sZmxvd0NvbmZpZywgc2V0TUxmbG93Q29uZmlnXSA9IHVzZVN0YXRlPE1MZmxvd0NvbmZpZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IFtkYXRhYnJpY2tzQ29uZmlnLCBzZXREYXRhYnJpY2tzQ29uZmlnXSA9IHVzZVN0YXRlPERhdGFicmlja3NDb25maWcgfCBudWxsPihudWxsKVxuICBjb25zdCBbdGVuY2VudENvbmZpZywgc2V0VGVuY2VudENvbmZpZ10gPSB1c2VTdGF0ZTxUZW5jZW50Q29uZmlnIHwgbnVsbD4obnVsbClcbiAgY29uc3QgaGFzQ29uZmlndXJlZFRyYWNpbmcgPSAhIShsYW5nU21pdGhDb25maWcgfHwgbGFuZ0Z1c2VDb25maWcgfHwgb3Bpa0NvbmZpZyB8fCB3ZWF2ZUNvbmZpZyB8fCBhcml6ZUNvbmZpZyB8fCBwaG9lbml4Q29uZmlnIHx8IGFsaXl1bkNvbmZpZyB8fCBtbGZsb3dDb25maWcgfHwgZGF0YWJyaWNrc0NvbmZpZyB8fCB0ZW5jZW50Q29uZmlnKVxuXG4gIGNvbnN0IGZldGNoVHJhY2luZ0NvbmZpZyA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBnZXRBcml6ZUNvbmZpZyA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhY2luZ19jb25maWc6IGFyaXplQ29uZmlnLCBoYXNfbm90X2NvbmZpZ3VyZWQ6IGFyaXplSGFzTm90Q29uZmlnIH0gPSBhd2FpdCBkb0ZldGNoVHJhY2luZ0NvbmZpZyh7IGFwcElkLCBwcm92aWRlcjogVHJhY2luZ1Byb3ZpZGVyLmFyaXplIH0pXG4gICAgICBpZiAoIWFyaXplSGFzTm90Q29uZmlnKVxuICAgICAgICBzZXRBcml6ZUNvbmZpZyhhcml6ZUNvbmZpZyBhcyBBcml6ZUNvbmZpZylcbiAgICB9XG4gICAgY29uc3QgZ2V0UGhvZW5peENvbmZpZyA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhY2luZ19jb25maWc6IHBob2VuaXhDb25maWcsIGhhc19ub3RfY29uZmlndXJlZDogcGhvZW5peEhhc05vdENvbmZpZyB9ID0gYXdhaXQgZG9GZXRjaFRyYWNpbmdDb25maWcoeyBhcHBJZCwgcHJvdmlkZXI6IFRyYWNpbmdQcm92aWRlci5waG9lbml4IH0pXG4gICAgICBpZiAoIXBob2VuaXhIYXNOb3RDb25maWcpXG4gICAgICAgIHNldFBob2VuaXhDb25maWcocGhvZW5peENvbmZpZyBhcyBQaG9lbml4Q29uZmlnKVxuICAgIH1cbiAgICBjb25zdCBnZXRMYW5nU21pdGhDb25maWcgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHRyYWNpbmdfY29uZmlnOiBsYW5nU21pdGhDb25maWcsIGhhc19ub3RfY29uZmlndXJlZDogbGFuZ1NtaXRoSGFzTm90Q29uZmlnIH0gPSBhd2FpdCBkb0ZldGNoVHJhY2luZ0NvbmZpZyh7IGFwcElkLCBwcm92aWRlcjogVHJhY2luZ1Byb3ZpZGVyLmxhbmdTbWl0aCB9KVxuICAgICAgaWYgKCFsYW5nU21pdGhIYXNOb3RDb25maWcpXG4gICAgICAgIHNldExhbmdTbWl0aENvbmZpZyhsYW5nU21pdGhDb25maWcgYXMgTGFuZ1NtaXRoQ29uZmlnKVxuICAgIH1cbiAgICBjb25zdCBnZXRMYW5nRnVzZUNvbmZpZyA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhY2luZ19jb25maWc6IGxhbmdGdXNlQ29uZmlnLCBoYXNfbm90X2NvbmZpZ3VyZWQ6IGxhbmdGdXNlSGFzTm90Q29uZmlnIH0gPSBhd2FpdCBkb0ZldGNoVHJhY2luZ0NvbmZpZyh7IGFwcElkLCBwcm92aWRlcjogVHJhY2luZ1Byb3ZpZGVyLmxhbmdmdXNlIH0pXG4gICAgICBpZiAoIWxhbmdGdXNlSGFzTm90Q29uZmlnKVxuICAgICAgICBzZXRMYW5nRnVzZUNvbmZpZyhsYW5nRnVzZUNvbmZpZyBhcyBMYW5nRnVzZUNvbmZpZylcbiAgICB9XG4gICAgY29uc3QgZ2V0T3Bpa0NvbmZpZyA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhY2luZ19jb25maWc6IG9waWtDb25maWcsIGhhc19ub3RfY29uZmlndXJlZDogT3Bpa0hhc05vdENvbmZpZyB9ID0gYXdhaXQgZG9GZXRjaFRyYWNpbmdDb25maWcoeyBhcHBJZCwgcHJvdmlkZXI6IFRyYWNpbmdQcm92aWRlci5vcGlrIH0pXG4gICAgICBpZiAoIU9waWtIYXNOb3RDb25maWcpXG4gICAgICAgIHNldE9waWtDb25maWcob3Bpa0NvbmZpZyBhcyBPcGlrQ29uZmlnKVxuICAgIH1cbiAgICBjb25zdCBnZXRXZWF2ZUNvbmZpZyA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhY2luZ19jb25maWc6IHdlYXZlQ29uZmlnLCBoYXNfbm90X2NvbmZpZ3VyZWQ6IHdlYXZlSGFzTm90Q29uZmlnIH0gPSBhd2FpdCBkb0ZldGNoVHJhY2luZ0NvbmZpZyh7IGFwcElkLCBwcm92aWRlcjogVHJhY2luZ1Byb3ZpZGVyLndlYXZlIH0pXG4gICAgICBpZiAoIXdlYXZlSGFzTm90Q29uZmlnKVxuICAgICAgICBzZXRXZWF2ZUNvbmZpZyh3ZWF2ZUNvbmZpZyBhcyBXZWF2ZUNvbmZpZylcbiAgICB9XG4gICAgY29uc3QgZ2V0QWxpeXVuQ29uZmlnID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0cmFjaW5nX2NvbmZpZzogYWxpeXVuQ29uZmlnLCBoYXNfbm90X2NvbmZpZ3VyZWQ6IGFsaXl1bkhhc05vdENvbmZpZyB9ID0gYXdhaXQgZG9GZXRjaFRyYWNpbmdDb25maWcoeyBhcHBJZCwgcHJvdmlkZXI6IFRyYWNpbmdQcm92aWRlci5hbGl5dW4gfSlcbiAgICAgIGlmICghYWxpeXVuSGFzTm90Q29uZmlnKVxuICAgICAgICBzZXRBbGl5dW5Db25maWcoYWxpeXVuQ29uZmlnIGFzIEFsaXl1bkNvbmZpZylcbiAgICB9XG4gICAgY29uc3QgZ2V0TUxmbG93Q29uZmlnID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0cmFjaW5nX2NvbmZpZzogbWxmbG93Q29uZmlnLCBoYXNfbm90X2NvbmZpZ3VyZWQ6IG1sZmxvd0hhc05vdENvbmZpZyB9ID0gYXdhaXQgZG9GZXRjaFRyYWNpbmdDb25maWcoeyBhcHBJZCwgcHJvdmlkZXI6IFRyYWNpbmdQcm92aWRlci5tbGZsb3cgfSlcbiAgICAgIGlmICghbWxmbG93SGFzTm90Q29uZmlnKVxuICAgICAgICBzZXRNTGZsb3dDb25maWcobWxmbG93Q29uZmlnIGFzIE1MZmxvd0NvbmZpZylcbiAgICB9XG4gICAgY29uc3QgZ2V0RGF0YWJyaWNrc0NvbmZpZyA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhY2luZ19jb25maWc6IGRhdGFicmlja3NDb25maWcsIGhhc19ub3RfY29uZmlndXJlZDogZGF0YWJyaWNrc0hhc05vdENvbmZpZyB9ID0gYXdhaXQgZG9GZXRjaFRyYWNpbmdDb25maWcoeyBhcHBJZCwgcHJvdmlkZXI6IFRyYWNpbmdQcm92aWRlci5kYXRhYnJpY2tzIH0pXG4gICAgICBpZiAoIWRhdGFicmlja3NIYXNOb3RDb25maWcpXG4gICAgICAgIHNldERhdGFicmlja3NDb25maWcoZGF0YWJyaWNrc0NvbmZpZyBhcyBEYXRhYnJpY2tzQ29uZmlnKVxuICAgIH1cbiAgICBjb25zdCBnZXRUZW5jZW50Q29uZmlnID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0cmFjaW5nX2NvbmZpZzogdGVuY2VudENvbmZpZywgaGFzX25vdF9jb25maWd1cmVkOiB0ZW5jZW50SGFzTm90Q29uZmlnIH0gPSBhd2FpdCBkb0ZldGNoVHJhY2luZ0NvbmZpZyh7IGFwcElkLCBwcm92aWRlcjogVHJhY2luZ1Byb3ZpZGVyLnRlbmNlbnQgfSlcbiAgICAgIGlmICghdGVuY2VudEhhc05vdENvbmZpZylcbiAgICAgICAgc2V0VGVuY2VudENvbmZpZyh0ZW5jZW50Q29uZmlnIGFzIFRlbmNlbnRDb25maWcpXG4gICAgfVxuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIGdldEFyaXplQ29uZmlnKCksXG4gICAgICBnZXRQaG9lbml4Q29uZmlnKCksXG4gICAgICBnZXRMYW5nU21pdGhDb25maWcoKSxcbiAgICAgIGdldExhbmdGdXNlQ29uZmlnKCksXG4gICAgICBnZXRPcGlrQ29uZmlnKCksXG4gICAgICBnZXRXZWF2ZUNvbmZpZygpLFxuICAgICAgZ2V0QWxpeXVuQ29uZmlnKCksXG4gICAgICBnZXRNTGZsb3dDb25maWcoKSxcbiAgICAgIGdldERhdGFicmlja3NDb25maWcoKSxcbiAgICAgIGdldFRlbmNlbnRDb25maWcoKSxcbiAgICBdKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlVHJhY2luZ0NvbmZpZ1VwZGF0ZWQgPSBhc3luYyAocHJvdmlkZXI6IFRyYWNpbmdQcm92aWRlcikgPT4ge1xuICAgIC8vIGNhbGwgYXBpIHRvIGhpZGUgc2VjcmV0IGtleSB2YWx1ZVxuICAgIGNvbnN0IHsgdHJhY2luZ19jb25maWcgfSA9IGF3YWl0IGRvRmV0Y2hUcmFjaW5nQ29uZmlnKHsgYXBwSWQsIHByb3ZpZGVyIH0pXG4gICAgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIuYXJpemUpXG4gICAgICBzZXRBcml6ZUNvbmZpZyh0cmFjaW5nX2NvbmZpZyBhcyBBcml6ZUNvbmZpZylcbiAgICBlbHNlIGlmIChwcm92aWRlciA9PT0gVHJhY2luZ1Byb3ZpZGVyLnBob2VuaXgpXG4gICAgICBzZXRQaG9lbml4Q29uZmlnKHRyYWNpbmdfY29uZmlnIGFzIFBob2VuaXhDb25maWcpXG4gICAgZWxzZSBpZiAocHJvdmlkZXIgPT09IFRyYWNpbmdQcm92aWRlci5sYW5nU21pdGgpXG4gICAgICBzZXRMYW5nU21pdGhDb25maWcodHJhY2luZ19jb25maWcgYXMgTGFuZ1NtaXRoQ29uZmlnKVxuICAgIGVsc2UgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIubGFuZ2Z1c2UpXG4gICAgICBzZXRMYW5nRnVzZUNvbmZpZyh0cmFjaW5nX2NvbmZpZyBhcyBMYW5nRnVzZUNvbmZpZylcbiAgICBlbHNlIGlmIChwcm92aWRlciA9PT0gVHJhY2luZ1Byb3ZpZGVyLm9waWspXG4gICAgICBzZXRPcGlrQ29uZmlnKHRyYWNpbmdfY29uZmlnIGFzIE9waWtDb25maWcpXG4gICAgZWxzZSBpZiAocHJvdmlkZXIgPT09IFRyYWNpbmdQcm92aWRlci53ZWF2ZSlcbiAgICAgIHNldFdlYXZlQ29uZmlnKHRyYWNpbmdfY29uZmlnIGFzIFdlYXZlQ29uZmlnKVxuICAgIGVsc2UgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIuYWxpeXVuKVxuICAgICAgc2V0QWxpeXVuQ29uZmlnKHRyYWNpbmdfY29uZmlnIGFzIEFsaXl1bkNvbmZpZylcbiAgICBlbHNlIGlmIChwcm92aWRlciA9PT0gVHJhY2luZ1Byb3ZpZGVyLnRlbmNlbnQpXG4gICAgICBzZXRUZW5jZW50Q29uZmlnKHRyYWNpbmdfY29uZmlnIGFzIFRlbmNlbnRDb25maWcpXG4gIH1cblxuICBjb25zdCBoYW5kbGVUcmFjaW5nQ29uZmlnUmVtb3ZlZCA9IChwcm92aWRlcjogVHJhY2luZ1Byb3ZpZGVyKSA9PiB7XG4gICAgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIuYXJpemUpXG4gICAgICBzZXRBcml6ZUNvbmZpZyhudWxsKVxuICAgIGVsc2UgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIucGhvZW5peClcbiAgICAgIHNldFBob2VuaXhDb25maWcobnVsbClcbiAgICBlbHNlIGlmIChwcm92aWRlciA9PT0gVHJhY2luZ1Byb3ZpZGVyLmxhbmdTbWl0aClcbiAgICAgIHNldExhbmdTbWl0aENvbmZpZyhudWxsKVxuICAgIGVsc2UgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIubGFuZ2Z1c2UpXG4gICAgICBzZXRMYW5nRnVzZUNvbmZpZyhudWxsKVxuICAgIGVsc2UgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIub3BpaylcbiAgICAgIHNldE9waWtDb25maWcobnVsbClcbiAgICBlbHNlIGlmIChwcm92aWRlciA9PT0gVHJhY2luZ1Byb3ZpZGVyLndlYXZlKVxuICAgICAgc2V0V2VhdmVDb25maWcobnVsbClcbiAgICBlbHNlIGlmIChwcm92aWRlciA9PT0gVHJhY2luZ1Byb3ZpZGVyLmFsaXl1bilcbiAgICAgIHNldEFsaXl1bkNvbmZpZyhudWxsKVxuICAgIGVsc2UgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIubWxmbG93KVxuICAgICAgc2V0TUxmbG93Q29uZmlnKG51bGwpXG4gICAgZWxzZSBpZiAocHJvdmlkZXIgPT09IFRyYWNpbmdQcm92aWRlci5kYXRhYnJpY2tzKVxuICAgICAgc2V0RGF0YWJyaWNrc0NvbmZpZyhudWxsKVxuICAgIGVsc2UgaWYgKHByb3ZpZGVyID09PSBUcmFjaW5nUHJvdmlkZXIudGVuY2VudClcbiAgICAgIHNldFRlbmNlbnRDb25maWcobnVsbClcbiAgICBpZiAocHJvdmlkZXIgPT09IGluVXNlVHJhY2luZ1Byb3ZpZGVyKSB7XG4gICAgICBoYW5kbGVUcmFjaW5nU3RhdHVzQ2hhbmdlKHtcbiAgICAgICAgZW5hYmxlZDogZmFsc2UsXG4gICAgICAgIHRyYWNpbmdfcHJvdmlkZXI6IG51bGwsXG4gICAgICB9LCB0cnVlKVxuICAgIH1cbiAgfVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHRyYWNpbmdTdGF0dXMgPSBhd2FpdCBmZXRjaFRyYWNpbmdTdGF0dXMoeyBhcHBJZCB9KVxuICAgICAgc2V0VHJhY2luZ1N0YXR1cyh0cmFjaW5nU3RhdHVzKVxuICAgICAgYXdhaXQgZmV0Y2hUcmFjaW5nQ29uZmlnKClcbiAgICAgIHNldExvYWRlZCgpXG4gICAgfSkoKVxuICB9LCBbXSlcblxuICBpZiAoIWlzTG9hZGVkKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMyBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LVsyMDBweF1cIj5cbiAgICAgICAgICA8TG9hZGluZyAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NuKCdmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4nKX0+XG4gICAgICB7IWluVXNlVHJhY2luZ1Byb3ZpZGVyICYmIChcbiAgICAgICAgPENvbmZpZ0J1dHRvblxuICAgICAgICAgIGFwcElkPXthcHBJZH1cbiAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgaGFzQ29uZmlndXJlZD17ZmFsc2V9XG4gICAgICAgICAgZW5hYmxlZD17ZW5hYmxlZH1cbiAgICAgICAgICBvblN0YXR1c0NoYW5nZT17aGFuZGxlVHJhY2luZ0VuYWJsZWRDaGFuZ2V9XG4gICAgICAgICAgY2hvc2VuUHJvdmlkZXI9e2luVXNlVHJhY2luZ1Byb3ZpZGVyfVxuICAgICAgICAgIG9uQ2hvb3NlUHJvdmlkZXI9e2hhbmRsZUNob29zZVByb3ZpZGVyfVxuICAgICAgICAgIGFyaXplQ29uZmlnPXthcml6ZUNvbmZpZ31cbiAgICAgICAgICBwaG9lbml4Q29uZmlnPXtwaG9lbml4Q29uZmlnfVxuICAgICAgICAgIGxhbmdTbWl0aENvbmZpZz17bGFuZ1NtaXRoQ29uZmlnfVxuICAgICAgICAgIGxhbmdGdXNlQ29uZmlnPXtsYW5nRnVzZUNvbmZpZ31cbiAgICAgICAgICBvcGlrQ29uZmlnPXtvcGlrQ29uZmlnfVxuICAgICAgICAgIHdlYXZlQ29uZmlnPXt3ZWF2ZUNvbmZpZ31cbiAgICAgICAgICBhbGl5dW5Db25maWc9e2FsaXl1bkNvbmZpZ31cbiAgICAgICAgICBtbGZsb3dDb25maWc9e21sZmxvd0NvbmZpZ31cbiAgICAgICAgICBkYXRhYnJpY2tzQ29uZmlnPXtkYXRhYnJpY2tzQ29uZmlnfVxuICAgICAgICAgIHRlbmNlbnRDb25maWc9e3RlbmNlbnRDb25maWd9XG4gICAgICAgICAgb25Db25maWdVcGRhdGVkPXtoYW5kbGVUcmFjaW5nQ29uZmlnVXBkYXRlZH1cbiAgICAgICAgICBvbkNvbmZpZ1JlbW92ZWQ9e2hhbmRsZVRyYWNpbmdDb25maWdSZW1vdmVkfVxuICAgICAgICA+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjbihcbiAgICAgICAgICAgICAgJ2ZsZXggY3Vyc29yLXBvaW50ZXIgc2VsZWN0LW5vbmUgaXRlbXMtY2VudGVyIHJvdW5kZWQteGwgYm9yZGVyLWwtWzAuNXB4XSBib3JkZXItdCBib3JkZXItZWZmZWN0cy1oaWdobGlnaHQgYmctYmFja2dyb3VuZC1kZWZhdWx0LWRvZGdlIHAtMiBzaGFkb3cteHMgaG92ZXI6Ym9yZGVyLWVmZmVjdHMtaGlnaGxpZ2h0LWxpZ2h0bW9kZS1vZmYgaG92ZXI6YmctYmFja2dyb3VuZC1kZWZhdWx0LWxpZ2h0ZXInLFxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VHJhY2luZ0ljb24gc2l6ZT1cIm1kXCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLXNlbWlib2xkIG14LTIgdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0KGAke0kxOE5fUFJFRklYfS50aXRsZWAsIHsgbnM6ICdhcHAnIH0pfTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLW1kIHAtMVwiPlxuICAgICAgICAgICAgICA8UmlFcXVhbGl6ZXIyTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxEaXZpZGVyIHR5cGU9XCJ2ZXJ0aWNhbFwiIGNsYXNzTmFtZT1cImgtMy41XCIgLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBwLTFcIj5cbiAgICAgICAgICAgICAgPFJpQXJyb3dEb3duRG91YmxlTGluZSBjbGFzc05hbWU9XCJoLTQgdy00IHRleHQtdGV4dC10ZXJ0aWFyeVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9Db25maWdCdXR0b24+XG4gICAgICApfVxuICAgICAge2hhc0NvbmZpZ3VyZWRUcmFjaW5nICYmIChcbiAgICAgICAgPENvbmZpZ0J1dHRvblxuICAgICAgICAgIGFwcElkPXthcHBJZH1cbiAgICAgICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICAgICAgaGFzQ29uZmlndXJlZFxuICAgICAgICAgIGVuYWJsZWQ9e2VuYWJsZWR9XG4gICAgICAgICAgb25TdGF0dXNDaGFuZ2U9e2hhbmRsZVRyYWNpbmdFbmFibGVkQ2hhbmdlfVxuICAgICAgICAgIGNob3NlblByb3ZpZGVyPXtpblVzZVRyYWNpbmdQcm92aWRlcn1cbiAgICAgICAgICBvbkNob29zZVByb3ZpZGVyPXtoYW5kbGVDaG9vc2VQcm92aWRlcn1cbiAgICAgICAgICBhcml6ZUNvbmZpZz17YXJpemVDb25maWd9XG4gICAgICAgICAgcGhvZW5peENvbmZpZz17cGhvZW5peENvbmZpZ31cbiAgICAgICAgICBsYW5nU21pdGhDb25maWc9e2xhbmdTbWl0aENvbmZpZ31cbiAgICAgICAgICBsYW5nRnVzZUNvbmZpZz17bGFuZ0Z1c2VDb25maWd9XG4gICAgICAgICAgb3Bpa0NvbmZpZz17b3Bpa0NvbmZpZ31cbiAgICAgICAgICB3ZWF2ZUNvbmZpZz17d2VhdmVDb25maWd9XG4gICAgICAgICAgYWxpeXVuQ29uZmlnPXthbGl5dW5Db25maWd9XG4gICAgICAgICAgbWxmbG93Q29uZmlnPXttbGZsb3dDb25maWd9XG4gICAgICAgICAgZGF0YWJyaWNrc0NvbmZpZz17ZGF0YWJyaWNrc0NvbmZpZ31cbiAgICAgICAgICB0ZW5jZW50Q29uZmlnPXt0ZW5jZW50Q29uZmlnfVxuICAgICAgICAgIG9uQ29uZmlnVXBkYXRlZD17aGFuZGxlVHJhY2luZ0NvbmZpZ1VwZGF0ZWR9XG4gICAgICAgICAgb25Db25maWdSZW1vdmVkPXtoYW5kbGVUcmFjaW5nQ29uZmlnUmVtb3ZlZH1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y24oXG4gICAgICAgICAgICAgICdmbGV4IGN1cnNvci1wb2ludGVyIHNlbGVjdC1ub25lIGl0ZW1zLWNlbnRlciByb3VuZGVkLXhsIGJvcmRlci1sLVswLjVweF0gYm9yZGVyLXQgYm9yZGVyLWVmZmVjdHMtaGlnaGxpZ2h0IGJnLWJhY2tncm91bmQtZGVmYXVsdC1kb2RnZSBwLTIgc2hhZG93LXhzIGhvdmVyOmJvcmRlci1lZmZlY3RzLWhpZ2hsaWdodC1saWdodG1vZGUtb2ZmIGhvdmVyOmJnLWJhY2tncm91bmQtZGVmYXVsdC1saWdodGVyJyxcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtbC00IG1yLTEgZmxleCBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgPEluZGljYXRvciBjb2xvcj17ZW5hYmxlZCA/ICdncmVlbicgOiAnZ3JheSd9IC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXhzLXNlbWlib2xkLXVwcGVyY2FzZSBtbC0xLjUgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgICAgICAgICAge3QoYCR7STE4Tl9QUkVGSVh9LiR7ZW5hYmxlZCA/ICdlbmFibGVkJyA6ICdkaXNhYmxlZCd9YCwgeyBuczogJ2FwcCcgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7SW5Vc2VQcm92aWRlckljb24gJiYgPEluVXNlUHJvdmlkZXJJY29uIGNsYXNzTmFtZT1cIm1sLTEgaC00XCIgLz59XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1sLTIgcm91bmRlZC1tZCBwLTFcIj5cbiAgICAgICAgICAgICAgPFJpRXF1YWxpemVyMkxpbmUgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8RGl2aWRlciB0eXBlPVwidmVydGljYWxcIiBjbGFzc05hbWU9XCJoLTMuNVwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvQ29uZmlnQnV0dG9uPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhQYW5lbClcbiJdfQ==