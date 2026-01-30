"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const store_1 = require("@/app/components/workflow/store");
const PublishToast = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const publishedAt = (0, store_1.useStore)(s => s.publishedAt);
    const [hideToast, setHideToast] = (0, react_2.useState)(false);
    if (publishedAt || hideToast)
        return null;
    return (<div className="pointer-events-none absolute bottom-[45px] left-0 right-0 z-10 flex justify-center">
      <div className="relative flex w-[420px] space-x-1 overflow-hidden rounded-xl border border-components-panel-border bg-components-panel-bg-blur p-3 shadow-lg">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-components-badge-status-light-normal-halo to-background-gradient-mask-transparent opacity-[0.4]">
        </div>
        <div className="flex h-6 w-6 items-center justify-center">
          <react_1.RiInformation2Fill className="text-text-accent"/>
        </div>
        <div className="p-1">
          <div className="system-sm-semibold mb-1 text-text-primary">{t('publishToast.title', { ns: 'pipeline' })}</div>
          <div className="system-xs-regular text-text-secondary">
            {t('publishToast.desc', { ns: 'pipeline' })}
          </div>
        </div>
        <div className="pointer-events-auto flex h-6 w-6 cursor-pointer items-center justify-center" onClick={() => setHideToast(true)}>
          <react_1.RiCloseLine className="h-4 w-4 text-text-tertiary"/>
        </div>
      </div>
    </div>);
};
exports.default = (0, react_2.memo)(PublishToast);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGlzaC10b2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInB1Ymxpc2gtdG9hc3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBR3lCO0FBQ3pCLGlDQUdjO0FBQ2QsaURBQThDO0FBQzlDLDJEQUEwRDtBQUUxRCxNQUFNLFlBQVksR0FBRyxHQUFHLEVBQUU7SUFDeEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBQzlCLE1BQU0sV0FBVyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUNoRCxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUVqRCxJQUFJLFdBQVcsSUFBSSxTQUFTO1FBQzFCLE9BQU8sSUFBSSxDQUFBO0lBRWIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvRkFBb0YsQ0FDakc7TUFBQSxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsOElBQThJLENBRXhKO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRKQUE0SixDQUMzSztRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBDQUEwQyxDQUN2RDtVQUFBLENBQUMsMEJBQWtCLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUNsRDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FDbEI7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FDN0c7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsdUNBQXVDLENBQ3BEO1lBQUEsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDN0M7VUFBQSxFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNMO1FBQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLDZFQUE2RSxDQUN2RixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FFbEM7VUFBQSxDQUFDLG1CQUFXLENBQUMsU0FBUyxDQUFDLDRCQUE0QixFQUNyRDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxJQUFBLFlBQUksRUFBQyxZQUFZLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIFJpQ2xvc2VMaW5lLFxuICBSaUluZm9ybWF0aW9uMkZpbGwsXG59IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQge1xuICBtZW1vLFxuICB1c2VTdGF0ZSxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5cbmNvbnN0IFB1Ymxpc2hUb2FzdCA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IHB1Ymxpc2hlZEF0ID0gdXNlU3RvcmUocyA9PiBzLnB1Ymxpc2hlZEF0KVxuICBjb25zdCBbaGlkZVRvYXN0LCBzZXRIaWRlVG9hc3RdID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgaWYgKHB1Ymxpc2hlZEF0IHx8IGhpZGVUb2FzdClcbiAgICByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lIGFic29sdXRlIGJvdHRvbS1bNDVweF0gbGVmdC0wIHJpZ2h0LTAgei0xMCBmbGV4IGp1c3RpZnktY2VudGVyXCI+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIGZsZXggdy1bNDIwcHhdIHNwYWNlLXgtMSBvdmVyZmxvdy1oaWRkZW4gcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyIGJnLWNvbXBvbmVudHMtcGFuZWwtYmctYmx1ciBwLTMgc2hhZG93LWxnXCJcbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwb2ludGVyLWV2ZW50cy1ub25lIGFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tciBmcm9tLWNvbXBvbmVudHMtYmFkZ2Utc3RhdHVzLWxpZ2h0LW5vcm1hbC1oYWxvIHRvLWJhY2tncm91bmQtZ3JhZGllbnQtbWFzay10cmFuc3BhcmVudCBvcGFjaXR5LVswLjRdXCI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC02IHctNiBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICA8UmlJbmZvcm1hdGlvbjJGaWxsIGNsYXNzTmFtZT1cInRleHQtdGV4dC1hY2NlbnRcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTFcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1zZW1pYm9sZCBtYi0xIHRleHQtdGV4dC1wcmltYXJ5XCI+e3QoJ3B1Ymxpc2hUb2FzdC50aXRsZScsIHsgbnM6ICdwaXBlbGluZScgfSl9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtcmVndWxhciB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgICB7dCgncHVibGlzaFRvYXN0LmRlc2MnLCB7IG5zOiAncGlwZWxpbmUnIH0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cInBvaW50ZXItZXZlbnRzLWF1dG8gZmxleCBoLTYgdy02IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SGlkZVRvYXN0KHRydWUpfVxuICAgICAgICA+XG4gICAgICAgICAgPFJpQ2xvc2VMaW5lIGNsYXNzTmFtZT1cImgtNCB3LTQgdGV4dC10ZXh0LXRlcnRpYXJ5XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBtZW1vKFB1Ymxpc2hUb2FzdClcbiJdfQ==