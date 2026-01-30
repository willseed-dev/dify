"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const types_1 = require("@/app/components/base/form/form-scenarios/base/types");
const use_input_fields_1 = require("@/app/components/rag-pipeline/hooks/use-input-fields");
const hooks_1 = require("./hooks");
const index_1 = require("./index");
// ==========================================
// Mock External Dependencies
// ==========================================
// Mock useInputVariables hook
let mockIsFetchingParams = false;
let mockParamsConfig = { variables: [] };
vi.mock('./hooks', () => ({
    useInputVariables: vi.fn(() => ({
        isFetchingParams: mockIsFetchingParams,
        paramsConfig: mockParamsConfig,
    })),
}));
// Mock useConfigurations hook
let mockConfigurations = [];
// Mock useInitialData hook
let mockInitialData = {};
vi.mock('@/app/components/rag-pipeline/hooks/use-input-fields', () => ({
    useInitialData: vi.fn(() => mockInitialData),
    useConfigurations: vi.fn(() => mockConfigurations),
}));
// ==========================================
// Test Data Factory Functions
// ==========================================
/**
 * Creates mock configuration for testing
 */
const createMockConfiguration = (overrides = {}) => ({
    type: types_1.BaseFieldType.textInput,
    variable: 'testVariable',
    label: 'Test Label',
    required: false,
    maxLength: undefined,
    options: undefined,
    showConditions: [],
    placeholder: '',
    tooltip: '',
    ...overrides,
});
/**
 * Creates default test props
 */
