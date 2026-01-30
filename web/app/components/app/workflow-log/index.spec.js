"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const config_1 = require("@/config");
const log_1 = require("@/models/log");
const useLogModule = require("@/service/use-log");
const filter_1 = require("./filter");
const index_1 = require("./index");
// ============================================================================
// Mocks
// ============================================================================
vi.mock('@/service/use-log');
vi.mock('ahooks', () => ({
    useDebounce: (value) => value,
    useDebounceFn: (fn) => ({ run: fn }),
    useBoolean: (initial) => {
        const setters = {
            setTrue: vi.fn(),
            setFalse: vi.fn(),
            toggle: vi.fn(),
        };
        return [initial, setters];
    },
}));
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));
vi.mock('next/link', () => ({
    default: ({ children, href }) => <a href={href}>{children}</a>,
}));
// Mock the Run component to avoid complex dependencies
vi.mock('@/app/components/workflow/run', () => ({
    default: ({ runDetailUrl, tracingListUrl }) => (<div data-testid="workflow-run">
      <span data-testid="run-detail-url">{runDetailUrl}</span>
      <span data-testid="tracing-list-url">{tracingListUrl}</span>
    </div>),
}));
const mockTrackEvent = vi.fn();
vi.mock('@/app/components/base/amplitude/utils', () => ({
    trackEvent: (...args) => mockTrackEvent(...args),
}));
vi.mock('@/hooks/use-theme', () => ({
    default: () => {
        return { theme: 'light' };
    },
}));
vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        userProfile: { timezone: 'UTC' },
    }),
}));
// Mock WorkflowContextProvider
vi.mock('@/app/components/workflow/context', () => ({
    WorkflowContextProvider: ({ children }) => (<>{children}</>),
}));
const mockedUseWorkflowLogs = useLogModule.useWorkflowLogs;
// ============================================================================
// Test Utilities
// ============================================================================
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const renderWithQueryClient = (ui) => {
    const queryClient = createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
      {ui}
    </react_query_1.QueryClientProvider>);
};
// ============================================================================
// Mock Return Value Factory
// ============================================================================
const createMockQueryResult = (overrides = {}) => {
    const isLoading = overrides.isLoading ?? false;
    const error = overrides.error ?? null;
    const data = overrides.data;
    return {
        data,
        isLoading,
        error,
        refetch: vi.fn(),
        isError: !!error,
        isPending: isLoading,
        isSuccess: !isLoading && !error && data !== undefined,
        isFetching: isLoading,
        isRefetching: false,
        isLoadingError: false,
        isRefetchError: false,
        isInitialLoading: isLoading,
        isPaused: false,
        isEnabled: true,
        status: isLoading ? 'pending' : error ? 'error' : 'success',
        fetchStatus: isLoading ? 'fetching' : 'idle',
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        errorUpdateCount: 0,
        isFetched: !isLoading,
        isFetchedAfterMount: !isLoading,
        isPlaceholderData: false,
        isStale: false,
        promise: Promise.resolve(data),
    };
};
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
const getMockCallParams = () => {
    const lastCall = mockedUseWorkflowLogs.mock.calls.at(-1);
    return lastCall?.[0];
};
// ============================================================================
// Tests
// ============================================================================
describe('Logs Container', () => {
    const defaultProps = {
        appDetail: createMockApp(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests (REQUIRED)
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('appLog.workflowTitle')).toBeInTheDocument();
        });
        it('should render title and subtitle', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('appLog.workflowTitle')).toBeInTheDocument();
            expect(react_1.screen.getByText('appLog.workflowSubtitle')).toBeInTheDocument();
        });
        it('should render Filter component', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByPlaceholderText('common.operation.search')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Loading State Tests
    // --------------------------------------------------------------------------
    describe('Loading State', () => {
        it('should show loading spinner when data is undefined', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: undefined,
                isLoading: true,
            }));
            // Act
            const { container } = renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(container.querySelector('.spin-animation')).toBeInTheDocument();
        });
        it('should not show loading spinner when data is available', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([createMockWorkflowLog()], 1),
            }));
            // Act
            const { container } = renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(container.querySelector('.spin-animation')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Empty State Tests
    // --------------------------------------------------------------------------
    describe('Empty State', () => {
        it('should render empty element when total is 0', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('appLog.table.empty.element.title')).toBeInTheDocument();
            expect(react_1.screen.queryByRole('table')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Data Fetching Tests
    // --------------------------------------------------------------------------
    describe('Data Fetching', () => {
        it('should call useWorkflowLogs with correct appId and default params', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            const callArg = getMockCallParams();
            expect(callArg).toMatchObject({
                appId: defaultProps.appDetail.id,
                params: expect.objectContaining({
                    page: 1,
                    detail: true,
                    limit: config_1.APP_PAGE_LIMIT,
                }),
            });
        });
        it('should include date filters for non-allTime periods', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            const callArg = getMockCallParams();
            expect(callArg?.params).toHaveProperty('created_at__after');
            expect(callArg?.params).toHaveProperty('created_at__before');
        });
        it('should not include status param when status is all', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            const callArg = getMockCallParams();
            expect(callArg?.params).not.toHaveProperty('status');
        });
    });
    // --------------------------------------------------------------------------
    // Filter Integration Tests
    // --------------------------------------------------------------------------
    describe('Filter Integration', () => {
        it('should update query when selecting status filter', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Act
            await user.click(react_1.screen.getByText('All'));
            await user.click(await react_1.screen.findByText('Success'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const lastCall = getMockCallParams();
                expect(lastCall?.params).toMatchObject({
                    status: 'succeeded',
                });
            });
        });
        it('should update query when selecting period filter', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Act
            await user.click(react_1.screen.getByText('appLog.filter.period.last7days'));
            await user.click(await react_1.screen.findByText('appLog.filter.period.allTime'));
            // Assert
            await (0, react_1.waitFor)(() => {
                const lastCall = getMockCallParams();
                expect(lastCall?.params).not.toHaveProperty('created_at__after');
                expect(lastCall?.params).not.toHaveProperty('created_at__before');
            });
        });
        it('should update query when typing keyword', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Act
            const searchInput = react_1.screen.getByPlaceholderText('common.operation.search');
            await user.type(searchInput, 'test-keyword');
            // Assert
            await (0, react_1.waitFor)(() => {
                const lastCall = getMockCallParams();
                expect(lastCall?.params).toMatchObject({
                    keyword: 'test-keyword',
                });
            });
        });
    });
    // --------------------------------------------------------------------------
    // Pagination Tests
    // --------------------------------------------------------------------------
    describe('Pagination', () => {
        it('should not render pagination when total is less than limit', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([createMockWorkflowLog()], 1),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.queryByRole('navigation')).not.toBeInTheDocument();
        });
        it('should render pagination when total exceeds limit', () => {
            // Arrange
            const logs = Array.from({ length: config_1.APP_PAGE_LIMIT }, (_, i) => createMockWorkflowLog({ id: `log-${i}` }));
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse(logs, config_1.APP_PAGE_LIMIT + 10),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByRole('table')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // List Rendering Tests
    // --------------------------------------------------------------------------
    describe('List Rendering', () => {
        it('should render List component when data is available', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([createMockWorkflowLog()], 1),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByRole('table')).toBeInTheDocument();
        });
        it('should display log data in table', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([
                    createMockWorkflowLog({
                        workflow_run: createMockWorkflowRun({
                            status: 'succeeded',
                            total_tokens: 500,
                        }),
                    }),
                ], 1),
            }));
            // Act
            renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('Success')).toBeInTheDocument();
            expect(react_1.screen.getByText('500')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // TIME_PERIOD_MAPPING Export Tests
    // --------------------------------------------------------------------------
    describe('TIME_PERIOD_MAPPING', () => {
        it('should export TIME_PERIOD_MAPPING with correct values', () => {
            expect(filter_1.TIME_PERIOD_MAPPING['1']).toEqual({ value: 0, name: 'today' });
            expect(filter_1.TIME_PERIOD_MAPPING['2']).toEqual({ value: 7, name: 'last7days' });
            expect(filter_1.TIME_PERIOD_MAPPING['9']).toEqual({ value: -1, name: 'allTime' });
            expect(Object.keys(filter_1.TIME_PERIOD_MAPPING)).toHaveLength(9);
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases (REQUIRED)
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle different app modes', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([createMockWorkflowLog()], 1),
            }));
            const chatApp = createMockApp({ mode: 'advanced-chat' });
            // Act
            renderWithQueryClient(<index_1.default appDetail={chatApp}/>);
            // Assert
            expect(react_1.screen.queryByText('appLog.table.header.triggered_from')).not.toBeInTheDocument();
        });
        it('should handle error state from useWorkflowLogs', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: undefined,
                error: new Error('Failed to fetch'),
            }));
            // Act
            const { container } = renderWithQueryClient(<index_1.default {...defaultProps}/>);
            // Assert - should show loading state when data is undefined
            expect(container.querySelector('.spin-animation')).toBeInTheDocument();
        });
        it('should handle app with different ID', () => {
            // Arrange
            mockedUseWorkflowLogs.mockReturnValue(createMockQueryResult({
                data: createMockLogsResponse([], 0),
            }));
            const customApp = createMockApp({ id: 'custom-app-123' });
            // Act
            renderWithQueryClient(<index_1.default appDetail={customApp}/>);
            // Assert
            const callArg = getMockCallParams();
            expect(callArg?.appId).toBe('custom-app-123');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBcUJBLHVEQUF3RTtBQUN4RSxrREFBZ0U7QUFDaEUsNERBQW1EO0FBQ25ELHFDQUF5QztBQUN6QyxzQ0FBdUQ7QUFDdkQsa0RBQWlEO0FBQ2pELHFDQUE4QztBQUM5QyxtQ0FBMEI7QUFFMUIsK0VBQStFO0FBQy9FLFFBQVE7QUFDUiwrRUFBK0U7QUFFL0UsRUFBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBRTVCLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkIsV0FBVyxFQUFFLENBQUssS0FBUSxFQUFFLEVBQUUsQ0FBQyxLQUFLO0lBQ3BDLGFBQWEsRUFBRSxDQUFDLEVBQTJCLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDN0QsVUFBVSxFQUFFLENBQUMsT0FBZ0IsRUFBRSxFQUFFO1FBQy9CLE1BQU0sT0FBTyxHQUFHO1lBQ2QsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakIsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7U0FDaEIsQ0FBQTtRQUNELE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFVLENBQUE7SUFDcEMsQ0FBQztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0tBQ2QsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyxX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LEdBQUcsaUJBQWlCLEVBQUUsQ0FBQTtZQUNuQyxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBQy9DLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVXNlUXVlcnlSZXN1bHQgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG4vKipcbiAqIExvZ3MgQ29udGFpbmVyIENvbXBvbmVudCBUZXN0c1xuICpcbiAqIFRlc3RzIHRoZSBtYWluIExvZ3MgY29udGFpbmVyIGNvbXBvbmVudCB3aGljaDpcbiAqIC0gRmV0Y2hlcyB3b3JrZmxvdyBsb2dzIHZpYSBUYW5TdGFjayBRdWVyeVxuICogLSBNYW5hZ2VzIHF1ZXJ5IHBhcmFtZXRlcnMgKHN0YXR1cywgcGVyaW9kLCBrZXl3b3JkKVxuICogLSBIYW5kbGVzIHBhZ2luYXRpb25cbiAqIC0gUmVuZGVycyBGaWx0ZXIsIExpc3QsIGFuZCBFbXB0eSBzdGF0ZXNcbiAqXG4gKiBOb3RlOiBJbmRpdmlkdWFsIGNvbXBvbmVudCB0ZXN0cyBhcmUgaW4gdGhlaXIgcmVzcGVjdGl2ZSBzcGVjIGZpbGVzOlxuICogLSBmaWx0ZXIuc3BlYy50c3hcbiAqIC0gbGlzdC5zcGVjLnRzeFxuICogLSBkZXRhaWwuc3BlYy50c3hcbiAqIC0gdHJpZ2dlci1ieS1kaXNwbGF5LnNwZWMudHN4XG4gKi9cblxuaW1wb3J0IHR5cGUgeyBNb2NrZWRGdW5jdGlvbiB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB0eXBlIHsgSUxvZ3NQcm9wcyB9IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgdHlwZSB7IFdvcmtmbG93QXBwTG9nRGV0YWlsLCBXb3JrZmxvd0xvZ3NSZXNwb25zZSwgV29ya2Zsb3dSdW5EZXRhaWwgfSBmcm9tICdAL21vZGVscy9sb2cnXG5pbXBvcnQgdHlwZSB7IEFwcCwgQXBwSWNvblR5cGUsIEFwcE1vZGVFbnVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB1c2VyRXZlbnQgZnJvbSAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50J1xuaW1wb3J0IHsgQVBQX1BBR0VfTElNSVQgfSBmcm9tICdAL2NvbmZpZydcbmltcG9ydCB7IFdvcmtmbG93UnVuVHJpZ2dlcmVkRnJvbSB9IGZyb20gJ0AvbW9kZWxzL2xvZydcbmltcG9ydCAqIGFzIHVzZUxvZ01vZHVsZSBmcm9tICdAL3NlcnZpY2UvdXNlLWxvZydcbmltcG9ydCB7IFRJTUVfUEVSSU9EX01BUFBJTkcgfSBmcm9tICcuL2ZpbHRlcidcbmltcG9ydCBMb2dzIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2tzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtbG9nJylcblxudmkubW9jaygnYWhvb2tzJywgKCkgPT4gKHtcbiAgdXNlRGVib3VuY2U6IDxULD4odmFsdWU6IFQpID0+IHZhbHVlLFxuICB1c2VEZWJvdW5jZUZuOiAoZm46ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkKSA9PiAoeyBydW46IGZuIH0pLFxuICB1c2VCb29sZWFuOiAoaW5pdGlhbDogYm9vbGVhbikgPT4ge1xuICAgIGNvbnN0IHNldHRlcnMgPSB7XG4gICAgICBzZXRUcnVlOiB2aS5mbigpLFxuICAgICAgc2V0RmFsc2U6IHZpLmZuKCksXG4gICAgICB0b2dnbGU6IHZpLmZuKCksXG4gICAgfVxuICAgIHJldHVybiBbaW5pdGlhbCwgc2V0dGVyc10gYXMgY29uc3RcbiAgfSxcbn0pKVxuXG52aS5tb2NrKCduZXh0L25hdmlnYXRpb24nLCAoKSA9PiAoe1xuICB1c2VSb3V0ZXI6ICgpID0+ICh7XG4gICAgcHVzaDogdmkuZm4oKSxcbiAgfSksXG59KSlcblxudmkubW9jaygnbmV4dC9saW5rJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY2hpbGRyZW4sIGhyZWYgfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlLCBocmVmOiBzdHJpbmcgfSkgPT4gPGEgaHJlZj17aHJlZn0+e2NoaWxkcmVufTwvYT4sXG59KSlcblxuLy8gTW9jayB0aGUgUnVuIGNvbXBvbmVudCB0byBhdm9pZCBjb21wbGV4IGRlcGVuZGVuY2llc1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ydW4nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBydW5EZXRhaWxVcmwsIHRyYWNpbmdMaXN0VXJsIH06IHsgcnVuRGV0YWlsVXJsOiBzdHJpbmcsIHRyYWNpbmdMaXN0VXJsOiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ3b3JrZmxvdy1ydW5cIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicnVuLWRldGFpbC11cmxcIj57cnVuRGV0YWlsVXJsfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwidHJhY2luZy1saXN0LXVybFwiPnt0cmFjaW5nTGlzdFVybH08L3NwYW4+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuY29uc3QgbW9ja1RyYWNrRXZlbnQgPSB2aS5mbigpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYW1wbGl0dWRlL3V0aWxzJywgKCkgPT4gKHtcbiAgdHJhY2tFdmVudDogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gbW9ja1RyYWNrRXZlbnQoLi4uYXJncyksXG59KSlcblxudmkubW9jaygnQC9ob29rcy91c2UtdGhlbWUnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiB7XG4gICAgcmV0dXJuIHsgdGhlbWU6ICdsaWdodCcgfVxuICB9LFxufSkpXG5cbnZpLm1vY2soJ0AvY29udGV4dC9hcHAtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZUFwcENvbnRleHQ6ICgpID0+ICh7XG4gICAgdXNlclByb2ZpbGU6IHsgdGltZXpvbmU6ICdVVEMnIH0sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgV29ya2Zsb3dDb250ZXh0UHJvdmlkZXJcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvY29udGV4dCcsICgpID0+ICh7XG4gIFdvcmtmbG93Q29udGV4dFByb3ZpZGVyOiAoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfSkgPT4gKFxuICAgIDw+e2NoaWxkcmVufTwvPlxuICApLFxufSkpXG5cbmNvbnN0IG1vY2tlZFVzZVdvcmtmbG93TG9ncyA9IHVzZUxvZ01vZHVsZS51c2VXb3JrZmxvd0xvZ3MgYXMgTW9ja2VkRnVuY3Rpb248dHlwZW9mIHVzZUxvZ01vZHVsZS51c2VXb3JrZmxvd0xvZ3M+XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgVXRpbGl0aWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZVF1ZXJ5Q2xpZW50ID0gKCkgPT4gbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICBxdWVyaWVzOiB7XG4gICAgICByZXRyeTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbn0pXG5cbmNvbnN0IHJlbmRlcldpdGhRdWVyeUNsaWVudCA9ICh1aTogUmVhY3QuUmVhY3RFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gY3JlYXRlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gcmVuZGVyKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAge3VpfVxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gIClcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBSZXR1cm4gVmFsdWUgRmFjdG9yeVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrUXVlcnlSZXN1bHQgPSA8VCw+KFxuICBvdmVycmlkZXM6IHsgZGF0YT86IFQsIGlzTG9hZGluZz86IGJvb2xlYW4sIGVycm9yPzogRXJyb3IgfCBudWxsIH0gPSB7fSxcbik6IFVzZVF1ZXJ5UmVzdWx0PFQsIEVycm9yPiA9PiB7XG4gIGNvbnN0IGlzTG9hZGluZyA9IG92ZXJyaWRlcy5pc0xvYWRpbmcgPz8gZmFsc2VcbiAgY29uc3QgZXJyb3IgPSBvdmVycmlkZXMuZXJyb3IgPz8gbnVsbFxuICBjb25zdCBkYXRhID0gb3ZlcnJpZGVzLmRhdGFcblxuICByZXR1cm4ge1xuICAgIGRhdGEsXG4gICAgaXNMb2FkaW5nLFxuICAgIGVycm9yLFxuICAgIHJlZmV0Y2g6IHZpLmZuKCksXG4gICAgaXNFcnJvcjogISFlcnJvcixcbiAgICBpc1BlbmRpbmc6IGlzTG9hZGluZyxcbiAgICBpc1N1Y2Nlc3M6ICFpc0xvYWRpbmcgJiYgIWVycm9yICYmIGRhdGEgIT09IHVuZGVmaW5lZCxcbiAgICBpc0ZldGNoaW5nOiBpc0xvYWRpbmcsXG4gICAgaXNSZWZldGNoaW5nOiBmYWxzZSxcbiAgICBpc0xvYWRpbmdFcnJvcjogZmFsc2UsXG4gICAgaXNSZWZldGNoRXJyb3I6IGZhbHNlLFxuICAgIGlzSW5pdGlhbExvYWRpbmc6IGlzTG9hZGluZyxcbiAgICBpc1BhdXNlZDogZmFsc2UsXG4gICAgaXNFbmFibGVkOiB0cnVlLFxuICAgIHN0YXR1czogaXNMb2FkaW5nID8gJ3BlbmRpbmcnIDogZXJyb3IgPyAnZXJyb3InIDogJ3N1Y2Nlc3MnLFxuICAgIGZldGNoU3RhdHVzOiBpc0xvYWRpbmcgPyAnZmV0Y2hpbmcnIDogJ2lkbGUnLFxuICAgIGRhdGFVcGRhdGVkQXQ6IERhdGUubm93KCksXG4gICAgZXJyb3JVcGRhdGVkQXQ6IDAsXG4gICAgZmFpbHVyZUNvdW50OiAwLFxuICAgIGZhaWx1cmVSZWFzb246IG51bGwsXG4gICAgZXJyb3JVcGRhdGVDb3VudDogMCxcbiAgICBpc0ZldGNoZWQ6ICFpc0xvYWRpbmcsXG4gICAgaXNGZXRjaGVkQWZ0ZXJNb3VudDogIWlzTG9hZGluZyxcbiAgICBpc1BsYWNlaG9sZGVyRGF0YTogZmFsc2UsXG4gICAgaXNTdGFsZTogZmFsc2UsXG4gICAgcHJvbWlzZTogUHJvbWlzZS5yZXNvbHZlKGRhdGEgYXMgVCksXG4gIH0gYXMgVXNlUXVlcnlSZXN1bHQ8VCwgRXJyb3I+XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBGYWN0b3JpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlTW9ja0FwcCA9IChvdmVycmlkZXM6IFBhcnRpYWw8QXBwPiA9IHt9KTogQXBwID0+ICh7XG4gIGlkOiAndGVzdC1hcHAtaWQnLFxuICBuYW1lOiAnVGVzdCBBcHAnLFxuICBkZXNjcmlwdGlvbjogJ1Rlc3QgYXBwIGRlc2NyaXB0aW9uJyxcbiAgYXV0aG9yX25hbWU6ICdUZXN0IEF1dGhvcicsXG4gIGljb25fdHlwZTogJ2Vtb2ppJyBhcyBBcHBJY29uVHlwZSxcbiAgaWNvbjogJ/CfmoAnLFxuICBpY29uX2JhY2tncm91bmQ6ICcjRkZFQUQ1JyxcbiAgaWNvbl91cmw6IG51bGwsXG4gIHVzZV9pY29uX2FzX2Fuc3dlcl9pY29uOiBmYWxzZSxcbiAgbW9kZTogJ3dvcmtmbG93JyBhcyBBcHBNb2RlRW51bSxcbiAgZW5hYmxlX3NpdGU6IHRydWUsXG4gIGVuYWJsZV9hcGk6IHRydWUsXG4gIGFwaV9ycG06IDYwLFxuICBhcGlfcnBoOiAzNjAwLFxuICBpc19kZW1vOiBmYWxzZSxcbiAgbW9kZWxfY29uZmlnOiB7fSBhcyBBcHBbJ21vZGVsX2NvbmZpZyddLFxuICBhcHBfbW9kZWxfY29uZmlnOiB7fSBhcyBBcHBbJ2FwcF9tb2RlbF9jb25maWcnXSxcbiAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgdXBkYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgc2l0ZToge1xuICAgIGFjY2Vzc190b2tlbjogJ3Rva2VuJyxcbiAgICBhcHBfYmFzZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgfSBhcyBBcHBbJ3NpdGUnXSxcbiAgYXBpX2Jhc2VfdXJsOiAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20nLFxuICB0YWdzOiBbXSxcbiAgYWNjZXNzX21vZGU6ICdwdWJsaWNfYWNjZXNzJyBhcyBBcHBbJ2FjY2Vzc19tb2RlJ10sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tXb3JrZmxvd1J1biA9IChvdmVycmlkZXM6IFBhcnRpYWw8V29ya2Zsb3dSdW5EZXRhaWw+ID0ge30pOiBXb3JrZmxvd1J1bkRldGFpbCA9PiAoe1xuICBpZDogJ3J1bi0xJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgc3RhdHVzOiAnc3VjY2VlZGVkJyxcbiAgZWxhcHNlZF90aW1lOiAxLjIzNCxcbiAgdG90YWxfdG9rZW5zOiAxMDAsXG4gIHRvdGFsX3ByaWNlOiAwLjAwMSxcbiAgY3VycmVuY3k6ICdVU0QnLFxuICB0b3RhbF9zdGVwczogNSxcbiAgZmluaXNoZWRfYXQ6IERhdGUubm93KCksXG4gIHRyaWdnZXJlZF9mcm9tOiBXb3JrZmxvd1J1blRyaWdnZXJlZEZyb20uQVBQX1JVTixcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja1dvcmtmbG93TG9nID0gKG92ZXJyaWRlczogUGFydGlhbDxXb3JrZmxvd0FwcExvZ0RldGFpbD4gPSB7fSk6IFdvcmtmbG93QXBwTG9nRGV0YWlsID0+ICh7XG4gIGlkOiAnbG9nLTEnLFxuICB3b3JrZmxvd19ydW46IGNyZWF0ZU1vY2tXb3JrZmxvd1J1bigpLFxuICBjcmVhdGVkX2Zyb206ICd3ZWItYXBwJyxcbiAgY3JlYXRlZF9ieV9yb2xlOiAnYWNjb3VudCcsXG4gIGNyZWF0ZWRfYnlfYWNjb3VudDoge1xuICAgIGlkOiAnYWNjb3VudC0xJyxcbiAgICBuYW1lOiAnVGVzdCBVc2VyJyxcbiAgICBlbWFpbDogJ3Rlc3RAZXhhbXBsZS5jb20nLFxuICB9LFxuICBjcmVhdGVkX2F0OiBEYXRlLm5vdygpLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlID0gKFxuICBkYXRhOiBXb3JrZmxvd0FwcExvZ0RldGFpbFtdID0gW10sXG4gIHRvdGFsID0gZGF0YS5sZW5ndGgsXG4pOiBXb3JrZmxvd0xvZ3NSZXNwb25zZSA9PiAoe1xuICBkYXRhLFxuICBoYXNfbW9yZTogZGF0YS5sZW5ndGggPCB0b3RhbCxcbiAgbGltaXQ6IEFQUF9QQUdFX0xJTUlULFxuICB0b3RhbCxcbiAgcGFnZTogMSxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFR5cGUtc2FmZSBNb2NrIEhlbHBlclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG50eXBlIFdvcmtmbG93TG9nc1BhcmFtcyA9IHtcbiAgYXBwSWQ6IHN0cmluZ1xuICBwYXJhbXM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgdW5kZWZpbmVkPlxufVxuXG5jb25zdCBnZXRNb2NrQ2FsbFBhcmFtcyA9ICgpOiBXb3JrZmxvd0xvZ3NQYXJhbXMgfCB1bmRlZmluZWQgPT4ge1xuICBjb25zdCBsYXN0Q2FsbCA9IG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrLmNhbGxzLmF0KC0xKVxuICByZXR1cm4gbGFzdENhbGw/LlswXVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnTG9ncyBDb250YWluZXInLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wczogSUxvZ3NQcm9wcyA9IHtcbiAgICBhcHBEZXRhaWw6IGNyZWF0ZU1vY2tBcHAoKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0cyAoUkVRVUlSRUQpXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW10sIDApLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPExvZ3Mgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy53b3JrZmxvd1RpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGl0bGUgYW5kIHN1YnRpdGxlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja2VkVXNlV29ya2Zsb3dMb2dzLm1vY2tSZXR1cm5WYWx1ZShcbiAgICAgICAgY3JlYXRlTW9ja1F1ZXJ5UmVzdWx0PFdvcmtmbG93TG9nc1Jlc3BvbnNlPih7XG4gICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXSwgMCksXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8TG9ncyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwTG9nLndvcmtmbG93VGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy53b3JrZmxvd1N1YnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRmlsdGVyIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW10sIDApLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPExvZ3Mgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVBsYWNlaG9sZGVyVGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zZWFyY2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTG9hZGluZyBTdGF0ZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTG9hZGluZyBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyBzcGlubmVyIHdoZW4gZGF0YSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrZWRVc2VXb3JrZmxvd0xvZ3MubW9ja1JldHVyblZhbHVlKFxuICAgICAgICBjcmVhdGVNb2NrUXVlcnlSZXN1bHQ8V29ya2Zsb3dMb2dzUmVzcG9uc2U+KHtcbiAgICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxMb2dzIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnNwaW4tYW5pbWF0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBsb2FkaW5nIHNwaW5uZXIgd2hlbiBkYXRhIGlzIGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW2NyZWF0ZU1vY2tXb3JrZmxvd0xvZygpXSwgMSksXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUXVlcnlDbGllbnQoPExvZ3Mgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3Bpbi1hbmltYXRpb24nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVtcHR5IFN0YXRlIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFbXB0eSBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlbXB0eSBlbGVtZW50IHdoZW4gdG90YWwgaXMgMCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW10sIDApLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPExvZ3Mgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy50YWJsZS5lbXB0eS5lbGVtZW50LnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ3RhYmxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBEYXRhIEZldGNoaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdEYXRhIEZldGNoaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCB1c2VXb3JrZmxvd0xvZ3Mgd2l0aCBjb3JyZWN0IGFwcElkIGFuZCBkZWZhdWx0IHBhcmFtcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW10sIDApLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPExvZ3Mgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY2FsbEFyZyA9IGdldE1vY2tDYWxsUGFyYW1zKClcbiAgICAgIGV4cGVjdChjYWxsQXJnKS50b01hdGNoT2JqZWN0KHtcbiAgICAgICAgYXBwSWQ6IGRlZmF1bHRQcm9wcy5hcHBEZXRhaWwuaWQsXG4gICAgICAgIHBhcmFtczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHBhZ2U6IDEsXG4gICAgICAgICAgZGV0YWlsOiB0cnVlLFxuICAgICAgICAgIGxpbWl0OiBBUFBfUEFHRV9MSU1JVCxcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgZGF0ZSBmaWx0ZXJzIGZvciBub24tYWxsVGltZSBwZXJpb2RzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja2VkVXNlV29ya2Zsb3dMb2dzLm1vY2tSZXR1cm5WYWx1ZShcbiAgICAgICAgY3JlYXRlTW9ja1F1ZXJ5UmVzdWx0PFdvcmtmbG93TG9nc1Jlc3BvbnNlPih7XG4gICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXSwgMCksXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8TG9ncyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjYWxsQXJnID0gZ2V0TW9ja0NhbGxQYXJhbXMoKVxuICAgICAgZXhwZWN0KGNhbGxBcmc/LnBhcmFtcykudG9IYXZlUHJvcGVydHkoJ2NyZWF0ZWRfYXRfX2FmdGVyJylcbiAgICAgIGV4cGVjdChjYWxsQXJnPy5wYXJhbXMpLnRvSGF2ZVByb3BlcnR5KCdjcmVhdGVkX2F0X19iZWZvcmUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBpbmNsdWRlIHN0YXR1cyBwYXJhbSB3aGVuIHN0YXR1cyBpcyBhbGwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrZWRVc2VXb3JrZmxvd0xvZ3MubW9ja1JldHVyblZhbHVlKFxuICAgICAgICBjcmVhdGVNb2NrUXVlcnlSZXN1bHQ8V29ya2Zsb3dMb2dzUmVzcG9uc2U+KHtcbiAgICAgICAgICBkYXRhOiBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtdLCAwKSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxMb2dzIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGNhbGxBcmcgPSBnZXRNb2NrQ2FsbFBhcmFtcygpXG4gICAgICBleHBlY3QoY2FsbEFyZz8ucGFyYW1zKS5ub3QudG9IYXZlUHJvcGVydHkoJ3N0YXR1cycpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBGaWx0ZXIgSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0ZpbHRlciBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBxdWVyeSB3aGVuIHNlbGVjdGluZyBzdGF0dXMgZmlsdGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBtb2NrZWRVc2VXb3JrZmxvd0xvZ3MubW9ja1JldHVyblZhbHVlKFxuICAgICAgICBjcmVhdGVNb2NrUXVlcnlSZXN1bHQ8V29ya2Zsb3dMb2dzUmVzcG9uc2U+KHtcbiAgICAgICAgICBkYXRhOiBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtdLCAwKSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8TG9ncyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0FsbCcpKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhd2FpdCBzY3JlZW4uZmluZEJ5VGV4dCgnU3VjY2VzcycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBsYXN0Q2FsbCA9IGdldE1vY2tDYWxsUGFyYW1zKClcbiAgICAgICAgZXhwZWN0KGxhc3RDYWxsPy5wYXJhbXMpLnRvTWF0Y2hPYmplY3Qoe1xuICAgICAgICAgIHN0YXR1czogJ3N1Y2NlZWRlZCcsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBxdWVyeSB3aGVuIHNlbGVjdGluZyBwZXJpb2QgZmlsdGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBtb2NrZWRVc2VXb3JrZmxvd0xvZ3MubW9ja1JldHVyblZhbHVlKFxuICAgICAgICBjcmVhdGVNb2NrUXVlcnlSZXN1bHQ8V29ya2Zsb3dMb2dzUmVzcG9uc2U+KHtcbiAgICAgICAgICBkYXRhOiBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtdLCAwKSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8TG9ncyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2FwcExvZy5maWx0ZXIucGVyaW9kLmxhc3Q3ZGF5cycpKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhhd2FpdCBzY3JlZW4uZmluZEJ5VGV4dCgnYXBwTG9nLmZpbHRlci5wZXJpb2QuYWxsVGltZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBsYXN0Q2FsbCA9IGdldE1vY2tDYWxsUGFyYW1zKClcbiAgICAgICAgZXhwZWN0KGxhc3RDYWxsPy5wYXJhbXMpLm5vdC50b0hhdmVQcm9wZXJ0eSgnY3JlYXRlZF9hdF9fYWZ0ZXInKVxuICAgICAgICBleHBlY3QobGFzdENhbGw/LnBhcmFtcykubm90LnRvSGF2ZVByb3BlcnR5KCdjcmVhdGVkX2F0X19iZWZvcmUnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcXVlcnkgd2hlbiB0eXBpbmcga2V5d29yZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgbW9ja2VkVXNlV29ya2Zsb3dMb2dzLm1vY2tSZXR1cm5WYWx1ZShcbiAgICAgICAgY3JlYXRlTW9ja1F1ZXJ5UmVzdWx0PFdvcmtmbG93TG9nc1Jlc3BvbnNlPih7XG4gICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbXSwgMCksXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPExvZ3Mgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzY3JlZW4uZ2V0QnlQbGFjZWhvbGRlclRleHQoJ2NvbW1vbi5vcGVyYXRpb24uc2VhcmNoJylcbiAgICAgIGF3YWl0IHVzZXIudHlwZShzZWFyY2hJbnB1dCwgJ3Rlc3Qta2V5d29yZCcpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGxhc3RDYWxsID0gZ2V0TW9ja0NhbGxQYXJhbXMoKVxuICAgICAgICBleHBlY3QobGFzdENhbGw/LnBhcmFtcykudG9NYXRjaE9iamVjdCh7XG4gICAgICAgICAga2V5d29yZDogJ3Rlc3Qta2V5d29yZCcsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUGFnaW5hdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUGFnaW5hdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgcGFnaW5hdGlvbiB3aGVuIHRvdGFsIGlzIGxlc3MgdGhhbiBsaW1pdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW2NyZWF0ZU1vY2tXb3JrZmxvd0xvZygpXSwgMSksXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8TG9ncyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCduYXZpZ2F0aW9uJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhZ2luYXRpb24gd2hlbiB0b3RhbCBleGNlZWRzIGxpbWl0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9ncyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IEFQUF9QQUdFX0xJTUlUIH0sIChfLCBpKSA9PlxuICAgICAgICBjcmVhdGVNb2NrV29ya2Zsb3dMb2coeyBpZDogYGxvZy0ke2l9YCB9KSlcblxuICAgICAgbW9ja2VkVXNlV29ya2Zsb3dMb2dzLm1vY2tSZXR1cm5WYWx1ZShcbiAgICAgICAgY3JlYXRlTW9ja1F1ZXJ5UmVzdWx0PFdvcmtmbG93TG9nc1Jlc3BvbnNlPih7XG4gICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShsb2dzLCBBUFBfUEFHRV9MSU1JVCArIDEwKSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxMb2dzIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCd0YWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBMaXN0IFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTGlzdCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTGlzdCBjb21wb25lbnQgd2hlbiBkYXRhIGlzIGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW2NyZWF0ZU1vY2tXb3JrZmxvd0xvZygpXSwgMSksXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8TG9ncyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgndGFibGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgbG9nIGRhdGEgaW4gdGFibGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrZWRVc2VXb3JrZmxvd0xvZ3MubW9ja1JldHVyblZhbHVlKFxuICAgICAgICBjcmVhdGVNb2NrUXVlcnlSZXN1bHQ8V29ya2Zsb3dMb2dzUmVzcG9uc2U+KHtcbiAgICAgICAgICBkYXRhOiBjcmVhdGVNb2NrTG9nc1Jlc3BvbnNlKFtcbiAgICAgICAgICAgIGNyZWF0ZU1vY2tXb3JrZmxvd0xvZyh7XG4gICAgICAgICAgICAgIHdvcmtmbG93X3J1bjogY3JlYXRlTW9ja1dvcmtmbG93UnVuKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdzdWNjZWVkZWQnLFxuICAgICAgICAgICAgICAgIHRvdGFsX3Rva2VuczogNTAwLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIF0sIDEpLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPExvZ3Mgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1N1Y2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzUwMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBUSU1FX1BFUklPRF9NQVBQSU5HIEV4cG9ydCBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVElNRV9QRVJJT0RfTUFQUElORycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGV4cG9ydCBUSU1FX1BFUklPRF9NQVBQSU5HIHdpdGggY29ycmVjdCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoVElNRV9QRVJJT0RfTUFQUElOR1snMSddKS50b0VxdWFsKHsgdmFsdWU6IDAsIG5hbWU6ICd0b2RheScgfSlcbiAgICAgIGV4cGVjdChUSU1FX1BFUklPRF9NQVBQSU5HWycyJ10pLnRvRXF1YWwoeyB2YWx1ZTogNywgbmFtZTogJ2xhc3Q3ZGF5cycgfSlcbiAgICAgIGV4cGVjdChUSU1FX1BFUklPRF9NQVBQSU5HWyc5J10pLnRvRXF1YWwoeyB2YWx1ZTogLTEsIG5hbWU6ICdhbGxUaW1lJyB9KVxuICAgICAgZXhwZWN0KE9iamVjdC5rZXlzKFRJTUVfUEVSSU9EX01BUFBJTkcpKS50b0hhdmVMZW5ndGgoOSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEVkZ2UgQ2FzZXMgKFJFUVVJUkVEKVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaWZmZXJlbnQgYXBwIG1vZGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja2VkVXNlV29ya2Zsb3dMb2dzLm1vY2tSZXR1cm5WYWx1ZShcbiAgICAgICAgY3JlYXRlTW9ja1F1ZXJ5UmVzdWx0PFdvcmtmbG93TG9nc1Jlc3BvbnNlPih7XG4gICAgICAgICAgZGF0YTogY3JlYXRlTW9ja0xvZ3NSZXNwb25zZShbY3JlYXRlTW9ja1dvcmtmbG93TG9nKCldLCAxKSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGNoYXRBcHAgPSBjcmVhdGVNb2NrQXBwKHsgbW9kZTogJ2FkdmFuY2VkLWNoYXQnIGFzIEFwcE1vZGVFbnVtIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxMb2dzIGFwcERldGFpbD17Y2hhdEFwcH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYXBwTG9nLnRhYmxlLmhlYWRlci50cmlnZ2VyZWRfZnJvbScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlcnJvciBzdGF0ZSBmcm9tIHVzZVdvcmtmbG93TG9ncycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICBlcnJvcjogbmV3IEVycm9yKCdGYWlsZWQgdG8gZmV0Y2gnKSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhRdWVyeUNsaWVudCg8TG9ncyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHNob3cgbG9hZGluZyBzdGF0ZSB3aGVuIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zcGluLWFuaW1hdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFwcCB3aXRoIGRpZmZlcmVudCBJRCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tlZFVzZVdvcmtmbG93TG9ncy5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICAgIGNyZWF0ZU1vY2tRdWVyeVJlc3VsdDxXb3JrZmxvd0xvZ3NSZXNwb25zZT4oe1xuICAgICAgICAgIGRhdGE6IGNyZWF0ZU1vY2tMb2dzUmVzcG9uc2UoW10sIDApLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgY3VzdG9tQXBwID0gY3JlYXRlTW9ja0FwcCh7IGlkOiAnY3VzdG9tLWFwcC0xMjMnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxMb2dzIGFwcERldGFpbD17Y3VzdG9tQXBwfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjYWxsQXJnID0gZ2V0TW9ja0NhbGxQYXJhbXMoKVxuICAgICAgZXhwZWN0KGNhbGxBcmc/LmFwcElkKS50b0JlKCdjdXN0b20tYXBwLTEyMycpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=