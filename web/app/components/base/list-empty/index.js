"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const development_1 = require("../icons/src/vender/solid/development");
const horizontal_line_1 = require("./horizontal-line");
const vertical_line_1 = require("./vertical-line");
const ListEmpty = ({ title, description, icon, }) => {
    return (<div className="flex w-[320px] flex-col items-start gap-2 rounded-[10px] bg-workflow-process-bg p-4">
      <div className="flex h-10 w-10 items-center justify-center gap-2 rounded-[10px]">
        <div className="relative flex grow items-center justify-center gap-2 self-stretch rounded-[10px] border-[0.5px]
          border-components-card-border bg-components-card-bg p-1 shadow-lg">
          {icon || <development_1.Variable02 className="h-5 w-5 shrink-0 text-text-accent"/>}
          <vertical_line_1.default className="absolute -right-[1px] top-1/2 -translate-y-1/4"/>
          <vertical_line_1.default className="absolute -left-[1px] top-1/2 -translate-y-1/4"/>
          <horizontal_line_1.default className="absolute left-3/4 top-0 -translate-x-1/4 -translate-y-1/2"/>
          <horizontal_line_1.default className="absolute left-3/4 top-full -translate-x-1/4 -translate-y-1/2"/>
        </div>
      </div>
      <div className="flex flex-col items-start gap-1 self-stretch">
        <div className="system-sm-medium text-text-secondary">{title}</div>
        {description}
      </div>
    </div>);
};
exports.default = ListEmpty;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQkFBOEI7QUFDOUIsdUVBQWtFO0FBQ2xFLHVEQUE4QztBQUM5QyxtREFBMEM7QUFRMUMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxFQUNqQixLQUFLLEVBQ0wsV0FBVyxFQUNYLElBQUksR0FDVyxFQUFFLEVBQUU7SUFDbkIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxRkFBcUYsQ0FDbEc7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUVBQWlFLENBQzlFO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDOzRFQUNxRCxDQUVsRTtVQUFBLENBQUMsSUFBSSxJQUFJLENBQUMsd0JBQVUsQ0FBQyxTQUFTLENBQUMsbUNBQW1DLEVBQUcsQ0FDckU7VUFBQSxDQUFDLHVCQUFZLENBQUMsU0FBUyxDQUFDLGdEQUFnRCxFQUN4RTtVQUFBLENBQUMsdUJBQVksQ0FBQyxTQUFTLENBQUMsK0NBQStDLEVBQ3ZFO1VBQUEsQ0FBQyx5QkFBYyxDQUFDLFNBQVMsQ0FBQywyREFBMkQsRUFDckY7VUFBQSxDQUFDLHlCQUFjLENBQUMsU0FBUyxDQUFDLDhEQUE4RCxFQUMxRjtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ0w7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsOENBQThDLENBQzNEO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUNsRTtRQUFBLENBQUMsV0FBVyxDQUNkO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxTQUFTLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBWYXJpYWJsZTAyIH0gZnJvbSAnLi4vaWNvbnMvc3JjL3ZlbmRlci9zb2xpZC9kZXZlbG9wbWVudCdcbmltcG9ydCBIb3Jpem9udGFsTGluZSBmcm9tICcuL2hvcml6b250YWwtbGluZSdcbmltcG9ydCBWZXJ0aWNhbExpbmUgZnJvbSAnLi92ZXJ0aWNhbC1saW5lJ1xuXG50eXBlIExpc3RFbXB0eVByb3BzID0ge1xuICB0aXRsZT86IHN0cmluZ1xuICBkZXNjcmlwdGlvbj86IFJlYWN0Tm9kZVxuICBpY29uPzogUmVhY3ROb2RlXG59XG5cbmNvbnN0IExpc3RFbXB0eSA9ICh7XG4gIHRpdGxlLFxuICBkZXNjcmlwdGlvbixcbiAgaWNvbixcbn06IExpc3RFbXB0eVByb3BzKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctWzMyMHB4XSBmbGV4LWNvbCBpdGVtcy1zdGFydCBnYXAtMiByb3VuZGVkLVsxMHB4XSBiZy13b3JrZmxvdy1wcm9jZXNzLWJnIHAtNFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtMTAgdy0xMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgcm91bmRlZC1bMTBweF1cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4IGdyb3cgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIHNlbGYtc3RyZXRjaCByb3VuZGVkLVsxMHB4XSBib3JkZXItWzAuNXB4XVxuICAgICAgICAgIGJvcmRlci1jb21wb25lbnRzLWNhcmQtYm9yZGVyIGJnLWNvbXBvbmVudHMtY2FyZC1iZyBwLTEgc2hhZG93LWxnXCJcbiAgICAgICAgPlxuICAgICAgICAgIHtpY29uIHx8IDxWYXJpYWJsZTAyIGNsYXNzTmFtZT1cImgtNSB3LTUgc2hyaW5rLTAgdGV4dC10ZXh0LWFjY2VudFwiIC8+fVxuICAgICAgICAgIDxWZXJ0aWNhbExpbmUgY2xhc3NOYW1lPVwiYWJzb2x1dGUgLXJpZ2h0LVsxcHhdIHRvcC0xLzIgLXRyYW5zbGF0ZS15LTEvNFwiIC8+XG4gICAgICAgICAgPFZlcnRpY2FsTGluZSBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtbGVmdC1bMXB4XSB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzRcIiAvPlxuICAgICAgICAgIDxIb3Jpem9udGFsTGluZSBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTMvNCB0b3AtMCAtdHJhbnNsYXRlLXgtMS80IC10cmFuc2xhdGUteS0xLzJcIiAvPlxuICAgICAgICAgIDxIb3Jpem9udGFsTGluZSBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTMvNCB0b3AtZnVsbCAtdHJhbnNsYXRlLXgtMS80IC10cmFuc2xhdGUteS0xLzJcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLXN0YXJ0IGdhcC0xIHNlbGYtc3RyZXRjaFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN5c3RlbS1zbS1tZWRpdW0gdGV4dC10ZXh0LXNlY29uZGFyeVwiPnt0aXRsZX08L2Rpdj5cbiAgICAgICAge2Rlc2NyaXB0aW9ufVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlzdEVtcHR5XG4iXX0=