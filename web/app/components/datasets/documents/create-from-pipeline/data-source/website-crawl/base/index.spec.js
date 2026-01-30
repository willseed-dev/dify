"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const checkbox_with_label_1 = require("./checkbox-with-label");
const crawled_result_1 = require("./crawled-result");
const crawled_result_item_1 = require("./crawled-result-item");
const crawling_1 = require("./crawling");
const error_message_1 = require("./error-message");
// ==========================================
// Test Data Builders
// ==========================================
const createMockCrawlResultItem = (overrides) => ({
    source_url: 'https://example.com/page1',
    title: 'Test Page Title',
    markdown: '# Test content',
    description: 'Test description',
    ...overrides,
});
const createMockCrawlResultItems = (count = 3) => {
    return Array.from({ length: count }, (_, i) => createMockCrawlResultItem({
        source_url: `https://example.com/page${i + 1}`,
        title: `Page ${i + 1}`,
    }));
};
// ==========================================
// CheckboxWithLabel Tests
// ==========================================
describe('CheckboxWithLabel', () => {
    const defaultProps = {
        isChecked: false,
        onChange: vi.fn(),
        label: 'Test Label',
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Test Label')).toBeInTheDocument();
        });
        it('should render checkbox in unchecked state', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps} isChecked={false}/>);
            // Assert - Custom checkbox component uses div with data-testid
            const checkbox = container.querySelector('[data-testid^="checkbox"]');
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).not.toHaveClass('bg-components-checkbox-bg');
        });
        it('should render checkbox in checked state', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps} isChecked={true}/>);
            // Assert - Checked state has check icon
            const checkIcon = container.querySelector('[data-testid^="check-icon"]');
            expect(checkIcon).toBeInTheDocument();
        });
        it('should render tooltip when provided', () => {
            // Arrange & Act
            (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps} tooltip="Helpful tooltip text"/>);
            // Assert - Tooltip trigger should be present
            const tooltipTrigger = document.querySelector('[class*="ml-0.5"]');
            expect(tooltipTrigger).toBeInTheDocument();
        });
        it('should not render tooltip when not provided', () => {
            // Arrange & Act
            (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps}/>);
            // Assert
            const tooltipTrigger = document.querySelector('[class*="ml-0.5"]');
            expect(tooltipTrigger).not.toBeInTheDocument();
        });
    });
    describe('Props', () => {
        it('should apply custom className', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps} className="custom-class"/>);
            // Assert
            const label = container.querySelector('label');
            expect(label).toHaveClass('custom-class');
        });
        it('should apply custom labelClassName', () => {
            // Arrange & Act
            (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps} labelClassName="custom-label-class"/>);
            // Assert
            const labelText = react_1.screen.getByText('Test Label');
            expect(labelText).toHaveClass('custom-label-class');
        });
    });
    describe('User Interactions', () => {
        it('should call onChange with true when clicking unchecked checkbox', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const { container } = (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps} isChecked={false} onChange={mockOnChange}/>);
            // Act
            const checkbox = container.querySelector('[data-testid^="checkbox"]');
            react_1.fireEvent.click(checkbox);
            // Assert
            expect(mockOnChange).toHaveBeenCalledWith(true);
        });
        it('should call onChange with false when clicking checked checkbox', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const { container } = (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps} isChecked={true} onChange={mockOnChange}/>);
            // Act
            const checkbox = container.querySelector('[data-testid^="checkbox"]');
            react_1.fireEvent.click(checkbox);
            // Assert
            expect(mockOnChange).toHaveBeenCalledWith(false);
        });
        it('should not trigger onChange when clicking label text due to custom checkbox', () => {
            // Arrange
            const mockOnChange = vi.fn();
            (0, react_1.render)(<checkbox_with_label_1.default {...defaultProps} onChange={mockOnChange}/>);
            // Act - Click on the label text element
            const labelText = react_1.screen.getByText('Test Label');
            react_1.fireEvent.click(labelText);
            // Assert - Custom checkbox does not support native label-input click forwarding
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });
});
// ==========================================
// CrawledResultItem Tests
// ==========================================
describe('CrawledResultItem', () => {
    const defaultProps = {
        payload: createMockCrawlResultItem(),
        isChecked: false,
        onCheckChange: vi.fn(),
        isPreview: false,
        showPreview: true,
        onPreview: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_item_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Test Page Title')).toBeInTheDocument();
            expect(react_1.screen.getByText('https://example.com/page1')).toBeInTheDocument();
        });
        it('should render checkbox when isMultipleChoice is true', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} isMultipleChoice={true}/>);
            // Assert - Custom checkbox uses data-testid
            const checkbox = container.querySelector('[data-testid^="checkbox"]');
            expect(checkbox).toBeInTheDocument();
        });
        it('should render radio when isMultipleChoice is false', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} isMultipleChoice={false}/>);
            // Assert - Radio component has size-4 rounded-full classes
            const radio = container.querySelector('.size-4.rounded-full');
            expect(radio).toBeInTheDocument();
        });
        it('should render checkbox as checked when isChecked is true', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} isChecked={true}/>);
            // Assert - Checked state shows check icon
            const checkIcon = container.querySelector('[data-testid^="check-icon"]');
            expect(checkIcon).toBeInTheDocument();
        });
        it('should render preview button when showPreview is true', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} showPreview={true}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should not render preview button when showPreview is false', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} showPreview={false}/>);
            // Assert
            expect(react_1.screen.queryByRole('button')).not.toBeInTheDocument();
        });
        it('should apply active background when isPreview is true', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} isPreview={true}/>);
            // Assert
            const item = container.firstChild;
            expect(item).toHaveClass('bg-state-base-active');
        });
        it('should apply hover styles when isPreview is false', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} isPreview={false}/>);
            // Assert
            const item = container.firstChild;
            expect(item).toHaveClass('group');
            expect(item).toHaveClass('hover:bg-state-base-hover');
        });
    });
    describe('Props', () => {
        it('should display payload title', () => {
            // Arrange
            const payload = createMockCrawlResultItem({ title: 'Custom Title' });
            // Act
            (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} payload={payload}/>);
            // Assert
            expect(react_1.screen.getByText('Custom Title')).toBeInTheDocument();
        });
        it('should display payload source_url', () => {
            // Arrange
            const payload = createMockCrawlResultItem({ source_url: 'https://custom.url/path' });
            // Act
            (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} payload={payload}/>);
            // Assert
            expect(react_1.screen.getByText('https://custom.url/path')).toBeInTheDocument();
        });
        it('should set title attribute for truncation tooltip', () => {
            // Arrange
            const payload = createMockCrawlResultItem({ title: 'Very Long Title' });
            // Act
            (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} payload={payload}/>);
            // Assert
            const titleElement = react_1.screen.getByText('Very Long Title');
            expect(titleElement).toHaveAttribute('title', 'Very Long Title');
        });
    });
    describe('User Interactions', () => {
        it('should call onCheckChange with true when clicking unchecked checkbox', () => {
            // Arrange
            const mockOnCheckChange = vi.fn();
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} isChecked={false} onCheckChange={mockOnCheckChange}/>);
            // Act
            const checkbox = container.querySelector('[data-testid^="checkbox"]');
            react_1.fireEvent.click(checkbox);
            // Assert
            expect(mockOnCheckChange).toHaveBeenCalledWith(true);
        });
        it('should call onCheckChange with false when clicking checked checkbox', () => {
            // Arrange
            const mockOnCheckChange = vi.fn();
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} isChecked={true} onCheckChange={mockOnCheckChange}/>);
            // Act
            const checkbox = container.querySelector('[data-testid^="checkbox"]');
            react_1.fireEvent.click(checkbox);
            // Assert
            expect(mockOnCheckChange).toHaveBeenCalledWith(false);
        });
        it('should call onPreview when clicking preview button', () => {
            // Arrange
            const mockOnPreview = vi.fn();
            (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} onPreview={mockOnPreview}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(mockOnPreview).toHaveBeenCalled();
        });
        it('should toggle radio state when isMultipleChoice is false', () => {
            // Arrange
            const mockOnCheckChange = vi.fn();
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...defaultProps} isMultipleChoice={false} isChecked={false} onCheckChange={mockOnCheckChange}/>);
            // Act - Radio uses size-4 rounded-full classes
            const radio = container.querySelector('.size-4.rounded-full');
            react_1.fireEvent.click(radio);
            // Assert
            expect(mockOnCheckChange).toHaveBeenCalledWith(true);
        });
    });
});
// ==========================================
// CrawledResult Tests
// ==========================================
describe('CrawledResult', () => {
    const defaultProps = {
        list: createMockCrawlResultItems(3),
        checkedList: [],
        onSelectedChange: vi.fn(),
        usedTime: 1.5,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps}/>);
            // Assert - Check for time info which contains total count
            expect(react_1.screen.getByText(/1.5/)).toBeInTheDocument();
        });
        it('should render all list items', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Page 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Page 3')).toBeInTheDocument();
        });
        it('should display scrape time info', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} usedTime={2.5}/>);
            // Assert - Check for the time display
            expect(react_1.screen.getByText(/2.5/)).toBeInTheDocument();
        });
        it('should render select all checkbox when isMultipleChoice is true', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} isMultipleChoice={true}/>);
            // Assert - Multiple custom checkboxes (select all + items)
            const checkboxes = container.querySelectorAll('[data-testid^="checkbox"]');
            expect(checkboxes.length).toBe(4); // 1 select all + 3 items
        });
        it('should not render select all checkbox when isMultipleChoice is false', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} isMultipleChoice={false}/>);
            // Assert - No select all checkbox, only radio buttons for items
            const checkboxes = container.querySelectorAll('[data-testid^="checkbox"]');
            expect(checkboxes.length).toBe(0);
            // Radio buttons have size-4 and rounded-full classes
            const radios = container.querySelectorAll('.size-4.rounded-full');
            expect(radios.length).toBe(3);
        });
        it('should show "Select All" when not all items are checked', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} checkedList={[]}/>);
            // Assert
            expect(react_1.screen.getByText(/selectAll|Select All/i)).toBeInTheDocument();
        });
        it('should show "Reset All" when all items are checked', () => {
            // Arrange
            const allChecked = createMockCrawlResultItems(3);
            // Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} checkedList={allChecked}/>);
            // Assert
            expect(react_1.screen.getByText(/resetAll|Reset All/i)).toBeInTheDocument();
        });
    });
    describe('Props', () => {
        it('should apply custom className', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} className="custom-class"/>);
            // Assert
            expect(container.firstChild).toHaveClass('custom-class');
        });
        it('should highlight item at previewIndex', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} previewIndex={1}/>);
            // Assert - Second item should have active state
            const items = container.querySelectorAll('[class*="rounded-lg"][class*="cursor-pointer"]');
            expect(items[1]).toHaveClass('bg-state-base-active');
        });
        it('should pass showPreview to items', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} showPreview={true}/>);
            // Assert - Preview buttons should be visible
            const buttons = react_1.screen.getAllByRole('button');
            expect(buttons.length).toBe(3);
        });
        it('should not show preview buttons when showPreview is false', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} showPreview={false}/>);
            // Assert
            expect(react_1.screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });
    describe('User Interactions', () => {
        it('should call onSelectedChange with all items when clicking select all', () => {
            // Arrange
            const mockOnSelectedChange = vi.fn();
            const list = createMockCrawlResultItems(3);
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={list} checkedList={[]} onSelectedChange={mockOnSelectedChange}/>);
            // Act - Click select all checkbox (first checkbox)
            const checkboxes = container.querySelectorAll('[data-testid^="checkbox"]');
            react_1.fireEvent.click(checkboxes[0]);
            // Assert
            expect(mockOnSelectedChange).toHaveBeenCalledWith(list);
        });
        it('should call onSelectedChange with empty array when clicking reset all', () => {
            // Arrange
            const mockOnSelectedChange = vi.fn();
            const list = createMockCrawlResultItems(3);
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={list} checkedList={list} onSelectedChange={mockOnSelectedChange}/>);
            // Act
            const checkboxes = container.querySelectorAll('[data-testid^="checkbox"]');
            react_1.fireEvent.click(checkboxes[0]);
            // Assert
            expect(mockOnSelectedChange).toHaveBeenCalledWith([]);
        });
        it('should add item to checkedList when checking unchecked item', () => {
            // Arrange
            const mockOnSelectedChange = vi.fn();
            const list = createMockCrawlResultItems(3);
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={list} checkedList={[list[0]]} onSelectedChange={mockOnSelectedChange}/>);
            // Act - Click second item checkbox (index 2, accounting for select all)
            const checkboxes = container.querySelectorAll('[data-testid^="checkbox"]');
            react_1.fireEvent.click(checkboxes[2]);
            // Assert
            expect(mockOnSelectedChange).toHaveBeenCalledWith([list[0], list[1]]);
        });
        it('should remove item from checkedList when unchecking checked item', () => {
            // Arrange
            const mockOnSelectedChange = vi.fn();
            const list = createMockCrawlResultItems(3);
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={list} checkedList={[list[0], list[1]]} onSelectedChange={mockOnSelectedChange}/>);
            // Act - Uncheck first item (index 1, after select all)
            const checkboxes = container.querySelectorAll('[data-testid^="checkbox"]');
            react_1.fireEvent.click(checkboxes[1]);
            // Assert
            expect(mockOnSelectedChange).toHaveBeenCalledWith([list[1]]);
        });
        it('should replace selection when checking in single choice mode', () => {
            // Arrange
            const mockOnSelectedChange = vi.fn();
            const list = createMockCrawlResultItems(3);
            const { container } = (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={list} checkedList={[list[0]]} onSelectedChange={mockOnSelectedChange} isMultipleChoice={false}/>);
            // Act - Click second item radio (Radio uses size-4 rounded-full classes)
            const radios = container.querySelectorAll('.size-4.rounded-full');
            react_1.fireEvent.click(radios[1]);
            // Assert - Should only select the clicked item
            expect(mockOnSelectedChange).toHaveBeenCalledWith([list[1]]);
        });
        it('should call onPreview with item and index when clicking preview', () => {
            // Arrange
            const mockOnPreview = vi.fn();
            const list = createMockCrawlResultItems(3);
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={list} onPreview={mockOnPreview} showPreview={true}/>);
            // Act
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[1]); // Second item's preview button
            // Assert
            expect(mockOnPreview).toHaveBeenCalledWith(list[1], 1);
        });
        it('should not crash when clicking preview without onPreview callback', () => {
            // Arrange - showPreview is true but onPreview is undefined
            const list = createMockCrawlResultItems(3);
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={list} onPreview={undefined} showPreview={true}/>);
            // Act - Click preview button should trigger early return in handlePreview
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[0]);
            // Assert - Should not throw error, component still renders
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty list', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={[]} usedTime={0.5}/>);
            // Assert - Should show time info with 0 count
            expect(react_1.screen.getByText(/0.5/)).toBeInTheDocument();
        });
        it('should handle single item list', () => {
            // Arrange
            const singleItem = [createMockCrawlResultItem()];
            // Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} list={singleItem}/>);
            // Assert
            expect(react_1.screen.getByText('Test Page Title')).toBeInTheDocument();
        });
        it('should format usedTime to one decimal place', () => {
            // Arrange & Act
            (0, react_1.render)(<crawled_result_1.default {...defaultProps} usedTime={1.567}/>);
            // Assert
            expect(react_1.screen.getByText(/1.6/)).toBeInTheDocument();
        });
    });
});
// ==========================================
// Crawling Tests
// ==========================================
describe('Crawling', () => {
    const defaultProps = {
        crawledNum: 5,
        totalNum: 10,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<crawling_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText(/5\/10/)).toBeInTheDocument();
        });
        it('should display crawled count and total', () => {
            // Arrange & Act
            (0, react_1.render)(<crawling_1.default crawledNum={3} totalNum={15}/>);
            // Assert
            expect(react_1.screen.getByText(/3\/15/)).toBeInTheDocument();
        });
        it('should render skeleton items', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawling_1.default {...defaultProps}/>);
            // Assert - Should have 3 skeleton items
            const skeletonItems = container.querySelectorAll('.px-2.py-\\[5px\\]');
            expect(skeletonItems.length).toBe(3);
        });
        it('should render header skeleton block', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawling_1.default {...defaultProps}/>);
            // Assert
            const headerBlocks = container.querySelectorAll('.px-4.py-2 .bg-text-quaternary');
            expect(headerBlocks.length).toBeGreaterThan(0);
        });
    });
    describe('Props', () => {
        it('should apply custom className', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawling_1.default {...defaultProps} className="custom-crawling-class"/>);
            // Assert
            expect(container.firstChild).toHaveClass('custom-crawling-class');
        });
        it('should handle zero values', () => {
            // Arrange & Act
            (0, react_1.render)(<crawling_1.default crawledNum={0} totalNum={0}/>);
            // Assert
            expect(react_1.screen.getByText(/0\/0/)).toBeInTheDocument();
        });
        it('should handle large numbers', () => {
            // Arrange & Act
            (0, react_1.render)(<crawling_1.default crawledNum={999} totalNum={1000}/>);
            // Assert
            expect(react_1.screen.getByText(/999\/1000/)).toBeInTheDocument();
        });
    });
    describe('Skeleton Structure', () => {
        it('should render blocks with correct width classes', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<crawling_1.default {...defaultProps}/>);
            // Assert - Check for various width classes
            expect(container.querySelector('.w-\\[35\\%\\]')).toBeInTheDocument();
            expect(container.querySelector('.w-\\[50\\%\\]')).toBeInTheDocument();
            expect(container.querySelector('.w-\\[40\\%\\]')).toBeInTheDocument();
        });
    });
});
// ==========================================
// ErrorMessage Tests
// ==========================================
describe('ErrorMessage', () => {
    const defaultProps = {
        title: 'Error Title',
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<error_message_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Error Title')).toBeInTheDocument();
        });
        it('should render error icon', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<error_message_1.default {...defaultProps}/>);
            // Assert
            const icon = container.querySelector('svg');
            expect(icon).toBeInTheDocument();
            expect(icon).toHaveClass('text-text-destructive');
        });
        it('should render title', () => {
            // Arrange & Act
            (0, react_1.render)(<error_message_1.default title="Custom Error Title"/>);
            // Assert
            expect(react_1.screen.getByText('Custom Error Title')).toBeInTheDocument();
        });
        it('should render error message when provided', () => {
            // Arrange & Act
            (0, react_1.render)(<error_message_1.default {...defaultProps} errorMsg="Detailed error description"/>);
            // Assert
            expect(react_1.screen.getByText('Detailed error description')).toBeInTheDocument();
        });
        it('should not render error message when not provided', () => {
            // Arrange & Act
            (0, react_1.render)(<error_message_1.default {...defaultProps}/>);
            // Assert - Should only have title, not error message container
            const textElements = react_1.screen.getAllByText(/Error Title/);
            expect(textElements.length).toBe(1);
        });
    });
    describe('Props', () => {
        it('should apply custom className', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<error_message_1.default {...defaultProps} className="custom-error-class"/>);
            // Assert
            expect(container.firstChild).toHaveClass('custom-error-class');
        });
        it('should render with empty errorMsg', () => {
            // Arrange & Act
            (0, react_1.render)(<error_message_1.default {...defaultProps} errorMsg=""/>);
            // Assert - Empty string should not render message div
            expect(react_1.screen.getByText('Error Title')).toBeInTheDocument();
        });
        it('should handle long title text', () => {
            // Arrange
            const longTitle = 'This is a very long error title that might wrap to multiple lines';
            // Act
            (0, react_1.render)(<error_message_1.default title={longTitle}/>);
            // Assert
            expect(react_1.screen.getByText(longTitle)).toBeInTheDocument();
        });
        it('should handle long error message', () => {
            // Arrange
            const longErrorMsg = 'This is a very detailed error message explaining what went wrong and how to fix it. It contains multiple sentences.';
            // Act
            (0, react_1.render)(<error_message_1.default {...defaultProps} errorMsg={longErrorMsg}/>);
            // Assert
            expect(react_1.screen.getByText(longErrorMsg)).toBeInTheDocument();
        });
    });
    describe('Styling', () => {
        it('should have error background styling', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<error_message_1.default {...defaultProps}/>);
            // Assert
            expect(container.firstChild).toHaveClass('bg-toast-error-bg');
        });
        it('should have border styling', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<error_message_1.default {...defaultProps}/>);
            // Assert
            expect(container.firstChild).toHaveClass('border-components-panel-border');
        });
        it('should have rounded corners', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<error_message_1.default {...defaultProps}/>);
            // Assert
            expect(container.firstChild).toHaveClass('rounded-xl');
        });
    });
});
// ==========================================
// Integration Tests
// ==========================================
describe('Base Components Integration', () => {
    it('should render CrawledResult with CrawledResultItem children', () => {
        // Arrange
        const list = createMockCrawlResultItems(2);
        // Act
        (0, react_1.render)(<crawled_result_1.default list={list} checkedList={[]} onSelectedChange={vi.fn()} usedTime={1.0}/>);
        // Assert - Both items should render
        expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
        expect(react_1.screen.getByText('Page 2')).toBeInTheDocument();
    });
    it('should render CrawledResult with CheckboxWithLabel for select all', () => {
        // Arrange
        const list = createMockCrawlResultItems(2);
        // Act
        const { container } = (0, react_1.render)(<crawled_result_1.default list={list} checkedList={[]} onSelectedChange={vi.fn()} usedTime={1.0} isMultipleChoice={true}/>);
        // Assert - Should have select all checkbox + item checkboxes
        const checkboxes = container.querySelectorAll('[data-testid^="checkbox"]');
        expect(checkboxes.length).toBe(3); // select all + 2 items
    });
    it('should allow selecting and previewing items', () => {
        // Arrange
        const list = createMockCrawlResultItems(3);
        const mockOnSelectedChange = vi.fn();
        const mockOnPreview = vi.fn();
        const { container } = (0, react_1.render)(<crawled_result_1.default list={list} checkedList={[]} onSelectedChange={mockOnSelectedChange} onPreview={mockOnPreview} showPreview={true} usedTime={1.0}/>);
        // Act - Select first item (index 1, after select all)
        const checkboxes = container.querySelectorAll('[data-testid^="checkbox"]');
        react_1.fireEvent.click(checkboxes[1]);
        // Assert
        expect(mockOnSelectedChange).toHaveBeenCalledWith([list[0]]);
        // Act - Preview second item
        const previewButtons = react_1.screen.getAllByRole('button');
        react_1.fireEvent.click(previewButtons[1]);
        // Assert
        expect(mockOnPreview).toHaveBeenCalledWith(list[1], 1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QiwrREFBcUQ7QUFDckQscURBQTRDO0FBQzVDLCtEQUFxRDtBQUNyRCx5Q0FBaUM7QUFDakMsbURBQTBDO0FBRTFDLDZDQUE2QztBQUM3QyxxQkFBcUI7QUFDckIsNkNBQTZDO0FBRTdDLE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxTQUF3QyxFQUF1QixFQUFFLENBQUMsQ0FBQztJQUNwRyxVQUFVLEVBQUUsMkJBQTJCO0lBQ3ZDLEtBQUssRUFBRSxpQkFBaUI7SUFDeEIsUUFBUSxFQUFFLGdCQUFnQjtJQUMxQixXQUFXLEVBQUUsa0JBQWtCO0lBQy9CLEdBQUcsU0FBUztDQUNiLENBQUMsQ0FBQTtBQUVGLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUF5QixFQUFFO0lBQ3RFLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUM1Qyx5QkFBeUIsQ0FBQztRQUN4QixVQUFVLEVBQUUsMkJBQTJCLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtLQUN2QixDQUFDLENBQUMsQ0FBQTtBQUNQLENBQUMsQ0FBQTtBQUVELDZDQUE2QztBQUM3QywwQkFBMEI7QUFDMUIsNkNBQTZDO0FBQzdDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDakMsTUFBTSxZQUFZLEdBQUc7UUFDbkIsU0FBUyxFQUFFLEtBQUs7UUFDaEIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakIsS0FBSyxFQUFFLFlBQVk7S0FDcEIsQ0FBQTtJQUVELFVBQVUsQ0FBQyxHQUFH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LFFBQVEsQ0FBQyxDQUFBO1FBQ3BELGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRWxDLFNBQVM7UUFDVCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3hELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENyYXdsUmVzdWx0SXRlbSBhcyBDcmF3bFJlc3VsdEl0ZW1UeXBlIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IENoZWNrYm94V2l0aExhYmVsIGZyb20gJy4vY2hlY2tib3gtd2l0aC1sYWJlbCdcbmltcG9ydCBDcmF3bGVkUmVzdWx0IGZyb20gJy4vY3Jhd2xlZC1yZXN1bHQnXG5pbXBvcnQgQ3Jhd2xlZFJlc3VsdEl0ZW0gZnJvbSAnLi9jcmF3bGVkLXJlc3VsdC1pdGVtJ1xuaW1wb3J0IENyYXdsaW5nIGZyb20gJy4vY3Jhd2xpbmcnXG5pbXBvcnQgRXJyb3JNZXNzYWdlIGZyb20gJy4vZXJyb3ItbWVzc2FnZSdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgQnVpbGRlcnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8Q3Jhd2xSZXN1bHRJdGVtVHlwZT4pOiBDcmF3bFJlc3VsdEl0ZW1UeXBlID0+ICh7XG4gIHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tL3BhZ2UxJyxcbiAgdGl0bGU6ICdUZXN0IFBhZ2UgVGl0bGUnLFxuICBtYXJrZG93bjogJyMgVGVzdCBjb250ZW50JyxcbiAgZGVzY3JpcHRpb246ICdUZXN0IGRlc2NyaXB0aW9uJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbXMgPSAoY291bnQgPSAzKTogQ3Jhd2xSZXN1bHRJdGVtVHlwZVtdID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PlxuICAgIGNyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oe1xuICAgICAgc291cmNlX3VybDogYGh0dHBzOi8vZXhhbXBsZS5jb20vcGFnZSR7aSArIDF9YCxcbiAgICAgIHRpdGxlOiBgUGFnZSAke2kgKyAxfWAsXG4gICAgfSkpXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ2hlY2tib3hXaXRoTGFiZWwgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0NoZWNrYm94V2l0aExhYmVsJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgaXNDaGVja2VkOiBmYWxzZSxcbiAgICBvbkNoYW5nZTogdmkuZm4oKSxcbiAgICBsYWJlbDogJ1Rlc3QgTGFiZWwnLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDaGVja2JveFdpdGhMYWJlbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBMYWJlbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoZWNrYm94IGluIHVuY2hlY2tlZCBzdGF0ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENoZWNrYm94V2l0aExhYmVsIHsuLi5kZWZhdWx0UHJvcHN9IGlzQ2hlY2tlZD17ZmFsc2V9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDdXN0b20gY2hlY2tib3ggY29tcG9uZW50IHVzZXMgZGl2IHdpdGggZGF0YS10ZXN0aWRcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZF49XCJjaGVja2JveFwiXScpXG4gICAgICBleHBlY3QoY2hlY2tib3gpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjaGVja2JveCkubm90LnRvSGF2ZUNsYXNzKCdiZy1jb21wb25lbnRzLWNoZWNrYm94LWJnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2hlY2tib3ggaW4gY2hlY2tlZCBzdGF0ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENoZWNrYm94V2l0aExhYmVsIHsuLi5kZWZhdWx0UHJvcHN9IGlzQ2hlY2tlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrZWQgc3RhdGUgaGFzIGNoZWNrIGljb25cbiAgICAgIGNvbnN0IGNoZWNrSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWRePVwiY2hlY2staWNvblwiXScpXG4gICAgICBleHBlY3QoY2hlY2tJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRvb2x0aXAgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8Q2hlY2tib3hXaXRoTGFiZWwgey4uLmRlZmF1bHRQcm9wc30gdG9vbHRpcD1cIkhlbHBmdWwgdG9vbHRpcCB0ZXh0XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFRvb2x0aXAgdHJpZ2dlciBzaG91bGQgYmUgcHJlc2VudFxuICAgICAgY29uc3QgdG9vbHRpcFRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwibWwtMC41XCJdJylcbiAgICAgIGV4cGVjdCh0b29sdGlwVHJpZ2dlcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgdG9vbHRpcCB3aGVuIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8Q2hlY2tib3hXaXRoTGFiZWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdG9vbHRpcFRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwibWwtMC41XCJdJylcbiAgICAgIGV4cGVjdCh0b29sdGlwVHJpZ2dlcikubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8Q2hlY2tib3hXaXRoTGFiZWwgey4uLmRlZmF1bHRQcm9wc30gY2xhc3NOYW1lPVwiY3VzdG9tLWNsYXNzXCIgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGFiZWwgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignbGFiZWwnKVxuICAgICAgZXhwZWN0KGxhYmVsKS50b0hhdmVDbGFzcygnY3VzdG9tLWNsYXNzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gbGFiZWxDbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPENoZWNrYm94V2l0aExhYmVsIHsuLi5kZWZhdWx0UHJvcHN9IGxhYmVsQ2xhc3NOYW1lPVwiY3VzdG9tLWxhYmVsLWNsYXNzXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGFiZWxUZXh0ID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBMYWJlbCcpXG4gICAgICBleHBlY3QobGFiZWxUZXh0KS50b0hhdmVDbGFzcygnY3VzdG9tLWxhYmVsLWNsYXNzJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2l0aCB0cnVlIHdoZW4gY2xpY2tpbmcgdW5jaGVja2VkIGNoZWNrYm94JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q2hlY2tib3hXaXRoTGFiZWwgey4uLmRlZmF1bHRQcm9wc30gaXNDaGVja2VkPXtmYWxzZX0gb25DaGFuZ2U9e21vY2tPbkNoYW5nZX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgY2hlY2tib3ggPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtdGVzdGlkXj1cImNoZWNrYm94XCJdJykhXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2hlY2tib3gpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggZmFsc2Ugd2hlbiBjbGlja2luZyBjaGVja2VkIGNoZWNrYm94JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q2hlY2tib3hXaXRoTGFiZWwgey4uLmRlZmF1bHRQcm9wc30gaXNDaGVja2VkPXt0cnVlfSBvbkNoYW5nZT17bW9ja09uQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjaGVja2JveCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWRePVwiY2hlY2tib3hcIl0nKSFcbiAgICAgIGZpcmVFdmVudC5jbGljayhjaGVja2JveClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdHJpZ2dlciBvbkNoYW5nZSB3aGVuIGNsaWNraW5nIGxhYmVsIHRleHQgZHVlIHRvIGN1c3RvbSBjaGVja2JveCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8Q2hlY2tib3hXaXRoTGFiZWwgey4uLmRlZmF1bHRQcm9wc30gb25DaGFuZ2U9e21vY2tPbkNoYW5nZX0gLz4pXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIG9uIHRoZSBsYWJlbCB0ZXh0IGVsZW1lbnRcbiAgICAgIGNvbnN0IGxhYmVsVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgTGFiZWwnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGxhYmVsVGV4dClcblxuICAgICAgLy8gQXNzZXJ0IC0gQ3VzdG9tIGNoZWNrYm94IGRvZXMgbm90IHN1cHBvcnQgbmF0aXZlIGxhYmVsLWlucHV0IGNsaWNrIGZvcndhcmRpbmdcbiAgICAgIGV4cGVjdChtb2NrT25DaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDcmF3bGVkUmVzdWx0SXRlbSBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnQ3Jhd2xlZFJlc3VsdEl0ZW0nLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBwYXlsb2FkOiBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKCksXG4gICAgaXNDaGVja2VkOiBmYWxzZSxcbiAgICBvbkNoZWNrQ2hhbmdlOiB2aS5mbigpLFxuICAgIGlzUHJldmlldzogZmFsc2UsXG4gICAgc2hvd1ByZXZpZXc6IHRydWUsXG4gICAgb25QcmV2aWV3OiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBQYWdlIFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL2V4YW1wbGUuY29tL3BhZ2UxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2hlY2tib3ggd2hlbiBpc011bHRpcGxlQ2hvaWNlIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDcmF3bGVkUmVzdWx0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSBpc011bHRpcGxlQ2hvaWNlPXt0cnVlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ3VzdG9tIGNoZWNrYm94IHVzZXMgZGF0YS10ZXN0aWRcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZF49XCJjaGVja2JveFwiXScpXG4gICAgICBleHBlY3QoY2hlY2tib3gpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcmFkaW8gd2hlbiBpc011bHRpcGxlQ2hvaWNlIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q3Jhd2xlZFJlc3VsdEl0ZW0gey4uLmRlZmF1bHRQcm9wc30gaXNNdWx0aXBsZUNob2ljZT17ZmFsc2V9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBSYWRpbyBjb21wb25lbnQgaGFzIHNpemUtNCByb3VuZGVkLWZ1bGwgY2xhc3Nlc1xuICAgICAgY29uc3QgcmFkaW8gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNpemUtNC5yb3VuZGVkLWZ1bGwnKVxuICAgICAgZXhwZWN0KHJhZGlvKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoZWNrYm94IGFzIGNoZWNrZWQgd2hlbiBpc0NoZWNrZWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5kZWZhdWx0UHJvcHN9IGlzQ2hlY2tlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrZWQgc3RhdGUgc2hvd3MgY2hlY2sgaWNvblxuICAgICAgY29uc3QgY2hlY2tJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZF49XCJjaGVjay1pY29uXCJdJylcbiAgICAgIGV4cGVjdChjaGVja0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcHJldmlldyBidXR0b24gd2hlbiBzaG93UHJldmlldyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSBzaG93UHJldmlldz17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBwcmV2aWV3IGJ1dHRvbiB3aGVuIHNob3dQcmV2aWV3IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSBzaG93UHJldmlldz17ZmFsc2V9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGFjdGl2ZSBiYWNrZ3JvdW5kIHdoZW4gaXNQcmV2aWV3IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDcmF3bGVkUmVzdWx0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSBpc1ByZXZpZXc9e3RydWV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGl0ZW0gPSBjb250YWluZXIuZmlyc3RDaGlsZFxuICAgICAgZXhwZWN0KGl0ZW0pLnRvSGF2ZUNsYXNzKCdiZy1zdGF0ZS1iYXNlLWFjdGl2ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaG92ZXIgc3R5bGVzIHdoZW4gaXNQcmV2aWV3IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q3Jhd2xlZFJlc3VsdEl0ZW0gey4uLmRlZmF1bHRQcm9wc30gaXNQcmV2aWV3PXtmYWxzZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaXRlbSA9IGNvbnRhaW5lci5maXJzdENoaWxkXG4gICAgICBleHBlY3QoaXRlbSkudG9IYXZlQ2xhc3MoJ2dyb3VwJylcbiAgICAgIGV4cGVjdChpdGVtKS50b0hhdmVDbGFzcygnaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlcicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHBheWxvYWQgdGl0bGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSh7IHRpdGxlOiAnQ3VzdG9tIFRpdGxlJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3Jhd2xlZFJlc3VsdEl0ZW0gey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0N1c3RvbSBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBwYXlsb2FkIHNvdXJjZV91cmwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL2N1c3RvbS51cmwvcGF0aCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL2N1c3RvbS51cmwvcGF0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IHRpdGxlIGF0dHJpYnV0ZSBmb3IgdHJ1bmNhdGlvbiB0b29sdGlwJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oeyB0aXRsZTogJ1ZlcnkgTG9uZyBUaXRsZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRpdGxlRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ1ZlcnkgTG9uZyBUaXRsZScpXG4gICAgICBleHBlY3QodGl0bGVFbGVtZW50KS50b0hhdmVBdHRyaWJ1dGUoJ3RpdGxlJywgJ1ZlcnkgTG9uZyBUaXRsZScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hlY2tDaGFuZ2Ugd2l0aCB0cnVlIHdoZW4gY2xpY2tpbmcgdW5jaGVja2VkIGNoZWNrYm94JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hlY2tDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8Q3Jhd2xlZFJlc3VsdEl0ZW1cbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGlzQ2hlY2tlZD17ZmFsc2V9XG4gICAgICAgICAgb25DaGVja0NoYW5nZT17bW9ja09uQ2hlY2tDaGFuZ2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZF49XCJjaGVja2JveFwiXScpIVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DaGVja0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hlY2tDaGFuZ2Ugd2l0aCBmYWxzZSB3aGVuIGNsaWNraW5nIGNoZWNrZWQgY2hlY2tib3gnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DaGVja0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxDcmF3bGVkUmVzdWx0SXRlbVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNDaGVja2VkPXt0cnVlfVxuICAgICAgICAgIG9uQ2hlY2tDaGFuZ2U9e21vY2tPbkNoZWNrQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjaGVja2JveCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWRePVwiY2hlY2tib3hcIl0nKSFcbiAgICAgIGZpcmVFdmVudC5jbGljayhjaGVja2JveClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ2hlY2tDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25QcmV2aWV3IHdoZW4gY2xpY2tpbmcgcHJldmlldyBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25QcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0SXRlbSB7Li4uZGVmYXVsdFByb3BzfSBvblByZXZpZXc9e21vY2tPblByZXZpZXd9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uUHJldmlldykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdG9nZ2xlIHJhZGlvIHN0YXRlIHdoZW4gaXNNdWx0aXBsZUNob2ljZSBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNoZWNrQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENyYXdsZWRSZXN1bHRJdGVtXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc011bHRpcGxlQ2hvaWNlPXtmYWxzZX1cbiAgICAgICAgICBpc0NoZWNrZWQ9e2ZhbHNlfVxuICAgICAgICAgIG9uQ2hlY2tDaGFuZ2U9e21vY2tPbkNoZWNrQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0IC0gUmFkaW8gdXNlcyBzaXplLTQgcm91bmRlZC1mdWxsIGNsYXNzZXNcbiAgICAgIGNvbnN0IHJhZGlvID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zaXplLTQucm91bmRlZC1mdWxsJykhXG4gICAgICBmaXJlRXZlbnQuY2xpY2socmFkaW8pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNoZWNrQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENyYXdsZWRSZXN1bHQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0NyYXdsZWRSZXN1bHQnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBsaXN0OiBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtcygzKSxcbiAgICBjaGVja2VkTGlzdDogW10gYXMgQ3Jhd2xSZXN1bHRJdGVtVHlwZVtdLFxuICAgIG9uU2VsZWN0ZWRDaGFuZ2U6IHZpLmZuKCksXG4gICAgdXNlZFRpbWU6IDEuNSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8Q3Jhd2xlZFJlc3VsdCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgZm9yIHRpbWUgaW5mbyB3aGljaCBjb250YWlucyB0b3RhbCBjb3VudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzEuNS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBsaXN0IGl0ZW1zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQYWdlIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHNjcmFwZSB0aW1lIGluZm8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLmRlZmF1bHRQcm9wc30gdXNlZFRpbWU9ezIuNX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIGZvciB0aGUgdGltZSBkaXNwbGF5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMi41LykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc2VsZWN0IGFsbCBjaGVja2JveCB3aGVuIGlzTXVsdGlwbGVDaG9pY2UgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLmRlZmF1bHRQcm9wc30gaXNNdWx0aXBsZUNob2ljZT17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE11bHRpcGxlIGN1c3RvbSBjaGVja2JveGVzIChzZWxlY3QgYWxsICsgaXRlbXMpXG4gICAgICBjb25zdCBjaGVja2JveGVzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRlc3RpZF49XCJjaGVja2JveFwiXScpXG4gICAgICBleHBlY3QoY2hlY2tib3hlcy5sZW5ndGgpLnRvQmUoNCkgLy8gMSBzZWxlY3QgYWxsICsgMyBpdGVtc1xuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgc2VsZWN0IGFsbCBjaGVja2JveCB3aGVuIGlzTXVsdGlwbGVDaG9pY2UgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDcmF3bGVkUmVzdWx0IHsuLi5kZWZhdWx0UHJvcHN9IGlzTXVsdGlwbGVDaG9pY2U9e2ZhbHNlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTm8gc2VsZWN0IGFsbCBjaGVja2JveCwgb25seSByYWRpbyBidXR0b25zIGZvciBpdGVtc1xuICAgICAgY29uc3QgY2hlY2tib3hlcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10ZXN0aWRePVwiY2hlY2tib3hcIl0nKVxuICAgICAgZXhwZWN0KGNoZWNrYm94ZXMubGVuZ3RoKS50b0JlKDApXG4gICAgICAvLyBSYWRpbyBidXR0b25zIGhhdmUgc2l6ZS00IGFuZCByb3VuZGVkLWZ1bGwgY2xhc3Nlc1xuICAgICAgY29uc3QgcmFkaW9zID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaXplLTQucm91bmRlZC1mdWxsJylcbiAgICAgIGV4cGVjdChyYWRpb3MubGVuZ3RoKS50b0JlKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBcIlNlbGVjdCBBbGxcIiB3aGVuIG5vdCBhbGwgaXRlbXMgYXJlIGNoZWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLmRlZmF1bHRQcm9wc30gY2hlY2tlZExpc3Q9e1tdfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvc2VsZWN0QWxsfFNlbGVjdCBBbGwvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IFwiUmVzZXQgQWxsXCIgd2hlbiBhbGwgaXRlbXMgYXJlIGNoZWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBhbGxDaGVja2VkID0gY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbXMoMylcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLmRlZmF1bHRQcm9wc30gY2hlY2tlZExpc3Q9e2FsbENoZWNrZWR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9yZXNldEFsbHxSZXNldCBBbGwvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8Q3Jhd2xlZFJlc3VsdCB7Li4uZGVmYXVsdFByb3BzfSBjbGFzc05hbWU9XCJjdXN0b20tY2xhc3NcIiAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdjdXN0b20tY2xhc3MnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhpZ2hsaWdodCBpdGVtIGF0IHByZXZpZXdJbmRleCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxDcmF3bGVkUmVzdWx0IHsuLi5kZWZhdWx0UHJvcHN9IHByZXZpZXdJbmRleD17MX0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIFNlY29uZCBpdGVtIHNob3VsZCBoYXZlIGFjdGl2ZSBzdGF0ZVxuICAgICAgY29uc3QgaXRlbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW2NsYXNzKj1cInJvdW5kZWQtbGdcIl1bY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgZXhwZWN0KGl0ZW1zWzFdKS50b0hhdmVDbGFzcygnYmctc3RhdGUtYmFzZS1hY3RpdmUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3Mgc2hvd1ByZXZpZXcgdG8gaXRlbXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLmRlZmF1bHRQcm9wc30gc2hvd1ByZXZpZXc9e3RydWV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBQcmV2aWV3IGJ1dHRvbnMgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnMubGVuZ3RoKS50b0JlKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgcHJldmlldyBidXR0b25zIHdoZW4gc2hvd1ByZXZpZXcgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLmRlZmF1bHRQcm9wc30gc2hvd1ByZXZpZXc9e2ZhbHNlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdidXR0b24nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3RlZENoYW5nZSB3aXRoIGFsbCBpdGVtcyB3aGVuIGNsaWNraW5nIHNlbGVjdCBhbGwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3RlZENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxpc3QgPSBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtcygzKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENyYXdsZWRSZXN1bHRcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGxpc3Q9e2xpc3R9XG4gICAgICAgICAgY2hlY2tlZExpc3Q9e1tdfVxuICAgICAgICAgIG9uU2VsZWN0ZWRDaGFuZ2U9e21vY2tPblNlbGVjdGVkQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0IC0gQ2xpY2sgc2VsZWN0IGFsbCBjaGVja2JveCAoZmlyc3QgY2hlY2tib3gpXG4gICAgICBjb25zdCBjaGVja2JveGVzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRlc3RpZF49XCJjaGVja2JveFwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2hlY2tib3hlc1swXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0ZWRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGxpc3QpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblNlbGVjdGVkQ2hhbmdlIHdpdGggZW1wdHkgYXJyYXkgd2hlbiBjbGlja2luZyByZXNldCBhbGwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3RlZENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxpc3QgPSBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtcygzKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENyYXdsZWRSZXN1bHRcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGxpc3Q9e2xpc3R9XG4gICAgICAgICAgY2hlY2tlZExpc3Q9e2xpc3R9XG4gICAgICAgICAgb25TZWxlY3RlZENoYW5nZT17bW9ja09uU2VsZWN0ZWRDaGFuZ2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGNoZWNrYm94ZXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdGVzdGlkXj1cImNoZWNrYm94XCJdJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjaGVja2JveGVzWzBdKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RlZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWRkIGl0ZW0gdG8gY2hlY2tlZExpc3Qgd2hlbiBjaGVja2luZyB1bmNoZWNrZWQgaXRlbScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPblNlbGVjdGVkQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbGlzdCA9IGNyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW1zKDMpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8Q3Jhd2xlZFJlc3VsdFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgbGlzdD17bGlzdH1cbiAgICAgICAgICBjaGVja2VkTGlzdD17W2xpc3RbMF1dfVxuICAgICAgICAgIG9uU2VsZWN0ZWRDaGFuZ2U9e21vY2tPblNlbGVjdGVkQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQWN0IC0gQ2xpY2sgc2Vjb25kIGl0ZW0gY2hlY2tib3ggKGluZGV4IDIsIGFjY291bnRpbmcgZm9yIHNlbGVjdCBhbGwpXG4gICAgICBjb25zdCBjaGVja2JveGVzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRlc3RpZF49XCJjaGVja2JveFwiXScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2hlY2tib3hlc1syXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uU2VsZWN0ZWRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtsaXN0WzBdLCBsaXN0WzFdXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW1vdmUgaXRlbSBmcm9tIGNoZWNrZWRMaXN0IHdoZW4gdW5jaGVja2luZyBjaGVja2VkIGl0ZW0nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25TZWxlY3RlZENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxpc3QgPSBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtcygzKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENyYXdsZWRSZXN1bHRcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGxpc3Q9e2xpc3R9XG4gICAgICAgICAgY2hlY2tlZExpc3Q9e1tsaXN0WzBdLCBsaXN0WzFdXX1cbiAgICAgICAgICBvblNlbGVjdGVkQ2hhbmdlPXttb2NrT25TZWxlY3RlZENoYW5nZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFjdCAtIFVuY2hlY2sgZmlyc3QgaXRlbSAoaW5kZXggMSwgYWZ0ZXIgc2VsZWN0IGFsbClcbiAgICAgIGNvbnN0IGNoZWNrYm94ZXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdGVzdGlkXj1cImNoZWNrYm94XCJdJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjaGVja2JveGVzWzFdKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RlZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW2xpc3RbMV1dKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlcGxhY2Ugc2VsZWN0aW9uIHdoZW4gY2hlY2tpbmcgaW4gc2luZ2xlIGNob2ljZSBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uU2VsZWN0ZWRDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBsaXN0ID0gY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbXMoMylcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxDcmF3bGVkUmVzdWx0XG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBsaXN0PXtsaXN0fVxuICAgICAgICAgIGNoZWNrZWRMaXN0PXtbbGlzdFswXV19XG4gICAgICAgICAgb25TZWxlY3RlZENoYW5nZT17bW9ja09uU2VsZWN0ZWRDaGFuZ2V9XG4gICAgICAgICAgaXNNdWx0aXBsZUNob2ljZT17ZmFsc2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBzZWNvbmQgaXRlbSByYWRpbyAoUmFkaW8gdXNlcyBzaXplLTQgcm91bmRlZC1mdWxsIGNsYXNzZXMpXG4gICAgICBjb25zdCByYWRpb3MgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnNpemUtNC5yb3VuZGVkLWZ1bGwnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJhZGlvc1sxXSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIG9ubHkgc2VsZWN0IHRoZSBjbGlja2VkIGl0ZW1cbiAgICAgIGV4cGVjdChtb2NrT25TZWxlY3RlZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW2xpc3RbMV1dKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25QcmV2aWV3IHdpdGggaXRlbSBhbmQgaW5kZXggd2hlbiBjbGlja2luZyBwcmV2aWV3JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uUHJldmlldyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxpc3QgPSBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtcygzKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q3Jhd2xlZFJlc3VsdFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgbGlzdD17bGlzdH1cbiAgICAgICAgICBvblByZXZpZXc9e21vY2tPblByZXZpZXd9XG4gICAgICAgICAgc2hvd1ByZXZpZXc9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbnNbMV0pIC8vIFNlY29uZCBpdGVtJ3MgcHJldmlldyBidXR0b25cblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFdpdGgobGlzdFsxXSwgMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY3Jhc2ggd2hlbiBjbGlja2luZyBwcmV2aWV3IHdpdGhvdXQgb25QcmV2aWV3IGNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIHNob3dQcmV2aWV3IGlzIHRydWUgYnV0IG9uUHJldmlldyBpcyB1bmRlZmluZWRcbiAgICAgIGNvbnN0IGxpc3QgPSBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtcygzKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q3Jhd2xlZFJlc3VsdFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgbGlzdD17bGlzdH1cbiAgICAgICAgICBvblByZXZpZXc9e3VuZGVmaW5lZH1cbiAgICAgICAgICBzaG93UHJldmlldz17dHJ1ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFjdCAtIENsaWNrIHByZXZpZXcgYnV0dG9uIHNob3VsZCB0cmlnZ2VyIGVhcmx5IHJldHVybiBpbiBoYW5kbGVQcmV2aWV3XG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhidXR0b25zWzBdKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IHRocm93IGVycm9yLCBjb21wb25lbnQgc3RpbGwgcmVuZGVyc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBsaXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0IHsuLi5kZWZhdWx0UHJvcHN9IGxpc3Q9e1tdfSB1c2VkVGltZT17MC41fSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgdGltZSBpbmZvIHdpdGggMCBjb3VudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzAuNS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNpbmdsZSBpdGVtIGxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzaW5nbGVJdGVtID0gW2NyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oKV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLmRlZmF1bHRQcm9wc30gbGlzdD17c2luZ2xlSXRlbX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgUGFnZSBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZm9ybWF0IHVzZWRUaW1lIHRvIG9uZSBkZWNpbWFsIHBsYWNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0IHsuLi5kZWZhdWx0UHJvcHN9IHVzZWRUaW1lPXsxLjU2N30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzEuNi8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ3Jhd2xpbmcgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0NyYXdsaW5nJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgY3Jhd2xlZE51bTogNSxcbiAgICB0b3RhbE51bTogMTAsXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPENyYXdsaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC81XFwvMTAvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY3Jhd2xlZCBjb3VudCBhbmQgdG90YWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPENyYXdsaW5nIGNyYXdsZWROdW09ezN9IHRvdGFsTnVtPXsxNX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzNcXC8xNS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNrZWxldG9uIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q3Jhd2xpbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBoYXZlIDMgc2tlbGV0b24gaXRlbXNcbiAgICAgIGNvbnN0IHNrZWxldG9uSXRlbXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnB4LTIucHktXFxcXFs1cHhcXFxcXScpXG4gICAgICBleHBlY3Qoc2tlbGV0b25JdGVtcy5sZW5ndGgpLnRvQmUoMylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaGVhZGVyIHNrZWxldG9uIGJsb2NrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q3Jhd2xpbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaGVhZGVyQmxvY2tzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5weC00LnB5LTIgLmJnLXRleHQtcXVhdGVybmFyeScpXG4gICAgICBleHBlY3QoaGVhZGVyQmxvY2tzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gY2xhc3NOYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENyYXdsaW5nIHsuLi5kZWZhdWx0UHJvcHN9IGNsYXNzTmFtZT1cImN1c3RvbS1jcmF3bGluZy1jbGFzc1wiIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ2N1c3RvbS1jcmF3bGluZy1jbGFzcycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHplcm8gdmFsdWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxDcmF3bGluZyBjcmF3bGVkTnVtPXswfSB0b3RhbE51bT17MH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzBcXC8wLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgbnVtYmVycycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8Q3Jhd2xpbmcgY3Jhd2xlZE51bT17OTk5fSB0b3RhbE51bT17MTAwMH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzk5OVxcLzEwMDAvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NrZWxldG9uIFN0cnVjdHVyZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBibG9ja3Mgd2l0aCBjb3JyZWN0IHdpZHRoIGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDcmF3bGluZyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgZm9yIHZhcmlvdXMgd2lkdGggY2xhc3Nlc1xuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudy1cXFxcWzM1XFxcXCVcXFxcXScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy53LVxcXFxbNTBcXFxcJVxcXFxdJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnctXFxcXFs0MFxcXFwlXFxcXF0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVycm9yTWVzc2FnZSBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRXJyb3JNZXNzYWdlJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdGl0bGU6ICdFcnJvciBUaXRsZScsXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEVycm9yTWVzc2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRXJyb3IgVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlcnJvciBpY29uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RXJyb3JNZXNzYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChpY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoaWNvbikudG9IYXZlQ2xhc3MoJ3RleHQtdGV4dC1kZXN0cnVjdGl2ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRpdGxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxFcnJvck1lc3NhZ2UgdGl0bGU9XCJDdXN0b20gRXJyb3IgVGl0bGVcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tIEVycm9yIFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZXJyb3IgbWVzc2FnZSB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxFcnJvck1lc3NhZ2Ugey4uLmRlZmF1bHRQcm9wc30gZXJyb3JNc2c9XCJEZXRhaWxlZCBlcnJvciBkZXNjcmlwdGlvblwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEZXRhaWxlZCBlcnJvciBkZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBlcnJvciBtZXNzYWdlIHdoZW4gbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxFcnJvck1lc3NhZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBvbmx5IGhhdmUgdGl0bGUsIG5vdCBlcnJvciBtZXNzYWdlIGNvbnRhaW5lclxuICAgICAgY29uc3QgdGV4dEVsZW1lbnRzID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgvRXJyb3IgVGl0bGUvKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50cy5sZW5ndGgpLnRvQmUoMSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RXJyb3JNZXNzYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGNsYXNzTmFtZT1cImN1c3RvbS1lcnJvci1jbGFzc1wiIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ2N1c3RvbS1lcnJvci1jbGFzcycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggZW1wdHkgZXJyb3JNc2cnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPEVycm9yTWVzc2FnZSB7Li4uZGVmYXVsdFByb3BzfSBlcnJvck1zZz1cIlwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBFbXB0eSBzdHJpbmcgc2hvdWxkIG5vdCByZW5kZXIgbWVzc2FnZSBkaXZcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdFcnJvciBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxvbmcgdGl0bGUgdGV4dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdUaXRsZSA9ICdUaGlzIGlzIGEgdmVyeSBsb25nIGVycm9yIHRpdGxlIHRoYXQgbWlnaHQgd3JhcCB0byBtdWx0aXBsZSBsaW5lcydcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVycm9yTWVzc2FnZSB0aXRsZT17bG9uZ1RpdGxlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nVGl0bGUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxvbmcgZXJyb3IgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdFcnJvck1zZyA9ICdUaGlzIGlzIGEgdmVyeSBkZXRhaWxlZCBlcnJvciBtZXNzYWdlIGV4cGxhaW5pbmcgd2hhdCB3ZW50IHdyb25nIGFuZCBob3cgdG8gZml4IGl0LiBJdCBjb250YWlucyBtdWx0aXBsZSBzZW50ZW5jZXMuJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RXJyb3JNZXNzYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGVycm9yTXNnPXtsb25nRXJyb3JNc2d9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdFcnJvck1zZykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdTdHlsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBlcnJvciBiYWNrZ3JvdW5kIHN0eWxpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFcnJvck1lc3NhZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnYmctdG9hc3QtZXJyb3ItYmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgYm9yZGVyIHN0eWxpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxFcnJvck1lc3NhZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnYm9yZGVyLWNvbXBvbmVudHMtcGFuZWwtYm9yZGVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHJvdW5kZWQgY29ybmVycycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVycm9yTWVzc2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLXhsJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJbnRlZ3JhdGlvbiBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnQmFzZSBDb21wb25lbnRzIEludGVncmF0aW9uJywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHJlbmRlciBDcmF3bGVkUmVzdWx0IHdpdGggQ3Jhd2xlZFJlc3VsdEl0ZW0gY2hpbGRyZW4nLCAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IGxpc3QgPSBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtcygyKVxuXG4gICAgLy8gQWN0XG4gICAgcmVuZGVyKFxuICAgICAgPENyYXdsZWRSZXN1bHRcbiAgICAgICAgbGlzdD17bGlzdH1cbiAgICAgICAgY2hlY2tlZExpc3Q9e1tdfVxuICAgICAgICBvblNlbGVjdGVkQ2hhbmdlPXt2aS5mbigpfVxuICAgICAgICB1c2VkVGltZT17MS4wfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgLy8gQXNzZXJ0IC0gQm90aCBpdGVtcyBzaG91bGQgcmVuZGVyXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgQ3Jhd2xlZFJlc3VsdCB3aXRoIENoZWNrYm94V2l0aExhYmVsIGZvciBzZWxlY3QgYWxsJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBsaXN0ID0gY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbXMoMilcblxuICAgIC8vIEFjdFxuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICA8Q3Jhd2xlZFJlc3VsdFxuICAgICAgICBsaXN0PXtsaXN0fVxuICAgICAgICBjaGVja2VkTGlzdD17W119XG4gICAgICAgIG9uU2VsZWN0ZWRDaGFuZ2U9e3ZpLmZuKCl9XG4gICAgICAgIHVzZWRUaW1lPXsxLjB9XG4gICAgICAgIGlzTXVsdGlwbGVDaG9pY2U9e3RydWV9XG4gICAgICAvPixcbiAgICApXG5cbiAgICAvLyBBc3NlcnQgLSBTaG91bGQgaGF2ZSBzZWxlY3QgYWxsIGNoZWNrYm94ICsgaXRlbSBjaGVja2JveGVzXG4gICAgY29uc3QgY2hlY2tib3hlcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS10ZXN0aWRePVwiY2hlY2tib3hcIl0nKVxuICAgIGV4cGVjdChjaGVja2JveGVzLmxlbmd0aCkudG9CZSgzKSAvLyBzZWxlY3QgYWxsICsgMiBpdGVtc1xuICB9KVxuXG4gIGl0KCdzaG91bGQgYWxsb3cgc2VsZWN0aW5nIGFuZCBwcmV2aWV3aW5nIGl0ZW1zJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBsaXN0ID0gY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbXMoMylcbiAgICBjb25zdCBtb2NrT25TZWxlY3RlZENoYW5nZSA9IHZpLmZuKClcbiAgICBjb25zdCBtb2NrT25QcmV2aWV3ID0gdmkuZm4oKVxuXG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgIDxDcmF3bGVkUmVzdWx0XG4gICAgICAgIGxpc3Q9e2xpc3R9XG4gICAgICAgIGNoZWNrZWRMaXN0PXtbXX1cbiAgICAgICAgb25TZWxlY3RlZENoYW5nZT17bW9ja09uU2VsZWN0ZWRDaGFuZ2V9XG4gICAgICAgIG9uUHJldmlldz17bW9ja09uUHJldmlld31cbiAgICAgICAgc2hvd1ByZXZpZXc9e3RydWV9XG4gICAgICAgIHVzZWRUaW1lPXsxLjB9XG4gICAgICAvPixcbiAgICApXG5cbiAgICAvLyBBY3QgLSBTZWxlY3QgZmlyc3QgaXRlbSAoaW5kZXggMSwgYWZ0ZXIgc2VsZWN0IGFsbClcbiAgICBjb25zdCBjaGVja2JveGVzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRlc3RpZF49XCJjaGVja2JveFwiXScpXG4gICAgZmlyZUV2ZW50LmNsaWNrKGNoZWNrYm94ZXNbMV0pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QobW9ja09uU2VsZWN0ZWRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtsaXN0WzBdXSlcblxuICAgIC8vIEFjdCAtIFByZXZpZXcgc2Vjb25kIGl0ZW1cbiAgICBjb25zdCBwcmV2aWV3QnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgZmlyZUV2ZW50LmNsaWNrKHByZXZpZXdCdXR0b25zWzFdKVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KG1vY2tPblByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGxpc3RbMV0sIDEpXG4gIH0pXG59KVxuIl19