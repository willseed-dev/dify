"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const index_1 = require("./index");
// ✅ Import real project components (DO NOT mock these)
// PremiumBadge, Button, SparklesSoft are all base components
// ✅ Mock external dependencies only
const mockSetShowPricingModal = vi.fn();
vi.mock('@/context/modal-context', () => ({
    useModalContext: () => ({
        setShowPricingModal: mockSetShowPricingModal,
    }),
}));
// Mock gtag for tracking tests
let mockGtag;
describe('UpgradeBtn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGtag = vi.fn();
        window.gtag = mockGtag;
    });
    afterEach(() => {
        delete window.gtag;
    });
    // Rendering tests (REQUIRED)
    describe('Rendering', () => {
        it('should render without crashing with default props', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert - should render with default text
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
        it('should render premium badge by default', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert - PremiumBadge renders with text content
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
        it('should render plain button when isPlain is true', () => {
            // Act
            (0, react_1.render)(<index_1.default isPlain/>);
            // Assert - Button should be rendered with plain text
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.plain/i)).toBeInTheDocument();
        });
        it('should render short text when isShort is true', () => {
            // Act
            (0, react_1.render)(<index_1.default isShort/>);
            // Assert
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourageShort/i)).toBeInTheDocument();
        });
        it('should render custom label when labelKey is provided', () => {
            // Act
            (0, react_1.render)(<index_1.default labelKey={'custom.label.key'}/>);
            // Assert
            expect(react_1.screen.getByText(/custom\.label\.key/i)).toBeInTheDocument();
        });
        it('should render custom label in plain button when labelKey is provided with isPlain', () => {
            // Act
            (0, react_1.render)(<index_1.default isPlain labelKey={'custom.label.key'}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
            expect(react_1.screen.getByText(/custom\.label\.key/i)).toBeInTheDocument();
        });
    });
    // Props tests (REQUIRED)
    describe('Props', () => {
        it('should apply custom className to premium badge', () => {
            // Arrange
            const customClass = 'custom-upgrade-btn';
            // Act
            const { container } = (0, react_1.render)(<index_1.default className={customClass}/>);
            // Assert - Check the root element has the custom class
            const rootElement = container.firstChild;
            expect(rootElement).toHaveClass(customClass);
        });
        it('should apply custom className to plain button', () => {
            // Arrange
            const customClass = 'custom-button-class';
            // Act
            (0, react_1.render)(<index_1.default isPlain className={customClass}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass(customClass);
        });
        it('should apply custom style to premium badge', () => {
            // Arrange
            const customStyle = { padding: '10px' };
            // Act
            const { container } = (0, react_1.render)(<index_1.default style={customStyle}/>);
            // Assert
            const rootElement = container.firstChild;
            expect(rootElement).toHaveStyle(customStyle);
        });
        it('should apply custom style to plain button', () => {
            // Arrange
            const customStyle = { margin: '5px' };
            // Act
            (0, react_1.render)(<index_1.default isPlain style={customStyle}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveStyle(customStyle);
        });
        it('should render with size "s"', () => {
            // Act
            (0, react_1.render)(<index_1.default size="s"/>);
            // Assert - Component renders successfully with size prop
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
        it('should render with size "m" by default', () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert - Component renders successfully
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
        it('should render with size "custom"', () => {
            // Act
            (0, react_1.render)(<index_1.default size="custom"/>);
            // Assert - Component renders successfully with custom size
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
    });
    // User Interactions
    describe('User Interactions', () => {
        it('should call custom onClick when provided and premium badge is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const handleClick = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default onClick={handleClick}/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert
            expect(handleClick).toHaveBeenCalledTimes(1);
            expect(mockSetShowPricingModal).not.toHaveBeenCalled();
        });
        it('should call custom onClick when provided and plain button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const handleClick = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default isPlain onClick={handleClick}/>);
            const button = react_1.screen.getByRole('button');
            await user.click(button);
            // Assert
            expect(handleClick).toHaveBeenCalledTimes(1);
            expect(mockSetShowPricingModal).not.toHaveBeenCalled();
        });
        it('should open pricing modal when no custom onClick is provided and premium badge is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default />);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert
            expect(mockSetShowPricingModal).toHaveBeenCalledTimes(1);
        });
        it('should open pricing modal when no custom onClick is provided and plain button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default isPlain/>);
            const button = react_1.screen.getByRole('button');
            await user.click(button);
            // Assert
            expect(mockSetShowPricingModal).toHaveBeenCalledTimes(1);
        });
        it('should track gtag event when loc is provided and badge is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const loc = 'header-navigation';
            // Act
            (0, react_1.render)(<index_1.default loc={loc}/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert
            expect(mockGtag).toHaveBeenCalledTimes(1);
            expect(mockGtag).toHaveBeenCalledWith('event', 'click_upgrade_btn', {
                loc,
            });
        });
        it('should track gtag event when loc is provided and plain button is clicked', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const loc = 'footer-section';
            // Act
            (0, react_1.render)(<index_1.default isPlain loc={loc}/>);
            const button = react_1.screen.getByRole('button');
            await user.click(button);
            // Assert
            expect(mockGtag).toHaveBeenCalledTimes(1);
            expect(mockGtag).toHaveBeenCalledWith('event', 'click_upgrade_btn', {
                loc,
            });
        });
        it('should not track gtag event when loc is not provided', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default />);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert
            expect(mockGtag).not.toHaveBeenCalled();
        });
        it('should not track gtag event when gtag is not available', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            delete window.gtag;
            // Act
            (0, react_1.render)(<index_1.default loc="test-location"/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert - should not throw error
            expect(mockGtag).not.toHaveBeenCalled();
        });
        it('should call both custom onClick and track gtag when both are provided', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const handleClick = vi.fn();
            const loc = 'settings-page';
            // Act
            (0, react_1.render)(<index_1.default onClick={handleClick} loc={loc}/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert
            expect(handleClick).toHaveBeenCalledTimes(1);
            expect(mockGtag).toHaveBeenCalledTimes(1);
            expect(mockGtag).toHaveBeenCalledWith('event', 'click_upgrade_btn', {
                loc,
            });
        });
    });
    // Edge Cases (REQUIRED)
    describe('Edge Cases', () => {
        it('should handle undefined className', () => {
            // Act
            (0, react_1.render)(<index_1.default className={undefined}/>);
            // Assert - should render without error
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
        it('should handle undefined style', () => {
            // Act
            (0, react_1.render)(<index_1.default style={undefined}/>);
            // Assert - should render without error
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
        it('should handle undefined onClick', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default onClick={undefined}/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert - should fall back to setShowPricingModal
            expect(mockSetShowPricingModal).toHaveBeenCalledTimes(1);
        });
        it('should handle undefined loc', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default loc={undefined}/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert - should not attempt to track gtag
            expect(mockGtag).not.toHaveBeenCalled();
        });
        it('should handle undefined labelKey', () => {
            // Act
            (0, react_1.render)(<index_1.default labelKey={undefined}/>);
            // Assert - should use default label
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
        it('should handle empty string className', () => {
            // Act
            (0, react_1.render)(<index_1.default className=""/>);
            // Assert
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
        it('should handle empty string loc', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default loc=""/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert - empty loc should not trigger gtag
            expect(mockGtag).not.toHaveBeenCalled();
        });
        it('should handle empty string labelKey', () => {
            // Act
            (0, react_1.render)(<index_1.default labelKey={''}/>);
            // Assert - empty labelKey is falsy, so it falls back to default label
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i)).toBeInTheDocument();
        });
    });
    // Prop Combinations
    describe('Prop Combinations', () => {
        it('should handle isPlain with isShort', () => {
            // Act
            (0, react_1.render)(<index_1.default isPlain isShort/>);
            // Assert - isShort should not affect plain button text
            expect(react_1.screen.getByText(/billing\.upgradeBtn\.plain/i)).toBeInTheDocument();
        });
        it('should handle isPlain with custom labelKey', () => {
            // Act
            (0, react_1.render)(<index_1.default isPlain labelKey={'custom.key'}/>);
            // Assert - labelKey should override plain text
            expect(react_1.screen.getByText(/custom\.key/i)).toBeInTheDocument();
            expect(react_1.screen.queryByText(/billing\.upgradeBtn\.plain/i)).not.toBeInTheDocument();
        });
        it('should handle isShort with custom labelKey', () => {
            // Act
            (0, react_1.render)(<index_1.default isShort labelKey={'custom.short.key'}/>);
            // Assert - labelKey should override isShort behavior
            expect(react_1.screen.getByText(/custom\.short\.key/i)).toBeInTheDocument();
            expect(react_1.screen.queryByText(/billing\.upgradeBtn\.encourageShort/i)).not.toBeInTheDocument();
        });
        it('should handle all custom props together', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const handleClick = vi.fn();
            const customStyle = { margin: '10px' };
            const customClass = 'all-custom';
            // Act
            const { container } = (0, react_1.render)(<index_1.default className={customClass} style={customStyle} size="s" isShort onClick={handleClick} loc="test-loc" labelKey={'custom.all'}/>);
            const badge = react_1.screen.getByText(/custom\.all/i);
            await user.click(badge);
            // Assert
            const rootElement = container.firstChild;
            expect(rootElement).toHaveClass(customClass);
            expect(rootElement).toHaveStyle(customStyle);
            expect(react_1.screen.getByText(/custom\.all/i)).toBeInTheDocument();
            expect(handleClick).toHaveBeenCalledTimes(1);
            expect(mockGtag).toHaveBeenCalledWith('event', 'click_upgrade_btn', {
                loc: 'test-loc',
            });
        });
    });
    // Accessibility Tests
    describe('Accessibility', () => {
        it('should be keyboard accessible with plain button', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const handleClick = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default isPlain onClick={handleClick}/>);
            const button = react_1.screen.getByRole('button');
            // Tab to button
            await user.tab();
            expect(button).toHaveFocus();
            // Press Enter
            await user.keyboard('{Enter}');
            // Assert
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('should be keyboard accessible with Space key', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const handleClick = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default isPlain onClick={handleClick}/>);
            // Tab to button and press Space
            await user.tab();
            await user.keyboard(' ');
            // Assert
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('should be clickable for premium badge variant', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const handleClick = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default onClick={handleClick}/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            // Click badge
            await user.click(badge);
            // Assert
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
        it('should have proper button role when isPlain is true', () => {
            // Act
            (0, react_1.render)(<index_1.default isPlain/>);
            // Assert - Plain button should have button role
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });
    });
    // Integration Tests
    describe('Integration', () => {
        it('should work with modal context for pricing modal', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            // Act
            (0, react_1.render)(<index_1.default />);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSetShowPricingModal).toHaveBeenCalledTimes(1);
            });
        });
        it('should integrate onClick with analytics tracking', async () => {
            // Arrange
            const user = user_event_1.default.setup();
            const handleClick = vi.fn();
            // Act
            (0, react_1.render)(<index_1.default onClick={handleClick} loc="integration-test"/>);
            const badge = react_1.screen.getByText(/billing\.upgradeBtn\.encourage/i);
            await user.click(badge);
            // Assert - Both onClick and gtag should be called
            await (0, react_1.waitFor)(() => {
                expect(handleClick).toHaveBeenCalledTimes(1);
                expect(mockGtag).toHaveBeenCalledWith('event', 'click_upgrade_btn', {
                    loc: 'integration-test',
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWdFO0FBQ2hFLDREQUFtRDtBQUNuRCxtQ0FBZ0M7QUFFaEMsdURBQXVEO0FBQ3ZELDZEQUE2RDtBQUU3RCxvQ0FBb0M7QUFDcEMsTUFBTSx1QkFBdUIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDdkMsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3RCLG1CQUFtQixFQUFFLHVCQUF1QjtLQUM3QyxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCwrQkFBK0I7QUFDL0IsSUFBSSxRQUEwQixDQUFBO0FBRTlCLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDbEIsUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FDakI7UUFBQyxNQUFjLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtJQUNsQyxDQUFDLENBQUMsQ0FBQTtJQUVGLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDYixPQUFRLE1BQWMsQ0FBQyxJQUFJLENBQUE7SUFDN0IsQ0FBQyxDQUFDLENBQUE7SUFFRiw2QkFBNkI7SUFDN0IsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUMzRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFVLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV0QiwyQ0FBMkM7WUFDM0MsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxD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QUFDLEtBQUssQ0FBQyxDQUFBO1lBRXZCLGtEQUFrRDtZQUNsRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUM1QyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFO29CQUNsRSxHQUFHLEVBQUUsa0JBQWtCO2lCQUN4QixDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTW9jayB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB1c2VyRXZlbnQgZnJvbSAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50J1xuaW1wb3J0IFVwZ3JhZGVCdG4gZnJvbSAnLi9pbmRleCdcblxuLy8g4pyFIEltcG9ydCByZWFsIHByb2plY3QgY29tcG9uZW50cyAoRE8gTk9UIG1vY2sgdGhlc2UpXG4vLyBQcmVtaXVtQmFkZ2UsIEJ1dHRvbiwgU3BhcmtsZXNTb2Z0IGFyZSBhbGwgYmFzZSBjb21wb25lbnRzXG5cbi8vIOKchSBNb2NrIGV4dGVybmFsIGRlcGVuZGVuY2llcyBvbmx5XG5jb25zdCBtb2NrU2V0U2hvd1ByaWNpbmdNb2RhbCA9IHZpLmZuKClcbnZpLm1vY2soJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlTW9kYWxDb250ZXh0OiAoKSA9PiAoe1xuICAgIHNldFNob3dQcmljaW5nTW9kYWw6IG1vY2tTZXRTaG93UHJpY2luZ01vZGFsLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGd0YWcgZm9yIHRyYWNraW5nIHRlc3RzXG5sZXQgbW9ja0d0YWc6IE1vY2sgfCB1bmRlZmluZWRcblxuZGVzY3JpYmUoJ1VwZ3JhZGVCdG4nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tHdGFnID0gdmkuZm4oKVxuICAgIDsod2luZG93IGFzIGFueSkuZ3RhZyA9IG1vY2tHdGFnXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBkZWxldGUgKHdpbmRvdyBhcyBhbnkpLmd0YWdcbiAgfSlcblxuICAvLyBSZW5kZXJpbmcgdGVzdHMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcgd2l0aCBkZWZhdWx0IHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZW5kZXIgd2l0aCBkZWZhdWx0IHRleHRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwcmVtaXVtIGJhZGdlIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUHJlbWl1bUJhZGdlIHJlbmRlcnMgd2l0aCB0ZXh0IGNvbnRlbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwbGFpbiBidXR0b24gd2hlbiBpc1BsYWluIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBpc1BsYWluIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBCdXR0b24gc2hvdWxkIGJlIHJlbmRlcmVkIHdpdGggcGxhaW4gdGV4dFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLnBsYWluL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHNob3J0IHRleHQgd2hlbiBpc1Nob3J0IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBpc1Nob3J0IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZVNob3J0L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGN1c3RvbSBsYWJlbCB3aGVuIGxhYmVsS2V5IGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gbGFiZWxLZXk9eydjdXN0b20ubGFiZWwua2V5JyBhcyBhbnl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jdXN0b21cXC5sYWJlbFxcLmtleS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjdXN0b20gbGFiZWwgaW4gcGxhaW4gYnV0dG9uIHdoZW4gbGFiZWxLZXkgaXMgcHJvdmlkZWQgd2l0aCBpc1BsYWluJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gaXNQbGFpbiBsYWJlbEtleT17J2N1c3RvbS5sYWJlbC5rZXknIGFzIGFueX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9jdXN0b21cXC5sYWJlbFxcLmtleS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gUHJvcHMgdGVzdHMgKFJFUVVJUkVEKVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gY2xhc3NOYW1lIHRvIHByZW1pdW0gYmFkZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjdXN0b21DbGFzcyA9ICdjdXN0b20tdXBncmFkZS1idG4nXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8VXBncmFkZUJ0biBjbGFzc05hbWU9e2N1c3RvbUNsYXNzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgdGhlIHJvb3QgZWxlbWVudCBoYXMgdGhlIGN1c3RvbSBjbGFzc1xuICAgICAgY29uc3Qgcm9vdEVsZW1lbnQgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHJvb3RFbGVtZW50KS50b0hhdmVDbGFzcyhjdXN0b21DbGFzcylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gY2xhc3NOYW1lIHRvIHBsYWluIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGN1c3RvbUNsYXNzID0gJ2N1c3RvbS1idXR0b24tY2xhc3MnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGlzUGxhaW4gY2xhc3NOYW1lPXtjdXN0b21DbGFzc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKGN1c3RvbUNsYXNzKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBzdHlsZSB0byBwcmVtaXVtIGJhZGdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3VzdG9tU3R5bGUgPSB7IHBhZGRpbmc6ICcxMHB4JyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8VXBncmFkZUJ0biBzdHlsZT17Y3VzdG9tU3R5bGV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHJvb3RFbGVtZW50ID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChyb290RWxlbWVudCkudG9IYXZlU3R5bGUoY3VzdG9tU3R5bGUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIHN0eWxlIHRvIHBsYWluIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGN1c3RvbVN0eWxlID0geyBtYXJnaW46ICc1cHgnIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gaXNQbGFpbiBzdHlsZT17Y3VzdG9tU3R5bGV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0hhdmVTdHlsZShjdXN0b21TdHlsZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBzaXplIFwic1wiJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gc2l6ZT1cInNcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHJlbmRlcnMgc3VjY2Vzc2Z1bGx5IHdpdGggc2l6ZSBwcm9wXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5lbmNvdXJhZ2UvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBzaXplIFwibVwiIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHJlbmRlcnMgc3VjY2Vzc2Z1bGx5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5lbmNvdXJhZ2UvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBzaXplIFwiY3VzdG9tXCInLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBzaXplPVwiY3VzdG9tXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCByZW5kZXJzIHN1Y2Nlc3NmdWxseSB3aXRoIGN1c3RvbSBzaXplXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5lbmNvdXJhZ2UvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgY3VzdG9tIG9uQ2xpY2sgd2hlbiBwcm92aWRlZCBhbmQgcHJlbWl1bSBiYWRnZSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+KVxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhiYWRnZSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93UHJpY2luZ01vZGFsKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBjdXN0b20gb25DbGljayB3aGVuIHByb3ZpZGVkIGFuZCBwbGFpbiBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgaGFuZGxlQ2xpY2sgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGlzUGxhaW4gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+KVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoYW5kbGVDbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QobW9ja1NldFNob3dQcmljaW5nTW9kYWwpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIHByaWNpbmcgbW9kYWwgd2hlbiBubyBjdXN0b20gb25DbGljayBpcyBwcm92aWRlZCBhbmQgcHJlbWl1bSBiYWRnZSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIC8+KVxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhiYWRnZSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NldFNob3dQcmljaW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9wZW4gcHJpY2luZyBtb2RhbCB3aGVuIG5vIGN1c3RvbSBvbkNsaWNrIGlzIHByb3ZpZGVkIGFuZCBwbGFpbiBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBpc1BsYWluIC8+KVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd1ByaWNpbmdNb2RhbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhY2sgZ3RhZyBldmVudCB3aGVuIGxvYyBpcyBwcm92aWRlZCBhbmQgYmFkZ2UgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgbG9jID0gJ2hlYWRlci1uYXZpZ2F0aW9uJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBsb2M9e2xvY30gLz4pXG4gICAgICBjb25zdCBiYWRnZSA9IHNjcmVlbi5nZXRCeVRleHQoL2JpbGxpbmdcXC51cGdyYWRlQnRuXFwuZW5jb3VyYWdlL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGJhZGdlKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrR3RhZykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICBleHBlY3QobW9ja0d0YWcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdldmVudCcsICdjbGlja191cGdyYWRlX2J0bicsIHtcbiAgICAgICAgbG9jLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFjayBndGFnIGV2ZW50IHdoZW4gbG9jIGlzIHByb3ZpZGVkIGFuZCBwbGFpbiBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgbG9jID0gJ2Zvb3Rlci1zZWN0aW9uJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBpc1BsYWluIGxvYz17bG9jfSAvPilcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0d0YWcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tHdGFnKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZXZlbnQnLCAnY2xpY2tfdXBncmFkZV9idG4nLCB7XG4gICAgICAgIGxvYyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHRyYWNrIGd0YWcgZXZlbnQgd2hlbiBsb2MgaXMgbm90IHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIC8+KVxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhiYWRnZSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0d0YWcpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdHJhY2sgZ3RhZyBldmVudCB3aGVuIGd0YWcgaXMgbm90IGF2YWlsYWJsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgZGVsZXRlICh3aW5kb3cgYXMgYW55KS5ndGFnXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGxvYz1cInRlc3QtbG9jYXRpb25cIiAvPilcbiAgICAgIGNvbnN0IGJhZGdlID0gc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5lbmNvdXJhZ2UvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYmFkZ2UpXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBub3QgdGhyb3cgZXJyb3JcbiAgICAgIGV4cGVjdChtb2NrR3RhZykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgYm90aCBjdXN0b20gb25DbGljayBhbmQgdHJhY2sgZ3RhZyB3aGVuIGJvdGggYXJlIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGxvYyA9ICdzZXR0aW5ncy1wYWdlJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBvbkNsaWNrPXtoYW5kbGVDbGlja30gbG9jPXtsb2N9IC8+KVxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhiYWRnZSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tHdGFnKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrR3RhZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2V2ZW50JywgJ2NsaWNrX3VwZ3JhZGVfYnRuJywge1xuICAgICAgICBsb2MsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRWRnZSBDYXNlcyAoUkVRVUlSRUQpXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBjbGFzc05hbWU9e3VuZGVmaW5lZH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2JpbGxpbmdcXC51cGdyYWRlQnRuXFwuZW5jb3VyYWdlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBzdHlsZScsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIHN0eWxlPXt1bmRlZmluZWR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgb25DbGljaycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBvbkNsaWNrPXt1bmRlZmluZWR9IC8+KVxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhiYWRnZSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIGZhbGwgYmFjayB0byBzZXRTaG93UHJpY2luZ01vZGFsXG4gICAgICBleHBlY3QobW9ja1NldFNob3dQcmljaW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgbG9jJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGxvYz17dW5kZWZpbmVkfSAvPilcbiAgICAgIGNvbnN0IGJhZGdlID0gc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5lbmNvdXJhZ2UvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYmFkZ2UpXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBub3QgYXR0ZW1wdCB0byB0cmFjayBndGFnXG4gICAgICBleHBlY3QobW9ja0d0YWcpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGxhYmVsS2V5JywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gbGFiZWxLZXk9e3VuZGVmaW5lZH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCB1c2UgZGVmYXVsdCBsYWJlbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2JpbGxpbmdcXC51cGdyYWRlQnRuXFwuZW5jb3VyYWdlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBjbGFzc05hbWU9XCJcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5lbmNvdXJhZ2UvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIGxvYycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBncmFkZUJ0biBsb2M9XCJcIiAvPilcbiAgICAgIGNvbnN0IGJhZGdlID0gc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5lbmNvdXJhZ2UvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYmFkZ2UpXG5cbiAgICAgIC8vIEFzc2VydCAtIGVtcHR5IGxvYyBzaG91bGQgbm90IHRyaWdnZXIgZ3RhZ1xuICAgICAgZXhwZWN0KG1vY2tHdGFnKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBsYWJlbEtleScsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGxhYmVsS2V5PXsnJyBhcyBhbnl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBlbXB0eSBsYWJlbEtleSBpcyBmYWxzeSwgc28gaXQgZmFsbHMgYmFjayB0byBkZWZhdWx0IGxhYmVsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5lbmNvdXJhZ2UvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFByb3AgQ29tYmluYXRpb25zXG4gIGRlc2NyaWJlKCdQcm9wIENvbWJpbmF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBpc1BsYWluIHdpdGggaXNTaG9ydCcsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGlzUGxhaW4gaXNTaG9ydCAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gaXNTaG9ydCBzaG91bGQgbm90IGFmZmVjdCBwbGFpbiBidXR0b24gdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2JpbGxpbmdcXC51cGdyYWRlQnRuXFwucGxhaW4vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaXNQbGFpbiB3aXRoIGN1c3RvbSBsYWJlbEtleScsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGlzUGxhaW4gbGFiZWxLZXk9eydjdXN0b20ua2V5JyBhcyBhbnl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBsYWJlbEtleSBzaG91bGQgb3ZlcnJpZGUgcGxhaW4gdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2N1c3RvbVxcLmtleS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvYmlsbGluZ1xcLnVwZ3JhZGVCdG5cXC5wbGFpbi9pKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaXNTaG9ydCB3aXRoIGN1c3RvbSBsYWJlbEtleScsICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGlzU2hvcnQgbGFiZWxLZXk9eydjdXN0b20uc2hvcnQua2V5JyBhcyBhbnl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBsYWJlbEtleSBzaG91bGQgb3ZlcnJpZGUgaXNTaG9ydCBiZWhhdmlvclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2N1c3RvbVxcLnNob3J0XFwua2V5L2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZVNob3J0L2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbGwgY3VzdG9tIHByb3BzIHRvZ2V0aGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGN1c3RvbVN0eWxlID0geyBtYXJnaW46ICcxMHB4JyB9XG4gICAgICBjb25zdCBjdXN0b21DbGFzcyA9ICdhbGwtY3VzdG9tJ1xuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxVcGdyYWRlQnRuXG4gICAgICAgICAgY2xhc3NOYW1lPXtjdXN0b21DbGFzc31cbiAgICAgICAgICBzdHlsZT17Y3VzdG9tU3R5bGV9XG4gICAgICAgICAgc2l6ZT1cInNcIlxuICAgICAgICAgIGlzU2hvcnRcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVDbGlja31cbiAgICAgICAgICBsb2M9XCJ0ZXN0LWxvY1wiXG4gICAgICAgICAgbGFiZWxLZXk9eydjdXN0b20uYWxsJyBhcyBhbnl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KC9jdXN0b21cXC5hbGwvaSlcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soYmFkZ2UpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgcm9vdEVsZW1lbnQgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHJvb3RFbGVtZW50KS50b0hhdmVDbGFzcyhjdXN0b21DbGFzcylcbiAgICAgIGV4cGVjdChyb290RWxlbWVudCkudG9IYXZlU3R5bGUoY3VzdG9tU3R5bGUpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvY3VzdG9tXFwuYWxsL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoaGFuZGxlQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG1vY2tHdGFnKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnZXZlbnQnLCAnY2xpY2tfdXBncmFkZV9idG4nLCB7XG4gICAgICAgIGxvYzogJ3Rlc3QtbG9jJyxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBBY2Nlc3NpYmlsaXR5IFRlc3RzXG4gIGRlc2NyaWJlKCdBY2Nlc3NpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUga2V5Ym9hcmQgYWNjZXNzaWJsZSB3aXRoIHBsYWluIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgaGFuZGxlQ2xpY2sgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIGlzUGxhaW4gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+KVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcblxuICAgICAgLy8gVGFiIHRvIGJ1dHRvblxuICAgICAgYXdhaXQgdXNlci50YWIoKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlRm9jdXMoKVxuXG4gICAgICAvLyBQcmVzcyBFbnRlclxuICAgICAgYXdhaXQgdXNlci5rZXlib2FyZCgne0VudGVyfScpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGhhbmRsZUNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBiZSBrZXlib2FyZCBhY2Nlc3NpYmxlIHdpdGggU3BhY2Uga2V5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gaXNQbGFpbiBvbkNsaWNrPXtoYW5kbGVDbGlja30gLz4pXG5cbiAgICAgIC8vIFRhYiB0byBidXR0b24gYW5kIHByZXNzIFNwYWNlXG4gICAgICBhd2FpdCB1c2VyLnRhYigpXG4gICAgICBhd2FpdCB1c2VyLmtleWJvYXJkKCcgJylcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGJlIGNsaWNrYWJsZSBmb3IgcHJlbWl1bSBiYWRnZSB2YXJpYW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IHZpLmZuKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gb25DbGljaz17aGFuZGxlQ2xpY2t9IC8+KVxuICAgICAgY29uc3QgYmFkZ2UgPSBzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwudXBncmFkZUJ0blxcLmVuY291cmFnZS9pKVxuXG4gICAgICAvLyBDbGljayBiYWRnZVxuICAgICAgYXdhaXQgdXNlci5jbGljayhiYWRnZSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGFuZGxlQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIGJ1dHRvbiByb2xlIHdoZW4gaXNQbGFpbiBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gaXNQbGFpbiAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUGxhaW4gYnV0dG9uIHNob3VsZCBoYXZlIGJ1dHRvbiByb2xlXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgd29yayB3aXRoIG1vZGFsIGNvbnRleHQgZm9yIHByaWNpbmcgbW9kYWwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFVwZ3JhZGVCdG4gLz4pXG4gICAgICBjb25zdCBiYWRnZSA9IHNjcmVlbi5nZXRCeVRleHQoL2JpbGxpbmdcXC51cGdyYWRlQnRuXFwuZW5jb3VyYWdlL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGJhZGdlKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NldFNob3dQcmljaW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbnRlZ3JhdGUgb25DbGljayB3aXRoIGFuYWx5dGljcyB0cmFja2luZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgY29uc3QgaGFuZGxlQ2xpY2sgPSB2aS5mbigpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxVcGdyYWRlQnRuIG9uQ2xpY2s9e2hhbmRsZUNsaWNrfSBsb2M9XCJpbnRlZ3JhdGlvbi10ZXN0XCIgLz4pXG4gICAgICBjb25zdCBiYWRnZSA9IHNjcmVlbi5nZXRCeVRleHQoL2JpbGxpbmdcXC51cGdyYWRlQnRuXFwuZW5jb3VyYWdlL2kpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKGJhZGdlKVxuXG4gICAgICAvLyBBc3NlcnQgLSBCb3RoIG9uQ2xpY2sgYW5kIGd0YWcgc2hvdWxkIGJlIGNhbGxlZFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChoYW5kbGVDbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChtb2NrR3RhZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2V2ZW50JywgJ2NsaWNrX3VwZ3JhZGVfYnRuJywge1xuICAgICAgICAgIGxvYzogJ2ludGVncmF0aW9uLXRlc3QnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==