"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const React = require("react");
const pipeline_1 = require("@/models/pipeline");
const index_1 = require("./index");
const utils_1 = require("./utils");
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock useFloatingRight hook
const mockUseFloatingRight = vi.fn(() => ({
    floatingRight: false,
    floatingRightWidth: 400,
}));
vi.mock('../hooks', () => ({
    useFloatingRight: () => mockUseFloatingRight(),
}));
// Mock InputFieldForm component
vi.mock('./form', () => ({
    default: ({ initialData, supportFile, onCancel, onSubmit, isEditMode, }) => (<div data-testid="input-field-form">
      <span data-testid="form-initial-data">{JSON.stringify(initialData)}</span>
      <span data-testid="form-support-file">{String(supportFile)}</span>
      <span data-testid="form-is-edit-mode">{String(isEditMode)}</span>
      <button data-testid="form-cancel-btn" onClick={onCancel}>Cancel</button>
      <button data-testid="form-submit-btn" onClick={() => onSubmit(initialData)}>
        Submit
      </button>
    </div>),
}));
// Mock file upload config service
vi.mock('@/service/use-common', () => ({
    useFileUploadConfig: () => ({
        data: {
            image_file_size_limit: 10,
            file_size_limit: 15,
            audio_file_size_limit: 50,
            video_file_size_limit: 100,
            workflow_file_upload_limit: 10,
        },
        isLoading: false,
        error: null,
    }),
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createInputVar = (overrides) => ({
    type: pipeline_1.PipelineInputVarType.textInput,
    label: 'Test Label',
    variable: 'test_variable',
    max_length: 48,
    default_value: '',
    required: true,
    tooltips: '',
    options: [],
    placeholder: '',
    unit: '',
    allowed_file_upload_methods: [],
    allowed_file_types: [],
    allowed_file_extensions: [],
    ...overrides,
});
const createFormData = (overrides) => ({
    type: pipeline_1.PipelineInputVarType.textInput,
    label: 'Test Label',
    variable: 'test_variable',
    maxLength: 48,
    default: '',
    required: true,
    tooltips: '',
    options: [],
    placeholder: '',
    unit: '',
    allowedFileUploadMethods: [],
    allowedTypesAndExtensions: {
        allowedFileTypes: [],
        allowedFileExtensions: [],
    },
    ...overrides,
});
const createInputFieldEditorProps = (overrides) => ({
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    ...overrides,
});
// ============================================================================
// Test Wrapper Component
// ============================================================================
const createTestQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            gcTime: 0,
        },
    },
});
const TestWrapper = ({ children }) => {
    const queryClient = createTestQueryClient();
    return (<react_query_1.QueryClientProvider client={queryClient}>{children}</react_query_1.QueryClientProvider>);
};
const renderWithProviders = (ui) => {
    return (0, react_1.render)(ui, { wrapper: TestWrapper });
};
// ============================================================================
// InputFieldEditorPanel Component Tests
// ============================================================================
describe('InputFieldEditorPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFloatingRight.mockReturnValue({
            floatingRight: false,
            floatingRightWidth: 400,
        });
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render panel without crashing', () => {
            // Arrange
            const props = createInputFieldEditorProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('input-field-form')).toBeInTheDocument();
        });
        it('should render close button', () => {
            // Arrange
            const props = createInputFieldEditorProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const closeButton = react_1.screen.getByRole('button', { name: '' });
            expect(closeButton).toBeInTheDocument();
        });
        it('should render "Add Input Field" title when no initialData', () => {
            // Arrange
            const props = createInputFieldEditorProps({ initialData: undefined });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.addInputField')).toBeInTheDocument();
        });
        it('should render "Edit Input Field" title when initialData is provided', () => {
            // Arrange
            const props = createInputFieldEditorProps({
                initialData: createInputVar(),
            });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.editInputField')).toBeInTheDocument();
        });
        it('should pass supportFile=true to form', () => {
            // Arrange
            const props = createInputFieldEditorProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-support-file').textContent).toBe('true');
        });
        it('should pass isEditMode=false when no initialData', () => {
            // Arrange
            const props = createInputFieldEditorProps({ initialData: undefined });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-is-edit-mode').textContent).toBe('false');
        });
        it('should pass isEditMode=true when initialData is provided', () => {
            // Arrange
            const props = createInputFieldEditorProps({
                initialData: createInputVar(),
            });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-is-edit-mode').textContent).toBe('true');
        });
    });
    // -------------------------------------------------------------------------
    // Props Variations Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should handle different input types in initialData', () => {
            // Arrange
            const typesToTest = [
                pipeline_1.PipelineInputVarType.textInput,
                pipeline_1.PipelineInputVarType.paragraph,
                pipeline_1.PipelineInputVarType.number,
                pipeline_1.PipelineInputVarType.select,
                pipeline_1.PipelineInputVarType.singleFile,
                pipeline_1.PipelineInputVarType.multiFiles,
                pipeline_1.PipelineInputVarType.checkbox,
            ];
            typesToTest.forEach((type) => {
                const initialData = createInputVar({ type });
                const props = createInputFieldEditorProps({ initialData });
                // Act
                const { unmount } = renderWithProviders(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('input-field-form')).toBeInTheDocument();
                unmount();
            });
        });
        it('should handle initialData with all optional fields populated', () => {
            // Arrange
            const initialData = createInputVar({
                default_value: 'default',
                tooltips: 'tooltip text',
                placeholder: 'placeholder text',
                unit: 'kg',
                options: ['opt1', 'opt2'],
                allowed_file_upload_methods: ['local_file'],
                allowed_file_types: ['image'],
                allowed_file_extensions: ['.jpg', '.png'],
            });
            const props = createInputFieldEditorProps({ initialData });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('input-field-form')).toBeInTheDocument();
        });
        it('should handle initialData with minimal fields', () => {
            // Arrange
            const initialData = {
                type: pipeline_1.PipelineInputVarType.textInput,
                label: 'Min',
                variable: 'min_var',
                required: false,
            };
            const props = createInputFieldEditorProps({ initialData });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('input-field-form')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onClose when close button is clicked', () => {
            // Arrange
            const onClose = vi.fn();
            const props = createInputFieldEditorProps({ onClose });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('input-field-editor-close-btn'));
            // Assert
            expect(onClose).toHaveBeenCalledTimes(1);
        });
        it('should call onClose when form cancel is triggered', () => {
            // Arrange
            const onClose = vi.fn();
            const props = createInputFieldEditorProps({ onClose });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('form-cancel-btn'));
            // Assert
            expect(onClose).toHaveBeenCalledTimes(1);
        });
        it('should call onSubmit with converted data when form submits', () => {
            // Arrange
            const onSubmit = vi.fn();
            const props = createInputFieldEditorProps({ onSubmit });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('form-submit-btn'));
            // Assert
            expect(onSubmit).toHaveBeenCalledTimes(1);
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                type: expect.any(String),
                variable: expect.any(String),
            }), undefined);
        });
    });
    // -------------------------------------------------------------------------
    // Floating Right Behavior Tests
    // -------------------------------------------------------------------------
    describe('Floating Right Behavior', () => {
        it('should call useFloatingRight hook', () => {
            // Arrange
            const props = createInputFieldEditorProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(mockUseFloatingRight).toHaveBeenCalled();
        });
        it('should apply floating right styles when floatingRight is true', () => {
            // Arrange
            mockUseFloatingRight.mockReturnValue({
                floatingRight: true,
                floatingRightWidth: 300,
            });
            const props = createInputFieldEditorProps();
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const panel = container.firstChild;
            expect(panel.className).toContain('absolute');
            expect(panel.className).toContain('right-0');
            expect(panel.style.width).toBe('300px');
        });
        it('should not apply floating right styles when floatingRight is false', () => {
            // Arrange
            mockUseFloatingRight.mockReturnValue({
                floatingRight: false,
                floatingRightWidth: 400,
            });
            const props = createInputFieldEditorProps();
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const panel = container.firstChild;
            expect(panel.className).not.toContain('absolute');
            expect(panel.style.width).toBe('400px');
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability and Memoization Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should maintain stable onClose callback reference', () => {
            // Arrange
            const onClose = vi.fn();
            const props = createInputFieldEditorProps({ onClose });
            // Act
            const { rerender } = renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('form-cancel-btn'));
            rerender(<TestWrapper>
          <index_1.default {...props}/>
        </TestWrapper>);
            react_1.fireEvent.click(react_1.screen.getByTestId('form-cancel-btn'));
            // Assert
            expect(onClose).toHaveBeenCalledTimes(2);
        });
        it('should maintain stable onSubmit callback reference', () => {
            // Arrange
            const onSubmit = vi.fn();
            const props = createInputFieldEditorProps({ onSubmit });
            // Act
            const { rerender } = renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('form-submit-btn'));
            rerender(<TestWrapper>
          <index_1.default {...props}/>
        </TestWrapper>);
            react_1.fireEvent.click(react_1.screen.getByTestId('form-submit-btn'));
            // Assert
            expect(onSubmit).toHaveBeenCalledTimes(2);
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should memoize formData when initialData does not change', () => {
            // Arrange
            const initialData = createInputVar();
            const props = createInputFieldEditorProps({ initialData });
            // Act
            const { rerender } = renderWithProviders(<index_1.default {...props}/>);
            const firstFormData = react_1.screen.getByTestId('form-initial-data').textContent;
            rerender(<TestWrapper>
          <index_1.default {...props}/>
        </TestWrapper>);
            const secondFormData = react_1.screen.getByTestId('form-initial-data').textContent;
            // Assert
            expect(firstFormData).toBe(secondFormData);
        });
        it('should recompute formData when initialData changes', () => {
            // Arrange
            const initialData1 = createInputVar({ variable: 'var1' });
            const initialData2 = createInputVar({ variable: 'var2' });
            const props1 = createInputFieldEditorProps({ initialData: initialData1 });
            const props2 = createInputFieldEditorProps({ initialData: initialData2 });
            // Act
            const { rerender } = renderWithProviders(<index_1.default {...props1}/>);
            const firstFormData = react_1.screen.getByTestId('form-initial-data').textContent;
            rerender(<TestWrapper>
          <index_1.default {...props2}/>
        </TestWrapper>);
            const secondFormData = react_1.screen.getByTestId('form-initial-data').textContent;
            // Assert
            expect(firstFormData).not.toBe(secondFormData);
            expect(firstFormData).toContain('var1');
            expect(secondFormData).toContain('var2');
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle undefined initialData gracefully', () => {
            // Arrange
            const props = createInputFieldEditorProps({ initialData: undefined });
            // Act & Assert
            expect(() => renderWithProviders(<index_1.default {...props}/>)).not.toThrow();
        });
        it('should handle rapid close button clicks', () => {
            // Arrange
            const onClose = vi.fn();
            const props = createInputFieldEditorProps({ onClose });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            const closeButtons = react_1.screen.getAllByRole('button');
            const closeButton = closeButtons.find(btn => btn.querySelector('svg'));
            if (closeButton) {
                react_1.fireEvent.click(closeButton);
                react_1.fireEvent.click(closeButton);
                react_1.fireEvent.click(closeButton);
            }
            // Assert
            expect(onClose).toHaveBeenCalledTimes(3);
        });
        it('should handle special characters in initialData', () => {
            // Arrange
            const initialData = createInputVar({
                label: 'Test <script>alert("xss")</script>',
                variable: 'test_var',
                tooltips: 'Tooltip with "quotes" and \'apostrophes\'',
            });
            const props = createInputFieldEditorProps({ initialData });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('input-field-form')).toBeInTheDocument();
        });
        it('should handle empty string values in initialData', () => {
            // Arrange
            const initialData = createInputVar({
                label: '',
                variable: '',
                default_value: '',
                tooltips: '',
                placeholder: '',
            });
            const props = createInputFieldEditorProps({ initialData });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('input-field-form')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// Utils Tests - convertToInputFieldFormData
// ============================================================================
describe('convertToInputFieldFormData', () => {
    // -------------------------------------------------------------------------
    // Basic Conversion Tests
    // -------------------------------------------------------------------------
    describe('Basic Conversion', () => {
        it('should convert InputVar to FormData with all fields', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.textInput,
                label: 'Test',
                variable: 'test_var',
                max_length: 100,
                default_value: 'default',
                required: true,
                tooltips: 'tooltip',
                options: ['a', 'b'],
                placeholder: 'placeholder',
                unit: 'kg',
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.textInput);
            expect(result.label).toBe('Test');
            expect(result.variable).toBe('test_var');
            expect(result.maxLength).toBe(100);
            expect(result.default).toBe('default');
            expect(result.required).toBe(true);
            expect(result.tooltips).toBe('tooltip');
            expect(result.options).toEqual(['a', 'b']);
            expect(result.placeholder).toBe('placeholder');
            expect(result.unit).toBe('kg');
        });
        it('should convert file-related fields correctly', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.singleFile,
                allowed_file_upload_methods: ['local_file', 'remote_url'],
                allowed_file_types: ['image', 'document'],
                allowed_file_extensions: ['.jpg', '.pdf'],
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.allowedFileUploadMethods).toEqual([
                'local_file',
                'remote_url',
            ]);
            expect(result.allowedTypesAndExtensions).toEqual({
                allowedFileTypes: ['image', 'document'],
                allowedFileExtensions: ['.jpg', '.pdf'],
            });
        });
        it('should return default template when data is undefined', () => {
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(undefined);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.textInput);
            expect(result.variable).toBe('');
            expect(result.label).toBe('');
            expect(result.required).toBe(true);
        });
    });
    // -------------------------------------------------------------------------
    // Optional Fields Handling Tests
    // -------------------------------------------------------------------------
    describe('Optional Fields Handling', () => {
        it('should not include default when default_value is undefined', () => {
            // Arrange
            const inputVar = createInputVar({
                default_value: undefined,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.default).toBeUndefined();
        });
        it('should not include default when default_value is null', () => {
            // Arrange
            const inputVar = {
                ...createInputVar(),
                default_value: null,
            };
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.default).toBeUndefined();
        });
        it('should include default when default_value is empty string', () => {
            // Arrange
            const inputVar = createInputVar({
                default_value: '',
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.default).toBe('');
        });
        it('should not include tooltips when undefined', () => {
            // Arrange
            const inputVar = createInputVar({
                tooltips: undefined,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.tooltips).toBeUndefined();
        });
        it('should not include placeholder when undefined', () => {
            // Arrange
            const inputVar = createInputVar({
                placeholder: undefined,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.placeholder).toBeUndefined();
        });
        it('should not include unit when undefined', () => {
            // Arrange
            const inputVar = createInputVar({
                unit: undefined,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.unit).toBeUndefined();
        });
        it('should not include file settings when allowed_file_upload_methods is undefined', () => {
            // Arrange
            const inputVar = createInputVar({
                allowed_file_upload_methods: undefined,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.allowedFileUploadMethods).toBeUndefined();
        });
        it('should not include allowedTypesAndExtensions details when file types/extensions are missing', () => {
            // Arrange
            const inputVar = createInputVar({
                allowed_file_types: undefined,
                allowed_file_extensions: undefined,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.allowedTypesAndExtensions).toEqual({});
        });
    });
    // -------------------------------------------------------------------------
    // Type-Specific Tests
    // -------------------------------------------------------------------------
    describe('Type-Specific Handling', () => {
        it('should handle textInput type', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.textInput,
                max_length: 256,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.textInput);
            expect(result.maxLength).toBe(256);
        });
        it('should handle paragraph type', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.paragraph,
                max_length: 1000,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.paragraph);
            expect(result.maxLength).toBe(1000);
        });
        it('should handle number type with unit', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.number,
                unit: 'meters',
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.number);
            expect(result.unit).toBe('meters');
        });
        it('should handle select type with options', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.select,
                options: ['Option A', 'Option B', 'Option C'],
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.select);
            expect(result.options).toEqual(['Option A', 'Option B', 'Option C']);
        });
        it('should handle singleFile type', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.singleFile,
                allowed_file_upload_methods: ['local_file'],
                allowed_file_types: ['image'],
                allowed_file_extensions: ['.jpg'],
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.singleFile);
            expect(result.allowedFileUploadMethods).toEqual(['local_file']);
        });
        it('should handle multiFiles type', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.multiFiles,
                max_length: 5,
                allowed_file_upload_methods: ['local_file', 'remote_url'],
                allowed_file_types: ['document'],
                allowed_file_extensions: ['.pdf', '.doc'],
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.multiFiles);
            expect(result.maxLength).toBe(5);
        });
        it('should handle checkbox type', () => {
            // Arrange
            const inputVar = createInputVar({
                type: pipeline_1.PipelineInputVarType.checkbox,
                default_value: 'true',
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.checkbox);
            expect(result.default).toBe('true');
        });
    });
});
// ============================================================================
// Utils Tests - convertFormDataToINputField
// ============================================================================
describe('convertFormDataToINputField', () => {
    // -------------------------------------------------------------------------
    // Basic Conversion Tests
    // -------------------------------------------------------------------------
    describe('Basic Conversion', () => {
        it('should convert FormData to InputVar with all fields', () => {
            // Arrange
            const formData = createFormData({
                type: pipeline_1.PipelineInputVarType.textInput,
                label: 'Test',
                variable: 'test_var',
                maxLength: 100,
                default: 'default',
                required: true,
                tooltips: 'tooltip',
                options: ['a', 'b'],
                placeholder: 'placeholder',
                unit: 'kg',
                allowedFileUploadMethods: ['local_file'],
                allowedTypesAndExtensions: {
                    allowedFileTypes: ['image'],
                    allowedFileExtensions: ['.jpg'],
                },
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.textInput);
            expect(result.label).toBe('Test');
            expect(result.variable).toBe('test_var');
            expect(result.max_length).toBe(100);
            expect(result.default_value).toBe('default');
            expect(result.required).toBe(true);
            expect(result.tooltips).toBe('tooltip');
            expect(result.options).toEqual(['a', 'b']);
            expect(result.placeholder).toBe('placeholder');
            expect(result.unit).toBe('kg');
            expect(result.allowed_file_upload_methods).toEqual(['local_file']);
            expect(result.allowed_file_types).toEqual(['image']);
            expect(result.allowed_file_extensions).toEqual(['.jpg']);
        });
        it('should handle undefined optional fields', () => {
            // Arrange
            const formData = createFormData({
                default: undefined,
                tooltips: undefined,
                placeholder: undefined,
                unit: undefined,
                allowedFileUploadMethods: undefined,
                allowedTypesAndExtensions: {
                    allowedFileTypes: undefined,
                    allowedFileExtensions: undefined,
                },
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.default_value).toBeUndefined();
            expect(result.tooltips).toBeUndefined();
            expect(result.placeholder).toBeUndefined();
            expect(result.unit).toBeUndefined();
            expect(result.allowed_file_upload_methods).toBeUndefined();
            expect(result.allowed_file_types).toBeUndefined();
            expect(result.allowed_file_extensions).toBeUndefined();
        });
    });
    // -------------------------------------------------------------------------
    // Field Mapping Tests
    // -------------------------------------------------------------------------
    describe('Field Mapping', () => {
        it('should map maxLength to max_length', () => {
            // Arrange
            const formData = createFormData({ maxLength: 256 });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.max_length).toBe(256);
        });
        it('should map default to default_value', () => {
            // Arrange
            const formData = createFormData({ default: 'my default' });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.default_value).toBe('my default');
        });
        it('should map allowedFileUploadMethods to allowed_file_upload_methods', () => {
            // Arrange
            const formData = createFormData({
                allowedFileUploadMethods: ['local_file', 'remote_url'],
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.allowed_file_upload_methods).toEqual([
                'local_file',
                'remote_url',
            ]);
        });
        it('should map allowedTypesAndExtensions to separate fields', () => {
            // Arrange
            const formData = createFormData({
                allowedTypesAndExtensions: {
                    allowedFileTypes: ['image', 'document'],
                    allowedFileExtensions: ['.jpg', '.pdf'],
                },
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.allowed_file_types).toEqual(['image', 'document']);
            expect(result.allowed_file_extensions).toEqual(['.jpg', '.pdf']);
        });
    });
    // -------------------------------------------------------------------------
    // Type-Specific Tests
    // -------------------------------------------------------------------------
    describe('Type-Specific Handling', () => {
        it('should preserve textInput type', () => {
            // Arrange
            const formData = createFormData({ type: pipeline_1.PipelineInputVarType.textInput });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.textInput);
        });
        it('should preserve paragraph type', () => {
            // Arrange
            const formData = createFormData({ type: pipeline_1.PipelineInputVarType.paragraph });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.paragraph);
        });
        it('should preserve select type with options', () => {
            // Arrange
            const formData = createFormData({
                type: pipeline_1.PipelineInputVarType.select,
                options: ['A', 'B', 'C'],
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.select);
            expect(result.options).toEqual(['A', 'B', 'C']);
        });
        it('should preserve number type with unit', () => {
            // Arrange
            const formData = createFormData({
                type: pipeline_1.PipelineInputVarType.number,
                unit: 'kg',
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.number);
            expect(result.unit).toBe('kg');
        });
        it('should preserve singleFile type', () => {
            // Arrange
            const formData = createFormData({
                type: pipeline_1.PipelineInputVarType.singleFile,
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.singleFile);
        });
        it('should preserve multiFiles type with maxLength', () => {
            // Arrange
            const formData = createFormData({
                type: pipeline_1.PipelineInputVarType.multiFiles,
                maxLength: 10,
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.multiFiles);
            expect(result.max_length).toBe(10);
        });
        it('should preserve checkbox type', () => {
            // Arrange
            const formData = createFormData({ type: pipeline_1.PipelineInputVarType.checkbox });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(pipeline_1.PipelineInputVarType.checkbox);
        });
    });
});
// ============================================================================
// Round-Trip Conversion Tests
// ============================================================================
describe('Round-Trip Conversion', () => {
    it('should preserve data through round-trip conversion for textInput', () => {
        // Arrange
        const original = createInputVar({
            type: pipeline_1.PipelineInputVarType.textInput,
            label: 'Test Label',
            variable: 'test_var',
            max_length: 100,
            default_value: 'default',
            required: true,
            tooltips: 'tooltip',
            placeholder: 'placeholder',
        });
        // Act
        const formData = (0, utils_1.convertToInputFieldFormData)(original);
        const result = (0, utils_1.convertFormDataToINputField)(formData);
        // Assert
        expect(result.type).toBe(original.type);
        expect(result.label).toBe(original.label);
        expect(result.variable).toBe(original.variable);
        expect(result.max_length).toBe(original.max_length);
        expect(result.default_value).toBe(original.default_value);
        expect(result.required).toBe(original.required);
        expect(result.tooltips).toBe(original.tooltips);
        expect(result.placeholder).toBe(original.placeholder);
    });
    it('should preserve data through round-trip conversion for select', () => {
        // Arrange
        const original = createInputVar({
            type: pipeline_1.PipelineInputVarType.select,
            options: ['Option A', 'Option B', 'Option C'],
            default_value: 'Option A',
        });
        // Act
        const formData = (0, utils_1.convertToInputFieldFormData)(original);
        const result = (0, utils_1.convertFormDataToINputField)(formData);
        // Assert
        expect(result.type).toBe(original.type);
        expect(result.options).toEqual(original.options);
        expect(result.default_value).toBe(original.default_value);
    });
    it('should preserve data through round-trip conversion for file types', () => {
        // Arrange
        const original = createInputVar({
            type: pipeline_1.PipelineInputVarType.multiFiles,
            max_length: 5,
            allowed_file_upload_methods: ['local_file', 'remote_url'],
            allowed_file_types: ['image', 'document'],
            allowed_file_extensions: ['.jpg', '.pdf'],
        });
        // Act
        const formData = (0, utils_1.convertToInputFieldFormData)(original);
        const result = (0, utils_1.convertFormDataToINputField)(formData);
        // Assert
        expect(result.type).toBe(original.type);
        expect(result.max_length).toBe(original.max_length);
        expect(result.allowed_file_upload_methods).toEqual(original.allowed_file_upload_methods);
        expect(result.allowed_file_types).toEqual(original.allowed_file_types);
        expect(result.allowed_file_extensions).toEqual(original.allowed_file_extensions);
    });
    it('should handle all input types through round-trip', () => {
        // Arrange
        const typesToTest = [
            pipeline_1.PipelineInputVarType.textInput,
            pipeline_1.PipelineInputVarType.paragraph,
            pipeline_1.PipelineInputVarType.number,
            pipeline_1.PipelineInputVarType.select,
            pipeline_1.PipelineInputVarType.singleFile,
            pipeline_1.PipelineInputVarType.multiFiles,
            pipeline_1.PipelineInputVarType.checkbox,
        ];
        typesToTest.forEach((type) => {
            const original = createInputVar({ type });
            // Act
            const formData = (0, utils_1.convertToInputFieldFormData)(original);
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.type).toBe(original.type);
        });
    });
});
// ============================================================================
// Edge Cases Tests
// ============================================================================
describe('Edge Cases', () => {
    describe('convertToInputFieldFormData edge cases', () => {
        it('should handle zero maxLength', () => {
            // Arrange
            const inputVar = createInputVar({ max_length: 0 });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.maxLength).toBe(0);
        });
        it('should handle empty options array', () => {
            // Arrange
            const inputVar = createInputVar({ options: [] });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.options).toEqual([]);
        });
        it('should handle options with special characters', () => {
            // Arrange
            const inputVar = createInputVar({
                options: ['<script>', '"quoted"', '\'apostrophe\'', '&amp;'],
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.options).toEqual([
                '<script>',
                '"quoted"',
                '\'apostrophe\'',
                '&amp;',
            ]);
        });
        it('should handle very long strings', () => {
            // Arrange
            const longString = 'a'.repeat(10000);
            const inputVar = createInputVar({
                label: longString,
                tooltips: longString,
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.label).toBe(longString);
            expect(result.tooltips).toBe(longString);
        });
        it('should handle unicode characters', () => {
            // Arrange
            const inputVar = createInputVar({
                label: '测试标签 🎉',
                tooltips: 'ツールチップ 😀',
                placeholder: 'Platzhalter ñ é',
            });
            // Act
            const result = (0, utils_1.convertToInputFieldFormData)(inputVar);
            // Assert
            expect(result.label).toBe('测试标签 🎉');
            expect(result.tooltips).toBe('ツールチップ 😀');
            expect(result.placeholder).toBe('Platzhalter ñ é');
        });
    });
    describe('convertFormDataToINputField edge cases', () => {
        it('should handle zero maxLength', () => {
            // Arrange
            const formData = createFormData({ maxLength: 0 });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.max_length).toBe(0);
        });
        it('should handle empty allowedTypesAndExtensions', () => {
            // Arrange
            const formData = createFormData({
                allowedTypesAndExtensions: {
                    allowedFileTypes: [],
                    allowedFileExtensions: [],
                },
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.allowed_file_types).toEqual([]);
            expect(result.allowed_file_extensions).toEqual([]);
        });
        it('should handle boolean default value (checkbox)', () => {
            // Arrange
            const formData = createFormData({
                type: pipeline_1.PipelineInputVarType.checkbox,
                default: 'true',
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.default_value).toBe('true');
        });
        it('should handle numeric default value (number type)', () => {
            // Arrange
            const formData = createFormData({
                type: pipeline_1.PipelineInputVarType.number,
                default: '42',
            });
            // Act
            const result = (0, utils_1.convertFormDataToINputField)(formData);
            // Assert
            expect(result.default_value).toBe('42');
        });
    });
});
// ============================================================================
// Hook Memoization Tests
// ============================================================================
describe('Hook Memoization', () => {
    it('should return stable callback reference for handleSubmit', () => {
        // Arrange
        const onSubmit = vi.fn();
        let handleSubmitRef1;
        let handleSubmitRef2;
        const TestComponent = ({ capture, submitFn, }) => {
            const handleSubmit = React.useCallback((value) => {
                const inputFieldData = (0, utils_1.convertFormDataToINputField)(value);
                submitFn(inputFieldData);
            }, [submitFn]);
            capture(handleSubmit);
            return null;
        };
        // Act
        const { rerender } = (0, react_1.render)(<TestComponent capture={(ref) => { handleSubmitRef1 = ref; }} submitFn={onSubmit}/>);
        rerender(<TestComponent capture={(ref) => { handleSubmitRef2 = ref; }} submitFn={onSubmit}/>);
        // Assert - callback should be same reference due to useCallback
        expect(handleSubmitRef1).toBe(handleSubmitRef2);
    });
    it('should return stable formData when initialData is unchanged', () => {
        // Arrange
        const initialData = createInputVar();
        let formData1;
        let formData2;
        const TestComponent = ({ data, capture, }) => {
            const formData = React.useMemo(() => (0, utils_1.convertToInputFieldFormData)(data), [data]);
            capture(formData);
            return null;
        };
        // Act
        const { rerender } = (0, react_1.render)(<TestComponent data={initialData} capture={(fd) => { formData1 = fd; }}/>);
        rerender(<TestComponent data={initialData} capture={(fd) => { formData2 = fd; }}/>);
        // Assert - formData should be same reference due to useMemo
        expect(formData1).toBe(formData2);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsdURBQXdFO0FBQ3hFLGtEQUFrRTtBQUNsRSwrQkFBOEI7QUFDOUIsZ0RBQXdEO0FBQ3hELG1DQUEyQztBQUMzQyxtQ0FHZ0I7QUFFaEIsK0VBQStFO0FBQy9FLDZCQUE2QjtBQUM3QiwrRUFBK0U7QUFFL0UsNkJBQTZCO0FBQzdCLE1BQU0sb0JBQW9CLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLGtCQUFrQixFQUFFLEdBQUc7Q0FDeEIsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixFQUFFO0NBQy9DLENBQUMsQ0FBQyxDQUFBO0FBRUgsZ0NBQWdDO0FBQ2hDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkIsT0FBTyxFQUFFLENBQUMsRUFDUixXQUFXLEVBQ1gsV0FBVyxFQUNYLFFBQVEsRUFDUixRQUFRLEVBQ1IsVUFBVSxHQU9YLEVBQUUsRUFBRSxDQUFDLENBQ0osQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUNqQztNQUFBLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQ3pFO01BQUEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUNqRTtNQUFBLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FB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QyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEZvcm1EYXRhIH0gZnJvbSAnLi9mb3JtL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBJbnB1dEZpZWxkRWRpdG9yUHJvcHMgfSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHR5cGUgeyBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB0eXBlIHsgSW5wdXRWYXIgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB0eXBlIHsgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFBpcGVsaW5lSW5wdXRWYXJUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgSW5wdXRGaWVsZEVkaXRvclBhbmVsIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQge1xuICBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQsXG4gIGNvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YSxcbn0gZnJvbSAnLi91dGlscydcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayB1c2VGbG9hdGluZ1JpZ2h0IGhvb2tcbmNvbnN0IG1vY2tVc2VGbG9hdGluZ1JpZ2h0ID0gdmkuZm4oKCkgPT4gKHtcbiAgZmxvYXRpbmdSaWdodDogZmFsc2UsXG4gIGZsb2F0aW5nUmlnaHRXaWR0aDogNDAwLFxufSkpXG5cbnZpLm1vY2soJy4uL2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlRmxvYXRpbmdSaWdodDogKCkgPT4gbW9ja1VzZUZsb2F0aW5nUmlnaHQoKSxcbn0pKVxuXG4vLyBNb2NrIElucHV0RmllbGRGb3JtIGNvbXBvbmVudFxudmkubW9jaygnLi9mb3JtJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICBpbml0aWFsRGF0YSxcbiAgICBzdXBwb3J0RmlsZSxcbiAgICBvbkNhbmNlbCxcbiAgICBvblN1Ym1pdCxcbiAgICBpc0VkaXRNb2RlLFxuICB9OiB7XG4gICAgaW5pdGlhbERhdGE6IEZvcm1EYXRhXG4gICAgc3VwcG9ydEZpbGU6IGJvb2xlYW5cbiAgICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICAgIG9uU3VibWl0OiAodmFsdWU6IEZvcm1EYXRhKSA9PiB2b2lkXG4gICAgaXNFZGl0TW9kZTogYm9vbGVhblxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImlucHV0LWZpZWxkLWZvcm1cIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZm9ybS1pbml0aWFsLWRhdGFcIj57SlNPTi5zdHJpbmdpZnkoaW5pdGlhbERhdGEpfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZm9ybS1zdXBwb3J0LWZpbGVcIj57U3RyaW5nKHN1cHBvcnRGaWxlKX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImZvcm0taXMtZWRpdC1tb2RlXCI+e1N0cmluZyhpc0VkaXRNb2RlKX08L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiZm9ybS1jYW5jZWwtYnRuXCIgb25DbGljaz17b25DYW5jZWx9PkNhbmNlbDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cImZvcm0tc3VibWl0LWJ0blwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU3VibWl0KGluaXRpYWxEYXRhKX1cbiAgICAgID5cbiAgICAgICAgU3VibWl0XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIGZpbGUgdXBsb2FkIGNvbmZpZyBzZXJ2aWNlXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLWNvbW1vbicsICgpID0+ICh7XG4gIHVzZUZpbGVVcGxvYWRDb25maWc6ICgpID0+ICh7XG4gICAgZGF0YToge1xuICAgICAgaW1hZ2VfZmlsZV9zaXplX2xpbWl0OiAxMCxcbiAgICAgIGZpbGVfc2l6ZV9saW1pdDogMTUsXG4gICAgICBhdWRpb19maWxlX3NpemVfbGltaXQ6IDUwLFxuICAgICAgdmlkZW9fZmlsZV9zaXplX2xpbWl0OiAxMDAsXG4gICAgICB3b3JrZmxvd19maWxlX3VwbG9hZF9saW1pdDogMTAsXG4gICAgfSxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgIGVycm9yOiBudWxsLFxuICB9KSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZUlucHV0VmFyID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8SW5wdXRWYXI+KTogSW5wdXRWYXIgPT4gKHtcbiAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICBsYWJlbDogJ1Rlc3QgTGFiZWwnLFxuICB2YXJpYWJsZTogJ3Rlc3RfdmFyaWFibGUnLFxuICBtYXhfbGVuZ3RoOiA0OCxcbiAgZGVmYXVsdF92YWx1ZTogJycsXG4gIHJlcXVpcmVkOiB0cnVlLFxuICB0b29sdGlwczogJycsXG4gIG9wdGlvbnM6IFtdLFxuICBwbGFjZWhvbGRlcjogJycsXG4gIHVuaXQ6ICcnLFxuICBhbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHM6IFtdLFxuICBhbGxvd2VkX2ZpbGVfdHlwZXM6IFtdLFxuICBhbGxvd2VkX2ZpbGVfZXh0ZW5zaW9uczogW10sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZUZvcm1EYXRhID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8Rm9ybURhdGE+KTogRm9ybURhdGEgPT4gKHtcbiAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICBsYWJlbDogJ1Rlc3QgTGFiZWwnLFxuICB2YXJpYWJsZTogJ3Rlc3RfdmFyaWFibGUnLFxuICBtYXhMZW5ndGg6IDQ4LFxuICBkZWZhdWx0OiAnJyxcbiAgcmVxdWlyZWQ6IHRydWUsXG4gIHRvb2x0aXBzOiAnJyxcbiAgb3B0aW9uczogW10sXG4gIHBsYWNlaG9sZGVyOiAnJyxcbiAgdW5pdDogJycsXG4gIGFsbG93ZWRGaWxlVXBsb2FkTWV0aG9kczogW10sXG4gIGFsbG93ZWRUeXBlc0FuZEV4dGVuc2lvbnM6IHtcbiAgICBhbGxvd2VkRmlsZVR5cGVzOiBbXSxcbiAgICBhbGxvd2VkRmlsZUV4dGVuc2lvbnM6IFtdLFxuICB9LFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMgPSAoXG4gIG92ZXJyaWRlcz86IFBhcnRpYWw8SW5wdXRGaWVsZEVkaXRvclByb3BzPixcbik6IElucHV0RmllbGRFZGl0b3JQcm9wcyA9PiAoe1xuICBvbkNsb3NlOiB2aS5mbigpLFxuICBvblN1Ym1pdDogdmkuZm4oKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBXcmFwcGVyIENvbXBvbmVudFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVUZXN0UXVlcnlDbGllbnQgPSAoKSA9PlxuICBuZXcgUXVlcnlDbGllbnQoe1xuICAgIGRlZmF1bHRPcHRpb25zOiB7XG4gICAgICBxdWVyaWVzOiB7XG4gICAgICAgIHJldHJ5OiBmYWxzZSxcbiAgICAgICAgZ2NUaW1lOiAwLFxuICAgICAgfSxcbiAgICB9LFxuICB9KVxuXG5jb25zdCBUZXN0V3JhcHBlciA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gY3JlYXRlVGVzdFF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuIChcbiAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT57Y2hpbGRyZW59PC9RdWVyeUNsaWVudFByb3ZpZGVyPlxuICApXG59XG5cbmNvbnN0IHJlbmRlcldpdGhQcm92aWRlcnMgPSAodWk6IFJlYWN0LlJlYWN0RWxlbWVudCkgPT4ge1xuICByZXR1cm4gcmVuZGVyKHVpLCB7IHdyYXBwZXI6IFRlc3RXcmFwcGVyIH0pXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElucHV0RmllbGRFZGl0b3JQYW5lbCBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0lucHV0RmllbGRFZGl0b3JQYW5lbCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1VzZUZsb2F0aW5nUmlnaHQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGZsb2F0aW5nUmlnaHQ6IGZhbHNlLFxuICAgICAgZmxvYXRpbmdSaWdodFdpZHRoOiA0MDAsXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFuZWwgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xvc2UgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnJyB9KVxuICAgICAgZXhwZWN0KGNsb3NlQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFwiQWRkIElucHV0IEZpZWxkXCIgdGl0bGUgd2hlbiBubyBpbml0aWFsRGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHsgaW5pdGlhbERhdGE6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChcbiAgICAgICAgc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmlucHV0RmllbGRQYW5lbC5hZGRJbnB1dEZpZWxkJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgXCJFZGl0IElucHV0IEZpZWxkXCIgdGl0bGUgd2hlbiBpbml0aWFsRGF0YSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHtcbiAgICAgICAgaW5pdGlhbERhdGE6IGNyZWF0ZUlucHV0VmFyKCksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChcbiAgICAgICAgc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmlucHV0RmllbGRQYW5lbC5lZGl0SW5wdXRGaWVsZCcpLFxuICAgICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBzdXBwb3J0RmlsZT10cnVlIHRvIGZvcm0nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRFZGl0b3JQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEVkaXRvclBhbmVsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1zdXBwb3J0LWZpbGUnKS50ZXh0Q29udGVudCkudG9CZSgndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc0VkaXRNb2RlPWZhbHNlIHdoZW4gbm8gaW5pdGlhbERhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRFZGl0b3JQcm9wcyh7IGluaXRpYWxEYXRhOiB1bmRlZmluZWQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWlzLWVkaXQtbW9kZScpLnRleHRDb250ZW50KS50b0JlKCdmYWxzZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc0VkaXRNb2RlPXRydWUgd2hlbiBpbml0aWFsRGF0YSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHtcbiAgICAgICAgaW5pdGlhbERhdGE6IGNyZWF0ZUlucHV0VmFyKCksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0taXMtZWRpdC1tb2RlJykudGV4dENvbnRlbnQpLnRvQmUoJ3RydWUnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBWYXJpYXRpb25zIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IGlucHV0IHR5cGVzIGluIGluaXRpYWxEYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdHlwZXNUb1Rlc3QgPSBbXG4gICAgICAgIFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUucGFyYWdyYXBoLFxuICAgICAgICBQaXBlbGluZUlucHV0VmFyVHlwZS5udW1iZXIsXG4gICAgICAgIFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNlbGVjdCxcbiAgICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUuc2luZ2xlRmlsZSxcbiAgICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUubXVsdGlGaWxlcyxcbiAgICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUuY2hlY2tib3gsXG4gICAgICBdXG5cbiAgICAgIHR5cGVzVG9UZXN0LmZvckVhY2goKHR5cGUpID0+IHtcbiAgICAgICAgY29uc3QgaW5pdGlhbERhdGEgPSBjcmVhdGVJbnB1dFZhcih7IHR5cGUgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoeyBpbml0aWFsRGF0YSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgICAgPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lucHV0LWZpZWxkLWZvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB1bm1vdW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGluaXRpYWxEYXRhIHdpdGggYWxsIG9wdGlvbmFsIGZpZWxkcyBwb3B1bGF0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbml0aWFsRGF0YSA9IGNyZWF0ZUlucHV0VmFyKHtcbiAgICAgICAgZGVmYXVsdF92YWx1ZTogJ2RlZmF1bHQnLFxuICAgICAgICB0b29sdGlwczogJ3Rvb2x0aXAgdGV4dCcsXG4gICAgICAgIHBsYWNlaG9sZGVyOiAncGxhY2Vob2xkZXIgdGV4dCcsXG4gICAgICAgIHVuaXQ6ICdrZycsXG4gICAgICAgIG9wdGlvbnM6IFsnb3B0MScsICdvcHQyJ10sXG4gICAgICAgIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogWydsb2NhbF9maWxlJyBhcyBUcmFuc2Zlck1ldGhvZF0sXG4gICAgICAgIGFsbG93ZWRfZmlsZV90eXBlczogWydpbWFnZScgYXMgU3VwcG9ydFVwbG9hZEZpbGVUeXBlc10sXG4gICAgICAgIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiBbJy5qcGcnLCAnLnBuZyddLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHsgaW5pdGlhbERhdGEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW5pdGlhbERhdGEgd2l0aCBtaW5pbWFsIGZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxEYXRhOiBJbnB1dFZhciA9IHtcbiAgICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICAgICAgICBsYWJlbDogJ01pbicsXG4gICAgICAgIHZhcmlhYmxlOiAnbWluX3ZhcicsXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHsgaW5pdGlhbERhdGEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHsgb25DbG9zZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtZmllbGQtZWRpdG9yLWNsb3NlLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBmb3JtIGNhbmNlbCBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoeyBvbkNsb3NlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEVkaXRvclBhbmVsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWNhbmNlbC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblN1Ym1pdCB3aXRoIGNvbnZlcnRlZCBkYXRhIHdoZW4gZm9ybSBzdWJtaXRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRFZGl0b3JQcm9wcyh7IG9uU3VibWl0IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEVkaXRvclBhbmVsIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25TdWJtaXQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uU3VibWl0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHR5cGU6IGV4cGVjdC5hbnkoU3RyaW5nKSxcbiAgICAgICAgICB2YXJpYWJsZTogZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICB9KSxcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBGbG9hdGluZyBSaWdodCBCZWhhdmlvciBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdGbG9hdGluZyBSaWdodCBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgdXNlRmxvYXRpbmdSaWdodCBob29rJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrVXNlRmxvYXRpbmdSaWdodCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgZmxvYXRpbmcgcmlnaHQgc3R5bGVzIHdoZW4gZmxvYXRpbmdSaWdodCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZUZsb2F0aW5nUmlnaHQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZmxvYXRpbmdSaWdodDogdHJ1ZSxcbiAgICAgICAgZmxvYXRpbmdSaWdodFdpZHRoOiAzMDAsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8SW5wdXRGaWVsZEVkaXRvclBhbmVsIHsuLi5wcm9wc30gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcGFuZWwgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHBhbmVsLmNsYXNzTmFtZSkudG9Db250YWluKCdhYnNvbHV0ZScpXG4gICAgICBleHBlY3QocGFuZWwuY2xhc3NOYW1lKS50b0NvbnRhaW4oJ3JpZ2h0LTAnKVxuICAgICAgZXhwZWN0KHBhbmVsLnN0eWxlLndpZHRoKS50b0JlKCczMDBweCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGFwcGx5IGZsb2F0aW5nIHJpZ2h0IHN0eWxlcyB3aGVuIGZsb2F0aW5nUmlnaHQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlRmxvYXRpbmdSaWdodC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBmbG9hdGluZ1JpZ2h0OiBmYWxzZSxcbiAgICAgICAgZmxvYXRpbmdSaWdodFdpZHRoOiA0MDAsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8SW5wdXRGaWVsZEVkaXRvclBhbmVsIHsuLi5wcm9wc30gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcGFuZWwgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHBhbmVsLmNsYXNzTmFtZSkubm90LnRvQ29udGFpbignYWJzb2x1dGUnKVxuICAgICAgZXhwZWN0KHBhbmVsLnN0eWxlLndpZHRoKS50b0JlKCc0MDBweCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBhbmQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIG9uQ2xvc2UgY2FsbGJhY2sgcmVmZXJlbmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHsgb25DbG9zZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPixcbiAgICAgIClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tY2FuY2VsLWJ0bicpKVxuXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFRlc3RXcmFwcGVyPlxuICAgICAgICAgIDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPlxuICAgICAgICA8L1Rlc3RXcmFwcGVyPixcbiAgICAgIClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tY2FuY2VsLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgb25TdWJtaXQgY2FsbGJhY2sgcmVmZXJlbmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRFZGl0b3JQcm9wcyh7IG9uU3VibWl0IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1zdWJtaXQtYnRuJykpXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8VGVzdFdyYXBwZXI+XG4gICAgICAgICAgPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+XG4gICAgICAgIDwvVGVzdFdyYXBwZXI+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1zdWJtaXQtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uU3VibWl0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtZW1vaXplIGZvcm1EYXRhIHdoZW4gaW5pdGlhbERhdGEgZG9lcyBub3QgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5pdGlhbERhdGEgPSBjcmVhdGVJbnB1dFZhcigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRFZGl0b3JQcm9wcyh7IGluaXRpYWxEYXRhIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+LFxuICAgICAgKVxuICAgICAgY29uc3QgZmlyc3RGb3JtRGF0YSA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1pbml0aWFsLWRhdGEnKS50ZXh0Q29udGVudFxuXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFRlc3RXcmFwcGVyPlxuICAgICAgICAgIDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPlxuICAgICAgICA8L1Rlc3RXcmFwcGVyPixcbiAgICAgIClcbiAgICAgIGNvbnN0IHNlY29uZEZvcm1EYXRhID0gc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWluaXRpYWwtZGF0YScpLnRleHRDb250ZW50XG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGZpcnN0Rm9ybURhdGEpLnRvQmUoc2Vjb25kRm9ybURhdGEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVjb21wdXRlIGZvcm1EYXRhIHdoZW4gaW5pdGlhbERhdGEgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxEYXRhMSA9IGNyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6ICd2YXIxJyB9KVxuICAgICAgY29uc3QgaW5pdGlhbERhdGEyID0gY3JlYXRlSW5wdXRWYXIoeyB2YXJpYWJsZTogJ3ZhcjInIH0pXG4gICAgICBjb25zdCBwcm9wczEgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoeyBpbml0aWFsRGF0YTogaW5pdGlhbERhdGExIH0pXG4gICAgICBjb25zdCBwcm9wczIgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoeyBpbml0aWFsRGF0YTogaW5pdGlhbERhdGEyIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHMxfSAvPixcbiAgICAgIClcbiAgICAgIGNvbnN0IGZpcnN0Rm9ybURhdGEgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0taW5pdGlhbC1kYXRhJykudGV4dENvbnRlbnRcblxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUZXN0V3JhcHBlcj5cbiAgICAgICAgICA8SW5wdXRGaWVsZEVkaXRvclBhbmVsIHsuLi5wcm9wczJ9IC8+XG4gICAgICAgIDwvVGVzdFdyYXBwZXI+LFxuICAgICAgKVxuICAgICAgY29uc3Qgc2Vjb25kRm9ybURhdGEgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0taW5pdGlhbC1kYXRhJykudGV4dENvbnRlbnRcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoZmlyc3RGb3JtRGF0YSkubm90LnRvQmUoc2Vjb25kRm9ybURhdGEpXG4gICAgICBleHBlY3QoZmlyc3RGb3JtRGF0YSkudG9Db250YWluKCd2YXIxJylcbiAgICAgIGV4cGVjdChzZWNvbmRGb3JtRGF0YSkudG9Db250YWluKCd2YXIyJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBpbml0aWFsRGF0YSBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRWRpdG9yUHJvcHMoeyBpbml0aWFsRGF0YTogdW5kZWZpbmVkIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KCgpID0+XG4gICAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+KSxcbiAgICAgICkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBjbG9zZSBidXR0b24gY2xpY2tzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHsgb25DbG9zZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRFZGl0b3JQYW5lbCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgY2xvc2VCdXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gY2xvc2VCdXR0b25zLmZpbmQoYnRuID0+IGJ0bi5xdWVyeVNlbGVjdG9yKCdzdmcnKSlcblxuICAgICAgaWYgKGNsb3NlQnV0dG9uKSB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlQnV0dG9uKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2xvc2VCdXR0b24pXG4gICAgICB9XG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gaW5pdGlhbERhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbml0aWFsRGF0YSA9IGNyZWF0ZUlucHV0VmFyKHtcbiAgICAgICAgbGFiZWw6ICdUZXN0IDxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nLFxuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgdG9vbHRpcHM6ICdUb29sdGlwIHdpdGggXCJxdW90ZXNcIiBhbmQgXFwnYXBvc3Ryb3BoZXNcXCcnLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHsgaW5pdGlhbERhdGEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIHZhbHVlcyBpbiBpbml0aWFsRGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxEYXRhID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICBsYWJlbDogJycsXG4gICAgICAgIHZhcmlhYmxlOiAnJyxcbiAgICAgICAgZGVmYXVsdF92YWx1ZTogJycsXG4gICAgICAgIHRvb2x0aXBzOiAnJyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICcnLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEVkaXRvclByb3BzKHsgaW5pdGlhbERhdGEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRWRpdG9yUGFuZWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVXRpbHMgVGVzdHMgLSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGFcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ2NvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YScsICgpID0+IHtcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBCYXNpYyBDb252ZXJzaW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0Jhc2ljIENvbnZlcnNpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IElucHV0VmFyIHRvIEZvcm1EYXRhIHdpdGggYWxsIGZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0VmFyID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsXG4gICAgICAgIGxhYmVsOiAnVGVzdCcsXG4gICAgICAgIHZhcmlhYmxlOiAndGVzdF92YXInLFxuICAgICAgICBtYXhfbGVuZ3RoOiAxMDAsXG4gICAgICAgIGRlZmF1bHRfdmFsdWU6ICdkZWZhdWx0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHRvb2x0aXBzOiAndG9vbHRpcCcsXG4gICAgICAgIG9wdGlvbnM6IFsnYScsICdiJ10sXG4gICAgICAgIHBsYWNlaG9sZGVyOiAncGxhY2Vob2xkZXInLFxuICAgICAgICB1bml0OiAna2cnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dClcbiAgICAgIGV4cGVjdChyZXN1bHQubGFiZWwpLnRvQmUoJ1Rlc3QnKVxuICAgICAgZXhwZWN0KHJlc3VsdC52YXJpYWJsZSkudG9CZSgndGVzdF92YXInKVxuICAgICAgZXhwZWN0KHJlc3VsdC5tYXhMZW5ndGgpLnRvQmUoMTAwKVxuICAgICAgZXhwZWN0KHJlc3VsdC5kZWZhdWx0KS50b0JlKCdkZWZhdWx0JylcbiAgICAgIGV4cGVjdChyZXN1bHQucmVxdWlyZWQpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChyZXN1bHQudG9vbHRpcHMpLnRvQmUoJ3Rvb2x0aXAnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5vcHRpb25zKS50b0VxdWFsKFsnYScsICdiJ10pXG4gICAgICBleHBlY3QocmVzdWx0LnBsYWNlaG9sZGVyKS50b0JlKCdwbGFjZWhvbGRlcicpXG4gICAgICBleHBlY3QocmVzdWx0LnVuaXQpLnRvQmUoJ2tnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IGZpbGUtcmVsYXRlZCBmaWVsZHMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUsXG4gICAgICAgIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogWydsb2NhbF9maWxlJywgJ3JlbW90ZV91cmwnXSBhcyBUcmFuc2Zlck1ldGhvZFtdLFxuICAgICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IFsnaW1hZ2UnLCAnZG9jdW1lbnQnXSBhcyBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzW10sXG4gICAgICAgIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiBbJy5qcGcnLCAnLnBkZiddLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkRmlsZVVwbG9hZE1ldGhvZHMpLnRvRXF1YWwoW1xuICAgICAgICAnbG9jYWxfZmlsZScsXG4gICAgICAgICdyZW1vdGVfdXJsJyxcbiAgICAgIF0pXG4gICAgICBleHBlY3QocmVzdWx0LmFsbG93ZWRUeXBlc0FuZEV4dGVuc2lvbnMpLnRvRXF1YWwoe1xuICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBbJ2ltYWdlJywgJ2RvY3VtZW50J10sXG4gICAgICAgIGFsbG93ZWRGaWxlRXh0ZW5zaW9uczogWycuanBnJywgJy5wZGYnXSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGRlZmF1bHQgdGVtcGxhdGUgd2hlbiBkYXRhIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydFRvSW5wdXRGaWVsZEZvcm1EYXRhKHVuZGVmaW5lZClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0KVxuICAgICAgZXhwZWN0KHJlc3VsdC52YXJpYWJsZSkudG9CZSgnJylcbiAgICAgIGV4cGVjdChyZXN1bHQubGFiZWwpLnRvQmUoJycpXG4gICAgICBleHBlY3QocmVzdWx0LnJlcXVpcmVkKS50b0JlKHRydWUpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE9wdGlvbmFsIEZpZWxkcyBIYW5kbGluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdPcHRpb25hbCBGaWVsZHMgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3QgaW5jbHVkZSBkZWZhdWx0IHdoZW4gZGVmYXVsdF92YWx1ZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dFZhciA9IGNyZWF0ZUlucHV0VmFyKHtcbiAgICAgICAgZGVmYXVsdF92YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5kZWZhdWx0KS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgaW5jbHVkZSBkZWZhdWx0IHdoZW4gZGVmYXVsdF92YWx1ZSBpcyBudWxsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXI6IElucHV0VmFyID0ge1xuICAgICAgICAuLi5jcmVhdGVJbnB1dFZhcigpLFxuICAgICAgICBkZWZhdWx0X3ZhbHVlOiBudWxsIGFzIHVua25vd24gYXMgc3RyaW5nLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YShpbnB1dFZhcilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmRlZmF1bHQpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgZGVmYXVsdCB3aGVuIGRlZmF1bHRfdmFsdWUgaXMgZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIGRlZmF1bHRfdmFsdWU6ICcnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5kZWZhdWx0KS50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBpbmNsdWRlIHRvb2x0aXBzIHdoZW4gdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIHRvb2x0aXBzOiB1bmRlZmluZWQsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YShpbnB1dFZhcilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnRvb2x0aXBzKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgaW5jbHVkZSBwbGFjZWhvbGRlciB3aGVuIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0VmFyID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICBwbGFjZWhvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5wbGFjZWhvbGRlcikudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGluY2x1ZGUgdW5pdCB3aGVuIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0VmFyID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICB1bml0OiB1bmRlZmluZWQsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YShpbnB1dFZhcilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnVuaXQpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBpbmNsdWRlIGZpbGUgc2V0dGluZ3Mgd2hlbiBhbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogdW5kZWZpbmVkLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkRmlsZVVwbG9hZE1ldGhvZHMpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBpbmNsdWRlIGFsbG93ZWRUeXBlc0FuZEV4dGVuc2lvbnMgZGV0YWlscyB3aGVuIGZpbGUgdHlwZXMvZXh0ZW5zaW9ucyBhcmUgbWlzc2luZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0VmFyID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IHVuZGVmaW5lZCxcbiAgICAgICAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydFRvSW5wdXRGaWVsZEZvcm1EYXRhKGlucHV0VmFyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuYWxsb3dlZFR5cGVzQW5kRXh0ZW5zaW9ucykudG9FcXVhbCh7fSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVHlwZS1TcGVjaWZpYyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdUeXBlLVNwZWNpZmljIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRleHRJbnB1dCB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgICAgbWF4X2xlbmd0aDogMjU2LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dClcbiAgICAgIGV4cGVjdChyZXN1bHQubWF4TGVuZ3RoKS50b0JlKDI1NilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFyYWdyYXBoIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dFZhciA9IGNyZWF0ZUlucHV0VmFyKHtcbiAgICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUucGFyYWdyYXBoLFxuICAgICAgICBtYXhfbGVuZ3RoOiAxMDAwLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnBhcmFncmFwaClcbiAgICAgIGV4cGVjdChyZXN1bHQubWF4TGVuZ3RoKS50b0JlKDEwMDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bWJlciB0eXBlIHdpdGggdW5pdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0VmFyID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5udW1iZXIsXG4gICAgICAgIHVuaXQ6ICdtZXRlcnMnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlcilcbiAgICAgIGV4cGVjdChyZXN1bHQudW5pdCkudG9CZSgnbWV0ZXJzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2VsZWN0IHR5cGUgd2l0aCBvcHRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNlbGVjdCxcbiAgICAgICAgb3B0aW9uczogWydPcHRpb24gQScsICdPcHRpb24gQicsICdPcHRpb24gQyddLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNlbGVjdClcbiAgICAgIGV4cGVjdChyZXN1bHQub3B0aW9ucykudG9FcXVhbChbJ09wdGlvbiBBJywgJ09wdGlvbiBCJywgJ09wdGlvbiBDJ10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNpbmdsZUZpbGUgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0VmFyID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5zaW5nbGVGaWxlLFxuICAgICAgICBhbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHM6IFsnbG9jYWxfZmlsZSddIGFzIFRyYW5zZmVyTWV0aG9kW10sXG4gICAgICAgIGFsbG93ZWRfZmlsZV90eXBlczogWydpbWFnZSddIGFzIFN1cHBvcnRVcGxvYWRGaWxlVHlwZXNbXSxcbiAgICAgICAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IFsnLmpwZyddLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUpXG4gICAgICBleHBlY3QocmVzdWx0LmFsbG93ZWRGaWxlVXBsb2FkTWV0aG9kcykudG9FcXVhbChbJ2xvY2FsX2ZpbGUnXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlGaWxlcyB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMsXG4gICAgICAgIG1heF9sZW5ndGg6IDUsXG4gICAgICAgIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogWydsb2NhbF9maWxlJywgJ3JlbW90ZV91cmwnXSBhcyBUcmFuc2Zlck1ldGhvZFtdLFxuICAgICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IFsnZG9jdW1lbnQnXSBhcyBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzW10sXG4gICAgICAgIGFsbG93ZWRfZmlsZV9leHRlbnNpb25zOiBbJy5wZGYnLCAnLmRvYyddLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMpXG4gICAgICBleHBlY3QocmVzdWx0Lm1heExlbmd0aCkudG9CZSg1KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjaGVja2JveCB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLmNoZWNrYm94LFxuICAgICAgICBkZWZhdWx0X3ZhbHVlOiAndHJ1ZScsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YShpbnB1dFZhcilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoUGlwZWxpbmVJbnB1dFZhclR5cGUuY2hlY2tib3gpXG4gICAgICBleHBlY3QocmVzdWx0LmRlZmF1bHQpLnRvQmUoJ3RydWUnKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBVdGlscyBUZXN0cyAtIGNvbnZlcnRGb3JtRGF0YVRvSU5wdXRGaWVsZFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkJywgKCkgPT4ge1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEJhc2ljIENvbnZlcnNpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQmFzaWMgQ29udmVyc2lvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgRm9ybURhdGEgdG8gSW5wdXRWYXIgd2l0aCBhbGwgZmllbGRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZm9ybURhdGEgPSBjcmVhdGVGb3JtRGF0YSh7XG4gICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgdmFyaWFibGU6ICd0ZXN0X3ZhcicsXG4gICAgICAgIG1heExlbmd0aDogMTAwLFxuICAgICAgICBkZWZhdWx0OiAnZGVmYXVsdCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB0b29sdGlwczogJ3Rvb2x0aXAnLFxuICAgICAgICBvcHRpb25zOiBbJ2EnLCAnYiddLFxuICAgICAgICBwbGFjZWhvbGRlcjogJ3BsYWNlaG9sZGVyJyxcbiAgICAgICAgdW5pdDogJ2tnJyxcbiAgICAgICAgYWxsb3dlZEZpbGVVcGxvYWRNZXRob2RzOiBbJ2xvY2FsX2ZpbGUnXSBhcyBUcmFuc2Zlck1ldGhvZFtdLFxuICAgICAgICBhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zOiB7XG4gICAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogWydpbWFnZSddIGFzIFN1cHBvcnRVcGxvYWRGaWxlVHlwZXNbXSxcbiAgICAgICAgICBhbGxvd2VkRmlsZUV4dGVuc2lvbnM6IFsnLmpwZyddLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dClcbiAgICAgIGV4cGVjdChyZXN1bHQubGFiZWwpLnRvQmUoJ1Rlc3QnKVxuICAgICAgZXhwZWN0KHJlc3VsdC52YXJpYWJsZSkudG9CZSgndGVzdF92YXInKVxuICAgICAgZXhwZWN0KHJlc3VsdC5tYXhfbGVuZ3RoKS50b0JlKDEwMClcbiAgICAgIGV4cGVjdChyZXN1bHQuZGVmYXVsdF92YWx1ZSkudG9CZSgnZGVmYXVsdCcpXG4gICAgICBleHBlY3QocmVzdWx0LnJlcXVpcmVkKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QocmVzdWx0LnRvb2x0aXBzKS50b0JlKCd0b29sdGlwJylcbiAgICAgIGV4cGVjdChyZXN1bHQub3B0aW9ucykudG9FcXVhbChbJ2EnLCAnYiddKVxuICAgICAgZXhwZWN0KHJlc3VsdC5wbGFjZWhvbGRlcikudG9CZSgncGxhY2Vob2xkZXInKVxuICAgICAgZXhwZWN0KHJlc3VsdC51bml0KS50b0JlKCdrZycpXG4gICAgICBleHBlY3QocmVzdWx0LmFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kcykudG9FcXVhbChbJ2xvY2FsX2ZpbGUnXSlcbiAgICAgIGV4cGVjdChyZXN1bHQuYWxsb3dlZF9maWxlX3R5cGVzKS50b0VxdWFsKFsnaW1hZ2UnXSlcbiAgICAgIGV4cGVjdChyZXN1bHQuYWxsb3dlZF9maWxlX2V4dGVuc2lvbnMpLnRvRXF1YWwoWycuanBnJ10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBvcHRpb25hbCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICB0b29sdGlwczogdW5kZWZpbmVkLFxuICAgICAgICBwbGFjZWhvbGRlcjogdW5kZWZpbmVkLFxuICAgICAgICB1bml0OiB1bmRlZmluZWQsXG4gICAgICAgIGFsbG93ZWRGaWxlVXBsb2FkTWV0aG9kczogdW5kZWZpbmVkLFxuICAgICAgICBhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zOiB7XG4gICAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogdW5kZWZpbmVkLFxuICAgICAgICAgIGFsbG93ZWRGaWxlRXh0ZW5zaW9uczogdW5kZWZpbmVkLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5kZWZhdWx0X3ZhbHVlKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChyZXN1bHQudG9vbHRpcHMpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHJlc3VsdC5wbGFjZWhvbGRlcikudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QocmVzdWx0LnVuaXQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkX2ZpbGVfdHlwZXMpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkX2ZpbGVfZXh0ZW5zaW9ucykudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEZpZWxkIE1hcHBpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRmllbGQgTWFwcGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1hcCBtYXhMZW5ndGggdG8gbWF4X2xlbmd0aCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gY3JlYXRlRm9ybURhdGEoeyBtYXhMZW5ndGg6IDI1NiB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRGb3JtRGF0YVRvSU5wdXRGaWVsZChmb3JtRGF0YSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0Lm1heF9sZW5ndGgpLnRvQmUoMjU2KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1hcCBkZWZhdWx0IHRvIGRlZmF1bHRfdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHsgZGVmYXVsdDogJ215IGRlZmF1bHQnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkKGZvcm1EYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuZGVmYXVsdF92YWx1ZSkudG9CZSgnbXkgZGVmYXVsdCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFwIGFsbG93ZWRGaWxlVXBsb2FkTWV0aG9kcyB0byBhbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgYWxsb3dlZEZpbGVVcGxvYWRNZXRob2RzOiBbJ2xvY2FsX2ZpbGUnLCAncmVtb3RlX3VybCddIGFzIFRyYW5zZmVyTWV0aG9kW10sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRGb3JtRGF0YVRvSU5wdXRGaWVsZChmb3JtRGF0YSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kcykudG9FcXVhbChbXG4gICAgICAgICdsb2NhbF9maWxlJyxcbiAgICAgICAgJ3JlbW90ZV91cmwnLFxuICAgICAgXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYXAgYWxsb3dlZFR5cGVzQW5kRXh0ZW5zaW9ucyB0byBzZXBhcmF0ZSBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgYWxsb3dlZFR5cGVzQW5kRXh0ZW5zaW9uczoge1xuICAgICAgICAgIGFsbG93ZWRGaWxlVHlwZXM6IFsnaW1hZ2UnLCAnZG9jdW1lbnQnXSBhcyBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzW10sXG4gICAgICAgICAgYWxsb3dlZEZpbGVFeHRlbnNpb25zOiBbJy5qcGcnLCAnLnBkZiddLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkX2ZpbGVfdHlwZXMpLnRvRXF1YWwoWydpbWFnZScsICdkb2N1bWVudCddKVxuICAgICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkX2ZpbGVfZXh0ZW5zaW9ucykudG9FcXVhbChbJy5qcGcnLCAnLnBkZiddKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBUeXBlLVNwZWNpZmljIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1R5cGUtU3BlY2lmaWMgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSB0ZXh0SW5wdXQgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gY3JlYXRlRm9ybURhdGEoeyB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBwYXJhZ3JhcGggdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gY3JlYXRlRm9ybURhdGEoeyB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5wYXJhZ3JhcGggfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnBhcmFncmFwaClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBzZWxlY3QgdHlwZSB3aXRoIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0LFxuICAgICAgICBvcHRpb25zOiBbJ0EnLCAnQicsICdDJ10sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRGb3JtRGF0YVRvSU5wdXRGaWVsZChmb3JtRGF0YSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0KVxuICAgICAgZXhwZWN0KHJlc3VsdC5vcHRpb25zKS50b0VxdWFsKFsnQScsICdCJywgJ0MnXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBudW1iZXIgdHlwZSB3aXRoIHVuaXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLFxuICAgICAgICB1bml0OiAna2cnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlcilcbiAgICAgIGV4cGVjdChyZXN1bHQudW5pdCkudG9CZSgna2cnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIHNpbmdsZUZpbGUgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gY3JlYXRlRm9ybURhdGEoe1xuICAgICAgICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5zaW5nbGVGaWxlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgbXVsdGlGaWxlcyB0eXBlIHdpdGggbWF4TGVuZ3RoJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZm9ybURhdGEgPSBjcmVhdGVGb3JtRGF0YSh7XG4gICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMsXG4gICAgICAgIG1heExlbmd0aDogMTAsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRGb3JtRGF0YVRvSU5wdXRGaWVsZChmb3JtRGF0YSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUoUGlwZWxpbmVJbnB1dFZhclR5cGUubXVsdGlGaWxlcylcbiAgICAgIGV4cGVjdChyZXN1bHQubWF4X2xlbmd0aCkudG9CZSgxMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBjaGVja2JveCB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZm9ybURhdGEgPSBjcmVhdGVGb3JtRGF0YSh7IHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLmNoZWNrYm94IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkKGZvcm1EYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQudHlwZSkudG9CZShQaXBlbGluZUlucHV0VmFyVHlwZS5jaGVja2JveClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUm91bmQtVHJpcCBDb252ZXJzaW9uIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdSb3VuZC1UcmlwIENvbnZlcnNpb24nLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcHJlc2VydmUgZGF0YSB0aHJvdWdoIHJvdW5kLXRyaXAgY29udmVyc2lvbiBmb3IgdGV4dElucHV0JywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBvcmlnaW5hbCA9IGNyZWF0ZUlucHV0VmFyKHtcbiAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgIGxhYmVsOiAnVGVzdCBMYWJlbCcsXG4gICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgIG1heF9sZW5ndGg6IDEwMCxcbiAgICAgIGRlZmF1bHRfdmFsdWU6ICdkZWZhdWx0JyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgdG9vbHRpcHM6ICd0b29sdGlwJyxcbiAgICAgIHBsYWNlaG9sZGVyOiAncGxhY2Vob2xkZXInLFxuICAgIH0pXG5cbiAgICAvLyBBY3RcbiAgICBjb25zdCBmb3JtRGF0YSA9IGNvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YShvcmlnaW5hbClcbiAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QocmVzdWx0LnR5cGUpLnRvQmUob3JpZ2luYWwudHlwZSlcbiAgICBleHBlY3QocmVzdWx0LmxhYmVsKS50b0JlKG9yaWdpbmFsLmxhYmVsKVxuICAgIGV4cGVjdChyZXN1bHQudmFyaWFibGUpLnRvQmUob3JpZ2luYWwudmFyaWFibGUpXG4gICAgZXhwZWN0KHJlc3VsdC5tYXhfbGVuZ3RoKS50b0JlKG9yaWdpbmFsLm1heF9sZW5ndGgpXG4gICAgZXhwZWN0KHJlc3VsdC5kZWZhdWx0X3ZhbHVlKS50b0JlKG9yaWdpbmFsLmRlZmF1bHRfdmFsdWUpXG4gICAgZXhwZWN0KHJlc3VsdC5yZXF1aXJlZCkudG9CZShvcmlnaW5hbC5yZXF1aXJlZClcbiAgICBleHBlY3QocmVzdWx0LnRvb2x0aXBzKS50b0JlKG9yaWdpbmFsLnRvb2x0aXBzKVxuICAgIGV4cGVjdChyZXN1bHQucGxhY2Vob2xkZXIpLnRvQmUob3JpZ2luYWwucGxhY2Vob2xkZXIpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBkYXRhIHRocm91Z2ggcm91bmQtdHJpcCBjb252ZXJzaW9uIGZvciBzZWxlY3QnLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IG9yaWdpbmFsID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0LFxuICAgICAgb3B0aW9uczogWydPcHRpb24gQScsICdPcHRpb24gQicsICdPcHRpb24gQyddLFxuICAgICAgZGVmYXVsdF92YWx1ZTogJ09wdGlvbiBBJyxcbiAgICB9KVxuXG4gICAgLy8gQWN0XG4gICAgY29uc3QgZm9ybURhdGEgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEob3JpZ2luYWwpXG4gICAgY29uc3QgcmVzdWx0ID0gY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkKGZvcm1EYXRhKVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKG9yaWdpbmFsLnR5cGUpXG4gICAgZXhwZWN0KHJlc3VsdC5vcHRpb25zKS50b0VxdWFsKG9yaWdpbmFsLm9wdGlvbnMpXG4gICAgZXhwZWN0KHJlc3VsdC5kZWZhdWx0X3ZhbHVlKS50b0JlKG9yaWdpbmFsLmRlZmF1bHRfdmFsdWUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBkYXRhIHRocm91Z2ggcm91bmQtdHJpcCBjb252ZXJzaW9uIGZvciBmaWxlIHR5cGVzJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBvcmlnaW5hbCA9IGNyZWF0ZUlucHV0VmFyKHtcbiAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMsXG4gICAgICBtYXhfbGVuZ3RoOiA1LFxuICAgICAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBbJ2xvY2FsX2ZpbGUnLCAncmVtb3RlX3VybCddIGFzIFRyYW5zZmVyTWV0aG9kW10sXG4gICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IFsnaW1hZ2UnLCAnZG9jdW1lbnQnXSBhcyBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzW10sXG4gICAgICBhbGxvd2VkX2ZpbGVfZXh0ZW5zaW9uczogWycuanBnJywgJy5wZGYnXSxcbiAgICB9KVxuXG4gICAgLy8gQWN0XG4gICAgY29uc3QgZm9ybURhdGEgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEob3JpZ2luYWwpXG4gICAgY29uc3QgcmVzdWx0ID0gY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkKGZvcm1EYXRhKVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKG9yaWdpbmFsLnR5cGUpXG4gICAgZXhwZWN0KHJlc3VsdC5tYXhfbGVuZ3RoKS50b0JlKG9yaWdpbmFsLm1heF9sZW5ndGgpXG4gICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMpLnRvRXF1YWwoXG4gICAgICBvcmlnaW5hbC5hbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHMsXG4gICAgKVxuICAgIGV4cGVjdChyZXN1bHQuYWxsb3dlZF9maWxlX3R5cGVzKS50b0VxdWFsKG9yaWdpbmFsLmFsbG93ZWRfZmlsZV90eXBlcylcbiAgICBleHBlY3QocmVzdWx0LmFsbG93ZWRfZmlsZV9leHRlbnNpb25zKS50b0VxdWFsKFxuICAgICAgb3JpZ2luYWwuYWxsb3dlZF9maWxlX2V4dGVuc2lvbnMsXG4gICAgKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIGFsbCBpbnB1dCB0eXBlcyB0aHJvdWdoIHJvdW5kLXRyaXAnLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IHR5cGVzVG9UZXN0ID0gW1xuICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUucGFyYWdyYXBoLFxuICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLFxuICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0LFxuICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUuc2luZ2xlRmlsZSxcbiAgICAgIFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMsXG4gICAgICBQaXBlbGluZUlucHV0VmFyVHlwZS5jaGVja2JveCxcbiAgICBdXG5cbiAgICB0eXBlc1RvVGVzdC5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICBjb25zdCBvcmlnaW5hbCA9IGNyZWF0ZUlucHV0VmFyKHsgdHlwZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gY29udmVydFRvSW5wdXRGaWVsZEZvcm1EYXRhKG9yaWdpbmFsKVxuICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkKGZvcm1EYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQudHlwZSkudG9CZShvcmlnaW5hbC50eXBlKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBFZGdlIENhc2VzIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY29udmVydFRvSW5wdXRGaWVsZEZvcm1EYXRhIGVkZ2UgY2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgemVybyBtYXhMZW5ndGgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dFZhciA9IGNyZWF0ZUlucHV0VmFyKHsgbWF4X2xlbmd0aDogMCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YShpbnB1dFZhcilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0Lm1heExlbmd0aCkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBvcHRpb25zIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7IG9wdGlvbnM6IFtdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydFRvSW5wdXRGaWVsZEZvcm1EYXRhKGlucHV0VmFyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQub3B0aW9ucykudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb3B0aW9ucyB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0VmFyID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICBvcHRpb25zOiBbJzxzY3JpcHQ+JywgJ1wicXVvdGVkXCInLCAnXFwnYXBvc3Ryb3BoZVxcJycsICcmYW1wOyddLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9JbnB1dEZpZWxkRm9ybURhdGEoaW5wdXRWYXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5vcHRpb25zKS50b0VxdWFsKFtcbiAgICAgICAgJzxzY3JpcHQ+JyxcbiAgICAgICAgJ1wicXVvdGVkXCInLFxuICAgICAgICAnXFwnYXBvc3Ryb3BoZVxcJycsXG4gICAgICAgICcmYW1wOycsXG4gICAgICBdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgc3RyaW5ncycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdTdHJpbmcgPSAnYScucmVwZWF0KDEwMDAwKVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIGxhYmVsOiBsb25nU3RyaW5nLFxuICAgICAgICB0b29sdGlwczogbG9uZ1N0cmluZyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydFRvSW5wdXRGaWVsZEZvcm1EYXRhKGlucHV0VmFyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQubGFiZWwpLnRvQmUobG9uZ1N0cmluZylcbiAgICAgIGV4cGVjdChyZXN1bHQudG9vbHRpcHMpLnRvQmUobG9uZ1N0cmluZylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5pY29kZSBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRWYXIgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIGxhYmVsOiAn5rWL6K+V5qCH562+IPCfjoknLFxuICAgICAgICB0b29sdGlwczogJ+ODhOODvOODq+ODgeODg+ODlyDwn5iAJyxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdQbGF0emhhbHRlciDDsSDDqScsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRUb0lucHV0RmllbGRGb3JtRGF0YShpbnB1dFZhcilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmxhYmVsKS50b0JlKCfmtYvor5XmoIfnrb4g8J+OiScpXG4gICAgICBleHBlY3QocmVzdWx0LnRvb2x0aXBzKS50b0JlKCfjg4Tjg7zjg6vjg4Hjg4Pjg5cg8J+YgCcpXG4gICAgICBleHBlY3QocmVzdWx0LnBsYWNlaG9sZGVyKS50b0JlKCdQbGF0emhhbHRlciDDsSDDqScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkIGVkZ2UgY2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgemVybyBtYXhMZW5ndGgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHsgbWF4TGVuZ3RoOiAwIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkKGZvcm1EYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQubWF4X2xlbmd0aCkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZm9ybURhdGEgPSBjcmVhdGVGb3JtRGF0YSh7XG4gICAgICAgIGFsbG93ZWRUeXBlc0FuZEV4dGVuc2lvbnM6IHtcbiAgICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBbXSxcbiAgICAgICAgICBhbGxvd2VkRmlsZUV4dGVuc2lvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5hbGxvd2VkX2ZpbGVfdHlwZXMpLnRvRXF1YWwoW10pXG4gICAgICBleHBlY3QocmVzdWx0LmFsbG93ZWRfZmlsZV9leHRlbnNpb25zKS50b0VxdWFsKFtdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBib29sZWFuIGRlZmF1bHQgdmFsdWUgKGNoZWNrYm94KScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gY3JlYXRlRm9ybURhdGEoe1xuICAgICAgICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5jaGVja2JveCxcbiAgICAgICAgZGVmYXVsdDogJ3RydWUnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5kZWZhdWx0X3ZhbHVlKS50b0JlKCd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVtZXJpYyBkZWZhdWx0IHZhbHVlIChudW1iZXIgdHlwZSknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmb3JtRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLFxuICAgICAgICBkZWZhdWx0OiAnNDInLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0Rm9ybURhdGFUb0lOcHV0RmllbGQoZm9ybURhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5kZWZhdWx0X3ZhbHVlKS50b0JlKCc0MicpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhvb2sgTWVtb2l6YXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0hvb2sgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcmV0dXJuIHN0YWJsZSBjYWxsYmFjayByZWZlcmVuY2UgZm9yIGhhbmRsZVN1Ym1pdCcsICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgbGV0IGhhbmRsZVN1Ym1pdFJlZjE6ICgodmFsdWU6IEZvcm1EYXRhKSA9PiB2b2lkKSB8IHVuZGVmaW5lZFxuICAgIGxldCBoYW5kbGVTdWJtaXRSZWYyOiAoKHZhbHVlOiBGb3JtRGF0YSkgPT4gdm9pZCkgfCB1bmRlZmluZWRcblxuICAgIGNvbnN0IFRlc3RDb21wb25lbnQgPSAoe1xuICAgICAgY2FwdHVyZSxcbiAgICAgIHN1Ym1pdEZuLFxuICAgIH06IHtcbiAgICAgIGNhcHR1cmU6IChyZWY6ICh2YWx1ZTogRm9ybURhdGEpID0+IHZvaWQpID0+IHZvaWRcbiAgICAgIHN1Ym1pdEZuOiAoZGF0YTogSW5wdXRWYXIpID0+IHZvaWRcbiAgICB9KSA9PiB7XG4gICAgICBjb25zdCBoYW5kbGVTdWJtaXQgPSBSZWFjdC51c2VDYWxsYmFjayhcbiAgICAgICAgKHZhbHVlOiBGb3JtRGF0YSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0RmllbGREYXRhID0gY29udmVydEZvcm1EYXRhVG9JTnB1dEZpZWxkKHZhbHVlKVxuICAgICAgICAgIHN1Ym1pdEZuKGlucHV0RmllbGREYXRhKVxuICAgICAgICB9LFxuICAgICAgICBbc3VibWl0Rm5dLFxuICAgICAgKVxuICAgICAgY2FwdHVyZShoYW5kbGVTdWJtaXQpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cblxuICAgIC8vIEFjdFxuICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgIDxUZXN0Q29tcG9uZW50IGNhcHR1cmU9eyhyZWYpID0+IHsgaGFuZGxlU3VibWl0UmVmMSA9IHJlZiB9fSBzdWJtaXRGbj17b25TdWJtaXR9IC8+LFxuICAgIClcbiAgICByZXJlbmRlcihcbiAgICAgIDxUZXN0Q29tcG9uZW50IGNhcHR1cmU9eyhyZWYpID0+IHsgaGFuZGxlU3VibWl0UmVmMiA9IHJlZiB9fSBzdWJtaXRGbj17b25TdWJtaXR9IC8+LFxuICAgIClcblxuICAgIC8vIEFzc2VydCAtIGNhbGxiYWNrIHNob3VsZCBiZSBzYW1lIHJlZmVyZW5jZSBkdWUgdG8gdXNlQ2FsbGJhY2tcbiAgICBleHBlY3QoaGFuZGxlU3VibWl0UmVmMSkudG9CZShoYW5kbGVTdWJtaXRSZWYyKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIHN0YWJsZSBmb3JtRGF0YSB3aGVuIGluaXRpYWxEYXRhIGlzIHVuY2hhbmdlZCcsICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgY29uc3QgaW5pdGlhbERhdGEgPSBjcmVhdGVJbnB1dFZhcigpXG4gICAgbGV0IGZvcm1EYXRhMTogRm9ybURhdGEgfCB1bmRlZmluZWRcbiAgICBsZXQgZm9ybURhdGEyOiBGb3JtRGF0YSB8IHVuZGVmaW5lZFxuXG4gICAgY29uc3QgVGVzdENvbXBvbmVudCA9ICh7XG4gICAgICBkYXRhLFxuICAgICAgY2FwdHVyZSxcbiAgICB9OiB7XG4gICAgICBkYXRhOiBJbnB1dFZhclxuICAgICAgY2FwdHVyZTogKGZkOiBGb3JtRGF0YSkgPT4gdm9pZFxuICAgIH0pID0+IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gUmVhY3QudXNlTWVtbyhcbiAgICAgICAgKCkgPT4gY29udmVydFRvSW5wdXRGaWVsZEZvcm1EYXRhKGRhdGEpLFxuICAgICAgICBbZGF0YV0sXG4gICAgICApXG4gICAgICBjYXB0dXJlKGZvcm1EYXRhKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICAvLyBBY3RcbiAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICA8VGVzdENvbXBvbmVudFxuICAgICAgICBkYXRhPXtpbml0aWFsRGF0YX1cbiAgICAgICAgY2FwdHVyZT17KGZkKSA9PiB7IGZvcm1EYXRhMSA9IGZkIH19XG4gICAgICAvPixcbiAgICApXG4gICAgcmVyZW5kZXIoXG4gICAgICA8VGVzdENvbXBvbmVudFxuICAgICAgICBkYXRhPXtpbml0aWFsRGF0YX1cbiAgICAgICAgY2FwdHVyZT17KGZkKSA9PiB7IGZvcm1EYXRhMiA9IGZkIH19XG4gICAgICAvPixcbiAgICApXG5cbiAgICAvLyBBc3NlcnQgLSBmb3JtRGF0YSBzaG91bGQgYmUgc2FtZSByZWZlcmVuY2UgZHVlIHRvIHVzZU1lbW9cbiAgICBleHBlY3QoZm9ybURhdGExKS50b0JlKGZvcm1EYXRhMilcbiAgfSlcbn0pXG4iXX0=