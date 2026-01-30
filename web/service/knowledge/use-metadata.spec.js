"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const types_1 = require("@/app/components/datasets/metadata/types");
const use_metadata_1 = require("@/service/knowledge/use-metadata");
const use_document_1 = require("./use-document");
// Mock the post function to avoid real network requests
vi.mock('@/service/base', () => ({
    post: vi.fn().mockResolvedValue({ success: true }),
}));
const NAME_SPACE = 'dataset-metadata';
describe('useBatchUpdateDocMetadata', () => {
    let queryClient;
    beforeEach(() => {
        // Create a fresh QueryClient before each test
        queryClient = new react_query_1.QueryClient();
    });
    // Wrapper for React Query context
    const wrapper = ({ children }) => (<react_query_1.QueryClientProvider client={queryClient}>{children}</react_query_1.QueryClientProvider>);
    it('should correctly invalidate dataset and document caches', async () => {
        const { result } = (0, react_1.renderHook)(() => (0, use_metadata_1.useBatchUpdateDocMetadata)(), { wrapper });
        // Spy on queryClient.invalidateQueries
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
        // Correct payload type: each document has its own metadata_list array
        const payload = {
            dataset_id: 'dataset-1',
            metadata_list: [
                {
                    document_id: 'doc-1',
                    metadata_list: [
                        { key: 'title-1', id: '01', name: 'name-1', type: types_1.DataType.string, value: 'new title 01' },
                    ],
                },
                {
                    document_id: 'doc-2',
                    metadata_list: [
                        { key: 'title-2', id: '02', name: 'name-1', type: types_1.DataType.string, value: 'new title 02' },
                    ],
                },
            ],
        };
        // Execute the mutation
        await (0, react_1.act)(async () => {
            await result.current.mutateAsync(payload);
        });
        // Expect invalidateQueries to have been called exactly 5 times
        expect(invalidateSpy).toHaveBeenCalledTimes(5);
        // Dataset cache invalidation
        expect(invalidateSpy).toHaveBeenNthCalledWith(1, {
            queryKey: [NAME_SPACE, 'dataset', 'dataset-1'],
        });
        // Document list cache invalidation
        expect(invalidateSpy).toHaveBeenNthCalledWith(2, {
            queryKey: [NAME_SPACE, 'document', 'dataset-1'],
        });
        // useDocumentListKey cache invalidation
        expect(invalidateSpy).toHaveBeenNthCalledWith(3, {
            queryKey: [...use_document_1.useDocumentListKey, 'dataset-1'],
        });
        // Single document cache invalidation
        expect(invalidateSpy.mock.calls.slice(3)).toEqual(expect.arrayContaining([
            [{ queryKey: [NAME_SPACE, 'document', 'dataset-1', 'doc-1'] }],
            [{ queryKey: [NAME_SPACE, 'document', 'dataset-1', 'doc-2'] }],
        ]));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLW1ldGFkYXRhLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtbWV0YWRhdGEuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBd0U7QUFDeEUsa0RBQXdEO0FBQ3hELG9FQUFtRTtBQUNuRSxtRUFBNEU7QUFDNUUsaURBQW1EO0FBRW5ELHdEQUF3RDtBQUN4RCxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQztDQUNuRCxDQUFDLENBQUMsQ0FBQTtBQUVILE1BQU0sVUFBVSxHQUFHLGtCQUFrQixDQUFBO0FBRXJDLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7SUFDekMsSUFBSSxXQUF3QixDQUFBO0lBRTVCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCw4Q0FBOEM7UUFDOUMsV0FBVyxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFBO0lBQ2pDLENBQUMsQ0FBQyxDQUFBO0lBRUYsa0NBQWtDO0lBQ2xDLE1BQU0sT0FBTyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQWlDLEVBQUUsRUFBRSxDQUFDLENBQy9ELENBQUMsaUNBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxpQ0FBbUIsQ0FBQyxDQUMzRSxDQUFBO0lBRUQsRUFBRSxDQUFDLHlEQUF5RCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSx3Q0FBeUIsR0FBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUU3RSx1Q0FBdUM7UUFDdkMsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtRQUVoRSxzRUFBc0U7UUFFdEUsTUFBTSxPQUFPLEdBQUc7WUFDZCxVQUFVLEVBQUUsV0FBVztZQUN2QixhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0UsV0FBVyxFQUFFLE9BQU87b0JBQ3BCLGFBQWEsRUFBRTt3QkFDYixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxnQkFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO3FCQUMzRjtpQkFDRjtnQkFDRDtvQkFDRSxXQUFXLEVBQUUsT0FBTztvQkFDcEIsYUFBYSxFQUFFO3dCQUNiLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLGdCQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUU7cUJBQzNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFBO1FBRUQsdUJBQXVCO1FBQ3ZCLE1BQU0sSUFBQSxXQUFHLEVBQUMsS0FBSyxJQUFJLEVBQUU7WUFDbkIsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMzQyxDQUFDLENBQUMsQ0FBQTtRQUVGLCtEQUErRDtRQUMvRCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFOUMsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUU7WUFDL0MsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUM7U0FDL0MsQ0FBQyxDQUFBO1FBRUYsbUNBQW1DO1FBQ25DLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUU7WUFDL0MsUUFBUSxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUM7U0FDaEQsQ0FBQyxDQUFBO1FBRUYsd0NBQXdDO1FBQ3hDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQUU7WUFDL0MsUUFBUSxFQUFFLENBQUMsR0FBRyxpQ0FBa0IsRUFBRSxXQUFXLENBQUM7U0FDL0MsQ0FBQyxDQUFBO1FBRUYscUNBQXFDO1FBQ3JDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQy9DLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDckIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDOUQsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDL0QsQ0FBQyxDQUNILENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBhY3QsIHJlbmRlckhvb2sgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgRGF0YVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL21ldGFkYXRhL3R5cGVzJ1xuaW1wb3J0IHsgdXNlQmF0Y2hVcGRhdGVEb2NNZXRhZGF0YSB9IGZyb20gJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLW1ldGFkYXRhJ1xuaW1wb3J0IHsgdXNlRG9jdW1lbnRMaXN0S2V5IH0gZnJvbSAnLi91c2UtZG9jdW1lbnQnXG5cbi8vIE1vY2sgdGhlIHBvc3QgZnVuY3Rpb24gdG8gYXZvaWQgcmVhbCBuZXR3b3JrIHJlcXVlc3RzXG52aS5tb2NrKCdAL3NlcnZpY2UvYmFzZScsICgpID0+ICh7XG4gIHBvc3Q6IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUoeyBzdWNjZXNzOiB0cnVlIH0pLFxufSkpXG5cbmNvbnN0IE5BTUVfU1BBQ0UgPSAnZGF0YXNldC1tZXRhZGF0YSdcblxuZGVzY3JpYmUoJ3VzZUJhdGNoVXBkYXRlRG9jTWV0YWRhdGEnLCAoKSA9PiB7XG4gIGxldCBxdWVyeUNsaWVudDogUXVlcnlDbGllbnRcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAvLyBDcmVhdGUgYSBmcmVzaCBRdWVyeUNsaWVudCBiZWZvcmUgZWFjaCB0ZXN0XG4gICAgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoKVxuICB9KVxuXG4gIC8vIFdyYXBwZXIgZm9yIFJlYWN0IFF1ZXJ5IGNvbnRleHRcbiAgY29uc3Qgd3JhcHBlciA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiAoXG4gICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+e2NoaWxkcmVufTwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgKVxuXG4gIGl0KCdzaG91bGQgY29ycmVjdGx5IGludmFsaWRhdGUgZGF0YXNldCBhbmQgZG9jdW1lbnQgY2FjaGVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUJhdGNoVXBkYXRlRG9jTWV0YWRhdGEoKSwgeyB3cmFwcGVyIH0pXG5cbiAgICAvLyBTcHkgb24gcXVlcnlDbGllbnQuaW52YWxpZGF0ZVF1ZXJpZXNcbiAgICBjb25zdCBpbnZhbGlkYXRlU3B5ID0gdmkuc3B5T24ocXVlcnlDbGllbnQsICdpbnZhbGlkYXRlUXVlcmllcycpXG5cbiAgICAvLyBDb3JyZWN0IHBheWxvYWQgdHlwZTogZWFjaCBkb2N1bWVudCBoYXMgaXRzIG93biBtZXRhZGF0YV9saXN0IGFycmF5XG5cbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgZGF0YXNldF9pZDogJ2RhdGFzZXQtMScsXG4gICAgICBtZXRhZGF0YV9saXN0OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBkb2N1bWVudF9pZDogJ2RvYy0xJyxcbiAgICAgICAgICBtZXRhZGF0YV9saXN0OiBbXG4gICAgICAgICAgICB7IGtleTogJ3RpdGxlLTEnLCBpZDogJzAxJywgbmFtZTogJ25hbWUtMScsIHR5cGU6IERhdGFUeXBlLnN0cmluZywgdmFsdWU6ICduZXcgdGl0bGUgMDEnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGRvY3VtZW50X2lkOiAnZG9jLTInLFxuICAgICAgICAgIG1ldGFkYXRhX2xpc3Q6IFtcbiAgICAgICAgICAgIHsga2V5OiAndGl0bGUtMicsIGlkOiAnMDInLCBuYW1lOiAnbmFtZS0xJywgdHlwZTogRGF0YVR5cGUuc3RyaW5nLCB2YWx1ZTogJ25ldyB0aXRsZSAwMicgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9XG5cbiAgICAvLyBFeGVjdXRlIHRoZSBtdXRhdGlvblxuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCByZXN1bHQuY3VycmVudC5tdXRhdGVBc3luYyhwYXlsb2FkKVxuICAgIH0pXG5cbiAgICAvLyBFeHBlY3QgaW52YWxpZGF0ZVF1ZXJpZXMgdG8gaGF2ZSBiZWVuIGNhbGxlZCBleGFjdGx5IDUgdGltZXNcbiAgICBleHBlY3QoaW52YWxpZGF0ZVNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDUpXG5cbiAgICAvLyBEYXRhc2V0IGNhY2hlIGludmFsaWRhdGlvblxuICAgIGV4cGVjdChpbnZhbGlkYXRlU3B5KS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgxLCB7XG4gICAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdkYXRhc2V0JywgJ2RhdGFzZXQtMSddLFxuICAgIH0pXG5cbiAgICAvLyBEb2N1bWVudCBsaXN0IGNhY2hlIGludmFsaWRhdGlvblxuICAgIGV4cGVjdChpbnZhbGlkYXRlU3B5KS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgyLCB7XG4gICAgICBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdkb2N1bWVudCcsICdkYXRhc2V0LTEnXSxcbiAgICB9KVxuXG4gICAgLy8gdXNlRG9jdW1lbnRMaXN0S2V5IGNhY2hlIGludmFsaWRhdGlvblxuICAgIGV4cGVjdChpbnZhbGlkYXRlU3B5KS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgzLCB7XG4gICAgICBxdWVyeUtleTogWy4uLnVzZURvY3VtZW50TGlzdEtleSwgJ2RhdGFzZXQtMSddLFxuICAgIH0pXG5cbiAgICAvLyBTaW5nbGUgZG9jdW1lbnQgY2FjaGUgaW52YWxpZGF0aW9uXG4gICAgZXhwZWN0KGludmFsaWRhdGVTcHkubW9jay5jYWxscy5zbGljZSgzKSkudG9FcXVhbChcbiAgICAgIGV4cGVjdC5hcnJheUNvbnRhaW5pbmcoW1xuICAgICAgICBbeyBxdWVyeUtleTogW05BTUVfU1BBQ0UsICdkb2N1bWVudCcsICdkYXRhc2V0LTEnLCAnZG9jLTEnXSB9XSxcbiAgICAgICAgW3sgcXVlcnlLZXk6IFtOQU1FX1NQQUNFLCAnZG9jdW1lbnQnLCAnZGF0YXNldC0xJywgJ2RvYy0yJ10gfV0sXG4gICAgICBdKSxcbiAgICApXG4gIH0pXG59KVxuIl19