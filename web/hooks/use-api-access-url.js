"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDatasetApiAccessUrl = void 0;
const react_1 = require("react");
const i18n_1 = require("@/context/i18n");
const useDatasetApiAccessUrl = () => {
    const locale = (0, i18n_1.useGetLanguage)();
    const apiReferenceUrl = (0, react_1.useMemo)(() => {
        if (locale === 'zh_Hans')
            return 'https://docs.dify.ai/api-reference/%E6%95%B0%E6%8D%AE%E9%9B%86';
        if (locale === 'ja_JP')
            return 'https://docs.dify.ai/api-reference/%E3%83%87%E3%83%BC%E3%82%BF%E3%82%BB%E3%83%83%E3%83%88';
        return 'https://docs.dify.ai/api-reference/datasets';
    }, [locale]);
    return apiReferenceUrl;
};
exports.useDatasetApiAccessUrl = useDatasetApiAccessUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWFwaS1hY2Nlc3MtdXJsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWFwaS1hY2Nlc3MtdXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUErQjtBQUMvQix5Q0FBK0M7QUFFeEMsTUFBTSxzQkFBc0IsR0FBRyxHQUFHLEVBQUU7SUFDekMsTUFBTSxNQUFNLEdBQUcsSUFBQSxxQkFBYyxHQUFFLENBQUE7SUFFL0IsTUFBTSxlQUFlLEdBQUcsSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO1FBQ25DLElBQUksTUFBTSxLQUFLLFNBQVM7WUFDdEIsT0FBTyxnRUFBZ0UsQ0FBQTtRQUN6RSxJQUFJLE1BQU0sS0FBSyxPQUFPO1lBQ3BCLE9BQU8sMkZBQTJGLENBQUE7UUFDcEcsT0FBTyw2Q0FBNkMsQ0FBQTtJQUN0RCxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBRVosT0FBTyxlQUFlLENBQUE7QUFDeEIsQ0FBQyxDQUFBO0FBWlksUUFBQSxzQkFBc0IsMEJBWWxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlR2V0TGFuZ3VhZ2UgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcblxuZXhwb3J0IGNvbnN0IHVzZURhdGFzZXRBcGlBY2Nlc3NVcmwgPSAoKSA9PiB7XG4gIGNvbnN0IGxvY2FsZSA9IHVzZUdldExhbmd1YWdlKClcblxuICBjb25zdCBhcGlSZWZlcmVuY2VVcmwgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAobG9jYWxlID09PSAnemhfSGFucycpXG4gICAgICByZXR1cm4gJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2FwaS1yZWZlcmVuY2UvJUU2JTk1JUIwJUU2JThEJUFFJUU5JTlCJTg2J1xuICAgIGlmIChsb2NhbGUgPT09ICdqYV9KUCcpXG4gICAgICByZXR1cm4gJ2h0dHBzOi8vZG9jcy5kaWZ5LmFpL2FwaS1yZWZlcmVuY2UvJUUzJTgzJTg3JUUzJTgzJUJDJUUzJTgyJUJGJUUzJTgyJUJCJUUzJTgzJTgzJUUzJTgzJTg4J1xuICAgIHJldHVybiAnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvYXBpLXJlZmVyZW5jZS9kYXRhc2V0cydcbiAgfSwgW2xvY2FsZV0pXG5cbiAgcmV0dXJuIGFwaVJlZmVyZW5jZVVybFxufVxuIl19