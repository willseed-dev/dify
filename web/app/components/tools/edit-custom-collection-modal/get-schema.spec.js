"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const tools_1 = require("@/service/tools");
const toast_1 = require("../../base/toast");
const examples_1 = require("./examples");
const get_schema_1 = require("./get-schema");
vi.mock('@/service/tools', () => ({
    importSchemaFromURL: vi.fn(),
}));
const importSchemaFromURLMock = vi.mocked(tools_1.importSchemaFromURL);
describe('GetSchema', () => {
    const notifySpy = vi.spyOn(toast_1.default, 'notify');
    const mockOnChange = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        notifySpy.mockClear();
        importSchemaFromURLMock.mockReset();
        (0, react_1.render)(<get_schema_1.default onChange={mockOnChange}/>);
    });
    it('shows an error when the URL is not http', () => {
        react_1.fireEvent.click(react_1.screen.getByText('tools.createTool.importFromUrl'));
        const input = react_1.screen.getByPlaceholderText('tools.createTool.importFromUrlPlaceHolder');
        // eslint-disable-next-line sonarjs/no-clear-text-protocols
        react_1.fireEvent.change(input, { target: { value: 'ftp://invalid' } });
        react_1.fireEvent.click(react_1.screen.getByText('common.operation.ok'));
        expect(notifySpy).toHaveBeenCalledWith({
            type: 'error',
            message: 'tools.createTool.urlError',
        });
    });
    it('imports schema from url when valid', async () => {
        react_1.fireEvent.click(react_1.screen.getByText('tools.createTool.importFromUrl'));
        const input = react_1.screen.getByPlaceholderText('tools.createTool.importFromUrlPlaceHolder');
        react_1.fireEvent.change(input, { target: { value: 'https://example.com' } });
        importSchemaFromURLMock.mockResolvedValueOnce({ schema: 'result-schema' });
        react_1.fireEvent.click(react_1.screen.getByText('common.operation.ok'));
        await (0, react_1.waitFor)(() => {
            expect(mockOnChange).toHaveBeenCalledWith('result-schema');
        });
    });
    it('selects example schema when example option clicked', () => {
        react_1.fireEvent.click(react_1.screen.getByText('tools.createTool.examples'));
        react_1.fireEvent.click(react_1.screen.getByText(`tools.createTool.exampleOptions.${examples_1.default[0].key}`));
        expect(mockOnChange).toHaveBeenCalledWith(examples_1.default[0].content);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXNjaGVtYS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0LXNjaGVtYS5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGtEQUEyRTtBQUMzRSwyQ0FBcUQ7QUFDckQsNENBQW9DO0FBQ3BDLHlDQUFpQztBQUNqQyw2Q0FBb0M7QUFFcEMsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDN0IsQ0FBQyxDQUFDLENBQUE7QUFDSCxNQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsMkJBQW1CLENBQUMsQ0FBQTtBQUU5RCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLGVBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUMzQyxNQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7SUFFNUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQixTQUFTLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDckIsdUJBQXVCLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDbkMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxvQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtJQUMvQyxDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDakQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUE7UUFDbkUsTUFBTSxLQUFLLEdBQUcsY0FBTSxDQUFDLG9CQUFvQixDQUFDLDJDQUEyQyxDQUFDLENBQUE7UUFDdEYsMkRBQTJEO1FBQzNELGlCQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDL0QsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7UUFFeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO1lBQ3JDLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLDJCQUEyQjtTQUNyQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQTtRQUNuRSxNQUFNLEtBQUssR0FBRyxjQUFNLENBQUMsb0JBQW9CLENBQUMsMkNBQTJDLENBQUMsQ0FBQTtRQUN0RixpQkFBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDckUsdUJBQXVCLENBQUMscUJBQXFCLENBQUMsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQTtRQUUxRSxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQTtRQUV4RCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtZQUNqQixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7UUFDNUQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUE7UUFDOUQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsa0JBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFFdkYsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLG9CQUFvQixDQUFDLGtCQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDaEUsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgaW1wb3J0U2NoZW1hRnJvbVVSTCB9IGZyb20gJ0Avc2VydmljZS90b29scydcbmltcG9ydCBUb2FzdCBmcm9tICcuLi8uLi9iYXNlL3RvYXN0J1xuaW1wb3J0IGV4YW1wbGVzIGZyb20gJy4vZXhhbXBsZXMnXG5pbXBvcnQgR2V0U2NoZW1hIGZyb20gJy4vZ2V0LXNjaGVtYSdcblxudmkubW9jaygnQC9zZXJ2aWNlL3Rvb2xzJywgKCkgPT4gKHtcbiAgaW1wb3J0U2NoZW1hRnJvbVVSTDogdmkuZm4oKSxcbn0pKVxuY29uc3QgaW1wb3J0U2NoZW1hRnJvbVVSTE1vY2sgPSB2aS5tb2NrZWQoaW1wb3J0U2NoZW1hRnJvbVVSTClcblxuZGVzY3JpYmUoJ0dldFNjaGVtYScsICgpID0+IHtcbiAgY29uc3Qgbm90aWZ5U3B5ID0gdmkuc3B5T24oVG9hc3QsICdub3RpZnknKVxuICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbm90aWZ5U3B5Lm1vY2tDbGVhcigpXG4gICAgaW1wb3J0U2NoZW1hRnJvbVVSTE1vY2subW9ja1Jlc2V0KClcbiAgICByZW5kZXIoPEdldFNjaGVtYSBvbkNoYW5nZT17bW9ja09uQ2hhbmdlfSAvPilcbiAgfSlcblxuICBpdCgnc2hvd3MgYW4gZXJyb3Igd2hlbiB0aGUgVVJMIGlzIG5vdCBodHRwJywgKCkgPT4ge1xuICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCd0b29scy5jcmVhdGVUb29sLmltcG9ydEZyb21VcmwnKSlcbiAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgndG9vbHMuY3JlYXRlVG9vbC5pbXBvcnRGcm9tVXJsUGxhY2VIb2xkZXInKVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBzb25hcmpzL25vLWNsZWFyLXRleHQtcHJvdG9jb2xzXG4gICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdmdHA6Ly9pbnZhbGlkJyB9IH0pXG4gICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ub2snKSlcblxuICAgIGV4cGVjdChub3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICBtZXNzYWdlOiAndG9vbHMuY3JlYXRlVG9vbC51cmxFcnJvcicsXG4gICAgfSlcbiAgfSlcblxuICBpdCgnaW1wb3J0cyBzY2hlbWEgZnJvbSB1cmwgd2hlbiB2YWxpZCcsIGFzeW5jICgpID0+IHtcbiAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgndG9vbHMuY3JlYXRlVG9vbC5pbXBvcnRGcm9tVXJsJykpXG4gICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ3Rvb2xzLmNyZWF0ZVRvb2wuaW1wb3J0RnJvbVVybFBsYWNlSG9sZGVyJylcbiAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2h0dHBzOi8vZXhhbXBsZS5jb20nIH0gfSlcbiAgICBpbXBvcnRTY2hlbWFGcm9tVVJMTW9jay5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBzY2hlbWE6ICdyZXN1bHQtc2NoZW1hJyB9KVxuXG4gICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ub2snKSlcblxuICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Jlc3VsdC1zY2hlbWEnKVxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ3NlbGVjdHMgZXhhbXBsZSBzY2hlbWEgd2hlbiBleGFtcGxlIG9wdGlvbiBjbGlja2VkJywgKCkgPT4ge1xuICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCd0b29scy5jcmVhdGVUb29sLmV4YW1wbGVzJykpXG4gICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoYHRvb2xzLmNyZWF0ZVRvb2wuZXhhbXBsZU9wdGlvbnMuJHtleGFtcGxlc1swXS5rZXl9YCkpXG5cbiAgICBleHBlY3QobW9ja09uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleGFtcGxlc1swXS5jb250ZW50KVxuICB9KVxufSlcbiJdfQ==