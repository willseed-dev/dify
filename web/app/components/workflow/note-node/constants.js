"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THEME_MAP = exports.CUSTOM_NOTE_NODE = void 0;
const types_1 = require("./types");
exports.CUSTOM_NOTE_NODE = 'custom-note';
exports.THEME_MAP = {
    [types_1.NoteTheme.blue]: {
        outer: 'border-util-colors-blue-blue-500',
        title: 'bg-util-colors-blue-blue-100',
        bg: 'bg-util-colors-blue-blue-50',
        border: 'border-util-colors-blue-blue-300',
    },
    [types_1.NoteTheme.cyan]: {
        outer: 'border-util-colors-cyan-cyan-500',
        title: 'bg-util-colors-cyan-cyan-100',
        bg: 'bg-util-colors-cyan-cyan-50',
        border: 'border-util-colors-cyan-cyan-300',
    },
    [types_1.NoteTheme.green]: {
        outer: 'border-util-colors-green-green-500',
        title: 'bg-util-colors-green-green-100',
        bg: 'bg-util-colors-green-green-50',
        border: 'border-util-colors-green-green-300',
    },
    [types_1.NoteTheme.yellow]: {
        outer: 'border-util-colors-yellow-yellow-500',
        title: 'bg-util-colors-yellow-yellow-100',
        bg: 'bg-util-colors-yellow-yellow-50',
        border: 'border-util-colors-yellow-yellow-300',
    },
    [types_1.NoteTheme.pink]: {
        outer: 'border-util-colors-pink-pink-500',
        title: 'bg-util-colors-pink-pink-100',
        bg: 'bg-util-colors-pink-pink-50',
        border: 'border-util-colors-pink-pink-300',
    },
    [types_1.NoteTheme.violet]: {
        outer: 'border-util-colors-violet-violet-500',
        title: 'bg-util-colors-violet-violet-100',
        bg: 'bg-util-colors-violet-violet-100',
        border: 'border-util-colors-violet-violet-300',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUV0QixRQUFBLGdCQUFnQixHQUFHLGFBQWEsQ0FBQTtBQUVoQyxRQUFBLFNBQVMsR0FBaUY7SUFDckcsQ0FBQyxpQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2hCLEtBQUssRUFBRSxrQ0FBa0M7UUFDekMsS0FBSyxFQUFFLDhCQUE4QjtRQUNyQyxFQUFFLEVBQUUsNkJBQTZCO1FBQ2pDLE1BQU0sRUFBRSxrQ0FBa0M7S0FDM0M7SUFDRCxDQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEIsS0FBSyxFQUFFLGtDQUFrQztRQUN6QyxLQUFLLEVBQUUsOEJBQThCO1FBQ3JDLEVBQUUsRUFBRSw2QkFBNkI7UUFDakMsTUFBTSxFQUFFLGtDQUFrQztLQUMzQztJQUNELENBQUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNqQixLQUFLLEVBQUUsb0NBQW9DO1FBQzNDLEtBQUssRUFBRSxnQ0FBZ0M7UUFDdkMsRUFBRSxFQUFFLCtCQUErQjtRQUNuQyxNQUFNLEVBQUUsb0NBQW9DO0tBQzdDO0lBQ0QsQ0FBQyxpQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2xCLEtBQUssRUFBRSxzQ0FBc0M7UUFDN0MsS0FBSyxFQUFFLGtDQUFrQztRQUN6QyxFQUFFLEVBQUUsaUNBQWlDO1FBQ3JDLE1BQU0sRUFBRSxzQ0FBc0M7S0FDL0M7SUFDRCxDQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEIsS0FBSyxFQUFFLGtDQUFrQztRQUN6QyxLQUFLLEVBQUUsOEJBQThCO1FBQ3JDLEVBQUUsRUFBRSw2QkFBNkI7UUFDakMsTUFBTSxFQUFFLGtDQUFrQztLQUMzQztJQUNELENBQUMsaUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNsQixLQUFLLEVBQUUsc0NBQXNDO1FBQzdDLEtBQUssRUFBRSxrQ0FBa0M7UUFDekMsRUFBRSxFQUFFLGtDQUFrQztRQUN0QyxNQUFNLEVBQUUsc0NBQXNDO0tBQy9DO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5vdGVUaGVtZSB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBDVVNUT01fTk9URV9OT0RFID0gJ2N1c3RvbS1ub3RlJ1xuXG5leHBvcnQgY29uc3QgVEhFTUVfTUFQOiBSZWNvcmQ8c3RyaW5nLCB7IG91dGVyOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIGJnOiBzdHJpbmcsIGJvcmRlcjogc3RyaW5nIH0+ID0ge1xuICBbTm90ZVRoZW1lLmJsdWVdOiB7XG4gICAgb3V0ZXI6ICdib3JkZXItdXRpbC1jb2xvcnMtYmx1ZS1ibHVlLTUwMCcsXG4gICAgdGl0bGU6ICdiZy11dGlsLWNvbG9ycy1ibHVlLWJsdWUtMTAwJyxcbiAgICBiZzogJ2JnLXV0aWwtY29sb3JzLWJsdWUtYmx1ZS01MCcsXG4gICAgYm9yZGVyOiAnYm9yZGVyLXV0aWwtY29sb3JzLWJsdWUtYmx1ZS0zMDAnLFxuICB9LFxuICBbTm90ZVRoZW1lLmN5YW5dOiB7XG4gICAgb3V0ZXI6ICdib3JkZXItdXRpbC1jb2xvcnMtY3lhbi1jeWFuLTUwMCcsXG4gICAgdGl0bGU6ICdiZy11dGlsLWNvbG9ycy1jeWFuLWN5YW4tMTAwJyxcbiAgICBiZzogJ2JnLXV0aWwtY29sb3JzLWN5YW4tY3lhbi01MCcsXG4gICAgYm9yZGVyOiAnYm9yZGVyLXV0aWwtY29sb3JzLWN5YW4tY3lhbi0zMDAnLFxuICB9LFxuICBbTm90ZVRoZW1lLmdyZWVuXToge1xuICAgIG91dGVyOiAnYm9yZGVyLXV0aWwtY29sb3JzLWdyZWVuLWdyZWVuLTUwMCcsXG4gICAgdGl0bGU6ICdiZy11dGlsLWNvbG9ycy1ncmVlbi1ncmVlbi0xMDAnLFxuICAgIGJnOiAnYmctdXRpbC1jb2xvcnMtZ3JlZW4tZ3JlZW4tNTAnLFxuICAgIGJvcmRlcjogJ2JvcmRlci11dGlsLWNvbG9ycy1ncmVlbi1ncmVlbi0zMDAnLFxuICB9LFxuICBbTm90ZVRoZW1lLnllbGxvd106IHtcbiAgICBvdXRlcjogJ2JvcmRlci11dGlsLWNvbG9ycy15ZWxsb3cteWVsbG93LTUwMCcsXG4gICAgdGl0bGU6ICdiZy11dGlsLWNvbG9ycy15ZWxsb3cteWVsbG93LTEwMCcsXG4gICAgYmc6ICdiZy11dGlsLWNvbG9ycy15ZWxsb3cteWVsbG93LTUwJyxcbiAgICBib3JkZXI6ICdib3JkZXItdXRpbC1jb2xvcnMteWVsbG93LXllbGxvdy0zMDAnLFxuICB9LFxuICBbTm90ZVRoZW1lLnBpbmtdOiB7XG4gICAgb3V0ZXI6ICdib3JkZXItdXRpbC1jb2xvcnMtcGluay1waW5rLTUwMCcsXG4gICAgdGl0bGU6ICdiZy11dGlsLWNvbG9ycy1waW5rLXBpbmstMTAwJyxcbiAgICBiZzogJ2JnLXV0aWwtY29sb3JzLXBpbmstcGluay01MCcsXG4gICAgYm9yZGVyOiAnYm9yZGVyLXV0aWwtY29sb3JzLXBpbmstcGluay0zMDAnLFxuICB9LFxuICBbTm90ZVRoZW1lLnZpb2xldF06IHtcbiAgICBvdXRlcjogJ2JvcmRlci11dGlsLWNvbG9ycy12aW9sZXQtdmlvbGV0LTUwMCcsXG4gICAgdGl0bGU6ICdiZy11dGlsLWNvbG9ycy12aW9sZXQtdmlvbGV0LTEwMCcsXG4gICAgYmc6ICdiZy11dGlsLWNvbG9ycy12aW9sZXQtdmlvbGV0LTEwMCcsXG4gICAgYm9yZGVyOiAnYm9yZGVyLXV0aWwtY29sb3JzLXZpb2xldC12aW9sZXQtMzAwJyxcbiAgfSxcbn1cbiJdfQ==