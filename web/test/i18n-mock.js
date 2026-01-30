"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTFunction = createTFunction;
exports.createUseTranslationMock = createUseTranslationMock;
exports.createTransMock = createTransMock;
exports.createReactI18nextMock = createReactI18nextMock;
const React = require("react");
const vitest_1 = require("vitest");
/**
 * Create a t function with optional custom translations
 * Checks translations[key] first, then translations[ns.key], then returns ns.key as fallback
 */
function createTFunction(translations, defaultNs) {
    return (key, options) => {
        // Check custom translations first (without namespace)
        if (translations[key] !== undefined)
            return translations[key];
        const ns = options?.ns ?? defaultNs;
        const fullKey = ns ? `${ns}.${key}` : key;
        // Check custom translations with namespace
        if (translations[fullKey] !== undefined)
            return translations[fullKey];
        // Serialize params (excluding ns) for test assertions
        const params = { ...options };
        delete params.ns;
        const suffix = Object.keys(params).length > 0 ? `:${JSON.stringify(params)}` : '';
        return `${fullKey}${suffix}`;
    };
}
/**
 * Create useTranslation mock with optional custom translations
 *
 * @example
 * vi.mock('react-i18next', () => createUseTranslationMock({
 *   'operation.confirm': 'Confirm',
 * }))
 */
function createUseTranslationMock(translations = {}) {
    return {
        useTranslation: (defaultNs) => ({
            t: createTFunction(translations, defaultNs),
            i18n: {
                language: 'en',
                changeLanguage: vitest_1.vi.fn(),
            },
        }),
    };
}
/**
 * Create Trans component mock with optional custom translations
 */
function createTransMock(translations = {}) {
    return {
        Trans: ({ i18nKey, children }) => {
            const text = translations[i18nKey] ?? i18nKey;
            return React.createElement('span', { 'data-i18n-key': i18nKey }, children ?? text);
        },
    };
}
/**
 * Create complete react-i18next mock (useTranslation + Trans)
 *
 * @example
 * vi.mock('react-i18next', () => createReactI18nextMock({
 *   'modal.title': 'My Modal',
 * }))
 */
