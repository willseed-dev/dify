"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
// ==================== Imports (after mocks) ====================
const index_1 = require("./index");
// ==================== Mock Setup ====================
// Mock useAllMCPTools hook
const mockMCPToolsData = vitest_1.vi.fn(() => undefined);
vitest_1.vi.mock('@/service/use-tools', () => ({
    useAllMCPTools: () => ({
        data: mockMCPToolsData(),
    }),
}));
// Track edit tool index for unique test IDs
let editToolIndex = 0;
vitest_1.vi.mock('@/app/components/plugins/plugin-detail-panel/tool-selector', () => ({
    default: ({ value, onSelect, onSelectMultiple, onDelete, controlledState, onControlledStateChange, panelShowState, onPanelShowStateChange, isEdit, supportEnableSwitch, }) => {
        if (isEdit) {
            const currentIndex = editToolIndex++;
            return (<div data-testid="tool-selector-edit" data-value={value?.tool_name || ''} data-index={currentIndex} data-support-enable-switch={supportEnableSwitch}>
          {value && (<>
              <span data-testid="tool-label">{value.tool_label}</span>
              <button data-testid={`configure-btn-${currentIndex}`} onClick={() => onSelect({ ...value, enabled: !value.enabled })}>
                Configure
              </button>
              <button data-testid={`delete-btn-${currentIndex}`} onClick={() => onDelete?.()}>
                Delete
              </button>
              {onSelectMultiple && (<button data-testid={`add-multiple-btn-${currentIndex}`} onClick={() => onSelectMultiple([
                            { ...value, tool_name: 'batch-tool-1', provider_name: 'batch-provider' },
                            { ...value, tool_name: 'batch-tool-2', provider_name: 'batch-provider' },
                        ])}>
                  Add Multiple
                </button>)}
            </>)}
        </div>);
        }
        else {
            return (<div data-testid="tool-selector-add" data-controlled-state={controlledState} data-panel-show-state={panelShowState}>
          <button data-testid="add-tool-btn" onClick={() => onSelect({
                    provider_name: 'new-provider',
                    tool_name: 'new-tool',
                    tool_label: 'New Tool',
                    enabled: true,
                })}>
            Add Tool
          </button>
          {onSelectMultiple && (<button data-testid="add-multiple-tools-btn" onClick={() => onSelectMultiple([
                        { provider_name: 'batch-p', tool_name: 'batch-t1', tool_label: 'Batch T1', enabled: true },
                        { provider_name: 'batch-p', tool_name: 'batch-t2', tool_label: 'Batch T2', enabled: true },
                    ])}>
              Add Multiple Tools
            </button>)}
        </div>);
        }
    },
}));
// ==================== Test Utilities ====================
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});
const createToolValue = (overrides = {}) => ({
    provider_name: 'test-provider',
    provider_show_name: 'Test Provider',
    tool_name: 'test-tool',
    tool_label: 'Test Tool',
    tool_description: 'Test tool description',
    settings: {},
    parameters: {},
    enabled: true,
    extra: { description: 'Test description' },
    ...overrides,
});
const createMCPTool = (overrides = {}) => ({
    id: 'mcp-provider-1',
    name: 'mcp-provider',
    author: 'test-author',
    type: 'mcp',
    icon: 'test-icon.png',
    label: { en_US: 'MCP Provider' },
    description: { en_US: 'MCP Provider description' },
    is_team_authorization: true,
    allow_delete: false,
    labels: [],
    tools: [{
            name: 'mcp-tool-1',
            label: { en_US: 'MCP Tool 1' },
            description: { en_US: 'MCP Tool 1 description' },
            parameters: [],
            output_schema: {},
        }],
    ...overrides,
});
const createNodeOutputVar = (overrides = {}) => ({
    nodeId: 'node-1',
    title: 'Test Node',
    vars: [],
    ...overrides,
});
const createNode = (overrides = {}) => ({
    id: 'node-1',
    position: { x: 0, y: 0 },
    data: { title: 'Test Node' },
    ...overrides,
});
const renderComponent = (options = {}) => {
    const defaultProps = {
        disabled: false,
        value: [],
        label: 'Tools',
        required: false,
        tooltip: undefined,
        supportCollapse: false,
        scope: undefined,
        onChange: vitest_1.vi.fn(),
        nodeOutputVars: [createNodeOutputVar()],
        availableNodes: [createNode()],
        nodeId: 'test-node-id',
        canChooseMCPTool: false,
    };
    const props = { ...defaultProps, ...options };
    const queryClient = createQueryClient();
    return {
        ...(0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
        <index_1.default {...props}/>
      </react_query_1.QueryClientProvider>),
        props,
    };
};
// ==================== Tests ====================
(0, vitest_1.describe)('MultipleToolSelector', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockMCPToolsData.mockReturnValue(undefined);
        editToolIndex = 0;
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render with label', () => {
            // Arrange & Act
            renderComponent({ label: 'My Tools' });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('My Tools')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render required indicator when required is true', () => {
            // Arrange & Act
            renderComponent({ required: true });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('*')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render required indicator when required is false', () => {
            // Arrange & Act
            renderComponent({ required: false });
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByText('*')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render empty state when no tools are selected', () => {
            // Arrange & Act
            renderComponent({ value: [] });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.detailPanel.toolSelector.empty')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render selected tools when value is provided', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-1', tool_label: 'Tool 1' }),
                createToolValue({ tool_name: 'tool-2', tool_label: 'Tool 2' }),
            ];
            // Act
            renderComponent({ value: tools });
            // Assert
            const editSelectors = react_1.screen.getAllByTestId('tool-selector-edit');
            (0, vitest_1.expect)(editSelectors).toHaveLength(2);
        });
        (0, vitest_1.it)('should render add button when not disabled', () => {
            // Arrange & Act
            const { container } = renderComponent({ disabled: false });
            // Assert
            const addButton = container.querySelector('[class*="mx-1"]');
            (0, vitest_1.expect)(addButton).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render add button when disabled', () => {
            // Arrange & Act
            renderComponent({ disabled: true });
            // Assert
            const addSelectors = react_1.screen.queryAllByTestId('tool-selector-add');
            // The add button should still be present but outside the disabled check
            (0, vitest_1.expect)(addSelectors).toHaveLength(1);
        });
        (0, vitest_1.it)('should render tooltip when provided', () => {
            // Arrange & Act
            const { container } = renderComponent({ tooltip: 'This is a tooltip' });
            // Assert - Tooltip icon should be present
            const tooltipIcon = container.querySelector('svg');
            (0, vitest_1.expect)(tooltipIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render enabled count when tools are selected', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-1', enabled: true }),
                createToolValue({ tool_name: 'tool-2', enabled: false }),
            ];
            // Act
            renderComponent({ value: tools });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('1/2')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('appDebug.agent.tools.enabled')).toBeInTheDocument();
        });
    });
    // ==================== Collapse Functionality Tests ====================
    (0, vitest_1.describe)('Collapse Functionality', () => {
        (0, vitest_1.it)('should render collapse arrow when supportCollapse is true', () => {
            // Arrange & Act
            const { container } = renderComponent({ supportCollapse: true });
            // Assert
            const collapseArrow = container.querySelector('svg[class*="cursor-pointer"]');
            (0, vitest_1.expect)(collapseArrow).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render collapse arrow when supportCollapse is false', () => {
            // Arrange & Act
            const { container } = renderComponent({ supportCollapse: false });
            // Assert
            const collapseArrows = container.querySelectorAll('svg[class*="rotate"]');
            (0, vitest_1.expect)(collapseArrows).toHaveLength(0);
        });
        (0, vitest_1.it)('should toggle collapse state when clicking header with supportCollapse enabled', () => {
            // Arrange
            const tools = [createToolValue()];
            const { container } = renderComponent({ supportCollapse: true, value: tools });
            const headerArea = container.querySelector('[class*="cursor-pointer"]');
            // Act - Initially visible
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-edit')).toBeInTheDocument();
            // Click to collapse
            react_1.fireEvent.click(headerArea);
            // Assert - Should be collapsed
            (0, vitest_1.expect)(react_1.screen.queryByTestId('tool-selector-edit')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not toggle collapse when supportCollapse is false', () => {
            // Arrange
            const tools = [createToolValue()];
            renderComponent({ supportCollapse: false, value: tools });
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('Tools'));
            // Assert - Should still be visible
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-edit')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should expand when add button is clicked while collapsed', async () => {
            // Arrange
            const tools = [createToolValue()];
            const { container } = renderComponent({ supportCollapse: true, value: tools });
            const headerArea = container.querySelector('[class*="cursor-pointer"]');
            // Collapse first
            react_1.fireEvent.click(headerArea);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('tool-selector-edit')).not.toBeInTheDocument();
            // Act - Click add button
            const addButton = container.querySelector('button');
            react_1.fireEvent.click(addButton);
            // Assert - Should be expanded
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-edit')).toBeInTheDocument();
            });
        });
    });
    // ==================== State Management Tests ====================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should track enabled count correctly', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-1', enabled: true }),
                createToolValue({ tool_name: 'tool-2', enabled: true }),
                createToolValue({ tool_name: 'tool-3', enabled: false }),
            ];
            // Act
            renderComponent({ value: tools });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('2/3')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should track enabled count with MCP tools when canChooseMCPTool is true', () => {
            // Arrange
            const mcpTools = [createMCPTool({ id: 'mcp-provider' })];
            mockMCPToolsData.mockReturnValue(mcpTools);
            const tools = [
                createToolValue({ tool_name: 'tool-1', provider_name: 'regular-provider', enabled: true }),
                createToolValue({ tool_name: 'mcp-tool', provider_name: 'mcp-provider', enabled: true }),
            ];
            // Act
            renderComponent({ value: tools, canChooseMCPTool: true });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('2/2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not count MCP tools when canChooseMCPTool is false', () => {
            // Arrange
            const mcpTools = [createMCPTool({ id: 'mcp-provider' })];
            mockMCPToolsData.mockReturnValue(mcpTools);
            const tools = [
                createToolValue({ tool_name: 'tool-1', provider_name: 'regular-provider', enabled: true }),
                createToolValue({ tool_name: 'mcp-tool', provider_name: 'mcp-provider', enabled: true }),
            ];
            // Act
            renderComponent({ value: tools, canChooseMCPTool: false });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('1/2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should manage open state for add tool panel', () => {
            // Arrange
            const { container } = renderComponent();
            // Initially closed
            const addSelector = react_1.screen.getByTestId('tool-selector-add');
            (0, vitest_1.expect)(addSelector).toHaveAttribute('data-controlled-state', 'false');
            // Act - Click add button (ActionButton)
            const actionButton = container.querySelector('[class*="mx-1"]');
            react_1.fireEvent.click(actionButton);
            // Assert - Open state should change to true
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-add')).toHaveAttribute('data-controlled-state', 'true');
        });
    });
    // ==================== User Interactions Tests ====================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onChange when adding a new tool via add button', () => {
            // Arrange
            const onChange = vitest_1.vi.fn();
            renderComponent({ onChange });
            // Act - Click add tool button in add selector
            react_1.fireEvent.click(react_1.screen.getByTestId('add-tool-btn'));
            // Assert
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ provider_name: 'new-provider', tool_name: 'new-tool' }),
            ]);
        });
        (0, vitest_1.it)('should call onChange when adding multiple tools', () => {
            // Arrange
            const onChange = vitest_1.vi.fn();
            renderComponent({ onChange });
            // Act - Click add multiple tools button
            react_1.fireEvent.click(react_1.screen.getByTestId('add-multiple-tools-btn'));
            // Assert
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ provider_name: 'batch-p', tool_name: 'batch-t1' }),
                vitest_1.expect.objectContaining({ provider_name: 'batch-p', tool_name: 'batch-t2' }),
            ]);
        });
        (0, vitest_1.it)('should deduplicate when adding duplicate tool', () => {
            // Arrange
            const existingTool = createToolValue({ tool_name: 'new-tool', provider_name: 'new-provider' });
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: [existingTool], onChange });
            // Act - Try to add the same tool
            react_1.fireEvent.click(react_1.screen.getByTestId('add-tool-btn'));
            // Assert - Should still have only 1 tool (deduplicated)
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([existingTool]);
        });
        (0, vitest_1.it)('should call onChange when deleting a tool', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-0', provider_name: 'p0' }),
                createToolValue({ tool_name: 'tool-1', provider_name: 'p1' }),
            ];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Delete first tool (index 0)
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-btn-0'));
            // Assert - Should have only second tool
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'tool-1', provider_name: 'p1' }),
            ]);
        });
        (0, vitest_1.it)('should call onChange when configuring a tool', () => {
            // Arrange
            const tools = [createToolValue({ tool_name: 'tool-1', enabled: true })];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Click configure button to toggle enabled
            react_1.fireEvent.click(react_1.screen.getByTestId('configure-btn-0'));
            // Assert - Should update the tool at index 0
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'tool-1', enabled: false }),
            ]);
        });
        (0, vitest_1.it)('should call onChange with correct index when configuring second tool', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-0', enabled: true }),
                createToolValue({ tool_name: 'tool-1', enabled: true }),
            ];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Configure second tool (index 1)
            react_1.fireEvent.click(react_1.screen.getByTestId('configure-btn-1'));
            // Assert - Should update only the second tool
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'tool-0', enabled: true }),
                vitest_1.expect.objectContaining({ tool_name: 'tool-1', enabled: false }),
            ]);
        });
        (0, vitest_1.it)('should call onChange with correct array when deleting middle tool', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-0', provider_name: 'p0' }),
                createToolValue({ tool_name: 'tool-1', provider_name: 'p1' }),
                createToolValue({ tool_name: 'tool-2', provider_name: 'p2' }),
            ];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Delete middle tool (index 1)
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-btn-1'));
            // Assert - Should have first and third tools
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'tool-0' }),
                vitest_1.expect.objectContaining({ tool_name: 'tool-2' }),
            ]);
        });
        (0, vitest_1.it)('should handle add multiple from edit selector', () => {
            // Arrange
            const tools = [createToolValue({ tool_name: 'existing' })];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Click add multiple from edit selector
            react_1.fireEvent.click(react_1.screen.getByTestId('add-multiple-btn-0'));
            // Assert - Should add batch tools with deduplication
            (0, vitest_1.expect)(onChange).toHaveBeenCalled();
        });
    });
    // ==================== Event Handlers Tests ====================
    (0, vitest_1.describe)('Event Handlers', () => {
        (0, vitest_1.it)('should handle add button click', () => {
            // Arrange
            const { container } = renderComponent();
            const addButton = container.querySelector('button');
            // Act
            react_1.fireEvent.click(addButton);
            // Assert - Add tool panel should open
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-add')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle collapse click with supportCollapse', () => {
            // Arrange
            const tools = [createToolValue()];
            const { container } = renderComponent({ supportCollapse: true, value: tools });
            const labelArea = container.querySelector('[class*="cursor-pointer"]');
            // Act
            react_1.fireEvent.click(labelArea);
            // Assert - Tools should be hidden
            (0, vitest_1.expect)(react_1.screen.queryByTestId('tool-selector-edit')).not.toBeInTheDocument();
            // Click again to expand
            react_1.fireEvent.click(labelArea);
            // Assert - Tools should be visible again
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-edit')).toBeInTheDocument();
        });
    });
    // ==================== Edge Cases Tests ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty value array', () => {
            // Arrange & Act
            renderComponent({ value: [] });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.detailPanel.toolSelector.empty')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryAllByTestId('tool-selector-edit')).toHaveLength(0);
        });
        (0, vitest_1.it)('should handle undefined value', () => {
            // Arrange & Act - value defaults to [] in component
            renderComponent({ value: undefined });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.detailPanel.toolSelector.empty')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle null mcpTools data', () => {
            // Arrange
            mockMCPToolsData.mockReturnValue(undefined);
            const tools = [createToolValue({ enabled: true })];
            // Act
            renderComponent({ value: tools });
            // Assert - Should still render
            (0, vitest_1.expect)(react_1.screen.getByText('1/1')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle tools with missing enabled property', () => {
            // Arrange
            const tools = [
                { ...createToolValue(), enabled: undefined },
            ];
            // Act
            renderComponent({ value: tools });
            // Assert - Should count as not enabled (falsy)
            (0, vitest_1.expect)(react_1.screen.getByText('0/1')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty label', () => {
            // Arrange & Act
            renderComponent({ label: '' });
            // Assert - Should not crash
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-add')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle nodeOutputVars as empty array', () => {
            // Arrange & Act
            renderComponent({ nodeOutputVars: [] });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-add')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle availableNodes as empty array', () => {
            // Arrange & Act
            renderComponent({ availableNodes: [] });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-add')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined nodeId', () => {
            // Arrange & Act
            renderComponent({ nodeId: undefined });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-add')).toBeInTheDocument();
        });
    });
    // ==================== Props Variations Tests ====================
    (0, vitest_1.describe)('Props Variations', () => {
        (0, vitest_1.it)('should pass disabled prop to child selectors', () => {
            // Arrange & Act
            const { container } = renderComponent({ disabled: true });
            // Assert - ActionButton (add button with mx-1 class) should not be rendered
            const actionButton = container.querySelector('[class*="mx-1"]');
            (0, vitest_1.expect)(actionButton).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass scope prop to ToolSelector', () => {
            // Arrange & Act
            renderComponent({ scope: 'test-scope' });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-add')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass canChooseMCPTool prop correctly', () => {
            // Arrange & Act
            renderComponent({ canChooseMCPTool: true });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('tool-selector-add')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with supportEnableSwitch for edit selectors', () => {
            // Arrange
            const tools = [createToolValue()];
            // Act
            renderComponent({ value: tools });
            // Assert
            const editSelector = react_1.screen.getByTestId('tool-selector-edit');
            (0, vitest_1.expect)(editSelector).toHaveAttribute('data-support-enable-switch', 'true');
        });
        (0, vitest_1.it)('should handle multiple tools correctly', () => {
            // Arrange
            const tools = Array.from({ length: 5 }, (_, i) => createToolValue({ tool_name: `tool-${i}`, tool_label: `Tool ${i}` }));
            // Act
            renderComponent({ value: tools });
            // Assert
            const editSelectors = react_1.screen.getAllByTestId('tool-selector-edit');
            (0, vitest_1.expect)(editSelectors).toHaveLength(5);
        });
    });
    // ==================== MCP Tools Integration Tests ====================
    (0, vitest_1.describe)('MCP Tools Integration', () => {
        (0, vitest_1.it)('should correctly identify MCP tools', () => {
            // Arrange
            const mcpTools = [
                createMCPTool({ id: 'mcp-provider-1' }),
                createMCPTool({ id: 'mcp-provider-2' }),
            ];
            mockMCPToolsData.mockReturnValue(mcpTools);
            const tools = [
                createToolValue({ provider_name: 'mcp-provider-1', enabled: true }),
                createToolValue({ provider_name: 'regular-provider', enabled: true }),
            ];
            // Act
            renderComponent({ value: tools, canChooseMCPTool: true });
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('2/2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should exclude MCP tools from enabled count when canChooseMCPTool is false', () => {
            // Arrange
            const mcpTools = [createMCPTool({ id: 'mcp-provider' })];
            mockMCPToolsData.mockReturnValue(mcpTools);
            const tools = [
                createToolValue({ provider_name: 'mcp-provider', enabled: true }),
                createToolValue({ provider_name: 'regular', enabled: true }),
            ];
            // Act
            renderComponent({ value: tools, canChooseMCPTool: false });
            // Assert - Only regular tool should be counted
            (0, vitest_1.expect)(react_1.screen.getByText('1/2')).toBeInTheDocument();
        });
    });
    // ==================== Deduplication Logic Tests ====================
    (0, vitest_1.describe)('Deduplication Logic', () => {
        (0, vitest_1.it)('should deduplicate by provider_name and tool_name combination', () => {
            // Arrange
            const onChange = vitest_1.vi.fn();
            const existingTools = [
                createToolValue({ provider_name: 'new-provider', tool_name: 'new-tool' }),
            ];
            renderComponent({ value: existingTools, onChange });
            // Act - Try to add same provider_name + tool_name via add button
            react_1.fireEvent.click(react_1.screen.getByTestId('add-tool-btn'));
            // Assert - Should not add duplicate, only existing tool remains
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(existingTools);
        });
        (0, vitest_1.it)('should allow same tool_name with different provider_name', () => {
            // Arrange
            const onChange = vitest_1.vi.fn();
            const existingTools = [
                createToolValue({ provider_name: 'other-provider', tool_name: 'new-tool' }),
            ];
            renderComponent({ value: existingTools, onChange });
            // Act - Add tool with different provider
            react_1.fireEvent.click(react_1.screen.getByTestId('add-tool-btn'));
            // Assert - Should add as it's different provider
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                existingTools[0],
                vitest_1.expect.objectContaining({ provider_name: 'new-provider', tool_name: 'new-tool' }),
            ]);
        });
        (0, vitest_1.it)('should deduplicate multiple tools in batch add', () => {
            // Arrange
            const onChange = vitest_1.vi.fn();
            const existingTools = [
                createToolValue({ provider_name: 'batch-p', tool_name: 'batch-t1' }),
            ];
            renderComponent({ value: existingTools, onChange });
            // Act - Add multiple tools (batch-t1 is duplicate)
            react_1.fireEvent.click(react_1.screen.getByTestId('add-multiple-tools-btn'));
            // Assert - Should have 2 unique tools (batch-t1 deduplicated)
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ provider_name: 'batch-p', tool_name: 'batch-t1' }),
                vitest_1.expect.objectContaining({ provider_name: 'batch-p', tool_name: 'batch-t2' }),
            ]);
        });
    });
    // ==================== Delete Functionality Tests ====================
    (0, vitest_1.describe)('Delete Functionality', () => {
        (0, vitest_1.it)('should remove tool at specific index when delete is clicked', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-0', provider_name: 'p0' }),
                createToolValue({ tool_name: 'tool-1', provider_name: 'p1' }),
                createToolValue({ tool_name: 'tool-2', provider_name: 'p2' }),
            ];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Delete first tool
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-btn-0'));
            // Assert
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'tool-1' }),
                vitest_1.expect.objectContaining({ tool_name: 'tool-2' }),
            ]);
        });
        (0, vitest_1.it)('should remove last tool when delete is clicked', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-0', provider_name: 'p0' }),
                createToolValue({ tool_name: 'tool-1', provider_name: 'p1' }),
            ];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Delete last tool (index 1)
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-btn-1'));
            // Assert
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'tool-0' }),
            ]);
        });
        (0, vitest_1.it)('should result in empty array when deleting last remaining tool', () => {
            // Arrange
            const tools = [createToolValue({ tool_name: 'only-tool' })];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Delete the only tool
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-btn-0'));
            // Assert
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([]);
        });
    });
    // ==================== Configure Functionality Tests ====================
    (0, vitest_1.describe)('Configure Functionality', () => {
        (0, vitest_1.it)('should update tool at specific index when configured', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-1', enabled: true }),
            ];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Configure tool (toggles enabled)
            react_1.fireEvent.click(react_1.screen.getByTestId('configure-btn-0'));
            // Assert
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'tool-1', enabled: false }),
            ]);
        });
        (0, vitest_1.it)('should preserve other tools when configuring one tool', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'tool-0', enabled: true }),
                createToolValue({ tool_name: 'tool-1', enabled: false }),
                createToolValue({ tool_name: 'tool-2', enabled: true }),
            ];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Configure middle tool (index 1)
            react_1.fireEvent.click(react_1.screen.getByTestId('configure-btn-1'));
            // Assert - All tools preserved, only middle one changed
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'tool-0', enabled: true }),
                vitest_1.expect.objectContaining({ tool_name: 'tool-1', enabled: true }), // toggled
                vitest_1.expect.objectContaining({ tool_name: 'tool-2', enabled: true }),
            ]);
        });
        (0, vitest_1.it)('should update first tool correctly', () => {
            // Arrange
            const tools = [
                createToolValue({ tool_name: 'first', enabled: false }),
                createToolValue({ tool_name: 'second', enabled: true }),
            ];
            const onChange = vitest_1.vi.fn();
            renderComponent({ value: tools, onChange });
            // Act - Configure first tool
            react_1.fireEvent.click(react_1.screen.getByTestId('configure-btn-0'));
            // Assert
            (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([
                vitest_1.expect.objectContaining({ tool_name: 'first', enabled: true }), // toggled
                vitest_1.expect.objectContaining({ tool_name: 'second', enabled: true }),
            ]);
        });
    });
    // ==================== Panel State Tests ====================
    (0, vitest_1.describe)('Panel State Management', () => {
        (0, vitest_1.it)('should initialize with panel show state true on add', () => {
            // Arrange
            const { container } = renderComponent();
            // Act - Click add button
            const addButton = container.querySelector('button');
            react_1.fireEvent.click(addButton);
            // Assert
            const addSelector = react_1.screen.getByTestId('tool-selector-add');
            (0, vitest_1.expect)(addSelector).toHaveAttribute('data-panel-show-state', 'true');
        });
    });
    // ==================== Accessibility Tests ====================
    (0, vitest_1.describe)('Accessibility', () => {
        (0, vitest_1.it)('should have clickable add button', () => {
            // Arrange
            const { container } = renderComponent();
            // Assert
            const addButton = container.querySelector('button');
            (0, vitest_1.expect)(addButton).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show divider when tools are selected', () => {
            // Arrange
            const tools = [createToolValue()];
            // Act
            const { container } = renderComponent({ value: tools });
            // Assert
            const divider = container.querySelector('[class*="h-3"]');
            (0, vitest_1.expect)(divider).toBeInTheDocument();
        });
    });
    // ==================== Tooltip Tests ====================
    (0, vitest_1.describe)('Tooltip Rendering', () => {
        (0, vitest_1.it)('should render question icon when tooltip is provided', () => {
            // Arrange & Act
            const { container } = renderComponent({ tooltip: 'Help text' });
            // Assert
            const questionIcon = container.querySelector('svg');
            (0, vitest_1.expect)(questionIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render question icon when tooltip is not provided', () => {
            // Arrange & Act
            const { container } = renderComponent({ tooltip: undefined });
            // Assert - Should only have add icon, not question icon in label area
            const labelDiv = container.querySelector('.system-sm-semibold-uppercase');
            const icons = labelDiv?.querySelectorAll('svg') || [];
            // Question icon should not be in the label area
            (0, vitest_1.expect)(icons.length).toBeLessThanOrEqual(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsdURBQXdFO0FBQ3hFLGtEQUEyRTtBQUMzRSxtQ0FBNkQ7QUFFN0Qsa0VBQWtFO0FBRWxFLG1DQUEwQztBQUUxQyx1REFBdUQ7QUFFdkQsMkJBQTJCO0FBQzNCLE1BQU0sZ0JBQWdCLEdBQUcsV0FBRSxDQUFDLEVBQUUsQ0FBdUMsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDckYsV0FBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtLQUN6QixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCw0Q0FBNEM7QUFDNUMsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFBO0FBRXJCLFdBQUUsQ0FBQyxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMzRSxPQUFPLEVBQUUsQ0FBQyxFQUNSLEtBQUssRUFDTCxRQUFRLEVBQ1IsZ0JBQWdCLEVBQ2hCLFFBQVEsRUFDUixlQUFlLEVBQ2YsdUJBQXVCLEVBQ3ZCLGNBQWMsRUFDZCxzQkFBc0IsRUFDdEIsTUFBTSxFQUNOLG1CQUFtQixHQVlwQixFQUFFLEVBQUU7UUFDSCxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBQ1gsTUFBTSxZQUFZLEdBQUcsYUFBYSxFQUFFLENBQUE7WUFDcEMsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUNGLFdBQVcsQ0FBQyxvQkFBb0IsQ0FDaEMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FDbkMsVUFBVSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQ3pCLDBCQUEwQixDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FF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QUFFLENBQUMsQ0FBQTtZQUU3RCxzRUFBc0U7WUFDdEUsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1lBQ3pFLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDckQsZ0RBQWdEO1lBQ2hELElBQUEsZUFBTSxFQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM3QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE5vZGUgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgdHlwZSB7IFRvb2xWYWx1ZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE5vZGVPdXRQdXRWYXIsIFRvb2xXaXRoUHJvdmlkZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gSW1wb3J0cyAoYWZ0ZXIgbW9ja3MpID09PT09PT09PT09PT09PT09PT09XG5cbmltcG9ydCBNdWx0aXBsZVRvb2xTZWxlY3RvciBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBNb2NrIFNldHVwID09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgdXNlQWxsTUNQVG9vbHMgaG9va1xuY29uc3QgbW9ja01DUFRvb2xzRGF0YSA9IHZpLmZuPCgpID0+IFRvb2xXaXRoUHJvdmlkZXJbXSB8IHVuZGVmaW5lZD4oKCkgPT4gdW5kZWZpbmVkKVxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS10b29scycsICgpID0+ICh7XG4gIHVzZUFsbE1DUFRvb2xzOiAoKSA9PiAoe1xuICAgIGRhdGE6IG1vY2tNQ1BUb29sc0RhdGEoKSxcbiAgfSksXG59KSlcblxuLy8gVHJhY2sgZWRpdCB0b29sIGluZGV4IGZvciB1bmlxdWUgdGVzdCBJRHNcbmxldCBlZGl0VG9vbEluZGV4ID0gMFxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvcGx1Z2luLWRldGFpbC1wYW5lbC90b29sLXNlbGVjdG9yJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICB2YWx1ZSxcbiAgICBvblNlbGVjdCxcbiAgICBvblNlbGVjdE11bHRpcGxlLFxuICAgIG9uRGVsZXRlLFxuICAgIGNvbnRyb2xsZWRTdGF0ZSxcbiAgICBvbkNvbnRyb2xsZWRTdGF0ZUNoYW5nZSxcbiAgICBwYW5lbFNob3dTdGF0ZSxcbiAgICBvblBhbmVsU2hvd1N0YXRlQ2hhbmdlLFxuICAgIGlzRWRpdCxcbiAgICBzdXBwb3J0RW5hYmxlU3dpdGNoLFxuICB9OiB7XG4gICAgdmFsdWU/OiBUb29sVmFsdWVcbiAgICBvblNlbGVjdDogKHRvb2w6IFRvb2xWYWx1ZSkgPT4gdm9pZFxuICAgIG9uU2VsZWN0TXVsdGlwbGU/OiAodG9vbHM6IFRvb2xWYWx1ZVtdKSA9PiB2b2lkXG4gICAgb25EZWxldGU/OiAoKSA9PiB2b2lkXG4gICAgY29udHJvbGxlZFN0YXRlPzogYm9vbGVhblxuICAgIG9uQ29udHJvbGxlZFN0YXRlQ2hhbmdlPzogKHN0YXRlOiBib29sZWFuKSA9PiB2b2lkXG4gICAgcGFuZWxTaG93U3RhdGU/OiBib29sZWFuXG4gICAgb25QYW5lbFNob3dTdGF0ZUNoYW5nZT86IChzdGF0ZTogYm9vbGVhbikgPT4gdm9pZFxuICAgIGlzRWRpdD86IGJvb2xlYW5cbiAgICBzdXBwb3J0RW5hYmxlU3dpdGNoPzogYm9vbGVhblxuICB9KSA9PiB7XG4gICAgaWYgKGlzRWRpdCkge1xuICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gZWRpdFRvb2xJbmRleCsrXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0b29sLXNlbGVjdG9yLWVkaXRcIlxuICAgICAgICAgIGRhdGEtdmFsdWU9e3ZhbHVlPy50b29sX25hbWUgfHwgJyd9XG4gICAgICAgICAgZGF0YS1pbmRleD17Y3VycmVudEluZGV4fVxuICAgICAgICAgIGRhdGEtc3VwcG9ydC1lbmFibGUtc3dpdGNoPXtzdXBwb3J0RW5hYmxlU3dpdGNofVxuICAgICAgICA+XG4gICAgICAgICAge3ZhbHVlICYmIChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwidG9vbC1sYWJlbFwiPnt2YWx1ZS50b29sX2xhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgY29uZmlndXJlLWJ0bi0ke2N1cnJlbnRJbmRleH1gfVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0KHsgLi4udmFsdWUsIGVuYWJsZWQ6ICF2YWx1ZS5lbmFibGVkIH0pfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgQ29uZmlndXJlXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BkZWxldGUtYnRuLSR7Y3VycmVudEluZGV4fWB9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25EZWxldGU/LigpfVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgRGVsZXRlXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICB7b25TZWxlY3RNdWx0aXBsZSAmJiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgZGF0YS10ZXN0aWQ9e2BhZGQtbXVsdGlwbGUtYnRuLSR7Y3VycmVudEluZGV4fWB9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdE11bHRpcGxlKFtcbiAgICAgICAgICAgICAgICAgICAgeyAuLi52YWx1ZSwgdG9vbF9uYW1lOiAnYmF0Y2gtdG9vbC0xJywgcHJvdmlkZXJfbmFtZTogJ2JhdGNoLXByb3ZpZGVyJyB9LFxuICAgICAgICAgICAgICAgICAgICB7IC4uLnZhbHVlLCB0b29sX25hbWU6ICdiYXRjaC10b29sLTInLCBwcm92aWRlcl9uYW1lOiAnYmF0Y2gtcHJvdmlkZXInIH0sXG4gICAgICAgICAgICAgICAgICBdKX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBBZGQgTXVsdGlwbGVcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInRvb2wtc2VsZWN0b3ItYWRkXCJcbiAgICAgICAgICBkYXRhLWNvbnRyb2xsZWQtc3RhdGU9e2NvbnRyb2xsZWRTdGF0ZX1cbiAgICAgICAgICBkYXRhLXBhbmVsLXNob3ctc3RhdGU9e3BhbmVsU2hvd1N0YXRlfVxuICAgICAgICA+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhZGQtdG9vbC1idG5cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3Qoe1xuICAgICAgICAgICAgICBwcm92aWRlcl9uYW1lOiAnbmV3LXByb3ZpZGVyJyxcbiAgICAgICAgICAgICAgdG9vbF9uYW1lOiAnbmV3LXRvb2wnLFxuICAgICAgICAgICAgICB0b29sX2xhYmVsOiAnTmV3IFRvb2wnLFxuICAgICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgQWRkIFRvb2xcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICB7b25TZWxlY3RNdWx0aXBsZSAmJiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYWRkLW11bHRpcGxlLXRvb2xzLWJ0blwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0TXVsdGlwbGUoW1xuICAgICAgICAgICAgICAgIHsgcHJvdmlkZXJfbmFtZTogJ2JhdGNoLXAnLCB0b29sX25hbWU6ICdiYXRjaC10MScsIHRvb2xfbGFiZWw6ICdCYXRjaCBUMScsIGVuYWJsZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICB7IHByb3ZpZGVyX25hbWU6ICdiYXRjaC1wJywgdG9vbF9uYW1lOiAnYmF0Y2gtdDInLCB0b29sX2xhYmVsOiAnQmF0Y2ggVDInLCBlbmFibGVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgIF0pfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBBZGQgTXVsdGlwbGUgVG9vbHNcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBUZXN0IFV0aWxpdGllcyA9PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVRdWVyeUNsaWVudCA9ICgpID0+IG5ldyBRdWVyeUNsaWVudCh7XG4gIGRlZmF1bHRPcHRpb25zOiB7XG4gICAgcXVlcmllczogeyByZXRyeTogZmFsc2UgfSxcbiAgICBtdXRhdGlvbnM6IHsgcmV0cnk6IGZhbHNlIH0sXG4gIH0sXG59KVxuXG5jb25zdCBjcmVhdGVUb29sVmFsdWUgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFRvb2xWYWx1ZT4gPSB7fSk6IFRvb2xWYWx1ZSA9PiAoe1xuICBwcm92aWRlcl9uYW1lOiAndGVzdC1wcm92aWRlcicsXG4gIHByb3ZpZGVyX3Nob3dfbmFtZTogJ1Rlc3QgUHJvdmlkZXInLFxuICB0b29sX25hbWU6ICd0ZXN0LXRvb2wnLFxuICB0b29sX2xhYmVsOiAnVGVzdCBUb29sJyxcbiAgdG9vbF9kZXNjcmlwdGlvbjogJ1Rlc3QgdG9vbCBkZXNjcmlwdGlvbicsXG4gIHNldHRpbmdzOiB7fSxcbiAgcGFyYW1ldGVyczoge30sXG4gIGVuYWJsZWQ6IHRydWUsXG4gIGV4dHJhOiB7IGRlc2NyaXB0aW9uOiAnVGVzdCBkZXNjcmlwdGlvbicgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTUNQVG9vbCA9IChvdmVycmlkZXM6IFBhcnRpYWw8VG9vbFdpdGhQcm92aWRlcj4gPSB7fSk6IFRvb2xXaXRoUHJvdmlkZXIgPT4gKHtcbiAgaWQ6ICdtY3AtcHJvdmlkZXItMScsXG4gIG5hbWU6ICdtY3AtcHJvdmlkZXInLFxuICBhdXRob3I6ICd0ZXN0LWF1dGhvcicsXG4gIHR5cGU6ICdtY3AnLFxuICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gIGxhYmVsOiB7IGVuX1VTOiAnTUNQIFByb3ZpZGVyJyB9IGFzIGFueSxcbiAgZGVzY3JpcHRpb246IHsgZW5fVVM6ICdNQ1AgUHJvdmlkZXIgZGVzY3JpcHRpb24nIH0gYXMgYW55LFxuICBpc190ZWFtX2F1dGhvcml6YXRpb246IHRydWUsXG4gIGFsbG93X2RlbGV0ZTogZmFsc2UsXG4gIGxhYmVsczogW10sXG4gIHRvb2xzOiBbe1xuICAgIG5hbWU6ICdtY3AtdG9vbC0xJyxcbiAgICBsYWJlbDogeyBlbl9VUzogJ01DUCBUb29sIDEnIH0gYXMgYW55LFxuICAgIGRlc2NyaXB0aW9uOiB7IGVuX1VTOiAnTUNQIFRvb2wgMSBkZXNjcmlwdGlvbicgfSBhcyBhbnksXG4gICAgcGFyYW1ldGVyczogW10sXG4gICAgb3V0cHV0X3NjaGVtYToge30sXG4gIH1dLFxuICAuLi5vdmVycmlkZXMsXG59IGFzIFRvb2xXaXRoUHJvdmlkZXIpXG5cbmNvbnN0IGNyZWF0ZU5vZGVPdXRwdXRWYXIgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPE5vZGVPdXRQdXRWYXI+ID0ge30pOiBOb2RlT3V0UHV0VmFyID0+ICh7XG4gIG5vZGVJZDogJ25vZGUtMScsXG4gIHRpdGxlOiAnVGVzdCBOb2RlJyxcbiAgdmFyczogW10sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU5vZGUgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPE5vZGU+ID0ge30pOiBOb2RlID0+ICh7XG4gIGlkOiAnbm9kZS0xJyxcbiAgcG9zaXRpb246IHsgeDogMCwgeTogMCB9LFxuICBkYXRhOiB7IHRpdGxlOiAnVGVzdCBOb2RlJyB9LFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG50eXBlIFJlbmRlck9wdGlvbnMgPSB7XG4gIGRpc2FibGVkPzogYm9vbGVhblxuICB2YWx1ZT86IFRvb2xWYWx1ZVtdXG4gIGxhYmVsPzogc3RyaW5nXG4gIHJlcXVpcmVkPzogYm9vbGVhblxuICB0b29sdGlwPzogUmVhY3QuUmVhY3ROb2RlXG4gIHN1cHBvcnRDb2xsYXBzZT86IGJvb2xlYW5cbiAgc2NvcGU/OiBzdHJpbmdcbiAgb25DaGFuZ2U/OiAodmFsdWU6IFRvb2xWYWx1ZVtdKSA9PiB2b2lkXG4gIG5vZGVPdXRwdXRWYXJzPzogTm9kZU91dFB1dFZhcltdXG4gIGF2YWlsYWJsZU5vZGVzPzogTm9kZVtdXG4gIG5vZGVJZD86IHN0cmluZ1xuICBjYW5DaG9vc2VNQ1BUb29sPzogYm9vbGVhblxufVxuXG5jb25zdCByZW5kZXJDb21wb25lbnQgPSAob3B0aW9uczogUmVuZGVyT3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgdmFsdWU6IFtdLFxuICAgIGxhYmVsOiAnVG9vbHMnLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICB0b29sdGlwOiB1bmRlZmluZWQsXG4gICAgc3VwcG9ydENvbGxhcHNlOiBmYWxzZSxcbiAgICBzY29wZTogdW5kZWZpbmVkLFxuICAgIG9uQ2hhbmdlOiB2aS5mbigpLFxuICAgIG5vZGVPdXRwdXRWYXJzOiBbY3JlYXRlTm9kZU91dHB1dFZhcigpXSxcbiAgICBhdmFpbGFibGVOb2RlczogW2NyZWF0ZU5vZGUoKV0sXG4gICAgbm9kZUlkOiAndGVzdC1ub2RlLWlkJyxcbiAgICBjYW5DaG9vc2VNQ1BUb29sOiBmYWxzZSxcbiAgfVxuXG4gIGNvbnN0IHByb3BzID0geyAuLi5kZWZhdWx0UHJvcHMsIC4uLm9wdGlvbnMgfVxuICBjb25zdCBxdWVyeUNsaWVudCA9IGNyZWF0ZVF1ZXJ5Q2xpZW50KClcblxuICByZXR1cm4ge1xuICAgIC4uLnJlbmRlcihcbiAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAgICA8TXVsdGlwbGVUb29sU2VsZWN0b3Igey4uLnByb3BzfSAvPlxuICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICApLFxuICAgIHByb3BzLFxuICB9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdNdWx0aXBsZVRvb2xTZWxlY3RvcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja01DUFRvb2xzRGF0YS5tb2NrUmV0dXJuVmFsdWUodW5kZWZpbmVkKVxuICAgIGVkaXRUb29sSW5kZXggPSAwXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUmVuZGVyaW5nIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBsYWJlbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGxhYmVsOiAnTXkgVG9vbHMnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IFRvb2xzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcmVxdWlyZWQgaW5kaWNhdG9yIHdoZW4gcmVxdWlyZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHJlcXVpcmVkOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJyonKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgcmVxdWlyZWQgaW5kaWNhdG9yIHdoZW4gcmVxdWlyZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyByZXF1aXJlZDogZmFsc2UgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCcqJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGVtcHR5IHN0YXRlIHdoZW4gbm8gdG9vbHMgYXJlIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IFtdIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5kZXRhaWxQYW5lbC50b29sU2VsZWN0b3IuZW1wdHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzZWxlY3RlZCB0b29scyB3aGVuIHZhbHVlIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdG9vbHMgPSBbXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ3Rvb2wtMScsIHRvb2xfbGFiZWw6ICdUb29sIDEnIH0pLFxuICAgICAgICBjcmVhdGVUb29sVmFsdWUoeyB0b29sX25hbWU6ICd0b29sLTInLCB0b29sX2xhYmVsOiAnVG9vbCAyJyB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogdG9vbHMgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBlZGl0U2VsZWN0b3JzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCd0b29sLXNlbGVjdG9yLWVkaXQnKVxuICAgICAgZXhwZWN0KGVkaXRTZWxlY3RvcnMpLnRvSGF2ZUxlbmd0aCgyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhZGQgYnV0dG9uIHdoZW4gbm90IGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCh7IGRpc2FibGVkOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwibXgtMVwiXScpXG4gICAgICBleHBlY3QoYWRkQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBhZGQgYnV0dG9uIHdoZW4gZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBkaXNhYmxlZDogdHJ1ZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFkZFNlbGVjdG9ycyA9IHNjcmVlbi5xdWVyeUFsbEJ5VGVzdElkKCd0b29sLXNlbGVjdG9yLWFkZCcpXG4gICAgICAvLyBUaGUgYWRkIGJ1dHRvbiBzaG91bGQgc3RpbGwgYmUgcHJlc2VudCBidXQgb3V0c2lkZSB0aGUgZGlzYWJsZWQgY2hlY2tcbiAgICAgIGV4cGVjdChhZGRTZWxlY3RvcnMpLnRvSGF2ZUxlbmd0aCgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0b29sdGlwIHdoZW4gcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KHsgdG9vbHRpcDogJ1RoaXMgaXMgYSB0b29sdGlwJyB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBUb29sdGlwIGljb24gc2hvdWxkIGJlIHByZXNlbnRcbiAgICAgIGNvbnN0IHRvb2x0aXBJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3QodG9vbHRpcEljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZW5hYmxlZCBjb3VudCB3aGVuIHRvb2xzIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRvb2xzID0gW1xuICAgICAgICBjcmVhdGVUb29sVmFsdWUoeyB0b29sX25hbWU6ICd0b29sLTEnLCBlbmFibGVkOiB0cnVlIH0pLFxuICAgICAgICBjcmVhdGVUb29sVmFsdWUoeyB0b29sX25hbWU6ICd0b29sLTInLCBlbmFibGVkOiBmYWxzZSB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogdG9vbHMgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMS8yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBEZWJ1Zy5hZ2VudC50b29scy5lbmFibGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IENvbGxhcHNlIEZ1bmN0aW9uYWxpdHkgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbGxhcHNlIEZ1bmN0aW9uYWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29sbGFwc2UgYXJyb3cgd2hlbiBzdXBwb3J0Q29sbGFwc2UgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoeyBzdXBwb3J0Q29sbGFwc2U6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjb2xsYXBzZUFycm93ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2Z1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICBleHBlY3QoY29sbGFwc2VBcnJvdykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgY29sbGFwc2UgYXJyb3cgd2hlbiBzdXBwb3J0Q29sbGFwc2UgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KHsgc3VwcG9ydENvbGxhcHNlOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNvbGxhcHNlQXJyb3dzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2Z1tjbGFzcyo9XCJyb3RhdGVcIl0nKVxuICAgICAgZXhwZWN0KGNvbGxhcHNlQXJyb3dzKS50b0hhdmVMZW5ndGgoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0b2dnbGUgY29sbGFwc2Ugc3RhdGUgd2hlbiBjbGlja2luZyBoZWFkZXIgd2l0aCBzdXBwb3J0Q29sbGFwc2UgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRvb2xzID0gW2NyZWF0ZVRvb2xWYWx1ZSgpXVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCh7IHN1cHBvcnRDb2xsYXBzZTogdHJ1ZSwgdmFsdWU6IHRvb2xzIH0pXG4gICAgICBjb25zdCBoZWFkZXJBcmVhID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG5cbiAgICAgIC8vIEFjdCAtIEluaXRpYWxseSB2aXNpYmxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0b29sLXNlbGVjdG9yLWVkaXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDbGljayB0byBjb2xsYXBzZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGhlYWRlckFyZWEhKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgYmUgY29sbGFwc2VkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItZWRpdCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0b2dnbGUgY29sbGFwc2Ugd2hlbiBzdXBwb3J0Q29sbGFwc2UgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IFtjcmVhdGVUb29sVmFsdWUoKV1cbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHN1cHBvcnRDb2xsYXBzZTogZmFsc2UsIHZhbHVlOiB0b29scyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdUb29scycpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc3RpbGwgYmUgdmlzaWJsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndG9vbC1zZWxlY3Rvci1lZGl0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBleHBhbmQgd2hlbiBhZGQgYnV0dG9uIGlzIGNsaWNrZWQgd2hpbGUgY29sbGFwc2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdG9vbHMgPSBbY3JlYXRlVG9vbFZhbHVlKCldXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KHsgc3VwcG9ydENvbGxhcHNlOiB0cnVlLCB2YWx1ZTogdG9vbHMgfSlcbiAgICAgIGNvbnN0IGhlYWRlckFyZWEgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJylcblxuICAgICAgLy8gQ29sbGFwc2UgZmlyc3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhoZWFkZXJBcmVhISlcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgndG9vbC1zZWxlY3Rvci1lZGl0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIGFkZCBidXR0b25cbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGFkZEJ1dHRvbiEpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBiZSBleHBhbmRlZFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItZWRpdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gU3RhdGUgTWFuYWdlbWVudCBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRyYWNrIGVuYWJsZWQgY291bnQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdG9vbHMgPSBbXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ3Rvb2wtMScsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ3Rvb2wtMicsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ3Rvb2wtMycsIGVuYWJsZWQ6IGZhbHNlIH0pLFxuICAgICAgXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiB0b29scyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcyLzMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyYWNrIGVuYWJsZWQgY291bnQgd2l0aCBNQ1AgdG9vbHMgd2hlbiBjYW5DaG9vc2VNQ1BUb29sIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtY3BUb29scyA9IFtjcmVhdGVNQ1BUb29sKHsgaWQ6ICdtY3AtcHJvdmlkZXInIH0pXVxuICAgICAgbW9ja01DUFRvb2xzRGF0YS5tb2NrUmV0dXJuVmFsdWUobWNwVG9vbHMpXG5cbiAgICAgIGNvbnN0IHRvb2xzID0gW1xuICAgICAgICBjcmVhdGVUb29sVmFsdWUoeyB0b29sX25hbWU6ICd0b29sLTEnLCBwcm92aWRlcl9uYW1lOiAncmVndWxhci1wcm92aWRlcicsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ21jcC10b29sJywgcHJvdmlkZXJfbmFtZTogJ21jcC1wcm92aWRlcicsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBjYW5DaG9vc2VNQ1BUb29sOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzIvMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNvdW50IE1DUCB0b29scyB3aGVuIGNhbkNob29zZU1DUFRvb2wgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtY3BUb29scyA9IFtjcmVhdGVNQ1BUb29sKHsgaWQ6ICdtY3AtcHJvdmlkZXInIH0pXVxuICAgICAgbW9ja01DUFRvb2xzRGF0YS5tb2NrUmV0dXJuVmFsdWUobWNwVG9vbHMpXG5cbiAgICAgIGNvbnN0IHRvb2xzID0gW1xuICAgICAgICBjcmVhdGVUb29sVmFsdWUoeyB0b29sX25hbWU6ICd0b29sLTEnLCBwcm92aWRlcl9uYW1lOiAncmVndWxhci1wcm92aWRlcicsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ21jcC10b29sJywgcHJvdmlkZXJfbmFtZTogJ21jcC1wcm92aWRlcicsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBjYW5DaG9vc2VNQ1BUb29sOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxLzInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1hbmFnZSBvcGVuIHN0YXRlIGZvciBhZGQgdG9vbCBwYW5lbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBJbml0aWFsbHkgY2xvc2VkXG4gICAgICBjb25zdCBhZGRTZWxlY3RvciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgndG9vbC1zZWxlY3Rvci1hZGQnKVxuICAgICAgZXhwZWN0KGFkZFNlbGVjdG9yKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtY29udHJvbGxlZC1zdGF0ZScsICdmYWxzZScpXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIGFkZCBidXR0b24gKEFjdGlvbkJ1dHRvbilcbiAgICAgIGNvbnN0IGFjdGlvbkJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwibXgtMVwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYWN0aW9uQnV0dG9uISlcblxuICAgICAgLy8gQXNzZXJ0IC0gT3BlbiBzdGF0ZSBzaG91bGQgY2hhbmdlIHRvIHRydWVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItYWRkJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1jb250cm9sbGVkLXN0YXRlJywgJ3RydWUnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aGVuIGFkZGluZyBhIG5ldyB0b29sIHZpYSBhZGQgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBhZGQgdG9vbCBidXR0b24gaW4gYWRkIHNlbGVjdG9yXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdhZGQtdG9vbC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBwcm92aWRlcl9uYW1lOiAnbmV3LXByb3ZpZGVyJywgdG9vbF9uYW1lOiAnbmV3LXRvb2wnIH0pLFxuICAgICAgXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdoZW4gYWRkaW5nIG11bHRpcGxlIHRvb2xzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBhZGQgbXVsdGlwbGUgdG9vbHMgYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdhZGQtbXVsdGlwbGUtdG9vbHMtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgcHJvdmlkZXJfbmFtZTogJ2JhdGNoLXAnLCB0b29sX25hbWU6ICdiYXRjaC10MScgfSksXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgcHJvdmlkZXJfbmFtZTogJ2JhdGNoLXAnLCB0b29sX25hbWU6ICdiYXRjaC10MicgfSksXG4gICAgICBdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRlZHVwbGljYXRlIHdoZW4gYWRkaW5nIGR1cGxpY2F0ZSB0b29sJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZXhpc3RpbmdUb29sID0gY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAnbmV3LXRvb2wnLCBwcm92aWRlcl9uYW1lOiAnbmV3LXByb3ZpZGVyJyB9KVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogW2V4aXN0aW5nVG9vbF0sIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdCAtIFRyeSB0byBhZGQgdGhlIHNhbWUgdG9vbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYWRkLXRvb2wtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzdGlsbCBoYXZlIG9ubHkgMSB0b29sIChkZWR1cGxpY2F0ZWQpXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtleGlzdGluZ1Rvb2xdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2hlbiBkZWxldGluZyBhIHRvb2wnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IFtcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0wJywgcHJvdmlkZXJfbmFtZTogJ3AwJyB9KSxcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0xJywgcHJvdmlkZXJfbmFtZTogJ3AxJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBEZWxldGUgZmlyc3QgdG9vbCAoaW5kZXggMClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RlbGV0ZS1idG4tMCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgaGF2ZSBvbmx5IHNlY29uZCB0b29sXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0b29sX25hbWU6ICd0b29sLTEnLCBwcm92aWRlcl9uYW1lOiAncDEnIH0pLFxuICAgICAgXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdoZW4gY29uZmlndXJpbmcgYSB0b29sJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdG9vbHMgPSBbY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0xJywgZW5hYmxlZDogdHJ1ZSB9KV1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBjb25maWd1cmUgYnV0dG9uIHRvIHRvZ2dsZSBlbmFibGVkXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maWd1cmUtYnRuLTAnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHVwZGF0ZSB0aGUgdG9vbCBhdCBpbmRleCAwXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0b29sX25hbWU6ICd0b29sLTEnLCBlbmFibGVkOiBmYWxzZSB9KSxcbiAgICAgIF0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aXRoIGNvcnJlY3QgaW5kZXggd2hlbiBjb25maWd1cmluZyBzZWNvbmQgdG9vbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRvb2xzID0gW1xuICAgICAgICBjcmVhdGVUb29sVmFsdWUoeyB0b29sX25hbWU6ICd0b29sLTAnLCBlbmFibGVkOiB0cnVlIH0pLFxuICAgICAgICBjcmVhdGVUb29sVmFsdWUoeyB0b29sX25hbWU6ICd0b29sLTEnLCBlbmFibGVkOiB0cnVlIH0pLFxuICAgICAgXVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogdG9vbHMsIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdCAtIENvbmZpZ3VyZSBzZWNvbmQgdG9vbCAoaW5kZXggMSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpZ3VyZS1idG4tMScpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgdXBkYXRlIG9ubHkgdGhlIHNlY29uZCB0b29sXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0b29sX25hbWU6ICd0b29sLTAnLCBlbmFibGVkOiB0cnVlIH0pLFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHRvb2xfbmFtZTogJ3Rvb2wtMScsIGVuYWJsZWQ6IGZhbHNlIH0pLFxuICAgICAgXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggY29ycmVjdCBhcnJheSB3aGVuIGRlbGV0aW5nIG1pZGRsZSB0b29sJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdG9vbHMgPSBbXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ3Rvb2wtMCcsIHByb3ZpZGVyX25hbWU6ICdwMCcgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ3Rvb2wtMScsIHByb3ZpZGVyX25hbWU6ICdwMScgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ3Rvb2wtMicsIHByb3ZpZGVyX25hbWU6ICdwMicgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiB0b29scywgb25DaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0IC0gRGVsZXRlIG1pZGRsZSB0b29sIChpbmRleCAxKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZGVsZXRlLWJ0bi0xJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBoYXZlIGZpcnN0IGFuZCB0aGlyZCB0b29sc1xuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdG9vbF9uYW1lOiAndG9vbC0wJyB9KSxcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0b29sX25hbWU6ICd0b29sLTInIH0pLFxuICAgICAgXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWRkIG11bHRpcGxlIGZyb20gZWRpdCBzZWxlY3RvcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRvb2xzID0gW2NyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ2V4aXN0aW5nJyB9KV1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBhZGQgbXVsdGlwbGUgZnJvbSBlZGl0IHNlbGVjdG9yXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdhZGQtbXVsdGlwbGUtYnRuLTAnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGFkZCBiYXRjaCB0b29scyB3aXRoIGRlZHVwbGljYXRpb25cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBFdmVudCBIYW5kbGVycyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRXZlbnQgSGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWRkIGJ1dHRvbiBjbGljaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoKVxuICAgICAgY29uc3QgYWRkQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGFkZEJ1dHRvbiEpXG5cbiAgICAgIC8vIEFzc2VydCAtIEFkZCB0b29sIHBhbmVsIHNob3VsZCBvcGVuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0b29sLXNlbGVjdG9yLWFkZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbGxhcHNlIGNsaWNrIHdpdGggc3VwcG9ydENvbGxhcHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdG9vbHMgPSBbY3JlYXRlVG9vbFZhbHVlKCldXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KHsgc3VwcG9ydENvbGxhcHNlOiB0cnVlLCB2YWx1ZTogdG9vbHMgfSlcbiAgICAgIGNvbnN0IGxhYmVsQXJlYSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhsYWJlbEFyZWEhKVxuXG4gICAgICAvLyBBc3NlcnQgLSBUb29scyBzaG91bGQgYmUgaGlkZGVuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItZWRpdCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDbGljayBhZ2FpbiB0byBleHBhbmRcbiAgICAgIGZpcmVFdmVudC5jbGljayhsYWJlbEFyZWEhKVxuXG4gICAgICAvLyBBc3NlcnQgLSBUb29scyBzaG91bGQgYmUgdmlzaWJsZSBhZ2FpblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndG9vbC1zZWxlY3Rvci1lZGl0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEVkZ2UgQ2FzZXMgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdmFsdWUgYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogW10gfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmRldGFpbFBhbmVsLnRvb2xTZWxlY3Rvci5lbXB0eScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QWxsQnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItZWRpdCcpKS50b0hhdmVMZW5ndGgoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHZhbHVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdCAtIHZhbHVlIGRlZmF1bHRzIHRvIFtdIGluIGNvbXBvbmVudFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHVuZGVmaW5lZCBhcyBhbnkgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmRldGFpbFBhbmVsLnRvb2xTZWxlY3Rvci5lbXB0eScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgbWNwVG9vbHMgZGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tNQ1BUb29sc0RhdGEubW9ja1JldHVyblZhbHVlKHVuZGVmaW5lZClcbiAgICAgIGNvbnN0IHRvb2xzID0gW2NyZWF0ZVRvb2xWYWx1ZSh7IGVuYWJsZWQ6IHRydWUgfSldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBzdGlsbCByZW5kZXJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxLzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB0b29scyB3aXRoIG1pc3NpbmcgZW5hYmxlZCBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRvb2xzID0gW1xuICAgICAgICB7IC4uLmNyZWF0ZVRvb2xWYWx1ZSgpLCBlbmFibGVkOiB1bmRlZmluZWQgfSBhcyBUb29sVmFsdWUsXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBjb3VudCBhcyBub3QgZW5hYmxlZCAoZmFsc3kpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMC8xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgbGFiZWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBsYWJlbDogJycgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIG5vdCBjcmFzaFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndG9vbC1zZWxlY3Rvci1hZGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBub2RlT3V0cHV0VmFycyBhcyBlbXB0eSBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IG5vZGVPdXRwdXRWYXJzOiBbXSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItYWRkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYXZhaWxhYmxlTm9kZXMgYXMgZW1wdHkgYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBhdmFpbGFibGVOb2RlczogW10gfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0b29sLXNlbGVjdG9yLWFkZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBub2RlSWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBub2RlSWQ6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItYWRkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFByb3BzIFZhcmlhdGlvbnMgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRpc2FibGVkIHByb3AgdG8gY2hpbGQgc2VsZWN0b3JzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCh7IGRpc2FibGVkOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIEFjdGlvbkJ1dHRvbiAoYWRkIGJ1dHRvbiB3aXRoIG14LTEgY2xhc3MpIHNob3VsZCBub3QgYmUgcmVuZGVyZWRcbiAgICAgIGNvbnN0IGFjdGlvbkJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwibXgtMVwiXScpXG4gICAgICBleHBlY3QoYWN0aW9uQnV0dG9uKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3Mgc2NvcGUgcHJvcCB0byBUb29sU2VsZWN0b3InLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyBzY29wZTogJ3Rlc3Qtc2NvcGUnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndG9vbC1zZWxlY3Rvci1hZGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY2FuQ2hvb3NlTUNQVG9vbCBwcm9wIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IGNhbkNob29zZU1DUFRvb2w6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0b29sLXNlbGVjdG9yLWFkZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggc3VwcG9ydEVuYWJsZVN3aXRjaCBmb3IgZWRpdCBzZWxlY3RvcnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IFtjcmVhdGVUb29sVmFsdWUoKV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogdG9vbHMgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBlZGl0U2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItZWRpdCcpXG4gICAgICBleHBlY3QoZWRpdFNlbGVjdG9yKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc3VwcG9ydC1lbmFibGUtc3dpdGNoJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSB0b29scyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDUgfSwgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogYHRvb2wtJHtpfWAsIHRvb2xfbGFiZWw6IGBUb29sICR7aX1gIH0pKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiB0b29scyB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGVkaXRTZWxlY3RvcnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItZWRpdCcpXG4gICAgICBleHBlY3QoZWRpdFNlbGVjdG9ycykudG9IYXZlTGVuZ3RoKDUpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBNQ1AgVG9vbHMgSW50ZWdyYXRpb24gVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01DUCBUb29scyBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvcnJlY3RseSBpZGVudGlmeSBNQ1AgdG9vbHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtY3BUb29scyA9IFtcbiAgICAgICAgY3JlYXRlTUNQVG9vbCh7IGlkOiAnbWNwLXByb3ZpZGVyLTEnIH0pLFxuICAgICAgICBjcmVhdGVNQ1BUb29sKHsgaWQ6ICdtY3AtcHJvdmlkZXItMicgfSksXG4gICAgICBdXG4gICAgICBtb2NrTUNQVG9vbHNEYXRhLm1vY2tSZXR1cm5WYWx1ZShtY3BUb29scylcblxuICAgICAgY29uc3QgdG9vbHMgPSBbXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHByb3ZpZGVyX25hbWU6ICdtY3AtcHJvdmlkZXItMScsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHByb3ZpZGVyX25hbWU6ICdyZWd1bGFyLXByb3ZpZGVyJywgZW5hYmxlZDogdHJ1ZSB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogdG9vbHMsIGNhbkNob29zZU1DUFRvb2w6IHRydWUgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMi8yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBleGNsdWRlIE1DUCB0b29scyBmcm9tIGVuYWJsZWQgY291bnQgd2hlbiBjYW5DaG9vc2VNQ1BUb29sIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbWNwVG9vbHMgPSBbY3JlYXRlTUNQVG9vbCh7IGlkOiAnbWNwLXByb3ZpZGVyJyB9KV1cbiAgICAgIG1vY2tNQ1BUb29sc0RhdGEubW9ja1JldHVyblZhbHVlKG1jcFRvb2xzKVxuXG4gICAgICBjb25zdCB0b29scyA9IFtcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgcHJvdmlkZXJfbmFtZTogJ21jcC1wcm92aWRlcicsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHByb3ZpZGVyX25hbWU6ICdyZWd1bGFyJywgZW5hYmxlZDogdHJ1ZSB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogdG9vbHMsIGNhbkNob29zZU1DUFRvb2w6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIE9ubHkgcmVndWxhciB0b29sIHNob3VsZCBiZSBjb3VudGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMS8yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IERlZHVwbGljYXRpb24gTG9naWMgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0RlZHVwbGljYXRpb24gTG9naWMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkZWR1cGxpY2F0ZSBieSBwcm92aWRlcl9uYW1lIGFuZCB0b29sX25hbWUgY29tYmluYXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGV4aXN0aW5nVG9vbHMgPSBbXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHByb3ZpZGVyX25hbWU6ICduZXctcHJvdmlkZXInLCB0b29sX25hbWU6ICduZXctdG9vbCcgfSksXG4gICAgICBdXG4gICAgICByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogZXhpc3RpbmdUb29scywgb25DaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0IC0gVHJ5IHRvIGFkZCBzYW1lIHByb3ZpZGVyX25hbWUgKyB0b29sX25hbWUgdmlhIGFkZCBidXR0b25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FkZC10b29sLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGFkZCBkdXBsaWNhdGUsIG9ubHkgZXhpc3RpbmcgdG9vbCByZW1haW5zXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4aXN0aW5nVG9vbHMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgc2FtZSB0b29sX25hbWUgd2l0aCBkaWZmZXJlbnQgcHJvdmlkZXJfbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZXhpc3RpbmdUb29scyA9IFtcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgcHJvdmlkZXJfbmFtZTogJ290aGVyLXByb3ZpZGVyJywgdG9vbF9uYW1lOiAnbmV3LXRvb2wnIH0pLFxuICAgICAgXVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IGV4aXN0aW5nVG9vbHMsIG9uQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdCAtIEFkZCB0b29sIHdpdGggZGlmZmVyZW50IHByb3ZpZGVyXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdhZGQtdG9vbC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGFkZCBhcyBpdCdzIGRpZmZlcmVudCBwcm92aWRlclxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXG4gICAgICAgIGV4aXN0aW5nVG9vbHNbMF0sXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgcHJvdmlkZXJfbmFtZTogJ25ldy1wcm92aWRlcicsIHRvb2xfbmFtZTogJ25ldy10b29sJyB9KSxcbiAgICAgIF0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGVkdXBsaWNhdGUgbXVsdGlwbGUgdG9vbHMgaW4gYmF0Y2ggYWRkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBleGlzdGluZ1Rvb2xzID0gW1xuICAgICAgICBjcmVhdGVUb29sVmFsdWUoeyBwcm92aWRlcl9uYW1lOiAnYmF0Y2gtcCcsIHRvb2xfbmFtZTogJ2JhdGNoLXQxJyB9KSxcbiAgICAgIF1cbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiBleGlzdGluZ1Rvb2xzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBBZGQgbXVsdGlwbGUgdG9vbHMgKGJhdGNoLXQxIGlzIGR1cGxpY2F0ZSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FkZC1tdWx0aXBsZS10b29scy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGhhdmUgMiB1bmlxdWUgdG9vbHMgKGJhdGNoLXQxIGRlZHVwbGljYXRlZClcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW1xuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHByb3ZpZGVyX25hbWU6ICdiYXRjaC1wJywgdG9vbF9uYW1lOiAnYmF0Y2gtdDEnIH0pLFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHByb3ZpZGVyX25hbWU6ICdiYXRjaC1wJywgdG9vbF9uYW1lOiAnYmF0Y2gtdDInIH0pLFxuICAgICAgXSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IERlbGV0ZSBGdW5jdGlvbmFsaXR5IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdEZWxldGUgRnVuY3Rpb25hbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbW92ZSB0b29sIGF0IHNwZWNpZmljIGluZGV4IHdoZW4gZGVsZXRlIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IFtcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0wJywgcHJvdmlkZXJfbmFtZTogJ3AwJyB9KSxcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0xJywgcHJvdmlkZXJfbmFtZTogJ3AxJyB9KSxcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0yJywgcHJvdmlkZXJfbmFtZTogJ3AyJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBEZWxldGUgZmlyc3QgdG9vbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZGVsZXRlLWJ0bi0wJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdG9vbF9uYW1lOiAndG9vbC0xJyB9KSxcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0b29sX25hbWU6ICd0b29sLTInIH0pLFxuICAgICAgXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgbGFzdCB0b29sIHdoZW4gZGVsZXRlIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IFtcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0wJywgcHJvdmlkZXJfbmFtZTogJ3AwJyB9KSxcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0xJywgcHJvdmlkZXJfbmFtZTogJ3AxJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBEZWxldGUgbGFzdCB0b29sIChpbmRleCAxKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZGVsZXRlLWJ0bi0xJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdG9vbF9uYW1lOiAndG9vbC0wJyB9KSxcbiAgICAgIF0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVzdWx0IGluIGVtcHR5IGFycmF5IHdoZW4gZGVsZXRpbmcgbGFzdCByZW1haW5pbmcgdG9vbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRvb2xzID0gW2NyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ29ubHktdG9vbCcgfSldXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiB0b29scywgb25DaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0IC0gRGVsZXRlIHRoZSBvbmx5IHRvb2xcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RlbGV0ZS1idG4tMCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBDb25maWd1cmUgRnVuY3Rpb25hbGl0eSBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29uZmlndXJlIEZ1bmN0aW9uYWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgdG9vbCBhdCBzcGVjaWZpYyBpbmRleCB3aGVuIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IFtcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0xJywgZW5hYmxlZDogdHJ1ZSB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBDb25maWd1cmUgdG9vbCAodG9nZ2xlcyBlbmFibGVkKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlndXJlLWJ0bi0wJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdG9vbF9uYW1lOiAndG9vbC0xJywgZW5hYmxlZDogZmFsc2UgfSksXG4gICAgICBdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIG90aGVyIHRvb2xzIHdoZW4gY29uZmlndXJpbmcgb25lIHRvb2wnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IFtcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0wJywgZW5hYmxlZDogdHJ1ZSB9KSxcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAndG9vbC0xJywgZW5hYmxlZDogZmFsc2UgfSksXG4gICAgICAgIGNyZWF0ZVRvb2xWYWx1ZSh7IHRvb2xfbmFtZTogJ3Rvb2wtMicsIGVuYWJsZWQ6IHRydWUgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHZhbHVlOiB0b29scywgb25DaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0IC0gQ29uZmlndXJlIG1pZGRsZSB0b29sIChpbmRleCAxKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlndXJlLWJ0bi0xJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIEFsbCB0b29scyBwcmVzZXJ2ZWQsIG9ubHkgbWlkZGxlIG9uZSBjaGFuZ2VkXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0b29sX25hbWU6ICd0b29sLTAnLCBlbmFibGVkOiB0cnVlIH0pLFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHRvb2xfbmFtZTogJ3Rvb2wtMScsIGVuYWJsZWQ6IHRydWUgfSksIC8vIHRvZ2dsZWRcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0b29sX25hbWU6ICd0b29sLTInLCBlbmFibGVkOiB0cnVlIH0pLFxuICAgICAgXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgZmlyc3QgdG9vbCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29scyA9IFtcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAnZmlyc3QnLCBlbmFibGVkOiBmYWxzZSB9KSxcbiAgICAgICAgY3JlYXRlVG9vbFZhbHVlKHsgdG9vbF9uYW1lOiAnc2Vjb25kJywgZW5hYmxlZDogdHJ1ZSB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyQ29tcG9uZW50KHsgdmFsdWU6IHRvb2xzLCBvbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBDb25maWd1cmUgZmlyc3QgdG9vbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlndXJlLWJ0bi0wJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdG9vbF9uYW1lOiAnZmlyc3QnLCBlbmFibGVkOiB0cnVlIH0pLCAvLyB0b2dnbGVkXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdG9vbF9uYW1lOiAnc2Vjb25kJywgZW5hYmxlZDogdHJ1ZSB9KSxcbiAgICAgIF0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBQYW5lbCBTdGF0ZSBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUGFuZWwgU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBwYW5lbCBzaG93IHN0YXRlIHRydWUgb24gYWRkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIGFkZCBidXR0b25cbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGFkZEJ1dHRvbiEpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYWRkU2VsZWN0b3IgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Rvb2wtc2VsZWN0b3ItYWRkJylcbiAgICAgIGV4cGVjdChhZGRTZWxlY3RvcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXBhbmVsLXNob3ctc3RhdGUnLCAndHJ1ZScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBBY2Nlc3NpYmlsaXR5IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBjbGlja2FibGUgYWRkIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGFkZEJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZGl2aWRlciB3aGVuIHRvb2xzIGFyZSBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRvb2xzID0gW2NyZWF0ZVRvb2xWYWx1ZSgpXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDb21wb25lbnQoeyB2YWx1ZTogdG9vbHMgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBkaXZpZGVyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tjbGFzcyo9XCJoLTNcIl0nKVxuICAgICAgZXhwZWN0KGRpdmlkZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFRvb2x0aXAgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Rvb2x0aXAgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHF1ZXN0aW9uIGljb24gd2hlbiB0b29sdGlwIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCh7IHRvb2x0aXA6ICdIZWxwIHRleHQnIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcXVlc3Rpb25JY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3QocXVlc3Rpb25JY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBxdWVzdGlvbiBpY29uIHdoZW4gdG9vbHRpcCBpcyBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KHsgdG9vbHRpcDogdW5kZWZpbmVkIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBvbmx5IGhhdmUgYWRkIGljb24sIG5vdCBxdWVzdGlvbiBpY29uIGluIGxhYmVsIGFyZWFcbiAgICAgIGNvbnN0IGxhYmVsRGl2ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zeXN0ZW0tc20tc2VtaWJvbGQtdXBwZXJjYXNlJylcbiAgICAgIGNvbnN0IGljb25zID0gbGFiZWxEaXY/LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2ZycpIHx8IFtdXG4gICAgICAvLyBRdWVzdGlvbiBpY29uIHNob3VsZCBub3QgYmUgaW4gdGhlIGxhYmVsIGFyZWFcbiAgICAgIGV4cGVjdChpY29ucy5sZW5ndGgpLnRvQmVMZXNzVGhhbk9yRXF1YWwoMSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==