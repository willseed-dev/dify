"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateModelLoadBalancingConfig = exports.useActiveModelCredential = exports.useDeleteModel = exports.useDeleteModelCredential = exports.useEditModelCredential = exports.useAddModelCredential = exports.useGetModelCredential = exports.useActiveProviderCredential = exports.useDeleteProviderCredential = exports.useEditProviderCredential = exports.useAddProviderCredential = exports.useGetProviderCredential = exports.useModelProviderModelList = void 0;
const react_query_1 = require("@tanstack/react-query");
const base_1 = require("./base");
const NAME_SPACE = 'models';
const useModelProviderModelList = (provider) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'model-list', provider],
        queryFn: () => (0, base_1.get)(`/workspaces/current/model-providers/${provider}/models`),
    });
};
exports.useModelProviderModelList = useModelProviderModelList;
const useGetProviderCredential = (enabled, provider, credentialId) => {
    return (0, react_query_1.useQuery)({
        enabled,
        queryKey: [NAME_SPACE, 'model-list', provider, credentialId],
        queryFn: () => (0, base_1.get)(`/workspaces/current/model-providers/${provider}/credentials${credentialId ? `?credential_id=${credentialId}` : ''}`),
    });
};
exports.useGetProviderCredential = useGetProviderCredential;
const useAddProviderCredential = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.post)(`/workspaces/current/model-providers/${provider}/credentials`, {
            body: data,
        }),
    });
};
exports.useAddProviderCredential = useAddProviderCredential;
const useEditProviderCredential = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.put)(`/workspaces/current/model-providers/${provider}/credentials`, {
            body: data,
        }),
    });
};
exports.useEditProviderCredential = useEditProviderCredential;
const useDeleteProviderCredential = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.del)(`/workspaces/current/model-providers/${provider}/credentials`, {
            body: data,
        }),
    });
};
exports.useDeleteProviderCredential = useDeleteProviderCredential;
const useActiveProviderCredential = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.post)(`/workspaces/current/model-providers/${provider}/credentials/switch`, {
            body: data,
        }),
    });
};
exports.useActiveProviderCredential = useActiveProviderCredential;
const useGetModelCredential = (enabled, provider, credentialId, model, modelType, configFrom) => {
    return (0, react_query_1.useQuery)({
        enabled,
        queryKey: [NAME_SPACE, 'model-list', provider, model, modelType, credentialId, configFrom],
        queryFn: () => (0, base_1.get)(`/workspaces/current/model-providers/${provider}/models/credentials?model=${model}&model_type=${modelType}&config_from=${configFrom}${credentialId ? `&credential_id=${credentialId}` : ''}`),
        staleTime: 0,
        gcTime: 0,
    });
};
exports.useGetModelCredential = useGetModelCredential;
const useAddModelCredential = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.post)(`/workspaces/current/model-providers/${provider}/models/credentials`, {
            body: data,
        }),
    });
};
exports.useAddModelCredential = useAddModelCredential;
const useEditModelCredential = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.put)(`/workspaces/current/model-providers/${provider}/models/credentials`, {
            body: data,
        }),
    });
};
exports.useEditModelCredential = useEditModelCredential;
const useDeleteModelCredential = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.del)(`/workspaces/current/model-providers/${provider}/models/credentials`, {
            body: data,
        }),
    });
};
exports.useDeleteModelCredential = useDeleteModelCredential;
const useDeleteModel = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.del)(`/workspaces/current/model-providers/${provider}/models`, {
            body: data,
        }),
    });
};
exports.useDeleteModel = useDeleteModel;
const useActiveModelCredential = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.post)(`/workspaces/current/model-providers/${provider}/models/credentials/switch`, {
            body: data,
        }),
    });
};
exports.useActiveModelCredential = useActiveModelCredential;
const useUpdateModelLoadBalancingConfig = (provider) => {
    return (0, react_query_1.useMutation)({
        mutationFn: (data) => (0, base_1.post)(`/workspaces/current/model-providers/${provider}/models`, {
            body: data,
        }),
    });
};
exports.useUpdateModelLoadBalancingConfig = useUpdateModelLoadBalancingConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW1vZGVscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1tb2RlbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsdURBSThCO0FBQzlCLGlDQUtlO0FBRWYsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFBO0FBRXBCLE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDNUQsT0FBTyxJQUFBLHNCQUFRLEVBQUM7UUFDZCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsQ0FBQztRQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxVQUFHLEVBQXdCLHVDQUF1QyxRQUFRLFNBQVMsQ0FBQztLQUNwRyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFMWSxRQUFBLHlCQUF5Qiw2QkFLckM7QUFFTSxNQUFNLHdCQUF3QixHQUFHLENBQUMsT0FBZ0IsRUFBRSxRQUFnQixFQUFFLFlBQXFCLEVBQUUsRUFBRTtJQUNwRyxPQUFPLElBQUEsc0JBQVEsRUFBQztRQUNkLE9BQU87UUFDUCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUM7UUFDNUQsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUEsVUFBRyxFQUFxQix1Q0FBdUMsUUFBUSxlQUFlLFlBQVksQ0FBQyxDQUFDLENBQUMsa0JBQWtCLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztLQUM3SixDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFOWSxRQUFBLHdCQUF3Qiw0QkFNcEM7QUFFTSxNQUFNLHdCQUF3QixHQUFHLENBQUMsUUFBZ0IsRUFBRSxFQUFFO0lBQzNELE9BQU8sSUFBQSx5QkFBVyxFQUFDO1FBQ2pCLFVBQVUsRUFBRSxDQUFDLElBQXdCLEVBQUUsRUFBRSxDQUFDLElBQUEsV0FBSSxFQUFxQix1Q0FBdUMsUUFBUSxjQUFjLEVB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c0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUge1xuICBNb2RlbENyZWRlbnRpYWwsXG4gIE1vZGVsSXRlbSxcbiAgTW9kZWxMb2FkQmFsYW5jaW5nQ29uZmlnLFxuICBNb2RlbFR5cGVFbnVtLFxuICBQcm92aWRlckNyZWRlbnRpYWwsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9tb2RlbC1wcm92aWRlci1wYWdlL2RlY2xhcmF0aW9ucydcbmltcG9ydCB7XG4gIHVzZU11dGF0aW9uLFxuICB1c2VRdWVyeSxcbiAgLy8gdXNlUXVlcnlDbGllbnQsXG59IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7XG4gIGRlbCxcbiAgZ2V0LFxuICBwb3N0LFxuICBwdXQsXG59IGZyb20gJy4vYmFzZSdcblxuY29uc3QgTkFNRV9TUEFDRSA9ICdtb2RlbHMnXG5cbmV4cG9ydCBjb25zdCB1c2VNb2RlbFByb3ZpZGVyTW9kZWxMaXN0ID0gKHByb3ZpZGVyOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5KHtcbiAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdtb2RlbC1saXN0JywgcHJvdmlkZXJdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDx7IGRhdGE6IE1vZGVsSXRlbVtdIH0+KGAvd29ya3NwYWNlcy9jdXJyZW50L21vZGVsLXByb3ZpZGVycy8ke3Byb3ZpZGVyfS9tb2RlbHNgKSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUdldFByb3ZpZGVyQ3JlZGVudGlhbCA9IChlbmFibGVkOiBib29sZWFuLCBwcm92aWRlcjogc3RyaW5nLCBjcmVkZW50aWFsSWQ/OiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5KHtcbiAgICBlbmFibGVkLFxuICAgIHF1ZXJ5S2V5OiBbTkFNRV9TUEFDRSwgJ21vZGVsLWxpc3QnLCBwcm92aWRlciwgY3JlZGVudGlhbElkXSxcbiAgICBxdWVyeUZuOiAoKSA9PiBnZXQ8UHJvdmlkZXJDcmVkZW50aWFsPihgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vY3JlZGVudGlhbHMke2NyZWRlbnRpYWxJZCA/IGA/Y3JlZGVudGlhbF9pZD0ke2NyZWRlbnRpYWxJZH1gIDogJyd9YCksXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VBZGRQcm92aWRlckNyZWRlbnRpYWwgPSAocHJvdmlkZXI6IHN0cmluZykgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46IChkYXRhOiBQcm92aWRlckNyZWRlbnRpYWwpID0+IHBvc3Q8eyByZXN1bHQ6IHN0cmluZyB9PihgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vY3JlZGVudGlhbHNgLCB7XG4gICAgICBib2R5OiBkYXRhLFxuICAgIH0pLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlRWRpdFByb3ZpZGVyQ3JlZGVudGlhbCA9IChwcm92aWRlcjogc3RyaW5nKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25GbjogKGRhdGE6IFByb3ZpZGVyQ3JlZGVudGlhbCkgPT4gcHV0PHsgcmVzdWx0OiBzdHJpbmcgfT4oYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWwtcHJvdmlkZXJzLyR7cHJvdmlkZXJ9L2NyZWRlbnRpYWxzYCwge1xuICAgICAgYm9keTogZGF0YSxcbiAgICB9KSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURlbGV0ZVByb3ZpZGVyQ3JlZGVudGlhbCA9IChwcm92aWRlcjogc3RyaW5nKSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25GbjogKGRhdGE6IHtcbiAgICAgIGNyZWRlbnRpYWxfaWQ6IHN0cmluZ1xuICAgIH0pID0+IGRlbDx7IHJlc3VsdDogc3RyaW5nIH0+KGAvd29ya3NwYWNlcy9jdXJyZW50L21vZGVsLXByb3ZpZGVycy8ke3Byb3ZpZGVyfS9jcmVkZW50aWFsc2AsIHtcbiAgICAgIGJvZHk6IGRhdGEsXG4gICAgfSksXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VBY3RpdmVQcm92aWRlckNyZWRlbnRpYWwgPSAocHJvdmlkZXI6IHN0cmluZykgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46IChkYXRhOiB7XG4gICAgICBjcmVkZW50aWFsX2lkOiBzdHJpbmdcbiAgICAgIG1vZGVsPzogc3RyaW5nXG4gICAgICBtb2RlbF90eXBlPzogTW9kZWxUeXBlRW51bVxuICAgIH0pID0+IHBvc3Q8eyByZXN1bHQ6IHN0cmluZyB9PihgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vY3JlZGVudGlhbHMvc3dpdGNoYCwge1xuICAgICAgYm9keTogZGF0YSxcbiAgICB9KSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUdldE1vZGVsQ3JlZGVudGlhbCA9IChcbiAgZW5hYmxlZDogYm9vbGVhbixcbiAgcHJvdmlkZXI6IHN0cmluZyxcbiAgY3JlZGVudGlhbElkPzogc3RyaW5nLFxuICBtb2RlbD86IHN0cmluZyxcbiAgbW9kZWxUeXBlPzogc3RyaW5nLFxuICBjb25maWdGcm9tPzogc3RyaW5nLFxuKSA9PiB7XG4gIHJldHVybiB1c2VRdWVyeSh7XG4gICAgZW5hYmxlZCxcbiAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdtb2RlbC1saXN0JywgcHJvdmlkZXIsIG1vZGVsLCBtb2RlbFR5cGUsIGNyZWRlbnRpYWxJZCwgY29uZmlnRnJvbV0sXG4gICAgcXVlcnlGbjogKCkgPT4gZ2V0PE1vZGVsQ3JlZGVudGlhbD4oYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWwtcHJvdmlkZXJzLyR7cHJvdmlkZXJ9L21vZGVscy9jcmVkZW50aWFscz9tb2RlbD0ke21vZGVsfSZtb2RlbF90eXBlPSR7bW9kZWxUeXBlfSZjb25maWdfZnJvbT0ke2NvbmZpZ0Zyb219JHtjcmVkZW50aWFsSWQgPyBgJmNyZWRlbnRpYWxfaWQ9JHtjcmVkZW50aWFsSWR9YCA6ICcnfWApLFxuICAgIHN0YWxlVGltZTogMCxcbiAgICBnY1RpbWU6IDAsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VBZGRNb2RlbENyZWRlbnRpYWwgPSAocHJvdmlkZXI6IHN0cmluZykgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46IChkYXRhOiBNb2RlbENyZWRlbnRpYWwpID0+IHBvc3Q8eyByZXN1bHQ6IHN0cmluZyB9PihgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vbW9kZWxzL2NyZWRlbnRpYWxzYCwge1xuICAgICAgYm9keTogZGF0YSxcbiAgICB9KSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUVkaXRNb2RlbENyZWRlbnRpYWwgPSAocHJvdmlkZXI6IHN0cmluZykgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uRm46IChkYXRhOiBNb2RlbENyZWRlbnRpYWwpID0+IHB1dDx7IHJlc3VsdDogc3RyaW5nIH0+KGAvd29ya3NwYWNlcy9jdXJyZW50L21vZGVsLXByb3ZpZGVycy8ke3Byb3ZpZGVyfS9tb2RlbHMvY3JlZGVudGlhbHNgLCB7XG4gICAgICBib2R5OiBkYXRhLFxuICAgIH0pLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlRGVsZXRlTW9kZWxDcmVkZW50aWFsID0gKHByb3ZpZGVyOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbkZuOiAoZGF0YToge1xuICAgICAgY3JlZGVudGlhbF9pZDogc3RyaW5nXG4gICAgICBtb2RlbD86IHN0cmluZ1xuICAgICAgbW9kZWxfdHlwZT86IE1vZGVsVHlwZUVudW1cbiAgICB9KSA9PiBkZWw8eyByZXN1bHQ6IHN0cmluZyB9PihgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vbW9kZWxzL2NyZWRlbnRpYWxzYCwge1xuICAgICAgYm9keTogZGF0YSxcbiAgICB9KSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURlbGV0ZU1vZGVsID0gKHByb3ZpZGVyOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbkZuOiAoZGF0YToge1xuICAgICAgbW9kZWw6IHN0cmluZ1xuICAgICAgbW9kZWxfdHlwZTogTW9kZWxUeXBlRW51bVxuICAgIH0pID0+IGRlbDx7IHJlc3VsdDogc3RyaW5nIH0+KGAvd29ya3NwYWNlcy9jdXJyZW50L21vZGVsLXByb3ZpZGVycy8ke3Byb3ZpZGVyfS9tb2RlbHNgLCB7XG4gICAgICBib2R5OiBkYXRhLFxuICAgIH0pLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlQWN0aXZlTW9kZWxDcmVkZW50aWFsID0gKHByb3ZpZGVyOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbkZuOiAoZGF0YToge1xuICAgICAgY3JlZGVudGlhbF9pZDogc3RyaW5nXG4gICAgICBtb2RlbD86IHN0cmluZ1xuICAgICAgbW9kZWxfdHlwZT86IE1vZGVsVHlwZUVudW1cbiAgICB9KSA9PiBwb3N0PHsgcmVzdWx0OiBzdHJpbmcgfT4oYC93b3Jrc3BhY2VzL2N1cnJlbnQvbW9kZWwtcHJvdmlkZXJzLyR7cHJvdmlkZXJ9L21vZGVscy9jcmVkZW50aWFscy9zd2l0Y2hgLCB7XG4gICAgICBib2R5OiBkYXRhLFxuICAgIH0pLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlVXBkYXRlTW9kZWxMb2FkQmFsYW5jaW5nQ29uZmlnID0gKHByb3ZpZGVyOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbkZuOiAoZGF0YToge1xuICAgICAgY29uZmlnX2Zyb206IHN0cmluZ1xuICAgICAgbW9kZWw6IHN0cmluZ1xuICAgICAgbW9kZWxfdHlwZTogTW9kZWxUeXBlRW51bVxuICAgICAgbG9hZF9iYWxhbmNpbmc6IE1vZGVsTG9hZEJhbGFuY2luZ0NvbmZpZ1xuICAgICAgY3JlZGVudGlhbF9pZD86IHN0cmluZ1xuICAgIH0pID0+IHBvc3Q8eyByZXN1bHQ6IHN0cmluZyB9PihgL3dvcmtzcGFjZXMvY3VycmVudC9tb2RlbC1wcm92aWRlcnMvJHtwcm92aWRlcn0vbW9kZWxzYCwge1xuICAgICAgYm9keTogZGF0YSxcbiAgICB9KSxcbiAgfSlcbn1cbiJdfQ==