"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const types_1 = require("./types");
const ErrorHandleTip = ({ type, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const text = (0, react_2.useMemo)(() => {
        if (type === types_1.ErrorHandleTypeEnum.failBranch)
            return t('nodes.common.errorHandle.failBranch.inLog', { ns: 'workflow' });
        if (type === types_1.ErrorHandleTypeEnum.defaultValue)
            return t('nodes.common.errorHandle.defaultValue.inLog', { ns: 'workflow' });
    }, [t, type]);
    if (!type)
        return null;
    return (<div className="relative flex rounded-lg border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-2 pr-[52px] shadow-xs">
      <div className="absolute inset-0 rounded-lg opacity-40" style={{
            background: 'linear-gradient(92deg, rgba(247, 144, 9, 0.25) 0%, rgba(255, 255, 255, 0.00) 100%)',
        }}>
      </div>
      <react_1.RiAlertFill className="mr-1 h-4 w-4 shrink-0 text-text-warning-secondary"/>
      <div className="system-xs-medium grow text-text-primary">
        {text}
      </div>
    </div>);
};
exports.default = ErrorHandleTip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItaGFuZGxlLXRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVycm9yLWhhbmRsZS10aXAudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQThDO0FBQzlDLGlDQUErQjtBQUMvQixpREFBOEM7QUFDOUMsbUNBQTZDO0FBSzdDLE1BQU0sY0FBYyxHQUFHLENBQUMsRUFDdEIsSUFBSSxHQUNnQixFQUFFLEVBQUU7SUFDeEIsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLElBQUEsOEJBQWMsR0FBRSxDQUFBO0lBRTlCLE1BQU0sSUFBSSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUN4QixJQUFJLElBQUksS0FBSywyQkFBbUIsQ0FBQyxVQUFVO1lBQ3pDLE9BQU8sQ0FBQyxDQUFDLDJDQUEyQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7UUFFM0UsSUFBSSxJQUFJLEtBQUssMkJBQW1CLENBQUMsWUFBWTtZQUMzQyxPQUFPLENBQUMsQ0FBQyw2Q0FBNkMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO0lBQy9FLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBRWIsSUFBSSxDQUFDLElBQUk7UUFDUCxPQUFPLElBQUksQ0FBQTtJQUViLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FDRixTQUFTLENBQUMsNEhBQTRILENBRXRJO01BQUEsQ0FBQyxHQUFHLENBQ0YsU0FBUyxDQUFDLHdDQUF3QyxDQUNsRCxLQUFLLENBQUMsQ0FBQztZQUNMLFVBQVUsRUFBRSxvRkFBb0Y7U0FDakcsQ0FBQyxDQUVKO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLG1CQUFXLENBQUMsU0FBUyxDQUFDLG1EQUFtRCxFQUMxRTtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5Q0FBeUMsQ0FDdEQ7UUFBQSxDQUFDLElBQUksQ0FDUDtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmlBbGVydEZpbGwgfSBmcm9tICdAcmVtaXhpY29uL3JlYWN0J1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IHsgRXJyb3JIYW5kbGVUeXBlRW51bSB9IGZyb20gJy4vdHlwZXMnXG5cbnR5cGUgRXJyb3JIYW5kbGVUaXBQcm9wcyA9IHtcbiAgdHlwZT86IEVycm9ySGFuZGxlVHlwZUVudW1cbn1cbmNvbnN0IEVycm9ySGFuZGxlVGlwID0gKHtcbiAgdHlwZSxcbn06IEVycm9ySGFuZGxlVGlwUHJvcHMpID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgY29uc3QgdGV4dCA9IHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICh0eXBlID09PSBFcnJvckhhbmRsZVR5cGVFbnVtLmZhaWxCcmFuY2gpXG4gICAgICByZXR1cm4gdCgnbm9kZXMuY29tbW9uLmVycm9ySGFuZGxlLmZhaWxCcmFuY2guaW5Mb2cnLCB7IG5zOiAnd29ya2Zsb3cnIH0pXG5cbiAgICBpZiAodHlwZSA9PT0gRXJyb3JIYW5kbGVUeXBlRW51bS5kZWZhdWx0VmFsdWUpXG4gICAgICByZXR1cm4gdCgnbm9kZXMuY29tbW9uLmVycm9ySGFuZGxlLmRlZmF1bHRWYWx1ZS5pbkxvZycsIHsgbnM6ICd3b3JrZmxvdycgfSlcbiAgfSwgW3QsIHR5cGVdKVxuXG4gIGlmICghdHlwZSlcbiAgICByZXR1cm4gbnVsbFxuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCByb3VuZGVkLWxnIGJvcmRlci1bMC41cHhdIGJvcmRlci1jb21wb25lbnRzLXBhbmVsLWJvcmRlciBiZy1jb21wb25lbnRzLXBhbmVsLWJnLWJsdXIgcC0yIHByLVs1MnB4XSBzaGFkb3cteHNcIlxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCByb3VuZGVkLWxnIG9wYWNpdHktNDBcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQoOTJkZWcsIHJnYmEoMjQ3LCAxNDQsIDksIDAuMjUpIDAlLCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDApIDEwMCUpJyxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgIDwvZGl2PlxuICAgICAgPFJpQWxlcnRGaWxsIGNsYXNzTmFtZT1cIm1yLTEgaC00IHctNCBzaHJpbmstMCB0ZXh0LXRleHQtd2FybmluZy1zZWNvbmRhcnlcIiAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzeXN0ZW0teHMtbWVkaXVtIGdyb3cgdGV4dC10ZXh0LXByaW1hcnlcIj5cbiAgICAgICAge3RleHR9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBFcnJvckhhbmRsZVRpcFxuIl19