function createReactI18nextMock(translations = {}) {
    return {
        ...createUseTranslationMock(translations),
        ...createTransMock(translations),
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi1tb2NrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaTE4bi1tb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EsMENBbUJDO0FBVUQsNERBVUM7QUFLRCwwQ0FVQztBQVVELHdEQUtDO0FBOUVELCtCQUE4QjtBQUM5QixtQ0FBMkI7QUFJM0I7OztHQUdHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFDLFlBQTRCLEVBQUUsU0FBa0I7SUFDOUUsT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFpQyxFQUFFLEVBQUU7UUFDeEQsc0RBQXNEO1FBQ3RELElBQUksWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVM7WUFDakMsT0FBTyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFMUIsTUFBTSxFQUFFLEdBQUksT0FBTyxFQUFFLEVBQXlCLElBQUksU0FBUyxDQUFBO1FBQzNELE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQTtRQUV6QywyQ0FBMkM7UUFDM0MsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUztZQUNyQyxPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUU5QixzREFBc0Q7UUFDdEQsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFBO1FBQzdCLE9BQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQTtRQUNoQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDakYsT0FBTyxHQUFHLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQTtJQUM5QixDQUFDLENBQUE7QUFDSCxDQUFDO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLHdCQUF3QixDQUFDLGVBQStCLEVBQUU7SUFDeEUsT0FBTztRQUNMLGNBQWMsRUFBRSxDQUFDLFNBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdkMsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDO1lBQzNDLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSTtnQkFDZCxjQUFjLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTthQUN4QjtTQUNGLENBQUM7S0FDSCxDQUFBO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsZUFBZSxDQUFDLGVBQStCLEVBQUU7SUFDL0QsT0FBTztRQUNMLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFHMUIsRUFBRSxFQUFFO1lBQ0gsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQTtZQUM3QyxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxFQUFFLFFBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQTtRQUNwRixDQUFDO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsZUFBK0IsRUFBRTtJQUN0RSxPQUFPO1FBQ0wsR0FBRyx3QkFBd0IsQ0FBQyxZQUFZLENBQUM7UUFDekMsR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDO0tBQ2pDLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB2aSB9IGZyb20gJ3ZpdGVzdCdcblxudHlwZSBUcmFuc2xhdGlvbk1hcCA9IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHN0cmluZ1tdPlxuXG4vKipcbiAqIENyZWF0ZSBhIHQgZnVuY3Rpb24gd2l0aCBvcHRpb25hbCBjdXN0b20gdHJhbnNsYXRpb25zXG4gKiBDaGVja3MgdHJhbnNsYXRpb25zW2tleV0gZmlyc3QsIHRoZW4gdHJhbnNsYXRpb25zW25zLmtleV0sIHRoZW4gcmV0dXJucyBucy5rZXkgYXMgZmFsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRGdW5jdGlvbih0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uTWFwLCBkZWZhdWx0TnM/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIChrZXk6IHN0cmluZywgb3B0aW9ucz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB7XG4gICAgLy8gQ2hlY2sgY3VzdG9tIHRyYW5zbGF0aW9ucyBmaXJzdCAod2l0aG91dCBuYW1lc3BhY2UpXG4gICAgaWYgKHRyYW5zbGF0aW9uc1trZXldICE9PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gdHJhbnNsYXRpb25zW2tleV1cblxuICAgIGNvbnN0IG5zID0gKG9wdGlvbnM/Lm5zIGFzIHN0cmluZyB8IHVuZGVmaW5lZCkgPz8gZGVmYXVsdE5zXG4gICAgY29uc3QgZnVsbEtleSA9IG5zID8gYCR7bnN9LiR7a2V5fWAgOiBrZXlcblxuICAgIC8vIENoZWNrIGN1c3RvbSB0cmFuc2xhdGlvbnMgd2l0aCBuYW1lc3BhY2VcbiAgICBpZiAodHJhbnNsYXRpb25zW2Z1bGxLZXldICE9PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gdHJhbnNsYXRpb25zW2Z1bGxLZXldXG5cbiAgICAvLyBTZXJpYWxpemUgcGFyYW1zIChleGNsdWRpbmcgbnMpIGZvciB0ZXN0IGFzc2VydGlvbnNcbiAgICBjb25zdCBwYXJhbXMgPSB7IC4uLm9wdGlvbnMgfVxuICAgIGRlbGV0ZSBwYXJhbXMubnNcbiAgICBjb25zdCBzdWZmaXggPSBPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA+IDAgPyBgOiR7SlNPTi5zdHJpbmdpZnkocGFyYW1zKX1gIDogJydcbiAgICByZXR1cm4gYCR7ZnVsbEtleX0ke3N1ZmZpeH1gXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgdXNlVHJhbnNsYXRpb24gbW9jayB3aXRoIG9wdGlvbmFsIGN1c3RvbSB0cmFuc2xhdGlvbnNcbiAqXG4gKiBAZXhhbXBsZVxuICogdmkubW9jaygncmVhY3QtaTE4bmV4dCcsICgpID0+IGNyZWF0ZVVzZVRyYW5zbGF0aW9uTW9jayh7XG4gKiAgICdvcGVyYXRpb24uY29uZmlybSc6ICdDb25maXJtJyxcbiAqIH0pKVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVXNlVHJhbnNsYXRpb25Nb2NrKHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25NYXAgPSB7fSkge1xuICByZXR1cm4ge1xuICAgIHVzZVRyYW5zbGF0aW9uOiAoZGVmYXVsdE5zPzogc3RyaW5nKSA9PiAoe1xuICAgICAgdDogY3JlYXRlVEZ1bmN0aW9uKHRyYW5zbGF0aW9ucywgZGVmYXVsdE5zKSxcbiAgICAgIGkxOG46IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgICAgIGNoYW5nZUxhbmd1YWdlOiB2aS5mbigpLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZSBUcmFucyBjb21wb25lbnQgbW9jayB3aXRoIG9wdGlvbmFsIGN1c3RvbSB0cmFuc2xhdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRyYW5zTW9jayh0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uTWFwID0ge30pIHtcbiAgcmV0dXJuIHtcbiAgICBUcmFuczogKHsgaTE4bktleSwgY2hpbGRyZW4gfToge1xuICAgICAgaTE4bktleTogc3RyaW5nXG4gICAgICBjaGlsZHJlbj86IFJlYWN0LlJlYWN0Tm9kZVxuICAgIH0pID0+IHtcbiAgICAgIGNvbnN0IHRleHQgPSB0cmFuc2xhdGlvbnNbaTE4bktleV0gPz8gaTE4bktleVxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7ICdkYXRhLWkxOG4ta2V5JzogaTE4bktleSB9LCBjaGlsZHJlbiA/PyB0ZXh0KVxuICAgIH0sXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgY29tcGxldGUgcmVhY3QtaTE4bmV4dCBtb2NrICh1c2VUcmFuc2xhdGlvbiArIFRyYW5zKVxuICpcbiAqIEBleGFtcGxlXG4gKiB2aS5tb2NrKCdyZWFjdC1pMThuZXh0JywgKCkgPT4gY3JlYXRlUmVhY3RJMThuZXh0TW9jayh7XG4gKiAgICdtb2RhbC50aXRsZSc6ICdNeSBNb2RhbCcsXG4gKiB9KSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlYWN0STE4bmV4dE1vY2sodHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbk1hcCA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgLi4uY3JlYXRlVXNlVHJhbnNsYXRpb25Nb2NrKHRyYW5zbGF0aW9ucyksXG4gICAgLi4uY3JlYXRlVHJhbnNNb2NrKHRyYW5zbGF0aW9ucyksXG4gIH1cbn1cbiJdfQ==