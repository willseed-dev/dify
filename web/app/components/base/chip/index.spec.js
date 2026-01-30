"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
afterEach(react_1.cleanup);
// Test data factory
const createTestItems = () => [
    { value: 'all', name: 'All Items' },
    { value: 'active', name: 'Active' },
    { value: 'archived', name: 'Archived' },
];
describe('Chip', () => {
    // Shared test props
    let items;
    let onSelect;
    let onClear;
    beforeEach(() => {
        vi.clearAllMocks();
        items = createTestItems();
        onSelect = vi.fn();
        onClear = vi.fn();
    });
    // Helper function to render Chip with default props
    const renderChip = (props = {}) => {
        return (0, react_1.render)(<index_1.default value="all" items={items} onSelect={onSelect} onClear={onClear} {...props}/>);
    };
    // Helper function to get the trigger element
    const getTrigger = (container) => {
        return container.querySelector('[data-state]');
    };
    // Helper function to open dropdown panel
    const openPanel = (container) => {
        const trigger = getTrigger(container);
        if (trigger)
            react_1.fireEvent.click(trigger);
    };
    describe('Rendering', () => {
        it('should render without crashing', () => {
            renderChip();
            expect(react_1.screen.getByText('All Items')).toBeInTheDocument();
        });
        it('should display current selected item name', () => {
            renderChip({ value: 'active' });
            expect(react_1.screen.getByText('Active')).toBeInTheDocument();
        });
        it('should display empty content when value does not match any item', () => {
            const { container } = renderChip({ value: 'nonexistent' });
            // When value doesn't match, no text should be displayed in trigger
            const trigger = getTrigger(container);
            // Check that there's no item name text (only icons should be present)
            expect(trigger?.textContent?.trim()).toBeFalsy();
        });
    });
    describe('Props', () => {
        it('should update displayed item name when value prop changes', () => {
            const { rerender } = renderChip({ value: 'all' });
            expect(react_1.screen.getByText('All Items')).toBeInTheDocument();
            rerender(<index_1.default value="archived" items={items} onSelect={onSelect} onClear={onClear}/>);
            expect(react_1.screen.getByText('Archived')).toBeInTheDocument();
        });
        it('should show left icon by default', () => {
            const { container } = renderChip();
            // The filter icon should be visible
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
        it('should hide left icon when showLeftIcon is false', () => {
            renderChip({ showLeftIcon: false });
            // When showLeftIcon is false, there should be no filter icon before the text
            const textElement = react_1.screen.getByText('All Items');
            const parent = textElement.closest('div[data-state]');
            const icons = parent?.querySelectorAll('svg');
            // Should only have the arrow icon, not the filter icon
            expect(icons?.length).toBe(1);
        });
        it('should render custom left icon', () => {
            const CustomIcon = () => <span data-testid="custom-icon">★</span>;
            renderChip({ leftIcon: <CustomIcon /> });
            expect(react_1.screen.getByTestId('custom-icon')).toBeInTheDocument();
        });
        it('should apply custom className to trigger', () => {
            const customClass = 'custom-chip-class';
            const { container } = renderChip({ className: customClass });
            const chipElement = container.querySelector(`.${customClass}`);
            expect(chipElement).toBeInTheDocument();
        });
        it('should apply custom panelClassName to dropdown panel', () => {
            const customPanelClass = 'custom-panel-class';
            const { container } = renderChip({ panelClassName: customPanelClass });
            openPanel(container);
            // Panel is rendered in a portal, so check document.body
            const panel = document.body.querySelector(`.${customPanelClass}`);
            expect(panel).toBeInTheDocument();
        });
    });
    describe('State Management', () => {
        it('should toggle dropdown panel on trigger click', () => {
            const { container } = renderChip();
            // Initially closed - check data-state attribute
            const trigger = getTrigger(container);
            expect(trigger).toHaveAttribute('data-state', 'closed');
            // Open panel
            openPanel(container);
            expect(trigger).toHaveAttribute('data-state', 'open');
            // Panel items should be visible
            expect(react_1.screen.getAllByText('All Items').length).toBeGreaterThan(1);
            // Close panel
            if (trigger)
                react_1.fireEvent.click(trigger);
            expect(trigger).toHaveAttribute('data-state', 'closed');
        });
        it('should close panel after selecting an item', () => {
            const { container } = renderChip();
            openPanel(container);
            const trigger = getTrigger(container);
            expect(trigger).toHaveAttribute('data-state', 'open');
            // Click on an item in the dropdown panel
            const activeItems = react_1.screen.getAllByText('Active');
            // The second one should be in the dropdown
            react_1.fireEvent.click(activeItems[activeItems.length - 1]);
            expect(trigger).toHaveAttribute('data-state', 'closed');
        });
    });
    describe('Event Handlers', () => {
        it('should call onSelect with correct item when item is clicked', () => {
            const { container } = renderChip();
            openPanel(container);
            // Get all "Active" texts and click the one in the dropdown (should be the last one)
            const activeItems = react_1.screen.getAllByText('Active');
            react_1.fireEvent.click(activeItems[activeItems.length - 1]);
            expect(onSelect).toHaveBeenCalledTimes(1);
            expect(onSelect).toHaveBeenCalledWith(items[1]);
        });
        it('should call onClear when clear button is clicked', () => {
            const { container } = renderChip({ value: 'active' });
            // Find the close icon (last SVG in the trigger) and click its parent
            const trigger = getTrigger(container);
            const svgs = trigger?.querySelectorAll('svg');
            // The close icon should be the last SVG element
            const closeIcon = svgs?.[svgs.length - 1];
            const clearButton = closeIcon?.parentElement;
            expect(clearButton).toBeInTheDocument();
            if (clearButton)
                react_1.fireEvent.click(clearButton);
            expect(onClear).toHaveBeenCalledTimes(1);
        });
        it('should stop event propagation when clear button is clicked', () => {
            const { container } = renderChip({ value: 'active' });
            const trigger = getTrigger(container);
            expect(trigger).toHaveAttribute('data-state', 'closed');
            // Find the close icon (last SVG) and click its parent
            const svgs = trigger?.querySelectorAll('svg');
            const closeIcon = svgs?.[svgs.length - 1];
            const clearButton = closeIcon?.parentElement;
            if (clearButton)
                react_1.fireEvent.click(clearButton);
            // Panel should remain closed
            expect(trigger).toHaveAttribute('data-state', 'closed');
            expect(onClear).toHaveBeenCalledTimes(1);
        });
        it('should handle multiple rapid clicks on trigger', () => {
            const { container } = renderChip();
            const trigger = getTrigger(container);
            // Click 1: open
            if (trigger)
                react_1.fireEvent.click(trigger);
            expect(trigger).toHaveAttribute('data-state', 'open');
            // Click 2: close
            if (trigger)
                react_1.fireEvent.click(trigger);
            expect(trigger).toHaveAttribute('data-state', 'closed');
            // Click 3: open again
            if (trigger)
                react_1.fireEvent.click(trigger);
            expect(trigger).toHaveAttribute('data-state', 'open');
        });
    });
    describe('Conditional Rendering', () => {
        it('should show arrow down icon when no value is selected', () => {
            const { container } = renderChip({ value: '' });
            // Should have SVG icons (filter icon and arrow down icon)
            const svgs = container.querySelectorAll('svg');
            expect(svgs.length).toBeGreaterThan(0);
        });
        it('should show clear button when value is selected', () => {
            const { container } = renderChip({ value: 'active' });
            // When value is selected, there should be an icon (the close icon)
            const svgs = container.querySelectorAll('svg');
            expect(svgs.length).toBeGreaterThan(0);
        });
        it('should not show clear button when no value is selected', () => {
            const { container } = renderChip({ value: '' });
            const trigger = getTrigger(container);
            // When value is empty, the trigger should only have 2 SVGs (filter icon + arrow)
            // When value is selected, it would have 2 SVGs (filter icon + close icon)
            const svgs = trigger?.querySelectorAll('svg');
            // Arrow icon should be present, close icon should not
            expect(svgs?.length).toBe(2);
            // Verify onClear hasn't been called
            expect(onClear).not.toHaveBeenCalled();
        });
        it('should show dropdown content only when panel is open', () => {
            const { container } = renderChip();
            const trigger = getTrigger(container);
            // Closed by default
            expect(trigger).toHaveAttribute('data-state', 'closed');
            openPanel(container);
            expect(trigger).toHaveAttribute('data-state', 'open');
            // Items should be duplicated (once in trigger, once in panel)
            expect(react_1.screen.getAllByText('All Items').length).toBeGreaterThan(1);
        });
        it('should show check icon on selected item in dropdown', () => {
            const { container } = renderChip({ value: 'active' });
            openPanel(container);
            // Find the dropdown panel items
            const allActiveTexts = react_1.screen.getAllByText('Active');
            // The dropdown item should be the last one
            const dropdownItem = allActiveTexts[allActiveTexts.length - 1];
            const parentContainer = dropdownItem.parentElement;
            // The check icon should be a sibling within the parent
            const checkIcon = parentContainer?.querySelector('svg');
            expect(checkIcon).toBeInTheDocument();
        });
        it('should render all items in dropdown when open', () => {
            const { container } = renderChip();
            openPanel(container);
            // Each item should appear at least twice (once in potential selected state, once in dropdown)
            // Use getAllByText to handle multiple occurrences
            expect(react_1.screen.getAllByText('All Items').length).toBeGreaterThan(0);
            expect(react_1.screen.getAllByText('Active').length).toBeGreaterThan(0);
            expect(react_1.screen.getAllByText('Archived').length).toBeGreaterThan(0);
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty items array', () => {
            const { container } = renderChip({ items: [], value: '' });
            // Trigger should still render
            const trigger = container.querySelector('[data-state]');
            expect(trigger).toBeInTheDocument();
        });
        it('should handle value not in items list', () => {
            const { container } = renderChip({ value: 'nonexistent' });
            const trigger = getTrigger(container);
            expect(trigger).toBeInTheDocument();
            // The trigger should not display any item name text
            expect(trigger?.textContent?.trim()).toBeFalsy();
        });
        it('should allow selecting already selected item', () => {
            const { container } = renderChip({ value: 'active' });
            openPanel(container);
            // Click on the already selected item in the dropdown
            const activeItems = react_1.screen.getAllByText('Active');
            react_1.fireEvent.click(activeItems[activeItems.length - 1]);
            expect(onSelect).toHaveBeenCalledTimes(1);
            expect(onSelect).toHaveBeenCalledWith(items[1]);
        });
        it('should handle numeric values', () => {
            const numericItems = [
                { value: 1, name: 'First' },
                { value: 2, name: 'Second' },
                { value: 3, name: 'Third' },
            ];
            const { container } = renderChip({ value: 2, items: numericItems });
            expect(react_1.screen.getByText('Second')).toBeInTheDocument();
            // Open panel and select Third
            openPanel(container);
            const thirdItems = react_1.screen.getAllByText('Third');
            react_1.fireEvent.click(thirdItems[thirdItems.length - 1]);
            expect(onSelect).toHaveBeenCalledWith(numericItems[2]);
        });
        it('should handle items with additional properties', () => {
            const itemsWithExtra = [
                { value: 'a', name: 'Item A', customProp: 'extra1' },
                { value: 'b', name: 'Item B', customProp: 'extra2' },
            ];
            const { container } = renderChip({ value: 'a', items: itemsWithExtra });
            expect(react_1.screen.getByText('Item A')).toBeInTheDocument();
            // Open panel and select Item B
            openPanel(container);
            const itemBs = react_1.screen.getAllByText('Item B');
            react_1.fireEvent.click(itemBs[itemBs.length - 1]);
            expect(onSelect).toHaveBeenCalledWith(itemsWithExtra[1]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixtQ0FBMEI7QUFFMUIsU0FBUyxDQUFDLGVBQU8sQ0FBQyxDQUFBO0FBRWxCLG9CQUFvQjtBQUNwQixNQUFNLGVBQWUsR0FBRyxHQUFXLEVBQUUsQ0FBQztJQUNwQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtJQUNuQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUNuQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtDQUN4QyxDQUFBO0FBRUQsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDcEIsb0JBQW9CO0lBQ3BCLElBQUksS0FBYSxDQUFBO0lBQ2pCLElBQUksUUFBOEIsQ0FBQTtJQUNsQyxJQUFJLE9BQW1CLENBQUE7SUFFdkIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQixLQUFLLEdBQUcsZUFBZSxFQUFFLENBQUE7UUFDekIsUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtRQUNsQixPQUFPLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0lBRUYsb0RBQW9EO0lBQ3BELE1BQU0sVUFBVSxHQUFHLENBQUMsUUFBb0QsRUFBRSxFQUFFLEVBQUU7UUFDNUUsT0FBTyxJQUFBLGNBQU0sRUFDWCxDQUFDLGVBQUksQ0FDSCxLQUFLLENBQUMsS0FBSyxDQUNYLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNiLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNuQixPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FD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QUFBO1lBRXBCLE1BQU0sTUFBTSxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDNUMsaUJBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUUxQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBJdGVtIH0gZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IGNsZWFudXAsIGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ2hpcCBmcm9tICcuL2luZGV4J1xuXG5hZnRlckVhY2goY2xlYW51cClcblxuLy8gVGVzdCBkYXRhIGZhY3RvcnlcbmNvbnN0IGNyZWF0ZVRlc3RJdGVtcyA9ICgpOiBJdGVtW10gPT4gW1xuICB7IHZhbHVlOiAnYWxsJywgbmFtZTogJ0FsbCBJdGVtcycgfSxcbiAgeyB2YWx1ZTogJ2FjdGl2ZScsIG5hbWU6ICdBY3RpdmUnIH0sXG4gIHsgdmFsdWU6ICdhcmNoaXZlZCcsIG5hbWU6ICdBcmNoaXZlZCcgfSxcbl1cblxuZGVzY3JpYmUoJ0NoaXAnLCAoKSA9PiB7XG4gIC8vIFNoYXJlZCB0ZXN0IHByb3BzXG4gIGxldCBpdGVtczogSXRlbVtdXG4gIGxldCBvblNlbGVjdDogKGl0ZW06IEl0ZW0pID0+IHZvaWRcbiAgbGV0IG9uQ2xlYXI6ICgpID0+IHZvaWRcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBpdGVtcyA9IGNyZWF0ZVRlc3RJdGVtcygpXG4gICAgb25TZWxlY3QgPSB2aS5mbigpXG4gICAgb25DbGVhciA9IHZpLmZuKClcbiAgfSlcblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gcmVuZGVyIENoaXAgd2l0aCBkZWZhdWx0IHByb3BzXG4gIGNvbnN0IHJlbmRlckNoaXAgPSAocHJvcHM6IFBhcnRpYWw8UmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIENoaXA+PiA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIHJlbmRlcihcbiAgICAgIDxDaGlwXG4gICAgICAgIHZhbHVlPVwiYWxsXCJcbiAgICAgICAgaXRlbXM9e2l0ZW1zfVxuICAgICAgICBvblNlbGVjdD17b25TZWxlY3R9XG4gICAgICAgIG9uQ2xlYXI9e29uQ2xlYXJ9XG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgIC8+LFxuICAgIClcbiAgfVxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBnZXQgdGhlIHRyaWdnZXIgZWxlbWVudFxuICBjb25zdCBnZXRUcmlnZ2VyID0gKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpID0+IHtcbiAgICByZXR1cm4gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXN0YXRlXScpXG4gIH1cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gb3BlbiBkcm9wZG93biBwYW5lbFxuICBjb25zdCBvcGVuUGFuZWwgPSAoY29udGFpbmVyOiBIVE1MRWxlbWVudCkgPT4ge1xuICAgIGNvbnN0IHRyaWdnZXIgPSBnZXRUcmlnZ2VyKGNvbnRhaW5lcilcbiAgICBpZiAodHJpZ2dlcilcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICB9XG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyQ2hpcCgpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBbGwgSXRlbXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY3VycmVudCBzZWxlY3RlZCBpdGVtIG5hbWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDaGlwKHsgdmFsdWU6ICdhY3RpdmUnIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBY3RpdmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZW1wdHkgY29udGVudCB3aGVuIHZhbHVlIGRvZXMgbm90IG1hdGNoIGFueSBpdGVtJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNoaXAoeyB2YWx1ZTogJ25vbmV4aXN0ZW50JyB9KVxuXG4gICAgICAvLyBXaGVuIHZhbHVlIGRvZXNuJ3QgbWF0Y2gsIG5vIHRleHQgc2hvdWxkIGJlIGRpc3BsYXllZCBpbiB0cmlnZ2VyXG4gICAgICBjb25zdCB0cmlnZ2VyID0gZ2V0VHJpZ2dlcihjb250YWluZXIpXG4gICAgICAvLyBDaGVjayB0aGF0IHRoZXJlJ3Mgbm8gaXRlbSBuYW1lIHRleHQgKG9ubHkgaWNvbnMgc2hvdWxkIGJlIHByZXNlbnQpXG4gICAgICBleHBlY3QodHJpZ2dlcj8udGV4dENvbnRlbnQ/LnRyaW0oKSkudG9CZUZhbHN5KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBkaXNwbGF5ZWQgaXRlbSBuYW1lIHdoZW4gdmFsdWUgcHJvcCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyQ2hpcCh7IHZhbHVlOiAnYWxsJyB9KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FsbCBJdGVtcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8Q2hpcFxuICAgICAgICAgIHZhbHVlPVwiYXJjaGl2ZWRcIlxuICAgICAgICAgIGl0ZW1zPXtpdGVtc31cbiAgICAgICAgICBvblNlbGVjdD17b25TZWxlY3R9XG4gICAgICAgICAgb25DbGVhcj17b25DbGVhcn1cbiAgICAgICAgLz4sXG4gICAgICApXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQXJjaGl2ZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbGVmdCBpY29uIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCgpXG5cbiAgICAgIC8vIFRoZSBmaWx0ZXIgaWNvbiBzaG91bGQgYmUgdmlzaWJsZVxuICAgICAgY29uc3Qgc3ZnID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3Qoc3ZnKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBsZWZ0IGljb24gd2hlbiBzaG93TGVmdEljb24gaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICByZW5kZXJDaGlwKHsgc2hvd0xlZnRJY29uOiBmYWxzZSB9KVxuXG4gICAgICAvLyBXaGVuIHNob3dMZWZ0SWNvbiBpcyBmYWxzZSwgdGhlcmUgc2hvdWxkIGJlIG5vIGZpbHRlciBpY29uIGJlZm9yZSB0aGUgdGV4dFxuICAgICAgY29uc3QgdGV4dEVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdBbGwgSXRlbXMnKVxuICAgICAgY29uc3QgcGFyZW50ID0gdGV4dEVsZW1lbnQuY2xvc2VzdCgnZGl2W2RhdGEtc3RhdGVdJylcbiAgICAgIGNvbnN0IGljb25zID0gcGFyZW50Py5xdWVyeVNlbGVjdG9yQWxsKCdzdmcnKVxuXG4gICAgICAvLyBTaG91bGQgb25seSBoYXZlIHRoZSBhcnJvdyBpY29uLCBub3QgdGhlIGZpbHRlciBpY29uXG4gICAgICBleHBlY3QoaWNvbnM/Lmxlbmd0aCkudG9CZSgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjdXN0b20gbGVmdCBpY29uJywgKCkgPT4ge1xuICAgICAgY29uc3QgQ3VzdG9tSWNvbiA9ICgpID0+IDxzcGFuIGRhdGEtdGVzdGlkPVwiY3VzdG9tLWljb25cIj7imIU8L3NwYW4+XG5cbiAgICAgIHJlbmRlckNoaXAoeyBsZWZ0SWNvbjogPEN1c3RvbUljb24gLz4gfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUgdG8gdHJpZ2dlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1c3RvbUNsYXNzID0gJ2N1c3RvbS1jaGlwLWNsYXNzJ1xuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCh7IGNsYXNzTmFtZTogY3VzdG9tQ2xhc3MgfSlcblxuICAgICAgY29uc3QgY2hpcEVsZW1lbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcihgLiR7Y3VzdG9tQ2xhc3N9YClcbiAgICAgIGV4cGVjdChjaGlwRWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBwYW5lbENsYXNzTmFtZSB0byBkcm9wZG93biBwYW5lbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1c3RvbVBhbmVsQ2xhc3MgPSAnY3VzdG9tLXBhbmVsLWNsYXNzJ1xuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCh7IHBhbmVsQ2xhc3NOYW1lOiBjdXN0b21QYW5lbENsYXNzIH0pXG4gICAgICBvcGVuUGFuZWwoY29udGFpbmVyKVxuXG4gICAgICAvLyBQYW5lbCBpcyByZW5kZXJlZCBpbiBhIHBvcnRhbCwgc28gY2hlY2sgZG9jdW1lbnQuYm9keVxuICAgICAgY29uc3QgcGFuZWwgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoYC4ke2N1c3RvbVBhbmVsQ2xhc3N9YClcbiAgICAgIGV4cGVjdChwYW5lbCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0b2dnbGUgZHJvcGRvd24gcGFuZWwgb24gdHJpZ2dlciBjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDaGlwKClcblxuICAgICAgLy8gSW5pdGlhbGx5IGNsb3NlZCAtIGNoZWNrIGRhdGEtc3RhdGUgYXR0cmlidXRlXG4gICAgICBjb25zdCB0cmlnZ2VyID0gZ2V0VHJpZ2dlcihjb250YWluZXIpXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2Nsb3NlZCcpXG5cbiAgICAgIC8vIE9wZW4gcGFuZWxcbiAgICAgIG9wZW5QYW5lbChjb250YWluZXIpXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ29wZW4nKVxuICAgICAgLy8gUGFuZWwgaXRlbXMgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXh0KCdBbGwgSXRlbXMnKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigxKVxuXG4gICAgICAvLyBDbG9zZSBwYW5lbFxuICAgICAgaWYgKHRyaWdnZXIpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdjbG9zZWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIHBhbmVsIGFmdGVyIHNlbGVjdGluZyBhbiBpdGVtJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNoaXAoKVxuXG4gICAgICBvcGVuUGFuZWwoY29udGFpbmVyKVxuICAgICAgY29uc3QgdHJpZ2dlciA9IGdldFRyaWdnZXIoY29udGFpbmVyKVxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdvcGVuJylcblxuICAgICAgLy8gQ2xpY2sgb24gYW4gaXRlbSBpbiB0aGUgZHJvcGRvd24gcGFuZWxcbiAgICAgIGNvbnN0IGFjdGl2ZUl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgnQWN0aXZlJylcbiAgICAgIC8vIFRoZSBzZWNvbmQgb25lIHNob3VsZCBiZSBpbiB0aGUgZHJvcGRvd25cbiAgICAgIGZpcmVFdmVudC5jbGljayhhY3RpdmVJdGVtc1thY3RpdmVJdGVtcy5sZW5ndGggLSAxXSlcblxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zdGF0ZScsICdjbG9zZWQnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblNlbGVjdCB3aXRoIGNvcnJlY3QgaXRlbSB3aGVuIGl0ZW0gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDaGlwKClcblxuICAgICAgb3BlblBhbmVsKGNvbnRhaW5lcilcbiAgICAgIC8vIEdldCBhbGwgXCJBY3RpdmVcIiB0ZXh0cyBhbmQgY2xpY2sgdGhlIG9uZSBpbiB0aGUgZHJvcGRvd24gKHNob3VsZCBiZSB0aGUgbGFzdCBvbmUpXG4gICAgICBjb25zdCBhY3RpdmVJdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJ0FjdGl2ZScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYWN0aXZlSXRlbXNbYWN0aXZlSXRlbXMubGVuZ3RoIC0gMV0pXG5cbiAgICAgIGV4cGVjdChvblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3Qob25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGl0ZW1zWzFdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbGVhciB3aGVuIGNsZWFyIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNoaXAoeyB2YWx1ZTogJ2FjdGl2ZScgfSlcblxuICAgICAgLy8gRmluZCB0aGUgY2xvc2UgaWNvbiAobGFzdCBTVkcgaW4gdGhlIHRyaWdnZXIpIGFuZCBjbGljayBpdHMgcGFyZW50XG4gICAgICBjb25zdCB0cmlnZ2VyID0gZ2V0VHJpZ2dlcihjb250YWluZXIpXG4gICAgICBjb25zdCBzdmdzID0gdHJpZ2dlcj8ucXVlcnlTZWxlY3RvckFsbCgnc3ZnJylcbiAgICAgIC8vIFRoZSBjbG9zZSBpY29uIHNob3VsZCBiZSB0aGUgbGFzdCBTVkcgZWxlbWVudFxuICAgICAgY29uc3QgY2xvc2VJY29uID0gc3Zncz8uW3N2Z3MubGVuZ3RoIC0gMV1cbiAgICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gY2xvc2VJY29uPy5wYXJlbnRFbGVtZW50XG5cbiAgICAgIGV4cGVjdChjbGVhckJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgaWYgKGNsZWFyQnV0dG9uKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2xlYXJCdXR0b24pXG5cbiAgICAgIGV4cGVjdChvbkNsZWFyKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzdG9wIGV2ZW50IHByb3BhZ2F0aW9uIHdoZW4gY2xlYXIgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCh7IHZhbHVlOiAnYWN0aXZlJyB9KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gZ2V0VHJpZ2dlcihjb250YWluZXIpXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2Nsb3NlZCcpXG5cbiAgICAgIC8vIEZpbmQgdGhlIGNsb3NlIGljb24gKGxhc3QgU1ZHKSBhbmQgY2xpY2sgaXRzIHBhcmVudFxuICAgICAgY29uc3Qgc3ZncyA9IHRyaWdnZXI/LnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2ZycpXG4gICAgICBjb25zdCBjbG9zZUljb24gPSBzdmdzPy5bc3Zncy5sZW5ndGggLSAxXVxuICAgICAgY29uc3QgY2xlYXJCdXR0b24gPSBjbG9zZUljb24/LnBhcmVudEVsZW1lbnRcblxuICAgICAgaWYgKGNsZWFyQnV0dG9uKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY2xlYXJCdXR0b24pXG5cbiAgICAgIC8vIFBhbmVsIHNob3VsZCByZW1haW4gY2xvc2VkXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2Nsb3NlZCcpXG4gICAgICBleHBlY3Qob25DbGVhcikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIHJhcGlkIGNsaWNrcyBvbiB0cmlnZ2VyJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNoaXAoKVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gZ2V0VHJpZ2dlcihjb250YWluZXIpXG5cbiAgICAgIC8vIENsaWNrIDE6IG9wZW5cbiAgICAgIGlmICh0cmlnZ2VyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCAnb3BlbicpXG5cbiAgICAgIC8vIENsaWNrIDI6IGNsb3NlXG4gICAgICBpZiAodHJpZ2dlcilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9IYXZlQXR0cmlidXRlKCdkYXRhLXN0YXRlJywgJ2Nsb3NlZCcpXG5cbiAgICAgIC8vIENsaWNrIDM6IG9wZW4gYWdhaW5cbiAgICAgIGlmICh0cmlnZ2VyKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCAnb3BlbicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29uZGl0aW9uYWwgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBhcnJvdyBkb3duIGljb24gd2hlbiBubyB2YWx1ZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDaGlwKHsgdmFsdWU6ICcnIH0pXG5cbiAgICAgIC8vIFNob3VsZCBoYXZlIFNWRyBpY29ucyAoZmlsdGVyIGljb24gYW5kIGFycm93IGRvd24gaWNvbilcbiAgICAgIGNvbnN0IHN2Z3MgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc3ZnJylcbiAgICAgIGV4cGVjdChzdmdzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjbGVhciBidXR0b24gd2hlbiB2YWx1ZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDaGlwKHsgdmFsdWU6ICdhY3RpdmUnIH0pXG5cbiAgICAgIC8vIFdoZW4gdmFsdWUgaXMgc2VsZWN0ZWQsIHRoZXJlIHNob3VsZCBiZSBhbiBpY29uICh0aGUgY2xvc2UgaWNvbilcbiAgICAgIGNvbnN0IHN2Z3MgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc3ZnJylcbiAgICAgIGV4cGVjdChzdmdzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgY2xlYXIgYnV0dG9uIHdoZW4gbm8gdmFsdWUgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCh7IHZhbHVlOiAnJyB9KVxuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gZ2V0VHJpZ2dlcihjb250YWluZXIpXG5cbiAgICAgIC8vIFdoZW4gdmFsdWUgaXMgZW1wdHksIHRoZSB0cmlnZ2VyIHNob3VsZCBvbmx5IGhhdmUgMiBTVkdzIChmaWx0ZXIgaWNvbiArIGFycm93KVxuICAgICAgLy8gV2hlbiB2YWx1ZSBpcyBzZWxlY3RlZCwgaXQgd291bGQgaGF2ZSAyIFNWR3MgKGZpbHRlciBpY29uICsgY2xvc2UgaWNvbilcbiAgICAgIGNvbnN0IHN2Z3MgPSB0cmlnZ2VyPy5xdWVyeVNlbGVjdG9yQWxsKCdzdmcnKVxuICAgICAgLy8gQXJyb3cgaWNvbiBzaG91bGQgYmUgcHJlc2VudCwgY2xvc2UgaWNvbiBzaG91bGQgbm90XG4gICAgICBleHBlY3Qoc3Zncz8ubGVuZ3RoKS50b0JlKDIpXG5cbiAgICAgIC8vIFZlcmlmeSBvbkNsZWFyIGhhc24ndCBiZWVuIGNhbGxlZFxuICAgICAgZXhwZWN0KG9uQ2xlYXIpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGRyb3Bkb3duIGNvbnRlbnQgb25seSB3aGVuIHBhbmVsIGlzIG9wZW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCgpXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBnZXRUcmlnZ2VyKGNvbnRhaW5lcilcblxuICAgICAgLy8gQ2xvc2VkIGJ5IGRlZmF1bHRcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCAnY2xvc2VkJylcblxuICAgICAgb3BlblBhbmVsKGNvbnRhaW5lcilcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc3RhdGUnLCAnb3BlbicpXG4gICAgICAvLyBJdGVtcyBzaG91bGQgYmUgZHVwbGljYXRlZCAob25jZSBpbiB0cmlnZ2VyLCBvbmNlIGluIHBhbmVsKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRleHQoJ0FsbCBJdGVtcycpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjaGVjayBpY29uIG9uIHNlbGVjdGVkIGl0ZW0gaW4gZHJvcGRvd24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCh7IHZhbHVlOiAnYWN0aXZlJyB9KVxuXG4gICAgICBvcGVuUGFuZWwoY29udGFpbmVyKVxuXG4gICAgICAvLyBGaW5kIHRoZSBkcm9wZG93biBwYW5lbCBpdGVtc1xuICAgICAgY29uc3QgYWxsQWN0aXZlVGV4dHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdBY3RpdmUnKVxuICAgICAgLy8gVGhlIGRyb3Bkb3duIGl0ZW0gc2hvdWxkIGJlIHRoZSBsYXN0IG9uZVxuICAgICAgY29uc3QgZHJvcGRvd25JdGVtID0gYWxsQWN0aXZlVGV4dHNbYWxsQWN0aXZlVGV4dHMubGVuZ3RoIC0gMV1cbiAgICAgIGNvbnN0IHBhcmVudENvbnRhaW5lciA9IGRyb3Bkb3duSXRlbS5wYXJlbnRFbGVtZW50XG5cbiAgICAgIC8vIFRoZSBjaGVjayBpY29uIHNob3VsZCBiZSBhIHNpYmxpbmcgd2l0aGluIHRoZSBwYXJlbnRcbiAgICAgIGNvbnN0IGNoZWNrSWNvbiA9IHBhcmVudENvbnRhaW5lcj8ucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChjaGVja0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGl0ZW1zIGluIGRyb3Bkb3duIHdoZW4gb3BlbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDaGlwKClcblxuICAgICAgb3BlblBhbmVsKGNvbnRhaW5lcilcblxuICAgICAgLy8gRWFjaCBpdGVtIHNob3VsZCBhcHBlYXIgYXQgbGVhc3QgdHdpY2UgKG9uY2UgaW4gcG90ZW50aWFsIHNlbGVjdGVkIHN0YXRlLCBvbmNlIGluIGRyb3Bkb3duKVxuICAgICAgLy8gVXNlIGdldEFsbEJ5VGV4dCB0byBoYW5kbGUgbXVsdGlwbGUgb2NjdXJyZW5jZXNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXh0KCdBbGwgSXRlbXMnKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRleHQoJ0FjdGl2ZScpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgnQXJjaGl2ZWQnKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgaXRlbXMgYXJyYXknLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCh7IGl0ZW1zOiBbXSwgdmFsdWU6ICcnIH0pXG5cbiAgICAgIC8vIFRyaWdnZXIgc2hvdWxkIHN0aWxsIHJlbmRlclxuICAgICAgY29uc3QgdHJpZ2dlciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zdGF0ZV0nKVxuICAgICAgZXhwZWN0KHRyaWdnZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmFsdWUgbm90IGluIGl0ZW1zIGxpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCh7IHZhbHVlOiAnbm9uZXhpc3RlbnQnIH0pXG5cbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBnZXRUcmlnZ2VyKGNvbnRhaW5lcilcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFRoZSB0cmlnZ2VyIHNob3VsZCBub3QgZGlzcGxheSBhbnkgaXRlbSBuYW1lIHRleHRcbiAgICAgIGV4cGVjdCh0cmlnZ2VyPy50ZXh0Q29udGVudD8udHJpbSgpKS50b0JlRmFsc3koKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHNlbGVjdGluZyBhbHJlYWR5IHNlbGVjdGVkIGl0ZW0nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ2hpcCh7IHZhbHVlOiAnYWN0aXZlJyB9KVxuXG4gICAgICBvcGVuUGFuZWwoY29udGFpbmVyKVxuXG4gICAgICAvLyBDbGljayBvbiB0aGUgYWxyZWFkeSBzZWxlY3RlZCBpdGVtIGluIHRoZSBkcm9wZG93blxuICAgICAgY29uc3QgYWN0aXZlSXRlbXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdBY3RpdmUnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGFjdGl2ZUl0ZW1zW2FjdGl2ZUl0ZW1zLmxlbmd0aCAtIDFdKVxuXG4gICAgICBleHBlY3Qob25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChpdGVtc1sxXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVtZXJpYyB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBudW1lcmljSXRlbXM6IEl0ZW1bXSA9IFtcbiAgICAgICAgeyB2YWx1ZTogMSwgbmFtZTogJ0ZpcnN0JyB9LFxuICAgICAgICB7IHZhbHVlOiAyLCBuYW1lOiAnU2Vjb25kJyB9LFxuICAgICAgICB7IHZhbHVlOiAzLCBuYW1lOiAnVGhpcmQnIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDaGlwKHsgdmFsdWU6IDIsIGl0ZW1zOiBudW1lcmljSXRlbXMgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlY29uZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIE9wZW4gcGFuZWwgYW5kIHNlbGVjdCBUaGlyZFxuICAgICAgb3BlblBhbmVsKGNvbnRhaW5lcilcblxuICAgICAgY29uc3QgdGhpcmRJdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJ1RoaXJkJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0aGlyZEl0ZW1zW3RoaXJkSXRlbXMubGVuZ3RoIC0gMV0pXG5cbiAgICAgIGV4cGVjdChvblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgobnVtZXJpY0l0ZW1zWzJdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBpdGVtcyB3aXRoIGFkZGl0aW9uYWwgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1zV2l0aEV4dHJhOiBJdGVtW10gPSBbXG4gICAgICAgIHsgdmFsdWU6ICdhJywgbmFtZTogJ0l0ZW0gQScsIGN1c3RvbVByb3A6ICdleHRyYTEnIH0sXG4gICAgICAgIHsgdmFsdWU6ICdiJywgbmFtZTogJ0l0ZW0gQicsIGN1c3RvbVByb3A6ICdleHRyYTInIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJDaGlwKHsgdmFsdWU6ICdhJywgaXRlbXM6IGl0ZW1zV2l0aEV4dHJhIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdJdGVtIEEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBPcGVuIHBhbmVsIGFuZCBzZWxlY3QgSXRlbSBCXG4gICAgICBvcGVuUGFuZWwoY29udGFpbmVyKVxuXG4gICAgICBjb25zdCBpdGVtQnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdJdGVtIEInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGl0ZW1Cc1tpdGVtQnMubGVuZ3RoIC0gMV0pXG5cbiAgICAgIGV4cGVjdChvblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoaXRlbXNXaXRoRXh0cmFbMV0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=