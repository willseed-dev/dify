"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_query_1 = require("@tanstack/react-query");
const next_themes_1 = require("next-themes");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const action_button_1 = require("@/app/components/base/action-button");
// import Button from '@/app/components/base/button'
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const use_plugins_1 = require("@/service/use-plugins");
const classnames_1 = require("@/utils/classnames");
const format_1 = require("@/utils/format");
const var_1 = require("@/utils/var");
const OperationDropdown = ({ open, onOpenChange, author, name, version, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { theme } = (0, next_themes_1.useTheme)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const openRef = (0, react_2.useRef)(open);
    const setOpen = (0, react_2.useCallback)((v) => {
        onOpenChange(v);
        openRef.current = v;
    }, [onOpenChange]);
    const handleTrigger = (0, react_2.useCallback)(() => {
        setOpen(!openRef.current);
    }, [setOpen]);
    const [needDownload, setNeedDownload] = (0, react_2.useState)(false);
    const downloadInfo = (0, react_2.useMemo)(() => ({
        organization: author,
        pluginName: name,
        version,
    }), [author, name, version]);
    const { data: blob, isLoading } = (0, use_plugins_1.useDownloadPlugin)(downloadInfo, needDownload);
    const handleDownload = (0, react_2.useCallback)(() => {
        if (isLoading)
            return;
        queryClient.removeQueries({
            queryKey: ['plugins', 'downloadPlugin', downloadInfo],
            exact: true,
        });
        setNeedDownload(true);
    }, [downloadInfo, isLoading, queryClient]);
    (0, react_2.useEffect)(() => {
        if (!needDownload || !blob)
            return;
        const fileName = `${author}-${name}_${version}.zip`;
        (0, format_1.downloadFile)({ data: blob, fileName });
        setNeedDownload(false);
        queryClient.removeQueries({
            queryKey: ['plugins', 'downloadPlugin', downloadInfo],
            exact: true,
        });
    }, [author, blob, downloadInfo, name, needDownload, queryClient, version]);
    return (<portal_to_follow_elem_1.PortalToFollowElem open={open} onOpenChange={setOpen} placement="bottom-end" offset={{
            mainAxis: 0,
            crossAxis: 0,
        }}>
      <portal_to_follow_elem_1.PortalToFollowElemTrigger onClick={handleTrigger}>
        <action_button_1.default className={(0, classnames_1.cn)(open && 'bg-state-base-hover')}>
          <react_1.RiMoreFill className="h-4 w-4 text-components-button-secondary-accent-text"/>
        </action_button_1.default>
      </portal_to_follow_elem_1.PortalToFollowElemTrigger>
      <portal_to_follow_elem_1.PortalToFollowElemContent className="z-[9999]">
        <div className="min-w-[176px] rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-1 shadow-lg">
          <div onClick={handleDownload} className="system-md-regular cursor-pointer rounded-lg px-3 py-1.5 text-text-secondary hover:bg-state-base-hover">{t('operation.download', { ns: 'common' })}</div>
          <a href={(0, var_1.getMarketplaceUrl)(`/plugins/${author}/${name}`, { theme })} target="_blank" className="system-md-regular block cursor-pointer rounded-lg px-3 py-1.5 text-text-secondary hover:bg-state-base-hover">{t('operation.viewDetails', { ns: 'common' })}</a>
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemContent>
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.default = React.memo(OperationDropdown);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aW9uLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUVaLDRDQUE2QztBQUM3Qyx1REFBc0Q7QUFDdEQsNkNBQXNDO0FBQ3RDLCtCQUE4QjtBQUM5QixpQ0FBeUU7QUFDekUsaURBQThDO0FBQzlDLHVFQUE4RDtBQUM5RCxvREFBb0Q7QUFDcEQsdUZBSW9EO0FBQ3BELHVEQUF5RDtBQUN6RCxtREFBdUM7QUFDdkMsMkNBQTZDO0FBQzdDLHFDQUErQztBQVUvQyxNQUFNLGlCQUFpQixHQUFjLENBQUMsRUFDcEMsSUFBSSxFQUNKLFlBQVksRUFDWixNQUFNLEVBQ04sSUFBSSxFQUNKLE9BQU8sR0FDUixFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUEsc0JBQVEsR0FBRSxDQUFBO0lBQzVCLE1BQU0sV0FBVyxHQUFHLElBQUEsNEJBQWMsR0FBRSxDQUFBO0lBQ3BDLE1BQU0sT0FBTyxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVCLE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLENBQVUsRUFBRSxFQUFFO1FBQ3pDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNmLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ3JCLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7SUFFbEIsTUFBTSxhQUFhLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNyQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDM0IsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUViLE1BQU0sQ0FBQyxZQUFZLEVBQUUsZUFBZSxD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LFFBQVEsQ0FBQyxTQUFTLENBQUMsNkdBQTZHLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDaFE7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsaURBQXlCLENBQzdCO0lBQUEsRUFBRSwwQ0FBa0IsQ0FBQyxDQUN0QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBSaU1vcmVGaWxsIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IHVzZVF1ZXJ5Q2xpZW50IH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgdXNlVGhlbWUgfSBmcm9tICduZXh0LXRoZW1lcydcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEFjdGlvbkJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYWN0aW9uLWJ1dHRvbidcbi8vIGltcG9ydCBCdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2J1dHRvbidcbmltcG9ydCB7XG4gIFBvcnRhbFRvRm9sbG93RWxlbSxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCxcbiAgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbSdcbmltcG9ydCB7IHVzZURvd25sb2FkUGx1Z2luIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgeyBkb3dubG9hZEZpbGUgfSBmcm9tICdAL3V0aWxzL2Zvcm1hdCdcbmltcG9ydCB7IGdldE1hcmtldHBsYWNlVXJsIH0gZnJvbSAnQC91dGlscy92YXInXG5cbnR5cGUgUHJvcHMgPSB7XG4gIG9wZW46IGJvb2xlYW5cbiAgb25PcGVuQ2hhbmdlOiAodjogYm9vbGVhbikgPT4gdm9pZFxuICBhdXRob3I6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbiAgdmVyc2lvbjogc3RyaW5nXG59XG5cbmNvbnN0IE9wZXJhdGlvbkRyb3Bkb3duOiBGQzxQcm9wcz4gPSAoe1xuICBvcGVuLFxuICBvbk9wZW5DaGFuZ2UsXG4gIGF1dGhvcixcbiAgbmFtZSxcbiAgdmVyc2lvbixcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcbiAgY29uc3QgcXVlcnlDbGllbnQgPSB1c2VRdWVyeUNsaWVudCgpXG4gIGNvbnN0IG9wZW5SZWYgPSB1c2VSZWYob3BlbilcbiAgY29uc3Qgc2V0T3BlbiA9IHVzZUNhbGxiYWNrKCh2OiBib29sZWFuKSA9PiB7XG4gICAgb25PcGVuQ2hhbmdlKHYpXG4gICAgb3BlblJlZi5jdXJyZW50ID0gdlxuICB9LCBbb25PcGVuQ2hhbmdlXSlcblxuICBjb25zdCBoYW5kbGVUcmlnZ2VyID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldE9wZW4oIW9wZW5SZWYuY3VycmVudClcbiAgfSwgW3NldE9wZW5dKVxuXG4gIGNvbnN0IFtuZWVkRG93bmxvYWQsIHNldE5lZWREb3dubG9hZF0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgZG93bmxvYWRJbmZvID0gdXNlTWVtbygoKSA9PiAoe1xuICAgIG9yZ2FuaXphdGlvbjogYXV0aG9yLFxuICAgIHBsdWdpbk5hbWU6IG5hbWUsXG4gICAgdmVyc2lvbixcbiAgfSksIFthdXRob3IsIG5hbWUsIHZlcnNpb25dKVxuICBjb25zdCB7IGRhdGE6IGJsb2IsIGlzTG9hZGluZyB9ID0gdXNlRG93bmxvYWRQbHVnaW4oZG93bmxvYWRJbmZvLCBuZWVkRG93bmxvYWQpXG4gIGNvbnN0IGhhbmRsZURvd25sb2FkID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGlmIChpc0xvYWRpbmcpXG4gICAgICByZXR1cm5cbiAgICBxdWVyeUNsaWVudC5yZW1vdmVRdWVyaWVzKHtcbiAgICAgIHF1ZXJ5S2V5OiBbJ3BsdWdpbnMnLCAnZG93bmxvYWRQbHVnaW4nLCBkb3dubG9hZEluZm9dLFxuICAgICAgZXhhY3Q6IHRydWUsXG4gICAgfSlcbiAgICBzZXROZWVkRG93bmxvYWQodHJ1ZSlcbiAgfSwgW2Rvd25sb2FkSW5mbywgaXNMb2FkaW5nLCBxdWVyeUNsaWVudF0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW5lZWREb3dubG9hZCB8fCAhYmxvYilcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IGZpbGVOYW1lID0gYCR7YXV0aG9yfS0ke25hbWV9XyR7dmVyc2lvbn0uemlwYFxuICAgIGRvd25sb2FkRmlsZSh7IGRhdGE6IGJsb2IsIGZpbGVOYW1lIH0pXG4gICAgc2V0TmVlZERvd25sb2FkKGZhbHNlKVxuICAgIHF1ZXJ5Q2xpZW50LnJlbW92ZVF1ZXJpZXMoe1xuICAgICAgcXVlcnlLZXk6IFsncGx1Z2lucycsICdkb3dubG9hZFBsdWdpbicsIGRvd25sb2FkSW5mb10sXG4gICAgICBleGFjdDogdHJ1ZSxcbiAgICB9KVxuICB9LCBbYXV0aG9yLCBibG9iLCBkb3dubG9hZEluZm8sIG5hbWUsIG5lZWREb3dubG9hZCwgcXVlcnlDbGllbnQsIHZlcnNpb25dKVxuICByZXR1cm4gKFxuICAgIDxQb3J0YWxUb0ZvbGxvd0VsZW1cbiAgICAgIG9wZW49e29wZW59XG4gICAgICBvbk9wZW5DaGFuZ2U9e3NldE9wZW59XG4gICAgICBwbGFjZW1lbnQ9XCJib3R0b20tZW5kXCJcbiAgICAgIG9mZnNldD17e1xuICAgICAgICBtYWluQXhpczogMCxcbiAgICAgICAgY3Jvc3NBeGlzOiAwLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlciBvbkNsaWNrPXtoYW5kbGVUcmlnZ2VyfT5cbiAgICAgICAgPEFjdGlvbkJ1dHRvbiBjbGFzc05hbWU9e2NuKG9wZW4gJiYgJ2JnLXN0YXRlLWJhc2UtaG92ZXInKX0+XG4gICAgICAgICAgPFJpTW9yZUZpbGwgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LWNvbXBvbmVudHMtYnV0dG9uLXNlY29uZGFyeS1hY2NlbnQtdGV4dFwiIC8+XG4gICAgICAgIDwvQWN0aW9uQnV0dG9uPlxuICAgICAgPC9Qb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyPlxuICAgICAgPFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQgY2xhc3NOYW1lPVwiei1bOTk5OV1cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtaW4tdy1bMTc2cHhdIHJvdW5kZWQteGwgYm9yZGVyLVswLjVweF0gYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmctYmx1ciBwLTEgc2hhZG93LWxnXCI+XG4gICAgICAgICAgPGRpdiBvbkNsaWNrPXtoYW5kbGVEb3dubG9hZH0gY2xhc3NOYW1lPVwic3lzdGVtLW1kLXJlZ3VsYXIgY3Vyc29yLXBvaW50ZXIgcm91bmRlZC1sZyBweC0zIHB5LTEuNSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIj57dCgnb3BlcmF0aW9uLmRvd25sb2FkJywgeyBuczogJ2NvbW1vbicgfSl9PC9kaXY+XG4gICAgICAgICAgPGEgaHJlZj17Z2V0TWFya2V0cGxhY2VVcmwoYC9wbHVnaW5zLyR7YXV0aG9yfS8ke25hbWV9YCwgeyB0aGVtZSB9KX0gdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3NOYW1lPVwic3lzdGVtLW1kLXJlZ3VsYXIgYmxvY2sgY3Vyc29yLXBvaW50ZXIgcm91bmRlZC1sZyBweC0zIHB5LTEuNSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIj57dCgnb3BlcmF0aW9uLnZpZXdEZXRhaWxzJywgeyBuczogJ2NvbW1vbicgfSl9PC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudD5cbiAgICA8L1BvcnRhbFRvRm9sbG93RWxlbT5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhPcGVyYXRpb25Ecm9wZG93bilcbiJdfQ==