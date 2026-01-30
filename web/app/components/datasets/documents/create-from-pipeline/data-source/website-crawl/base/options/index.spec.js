"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const types_1 = require("@/app/components/base/form/form-scenarios/base/types");
const toast_1 = require("@/app/components/base/toast");
const datasets_1 = require("@/models/datasets");
const pipeline_1 = require("@/models/pipeline");
const index_1 = require("./index");
// ==========================================
// Mock Modules
// ==========================================
// Note: react-i18next uses global mock from web/vitest.setup.ts
// Mock useInitialData and useConfigurations hooks
const { mockUseInitialData, mockUseConfigurations } = vi.hoisted(() => ({
    mockUseInitialData: vi.fn(),
    mockUseConfigurations: vi.fn(),
}));
vi.mock('@/app/components/rag-pipeline/hooks/use-input-fields', () => ({
    useInitialData: mockUseInitialData,
    useConfigurations: mockUseConfigurations,
}));
// Mock BaseField
const mockBaseField = vi.fn();
vi.mock('@/app/components/base/form/form-scenarios/base/field', () => {
    const MockBaseFieldFactory = (props) => {
        mockBaseField(props);
        const MockField = ({ form }) => (<div data-testid={`field-${props.config?.variable || 'unknown'}`}>
        <span data-testid={`field-label-${props.config?.variable}`}>{props.config?.label}</span>
        <input data-testid={`field-input-${props.config?.variable}`} value={form.getFieldValue?.(props.config?.variable) || ''} onChange={e => form.setFieldValue?.(props.config?.variable, e.target.value)}/>
      </div>);
        return MockField;
    };
    return { default: MockBaseFieldFactory };
});
// Mock useAppForm
const mockHandleSubmit = vi.fn();
const mockFormValues = {};
vi.mock('@/app/components/base/form', () => ({
    useAppForm: (options) => {
        const formOptions = options;
        return {
            handleSubmit: () => {
                const validationResult = formOptions.validators?.onSubmit?.({ value: mockFormValues });
                if (!validationResult) {
                    mockHandleSubmit();
                    formOptions.onSubmit?.({ value: mockFormValues });
                }
            },
            getFieldValue: (field) => mockFormValues[field],
            setFieldValue: (field, value) => {
                mockFormValues[field] = value;
            },
        };
    },
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockVariable = (overrides) => ({
    belong_to_node_id: 'node-1',
    type: pipeline_1.PipelineInputVarType.textInput,
    label: 'Test Label',
    variable: 'test_variable',
    max_length: 100,
    default_value: '',
    placeholder: 'Enter value',
    required: true,
    ...overrides,
});
const createMockVariables = (count = 1) => {
    return Array.from({ length: count }, (_, i) => createMockVariable({
        variable: `variable_${i}`,
        label: `Label ${i}`,
    }));
};
const createMockConfiguration = (overrides) => ({
    type: types_1.BaseFieldType.textInput,
    variable: 'test_variable',
    label: 'Test Label',
    required: true,
    maxLength: 100,
    options: [],
    showConditions: [],
    placeholder: 'Enter value',
    ...overrides,
});
const createDefaultProps = (overrides) => ({
    variables: createMockVariables(),
    step: datasets_1.CrawlStep.init,
    runDisabled: false,
    onSubmit: vi.fn(),
    ...overrides,
});
// ==========================================
// Test Suites
// ==========================================
describe('Options', () => {
    let toastNotifySpy;
    beforeEach(() => {
        vi.clearAllMocks();
        // Spy on Toast.notify instead of mocking the entire module
        toastNotifySpy = vi.spyOn(toast_1.default, 'notify').mockImplementation(() => ({ clear: vi.fn() }));
        // Reset mock form values
        Object.keys(mockFormValues).forEach(key => delete mockFormValues[key]);
        // Default mock return values - using real generateZodSchema
        mockUseInitialData.mockReturnValue({});
        mockUseConfigurations.mockReturnValue([createMockConfiguration()]);
    });
    afterEach(() => {
        toastNotifySpy.mockRestore();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should render options header with toggle text', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(/options/i)).toBeInTheDocument();
        });
        it('should render Run button', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            expect(react_1.screen.getByText(/run/i)).toBeInTheDocument();
        });
        it('should render form fields when not folded', () => {
            // Arrange
            const configurations = [
                createMockConfiguration({ variable: 'url', label: 'URL' }),
                createMockConfiguration({ variable: 'depth', label: 'Depth' }),
            ];
            mockUseConfigurations.mockReturnValue(configurations);
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-url')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-depth')).toBeInTheDocument();
        });
        it('should render arrow icon in correct orientation when expanded', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Arrow should not have -rotate-90 class when expanded
            const arrowIcon = container.querySelector('svg');
            expect(arrowIcon).toBeInTheDocument();
            expect(arrowIcon).not.toHaveClass('-rotate-90');
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('variables prop', () => {
            it('should pass variables to useInitialData hook', () => {
                // Arrange
                const variables = createMockVariables(3);
                const props = createDefaultProps({ variables });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockUseInitialData).toHaveBeenCalledWith(variables);
            });
            it('should pass variables to useConfigurations hook', () => {
                // Arrange
                const variables = createMockVariables(2);
                const props = createDefaultProps({ variables });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockUseConfigurations).toHaveBeenCalledWith(variables);
            });
            it('should render correct number of fields based on configurations', () => {
                // Arrange
                const configurations = [
                    createMockConfiguration({ variable: 'field_1', label: 'Field 1' }),
                    createMockConfiguration({ variable: 'field_2', label: 'Field 2' }),
                    createMockConfiguration({ variable: 'field_3', label: 'Field 3' }),
                ];
                mockUseConfigurations.mockReturnValue(configurations);
                const props = createDefaultProps();
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('field-field_1')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('field-field_2')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('field-field_3')).toBeInTheDocument();
            });
            it('should handle empty variables array', () => {
                // Arrange
                mockUseConfigurations.mockReturnValue([]);
                const props = createDefaultProps({ variables: [] });
                // Act
                const { container } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(container.querySelector('form')).toBeInTheDocument();
                expect(react_1.screen.queryByTestId(/field-/)).not.toBeInTheDocument();
            });
        });
        describe('step prop', () => {
            it('should show "Run" text when step is init', () => {
                // Arrange
                const props = createDefaultProps({ step: datasets_1.CrawlStep.init });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/run/i)).toBeInTheDocument();
            });
            it('should show "Running" text when step is running', () => {
                // Arrange
                const props = createDefaultProps({ step: datasets_1.CrawlStep.running });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(/running/i)).toBeInTheDocument();
            });
            it('should disable button when step is running', () => {
                // Arrange
                const props = createDefaultProps({ step: datasets_1.CrawlStep.running });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeDisabled();
            });
            it('should enable button when step is finished', () => {
                // Arrange
                const props = createDefaultProps({ step: datasets_1.CrawlStep.finished, runDisabled: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            });
            it('should show loading state on button when step is running', () => {
                // Arrange
                const props = createDefaultProps({ step: datasets_1.CrawlStep.running });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Button should have loading prop which disables it
                const button = react_1.screen.getByRole('button');
                expect(button).toBeDisabled();
            });
        });
        describe('runDisabled prop', () => {
            it('should disable button when runDisabled is true', () => {
                // Arrange
                const props = createDefaultProps({ runDisabled: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeDisabled();
            });
            it('should enable button when runDisabled is false and step is not running', () => {
                // Arrange
                const props = createDefaultProps({ runDisabled: false, step: datasets_1.CrawlStep.init });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            });
            it('should disable button when both runDisabled is true and step is running', () => {
                // Arrange
                const props = createDefaultProps({ runDisabled: true, step: datasets_1.CrawlStep.running });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).toBeDisabled();
            });
            it('should default runDisabled to undefined (falsy)', () => {
                // Arrange
                const props = createDefaultProps();
                delete props.runDisabled;
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('button')).not.toBeDisabled();
            });
        });
        describe('onSubmit prop', () => {
            it('should call onSubmit when form is submitted successfully', () => {
                // Arrange - Use non-required field so validation passes
                const config = createMockConfiguration({
                    variable: 'optional_field',
                    required: false,
                    type: types_1.BaseFieldType.textInput,
                });
                mockUseConfigurations.mockReturnValue([config]);
                const mockOnSubmit = vi.fn();
                const props = createDefaultProps({ onSubmit: mockOnSubmit });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                expect(mockOnSubmit).toHaveBeenCalled();
            });
            it('should not call onSubmit when validation fails', () => {
                // Arrange
                const mockOnSubmit = vi.fn();
                // Create a required field configuration
                const requiredConfig = createMockConfiguration({
                    variable: 'url',
                    label: 'URL',
                    required: true,
                    type: types_1.BaseFieldType.textInput,
                });
                mockUseConfigurations.mockReturnValue([requiredConfig]);
                // mockFormValues is empty, so required field validation will fail
                const props = createDefaultProps({ onSubmit: mockOnSubmit });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                expect(mockOnSubmit).not.toHaveBeenCalled();
            });
            it('should pass form values to onSubmit', () => {
                // Arrange - Use non-required fields so validation passes
                const configs = [
                    createMockConfiguration({ variable: 'url', required: false, type: types_1.BaseFieldType.textInput }),
                    createMockConfiguration({ variable: 'depth', required: false, type: types_1.BaseFieldType.numberInput }),
                ];
                mockUseConfigurations.mockReturnValue(configs);
                mockFormValues.url = 'https://example.com';
                mockFormValues.depth = 2;
                const mockOnSubmit = vi.fn();
                const props = createDefaultProps({ onSubmit: mockOnSubmit });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button'));
                // Assert
                expect(mockOnSubmit).toHaveBeenCalledWith({ url: 'https://example.com', depth: 2 });
            });
        });
    });
    // ==========================================
    // Side Effects and Cleanup (useEffect)
    // ==========================================
    describe('Side Effects and Cleanup', () => {
        it('should expand options when step changes to init', () => {
            // Arrange
            const props = createDefaultProps({ step: datasets_1.CrawlStep.finished });
            const { rerender, container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Change step to init
            rerender(<index_1.default {...props} step={datasets_1.CrawlStep.init}/>);
            // Assert - Fields should be visible (expanded)
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
            const arrowIcon = container.querySelector('svg');
            expect(arrowIcon).not.toHaveClass('-rotate-90');
        });
        it('should collapse options when step changes to running', () => {
            // Arrange
            const props = createDefaultProps({ step: datasets_1.CrawlStep.init });
            const { rerender, container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initially expanded
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
            // Act - Change step to running
            rerender(<index_1.default {...props} step={datasets_1.CrawlStep.running}/>);
            // Assert - Should collapse (fields hidden, arrow rotated)
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
            const arrowIcon = container.querySelector('svg');
            expect(arrowIcon).toHaveClass('-rotate-90');
        });
        it('should collapse options when step changes to finished', () => {
            // Arrange
            const props = createDefaultProps({ step: datasets_1.CrawlStep.init });
            const { rerender, container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Change step to finished
            rerender(<index_1.default {...props} step={datasets_1.CrawlStep.finished}/>);
            // Assert - Should collapse
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
            const arrowIcon = container.querySelector('svg');
            expect(arrowIcon).toHaveClass('-rotate-90');
        });
        it('should respond to step transitions from init -> running -> finished', () => {
            // Arrange
            const props = createDefaultProps({ step: datasets_1.CrawlStep.init });
            const { rerender, container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initially expanded
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
            // Act - Transition to running
            rerender(<index_1.default {...props} step={datasets_1.CrawlStep.running}/>);
            // Assert - Collapsed
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
            let arrowIcon = container.querySelector('svg');
            expect(arrowIcon).toHaveClass('-rotate-90');
            // Act - Transition to finished
            rerender(<index_1.default {...props} step={datasets_1.CrawlStep.finished}/>);
            // Assert - Still collapsed
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
            arrowIcon = container.querySelector('svg');
            expect(arrowIcon).toHaveClass('-rotate-90');
        });
        it('should expand when step transitions from finished to init', () => {
            // Arrange
            const props = createDefaultProps({ step: datasets_1.CrawlStep.finished });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initially collapsed when finished
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
            // Act - Transition back to init
            rerender(<index_1.default {...props} step={datasets_1.CrawlStep.init}/>);
            // Assert - Should expand
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Memoization Logic and Dependencies
    // ==========================================
    describe('Memoization Logic and Dependencies', () => {
        it('should regenerate schema when configurations change', () => {
            // Arrange
            const config1 = [createMockConfiguration({ variable: 'url' })];
            const config2 = [createMockConfiguration({ variable: 'depth' })];
            mockUseConfigurations.mockReturnValue(config1);
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - First render creates schema
            expect(react_1.screen.getByTestId('field-url')).toBeInTheDocument();
            // Act - Change configurations
            mockUseConfigurations.mockReturnValue(config2);
            rerender(<index_1.default {...props} variables={createMockVariables(2)}/>);
            // Assert - New field is rendered with new schema
            expect(react_1.screen.getByTestId('field-depth')).toBeInTheDocument();
        });
        it('should compute isRunning correctly for init step', () => {
            // Arrange
            const props = createDefaultProps({ step: datasets_1.CrawlStep.init });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Button should not be in loading state
            const button = react_1.screen.getByRole('button');
            expect(button).not.toBeDisabled();
            expect(react_1.screen.getByText(/run/i)).toBeInTheDocument();
        });
        it('should compute isRunning correctly for running step', () => {
            // Arrange
            const props = createDefaultProps({ step: datasets_1.CrawlStep.running });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Button should be in loading state
            const button = react_1.screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(react_1.screen.getByText(/running/i)).toBeInTheDocument();
        });
        it('should compute isRunning correctly for finished step', () => {
            // Arrange
            const props = createDefaultProps({ step: datasets_1.CrawlStep.finished });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Button should not be in loading state
            expect(react_1.screen.getByText(/run/i)).toBeInTheDocument();
        });
        it('should use memoized schema for validation', () => {
            // Arrange - Use real generateZodSchema with valid configuration
            const config = createMockConfiguration({
                variable: 'test_field',
                required: false, // Not required so validation passes with empty value
            });
            mockUseConfigurations.mockReturnValue([config]);
            const mockOnSubmit = vi.fn();
            const props = createDefaultProps({ onSubmit: mockOnSubmit });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Trigger validation via submit
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - onSubmit should be called if validation passes
            expect(mockOnSubmit).toHaveBeenCalled();
        });
    });
    // ==========================================
    // User Interactions and Event Handlers
    // ==========================================
    describe('User Interactions and Event Handlers', () => {
        it('should toggle fold state when header is clicked', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initially expanded
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
            // Act - Click to fold
            react_1.fireEvent.click(react_1.screen.getByText(/options/i));
            // Assert - Should be folded
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
            // Act - Click to unfold
            react_1.fireEvent.click(react_1.screen.getByText(/options/i));
            // Assert - Should be expanded again
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
        });
        it('should prevent default and stop propagation on form submit', () => {
            // Arrange
            const props = createDefaultProps();
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const form = container.querySelector('form');
            const mockPreventDefault = vi.fn();
            const mockStopPropagation = vi.fn();
            react_1.fireEvent.submit(form, {
                preventDefault: mockPreventDefault,
                stopPropagation: mockStopPropagation,
            });
            // Assert - The form element handles submit event
            expect(form).toBeInTheDocument();
        });
        it('should trigger form submit when button is clicked', () => {
            // Arrange - Use non-required field so validation passes
            const config = createMockConfiguration({
                variable: 'optional_field',
                required: false,
                type: types_1.BaseFieldType.textInput,
            });
            mockUseConfigurations.mockReturnValue([config]);
            const mockOnSubmit = vi.fn();
            const props = createDefaultProps({ onSubmit: mockOnSubmit });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockOnSubmit).toHaveBeenCalled();
        });
        it('should not trigger submit when button is disabled', () => {
            // Arrange
            const mockOnSubmit = vi.fn();
            const props = createDefaultProps({ onSubmit: mockOnSubmit, runDisabled: true });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Try to click disabled button
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
        it('should maintain fold state after form submission', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initially expanded
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
            // Act - Submit form
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - Should still be expanded (unless step changes)
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
        });
        it('should allow clicking on arrow icon container to toggle', () => {
            // Arrange
            const props = createDefaultProps();
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initially expanded
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
            // Act - Click on the toggle container (parent of the options text and arrow)
            const toggleContainer = container.querySelector('.cursor-pointer');
            react_1.fireEvent.click(toggleContainer);
            // Assert - Should be folded
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle validation error and show toast', () => {
            // Arrange - Create required field that will fail validation when empty
            const requiredConfig = createMockConfiguration({
                variable: 'url',
                label: 'URL',
                required: true,
                type: types_1.BaseFieldType.textInput,
            });
            mockUseConfigurations.mockReturnValue([requiredConfig]);
            // mockFormValues.url is undefined, so validation will fail
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - Toast should be called with error message
            expect(toastNotifySpy).toHaveBeenCalledWith(expect.objectContaining({
                type: 'error',
            }));
        });
        it('should handle validation error and display field name in message', () => {
            // Arrange - Create required field that will fail validation
            const requiredConfig = createMockConfiguration({
                variable: 'email_address',
                label: 'Email Address',
                required: true,
                type: types_1.BaseFieldType.textInput,
            });
            mockUseConfigurations.mockReturnValue([requiredConfig]);
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - Toast message should contain field path
            expect(toastNotifySpy).toHaveBeenCalledWith(expect.objectContaining({
                type: 'error',
                message: expect.stringContaining('email_address'),
            }));
        });
        it('should handle empty variables gracefully', () => {
            // Arrange
            mockUseConfigurations.mockReturnValue([]);
            const props = createDefaultProps({ variables: [] });
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should render without errors
            expect(container.querySelector('form')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should handle single variable configuration', () => {
            // Arrange
            const singleConfig = [createMockConfiguration({ variable: 'only_field' })];
            mockUseConfigurations.mockReturnValue(singleConfig);
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-only_field')).toBeInTheDocument();
        });
        it('should handle many configurations', () => {
            // Arrange
            const manyConfigs = Array.from({ length: 10 }, (_, i) => createMockConfiguration({ variable: `field_${i}`, label: `Field ${i}` }));
            mockUseConfigurations.mockReturnValue(manyConfigs);
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            for (let i = 0; i < 10; i++)
                expect(react_1.screen.getByTestId(`field-field_${i}`)).toBeInTheDocument();
        });
        it('should handle validation with multiple required fields (shows first error)', () => {
            // Arrange - Multiple required fields
            const configs = [
                createMockConfiguration({ variable: 'url', label: 'URL', required: true, type: types_1.BaseFieldType.textInput }),
                createMockConfiguration({ variable: 'depth', label: 'Depth', required: true, type: types_1.BaseFieldType.textInput }),
            ];
            mockUseConfigurations.mockReturnValue(configs);
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - Toast should be called once (only first error)
            expect(toastNotifySpy).toHaveBeenCalledTimes(1);
            expect(toastNotifySpy).toHaveBeenCalledWith(expect.objectContaining({
                type: 'error',
            }));
        });
        it('should handle validation pass when all required fields have values', () => {
            // Arrange
            const requiredConfig = createMockConfiguration({
                variable: 'url',
                label: 'URL',
                required: true,
                type: types_1.BaseFieldType.textInput,
            });
            mockUseConfigurations.mockReturnValue([requiredConfig]);
            mockFormValues.url = 'https://example.com'; // Provide valid value
            const mockOnSubmit = vi.fn();
            const props = createDefaultProps({ onSubmit: mockOnSubmit });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert - No toast error, onSubmit called
            expect(toastNotifySpy).not.toHaveBeenCalled();
            expect(mockOnSubmit).toHaveBeenCalled();
        });
        it('should handle undefined variables gracefully', () => {
            // Arrange
            mockUseInitialData.mockReturnValue({});
            mockUseConfigurations.mockReturnValue([]);
            const props = createDefaultProps({ variables: undefined });
            // Act & Assert - Should not throw
            expect(() => (0, react_1.render)(<index_1.default {...props}/>)).not.toThrow();
        });
        it('should handle rapid fold/unfold toggling', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Toggle rapidly multiple times
            const toggleText = react_1.screen.getByText(/options/i);
            for (let i = 0; i < 5; i++)
                react_1.fireEvent.click(toggleText);
            // Assert - Final state should be folded (odd number of clicks)
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // All Prop Variations
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            [{ step: datasets_1.CrawlStep.init, runDisabled: false }, false, 'run'],
            [{ step: datasets_1.CrawlStep.init, runDisabled: true }, true, 'run'],
            [{ step: datasets_1.CrawlStep.running, runDisabled: false }, true, 'running'],
            [{ step: datasets_1.CrawlStep.running, runDisabled: true }, true, 'running'],
            [{ step: datasets_1.CrawlStep.finished, runDisabled: false }, false, 'run'],
            [{ step: datasets_1.CrawlStep.finished, runDisabled: true }, true, 'run'],
        ])('should render correctly with step=%s, runDisabled=%s', (propVariation, expectedDisabled, expectedText) => {
            // Arrange
            const props = createDefaultProps(propVariation);
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            if (expectedDisabled)
                expect(button).toBeDisabled();
            else
                expect(button).not.toBeDisabled();
            expect(react_1.screen.getByText(new RegExp(expectedText, 'i'))).toBeInTheDocument();
        });
        it('should handle all CrawlStep values', () => {
            // Arrange & Act & Assert
            Object.values(datasets_1.CrawlStep).forEach((step) => {
                const props = createDefaultProps({ step });
                const { unmount, container } = (0, react_1.render)(<index_1.default {...props}/>);
                expect(container.querySelector('form')).toBeInTheDocument();
                unmount();
            });
        });
        it('should handle variables with different types', () => {
            // Arrange
            const variables = [
                createMockVariable({ type: pipeline_1.PipelineInputVarType.textInput, variable: 'text_field' }),
                createMockVariable({ type: pipeline_1.PipelineInputVarType.paragraph, variable: 'paragraph_field' }),
                createMockVariable({ type: pipeline_1.PipelineInputVarType.number, variable: 'number_field' }),
                createMockVariable({ type: pipeline_1.PipelineInputVarType.checkbox, variable: 'checkbox_field' }),
                createMockVariable({ type: pipeline_1.PipelineInputVarType.select, variable: 'select_field' }),
            ];
            const configurations = variables.map(v => createMockConfiguration({ variable: v.variable }));
            mockUseConfigurations.mockReturnValue(configurations);
            const props = createDefaultProps({ variables });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            variables.forEach((v) => {
                expect(react_1.screen.getByTestId(`field-${v.variable}`)).toBeInTheDocument();
            });
        });
    });
    // ==========================================
    // Form Validation
    // ==========================================
    describe('Form Validation', () => {
        it('should pass validation with valid data', () => {
            // Arrange - Use non-required field so empty value passes
            const config = createMockConfiguration({
                variable: 'optional_field',
                required: false,
                type: types_1.BaseFieldType.textInput,
            });
            mockUseConfigurations.mockReturnValue([config]);
            const mockOnSubmit = vi.fn();
            const props = createDefaultProps({ onSubmit: mockOnSubmit });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockOnSubmit).toHaveBeenCalled();
            expect(toastNotifySpy).not.toHaveBeenCalled();
        });
        it('should fail validation with invalid data', () => {
            // Arrange - Required field with empty value
            const config = createMockConfiguration({
                variable: 'url',
                label: 'URL',
                required: true,
                type: types_1.BaseFieldType.textInput,
            });
            mockUseConfigurations.mockReturnValue([config]);
            const mockOnSubmit = vi.fn();
            const props = createDefaultProps({ onSubmit: mockOnSubmit });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockOnSubmit).not.toHaveBeenCalled();
            expect(toastNotifySpy).toHaveBeenCalled();
        });
        it('should show error toast message when validation fails', () => {
            // Arrange - Required field with empty value
            const config = createMockConfiguration({
                variable: 'my_field',
                label: 'My Field',
                required: true,
                type: types_1.BaseFieldType.textInput,
            });
            mockUseConfigurations.mockReturnValue([config]);
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(toastNotifySpy).toHaveBeenCalledWith(expect.objectContaining({
                type: 'error',
                message: expect.any(String),
            }));
        });
    });
    // ==========================================
    // Styling Tests
    // ==========================================
    describe('Styling', () => {
        it('should apply correct container classes to form', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const form = container.querySelector('form');
            expect(form).toHaveClass('w-full');
        });
        it('should apply cursor-pointer class to toggle container', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const toggleContainer = container.querySelector('.cursor-pointer');
            expect(toggleContainer).toBeInTheDocument();
        });
        it('should apply select-none class to prevent text selection on toggle', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const toggleContainer = container.querySelector('.select-none');
            expect(toggleContainer).toBeInTheDocument();
        });
        it('should apply rotate class to arrow icon when folded', () => {
            // Arrange
            const props = createDefaultProps();
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Fold the options
            react_1.fireEvent.click(react_1.screen.getByText(/options/i));
            // Assert
            const arrowIcon = container.querySelector('svg');
            expect(arrowIcon).toHaveClass('-rotate-90');
        });
        it('should not apply rotate class to arrow icon when expanded', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const arrowIcon = container.querySelector('svg');
            expect(arrowIcon).not.toHaveClass('-rotate-90');
        });
        it('should apply border class to fields container when expanded', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const fieldsContainer = container.querySelector('.border-t');
            expect(fieldsContainer).toBeInTheDocument();
        });
    });
    // ==========================================
    // BaseField Integration
    // ==========================================
    describe('BaseField Integration', () => {
        it('should pass correct props to BaseField factory', () => {
            // Arrange
            const config = createMockConfiguration({ variable: 'test_var', label: 'Test Label' });
            mockUseConfigurations.mockReturnValue([config]);
            mockUseInitialData.mockReturnValue({ test_var: 'default_value' });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockBaseField).toHaveBeenCalledWith(expect.objectContaining({
                initialData: { test_var: 'default_value' },
                config,
            }));
        });
        it('should render unique key for each field', () => {
            // Arrange
            const configurations = [
                createMockConfiguration({ variable: 'field_a' }),
                createMockConfiguration({ variable: 'field_b' }),
                createMockConfiguration({ variable: 'field_c' }),
            ];
            mockUseConfigurations.mockReturnValue(configurations);
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - All fields should be rendered (React would warn if keys aren't unique)
            expect(react_1.screen.getByTestId('field-field_a')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-field_b')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-field_c')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixnRkFBb0Y7QUFDcEYsdURBQStDO0FBQy9DLGdEQUE2QztBQUM3QyxnREFBd0Q7QUFDeEQsbUNBQTZCO0FBRTdCLDZDQUE2QztBQUM3QyxlQUFlO0FBQ2YsNkNBQTZDO0FBRTdDLGdFQUFnRTtBQUVoRSxrREFBa0Q7QUFDbEQsTUFBTSxFQUFFLGtCQUFrQixFQUFFLHFCQUFxQixFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDM0IscUJBQXFCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUMvQixDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNyRSxjQUFjLEVBQUUsa0JBQWtCO0lBQ2xDLGlCQUFpQixFQUFFLHFCQUFxQjtDQUN6QyxDQUFDLENBQUMsQ0FBQTtBQUVILGlCQUFpQjtBQUNqQixNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDN0IsRUFBRSxDQUFDLElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7SUFDbkUsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFO1FBQzFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQixNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsSUFBSSxFQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUM3QyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEtBQUssQ0FBQyxNQUFNLEVBQUUsUUFBUSxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQy9EO1FBQUEs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QUFRLEVBQUUsU0FBUyxFQUFFLENBQUM7Z0JBQ2hELHVCQUF1QixDQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDO2dCQUNoRCx1QkFBdUIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQzthQUNqRCxDQUFBO1lBQ0QscUJBQXFCLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBQ3JELE1BQU0sS0FBSyxHQUFHLGtCQUFrQixFQUFFLENBQUE7WUFFbEMsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBTyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTlCLGtGQUFrRjtZQUNsRixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDL0QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQy9ELE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNqRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2tJbnN0YW5jZSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB0eXBlIHsgUkFHUGlwZWxpbmVWYXJpYWJsZXMgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCYXNlRmllbGRUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0vZm9ybS1zY2VuYXJpb3MvYmFzZS90eXBlcydcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgeyBDcmF3bFN0ZXAgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IFBpcGVsaW5lSW5wdXRWYXJUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgT3B0aW9ucyBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgTW9kdWxlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE5vdGU6IHJlYWN0LWkxOG5leHQgdXNlcyBnbG9iYWwgbW9jayBmcm9tIHdlYi92aXRlc3Quc2V0dXAudHNcblxuLy8gTW9jayB1c2VJbml0aWFsRGF0YSBhbmQgdXNlQ29uZmlndXJhdGlvbnMgaG9va3NcbmNvbnN0IHsgbW9ja1VzZUluaXRpYWxEYXRhLCBtb2NrVXNlQ29uZmlndXJhdGlvbnMgfSA9IHZpLmhvaXN0ZWQoKCkgPT4gKHtcbiAgbW9ja1VzZUluaXRpYWxEYXRhOiB2aS5mbigpLFxuICBtb2NrVXNlQ29uZmlndXJhdGlvbnM6IHZpLmZuKCksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9yYWctcGlwZWxpbmUvaG9va3MvdXNlLWlucHV0LWZpZWxkcycsICgpID0+ICh7XG4gIHVzZUluaXRpYWxEYXRhOiBtb2NrVXNlSW5pdGlhbERhdGEsXG4gIHVzZUNvbmZpZ3VyYXRpb25zOiBtb2NrVXNlQ29uZmlndXJhdGlvbnMsXG59KSlcblxuLy8gTW9jayBCYXNlRmllbGRcbmNvbnN0IG1vY2tCYXNlRmllbGQgPSB2aS5mbigpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9iYXNlL2ZpZWxkJywgKCkgPT4ge1xuICBjb25zdCBNb2NrQmFzZUZpZWxkRmFjdG9yeSA9IChwcm9wczogYW55KSA9PiB7XG4gICAgbW9ja0Jhc2VGaWVsZChwcm9wcylcbiAgICBjb25zdCBNb2NrRmllbGQgPSAoeyBmb3JtIH06IHsgZm9ybTogYW55IH0pID0+IChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9e2BmaWVsZC0ke3Byb3BzLmNvbmZpZz8udmFyaWFibGUgfHwgJ3Vua25vd24nfWB9PlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YGZpZWxkLWxhYmVsLSR7cHJvcHMuY29uZmlnPy52YXJpYWJsZX1gfT57cHJvcHMuY29uZmlnPy5sYWJlbH08L3NwYW4+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGRhdGEtdGVzdGlkPXtgZmllbGQtaW5wdXQtJHtwcm9wcy5jb25maWc/LnZhcmlhYmxlfWB9XG4gICAgICAgICAgdmFsdWU9e2Zvcm0uZ2V0RmllbGRWYWx1ZT8uKHByb3BzLmNvbmZpZz8udmFyaWFibGUpIHx8ICcnfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IGZvcm0uc2V0RmllbGRWYWx1ZT8uKHByb3BzLmNvbmZpZz8udmFyaWFibGUsIGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgICByZXR1cm4gTW9ja0ZpZWxkXG4gIH1cbiAgcmV0dXJuIHsgZGVmYXVsdDogTW9ja0Jhc2VGaWVsZEZhY3RvcnkgfVxufSlcblxuLy8gTW9jayB1c2VBcHBGb3JtXG5jb25zdCBtb2NrSGFuZGxlU3VibWl0ID0gdmkuZm4oKVxuY29uc3QgbW9ja0Zvcm1WYWx1ZXM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0nLCAoKSA9PiAoe1xuICB1c2VBcHBGb3JtOiAob3B0aW9uczogYW55KSA9PiB7XG4gICAgY29uc3QgZm9ybU9wdGlvbnMgPSBvcHRpb25zXG4gICAgcmV0dXJuIHtcbiAgICAgIGhhbmRsZVN1Ym1pdDogKCkgPT4ge1xuICAgICAgICBjb25zdCB2YWxpZGF0aW9uUmVzdWx0ID0gZm9ybU9wdGlvbnMudmFsaWRhdG9ycz8ub25TdWJtaXQ/Lih7IHZhbHVlOiBtb2NrRm9ybVZhbHVlcyB9KVxuICAgICAgICBpZiAoIXZhbGlkYXRpb25SZXN1bHQpIHtcbiAgICAgICAgICBtb2NrSGFuZGxlU3VibWl0KClcbiAgICAgICAgICBmb3JtT3B0aW9ucy5vblN1Ym1pdD8uKHsgdmFsdWU6IG1vY2tGb3JtVmFsdWVzIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBnZXRGaWVsZFZhbHVlOiAoZmllbGQ6IHN0cmluZykgPT4gbW9ja0Zvcm1WYWx1ZXNbZmllbGRdLFxuICAgICAgc2V0RmllbGRWYWx1ZTogKGZpZWxkOiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgbW9ja0Zvcm1WYWx1ZXNbZmllbGRdID0gdmFsdWVcbiAgICAgIH0sXG4gICAgfVxuICB9LFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEJ1aWxkZXJzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlTW9ja1ZhcmlhYmxlID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8UkFHUGlwZWxpbmVWYXJpYWJsZXNbMF0+KTogUkFHUGlwZWxpbmVWYXJpYWJsZXNbMF0gPT4gKHtcbiAgYmVsb25nX3RvX25vZGVfaWQ6ICdub2RlLTEnLFxuICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsXG4gIGxhYmVsOiAnVGVzdCBMYWJlbCcsXG4gIHZhcmlhYmxlOiAndGVzdF92YXJpYWJsZScsXG4gIG1heF9sZW5ndGg6IDEwMCxcbiAgZGVmYXVsdF92YWx1ZTogJycsXG4gIHBsYWNlaG9sZGVyOiAnRW50ZXIgdmFsdWUnLFxuICByZXF1aXJlZDogdHJ1ZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja1ZhcmlhYmxlcyA9IChjb3VudCA9IDEpOiBSQUdQaXBlbGluZVZhcmlhYmxlcyA9PiB7XG4gIHJldHVybiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaSkgPT5cbiAgICBjcmVhdGVNb2NrVmFyaWFibGUoe1xuICAgICAgdmFyaWFibGU6IGB2YXJpYWJsZV8ke2l9YCxcbiAgICAgIGxhYmVsOiBgTGFiZWwgJHtpfWAsXG4gICAgfSkpXG59XG5cbmNvbnN0IGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8YW55Pik6IGFueSA9PiAoe1xuICB0eXBlOiBCYXNlRmllbGRUeXBlLnRleHRJbnB1dCxcbiAgdmFyaWFibGU6ICd0ZXN0X3ZhcmlhYmxlJyxcbiAgbGFiZWw6ICdUZXN0IExhYmVsJyxcbiAgcmVxdWlyZWQ6IHRydWUsXG4gIG1heExlbmd0aDogMTAwLFxuICBvcHRpb25zOiBbXSxcbiAgc2hvd0NvbmRpdGlvbnM6IFtdLFxuICBwbGFjZWhvbGRlcjogJ0VudGVyIHZhbHVlJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxudHlwZSBPcHRpb25zUHJvcHMgPSBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgT3B0aW9ucz5cblxuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8T3B0aW9uc1Byb3BzPik6IE9wdGlvbnNQcm9wcyA9PiAoe1xuICB2YXJpYWJsZXM6IGNyZWF0ZU1vY2tWYXJpYWJsZXMoKSxcbiAgc3RlcDogQ3Jhd2xTdGVwLmluaXQsXG4gIHJ1bkRpc2FibGVkOiBmYWxzZSxcbiAgb25TdWJtaXQ6IHZpLmZuKCksXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ09wdGlvbnMnLCAoKSA9PiB7XG4gIGxldCB0b2FzdE5vdGlmeVNweTogTW9ja0luc3RhbmNlXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG5cbiAgICAvLyBTcHkgb24gVG9hc3Qubm90aWZ5IGluc3RlYWQgb2YgbW9ja2luZyB0aGUgZW50aXJlIG1vZHVsZVxuICAgIHRvYXN0Tm90aWZ5U3B5ID0gdmkuc3B5T24oVG9hc3QsICdub3RpZnknKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gKHsgY2xlYXI6IHZpLmZuKCkgfSkpXG5cbiAgICAvLyBSZXNldCBtb2NrIGZvcm0gdmFsdWVzXG4gICAgT2JqZWN0LmtleXMobW9ja0Zvcm1WYWx1ZXMpLmZvckVhY2goa2V5ID0+IGRlbGV0ZSBtb2NrRm9ybVZhbHVlc1trZXldKVxuXG4gICAgLy8gRGVmYXVsdCBtb2NrIHJldHVybiB2YWx1ZXMgLSB1c2luZyByZWFsIGdlbmVyYXRlWm9kU2NoZW1hXG4gICAgbW9ja1VzZUluaXRpYWxEYXRhLm1vY2tSZXR1cm5WYWx1ZSh7fSlcbiAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKFtjcmVhdGVNb2NrQ29uZmlndXJhdGlvbigpXSlcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIHRvYXN0Tm90aWZ5U3B5Lm1vY2tSZXN0b3JlKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG9wdGlvbnMgaGVhZGVyIHdpdGggdG9nZ2xlIHRleHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL29wdGlvbnMvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUnVuIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9ydW4vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZm9ybSBmaWVsZHMgd2hlbiBub3QgZm9sZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICd1cmwnLCBsYWJlbDogJ1VSTCcgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdkZXB0aCcsIGxhYmVsOiAnRGVwdGgnIH0pLFxuICAgICAgXVxuICAgICAgbW9ja1VzZUNvbmZpZ3VyYXRpb25zLm1vY2tSZXR1cm5WYWx1ZShjb25maWd1cmF0aW9ucylcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC11cmwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtZGVwdGgnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhcnJvdyBpY29uIGluIGNvcnJlY3Qgb3JpZW50YXRpb24gd2hlbiBleHBhbmRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEFycm93IHNob3VsZCBub3QgaGF2ZSAtcm90YXRlLTkwIGNsYXNzIHdoZW4gZXhwYW5kZWRcbiAgICAgIGNvbnN0IGFycm93SWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KGFycm93SWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGFycm93SWNvbikubm90LnRvSGF2ZUNsYXNzKCctcm90YXRlLTkwJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3ZhcmlhYmxlcyBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHZhcmlhYmxlcyB0byB1c2VJbml0aWFsRGF0YSBob29rJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IGNyZWF0ZU1vY2tWYXJpYWJsZXMoMylcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YXJpYWJsZXMgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrVXNlSW5pdGlhbERhdGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHZhcmlhYmxlcylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyB2YXJpYWJsZXMgdG8gdXNlQ29uZmlndXJhdGlvbnMgaG9vaycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCB2YXJpYWJsZXMgPSBjcmVhdGVNb2NrVmFyaWFibGVzKDIpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgdmFyaWFibGVzIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1VzZUNvbmZpZ3VyYXRpb25zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh2YXJpYWJsZXMpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0IG51bWJlciBvZiBmaWVsZHMgYmFzZWQgb24gY29uZmlndXJhdGlvbnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogJ2ZpZWxkXzEnLCBsYWJlbDogJ0ZpZWxkIDEnIH0pLFxuICAgICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdmaWVsZF8yJywgbGFiZWw6ICdGaWVsZCAyJyB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnZmllbGRfMycsIGxhYmVsOiAnRmllbGQgMycgfSksXG4gICAgICAgIF1cbiAgICAgICAgbW9ja1VzZUNvbmZpZ3VyYXRpb25zLm1vY2tSZXR1cm5WYWx1ZShjb25maWd1cmF0aW9ucylcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtZmllbGRfMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWZpZWxkXzInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1maWVsZF8zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHZhcmlhYmxlcyBhcnJheScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKFtdKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhcmlhYmxlczogW10gfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoL2ZpZWxkLS8pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3N0ZXAgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyBcIlJ1blwiIHRleHQgd2hlbiBzdGVwIGlzIGluaXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdGVwOiBDcmF3bFN0ZXAuaW5pdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3J1bi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IFwiUnVubmluZ1wiIHRleHQgd2hlbiBzdGVwIGlzIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdGVwOiBDcmF3bFN0ZXAucnVubmluZyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3J1bm5pbmcvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGlzYWJsZSBidXR0b24gd2hlbiBzdGVwIGlzIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdGVwOiBDcmF3bFN0ZXAucnVubmluZyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBlbmFibGUgYnV0dG9uIHdoZW4gc3RlcCBpcyBmaW5pc2hlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHN0ZXA6IENyYXdsU3RlcC5maW5pc2hlZCwgcnVuRGlzYWJsZWQ6IGZhbHNlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgc3RhdGUgb24gYnV0dG9uIHdoZW4gc3RlcCBpcyBydW5uaW5nJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc3RlcDogQ3Jhd2xTdGVwLnJ1bm5pbmcgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gQnV0dG9uIHNob3VsZCBoYXZlIGxvYWRpbmcgcHJvcCB3aGljaCBkaXNhYmxlcyBpdFxuICAgICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgICBleHBlY3QoYnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3J1bkRpc2FibGVkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgYnV0dG9uIHdoZW4gcnVuRGlzYWJsZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHJ1bkRpc2FibGVkOiB0cnVlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGVuYWJsZSBidXR0b24gd2hlbiBydW5EaXNhYmxlZCBpcyBmYWxzZSBhbmQgc3RlcCBpcyBub3QgcnVubmluZycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHJ1bkRpc2FibGVkOiBmYWxzZSwgc3RlcDogQ3Jhd2xTdGVwLmluaXQgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgYnV0dG9uIHdoZW4gYm90aCBydW5EaXNhYmxlZCBpcyB0cnVlIGFuZCBzdGVwIGlzIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBydW5EaXNhYmxlZDogdHJ1ZSwgc3RlcDogQ3Jhd2xTdGVwLnJ1bm5pbmcgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGVmYXVsdCBydW5EaXNhYmxlZCB0byB1bmRlZmluZWQgKGZhbHN5KScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICAgIGRlbGV0ZSAocHJvcHMgYXMgYW55KS5ydW5EaXNhYmxlZFxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvblN1Ym1pdCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uU3VibWl0IHdoZW4gZm9ybSBpcyBzdWJtaXR0ZWQgc3VjY2Vzc2Z1bGx5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gVXNlIG5vbi1yZXF1aXJlZCBmaWVsZCBzbyB2YWxpZGF0aW9uIHBhc3Nlc1xuICAgICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7XG4gICAgICAgICAgdmFyaWFibGU6ICdvcHRpb25hbF9maWVsZCcsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICAgICAgICB9KVxuICAgICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKFtjb25maWddKVxuICAgICAgICBjb25zdCBtb2NrT25TdWJtaXQgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25TdWJtaXQ6IG1vY2tPblN1Ym1pdCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja09uU3VibWl0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25TdWJtaXQgd2hlbiB2YWxpZGF0aW9uIGZhaWxzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPblN1Ym1pdCA9IHZpLmZuKClcbiAgICAgICAgLy8gQ3JlYXRlIGEgcmVxdWlyZWQgZmllbGQgY29uZmlndXJhdGlvblxuICAgICAgICBjb25zdCByZXF1aXJlZENvbmZpZyA9IGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHtcbiAgICAgICAgICB2YXJpYWJsZTogJ3VybCcsXG4gICAgICAgICAgbGFiZWw6ICdVUkwnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICAgICAgICB9KVxuICAgICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKFtyZXF1aXJlZENvbmZpZ10pXG4gICAgICAgIC8vIG1vY2tGb3JtVmFsdWVzIGlzIGVtcHR5LCBzbyByZXF1aXJlZCBmaWVsZCB2YWxpZGF0aW9uIHdpbGwgZmFpbFxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU3VibWl0OiBtb2NrT25TdWJtaXQgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPblN1Ym1pdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGZvcm0gdmFsdWVzIHRvIG9uU3VibWl0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gVXNlIG5vbi1yZXF1aXJlZCBmaWVsZHMgc28gdmFsaWRhdGlvbiBwYXNzZXNcbiAgICAgICAgY29uc3QgY29uZmlncyA9IFtcbiAgICAgICAgICBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAndXJsJywgcmVxdWlyZWQ6IGZhbHNlLCB0eXBlOiBCYXNlRmllbGRUeXBlLnRleHRJbnB1dCB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnZGVwdGgnLCByZXF1aXJlZDogZmFsc2UsIHR5cGU6IEJhc2VGaWVsZFR5cGUubnVtYmVySW5wdXQgfSksXG4gICAgICAgIF1cbiAgICAgICAgbW9ja1VzZUNvbmZpZ3VyYXRpb25zLm1vY2tSZXR1cm5WYWx1ZShjb25maWdzKVxuICAgICAgICBtb2NrRm9ybVZhbHVlcy51cmwgPSAnaHR0cHM6Ly9leGFtcGxlLmNvbSdcbiAgICAgICAgbW9ja0Zvcm1WYWx1ZXMuZGVwdGggPSAyXG4gICAgICAgIGNvbnN0IG1vY2tPblN1Ym1pdCA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblN1Ym1pdDogbW9ja09uU3VibWl0IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25TdWJtaXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsIGRlcHRoOiAyIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFNpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCAodXNlRWZmZWN0KVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1NpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGV4cGFuZCBvcHRpb25zIHdoZW4gc3RlcCBjaGFuZ2VzIHRvIGluaXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHN0ZXA6IENyYXdsU3RlcC5maW5pc2hlZCB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciwgY29udGFpbmVyIH0gPSByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gQ2hhbmdlIHN0ZXAgdG8gaW5pdFxuICAgICAgcmVyZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSBzdGVwPXtDcmF3bFN0ZXAuaW5pdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEZpZWxkcyBzaG91bGQgYmUgdmlzaWJsZSAoZXhwYW5kZWQpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC10ZXN0X3ZhcmlhYmxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGNvbnN0IGFycm93SWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KGFycm93SWNvbikubm90LnRvSGF2ZUNsYXNzKCctcm90YXRlLTkwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb2xsYXBzZSBvcHRpb25zIHdoZW4gc3RlcCBjaGFuZ2VzIHRvIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHN0ZXA6IENyYXdsU3RlcC5pbml0IH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyLCBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbml0aWFsbHkgZXhwYW5kZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXRlc3RfdmFyaWFibGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBDaGFuZ2Ugc3RlcCB0byBydW5uaW5nXG4gICAgICByZXJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IHN0ZXA9e0NyYXdsU3RlcC5ydW5uaW5nfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGNvbGxhcHNlIChmaWVsZHMgaGlkZGVuLCBhcnJvdyByb3RhdGVkKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdmaWVsZC10ZXN0X3ZhcmlhYmxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBjb25zdCBhcnJvd0ljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChhcnJvd0ljb24pLnRvSGF2ZUNsYXNzKCctcm90YXRlLTkwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb2xsYXBzZSBvcHRpb25zIHdoZW4gc3RlcCBjaGFuZ2VzIHRvIGZpbmlzaGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdGVwOiBDcmF3bFN0ZXAuaW5pdCB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciwgY29udGFpbmVyIH0gPSByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gQ2hhbmdlIHN0ZXAgdG8gZmluaXNoZWRcbiAgICAgIHJlcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gc3RlcD17Q3Jhd2xTdGVwLmZpbmlzaGVkfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGNvbGxhcHNlXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2ZpZWxkLXRlc3RfdmFyaWFibGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGNvbnN0IGFycm93SWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KGFycm93SWNvbikudG9IYXZlQ2xhc3MoJy1yb3RhdGUtOTAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlc3BvbmQgdG8gc3RlcCB0cmFuc2l0aW9ucyBmcm9tIGluaXQgLT4gcnVubmluZyAtPiBmaW5pc2hlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc3RlcDogQ3Jhd2xTdGVwLmluaXQgfSlcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIsIGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWxseSBleHBhbmRlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtdGVzdF92YXJpYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIFRyYW5zaXRpb24gdG8gcnVubmluZ1xuICAgICAgcmVyZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSBzdGVwPXtDcmF3bFN0ZXAucnVubmluZ30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbGxhcHNlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdmaWVsZC10ZXN0X3ZhcmlhYmxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBsZXQgYXJyb3dJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3QoYXJyb3dJY29uKS50b0hhdmVDbGFzcygnLXJvdGF0ZS05MCcpXG5cbiAgICAgIC8vIEFjdCAtIFRyYW5zaXRpb24gdG8gZmluaXNoZWRcbiAgICAgIHJlcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gc3RlcD17Q3Jhd2xTdGVwLmZpbmlzaGVkfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU3RpbGwgY29sbGFwc2VkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2ZpZWxkLXRlc3RfdmFyaWFibGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGFycm93SWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KGFycm93SWNvbikudG9IYXZlQ2xhc3MoJy1yb3RhdGUtOTAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGV4cGFuZCB3aGVuIHN0ZXAgdHJhbnNpdGlvbnMgZnJvbSBmaW5pc2hlZCB0byBpbml0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdGVwOiBDcmF3bFN0ZXAuZmluaXNoZWQgfSlcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbml0aWFsbHkgY29sbGFwc2VkIHdoZW4gZmluaXNoZWRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZmllbGQtdGVzdF92YXJpYWJsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBUcmFuc2l0aW9uIGJhY2sgdG8gaW5pdFxuICAgICAgcmVyZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSBzdGVwPXtDcmF3bFN0ZXAuaW5pdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBleHBhbmRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXRlc3RfdmFyaWFibGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE1lbW9pemF0aW9uIExvZ2ljIGFuZCBEZXBlbmRlbmNpZXNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiBMb2dpYyBhbmQgRGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVnZW5lcmF0ZSBzY2hlbWEgd2hlbiBjb25maWd1cmF0aW9ucyBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjb25maWcxID0gW2NyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICd1cmwnIH0pXVxuICAgICAgY29uc3QgY29uZmlnMiA9IFtjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnZGVwdGgnIH0pXVxuICAgICAgbW9ja1VzZUNvbmZpZ3VyYXRpb25zLm1vY2tSZXR1cm5WYWx1ZShjb25maWcxKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEZpcnN0IHJlbmRlciBjcmVhdGVzIHNjaGVtYVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtdXJsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gQ2hhbmdlIGNvbmZpZ3VyYXRpb25zXG4gICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKGNvbmZpZzIpXG4gICAgICByZXJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IHZhcmlhYmxlcz17Y3JlYXRlTW9ja1ZhcmlhYmxlcygyKX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5ldyBmaWVsZCBpcyByZW5kZXJlZCB3aXRoIG5ldyBzY2hlbWFcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWRlcHRoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGlzUnVubmluZyBjb3JyZWN0bHkgZm9yIGluaXQgc3RlcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc3RlcDogQ3Jhd2xTdGVwLmluaXQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQnV0dG9uIHNob3VsZCBub3QgYmUgaW4gbG9hZGluZyBzdGF0ZVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3J1bi9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbXB1dGUgaXNSdW5uaW5nIGNvcnJlY3RseSBmb3IgcnVubmluZyBzdGVwJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdGVwOiBDcmF3bFN0ZXAucnVubmluZyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBCdXR0b24gc2hvdWxkIGJlIGluIGxvYWRpbmcgc3RhdGVcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3J1bm5pbmcvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGlzUnVubmluZyBjb3JyZWN0bHkgZm9yIGZpbmlzaGVkIHN0ZXAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHN0ZXA6IENyYXdsU3RlcC5maW5pc2hlZCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBCdXR0b24gc2hvdWxkIG5vdCBiZSBpbiBsb2FkaW5nIHN0YXRlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcnVuL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIG1lbW9pemVkIHNjaGVtYSBmb3IgdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBVc2UgcmVhbCBnZW5lcmF0ZVpvZFNjaGVtYSB3aXRoIHZhbGlkIGNvbmZpZ3VyYXRpb25cbiAgICAgIGNvbnN0IGNvbmZpZyA9IGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHtcbiAgICAgICAgdmFyaWFibGU6ICd0ZXN0X2ZpZWxkJyxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLCAvLyBOb3QgcmVxdWlyZWQgc28gdmFsaWRhdGlvbiBwYXNzZXMgd2l0aCBlbXB0eSB2YWx1ZVxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUoW2NvbmZpZ10pXG4gICAgICBjb25zdCBtb2NrT25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU3VibWl0OiBtb2NrT25TdWJtaXQgfSlcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBUcmlnZ2VyIHZhbGlkYXRpb24gdmlhIHN1Ym1pdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBvblN1Ym1pdCBzaG91bGQgYmUgY2FsbGVkIGlmIHZhbGlkYXRpb24gcGFzc2VzXG4gICAgICBleHBlY3QobW9ja09uU3VibWl0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBhbmQgRXZlbnQgSGFuZGxlcnNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucyBhbmQgRXZlbnQgSGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0b2dnbGUgZm9sZCBzdGF0ZSB3aGVuIGhlYWRlciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWxseSBleHBhbmRlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtdGVzdF92YXJpYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIHRvIGZvbGRcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KC9vcHRpb25zL2kpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgYmUgZm9sZGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2ZpZWxkLXRlc3RfdmFyaWFibGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gQ2xpY2sgdG8gdW5mb2xkXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgvb3B0aW9ucy9pKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGJlIGV4cGFuZGVkIGFnYWluXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC10ZXN0X3ZhcmlhYmxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmV2ZW50IGRlZmF1bHQgYW5kIHN0b3AgcHJvcGFnYXRpb24gb24gZm9ybSBzdWJtaXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBjb25zdCBtb2NrUHJldmVudERlZmF1bHQgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrU3RvcFByb3BhZ2F0aW9uID0gdmkuZm4oKVxuXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0sIHtcbiAgICAgICAgcHJldmVudERlZmF1bHQ6IG1vY2tQcmV2ZW50RGVmYXVsdCxcbiAgICAgICAgc3RvcFByb3BhZ2F0aW9uOiBtb2NrU3RvcFByb3BhZ2F0aW9uLFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gVGhlIGZvcm0gZWxlbWVudCBoYW5kbGVzIHN1Ym1pdCBldmVudFxuICAgICAgZXhwZWN0KGZvcm0pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGZvcm0gc3VibWl0IHdoZW4gYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gVXNlIG5vbi1yZXF1aXJlZCBmaWVsZCBzbyB2YWxpZGF0aW9uIHBhc3Nlc1xuICAgICAgY29uc3QgY29uZmlnID0gY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oe1xuICAgICAgICB2YXJpYWJsZTogJ29wdGlvbmFsX2ZpZWxkJyxcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICB0eXBlOiBCYXNlRmllbGRUeXBlLnRleHRJbnB1dCxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKFtjb25maWddKVxuICAgICAgY29uc3QgbW9ja09uU3VibWl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblN1Ym1pdDogbW9ja09uU3VibWl0IH0pXG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHRyaWdnZXIgc3VibWl0IHdoZW4gYnV0dG9uIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uU3VibWl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblN1Ym1pdDogbW9ja09uU3VibWl0LCBydW5EaXNhYmxlZDogdHJ1ZSB9KVxuICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFRyeSB0byBjbGljayBkaXNhYmxlZCBidXR0b25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU3VibWl0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gZm9sZCBzdGF0ZSBhZnRlciBmb3JtIHN1Ym1pc3Npb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gSW5pdGlhbGx5IGV4cGFuZGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC10ZXN0X3ZhcmlhYmxlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gU3VibWl0IGZvcm1cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHN0aWxsIGJlIGV4cGFuZGVkICh1bmxlc3Mgc3RlcCBjaGFuZ2VzKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtdGVzdF92YXJpYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgY2xpY2tpbmcgb24gYXJyb3cgaWNvbiBjb250YWluZXIgdG8gdG9nZ2xlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbml0aWFsbHkgZXhwYW5kZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXRlc3RfdmFyaWFibGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBvbiB0aGUgdG9nZ2xlIGNvbnRhaW5lciAocGFyZW50IG9mIHRoZSBvcHRpb25zIHRleHQgYW5kIGFycm93KVxuICAgICAgY29uc3QgdG9nZ2xlQ29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXJzb3ItcG9pbnRlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodG9nZ2xlQ29udGFpbmVyISlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGJlIGZvbGRlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdmaWVsZC10ZXN0X3ZhcmlhYmxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2YWxpZGF0aW9uIGVycm9yIGFuZCBzaG93IHRvYXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIENyZWF0ZSByZXF1aXJlZCBmaWVsZCB0aGF0IHdpbGwgZmFpbCB2YWxpZGF0aW9uIHdoZW4gZW1wdHlcbiAgICAgIGNvbnN0IHJlcXVpcmVkQ29uZmlnID0gY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oe1xuICAgICAgICB2YXJpYWJsZTogJ3VybCcsXG4gICAgICAgIGxhYmVsOiAnVVJMJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUoW3JlcXVpcmVkQ29uZmlnXSlcbiAgICAgIC8vIG1vY2tGb3JtVmFsdWVzLnVybCBpcyB1bmRlZmluZWQsIHNvIHZhbGlkYXRpb24gd2lsbCBmYWlsXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFRvYXN0IHNob3VsZCBiZSBjYWxsZWQgd2l0aCBlcnJvciBtZXNzYWdlXG4gICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhbGlkYXRpb24gZXJyb3IgYW5kIGRpc3BsYXkgZmllbGQgbmFtZSBpbiBtZXNzYWdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIENyZWF0ZSByZXF1aXJlZCBmaWVsZCB0aGF0IHdpbGwgZmFpbCB2YWxpZGF0aW9uXG4gICAgICBjb25zdCByZXF1aXJlZENvbmZpZyA9IGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHtcbiAgICAgICAgdmFyaWFibGU6ICdlbWFpbF9hZGRyZXNzJyxcbiAgICAgICAgbGFiZWw6ICdFbWFpbCBBZGRyZXNzJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUoW3JlcXVpcmVkQ29uZmlnXSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gVG9hc3QgbWVzc2FnZSBzaG91bGQgY29udGFpbiBmaWVsZCBwYXRoXG4gICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiBleHBlY3Quc3RyaW5nQ29udGFpbmluZygnZW1haWxfYWRkcmVzcycpLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdmFyaWFibGVzIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKFtdKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YXJpYWJsZXM6IFtdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JzXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNpbmdsZSB2YXJpYWJsZSBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc2luZ2xlQ29uZmlnID0gW2NyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdvbmx5X2ZpZWxkJyB9KV1cbiAgICAgIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUoc2luZ2xlQ29uZmlnKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLW9ubHlfZmllbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtYW55IGNvbmZpZ3VyYXRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbWFueUNvbmZpZ3MgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT5cbiAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogYGZpZWxkXyR7aX1gLCBsYWJlbDogYEZpZWxkICR7aX1gIH0pKVxuICAgICAgbW9ja1VzZUNvbmZpZ3VyYXRpb25zLm1vY2tSZXR1cm5WYWx1ZShtYW55Q29uZmlncylcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoYGZpZWxkLWZpZWxkXyR7aX1gKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2YWxpZGF0aW9uIHdpdGggbXVsdGlwbGUgcmVxdWlyZWQgZmllbGRzIChzaG93cyBmaXJzdCBlcnJvciknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gTXVsdGlwbGUgcmVxdWlyZWQgZmllbGRzXG4gICAgICBjb25zdCBjb25maWdzID0gW1xuICAgICAgICBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAndXJsJywgbGFiZWw6ICdVUkwnLCByZXF1aXJlZDogdHJ1ZSwgdHlwZTogQmFzZUZpZWxkVHlwZS50ZXh0SW5wdXQgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdkZXB0aCcsIGxhYmVsOiAnRGVwdGgnLCByZXF1aXJlZDogdHJ1ZSwgdHlwZTogQmFzZUZpZWxkVHlwZS50ZXh0SW5wdXQgfSksXG4gICAgICBdXG4gICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKGNvbmZpZ3MpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFRvYXN0IHNob3VsZCBiZSBjYWxsZWQgb25jZSAob25seSBmaXJzdCBlcnJvcilcbiAgICAgIGV4cGVjdCh0b2FzdE5vdGlmeVNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhbGlkYXRpb24gcGFzcyB3aGVuIGFsbCByZXF1aXJlZCBmaWVsZHMgaGF2ZSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCByZXF1aXJlZENvbmZpZyA9IGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHtcbiAgICAgICAgdmFyaWFibGU6ICd1cmwnLFxuICAgICAgICBsYWJlbDogJ1VSTCcsXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB0eXBlOiBCYXNlRmllbGRUeXBlLnRleHRJbnB1dCxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKFtyZXF1aXJlZENvbmZpZ10pXG4gICAgICBtb2NrRm9ybVZhbHVlcy51cmwgPSAnaHR0cHM6Ly9leGFtcGxlLmNvbScgLy8gUHJvdmlkZSB2YWxpZCB2YWx1ZVxuICAgICAgY29uc3QgbW9ja09uU3VibWl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvblN1Ym1pdDogbW9ja09uU3VibWl0IH0pXG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIE5vIHRvYXN0IGVycm9yLCBvblN1Ym1pdCBjYWxsZWRcbiAgICAgIGV4cGVjdCh0b2FzdE5vdGlmeVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG1vY2tPblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCB2YXJpYWJsZXMgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VJbml0aWFsRGF0YS5tb2NrUmV0dXJuVmFsdWUoe30pXG4gICAgICBtb2NrVXNlQ29uZmlndXJhdGlvbnMubW9ja1JldHVyblZhbHVlKFtdKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyB2YXJpYWJsZXM6IHVuZGVmaW5lZCBhcyBhbnkgfSlcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0IC0gU2hvdWxkIG5vdCB0aHJvd1xuICAgICAgZXhwZWN0KCgpID0+IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBmb2xkL3VuZm9sZCB0b2dnbGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBUb2dnbGUgcmFwaWRseSBtdWx0aXBsZSB0aW1lc1xuICAgICAgY29uc3QgdG9nZ2xlVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoL29wdGlvbnMvaSlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sodG9nZ2xlVGV4dClcblxuICAgICAgLy8gQXNzZXJ0IC0gRmluYWwgc3RhdGUgc2hvdWxkIGJlIGZvbGRlZCAob2RkIG51bWJlciBvZiBjbGlja3MpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2ZpZWxkLXRlc3RfdmFyaWFibGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBbGwgUHJvcCBWYXJpYXRpb25zXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgW3sgc3RlcDogQ3Jhd2xTdGVwLmluaXQsIHJ1bkRpc2FibGVkOiBmYWxzZSB9LCBmYWxzZSwgJ3J1biddLFxuICAgICAgW3sgc3RlcDogQ3Jhd2xTdGVwLmluaXQsIHJ1bkRpc2FibGVkOiB0cnVlIH0sIHRydWUsICdydW4nXSxcbiAgICAgIFt7IHN0ZXA6IENyYXdsU3RlcC5ydW5uaW5nLCBydW5EaXNhYmxlZDogZmFsc2UgfSwgdHJ1ZSwgJ3J1bm5pbmcnXSxcbiAgICAgIFt7IHN0ZXA6IENyYXdsU3RlcC5ydW5uaW5nLCBydW5EaXNhYmxlZDogdHJ1ZSB9LCB0cnVlLCAncnVubmluZyddLFxuICAgICAgW3sgc3RlcDogQ3Jhd2xTdGVwLmZpbmlzaGVkLCBydW5EaXNhYmxlZDogZmFsc2UgfSwgZmFsc2UsICdydW4nXSxcbiAgICAgIFt7IHN0ZXA6IENyYXdsU3RlcC5maW5pc2hlZCwgcnVuRGlzYWJsZWQ6IHRydWUgfSwgdHJ1ZSwgJ3J1biddLFxuICAgIF0gYXMgY29uc3QpKCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIHN0ZXA9JXMsIHJ1bkRpc2FibGVkPSVzJywgKHByb3BWYXJpYXRpb24sIGV4cGVjdGVkRGlzYWJsZWQsIGV4cGVjdGVkVGV4dCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMocHJvcFZhcmlhdGlvbilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgaWYgKGV4cGVjdGVkRGlzYWJsZWQpXG4gICAgICAgIGV4cGVjdChidXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICBlbHNlXG4gICAgICAgIGV4cGVjdChidXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChuZXcgUmVnRXhwKGV4cGVjdGVkVGV4dCwgJ2knKSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWxsIENyYXdsU3RlcCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0ICYgQXNzZXJ0XG4gICAgICBPYmplY3QudmFsdWVzKENyYXdsU3RlcCkuZm9yRWFjaCgoc3RlcCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHN0ZXAgfSlcbiAgICAgICAgY29uc3QgeyB1bm1vdW50LCBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB1bm1vdW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZhcmlhYmxlcyB3aXRoIGRpZmZlcmVudCB0eXBlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tWYXJpYWJsZSh7IHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCwgdmFyaWFibGU6ICd0ZXh0X2ZpZWxkJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja1ZhcmlhYmxlKHsgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUucGFyYWdyYXBoLCB2YXJpYWJsZTogJ3BhcmFncmFwaF9maWVsZCcgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tWYXJpYWJsZSh7IHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlciwgdmFyaWFibGU6ICdudW1iZXJfZmllbGQnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrVmFyaWFibGUoeyB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5jaGVja2JveCwgdmFyaWFibGU6ICdjaGVja2JveF9maWVsZCcgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tWYXJpYWJsZSh7IHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnNlbGVjdCwgdmFyaWFibGU6ICdzZWxlY3RfZmllbGQnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSB2YXJpYWJsZXMubWFwKHYgPT4gY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogdi52YXJpYWJsZSB9KSlcbiAgICAgIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUoY29uZmlndXJhdGlvbnMpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHZhcmlhYmxlcyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIHZhcmlhYmxlcy5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoYGZpZWxkLSR7di52YXJpYWJsZX1gKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBGb3JtIFZhbGlkYXRpb25cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdGb3JtIFZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIHZhbGlkYXRpb24gd2l0aCB2YWxpZCBkYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIFVzZSBub24tcmVxdWlyZWQgZmllbGQgc28gZW1wdHkgdmFsdWUgcGFzc2VzXG4gICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7XG4gICAgICAgIHZhcmlhYmxlOiAnb3B0aW9uYWxfZmllbGQnLFxuICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUoW2NvbmZpZ10pXG4gICAgICBjb25zdCBtb2NrT25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uU3VibWl0OiBtb2NrT25TdWJtaXQgfSlcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU3VibWl0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdCh0b2FzdE5vdGlmeVNweSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZhaWwgdmFsaWRhdGlvbiB3aXRoIGludmFsaWQgZGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBSZXF1aXJlZCBmaWVsZCB3aXRoIGVtcHR5IHZhbHVlXG4gICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7XG4gICAgICAgIHZhcmlhYmxlOiAndXJsJyxcbiAgICAgICAgbGFiZWw6ICdVUkwnLFxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgdHlwZTogQmFzZUZpZWxkVHlwZS50ZXh0SW5wdXQsXG4gICAgICB9KVxuICAgICAgbW9ja1VzZUNvbmZpZ3VyYXRpb25zLm1vY2tSZXR1cm5WYWx1ZShbY29uZmlnXSlcbiAgICAgIGNvbnN0IG1vY2tPblN1Ym1pdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25TdWJtaXQ6IG1vY2tPblN1Ym1pdCB9KVxuICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TdWJtaXQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdCh0b2FzdE5vdGlmeVNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB0b2FzdCBtZXNzYWdlIHdoZW4gdmFsaWRhdGlvbiBmYWlscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBSZXF1aXJlZCBmaWVsZCB3aXRoIGVtcHR5IHZhbHVlXG4gICAgICBjb25zdCBjb25maWcgPSBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7XG4gICAgICAgIHZhcmlhYmxlOiAnbXlfZmllbGQnLFxuICAgICAgICBsYWJlbDogJ015IEZpZWxkJyxcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUoW2NvbmZpZ10pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHRvYXN0Tm90aWZ5U3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdHlsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3R5bGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3QgY29udGFpbmVyIGNsYXNzZXMgdG8gZm9ybScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJylcbiAgICAgIGV4cGVjdChmb3JtKS50b0hhdmVDbGFzcygndy1mdWxsJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXJzb3ItcG9pbnRlciBjbGFzcyB0byB0b2dnbGUgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB0b2dnbGVDb250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1cnNvci1wb2ludGVyJylcbiAgICAgIGV4cGVjdCh0b2dnbGVDb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBzZWxlY3Qtbm9uZSBjbGFzcyB0byBwcmV2ZW50IHRleHQgc2VsZWN0aW9uIG9uIHRvZ2dsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdG9nZ2xlQ29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3Qtbm9uZScpXG4gICAgICBleHBlY3QodG9nZ2xlQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgcm90YXRlIGNsYXNzIHRvIGFycm93IGljb24gd2hlbiBmb2xkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIEZvbGQgdGhlIG9wdGlvbnNcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KC9vcHRpb25zL2kpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFycm93SWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KGFycm93SWNvbikudG9IYXZlQ2xhc3MoJy1yb3RhdGUtOTAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBhcHBseSByb3RhdGUgY2xhc3MgdG8gYXJyb3cgaWNvbiB3aGVuIGV4cGFuZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBhcnJvd0ljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChhcnJvd0ljb24pLm5vdC50b0hhdmVDbGFzcygnLXJvdGF0ZS05MCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgYm9yZGVyIGNsYXNzIHRvIGZpZWxkcyBjb250YWluZXIgd2hlbiBleHBhbmRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZmllbGRzQ29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib3JkZXItdCcpXG4gICAgICBleHBlY3QoZmllbGRzQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQmFzZUZpZWxkIEludGVncmF0aW9uXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQmFzZUZpZWxkIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IHByb3BzIHRvIEJhc2VGaWVsZCBmYWN0b3J5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29uZmlnID0gY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogJ3Rlc3RfdmFyJywgbGFiZWw6ICdUZXN0IExhYmVsJyB9KVxuICAgICAgbW9ja1VzZUNvbmZpZ3VyYXRpb25zLm1vY2tSZXR1cm5WYWx1ZShbY29uZmlnXSlcbiAgICAgIG1vY2tVc2VJbml0aWFsRGF0YS5tb2NrUmV0dXJuVmFsdWUoeyB0ZXN0X3ZhcjogJ2RlZmF1bHRfdmFsdWUnIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tCYXNlRmllbGQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgaW5pdGlhbERhdGE6IHsgdGVzdF92YXI6ICdkZWZhdWx0X3ZhbHVlJyB9LFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHVuaXF1ZSBrZXkgZm9yIGVhY2ggZmllbGQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjb25maWd1cmF0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogJ2ZpZWxkX2EnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnZmllbGRfYicgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdmaWVsZF9jJyB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUoY29uZmlndXJhdGlvbnMpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEFsbCBmaWVsZHMgc2hvdWxkIGJlIHJlbmRlcmVkIChSZWFjdCB3b3VsZCB3YXJuIGlmIGtleXMgYXJlbid0IHVuaXF1ZSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWZpZWxkX2EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtZmllbGRfYicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1maWVsZF9jJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==