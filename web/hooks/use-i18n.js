"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRenderI18nObject = void 0;
const hooks_1 = require("@/app/components/header/account-setting/model-provider-page/hooks");
const i18n_config_1 = require("@/i18n-config");
const useRenderI18nObject = () => {
    const language = (0, hooks_1.useLanguage)();
    return (obj) => {
        return (0, i18n_config_1.renderI18nObject)(obj, language);
    };
};
exports.useRenderI18nObject = useRenderI18nObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWkxOG4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtaTE4bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2RkFBK0Y7QUFDL0YsK0NBQWdEO0FBRXpDLE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxFQUFFO0lBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUEsbUJBQVcsR0FBRSxDQUFBO0lBQzlCLE9BQU8sQ0FBQyxHQUEyQixFQUFFLEVBQUU7UUFDckMsT0FBTyxJQUFBLDhCQUFnQixFQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUN4QyxDQUFDLENBQUE7QUFDSCxDQUFDLENBQUE7QUFMWSxRQUFBLG1CQUFtQix1QkFLL0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VMYW5ndWFnZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2hvb2tzJ1xuaW1wb3J0IHsgcmVuZGVySTE4bk9iamVjdCB9IGZyb20gJ0AvaTE4bi1jb25maWcnXG5cbmV4cG9ydCBjb25zdCB1c2VSZW5kZXJJMThuT2JqZWN0ID0gKCkgPT4ge1xuICBjb25zdCBsYW5ndWFnZSA9IHVzZUxhbmd1YWdlKClcbiAgcmV0dXJuIChvYmo6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHtcbiAgICByZXR1cm4gcmVuZGVySTE4bk9iamVjdChvYmosIGxhbmd1YWdlKVxuICB9XG59XG4iXX0=