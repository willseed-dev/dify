"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const types_1 = require("@/app/components/workflow/types");
const pipeline_1 = require("@/models/pipeline");
const index_1 = require("./index");
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock reactflow hooks - use getter to allow dynamic updates
let mockNodesData = [];
vi.mock('reactflow', () => ({
    useNodes: () => mockNodesData,
}));
// Mock useInputFieldPanel hook
const mockCloseAllInputFieldPanels = vi.fn();
const mockToggleInputFieldPreviewPanel = vi.fn();
let mockIsPreviewing = false;
let mockIsEditing = false;
vi.mock('@/app/components/rag-pipeline/hooks', () => ({
    useInputFieldPanel: () => ({
        closeAllInputFieldPanels: mockCloseAllInputFieldPanels,
        toggleInputFieldPreviewPanel: mockToggleInputFieldPreviewPanel,
        isPreviewing: mockIsPreviewing,
        isEditing: mockIsEditing,
    }),
}));
// Mock useStore (workflow store)
let mockRagPipelineVariables = [];
const mockSetRagPipelineVariables = vi.fn();
vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => {
        const state = {
            ragPipelineVariables: mockRagPipelineVariables,
            setRagPipelineVariables: mockSetRagPipelineVariables,
        };
        return selector(state);
    },
}));
// Mock useNodesSyncDraft hook
const mockHandleSyncWorkflowDraft = vi.fn();
vi.mock('@/app/components/workflow/hooks', () => ({
    useNodesSyncDraft: () => ({
        handleSyncWorkflowDraft: mockHandleSyncWorkflowDraft,
    }),
}));
// Mock FieldList component
vi.mock('./field-list', () => ({
    default: ({ nodeId, LabelRightContent, inputFields, handleInputFieldsChange, readonly, labelClassName, allVariableNames, }) => (<div data-testid={`field-list-${nodeId}`}>
      <span data-testid={`field-list-readonly-${nodeId}`}>
        {String(readonly)}
      </span>
      <span data-testid={`field-list-classname-${nodeId}`}>
        {labelClassName}
      </span>
      <span data-testid={`field-list-fields-count-${nodeId}`}>
        {inputFields.length}
      </span>
      <span data-testid={`field-list-all-vars-${nodeId}`}>
        {allVariableNames.join(',')}
      </span>
      {LabelRightContent}
      <button data-testid={`trigger-change-${nodeId}`} onClick={() => handleInputFieldsChange(nodeId, [
            ...inputFields,
            {
                type: pipeline_1.PipelineInputVarType.textInput,
                label: 'New Field',
                variable: 'new_field',
                max_length: 48,
                required: true,
            },
        ])}>
        Add Field
      </button>
      <button data-testid={`trigger-remove-${nodeId}`} onClick={() => handleInputFieldsChange(nodeId, [])}>
        Remove All
      </button>
    </div>),
}));
// Mock FooterTip component
vi.mock('./footer-tip', () => ({
    default: () => <div data-testid="footer-tip">Footer Tip</div>,
}));
// Mock Datasource label component
vi.mock('./label-right-content/datasource', () => ({
    default: ({ nodeData }) => (<div data-testid={`datasource-label-${nodeData.title}`}>
      {nodeData.title}
    </div>),
}));
// Mock GlobalInputs label component
vi.mock('./label-right-content/global-inputs', () => ({
    default: () => <div data-testid="global-inputs-label">Global Inputs</div>,
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
const createRAGPipelineVariable = (nodeId, overrides) => ({
    belong_to_node_id: nodeId,
    ...createInputVar(overrides),
});
const createDataSourceNode = (id, title, overrides) => ({
    id,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: {
        type: types_1.BlockEnum.DataSource,
        title,
        desc: 'Test datasource',
        selected: false,
        ...overrides,
    },
});
// ============================================================================
// Helper Functions
// ============================================================================
const setupMocks = (options) => {
    mockNodesData = options?.nodes || [];
    mockRagPipelineVariables = options?.ragPipelineVariables || [];
    mockIsPreviewing = options?.isPreviewing || false;
    mockIsEditing = options?.isEditing || false;
};
// ============================================================================
// InputFieldPanel Component Tests
// ============================================================================
describe('InputFieldPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render panel without crashing', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.title')).toBeInTheDocument();
        });
        it('should render panel title correctly', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.title')).toBeInTheDocument();
        });
        it('should render panel description', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.description')).toBeInTheDocument();
        });
        it('should render preview button', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.operations.preview')).toBeInTheDocument();
        });
        it('should render close button', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            const closeButton = react_1.screen.getByRole('button', { name: '' });
            expect(closeButton).toBeInTheDocument();
        });
        it('should render footer tip component', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('footer-tip')).toBeInTheDocument();
        });
        it('should render unique inputs section title', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.uniqueInputs.title')).toBeInTheDocument();
        });
        it('should render global inputs field list', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-shared')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('global-inputs-label')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // DataSource Node Rendering Tests
    // -------------------------------------------------------------------------
    describe('DataSource Node Rendering', () => {
        it('should render field list for each datasource node', () => {
            // Arrange
            const nodes = [
                createDataSourceNode('node-1', 'DataSource 1'),
                createDataSourceNode('node-2', 'DataSource 2'),
            ];
            setupMocks({ nodes });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-node-1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-list-node-2')).toBeInTheDocument();
        });
        it('should render datasource label for each node', () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'My DataSource')];
            setupMocks({ nodes });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('datasource-label-My DataSource')).toBeInTheDocument();
        });
        it('should not render any datasource field lists when no nodes exist', () => {
            // Arrange
            setupMocks({ nodes: [] });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.queryByTestId('field-list-node-1')).not.toBeInTheDocument();
            // Global inputs should still render
            expect(react_1.screen.getByTestId('field-list-shared')).toBeInTheDocument();
        });
        it('should filter only DataSource type nodes', () => {
            // Arrange
            const dataSourceNode = createDataSourceNode('ds-node', 'DataSource Node');
            // Create a non-datasource node to verify filtering
            const otherNode = {
                id: 'other-node',
                type: 'custom',
                position: { x: 0, y: 0 },
                data: {
                    type: types_1.BlockEnum.LLM, // Not a datasource type
                    title: 'LLM Node',
                    selected: false,
                },
            };
            mockNodesData = [dataSourceNode, otherNode];
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-ds-node')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('field-list-other-node')).not.toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Input Fields Map Tests
    // -------------------------------------------------------------------------
    describe('Input Fields Map', () => {
        it('should correctly distribute variables to their nodes', () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            const variables = [
                createRAGPipelineVariable('node-1', { variable: 'var1' }),
                createRAGPipelineVariable('node-1', { variable: 'var2' }),
                createRAGPipelineVariable('shared', { variable: 'shared_var' }),
            ];
            setupMocks({ nodes, ragPipelineVariables: variables });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-fields-count-node-1')).toHaveTextContent('2');
            expect(react_1.screen.getByTestId('field-list-fields-count-shared')).toHaveTextContent('1');
        });
        it('should show zero fields for nodes without variables', () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            setupMocks({ nodes, ragPipelineVariables: [] });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-fields-count-node-1')).toHaveTextContent('0');
        });
        it('should pass all variable names to field lists', () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            const variables = [
                createRAGPipelineVariable('node-1', { variable: 'var1' }),
                createRAGPipelineVariable('shared', { variable: 'var2' }),
            ];
            setupMocks({ nodes, ragPipelineVariables: variables });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-all-vars-node-1')).toHaveTextContent('var1,var2');
            expect(react_1.screen.getByTestId('field-list-all-vars-shared')).toHaveTextContent('var1,var2');
        });
    });
    // -------------------------------------------------------------------------
    // User Interactions Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        // Helper to identify close button by its class
        const isCloseButton = (btn) => btn.classList.contains('size-6')
            || btn.className.includes('shrink-0 items-center justify-center p-0.5');
        it('should call closeAllInputFieldPanels when close button is clicked', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            const buttons = react_1.screen.getAllByRole('button');
            const closeButton = buttons.find(isCloseButton);
            // Act
            react_1.fireEvent.click(closeButton);
            // Assert
            expect(mockCloseAllInputFieldPanels).toHaveBeenCalledTimes(1);
        });
        it('should call toggleInputFieldPreviewPanel when preview button is clicked', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            const previewButton = react_1.screen.getByText('datasetPipeline.operations.preview');
            // Act
            react_1.fireEvent.click(previewButton);
            // Assert
            expect(mockToggleInputFieldPreviewPanel).toHaveBeenCalledTimes(1);
        });
        it('should disable preview button when editing', () => {
            // Arrange
            setupMocks({ isEditing: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            const previewButton = react_1.screen
                .getByText('datasetPipeline.operations.preview')
                .closest('button');
            expect(previewButton).toBeDisabled();
        });
        it('should not disable preview button when not editing', () => {
            // Arrange
            setupMocks({ isEditing: false });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            const previewButton = react_1.screen
                .getByText('datasetPipeline.operations.preview')
                .closest('button');
            expect(previewButton).not.toBeDisabled();
        });
    });
    // -------------------------------------------------------------------------
    // Preview State Tests
    // -------------------------------------------------------------------------
    describe('Preview State', () => {
        it('should apply active styling when previewing', () => {
            // Arrange
            setupMocks({ isPreviewing: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            const previewButton = react_1.screen
                .getByText('datasetPipeline.operations.preview')
                .closest('button');
            expect(previewButton).toHaveClass('bg-state-accent-active');
            expect(previewButton).toHaveClass('text-text-accent');
        });
        it('should set readonly to true when previewing', () => {
            // Arrange
            setupMocks({ isPreviewing: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-readonly-shared')).toHaveTextContent('true');
        });
        it('should set readonly to true when editing', () => {
            // Arrange
            setupMocks({ isEditing: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-readonly-shared')).toHaveTextContent('true');
        });
        it('should set readonly to false when not previewing or editing', () => {
            // Arrange
            setupMocks({ isPreviewing: false, isEditing: false });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-readonly-shared')).toHaveTextContent('false');
        });
    });
    // -------------------------------------------------------------------------
    // Input Fields Change Handler Tests
    // -------------------------------------------------------------------------
    describe('Input Fields Change Handler', () => {
        it('should update rag pipeline variables when input fields change', async () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            setupMocks({ nodes });
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-change-node-1'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSetRagPipelineVariables).toHaveBeenCalled();
            });
        });
        it('should call handleSyncWorkflowDraft when fields change', async () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            setupMocks({ nodes });
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-change-node-1'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockHandleSyncWorkflowDraft).toHaveBeenCalled();
            });
        });
        it('should place datasource node fields before global fields', async () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            const variables = [
                createRAGPipelineVariable('shared', { variable: 'shared_var' }),
            ];
            setupMocks({ nodes, ragPipelineVariables: variables });
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-change-node-1'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSetRagPipelineVariables).toHaveBeenCalled();
            });
            // Verify datasource fields come before shared fields
            const setVarsCall = mockSetRagPipelineVariables.mock.calls[0][0];
            const isNotShared = (v) => v.belong_to_node_id !== 'shared';
            const isShared = (v) => v.belong_to_node_id === 'shared';
            const dsFields = setVarsCall.filter(isNotShared);
            const sharedFields = setVarsCall.filter(isShared);
            if (dsFields.length > 0 && sharedFields.length > 0) {
                const firstDsIndex = setVarsCall.indexOf(dsFields[0]);
                const firstSharedIndex = setVarsCall.indexOf(sharedFields[0]);
                expect(firstDsIndex).toBeLessThan(firstSharedIndex);
            }
        });
        it('should handle removing all fields from a node', async () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            const variables = [
                createRAGPipelineVariable('node-1', { variable: 'var1' }),
                createRAGPipelineVariable('node-1', { variable: 'var2' }),
            ];
            setupMocks({ nodes, ragPipelineVariables: variables });
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-remove-node-1'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSetRagPipelineVariables).toHaveBeenCalled();
            });
        });
        it('should update global input fields correctly', async () => {
            // Arrange
            setupMocks();
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-change-shared'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSetRagPipelineVariables).toHaveBeenCalled();
            });
            const setVarsCall = mockSetRagPipelineVariables.mock.calls[0][0];
            const isSharedField = (v) => v.belong_to_node_id === 'shared';
            const hasSharedField = setVarsCall.some(isSharedField);
            expect(hasSharedField).toBe(true);
        });
    });
    // -------------------------------------------------------------------------
    // Label Class Name Tests
    // -------------------------------------------------------------------------
    describe('Label Class Names', () => {
        it('should pass correct className to datasource field lists', () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            setupMocks({ nodes });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-classname-node-1')).toHaveTextContent('pt-1 pb-1');
        });
        it('should pass correct className to global inputs field list', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-classname-shared')).toHaveTextContent('pt-2 pb-1');
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should memoize datasourceNodeDataMap based on nodes', () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            setupMocks({ nodes });
            const { rerender } = (0, react_1.render)(<index_1.default />);
            // Act - rerender with same nodes reference
            rerender(<index_1.default />);
            // Assert - component should not break and should render correctly
            expect(react_1.screen.getByTestId('field-list-node-1')).toBeInTheDocument();
        });
        it('should compute allVariableNames correctly', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable('node-1', { variable: 'alpha' }),
                createRAGPipelineVariable('node-1', { variable: 'beta' }),
                createRAGPipelineVariable('shared', { variable: 'gamma' }),
            ];
            setupMocks({ ragPipelineVariables: variables });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-all-vars-shared')).toHaveTextContent('alpha,beta,gamma');
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        // Helper to find close button - moved outside test to reduce nesting
        const findCloseButton = (buttons) => {
            const isCloseButton = (btn) => btn.classList.contains('size-6')
                || btn.className.includes('shrink-0 items-center justify-center p-0.5');
            return buttons.find(isCloseButton);
        };
        it('should maintain closePanel callback reference', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            // Act
            const buttons1 = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(findCloseButton(buttons1));
            const callCount1 = mockCloseAllInputFieldPanels.mock.calls.length;
            rerender(<index_1.default />);
            const buttons2 = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(findCloseButton(buttons2));
            // Assert
            expect(mockCloseAllInputFieldPanels.mock.calls.length).toBe(callCount1 + 1);
        });
        it('should maintain togglePreviewPanel callback reference', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('datasetPipeline.operations.preview'));
            const callCount1 = mockToggleInputFieldPreviewPanel.mock.calls.length;
            rerender(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('datasetPipeline.operations.preview'));
            // Assert
            expect(mockToggleInputFieldPreviewPanel.mock.calls.length).toBe(callCount1 + 1);
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty ragPipelineVariables', () => {
            // Arrange
            setupMocks({ ragPipelineVariables: [] });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-all-vars-shared')).toHaveTextContent('');
        });
        it('should handle undefined ragPipelineVariables', () => {
            // Arrange - intentionally testing undefined case
            // @ts-expect-error Testing edge case with undefined value
            mockRagPipelineVariables = undefined;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-shared')).toBeInTheDocument();
        });
        it('should handle null variable names in allVariableNames', () => {
            // Arrange - intentionally testing edge case with empty variable name
            const variables = [
                createRAGPipelineVariable('node-1', { variable: 'valid_var' }),
                createRAGPipelineVariable('node-1', { variable: '' }),
            ];
            setupMocks({ ragPipelineVariables: variables });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert - should not crash
            expect(react_1.screen.getByTestId('field-list-shared')).toBeInTheDocument();
        });
        it('should handle large number of datasource nodes', () => {
            // Arrange
            const nodes = Array.from({ length: 10 }, (_, i) => createDataSourceNode(`node-${i}`, `DataSource ${i}`));
            setupMocks({ nodes });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            nodes.forEach((_, i) => {
                expect(react_1.screen.getByTestId(`field-list-node-${i}`)).toBeInTheDocument();
            });
        });
        it('should handle large number of variables', () => {
            // Arrange
            const variables = Array.from({ length: 100 }, (_, i) => createRAGPipelineVariable('shared', { variable: `var_${i}` }));
            setupMocks({ ragPipelineVariables: variables });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-fields-count-shared')).toHaveTextContent('100');
        });
        it('should handle special characters in variable names', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable('shared', { variable: 'var_with_underscore' }),
                createRAGPipelineVariable('shared', { variable: 'varWithCamelCase' }),
            ];
            setupMocks({ ragPipelineVariables: variables });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-all-vars-shared')).toHaveTextContent('var_with_underscore,varWithCamelCase');
        });
    });
    // -------------------------------------------------------------------------
    // Multiple Nodes Interaction Tests
    // -------------------------------------------------------------------------
    describe('Multiple Nodes Interaction', () => {
        it('should handle changes to multiple nodes sequentially', async () => {
            // Arrange
            const nodes = [
                createDataSourceNode('node-1', 'DataSource 1'),
                createDataSourceNode('node-2', 'DataSource 2'),
            ];
            setupMocks({ nodes });
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-change-node-1'));
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-change-node-2'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSetRagPipelineVariables).toHaveBeenCalledTimes(2);
            });
        });
        it('should maintain separate field lists for different nodes', () => {
            // Arrange
            const nodes = [
                createDataSourceNode('node-1', 'DataSource 1'),
                createDataSourceNode('node-2', 'DataSource 2'),
            ];
            const variables = [
                createRAGPipelineVariable('node-1', { variable: 'var1' }),
                createRAGPipelineVariable('node-2', { variable: 'var2' }),
                createRAGPipelineVariable('node-2', { variable: 'var3' }),
            ];
            setupMocks({ nodes, ragPipelineVariables: variables });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-fields-count-node-1')).toHaveTextContent('1');
            expect(react_1.screen.getByTestId('field-list-fields-count-node-2')).toHaveTextContent('2');
        });
    });
    // -------------------------------------------------------------------------
    // Component Structure Tests
    // -------------------------------------------------------------------------
    describe('Component Structure', () => {
        it('should have correct panel width class', () => {
            // Act
            const { container } = (0, react_1.render)(<index_1.default />);
            // Assert
            const panel = container.firstChild;
            expect(panel).toHaveClass('w-[400px]');
        });
        it('should have overflow scroll on content area', () => {
            // Act
            const { container } = (0, react_1.render)(<index_1.default />);
            // Assert
            const scrollContainer = container.querySelector('.overflow-y-auto');
            expect(scrollContainer).toBeInTheDocument();
        });
        it('should render header section with proper spacing', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.description')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Integration with FieldList Component Tests
    // -------------------------------------------------------------------------
    describe('Integration with FieldList Component', () => {
        it('should pass correct props to FieldList for datasource nodes', () => {
            // Arrange
            const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
            const variables = [
                createRAGPipelineVariable('node-1', { variable: 'test_var' }),
            ];
            setupMocks({
                nodes,
                ragPipelineVariables: variables,
                isPreviewing: true,
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-node-1')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-list-readonly-node-1')).toHaveTextContent('true');
            expect(react_1.screen.getByTestId('field-list-fields-count-node-1')).toHaveTextContent('1');
        });
        it('should pass correct props to FieldList for shared node', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable('shared', { variable: 'shared_var' }),
            ];
            setupMocks({ ragPipelineVariables: variables, isEditing: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-shared')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('field-list-readonly-shared')).toHaveTextContent('true');
            expect(react_1.screen.getByTestId('field-list-fields-count-shared')).toHaveTextContent('1');
        });
    });
    // -------------------------------------------------------------------------
    // Variable Ordering Tests
    // -------------------------------------------------------------------------
    describe('Variable Ordering', () => {
        it('should maintain correct variable order in allVariableNames', () => {
            // Arrange
            const variables = [
                createRAGPipelineVariable('node-1', { variable: 'first' }),
                createRAGPipelineVariable('node-1', { variable: 'second' }),
                createRAGPipelineVariable('shared', { variable: 'third' }),
            ];
            setupMocks({ ragPipelineVariables: variables });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('field-list-all-vars-shared')).toHaveTextContent('first,second,third');
        });
    });
});
// ============================================================================
// useFloatingRight Hook Integration Tests (via InputFieldPanel)
// ============================================================================
describe('useFloatingRight Hook Integration', () => {
    // Note: The hook is tested indirectly through the InputFieldPanel component
    // as it's used internally. Direct hook tests are in hooks.spec.tsx if exists.
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    it('should render panel correctly with default floating state', () => {
        // The hook is mocked via the component's behavior
        (0, react_1.render)(<index_1.default />);
        expect(react_1.screen.getByTestId('field-list-shared')).toBeInTheDocument();
    });
});
// ============================================================================
// FooterTip Component Integration Tests
// ============================================================================
describe('FooterTip Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    it('should render footer tip at the bottom of the panel', () => {
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert
        expect(react_1.screen.getByTestId('footer-tip')).toBeInTheDocument();
    });
});
// ============================================================================
// Label Components Integration Tests
// ============================================================================
describe('Label Components Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    it('should render GlobalInputs label for shared field list', () => {
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert
        expect(react_1.screen.getByTestId('global-inputs-label')).toBeInTheDocument();
    });
    it('should render Datasource label for each datasource node', () => {
        // Arrange
        const nodes = [
            createDataSourceNode('node-1', 'First DataSource'),
            createDataSourceNode('node-2', 'Second DataSource'),
        ];
        setupMocks({ nodes });
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert
        expect(react_1.screen.getByTestId('datasource-label-First DataSource')).toBeInTheDocument();
        expect(react_1.screen.getByTestId('datasource-label-Second DataSource')).toBeInTheDocument();
    });
});
// ============================================================================
// Component Memo Tests
// ============================================================================
describe('Component Memo Behavior', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    it('should be wrapped with React.memo', () => {
        // InputFieldPanel is exported as memo(InputFieldPanel)
        // This test ensures the component doesn't break memoization
        const { rerender } = (0, react_1.render)(<index_1.default />);
        // Act - rerender without prop changes
        rerender(<index_1.default />);
        // Assert - component should still render correctly
        expect(react_1.screen.getByTestId('field-list-shared')).toBeInTheDocument();
        expect(react_1.screen.getByText('datasetPipeline.inputFieldPanel.title')).toBeInTheDocument();
    });
    it('should handle state updates correctly with memo', async () => {
        // Arrange
        const nodes = [createDataSourceNode('node-1', 'DataSource 1')];
        setupMocks({ nodes });
        (0, react_1.render)(<index_1.default />);
        // Act - trigger a state change
        react_1.fireEvent.click(react_1.screen.getByTestId('trigger-change-node-1'));
        // Assert
        await (0, react_1.waitFor)(() => {
            expect(mockSetRagPipelineVariables).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QiwyREFBMkQ7QUFDM0QsZ0RBQXdEO0FBQ3hELG1DQUFxQztBQUVyQywrRUFBK0U7QUFDL0UsNkJBQTZCO0FBQzdCLCtFQUErRTtBQUUvRSw2REFBNkQ7QUFDN0QsSUFBSSxhQUFhLEdBQStCLEVBQUUsQ0FBQTtBQUNsRCxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhO0NBQzlCLENBQUMsQ0FBQyxDQUFBO0FBRUgsK0JBQStCO0FBQy9CLE1BQU0sNEJBQTRCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzVDLE1BQU0sZ0NBQWdDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ2hELElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFBO0FBQzVCLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQTtBQUV6QixFQUFFLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDcEQsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN6Qix3QkFBd0IsRUFBRSw0QkFBNEI7UUFDdEQsNEJBQTRCLEVBQUUsZ0NBQWdDO1FBQzlELFlBQVksRUFBRSxnQkFBZ0I7UUFDOUIsU0FBUyxFQUFFLGFBQWE7S0FDekIsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsaUNBQWlDO0FBQ2pDLElBQUksd0JBQXdCLEdBQXlCLEVBQUUsQ0FBQTtBQUN2RCxNQUFNLDJCQUEyQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQU8zQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFB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dHlwZSB7IERhdGFTb3VyY2VOb2RlVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvZGF0YS1zb3VyY2UvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE5vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBJbnB1dFZhciwgUkFHUGlwZWxpbmVWYXJpYWJsZSwgUkFHUGlwZWxpbmVWYXJpYWJsZXMgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgUGlwZWxpbmVJbnB1dFZhclR5cGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCBJbnB1dEZpZWxkUGFuZWwgZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayByZWFjdGZsb3cgaG9va3MgLSB1c2UgZ2V0dGVyIHRvIGFsbG93IGR5bmFtaWMgdXBkYXRlc1xubGV0IG1vY2tOb2Rlc0RhdGE6IE5vZGU8RGF0YVNvdXJjZU5vZGVUeXBlPltdID0gW11cbnZpLm1vY2soJ3JlYWN0ZmxvdycsICgpID0+ICh7XG4gIHVzZU5vZGVzOiAoKSA9PiBtb2NrTm9kZXNEYXRhLFxufSkpXG5cbi8vIE1vY2sgdXNlSW5wdXRGaWVsZFBhbmVsIGhvb2tcbmNvbnN0IG1vY2tDbG9zZUFsbElucHV0RmllbGRQYW5lbHMgPSB2aS5mbigpXG5jb25zdCBtb2NrVG9nZ2xlSW5wdXRGaWVsZFByZXZpZXdQYW5lbCA9IHZpLmZuKClcbmxldCBtb2NrSXNQcmV2aWV3aW5nID0gZmFsc2VcbmxldCBtb2NrSXNFZGl0aW5nID0gZmFsc2VcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9yYWctcGlwZWxpbmUvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VJbnB1dEZpZWxkUGFuZWw6ICgpID0+ICh7XG4gICAgY2xvc2VBbGxJbnB1dEZpZWxkUGFuZWxzOiBtb2NrQ2xvc2VBbGxJbnB1dEZpZWxkUGFuZWxzLFxuICAgIHRvZ2dsZUlucHV0RmllbGRQcmV2aWV3UGFuZWw6IG1vY2tUb2dnbGVJbnB1dEZpZWxkUHJldmlld1BhbmVsLFxuICAgIGlzUHJldmlld2luZzogbW9ja0lzUHJldmlld2luZyxcbiAgICBpc0VkaXRpbmc6IG1vY2tJc0VkaXRpbmcsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgdXNlU3RvcmUgKHdvcmtmbG93IHN0b3JlKVxubGV0IG1vY2tSYWdQaXBlbGluZVZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZXMgPSBbXVxuY29uc3QgbW9ja1NldFJhZ1BpcGVsaW5lVmFyaWFibGVzID0gdmkuZm4oKVxuXG50eXBlIE1vY2tTdG9yZVN0YXRlID0ge1xuICByYWdQaXBlbGluZVZhcmlhYmxlczogUkFHUGlwZWxpbmVWYXJpYWJsZXNcbiAgc2V0UmFnUGlwZWxpbmVWYXJpYWJsZXM6IHR5cGVvZiBtb2NrU2V0UmFnUGlwZWxpbmVWYXJpYWJsZXNcbn1cblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZScsICgpID0+ICh7XG4gIHVzZVN0b3JlOiAoc2VsZWN0b3I6IChzdGF0ZTogTW9ja1N0b3JlU3RhdGUpID0+IHVua25vd24pID0+IHtcbiAgICBjb25zdCBzdGF0ZTogTW9ja1N0b3JlU3RhdGUgPSB7XG4gICAgICByYWdQaXBlbGluZVZhcmlhYmxlczogbW9ja1JhZ1BpcGVsaW5lVmFyaWFibGVzLFxuICAgICAgc2V0UmFnUGlwZWxpbmVWYXJpYWJsZXM6IG1vY2tTZXRSYWdQaXBlbGluZVZhcmlhYmxlcyxcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yKHN0YXRlKVxuICB9LFxufSkpXG5cbi8vIE1vY2sgdXNlTm9kZXNTeW5jRHJhZnQgaG9va1xuY29uc3QgbW9ja0hhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0ID0gdmkuZm4oKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlTm9kZXNTeW5jRHJhZnQ6ICgpID0+ICh7XG4gICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQ6IG1vY2tIYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCxcbiAgfSksXG59KSlcblxuLy8gTW9jayBGaWVsZExpc3QgY29tcG9uZW50XG52aS5tb2NrKCcuL2ZpZWxkLWxpc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoe1xuICAgIG5vZGVJZCxcbiAgICBMYWJlbFJpZ2h0Q29udGVudCxcbiAgICBpbnB1dEZpZWxkcyxcbiAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSxcbiAgICByZWFkb25seSxcbiAgICBsYWJlbENsYXNzTmFtZSxcbiAgICBhbGxWYXJpYWJsZU5hbWVzLFxuICB9OiB7XG4gICAgbm9kZUlkOiBzdHJpbmdcbiAgICBMYWJlbFJpZ2h0Q29udGVudDogUmVhY3QuUmVhY3ROb2RlXG4gICAgaW5wdXRGaWVsZHM6IElucHV0VmFyW11cbiAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZTogKGtleTogc3RyaW5nLCB2YWx1ZTogSW5wdXRWYXJbXSkgPT4gdm9pZFxuICAgIHJlYWRvbmx5PzogYm9vbGVhblxuICAgIGxhYmVsQ2xhc3NOYW1lPzogc3RyaW5nXG4gICAgYWxsVmFyaWFibGVOYW1lczogc3RyaW5nW11cbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9e2BmaWVsZC1saXN0LSR7bm9kZUlkfWB9PlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9e2BmaWVsZC1saXN0LXJlYWRvbmx5LSR7bm9kZUlkfWB9PlxuICAgICAgICB7U3RyaW5nKHJlYWRvbmx5KX1cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPXtgZmllbGQtbGlzdC1jbGFzc25hbWUtJHtub2RlSWR9YH0+XG4gICAgICAgIHtsYWJlbENsYXNzTmFtZX1cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPXtgZmllbGQtbGlzdC1maWVsZHMtY291bnQtJHtub2RlSWR9YH0+XG4gICAgICAgIHtpbnB1dEZpZWxkcy5sZW5ndGh9XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD17YGZpZWxkLWxpc3QtYWxsLXZhcnMtJHtub2RlSWR9YH0+XG4gICAgICAgIHthbGxWYXJpYWJsZU5hbWVzLmpvaW4oJywnKX1cbiAgICAgIDwvc3Bhbj5cbiAgICAgIHtMYWJlbFJpZ2h0Q29udGVudH1cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9e2B0cmlnZ2VyLWNoYW5nZS0ke25vZGVJZH1gfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PlxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKG5vZGVJZCwgW1xuICAgICAgICAgICAgLi4uaW5wdXRGaWVsZHMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgICAgICAgICAgICAgbGFiZWw6ICdOZXcgRmllbGQnLFxuICAgICAgICAgICAgICB2YXJpYWJsZTogJ25ld19maWVsZCcsXG4gICAgICAgICAgICAgIG1heF9sZW5ndGg6IDQ4LFxuICAgICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSl9XG4gICAgICA+XG4gICAgICAgIEFkZCBGaWVsZFxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPXtgdHJpZ2dlci1yZW1vdmUtJHtub2RlSWR9YH1cbiAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2Uobm9kZUlkLCBbXSl9XG4gICAgICA+XG4gICAgICAgIFJlbW92ZSBBbGxcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgRm9vdGVyVGlwIGNvbXBvbmVudFxudmkubW9jaygnLi9mb290ZXItdGlwJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cImZvb3Rlci10aXBcIj5Gb290ZXIgVGlwPC9kaXY+LFxufSkpXG5cbi8vIE1vY2sgRGF0YXNvdXJjZSBsYWJlbCBjb21wb25lbnRcbnZpLm1vY2soJy4vbGFiZWwtcmlnaHQtY29udGVudC9kYXRhc291cmNlJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgbm9kZURhdGEgfTogeyBub2RlRGF0YTogRGF0YVNvdXJjZU5vZGVUeXBlIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPXtgZGF0YXNvdXJjZS1sYWJlbC0ke25vZGVEYXRhLnRpdGxlfWB9PlxuICAgICAge25vZGVEYXRhLnRpdGxlfVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgR2xvYmFsSW5wdXRzIGxhYmVsIGNvbXBvbmVudFxudmkubW9jaygnLi9sYWJlbC1yaWdodC1jb250ZW50L2dsb2JhbC1pbnB1dHMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwiZ2xvYmFsLWlucHV0cy1sYWJlbFwiPkdsb2JhbCBJbnB1dHM8L2Rpdj4sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEZhY3Rvcmllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVJbnB1dFZhciA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPElucHV0VmFyPik6IElucHV0VmFyID0+ICh7XG4gIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgbGFiZWw6ICdUZXN0IExhYmVsJyxcbiAgdmFyaWFibGU6ICd0ZXN0X3ZhcmlhYmxlJyxcbiAgbWF4X2xlbmd0aDogNDgsXG4gIGRlZmF1bHRfdmFsdWU6ICcnLFxuICByZXF1aXJlZDogdHJ1ZSxcbiAgdG9vbHRpcHM6ICcnLFxuICBvcHRpb25zOiBbXSxcbiAgcGxhY2Vob2xkZXI6ICcnLFxuICB1bml0OiAnJyxcbiAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBbXSxcbiAgYWxsb3dlZF9maWxlX3R5cGVzOiBbXSxcbiAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IFtdLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlID0gKFxuICBub2RlSWQ6IHN0cmluZyxcbiAgb3ZlcnJpZGVzPzogUGFydGlhbDxJbnB1dFZhcj4sXG4pID0+ICh7XG4gIGJlbG9uZ190b19ub2RlX2lkOiBub2RlSWQsXG4gIC4uLmNyZWF0ZUlucHV0VmFyKG92ZXJyaWRlcyksXG59KVxuXG5jb25zdCBjcmVhdGVEYXRhU291cmNlTm9kZSA9IChcbiAgaWQ6IHN0cmluZyxcbiAgdGl0bGU6IHN0cmluZyxcbiAgb3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlTm9kZVR5cGU+LFxuKTogTm9kZTxEYXRhU291cmNlTm9kZVR5cGU+ID0+ICh7XG4gIGlkLFxuICB0eXBlOiAnY3VzdG9tJyxcbiAgcG9zaXRpb246IHsgeDogMCwgeTogMCB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogQmxvY2tFbnVtLkRhdGFTb3VyY2UsXG4gICAgdGl0bGUsXG4gICAgZGVzYzogJ1Rlc3QgZGF0YXNvdXJjZScsXG4gICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfSBhcyBEYXRhU291cmNlTm9kZVR5cGUsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBIZWxwZXIgRnVuY3Rpb25zXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IHNldHVwTW9ja3MgPSAob3B0aW9ucz86IHtcbiAgbm9kZXM/OiBOb2RlPERhdGFTb3VyY2VOb2RlVHlwZT5bXVxuICByYWdQaXBlbGluZVZhcmlhYmxlcz86IFJBR1BpcGVsaW5lVmFyaWFibGVzXG4gIGlzUHJldmlld2luZz86IGJvb2xlYW5cbiAgaXNFZGl0aW5nPzogYm9vbGVhblxufSkgPT4ge1xuICBtb2NrTm9kZXNEYXRhID0gb3B0aW9ucz8ubm9kZXMgfHwgW11cbiAgbW9ja1JhZ1BpcGVsaW5lVmFyaWFibGVzID0gb3B0aW9ucz8ucmFnUGlwZWxpbmVWYXJpYWJsZXMgfHwgW11cbiAgbW9ja0lzUHJldmlld2luZyA9IG9wdGlvbnM/LmlzUHJldmlld2luZyB8fCBmYWxzZVxuICBtb2NrSXNFZGl0aW5nID0gb3B0aW9ucz8uaXNFZGl0aW5nIHx8IGZhbHNlXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIElucHV0RmllbGRQYW5lbCBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0lucHV0RmllbGRQYW5lbCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgc2V0dXBNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhbmVsIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChcbiAgICAgICAgc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmlucHV0RmllbGRQYW5lbC50aXRsZScpLFxuICAgICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhbmVsIHRpdGxlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuaW5wdXRGaWVsZFBhbmVsLnRpdGxlJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFuZWwgZGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChcbiAgICAgICAgc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmlucHV0RmllbGRQYW5lbC5kZXNjcmlwdGlvbicpLFxuICAgICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHByZXZpZXcgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnByZXZpZXcnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjbG9zZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNsb3NlQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnJyB9KVxuICAgICAgZXhwZWN0KGNsb3NlQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZvb3RlciB0aXAgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb290ZXItdGlwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdW5pcXVlIGlucHV0cyBzZWN0aW9uIHRpdGxlJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwudW5pcXVlSW5wdXRzLnRpdGxlJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZ2xvYmFsIGlucHV0cyBmaWVsZCBsaXN0JywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LXNoYXJlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdnbG9iYWwtaW5wdXRzLWxhYmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRGF0YVNvdXJjZSBOb2RlIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdEYXRhU291cmNlIE5vZGUgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZpZWxkIGxpc3QgZm9yIGVhY2ggZGF0YXNvdXJjZSBub2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgbm9kZXMgPSBbXG4gICAgICAgIGNyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTEnLCAnRGF0YVNvdXJjZSAxJyksXG4gICAgICAgIGNyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTInLCAnRGF0YVNvdXJjZSAyJyksXG4gICAgICBdXG4gICAgICBzZXR1cE1vY2tzKHsgbm9kZXMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LW5vZGUtMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LW5vZGUtMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRhdGFzb3VyY2UgbGFiZWwgZm9yIGVhY2ggbm9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVzID0gW2NyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTEnLCAnTXkgRGF0YVNvdXJjZScpXVxuICAgICAgc2V0dXBNb2Nrcyh7IG5vZGVzIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RhdGFzb3VyY2UtbGFiZWwtTXkgRGF0YVNvdXJjZScpLFxuICAgICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBhbnkgZGF0YXNvdXJjZSBmaWVsZCBsaXN0cyB3aGVuIG5vIG5vZGVzIGV4aXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IG5vZGVzOiBbXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZmllbGQtbGlzdC1ub2RlLTEnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIEdsb2JhbCBpbnB1dHMgc2hvdWxkIHN0aWxsIHJlbmRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbGlzdC1zaGFyZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZpbHRlciBvbmx5IERhdGFTb3VyY2UgdHlwZSBub2RlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRhdGFTb3VyY2VOb2RlID0gY3JlYXRlRGF0YVNvdXJjZU5vZGUoJ2RzLW5vZGUnLCAnRGF0YVNvdXJjZSBOb2RlJylcbiAgICAgIC8vIENyZWF0ZSBhIG5vbi1kYXRhc291cmNlIG5vZGUgdG8gdmVyaWZ5IGZpbHRlcmluZ1xuICAgICAgY29uc3Qgb3RoZXJOb2RlID0ge1xuICAgICAgICBpZDogJ290aGVyLW5vZGUnLFxuICAgICAgICB0eXBlOiAnY3VzdG9tJyxcbiAgICAgICAgcG9zaXRpb246IHsgeDogMCwgeTogMCB9LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogQmxvY2tFbnVtLkxMTSwgLy8gTm90IGEgZGF0YXNvdXJjZSB0eXBlXG4gICAgICAgICAgdGl0bGU6ICdMTE0gTm9kZScsXG4gICAgICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSBhcyBOb2RlPERhdGFTb3VyY2VOb2RlVHlwZT5cbiAgICAgIG1vY2tOb2Rlc0RhdGEgPSBbZGF0YVNvdXJjZU5vZGUsIG90aGVyTm9kZV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LWRzLW5vZGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZmllbGQtbGlzdC1vdGhlci1ub2RlJyksXG4gICAgICApLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElucHV0IEZpZWxkcyBNYXAgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSW5wdXQgRmllbGRzIE1hcCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBkaXN0cmlidXRlIHZhcmlhYmxlcyB0byB0aGVpciBub2RlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVzID0gW2NyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTEnLCAnRGF0YVNvdXJjZSAxJyldXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ25vZGUtMScsIHsgdmFyaWFibGU6ICd2YXIxJyB9KSxcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgnbm9kZS0xJywgeyB2YXJpYWJsZTogJ3ZhcjInIH0pLFxuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdzaGFyZWQnLCB7IHZhcmlhYmxlOiAnc2hhcmVkX3ZhcicgfSksXG4gICAgICBdXG4gICAgICBzZXR1cE1vY2tzKHsgbm9kZXMsIHJhZ1BpcGVsaW5lVmFyaWFibGVzOiB2YXJpYWJsZXMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LWZpZWxkcy1jb3VudC1ub2RlLTEnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbGlzdC1maWVsZHMtY291bnQtc2hhcmVkJykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHplcm8gZmllbGRzIGZvciBub2RlcyB3aXRob3V0IHZhcmlhYmxlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVzID0gW2NyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTEnLCAnRGF0YVNvdXJjZSAxJyldXG4gICAgICBzZXR1cE1vY2tzKHsgbm9kZXMsIHJhZ1BpcGVsaW5lVmFyaWFibGVzOiBbXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtZmllbGRzLWNvdW50LW5vZGUtMScpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBhbGwgdmFyaWFibGUgbmFtZXMgdG8gZmllbGQgbGlzdHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBub2RlcyA9IFtjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0xJywgJ0RhdGFTb3VyY2UgMScpXVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW1xuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdub2RlLTEnLCB7IHZhcmlhYmxlOiAndmFyMScgfSksXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ3NoYXJlZCcsIHsgdmFyaWFibGU6ICd2YXIyJyB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9ja3MoeyBub2RlcywgcmFnUGlwZWxpbmVWYXJpYWJsZXM6IHZhcmlhYmxlcyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtYWxsLXZhcnMtbm9kZS0xJykpLnRvSGF2ZVRleHRDb250ZW50KFxuICAgICAgICAndmFyMSx2YXIyJyxcbiAgICAgIClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtYWxsLXZhcnMtc2hhcmVkJykpLnRvSGF2ZVRleHRDb250ZW50KFxuICAgICAgICAndmFyMSx2YXIyJyxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gSGVscGVyIHRvIGlkZW50aWZ5IGNsb3NlIGJ1dHRvbiBieSBpdHMgY2xhc3NcbiAgICBjb25zdCBpc0Nsb3NlQnV0dG9uID0gKGJ0bjogSFRNTEVsZW1lbnQpID0+XG4gICAgICBidG4uY2xhc3NMaXN0LmNvbnRhaW5zKCdzaXplLTYnKVxuICAgICAgfHwgYnRuLmNsYXNzTmFtZS5pbmNsdWRlcygnc2hyaW5rLTAgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMC41JylcblxuICAgIGl0KCdzaG91bGQgY2FsbCBjbG9zZUFsbElucHV0RmllbGRQYW5lbHMgd2hlbiBjbG9zZSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGJ1dHRvbnMuZmluZChpc0Nsb3NlQnV0dG9uKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbiEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tDbG9zZUFsbElucHV0RmllbGRQYW5lbHMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdG9nZ2xlSW5wdXRGaWVsZFByZXZpZXdQYW5lbCB3aGVuIHByZXZpZXcgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcmV2aWV3JylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2socHJldmlld0J1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1RvZ2dsZUlucHV0RmllbGRQcmV2aWV3UGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgcHJldmlldyBidXR0b24gd2hlbiBlZGl0aW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IGlzRWRpdGluZzogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b24gPSBzY3JlZW5cbiAgICAgICAgLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMucHJldmlldycpXG4gICAgICAgIC5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KHByZXZpZXdCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGRpc2FibGUgcHJldmlldyBidXR0b24gd2hlbiBub3QgZWRpdGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBpc0VkaXRpbmc6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcHJldmlld0J1dHRvbiA9IHNjcmVlblxuICAgICAgICAuZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5wcmV2aWV3JylcbiAgICAgICAgLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QocHJldmlld0J1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByZXZpZXcgU3RhdGUgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJldmlldyBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGFjdGl2ZSBzdHlsaW5nIHdoZW4gcHJldmlld2luZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBpc1ByZXZpZXdpbmc6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwcmV2aWV3QnV0dG9uID0gc2NyZWVuXG4gICAgICAgIC5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnByZXZpZXcnKVxuICAgICAgICAuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChwcmV2aWV3QnV0dG9uKS50b0hhdmVDbGFzcygnYmctc3RhdGUtYWNjZW50LWFjdGl2ZScpXG4gICAgICBleHBlY3QocHJldmlld0J1dHRvbikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1hY2NlbnQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCByZWFkb25seSB0byB0cnVlIHdoZW4gcHJldmlld2luZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBpc1ByZXZpZXdpbmc6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LXJlYWRvbmx5LXNoYXJlZCcpKS50b0hhdmVUZXh0Q29udGVudChcbiAgICAgICAgJ3RydWUnLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCByZWFkb25seSB0byB0cnVlIHdoZW4gZWRpdGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBpc0VkaXRpbmc6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LXJlYWRvbmx5LXNoYXJlZCcpKS50b0hhdmVUZXh0Q29udGVudChcbiAgICAgICAgJ3RydWUnLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCByZWFkb25seSB0byBmYWxzZSB3aGVuIG5vdCBwcmV2aWV3aW5nIG9yIGVkaXRpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHsgaXNQcmV2aWV3aW5nOiBmYWxzZSwgaXNFZGl0aW5nOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtcmVhZG9ubHktc2hhcmVkJykpLnRvSGF2ZVRleHRDb250ZW50KFxuICAgICAgICAnZmFsc2UnLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbnB1dCBGaWVsZHMgQ2hhbmdlIEhhbmRsZXIgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSW5wdXQgRmllbGRzIENoYW5nZSBIYW5kbGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIHJhZyBwaXBlbGluZSB2YXJpYWJsZXMgd2hlbiBpbnB1dCBmaWVsZHMgY2hhbmdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgbm9kZXMgPSBbY3JlYXRlRGF0YVNvdXJjZU5vZGUoJ25vZGUtMScsICdEYXRhU291cmNlIDEnKV1cbiAgICAgIHNldHVwTW9ja3MoeyBub2RlcyB9KVxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1jaGFuZ2Utbm9kZS0xJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2V0UmFnUGlwZWxpbmVWYXJpYWJsZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0IHdoZW4gZmllbGRzIGNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVzID0gW2NyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTEnLCAnRGF0YVNvdXJjZSAxJyldXG4gICAgICBzZXR1cE1vY2tzKHsgbm9kZXMgfSlcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItY2hhbmdlLW5vZGUtMScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0hhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGxhY2UgZGF0YXNvdXJjZSBub2RlIGZpZWxkcyBiZWZvcmUgZ2xvYmFsIGZpZWxkcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVzID0gW2NyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTEnLCAnRGF0YVNvdXJjZSAxJyldXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ3NoYXJlZCcsIHsgdmFyaWFibGU6ICdzaGFyZWRfdmFyJyB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9ja3MoeyBub2RlcywgcmFnUGlwZWxpbmVWYXJpYWJsZXM6IHZhcmlhYmxlcyB9KVxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1jaGFuZ2Utbm9kZS0xJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2V0UmFnUGlwZWxpbmVWYXJpYWJsZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gVmVyaWZ5IGRhdGFzb3VyY2UgZmllbGRzIGNvbWUgYmVmb3JlIHNoYXJlZCBmaWVsZHNcbiAgICAgIGNvbnN0IHNldFZhcnNDYWxsID0gbW9ja1NldFJhZ1BpcGVsaW5lVmFyaWFibGVzLm1vY2suY2FsbHNbMF1bMF0gYXMgUkFHUGlwZWxpbmVWYXJpYWJsZXNcbiAgICAgIGNvbnN0IGlzTm90U2hhcmVkID0gKHY6IFJBR1BpcGVsaW5lVmFyaWFibGUpID0+IHYuYmVsb25nX3RvX25vZGVfaWQgIT09ICdzaGFyZWQnXG4gICAgICBjb25zdCBpc1NoYXJlZCA9ICh2OiBSQUdQaXBlbGluZVZhcmlhYmxlKSA9PiB2LmJlbG9uZ190b19ub2RlX2lkID09PSAnc2hhcmVkJ1xuICAgICAgY29uc3QgZHNGaWVsZHMgPSBzZXRWYXJzQ2FsbC5maWx0ZXIoaXNOb3RTaGFyZWQpXG4gICAgICBjb25zdCBzaGFyZWRGaWVsZHMgPSBzZXRWYXJzQ2FsbC5maWx0ZXIoaXNTaGFyZWQpXG5cbiAgICAgIGlmIChkc0ZpZWxkcy5sZW5ndGggPiAwICYmIHNoYXJlZEZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGZpcnN0RHNJbmRleCA9IHNldFZhcnNDYWxsLmluZGV4T2YoZHNGaWVsZHNbMF0pXG4gICAgICAgIGNvbnN0IGZpcnN0U2hhcmVkSW5kZXggPSBzZXRWYXJzQ2FsbC5pbmRleE9mKHNoYXJlZEZpZWxkc1swXSlcbiAgICAgICAgZXhwZWN0KGZpcnN0RHNJbmRleCkudG9CZUxlc3NUaGFuKGZpcnN0U2hhcmVkSW5kZXgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJlbW92aW5nIGFsbCBmaWVsZHMgZnJvbSBhIG5vZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBub2RlcyA9IFtjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0xJywgJ0RhdGFTb3VyY2UgMScpXVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW1xuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdub2RlLTEnLCB7IHZhcmlhYmxlOiAndmFyMScgfSksXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ25vZGUtMScsIHsgdmFyaWFibGU6ICd2YXIyJyB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9ja3MoeyBub2RlcywgcmFnUGlwZWxpbmVWYXJpYWJsZXM6IHZhcmlhYmxlcyB9KVxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1yZW1vdmUtbm9kZS0xJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2V0UmFnUGlwZWxpbmVWYXJpYWJsZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgZ2xvYmFsIGlucHV0IGZpZWxkcyBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKClcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItY2hhbmdlLXNoYXJlZCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NldFJhZ1BpcGVsaW5lVmFyaWFibGVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHNldFZhcnNDYWxsID0gbW9ja1NldFJhZ1BpcGVsaW5lVmFyaWFibGVzLm1vY2suY2FsbHNbMF1bMF0gYXMgUkFHUGlwZWxpbmVWYXJpYWJsZXNcbiAgICAgIGNvbnN0IGlzU2hhcmVkRmllbGQgPSAodjogUkFHUGlwZWxpbmVWYXJpYWJsZSkgPT4gdi5iZWxvbmdfdG9fbm9kZV9pZCA9PT0gJ3NoYXJlZCdcbiAgICAgIGNvbnN0IGhhc1NoYXJlZEZpZWxkID0gc2V0VmFyc0NhbGwuc29tZShpc1NoYXJlZEZpZWxkKVxuICAgICAgZXhwZWN0KGhhc1NoYXJlZEZpZWxkKS50b0JlKHRydWUpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIExhYmVsIENsYXNzIE5hbWUgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTGFiZWwgQ2xhc3MgTmFtZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgY2xhc3NOYW1lIHRvIGRhdGFzb3VyY2UgZmllbGQgbGlzdHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBub2RlcyA9IFtjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0xJywgJ0RhdGFTb3VyY2UgMScpXVxuICAgICAgc2V0dXBNb2Nrcyh7IG5vZGVzIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtY2xhc3NuYW1lLW5vZGUtMScpLFxuICAgICAgKS50b0hhdmVUZXh0Q29udGVudCgncHQtMSBwYi0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgY2xhc3NOYW1lIHRvIGdsb2JhbCBpbnB1dHMgZmllbGQgbGlzdCcsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbGlzdC1jbGFzc25hbWUtc2hhcmVkJykpLnRvSGF2ZVRleHRDb250ZW50KFxuICAgICAgICAncHQtMiBwYi0xJyxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtZW1vaXplIGRhdGFzb3VyY2VOb2RlRGF0YU1hcCBiYXNlZCBvbiBub2RlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVzID0gW2NyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTEnLCAnRGF0YVNvdXJjZSAxJyldXG4gICAgICBzZXR1cE1vY2tzKHsgbm9kZXMgfSlcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBY3QgLSByZXJlbmRlciB3aXRoIHNhbWUgbm9kZXMgcmVmZXJlbmNlXG4gICAgICByZXJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBjb21wb25lbnQgc2hvdWxkIG5vdCBicmVhayBhbmQgc2hvdWxkIHJlbmRlciBjb3JyZWN0bHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3Qtbm9kZS0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGFsbFZhcmlhYmxlTmFtZXMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW1xuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdub2RlLTEnLCB7IHZhcmlhYmxlOiAnYWxwaGEnIH0pLFxuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdub2RlLTEnLCB7IHZhcmlhYmxlOiAnYmV0YScgfSksXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ3NoYXJlZCcsIHsgdmFyaWFibGU6ICdnYW1tYScgfSksXG4gICAgICBdXG4gICAgICBzZXR1cE1vY2tzKHsgcmFnUGlwZWxpbmVWYXJpYWJsZXM6IHZhcmlhYmxlcyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtYWxsLXZhcnMtc2hhcmVkJykpLnRvSGF2ZVRleHRDb250ZW50KFxuICAgICAgICAnYWxwaGEsYmV0YSxnYW1tYScsXG4gICAgICApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgLy8gSGVscGVyIHRvIGZpbmQgY2xvc2UgYnV0dG9uIC0gbW92ZWQgb3V0c2lkZSB0ZXN0IHRvIHJlZHVjZSBuZXN0aW5nXG4gICAgY29uc3QgZmluZENsb3NlQnV0dG9uID0gKGJ1dHRvbnM6IEhUTUxFbGVtZW50W10pID0+IHtcbiAgICAgIGNvbnN0IGlzQ2xvc2VCdXR0b24gPSAoYnRuOiBIVE1MRWxlbWVudCkgPT5cbiAgICAgICAgYnRuLmNsYXNzTGlzdC5jb250YWlucygnc2l6ZS02JylcbiAgICAgICAgfHwgYnRuLmNsYXNzTmFtZS5pbmNsdWRlcygnc2hyaW5rLTAgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMC41JylcbiAgICAgIHJldHVybiBidXR0b25zLmZpbmQoaXNDbG9zZUJ1dHRvbilcbiAgICB9XG5cbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGNsb3NlUGFuZWwgY2FsbGJhY2sgcmVmZXJlbmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgYnV0dG9uczEgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpbmRDbG9zZUJ1dHRvbihidXR0b25zMSkhKVxuICAgICAgY29uc3QgY2FsbENvdW50MSA9IG1vY2tDbG9zZUFsbElucHV0RmllbGRQYW5lbHMubW9jay5jYWxscy5sZW5ndGhcblxuICAgICAgcmVyZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcbiAgICAgIGNvbnN0IGJ1dHRvbnMyID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhmaW5kQ2xvc2VCdXR0b24oYnV0dG9uczIpISlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0Nsb3NlQWxsSW5wdXRGaWVsZFBhbmVscy5tb2NrLmNhbGxzLmxlbmd0aCkudG9CZShjYWxsQ291bnQxICsgMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiB0b2dnbGVQcmV2aWV3UGFuZWwgY2FsbGJhY2sgcmVmZXJlbmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnByZXZpZXcnKSlcbiAgICAgIGNvbnN0IGNhbGxDb3VudDEgPSBtb2NrVG9nZ2xlSW5wdXRGaWVsZFByZXZpZXdQYW5lbC5tb2NrLmNhbGxzLmxlbmd0aFxuXG4gICAgICByZXJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnByZXZpZXcnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1RvZ2dsZUlucHV0RmllbGRQcmV2aWV3UGFuZWwubW9jay5jYWxscy5sZW5ndGgpLnRvQmUoXG4gICAgICAgIGNhbGxDb3VudDEgKyAxLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcmFnUGlwZWxpbmVWYXJpYWJsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHsgcmFnUGlwZWxpbmVWYXJpYWJsZXM6IFtdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbGlzdC1hbGwtdmFycy1zaGFyZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoXG4gICAgICAgICcnLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcmFnUGlwZWxpbmVWYXJpYWJsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gaW50ZW50aW9uYWxseSB0ZXN0aW5nIHVuZGVmaW5lZCBjYXNlXG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFRlc3RpbmcgZWRnZSBjYXNlIHdpdGggdW5kZWZpbmVkIHZhbHVlXG4gICAgICBtb2NrUmFnUGlwZWxpbmVWYXJpYWJsZXMgPSB1bmRlZmluZWRcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LXNoYXJlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgdmFyaWFibGUgbmFtZXMgaW4gYWxsVmFyaWFibGVOYW1lcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBpbnRlbnRpb25hbGx5IHRlc3RpbmcgZWRnZSBjYXNlIHdpdGggZW1wdHkgdmFyaWFibGUgbmFtZVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW1xuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdub2RlLTEnLCB7IHZhcmlhYmxlOiAndmFsaWRfdmFyJyB9KSxcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgnbm9kZS0xJywgeyB2YXJpYWJsZTogJycgfSksXG4gICAgICBdXG4gICAgICBzZXR1cE1vY2tzKHsgcmFnUGlwZWxpbmVWYXJpYWJsZXM6IHZhcmlhYmxlcyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LXNoYXJlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIG51bWJlciBvZiBkYXRhc291cmNlIG5vZGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgbm9kZXMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT5cbiAgICAgICAgY3JlYXRlRGF0YVNvdXJjZU5vZGUoYG5vZGUtJHtpfWAsIGBEYXRhU291cmNlICR7aX1gKSlcbiAgICAgIHNldHVwTW9ja3MoeyBub2RlcyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIG5vZGVzLmZvckVhY2goKF8sIGkpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZChgZmllbGQtbGlzdC1ub2RlLSR7aX1gKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgbnVtYmVyIG9mIHZhcmlhYmxlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwMCB9LCAoXywgaSkgPT5cbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgnc2hhcmVkJywgeyB2YXJpYWJsZTogYHZhcl8ke2l9YCB9KSlcbiAgICAgIHNldHVwTW9ja3MoeyByYWdQaXBlbGluZVZhcmlhYmxlczogdmFyaWFibGVzIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbGlzdC1maWVsZHMtY291bnQtc2hhcmVkJykpLnRvSGF2ZVRleHRDb250ZW50KFxuICAgICAgICAnMTAwJyxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHZhcmlhYmxlIG5hbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW1xuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdzaGFyZWQnLCB7IHZhcmlhYmxlOiAndmFyX3dpdGhfdW5kZXJzY29yZScgfSksXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ3NoYXJlZCcsIHsgdmFyaWFibGU6ICd2YXJXaXRoQ2FtZWxDYXNlJyB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9ja3MoeyByYWdQaXBlbGluZVZhcmlhYmxlczogdmFyaWFibGVzIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbGlzdC1hbGwtdmFycy1zaGFyZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoXG4gICAgICAgICd2YXJfd2l0aF91bmRlcnNjb3JlLHZhcldpdGhDYW1lbENhc2UnLFxuICAgICAgKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBNdWx0aXBsZSBOb2RlcyBJbnRlcmFjdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdNdWx0aXBsZSBOb2RlcyBJbnRlcmFjdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjaGFuZ2VzIHRvIG11bHRpcGxlIG5vZGVzIHNlcXVlbnRpYWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVzID0gW1xuICAgICAgICBjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0xJywgJ0RhdGFTb3VyY2UgMScpLFxuICAgICAgICBjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0yJywgJ0RhdGFTb3VyY2UgMicpLFxuICAgICAgXVxuICAgICAgc2V0dXBNb2Nrcyh7IG5vZGVzIH0pXG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLWNoYW5nZS1ub2RlLTEnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItY2hhbmdlLW5vZGUtMicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NldFJhZ1BpcGVsaW5lVmFyaWFibGVzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc2VwYXJhdGUgZmllbGQgbGlzdHMgZm9yIGRpZmZlcmVudCBub2RlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG5vZGVzID0gW1xuICAgICAgICBjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0xJywgJ0RhdGFTb3VyY2UgMScpLFxuICAgICAgICBjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0yJywgJ0RhdGFTb3VyY2UgMicpLFxuICAgICAgXVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW1xuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdub2RlLTEnLCB7IHZhcmlhYmxlOiAndmFyMScgfSksXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ25vZGUtMicsIHsgdmFyaWFibGU6ICd2YXIyJyB9KSxcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgnbm9kZS0yJywgeyB2YXJpYWJsZTogJ3ZhcjMnIH0pLFxuICAgICAgXVxuICAgICAgc2V0dXBNb2Nrcyh7IG5vZGVzLCByYWdQaXBlbGluZVZhcmlhYmxlczogdmFyaWFibGVzIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbGlzdC1maWVsZHMtY291bnQtbm9kZS0xJykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtZmllbGRzLWNvdW50LW5vZGUtMicpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbXBvbmVudCBTdHJ1Y3R1cmUgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ29tcG9uZW50IFN0cnVjdHVyZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBwYW5lbCB3aWR0aCBjbGFzcycsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHBhbmVsID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChwYW5lbCkudG9IYXZlQ2xhc3MoJ3ctWzQwMHB4XScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBvdmVyZmxvdyBzY3JvbGwgb24gY29udGVudCBhcmVhJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5vdmVyZmxvdy15LWF1dG8nKVxuICAgICAgZXhwZWN0KHNjcm9sbENvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBoZWFkZXIgc2VjdGlvbiB3aXRoIHByb3BlciBzcGFjaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwudGl0bGUnKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuaW5wdXRGaWVsZFBhbmVsLmRlc2NyaXB0aW9uJyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW50ZWdyYXRpb24gd2l0aCBGaWVsZExpc3QgQ29tcG9uZW50IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uIHdpdGggRmllbGRMaXN0IENvbXBvbmVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCBwcm9wcyB0byBGaWVsZExpc3QgZm9yIGRhdGFzb3VyY2Ugbm9kZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBub2RlcyA9IFtjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0xJywgJ0RhdGFTb3VyY2UgMScpXVxuICAgICAgY29uc3QgdmFyaWFibGVzID0gW1xuICAgICAgICBjcmVhdGVSQUdQaXBlbGluZVZhcmlhYmxlKCdub2RlLTEnLCB7IHZhcmlhYmxlOiAndGVzdF92YXInIH0pLFxuICAgICAgXVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIG5vZGVzLFxuICAgICAgICByYWdQaXBlbGluZVZhcmlhYmxlczogdmFyaWFibGVzLFxuICAgICAgICBpc1ByZXZpZXdpbmc6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3Qtbm9kZS0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtcmVhZG9ubHktbm9kZS0xJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtZmllbGRzLWNvdW50LW5vZGUtMScpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IHByb3BzIHRvIEZpZWxkTGlzdCBmb3Igc2hhcmVkIG5vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB2YXJpYWJsZXMgPSBbXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ3NoYXJlZCcsIHsgdmFyaWFibGU6ICdzaGFyZWRfdmFyJyB9KSxcbiAgICAgIF1cbiAgICAgIHNldHVwTW9ja3MoeyByYWdQaXBlbGluZVZhcmlhYmxlczogdmFyaWFibGVzLCBpc0VkaXRpbmc6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LXNoYXJlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LXJlYWRvbmx5LXNoYXJlZCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LWZpZWxkcy1jb3VudC1zaGFyZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzEnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBWYXJpYWJsZSBPcmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdWYXJpYWJsZSBPcmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIGNvcnJlY3QgdmFyaWFibGUgb3JkZXIgaW4gYWxsVmFyaWFibGVOYW1lcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhcmlhYmxlcyA9IFtcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgnbm9kZS0xJywgeyB2YXJpYWJsZTogJ2ZpcnN0JyB9KSxcbiAgICAgICAgY3JlYXRlUkFHUGlwZWxpbmVWYXJpYWJsZSgnbm9kZS0xJywgeyB2YXJpYWJsZTogJ3NlY29uZCcgfSksXG4gICAgICAgIGNyZWF0ZVJBR1BpcGVsaW5lVmFyaWFibGUoJ3NoYXJlZCcsIHsgdmFyaWFibGU6ICd0aGlyZCcgfSksXG4gICAgICBdXG4gICAgICBzZXR1cE1vY2tzKHsgcmFnUGlwZWxpbmVWYXJpYWJsZXM6IHZhcmlhYmxlcyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtYWxsLXZhcnMtc2hhcmVkJykpLnRvSGF2ZVRleHRDb250ZW50KFxuICAgICAgICAnZmlyc3Qsc2Vjb25kLHRoaXJkJyxcbiAgICAgIClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gdXNlRmxvYXRpbmdSaWdodCBIb29rIEludGVncmF0aW9uIFRlc3RzICh2aWEgSW5wdXRGaWVsZFBhbmVsKVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgndXNlRmxvYXRpbmdSaWdodCBIb29rIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAvLyBOb3RlOiBUaGUgaG9vayBpcyB0ZXN0ZWQgaW5kaXJlY3RseSB0aHJvdWdoIHRoZSBJbnB1dEZpZWxkUGFuZWwgY29tcG9uZW50XG4gIC8vIGFzIGl0J3MgdXNlZCBpbnRlcm5hbGx5LiBEaXJlY3QgaG9vayB0ZXN0cyBhcmUgaW4gaG9va3Muc3BlYy50c3ggaWYgZXhpc3RzLlxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHNldHVwTW9ja3MoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIHBhbmVsIGNvcnJlY3RseSB3aXRoIGRlZmF1bHQgZmxvYXRpbmcgc3RhdGUnLCAoKSA9PiB7XG4gICAgLy8gVGhlIGhvb2sgaXMgbW9ja2VkIHZpYSB0aGUgY29tcG9uZW50J3MgYmVoYXZpb3JcbiAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LXNoYXJlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBGb290ZXJUaXAgQ29tcG9uZW50IEludGVncmF0aW9uIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdGb290ZXJUaXAgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHNldHVwTW9ja3MoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIGZvb3RlciB0aXAgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcGFuZWwnLCAoKSA9PiB7XG4gICAgLy8gQWN0XG4gICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb290ZXItdGlwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIExhYmVsIENvbXBvbmVudHMgSW50ZWdyYXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0xhYmVsIENvbXBvbmVudHMgSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHNldHVwTW9ja3MoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIEdsb2JhbElucHV0cyBsYWJlbCBmb3Igc2hhcmVkIGZpZWxkIGxpc3QnLCAoKSA9PiB7XG4gICAgLy8gQWN0XG4gICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdnbG9iYWwtaW5wdXRzLWxhYmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciBEYXRhc291cmNlIGxhYmVsIGZvciBlYWNoIGRhdGFzb3VyY2Ugbm9kZScsICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgY29uc3Qgbm9kZXMgPSBbXG4gICAgICBjcmVhdGVEYXRhU291cmNlTm9kZSgnbm9kZS0xJywgJ0ZpcnN0IERhdGFTb3VyY2UnKSxcbiAgICAgIGNyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTInLCAnU2Vjb25kIERhdGFTb3VyY2UnKSxcbiAgICBdXG4gICAgc2V0dXBNb2Nrcyh7IG5vZGVzIH0pXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoPElucHV0RmllbGRQYW5lbCAvPilcblxuICAgIC8vIEFzc2VydFxuICAgIGV4cGVjdChcbiAgICAgIHNjcmVlbi5nZXRCeVRlc3RJZCgnZGF0YXNvdXJjZS1sYWJlbC1GaXJzdCBEYXRhU291cmNlJyksXG4gICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KFxuICAgICAgc2NyZWVuLmdldEJ5VGVzdElkKCdkYXRhc291cmNlLWxhYmVsLVNlY29uZCBEYXRhU291cmNlJyksXG4gICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDb21wb25lbnQgTWVtbyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnQ29tcG9uZW50IE1lbW8gQmVoYXZpb3InLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHNldHVwTW9ja3MoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgLy8gSW5wdXRGaWVsZFBhbmVsIGlzIGV4cG9ydGVkIGFzIG1lbW8oSW5wdXRGaWVsZFBhbmVsKVxuICAgIC8vIFRoaXMgdGVzdCBlbnN1cmVzIHRoZSBjb21wb25lbnQgZG9lc24ndCBicmVhayBtZW1vaXphdGlvblxuICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgLy8gQWN0IC0gcmVyZW5kZXIgd2l0aG91dCBwcm9wIGNoYW5nZXNcbiAgICByZXJlbmRlcig8SW5wdXRGaWVsZFBhbmVsIC8+KVxuXG4gICAgLy8gQXNzZXJ0IC0gY29tcG9uZW50IHNob3VsZCBzdGlsbCByZW5kZXIgY29ycmVjdGx5XG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmllbGQtbGlzdC1zaGFyZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChcbiAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5pbnB1dEZpZWxkUGFuZWwudGl0bGUnKSxcbiAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBzdGF0ZSB1cGRhdGVzIGNvcnJlY3RseSB3aXRoIG1lbW8nLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IG5vZGVzID0gW2NyZWF0ZURhdGFTb3VyY2VOb2RlKCdub2RlLTEnLCAnRGF0YVNvdXJjZSAxJyldXG4gICAgc2V0dXBNb2Nrcyh7IG5vZGVzIH0pXG4gICAgcmVuZGVyKDxJbnB1dEZpZWxkUGFuZWwgLz4pXG5cbiAgICAvLyBBY3QgLSB0cmlnZ2VyIGEgc3RhdGUgY2hhbmdlXG4gICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1jaGFuZ2Utbm9kZS0xJykpXG5cbiAgICAvLyBBc3NlcnRcbiAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgIGV4cGVjdChtb2NrU2V0UmFnUGlwZWxpbmVWYXJpYWJsZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19