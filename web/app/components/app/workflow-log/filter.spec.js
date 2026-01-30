"use strict";
/**
 * Filter Component Tests
 *
 * Tests the workflow log filter component which provides:
 * - Status filtering (all, succeeded, failed, stopped, partial-succeeded)
 * - Time period selection
 * - Keyword search
 */
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const react_2 = require("react");
const filter_1 = require("./filter");
// ============================================================================
// Mocks
// ============================================================================
const mockTrackEvent = vi.fn();
vi.mock('@/app/components/base/amplitude/utils', () => ({
    trackEvent: (...args) => mockTrackEvent(...args),
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createDefaultQueryParams = (overrides = {}) => ({
    status: 'all',
    period: '2', // default to last 7 days
    ...overrides,
});
// ============================================================================
// Tests
// ============================================================================
describe('Filter', () => {
    const defaultSetQueryParams = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests (REQUIRED)
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={defaultSetQueryParams}/>);
            // Should render status chip, period chip, and search input
            expect(react_1.screen.getByText('All')).toBeInTheDocument();
            expect(react_1.screen.getByPlaceholderText('common.operation.search')).toBeInTheDocument();
        });
        it('should render all filter components', () => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={defaultSetQueryParams}/>);
            // Status chip
            expect(react_1.screen.getByText('All')).toBeInTheDocument();
            // Period chip (shows translated key)
            expect(react_1.screen.getByText('appLog.filter.period.last7days')).toBeInTheDocument();
            // Search input
            expect(react_1.screen.getByPlaceholderText('common.operation.search')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Status Filter Tests
    // --------------------------------------------------------------------------
    describe('Status Filter', () => {
        it('should display current status value', () => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ status: 'succeeded' })} setQueryParams={defaultSetQueryParams}/>);
            // Chip should show Success for succeeded status
            expect(react_1.screen.getByText('Success')).toBeInTheDocument();
        });
        it('should open status dropdown when clicked', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={defaultSetQueryParams}/>);
            await user.click(react_1.screen.getByText('All'));
            // Should show all status options
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('Success')).toBeInTheDocument();
                expect(react_1.screen.getByText('Fail')).toBeInTheDocument();
                expect(react_1.screen.getByText('Stop')).toBeInTheDocument();
                expect(react_1.screen.getByText('Partial Success')).toBeInTheDocument();
            });
        });
        it('should call setQueryParams when status is selected', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={setQueryParams}/>);
            await user.click(react_1.screen.getByText('All'));
            await user.click(await react_1.screen.findByText('Success'));
            expect(setQueryParams).toHaveBeenCalledWith({
                status: 'succeeded',
                period: '2',
            });
        });
        it('should track status selection event', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={defaultSetQueryParams}/>);
            await user.click(react_1.screen.getByText('All'));
            await user.click(await react_1.screen.findByText('Fail'));
            expect(mockTrackEvent).toHaveBeenCalledWith('workflow_log_filter_status_selected', { workflow_log_filter_status: 'failed' });
        });
        it('should reset to all when status is cleared', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            const { container } = (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ status: 'succeeded' })} setQueryParams={setQueryParams}/>);
            // Find the clear icon (div with group/clear class) in the status chip
            const clearIcon = container.querySelector('.group\\/clear');
            expect(clearIcon).toBeInTheDocument();
            await user.click(clearIcon);
            expect(setQueryParams).toHaveBeenCalledWith({
                status: 'all',
                period: '2',
            });
        });
        it.each([
            ['all', 'All'],
            ['succeeded', 'Success'],
            ['failed', 'Fail'],
            ['stopped', 'Stop'],
            ['partial-succeeded', 'Partial Success'],
        ])('should display correct label for %s status', (statusValue, expectedLabel) => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ status: statusValue })} setQueryParams={defaultSetQueryParams}/>);
            expect(react_1.screen.getByText(expectedLabel)).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Time Period Filter Tests
    // --------------------------------------------------------------------------
    describe('Time Period Filter', () => {
        it('should display current period value', () => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ period: '1' })} setQueryParams={defaultSetQueryParams}/>);
            expect(react_1.screen.getByText('appLog.filter.period.today')).toBeInTheDocument();
        });
        it('should open period dropdown when clicked', async () => {
            const user = user_event_1.default.setup();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={defaultSetQueryParams}/>);
            await user.click(react_1.screen.getByText('appLog.filter.period.last7days'));
            // Should show all period options
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('appLog.filter.period.today')).toBeInTheDocument();
                expect(react_1.screen.getByText('appLog.filter.period.last4weeks')).toBeInTheDocument();
                expect(react_1.screen.getByText('appLog.filter.period.last3months')).toBeInTheDocument();
                expect(react_1.screen.getByText('appLog.filter.period.allTime')).toBeInTheDocument();
            });
        });
        it('should call setQueryParams when period is selected', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={setQueryParams}/>);
            await user.click(react_1.screen.getByText('appLog.filter.period.last7days'));
            await user.click(await react_1.screen.findByText('appLog.filter.period.allTime'));
            expect(setQueryParams).toHaveBeenCalledWith({
                status: 'all',
                period: '9',
            });
        });
        it('should reset period to allTime when cleared', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ period: '2' })} setQueryParams={setQueryParams}/>);
            // Find the period chip's clear button
            const periodChip = react_1.screen.getByText('appLog.filter.period.last7days').closest('div');
            const clearButton = periodChip?.querySelector('button[type="button"]');
            if (clearButton) {
                await user.click(clearButton);
                expect(setQueryParams).toHaveBeenCalledWith({
                    status: 'all',
                    period: '9',
                });
            }
        });
    });
    // --------------------------------------------------------------------------
    // Keyword Search Tests
    // --------------------------------------------------------------------------
    describe('Keyword Search', () => {
        it('should display current keyword value', () => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ keyword: 'test search' })} setQueryParams={defaultSetQueryParams}/>);
            expect(react_1.screen.getByDisplayValue('test search')).toBeInTheDocument();
        });
        it('should call setQueryParams when typing in search', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            const Wrapper = () => {
                const [queryParams, updateQueryParams] = (0, react_2.useState)(createDefaultQueryParams());
                const handleSetQueryParams = (next) => {
                    updateQueryParams(next);
                    setQueryParams(next);
                };
                return (<filter_1.default queryParams={queryParams} setQueryParams={handleSetQueryParams}/>);
            };
            (0, react_1.render)(<Wrapper />);
            const input = react_1.screen.getByPlaceholderText('common.operation.search');
            await user.type(input, 'workflow');
            // Should call setQueryParams for each character typed
            expect(setQueryParams).toHaveBeenLastCalledWith(expect.objectContaining({ keyword: 'workflow' }));
        });
        it('should clear keyword when clear button is clicked', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            const { container } = (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ keyword: 'test' })} setQueryParams={setQueryParams}/>);
            // The Input component renders a clear icon div inside the input wrapper
            // when showClearIcon is true and value exists
            const inputWrapper = container.querySelector('.w-\\[200px\\]');
            // Find the clear icon div (has cursor-pointer class and contains RiCloseCircleFill)
            const clearIconDiv = inputWrapper?.querySelector('div.cursor-pointer');
            expect(clearIconDiv).toBeInTheDocument();
            await user.click(clearIconDiv);
            expect(setQueryParams).toHaveBeenCalledWith({
                status: 'all',
                period: '2',
                keyword: '',
            });
        });
        it('should update on direct input change', () => {
            const setQueryParams = vi.fn();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={setQueryParams}/>);
            const input = react_1.screen.getByPlaceholderText('common.operation.search');
            react_1.fireEvent.change(input, { target: { value: 'new search' } });
            expect(setQueryParams).toHaveBeenCalledWith({
                status: 'all',
                period: '2',
                keyword: 'new search',
            });
        });
    });
    // --------------------------------------------------------------------------
    // TIME_PERIOD_MAPPING Tests
    // --------------------------------------------------------------------------
    describe('TIME_PERIOD_MAPPING', () => {
        it('should have correct mapping for today', () => {
            expect(filter_1.TIME_PERIOD_MAPPING['1']).toEqual({ value: 0, name: 'today' });
        });
        it('should have correct mapping for last 7 days', () => {
            expect(filter_1.TIME_PERIOD_MAPPING['2']).toEqual({ value: 7, name: 'last7days' });
        });
        it('should have correct mapping for last 4 weeks', () => {
            expect(filter_1.TIME_PERIOD_MAPPING['3']).toEqual({ value: 28, name: 'last4weeks' });
        });
        it('should have correct mapping for all time', () => {
            expect(filter_1.TIME_PERIOD_MAPPING['9']).toEqual({ value: -1, name: 'allTime' });
        });
        it('should have all 9 predefined time periods', () => {
            expect(Object.keys(filter_1.TIME_PERIOD_MAPPING)).toHaveLength(9);
        });
        it.each([
            ['1', 'today', 0],
            ['2', 'last7days', 7],
            ['3', 'last4weeks', 28],
            ['9', 'allTime', -1],
        ])('TIME_PERIOD_MAPPING[%s] should have name=%s and correct value', (key, name, expectedValue) => {
            const mapping = filter_1.TIME_PERIOD_MAPPING[key];
            expect(mapping.name).toBe(name);
            if (expectedValue >= 0)
                expect(mapping.value).toBe(expectedValue);
            else
                expect(mapping.value).toBe(-1);
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases (REQUIRED)
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle undefined keyword gracefully', () => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ keyword: undefined })} setQueryParams={defaultSetQueryParams}/>);
            const input = react_1.screen.getByPlaceholderText('common.operation.search');
            expect(input).toHaveValue('');
        });
        it('should handle empty string keyword', () => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ keyword: '' })} setQueryParams={defaultSetQueryParams}/>);
            const input = react_1.screen.getByPlaceholderText('common.operation.search');
            expect(input).toHaveValue('');
        });
        it('should preserve other query params when updating status', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ keyword: 'test', period: '3' })} setQueryParams={setQueryParams}/>);
            await user.click(react_1.screen.getByText('All'));
            await user.click(await react_1.screen.findByText('Success'));
            expect(setQueryParams).toHaveBeenCalledWith({
                status: 'succeeded',
                period: '3',
                keyword: 'test',
            });
        });
        it('should preserve other query params when updating period', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ keyword: 'test', status: 'failed' })} setQueryParams={setQueryParams}/>);
            await user.click(react_1.screen.getByText('appLog.filter.period.last7days'));
            await user.click(await react_1.screen.findByText('appLog.filter.period.today'));
            expect(setQueryParams).toHaveBeenCalledWith({
                status: 'failed',
                period: '1',
                keyword: 'test',
            });
        });
        it('should preserve other query params when updating keyword', async () => {
            const user = user_event_1.default.setup();
            const setQueryParams = vi.fn();
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({ status: 'failed', period: '3' })} setQueryParams={setQueryParams}/>);
            const input = react_1.screen.getByPlaceholderText('common.operation.search');
            await user.type(input, 'a');
            expect(setQueryParams).toHaveBeenCalledWith({
                status: 'failed',
                period: '3',
                keyword: 'a',
            });
        });
    });
    // --------------------------------------------------------------------------
    // Integration Tests
    // --------------------------------------------------------------------------
    describe('Integration', () => {
        it('should render with all filters visible simultaneously', () => {
            (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams({
                    status: 'succeeded',
                    period: '1',
                    keyword: 'integration test',
                })} setQueryParams={defaultSetQueryParams}/>);
            expect(react_1.screen.getByText('Success')).toBeInTheDocument();
            expect(react_1.screen.getByText('appLog.filter.period.today')).toBeInTheDocument();
            expect(react_1.screen.getByDisplayValue('integration test')).toBeInTheDocument();
        });
        it('should have proper layout with flex and gap', () => {
            const { container } = (0, react_1.render)(<filter_1.default queryParams={createDefaultQueryParams()} setQueryParams={defaultSetQueryParams}/>);
            const filterContainer = container.firstChild;
            expect(filterContainer).toHaveClass('flex');
            expect(filterContainer).toHaveClass('flex-row');
            expect(filterContainer).toHaveClass('gap-2');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWx0ZXIuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7O0dBT0c7O0FBR0gsa0RBQTJFO0FBQzNFLDREQUFtRDtBQUNuRCxpQ0FBZ0M7QUFDaEMscUNBQXNEO0FBRXRELCtFQUErRTtBQUMvRSxRQUFRO0FBQ1IsK0VBQStFO0FBRS9FLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QixFQUFFLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEQsVUFBVSxFQUFFLENBQUMsR0FBRyxJQUFlLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQztDQUM1RCxDQUFDLENBQUMsQ0FBQTtBQUVILCtFQUErRTtBQUMvRSxzQkFBc0I7QUFDdEIsK0VBQStFO0FBRS9FLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxZQUFpQyxFQUFFLEVBQWMsRUFBRSxDQUFDLENBQUM7SUFDckYsTUFBTSxFQUFFLEtBQUs7SUFDYixNQUFNLEVBQUUsR0FBRyxFQUFFLHlCQUF5QjtJQUN0QyxHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRiwrRUFBK0U7QUFDL0UsUUFBUTtBQUNSLCtFQUErRTtBQUUvRSxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixNQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUVyQyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsNkVBQTZFO0lBQzdFLDZCQUE2QjtJQUM3Qiw2RUFBNkU7SUFDN0UsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsRUFBRTtZQUN4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QyxNQUFNLEVBQUUsV0FBVztvQkFDbkIsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsT0FBTyxFQUFFLGtCQUFrQjtpQkFDNUIsQ0FBQyxDQUFDLENBQ0gsY0FBYyxDQUFDLENBQUMscUJBQXFCLENBQUMsRUFDdEMsQ0FDSCxDQUFBO1lBRUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3ZELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzFFLE1BQU0sQ0FBQyxjQUFNLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDMUUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFDMUIsQ0FBQyxnQkFBTSxDQUNMLFdBQVcsQ0FBQyxDQUFDLHdCQUF3QixFQUFFLENBQUMsQ0FDeEMsY0FBYyxDQUFDLENBQUMscUJBQXFCLENBQUMsRUFDdEMsQ0FDSCxDQUFBO1lBRUQsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLFVBQXlCLENBQUE7WUFDM0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUMzQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDOUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGaWx0ZXIgQ29tcG9uZW50IFRlc3RzXG4gKlxuICogVGVzdHMgdGhlIHdvcmtmbG93IGxvZyBmaWx0ZXIgY29tcG9uZW50IHdoaWNoIHByb3ZpZGVzOlxuICogLSBTdGF0dXMgZmlsdGVyaW5nIChhbGwsIHN1Y2NlZWRlZCwgZmFpbGVkLCBzdG9wcGVkLCBwYXJ0aWFsLXN1Y2NlZWRlZClcbiAqIC0gVGltZSBwZXJpb2Qgc2VsZWN0aW9uXG4gKiAtIEtleXdvcmQgc2VhcmNoXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBRdWVyeVBhcmFtIH0gZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHVzZXJFdmVudCBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3VzZXItZXZlbnQnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IEZpbHRlciwgeyBUSU1FX1BFUklPRF9NQVBQSU5HIH0gZnJvbSAnLi9maWx0ZXInXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2tzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IG1vY2tUcmFja0V2ZW50ID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2FtcGxpdHVkZS91dGlscycsICgpID0+ICh7XG4gIHRyYWNrRXZlbnQ6ICguLi5hcmdzOiB1bmtub3duW10pID0+IG1vY2tUcmFja0V2ZW50KC4uLmFyZ3MpLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBGYWN0b3JpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlRGVmYXVsdFF1ZXJ5UGFyYW1zID0gKG92ZXJyaWRlczogUGFydGlhbDxRdWVyeVBhcmFtPiA9IHt9KTogUXVlcnlQYXJhbSA9PiAoe1xuICBzdGF0dXM6ICdhbGwnLFxuICBwZXJpb2Q6ICcyJywgLy8gZGVmYXVsdCB0byBsYXN0IDcgZGF5c1xuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnRmlsdGVyJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0U2V0UXVlcnlQYXJhbXMgPSB2aS5mbigpXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzIChSRVFVSVJFRClcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgcXVlcnlQYXJhbXM9e2NyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcygpfVxuICAgICAgICAgIHNldFF1ZXJ5UGFyYW1zPXtkZWZhdWx0U2V0UXVlcnlQYXJhbXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIHN0YXR1cyBjaGlwLCBwZXJpb2QgY2hpcCwgYW5kIHNlYXJjaCBpbnB1dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlYXJjaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBmaWx0ZXIgY29tcG9uZW50cycsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoKX1cbiAgICAgICAgICBzZXRRdWVyeVBhcmFtcz17ZGVmYXVsdFNldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gU3RhdHVzIGNoaXBcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gUGVyaW9kIGNoaXAgKHNob3dzIHRyYW5zbGF0ZWQga2V5KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy5maWx0ZXIucGVyaW9kLmxhc3Q3ZGF5cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBTZWFyY2ggaW5wdXRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2NvbW1vbi5vcGVyYXRpb24uc2VhcmNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFN0YXR1cyBGaWx0ZXIgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0YXR1cyBGaWx0ZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGN1cnJlbnQgc3RhdHVzIHZhbHVlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgcXVlcnlQYXJhbXM9e2NyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcyh7IHN0YXR1czogJ3N1Y2NlZWRlZCcgfSl9XG4gICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e2RlZmF1bHRTZXRRdWVyeVBhcmFtc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENoaXAgc2hvdWxkIHNob3cgU3VjY2VzcyBmb3Igc3VjY2VlZGVkIHN0YXR1c1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N1Y2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9wZW4gc3RhdHVzIGRyb3Bkb3duIHdoZW4gY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWx0ZXJcbiAgICAgICAgICBxdWVyeVBhcmFtcz17Y3JlYXRlRGVmYXVsdFF1ZXJ5UGFyYW1zKCl9XG4gICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e2RlZmF1bHRTZXRRdWVyeVBhcmFtc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQWxsJykpXG5cbiAgICAgIC8vIFNob3VsZCBzaG93IGFsbCBzdGF0dXMgb3B0aW9uc1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdWNjZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0ZhaWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3RvcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQYXJ0aWFsIFN1Y2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldFF1ZXJ5UGFyYW1zIHdoZW4gc3RhdHVzIGlzIHNlbGVjdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBzZXRRdWVyeVBhcmFtcyA9IHZpLmZuKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgcXVlcnlQYXJhbXM9e2NyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcygpfVxuICAgICAgICAgIHNldFF1ZXJ5UGFyYW1zPXtzZXRRdWVyeVBhcmFtc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQWxsJykpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCdTdWNjZXNzJykpXG5cbiAgICAgIGV4cGVjdChzZXRRdWVyeVBhcmFtcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBzdGF0dXM6ICdzdWNjZWVkZWQnLFxuICAgICAgICBwZXJpb2Q6ICcyJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhY2sgc3RhdHVzIHNlbGVjdGlvbiBldmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWx0ZXJcbiAgICAgICAgICBxdWVyeVBhcmFtcz17Y3JlYXRlRGVmYXVsdFF1ZXJ5UGFyYW1zKCl9XG4gICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e2RlZmF1bHRTZXRRdWVyeVBhcmFtc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQWxsJykpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCdGYWlsJykpXG5cbiAgICAgIGV4cGVjdChtb2NrVHJhY2tFdmVudCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICd3b3JrZmxvd19sb2dfZmlsdGVyX3N0YXR1c19zZWxlY3RlZCcsXG4gICAgICAgIHsgd29ya2Zsb3dfbG9nX2ZpbHRlcl9zdGF0dXM6ICdmYWlsZWQnIH0sXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVzZXQgdG8gYWxsIHdoZW4gc3RhdHVzIGlzIGNsZWFyZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IHNldFF1ZXJ5UGFyYW1zID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgcXVlcnlQYXJhbXM9e2NyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcyh7IHN0YXR1czogJ3N1Y2NlZWRlZCcgfSl9XG4gICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e3NldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gRmluZCB0aGUgY2xlYXIgaWNvbiAoZGl2IHdpdGggZ3JvdXAvY2xlYXIgY2xhc3MpIGluIHRoZSBzdGF0dXMgY2hpcFxuICAgICAgY29uc3QgY2xlYXJJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ncm91cFxcXFwvY2xlYXInKVxuXG4gICAgICBleHBlY3QoY2xlYXJJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGNsZWFySWNvbiEpXG5cbiAgICAgIGV4cGVjdChzZXRRdWVyeVBhcmFtcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBzdGF0dXM6ICdhbGwnLFxuICAgICAgICBwZXJpb2Q6ICcyJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgWydhbGwnLCAnQWxsJ10sXG4gICAgICBbJ3N1Y2NlZWRlZCcsICdTdWNjZXNzJ10sXG4gICAgICBbJ2ZhaWxlZCcsICdGYWlsJ10sXG4gICAgICBbJ3N0b3BwZWQnLCAnU3RvcCddLFxuICAgICAgWydwYXJ0aWFsLXN1Y2NlZWRlZCcsICdQYXJ0aWFsIFN1Y2Nlc3MnXSxcbiAgICBdKSgnc2hvdWxkIGRpc3BsYXkgY29ycmVjdCBsYWJlbCBmb3IgJXMgc3RhdHVzJywgKHN0YXR1c1ZhbHVlLCBleHBlY3RlZExhYmVsKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxGaWx0ZXJcbiAgICAgICAgICBxdWVyeVBhcmFtcz17Y3JlYXRlRGVmYXVsdFF1ZXJ5UGFyYW1zKHsgc3RhdHVzOiBzdGF0dXNWYWx1ZSB9KX1cbiAgICAgICAgICBzZXRRdWVyeVBhcmFtcz17ZGVmYXVsdFNldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoZXhwZWN0ZWRMYWJlbCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFRpbWUgUGVyaW9kIEZpbHRlciBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVGltZSBQZXJpb2QgRmlsdGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjdXJyZW50IHBlcmlvZCB2YWx1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoeyBwZXJpb2Q6ICcxJyB9KX1cbiAgICAgICAgICBzZXRRdWVyeVBhcmFtcz17ZGVmYXVsdFNldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy5maWx0ZXIucGVyaW9kLnRvZGF5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIHBlcmlvZCBkcm9wZG93biB3aGVuIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgcXVlcnlQYXJhbXM9e2NyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcygpfVxuICAgICAgICAgIHNldFF1ZXJ5UGFyYW1zPXtkZWZhdWx0U2V0UXVlcnlQYXJhbXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy5maWx0ZXIucGVyaW9kLmxhc3Q3ZGF5cycpKVxuXG4gICAgICAvLyBTaG91bGQgc2hvdyBhbGwgcGVyaW9kIG9wdGlvbnNcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwTG9nLmZpbHRlci5wZXJpb2QudG9kYXknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwTG9nLmZpbHRlci5wZXJpb2QubGFzdDR3ZWVrcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBMb2cuZmlsdGVyLnBlcmlvZC5sYXN0M21vbnRocycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBMb2cuZmlsdGVyLnBlcmlvZC5hbGxUaW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBzZXRRdWVyeVBhcmFtcyB3aGVuIHBlcmlvZCBpcyBzZWxlY3RlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgc2V0UXVlcnlQYXJhbXMgPSB2aS5mbigpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoKX1cbiAgICAgICAgICBzZXRRdWVyeVBhcmFtcz17c2V0UXVlcnlQYXJhbXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy5maWx0ZXIucGVyaW9kLmxhc3Q3ZGF5cycpKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhd2FpdCBzY3JlZW4uZmluZEJ5VGV4dCgnYXBwTG9nLmZpbHRlci5wZXJpb2QuYWxsVGltZScpKVxuXG4gICAgICBleHBlY3Qoc2V0UXVlcnlQYXJhbXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgc3RhdHVzOiAnYWxsJyxcbiAgICAgICAgcGVyaW9kOiAnOScsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlc2V0IHBlcmlvZCB0byBhbGxUaW1lIHdoZW4gY2xlYXJlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgc2V0UXVlcnlQYXJhbXMgPSB2aS5mbigpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoeyBwZXJpb2Q6ICcyJyB9KX1cbiAgICAgICAgICBzZXRRdWVyeVBhcmFtcz17c2V0UXVlcnlQYXJhbXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBGaW5kIHRoZSBwZXJpb2QgY2hpcCdzIGNsZWFyIGJ1dHRvblxuICAgICAgY29uc3QgcGVyaW9kQ2hpcCA9IHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy5maWx0ZXIucGVyaW9kLmxhc3Q3ZGF5cycpLmNsb3Nlc3QoJ2RpdicpXG4gICAgICBjb25zdCBjbGVhckJ1dHRvbiA9IHBlcmlvZENoaXA/LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblt0eXBlPVwiYnV0dG9uXCJdJylcblxuICAgICAgaWYgKGNsZWFyQnV0dG9uKSB7XG4gICAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2xlYXJCdXR0b24pXG4gICAgICAgIGV4cGVjdChzZXRRdWVyeVBhcmFtcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHN0YXR1czogJ2FsbCcsXG4gICAgICAgICAgcGVyaW9kOiAnOScsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBLZXl3b3JkIFNlYXJjaCBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnS2V5d29yZCBTZWFyY2gnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGN1cnJlbnQga2V5d29yZCB2YWx1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoeyBrZXl3b3JkOiAndGVzdCBzZWFyY2gnIH0pfVxuICAgICAgICAgIHNldFF1ZXJ5UGFyYW1zPXtkZWZhdWx0U2V0UXVlcnlQYXJhbXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5RGlzcGxheVZhbHVlKCd0ZXN0IHNlYXJjaCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBzZXRRdWVyeVBhcmFtcyB3aGVuIHR5cGluZyBpbiBzZWFyY2gnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IHNldFF1ZXJ5UGFyYW1zID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCBXcmFwcGVyID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBbcXVlcnlQYXJhbXMsIHVwZGF0ZVF1ZXJ5UGFyYW1zXSA9IHVzZVN0YXRlPFF1ZXJ5UGFyYW0+KGNyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcygpKVxuICAgICAgICBjb25zdCBoYW5kbGVTZXRRdWVyeVBhcmFtcyA9IChuZXh0OiBRdWVyeVBhcmFtKSA9PiB7XG4gICAgICAgICAgdXBkYXRlUXVlcnlQYXJhbXMobmV4dClcbiAgICAgICAgICBzZXRRdWVyeVBhcmFtcyhuZXh0KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPEZpbHRlclxuICAgICAgICAgICAgcXVlcnlQYXJhbXM9e3F1ZXJ5UGFyYW1zfVxuICAgICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e2hhbmRsZVNldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAgIC8+XG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxXcmFwcGVyIC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zZWFyY2gnKVxuICAgICAgYXdhaXQgdXNlci50eXBlKGlucHV0LCAnd29ya2Zsb3cnKVxuXG4gICAgICAvLyBTaG91bGQgY2FsbCBzZXRRdWVyeVBhcmFtcyBmb3IgZWFjaCBjaGFyYWN0ZXIgdHlwZWRcbiAgICAgIGV4cGVjdChzZXRRdWVyeVBhcmFtcykudG9IYXZlQmVlbkxhc3RDYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IGtleXdvcmQ6ICd3b3JrZmxvdycgfSksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xlYXIga2V5d29yZCB3aGVuIGNsZWFyIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBzZXRRdWVyeVBhcmFtcyA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoeyBrZXl3b3JkOiAndGVzdCcgfSl9XG4gICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e3NldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gVGhlIElucHV0IGNvbXBvbmVudCByZW5kZXJzIGEgY2xlYXIgaWNvbiBkaXYgaW5zaWRlIHRoZSBpbnB1dCB3cmFwcGVyXG4gICAgICAvLyB3aGVuIHNob3dDbGVhckljb24gaXMgdHJ1ZSBhbmQgdmFsdWUgZXhpc3RzXG4gICAgICBjb25zdCBpbnB1dFdyYXBwZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnctXFxcXFsyMDBweFxcXFxdJylcblxuICAgICAgLy8gRmluZCB0aGUgY2xlYXIgaWNvbiBkaXYgKGhhcyBjdXJzb3ItcG9pbnRlciBjbGFzcyBhbmQgY29udGFpbnMgUmlDbG9zZUNpcmNsZUZpbGwpXG4gICAgICBjb25zdCBjbGVhckljb25EaXYgPSBpbnB1dFdyYXBwZXI/LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5jdXJzb3ItcG9pbnRlcicpXG5cbiAgICAgIGV4cGVjdChjbGVhckljb25EaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soY2xlYXJJY29uRGl2ISlcblxuICAgICAgZXhwZWN0KHNldFF1ZXJ5UGFyYW1zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHN0YXR1czogJ2FsbCcsXG4gICAgICAgIHBlcmlvZDogJzInLFxuICAgICAgICBrZXl3b3JkOiAnJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIG9uIGRpcmVjdCBpbnB1dCBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZXRRdWVyeVBhcmFtcyA9IHZpLmZuKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgcXVlcnlQYXJhbXM9e2NyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcygpfVxuICAgICAgICAgIHNldFF1ZXJ5UGFyYW1zPXtzZXRRdWVyeVBhcmFtc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlYXJjaCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ25ldyBzZWFyY2gnIH0gfSlcblxuICAgICAgZXhwZWN0KHNldFF1ZXJ5UGFyYW1zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHN0YXR1czogJ2FsbCcsXG4gICAgICAgIHBlcmlvZDogJzInLFxuICAgICAgICBrZXl3b3JkOiAnbmV3IHNlYXJjaCcsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVElNRV9QRVJJT0RfTUFQUElORyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVElNRV9QRVJJT0RfTUFQUElORycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBtYXBwaW5nIGZvciB0b2RheScsICgpID0+IHtcbiAgICAgIGV4cGVjdChUSU1FX1BFUklPRF9NQVBQSU5HWycxJ10pLnRvRXF1YWwoeyB2YWx1ZTogMCwgbmFtZTogJ3RvZGF5JyB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBtYXBwaW5nIGZvciBsYXN0IDcgZGF5cycsICgpID0+IHtcbiAgICAgIGV4cGVjdChUSU1FX1BFUklPRF9NQVBQSU5HWycyJ10pLnRvRXF1YWwoeyB2YWx1ZTogNywgbmFtZTogJ2xhc3Q3ZGF5cycgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgbWFwcGluZyBmb3IgbGFzdCA0IHdlZWtzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KFRJTUVfUEVSSU9EX01BUFBJTkdbJzMnXSkudG9FcXVhbCh7IHZhbHVlOiAyOCwgbmFtZTogJ2xhc3Q0d2Vla3MnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IG1hcHBpbmcgZm9yIGFsbCB0aW1lJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KFRJTUVfUEVSSU9EX01BUFBJTkdbJzknXSkudG9FcXVhbCh7IHZhbHVlOiAtMSwgbmFtZTogJ2FsbFRpbWUnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBhbGwgOSBwcmVkZWZpbmVkIHRpbWUgcGVyaW9kcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhUSU1FX1BFUklPRF9NQVBQSU5HKSkudG9IYXZlTGVuZ3RoKDkpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgWycxJywgJ3RvZGF5JywgMF0sXG4gICAgICBbJzInLCAnbGFzdDdkYXlzJywgN10sXG4gICAgICBbJzMnLCAnbGFzdDR3ZWVrcycsIDI4XSxcbiAgICAgIFsnOScsICdhbGxUaW1lJywgLTFdLFxuICAgIF0pKCdUSU1FX1BFUklPRF9NQVBQSU5HWyVzXSBzaG91bGQgaGF2ZSBuYW1lPSVzIGFuZCBjb3JyZWN0IHZhbHVlJywgKGtleSwgbmFtZSwgZXhwZWN0ZWRWYWx1ZSkgPT4ge1xuICAgICAgY29uc3QgbWFwcGluZyA9IFRJTUVfUEVSSU9EX01BUFBJTkdba2V5XVxuICAgICAgZXhwZWN0KG1hcHBpbmcubmFtZSkudG9CZShuYW1lKVxuICAgICAgaWYgKGV4cGVjdGVkVmFsdWUgPj0gMClcbiAgICAgICAgZXhwZWN0KG1hcHBpbmcudmFsdWUpLnRvQmUoZXhwZWN0ZWRWYWx1ZSlcbiAgICAgIGVsc2VcbiAgICAgICAgZXhwZWN0KG1hcHBpbmcudmFsdWUpLnRvQmUoLTEpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzIChSRVFVSVJFRClcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGtleXdvcmQgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoeyBrZXl3b3JkOiB1bmRlZmluZWQgfSl9XG4gICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e2RlZmF1bHRTZXRRdWVyeVBhcmFtc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlYXJjaCcpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcga2V5d29yZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoeyBrZXl3b3JkOiAnJyB9KX1cbiAgICAgICAgICBzZXRRdWVyeVBhcmFtcz17ZGVmYXVsdFNldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2NvbW1vbi5vcGVyYXRpb24uc2VhcmNoJylcbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgb3RoZXIgcXVlcnkgcGFyYW1zIHdoZW4gdXBkYXRpbmcgc3RhdHVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBzZXRRdWVyeVBhcmFtcyA9IHZpLmZuKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgcXVlcnlQYXJhbXM9e2NyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcyh7IGtleXdvcmQ6ICd0ZXN0JywgcGVyaW9kOiAnMycgfSl9XG4gICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e3NldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdBbGwnKSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ1N1Y2Nlc3MnKSlcblxuICAgICAgZXhwZWN0KHNldFF1ZXJ5UGFyYW1zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gICAgICAgIHBlcmlvZDogJzMnLFxuICAgICAgICBrZXl3b3JkOiAndGVzdCcsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIG90aGVyIHF1ZXJ5IHBhcmFtcyB3aGVuIHVwZGF0aW5nIHBlcmlvZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3Qgc2V0UXVlcnlQYXJhbXMgPSB2aS5mbigpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoeyBrZXl3b3JkOiAndGVzdCcsIHN0YXR1czogJ2ZhaWxlZCcgfSl9XG4gICAgICAgICAgc2V0UXVlcnlQYXJhbXM9e3NldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdhcHBMb2cuZmlsdGVyLnBlcmlvZC5sYXN0N2RheXMnKSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ2FwcExvZy5maWx0ZXIucGVyaW9kLnRvZGF5JykpXG5cbiAgICAgIGV4cGVjdChzZXRRdWVyeVBhcmFtcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBzdGF0dXM6ICdmYWlsZWQnLFxuICAgICAgICBwZXJpb2Q6ICcxJyxcbiAgICAgICAga2V5d29yZDogJ3Rlc3QnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBvdGhlciBxdWVyeSBwYXJhbXMgd2hlbiB1cGRhdGluZyBrZXl3b3JkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBzZXRRdWVyeVBhcmFtcyA9IHZpLmZuKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RmlsdGVyXG4gICAgICAgICAgcXVlcnlQYXJhbXM9e2NyZWF0ZURlZmF1bHRRdWVyeVBhcmFtcyh7IHN0YXR1czogJ2ZhaWxlZCcsIHBlcmlvZDogJzMnIH0pfVxuICAgICAgICAgIHNldFF1ZXJ5UGFyYW1zPXtzZXRRdWVyeVBhcmFtc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5UGxhY2Vob2xkZXJUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNlYXJjaCcpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUoaW5wdXQsICdhJylcblxuICAgICAgZXhwZWN0KHNldFF1ZXJ5UGFyYW1zKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHN0YXR1czogJ2ZhaWxlZCcsXG4gICAgICAgIHBlcmlvZDogJzMnLFxuICAgICAgICBrZXl3b3JkOiAnYScsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggYWxsIGZpbHRlcnMgdmlzaWJsZSBzaW11bHRhbmVvdXNseScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoe1xuICAgICAgICAgICAgc3RhdHVzOiAnc3VjY2VlZGVkJyxcbiAgICAgICAgICAgIHBlcmlvZDogJzEnLFxuICAgICAgICAgICAga2V5d29yZDogJ2ludGVncmF0aW9uIHRlc3QnLFxuICAgICAgICAgIH0pfVxuICAgICAgICAgIHNldFF1ZXJ5UGFyYW1zPXtkZWZhdWx0U2V0UXVlcnlQYXJhbXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3VjY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwTG9nLmZpbHRlci5wZXJpb2QudG9kYXknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeURpc3BsYXlWYWx1ZSgnaW50ZWdyYXRpb24gdGVzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgbGF5b3V0IHdpdGggZmxleCBhbmQgZ2FwJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEZpbHRlclxuICAgICAgICAgIHF1ZXJ5UGFyYW1zPXtjcmVhdGVEZWZhdWx0UXVlcnlQYXJhbXMoKX1cbiAgICAgICAgICBzZXRRdWVyeVBhcmFtcz17ZGVmYXVsdFNldFF1ZXJ5UGFyYW1zfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgZmlsdGVyQ29udGFpbmVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChmaWx0ZXJDb250YWluZXIpLnRvSGF2ZUNsYXNzKCdmbGV4JylcbiAgICAgIGV4cGVjdChmaWx0ZXJDb250YWluZXIpLnRvSGF2ZUNsYXNzKCdmbGV4LXJvdycpXG4gICAgICBleHBlY3QoZmlsdGVyQ29udGFpbmVyKS50b0hhdmVDbGFzcygnZ2FwLTInKVxuICAgIH0pXG4gIH0pXG59KVxuIl19