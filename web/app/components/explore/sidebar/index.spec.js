"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const toast_1 = require("@/app/components/base/toast");
const explore_context_1 = require("@/context/explore-context");
const use_breakpoints_1 = require("@/hooks/use-breakpoints");
const app_1 = require("@/types/app");
const index_1 = require("./index");
const mockSegments = ['apps'];
const mockPush = vi.fn();
const mockRefetch = vi.fn();
const mockUninstall = vi.fn();
const mockUpdatePinStatus = vi.fn();
let mockIsFetching = false;
let mockInstalledApps = [];
vi.mock('next/navigation', () => ({
    useSelectedLayoutSegments: () => mockSegments,
    useRouter: () => ({
        push: mockPush,
    }),
}));
vi.mock('@/hooks/use-breakpoints', () => ({
    default: () => use_breakpoints_1.MediaType.pc,
    MediaType: {
        mobile: 'mobile',
        tablet: 'tablet',
        pc: 'pc',
    },
}));
vi.mock('@/service/use-explore', () => ({
    useGetInstalledApps: () => ({
        isFetching: mockIsFetching,
        data: { installed_apps: mockInstalledApps },
        refetch: mockRefetch,
    }),
    useUninstallApp: () => ({
        mutateAsync: mockUninstall,
    }),
    useUpdateAppPinStatus: () => ({
        mutateAsync: mockUpdatePinStatus,
    }),
}));
const createInstalledApp = (overrides = {}) => ({
    id: overrides.id ?? 'app-123',
    uninstallable: overrides.uninstallable ?? false,
    is_pinned: overrides.is_pinned ?? false,
    app: {
        id: overrides.app?.id ?? 'app-basic-id',
        mode: overrides.app?.mode ?? app_1.AppModeEnum.CHAT,
        icon_type: overrides.app?.icon_type ?? 'emoji',
        icon: overrides.app?.icon ?? '🤖',
        icon_background: overrides.app?.icon_background ?? '#fff',
        icon_url: overrides.app?.icon_url ?? '',
        name: overrides.app?.name ?? 'My App',
        description: overrides.app?.description ?? 'desc',
        use_icon_as_answer_icon: overrides.app?.use_icon_as_answer_icon ?? false,
    },
});
const renderWithContext = (installedApps = []) => {
    return (0, react_1.render)(<explore_context_1.default.Provider value={{
            controlUpdateInstalledApps: 0,
            setControlUpdateInstalledApps: vi.fn(),
            hasEditPermission: true,
            installedApps,
            setInstalledApps: vi.fn(),
            isFetchingInstalledApps: false,
            setIsFetchingInstalledApps: vi.fn(),
        }}>
      <index_1.default controlUpdateInstalledApps={0}/>
    </explore_context_1.default.Provider>);
};
describe('SideBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsFetching = false;
        mockInstalledApps = [];
        vi.spyOn(toast_1.default, 'notify').mockImplementation(() => ({ clear: vi.fn() }));
    });
    // Rendering: show discovery and workspace section.
    describe('Rendering', () => {
        it('should render workspace items when installed apps exist', () => {
            // Arrange
            mockInstalledApps = [createInstalledApp()];
            // Act
            renderWithContext(mockInstalledApps);
            // Assert
            expect(react_1.screen.getByText('explore.sidebar.discovery')).toBeInTheDocument();
            expect(react_1.screen.getByText('explore.sidebar.workspace')).toBeInTheDocument();
            expect(react_1.screen.getByText('My App')).toBeInTheDocument();
        });
    });
    // Effects: refresh and sync installed apps state.
    describe('Effects', () => {
        it('should refetch installed apps on mount', () => {
            // Arrange
            mockInstalledApps = [createInstalledApp()];
            // Act
            renderWithContext(mockInstalledApps);
            // Assert
            expect(mockRefetch).toHaveBeenCalledTimes(1);
        });
    });
    // User interactions: delete and pin flows.
    describe('User Interactions', () => {
        it('should uninstall app and show toast when delete is confirmed', async () => {
            // Arrange
            mockInstalledApps = [createInstalledApp()];
            mockUninstall.mockResolvedValue(undefined);
            renderWithContext(mockInstalledApps);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('item-operation-trigger'));
            react_1.fireEvent.click(await react_1.screen.findByText('explore.sidebar.action.delete'));
            react_1.fireEvent.click(await react_1.screen.findByText('common.operation.confirm'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockUninstall).toHaveBeenCalledWith('app-123');
                expect(toast_1.default.notify).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'success',
                    message: 'common.api.remove',
                }));
            });
        });
        it('should update pin status and show toast when pin is clicked', async () => {
            // Arrange
            mockInstalledApps = [createInstalledApp({ is_pinned: false })];
            mockUpdatePinStatus.mockResolvedValue(undefined);
            renderWithContext(mockInstalledApps);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('item-operation-trigger'));
            react_1.fireEvent.click(await react_1.screen.findByText('explore.sidebar.action.pin'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockUpdatePinStatus).toHaveBeenCalledWith({ appId: 'app-123', isPinned: true });
                expect(toast_1.default.notify).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'success',
                    message: 'common.api.success',
                }));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLHVEQUErQztBQUMvQywrREFBc0Q7QUFDdEQsNkRBQW1EO0FBQ25ELHFDQUF5QztBQUN6QyxtQ0FBNkI7QUFFN0IsTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM3QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDeEIsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzNCLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM3QixNQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNuQyxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUE7QUFDMUIsSUFBSSxpQkFBaUIsR0FBbUIsRUFBRSxDQUFBO0FBRTFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFZO0lBQzdDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLElBQUksRUFBRSxRQUFRO0tBQ2YsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQywyQkFBUyxDQUFDLEVBQUU7SUFDM0IsU0FBUyxFQUFFO1FBQ1QsTUFBTSxFQUFFLFFBQVE7UUFDaEIsTUFBTSxFQUFFLFFBQVE7UUFDaEIsRUFBRSxFQUFFLElBQUk7S0FDVDtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFB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O1lBRXRFLFNBQVM7WUFDVCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO2dCQUN0RixNQUFNLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDaEUsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsT0FBTyxFQUFFLG9CQUFvQjtpQkFDOUIsQ0FBQyxDQUFDLENBQUE7WUFDTCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgSW5zdGFsbGVkQXBwIH0gZnJvbSAnQC9tb2RlbHMvZXhwbG9yZSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IFRvYXN0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCBFeHBsb3JlQ29udGV4dCBmcm9tICdAL2NvbnRleHQvZXhwbG9yZS1jb250ZXh0J1xuaW1wb3J0IHsgTWVkaWFUeXBlIH0gZnJvbSAnQC9ob29rcy91c2UtYnJlYWtwb2ludHMnXG5pbXBvcnQgeyBBcHBNb2RlRW51bSB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IFNpZGVCYXIgZnJvbSAnLi9pbmRleCdcblxuY29uc3QgbW9ja1NlZ21lbnRzID0gWydhcHBzJ11cbmNvbnN0IG1vY2tQdXNoID0gdmkuZm4oKVxuY29uc3QgbW9ja1JlZmV0Y2ggPSB2aS5mbigpXG5jb25zdCBtb2NrVW5pbnN0YWxsID0gdmkuZm4oKVxuY29uc3QgbW9ja1VwZGF0ZVBpblN0YXR1cyA9IHZpLmZuKClcbmxldCBtb2NrSXNGZXRjaGluZyA9IGZhbHNlXG5sZXQgbW9ja0luc3RhbGxlZEFwcHM6IEluc3RhbGxlZEFwcFtdID0gW11cblxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlU2VsZWN0ZWRMYXlvdXRTZWdtZW50czogKCkgPT4gbW9ja1NlZ21lbnRzLFxuICB1c2VSb3V0ZXI6ICgpID0+ICh7XG4gICAgcHVzaDogbW9ja1B1c2gsXG4gIH0pLFxufSkpXG5cbnZpLm1vY2soJ0AvaG9va3MvdXNlLWJyZWFrcG9pbnRzJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gTWVkaWFUeXBlLnBjLFxuICBNZWRpYVR5cGU6IHtcbiAgICBtb2JpbGU6ICdtb2JpbGUnLFxuICAgIHRhYmxldDogJ3RhYmxldCcsXG4gICAgcGM6ICdwYycsXG4gIH0sXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1leHBsb3JlJywgKCkgPT4gKHtcbiAgdXNlR2V0SW5zdGFsbGVkQXBwczogKCkgPT4gKHtcbiAgICBpc0ZldGNoaW5nOiBtb2NrSXNGZXRjaGluZyxcbiAgICBkYXRhOiB7IGluc3RhbGxlZF9hcHBzOiBtb2NrSW5zdGFsbGVkQXBwcyB9LFxuICAgIHJlZmV0Y2g6IG1vY2tSZWZldGNoLFxuICB9KSxcbiAgdXNlVW5pbnN0YWxsQXBwOiAoKSA9PiAoe1xuICAgIG11dGF0ZUFzeW5jOiBtb2NrVW5pbnN0YWxsLFxuICB9KSxcbiAgdXNlVXBkYXRlQXBwUGluU3RhdHVzOiAoKSA9PiAoe1xuICAgIG11dGF0ZUFzeW5jOiBtb2NrVXBkYXRlUGluU3RhdHVzLFxuICB9KSxcbn0pKVxuXG5jb25zdCBjcmVhdGVJbnN0YWxsZWRBcHAgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPEluc3RhbGxlZEFwcD4gPSB7fSk6IEluc3RhbGxlZEFwcCA9PiAoe1xuICBpZDogb3ZlcnJpZGVzLmlkID8/ICdhcHAtMTIzJyxcbiAgdW5pbnN0YWxsYWJsZTogb3ZlcnJpZGVzLnVuaW5zdGFsbGFibGUgPz8gZmFsc2UsXG4gIGlzX3Bpbm5lZDogb3ZlcnJpZGVzLmlzX3Bpbm5lZCA/PyBmYWxzZSxcbiAgYXBwOiB7XG4gICAgaWQ6IG92ZXJyaWRlcy5hcHA/LmlkID8/ICdhcHAtYmFzaWMtaWQnLFxuICAgIG1vZGU6IG92ZXJyaWRlcy5hcHA/Lm1vZGUgPz8gQXBwTW9kZUVudW0uQ0hBVCxcbiAgICBpY29uX3R5cGU6IG92ZXJyaWRlcy5hcHA/Lmljb25fdHlwZSA/PyAnZW1vamknLFxuICAgIGljb246IG92ZXJyaWRlcy5hcHA/Lmljb24gPz8gJ/CfpJYnLFxuICAgIGljb25fYmFja2dyb3VuZDogb3ZlcnJpZGVzLmFwcD8uaWNvbl9iYWNrZ3JvdW5kID8/ICcjZmZmJyxcbiAgICBpY29uX3VybDogb3ZlcnJpZGVzLmFwcD8uaWNvbl91cmwgPz8gJycsXG4gICAgbmFtZTogb3ZlcnJpZGVzLmFwcD8ubmFtZSA/PyAnTXkgQXBwJyxcbiAgICBkZXNjcmlwdGlvbjogb3ZlcnJpZGVzLmFwcD8uZGVzY3JpcHRpb24gPz8gJ2Rlc2MnLFxuICAgIHVzZV9pY29uX2FzX2Fuc3dlcl9pY29uOiBvdmVycmlkZXMuYXBwPy51c2VfaWNvbl9hc19hbnN3ZXJfaWNvbiA/PyBmYWxzZSxcbiAgfSxcbn0pXG5cbmNvbnN0IHJlbmRlcldpdGhDb250ZXh0ID0gKGluc3RhbGxlZEFwcHM6IEluc3RhbGxlZEFwcFtdID0gW10pID0+IHtcbiAgcmV0dXJuIHJlbmRlcihcbiAgICA8RXhwbG9yZUNvbnRleHQuUHJvdmlkZXJcbiAgICAgIHZhbHVlPXt7XG4gICAgICAgIGNvbnRyb2xVcGRhdGVJbnN0YWxsZWRBcHBzOiAwLFxuICAgICAgICBzZXRDb250cm9sVXBkYXRlSW5zdGFsbGVkQXBwczogdmkuZm4oKSxcbiAgICAgICAgaGFzRWRpdFBlcm1pc3Npb246IHRydWUsXG4gICAgICAgIGluc3RhbGxlZEFwcHMsXG4gICAgICAgIHNldEluc3RhbGxlZEFwcHM6IHZpLmZuKCksXG4gICAgICAgIGlzRmV0Y2hpbmdJbnN0YWxsZWRBcHBzOiBmYWxzZSxcbiAgICAgICAgc2V0SXNGZXRjaGluZ0luc3RhbGxlZEFwcHM6IHZpLmZuKCksXG4gICAgICB9fVxuICAgID5cbiAgICAgIDxTaWRlQmFyIGNvbnRyb2xVcGRhdGVJbnN0YWxsZWRBcHBzPXswfSAvPlxuICAgIDwvRXhwbG9yZUNvbnRleHQuUHJvdmlkZXI+LFxuICApXG59XG5cbmRlc2NyaWJlKCdTaWRlQmFyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSXNGZXRjaGluZyA9IGZhbHNlXG4gICAgbW9ja0luc3RhbGxlZEFwcHMgPSBbXVxuICAgIHZpLnNweU9uKFRvYXN0LCAnbm90aWZ5JykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+ICh7IGNsZWFyOiB2aS5mbigpIH0pKVxuICB9KVxuXG4gIC8vIFJlbmRlcmluZzogc2hvdyBkaXNjb3ZlcnkgYW5kIHdvcmtzcGFjZSBzZWN0aW9uLlxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdvcmtzcGFjZSBpdGVtcyB3aGVuIGluc3RhbGxlZCBhcHBzIGV4aXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0luc3RhbGxlZEFwcHMgPSBbY3JlYXRlSW5zdGFsbGVkQXBwKCldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aENvbnRleHQobW9ja0luc3RhbGxlZEFwcHMpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2V4cGxvcmUuc2lkZWJhci5kaXNjb3ZlcnknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2V4cGxvcmUuc2lkZWJhci53b3Jrc3BhY2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IEFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBFZmZlY3RzOiByZWZyZXNoIGFuZCBzeW5jIGluc3RhbGxlZCBhcHBzIHN0YXRlLlxuICBkZXNjcmliZSgnRWZmZWN0cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlZmV0Y2ggaW5zdGFsbGVkIGFwcHMgb24gbW91bnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSW5zdGFsbGVkQXBwcyA9IFtjcmVhdGVJbnN0YWxsZWRBcHAoKV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoQ29udGV4dChtb2NrSW5zdGFsbGVkQXBwcylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1JlZmV0Y2gpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBpbnRlcmFjdGlvbnM6IGRlbGV0ZSBhbmQgcGluIGZsb3dzLlxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1bmluc3RhbGwgYXBwIGFuZCBzaG93IHRvYXN0IHdoZW4gZGVsZXRlIGlzIGNvbmZpcm1lZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJbnN0YWxsZWRBcHBzID0gW2NyZWF0ZUluc3RhbGxlZEFwcCgpXVxuICAgICAgbW9ja1VuaW5zdGFsbC5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG4gICAgICByZW5kZXJXaXRoQ29udGV4dChtb2NrSW5zdGFsbGVkQXBwcylcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpdGVtLW9wZXJhdGlvbi10cmlnZ2VyJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ2V4cGxvcmUuc2lkZWJhci5hY3Rpb24uZGVsZXRlJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYXdhaXQgc2NyZWVuLmZpbmRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY29uZmlybScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VuaW5zdGFsbCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2FwcC0xMjMnKVxuICAgICAgICBleHBlY3QoVG9hc3Qubm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdjb21tb24uYXBpLnJlbW92ZScsXG4gICAgICAgIH0pKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcGluIHN0YXR1cyBhbmQgc2hvdyB0b2FzdCB3aGVuIHBpbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0luc3RhbGxlZEFwcHMgPSBbY3JlYXRlSW5zdGFsbGVkQXBwKHsgaXNfcGlubmVkOiBmYWxzZSB9KV1cbiAgICAgIG1vY2tVcGRhdGVQaW5TdGF0dXMubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuICAgICAgcmVuZGVyV2l0aENvbnRleHQobW9ja0luc3RhbGxlZEFwcHMpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaXRlbS1vcGVyYXRpb24tdHJpZ2dlcicpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGF3YWl0IHNjcmVlbi5maW5kQnlUZXh0KCdleHBsb3JlLnNpZGViYXIuYWN0aW9uLnBpbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VwZGF0ZVBpblN0YXR1cykudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBhcHBJZDogJ2FwcC0xMjMnLCBpc1Bpbm5lZDogdHJ1ZSB9KVxuICAgICAgICBleHBlY3QoVG9hc3Qubm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdjb21tb24uYXBpLnN1Y2Nlc3MnLFxuICAgICAgICB9KSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=