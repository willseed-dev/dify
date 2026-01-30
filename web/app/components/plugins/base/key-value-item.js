"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const copy_to_clipboard_1 = require("copy-to-clipboard");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const action_button_1 = require("@/app/components/base/action-button");
const classnames_1 = require("@/utils/classnames");
const files_1 = require("../../base/icons/src/vender/line/files");
const tooltip_1 = require("../../base/tooltip");
const KeyValueItem = ({ label, labelWidthClassName = 'w-10', value, maskedValue, valueMaxWidthClassName = 'max-w-[162px]', }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isCopied, setIsCopied] = (0, react_2.useState)(false);
    const handleCopy = (0, react_2.useCallback)(() => {
        (0, copy_to_clipboard_1.default)(value);
        setIsCopied(true);
    }, [value]);
    (0, react_2.useEffect)(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [isCopied]);
    const CopyIcon = isCopied ? files_1.CopyCheck : react_1.RiClipboardLine;
    return (<div className="flex items-center gap-1">
      <span className={(0, classnames_1.cn)('system-xs-medium flex flex-col items-start justify-center text-text-tertiary', labelWidthClassName)}>{label}</span>
      <div className="flex items-center justify-center gap-0.5">
        <span className={(0, classnames_1.cn)(valueMaxWidthClassName, ' system-xs-medium truncate text-text-secondary')}>
          {maskedValue || value}
        </span>
        <tooltip_1.default popupContent={t(`operation.${isCopied ? 'copied' : 'copy'}`, { ns: 'common' })} position="top">
          <action_button_1.default onClick={handleCopy}>
            <CopyIcon className="h-3.5 w-3.5 shrink-0 text-text-tertiary"/>
          </action_button_1.default>
        </tooltip_1.default>
      </div>
    </div>);
};
exports.default = React.memo(KeyValueItem);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LXZhbHVlLWl0ZW0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrZXktdmFsdWUtaXRlbS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFFWiw0Q0FFeUI7QUFDekIseURBQW9DO0FBQ3BDLCtCQUE4QjtBQUM5QixpQ0FBd0Q7QUFDeEQsaURBQThDO0FBQzlDLHVFQUE4RDtBQUM5RCxtREFBdUM7QUFDdkMsa0VBQWtFO0FBQ2xFLGdEQUF3QztBQVV4QyxNQUFNLFlBQVksR0FBYyxDQUFDLEVBQy9CLEtBQUssRUFDTCxtQkFBbUIsR0FBRyxNQUFNLEVBQzVCLEtBQUssRUFDTCxXQUFXLEVBQ1gsc0JBQXNCLEdBQUcsZUFBZSxHQUN6QyxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDL0MsTUFBTSxVQUFVLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEdBQUcsRUFBRTtRQUNsQyxJQUFBLDJCQUFJLEVBQUMsS0FBSyxDQUFDLENBQUE7UUFDWCxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbkIsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUVYLElBQUEsaUJBQVMsRUFBQyxHQUFHLEVBQUU7UUFDYixJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ2IsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDNUIsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3BCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUNSLE9BQU8sR0FBRyxFQUFFO2dCQUNWLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNyQixDQUFDLENBQUE7UUFDSCxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUVkLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQVMsQ0FBQyxDQUFDLENBQUMsdUJBQWUsQ0FBQTtJQUV2RCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUN0QztNQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUEsZUFBRSxFQUFDLDhFQUE4RSxFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FDdkk7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMENBQTBDLENBQ3ZEO1FBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsc0JBQXNCLEVBQUUsZ0RBQWdELENBQUMsQ0FBQyxDQUM1RjtVQUFBLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FDdkI7UUFBQSxFQUFFLElBQUksQ0FDTjtRQUFBLENBQUMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQ3JHO1VBQUEsQ0FBQyx1QkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUNoQztZQUFBLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyx5Q0FBeUMsRUFDL0Q7VUFBQSxFQUFFLHVCQUFZLENBQ2hCO1FBQUEsRUFBRSxpQkFBTyxDQUNYO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICBSaUNsaXBib2FyZExpbmUsXG59IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgY29weSBmcm9tICdjb3B5LXRvLWNsaXBib2FyZCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCBBY3Rpb25CdXR0b24gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FjdGlvbi1idXR0b24nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCB7IENvcHlDaGVjayB9IGZyb20gJy4uLy4uL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9saW5lL2ZpbGVzJ1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vLi4vYmFzZS90b29sdGlwJ1xuXG50eXBlIFByb3BzID0ge1xuICBsYWJlbDogc3RyaW5nXG4gIGxhYmVsV2lkdGhDbGFzc05hbWU/OiBzdHJpbmdcbiAgdmFsdWU6IHN0cmluZ1xuICBtYXNrZWRWYWx1ZT86IHN0cmluZ1xuICB2YWx1ZU1heFdpZHRoQ2xhc3NOYW1lPzogc3RyaW5nXG59XG5cbmNvbnN0IEtleVZhbHVlSXRlbTogRkM8UHJvcHM+ID0gKHtcbiAgbGFiZWwsXG4gIGxhYmVsV2lkdGhDbGFzc05hbWUgPSAndy0xMCcsXG4gIHZhbHVlLFxuICBtYXNrZWRWYWx1ZSxcbiAgdmFsdWVNYXhXaWR0aENsYXNzTmFtZSA9ICdtYXgtdy1bMTYycHhdJyxcbn0pID0+IHtcbiAgY29uc3QgeyB0IH0gPSB1c2VUcmFuc2xhdGlvbigpXG4gIGNvbnN0IFtpc0NvcGllZCwgc2V0SXNDb3BpZWRdID0gdXNlU3RhdGUoZmFsc2UpXG4gIGNvbnN0IGhhbmRsZUNvcHkgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29weSh2YWx1ZSlcbiAgICBzZXRJc0NvcGllZCh0cnVlKVxuICB9LCBbdmFsdWVdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGlzQ29waWVkKSB7XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZXRJc0NvcGllZChmYWxzZSlcbiAgICAgIH0sIDIwMDApXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpXG4gICAgICB9XG4gICAgfVxuICB9LCBbaXNDb3BpZWRdKVxuXG4gIGNvbnN0IENvcHlJY29uID0gaXNDb3BpZWQgPyBDb3B5Q2hlY2sgOiBSaUNsaXBib2FyZExpbmVcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTFcIj5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y24oJ3N5c3RlbS14cy1tZWRpdW0gZmxleCBmbGV4LWNvbCBpdGVtcy1zdGFydCBqdXN0aWZ5LWNlbnRlciB0ZXh0LXRleHQtdGVydGlhcnknLCBsYWJlbFdpZHRoQ2xhc3NOYW1lKX0+e2xhYmVsfTwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTAuNVwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2NuKHZhbHVlTWF4V2lkdGhDbGFzc05hbWUsICcgc3lzdGVtLXhzLW1lZGl1bSB0cnVuY2F0ZSB0ZXh0LXRleHQtc2Vjb25kYXJ5Jyl9PlxuICAgICAgICAgIHttYXNrZWRWYWx1ZSB8fCB2YWx1ZX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8VG9vbHRpcCBwb3B1cENvbnRlbnQ9e3QoYG9wZXJhdGlvbi4ke2lzQ29waWVkID8gJ2NvcGllZCcgOiAnY29weSd9YCwgeyBuczogJ2NvbW1vbicgfSl9IHBvc2l0aW9uPVwidG9wXCI+XG4gICAgICAgICAgPEFjdGlvbkJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVDb3B5fT5cbiAgICAgICAgICAgIDxDb3B5SWNvbiBjbGFzc05hbWU9XCJoLTMuNSB3LTMuNSBzaHJpbmstMCB0ZXh0LXRleHQtdGVydGlhcnlcIiAvPlxuICAgICAgICAgIDwvQWN0aW9uQnV0dG9uPlxuICAgICAgICA8L1Rvb2x0aXA+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5tZW1vKEtleVZhbHVlSXRlbSlcbiJdfQ==