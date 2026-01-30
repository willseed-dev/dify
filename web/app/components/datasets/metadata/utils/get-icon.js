"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIcon = void 0;
const react_1 = require("@remixicon/react");
const types_1 = require("../types");
const getIcon = (type) => {
    return ({
        [types_1.DataType.string]: react_1.RiTextSnippet,
        [types_1.DataType.number]: react_1.RiHashtag,
        [types_1.DataType.time]: react_1.RiTimeLine,
    }[type] || react_1.RiTextSnippet);
};
exports.getIcon = getIcon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWljb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXQtaWNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBdUU7QUFDdkUsb0NBQW1DO0FBRTVCLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBYyxFQUFFLEVBQUU7SUFDeEMsT0FBTyxDQUFDO1FBQ04sQ0FBQyxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLHFCQUFhO1FBQ2hDLENBQUMsZ0JBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxpQkFBUztRQUM1QixDQUFDLGdCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsa0JBQVU7S0FDNUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBYSxDQUFDLENBQUE7QUFDM0IsQ0FBQyxDQUFBO0FBTlksUUFBQSxPQUFPLFdBTW5CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUmlIYXNodGFnLCBSaVRleHRTbmlwcGV0LCBSaVRpbWVMaW5lIH0gZnJvbSAnQHJlbWl4aWNvbi9yZWFjdCdcbmltcG9ydCB7IERhdGFUeXBlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBnZXRJY29uID0gKHR5cGU6IERhdGFUeXBlKSA9PiB7XG4gIHJldHVybiAoe1xuICAgIFtEYXRhVHlwZS5zdHJpbmddOiBSaVRleHRTbmlwcGV0LFxuICAgIFtEYXRhVHlwZS5udW1iZXJdOiBSaUhhc2h0YWcsXG4gICAgW0RhdGFUeXBlLnRpbWVdOiBSaVRpbWVMaW5lLFxuICB9W3R5cGVdIHx8IFJpVGV4dFNuaXBwZXQpXG59XG4iXX0=