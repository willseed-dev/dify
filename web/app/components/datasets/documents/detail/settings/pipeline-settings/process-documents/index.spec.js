"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const pipeline_1 = require("@/models/pipeline");
const index_1 = require("./index");
// Mock dataset detail context - required for useInputVariables hook
const mockPipelineId = 'pipeline-123';
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (selector) => selector({ dataset: { pipeline_id: mockPipelineId } }),
}));
// Mock API call for pipeline processing params
const mockParamsConfig = vi.fn();
vi.mock('@/service/use-pipeline', () => ({
    usePublishedPipelineProcessingParams: () => ({
        data: mockParamsConfig(),
        isFetching: false,
    }),
}));
// Mock Form component - internal dependencies (useAppForm, BaseField) are too complex
// Keep the mock minimal and focused on testing the integration
vi.mock('../../../../create-from-pipeline/process-documents/form', () => ({
    default: function MockForm({ ref, initialData, configurations, onSubmit, onPreview, isRunning, }) {
        // Expose submit method via ref for parent component control
        if (ref && typeof ref === 'object' && 'current' in ref) {
            ref.current = {
                submit: () => onSubmit(initialData),
            };
        }
        return (<form data-testid="process-form" onSubmit={(e) => {
                e.preventDefault();
                onSubmit(initialData);
            }}>
        {/* Render actual field labels from configurations */}
        {configurations.map((config, index) => (<div key={index} data-testid={`field-${config.variable}`}>
            <label>{config.label}</label>
            <input name={config.variable} defaultValue={String(initialData[config.variable] ?? '')} data-testid={`input-${config.variable}`}/>
          </div>))}
        <button type="button" data-testid="preview-btn" onClick={onPreview} disabled={isRunning}>
          Preview
        </button>
      </form>);
    },
}));
// Test utilities
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});
const renderWithProviders = (ui) => {
    const queryClient = createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
      {ui}
    </react_query_1.QueryClientProvider>);
};
// Factory function for creating mock variables - matches RAGPipelineVariable type
const createMockVariable = (overrides = {}) => ({
    belong_to_node_id: 'node-123',
    type: pipeline_1.PipelineInputVarType.textInput,
    variable: 'test_var',
    label: 'Test Variable',
    required: false,
    ...overrides,
});
// Default props factory
const createDefaultProps = (overrides = {}) => ({
    datasourceNodeId: 'node-123',
    lastRunInputData: {},
    isRunning: false,
    ref: { current: null },
    onProcess: vi.fn(),
    onPreview: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
});
describe('ProcessDocuments', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default: return empty variables
        mockParamsConfig.mockReturnValue({ variables: [] });
    });
    // ==================== Rendering Tests ====================
    // Test basic rendering and component structure
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - verify both Form and Actions are rendered
            expect(react_1.screen.getByTestId('process-form')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' })).toBeInTheDocument();
        });
        it('should render with correct container structure', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-y-4', 'pt-4');
        });
        it('should render form fields based on variables configuration', () => {
            // Arrange
            const variables = [
                createMockVariable({ variable: 'chunk_size', label: 'Chunk Size', type: pipeline_1.PipelineInputVarType.number }),
                createMockVariable({ variable: 'separator', label: 'Separator', type: pipeline_1.PipelineInputVarType.textInput }),
            ];
            mockParamsConfig.mockReturnValue({ variables });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - real hooks transform variables to configurations
            expect(react_1.screen.getByTestId('field-chunk_size')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-separator')).toBeInTheDocument();
            expect(react_1.screen.getByText('Chunk Size')).toBeInTheDocument();
            expect(react_1.screen.getByText('Separator')).toBeInTheDocument();
        });
    });
    // ==================== Props Testing ====================
    // Test how component behaves with different prop values
    describe('Props', () => {
        describe('lastRunInputData', () => {
            it('should use lastRunInputData as initial form values', () => {
                // Arrange
                const variables = [
                    createMockVariable({ variable: 'chunk_size', label: 'Chunk Size', type: pipeline_1.PipelineInputVarType.number, default_value: '100' }),
                ];
                mockParamsConfig.mockReturnValue({ variables });
                const lastRunInputData = { chunk_size: 500 };
                const props = createDefaultProps({ lastRunInputData });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert - lastRunInputData should override default_value
                const input = react_1.screen.getByTestId('input-chunk_size');
                expect(input.defaultValue).toBe('500');
            });
            it('should use default_value when lastRunInputData is empty', () => {
                // Arrange
                const variables = [
                    createMockVariable({ variable: 'chunk_size', label: 'Chunk Size', type: pipeline_1.PipelineInputVarType.number, default_value: '100' }),
                ];
                mockParamsConfig.mockReturnValue({ variables });
                const props = createDefaultProps({ lastRunInputData: {} });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert
                const input = react_1.screen.getByTestId('input-chunk_size');
                expect(input.value).toBe('100');
            });
        });
        describe('isRunning', () => {
            it('should enable Actions button when isRunning is false', () => {
                // Arrange
                const props = createDefaultProps({ isRunning: false });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert
                const processButton = react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' });
                expect(processButton).not.toBeDisabled();
            });
            it('should disable Actions button when isRunning is true', () => {
                // Arrange
                const props = createDefaultProps({ isRunning: true });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert
                const processButton = react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' });
                expect(processButton).toBeDisabled();
            });
            it('should disable preview button when isRunning is true', () => {
                // Arrange
                const props = createDefaultProps({ isRunning: true });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('preview-btn')).toBeDisabled();
            });
        });
        describe('ref', () => {
            it('should expose submit method via ref', () => {
                // Arrange
                const ref = { current: null };
                const onSubmit = vi.fn();
                const props = createDefaultProps({ ref, onSubmit });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert
                expect(ref.current).not.toBeNull();
                expect(typeof ref.current?.submit).toBe('function');
                // Act - call submit via ref
                ref.current?.submit();
                // Assert - onSubmit should be called
                expect(onSubmit).toHaveBeenCalled();
            });
        });
    });
    // ==================== User Interactions ====================
    // Test event handlers and user interactions
    describe('User Interactions', () => {
        describe('onProcess', () => {
            it('should call onProcess when Save and Process button is clicked', () => {
                // Arrange
                const onProcess = vi.fn();
                const props = createDefaultProps({ onProcess });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' }));
                // Assert
                expect(onProcess).toHaveBeenCalledTimes(1);
            });
            it('should not call onProcess when button is disabled due to isRunning', () => {
                // Arrange
                const onProcess = vi.fn();
                const props = createDefaultProps({ onProcess, isRunning: true });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' }));
                // Assert
                expect(onProcess).not.toHaveBeenCalled();
            });
        });
        describe('onPreview', () => {
            it('should call onPreview when preview button is clicked', () => {
                // Arrange
                const onPreview = vi.fn();
                const props = createDefaultProps({ onPreview });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('preview-btn'));
                // Assert
                expect(onPreview).toHaveBeenCalledTimes(1);
            });
        });
        describe('onSubmit', () => {
            it('should call onSubmit with form data when form is submitted', () => {
                // Arrange
                const variables = [
                    createMockVariable({ variable: 'chunk_size', label: 'Chunk Size', type: pipeline_1.PipelineInputVarType.number, default_value: '100' }),
                ];
                mockParamsConfig.mockReturnValue({ variables });
                const onSubmit = vi.fn();
                const props = createDefaultProps({ onSubmit });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                react_1.fireEvent.submit(react_1.screen.getByTestId('process-form'));
                // Assert - should submit with initial data transformed by real hooks
                // Note: default_value is string type, so the value remains as string
                expect(onSubmit).toHaveBeenCalledWith({ chunk_size: '100' });
            });
        });
    });
    // ==================== Data Transformation Tests ====================
    // Test real hooks transform data correctly
    describe('Data Transformation', () => {
        it('should transform text-input variable to string initial value', () => {
            // Arrange
            const variables = [
                createMockVariable({ variable: 'name', label: 'Name', type: pipeline_1.PipelineInputVarType.textInput, default_value: 'default' }),
            ];
            mockParamsConfig.mockReturnValue({ variables });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByTestId('input-name');
            expect(input.defaultValue).toBe('default');
        });
        it('should transform number variable to number initial value', () => {
            // Arrange
            const variables = [
                createMockVariable({ variable: 'count', label: 'Count', type: pipeline_1.PipelineInputVarType.number, default_value: '42' }),
            ];
            mockParamsConfig.mockReturnValue({ variables });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByTestId('input-count');
            expect(input.defaultValue).toBe('42');
        });
        it('should use empty string for text-input without default value', () => {
            // Arrange
            const variables = [
                createMockVariable({ variable: 'name', label: 'Name', type: pipeline_1.PipelineInputVarType.textInput }),
            ];
            mockParamsConfig.mockReturnValue({ variables });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByTestId('input-name');
            expect(input.defaultValue).toBe('');
        });
        it('should prioritize lastRunInputData over default_value', () => {
            // Arrange
            const variables = [
                createMockVariable({ variable: 'size', label: 'Size', type: pipeline_1.PipelineInputVarType.number, default_value: '100' }),
            ];
            mockParamsConfig.mockReturnValue({ variables });
            const props = createDefaultProps({ lastRunInputData: { size: 999 } });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const input = react_1.screen.getByTestId('input-size');
            expect(input.defaultValue).toBe('999');
        });
    });
    // ==================== Edge Cases ====================
    // Test boundary conditions and error handling
    describe('Edge Cases', () => {
        describe('Empty/Null data handling', () => {
            it('should handle undefined paramsConfig.variables', () => {
                // Arrange
                mockParamsConfig.mockReturnValue({ variables: undefined });
                const props = createDefaultProps();
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert - should render without fields
                expect(react_1.screen.getByTestId('process-form')).toBeInTheDocument();
                expect(react_1.screen.queryByTestId(/^field-/)).not.toBeInTheDocument();
            });
            it('should handle null paramsConfig', () => {
                // Arrange
                mockParamsConfig.mockReturnValue(null);
                const props = createDefaultProps();
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('process-form')).toBeInTheDocument();
            });
            it('should handle empty variables array', () => {
                // Arrange
                mockParamsConfig.mockReturnValue({ variables: [] });
                const props = createDefaultProps();
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('process-form')).toBeInTheDocument();
                expect(react_1.screen.queryByTestId(/^field-/)).not.toBeInTheDocument();
            });
        });
        describe('Multiple variables', () => {
            it('should handle multiple variables of different types', () => {
                // Arrange
                const variables = [
                    createMockVariable({ variable: 'text_field', label: 'Text', type: pipeline_1.PipelineInputVarType.textInput, default_value: 'hello' }),
                    createMockVariable({ variable: 'number_field', label: 'Number', type: pipeline_1.PipelineInputVarType.number, default_value: '123' }),
                    createMockVariable({ variable: 'select_field', label: 'Select', type: pipeline_1.PipelineInputVarType.select, default_value: 'option1' }),
                ];
                mockParamsConfig.mockReturnValue({ variables });
                const props = createDefaultProps();
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert - all fields should be rendered
                expect(react_1.screen.getByTestId('field-text_field')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('field-number_field')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('field-select_field')).toBeInTheDocument();
            });
            it('should submit all variables data correctly', () => {
                // Arrange
                const variables = [
                    createMockVariable({ variable: 'field1', label: 'Field 1', type: pipeline_1.PipelineInputVarType.textInput, default_value: 'value1' }),
                    createMockVariable({ variable: 'field2', label: 'Field 2', type: pipeline_1.PipelineInputVarType.number, default_value: '42' }),
                ];
                mockParamsConfig.mockReturnValue({ variables });
                const onSubmit = vi.fn();
                const props = createDefaultProps({ onSubmit });
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                react_1.fireEvent.submit(react_1.screen.getByTestId('process-form'));
                // Assert - default_value is string type, so values remain as strings
                expect(onSubmit).toHaveBeenCalledWith({
                    field1: 'value1',
                    field2: '42',
                });
            });
        });
        describe('Variable with options (select type)', () => {
            it('should handle select variable with options', () => {
                // Arrange
                const variables = [
                    createMockVariable({
                        variable: 'mode',
                        label: 'Mode',
                        type: pipeline_1.PipelineInputVarType.select,
                        options: ['auto', 'manual', 'custom'],
                        default_value: 'auto',
                    }),
                ];
                mockParamsConfig.mockReturnValue({ variables });
                const props = createDefaultProps();
                // Act
                renderWithProviders(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('field-mode')).toBeInTheDocument();
                const input = react_1.screen.getByTestId('input-mode');
                expect(input.defaultValue).toBe('auto');
            });
        });
    });
    // ==================== Integration Tests ====================
    // Test Form and Actions components work together with real hooks
    describe('Integration', () => {
        it('should coordinate form submission flow correctly', () => {
            // Arrange
            const variables = [
                createMockVariable({ variable: 'setting', label: 'Setting', type: pipeline_1.PipelineInputVarType.textInput, default_value: 'initial' }),
            ];
            mockParamsConfig.mockReturnValue({ variables });
            const onProcess = vi.fn();
            const onSubmit = vi.fn();
            const props = createDefaultProps({ onProcess, onSubmit });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - form is rendered with correct initial data
            const input = react_1.screen.getByTestId('input-setting');
            expect(input.defaultValue).toBe('initial');
            // Act - click process button
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' }));
            // Assert - onProcess is called
            expect(onProcess).toHaveBeenCalled();
        });
        it('should render complete UI with all interactive elements', () => {
            // Arrange
            const variables = [
                createMockVariable({ variable: 'test', label: 'Test Field', type: pipeline_1.PipelineInputVarType.textInput }),
            ];
            mockParamsConfig.mockReturnValue({ variables });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - all UI elements are present
            expect(react_1.screen.getByTestId('process-form')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test Field')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('preview-btn')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' })).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdURBQXdFO0FBQ3hFLGtEQUFrRTtBQUNsRSxnREFBd0Q7QUFDeEQsbUNBQXNDO0FBRXRDLG9FQUFvRTtBQUNwRSxNQUFNLGNBQWMsR0FBRyxjQUFjLENBQUE7QUFDckMsRUFBRSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLG1DQUFtQyxFQUFFLENBQUMsUUFBaUUsRUFBRSxFQUFFLENBQ3pHLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsRUFBRSxDQUFDO0NBQ3pELENBQUMsQ0FBQyxDQUFBO0FBRUgsK0NBQStDO0FBQy9DLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ2hDLEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtRQUN4QixVQUFVLEVBQUUsS0FBSztLQUNsQixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxzRkFBc0Y7QUFDdEYsK0RBQStEO0FBQy9ELEVBQUUsQ0FBQyxJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4RSxPQUFPLEVBQUUsU0FBUyxRQUFRLENBQUMsRUFDekIsR0FBRyxFQUNILFdBQVcsRUFDWCxjQUFjLEVBQ2QsUUFBUSxFQUNSLFNBQVMsRUFDVCxTQUFTLEdBU1Y7UUFDQyw0REFBNEQ7UUFDNUQsSUFBSSxHQUFHLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLFNBQVMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUN0RCxHQUFzRCxDQUFD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QUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLDJDQUEyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0csQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSQUdQaXBlbGluZVZhcmlhYmxlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgUGlwZWxpbmVJbnB1dFZhclR5cGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCBQcm9jZXNzRG9jdW1lbnRzIGZyb20gJy4vaW5kZXgnXG5cbi8vIE1vY2sgZGF0YXNldCBkZXRhaWwgY29udGV4dCAtIHJlcXVpcmVkIGZvciB1c2VJbnB1dFZhcmlhYmxlcyBob29rXG5jb25zdCBtb2NrUGlwZWxpbmVJZCA9ICdwaXBlbGluZS0xMjMnXG52aS5tb2NrKCdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnLCAoKSA9PiAoe1xuICB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcjogKHNlbGVjdG9yOiAoc3RhdGU6IHsgZGF0YXNldDogeyBwaXBlbGluZV9pZDogc3RyaW5nIH0gfSkgPT4gc3RyaW5nKSA9PlxuICAgIHNlbGVjdG9yKHsgZGF0YXNldDogeyBwaXBlbGluZV9pZDogbW9ja1BpcGVsaW5lSWQgfSB9KSxcbn0pKVxuXG4vLyBNb2NrIEFQSSBjYWxsIGZvciBwaXBlbGluZSBwcm9jZXNzaW5nIHBhcmFtc1xuY29uc3QgbW9ja1BhcmFtc0NvbmZpZyA9IHZpLmZuKClcbnZpLm1vY2soJ0Avc2VydmljZS91c2UtcGlwZWxpbmUnLCAoKSA9PiAoe1xuICB1c2VQdWJsaXNoZWRQaXBlbGluZVByb2Nlc3NpbmdQYXJhbXM6ICgpID0+ICh7XG4gICAgZGF0YTogbW9ja1BhcmFtc0NvbmZpZygpLFxuICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIEZvcm0gY29tcG9uZW50IC0gaW50ZXJuYWwgZGVwZW5kZW5jaWVzICh1c2VBcHBGb3JtLCBCYXNlRmllbGQpIGFyZSB0b28gY29tcGxleFxuLy8gS2VlcCB0aGUgbW9jayBtaW5pbWFsIGFuZCBmb2N1c2VkIG9uIHRlc3RpbmcgdGhlIGludGVncmF0aW9uXG52aS5tb2NrKCcuLi8uLi8uLi8uLi9jcmVhdGUtZnJvbS1waXBlbGluZS9wcm9jZXNzLWRvY3VtZW50cy9mb3JtJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogZnVuY3Rpb24gTW9ja0Zvcm0oe1xuICAgIHJlZixcbiAgICBpbml0aWFsRGF0YSxcbiAgICBjb25maWd1cmF0aW9ucyxcbiAgICBvblN1Ym1pdCxcbiAgICBvblByZXZpZXcsXG4gICAgaXNSdW5uaW5nLFxuICB9OiB7XG4gICAgcmVmOiBSZWFjdC5SZWZPYmplY3Q8eyBzdWJtaXQ6ICgpID0+IHZvaWQgfT5cbiAgICBpbml0aWFsRGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICBjb25maWd1cmF0aW9uczogQXJyYXk8eyB2YXJpYWJsZTogc3RyaW5nLCBsYWJlbDogc3RyaW5nLCB0eXBlOiBzdHJpbmcgfT5cbiAgICBzY2hlbWE6IHVua25vd25cbiAgICBvblN1Ym1pdDogKGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiB2b2lkXG4gICAgb25QcmV2aWV3OiAoKSA9PiB2b2lkXG4gICAgaXNSdW5uaW5nOiBib29sZWFuXG4gIH0pIHtcbiAgICAvLyBFeHBvc2Ugc3VibWl0IG1ldGhvZCB2aWEgcmVmIGZvciBwYXJlbnQgY29tcG9uZW50IGNvbnRyb2xcbiAgICBpZiAocmVmICYmIHR5cGVvZiByZWYgPT09ICdvYmplY3QnICYmICdjdXJyZW50JyBpbiByZWYpIHtcbiAgICAgIChyZWYgYXMgUmVhY3QuTXV0YWJsZVJlZk9iamVjdDx7IHN1Ym1pdDogKCkgPT4gdm9pZCB9PikuY3VycmVudCA9IHtcbiAgICAgICAgc3VibWl0OiAoKSA9PiBvblN1Ym1pdChpbml0aWFsRGF0YSksXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybVxuICAgICAgICBkYXRhLXRlc3RpZD1cInByb2Nlc3MtZm9ybVwiXG4gICAgICAgIG9uU3VibWl0PXsoZSkgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIG9uU3VibWl0KGluaXRpYWxEYXRhKVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7LyogUmVuZGVyIGFjdHVhbCBmaWVsZCBsYWJlbHMgZnJvbSBjb25maWd1cmF0aW9ucyAqL31cbiAgICAgICAge2NvbmZpZ3VyYXRpb25zLm1hcCgoY29uZmlnLCBpbmRleCkgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXtpbmRleH0gZGF0YS10ZXN0aWQ9e2BmaWVsZC0ke2NvbmZpZy52YXJpYWJsZX1gfT5cbiAgICAgICAgICAgIDxsYWJlbD57Y29uZmlnLmxhYmVsfTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgbmFtZT17Y29uZmlnLnZhcmlhYmxlfVxuICAgICAgICAgICAgICBkZWZhdWx0VmFsdWU9e1N0cmluZyhpbml0aWFsRGF0YVtjb25maWcudmFyaWFibGVdID8/ICcnKX1cbiAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BpbnB1dC0ke2NvbmZpZy52YXJpYWJsZX1gfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtdGVzdGlkPVwicHJldmlldy1idG5cIiBvbkNsaWNrPXtvblByZXZpZXd9IGRpc2FibGVkPXtpc1J1bm5pbmd9PlxuICAgICAgICAgIFByZXZpZXdcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Zvcm0+XG4gICAgKVxuICB9LFxufSkpXG5cbi8vIFRlc3QgdXRpbGl0aWVzXG5jb25zdCBjcmVhdGVRdWVyeUNsaWVudCA9ICgpID0+XG4gIG5ldyBRdWVyeUNsaWVudCh7XG4gICAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICAgIHF1ZXJpZXM6IHsgcmV0cnk6IGZhbHNlIH0sXG4gICAgICBtdXRhdGlvbnM6IHsgcmV0cnk6IGZhbHNlIH0sXG4gICAgfSxcbiAgfSlcblxuY29uc3QgcmVuZGVyV2l0aFByb3ZpZGVycyA9ICh1aTogUmVhY3QuUmVhY3RFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gY3JlYXRlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gcmVuZGVyKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAge3VpfVxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gIClcbn1cblxuLy8gRmFjdG9yeSBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgbW9jayB2YXJpYWJsZXMgLSBtYXRjaGVzIFJBR1BpcGVsaW5lVmFyaWFibGUgdHlwZVxuY29uc3QgY3JlYXRlTW9ja1ZhcmlhYmxlID0gKG92ZXJyaWRlczogUGFydGlhbDxSQUdQaXBlbGluZVZhcmlhYmxlPiA9IHt9KTogUkFHUGlwZWxpbmVWYXJpYWJsZSA9PiAoe1xuICBiZWxvbmdfdG9fbm9kZV9pZDogJ25vZGUtMTIzJyxcbiAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgbGFiZWw6ICdUZXN0IFZhcmlhYmxlJyxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBEZWZhdWx0IHByb3BzIGZhY3RvcnlcbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM6IFBhcnRpYWw8e1xuICBkYXRhc291cmNlTm9kZUlkOiBzdHJpbmdcbiAgbGFzdFJ1bklucHV0RGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgaXNSdW5uaW5nOiBib29sZWFuXG4gIHJlZjogUmVhY3QuUmVmT2JqZWN0PHsgc3VibWl0OiAoKSA9PiB2b2lkIH0gfCBudWxsPlxuICBvblByb2Nlc3M6ICgpID0+IHZvaWRcbiAgb25QcmV2aWV3OiAoKSA9PiB2b2lkXG4gIG9uU3VibWl0OiAoZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHZvaWRcbn0+ID0ge30pID0+ICh7XG4gIGRhdGFzb3VyY2VOb2RlSWQ6ICdub2RlLTEyMycsXG4gIGxhc3RSdW5JbnB1dERhdGE6IHt9LFxuICBpc1J1bm5pbmc6IGZhbHNlLFxuICByZWY6IHsgY3VycmVudDogbnVsbCB9IGFzIFJlYWN0LlJlZk9iamVjdDx7IHN1Ym1pdDogKCkgPT4gdm9pZCB9IHwgbnVsbD4sXG4gIG9uUHJvY2VzczogdmkuZm4oKSxcbiAgb25QcmV2aWV3OiB2aS5mbigpLFxuICBvblN1Ym1pdDogdmkuZm4oKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuZGVzY3JpYmUoJ1Byb2Nlc3NEb2N1bWVudHMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIC8vIERlZmF1bHQ6IHJldHVybiBlbXB0eSB2YXJpYWJsZXNcbiAgICBtb2NrUGFyYW1zQ29uZmlnLm1vY2tSZXR1cm5WYWx1ZSh7IHZhcmlhYmxlczogW10gfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBSZW5kZXJpbmcgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGVzdCBiYXNpYyByZW5kZXJpbmcgYW5kIGNvbXBvbmVudCBzdHJ1Y3R1cmVcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gdmVyaWZ5IGJvdGggRm9ybSBhbmQgQWN0aW9ucyBhcmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Byb2Nlc3MtZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggY29ycmVjdCBjb250YWluZXIgc3RydWN0dXJlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qod3JhcHBlcikudG9IYXZlQ2xhc3MoJ2ZsZXgnLCAnZmxleC1jb2wnLCAnZ2FwLXktNCcsICdwdC00JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZm9ybSBmaWVsZHMgYmFzZWQgb24gdmFyaWFibGVzIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVbXSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHsgdmFyaWFibGU6ICdjaHVua19zaXplJywgbGFiZWw6ICdDaHVuayBTaXplJywgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyIH0pLFxuICAgICAgICBjcmVhdGVNb2NrVmFyaWFibGUoeyB2YXJpYWJsZTogJ3NlcGFyYXRvcicsIGxhYmVsOiAnU2VwYXJhdG9yJywgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0IH0pLFxuICAgICAgXVxuICAgICAgbW9ja1BhcmFtc0NvbmZpZy5tb2NrUmV0dXJuVmFsdWUoeyB2YXJpYWJsZXMgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIHJlYWwgaG9va3MgdHJhbnNmb3JtIHZhcmlhYmxlcyB0byBjb25maWd1cmF0aW9uc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtY2h1bmtfc2l6ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1zZXBhcmF0b3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NodW5rIFNpemUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlcGFyYXRvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBQcm9wcyBUZXN0aW5nID09PT09PT09PT09PT09PT09PT09XG4gIC8vIFRlc3QgaG93IGNvbXBvbmVudCBiZWhhdmVzIHdpdGggZGlmZmVyZW50IHByb3AgdmFsdWVzXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnbGFzdFJ1bklucHV0RGF0YScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGxhc3RSdW5JbnB1dERhdGEgYXMgaW5pdGlhbCBmb3JtIHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCB2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVbXSA9IFtcbiAgICAgICAgICBjcmVhdGVNb2NrVmFyaWFibGUoeyB2YXJpYWJsZTogJ2NodW5rX3NpemUnLCBsYWJlbDogJ0NodW5rIFNpemUnLCB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5udW1iZXIsIGRlZmF1bHRfdmFsdWU6ICcxMDAnIH0pLFxuICAgICAgICBdXG4gICAgICAgIG1vY2tQYXJhbXNDb25maWcubW9ja1JldHVyblZhbHVlKHsgdmFyaWFibGVzIH0pXG4gICAgICAgIGNvbnN0IGxhc3RSdW5JbnB1dERhdGEgPSB7IGNodW5rX3NpemU6IDUwMCB9XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgbGFzdFJ1bklucHV0RGF0YSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gbGFzdFJ1bklucHV0RGF0YSBzaG91bGQgb3ZlcnJpZGUgZGVmYXVsdF92YWx1ZVxuICAgICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtY2h1bmtfc2l6ZScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgICAgZXhwZWN0KGlucHV0LmRlZmF1bHRWYWx1ZSkudG9CZSgnNTAwJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIGRlZmF1bHRfdmFsdWUgd2hlbiBsYXN0UnVuSW5wdXREYXRhIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZVtdID0gW1xuICAgICAgICAgIGNyZWF0ZU1vY2tWYXJpYWJsZSh7IHZhcmlhYmxlOiAnY2h1bmtfc2l6ZScsIGxhYmVsOiAnQ2h1bmsgU2l6ZScsIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlciwgZGVmYXVsdF92YWx1ZTogJzEwMCcgfSksXG4gICAgICAgIF1cbiAgICAgICAgbW9ja1BhcmFtc0NvbmZpZy5tb2NrUmV0dXJuVmFsdWUoeyB2YXJpYWJsZXMgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBsYXN0UnVuSW5wdXREYXRhOiB7fSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1jaHVua19zaXplJykgYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgICBleHBlY3QoaW5wdXQudmFsdWUpLnRvQmUoJzEwMCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaXNSdW5uaW5nJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBlbmFibGUgQWN0aW9ucyBidXR0b24gd2hlbiBpc1J1bm5pbmcgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc1J1bm5pbmc6IGZhbHNlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgcHJvY2Vzc0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzJyB9KVxuICAgICAgICBleHBlY3QocHJvY2Vzc0J1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgQWN0aW9ucyBidXR0b24gd2hlbiBpc1J1bm5pbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzUnVubmluZzogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5zYXZlQW5kUHJvY2VzcycgfSlcbiAgICAgICAgZXhwZWN0KHByb2Nlc3NCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgcHJldmlldyBidXR0b24gd2hlbiBpc1J1bm5pbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzUnVubmluZzogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctYnRuJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgncmVmJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBleHBvc2Ugc3VibWl0IG1ldGhvZCB2aWEgcmVmJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHJlZiA9IHsgY3VycmVudDogbnVsbCB9IGFzIFJlYWN0LlJlZk9iamVjdDx7IHN1Ym1pdDogKCkgPT4gdm9pZCB9IHwgbnVsbD5cbiAgICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcmVmLCBvblN1Ym1pdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChyZWYuY3VycmVudCkubm90LnRvQmVOdWxsKClcbiAgICAgICAgZXhwZWN0KHR5cGVvZiByZWYuY3VycmVudD8uc3VibWl0KS50b0JlKCdmdW5jdGlvbicpXG5cbiAgICAgICAgLy8gQWN0IC0gY2FsbCBzdWJtaXQgdmlhIHJlZlxuICAgICAgICByZWYuY3VycmVudD8uc3VibWl0KClcblxuICAgICAgICAvLyBBc3NlcnQgLSBvblN1Ym1pdCBzaG91bGQgYmUgY2FsbGVkXG4gICAgICAgIGV4cGVjdChvblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gVXNlciBJbnRlcmFjdGlvbnMgPT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGVzdCBldmVudCBoYW5kbGVycyBhbmQgdXNlciBpbnRlcmFjdGlvbnNcbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdvblByb2Nlc3MnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25Qcm9jZXNzIHdoZW4gU2F2ZSBhbmQgUHJvY2VzcyBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvblByb2Nlc3MgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25Qcm9jZXNzIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzJyB9KSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uUHJvY2VzcykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uUHJvY2VzcyB3aGVuIGJ1dHRvbiBpcyBkaXNhYmxlZCBkdWUgdG8gaXNSdW5uaW5nJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uUHJvY2VzcyA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblByb2Nlc3MsIGlzUnVubmluZzogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5zYXZlQW5kUHJvY2VzcycgfSkpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvblByb2Nlc3MpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvblByZXZpZXcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25QcmV2aWV3IHdoZW4gcHJldmlldyBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvblByZXZpZXcgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25QcmV2aWV3IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJldmlldy1idG4nKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnb25TdWJtaXQnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25TdWJtaXQgd2l0aCBmb3JtIGRhdGEgd2hlbiBmb3JtIGlzIHN1Ym1pdHRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCB2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVbXSA9IFtcbiAgICAgICAgICBjcmVhdGVNb2NrVmFyaWFibGUoeyB2YXJpYWJsZTogJ2NodW5rX3NpemUnLCBsYWJlbDogJ0NodW5rIFNpemUnLCB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5udW1iZXIsIGRlZmF1bHRfdmFsdWU6ICcxMDAnIH0pLFxuICAgICAgICBdXG4gICAgICAgIG1vY2tQYXJhbXNDb25maWcubW9ja1JldHVyblZhbHVlKHsgdmFyaWFibGVzIH0pXG4gICAgICAgIGNvbnN0IG9uU3VibWl0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU3VibWl0IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LnN1Ym1pdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Byb2Nlc3MtZm9ybScpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBzdWJtaXQgd2l0aCBpbml0aWFsIGRhdGEgdHJhbnNmb3JtZWQgYnkgcmVhbCBob29rc1xuICAgICAgICAvLyBOb3RlOiBkZWZhdWx0X3ZhbHVlIGlzIHN0cmluZyB0eXBlLCBzbyB0aGUgdmFsdWUgcmVtYWlucyBhcyBzdHJpbmdcbiAgICAgICAgZXhwZWN0KG9uU3VibWl0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IGNodW5rX3NpemU6ICcxMDAnIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRGF0YSBUcmFuc2Zvcm1hdGlvbiBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUZXN0IHJlYWwgaG9va3MgdHJhbnNmb3JtIGRhdGEgY29ycmVjdGx5XG4gIGRlc2NyaWJlKCdEYXRhIFRyYW5zZm9ybWF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdHJhbnNmb3JtIHRleHQtaW5wdXQgdmFyaWFibGUgdG8gc3RyaW5nIGluaXRpYWwgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVbXSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHsgdmFyaWFibGU6ICduYW1lJywgbGFiZWw6ICdOYW1lJywgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LCBkZWZhdWx0X3ZhbHVlOiAnZGVmYXVsdCcgfSksXG4gICAgICBdXG4gICAgICBtb2NrUGFyYW1zQ29uZmlnLm1vY2tSZXR1cm5WYWx1ZSh7IHZhcmlhYmxlcyB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtbmFtZScpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIGV4cGVjdChpbnB1dC5kZWZhdWx0VmFsdWUpLnRvQmUoJ2RlZmF1bHQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyYW5zZm9ybSBudW1iZXIgdmFyaWFibGUgdG8gbnVtYmVyIGluaXRpYWwgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVbXSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHsgdmFyaWFibGU6ICdjb3VudCcsIGxhYmVsOiAnQ291bnQnLCB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5udW1iZXIsIGRlZmF1bHRfdmFsdWU6ICc0MicgfSksXG4gICAgICBdXG4gICAgICBtb2NrUGFyYW1zQ29uZmlnLm1vY2tSZXR1cm5WYWx1ZSh7IHZhcmlhYmxlcyB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtY291bnQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICBleHBlY3QoaW5wdXQuZGVmYXVsdFZhbHVlKS50b0JlKCc0MicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGVtcHR5IHN0cmluZyBmb3IgdGV4dC1pbnB1dCB3aXRob3V0IGRlZmF1bHQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVbXSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHsgdmFyaWFibGU6ICduYW1lJywgbGFiZWw6ICdOYW1lJywgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0IH0pLFxuICAgICAgXVxuICAgICAgbW9ja1BhcmFtc0NvbmZpZy5tb2NrUmV0dXJuVmFsdWUoeyB2YXJpYWJsZXMgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lucHV0LW5hbWUnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICBleHBlY3QoaW5wdXQuZGVmYXVsdFZhbHVlKS50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByaW9yaXRpemUgbGFzdFJ1bklucHV0RGF0YSBvdmVyIGRlZmF1bHRfdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVbXSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHsgdmFyaWFibGU6ICdzaXplJywgbGFiZWw6ICdTaXplJywgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLCBkZWZhdWx0X3ZhbHVlOiAnMTAwJyB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tQYXJhbXNDb25maWcubW9ja1JldHVyblZhbHVlKHsgdmFyaWFibGVzIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGxhc3RSdW5JbnB1dERhdGE6IHsgc2l6ZTogOTk5IH0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lucHV0LXNpemUnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICBleHBlY3QoaW5wdXQuZGVmYXVsdFZhbHVlKS50b0JlKCc5OTknKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRWRnZSBDYXNlcyA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUZXN0IGJvdW5kYXJ5IGNvbmRpdGlvbnMgYW5kIGVycm9yIGhhbmRsaW5nXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdFbXB0eS9OdWxsIGRhdGEgaGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcGFyYW1zQ29uZmlnLnZhcmlhYmxlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUGFyYW1zQ29uZmlnLm1vY2tSZXR1cm5WYWx1ZSh7IHZhcmlhYmxlczogdW5kZWZpbmVkIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJvY2Vzc0RvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZW5kZXIgd2l0aG91dCBmaWVsZHNcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncHJvY2Vzcy1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKC9eZmllbGQtLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIHBhcmFtc0NvbmZpZycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUGFyYW1zQ29uZmlnLm1vY2tSZXR1cm5WYWx1ZShudWxsKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncHJvY2Vzcy1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHZhcmlhYmxlcyBhcnJheScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUGFyYW1zQ29uZmlnLm1vY2tSZXR1cm5WYWx1ZSh7IHZhcmlhYmxlczogW10gfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Byb2Nlc3MtZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgvXmZpZWxkLS8pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ011bHRpcGxlIHZhcmlhYmxlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIHZhcmlhYmxlcyBvZiBkaWZmZXJlbnQgdHlwZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgdmFyaWFibGVzOiBSQUdQaXBlbGluZVZhcmlhYmxlW10gPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHsgdmFyaWFibGU6ICd0ZXh0X2ZpZWxkJywgbGFiZWw6ICdUZXh0JywgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LCBkZWZhdWx0X3ZhbHVlOiAnaGVsbG8nIH0pLFxuICAgICAgICAgIGNyZWF0ZU1vY2tWYXJpYWJsZSh7IHZhcmlhYmxlOiAnbnVtYmVyX2ZpZWxkJywgbGFiZWw6ICdOdW1iZXInLCB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5udW1iZXIsIGRlZmF1bHRfdmFsdWU6ICcxMjMnIH0pLFxuICAgICAgICAgIGNyZWF0ZU1vY2tWYXJpYWJsZSh7IHZhcmlhYmxlOiAnc2VsZWN0X2ZpZWxkJywgbGFiZWw6ICdTZWxlY3QnLCB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5zZWxlY3QsIGRlZmF1bHRfdmFsdWU6ICdvcHRpb24xJyB9KSxcbiAgICAgICAgXVxuICAgICAgICBtb2NrUGFyYW1zQ29uZmlnLm1vY2tSZXR1cm5WYWx1ZSh7IHZhcmlhYmxlcyB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBhbGwgZmllbGRzIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC10ZXh0X2ZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbnVtYmVyX2ZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtc2VsZWN0X2ZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc3VibWl0IGFsbCB2YXJpYWJsZXMgZGF0YSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgdmFyaWFibGVzOiBSQUdQaXBlbGluZVZhcmlhYmxlW10gPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHsgdmFyaWFibGU6ICdmaWVsZDEnLCBsYWJlbDogJ0ZpZWxkIDEnLCB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsIGRlZmF1bHRfdmFsdWU6ICd2YWx1ZTEnIH0pLFxuICAgICAgICAgIGNyZWF0ZU1vY2tWYXJpYWJsZSh7IHZhcmlhYmxlOiAnZmllbGQyJywgbGFiZWw6ICdGaWVsZCAyJywgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLCBkZWZhdWx0X3ZhbHVlOiAnNDInIH0pLFxuICAgICAgICBdXG4gICAgICAgIG1vY2tQYXJhbXNDb25maWcubW9ja1JldHVyblZhbHVlKHsgdmFyaWFibGVzIH0pXG4gICAgICAgIGNvbnN0IG9uU3VibWl0ID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU3VibWl0IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LnN1Ym1pdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Byb2Nlc3MtZm9ybScpKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGRlZmF1bHRfdmFsdWUgaXMgc3RyaW5nIHR5cGUsIHNvIHZhbHVlcyByZW1haW4gYXMgc3RyaW5nc1xuICAgICAgICBleHBlY3Qob25TdWJtaXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBmaWVsZDE6ICd2YWx1ZTEnLFxuICAgICAgICAgIGZpZWxkMjogJzQyJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdWYXJpYWJsZSB3aXRoIG9wdGlvbnMgKHNlbGVjdCB0eXBlKScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHNlbGVjdCB2YXJpYWJsZSB3aXRoIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgdmFyaWFibGVzOiBSQUdQaXBlbGluZVZhcmlhYmxlW10gPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnbW9kZScsXG4gICAgICAgICAgICBsYWJlbDogJ01vZGUnLFxuICAgICAgICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0LFxuICAgICAgICAgICAgb3B0aW9uczogWydhdXRvJywgJ21hbnVhbCcsICdjdXN0b20nXSxcbiAgICAgICAgICAgIGRlZmF1bHRfdmFsdWU6ICdhdXRvJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXVxuICAgICAgICBtb2NrUGFyYW1zQ29uZmlnLm1vY2tSZXR1cm5WYWx1ZSh7IHZhcmlhYmxlcyB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbW9kZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1tb2RlJykgYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgICBleHBlY3QoaW5wdXQuZGVmYXVsdFZhbHVlKS50b0JlKCdhdXRvJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBJbnRlZ3JhdGlvbiBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUZXN0IEZvcm0gYW5kIEFjdGlvbnMgY29tcG9uZW50cyB3b3JrIHRvZ2V0aGVyIHdpdGggcmVhbCBob29rc1xuICBkZXNjcmliZSgnSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb29yZGluYXRlIGZvcm0gc3VibWlzc2lvbiBmbG93IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZVtdID0gW1xuICAgICAgICBjcmVhdGVNb2NrVmFyaWFibGUoeyB2YXJpYWJsZTogJ3NldHRpbmcnLCBsYWJlbDogJ1NldHRpbmcnLCB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsIGRlZmF1bHRfdmFsdWU6ICdpbml0aWFsJyB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tQYXJhbXNDb25maWcubW9ja1JldHVyblZhbHVlKHsgdmFyaWFibGVzIH0pXG4gICAgICBjb25zdCBvblByb2Nlc3MgPSB2aS5mbigpXG4gICAgICBjb25zdCBvblN1Ym1pdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25Qcm9jZXNzLCBvblN1Ym1pdCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gZm9ybSBpcyByZW5kZXJlZCB3aXRoIGNvcnJlY3QgaW5pdGlhbCBkYXRhXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtc2V0dGluZycpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIGV4cGVjdChpbnB1dC5kZWZhdWx0VmFsdWUpLnRvQmUoJ2luaXRpYWwnKVxuXG4gICAgICAvLyBBY3QgLSBjbGljayBwcm9jZXNzIGJ1dHRvblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzJyB9KSlcblxuICAgICAgLy8gQXNzZXJ0IC0gb25Qcm9jZXNzIGlzIGNhbGxlZFxuICAgICAgZXhwZWN0KG9uUHJvY2VzcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbXBsZXRlIFVJIHdpdGggYWxsIGludGVyYWN0aXZlIGVsZW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdmFyaWFibGVzOiBSQUdQaXBlbGluZVZhcmlhYmxlW10gPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tWYXJpYWJsZSh7IHZhcmlhYmxlOiAndGVzdCcsIGxhYmVsOiAnVGVzdCBGaWVsZCcsIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tQYXJhbXNDb25maWcubW9ja1JldHVyblZhbHVlKHsgdmFyaWFibGVzIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJvY2Vzc0RvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBhbGwgVUkgZWxlbWVudHMgYXJlIHByZXNlbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Byb2Nlc3MtZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBGaWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwcmV2aWV3LWJ0bicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=