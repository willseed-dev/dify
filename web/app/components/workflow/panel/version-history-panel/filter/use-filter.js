"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFilterOptions = void 0;
const react_i18next_1 = require("react-i18next");
const types_1 = require("../../../types");
const useFilterOptions = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return [
        {
            key: types_1.WorkflowVersionFilterOptions.all,
            name: t('versionHistory.filter.all', { ns: 'workflow' }),
        },
        {
            key: types_1.WorkflowVersionFilterOptions.onlyYours,
            name: t('versionHistory.filter.onlyYours', { ns: 'workflow' }),
        },
    ];
};
exports.useFilterOptions = useFilterOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaURBQThDO0FBQzlDLDBDQUE2RDtBQUV0RCxNQUFNLGdCQUFnQixHQUFHLEdBQUcsRUFBRTtJQUNuQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFFOUIsT0FBTztRQUNMO1lBQ0UsR0FBRyxFQUFFLG9DQUE0QixDQUFDLEdBQUc7WUFDckMsSUFBSSxFQUFFLENBQUMsQ0FBQywyQkFBMkIsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztTQUN6RDtRQUNEO1lBQ0UsR0FBRyxFQUFFLG9DQUE0QixDQUFDLFNBQVM7WUFDM0MsSUFBSSxFQUFFLENBQUMsQ0FBQyxpQ0FBaUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQztTQUMvRDtLQUNGLENBQUE7QUFDSCxDQUFDLENBQUE7QUFiWSxRQUFBLGdCQUFnQixvQkFhNUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ3JlYWN0LWkxOG5leHQnXG5pbXBvcnQgeyBXb3JrZmxvd1ZlcnNpb25GaWx0ZXJPcHRpb25zIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCB1c2VGaWx0ZXJPcHRpb25zID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcblxuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIGtleTogV29ya2Zsb3dWZXJzaW9uRmlsdGVyT3B0aW9ucy5hbGwsXG4gICAgICBuYW1lOiB0KCd2ZXJzaW9uSGlzdG9yeS5maWx0ZXIuYWxsJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGtleTogV29ya2Zsb3dWZXJzaW9uRmlsdGVyT3B0aW9ucy5vbmx5WW91cnMsXG4gICAgICBuYW1lOiB0KCd2ZXJzaW9uSGlzdG9yeS5maWx0ZXIub25seVlvdXJzJywgeyBuczogJ3dvcmtmbG93JyB9KSxcbiAgICB9LFxuICBdXG59XG4iXX0=