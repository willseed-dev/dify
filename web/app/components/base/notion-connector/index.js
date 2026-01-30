"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("../button");
const common_1 = require("../icons/src/public/common");
const others_1 = require("../icons/src/vender/line/others");
const NotionConnector = ({ onSetting }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="flex flex-col items-start rounded-2xl bg-workflow-process-bg p-6">
      <div className="mb-2 h-12 w-12 rounded-[10px] border-[0.5px] border-components-card-border p-3 shadow-lg shadow-shadow-shadow-5">
        <common_1.Notion className="size-6"/>
      </div>
      <div className="mb-1 flex flex-col gap-y-1 pb-3 pt-1">
        <span className="system-md-semibold text-text-secondary">
          {t('stepOne.notionSyncTitle', { ns: 'datasetCreation' })}
          <others_1.Icon3Dots className="relative -left-1.5 -top-2.5 inline h-4 w-4 text-text-secondary"/>
        </span>
        <div className="system-sm-regular text-text-tertiary">{t('stepOne.notionSyncTip', { ns: 'datasetCreation' })}</div>
      </div>
      <button_1.default variant="primary" onClick={onSetting}>{t('stepOne.connect', { ns: 'datasetCreation' })}</button_1.default>
    </div>);
};
exports.default = React.memo(NotionConnector);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBOEI7QUFDOUIsaURBQThDO0FBQzlDLHNDQUE4QjtBQUM5Qix1REFBbUQ7QUFDbkQsNERBQTJEO0FBTTNELE1BQU0sZUFBZSxHQUFHLENBQUMsRUFBRSxTQUFTLEVBQXdCLEVBQUUsRUFBRTtJQUM5RCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrRUFBa0UsQ0FDL0U7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUhBQWlILENBQzlIO1FBQUEsQ0FBQyxlQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFDNUI7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsQ0FDbkQ7UUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsd0NBQXdDLENBQ3REO1VBQUEsQ0FBQyxDQUFDLENBQUMseUJBQXlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUN4RDtVQUFBLENBQUMsa0JBQVMsQ0FBQyxTQUFTLENBQUMsZ0VBQWdFLEVBQ3ZGO1FBQUEsRUFBRSxJQUFJLENBQ047UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUNwSDtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsZ0JBQU0sQ0FDekc7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2J1dHRvbidcbmltcG9ydCB7IE5vdGlvbiB9IGZyb20gJy4uL2ljb25zL3NyYy9wdWJsaWMvY29tbW9uJ1xuaW1wb3J0IHsgSWNvbjNEb3RzIH0gZnJvbSAnLi4vaWNvbnMvc3JjL3ZlbmRlci9saW5lL290aGVycydcblxudHlwZSBOb3Rpb25Db25uZWN0b3JQcm9wcyA9IHtcbiAgb25TZXR0aW5nOiAoKSA9PiB2b2lkXG59XG5cbmNvbnN0IE5vdGlvbkNvbm5lY3RvciA9ICh7IG9uU2V0dGluZyB9OiBOb3Rpb25Db25uZWN0b3JQcm9wcykgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1zdGFydCByb3VuZGVkLTJ4bCBiZy13b3JrZmxvdy1wcm9jZXNzLWJnIHAtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIGgtMTIgdy0xMiByb3VuZGVkLVsxMHB4XSBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1jYXJkLWJvcmRlciBwLTMgc2hhZG93LWxnIHNoYWRvdy1zaGFkb3ctc2hhZG93LTVcIj5cbiAgICAgICAgPE5vdGlvbiBjbGFzc05hbWU9XCJzaXplLTZcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTEgZmxleCBmbGV4LWNvbCBnYXAteS0xIHBiLTMgcHQtMVwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzeXN0ZW0tbWQtc2VtaWJvbGQgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgIHt0KCdzdGVwT25lLm5vdGlvblN5bmNUaXRsZScsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pfVxuICAgICAgICAgIDxJY29uM0RvdHMgY2xhc3NOYW1lPVwicmVsYXRpdmUgLWxlZnQtMS41IC10b3AtMi41IGlubGluZSBoLTQgdy00IHRleHQtdGV4dC1zZWNvbmRhcnlcIiAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3lzdGVtLXNtLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3QoJ3N0ZXBPbmUubm90aW9uU3luY1RpcCcsIHsgbnM6ICdkYXRhc2V0Q3JlYXRpb24nIH0pfTwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8QnV0dG9uIHZhcmlhbnQ9XCJwcmltYXJ5XCIgb25DbGljaz17b25TZXR0aW5nfT57dCgnc3RlcE9uZS5jb25uZWN0JywgeyBuczogJ2RhdGFzZXRDcmVhdGlvbicgfSl9PC9CdXR0b24+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhOb3Rpb25Db25uZWN0b3IpXG4iXX0=