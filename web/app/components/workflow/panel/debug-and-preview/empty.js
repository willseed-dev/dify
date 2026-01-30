"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_i18next_1 = require("react-i18next");
const communication_1 = require("@/app/components/base/icons/src/vender/line/communication");
const Empty = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="mb-2 flex justify-center">
        <communication_1.ChatBotSlim className="h-12 w-12 text-gray-300"/>
      </div>
      <div className="w-[256px] text-center text-[13px] text-gray-400">
        {t('common.previewPlaceholder', { ns: 'workflow' })}
      </div>
    </div>);
};
exports.default = Empty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbXB0eS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBOEM7QUFDOUMsNkZBQXVGO0FBRXZGLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRTtJQUNqQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2REFBNkQsQ0FDMUU7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQ3ZDO1FBQUEsQ0FBQywyQkFBVyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsRUFDbEQ7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpREFBaUQsQ0FDOUQ7UUFBQSxDQUFDLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUNyRDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsS0FBSyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgQ2hhdEJvdFNsaW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9saW5lL2NvbW11bmljYXRpb24nXG5cbmNvbnN0IEVtcHR5ID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgbGVmdC0xLzIgdG9wLTEvMiAtdHJhbnNsYXRlLXgtMS8yIC10cmFuc2xhdGUteS0xLzJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMiBmbGV4IGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgIDxDaGF0Qm90U2xpbSBjbGFzc05hbWU9XCJoLTEyIHctMTIgdGV4dC1ncmF5LTMwMFwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1bMjU2cHhdIHRleHQtY2VudGVyIHRleHQtWzEzcHhdIHRleHQtZ3JheS00MDBcIj5cbiAgICAgICAge3QoJ2NvbW1vbi5wcmV2aWV3UGxhY2Vob2xkZXInLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgRW1wdHlcbiJdfQ==