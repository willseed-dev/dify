"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const amplitude_1 = require("@/app/components/base/amplitude");
const tooltip_1 = require("@/app/components/base/tooltip");
const i18n_1 = require("@/context/i18n");
const use_theme_1 = require("@/hooks/use-theme");
const app_1 = require("@/types/app");
const classnames_1 = require("@/utils/classnames");
const var_1 = require("@/utils/var");
const block_icon_1 = require("../../block-icon");
const types_1 = require("../../types");
const normalizeProviderIcon = (icon) => {
    if (!icon)
        return icon;
    if (typeof icon === 'string' && var_1.basePath && icon.startsWith('/') && !icon.startsWith(`${var_1.basePath}/`))
        return `${var_1.basePath}${icon}`;
    return icon;
};
const ToolItem = ({ provider, payload, onSelect, disabled, isAdded, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const language = (0, i18n_1.useGetLanguage)();
    const { theme } = (0, use_theme_1.default)();
    const normalizedIcon = (0, react_1.useMemo)(() => {
        return normalizeProviderIcon(provider.icon) ?? provider.icon;
    }, [provider.icon]);
    const normalizedIconDark = (0, react_1.useMemo)(() => {
        if (!provider.icon_dark)
            return undefined;
        return normalizeProviderIcon(provider.icon_dark) ?? provider.icon_dark;
    }, [provider.icon_dark]);
    const providerIcon = (0, react_1.useMemo)(() => {
        if (theme === app_1.Theme.dark && normalizedIconDark)
            return normalizedIconDark;
        return normalizedIcon;
    }, [theme, normalizedIcon, normalizedIconDark]);
    return (<tooltip_1.default key={payload.name} position="right" needsDelay={false} popupClassName="!p-0 !px-3 !py-2.5 !w-[200px] !leading-[18px] !text-xs !text-gray-700 !border-[0.5px] !border-black/5 !rounded-xl !shadow-lg" popupContent={(<div>
          <block_icon_1.default size="md" className="mb-2" type={types_1.BlockEnum.Tool} toolIcon={providerIcon}/>
          <div className="mb-1 text-sm leading-5 text-text-primary">{payload.label[language]}</div>
          <div className="text-xs leading-[18px] text-text-secondary">{payload.description[language]}</div>
        </div>)}>
      <div key={payload.name} className="flex cursor-pointer items-center justify-between rounded-lg pl-[21px] pr-1 hover:bg-state-base-hover" onClick={() => {
            if (disabled)
                return;
            const params = {};
            if (payload.parameters) {
                payload.parameters.forEach((item) => {
                    params[item.name] = '';
                });
            }
            onSelect(types_1.BlockEnum.Tool, {
                provider_id: provider.id,
                provider_type: provider.type,
                provider_name: provider.name,
                plugin_id: provider.plugin_id,
                plugin_unique_identifier: provider.plugin_unique_identifier,
                provider_icon: normalizedIcon,
                provider_icon_dark: normalizedIconDark,
                tool_name: payload.name,
                tool_label: payload.label[language],
                tool_description: payload.description[language],
                title: payload.label[language],
                is_team_authorization: provider.is_team_authorization,
                paramSchemas: payload.parameters,
                params,
                meta: provider.meta,
            });
            (0, amplitude_1.trackEvent)('tool_selected', {
                tool_name: payload.name,
                plugin_id: provider.plugin_id,
            });
        }}>
        <div className={(0, classnames_1.cn)('system-sm-medium h-8 truncate border-l-2 border-divider-subtle pl-4 leading-8 text-text-secondary')}>
          <span className={(0, classnames_1.cn)(disabled && 'opacity-30')}>{payload.label[language]}</span>
        </div>
        {isAdded && (<div className="system-xs-regular mr-4 text-text-tertiary">{t('addToolModal.added', { ns: 'tools' })}</div>)}
      </div>
    </tooltip_1.default>);
};
exports.default = React.memo(ToolItem);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLWl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhY3Rpb24taXRlbS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFLWiwrQkFBOEI7QUFDOUIsaUNBQStCO0FBQy9CLGlEQUE4QztBQUM5QywrREFBNEQ7QUFDNUQsMkRBQW1EO0FBQ25ELHlDQUErQztBQUMvQyxpREFBd0M7QUFDeEMscUNBQW1DO0FBQ25DLG1EQUF1QztBQUN2QyxxQ0FBc0M7QUFDdEMsaURBQXdDO0FBQ3hDLHVDQUF1QztBQUV2QyxNQUFNLHFCQUFxQixHQUFHLENBQUMsSUFBK0IsRUFBRSxFQUFFO0lBQ2hFLElBQUksQ0FBQyxJQUFJO1FBQ1AsT0FBTyxJQUFJLENBQUE7SUFDYixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxjQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxjQUFRLEdBQUcsQ0FBQztRQUNsRyxPQUFPLEdBQUcsY0FBUSxHQUFHLElBQUksRUFBRSxDQUFBO0lBQzdCLE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQyxDQUFBO0FBVUQsTUFBTSxRQUFRLEdBQWMsQ0FBQyxFQUMzQixRQUFRLEVBQ1IsT0FBTyxFQUNQLFFBQVEsRUFDUixRQUFRLEVBQ1IsT0FBTyxHQUNSLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixNQUFNLFFBQVEsR0FBRyxJQUFBLHFCQUFjLEdBQUUsQ0FBQTtJQUNqQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBQSxtQkFBUSxHQUFFLENBQUE7SUFDNUIsTUFBTSxjQUFjLEdBQUcsSUFBQSxlQUFPLEVBQTJCLEdBQUcsRUFBRTtRQUM1RCxPQUFPLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxRQUFR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QztnQkFDOUIscUJBQXFCLEVBQUUsUUFBUSxDQUFDLHFCQUFxQjtnQkFDckQsWUFBWSxFQUFFLE9BQU8sQ0FBQyxVQUFVO2dCQUNoQyxNQUFNO2dCQUNOLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTthQUNwQixDQUFDLENBQUE7WUFDRixJQUFBLHNCQUFVLEVBQUMsZUFBZSxFQUFFO2dCQUMxQixTQUFTLEVBQUUsT0FBTyxDQUFDLElBQUk7Z0JBQ3ZCLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUzthQUM5QixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FFRjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLG1HQUFtRyxDQUFDLENBQUMsQ0FDdEg7VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxRQUFRLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQ2hGO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLE9BQU8sSUFBSSxDQUNWLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQzVHLENBQ0g7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsaUJBQU8sQ0FBQyxDQUNYLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFRvb2xXaXRoUHJvdmlkZXIgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB0eXBlIHsgVG9vbERlZmF1bHRWYWx1ZSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBUb29sIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy90b29scy90eXBlcydcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdHJhY2tFdmVudCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hbXBsaXR1ZGUnXG5pbXBvcnQgVG9vbHRpcCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9vbHRpcCdcbmltcG9ydCB7IHVzZUdldExhbmd1YWdlIH0gZnJvbSAnQC9jb250ZXh0L2kxOG4nXG5pbXBvcnQgdXNlVGhlbWUgZnJvbSAnQC9ob29rcy91c2UtdGhlbWUnXG5pbXBvcnQgeyBUaGVtZSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5pbXBvcnQgeyBiYXNlUGF0aCB9IGZyb20gJ0AvdXRpbHMvdmFyJ1xuaW1wb3J0IEJsb2NrSWNvbiBmcm9tICcuLi8uLi9ibG9jay1pY29uJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmNvbnN0IG5vcm1hbGl6ZVByb3ZpZGVySWNvbiA9IChpY29uPzogVG9vbFdpdGhQcm92aWRlclsnaWNvbiddKSA9PiB7XG4gIGlmICghaWNvbilcbiAgICByZXR1cm4gaWNvblxuICBpZiAodHlwZW9mIGljb24gPT09ICdzdHJpbmcnICYmIGJhc2VQYXRoICYmIGljb24uc3RhcnRzV2l0aCgnLycpICYmICFpY29uLnN0YXJ0c1dpdGgoYCR7YmFzZVBhdGh9L2ApKVxuICAgIHJldHVybiBgJHtiYXNlUGF0aH0ke2ljb259YFxuICByZXR1cm4gaWNvblxufVxuXG50eXBlIFByb3BzID0ge1xuICBwcm92aWRlcjogVG9vbFdpdGhQcm92aWRlclxuICBwYXlsb2FkOiBUb29sXG4gIGRpc2FibGVkPzogYm9vbGVhblxuICBpc0FkZGVkPzogYm9vbGVhblxuICBvblNlbGVjdDogKHR5cGU6IEJsb2NrRW51bSwgdG9vbDogVG9vbERlZmF1bHRWYWx1ZSkgPT4gdm9pZFxufVxuXG5jb25zdCBUb29sSXRlbTogRkM8UHJvcHM+ID0gKHtcbiAgcHJvdmlkZXIsXG4gIHBheWxvYWQsXG4gIG9uU2VsZWN0LFxuICBkaXNhYmxlZCxcbiAgaXNBZGRlZCxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgY29uc3QgbGFuZ3VhZ2UgPSB1c2VHZXRMYW5ndWFnZSgpXG4gIGNvbnN0IHsgdGhlbWUgfSA9IHVzZVRoZW1lKClcbiAgY29uc3Qgbm9ybWFsaXplZEljb24gPSB1c2VNZW1vPFRvb2xXaXRoUHJvdmlkZXJbJ2ljb24nXT4oKCkgPT4ge1xuICAgIHJldHVybiBub3JtYWxpemVQcm92aWRlckljb24ocHJvdmlkZXIuaWNvbikgPz8gcHJvdmlkZXIuaWNvblxuICB9LCBbcHJvdmlkZXIuaWNvbl0pXG4gIGNvbnN0IG5vcm1hbGl6ZWRJY29uRGFyayA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghcHJvdmlkZXIuaWNvbl9kYXJrKVxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiBub3JtYWxpemVQcm92aWRlckljb24ocHJvdmlkZXIuaWNvbl9kYXJrKSA/PyBwcm92aWRlci5pY29uX2RhcmtcbiAgfSwgW3Byb3ZpZGVyLmljb25fZGFya10pXG4gIGNvbnN0IHByb3ZpZGVySWNvbiA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICh0aGVtZSA9PT0gVGhlbWUuZGFyayAmJiBub3JtYWxpemVkSWNvbkRhcmspXG4gICAgICByZXR1cm4gbm9ybWFsaXplZEljb25EYXJrXG4gICAgcmV0dXJuIG5vcm1hbGl6ZWRJY29uXG4gIH0sIFt0aGVtZSwgbm9ybWFsaXplZEljb24sIG5vcm1hbGl6ZWRJY29uRGFya10pXG5cbiAgcmV0dXJuIChcbiAgICA8VG9vbHRpcFxuICAgICAga2V5PXtwYXlsb2FkLm5hbWV9XG4gICAgICBwb3NpdGlvbj1cInJpZ2h0XCJcbiAgICAgIG5lZWRzRGVsYXk9e2ZhbHNlfVxuICAgICAgcG9wdXBDbGFzc05hbWU9XCIhcC0wICFweC0zICFweS0yLjUgIXctWzIwMHB4XSAhbGVhZGluZy1bMThweF0gIXRleHQteHMgIXRleHQtZ3JheS03MDAgIWJvcmRlci1bMC41cHhdICFib3JkZXItYmxhY2svNSAhcm91bmRlZC14bCAhc2hhZG93LWxnXCJcbiAgICAgIHBvcHVwQ29udGVudD17KFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxCbG9ja0ljb25cbiAgICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJtYi0yXCJcbiAgICAgICAgICAgIHR5cGU9e0Jsb2NrRW51bS5Ub29sfVxuICAgICAgICAgICAgdG9vbEljb249e3Byb3ZpZGVySWNvbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMSB0ZXh0LXNtIGxlYWRpbmctNSB0ZXh0LXRleHQtcHJpbWFyeVwiPntwYXlsb2FkLmxhYmVsW2xhbmd1YWdlXX08L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgbGVhZGluZy1bMThweF0gdGV4dC10ZXh0LXNlY29uZGFyeVwiPntwYXlsb2FkLmRlc2NyaXB0aW9uW2xhbmd1YWdlXX08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtwYXlsb2FkLm5hbWV9XG4gICAgICAgIGNsYXNzTmFtZT1cImZsZXggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiByb3VuZGVkLWxnIHBsLVsyMXB4XSBwci0xIGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgaWYgKGRpc2FibGVkKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgY29uc3QgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge31cbiAgICAgICAgICBpZiAocGF5bG9hZC5wYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICBwYXlsb2FkLnBhcmFtZXRlcnMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICBwYXJhbXNbaXRlbS5uYW1lXSA9ICcnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICBvblNlbGVjdChCbG9ja0VudW0uVG9vbCwge1xuICAgICAgICAgICAgcHJvdmlkZXJfaWQ6IHByb3ZpZGVyLmlkLFxuICAgICAgICAgICAgcHJvdmlkZXJfdHlwZTogcHJvdmlkZXIudHlwZSxcbiAgICAgICAgICAgIHByb3ZpZGVyX25hbWU6IHByb3ZpZGVyLm5hbWUsXG4gICAgICAgICAgICBwbHVnaW5faWQ6IHByb3ZpZGVyLnBsdWdpbl9pZCxcbiAgICAgICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogcHJvdmlkZXIucGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyLFxuICAgICAgICAgICAgcHJvdmlkZXJfaWNvbjogbm9ybWFsaXplZEljb24sXG4gICAgICAgICAgICBwcm92aWRlcl9pY29uX2Rhcms6IG5vcm1hbGl6ZWRJY29uRGFyayxcbiAgICAgICAgICAgIHRvb2xfbmFtZTogcGF5bG9hZC5uYW1lLFxuICAgICAgICAgICAgdG9vbF9sYWJlbDogcGF5bG9hZC5sYWJlbFtsYW5ndWFnZV0sXG4gICAgICAgICAgICB0b29sX2Rlc2NyaXB0aW9uOiBwYXlsb2FkLmRlc2NyaXB0aW9uW2xhbmd1YWdlXSxcbiAgICAgICAgICAgIHRpdGxlOiBwYXlsb2FkLmxhYmVsW2xhbmd1YWdlXSxcbiAgICAgICAgICAgIGlzX3RlYW1fYXV0aG9yaXphdGlvbjogcHJvdmlkZXIuaXNfdGVhbV9hdXRob3JpemF0aW9uLFxuICAgICAgICAgICAgcGFyYW1TY2hlbWFzOiBwYXlsb2FkLnBhcmFtZXRlcnMsXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICBtZXRhOiBwcm92aWRlci5tZXRhLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgdHJhY2tFdmVudCgndG9vbF9zZWxlY3RlZCcsIHtcbiAgICAgICAgICAgIHRvb2xfbmFtZTogcGF5bG9hZC5uYW1lLFxuICAgICAgICAgICAgcGx1Z2luX2lkOiBwcm92aWRlci5wbHVnaW5faWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NuKCdzeXN0ZW0tc20tbWVkaXVtIGgtOCB0cnVuY2F0ZSBib3JkZXItbC0yIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBwbC00IGxlYWRpbmctOCB0ZXh0LXRleHQtc2Vjb25kYXJ5Jyl9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y24oZGlzYWJsZWQgJiYgJ29wYWNpdHktMzAnKX0+e3BheWxvYWQubGFiZWxbbGFuZ3VhZ2VdfTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtpc0FkZGVkICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIG1yLTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3QoJ2FkZFRvb2xNb2RhbC5hZGRlZCcsIHsgbnM6ICd0b29scycgfSl9PC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L1Rvb2x0aXA+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oVG9vbEl0ZW0pXG4iXX0=