"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryKeys = exports.tagKeys = void 0;
const types_1 = require("./types");
exports.tagKeys = [
    'agent',
    'rag',
    'search',
    'image',
    'videos',
    'weather',
    'finance',
    'design',
    'travel',
    'social',
    'news',
    'medical',
    'productivity',
    'education',
    'business',
    'entertainment',
    'utilities',
    'other',
];
exports.categoryKeys = [
    types_1.PluginCategoryEnum.model,
    types_1.PluginCategoryEnum.tool,
    types_1.PluginCategoryEnum.datasource,
    types_1.PluginCategoryEnum.agent,
    types_1.PluginCategoryEnum.extension,
    'bundle',
    types_1.PluginCategoryEnum.trigger,
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUE0QztBQUUvQixRQUFBLE9BQU8sR0FBRztJQUNyQixPQUFPO0lBQ1AsS0FBSztJQUNMLFFBQVE7SUFDUixPQUFPO0lBQ1AsUUFBUTtJQUNSLFNBQVM7SUFDVCxTQUFTO0lBQ1QsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsTUFBTTtJQUNOLFNBQVM7SUFDVCxjQUFjO0lBQ2QsV0FBVztJQUNYLFVBQVU7SUFDVixlQUFlO0lBQ2YsV0FBVztJQUNYLE9BQU87Q0FDQyxDQUFBO0FBSUcsUUFBQSxZQUFZLEdBQUc7SUFDMUIsMEJBQWtCLENBQUMsS0FBSztJQUN4QiwwQkFBa0IsQ0FBQyxJQUFJO0lBQ3ZCLDBCQUFrQixDQUFDLFVBQVU7SUFDN0IsMEJBQWtCLENBQUMsS0FBSztJQUN4QiwwQkFBa0IsQ0FBQyxTQUFTO0lBQzVCLFFBQVE7SUFDUiwwQkFBa0IsQ0FBQyxPQUFPO0NBQ2xCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbHVnaW5DYXRlZ29yeUVudW0gfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgdGFnS2V5cyA9IFtcbiAgJ2FnZW50JyxcbiAgJ3JhZycsXG4gICdzZWFyY2gnLFxuICAnaW1hZ2UnLFxuICAndmlkZW9zJyxcbiAgJ3dlYXRoZXInLFxuICAnZmluYW5jZScsXG4gICdkZXNpZ24nLFxuICAndHJhdmVsJyxcbiAgJ3NvY2lhbCcsXG4gICduZXdzJyxcbiAgJ21lZGljYWwnLFxuICAncHJvZHVjdGl2aXR5JyxcbiAgJ2VkdWNhdGlvbicsXG4gICdidXNpbmVzcycsXG4gICdlbnRlcnRhaW5tZW50JyxcbiAgJ3V0aWxpdGllcycsXG4gICdvdGhlcicsXG5dIGFzIGNvbnN0XG5cbmV4cG9ydCB0eXBlIFRhZ0tleSA9IHR5cGVvZiB0YWdLZXlzW251bWJlcl1cblxuZXhwb3J0IGNvbnN0IGNhdGVnb3J5S2V5cyA9IFtcbiAgUGx1Z2luQ2F0ZWdvcnlFbnVtLm1vZGVsLFxuICBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgUGx1Z2luQ2F0ZWdvcnlFbnVtLmRhdGFzb3VyY2UsXG4gIFBsdWdpbkNhdGVnb3J5RW51bS5hZ2VudCxcbiAgUGx1Z2luQ2F0ZWdvcnlFbnVtLmV4dGVuc2lvbixcbiAgJ2J1bmRsZScsXG4gIFBsdWdpbkNhdGVnb3J5RW51bS50cmlnZ2VyLFxuXSBhcyBjb25zdFxuXG5leHBvcnQgdHlwZSBDYXRlZ29yeUtleSA9IHR5cGVvZiBjYXRlZ29yeUtleXNbbnVtYmVyXVxuIl19