"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _i18n_1 = require("#i18n");
const form_1 = require("@/app/components/datasets/settings/form");
const Settings = () => {
    const { t } = (0, _i18n_1.useTranslation)('datasetSettings');
    return (<div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-y-0.5 px-6 pb-2 pt-3">
        <div className="system-xl-semibold text-text-primary">{t('title')}</div>
        <div className="system-sm-regular text-text-tertiary">{t('desc')}</div>
      </div>
      <form_1.default />
    </div>);
};
exports.default = Settings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhZ2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQXNDO0FBQ3RDLGtFQUEwRDtBQUUxRCxNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7SUFDcEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsc0JBQWMsRUFBQyxpQkFBaUIsQ0FBQyxDQUFBO0lBRS9DLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQ3JDO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHdDQUF3QyxDQUNyRDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FDdkU7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQ3hFO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLGNBQUksQ0FBQyxBQUFELEVBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxRQUFRLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJyNpMThuJ1xuaW1wb3J0IEZvcm0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9zZXR0aW5ncy9mb3JtJ1xuXG5jb25zdCBTZXR0aW5ncyA9ICgpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbignZGF0YXNldFNldHRpbmdzJylcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiaC1mdWxsIG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGdhcC15LTAuNSBweC02IHBiLTIgcHQtM1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14bC1zZW1pYm9sZCB0ZXh0LXRleHQtcHJpbWFyeVwiPnt0KCd0aXRsZScpfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1yZWd1bGFyIHRleHQtdGV4dC10ZXJ0aWFyeVwiPnt0KCdkZXNjJyl9PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxGb3JtIC8+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgU2V0dGluZ3NcbiJdfQ==