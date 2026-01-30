"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const provider_context_1 = require("@/__mocks__/provider-context");
const provider_context_2 = require("@/context/provider-context");
const type_1 = require("../type");
const index_1 = require("./index");
vi.mock('@/context/provider-context', () => ({
    useProviderContext: vi.fn(),
}));
const useProviderContextMock = provider_context_2.useProviderContext;
const setupPlan = (planType) => {
    useProviderContextMock.mockReturnValue((0, provider_context_1.createMockPlan)(planType));
};
describe('PriorityLabel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering: basic label output for sandbox plan.
    describe('Rendering', () => {
        it('should render the standard priority label when plan is sandbox', () => {
            // Arrange
            setupPlan(type_1.Plan.sandbox);
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('billing.plansCommon.priority.standard')).toBeInTheDocument();
        });
    });
    // Props: custom class name applied to the label container.
    describe('Props', () => {
        it('should apply custom className to the label container', () => {
            // Arrange
            setupPlan(type_1.Plan.sandbox);
            // Act
            (0, react_1.render)(<index_1.default className="custom-class"/>);
            // Assert
            const label = react_1.screen.getByText('billing.plansCommon.priority.standard').closest('div');
            expect(label).toHaveClass('custom-class');
        });
    });
    // Plan types: label text and icon visibility for different plans.
    describe('Plan Types', () => {
        it('should render priority label and icon when plan is professional', () => {
            // Arrange
            setupPlan(type_1.Plan.professional);
            // Act
            const { container } = (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('billing.plansCommon.priority.priority')).toBeInTheDocument();
            expect(container.querySelector('svg')).toBeInTheDocument();
        });
        it('should render top priority label and icon when plan is team', () => {
            // Arrange
            setupPlan(type_1.Plan.team);
            // Act
            const { container } = (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('billing.plansCommon.priority.top-priority')).toBeInTheDocument();
            expect(container.querySelector('svg')).toBeInTheDocument();
        });
        it('should render standard label without icon when plan is sandbox', () => {
            // Arrange
            setupPlan(type_1.Plan.sandbox);
            // Act
            const { container } = (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('billing.plansCommon.priority.standard')).toBeInTheDocument();
            expect(container.querySelector('svg')).not.toBeInTheDocument();
        });
    });
    // Edge cases: tooltip content varies by priority level.
    describe('Edge Cases', () => {
        it('should show the tip text when priority is not top priority', async () => {
            // Arrange
            setupPlan(type_1.Plan.sandbox);
            // Act
            (0, react_1.render)(<index_1.default />);
            const label = react_1.screen.getByText('billing.plansCommon.priority.standard').closest('div');
            react_1.fireEvent.mouseEnter(label);
            // Assert
            expect(await react_1.screen.findByText('billing.plansCommon.documentProcessingPriority: billing.plansCommon.priority.standard')).toBeInTheDocument();
            expect(react_1.screen.getByText('billing.plansCommon.documentProcessingPriorityTip')).toBeInTheDocument();
        });
        it('should hide the tip text when priority is top priority', async () => {
            // Arrange
            setupPlan(type_1.Plan.enterprise);
            // Act
            (0, react_1.render)(<index_1.default />);
            const label = react_1.screen.getByText('billing.plansCommon.priority.top-priority').closest('div');
            react_1.fireEvent.mouseEnter(label);
            // Assert
            expect(await react_1.screen.findByText('billing.plansCommon.documentProcessingPriority: billing.plansCommon.priority.top-priority')).toBeInTheDocument();
            expect(react_1.screen.queryByText('billing.plansCommon.documentProcessingPriorityTip')).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLG1FQUE2RDtBQUM3RCxpRUFBK0Q7QUFDL0Qsa0NBQThCO0FBQzlCLG1DQUFtQztBQUVuQyxFQUFFLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDM0Msa0JBQWtCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUM1QixDQUFDLENBQUMsQ0FBQTtBQUVILE1BQU0sc0JBQXNCLEdBQUcscUNBQTBCLENBQUE7QUFFekQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxRQUFjLEVBQUUsRUFBRTtJQUNuQyxzQkFBc0IsQ0FBQyxlQUFlLENBQUMsSUFBQSxpQ0FBYyxFQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7QUFDbEUsQ0FBQyxDQUFBO0FBRUQsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7SUFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLGtEQUFrRDtJQUNsRCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1lBQ3hFLFVBQVU7WUFDVixTQUFTLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBRXZCLE1BQU07WUFDTixJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQWEsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO1lBRXpCLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN2RixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsMkRBQTJEO0lBQzNE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Q0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDdEYsaUJBQVMsQ0FBQyxVQUFVLENBQUMsS0FBb0IsQ0FBQyxDQUFBO1lBRTFDLFNBQVM7WUFDVCxNQUFNLENBQUMsTUFBTSxjQUFNLENBQUMsVUFBVSxDQUM1Qix1RkFBdUYsQ0FDeEYsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDdEIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsbURBQW1ELENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbkcsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0RBQXdELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDdEUsVUFBVTtZQUNWLFNBQVMsQ0FBQyxXQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7WUFFMUIsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBYSxDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFDekIsTUFBTSxLQUFLLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMxRixpQkFBUyxDQUFDLFVBQVUsQ0FBQyxLQUFvQixDQUFDLENBQUE7WUFFMUMsU0FBUztZQUNULE1BQU0sQ0FBQyxNQUFNLGNBQU0sQ0FBQyxVQUFVLENBQzVCLDJGQUEyRixDQUM1RixDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN0QixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDekcsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNb2NrIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBjcmVhdGVNb2NrUGxhbiB9IGZyb20gJ0AvX19tb2Nrc19fL3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgeyB1c2VQcm92aWRlckNvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB7IFBsYW4gfSBmcm9tICcuLi90eXBlJ1xuaW1wb3J0IFByaW9yaXR5TGFiZWwgZnJvbSAnLi9pbmRleCdcblxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6IHZpLmZuKCksXG59KSlcblxuY29uc3QgdXNlUHJvdmlkZXJDb250ZXh0TW9jayA9IHVzZVByb3ZpZGVyQ29udGV4dCBhcyBNb2NrXG5cbmNvbnN0IHNldHVwUGxhbiA9IChwbGFuVHlwZTogUGxhbikgPT4ge1xuICB1c2VQcm92aWRlckNvbnRleHRNb2NrLm1vY2tSZXR1cm5WYWx1ZShjcmVhdGVNb2NrUGxhbihwbGFuVHlwZSkpXG59XG5cbmRlc2NyaWJlKCdQcmlvcml0eUxhYmVsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBSZW5kZXJpbmc6IGJhc2ljIGxhYmVsIG91dHB1dCBmb3Igc2FuZGJveCBwbGFuLlxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBzdGFuZGFyZCBwcmlvcml0eSBsYWJlbCB3aGVuIHBsYW4gaXMgc2FuZGJveCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwUGxhbihQbGFuLnNhbmRib3gpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcmlvcml0eUxhYmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdiaWxsaW5nLnBsYW5zQ29tbW9uLnByaW9yaXR5LnN0YW5kYXJkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFByb3BzOiBjdXN0b20gY2xhc3MgbmFtZSBhcHBsaWVkIHRvIHRoZSBsYWJlbCBjb250YWluZXIuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUgdG8gdGhlIGxhYmVsIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwUGxhbihQbGFuLnNhbmRib3gpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcmlvcml0eUxhYmVsIGNsYXNzTmFtZT1cImN1c3RvbS1jbGFzc1wiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxhYmVsID0gc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi5wcmlvcml0eS5zdGFuZGFyZCcpLmNsb3Nlc3QoJ2RpdicpXG4gICAgICBleHBlY3QobGFiZWwpLnRvSGF2ZUNsYXNzKCdjdXN0b20tY2xhc3MnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUGxhbiB0eXBlczogbGFiZWwgdGV4dCBhbmQgaWNvbiB2aXNpYmlsaXR5IGZvciBkaWZmZXJlbnQgcGxhbnMuXG4gIGRlc2NyaWJlKCdQbGFuIFR5cGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHByaW9yaXR5IGxhYmVsIGFuZCBpY29uIHdoZW4gcGxhbiBpcyBwcm9mZXNzaW9uYWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cFBsYW4oUGxhbi5wcm9mZXNzaW9uYWwpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UHJpb3JpdHlMYWJlbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi5wcmlvcml0eS5wcmlvcml0eScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRvcCBwcmlvcml0eSBsYWJlbCBhbmQgaWNvbiB3aGVuIHBsYW4gaXMgdGVhbScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwUGxhbihQbGFuLnRlYW0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UHJpb3JpdHlMYWJlbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi5wcmlvcml0eS50b3AtcHJpb3JpdHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdGFuZGFyZCBsYWJlbCB3aXRob3V0IGljb24gd2hlbiBwbGFuIGlzIHNhbmRib3gnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cFBsYW4oUGxhbi5zYW5kYm94KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByaW9yaXR5TGFiZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcucGxhbnNDb21tb24ucHJpb3JpdHkuc3RhbmRhcmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgY2FzZXM6IHRvb2x0aXAgY29udGVudCB2YXJpZXMgYnkgcHJpb3JpdHkgbGV2ZWwuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyB0aGUgdGlwIHRleHQgd2hlbiBwcmlvcml0eSBpcyBub3QgdG9wIHByaW9yaXR5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBQbGFuKFBsYW4uc2FuZGJveClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByaW9yaXR5TGFiZWwgLz4pXG4gICAgICBjb25zdCBsYWJlbCA9IHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcucGxhbnNDb21tb24ucHJpb3JpdHkuc3RhbmRhcmQnKS5jbG9zZXN0KCdkaXYnKVxuICAgICAgZmlyZUV2ZW50Lm1vdXNlRW50ZXIobGFiZWwgYXMgSFRNTEVsZW1lbnQpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KFxuICAgICAgICAnYmlsbGluZy5wbGFuc0NvbW1vbi5kb2N1bWVudFByb2Nlc3NpbmdQcmlvcml0eTogYmlsbGluZy5wbGFuc0NvbW1vbi5wcmlvcml0eS5zdGFuZGFyZCcsXG4gICAgICApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi5kb2N1bWVudFByb2Nlc3NpbmdQcmlvcml0eVRpcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSB0aGUgdGlwIHRleHQgd2hlbiBwcmlvcml0eSBpcyB0b3AgcHJpb3JpdHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cFBsYW4oUGxhbi5lbnRlcnByaXNlKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJpb3JpdHlMYWJlbCAvPilcbiAgICAgIGNvbnN0IGxhYmVsID0gc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi5wcmlvcml0eS50b3AtcHJpb3JpdHknKS5jbG9zZXN0KCdkaXYnKVxuICAgICAgZmlyZUV2ZW50Lm1vdXNlRW50ZXIobGFiZWwgYXMgSFRNTEVsZW1lbnQpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KFxuICAgICAgICAnYmlsbGluZy5wbGFuc0NvbW1vbi5kb2N1bWVudFByb2Nlc3NpbmdQcmlvcml0eTogYmlsbGluZy5wbGFuc0NvbW1vbi5wcmlvcml0eS50b3AtcHJpb3JpdHknLFxuICAgICAgKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYmlsbGluZy5wbGFuc0NvbW1vbi5kb2N1bWVudFByb2Nlc3NpbmdQcmlvcml0eVRpcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19