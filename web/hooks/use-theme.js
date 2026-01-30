"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const next_themes_1 = require("next-themes");
const app_1 = require("@/types/app");
const useTheme = () => {
    const { theme, resolvedTheme, ...rest } = (0, next_themes_1.useTheme)();
    return {
        // only returns 'light' or 'dark' theme
        theme: theme === app_1.Theme.system ? resolvedTheme : theme,
        ...rest,
    };
};
exports.default = useTheme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXRoZW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXRoZW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQXNEO0FBQ3RELHFDQUFtQztBQUVuQyxNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUU7SUFDcEIsTUFBTSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFBLHNCQUFZLEdBQUUsQ0FBQTtJQUN4RCxPQUFPO1FBQ0wsdUNBQXVDO1FBQ3ZDLEtBQUssRUFBRSxLQUFLLEtBQUssV0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBc0IsQ0FBQyxDQUFDLENBQUMsS0FBYztRQUN2RSxHQUFHLElBQUk7S0FDUixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsa0JBQWUsUUFBUSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlVGhlbWUgYXMgdXNlQmFzZVRoZW1lIH0gZnJvbSAnbmV4dC10aGVtZXMnXG5pbXBvcnQgeyBUaGVtZSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuXG5jb25zdCB1c2VUaGVtZSA9ICgpID0+IHtcbiAgY29uc3QgeyB0aGVtZSwgcmVzb2x2ZWRUaGVtZSwgLi4ucmVzdCB9ID0gdXNlQmFzZVRoZW1lKClcbiAgcmV0dXJuIHtcbiAgICAvLyBvbmx5IHJldHVybnMgJ2xpZ2h0JyBvciAnZGFyaycgdGhlbWVcbiAgICB0aGVtZTogdGhlbWUgPT09IFRoZW1lLnN5c3RlbSA/IHJlc29sdmVkVGhlbWUgYXMgVGhlbWUgOiB0aGVtZSBhcyBUaGVtZSxcbiAgICAuLi5yZXN0LFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVRoZW1lXG4iXX0=