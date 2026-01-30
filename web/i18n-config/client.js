"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeLanguage = void 0;
exports.createI18nextInstance = createI18nextInstance;
const string_1 = require("es-toolkit/string");
const i18next_1 = require("i18next");
const i18next_resources_to_backend_1 = require("i18next-resources-to-backend");
const react_i18next_1 = require("react-i18next");
const settings_1 = require("./settings");
function createI18nextInstance(lng, resources) {
    const instance = (0, i18next_1.createInstance)();
    instance
        .use(react_i18next_1.initReactI18next)
        .use((0, i18next_resources_to_backend_1.default)((language, namespace) => {
        const namespaceKebab = (0, string_1.kebabCase)(namespace);
        return Promise.resolve(`${`../i18n/${language}/${namespaceKebab}.json`}`).then(s => require(s));
    }))
        .init({
        ...(0, settings_1.getInitOptions)(),
        lng,
        resources,
    });
    return instance;
}
const changeLanguage = async (lng) => {
    if (!lng)
        return;
    const i18n = (0, react_i18next_1.getI18n)();
    await i18n.changeLanguage(lng);
};
exports.changeLanguage = changeLanguage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxZQUFZLENBQUE7OztBQVVaLHNEQWlCQztBQXZCRCw4Q0FBNkM7QUFDN0MscUNBQXdDO0FBQ3hDLCtFQUE2RDtBQUM3RCxpREFBeUQ7QUFDekQseUNBQTJDO0FBRTNDLFNBQWdCLHFCQUFxQixDQUFDLEdBQVcsRUFBRSxTQUFtQjtJQUNwRSxNQUFNLFFBQVEsR0FBRyxJQUFBLHdCQUFjLEdBQUUsQ0FBQTtJQUNqQyxRQUFRO1NBQ0wsR0FBRyxDQUFDLGdDQUFnQixDQUFDO1NBQ3JCLEdBQUcsQ0FBQyxJQUFBLHNDQUFrQixFQUFDLENBQ3RCLFFBQWdCLEVBQ2hCLFNBQWtELEVBQ2xELEVBQUU7UUFDRixNQUFNLGNBQWMsR0FBRyxJQUFBLGtCQUFTLEVBQUMsU0FBUyxDQUFDLENBQUE7UUFDM0MsMEJBQWMsV0FBVyxRQUFRLElBQUksY0FBYyxPQUFPLDBCQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO1NBQ0YsSUFBSSxDQUFDO1FBQ0osR0FBRyxJQUFBLHlCQUFjLEdBQUU7UUFDbkIsR0FBRztRQUNILFNBQVM7S0FDVixDQUFDLENBQUE7SUFDSixPQUFPLFFBQVEsQ0FBQTtBQUNqQixDQUFDO0FBRU0sTUFBTSxjQUFjLEdBQUcsS0FBSyxFQUFFLEdBQVksRUFBRSxFQUFFO0lBQ25ELElBQUksQ0FBQyxHQUFHO1FBQ04sT0FBTTtJQUNSLE1BQU0sSUFBSSxHQUFHLElBQUEsdUJBQU8sR0FBRSxDQUFBO0lBQ3RCLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNoQyxDQUFDLENBQUE7QUFMWSxRQUFBLGNBQWMsa0JBSzFCIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5pbXBvcnQgdHlwZSB7IFJlc291cmNlIH0gZnJvbSAnaTE4bmV4dCdcbmltcG9ydCB0eXBlIHsgTG9jYWxlIH0gZnJvbSAnLidcbmltcG9ydCB0eXBlIHsgTmFtZXNwYWNlQ2FtZWxDYXNlLCBOYW1lc3BhY2VLZWJhYkNhc2UgfSBmcm9tICcuL3Jlc291cmNlcydcbmltcG9ydCB7IGtlYmFiQ2FzZSB9IGZyb20gJ2VzLXRvb2xraXQvc3RyaW5nJ1xuaW1wb3J0IHsgY3JlYXRlSW5zdGFuY2UgfSBmcm9tICdpMThuZXh0J1xuaW1wb3J0IHJlc291cmNlc1RvQmFja2VuZCBmcm9tICdpMThuZXh0LXJlc291cmNlcy10by1iYWNrZW5kJ1xuaW1wb3J0IHsgZ2V0STE4biwgaW5pdFJlYWN0STE4bmV4dCB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBnZXRJbml0T3B0aW9ucyB9IGZyb20gJy4vc2V0dGluZ3MnXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJMThuZXh0SW5zdGFuY2UobG5nOiBMb2NhbGUsIHJlc291cmNlczogUmVzb3VyY2UpIHtcbiAgY29uc3QgaW5zdGFuY2UgPSBjcmVhdGVJbnN0YW5jZSgpXG4gIGluc3RhbmNlXG4gICAgLnVzZShpbml0UmVhY3RJMThuZXh0KVxuICAgIC51c2UocmVzb3VyY2VzVG9CYWNrZW5kKChcbiAgICAgIGxhbmd1YWdlOiBMb2NhbGUsXG4gICAgICBuYW1lc3BhY2U6IE5hbWVzcGFjZUtlYmFiQ2FzZSB8IE5hbWVzcGFjZUNhbWVsQ2FzZSxcbiAgICApID0+IHtcbiAgICAgIGNvbnN0IG5hbWVzcGFjZUtlYmFiID0ga2ViYWJDYXNlKG5hbWVzcGFjZSlcbiAgICAgIHJldHVybiBpbXBvcnQoYC4uL2kxOG4vJHtsYW5ndWFnZX0vJHtuYW1lc3BhY2VLZWJhYn0uanNvbmApXG4gICAgfSkpXG4gICAgLmluaXQoe1xuICAgICAgLi4uZ2V0SW5pdE9wdGlvbnMoKSxcbiAgICAgIGxuZyxcbiAgICAgIHJlc291cmNlcyxcbiAgICB9KVxuICByZXR1cm4gaW5zdGFuY2Vcbn1cblxuZXhwb3J0IGNvbnN0IGNoYW5nZUxhbmd1YWdlID0gYXN5bmMgKGxuZz86IExvY2FsZSkgPT4ge1xuICBpZiAoIWxuZylcbiAgICByZXR1cm5cbiAgY29uc3QgaTE4biA9IGdldEkxOG4oKVxuICBhd2FpdCBpMThuLmNoYW5nZUxhbmd1YWdlKGxuZylcbn1cbiJdfQ==