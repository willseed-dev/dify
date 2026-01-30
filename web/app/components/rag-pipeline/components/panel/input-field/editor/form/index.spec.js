"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const React = require("react");
const pipeline_1 = require("@/models/pipeline");
const hooks_1 = require("./hooks");
const index_1 = require("./index");
const schema_1 = require("./schema");
// Type helper for partial listener event parameters in tests
// Using double assertion for test mocks with incomplete event objects
const createMockEvent = (value) => ({ value });
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock file upload config service
const mockFileUploadConfig = {
    image_file_size_limit: 10,
    file_size_limit: 15,
    audio_file_size_limit: 50,
    video_file_size_limit: 100,
    workflow_file_upload_limit: 10,
};
vi.mock('@/service/use-common', () => ({
    useFileUploadConfig: () => ({
        data: mockFileUploadConfig,
        isLoading: false,
        error: null,
    }),
}));
// Mock Toast static method
vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: vi.fn(),
    },
}));
// ============================================================================
// Test Data Factories
// ============================================================================
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
const createInputFieldFormProps = (overrides) => ({
    initialData: createFormData(),
    supportFile: false,
    onCancel: vi.fn(),
    onSubmit: vi.fn(),
    isEditMode: true,
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
    return (<react_query_1.QueryClientProvider client={queryClient}>
      {children}
    </react_query_1.QueryClientProvider>);
};
const renderWithProviders = (ui) => {
    return (0, react_1.render)(ui, { wrapper: TestWrapper });
};
const renderHookWithProviders = (hook) => {
    return (0, react_1.renderHook)(hook, { wrapper: TestWrapper });
};
// ============================================================================
// InputFieldForm Component Tests
// ============================================================================
describe('InputFieldForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render form without crashing', () => {
            // Arrange
            const props = createInputFieldFormProps();
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should render cancel button', () => {
            // Arrange
            const props = createInputFieldFormProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        });
        it('should render form with initial values', () => {
            // Arrange
            const initialData = createFormData({
                variable: 'custom_var',
                label: 'Custom Label',
            });
            const props = createInputFieldFormProps({ initialData });
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Props Variations Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should handle supportFile=true prop', () => {
            // Arrange
            const props = createInputFieldFormProps({ supportFile: true });
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should handle supportFile=false (default) prop', () => {
            // Arrange
            const props = createInputFieldFormProps({ supportFile: false });
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should handle isEditMode=true prop', () => {
            // Arrange
            const props = createInputFieldFormProps({ isEditMode: true });
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should handle isEditMode=false prop', () => {
            // Arrange
            const props = createInputFieldFormProps({ isEditMode: false });
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should handle different initial data types', () => {
            // Arrange
            const typesToTest = [
                pipeline_1.PipelineInputVarType.textInput,
                pipeline_1.PipelineInputVarType.paragraph,
                pipeline_1.PipelineInputVarType.number,
                pipeline_1.PipelineInputVarType.select,
                pipeline_1.PipelineInputVarType.checkbox,
            ];
            typesToTest.forEach((type) => {
                const initialData = createFormData({ type });
                const props = createInputFieldFormProps({ initialData });
                // Act
                const { container, unmount } = renderWithProviders(<index_1.default {...props}/>);
                // Assert
                expect(container.querySelector('form')).toBeInTheDocument();
                unmount();
            });
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onCancel when cancel button is clicked', async () => {
            // Arrange
            const onCancel = vi.fn();
            const props = createInputFieldFormProps({ onCancel });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /cancel/i }));
            // Assert
            expect(onCancel).toHaveBeenCalledTimes(1);
        });
        it('should prevent default on form submit', async () => {
            // Arrange
            const props = createInputFieldFormProps();
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            const form = container.querySelector('form');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            // Act
            form.dispatchEvent(submitEvent);
            // Assert
            expect(submitEvent.defaultPrevented).toBe(true);
        });
        it('should show Toast error when form validation fails on submit', async () => {
            // Arrange - Create invalid form data with empty variable name (validation should fail)
            const Toast = await Promise.resolve().then(() => require('@/app/components/base/toast'));
            const initialData = createFormData({
                variable: '', // Empty variable should fail validation
                label: 'Test Label',
            });
            const onSubmit = vi.fn();
            const props = createInputFieldFormProps({ initialData, onSubmit });
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert - Toast should be called with error message when validation fails
            await (0, react_1.waitFor)(() => {
                expect(Toast.default.notify).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'error',
                    message: expect.any(String),
                }));
            });
            // onSubmit should not be called when validation fails
            expect(onSubmit).not.toHaveBeenCalled();
        });
        it('should call onSubmit with moreInfo when variable name changes in edit mode', async () => {
            // Arrange - Initial variable name is 'original_var', we change it to 'new_var'
            const initialData = createFormData({
                variable: 'original_var',
                label: 'Test Label',
            });
            const onSubmit = vi.fn();
            const props = createInputFieldFormProps({
                initialData,
                onSubmit,
                isEditMode: true,
            });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Find and change the variable input by label
            const variableInput = react_1.screen.getByLabelText('appDebug.variableConfig.varName');
            react_1.fireEvent.change(variableInput, { target: { value: 'new_var' } });
            // Submit the form
            const form = document.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert - onSubmit should be called with moreInfo containing variable name change info
            await (0, react_1.waitFor)(() => {
                expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                    variable: 'new_var',
                }), expect.objectContaining({
                    type: 'changeVarName',
                    payload: {
                        beforeKey: 'original_var',
                        afterKey: 'new_var',
                    },
                }));
            });
        });
        it('should call onSubmit without moreInfo when variable name does not change in edit mode', async () => {
            // Arrange - Variable name stays the same
            const initialData = createFormData({
                variable: 'same_var',
                label: 'Test Label',
            });
            const onSubmit = vi.fn();
            const props = createInputFieldFormProps({
                initialData,
                onSubmit,
                isEditMode: true,
            });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Submit without changing variable name
            const form = document.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert - onSubmit should be called without moreInfo (undefined)
            await (0, react_1.waitFor)(() => {
                expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                    variable: 'same_var',
                }), undefined);
            });
        });
        it('should call onSubmit without moreInfo when not in edit mode', async () => {
            // Arrange
            const initialData = createFormData({
                variable: 'test_var',
                label: 'Test Label',
            });
            const onSubmit = vi.fn();
            const props = createInputFieldFormProps({
                initialData,
                onSubmit,
                isEditMode: false,
            });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Submit the form
            const form = document.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert - onSubmit should be called without moreInfo since not in edit mode
            await (0, react_1.waitFor)(() => {
                expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), undefined);
            });
        });
    });
    // -------------------------------------------------------------------------
    // State Management Tests
    // -------------------------------------------------------------------------
    describe('State Management', () => {
        it('should initialize showAllSettings state as false', () => {
            // Arrange
            const props = createInputFieldFormProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - ShowAllSettings component should be visible when showAllSettings is false
            expect(react_1.screen.queryByText(/appDebug.variableConfig.showAllSettings/i)).toBeInTheDocument();
        });
        it('should toggle showAllSettings state when clicking show all settings', async () => {
            // Arrange
            const props = createInputFieldFormProps();
            renderWithProviders(<index_1.default {...props}/>);
            // Act - Find and click the show all settings element
            const showAllSettingsElement = react_1.screen.getByText(/appDebug.variableConfig.showAllSettings/i);
            const clickableParent = showAllSettingsElement.closest('.cursor-pointer');
            if (clickableParent) {
                react_1.fireEvent.click(clickableParent);
            }
            // Assert - After clicking, ShowAllSettings should be hidden and HiddenFields should be visible
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText(/appDebug.variableConfig.showAllSettings/i)).not.toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should maintain stable onCancel callback reference', () => {
            // Arrange
            const onCancel = vi.fn();
            const props = createInputFieldFormProps({ onCancel });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            const cancelButton = react_1.screen.getByRole('button', { name: /cancel/i });
            react_1.fireEvent.click(cancelButton);
            react_1.fireEvent.click(cancelButton);
            // Assert
            expect(onCancel).toHaveBeenCalledTimes(2);
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty initial data gracefully', () => {
            // Arrange
            const props = createInputFieldFormProps({
                initialData: {},
            });
            // Act & Assert - should not crash
            expect(() => renderWithProviders(<index_1.default {...props}/>)).not.toThrow();
        });
        it('should handle undefined optional fields', () => {
            // Arrange
            const initialData = {
                type: pipeline_1.PipelineInputVarType.textInput,
                label: 'Test',
                variable: 'test',
                required: true,
                allowedTypesAndExtensions: {
                    allowedFileTypes: [],
                    allowedFileExtensions: [],
                },
                // Other fields are undefined
            };
            const props = createInputFieldFormProps({ initialData });
            // Act & Assert
            expect(() => renderWithProviders(<index_1.default {...props}/>)).not.toThrow();
        });
        it('should handle special characters in variable name', () => {
            // Arrange
            const initialData = createFormData({
                variable: 'test_var_123',
                label: 'Test Label <script>',
            });
            const props = createInputFieldFormProps({ initialData });
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// useHiddenFieldNames Hook Tests
// ============================================================================
describe('useHiddenFieldNames', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Return Value Tests for Different Types
    // -------------------------------------------------------------------------
    describe('Return Values by Type', () => {
        it('should return correct field names for textInput type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenFieldNames)(pipeline_1.PipelineInputVarType.textInput));
            // Assert - should include default value, placeholder, tooltips
            expect(result.current).toContain('appDebug.variableConfig.defaultValue'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.placeholder'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.tooltips'.toLowerCase());
        });
        it('should return correct field names for paragraph type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenFieldNames)(pipeline_1.PipelineInputVarType.paragraph));
            // Assert
            expect(result.current).toContain('appDebug.variableConfig.defaultValue'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.placeholder'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.tooltips'.toLowerCase());
        });
        it('should return correct field names for number type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenFieldNames)(pipeline_1.PipelineInputVarType.number));
            // Assert - should include unit field
            expect(result.current).toContain('appDebug.variableConfig.defaultValue'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.unit'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.placeholder'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.tooltips'.toLowerCase());
        });
        it('should return correct field names for select type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenFieldNames)(pipeline_1.PipelineInputVarType.select));
            // Assert
            expect(result.current).toContain('appDebug.variableConfig.defaultValue'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.tooltips'.toLowerCase());
        });
        it('should return correct field names for singleFile type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenFieldNames)(pipeline_1.PipelineInputVarType.singleFile));
            // Assert
            expect(result.current).toContain('appDebug.variableConfig.uploadMethod'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.tooltips'.toLowerCase());
        });
        it('should return correct field names for multiFiles type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenFieldNames)(pipeline_1.PipelineInputVarType.multiFiles));
            // Assert
            expect(result.current).toContain('appDebug.variableConfig.uploadMethod'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.maxNumberOfUploads'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.tooltips'.toLowerCase());
        });
        it('should return correct field names for checkbox type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenFieldNames)(pipeline_1.PipelineInputVarType.checkbox));
            // Assert
            expect(result.current).toContain('appDebug.variableConfig.startChecked'.toLowerCase());
            expect(result.current).toContain('appDebug.variableConfig.tooltips'.toLowerCase());
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should return tooltips only for unknown type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenFieldNames)('unknown_type'));
            // Assert - should only contain tooltips for unknown types
            expect(result.current).toContain('appDebug.variableConfig.tooltips'.toLowerCase());
        });
    });
});
// ============================================================================
// useConfigurations Hook Tests
// ============================================================================
describe('useConfigurations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Configuration Generation Tests
    // -------------------------------------------------------------------------
    describe('Configuration Generation', () => {
        it('should return array of configurations', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Assert
            expect(Array.isArray(result.current)).toBe(true);
            expect(result.current.length).toBeGreaterThan(0);
        });
        it('should include type field configuration', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Assert
            const typeConfig = result.current.find(config => config.variable === 'type');
            expect(typeConfig).toBeDefined();
            expect(typeConfig?.required).toBe(true);
        });
        it('should include variable field configuration', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Assert
            const variableConfig = result.current.find(config => config.variable === 'variable');
            expect(variableConfig).toBeDefined();
            expect(variableConfig?.required).toBe(true);
        });
        it('should include label field configuration', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Assert
            const labelConfig = result.current.find(config => config.variable === 'label');
            expect(labelConfig).toBeDefined();
            expect(labelConfig?.required).toBe(false);
        });
        it('should include required field configuration', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Assert
            const requiredConfig = result.current.find(config => config.variable === 'required');
            expect(requiredConfig).toBeDefined();
        });
        it('should pass supportFile prop to type configuration', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: true,
            }));
            // Assert
            const typeConfig = result.current.find(config => config.variable === 'type');
            expect(typeConfig?.supportFile).toBe(true);
        });
    });
    // -------------------------------------------------------------------------
    // Callback Tests
    // -------------------------------------------------------------------------
    describe('Callbacks', () => {
        it('should call setFieldValue when type changes to singleFile', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: true,
            }));
            // Act
            const typeConfig = result.current.find(config => config.variable === 'type');
            typeConfig?.listeners?.onChange?.(createMockEvent(pipeline_1.PipelineInputVarType.singleFile));
            // Assert
            expect(mockSetFieldValue).toHaveBeenCalledWith('allowedFileUploadMethods', expect.any(Array));
            expect(mockSetFieldValue).toHaveBeenCalledWith('allowedTypesAndExtensions', expect.any(Object));
        });
        it('should call setFieldValue when type changes to multiFiles', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: true,
            }));
            // Act
            const typeConfig = result.current.find(config => config.variable === 'type');
            typeConfig?.listeners?.onChange?.(createMockEvent(pipeline_1.PipelineInputVarType.multiFiles));
            // Assert
            expect(mockSetFieldValue).toHaveBeenCalledWith('maxLength', expect.any(Number));
        });
        it('should call setFieldValue when type changes to paragraph', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Act
            const typeConfig = result.current.find(config => config.variable === 'type');
            typeConfig?.listeners?.onChange?.(createMockEvent(pipeline_1.PipelineInputVarType.paragraph));
            // Assert
            expect(mockSetFieldValue).toHaveBeenCalledWith('maxLength', 48); // DEFAULT_VALUE_MAX_LEN
        });
        it('should set label from variable name on blur when label is empty', () => {
            // Arrange
            const mockGetFieldValue = vi.fn().mockReturnValue('');
            const mockSetFieldValue = vi.fn();
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Act
            const variableConfig = result.current.find(config => config.variable === 'variable');
            variableConfig?.listeners?.onBlur?.(createMockEvent('test_variable'));
            // Assert
            expect(mockSetFieldValue).toHaveBeenCalledWith('label', 'test_variable');
        });
        it('should not set label from variable name on blur when label is not empty', () => {
            // Arrange
            const mockGetFieldValue = vi.fn().mockReturnValue('Existing Label');
            const mockSetFieldValue = vi.fn();
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Act
            const variableConfig = result.current.find(config => config.variable === 'variable');
            variableConfig?.listeners?.onBlur?.(createMockEvent('test_variable'));
            // Assert
            expect(mockSetFieldValue).not.toHaveBeenCalled();
        });
        it('should reset label to variable name when display name is cleared', () => {
            // Arrange
            const mockGetFieldValue = vi.fn().mockReturnValue('original_var');
            const mockSetFieldValue = vi.fn();
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Act
            const labelConfig = result.current.find(config => config.variable === 'label');
            labelConfig?.listeners?.onBlur?.(createMockEvent(''));
            // Assert
            expect(mockSetFieldValue).toHaveBeenCalledWith('label', 'original_var');
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should return configurations array with correct length', () => {
            // Arrange
            const mockGetFieldValue = vi.fn();
            const mockSetFieldValue = vi.fn();
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useConfigurations)({
                getFieldValue: mockGetFieldValue,
                setFieldValue: mockSetFieldValue,
                supportFile: false,
            }));
            // Assert - should have all expected field configurations
            expect(result.current.length).toBe(8); // type, variable, label, maxLength, options, fileTypes x2, required
        });
    });
});
// ============================================================================
// useHiddenConfigurations Hook Tests
// ============================================================================
describe('useHiddenConfigurations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Configuration Generation Tests
    // -------------------------------------------------------------------------
    describe('Configuration Generation', () => {
        it('should return array of hidden configurations', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            expect(Array.isArray(result.current)).toBe(true);
            expect(result.current.length).toBeGreaterThan(0);
        });
        it('should include default value configurations for different types', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            const defaultConfigs = result.current.filter(config => config.variable === 'default');
            expect(defaultConfigs.length).toBeGreaterThan(0);
        });
        it('should include tooltips configuration', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            const tooltipsConfig = result.current.find(config => config.variable === 'tooltips');
            expect(tooltipsConfig).toBeDefined();
            expect(tooltipsConfig?.showConditions).toEqual([]);
        });
        it('should include placeholder configurations', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            const placeholderConfigs = result.current.filter(config => config.variable === 'placeholder');
            expect(placeholderConfigs.length).toBeGreaterThan(0);
        });
        it('should include unit configuration for number type', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            const unitConfig = result.current.find(config => config.variable === 'unit');
            expect(unitConfig).toBeDefined();
            expect(unitConfig?.showConditions).toContainEqual({
                variable: 'type',
                value: pipeline_1.PipelineInputVarType.number,
            });
        });
        it('should include upload method configurations for file types', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            const uploadMethodConfigs = result.current.filter(config => config.variable === 'allowedFileUploadMethods');
            expect(uploadMethodConfigs.length).toBe(2); // One for singleFile, one for multiFiles
        });
        it('should include maxLength configuration for multiFiles', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            const maxLengthConfig = result.current.find(config => config.variable === 'maxLength'
                && config.showConditions?.some(c => c.value === pipeline_1.PipelineInputVarType.multiFiles));
            expect(maxLengthConfig).toBeDefined();
        });
    });
    // -------------------------------------------------------------------------
    // Options Handling Tests
    // -------------------------------------------------------------------------
    describe('Options Handling', () => {
        it('should generate select options from provided options array', () => {
            // Arrange
            const options = ['Option A', 'Option B', 'Option C'];
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options }));
            // Assert
            const selectConfig = result.current.find(config => config.variable === 'default'
                && config.showConditions?.some(c => c.value === pipeline_1.PipelineInputVarType.select));
            expect(selectConfig?.options).toBeDefined();
            expect(selectConfig?.options?.length).toBe(4); // 3 options + 1 "no default" option
        });
        it('should include "no default selected" option', () => {
            // Arrange
            const options = ['Option A'];
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options }));
            // Assert
            const selectConfig = result.current.find(config => config.variable === 'default'
                && config.showConditions?.some(c => c.value === pipeline_1.PipelineInputVarType.select));
            const noDefaultOption = selectConfig?.options?.find(opt => opt.value === '');
            expect(noDefaultOption).toBeDefined();
        });
        it('should return empty options when options is undefined', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            const selectConfig = result.current.find(config => config.variable === 'default'
                && config.showConditions?.some(c => c.value === pipeline_1.PipelineInputVarType.select));
            expect(selectConfig?.options).toEqual([]);
        });
    });
    // -------------------------------------------------------------------------
    // File Size Limit Integration Tests
    // -------------------------------------------------------------------------
    describe('File Size Limit Integration', () => {
        it('should include file size description in maxLength config', () => {
            // Act
            const { result } = renderHookWithProviders(() => (0, hooks_1.useHiddenConfigurations)({ options: undefined }));
            // Assert
            const maxLengthConfig = result.current.find(config => config.variable === 'maxLength'
                && config.showConditions?.some(c => c.value === pipeline_1.PipelineInputVarType.multiFiles));
            expect(maxLengthConfig?.description).toBeDefined();
        });
    });
});
// ============================================================================
// Schema Validation Tests
// ============================================================================
describe('createInputFieldSchema', () => {
    // Mock translation function - cast to any to satisfy TFunction type requirements
    const mockT = ((key) => key);
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Common Schema Tests
    // -------------------------------------------------------------------------
    describe('Common Schema Validation', () => {
        it('should validate required variable field', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const invalidData = { variable: '', label: 'Test', required: true, type: 'text-input' };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
        it('should validate variable max length', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const invalidData = {
                variable: 'a'.repeat(100),
                label: 'Test',
                required: true,
                type: 'text-input',
                maxLength: 48,
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
        it('should validate variable does not start with number', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const invalidData = {
                variable: '123var',
                label: 'Test',
                required: true,
                type: 'text-input',
                maxLength: 48,
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
        it('should validate variable format (alphanumeric and underscore)', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const invalidData = {
                variable: 'var-name',
                label: 'Test',
                required: true,
                type: 'text-input',
                maxLength: 48,
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
        it('should accept valid variable name', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'valid_var_123',
                label: 'Test',
                required: true,
                type: 'text-input',
                maxLength: 48,
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
        it('should validate required label field', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const invalidData = {
                variable: 'test_var',
                label: '',
                required: true,
                type: 'text-input',
                maxLength: 48,
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
    });
    // -------------------------------------------------------------------------
    // Text Input Schema Tests
    // -------------------------------------------------------------------------
    describe('Text Input Schema', () => {
        it('should validate maxLength within bounds', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'text-input',
                maxLength: 100,
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
        it('should reject maxLength exceeding TEXT_MAX_LENGTH', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const invalidData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'text-input',
                maxLength: schema_1.TEXT_MAX_LENGTH + 1,
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
        it('should reject maxLength less than 1', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const invalidData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'text-input',
                maxLength: 0,
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
        it('should allow optional default value', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.textInput, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'text-input',
                maxLength: 48,
                default: 'default value',
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
    });
    // -------------------------------------------------------------------------
    // Paragraph Schema Tests
    // -------------------------------------------------------------------------
    describe('Paragraph Schema', () => {
        it('should validate paragraph type similar to textInput', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.paragraph, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'paragraph',
                maxLength: 100,
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
    });
    // -------------------------------------------------------------------------
    // Number Schema Tests
    // -------------------------------------------------------------------------
    describe('Number Schema', () => {
        it('should allow optional default number', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.number, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'number',
                default: 42,
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
        it('should allow optional unit', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.number, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'number',
                unit: 'kg',
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
    });
    // -------------------------------------------------------------------------
    // Select Schema Tests
    // -------------------------------------------------------------------------
    describe('Select Schema', () => {
        it('should require non-empty options array', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.select, mockT, { maxFileUploadLimit: 10 });
            const invalidData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'select',
                options: [],
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
        it('should accept valid options array', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.select, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'select',
                options: ['Option 1', 'Option 2'],
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
        it('should reject duplicate options', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.select, mockT, { maxFileUploadLimit: 10 });
            const invalidData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'select',
                options: ['Option 1', 'Option 1'],
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
    });
    // -------------------------------------------------------------------------
    // Single File Schema Tests
    // -------------------------------------------------------------------------
    describe('Single File Schema', () => {
        it('should validate allowedFileUploadMethods', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.singleFile, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'file',
                allowedFileUploadMethods: ['local_file', 'remote_url'],
                allowedTypesAndExtensions: {
                    allowedFileTypes: ['image'],
                },
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
        it('should validate allowedTypesAndExtensions', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.singleFile, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'file',
                allowedFileUploadMethods: ['local_file'],
                allowedTypesAndExtensions: {
                    allowedFileTypes: ['document', 'audio'],
                    allowedFileExtensions: ['.pdf', '.mp3'],
                },
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
    });
    // -------------------------------------------------------------------------
    // Multi Files Schema Tests
    // -------------------------------------------------------------------------
    describe('Multi Files Schema', () => {
        it('should validate maxLength within file upload limit', () => {
            // Arrange
            const maxFileUploadLimit = 10;
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.multiFiles, mockT, { maxFileUploadLimit });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'file-list',
                allowedFileUploadMethods: ['local_file'],
                allowedTypesAndExtensions: {
                    allowedFileTypes: ['image'],
                },
                maxLength: 5,
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
        it('should reject maxLength exceeding file upload limit', () => {
            // Arrange
            const maxFileUploadLimit = 10;
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.multiFiles, mockT, { maxFileUploadLimit });
            const invalidData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'file-list',
                allowedFileUploadMethods: ['local_file'],
                allowedTypesAndExtensions: {
                    allowedFileTypes: ['image'],
                },
                maxLength: 15,
            };
            // Act
            const result = schema.safeParse(invalidData);
            // Assert
            expect(result.success).toBe(false);
        });
    });
    // -------------------------------------------------------------------------
    // Default Schema Tests (for checkbox and other types)
    // -------------------------------------------------------------------------
    describe('Default Schema', () => {
        it('should validate checkbox type with common schema', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.checkbox, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'checkbox',
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
        });
        it('should allow passthrough of additional fields', () => {
            // Arrange
            const schema = (0, schema_1.createInputFieldSchema)(pipeline_1.PipelineInputVarType.checkbox, mockT, { maxFileUploadLimit: 10 });
            const validData = {
                variable: 'test_var',
                label: 'Test',
                required: true,
                type: 'checkbox',
                extraField: 'extra value',
            };
            // Act
            const result = schema.safeParse(validData);
            // Assert
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.extraField).toBe('extra value');
            }
        });
    });
});
// ============================================================================
// Types Tests
// ============================================================================
describe('Types', () => {
    describe('FormData type', () => {
        it('should have correct structure', () => {
            // This is a compile-time check, but we can verify at runtime too
            const formData = {
                type: pipeline_1.PipelineInputVarType.textInput,
                label: 'Test',
                variable: 'test',
                required: true,
                allowedTypesAndExtensions: {
                    allowedFileTypes: [],
                    allowedFileExtensions: [],
                },
            };
            expect(formData.type).toBeDefined();
            expect(formData.label).toBeDefined();
            expect(formData.variable).toBeDefined();
            expect(formData.required).toBeDefined();
        });
        it('should allow optional fields', () => {
            const formData = {
                type: pipeline_1.PipelineInputVarType.textInput,
                label: 'Test',
                variable: 'test',
                required: true,
                maxLength: 100,
                default: 'default',
                tooltips: 'tooltip',
                options: ['a', 'b'],
                placeholder: 'placeholder',
                unit: 'unit',
                allowedFileUploadMethods: [],
                allowedTypesAndExtensions: {
                    allowedFileTypes: [],
                    allowedFileExtensions: [],
                },
            };
            expect(formData.maxLength).toBe(100);
            expect(formData.default).toBe('default');
            expect(formData.tooltips).toBe('tooltip');
        });
    });
    describe('InputFieldFormProps type', () => {
        it('should have correct required props', () => {
            const props = {
                initialData: {},
                onCancel: vi.fn(),
                onSubmit: vi.fn(),
            };
            expect(props.initialData).toBeDefined();
            expect(props.onCancel).toBeDefined();
            expect(props.onSubmit).toBeDefined();
        });
        it('should have correct optional props with defaults', () => {
            const props = {
                initialData: {},
                onCancel: vi.fn(),
                onSubmit: vi.fn(),
                supportFile: true,
                isEditMode: false,
            };
            expect(props.supportFile).toBe(true);
            expect(props.isEditMode).toBe(false);
        });
    });
});
// ============================================================================
// TEXT_MAX_LENGTH Constant Tests
// ============================================================================
describe('TEXT_MAX_LENGTH', () => {
    it('should be a positive number', () => {
        expect(schema_1.TEXT_MAX_LENGTH).toBeGreaterThan(0);
    });
    it('should be 256', () => {
        expect(schema_1.TEXT_MAX_LENGTH).toBe(256);
    });
});
// ============================================================================
// InitialFields Component Tests
// ============================================================================
describe('InitialFields', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render InitialFields component without crashing', () => {
            // Arrange
            const initialData = createFormData();
            const props = createInputFieldFormProps({ initialData });
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // getFieldValue and setFieldValue Callbacks Tests
    // -------------------------------------------------------------------------
    describe('getFieldValue and setFieldValue Callbacks', () => {
        it('should trigger getFieldValue when variable name blur event fires with empty label', async () => {
            // Arrange - Create initial data with empty label
            const initialData = createFormData({
                variable: '',
                label: '', // Empty label to trigger the condition
            });
            const props = createInputFieldFormProps({ initialData });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Find the variable input and trigger blur with a value
            const variableInput = react_1.screen.getByLabelText('appDebug.variableConfig.varName');
            react_1.fireEvent.change(variableInput, { target: { value: 'test_var' } });
            react_1.fireEvent.blur(variableInput);
            // Assert - The label field should be updated via setFieldValue when variable blurs
            // The getFieldValue is called to check if label is empty
            await (0, react_1.waitFor)(() => {
                const labelInput = react_1.screen.getByLabelText('appDebug.variableConfig.displayName');
                // Label should be set to the variable value when it was empty
                expect(labelInput).toHaveValue('test_var');
            });
        });
        it('should not update label when it already has a value on variable blur', async () => {
            // Arrange - Create initial data with existing label
            const initialData = createFormData({
                variable: '',
                label: 'Existing Label', // Label already has value
            });
            const props = createInputFieldFormProps({ initialData });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Find the variable input and trigger blur with a value
            const variableInput = react_1.screen.getByLabelText('appDebug.variableConfig.varName');
            react_1.fireEvent.change(variableInput, { target: { value: 'new_var' } });
            react_1.fireEvent.blur(variableInput);
            // Assert - The label field should remain unchanged because it already has a value
            await (0, react_1.waitFor)(() => {
                const labelInput = react_1.screen.getByLabelText('appDebug.variableConfig.displayName');
                expect(labelInput).toHaveValue('Existing Label');
            });
        });
        it('should trigger setFieldValue when display name blur event fires with empty value', async () => {
            // Arrange - Create initial data with a variable but we will clear the label
            const initialData = createFormData({
                variable: 'original_var',
                label: 'Some Label',
            });
            const props = createInputFieldFormProps({ initialData });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Find the label input, clear it, and trigger blur
            const labelInput = react_1.screen.getByLabelText('appDebug.variableConfig.displayName');
            react_1.fireEvent.change(labelInput, { target: { value: '' } });
            react_1.fireEvent.blur(labelInput);
            // Assert - When label is cleared and blurred, it should be reset to variable name
            await (0, react_1.waitFor)(() => {
                expect(labelInput).toHaveValue('original_var');
            });
        });
        it('should keep label value when display name blur event fires with non-empty value', async () => {
            // Arrange
            const initialData = createFormData({
                variable: 'test_var',
                label: 'Original Label',
            });
            const props = createInputFieldFormProps({ initialData });
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Find the label input, change it to a new value, and trigger blur
            const labelInput = react_1.screen.getByLabelText('appDebug.variableConfig.displayName');
            react_1.fireEvent.change(labelInput, { target: { value: 'New Label' } });
            react_1.fireEvent.blur(labelInput);
            // Assert - Label should keep the new non-empty value
            await (0, react_1.waitFor)(() => {
                expect(labelInput).toHaveValue('New Label');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdURBQXdFO0FBQ3hFLGtEQUF1RjtBQUN2RiwrQkFBOEI7QUFDOUIsZ0RBQXdEO0FBQ3hELG1DQUF5RjtBQUN6RixtQ0FBb0M7QUFDcEMscUNBQWtFO0FBRWxFLDZEQUE2RDtBQUM3RCxzRUFBc0U7QUFDdEUsTUFBTSxlQUFlLEdBQUcsQ0FBSyxLQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBOEgsQ0FBQTtBQUVsTCwrRUFBK0U7QUFDL0UsNkJBQTZCO0FBQzdCLCtFQUErRTtBQUUvRSxrQ0FBa0M7QUFDbEMsTUFBTSxvQkFBb0IsR0FBRztJQUMzQixxQkFBcUIsRUFBRSxFQUFFO0lBQ3pCLGVBQWUsRUFBRSxFQUFFO0lBQ25CLHFCQUFxQixFQUFFLEVBQUU7SUFDekIscUJBQXFCLEVBQUUsR0FBRztJQUMxQiwwQkFBMEIsRUFBRSxFQUFFO0NBQy9CLENBQUE7QUFFRCxFQUFFLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMxQixJQUFJLEVBQUUsb0JBQW9CO1FBQzFCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLEtBQUssRUFBRSxJQUFJO0tBQ1osQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsMkJBQTJCO0FBQzNCLEVBQUUsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1QyxPQUFPLEVBQUU7UUFDUCxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUNoQjtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsK0VBQStFO0FBQy9FLHNCQUFzQjtBQUN0QiwrRUFBK0U7QUFFL0UsTUFBTSxjQUFjLEdBQUcsQ0FBQyxT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LEVBQUU7WUFDL0YsVUFBVTtZQUNWLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQztnQkFDakMsUUFBUSxFQUFFLFVBQVU7Z0JBQ3BCLEtBQUssRUFBRSxnQkFBZ0I7YUFDeEIsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxLQUFLLEdBQUcseUJBQXlCLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFBO1lBRXhELE1BQU07WUFDTixtQkFBbUIsQ0FBQyxDQUFDLGVBQWMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVsRCxtRUFBbUU7WUFDbkUsTUFBTSxVQUFVLEdBQUcsY0FBTSxDQUFDLGNBQWMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO1lBQy9FLGlCQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDaEUsaUJBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7WUFFMUIscURBQXFEO1lBQ3JELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQzdDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBGb3JtRGF0YSwgSW5wdXRGaWVsZEZvcm1Qcm9wcyB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCByZW5kZXJIb29rLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBQaXBlbGluZUlucHV0VmFyVHlwZSB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgdXNlQ29uZmlndXJhdGlvbnMsIHVzZUhpZGRlbkNvbmZpZ3VyYXRpb25zLCB1c2VIaWRkZW5GaWVsZE5hbWVzIH0gZnJvbSAnLi9ob29rcydcbmltcG9ydCBJbnB1dEZpZWxkRm9ybSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHsgY3JlYXRlSW5wdXRGaWVsZFNjaGVtYSwgVEVYVF9NQVhfTEVOR1RIIH0gZnJvbSAnLi9zY2hlbWEnXG5cbi8vIFR5cGUgaGVscGVyIGZvciBwYXJ0aWFsIGxpc3RlbmVyIGV2ZW50IHBhcmFtZXRlcnMgaW4gdGVzdHNcbi8vIFVzaW5nIGRvdWJsZSBhc3NlcnRpb24gZm9yIHRlc3QgbW9ja3Mgd2l0aCBpbmNvbXBsZXRlIGV2ZW50IG9iamVjdHNcbmNvbnN0IGNyZWF0ZU1vY2tFdmVudCA9IDxULD4odmFsdWU6IFQpID0+ICh7IHZhbHVlIH0pIGFzIHVua25vd24gYXMgUGFyYW1ldGVyczxOb25OdWxsYWJsZTxOb25OdWxsYWJsZTxSZXR1cm5UeXBlPHR5cGVvZiB1c2VDb25maWd1cmF0aW9ucz5bbnVtYmVyXVsnbGlzdGVuZXJzJ10+WydvbkNoYW5nZSddPj5bMF1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBmaWxlIHVwbG9hZCBjb25maWcgc2VydmljZVxuY29uc3QgbW9ja0ZpbGVVcGxvYWRDb25maWcgPSB7XG4gIGltYWdlX2ZpbGVfc2l6ZV9saW1pdDogMTAsXG4gIGZpbGVfc2l6ZV9saW1pdDogMTUsXG4gIGF1ZGlvX2ZpbGVfc2l6ZV9saW1pdDogNTAsXG4gIHZpZGVvX2ZpbGVfc2l6ZV9saW1pdDogMTAwLFxuICB3b3JrZmxvd19maWxlX3VwbG9hZF9saW1pdDogMTAsXG59XG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtY29tbW9uJywgKCkgPT4gKHtcbiAgdXNlRmlsZVVwbG9hZENvbmZpZzogKCkgPT4gKHtcbiAgICBkYXRhOiBtb2NrRmlsZVVwbG9hZENvbmZpZyxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgIGVycm9yOiBudWxsLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIFRvYXN0IHN0YXRpYyBtZXRob2RcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IHtcbiAgICBub3RpZnk6IHZpLmZuKCksXG4gIH0sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEZhY3Rvcmllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVGb3JtRGF0YSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEZvcm1EYXRhPik6IEZvcm1EYXRhID0+ICh7XG4gIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgbGFiZWw6ICdUZXN0IExhYmVsJyxcbiAgdmFyaWFibGU6ICd0ZXN0X3ZhcmlhYmxlJyxcbiAgbWF4TGVuZ3RoOiA0OCxcbiAgZGVmYXVsdDogJycsXG4gIHJlcXVpcmVkOiB0cnVlLFxuICB0b29sdGlwczogJycsXG4gIG9wdGlvbnM6IFtdLFxuICBwbGFjZWhvbGRlcjogJycsXG4gIHVuaXQ6ICcnLFxuICBhbGxvd2VkRmlsZVVwbG9hZE1ldGhvZHM6IFtdLFxuICBhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zOiB7XG4gICAgYWxsb3dlZEZpbGVUeXBlczogW10sXG4gICAgYWxsb3dlZEZpbGVFeHRlbnNpb25zOiBbXSxcbiAgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlSW5wdXRGaWVsZEZvcm1Qcm9wcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPElucHV0RmllbGRGb3JtUHJvcHM+KTogSW5wdXRGaWVsZEZvcm1Qcm9wcyA9PiAoe1xuICBpbml0aWFsRGF0YTogY3JlYXRlRm9ybURhdGEoKSxcbiAgc3VwcG9ydEZpbGU6IGZhbHNlLFxuICBvbkNhbmNlbDogdmkuZm4oKSxcbiAgb25TdWJtaXQ6IHZpLmZuKCksXG4gIGlzRWRpdE1vZGU6IHRydWUsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgV3JhcHBlciBDb21wb25lbnRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlVGVzdFF1ZXJ5Q2xpZW50ID0gKCkgPT4gbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICBxdWVyaWVzOiB7XG4gICAgICByZXRyeTogZmFsc2UsXG4gICAgICBnY1RpbWU6IDAsXG4gICAgfSxcbiAgfSxcbn0pXG5cbmNvbnN0IFRlc3RXcmFwcGVyID0gKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pID0+IHtcbiAgY29uc3QgcXVlcnlDbGllbnQgPSBjcmVhdGVUZXN0UXVlcnlDbGllbnQoKVxuICByZXR1cm4gKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgKVxufVxuXG5jb25zdCByZW5kZXJXaXRoUHJvdmlkZXJzID0gKHVpOiBSZWFjdC5SZWFjdEVsZW1lbnQpID0+IHtcbiAgcmV0dXJuIHJlbmRlcih1aSwgeyB3cmFwcGVyOiBUZXN0V3JhcHBlciB9KVxufVxuXG5jb25zdCByZW5kZXJIb29rV2l0aFByb3ZpZGVycyA9IDxUUmVzdWx0LD4oaG9vazogKCkgPT4gVFJlc3VsdCkgPT4ge1xuICByZXR1cm4gcmVuZGVySG9vayhob29rLCB7IHdyYXBwZXI6IFRlc3RXcmFwcGVyIH0pXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElucHV0RmllbGRGb3JtIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnSW5wdXRGaWVsZEZvcm0nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmb3JtIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNhbmNlbCBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2NhbmNlbC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZvcm0gd2l0aCBpbml0aWFsIHZhbHVlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxEYXRhID0gY3JlYXRlRm9ybURhdGEoe1xuICAgICAgICB2YXJpYWJsZTogJ2N1c3RvbV92YXInLFxuICAgICAgICBsYWJlbDogJ0N1c3RvbSBMYWJlbCcsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRm9ybVByb3BzKHsgaW5pdGlhbERhdGEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEZvcm0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBWYXJpYXRpb25zIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3VwcG9ydEZpbGU9dHJ1ZSBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRm9ybVByb3BzKHsgc3VwcG9ydEZpbGU6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEZvcm0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdXBwb3J0RmlsZT1mYWxzZSAoZGVmYXVsdCkgcHJvcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEZvcm1Qcm9wcyh7IHN1cHBvcnRGaWxlOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGlzRWRpdE1vZGU9dHJ1ZSBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRm9ybVByb3BzKHsgaXNFZGl0TW9kZTogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGlzRWRpdE1vZGU9ZmFsc2UgcHJvcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEZvcm1Qcm9wcyh7IGlzRWRpdE1vZGU6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IGluaXRpYWwgZGF0YSB0eXBlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHR5cGVzVG9UZXN0ID0gW1xuICAgICAgICBQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsXG4gICAgICAgIFBpcGVsaW5lSW5wdXRWYXJUeXBlLnBhcmFncmFwaCxcbiAgICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLFxuICAgICAgICBQaXBlbGluZUlucHV0VmFyVHlwZS5zZWxlY3QsXG4gICAgICAgIFBpcGVsaW5lSW5wdXRWYXJUeXBlLmNoZWNrYm94LFxuICAgICAgXVxuXG4gICAgICB0eXBlc1RvVGVzdC5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxEYXRhID0gY3JlYXRlRm9ybURhdGEoeyB0eXBlIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEZvcm1Qcm9wcyh7IGluaXRpYWxEYXRhIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyLCB1bm1vdW50IH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB1bm1vdW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2FuY2VsIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DYW5jZWwgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoeyBvbkNhbmNlbCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY2FuY2VsL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2FuY2VsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmV2ZW50IGRlZmF1bHQgb24gZm9ybSBzdWJtaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBmb3JtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSFcbiAgICAgIGNvbnN0IHN1Ym1pdEV2ZW50ID0gbmV3IEV2ZW50KCdzdWJtaXQnLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmb3JtLmRpc3BhdGNoRXZlbnQoc3VibWl0RXZlbnQpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN1Ym1pdEV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IFRvYXN0IGVycm9yIHdoZW4gZm9ybSB2YWxpZGF0aW9uIGZhaWxzIG9uIHN1Ym1pdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBDcmVhdGUgaW52YWxpZCBmb3JtIGRhdGEgd2l0aCBlbXB0eSB2YXJpYWJsZSBuYW1lICh2YWxpZGF0aW9uIHNob3VsZCBmYWlsKVxuICAgICAgY29uc3QgVG9hc3QgPSBhd2FpdCBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCcpXG4gICAgICBjb25zdCBpbml0aWFsRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgdmFyaWFibGU6ICcnLCAvLyBFbXB0eSB2YXJpYWJsZSBzaG91bGQgZmFpbCB2YWxpZGF0aW9uXG4gICAgICAgIGxhYmVsOiAnVGVzdCBMYWJlbCcsXG4gICAgICB9KVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoeyBpbml0aWFsRGF0YSwgb25TdWJtaXQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEZvcm0gey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGZvcm0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpIVxuICAgICAgZmlyZUV2ZW50LnN1Ym1pdChmb3JtKVxuXG4gICAgICAvLyBBc3NlcnQgLSBUb2FzdCBzaG91bGQgYmUgY2FsbGVkIHdpdGggZXJyb3IgbWVzc2FnZSB3aGVuIHZhbGlkYXRpb24gZmFpbHNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoVG9hc3QuZGVmYXVsdC5ub3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICBtZXNzYWdlOiBleHBlY3QuYW55KFN0cmluZyksXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgICAvLyBvblN1Ym1pdCBzaG91bGQgbm90IGJlIGNhbGxlZCB3aGVuIHZhbGlkYXRpb24gZmFpbHNcbiAgICAgIGV4cGVjdChvblN1Ym1pdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdWJtaXQgd2l0aCBtb3JlSW5mbyB3aGVuIHZhcmlhYmxlIG5hbWUgY2hhbmdlcyBpbiBlZGl0IG1vZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gSW5pdGlhbCB2YXJpYWJsZSBuYW1lIGlzICdvcmlnaW5hbF92YXInLCB3ZSBjaGFuZ2UgaXQgdG8gJ25ld192YXInXG4gICAgICBjb25zdCBpbml0aWFsRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgdmFyaWFibGU6ICdvcmlnaW5hbF92YXInLFxuICAgICAgICBsYWJlbDogJ1Rlc3QgTGFiZWwnLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IG9uU3VibWl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRm9ybVByb3BzKHtcbiAgICAgICAgaW5pdGlhbERhdGEsXG4gICAgICAgIG9uU3VibWl0LFxuICAgICAgICBpc0VkaXRNb2RlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBGaW5kIGFuZCBjaGFuZ2UgdGhlIHZhcmlhYmxlIGlucHV0IGJ5IGxhYmVsXG4gICAgICBjb25zdCB2YXJpYWJsZUlucHV0ID0gc2NyZWVuLmdldEJ5TGFiZWxUZXh0KCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy52YXJOYW1lJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UodmFyaWFibGVJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICduZXdfdmFyJyB9IH0pXG5cbiAgICAgIC8vIFN1Ym1pdCB0aGUgZm9ybVxuICAgICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSFcbiAgICAgIGZpcmVFdmVudC5zdWJtaXQoZm9ybSlcblxuICAgICAgLy8gQXNzZXJ0IC0gb25TdWJtaXQgc2hvdWxkIGJlIGNhbGxlZCB3aXRoIG1vcmVJbmZvIGNvbnRhaW5pbmcgdmFyaWFibGUgbmFtZSBjaGFuZ2UgaW5mb1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgdmFyaWFibGU6ICduZXdfdmFyJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICB0eXBlOiAnY2hhbmdlVmFyTmFtZScsXG4gICAgICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgICAgIGJlZm9yZUtleTogJ29yaWdpbmFsX3ZhcicsXG4gICAgICAgICAgICAgIGFmdGVyS2V5OiAnbmV3X3ZhcicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdWJtaXQgd2l0aG91dCBtb3JlSW5mbyB3aGVuIHZhcmlhYmxlIG5hbWUgZG9lcyBub3QgY2hhbmdlIGluIGVkaXQgbW9kZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBWYXJpYWJsZSBuYW1lIHN0YXlzIHRoZSBzYW1lXG4gICAgICBjb25zdCBpbml0aWFsRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgdmFyaWFibGU6ICdzYW1lX3ZhcicsXG4gICAgICAgIGxhYmVsOiAnVGVzdCBMYWJlbCcsXG4gICAgICB9KVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoe1xuICAgICAgICBpbml0aWFsRGF0YSxcbiAgICAgICAgb25TdWJtaXQsXG4gICAgICAgIGlzRWRpdE1vZGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFN1Ym1pdCB3aXRob3V0IGNoYW5naW5nIHZhcmlhYmxlIG5hbWVcbiAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydCAtIG9uU3VibWl0IHNob3VsZCBiZSBjYWxsZWQgd2l0aG91dCBtb3JlSW5mbyAodW5kZWZpbmVkKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgdmFyaWFibGU6ICdzYW1lX3ZhcicsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdWJtaXQgd2l0aG91dCBtb3JlSW5mbyB3aGVuIG5vdCBpbiBlZGl0IG1vZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbml0aWFsRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgdmFyaWFibGU6ICd0ZXN0X3ZhcicsXG4gICAgICAgIGxhYmVsOiAnVGVzdCBMYWJlbCcsXG4gICAgICB9KVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoe1xuICAgICAgICBpbml0aWFsRGF0YSxcbiAgICAgICAgb25TdWJtaXQsXG4gICAgICAgIGlzRWRpdE1vZGU6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBTdWJtaXQgdGhlIGZvcm1cbiAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydCAtIG9uU3VibWl0IHNob3VsZCBiZSBjYWxsZWQgd2l0aG91dCBtb3JlSW5mbyBzaW5jZSBub3QgaW4gZWRpdCBtb2RlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uU3VibWl0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHNob3dBbGxTZXR0aW5ncyBzdGF0ZSBhcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEZvcm1Qcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEZvcm0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvd0FsbFNldHRpbmdzIGNvbXBvbmVudCBzaG91bGQgYmUgdmlzaWJsZSB3aGVuIHNob3dBbGxTZXR0aW5ncyBpcyBmYWxzZVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvYXBwRGVidWcudmFyaWFibGVDb25maWcuc2hvd0FsbFNldHRpbmdzL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdG9nZ2xlIHNob3dBbGxTZXR0aW5ncyBzdGF0ZSB3aGVuIGNsaWNraW5nIHNob3cgYWxsIHNldHRpbmdzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRm9ybVByb3BzKClcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIEZpbmQgYW5kIGNsaWNrIHRoZSBzaG93IGFsbCBzZXR0aW5ncyBlbGVtZW50XG4gICAgICBjb25zdCBzaG93QWxsU2V0dGluZ3NFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgvYXBwRGVidWcudmFyaWFibGVDb25maWcuc2hvd0FsbFNldHRpbmdzL2kpXG4gICAgICBjb25zdCBjbGlja2FibGVQYXJlbnQgPSBzaG93QWxsU2V0dGluZ3NFbGVtZW50LmNsb3Nlc3QoJy5jdXJzb3ItcG9pbnRlcicpXG4gICAgICBpZiAoY2xpY2thYmxlUGFyZW50KSB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhjbGlja2FibGVQYXJlbnQpXG4gICAgICB9XG5cbiAgICAgIC8vIEFzc2VydCAtIEFmdGVyIGNsaWNraW5nLCBTaG93QWxsU2V0dGluZ3Mgc2hvdWxkIGJlIGhpZGRlbiBhbmQgSGlkZGVuRmllbGRzIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvYXBwRGVidWcudmFyaWFibGVDb25maWcuc2hvd0FsbFNldHRpbmdzL2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBvbkNhbmNlbCBjYWxsYmFjayByZWZlcmVuY2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNhbmNlbCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEZvcm1Qcm9wcyh7IG9uQ2FuY2VsIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEZvcm0gey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2NhbmNlbC9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2FuY2VsQnV0dG9uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNhbmNlbEJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DYW5jZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgaW5pdGlhbCBkYXRhIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoe1xuICAgICAgICBpbml0aWFsRGF0YToge30gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBzaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3QoKCkgPT4gcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEZvcm0gey4uLnByb3BzfSAvPikpLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIG9wdGlvbmFsIGZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxEYXRhID0ge1xuICAgICAgICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsXG4gICAgICAgIGxhYmVsOiAnVGVzdCcsXG4gICAgICAgIHZhcmlhYmxlOiAndGVzdCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zOiB7XG4gICAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogW10sXG4gICAgICAgICAgYWxsb3dlZEZpbGVFeHRlbnNpb25zOiBbXSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gT3RoZXIgZmllbGRzIGFyZSB1bmRlZmluZWRcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRGaWVsZEZvcm1Qcm9wcyh7IGluaXRpYWxEYXRhIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KCgpID0+IHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pKS5ub3QudG9UaHJvdygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB2YXJpYWJsZSBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5pdGlhbERhdGEgPSBjcmVhdGVGb3JtRGF0YSh7XG4gICAgICAgIHZhcmlhYmxlOiAndGVzdF92YXJfMTIzJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0IExhYmVsIDxzY3JpcHQ+JyxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoeyBpbml0aWFsRGF0YSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIHVzZUhpZGRlbkZpZWxkTmFtZXMgSG9vayBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgndXNlSGlkZGVuRmllbGROYW1lcycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZXR1cm4gVmFsdWUgVGVzdHMgZm9yIERpZmZlcmVudCBUeXBlc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZXR1cm4gVmFsdWVzIGJ5IFR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBmaWVsZCBuYW1lcyBmb3IgdGV4dElucHV0IHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VIaWRkZW5GaWVsZE5hbWVzKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBpbmNsdWRlIGRlZmF1bHQgdmFsdWUsIHBsYWNlaG9sZGVyLCB0b29sdGlwc1xuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0NvbnRhaW4oJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLmRlZmF1bHRWYWx1ZScudG9Mb3dlckNhc2UoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy5wbGFjZWhvbGRlcicudG9Mb3dlckNhc2UoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy50b29sdGlwcycudG9Mb3dlckNhc2UoKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBmaWVsZCBuYW1lcyBmb3IgcGFyYWdyYXBoIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VIaWRkZW5GaWVsZE5hbWVzKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnBhcmFncmFwaCksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0NvbnRhaW4oJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLmRlZmF1bHRWYWx1ZScudG9Mb3dlckNhc2UoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy5wbGFjZWhvbGRlcicudG9Mb3dlckNhc2UoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy50b29sdGlwcycudG9Mb3dlckNhc2UoKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBmaWVsZCBuYW1lcyBmb3IgbnVtYmVyIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VIaWRkZW5GaWVsZE5hbWVzKFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlciksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBpbmNsdWRlIHVuaXQgZmllbGRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy5kZWZhdWx0VmFsdWUnLnRvTG93ZXJDYXNlKCkpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQ29udGFpbignYXBwRGVidWcudmFyaWFibGVDb25maWcudW5pdCcudG9Mb3dlckNhc2UoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy5wbGFjZWhvbGRlcicudG9Mb3dlckNhc2UoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy50b29sdGlwcycudG9Mb3dlckNhc2UoKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBmaWVsZCBuYW1lcyBmb3Igc2VsZWN0IHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VIaWRkZW5GaWVsZE5hbWVzKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNlbGVjdCksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0NvbnRhaW4oJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLmRlZmF1bHRWYWx1ZScudG9Mb3dlckNhc2UoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy50b29sdGlwcycudG9Mb3dlckNhc2UoKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBmaWVsZCBuYW1lcyBmb3Igc2luZ2xlRmlsZSB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlSGlkZGVuRmllbGROYW1lcyhQaXBlbGluZUlucHV0VmFyVHlwZS5zaW5nbGVGaWxlKSxcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQ29udGFpbignYXBwRGVidWcudmFyaWFibGVDb25maWcudXBsb2FkTWV0aG9kJy50b0xvd2VyQ2FzZSgpKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0NvbnRhaW4oJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLnRvb2x0aXBzJy50b0xvd2VyQ2FzZSgpKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGZpZWxkIG5hbWVzIGZvciBtdWx0aUZpbGVzIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VIaWRkZW5GaWVsZE5hbWVzKFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMpLFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy51cGxvYWRNZXRob2QnLnRvTG93ZXJDYXNlKCkpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQ29udGFpbignYXBwRGVidWcudmFyaWFibGVDb25maWcubWF4TnVtYmVyT2ZVcGxvYWRzJy50b0xvd2VyQ2FzZSgpKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0NvbnRhaW4oJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLnRvb2x0aXBzJy50b0xvd2VyQ2FzZSgpKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGZpZWxkIG5hbWVzIGZvciBjaGVja2JveCB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlSGlkZGVuRmllbGROYW1lcyhQaXBlbGluZUlucHV0VmFyVHlwZS5jaGVja2JveCksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50KS50b0NvbnRhaW4oJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLnN0YXJ0Q2hlY2tlZCcudG9Mb3dlckNhc2UoKSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9Db250YWluKCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy50b29sdGlwcycudG9Mb3dlckNhc2UoKSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRvb2x0aXBzIG9ubHkgZm9yIHVua25vd24gdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2tXaXRoUHJvdmlkZXJzKCgpID0+XG4gICAgICAgIHVzZUhpZGRlbkZpZWxkTmFtZXMoJ3Vua25vd25fdHlwZScgYXMgUGlwZWxpbmVJbnB1dFZhclR5cGUpLFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgb25seSBjb250YWluIHRvb2x0aXBzIGZvciB1bmtub3duIHR5cGVzXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQpLnRvQ29udGFpbignYXBwRGVidWcudmFyaWFibGVDb25maWcudG9vbHRpcHMnLnRvTG93ZXJDYXNlKCkpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIHVzZUNvbmZpZ3VyYXRpb25zIEhvb2sgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ3VzZUNvbmZpZ3VyYXRpb25zJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbmZpZ3VyYXRpb24gR2VuZXJhdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDb25maWd1cmF0aW9uIEdlbmVyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYXJyYXkgb2YgY29uZmlndXJhdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrR2V0RmllbGRWYWx1ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG1vY2tTZXRGaWVsZFZhbHVlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VDb25maWd1cmF0aW9ucyh7XG4gICAgICAgICAgZ2V0RmllbGRWYWx1ZTogbW9ja0dldEZpZWxkVmFsdWUsXG4gICAgICAgICAgc2V0RmllbGRWYWx1ZTogbW9ja1NldEZpZWxkVmFsdWUsXG4gICAgICAgICAgc3VwcG9ydEZpbGU6IGZhbHNlLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoQXJyYXkuaXNBcnJheShyZXN1bHQuY3VycmVudCkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgdHlwZSBmaWVsZCBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0dldEZpZWxkVmFsdWUgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrU2V0RmllbGRWYWx1ZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlQ29uZmlndXJhdGlvbnMoe1xuICAgICAgICAgIGdldEZpZWxkVmFsdWU6IG1vY2tHZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHNldEZpZWxkVmFsdWU6IG1vY2tTZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHN1cHBvcnRGaWxlOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdHlwZUNvbmZpZyA9IHJlc3VsdC5jdXJyZW50LmZpbmQoY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ3R5cGUnKVxuICAgICAgZXhwZWN0KHR5cGVDb25maWcpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCh0eXBlQ29uZmlnPy5yZXF1aXJlZCkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgdmFyaWFibGUgZmllbGQgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tHZXRGaWVsZFZhbHVlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja1NldEZpZWxkVmFsdWUgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2tXaXRoUHJvdmlkZXJzKCgpID0+XG4gICAgICAgIHVzZUNvbmZpZ3VyYXRpb25zKHtcbiAgICAgICAgICBnZXRGaWVsZFZhbHVlOiBtb2NrR2V0RmllbGRWYWx1ZSxcbiAgICAgICAgICBzZXRGaWVsZFZhbHVlOiBtb2NrU2V0RmllbGRWYWx1ZSxcbiAgICAgICAgICBzdXBwb3J0RmlsZTogZmFsc2UsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHZhcmlhYmxlQ29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChjb25maWcgPT4gY29uZmlnLnZhcmlhYmxlID09PSAndmFyaWFibGUnKVxuICAgICAgZXhwZWN0KHZhcmlhYmxlQ29uZmlnKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QodmFyaWFibGVDb25maWc/LnJlcXVpcmVkKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSBsYWJlbCBmaWVsZCBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0dldEZpZWxkVmFsdWUgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrU2V0RmllbGRWYWx1ZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlQ29uZmlndXJhdGlvbnMoe1xuICAgICAgICAgIGdldEZpZWxkVmFsdWU6IG1vY2tHZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHNldEZpZWxkVmFsdWU6IG1vY2tTZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHN1cHBvcnRGaWxlOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGFiZWxDb25maWcgPSByZXN1bHQuY3VycmVudC5maW5kKGNvbmZpZyA9PiBjb25maWcudmFyaWFibGUgPT09ICdsYWJlbCcpXG4gICAgICBleHBlY3QobGFiZWxDb25maWcpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChsYWJlbENvbmZpZz8ucmVxdWlyZWQpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSByZXF1aXJlZCBmaWVsZCBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0dldEZpZWxkVmFsdWUgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrU2V0RmllbGRWYWx1ZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlQ29uZmlndXJhdGlvbnMoe1xuICAgICAgICAgIGdldEZpZWxkVmFsdWU6IG1vY2tHZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHNldEZpZWxkVmFsdWU6IG1vY2tTZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHN1cHBvcnRGaWxlOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcmVxdWlyZWRDb25maWcgPSByZXN1bHQuY3VycmVudC5maW5kKGNvbmZpZyA9PiBjb25maWcudmFyaWFibGUgPT09ICdyZXF1aXJlZCcpXG4gICAgICBleHBlY3QocmVxdWlyZWRDb25maWcpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHN1cHBvcnRGaWxlIHByb3AgdG8gdHlwZSBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0dldEZpZWxkVmFsdWUgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrU2V0RmllbGRWYWx1ZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlQ29uZmlndXJhdGlvbnMoe1xuICAgICAgICAgIGdldEZpZWxkVmFsdWU6IG1vY2tHZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHNldEZpZWxkVmFsdWU6IG1vY2tTZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHN1cHBvcnRGaWxlOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB0eXBlQ29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChjb25maWcgPT4gY29uZmlnLnZhcmlhYmxlID09PSAndHlwZScpXG4gICAgICBleHBlY3QodHlwZUNvbmZpZz8uc3VwcG9ydEZpbGUpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ2FsbGJhY2sgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ2FsbGJhY2tzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBzZXRGaWVsZFZhbHVlIHdoZW4gdHlwZSBjaGFuZ2VzIHRvIHNpbmdsZUZpbGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrR2V0RmllbGRWYWx1ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG1vY2tTZXRGaWVsZFZhbHVlID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlQ29uZmlndXJhdGlvbnMoe1xuICAgICAgICAgIGdldEZpZWxkVmFsdWU6IG1vY2tHZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHNldEZpZWxkVmFsdWU6IG1vY2tTZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHN1cHBvcnRGaWxlOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0eXBlQ29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChjb25maWcgPT4gY29uZmlnLnZhcmlhYmxlID09PSAndHlwZScpXG4gICAgICB0eXBlQ29uZmlnPy5saXN0ZW5lcnM/Lm9uQ2hhbmdlPy4oY3JlYXRlTW9ja0V2ZW50KFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0RmllbGRWYWx1ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2FsbG93ZWRGaWxlVXBsb2FkTWV0aG9kcycsIGV4cGVjdC5hbnkoQXJyYXkpKVxuICAgICAgZXhwZWN0KG1vY2tTZXRGaWVsZFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnYWxsb3dlZFR5cGVzQW5kRXh0ZW5zaW9ucycsIGV4cGVjdC5hbnkoT2JqZWN0KSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldEZpZWxkVmFsdWUgd2hlbiB0eXBlIGNoYW5nZXMgdG8gbXVsdGlGaWxlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tHZXRGaWVsZFZhbHVlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja1NldEZpZWxkVmFsdWUgPSB2aS5mbigpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VDb25maWd1cmF0aW9ucyh7XG4gICAgICAgICAgZ2V0RmllbGRWYWx1ZTogbW9ja0dldEZpZWxkVmFsdWUsXG4gICAgICAgICAgc2V0RmllbGRWYWx1ZTogbW9ja1NldEZpZWxkVmFsdWUsXG4gICAgICAgICAgc3VwcG9ydEZpbGU6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHR5cGVDb25maWcgPSByZXN1bHQuY3VycmVudC5maW5kKGNvbmZpZyA9PiBjb25maWcudmFyaWFibGUgPT09ICd0eXBlJylcbiAgICAgIHR5cGVDb25maWc/Lmxpc3RlbmVycz8ub25DaGFuZ2U/LihjcmVhdGVNb2NrRXZlbnQoUGlwZWxpbmVJbnB1dFZhclR5cGUubXVsdGlGaWxlcykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRGaWVsZFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbWF4TGVuZ3RoJywgZXhwZWN0LmFueShOdW1iZXIpKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0RmllbGRWYWx1ZSB3aGVuIHR5cGUgY2hhbmdlcyB0byBwYXJhZ3JhcGgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrR2V0RmllbGRWYWx1ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG1vY2tTZXRGaWVsZFZhbHVlID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlQ29uZmlndXJhdGlvbnMoe1xuICAgICAgICAgIGdldEZpZWxkVmFsdWU6IG1vY2tHZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHNldEZpZWxkVmFsdWU6IG1vY2tTZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHN1cHBvcnRGaWxlOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdHlwZUNvbmZpZyA9IHJlc3VsdC5jdXJyZW50LmZpbmQoY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ3R5cGUnKVxuICAgICAgdHlwZUNvbmZpZz8ubGlzdGVuZXJzPy5vbkNoYW5nZT8uKGNyZWF0ZU1vY2tFdmVudChQaXBlbGluZUlucHV0VmFyVHlwZS5wYXJhZ3JhcGgpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0RmllbGRWYWx1ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ21heExlbmd0aCcsIDQ4KSAvLyBERUZBVUxUX1ZBTFVFX01BWF9MRU5cbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZXQgbGFiZWwgZnJvbSB2YXJpYWJsZSBuYW1lIG9uIGJsdXIgd2hlbiBsYWJlbCBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tHZXRGaWVsZFZhbHVlID0gdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoJycpXG4gICAgICBjb25zdCBtb2NrU2V0RmllbGRWYWx1ZSA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2tXaXRoUHJvdmlkZXJzKCgpID0+XG4gICAgICAgIHVzZUNvbmZpZ3VyYXRpb25zKHtcbiAgICAgICAgICBnZXRGaWVsZFZhbHVlOiBtb2NrR2V0RmllbGRWYWx1ZSxcbiAgICAgICAgICBzZXRGaWVsZFZhbHVlOiBtb2NrU2V0RmllbGRWYWx1ZSxcbiAgICAgICAgICBzdXBwb3J0RmlsZTogZmFsc2UsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHZhcmlhYmxlQ29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChjb25maWcgPT4gY29uZmlnLnZhcmlhYmxlID09PSAndmFyaWFibGUnKVxuICAgICAgdmFyaWFibGVDb25maWc/Lmxpc3RlbmVycz8ub25CbHVyPy4oY3JlYXRlTW9ja0V2ZW50KCd0ZXN0X3ZhcmlhYmxlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRGaWVsZFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbGFiZWwnLCAndGVzdF92YXJpYWJsZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNldCBsYWJlbCBmcm9tIHZhcmlhYmxlIG5hbWUgb24gYmx1ciB3aGVuIGxhYmVsIGlzIG5vdCBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tHZXRGaWVsZFZhbHVlID0gdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoJ0V4aXN0aW5nIExhYmVsJylcbiAgICAgIGNvbnN0IG1vY2tTZXRGaWVsZFZhbHVlID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlQ29uZmlndXJhdGlvbnMoe1xuICAgICAgICAgIGdldEZpZWxkVmFsdWU6IG1vY2tHZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHNldEZpZWxkVmFsdWU6IG1vY2tTZXRGaWVsZFZhbHVlLFxuICAgICAgICAgIHN1cHBvcnRGaWxlOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdmFyaWFibGVDb25maWcgPSByZXN1bHQuY3VycmVudC5maW5kKGNvbmZpZyA9PiBjb25maWcudmFyaWFibGUgPT09ICd2YXJpYWJsZScpXG4gICAgICB2YXJpYWJsZUNvbmZpZz8ubGlzdGVuZXJzPy5vbkJsdXI/LihjcmVhdGVNb2NrRXZlbnQoJ3Rlc3RfdmFyaWFibGUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NldEZpZWxkVmFsdWUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXNldCBsYWJlbCB0byB2YXJpYWJsZSBuYW1lIHdoZW4gZGlzcGxheSBuYW1lIGlzIGNsZWFyZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrR2V0RmllbGRWYWx1ZSA9IHZpLmZuKCkubW9ja1JldHVyblZhbHVlKCdvcmlnaW5hbF92YXInKVxuICAgICAgY29uc3QgbW9ja1NldEZpZWxkVmFsdWUgPSB2aS5mbigpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VDb25maWd1cmF0aW9ucyh7XG4gICAgICAgICAgZ2V0RmllbGRWYWx1ZTogbW9ja0dldEZpZWxkVmFsdWUsXG4gICAgICAgICAgc2V0RmllbGRWYWx1ZTogbW9ja1NldEZpZWxkVmFsdWUsXG4gICAgICAgICAgc3VwcG9ydEZpbGU6IGZhbHNlLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBsYWJlbENvbmZpZyA9IHJlc3VsdC5jdXJyZW50LmZpbmQoY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ2xhYmVsJylcbiAgICAgIGxhYmVsQ29uZmlnPy5saXN0ZW5lcnM/Lm9uQmx1cj8uKGNyZWF0ZU1vY2tFdmVudCgnJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRGaWVsZFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbGFiZWwnLCAnb3JpZ2luYWxfdmFyJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29uZmlndXJhdGlvbnMgYXJyYXkgd2l0aCBjb3JyZWN0IGxlbmd0aCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tHZXRGaWVsZFZhbHVlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja1NldEZpZWxkVmFsdWUgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2tXaXRoUHJvdmlkZXJzKCgpID0+XG4gICAgICAgIHVzZUNvbmZpZ3VyYXRpb25zKHtcbiAgICAgICAgICBnZXRGaWVsZFZhbHVlOiBtb2NrR2V0RmllbGRWYWx1ZSxcbiAgICAgICAgICBzZXRGaWVsZFZhbHVlOiBtb2NrU2V0RmllbGRWYWx1ZSxcbiAgICAgICAgICBzdXBwb3J0RmlsZTogZmFsc2UsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgaGF2ZSBhbGwgZXhwZWN0ZWQgZmllbGQgY29uZmlndXJhdGlvbnNcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5sZW5ndGgpLnRvQmUoOCkgLy8gdHlwZSwgdmFyaWFibGUsIGxhYmVsLCBtYXhMZW5ndGgsIG9wdGlvbnMsIGZpbGVUeXBlcyB4MiwgcmVxdWlyZWRcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMgSG9vayBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgndXNlSGlkZGVuQ29uZmlndXJhdGlvbnMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29uZmlndXJhdGlvbiBHZW5lcmF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NvbmZpZ3VyYXRpb24gR2VuZXJhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBhcnJheSBvZiBoaWRkZW4gY29uZmlndXJhdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VIaWRkZW5Db25maWd1cmF0aW9ucyh7IG9wdGlvbnM6IHVuZGVmaW5lZCB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoQXJyYXkuaXNBcnJheShyZXN1bHQuY3VycmVudCkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgZGVmYXVsdCB2YWx1ZSBjb25maWd1cmF0aW9ucyBmb3IgZGlmZmVyZW50IHR5cGVzJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMoeyBvcHRpb25zOiB1bmRlZmluZWQgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZGVmYXVsdENvbmZpZ3MgPSByZXN1bHQuY3VycmVudC5maWx0ZXIoY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ2RlZmF1bHQnKVxuICAgICAgZXhwZWN0KGRlZmF1bHRDb25maWdzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSB0b29sdGlwcyBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMoeyBvcHRpb25zOiB1bmRlZmluZWQgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdG9vbHRpcHNDb25maWcgPSByZXN1bHQuY3VycmVudC5maW5kKGNvbmZpZyA9PiBjb25maWcudmFyaWFibGUgPT09ICd0b29sdGlwcycpXG4gICAgICBleHBlY3QodG9vbHRpcHNDb25maWcpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCh0b29sdGlwc0NvbmZpZz8uc2hvd0NvbmRpdGlvbnMpLnRvRXF1YWwoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSBwbGFjZWhvbGRlciBjb25maWd1cmF0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2tXaXRoUHJvdmlkZXJzKCgpID0+XG4gICAgICAgIHVzZUhpZGRlbkNvbmZpZ3VyYXRpb25zKHsgb3B0aW9uczogdW5kZWZpbmVkIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHBsYWNlaG9sZGVyQ29uZmlncyA9IHJlc3VsdC5jdXJyZW50LmZpbHRlcihjb25maWcgPT4gY29uZmlnLnZhcmlhYmxlID09PSAncGxhY2Vob2xkZXInKVxuICAgICAgZXhwZWN0KHBsYWNlaG9sZGVyQ29uZmlncy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgdW5pdCBjb25maWd1cmF0aW9uIGZvciBudW1iZXIgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2tXaXRoUHJvdmlkZXJzKCgpID0+XG4gICAgICAgIHVzZUhpZGRlbkNvbmZpZ3VyYXRpb25zKHsgb3B0aW9uczogdW5kZWZpbmVkIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHVuaXRDb25maWcgPSByZXN1bHQuY3VycmVudC5maW5kKGNvbmZpZyA9PiBjb25maWcudmFyaWFibGUgPT09ICd1bml0JylcbiAgICAgIGV4cGVjdCh1bml0Q29uZmlnKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QodW5pdENvbmZpZz8uc2hvd0NvbmRpdGlvbnMpLnRvQ29udGFpbkVxdWFsKHtcbiAgICAgICAgdmFyaWFibGU6ICd0eXBlJyxcbiAgICAgICAgdmFsdWU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlcixcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5jbHVkZSB1cGxvYWQgbWV0aG9kIGNvbmZpZ3VyYXRpb25zIGZvciBmaWxlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMoeyBvcHRpb25zOiB1bmRlZmluZWQgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdXBsb2FkTWV0aG9kQ29uZmlncyA9IHJlc3VsdC5jdXJyZW50LmZpbHRlcihcbiAgICAgICAgY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ2FsbG93ZWRGaWxlVXBsb2FkTWV0aG9kcycsXG4gICAgICApXG4gICAgICBleHBlY3QodXBsb2FkTWV0aG9kQ29uZmlncy5sZW5ndGgpLnRvQmUoMikgLy8gT25lIGZvciBzaW5nbGVGaWxlLCBvbmUgZm9yIG11bHRpRmlsZXNcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIG1heExlbmd0aCBjb25maWd1cmF0aW9uIGZvciBtdWx0aUZpbGVzJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMoeyBvcHRpb25zOiB1bmRlZmluZWQgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbWF4TGVuZ3RoQ29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChcbiAgICAgICAgY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ21heExlbmd0aCdcbiAgICAgICAgICAmJiBjb25maWcuc2hvd0NvbmRpdGlvbnM/LnNvbWUoYyA9PiBjLnZhbHVlID09PSBQaXBlbGluZUlucHV0VmFyVHlwZS5tdWx0aUZpbGVzKSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChtYXhMZW5ndGhDb25maWcpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gT3B0aW9ucyBIYW5kbGluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdPcHRpb25zIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZ2VuZXJhdGUgc2VsZWN0IG9wdGlvbnMgZnJvbSBwcm92aWRlZCBvcHRpb25zIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3B0aW9ucyA9IFsnT3B0aW9uIEEnLCAnT3B0aW9uIEInLCAnT3B0aW9uIEMnXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VIaWRkZW5Db25maWd1cmF0aW9ucyh7IG9wdGlvbnMgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc2VsZWN0Q29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChcbiAgICAgICAgY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ2RlZmF1bHQnXG4gICAgICAgICAgJiYgY29uZmlnLnNob3dDb25kaXRpb25zPy5zb21lKGMgPT4gYy52YWx1ZSA9PT0gUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0KSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChzZWxlY3RDb25maWc/Lm9wdGlvbnMpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChzZWxlY3RDb25maWc/Lm9wdGlvbnM/Lmxlbmd0aCkudG9CZSg0KSAvLyAzIG9wdGlvbnMgKyAxIFwibm8gZGVmYXVsdFwiIG9wdGlvblxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgXCJubyBkZWZhdWx0IHNlbGVjdGVkXCIgb3B0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb3B0aW9ucyA9IFsnT3B0aW9uIEEnXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rV2l0aFByb3ZpZGVycygoKSA9PlxuICAgICAgICB1c2VIaWRkZW5Db25maWd1cmF0aW9ucyh7IG9wdGlvbnMgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc2VsZWN0Q29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChcbiAgICAgICAgY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ2RlZmF1bHQnXG4gICAgICAgICAgJiYgY29uZmlnLnNob3dDb25kaXRpb25zPy5zb21lKGMgPT4gYy52YWx1ZSA9PT0gUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0KSxcbiAgICAgIClcbiAgICAgIGNvbnN0IG5vRGVmYXVsdE9wdGlvbiA9IHNlbGVjdENvbmZpZz8ub3B0aW9ucz8uZmluZChvcHQgPT4gb3B0LnZhbHVlID09PSAnJylcbiAgICAgIGV4cGVjdChub0RlZmF1bHRPcHRpb24pLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgb3B0aW9ucyB3aGVuIG9wdGlvbnMgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMoeyBvcHRpb25zOiB1bmRlZmluZWQgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc2VsZWN0Q29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChcbiAgICAgICAgY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ2RlZmF1bHQnXG4gICAgICAgICAgJiYgY29uZmlnLnNob3dDb25kaXRpb25zPy5zb21lKGMgPT4gYy52YWx1ZSA9PT0gUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0KSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChzZWxlY3RDb25maWc/Lm9wdGlvbnMpLnRvRXF1YWwoW10pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEZpbGUgU2l6ZSBMaW1pdCBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdGaWxlIFNpemUgTGltaXQgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIGZpbGUgc2l6ZSBkZXNjcmlwdGlvbiBpbiBtYXhMZW5ndGggY29uZmlnJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9va1dpdGhQcm92aWRlcnMoKCkgPT5cbiAgICAgICAgdXNlSGlkZGVuQ29uZmlndXJhdGlvbnMoeyBvcHRpb25zOiB1bmRlZmluZWQgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbWF4TGVuZ3RoQ29uZmlnID0gcmVzdWx0LmN1cnJlbnQuZmluZChcbiAgICAgICAgY29uZmlnID0+IGNvbmZpZy52YXJpYWJsZSA9PT0gJ21heExlbmd0aCdcbiAgICAgICAgICAmJiBjb25maWcuc2hvd0NvbmRpdGlvbnM/LnNvbWUoYyA9PiBjLnZhbHVlID09PSBQaXBlbGluZUlucHV0VmFyVHlwZS5tdWx0aUZpbGVzKSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChtYXhMZW5ndGhDb25maWc/LmRlc2NyaXB0aW9uKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFNjaGVtYSBWYWxpZGF0aW9uIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdjcmVhdGVJbnB1dEZpZWxkU2NoZW1hJywgKCkgPT4ge1xuICAvLyBNb2NrIHRyYW5zbGF0aW9uIGZ1bmN0aW9uIC0gY2FzdCB0byBhbnkgdG8gc2F0aXNmeSBURnVuY3Rpb24gdHlwZSByZXF1aXJlbWVudHNcbiAgY29uc3QgbW9ja1QgPSAoKGtleTogc3RyaW5nKSA9PiBrZXkpIGFzIHVua25vd24gYXMgUGFyYW1ldGVyczx0eXBlb2YgY3JlYXRlSW5wdXRGaWVsZFNjaGVtYT5bMV1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbW1vbiBTY2hlbWEgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ29tbW9uIFNjaGVtYSBWYWxpZGF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdmFsaWRhdGUgcmVxdWlyZWQgdmFyaWFibGUgZmllbGQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzY2hlbWEgPSBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCwgbW9ja1QsIHsgbWF4RmlsZVVwbG9hZExpbWl0OiAxMCB9KVxuICAgICAgY29uc3QgaW52YWxpZERhdGEgPSB7IHZhcmlhYmxlOiAnJywgbGFiZWw6ICdUZXN0JywgcmVxdWlyZWQ6IHRydWUsIHR5cGU6ICd0ZXh0LWlucHV0JyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gc2NoZW1hLnNhZmVQYXJzZShpbnZhbGlkRGF0YSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdmFsaWRhdGUgdmFyaWFibGUgbWF4IGxlbmd0aCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LCBtb2NrVCwgeyBtYXhGaWxlVXBsb2FkTGltaXQ6IDEwIH0pXG4gICAgICBjb25zdCBpbnZhbGlkRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGU6ICdhJy5yZXBlYXQoMTAwKSxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICd0ZXh0LWlucHV0JyxcbiAgICAgICAgbWF4TGVuZ3RoOiA0OCxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBzY2hlbWEuc2FmZVBhcnNlKGludmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSB2YXJpYWJsZSBkb2VzIG5vdCBzdGFydCB3aXRoIG51bWJlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LCBtb2NrVCwgeyBtYXhGaWxlVXBsb2FkTGltaXQ6IDEwIH0pXG4gICAgICBjb25zdCBpbnZhbGlkRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGU6ICcxMjN2YXInLFxuICAgICAgICBsYWJlbDogJ1Rlc3QnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ3RleHQtaW5wdXQnLFxuICAgICAgICBtYXhMZW5ndGg6IDQ4LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UoaW52YWxpZERhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIHZhcmlhYmxlIGZvcm1hdCAoYWxwaGFudW1lcmljIGFuZCB1bmRlcnNjb3JlKScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LCBtb2NrVCwgeyBtYXhGaWxlVXBsb2FkTGltaXQ6IDEwIH0pXG4gICAgICBjb25zdCBpbnZhbGlkRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGU6ICd2YXItbmFtZScsXG4gICAgICAgIGxhYmVsOiAnVGVzdCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB0eXBlOiAndGV4dC1pbnB1dCcsXG4gICAgICAgIG1heExlbmd0aDogNDgsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gc2NoZW1hLnNhZmVQYXJzZShpbnZhbGlkRGF0YSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWNjZXB0IHZhbGlkIHZhcmlhYmxlIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzY2hlbWEgPSBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCwgbW9ja1QsIHsgbWF4RmlsZVVwbG9hZExpbWl0OiAxMCB9KVxuICAgICAgY29uc3QgdmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3ZhbGlkX3Zhcl8xMjMnLFxuICAgICAgICBsYWJlbDogJ1Rlc3QnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ3RleHQtaW5wdXQnLFxuICAgICAgICBtYXhMZW5ndGg6IDQ4LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIHJlcXVpcmVkIGxhYmVsIGZpZWxkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc2NoZW1hID0gY3JlYXRlSW5wdXRGaWVsZFNjaGVtYShQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsIG1vY2tULCB7IG1heEZpbGVVcGxvYWRMaW1pdDogMTAgfSlcbiAgICAgIGNvbnN0IGludmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICcnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ3RleHQtaW5wdXQnLFxuICAgICAgICBtYXhMZW5ndGg6IDQ4LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UoaW52YWxpZERhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBUZXh0IElucHV0IFNjaGVtYSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdUZXh0IElucHV0IFNjaGVtYScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIG1heExlbmd0aCB3aXRoaW4gYm91bmRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc2NoZW1hID0gY3JlYXRlSW5wdXRGaWVsZFNjaGVtYShQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsIG1vY2tULCB7IG1heEZpbGVVcGxvYWRMaW1pdDogMTAgfSlcbiAgICAgIGNvbnN0IHZhbGlkRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGU6ICd0ZXN0X3ZhcicsXG4gICAgICAgIGxhYmVsOiAnVGVzdCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB0eXBlOiAndGV4dC1pbnB1dCcsXG4gICAgICAgIG1heExlbmd0aDogMTAwLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlamVjdCBtYXhMZW5ndGggZXhjZWVkaW5nIFRFWFRfTUFYX0xFTkdUSCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LCBtb2NrVCwgeyBtYXhGaWxlVXBsb2FkTGltaXQ6IDEwIH0pXG4gICAgICBjb25zdCBpbnZhbGlkRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGU6ICd0ZXN0X3ZhcicsXG4gICAgICAgIGxhYmVsOiAnVGVzdCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB0eXBlOiAndGV4dC1pbnB1dCcsXG4gICAgICAgIG1heExlbmd0aDogVEVYVF9NQVhfTEVOR1RIICsgMSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBzY2hlbWEuc2FmZVBhcnNlKGludmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZWplY3QgbWF4TGVuZ3RoIGxlc3MgdGhhbiAxJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc2NoZW1hID0gY3JlYXRlSW5wdXRGaWVsZFNjaGVtYShQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsIG1vY2tULCB7IG1heEZpbGVVcGxvYWRMaW1pdDogMTAgfSlcbiAgICAgIGNvbnN0IGludmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICd0ZXh0LWlucHV0JyxcbiAgICAgICAgbWF4TGVuZ3RoOiAwLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UoaW52YWxpZERhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IG9wdGlvbmFsIGRlZmF1bHQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzY2hlbWEgPSBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCwgbW9ja1QsIHsgbWF4RmlsZVVwbG9hZExpbWl0OiAxMCB9KVxuICAgICAgY29uc3QgdmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICd0ZXh0LWlucHV0JyxcbiAgICAgICAgbWF4TGVuZ3RoOiA0OCxcbiAgICAgICAgZGVmYXVsdDogJ2RlZmF1bHQgdmFsdWUnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQYXJhZ3JhcGggU2NoZW1hIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1BhcmFncmFwaCBTY2hlbWEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBwYXJhZ3JhcGggdHlwZSBzaW1pbGFyIHRvIHRleHRJbnB1dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUucGFyYWdyYXBoLCBtb2NrVCwgeyBtYXhGaWxlVXBsb2FkTGltaXQ6IDEwIH0pXG4gICAgICBjb25zdCB2YWxpZERhdGEgPSB7XG4gICAgICAgIHZhcmlhYmxlOiAndGVzdF92YXInLFxuICAgICAgICBsYWJlbDogJ1Rlc3QnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ3BhcmFncmFwaCcsXG4gICAgICAgIG1heExlbmd0aDogMTAwLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBOdW1iZXIgU2NoZW1hIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ051bWJlciBTY2hlbWEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBvcHRpb25hbCBkZWZhdWx0IG51bWJlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLCBtb2NrVCwgeyBtYXhGaWxlVXBsb2FkTGltaXQ6IDEwIH0pXG4gICAgICBjb25zdCB2YWxpZERhdGEgPSB7XG4gICAgICAgIHZhcmlhYmxlOiAndGVzdF92YXInLFxuICAgICAgICBsYWJlbDogJ1Rlc3QnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ251bWJlcicsXG4gICAgICAgIGRlZmF1bHQ6IDQyLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IG9wdGlvbmFsIHVuaXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzY2hlbWEgPSBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hKFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlciwgbW9ja1QsIHsgbWF4RmlsZVVwbG9hZExpbWl0OiAxMCB9KVxuICAgICAgY29uc3QgdmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdudW1iZXInLFxuICAgICAgICB1bml0OiAna2cnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTZWxlY3QgU2NoZW1hIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1NlbGVjdCBTY2hlbWEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXF1aXJlIG5vbi1lbXB0eSBvcHRpb25zIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc2NoZW1hID0gY3JlYXRlSW5wdXRGaWVsZFNjaGVtYShQaXBlbGluZUlucHV0VmFyVHlwZS5zZWxlY3QsIG1vY2tULCB7IG1heEZpbGVVcGxvYWRMaW1pdDogMTAgfSlcbiAgICAgIGNvbnN0IGludmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgICAgICBvcHRpb25zOiBbXSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBzY2hlbWEuc2FmZVBhcnNlKGludmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhY2NlcHQgdmFsaWQgb3B0aW9ucyBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0LCBtb2NrVCwgeyBtYXhGaWxlVXBsb2FkTGltaXQ6IDEwIH0pXG4gICAgICBjb25zdCB2YWxpZERhdGEgPSB7XG4gICAgICAgIHZhcmlhYmxlOiAndGVzdF92YXInLFxuICAgICAgICBsYWJlbDogJ1Rlc3QnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICAgIG9wdGlvbnM6IFsnT3B0aW9uIDEnLCAnT3B0aW9uIDInXSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBzY2hlbWEuc2FmZVBhcnNlKHZhbGlkRGF0YSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LnN1Y2Nlc3MpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZWplY3QgZHVwbGljYXRlIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzY2hlbWEgPSBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNlbGVjdCwgbW9ja1QsIHsgbWF4RmlsZVVwbG9hZExpbWl0OiAxMCB9KVxuICAgICAgY29uc3QgaW52YWxpZERhdGEgPSB7XG4gICAgICAgIHZhcmlhYmxlOiAndGVzdF92YXInLFxuICAgICAgICBsYWJlbDogJ1Rlc3QnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgICAgIG9wdGlvbnM6IFsnT3B0aW9uIDEnLCAnT3B0aW9uIDEnXSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCByZXN1bHQgPSBzY2hlbWEuc2FmZVBhcnNlKGludmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU2luZ2xlIEZpbGUgU2NoZW1hIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1NpbmdsZSBGaWxlIFNjaGVtYScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIGFsbG93ZWRGaWxlVXBsb2FkTWV0aG9kcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUuc2luZ2xlRmlsZSwgbW9ja1QsIHsgbWF4RmlsZVVwbG9hZExpbWl0OiAxMCB9KVxuICAgICAgY29uc3QgdmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdmaWxlJyxcbiAgICAgICAgYWxsb3dlZEZpbGVVcGxvYWRNZXRob2RzOiBbJ2xvY2FsX2ZpbGUnLCAncmVtb3RlX3VybCddLFxuICAgICAgICBhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zOiB7XG4gICAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogWydpbWFnZSddLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHZhbGlkYXRlIGFsbG93ZWRUeXBlc0FuZEV4dGVuc2lvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzY2hlbWEgPSBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hKFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNpbmdsZUZpbGUsIG1vY2tULCB7IG1heEZpbGVVcGxvYWRMaW1pdDogMTAgfSlcbiAgICAgIGNvbnN0IHZhbGlkRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGU6ICd0ZXN0X3ZhcicsXG4gICAgICAgIGxhYmVsOiAnVGVzdCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB0eXBlOiAnZmlsZScsXG4gICAgICAgIGFsbG93ZWRGaWxlVXBsb2FkTWV0aG9kczogWydsb2NhbF9maWxlJ10sXG4gICAgICAgIGFsbG93ZWRUeXBlc0FuZEV4dGVuc2lvbnM6IHtcbiAgICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBbJ2RvY3VtZW50JywgJ2F1ZGlvJ10sXG4gICAgICAgICAgYWxsb3dlZEZpbGVFeHRlbnNpb25zOiBbJy5wZGYnLCAnLm1wMyddLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBNdWx0aSBGaWxlcyBTY2hlbWEgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTXVsdGkgRmlsZXMgU2NoZW1hJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdmFsaWRhdGUgbWF4TGVuZ3RoIHdpdGhpbiBmaWxlIHVwbG9hZCBsaW1pdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1heEZpbGVVcGxvYWRMaW1pdCA9IDEwXG4gICAgICBjb25zdCBzY2hlbWEgPSBjcmVhdGVJbnB1dEZpZWxkU2NoZW1hKFBpcGVsaW5lSW5wdXRWYXJUeXBlLm11bHRpRmlsZXMsIG1vY2tULCB7IG1heEZpbGVVcGxvYWRMaW1pdCB9KVxuICAgICAgY29uc3QgdmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdmaWxlLWxpc3QnLFxuICAgICAgICBhbGxvd2VkRmlsZVVwbG9hZE1ldGhvZHM6IFsnbG9jYWxfZmlsZSddLFxuICAgICAgICBhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zOiB7XG4gICAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogWydpbWFnZSddLFxuICAgICAgICB9LFxuICAgICAgICBtYXhMZW5ndGg6IDUsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gc2NoZW1hLnNhZmVQYXJzZSh2YWxpZERhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVqZWN0IG1heExlbmd0aCBleGNlZWRpbmcgZmlsZSB1cGxvYWQgbGltaXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtYXhGaWxlVXBsb2FkTGltaXQgPSAxMFxuICAgICAgY29uc3Qgc2NoZW1hID0gY3JlYXRlSW5wdXRGaWVsZFNjaGVtYShQaXBlbGluZUlucHV0VmFyVHlwZS5tdWx0aUZpbGVzLCBtb2NrVCwgeyBtYXhGaWxlVXBsb2FkTGltaXQgfSlcbiAgICAgIGNvbnN0IGludmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdmaWxlLWxpc3QnLFxuICAgICAgICBhbGxvd2VkRmlsZVVwbG9hZE1ldGhvZHM6IFsnbG9jYWxfZmlsZSddLFxuICAgICAgICBhbGxvd2VkVHlwZXNBbmRFeHRlbnNpb25zOiB7XG4gICAgICAgICAgYWxsb3dlZEZpbGVUeXBlczogWydpbWFnZSddLFxuICAgICAgICB9LFxuICAgICAgICBtYXhMZW5ndGg6IDE1LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UoaW52YWxpZERhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBEZWZhdWx0IFNjaGVtYSBUZXN0cyAoZm9yIGNoZWNrYm94IGFuZCBvdGhlciB0eXBlcylcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRGVmYXVsdCBTY2hlbWEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB2YWxpZGF0ZSBjaGVja2JveCB0eXBlIHdpdGggY29tbW9uIHNjaGVtYScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNjaGVtYSA9IGNyZWF0ZUlucHV0RmllbGRTY2hlbWEoUGlwZWxpbmVJbnB1dFZhclR5cGUuY2hlY2tib3gsIG1vY2tULCB7IG1heEZpbGVVcGxvYWRMaW1pdDogMTAgfSlcbiAgICAgIGNvbnN0IHZhbGlkRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGU6ICd0ZXN0X3ZhcicsXG4gICAgICAgIGxhYmVsOiAnVGVzdCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB0eXBlOiAnY2hlY2tib3gnLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHNjaGVtYS5zYWZlUGFyc2UodmFsaWREYXRhKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuc3VjY2VzcykudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHBhc3N0aHJvdWdoIG9mIGFkZGl0aW9uYWwgZmllbGRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc2NoZW1hID0gY3JlYXRlSW5wdXRGaWVsZFNjaGVtYShQaXBlbGluZUlucHV0VmFyVHlwZS5jaGVja2JveCwgbW9ja1QsIHsgbWF4RmlsZVVwbG9hZExpbWl0OiAxMCB9KVxuICAgICAgY29uc3QgdmFsaWREYXRhID0ge1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6ICdjaGVja2JveCcsXG4gICAgICAgIGV4dHJhRmllbGQ6ICdleHRyYSB2YWx1ZScsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgcmVzdWx0ID0gc2NoZW1hLnNhZmVQYXJzZSh2YWxpZERhdGEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5zdWNjZXNzKS50b0JlKHRydWUpXG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgZXhwZWN0KChyZXN1bHQuZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikuZXh0cmFGaWVsZCkudG9CZSgnZXh0cmEgdmFsdWUnKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUeXBlcyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnVHlwZXMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdGb3JtRGF0YSB0eXBlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIC8vIFRoaXMgaXMgYSBjb21waWxlLXRpbWUgY2hlY2ssIGJ1dCB3ZSBjYW4gdmVyaWZ5IGF0IHJ1bnRpbWUgdG9vXG4gICAgICBjb25zdCBmb3JtRGF0YTogRm9ybURhdGEgPSB7XG4gICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgICAgbGFiZWw6ICdUZXN0JyxcbiAgICAgICAgdmFyaWFibGU6ICd0ZXN0JyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGFsbG93ZWRUeXBlc0FuZEV4dGVuc2lvbnM6IHtcbiAgICAgICAgICBhbGxvd2VkRmlsZVR5cGVzOiBbXSxcbiAgICAgICAgICBhbGxvd2VkRmlsZUV4dGVuc2lvbnM6IFtdLFxuICAgICAgICB9LFxuICAgICAgfVxuXG4gICAgICBleHBlY3QoZm9ybURhdGEudHlwZSkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KGZvcm1EYXRhLmxhYmVsKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QoZm9ybURhdGEudmFyaWFibGUpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChmb3JtRGF0YS5yZXF1aXJlZCkudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IG9wdGlvbmFsIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IHtcbiAgICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICAgICAgICBsYWJlbDogJ1Rlc3QnLFxuICAgICAgICB2YXJpYWJsZTogJ3Rlc3QnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgbWF4TGVuZ3RoOiAxMDAsXG4gICAgICAgIGRlZmF1bHQ6ICdkZWZhdWx0JyxcbiAgICAgICAgdG9vbHRpcHM6ICd0b29sdGlwJyxcbiAgICAgICAgb3B0aW9uczogWydhJywgJ2InXSxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdwbGFjZWhvbGRlcicsXG4gICAgICAgIHVuaXQ6ICd1bml0JyxcbiAgICAgICAgYWxsb3dlZEZpbGVVcGxvYWRNZXRob2RzOiBbXSxcbiAgICAgICAgYWxsb3dlZFR5cGVzQW5kRXh0ZW5zaW9uczoge1xuICAgICAgICAgIGFsbG93ZWRGaWxlVHlwZXM6IFtdLFxuICAgICAgICAgIGFsbG93ZWRGaWxlRXh0ZW5zaW9uczogW10sXG4gICAgICAgIH0sXG4gICAgICB9XG5cbiAgICAgIGV4cGVjdChmb3JtRGF0YS5tYXhMZW5ndGgpLnRvQmUoMTAwKVxuICAgICAgZXhwZWN0KGZvcm1EYXRhLmRlZmF1bHQpLnRvQmUoJ2RlZmF1bHQnKVxuICAgICAgZXhwZWN0KGZvcm1EYXRhLnRvb2x0aXBzKS50b0JlKCd0b29sdGlwJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJbnB1dEZpZWxkRm9ybVByb3BzIHR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgcmVxdWlyZWQgcHJvcHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wczogSW5wdXRGaWVsZEZvcm1Qcm9wcyA9IHtcbiAgICAgICAgaW5pdGlhbERhdGE6IHt9LFxuICAgICAgICBvbkNhbmNlbDogdmkuZm4oKSxcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIGV4cGVjdChwcm9wcy5pbml0aWFsRGF0YSkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHByb3BzLm9uQ2FuY2VsKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocHJvcHMub25TdWJtaXQpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3Qgb3B0aW9uYWwgcHJvcHMgd2l0aCBkZWZhdWx0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzOiBJbnB1dEZpZWxkRm9ybVByb3BzID0ge1xuICAgICAgICBpbml0aWFsRGF0YToge30sXG4gICAgICAgIG9uQ2FuY2VsOiB2aS5mbigpLFxuICAgICAgICBvblN1Ym1pdDogdmkuZm4oKSxcbiAgICAgICAgc3VwcG9ydEZpbGU6IHRydWUsXG4gICAgICAgIGlzRWRpdE1vZGU6IGZhbHNlLFxuICAgICAgfVxuXG4gICAgICBleHBlY3QocHJvcHMuc3VwcG9ydEZpbGUpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChwcm9wcy5pc0VkaXRNb2RlKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBURVhUX01BWF9MRU5HVEggQ29uc3RhbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1RFWFRfTUFYX0xFTkdUSCcsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBiZSBhIHBvc2l0aXZlIG51bWJlcicsICgpID0+IHtcbiAgICBleHBlY3QoVEVYVF9NQVhfTEVOR1RIKS50b0JlR3JlYXRlclRoYW4oMClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGJlIDI1NicsICgpID0+IHtcbiAgICBleHBlY3QoVEVYVF9NQVhfTEVOR1RIKS50b0JlKDI1NilcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEluaXRpYWxGaWVsZHMgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdJbml0aWFsRmllbGRzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5pdGlhbEZpZWxkcyBjb21wb25lbnQgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxEYXRhID0gY3JlYXRlRm9ybURhdGEoKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRm9ybVByb3BzKHsgaW5pdGlhbERhdGEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8SW5wdXRGaWVsZEZvcm0gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBnZXRGaWVsZFZhbHVlIGFuZCBzZXRGaWVsZFZhbHVlIENhbGxiYWNrcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdnZXRGaWVsZFZhbHVlIGFuZCBzZXRGaWVsZFZhbHVlIENhbGxiYWNrcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRyaWdnZXIgZ2V0RmllbGRWYWx1ZSB3aGVuIHZhcmlhYmxlIG5hbWUgYmx1ciBldmVudCBmaXJlcyB3aXRoIGVtcHR5IGxhYmVsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIENyZWF0ZSBpbml0aWFsIGRhdGEgd2l0aCBlbXB0eSBsYWJlbFxuICAgICAgY29uc3QgaW5pdGlhbERhdGEgPSBjcmVhdGVGb3JtRGF0YSh7XG4gICAgICAgIHZhcmlhYmxlOiAnJyxcbiAgICAgICAgbGFiZWw6ICcnLCAvLyBFbXB0eSBsYWJlbCB0byB0cmlnZ2VyIHRoZSBjb25kaXRpb25cbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoeyBpbml0aWFsRGF0YSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEZpbmQgdGhlIHZhcmlhYmxlIGlucHV0IGFuZCB0cmlnZ2VyIGJsdXIgd2l0aCBhIHZhbHVlXG4gICAgICBjb25zdCB2YXJpYWJsZUlucHV0ID0gc2NyZWVuLmdldEJ5TGFiZWxUZXh0KCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy52YXJOYW1lJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UodmFyaWFibGVJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICd0ZXN0X3ZhcicgfSB9KVxuICAgICAgZmlyZUV2ZW50LmJsdXIodmFyaWFibGVJbnB1dClcblxuICAgICAgLy8gQXNzZXJ0IC0gVGhlIGxhYmVsIGZpZWxkIHNob3VsZCBiZSB1cGRhdGVkIHZpYSBzZXRGaWVsZFZhbHVlIHdoZW4gdmFyaWFibGUgYmx1cnNcbiAgICAgIC8vIFRoZSBnZXRGaWVsZFZhbHVlIGlzIGNhbGxlZCB0byBjaGVjayBpZiBsYWJlbCBpcyBlbXB0eVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxhYmVsSW5wdXQgPSBzY3JlZW4uZ2V0QnlMYWJlbFRleHQoJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLmRpc3BsYXlOYW1lJylcbiAgICAgICAgLy8gTGFiZWwgc2hvdWxkIGJlIHNldCB0byB0aGUgdmFyaWFibGUgdmFsdWUgd2hlbiBpdCB3YXMgZW1wdHlcbiAgICAgICAgZXhwZWN0KGxhYmVsSW5wdXQpLnRvSGF2ZVZhbHVlKCd0ZXN0X3ZhcicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB1cGRhdGUgbGFiZWwgd2hlbiBpdCBhbHJlYWR5IGhhcyBhIHZhbHVlIG9uIHZhcmlhYmxlIGJsdXInLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gQ3JlYXRlIGluaXRpYWwgZGF0YSB3aXRoIGV4aXN0aW5nIGxhYmVsXG4gICAgICBjb25zdCBpbml0aWFsRGF0YSA9IGNyZWF0ZUZvcm1EYXRhKHtcbiAgICAgICAgdmFyaWFibGU6ICcnLFxuICAgICAgICBsYWJlbDogJ0V4aXN0aW5nIExhYmVsJywgLy8gTGFiZWwgYWxyZWFkeSBoYXMgdmFsdWVcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0RmllbGRGb3JtUHJvcHMoeyBpbml0aWFsRGF0YSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPElucHV0RmllbGRGb3JtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEZpbmQgdGhlIHZhcmlhYmxlIGlucHV0IGFuZCB0cmlnZ2VyIGJsdXIgd2l0aCBhIHZhbHVlXG4gICAgICBjb25zdCB2YXJpYWJsZUlucHV0ID0gc2NyZWVuLmdldEJ5TGFiZWxUZXh0KCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy52YXJOYW1lJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UodmFyaWFibGVJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICduZXdfdmFyJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuYmx1cih2YXJpYWJsZUlucHV0KVxuXG4gICAgICAvLyBBc3NlcnQgLSBUaGUgbGFiZWwgZmllbGQgc2hvdWxkIHJlbWFpbiB1bmNoYW5nZWQgYmVjYXVzZSBpdCBhbHJlYWR5IGhhcyBhIHZhbHVlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgbGFiZWxJbnB1dCA9IHNjcmVlbi5nZXRCeUxhYmVsVGV4dCgnYXBwRGVidWcudmFyaWFibGVDb25maWcuZGlzcGxheU5hbWUnKVxuICAgICAgICBleHBlY3QobGFiZWxJbnB1dCkudG9IYXZlVmFsdWUoJ0V4aXN0aW5nIExhYmVsJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJpZ2dlciBzZXRGaWVsZFZhbHVlIHdoZW4gZGlzcGxheSBuYW1lIGJsdXIgZXZlbnQgZmlyZXMgd2l0aCBlbXB0eSB2YWx1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBDcmVhdGUgaW5pdGlhbCBkYXRhIHdpdGggYSB2YXJpYWJsZSBidXQgd2Ugd2lsbCBjbGVhciB0aGUgbGFiZWxcbiAgICAgIGNvbnN0IGluaXRpYWxEYXRhID0gY3JlYXRlRm9ybURhdGEoe1xuICAgICAgICB2YXJpYWJsZTogJ29yaWdpbmFsX3ZhcicsXG4gICAgICAgIGxhYmVsOiAnU29tZSBMYWJlbCcsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRm9ybVByb3BzKHsgaW5pdGlhbERhdGEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBGaW5kIHRoZSBsYWJlbCBpbnB1dCwgY2xlYXIgaXQsIGFuZCB0cmlnZ2VyIGJsdXJcbiAgICAgIGNvbnN0IGxhYmVsSW5wdXQgPSBzY3JlZW4uZ2V0QnlMYWJlbFRleHQoJ2FwcERlYnVnLnZhcmlhYmxlQ29uZmlnLmRpc3BsYXlOYW1lJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UobGFiZWxJbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICcnIH0gfSlcbiAgICAgIGZpcmVFdmVudC5ibHVyKGxhYmVsSW5wdXQpXG5cbiAgICAgIC8vIEFzc2VydCAtIFdoZW4gbGFiZWwgaXMgY2xlYXJlZCBhbmQgYmx1cnJlZCwgaXQgc2hvdWxkIGJlIHJlc2V0IHRvIHZhcmlhYmxlIG5hbWVcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobGFiZWxJbnB1dCkudG9IYXZlVmFsdWUoJ29yaWdpbmFsX3ZhcicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGtlZXAgbGFiZWwgdmFsdWUgd2hlbiBkaXNwbGF5IG5hbWUgYmx1ciBldmVudCBmaXJlcyB3aXRoIG5vbi1lbXB0eSB2YWx1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxEYXRhID0gY3JlYXRlRm9ybURhdGEoe1xuICAgICAgICB2YXJpYWJsZTogJ3Rlc3RfdmFyJyxcbiAgICAgICAgbGFiZWw6ICdPcmlnaW5hbCBMYWJlbCcsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dEZpZWxkRm9ybVByb3BzKHsgaW5pdGlhbERhdGEgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxJbnB1dEZpZWxkRm9ybSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBGaW5kIHRoZSBsYWJlbCBpbnB1dCwgY2hhbmdlIGl0IHRvIGEgbmV3IHZhbHVlLCBhbmQgdHJpZ2dlciBibHVyXG4gICAgICBjb25zdCBsYWJlbElucHV0ID0gc2NyZWVuLmdldEJ5TGFiZWxUZXh0KCdhcHBEZWJ1Zy52YXJpYWJsZUNvbmZpZy5kaXNwbGF5TmFtZScpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGxhYmVsSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnTmV3IExhYmVsJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuYmx1cihsYWJlbElucHV0KVxuXG4gICAgICAvLyBBc3NlcnQgLSBMYWJlbCBzaG91bGQga2VlcCB0aGUgbmV3IG5vbi1lbXB0eSB2YWx1ZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChsYWJlbElucHV0KS50b0hhdmVWYWx1ZSgnTmV3IExhYmVsJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=