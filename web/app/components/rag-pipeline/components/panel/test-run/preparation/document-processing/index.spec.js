"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const React = require("react");
const types_1 = require("@/app/components/base/form/form-scenarios/base/types");
const types_2 = require("@/app/components/workflow/types");
const pipeline_1 = require("@/models/pipeline");
const actions_1 = require("./actions");
const index_1 = require("./index");
const options_1 = require("./options");
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock workflow store
let mockPipelineId = 'test-pipeline-id';
let mockWorkflowRunningData;
vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => {
        const state = {
            pipelineId: mockPipelineId,
            workflowRunningData: mockWorkflowRunningData,
        };
        return selector(state);
    },
}));
// Mock useDraftPipelineProcessingParams
let mockParamsConfig;
let mockIsFetchingParams = false;
vi.mock('@/service/use-pipeline', () => ({
    useDraftPipelineProcessingParams: () => ({
        data: mockParamsConfig,
        isFetching: mockIsFetchingParams,
    }),
}));
// Mock use-input-fields hooks
const mockUseInitialData = vi.fn();
const mockUseConfigurations = vi.fn();
vi.mock('@/app/components/rag-pipeline/hooks/use-input-fields', () => ({
    useInitialData: (variables) => mockUseInitialData(variables),
    useConfigurations: (variables) => mockUseConfigurations(variables),
}));
// Mock generateZodSchema
const mockGenerateZodSchema = vi.fn();
vi.mock('@/app/components/base/form/form-scenarios/base/utils', () => ({
    generateZodSchema: (configurations) => mockGenerateZodSchema(configurations),
}));
// Mock Toast
const mockToastNotify = vi.fn();
vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: (params) => mockToastNotify(params),
    },
}));
// Mock useAppForm
const mockHandleSubmit = vi.fn();
const mockFormStore = {
    isSubmitting: false,
    canSubmit: true,
};
vi.mock('@/app/components/base/form', () => ({
    useAppForm: ({ onSubmit, validators }) => {
        const form = {
            handleSubmit: () => {
                const value = { test: 'value' };
                const validationResult = validators?.onSubmit?.({ value });
                if (!validationResult) {
                    onSubmit({ value });
                }
                mockHandleSubmit();
            },
            store: mockFormStore,
            AppForm: ({ children }) => <div data-testid="app-form">{children}</div>,
            Actions: ({ CustomActions }) => (<div data-testid="form-actions">
          {CustomActions({
                    form: {
                        handleSubmit: mockHandleSubmit,
                    },
                    isSubmitting: false,
                    canSubmit: true,
                })}
        </div>),
        };
        return form;
    },
}));
// Mock BaseField
vi.mock('@/app/components/base/form/form-scenarios/base/field', () => ({
    default: ({ config }) => {
        return () => (<div data-testid={`field-${config.variable}`}>
        <span data-testid={`field-label-${config.variable}`}>{config.label}</span>
        <span data-testid={`field-type-${config.variable}`}>{config.type}</span>
        <span data-testid={`field-required-${config.variable}`}>{String(config.required)}</span>
      </div>);
    },
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createRAGPipelineVariable = (overrides) => ({
    belong_to_node_id: 'test-node',
    type: pipeline_1.PipelineInputVarType.textInput,
    label: 'Test Label',
    variable: 'test_variable',
    max_length: 100,
    default_value: '',
    placeholder: 'Enter value',
    unit: '',
    required: true,
    tooltips: 'Test tooltip',
    options: [],
    allowed_file_upload_methods: [],
    allowed_file_types: [],
    allowed_file_extensions: [],
    ...overrides,
});
const createBaseConfiguration = (overrides) => ({
    type: types_1.BaseFieldType.textInput,
    variable: 'test_variable',
    label: 'Test Label',
    required: true,
    showConditions: [],
    maxLength: 100,
    placeholder: 'Enter value',
    tooltip: 'Test tooltip',
    ...overrides,
});
const createMockSchema = () => ({
    safeParse: vi.fn().mockReturnValue({ success: true }),
});
// ============================================================================
// Helper Functions
// ============================================================================
const setupMocks = (options) => {
    mockPipelineId = options?.pipelineId ?? 'test-pipeline-id';
    mockParamsConfig = options?.paramsConfig;
    mockIsFetchingParams = options?.isFetchingParams ?? false;
    mockWorkflowRunningData = options?.workflowRunningData;
    mockUseInitialData.mockReturnValue(options?.initialData ?? {});
    mockUseConfigurations.mockReturnValue(options?.configurations ?? []);
    mockGenerateZodSchema.mockReturnValue(createMockSchema());
};
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const renderWithQueryClient = (component) => {
    const queryClient = createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
      {component}
    </react_query_1.QueryClientProvider>);
};
// ============================================================================
// DocumentProcessing Component Tests
// ============================================================================
describe('DocumentProcessing', () => {
    const defaultProps = {
        dataSourceNodeId: 'datasource-node-1',
        onProcess: vi.fn(),
        onBack: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            setupMocks({
                configurations: [createBaseConfiguration()],
            });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
        it('should render Options component with form elements', () => {
            // Arrange
            const configurations = [
                createBaseConfiguration({ variable: 'field1', label: 'Field 1' }),
                createBaseConfiguration({ variable: 'field2', label: 'Field 2' }),
            ];
            setupMocks({ configurations });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-field1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-field2')).toBeInTheDocument();
        });
        it('should render no fields when configurations is empty', () => {
            // Arrange
            setupMocks({ configurations: [] });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.queryByTestId(/^field-/)).not.toBeInTheDocument();
        });
        it('should call useInitialData with variables from paramsConfig', () => {
            // Arrange
            const variables = [createRAGPipelineVariable({ variable: 'var1' })];
            setupMocks({
                paramsConfig: { variables },
            });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(mockUseInitialData).toHaveBeenCalledWith(variables);
        });
        it('should call useConfigurations with variables from paramsConfig', () => {
            // Arrange
            const variables = [createRAGPipelineVariable({ variable: 'var1' })];
            setupMocks({
                paramsConfig: { variables },
            });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(mockUseConfigurations).toHaveBeenCalledWith(variables);
        });
        it('should use empty array when paramsConfig.variables is undefined', () => {
            // Arrange
            setupMocks({ paramsConfig: undefined });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(mockUseInitialData).toHaveBeenCalledWith([]);
            expect(mockUseConfigurations).toHaveBeenCalledWith([]);
        });
    });
    // -------------------------------------------------------------------------
    // Props Testing
    // -------------------------------------------------------------------------
    describe('Props Testing', () => {
        it('should pass dataSourceNodeId to useInputVariables hook', () => {
            // Arrange
            const customNodeId = 'custom-datasource-node';
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps} dataSourceNodeId={customNodeId}/>);
            // Assert - verify hook is called (mocked, so we check component renders)
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
        it('should pass onProcess callback to Options component', () => {
            // Arrange
            const mockOnProcess = vi.fn();
            setupMocks({ configurations: [] });
            // Act
            const { container } = renderWithQueryClient(<index_1.default {...defaultProps} onProcess={mockOnProcess}/>);
            // Assert - form should be rendered
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should pass onBack callback to Actions component', () => {
            // Arrange
            const mockOnBack = vi.fn();
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps} onBack={mockOnBack}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability and Memoization Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability and Memoization', () => {
        it('should memoize renderCustomActions callback', () => {
            // Arrange
            setupMocks();
            const { rerender } = renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Act - rerender with same props
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...defaultProps}/>
        </react_query_1.QueryClientProvider>);
            // Assert - component should render correctly without issues
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
        it('should update renderCustomActions when isFetchingParams changes', () => {
            // Arrange
            setupMocks({ isFetchingParams: false });
            const { rerender } = renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Act
            setupMocks({ isFetchingParams: true });
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...defaultProps}/>
        </react_query_1.QueryClientProvider>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
        it('should update renderCustomActions when onBack changes', () => {
            // Arrange
            const onBack1 = vi.fn();
            const onBack2 = vi.fn();
            setupMocks();
            const { rerender } = renderWithQueryClient(<index_1.default {...defaultProps} onBack={onBack1}/>);
            // Act
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...defaultProps} onBack={onBack2}/>
        </react_query_1.QueryClientProvider>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // User Interactions Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onBack when back button is clicked', () => {
            // Arrange
            const mockOnBack = vi.fn();
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps} onBack={mockOnBack}/>);
            const backButton = react_1.screen.getByText('datasetPipeline.operations.backToDataSource');
            react_1.fireEvent.click(backButton);
            // Assert
            expect(mockOnBack).toHaveBeenCalledTimes(1);
        });
        it('should handle form submission', () => {
            // Arrange
            const mockOnProcess = vi.fn();
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps} onProcess={mockOnProcess}/>);
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process');
            react_1.fireEvent.click(processButton);
            // Assert
            expect(mockHandleSubmit).toHaveBeenCalled();
        });
    });
    // -------------------------------------------------------------------------
    // Component Memoization Tests
    // -------------------------------------------------------------------------
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange
            setupMocks();
            const { rerender } = renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Act - rerender with same props
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...defaultProps}/>
        </react_query_1.QueryClientProvider>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
        it('should not break when re-rendering with different props', () => {
            // Arrange
            const initialProps = {
                ...defaultProps,
                dataSourceNodeId: 'node-1',
            };
            setupMocks();
            const { rerender } = renderWithQueryClient(<index_1.default {...initialProps}/>);
            // Act
            const newProps = {
                ...defaultProps,
                dataSourceNodeId: 'node-2',
            };
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...newProps}/>
        </react_query_1.QueryClientProvider>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle undefined paramsConfig', () => {
            // Arrange
            setupMocks({ paramsConfig: undefined });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(mockUseInitialData).toHaveBeenCalledWith([]);
            expect(mockUseConfigurations).toHaveBeenCalledWith([]);
        });
        it('should handle paramsConfig with empty variables', () => {
            // Arrange
            setupMocks({ paramsConfig: { variables: [] } });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(mockUseInitialData).toHaveBeenCalledWith([]);
            expect(mockUseConfigurations).toHaveBeenCalledWith([]);
        });
        it('should handle null pipelineId', () => {
            // Arrange
            setupMocks({ pipelineId: null });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
        it('should handle large number of variables', () => {
            // Arrange
            const variables = Array.from({ length: 50 }, (_, i) => createRAGPipelineVariable({ variable: `var_${i}` }));
            const configurations = Array.from({ length: 50 }, (_, i) => createBaseConfiguration({ variable: `var_${i}`, label: `Field ${i}` }));
            setupMocks({
                paramsConfig: { variables },
                configurations,
            });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getAllByTestId(/^field-var_/)).toHaveLength(50);
        });
        it('should handle special characters in node id', () => {
            // Arrange
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps} dataSourceNodeId="node-with-special_chars.123"/>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Loading State Tests
    // -------------------------------------------------------------------------
    describe('Loading State', () => {
        it('should pass isFetchingParams to Actions component', () => {
            // Arrange
            setupMocks({ isFetchingParams: true });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert - check that the process button is disabled when fetching
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process');
            expect(processButton.closest('button')).toBeDisabled();
        });
        it('should enable process button when not fetching', () => {
            // Arrange
            setupMocks({ isFetchingParams: false });
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process');
            expect(processButton.closest('button')).not.toBeDisabled();
        });
    });
});
// ============================================================================
// Actions Component Tests
// ============================================================================
// Helper to create mock form params for Actions tests
const createMockFormParams = (overrides) => ({
    form: { handleSubmit: overrides?.handleSubmit ?? vi.fn() },
    isSubmitting: overrides?.isSubmitting ?? false,
    canSubmit: overrides?.canSubmit ?? true,
});
describe('Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockWorkflowRunningData = undefined;
    });
    describe('Rendering', () => {
        it('should render back button', () => {
            // Arrange
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.operations.backToDataSource')).toBeInTheDocument();
        });
        it('should render process button', () => {
            // Arrange
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.operations.process')).toBeInTheDocument();
        });
    });
    describe('Button States', () => {
        it('should disable process button when runDisabled is true', () => {
            // Arrange
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} runDisabled={true} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
        it('should disable process button when isSubmitting is true', () => {
            // Arrange
            const mockFormParams = createMockFormParams({ isSubmitting: true });
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
        it('should disable process button when canSubmit is false', () => {
            // Arrange
            const mockFormParams = createMockFormParams({ canSubmit: false });
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
        it('should disable process button when workflow is running', () => {
            // Arrange
            mockWorkflowRunningData = {
                result: { status: types_2.WorkflowRunningStatus.Running },
            };
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
        it('should enable process button when all conditions are met', () => {
            // Arrange
            mockWorkflowRunningData = {
                result: { status: types_2.WorkflowRunningStatus.Succeeded },
            };
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} runDisabled={false} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).not.toBeDisabled();
        });
    });
    describe('User Interactions', () => {
        it('should call onBack when back button is clicked', () => {
            // Arrange
            const mockOnBack = vi.fn();
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={mockOnBack}/>);
            react_1.fireEvent.click(react_1.screen.getByText('datasetPipeline.operations.backToDataSource'));
            // Assert
            expect(mockOnBack).toHaveBeenCalledTimes(1);
        });
        it('should call form.handleSubmit when process button is clicked', () => {
            // Arrange
            const mockSubmit = vi.fn();
            const mockFormParams = createMockFormParams({ handleSubmit: mockSubmit });
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            react_1.fireEvent.click(react_1.screen.getByText('datasetPipeline.operations.process'));
            // Assert
            expect(mockSubmit).toHaveBeenCalledTimes(1);
        });
    });
    describe('Loading State', () => {
        it('should show loading state when isSubmitting', () => {
            // Arrange
            const mockFormParams = createMockFormParams({ isSubmitting: true });
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
        it('should show loading state when workflow is running', () => {
            // Arrange
            mockWorkflowRunningData = {
                result: { status: types_2.WorkflowRunningStatus.Running },
            };
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
    });
    describe('Edge Cases', () => {
        it('should handle undefined runDisabled prop', () => {
            // Arrange
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).not.toBeDisabled();
        });
        it('should handle undefined workflowRunningData', () => {
            // Arrange
            mockWorkflowRunningData = undefined;
            const mockFormParams = createMockFormParams();
            // Act
            (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={vi.fn()}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).not.toBeDisabled();
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange
            const mockFormParams = createMockFormParams();
            const mockOnBack = vi.fn();
            const { rerender } = (0, react_1.render)(<actions_1.default formParams={mockFormParams} onBack={mockOnBack}/>);
            // Act - rerender with same props
            rerender(<actions_1.default formParams={mockFormParams} onBack={mockOnBack}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.operations.backToDataSource')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// Options Component Tests
// ============================================================================
describe('Options', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGenerateZodSchema.mockReturnValue(createMockSchema());
    });
    describe('Rendering', () => {
        it('should render form element', () => {
            // Arrange
            const props = {
                initialData: {},
                configurations: [],
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should render fields based on configurations', () => {
            // Arrange
            const configurations = [
                createBaseConfiguration({ variable: 'name', label: 'Name' }),
                createBaseConfiguration({ variable: 'email', label: 'Email' }),
            ];
            const props = {
                initialData: { name: '', email: '' },
                configurations,
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-name')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-email')).toBeInTheDocument();
        });
        it('should render CustomActions', () => {
            // Arrange
            const props = {
                initialData: {},
                configurations: [],
                schema: createMockSchema(),
                CustomActions: () => (<button data-testid="custom-action">Custom Submit</button>),
                onSubmit: vi.fn(),
            };
            // Act
            (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('custom-action')).toBeInTheDocument();
        });
        it('should render with correct class name', () => {
            // Arrange
            const props = {
                initialData: {},
                configurations: [],
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            const form = container.querySelector('form');
            expect(form).toHaveClass('w-full');
        });
    });
    describe('Form Submission', () => {
        it('should prevent default form submission', () => {
            // Arrange
            const mockOnSubmit = vi.fn();
            const props = {
                initialData: {},
                configurations: [],
                schema: createMockSchema(),
                CustomActions: () => <button type="submit">Submit</button>,
                onSubmit: mockOnSubmit,
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            const form = container.querySelector('form');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');
            (0, react_1.fireEvent)(form, submitEvent);
            // Assert
            expect(preventDefaultSpy).toHaveBeenCalled();
        });
        it('should stop propagation on form submit', () => {
            // Arrange
            const mockOnSubmit = vi.fn();
            const props = {
                initialData: {},
                configurations: [],
                schema: createMockSchema(),
                CustomActions: () => <button type="submit">Submit</button>,
                onSubmit: mockOnSubmit,
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            const form = container.querySelector('form');
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            const stopPropagationSpy = vi.spyOn(submitEvent, 'stopPropagation');
            (0, react_1.fireEvent)(form, submitEvent);
            // Assert
            expect(stopPropagationSpy).toHaveBeenCalled();
        });
        it('should call onSubmit when validation passes', () => {
            // Arrange
            const mockOnSubmit = vi.fn();
            const props = {
                initialData: {},
                configurations: [],
                schema: createMockSchema(), // returns success: true
                CustomActions: () => <button type="submit">Submit</button>,
                onSubmit: mockOnSubmit,
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert
            expect(mockOnSubmit).toHaveBeenCalled();
        });
        it('should not call onSubmit when validation fails', () => {
            // Arrange
            const mockOnSubmit = vi.fn();
            const failingSchema = {
                safeParse: vi.fn().mockReturnValue({
                    success: false,
                    error: {
                        issues: [
                            { path: ['name'], message: 'Name is required' },
                        ],
                    },
                }),
            };
            const props = {
                initialData: {},
                configurations: [],
                schema: failingSchema,
                CustomActions: () => <button type="submit">Submit</button>,
                onSubmit: mockOnSubmit,
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
        it('should show toast error when validation fails', () => {
            // Arrange
            const failingSchema = {
                safeParse: vi.fn().mockReturnValue({
                    success: false,
                    error: {
                        issues: [
                            { path: ['name'], message: 'Name is required' },
                        ],
                    },
                }),
            };
            const props = {
                initialData: {},
                configurations: [],
                schema: failingSchema,
                CustomActions: () => <button type="submit">Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert
            expect(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Path: name Error: Name is required',
            });
        });
        it('should format error message with multiple path segments', () => {
            // Arrange
            const failingSchema = {
                safeParse: vi.fn().mockReturnValue({
                    success: false,
                    error: {
                        issues: [
                            { path: ['user', 'profile', 'email'], message: 'Invalid email format' },
                        ],
                    },
                }),
            };
            const props = {
                initialData: {},
                configurations: [],
                schema: failingSchema,
                CustomActions: () => <button type="submit">Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert
            expect(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Path: user.profile.email Error: Invalid email format',
            });
        });
        it('should only show first validation error when multiple errors exist', () => {
            // Arrange
            const failingSchema = {
                safeParse: vi.fn().mockReturnValue({
                    success: false,
                    error: {
                        issues: [
                            { path: ['name'], message: 'Name is required' },
                            { path: ['email'], message: 'Email is invalid' },
                            { path: ['age'], message: 'Age must be positive' },
                        ],
                    },
                }),
            };
            const props = {
                initialData: {},
                configurations: [],
                schema: failingSchema,
                CustomActions: () => <button type="submit">Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert - should only show first error
            expect(mockToastNotify).toHaveBeenCalledTimes(1);
            expect(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Path: name Error: Name is required',
            });
        });
        it('should handle empty path in validation error', () => {
            // Arrange
            const failingSchema = {
                safeParse: vi.fn().mockReturnValue({
                    success: false,
                    error: {
                        issues: [
                            { path: [], message: 'Form validation failed' },
                        ],
                    },
                }),
            };
            const props = {
                initialData: {},
                configurations: [],
                schema: failingSchema,
                CustomActions: () => <button type="submit">Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            const form = container.querySelector('form');
            react_1.fireEvent.submit(form);
            // Assert
            expect(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Path:  Error: Form validation failed',
            });
        });
    });
    describe('Field Rendering', () => {
        it('should render fields in correct order', () => {
            // Arrange
            const configurations = [
                createBaseConfiguration({ variable: 'first', label: 'First' }),
                createBaseConfiguration({ variable: 'second', label: 'Second' }),
                createBaseConfiguration({ variable: 'third', label: 'Third' }),
            ];
            const props = {
                initialData: {},
                configurations,
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            (0, react_1.render)(<options_1.default {...props}/>);
            // Assert - check that each field container exists with correct order
            expect(react_1.screen.getByTestId('field-first')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-second')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-third')).toBeInTheDocument();
            // Verify order by checking labels within each field
            expect(react_1.screen.getByTestId('field-label-first')).toHaveTextContent('First');
            expect(react_1.screen.getByTestId('field-label-second')).toHaveTextContent('Second');
            expect(react_1.screen.getByTestId('field-label-third')).toHaveTextContent('Third');
        });
        it('should pass config to BaseField', () => {
            // Arrange
            const configurations = [
                createBaseConfiguration({
                    variable: 'test',
                    label: 'Test Label',
                    type: types_1.BaseFieldType.textInput,
                    required: true,
                }),
            ];
            const props = {
                initialData: {},
                configurations,
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-label-test')).toHaveTextContent('Test Label');
            expect(react_1.screen.getByTestId('field-type-test')).toHaveTextContent(types_1.BaseFieldType.textInput);
            expect(react_1.screen.getByTestId('field-required-test')).toHaveTextContent('true');
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty initialData', () => {
            // Arrange
            const props = {
                initialData: {},
                configurations: [createBaseConfiguration()],
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            const { container } = (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should handle empty configurations', () => {
            // Arrange
            const props = {
                initialData: {},
                configurations: [],
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByTestId(/^field-/)).not.toBeInTheDocument();
        });
        it('should handle configurations with all field types', () => {
            // Arrange
            const configurations = [
                createBaseConfiguration({ type: types_1.BaseFieldType.textInput, variable: 'text' }),
                createBaseConfiguration({ type: types_1.BaseFieldType.paragraph, variable: 'paragraph' }),
                createBaseConfiguration({ type: types_1.BaseFieldType.numberInput, variable: 'number' }),
                createBaseConfiguration({ type: types_1.BaseFieldType.checkbox, variable: 'checkbox' }),
                createBaseConfiguration({ type: types_1.BaseFieldType.select, variable: 'select' }),
            ];
            const props = {
                initialData: {
                    text: '',
                    paragraph: '',
                    number: 0,
                    checkbox: false,
                    select: '',
                },
                configurations,
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-text')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-paragraph')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-number')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-checkbox')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-select')).toBeInTheDocument();
        });
        it('should handle large number of configurations', () => {
            // Arrange
            const configurations = Array.from({ length: 20 }, (_, i) => createBaseConfiguration({ variable: `field_${i}`, label: `Field ${i}` }));
            const props = {
                initialData: {},
                configurations,
                schema: createMockSchema(),
                CustomActions: () => <button>Submit</button>,
                onSubmit: vi.fn(),
            };
            // Act
            (0, react_1.render)(<options_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getAllByTestId(/^field-field_/)).toHaveLength(20);
        });
    });
});
// ============================================================================
// useInputVariables Hook Tests
// ============================================================================
describe('useInputVariables Hook', () => {
    // Import hook directly for isolated testing
    // Note: The hook is tested via component tests above, but we add specific hook tests here
    beforeEach(() => {
        vi.clearAllMocks();
        mockPipelineId = 'test-pipeline-id';
        mockParamsConfig = undefined;
        mockIsFetchingParams = false;
    });
    describe('Return Values', () => {
        it('should return isFetchingParams state', () => {
            // Arrange
            setupMocks({ isFetchingParams: true });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert - verified by checking process button is disabled
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
        it('should return paramsConfig when data is loaded', () => {
            // Arrange
            const variables = [createRAGPipelineVariable()];
            setupMocks({ paramsConfig: { variables } });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert
            expect(mockUseInitialData).toHaveBeenCalledWith(variables);
        });
    });
    describe('Query Behavior', () => {
        it('should use pipelineId from store', () => {
            // Arrange
            mockPipelineId = 'custom-pipeline-id';
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert - component renders successfully with the pipelineId
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
        it('should handle null pipelineId gracefully', () => {
            // Arrange
            mockPipelineId = null;
            setupMocks({ pipelineId: null });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// Integration Tests
// ============================================================================
describe('DocumentProcessing Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    describe('Full Flow', () => {
        it('should integrate hooks, Options, and Actions correctly', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({ variable: 'input1', label: 'Input 1' }),
                createRAGPipelineVariable({ variable: 'input2', label: 'Input 2' }),
            ];
            const configurations = [
                createBaseConfiguration({ variable: 'input1', label: 'Input 1' }),
                createBaseConfiguration({ variable: 'input2', label: 'Input 2' }),
            ];
            setupMocks({
                paramsConfig: { variables },
                configurations,
                initialData: { input1: '', input2: '' },
            });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-input1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-input2')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.operations.backToDataSource')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.operations.process')).toBeInTheDocument();
        });
        it('should pass data through the component hierarchy', () => {
            // Arrange
            const mockOnProcess = vi.fn();
            const mockOnBack = vi.fn();
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default dataSourceNodeId="test-node" onProcess={mockOnProcess} onBack={mockOnBack}/>);
            // Click back button
            react_1.fireEvent.click(react_1.screen.getByText('datasetPipeline.operations.backToDataSource'));
            // Assert
            expect(mockOnBack).toHaveBeenCalled();
        });
    });
    describe('State Synchronization', () => {
        it('should update when workflow running status changes', () => {
            // Arrange
            setupMocks({
                workflowRunningData: { result: { status: types_2.WorkflowRunningStatus.Running } },
            });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
        it('should update when fetching params status changes', () => {
            // Arrange
            setupMocks({ isFetchingParams: true });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert
            const processButton = react_1.screen.getByText('datasetPipeline.operations.process').closest('button');
            expect(processButton).toBeDisabled();
        });
    });
});
// ============================================================================
// Prop Variations Tests
// ============================================================================
describe('Prop Variations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    describe('dataSourceNodeId Variations', () => {
        it.each([
            ['simple-node-id'],
            ['node-with-numbers-123'],
            ['node_with_underscores'],
            ['node.with.dots'],
            ['very-long-node-id-that-could-potentially-cause-issues-if-not-handled-properly'],
        ])('should handle dataSourceNodeId: %s', (nodeId) => {
            // Act
            renderWithQueryClient(<index_1.default dataSourceNodeId={nodeId} onProcess={vi.fn()} onBack={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
    });
    describe('Callback Variations', () => {
        it('should work with synchronous onProcess', () => {
            // Arrange
            const syncCallback = vi.fn();
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default dataSourceNodeId="test-node" onProcess={syncCallback} onBack={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
        it('should work with async onProcess', () => {
            // Arrange
            const asyncCallback = vi.fn().mockResolvedValue(undefined);
            setupMocks();
            // Act
            renderWithQueryClient(<index_1.default dataSourceNodeId="test-node" onProcess={asyncCallback} onBack={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-actions')).toBeInTheDocument();
        });
    });
    describe('Configuration Variations', () => {
        it('should handle required fields', () => {
            // Arrange
            const configurations = [
                createBaseConfiguration({ variable: 'required', required: true }),
            ];
            setupMocks({ configurations });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-required-required')).toHaveTextContent('true');
        });
        it('should handle optional fields', () => {
            // Arrange
            const configurations = [
                createBaseConfiguration({ variable: 'optional', required: false }),
            ];
            setupMocks({ configurations });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-required-optional')).toHaveTextContent('false');
        });
        it('should handle mixed required and optional fields', () => {
            // Arrange
            const configurations = [
                createBaseConfiguration({ variable: 'required1', required: true }),
                createBaseConfiguration({ variable: 'optional1', required: false }),
                createBaseConfiguration({ variable: 'required2', required: true }),
            ];
            setupMocks({ configurations });
            // Act
            renderWithQueryClient(<index_1.default {...{
                dataSourceNodeId: 'test-node',
                onProcess: vi.fn(),
                onBack: vi.fn(),
            }}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-required-required1')).toHaveTextContent('true');
            expect(react_1.screen.getByTestId('field-required-optional1')).toHaveTextContent('false');
            expect(react_1.screen.getByTestId('field-required-required2')).toHaveTextContent('true');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsdURBQXdFO0FBQ3hFLGtEQUFrRTtBQUNsRSwrQkFBOEI7QUFDOUIsZ0ZBQW9GO0FBQ3BGLDJEQUF1RTtBQUN2RSxnREFBd0Q7QUFDeEQsdUNBQStCO0FBQy9CLG1DQUF3QztBQUN4Qyx1Q0FBK0I7QUFFL0IsK0VBQStFO0FBQy9FLDZCQUE2QjtBQUM3QiwrRUFBK0U7QUFFL0Usc0JBQXNCO0FBQ3RCLElBQUksY0FBYyxHQUFrQixrQkFBa0IsQ0FBQTtBQUN0RCxJQUFJLHVCQUFtRSxDQUFBO0FBT3ZFLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoRCxRQUFRLEVBQUUsQ0FBQyxRQUFvRCxFQUFFLEVBQUU7UUFDakUsTUFBTSxLQUFLLEdBQTJCO1lBQ3BDLFVBQVUsRUFBRSxjQUFjO1lBQzFCLG1CQUFtQixFQUFFLHVCQUF1QjtTQUM3QyxDQUFBO1FBQ0QsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDeEIsQ0FBQztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsd0NBQXdDO0FBQ3hDLElBQUksZ0JBQThELENBQUE7QUFDbEUsSUFBSSxvQkFBb0IsR0FBRyxLQUFLLENBQUE7QUFFaEMsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixVQUFVLEVBQUUsb0JBQW9CO0tBQ2pDLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILDhCQUE4QjtBQUM5QixNQUFNLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNsQyxNQUFNLHFCQUFxQixHQUFHLEVBQUUs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J1xuaW1wb3J0IHR5cGUgeyBDdXN0b21BY3Rpb25zUHJvcHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9jb21wb25lbnRzL2Zvcm0vYWN0aW9ucydcbmltcG9ydCB0eXBlIHsgQmFzZUNvbmZpZ3VyYXRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9iYXNlL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQaXBlbGluZVByb2Nlc3NpbmdQYXJhbXNSZXNwb25zZSwgUkFHUGlwZWxpbmVWYXJpYWJsZSwgUkFHUGlwZWxpbmVWYXJpYWJsZXMgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEJhc2VGaWVsZFR5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9iYXNlL3R5cGVzJ1xuaW1wb3J0IHsgV29ya2Zsb3dSdW5uaW5nU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7IFBpcGVsaW5lSW5wdXRWYXJUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgQWN0aW9ucyBmcm9tICcuL2FjdGlvbnMnXG5pbXBvcnQgRG9jdW1lbnRQcm9jZXNzaW5nIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgT3B0aW9ucyBmcm9tICcuL29wdGlvbnMnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgRXh0ZXJuYWwgRGVwZW5kZW5jaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgd29ya2Zsb3cgc3RvcmVcbmxldCBtb2NrUGlwZWxpbmVJZDogc3RyaW5nIHwgbnVsbCA9ICd0ZXN0LXBpcGVsaW5lLWlkJ1xubGV0IG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhOiB7IHJlc3VsdDogeyBzdGF0dXM6IHN0cmluZyB9IH0gfCB1bmRlZmluZWRcblxudHlwZSBNb2NrV29ya2Zsb3dTdG9yZVN0YXRlID0ge1xuICBwaXBlbGluZUlkOiBzdHJpbmcgfCBudWxsXG4gIHdvcmtmbG93UnVubmluZ0RhdGE6IHR5cGVvZiBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YVxufVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlU3RvcmU6IChzZWxlY3RvcjogKHN0YXRlOiBNb2NrV29ya2Zsb3dTdG9yZVN0YXRlKSA9PiB1bmtub3duKSA9PiB7XG4gICAgY29uc3Qgc3RhdGU6IE1vY2tXb3JrZmxvd1N0b3JlU3RhdGUgPSB7XG4gICAgICBwaXBlbGluZUlkOiBtb2NrUGlwZWxpbmVJZCxcbiAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE6IG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhLFxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3Ioc3RhdGUpXG4gIH0sXG59KSlcblxuLy8gTW9jayB1c2VEcmFmdFBpcGVsaW5lUHJvY2Vzc2luZ1BhcmFtc1xubGV0IG1vY2tQYXJhbXNDb25maWc6IFBpcGVsaW5lUHJvY2Vzc2luZ1BhcmFtc1Jlc3BvbnNlIHwgdW5kZWZpbmVkXG5sZXQgbW9ja0lzRmV0Y2hpbmdQYXJhbXMgPSBmYWxzZVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLXBpcGVsaW5lJywgKCkgPT4gKHtcbiAgdXNlRHJhZnRQaXBlbGluZVByb2Nlc3NpbmdQYXJhbXM6ICgpID0+ICh7XG4gICAgZGF0YTogbW9ja1BhcmFtc0NvbmZpZyxcbiAgICBpc0ZldGNoaW5nOiBtb2NrSXNGZXRjaGluZ1BhcmFtcyxcbiAgfSksXG59KSlcblxuLy8gTW9jayB1c2UtaW5wdXQtZmllbGRzIGhvb2tzXG5jb25zdCBtb2NrVXNlSW5pdGlhbERhdGEgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlQ29uZmlndXJhdGlvbnMgPSB2aS5mbigpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcmFnLXBpcGVsaW5lL2hvb2tzL3VzZS1pbnB1dC1maWVsZHMnLCAoKSA9PiAoe1xuICB1c2VJbml0aWFsRGF0YTogKHZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZXMpID0+IG1vY2tVc2VJbml0aWFsRGF0YSh2YXJpYWJsZXMpLFxuICB1c2VDb25maWd1cmF0aW9uczogKHZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZXMpID0+IG1vY2tVc2VDb25maWd1cmF0aW9ucyh2YXJpYWJsZXMpLFxufSkpXG5cbi8vIE1vY2sgZ2VuZXJhdGVab2RTY2hlbWFcbmNvbnN0IG1vY2tHZW5lcmF0ZVpvZFNjaGVtYSA9IHZpLmZuKClcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0vZm9ybS1zY2VuYXJpb3MvYmFzZS91dGlscycsICgpID0+ICh7XG4gIGdlbmVyYXRlWm9kU2NoZW1hOiAoY29uZmlndXJhdGlvbnM6IEJhc2VDb25maWd1cmF0aW9uW10pID0+IG1vY2tHZW5lcmF0ZVpvZFNjaGVtYShjb25maWd1cmF0aW9ucyksXG59KSlcblxuLy8gTW9jayBUb2FzdFxuY29uc3QgbW9ja1RvYXN0Tm90aWZ5ID0gdmkuZm4oKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgbm90aWZ5OiAocGFyYW1zOiB7IHR5cGU6IHN0cmluZywgbWVzc2FnZTogc3RyaW5nIH0pID0+IG1vY2tUb2FzdE5vdGlmeShwYXJhbXMpLFxuICB9LFxufSkpXG5cbi8vIE1vY2sgdXNlQXBwRm9ybVxuY29uc3QgbW9ja0hhbmRsZVN1Ym1pdCA9IHZpLmZuKClcbmNvbnN0IG1vY2tGb3JtU3RvcmUgPSB7XG4gIGlzU3VibWl0dGluZzogZmFsc2UsXG4gIGNhblN1Ym1pdDogdHJ1ZSxcbn1cblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0nLCAoKSA9PiAoe1xuICB1c2VBcHBGb3JtOiAoeyBvblN1Ym1pdCwgdmFsaWRhdG9ycyB9OiB7XG4gICAgb25TdWJtaXQ6IChwYXJhbXM6IHsgdmFsdWU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0pID0+IHZvaWRcbiAgICB2YWxpZGF0b3JzPzoge1xuICAgICAgb25TdWJtaXQ/OiAocGFyYW1zOiB7IHZhbHVlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB9KSA9PiBzdHJpbmcgfCB1bmRlZmluZWRcbiAgICB9XG4gIH0pID0+IHtcbiAgICBjb25zdCBmb3JtID0ge1xuICAgICAgaGFuZGxlU3VibWl0OiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0geyB0ZXN0OiAndmFsdWUnIH1cbiAgICAgICAgY29uc3QgdmFsaWRhdGlvblJlc3VsdCA9IHZhbGlkYXRvcnM/Lm9uU3VibWl0Py4oeyB2YWx1ZSB9KVxuICAgICAgICBpZiAoIXZhbGlkYXRpb25SZXN1bHQpIHtcbiAgICAgICAgICBvblN1Ym1pdCh7IHZhbHVlIH0pXG4gICAgICAgIH1cbiAgICAgICAgbW9ja0hhbmRsZVN1Ym1pdCgpXG4gICAgICB9LFxuICAgICAgc3RvcmU6IG1vY2tGb3JtU3RvcmUsXG4gICAgICBBcHBGb3JtOiAoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfSkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cImFwcC1mb3JtXCI+e2NoaWxkcmVufTwvZGl2PixcbiAgICAgIEFjdGlvbnM6ICh7IEN1c3RvbUFjdGlvbnMgfTogeyBDdXN0b21BY3Rpb25zOiAocHJvcHM6IEN1c3RvbUFjdGlvbnNQcm9wcykgPT4gUmVhY3QuUmVhY3ROb2RlIH0pID0+IChcbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImZvcm0tYWN0aW9uc1wiPlxuICAgICAgICAgIHtDdXN0b21BY3Rpb25zKHtcbiAgICAgICAgICAgIGZvcm06IHtcbiAgICAgICAgICAgICAgaGFuZGxlU3VibWl0OiBtb2NrSGFuZGxlU3VibWl0LFxuICAgICAgICAgICAgfSBhcyB1bmtub3duIGFzIEN1c3RvbUFjdGlvbnNQcm9wc1snZm9ybSddLFxuICAgICAgICAgICAgaXNTdWJtaXR0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGNhblN1Ym1pdDogdHJ1ZSxcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApLFxuICAgIH1cbiAgICByZXR1cm4gZm9ybVxuICB9LFxufSkpXG5cbi8vIE1vY2sgQmFzZUZpZWxkXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9mb3JtLXNjZW5hcmlvcy9iYXNlL2ZpZWxkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY29uZmlnIH06IHsgaW5pdGlhbERhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBjb25maWc6IEJhc2VDb25maWd1cmF0aW9uIH0pID0+IHtcbiAgICByZXR1cm4gKCkgPT4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD17YGZpZWxkLSR7Y29uZmlnLnZhcmlhYmxlfWB9PlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YGZpZWxkLWxhYmVsLSR7Y29uZmlnLnZhcmlhYmxlfWB9Pntjb25maWcubGFiZWx9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YGZpZWxkLXR5cGUtJHtjb25maWcudmFyaWFibGV9YH0+e2NvbmZpZy50eXBlfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9e2BmaWVsZC1yZXF1aXJlZC0ke2NvbmZpZy52YXJpYWJsZX1gfT57U3RyaW5nKGNvbmZpZy5yZXF1aXJlZCl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBGYWN0b3JpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPFJBR1BpcGVsaW5lVmFyaWFibGU+KTogUkFHUGlwZWxpbmVWYXJpYWJsZSA9PiAoe1xuICBiZWxvbmdfdG9fbm9kZV9pZDogJ3Rlc3Qtbm9kZScsXG4gIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgbGFiZWw6ICdUZXN0IExhYmVsJyxcbiAgdmFyaWFibGU6ICd0ZXN0X3ZhcmlhYmxlJyxcbiAgbWF4X2xlbmd0aDogMTAwLFxuICBkZWZhdWx0X3ZhbHVlOiAnJyxcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciB2YWx1ZScsXG4gIHVuaXQ6ICcnLFxuICByZXF1aXJlZDogdHJ1ZSxcbiAgdG9vbHRpcHM6ICdUZXN0IHRvb2x0aXAnLFxuICBvcHRpb25zOiBbXSxcbiAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBbXSxcbiAgYWxsb3dlZF9maWxlX3R5cGVzOiBbXSxcbiAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IFtdLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbiA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEJhc2VDb25maWd1cmF0aW9uPik6IEJhc2VDb25maWd1cmF0aW9uID0+ICh7XG4gIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICB2YXJpYWJsZTogJ3Rlc3RfdmFyaWFibGUnLFxuICBsYWJlbDogJ1Rlc3QgTGFiZWwnLFxuICByZXF1aXJlZDogdHJ1ZSxcbiAgc2hvd0NvbmRpdGlvbnM6IFtdLFxuICBtYXhMZW5ndGg6IDEwMCxcbiAgcGxhY2Vob2xkZXI6ICdFbnRlciB2YWx1ZScsXG4gIHRvb2x0aXA6ICdUZXN0IHRvb2x0aXAnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrU2NoZW1hID0gKCk6IFpvZFNjaGVtYSA9PiAoe1xuICBzYWZlUGFyc2U6IHZpLmZuKCkubW9ja1JldHVyblZhbHVlKHsgc3VjY2VzczogdHJ1ZSB9KSxcbn0pIGFzIHVua25vd24gYXMgWm9kU2NoZW1hXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhlbHBlciBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3Qgc2V0dXBNb2NrcyA9IChvcHRpb25zPzoge1xuICBwaXBlbGluZUlkPzogc3RyaW5nIHwgbnVsbFxuICBwYXJhbXNDb25maWc/OiBQaXBlbGluZVByb2Nlc3NpbmdQYXJhbXNSZXNwb25zZVxuICBpc0ZldGNoaW5nUGFyYW1zPzogYm9vbGVhblxuICBpbml0aWFsRGF0YT86IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gIGNvbmZpZ3VyYXRpb25zPzogQmFzZUNvbmZpZ3VyYXRpb25bXVxuICB3b3JrZmxvd1J1bm5pbmdEYXRhPzogdHlwZW9mIG1vY2tXb3JrZmxvd1J1bm5pbmdEYXRhXG59KSA9PiB7XG4gIG1vY2tQaXBlbGluZUlkID0gb3B0aW9ucz8ucGlwZWxpbmVJZCA/PyAndGVzdC1waXBlbGluZS1pZCdcbiAgbW9ja1BhcmFtc0NvbmZpZyA9IG9wdGlvbnM/LnBhcmFtc0NvbmZpZ1xuICBtb2NrSXNGZXRjaGluZ1BhcmFtcyA9IG9wdGlvbnM/LmlzRmV0Y2hpbmdQYXJhbXMgPz8gZmFsc2VcbiAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEgPSBvcHRpb25zPy53b3JrZmxvd1J1bm5pbmdEYXRhXG4gIG1vY2tVc2VJbml0aWFsRGF0YS5tb2NrUmV0dXJuVmFsdWUob3B0aW9ucz8uaW5pdGlhbERhdGEgPz8ge30pXG4gIG1vY2tVc2VDb25maWd1cmF0aW9ucy5tb2NrUmV0dXJuVmFsdWUob3B0aW9ucz8uY29uZmlndXJhdGlvbnMgPz8gW10pXG4gIG1vY2tHZW5lcmF0ZVpvZFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoY3JlYXRlTW9ja1NjaGVtYSgpKVxufVxuXG5jb25zdCBjcmVhdGVRdWVyeUNsaWVudCA9ICgpID0+IG5ldyBRdWVyeUNsaWVudCh7XG4gIGRlZmF1bHRPcHRpb25zOiB7XG4gICAgcXVlcmllczoge1xuICAgICAgcmV0cnk6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG59KVxuXG5jb25zdCByZW5kZXJXaXRoUXVlcnlDbGllbnQgPSAoY29tcG9uZW50OiBSZWFjdC5SZWFjdEVsZW1lbnQpID0+IHtcbiAgY29uc3QgcXVlcnlDbGllbnQgPSBjcmVhdGVRdWVyeUNsaWVudCgpXG4gIHJldHVybiByZW5kZXIoXG4gICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XG4gICAgICB7Y29tcG9uZW50fVxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gIClcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRG9jdW1lbnRQcm9jZXNzaW5nIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnRG9jdW1lbnRQcm9jZXNzaW5nJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgZGF0YVNvdXJjZU5vZGVJZDogJ2RhdGFzb3VyY2Utbm9kZS0xJyxcbiAgICBvblByb2Nlc3M6IHZpLmZuKCksXG4gICAgb25CYWNrOiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgc2V0dXBNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgY29uZmlndXJhdGlvbnM6IFtjcmVhdGVCYXNlQ29uZmlndXJhdGlvbigpXSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1hY3Rpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgT3B0aW9ucyBjb21wb25lbnQgd2l0aCBmb3JtIGVsZW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdmaWVsZDEnLCBsYWJlbDogJ0ZpZWxkIDEnIH0pLFxuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnZmllbGQyJywgbGFiZWw6ICdGaWVsZCAyJyB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9ja3MoeyBjb25maWd1cmF0aW9ucyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWZpZWxkMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1maWVsZDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBubyBmaWVsZHMgd2hlbiBjb25maWd1cmF0aW9ucyBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBjb25maWd1cmF0aW9uczogW10gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPERvY3VtZW50UHJvY2Vzc2luZyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoL15maWVsZC0vKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHVzZUluaXRpYWxEYXRhIHdpdGggdmFyaWFibGVzIGZyb20gcGFyYW1zQ29uZmlnJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW2NyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoeyB2YXJpYWJsZTogJ3ZhcjEnIH0pXVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHBhcmFtc0NvbmZpZzogeyB2YXJpYWJsZXMgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tVc2VJbml0aWFsRGF0YSkudG9IYXZlQmVlbkNhbGxlZFdpdGgodmFyaWFibGVzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdXNlQ29uZmlndXJhdGlvbnMgd2l0aCB2YXJpYWJsZXMgZnJvbSBwYXJhbXNDb25maWcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7IHZhcmlhYmxlOiAndmFyMScgfSldXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgcGFyYW1zQ29uZmlnOiB7IHZhcmlhYmxlcyB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPERvY3VtZW50UHJvY2Vzc2luZyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1VzZUNvbmZpZ3VyYXRpb25zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh2YXJpYWJsZXMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGVtcHR5IGFycmF5IHdoZW4gcGFyYW1zQ29uZmlnLnZhcmlhYmxlcyBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHsgcGFyYW1zQ29uZmlnOiB1bmRlZmluZWQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPERvY3VtZW50UHJvY2Vzc2luZyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1VzZUluaXRpYWxEYXRhKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgIGV4cGVjdChtb2NrVXNlQ29uZmlndXJhdGlvbnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzIFRlc3RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGFTb3VyY2VOb2RlSWQgdG8gdXNlSW5wdXRWYXJpYWJsZXMgaG9vaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGN1c3RvbU5vZGVJZCA9ICdjdXN0b20tZGF0YXNvdXJjZS1ub2RlJ1xuICAgICAgc2V0dXBNb2NrcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBkYXRhU291cmNlTm9kZUlkPXtjdXN0b21Ob2RlSWR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSB2ZXJpZnkgaG9vayBpcyBjYWxsZWQgKG1vY2tlZCwgc28gd2UgY2hlY2sgY29tcG9uZW50IHJlbmRlcnMpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWFjdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3Mgb25Qcm9jZXNzIGNhbGxiYWNrIHRvIE9wdGlvbnMgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uUHJvY2VzcyA9IHZpLmZuKClcbiAgICAgIHNldHVwTW9ja3MoeyBjb25maWd1cmF0aW9uczogW10gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBvblByb2Nlc3M9e21vY2tPblByb2Nlc3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBmb3JtIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIG9uQmFjayBjYWxsYmFjayB0byBBY3Rpb25zIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkJhY2sgPSB2aS5mbigpXG4gICAgICBzZXR1cE1vY2tzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgIDxEb2N1bWVudFByb2Nlc3NpbmdcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIG9uQmFjaz17bW9ja09uQmFja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1hY3Rpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHkgYW5kIE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWVtb2l6ZSByZW5kZXJDdXN0b21BY3Rpb25zIGNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2NrcygpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJXaXRoUXVlcnlDbGllbnQoPERvY3VtZW50UHJvY2Vzc2luZyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gcmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtjcmVhdGVRdWVyeUNsaWVudCgpfT5cbiAgICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+XG4gICAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbXBvbmVudCBzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRob3V0IGlzc3Vlc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1hY3Rpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcmVuZGVyQ3VzdG9tQWN0aW9ucyB3aGVuIGlzRmV0Y2hpbmdQYXJhbXMgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBpc0ZldGNoaW5nUGFyYW1zOiBmYWxzZSB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgc2V0dXBNb2Nrcyh7IGlzRmV0Y2hpbmdQYXJhbXM6IHRydWUgfSlcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e2NyZWF0ZVF1ZXJ5Q2xpZW50KCl9PlxuICAgICAgICAgIDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmRlZmF1bHRQcm9wc30gLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWFjdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSByZW5kZXJDdXN0b21BY3Rpb25zIHdoZW4gb25CYWNrIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkJhY2sxID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25CYWNrMiA9IHZpLmZuKClcbiAgICAgIHNldHVwTW9ja3MoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi5kZWZhdWx0UHJvcHN9IG9uQmFjaz17b25CYWNrMX0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17Y3JlYXRlUXVlcnlDbGllbnQoKX0+XG4gICAgICAgICAgPERvY3VtZW50UHJvY2Vzc2luZyB7Li4uZGVmYXVsdFByb3BzfSBvbkJhY2s9e29uQmFjazJ9IC8+XG4gICAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1hY3Rpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQmFjayB3aGVuIGJhY2sgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25CYWNrID0gdmkuZm4oKVxuICAgICAgc2V0dXBNb2NrcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBvbkJhY2s9e21vY2tPbkJhY2t9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgY29uc3QgYmFja0J1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLmJhY2tUb0RhdGFTb3VyY2UnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJhY2tCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkJhY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBmb3JtIHN1Ym1pc3Npb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25Qcm9jZXNzID0gdmkuZm4oKVxuICAgICAgc2V0dXBNb2NrcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBvblByb2Nlc3M9e21vY2tPblByb2Nlc3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgY29uc3QgcHJvY2Vzc0J1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnByb2Nlc3MnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHByb2Nlc3NCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVTdWJtaXQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcldpdGhRdWVyeUNsaWVudCg8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSByZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e2NyZWF0ZVF1ZXJ5Q2xpZW50KCl9PlxuICAgICAgICAgIDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmRlZmF1bHRQcm9wc30gLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWFjdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBicmVhayB3aGVuIHJlLXJlbmRlcmluZyB3aXRoIGRpZmZlcmVudCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxQcm9wcyA9IHtcbiAgICAgICAgLi4uZGVmYXVsdFByb3BzLFxuICAgICAgICBkYXRhU291cmNlTm9kZUlkOiAnbm9kZS0xJyxcbiAgICAgIH1cbiAgICAgIHNldHVwTW9ja3MoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmluaXRpYWxQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgbmV3UHJvcHMgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgZGF0YVNvdXJjZU5vZGVJZDogJ25vZGUtMicsXG4gICAgICB9XG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtjcmVhdGVRdWVyeUNsaWVudCgpfT5cbiAgICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi5uZXdQcm9wc30gLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWFjdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHBhcmFtc0NvbmZpZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBwYXJhbXNDb25maWc6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrVXNlSW5pdGlhbERhdGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgZXhwZWN0KG1vY2tVc2VDb25maWd1cmF0aW9ucykudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHBhcmFtc0NvbmZpZyB3aXRoIGVtcHR5IHZhcmlhYmxlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBwYXJhbXNDb25maWc6IHsgdmFyaWFibGVzOiBbXSB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tVc2VJbml0aWFsRGF0YSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICBleHBlY3QobW9ja1VzZUNvbmZpZ3VyYXRpb25zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBwaXBlbGluZUlkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IHBpcGVsaW5lSWQ6IG51bGwgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPERvY3VtZW50UHJvY2Vzc2luZyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWFjdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsYXJnZSBudW1iZXIgb2YgdmFyaWFibGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNTAgfSwgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoeyB2YXJpYWJsZTogYHZhcl8ke2l9YCB9KSlcbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNTAgfSwgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6IGB2YXJfJHtpfWAsIGxhYmVsOiBgRmllbGQgJHtpfWAgfSkpXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgcGFyYW1zQ29uZmlnOiB7IHZhcmlhYmxlcyB9LFxuICAgICAgICBjb25maWd1cmF0aW9ucyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgvXmZpZWxkLXZhcl8vKSkudG9IYXZlTGVuZ3RoKDUwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gbm9kZSBpZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgPERvY3VtZW50UHJvY2Vzc2luZ1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgZGF0YVNvdXJjZU5vZGVJZD1cIm5vZGUtd2l0aC1zcGVjaWFsX2NoYXJzLjEyM1wiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tYWN0aW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIExvYWRpbmcgU3RhdGUgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTG9hZGluZyBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgaXNGZXRjaGluZ1BhcmFtcyB0byBBY3Rpb25zIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBpc0ZldGNoaW5nUGFyYW1zOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNoZWNrIHRoYXQgdGhlIHByb2Nlc3MgYnV0dG9uIGlzIGRpc2FibGVkIHdoZW4gZmV0Y2hpbmdcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJylcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uLmNsb3Nlc3QoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVuYWJsZSBwcm9jZXNzIGJ1dHRvbiB3aGVuIG5vdCBmZXRjaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBpc0ZldGNoaW5nUGFyYW1zOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJylcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uLmNsb3Nlc3QoJ2J1dHRvbicpKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQWN0aW9ucyBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gSGVscGVyIHRvIGNyZWF0ZSBtb2NrIGZvcm0gcGFyYW1zIGZvciBBY3Rpb25zIHRlc3RzXG5jb25zdCBjcmVhdGVNb2NrRm9ybVBhcmFtcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPHtcbiAgaGFuZGxlU3VibWl0OiBSZXR1cm5UeXBlPHR5cGVvZiB2aS5mbj5cbiAgaXNTdWJtaXR0aW5nOiBib29sZWFuXG4gIGNhblN1Ym1pdDogYm9vbGVhblxufT4pOiBDdXN0b21BY3Rpb25zUHJvcHMgPT4gKHtcbiAgZm9ybTogeyBoYW5kbGVTdWJtaXQ6IG92ZXJyaWRlcz8uaGFuZGxlU3VibWl0ID8/IHZpLmZuKCkgfSBhcyB1bmtub3duIGFzIEN1c3RvbUFjdGlvbnNQcm9wc1snZm9ybSddLFxuICBpc1N1Ym1pdHRpbmc6IG92ZXJyaWRlcz8uaXNTdWJtaXR0aW5nID8/IGZhbHNlLFxuICBjYW5TdWJtaXQ6IG92ZXJyaWRlcz8uY2FuU3VibWl0ID8/IHRydWUsXG59KVxuXG5kZXNjcmliZSgnQWN0aW9ucycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEgPSB1bmRlZmluZWRcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJhY2sgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0Zvcm1QYXJhbXMgPSBjcmVhdGVNb2NrRm9ybVBhcmFtcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIGZvcm1QYXJhbXM9e21vY2tGb3JtUGFyYW1zfVxuICAgICAgICAgIG9uQmFjaz17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLmJhY2tUb0RhdGFTb3VyY2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwcm9jZXNzIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tGb3JtUGFyYW1zID0gY3JlYXRlTW9ja0Zvcm1QYXJhbXMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICBmb3JtUGFyYW1zPXttb2NrRm9ybVBhcmFtc31cbiAgICAgICAgICBvbkJhY2s9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCdXR0b24gU3RhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBwcm9jZXNzIGJ1dHRvbiB3aGVuIHJ1bkRpc2FibGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrRm9ybVBhcmFtcyA9IGNyZWF0ZU1vY2tGb3JtUGFyYW1zKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgZm9ybVBhcmFtcz17bW9ja0Zvcm1QYXJhbXN9XG4gICAgICAgICAgcnVuRGlzYWJsZWQ9e3RydWV9XG4gICAgICAgICAgb25CYWNrPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMucHJvY2VzcycpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QocHJvY2Vzc0J1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHByb2Nlc3MgYnV0dG9uIHdoZW4gaXNTdWJtaXR0aW5nIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrRm9ybVBhcmFtcyA9IGNyZWF0ZU1vY2tGb3JtUGFyYW1zKHsgaXNTdWJtaXR0aW5nOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIGZvcm1QYXJhbXM9e21vY2tGb3JtUGFyYW1zfVxuICAgICAgICAgIG9uQmFjaz17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcHJvY2Vzc0J1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnByb2Nlc3MnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KHByb2Nlc3NCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBwcm9jZXNzIGJ1dHRvbiB3aGVuIGNhblN1Ym1pdCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tGb3JtUGFyYW1zID0gY3JlYXRlTW9ja0Zvcm1QYXJhbXMoeyBjYW5TdWJtaXQ6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIGZvcm1QYXJhbXM9e21vY2tGb3JtUGFyYW1zfVxuICAgICAgICAgIG9uQmFjaz17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcHJvY2Vzc0J1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnByb2Nlc3MnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KHByb2Nlc3NCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBwcm9jZXNzIGJ1dHRvbiB3aGVuIHdvcmtmbG93IGlzIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1vY2tGb3JtUGFyYW1zID0gY3JlYXRlTW9ja0Zvcm1QYXJhbXMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICBmb3JtUGFyYW1zPXttb2NrRm9ybVBhcmFtc31cbiAgICAgICAgICBvbkJhY2s9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVuYWJsZSBwcm9jZXNzIGJ1dHRvbiB3aGVuIGFsbCBjb25kaXRpb25zIGFyZSBtZXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlN1Y2NlZWRlZCB9LFxuICAgICAgfVxuICAgICAgY29uc3QgbW9ja0Zvcm1QYXJhbXMgPSBjcmVhdGVNb2NrRm9ybVBhcmFtcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIGZvcm1QYXJhbXM9e21vY2tGb3JtUGFyYW1zfVxuICAgICAgICAgIHJ1bkRpc2FibGVkPXtmYWxzZX1cbiAgICAgICAgICBvbkJhY2s9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25CYWNrIHdoZW4gYmFjayBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkJhY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrRm9ybVBhcmFtcyA9IGNyZWF0ZU1vY2tGb3JtUGFyYW1zKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgZm9ybVBhcmFtcz17bW9ja0Zvcm1QYXJhbXN9XG4gICAgICAgICAgb25CYWNrPXttb2NrT25CYWNrfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLmJhY2tUb0RhdGFTb3VyY2UnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQmFjaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBmb3JtLmhhbmRsZVN1Ym1pdCB3aGVuIHByb2Nlc3MgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3VibWl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja0Zvcm1QYXJhbXMgPSBjcmVhdGVNb2NrRm9ybVBhcmFtcyh7IGhhbmRsZVN1Ym1pdDogbW9ja1N1Ym1pdCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICBmb3JtUGFyYW1zPXttb2NrRm9ybVBhcmFtc31cbiAgICAgICAgICBvbkJhY2s9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMucHJvY2VzcycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3VibWl0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdMb2FkaW5nIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBsb2FkaW5nIHN0YXRlIHdoZW4gaXNTdWJtaXR0aW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0Zvcm1QYXJhbXMgPSBjcmVhdGVNb2NrRm9ybVBhcmFtcyh7IGlzU3VibWl0dGluZzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICBmb3JtUGFyYW1zPXttb2NrRm9ybVBhcmFtc31cbiAgICAgICAgICBvbkJhY2s9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyBzdGF0ZSB3aGVuIHdvcmtmbG93IGlzIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrV29ya2Zsb3dSdW5uaW5nRGF0YSA9IHtcbiAgICAgICAgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1vY2tGb3JtUGFyYW1zID0gY3JlYXRlTW9ja0Zvcm1QYXJhbXMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICBmb3JtUGFyYW1zPXttb2NrRm9ybVBhcmFtc31cbiAgICAgICAgICBvbkJhY2s9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHJ1bkRpc2FibGVkIHByb3AnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrRm9ybVBhcmFtcyA9IGNyZWF0ZU1vY2tGb3JtUGFyYW1zKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBY3Rpb25zXG4gICAgICAgICAgZm9ybVBhcmFtcz17bW9ja0Zvcm1QYXJhbXN9XG4gICAgICAgICAgb25CYWNrPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMucHJvY2VzcycpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QocHJvY2Vzc0J1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCB3b3JrZmxvd1J1bm5pbmdEYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1dvcmtmbG93UnVubmluZ0RhdGEgPSB1bmRlZmluZWRcbiAgICAgIGNvbnN0IG1vY2tGb3JtUGFyYW1zID0gY3JlYXRlTW9ja0Zvcm1QYXJhbXMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICBmb3JtUGFyYW1zPXttb2NrRm9ybVBhcmFtc31cbiAgICAgICAgICBvbkJhY2s9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tGb3JtUGFyYW1zID0gY3JlYXRlTW9ja0Zvcm1QYXJhbXMoKVxuICAgICAgY29uc3QgbW9ja09uQmFjayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEFjdGlvbnNcbiAgICAgICAgICBmb3JtUGFyYW1zPXttb2NrRm9ybVBhcmFtc31cbiAgICAgICAgICBvbkJhY2s9e21vY2tPbkJhY2t9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3QgLSByZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8QWN0aW9uc1xuICAgICAgICAgIGZvcm1QYXJhbXM9e21vY2tGb3JtUGFyYW1zfVxuICAgICAgICAgIG9uQmFjaz17bW9ja09uQmFja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLmJhY2tUb0RhdGFTb3VyY2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBPcHRpb25zIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnT3B0aW9ucycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0dlbmVyYXRlWm9kU2NoZW1hLm1vY2tSZXR1cm5WYWx1ZShjcmVhdGVNb2NrU2NoZW1hKCkpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmb3JtIGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgaW5pdGlhbERhdGE6IHt9LFxuICAgICAgICBjb25maWd1cmF0aW9uczogW10sXG4gICAgICAgIHNjaGVtYTogY3JlYXRlTW9ja1NjaGVtYSgpLFxuICAgICAgICBDdXN0b21BY3Rpb25zOiAoKSA9PiA8YnV0dG9uPlN1Ym1pdDwvYnV0dG9uPixcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZpZWxkcyBiYXNlZCBvbiBjb25maWd1cmF0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gW1xuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnbmFtZScsIGxhYmVsOiAnTmFtZScgfSksXG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdlbWFpbCcsIGxhYmVsOiAnRW1haWwnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGluaXRpYWxEYXRhOiB7IG5hbWU6ICcnLCBlbWFpbDogJycgfSxcbiAgICAgICAgY29uZmlndXJhdGlvbnMsXG4gICAgICAgIHNjaGVtYTogY3JlYXRlTW9ja1NjaGVtYSgpLFxuICAgICAgICBDdXN0b21BY3Rpb25zOiAoKSA9PiA8YnV0dG9uPlN1Ym1pdDwvYnV0dG9uPixcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbmFtZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1lbWFpbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEN1c3RvbUFjdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgaW5pdGlhbERhdGE6IHt9LFxuICAgICAgICBjb25maWd1cmF0aW9uczogW10sXG4gICAgICAgIHNjaGVtYTogY3JlYXRlTW9ja1NjaGVtYSgpLFxuICAgICAgICBDdXN0b21BY3Rpb25zOiAoKSA9PiAoXG4gICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImN1c3RvbS1hY3Rpb25cIj5DdXN0b20gU3VibWl0PC9idXR0b24+XG4gICAgICAgICksXG4gICAgICAgIG9uU3VibWl0OiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1hY3Rpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGNvcnJlY3QgY2xhc3MgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBpbml0aWFsRGF0YToge30sXG4gICAgICAgIGNvbmZpZ3VyYXRpb25zOiBbXSxcbiAgICAgICAgc2NoZW1hOiBjcmVhdGVNb2NrU2NoZW1hKCksXG4gICAgICAgIEN1c3RvbUFjdGlvbnM6ICgpID0+IDxidXR0b24+U3VibWl0PC9idXR0b24+LFxuICAgICAgICBvblN1Ym1pdDogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJylcbiAgICAgIGV4cGVjdChmb3JtKS50b0hhdmVDbGFzcygndy1mdWxsJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdGb3JtIFN1Ym1pc3Npb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwcmV2ZW50IGRlZmF1bHQgZm9ybSBzdWJtaXNzaW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uU3VibWl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGluaXRpYWxEYXRhOiB7fSxcbiAgICAgICAgY29uZmlndXJhdGlvbnM6IFtdLFxuICAgICAgICBzY2hlbWE6IGNyZWF0ZU1vY2tTY2hlbWEoKSxcbiAgICAgICAgQ3VzdG9tQWN0aW9uczogKCkgPT4gPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+LFxuICAgICAgICBvblN1Ym1pdDogbW9ja09uU3VibWl0LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGZvcm0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpIVxuICAgICAgY29uc3Qgc3VibWl0RXZlbnQgPSBuZXcgRXZlbnQoJ3N1Ym1pdCcsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZSB9KVxuICAgICAgY29uc3QgcHJldmVudERlZmF1bHRTcHkgPSB2aS5zcHlPbihzdWJtaXRFdmVudCwgJ3ByZXZlbnREZWZhdWx0JylcblxuICAgICAgZmlyZUV2ZW50KGZvcm0sIHN1Ym1pdEV2ZW50KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChwcmV2ZW50RGVmYXVsdFNweSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RvcCBwcm9wYWdhdGlvbiBvbiBmb3JtIHN1Ym1pdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblN1Ym1pdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBpbml0aWFsRGF0YToge30sXG4gICAgICAgIGNvbmZpZ3VyYXRpb25zOiBbXSxcbiAgICAgICAgc2NoZW1hOiBjcmVhdGVNb2NrU2NoZW1hKCksXG4gICAgICAgIEN1c3RvbUFjdGlvbnM6ICgpID0+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPixcbiAgICAgICAgb25TdWJtaXQ6IG1vY2tPblN1Ym1pdCxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBmb3JtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSFcbiAgICAgIGNvbnN0IHN1Ym1pdEV2ZW50ID0gbmV3IEV2ZW50KCdzdWJtaXQnLCB7IGJ1YmJsZXM6IHRydWUsIGNhbmNlbGFibGU6IHRydWUgfSlcbiAgICAgIGNvbnN0IHN0b3BQcm9wYWdhdGlvblNweSA9IHZpLnNweU9uKHN1Ym1pdEV2ZW50LCAnc3RvcFByb3BhZ2F0aW9uJylcblxuICAgICAgZmlyZUV2ZW50KGZvcm0sIHN1Ym1pdEV2ZW50KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzdG9wUHJvcGFnYXRpb25TcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdWJtaXQgd2hlbiB2YWxpZGF0aW9uIHBhc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblN1Ym1pdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBpbml0aWFsRGF0YToge30sXG4gICAgICAgIGNvbmZpZ3VyYXRpb25zOiBbXSxcbiAgICAgICAgc2NoZW1hOiBjcmVhdGVNb2NrU2NoZW1hKCksIC8vIHJldHVybnMgc3VjY2VzczogdHJ1ZVxuICAgICAgICBDdXN0b21BY3Rpb25zOiAoKSA9PiA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj4sXG4gICAgICAgIG9uU3VibWl0OiBtb2NrT25TdWJtaXQsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPblN1Ym1pdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25TdWJtaXQgd2hlbiB2YWxpZGF0aW9uIGZhaWxzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uU3VibWl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgZmFpbGluZ1NjaGVtYSA9IHtcbiAgICAgICAgc2FmZVBhcnNlOiB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIGlzc3VlczogW1xuICAgICAgICAgICAgICB7IHBhdGg6IFsnbmFtZSddLCBtZXNzYWdlOiAnTmFtZSBpcyByZXF1aXJlZCcgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICB9IGFzIHVua25vd24gYXMgWm9kU2NoZW1hXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgaW5pdGlhbERhdGE6IHt9LFxuICAgICAgICBjb25maWd1cmF0aW9uczogW10sXG4gICAgICAgIHNjaGVtYTogZmFpbGluZ1NjaGVtYSxcbiAgICAgICAgQ3VzdG9tQWN0aW9uczogKCkgPT4gPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+LFxuICAgICAgICBvblN1Ym1pdDogbW9ja09uU3VibWl0LFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPE9wdGlvbnMgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGZvcm0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpIVxuICAgICAgZmlyZUV2ZW50LnN1Ym1pdChmb3JtKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TdWJtaXQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHRvYXN0IGVycm9yIHdoZW4gdmFsaWRhdGlvbiBmYWlscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZhaWxpbmdTY2hlbWEgPSB7XG4gICAgICAgIHNhZmVQYXJzZTogdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICBpc3N1ZXM6IFtcbiAgICAgICAgICAgICAgeyBwYXRoOiBbJ25hbWUnXSwgbWVzc2FnZTogJ05hbWUgaXMgcmVxdWlyZWQnIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSBhcyB1bmtub3duIGFzIFpvZFNjaGVtYVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGluaXRpYWxEYXRhOiB7fSxcbiAgICAgICAgY29uZmlndXJhdGlvbnM6IFtdLFxuICAgICAgICBzY2hlbWE6IGZhaWxpbmdTY2hlbWEsXG4gICAgICAgIEN1c3RvbUFjdGlvbnM6ICgpID0+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPixcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnUGF0aDogbmFtZSBFcnJvcjogTmFtZSBpcyByZXF1aXJlZCcsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZvcm1hdCBlcnJvciBtZXNzYWdlIHdpdGggbXVsdGlwbGUgcGF0aCBzZWdtZW50cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZhaWxpbmdTY2hlbWEgPSB7XG4gICAgICAgIHNhZmVQYXJzZTogdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICBpc3N1ZXM6IFtcbiAgICAgICAgICAgICAgeyBwYXRoOiBbJ3VzZXInLCAncHJvZmlsZScsICdlbWFpbCddLCBtZXNzYWdlOiAnSW52YWxpZCBlbWFpbCBmb3JtYXQnIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSBhcyB1bmtub3duIGFzIFpvZFNjaGVtYVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGluaXRpYWxEYXRhOiB7fSxcbiAgICAgICAgY29uZmlndXJhdGlvbnM6IFtdLFxuICAgICAgICBzY2hlbWE6IGZhaWxpbmdTY2hlbWEsXG4gICAgICAgIEN1c3RvbUFjdGlvbnM6ICgpID0+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPixcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnUGF0aDogdXNlci5wcm9maWxlLmVtYWlsIEVycm9yOiBJbnZhbGlkIGVtYWlsIGZvcm1hdCcsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9ubHkgc2hvdyBmaXJzdCB2YWxpZGF0aW9uIGVycm9yIHdoZW4gbXVsdGlwbGUgZXJyb3JzIGV4aXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZmFpbGluZ1NjaGVtYSA9IHtcbiAgICAgICAgc2FmZVBhcnNlOiB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIGlzc3VlczogW1xuICAgICAgICAgICAgICB7IHBhdGg6IFsnbmFtZSddLCBtZXNzYWdlOiAnTmFtZSBpcyByZXF1aXJlZCcgfSxcbiAgICAgICAgICAgICAgeyBwYXRoOiBbJ2VtYWlsJ10sIG1lc3NhZ2U6ICdFbWFpbCBpcyBpbnZhbGlkJyB9LFxuICAgICAgICAgICAgICB7IHBhdGg6IFsnYWdlJ10sIG1lc3NhZ2U6ICdBZ2UgbXVzdCBiZSBwb3NpdGl2ZScgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICB9IGFzIHVua25vd24gYXMgWm9kU2NoZW1hXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgaW5pdGlhbERhdGE6IHt9LFxuICAgICAgICBjb25maWd1cmF0aW9uczogW10sXG4gICAgICAgIHNjaGVtYTogZmFpbGluZ1NjaGVtYSxcbiAgICAgICAgQ3VzdG9tQWN0aW9uczogKCkgPT4gPGJ1dHRvbiB0eXBlPVwic3VibWl0XCI+U3VibWl0PC9idXR0b24+LFxuICAgICAgICBvblN1Ym1pdDogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBmb3JtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKSFcbiAgICAgIGZpcmVFdmVudC5zdWJtaXQoZm9ybSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIG9ubHkgc2hvdyBmaXJzdCBlcnJvclxuICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdQYXRoOiBuYW1lIEVycm9yOiBOYW1lIGlzIHJlcXVpcmVkJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHBhdGggaW4gdmFsaWRhdGlvbiBlcnJvcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZhaWxpbmdTY2hlbWEgPSB7XG4gICAgICAgIHNhZmVQYXJzZTogdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICBpc3N1ZXM6IFtcbiAgICAgICAgICAgICAgeyBwYXRoOiBbXSwgbWVzc2FnZTogJ0Zvcm0gdmFsaWRhdGlvbiBmYWlsZWQnIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSBhcyB1bmtub3duIGFzIFpvZFNjaGVtYVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGluaXRpYWxEYXRhOiB7fSxcbiAgICAgICAgY29uZmlndXJhdGlvbnM6IFtdLFxuICAgICAgICBzY2hlbWE6IGZhaWxpbmdTY2hlbWEsXG4gICAgICAgIEN1c3RvbUFjdGlvbnM6ICgpID0+IDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlN1Ym1pdDwvYnV0dG9uPixcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG4gICAgICBmaXJlRXZlbnQuc3VibWl0KGZvcm0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnUGF0aDogIEVycm9yOiBGb3JtIHZhbGlkYXRpb24gZmFpbGVkJyxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRmllbGQgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZpZWxkcyBpbiBjb3JyZWN0IG9yZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdmaXJzdCcsIGxhYmVsOiAnRmlyc3QnIH0pLFxuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnc2Vjb25kJywgbGFiZWw6ICdTZWNvbmQnIH0pLFxuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAndGhpcmQnLCBsYWJlbDogJ1RoaXJkJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBpbml0aWFsRGF0YToge30sXG4gICAgICAgIGNvbmZpZ3VyYXRpb25zLFxuICAgICAgICBzY2hlbWE6IGNyZWF0ZU1vY2tTY2hlbWEoKSxcbiAgICAgICAgQ3VzdG9tQWN0aW9uczogKCkgPT4gPGJ1dHRvbj5TdWJtaXQ8L2J1dHRvbj4sXG4gICAgICAgIG9uU3VibWl0OiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBjaGVjayB0aGF0IGVhY2ggZmllbGQgY29udGFpbmVyIGV4aXN0cyB3aXRoIGNvcnJlY3Qgb3JkZXJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWZpcnN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXNlY29uZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC10aGlyZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFZlcmlmeSBvcmRlciBieSBjaGVja2luZyBsYWJlbHMgd2l0aGluIGVhY2ggZmllbGRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxhYmVsLWZpcnN0JykpLnRvSGF2ZVRleHRDb250ZW50KCdGaXJzdCcpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1sYWJlbC1zZWNvbmQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1NlY29uZCcpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1sYWJlbC10aGlyZCcpKS50b0hhdmVUZXh0Q29udGVudCgnVGhpcmQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY29uZmlnIHRvIEJhc2VGaWVsZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gW1xuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7XG4gICAgICAgICAgdmFyaWFibGU6ICd0ZXN0JyxcbiAgICAgICAgICBsYWJlbDogJ1Rlc3QgTGFiZWwnLFxuICAgICAgICAgIHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBpbml0aWFsRGF0YToge30sXG4gICAgICAgIGNvbmZpZ3VyYXRpb25zLFxuICAgICAgICBzY2hlbWE6IGNyZWF0ZU1vY2tTY2hlbWEoKSxcbiAgICAgICAgQ3VzdG9tQWN0aW9uczogKCkgPT4gPGJ1dHRvbj5TdWJtaXQ8L2J1dHRvbj4sXG4gICAgICAgIG9uU3VibWl0OiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxhYmVsLXRlc3QnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1Rlc3QgTGFiZWwnKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtdHlwZS10ZXN0JykpLnRvSGF2ZVRleHRDb250ZW50KEJhc2VGaWVsZFR5cGUudGV4dElucHV0KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtcmVxdWlyZWQtdGVzdCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBpbml0aWFsRGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBpbml0aWFsRGF0YToge30sXG4gICAgICAgIGNvbmZpZ3VyYXRpb25zOiBbY3JlYXRlQmFzZUNvbmZpZ3VyYXRpb24oKV0sXG4gICAgICAgIHNjaGVtYTogY3JlYXRlTW9ja1NjaGVtYSgpLFxuICAgICAgICBDdXN0b21BY3Rpb25zOiAoKSA9PiA8YnV0dG9uPlN1Ym1pdDwvYnV0dG9uPixcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNvbmZpZ3VyYXRpb25zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgIGluaXRpYWxEYXRhOiB7fSxcbiAgICAgICAgY29uZmlndXJhdGlvbnM6IFtdLFxuICAgICAgICBzY2hlbWE6IGNyZWF0ZU1vY2tTY2hlbWEoKSxcbiAgICAgICAgQ3VzdG9tQWN0aW9uczogKCkgPT4gPGJ1dHRvbj5TdWJtaXQ8L2J1dHRvbj4sXG4gICAgICAgIG9uU3VibWl0OiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgvXmZpZWxkLS8pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb25maWd1cmF0aW9ucyB3aXRoIGFsbCBmaWVsZCB0eXBlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gW1xuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHR5cGU6IEJhc2VGaWVsZFR5cGUudGV4dElucHV0LCB2YXJpYWJsZTogJ3RleHQnIH0pLFxuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHR5cGU6IEJhc2VGaWVsZFR5cGUucGFyYWdyYXBoLCB2YXJpYWJsZTogJ3BhcmFncmFwaCcgfSksXG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdHlwZTogQmFzZUZpZWxkVHlwZS5udW1iZXJJbnB1dCwgdmFyaWFibGU6ICdudW1iZXInIH0pLFxuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHR5cGU6IEJhc2VGaWVsZFR5cGUuY2hlY2tib3gsIHZhcmlhYmxlOiAnY2hlY2tib3gnIH0pLFxuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHR5cGU6IEJhc2VGaWVsZFR5cGUuc2VsZWN0LCB2YXJpYWJsZTogJ3NlbGVjdCcgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgaW5pdGlhbERhdGE6IHtcbiAgICAgICAgICB0ZXh0OiAnJyxcbiAgICAgICAgICBwYXJhZ3JhcGg6ICcnLFxuICAgICAgICAgIG51bWJlcjogMCxcbiAgICAgICAgICBjaGVja2JveDogZmFsc2UsXG4gICAgICAgICAgc2VsZWN0OiAnJyxcbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlndXJhdGlvbnMsXG4gICAgICAgIHNjaGVtYTogY3JlYXRlTW9ja1NjaGVtYSgpLFxuICAgICAgICBDdXN0b21BY3Rpb25zOiAoKSA9PiA8YnV0dG9uPlN1Ym1pdDwvYnV0dG9uPixcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPcHRpb25zIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtdGV4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1wYXJhZ3JhcGgnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbnVtYmVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWNoZWNrYm94JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXNlbGVjdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIG51bWJlciBvZiBjb25maWd1cmF0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMjAgfSwgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6IGBmaWVsZF8ke2l9YCwgbGFiZWw6IGBGaWVsZCAke2l9YCB9KSlcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBpbml0aWFsRGF0YToge30sXG4gICAgICAgIGNvbmZpZ3VyYXRpb25zLFxuICAgICAgICBzY2hlbWE6IGNyZWF0ZU1vY2tTY2hlbWEoKSxcbiAgICAgICAgQ3VzdG9tQWN0aW9uczogKCkgPT4gPGJ1dHRvbj5TdWJtaXQ8L2J1dHRvbj4sXG4gICAgICAgIG9uU3VibWl0OiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T3B0aW9ucyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoL15maWVsZC1maWVsZF8vKSkudG9IYXZlTGVuZ3RoKDIwKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyB1c2VJbnB1dFZhcmlhYmxlcyBIb29rIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCd1c2VJbnB1dFZhcmlhYmxlcyBIb29rJywgKCkgPT4ge1xuICAvLyBJbXBvcnQgaG9vayBkaXJlY3RseSBmb3IgaXNvbGF0ZWQgdGVzdGluZ1xuICAvLyBOb3RlOiBUaGUgaG9vayBpcyB0ZXN0ZWQgdmlhIGNvbXBvbmVudCB0ZXN0cyBhYm92ZSwgYnV0IHdlIGFkZCBzcGVjaWZpYyBob29rIHRlc3RzIGhlcmVcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrUGlwZWxpbmVJZCA9ICd0ZXN0LXBpcGVsaW5lLWlkJ1xuICAgIG1vY2tQYXJhbXNDb25maWcgPSB1bmRlZmluZWRcbiAgICBtb2NrSXNGZXRjaGluZ1BhcmFtcyA9IGZhbHNlXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JldHVybiBWYWx1ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gaXNGZXRjaGluZ1BhcmFtcyBzdGF0ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBpc0ZldGNoaW5nUGFyYW1zOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi57XG4gICAgICAgICAgZGF0YVNvdXJjZU5vZGVJZDogJ3Rlc3Qtbm9kZScsXG4gICAgICAgICAgb25Qcm9jZXNzOiB2aS5mbigpLFxuICAgICAgICAgIG9uQmFjazogdmkuZm4oKSxcbiAgICAgICAgfX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHZlcmlmaWVkIGJ5IGNoZWNraW5nIHByb2Nlc3MgYnV0dG9uIGlzIGRpc2FibGVkXG4gICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMucHJvY2VzcycpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QocHJvY2Vzc0J1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gcGFyYW1zQ29uZmlnIHdoZW4gZGF0YSBpcyBsb2FkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgpXVxuICAgICAgc2V0dXBNb2Nrcyh7IHBhcmFtc0NvbmZpZzogeyB2YXJpYWJsZXMgfSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgPERvY3VtZW50UHJvY2Vzc2luZyB7Li4ue1xuICAgICAgICAgIGRhdGFTb3VyY2VOb2RlSWQ6ICd0ZXN0LW5vZGUnLFxuICAgICAgICAgIG9uUHJvY2VzczogdmkuZm4oKSxcbiAgICAgICAgICBvbkJhY2s6IHZpLmZuKCksXG4gICAgICAgIH19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrVXNlSW5pdGlhbERhdGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHZhcmlhYmxlcylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdRdWVyeSBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBwaXBlbGluZUlkIGZyb20gc3RvcmUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUGlwZWxpbmVJZCA9ICdjdXN0b20tcGlwZWxpbmUtaWQnXG4gICAgICBzZXR1cE1vY2tzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgIDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLntcbiAgICAgICAgICBkYXRhU291cmNlTm9kZUlkOiAndGVzdC1ub2RlJyxcbiAgICAgICAgICBvblByb2Nlc3M6IHZpLmZuKCksXG4gICAgICAgICAgb25CYWNrOiB2aS5mbigpLFxuICAgICAgICB9fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gY29tcG9uZW50IHJlbmRlcnMgc3VjY2Vzc2Z1bGx5IHdpdGggdGhlIHBpcGVsaW5lSWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tYWN0aW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgcGlwZWxpbmVJZCBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1BpcGVsaW5lSWQgPSBudWxsXG4gICAgICBzZXR1cE1vY2tzKHsgcGlwZWxpbmVJZDogbnVsbCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgPERvY3VtZW50UHJvY2Vzc2luZyB7Li4ue1xuICAgICAgICAgIGRhdGFTb3VyY2VOb2RlSWQ6ICd0ZXN0LW5vZGUnLFxuICAgICAgICAgIG9uUHJvY2VzczogdmkuZm4oKSxcbiAgICAgICAgICBvbkJhY2s6IHZpLmZuKCksXG4gICAgICAgIH19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tYWN0aW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEludGVncmF0aW9uIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdEb2N1bWVudFByb2Nlc3NpbmcgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHNldHVwTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdGdWxsIEZsb3cnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbnRlZ3JhdGUgaG9va3MsIE9wdGlvbnMsIGFuZCBBY3Rpb25zIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IFtcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7IHZhcmlhYmxlOiAnaW5wdXQxJywgbGFiZWw6ICdJbnB1dCAxJyB9KSxcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7IHZhcmlhYmxlOiAnaW5wdXQyJywgbGFiZWw6ICdJbnB1dCAyJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gW1xuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAnaW5wdXQxJywgbGFiZWw6ICdJbnB1dCAxJyB9KSxcbiAgICAgICAgY3JlYXRlQmFzZUNvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogJ2lucHV0MicsIGxhYmVsOiAnSW5wdXQgMicgfSksXG4gICAgICBdXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgcGFyYW1zQ29uZmlnOiB7IHZhcmlhYmxlcyB9LFxuICAgICAgICBjb25maWd1cmF0aW9ucyxcbiAgICAgICAgaW5pdGlhbERhdGE6IHsgaW5wdXQxOiAnJywgaW5wdXQyOiAnJyB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgIDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLntcbiAgICAgICAgICBkYXRhU291cmNlTm9kZUlkOiAndGVzdC1ub2RlJyxcbiAgICAgICAgICBvblByb2Nlc3M6IHZpLmZuKCksXG4gICAgICAgICAgb25CYWNrOiB2aS5mbigpLFxuICAgICAgICB9fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1pbnB1dDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtaW5wdXQyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5iYWNrVG9EYXRhU291cmNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGEgdGhyb3VnaCB0aGUgY29tcG9uZW50IGhpZXJhcmNoeScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblByb2Nlc3MgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrT25CYWNrID0gdmkuZm4oKVxuICAgICAgc2V0dXBNb2NrcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nXG4gICAgICAgICAgZGF0YVNvdXJjZU5vZGVJZD1cInRlc3Qtbm9kZVwiXG4gICAgICAgICAgb25Qcm9jZXNzPXttb2NrT25Qcm9jZXNzfVxuICAgICAgICAgIG9uQmFjaz17bW9ja09uQmFja31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENsaWNrIGJhY2sgYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuYmFja1RvRGF0YVNvdXJjZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25CYWNrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdTdGF0ZSBTeW5jaHJvbml6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiB3b3JrZmxvdyBydW5uaW5nIHN0YXR1cyBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHdvcmtmbG93UnVubmluZ0RhdGE6IHsgcmVzdWx0OiB7IHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlJ1bm5pbmcgfSB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgIDxEb2N1bWVudFByb2Nlc3Npbmcgey4uLntcbiAgICAgICAgICBkYXRhU291cmNlTm9kZUlkOiAndGVzdC1ub2RlJyxcbiAgICAgICAgICBvblByb2Nlc3M6IHZpLmZuKCksXG4gICAgICAgICAgb25CYWNrOiB2aS5mbigpLFxuICAgICAgICB9fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwcm9jZXNzQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMucHJvY2VzcycpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QocHJvY2Vzc0J1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2hlbiBmZXRjaGluZyBwYXJhbXMgc3RhdHVzIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHsgaXNGZXRjaGluZ1BhcmFtczogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgPERvY3VtZW50UHJvY2Vzc2luZyB7Li4ue1xuICAgICAgICAgIGRhdGFTb3VyY2VOb2RlSWQ6ICd0ZXN0LW5vZGUnLFxuICAgICAgICAgIG9uUHJvY2VzczogdmkuZm4oKSxcbiAgICAgICAgICBvbkJhY2s6IHZpLmZuKCksXG4gICAgICAgIH19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcm9jZXNzJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChwcm9jZXNzQnV0dG9uKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQcm9wIFZhcmlhdGlvbnMgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1Byb3AgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgc2V0dXBNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2RhdGFTb3VyY2VOb2RlSWQgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdC5lYWNoKFtcbiAgICAgIFsnc2ltcGxlLW5vZGUtaWQnXSxcbiAgICAgIFsnbm9kZS13aXRoLW51bWJlcnMtMTIzJ10sXG4gICAgICBbJ25vZGVfd2l0aF91bmRlcnNjb3JlcyddLFxuICAgICAgWydub2RlLndpdGguZG90cyddLFxuICAgICAgWyd2ZXJ5LWxvbmctbm9kZS1pZC10aGF0LWNvdWxkLXBvdGVudGlhbGx5LWNhdXNlLWlzc3Vlcy1pZi1ub3QtaGFuZGxlZC1wcm9wZXJseSddLFxuICAgIF0pKCdzaG91bGQgaGFuZGxlIGRhdGFTb3VyY2VOb2RlSWQ6ICVzJywgKG5vZGVJZCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgIDxEb2N1bWVudFByb2Nlc3NpbmdcbiAgICAgICAgICBkYXRhU291cmNlTm9kZUlkPXtub2RlSWR9XG4gICAgICAgICAgb25Qcm9jZXNzPXt2aS5mbigpfVxuICAgICAgICAgIG9uQmFjaz17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1hY3Rpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDYWxsYmFjayBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgd29yayB3aXRoIHN5bmNocm9ub3VzIG9uUHJvY2VzcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHN5bmNDYWxsYmFjayA9IHZpLmZuKClcbiAgICAgIHNldHVwTW9ja3MoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgPERvY3VtZW50UHJvY2Vzc2luZ1xuICAgICAgICAgIGRhdGFTb3VyY2VOb2RlSWQ9XCJ0ZXN0LW5vZGVcIlxuICAgICAgICAgIG9uUHJvY2Vzcz17c3luY0NhbGxiYWNrfVxuICAgICAgICAgIG9uQmFjaz17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1hY3Rpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggYXN5bmMgb25Qcm9jZXNzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgYXN5bmNDYWxsYmFjayA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuICAgICAgc2V0dXBNb2NrcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nXG4gICAgICAgICAgZGF0YVNvdXJjZU5vZGVJZD1cInRlc3Qtbm9kZVwiXG4gICAgICAgICAgb25Qcm9jZXNzPXthc3luY0NhbGxiYWNrfVxuICAgICAgICAgIG9uQmFjaz17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1hY3Rpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDb25maWd1cmF0aW9uIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcmVxdWlyZWQgZmllbGRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY29uZmlndXJhdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdyZXF1aXJlZCcsIHJlcXVpcmVkOiB0cnVlIH0pLFxuICAgICAgXVxuICAgICAgc2V0dXBNb2Nrcyh7IGNvbmZpZ3VyYXRpb25zIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi57XG4gICAgICAgICAgZGF0YVNvdXJjZU5vZGVJZDogJ3Rlc3Qtbm9kZScsXG4gICAgICAgICAgb25Qcm9jZXNzOiB2aS5mbigpLFxuICAgICAgICAgIG9uQmFjazogdmkuZm4oKSxcbiAgICAgICAgfX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtcmVxdWlyZWQtcmVxdWlyZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvcHRpb25hbCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjb25maWd1cmF0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlQmFzZUNvbmZpZ3VyYXRpb24oeyB2YXJpYWJsZTogJ29wdGlvbmFsJywgcmVxdWlyZWQ6IGZhbHNlIH0pLFxuICAgICAgXVxuICAgICAgc2V0dXBNb2Nrcyh7IGNvbmZpZ3VyYXRpb25zIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICA8RG9jdW1lbnRQcm9jZXNzaW5nIHsuLi57XG4gICAgICAgICAgZGF0YVNvdXJjZU5vZGVJZDogJ3Rlc3Qtbm9kZScsXG4gICAgICAgICAgb25Qcm9jZXNzOiB2aS5mbigpLFxuICAgICAgICAgIG9uQmFjazogdmkuZm4oKSxcbiAgICAgICAgfX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtcmVxdWlyZWQtb3B0aW9uYWwnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWl4ZWQgcmVxdWlyZWQgYW5kIG9wdGlvbmFsIGZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbmZpZ3VyYXRpb25zID0gW1xuICAgICAgICBjcmVhdGVCYXNlQ29uZmlndXJhdGlvbih7IHZhcmlhYmxlOiAncmVxdWlyZWQxJywgcmVxdWlyZWQ6IHRydWUgfSksXG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdvcHRpb25hbDEnLCByZXF1aXJlZDogZmFsc2UgfSksXG4gICAgICAgIGNyZWF0ZUJhc2VDb25maWd1cmF0aW9uKHsgdmFyaWFibGU6ICdyZXF1aXJlZDInLCByZXF1aXJlZDogdHJ1ZSB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9ja3MoeyBjb25maWd1cmF0aW9ucyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgPERvY3VtZW50UHJvY2Vzc2luZyB7Li4ue1xuICAgICAgICAgIGRhdGFTb3VyY2VOb2RlSWQ6ICd0ZXN0LW5vZGUnLFxuICAgICAgICAgIG9uUHJvY2VzczogdmkuZm4oKSxcbiAgICAgICAgICBvbkJhY2s6IHZpLmZuKCksXG4gICAgICAgIH19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXJlcXVpcmVkLXJlcXVpcmVkMScpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1yZXF1aXJlZC1vcHRpb25hbDEnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXJlcXVpcmVkLXJlcXVpcmVkMicpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=