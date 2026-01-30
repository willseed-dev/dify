"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const classnames_1 = require("@/utils/classnames");
const Description = ({ className, text, descriptionLineRows, }) => {
    const lineClassName = (0, react_1.useMemo)(() => {
        if (descriptionLineRows === 1)
            return 'h-4 truncate';
        else if (descriptionLineRows === 2)
            return 'h-8 line-clamp-2';
        else
            return 'h-12 line-clamp-3';
    }, [descriptionLineRows]);
    return (<div className={(0, classnames_1.cn)('system-xs-regular text-text-tertiary', lineClassName, className)}>
      {text}
    </div>);
};
exports.default = Description;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzY3JpcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXNjcmlwdGlvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQkFBOEI7QUFDOUIsaUNBQStCO0FBQy9CLG1EQUF1QztBQVF2QyxNQUFNLFdBQVcsR0FBYyxDQUFDLEVBQzlCLFNBQVMsRUFDVCxJQUFJLEVBQ0osbUJBQW1CLEdBQ3BCLEVBQUUsRUFBRTtJQUNILE1BQU0sYUFBYSxHQUFHLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtRQUNqQyxJQUFJLG1CQUFtQixLQUFLLENBQUM7WUFDM0IsT0FBTyxjQUFjLENBQUE7YUFDbEIsSUFBSSxtQkFBbUIsS0FBSyxDQUFDO1lBQ2hDLE9BQU8sa0JBQWtCLENBQUE7O1lBRXpCLE9BQU8sbUJBQW1CLENBQUE7SUFDOUIsQ0FBQyxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFBO0lBQ3pCLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFBLGVBQUUsRUFBQyxzQ0FBc0MsRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FDbkY7TUFBQSxDQUFDLElBQUksQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRkMgfSBmcm9tICdyZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY24gfSBmcm9tICdAL3V0aWxzL2NsYXNzbmFtZXMnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIGNsYXNzTmFtZT86IHN0cmluZ1xuICB0ZXh0OiBzdHJpbmdcbiAgZGVzY3JpcHRpb25MaW5lUm93czogbnVtYmVyXG59XG5cbmNvbnN0IERlc2NyaXB0aW9uOiBGQzxQcm9wcz4gPSAoe1xuICBjbGFzc05hbWUsXG4gIHRleHQsXG4gIGRlc2NyaXB0aW9uTGluZVJvd3MsXG59KSA9PiB7XG4gIGNvbnN0IGxpbmVDbGFzc05hbWUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoZGVzY3JpcHRpb25MaW5lUm93cyA9PT0gMSlcbiAgICAgIHJldHVybiAnaC00IHRydW5jYXRlJ1xuICAgIGVsc2UgaWYgKGRlc2NyaXB0aW9uTGluZVJvd3MgPT09IDIpXG4gICAgICByZXR1cm4gJ2gtOCBsaW5lLWNsYW1wLTInXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICdoLTEyIGxpbmUtY2xhbXAtMydcbiAgfSwgW2Rlc2NyaXB0aW9uTGluZVJvd3NdKVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjbignc3lzdGVtLXhzLXJlZ3VsYXIgdGV4dC10ZXh0LXRlcnRpYXJ5JywgbGluZUNsYXNzTmFtZSwgY2xhc3NOYW1lKX0+XG4gICAgICB7dGV4dH1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZXNjcmlwdGlvblxuIl19