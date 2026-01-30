"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@remixicon/react");
const ahooks_1 = require("ahooks");
const React = require("react");
const react_2 = require("react");
const react_i18next_1 = require("react-i18next");
const loading_1 = require("@/app/components/base/loading");
const portal_to_follow_elem_1 = require("@/app/components/base/portal-to-follow-elem");
const classnames_1 = require("@/utils/classnames");
const document_file_icon_1 = require("../document-file-icon");
const document_list_1 = require("./document-list");
const PreviewDocumentPicker = ({ className, value, files, onChange, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const name = value?.name || '';
    const extension = value?.extension;
    const [open, { set: setOpen, toggle: togglePopup, }] = (0, ahooks_1.useBoolean)(false);
    const ArrowIcon = react_1.RiArrowDownSLine;
    const handleChange = (0, react_2.useCallback)((item) => {
        onChange(item);
        setOpen(false);
    }, [onChange, setOpen]);
    return (<portal_to_follow_elem_1.PortalToFollowElem open={open} onOpenChange={setOpen} placement="bottom-start" offset={4}>
      <portal_to_follow_elem_1.PortalToFollowElemTrigger onClick={togglePopup}>
        <div className={(0, classnames_1.cn)('flex h-6 select-none items-center rounded-md px-1 hover:bg-state-base-hover', open && 'bg-state-base-hover', className)}>
          <document_file_icon_1.default name={name} extension={extension} size="lg"/>
          <div className="ml-1 flex flex-col items-start">
            <div className="flex items-center space-x-0.5">
              <span className={(0, classnames_1.cn)('system-md-semibold max-w-[200px] truncate text-text-primary')}>
                {' '}
                {name || '--'}
              </span>
              <ArrowIcon className="h-[18px] w-[18px] text-text-primary"/>
            </div>
          </div>
        </div>
      </portal_to_follow_elem_1.PortalToFollowElemTrigger>
      <portal_to_follow_elem_1.PortalToFollowElemContent className="z-[11]">
        <div className="w-[392px] rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-1 shadow-lg backdrop-blur-[5px]">
          {files?.length > 1 && <div className="system-xs-medium-uppercase flex h-8 items-center pl-2 text-text-tertiary">{t('preprocessDocument', { ns: 'dataset', num: files.length })}</div>}
          {files?.length > 0
            ? (<document_list_1.default list={files} onChange={handleChange}/>)
            : (<div className="mt-2 flex h-[100px] w-[360px] items-center justify-center">
                  <loading_1.default />
                </div>)}
        </div>

      </portal_to_follow_elem_1.PortalToFollowElemContent>
    </portal_to_follow_elem_1.PortalToFollowElem>);
};
exports.default = React.memo(PreviewDocumentPicker);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlldy1kb2N1bWVudC1waWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmV2aWV3LWRvY3VtZW50LXBpY2tlci50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFHWiw0Q0FBbUQ7QUFDbkQsbUNBQW1DO0FBQ25DLCtCQUE4QjtBQUM5QixpQ0FBbUM7QUFDbkMsaURBQThDO0FBQzlDLDJEQUFtRDtBQUNuRCx1RkFJb0Q7QUFDcEQsbURBQXVDO0FBQ3ZDLDhEQUE0QztBQUM1QyxtREFBMEM7QUFTMUMsTUFBTSxxQkFBcUIsR0FBYyxDQUFDLEVBQ3hDLFNBQVMsRUFDVCxLQUFLLEVBQ0wsS0FBSyxFQUNMLFFBQVEsR0FDVCxFQUFFLEVBQUU7SUFDSCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLElBQUksSUFBSSxFQUFFLENBQUE7SUFDOUIsTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLFNBQVMsQ0FBQTtJQUVsQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQ1gsR0FBRyxFQUFFLE9BQU8sRUFDWixNQUFNLEVBQUUsV0FBVyxHQUNwQixDQUFDLEdBQUcsSUFBQSxtQkFBVSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3RCLE1BQU0sU0FBUyxHQUFHLHdCQUFnQixDQUFBO0lBRWxDLE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQWtCLEVBQUUsRUFBRTtRQUN0RCxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDaEIsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7SUFFdkIsT0FBTyxDQUNMLENBQUMsMENBQWtCLENBQ2pCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNYLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUN0QixTQUFTLENBQUMsY0FBYyxDQUN4QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FFVjtNQUFBLENBQUMsaURBQXlCLENBQUMsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQzlDO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBQSxlQUFFLEVBQUMsNkVBQTZFLEVBQUUsSUFBSSxJQUFJLHFCQUFxQixFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQzFJO1VBQUEsQ0FBQyw0QkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQ3JEO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUM3QztZQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FDNUM7Y0FBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyw2REFBNkQsQ0FBQyxDQUFDLENBQ2pGO2dCQUFBLENBQUMsR0FBRyxDQUNKO2dCQUFBLENBQUMsSUFBSSxJQUFJLElBQUksQ0FDZjtjQUFBLEVBQUUsSUFBSSxDQUNOO2NBQUEsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLHFDQUFxQyxFQUM1RDtZQUFBLEVBQUUsR0FBRyxDQUNQO1VBQUEsRUFBRSxHQUFHLENBQ1A7UUFBQSxFQUFFLEdBQUcsQ0FDUDtNQUFBLEVBQUUsaURBQXlCLENBQzNCO01BQUEsQ0FBQyxpREFBeUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUMzQztRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxrSUFBa0ksQ0FDL0k7VUFBQSxDQUFDLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwRUFBMEUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQ3JMO1VBQUEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxHQUFHLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQ0UsQ0FBQyx1QkFBWSxDQUNYLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNaLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUN2QixDQUNIO1lBQ0gsQ0FBQyxDQUFDLENBQ0UsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJEQUEyRCxDQUN4RTtrQkFBQSxDQUFDLGlCQUFPLENBQUMsQUFBRCxFQUNWO2dCQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUVQOztNQUFBLEVBQUUsaURBQXlCLENBQzdCO0lBQUEsRUFBRSwwQ0FBa0IsQ0FBQyxDQUN0QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBQ0Qsa0JBQWUsS0FBSyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IEZDIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IERvY3VtZW50SXRlbSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgUmlBcnJvd0Rvd25TTGluZSB9IGZyb20gJ0ByZW1peGljb24vcmVhY3QnXG5pbXBvcnQgeyB1c2VCb29sZWFuIH0gZnJvbSAnYWhvb2tzJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdyZWFjdC1pMThuZXh0J1xuaW1wb3J0IExvYWRpbmcgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2xvYWRpbmcnXG5pbXBvcnQge1xuICBQb3J0YWxUb0ZvbGxvd0VsZW0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQsXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nXG5pbXBvcnQgeyBjbiB9IGZyb20gJ0AvdXRpbHMvY2xhc3NuYW1lcydcbmltcG9ydCBGaWxlSWNvbiBmcm9tICcuLi9kb2N1bWVudC1maWxlLWljb24nXG5pbXBvcnQgRG9jdW1lbnRMaXN0IGZyb20gJy4vZG9jdW1lbnQtbGlzdCdcblxudHlwZSBQcm9wcyA9IHtcbiAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIHZhbHVlPzogRG9jdW1lbnRJdGVtXG4gIGZpbGVzOiBEb2N1bWVudEl0ZW1bXVxuICBvbkNoYW5nZTogKHZhbHVlOiBEb2N1bWVudEl0ZW0pID0+IHZvaWRcbn1cblxuY29uc3QgUHJldmlld0RvY3VtZW50UGlja2VyOiBGQzxQcm9wcz4gPSAoe1xuICBjbGFzc05hbWUsXG4gIHZhbHVlLFxuICBmaWxlcyxcbiAgb25DaGFuZ2UsXG59KSA9PiB7XG4gIGNvbnN0IHsgdCB9ID0gdXNlVHJhbnNsYXRpb24oKVxuICBjb25zdCBuYW1lID0gdmFsdWU/Lm5hbWUgfHwgJydcbiAgY29uc3QgZXh0ZW5zaW9uID0gdmFsdWU/LmV4dGVuc2lvblxuXG4gIGNvbnN0IFtvcGVuLCB7XG4gICAgc2V0OiBzZXRPcGVuLFxuICAgIHRvZ2dsZTogdG9nZ2xlUG9wdXAsXG4gIH1dID0gdXNlQm9vbGVhbihmYWxzZSlcbiAgY29uc3QgQXJyb3dJY29uID0gUmlBcnJvd0Rvd25TTGluZVxuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChpdGVtOiBEb2N1bWVudEl0ZW0pID0+IHtcbiAgICBvbkNoYW5nZShpdGVtKVxuICAgIHNldE9wZW4oZmFsc2UpXG4gIH0sIFtvbkNoYW5nZSwgc2V0T3Blbl0pXG5cbiAgcmV0dXJuIChcbiAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtXG4gICAgICBvcGVuPXtvcGVufVxuICAgICAgb25PcGVuQ2hhbmdlPXtzZXRPcGVufVxuICAgICAgcGxhY2VtZW50PVwiYm90dG9tLXN0YXJ0XCJcbiAgICAgIG9mZnNldD17NH1cbiAgICA+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlciBvbkNsaWNrPXt0b2dnbGVQb3B1cH0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbignZmxleCBoLTYgc2VsZWN0LW5vbmUgaXRlbXMtY2VudGVyIHJvdW5kZWQtbWQgcHgtMSBob3ZlcjpiZy1zdGF0ZS1iYXNlLWhvdmVyJywgb3BlbiAmJiAnYmctc3RhdGUtYmFzZS1ob3ZlcicsIGNsYXNzTmFtZSl9PlxuICAgICAgICAgIDxGaWxlSWNvbiBuYW1lPXtuYW1lfSBleHRlbnNpb249e2V4dGVuc2lvbn0gc2l6ZT1cImxnXCIgLz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1sLTEgZmxleCBmbGV4LWNvbCBpdGVtcy1zdGFydFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTAuNVwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2NuKCdzeXN0ZW0tbWQtc2VtaWJvbGQgbWF4LXctWzIwMHB4XSB0cnVuY2F0ZSB0ZXh0LXRleHQtcHJpbWFyeScpfT5cbiAgICAgICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgICAgIHtuYW1lIHx8ICctLSd9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPEFycm93SWNvbiBjbGFzc05hbWU9XCJoLVsxOHB4XSB3LVsxOHB4XSB0ZXh0LXRleHQtcHJpbWFyeVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1BvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI+XG4gICAgICA8UG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCBjbGFzc05hbWU9XCJ6LVsxMV1cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LVszOTJweF0gcm91bmRlZC14bCBib3JkZXItWzAuNXB4XSBib3JkZXItY29tcG9uZW50cy1wYW5lbC1ib3JkZXIgYmctY29tcG9uZW50cy1wYW5lbC1iZy1ibHVyIHAtMSBzaGFkb3ctbGcgYmFja2Ryb3AtYmx1ci1bNXB4XVwiPlxuICAgICAgICAgIHtmaWxlcz8ubGVuZ3RoID4gMSAmJiA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS14cy1tZWRpdW0tdXBwZXJjYXNlIGZsZXggaC04IGl0ZW1zLWNlbnRlciBwbC0yIHRleHQtdGV4dC10ZXJ0aWFyeVwiPnt0KCdwcmVwcm9jZXNzRG9jdW1lbnQnLCB7IG5zOiAnZGF0YXNldCcsIG51bTogZmlsZXMubGVuZ3RoIH0pfTwvZGl2Pn1cbiAgICAgICAgICB7ZmlsZXM/Lmxlbmd0aCA+IDBcbiAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgIDxEb2N1bWVudExpc3RcbiAgICAgICAgICAgICAgICAgIGxpc3Q9e2ZpbGVzfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTIgZmxleCBoLVsxMDBweF0gdy1bMzYwcHhdIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPExvYWRpbmcgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudD5cbiAgICA8L1BvcnRhbFRvRm9sbG93RWxlbT5cbiAgKVxufVxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhQcmV2aWV3RG9jdW1lbnRQaWNrZXIpXG4iXX0=