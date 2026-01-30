"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const React = require("react");
const pipeline_1 = require("@/models/pipeline");
const data_source_1 = require("./data-source");
const form_1 = require("./form");
const index_1 = require("./index");
const process_documents_1 = require("./process-documents");
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock useFloatingRight hook
const mockUseFloatingRight = vi.fn(() => ({
    floatingRight: false,
    floatingRightWidth: 480,
}));
vi.mock('../hooks', () => ({
    useFloatingRight: () => mockUseFloatingRight(),
}));
// Mock useInputFieldPanel hook
const mockToggleInputFieldPreviewPanel = vi.fn();
vi.mock('@/app/components/rag-pipeline/hooks', () => ({
    useInputFieldPanel: () => ({
        toggleInputFieldPreviewPanel: mockToggleInputFieldPreviewPanel,
        isPreviewing: true,
        isEditing: false,
        closeAllInputFieldPanels: vi.fn(),
        toggleInputFieldEditPanel: vi.fn(),
    }),
}));
// Track mock state for workflow store
let mockPipelineId = 'test-pipeline-id';
vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => {
        const state = {
            pipelineId: mockPipelineId,
            nodePanelWidth: 420,
            workflowCanvasWidth: 1200,
            otherPanelWidth: 0,
        };
        return selector(state);
    },
    useWorkflowStore: () => ({
        getState: () => ({
            showInputFieldPreviewPanel: true,
            setShowInputFieldPreviewPanel: vi.fn(),
        }),
    }),
}));
// Mock reactflow store
vi.mock('reactflow', () => ({
    useStore: () => undefined,
}));
// Mock zustand shallow
vi.mock('zustand/react/shallow', () => ({
    useShallow: (fn) => fn,
}));
// Track mock data for API hooks
let mockPreProcessingParamsData;
let mockProcessingParamsData;
vi.mock('@/service/use-pipeline', () => ({
    useDraftPipelinePreProcessingParams: (_params, enabled) => ({
        data: enabled ? mockPreProcessingParamsData : undefined,
        isLoading: false,
        error: null,
    }),
    useDraftPipelineProcessingParams: (_params, enabled) => ({
        data: enabled ? mockProcessingParamsData : undefined,
        isLoading: false,
        error: null,
    }),
}));
// Track mock datasource options
let mockDatasourceOptions = [];
vi.mock('../../test-run/preparation/data-source-options', () => ({
    default: ({ onSelect, dataSourceNodeId, }) => (<div data-testid="data-source-options">
      <span data-testid="current-node-id">{dataSourceNodeId}</span>
      {mockDatasourceOptions.map(option => (<button key={option.value} data-testid={`option-${option.value}`} onClick={() => onSelect({
                nodeId: option.value,
                nodeData: option.data,
            })}>
          {option.label}
        </button>))}
    </div>),
}));
// Helper function to convert option string to option object
const mapOptionToObject = (option) => ({
    label: option,
    value: option,
});
// Mock form-related hooks
vi.mock('@/app/components/rag-pipeline/hooks/use-input-fields', () => ({
    useInitialData: (variables) => {
        return React.useMemo(() => {
            return variables.reduce((acc, item) => {
                acc[item.variable] = item.default_value ?? '';
                return acc;
            }, {});
        }, [variables]);
    },
    useConfigurations: (variables) => {
        return React.useMemo(() => {
            return variables.map(item => ({
                type: item.type,
                variable: item.variable,
                label: item.label,
                required: item.required,
                maxLength: item.max_length,
                options: item.options?.map(mapOptionToObject),
                showConditions: [],
                placeholder: item.placeholder,
                tooltip: item.tooltips,
                unit: item.unit,
            }));
        }, [variables]);
    },
}));
// Mock useAppForm hook
vi.mock('@/app/components/base/form', () => ({
    useAppForm: ({ defaultValues }) => ({
        handleSubmit: vi.fn(),
        register: vi.fn(),
        formState: { errors: {} },
        watch: vi.fn(),
        setValue: vi.fn(),
        getValues: () => defaultValues,
        control: {},
    }),
}));
// Mock BaseField component
vi.mock('@/app/components/base/form/form-scenarios/base/field', () => ({
    default: ({ config }) => {
        const FieldComponent = ({ form }) => (<div data-testid={`field-${config.variable}`}>
        <label>{config.label}</label>
        <input data-testid={`input-${config.variable}`}/>
        <span data-testid="form-ref">{form ? 'has-form' : 'no-form'}</span>
      </div>);
        return FieldComponent;
    },
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createRAGPipelineVariable = (overrides) => ({
    belong_to_node_id: 'node-1',
    type: pipeline_1.PipelineInputVarType.textInput,
    label: 'Test Label',
    variable: 'test_variable',
    max_length: 256,
    default_value: '',
    placeholder: 'Enter value',
    required: true,
    tooltips: 'Help text',
    options: [],
    ...overrides,
});
const createDatasourceOption = (overrides) => ({
    label: 'Test Datasource',
    value: 'datasource-node-1',
    data: {
        title: 'Test Datasource',
        desc: 'Test description',
    },
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
// PreviewPanel Component Tests
// ============================================================================
describe('PreviewPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFloatingRight.mockReturnValue({
            floatingRight: false,
            floatingRightWidth: 480,
        });
        mockPipelineId = 'test-pipeline-id';
        mockPreProcessingParamsData = undefined;
        mockProcessingParamsData = undefined;
        mockDatasourceOptions = [];
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render preview panel without crashing', () => {
            // Act
            renderWithProviders(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.operations.preview')).toBeInTheDocument();
        });
        it('should render preview badge', () => {
            // Act
            renderWithProviders(<index_1.default />);
            // Assert
            const badge = react_1.screen.getByText('datasetPipeline.operations.preview');
            expect(badge).toBeInTheDocument();
        });
        it('should render close button', () => {
            // Act
            renderWithProviders(<index_1.default />);
            // Assert
            const closeButton = react_1.screen.getByRole('button');
            expect(closeButton).toBeInTheDocument();
        });
        it('should render DataSource component', () => {
            // Act
            renderWithProviders(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toBeInTheDocument();
        });
        it('should render ProcessDocuments component', () => {
            // Act
            renderWithProviders(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
        it('should render divider between sections', () => {
            // Act
            const { container } = renderWithProviders(<index_1.default />);
            // Assert
            const divider = container.querySelector('.bg-divider-subtle');
            expect(divider).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // State Management Tests
    // -------------------------------------------------------------------------
    describe('State Management', () => {
        it('should initialize with empty datasource state', () => {
            // Act
            renderWithProviders(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('');
        });
        it('should update datasource state when DataSource selects', () => {
            // Arrange
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'node-1', label: 'Node 1' }),
            ];
            // Act
            renderWithProviders(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-1'));
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-1');
        });
        it('should pass datasource nodeId to ProcessDocuments', () => {
            // Arrange
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'test-node', label: 'Test Node' }),
            ];
            // Act
            renderWithProviders(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('option-test-node'));
            // Assert - ProcessDocuments receives the nodeId
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('test-node');
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call toggleInputFieldPreviewPanel when close button clicked', () => {
            // Act
            renderWithProviders(<index_1.default />);
            const closeButton = react_1.screen.getByRole('button');
            react_1.fireEvent.click(closeButton);
            // Assert
            expect(mockToggleInputFieldPreviewPanel).toHaveBeenCalledTimes(1);
        });
        it('should handle multiple close button clicks', () => {
            // Act
            renderWithProviders(<index_1.default />);
            const closeButton = react_1.screen.getByRole('button');
            react_1.fireEvent.click(closeButton);
            react_1.fireEvent.click(closeButton);
            react_1.fireEvent.click(closeButton);
            // Assert
            expect(mockToggleInputFieldPreviewPanel).toHaveBeenCalledTimes(3);
        });
        it('should handle datasource selection changes', () => {
            // Arrange
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'node-1', label: 'Node 1' }),
                createDatasourceOption({ value: 'node-2', label: 'Node 2' }),
            ];
            // Act
            renderWithProviders(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-1'));
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-1');
            // Act - Change selection
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-2'));
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-2');
        });
    });
    // -------------------------------------------------------------------------
    // Floating Right Behavior Tests
    // -------------------------------------------------------------------------
    describe('Floating Right Behavior', () => {
        it('should apply floating right styles when floatingRight is true', () => {
            // Arrange
            mockUseFloatingRight.mockReturnValue({
                floatingRight: true,
                floatingRightWidth: 400,
            });
            // Act
            const { container } = renderWithProviders(<index_1.default />);
            // Assert
            const panel = container.firstChild;
            expect(panel.className).toContain('absolute');
            expect(panel.className).toContain('right-0');
            expect(panel.style.width).toBe('400px');
        });
        it('should not apply floating right styles when floatingRight is false', () => {
            // Arrange
            mockUseFloatingRight.mockReturnValue({
                floatingRight: false,
                floatingRightWidth: 480,
            });
            // Act
            const { container } = renderWithProviders(<index_1.default />);
            // Assert
            const panel = container.firstChild;
            expect(panel.className).not.toContain('absolute');
            expect(panel.style.width).toBe('480px');
        });
        it('should update width when floatingRightWidth changes', () => {
            // Arrange
            mockUseFloatingRight.mockReturnValue({
                floatingRight: false,
                floatingRightWidth: 600,
            });
            // Act
            const { container } = renderWithProviders(<index_1.default />);
            // Assert
            const panel = container.firstChild;
            expect(panel.style.width).toBe('600px');
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should maintain stable handleClosePreviewPanel callback', () => {
            // Act
            const { rerender } = renderWithProviders(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            rerender(<TestWrapper>
          <index_1.default />
        </TestWrapper>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockToggleInputFieldPreviewPanel).toHaveBeenCalledTimes(2);
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty datasource options', () => {
            // Arrange
            mockDatasourceOptions = [];
            // Act
            renderWithProviders(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('');
        });
        it('should handle rapid datasource selections', () => {
            // Arrange
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'node-1', label: 'Node 1' }),
                createDatasourceOption({ value: 'node-2', label: 'Node 2' }),
                createDatasourceOption({ value: 'node-3', label: 'Node 3' }),
            ];
            // Act
            renderWithProviders(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-1'));
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-2'));
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-3'));
            // Assert - Final selection should be node-3
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-3');
        });
    });
});
// ============================================================================
// DataSource Component Tests
// ============================================================================
describe('DataSource', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockPipelineId = 'test-pipeline-id';
        mockPreProcessingParamsData = undefined;
        mockDatasourceOptions = [];
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render step one title', () => {
            // Arrange
            const onSelect = vi.fn();
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId=""/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepOneTitle')).toBeInTheDocument();
        });
        it('should render DataSourceOptions component', () => {
            // Arrange
            const onSelect = vi.fn();
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId=""/>);
            // Assert
            expect(react_1.screen.getByTestId('data-source-options')).toBeInTheDocument();
        });
        it('should pass dataSourceNodeId to DataSourceOptions', () => {
            // Arrange
            const onSelect = vi.fn();
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId="test-node-id"/>);
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('test-node-id');
        });
    });
    // -------------------------------------------------------------------------
    // Props Variations Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should handle empty dataSourceNodeId', () => {
            // Arrange
            const onSelect = vi.fn();
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId=""/>);
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('');
        });
        it('should handle different dataSourceNodeId values', () => {
            // Arrange
            const onSelect = vi.fn();
            // Act
            const { rerender } = renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId="node-1"/>);
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-1');
            // Act - Change nodeId
            rerender(<TestWrapper>
          <data_source_1.default onSelect={onSelect} dataSourceNodeId="node-2"/>
        </TestWrapper>);
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-2');
        });
    });
    // -------------------------------------------------------------------------
    // API Integration Tests
    // -------------------------------------------------------------------------
    describe('API Integration', () => {
        it('should fetch pre-processing params when pipelineId and nodeId are present', async () => {
            // Arrange
            const onSelect = vi.fn();
            mockPreProcessingParamsData = {
                variables: [createRAGPipelineVariable()],
            };
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId="test-node"/>);
            // Assert - Form should render with fetched variables
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
            });
        });
        it('should not render form fields when params data is empty', () => {
            // Arrange
            const onSelect = vi.fn();
            mockPreProcessingParamsData = { variables: [] };
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId="test-node"/>);
            // Assert
            expect(react_1.screen.queryByTestId('field-test_variable')).not.toBeInTheDocument();
        });
        it('should handle undefined params data', () => {
            // Arrange
            const onSelect = vi.fn();
            mockPreProcessingParamsData = undefined;
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId=""/>);
            // Assert - Should render without errors
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepOneTitle')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onSelect when datasource option is clicked', () => {
            // Arrange
            const onSelect = vi.fn();
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'selected-node', label: 'Selected' }),
            ];
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId=""/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('option-selected-node'));
            // Assert
            expect(onSelect).toHaveBeenCalledTimes(1);
            expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({
                nodeId: 'selected-node',
            }));
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be memoized (React.memo)', () => {
            // Arrange
            const onSelect = vi.fn();
            // Act
            const { rerender } = renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId="node-1"/>);
            // Rerender with same props
            rerender(<TestWrapper>
          <data_source_1.default onSelect={onSelect} dataSourceNodeId="node-1"/>
        </TestWrapper>);
            // Assert - Component should not cause additional renders
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepOneTitle')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle null pipelineId', () => {
            // Arrange
            const onSelect = vi.fn();
            mockPipelineId = null;
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId="test-node"/>);
            // Assert - Should render without errors
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepOneTitle')).toBeInTheDocument();
        });
        it('should handle special characters in dataSourceNodeId', () => {
            // Arrange
            const onSelect = vi.fn();
            // Act
            renderWithProviders(<data_source_1.default onSelect={onSelect} dataSourceNodeId="node-with-special-chars_123"/>);
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-with-special-chars_123');
        });
    });
});
// ============================================================================
// ProcessDocuments Component Tests
// ============================================================================
describe('ProcessDocuments', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockPipelineId = 'test-pipeline-id';
        mockProcessingParamsData = undefined;
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render step two title', () => {
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId=""/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
        it('should render Form component', () => {
            // Arrange
            mockProcessingParamsData = {
                variables: [createRAGPipelineVariable({ variable: 'process_var' })],
            };
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId="test-node"/>);
            // Assert - Form should be rendered
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Props Variations Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should handle empty dataSourceNodeId', () => {
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId=""/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
        it('should handle different dataSourceNodeId values', () => {
            // Act
            const { rerender } = renderWithProviders(<process_documents_1.default dataSourceNodeId="node-1"/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
            // Act - Change nodeId
            rerender(<TestWrapper>
          <process_documents_1.default dataSourceNodeId="node-2"/>
        </TestWrapper>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // API Integration Tests
    // -------------------------------------------------------------------------
    describe('API Integration', () => {
        it('should fetch processing params when pipelineId and nodeId are present', async () => {
            // Arrange
            mockProcessingParamsData = {
                variables: [
                    createRAGPipelineVariable({
                        variable: 'chunk_size',
                        label: 'Chunk Size',
                    }),
                ],
            };
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId="test-node"/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('field-chunk_size')).toBeInTheDocument();
            });
        });
        it('should not render form fields when params data is empty', () => {
            // Arrange
            mockProcessingParamsData = { variables: [] };
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId="test-node"/>);
            // Assert
            expect(react_1.screen.queryByTestId('field-chunk_size')).not.toBeInTheDocument();
        });
        it('should handle undefined params data', () => {
            // Arrange
            mockProcessingParamsData = undefined;
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId=""/>);
            // Assert - Should render without errors
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
        it('should render multiple form fields from params', async () => {
            // Arrange
            mockProcessingParamsData = {
                variables: [
                    createRAGPipelineVariable({
                        variable: 'var1',
                        label: 'Variable 1',
                    }),
                    createRAGPipelineVariable({
                        variable: 'var2',
                        label: 'Variable 2',
                    }),
                ],
            };
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId="test-node"/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('field-var1')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('field-var2')).toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be memoized (React.memo)', () => {
            // Act
            const { rerender } = renderWithProviders(<process_documents_1.default dataSourceNodeId="node-1"/>);
            // Rerender with same props
            rerender(<TestWrapper>
          <process_documents_1.default dataSourceNodeId="node-1"/>
        </TestWrapper>);
            // Assert - Component should render without issues
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle null pipelineId', () => {
            // Arrange
            mockPipelineId = null;
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId="test-node"/>);
            // Assert - Should render without errors
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
        it('should handle very long dataSourceNodeId', () => {
            // Arrange
            const longNodeId = 'a'.repeat(100);
            // Act
            renderWithProviders(<process_documents_1.default dataSourceNodeId={longNodeId}/>);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.preview.stepTwoTitle')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// Form Component Tests
// ============================================================================
describe('Form', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render form element', () => {
            // Act
            const { container } = renderWithProviders(<form_1.default variables={[]}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
        });
        it('should render form fields for each variable', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({ variable: 'field1', label: 'Field 1' }),
                createRAGPipelineVariable({ variable: 'field2', label: 'Field 2' }),
            ];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-field1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-field2')).toBeInTheDocument();
        });
        it('should render no fields when variables is empty', () => {
            // Act
            renderWithProviders(<form_1.default variables={[]}/>);
            // Assert
            expect(react_1.screen.queryByTestId(/^field-/)).not.toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Props Variations Tests
    // -------------------------------------------------------------------------
    describe('Props Variations', () => {
        it('should handle different variable types', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({
                    variable: 'text_var',
                    type: pipeline_1.PipelineInputVarType.textInput,
                }),
                createRAGPipelineVariable({
                    variable: 'number_var',
                    type: pipeline_1.PipelineInputVarType.number,
                }),
                createRAGPipelineVariable({
                    variable: 'select_var',
                    type: pipeline_1.PipelineInputVarType.select,
                    options: ['opt1', 'opt2'],
                }),
            ];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-text_var')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-number_var')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-select_var')).toBeInTheDocument();
        });
        it('should handle variables with default values', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({
                    variable: 'with_default',
                    default_value: 'default_text',
                }),
            ];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-with_default')).toBeInTheDocument();
        });
        it('should handle variables with all optional fields', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({
                    variable: 'full_var',
                    label: 'Full Variable',
                    max_length: 1000,
                    default_value: 'default',
                    placeholder: 'Enter here',
                    required: true,
                    tooltips: 'This is a tooltip',
                    unit: 'units',
                }),
            ];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-full_var')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Form Behavior Tests
    // -------------------------------------------------------------------------
    describe('Form Behavior', () => {
        it('should prevent default form submission', () => {
            // Arrange
            const variables = [createRAGPipelineVariable()];
            const preventDefaultMock = vi.fn();
            // Act
            const { container } = renderWithProviders(<form_1.default variables={variables}/>);
            const form = container.querySelector('form');
            // Create and dispatch submit event
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            Object.defineProperty(submitEvent, 'preventDefault', {
                value: preventDefaultMock,
            });
            form.dispatchEvent(submitEvent);
            // Assert - Form should prevent default submission
            expect(preventDefaultMock).toHaveBeenCalled();
        });
        it('should pass form to each field component', () => {
            // Arrange
            const variables = [createRAGPipelineVariable({ variable: 'test_var' })];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('form-ref').textContent).toBe('has-form');
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should memoize initialData when variables do not change', () => {
            // Arrange
            const variables = [createRAGPipelineVariable()];
            // Act
            const { rerender } = renderWithProviders(<form_1.default variables={variables}/>);
            rerender(<TestWrapper>
          <form_1.default variables={variables}/>
        </TestWrapper>);
            // Assert - Component should render without issues
            expect(react_1.screen.getByTestId('field-test_variable')).toBeInTheDocument();
        });
        it('should memoize configurations when variables do not change', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({ variable: 'var1' }),
                createRAGPipelineVariable({ variable: 'var2' }),
            ];
            // Act
            const { rerender } = renderWithProviders(<form_1.default variables={variables}/>);
            // Rerender with same variables reference
            rerender(<TestWrapper>
          <form_1.default variables={variables}/>
        </TestWrapper>);
            // Assert
            expect(react_1.screen.getByTestId('field-var1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-var2')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty variables array', () => {
            // Act
            const { container } = renderWithProviders(<form_1.default variables={[]}/>);
            // Assert
            expect(container.querySelector('form')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId(/^field-/)).not.toBeInTheDocument();
        });
        it('should handle single variable', () => {
            // Arrange
            const variables = [createRAGPipelineVariable({ variable: 'single' })];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-single')).toBeInTheDocument();
        });
        it('should handle many variables', () => {
            // Arrange
            const variables = Array.from({ length: 20 }, (_, i) => createRAGPipelineVariable({ variable: `var_${i}`, label: `Var ${i}` }));
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-var_0')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-var_19')).toBeInTheDocument();
        });
        it('should handle variables with special characters in names', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({
                    variable: 'var_with_underscore',
                    label: 'Variable with <special> & "chars"',
                }),
            ];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-var_with_underscore')).toBeInTheDocument();
        });
        it('should handle variables with unicode labels', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({
                    variable: 'unicode_var',
                    label: '中文标签 🎉',
                    tooltips: 'ツールチップ',
                }),
            ];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-unicode_var')).toBeInTheDocument();
            expect(react_1.screen.getByText('中文标签 🎉')).toBeInTheDocument();
        });
        it('should handle variables with empty string default values', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({
                    variable: 'empty_default',
                    default_value: '',
                }),
            ];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-empty_default')).toBeInTheDocument();
        });
        it('should handle variables with zero max_length', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable({
                    variable: 'zero_length',
                    max_length: 0,
                }),
            ];
            // Act
            renderWithProviders(<form_1.default variables={variables}/>);
            // Assert
            expect(react_1.screen.getByTestId('field-zero_length')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// Integration Tests
// ============================================================================
describe('Preview Panel Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFloatingRight.mockReturnValue({
            floatingRight: false,
            floatingRightWidth: 480,
        });
        mockPipelineId = 'test-pipeline-id';
        mockPreProcessingParamsData = undefined;
        mockProcessingParamsData = undefined;
        mockDatasourceOptions = [];
    });
    // -------------------------------------------------------------------------
    // End-to-End Flow Tests
    // -------------------------------------------------------------------------
    describe('End-to-End Flow', () => {
        it('should complete full preview flow: select datasource -> show forms', async () => {
            // Arrange
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'node-1', label: 'Local File' }),
            ];
            mockPreProcessingParamsData = {
                variables: [
                    createRAGPipelineVariable({
                        variable: 'source_var',
                        label: 'Source Variable',
                    }),
                ],
            };
            mockProcessingParamsData = {
                variables: [
                    createRAGPipelineVariable({
                        variable: 'process_var',
                        label: 'Process Variable',
                    }),
                ],
            };
            // Act
            renderWithProviders(<index_1.default />);
            // Select datasource
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-1'));
            // Assert - Both forms should show their fields
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('field-source_var')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('field-process_var')).toBeInTheDocument();
            });
        });
        it('should update both forms when datasource changes', async () => {
            // Arrange
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'node-1', label: 'Node 1' }),
                createDatasourceOption({ value: 'node-2', label: 'Node 2' }),
            ];
            mockPreProcessingParamsData = {
                variables: [createRAGPipelineVariable({ variable: 'pre_var' })],
            };
            mockProcessingParamsData = {
                variables: [createRAGPipelineVariable({ variable: 'proc_var' })],
            };
            // Act
            renderWithProviders(<index_1.default />);
            // Select first datasource
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-1'));
            // Assert initial selection
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-1');
            });
            // Select second datasource
            react_1.fireEvent.click(react_1.screen.getByTestId('option-node-2'));
            // Assert updated selection
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('node-2');
            });
        });
    });
    // -------------------------------------------------------------------------
    // Component Communication Tests
    // -------------------------------------------------------------------------
    describe('Component Communication', () => {
        it('should pass correct nodeId from PreviewPanel to child components', () => {
            // Arrange
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'communicated-node', label: 'Node' }),
            ];
            // Act
            renderWithProviders(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('option-communicated-node'));
            // Assert
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('communicated-node');
        });
    });
    // -------------------------------------------------------------------------
    // State Persistence Tests
    // -------------------------------------------------------------------------
    describe('State Persistence', () => {
        it('should maintain datasource selection within same render cycle', () => {
            // Arrange
            mockDatasourceOptions = [
                createDatasourceOption({ value: 'persistent-node', label: 'Persistent' }),
                createDatasourceOption({ value: 'other-node', label: 'Other' }),
            ];
            // Act
            renderWithProviders(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('option-persistent-node'));
            // Assert - Selection should be maintained
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('persistent-node');
            // Change selection and verify state updates correctly
            react_1.fireEvent.click(react_1.screen.getByTestId('option-other-node'));
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('other-node');
            // Go back to original and verify
            react_1.fireEvent.click(react_1.screen.getByTestId('option-persistent-node'));
            expect(react_1.screen.getByTestId('current-node-id').textContent).toBe('persistent-node');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsdURBQXdFO0FBQ3hFLGtEQUEyRTtBQUMzRSwrQkFBOEI7QUFDOUIsZ0RBQXdEO0FBQ3hELCtDQUFzQztBQUN0QyxpQ0FBeUI7QUFDekIsbUNBQWtDO0FBQ2xDLDJEQUFrRDtBQUVsRCwrRUFBK0U7QUFDL0UsNkJBQTZCO0FBQzdCLCtFQUErRTtBQUUvRSw2QkFBNkI7QUFDN0IsTUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsYUFBYSxFQUFFLEtBQUs7SUFDcEIsa0JBQWtCLEVBQUUsR0FBRztDQUN4QixDQUFDLENBQUMsQ0FBQTtBQUVILEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekIsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLENBQUMsb0JBQW9CLEVBQUU7Q0FDL0MsQ0FBQyxDQUFDLENBQUE7QUFFSCwrQkFBK0I7QUFDL0IsTUFBTSxnQ0FBZ0MsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDaEQsRUFBRSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BELGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDekIsNEJBQTRCLEVBQUUsZ0NBQWdDO1FBQzlELFlBQVksRUFBRSxJQUFJO1FBQ2xCLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLHdCQUF3QixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMseUJBQXlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtLQUNuQyxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxzQ0FBc0M7QUFDdEMsSUFBSSxjQUFjLEdBQWtCLGtCQUFrQixDQUFBO0FBRXRELEVBQUUsQ0FB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Q0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7WUFDeEQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQzVELFlBQVksQ0FDYixDQUFBO1lBRUQsaUNBQWlDO1lBQ2pDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFBO1lBQzdELE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUM1RCxpQkFBaUIsQ0FDbEIsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRGF0YXNvdXJjZSwgRGF0YVNvdXJjZU9wdGlvbiB9IGZyb20gJy4uLy4uL3Rlc3QtcnVuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBSQUdQaXBlbGluZVZhcmlhYmxlLCBSQUdQaXBlbGluZVZhcmlhYmxlcyB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgUGlwZWxpbmVJbnB1dFZhclR5cGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCBEYXRhU291cmNlIGZyb20gJy4vZGF0YS1zb3VyY2UnXG5pbXBvcnQgRm9ybSBmcm9tICcuL2Zvcm0nXG5pbXBvcnQgUHJldmlld1BhbmVsIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgUHJvY2Vzc0RvY3VtZW50cyBmcm9tICcuL3Byb2Nlc3MtZG9jdW1lbnRzJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHVzZUZsb2F0aW5nUmlnaHQgaG9va1xuY29uc3QgbW9ja1VzZUZsb2F0aW5nUmlnaHQgPSB2aS5mbigoKSA9PiAoe1xuICBmbG9hdGluZ1JpZ2h0OiBmYWxzZSxcbiAgZmxvYXRpbmdSaWdodFdpZHRoOiA0ODAsXG59KSlcblxudmkubW9jaygnLi4vaG9va3MnLCAoKSA9PiAoe1xuICB1c2VGbG9hdGluZ1JpZ2h0OiAoKSA9PiBtb2NrVXNlRmxvYXRpbmdSaWdodCgpLFxufSkpXG5cbi8vIE1vY2sgdXNlSW5wdXRGaWVsZFBhbmVsIGhvb2tcbmNvbnN0IG1vY2tUb2dnbGVJbnB1dEZpZWxkUHJldmlld1BhbmVsID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9yYWctcGlwZWxpbmUvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VJbnB1dEZpZWxkUGFuZWw6ICgpID0+ICh7XG4gICAgdG9nZ2xlSW5wdXRGaWVsZFByZXZpZXdQYW5lbDogbW9ja1RvZ2dsZUlucHV0RmllbGRQcmV2aWV3UGFuZWwsXG4gICAgaXNQcmV2aWV3aW5nOiB0cnVlLFxuICAgIGlzRWRpdGluZzogZmFsc2UsXG4gICAgY2xvc2VBbGxJbnB1dEZpZWxkUGFuZWxzOiB2aS5mbigpLFxuICAgIHRvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWw6IHZpLmZuKCksXG4gIH0pLFxufSkpXG5cbi8vIFRyYWNrIG1vY2sgc3RhdGUgZm9yIHdvcmtmbG93IHN0b3JlXG5sZXQgbW9ja1BpcGVsaW5lSWQ6IHN0cmluZyB8IG51bGwgPSAndGVzdC1waXBlbGluZS1pZCdcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZScsICgpID0+ICh7XG4gIHVzZVN0b3JlOiAoc2VsZWN0b3I6IChzdGF0ZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHVua25vd24pID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgIHBpcGVsaW5lSWQ6IG1vY2tQaXBlbGluZUlkLFxuICAgICAgbm9kZVBhbmVsV2lkdGg6IDQyMCxcbiAgICAgIHdvcmtmbG93Q2FudmFzV2lkdGg6IDEyMDAsXG4gICAgICBvdGhlclBhbmVsV2lkdGg6IDAsXG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcihzdGF0ZSlcbiAgfSxcbiAgdXNlV29ya2Zsb3dTdG9yZTogKCkgPT4gKHtcbiAgICBnZXRTdGF0ZTogKCkgPT4gKHtcbiAgICAgIHNob3dJbnB1dEZpZWxkUHJldmlld1BhbmVsOiB0cnVlLFxuICAgICAgc2V0U2hvd0lucHV0RmllbGRQcmV2aWV3UGFuZWw6IHZpLmZuKCksXG4gICAgfSksXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgcmVhY3RmbG93IHN0b3JlXG52aS5tb2NrKCdyZWFjdGZsb3cnLCAoKSA9PiAoe1xuICB1c2VTdG9yZTogKCkgPT4gdW5kZWZpbmVkLFxufSkpXG5cbi8vIE1vY2sgenVzdGFuZCBzaGFsbG93XG52aS5tb2NrKCd6dXN0YW5kL3JlYWN0L3NoYWxsb3cnLCAoKSA9PiAoe1xuICB1c2VTaGFsbG93OiAoZm46IHVua25vd24pID0+IGZuLFxufSkpXG5cbi8vIFRyYWNrIG1vY2sgZGF0YSBmb3IgQVBJIGhvb2tzXG5sZXQgbW9ja1ByZVByb2Nlc3NpbmdQYXJhbXNEYXRhOiB7IHZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZXMgfSB8IHVuZGVmaW5lZFxubGV0IG1vY2tQcm9jZXNzaW5nUGFyYW1zRGF0YTogeyB2YXJpYWJsZXM6IFJBR1BpcGVsaW5lVmFyaWFibGVzIH0gfCB1bmRlZmluZWRcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1waXBlbGluZScsICgpID0+ICh7XG4gIHVzZURyYWZ0UGlwZWxpbmVQcmVQcm9jZXNzaW5nUGFyYW1zOiAoX3BhcmFtczogdW5rbm93biwgZW5hYmxlZDogYm9vbGVhbikgPT4gKHtcbiAgICBkYXRhOiBlbmFibGVkID8gbW9ja1ByZVByb2Nlc3NpbmdQYXJhbXNEYXRhIDogdW5kZWZpbmVkLFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgZXJyb3I6IG51bGwsXG4gIH0pLFxuICB1c2VEcmFmdFBpcGVsaW5lUHJvY2Vzc2luZ1BhcmFtczogKF9wYXJhbXM6IHVua25vd24sIGVuYWJsZWQ6IGJvb2xlYW4pID0+ICh7XG4gICAgZGF0YTogZW5hYmxlZCA/IG1vY2tQcm9jZXNzaW5nUGFyYW1zRGF0YSA6IHVuZGVmaW5lZCxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgIGVycm9yOiBudWxsLFxuICB9KSxcbn0pKVxuXG4vLyBUcmFjayBtb2NrIGRhdGFzb3VyY2Ugb3B0aW9uc1xubGV0IG1vY2tEYXRhc291cmNlT3B0aW9uczogRGF0YVNvdXJjZU9wdGlvbltdID0gW11cblxudmkubW9jaygnLi4vLi4vdGVzdC1ydW4vcHJlcGFyYXRpb24vZGF0YS1zb3VyY2Utb3B0aW9ucycsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7XG4gICAgb25TZWxlY3QsXG4gICAgZGF0YVNvdXJjZU5vZGVJZCxcbiAgfToge1xuICAgIG9uU2VsZWN0OiAoZGF0YXNvdXJjZTogRGF0YXNvdXJjZSkgPT4gdm9pZFxuICAgIGRhdGFTb3VyY2VOb2RlSWQ6IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImRhdGEtc291cmNlLW9wdGlvbnNcIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiY3VycmVudC1ub2RlLWlkXCI+e2RhdGFTb3VyY2VOb2RlSWR9PC9zcGFuPlxuICAgICAge21vY2tEYXRhc291cmNlT3B0aW9ucy5tYXAob3B0aW9uID0+IChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGtleT17b3B0aW9uLnZhbHVlfVxuICAgICAgICAgIGRhdGEtdGVzdGlkPXtgb3B0aW9uLSR7b3B0aW9uLnZhbHVlfWB9XG4gICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgIG9uU2VsZWN0KHtcbiAgICAgICAgICAgICAgbm9kZUlkOiBvcHRpb24udmFsdWUsXG4gICAgICAgICAgICAgIG5vZGVEYXRhOiBvcHRpb24uZGF0YSxcbiAgICAgICAgICAgIH0pfVxuICAgICAgICA+XG4gICAgICAgICAge29wdGlvbi5sYWJlbH1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udmVydCBvcHRpb24gc3RyaW5nIHRvIG9wdGlvbiBvYmplY3RcbmNvbnN0IG1hcE9wdGlvblRvT2JqZWN0ID0gKG9wdGlvbjogc3RyaW5nKSA9PiAoe1xuICBsYWJlbDogb3B0aW9uLFxuICB2YWx1ZTogb3B0aW9uLFxufSlcblxuLy8gTW9jayBmb3JtLXJlbGF0ZWQgaG9va3NcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcmFnLXBpcGVsaW5lL2hvb2tzL3VzZS1pbnB1dC1maWVsZHMnLCAoKSA9PiAoe1xuICB1c2VJbml0aWFsRGF0YTogKHZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZXMpID0+IHtcbiAgICByZXR1cm4gUmVhY3QudXNlTWVtbygoKSA9PiB7XG4gICAgICByZXR1cm4gdmFyaWFibGVzLnJlZHVjZShcbiAgICAgICAgKGFjYywgaXRlbSkgPT4ge1xuICAgICAgICAgIGFjY1tpdGVtLnZhcmlhYmxlXSA9IGl0ZW0uZGVmYXVsdF92YWx1ZSA/PyAnJ1xuICAgICAgICAgIHJldHVybiBhY2NcbiAgICAgICAgfSxcbiAgICAgICAge30gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gICAgICApXG4gICAgfSwgW3ZhcmlhYmxlc10pXG4gIH0sXG4gIHVzZUNvbmZpZ3VyYXRpb25zOiAodmFyaWFibGVzOiBSQUdQaXBlbGluZVZhcmlhYmxlcykgPT4ge1xuICAgIHJldHVybiBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICAgIHJldHVybiB2YXJpYWJsZXMubWFwKGl0ZW0gPT4gKHtcbiAgICAgICAgdHlwZTogaXRlbS50eXBlLFxuICAgICAgICB2YXJpYWJsZTogaXRlbS52YXJpYWJsZSxcbiAgICAgICAgbGFiZWw6IGl0ZW0ubGFiZWwsXG4gICAgICAgIHJlcXVpcmVkOiBpdGVtLnJlcXVpcmVkLFxuICAgICAgICBtYXhMZW5ndGg6IGl0ZW0ubWF4X2xlbmd0aCxcbiAgICAgICAgb3B0aW9uczogaXRlbS5vcHRpb25zPy5tYXAobWFwT3B0aW9uVG9PYmplY3QpLFxuICAgICAgICBzaG93Q29uZGl0aW9uczogW10sXG4gICAgICAgIHBsYWNlaG9sZGVyOiBpdGVtLnBsYWNlaG9sZGVyLFxuICAgICAgICB0b29sdGlwOiBpdGVtLnRvb2x0aXBzLFxuICAgICAgICB1bml0OiBpdGVtLnVuaXQsXG4gICAgICB9KSlcbiAgICB9LCBbdmFyaWFibGVzXSlcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHVzZUFwcEZvcm0gaG9va1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0nLCAoKSA9PiAoe1xuICB1c2VBcHBGb3JtOiAoeyBkZWZhdWx0VmFsdWVzIH06IHsgZGVmYXVsdFZhbHVlczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfSkgPT4gKHtcbiAgICBoYW5kbGVTdWJtaXQ6IHZpLmZuKCksXG4gICAgcmVnaXN0ZXI6IHZpLmZuKCksXG4gICAgZm9ybVN0YXRlOiB7IGVycm9yczoge30gfSxcbiAgICB3YXRjaDogdmkuZm4oKSxcbiAgICBzZXRWYWx1ZTogdmkuZm4oKSxcbiAgICBnZXRWYWx1ZXM6ICgpID0+IGRlZmF1bHRWYWx1ZXMsXG4gICAgY29udHJvbDoge30sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgQmFzZUZpZWxkIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0vZm9ybS1zY2VuYXJpb3MvYmFzZS9maWVsZCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGNvbmZpZyB9OiB7IGluaXRpYWxEYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgY29uZmlnOiB7IHZhcmlhYmxlOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcgfSB9KSA9PiB7XG4gICAgY29uc3QgRmllbGRDb21wb25lbnQgPSAoeyBmb3JtIH06IHsgZm9ybTogdW5rbm93biB9KSA9PiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPXtgZmllbGQtJHtjb25maWcudmFyaWFibGV9YH0+XG4gICAgICAgIDxsYWJlbD57Y29uZmlnLmxhYmVsfTwvbGFiZWw+XG4gICAgICAgIDxpbnB1dCBkYXRhLXRlc3RpZD17YGlucHV0LSR7Y29uZmlnLnZhcmlhYmxlfWB9IC8+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZm9ybS1yZWZcIj57Zm9ybSA/ICdoYXMtZm9ybScgOiAnbm8tZm9ybSd9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICAgIHJldHVybiBGaWVsZENvbXBvbmVudFxuICB9LFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBGYWN0b3JpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSA9IChcbiAgb3ZlcnJpZGVzPzogUGFydGlhbDxSQUdQaXBlbGluZVZhcmlhYmxlPixcbik6IFJBR1BpcGVsaW5lVmFyaWFibGUgPT4gKHtcbiAgYmVsb25nX3RvX25vZGVfaWQ6ICdub2RlLTEnLFxuICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS50ZXh0SW5wdXQsXG4gIGxhYmVsOiAnVGVzdCBMYWJlbCcsXG4gIHZhcmlhYmxlOiAndGVzdF92YXJpYWJsZScsXG4gIG1heF9sZW5ndGg6IDI1NixcbiAgZGVmYXVsdF92YWx1ZTogJycsXG4gIHBsYWNlaG9sZGVyOiAnRW50ZXIgdmFsdWUnLFxuICByZXF1aXJlZDogdHJ1ZSxcbiAgdG9vbHRpcHM6ICdIZWxwIHRleHQnLFxuICBvcHRpb25zOiBbXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlRGF0YXNvdXJjZU9wdGlvbiA9IChcbiAgb3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlT3B0aW9uPixcbik6IERhdGFTb3VyY2VPcHRpb24gPT4gKHtcbiAgbGFiZWw6ICdUZXN0IERhdGFzb3VyY2UnLFxuICB2YWx1ZTogJ2RhdGFzb3VyY2Utbm9kZS0xJyxcbiAgZGF0YToge1xuICAgIHRpdGxlOiAnVGVzdCBEYXRhc291cmNlJyxcbiAgICBkZXNjOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gIH0gYXMgdW5rbm93biBhcyBEYXRhU291cmNlT3B0aW9uWydkYXRhJ10sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgV3JhcHBlciBDb21wb25lbnRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlVGVzdFF1ZXJ5Q2xpZW50ID0gKCkgPT5cbiAgbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgICBkZWZhdWx0T3B0aW9uczoge1xuICAgICAgcXVlcmllczoge1xuICAgICAgICByZXRyeTogZmFsc2UsXG4gICAgICAgIGdjVGltZTogMCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSlcblxuY29uc3QgVGVzdFdyYXBwZXIgPSAoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfSkgPT4ge1xuICBjb25zdCBxdWVyeUNsaWVudCA9IGNyZWF0ZVRlc3RRdWVyeUNsaWVudCgpXG4gIHJldHVybiAoXG4gICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+e2NoaWxkcmVufTwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgKVxufVxuXG5jb25zdCByZW5kZXJXaXRoUHJvdmlkZXJzID0gKHVpOiBSZWFjdC5SZWFjdEVsZW1lbnQpID0+IHtcbiAgcmV0dXJuIHJlbmRlcih1aSwgeyB3cmFwcGVyOiBUZXN0V3JhcHBlciB9KVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQcmV2aWV3UGFuZWwgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdQcmV2aWV3UGFuZWwnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tVc2VGbG9hdGluZ1JpZ2h0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBmbG9hdGluZ1JpZ2h0OiBmYWxzZSxcbiAgICAgIGZsb2F0aW5nUmlnaHRXaWR0aDogNDgwLFxuICAgIH0pXG4gICAgbW9ja1BpcGVsaW5lSWQgPSAndGVzdC1waXBlbGluZS1pZCdcbiAgICBtb2NrUHJlUHJvY2Vzc2luZ1BhcmFtc0RhdGEgPSB1bmRlZmluZWRcbiAgICBtb2NrUHJvY2Vzc2luZ1BhcmFtc0RhdGEgPSB1bmRlZmluZWRcbiAgICBtb2NrRGF0YXNvdXJjZU9wdGlvbnMgPSBbXVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwcmV2aWV3IHBhbmVsIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnByZXZpZXcnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwcmV2aWV3IGJhZGdlJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcmV2aWV3UGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcmV2aWV3JylcbiAgICAgIGV4cGVjdChiYWRnZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjbG9zZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoY2xvc2VCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRGF0YVNvdXJjZSBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkYXRhLXNvdXJjZS1vcHRpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUHJvY2Vzc0RvY3VtZW50cyBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwucHJldmlldy5zdGVwVHdvVGl0bGUnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkaXZpZGVyIGJldHdlZW4gc2VjdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcmV2aWV3UGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZGl2aWRlciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYmctZGl2aWRlci1zdWJ0bGUnKVxuICAgICAgZXhwZWN0KGRpdmlkZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU3RhdGUgTWFuYWdlbWVudCBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGVtcHR5IGRhdGFzb3VyY2Ugc3RhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgZGF0YXNvdXJjZSBzdGF0ZSB3aGVuIERhdGFTb3VyY2Ugc2VsZWN0cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc291cmNlT3B0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlRGF0YXNvdXJjZU9wdGlvbih7IHZhbHVlOiAnbm9kZS0xJywgbGFiZWw6ICdOb2RlIDEnIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1ub2RlLTEnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZSgnbm9kZS0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGFzb3VyY2Ugbm9kZUlkIHRvIFByb2Nlc3NEb2N1bWVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YXNvdXJjZU9wdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZURhdGFzb3VyY2VPcHRpb24oeyB2YWx1ZTogJ3Rlc3Qtbm9kZScsIGxhYmVsOiAnVGVzdCBOb2RlJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcmV2aWV3UGFuZWwgLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tdGVzdC1ub2RlJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFByb2Nlc3NEb2N1bWVudHMgcmVjZWl2ZXMgdGhlIG5vZGVJZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1ub2RlLWlkJykudGV4dENvbnRlbnQpLnRvQmUoJ3Rlc3Qtbm9kZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHRvZ2dsZUlucHV0RmllbGRQcmV2aWV3UGFuZWwgd2hlbiBjbG9zZSBidXR0b24gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJldmlld1BhbmVsIC8+KVxuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrVG9nZ2xlSW5wdXRGaWVsZFByZXZpZXdQYW5lbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGNsb3NlIGJ1dHRvbiBjbGlja3MnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1RvZ2dsZUlucHV0RmllbGRQcmV2aWV3UGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkYXRhc291cmNlIHNlbGVjdGlvbiBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzb3VyY2VPcHRpb25zID0gW1xuICAgICAgICBjcmVhdGVEYXRhc291cmNlT3B0aW9uKHsgdmFsdWU6ICdub2RlLTEnLCBsYWJlbDogJ05vZGUgMScgfSksXG4gICAgICAgIGNyZWF0ZURhdGFzb3VyY2VPcHRpb24oeyB2YWx1ZTogJ25vZGUtMicsIGxhYmVsOiAnTm9kZSAyJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcmV2aWV3UGFuZWwgLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tbm9kZS0xJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1ub2RlLWlkJykudGV4dENvbnRlbnQpLnRvQmUoJ25vZGUtMScpXG5cbiAgICAgIC8vIEFjdCAtIENoYW5nZSBzZWxlY3Rpb25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1ub2RlLTInKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZSgnbm9kZS0yJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRmxvYXRpbmcgUmlnaHQgQmVoYXZpb3IgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRmxvYXRpbmcgUmlnaHQgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBmbG9hdGluZyByaWdodCBzdHlsZXMgd2hlbiBmbG9hdGluZ1JpZ2h0IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlRmxvYXRpbmdSaWdodC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBmbG9hdGluZ1JpZ2h0OiB0cnVlLFxuICAgICAgICBmbG9hdGluZ1JpZ2h0V2lkdGg6IDQwMCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwYW5lbCA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3QocGFuZWwuY2xhc3NOYW1lKS50b0NvbnRhaW4oJ2Fic29sdXRlJylcbiAgICAgIGV4cGVjdChwYW5lbC5jbGFzc05hbWUpLnRvQ29udGFpbigncmlnaHQtMCcpXG4gICAgICBleHBlY3QocGFuZWwuc3R5bGUud2lkdGgpLnRvQmUoJzQwMHB4JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgYXBwbHkgZmxvYXRpbmcgcmlnaHQgc3R5bGVzIHdoZW4gZmxvYXRpbmdSaWdodCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VGbG9hdGluZ1JpZ2h0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGZsb2F0aW5nUmlnaHQ6IGZhbHNlLFxuICAgICAgICBmbG9hdGluZ1JpZ2h0V2lkdGg6IDQ4MCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwYW5lbCA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3QocGFuZWwuY2xhc3NOYW1lKS5ub3QudG9Db250YWluKCdhYnNvbHV0ZScpXG4gICAgICBleHBlY3QocGFuZWwuc3R5bGUud2lkdGgpLnRvQmUoJzQ4MHB4JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2lkdGggd2hlbiBmbG9hdGluZ1JpZ2h0V2lkdGggY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VGbG9hdGluZ1JpZ2h0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGZsb2F0aW5nUmlnaHQ6IGZhbHNlLFxuICAgICAgICBmbG9hdGluZ1JpZ2h0V2lkdGg6IDYwMCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwYW5lbCA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3QocGFuZWwuc3R5bGUud2lkdGgpLnRvQmUoJzYwMHB4JylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBoYW5kbGVDbG9zZVByZXZpZXdQYW5lbCBjYWxsYmFjaycsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJldmlld1BhbmVsIC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFRlc3RXcmFwcGVyPlxuICAgICAgICAgIDxQcmV2aWV3UGFuZWwgLz5cbiAgICAgICAgPC9UZXN0V3JhcHBlcj4sXG4gICAgICApXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tUb2dnbGVJbnB1dEZpZWxkUHJldmlld1BhbmVsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRhdGFzb3VyY2Ugb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc291cmNlT3B0aW9ucyA9IFtdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJldmlld1BhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RhdGEtc291cmNlLW9wdGlvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1ub2RlLWlkJykudGV4dENvbnRlbnQpLnRvQmUoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJhcGlkIGRhdGFzb3VyY2Ugc2VsZWN0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc291cmNlT3B0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlRGF0YXNvdXJjZU9wdGlvbih7IHZhbHVlOiAnbm9kZS0xJywgbGFiZWw6ICdOb2RlIDEnIH0pLFxuICAgICAgICBjcmVhdGVEYXRhc291cmNlT3B0aW9uKHsgdmFsdWU6ICdub2RlLTInLCBsYWJlbDogJ05vZGUgMicgfSksXG4gICAgICAgIGNyZWF0ZURhdGFzb3VyY2VPcHRpb24oeyB2YWx1ZTogJ25vZGUtMycsIGxhYmVsOiAnTm9kZSAzJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcmV2aWV3UGFuZWwgLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tbm9kZS0xJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tbm9kZS0yJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tbm9kZS0zJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIEZpbmFsIHNlbGVjdGlvbiBzaG91bGQgYmUgbm9kZS0zXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZSgnbm9kZS0zJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRGF0YVNvdXJjZSBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0RhdGFTb3VyY2UnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tQaXBlbGluZUlkID0gJ3Rlc3QtcGlwZWxpbmUtaWQnXG4gICAgbW9ja1ByZVByb2Nlc3NpbmdQYXJhbXNEYXRhID0gdW5kZWZpbmVkXG4gICAgbW9ja0RhdGFzb3VyY2VPcHRpb25zID0gW11cbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc3RlcCBvbmUgdGl0bGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8RGF0YVNvdXJjZSBvblNlbGVjdD17b25TZWxlY3R9IGRhdGFTb3VyY2VOb2RlSWQ9XCJcIiAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwucHJldmlldy5zdGVwT25lVGl0bGUnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBEYXRhU291cmNlT3B0aW9ucyBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8RGF0YVNvdXJjZSBvblNlbGVjdD17b25TZWxlY3R9IGRhdGFTb3VyY2VOb2RlSWQ9XCJcIiAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkYXRhLXNvdXJjZS1vcHRpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGFTb3VyY2VOb2RlSWQgdG8gRGF0YVNvdXJjZU9wdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8RGF0YVNvdXJjZSBvblNlbGVjdD17b25TZWxlY3R9IGRhdGFTb3VyY2VOb2RlSWQ9XCJ0ZXN0LW5vZGUtaWRcIiAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZShcbiAgICAgICAgJ3Rlc3Qtbm9kZS1pZCcsXG4gICAgICApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByb3BzIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJvcHMgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkYXRhU291cmNlTm9kZUlkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TZWxlY3QgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8RGF0YVNvdXJjZSBvblNlbGVjdD17b25TZWxlY3R9IGRhdGFTb3VyY2VOb2RlSWQ9XCJcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IGRhdGFTb3VyY2VOb2RlSWQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TZWxlY3QgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyhcbiAgICAgICAgPERhdGFTb3VyY2Ugb25TZWxlY3Q9e29uU2VsZWN0fSBkYXRhU291cmNlTm9kZUlkPVwibm9kZS0xXCIgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1ub2RlLWlkJykudGV4dENvbnRlbnQpLnRvQmUoJ25vZGUtMScpXG5cbiAgICAgIC8vIEFjdCAtIENoYW5nZSBub2RlSWRcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8VGVzdFdyYXBwZXI+XG4gICAgICAgICAgPERhdGFTb3VyY2Ugb25TZWxlY3Q9e29uU2VsZWN0fSBkYXRhU291cmNlTm9kZUlkPVwibm9kZS0yXCIgLz5cbiAgICAgICAgPC9UZXN0V3JhcHBlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1ub2RlLWlkJykudGV4dENvbnRlbnQpLnRvQmUoJ25vZGUtMicpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEFQSSBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdBUEkgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmZXRjaCBwcmUtcHJvY2Vzc2luZyBwYXJhbXMgd2hlbiBwaXBlbGluZUlkIGFuZCBub2RlSWQgYXJlIHByZXNlbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcbiAgICAgIG1vY2tQcmVQcm9jZXNzaW5nUGFyYW1zRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGVzOiBbY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgpXSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8RGF0YVNvdXJjZSBvblNlbGVjdD17b25TZWxlY3R9IGRhdGFTb3VyY2VOb2RlSWQ9XCJ0ZXN0LW5vZGVcIiAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gRm9ybSBzaG91bGQgcmVuZGVyIHdpdGggZmV0Y2hlZCB2YXJpYWJsZXNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC10ZXN0X3ZhcmlhYmxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBmb3JtIGZpZWxkcyB3aGVuIHBhcmFtcyBkYXRhIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TZWxlY3QgPSB2aS5mbigpXG4gICAgICBtb2NrUHJlUHJvY2Vzc2luZ1BhcmFtc0RhdGEgPSB7IHZhcmlhYmxlczogW10gfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxEYXRhU291cmNlIG9uU2VsZWN0PXtvblNlbGVjdH0gZGF0YVNvdXJjZU5vZGVJZD1cInRlc3Qtbm9kZVwiIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZmllbGQtdGVzdF92YXJpYWJsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcGFyYW1zIGRhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcbiAgICAgIG1vY2tQcmVQcm9jZXNzaW5nUGFyYW1zRGF0YSA9IHVuZGVmaW5lZFxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxEYXRhU291cmNlIG9uU2VsZWN0PXtvblNlbGVjdH0gZGF0YVNvdXJjZU5vZGVJZD1cIlwiIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JzXG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwucHJldmlldy5zdGVwT25lVGl0bGUnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVc2VyIEludGVyYWN0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblNlbGVjdCB3aGVuIGRhdGFzb3VyY2Ugb3B0aW9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcbiAgICAgIG1vY2tEYXRhc291cmNlT3B0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlRGF0YXNvdXJjZU9wdGlvbih7IHZhbHVlOiAnc2VsZWN0ZWQtbm9kZScsIGxhYmVsOiAnU2VsZWN0ZWQnIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxEYXRhU291cmNlIG9uU2VsZWN0PXtvblNlbGVjdH0gZGF0YVNvdXJjZU5vZGVJZD1cIlwiIC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9uLXNlbGVjdGVkLW5vZGUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIG5vZGVJZDogJ3NlbGVjdGVkLW5vZGUnLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCAoUmVhY3QubWVtbyknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8RGF0YVNvdXJjZSBvblNlbGVjdD17b25TZWxlY3R9IGRhdGFTb3VyY2VOb2RlSWQ9XCJub2RlLTFcIiAvPixcbiAgICAgIClcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPFRlc3RXcmFwcGVyPlxuICAgICAgICAgIDxEYXRhU291cmNlIG9uU2VsZWN0PXtvblNlbGVjdH0gZGF0YVNvdXJjZU5vZGVJZD1cIm5vZGUtMVwiIC8+XG4gICAgICAgIDwvVGVzdFdyYXBwZXI+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIG5vdCBjYXVzZSBhZGRpdGlvbmFsIHJlbmRlcnNcbiAgICAgIGV4cGVjdChcbiAgICAgICAgc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmlucHV0RmllbGRQYW5lbC5wcmV2aWV3LnN0ZXBPbmVUaXRsZScpLFxuICAgICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIHBpcGVsaW5lSWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcbiAgICAgIG1vY2tQaXBlbGluZUlkID0gbnVsbFxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxEYXRhU291cmNlIG9uU2VsZWN0PXtvblNlbGVjdH0gZGF0YVNvdXJjZU5vZGVJZD1cInRlc3Qtbm9kZVwiIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JzXG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwucHJldmlldy5zdGVwT25lVGl0bGUnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gZGF0YVNvdXJjZU5vZGVJZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoXG4gICAgICAgIDxEYXRhU291cmNlXG4gICAgICAgICAgb25TZWxlY3Q9e29uU2VsZWN0fVxuICAgICAgICAgIGRhdGFTb3VyY2VOb2RlSWQ9XCJub2RlLXdpdGgtc3BlY2lhbC1jaGFyc18xMjNcIlxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZShcbiAgICAgICAgJ25vZGUtd2l0aC1zcGVjaWFsLWNoYXJzXzEyMycsXG4gICAgICApXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFByb2Nlc3NEb2N1bWVudHMgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdQcm9jZXNzRG9jdW1lbnRzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrUGlwZWxpbmVJZCA9ICd0ZXN0LXBpcGVsaW5lLWlkJ1xuICAgIG1vY2tQcm9jZXNzaW5nUGFyYW1zRGF0YSA9IHVuZGVmaW5lZFxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdGVwIHR3byB0aXRsZScsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwiXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuaW5wdXRGaWVsZFBhbmVsLnByZXZpZXcuc3RlcFR3b1RpdGxlJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRm9ybSBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUHJvY2Vzc2luZ1BhcmFtc0RhdGEgPSB7XG4gICAgICAgIHZhcmlhYmxlczogW2NyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoeyB2YXJpYWJsZTogJ3Byb2Nlc3NfdmFyJyB9KV0sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwidGVzdC1ub2RlXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEZvcm0gc2hvdWxkIGJlIHJlbmRlcmVkXG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwucHJldmlldy5zdGVwVHdvVGl0bGUnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBQcm9wcyBWYXJpYXRpb25zIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZGF0YVNvdXJjZU5vZGVJZCcsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwiXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuaW5wdXRGaWVsZFBhbmVsLnByZXZpZXcuc3RlcFR3b1RpdGxlJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IGRhdGFTb3VyY2VOb2RlSWQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwibm9kZS0xXCIgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuaW5wdXRGaWVsZFBhbmVsLnByZXZpZXcuc3RlcFR3b1RpdGxlJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gQ2hhbmdlIG5vZGVJZFxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUZXN0V3JhcHBlcj5cbiAgICAgICAgICA8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwibm9kZS0yXCIgLz5cbiAgICAgICAgPC9UZXN0V3JhcHBlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuaW5wdXRGaWVsZFBhbmVsLnByZXZpZXcuc3RlcFR3b1RpdGxlJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQVBJIEludGVncmF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0FQSSBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZldGNoIHByb2Nlc3NpbmcgcGFyYW1zIHdoZW4gcGlwZWxpbmVJZCBhbmQgbm9kZUlkIGFyZSBwcmVzZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1Byb2Nlc3NpbmdQYXJhbXNEYXRhID0ge1xuICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnY2h1bmtfc2l6ZScsXG4gICAgICAgICAgICBsYWJlbDogJ0NodW5rIFNpemUnLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgZGF0YVNvdXJjZU5vZGVJZD1cInRlc3Qtbm9kZVwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1jaHVua19zaXplJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBmb3JtIGZpZWxkcyB3aGVuIHBhcmFtcyBkYXRhIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1Byb2Nlc3NpbmdQYXJhbXNEYXRhID0geyB2YXJpYWJsZXM6IFtdIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcm9jZXNzRG9jdW1lbnRzIGRhdGFTb3VyY2VOb2RlSWQ9XCJ0ZXN0LW5vZGVcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2ZpZWxkLWNodW5rX3NpemUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHBhcmFtcyBkYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1Byb2Nlc3NpbmdQYXJhbXNEYXRhID0gdW5kZWZpbmVkXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwiXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgIGV4cGVjdChcbiAgICAgICAgc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmlucHV0RmllbGRQYW5lbC5wcmV2aWV3LnN0ZXBUd29UaXRsZScpLFxuICAgICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG11bHRpcGxlIGZvcm0gZmllbGRzIGZyb20gcGFyYW1zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1Byb2Nlc3NpbmdQYXJhbXNEYXRhID0ge1xuICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiAndmFyMScsXG4gICAgICAgICAgICBsYWJlbDogJ1ZhcmlhYmxlIDEnLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoe1xuICAgICAgICAgICAgdmFyaWFibGU6ICd2YXIyJyxcbiAgICAgICAgICAgIGxhYmVsOiAnVmFyaWFibGUgMicsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwidGVzdC1ub2RlXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXZhcjEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC12YXIyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgKFJlYWN0Lm1lbW8pJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKFxuICAgICAgICA8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwibm9kZS0xXCIgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggc2FtZSBwcm9wc1xuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUZXN0V3JhcHBlcj5cbiAgICAgICAgICA8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwibm9kZS0xXCIgLz5cbiAgICAgICAgPC9UZXN0V3JhcHBlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgcmVuZGVyIHdpdGhvdXQgaXNzdWVzXG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwucHJldmlldy5zdGVwVHdvVGl0bGUnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBwaXBlbGluZUlkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1BpcGVsaW5lSWQgPSBudWxsXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UHJvY2Vzc0RvY3VtZW50cyBkYXRhU291cmNlTm9kZUlkPVwidGVzdC1ub2RlXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgIGV4cGVjdChcbiAgICAgICAgc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmlucHV0RmllbGRQYW5lbC5wcmV2aWV3LnN0ZXBUd29UaXRsZScpLFxuICAgICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBkYXRhU291cmNlTm9kZUlkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ05vZGVJZCA9ICdhJy5yZXBlYXQoMTAwKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByb2Nlc3NEb2N1bWVudHMgZGF0YVNvdXJjZU5vZGVJZD17bG9uZ05vZGVJZH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuaW5wdXRGaWVsZFBhbmVsLnByZXZpZXcuc3RlcFR3b1RpdGxlJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRm9ybSBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0Zvcm0nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmb3JtIGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxGb3JtIHZhcmlhYmxlcz17W119IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZvcm0gZmllbGRzIGZvciBlYWNoIHZhcmlhYmxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW1xuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKHsgdmFyaWFibGU6ICdmaWVsZDEnLCBsYWJlbDogJ0ZpZWxkIDEnIH0pLFxuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKHsgdmFyaWFibGU6ICdmaWVsZDInLCBsYWJlbDogJ0ZpZWxkIDInIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWZpZWxkMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1maWVsZDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBubyBmaWVsZHMgd2hlbiB2YXJpYWJsZXMgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXtbXX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKC9eZmllbGQtLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByb3BzIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJvcHMgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaWZmZXJlbnQgdmFyaWFibGUgdHlwZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoe1xuICAgICAgICAgIHZhcmlhYmxlOiAndGV4dF92YXInLFxuICAgICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgICAgfSksXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoe1xuICAgICAgICAgIHZhcmlhYmxlOiAnbnVtYmVyX3ZhcicsXG4gICAgICAgICAgdHlwZTogUGlwZWxpbmVJbnB1dFZhclR5cGUubnVtYmVyLFxuICAgICAgICB9KSxcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7XG4gICAgICAgICAgdmFyaWFibGU6ICdzZWxlY3RfdmFyJyxcbiAgICAgICAgICB0eXBlOiBQaXBlbGluZUlucHV0VmFyVHlwZS5zZWxlY3QsXG4gICAgICAgICAgb3B0aW9uczogWydvcHQxJywgJ29wdDInXSxcbiAgICAgICAgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8Rm9ybSB2YXJpYWJsZXM9e3ZhcmlhYmxlc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtdGV4dF92YXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbnVtYmVyX3ZhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1zZWxlY3RfdmFyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmFyaWFibGVzIHdpdGggZGVmYXVsdCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoe1xuICAgICAgICAgIHZhcmlhYmxlOiAnd2l0aF9kZWZhdWx0JyxcbiAgICAgICAgICBkZWZhdWx0X3ZhbHVlOiAnZGVmYXVsdF90ZXh0JyxcbiAgICAgICAgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8Rm9ybSB2YXJpYWJsZXM9e3ZhcmlhYmxlc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtd2l0aF9kZWZhdWx0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmFyaWFibGVzIHdpdGggYWxsIG9wdGlvbmFsIGZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IFtcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7XG4gICAgICAgICAgdmFyaWFibGU6ICdmdWxsX3ZhcicsXG4gICAgICAgICAgbGFiZWw6ICdGdWxsIFZhcmlhYmxlJyxcbiAgICAgICAgICBtYXhfbGVuZ3RoOiAxMDAwLFxuICAgICAgICAgIGRlZmF1bHRfdmFsdWU6ICdkZWZhdWx0JyxcbiAgICAgICAgICBwbGFjZWhvbGRlcjogJ0VudGVyIGhlcmUnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHRvb2x0aXBzOiAnVGhpcyBpcyBhIHRvb2x0aXAnLFxuICAgICAgICAgIHVuaXQ6ICd1bml0cycsXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWZ1bGxfdmFyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRm9ybSBCZWhhdmlvciBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdGb3JtIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcHJldmVudCBkZWZhdWx0IGZvcm0gc3VibWlzc2lvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IFtjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCldXG4gICAgICBjb25zdCBwcmV2ZW50RGVmYXVsdE1vY2sgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+KVxuICAgICAgY29uc3QgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJykhXG5cbiAgICAgIC8vIENyZWF0ZSBhbmQgZGlzcGF0Y2ggc3VibWl0IGV2ZW50XG4gICAgICBjb25zdCBzdWJtaXRFdmVudCA9IG5ldyBFdmVudCgnc3VibWl0JywgeyBidWJibGVzOiB0cnVlLCBjYW5jZWxhYmxlOiB0cnVlIH0pXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoc3VibWl0RXZlbnQsICdwcmV2ZW50RGVmYXVsdCcsIHtcbiAgICAgICAgdmFsdWU6IHByZXZlbnREZWZhdWx0TW9jayxcbiAgICAgIH0pXG4gICAgICBmb3JtLmRpc3BhdGNoRXZlbnQoc3VibWl0RXZlbnQpXG5cbiAgICAgIC8vIEFzc2VydCAtIEZvcm0gc2hvdWxkIHByZXZlbnQgZGVmYXVsdCBzdWJtaXNzaW9uXG4gICAgICBleHBlY3QocHJldmVudERlZmF1bHRNb2NrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGZvcm0gdG8gZWFjaCBmaWVsZCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7IHZhcmlhYmxlOiAndGVzdF92YXInIH0pXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tcmVmJykudGV4dENvbnRlbnQpLnRvQmUoJ2hhcy1mb3JtJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtZW1vaXplIGluaXRpYWxEYXRhIHdoZW4gdmFyaWFibGVzIGRvIG5vdCBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgpXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+KVxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxUZXN0V3JhcHBlcj5cbiAgICAgICAgICA8Rm9ybSB2YXJpYWJsZXM9e3ZhcmlhYmxlc30gLz5cbiAgICAgICAgPC9UZXN0V3JhcHBlcj4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgcmVuZGVyIHdpdGhvdXQgaXNzdWVzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC10ZXN0X3ZhcmlhYmxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtZW1vaXplIGNvbmZpZ3VyYXRpb25zIHdoZW4gdmFyaWFibGVzIGRvIG5vdCBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoeyB2YXJpYWJsZTogJ3ZhcjEnIH0pLFxuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKHsgdmFyaWFibGU6ICd2YXIyJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxGb3JtIHZhcmlhYmxlcz17dmFyaWFibGVzfSAvPilcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHZhcmlhYmxlcyByZWZlcmVuY2VcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8VGVzdFdyYXBwZXI+XG4gICAgICAgICAgPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+XG4gICAgICAgIDwvVGVzdFdyYXBwZXI+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXZhcjEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtdmFyMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB2YXJpYWJsZXMgYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUHJvdmlkZXJzKDxGb3JtIHZhcmlhYmxlcz17W119IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoL15maWVsZC0vKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2luZ2xlIHZhcmlhYmxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW2NyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoeyB2YXJpYWJsZTogJ3NpbmdsZScgfSldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8Rm9ybSB2YXJpYWJsZXM9e3ZhcmlhYmxlc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtc2luZ2xlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWFueSB2YXJpYWJsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAyMCB9LCAoXywgaSkgPT5cbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7IHZhcmlhYmxlOiBgdmFyXyR7aX1gLCBsYWJlbDogYFZhciAke2l9YCB9KSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxGb3JtIHZhcmlhYmxlcz17dmFyaWFibGVzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC12YXJfMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC12YXJfMTknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2YXJpYWJsZXMgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gbmFtZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoe1xuICAgICAgICAgIHZhcmlhYmxlOiAndmFyX3dpdGhfdW5kZXJzY29yZScsXG4gICAgICAgICAgbGFiZWw6ICdWYXJpYWJsZSB3aXRoIDxzcGVjaWFsPiAmIFwiY2hhcnNcIicsXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXZhcl93aXRoX3VuZGVyc2NvcmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2YXJpYWJsZXMgd2l0aCB1bmljb2RlIGxhYmVscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IFtcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7XG4gICAgICAgICAgdmFyaWFibGU6ICd1bmljb2RlX3ZhcicsXG4gICAgICAgICAgbGFiZWw6ICfkuK3mlofmoIfnrb4g8J+OiScsXG4gICAgICAgICAgdG9vbHRpcHM6ICfjg4Tjg7zjg6vjg4Hjg4Pjg5cnLFxuICAgICAgICB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxGb3JtIHZhcmlhYmxlcz17dmFyaWFibGVzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC11bmljb2RlX3ZhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn5Lit5paH5qCH562+IPCfjoknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2YXJpYWJsZXMgd2l0aCBlbXB0eSBzdHJpbmcgZGVmYXVsdCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoe1xuICAgICAgICAgIHZhcmlhYmxlOiAnZW1wdHlfZGVmYXVsdCcsXG4gICAgICAgICAgZGVmYXVsdF92YWx1ZTogJycsXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWVtcHR5X2RlZmF1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2YXJpYWJsZXMgd2l0aCB6ZXJvIG1heF9sZW5ndGgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoe1xuICAgICAgICAgIHZhcmlhYmxlOiAnemVyb19sZW5ndGgnLFxuICAgICAgICAgIG1heF9sZW5ndGg6IDAsXG4gICAgICAgIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPEZvcm0gdmFyaWFibGVzPXt2YXJpYWJsZXN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLXplcm9fbGVuZ3RoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW50ZWdyYXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1ByZXZpZXcgUGFuZWwgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tVc2VGbG9hdGluZ1JpZ2h0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBmbG9hdGluZ1JpZ2h0OiBmYWxzZSxcbiAgICAgIGZsb2F0aW5nUmlnaHRXaWR0aDogNDgwLFxuICAgIH0pXG4gICAgbW9ja1BpcGVsaW5lSWQgPSAndGVzdC1waXBlbGluZS1pZCdcbiAgICBtb2NrUHJlUHJvY2Vzc2luZ1BhcmFtc0RhdGEgPSB1bmRlZmluZWRcbiAgICBtb2NrUHJvY2Vzc2luZ1BhcmFtc0RhdGEgPSB1bmRlZmluZWRcbiAgICBtb2NrRGF0YXNvdXJjZU9wdGlvbnMgPSBbXVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRW5kLXRvLUVuZCBGbG93IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VuZC10by1FbmQgRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgcHJldmlldyBmbG93OiBzZWxlY3QgZGF0YXNvdXJjZSAtPiBzaG93IGZvcm1zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzb3VyY2VPcHRpb25zID0gW1xuICAgICAgICBjcmVhdGVEYXRhc291cmNlT3B0aW9uKHsgdmFsdWU6ICdub2RlLTEnLCBsYWJlbDogJ0xvY2FsIEZpbGUnIH0pLFxuICAgICAgXVxuICAgICAgbW9ja1ByZVByb2Nlc3NpbmdQYXJhbXNEYXRhID0ge1xuICAgICAgICB2YXJpYWJsZXM6IFtcbiAgICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnc291cmNlX3ZhcicsXG4gICAgICAgICAgICBsYWJlbDogJ1NvdXJjZSBWYXJpYWJsZScsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9XG4gICAgICBtb2NrUHJvY2Vzc2luZ1BhcmFtc0RhdGEgPSB7XG4gICAgICAgIHZhcmlhYmxlczogW1xuICAgICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoe1xuICAgICAgICAgICAgdmFyaWFibGU6ICdwcm9jZXNzX3ZhcicsXG4gICAgICAgICAgICBsYWJlbDogJ1Byb2Nlc3MgVmFyaWFibGUnLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFByZXZpZXdQYW5lbCAvPilcblxuICAgICAgLy8gU2VsZWN0IGRhdGFzb3VyY2VcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1ub2RlLTEnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQm90aCBmb3JtcyBzaG91bGQgc2hvdyB0aGVpciBmaWVsZHNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1zb3VyY2VfdmFyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtcHJvY2Vzc192YXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgYm90aCBmb3JtcyB3aGVuIGRhdGFzb3VyY2UgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc291cmNlT3B0aW9ucyA9IFtcbiAgICAgICAgY3JlYXRlRGF0YXNvdXJjZU9wdGlvbih7IHZhbHVlOiAnbm9kZS0xJywgbGFiZWw6ICdOb2RlIDEnIH0pLFxuICAgICAgICBjcmVhdGVEYXRhc291cmNlT3B0aW9uKHsgdmFsdWU6ICdub2RlLTInLCBsYWJlbDogJ05vZGUgMicgfSksXG4gICAgICBdXG4gICAgICBtb2NrUHJlUHJvY2Vzc2luZ1BhcmFtc0RhdGEgPSB7XG4gICAgICAgIHZhcmlhYmxlczogW2NyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoeyB2YXJpYWJsZTogJ3ByZV92YXInIH0pXSxcbiAgICAgIH1cbiAgICAgIG1vY2tQcm9jZXNzaW5nUGFyYW1zRGF0YSA9IHtcbiAgICAgICAgdmFyaWFibGVzOiBbY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSh7IHZhcmlhYmxlOiAncHJvY192YXInIH0pXSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcmV2aWV3UGFuZWwgLz4pXG5cbiAgICAgIC8vIFNlbGVjdCBmaXJzdCBkYXRhc291cmNlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tbm9kZS0xJykpXG5cbiAgICAgIC8vIEFzc2VydCBpbml0aWFsIHNlbGVjdGlvblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1cnJlbnQtbm9kZS1pZCcpLnRleHRDb250ZW50KS50b0JlKCdub2RlLTEnKVxuICAgICAgfSlcblxuICAgICAgLy8gU2VsZWN0IHNlY29uZCBkYXRhc291cmNlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tbm9kZS0yJykpXG5cbiAgICAgIC8vIEFzc2VydCB1cGRhdGVkIHNlbGVjdGlvblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1cnJlbnQtbm9kZS1pZCcpLnRleHRDb250ZW50KS50b0JlKCdub2RlLTInKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcG9uZW50IENvbW11bmljYXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ29tcG9uZW50IENvbW11bmljYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3Qgbm9kZUlkIGZyb20gUHJldmlld1BhbmVsIHRvIGNoaWxkIGNvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YXNvdXJjZU9wdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZURhdGFzb3VyY2VPcHRpb24oeyB2YWx1ZTogJ2NvbW11bmljYXRlZC1ub2RlJywgbGFiZWw6ICdOb2RlJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcmV2aWV3UGFuZWwgLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tY29tbXVuaWNhdGVkLW5vZGUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZShcbiAgICAgICAgJ2NvbW11bmljYXRlZC1ub2RlJyxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU3RhdGUgUGVyc2lzdGVuY2UgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnU3RhdGUgUGVyc2lzdGVuY2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBkYXRhc291cmNlIHNlbGVjdGlvbiB3aXRoaW4gc2FtZSByZW5kZXIgY3ljbGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YXNvdXJjZU9wdGlvbnMgPSBbXG4gICAgICAgIGNyZWF0ZURhdGFzb3VyY2VPcHRpb24oeyB2YWx1ZTogJ3BlcnNpc3RlbnQtbm9kZScsIGxhYmVsOiAnUGVyc2lzdGVudCcgfSksXG4gICAgICAgIGNyZWF0ZURhdGFzb3VyY2VPcHRpb24oeyB2YWx1ZTogJ290aGVyLW5vZGUnLCBsYWJlbDogJ090aGVyJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQcmV2aWV3UGFuZWwgLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tcGVyc2lzdGVudC1ub2RlJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNlbGVjdGlvbiBzaG91bGQgYmUgbWFpbnRhaW5lZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1ub2RlLWlkJykudGV4dENvbnRlbnQpLnRvQmUoXG4gICAgICAgICdwZXJzaXN0ZW50LW5vZGUnLFxuICAgICAgKVxuXG4gICAgICAvLyBDaGFuZ2Ugc2VsZWN0aW9uIGFuZCB2ZXJpZnkgc3RhdGUgdXBkYXRlcyBjb3JyZWN0bHlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1vdGhlci1ub2RlJykpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LW5vZGUtaWQnKS50ZXh0Q29udGVudCkudG9CZShcbiAgICAgICAgJ290aGVyLW5vZGUnLFxuICAgICAgKVxuXG4gICAgICAvLyBHbyBiYWNrIHRvIG9yaWdpbmFsIGFuZCB2ZXJpZnlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1wZXJzaXN0ZW50LW5vZGUnKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1cnJlbnQtbm9kZS1pZCcpLnRleHRDb250ZW50KS50b0JlKFxuICAgICAgICAncGVyc2lzdGVudC1ub2RlJyxcbiAgICAgIClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==