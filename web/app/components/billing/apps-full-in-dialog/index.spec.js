"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const type_1 = require("@/app/components/billing/type");
const util_1 = require("@/app/components/header/utils/util");
const app_context_1 = require("@/context/app-context");
const provider_context_1 = require("@/context/provider-context");
const index_1 = require("./index");
vi.mock('@/context/app-context', () => ({
    useAppContext: vi.fn(),
}));
vi.mock('@/context/provider-context', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useProviderContext: vi.fn(),
    };
});
vi.mock('@/context/modal-context', () => ({
    useModalContext: () => ({
        setShowPricingModal: vi.fn(),
    }),
}));
vi.mock('@/app/components/header/utils/util', () => ({
    mailToSupport: vi.fn(),
}));
const buildUsage = (overrides = {}) => ({
    buildApps: 0,
    teamMembers: 0,
    annotatedResponse: 0,
    documentsUploadQuota: 0,
    apiRateLimit: 0,
    triggerEvents: 0,
    vectorSpace: 0,
    ...overrides,
});
const buildProviderContext = (overrides = {}) => ({
    ...provider_context_1.baseProviderContextValue,
    plan: {
        ...provider_context_1.baseProviderContextValue.plan,
        type: type_1.Plan.sandbox,
        usage: buildUsage({ buildApps: 2 }),
        total: buildUsage({ buildApps: 10 }),
        reset: {
            apiRateLimit: null,
            triggerEvents: null,
        },
    },
    ...overrides,
});
const buildAppContext = (overrides = {}) => {
    const userProfile = {
        id: 'user-id',
        name: 'Test User',
        email: 'user@example.com',
        avatar: '',
        avatar_url: '',
        is_password_set: false,
    };
    const currentWorkspace = {
        id: 'workspace-id',
        name: 'Workspace',
        plan: '',
        status: '',
        created_at: 0,
        role: 'normal',
        providers: [],
        trial_credits: 200,
        trial_credits_used: 0,
        next_credit_reset_date: 0,
    };
    const langGeniusVersionInfo = {
        current_env: '',
        current_version: '1.0.0',
        latest_version: '',
        release_date: '',
        release_notes: '',
        version: '',
        can_auto_update: false,
    };
    const base = {
        userProfile,
        currentWorkspace,
        isCurrentWorkspaceManager: false,
        isCurrentWorkspaceOwner: false,
        isCurrentWorkspaceEditor: false,
        isCurrentWorkspaceDatasetOperator: false,
        mutateUserProfile: vi.fn(),
        mutateCurrentWorkspace: vi.fn(),
        langGeniusVersionInfo,
        isLoadingCurrentWorkspace: false,
        isValidatingCurrentWorkspace: false,
    };
    const useSelector = selector => selector({ ...base, useSelector });
    return {
        ...base,
        useSelector,
        ...overrides,
    };
};
describe('AppsFull', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        provider_context_1.useProviderContext.mockReturnValue(buildProviderContext());
        app_context_1.useAppContext.mockReturnValue(buildAppContext());
        util_1.mailToSupport.mockReturnValue('mailto:support@example.com');
    });
    // Rendering behavior for non-team plans.
    describe('Rendering', () => {
        it('should render the sandbox messaging and upgrade button', () => {
            // Act
            (0, react_1.render)(<index_1.default loc="billing_dialog"/>);
            // Assert
            expect(react_1.screen.getByText('billing.apps.fullTip1')).toBeInTheDocument();
            expect(react_1.screen.getByText('billing.apps.fullTip1des')).toBeInTheDocument();
            expect(react_1.screen.getByText('billing.upgradeBtn.encourageShort')).toBeInTheDocument();
            expect(react_1.screen.getByText('2/10')).toBeInTheDocument();
        });
    });
    // Prop-driven behavior for team plans and contact CTA.
    describe('Props', () => {
        it('should render team messaging and contact button for non-sandbox plans', () => {
            // Arrange
            ;
            provider_context_1.useProviderContext.mockReturnValue(buildProviderContext({
                plan: {
                    ...provider_context_1.baseProviderContextValue.plan,
                    type: type_1.Plan.team,
                    usage: buildUsage({ buildApps: 8 }),
                    total: buildUsage({ buildApps: 10 }),
                    reset: {
                        apiRateLimit: null,
                        triggerEvents: null,
                    },
                },
            }));
            (0, react_1.render)(<index_1.default loc="billing_dialog"/>);
            // Assert
            expect(react_1.screen.getByText('billing.apps.fullTip2')).toBeInTheDocument();
            expect(react_1.screen.getByText('billing.apps.fullTip2des')).toBeInTheDocument();
            expect(react_1.screen.queryByText('billing.upgradeBtn.encourageShort')).not.toBeInTheDocument();
            expect(react_1.screen.getByRole('link', { name: 'billing.apps.contactUs' })).toHaveAttribute('href', 'mailto:support@example.com');
            expect(util_1.mailToSupport).toHaveBeenCalledWith('user@example.com', type_1.Plan.team, '1.0.0');
        });
        it('should render upgrade button for professional plans', () => {
            // Arrange
            ;
            provider_context_1.useProviderContext.mockReturnValue(buildProviderContext({
                plan: {
                    ...provider_context_1.baseProviderContextValue.plan,
                    type: type_1.Plan.professional,
                    usage: buildUsage({ buildApps: 4 }),
                    total: buildUsage({ buildApps: 10 }),
                    reset: {
                        apiRateLimit: null,
                        triggerEvents: null,
                    },
                },
            }));
            // Act
            (0, react_1.render)(<index_1.default loc="billing_dialog"/>);
            // Assert
            expect(react_1.screen.getByText('billing.apps.fullTip1')).toBeInTheDocument();
            expect(react_1.screen.getByText('billing.upgradeBtn.encourageShort')).toBeInTheDocument();
            expect(react_1.screen.queryByText('billing.apps.contactUs')).not.toBeInTheDocument();
        });
        it('should render contact button for enterprise plans', () => {
            // Arrange
            ;
            provider_context_1.useProviderContext.mockReturnValue(buildProviderContext({
                plan: {
                    ...provider_context_1.baseProviderContextValue.plan,
                    type: type_1.Plan.enterprise,
                    usage: buildUsage({ buildApps: 9 }),
                    total: buildUsage({ buildApps: 10 }),
                    reset: {
                        apiRateLimit: null,
                        triggerEvents: null,
                    },
                },
            }));
            // Act
            (0, react_1.render)(<index_1.default loc="billing_dialog"/>);
            // Assert
            expect(react_1.screen.getByText('billing.apps.fullTip1')).toBeInTheDocument();
            expect(react_1.screen.queryByText('billing.upgradeBtn.encourageShort')).not.toBeInTheDocument();
            expect(react_1.screen.getByRole('link', { name: 'billing.apps.contactUs' })).toHaveAttribute('href', 'mailto:support@example.com');
            expect(util_1.mailToSupport).toHaveBeenCalledWith('user@example.com', type_1.Plan.enterprise, '1.0.0');
        });
    });
    // Edge cases for progress color thresholds.
    describe('Edge Cases', () => {
        it('should use the success color when usage is below 50%', () => {
            // Arrange
            ;
            provider_context_1.useProviderContext.mockReturnValue(buildProviderContext({
                plan: {
                    ...provider_context_1.baseProviderContextValue.plan,
                    type: type_1.Plan.sandbox,
                    usage: buildUsage({ buildApps: 2 }),
                    total: buildUsage({ buildApps: 5 }),
                    reset: {
                        apiRateLimit: null,
                        triggerEvents: null,
                    },
                },
            }));
            // Act
            (0, react_1.render)(<index_1.default loc="billing_dialog"/>);
            // Assert
            expect(react_1.screen.getByTestId('billing-progress-bar')).toHaveClass('bg-components-progress-bar-progress-solid');
        });
        it('should use the warning color when usage is between 50% and 80%', () => {
            // Arrange
            ;
            provider_context_1.useProviderContext.mockReturnValue(buildProviderContext({
                plan: {
                    ...provider_context_1.baseProviderContextValue.plan,
                    type: type_1.Plan.sandbox,
                    usage: buildUsage({ buildApps: 6 }),
                    total: buildUsage({ buildApps: 10 }),
                    reset: {
                        apiRateLimit: null,
                        triggerEvents: null,
                    },
                },
            }));
            // Act
            (0, react_1.render)(<index_1.default loc="billing_dialog"/>);
            // Assert
            expect(react_1.screen.getByTestId('billing-progress-bar')).toHaveClass('bg-components-progress-warning-progress');
        });
        it('should use the error color when usage is 80% or higher', () => {
            // Arrange
            ;
            provider_context_1.useProviderContext.mockReturnValue(buildProviderContext({
                plan: {
                    ...provider_context_1.baseProviderContextValue.plan,
                    type: type_1.Plan.sandbox,
                    usage: buildUsage({ buildApps: 8 }),
                    total: buildUsage({ buildApps: 10 }),
                    reset: {
                        apiRateLimit: null,
                        triggerEvents: null,
                    },
                },
            }));
            // Act
            (0, react_1.render)(<index_1.default loc="billing_dialog"/>);
            // Assert
            expect(react_1.screen.getByTestId('billing-progress-bar')).toHaveClass('bg-components-progress-error-progress');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0Esa0RBQXVEO0FBQ3ZELHdEQUFvRDtBQUNwRCw2REFBa0U7QUFDbEUsdURBQXFEO0FBQ3JELGlFQUF5RjtBQUN6RixtQ0FBOEI7QUFFOUIsRUFBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ3ZCLENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQUU7SUFDN0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFjLEVBQStDLENBQUE7SUFDbEYsT0FBTztRQUNMLEdBQUcsTUFBTTtRQUNULGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7S0FDNUIsQ0FBQTtBQUNILENBQUMsQ0FBQyxDQUFBO0FBRUYsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7S0FDN0IsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELGFBQWEsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ3ZCLENBQUMsQ0FBQyxDQUFBO0FBRUgsTUFBTSxVQUFVLEdBQUcsQ0FBQyxZQUFvQyxFQUFFLEVBQWlCLEVBQUUsQ0FBQyxDQUFDO0lBQzdFLFNBQVMsRUFBRSxDQUFDO0lBQ1osV0FBVyxFQUFFLENBQUM7SUFDZCxpQkFBaUIsRUFBRSxDQUFDO0lBQ3BCLG9C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RSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUM7b0JBQ25DLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUM7b0JBQ3BDLEtBQUssRUFBRTt3QkFDTCxZQUFZLEVBQUUsSUFBSTt3QkFDbEIsYUFBYSxFQUFFLElBQUk7cUJBQ3BCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDLENBQUE7WUFFSCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFHLENBQUMsQ0FBQTtZQUV6QyxTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO1FBQ3pHLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9jayB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB0eXBlIHsgVXNhZ2VQbGFuSW5mbyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmlsbGluZy90eXBlJ1xuaW1wb3J0IHR5cGUgeyBBcHBDb250ZXh0VmFsdWUgfSBmcm9tICdAL2NvbnRleHQvYXBwLWNvbnRleHQnXG5pbXBvcnQgdHlwZSB7IFByb3ZpZGVyQ29udGV4dFN0YXRlIH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgdHlwZSB7IElDdXJyZW50V29ya3NwYWNlLCBMYW5nR2VuaXVzVmVyc2lvblJlc3BvbnNlLCBVc2VyUHJvZmlsZVJlc3BvbnNlIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgUGxhbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmlsbGluZy90eXBlJ1xuaW1wb3J0IHsgbWFpbFRvU3VwcG9ydCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL3V0aWxzL3V0aWwnXG5pbXBvcnQgeyB1c2VBcHBDb250ZXh0IH0gZnJvbSAnQC9jb250ZXh0L2FwcC1jb250ZXh0J1xuaW1wb3J0IHsgYmFzZVByb3ZpZGVyQ29udGV4dFZhbHVlLCB1c2VQcm92aWRlckNvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCBBcHBzRnVsbCBmcm9tICcuL2luZGV4J1xuXG52aS5tb2NrKCdAL2NvbnRleHQvYXBwLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VBcHBDb250ZXh0OiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0JywgYXN5bmMgKGltcG9ydE9yaWdpbmFsKSA9PiB7XG4gIGNvbnN0IGFjdHVhbCA9IGF3YWl0IGltcG9ydE9yaWdpbmFsPHR5cGVvZiBpbXBvcnQoJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0Jyk+KClcbiAgcmV0dXJuIHtcbiAgICAuLi5hY3R1YWwsXG4gICAgdXNlUHJvdmlkZXJDb250ZXh0OiB2aS5mbigpLFxuICB9XG59KVxuXG52aS5tb2NrKCdAL2NvbnRleHQvbW9kYWwtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZU1vZGFsQ29udGV4dDogKCkgPT4gKHtcbiAgICBzZXRTaG93UHJpY2luZ01vZGFsOiB2aS5mbigpLFxuICB9KSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2hlYWRlci91dGlscy91dGlsJywgKCkgPT4gKHtcbiAgbWFpbFRvU3VwcG9ydDogdmkuZm4oKSxcbn0pKVxuXG5jb25zdCBidWlsZFVzYWdlID0gKG92ZXJyaWRlczogUGFydGlhbDxVc2FnZVBsYW5JbmZvPiA9IHt9KTogVXNhZ2VQbGFuSW5mbyA9PiAoe1xuICBidWlsZEFwcHM6IDAsXG4gIHRlYW1NZW1iZXJzOiAwLFxuICBhbm5vdGF0ZWRSZXNwb25zZTogMCxcbiAgZG9jdW1lbnRzVXBsb2FkUXVvdGE6IDAsXG4gIGFwaVJhdGVMaW1pdDogMCxcbiAgdHJpZ2dlckV2ZW50czogMCxcbiAgdmVjdG9yU3BhY2U6IDAsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGJ1aWxkUHJvdmlkZXJDb250ZXh0ID0gKG92ZXJyaWRlczogUGFydGlhbDxQcm92aWRlckNvbnRleHRTdGF0ZT4gPSB7fSk6IFByb3ZpZGVyQ29udGV4dFN0YXRlID0+ICh7XG4gIC4uLmJhc2VQcm92aWRlckNvbnRleHRWYWx1ZSxcbiAgcGxhbjoge1xuICAgIC4uLmJhc2VQcm92aWRlckNvbnRleHRWYWx1ZS5wbGFuLFxuICAgIHR5cGU6IFBsYW4uc2FuZGJveCxcbiAgICB1c2FnZTogYnVpbGRVc2FnZSh7IGJ1aWxkQXBwczogMiB9KSxcbiAgICB0b3RhbDogYnVpbGRVc2FnZSh7IGJ1aWxkQXBwczogMTAgfSksXG4gICAgcmVzZXQ6IHtcbiAgICAgIGFwaVJhdGVMaW1pdDogbnVsbCxcbiAgICAgIHRyaWdnZXJFdmVudHM6IG51bGwsXG4gICAgfSxcbiAgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgYnVpbGRBcHBDb250ZXh0ID0gKG92ZXJyaWRlczogUGFydGlhbDxBcHBDb250ZXh0VmFsdWU+ID0ge30pOiBBcHBDb250ZXh0VmFsdWUgPT4ge1xuICBjb25zdCB1c2VyUHJvZmlsZTogVXNlclByb2ZpbGVSZXNwb25zZSA9IHtcbiAgICBpZDogJ3VzZXItaWQnLFxuICAgIG5hbWU6ICdUZXN0IFVzZXInLFxuICAgIGVtYWlsOiAndXNlckBleGFtcGxlLmNvbScsXG4gICAgYXZhdGFyOiAnJyxcbiAgICBhdmF0YXJfdXJsOiAnJyxcbiAgICBpc19wYXNzd29yZF9zZXQ6IGZhbHNlLFxuICB9XG4gIGNvbnN0IGN1cnJlbnRXb3Jrc3BhY2U6IElDdXJyZW50V29ya3NwYWNlID0ge1xuICAgIGlkOiAnd29ya3NwYWNlLWlkJyxcbiAgICBuYW1lOiAnV29ya3NwYWNlJyxcbiAgICBwbGFuOiAnJyxcbiAgICBzdGF0dXM6ICcnLFxuICAgIGNyZWF0ZWRfYXQ6IDAsXG4gICAgcm9sZTogJ25vcm1hbCcsXG4gICAgcHJvdmlkZXJzOiBbXSxcbiAgICB0cmlhbF9jcmVkaXRzOiAyMDAsXG4gICAgdHJpYWxfY3JlZGl0c191c2VkOiAwLFxuICAgIG5leHRfY3JlZGl0X3Jlc2V0X2RhdGU6IDAsXG4gIH1cbiAgY29uc3QgbGFuZ0dlbml1c1ZlcnNpb25JbmZvOiBMYW5nR2VuaXVzVmVyc2lvblJlc3BvbnNlID0ge1xuICAgIGN1cnJlbnRfZW52OiAnJyxcbiAgICBjdXJyZW50X3ZlcnNpb246ICcxLjAuMCcsXG4gICAgbGF0ZXN0X3ZlcnNpb246ICcnLFxuICAgIHJlbGVhc2VfZGF0ZTogJycsXG4gICAgcmVsZWFzZV9ub3RlczogJycsXG4gICAgdmVyc2lvbjogJycsXG4gICAgY2FuX2F1dG9fdXBkYXRlOiBmYWxzZSxcbiAgfVxuICBjb25zdCBiYXNlOiBPbWl0PEFwcENvbnRleHRWYWx1ZSwgJ3VzZVNlbGVjdG9yJz4gPSB7XG4gICAgdXNlclByb2ZpbGUsXG4gICAgY3VycmVudFdvcmtzcGFjZSxcbiAgICBpc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyOiBmYWxzZSxcbiAgICBpc0N1cnJlbnRXb3Jrc3BhY2VPd25lcjogZmFsc2UsXG4gICAgaXNDdXJyZW50V29ya3NwYWNlRWRpdG9yOiBmYWxzZSxcbiAgICBpc0N1cnJlbnRXb3Jrc3BhY2VEYXRhc2V0T3BlcmF0b3I6IGZhbHNlLFxuICAgIG11dGF0ZVVzZXJQcm9maWxlOiB2aS5mbigpLFxuICAgIG11dGF0ZUN1cnJlbnRXb3Jrc3BhY2U6IHZpLmZuKCksXG4gICAgbGFuZ0dlbml1c1ZlcnNpb25JbmZvLFxuICAgIGlzTG9hZGluZ0N1cnJlbnRXb3Jrc3BhY2U6IGZhbHNlLFxuICAgIGlzVmFsaWRhdGluZ0N1cnJlbnRXb3Jrc3BhY2U6IGZhbHNlLFxuICB9XG4gIGNvbnN0IHVzZVNlbGVjdG9yOiBBcHBDb250ZXh0VmFsdWVbJ3VzZVNlbGVjdG9yJ10gPSBzZWxlY3RvciA9PiBzZWxlY3Rvcih7IC4uLmJhc2UsIHVzZVNlbGVjdG9yIH0pXG4gIHJldHVybiB7XG4gICAgLi4uYmFzZSxcbiAgICB1c2VTZWxlY3RvcixcbiAgICAuLi5vdmVycmlkZXMsXG4gIH1cbn1cblxuZGVzY3JpYmUoJ0FwcHNGdWxsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICA7KHVzZVByb3ZpZGVyQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoYnVpbGRQcm92aWRlckNvbnRleHQoKSlcbiAgICA7KHVzZUFwcENvbnRleHQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKGJ1aWxkQXBwQ29udGV4dCgpKVxuICAgIDsobWFpbFRvU3VwcG9ydCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoJ21haWx0bzpzdXBwb3J0QGV4YW1wbGUuY29tJylcbiAgfSlcblxuICAvLyBSZW5kZXJpbmcgYmVoYXZpb3IgZm9yIG5vbi10ZWFtIHBsYW5zLlxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBzYW5kYm94IG1lc3NhZ2luZyBhbmQgdXBncmFkZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QXBwc0Z1bGwgbG9jPVwiYmlsbGluZ19kaWFsb2dcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy5hcHBzLmZ1bGxUaXAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdiaWxsaW5nLmFwcHMuZnVsbFRpcDFkZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcudXBncmFkZUJ0bi5lbmNvdXJhZ2VTaG9ydCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMi8xMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBQcm9wLWRyaXZlbiBiZWhhdmlvciBmb3IgdGVhbSBwbGFucyBhbmQgY29udGFjdCBDVEEuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0ZWFtIG1lc3NhZ2luZyBhbmQgY29udGFjdCBidXR0b24gZm9yIG5vbi1zYW5kYm94IHBsYW5zJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgOyh1c2VQcm92aWRlckNvbnRleHQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKGJ1aWxkUHJvdmlkZXJDb250ZXh0KHtcbiAgICAgICAgcGxhbjoge1xuICAgICAgICAgIC4uLmJhc2VQcm92aWRlckNvbnRleHRWYWx1ZS5wbGFuLFxuICAgICAgICAgIHR5cGU6IFBsYW4udGVhbSxcbiAgICAgICAgICB1c2FnZTogYnVpbGRVc2FnZSh7IGJ1aWxkQXBwczogOCB9KSxcbiAgICAgICAgICB0b3RhbDogYnVpbGRVc2FnZSh7IGJ1aWxkQXBwczogMTAgfSksXG4gICAgICAgICAgcmVzZXQ6IHtcbiAgICAgICAgICAgIGFwaVJhdGVMaW1pdDogbnVsbCxcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudHM6IG51bGwsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKVxuICAgICAgcmVuZGVyKDxBcHBzRnVsbCBsb2M9XCJiaWxsaW5nX2RpYWxvZ1wiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdiaWxsaW5nLmFwcHMuZnVsbFRpcDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcuYXBwcy5mdWxsVGlwMmRlcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdiaWxsaW5nLnVwZ3JhZGVCdG4uZW5jb3VyYWdlU2hvcnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJywgeyBuYW1lOiAnYmlsbGluZy5hcHBzLmNvbnRhY3RVcycgfSkpLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdtYWlsdG86c3VwcG9ydEBleGFtcGxlLmNvbScpXG4gICAgICBleHBlY3QobWFpbFRvU3VwcG9ydCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3VzZXJAZXhhbXBsZS5jb20nLCBQbGFuLnRlYW0sICcxLjAuMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHVwZ3JhZGUgYnV0dG9uIGZvciBwcm9mZXNzaW9uYWwgcGxhbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICA7KHVzZVByb3ZpZGVyQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoYnVpbGRQcm92aWRlckNvbnRleHQoe1xuICAgICAgICBwbGFuOiB7XG4gICAgICAgICAgLi4uYmFzZVByb3ZpZGVyQ29udGV4dFZhbHVlLnBsYW4sXG4gICAgICAgICAgdHlwZTogUGxhbi5wcm9mZXNzaW9uYWwsXG4gICAgICAgICAgdXNhZ2U6IGJ1aWxkVXNhZ2UoeyBidWlsZEFwcHM6IDQgfSksXG4gICAgICAgICAgdG90YWw6IGJ1aWxkVXNhZ2UoeyBidWlsZEFwcHM6IDEwIH0pLFxuICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICBhcGlSYXRlTGltaXQ6IG51bGwsXG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnRzOiBudWxsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFwcHNGdWxsIGxvYz1cImJpbGxpbmdfZGlhbG9nXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcuYXBwcy5mdWxsVGlwMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy51cGdyYWRlQnRuLmVuY291cmFnZVNob3J0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2JpbGxpbmcuYXBwcy5jb250YWN0VXMnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29udGFjdCBidXR0b24gZm9yIGVudGVycHJpc2UgcGxhbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICA7KHVzZVByb3ZpZGVyQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoYnVpbGRQcm92aWRlckNvbnRleHQoe1xuICAgICAgICBwbGFuOiB7XG4gICAgICAgICAgLi4uYmFzZVByb3ZpZGVyQ29udGV4dFZhbHVlLnBsYW4sXG4gICAgICAgICAgdHlwZTogUGxhbi5lbnRlcnByaXNlLFxuICAgICAgICAgIHVzYWdlOiBidWlsZFVzYWdlKHsgYnVpbGRBcHBzOiA5IH0pLFxuICAgICAgICAgIHRvdGFsOiBidWlsZFVzYWdlKHsgYnVpbGRBcHBzOiAxMCB9KSxcbiAgICAgICAgICByZXNldDoge1xuICAgICAgICAgICAgYXBpUmF0ZUxpbWl0OiBudWxsLFxuICAgICAgICAgICAgdHJpZ2dlckV2ZW50czogbnVsbCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSkpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBcHBzRnVsbCBsb2M9XCJiaWxsaW5nX2RpYWxvZ1wiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdiaWxsaW5nLmFwcHMuZnVsbFRpcDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYmlsbGluZy51cGdyYWRlQnRuLmVuY291cmFnZVNob3J0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnbGluaycsIHsgbmFtZTogJ2JpbGxpbmcuYXBwcy5jb250YWN0VXMnIH0pKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnbWFpbHRvOnN1cHBvcnRAZXhhbXBsZS5jb20nKVxuICAgICAgZXhwZWN0KG1haWxUb1N1cHBvcnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd1c2VyQGV4YW1wbGUuY29tJywgUGxhbi5lbnRlcnByaXNlLCAnMS4wLjAnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRWRnZSBjYXNlcyBmb3IgcHJvZ3Jlc3MgY29sb3IgdGhyZXNob2xkcy5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1c2UgdGhlIHN1Y2Nlc3MgY29sb3Igd2hlbiB1c2FnZSBpcyBiZWxvdyA1MCUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICA7KHVzZVByb3ZpZGVyQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoYnVpbGRQcm92aWRlckNvbnRleHQoe1xuICAgICAgICBwbGFuOiB7XG4gICAgICAgICAgLi4uYmFzZVByb3ZpZGVyQ29udGV4dFZhbHVlLnBsYW4sXG4gICAgICAgICAgdHlwZTogUGxhbi5zYW5kYm94LFxuICAgICAgICAgIHVzYWdlOiBidWlsZFVzYWdlKHsgYnVpbGRBcHBzOiAyIH0pLFxuICAgICAgICAgIHRvdGFsOiBidWlsZFVzYWdlKHsgYnVpbGRBcHBzOiA1IH0pLFxuICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICBhcGlSYXRlTGltaXQ6IG51bGwsXG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnRzOiBudWxsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFwcHNGdWxsIGxvYz1cImJpbGxpbmdfZGlhbG9nXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYmlsbGluZy1wcm9ncmVzcy1iYXInKSkudG9IYXZlQ2xhc3MoJ2JnLWNvbXBvbmVudHMtcHJvZ3Jlc3MtYmFyLXByb2dyZXNzLXNvbGlkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgdGhlIHdhcm5pbmcgY29sb3Igd2hlbiB1c2FnZSBpcyBiZXR3ZWVuIDUwJSBhbmQgODAlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgOyh1c2VQcm92aWRlckNvbnRleHQgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKGJ1aWxkUHJvdmlkZXJDb250ZXh0KHtcbiAgICAgICAgcGxhbjoge1xuICAgICAgICAgIC4uLmJhc2VQcm92aWRlckNvbnRleHRWYWx1ZS5wbGFuLFxuICAgICAgICAgIHR5cGU6IFBsYW4uc2FuZGJveCxcbiAgICAgICAgICB1c2FnZTogYnVpbGRVc2FnZSh7IGJ1aWxkQXBwczogNiB9KSxcbiAgICAgICAgICB0b3RhbDogYnVpbGRVc2FnZSh7IGJ1aWxkQXBwczogMTAgfSksXG4gICAgICAgICAgcmVzZXQ6IHtcbiAgICAgICAgICAgIGFwaVJhdGVMaW1pdDogbnVsbCxcbiAgICAgICAgICAgIHRyaWdnZXJFdmVudHM6IG51bGwsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QXBwc0Z1bGwgbG9jPVwiYmlsbGluZ19kaWFsb2dcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdiaWxsaW5nLXByb2dyZXNzLWJhcicpKS50b0hhdmVDbGFzcygnYmctY29tcG9uZW50cy1wcm9ncmVzcy13YXJuaW5nLXByb2dyZXNzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgdGhlIGVycm9yIGNvbG9yIHdoZW4gdXNhZ2UgaXMgODAlIG9yIGhpZ2hlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIDsodXNlUHJvdmlkZXJDb250ZXh0IGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZShidWlsZFByb3ZpZGVyQ29udGV4dCh7XG4gICAgICAgIHBsYW46IHtcbiAgICAgICAgICAuLi5iYXNlUHJvdmlkZXJDb250ZXh0VmFsdWUucGxhbixcbiAgICAgICAgICB0eXBlOiBQbGFuLnNhbmRib3gsXG4gICAgICAgICAgdXNhZ2U6IGJ1aWxkVXNhZ2UoeyBidWlsZEFwcHM6IDggfSksXG4gICAgICAgICAgdG90YWw6IGJ1aWxkVXNhZ2UoeyBidWlsZEFwcHM6IDEwIH0pLFxuICAgICAgICAgIHJlc2V0OiB7XG4gICAgICAgICAgICBhcGlSYXRlTGltaXQ6IG51bGwsXG4gICAgICAgICAgICB0cmlnZ2VyRXZlbnRzOiBudWxsLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFwcHNGdWxsIGxvYz1cImJpbGxpbmdfZGlhbG9nXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYmlsbGluZy1wcm9ncmVzcy1iYXInKSkudG9IYXZlQ2xhc3MoJ2JnLWNvbXBvbmVudHMtcHJvZ3Jlc3MtZXJyb3ItcHJvZ3Jlc3MnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19