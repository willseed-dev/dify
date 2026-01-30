"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteDataset = exports.useCheckDatasetUsage = void 0;
const react_query_1 = require("@tanstack/react-query");
const datasets_1 = require("./datasets");
const NAME_SPACE = 'dataset-card';
const useCheckDatasetUsage = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'check-usage'],
        mutationFn: (datasetId) => (0, datasets_1.checkIsUsedInApp)(datasetId),
    });
};
exports.useCheckDatasetUsage = useCheckDatasetUsage;
const useDeleteDataset = () => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'delete'],
        mutationFn: (datasetId) => (0, datasets_1.deleteDataset)(datasetId),
    });
};
exports.useDeleteDataset = useDeleteDataset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWRhdGFzZXQtY2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1kYXRhc2V0LWNhcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdURBQW1EO0FBQ25ELHlDQUE0RDtBQUU1RCxNQUFNLFVBQVUsR0FBRyxjQUFjLENBQUE7QUFFMUIsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7SUFDdkMsT0FBTyxJQUFBLHlCQUFXLEVBQUM7UUFDakIsV0FBVyxFQUFFLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQztRQUN4QyxVQUFVLEVBQUUsQ0FBQyxTQUFpQixFQUFFLEVBQUUsQ0FBQyxJQUFBLDJCQUFnQixFQUFDLFNBQVMsQ0FBQztLQUMvRCxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFMWSxRQUFBLG9CQUFvQix3QkFLaEM7QUFFTSxNQUFNLGdCQUFnQixHQUFHLEdBQUcsRUFBRTtJQUNuQyxPQUFPLElBQUEseUJBQVcsRUFBQztRQUNqQixXQUFXLEVBQUUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDO1FBQ25DLFVBQVUsRUFBRSxDQUFDLFNBQWlCLEVBQUUsRUFBRSxDQUFDLElBQUEsd0JBQWEsRUFBQyxTQUFTLENBQUM7S0FDNUQsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBTFksUUFBQSxnQkFBZ0Isb0JBSzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlTXV0YXRpb24gfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBjaGVja0lzVXNlZEluQXBwLCBkZWxldGVEYXRhc2V0IH0gZnJvbSAnLi9kYXRhc2V0cydcblxuY29uc3QgTkFNRV9TUEFDRSA9ICdkYXRhc2V0LWNhcmQnXG5cbmV4cG9ydCBjb25zdCB1c2VDaGVja0RhdGFzZXRVc2FnZSA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdjaGVjay11c2FnZSddLFxuICAgIG11dGF0aW9uRm46IChkYXRhc2V0SWQ6IHN0cmluZykgPT4gY2hlY2tJc1VzZWRJbkFwcChkYXRhc2V0SWQpLFxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgdXNlRGVsZXRlRGF0YXNldCA9ICgpID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdkZWxldGUnXSxcbiAgICBtdXRhdGlvbkZuOiAoZGF0YXNldElkOiBzdHJpbmcpID0+IGRlbGV0ZURhdGFzZXQoZGF0YXNldElkKSxcbiAgfSlcbn1cbiJdfQ==