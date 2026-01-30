"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
// import { Resolution } from '@/types/app'
const hooks_1 = require("@/app/components/base/features/hooks");
const features_1 = require("@/app/components/base/icons/src/vender/features");
const switch_1 = require("@/app/components/base/switch");
const tooltip_1 = require("@/app/components/base/tooltip");
const types_1 = require("@/app/components/workflow/types");
// import OptionCard from '@/app/components/workflow/nodes/_base/components/option-card'
const debug_configuration_1 = require("@/context/debug-configuration");
const param_config_1 = require("./param-config");
const ConfigVision = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { isShowVisionConfig, isAllowVideoUpload } = (0, use_context_selector_1.useContext)(debug_configuration_1.default);
    const file = (0, hooks_1.useFeatures)(s => s.features.file);
    const featuresStore = (0, hooks_1.useFeaturesStore)();
    const isImageEnabled = file?.allowed_file_types?.includes(types_1.SupportUploadFileTypes.image) ?? false;
    const handleChange = (0, react_1.useCallback)((value) => {
        const { features, setFeatures, } = featuresStore.getState();
        const newFeatures = (0, immer_1.produce)(features, (draft) => {
            if (value) {
                draft.file.allowed_file_types = Array.from(new Set([
                    ...(draft.file?.allowed_file_types || []),
                    types_1.SupportUploadFileTypes.image,
                    ...(isAllowVideoUpload ? [types_1.SupportUploadFileTypes.video] : []),
                ]));
            }
            else {
                draft.file.allowed_file_types = draft.file.allowed_file_types?.filter(type => type !== types_1.SupportUploadFileTypes.image && (isAllowVideoUpload ? type !== types_1.SupportUploadFileTypes.video : true));
            }
            if (draft.file) {
                draft.file.enabled = (draft.file.allowed_file_types?.length ?? 0) > 0;
                draft.file.image = {
                    ...draft.file.image,
                    enabled: value,
                };
            }
        });
        setFeatures(newFeatures);
    }, [featuresStore, isAllowVideoUpload]);
    if (!isShowVisionConfig)
        return null;
    return (<div className="mt-2 flex items-center gap-2 rounded-xl border-l-[0.5px] border-t-[0.5px] border-effects-highlight bg-background-section-burn p-2">
      <div className="shrink-0 p-1">
        <div className="rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-indigo-indigo-600 p-1 shadow-xs">
          <features_1.Vision className="h-4 w-4 text-text-primary-on-surface"/>
        </div>
      </div>
      <div className="flex grow items-center">
        <div className="system-sm-semibold mr-1 text-text-secondary">{t('vision.name', { ns: 'appDebug' })}</div>
        <tooltip_1.default popupContent={(<div className="w-[180px]">
              {t('vision.description', { ns: 'appDebug' })}
            </div>)}/>
      </div>
      <div className="flex shrink-0 items-center">
        {/* <div className='mr-2 flex items-center gap-0.5'>
          <div className='text-text-tertiary system-xs-medium-uppercase'>{t('appDebug.vision.visionSettings.resolution')}</div>
          <Tooltip
            popupContent={
              <div className='w-[180px]' >
                {t('appDebug.vision.visionSettings.resolutionTooltip').split('\n').map(item => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            }
          />
        </div> */}
        {/* <div className='flex items-center gap-1'>
          <OptionCard
            title={t('appDebug.vision.visionSettings.high')}
            selected={file?.image?.detail === Resolution.high}
            onSelect={() => handleChange(Resolution.high)}
          />
          <OptionCard
            title={t('appDebug.vision.visionSettings.low')}
            selected={file?.image?.detail === Resolution.low}
            onSelect={() => handleChange(Resolution.low)}
          />
        </div> */}
        <param_config_1.default />
        <div className="ml-1 mr-3 h-3.5 w-[1px] bg-divider-regular"></div>
        <switch_1.default defaultValue={isImageEnabled} onChange={handleChange} size="md"/>
      </div>
    </div>);
};
exports.default = React.memo(ConfigVision);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWixpQ0FBK0I7QUFDL0IsK0JBQThCO0FBQzlCLGlDQUFtQztBQUNuQyxpREFBOEM7QUFDOUMsK0RBQWlEO0FBQ2pELDJDQUEyQztBQUMzQyxnRUFBb0Y7QUFDcEYsOEVBQXdFO0FBQ3hFLHlEQUFpRDtBQUNqRCwyREFBbUQ7QUFDbkQsMkRBQXdFO0FBQ3hFLHdGQUF3RjtBQUN4Rix1RUFBeUQ7QUFDekQsaURBQXdDO0FBRXhDLE1BQU0sWUFBWSxHQUFPLEdBQUcsRUFBRTtJQUM1QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLEdBQUcsSUFBQSxpQ0FBVSxFQUFDLDZCQUFhLENBQUMsQ0FBQTtJQUM1RSxNQUFNLElBQUksR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzlDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUV4QyxNQUFNLGNBQWMsR0FBRyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLDhCQUFzQixDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQTtJQUVoRyxNQUFNLFlBQVksR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxLQUFjLEVBQUUsRUFBRTtRQUNsRCxNQUFNLEVBQ0osUUFBUSxFQUNSLFdBQVcsR0FDWixHQUFHLGFBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUU3QixNQUFNLFdBQVcsR0FBRyxJQUFBLGVBQU8sRUFBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUM5QyxJQUFJLEtBQUssRUFBRSxDQUFDO2dCQUNWLEtB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O01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VDb250ZXh0IH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG4vLyBpbXBvcnQgeyBSZXNvbHV0aW9uIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyB1c2VGZWF0dXJlcywgdXNlRmVhdHVyZXNTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mZWF0dXJlcy9ob29rcydcbmltcG9ydCB7IFZpc2lvbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL2ZlYXR1cmVzJ1xuaW1wb3J0IFN3aXRjaCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc3dpdGNoJ1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Rvb2x0aXAnXG5pbXBvcnQgeyBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbi8vIGltcG9ydCBPcHRpb25DYXJkIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvX2Jhc2UvY29tcG9uZW50cy9vcHRpb24tY2FyZCdcbmltcG9ydCBDb25maWdDb250ZXh0IGZyb20gJ0AvY29udGV4dC9kZWJ1Zy1jb25maWd1cmF0aW9uJ1xuaW1wb3J0IFBhcmFtQ29uZmlnIGZyb20gJy4vcGFyYW0tY29uZmlnJ1xuXG5jb25zdCBDb25maWdWaXNpb246IEZDID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyBpc1Nob3dWaXNpb25Db25maWcsIGlzQWxsb3dWaWRlb1VwbG9hZCB9ID0gdXNlQ29udGV4dChDb25maWdDb250ZXh0KVxuICBjb25zdCBmaWxlID0gdXNlRmVhdHVyZXMocyA9PiBzLmZlYXR1cmVzLmZpbGUpXG4gIGNvbnN0IGZlYXR1cmVzU3RvcmUgPSB1c2VGZWF0dXJlc1N0b3JlKClcblxuICBjb25zdCBpc0ltYWdlRW5hYmxlZCA9IGZpbGU/LmFsbG93ZWRfZmlsZV90eXBlcz8uaW5jbHVkZXMoU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5pbWFnZSkgPz8gZmFsc2VcblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSB1c2VDYWxsYmFjaygodmFsdWU6IGJvb2xlYW4pID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBmZWF0dXJlcyxcbiAgICAgIHNldEZlYXR1cmVzLFxuICAgIH0gPSBmZWF0dXJlc1N0b3JlIS5nZXRTdGF0ZSgpXG5cbiAgICBjb25zdCBuZXdGZWF0dXJlcyA9IHByb2R1Y2UoZmVhdHVyZXMsIChkcmFmdCkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGRyYWZ0LmZpbGUhLmFsbG93ZWRfZmlsZV90eXBlcyA9IEFycmF5LmZyb20obmV3IFNldChbXG4gICAgICAgICAgLi4uKGRyYWZ0LmZpbGU/LmFsbG93ZWRfZmlsZV90eXBlcyB8fCBbXSksXG4gICAgICAgICAgU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5pbWFnZSxcbiAgICAgICAgICAuLi4oaXNBbGxvd1ZpZGVvVXBsb2FkID8gW1N1cHBvcnRVcGxvYWRGaWxlVHlwZXMudmlkZW9dIDogW10pLFxuICAgICAgICBdKSlcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkcmFmdC5maWxlIS5hbGxvd2VkX2ZpbGVfdHlwZXMgPSBkcmFmdC5maWxlIS5hbGxvd2VkX2ZpbGVfdHlwZXM/LmZpbHRlcihcbiAgICAgICAgICB0eXBlID0+IHR5cGUgIT09IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuaW1hZ2UgJiYgKGlzQWxsb3dWaWRlb1VwbG9hZCA/IHR5cGUgIT09IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMudmlkZW8gOiB0cnVlKSxcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBpZiAoZHJhZnQuZmlsZSkge1xuICAgICAgICBkcmFmdC5maWxlLmVuYWJsZWQgPSAoZHJhZnQuZmlsZS5hbGxvd2VkX2ZpbGVfdHlwZXM/Lmxlbmd0aCA/PyAwKSA+IDBcbiAgICAgICAgZHJhZnQuZmlsZS5pbWFnZSA9IHtcbiAgICAgICAgICAuLi5kcmFmdC5maWxlLmltYWdlLFxuICAgICAgICAgIGVuYWJsZWQ6IHZhbHVlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBzZXRGZWF0dXJlcyhuZXdGZWF0dXJlcylcbiAgfSwgW2ZlYXR1cmVzU3RvcmUsIGlzQWxsb3dWaWRlb1VwbG9hZF0pXG5cbiAgaWYgKCFpc1Nob3dWaXNpb25Db25maWcpXG4gICAgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiByb3VuZGVkLXhsIGJvcmRlci1sLVswLjVweF0gYm9yZGVyLXQtWzAuNXB4XSBib3JkZXItZWZmZWN0cy1oaWdobGlnaHQgYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcC0yXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNocmluay0wIHAtMVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyLVswLjVweF0gYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLXV0aWwtY29sb3JzLWluZGlnby1pbmRpZ28tNjAwIHAtMSBzaGFkb3cteHNcIj5cbiAgICAgICAgICA8VmlzaW9uIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXByaW1hcnktb24tc3VyZmFjZVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ3JvdyBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgbXItMSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ3Zpc2lvbi5uYW1lJywgeyBuczogJ2FwcERlYnVnJyB9KX08L2Rpdj5cbiAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICBwb3B1cENvbnRlbnQ9eyhcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1bMTgwcHhdXCI+XG4gICAgICAgICAgICAgIHt0KCd2aXNpb24uZGVzY3JpcHRpb24nLCB7IG5zOiAnYXBwRGVidWcnIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICB7LyogPGRpdiBjbGFzc05hbWU9J21yLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTAuNSc+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RleHQtdGV4dC10ZXJ0aWFyeSBzeXN0ZW0teHMtbWVkaXVtLXVwcGVyY2FzZSc+e3QoJ2FwcERlYnVnLnZpc2lvbi52aXNpb25TZXR0aW5ncy5yZXNvbHV0aW9uJyl9PC9kaXY+XG4gICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgIHBvcHVwQ29udGVudD17XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd3LVsxODBweF0nID5cbiAgICAgICAgICAgICAgICB7dCgnYXBwRGVidWcudmlzaW9uLnZpc2lvblNldHRpbmdzLnJlc29sdXRpb25Ub29sdGlwJykuc3BsaXQoJ1xcbicpLm1hcChpdGVtID0+IChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpdGVtfT57aXRlbX08L2Rpdj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+ICovfVxuICAgICAgICB7LyogPGRpdiBjbGFzc05hbWU9J2ZsZXggaXRlbXMtY2VudGVyIGdhcC0xJz5cbiAgICAgICAgICA8T3B0aW9uQ2FyZFxuICAgICAgICAgICAgdGl0bGU9e3QoJ2FwcERlYnVnLnZpc2lvbi52aXNpb25TZXR0aW5ncy5oaWdoJyl9XG4gICAgICAgICAgICBzZWxlY3RlZD17ZmlsZT8uaW1hZ2U/LmRldGFpbCA9PT0gUmVzb2x1dGlvbi5oaWdofVxuICAgICAgICAgICAgb25TZWxlY3Q9eygpID0+IGhhbmRsZUNoYW5nZShSZXNvbHV0aW9uLmhpZ2gpfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPE9wdGlvbkNhcmRcbiAgICAgICAgICAgIHRpdGxlPXt0KCdhcHBEZWJ1Zy52aXNpb24udmlzaW9uU2V0dGluZ3MubG93Jyl9XG4gICAgICAgICAgICBzZWxlY3RlZD17ZmlsZT8uaW1hZ2U/LmRldGFpbCA9PT0gUmVzb2x1dGlvbi5sb3d9XG4gICAgICAgICAgICBvblNlbGVjdD17KCkgPT4gaGFuZGxlQ2hhbmdlKFJlc29sdXRpb24ubG93KX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj4gKi99XG4gICAgICAgIDxQYXJhbUNvbmZpZyAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1sLTEgbXItMyBoLTMuNSB3LVsxcHhdIGJnLWRpdmlkZXItcmVndWxhclwiPjwvZGl2PlxuICAgICAgICA8U3dpdGNoXG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXtpc0ltYWdlRW5hYmxlZH1cbiAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICAgIHNpemU9XCJtZFwiXG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhDb25maWdWaXNpb24pXG4iXX0=