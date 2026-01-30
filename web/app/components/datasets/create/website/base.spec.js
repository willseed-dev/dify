"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const crawled_result_1 = require("./base/crawled-result");
const crawled_result_item_1 = require("./base/crawled-result-item");
const header_1 = require("./base/header");
const input_1 = require("./base/input");
// ============================================================================
// Test Data Factories
// ============================================================================
const createCrawlResultItem = (overrides = {}) => ({
    title: 'Test Page Title',
    markdown: '# Test Content',
    description: 'Test description',
    source_url: 'https://example.com/page',
    ...overrides,
});
// ============================================================================
// Input Component Tests
// ============================================================================
describe('Input', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const createInputProps = (overrides = {}) => ({
        value: '',
        onChange: vi.fn(),
        ...overrides,
    });
    describe('Rendering', () => {
        it('should render text input by default', () => {
            const props = createInputProps();
            (0, react_1.render)(<input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'text');
        });
        it('should render number input when isNumber is true', () => {
            const props = createInputProps({ isNumber: true, value: 0 });
            (0, react_1.render)(<input_1.default {...props}/>);
            const input = react_1.screen.getByRole('spinbutton');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'number');
            expect(input).toHaveAttribute('min', '0');
        });
        it('should render with placeholder', () => {
            const props = createInputProps({ placeholder: 'Enter URL' });
            (0, react_1.render)(<input_1.default {...props}/>);
            expect(react_1.screen.getByPlaceholderText('Enter URL')).toBeInTheDocument();
        });
        it('should render with initial value', () => {
            const props = createInputProps({ value: 'test value' });
            (0, react_1.render)(<input_1.default {...props}/>);
            expect(react_1.screen.getByDisplayValue('test value')).toBeInTheDocument();
        });
    });
    describe('Text Input Behavior', () => {
        it('should call onChange with string value for text input', async () => {
            const onChange = vi.fn();
            const props = createInputProps({ onChange });
            (0, react_1.render)(<input_1.default {...props}/>);
            const input = react_1.screen.getByRole('textbox');
            await user_event_1.default.type(input, 'hello');
            expect(onChange).toHaveBeenCalledWith('h');
            expect(onChange).toHaveBeenCalledWith('e');
            expect(onChange).toHaveBeenCalledWith('l');
            expect(onChange).toHaveBeenCalledWith('l');
            expect(onChange).toHaveBeenCalledWith('o');
        });
    });
    describe('Number Input Behavior', () => {
        it('should call onChange with parsed integer for number input', () => {
            const onChange = vi.fn();
            const props = createInputProps({ isNumber: true, onChange, value: 0 });
            (0, react_1.render)(<input_1.default {...props}/>);
            const input = react_1.screen.getByRole('spinbutton');
            react_1.fireEvent.change(input, { target: { value: '42' } });
            expect(onChange).toHaveBeenCalledWith(42);
        });
        it('should call onChange with empty string when input is NaN', () => {
            const onChange = vi.fn();
            const props = createInputProps({ isNumber: true, onChange, value: 0 });
            (0, react_1.render)(<input_1.default {...props}/>);
            const input = react_1.screen.getByRole('spinbutton');
            react_1.fireEvent.change(input, { target: { value: 'abc' } });
            expect(onChange).toHaveBeenCalledWith('');
        });
        it('should call onChange with empty string when input is empty', () => {
            const onChange = vi.fn();
            const props = createInputProps({ isNumber: true, onChange, value: 5 });
            (0, react_1.render)(<input_1.default {...props}/>);
            const input = react_1.screen.getByRole('spinbutton');
            react_1.fireEvent.change(input, { target: { value: '' } });
            expect(onChange).toHaveBeenCalledWith('');
        });
        it('should clamp negative values to MIN_VALUE (0)', () => {
            const onChange = vi.fn();
            const props = createInputProps({ isNumber: true, onChange, value: 0 });
            (0, react_1.render)(<input_1.default {...props}/>);
            const input = react_1.screen.getByRole('spinbutton');
            react_1.fireEvent.change(input, { target: { value: '-5' } });
            expect(onChange).toHaveBeenCalledWith(0);
        });
        it('should handle decimal input by parsing as integer', () => {
            const onChange = vi.fn();
            const props = createInputProps({ isNumber: true, onChange, value: 0 });
            (0, react_1.render)(<input_1.default {...props}/>);
            const input = react_1.screen.getByRole('spinbutton');
            react_1.fireEvent.change(input, { target: { value: '3.7' } });
            expect(onChange).toHaveBeenCalledWith(3);
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(input_1.default.$$typeof).toBeDefined();
        });
    });
});
// ============================================================================
// Header Component Tests
// ============================================================================
describe('Header', () => {
    const createHeaderProps = (overrides = {}) => ({
        title: 'Test Title',
        docTitle: 'Documentation',
        docLink: 'https://docs.example.com',
        ...overrides,
    });
    describe('Rendering', () => {
        it('should render title', () => {
            const props = createHeaderProps();
            (0, react_1.render)(<header_1.default {...props}/>);
            expect(react_1.screen.getByText('Test Title')).toBeInTheDocument();
        });
        it('should render doc link', () => {
            const props = createHeaderProps();
            (0, react_1.render)(<header_1.default {...props}/>);
            const link = react_1.screen.getByRole('link');
            expect(link).toHaveAttribute('href', 'https://docs.example.com');
            expect(link).toHaveAttribute('target', '_blank');
        });
        it('should render button text when not in pipeline', () => {
            const props = createHeaderProps({ buttonText: 'Configure' });
            (0, react_1.render)(<header_1.default {...props}/>);
            expect(react_1.screen.getByText('Configure')).toBeInTheDocument();
        });
        it('should not render button text when in pipeline', () => {
            const props = createHeaderProps({ isInPipeline: true, buttonText: 'Configure' });
            (0, react_1.render)(<header_1.default {...props}/>);
            expect(react_1.screen.queryByText('Configure')).not.toBeInTheDocument();
        });
    });
    describe('isInPipeline Prop', () => {
        it('should apply pipeline styles when isInPipeline is true', () => {
            const props = createHeaderProps({ isInPipeline: true });
            (0, react_1.render)(<header_1.default {...props}/>);
            const titleElement = react_1.screen.getByText('Test Title');
            expect(titleElement).toHaveClass('system-sm-semibold');
        });
        it('should apply default styles when isInPipeline is false', () => {
            const props = createHeaderProps({ isInPipeline: false });
            (0, react_1.render)(<header_1.default {...props}/>);
            const titleElement = react_1.screen.getByText('Test Title');
            expect(titleElement).toHaveClass('system-md-semibold');
        });
        it('should apply compact button styles when isInPipeline is true', () => {
            const props = createHeaderProps({ isInPipeline: true });
            (0, react_1.render)(<header_1.default {...props}/>);
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('size-6');
            expect(button).toHaveClass('px-1');
        });
        it('should apply default button styles when isInPipeline is false', () => {
            const props = createHeaderProps({ isInPipeline: false });
            (0, react_1.render)(<header_1.default {...props}/>);
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('gap-x-0.5');
            expect(button).toHaveClass('px-1.5');
        });
    });
    describe('User Interactions', () => {
        it('should call onClickConfiguration when button is clicked', async () => {
            const onClickConfiguration = vi.fn();
            const props = createHeaderProps({ onClickConfiguration });
            (0, react_1.render)(<header_1.default {...props}/>);
            await user_event_1.default.click(react_1.screen.getByRole('button'));
            expect(onClickConfiguration).toHaveBeenCalledTimes(1);
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(header_1.default.$$typeof).toBeDefined();
        });
    });
});
// ============================================================================
// CrawledResultItem Component Tests
// ============================================================================
describe('CrawledResultItem', () => {
    const createItemProps = (overrides = {}) => ({
        payload: createCrawlResultItem(),
        isChecked: false,
        isPreview: false,
        onCheckChange: vi.fn(),
        onPreview: vi.fn(),
        testId: 'test-item',
        ...overrides,
    });
    describe('Rendering', () => {
        it('should render title and source URL', () => {
            const props = createItemProps({
                payload: createCrawlResultItem({
                    title: 'My Page',
                    source_url: 'https://mysite.com',
                }),
            });
            (0, react_1.render)(<crawled_result_item_1.default {...props}/>);
            expect(react_1.screen.getByText('My Page')).toBeInTheDocument();
            expect(react_1.screen.getByText('https://mysite.com')).toBeInTheDocument();
        });
        it('should render checkbox (custom Checkbox component)', () => {
            const props = createItemProps();
            (0, react_1.render)(<crawled_result_item_1.default {...props}/>);
            // Find checkbox by data-testid
            const checkbox = react_1.screen.getByTestId('checkbox-test-item');
            expect(checkbox).toBeInTheDocument();
        });
        it('should render preview button', () => {
            const props = createItemProps();
            (0, react_1.render)(<crawled_result_item_1.default {...props}/>);
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.preview')).toBeInTheDocument();
        });
    });
    describe('Checkbox Behavior', () => {
        it('should call onCheckChange with true when unchecked item is clicked', async () => {
            const onCheckChange = vi.fn();
            const props = createItemProps({ isChecked: false, onCheckChange });
            (0, react_1.render)(<crawled_result_item_1.default {...props}/>);
            const checkbox = react_1.screen.getByTestId('checkbox-test-item');
            await user_event_1.default.click(checkbox);
            expect(onCheckChange).toHaveBeenCalledWith(true);
        });
        it('should call onCheckChange with false when checked item is clicked', async () => {
            const onCheckChange = vi.fn();
            const props = createItemProps({ isChecked: true, onCheckChange });
            (0, react_1.render)(<crawled_result_item_1.default {...props}/>);
            const checkbox = react_1.screen.getByTestId('checkbox-test-item');
            await user_event_1.default.click(checkbox);
            expect(onCheckChange).toHaveBeenCalledWith(false);
        });
    });
    describe('Preview Behavior', () => {
        it('should call onPreview when preview button is clicked', async () => {
            const onPreview = vi.fn();
            const props = createItemProps({ onPreview });
            (0, react_1.render)(<crawled_result_item_1.default {...props}/>);
            await user_event_1.default.click(react_1.screen.getByText('datasetCreation.stepOne.website.preview'));
            expect(onPreview).toHaveBeenCalledTimes(1);
        });
        it('should apply active style when isPreview is true', () => {
            const props = createItemProps({ isPreview: true });
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...props}/>);
            const wrapper = container.firstChild;
            expect(wrapper).toHaveClass('bg-state-base-active');
        });
        it('should not apply active style when isPreview is false', () => {
            const props = createItemProps({ isPreview: false });
            const { container } = (0, react_1.render)(<crawled_result_item_1.default {...props}/>);
            const wrapper = container.firstChild;
            expect(wrapper).not.toHaveClass('bg-state-base-active');
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(crawled_result_item_1.default.$$typeof).toBeDefined();
        });
    });
});
// ============================================================================
// CrawledResult Component Tests
// ============================================================================
describe('CrawledResult', () => {
    const createResultProps = (overrides = {}) => ({
        list: [
            createCrawlResultItem({ source_url: 'https://page1.com', title: 'Page 1' }),
            createCrawlResultItem({ source_url: 'https://page2.com', title: 'Page 2' }),
            createCrawlResultItem({ source_url: 'https://page3.com', title: 'Page 3' }),
        ],
        checkedList: [],
        onSelectedChange: vi.fn(),
        onPreview: vi.fn(),
        usedTime: 2.5,
        ...overrides,
    });
    // Helper functions to get checkboxes by data-testid
    const getSelectAllCheckbox = () => react_1.screen.getByTestId('checkbox-select-all');
    const getItemCheckbox = (index) => react_1.screen.getByTestId(`checkbox-item-${index}`);
    describe('Rendering', () => {
        it('should render all items in list', () => {
            const props = createResultProps();
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            expect(react_1.screen.getByText('Page 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Page 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Page 3')).toBeInTheDocument();
        });
        it('should render time info', () => {
            const props = createResultProps({ usedTime: 3.456 });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            // The component uses i18n, so we check for the key pattern
            expect(react_1.screen.getByText(/scrapTimeInfo/)).toBeInTheDocument();
        });
        it('should render select all checkbox', () => {
            const props = createResultProps();
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.selectAll')).toBeInTheDocument();
        });
        it('should render reset all when all items are checked', () => {
            const list = [
                createCrawlResultItem({ source_url: 'https://page1.com' }),
                createCrawlResultItem({ source_url: 'https://page2.com' }),
            ];
            const props = createResultProps({ list, checkedList: list });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.resetAll')).toBeInTheDocument();
        });
    });
    describe('Select All / Deselect All', () => {
        it('should call onSelectedChange with all items when select all is clicked', async () => {
            const onSelectedChange = vi.fn();
            const list = [
                createCrawlResultItem({ source_url: 'https://page1.com' }),
                createCrawlResultItem({ source_url: 'https://page2.com' }),
            ];
            const props = createResultProps({ list, checkedList: [], onSelectedChange });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            await user_event_1.default.click(getSelectAllCheckbox());
            expect(onSelectedChange).toHaveBeenCalledWith(list);
        });
        it('should call onSelectedChange with empty array when reset all is clicked', async () => {
            const onSelectedChange = vi.fn();
            const list = [
                createCrawlResultItem({ source_url: 'https://page1.com' }),
                createCrawlResultItem({ source_url: 'https://page2.com' }),
            ];
            const props = createResultProps({ list, checkedList: list, onSelectedChange });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            await user_event_1.default.click(getSelectAllCheckbox());
            expect(onSelectedChange).toHaveBeenCalledWith([]);
        });
    });
    describe('Individual Item Selection', () => {
        it('should add item to checkedList when unchecked item is checked', async () => {
            const onSelectedChange = vi.fn();
            const list = [
                createCrawlResultItem({ source_url: 'https://page1.com', title: 'Page 1' }),
                createCrawlResultItem({ source_url: 'https://page2.com', title: 'Page 2' }),
            ];
            const props = createResultProps({ list, checkedList: [], onSelectedChange });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            await user_event_1.default.click(getItemCheckbox(0));
            expect(onSelectedChange).toHaveBeenCalledWith([list[0]]);
        });
        it('should remove item from checkedList when checked item is unchecked', async () => {
            const onSelectedChange = vi.fn();
            const list = [
                createCrawlResultItem({ source_url: 'https://page1.com', title: 'Page 1' }),
                createCrawlResultItem({ source_url: 'https://page2.com', title: 'Page 2' }),
            ];
            const props = createResultProps({ list, checkedList: [list[0]], onSelectedChange });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            await user_event_1.default.click(getItemCheckbox(0));
            expect(onSelectedChange).toHaveBeenCalledWith([]);
        });
        it('should preserve other checked items when unchecking one item', async () => {
            const onSelectedChange = vi.fn();
            const list = [
                createCrawlResultItem({ source_url: 'https://page1.com', title: 'Page 1' }),
                createCrawlResultItem({ source_url: 'https://page2.com', title: 'Page 2' }),
                createCrawlResultItem({ source_url: 'https://page3.com', title: 'Page 3' }),
            ];
            const props = createResultProps({ list, checkedList: [list[0], list[1]], onSelectedChange });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            // Click the first item's checkbox to uncheck it
            await user_event_1.default.click(getItemCheckbox(0));
            expect(onSelectedChange).toHaveBeenCalledWith([list[1]]);
        });
    });
    describe('Preview Behavior', () => {
        it('should call onPreview with correct item when preview is clicked', async () => {
            const onPreview = vi.fn();
            const list = [
                createCrawlResultItem({ source_url: 'https://page1.com', title: 'Page 1' }),
                createCrawlResultItem({ source_url: 'https://page2.com', title: 'Page 2' }),
            ];
            const props = createResultProps({ list, onPreview });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            // Click preview on second item
            const previewButtons = react_1.screen.getAllByText('datasetCreation.stepOne.website.preview');
            await user_event_1.default.click(previewButtons[1]);
            expect(onPreview).toHaveBeenCalledWith(list[1]);
        });
        it('should track preview index correctly', async () => {
            const onPreview = vi.fn();
            const list = [
                createCrawlResultItem({ source_url: 'https://page1.com', title: 'Page 1' }),
                createCrawlResultItem({ source_url: 'https://page2.com', title: 'Page 2' }),
            ];
            const props = createResultProps({ list, onPreview });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            // Click preview on first item
            const previewButtons = react_1.screen.getAllByText('datasetCreation.stepOne.website.preview');
            await user_event_1.default.click(previewButtons[0]);
            expect(onPreview).toHaveBeenCalledWith(list[0]);
        });
    });
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            expect(crawled_result_1.default.$$typeof).toBeDefined();
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty list', () => {
            const props = createResultProps({ list: [], checkedList: [] });
            (0, react_1.render)(<crawled_result_1.default {...props}/>);
            // Should still render the header with resetAll (empty list = all checked)
            expect(react_1.screen.getByText('datasetCreation.stepOne.website.resetAll')).toBeInTheDocument();
        });
        it('should handle className prop', () => {
            const props = createResultProps({ className: 'custom-class' });
            const { container } = (0, react_1.render)(<crawled_result_1.default {...props}/>);
            expect(container.firstChild).toHaveClass('custom-class');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmFzZS5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUFrRTtBQUNsRSw0REFBbUQ7QUFDbkQsMERBQWlEO0FBQ2pELG9FQUEwRDtBQUMxRCwwQ0FBa0M7QUFDbEMsd0NBQWdDO0FBRWhDLCtFQUErRTtBQUMvRSxzQkFBc0I7QUFDdEIsK0VBQStFO0FBRS9FLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxZQUFzQyxFQUFFLEVBQW1CLEVBQUUsQ0FBQyxDQUFDO0lBQzVGLEtBQUssRUFBRSxpQkFBaUI7SUFDeEIsUUFBUSxFQUFFLGdCQUFnQjtJQUMxQixXQUFXLEVBQUUsa0JBQWtCO0lBQy9CLFVBQVUsRUFBRSwwQkFBMEI7SUFDdEMsR0FBRyxTQUFTO0NBQ2IsQ0FBQyxDQUFBO0FBRUYsK0VBQStFO0FBQy9FLHdCQUF3QjtBQUN4QiwrRUFBK0U7QUFFL0UsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxZQUFrRCxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEYsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQixHQUFHLFNBQVM7S0FDYixDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQzdDLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixFQUFFLENBQUE7WUFDaEMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFNUIsTUFBTSxLQUFLLEdBQUcsY0FB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QUFFLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUM5RCxJQUFBLGNBQU0sRUFBQyxDQUFDLHdCQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFcEMsMEVBQTBFO1lBQzFFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzFGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDhCQUE4QixFQUFFLEdBQUcsRUFBRTtZQUN0QyxNQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBO1lBQzlELE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLHdCQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFMUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBDcmF3bFJlc3VsdEl0ZW0gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgQ3Jhd2xlZFJlc3VsdCBmcm9tICcuL2Jhc2UvY3Jhd2xlZC1yZXN1bHQnXG5pbXBvcnQgQ3Jhd2xlZFJlc3VsdEl0ZW0gZnJvbSAnLi9iYXNlL2NyYXdsZWQtcmVzdWx0LWl0ZW0nXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vYmFzZS9oZWFkZXInXG5pbXBvcnQgSW5wdXQgZnJvbSAnLi9iYXNlL2lucHV0J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSA9IChvdmVycmlkZXM6IFBhcnRpYWw8Q3Jhd2xSZXN1bHRJdGVtPiA9IHt9KTogQ3Jhd2xSZXN1bHRJdGVtID0+ICh7XG4gIHRpdGxlOiAnVGVzdCBQYWdlIFRpdGxlJyxcbiAgbWFya2Rvd246ICcjIFRlc3QgQ29udGVudCcsXG4gIGRlc2NyaXB0aW9uOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gIHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tL3BhZ2UnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJbnB1dCBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0lucHV0JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBjb25zdCBjcmVhdGVJbnB1dFByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDxQYXJhbWV0ZXJzPHR5cGVvZiBJbnB1dD5bMF0+ID0ge30pID0+ICh7XG4gICAgdmFsdWU6ICcnLFxuICAgIG9uQ2hhbmdlOiB2aS5mbigpLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRleHQgaW5wdXQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRQcm9wcygpXG4gICAgICByZW5kZXIoPElucHV0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlQXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBudW1iZXIgaW5wdXQgd2hlbiBpc051bWJlciBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dFByb3BzKHsgaXNOdW1iZXI6IHRydWUsIHZhbHVlOiAwIH0pXG4gICAgICByZW5kZXIoPElucHV0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3BpbmJ1dHRvbicpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlQXR0cmlidXRlKCd0eXBlJywgJ251bWJlcicpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZUF0dHJpYnV0ZSgnbWluJywgJzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHBsYWNlaG9sZGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJbnB1dFByb3BzKHsgcGxhY2Vob2xkZXI6ICdFbnRlciBVUkwnIH0pXG4gICAgICByZW5kZXIoPElucHV0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ0VudGVyIFVSTCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggaW5pdGlhbCB2YWx1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRQcm9wcyh7IHZhbHVlOiAndGVzdCB2YWx1ZScgfSlcbiAgICAgIHJlbmRlcig8SW5wdXQgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeURpc3BsYXlWYWx1ZSgndGVzdCB2YWx1ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVGV4dCBJbnB1dCBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2l0aCBzdHJpbmcgdmFsdWUgZm9yIHRleHQgaW5wdXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRQcm9wcyh7IG9uQ2hhbmdlIH0pXG5cbiAgICAgIHJlbmRlcig8SW5wdXQgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpXG5cbiAgICAgIGF3YWl0IHVzZXJFdmVudC50eXBlKGlucHV0LCAnaGVsbG8nKVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdoJylcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2UnKVxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbCcpXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdsJylcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ28nKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ051bWJlciBJbnB1dCBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2l0aCBwYXJzZWQgaW50ZWdlciBmb3IgbnVtYmVyIGlucHV0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0UHJvcHMoeyBpc051bWJlcjogdHJ1ZSwgb25DaGFuZ2UsIHZhbHVlOiAwIH0pXG5cbiAgICAgIHJlbmRlcig8SW5wdXQgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3BpbmJ1dHRvbicpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnNDInIH0gfSlcblxuICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCg0MilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggZW1wdHkgc3RyaW5nIHdoZW4gaW5wdXQgaXMgTmFOJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0UHJvcHMoeyBpc051bWJlcjogdHJ1ZSwgb25DaGFuZ2UsIHZhbHVlOiAwIH0pXG5cbiAgICAgIHJlbmRlcig8SW5wdXQgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3BpbmJ1dHRvbicpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnYWJjJyB9IH0pXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aXRoIGVtcHR5IHN0cmluZyB3aGVuIGlucHV0IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0UHJvcHMoeyBpc051bWJlcjogdHJ1ZSwgb25DaGFuZ2UsIHZhbHVlOiA1IH0pXG5cbiAgICAgIHJlbmRlcig8SW5wdXQgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3BpbmJ1dHRvbicpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnJyB9IH0pXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xhbXAgbmVnYXRpdmUgdmFsdWVzIHRvIE1JTl9WQUxVRSAoMCknLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSW5wdXRQcm9wcyh7IGlzTnVtYmVyOiB0cnVlLCBvbkNoYW5nZSwgdmFsdWU6IDAgfSlcblxuICAgICAgcmVuZGVyKDxJbnB1dCB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCdzcGluYnV0dG9uJylcblxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICctNScgfSB9KVxuXG4gICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRlY2ltYWwgaW5wdXQgYnkgcGFyc2luZyBhcyBpbnRlZ2VyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUlucHV0UHJvcHMoeyBpc051bWJlcjogdHJ1ZSwgb25DaGFuZ2UsIHZhbHVlOiAwIH0pXG5cbiAgICAgIHJlbmRlcig8SW5wdXQgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5Um9sZSgnc3BpbmJ1dHRvbicpXG5cbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnMy43JyB9IH0pXG5cbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoMylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIGV4cGVjdChJbnB1dC4kJHR5cGVvZikudG9CZURlZmluZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBIZWFkZXIgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdIZWFkZXInLCAoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZUhlYWRlclByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDxQYXJhbWV0ZXJzPHR5cGVvZiBIZWFkZXI+WzBdPiA9IHt9KSA9PiAoe1xuICAgIHRpdGxlOiAnVGVzdCBUaXRsZScsXG4gICAgZG9jVGl0bGU6ICdEb2N1bWVudGF0aW9uJyxcbiAgICBkb2NMaW5rOiAnaHR0cHM6Ly9kb2NzLmV4YW1wbGUuY29tJyxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0aXRsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSGVhZGVyUHJvcHMoKVxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkb2MgbGluaycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSGVhZGVyUHJvcHMoKVxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgY29uc3QgbGluayA9IHNjcmVlbi5nZXRCeVJvbGUoJ2xpbmsnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2RvY3MuZXhhbXBsZS5jb20nKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJ1dHRvbiB0ZXh0IHdoZW4gbm90IGluIHBpcGVsaW5lJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVIZWFkZXJQcm9wcyh7IGJ1dHRvblRleHQ6ICdDb25maWd1cmUnIH0pXG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ29uZmlndXJlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGJ1dHRvbiB0ZXh0IHdoZW4gaW4gcGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUhlYWRlclByb3BzKHsgaXNJblBpcGVsaW5lOiB0cnVlLCBidXR0b25UZXh0OiAnQ29uZmlndXJlJyB9KVxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnQ29uZmlndXJlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnaXNJblBpcGVsaW5lIFByb3AnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBwaXBlbGluZSBzdHlsZXMgd2hlbiBpc0luUGlwZWxpbmUgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSGVhZGVyUHJvcHMoeyBpc0luUGlwZWxpbmU6IHRydWUgfSlcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IHRpdGxlRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgVGl0bGUnKVxuICAgICAgZXhwZWN0KHRpdGxlRWxlbWVudCkudG9IYXZlQ2xhc3MoJ3N5c3RlbS1zbS1zZW1pYm9sZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgZGVmYXVsdCBzdHlsZXMgd2hlbiBpc0luUGlwZWxpbmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUhlYWRlclByb3BzKHsgaXNJblBpcGVsaW5lOiBmYWxzZSB9KVxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgY29uc3QgdGl0bGVFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBUaXRsZScpXG4gICAgICBleHBlY3QodGl0bGVFbGVtZW50KS50b0hhdmVDbGFzcygnc3lzdGVtLW1kLXNlbWlib2xkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjb21wYWN0IGJ1dHRvbiBzdHlsZXMgd2hlbiBpc0luUGlwZWxpbmUgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSGVhZGVyUHJvcHMoeyBpc0luUGlwZWxpbmU6IHRydWUgfSlcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0hhdmVDbGFzcygnc2l6ZS02JylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdweC0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBkZWZhdWx0IGJ1dHRvbiBzdHlsZXMgd2hlbiBpc0luUGlwZWxpbmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUhlYWRlclByb3BzKHsgaXNJblBpcGVsaW5lOiBmYWxzZSB9KVxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdnYXAteC0wLjUnKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ3B4LTEuNScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xpY2tDb25maWd1cmF0aW9uIHdoZW4gYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsaWNrQ29uZmlndXJhdGlvbiA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSGVhZGVyUHJvcHMoeyBvbkNsaWNrQ29uZmlndXJhdGlvbiB9KVxuXG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICBleHBlY3Qob25DbGlja0NvbmZpZ3VyYXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KEhlYWRlci4kJHR5cGVvZikudG9CZURlZmluZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDcmF3bGVkUmVzdWx0SXRlbSBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0NyYXdsZWRSZXN1bHRJdGVtJywgKCkgPT4ge1xuICBjb25zdCBjcmVhdGVJdGVtUHJvcHMgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBhcmFtZXRlcnM8dHlwZW9mIENyYXdsZWRSZXN1bHRJdGVtPlswXT4gPSB7fSkgPT4gKHtcbiAgICBwYXlsb2FkOiBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oKSxcbiAgICBpc0NoZWNrZWQ6IGZhbHNlLFxuICAgIGlzUHJldmlldzogZmFsc2UsXG4gICAgb25DaGVja0NoYW5nZTogdmkuZm4oKSxcbiAgICBvblByZXZpZXc6IHZpLmZuKCksXG4gICAgdGVzdElkOiAndGVzdC1pdGVtJyxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0aXRsZSBhbmQgc291cmNlIFVSTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHtcbiAgICAgICAgcGF5bG9hZDogY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHtcbiAgICAgICAgICB0aXRsZTogJ015IFBhZ2UnLFxuICAgICAgICAgIHNvdXJjZV91cmw6ICdodHRwczovL215c2l0ZS5jb20nLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNeSBQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL215c2l0ZS5jb20nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGVja2JveCAoY3VzdG9tIENoZWNrYm94IGNvbXBvbmVudCknLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcygpXG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEZpbmQgY2hlY2tib3ggYnkgZGF0YS10ZXN0aWRcbiAgICAgIGNvbnN0IGNoZWNrYm94ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjaGVja2JveC10ZXN0LWl0ZW0nKVxuICAgICAgZXhwZWN0KGNoZWNrYm94KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHByZXZpZXcgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoKVxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0SXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5wcmV2aWV3JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDaGVja2JveCBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGVja0NoYW5nZSB3aXRoIHRydWUgd2hlbiB1bmNoZWNrZWQgaXRlbSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGVja0NoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgaXNDaGVja2VkOiBmYWxzZSwgb25DaGVja0NoYW5nZSB9KVxuXG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBjaGVja2JveCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hlY2tib3gtdGVzdC1pdGVtJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhjaGVja2JveClcblxuICAgICAgZXhwZWN0KG9uQ2hlY2tDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoZWNrQ2hhbmdlIHdpdGggZmFsc2Ugd2hlbiBjaGVja2VkIGl0ZW0gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hlY2tDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7IGlzQ2hlY2tlZDogdHJ1ZSwgb25DaGVja0NoYW5nZSB9KVxuXG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBjaGVja2JveCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hlY2tib3gtdGVzdC1pdGVtJylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhjaGVja2JveClcblxuICAgICAgZXhwZWN0KG9uQ2hlY2tDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1ByZXZpZXcgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uUHJldmlldyB3aGVuIHByZXZpZXcgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvblByZXZpZXcgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUl0ZW1Qcm9wcyh7IG9uUHJldmlldyB9KVxuXG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5wcmV2aWV3JykpXG5cbiAgICAgIGV4cGVjdChvblByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGFjdGl2ZSBzdHlsZSB3aGVuIGlzUHJldmlldyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVJdGVtUHJvcHMoeyBpc1ByZXZpZXc6IHRydWUgfSlcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENyYXdsZWRSZXN1bHRJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IHdyYXBwZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZFxuICAgICAgZXhwZWN0KHdyYXBwZXIpLnRvSGF2ZUNsYXNzKCdiZy1zdGF0ZS1iYXNlLWFjdGl2ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGFwcGx5IGFjdGl2ZSBzdHlsZSB3aGVuIGlzUHJldmlldyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSXRlbVByb3BzKHsgaXNQcmV2aWV3OiBmYWxzZSB9KVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q3Jhd2xlZFJlc3VsdEl0ZW0gey4uLnByb3BzfSAvPilcblxuICAgICAgY29uc3Qgd3JhcHBlciA9IGNvbnRhaW5lci5maXJzdENoaWxkXG4gICAgICBleHBlY3Qod3JhcHBlcikubm90LnRvSGF2ZUNsYXNzKCdiZy1zdGF0ZS1iYXNlLWFjdGl2ZScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoQ3Jhd2xlZFJlc3VsdEl0ZW0uJCR0eXBlb2YpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ3Jhd2xlZFJlc3VsdCBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0NyYXdsZWRSZXN1bHQnLCAoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZVJlc3VsdFByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDxQYXJhbWV0ZXJzPHR5cGVvZiBDcmF3bGVkUmVzdWx0PlswXT4gPSB7fSkgPT4gKHtcbiAgICBsaXN0OiBbXG4gICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMS5jb20nLCB0aXRsZTogJ1BhZ2UgMScgfSksXG4gICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMi5jb20nLCB0aXRsZTogJ1BhZ2UgMicgfSksXG4gICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMy5jb20nLCB0aXRsZTogJ1BhZ2UgMycgfSksXG4gICAgXSxcbiAgICBjaGVja2VkTGlzdDogW10sXG4gICAgb25TZWxlY3RlZENoYW5nZTogdmkuZm4oKSxcbiAgICBvblByZXZpZXc6IHZpLmZuKCksXG4gICAgdXNlZFRpbWU6IDIuNSxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH0pXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9ucyB0byBnZXQgY2hlY2tib3hlcyBieSBkYXRhLXRlc3RpZFxuICBjb25zdCBnZXRTZWxlY3RBbGxDaGVja2JveCA9ICgpID0+IHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hlY2tib3gtc2VsZWN0LWFsbCcpXG4gIGNvbnN0IGdldEl0ZW1DaGVja2JveCA9IChpbmRleDogbnVtYmVyKSA9PiBzY3JlZW4uZ2V0QnlUZXN0SWQoYGNoZWNrYm94LWl0ZW0tJHtpbmRleH1gKVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGl0ZW1zIGluIGxpc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVJlc3VsdFByb3BzKClcbiAgICAgIHJlbmRlcig8Q3Jhd2xlZFJlc3VsdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFnZSAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQYWdlIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BhZ2UgMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRpbWUgaW5mbycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUmVzdWx0UHJvcHMoeyB1c2VkVGltZTogMy40NTYgfSlcbiAgICAgIHJlbmRlcig8Q3Jhd2xlZFJlc3VsdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBUaGUgY29tcG9uZW50IHVzZXMgaTE4biwgc28gd2UgY2hlY2sgZm9yIHRoZSBrZXkgcGF0dGVyblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3NjcmFwVGltZUluZm8vKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzZWxlY3QgYWxsIGNoZWNrYm94JywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVSZXN1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUuc2VsZWN0QWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcmVzZXQgYWxsIHdoZW4gYWxsIGl0ZW1zIGFyZSBjaGVja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbGlzdCA9IFtcbiAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTEuY29tJyB9KSxcbiAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTIuY29tJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUmVzdWx0UHJvcHMoeyBsaXN0LCBjaGVja2VkTGlzdDogbGlzdCB9KVxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLnJlc2V0QWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdTZWxlY3QgQWxsIC8gRGVzZWxlY3QgQWxsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblNlbGVjdGVkQ2hhbmdlIHdpdGggYWxsIGl0ZW1zIHdoZW4gc2VsZWN0IGFsbCBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25TZWxlY3RlZENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UxLmNvbScgfSksXG4gICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UyLmNvbScgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVJlc3VsdFByb3BzKHsgbGlzdCwgY2hlY2tlZExpc3Q6IFtdLCBvblNlbGVjdGVkQ2hhbmdlIH0pXG5cbiAgICAgIHJlbmRlcig8Q3Jhd2xlZFJlc3VsdCB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKGdldFNlbGVjdEFsbENoZWNrYm94KCkpXG5cbiAgICAgIGV4cGVjdChvblNlbGVjdGVkQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChsaXN0KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3RlZENoYW5nZSB3aXRoIGVtcHR5IGFycmF5IHdoZW4gcmVzZXQgYWxsIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvblNlbGVjdGVkQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbGlzdCA9IFtcbiAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTEuY29tJyB9KSxcbiAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTIuY29tJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUmVzdWx0UHJvcHMoeyBsaXN0LCBjaGVja2VkTGlzdDogbGlzdCwgb25TZWxlY3RlZENoYW5nZSB9KVxuXG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhnZXRTZWxlY3RBbGxDaGVja2JveCgpKVxuXG4gICAgICBleHBlY3Qob25TZWxlY3RlZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnSW5kaXZpZHVhbCBJdGVtIFNlbGVjdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFkZCBpdGVtIHRvIGNoZWNrZWRMaXN0IHdoZW4gdW5jaGVja2VkIGl0ZW0gaXMgY2hlY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uU2VsZWN0ZWRDaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBsaXN0ID0gW1xuICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMS5jb20nLCB0aXRsZTogJ1BhZ2UgMScgfSksXG4gICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UyLmNvbScsIHRpdGxlOiAnUGFnZSAyJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUmVzdWx0UHJvcHMoeyBsaXN0LCBjaGVja2VkTGlzdDogW10sIG9uU2VsZWN0ZWRDaGFuZ2UgfSlcblxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0IHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soZ2V0SXRlbUNoZWNrYm94KDApKVxuXG4gICAgICBleHBlY3Qob25TZWxlY3RlZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW2xpc3RbMF1dKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbW92ZSBpdGVtIGZyb20gY2hlY2tlZExpc3Qgd2hlbiBjaGVja2VkIGl0ZW0gaXMgdW5jaGVja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25TZWxlY3RlZENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UxLmNvbScsIHRpdGxlOiAnUGFnZSAxJyB9KSxcbiAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTIuY29tJywgdGl0bGU6ICdQYWdlIDInIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVSZXN1bHRQcm9wcyh7IGxpc3QsIGNoZWNrZWRMaXN0OiBbbGlzdFswXV0sIG9uU2VsZWN0ZWRDaGFuZ2UgfSlcblxuICAgICAgcmVuZGVyKDxDcmF3bGVkUmVzdWx0IHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soZ2V0SXRlbUNoZWNrYm94KDApKVxuXG4gICAgICBleHBlY3Qob25TZWxlY3RlZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgb3RoZXIgY2hlY2tlZCBpdGVtcyB3aGVuIHVuY2hlY2tpbmcgb25lIGl0ZW0nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvblNlbGVjdGVkQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbGlzdCA9IFtcbiAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTEuY29tJywgdGl0bGU6ICdQYWdlIDEnIH0pLFxuICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMi5jb20nLCB0aXRsZTogJ1BhZ2UgMicgfSksXG4gICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UzLmNvbScsIHRpdGxlOiAnUGFnZSAzJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUmVzdWx0UHJvcHMoeyBsaXN0LCBjaGVja2VkTGlzdDogW2xpc3RbMF0sIGxpc3RbMV1dLCBvblNlbGVjdGVkQ2hhbmdlIH0pXG5cbiAgICAgIHJlbmRlcig8Q3Jhd2xlZFJlc3VsdCB7Li4ucHJvcHN9IC8+KVxuICAgICAgLy8gQ2xpY2sgdGhlIGZpcnN0IGl0ZW0ncyBjaGVja2JveCB0byB1bmNoZWNrIGl0XG4gICAgICBhd2FpdCB1c2VyRXZlbnQuY2xpY2soZ2V0SXRlbUNoZWNrYm94KDApKVxuXG4gICAgICBleHBlY3Qob25TZWxlY3RlZENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW2xpc3RbMV1dKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1ByZXZpZXcgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uUHJldmlldyB3aXRoIGNvcnJlY3QgaXRlbSB3aGVuIHByZXZpZXcgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uUHJldmlldyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxpc3QgPSBbXG4gICAgICAgIGNyZWF0ZUNyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL3BhZ2UxLmNvbScsIHRpdGxlOiAnUGFnZSAxJyB9KSxcbiAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTIuY29tJywgdGl0bGU6ICdQYWdlIDInIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVSZXN1bHRQcm9wcyh7IGxpc3QsIG9uUHJldmlldyB9KVxuXG4gICAgICByZW5kZXIoPENyYXdsZWRSZXN1bHQgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgcHJldmlldyBvbiBzZWNvbmQgaXRlbVxuICAgICAgY29uc3QgcHJldmlld0J1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS53ZWJzaXRlLnByZXZpZXcnKVxuICAgICAgYXdhaXQgdXNlckV2ZW50LmNsaWNrKHByZXZpZXdCdXR0b25zWzFdKVxuXG4gICAgICBleHBlY3Qob25QcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChsaXN0WzFdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyYWNrIHByZXZpZXcgaW5kZXggY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25QcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgY29uc3QgbGlzdCA9IFtcbiAgICAgICAgY3JlYXRlQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vcGFnZTEuY29tJywgdGl0bGU6ICdQYWdlIDEnIH0pLFxuICAgICAgICBjcmVhdGVDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9wYWdlMi5jb20nLCB0aXRsZTogJ1BhZ2UgMicgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZVJlc3VsdFByb3BzKHsgbGlzdCwgb25QcmV2aWV3IH0pXG5cbiAgICAgIHJlbmRlcig8Q3Jhd2xlZFJlc3VsdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBDbGljayBwcmV2aWV3IG9uIGZpcnN0IGl0ZW1cbiAgICAgIGNvbnN0IHByZXZpZXdCdXR0b25zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUud2Vic2l0ZS5wcmV2aWV3JylcbiAgICAgIGF3YWl0IHVzZXJFdmVudC5jbGljayhwcmV2aWV3QnV0dG9uc1swXSlcblxuICAgICAgZXhwZWN0KG9uUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFdpdGgobGlzdFswXSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIGV4cGVjdChDcmF3bGVkUmVzdWx0LiQkdHlwZW9mKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBsaXN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVSZXN1bHRQcm9wcyh7IGxpc3Q6IFtdLCBjaGVja2VkTGlzdDogW10gfSlcbiAgICAgIHJlbmRlcig8Q3Jhd2xlZFJlc3VsdCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBTaG91bGQgc3RpbGwgcmVuZGVyIHRoZSBoZWFkZXIgd2l0aCByZXNldEFsbCAoZW1wdHkgbGlzdCA9IGFsbCBjaGVja2VkKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLndlYnNpdGUucmVzZXRBbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjbGFzc05hbWUgcHJvcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlUmVzdWx0UHJvcHMoeyBjbGFzc05hbWU6ICdjdXN0b20tY2xhc3MnIH0pXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDcmF3bGVkUmVzdWx0IHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ2N1c3RvbS1jbGFzcycpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=