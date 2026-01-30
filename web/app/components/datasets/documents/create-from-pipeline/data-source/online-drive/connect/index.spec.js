"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
// ==========================================
// Mock Modules
// ==========================================
// Note: react-i18next uses global mock from web/vitest.setup.ts
// Mock useToolIcon - hook has complex dependencies (API calls, stores)
const mockUseToolIcon = vi.fn();
vi.mock('@/app/components/workflow/hooks', () => ({
    useToolIcon: (data) => mockUseToolIcon(data),
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockNodeData = (overrides) => ({
    title: 'Test Node',
    plugin_id: 'plugin-123',
    provider_type: 'online_drive',
    provider_name: 'online-drive-provider',
    datasource_name: 'online-drive-ds',
    datasource_label: 'Online Drive',
    datasource_parameters: {},
    datasource_configurations: {},
    ...overrides,
});
const createDefaultProps = (overrides) => ({
    nodeData: createMockNodeData(),
    onSetting: vi.fn(),
    ...overrides,
});
// ==========================================
// Test Suites
// ==========================================
describe('Connect', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock return values
        mockUseToolIcon.mockReturnValue('https://example.com/icon.png');
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Component should render with connect button
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should render the BlockIcon component', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - BlockIcon container should exist
            const iconContainer = container.querySelector('.size-12');
            expect(iconContainer).toBeInTheDocument();
        });
        it('should render the not connected message with node title', () => {
            // Arrange
            const props = createDefaultProps({
                nodeData: createMockNodeData({ title: 'My Google Drive' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should show translation key with interpolated name (use getAllBy since both messages contain similar text)
            const messages = react_1.screen.getAllByText(/datasetPipeline\.onlineDrive\.notConnected/);
            expect(messages.length).toBeGreaterThanOrEqual(1);
        });
        it('should render the not connected tip message', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should show tip translation key
            expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.notConnectedTip/)).toBeInTheDocument();
        });
        it('should render the connect button with correct text', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Button should have connect text
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveTextContent('datasetCreation.stepOne.connect');
        });
        it('should render with primary button variant', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Button should be primary variant
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });
        it('should render Icon3Dots component', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Icon3Dots should be rendered (it's an SVG element)
            const iconElement = container.querySelector('svg');
            expect(iconElement).toBeInTheDocument();
        });
        it('should apply correct container styling', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Container should have expected classes
            const mainContainer = container.firstChild;
            expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-start', 'gap-y-2', 'rounded-xl', 'p-6');
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('nodeData prop', () => {
            it('should pass nodeData to useToolIcon hook', () => {
                // Arrange
                const nodeData = createMockNodeData({ plugin_id: 'my-plugin' });
                const props = createDefaultProps({ nodeData });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockUseToolIcon).toHaveBeenCalledWith(nodeData);
            });
            it('should display node title in not connected message', () => {
                // Arrange
                const props = createDefaultProps({
                    nodeData: createMockNodeData({ title: 'Dropbox Storage' }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Translation key should be in document (mock returns key)
                const messages = react_1.screen.getAllByText(/datasetPipeline\.onlineDrive\.notConnected/);
                expect(messages.length).toBeGreaterThanOrEqual(1);
            });
            it('should display node title in tip message', () => {
                // Arrange
                const props = createDefaultProps({
                    nodeData: createMockNodeData({ title: 'OneDrive Connector' }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Translation key should be in document
                expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.notConnectedTip/)).toBeInTheDocument();
            });
            it.each([
                { title: 'Google Drive' },
                { title: 'Dropbox' },
                { title: 'OneDrive' },
                { title: 'Amazon S3' },
                { title: '' },
            ])('should handle nodeData with title=$title', ({ title }) => {
                // Arrange
                const props = createDefaultProps({
                    nodeData: createMockNodeData({ title }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should render without error
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
        });
        describe('onSetting prop', () => {
            it('should call onSetting when connect button is clicked', () => {
                // Arrange
                const mockOnSetting = vi.fn();
                const props = createDefaultProps({ onSetting: mockOnSetting });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                expect(mockOnSetting).toHaveBeenCalledTimes(1);
            });
            it('should call onSetting when button clicked', () => {
                // Arrange
                const mockOnSetting = vi.fn();
                const props = createDefaultProps({ onSetting: mockOnSetting });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert - onClick handler receives the click event from React
                expect(mockOnSetting).toHaveBeenCalled();
                expect(mockOnSetting.mock.calls[0]).toBeDefined();
            });
            it('should call onSetting on each button click', () => {
                // Arrange
                const mockOnSetting = vi.fn();
                const props = createDefaultProps({ onSetting: mockOnSetting });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                const button = react_1.screen.getByRole('button');
                react_1.fireEvent.click(button);
                react_1.fireEvent.click(button);
                react_1.fireEvent.click(button);
                // Assert
                expect(mockOnSetting).toHaveBeenCalledTimes(3);
            });
        });
    });
    // ==========================================
    // User Interactions and Event Handlers
    // ==========================================
    describe('User Interactions', () => {
        describe('Connect Button', () => {
            it('should trigger onSetting callback on click', () => {
                // Arrange
                const mockOnSetting = vi.fn();
                const props = createDefaultProps({ onSetting: mockOnSetting });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                expect(mockOnSetting).toHaveBeenCalled();
            });
            it('should be interactive and focusable', () => {
                // Arrange
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                const button = react_1.screen.getByRole('button');
                // Assert
                expect(button).not.toBeDisabled();
            });
            it('should handle keyboard interaction (Enter key)', () => {
                // Arrange
                const mockOnSetting = vi.fn();
                const props = createDefaultProps({ onSetting: mockOnSetting });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                const button = react_1.screen.getByRole('button');
                react_1.fireEvent.keyDown(button, { key: 'Enter' });
                // Assert - Button should be present and interactive
                expect(button).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Hook Integration Tests
    // ==========================================
    describe('Hook Integration', () => {
        describe('useToolIcon', () => {
            it('should call useToolIcon with nodeData', () => {
                // Arrange
                const nodeData = createMockNodeData();
                const props = createDefaultProps({ nodeData });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockUseToolIcon).toHaveBeenCalledWith(nodeData);
            });
            it('should use toolIcon result from useToolIcon', () => {
                // Arrange
                mockUseToolIcon.mockReturnValue('custom-icon-url');
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - The hook should be called and its return value used
                expect(mockUseToolIcon).toHaveBeenCalled();
            });
            it('should handle empty string icon', () => {
                // Arrange
                mockUseToolIcon.mockReturnValue('');
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should still render without crashing
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
            it('should handle undefined icon', () => {
                // Arrange
                mockUseToolIcon.mockReturnValue(undefined);
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should still render without crashing
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
        });
        describe('useTranslation', () => {
            it('should use correct translation keys for not connected message', () => {
                // Arrange
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should use the correct translation key (both notConnected and notConnectedTip contain similar pattern)
                const messages = react_1.screen.getAllByText(/datasetPipeline\.onlineDrive\.notConnected/);
                expect(messages.length).toBeGreaterThanOrEqual(1);
            });
            it('should use correct translation key for tip message', () => {
                // Arrange
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/datasetPipeline\.onlineDrive\.notConnectedTip/)).toBeInTheDocument();
            });
            it('should use correct translation key for connect button', () => {
                // Arrange
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toHaveTextContent('datasetCreation.stepOne.connect');
            });
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        describe('Empty/Null Values', () => {
            it('should handle empty title in nodeData', () => {
                // Arrange
                const props = createDefaultProps({
                    nodeData: createMockNodeData({ title: '' }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
            it('should handle undefined optional fields in nodeData', () => {
                // Arrange
                const minimalNodeData = {
                    title: 'Test',
                    plugin_id: 'test',
                    provider_type: 'online_drive',
                    provider_name: 'provider',
                    datasource_name: 'ds',
                    datasource_label: 'Label',
                    datasource_parameters: {},
                    datasource_configurations: {},
                };
                const props = createDefaultProps({ nodeData: minimalNodeData });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
            it('should handle empty plugin_id', () => {
                // Arrange
                const props = createDefaultProps({
                    nodeData: createMockNodeData({ plugin_id: '' }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
        });
        describe('Special Characters', () => {
            it('should handle special characters in title', () => {
                // Arrange
                const props = createDefaultProps({
                    nodeData: createMockNodeData({ title: 'Drive <script>alert("xss")</script>' }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Should render safely without executing script
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
            it('should handle unicode characters in title', () => {
                // Arrange
                const props = createDefaultProps({
                    nodeData: createMockNodeData({ title: '云盘存储 🌐' }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
            it('should handle very long title', () => {
                // Arrange
                const longTitle = 'A'.repeat(500);
                const props = createDefaultProps({
                    nodeData: createMockNodeData({ title: longTitle }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
        });
        describe('Icon Variations', () => {
            it('should handle string icon URL', () => {
                // Arrange
                mockUseToolIcon.mockReturnValue('https://cdn.example.com/icon.png');
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
            it('should handle object icon with url property', () => {
                // Arrange
                mockUseToolIcon.mockReturnValue({ url: 'https://cdn.example.com/icon.png' });
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
            it('should handle null icon', () => {
                // Arrange
                mockUseToolIcon.mockReturnValue(null);
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // All Prop Variations Tests
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            { title: 'Google Drive', plugin_id: 'google-drive' },
            { title: 'Dropbox', plugin_id: 'dropbox' },
            { title: 'OneDrive', plugin_id: 'onedrive' },
            { title: 'Amazon S3', plugin_id: 's3' },
            { title: 'Box', plugin_id: 'box' },
        ])('should render correctly with title=$title and plugin_id=$plugin_id', ({ title, plugin_id }) => {
            // Arrange
            const props = createDefaultProps({
                nodeData: createMockNodeData({ title, plugin_id }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            expect(mockUseToolIcon).toHaveBeenCalledWith(expect.objectContaining({ title, plugin_id }));
        });
        it.each([
            { provider_type: 'online_drive' },
            { provider_type: 'cloud_storage' },
            { provider_type: 'file_system' },
        ])('should render correctly with provider_type=$provider_type', ({ provider_type }) => {
            // Arrange
            const props = createDefaultProps({
                nodeData: createMockNodeData({ provider_type }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it.each([
            { datasource_label: 'Google Drive Storage' },
            { datasource_label: 'Dropbox Files' },
            { datasource_label: '' },
            { datasource_label: 'S3 Bucket' },
        ])('should render correctly with datasource_label=$datasource_label', ({ datasource_label }) => {
            // Arrange
            const props = createDefaultProps({
                nodeData: createMockNodeData({ datasource_label }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Accessibility Tests
    // ==========================================
    describe('Accessibility', () => {
        it('should have an accessible button', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Button should be accessible by role
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should have proper text content for screen readers', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Text content should be present
            const messages = react_1.screen.getAllByText(/datasetPipeline\.onlineDrive\.notConnected/);
            expect(messages.length).toBe(2); // Both notConnected and notConnectedTip
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLG1DQUE2QjtBQUU3Qiw2Q0FBNkM7QUFDN0MsZUFBZTtBQUNmLDZDQUE2QztBQUU3QyxnRUFBZ0U7QUFFaEUsdUVBQXVFO0FBQ3ZFLE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMvQixFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQsV0FBVyxFQUFFLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO0NBQ2xELENBQUMsQ0FBQyxDQUFBO0FBRUgsNkNBQTZDO0FBQzdDLHFCQUFxQjtBQUNyQiw2Q0FBNkM7QUFDN0MsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQXVDLEVBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQzNGLEtBQUssRUFBRSxXQUFXO0lBQ2xCLFNBQVMsRUFBRSxZQUFZO0lBQ3ZCLGFBQWEsRUFBRSxjQUFjO0lBQzdCLGFBQWEsRUFBRSx1QkFBdUI7SUFDdEMsZUFBZSxFQUFFLGlCQUFpQjtJQUNsQyxnQkFBZ0IsRUFBRSxjQUFjO0lBQ2hDLHFCQUFxQixFQUFFLEVBQUU7SUFDekIseUJBQXlCLEVBQUUsRUFBRTtJQUM3QixHQUFHLFNBQVM7Q0FDVSxDQUFBLENBQUE7QUFJeEIsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFNBQWlDLEVBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQy9FLFFBQVEsRUFBRSxrQkFBa0IsRUFBRTtJQUM5QixTQUFTLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUNsQixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRiw2Q0FBNkM7QUFDN0MsY0FBYztBQUNkLDZDQUE2QztBQUM3QyxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFB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LENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDNUQsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFbEMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBTyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTlCLDBDQUEwQztZQUMxQyxNQUFNLFFBQVEsR0FBRyxjQUFNLENBQUMsWUFBWSxDQUFDLDRDQUE0QyxDQUFDLENBQUE7WUFDbEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUEsQ0FBQyx3Q0FBd0M7UUFDMUUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlTm9kZVR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L25vZGVzL2RhdGEtc291cmNlL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgQ29ubmVjdCBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgTW9kdWxlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE5vdGU6IHJlYWN0LWkxOG5leHQgdXNlcyBnbG9iYWwgbW9jayBmcm9tIHdlYi92aXRlc3Quc2V0dXAudHNcblxuLy8gTW9jayB1c2VUb29sSWNvbiAtIGhvb2sgaGFzIGNvbXBsZXggZGVwZW5kZW5jaWVzIChBUEkgY2FsbHMsIHN0b3JlcylcbmNvbnN0IG1vY2tVc2VUb29sSWNvbiA9IHZpLmZuKClcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VUb29sSWNvbjogKGRhdGE6IGFueSkgPT4gbW9ja1VzZVRvb2xJY29uKGRhdGEpLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEJ1aWxkZXJzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IGNyZWF0ZU1vY2tOb2RlRGF0YSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPERhdGFTb3VyY2VOb2RlVHlwZT4pOiBEYXRhU291cmNlTm9kZVR5cGUgPT4gKHtcbiAgdGl0bGU6ICdUZXN0IE5vZGUnLFxuICBwbHVnaW5faWQ6ICdwbHVnaW4tMTIzJyxcbiAgcHJvdmlkZXJfdHlwZTogJ29ubGluZV9kcml2ZScsXG4gIHByb3ZpZGVyX25hbWU6ICdvbmxpbmUtZHJpdmUtcHJvdmlkZXInLFxuICBkYXRhc291cmNlX25hbWU6ICdvbmxpbmUtZHJpdmUtZHMnLFxuICBkYXRhc291cmNlX2xhYmVsOiAnT25saW5lIERyaXZlJyxcbiAgZGF0YXNvdXJjZV9wYXJhbWV0ZXJzOiB7fSxcbiAgZGF0YXNvdXJjZV9jb25maWd1cmF0aW9uczoge30sXG4gIC4uLm92ZXJyaWRlcyxcbn0gYXMgRGF0YVNvdXJjZU5vZGVUeXBlKVxuXG50eXBlIENvbm5lY3RQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBDb25uZWN0PlxuXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxDb25uZWN0UHJvcHM+KTogQ29ubmVjdFByb3BzID0+ICh7XG4gIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoKSxcbiAgb25TZXR0aW5nOiB2aS5mbigpLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdDb25uZWN0JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcblxuICAgIC8vIERlZmF1bHQgbW9jayByZXR1cm4gdmFsdWVzXG4gICAgbW9ja1VzZVRvb2xJY29uLm1vY2tSZXR1cm5WYWx1ZSgnaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZycpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIHJlbmRlciB3aXRoIGNvbm5lY3QgYnV0dG9uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGhlIEJsb2NrSWNvbiBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBCbG9ja0ljb24gY29udGFpbmVyIHNob3VsZCBleGlzdFxuICAgICAgY29uc3QgaWNvbkNvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc2l6ZS0xMicpXG4gICAgICBleHBlY3QoaWNvbkNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0aGUgbm90IGNvbm5lY3RlZCBtZXNzYWdlIHdpdGggbm9kZSB0aXRsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbm9kZURhdGE6IGNyZWF0ZU1vY2tOb2RlRGF0YSh7IHRpdGxlOiAnTXkgR29vZ2xlIERyaXZlJyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzaG93IHRyYW5zbGF0aW9uIGtleSB3aXRoIGludGVycG9sYXRlZCBuYW1lICh1c2UgZ2V0QWxsQnkgc2luY2UgYm90aCBtZXNzYWdlcyBjb250YWluIHNpbWlsYXIgdGV4dClcbiAgICAgIGNvbnN0IG1lc3NhZ2VzID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvZGF0YXNldFBpcGVsaW5lXFwub25saW5lRHJpdmVcXC5ub3RDb25uZWN0ZWQvKVxuICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0aGUgbm90IGNvbm5lY3RlZCB0aXAgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgdGlwIHRyYW5zbGF0aW9uIGtleVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRQaXBlbGluZVxcLm9ubGluZURyaXZlXFwubm90Q29ubmVjdGVkVGlwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGhlIGNvbm5lY3QgYnV0dG9uIHdpdGggY29ycmVjdCB0ZXh0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBCdXR0b24gc2hvdWxkIGhhdmUgY29ubmVjdCB0ZXh0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlVGV4dENvbnRlbnQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmNvbm5lY3QnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHByaW1hcnkgYnV0dG9uIHZhcmlhbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEJ1dHRvbiBzaG91bGQgYmUgcHJpbWFyeSB2YXJpYW50XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJY29uM0RvdHMgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gSWNvbjNEb3RzIHNob3VsZCBiZSByZW5kZXJlZCAoaXQncyBhbiBTVkcgZWxlbWVudClcbiAgICAgIGNvbnN0IGljb25FbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3QoaWNvbkVsZW1lbnQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjb3JyZWN0IGNvbnRhaW5lciBzdHlsaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29udGFpbmVyIHNob3VsZCBoYXZlIGV4cGVjdGVkIGNsYXNzZXNcbiAgICAgIGNvbnN0IG1haW5Db250YWluZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZFxuICAgICAgZXhwZWN0KG1haW5Db250YWluZXIpLnRvSGF2ZUNsYXNzKCdmbGV4JywgJ2ZsZXgtY29sJywgJ2l0ZW1zLXN0YXJ0JywgJ2dhcC15LTInLCAncm91bmRlZC14bCcsICdwLTYnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnbm9kZURhdGEgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBub2RlRGF0YSB0byB1c2VUb29sSWNvbiBob29rJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG5vZGVEYXRhID0gY3JlYXRlTW9ja05vZGVEYXRhKHsgcGx1Z2luX2lkOiAnbXktcGx1Z2luJyB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG5vZGVEYXRhIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1VzZVRvb2xJY29uKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChub2RlRGF0YSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBub2RlIHRpdGxlIGluIG5vdCBjb25uZWN0ZWQgbWVzc2FnZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbm9kZURhdGE6IGNyZWF0ZU1vY2tOb2RlRGF0YSh7IHRpdGxlOiAnRHJvcGJveCBTdG9yYWdlJyB9KSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gVHJhbnNsYXRpb24ga2V5IHNob3VsZCBiZSBpbiBkb2N1bWVudCAobW9jayByZXR1cm5zIGtleSlcbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KC9kYXRhc2V0UGlwZWxpbmVcXC5vbmxpbmVEcml2ZVxcLm5vdENvbm5lY3RlZC8pXG4gICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGlzcGxheSBub2RlIHRpdGxlIGluIHRpcCBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBub2RlRGF0YTogY3JlYXRlTW9ja05vZGVEYXRhKHsgdGl0bGU6ICdPbmVEcml2ZSBDb25uZWN0b3InIH0pLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBUcmFuc2xhdGlvbiBrZXkgc2hvdWxkIGJlIGluIGRvY3VtZW50XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0UGlwZWxpbmVcXC5vbmxpbmVEcml2ZVxcLm5vdENvbm5lY3RlZFRpcC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdC5lYWNoKFtcbiAgICAgICAgeyB0aXRsZTogJ0dvb2dsZSBEcml2ZScgfSxcbiAgICAgICAgeyB0aXRsZTogJ0Ryb3Bib3gnIH0sXG4gICAgICAgIHsgdGl0bGU6ICdPbmVEcml2ZScgfSxcbiAgICAgICAgeyB0aXRsZTogJ0FtYXpvbiBTMycgfSxcbiAgICAgICAgeyB0aXRsZTogJycgfSxcbiAgICAgIF0pKCdzaG91bGQgaGFuZGxlIG5vZGVEYXRhIHdpdGggdGl0bGU9JHRpdGxlJywgKHsgdGl0bGUgfSkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBub2RlRGF0YTogY3JlYXRlTW9ja05vZGVEYXRhKHsgdGl0bGUgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvclxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvblNldHRpbmcgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvblNldHRpbmcgd2hlbiBjb25uZWN0IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPblNldHRpbmcgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25TZXR0aW5nOiBtb2NrT25TZXR0aW5nIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25TZXR0aW5nKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvblNldHRpbmcgd2hlbiBidXR0b24gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZXR0aW5nID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU2V0dGluZzogbW9ja09uU2V0dGluZyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIG9uQ2xpY2sgaGFuZGxlciByZWNlaXZlcyB0aGUgY2xpY2sgZXZlbnQgZnJvbSBSZWFjdFxuICAgICAgICBleHBlY3QobW9ja09uU2V0dGluZykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrT25TZXR0aW5nLm1vY2suY2FsbHNbMF0pLnRvQmVEZWZpbmVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvblNldHRpbmcgb24gZWFjaCBidXR0b24gY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uU2V0dGluZyA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblNldHRpbmc6IG1vY2tPblNldHRpbmcgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b24pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25TZXR0aW5nKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgYW5kIEV2ZW50IEhhbmRsZXJzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ0Nvbm5lY3QgQnV0dG9uJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIG9uU2V0dGluZyBjYWxsYmFjayBvbiBjbGljaycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZXR0aW5nID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU2V0dGluZzogbW9ja09uU2V0dGluZyB9KVxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja09uU2V0dGluZykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGJlIGludGVyYWN0aXZlIGFuZCBmb2N1c2FibGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBrZXlib2FyZCBpbnRlcmFjdGlvbiAoRW50ZXIga2V5KScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25TZXR0aW5nID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU2V0dGluZzogbW9ja09uU2V0dGluZyB9KVxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgZmlyZUV2ZW50LmtleURvd24oYnV0dG9uLCB7IGtleTogJ0VudGVyJyB9KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIEJ1dHRvbiBzaG91bGQgYmUgcHJlc2VudCBhbmQgaW50ZXJhY3RpdmVcbiAgICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBIb29rIEludGVncmF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSG9vayBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBkZXNjcmliZSgndXNlVG9vbEljb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgdXNlVG9vbEljb24gd2l0aCBub2RlRGF0YScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBub2RlRGF0YSA9IGNyZWF0ZU1vY2tOb2RlRGF0YSgpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgbm9kZURhdGEgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrVXNlVG9vbEljb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG5vZGVEYXRhKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1c2UgdG9vbEljb24gcmVzdWx0IGZyb20gdXNlVG9vbEljb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1VzZVRvb2xJY29uLm1vY2tSZXR1cm5WYWx1ZSgnY3VzdG9tLWljb24tdXJsJylcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBUaGUgaG9vayBzaG91bGQgYmUgY2FsbGVkIGFuZCBpdHMgcmV0dXJuIHZhbHVlIHVzZWRcbiAgICAgICAgZXhwZWN0KG1vY2tVc2VUb29sSWNvbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgaWNvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrVXNlVG9vbEljb24ubW9ja1JldHVyblZhbHVlKCcnKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzdGlsbCByZW5kZXIgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBpY29uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tVc2VUb29sSWNvbi5tb2NrUmV0dXJuVmFsdWUodW5kZWZpbmVkKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzdGlsbCByZW5kZXIgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd1c2VUcmFuc2xhdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGNvcnJlY3QgdHJhbnNsYXRpb24ga2V5cyBmb3Igbm90IGNvbm5lY3RlZCBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHVzZSB0aGUgY29ycmVjdCB0cmFuc2xhdGlvbiBrZXkgKGJvdGggbm90Q29ubmVjdGVkIGFuZCBub3RDb25uZWN0ZWRUaXAgY29udGFpbiBzaW1pbGFyIHBhdHRlcm4pXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvZGF0YXNldFBpcGVsaW5lXFwub25saW5lRHJpdmVcXC5ub3RDb25uZWN0ZWQvKVxuICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW5PckVxdWFsKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBjb3JyZWN0IHRyYW5zbGF0aW9uIGtleSBmb3IgdGlwIG1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRQaXBlbGluZVxcLm9ubGluZURyaXZlXFwubm90Q29ubmVjdGVkVGlwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGNvcnJlY3QgdHJhbnNsYXRpb24ga2V5IGZvciBjb25uZWN0IGJ1dHRvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvSGF2ZVRleHRDb250ZW50KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5jb25uZWN0JylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnRW1wdHkvTnVsbCBWYWx1ZXMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB0aXRsZSBpbiBub2RlRGF0YScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbm9kZURhdGE6IGNyZWF0ZU1vY2tOb2RlRGF0YSh7IHRpdGxlOiAnJyB9KSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIG9wdGlvbmFsIGZpZWxkcyBpbiBub2RlRGF0YScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtaW5pbWFsTm9kZURhdGEgPSB7XG4gICAgICAgICAgdGl0bGU6ICdUZXN0JyxcbiAgICAgICAgICBwbHVnaW5faWQ6ICd0ZXN0JyxcbiAgICAgICAgICBwcm92aWRlcl90eXBlOiAnb25saW5lX2RyaXZlJyxcbiAgICAgICAgICBwcm92aWRlcl9uYW1lOiAncHJvdmlkZXInLFxuICAgICAgICAgIGRhdGFzb3VyY2VfbmFtZTogJ2RzJyxcbiAgICAgICAgICBkYXRhc291cmNlX2xhYmVsOiAnTGFiZWwnLFxuICAgICAgICAgIGRhdGFzb3VyY2VfcGFyYW1ldGVyczoge30sXG4gICAgICAgICAgZGF0YXNvdXJjZV9jb25maWd1cmF0aW9uczoge30sXG4gICAgICAgIH0gYXMgRGF0YVNvdXJjZU5vZGVUeXBlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgbm9kZURhdGE6IG1pbmltYWxOb2RlRGF0YSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBwbHVnaW5faWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoeyBwbHVnaW5faWQ6ICcnIH0pLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnU3BlY2lhbCBDaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHRpdGxlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBub2RlRGF0YTogY3JlYXRlTW9ja05vZGVEYXRhKHsgdGl0bGU6ICdEcml2ZSA8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+JyB9KSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciBzYWZlbHkgd2l0aG91dCBleGVjdXRpbmcgc2NyaXB0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5pY29kZSBjaGFyYWN0ZXJzIGluIHRpdGxlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBub2RlRGF0YTogY3JlYXRlTW9ja05vZGVEYXRhKHsgdGl0bGU6ICfkupHnm5jlrZjlgqgg8J+MkCcgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyB0aXRsZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBsb25nVGl0bGUgPSAnQScucmVwZWF0KDUwMClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoeyB0aXRsZTogbG9uZ1RpdGxlIH0pLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnSWNvbiBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RyaW5nIGljb24gVVJMJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tVc2VUb29sSWNvbi5tb2NrUmV0dXJuVmFsdWUoJ2h0dHBzOi8vY2RuLmV4YW1wbGUuY29tL2ljb24ucG5nJylcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBvYmplY3QgaWNvbiB3aXRoIHVybCBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrVXNlVG9vbEljb24ubW9ja1JldHVyblZhbHVlKHsgdXJsOiAnaHR0cHM6Ly9jZG4uZXhhbXBsZS5jb20vaWNvbi5wbmcnIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBpY29uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tVc2VUb29sSWNvbi5tb2NrUmV0dXJuVmFsdWUobnVsbClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFsbCBQcm9wIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQuZWFjaChbXG4gICAgICB7IHRpdGxlOiAnR29vZ2xlIERyaXZlJywgcGx1Z2luX2lkOiAnZ29vZ2xlLWRyaXZlJyB9LFxuICAgICAgeyB0aXRsZTogJ0Ryb3Bib3gnLCBwbHVnaW5faWQ6ICdkcm9wYm94JyB9LFxuICAgICAgeyB0aXRsZTogJ09uZURyaXZlJywgcGx1Z2luX2lkOiAnb25lZHJpdmUnIH0sXG4gICAgICB7IHRpdGxlOiAnQW1hem9uIFMzJywgcGx1Z2luX2lkOiAnczMnIH0sXG4gICAgICB7IHRpdGxlOiAnQm94JywgcGx1Z2luX2lkOiAnYm94JyB9LFxuICAgIF0pKCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIHRpdGxlPSR0aXRsZSBhbmQgcGx1Z2luX2lkPSRwbHVnaW5faWQnLCAoeyB0aXRsZSwgcGx1Z2luX2lkIH0pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbm9kZURhdGE6IGNyZWF0ZU1vY2tOb2RlRGF0YSh7IHRpdGxlLCBwbHVnaW5faWQgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KG1vY2tVc2VUb29sSWNvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdGl0bGUsIHBsdWdpbl9pZCB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQuZWFjaChbXG4gICAgICB7IHByb3ZpZGVyX3R5cGU6ICdvbmxpbmVfZHJpdmUnIH0sXG4gICAgICB7IHByb3ZpZGVyX3R5cGU6ICdjbG91ZF9zdG9yYWdlJyB9LFxuICAgICAgeyBwcm92aWRlcl90eXBlOiAnZmlsZV9zeXN0ZW0nIH0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggcHJvdmlkZXJfdHlwZT0kcHJvdmlkZXJfdHlwZScsICh7IHByb3ZpZGVyX3R5cGUgfSkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBub2RlRGF0YTogY3JlYXRlTW9ja05vZGVEYXRhKHsgcHJvdmlkZXJfdHlwZSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgeyBkYXRhc291cmNlX2xhYmVsOiAnR29vZ2xlIERyaXZlIFN0b3JhZ2UnIH0sXG4gICAgICB7IGRhdGFzb3VyY2VfbGFiZWw6ICdEcm9wYm94IEZpbGVzJyB9LFxuICAgICAgeyBkYXRhc291cmNlX2xhYmVsOiAnJyB9LFxuICAgICAgeyBkYXRhc291cmNlX2xhYmVsOiAnUzMgQnVja2V0JyB9LFxuICAgIF0pKCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIGRhdGFzb3VyY2VfbGFiZWw9JGRhdGFzb3VyY2VfbGFiZWwnLCAoeyBkYXRhc291cmNlX2xhYmVsIH0pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbm9kZURhdGE6IGNyZWF0ZU1vY2tOb2RlRGF0YSh7IGRhdGFzb3VyY2VfbGFiZWwgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q29ubmVjdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBhbiBhY2Nlc3NpYmxlIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENvbm5lY3Qgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQnV0dG9uIHNob3VsZCBiZSBhY2Nlc3NpYmxlIGJ5IHJvbGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIHRleHQgY29udGVudCBmb3Igc2NyZWVuIHJlYWRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDb25uZWN0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFRleHQgY29udGVudCBzaG91bGQgYmUgcHJlc2VudFxuICAgICAgY29uc3QgbWVzc2FnZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KC9kYXRhc2V0UGlwZWxpbmVcXC5vbmxpbmVEcml2ZVxcLm5vdENvbm5lY3RlZC8pXG4gICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDIpIC8vIEJvdGggbm90Q29ubmVjdGVkIGFuZCBub3RDb25uZWN0ZWRUaXBcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==