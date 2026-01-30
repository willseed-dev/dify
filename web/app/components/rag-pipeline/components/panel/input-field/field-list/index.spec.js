"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const pipeline_1 = require("@/models/pipeline");
const field_item_1 = require("./field-item");
const field_list_container_1 = require("./field-list-container");
const index_1 = require("./index");
// ============================================================================
// Mock External Dependencies
// ============================================================================
// Mock ahooks useHover
let mockIsHovering = false;
const getMockIsHovering = () => mockIsHovering;
vi.mock('ahooks', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useHover: () => getMockIsHovering(),
    };
});
// Mock react-sortablejs
vi.mock('react-sortablejs', () => ({
    ReactSortable: ({ children, list, setList, disabled, className }) => (<div data-testid="sortable-container" data-disabled={disabled} className={className}>
      {children}
      <button data-testid="trigger-sort" onClick={() => {
            if (!disabled && list.length > 1) {
                // Simulate reorder: swap first two items
                const newList = [...list];
                const temp = newList[0];
                newList[0] = newList[1];
                newList[1] = temp;
                setList(newList);
            }
        }}>
        Trigger Sort
      </button>
      <button data-testid="trigger-same-sort" onClick={() => {
            // Trigger setList with same list (no actual change)
            setList([...list]);
        }}>
        Trigger Same Sort
      </button>
    </div>),
}));
// Mock usePipeline hook
const mockHandleInputVarRename = vi.fn();
const mockIsVarUsedInNodes = vi.fn(() => false);
const mockRemoveUsedVarInNodes = vi.fn();
vi.mock('../../../../hooks/use-pipeline', () => ({
    usePipeline: () => ({
        handleInputVarRename: mockHandleInputVarRename,
        isVarUsedInNodes: mockIsVarUsedInNodes,
        removeUsedVarInNodes: mockRemoveUsedVarInNodes,
    }),
}));
// Mock useInputFieldPanel hook
const mockToggleInputFieldEditPanel = vi.fn();
vi.mock('@/app/components/rag-pipeline/hooks', () => ({
    useInputFieldPanel: () => ({
        toggleInputFieldEditPanel: mockToggleInputFieldEditPanel,
    }),
}));
// Mock Toast
vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: vi.fn(),
    },
}));
// Mock RemoveEffectVarConfirm
vi.mock('@/app/components/workflow/nodes/_base/components/remove-effect-var-confirm', () => ({
    default: ({ isShow, onCancel, onConfirm, }) => isShow
        ? (<div data-testid="remove-var-confirm">
          <button data-testid="confirm-cancel" onClick={onCancel}>Cancel</button>
          <button data-testid="confirm-ok" onClick={onConfirm}>Confirm</button>
        </div>)
        : null,
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
const createInputVarList = (count) => {
    return Array.from({ length: count }, (_, i) => createInputVar({
        variable: `var_${i}`,
        label: `Label ${i}`,
    }));
};
const createSortableItem = (inputVar, overrides) => ({
    id: inputVar.variable,
    chosen: false,
    selected: false,
    ...inputVar,
    ...overrides,
});
// ============================================================================
// FieldItem Component Tests
// ============================================================================
describe('FieldItem', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsHovering = false;
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render field item with variable name', () => {
            // Arrange
            const payload = createInputVar({ variable: 'my_field' });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('my_field')).toBeInTheDocument();
        });
        it('should render field item with label when provided', () => {
            // Arrange
            const payload = createInputVar({ variable: 'field', label: 'Field Label' });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('Field Label')).toBeInTheDocument();
        });
        it('should not render label when empty', () => {
            // Arrange
            const payload = createInputVar({ variable: 'field', label: '' });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            expect(react_1.screen.queryByText('·')).not.toBeInTheDocument();
        });
        it('should render required badge when not hovering and required is true', () => {
            // Arrange
            mockIsHovering = false;
            const payload = createInputVar({ required: true });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText(/required/i)).toBeInTheDocument();
        });
        it('should not render required badge when required is false', () => {
            // Arrange
            mockIsHovering = false;
            const payload = createInputVar({ required: false });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            expect(react_1.screen.queryByText(/required/i)).not.toBeInTheDocument();
        });
        it('should render InputField icon when not hovering', () => {
            // Arrange
            mockIsHovering = false;
            const payload = createInputVar();
            // Act
            const { container } = (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert - InputField icon should be present (not RiDraggable)
            const icons = container.querySelectorAll('svg');
            expect(icons.length).toBeGreaterThan(0);
        });
        it('should render drag icon when hovering and not readonly', () => {
            // Arrange
            mockIsHovering = true;
            const payload = createInputVar();
            // Act
            const { container } = (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()} readonly={false}/>);
            // Assert - RiDraggable icon should be present
            const icons = container.querySelectorAll('svg');
            expect(icons.length).toBeGreaterThan(0);
        });
        it('should render edit and delete buttons when hovering and not readonly', () => {
            // Arrange
            mockIsHovering = true;
            const payload = createInputVar();
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()} readonly={false}/>);
            // Assert
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons.length).toBe(2); // Edit and Delete buttons
        });
        it('should not render edit and delete buttons when readonly', () => {
            // Arrange
            mockIsHovering = true;
            const payload = createInputVar();
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()} readonly={true}/>);
            // Assert
            const buttons = react_1.screen.queryAllByRole('button');
            expect(buttons.length).toBe(0);
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onClickEdit with variable when edit button is clicked', () => {
            // Arrange
            mockIsHovering = true;
            const onClickEdit = vi.fn();
            const payload = createInputVar({ variable: 'test_var' });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={onClickEdit} onRemove={vi.fn()}/>);
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[0]); // Edit button
            // Assert
            expect(onClickEdit).toHaveBeenCalledWith('test_var');
        });
        it('should call onRemove with index when delete button is clicked', () => {
            // Arrange
            mockIsHovering = true;
            const onRemove = vi.fn();
            const payload = createInputVar();
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={5} onClickEdit={vi.fn()} onRemove={onRemove}/>);
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[1]); // Delete button
            // Assert
            expect(onRemove).toHaveBeenCalledWith(5);
        });
        it('should not call onClickEdit when readonly', () => {
            // Arrange
            mockIsHovering = true;
            const onClickEdit = vi.fn();
            const payload = createInputVar();
            // Render without readonly to get buttons, then check behavior
            const { rerender } = (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={onClickEdit} onRemove={vi.fn()} readonly={false}/>);
            // Re-render with readonly but buttons still exist from previous state check
            rerender(<field_item_1.default payload={payload} index={0} onClickEdit={onClickEdit} onRemove={vi.fn()} readonly={true}/>);
            // Assert - no buttons should be rendered when readonly
            expect(react_1.screen.queryAllByRole('button').length).toBe(0);
        });
        it('should stop event propagation when edit button is clicked', () => {
            // Arrange
            mockIsHovering = true;
            const onClickEdit = vi.fn();
            const parentClick = vi.fn();
            const payload = createInputVar();
            // Act
            (0, react_1.render)(<div onClick={parentClick}>
          <field_item_1.default payload={payload} index={0} onClickEdit={onClickEdit} onRemove={vi.fn()}/>
        </div>);
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[0]);
            // Assert - parent click should not be called due to stopPropagation
            expect(onClickEdit).toHaveBeenCalled();
            expect(parentClick).not.toHaveBeenCalled();
        });
        it('should stop event propagation when delete button is clicked', () => {
            // Arrange
            mockIsHovering = true;
            const onRemove = vi.fn();
            const parentClick = vi.fn();
            const payload = createInputVar();
            // Act
            (0, react_1.render)(<div onClick={parentClick}>
          <field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={onRemove}/>
        </div>);
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[1]);
            // Assert
            expect(onRemove).toHaveBeenCalled();
            expect(parentClick).not.toHaveBeenCalled();
        });
    });
    // -------------------------------------------------------------------------
    // Callback Stability Tests
    // -------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should maintain stable handleOnClickEdit when props dont change', () => {
            // Arrange
            mockIsHovering = true;
            const onClickEdit = vi.fn();
            const payload = createInputVar();
            // Act
            const { rerender } = (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={onClickEdit} onRemove={vi.fn()}/>);
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[0]);
            rerender(<field_item_1.default payload={payload} index={0} onClickEdit={onClickEdit} onRemove={vi.fn()}/>);
            const buttonsAfterRerender = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttonsAfterRerender[0]);
            // Assert
            expect(onClickEdit).toHaveBeenCalledTimes(2);
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle very long variable names with truncation', () => {
            // Arrange
            const longVariable = 'a'.repeat(200);
            const payload = createInputVar({ variable: longVariable });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            const varElement = react_1.screen.getByTitle(longVariable);
            expect(varElement).toHaveClass('truncate');
        });
        it('should handle very long label names with truncation', () => {
            // Arrange
            const longLabel = 'b'.repeat(200);
            const payload = createInputVar({ label: longLabel });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            const labelElement = react_1.screen.getByTitle(longLabel);
            expect(labelElement).toHaveClass('truncate');
        });
        it('should handle special characters in variable and label', () => {
            // Arrange
            const payload = createInputVar({
                variable: '<test>&"var\'',
                label: '<label>&"test\'',
            });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('<test>&"var\'')).toBeInTheDocument();
            expect(react_1.screen.getByText('<label>&"test\'')).toBeInTheDocument();
        });
        it('should handle unicode characters', () => {
            // Arrange
            const payload = createInputVar({
                variable: '变量_🎉',
                label: '标签_😀',
            });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('变量_🎉')).toBeInTheDocument();
            expect(react_1.screen.getByText('标签_😀')).toBeInTheDocument();
        });
        it('should render different input types correctly', () => {
            // Arrange
            const types = [
                pipeline_1.PipelineInputVarType.textInput,
                pipeline_1.PipelineInputVarType.paragraph,
                pipeline_1.PipelineInputVarType.number,
                pipeline_1.PipelineInputVarType.select,
                pipeline_1.PipelineInputVarType.singleFile,
                pipeline_1.PipelineInputVarType.multiFiles,
                pipeline_1.PipelineInputVarType.checkbox,
            ];
            types.forEach((type) => {
                const payload = createInputVar({ type });
                // Act
                const { unmount } = (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()}/>);
                // Assert
                expect(react_1.screen.getByText('test_variable')).toBeInTheDocument();
                unmount();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be memoized with React.memo', () => {
            // Arrange
            const payload = createInputVar();
            const onClickEdit = vi.fn();
            const onRemove = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={onClickEdit} onRemove={onRemove}/>);
            // Rerender with same props
            rerender(<field_item_1.default payload={payload} index={0} onClickEdit={onClickEdit} onRemove={onRemove}/>);
            // Assert - component should still render correctly
            expect(react_1.screen.getByText('test_variable')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Readonly Mode Behavior Tests
    // -------------------------------------------------------------------------
    describe('Readonly Mode Behavior', () => {
        it('should not render action buttons in readonly mode even when hovering', () => {
            // Arrange
            mockIsHovering = true;
            const payload = createInputVar();
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()} readonly={true}/>);
            // Assert - no action buttons should be rendered
            expect(react_1.screen.queryAllByRole('button')).toHaveLength(0);
        });
        it('should render type icon and required badge in readonly mode when hovering', () => {
            // Arrange
            mockIsHovering = true;
            const payload = createInputVar({ required: true });
            // Act
            (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()} readonly={true}/>);
            // Assert - required badge should be visible instead of action buttons
            expect(react_1.screen.getByText(/required/i)).toBeInTheDocument();
        });
        it('should apply cursor-default class when readonly', () => {
            // Arrange
            const payload = createInputVar();
            // Act
            const { container } = (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()} readonly={true}/>);
            // Assert
            const fieldItem = container.firstChild;
            expect(fieldItem.className).toContain('cursor-default');
        });
        it('should apply cursor-all-scroll class when hovering and not readonly', () => {
            // Arrange
            mockIsHovering = true;
            const payload = createInputVar();
            // Act
            const { container } = (0, react_1.render)(<field_item_1.default payload={payload} index={0} onClickEdit={vi.fn()} onRemove={vi.fn()} readonly={false}/>);
            // Assert
            const fieldItem = container.firstChild;
            expect(fieldItem.className).toContain('cursor-all-scroll');
        });
    });
});
// ============================================================================
// FieldListContainer Component Tests
// ============================================================================
describe('FieldListContainer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsHovering = false;
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render sortable container', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByTestId('sortable-container')).toBeInTheDocument();
        });
        it('should render all field items', () => {
            // Arrange
            const inputFields = createInputVarList(3);
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('var_0')).toBeInTheDocument();
            expect(react_1.screen.getByText('var_1')).toBeInTheDocument();
            expect(react_1.screen.getByText('var_2')).toBeInTheDocument();
        });
        it('should render empty list without errors', () => {
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={[]} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByTestId('sortable-container')).toBeInTheDocument();
        });
        it('should apply custom className', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<field_list_container_1.default className="custom-class" inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Assert
            const container = react_1.screen.getByTestId('sortable-container');
            expect(container.className).toContain('custom-class');
        });
        it('should disable sorting when readonly is true', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()} readonly={true}/>);
            // Assert
            const container = react_1.screen.getByTestId('sortable-container');
            expect(container.dataset.disabled).toBe('true');
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onListSortChange when items are reordered', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            const onListSortChange = vi.fn();
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={onListSortChange} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert
            expect(onListSortChange).toHaveBeenCalled();
        });
        it('should not call onListSortChange when list hasnt changed', () => {
            // Arrange
            const inputFields = [createInputVar()];
            const onListSortChange = vi.fn();
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={onListSortChange} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert - with only one item, no reorder happens
            expect(onListSortChange).not.toHaveBeenCalled();
        });
        it('should not call onListSortChange when disabled', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            const onListSortChange = vi.fn();
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={onListSortChange} onRemoveField={vi.fn()} onEditField={vi.fn()} readonly={true}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert
            expect(onListSortChange).not.toHaveBeenCalled();
        });
        it('should not call onListSortChange when list order is unchanged (isEqual check)', () => {
            // Arrange - This tests line 42 in field-list-container.tsx
            const inputFields = createInputVarList(2);
            const onListSortChange = vi.fn();
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={onListSortChange} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Trigger same sort - passes same list to setList
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-same-sort'));
            // Assert - onListSortChange should NOT be called due to isEqual check
            expect(onListSortChange).not.toHaveBeenCalled();
        });
        it('should pass onEditField to FieldItem', () => {
            // Arrange
            mockIsHovering = true;
            const inputFields = createInputVarList(1);
            const onEditField = vi.fn();
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={onEditField}/>);
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[0]); // Edit button
            // Assert
            expect(onEditField).toHaveBeenCalledWith('var_0');
        });
        it('should pass onRemoveField to FieldItem', () => {
            // Arrange
            mockIsHovering = true;
            const inputFields = createInputVarList(1);
            const onRemoveField = vi.fn();
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={onRemoveField} onEditField={vi.fn()}/>);
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[1]); // Delete button
            // Assert
            expect(onRemoveField).toHaveBeenCalledWith(0);
        });
    });
    // -------------------------------------------------------------------------
    // List Conversion Tests
    // -------------------------------------------------------------------------
    describe('List Conversion', () => {
        it('should convert InputVar[] to SortableItem[]', () => {
            // Arrange
            const inputFields = [
                createInputVar({ variable: 'var1' }),
                createInputVar({ variable: 'var2' }),
            ];
            const onListSortChange = vi.fn();
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={onListSortChange} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert - onListSortChange should receive SortableItem[]
            expect(onListSortChange).toHaveBeenCalled();
            const calledWith = onListSortChange.mock.calls[0][0];
            expect(calledWith[0]).toHaveProperty('id');
            expect(calledWith[0]).toHaveProperty('chosen');
            expect(calledWith[0]).toHaveProperty('selected');
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should memoize list transformation', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            const onListSortChange = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={onListSortChange} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            rerender(<field_list_container_1.default inputFields={inputFields} onListSortChange={onListSortChange} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Assert - component should still render correctly
            expect(react_1.screen.getByText('var_0')).toBeInTheDocument();
        });
        it('should be memoized with React.memo', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            // Act
            const { rerender } = (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Rerender with same props
            rerender(<field_list_container_1.default inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('var_0')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle large list of items', () => {
            // Arrange
            const inputFields = createInputVarList(100);
            // Act
            (0, react_1.render)(<field_list_container_1.default inputFields={inputFields} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('var_0')).toBeInTheDocument();
            expect(react_1.screen.getByText('var_99')).toBeInTheDocument();
        });
        it('should throw error when inputFields is undefined', () => {
            // This test documents that undefined inputFields will cause an error
            // In production, this should be prevented by TypeScript
            expect(() => (0, react_1.render)(<field_list_container_1.default inputFields={undefined} onListSortChange={vi.fn()} onRemoveField={vi.fn()} onEditField={vi.fn()}/>)).toThrow();
        });
    });
});
// ============================================================================
// FieldList Component Tests (Integration)
// ============================================================================
describe('FieldList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsHovering = false;
        mockIsVarUsedInNodes.mockReturnValue(false);
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render FieldList component', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={<span>Label Content</span>} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={['var_0', 'var_1']}/>);
            // Assert
            expect(react_1.screen.getByText('Label Content')).toBeInTheDocument();
            expect(react_1.screen.getByText('var_0')).toBeInTheDocument();
        });
        it('should render add button', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Assert
            const addButton = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
            expect(addButton).toBeInTheDocument();
        });
        it('should disable add button when readonly', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]} readonly={true}/>);
            // Assert
            const addButton = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
            expect(addButton).toBeDisabled();
        });
        it('should apply custom labelClassName', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            // Act
            const { container } = (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={<span>Content</span>} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]} labelClassName="custom-label-class"/>);
            // Assert
            const labelContainer = container.querySelector('.custom-label-class');
            expect(labelContainer).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // User Interaction Tests
    // -------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should open editor panel when add button is clicked', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            const addButton = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
            if (addButton)
                react_1.fireEvent.click(addButton);
            // Assert
            expect(mockToggleInputFieldEditPanel).toHaveBeenCalled();
        });
        it('should not open editor when readonly and add button clicked', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]} readonly={true}/>);
            const addButton = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
            if (addButton)
                react_1.fireEvent.click(addButton);
            // Assert - button is disabled so click shouldnt work
            expect(mockToggleInputFieldEditPanel).not.toHaveBeenCalled();
        });
    });
    // -------------------------------------------------------------------------
    // Callback Tests
    // -------------------------------------------------------------------------
    describe('Callback Handling', () => {
        it('should call handleInputFieldsChange with nodeId when fields change', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-123" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            // Trigger sort to cause fields change
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert
            expect(handleInputFieldsChange).toHaveBeenCalledWith('node-123', expect.any(Array));
        });
    });
    // -------------------------------------------------------------------------
    // Remove Confirmation Tests
    // -------------------------------------------------------------------------
    describe('Remove Confirmation', () => {
        it('should show remove confirmation when variable is used in nodes', async () => {
            // Arrange
            mockIsVarUsedInNodes.mockReturnValue(true);
            mockIsHovering = true;
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Find all buttons in the sortable container (edit and delete)
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            // The second button should be the delete button
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('remove-var-confirm')).toBeInTheDocument();
            });
        });
        it('should hide remove confirmation when cancel is clicked', async () => {
            // Arrange
            mockIsVarUsedInNodes.mockReturnValue(true);
            mockIsHovering = true;
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Trigger remove - find delete button in sortable container
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('remove-var-confirm')).toBeInTheDocument();
            });
            // Click cancel
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-cancel'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('remove-var-confirm')).not.toBeInTheDocument();
            });
        });
        it('should remove field and call removeUsedVarInNodes when confirm is clicked', async () => {
            // Arrange
            mockIsVarUsedInNodes.mockReturnValue(true);
            mockIsHovering = true;
            const inputFields = createInputVarList(1);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            // Trigger remove - find delete button in sortable container
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('remove-var-confirm')).toBeInTheDocument();
            });
            // Click confirm
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(handleInputFieldsChange).toHaveBeenCalled();
                expect(mockRemoveUsedVarInNodes).toHaveBeenCalled();
            });
        });
        it('should remove field directly when variable is not used in nodes', () => {
            // Arrange
            mockIsVarUsedInNodes.mockReturnValue(false);
            mockIsHovering = true;
            const inputFields = createInputVarList(2);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            // Find delete button in sortable container
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            // Assert - should not show confirmation
            expect(react_1.screen.queryByTestId('remove-var-confirm')).not.toBeInTheDocument();
            expect(handleInputFieldsChange).toHaveBeenCalled();
        });
    });
    // -------------------------------------------------------------------------
    // Edge Cases Tests
    // -------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty inputFields', () => {
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={[]} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Assert
            expect(react_1.screen.getByTestId('sortable-container')).toBeInTheDocument();
        });
        it('should handle null LabelRightContent', () => {
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={createInputVarList(1)} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Assert - should render without errors
            expect(react_1.screen.getByText('var_0')).toBeInTheDocument();
        });
        it('should handle complex LabelRightContent', () => {
            // Arrange
            const complexContent = (<div data-testid="complex-content">
          <span>Part 1</span>
          <button>Part 2</button>
        </div>);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={complexContent} inputFields={createInputVarList(1)} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Assert
            expect(react_1.screen.getByTestId('complex-content')).toBeInTheDocument();
            expect(react_1.screen.getByText('Part 1')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests
    // -------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            const handleInputFieldsChange = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            rerender(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            // Assert
            expect(react_1.screen.getByText('var_0')).toBeInTheDocument();
        });
        it('should maintain stable onInputFieldsChange callback', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            const handleInputFieldsChange = vi.fn();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            rerender(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert
            expect(handleInputFieldsChange).toHaveBeenCalledTimes(2);
        });
    });
});
// ============================================================================
// useFieldList Hook Tests
// ============================================================================
describe('useFieldList Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsVarUsedInNodes.mockReturnValue(false);
    });
    // -------------------------------------------------------------------------
    // Initialization Tests
    // -------------------------------------------------------------------------
    describe('Initialization', () => {
        it('should initialize with provided inputFields', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Assert
            expect(react_1.screen.getByText('var_0')).toBeInTheDocument();
            expect(react_1.screen.getByText('var_1')).toBeInTheDocument();
        });
        it('should initialize with empty inputFields', () => {
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={[]} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Assert
            expect(react_1.screen.getByTestId('sortable-container')).toBeInTheDocument();
        });
    });
    // -------------------------------------------------------------------------
    // handleListSortChange Tests
    // -------------------------------------------------------------------------
    describe('handleListSortChange', () => {
        it('should update inputFields and call onInputFieldsChange', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert
            expect(handleInputFieldsChange).toHaveBeenCalledWith('node-1', expect.arrayContaining([
                expect.objectContaining({ variable: 'var_1' }),
                expect.objectContaining({ variable: 'var_0' }),
            ]));
        });
        it('should strip sortable properties from list items', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert
            const calledWith = handleInputFieldsChange.mock.calls[0][1];
            expect(calledWith[0]).not.toHaveProperty('id');
            expect(calledWith[0]).not.toHaveProperty('chosen');
            expect(calledWith[0]).not.toHaveProperty('selected');
        });
    });
    // -------------------------------------------------------------------------
    // handleRemoveField Tests
    // -------------------------------------------------------------------------
    describe('handleRemoveField', () => {
        it('should show confirmation when variable is used', async () => {
            // Arrange
            mockIsVarUsedInNodes.mockReturnValue(true);
            mockIsHovering = true;
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Find delete button in sortable container
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('remove-var-confirm')).toBeInTheDocument();
            });
        });
        it('should remove directly when variable is not used', () => {
            // Arrange
            mockIsVarUsedInNodes.mockReturnValue(false);
            mockIsHovering = true;
            const inputFields = createInputVarList(2);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            // Find delete button in sortable container
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            // Assert
            expect(react_1.screen.queryByTestId('remove-var-confirm')).not.toBeInTheDocument();
            expect(handleInputFieldsChange).toHaveBeenCalled();
        });
        it('should not call handleInputFieldsChange immediately when variable is used (lines 70-72)', async () => {
            // Arrange - This tests that when variable is used, we show confirmation instead of removing directly
            mockIsVarUsedInNodes.mockReturnValue(true);
            mockIsHovering = true;
            const inputFields = createInputVarList(1);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            // Find delete button and click it
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            // Assert - handleInputFieldsChange should NOT be called yet (waiting for confirmation)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('remove-var-confirm')).toBeInTheDocument();
            });
            expect(handleInputFieldsChange).not.toHaveBeenCalled();
        });
        it('should call isVarUsedInNodes with correct variable selector', async () => {
            // Arrange
            mockIsVarUsedInNodes.mockReturnValue(true);
            mockIsHovering = true;
            const inputFields = [createInputVar({ variable: 'my_test_var' })];
            // Act
            (0, react_1.render)(<index_1.default nodeId="test-node-123" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            // Assert
            expect(mockIsVarUsedInNodes).toHaveBeenCalledWith(['rag', 'test-node-123', 'my_test_var']);
        });
        it('should handle empty variable name gracefully', async () => {
            // Arrange - Tests line 70 with empty variable
            mockIsVarUsedInNodes.mockReturnValue(false);
            mockIsHovering = true;
            const inputFields = [createInputVar({ variable: '' })];
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            // Assert - should still work with empty variable
            expect(mockIsVarUsedInNodes).toHaveBeenCalledWith(['rag', 'node-1', '']);
        });
        it('should set removedVar and removedIndex when showing confirmation (lines 71-73)', async () => {
            // Arrange - Tests the setRemovedVar and setRemoveIndex calls in lines 71-73
            mockIsVarUsedInNodes.mockReturnValue(true);
            mockIsHovering = true;
            const inputFields = createInputVarList(3);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            // Click delete on the SECOND item (index 1)
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const allFieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            // Each field item has 2 buttons (edit, delete), so index 3 is delete of second item
            if (allFieldItemButtons.length >= 4)
                react_1.fireEvent.click(allFieldItemButtons[3]);
            // Show confirmation
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('remove-var-confirm')).toBeInTheDocument();
            });
            // Click confirm
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // Assert - should remove the correct item (var_1 at index 1)
            await (0, react_1.waitFor)(() => {
                expect(handleInputFieldsChange).toHaveBeenCalled();
            });
            const calledFields = handleInputFieldsChange.mock.calls[0][1];
            expect(calledFields.length).toBe(2); // 3 - 1 = 2 items remaining
            expect(calledFields.map((f) => f.variable)).toEqual(['var_0', 'var_2']);
        });
    });
    // -------------------------------------------------------------------------
    // handleOpenInputFieldEditor Tests
    // -------------------------------------------------------------------------
    describe('handleOpenInputFieldEditor', () => {
        it('should call toggleInputFieldEditPanel with editor props', () => {
            // Arrange
            const inputFields = createInputVarList(1);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            const addButton = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
            if (addButton)
                react_1.fireEvent.click(addButton);
            // Assert
            expect(mockToggleInputFieldEditPanel).toHaveBeenCalledWith(expect.objectContaining({
                onClose: expect.any(Function),
                onSubmit: expect.any(Function),
            }));
        });
        it('should pass initialData when editing existing field', () => {
            // Arrange
            mockIsHovering = true;
            const inputFields = [createInputVar({ variable: 'my_var', label: 'My Label' })];
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
            // Find edit button in sortable container (first action button)
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 1)
                react_1.fireEvent.click(fieldItemButtons[0]);
            // Assert
            expect(mockToggleInputFieldEditPanel).toHaveBeenCalledWith(expect.objectContaining({
                initialData: expect.objectContaining({
                    variable: 'my_var',
                    label: 'My Label',
                }),
            }));
        });
    });
    // -------------------------------------------------------------------------
    // onRemoveVarConfirm Tests
    // -------------------------------------------------------------------------
    describe('onRemoveVarConfirm', () => {
        it('should remove field and call removeUsedVarInNodes', async () => {
            // Arrange
            mockIsVarUsedInNodes.mockReturnValue(true);
            mockIsHovering = true;
            const inputFields = createInputVarList(2);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            // Find delete button in sortable container
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('remove-var-confirm')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(handleInputFieldsChange).toHaveBeenCalled();
                expect(mockRemoveUsedVarInNodes).toHaveBeenCalled();
            });
        });
    });
});
// ============================================================================
// handleSubmitField Tests (via toggleInputFieldEditPanel mock)
// ============================================================================
describe('handleSubmitField', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsVarUsedInNodes.mockReturnValue(false);
        mockIsHovering = false;
    });
    it('should add new field when editingFieldIndex is -1', () => {
        // Arrange
        const inputFields = createInputVarList(1);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
        // Click add button to open editor
        react_1.fireEvent.click(react_1.screen.getByTestId('field-list-add-btn'));
        // Get the onSubmit callback that was passed to toggleInputFieldEditPanel
        expect(mockToggleInputFieldEditPanel).toHaveBeenCalled();
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        expect(editorProps).toHaveProperty('onSubmit');
        // Simulate form submission with new field data
        const newFieldData = createInputVar({ variable: 'new_var', label: 'New Label' });
        editorProps.onSubmit(newFieldData);
        // Assert
        expect(handleInputFieldsChange).toHaveBeenCalledWith('node-1', expect.arrayContaining([
            expect.objectContaining({ variable: 'var_0' }),
            expect.objectContaining({ variable: 'new_var', label: 'New Label' }),
        ]));
    });
    it('should update existing field when editingFieldIndex is valid', () => {
        // Arrange
        mockIsHovering = true;
        const inputFields = createInputVarList(1);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
        // Click edit button on existing field
        const sortableContainer = react_1.screen.getByTestId('sortable-container');
        const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
        if (fieldItemButtons.length >= 1)
            react_1.fireEvent.click(fieldItemButtons[0]);
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Simulate form submission with updated data
        const updatedFieldData = createInputVar({ variable: 'var_0', label: 'Updated Label' });
        editorProps.onSubmit(updatedFieldData);
        // Assert - field should be updated, not added
        expect(handleInputFieldsChange).toHaveBeenCalledWith('node-1', expect.arrayContaining([
            expect.objectContaining({ variable: 'var_0', label: 'Updated Label' }),
        ]));
        const calledFields = handleInputFieldsChange.mock.calls[0][1];
        expect(calledFields.length).toBe(1); // Should still be 1, not 2
    });
    it('should call handleInputVarRename when variable name changes', () => {
        // Arrange
        mockIsHovering = true;
        const inputFields = createInputVarList(1);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
        // Click edit button
        const sortableContainer = react_1.screen.getByTestId('sortable-container');
        const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
        if (fieldItemButtons.length >= 1)
            react_1.fireEvent.click(fieldItemButtons[0]);
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Simulate form submission with changed variable name (including moreInfo)
        const updatedFieldData = createInputVar({ variable: 'new_var_name', label: 'Label 0' });
        editorProps.onSubmit(updatedFieldData, {
            type: 'changeVarName',
            payload: { beforeKey: 'var_0', afterKey: 'new_var_name' },
        });
        // Assert
        expect(mockHandleInputVarRename).toHaveBeenCalledWith('node-1', ['rag', 'node-1', 'var_0'], ['rag', 'node-1', 'new_var_name']);
    });
    it('should not call handleInputVarRename when moreInfo type is not changeVarName', () => {
        // Arrange - This tests line 108 branch in hooks.ts
        mockIsHovering = true;
        const inputFields = createInputVarList(1);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
        // Click edit button
        const sortableContainer = react_1.screen.getByTestId('sortable-container');
        const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
        if (fieldItemButtons.length >= 1)
            react_1.fireEvent.click(fieldItemButtons[0]);
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Simulate form submission WITHOUT moreInfo (no variable name change)
        const updatedFieldData = createInputVar({ variable: 'var_0', label: 'Updated Label' });
        editorProps.onSubmit(updatedFieldData);
        // Assert - handleInputVarRename should NOT be called
        expect(mockHandleInputVarRename).not.toHaveBeenCalled();
        expect(handleInputFieldsChange).toHaveBeenCalled();
    });
    it('should not call handleInputVarRename when moreInfo has different type', () => {
        // Arrange - This tests line 108 branch in hooks.ts with different type
        mockIsHovering = true;
        const inputFields = createInputVarList(1);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
        // Click edit button
        const sortableContainer = react_1.screen.getByTestId('sortable-container');
        const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
        if (fieldItemButtons.length >= 1)
            react_1.fireEvent.click(fieldItemButtons[0]);
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Simulate form submission with moreInfo but different type
        const updatedFieldData = createInputVar({ variable: 'var_0', label: 'Updated Label' });
        editorProps.onSubmit(updatedFieldData, { type: 'otherType' });
        // Assert - handleInputVarRename should NOT be called
        expect(mockHandleInputVarRename).not.toHaveBeenCalled();
        expect(handleInputFieldsChange).toHaveBeenCalled();
    });
    it('should handle empty beforeKey and afterKey in moreInfo payload', () => {
        // Arrange - This tests line 108 with empty keys
        mockIsHovering = true;
        const inputFields = createInputVarList(1);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
        // Click edit button
        const sortableContainer = react_1.screen.getByTestId('sortable-container');
        const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
        if (fieldItemButtons.length >= 1)
            react_1.fireEvent.click(fieldItemButtons[0]);
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Simulate form submission with changeVarName but empty keys
        const updatedFieldData = createInputVar({ variable: 'new_var' });
        editorProps.onSubmit(updatedFieldData, {
            type: 'changeVarName',
            payload: { beforeKey: '', afterKey: '' },
        });
        // Assert - handleInputVarRename should be called with empty strings
        expect(mockHandleInputVarRename).toHaveBeenCalledWith('node-1', ['rag', 'node-1', ''], ['rag', 'node-1', '']);
    });
    it('should handle undefined payload in moreInfo', () => {
        // Arrange - This tests line 108 with undefined payload
        mockIsHovering = true;
        const inputFields = createInputVarList(1);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
        // Click edit button
        const sortableContainer = react_1.screen.getByTestId('sortable-container');
        const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
        if (fieldItemButtons.length >= 1)
            react_1.fireEvent.click(fieldItemButtons[0]);
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Simulate form submission with changeVarName but undefined payload
        const updatedFieldData = createInputVar({ variable: 'new_var' });
        editorProps.onSubmit(updatedFieldData, {
            type: 'changeVarName',
            payload: undefined,
        });
        // Assert - handleInputVarRename should be called with empty strings (fallback)
        expect(mockHandleInputVarRename).toHaveBeenCalledWith('node-1', ['rag', 'node-1', ''], ['rag', 'node-1', '']);
    });
    it('should close editor panel after successful submission', () => {
        // Arrange
        const inputFields = createInputVarList(1);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
        // Click add button
        react_1.fireEvent.click(react_1.screen.getByTestId('field-list-add-btn'));
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Simulate form submission
        const newFieldData = createInputVar({ variable: 'new_var' });
        editorProps.onSubmit(newFieldData);
        // Assert - toggleInputFieldEditPanel should be called with null to close
        expect(mockToggleInputFieldEditPanel).toHaveBeenCalledTimes(2);
        expect(mockToggleInputFieldEditPanel).toHaveBeenLastCalledWith(null);
    });
    it('should call onClose when editor is closed manually', () => {
        // Arrange
        const inputFields = createInputVarList(1);
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]}/>);
        // Click add button
        react_1.fireEvent.click(react_1.screen.getByTestId('field-list-add-btn'));
        // Get the onClose callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        expect(editorProps).toHaveProperty('onClose');
        // Simulate close
        editorProps.onClose();
        // Assert - toggleInputFieldEditPanel should be called with null
        expect(mockToggleInputFieldEditPanel).toHaveBeenLastCalledWith(null);
    });
});
// ============================================================================
// Duplicate Variable Name Handling Tests
// ============================================================================
describe('Duplicate Variable Name Handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsVarUsedInNodes.mockReturnValue(false);
        mockIsHovering = false;
    });
    it('should not add field if variable name is duplicate', async () => {
        // Arrange
        const Toast = await Promise.resolve().then(() => require('@/app/components/base/toast'));
        const inputFields = createInputVarList(2);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0', 'var_1', 'existing_var']}/>);
        // Click add button
        react_1.fireEvent.click(react_1.screen.getByTestId('field-list-add-btn'));
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Try to submit with a duplicate variable name
        const duplicateFieldData = createInputVar({ variable: 'existing_var' });
        editorProps.onSubmit(duplicateFieldData);
        // Assert - handleInputFieldsChange should NOT be called
        expect(handleInputFieldsChange).not.toHaveBeenCalled();
        // Toast should be shown
        expect(Toast.default.notify).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    });
    it('should allow updating field to same variable name', () => {
        // Arrange
        mockIsHovering = true;
        const inputFields = createInputVarList(2);
        const handleInputFieldsChange = vi.fn();
        // Act
        (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0', 'var_1']}/>);
        // Click edit button on first field
        const sortableContainer = react_1.screen.getByTestId('sortable-container');
        const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
        if (fieldItemButtons.length >= 1)
            react_1.fireEvent.click(fieldItemButtons[0]);
        // Get the onSubmit callback
        const editorProps = mockToggleInputFieldEditPanel.mock.calls[0][0];
        // Submit with same variable name (just updating label)
        const updatedFieldData = createInputVar({ variable: 'var_0', label: 'New Label' });
        editorProps.onSubmit(updatedFieldData);
        // Assert - should allow update with same variable name
        expect(handleInputFieldsChange).toHaveBeenCalled();
    });
});
// ============================================================================
// SortableItem Type Tests
// ============================================================================
describe('SortableItem Type', () => {
    it('should have correct structure', () => {
        // Arrange
        const inputVar = createInputVar();
        const sortableItem = createSortableItem(inputVar);
        // Assert
        expect(sortableItem.id).toBe(inputVar.variable);
        expect(sortableItem.chosen).toBe(false);
        expect(sortableItem.selected).toBe(false);
        expect(sortableItem.type).toBe(inputVar.type);
        expect(sortableItem.variable).toBe(inputVar.variable);
        expect(sortableItem.label).toBe(inputVar.label);
    });
    it('should allow overriding sortable properties', () => {
        // Arrange
        const inputVar = createInputVar();
        const sortableItem = createSortableItem(inputVar, {
            chosen: true,
            selected: true,
        });
        // Assert
        expect(sortableItem.chosen).toBe(true);
        expect(sortableItem.selected).toBe(true);
    });
});
// ============================================================================
// Integration Tests
// ============================================================================
describe('Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsHovering = false;
        mockIsVarUsedInNodes.mockReturnValue(false);
    });
    describe('Complete Workflow', () => {
        it('should handle add -> edit -> remove workflow', async () => {
            // Arrange
            mockIsHovering = true;
            const inputFields = createInputVarList(1);
            const handleInputFieldsChange = vi.fn();
            // Act - Render
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={<span>Fields</span>} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={['var_0']}/>);
            // Step 1: Click add button (in header, outside sortable container)
            react_1.fireEvent.click(react_1.screen.getByTestId('field-list-add-btn'));
            expect(mockToggleInputFieldEditPanel).toHaveBeenCalled();
            // Step 2: Edit on existing field
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            const fieldItemButtons = sortableContainer.querySelectorAll('button.action-btn');
            if (fieldItemButtons.length >= 1) {
                react_1.fireEvent.click(fieldItemButtons[0]);
                expect(mockToggleInputFieldEditPanel).toHaveBeenCalledTimes(2);
            }
            // Step 3: Remove field
            if (fieldItemButtons.length >= 2)
                react_1.fireEvent.click(fieldItemButtons[1]);
            expect(handleInputFieldsChange).toHaveBeenCalled();
        });
        it('should handle sort operation correctly', () => {
            // Arrange
            const inputFields = createInputVarList(3);
            const handleInputFieldsChange = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={handleInputFieldsChange} allVariableNames={[]}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-sort'));
            // Assert
            expect(handleInputFieldsChange).toHaveBeenCalledWith('node-1', expect.any(Array));
            const newOrder = handleInputFieldsChange.mock.calls[0][1];
            // First two should be swapped
            expect(newOrder[0].variable).toBe('var_1');
            expect(newOrder[1].variable).toBe('var_0');
        });
    });
    describe('Props Propagation', () => {
        it('should propagate readonly prop through all components', () => {
            // Arrange
            const inputFields = createInputVarList(2);
            // Act
            (0, react_1.render)(<index_1.default nodeId="node-1" LabelRightContent={null} inputFields={inputFields} handleInputFieldsChange={vi.fn()} allVariableNames={[]} readonly={true}/>);
            // Assert
            const addButton = react_1.screen.getAllByRole('button').find(btn => btn.querySelector('svg'));
            expect(addButton).toBeDisabled();
            const sortableContainer = react_1.screen.getByTestId('sortable-container');
            expect(sortableContainer.dataset.disabled).toBe('true');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixnREFBd0Q7QUFDeEQsNkNBQW9DO0FBQ3BDLGlFQUF1RDtBQUN2RCxtQ0FBK0I7QUFFL0IsK0VBQStFO0FBQy9FLDZCQUE2QjtBQUM3QiwrRUFBK0U7QUFFL0UsdUJBQXVCO0FBQ3ZCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQTtBQUMxQixNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQTtBQUU5QyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQUU7SUFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFjLEVBQTJCLENBQUE7SUFDOUQsT0FBTztRQUNMLEdBQUcsTUFBTTtRQUNULFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtLQUNwQyxDQUFBO0FBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFRix3QkFBd0I7QUFDeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2pDLGFBQWEsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFNN0QsRUFBRSxFQUFFLENBQUMsQ0FDSixDQUFDLEdBQUcsQ0FDRixXQUFXLENBQUMsb0JBQW9CLENBQ2hDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUN4QixTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FFckI7TUFBQSxDQUFDLFFBQVEsQ0FDVDtNQUFBLENBQUMsTUFBTSxDQUNMLFdBQVcsQ0FBQyxjQUFjLENBQzFCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxD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Q0FDZixpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUN4QixXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FDekIsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FDakMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDckIsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQ2YsQ0FDSCxDQUFBO1lBRUQsU0FBUztZQUNULE1BQU0sU0FBUyxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQ3pELEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQ3pCLENBQUE7WUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUE7WUFFaEMsTUFBTSxpQkFBaUIsR0FBRyxjQUFNLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUE7WUFDbEUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDekQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTb3J0YWJsZUl0ZW0gfSBmcm9tICcuL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBJbnB1dFZhciB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFBpcGVsaW5lSW5wdXRWYXJUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgRmllbGRJdGVtIGZyb20gJy4vZmllbGQtaXRlbSdcbmltcG9ydCBGaWVsZExpc3RDb250YWluZXIgZnJvbSAnLi9maWVsZC1saXN0LWNvbnRhaW5lcidcbmltcG9ydCBGaWVsZExpc3QgZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBhaG9va3MgdXNlSG92ZXJcbmxldCBtb2NrSXNIb3ZlcmluZyA9IGZhbHNlXG5jb25zdCBnZXRNb2NrSXNIb3ZlcmluZyA9ICgpID0+IG1vY2tJc0hvdmVyaW5nXG5cbnZpLm1vY2soJ2Fob29rcycsIGFzeW5jIChpbXBvcnRPcmlnaW5hbCkgPT4ge1xuICBjb25zdCBhY3R1YWwgPSBhd2FpdCBpbXBvcnRPcmlnaW5hbDx0eXBlb2YgaW1wb3J0KCdhaG9va3MnKT4oKVxuICByZXR1cm4ge1xuICAgIC4uLmFjdHVhbCxcbiAgICB1c2VIb3ZlcjogKCkgPT4gZ2V0TW9ja0lzSG92ZXJpbmcoKSxcbiAgfVxufSlcblxuLy8gTW9jayByZWFjdC1zb3J0YWJsZWpzXG52aS5tb2NrKCdyZWFjdC1zb3J0YWJsZWpzJywgKCkgPT4gKHtcbiAgUmVhY3RTb3J0YWJsZTogKHsgY2hpbGRyZW4sIGxpc3QsIHNldExpc3QsIGRpc2FibGVkLCBjbGFzc05hbWUgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBsaXN0OiBTb3J0YWJsZUl0ZW1bXVxuICAgIHNldExpc3Q6IChuZXdMaXN0OiBTb3J0YWJsZUl0ZW1bXSkgPT4gdm9pZFxuICAgIGRpc2FibGVkPzogYm9vbGVhblxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdlxuICAgICAgZGF0YS10ZXN0aWQ9XCJzb3J0YWJsZS1jb250YWluZXJcIlxuICAgICAgZGF0YS1kaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPVwidHJpZ2dlci1zb3J0XCJcbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGlmICghZGlzYWJsZWQgJiYgbGlzdC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAvLyBTaW11bGF0ZSByZW9yZGVyOiBzd2FwIGZpcnN0IHR3byBpdGVtc1xuICAgICAgICAgICAgY29uc3QgbmV3TGlzdCA9IFsuLi5saXN0XVxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IG5ld0xpc3RbMF1cbiAgICAgICAgICAgIG5ld0xpc3RbMF0gPSBuZXdMaXN0WzFdXG4gICAgICAgICAgICBuZXdMaXN0WzFdID0gdGVtcFxuICAgICAgICAgICAgc2V0TGlzdChuZXdMaXN0KVxuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgVHJpZ2dlciBTb3J0XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmlnZ2VyLXNhbWUtc29ydFwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBUcmlnZ2VyIHNldExpc3Qgd2l0aCBzYW1lIGxpc3QgKG5vIGFjdHVhbCBjaGFuZ2UpXG4gICAgICAgICAgc2V0TGlzdChbLi4ubGlzdF0pXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIFRyaWdnZXIgU2FtZSBTb3J0XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIHVzZVBpcGVsaW5lIGhvb2tcbmNvbnN0IG1vY2tIYW5kbGVJbnB1dFZhclJlbmFtZSA9IHZpLmZuKClcbmNvbnN0IG1vY2tJc1ZhclVzZWRJbk5vZGVzID0gdmkuZm4oKCkgPT4gZmFsc2UpXG5jb25zdCBtb2NrUmVtb3ZlVXNlZFZhckluTm9kZXMgPSB2aS5mbigpXG5cbnZpLm1vY2soJy4uLy4uLy4uLy4uL2hvb2tzL3VzZS1waXBlbGluZScsICgpID0+ICh7XG4gIHVzZVBpcGVsaW5lOiAoKSA9PiAoe1xuICAgIGhhbmRsZUlucHV0VmFyUmVuYW1lOiBtb2NrSGFuZGxlSW5wdXRWYXJSZW5hbWUsXG4gICAgaXNWYXJVc2VkSW5Ob2RlczogbW9ja0lzVmFyVXNlZEluTm9kZXMsXG4gICAgcmVtb3ZlVXNlZFZhckluTm9kZXM6IG1vY2tSZW1vdmVVc2VkVmFySW5Ob2RlcyxcbiAgfSksXG59KSlcblxuLy8gTW9jayB1c2VJbnB1dEZpZWxkUGFuZWwgaG9va1xuY29uc3QgbW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwgPSB2aS5mbigpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcmFnLXBpcGVsaW5lL2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlSW5wdXRGaWVsZFBhbmVsOiAoKSA9PiAoe1xuICAgIHRvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWw6IG1vY2tUb2dnbGVJbnB1dEZpZWxkRWRpdFBhbmVsLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIFRvYXN0XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgbm90aWZ5OiB2aS5mbigpLFxuICB9LFxufSkpXG5cbi8vIE1vY2sgUmVtb3ZlRWZmZWN0VmFyQ29uZmlybVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL3JlbW92ZS1lZmZlY3QtdmFyLWNvbmZpcm0nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoe1xuICAgIGlzU2hvdyxcbiAgICBvbkNhbmNlbCxcbiAgICBvbkNvbmZpcm0sXG4gIH06IHtcbiAgICBpc1Nob3c6IGJvb2xlYW5cbiAgICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICAgIG9uQ29uZmlybTogKCkgPT4gdm9pZFxuICB9KSA9PiBpc1Nob3dcbiAgICA/IChcbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInJlbW92ZS12YXItY29uZmlybVwiPlxuICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJjb25maXJtLWNhbmNlbFwiIG9uQ2xpY2s9e29uQ2FuY2VsfT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiY29uZmlybS1va1wiIG9uQ2xpY2s9e29uQ29uZmlybX0+Q29uZmlybTwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICA6IG51bGwsXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEZhY3Rvcmllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVJbnB1dFZhciA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPElucHV0VmFyPik6IElucHV0VmFyID0+ICh7XG4gIHR5cGU6IFBpcGVsaW5lSW5wdXRWYXJUeXBlLnRleHRJbnB1dCxcbiAgbGFiZWw6ICdUZXN0IExhYmVsJyxcbiAgdmFyaWFibGU6ICd0ZXN0X3ZhcmlhYmxlJyxcbiAgbWF4X2xlbmd0aDogNDgsXG4gIGRlZmF1bHRfdmFsdWU6ICcnLFxuICByZXF1aXJlZDogdHJ1ZSxcbiAgdG9vbHRpcHM6ICcnLFxuICBvcHRpb25zOiBbXSxcbiAgcGxhY2Vob2xkZXI6ICcnLFxuICB1bml0OiAnJyxcbiAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBbXSxcbiAgYWxsb3dlZF9maWxlX3R5cGVzOiBbXSxcbiAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IFtdLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVJbnB1dFZhckxpc3QgPSAoY291bnQ6IG51bWJlcik6IElucHV0VmFyW10gPT4ge1xuICByZXR1cm4gQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+XG4gICAgY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgdmFyaWFibGU6IGB2YXJfJHtpfWAsXG4gICAgICBsYWJlbDogYExhYmVsICR7aX1gLFxuICAgIH0pKVxufVxuXG5jb25zdCBjcmVhdGVTb3J0YWJsZUl0ZW0gPSAoXG4gIGlucHV0VmFyOiBJbnB1dFZhcixcbiAgb3ZlcnJpZGVzPzogUGFydGlhbDxTb3J0YWJsZUl0ZW0+LFxuKTogU29ydGFibGVJdGVtID0+ICh7XG4gIGlkOiBpbnB1dFZhci52YXJpYWJsZSxcbiAgY2hvc2VuOiBmYWxzZSxcbiAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAuLi5pbnB1dFZhcixcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRmllbGRJdGVtIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnRmllbGRJdGVtJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSXNIb3ZlcmluZyA9IGZhbHNlXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZpZWxkIGl0ZW0gd2l0aCB2YXJpYWJsZSBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6ICdteV9maWVsZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXlfZmllbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmaWVsZCBpdGVtIHdpdGggbGFiZWwgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAnZmllbGQnLCBsYWJlbDogJ0ZpZWxkIExhYmVsJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdGaWVsZCBMYWJlbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBsYWJlbCB3aGVuIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6ICdmaWVsZCcsIGxhYmVsOiAnJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ8K3JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHJlcXVpcmVkIGJhZGdlIHdoZW4gbm90IGhvdmVyaW5nIGFuZCByZXF1aXJlZCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSBmYWxzZVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKHsgcmVxdWlyZWQ6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcmVxdWlyZWQvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIHJlcXVpcmVkIGJhZGdlIHdoZW4gcmVxdWlyZWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNIb3ZlcmluZyA9IGZhbHNlXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlSW5wdXRWYXIoeyByZXF1aXJlZDogZmFsc2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9yZXF1aXJlZC9pKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5wdXRGaWVsZCBpY29uIHdoZW4gbm90IGhvdmVyaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSBmYWxzZVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmllbGRJdGVtXG4gICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17dmkuZm4oKX1cbiAgICAgICAgICBvblJlbW92ZT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIElucHV0RmllbGQgaWNvbiBzaG91bGQgYmUgcHJlc2VudCAobm90IFJpRHJhZ2dhYmxlKVxuICAgICAgY29uc3QgaWNvbnMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc3ZnJylcbiAgICAgIGV4cGVjdChpY29ucy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkcmFnIGljb24gd2hlbiBob3ZlcmluZyBhbmQgbm90IHJlYWRvbmx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlSW5wdXRWYXIoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAgIHJlYWRvbmx5PXtmYWxzZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIFJpRHJhZ2dhYmxlIGljb24gc2hvdWxkIGJlIHByZXNlbnRcbiAgICAgIGNvbnN0IGljb25zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2ZycpXG4gICAgICBleHBlY3QoaWNvbnMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZWRpdCBhbmQgZGVsZXRlIGJ1dHRvbnMgd2hlbiBob3ZlcmluZyBhbmQgbm90IHJlYWRvbmx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlSW5wdXRWYXIoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgICAgcmVhZG9ubHk9e2ZhbHNlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b25zLmxlbmd0aCkudG9CZSgyKSAvLyBFZGl0IGFuZCBEZWxldGUgYnV0dG9uc1xuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgZWRpdCBhbmQgZGVsZXRlIGJ1dHRvbnMgd2hlbiByZWFkb25seScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAgIHJlYWRvbmx5PXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLnF1ZXJ5QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xpY2tFZGl0IHdpdGggdmFyaWFibGUgd2hlbiBlZGl0IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBvbkNsaWNrRWRpdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAndGVzdF92YXInIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRJdGVtXG4gICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17b25DbGlja0VkaXR9XG4gICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uc1swXSkgLy8gRWRpdCBidXR0b25cblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DbGlja0VkaXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0ZXN0X3ZhcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblJlbW92ZSB3aXRoIGluZGV4IHdoZW4gZGVsZXRlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBvblJlbW92ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVJbnB1dFZhcigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRJdGVtXG4gICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICBpbmRleD17NX1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17dmkuZm4oKX1cbiAgICAgICAgICBvblJlbW92ZT17b25SZW1vdmV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uc1sxXSkgLy8gRGVsZXRlIGJ1dHRvblxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvblJlbW92ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoNSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNsaWNrRWRpdCB3aGVuIHJlYWRvbmx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBvbkNsaWNrRWRpdCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVJbnB1dFZhcigpXG5cbiAgICAgIC8vIFJlbmRlciB3aXRob3V0IHJlYWRvbmx5IHRvIGdldCBidXR0b25zLCB0aGVuIGNoZWNrIGJlaGF2aW9yXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXtvbkNsaWNrRWRpdH1cbiAgICAgICAgICBvblJlbW92ZT17dmkuZm4oKX1cbiAgICAgICAgICByZWFkb25seT17ZmFsc2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBSZS1yZW5kZXIgd2l0aCByZWFkb25seSBidXQgYnV0dG9ucyBzdGlsbCBleGlzdCBmcm9tIHByZXZpb3VzIHN0YXRlIGNoZWNrXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e29uQ2xpY2tFZGl0fVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAgIHJlYWRvbmx5PXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gbm8gYnV0dG9ucyBzaG91bGQgYmUgcmVuZGVyZWQgd2hlbiByZWFkb25seVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUFsbEJ5Um9sZSgnYnV0dG9uJykubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RvcCBldmVudCBwcm9wYWdhdGlvbiB3aGVuIGVkaXQgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNIb3ZlcmluZyA9IHRydWVcbiAgICAgIGNvbnN0IG9uQ2xpY2tFZGl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcGFyZW50Q2xpY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlSW5wdXRWYXIoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPGRpdiBvbkNsaWNrPXtwYXJlbnRDbGlja30+XG4gICAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgICAgb25DbGlja0VkaXQ9e29uQ2xpY2tFZGl0fVxuICAgICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+LFxuICAgICAgKVxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uc1swXSlcblxuICAgICAgLy8gQXNzZXJ0IC0gcGFyZW50IGNsaWNrIHNob3VsZCBub3QgYmUgY2FsbGVkIGR1ZSB0byBzdG9wUHJvcGFnYXRpb25cbiAgICAgIGV4cGVjdChvbkNsaWNrRWRpdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QocGFyZW50Q2xpY2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uIHdoZW4gZGVsZXRlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBvblJlbW92ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHBhcmVudENsaWNrID0gdmkuZm4oKVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxkaXYgb25DbGljaz17cGFyZW50Q2xpY2t9PlxuICAgICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgICAgb25SZW1vdmU9e29uUmVtb3ZlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PixcbiAgICAgIClcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbnNbMV0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUmVtb3ZlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChwYXJlbnRDbGljaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIGhhbmRsZU9uQ2xpY2tFZGl0IHdoZW4gcHJvcHMgZG9udCBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNIb3ZlcmluZyA9IHRydWVcbiAgICAgIGNvbnN0IG9uQ2xpY2tFZGl0ID0gdmkuZm4oKVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXtvbkNsaWNrRWRpdH1cbiAgICAgICAgICBvblJlbW92ZT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b25zWzBdKVxuXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e29uQ2xpY2tFZGl0fVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGNvbnN0IGJ1dHRvbnNBZnRlclJlcmVuZGVyID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b25zQWZ0ZXJSZXJlbmRlclswXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DbGlja0VkaXQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIHZhcmlhYmxlIG5hbWVzIHdpdGggdHJ1bmNhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdWYXJpYWJsZSA9ICdhJy5yZXBlYXQoMjAwKVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6IGxvbmdWYXJpYWJsZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHZhckVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUaXRsZShsb25nVmFyaWFibGUpXG4gICAgICBleHBlY3QodmFyRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3RydW5jYXRlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGxhYmVsIG5hbWVzIHdpdGggdHJ1bmNhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdMYWJlbCA9ICdiJy5yZXBlYXQoMjAwKVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKHsgbGFiZWw6IGxvbmdMYWJlbCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxhYmVsRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRpdGxlKGxvbmdMYWJlbClcbiAgICAgIGV4cGVjdChsYWJlbEVsZW1lbnQpLnRvSGF2ZUNsYXNzKCd0cnVuY2F0ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB2YXJpYWJsZSBhbmQgbGFiZWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlSW5wdXRWYXIoe1xuICAgICAgICB2YXJpYWJsZTogJzx0ZXN0PiZcInZhclxcJycsXG4gICAgICAgIGxhYmVsOiAnPGxhYmVsPiZcInRlc3RcXCcnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnPHRlc3Q+JlwidmFyXFwnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc8bGFiZWw+JlwidGVzdFxcJycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuaWNvZGUgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVJbnB1dFZhcih7XG4gICAgICAgIHZhcmlhYmxlOiAn5Y+Y6YePX/CfjoknLFxuICAgICAgICBsYWJlbDogJ+agh+etvl/wn5iAJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRJdGVtXG4gICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17dmkuZm4oKX1cbiAgICAgICAgICBvblJlbW92ZT17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ+WPmOmHj1/wn46JJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCfmoIfnrb5f8J+YgCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRpZmZlcmVudCBpbnB1dCB0eXBlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0eXBlcyA9IFtcbiAgICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUudGV4dElucHV0LFxuICAgICAgICBQaXBlbGluZUlucHV0VmFyVHlwZS5wYXJhZ3JhcGgsXG4gICAgICAgIFBpcGVsaW5lSW5wdXRWYXJUeXBlLm51bWJlcixcbiAgICAgICAgUGlwZWxpbmVJbnB1dFZhclR5cGUuc2VsZWN0LFxuICAgICAgICBQaXBlbGluZUlucHV0VmFyVHlwZS5zaW5nbGVGaWxlLFxuICAgICAgICBQaXBlbGluZUlucHV0VmFyVHlwZS5tdWx0aUZpbGVzLFxuICAgICAgICBQaXBlbGluZUlucHV0VmFyVHlwZS5jaGVja2JveCxcbiAgICAgIF1cblxuICAgICAgdHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlSW5wdXRWYXIoeyB0eXBlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3RfdmFyaWFibGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB1bm1vdW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKClcbiAgICAgIGNvbnN0IG9uQ2xpY2tFZGl0ID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25SZW1vdmUgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmllbGRJdGVtXG4gICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17b25DbGlja0VkaXR9XG4gICAgICAgICAgb25SZW1vdmU9e29uUmVtb3ZlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gUmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e29uQ2xpY2tFZGl0fVxuICAgICAgICAgIG9uUmVtb3ZlPXtvblJlbW92ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbXBvbmVudCBzaG91bGQgc3RpbGwgcmVuZGVyIGNvcnJlY3RseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3RfdmFyaWFibGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZWFkb25seSBNb2RlIEJlaGF2aW9yIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlYWRvbmx5IE1vZGUgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGFjdGlvbiBidXR0b25zIGluIHJlYWRvbmx5IG1vZGUgZXZlbiB3aGVuIGhvdmVyaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlSW5wdXRWYXIoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkSXRlbVxuICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgaW5kZXg9ezB9XG4gICAgICAgICAgb25DbGlja0VkaXQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmU9e3ZpLmZuKCl9XG4gICAgICAgICAgcmVhZG9ubHk9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBubyBhY3Rpb24gYnV0dG9ucyBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlBbGxCeVJvbGUoJ2J1dHRvbicpKS50b0hhdmVMZW5ndGgoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdHlwZSBpY29uIGFuZCByZXF1aXJlZCBiYWRnZSBpbiByZWFkb25seSBtb2RlIHdoZW4gaG92ZXJpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNIb3ZlcmluZyA9IHRydWVcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVJbnB1dFZhcih7IHJlcXVpcmVkOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRJdGVtXG4gICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17dmkuZm4oKX1cbiAgICAgICAgICBvblJlbW92ZT17dmkuZm4oKX1cbiAgICAgICAgICByZWFkb25seT17dHJ1ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHJlcXVpcmVkIGJhZGdlIHNob3VsZCBiZSB2aXNpYmxlIGluc3RlYWQgb2YgYWN0aW9uIGJ1dHRvbnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9yZXF1aXJlZC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1cnNvci1kZWZhdWx0IGNsYXNzIHdoZW4gcmVhZG9ubHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlSW5wdXRWYXIoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxGaWVsZEl0ZW1cbiAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgIGluZGV4PXswfVxuICAgICAgICAgIG9uQ2xpY2tFZGl0PXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlPXt2aS5mbigpfVxuICAgICAgICAgIHJlYWRvbmx5PXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBmaWVsZEl0ZW0gPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KGZpZWxkSXRlbS5jbGFzc05hbWUpLnRvQ29udGFpbignY3Vyc29yLWRlZmF1bHQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1cnNvci1hbGwtc2Nyb2xsIGNsYXNzIHdoZW4gaG92ZXJpbmcgYW5kIG5vdCByZWFkb25seScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZUlucHV0VmFyKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmllbGRJdGVtXG4gICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICBpbmRleD17MH1cbiAgICAgICAgICBvbkNsaWNrRWRpdD17dmkuZm4oKX1cbiAgICAgICAgICBvblJlbW92ZT17dmkuZm4oKX1cbiAgICAgICAgICByZWFkb25seT17ZmFsc2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGZpZWxkSXRlbSA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3QoZmllbGRJdGVtLmNsYXNzTmFtZSkudG9Db250YWluKCdjdXJzb3ItYWxsLXNjcm9sbCcpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEZpZWxkTGlzdENvbnRhaW5lciBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0ZpZWxkTGlzdENvbnRhaW5lcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0lzSG92ZXJpbmcgPSBmYWxzZVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzb3J0YWJsZSBjb250YWluZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgyKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdENvbnRhaW5lclxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBvbkxpc3RTb3J0Q2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlRmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25FZGl0RmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NvcnRhYmxlLWNvbnRhaW5lcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBmaWVsZCBpdGVtcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDMpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0Q29udGFpbmVyXG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmVGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgICBvbkVkaXRGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Zhcl8wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd2YXJfMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndmFyXzInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlbXB0eSBsaXN0IHdpdGhvdXQgZXJyb3JzJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RDb250YWluZXJcbiAgICAgICAgICBpbnB1dEZpZWxkcz17W119XG4gICAgICAgICAgb25MaXN0U29ydENoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICBvblJlbW92ZUZpZWxkPXt2aS5mbigpfVxuICAgICAgICAgIG9uRWRpdEZpZWxkPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdENvbnRhaW5lclxuICAgICAgICAgIGNsYXNzTmFtZT1cImN1c3RvbS1jbGFzc1wiXG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmVGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgICBvbkVkaXRGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5jbGFzc05hbWUpLnRvQ29udGFpbignY3VzdG9tLWNsYXNzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIHNvcnRpbmcgd2hlbiByZWFkb25seSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RDb250YWluZXJcbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgb25MaXN0U29ydENoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICBvblJlbW92ZUZpZWxkPXt2aS5mbigpfVxuICAgICAgICAgIG9uRWRpdEZpZWxkPXt2aS5mbigpfVxuICAgICAgICAgIHJlYWRvbmx5PXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjb250YWluZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NvcnRhYmxlLWNvbnRhaW5lcicpXG4gICAgICBleHBlY3QoY29udGFpbmVyLmRhdGFzZXQuZGlzYWJsZWQpLnRvQmUoJ3RydWUnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVc2VyIEludGVyYWN0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkxpc3RTb3J0Q2hhbmdlIHdoZW4gaXRlbXMgYXJlIHJlb3JkZXJlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDIpXG4gICAgICBjb25zdCBvbkxpc3RTb3J0Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdENvbnRhaW5lclxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBvbkxpc3RTb3J0Q2hhbmdlPXtvbkxpc3RTb3J0Q2hhbmdlfVxuICAgICAgICAgIG9uUmVtb3ZlRmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25FZGl0RmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1zb3J0JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uTGlzdFNvcnRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uTGlzdFNvcnRDaGFuZ2Ugd2hlbiBsaXN0IGhhc250IGNoYW5nZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IFtjcmVhdGVJbnB1dFZhcigpXVxuICAgICAgY29uc3Qgb25MaXN0U29ydENoYW5nZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RDb250YWluZXJcbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgb25MaXN0U29ydENoYW5nZT17b25MaXN0U29ydENoYW5nZX1cbiAgICAgICAgICBvblJlbW92ZUZpZWxkPXt2aS5mbigpfVxuICAgICAgICAgIG9uRWRpdEZpZWxkPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItc29ydCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSB3aXRoIG9ubHkgb25lIGl0ZW0sIG5vIHJlb3JkZXIgaGFwcGVuc1xuICAgICAgZXhwZWN0KG9uTGlzdFNvcnRDaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkxpc3RTb3J0Q2hhbmdlIHdoZW4gZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgyKVxuICAgICAgY29uc3Qgb25MaXN0U29ydENoYW5nZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RDb250YWluZXJcbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgb25MaXN0U29ydENoYW5nZT17b25MaXN0U29ydENoYW5nZX1cbiAgICAgICAgICBvblJlbW92ZUZpZWxkPXt2aS5mbigpfVxuICAgICAgICAgIG9uRWRpdEZpZWxkPXt2aS5mbigpfVxuICAgICAgICAgIHJlYWRvbmx5PXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItc29ydCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkxpc3RTb3J0Q2hhbmdlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25MaXN0U29ydENoYW5nZSB3aGVuIGxpc3Qgb3JkZXIgaXMgdW5jaGFuZ2VkIChpc0VxdWFsIGNoZWNrKScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBUaGlzIHRlc3RzIGxpbmUgNDIgaW4gZmllbGQtbGlzdC1jb250YWluZXIudHN4XG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgyKVxuICAgICAgY29uc3Qgb25MaXN0U29ydENoYW5nZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RDb250YWluZXJcbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgb25MaXN0U29ydENoYW5nZT17b25MaXN0U29ydENoYW5nZX1cbiAgICAgICAgICBvblJlbW92ZUZpZWxkPXt2aS5mbigpfVxuICAgICAgICAgIG9uRWRpdEZpZWxkPXt2aS5mbigpfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIC8vIFRyaWdnZXIgc2FtZSBzb3J0IC0gcGFzc2VzIHNhbWUgbGlzdCB0byBzZXRMaXN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXNhbWUtc29ydCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBvbkxpc3RTb3J0Q2hhbmdlIHNob3VsZCBOT1QgYmUgY2FsbGVkIGR1ZSB0byBpc0VxdWFsIGNoZWNrXG4gICAgICBleHBlY3Qob25MaXN0U29ydENoYW5nZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3Mgb25FZGl0RmllbGQgdG8gRmllbGRJdGVtJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuICAgICAgY29uc3Qgb25FZGl0RmllbGQgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0Q29udGFpbmVyXG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmVGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgICBvbkVkaXRGaWVsZD17b25FZGl0RmllbGR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uc1swXSkgLy8gRWRpdCBidXR0b25cblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25FZGl0RmllbGQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd2YXJfMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBvblJlbW92ZUZpZWxkIHRvIEZpZWxkSXRlbScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMSlcbiAgICAgIGNvbnN0IG9uUmVtb3ZlRmllbGQgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0Q29udGFpbmVyXG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmVGaWVsZD17b25SZW1vdmVGaWVsZH1cbiAgICAgICAgICBvbkVkaXRGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b25zWzFdKSAvLyBEZWxldGUgYnV0dG9uXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uUmVtb3ZlRmllbGQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIExpc3QgQ29udmVyc2lvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdMaXN0IENvbnZlcnNpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IElucHV0VmFyW10gdG8gU29ydGFibGVJdGVtW10nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IFtcbiAgICAgICAgY3JlYXRlSW5wdXRWYXIoeyB2YXJpYWJsZTogJ3ZhcjEnIH0pLFxuICAgICAgICBjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAndmFyMicgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBvbkxpc3RTb3J0Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdENvbnRhaW5lclxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBvbkxpc3RTb3J0Q2hhbmdlPXtvbkxpc3RTb3J0Q2hhbmdlfVxuICAgICAgICAgIG9uUmVtb3ZlRmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25FZGl0RmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1zb3J0JykpXG5cbiAgICAgIC8vIEFzc2VydCAtIG9uTGlzdFNvcnRDaGFuZ2Ugc2hvdWxkIHJlY2VpdmUgU29ydGFibGVJdGVtW11cbiAgICAgIGV4cGVjdChvbkxpc3RTb3J0Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGNvbnN0IGNhbGxlZFdpdGggPSBvbkxpc3RTb3J0Q2hhbmdlLm1vY2suY2FsbHNbMF1bMF1cbiAgICAgIGV4cGVjdChjYWxsZWRXaXRoWzBdKS50b0hhdmVQcm9wZXJ0eSgnaWQnKVxuICAgICAgZXhwZWN0KGNhbGxlZFdpdGhbMF0pLnRvSGF2ZVByb3BlcnR5KCdjaG9zZW4nKVxuICAgICAgZXhwZWN0KGNhbGxlZFdpdGhbMF0pLnRvSGF2ZVByb3BlcnR5KCdzZWxlY3RlZCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWVtb2l6ZSBsaXN0IHRyYW5zZm9ybWF0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMilcbiAgICAgIGNvbnN0IG9uTGlzdFNvcnRDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0Q29udGFpbmVyXG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e29uTGlzdFNvcnRDaGFuZ2V9XG4gICAgICAgICAgb25SZW1vdmVGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgICBvbkVkaXRGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0Q29udGFpbmVyXG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e29uTGlzdFNvcnRDaGFuZ2V9XG4gICAgICAgICAgb25SZW1vdmVGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgICBvbkVkaXRGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbXBvbmVudCBzaG91bGQgc3RpbGwgcmVuZGVyIGNvcnJlY3RseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Zhcl8wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdENvbnRhaW5lclxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBvbkxpc3RTb3J0Q2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIG9uUmVtb3ZlRmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgICAgb25FZGl0RmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0Q29udGFpbmVyXG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmVGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgICBvbkVkaXRGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Zhcl8wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIGxpc3Qgb2YgaXRlbXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxMDApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0Q29udGFpbmVyXG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25SZW1vdmVGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgICBvbkVkaXRGaWVsZD17dmkuZm4oKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Zhcl8wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd2YXJfOTknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRocm93IGVycm9yIHdoZW4gaW5wdXRGaWVsZHMgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gVGhpcyB0ZXN0IGRvY3VtZW50cyB0aGF0IHVuZGVmaW5lZCBpbnB1dEZpZWxkcyB3aWxsIGNhdXNlIGFuIGVycm9yXG4gICAgICAvLyBJbiBwcm9kdWN0aW9uLCB0aGlzIHNob3VsZCBiZSBwcmV2ZW50ZWQgYnkgVHlwZVNjcmlwdFxuICAgICAgZXhwZWN0KCgpID0+XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8RmllbGRMaXN0Q29udGFpbmVyXG4gICAgICAgICAgICBpbnB1dEZpZWxkcz17dW5kZWZpbmVkIGFzIHVua25vd24gYXMgSW5wdXRWYXJbXX1cbiAgICAgICAgICAgIG9uTGlzdFNvcnRDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgICBvblJlbW92ZUZpZWxkPXt2aS5mbigpfVxuICAgICAgICAgICAgb25FZGl0RmllbGQ9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgICksXG4gICAgICApLnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBGaWVsZExpc3QgQ29tcG9uZW50IFRlc3RzIChJbnRlZ3JhdGlvbilcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0ZpZWxkTGlzdCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0lzSG92ZXJpbmcgPSBmYWxzZVxuICAgIG1vY2tJc1ZhclVzZWRJbk5vZGVzLm1vY2tSZXR1cm5WYWx1ZShmYWxzZSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRmllbGRMaXN0IGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDIpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17PHNwYW4+TGFiZWwgQ29udGVudDwvc3Bhbj59XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1sndmFyXzAnLCAndmFyXzEnXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0xhYmVsIENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Zhcl8wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWRkIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmZpbmQoYnRuID0+XG4gICAgICAgIGJ0bi5xdWVyeVNlbGVjdG9yKCdzdmcnKSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChhZGRCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGFkZCBidXR0b24gd2hlbiByZWFkb25seScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgICAgcmVhZG9ubHk9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmZpbmQoYnRuID0+XG4gICAgICAgIGJ0bi5xdWVyeVNlbGVjdG9yKCdzdmcnKSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChhZGRCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGxhYmVsQ2xhc3NOYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17PHNwYW4+Q29udGVudDwvc3Bhbj59XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAgIGxhYmVsQ2xhc3NOYW1lPVwiY3VzdG9tLWxhYmVsLWNsYXNzXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGFiZWxDb250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1c3RvbS1sYWJlbC1jbGFzcycpXG4gICAgICBleHBlY3QobGFiZWxDb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gZWRpdG9yIHBhbmVsIHdoZW4gYWRkIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICBjb25zdCBhZGRCdXR0b24gPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKS5maW5kKGJ0biA9PlxuICAgICAgICBidG4ucXVlcnlTZWxlY3Rvcignc3ZnJyksXG4gICAgICApXG4gICAgICBpZiAoYWRkQnV0dG9uKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYWRkQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrVG9nZ2xlSW5wdXRGaWVsZEVkaXRQYW5lbCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IG9wZW4gZWRpdG9yIHdoZW4gcmVhZG9ubHkgYW5kIGFkZCBidXR0b24gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgICAgcmVhZG9ubHk9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgY29uc3QgYWRkQnV0dG9uID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykuZmluZChidG4gPT5cbiAgICAgICAgYnRuLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLFxuICAgICAgKVxuICAgICAgaWYgKGFkZEJ1dHRvbilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGFkZEJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gYnV0dG9uIGlzIGRpc2FibGVkIHNvIGNsaWNrIHNob3VsZG50IHdvcmtcbiAgICAgIGV4cGVjdChtb2NrVG9nZ2xlSW5wdXRGaWVsZEVkaXRQYW5lbCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDYWxsYmFjayBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDYWxsYmFjayBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2Ugd2l0aCBub2RlSWQgd2hlbiBmaWVsZHMgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMilcbiAgICAgIGNvbnN0IGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMTIzXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIC8vIFRyaWdnZXIgc29ydCB0byBjYXVzZSBmaWVsZHMgY2hhbmdlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXNvcnQnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAnbm9kZS0xMjMnLFxuICAgICAgICBleHBlY3QuYW55KEFycmF5KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVtb3ZlIENvbmZpcm1hdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW1vdmUgQ29uZmlybWF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyByZW1vdmUgY29uZmlybWF0aW9uIHdoZW4gdmFyaWFibGUgaXMgdXNlZCBpbiBub2RlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJc1ZhclVzZWRJbk5vZGVzLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gRmluZCBhbGwgYnV0dG9ucyBpbiB0aGUgc29ydGFibGUgY29udGFpbmVyIChlZGl0IGFuZCBkZWxldGUpXG4gICAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICAgIGNvbnN0IGZpZWxkSXRlbUJ1dHRvbnMgPSBzb3J0YWJsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24uYWN0aW9uLWJ0bicpXG4gICAgICAvLyBUaGUgc2Vjb25kIGJ1dHRvbiBzaG91bGQgYmUgdGhlIGRlbGV0ZSBidXR0b25cbiAgICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1sxXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVtb3ZlLXZhci1jb25maXJtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSByZW1vdmUgY29uZmlybWF0aW9uIHdoZW4gY2FuY2VsIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNWYXJVc2VkSW5Ob2Rlcy5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFRyaWdnZXIgcmVtb3ZlIC0gZmluZCBkZWxldGUgYnV0dG9uIGluIHNvcnRhYmxlIGNvbnRhaW5lclxuICAgICAgY29uc3Qgc29ydGFibGVDb250YWluZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NvcnRhYmxlLWNvbnRhaW5lcicpXG4gICAgICBjb25zdCBmaWVsZEl0ZW1CdXR0b25zID0gc29ydGFibGVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLmFjdGlvbi1idG4nKVxuICAgICAgaWYgKGZpZWxkSXRlbUJ1dHRvbnMubGVuZ3RoID49IDIpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhmaWVsZEl0ZW1CdXR0b25zWzFdKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVtb3ZlLXZhci1jb25maXJtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsaWNrIGNhbmNlbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1jYW5jZWwnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdyZW1vdmUtdmFyLWNvbmZpcm0nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIGZpZWxkIGFuZCBjYWxsIHJlbW92ZVVzZWRWYXJJbk5vZGVzIHdoZW4gY29uZmlybSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzVmFyVXNlZEluTm9kZXMubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgICBtb2NrSXNIb3ZlcmluZyA9IHRydWVcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG4gICAgICBjb25zdCBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17aGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2V9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBUcmlnZ2VyIHJlbW92ZSAtIGZpbmQgZGVsZXRlIGJ1dHRvbiBpbiBzb3J0YWJsZSBjb250YWluZXJcbiAgICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgICAgY29uc3QgZmllbGRJdGVtQnV0dG9ucyA9IHNvcnRhYmxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi5hY3Rpb24tYnRuJylcbiAgICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1sxXSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlbW92ZS12YXItY29uZmlybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDbGljayBjb25maXJtXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLW9rJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrUmVtb3ZlVXNlZFZhckluTm9kZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgZmllbGQgZGlyZWN0bHkgd2hlbiB2YXJpYWJsZSBpcyBub3QgdXNlZCBpbiBub2RlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJc1ZhclVzZWRJbk5vZGVzLm1vY2tSZXR1cm5WYWx1ZShmYWxzZSlcbiAgICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMilcbiAgICAgIGNvbnN0IGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEZpbmQgZGVsZXRlIGJ1dHRvbiBpbiBzb3J0YWJsZSBjb250YWluZXJcbiAgICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgICAgY29uc3QgZmllbGRJdGVtQnV0dG9ucyA9IHNvcnRhYmxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi5hY3Rpb24tYnRuJylcbiAgICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1sxXSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIG5vdCBzaG93IGNvbmZpcm1hdGlvblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdyZW1vdmUtdmFyLWNvbmZpcm0nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBpbnB1dEZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17W119XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NvcnRhYmxlLWNvbnRhaW5lcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgTGFiZWxSaWdodENvbnRlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2NyZWF0ZUlucHV0VmFyTGlzdCgxKX1cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd2YXJfMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbXBsZXggTGFiZWxSaWdodENvbnRlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjb21wbGV4Q29udGVudCA9IChcbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImNvbXBsZXgtY29udGVudFwiPlxuICAgICAgICAgIDxzcGFuPlBhcnQgMTwvc3Bhbj5cbiAgICAgICAgICA8YnV0dG9uPlBhcnQgMjwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtjb21wbGV4Q29udGVudH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17Y3JlYXRlSW5wdXRWYXJMaXN0KDEpfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb21wbGV4LWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhcnQgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuICAgICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17aGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2V9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd2YXJfMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIG9uSW5wdXRGaWVsZHNDaGFuZ2UgY2FsbGJhY2snLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgyKVxuICAgICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1zb3J0JykpXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1zb3J0JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gdXNlRmllbGRMaXN0IEhvb2sgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ3VzZUZpZWxkTGlzdCBIb29rJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSXNWYXJVc2VkSW5Ob2Rlcy5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbml0aWFsaXphdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdJbml0aWFsaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBwcm92aWRlZCBpbnB1dEZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDIpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd2YXJfMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndmFyXzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBlbXB0eSBpbnB1dEZpZWxkcycsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17W119XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NvcnRhYmxlLWNvbnRhaW5lcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGhhbmRsZUxpc3RTb3J0Q2hhbmdlIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ2hhbmRsZUxpc3RTb3J0Q2hhbmdlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIGlucHV0RmllbGRzIGFuZCBjYWxsIG9uSW5wdXRGaWVsZHNDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgyKVxuICAgICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItc29ydCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICdub2RlLTEnLFxuICAgICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHZhcmlhYmxlOiAndmFyXzEnIH0pLFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdmFyaWFibGU6ICd2YXJfMCcgfSksXG4gICAgICAgIF0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHN0cmlwIHNvcnRhYmxlIHByb3BlcnRpZXMgZnJvbSBsaXN0IGl0ZW1zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMilcbiAgICAgIGNvbnN0IGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXNvcnQnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjYWxsZWRXaXRoID0gaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UubW9jay5jYWxsc1swXVsxXVxuICAgICAgZXhwZWN0KGNhbGxlZFdpdGhbMF0pLm5vdC50b0hhdmVQcm9wZXJ0eSgnaWQnKVxuICAgICAgZXhwZWN0KGNhbGxlZFdpdGhbMF0pLm5vdC50b0hhdmVQcm9wZXJ0eSgnY2hvc2VuJylcbiAgICAgIGV4cGVjdChjYWxsZWRXaXRoWzBdKS5ub3QudG9IYXZlUHJvcGVydHkoJ3NlbGVjdGVkJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gaGFuZGxlUmVtb3ZlRmllbGQgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnaGFuZGxlUmVtb3ZlRmllbGQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGNvbmZpcm1hdGlvbiB3aGVuIHZhcmlhYmxlIGlzIHVzZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNWYXJVc2VkSW5Ob2Rlcy5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEZpbmQgZGVsZXRlIGJ1dHRvbiBpbiBzb3J0YWJsZSBjb250YWluZXJcbiAgICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgICAgY29uc3QgZmllbGRJdGVtQnV0dG9ucyA9IHNvcnRhYmxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi5hY3Rpb24tYnRuJylcbiAgICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1sxXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVtb3ZlLXZhci1jb25maXJtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVtb3ZlIGRpcmVjdGx5IHdoZW4gdmFyaWFibGUgaXMgbm90IHVzZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNWYXJVc2VkSW5Ob2Rlcy5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gICAgICBtb2NrSXNIb3ZlcmluZyA9IHRydWVcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDIpXG4gICAgICBjb25zdCBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17aGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2V9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBGaW5kIGRlbGV0ZSBidXR0b24gaW4gc29ydGFibGUgY29udGFpbmVyXG4gICAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICAgIGNvbnN0IGZpZWxkSXRlbUJ1dHRvbnMgPSBzb3J0YWJsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24uYWN0aW9uLWJ0bicpXG4gICAgICBpZiAoZmllbGRJdGVtQnV0dG9ucy5sZW5ndGggPj0gMilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpZWxkSXRlbUJ1dHRvbnNbMV0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdyZW1vdmUtdmFyLWNvbmZpcm0nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgaW1tZWRpYXRlbHkgd2hlbiB2YXJpYWJsZSBpcyB1c2VkIChsaW5lcyA3MC03MiknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gVGhpcyB0ZXN0cyB0aGF0IHdoZW4gdmFyaWFibGUgaXMgdXNlZCwgd2Ugc2hvdyBjb25maXJtYXRpb24gaW5zdGVhZCBvZiByZW1vdmluZyBkaXJlY3RseVxuICAgICAgbW9ja0lzVmFyVXNlZEluTm9kZXMubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgICBtb2NrSXNIb3ZlcmluZyA9IHRydWVcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG4gICAgICBjb25zdCBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17aGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2V9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBGaW5kIGRlbGV0ZSBidXR0b24gYW5kIGNsaWNrIGl0XG4gICAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICAgIGNvbnN0IGZpZWxkSXRlbUJ1dHRvbnMgPSBzb3J0YWJsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24uYWN0aW9uLWJ0bicpXG4gICAgICBpZiAoZmllbGRJdGVtQnV0dG9ucy5sZW5ndGggPj0gMilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpZWxkSXRlbUJ1dHRvbnNbMV0pXG5cbiAgICAgIC8vIEFzc2VydCAtIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlIHNob3VsZCBOT1QgYmUgY2FsbGVkIHlldCAod2FpdGluZyBmb3IgY29uZmlybWF0aW9uKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlbW92ZS12YXItY29uZmlybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBpc1ZhclVzZWRJbk5vZGVzIHdpdGggY29ycmVjdCB2YXJpYWJsZSBzZWxlY3RvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJc1ZhclVzZWRJbk5vZGVzLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IFtjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAnbXlfdGVzdF92YXInIH0pXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cInRlc3Qtbm9kZS0xMjNcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgICAgY29uc3QgZmllbGRJdGVtQnV0dG9ucyA9IHNvcnRhYmxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi5hY3Rpb24tYnRuJylcbiAgICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1sxXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0lzVmFyVXNlZEluTm9kZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsncmFnJywgJ3Rlc3Qtbm9kZS0xMjMnLCAnbXlfdGVzdF92YXInXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdmFyaWFibGUgbmFtZSBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIFRlc3RzIGxpbmUgNzAgd2l0aCBlbXB0eSB2YXJpYWJsZVxuICAgICAgbW9ja0lzVmFyVXNlZEluTm9kZXMubW9ja1JldHVyblZhbHVlKGZhbHNlKVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IFtjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAnJyB9KV1cbiAgICAgIGNvbnN0IGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgICAgY29uc3QgZmllbGRJdGVtQnV0dG9ucyA9IHNvcnRhYmxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi5hY3Rpb24tYnRuJylcbiAgICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1sxXSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHN0aWxsIHdvcmsgd2l0aCBlbXB0eSB2YXJpYWJsZVxuICAgICAgZXhwZWN0KG1vY2tJc1ZhclVzZWRJbk5vZGVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ3JhZycsICdub2RlLTEnLCAnJ10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IHJlbW92ZWRWYXIgYW5kIHJlbW92ZWRJbmRleCB3aGVuIHNob3dpbmcgY29uZmlybWF0aW9uIChsaW5lcyA3MS03MyknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gVGVzdHMgdGhlIHNldFJlbW92ZWRWYXIgYW5kIHNldFJlbW92ZUluZGV4IGNhbGxzIGluIGxpbmVzIDcxLTczXG4gICAgICBtb2NrSXNWYXJVc2VkSW5Ob2Rlcy5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMylcbiAgICAgIGNvbnN0IGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENsaWNrIGRlbGV0ZSBvbiB0aGUgU0VDT05EIGl0ZW0gKGluZGV4IDEpXG4gICAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICAgIGNvbnN0IGFsbEZpZWxkSXRlbUJ1dHRvbnMgPSBzb3J0YWJsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24uYWN0aW9uLWJ0bicpXG4gICAgICAvLyBFYWNoIGZpZWxkIGl0ZW0gaGFzIDIgYnV0dG9ucyAoZWRpdCwgZGVsZXRlKSwgc28gaW5kZXggMyBpcyBkZWxldGUgb2Ygc2Vjb25kIGl0ZW1cbiAgICAgIGlmIChhbGxGaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSA0KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYWxsRmllbGRJdGVtQnV0dG9uc1szXSlcblxuICAgICAgLy8gU2hvdyBjb25maXJtYXRpb25cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZW1vdmUtdmFyLWNvbmZpcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2xpY2sgY29uZmlybVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1vaycpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgcmVtb3ZlIHRoZSBjb3JyZWN0IGl0ZW0gKHZhcl8xIGF0IGluZGV4IDEpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgICBjb25zdCBjYWxsZWRGaWVsZHMgPSBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZS5tb2NrLmNhbGxzWzBdWzFdXG4gICAgICBleHBlY3QoY2FsbGVkRmllbGRzLmxlbmd0aCkudG9CZSgyKSAvLyAzIC0gMSA9IDIgaXRlbXMgcmVtYWluaW5nXG4gICAgICBleHBlY3QoY2FsbGVkRmllbGRzLm1hcCgoZjogSW5wdXRWYXIpID0+IGYudmFyaWFibGUpKS50b0VxdWFsKFsndmFyXzAnLCAndmFyXzInXSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gaGFuZGxlT3BlbklucHV0RmllbGRFZGl0b3IgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnaGFuZGxlT3BlbklucHV0RmllbGRFZGl0b3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHRvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwgd2l0aCBlZGl0b3IgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmZpbmQoYnRuID0+XG4gICAgICAgIGJ0bi5xdWVyeVNlbGVjdG9yKCdzdmcnKSxcbiAgICAgIClcbiAgICAgIGlmIChhZGRCdXR0b24pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhhZGRCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tUb2dnbGVJbnB1dEZpZWxkRWRpdFBhbmVsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIG9uQ2xvc2U6IGV4cGVjdC5hbnkoRnVuY3Rpb24pLFxuICAgICAgICAgIG9uU3VibWl0OiBleHBlY3QuYW55KEZ1bmN0aW9uKSxcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpbml0aWFsRGF0YSB3aGVuIGVkaXRpbmcgZXhpc3RpbmcgZmllbGQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNIb3ZlcmluZyA9IHRydWVcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gW2NyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6ICdteV92YXInLCBsYWJlbDogJ015IExhYmVsJyB9KV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17dmkuZm4oKX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICAvLyBGaW5kIGVkaXQgYnV0dG9uIGluIHNvcnRhYmxlIGNvbnRhaW5lciAoZmlyc3QgYWN0aW9uIGJ1dHRvbilcbiAgICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgICAgY29uc3QgZmllbGRJdGVtQnV0dG9ucyA9IHNvcnRhYmxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi5hY3Rpb24tYnRuJylcbiAgICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAxKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1swXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgaW5pdGlhbERhdGE6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHZhcmlhYmxlOiAnbXlfdmFyJyxcbiAgICAgICAgICAgIGxhYmVsOiAnTXkgTGFiZWwnLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gb25SZW1vdmVWYXJDb25maXJtIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ29uUmVtb3ZlVmFyQ29uZmlybScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBmaWVsZCBhbmQgY2FsbCByZW1vdmVVc2VkVmFySW5Ob2RlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJc1ZhclVzZWRJbk5vZGVzLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgyKVxuICAgICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gRmluZCBkZWxldGUgYnV0dG9uIGluIHNvcnRhYmxlIGNvbnRhaW5lclxuICAgICAgY29uc3Qgc29ydGFibGVDb250YWluZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NvcnRhYmxlLWNvbnRhaW5lcicpXG4gICAgICBjb25zdCBmaWVsZEl0ZW1CdXR0b25zID0gc29ydGFibGVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLmFjdGlvbi1idG4nKVxuICAgICAgaWYgKGZpZWxkSXRlbUJ1dHRvbnMubGVuZ3RoID49IDIpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhmaWVsZEl0ZW1CdXR0b25zWzFdKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVtb3ZlLXZhci1jb25maXJtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tb2snKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG1vY2tSZW1vdmVVc2VkVmFySW5Ob2RlcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBoYW5kbGVTdWJtaXRGaWVsZCBUZXN0cyAodmlhIHRvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwgbW9jaylcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ2hhbmRsZVN1Ym1pdEZpZWxkJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSXNWYXJVc2VkSW5Ob2Rlcy5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gICAgbW9ja0lzSG92ZXJpbmcgPSBmYWxzZVxuICB9KVxuXG4gIGl0KCdzaG91bGQgYWRkIG5ldyBmaWVsZCB3aGVuIGVkaXRpbmdGaWVsZEluZGV4IGlzIC0xJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuICAgIGNvbnN0IGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgLy8gQWN0XG4gICAgcmVuZGVyKFxuICAgICAgPEZpZWxkTGlzdFxuICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17aGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2V9XG4gICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1sndmFyXzAnXX1cbiAgICAgIC8+LFxuICAgIClcblxuICAgIC8vIENsaWNrIGFkZCBidXR0b24gdG8gb3BlbiBlZGl0b3JcbiAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LWFkZC1idG4nKSlcblxuICAgIC8vIEdldCB0aGUgb25TdWJtaXQgY2FsbGJhY2sgdGhhdCB3YXMgcGFzc2VkIHRvIHRvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWxcbiAgICBleHBlY3QobW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIGNvbnN0IGVkaXRvclByb3BzID0gbW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwubW9jay5jYWxsc1swXVswXVxuICAgIGV4cGVjdChlZGl0b3JQcm9wcykudG9IYXZlUHJvcGVydHkoJ29uU3VibWl0JylcblxuICAgIC8vIFNpbXVsYXRlIGZvcm0gc3VibWlzc2lvbiB3aXRoIG5ldyBmaWVsZCBkYXRhXG4gICAgY29uc3QgbmV3RmllbGREYXRhID0gY3JlYXRlSW5wdXRWYXIoeyB2YXJpYWJsZTogJ25ld192YXInLCBsYWJlbDogJ05ldyBMYWJlbCcgfSlcbiAgICBlZGl0b3JQcm9wcy5vblN1Ym1pdChuZXdGaWVsZERhdGEpXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QoaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgJ25vZGUtMScsXG4gICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB2YXJpYWJsZTogJ3Zhcl8wJyB9KSxcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB2YXJpYWJsZTogJ25ld192YXInLCBsYWJlbDogJ05ldyBMYWJlbCcgfSksXG4gICAgICBdKSxcbiAgICApXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCB1cGRhdGUgZXhpc3RpbmcgZmllbGQgd2hlbiBlZGl0aW5nRmllbGRJbmRleCBpcyB2YWxpZCcsICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMSlcbiAgICBjb25zdCBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSA9IHZpLmZuKClcblxuICAgIC8vIEFjdFxuICAgIHJlbmRlcihcbiAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbJ3Zhcl8wJ119XG4gICAgICAvPixcbiAgICApXG5cbiAgICAvLyBDbGljayBlZGl0IGJ1dHRvbiBvbiBleGlzdGluZyBmaWVsZFxuICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgIGNvbnN0IGZpZWxkSXRlbUJ1dHRvbnMgPSBzb3J0YWJsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24uYWN0aW9uLWJ0bicpXG4gICAgaWYgKGZpZWxkSXRlbUJ1dHRvbnMubGVuZ3RoID49IDEpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1swXSlcblxuICAgIC8vIEdldCB0aGUgb25TdWJtaXQgY2FsbGJhY2tcbiAgICBjb25zdCBlZGl0b3JQcm9wcyA9IG1vY2tUb2dnbGVJbnB1dEZpZWxkRWRpdFBhbmVsLm1vY2suY2FsbHNbMF1bMF1cblxuICAgIC8vIFNpbXVsYXRlIGZvcm0gc3VibWlzc2lvbiB3aXRoIHVwZGF0ZWQgZGF0YVxuICAgIGNvbnN0IHVwZGF0ZWRGaWVsZERhdGEgPSBjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAndmFyXzAnLCBsYWJlbDogJ1VwZGF0ZWQgTGFiZWwnIH0pXG4gICAgZWRpdG9yUHJvcHMub25TdWJtaXQodXBkYXRlZEZpZWxkRGF0YSlcblxuICAgIC8vIEFzc2VydCAtIGZpZWxkIHNob3VsZCBiZSB1cGRhdGVkLCBub3QgYWRkZWRcbiAgICBleHBlY3QoaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgJ25vZGUtMScsXG4gICAgICBleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB2YXJpYWJsZTogJ3Zhcl8wJywgbGFiZWw6ICdVcGRhdGVkIExhYmVsJyB9KSxcbiAgICAgIF0pLFxuICAgIClcbiAgICBjb25zdCBjYWxsZWRGaWVsZHMgPSBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZS5tb2NrLmNhbGxzWzBdWzFdXG4gICAgZXhwZWN0KGNhbGxlZEZpZWxkcy5sZW5ndGgpLnRvQmUoMSkgLy8gU2hvdWxkIHN0aWxsIGJlIDEsIG5vdCAyXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZUlucHV0VmFyUmVuYW1lIHdoZW4gdmFyaWFibGUgbmFtZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBtb2NrSXNIb3ZlcmluZyA9IHRydWVcbiAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuICAgIGNvbnN0IGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgLy8gQWN0XG4gICAgcmVuZGVyKFxuICAgICAgPEZpZWxkTGlzdFxuICAgICAgICBub2RlSWQ9XCJub2RlLTFcIlxuICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZT17aGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2V9XG4gICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1sndmFyXzAnXX1cbiAgICAgIC8+LFxuICAgIClcblxuICAgIC8vIENsaWNrIGVkaXQgYnV0dG9uXG4gICAgY29uc3Qgc29ydGFibGVDb250YWluZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NvcnRhYmxlLWNvbnRhaW5lcicpXG4gICAgY29uc3QgZmllbGRJdGVtQnV0dG9ucyA9IHNvcnRhYmxlQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbi5hY3Rpb24tYnRuJylcbiAgICBpZiAoZmllbGRJdGVtQnV0dG9ucy5sZW5ndGggPj0gMSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhmaWVsZEl0ZW1CdXR0b25zWzBdKVxuXG4gICAgLy8gR2V0IHRoZSBvblN1Ym1pdCBjYWxsYmFja1xuICAgIGNvbnN0IGVkaXRvclByb3BzID0gbW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwubW9jay5jYWxsc1swXVswXVxuXG4gICAgLy8gU2ltdWxhdGUgZm9ybSBzdWJtaXNzaW9uIHdpdGggY2hhbmdlZCB2YXJpYWJsZSBuYW1lIChpbmNsdWRpbmcgbW9yZUluZm8pXG4gICAgY29uc3QgdXBkYXRlZEZpZWxkRGF0YSA9IGNyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6ICduZXdfdmFyX25hbWUnLCBsYWJlbDogJ0xhYmVsIDAnIH0pXG4gICAgZWRpdG9yUHJvcHMub25TdWJtaXQodXBkYXRlZEZpZWxkRGF0YSwge1xuICAgICAgdHlwZTogJ2NoYW5nZVZhck5hbWUnLFxuICAgICAgcGF5bG9hZDogeyBiZWZvcmVLZXk6ICd2YXJfMCcsIGFmdGVyS2V5OiAnbmV3X3Zhcl9uYW1lJyB9LFxuICAgIH0pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QobW9ja0hhbmRsZUlucHV0VmFyUmVuYW1lKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICdub2RlLTEnLFxuICAgICAgWydyYWcnLCAnbm9kZS0xJywgJ3Zhcl8wJ10sXG4gICAgICBbJ3JhZycsICdub2RlLTEnLCAnbmV3X3Zhcl9uYW1lJ10sXG4gICAgKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbm90IGNhbGwgaGFuZGxlSW5wdXRWYXJSZW5hbWUgd2hlbiBtb3JlSW5mbyB0eXBlIGlzIG5vdCBjaGFuZ2VWYXJOYW1lJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2UgLSBUaGlzIHRlc3RzIGxpbmUgMTA4IGJyYW5jaCBpbiBob29rcy50c1xuICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG4gICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoXG4gICAgICA8RmllbGRMaXN0XG4gICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17Wyd2YXJfMCddfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgLy8gQ2xpY2sgZWRpdCBidXR0b25cbiAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICBjb25zdCBmaWVsZEl0ZW1CdXR0b25zID0gc29ydGFibGVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLmFjdGlvbi1idG4nKVxuICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAxKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpZWxkSXRlbUJ1dHRvbnNbMF0pXG5cbiAgICAvLyBHZXQgdGhlIG9uU3VibWl0IGNhbGxiYWNrXG4gICAgY29uc3QgZWRpdG9yUHJvcHMgPSBtb2NrVG9nZ2xlSW5wdXRGaWVsZEVkaXRQYW5lbC5tb2NrLmNhbGxzWzBdWzBdXG5cbiAgICAvLyBTaW11bGF0ZSBmb3JtIHN1Ym1pc3Npb24gV0lUSE9VVCBtb3JlSW5mbyAobm8gdmFyaWFibGUgbmFtZSBjaGFuZ2UpXG4gICAgY29uc3QgdXBkYXRlZEZpZWxkRGF0YSA9IGNyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6ICd2YXJfMCcsIGxhYmVsOiAnVXBkYXRlZCBMYWJlbCcgfSlcbiAgICBlZGl0b3JQcm9wcy5vblN1Ym1pdCh1cGRhdGVkRmllbGREYXRhKVxuXG4gICAgLy8gQXNzZXJ0IC0gaGFuZGxlSW5wdXRWYXJSZW5hbWUgc2hvdWxkIE5PVCBiZSBjYWxsZWRcbiAgICBleHBlY3QobW9ja0hhbmRsZUlucHV0VmFyUmVuYW1lKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgZXhwZWN0KGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcblxuICBpdCgnc2hvdWxkIG5vdCBjYWxsIGhhbmRsZUlucHV0VmFyUmVuYW1lIHdoZW4gbW9yZUluZm8gaGFzIGRpZmZlcmVudCB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2UgLSBUaGlzIHRlc3RzIGxpbmUgMTA4IGJyYW5jaCBpbiBob29rcy50cyB3aXRoIGRpZmZlcmVudCB0eXBlXG4gICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMSlcbiAgICBjb25zdCBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSA9IHZpLmZuKClcblxuICAgIC8vIEFjdFxuICAgIHJlbmRlcihcbiAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbJ3Zhcl8wJ119XG4gICAgICAvPixcbiAgICApXG5cbiAgICAvLyBDbGljayBlZGl0IGJ1dHRvblxuICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgIGNvbnN0IGZpZWxkSXRlbUJ1dHRvbnMgPSBzb3J0YWJsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24uYWN0aW9uLWJ0bicpXG4gICAgaWYgKGZpZWxkSXRlbUJ1dHRvbnMubGVuZ3RoID49IDEpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1swXSlcblxuICAgIC8vIEdldCB0aGUgb25TdWJtaXQgY2FsbGJhY2tcbiAgICBjb25zdCBlZGl0b3JQcm9wcyA9IG1vY2tUb2dnbGVJbnB1dEZpZWxkRWRpdFBhbmVsLm1vY2suY2FsbHNbMF1bMF1cblxuICAgIC8vIFNpbXVsYXRlIGZvcm0gc3VibWlzc2lvbiB3aXRoIG1vcmVJbmZvIGJ1dCBkaWZmZXJlbnQgdHlwZVxuICAgIGNvbnN0IHVwZGF0ZWRGaWVsZERhdGEgPSBjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAndmFyXzAnLCBsYWJlbDogJ1VwZGF0ZWQgTGFiZWwnIH0pXG4gICAgZWRpdG9yUHJvcHMub25TdWJtaXQodXBkYXRlZEZpZWxkRGF0YSwgeyB0eXBlOiAnb3RoZXJUeXBlJyBhcyBhbnkgfSlcblxuICAgIC8vIEFzc2VydCAtIGhhbmRsZUlucHV0VmFyUmVuYW1lIHNob3VsZCBOT1QgYmUgY2FsbGVkXG4gICAgZXhwZWN0KG1vY2tIYW5kbGVJbnB1dFZhclJlbmFtZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIGV4cGVjdChoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgYmVmb3JlS2V5IGFuZCBhZnRlcktleSBpbiBtb3JlSW5mbyBwYXlsb2FkJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2UgLSBUaGlzIHRlc3RzIGxpbmUgMTA4IHdpdGggZW1wdHkga2V5c1xuICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG4gICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoXG4gICAgICA8RmllbGRMaXN0XG4gICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17Wyd2YXJfMCddfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgLy8gQ2xpY2sgZWRpdCBidXR0b25cbiAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICBjb25zdCBmaWVsZEl0ZW1CdXR0b25zID0gc29ydGFibGVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLmFjdGlvbi1idG4nKVxuICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAxKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpZWxkSXRlbUJ1dHRvbnNbMF0pXG5cbiAgICAvLyBHZXQgdGhlIG9uU3VibWl0IGNhbGxiYWNrXG4gICAgY29uc3QgZWRpdG9yUHJvcHMgPSBtb2NrVG9nZ2xlSW5wdXRGaWVsZEVkaXRQYW5lbC5tb2NrLmNhbGxzWzBdWzBdXG5cbiAgICAvLyBTaW11bGF0ZSBmb3JtIHN1Ym1pc3Npb24gd2l0aCBjaGFuZ2VWYXJOYW1lIGJ1dCBlbXB0eSBrZXlzXG4gICAgY29uc3QgdXBkYXRlZEZpZWxkRGF0YSA9IGNyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6ICduZXdfdmFyJyB9KVxuICAgIGVkaXRvclByb3BzLm9uU3VibWl0KHVwZGF0ZWRGaWVsZERhdGEsIHtcbiAgICAgIHR5cGU6ICdjaGFuZ2VWYXJOYW1lJyxcbiAgICAgIHBheWxvYWQ6IHsgYmVmb3JlS2V5OiAnJywgYWZ0ZXJLZXk6ICcnIH0sXG4gICAgfSlcblxuICAgIC8vIEFzc2VydCAtIGhhbmRsZUlucHV0VmFyUmVuYW1lIHNob3VsZCBiZSBjYWxsZWQgd2l0aCBlbXB0eSBzdHJpbmdzXG4gICAgZXhwZWN0KG1vY2tIYW5kbGVJbnB1dFZhclJlbmFtZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAnbm9kZS0xJyxcbiAgICAgIFsncmFnJywgJ25vZGUtMScsICcnXSxcbiAgICAgIFsncmFnJywgJ25vZGUtMScsICcnXSxcbiAgICApXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHBheWxvYWQgaW4gbW9yZUluZm8nLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZSAtIFRoaXMgdGVzdHMgbGluZSAxMDggd2l0aCB1bmRlZmluZWQgcGF5bG9hZFxuICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG4gICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoXG4gICAgICA8RmllbGRMaXN0XG4gICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17Wyd2YXJfMCddfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgLy8gQ2xpY2sgZWRpdCBidXR0b25cbiAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICBjb25zdCBmaWVsZEl0ZW1CdXR0b25zID0gc29ydGFibGVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLmFjdGlvbi1idG4nKVxuICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAxKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpZWxkSXRlbUJ1dHRvbnNbMF0pXG5cbiAgICAvLyBHZXQgdGhlIG9uU3VibWl0IGNhbGxiYWNrXG4gICAgY29uc3QgZWRpdG9yUHJvcHMgPSBtb2NrVG9nZ2xlSW5wdXRGaWVsZEVkaXRQYW5lbC5tb2NrLmNhbGxzWzBdWzBdXG5cbiAgICAvLyBTaW11bGF0ZSBmb3JtIHN1Ym1pc3Npb24gd2l0aCBjaGFuZ2VWYXJOYW1lIGJ1dCB1bmRlZmluZWQgcGF5bG9hZFxuICAgIGNvbnN0IHVwZGF0ZWRGaWVsZERhdGEgPSBjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAnbmV3X3ZhcicgfSlcbiAgICBlZGl0b3JQcm9wcy5vblN1Ym1pdCh1cGRhdGVkRmllbGREYXRhLCB7XG4gICAgICB0eXBlOiAnY2hhbmdlVmFyTmFtZScsXG4gICAgICBwYXlsb2FkOiB1bmRlZmluZWQsXG4gICAgfSlcblxuICAgIC8vIEFzc2VydCAtIGhhbmRsZUlucHV0VmFyUmVuYW1lIHNob3VsZCBiZSBjYWxsZWQgd2l0aCBlbXB0eSBzdHJpbmdzIChmYWxsYmFjaylcbiAgICBleHBlY3QobW9ja0hhbmRsZUlucHV0VmFyUmVuYW1lKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICdub2RlLTEnLFxuICAgICAgWydyYWcnLCAnbm9kZS0xJywgJyddLFxuICAgICAgWydyYWcnLCAnbm9kZS0xJywgJyddLFxuICAgIClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNsb3NlIGVkaXRvciBwYW5lbCBhZnRlciBzdWNjZXNzZnVsIHN1Ym1pc3Npb24nLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG4gICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoXG4gICAgICA8RmllbGRMaXN0XG4gICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17Wyd2YXJfMCddfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgLy8gQ2xpY2sgYWRkIGJ1dHRvblxuICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtYWRkLWJ0bicpKVxuXG4gICAgLy8gR2V0IHRoZSBvblN1Ym1pdCBjYWxsYmFja1xuICAgIGNvbnN0IGVkaXRvclByb3BzID0gbW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwubW9jay5jYWxsc1swXVswXVxuXG4gICAgLy8gU2ltdWxhdGUgZm9ybSBzdWJtaXNzaW9uXG4gICAgY29uc3QgbmV3RmllbGREYXRhID0gY3JlYXRlSW5wdXRWYXIoeyB2YXJpYWJsZTogJ25ld192YXInIH0pXG4gICAgZWRpdG9yUHJvcHMub25TdWJtaXQobmV3RmllbGREYXRhKVxuXG4gICAgLy8gQXNzZXJ0IC0gdG9nZ2xlSW5wdXRGaWVsZEVkaXRQYW5lbCBzaG91bGQgYmUgY2FsbGVkIHdpdGggbnVsbCB0byBjbG9zZVxuICAgIGV4cGVjdChtb2NrVG9nZ2xlSW5wdXRGaWVsZEVkaXRQYW5lbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgZXhwZWN0KG1vY2tUb2dnbGVJbnB1dEZpZWxkRWRpdFBhbmVsKS50b0hhdmVCZWVuTGFzdENhbGxlZFdpdGgobnVsbClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIGVkaXRvciBpcyBjbG9zZWQgbWFudWFsbHknLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDEpXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoXG4gICAgICA8RmllbGRMaXN0XG4gICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgIC8+LFxuICAgIClcblxuICAgIC8vIENsaWNrIGFkZCBidXR0b25cbiAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmaWVsZC1saXN0LWFkZC1idG4nKSlcblxuICAgIC8vIEdldCB0aGUgb25DbG9zZSBjYWxsYmFja1xuICAgIGNvbnN0IGVkaXRvclByb3BzID0gbW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwubW9jay5jYWxsc1swXVswXVxuICAgIGV4cGVjdChlZGl0b3JQcm9wcykudG9IYXZlUHJvcGVydHkoJ29uQ2xvc2UnKVxuXG4gICAgLy8gU2ltdWxhdGUgY2xvc2VcbiAgICBlZGl0b3JQcm9wcy5vbkNsb3NlKClcblxuICAgIC8vIEFzc2VydCAtIHRvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwgc2hvdWxkIGJlIGNhbGxlZCB3aXRoIG51bGxcbiAgICBleHBlY3QobW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwpLnRvSGF2ZUJlZW5MYXN0Q2FsbGVkV2l0aChudWxsKVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRHVwbGljYXRlIFZhcmlhYmxlIE5hbWUgSGFuZGxpbmcgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0R1cGxpY2F0ZSBWYXJpYWJsZSBOYW1lIEhhbmRsaW5nJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSXNWYXJVc2VkSW5Ob2Rlcy5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gICAgbW9ja0lzSG92ZXJpbmcgPSBmYWxzZVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbm90IGFkZCBmaWVsZCBpZiB2YXJpYWJsZSBuYW1lIGlzIGR1cGxpY2F0ZScsIGFzeW5jICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgY29uc3QgVG9hc3QgPSBhd2FpdCBpbXBvcnQoJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCcpXG4gICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMilcbiAgICBjb25zdCBoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSA9IHZpLmZuKClcblxuICAgIC8vIEFjdFxuICAgIHJlbmRlcihcbiAgICAgIDxGaWVsZExpc3RcbiAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgIGlucHV0RmllbGRzPXtpbnB1dEZpZWxkc31cbiAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbJ3Zhcl8wJywgJ3Zhcl8xJywgJ2V4aXN0aW5nX3ZhciddfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgLy8gQ2xpY2sgYWRkIGJ1dHRvblxuICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtYWRkLWJ0bicpKVxuXG4gICAgLy8gR2V0IHRoZSBvblN1Ym1pdCBjYWxsYmFja1xuICAgIGNvbnN0IGVkaXRvclByb3BzID0gbW9ja1RvZ2dsZUlucHV0RmllbGRFZGl0UGFuZWwubW9jay5jYWxsc1swXVswXVxuXG4gICAgLy8gVHJ5IHRvIHN1Ym1pdCB3aXRoIGEgZHVwbGljYXRlIHZhcmlhYmxlIG5hbWVcbiAgICBjb25zdCBkdXBsaWNhdGVGaWVsZERhdGEgPSBjcmVhdGVJbnB1dFZhcih7IHZhcmlhYmxlOiAnZXhpc3RpbmdfdmFyJyB9KVxuICAgIGVkaXRvclByb3BzLm9uU3VibWl0KGR1cGxpY2F0ZUZpZWxkRGF0YSlcblxuICAgIC8vIEFzc2VydCAtIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlIHNob3VsZCBOT1QgYmUgY2FsbGVkXG4gICAgZXhwZWN0KGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgLy8gVG9hc3Qgc2hvdWxkIGJlIHNob3duXG4gICAgZXhwZWN0KFRvYXN0LmRlZmF1bHQubm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgdHlwZTogJ2Vycm9yJyB9KSxcbiAgICApXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBhbGxvdyB1cGRhdGluZyBmaWVsZCB0byBzYW1lIHZhcmlhYmxlIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIG1vY2tJc0hvdmVyaW5nID0gdHJ1ZVxuICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDIpXG4gICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoXG4gICAgICA8RmllbGRMaXN0XG4gICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgIExhYmVsUmlnaHRDb250ZW50PXtudWxsfVxuICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17Wyd2YXJfMCcsICd2YXJfMSddfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgLy8gQ2xpY2sgZWRpdCBidXR0b24gb24gZmlyc3QgZmllbGRcbiAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICBjb25zdCBmaWVsZEl0ZW1CdXR0b25zID0gc29ydGFibGVDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLmFjdGlvbi1idG4nKVxuICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAxKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGZpZWxkSXRlbUJ1dHRvbnNbMF0pXG5cbiAgICAvLyBHZXQgdGhlIG9uU3VibWl0IGNhbGxiYWNrXG4gICAgY29uc3QgZWRpdG9yUHJvcHMgPSBtb2NrVG9nZ2xlSW5wdXRGaWVsZEVkaXRQYW5lbC5tb2NrLmNhbGxzWzBdWzBdXG5cbiAgICAvLyBTdWJtaXQgd2l0aCBzYW1lIHZhcmlhYmxlIG5hbWUgKGp1c3QgdXBkYXRpbmcgbGFiZWwpXG4gICAgY29uc3QgdXBkYXRlZEZpZWxkRGF0YSA9IGNyZWF0ZUlucHV0VmFyKHsgdmFyaWFibGU6ICd2YXJfMCcsIGxhYmVsOiAnTmV3IExhYmVsJyB9KVxuICAgIGVkaXRvclByb3BzLm9uU3VibWl0KHVwZGF0ZWRGaWVsZERhdGEpXG5cbiAgICAvLyBBc3NlcnQgLSBzaG91bGQgYWxsb3cgdXBkYXRlIHdpdGggc2FtZSB2YXJpYWJsZSBuYW1lXG4gICAgZXhwZWN0KGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFNvcnRhYmxlSXRlbSBUeXBlIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdTb3J0YWJsZUl0ZW0gVHlwZScsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3Qgc3RydWN0dXJlJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBpbnB1dFZhciA9IGNyZWF0ZUlucHV0VmFyKClcbiAgICBjb25zdCBzb3J0YWJsZUl0ZW0gPSBjcmVhdGVTb3J0YWJsZUl0ZW0oaW5wdXRWYXIpXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3Qoc29ydGFibGVJdGVtLmlkKS50b0JlKGlucHV0VmFyLnZhcmlhYmxlKVxuICAgIGV4cGVjdChzb3J0YWJsZUl0ZW0uY2hvc2VuKS50b0JlKGZhbHNlKVxuICAgIGV4cGVjdChzb3J0YWJsZUl0ZW0uc2VsZWN0ZWQpLnRvQmUoZmFsc2UpXG4gICAgZXhwZWN0KHNvcnRhYmxlSXRlbS50eXBlKS50b0JlKGlucHV0VmFyLnR5cGUpXG4gICAgZXhwZWN0KHNvcnRhYmxlSXRlbS52YXJpYWJsZSkudG9CZShpbnB1dFZhci52YXJpYWJsZSlcbiAgICBleHBlY3Qoc29ydGFibGVJdGVtLmxhYmVsKS50b0JlKGlucHV0VmFyLmxhYmVsKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgYWxsb3cgb3ZlcnJpZGluZyBzb3J0YWJsZSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBpbnB1dFZhciA9IGNyZWF0ZUlucHV0VmFyKClcbiAgICBjb25zdCBzb3J0YWJsZUl0ZW0gPSBjcmVhdGVTb3J0YWJsZUl0ZW0oaW5wdXRWYXIsIHtcbiAgICAgIGNob3NlbjogdHJ1ZSxcbiAgICAgIHNlbGVjdGVkOiB0cnVlLFxuICAgIH0pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3Qoc29ydGFibGVJdGVtLmNob3NlbikudG9CZSh0cnVlKVxuICAgIGV4cGVjdChzb3J0YWJsZUl0ZW0uc2VsZWN0ZWQpLnRvQmUodHJ1ZSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEludGVncmF0aW9uIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdJbnRlZ3JhdGlvbiBUZXN0cycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0lzSG92ZXJpbmcgPSBmYWxzZVxuICAgIG1vY2tJc1ZhclVzZWRJbk5vZGVzLm1vY2tSZXR1cm5WYWx1ZShmYWxzZSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29tcGxldGUgV29ya2Zsb3cnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWRkIC0+IGVkaXQgLT4gcmVtb3ZlIHdvcmtmbG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzSG92ZXJpbmcgPSB0cnVlXG4gICAgICBjb25zdCBpbnB1dEZpZWxkcyA9IGNyZWF0ZUlucHV0VmFyTGlzdCgxKVxuICAgICAgY29uc3QgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdCAtIFJlbmRlclxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17PHNwYW4+RmllbGRzPC9zcGFuPn1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e2hhbmRsZUlucHV0RmllbGRzQ2hhbmdlfVxuICAgICAgICAgIGFsbFZhcmlhYmxlTmFtZXM9e1sndmFyXzAnXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFN0ZXAgMTogQ2xpY2sgYWRkIGJ1dHRvbiAoaW4gaGVhZGVyLCBvdXRzaWRlIHNvcnRhYmxlIGNvbnRhaW5lcilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpZWxkLWxpc3QtYWRkLWJ0bicpKVxuICAgICAgZXhwZWN0KG1vY2tUb2dnbGVJbnB1dEZpZWxkRWRpdFBhbmVsKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgLy8gU3RlcCAyOiBFZGl0IG9uIGV4aXN0aW5nIGZpZWxkXG4gICAgICBjb25zdCBzb3J0YWJsZUNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc29ydGFibGUtY29udGFpbmVyJylcbiAgICAgIGNvbnN0IGZpZWxkSXRlbUJ1dHRvbnMgPSBzb3J0YWJsZUNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24uYWN0aW9uLWJ0bicpXG4gICAgICBpZiAoZmllbGRJdGVtQnV0dG9ucy5sZW5ndGggPj0gMSkge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1swXSlcbiAgICAgICAgZXhwZWN0KG1vY2tUb2dnbGVJbnB1dEZpZWxkRWRpdFBhbmVsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICAgIH1cblxuICAgICAgLy8gU3RlcCAzOiBSZW1vdmUgZmllbGRcbiAgICAgIGlmIChmaWVsZEl0ZW1CdXR0b25zLmxlbmd0aCA+PSAyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZmllbGRJdGVtQnV0dG9uc1sxXSlcblxuICAgICAgZXhwZWN0KGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc29ydCBvcGVyYXRpb24gY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5wdXRGaWVsZHMgPSBjcmVhdGVJbnB1dFZhckxpc3QoMylcbiAgICAgIGNvbnN0IGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpZWxkTGlzdFxuICAgICAgICAgIG5vZGVJZD1cIm5vZGUtMVwiXG4gICAgICAgICAgTGFiZWxSaWdodENvbnRlbnQ9e251bGx9XG4gICAgICAgICAgaW5wdXRGaWVsZHM9e2lucHV0RmllbGRzfVxuICAgICAgICAgIGhhbmRsZUlucHV0RmllbGRzQ2hhbmdlPXtoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZX1cbiAgICAgICAgICBhbGxWYXJpYWJsZU5hbWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItc29ydCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVJbnB1dEZpZWxkc0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICdub2RlLTEnLFxuICAgICAgICBleHBlY3QuYW55KEFycmF5KSxcbiAgICAgIClcbiAgICAgIGNvbnN0IG5ld09yZGVyID0gaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2UubW9jay5jYWxsc1swXVsxXVxuICAgICAgLy8gRmlyc3QgdHdvIHNob3VsZCBiZSBzd2FwcGVkXG4gICAgICBleHBlY3QobmV3T3JkZXJbMF0udmFyaWFibGUpLnRvQmUoJ3Zhcl8xJylcbiAgICAgIGV4cGVjdChuZXdPcmRlclsxXS52YXJpYWJsZSkudG9CZSgndmFyXzAnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzIFByb3BhZ2F0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcHJvcGFnYXRlIHJlYWRvbmx5IHByb3AgdGhyb3VnaCBhbGwgY29tcG9uZW50cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGlucHV0RmllbGRzID0gY3JlYXRlSW5wdXRWYXJMaXN0KDIpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmllbGRMaXN0XG4gICAgICAgICAgbm9kZUlkPVwibm9kZS0xXCJcbiAgICAgICAgICBMYWJlbFJpZ2h0Q29udGVudD17bnVsbH1cbiAgICAgICAgICBpbnB1dEZpZWxkcz17aW5wdXRGaWVsZHN9XG4gICAgICAgICAgaGFuZGxlSW5wdXRGaWVsZHNDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgICAgYWxsVmFyaWFibGVOYW1lcz17W119XG4gICAgICAgICAgcmVhZG9ubHk9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFkZEJ1dHRvbiA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmZpbmQoYnRuID0+XG4gICAgICAgIGJ0bi5xdWVyeVNlbGVjdG9yKCdzdmcnKSxcbiAgICAgIClcbiAgICAgIGV4cGVjdChhZGRCdXR0b24pLnRvQmVEaXNhYmxlZCgpXG5cbiAgICAgIGNvbnN0IHNvcnRhYmxlQ29udGFpbmVyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0YWJsZS1jb250YWluZXInKVxuICAgICAgZXhwZWN0KHNvcnRhYmxlQ29udGFpbmVyLmRhdGFzZXQuZGlzYWJsZWQpLnRvQmUoJ3RydWUnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19