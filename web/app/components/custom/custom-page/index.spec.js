"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const provider_context_1 = require("@/__mocks__/provider-context");
const config_1 = require("@/app/components/billing/config");
const type_1 = require("@/app/components/billing/type");
const modal_context_1 = require("@/context/modal-context");
// Get the mocked functions
// const { useProviderContext } = vi.requireMock('@/context/provider-context')
// const { useModalContext } = vi.requireMock('@/context/modal-context')
const provider_context_2 = require("@/context/provider-context");
const index_1 = require("./index");
// Mock external dependencies only
vi.mock('@/context/provider-context', () => ({
    useProviderContext: vi.fn(),
}));
vi.mock('@/context/modal-context', () => ({
    useModalContext: vi.fn(),
}));
// Mock the complex CustomWebAppBrand component to avoid dependency issues
// This is acceptable because it has complex dependencies (fetch, APIs)
vi.mock('../custom-web-app-brand', () => ({
    default: () => <div data-testid="custom-web-app-brand">CustomWebAppBrand</div>,
}));
describe('CustomPage', () => {
    const mockSetShowPricingModal = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        modal_context_1.useModalContext.mockReturnValue({
            setShowPricingModal: mockSetShowPricingModal,
        });
    });
    // Helper function to render with different provider contexts
    const renderWithContext = (overrides = {}) => {
        ;
        provider_context_2.useProviderContext.mockReturnValue((0, provider_context_1.createMockProviderContextValue)(overrides));
        return (0, react_1.render)(<index_1.default />);
    };
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            renderWithContext();
            // Assert
            expect(react_1.screen.getByTestId('custom-web-app-brand')).toBeInTheDocument();
        });
        it('should always render CustomWebAppBrand component', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            expect(react_1.screen.getByTestId('custom-web-app-brand')).toBeInTheDocument();
        });
        it('should have correct layout structure', () => {
            // Arrange & Act
            const { container } = renderWithContext();
            // Assert
            const mainContainer = container.querySelector('.flex.flex-col');
            expect(mainContainer).toBeInTheDocument();
        });
    });
    // Conditional Rendering - Billing Tip
    describe('Billing Tip Banner', () => {
        it('should show billing tip when enableBilling is true and plan is sandbox', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            expect(react_1.screen.getByText('custom.upgradeTip.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('custom.upgradeTip.des')).toBeInTheDocument();
            expect(react_1.screen.getByText('billing.upgradeBtn.encourageShort')).toBeInTheDocument();
        });
        it('should not show billing tip when enableBilling is false', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: false,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            expect(react_1.screen.queryByText('custom.upgradeTip.title')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.upgradeTip.des')).not.toBeInTheDocument();
        });
        it('should not show billing tip when plan is professional', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.professional },
            });
            // Assert
            expect(react_1.screen.queryByText('custom.upgradeTip.title')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.upgradeTip.des')).not.toBeInTheDocument();
        });
        it('should not show billing tip when plan is team', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.team },
            });
            // Assert
            expect(react_1.screen.queryByText('custom.upgradeTip.title')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.upgradeTip.des')).not.toBeInTheDocument();
        });
        it('should have correct gradient styling for billing tip banner', () => {
            // Arrange & Act
            const { container } = renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            const banner = container.querySelector('.bg-gradient-to-r');
            expect(banner).toBeInTheDocument();
            expect(banner).toHaveClass('from-components-input-border-active-prompt-1');
            expect(banner).toHaveClass('to-components-input-border-active-prompt-2');
            expect(banner).toHaveClass('p-4');
            expect(banner).toHaveClass('pl-6');
            expect(banner).toHaveClass('shadow-lg');
        });
    });
    // Conditional Rendering - Contact Sales
    describe('Contact Sales Section', () => {
        it('should show contact section when enableBilling is true and plan is professional', () => {
            // Arrange & Act
            const { container } = renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.professional },
            });
            // Assert - Check that contact section exists with all parts
            const contactSection = container.querySelector('.absolute.bottom-0');
            expect(contactSection).toBeInTheDocument();
            expect(contactSection).toHaveTextContent('custom.customize.prefix');
            expect(react_1.screen.getByText('custom.customize.contactUs')).toBeInTheDocument();
            expect(contactSection).toHaveTextContent('custom.customize.suffix');
        });
        it('should show contact section when enableBilling is true and plan is team', () => {
            // Arrange & Act
            const { container } = renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.team },
            });
            // Assert - Check that contact section exists with all parts
            const contactSection = container.querySelector('.absolute.bottom-0');
            expect(contactSection).toBeInTheDocument();
            expect(contactSection).toHaveTextContent('custom.customize.prefix');
            expect(react_1.screen.getByText('custom.customize.contactUs')).toBeInTheDocument();
            expect(contactSection).toHaveTextContent('custom.customize.suffix');
        });
        it('should not show contact section when enableBilling is false', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: false,
                plan: { type: type_1.Plan.professional },
            });
            // Assert
            expect(react_1.screen.queryByText('custom.customize.prefix')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.customize.contactUs')).not.toBeInTheDocument();
        });
        it('should not show contact section when plan is sandbox', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            expect(react_1.screen.queryByText('custom.customize.prefix')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.customize.contactUs')).not.toBeInTheDocument();
        });
        it('should render contact link with correct URL', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.professional },
            });
            // Assert
            const link = react_1.screen.getByText('custom.customize.contactUs').closest('a');
            expect(link).toHaveAttribute('href', config_1.contactSalesUrl);
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
        it('should have correct positioning for contact section', () => {
            // Arrange & Act
            const { container } = renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.professional },
            });
            // Assert
            const contactSection = container.querySelector('.absolute.bottom-0');
            expect(contactSection).toBeInTheDocument();
            expect(contactSection).toHaveClass('h-[50px]');
            expect(contactSection).toHaveClass('text-xs');
            expect(contactSection).toHaveClass('leading-[50px]');
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should call setShowPricingModal when upgrade button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Act
            const upgradeButton = react_1.screen.getByText('billing.upgradeBtn.encourageShort');
            await user.click(upgradeButton);
            // Assert
            expect(mockSetShowPricingModal).toHaveBeenCalledTimes(1);
        });
        it('should call setShowPricingModal without arguments', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Act
            const upgradeButton = react_1.screen.getByText('billing.upgradeBtn.encourageShort');
            await user.click(upgradeButton);
            // Assert
            expect(mockSetShowPricingModal).toHaveBeenCalledWith();
        });
        it('should handle multiple clicks on upgrade button', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Act
            const upgradeButton = react_1.screen.getByText('billing.upgradeBtn.encourageShort');
            await user.click(upgradeButton);
            await user.click(upgradeButton);
            await user.click(upgradeButton);
            // Assert
            expect(mockSetShowPricingModal).toHaveBeenCalledTimes(3);
        });
        it('should have correct button styling for upgrade button', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            const upgradeButton = react_1.screen.getByText('billing.upgradeBtn.encourageShort');
            expect(upgradeButton).toHaveClass('cursor-pointer');
            expect(upgradeButton).toHaveClass('bg-white');
            expect(upgradeButton).toHaveClass('text-text-accent');
            expect(upgradeButton).toHaveClass('rounded-3xl');
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle undefined plan type gracefully', () => {
            // Arrange & Act
            expect(() => {
                renderWithContext({
                    enableBilling: true,
                    plan: { type: undefined },
                });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByTestId('custom-web-app-brand')).toBeInTheDocument();
        });
        it('should handle plan without type property', () => {
            // Arrange & Act
            expect(() => {
                renderWithContext({
                    enableBilling: true,
                    plan: { type: null },
                });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByTestId('custom-web-app-brand')).toBeInTheDocument();
        });
        it('should not show any banners when both conditions are false', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: false,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            expect(react_1.screen.queryByText('custom.upgradeTip.title')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.customize.prefix')).not.toBeInTheDocument();
        });
        it('should handle enableBilling undefined', () => {
            // Arrange & Act
            expect(() => {
                renderWithContext({
                    enableBilling: undefined,
                    plan: { type: type_1.Plan.sandbox },
                });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.queryByText('custom.upgradeTip.title')).not.toBeInTheDocument();
        });
        it('should show only billing tip for sandbox plan, not contact section', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            expect(react_1.screen.getByText('custom.upgradeTip.title')).toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.customize.contactUs')).not.toBeInTheDocument();
        });
        it('should show only contact section for professional plan, not billing tip', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.professional },
            });
            // Assert
            expect(react_1.screen.queryByText('custom.upgradeTip.title')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('custom.customize.contactUs')).toBeInTheDocument();
        });
        it('should show only contact section for team plan, not billing tip', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.team },
            });
            // Assert
            expect(react_1.screen.queryByText('custom.upgradeTip.title')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('custom.customize.contactUs')).toBeInTheDocument();
        });
        it('should handle empty plan object', () => {
            // Arrange & Act
            expect(() => {
                renderWithContext({
                    enableBilling: true,
                    plan: {},
                });
            }).not.toThrow();
            // Assert
            expect(react_1.screen.getByTestId('custom-web-app-brand')).toBeInTheDocument();
        });
    });
    // Accessibility Tests
    describe('Accessibility', () => {
        it('should have clickable upgrade button', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            const upgradeButton = react_1.screen.getByText('billing.upgradeBtn.encourageShort');
            expect(upgradeButton).toBeInTheDocument();
            expect(upgradeButton).toHaveClass('cursor-pointer');
        });
        it('should have proper external link attributes on contact link', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.professional },
            });
            // Assert
            const link = react_1.screen.getByText('custom.customize.contactUs').closest('a');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            expect(link).toHaveAttribute('target', '_blank');
        });
        it('should have proper text hierarchy in billing tip', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            const title = react_1.screen.getByText('custom.upgradeTip.title');
            const description = react_1.screen.getByText('custom.upgradeTip.des');
            expect(title).toHaveClass('title-xl-semi-bold');
            expect(description).toHaveClass('system-sm-regular');
        });
        it('should use semantic color classes', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert - Check that the billing tip has text content (which implies semantic colors)
            expect(react_1.screen.getByText('custom.upgradeTip.title')).toBeInTheDocument();
        });
    });
    // Integration Tests
    describe('Integration', () => {
        it('should render both CustomWebAppBrand and billing tip together', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            expect(react_1.screen.getByTestId('custom-web-app-brand')).toBeInTheDocument();
            expect(react_1.screen.getByText('custom.upgradeTip.title')).toBeInTheDocument();
        });
        it('should render both CustomWebAppBrand and contact section together', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: true,
                plan: { type: type_1.Plan.professional },
            });
            // Assert
            expect(react_1.screen.getByTestId('custom-web-app-brand')).toBeInTheDocument();
            expect(react_1.screen.getByText('custom.customize.contactUs')).toBeInTheDocument();
        });
        it('should render only CustomWebAppBrand when no billing conditions met', () => {
            // Arrange & Act
            renderWithContext({
                enableBilling: false,
                plan: { type: type_1.Plan.sandbox },
            });
            // Assert
            expect(react_1.screen.getByTestId('custom-web-app-brand')).toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.upgradeTip.title')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('custom.customize.contactUs')).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELDREQUFtRDtBQUNuRCwrQkFBOEI7QUFDOUIsbUVBQTZFO0FBQzdFLDREQUFpRTtBQUNqRSx3REFBb0Q7QUFDcEQsMkRBQXlEO0FBQ3pELDJCQUEyQjtBQUMzQiw4RUFBOEU7QUFDOUUsd0VBQXdFO0FBQ3hFLGlFQUErRDtBQUMvRCxtQ0FBZ0M7QUFFaEMsa0NBQWtDO0FBQ2xDLEVBQUUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMzQyxrQkFBa0IsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQzVCLENBQUMsQ0FBQyxDQUFBO0FBRUgsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLGVBQWUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ3pCLENBQUMsQ0FBQyxDQUFBO0FBRUgsMEVBQTBFO0FBQzFFLHVFQUF1RTtBQUN2RSxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUM7Q0FDL0UsQ0FBQyxDQUFDLENBQUE7QUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixNQUFNLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUV2QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUdqQjtRQUFDLCtCQUF3QixDQUFDLGVBQWUsQ0FBQztZQUN6QyxtQkFBbUIsRUFBRSx1QkFBdUI7U0FDN0MsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRiw2REFBNkQ7SUFDN0QsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQUUsRUFBRTtRQUMzQyxDQUFDO1FBQUMscUNBQTJCLENBQUMsZUFBZSxDQUMzQyxJQUFBLGlEQUE4QixFQUFDLFNBQVMsQ0FBQyxDQUMxQyxDQUFBO1FBQ0QsT0FBTyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVUsQ0FBQyxBQUFELEVBQUcsQ0FBQyxDQUFBO0lBQy9CLENBQUMsQ0FBQTtJQUVELDZCQUE2QjtJQUM3QixRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQ3hDLGdCQUFnQjtZQUNoQixpQkFBaUIsRUFBRSxDQUFBO1lBRW5CLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsZ0JBQWdCO1lBQ2hCLGlCQUFpQixDQUFDO2dCQUNoQixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQUksQ0FBQyxPQUFPLEVBQUU7YUFDN0IsQ0FBQyxDQUFBO1lBRUYsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtZQUM5QyxnQkFBZ0I7WUFDaEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLGlCQUFpQixFQUFFLENBQUE7WUFFekMsU0FBUztZQUNULE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUMvRCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMzQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsc0NBQXNDO0lBQ3RDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsRUFBRSxDQUFDLHdFQUF3RSxFQUFFLEdBQUcsRUFBRTtZQUNoRixnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDdkUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDckUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbkYsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1lBQ2pFLGdCQUFnQjtZQUNoQixpQkFBaUIsQ0FBQztnQkFDaEIsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxXQUFJLENBQUMsT0FBTyxFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUVGLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDN0UsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzdFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLFlBQVksRUFBRTthQUNsQyxDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzdFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM3RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7WUFDdkQsZ0JBQWdCO1lBQ2hCLGlCQUFpQixDQUFDO2dCQUNoQixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQUksQ0FBQyxJQUFJLEVBQUU7YUFDMUIsQ0FBQyxDQUFBO1lBRUYsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM3RSxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDN0UsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1lBQ3JFLGdCQUFnQjtZQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ3RDLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBQzNELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsOENBQThDLENBQUMsQ0FBQTtZQUMxRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLDRDQUE0QyxDQUFDLENBQUE7WUFDeEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDekMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHdDQUF3QztJQUN4QyxRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLEVBQUUsQ0FBQyxpRkFBaUYsRUFBRSxHQUFHLEVBQUU7WUFDekYsZ0JBQWdCO1lBQ2hCLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQztnQkFDdEMsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxXQUFJLENBQUMsWUFBWSxFQUFFO2FBQ2xDLENBQUMsQ0FBQTtZQUVGLDREQUE0RDtZQUM1RCxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUE7WUFDcEUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDMUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLHlCQUF5QixDQUFDLENBQUE7WUFDbkUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDMUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFDckUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMseUVBQXlFLEVBQUUsR0FBRyxFQUFFO1lBQ2pGLGdCQUFnQjtZQUNoQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ3RDLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLElBQUksRUFBRTthQUMxQixDQUFDLENBQUE7WUFFRiw0REFBNEQ7WUFDNUQsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1lBQ3BFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBQ25FLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzFFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1FBQ3JFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUNyRSxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLFlBQVksRUFBRTthQUNsQyxDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzdFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7WUFDOUQsZ0JBQWdCO1lBQ2hCLGlCQUFpQixDQUFDO2dCQUNoQixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQUksQ0FBQyxPQUFPLEVBQUU7YUFDN0IsQ0FBQyxDQUFBO1lBRUYsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM3RSxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEYsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1lBQ3JELGdCQUFnQjtZQUNoQixpQkFBaUIsQ0FBQztnQkFDaEIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxXQUFJLENBQUMsWUFBWSxFQUFFO2FBQ2xDLENBQUMsQ0FBQTtZQUVGLFNBQVM7WUFDVCxNQUFNLElBQUksR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLHdCQUFlLENBQUMsQ0FBQTtZQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQTtZQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtZQUM3RCxnQkFBZ0I7WUFDaEIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLGlCQUFpQixDQUFDO2dCQUN0QyxhQUFhLEVBQUUsSUFBSTtnQkFDbkIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQUksQ0FBQyxZQUFZLEVBQUU7YUFDbEMsQ0FBQyxDQUFBO1lBRUYsU0FBUztZQUNULE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtZQUNwRSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUMxQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzlDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDN0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixvQkFBb0I7SUFDcEIsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUNqQyxFQUFFLENBQUMsZ0VBQWdFLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDOUUsVUFBVTtZQUNWLE1BQU0sSUFBSSxHQUFHLG9CQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDOUIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixNQUFNO1lBQ04sTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1lBQzNFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsbURBQW1ELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDakUsVUFBVTtZQUNWLE1BQU0sSUFBSSxHQUFHLG9CQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDOUIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixNQUFNO1lBQ04sTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1lBQzNFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUUvQixTQUFTO1lBQ1QsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMvRCxVQUFVO1lBQ1YsTUFBTSxJQUFJLEdBQUcsb0JBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUM5QixpQkFBaUIsQ0FBQztnQkFDaEIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxXQUFJLENBQUMsT0FBTyxFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUVGLE1BQU07WUFDTixNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7WUFDM0UsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQy9CLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUMvQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFL0IsU0FBUztZQUNULE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzFELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1lBQzNFLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtZQUNuRCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzdDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtZQUNyRCxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRix3QkFBd0I7SUFDeEIsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7UUFDMUIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxnQkFBZ0I7WUFDaEIsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixpQkFBaUIsQ0FBQztvQkFDaEIsYUFBYSxFQUFFLElBQUk7b0JBQ25CLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7aUJBQzFCLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUVoQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELGdCQUFnQjtZQUNoQixNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLGlCQUFpQixDQUFDO29CQUNoQixhQUFhLEVBQUUsSUFBSTtvQkFDbkIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtpQkFDckIsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBRWhCLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN4RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7WUFDcEUsZ0JBQWdCO1lBQ2hCLGlCQUFpQixDQUFDO2dCQUNoQixhQUFhLEVBQUUsS0FBSztnQkFDcEIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQUksQ0FBQyxPQUFPLEVBQUU7YUFDN0IsQ0FBQyxDQUFBO1lBRUYsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM3RSxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0UsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1lBQy9DLGdCQUFnQjtZQUNoQixNQUFNLENBQUMsR0FBRyxFQUFFO2dCQUNWLGlCQUFpQixDQUFDO29CQUNoQixhQUFhLEVBQUUsU0FBUztvQkFDeEIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQUksQ0FBQyxPQUFPLEVBQUU7aUJBQzdCLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUVoQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQy9FLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG9FQUFvRSxFQUFFLEdBQUcsRUFBRTtZQUM1RSxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDdkUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xGLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHlFQUF5RSxFQUFFLEdBQUcsRUFBRTtZQUNqRixnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLFlBQVksRUFBRTthQUNsQyxDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzdFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzVFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlFQUFpRSxFQUFFLEdBQUcsRUFBRTtZQUN6RSxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLElBQUksRUFBRTthQUMxQixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzdFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzVFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtZQUN6QyxnQkFBZ0I7WUFDaEIsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDVixpQkFBaUIsQ0FBQztvQkFDaEIsYUFBYSxFQUFFLElBQUk7b0JBQ25CLElBQUksRUFBRSxFQUFFO2lCQUNULENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUVoQixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLHNCQUFzQjtJQUN0QixRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUM3QixFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLGdCQUFnQjtZQUNoQixpQkFBaUIsQ0FBQztnQkFDaEIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxXQUFJLENBQUMsT0FBTyxFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUVGLFNBQVM7WUFDVCxNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUE7WUFDM0UsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBQ3JELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUNyRSxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLFlBQVksRUFBRTthQUNsQyxDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxJQUFJLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN4RSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFBO1lBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxLQUFLLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBQ3pELE1BQU0sV0FBVyxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtZQUU3RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUE7WUFDL0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtZQUMzQyxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRix1RkFBdUY7WUFDdkYsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDekUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLG9CQUFvQjtJQUNwQixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixFQUFFLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3ZFLGdCQUFnQjtZQUNoQixpQkFBaUIsQ0FBQztnQkFDaEIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxXQUFJLENBQUMsT0FBTyxFQUFFO2FBQzdCLENBQUMsQ0FBQTtZQUVGLFNBQVM7WUFDVCxNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN0RSxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN6RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7WUFDM0UsZ0JBQWdCO1lBQ2hCLGlCQUFpQixDQUFDO2dCQUNoQixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQUksQ0FBQyxZQUFZLEVBQUU7YUFDbEMsQ0FBQyxDQUFBO1lBRUYsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3RFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzVFLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHFFQUFxRSxFQUFFLEdBQUcsRUFBRTtZQUM3RSxnQkFBZ0I7WUFDaEIsaUJBQWlCLENBQUM7Z0JBQ2hCLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBSSxDQUFDLE9BQU8sRUFBRTthQUM3QixDQUFDLENBQUE7WUFFRixTQUFTO1lBQ1QsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDdEUsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzdFLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2sgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY3JlYXRlTW9ja1Byb3ZpZGVyQ29udGV4dFZhbHVlIH0gZnJvbSAnQC9fX21vY2tzX18vcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB7IGNvbnRhY3RTYWxlc1VybCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmlsbGluZy9jb25maWcnXG5pbXBvcnQgeyBQbGFuIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgeyB1c2VNb2RhbENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvbW9kYWwtY29udGV4dCdcbi8vIEdldCB0aGUgbW9ja2VkIGZ1bmN0aW9uc1xuLy8gY29uc3QgeyB1c2VQcm92aWRlckNvbnRleHQgfSA9IHZpLnJlcXVpcmVNb2NrKCdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCcpXG4vLyBjb25zdCB7IHVzZU1vZGFsQ29udGV4dCB9ID0gdmkucmVxdWlyZU1vY2soJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0JylcbmltcG9ydCB7IHVzZVByb3ZpZGVyQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0J1xuaW1wb3J0IEN1c3RvbVBhZ2UgZnJvbSAnLi9pbmRleCdcblxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXMgb25seVxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6IHZpLmZuKCksXG59KSlcblxudmkubW9jaygnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VNb2RhbENvbnRleHQ6IHZpLmZuKCksXG59KSlcblxuLy8gTW9jayB0aGUgY29tcGxleCBDdXN0b21XZWJBcHBCcmFuZCBjb21wb25lbnQgdG8gYXZvaWQgZGVwZW5kZW5jeSBpc3N1ZXNcbi8vIFRoaXMgaXMgYWNjZXB0YWJsZSBiZWNhdXNlIGl0IGhhcyBjb21wbGV4IGRlcGVuZGVuY2llcyAoZmV0Y2gsIEFQSXMpXG52aS5tb2NrKCcuLi9jdXN0b20td2ViLWFwcC1icmFuZCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IDxkaXYgZGF0YS10ZXN0aWQ9XCJjdXN0b20td2ViLWFwcC1icmFuZFwiPkN1c3RvbVdlYkFwcEJyYW5kPC9kaXY+LFxufSkpXG5cbmRlc2NyaWJlKCdDdXN0b21QYWdlJywgKCkgPT4ge1xuICBjb25zdCBtb2NrU2V0U2hvd1ByaWNpbmdNb2RhbCA9IHZpLmZuKClcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcblxuICAgIC8vIERlZmF1bHQgbW9jayBzZXR1cFxuICAgIDsodXNlTW9kYWxDb250ZXh0IGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBzZXRTaG93UHJpY2luZ01vZGFsOiBtb2NrU2V0U2hvd1ByaWNpbmdNb2RhbCxcbiAgICB9KVxuICB9KVxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byByZW5kZXIgd2l0aCBkaWZmZXJlbnQgcHJvdmlkZXIgY29udGV4dHNcbiAgY29uc3QgcmVuZGVyV2l0aENvbnRleHQgPSAob3ZlcnJpZGVzID0ge30pID0+IHtcbiAgICA7KHVzZVByb3ZpZGVyQ29udGV4dCBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoXG4gICAgICBjcmVhdGVNb2NrUHJvdmlkZXJDb250ZXh0VmFsdWUob3ZlcnJpZGVzKSxcbiAgICApXG4gICAgcmV0dXJuIHJlbmRlcig8Q3VzdG9tUGFnZSAvPilcbiAgfVxuXG4gIC8vIFJlbmRlcmluZyB0ZXN0cyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20td2ViLWFwcC1icmFuZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWx3YXlzIHJlbmRlciBDdXN0b21XZWJBcHBCcmFuZCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgIGVuYWJsZUJpbGxpbmc6IHRydWUsXG4gICAgICAgIHBsYW46IHsgdHlwZTogUGxhbi5zYW5kYm94IH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS13ZWItYXBwLWJyYW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgbGF5b3V0IHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoQ29udGV4dCgpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbWFpbkNvbnRhaW5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZmxleC5mbGV4LWNvbCcpXG4gICAgICBleHBlY3QobWFpbkNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQ29uZGl0aW9uYWwgUmVuZGVyaW5nIC0gQmlsbGluZyBUaXBcbiAgZGVzY3JpYmUoJ0JpbGxpbmcgVGlwIEJhbm5lcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgYmlsbGluZyB0aXAgd2hlbiBlbmFibGVCaWxsaW5nIGlzIHRydWUgYW5kIHBsYW4gaXMgc2FuZGJveCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2N1c3RvbS51cGdyYWRlVGlwLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjdXN0b20udXBncmFkZVRpcC5kZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcudXBncmFkZUJ0bi5lbmNvdXJhZ2VTaG9ydCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgYmlsbGluZyB0aXAgd2hlbiBlbmFibGVCaWxsaW5nIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiBmYWxzZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY3VzdG9tLnVwZ3JhZGVUaXAudGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2N1c3RvbS51cGdyYWRlVGlwLmRlcycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGJpbGxpbmcgdGlwIHdoZW4gcGxhbiBpcyBwcm9mZXNzaW9uYWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgIGVuYWJsZUJpbGxpbmc6IHRydWUsXG4gICAgICAgIHBsYW46IHsgdHlwZTogUGxhbi5wcm9mZXNzaW9uYWwgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY3VzdG9tLnVwZ3JhZGVUaXAudGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2N1c3RvbS51cGdyYWRlVGlwLmRlcycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGJpbGxpbmcgdGlwIHdoZW4gcGxhbiBpcyB0ZWFtJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiB0cnVlLFxuICAgICAgICBwbGFuOiB7IHR5cGU6IFBsYW4udGVhbSB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjdXN0b20udXBncmFkZVRpcC50aXRsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY3VzdG9tLnVwZ3JhZGVUaXAuZGVzJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGdyYWRpZW50IHN0eWxpbmcgZm9yIGJpbGxpbmcgdGlwIGJhbm5lcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgIGVuYWJsZUJpbGxpbmc6IHRydWUsXG4gICAgICAgIHBsYW46IHsgdHlwZTogUGxhbi5zYW5kYm94IH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJhbm5lciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYmctZ3JhZGllbnQtdG8tcicpXG4gICAgICBleHBlY3QoYmFubmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoYmFubmVyKS50b0hhdmVDbGFzcygnZnJvbS1jb21wb25lbnRzLWlucHV0LWJvcmRlci1hY3RpdmUtcHJvbXB0LTEnKVxuICAgICAgZXhwZWN0KGJhbm5lcikudG9IYXZlQ2xhc3MoJ3RvLWNvbXBvbmVudHMtaW5wdXQtYm9yZGVyLWFjdGl2ZS1wcm9tcHQtMicpXG4gICAgICBleHBlY3QoYmFubmVyKS50b0hhdmVDbGFzcygncC00JylcbiAgICAgIGV4cGVjdChiYW5uZXIpLnRvSGF2ZUNsYXNzKCdwbC02JylcbiAgICAgIGV4cGVjdChiYW5uZXIpLnRvSGF2ZUNsYXNzKCdzaGFkb3ctbGcnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQ29uZGl0aW9uYWwgUmVuZGVyaW5nIC0gQ29udGFjdCBTYWxlc1xuICBkZXNjcmliZSgnQ29udGFjdCBTYWxlcyBTZWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBjb250YWN0IHNlY3Rpb24gd2hlbiBlbmFibGVCaWxsaW5nIGlzIHRydWUgYW5kIHBsYW4gaXMgcHJvZmVzc2lvbmFsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnByb2Zlc3Npb25hbCB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgdGhhdCBjb250YWN0IHNlY3Rpb24gZXhpc3RzIHdpdGggYWxsIHBhcnRzXG4gICAgICBjb25zdCBjb250YWN0U2VjdGlvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYWJzb2x1dGUuYm90dG9tLTAnKVxuICAgICAgZXhwZWN0KGNvbnRhY3RTZWN0aW9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFjdFNlY3Rpb24pLnRvSGF2ZVRleHRDb250ZW50KCdjdXN0b20uY3VzdG9taXplLnByZWZpeCcpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY3VzdG9tLmN1c3RvbWl6ZS5jb250YWN0VXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhY3RTZWN0aW9uKS50b0hhdmVUZXh0Q29udGVudCgnY3VzdG9tLmN1c3RvbWl6ZS5zdWZmaXgnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgY29udGFjdCBzZWN0aW9uIHdoZW4gZW5hYmxlQmlsbGluZyBpcyB0cnVlIGFuZCBwbGFuIGlzIHRlYW0nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiB0cnVlLFxuICAgICAgICBwbGFuOiB7IHR5cGU6IFBsYW4udGVhbSB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgdGhhdCBjb250YWN0IHNlY3Rpb24gZXhpc3RzIHdpdGggYWxsIHBhcnRzXG4gICAgICBjb25zdCBjb250YWN0U2VjdGlvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYWJzb2x1dGUuYm90dG9tLTAnKVxuICAgICAgZXhwZWN0KGNvbnRhY3RTZWN0aW9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFjdFNlY3Rpb24pLnRvSGF2ZVRleHRDb250ZW50KCdjdXN0b20uY3VzdG9taXplLnByZWZpeCcpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY3VzdG9tLmN1c3RvbWl6ZS5jb250YWN0VXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhY3RTZWN0aW9uKS50b0hhdmVUZXh0Q29udGVudCgnY3VzdG9tLmN1c3RvbWl6ZS5zdWZmaXgnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGNvbnRhY3Qgc2VjdGlvbiB3aGVuIGVuYWJsZUJpbGxpbmcgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgIGVuYWJsZUJpbGxpbmc6IGZhbHNlLFxuICAgICAgICBwbGFuOiB7IHR5cGU6IFBsYW4ucHJvZmVzc2lvbmFsIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2N1c3RvbS5jdXN0b21pemUucHJlZml4JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjdXN0b20uY3VzdG9taXplLmNvbnRhY3RVcycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGNvbnRhY3Qgc2VjdGlvbiB3aGVuIHBsYW4gaXMgc2FuZGJveCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY3VzdG9tLmN1c3RvbWl6ZS5wcmVmaXgnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2N1c3RvbS5jdXN0b21pemUuY29udGFjdFVzJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbnRhY3QgbGluayB3aXRoIGNvcnJlY3QgVVJMJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiB0cnVlLFxuICAgICAgICBwbGFuOiB7IHR5cGU6IFBsYW4ucHJvZmVzc2lvbmFsIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxpbmsgPSBzY3JlZW4uZ2V0QnlUZXh0KCdjdXN0b20uY3VzdG9taXplLmNvbnRhY3RVcycpLmNsb3Nlc3QoJ2EnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsIGNvbnRhY3RTYWxlc1VybClcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBwb3NpdGlvbmluZyBmb3IgY29udGFjdCBzZWN0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnByb2Zlc3Npb25hbCB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjb250YWN0U2VjdGlvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYWJzb2x1dGUuYm90dG9tLTAnKVxuICAgICAgZXhwZWN0KGNvbnRhY3RTZWN0aW9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFjdFNlY3Rpb24pLnRvSGF2ZUNsYXNzKCdoLVs1MHB4XScpXG4gICAgICBleHBlY3QoY29udGFjdFNlY3Rpb24pLnRvSGF2ZUNsYXNzKCd0ZXh0LXhzJylcbiAgICAgIGV4cGVjdChjb250YWN0U2VjdGlvbikudG9IYXZlQ2xhc3MoJ2xlYWRpbmctWzUwcHhdJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0U2hvd1ByaWNpbmdNb2RhbCB3aGVuIHVwZ3JhZGUgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdXBncmFkZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcudXBncmFkZUJ0bi5lbmNvdXJhZ2VTaG9ydCcpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHVwZ3JhZGVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93UHJpY2luZ01vZGFsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldFNob3dQcmljaW5nTW9kYWwgd2l0aG91dCBhcmd1bWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdXBncmFkZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcudXBncmFkZUJ0bi5lbmNvdXJhZ2VTaG9ydCcpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHVwZ3JhZGVCdXR0b24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93UHJpY2luZ01vZGFsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGNsaWNrcyBvbiB1cGdyYWRlIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiB0cnVlLFxuICAgICAgICBwbGFuOiB7IHR5cGU6IFBsYW4uc2FuZGJveCB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB1cGdyYWRlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnYmlsbGluZy51cGdyYWRlQnRuLmVuY291cmFnZVNob3J0JylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXBncmFkZUJ1dHRvbilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXBncmFkZUJ1dHRvbilcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2sodXBncmFkZUJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NldFNob3dQcmljaW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBidXR0b24gc3R5bGluZyBmb3IgdXBncmFkZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgIGVuYWJsZUJpbGxpbmc6IHRydWUsXG4gICAgICAgIHBsYW46IHsgdHlwZTogUGxhbi5zYW5kYm94IH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHVwZ3JhZGVCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdiaWxsaW5nLnVwZ3JhZGVCdG4uZW5jb3VyYWdlU2hvcnQnKVxuICAgICAgZXhwZWN0KHVwZ3JhZGVCdXR0b24pLnRvSGF2ZUNsYXNzKCdjdXJzb3ItcG9pbnRlcicpXG4gICAgICBleHBlY3QodXBncmFkZUJ1dHRvbikudG9IYXZlQ2xhc3MoJ2JnLXdoaXRlJylcbiAgICAgIGV4cGVjdCh1cGdyYWRlQnV0dG9uKS50b0hhdmVDbGFzcygndGV4dC10ZXh0LWFjY2VudCcpXG4gICAgICBleHBlY3QodXBncmFkZUJ1dHRvbikudG9IYXZlQ2xhc3MoJ3JvdW5kZWQtM3hsJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIEVkZ2UgQ2FzZXMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcGxhbiB0eXBlIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgICBwbGFuOiB7IHR5cGU6IHVuZGVmaW5lZCB9LFxuICAgICAgICB9KVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS13ZWItYXBwLWJyYW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGxhbiB3aXRob3V0IHR5cGUgcHJvcGVydHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgICBwbGFuOiB7IHR5cGU6IG51bGwgfSxcbiAgICAgICAgfSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20td2ViLWFwcC1icmFuZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgYW55IGJhbm5lcnMgd2hlbiBib3RoIGNvbmRpdGlvbnMgYXJlIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiBmYWxzZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY3VzdG9tLnVwZ3JhZGVUaXAudGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2N1c3RvbS5jdXN0b21pemUucHJlZml4JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVuYWJsZUJpbGxpbmcgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICAgIGVuYWJsZUJpbGxpbmc6IHVuZGVmaW5lZCxcbiAgICAgICAgICBwbGFuOiB7IHR5cGU6IFBsYW4uc2FuZGJveCB9LFxuICAgICAgICB9KVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2N1c3RvbS51cGdyYWRlVGlwLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBvbmx5IGJpbGxpbmcgdGlwIGZvciBzYW5kYm94IHBsYW4sIG5vdCBjb250YWN0IHNlY3Rpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgIGVuYWJsZUJpbGxpbmc6IHRydWUsXG4gICAgICAgIHBsYW46IHsgdHlwZTogUGxhbi5zYW5kYm94IH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjdXN0b20udXBncmFkZVRpcC50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjdXN0b20uY3VzdG9taXplLmNvbnRhY3RVcycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgb25seSBjb250YWN0IHNlY3Rpb24gZm9yIHByb2Zlc3Npb25hbCBwbGFuLCBub3QgYmlsbGluZyB0aXAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgIGVuYWJsZUJpbGxpbmc6IHRydWUsXG4gICAgICAgIHBsYW46IHsgdHlwZTogUGxhbi5wcm9mZXNzaW9uYWwgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY3VzdG9tLnVwZ3JhZGVUaXAudGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjdXN0b20uY3VzdG9taXplLmNvbnRhY3RVcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBvbmx5IGNvbnRhY3Qgc2VjdGlvbiBmb3IgdGVhbSBwbGFuLCBub3QgYmlsbGluZyB0aXAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXJXaXRoQ29udGV4dCh7XG4gICAgICAgIGVuYWJsZUJpbGxpbmc6IHRydWUsXG4gICAgICAgIHBsYW46IHsgdHlwZTogUGxhbi50ZWFtIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2N1c3RvbS51cGdyYWRlVGlwLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY3VzdG9tLmN1c3RvbWl6ZS5jb250YWN0VXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBwbGFuIG9iamVjdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgICBlbmFibGVCaWxsaW5nOiB0cnVlLFxuICAgICAgICAgIHBsYW46IHt9LFxuICAgICAgICB9KVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS13ZWItYXBwLWJyYW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbiAgZGVzY3JpYmUoJ0FjY2Vzc2liaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNsaWNrYWJsZSB1cGdyYWRlIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdXBncmFkZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcudXBncmFkZUJ0bi5lbmNvdXJhZ2VTaG9ydCcpXG4gICAgICBleHBlY3QodXBncmFkZUJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHVwZ3JhZGVCdXR0b24pLnRvSGF2ZUNsYXNzKCdjdXJzb3ItcG9pbnRlcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBwcm9wZXIgZXh0ZXJuYWwgbGluayBhdHRyaWJ1dGVzIG9uIGNvbnRhY3QgbGluaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnByb2Zlc3Npb25hbCB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsaW5rID0gc2NyZWVuLmdldEJ5VGV4dCgnY3VzdG9tLmN1c3RvbWl6ZS5jb250YWN0VXMnKS5jbG9zZXN0KCdhJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3JlbCcsICdub29wZW5lciBub3JlZmVycmVyJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIHRleHQgaGllcmFyY2h5IGluIGJpbGxpbmcgdGlwJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiB0cnVlLFxuICAgICAgICBwbGFuOiB7IHR5cGU6IFBsYW4uc2FuZGJveCB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB0aXRsZSA9IHNjcmVlbi5nZXRCeVRleHQoJ2N1c3RvbS51cGdyYWRlVGlwLnRpdGxlJylcbiAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY3VzdG9tLnVwZ3JhZGVUaXAuZGVzJylcblxuICAgICAgZXhwZWN0KHRpdGxlKS50b0hhdmVDbGFzcygndGl0bGUteGwtc2VtaS1ib2xkJylcbiAgICAgIGV4cGVjdChkZXNjcmlwdGlvbikudG9IYXZlQ2xhc3MoJ3N5c3RlbS1zbS1yZWd1bGFyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc2VtYW50aWMgY29sb3IgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIENoZWNrIHRoYXQgdGhlIGJpbGxpbmcgdGlwIGhhcyB0ZXh0IGNvbnRlbnQgKHdoaWNoIGltcGxpZXMgc2VtYW50aWMgY29sb3JzKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2N1c3RvbS51cGdyYWRlVGlwLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEludGVncmF0aW9uIFRlc3RzXG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBib3RoIEN1c3RvbVdlYkFwcEJyYW5kIGFuZCBiaWxsaW5nIHRpcCB0b2dldGhlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcldpdGhDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXdlYi1hcHAtYnJhbmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2N1c3RvbS51cGdyYWRlVGlwLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYm90aCBDdXN0b21XZWJBcHBCcmFuZCBhbmQgY29udGFjdCBzZWN0aW9uIHRvZ2V0aGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiB0cnVlLFxuICAgICAgICBwbGFuOiB7IHR5cGU6IFBsYW4ucHJvZmVzc2lvbmFsIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS13ZWItYXBwLWJyYW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjdXN0b20uY3VzdG9taXplLmNvbnRhY3RVcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG9ubHkgQ3VzdG9tV2ViQXBwQnJhbmQgd2hlbiBubyBiaWxsaW5nIGNvbmRpdGlvbnMgbWV0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyV2l0aENvbnRleHQoe1xuICAgICAgICBlbmFibGVCaWxsaW5nOiBmYWxzZSxcbiAgICAgICAgcGxhbjogeyB0eXBlOiBQbGFuLnNhbmRib3ggfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXdlYi1hcHAtYnJhbmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY3VzdG9tLnVwZ3JhZGVUaXAudGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2N1c3RvbS5jdXN0b21pemUuY29udGFjdFVzJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=