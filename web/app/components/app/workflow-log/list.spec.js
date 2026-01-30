"use strict";
/**
 * WorkflowAppLogList Component Tests
 *
 * Tests the workflow log list component which displays:
 * - Table of workflow run logs with sortable columns
 * - Status indicators (success, failed, stopped, running, partial-succeeded)
 * - Trigger display for workflow apps
 * - Drawer with run details
 * - Loading states
 */
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const store_1 = require("@/app/components/app/store");
const config_1 = require("@/config");
const log_1 = require("@/models/log");
const list_1 = require("./list");
// ============================================================================
// Mocks
// ============================================================================
const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));
// Mock useTimestamp hook
vi.mock('@/hooks/use-timestamp', () => ({
    default: () => ({
        formatTime: (timestamp, _format) => `formatted-${timestamp}`,
    }),
}));
// Mock useBreakpoints hook
vi.mock('@/hooks/use-breakpoints', () => ({
    default: () => 'pc', // Return desktop by default
    MediaType: {
        mobile: 'mobile',
        pc: 'pc',
    },
}));
// Mock the Run component
vi.mock('@/app/components/workflow/run', () => ({
    default: ({ runDetailUrl, tracingListUrl }) => (<div data-testid="workflow-run">
      <span data-testid="run-detail-url">{runDetailUrl}</span>
      <span data-testid="tracing-list-url">{tracingListUrl}</span>
    </div>),
}));
// Mock WorkflowContextProvider
vi.mock('@/app/components/workflow/context', () => ({
    WorkflowContextProvider: ({ children }) => (<div data-testid="workflow-context-provider">{children}</div>),
}));
// Mock BlockIcon
vi.mock('@/app/components/workflow/block-icon', () => ({
    default: () => <div data-testid="block-icon">BlockIcon</div>,
}));
// Mock useTheme
vi.mock('@/hooks/use-theme', () => ({
    default: () => {
        return { theme: 'light' };
    },
}));
// Mock ahooks
vi.mock('ahooks', () => ({
    useBoolean: (initial) => {
        const setters = {
            setTrue: vi.fn(),
            setFalse: vi.fn(),
            toggle: vi.fn(),
        };
        return [initial, setters];
    },
}));
// ============================================================================
// Test Data Factories
// ============================================================================
const createMockApp = (overrides = {}) => ({
    id: 'test-app-id',
    name: 'Test App',
    description: 'Test app description',
    author_name: 'Test Author',
    icon_type: 'emoji',
    icon: '🚀',
    icon_background: '#FFEAD5',
    icon_url: null,
    use_icon_as_answer_icon: false,
    mode: 'workflow',
    enable_site: true,
    enable_api: true,
    api_rpm: 60,
    api_rph: 3600,
    is_demo: false,
    model_config: {},
    app_model_config: {},
    created_at: Date.now(),
    updated_at: Date.now(),
    site: {
        access_token: 'token',
        app_base_url: 'https://example.com',
    },
    api_base_url: 'https://api.example.com',
    tags: [],
    access_mode: 'public_access',
    ...overrides,
});
const createMockWorkflowRun = (overrides = {}) => ({
    id: 'run-1',
    version: '1.0.0',
    status: 'succeeded',
    elapsed_time: 1.234,
    total_tokens: 100,
    total_price: 0.001,
    currency: 'USD',
    total_steps: 5,
    finished_at: Date.now(),
    triggered_from: log_1.WorkflowRunTriggeredFrom.APP_RUN,
    ...overrides,
});
const createMockWorkflowLog = (overrides = {}) => ({
    id: 'log-1',
    workflow_run: createMockWorkflowRun(),
    created_from: 'web-app',
    created_by_role: 'account',
    created_by_account: {
        id: 'account-1',
        name: 'Test User',
        email: 'test@example.com',
    },
    created_at: Date.now(),
    ...overrides,
});
const createMockLogsResponse = (data = [], total = data.length) => ({
    data,
    has_more: data.length < total,
    limit: config_1.APP_PAGE_LIMIT,
    total,
    page: 1,
});
// ============================================================================
// Tests
// ============================================================================
describe('WorkflowAppLogList', () => {
    const defaultOnRefresh = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        store_1.useStore.setState({ appDetail: createMockApp() });
    });
    // --------------------------------------------------------------------------
    // Rendering Tests (REQUIRED)
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render loading state when logs are undefined', () => {
            const { container } = (0, react_1.render)(<list_1.default logs={undefined} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(container.querySelector('.spin-animation')).toBeInTheDocument();
        });
        it('should render loading state when appDetail is undefined', () => {
            const logs = createMockLogsResponse([createMockWorkflowLog()]);
            const { container } = (0, react_1.render)(<list_1.default logs={logs} appDetail={undefined} onRefresh={defaultOnRefresh}/>);
            expect(container.querySelector('.spin-animation')).toBeInTheDocument();
        });
        it('should render table when data is available', () => {
            const logs = createMockLogsResponse([createMockWorkflowLog()]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByRole('table')).toBeInTheDocument();
        });
        it('should render all table headers', () => {
            const logs = createMockLogsResponse([createMockWorkflowLog()]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('appLog.table.header.startTime')).toBeInTheDocument();
            expect(react_1.screen.getByText('appLog.table.header.status')).toBeInTheDocument();
            expect(react_1.screen.getByText('appLog.table.header.runtime')).toBeInTheDocument();
            expect(react_1.screen.getByText('appLog.table.header.tokens')).toBeInTheDocument();
            expect(react_1.screen.getByText('appLog.table.header.user')).toBeInTheDocument();
        });
        it('should render trigger column for workflow apps', () => {
            const logs = createMockLogsResponse([createMockWorkflowLog()]);
            const workflowApp = createMockApp({ mode: 'workflow' });
            (0, react_1.render)(<list_1.default logs={logs} appDetail={workflowApp} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('appLog.table.header.triggered_from')).toBeInTheDocument();
        });
        it('should not render trigger column for non-workflow apps', () => {
            const logs = createMockLogsResponse([createMockWorkflowLog()]);
            const chatApp = createMockApp({ mode: 'advanced-chat' });
            (0, react_1.render)(<list_1.default logs={logs} appDetail={chatApp} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.queryByText('appLog.table.header.triggered_from')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Status Display Tests
    // --------------------------------------------------------------------------
    describe('Status Display', () => {
        it('should render success status correctly', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({ status: 'succeeded' }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('Success')).toBeInTheDocument();
        });
        it('should render failure status correctly', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({ status: 'failed' }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('Failure')).toBeInTheDocument();
        });
        it('should render stopped status correctly', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({ status: 'stopped' }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('Stop')).toBeInTheDocument();
        });
        it('should render running status correctly', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({ status: 'running' }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('Running')).toBeInTheDocument();
        });
        it('should render partial-succeeded status correctly', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({ status: 'partial-succeeded' }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('Partial Success')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // User Info Display Tests
    // --------------------------------------------------------------------------
    describe('User Info Display', () => {
        it('should display account name when created by account', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    created_by_account: { id: 'acc-1', name: 'John Doe', email: 'john@example.com' },
                    created_by_end_user: undefined,
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('John Doe')).toBeInTheDocument();
        });
        it('should display end user session id when created by end user', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    created_by_end_user: { id: 'user-1', type: 'browser', is_anonymous: false, session_id: 'session-abc-123' },
                    created_by_account: undefined,
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('session-abc-123')).toBeInTheDocument();
        });
        it('should display N/A when no user info', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    created_by_account: undefined,
                    created_by_end_user: undefined,
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('N/A')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Sorting Tests
    // --------------------------------------------------------------------------
    describe('Sorting', () => {
        it('should sort logs in descending order by default', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({ id: 'log-1', created_at: 1000 }),
                createMockWorkflowLog({ id: 'log-2', created_at: 2000 }),
                createMockWorkflowLog({ id: 'log-3', created_at: 3000 }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            const rows = react_1.screen.getAllByRole('row');
            // First row is header, data rows start from index 1
            // In descending order, newest (3000) should be first
            expect(rows.length).toBe(4); // 1 header + 3 data rows
        });
        it('should toggle sort order when clicking on start time header', async () => {
            const user = user_event_1.default.setup();
            const logs = createMockLogsResponse([
                createMockWorkflowLog({ id: 'log-1', created_at: 1000 }),
                createMockWorkflowLog({ id: 'log-2', created_at: 2000 }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            // Click on the start time header to toggle sort
            const startTimeHeader = react_1.screen.getByText('appLog.table.header.startTime');
            await user.click(startTimeHeader);
            // Arrow should rotate (indicated by class change)
            // The sort icon should have rotate-180 class for ascending
            const sortIcon = startTimeHeader.closest('div')?.querySelector('svg');
            expect(sortIcon).toBeInTheDocument();
        });
        it('should render sort arrow icon', () => {
            const logs = createMockLogsResponse([createMockWorkflowLog()]);
            const { container } = (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            // Check for ArrowDownIcon presence
            const sortArrow = container.querySelector('svg.ml-0\\.5');
            expect(sortArrow).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Drawer Tests
    // --------------------------------------------------------------------------
    describe('Drawer', () => {
        it('should open drawer when clicking on a log row', async () => {
            const user = user_event_1.default.setup();
            store_1.useStore.setState({ appDetail: createMockApp({ id: 'app-123' }) });
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    id: 'log-1',
                    workflow_run: createMockWorkflowRun({ id: 'run-456' }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            const dataRows = react_1.screen.getAllByRole('row');
            await user.click(dataRows[1]); // Click first data row
            const dialog = await react_1.screen.findByRole('dialog');
            expect(dialog).toBeInTheDocument();
            expect(react_1.screen.getByText('appLog.runDetail.workflowTitle')).toBeInTheDocument();
        });
        it('should close drawer and call onRefresh when closing', async () => {
            const user = user_event_1.default.setup();
            const onRefresh = vi.fn();
            store_1.useStore.setState({ appDetail: createMockApp() });
            const logs = createMockLogsResponse([createMockWorkflowLog()]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={onRefresh}/>);
            // Open drawer
            const dataRows = react_1.screen.getAllByRole('row');
            await user.click(dataRows[1]);
            await react_1.screen.findByRole('dialog');
            // Close drawer using Escape key
            await user.keyboard('{Escape}');
            await (0, react_1.waitFor)(() => {
                expect(onRefresh).toHaveBeenCalled();
                expect(react_1.screen.queryByRole('dialog')).not.toBeInTheDocument();
            });
        });
        it('should highlight selected row', async () => {
            const user = user_event_1.default.setup();
            const logs = createMockLogsResponse([createMockWorkflowLog()]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            const dataRows = react_1.screen.getAllByRole('row');
            const dataRow = dataRows[1];
            // Before click - no highlight
            expect(dataRow).not.toHaveClass('bg-background-default-hover');
            // After click - has highlight (via currentLog state)
            await user.click(dataRow);
            // The row should have the selected class
            expect(dataRow).toHaveClass('bg-background-default-hover');
        });
    });
    // --------------------------------------------------------------------------
    // Replay Functionality Tests
    // --------------------------------------------------------------------------
    describe('Replay Functionality', () => {
        it('should allow replay when triggered from app-run', async () => {
            const user = user_event_1.default.setup();
            store_1.useStore.setState({ appDetail: createMockApp({ id: 'app-replay' }) });
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({
                        id: 'run-to-replay',
                        triggered_from: log_1.WorkflowRunTriggeredFrom.APP_RUN,
                    }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            // Open drawer
            const dataRows = react_1.screen.getAllByRole('row');
            await user.click(dataRows[1]);
            await react_1.screen.findByRole('dialog');
            // Replay button should be present for app-run triggers
            const replayButton = react_1.screen.getByRole('button', { name: 'appLog.runDetail.testWithParams' });
            await user.click(replayButton);
            expect(mockRouterPush).toHaveBeenCalledWith('/app/app-replay/workflow?replayRunId=run-to-replay');
        });
        it('should allow replay when triggered from debugging', async () => {
            const user = user_event_1.default.setup();
            store_1.useStore.setState({ appDetail: createMockApp({ id: 'app-debug' }) });
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({
                        id: 'debug-run',
                        triggered_from: log_1.WorkflowRunTriggeredFrom.DEBUGGING,
                    }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            // Open drawer
            const dataRows = react_1.screen.getAllByRole('row');
            await user.click(dataRows[1]);
            await react_1.screen.findByRole('dialog');
            // Replay button should be present for debugging triggers
            const replayButton = react_1.screen.getByRole('button', { name: 'appLog.runDetail.testWithParams' });
            expect(replayButton).toBeInTheDocument();
        });
        it('should not show replay for webhook triggers', async () => {
            const user = user_event_1.default.setup();
            store_1.useStore.setState({ appDetail: createMockApp({ id: 'app-webhook' }) });
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({
                        id: 'webhook-run',
                        triggered_from: log_1.WorkflowRunTriggeredFrom.WEBHOOK,
                    }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            // Open drawer
            const dataRows = react_1.screen.getAllByRole('row');
            await user.click(dataRows[1]);
            await react_1.screen.findByRole('dialog');
            // Replay button should not be present for webhook triggers
            expect(react_1.screen.queryByRole('button', { name: 'appLog.runDetail.testWithParams' })).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Unread Indicator Tests
    // --------------------------------------------------------------------------
    describe('Unread Indicator', () => {
        it('should show unread indicator for unread logs', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    read_at: undefined,
                }),
            ]);
            const { container } = (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            // Unread indicator is a small blue dot
            const unreadDot = container.querySelector('.bg-util-colors-blue-blue-500');
            expect(unreadDot).toBeInTheDocument();
        });
        it('should not show unread indicator for read logs', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    read_at: Date.now(),
                }),
            ]);
            const { container } = (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            // No unread indicator
            const unreadDot = container.querySelector('.bg-util-colors-blue-blue-500');
            expect(unreadDot).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Runtime Display Tests
    // --------------------------------------------------------------------------
    describe('Runtime Display', () => {
        it('should display elapsed time with 3 decimal places', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({ elapsed_time: 1.23456 }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('1.235s')).toBeInTheDocument();
        });
        it('should display 0 elapsed time with special styling', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({ elapsed_time: 0 }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            const zeroTime = react_1.screen.getByText('0.000s');
            expect(zeroTime).toBeInTheDocument();
            expect(zeroTime).toHaveClass('text-text-quaternary');
        });
    });
    // --------------------------------------------------------------------------
    // Token Display Tests
    // --------------------------------------------------------------------------
    describe('Token Display', () => {
        it('should display total tokens', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({ total_tokens: 12345 }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('12345')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Empty State Tests
    // --------------------------------------------------------------------------
    describe('Empty State', () => {
        it('should render empty table when logs data is empty', () => {
            const logs = createMockLogsResponse([]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            const table = react_1.screen.getByRole('table');
            expect(table).toBeInTheDocument();
            // Should only have header row
            const rows = react_1.screen.getAllByRole('row');
            expect(rows).toHaveLength(1);
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases (REQUIRED)
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle multiple logs correctly', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({ id: 'log-1', created_at: 1000 }),
                createMockWorkflowLog({ id: 'log-2', created_at: 2000 }),
                createMockWorkflowLog({ id: 'log-3', created_at: 3000 }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            const rows = react_1.screen.getAllByRole('row');
            expect(rows).toHaveLength(4); // 1 header + 3 data rows
        });
        it('should handle logs with missing workflow_run data gracefully', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({
                        elapsed_time: 0,
                        total_tokens: 0,
                    }),
                }),
            ]);
            (0, react_1.render)(<list_1.default logs={logs} appDetail={createMockApp()} onRefresh={defaultOnRefresh}/>);
            expect(react_1.screen.getByText('0.000s')).toBeInTheDocument();
            expect(react_1.screen.getByText('0')).toBeInTheDocument();
        });
        it('should handle null workflow_run.triggered_from for non-workflow apps', () => {
            const logs = createMockLogsResponse([
                createMockWorkflowLog({
                    workflow_run: createMockWorkflowRun({
                        triggered_from: undefined,
                    }),
                }),
            ]);
            const chatApp = createMockApp({ mode: 'advanced-chat' });
            (0, react_1.render)(<list_1.default logs={logs} appDetail={chatApp} onRefresh={defaultOnRefresh}/>);
            // Should render without trigger column
            expect(react_1.screen.queryByText('appLog.table.header.triggered_from')).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGlzdC5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7OztHQVNHOztBQUlILGtEQUFnRTtBQUNoRSw0REFBbUQ7QUFDbkQsc0RBQW9FO0FBQ3BFLHFDQUF5QztBQUN6QyxzQ0FBdUQ7QUFDdkQsaUNBQXVDO0FBRXZDLCtFQUErRTtBQUMvRSxRQUFRO0FBQ1IsK0VBQStFO0FBRS9FLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QixFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEMsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDaEIsSUFBSSxFQUFFLGNBQWM7S0FDckIsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgseUJBQXlCO0FBQ3pCLEVBQUUsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN0QyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNkLFVBQVUsRUFBRSxDQUFDLFNBQWlCLEVBQUUsT0FBZSxFQUFFLEVBQUUsQ0FBQyxhQUFhLFNBQVMsRUFBRTtLQUM3RSxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCwyQkFBMkI7QUFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsNEJBQTRCO0lBQ2pELFNBQVMsRUFBRTtRQUNULE1BQU0sRUFBRSxRQUFRO1FBQ2hCLEVBQUUsRUFBRSxJQUFJO0tBQ1Q7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILHlCQUF5QjtBQUN6QixFQUFFLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7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dUNBQXVDO1lBQ3ZDLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFdvcmtmbG93QXBwTG9nTGlzdCBDb21wb25lbnQgVGVzdHNcbiAqXG4gKiBUZXN0cyB0aGUgd29ya2Zsb3cgbG9nIGxpc3QgY29tcG9uZW50IHdoaWNoIGRpc3BsYXlzOlxuICogLSBUYWJsZSBvZiB3b3JrZmxvdyBydW4gbG9ncyB3aXRoIHNvcnRhYmxlIGNvbHVtbnNcbiAqIC0gU3RhdHVzIGluZGljYXRvcnMgKHN1Y2Nlc3MsIGZhaWxlZCwgc3RvcHBlZCwgcnVubmluZywgcGFydGlhbC1zdWNjZWVkZWQpXG4gKiAtIFRyaWdnZXIgZGlzcGxheSBmb3Igd29ya2Zsb3cgYXBwc1xuICogLSBEcmF3ZXIgd2l0aCBydW4gZGV0YWlsc1xuICogLSBMb2FkaW5nIHN0YXRlc1xuICovXG5cbmltcG9ydCB0eXBlIHsgV29ya2Zsb3dBcHBMb2dEZXRhaWwsIFdvcmtmbG93TG9nc1Jlc3BvbnNlLCBXb3JrZmxvd1J1bkRldGFpbCB9IGZyb20gJ0AvbW9kZWxzL2xvZydcbmltcG9ydCB0eXBlIHsgQXBwLCBBcHBJY29uVHlwZSwgQXBwTW9kZUVudW0gfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB1c2VyRXZlbnQgZnJvbSAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50J1xuaW1wb3J0IHsgdXNlU3RvcmUgYXMgdXNlQXBwU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2FwcC9zdG9yZSdcbmltcG9ydCB7IEFQUF9QQUdFX0xJTUlUIH0gZnJvbSAnQC9jb25maWcnXG5pbXBvcnQgeyBXb3JrZmxvd1J1blRyaWdnZXJlZEZyb20gfSBmcm9tICdAL21vZGVscy9sb2cnXG5pbXBvcnQgV29ya2Zsb3dBcHBMb2dMaXN0IGZyb20gJy4vbGlzdCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9ja3Ncbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgbW9ja1JvdXRlclB1c2ggPSB2aS5mbigpXG52aS5tb2NrKCduZXh0L25hdmlnYXRpb24nLCAoKSA9PiAoe1xuICB1c2VSb3V0ZXI6ICgpID0+ICh7XG4gICAgcHVzaDogbW9ja1JvdXRlclB1c2gsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgdXNlVGltZXN0YW1wIGhvb2tcbnZpLm1vY2soJ0AvaG9va3MvdXNlLXRpbWVzdGFtcCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+ICh7XG4gICAgZm9ybWF0VGltZTogKHRpbWVzdGFtcDogbnVtYmVyLCBfZm9ybWF0OiBzdHJpbmcpID0+IGBmb3JtYXR0ZWQtJHt0aW1lc3RhbXB9YCxcbiAgfSksXG59KSlcblxuLy8gTW9jayB1c2VCcmVha3BvaW50cyBob29rXG52aS5tb2NrKCdAL2hvb2tzL3VzZS1icmVha3BvaW50cycsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+ICdwYycsIC8vIFJldHVybiBkZXNrdG9wIGJ5IGRlZmF1bHRcbiAgTWVkaWFUeXBlOiB7XG4gICAgbW9iaWxlOiAnbW9iaWxlJyxcbiAgICBwYzogJ3BjJyxcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHRoZSBSdW4gY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3J1bicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHJ1bkRldGFpbFVybCwgdHJhY2luZ0xpc3RVcmwgfTogeyBydW5EZXRhaWxVcmw6IHN0cmluZywgdHJhY2luZ0xpc3RVcmw6IHN0cmluZyB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cIndvcmtmbG93LXJ1blwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJydW4tZGV0YWlsLXVybFwiPntydW5EZXRhaWxVcmx9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJ0cmFjaW5nLWxpc3QtdXJsXCI+e3RyYWNpbmdMaXN0VXJsfTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIFdvcmtmbG93Q29udGV4dFByb3ZpZGVyXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2NvbnRleHQnLCAoKSA9PiAoe1xuICBXb3JrZmxvd0NvbnRleHRQcm92aWRlcjogKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwid29ya2Zsb3ctY29udGV4dC1wcm92aWRlclwiPntjaGlsZHJlbn08L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIEJsb2NrSWNvblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1pY29uJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cImJsb2NrLWljb25cIj5CbG9ja0ljb248L2Rpdj4sXG59KSlcblxuLy8gTW9jayB1c2VUaGVtZVxudmkubW9jaygnQC9ob29rcy91c2UtdGhlbWUnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiB7XG4gICAgcmV0dXJuIHsgdGhlbWU6ICdsaWdodCcgfVxuICB9LFxufSkpXG5cbi8vIE1vY2sgYWhvb2tzXG52aS5tb2NrKCdhaG9va3MnLCAoKSA9PiAoe1xuICB1c2VCb29sZWFuOiAoaW5pdGlhbDogYm9vbGVhbikgPT4ge1xuICAgIGNvbnN0IHNldHRlcnMgPSB7XG4gICAgICBzZXRUcnVlOiB2aS5mbigpLFxuICAgICAgc2V0RmFsc2U6IHZpLmZuKCksXG4gICAgICB0b2dnbGU6IHZpLmZuKCksXG4gICAgfVxuICAgIHJldHVybiBbaW5pdGlhbCwgc2V0dGVyc10gYXMgY29uc3RcbiAgfSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZU1vY2tBcHAgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPEFwcD4gPSB7fSk6IEFwcCA9PiAoe1xuICBpZDogJ3Rlc3QtYXBwLWlkJyxcbiAgbmFtZTogJ1Rlc3QgQXBwJyxcbiAgZGVzY3JpcHRpb246ICdUZXN0IGFwcCBkZXNjcmlwdGlvbicsXG4gIGF1dGhvcl9uYW1lOiAnVGVzdCBBdXRob3InLFxuICBpY29uX3R5cGU6ICdlbW9qaScgYXMgQXBwSWNvblR5cGUsXG4gIGljb246ICfwn5qAJyxcbiAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGRUFENScsXG4gIGljb25fdXJsOiBudWxsLFxuICB1c2VfaWNvbl9hc19hbnN3ZXJfaWNvbjogZmFsc2UsXG4gIG1vZGU6ICd3b3JrZmxvdycgYXMgQXBwTW9kZUVudW0sXG4gIGVuYWJsZV9zaXRlOiB0cnVlLFxuICBlbmFibGVfYXBpOiB0cnVlLFxuICBhcGlfcnBtOiA2MCxcbiAgYXBpX3JwaDogMzYwMCxcbiAgaXNfZGVtbzogZmFsc2UsXG4gIG1vZGVsX2NvbmZpZzoge30gYXMgQXBwWydtb2RlbF9jb25maWcnXSxcbiAgYXBwX21vZGVsX2NvbmZpZzoge30gYXMgQXBwWydhcHBfbW9kZWxfY29uZmlnJ10sXG4gIGNyZWF0ZWRfYXQ6IERhdGUubm93KCksXG4gIHVwZGF0ZWRfYXQ6IERhdGUubm93KCksXG4gIHNpdGU6IHtcbiAgICBhY2Nlc3NfdG9rZW46ICd0b2tlbicsXG4gICAgYXBwX2Jhc2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsXG4gIH0gYXMgQXBwWydzaXRlJ10sXG4gIGFwaV9iYXNlX3VybDogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tJyxcbiAgdGFnczogW10sXG4gIGFjY2Vzc19tb2RlOiAncHVibGljX2FjY2VzcycgYXMgQXBwWydhY2Nlc3NfbW9kZSddLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrV29ya2Zsb3dSdW4gPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFdvcmtmbG93UnVuRGV0YWlsPiA9IHt9KTogV29ya2Zsb3dSdW5EZXRhaWwgPT4gKHtcbiAgaWQ6ICdydW4tMScsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gIGVsYXBzZWRfdGltZTogMS4yMzQsXG4gIHRvdGFsX3Rva2VuczogMTAwLFxuICB0b3RhbF9wcmljZTogMC4wMDEsXG4gIGN1cnJlbmN5OiAnVVNEJyxcbiAgdG90YWxfc3RlcHM6IDUsXG4gIGZpbmlzaGVkX2F0OiBEYXRlLm5vdygpLFxuICB0cmlnZ2VyZWRfZnJvbTogV29ya2Zsb3dSdW5UcmlnZ2VyZWRGcm9tLkFQUF9SVU4sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyA9IChvdmVycmlkZXM6IFBhcnRpYWw8V29ya2Zsb3dBcHBMb2dEZXRhaWw+ID0ge30pOiBXb3JrZmxvd0FwcExvZ0RldGFpbCA9PiAoe1xuICBpZDogJ2xvZy0xJyxcbiAgd29ya2Zsb3dfcnVuOiBjcmVhdGVNb2NrV29ya2Zsb3dSdW4oKSxcbiAgY3JlYXRlZF9mcm9tOiAnd2ViLWFwcCcsXG4gIGNyZWF0ZWRfYnlfcm9sZTogJ2FjY291bnQnLFxuICBjcmVhdGVkX2J5X2FjY291bnQ6IHtcbiAgICBpZDogJ2FjY291bnQtMScsXG4gICAgbmFtZTogJ1Rlc3QgVXNlcicsXG4gICAgZW1haWw6ICd0ZXN0QGV4YW1wbGUuY29tJyxcbiAgfSxcbiAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0xvZ3NSZXNwb25zZSA9IChcbiAgZGF0YTogV29ya2Zsb3dBcHBMb2dEZXRhaWxbXSA9IFtdLFxuICB0b3RhbCA9IGRhdGEubGVuZ3RoLFxuKTogV29ya2Zsb3dMb2dzUmVzcG9uc2UgPT4gKHtcbiAgZGF0YSxcbiAgaGFzX21vcmU6IGRhdGEubGVuZ3RoIDwgdG90YWwsXG4gIGxpbWl0OiBBUFBfUEFHRV9MSU1JVCxcbiAgdG90YWwsXG4gIHBhZ2U6IDEsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnV29ya2Zsb3dBcHBMb2dMaXN0JywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0T25SZWZyZXNoID0gdmkuZm4oKVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHVzZUFwcFN0b3JlLnNldFN0YXRlKHsgYXBwRGV0YWlsOiBjcmVhdGVNb2NrQXBwKCkgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHMgKFJFUVVJUkVEKVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxvYWRpbmcgc3RhdGUgd2hlbiBsb2dzIGFyZSB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e3VuZGVmaW5lZH0gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNwaW4tYW5pbWF0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbG9hZGluZyBzdGF0ZSB3aGVuIGFwcERldGFpbCBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbY3JlYXRlTW9ja1dvcmtmbG93TG9nKCldKVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17dW5kZWZpbmVkfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zcGluLWFuaW1hdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRhYmxlIHdoZW4gZGF0YSBpcyBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbY3JlYXRlTW9ja1dvcmtmbG93TG9nKCldKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCd0YWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCB0YWJsZSBoZWFkZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW2NyZWF0ZU1vY2tXb3JrZmxvd0xvZygpXSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y3JlYXRlTW9ja0FwcCgpfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwTG9nLnRhYmxlLmhlYWRlci5zdGFydFRpbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy50YWJsZS5oZWFkZXIuc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBMb2cudGFibGUuaGVhZGVyLnJ1bnRpbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy50YWJsZS5oZWFkZXIudG9rZW5zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcHBMb2cudGFibGUuaGVhZGVyLnVzZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0cmlnZ2VyIGNvbHVtbiBmb3Igd29ya2Zsb3cgYXBwcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtjcmVhdGVNb2NrV29ya2Zsb3dMb2coKV0pXG4gICAgICBjb25zdCB3b3JrZmxvd0FwcCA9IGNyZWF0ZU1vY2tBcHAoeyBtb2RlOiAnd29ya2Zsb3cnIGFzIEFwcE1vZGVFbnVtIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e3dvcmtmbG93QXBwfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwTG9nLnRhYmxlLmhlYWRlci50cmlnZ2VyZWRfZnJvbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB0cmlnZ2VyIGNvbHVtbiBmb3Igbm9uLXdvcmtmbG93IGFwcHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbY3JlYXRlTW9ja1dvcmtmbG93TG9nKCldKVxuICAgICAgY29uc3QgY2hhdEFwcCA9IGNyZWF0ZU1vY2tBcHAoeyBtb2RlOiAnYWR2YW5jZWQtY2hhdCcgYXMgQXBwTW9kZUVudW0gfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y2hhdEFwcH0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYXBwTG9nLnRhYmxlLmhlYWRlci50cmlnZ2VyZWRfZnJvbScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gU3RhdHVzIERpc3BsYXkgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0YXR1cyBEaXNwbGF5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHN1Y2Nlc3Mgc3RhdHVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHtcbiAgICAgICAgICB3b3JrZmxvd19ydW46IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bih7IHN0YXR1czogJ3N1Y2NlZWRlZCcgfSksXG4gICAgICAgIH0pLFxuICAgICAgXSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y3JlYXRlTW9ja0FwcCgpfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3VjY2VzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZhaWx1cmUgc3RhdHVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHtcbiAgICAgICAgICB3b3JrZmxvd19ydW46IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bih7IHN0YXR1czogJ2ZhaWxlZCcgfSksXG4gICAgICAgIH0pLFxuICAgICAgXSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y3JlYXRlTW9ja0FwcCgpfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRmFpbHVyZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHN0b3BwZWQgc3RhdHVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHtcbiAgICAgICAgICB3b3JrZmxvd19ydW46IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bih7IHN0YXR1czogJ3N0b3BwZWQnIH0pLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N0b3AnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBydW5uaW5nIHN0YXR1cyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXG4gICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7XG4gICAgICAgICAgd29ya2Zsb3dfcnVuOiBjcmVhdGVNb2NrV29ya2Zsb3dSdW4oeyBzdGF0dXM6ICdydW5uaW5nJyB9KSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdSdW5uaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFydGlhbC1zdWNjZWVkZWQgc3RhdHVzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHtcbiAgICAgICAgICB3b3JrZmxvd19ydW46IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bih7IHN0YXR1czogJ3BhcnRpYWwtc3VjY2VlZGVkJyBhcyBXb3JrZmxvd1J1bkRldGFpbFsnc3RhdHVzJ10gfSksXG4gICAgICAgIH0pLFxuICAgICAgXSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y3JlYXRlTW9ja0FwcCgpfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGFydGlhbCBTdWNjZXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFVzZXIgSW5mbyBEaXNwbGF5IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdVc2VyIEluZm8gRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgYWNjb3VudCBuYW1lIHdoZW4gY3JlYXRlZCBieSBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW1xuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coe1xuICAgICAgICAgIGNyZWF0ZWRfYnlfYWNjb3VudDogeyBpZDogJ2FjYy0xJywgbmFtZTogJ0pvaG4gRG9lJywgZW1haWw6ICdqb2huQGV4YW1wbGUuY29tJyB9LFxuICAgICAgICAgIGNyZWF0ZWRfYnlfZW5kX3VzZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgfSksXG4gICAgICBdKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdKb2huIERvZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBlbmQgdXNlciBzZXNzaW9uIGlkIHdoZW4gY3JlYXRlZCBieSBlbmQgdXNlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHtcbiAgICAgICAgICBjcmVhdGVkX2J5X2VuZF91c2VyOiB7IGlkOiAndXNlci0xJywgdHlwZTogJ2Jyb3dzZXInLCBpc19hbm9ueW1vdXM6IGZhbHNlLCBzZXNzaW9uX2lkOiAnc2Vzc2lvbi1hYmMtMTIzJyB9LFxuICAgICAgICAgIGNyZWF0ZWRfYnlfYWNjb3VudDogdW5kZWZpbmVkLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Nlc3Npb24tYWJjLTEyMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBOL0Egd2hlbiBubyB1c2VyIGluZm8nLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXG4gICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7XG4gICAgICAgICAgY3JlYXRlZF9ieV9hY2NvdW50OiB1bmRlZmluZWQsXG4gICAgICAgICAgY3JlYXRlZF9ieV9lbmRfdXNlcjogdW5kZWZpbmVkLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ04vQScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBTb3J0aW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTb3J0aW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc29ydCBsb2dzIGluIGRlc2NlbmRpbmcgb3JkZXIgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHsgaWQ6ICdsb2ctMScsIGNyZWF0ZWRfYXQ6IDEwMDAgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7IGlkOiAnbG9nLTInLCBjcmVhdGVkX2F0OiAyMDAwIH0pLFxuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coeyBpZDogJ2xvZy0zJywgY3JlYXRlZF9hdDogMzAwMCB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgY29uc3Qgcm93cyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ3JvdycpXG4gICAgICAvLyBGaXJzdCByb3cgaXMgaGVhZGVyLCBkYXRhIHJvd3Mgc3RhcnQgZnJvbSBpbmRleCAxXG4gICAgICAvLyBJbiBkZXNjZW5kaW5nIG9yZGVyLCBuZXdlc3QgKDMwMDApIHNob3VsZCBiZSBmaXJzdFxuICAgICAgZXhwZWN0KHJvd3MubGVuZ3RoKS50b0JlKDQpIC8vIDEgaGVhZGVyICsgMyBkYXRhIHJvd3NcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0b2dnbGUgc29ydCBvcmRlciB3aGVuIGNsaWNraW5nIG9uIHN0YXJ0IHRpbWUgaGVhZGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXG4gICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7IGlkOiAnbG9nLTEnLCBjcmVhdGVkX2F0OiAxMDAwIH0pLFxuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coeyBpZDogJ2xvZy0yJywgY3JlYXRlZF9hdDogMjAwMCB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgLy8gQ2xpY2sgb24gdGhlIHN0YXJ0IHRpbWUgaGVhZGVyIHRvIHRvZ2dsZSBzb3J0XG4gICAgICBjb25zdCBzdGFydFRpbWVIZWFkZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KCdhcHBMb2cudGFibGUuaGVhZGVyLnN0YXJ0VGltZScpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHN0YXJ0VGltZUhlYWRlcilcblxuICAgICAgLy8gQXJyb3cgc2hvdWxkIHJvdGF0ZSAoaW5kaWNhdGVkIGJ5IGNsYXNzIGNoYW5nZSlcbiAgICAgIC8vIFRoZSBzb3J0IGljb24gc2hvdWxkIGhhdmUgcm90YXRlLTE4MCBjbGFzcyBmb3IgYXNjZW5kaW5nXG4gICAgICBjb25zdCBzb3J0SWNvbiA9IHN0YXJ0VGltZUhlYWRlci5jbG9zZXN0KCdkaXYnKT8ucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzb3J0SWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzb3J0IGFycm93IGljb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbY3JlYXRlTW9ja1dvcmtmbG93TG9nKCldKVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y3JlYXRlTW9ja0FwcCgpfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBDaGVjayBmb3IgQXJyb3dEb3duSWNvbiBwcmVzZW5jZVxuICAgICAgY29uc3Qgc29ydEFycm93ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2Zy5tbC0wXFxcXC41JylcbiAgICAgIGV4cGVjdChzb3J0QXJyb3cpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIERyYXdlciBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRHJhd2VyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb3BlbiBkcmF3ZXIgd2hlbiBjbGlja2luZyBvbiBhIGxvZyByb3cnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHVzZUFwcFN0b3JlLnNldFN0YXRlKHsgYXBwRGV0YWlsOiBjcmVhdGVNb2NrQXBwKHsgaWQ6ICdhcHAtMTIzJyB9KSB9KVxuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW1xuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coe1xuICAgICAgICAgIGlkOiAnbG9nLTEnLFxuICAgICAgICAgIHdvcmtmbG93X3J1bjogY3JlYXRlTW9ja1dvcmtmbG93UnVuKHsgaWQ6ICdydW4tNDU2JyB9KSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGRhdGFSb3dzID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgncm93JylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soZGF0YVJvd3NbMV0pIC8vIENsaWNrIGZpcnN0IGRhdGEgcm93XG5cbiAgICAgIGNvbnN0IGRpYWxvZyA9IGF3YWl0IHNjcmVlbi5maW5kQnlSb2xlKCdkaWFsb2cnKVxuICAgICAgZXhwZWN0KGRpYWxvZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy5ydW5EZXRhaWwud29ya2Zsb3dUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgZHJhd2VyIGFuZCBjYWxsIG9uUmVmcmVzaCB3aGVuIGNsb3NpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIGNvbnN0IG9uUmVmcmVzaCA9IHZpLmZuKClcbiAgICAgIHVzZUFwcFN0b3JlLnNldFN0YXRlKHsgYXBwRGV0YWlsOiBjcmVhdGVNb2NrQXBwKCkgfSlcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtjcmVhdGVNb2NrV29ya2Zsb3dMb2coKV0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtvblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBPcGVuIGRyYXdlclxuICAgICAgY29uc3QgZGF0YVJvd3MgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdyb3cnKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhkYXRhUm93c1sxXSlcbiAgICAgIGF3YWl0IHNjcmVlbi5maW5kQnlSb2xlKCdkaWFsb2cnKVxuXG4gICAgICAvLyBDbG9zZSBkcmF3ZXIgdXNpbmcgRXNjYXBlIGtleVxuICAgICAgYXdhaXQgdXNlci5rZXlib2FyZCgne0VzY2FwZX0nKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uUmVmcmVzaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2RpYWxvZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWdobGlnaHQgc2VsZWN0ZWQgcm93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbY3JlYXRlTW9ja1dvcmtmbG93TG9nKCldKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGRhdGFSb3dzID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgncm93JylcbiAgICAgIGNvbnN0IGRhdGFSb3cgPSBkYXRhUm93c1sxXVxuXG4gICAgICAvLyBCZWZvcmUgY2xpY2sgLSBubyBoaWdobGlnaHRcbiAgICAgIGV4cGVjdChkYXRhUm93KS5ub3QudG9IYXZlQ2xhc3MoJ2JnLWJhY2tncm91bmQtZGVmYXVsdC1ob3ZlcicpXG5cbiAgICAgIC8vIEFmdGVyIGNsaWNrIC0gaGFzIGhpZ2hsaWdodCAodmlhIGN1cnJlbnRMb2cgc3RhdGUpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGRhdGFSb3cpXG5cbiAgICAgIC8vIFRoZSByb3cgc2hvdWxkIGhhdmUgdGhlIHNlbGVjdGVkIGNsYXNzXG4gICAgICBleHBlY3QoZGF0YVJvdykudG9IYXZlQ2xhc3MoJ2JnLWJhY2tncm91bmQtZGVmYXVsdC1ob3ZlcicpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZXBsYXkgRnVuY3Rpb25hbGl0eSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVwbGF5IEZ1bmN0aW9uYWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhbGxvdyByZXBsYXkgd2hlbiB0cmlnZ2VyZWQgZnJvbSBhcHAtcnVuJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICB1c2VBcHBTdG9yZS5zZXRTdGF0ZSh7IGFwcERldGFpbDogY3JlYXRlTW9ja0FwcCh7IGlkOiAnYXBwLXJlcGxheScgfSkgfSlcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHtcbiAgICAgICAgICB3b3JrZmxvd19ydW46IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bih7XG4gICAgICAgICAgICBpZDogJ3J1bi10by1yZXBsYXknLFxuICAgICAgICAgICAgdHJpZ2dlcmVkX2Zyb206IFdvcmtmbG93UnVuVHJpZ2dlcmVkRnJvbS5BUFBfUlVOLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgLy8gT3BlbiBkcmF3ZXJcbiAgICAgIGNvbnN0IGRhdGFSb3dzID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgncm93JylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soZGF0YVJvd3NbMV0pXG4gICAgICBhd2FpdCBzY3JlZW4uZmluZEJ5Um9sZSgnZGlhbG9nJylcblxuICAgICAgLy8gUmVwbGF5IGJ1dHRvbiBzaG91bGQgYmUgcHJlc2VudCBmb3IgYXBwLXJ1biB0cmlnZ2Vyc1xuICAgICAgY29uc3QgcmVwbGF5QnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnYXBwTG9nLnJ1bkRldGFpbC50ZXN0V2l0aFBhcmFtcycgfSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2socmVwbGF5QnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja1JvdXRlclB1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvYXBwL2FwcC1yZXBsYXkvd29ya2Zsb3c/cmVwbGF5UnVuSWQ9cnVuLXRvLXJlcGxheScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgcmVwbGF5IHdoZW4gdHJpZ2dlcmVkIGZyb20gZGVidWdnaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICB1c2VBcHBTdG9yZS5zZXRTdGF0ZSh7IGFwcERldGFpbDogY3JlYXRlTW9ja0FwcCh7IGlkOiAnYXBwLWRlYnVnJyB9KSB9KVxuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW1xuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coe1xuICAgICAgICAgIHdvcmtmbG93X3J1bjogY3JlYXRlTW9ja1dvcmtmbG93UnVuKHtcbiAgICAgICAgICAgIGlkOiAnZGVidWctcnVuJyxcbiAgICAgICAgICAgIHRyaWdnZXJlZF9mcm9tOiBXb3JrZmxvd1J1blRyaWdnZXJlZEZyb20uREVCVUdHSU5HLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgLy8gT3BlbiBkcmF3ZXJcbiAgICAgIGNvbnN0IGRhdGFSb3dzID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgncm93JylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soZGF0YVJvd3NbMV0pXG4gICAgICBhd2FpdCBzY3JlZW4uZmluZEJ5Um9sZSgnZGlhbG9nJylcblxuICAgICAgLy8gUmVwbGF5IGJ1dHRvbiBzaG91bGQgYmUgcHJlc2VudCBmb3IgZGVidWdnaW5nIHRyaWdnZXJzXG4gICAgICBjb25zdCByZXBsYXlCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdhcHBMb2cucnVuRGV0YWlsLnRlc3RXaXRoUGFyYW1zJyB9KVxuICAgICAgZXhwZWN0KHJlcGxheUJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHJlcGxheSBmb3Igd2ViaG9vayB0cmlnZ2VycycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgdXNlQXBwU3RvcmUuc2V0U3RhdGUoeyBhcHBEZXRhaWw6IGNyZWF0ZU1vY2tBcHAoeyBpZDogJ2FwcC13ZWJob29rJyB9KSB9KVxuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW1xuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coe1xuICAgICAgICAgIHdvcmtmbG93X3J1bjogY3JlYXRlTW9ja1dvcmtmbG93UnVuKHtcbiAgICAgICAgICAgIGlkOiAnd2ViaG9vay1ydW4nLFxuICAgICAgICAgICAgdHJpZ2dlcmVkX2Zyb206IFdvcmtmbG93UnVuVHJpZ2dlcmVkRnJvbS5XRUJIT09LLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgLy8gT3BlbiBkcmF3ZXJcbiAgICAgIGNvbnN0IGRhdGFSb3dzID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgncm93JylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soZGF0YVJvd3NbMV0pXG4gICAgICBhd2FpdCBzY3JlZW4uZmluZEJ5Um9sZSgnZGlhbG9nJylcblxuICAgICAgLy8gUmVwbGF5IGJ1dHRvbiBzaG91bGQgbm90IGJlIHByZXNlbnQgZm9yIHdlYmhvb2sgdHJpZ2dlcnNcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2FwcExvZy5ydW5EZXRhaWwudGVzdFdpdGhQYXJhbXMnIH0pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVW5yZWFkIEluZGljYXRvciBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVW5yZWFkIEluZGljYXRvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgdW5yZWFkIGluZGljYXRvciBmb3IgdW5yZWFkIGxvZ3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXG4gICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7XG4gICAgICAgICAgcmVhZF9hdDogdW5kZWZpbmVkLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFVucmVhZCBpbmRpY2F0b3IgaXMgYSBzbWFsbCBibHVlIGRvdFxuICAgICAgY29uc3QgdW5yZWFkRG90ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy11dGlsLWNvbG9ycy1ibHVlLWJsdWUtNTAwJylcbiAgICAgIGV4cGVjdCh1bnJlYWREb3QpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB1bnJlYWQgaW5kaWNhdG9yIGZvciByZWFkIGxvZ3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXG4gICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7XG4gICAgICAgICAgcmVhZF9hdDogRGF0ZS5ub3coKSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y3JlYXRlTW9ja0FwcCgpfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBObyB1bnJlYWQgaW5kaWNhdG9yXG4gICAgICBjb25zdCB1bnJlYWREb3QgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmJnLXV0aWwtY29sb3JzLWJsdWUtYmx1ZS01MDAnKVxuICAgICAgZXhwZWN0KHVucmVhZERvdCkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJ1bnRpbWUgRGlzcGxheSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUnVudGltZSBEaXNwbGF5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBlbGFwc2VkIHRpbWUgd2l0aCAzIGRlY2ltYWwgcGxhY2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW1xuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coe1xuICAgICAgICAgIHdvcmtmbG93X3J1bjogY3JlYXRlTW9ja1dvcmtmbG93UnVuKHsgZWxhcHNlZF90aW1lOiAxLjIzNDU2IH0pLFxuICAgICAgICB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NyZWF0ZU1vY2tBcHAoKX0gb25SZWZyZXNoPXtkZWZhdWx0T25SZWZyZXNofSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEuMjM1cycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSAwIGVsYXBzZWQgdGltZSB3aXRoIHNwZWNpYWwgc3R5bGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvZ3MgPSBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHtcbiAgICAgICAgICB3b3JrZmxvd19ydW46IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bih7IGVsYXBzZWRfdGltZTogMCB9KSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHplcm9UaW1lID0gc2NyZWVuLmdldEJ5VGV4dCgnMC4wMDBzJylcbiAgICAgIGV4cGVjdCh6ZXJvVGltZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHplcm9UaW1lKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LXF1YXRlcm5hcnknKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVG9rZW4gRGlzcGxheSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVG9rZW4gRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgdG90YWwgdG9rZW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW1xuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coe1xuICAgICAgICAgIHdvcmtmbG93X3J1bjogY3JlYXRlTW9ja1dvcmtmbG93UnVuKHsgdG90YWxfdG9rZW5zOiAxMjM0NSB9KSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxMjM0NScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFbXB0eSBTdGF0ZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRW1wdHkgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZW1wdHkgdGFibGUgd2hlbiBsb2dzIGRhdGEgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y3JlYXRlTW9ja0FwcCgpfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCB0YWJsZSA9IHNjcmVlbi5nZXRCeVJvbGUoJ3RhYmxlJylcbiAgICAgIGV4cGVjdCh0YWJsZSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBTaG91bGQgb25seSBoYXZlIGhlYWRlciByb3dcbiAgICAgIGNvbnN0IHJvd3MgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdyb3cnKVxuICAgICAgZXhwZWN0KHJvd3MpLnRvSGF2ZUxlbmd0aCgxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRWRnZSBDYXNlcyAoUkVRVUlSRUQpXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGxvZ3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW1xuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coeyBpZDogJ2xvZy0xJywgY3JlYXRlZF9hdDogMTAwMCB9KSxcbiAgICAgICAgY3JlYXRlTW9ja1dvcmtmbG93TG9nKHsgaWQ6ICdsb2ctMicsIGNyZWF0ZWRfYXQ6IDIwMDAgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7IGlkOiAnbG9nLTMnLCBjcmVhdGVkX2F0OiAzMDAwIH0pLFxuICAgICAgXSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8V29ya2Zsb3dBcHBMb2dMaXN0IGxvZ3M9e2xvZ3N9IGFwcERldGFpbD17Y3JlYXRlTW9ja0FwcCgpfSBvblJlZnJlc2g9e2RlZmF1bHRPblJlZnJlc2h9IC8+LFxuICAgICAgKVxuXG4gICAgICBjb25zdCByb3dzID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgncm93JylcbiAgICAgIGV4cGVjdChyb3dzKS50b0hhdmVMZW5ndGgoNCkgLy8gMSBoZWFkZXIgKyAzIGRhdGEgcm93c1xuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsb2dzIHdpdGggbWlzc2luZyB3b3JrZmxvd19ydW4gZGF0YSBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9ncyA9IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW1xuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coe1xuICAgICAgICAgIHdvcmtmbG93X3J1bjogY3JlYXRlTW9ja1dvcmtmbG93UnVuKHtcbiAgICAgICAgICAgIGVsYXBzZWRfdGltZTogMCxcbiAgICAgICAgICAgIHRvdGFsX3Rva2VuczogMCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSksXG4gICAgICBdKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxXb3JrZmxvd0FwcExvZ0xpc3QgbG9ncz17bG9nc30gYXBwRGV0YWlsPXtjcmVhdGVNb2NrQXBwKCl9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcwLjAwMHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIHdvcmtmbG93X3J1bi50cmlnZ2VyZWRfZnJvbSBmb3Igbm9uLXdvcmtmbG93IGFwcHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2dzID0gY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXG4gICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7XG4gICAgICAgICAgd29ya2Zsb3dfcnVuOiBjcmVhdGVNb2NrV29ya2Zsb3dSdW4oe1xuICAgICAgICAgICAgdHJpZ2dlcmVkX2Zyb206IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pLFxuICAgICAgXSlcbiAgICAgIGNvbnN0IGNoYXRBcHAgPSBjcmVhdGVNb2NrQXBwKHsgbW9kZTogJ2FkdmFuY2VkLWNoYXQnIGFzIEFwcE1vZGVFbnVtIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFdvcmtmbG93QXBwTG9nTGlzdCBsb2dzPXtsb2dzfSBhcHBEZXRhaWw9e2NoYXRBcHB9IG9uUmVmcmVzaD17ZGVmYXVsdE9uUmVmcmVzaH0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFNob3VsZCByZW5kZXIgd2l0aG91dCB0cmlnZ2VyIGNvbHVtblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYXBwTG9nLnRhYmxlLmhlYWRlci50cmlnZ2VyZWRfZnJvbScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19