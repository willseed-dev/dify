"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const React = require("react");
const react_i18next_1 = require("react-i18next");
const button_1 = require("@/app/components/base/button");
const Empty = ({ onResetFilter, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (<div className="flex h-5/6 w-full flex-col justify-center gap-y-2">
      <div className="flex justify-center">
        <react_1.RiHistoryLine className="h-10 w-10 text-text-empty-state-icon"/>
      </div>
      <div className="system-xs-regular flex justify-center text-text-tertiary">
        {t('versionHistory.filter.empty', { ns: 'workflow' })}
      </div>
      <div className="flex justify-center">
        <button_1.default size="small" onClick={onResetFilter}>
          {t('versionHistory.filter.reset', { ns: 'workflow' })}
        </button_1.default>
      </div>
    </div>);
};
exports.default = React.memo(Empty);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbXB0eS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw0Q0FBZ0Q7QUFDaEQsK0JBQThCO0FBQzlCLGlEQUE4QztBQUM5Qyx5REFBaUQ7QUFNakQsTUFBTSxLQUFLLEdBQW1CLENBQUMsRUFDN0IsYUFBYSxHQUNkLEVBQUUsRUFBRTtJQUNILE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFBLDhCQUFjLEdBQUUsQ0FBQTtJQUU5QixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1EQUFtRCxDQUNoRTtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FDbEM7UUFBQSxDQUFDLHFCQUFhLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxFQUNqRTtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBEQUEwRCxDQUN2RTtRQUFBLENBQUMsQ0FBQyxDQUFDLDZCQUE2QixFQUFFLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQ3ZEO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQ2xDO1FBQUEsQ0FBQyxnQkFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQzFDO1VBQUEsQ0FBQyxDQUFDLENBQUMsNkJBQTZCLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDdkQ7UUFBQSxFQUFFLGdCQUFNLENBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBSaUhpc3RvcnlMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IEJ1dHRvbiBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYnV0dG9uJ1xuXG50eXBlIEVtcHR5UHJvcHMgPSB7XG4gIG9uUmVzZXRGaWx0ZXI6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgRW1wdHk6IEZDPEVtcHR5UHJvcHM+ID0gKHtcbiAgb25SZXNldEZpbHRlcixcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC01LzYgdy1mdWxsIGZsZXgtY29sIGp1c3RpZnktY2VudGVyIGdhcC15LTJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICA8UmlIaXN0b3J5TGluZSBjbGFzc05hbWU9XCJoLTEwIHctMTAgdGV4dC10ZXh0LWVtcHR5LXN0YXRlLWljb25cIiAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1yZWd1bGFyIGZsZXgganVzdGlmeS1jZW50ZXIgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIHt0KCd2ZXJzaW9uSGlzdG9yeS5maWx0ZXIuZW1wdHknLCB7IG5zOiAnd29ya2Zsb3cnIH0pfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgPEJ1dHRvbiBzaXplPVwic21hbGxcIiBvbkNsaWNrPXtvblJlc2V0RmlsdGVyfT5cbiAgICAgICAgICB7dCgndmVyc2lvbkhpc3RvcnkuZmlsdGVyLnJlc2V0JywgeyBuczogJ3dvcmtmbG93JyB9KX1cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEVtcHR5KVxuIl19