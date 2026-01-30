"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const file_image_render_1 = require("./file-image-render");
const SAMPLE_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'320\' height=\'180\'><defs><linearGradient id=\'grad\' x1=\'0%\' y1=\'0%\' x2=\'100%\' y2=\'100%\'><stop offset=\'0%\' stop-color=\'#FEE2FF\'/><stop offset=\'100%\' stop-color=\'#E0EAFF\'/></linearGradient></defs><rect width=\'320\' height=\'180\' rx=\'18\' fill=\'url(#grad)\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'24\' fill=\'#1F2937\'>Preview</text></svg>';
const meta = {
    title: 'Base/General/FileImageRender',
    component: file_image_render_1.default,
    parameters: {
        docs: {
            description: {
                component: 'Renders image previews inside a bordered frame. Often used in upload galleries and logs.',
            },
            source: {
                language: 'tsx',
                code: `
<FileImageRender imageUrl="https://example.com/preview.png" className="h-32 w-52" />
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
    args: {
        imageUrl: SAMPLE_IMAGE,
        className: 'h-32 w-52',
    },
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1pbWFnZS1yZW5kZXIuc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGUtaW1hZ2UtcmVuZGVyLnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJEQUFpRDtBQUVqRCxNQUFNLFlBQVksR0FBRyxrZ0JBQWtnQixDQUFBO0FBRXZoQixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSw4QkFBOEI7SUFDckMsU0FBUyxFQUFFLDJCQUFlO0lBQzFCLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsMEZBQTBGO2FBQ3RHO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7U0FFTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsWUFBWTtRQUN0QixTQUFTLEVBQUUsV0FBVztLQUN2QjtDQUNxQyxDQUFBO0FBRXhDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsVUFBVSxHQUFVLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBGaWxlSW1hZ2VSZW5kZXIgZnJvbSAnLi9maWxlLWltYWdlLXJlbmRlcidcblxuY29uc3QgU0FNUExFX0lNQUdFID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XFwnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXCcgd2lkdGg9XFwnMzIwXFwnIGhlaWdodD1cXCcxODBcXCc+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPVxcJ2dyYWRcXCcgeDE9XFwnMCVcXCcgeTE9XFwnMCVcXCcgeDI9XFwnMTAwJVxcJyB5Mj1cXCcxMDAlXFwnPjxzdG9wIG9mZnNldD1cXCcwJVxcJyBzdG9wLWNvbG9yPVxcJyNGRUUyRkZcXCcvPjxzdG9wIG9mZnNldD1cXCcxMDAlXFwnIHN0b3AtY29sb3I9XFwnI0UwRUFGRlxcJy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9XFwnMzIwXFwnIGhlaWdodD1cXCcxODBcXCcgcng9XFwnMThcXCcgZmlsbD1cXCd1cmwoI2dyYWQpXFwnLz48dGV4dCB4PVxcJzUwJVxcJyB5PVxcJzUwJVxcJyBkb21pbmFudC1iYXNlbGluZT1cXCdtaWRkbGVcXCcgdGV4dC1hbmNob3I9XFwnbWlkZGxlXFwnIGZvbnQtZmFtaWx5PVxcJ3NhbnMtc2VyaWZcXCcgZm9udC1zaXplPVxcJzI0XFwnIGZpbGw9XFwnIzFGMjkzN1xcJz5QcmV2aWV3PC90ZXh0Pjwvc3ZnPidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0dlbmVyYWwvRmlsZUltYWdlUmVuZGVyJyxcbiAgY29tcG9uZW50OiBGaWxlSW1hZ2VSZW5kZXIsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdSZW5kZXJzIGltYWdlIHByZXZpZXdzIGluc2lkZSBhIGJvcmRlcmVkIGZyYW1lLiBPZnRlbiB1c2VkIGluIHVwbG9hZCBnYWxsZXJpZXMgYW5kIGxvZ3MuJyxcbiAgICAgIH0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48RmlsZUltYWdlUmVuZGVyIGltYWdlVXJsPVwiaHR0cHM6Ly9leGFtcGxlLmNvbS9wcmV2aWV3LnBuZ1wiIGNsYXNzTmFtZT1cImgtMzIgdy01MlwiIC8+XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ3M6IHtcbiAgICBpbWFnZVVybDogU0FNUExFX0lNQUdFLFxuICAgIGNsYXNzTmFtZTogJ2gtMzIgdy01MicsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBGaWxlSW1hZ2VSZW5kZXI+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge31cbiJdfQ==