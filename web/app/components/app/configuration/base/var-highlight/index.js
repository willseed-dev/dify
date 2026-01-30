"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.varHighlightHTML = void 0;
const React = require("react");
const style_module_css_1 = require("./style.module.css");
const VarHighlight = ({ name, className = '', }) => {
    return (<div key={name} className={`${style_module_css_1.default.item} ${className} mb-2 inline-flex h-5 items-center justify-center rounded-md px-1 text-xs font-medium text-primary-600`}>
      <span className="opacity-60">{'{{'}</span>
      <span>{name}</span>
      <span className="opacity-60">{'}}'}</span>
    </div>);
};
// DEPRECATED: This function is vulnerable to XSS attacks and should not be used
// Use the VarHighlight React component instead
const varHighlightHTML = ({ name, className = '' }) => {
    const escapedName = name
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    const html = `<div class="${style_module_css_1.default.item} ${className} inline-flex mb-2 items-center justify-center px-1 rounded-md h-5 text-xs font-medium text-primary-600">
  <span class='opacity-60'>{{</span>
  <span>${escapedName}</span>
  <span class='opacity-60'>}}</span>
</div>`;
    return html;
};
exports.varHighlightHTML = varHighlightHTML;
exports.default = React.memo(VarHighlight);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7O0FBRVosK0JBQThCO0FBRTlCLHlEQUFrQztBQU9sQyxNQUFNLFlBQVksR0FBMkIsQ0FBQyxFQUM1QyxJQUFJLEVBQ0osU0FBUyxHQUFHLEVBQUUsR0FDZixFQUFFLEVBQUU7SUFDSCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQ0YsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ1YsU0FBUyxDQUFDLENBQUMsR0FBRywwQkFBQyxDQUFDLElBQUksSUFBSSxTQUFTLHdHQUF3RyxDQUFDLENBRTFJO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FDekM7TUFBQSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FDbEI7TUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUMzQztJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGdGQUFnRjtBQUNoRiwrQ0FBK0M7QUFDeEMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsR0FBRyxFQUFFLEVBQXNCLEVBQUUsRUFBRTtJQUMvRSxNQUFNLFdBQVcsR0FBRyxJQUFJO1NBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQ3RCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO1NBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO1NBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO1NBQ3ZCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFFekIsTUFBTSxJQUFJLEdBQUcsZUFBZSwwQkFBQyxDQUFDLElBQUksSUFBSSxTQUFTOztVQUV2QyxXQUFXOztPQUVkLENBQUE7SUFDTCxPQUFPLElBQUksQ0FBQTtBQUNiLENBQUMsQ0FBQTtBQWRZLFFBQUEsZ0JBQWdCLG9CQWM1QjtBQUVELGtCQUFlLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgcyBmcm9tICcuL3N0eWxlLm1vZHVsZS5jc3MnXG5cbmV4cG9ydCB0eXBlIElWYXJIaWdobGlnaHRQcm9wcyA9IHtcbiAgbmFtZTogc3RyaW5nXG4gIGNsYXNzTmFtZT86IHN0cmluZ1xufVxuXG5jb25zdCBWYXJIaWdobGlnaHQ6IEZDPElWYXJIaWdobGlnaHRQcm9wcz4gPSAoe1xuICBuYW1lLFxuICBjbGFzc05hbWUgPSAnJyxcbn0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBrZXk9e25hbWV9XG4gICAgICBjbGFzc05hbWU9e2Ake3MuaXRlbX0gJHtjbGFzc05hbWV9IG1iLTIgaW5saW5lLWZsZXggaC01IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLW1kIHB4LTEgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXByaW1hcnktNjAwYH1cbiAgICA+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJvcGFjaXR5LTYwXCI+eyd7eyd9PC9zcGFuPlxuICAgICAgPHNwYW4+e25hbWV9PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib3BhY2l0eS02MFwiPnsnfX0nfTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG4vLyBERVBSRUNBVEVEOiBUaGlzIGZ1bmN0aW9uIGlzIHZ1bG5lcmFibGUgdG8gWFNTIGF0dGFja3MgYW5kIHNob3VsZCBub3QgYmUgdXNlZFxuLy8gVXNlIHRoZSBWYXJIaWdobGlnaHQgUmVhY3QgY29tcG9uZW50IGluc3RlYWRcbmV4cG9ydCBjb25zdCB2YXJIaWdobGlnaHRIVE1MID0gKHsgbmFtZSwgY2xhc3NOYW1lID0gJycgfTogSVZhckhpZ2hsaWdodFByb3BzKSA9PiB7XG4gIGNvbnN0IGVzY2FwZWROYW1lID0gbmFtZVxuICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgLnJlcGxhY2UoLycvZywgJyYjMzk7JylcblxuICBjb25zdCBodG1sID0gYDxkaXYgY2xhc3M9XCIke3MuaXRlbX0gJHtjbGFzc05hbWV9IGlubGluZS1mbGV4IG1iLTIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHB4LTEgcm91bmRlZC1tZCBoLTUgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXByaW1hcnktNjAwXCI+XG4gIDxzcGFuIGNsYXNzPSdvcGFjaXR5LTYwJz57ezwvc3Bhbj5cbiAgPHNwYW4+JHtlc2NhcGVkTmFtZX08L3NwYW4+XG4gIDxzcGFuIGNsYXNzPSdvcGFjaXR5LTYwJz59fTwvc3Bhbj5cbjwvZGl2PmBcbiAgcmV0dXJuIGh0bWxcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QubWVtbyhWYXJIaWdobGlnaHQpXG4iXX0=