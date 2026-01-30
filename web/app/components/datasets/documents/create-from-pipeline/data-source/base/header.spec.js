"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const header_1 = require("./header");
// Mock CredentialTypeEnum to avoid deep import chain issues
var MockCredentialTypeEnum;
(function (MockCredentialTypeEnum) {
    MockCredentialTypeEnum["OAUTH2"] = "oauth2";
    MockCredentialTypeEnum["API_KEY"] = "api_key";
})(MockCredentialTypeEnum || (MockCredentialTypeEnum = {}));
// Mock plugin-auth module to avoid deep import chain issues
vi.mock('@/app/components/plugins/plugin-auth', () => ({
    CredentialTypeEnum: {
        OAUTH2: 'oauth2',
        API_KEY: 'api_key',
    },
}));
// Mock portal-to-follow-elem - required for CredentialSelector
vi.mock('@/app/components/base/portal-to-follow-elem', () => {
    const MockPortalToFollowElem = ({ children, open }) => {
        return (<div data-testid="portal-root" data-open={open}>
        {React.Children.map(children, (child) => {
                if (!child)
                    return null;
                return React.cloneElement(child, { __portalOpen: open });
            })}
      </div>);
    };
    const MockPortalToFollowElemTrigger = ({ children, onClick, className, __portalOpen }) => (<div data-testid="portal-trigger" onClick={onClick} className={className} data-open={__portalOpen}>
      {children}
    </div>);
    const MockPortalToFollowElemContent = ({ children, className, __portalOpen }) => {
        if (!__portalOpen)
            return null;
        return (<div data-testid="portal-content" className={className}>
        {children}
      </div>);
    };
    return {
        PortalToFollowElem: MockPortalToFollowElem,
        PortalToFollowElemTrigger: MockPortalToFollowElemTrigger,
        PortalToFollowElemContent: MockPortalToFollowElemContent,
    };
});
// ==========================================
// Test Data Builders
// ==========================================
const createMockCredential = (overrides) => ({
    id: 'cred-1',
    name: 'Test Credential',
    avatar_url: 'https://example.com/avatar.png',
    credential: { key: 'value' },
    is_default: false,
    type: MockCredentialTypeEnum.OAUTH2,
    ...overrides,
});
const createMockCredentials = (count = 3) => Array.from({ length: count }, (_, i) => createMockCredential({
    id: `cred-${i + 1}`,
    name: `Credential ${i + 1}`,
    avatar_url: `https://example.com/avatar-${i + 1}.png`,
    is_default: i === 0,
}));
const createDefaultProps = (overrides) => ({
    docTitle: 'Documentation',
    docLink: 'https://docs.example.com',
    pluginName: 'Test Plugin',
    currentCredentialId: 'cred-1',
    onCredentialChange: vi.fn(),
    credentials: createMockCredentials(),
    ...overrides,
});
describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Documentation')).toBeInTheDocument();
        });
        it('should render documentation link with correct attributes', () => {
            // Arrange
            const props = createDefaultProps({
                docTitle: 'API Docs',
                docLink: 'https://api.example.com/docs',
            });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const link = react_1.screen.getByRole('link', { name: /API Docs/i });
            expect(link).toHaveAttribute('href', 'https://api.example.com/docs');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
        it('should render document title with title attribute', () => {
            // Arrange
            const props = createDefaultProps({ docTitle: 'My Documentation' });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const titleSpan = react_1.screen.getByText('My Documentation');
            expect(titleSpan).toHaveAttribute('title', 'My Documentation');
        });
        it('should render CredentialSelector with correct props', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert - CredentialSelector should render current credential name
            expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument();
        });
        it('should render configuration button', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should render book icon in documentation link', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert - RiBookOpenLine renders as SVG
            const link = react_1.screen.getByRole('link');
            const svg = link.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
        it('should render divider between credential selector and configuration button', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<header_1.default {...props}/>);
            // Assert - Divider component should be rendered
            // Divider typically renders as a div with specific styling
            const divider = container.querySelector('[class*="divider"]') || container.querySelector('.mx-1.h-3\\.5');
            expect(divider).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('docTitle prop', () => {
            it('should display the document title', () => {
                // Arrange
                const props = createDefaultProps({ docTitle: 'Getting Started Guide' });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Getting Started Guide')).toBeInTheDocument();
            });
            it.each([
                'Quick Start',
                'API Reference',
                'Configuration Guide',
                'Plugin Documentation',
            ])('should display "%s" as document title', (title) => {
                // Arrange
                const props = createDefaultProps({ docTitle: title });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(title)).toBeInTheDocument();
            });
        });
        describe('docLink prop', () => {
            it('should set correct href on documentation link', () => {
                // Arrange
                const props = createDefaultProps({ docLink: 'https://custom.docs.com/guide' });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert
                const link = react_1.screen.getByRole('link');
                expect(link).toHaveAttribute('href', 'https://custom.docs.com/guide');
            });
            it.each([
                'https://docs.dify.ai',
                'https://example.com/api',
                '/local/docs',
            ])('should accept "%s" as docLink', (link) => {
                // Arrange
                const props = createDefaultProps({ docLink: link });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('link')).toHaveAttribute('href', link);
            });
        });
        describe('pluginName prop', () => {
            it('should pass pluginName to translation function', () => {
                // Arrange
                const props = createDefaultProps({ pluginName: 'MyPlugin' });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert - The translation mock returns the key with options
                // Tooltip uses the translated content
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
        });
        describe('onClickConfiguration prop', () => {
            it('should call onClickConfiguration when configuration icon is clicked', () => {
                // Arrange
                const mockOnClick = vi.fn();
                const props = createDefaultProps({ onClickConfiguration: mockOnClick });
                (0, react_1.render)(<header_1.default {...props}/>);
                // Act - Find the configuration button and click the icon inside
                // The button contains the RiEqualizer2Line icon with onClick handler
                const configButton = react_1.screen.getByRole('button');
                const configIcon = configButton.querySelector('svg');
                expect(configIcon).toBeInTheDocument();
                react_1.fireEvent.click(configIcon);
                // Assert
                expect(mockOnClick).toHaveBeenCalledTimes(1);
            });
            it('should not crash when onClickConfiguration is undefined', () => {
                // Arrange
                const props = createDefaultProps({ onClickConfiguration: undefined });
                (0, react_1.render)(<header_1.default {...props}/>);
                // Act - Find the configuration button and click the icon inside
                const configButton = react_1.screen.getByRole('button');
                const configIcon = configButton.querySelector('svg');
                expect(configIcon).toBeInTheDocument();
                react_1.fireEvent.click(configIcon);
                // Assert - Component should still be rendered (no crash)
                expect(react_1.screen.getByRole('button')).toBeInTheDocument();
            });
        });
        describe('CredentialSelector props passthrough', () => {
            it('should pass currentCredentialId to CredentialSelector', () => {
                // Arrange
                const props = createDefaultProps({ currentCredentialId: 'cred-2' });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert - Should display the second credential
                expect(react_1.screen.getByText('Credential 2')).toBeInTheDocument();
            });
            it('should pass credentials to CredentialSelector', () => {
                // Arrange
                const customCredentials = [
                    createMockCredential({ id: 'custom-1', name: 'Custom Credential' }),
                ];
                const props = createDefaultProps({
                    credentials: customCredentials,
                    currentCredentialId: 'custom-1',
                });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Custom Credential')).toBeInTheDocument();
            });
            it('should pass onCredentialChange to CredentialSelector', () => {
                // Arrange
                const mockOnChange = vi.fn();
                const props = createDefaultProps({ onCredentialChange: mockOnChange });
                (0, react_1.render)(<header_1.default {...props}/>);
                // Act - Open dropdown and select a credential
                // Use getAllByTestId and select the first one (CredentialSelector's trigger)
                const triggers = react_1.screen.getAllByTestId('portal-trigger');
                react_1.fireEvent.click(triggers[0]);
                const credential2 = react_1.screen.getByText('Credential 2');
                react_1.fireEvent.click(credential2);
                // Assert
                expect(mockOnChange).toHaveBeenCalledWith('cred-2');
            });
        });
    });
    // ==========================================
    // User Interactions
    // ==========================================
    describe('User Interactions', () => {
        it('should open external link in new tab when clicking documentation link', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert - Link has target="_blank" for new tab
            const link = react_1.screen.getByRole('link');
            expect(link).toHaveAttribute('target', '_blank');
        });
        it('should allow credential selection through CredentialSelector', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange });
            (0, react_1.render)(<header_1.default {...props}/>);
            // Act - Open dropdown (use first trigger which is CredentialSelector's)
            const triggers = react_1.screen.getAllByTestId('portal-trigger');
            react_1.fireEvent.click(triggers[0]);
            // Assert - Dropdown should be open
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
        it('should trigger configuration callback when clicking config icon', () => {
            // Arrange
            const mockOnConfig = vi.fn();
            const props = createDefaultProps({ onClickConfiguration: mockOnConfig });
            const { container } = (0, react_1.render)(<header_1.default {...props}/>);
            // Act
            const configIcon = container.querySelector('.h-4.w-4');
            react_1.fireEvent.click(configIcon);
            // Assert
            expect(mockOnConfig).toHaveBeenCalled();
        });
    });
    // ==========================================
    // Component Memoization
    // ==========================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert
            expect(header_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
        it('should not re-render when props remain the same', () => {
            // Arrange
            const props = createDefaultProps();
            const renderSpy = vi.fn();
            const TrackedHeader = (trackedProps) => {
                renderSpy();
                return <header_1.default {...trackedProps}/>;
            };
            const MemoizedTracked = React.memo(TrackedHeader);
            // Act
            const { rerender } = (0, react_1.render)(<MemoizedTracked {...props}/>);
            rerender(<MemoizedTracked {...props}/>);
            // Assert - Should only render once due to same props
            expect(renderSpy).toHaveBeenCalledTimes(1);
        });
        it('should re-render when docTitle changes', () => {
            // Arrange
            const props = createDefaultProps({ docTitle: 'Original Title' });
            const { rerender } = (0, react_1.render)(<header_1.default {...props}/>);
            // Assert initial
            expect(react_1.screen.getByText('Original Title')).toBeInTheDocument();
            // Act
            rerender(<header_1.default {...props} docTitle="Updated Title"/>);
            // Assert
            expect(react_1.screen.getByText('Updated Title')).toBeInTheDocument();
        });
        it('should re-render when currentCredentialId changes', () => {
            // Arrange
            const props = createDefaultProps({ currentCredentialId: 'cred-1' });
            const { rerender } = (0, react_1.render)(<header_1.default {...props}/>);
            // Assert initial
            expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument();
            // Act
            rerender(<header_1.default {...props} currentCredentialId="cred-2"/>);
            // Assert
            expect(react_1.screen.getByText('Credential 2')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases
    // ==========================================
    describe('Edge Cases', () => {
        it('should handle empty docTitle', () => {
            // Arrange
            const props = createDefaultProps({ docTitle: '' });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert - Should render without crashing
            const link = react_1.screen.getByRole('link');
            expect(link).toBeInTheDocument();
        });
        it('should handle very long docTitle', () => {
            // Arrange
            const longTitle = 'A'.repeat(200);
            const props = createDefaultProps({ docTitle: longTitle });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(longTitle)).toBeInTheDocument();
        });
        it('should handle special characters in docTitle', () => {
            // Arrange
            const specialTitle = 'Docs & Guide <v2> "Special"';
            const props = createDefaultProps({ docTitle: specialTitle });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(specialTitle)).toBeInTheDocument();
        });
        it('should handle empty credentials array', () => {
            // Arrange
            const props = createDefaultProps({
                credentials: [],
                currentCredentialId: '',
            });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert - Should render without crashing
            expect(react_1.screen.getByRole('link')).toBeInTheDocument();
        });
        it('should handle special characters in pluginName', () => {
            // Arrange
            const props = createDefaultProps({ pluginName: 'Plugin & Tool <v1>' });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert - Should render without crashing
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should handle unicode characters in docTitle', () => {
            // Arrange
            const props = createDefaultProps({ docTitle: '文档说明 📚' });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('文档说明 📚')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Styling
    // ==========================================
    describe('Styling', () => {
        it('should apply correct classes to container', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const rootDiv = container.firstChild;
            expect(rootDiv).toHaveClass('flex', 'items-center', 'justify-between', 'gap-x-2');
        });
        it('should apply correct classes to documentation link', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const link = react_1.screen.getByRole('link');
            expect(link).toHaveClass('system-xs-medium', 'text-text-accent');
        });
        it('should apply shrink-0 to documentation link', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const link = react_1.screen.getByRole('link');
            expect(link).toHaveClass('shrink-0');
        });
    });
    // ==========================================
    // Integration Tests
    // ==========================================
    describe('Integration', () => {
        it('should work with full credential workflow', () => {
            // Arrange
            const mockOnCredentialChange = vi.fn();
            const props = createDefaultProps({
                onCredentialChange: mockOnCredentialChange,
                currentCredentialId: 'cred-1',
            });
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert initial state
            expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument();
            // Act - Open dropdown and select different credential
            // Use first trigger which is CredentialSelector's
            const triggers = react_1.screen.getAllByTestId('portal-trigger');
            react_1.fireEvent.click(triggers[0]);
            const credential3 = react_1.screen.getByText('Credential 3');
            react_1.fireEvent.click(credential3);
            // Assert
            expect(mockOnCredentialChange).toHaveBeenCalledWith('cred-3');
        });
        it('should display all components together correctly', () => {
            // Arrange
            const mockOnConfig = vi.fn();
            const props = createDefaultProps({
                docTitle: 'Integration Test Docs',
                docLink: 'https://test.com/docs',
                pluginName: 'TestPlugin',
                onClickConfiguration: mockOnConfig,
            });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert - All main elements present
            expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument(); // CredentialSelector
            expect(react_1.screen.getByRole('button')).toBeInTheDocument(); // Config button
            expect(react_1.screen.getByText('Integration Test Docs')).toBeInTheDocument(); // Doc link
            expect(react_1.screen.getByRole('link')).toHaveAttribute('href', 'https://test.com/docs');
        });
    });
    // ==========================================
    // Accessibility
    // ==========================================
    describe('Accessibility', () => {
        it('should have accessible link', () => {
            // Arrange
            const props = createDefaultProps({ docTitle: 'Accessible Docs' });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const link = react_1.screen.getByRole('link', { name: /Accessible Docs/i });
            expect(link).toBeInTheDocument();
        });
        it('should have accessible button for configuration', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });
        it('should have noopener noreferrer for security on external links', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const link = react_1.screen.getByRole('link');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJoZWFkZXIuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrREFBa0U7QUFDbEUsK0JBQThCO0FBQzlCLHFDQUE2QjtBQUU3Qiw0REFBNEQ7QUFDNUQsSUFBSyxzQkFHSjtBQUhELFdBQUssc0JBQXNCO0lBQ3pCLDJDQUFpQixDQUFBO0lBQ2pCLDZDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFISSxzQkFBc0IsS0FBdEIsc0JBQXNCLFFBRzFCO0FBRUQsNERBQTREO0FBQzVELEVBQUUsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNyRCxrQkFBa0IsRUFBRTtRQUNsQixNQUFNLEVBQUUsUUFBUTtRQUNoQixPQUFPLEVBQUUsU0FBUztLQUNuQjtDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsK0RBQStEO0FBQy9ELEVBQUUsQ0FBQyxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO0lBQzFELE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQU8sRUFBRSxFQUFFO1FBQ3pELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUM3QztRQUFBLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUU7Z0JBQzNDLElBQUksQ0FBQyxLQUFLO29CQUNSLE9BQU8sSUFBSSxDQUFBO2dCQUNiLE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUMxRCxDQUFDLENBQUMsQ0FDSjtNQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtJQUNILENBQUMsQ0FBQTtJQUVELE1BQU0sNkJB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LEdBQUcsRUFBRTtZQUN4RSxVQUFVO1lBQ1YsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtZQUVsQyxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxnQkFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTdCLFNBQVM7WUFDVCxNQUFNLElBQUksR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlQ3JlZGVudGlhbCB9IGZyb20gJ0AvdHlwZXMvcGlwZWxpbmUnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IEhlYWRlciBmcm9tICcuL2hlYWRlcidcblxuLy8gTW9jayBDcmVkZW50aWFsVHlwZUVudW0gdG8gYXZvaWQgZGVlcCBpbXBvcnQgY2hhaW4gaXNzdWVzXG5lbnVtIE1vY2tDcmVkZW50aWFsVHlwZUVudW0ge1xuICBPQVVUSDIgPSAnb2F1dGgyJyxcbiAgQVBJX0tFWSA9ICdhcGlfa2V5Jyxcbn1cblxuLy8gTW9jayBwbHVnaW4tYXV0aCBtb2R1bGUgdG8gYXZvaWQgZGVlcCBpbXBvcnQgY2hhaW4gaXNzdWVzXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvcGx1Z2luLWF1dGgnLCAoKSA9PiAoe1xuICBDcmVkZW50aWFsVHlwZUVudW06IHtcbiAgICBPQVVUSDI6ICdvYXV0aDInLFxuICAgIEFQSV9LRVk6ICdhcGlfa2V5JyxcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHBvcnRhbC10by1mb2xsb3ctZWxlbSAtIHJlcXVpcmVkIGZvciBDcmVkZW50aWFsU2VsZWN0b3JcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nLCAoKSA9PiB7XG4gIGNvbnN0IE1vY2tQb3J0YWxUb0ZvbGxvd0VsZW0gPSAoeyBjaGlsZHJlbiwgb3BlbiB9OiBhbnkpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1yb290XCIgZGF0YS1vcGVuPXtvcGVufT5cbiAgICAgICAge1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgKGNoaWxkOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIWNoaWxkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7IF9fcG9ydGFsT3Blbjogb3BlbiB9KVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IE1vY2tQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyID0gKHsgY2hpbGRyZW4sIG9uQ2xpY2ssIGNsYXNzTmFtZSwgX19wb3J0YWxPcGVuIH06IGFueSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtdHJpZ2dlclwiIG9uQ2xpY2s9e29uQ2xpY2t9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBkYXRhLW9wZW49e19fcG9ydGFsT3Blbn0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gIClcblxuICBjb25zdCBNb2NrUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCA9ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIF9fcG9ydGFsT3BlbiB9OiBhbnkpID0+IHtcbiAgICBpZiAoIV9fcG9ydGFsT3BlbilcbiAgICAgIHJldHVybiBudWxsXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtY29udGVudFwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBQb3J0YWxUb0ZvbGxvd0VsZW06IE1vY2tQb3J0YWxUb0ZvbGxvd0VsZW0sXG4gICAgUG9ydGFsVG9Gb2xsb3dFbGVtVHJpZ2dlcjogTW9ja1BvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXIsXG4gICAgUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudDogTW9ja1BvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQsXG4gIH1cbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEJ1aWxkZXJzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IGNyZWF0ZU1vY2tDcmVkZW50aWFsID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8RGF0YVNvdXJjZUNyZWRlbnRpYWw+KTogRGF0YVNvdXJjZUNyZWRlbnRpYWwgPT4gKHtcbiAgaWQ6ICdjcmVkLTEnLFxuICBuYW1lOiAnVGVzdCBDcmVkZW50aWFsJyxcbiAgYXZhdGFyX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLnBuZycsXG4gIGNyZWRlbnRpYWw6IHsga2V5OiAndmFsdWUnIH0sXG4gIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICB0eXBlOiBNb2NrQ3JlZGVudGlhbFR5cGVFbnVtLk9BVVRIMiBhcyB1bmtub3duIGFzIERhdGFTb3VyY2VDcmVkZW50aWFsWyd0eXBlJ10sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tDcmVkZW50aWFscyA9IChjb3VudDogbnVtYmVyID0gMyk6IERhdGFTb3VyY2VDcmVkZW50aWFsW10gPT5cbiAgQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+XG4gICAgY3JlYXRlTW9ja0NyZWRlbnRpYWwoe1xuICAgICAgaWQ6IGBjcmVkLSR7aSArIDF9YCxcbiAgICAgIG5hbWU6IGBDcmVkZW50aWFsICR7aSArIDF9YCxcbiAgICAgIGF2YXRhcl91cmw6IGBodHRwczovL2V4YW1wbGUuY29tL2F2YXRhci0ke2kgKyAxfS5wbmdgLFxuICAgICAgaXNfZGVmYXVsdDogaSA9PT0gMCxcbiAgICB9KSlcblxudHlwZSBIZWFkZXJQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBIZWFkZXI+XG5cbmNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEhlYWRlclByb3BzPik6IEhlYWRlclByb3BzID0+ICh7XG4gIGRvY1RpdGxlOiAnRG9jdW1lbnRhdGlvbicsXG4gIGRvY0xpbms6ICdodHRwczovL2RvY3MuZXhhbXBsZS5jb20nLFxuICBwbHVnaW5OYW1lOiAnVGVzdCBQbHVnaW4nLFxuICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyxcbiAgb25DcmVkZW50aWFsQ2hhbmdlOiB2aS5mbigpLFxuICBjcmVkZW50aWFsczogY3JlYXRlTW9ja0NyZWRlbnRpYWxzKCksXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmRlc2NyaWJlKCdIZWFkZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEb2N1bWVudGF0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZG9jdW1lbnRhdGlvbiBsaW5rIHdpdGggY29ycmVjdCBhdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBkb2NUaXRsZTogJ0FQSSBEb2NzJyxcbiAgICAgICAgZG9jTGluazogJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tL2RvY3MnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJywgeyBuYW1lOiAvQVBJIERvY3MvaSB9KVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2FwaS5leGFtcGxlLmNvbS9kb2NzJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkb2N1bWVudCB0aXRsZSB3aXRoIHRpdGxlIGF0dHJpYnV0ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jVGl0bGU6ICdNeSBEb2N1bWVudGF0aW9uJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgdGl0bGVTcGFuID0gc2NyZWVuLmdldEJ5VGV4dCgnTXkgRG9jdW1lbnRhdGlvbicpXG4gICAgICBleHBlY3QodGl0bGVTcGFuKS50b0hhdmVBdHRyaWJ1dGUoJ3RpdGxlJywgJ015IERvY3VtZW50YXRpb24nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBDcmVkZW50aWFsU2VsZWN0b3Igd2l0aCBjb3JyZWN0IHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIENyZWRlbnRpYWxTZWxlY3RvciBzaG91bGQgcmVuZGVyIGN1cnJlbnQgY3JlZGVudGlhbCBuYW1lXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29uZmlndXJhdGlvbiBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYm9vayBpY29uIGluIGRvY3VtZW50YXRpb24gbGluaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBSaUJvb2tPcGVuTGluZSByZW5kZXJzIGFzIFNWR1xuICAgICAgY29uc3QgbGluayA9IHNjcmVlbi5nZXRCeVJvbGUoJ2xpbmsnKVxuICAgICAgY29uc3Qgc3ZnID0gbGluay5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgZXhwZWN0KHN2ZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkaXZpZGVyIGJldHdlZW4gY3JlZGVudGlhbCBzZWxlY3RvciBhbmQgY29uZmlndXJhdGlvbiBidXR0b24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIERpdmlkZXIgY29tcG9uZW50IHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgLy8gRGl2aWRlciB0eXBpY2FsbHkgcmVuZGVycyBhcyBhIGRpdiB3aXRoIHNwZWNpZmljIHN0eWxpbmdcbiAgICAgIGNvbnN0IGRpdmlkZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cImRpdmlkZXJcIl0nKSB8fCBjb250YWluZXIucXVlcnlTZWxlY3RvcignLm14LTEuaC0zXFxcXC41JylcbiAgICAgIGV4cGVjdChkaXZpZGVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdkb2NUaXRsZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHRoZSBkb2N1bWVudCB0aXRsZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY1RpdGxlOiAnR2V0dGluZyBTdGFydGVkIEd1aWRlJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnR2V0dGluZyBTdGFydGVkIEd1aWRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0LmVhY2goW1xuICAgICAgICAnUXVpY2sgU3RhcnQnLFxuICAgICAgICAnQVBJIFJlZmVyZW5jZScsXG4gICAgICAgICdDb25maWd1cmF0aW9uIEd1aWRlJyxcbiAgICAgICAgJ1BsdWdpbiBEb2N1bWVudGF0aW9uJyxcbiAgICAgIF0pKCdzaG91bGQgZGlzcGxheSBcIiVzXCIgYXMgZG9jdW1lbnQgdGl0bGUnLCAodGl0bGUpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY1RpdGxlOiB0aXRsZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCh0aXRsZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkb2NMaW5rIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNldCBjb3JyZWN0IGhyZWYgb24gZG9jdW1lbnRhdGlvbiBsaW5rJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jTGluazogJ2h0dHBzOi8vY3VzdG9tLmRvY3MuY29tL2d1aWRlJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBsaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycpXG4gICAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnaHR0cHM6Ly9jdXN0b20uZG9jcy5jb20vZ3VpZGUnKVxuICAgICAgfSlcblxuICAgICAgaXQuZWFjaChbXG4gICAgICAgICdodHRwczovL2RvY3MuZGlmeS5haScsXG4gICAgICAgICdodHRwczovL2V4YW1wbGUuY29tL2FwaScsXG4gICAgICAgICcvbG9jYWwvZG9jcycsXG4gICAgICBdKSgnc2hvdWxkIGFjY2VwdCBcIiVzXCIgYXMgZG9jTGluaycsIChsaW5rKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2NMaW5rOiBsaW5rIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJykpLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsIGxpbmspXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgncGx1Z2luTmFtZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHBsdWdpbk5hbWUgdG8gdHJhbnNsYXRpb24gZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBwbHVnaW5OYW1lOiAnTXlQbHVnaW4nIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gVGhlIHRyYW5zbGF0aW9uIG1vY2sgcmV0dXJucyB0aGUga2V5IHdpdGggb3B0aW9uc1xuICAgICAgICAvLyBUb29sdGlwIHVzZXMgdGhlIHRyYW5zbGF0ZWQgY29udGVudFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvbkNsaWNrQ29uZmlndXJhdGlvbiBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xpY2tDb25maWd1cmF0aW9uIHdoZW4gY29uZmlndXJhdGlvbiBpY29uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQ2xpY2sgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DbGlja0NvbmZpZ3VyYXRpb246IG1vY2tPbkNsaWNrIH0pXG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gRmluZCB0aGUgY29uZmlndXJhdGlvbiBidXR0b24gYW5kIGNsaWNrIHRoZSBpY29uIGluc2lkZVxuICAgICAgICAvLyBUaGUgYnV0dG9uIGNvbnRhaW5zIHRoZSBSaUVxdWFsaXplcjJMaW5lIGljb24gd2l0aCBvbkNsaWNrIGhhbmRsZXJcbiAgICAgICAgY29uc3QgY29uZmlnQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgICAgY29uc3QgY29uZmlnSWNvbiA9IGNvbmZpZ0J1dHRvbi5xdWVyeVNlbGVjdG9yKCdzdmcnKVxuICAgICAgICBleHBlY3QoY29uZmlnSWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlnSWNvbiEpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25DbGljaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBjcmFzaCB3aGVuIG9uQ2xpY2tDb25maWd1cmF0aW9uIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ2xpY2tDb25maWd1cmF0aW9uOiB1bmRlZmluZWQgfSlcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBGaW5kIHRoZSBjb25maWd1cmF0aW9uIGJ1dHRvbiBhbmQgY2xpY2sgdGhlIGljb24gaW5zaWRlXG4gICAgICAgIGNvbnN0IGNvbmZpZ0J1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICAgIGNvbnN0IGNvbmZpZ0ljb24gPSBjb25maWdCdXR0b24ucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgICAgZXhwZWN0KGNvbmZpZ0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpZ0ljb24hKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENvbXBvbmVudCBzaG91bGQgc3RpbGwgYmUgcmVuZGVyZWQgKG5vIGNyYXNoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdDcmVkZW50aWFsU2VsZWN0b3IgcHJvcHMgcGFzc3Rocm91Z2gnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3MgY3VycmVudENyZWRlbnRpYWxJZCB0byBDcmVkZW50aWFsU2VsZWN0b3InLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0yJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBkaXNwbGF5IHRoZSBzZWNvbmQgY3JlZGVudGlhbFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyBjcmVkZW50aWFscyB0byBDcmVkZW50aWFsU2VsZWN0b3InLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgY3VzdG9tQ3JlZGVudGlhbHMgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja0NyZWRlbnRpYWwoeyBpZDogJ2N1c3RvbS0xJywgbmFtZTogJ0N1c3RvbSBDcmVkZW50aWFsJyB9KSxcbiAgICAgICAgXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgY3JlZGVudGlhbHM6IGN1c3RvbUNyZWRlbnRpYWxzLFxuICAgICAgICAgIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjdXN0b20tMScsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b20gQ3JlZGVudGlhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3Mgb25DcmVkZW50aWFsQ2hhbmdlIHRvIENyZWRlbnRpYWxTZWxlY3RvcicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DaGFuZ2UgfSlcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBzZWxlY3QgYSBjcmVkZW50aWFsXG4gICAgICAgIC8vIFVzZSBnZXRBbGxCeVRlc3RJZCBhbmQgc2VsZWN0IHRoZSBmaXJzdCBvbmUgKENyZWRlbnRpYWxTZWxlY3RvcidzIHRyaWdnZXIpXG4gICAgICAgIGNvbnN0IHRyaWdnZXJzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2Vyc1swXSlcbiAgICAgICAgY29uc3QgY3JlZGVudGlhbDIgPSBzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDInKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY3JlZGVudGlhbDIpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjcmVkLTInKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9uc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb3BlbiBleHRlcm5hbCBsaW5rIGluIG5ldyB0YWIgd2hlbiBjbGlja2luZyBkb2N1bWVudGF0aW9uIGxpbmsnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTGluayBoYXMgdGFyZ2V0PVwiX2JsYW5rXCIgZm9yIG5ldyB0YWJcbiAgICAgIGNvbnN0IGxpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IGNyZWRlbnRpYWwgc2VsZWN0aW9uIHRocm91Z2ggQ3JlZGVudGlhbFNlbGVjdG9yJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNoYW5nZSB9KVxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93biAodXNlIGZpcnN0IHRyaWdnZXIgd2hpY2ggaXMgQ3JlZGVudGlhbFNlbGVjdG9yJ3MpXG4gICAgICBjb25zdCB0cmlnZ2VycyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXJzWzBdKVxuXG4gICAgICAvLyBBc3NlcnQgLSBEcm9wZG93biBzaG91bGQgYmUgb3BlblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyaWdnZXIgY29uZmlndXJhdGlvbiBjYWxsYmFjayB3aGVuIGNsaWNraW5nIGNvbmZpZyBpY29uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ29uZmlnID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNsaWNrQ29uZmlndXJhdGlvbjogbW9ja09uQ29uZmlnIH0pXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBjb25maWdJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5oLTQudy00JylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maWdJY29uISlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ29uZmlnKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb25cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KEhlYWRlci4kJHR5cGVvZikudG9CZShTeW1ib2wuZm9yKCdyZWFjdC5tZW1vJykpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlLXJlbmRlciB3aGVuIHByb3BzIHJlbWFpbiB0aGUgc2FtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIGNvbnN0IHJlbmRlclNweSA9IHZpLmZuKClcblxuICAgICAgY29uc3QgVHJhY2tlZEhlYWRlcjogUmVhY3QuRkM8SGVhZGVyUHJvcHM+ID0gKHRyYWNrZWRQcm9wcykgPT4ge1xuICAgICAgICByZW5kZXJTcHkoKVxuICAgICAgICByZXR1cm4gPEhlYWRlciB7Li4udHJhY2tlZFByb3BzfSAvPlxuICAgICAgfVxuICAgICAgY29uc3QgTWVtb2l6ZWRUcmFja2VkID0gUmVhY3QubWVtbyhUcmFja2VkSGVhZGVyKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8TWVtb2l6ZWRUcmFja2VkIHsuLi5wcm9wc30gLz4pXG4gICAgICByZXJlbmRlcig8TWVtb2l6ZWRUcmFja2VkIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBvbmx5IHJlbmRlciBvbmNlIGR1ZSB0byBzYW1lIHByb3BzXG4gICAgICBleHBlY3QocmVuZGVyU3B5KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1yZW5kZXIgd2hlbiBkb2NUaXRsZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2NUaXRsZTogJ09yaWdpbmFsIFRpdGxlJyB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWxcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdPcmlnaW5hbCBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVyZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IGRvY1RpdGxlPVwiVXBkYXRlZCBUaXRsZVwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdVcGRhdGVkIFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1yZW5kZXIgd2hlbiBjdXJyZW50Q3JlZGVudGlhbElkIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLTEnIH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgaW5pdGlhbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NyZWRlbnRpYWwgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVyZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IGN1cnJlbnRDcmVkZW50aWFsSWQ9XCJjcmVkLTJcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkb2NUaXRsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jVGl0bGU6ICcnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBjb25zdCBsaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycpXG4gICAgICBleHBlY3QobGluaykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgZG9jVGl0bGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nVGl0bGUgPSAnQScucmVwZWF0KDIwMClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jVGl0bGU6IGxvbmdUaXRsZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ1RpdGxlKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gZG9jVGl0bGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzcGVjaWFsVGl0bGUgPSAnRG9jcyAmIEd1aWRlIDx2Mj4gXCJTcGVjaWFsXCInXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY1RpdGxlOiBzcGVjaWFsVGl0bGUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxUaXRsZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgY3JlZGVudGlhbHMgYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyZWRlbnRpYWxzOiBbXSxcbiAgICAgICAgY3VycmVudENyZWRlbnRpYWxJZDogJycsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2xpbmsnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gcGx1Z2luTmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luTmFtZTogJ1BsdWdpbiAmIFRvb2wgPHYxPicgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmljb2RlIGNoYXJhY3RlcnMgaW4gZG9jVGl0bGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY1RpdGxlOiAn5paH5qGj6K+05piOIPCfk5onIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgn5paH5qGj6K+05piOIPCfk5onKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFN0eWxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdTdHlsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBjbGFzc2VzIHRvIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCByb290RGl2ID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChyb290RGl2KS50b0hhdmVDbGFzcygnZmxleCcsICdpdGVtcy1jZW50ZXInLCAnanVzdGlmeS1iZXR3ZWVuJywgJ2dhcC14LTInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGNvcnJlY3QgY2xhc3NlcyB0byBkb2N1bWVudGF0aW9uIGxpbmsnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBsaW5rID0gc2NyZWVuLmdldEJ5Um9sZSgnbGluaycpXG4gICAgICBleHBlY3QobGluaykudG9IYXZlQ2xhc3MoJ3N5c3RlbS14cy1tZWRpdW0nLCAndGV4dC10ZXh0LWFjY2VudCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgc2hyaW5rLTAgdG8gZG9jdW1lbnRhdGlvbiBsaW5rJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGluayA9IHNjcmVlbi5nZXRCeVJvbGUoJ2xpbmsnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUNsYXNzKCdzaHJpbmstMCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aCBmdWxsIGNyZWRlbnRpYWwgd29ya2Zsb3cnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DcmVkZW50aWFsQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNyZWRlbnRpYWxDaGFuZ2UsXG4gICAgICAgIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLTEnLFxuICAgICAgfSlcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCBpbml0aWFsIHN0YXRlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gT3BlbiBkcm9wZG93biBhbmQgc2VsZWN0IGRpZmZlcmVudCBjcmVkZW50aWFsXG4gICAgICAvLyBVc2UgZmlyc3QgdHJpZ2dlciB3aGljaCBpcyBDcmVkZW50aWFsU2VsZWN0b3Inc1xuICAgICAgY29uc3QgdHJpZ2dlcnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2Vyc1swXSlcblxuICAgICAgY29uc3QgY3JlZGVudGlhbDMgPSBzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDMnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNyZWRlbnRpYWwzKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DcmVkZW50aWFsQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY3JlZC0zJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGFsbCBjb21wb25lbnRzIHRvZ2V0aGVyIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNvbmZpZyA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgZG9jVGl0bGU6ICdJbnRlZ3JhdGlvbiBUZXN0IERvY3MnLFxuICAgICAgICBkb2NMaW5rOiAnaHR0cHM6Ly90ZXN0LmNvbS9kb2NzJyxcbiAgICAgICAgcGx1Z2luTmFtZTogJ1Rlc3RQbHVnaW4nLFxuICAgICAgICBvbkNsaWNrQ29uZmlndXJhdGlvbjogbW9ja09uQ29uZmlnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBBbGwgbWFpbiBlbGVtZW50cyBwcmVzZW50XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAxJykpLnRvQmVJblRoZURvY3VtZW50KCkgLy8gQ3JlZGVudGlhbFNlbGVjdG9yXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KCkgLy8gQ29uZmlnIGJ1dHRvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0ludGVncmF0aW9uIFRlc3QgRG9jcycpKS50b0JlSW5UaGVEb2N1bWVudCgpIC8vIERvYyBsaW5rXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnbGluaycpKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnaHR0cHM6Ly90ZXN0LmNvbS9kb2NzJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBY2Nlc3NpYmlsaXR5XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYWNjZXNzaWJsZSBsaW5rJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2NUaXRsZTogJ0FjY2Vzc2libGUgRG9jcycgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJywgeyBuYW1lOiAvQWNjZXNzaWJsZSBEb2NzL2kgfSlcbiAgICAgIGV4cGVjdChsaW5rKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBhY2Nlc3NpYmxlIGJ1dHRvbiBmb3IgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoYnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBub29wZW5lciBub3JlZmVycmVyIGZvciBzZWN1cml0eSBvbiBleHRlcm5hbCBsaW5rcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGxpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3JlbCcsICdub29wZW5lciBub3JlZmVycmVyJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==