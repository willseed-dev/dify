"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_form_1 = require("@tanstack/react-form");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const form_1 = require("@/app/components/base/form");
const hooks_1 = require("./hooks");
const ShowAllSettings = ({ initialData, handleShowAllSettings, }) => (0, form_1.withForm)({
    defaultValues: initialData,
    render: function Render({ form, }) {
        const { t } = (0, react_i18next_1.useTranslation)();
        const type = (0, react_form_1.useStore)(form.store, state => state.values.type);
        const hiddenFieldNames = (0, hooks_1.useHiddenFieldNames)(type);
        return (<div className="flex cursor-pointer items-center gap-x-4" onClick={handleShowAllSettings}>
        <div className="flex grow flex-col">
          <span className="system-sm-medium flex min-h-6 items-center text-text-secondary">
            {t('variableConfig.showAllSettings', { ns: 'appDebug' })}
          </span>
          <span className="body-xs-regular pb-0.5 text-text-tertiary first-letter:capitalize">
            {hiddenFieldNames}
          </span>
        </div>
        <react_1.RiArrowRightSLine className="h-4 w-4 shrink-0 text-text-secondary"/>
      </div>);
    },
});
exports.default = ShowAllSettings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvdy1hbGwtc2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzaG93LWFsbC1zZXR0aW5ncy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBb0Q7QUFDcEQscURBQStDO0FBQy9DLCtCQUE4QjtBQUM5QixpREFBOEM7QUFDOUMscURBQXFEO0FBQ3JELG1DQUE2QztBQU83QyxNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQ3ZCLFdBQVcsRUFDWCxxQkFBcUIsR0FDQSxFQUFFLEVBQUUsQ0FBQyxJQUFBLGVBQVEsRUFBQztJQUNuQyxhQUFhLEVBQUUsV0FBVztJQUMxQixNQUFNLEVBQUUsU0FBUyxNQUFNLENBQUMsRUFDdEIsSUFBSSxHQUNMO1FBQ0MsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO1FBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUEscUJBQVEsRUFBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUU3RCxNQUFNLGdCQUFnQixHQUFHLElBQUEsMkJBQW1CLEVBQUMsSUFBSSxDQUFDLENBQUE7UUFFbEQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwQ0FBMEMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUN2RjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FDakM7VUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0VBQWdFLENBQzlFO1lBQUEsQ0FBQyxDQUFDLENBQUMsZ0NBQWdDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDMUQ7VUFBQSxFQUFFLElBQUksQ0FDTjtVQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtRUFBbUUsQ0FDakY7WUFBQSxDQUFDLGdCQUFnQixDQUNuQjtVQUFBLEVBQUUsSUFBSSxDQUNSO1FBQUEsRUFBRSxHQUFHLENBQ0w7UUFBQSxDQUFDLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsRUFDckU7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsa0JBQWUsZUFBZSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmlBcnJvd1JpZ2h0U0xpbmUgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RvcmUgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtZm9ybSdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgd2l0aEZvcm0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybSdcbmltcG9ydCB7IHVzZUhpZGRlbkZpZWxkTmFtZXMgfSBmcm9tICcuL2hvb2tzJ1xuXG50eXBlIFNob3dBbGxTZXR0aW5nc1Byb3BzID0ge1xuICBpbml0aWFsRGF0YT86IFJlY29yZDxzdHJpbmcsIGFueT5cbiAgaGFuZGxlU2hvd0FsbFNldHRpbmdzOiAoKSA9PiB2b2lkXG59XG5cbmNvbnN0IFNob3dBbGxTZXR0aW5ncyA9ICh7XG4gIGluaXRpYWxEYXRhLFxuICBoYW5kbGVTaG93QWxsU2V0dGluZ3MsXG59OiBTaG93QWxsU2V0dGluZ3NQcm9wcykgPT4gd2l0aEZvcm0oe1xuICBkZWZhdWx0VmFsdWVzOiBpbml0aWFsRGF0YSxcbiAgcmVuZGVyOiBmdW5jdGlvbiBSZW5kZXIoe1xuICAgIGZvcm0sXG4gIH0pIHtcbiAgICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgICBjb25zdCB0eXBlID0gdXNlU3RvcmUoZm9ybS5zdG9yZSwgc3RhdGUgPT4gc3RhdGUudmFsdWVzLnR5cGUpXG5cbiAgICBjb25zdCBoaWRkZW5GaWVsZE5hbWVzID0gdXNlSGlkZGVuRmllbGROYW1lcyh0eXBlKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBjdXJzb3ItcG9pbnRlciBpdGVtcy1jZW50ZXIgZ2FwLXgtNFwiIG9uQ2xpY2s9e2hhbmRsZVNob3dBbGxTZXR0aW5nc30+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBncm93IGZsZXgtY29sXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3lzdGVtLXNtLW1lZGl1bSBmbGV4IG1pbi1oLTYgaXRlbXMtY2VudGVyIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgICAgIHt0KCd2YXJpYWJsZUNvbmZpZy5zaG93QWxsU2V0dGluZ3MnLCB7IG5zOiAnYXBwRGVidWcnIH0pfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJib2R5LXhzLXJlZ3VsYXIgcGItMC41IHRleHQtdGV4dC10ZXJ0aWFyeSBmaXJzdC1sZXR0ZXI6Y2FwaXRhbGl6ZVwiPlxuICAgICAgICAgICAge2hpZGRlbkZpZWxkTmFtZXN9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFJpQXJyb3dSaWdodFNMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgc2hyaW5rLTAgdGV4dC10ZXh0LXNlY29uZGFyeVwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KVxuXG5leHBvcnQgZGVmYXVsdCBTaG93QWxsU2V0dGluZ3NcbiJdfQ==