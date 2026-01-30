"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppAccessModeByAppId = exports.updatePinStatus = exports.uninstallApp = exports.fetchInstalledAppList = exports.fetchAppDetail = exports.fetchAppList = void 0;
const base_1 = require("./base");
const fetchAppList = () => {
    return (0, base_1.get)('/explore/apps');
};
exports.fetchAppList = fetchAppList;
const fetchAppDetail = (id) => {
    return (0, base_1.get)(`/explore/apps/${id}`);
};
exports.fetchAppDetail = fetchAppDetail;
const fetchInstalledAppList = (app_id) => {
    return (0, base_1.get)(`/installed-apps${app_id ? `?app_id=${app_id}` : ''}`);
};
exports.fetchInstalledAppList = fetchInstalledAppList;
const uninstallApp = (id) => {
    return (0, base_1.del)(`/installed-apps/${id}`);
};
exports.uninstallApp = uninstallApp;
const updatePinStatus = (id, isPinned) => {
    return (0, base_1.patch)(`/installed-apps/${id}`, {
        body: {
            is_pinned: isPinned,
        },
    });
};
exports.updatePinStatus = updatePinStatus;
const getAppAccessModeByAppId = (appId) => {
    return (0, base_1.get)(`/enterprise/webapp/app/access-mode?appId=${appId}`);
};
exports.getAppAccessModeByAppId = getAppAccessModeByAppId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwbG9yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV4cGxvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsaUNBQXdDO0FBRWpDLE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTtJQUMvQixPQUFPLElBQUEsVUFBRyxFQUdQLGVBQWUsQ0FBQyxDQUFBO0FBQ3JCLENBQUMsQ0FBQTtBQUxZLFFBQUEsWUFBWSxnQkFLeEI7QUFFTSxNQUFNLGNBQWMsR0FBRyxDQUFDLEVBQVUsRUFBZ0IsRUFBRTtJQUN6RCxPQUFPLElBQUEsVUFBRyxFQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ25DLENBQUMsQ0FBQTtBQUZZLFFBQUEsY0FBYyxrQkFFMUI7QUFFTSxNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBc0IsRUFBRSxFQUFFO0lBQzlELE9BQU8sSUFBQSxVQUFHLEVBQUMsa0JBQWtCLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNuRSxDQUFDLENBQUE7QUFGWSxRQUFBLHFCQUFxQix5QkFFakM7QUFFTSxNQUFNLFlBQVksR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFO0lBQ3pDLE9BQU8sSUFBQSxVQUFHLEVBQUMsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDckMsQ0FBQyxDQUFBO0FBRlksUUFBQSxZQUFZLGdCQUV4QjtBQUVNLE1BQU0sZUFBZSxHQUFHLENBQUMsRUFBVSxFQUFFLFFBQWlCLEVBQUUsRUFBRTtJQUMvRCxPQUFPLElBQUEsWUFBSyxFQUFDLG1CQUFtQixFQUFFLEVBQUUsRUFBRTtRQUNwQyxJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsUUFBUTtTQUNwQjtLQUNGLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQU5ZLFFBQUEsZUFBZSxtQkFNM0I7QUFFTSxNQUFNLHVCQUF1QixHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7SUFDdkQsT0FBTyxJQUFBLFVBQUcsRUFBNkIsNENBQTRDLEtBQUssRUFBRSxDQUFDLENBQUE7QUFDN0YsQ0FBQyxDQUFBO0FBRlksUUFBQSx1QkFBdUIsMkJBRW5DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBY2Nlc3NNb2RlIH0gZnJvbSAnQC9tb2RlbHMvYWNjZXNzLWNvbnRyb2wnXG5pbXBvcnQgdHlwZSB7IEFwcCwgQXBwQ2F0ZWdvcnkgfSBmcm9tICdAL21vZGVscy9leHBsb3JlJ1xuaW1wb3J0IHsgZGVsLCBnZXQsIHBhdGNoIH0gZnJvbSAnLi9iYXNlJ1xuXG5leHBvcnQgY29uc3QgZmV0Y2hBcHBMaXN0ID0gKCkgPT4ge1xuICByZXR1cm4gZ2V0PHtcbiAgICBjYXRlZ29yaWVzOiBBcHBDYXRlZ29yeVtdXG4gICAgcmVjb21tZW5kZWRfYXBwczogQXBwW11cbiAgfT4oJy9leHBsb3JlL2FwcHMnKVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hBcHBEZXRhaWwgPSAoaWQ6IHN0cmluZyk6IFByb21pc2U8YW55PiA9PiB7XG4gIHJldHVybiBnZXQoYC9leHBsb3JlL2FwcHMvJHtpZH1gKVxufVxuXG5leHBvcnQgY29uc3QgZmV0Y2hJbnN0YWxsZWRBcHBMaXN0ID0gKGFwcF9pZD86IHN0cmluZyB8IG51bGwpID0+IHtcbiAgcmV0dXJuIGdldChgL2luc3RhbGxlZC1hcHBzJHthcHBfaWQgPyBgP2FwcF9pZD0ke2FwcF9pZH1gIDogJyd9YClcbn1cblxuZXhwb3J0IGNvbnN0IHVuaW5zdGFsbEFwcCA9IChpZDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiBkZWwoYC9pbnN0YWxsZWQtYXBwcy8ke2lkfWApXG59XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVQaW5TdGF0dXMgPSAoaWQ6IHN0cmluZywgaXNQaW5uZWQ6IGJvb2xlYW4pID0+IHtcbiAgcmV0dXJuIHBhdGNoKGAvaW5zdGFsbGVkLWFwcHMvJHtpZH1gLCB7XG4gICAgYm9keToge1xuICAgICAgaXNfcGlubmVkOiBpc1Bpbm5lZCxcbiAgICB9LFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgZ2V0QXBwQWNjZXNzTW9kZUJ5QXBwSWQgPSAoYXBwSWQ6IHN0cmluZykgPT4ge1xuICByZXR1cm4gZ2V0PHsgYWNjZXNzTW9kZTogQWNjZXNzTW9kZSB9PihgL2VudGVycHJpc2Uvd2ViYXBwL2FwcC9hY2Nlc3MtbW9kZT9hcHBJZD0ke2FwcElkfWApXG59XG4iXX0=