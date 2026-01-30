"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEdgeColor = void 0;
const types_1 = require("../types");
const getEdgeColor = (nodeRunningStatus, isFailBranch) => {
    if (nodeRunningStatus === types_1.NodeRunningStatus.Succeeded)
        return 'var(--color-workflow-link-line-success-handle)';
    if (nodeRunningStatus === types_1.NodeRunningStatus.Failed)
        return 'var(--color-workflow-link-line-error-handle)';
    if (nodeRunningStatus === types_1.NodeRunningStatus.Exception)
        return 'var(--color-workflow-link-line-failure-handle)';
    if (nodeRunningStatus === types_1.NodeRunningStatus.Running) {
        if (isFailBranch)
            return 'var(--color-workflow-link-line-failure-handle)';
        return 'var(--color-workflow-link-line-handle)';
    }
    return 'var(--color-workflow-link-line-normal)';
};
exports.getEdgeColor = getEdgeColor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0NBRWlCO0FBRVYsTUFBTSxZQUFZLEdBQUcsQ0FBQyxpQkFBcUMsRUFBRSxZQUFzQixFQUFFLEVBQUU7SUFDNUYsSUFBSSxpQkFBaUIsS0FBSyx5QkFBaUIsQ0FBQyxTQUFTO1FBQ25ELE9BQU8sZ0RBQWdELENBQUE7SUFFekQsSUFBSSxpQkFBaUIsS0FBSyx5QkFBaUIsQ0FBQyxNQUFNO1FBQ2hELE9BQU8sOENBQThDLENBQUE7SUFFdkQsSUFBSSxpQkFBaUIsS0FBSyx5QkFBaUIsQ0FBQyxTQUFTO1FBQ25ELE9BQU8sZ0RBQWdELENBQUE7SUFFekQsSUFBSSxpQkFBaUIsS0FBSyx5QkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwRCxJQUFJLFlBQVk7WUFDZCxPQUFPLGdEQUFnRCxDQUFBO1FBRXpELE9BQU8sd0NBQXdDLENBQUE7SUFDakQsQ0FBQztJQUVELE9BQU8sd0NBQXdDLENBQUE7QUFDakQsQ0FBQyxDQUFBO0FBbEJZLFFBQUEsWUFBWSxnQkFrQnhCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTm9kZVJ1bm5pbmdTdGF0dXMsXG59IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgZ2V0RWRnZUNvbG9yID0gKG5vZGVSdW5uaW5nU3RhdHVzPzogTm9kZVJ1bm5pbmdTdGF0dXMsIGlzRmFpbEJyYW5jaD86IGJvb2xlYW4pID0+IHtcbiAgaWYgKG5vZGVSdW5uaW5nU3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5TdWNjZWVkZWQpXG4gICAgcmV0dXJuICd2YXIoLS1jb2xvci13b3JrZmxvdy1saW5rLWxpbmUtc3VjY2Vzcy1oYW5kbGUpJ1xuXG4gIGlmIChub2RlUnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuRmFpbGVkKVxuICAgIHJldHVybiAndmFyKC0tY29sb3Itd29ya2Zsb3ctbGluay1saW5lLWVycm9yLWhhbmRsZSknXG5cbiAgaWYgKG5vZGVSdW5uaW5nU3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5FeGNlcHRpb24pXG4gICAgcmV0dXJuICd2YXIoLS1jb2xvci13b3JrZmxvdy1saW5rLWxpbmUtZmFpbHVyZS1oYW5kbGUpJ1xuXG4gIGlmIChub2RlUnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuUnVubmluZykge1xuICAgIGlmIChpc0ZhaWxCcmFuY2gpXG4gICAgICByZXR1cm4gJ3ZhcigtLWNvbG9yLXdvcmtmbG93LWxpbmstbGluZS1mYWlsdXJlLWhhbmRsZSknXG5cbiAgICByZXR1cm4gJ3ZhcigtLWNvbG9yLXdvcmtmbG93LWxpbmstbGluZS1oYW5kbGUpJ1xuICB9XG5cbiAgcmV0dXJuICd2YXIoLS1jb2xvci13b3JrZmxvdy1saW5rLWxpbmUtbm9ybWFsKSdcbn1cbiJdfQ==