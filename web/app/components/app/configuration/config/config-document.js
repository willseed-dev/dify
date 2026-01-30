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
const ConfigDocument = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const file = (0, hooks_1.useFeatures)(s => s.features.file);
    const featuresStore = (0, hooks_1.useFeaturesStore)();
    const { isShowDocumentConfig } = (0, use_context_selector_1.useContext)(debug_configuration_1.default);
    const isDocumentEnabled = file?.allowed_file_types?.includes(types_1.SupportUploadFileTypes.document) ?? false;
    const handleChange = (0, react_1.useCallback)((value) => {
        const { features, setFeatures, } = featuresStore.getState();
        const newFeatures = (0, immer_1.produce)(features, (draft) => {
            if (value) {
                draft.file.allowed_file_types = Array.from(new Set([
                    ...(draft.file?.allowed_file_types || []),
                    types_1.SupportUploadFileTypes.document,
                ]));
            }
            else {
                draft.file.allowed_file_types = draft.file.allowed_file_types?.filter(type => type !== types_1.SupportUploadFileTypes.document);
            }
            if (draft.file)
                draft.file.enabled = (draft.file.allowed_file_types?.length ?? 0) > 0;
        });
        setFeatures(newFeatures);
    }, [featuresStore]);
    if (!isShowDocumentConfig)
        return null;
    return (<div className="mt-2 flex items-center gap-2 rounded-xl border-l-[0.5px] border-t-[0.5px] bg-background-section-burn p-2">
      <div className="shrink-0 p-1">
        <div className="rounded-lg border-[0.5px] border-divider-subtle bg-util-colors-indigo-indigo-600 p-1 shadow-xs">
          <features_1.Document className="h-4 w-4 text-text-primary-on-surface"/>
        </div>
      </div>
      <div className="flex grow items-center">
        <div className="system-sm-semibold mr-1 text-text-secondary">{t('feature.documentUpload.title', { ns: 'appDebug' })}</div>
        <tooltip_1.default popupContent={(<div className="w-[180px]">
              {t('feature.documentUpload.description', { ns: 'appDebug' })}
            </div>)}/>
      </div>
      <div className="flex shrink-0 items-center">
        <div className="ml-1 mr-3 h-3.5 w-[1px] bg-divider-subtle"></div>
        <switch_1.default defaultValue={isDocumentEnabled} onChange={handleChange} size="md"/>
      </div>
    </div>);
};
exports.default = React.memo(ConfigDocument);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWRvY3VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLWRvY3VtZW50LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsWUFBWSxDQUFBOztBQUVaLGlDQUErQjtBQUMvQiwrQkFBOEI7QUFDOUIsaUNBQW1DO0FBQ25DLGlEQUE4QztBQUM5QywrREFBaUQ7QUFFakQsZ0VBQW9GO0FBQ3BGLDhFQUEwRTtBQUMxRSx5REFBaUQ7QUFDakQsMkRBQW1EO0FBQ25ELDJEQUF3RTtBQUN4RSx1RUFBeUQ7QUFFekQsTUFBTSxjQUFjLEdBQU8sR0FBRyxFQUFFO0lBQzlCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUM5QixNQUFNLElBQUksR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzlDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxJQUFBLGlDQUFVLEVBQUMsNkJBQWEsQ0FBQyxDQUFBO0lBRTFELE1BQU0saUJBQWlCLEdBQUcsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFFBQVEsQ0FBQyw4QkFBc0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUE7SUFFdEcsTUFBTSxZQUFZLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsS0FBYyxFQUFFLEVBQUU7UUFDbEQsTUFBTSxFQUNKLFFBQVEsRUFDUixXQUFXLEdBQ1osR0FBRyxhQUFjLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFN0IsTUFBTSxXQUFXLEdBQUcsSUFBQSxlQUFPLEVBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDOUMsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDVixLQUFLLENBQUMsSUFBSyxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7b0JBQ2xELEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGtCQUFrQixJQUFJLEVBQUUsQ0FBQztvQkFDekMsOEJBQXNCLENBQUMsUUFBUTtpQkFDaEMsQ0FBQyxDQUFDLENBQUE7WUFDTCxDQUFDO2lCQUNJLENBQUM7Z0JBQ0osS0FBSyxDQUFDLElBQUssQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsSUFBSyxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FDckUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssOEJBQXNCLENBQUMsUUFBUSxDQUNqRCxDQUFBO1lBQ0gsQ0FBQztZQUNELElBQUksS0FBSyxDQUFDLElBQUk7Z0JBQ1osS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDekUsQ0FBQyxDQUFDLENBQUE7UUFDRixXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDMUIsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUVuQixJQUFJLENBQUMsb0JBQW9CO1FBQ3ZCLE9BQU8sSUFBSSxDQUFBO0lBRWIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwR0FBMEcsQ0FDdkg7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUMzQjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnR0FBZ0csQ0FDN0c7VUFBQSxDQUFDLG1CQUFRLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxFQUM1RDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQ3JDO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUFDLENBQUMsQ0FBQyxDQUFDLDhCQUE4QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQ3pIO1FBQUEsQ0FBQyxpQkFBTyxDQUNOLFlBQVksQ0FBQyxDQUFDLENBQ1osQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FDeEI7Y0FBQSxDQUFDLENBQUMsQ0FBQyxvQ0FBb0MsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUM5RDtZQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyxFQUVOO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQ3pDO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJDQUEyQyxDQUFDLEVBQUUsR0FBRyxDQUNoRTtRQUFBLENBQUMsZ0JBQU0sQ0FDTCxZQUFZLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUNoQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDdkIsSUFBSSxDQUFDLElBQUksRUFFYjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuaW1wb3J0IHR5cGUgeyBGQyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgdXNlQ29udGV4dCB9IGZyb20gJ3VzZS1jb250ZXh0LXNlbGVjdG9yJ1xuXG5pbXBvcnQgeyB1c2VGZWF0dXJlcywgdXNlRmVhdHVyZXNTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mZWF0dXJlcy9ob29rcydcbmltcG9ydCB7IERvY3VtZW50IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ljb25zL3NyYy92ZW5kZXIvZmVhdHVyZXMnXG5pbXBvcnQgU3dpdGNoIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9zd2l0Y2gnXG5pbXBvcnQgVG9vbHRpcCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9vbHRpcCdcbmltcG9ydCB7IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IENvbmZpZ0NvbnRleHQgZnJvbSAnQC9jb250ZXh0L2RlYnVnLWNvbmZpZ3VyYXRpb24nXG5cbmNvbnN0IENvbmZpZ0RvY3VtZW50OiBGQyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IGZpbGUgPSB1c2VGZWF0dXJlcyhzID0+IHMuZmVhdHVyZXMuZmlsZSlcbiAgY29uc3QgZmVhdHVyZXNTdG9yZSA9IHVzZUZlYXR1cmVzU3RvcmUoKVxuICBjb25zdCB7IGlzU2hvd0RvY3VtZW50Q29uZmlnIH0gPSB1c2VDb250ZXh0KENvbmZpZ0NvbnRleHQpXG5cbiAgY29uc3QgaXNEb2N1bWVudEVuYWJsZWQgPSBmaWxlPy5hbGxvd2VkX2ZpbGVfdHlwZXM/LmluY2x1ZGVzKFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuZG9jdW1lbnQpID8/IGZhbHNlXG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gdXNlQ2FsbGJhY2soKHZhbHVlOiBib29sZWFuKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZmVhdHVyZXMsXG4gICAgICBzZXRGZWF0dXJlcyxcbiAgICB9ID0gZmVhdHVyZXNTdG9yZSEuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgbmV3RmVhdHVyZXMgPSBwcm9kdWNlKGZlYXR1cmVzLCAoZHJhZnQpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBkcmFmdC5maWxlIS5hbGxvd2VkX2ZpbGVfdHlwZXMgPSBBcnJheS5mcm9tKG5ldyBTZXQoW1xuICAgICAgICAgIC4uLihkcmFmdC5maWxlPy5hbGxvd2VkX2ZpbGVfdHlwZXMgfHwgW10pLFxuICAgICAgICAgIFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuZG9jdW1lbnQsXG4gICAgICAgIF0pKVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGRyYWZ0LmZpbGUhLmFsbG93ZWRfZmlsZV90eXBlcyA9IGRyYWZ0LmZpbGUhLmFsbG93ZWRfZmlsZV90eXBlcz8uZmlsdGVyKFxuICAgICAgICAgIHR5cGUgPT4gdHlwZSAhPT0gU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5kb2N1bWVudCxcbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgaWYgKGRyYWZ0LmZpbGUpXG4gICAgICAgIGRyYWZ0LmZpbGUuZW5hYmxlZCA9IChkcmFmdC5maWxlLmFsbG93ZWRfZmlsZV90eXBlcz8ubGVuZ3RoID8/IDApID4gMFxuICAgIH0pXG4gICAgc2V0RmVhdHVyZXMobmV3RmVhdHVyZXMpXG4gIH0sIFtmZWF0dXJlc1N0b3JlXSlcblxuICBpZiAoIWlzU2hvd0RvY3VtZW50Q29uZmlnKVxuICAgIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgcm91bmRlZC14bCBib3JkZXItbC1bMC41cHhdIGJvcmRlci10LVswLjVweF0gYmctYmFja2dyb3VuZC1zZWN0aW9uLWJ1cm4gcC0yXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNocmluay0wIHAtMVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyLVswLjVweF0gYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLXV0aWwtY29sb3JzLWluZGlnby1pbmRpZ28tNjAwIHAtMSBzaGFkb3cteHNcIj5cbiAgICAgICAgICA8RG9jdW1lbnQgY2xhc3NOYW1lPVwiaC00IHctNCB0ZXh0LXRleHQtcHJpbWFyeS1vbi1zdXJmYWNlXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCBtci0xIHRleHQtdGV4dC1zZWNvbmRhcnlcIj57dCgnZmVhdHVyZS5kb2N1bWVudFVwbG9hZC50aXRsZScsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9PC9kaXY+XG4gICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgcG9wdXBDb250ZW50PXsoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctWzE4MHB4XVwiPlxuICAgICAgICAgICAgICB7dCgnZmVhdHVyZS5kb2N1bWVudFVwbG9hZC5kZXNjcmlwdGlvbicsIHsgbnM6ICdhcHBEZWJ1ZycgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc2hyaW5rLTAgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWwtMSBtci0zIGgtMy41IHctWzFweF0gYmctZGl2aWRlci1zdWJ0bGVcIj48L2Rpdj5cbiAgICAgICAgPFN3aXRjaFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17aXNEb2N1bWVudEVuYWJsZWR9XG4gICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICBzaXplPVwibWRcIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Lm1lbW8oQ29uZmlnRG9jdW1lbnQpXG4iXX0=