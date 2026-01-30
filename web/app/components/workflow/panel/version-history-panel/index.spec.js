"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const types_1 = require("../../types");
const mockHandleRestoreFromPublishedWorkflow = vi.fn();
const mockHandleLoadBackupDraft = vi.fn();
const mockSetCurrentVersion = vi.fn();
vi.mock('@/context/app-context', () => ({
    useSelector: () => ({ id: 'test-user-id' }),
}));
vi.mock('@/service/use-workflow', () => ({
    useDeleteWorkflow: () => ({ mutateAsync: vi.fn() }),
    useInvalidAllLastRun: () => vi.fn(),
    useResetWorkflowVersionHistory: () => vi.fn(),
    useUpdateWorkflow: () => ({ mutateAsync: vi.fn() }),
    useWorkflowVersionHistory: () => ({
        data: {
            pages: [
                {
                    items: [
                        {
                            id: 'draft-version-id',
                            version: types_1.WorkflowVersion.Draft,
                            graph: { nodes: [], edges: [], viewport: null },
                            features: {
                                opening_statement: '',
                                suggested_questions: [],
                                suggested_questions_after_answer: { enabled: false },
                                text_to_speech: { enabled: false },
                                speech_to_text: { enabled: false },
                                retriever_resource: { enabled: false },
                                sensitive_word_avoidance: { enabled: false },
                                file_upload: { image: { enabled: false } },
                            },
                            created_at: Date.now() / 1000,
                            created_by: { id: 'user-1', name: 'User 1' },
                            environment_variables: [],
                            marked_name: '',
                            marked_comment: '',
                        },
                        {
                            id: 'published-version-id',
                            version: '2024-01-01T00:00:00Z',
                            graph: { nodes: [], edges: [], viewport: null },
                            features: {
                                opening_statement: '',
                                suggested_questions: [],
                                suggested_questions_after_answer: { enabled: false },
                                text_to_speech: { enabled: false },
                                speech_to_text: { enabled: false },
                                retriever_resource: { enabled: false },
                                sensitive_word_avoidance: { enabled: false },
                                file_upload: { image: { enabled: false } },
                            },
                            created_at: Date.now() / 1000,
                            created_by: { id: 'user-1', name: 'User 1' },
                            environment_variables: [],
                            marked_name: 'v1.0',
                            marked_comment: 'First release',
                        },
                    ],
                },
            ],
        },
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetching: false,
    }),
}));
vi.mock('../../hooks', () => ({
    useDSL: () => ({ handleExportDSL: vi.fn() }),
    useNodesSyncDraft: () => ({ handleSyncWorkflowDraft: vi.fn() }),
    useWorkflowRun: () => ({
        handleRestoreFromPublishedWorkflow: mockHandleRestoreFromPublishedWorkflow,
        handleLoadBackupDraft: mockHandleLoadBackupDraft,
    }),
}));
vi.mock('../../hooks-store', () => ({
    useHooksStore: () => ({
        flowId: 'test-flow-id',
        flowType: 'workflow',
    }),
}));
vi.mock('../../store', () => ({
    useStore: (selector) => {
        const state = {
            setShowWorkflowVersionHistoryPanel: vi.fn(),
            currentVersion: null,
            setCurrentVersion: mockSetCurrentVersion,
        };
        return selector(state);
    },
    useWorkflowStore: () => ({
        getState: () => ({
            deleteAllInspectVars: vi.fn(),
        }),
        setState: vi.fn(),
    }),
}));
vi.mock('./delete-confirm-modal', () => ({
    default: () => null,
}));
vi.mock('./restore-confirm-modal', () => ({
    default: () => null,
}));
vi.mock('@/app/components/app/app-publisher/version-info-modal', () => ({
    default: () => null,
}));
describe('VersionHistoryPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Version Click Behavior', () => {
        it('should call handleLoadBackupDraft when draft version is selected on mount', async () => {
            const { VersionHistoryPanel } = await Promise.resolve().then(() => require('./index'));
            (0, react_1.render)(<VersionHistoryPanel latestVersionId="published-version-id"/>);
            // Draft version auto-clicks on mount via useEffect in VersionHistoryItem
            expect(mockHandleLoadBackupDraft).toHaveBeenCalled();
            expect(mockHandleRestoreFromPublishedWorkflow).not.toHaveBeenCalled();
        });
        it('should call handleRestoreFromPublishedWorkflow when clicking published version', async () => {
            const { VersionHistoryPanel } = await Promise.resolve().then(() => require('./index'));
            (0, react_1.render)(<VersionHistoryPanel latestVersionId="published-version-id"/>);
            // Clear mocks after initial render (draft version auto-clicks on mount)
            vi.clearAllMocks();
            const publishedItem = react_1.screen.getByText('v1.0');
            react_1.fireEvent.click(publishedItem);
            expect(mockHandleRestoreFromPublishedWorkflow).toHaveBeenCalled();
            expect(mockHandleLoadBackupDraft).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQWtFO0FBQ2xFLHVDQUE2QztBQUU3QyxNQUFNLHNDQUFzQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN0RCxNQUFNLHlCQUF5QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN6QyxNQUFNLHFCQUFxQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUVyQyxFQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLENBQUM7Q0FDNUMsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNuRCxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQ25DLDhCQUE4QixFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDN0MsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUNuRCx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLElBQUksRUFBRTtZQUNKLEtBQUssRUFBRTtnQkFDTDtvQkFDRSxLQUFLLEVBQUU7d0JBQ0w7NEJBQ0UsRUFBRSxFQUFFLGtCQUFrQjs0QkFDdEIsT0FBTyxFQUFFLHVCQUFlLENBQUMsS0FB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O0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgV29ya2Zsb3dWZXJzaW9uIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5cbmNvbnN0IG1vY2tIYW5kbGVSZXN0b3JlRnJvbVB1Ymxpc2hlZFdvcmtmbG93ID0gdmkuZm4oKVxuY29uc3QgbW9ja0hhbmRsZUxvYWRCYWNrdXBEcmFmdCA9IHZpLmZuKClcbmNvbnN0IG1vY2tTZXRDdXJyZW50VmVyc2lvbiA9IHZpLmZuKClcblxudmkubW9jaygnQC9jb250ZXh0L2FwcC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlU2VsZWN0b3I6ICgpID0+ICh7IGlkOiAndGVzdC11c2VyLWlkJyB9KSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLXdvcmtmbG93JywgKCkgPT4gKHtcbiAgdXNlRGVsZXRlV29ya2Zsb3c6ICgpID0+ICh7IG11dGF0ZUFzeW5jOiB2aS5mbigpIH0pLFxuICB1c2VJbnZhbGlkQWxsTGFzdFJ1bjogKCkgPT4gdmkuZm4oKSxcbiAgdXNlUmVzZXRXb3JrZmxvd1ZlcnNpb25IaXN0b3J5OiAoKSA9PiB2aS5mbigpLFxuICB1c2VVcGRhdGVXb3JrZmxvdzogKCkgPT4gKHsgbXV0YXRlQXN5bmM6IHZpLmZuKCkgfSksXG4gIHVzZVdvcmtmbG93VmVyc2lvbkhpc3Rvcnk6ICgpID0+ICh7XG4gICAgZGF0YToge1xuICAgICAgcGFnZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAnZHJhZnQtdmVyc2lvbi1pZCcsXG4gICAgICAgICAgICAgIHZlcnNpb246IFdvcmtmbG93VmVyc2lvbi5EcmFmdCxcbiAgICAgICAgICAgICAgZ3JhcGg6IHsgbm9kZXM6IFtdLCBlZGdlczogW10sIHZpZXdwb3J0OiBudWxsIH0sXG4gICAgICAgICAgICAgIGZlYXR1cmVzOiB7XG4gICAgICAgICAgICAgICAgb3BlbmluZ19zdGF0ZW1lbnQ6ICcnLFxuICAgICAgICAgICAgICAgIHN1Z2dlc3RlZF9xdWVzdGlvbnM6IFtdLFxuICAgICAgICAgICAgICAgIHN1Z2dlc3RlZF9xdWVzdGlvbnNfYWZ0ZXJfYW5zd2VyOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgdGV4dF90b19zcGVlY2g6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICBzcGVlY2hfdG9fdGV4dDogeyBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgICAgIHJldHJpZXZlcl9yZXNvdXJjZTogeyBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgICAgIHNlbnNpdGl2ZV93b3JkX2F2b2lkYW5jZTogeyBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgICAgIGZpbGVfdXBsb2FkOiB7IGltYWdlOiB7IGVuYWJsZWQ6IGZhbHNlIH0gfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSAvIDEwMDAsXG4gICAgICAgICAgICAgIGNyZWF0ZWRfYnk6IHsgaWQ6ICd1c2VyLTEnLCBuYW1lOiAnVXNlciAxJyB9LFxuICAgICAgICAgICAgICBlbnZpcm9ubWVudF92YXJpYWJsZXM6IFtdLFxuICAgICAgICAgICAgICBtYXJrZWRfbmFtZTogJycsXG4gICAgICAgICAgICAgIG1hcmtlZF9jb21tZW50OiAnJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiAncHVibGlzaGVkLXZlcnNpb24taWQnLFxuICAgICAgICAgICAgICB2ZXJzaW9uOiAnMjAyNC0wMS0wMVQwMDowMDowMFonLFxuICAgICAgICAgICAgICBncmFwaDogeyBub2RlczogW10sIGVkZ2VzOiBbXSwgdmlld3BvcnQ6IG51bGwgfSxcbiAgICAgICAgICAgICAgZmVhdHVyZXM6IHtcbiAgICAgICAgICAgICAgICBvcGVuaW5nX3N0YXRlbWVudDogJycsXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGVkX3F1ZXN0aW9uczogW10sXG4gICAgICAgICAgICAgICAgc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXI6IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICB0ZXh0X3RvX3NwZWVjaDogeyBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgICAgIHNwZWVjaF90b190ZXh0OiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgcmV0cmlldmVyX3Jlc291cmNlOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgc2Vuc2l0aXZlX3dvcmRfYXZvaWRhbmNlOiB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICAgICAgICAgICAgZmlsZV91cGxvYWQ6IHsgaW1hZ2U6IHsgZW5hYmxlZDogZmFsc2UgfSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjcmVhdGVkX2F0OiBEYXRlLm5vdygpIC8gMTAwMCxcbiAgICAgICAgICAgICAgY3JlYXRlZF9ieTogeyBpZDogJ3VzZXItMScsIG5hbWU6ICdVc2VyIDEnIH0sXG4gICAgICAgICAgICAgIGVudmlyb25tZW50X3ZhcmlhYmxlczogW10sXG4gICAgICAgICAgICAgIG1hcmtlZF9uYW1lOiAndjEuMCcsXG4gICAgICAgICAgICAgIG1hcmtlZF9jb21tZW50OiAnRmlyc3QgcmVsZWFzZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgZmV0Y2hOZXh0UGFnZTogdmkuZm4oKSxcbiAgICBoYXNOZXh0UGFnZTogZmFsc2UsXG4gICAgaXNGZXRjaGluZzogZmFsc2UsXG4gIH0pLFxufSkpXG5cbnZpLm1vY2soJy4uLy4uL2hvb2tzJywgKCkgPT4gKHtcbiAgdXNlRFNMOiAoKSA9PiAoeyBoYW5kbGVFeHBvcnREU0w6IHZpLmZuKCkgfSksXG4gIHVzZU5vZGVzU3luY0RyYWZ0OiAoKSA9PiAoeyBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdDogdmkuZm4oKSB9KSxcbiAgdXNlV29ya2Zsb3dSdW46ICgpID0+ICh7XG4gICAgaGFuZGxlUmVzdG9yZUZyb21QdWJsaXNoZWRXb3JrZmxvdzogbW9ja0hhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3csXG4gICAgaGFuZGxlTG9hZEJhY2t1cERyYWZ0OiBtb2NrSGFuZGxlTG9hZEJhY2t1cERyYWZ0LFxuICB9KSxcbn0pKVxuXG52aS5tb2NrKCcuLi8uLi9ob29rcy1zdG9yZScsICgpID0+ICh7XG4gIHVzZUhvb2tzU3RvcmU6ICgpID0+ICh7XG4gICAgZmxvd0lkOiAndGVzdC1mbG93LWlkJyxcbiAgICBmbG93VHlwZTogJ3dvcmtmbG93JyxcbiAgfSksXG59KSlcblxudmkubW9jaygnLi4vLi4vc3RvcmUnLCAoKSA9PiAoe1xuICB1c2VTdG9yZTogKHNlbGVjdG9yOiAoc3RhdGU6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICBzZXRTaG93V29ya2Zsb3dWZXJzaW9uSGlzdG9yeVBhbmVsOiB2aS5mbigpLFxuICAgICAgY3VycmVudFZlcnNpb246IG51bGwsXG4gICAgICBzZXRDdXJyZW50VmVyc2lvbjogbW9ja1NldEN1cnJlbnRWZXJzaW9uLFxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3Ioc3RhdGUpXG4gIH0sXG4gIHVzZVdvcmtmbG93U3RvcmU6ICgpID0+ICh7XG4gICAgZ2V0U3RhdGU6ICgpID0+ICh7XG4gICAgICBkZWxldGVBbGxJbnNwZWN0VmFyczogdmkuZm4oKSxcbiAgICB9KSxcbiAgICBzZXRTdGF0ZTogdmkuZm4oKSxcbiAgfSksXG59KSlcblxudmkubW9jaygnLi9kZWxldGUtY29uZmlybS1tb2RhbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IG51bGwsXG59KSlcblxudmkubW9jaygnLi9yZXN0b3JlLWNvbmZpcm0tbW9kYWwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiBudWxsLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYXBwL2FwcC1wdWJsaXNoZXIvdmVyc2lvbi1pbmZvLW1vZGFsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gbnVsbCxcbn0pKVxuXG5kZXNjcmliZSgnVmVyc2lvbkhpc3RvcnlQYW5lbCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1ZlcnNpb24gQ2xpY2sgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZUxvYWRCYWNrdXBEcmFmdCB3aGVuIGRyYWZ0IHZlcnNpb24gaXMgc2VsZWN0ZWQgb24gbW91bnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IFZlcnNpb25IaXN0b3J5UGFuZWwgfSA9IGF3YWl0IGltcG9ydCgnLi9pbmRleCcpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFZlcnNpb25IaXN0b3J5UGFuZWxcbiAgICAgICAgICBsYXRlc3RWZXJzaW9uSWQ9XCJwdWJsaXNoZWQtdmVyc2lvbi1pZFwiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBEcmFmdCB2ZXJzaW9uIGF1dG8tY2xpY2tzIG9uIG1vdW50IHZpYSB1c2VFZmZlY3QgaW4gVmVyc2lvbkhpc3RvcnlJdGVtXG4gICAgICBleHBlY3QobW9ja0hhbmRsZUxvYWRCYWNrdXBEcmFmdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3cpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3cgd2hlbiBjbGlja2luZyBwdWJsaXNoZWQgdmVyc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgVmVyc2lvbkhpc3RvcnlQYW5lbCB9ID0gYXdhaXQgaW1wb3J0KCcuL2luZGV4JylcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8VmVyc2lvbkhpc3RvcnlQYW5lbFxuICAgICAgICAgIGxhdGVzdFZlcnNpb25JZD1cInB1Ymxpc2hlZC12ZXJzaW9uLWlkXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENsZWFyIG1vY2tzIGFmdGVyIGluaXRpYWwgcmVuZGVyIChkcmFmdCB2ZXJzaW9uIGF1dG8tY2xpY2tzIG9uIG1vdW50KVxuICAgICAgdmkuY2xlYXJBbGxNb2NrcygpXG5cbiAgICAgIGNvbnN0IHB1Ymxpc2hlZEl0ZW0gPSBzY3JlZW4uZ2V0QnlUZXh0KCd2MS4wJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhwdWJsaXNoZWRJdGVtKVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3cpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG1vY2tIYW5kbGVMb2FkQmFja3VwRHJhZnQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==