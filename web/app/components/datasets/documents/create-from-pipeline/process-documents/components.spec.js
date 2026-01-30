"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const zod_1 = require("zod");
const types_1 = require("@/app/components/base/form/form-scenarios/base/types");
const toast_1 = require("@/app/components/base/toast");
const actions_1 = require("./actions");
const form_1 = require("./form");
const header_1 = require("./header");
// ==========================================
// Spy on Toast.notify for validation tests
// ==========================================
const toastNotifySpy = vi.spyOn(toast_1.default, 'notify');
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
    placeholder: 'Enter value',
    tooltip: '',
    ...overrides,
});
/**
 * Creates a valid Zod schema for testing
 */
const createMockSchema = () => {
    return zod_1.z.object({
        field1: zod_1.z.string().optional(),
    });
};
/**
 * Creates a schema that always fails validation
 */
const createFailingSchema = () => {
    return {
        safeParse: () => ({
            success: false,
            error: {
                issues: [{ path: ['field1'], message: 'is required' }],
            },
        }),
    };
};
// ==========================================
// Actions Component Tests
// ==========================================
describe('Actions', () => {
    const defaultActionsProps = {
        onBack: vi.fn(),
        onProcess: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<actions_1.default {...defaultActionsProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.operations.dataSource')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.operations.saveAndProcess')).toBeInTheDocument();
        });
        it('should render back button with arrow icon', () => {
            // Arrange & Act
            (0, react_1.render)(<actions_1.default {...defaultActionsProps}/>);
            // Assert
            const backButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.dataSource/i });
            expect(backButton).toBeInTheDocument();
            expect(backButton.querySelector('svg')).toBeInTheDocument();
        });
        it('should render process button', () => {
            // Arrange & Act
            (0, react_1.render)(<actions_1.default {...defaultActionsProps}/>);
            // Assert
            const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
            expect(processButton).toBeInTheDocument();
        });
        it('should have correct container layout', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<actions_1.default {...defaultActionsProps}/>);
            // Assert
            const mainContainer = container.querySelector('.flex.items-center.justify-between');
            expect(mainContainer).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('runDisabled prop', () => {
            it('should not disable process button when runDisabled is false', () => {
                // Arrange & Act
                (0, react_1.render)(<actions_1.default {...defaultActionsProps} runDisabled={false}/>);
                // Assert
                const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
                expect(processButton).not.toBeDisabled();
            });
            it('should disable process button when runDisabled is true', () => {
                // Arrange & Act
                (0, react_1.render)(<actions_1.default {...defaultActionsProps} runDisabled={true}/>);
                // Assert
                const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
                expect(processButton).toBeDisabled();
            });
            it('should not disable process button when runDisabled is undefined', () => {
                // Arrange & Act
                (0, react_1.render)(<actions_1.default {...defaultActionsProps} runDisabled={undefined}/>);
                // Assert
                const processButton = react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i });
                expect(processButton).not.toBeDisabled();
            });
        });
    });
    // ==========================================
    // User Interactions Testing
    // ==========================================
    describe('User Interactions', () => {
        it('should call onBack when back button is clicked', () => {
            // Arrange
            const onBack = vi.fn();
            (0, react_1.render)(<actions_1.default {...defaultActionsProps} onBack={onBack}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.operations.dataSource/i }));
            // Assert
            expect(onBack).toHaveBeenCalledTimes(1);
        });
        it('should call onProcess when process button is clicked', () => {
            // Arrange
            const onProcess = vi.fn();
            (0, react_1.render)(<actions_1.default {...defaultActionsProps} onProcess={onProcess}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i }));
            // Assert
            expect(onProcess).toHaveBeenCalledTimes(1);
        });
        it('should not call onProcess when process button is disabled and clicked', () => {
            // Arrange
            const onProcess = vi.fn();
            (0, react_1.render)(<actions_1.default {...defaultActionsProps} onProcess={onProcess} runDisabled={true}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.operations.saveAndProcess/i }));
            // Assert
            expect(onProcess).not.toHaveBeenCalled();
        });
    });
    // ==========================================
    // Component Memoization Testing
    // ==========================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert
            expect(actions_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
    });
});
// ==========================================
// Header Component Tests
// ==========================================
describe('Header', () => {
    const defaultHeaderProps = {
        onReset: vi.fn(),
        resetDisabled: false,
        previewDisabled: false,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<header_1.default {...defaultHeaderProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
        it('should render reset button', () => {
            // Arrange & Act
            (0, react_1.render)(<header_1.default {...defaultHeaderProps}/>);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /common.operation.reset/i })).toBeInTheDocument();
        });
        it('should render preview button with icon', () => {
            // Arrange & Act
            (0, react_1.render)(<header_1.default {...defaultHeaderProps}/>);
            // Assert
            const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
            expect(previewButton).toBeInTheDocument();
            expect(previewButton.querySelector('svg')).toBeInTheDocument();
        });
        it('should render title with correct text', () => {
            // Arrange & Act
            (0, react_1.render)(<header_1.default {...defaultHeaderProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
        it('should have correct container layout', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<header_1.default {...defaultHeaderProps}/>);
            // Assert
            const mainContainer = container.querySelector('.flex.items-center.gap-x-1');
            expect(mainContainer).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('resetDisabled prop', () => {
            it('should not disable reset button when resetDisabled is false', () => {
                // Arrange & Act
                (0, react_1.render)(<header_1.default {...defaultHeaderProps} resetDisabled={false}/>);
                // Assert
                const resetButton = react_1.screen.getByRole('button', { name: /common.operation.reset/i });
                expect(resetButton).not.toBeDisabled();
            });
            it('should disable reset button when resetDisabled is true', () => {
                // Arrange & Act
                (0, react_1.render)(<header_1.default {...defaultHeaderProps} resetDisabled={true}/>);
                // Assert
                const resetButton = react_1.screen.getByRole('button', { name: /common.operation.reset/i });
                expect(resetButton).toBeDisabled();
            });
        });
        describe('previewDisabled prop', () => {
            it('should not disable preview button when previewDisabled is false', () => {
                // Arrange & Act
                (0, react_1.render)(<header_1.default {...defaultHeaderProps} previewDisabled={false}/>);
                // Assert
                const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
                expect(previewButton).not.toBeDisabled();
            });
            it('should disable preview button when previewDisabled is true', () => {
                // Arrange & Act
                (0, react_1.render)(<header_1.default {...defaultHeaderProps} previewDisabled={true}/>);
                // Assert
                const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
                expect(previewButton).toBeDisabled();
            });
        });
        it('should handle onPreview being undefined', () => {
            // Arrange & Act
            (0, react_1.render)(<header_1.default {...defaultHeaderProps} onPreview={undefined}/>);
            // Assert
            const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
            expect(previewButton).toBeInTheDocument();
            // Click should not throw
            let didThrow = false;
            try {
                react_1.fireEvent.click(previewButton);
            }
            catch {
                didThrow = true;
            }
            expect(didThrow).toBe(false);
        });
    });
    // ==========================================
    // User Interactions Testing
    // ==========================================
    describe('User Interactions', () => {
        it('should call onReset when reset button is clicked', () => {
            // Arrange
            const onReset = vi.fn();
            (0, react_1.render)(<header_1.default {...defaultHeaderProps} onReset={onReset}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /common.operation.reset/i }));
            // Assert
            expect(onReset).toHaveBeenCalledTimes(1);
        });
        it('should not call onReset when reset button is disabled and clicked', () => {
            // Arrange
            const onReset = vi.fn();
            (0, react_1.render)(<header_1.default {...defaultHeaderProps} onReset={onReset} resetDisabled={true}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /common.operation.reset/i }));
            // Assert
            expect(onReset).not.toHaveBeenCalled();
        });
        it('should call onPreview when preview button is clicked', () => {
            // Arrange
            const onPreview = vi.fn();
            (0, react_1.render)(<header_1.default {...defaultHeaderProps} onPreview={onPreview}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i }));
            // Assert
            expect(onPreview).toHaveBeenCalledTimes(1);
        });
        it('should not call onPreview when preview button is disabled and clicked', () => {
            // Arrange
            const onPreview = vi.fn();
            (0, react_1.render)(<header_1.default {...defaultHeaderProps} onPreview={onPreview} previewDisabled={true}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i }));
            // Assert
            expect(onPreview).not.toHaveBeenCalled();
        });
    });
    // ==========================================
    // Component Memoization Testing
    // ==========================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert
            expect(header_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
    });
    // ==========================================
    // Edge Cases Testing
    // ==========================================
    describe('Edge Cases', () => {
        it('should handle both buttons disabled', () => {
            // Arrange & Act
            (0, react_1.render)(<header_1.default {...defaultHeaderProps} resetDisabled={true} previewDisabled={true}/>);
            // Assert
            const resetButton = react_1.screen.getByRole('button', { name: /common.operation.reset/i });
            const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
            expect(resetButton).toBeDisabled();
            expect(previewButton).toBeDisabled();
        });
        it('should handle both buttons enabled', () => {
            // Arrange & Act
            (0, react_1.render)(<header_1.default {...defaultHeaderProps} resetDisabled={false} previewDisabled={false}/>);
            // Assert
            const resetButton = react_1.screen.getByRole('button', { name: /common.operation.reset/i });
            const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
            expect(resetButton).not.toBeDisabled();
            expect(previewButton).not.toBeDisabled();
        });
    });
});
// ==========================================
// Form Component Tests
// ==========================================
describe('Form', () => {
    const defaultFormProps = {
        initialData: { field1: '' },
        configurations: [],
        schema: createMockSchema(),
        onSubmit: vi.fn(),
        onPreview: vi.fn(),
        ref: { current: null },
        isRunning: false,
    };
    beforeEach(() => {
        vi.clearAllMocks();
        toastNotifySpy.mockClear();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<form_1.default {...defaultFormProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
        it('should render form element', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<form_1.default {...defaultFormProps}/>);
            // Assert
            const form = container.querySelector('form');
            expect(form).toBeInTheDocument();
        });
        it('should render Header component', () => {
            // Arrange & Act
            (0, react_1.render)(<form_1.default {...defaultFormProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /common.operation.reset/i })).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i })).toBeInTheDocument();
        });
        it('should have correct form structure', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<form_1.default {...defaultFormProps}/>);
            // Assert
            const form = container.querySelector('form.flex.w-full.flex-col');
            expect(form).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('isRunning prop', () => {
            it('should disable preview button when isRunning is true', () => {
                // Arrange & Act
                (0, react_1.render)(<form_1.default {...defaultFormProps} isRunning={true}/>);
                // Assert
                const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
                expect(previewButton).toBeDisabled();
            });
            it('should not disable preview button when isRunning is false', () => {
                // Arrange & Act
                (0, react_1.render)(<form_1.default {...defaultFormProps} isRunning={false}/>);
                // Assert
                const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
                expect(previewButton).not.toBeDisabled();
            });
        });
        describe('configurations prop', () => {
            it('should render empty when configurations is empty', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<form_1.default {...defaultFormProps} configurations={[]}/>);
                // Assert - the fields container should have no field children
                const fieldsContainer = container.querySelector('.flex.flex-col.gap-3');
                expect(fieldsContainer?.children.length).toBe(0);
            });
            it('should render all configurations', () => {
                // Arrange
                const configurations = [
                    createMockConfiguration({ variable: 'var1', label: 'Variable 1' }),
                    createMockConfiguration({ variable: 'var2', label: 'Variable 2' }),
                    createMockConfiguration({ variable: 'var3', label: 'Variable 3' }),
                ];
                // Act
                (0, react_1.render)(<form_1.default {...defaultFormProps} configurations={configurations} initialData={{ var1: '', var2: '', var3: '' }}/>);
                // Assert
                expect(react_1.screen.getByText('Variable 1')).toBeInTheDocument();
                expect(react_1.screen.getByText('Variable 2')).toBeInTheDocument();
                expect(react_1.screen.getByText('Variable 3')).toBeInTheDocument();
            });
        });
        it('should expose submit method via ref', () => {
            // Arrange
            const mockRef = { current: null };
            // Act
            (0, react_1.render)(<form_1.default {...defaultFormProps} ref={mockRef}/>);
            // Assert
            expect(mockRef.current).not.toBeNull();
            expect(typeof mockRef.current?.submit).toBe('function');
        });
    });
    // ==========================================
    // Ref Submit Testing
    // ==========================================
    describe('Ref Submit', () => {
        it('should call onSubmit when ref.submit() is called', async () => {
            // Arrange
            const onSubmit = vi.fn();
            const mockRef = { current: null };
            (0, react_1.render)(<form_1.default {...defaultFormProps} ref={mockRef} onSubmit={onSubmit}/>);
            // Act - call submit via ref
            mockRef.current?.submit();
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onSubmit).toHaveBeenCalled();
            });
        });
        it('should trigger form validation when ref.submit() is called', async () => {
            // Arrange
            const failingSchema = createFailingSchema();
            const mockRef = { current: null };
            (0, react_1.render)(<form_1.default {...defaultFormProps} ref={mockRef} schema={failingSchema}/>);
            // Act - call submit via ref
            mockRef.current?.submit();
            // Assert - validation error should be shown
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    type: 'error',
                    message: '"field1" is required',
                });
            });
        });
    });
    // ==========================================
    // User Interactions Testing
    // ==========================================
    describe('User Interactions', () => {
        it('should call onPreview when preview button is clicked', () => {
            // Arrange
            const onPreview = vi.fn();
            (0, react_1.render)(<form_1.default {...defaultFormProps} onPreview={onPreview}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i }));
            // Assert
            expect(onPreview).toHaveBeenCalledTimes(1);
        });
        it('should handle form submission via form element', async () => {
            // Arrange
            const onSubmit = vi.fn();
            const { container } = (0, react_1.render)(<form_1.default {...defaultFormProps} onSubmit={onSubmit}/>);
            const form = container.querySelector('form');
            // Act
            react_1.fireEvent.submit(form);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(onSubmit).toHaveBeenCalled();
            });
        });
    });
    // ==========================================
    // Form State Testing
    // ==========================================
    describe('Form State', () => {
        it('should disable reset button initially when form is not dirty', () => {
            // Arrange & Act
            (0, react_1.render)(<form_1.default {...defaultFormProps}/>);
            // Assert
            const resetButton = react_1.screen.getByRole('button', { name: /common.operation.reset/i });
            expect(resetButton).toBeDisabled();
        });
        it('should enable reset button when form becomes dirty', async () => {
            // Arrange
            const configurations = [
                createMockConfiguration({ variable: 'field1', label: 'Field 1' }),
            ];
            (0, react_1.render)(<form_1.default {...defaultFormProps} configurations={configurations}/>);
            // Act - change input to make form dirty
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: 'new value' } });
            // Assert
            await (0, react_1.waitFor)(() => {
                const resetButton = react_1.screen.getByRole('button', { name: /common.operation.reset/i });
                expect(resetButton).not.toBeDisabled();
            });
        });
        it('should reset form to initial values when reset button is clicked', async () => {
            // Arrange
            const configurations = [
                createMockConfiguration({ variable: 'field1', label: 'Field 1' }),
            ];
            const initialData = { field1: 'initial value' };
            (0, react_1.render)(<form_1.default {...defaultFormProps} configurations={configurations} initialData={initialData}/>);
            // Act - change input to make form dirty
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: 'new value' } });
            // Wait for reset button to be enabled
            await (0, react_1.waitFor)(() => {
                const resetButton = react_1.screen.getByRole('button', { name: /common.operation.reset/i });
                expect(resetButton).not.toBeDisabled();
            });
            // Click reset button
            const resetButton = react_1.screen.getByRole('button', { name: /common.operation.reset/i });
            react_1.fireEvent.click(resetButton);
            // Assert - form should be reset, button should be disabled again
            await (0, react_1.waitFor)(() => {
                expect(resetButton).toBeDisabled();
            });
        });
        it('should call form.reset when handleReset is triggered', async () => {
            // Arrange
            const configurations = [
                createMockConfiguration({ variable: 'field1', label: 'Field 1' }),
            ];
            const initialData = { field1: 'original' };
            (0, react_1.render)(<form_1.default {...defaultFormProps} configurations={configurations} initialData={initialData}/>);
            // Make form dirty
            const input = react_1.screen.getByRole('textbox');
            react_1.fireEvent.change(input, { target: { value: 'modified' } });
            // Wait for dirty state
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByRole('button', { name: /common.operation.reset/i })).not.toBeDisabled();
            });
            // Act - click reset
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /common.operation.reset/i }));
            // Assert - input should be reset to initial value
            await (0, react_1.waitFor)(() => {
                expect(input).toHaveValue('original');
            });
        });
    });
    // ==========================================
    // Validation Testing
    // ==========================================
    describe('Validation', () => {
        it('should show toast notification on validation error', async () => {
            // Arrange
            const failingSchema = createFailingSchema();
            const { container } = (0, react_1.render)(<form_1.default {...defaultFormProps} schema={failingSchema}/>);
            // Act
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    type: 'error',
                    message: '"field1" is required',
                });
            });
        });
        it('should not call onSubmit when validation fails', async () => {
            // Arrange
            const onSubmit = vi.fn();
            const failingSchema = createFailingSchema();
            const { container } = (0, react_1.render)(<form_1.default {...defaultFormProps} schema={failingSchema} onSubmit={onSubmit}/>);
            // Act
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert - wait a bit and verify onSubmit was not called
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalled();
            });
            expect(onSubmit).not.toHaveBeenCalled();
        });
        it('should call onSubmit when validation passes', async () => {
            // Arrange
            const onSubmit = vi.fn();
            const passingSchema = createMockSchema();
            const { container } = (0, react_1.render)(<form_1.default {...defaultFormProps} schema={passingSchema} onSubmit={onSubmit}/>);
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
    // Edge Cases Testing
    // ==========================================
    describe('Edge Cases', () => {
        it('should handle empty initialData', () => {
            // Arrange & Act
            (0, react_1.render)(<form_1.default {...defaultFormProps} initialData={{}}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
        it('should handle configurations with different field types', () => {
            // Arrange
            const configurations = [
                createMockConfiguration({ type: types_1.BaseFieldType.textInput, variable: 'text', label: 'Text Field' }),
                createMockConfiguration({ type: types_1.BaseFieldType.numberInput, variable: 'number', label: 'Number Field' }),
            ];
            // Act
            (0, react_1.render)(<form_1.default {...defaultFormProps} configurations={configurations} initialData={{ text: '', number: 0 }}/>);
            // Assert
            expect(react_1.screen.getByText('Text Field')).toBeInTheDocument();
            expect(react_1.screen.getByText('Number Field')).toBeInTheDocument();
        });
        it('should handle null ref', () => {
            // Arrange & Act
            (0, react_1.render)(<form_1.default {...defaultFormProps} ref={{ current: null }}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Configuration Variations Testing
    // ==========================================
    describe('Configuration Variations', () => {
        it('should render configuration with label', () => {
            // Arrange
            const configurations = [
                createMockConfiguration({ variable: 'field1', label: 'Custom Label' }),
            ];
            // Act
            (0, react_1.render)(<form_1.default {...defaultFormProps} configurations={configurations}/>);
            // Assert
            expect(react_1.screen.getByText('Custom Label')).toBeInTheDocument();
        });
        it('should render required configuration', () => {
            // Arrange
            const configurations = [
                createMockConfiguration({ variable: 'field1', label: 'Required Field', required: true }),
            ];
            // Act
            (0, react_1.render)(<form_1.default {...defaultFormProps} configurations={configurations}/>);
            // Assert
            expect(react_1.screen.getByText('Required Field')).toBeInTheDocument();
        });
    });
});
// ==========================================
// Integration Tests (Cross-component)
// ==========================================
describe('Process Documents Components Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Form with Header Integration', () => {
        const defaultFormProps = {
            initialData: { field1: '' },
            configurations: [],
            schema: createMockSchema(),
            onSubmit: vi.fn(),
            onPreview: vi.fn(),
            ref: { current: null },
            isRunning: false,
        };
        it('should render Header within Form', () => {
            // Arrange & Act
            (0, react_1.render)(<form_1.default {...defaultFormProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepTwo.chunkSettings')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /common.operation.reset/i })).toBeInTheDocument();
        });
        it('should pass isRunning to Header for previewDisabled', () => {
            // Arrange & Act
            (0, react_1.render)(<form_1.default {...defaultFormProps} isRunning={true}/>);
            // Assert
            const previewButton = react_1.screen.getByRole('button', { name: /datasetPipeline.addDocuments.stepTwo.previewChunks/i });
            expect(previewButton).toBeDisabled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50cy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcG9uZW50cy5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUEyRTtBQUMzRSwrQkFBOEI7QUFDOUIsNkJBQXVCO0FBQ3ZCLGdGQUFvRjtBQUNwRix1REFBK0M7QUFDL0MsdUNBQStCO0FBQy9CLGlDQUF5QjtBQUN6QixxQ0FBNkI7QUFFN0IsNkNBQTZDO0FBQzdDLDJDQUEyQztBQUMzQyw2Q0FBNkM7QUFDN0MsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFLLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFFaEQsNkNBQTZDO0FBQzdDLDhCQUE4QjtBQUM5Qiw2Q0FBNkM7QUFFN0M7O0dBRUc7QUFDSCxNQUFNLHVCQUF1QixHQUFHLENBQUMsWUFBd0MsRUFBRSxFQUFxQixFQUFFLENBQUMsQ0FBQztJQUNsRyxJQUFJLEVBQUUscUJBQWEsQ0FBQyxTQUFTO0lBQzdCLFFBQVEsRUFBRSxjQUFjO0lBQ3hCLEtBQUssRUFBRSxZQUFZO0lBQ25CLFFBQVEsRUFBRSxLQUFLO0lBQ2YsU0FBUyxFQUFFLFNBQVM7SUFDcEIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsY0FBYyxFQUFFLEVBQUU7SUFDbEIsV0FBVyxFQUFFLGFBQWE7SUFDMUIsT0FBTyxFQUFFLEVBQUU7SUFDWCxHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRjs7R0FFRztBQUNILE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO0lBQzVCLE9BQU8sT0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNkLE1BQU0sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO0tBQzlCLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQUVEOztHQUVHO0FBQ0gsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLEVBQUU7SUFDL0IsT0FBTztRQUNMLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FB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LENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBCYXNlQ29uZmlndXJhdGlvbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL2Zvcm0tc2NlbmFyaW9zL2Jhc2UvdHlwZXMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCdcbmltcG9ydCB7IEJhc2VGaWVsZFR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9iYXNlL3R5cGVzJ1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucydcbmltcG9ydCBGb3JtIGZyb20gJy4vZm9ybSdcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9oZWFkZXInXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU3B5IG9uIFRvYXN0Lm5vdGlmeSBmb3IgdmFsaWRhdGlvbiB0ZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCB0b2FzdE5vdGlmeVNweSA9IHZpLnNweU9uKFRvYXN0LCAnbm90aWZ5JylcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yeSBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIENyZWF0ZXMgbW9jayBjb25maWd1cmF0aW9uIGZvciB0ZXN0aW5nXG4gKi9cbmNvbnN0IGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uID0gKG92ZXJyaWRlczogUGFydGlhbDxCYXNlQ29uZmlndXJhdGlvbj4gPSB7fSk6IEJhc2VDb25maWd1cmF0aW9uID0+ICh7XG4gIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICB2YXJpYWJsZTogJ3Rlc3RWYXJpYWJsZScsXG4gIGxhYmVsOiAnVGVzdCBMYWJlbCcsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgbWF4TGVuZ3RoOiB1bmRlZmluZWQsXG4gIG9wdGlvbnM6IHVuZGVmaW5lZCxcbiAgc2hvd0NvbmRpdGlvbnM6IFtdLFxuICBwbGFjZWhvbGRlcjogJ0VudGVyIHZhbHVlJyxcbiAgdG9vbHRpcDogJycsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogQ3JlYXRlcyBhIHZhbGlkIFpvZCBzY2hlbWEgZm9yIHRlc3RpbmdcbiAqL1xuY29uc3QgY3JlYXRlTW9ja1NjaGVtYSA9ICgpID0+IHtcbiAgcmV0dXJuIHoub2JqZWN0KHtcbiAgICBmaWVsZDE6IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgfSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgc2NoZW1hIHRoYXQgYWx3YXlzIGZhaWxzIHZhbGlkYXRpb25cbiAqL1xuY29uc3QgY3JlYXRlRmFpbGluZ1NjaGVtYSA9ICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBzYWZlUGFyc2U6ICgpID0+ICh7XG4gICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgIGVycm9yOiB7XG4gICAgICAgIGlzc3VlczogW3sgcGF0aDogWydmaWVsZDEnXSwgbWVzc2FnZTogJ2lzIHJlcXVpcmVkJyB9XSxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0gYXMgdW5rbm93biBhcyB6LlpvZFNjaGVtYVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEFjdGlvbnMgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdBY3Rpb25zJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0QWN0aW9uc1Byb3BzID0ge1xuICAgIG9uQmFjazogdmkuZm4oKSxcbiAgICBvblByb2Nlc3M6IHZpLmZuKCksXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRBY3Rpb25zUHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5kYXRhU291cmNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5zYXZlQW5kUHJvY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJhY2sgYnV0dG9uIHdpdGggYXJyb3cgaWNvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9ucyB7Li4uZGVmYXVsdEFjdGlvbnNQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYmFja0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLmRhdGFTb3VyY2UvaSB9KVxuICAgICAgZXhwZWN0KGJhY2tCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChiYWNrQnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHByb2Nlc3MgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0QWN0aW9uc1Byb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MvaSB9KVxuICAgICAgZXhwZWN0KHByb2Nlc3NCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgY29udGFpbmVyIGxheW91dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRBY3Rpb25zUHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IG1haW5Db250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmZsZXguaXRlbXMtY2VudGVyLmp1c3RpZnktYmV0d2VlbicpXG4gICAgICBleHBlY3QobWFpbkNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgncnVuRGlzYWJsZWQgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbm90IGRpc2FibGUgcHJvY2VzcyBidXR0b24gd2hlbiBydW5EaXNhYmxlZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRBY3Rpb25zUHJvcHN9IHJ1bkRpc2FibGVkPXtmYWxzZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5zYXZlQW5kUHJvY2Vzcy9pIH0pXG4gICAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGlzYWJsZSBwcm9jZXNzIGJ1dHRvbiB3aGVuIHJ1bkRpc2FibGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0QWN0aW9uc1Byb3BzfSBydW5EaXNhYmxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5zYXZlQW5kUHJvY2Vzcy9pIH0pXG4gICAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgZGlzYWJsZSBwcm9jZXNzIGJ1dHRvbiB3aGVuIHJ1bkRpc2FibGVkIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRBY3Rpb25zUHJvcHN9IHJ1bkRpc2FibGVkPXt1bmRlZmluZWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MvaSB9KVxuICAgICAgICBleHBlY3QocHJvY2Vzc0J1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25CYWNrIHdoZW4gYmFjayBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQmFjayA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8QWN0aW9ucyB7Li4uZGVmYXVsdEFjdGlvbnNQcm9wc30gb25CYWNrPXtvbkJhY2t9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5kYXRhU291cmNlL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQmFjaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblByb2Nlc3Mgd2hlbiBwcm9jZXNzIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25Qcm9jZXNzID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxBY3Rpb25zIHsuLi5kZWZhdWx0QWN0aW9uc1Byb3BzfSBvblByb2Nlc3M9e29uUHJvY2Vzc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUHJvY2VzcykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25Qcm9jZXNzIHdoZW4gcHJvY2VzcyBidXR0b24gaXMgZGlzYWJsZWQgYW5kIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblByb2Nlc3MgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEFjdGlvbnMgey4uLmRlZmF1bHRBY3Rpb25zUHJvcHN9IG9uUHJvY2Vzcz17b25Qcm9jZXNzfSBydW5EaXNhYmxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUHJvY2Vzcykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbXBvbmVudCBNZW1vaXphdGlvbiBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChBY3Rpb25zLiQkdHlwZW9mKS50b0JlKFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBIZWFkZXIgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdIZWFkZXInLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRIZWFkZXJQcm9wcyA9IHtcbiAgICBvblJlc2V0OiB2aS5mbigpLFxuICAgIHJlc2V0RGlzYWJsZWQ6IGZhbHNlLFxuICAgIHByZXZpZXdEaXNhYmxlZDogZmFsc2UsXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4uZGVmYXVsdEhlYWRlclByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVHdvLmNodW5rU2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZXNldCBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4uZGVmYXVsdEhlYWRlclByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY29tbW9uLm9wZXJhdGlvbi5yZXNldC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHByZXZpZXcgYnV0dG9uIHdpdGggaWNvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5kZWZhdWx0SGVhZGVyUHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28ucHJldmlld0NodW5rcy9pIH0pXG4gICAgICBleHBlY3QocHJldmlld0J1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHByZXZpZXdCdXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGl0bGUgd2l0aCBjb3JyZWN0IHRleHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4uZGVmYXVsdEhlYWRlclByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVHdvLmNodW5rU2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBjb250YWluZXIgbGF5b3V0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SGVhZGVyIHsuLi5kZWZhdWx0SGVhZGVyUHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IG1haW5Db250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmZsZXguaXRlbXMtY2VudGVyLmdhcC14LTEnKVxuICAgICAgZXhwZWN0KG1haW5Db250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3Jlc2V0RGlzYWJsZWQgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbm90IGRpc2FibGUgcmVzZXQgYnV0dG9uIHdoZW4gcmVzZXREaXNhYmxlZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4uZGVmYXVsdEhlYWRlclByb3BzfSByZXNldERpc2FibGVkPXtmYWxzZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IHJlc2V0QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY29tbW9uLm9wZXJhdGlvbi5yZXNldC9pIH0pXG4gICAgICAgIGV4cGVjdChyZXNldEJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgcmVzZXQgYnV0dG9uIHdoZW4gcmVzZXREaXNhYmxlZCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5kZWZhdWx0SGVhZGVyUHJvcHN9IHJlc2V0RGlzYWJsZWQ9e3RydWV9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCByZXNldEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2NvbW1vbi5vcGVyYXRpb24ucmVzZXQvaSB9KVxuICAgICAgICBleHBlY3QocmVzZXRCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgncHJldmlld0Rpc2FibGVkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIG5vdCBkaXNhYmxlIHByZXZpZXcgYnV0dG9uIHdoZW4gcHJldmlld0Rpc2FibGVkIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5kZWZhdWx0SGVhZGVyUHJvcHN9IHByZXZpZXdEaXNhYmxlZD17ZmFsc2V9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBwcmV2aWV3QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVHdvLnByZXZpZXdDaHVua3MvaSB9KVxuICAgICAgICBleHBlY3QocHJldmlld0J1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGRpc2FibGUgcHJldmlldyBidXR0b24gd2hlbiBwcmV2aWV3RGlzYWJsZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4uZGVmYXVsdEhlYWRlclByb3BzfSBwcmV2aWV3RGlzYWJsZWQ9e3RydWV9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBwcmV2aWV3QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVHdvLnByZXZpZXdDaHVua3MvaSB9KVxuICAgICAgICBleHBlY3QocHJldmlld0J1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9uUHJldmlldyBiZWluZyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4uZGVmYXVsdEhlYWRlclByb3BzfSBvblByZXZpZXc9e3VuZGVmaW5lZH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcHJldmlld0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5wcmV2aWV3Q2h1bmtzL2kgfSlcbiAgICAgIGV4cGVjdChwcmV2aWV3QnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBDbGljayBzaG91bGQgbm90IHRocm93XG4gICAgICBsZXQgZGlkVGhyb3cgPSBmYWxzZVxuICAgICAgdHJ5IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHByZXZpZXdCdXR0b24pXG4gICAgICB9XG4gICAgICBjYXRjaCB7XG4gICAgICAgIGRpZFRocm93ID0gdHJ1ZVxuICAgICAgfVxuICAgICAgZXhwZWN0KGRpZFRocm93KS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25SZXNldCB3aGVuIHJlc2V0IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25SZXNldCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5kZWZhdWx0SGVhZGVyUHJvcHN9IG9uUmVzZXQ9e29uUmVzZXR9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9jb21tb24ub3BlcmF0aW9uLnJlc2V0L2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUmVzZXQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uUmVzZXQgd2hlbiByZXNldCBidXR0b24gaXMgZGlzYWJsZWQgYW5kIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblJlc2V0ID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLmRlZmF1bHRIZWFkZXJQcm9wc30gb25SZXNldD17b25SZXNldH0gcmVzZXREaXNhYmxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2NvbW1vbi5vcGVyYXRpb24ucmVzZXQvaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25SZXNldCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25QcmV2aWV3IHdoZW4gcHJldmlldyBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uUHJldmlldyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5kZWZhdWx0SGVhZGVyUHJvcHN9IG9uUHJldmlldz17b25QcmV2aWV3fSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVHdvLnByZXZpZXdDaHVua3MvaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25QcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvblByZXZpZXcgd2hlbiBwcmV2aWV3IGJ1dHRvbiBpcyBkaXNhYmxlZCBhbmQgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uUHJldmlldyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5kZWZhdWx0SGVhZGVyUHJvcHN9IG9uUHJldmlldz17b25QcmV2aWV3fSBwcmV2aWV3RGlzYWJsZWQ9e3RydWV9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28ucHJldmlld0NodW5rcy9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvblByZXZpZXcpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb24gVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoSGVhZGVyLiQkdHlwZW9mKS50b0JlKFN5bWJvbC5mb3IoJ3JlYWN0Lm1lbW8nKSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGJvdGggYnV0dG9ucyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5kZWZhdWx0SGVhZGVyUHJvcHN9IHJlc2V0RGlzYWJsZWQ9e3RydWV9IHByZXZpZXdEaXNhYmxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcmVzZXRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9jb21tb24ub3BlcmF0aW9uLnJlc2V0L2kgfSlcbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28ucHJldmlld0NodW5rcy9pIH0pXG4gICAgICBleHBlY3QocmVzZXRCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICBleHBlY3QocHJldmlld0J1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYm90aCBidXR0b25zIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4uZGVmYXVsdEhlYWRlclByb3BzfSByZXNldERpc2FibGVkPXtmYWxzZX0gcHJldmlld0Rpc2FibGVkPXtmYWxzZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcmVzZXRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9jb21tb24ub3BlcmF0aW9uLnJlc2V0L2kgfSlcbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28ucHJldmlld0NodW5rcy9pIH0pXG4gICAgICBleHBlY3QocmVzZXRCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgZXhwZWN0KHByZXZpZXdCdXR0b24pLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEZvcm0gQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdGb3JtJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0Rm9ybVByb3BzID0ge1xuICAgIGluaXRpYWxEYXRhOiB7IGZpZWxkMTogJycgfSxcbiAgICBjb25maWd1cmF0aW9uczogW10gYXMgQmFzZUNvbmZpZ3VyYXRpb25bXSxcbiAgICBzY2hlbWE6IGNyZWF0ZU1vY2tTY2hlbWEoKSxcbiAgICBvblN1Ym1pdDogdmkuZm4oKSxcbiAgICBvblByZXZpZXc6IHZpLmZuKCksXG4gICAgcmVmOiB7IGN1cnJlbnQ6IG51bGwgfSBhcyBSZWFjdC5SZWZPYmplY3Q8dW5rbm93bj4sXG4gICAgaXNSdW5uaW5nOiBmYWxzZSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHRvYXN0Tm90aWZ5U3B5Lm1vY2tDbGVhcigpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVHdvLmNodW5rU2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmb3JtIGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmb3JtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKVxuICAgICAgZXhwZWN0KGZvcm0pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSGVhZGVyIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8Rm9ybSB7Li4uZGVmYXVsdEZvcm1Qcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5jaHVua1NldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9jb21tb24ub3BlcmF0aW9uLnJlc2V0L2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28ucHJldmlld0NodW5rcy9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGZvcm0gc3RydWN0dXJlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Rm9ybSB7Li4uZGVmYXVsdEZvcm1Qcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtLmZsZXgudy1mdWxsLmZsZXgtY29sJylcbiAgICAgIGV4cGVjdChmb3JtKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdpc1J1bm5pbmcgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGlzYWJsZSBwcmV2aWV3IGJ1dHRvbiB3aGVuIGlzUnVubmluZyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8Rm9ybSB7Li4uZGVmYXVsdEZvcm1Qcm9wc30gaXNSdW5uaW5nPXt0cnVlfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgcHJldmlld0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5wcmV2aWV3Q2h1bmtzL2kgfSlcbiAgICAgICAgZXhwZWN0KHByZXZpZXdCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBkaXNhYmxlIHByZXZpZXcgYnV0dG9uIHdoZW4gaXNSdW5uaW5nIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8Rm9ybSB7Li4uZGVmYXVsdEZvcm1Qcm9wc30gaXNSdW5uaW5nPXtmYWxzZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28ucHJldmlld0NodW5rcy9pIH0pXG4gICAgICAgIGV4cGVjdChwcmV2aWV3QnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdjb25maWd1cmF0aW9ucyBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgZW1wdHkgd2hlbiBjb25maWd1cmF0aW9ucyBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBjb25maWd1cmF0aW9ucz17W119IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHRoZSBmaWVsZHMgY29udGFpbmVyIHNob3VsZCBoYXZlIG5vIGZpZWxkIGNoaWxkcmVuXG4gICAgICAgIGNvbnN0IGZpZWxkc0NvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZmxleC5mbGV4LWNvbC5nYXAtMycpXG4gICAgICAgIGV4cGVjdChmaWVsZHNDb250YWluZXI/LmNoaWxkcmVuLmxlbmd0aCkudG9CZSgwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGNvbmZpZ3VyYXRpb25zJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gW1xuICAgICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICd2YXIxJywgbGFiZWw6ICdWYXJpYWJsZSAxJyB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAndmFyMicsIGxhYmVsOiAnVmFyaWFibGUgMicgfSksXG4gICAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogJ3ZhcjMnLCBsYWJlbDogJ1ZhcmlhYmxlIDMnIH0pLFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Rm9ybSB7Li4uZGVmYXVsdEZvcm1Qcm9wc30gY29uZmlndXJhdGlvbnM9e2NvbmZpZ3VyYXRpb25zfSBpbml0aWFsRGF0YT17eyB2YXIxOiAnJywgdmFyMjogJycsIHZhcjM6ICcnIH19IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVmFyaWFibGUgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdWYXJpYWJsZSAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1ZhcmlhYmxlIDMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBleHBvc2Ugc3VibWl0IG1ldGhvZCB2aWEgcmVmJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1JlZiA9IHsgY3VycmVudDogbnVsbCB9IGFzIFJlYWN0Lk11dGFibGVSZWZPYmplY3Q8eyBzdWJtaXQ6ICgpID0+IHZvaWQgfSB8IG51bGw+XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSByZWY9e21vY2tSZWZ9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrUmVmLmN1cnJlbnQpLm5vdC50b0JlTnVsbCgpXG4gICAgICBleHBlY3QodHlwZW9mIG1vY2tSZWYuY3VycmVudD8uc3VibWl0KS50b0JlKCdmdW5jdGlvbicpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVmIFN1Ym1pdCBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVmIFN1Ym1pdCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdWJtaXQgd2hlbiByZWYuc3VibWl0KCkgaXMgY2FsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrUmVmID0geyBjdXJyZW50OiBudWxsIH0gYXMgUmVhY3QuTXV0YWJsZVJlZk9iamVjdDx7IHN1Ym1pdDogKCkgPT4gdm9pZCB9IHwgbnVsbD5cbiAgICAgIHJlbmRlcig8Rm9ybSB7Li4uZGVmYXVsdEZvcm1Qcm9wc30gcmVmPXttb2NrUmVmfSBvblN1Ym1pdD17b25TdWJtaXR9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBjYWxsIHN1Ym1pdCB2aWEgcmVmXG4gICAgICBtb2NrUmVmLmN1cnJlbnQ/LnN1Ym1pdCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyaWdnZXIgZm9ybSB2YWxpZGF0aW9uIHdoZW4gcmVmLnN1Ym1pdCgpIGlzIGNhbGxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZhaWxpbmdTY2hlbWEgPSBjcmVhdGVGYWlsaW5nU2NoZW1hKClcbiAgICAgIGNvbnN0IG1vY2tSZWYgPSB7IGN1cnJlbnQ6IG51bGwgfSBhcyBSZWFjdC5NdXRhYmxlUmVmT2JqZWN0PHsgc3VibWl0OiAoKSA9PiB2b2lkIH0gfCBudWxsPlxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSByZWY9e21vY2tSZWZ9IHNjaGVtYT17ZmFpbGluZ1NjaGVtYX0gLz4pXG5cbiAgICAgIC8vIEFjdCAtIGNhbGwgc3VibWl0IHZpYSByZWZcbiAgICAgIG1vY2tSZWYuY3VycmVudD8uc3VibWl0KClcblxuICAgICAgLy8gQXNzZXJ0IC0gdmFsaWRhdGlvbiBlcnJvciBzaG91bGQgYmUgc2hvd25cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcImZpZWxkMVwiIGlzIHJlcXVpcmVkJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblByZXZpZXcgd2hlbiBwcmV2aWV3IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25QcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBvblByZXZpZXc9e29uUHJldmlld30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5wcmV2aWV3Q2h1bmtzL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGZvcm0gc3VibWlzc2lvbiB2aWEgZm9ybSBlbGVtZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBvblN1Ym1pdD17b25TdWJtaXR9IC8+KVxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LnN1Ym1pdChmb3JtKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25TdWJtaXQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBGb3JtIFN0YXRlIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdGb3JtIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzYWJsZSByZXNldCBidXR0b24gaW5pdGlhbGx5IHdoZW4gZm9ybSBpcyBub3QgZGlydHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEZvcm0gey4uLmRlZmF1bHRGb3JtUHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHJlc2V0QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY29tbW9uLm9wZXJhdGlvbi5yZXNldC9pIH0pXG4gICAgICBleHBlY3QocmVzZXRCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZW5hYmxlIHJlc2V0IGJ1dHRvbiB3aGVuIGZvcm0gYmVjb21lcyBkaXJ0eScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gW1xuICAgICAgICBjcmVhdGVNb2NrQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnZmllbGQxJywgbGFiZWw6ICdGaWVsZCAxJyB9KSxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBjb25maWd1cmF0aW9ucz17Y29uZmlndXJhdGlvbnN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBjaGFuZ2UgaW5wdXQgdG8gbWFrZSBmb3JtIGRpcnR5XG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RleHRib3gnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICduZXcgdmFsdWUnIH0gfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzZXRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9jb21tb24ub3BlcmF0aW9uLnJlc2V0L2kgfSlcbiAgICAgICAgZXhwZWN0KHJlc2V0QnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVzZXQgZm9ybSB0byBpbml0aWFsIHZhbHVlcyB3aGVuIHJlc2V0IGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdmaWVsZDEnLCBsYWJlbDogJ0ZpZWxkIDEnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgaW5pdGlhbERhdGEgPSB7IGZpZWxkMTogJ2luaXRpYWwgdmFsdWUnIH1cblxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBjb25maWd1cmF0aW9ucz17Y29uZmlndXJhdGlvbnN9IGluaXRpYWxEYXRhPXtpbml0aWFsRGF0YX0gLz4pXG5cbiAgICAgIC8vIEFjdCAtIGNoYW5nZSBpbnB1dCB0byBtYWtlIGZvcm0gZGlydHlcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ25ldyB2YWx1ZScgfSB9KVxuXG4gICAgICAvLyBXYWl0IGZvciByZXNldCBidXR0b24gdG8gYmUgZW5hYmxlZFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc2V0QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY29tbW9uLm9wZXJhdGlvbi5yZXNldC9pIH0pXG4gICAgICAgIGV4cGVjdChyZXNldEJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDbGljayByZXNldCBidXR0b25cbiAgICAgIGNvbnN0IHJlc2V0QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY29tbW9uLm9wZXJhdGlvbi5yZXNldC9pIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2socmVzZXRCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydCAtIGZvcm0gc2hvdWxkIGJlIHJlc2V0LCBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkIGFnYWluXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc2V0QnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGZvcm0ucmVzZXQgd2hlbiBoYW5kbGVSZXNldCBpcyB0cmlnZ2VyZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjb25maWd1cmF0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogJ2ZpZWxkMScsIGxhYmVsOiAnRmllbGQgMScgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBpbml0aWFsRGF0YSA9IHsgZmllbGQxOiAnb3JpZ2luYWwnIH1cblxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBjb25maWd1cmF0aW9ucz17Y29uZmlndXJhdGlvbnN9IGluaXRpYWxEYXRhPXtpbml0aWFsRGF0YX0gLz4pXG5cbiAgICAgIC8vIE1ha2UgZm9ybSBkaXJ0eVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCd0ZXh0Ym94JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnbW9kaWZpZWQnIH0gfSlcblxuICAgICAgLy8gV2FpdCBmb3IgZGlydHkgc3RhdGVcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY29tbW9uLm9wZXJhdGlvbi5yZXNldC9pIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAtIGNsaWNrIHJlc2V0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvY29tbW9uLm9wZXJhdGlvbi5yZXNldC9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnQgLSBpbnB1dCBzaG91bGQgYmUgcmVzZXQgdG8gaW5pdGlhbCB2YWx1ZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ29yaWdpbmFsJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVmFsaWRhdGlvbiBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVmFsaWRhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgdG9hc3Qgbm90aWZpY2F0aW9uIG9uIHZhbGlkYXRpb24gZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmYWlsaW5nU2NoZW1hID0gY3JlYXRlRmFpbGluZ1NjaGVtYSgpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBzY2hlbWE9e2ZhaWxpbmdTY2hlbWF9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGZvcm0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpIVxuICAgICAgZmlyZUV2ZW50LnN1Ym1pdChmb3JtKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdcImZpZWxkMVwiIGlzIHJlcXVpcmVkJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25TdWJtaXQgd2hlbiB2YWxpZGF0aW9uIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBmYWlsaW5nU2NoZW1hID0gY3JlYXRlRmFpbGluZ1NjaGVtYSgpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBzY2hlbWE9e2ZhaWxpbmdTY2hlbWF9IG9uU3VibWl0PXtvblN1Ym1pdH0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydCAtIHdhaXQgYSBiaXQgYW5kIHZlcmlmeSBvblN1Ym1pdCB3YXMgbm90IGNhbGxlZFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh0b2FzdE5vdGlmeVNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG9uU3VibWl0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblN1Ym1pdCB3aGVuIHZhbGlkYXRpb24gcGFzc2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TdWJtaXQgPSB2aS5mbigpXG4gICAgICBjb25zdCBwYXNzaW5nU2NoZW1hID0gY3JlYXRlTW9ja1NjaGVtYSgpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBzY2hlbWE9e3Bhc3NpbmdTY2hlbWF9IG9uU3VibWl0PXtvblN1Ym1pdH0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgaW5pdGlhbERhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEZvcm0gey4uLmRlZmF1bHRGb3JtUHJvcHN9IGluaXRpYWxEYXRhPXt7fX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5hZGREb2N1bWVudHMuc3RlcFR3by5jaHVua1NldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29uZmlndXJhdGlvbnMgd2l0aCBkaWZmZXJlbnQgZmllbGQgdHlwZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjb25maWd1cmF0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB0eXBlOiBCYXNlRmllbGRUeXBlLnRleHRJbnB1dCwgdmFyaWFibGU6ICd0ZXh0JywgbGFiZWw6ICdUZXh0IEZpZWxkJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0NvbmZpZ3VyYXRpb24oeyB0eXBlOiBCYXNlRmllbGRUeXBlLm51bWJlcklucHV0LCB2YXJpYWJsZTogJ251bWJlcicsIGxhYmVsOiAnTnVtYmVyIEZpZWxkJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEZvcm0gey4uLmRlZmF1bHRGb3JtUHJvcHN9IGNvbmZpZ3VyYXRpb25zPXtjb25maWd1cmF0aW9uc30gaW5pdGlhbERhdGE9e3sgdGV4dDogJycsIG51bWJlcjogMCB9fSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGV4dCBGaWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTnVtYmVyIEZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCByZWYnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEZvcm0gey4uLmRlZmF1bHRGb3JtUHJvcHN9IHJlZj17eyBjdXJyZW50OiBudWxsIH19IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28uY2h1bmtTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29uZmlndXJhdGlvbiBWYXJpYXRpb25zIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb25maWd1cmF0aW9uIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29uZmlndXJhdGlvbiB3aXRoIGxhYmVsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdmaWVsZDEnLCBsYWJlbDogJ0N1c3RvbSBMYWJlbCcgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBjb25maWd1cmF0aW9ucz17Y29uZmlndXJhdGlvbnN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gTGFiZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZXF1aXJlZCBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdmaWVsZDEnLCBsYWJlbDogJ1JlcXVpcmVkIEZpZWxkJywgcmVxdWlyZWQ6IHRydWUgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBjb25maWd1cmF0aW9ucz17Y29uZmlndXJhdGlvbnN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdSZXF1aXJlZCBGaWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW50ZWdyYXRpb24gVGVzdHMgKENyb3NzLWNvbXBvbmVudClcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1Byb2Nlc3MgRG9jdW1lbnRzIENvbXBvbmVudHMgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdGb3JtIHdpdGggSGVhZGVyIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGRlZmF1bHRGb3JtUHJvcHMgPSB7XG4gICAgICBpbml0aWFsRGF0YTogeyBmaWVsZDE6ICcnIH0sXG4gICAgICBjb25maWd1cmF0aW9uczogW10gYXMgQmFzZUNvbmZpZ3VyYXRpb25bXSxcbiAgICAgIHNjaGVtYTogY3JlYXRlTW9ja1NjaGVtYSgpLFxuICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICBvblByZXZpZXc6IHZpLmZuKCksXG4gICAgICByZWY6IHsgY3VycmVudDogbnVsbCB9IGFzIFJlYWN0LlJlZk9iamVjdDx1bmtub3duPixcbiAgICAgIGlzUnVubmluZzogZmFsc2UsXG4gICAgfVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSGVhZGVyIHdpdGhpbiBGb3JtJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwVHdvLmNodW5rU2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2NvbW1vbi5vcGVyYXRpb24ucmVzZXQvaSB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgaXNSdW5uaW5nIHRvIEhlYWRlciBmb3IgcHJldmlld0Rpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxGb3JtIHsuLi5kZWZhdWx0Rm9ybVByb3BzfSBpc1J1bm5pbmc9e3RydWV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBUd28ucHJldmlld0NodW5rcy9pIH0pXG4gICAgICBleHBlY3QocHJldmlld0J1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==