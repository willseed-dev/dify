"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
const React = require("react");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const use_context_selector_1 = require("use-context-selector");
const hooks_1 = require("@/app/components/base/features/hooks");
const features_1 = require("@/app/components/base/icons/src/vender/features");
const switch_1 = require("@/app/components/base/switch");
const tooltip_1 = require("@/app/components/base/tooltip");
const types_1 = require("@/app/components/workflow/types");
const debug_configuration_1 = require("@/context/debug-configuration");
const ConfigAudio = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const file = (0, hooks_1.useFeatures)(s => s.features.file);
    const featuresStore = (0, hooks_1.useFeaturesStore)();
    const { isShowAudioConfig } = (0, use_context_selector_1.useContext)(debug_configuration_1.default);
    const isAudioEnabled = file?.allowed_file_types?.includes(types_1.SupportUploadFileTypes.audio) ?? false;
    const handleChange = (0, react_1.useCallback)((value) => {
        const { features, setFeatures, } = featuresStore.getState();
        const newFeatures = (0, immer_1.produce)(features, (draft) => {
            if (value) {
                draft.file.allowed_file_types = Array.from(new Set([
                    ...(draft.file?.allowed_file_types || []),
                    types_1.SupportUploadFileTypes.audio,
                ]));
            }
            else {
                draft.file.allowed_file_types = draft.file.allowed_file_types?.filter(type => type !== types_1.SupportUploadFileTypes.audio);
            }
            if (draft.file)
                draft.file.enabled = (draft.file.allowed_file_types?.length ?? 0) > 0;
        });
        setFeatures(newFeatures);
    }, [featuresStore]);
    if (!isShowAudioConfig)
        return null;
    return (<div className="mt-2 flex items-center gap-2 rounded-xl border-l-[0.5px] border-t-[0.5px] bg-background-section-burn p-2">
      <div className="shrink-0 p-1">
        <div className="rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-violet-violet-600 p-1 shadow-xs">
          <features_1.Microphone01 className="h-4 w-4 text-text-primary-on-surface"/>
        </div>
      </div>
      <div className="flex grow items-center">
        <div className="system-sm-semibold mr-1 text-text-secondary">{t('feature.audioUpload.title', { ns: 'appDebug' })}</div>
        <tooltip_1.default popupContent={(<div className="w-[180px]">
              {t('feature.audioUpload.description', { ns: 'appDebug' })}
            </div>)}/>
      </div>
      <div className="flex shrink-0 items-center">
        <div className="ml-1 mr-3 h-3.5 w-[1px] bg-divider-subtle"></div>
        <switch_1.default defaultValue={isAudioEnabled} onChange={handleChange} size="md"/>
      </div>
    </div>);
};
exports.default = React.memo(ConfigAudio);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWF1ZGlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLWF1ZGlvLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUVaLGlDQUErQjtBQUMvQiwrQkFBOEI7QUFDOUIsaUNBQW1DO0FBQ25DLGlEQUE4QztBQUM5QywrREFBaUQ7QUFFakQsZ0VBQW9GO0FBQ3BGLDhFQUE4RTtBQUM5RSx5REFBaUQ7QUFDakQsMkRBQW1EO0FBQ25ELDJEQUF3RTtBQUN4RSx1RUFBeUQ7QUFFekQsTUFBTSxXQUFXLEdBQU8sR0FBRyxFQUFFO0lBQzNCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLElBQUksR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzlDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxJQUFBLGlDQUFVLEVBQUMsNkJBQWEsQ0FBQyxDQUFBO0lBRXZELE1BQU0sY0FBYyxHQUFHLElBQUksRUFBRSxrQkFBa0IsRUFBRSxRQUFRLENBQUMsOEJBQXNCLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFBO0lBRWhHLE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLEtBQWMsRUFBRSxFQUFFO1FBQ2xELE1BQU0sRUFDSixRQUFRLEVBQ1IsV0FBVyxHQUNaLEdBQUcsYUFBYyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRTdCLE1BQU0sV0FBVyxHQUFHLElBQUEsZUFBTyxFQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzlDLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQ1YsS0FBSyxDQUFDLElBQUssQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO29CQUNsRCxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxrQkFBa0IsSUFBSSxFQUFFLENBQUM7b0JBQ3pDLDhCQUFzQixDQUFDLEtBQUs7aUJBQzdCLENBQUMsQ0FBQyxDQUFBO1lBQ0wsQ0FBQztpQkFDSSxDQUFDO2dCQUNKLEtBQUssQ0FBQyxJQUFLLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLElBQUssQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQ3JFLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLDhCQUFzQixDQUFDLEtBQUssQ0FDOUMsQ0FBQTtZQUNILENBQUM7WUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJO2dCQUNaLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3pFLENBQUMsQ0FBQyxDQUFBO1FBQ0YsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzFCLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFbkIsSUFBSSxDQUFDLGlCQUFpQjtRQUNwQixPQUFPLElBQUksQ0FBQTtJQUViLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEdBQTBHLENBQ3ZIO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FDM0I7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0dBQWdHLENBQzdHO1VBQUEsQ0FBQyx1QkFBWSxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsRUFDaEU7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUNyQztRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUN0SDtRQUFBLENBQUMsaUJBQU8sQ0FDTixZQUFZLENBQUMsQ0FBQyxDQUNaLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQ3hCO2NBQUEsQ0FBQyxDQUFDLENBQUMsaUNBQWlDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDM0Q7WUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUMsRUFFTjtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUN6QztRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywyQ0FBMkMsQ0FBQyxFQUFFLEdBQUcsQ0FDaEU7UUFBQSxDQUFDLGdCQUFNLENBQ0wsWUFBWSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQzdCLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUN2QixJQUFJLENBQUMsSUFBSSxFQUViO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VDb250ZXh0IH0gZnJvbSAndXNlLWNvbnRleHQtc2VsZWN0b3InXG5cbmltcG9ydCB7IHVzZUZlYXR1cmVzLCB1c2VGZWF0dXJlc1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ZlYXR1cmVzL2hvb2tzJ1xuaW1wb3J0IHsgTWljcm9waG9uZTAxIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvZmVhdHVyZXMnXG5pbXBvcnQgU3dpdGNoIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9zd2l0Y2gnXG5pbXBvcnQgVG9vbHRpcCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9vbHRpcCdcbmltcG9ydCB7IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IENvbmZpZ0NvbnRleHQgZnJvbSAnQC9jb250ZXh0L2RlYnVnLWNvbmZpZ3VyYXRpb24nXG5cbmNvbnN0IENvbmZpZ0F1ZGlvOiBGQyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGZpbGUgPSB1c2VGZWF0dXJlcyhzID0+IHMuZmVhdHVyZXMuZmlsZSlcbiAgY29uc3QgZmVhdHVyZXNTdG9yZSA9IHVzZUZlYXR1cmVzU3RvcmUoKVxuICBjb25zdCB7IGlzU2hvd0F1ZGlvQ29uZmlnIH0gPSB1c2VDb250ZXh0KENvbmZpZ0NvbnRleHQpXG5cbiAgY29uc3QgaXNBdWRpb0VuYWJsZWQgPSBmaWxlPy5hbGxvd2VkX2ZpbGVfdHlwZXM/LmluY2x1ZGVzKFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuYXVkaW8pID8/IGZhbHNlXG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHZhbHVlOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZmVhdHVyZXMsXG4gICAgICBzZXRGZWF0dXJlcyxcbiAgICB9ID0gZmVhdHVyZXNTdG9yZSEuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgbmV3RmVhdHVyZXMgPSBwcm9kdWNlKGZlYXR1cmVzLCAoZHJhZnQpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBkcmFmdC5maWxlIS5hbGxvd2VkX2ZpbGVfdHlwZXMgPSBBcnJheS5mcm9tKG5ldyBTZXQoW1xuICAgICAgICAgIC4uLihkcmFmdC5maWxlPy5hbGxvd2VkX2ZpbGVfdHlwZXMgfHwgW10pLFxuICAgICAgICAgIFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuYXVkaW8sXG4gICAgICAgIF0pKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRyYWZ0LmZpbGUhLmFsbG93ZWRfZmlsZV90eXBlcyA9IGRyYWZ0LmZpbGUhLmFsbG93ZWRfZmlsZV90eXBlcz8uZmlsdGVyKFxuICAgICAgICAgIHR5cGUgPT4gdHlwZSAhPT0gU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5hdWRpbyxcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgaWYgKGRyYWZ0LmZpbGUpXG4gICAgICAgIGRyYWZ0LmZpbGUuZW5hYmxlZCA9IChkcmFmdC5maWxlLmFsbG93ZWRfZmlsZV90eXBlcz8ubGVuZ3RoID8/IDApID4gMFxuICAgIH0pXG4gICAgc2V0RmVhdHVyZXMobmV3RmVhdHVyZXMpXG4gIH0sIFtmZWF0dXJlc1N0b3JlXSlcblxuICBpZiAoIWlzU2hvd0F1ZGlvQ29uZmlnKVxuICAgIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC14bCBib3JkZXItbC1bMC41cHhdIGJvcmRlci10LVswLjVweF0gYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcC0yXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNocmluay0wIHAtMVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyLVswLjVweF0gYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLXV0aWwtY29sb3JzLXZpb2xldC12aW9sZXQtNjAwIHAtMSBzaGFkb3cteHNcIj5cbiAgICAgICAgICA8TWljcm9waG9uZTAxIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXByaW1hcnktb24tc3VyZmFjZVwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ3JvdyBpdGVtcy1jZW50ZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0tc20tc2VtaWJvbGQgbXItMSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+e3QoJ2ZlYXR1cmUuYXVkaW9VcGxvYWQudGl0bGUnLCB7IG5zOiAnYXBwRGVidWcnIH0pfTwvZGl2PlxuICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgIHBvcHVwQ29udGVudD17KFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LVsxODBweF1cIj5cbiAgICAgICAgICAgICAge3QoJ2ZlYXR1cmUuYXVkaW9VcGxvYWQuZGVzY3JpcHRpb24nLCB7IG5zOiAnYXBwRGVidWcnIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNocmluay0wIGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1sLTEgbXItMyBoLTMuNSB3LVsxcHhdIGJnLWRpdmlkZXItc3VidGxlXCI+PC9kaXY+XG4gICAgICAgIDxTd2l0Y2hcbiAgICAgICAgICBkZWZhdWx0VmFsdWU9e2lzQXVkaW9FbmFibGVkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICAgICAgc2l6ZT1cIm1kXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKENvbmZpZ0F1ZGlvKVxuIl19