const createDefaultProps = (overrides = {}) => ({
    dataSourceNodeId: 'test-node-id',
    ref: { current: null },
    isRunning: false,
    onProcess: vi.fn(),
    onPreview: vi.fn(),
    onSubmit: vi.fn(),
    onBack: vi.fn(),
    ...overrides,
});
// ==========================================
// Test Suite
// ==========================================
describe('ProcessDocuments', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock values
        mockIsFetchingParams = false;
        mockParamsConfig = { variables: [] };
        mockInitialData = {};
        mockConfigurations = [];
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        // Tests basic rendering functionality
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - check for Header title from Form component
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
        it('should render Form and Actions components', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - check for elements from both components
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.operations.dataSource')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.operations.saveAndProcess')).toBeInTheDocument();
        });
        it('should render with correct container structure', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const mainContainer = container.querySelector('.flex.flex-col.gap-y-4.pt-4');
            expect(mainContainer).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('dataSourceNodeId prop', () => {
            it('should pass dataSourceNodeId to useInputVariables hook', () => {
                // Arrange
                const props = createDefaultProps({ dataSourceNodeId: 'custom-node-id' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(vi.mocked(hooks_1.useInputVariables)).toHaveBeenCalledWith('custom-node-id');
            });
            it('should handle empty dataSourceNodeId', () => {
                // Arrange
                const props = createDefaultProps({ dataSourceNodeId: '' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
            });
        });
        describe('isRunning prop', () => {
            it('should disable preview button when isRunning is true', () => {
                // Arrange
                const props = createDefaultProps({ isRunning: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
                expect(previewButton).toBeDisabled();
            });
            it('should not disable preview button when isRunning is false', () => {
                // Arrange
                const props = createDefaultProps({ isRunning: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
                expect(previewButton).not.toBeDisabled();
            });
            it('should disable process button in Actions when isRunning is true', () => {
                // Arrange
                mockIsFetchingParams = false;
                const props = createDefaultProps({ isRunning: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
                expect(processButton).toBeDisabled();
            });
        });
        describe('ref prop', () => {
            it('should expose submit method via ref', () => {
                // Arrange
                const mockRef = { current: null };
                const props = createDefaultProps({ ref: mockRef });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockRef.current).not.toBeNull();
                expect(typeof mockRef.current?.submit).toBe('function');
            });
        });
    });
    // ==========================================
    // User Interactions Testing
    // ==========================================
    describe('User Interactions', () => {
        it('should call onProcess when Actions process button is clicked', () => {
            // Arrange
            const onProcess = vi.fn();
            const props = createDefaultProps({ onProcess });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i }));
            // Assert
            expect(onProcess).toHaveBeenCalledTimes(1);
        });
        it('should call onBack when Actions back button is clicked', () => {
            // Arrange
            const onBack = vi.fn();
            const props = createDefaultProps({ onBack });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.operations.dataSource/i }));
            // Assert
            expect(onBack).toHaveBeenCalledTimes(1);
        });
        it('should call onPreview when preview button is clicked', () => {
            // Arrange
            const onPreview = vi.fn();
            const props = createDefaultProps({ onPreview });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i }));
            // Assert
            expect(onPreview).toHaveBeenCalledTimes(1);
        });
        it('should call onSubmit when form is submitted', async () => {
            // Arrange
            const onSubmit = vi.fn();
            const props = createDefaultProps({ onSubmit });
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onSubmit).toHaveBeenCalled();
            });
        });
    });
    // ==========================================
    // Hook Integration Tests
    // ==========================================
    describe('Hook Integration', () => {
        it('should pass variables from useInputVariables to useInitialData', () => {
            // Arrange
            const mockVariables = [{ variable: 'testVar', type: 'text', label: 'Test' }];
            mockParamsConfig = { variables: mockVariables };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(vi.mocked(use_input_fields_1.useInitialData)).toHaveBeenCalledWith(mockVariables);
        });
        it('should pass variables from useInputVariables to useConfigurations', () => {
            // Arrange
            const mockVariables = [{ variable: 'testVar', type: 'text', label: 'Test' }];
            mockParamsConfig = { variables: mockVariables };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(vi.mocked(use_input_fields_1.useConfigurations)).toHaveBeenCalledWith(mockVariables);
        });
        it('should use empty array when paramsConfig.variables is undefined', () => {
            // Arrange
            mockParamsConfig = { variables: undefined };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(vi.mocked(use_input_fields_1.useInitialData)).toHaveBeenCalledWith([]);
            expect(vi.mocked(use_input_fields_1.useConfigurations)).toHaveBeenCalledWith([]);
        });
        it('should use empty array when paramsConfig is undefined', () => {
            // Arrange
            mockParamsConfig = undefined;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(vi.mocked(use_input_fields_1.useInitialData)).toHaveBeenCalledWith([]);
            expect(vi.mocked(use_input_fields_1.useConfigurations)).toHaveBeenCalledWith([]);
        });
    });
    // ==========================================
    // Actions runDisabled Testing
    // ==========================================
    describe('Actions runDisabled', () => {
        it('should disable process button when isFetchingParams is true', () => {
            // Arrange
            mockIsFetchingParams = true;
            const props = createDefaultProps({ isRunning: false });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
            expect(processButton).toBeDisabled();
        });
        it('should disable process button when isRunning is true', () => {
            // Arrange
            mockIsFetchingParams = false;
            const props = createDefaultProps({ isRunning: true });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
            expect(processButton).toBeDisabled();
        });
        it('should enable process button when both isFetchingParams and isRunning are false', () => {
            // Arrange
            mockIsFetchingParams = false;
            const props = createDefaultProps({ isRunning: false });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
            expect(processButton).not.toBeDisabled();
        });
        it('should disable process button when both isFetchingParams and isRunning are true', () => {
            // Arrange
            mockIsFetchingParams = true;
            const props = createDefaultProps({ isRunning: true });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
            expect(processButton).toBeDisabled();
        });
    });
    // ==========================================
    // Component Memoization Testing
    // ==========================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert - verify component has memo wrapper
            expect(index_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
        it('should render correctly after rerender with same props', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            rerender(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
        it('should update when dataSourceNodeId prop changes', () => {
            // Arrange
            const props = createDefaultProps({ dataSourceNodeId: 'node-1' });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(vi.mocked(hooks_1.useInputVariables)).toHaveBeenLastCalledWith('node-1');
            rerender(<index_1.default {...props} dataSourceNodeId="node-2"/>);
            // Assert
            expect(vi.mocked(hooks_1.useInputVariables)).toHaveBeenLastCalledWith('node-2');
        });
    });
    // ==========================================
    // Edge Cases Testing
    // ==========================================
    describe('Edge Cases', () => {
        it('should handle undefined paramsConfig gracefully', () => {
            // Arrange
            mockParamsConfig = undefined;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
        it('should handle empty variables array', () => {
            // Arrange
            mockParamsConfig = { variables: [] };
            mockConfigurations = [];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
        it('should handle special characters in dataSourceNodeId', () => {
            // Arrange
            const props = createDefaultProps({ dataSourceNodeId: 'node-id-with-special_chars:123' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(vi.mocked(hooks_1.useInputVariables)).toHaveBeenCalledWith('node-id-with-special_chars:123');
        });
        it('should handle long dataSourceNodeId', () => {
            // Arrange
            const longId = 'a'.repeat(1000);
            const props = createDefaultProps({ dataSourceNodeId: longId });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(vi.mocked(hooks_1.useInputVariables)).toHaveBeenCalledWith(longId);
        });
        it('should handle multiple callbacks without interference', () => {
            // Arrange
            const onProcess = vi.fn();
            const onBack = vi.fn();
            const onPreview = vi.fn();
            const props = createDefaultProps({ onProcess, onBack, onPreview });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i }));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.operations.dataSource/i }));
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i }));
            // Assert
            expect(onProcess).toHaveBeenCalledTimes(1);
            expect(onBack).toHaveBeenCalledTimes(1);
            expect(onPreview).toHaveBeenCalledTimes(1);
        });
    });
    // ==========================================
    // runDisabled Logic Testing (with test.each)
    // ==========================================
    describe('runDisabled Logic', () => {
        const runDisabledTestCases = [
            { isFetchingParams: false, isRunning: false, expectedDisabled: false },
            { isFetchingParams: false, isRunning: true, expectedDisabled: true },
            { isFetchingParams: true, isRunning: false, expectedDisabled: true },
            { isFetchingParams: true, isRunning: true, expectedDisabled: true },
        ];
        it.each(runDisabledTestCases)('should set process button disabled=$expectedDisabled when isFetchingParams=$isFetchingParams and isRunning=$isRunning', ({ isFetchingParams, isRunning, expectedDisabled }) => {
            // Arrange
            mockIsFetchingParams = isFetchingParams;
            const props = createDefaultProps({ isRunning });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
            if (expectedDisabled)
                expect(processButton).toBeDisabled();
            else
                expect(processButton).not.toBeDisabled();
        });
    });
    // ==========================================
    // Configuration Rendering Tests
    // ==========================================
    describe('Configuration Rendering', () => {
        it('should render configurations as form fields', () => {
            // Arrange
            mockConfigurations = [
                createMockConfiguration({ variable: 'var1', label: 'Variable 1' }),
                createMockConfiguration({ variable: 'var2', label: 'Variable 2' }),
            ];
            mockInitialData = { var1: '', var2: '' };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Variable 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Variable 2')).toBeInTheDocument();
        });
        it('should handle configurations with different field types', () => {
            // Arrange
            mockConfigurations = [
                createMockConfiguration({ type: types_1.BaseFieldType.textInput, variable: 'textVar', label: 'Text Field' }),
                createMockConfiguration({ type: types_1.BaseFieldType.numberInput, variable: 'numberVar', label: 'Number Field' }),
            ];
            mockInitialData = { textVar: '', numberVar: 0 };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Text Field')).toBeInTheDocument();
            expect(react_1.screen.getByText('Number Field')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Full Integration Props Testing
    // ==========================================
    describe('Full Prop Integration', () => {
        it('should render correctly with all props provided', () => {
            // Arrange
            const mockRef = { current: null };
            mockIsFetchingParams = false;
            mockParamsConfig = { variables: [{ variable: 'testVar', type: 'text', label: 'Test' }] };
            mockInitialData = { testVar: 'initial value' };
            mockConfigurations = [createMockConfiguration({ variable: 'testVar', label: 'Test Variable' })];
            const props = {
                dataSourceNodeId: 'full-test-node',
                ref: mockRef,
                isRunning: false,
                onProcess: vi.fn(),
                onPreview: vi.fn(),
                onSubmit: vi.fn(),
                onBack: vi.fn(),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.operations.dataSource')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.operations.saveAndProcess')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test Variable')).toBeInTheDocument();
            expect(mockRef.current).not.toBeNull();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixnRkFBb0Y7QUFDcEYsMkZBQXdHO0FBQ3hHLG1DQUEyQztBQUMzQyxtQ0FBc0M7QUFFdEMsNkNBQTZDO0FBQzdDLDZCQUE2QjtBQUM3Qiw2Q0FBNkM7QUFFN0MsOEJBQThCO0FBQzlCLElBQUksb0JBQW9CLEdBQUcsS0FBSyxDQUFBO0FBQ2hDLElBQUksZ0JBQWdCLEdBQXlDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFBO0FBQzlFLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEIsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLGdCQUFnQixFQUFFLG9CQUFvQjtRQUN0QyxZQUFZLEVBQUUsZ0JBQWdCO0tBQy9CLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUgsOEJBQThCO0FBQzlCLElBQUksa0JBQWtCLEdBQXdCLEVBQUUsQ0FBQTtBQUVoRCwyQkFBMkI7QUFDM0IsSUFBSSxlQUFlLEdBQTRCLEVBQUUsQ0FBQTtBQUNqRCxFQUFFLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckUsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO0lBQzVDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7Q0FDbkQsQ0FBQyxDQUFDLENBQUE7QUFFSCw2Q0FBNkM7QUFDN0MsOEJBQThCO0FBQzlCLDZDQUE2QztBQUU3Qzs7R0FFRztBQUNILE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxZQUF3QyxF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TUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDckYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzdELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3hDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQmFzZUNvbmZpZ3VyYXRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9iYXNlL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJhc2VGaWVsZFR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9iYXNlL3R5cGVzJ1xuaW1wb3J0IHsgdXNlQ29uZmlndXJhdGlvbnMsIHVzZUluaXRpYWxEYXRhIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9yYWctcGlwZWxpbmUvaG9va3MvdXNlLWlucHV0LWZpZWxkcydcbmltcG9ydCB7IHVzZUlucHV0VmFyaWFibGVzIH0gZnJvbSAnLi9ob29rcydcbmltcG9ydCBQcm9jZXNzRG9jdW1lbnRzIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHVzZUlucHV0VmFyaWFibGVzIGhvb2tcbmxldCBtb2NrSXNGZXRjaGluZ1BhcmFtcyA9IGZhbHNlXG5sZXQgbW9ja1BhcmFtc0NvbmZpZzogeyB2YXJpYWJsZXM6IHVua25vd25bXSB9IHwgdW5kZWZpbmVkID0geyB2YXJpYWJsZXM6IFtdIH1cbnZpLm1vY2soJy4vaG9va3MnLCAoKSA9PiAoe1xuICB1c2VJbnB1dFZhcmlhYmxlczogdmkuZm4oKCkgPT4gKHtcbiAgICBpc0ZldGNoaW5nUGFyYW1zOiBtb2NrSXNGZXRjaGluZ1BhcmFtcyxcbiAgICBwYXJhbXNDb25maWc6IG1vY2tQYXJhbXNDb25maWcsXG4gIH0pKSxcbn0pKVxuXG4vLyBNb2NrIHVzZUNvbmZpZ3VyYXRpb25zIGhvb2tcbmxldCBtb2NrQ29uZmlndXJhdGlvbnM6IEJhc2VDb25maWd1cmF0aW9uW10gPSBbXVxuXG4vLyBNb2NrIHVzZUluaXRpYWxEYXRhIGhvb2tcbmxldCBtb2NrSW5pdGlhbERhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge31cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcmFnLXBpcGVsaW5lL2hvb2tzL3VzZS1pbnB1dC1maWVsZHMnLCAoKSA9PiAoe1xuICB1c2VJbml0aWFsRGF0YTogdmkuZm4oKCkgPT4gbW9ja0luaXRpYWxEYXRhKSxcbiAgdXNlQ29uZmlndXJhdGlvbnM6IHZpLmZuKCgpID0+IG1vY2tDb25maWd1cmF0aW9ucyksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yeSBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIENyZWF0ZXMgbW9jayBjb25maWd1cmF0aW9uIGZvciB0ZXN0aW5nXG4gKi9cbmNvbnN0IGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uID0gKG92ZXJyaWRlczogUGFydGlhbDxCYXNlQ29uZmlndXJhdGlvbj4gPSB7fSk6IEJhc2VDb25maWd1cmF0aW9uID0+ICh7XG4gIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICB2YXJpYWJsZTogJ3Rlc3RWYXJpYWJsZScsXG4gIGxhYmVsOiAnVGVzdCBMYWJlbCcsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgbWF4TGVuZ3RoOiB1bmRlZmluZWQsXG4gIG9wdGlvbnM6IHVuZGVmaW5lZCxcbiAgc2hvd0NvbmRpdGlvbnM6IFtdLFxuICBwbGFjZWhvbGRlcjogJycsXG4gIHRvb2x0aXA6ICcnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vKipcbiAqIENyZWF0ZXMgZGVmYXVsdCB0ZXN0IHByb3BzXG4gKi9cbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM6IFBhcnRpYWw8UmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIFByb2Nlc3NEb2N1bWVudHM+PiA9IHt9KSA9PiAoe1xuICBkYXRhU291cmNlTm9kZUlkOiAndGVzdC1ub2RlLWlkJyxcbiAgcmVmOiB7IGN1cnJlbnQ6IG51bGwgfSBhcyBSZWFjdC5SZWZPYmplY3Q8dW5rbm93bj4sXG4gIGlzUnVubmluZzogZmFsc2UsXG4gIG9uUHJvY2VzczogdmkuZm4oKSxcbiAgb25QcmV2aWV3OiB2aS5mbigpLFxuICBvblN1Ym1pdDogdmkuZm4oKSxcbiAgb25CYWNrOiB2aS5mbigpLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnUHJvY2Vzc0RvY3VtZW50cycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgLy8gUmVzZXQgbW9jayB2YWx1ZXNcbiAgICBtb2NrSXNGZXRjaGluZ1BhcmFtcyA9IGZhbHNlXG4gICAgbW9ja1BhcmFtc0NvbmZpZyA9IHsgdmFyaWFibGVzOiBbXSB9XG4gICAgbW9ja0luaXRpYWxEYXRhID0ge31cbiAgICBtb2NrQ29uZmlndXJhdGlvbnMgPSBbXVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgYmFzaWMgcmVuZGVyaW5nIGZ1bmN0aW9uYWxpdHlcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc0RvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBjaGVjayBmb3IgSGVhZGVyIHRpdGxlIGZyb20gRm9ybSBjb21wb25lbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28uY2h1bmtTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEZvcm0gYW5kIEFjdGlvbnMgY29tcG9uZW50cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gY2hlY2sgZm9yIGVsZW1lbnRzIGZyb20gYm90aCBjb21wb25lbnRzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVHdvLmNodW5rU2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLmRhdGFTb3VyY2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBjb3JyZWN0IGNvbnRhaW5lciBzdHJ1Y3R1cmUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UHJvY2Vzc0RvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IG1haW5Db250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmZsZXguZmxleC1jb2wuZ2FwLXktNC5wdC00JylcbiAgICAgIGV4cGVjdChtYWluQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdkYXRhU291cmNlTm9kZUlkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3MgZGF0YVNvdXJjZU5vZGVJZCB0byB1c2VJbnB1dFZhcmlhYmxlcyBob29rJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZGF0YVNvdXJjZU5vZGVJZDogJ2N1c3RvbS1ub2RlLWlkJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHZpLm1vY2tlZCh1c2VJbnB1dFZhcmlhYmxlcykpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjdXN0b20tbm9kZS1pZCcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkYXRhU291cmNlTm9kZUlkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZGF0YVNvdXJjZU5vZGVJZDogJycgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28uY2h1bmtTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaXNSdW5uaW5nIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgcHJldmlldyBidXR0b24gd2hlbiBpc1J1bm5pbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzUnVubmluZzogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgcHJldmlld0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5wcmV2aWV3Q2h1bmtzL2kgfSlcbiAgICAgICAgZXhwZWN0KHByZXZpZXdCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBkaXNhYmxlIHByZXZpZXcgYnV0dG9uIHdoZW4gaXNSdW5uaW5nIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNSdW5uaW5nOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgcHJldmlld0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5wcmV2aWV3Q2h1bmtzL2kgfSlcbiAgICAgICAgZXhwZWN0KHByZXZpZXdCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHByb2Nlc3MgYnV0dG9uIGluIEFjdGlvbnMgd2hlbiBpc1J1bm5pbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrSXNGZXRjaGluZ1BhcmFtcyA9IGZhbHNlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNSdW5uaW5nOiB0cnVlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UHJvY2Vzc0RvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MvaSB9KVxuICAgICAgICBleHBlY3QocHJvY2Vzc0J1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdyZWYgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZXhwb3NlIHN1Ym1pdCBtZXRob2QgdmlhIHJlZicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrUmVmID0geyBjdXJyZW50OiBudWxsIH0gYXMgUmVhY3QuTXV0YWJsZVJlZk9iamVjdDx7IHN1Ym1pdDogKCkgPT4gdm9pZCB9IHwgbnVsbD5cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyByZWY6IG1vY2tSZWYgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrUmVmLmN1cnJlbnQpLm5vdC50b0JlTnVsbCgpXG4gICAgICAgIGV4cGVjdCh0eXBlb2YgbW9ja1JlZi5jdXJyZW50Py5zdWJtaXQpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblByb2Nlc3Mgd2hlbiBBY3Rpb25zIHByb2Nlc3MgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblByb2Nlc3MgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uUHJvY2VzcyB9KVxuXG4gICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MvaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25Qcm9jZXNzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQmFjayB3aGVuIEFjdGlvbnMgYmFjayBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQmFjayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25CYWNrIH0pXG5cbiAgICAgIHJlbmRlcig8UHJvY2Vzc0RvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5kYXRhU291cmNlL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQmFjaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblByZXZpZXcgd2hlbiBwcmV2aWV3IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25QcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblByZXZpZXcgfSlcblxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5wcmV2aWV3Q2h1bmtzL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblN1Ym1pdCB3aGVuIGZvcm0gaXMgc3VibWl0dGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU3VibWl0IH0pXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEhvb2sgSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdIb29rIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyB2YXJpYWJsZXMgZnJvbSB1c2VJbnB1dFZhcmlhYmxlcyB0byB1c2VJbml0aWFsRGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tWYXJpYWJsZXMgPSBbeyB2YXJpYWJsZTogJ3Rlc3RWYXInLCB0eXBlOiAndGV4dCcsIGxhYmVsOiAnVGVzdCcgfV1cbiAgICAgIG1vY2tQYXJhbXNDb25maWcgPSB7IHZhcmlhYmxlczogbW9ja1ZhcmlhYmxlcyB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHZpLm1vY2tlZCh1c2VJbml0aWFsRGF0YSkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG1vY2tWYXJpYWJsZXMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyB2YXJpYWJsZXMgZnJvbSB1c2VJbnB1dFZhcmlhYmxlcyB0byB1c2VDb25maWd1cmF0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tWYXJpYWJsZXMgPSBbeyB2YXJpYWJsZTogJ3Rlc3RWYXInLCB0eXBlOiAndGV4dCcsIGxhYmVsOiAnVGVzdCcgfV1cbiAgICAgIG1vY2tQYXJhbXNDb25maWcgPSB7IHZhcmlhYmxlczogbW9ja1ZhcmlhYmxlcyB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHZpLm1vY2tlZCh1c2VDb25maWd1cmF0aW9ucykpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG1vY2tWYXJpYWJsZXMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGVtcHR5IGFycmF5IHdoZW4gcGFyYW1zQ29uZmlnLnZhcmlhYmxlcyBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUGFyYW1zQ29uZmlnID0geyB2YXJpYWJsZXM6IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIHVua25vd25bXSB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHZpLm1vY2tlZCh1c2VJbml0aWFsRGF0YSkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgZXhwZWN0KHZpLm1vY2tlZCh1c2VDb25maWd1cmF0aW9ucykpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBlbXB0eSBhcnJheSB3aGVuIHBhcmFtc0NvbmZpZyBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUGFyYW1zQ29uZmlnID0gdW5kZWZpbmVkXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHZpLm1vY2tlZCh1c2VJbml0aWFsRGF0YSkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgZXhwZWN0KHZpLm1vY2tlZCh1c2VDb25maWd1cmF0aW9ucykpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFjdGlvbnMgcnVuRGlzYWJsZWQgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FjdGlvbnMgcnVuRGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHByb2Nlc3MgYnV0dG9uIHdoZW4gaXNGZXRjaGluZ1BhcmFtcyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzRmV0Y2hpbmdQYXJhbXMgPSB0cnVlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzUnVubmluZzogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MvaSB9KVxuICAgICAgZXhwZWN0KHByb2Nlc3NCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBwcm9jZXNzIGJ1dHRvbiB3aGVuIGlzUnVubmluZyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzRmV0Y2hpbmdQYXJhbXMgPSBmYWxzZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc1J1bm5pbmc6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MvaSB9KVxuICAgICAgZXhwZWN0KHByb2Nlc3NCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZW5hYmxlIHByb2Nlc3MgYnV0dG9uIHdoZW4gYm90aCBpc0ZldGNoaW5nUGFyYW1zIGFuZCBpc1J1bm5pbmcgYXJlIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzRmV0Y2hpbmdQYXJhbXMgPSBmYWxzZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc1J1bm5pbmc6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcHJvY2Vzc0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzL2kgfSlcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHByb2Nlc3MgYnV0dG9uIHdoZW4gYm90aCBpc0ZldGNoaW5nUGFyYW1zIGFuZCBpc1J1bm5pbmcgYXJlIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNGZXRjaGluZ1BhcmFtcyA9IHRydWVcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNSdW5uaW5nOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcHJvY2Vzc0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzL2kgfSlcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbXBvbmVudCBNZW1vaXphdGlvbiBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnQgLSB2ZXJpZnkgY29tcG9uZW50IGhhcyBtZW1vIHdyYXBwZXJcbiAgICAgIGV4cGVjdChQcm9jZXNzRG9jdW1lbnRzLiQkdHlwZW9mKS50b0JlKFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IGFmdGVyIHJlcmVuZGVyIHdpdGggc2FtZSBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcbiAgICAgIHJlcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5jaHVua1NldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiBkYXRhU291cmNlTm9kZUlkIHByb3AgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZGF0YVNvdXJjZU5vZGVJZDogJ25vZGUtMScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcbiAgICAgIGV4cGVjdCh2aS5tb2NrZWQodXNlSW5wdXRWYXJpYWJsZXMpKS50b0hhdmVCZWVuTGFzdENhbGxlZFdpdGgoJ25vZGUtMScpXG5cbiAgICAgIHJlcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gZGF0YVNvdXJjZU5vZGVJZD1cIm5vZGUtMlwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdCh2aS5tb2NrZWQodXNlSW5wdXRWYXJpYWJsZXMpKS50b0hhdmVCZWVuTGFzdENhbGxlZFdpdGgoJ25vZGUtMicpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcGFyYW1zQ29uZmlnIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUGFyYW1zQ29uZmlnID0gdW5kZWZpbmVkXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5jaHVua1NldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdmFyaWFibGVzIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1BhcmFtc0NvbmZpZyA9IHsgdmFyaWFibGVzOiBbXSB9XG4gICAgICBtb2NrQ29uZmlndXJhdGlvbnMgPSBbXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc0RvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28uY2h1bmtTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBkYXRhU291cmNlTm9kZUlkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkYXRhU291cmNlTm9kZUlkOiAnbm9kZS1pZC13aXRoLXNwZWNpYWxfY2hhcnM6MTIzJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UHJvY2Vzc0RvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdCh2aS5tb2NrZWQodXNlSW5wdXRWYXJpYWJsZXMpKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbm9kZS1pZC13aXRoLXNwZWNpYWxfY2hhcnM6MTIzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbG9uZyBkYXRhU291cmNlTm9kZUlkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ0lkID0gJ2EnLnJlcGVhdCgxMDAwKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkYXRhU291cmNlTm9kZUlkOiBsb25nSWQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QodmkubW9ja2VkKHVzZUlucHV0VmFyaWFibGVzKSkudG9IYXZlQmVlbkNhbGxlZFdpdGgobG9uZ0lkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSBjYWxsYmFja3Mgd2l0aG91dCBpbnRlcmZlcmVuY2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblByb2Nlc3MgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkJhY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBvblByZXZpZXcgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uUHJvY2Vzcywgb25CYWNrLCBvblByZXZpZXcgfSlcblxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzL2kgfSkpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuZGF0YVNvdXJjZS9pIH0pKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5wcmV2aWV3Q2h1bmtzL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUHJvY2VzcykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3Qob25CYWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvblByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIHJ1bkRpc2FibGVkIExvZ2ljIFRlc3RpbmcgKHdpdGggdGVzdC5lYWNoKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ3J1bkRpc2FibGVkIExvZ2ljJywgKCkgPT4ge1xuICAgIGNvbnN0IHJ1bkRpc2FibGVkVGVzdENhc2VzID0gW1xuICAgICAgeyBpc0ZldGNoaW5nUGFyYW1zOiBmYWxzZSwgaXNSdW5uaW5nOiBmYWxzZSwgZXhwZWN0ZWREaXNhYmxlZDogZmFsc2UgfSxcbiAgICAgIHsgaXNGZXRjaGluZ1BhcmFtczogZmFsc2UsIGlzUnVubmluZzogdHJ1ZSwgZXhwZWN0ZWREaXNhYmxlZDogdHJ1ZSB9LFxuICAgICAgeyBpc0ZldGNoaW5nUGFyYW1zOiB0cnVlLCBpc1J1bm5pbmc6IGZhbHNlLCBleHBlY3RlZERpc2FibGVkOiB0cnVlIH0sXG4gICAgICB7IGlzRmV0Y2hpbmdQYXJhbXM6IHRydWUsIGlzUnVubmluZzogdHJ1ZSwgZXhwZWN0ZWREaXNhYmxlZDogdHJ1ZSB9LFxuICAgIF1cblxuICAgIGl0LmVhY2gocnVuRGlzYWJsZWRUZXN0Q2FzZXMpKFxuICAgICAgJ3Nob3VsZCBzZXQgcHJvY2VzcyBidXR0b24gZGlzYWJsZWQ9JGV4cGVjdGVkRGlzYWJsZWQgd2hlbiBpc0ZldGNoaW5nUGFyYW1zPSRpc0ZldGNoaW5nUGFyYW1zIGFuZCBpc1J1bm5pbmc9JGlzUnVubmluZycsXG4gICAgICAoeyBpc0ZldGNoaW5nUGFyYW1zLCBpc1J1bm5pbmcsIGV4cGVjdGVkRGlzYWJsZWQgfSkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tJc0ZldGNoaW5nUGFyYW1zID0gaXNGZXRjaGluZ1BhcmFtc1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzUnVubmluZyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgcHJvY2Vzc0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzL2kgfSlcbiAgICAgICAgaWYgKGV4cGVjdGVkRGlzYWJsZWQpXG4gICAgICAgICAgZXhwZWN0KHByb2Nlc3NCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBleHBlY3QocHJvY2Vzc0J1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9LFxuICAgIClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29uZmlndXJhdGlvbiBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb25maWd1cmF0aW9uIFJlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb25maWd1cmF0aW9ucyBhcyBmb3JtIGZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tDb25maWd1cmF0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogJ3ZhcjEnLCBsYWJlbDogJ1ZhcmlhYmxlIDEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAndmFyMicsIGxhYmVsOiAnVmFyaWFibGUgMicgfSksXG4gICAgICBdXG4gICAgICBtb2NrSW5pdGlhbERhdGEgPSB7IHZhcjE6ICcnLCB2YXIyOiAnJyB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1ZhcmlhYmxlIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1ZhcmlhYmxlIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb25maWd1cmF0aW9ucyB3aXRoIGRpZmZlcmVudCBmaWVsZCB0eXBlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tDb25maWd1cmF0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB0eXBlOiBCYXNlRmllbGRUeXBlLnRleHRJbnB1dCwgdmFyaWFibGU6ICd0ZXh0VmFyJywgbGFiZWw6ICdUZXh0IEZpZWxkJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB0eXBlOiBCYXNlRmllbGRUeXBlLm51bWJlcklucHV0LCB2YXJpYWJsZTogJ251bWJlclZhcicsIGxhYmVsOiAnTnVtYmVyIEZpZWxkJyB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tJbml0aWFsRGF0YSA9IHsgdGV4dFZhcjogJycsIG51bWJlclZhcjogMCB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RleHQgRmllbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ051bWJlciBGaWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRnVsbCBJbnRlZ3JhdGlvbiBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRnVsbCBQcm9wIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIGFsbCBwcm9wcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tSZWYgPSB7IGN1cnJlbnQ6IG51bGwgfSBhcyBSZWFjdC5NdXRhYmxlUmVmT2JqZWN0PHsgc3VibWl0OiAoKSA9PiB2b2lkIH0gfCBudWxsPlxuICAgICAgbW9ja0lzRmV0Y2hpbmdQYXJhbXMgPSBmYWxzZVxuICAgICAgbW9ja1BhcmFtc0NvbmZpZyA9IHsgdmFyaWFibGVzOiBbeyB2YXJpYWJsZTogJ3Rlc3RWYXInLCB0eXBlOiAndGV4dCcsIGxhYmVsOiAnVGVzdCcgfV0gfVxuICAgICAgbW9ja0luaXRpYWxEYXRhID0geyB0ZXN0VmFyOiAnaW5pdGlhbCB2YWx1ZScgfVxuICAgICAgbW9ja0NvbmZpZ3VyYXRpb25zID0gW2NyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICd0ZXN0VmFyJywgbGFiZWw6ICdUZXN0IFZhcmlhYmxlJyB9KV1cblxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGRhdGFTb3VyY2VOb2RlSWQ6ICdmdWxsLXRlc3Qtbm9kZScsXG4gICAgICAgIHJlZjogbW9ja1JlZixcbiAgICAgICAgaXNSdW5uaW5nOiBmYWxzZSxcbiAgICAgICAgb25Qcm9jZXNzOiB2aS5mbigpLFxuICAgICAgICBvblByZXZpZXc6IHZpLmZuKCksXG4gICAgICAgIG9uU3VibWl0OiB2aS5mbigpLFxuICAgICAgICBvbkJhY2s6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5jaHVua1NldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5kYXRhU291cmNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5zYXZlQW5kUHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBWYXJpYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QobW9ja1JlZi5jdXJyZW50KS5ub3QudG9CZU51bGwoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19