"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDisableEndpoint = exports.useEnableEndpoint = exports.useDeleteEndpoint = exports.useUpdateEndpoint = exports.useCreateEndpoint = exports.useInvalidateEndpointList = exports.useEndpointList = void 0;
const react_query_1 = require("@tanstack/react-query");
const base_1 = require("./base");
const NAME_SPACE = 'endpoints';
const useEndpointList = (pluginID) => {
    return (0, react_query_1.useQuery)({
        queryKey: [NAME_SPACE, 'list', pluginID],
        queryFn: () => (0, base_1.get)('/workspaces/current/endpoints/list/plugin', {
            params: {
                plugin_id: pluginID,
                page: 1,
                page_size: 100,
            },
        }),
    });
};
exports.useEndpointList = useEndpointList;
const useInvalidateEndpointList = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (pluginID) => {
        queryClient.invalidateQueries({
            queryKey: [NAME_SPACE, 'list', pluginID],
        });
    };
};
exports.useInvalidateEndpointList = useInvalidateEndpointList;
const useCreateEndpoint = ({ onSuccess, onError, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'create'],
        mutationFn: (payload) => {
            const { pluginUniqueID, state } = payload;
            const newName = state.name;
            delete state.name;
            return (0, base_1.post)('/workspaces/current/endpoints/create', {
                body: {
                    plugin_unique_identifier: pluginUniqueID,
                    settings: state,
                    name: newName,
                },
            });
        },
        onSuccess,
        onError,
    });
};
exports.useCreateEndpoint = useCreateEndpoint;
const useUpdateEndpoint = ({ onSuccess, onError, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'update'],
        mutationFn: (payload) => {
            const { endpointID, state } = payload;
            const newName = state.name;
            delete state.name;
            return (0, base_1.post)('/workspaces/current/endpoints/update', {
                body: {
                    endpoint_id: endpointID,
                    settings: state,
                    name: newName,
                },
            });
        },
        onSuccess,
        onError,
    });
};
exports.useUpdateEndpoint = useUpdateEndpoint;
const useDeleteEndpoint = ({ onSuccess, onError, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'delete'],
        mutationFn: (endpointID) => {
            return (0, base_1.post)('/workspaces/current/endpoints/delete', {
                body: {
                    endpoint_id: endpointID,
                },
            });
        },
        onSuccess,
        onError,
    });
};
exports.useDeleteEndpoint = useDeleteEndpoint;
const useEnableEndpoint = ({ onSuccess, onError, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'enable'],
        mutationFn: (endpointID) => {
            return (0, base_1.post)('/workspaces/current/endpoints/enable', {
                body: {
                    endpoint_id: endpointID,
                },
            });
        },
        onSuccess,
        onError,
    });
};
exports.useEnableEndpoint = useEnableEndpoint;
const useDisableEndpoint = ({ onSuccess, onError, }) => {
    return (0, react_query_1.useMutation)({
        mutationKey: [NAME_SPACE, 'disable'],
        mutationFn: (endpointID) => {
            return (0, base_1.post)('/workspaces/current/endpoints/disable', {
                body: {
                    endpoint_id: endpointID,
                },
            });
        },
        onSuccess,
        onError,
    });
};
exports.useDisableEndpoint = useDisableEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWVuZHBvaW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1lbmRwb2ludHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsdURBSThCO0FBQzlCLGlDQUFrQztBQUVsQyxNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUE7QUFFdkIsTUFBTSxlQUFlLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDbEQsT0FBTyxJQUFBLHNCQUFRLEVBQUM7UUFDZCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQztRQUN4QyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBQSxVQUFHLEVBQW9CLDJDQUEyQyxFQUFFO1lBQ2pGLE1BQU0sRUFBRTtnQkFDTixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsU0FBUyxFQUFFLEdBQUc7YUFDZjtTQUNGLENBQUM7S0FDSCxDQUFDLENBQUE7QUFDSixDQUFDLENBQUE7QUFYWSxRQUFBLGVBQWUsbUJBVzNCO0FBRU0sTUFBTSx5QkFBeUIsR0FBRyxHQUFHLEVBQUU7SUFDNUMsTUFBTSxXQUFXLEdBQUcsSUFBQSw0QkFBYyxHQUFFLENBQUE7SUFDcEMsT0FBTyxDQUFDLFFBQWdCLEVBQUUsRUFBRTtRQUMxQixXQUFXLENBQUMsaUJBQWlCLENBQzNCO1lBQ0UsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7U0FDekMsQ0FDRixDQUFBO0lBQ0gsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBVFksUUFBQSx5QkFBeUIsNkJBU3JDO0FBRU0sTUFBTSxpQkFBaUIsR0FBRyxDQUFDLEVBQ2hDLFNBQVMsRUFDVCxPQUFPLEdBSVIsRUFBRSxFQUFFO0lBQ0gsT0FBTyxJQUFBLHlCQUFXLEVBQUM7UUFDakIsV0FBVyxFQUFFLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQztRQUNuQyxVQUFVLEVBQUUsQ0FBQyxP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LEVBQUU7b0JBQ0osV0FBVyxFQUFFLFVBQVU7aUJBQ3hCO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUNELFNBQVM7UUFDVCxPQUFPO0tBQ1IsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBbkJZLFFBQUEsa0JBQWtCLHNCQW1COUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIEVuZHBvaW50c1Jlc3BvbnNlLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvdHlwZXMnXG5pbXBvcnQge1xuICB1c2VNdXRhdGlvbixcbiAgdXNlUXVlcnksXG4gIHVzZVF1ZXJ5Q2xpZW50LFxufSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBnZXQsIHBvc3QgfSBmcm9tICcuL2Jhc2UnXG5cbmNvbnN0IE5BTUVfU1BBQ0UgPSAnZW5kcG9pbnRzJ1xuXG5leHBvcnQgY29uc3QgdXNlRW5kcG9pbnRMaXN0ID0gKHBsdWdpbklEOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHVzZVF1ZXJ5KHtcbiAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdsaXN0JywgcGx1Z2luSURdLFxuICAgIHF1ZXJ5Rm46ICgpID0+IGdldDxFbmRwb2ludHNSZXNwb25zZT4oJy93b3Jrc3BhY2VzL2N1cnJlbnQvZW5kcG9pbnRzL2xpc3QvcGx1Z2luJywge1xuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIHBsdWdpbl9pZDogcGx1Z2luSUQsXG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIHBhZ2Vfc2l6ZTogMTAwLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUludmFsaWRhdGVFbmRwb2ludExpc3QgPSAoKSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gdXNlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gKHBsdWdpbklEOiBzdHJpbmcpID0+IHtcbiAgICBxdWVyeUNsaWVudC5pbnZhbGlkYXRlUXVlcmllcyhcbiAgICAgIHtcbiAgICAgICAgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnbGlzdCcsIHBsdWdpbklEXSxcbiAgICAgIH0sXG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB1c2VDcmVhdGVFbmRwb2ludCA9ICh7XG4gIG9uU3VjY2VzcyxcbiAgb25FcnJvcixcbn06IHtcbiAgb25TdWNjZXNzPzogKCkgPT4gdm9pZFxuICBvbkVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWRcbn0pID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdjcmVhdGUnXSxcbiAgICBtdXRhdGlvbkZuOiAocGF5bG9hZDogeyBwbHVnaW5VbmlxdWVJRDogc3RyaW5nLCBzdGF0ZTogUmVjb3JkPHN0cmluZywgYW55PiB9KSA9PiB7XG4gICAgICBjb25zdCB7IHBsdWdpblVuaXF1ZUlELCBzdGF0ZSB9ID0gcGF5bG9hZFxuICAgICAgY29uc3QgbmV3TmFtZSA9IHN0YXRlLm5hbWVcbiAgICAgIGRlbGV0ZSBzdGF0ZS5uYW1lXG4gICAgICByZXR1cm4gcG9zdCgnL3dvcmtzcGFjZXMvY3VycmVudC9lbmRwb2ludHMvY3JlYXRlJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiBwbHVnaW5VbmlxdWVJRCxcbiAgICAgICAgICBzZXR0aW5nczogc3RhdGUsXG4gICAgICAgICAgbmFtZTogbmV3TmFtZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBvblN1Y2Nlc3MsXG4gICAgb25FcnJvcixcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IHVzZVVwZGF0ZUVuZHBvaW50ID0gKHtcbiAgb25TdWNjZXNzLFxuICBvbkVycm9yLFxufToge1xuICBvblN1Y2Nlc3M/OiAoKSA9PiB2b2lkXG4gIG9uRXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gdm9pZFxufSkgPT4ge1xuICByZXR1cm4gdXNlTXV0YXRpb24oe1xuICAgIG11dGF0aW9uS2V5OiBbTkFNRV9TUEFDRSwgJ3VwZGF0ZSddLFxuICAgIG11dGF0aW9uRm46IChwYXlsb2FkOiB7IGVuZHBvaW50SUQ6IHN0cmluZywgc3RhdGU6IFJlY29yZDxzdHJpbmcsIGFueT4gfSkgPT4ge1xuICAgICAgY29uc3QgeyBlbmRwb2ludElELCBzdGF0ZSB9ID0gcGF5bG9hZFxuICAgICAgY29uc3QgbmV3TmFtZSA9IHN0YXRlLm5hbWVcbiAgICAgIGRlbGV0ZSBzdGF0ZS5uYW1lXG4gICAgICByZXR1cm4gcG9zdCgnL3dvcmtzcGFjZXMvY3VycmVudC9lbmRwb2ludHMvdXBkYXRlJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgZW5kcG9pbnRfaWQ6IGVuZHBvaW50SUQsXG4gICAgICAgICAgc2V0dGluZ3M6IHN0YXRlLFxuICAgICAgICAgIG5hbWU6IG5ld05hbWUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgb25TdWNjZXNzLFxuICAgIG9uRXJyb3IsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VEZWxldGVFbmRwb2ludCA9ICh7XG4gIG9uU3VjY2VzcyxcbiAgb25FcnJvcixcbn06IHtcbiAgb25TdWNjZXNzPzogKCkgPT4gdm9pZFxuICBvbkVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWRcbn0pID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdkZWxldGUnXSxcbiAgICBtdXRhdGlvbkZuOiAoZW5kcG9pbnRJRDogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gcG9zdCgnL3dvcmtzcGFjZXMvY3VycmVudC9lbmRwb2ludHMvZGVsZXRlJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgZW5kcG9pbnRfaWQ6IGVuZHBvaW50SUQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgb25TdWNjZXNzLFxuICAgIG9uRXJyb3IsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VFbmFibGVFbmRwb2ludCA9ICh7XG4gIG9uU3VjY2VzcyxcbiAgb25FcnJvcixcbn06IHtcbiAgb25TdWNjZXNzPzogKCkgPT4gdm9pZFxuICBvbkVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWRcbn0pID0+IHtcbiAgcmV0dXJuIHVzZU11dGF0aW9uKHtcbiAgICBtdXRhdGlvbktleTogW05BTUVfU1BBQ0UsICdlbmFibGUnXSxcbiAgICBtdXRhdGlvbkZuOiAoZW5kcG9pbnRJRDogc3RyaW5nKSA9PiB7XG4gICAgICByZXR1cm4gcG9zdCgnL3dvcmtzcGFjZXMvY3VycmVudC9lbmRwb2ludHMvZW5hYmxlJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgZW5kcG9pbnRfaWQ6IGVuZHBvaW50SUQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgb25TdWNjZXNzLFxuICAgIG9uRXJyb3IsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCB1c2VEaXNhYmxlRW5kcG9pbnQgPSAoe1xuICBvblN1Y2Nlc3MsXG4gIG9uRXJyb3IsXG59OiB7XG4gIG9uU3VjY2Vzcz86ICgpID0+IHZvaWRcbiAgb25FcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkXG59KSA9PiB7XG4gIHJldHVybiB1c2VNdXRhdGlvbih7XG4gICAgbXV0YXRpb25LZXk6IFtOQU1FX1NQQUNFLCAnZGlzYWJsZSddLFxuICAgIG11dGF0aW9uRm46IChlbmRwb2ludElEOiBzdHJpbmcpID0+IHtcbiAgICAgIHJldHVybiBwb3N0KCcvd29ya3NwYWNlcy9jdXJyZW50L2VuZHBvaW50cy9kaXNhYmxlJywge1xuICAgICAgICBib2R5OiB7XG4gICAgICAgICAgZW5kcG9pbnRfaWQ6IGVuZHBvaW50SUQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0sXG4gICAgb25TdWNjZXNzLFxuICAgIG9uRXJyb3IsXG4gIH0pXG59XG4iXX0=