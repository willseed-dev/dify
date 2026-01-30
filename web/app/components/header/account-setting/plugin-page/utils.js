"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePluginKey = exports.validatePluginKey = void 0;
const common_1 = require("@/service/common");
const declarations_1 = require("../key-validator/declarations");
const validatePluginKey = async (pluginType, body) => {
    try {
        const res = await (0, common_1.validatePluginProviderKey)({
            url: `/workspaces/current/tool-providers/${pluginType}/credentials-validate`,
            body,
        });
        if (res.result === 'success')
            return Promise.resolve({ status: declarations_1.ValidatedStatus.Success });
        else
            return Promise.resolve({ status: declarations_1.ValidatedStatus.Error, message: res.error });
    }
    catch (e) {
        return Promise.resolve({ status: declarations_1.ValidatedStatus.Error, message: e.message });
    }
};
exports.validatePluginKey = validatePluginKey;
const updatePluginKey = async (pluginType, body) => {
    try {
        const res = await (0, common_1.updatePluginProviderAIKey)({
            url: `/workspaces/current/tool-providers/${pluginType}/credentials`,
            body,
        });
        if (res.result === 'success')
            return Promise.resolve({ status: declarations_1.ValidatedStatus.Success });
        else
            return Promise.resolve({ status: declarations_1.ValidatedStatus.Error, message: res.error });
    }
    catch (e) {
        return Promise.resolve({ status: declarations_1.ValidatedStatus.Error, message: e.message });
    }
};
exports.updatePluginKey = updatePluginKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBdUY7QUFDdkYsZ0VBQStEO0FBRXhELE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUFFLFVBQWtCLEVBQUUsSUFBUyxFQUFFLEVBQUU7SUFDdkUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFBLGtDQUF5QixFQUFDO1lBQzFDLEdBQUcsRUFBRSxzQ0FBc0MsVUFBVSx1QkFBdUI7WUFDNUUsSUFBSTtTQUNMLENBQUMsQ0FBQTtRQUNGLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTO1lBQzFCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7O1lBRTNELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSw4QkFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDakYsQ0FBQztJQUNELE9BQU8sQ0FBTSxFQUFFLENBQUM7UUFDZCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQy9FLENBQUM7QUFDSCxDQUFDLENBQUE7QUFkWSxRQUFBLGlCQUFpQixxQkFjN0I7QUFFTSxNQUFNLGVBQWUsR0FBRyxLQUFLLEVBQUUsVUFBa0IsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUNyRSxJQUFJLENBQUM7UUFDSCxNQUFNLEdBQUcsR0FBRyxNQUFNLElBQUEsa0NBQXlCLEVBQUM7WUFDMUMsR0FBRyxFQUFFLHNDQUFzQyxVQUFVLGNBQWM7WUFDbkUsSUFBSTtTQUNMLENBQUMsQ0FBQTtRQUNGLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTO1lBQzFCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSw4QkFBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7O1lBRTNELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSw4QkFBZSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDakYsQ0FBQztJQUNELE9BQU8sQ0FBTSxFQUFFLENBQUM7UUFDZCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsOEJBQWUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQy9FLENBQUM7QUFDSCxDQUFDLENBQUE7QUFkWSxRQUFBLGVBQWUsbUJBYzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXBkYXRlUGx1Z2luUHJvdmlkZXJBSUtleSwgdmFsaWRhdGVQbHVnaW5Qcm92aWRlcktleSB9IGZyb20gJ0Avc2VydmljZS9jb21tb24nXG5pbXBvcnQgeyBWYWxpZGF0ZWRTdGF0dXMgfSBmcm9tICcuLi9rZXktdmFsaWRhdG9yL2RlY2xhcmF0aW9ucydcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlUGx1Z2luS2V5ID0gYXN5bmMgKHBsdWdpblR5cGU6IHN0cmluZywgYm9keTogYW55KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzID0gYXdhaXQgdmFsaWRhdGVQbHVnaW5Qcm92aWRlcktleSh7XG4gICAgICB1cmw6IGAvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXJzLyR7cGx1Z2luVHlwZX0vY3JlZGVudGlhbHMtdmFsaWRhdGVgLFxuICAgICAgYm9keSxcbiAgICB9KVxuICAgIGlmIChyZXMucmVzdWx0ID09PSAnc3VjY2VzcycpXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgc3RhdHVzOiBWYWxpZGF0ZWRTdGF0dXMuU3VjY2VzcyB9KVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBzdGF0dXM6IFZhbGlkYXRlZFN0YXR1cy5FcnJvciwgbWVzc2FnZTogcmVzLmVycm9yIH0pXG4gIH1cbiAgY2F0Y2ggKGU6IGFueSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBzdGF0dXM6IFZhbGlkYXRlZFN0YXR1cy5FcnJvciwgbWVzc2FnZTogZS5tZXNzYWdlIH0pXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHVwZGF0ZVBsdWdpbktleSA9IGFzeW5jIChwbHVnaW5UeXBlOiBzdHJpbmcsIGJvZHk6IGFueSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IHVwZGF0ZVBsdWdpblByb3ZpZGVyQUlLZXkoe1xuICAgICAgdXJsOiBgL3dvcmtzcGFjZXMvY3VycmVudC90b29sLXByb3ZpZGVycy8ke3BsdWdpblR5cGV9L2NyZWRlbnRpYWxzYCxcbiAgICAgIGJvZHksXG4gICAgfSlcbiAgICBpZiAocmVzLnJlc3VsdCA9PT0gJ3N1Y2Nlc3MnKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHN0YXR1czogVmFsaWRhdGVkU3RhdHVzLlN1Y2Nlc3MgfSlcbiAgICBlbHNlXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgc3RhdHVzOiBWYWxpZGF0ZWRTdGF0dXMuRXJyb3IsIG1lc3NhZ2U6IHJlcy5lcnJvciB9KVxuICB9XG4gIGNhdGNoIChlOiBhbnkpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgc3RhdHVzOiBWYWxpZGF0ZWRTdGF0dXMuRXJyb3IsIG1lc3NhZ2U6IGUubWVzc2FnZSB9KVxuICB9XG59XG4iXX0=