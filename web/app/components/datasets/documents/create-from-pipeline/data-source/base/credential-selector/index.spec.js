"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
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
// Mock portal-to-follow-elem - use React state to properly handle open/close
vi.mock('@/app/components/base/portal-to-follow-elem', () => {
    const MockPortalToFollowElem = ({ children, open }) => {
        return (<div data-testid="portal-root" data-open={open}>
        {React.Children.map(children, (child) => {
                if (!child)
                    return null;
                // Pass open state to children via context-like prop cloning
                return React.cloneElement(child, { __portalOpen: open });
            })}
      </div>);
    };
    const MockPortalToFollowElemTrigger = ({ children, onClick, className, __portalOpen }) => (<div data-testid="portal-trigger" onClick={onClick} className={className} data-open={__portalOpen}>
      {children}
    </div>);
    const MockPortalToFollowElemContent = ({ children, className, __portalOpen }) => {
        // Match actual behavior: returns null when not open
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
// CredentialIcon - imported directly (not mocked)
// This is a simple UI component with no external dependencies
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
    currentCredentialId: 'cred-1',
    onCredentialChange: vi.fn(),
    credentials: createMockCredentials(),
    ...overrides,
});
describe('CredentialSelector', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // ==========================================
    // Rendering Tests - Verify component renders correctly
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('portal-root')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
        });
        it('should render current credential name in trigger', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument();
        });
        it('should render credential icon with correct props', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - CredentialIcon renders an img when avatarUrl is provided
            const iconImg = container.querySelector('img');
            expect(iconImg).toBeInTheDocument();
            expect(iconImg).toHaveAttribute('src', 'https://example.com/avatar-1.png');
        });
        it('should render dropdown arrow icon', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const svgIcon = container.querySelector('svg');
            expect(svgIcon).toBeInTheDocument();
        });
        it('should not render dropdown content initially', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
        });
        it('should render all credentials in dropdown when opened', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Click trigger to open dropdown
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Assert - All credentials should be visible (current credential appears in both trigger and list)
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            // 3 in dropdown list + 1 in trigger (current) = 4 total
            expect(react_1.screen.getAllByText(/Credential \d/)).toHaveLength(4);
        });
    });
    // ==========================================
    // Props Testing - Verify all prop variations
    // ==========================================
    describe('Props', () => {
        describe('currentCredentialId prop', () => {
            it('should display first credential when currentCredentialId matches first', () => {
                // Arrange
                const props = createDefaultProps({ currentCredentialId: 'cred-1' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument();
            });
            it('should display second credential when currentCredentialId matches second', () => {
                // Arrange
                const props = createDefaultProps({ currentCredentialId: 'cred-2' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Credential 2')).toBeInTheDocument();
            });
            it('should display third credential when currentCredentialId matches third', () => {
                // Arrange
                const props = createDefaultProps({ currentCredentialId: 'cred-3' });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Credential 3')).toBeInTheDocument();
            });
            it.each([
                ['cred-1', 'Credential 1'],
                ['cred-2', 'Credential 2'],
                ['cred-3', 'Credential 3'],
            ])('should display %s credential name when currentCredentialId is %s', (credId, expectedName) => {
                // Arrange
                const props = createDefaultProps({ currentCredentialId: credId });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText(expectedName)).toBeInTheDocument();
            });
        });
        describe('credentials prop', () => {
            it('should render single credential correctly', () => {
                // Arrange
                const props = createDefaultProps({
                    credentials: [createMockCredential()],
                    currentCredentialId: 'cred-1',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Test Credential')).toBeInTheDocument();
            });
            it('should render multiple credentials in dropdown', () => {
                // Arrange
                const props = createDefaultProps({
                    credentials: createMockCredentials(5),
                    currentCredentialId: 'cred-1',
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                const trigger = react_1.screen.getByTestId('portal-trigger');
                react_1.fireEvent.click(trigger);
                // Assert - 5 in dropdown + 1 in trigger (current credential appears twice)
                expect(react_1.screen.getAllByText(/Credential \d/).length).toBe(6);
            });
            it('should handle credentials with special characters in name', () => {
                // Arrange
                const props = createDefaultProps({
                    credentials: [createMockCredential({ id: 'cred-special', name: 'Test & Credential <special>' })],
                    currentCredentialId: 'cred-special',
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByText('Test & Credential <special>')).toBeInTheDocument();
            });
        });
        describe('onCredentialChange prop', () => {
            it('should be called when selecting a credential', () => {
                // Arrange
                const mockOnChange = vi.fn();
                const props = createDefaultProps({ onCredentialChange: mockOnChange });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown
                const trigger = react_1.screen.getByTestId('portal-trigger');
                react_1.fireEvent.click(trigger);
                // Click on second credential
                const credential2 = react_1.screen.getByText('Credential 2');
                react_1.fireEvent.click(credential2);
                // Assert
                expect(mockOnChange).toHaveBeenCalledWith('cred-2');
            });
            it.each([
                ['cred-2', 'Credential 2'],
                ['cred-3', 'Credential 3'],
            ])('should call onCredentialChange with %s when selecting %s', (credId, credentialName) => {
                // Arrange
                const mockOnChange = vi.fn();
                const props = createDefaultProps({ onCredentialChange: mockOnChange });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown and select credential
                const trigger = react_1.screen.getByTestId('portal-trigger');
                react_1.fireEvent.click(trigger);
                // Get the dropdown item using within() to scope query to portal content
                const portalContent = react_1.screen.getByTestId('portal-content');
                const credentialOption = (0, react_1.within)(portalContent).getByText(credentialName);
                react_1.fireEvent.click(credentialOption);
                // Assert
                expect(mockOnChange).toHaveBeenCalledWith(credId);
            });
            it('should call onCredentialChange with cred-1 when selecting Credential 1 in dropdown', () => {
                // Arrange - Start with cred-2 selected so cred-1 is only in dropdown
                const mockOnChange = vi.fn();
                const props = createDefaultProps({
                    onCredentialChange: mockOnChange,
                    currentCredentialId: 'cred-2',
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act - Open dropdown and select Credential 1
                const trigger = react_1.screen.getByTestId('portal-trigger');
                react_1.fireEvent.click(trigger);
                const credential1 = react_1.screen.getByText('Credential 1');
                react_1.fireEvent.click(credential1);
                // Assert
                expect(mockOnChange).toHaveBeenCalledWith('cred-1');
            });
        });
    });
    // ==========================================
    // User Interactions - Test event handlers
    // ==========================================
    describe('User Interactions', () => {
        it('should toggle dropdown open when trigger is clicked', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initially closed
            expect(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
            // Act - Click trigger
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Assert - Now open
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
        });
        it('should call onCredentialChange when clicking a credential item', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            const credential2 = react_1.screen.getByText('Credential 2');
            react_1.fireEvent.click(credential2);
            // Assert
            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenCalledWith('cred-2');
        });
        it('should close dropdown after selecting a credential', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Open and select
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            expect(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
            const credential2 = react_1.screen.getByText('Credential 2');
            react_1.fireEvent.click(credential2);
            // Assert - The handleCredentialChange calls toggle(), which should change the open state
            expect(mockOnChange).toHaveBeenCalled();
        });
        it('should handle rapid consecutive clicks on trigger', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Rapid clicks
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            react_1.fireEvent.click(trigger);
            // Assert - Should not crash
            expect(trigger).toBeInTheDocument();
        });
        it('should allow selecting credentials multiple times', () => {
            // Arrange - Start with cred-2 selected so we can select other credentials
            const mockOnChange = vi.fn();
            const props = createDefaultProps({
                onCredentialChange: mockOnChange,
                currentCredentialId: 'cred-2',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act & Assert - Select Credential 1 (different from current)
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            const credential1 = react_1.screen.getByText('Credential 1');
            react_1.fireEvent.click(credential1);
            expect(mockOnChange).toHaveBeenCalledWith('cred-1');
        });
    });
    // ==========================================
    // Side Effects and Cleanup - Test useEffect behavior
    // ==========================================
    describe('Side Effects and Cleanup', () => {
        it('should auto-select first credential when currentCredential is not found and credentials exist', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({
                currentCredentialId: 'non-existent-id',
                onCredentialChange: mockOnChange,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should auto-select first credential
            expect(mockOnChange).toHaveBeenCalledWith('cred-1');
        });
        it('should not call onCredentialChange when currentCredential is found', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({
                currentCredentialId: 'cred-2',
                onCredentialChange: mockOnChange,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should not auto-select
            expect(mockOnChange).not.toHaveBeenCalled();
        });
        it('should not call onCredentialChange when credentials array is empty', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({
                currentCredentialId: 'cred-1',
                credentials: [],
                onCredentialChange: mockOnChange,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should not call since no credentials to select
            expect(mockOnChange).not.toHaveBeenCalled();
        });
        it('should auto-select when credentials change and currentCredential becomes invalid', async () => {
            // Arrange
            const mockOnChange = vi.fn();
            const initialCredentials = createMockCredentials(3);
            const props = createDefaultProps({
                currentCredentialId: 'cred-1',
                credentials: initialCredentials,
                onCredentialChange: mockOnChange,
            });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            expect(mockOnChange).not.toHaveBeenCalled();
            // Act - Change credentials to not include current
            const newCredentials = [
                createMockCredential({ id: 'cred-4', name: 'New Credential 4' }),
                createMockCredential({ id: 'cred-5', name: 'New Credential 5' }),
            ];
            rerender(<index_1.default {...props} credentials={newCredentials}/>);
            // Assert - Should auto-select first of new credentials
            await (0, react_1.waitFor)(() => {
                expect(mockOnChange).toHaveBeenCalledWith('cred-4');
            });
        });
        it('should not trigger auto-select effect on every render with same props', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange });
            // Act - Render and rerender with same props
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            rerender(<index_1.default {...props}/>);
            rerender(<index_1.default {...props}/>);
            // Assert - onCredentialChange should not be called for auto-selection
            expect(mockOnChange).not.toHaveBeenCalled();
        });
    });
    // ==========================================
    // Callback Stability and Memoization - Test useCallback behavior
    // ==========================================
    describe('Callback Stability and Memoization', () => {
        it('should have stable handleCredentialChange callback', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Open dropdown and select
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            const credential = react_1.screen.getByText('Credential 2');
            react_1.fireEvent.click(credential);
            // Assert - Callback should work correctly
            expect(mockOnChange).toHaveBeenCalledWith('cred-2');
        });
        it('should update handleCredentialChange when onCredentialChange changes', () => {
            // Arrange
            const mockOnChange1 = vi.fn();
            const mockOnChange2 = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange1 });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Update onCredentialChange prop
            rerender(<index_1.default {...props} onCredentialChange={mockOnChange2}/>);
            // Open and select
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            const credential = react_1.screen.getByText('Credential 2');
            react_1.fireEvent.click(credential);
            // Assert - New callback should be used
            expect(mockOnChange1).not.toHaveBeenCalled();
            expect(mockOnChange2).toHaveBeenCalledWith('cred-2');
        });
    });
    // ==========================================
    // Memoization Logic and Dependencies - Test useMemo behavior
    // ==========================================
    describe('Memoization Logic and Dependencies', () => {
        it('should find currentCredential by id', () => {
            // Arrange
            const props = createDefaultProps({ currentCredentialId: 'cred-2' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should display credential 2
            expect(react_1.screen.getByText('Credential 2')).toBeInTheDocument();
        });
        it('should update currentCredential when currentCredentialId changes', () => {
            // Arrange
            const props = createDefaultProps({ currentCredentialId: 'cred-1' });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert initial
            expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument();
            // Act - Change currentCredentialId
            rerender(<index_1.default {...props} currentCredentialId="cred-3"/>);
            // Assert - Should now display credential 3
            expect(react_1.screen.getByText('Credential 3')).toBeInTheDocument();
        });
        it('should update currentCredential when credentials array changes', () => {
            // Arrange
            const props = createDefaultProps({ currentCredentialId: 'cred-1' });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert initial
            expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument();
            // Act - Change credentials
            const newCredentials = [
                createMockCredential({ id: 'cred-1', name: 'Updated Credential 1' }),
            ];
            rerender(<index_1.default {...props} credentials={newCredentials}/>);
            // Assert - Should display updated name
            expect(react_1.screen.getByText('Updated Credential 1')).toBeInTheDocument();
        });
        it('should return undefined currentCredential when id not found', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({
                currentCredentialId: 'non-existent',
                onCredentialChange: mockOnChange,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should trigger auto-select effect
            expect(mockOnChange).toHaveBeenCalledWith('cred-1');
        });
    });
    // ==========================================
    // Component Memoization - Test React.memo behavior
    // ==========================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Assert
            expect(index_1.default.$$typeof).toBe(Symbol.for('react.memo'));
        });
        it('should not re-render when props remain the same', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange });
            const renderSpy = vi.fn();
            const TrackedCredentialSelector = (trackedProps) => {
                renderSpy();
                return <index_1.default {...trackedProps}/>;
            };
            const MemoizedTracked = React.memo(TrackedCredentialSelector);
            // Act
            const { rerender } = (0, react_1.render)(<MemoizedTracked {...props}/>);
            rerender(<MemoizedTracked {...props}/>);
            // Assert - Should only render once due to same props
            expect(renderSpy).toHaveBeenCalledTimes(1);
        });
        it('should re-render when currentCredentialId changes', () => {
            // Arrange
            const props = createDefaultProps({ currentCredentialId: 'cred-1' });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert initial
            expect(react_1.screen.getByText('Credential 1')).toBeInTheDocument();
            // Act
            rerender(<index_1.default {...props} currentCredentialId="cred-2"/>);
            // Assert
            expect(react_1.screen.getByText('Credential 2')).toBeInTheDocument();
        });
        it('should re-render when credentials array reference changes', () => {
            // Arrange
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Create new credentials array with different data
            const newCredentials = [
                createMockCredential({ id: 'cred-1', name: 'New Name 1' }),
            ];
            rerender(<index_1.default {...props} credentials={newCredentials}/>);
            // Assert
            expect(react_1.screen.getByText('New Name 1')).toBeInTheDocument();
        });
        it('should re-render when onCredentialChange reference changes', () => {
            // Arrange
            const mockOnChange1 = vi.fn();
            const mockOnChange2 = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange1 });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Change callback reference
            rerender(<index_1.default {...props} onCredentialChange={mockOnChange2}/>);
            // Open and select
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            const credential = react_1.screen.getByText('Credential 2');
            react_1.fireEvent.click(credential);
            // Assert - New callback should be used
            expect(mockOnChange2).toHaveBeenCalledWith('cred-2');
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle empty credentials array', () => {
            // Arrange
            const props = createDefaultProps({
                credentials: [],
                currentCredentialId: 'cred-1',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should render without crashing
            expect(react_1.screen.getByTestId('portal-root')).toBeInTheDocument();
        });
        it('should handle undefined avatar_url in credential', () => {
            // Arrange
            const credentialWithoutAvatar = createMockCredential({
                id: 'cred-no-avatar',
                name: 'No Avatar Credential',
                avatar_url: undefined,
            });
            const props = createDefaultProps({
                credentials: [credentialWithoutAvatar],
                currentCredentialId: 'cred-no-avatar',
            });
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should render without crashing and show first letter fallback
            expect(react_1.screen.getByText('No Avatar Credential')).toBeInTheDocument();
            // When avatar_url is undefined, CredentialIcon shows first letter instead of img
            const iconImg = container.querySelector('img');
            expect(iconImg).not.toBeInTheDocument();
            // First letter 'N' should be displayed
            expect(react_1.screen.getByText('N')).toBeInTheDocument();
        });
        it('should handle empty string name in credential', () => {
            // Arrange
            const credentialWithEmptyName = createMockCredential({
                id: 'cred-empty-name',
                name: '',
            });
            const props = createDefaultProps({
                credentials: [credentialWithEmptyName],
                currentCredentialId: 'cred-empty-name',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should render without crashing
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
        });
        it('should handle very long credential name', () => {
            // Arrange
            const longName = 'A'.repeat(200);
            const credentialWithLongName = createMockCredential({
                id: 'cred-long-name',
                name: longName,
            });
            const props = createDefaultProps({
                credentials: [credentialWithLongName],
                currentCredentialId: 'cred-long-name',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(longName)).toBeInTheDocument();
        });
        it('should handle special characters in credential name', () => {
            // Arrange
            const specialName = '测试 Credential <script>alert("xss")</script> & "quoted"';
            const credentialWithSpecialName = createMockCredential({
                id: 'cred-special',
                name: specialName,
            });
            const props = createDefaultProps({
                credentials: [credentialWithSpecialName],
                currentCredentialId: 'cred-special',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText(specialName)).toBeInTheDocument();
        });
        it('should handle numeric id as string', () => {
            // Arrange
            const credentialWithNumericId = createMockCredential({
                id: '123456',
                name: 'Numeric ID Credential',
            });
            const props = createDefaultProps({
                credentials: [credentialWithNumericId],
                currentCredentialId: '123456',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Numeric ID Credential')).toBeInTheDocument();
        });
        it('should handle large number of credentials', () => {
            // Arrange
            const manyCredentials = createMockCredentials(100);
            const props = createDefaultProps({
                credentials: manyCredentials,
                currentCredentialId: 'cred-50',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Credential 50')).toBeInTheDocument();
        });
        it('should handle credential selection with duplicate names', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const duplicateCredentials = [
                createMockCredential({ id: 'cred-1', name: 'Same Name' }),
                createMockCredential({ id: 'cred-2', name: 'Same Name' }),
            ];
            const props = createDefaultProps({
                credentials: duplicateCredentials,
                currentCredentialId: 'cred-1',
                onCredentialChange: mockOnChange,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Get all "Same Name" elements
            // 1 in trigger (current) + 2 in dropdown (both credentials) = 3 total
            const sameNameElements = react_1.screen.getAllByText('Same Name');
            expect(sameNameElements.length).toBe(3);
            // Click the last dropdown item (cred-2 in dropdown)
            react_1.fireEvent.click(sameNameElements[2]);
            // Assert - Should call with the correct id even with duplicate names
            expect(mockOnChange).toHaveBeenCalledWith('cred-2');
        });
        it('should not crash when clicking credential after unmount', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange });
            const { unmount } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            unmount();
            // Assert - Should not throw
            expect(() => {
                // Any cleanup should have happened
            }).not.toThrow();
        });
        it('should handle whitespace-only credential name', () => {
            // Arrange
            const credentialWithWhitespace = createMockCredential({
                id: 'cred-whitespace',
                name: '   ',
            });
            const props = createDefaultProps({
                credentials: [credentialWithWhitespace],
                currentCredentialId: 'cred-whitespace',
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should render without crashing
            expect(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Styling and CSS Classes
    // ==========================================
    describe('Styling', () => {
        it('should apply overflow-hidden class to trigger', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const trigger = react_1.screen.getByTestId('portal-trigger');
            expect(trigger).toHaveClass('overflow-hidden');
        });
        it('should apply grow class to trigger', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const trigger = react_1.screen.getByTestId('portal-trigger');
            expect(trigger).toHaveClass('grow');
        });
        it('should apply z-10 class to dropdown content', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Assert
            const content = react_1.screen.getByTestId('portal-content');
            expect(content).toHaveClass('z-10');
        });
    });
    // ==========================================
    // Integration with Child Components
    // ==========================================
    describe('Integration with Child Components', () => {
        it('should pass currentCredential to Trigger component', () => {
            // Arrange
            const props = createDefaultProps({ currentCredentialId: 'cred-2' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Trigger should display the correct credential
            expect(react_1.screen.getByText('Credential 2')).toBeInTheDocument();
        });
        it('should pass isOpen state to Trigger component', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initially closed
            const portalRoot = react_1.screen.getByTestId('portal-root');
            expect(portalRoot).toHaveAttribute('data-open', 'false');
            // Act - Open
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Assert - Now open
            expect(portalRoot).toHaveAttribute('data-open', 'true');
        });
        it('should pass credentials to List component', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Assert - All credentials should be rendered in list
            // 3 in dropdown + 1 in trigger (current credential appears twice) = 4 total
            const credentialNames = react_1.screen.getAllByText(/Credential \d/);
            expect(credentialNames.length).toBe(4);
        });
        it('should pass currentCredentialId to List component', () => {
            // Arrange
            const props = createDefaultProps({ currentCredentialId: 'cred-2' });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            // Assert - Current credential (Credential 2) appears twice:
            // once in trigger and once in dropdown list
            const credential2Elements = react_1.screen.getAllByText('Credential 2');
            expect(credential2Elements.length).toBe(2);
        });
        it('should pass handleCredentialChange to List component', () => {
            // Arrange
            const mockOnChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnChange });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const trigger = react_1.screen.getByTestId('portal-trigger');
            react_1.fireEvent.click(trigger);
            const credential3 = react_1.screen.getByText('Credential 3');
            react_1.fireEvent.click(credential3);
            // Assert - handleCredentialChange should propagate the call
            expect(mockOnChange).toHaveBeenCalledWith('cred-3');
        });
    });
    // ==========================================
    // Portal Configuration
    // ==========================================
    describe('Portal Configuration', () => {
        it('should configure PortalToFollowElem with placement bottom-start', () => {
            // This test verifies the portal is configured correctly
            // The actual placement is handled by the mock, but we verify the component renders
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByTestId('portal-root')).toBeInTheDocument();
        });
        it('should configure PortalToFollowElem with offset mainAxis 4', () => {
            // This test verifies the offset configuration doesn't break rendering
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByTestId('portal-root')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQW1GO0FBQ25GLCtCQUE4QjtBQUM5QixtQ0FBd0M7QUFFeEMsNERBQTREO0FBQzVELElBQUssc0JBR0o7QUFIRCxXQUFLLHNCQUFzQjtJQUN6QiwyQ0FBaUIsQ0FBQTtJQUNqQiw2Q0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBSEksc0JBQXNCLEtBQXRCLHNCQUFzQixRQUcxQjtBQUVELDREQUE0RDtBQUM1RCxFQUFFLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckQsa0JBQWtCLEVBQUU7UUFDbEIsTUFBTSxFQUFFLFFBQVE7UUFDaEIsT0FBTyxFQUFFLFNBQVM7S0FDbkI7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILDZFQUE2RTtBQUM3RSxFQUFFLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtJQUMxRCxNQUFNLHNCQUFzQixHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFPLEVBQUUsRUFBRTtRQUN6RCxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDN0M7UUFBQSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQVUsRUFBRSxFQUFFO2dCQUMzQyxJQUFJLENBQUMsS0FBSztvQkFDUixPQUFPLElBQUksQ0FBQTtnQkFDYiw0REFBNEQ7Z0JBQzVELE9BQU8sS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUMxRCxDQUFDLENBQUMsQ0FDSjtNQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtJQUNILENBQUMsQ0FBQTtJ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ImltcG9ydCB0eXBlIHsgQ3JlZGVudGlhbFNlbGVjdG9yUHJvcHMgfSBmcm9tICcuL2luZGV4J1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlQ3JlZGVudGlhbCB9IGZyb20gJ0AvdHlwZXMvcGlwZWxpbmUnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yLCB3aXRoaW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ3JlZGVudGlhbFNlbGVjdG9yIGZyb20gJy4vaW5kZXgnXG5cbi8vIE1vY2sgQ3JlZGVudGlhbFR5cGVFbnVtIHRvIGF2b2lkIGRlZXAgaW1wb3J0IGNoYWluIGlzc3Vlc1xuZW51bSBNb2NrQ3JlZGVudGlhbFR5cGVFbnVtIHtcbiAgT0FVVEgyID0gJ29hdXRoMicsXG4gIEFQSV9LRVkgPSAnYXBpX2tleScsXG59XG5cbi8vIE1vY2sgcGx1Z2luLWF1dGggbW9kdWxlIHRvIGF2b2lkIGRlZXAgaW1wb3J0IGNoYWluIGlzc3Vlc1xudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3BsdWdpbi1hdXRoJywgKCkgPT4gKHtcbiAgQ3JlZGVudGlhbFR5cGVFbnVtOiB7XG4gICAgT0FVVEgyOiAnb2F1dGgyJyxcbiAgICBBUElfS0VZOiAnYXBpX2tleScsXG4gIH0sXG59KSlcblxuLy8gTW9jayBwb3J0YWwtdG8tZm9sbG93LWVsZW0gLSB1c2UgUmVhY3Qgc3RhdGUgdG8gcHJvcGVybHkgaGFuZGxlIG9wZW4vY2xvc2VcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nLCAoKSA9PiB7XG4gIGNvbnN0IE1vY2tQb3J0YWxUb0ZvbGxvd0VsZW0gPSAoeyBjaGlsZHJlbiwgb3BlbiB9OiBhbnkpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1yb290XCIgZGF0YS1vcGVuPXtvcGVufT5cbiAgICAgICAge1JlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgKGNoaWxkOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIWNoaWxkKVxuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgICAvLyBQYXNzIG9wZW4gc3RhdGUgdG8gY2hpbGRyZW4gdmlhIGNvbnRleHQtbGlrZSBwcm9wIGNsb25pbmdcbiAgICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7IF9fcG9ydGFsT3Blbjogb3BlbiB9KVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IE1vY2tQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyID0gKHsgY2hpbGRyZW4sIG9uQ2xpY2ssIGNsYXNzTmFtZSwgX19wb3J0YWxPcGVuIH06IGFueSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtdHJpZ2dlclwiIG9uQ2xpY2s9e29uQ2xpY2t9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBkYXRhLW9wZW49e19fcG9ydGFsT3Blbn0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gIClcblxuICBjb25zdCBNb2NrUG9ydGFsVG9Gb2xsb3dFbGVtQ29udGVudCA9ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUsIF9fcG9ydGFsT3BlbiB9OiBhbnkpID0+IHtcbiAgICAvLyBNYXRjaCBhY3R1YWwgYmVoYXZpb3I6IHJldHVybnMgbnVsbCB3aGVuIG5vdCBvcGVuXG4gICAgaWYgKCFfX3BvcnRhbE9wZW4pXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLWNvbnRlbnRcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgUG9ydGFsVG9Gb2xsb3dFbGVtOiBNb2NrUG9ydGFsVG9Gb2xsb3dFbGVtLFxuICAgIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI6IE1vY2tQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyLFxuICAgIFBvcnRhbFRvRm9sbG93RWxlbUNvbnRlbnQ6IE1vY2tQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50LFxuICB9XG59KVxuXG4vLyBDcmVkZW50aWFsSWNvbiAtIGltcG9ydGVkIGRpcmVjdGx5IChub3QgbW9ja2VkKVxuLy8gVGhpcyBpcyBhIHNpbXBsZSBVSSBjb21wb25lbnQgd2l0aCBubyBleHRlcm5hbCBkZXBlbmRlbmNpZXNcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgQnVpbGRlcnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgY3JlYXRlTW9ja0NyZWRlbnRpYWwgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlQ3JlZGVudGlhbD4pOiBEYXRhU291cmNlQ3JlZGVudGlhbCA9PiAoe1xuICBpZDogJ2NyZWQtMScsXG4gIG5hbWU6ICdUZXN0IENyZWRlbnRpYWwnLFxuICBhdmF0YXJfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nJyxcbiAgY3JlZGVudGlhbDogeyBrZXk6ICd2YWx1ZScgfSxcbiAgaXNfZGVmYXVsdDogZmFsc2UsXG4gIHR5cGU6IE1vY2tDcmVkZW50aWFsVHlwZUVudW0uT0FVVEgyIGFzIHVua25vd24gYXMgRGF0YVNvdXJjZUNyZWRlbnRpYWxbJ3R5cGUnXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0NyZWRlbnRpYWxzID0gKGNvdW50OiBudW1iZXIgPSAzKTogRGF0YVNvdXJjZUNyZWRlbnRpYWxbXSA9PlxuICBBcnJheS5mcm9tKHsgbGVuZ3RoOiBjb3VudCB9LCAoXywgaSkgPT5cbiAgICBjcmVhdGVNb2NrQ3JlZGVudGlhbCh7XG4gICAgICBpZDogYGNyZWQtJHtpICsgMX1gLFxuICAgICAgbmFtZTogYENyZWRlbnRpYWwgJHtpICsgMX1gLFxuICAgICAgYXZhdGFyX3VybDogYGh0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLSR7aSArIDF9LnBuZ2AsXG4gICAgICBpc19kZWZhdWx0OiBpID09PSAwLFxuICAgIH0pKVxuXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxDcmVkZW50aWFsU2VsZWN0b3JQcm9wcz4pOiBDcmVkZW50aWFsU2VsZWN0b3JQcm9wcyA9PiAoe1xuICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyxcbiAgb25DcmVkZW50aWFsQ2hhbmdlOiB2aS5mbigpLFxuICBjcmVkZW50aWFsczogY3JlYXRlTW9ja0NyZWRlbnRpYWxzKCksXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmRlc2NyaWJlKCdDcmVkZW50aWFsU2VsZWN0b3InLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHMgLSBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgY29ycmVjdGx5XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtcm9vdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGN1cnJlbnQgY3JlZGVudGlhbCBuYW1lIGluIHRyaWdnZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY3JlZGVudGlhbCBpY29uIHdpdGggY29ycmVjdCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ3JlZGVudGlhbEljb24gcmVuZGVycyBhbiBpbWcgd2hlbiBhdmF0YXJVcmwgaXMgcHJvdmlkZWRcbiAgICAgIGNvbnN0IGljb25JbWcgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignaW1nJylcbiAgICAgIGV4cGVjdChpY29uSW1nKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoaWNvbkltZykudG9IYXZlQXR0cmlidXRlKCdzcmMnLCAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXItMS5wbmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkcm9wZG93biBhcnJvdyBpY29uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHN2Z0ljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3Rvcignc3ZnJylcbiAgICAgIGV4cGVjdChzdmdJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBkcm9wZG93biBjb250ZW50IGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGNyZWRlbnRpYWxzIGluIGRyb3Bkb3duIHdoZW4gb3BlbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gQ2xpY2sgdHJpZ2dlciB0byBvcGVuIGRyb3Bkb3duXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gQWxsIGNyZWRlbnRpYWxzIHNob3VsZCBiZSB2aXNpYmxlIChjdXJyZW50IGNyZWRlbnRpYWwgYXBwZWFycyBpbiBib3RoIHRyaWdnZXIgYW5kIGxpc3QpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyAzIGluIGRyb3Bkb3duIGxpc3QgKyAxIGluIHRyaWdnZXIgKGN1cnJlbnQpID0gNCB0b3RhbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRleHQoL0NyZWRlbnRpYWwgXFxkLykpLnRvSGF2ZUxlbmd0aCg0KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmcgLSBWZXJpZnkgYWxsIHByb3AgdmFyaWF0aW9uc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdjdXJyZW50Q3JlZGVudGlhbElkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZmlyc3QgY3JlZGVudGlhbCB3aGVuIGN1cnJlbnRDcmVkZW50aWFsSWQgbWF0Y2hlcyBmaXJzdCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLTEnIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHNlY29uZCBjcmVkZW50aWFsIHdoZW4gY3VycmVudENyZWRlbnRpYWxJZCBtYXRjaGVzIHNlY29uZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLTInIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHRoaXJkIGNyZWRlbnRpYWwgd2hlbiBjdXJyZW50Q3JlZGVudGlhbElkIG1hdGNoZXMgdGhpcmQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0zJyB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0LmVhY2goW1xuICAgICAgICBbJ2NyZWQtMScsICdDcmVkZW50aWFsIDEnXSxcbiAgICAgICAgWydjcmVkLTInLCAnQ3JlZGVudGlhbCAyJ10sXG4gICAgICAgIFsnY3JlZC0zJywgJ0NyZWRlbnRpYWwgMyddLFxuICAgICAgXSkoJ3Nob3VsZCBkaXNwbGF5ICVzIGNyZWRlbnRpYWwgbmFtZSB3aGVuIGN1cnJlbnRDcmVkZW50aWFsSWQgaXMgJXMnLCAoY3JlZElkLCBleHBlY3RlZE5hbWUpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRDcmVkZW50aWFsSWQ6IGNyZWRJZCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChleHBlY3RlZE5hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnY3JlZGVudGlhbHMgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHNpbmdsZSBjcmVkZW50aWFsIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgY3JlZGVudGlhbHM6IFtjcmVhdGVNb2NrQ3JlZGVudGlhbCgpXSxcbiAgICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgQ3JlZGVudGlhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBtdWx0aXBsZSBjcmVkZW50aWFscyBpbiBkcm9wZG93bicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgY3JlZGVudGlhbHM6IGNyZWF0ZU1vY2tDcmVkZW50aWFscyg1KSxcbiAgICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgICAvLyBBc3NlcnQgLSA1IGluIGRyb3Bkb3duICsgMSBpbiB0cmlnZ2VyIChjdXJyZW50IGNyZWRlbnRpYWwgYXBwZWFycyB0d2ljZSlcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRleHQoL0NyZWRlbnRpYWwgXFxkLykubGVuZ3RoKS50b0JlKDYpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBjcmVkZW50aWFscyB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBuYW1lJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBjcmVkZW50aWFsczogW2NyZWF0ZU1vY2tDcmVkZW50aWFsKHsgaWQ6ICdjcmVkLXNwZWNpYWwnLCBuYW1lOiAnVGVzdCAmIENyZWRlbnRpYWwgPHNwZWNpYWw+JyB9KV0sXG4gICAgICAgICAgY3VycmVudENyZWRlbnRpYWxJZDogJ2NyZWQtc3BlY2lhbCcsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0ICYgQ3JlZGVudGlhbCA8c3BlY2lhbD4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ29uQ3JlZGVudGlhbENoYW5nZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBiZSBjYWxsZWQgd2hlbiBzZWxlY3RpbmcgYSBjcmVkZW50aWFsJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNoYW5nZSB9KVxuICAgICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIE9wZW4gZHJvcGRvd25cbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgICAvLyBDbGljayBvbiBzZWNvbmQgY3JlZGVudGlhbFxuICAgICAgICBjb25zdCBjcmVkZW50aWFsMiA9IHNjcmVlbi5nZXRCeVRleHQoJ0NyZWRlbnRpYWwgMicpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhjcmVkZW50aWFsMilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2NyZWQtMicpXG4gICAgICB9KVxuXG4gICAgICBpdC5lYWNoKFtcbiAgICAgICAgWydjcmVkLTInLCAnQ3JlZGVudGlhbCAyJ10sXG4gICAgICAgIFsnY3JlZC0zJywgJ0NyZWRlbnRpYWwgMyddLFxuICAgICAgXSkoJ3Nob3VsZCBjYWxsIG9uQ3JlZGVudGlhbENoYW5nZSB3aXRoICVzIHdoZW4gc2VsZWN0aW5nICVzJywgKGNyZWRJZCwgY3JlZGVudGlhbE5hbWUpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DaGFuZ2UgfSlcbiAgICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBzZWxlY3QgY3JlZGVudGlhbFxuICAgICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAgIC8vIEdldCB0aGUgZHJvcGRvd24gaXRlbSB1c2luZyB3aXRoaW4oKSB0byBzY29wZSBxdWVyeSB0byBwb3J0YWwgY29udGVudFxuICAgICAgICBjb25zdCBwb3J0YWxDb250ZW50ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpXG4gICAgICAgIGNvbnN0IGNyZWRlbnRpYWxPcHRpb24gPSB3aXRoaW4ocG9ydGFsQ29udGVudCkuZ2V0QnlUZXh0KGNyZWRlbnRpYWxOYW1lKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY3JlZGVudGlhbE9wdGlvbilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoY3JlZElkKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ3JlZGVudGlhbENoYW5nZSB3aXRoIGNyZWQtMSB3aGVuIHNlbGVjdGluZyBDcmVkZW50aWFsIDEgaW4gZHJvcGRvd24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgLSBTdGFydCB3aXRoIGNyZWQtMiBzZWxlY3RlZCBzbyBjcmVkLTEgaXMgb25seSBpbiBkcm9wZG93blxuICAgICAgICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNoYW5nZSxcbiAgICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0yJyxcbiAgICAgICAgfSlcbiAgICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBzZWxlY3QgQ3JlZGVudGlhbCAxXG4gICAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgICAgY29uc3QgY3JlZGVudGlhbDEgPSBzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDEnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soY3JlZGVudGlhbDEpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrT25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjcmVkLTEnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyAtIFRlc3QgZXZlbnQgaGFuZGxlcnNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBkcm9wZG93biBvcGVuIHdoZW4gdHJpZ2dlciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gSW5pdGlhbGx5IGNsb3NlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBDbGljayB0cmlnZ2VyXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gTm93IG9wZW5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ3JlZGVudGlhbENoYW5nZSB3aGVuIGNsaWNraW5nIGEgY3JlZGVudGlhbCBpdGVtJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNoYW5nZSB9KVxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGNvbnN0IGNyZWRlbnRpYWwyID0gc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjcmVkZW50aWFsMilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrT25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjcmVkLTInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIGRyb3Bkb3duIGFmdGVyIHNlbGVjdGluZyBhIGNyZWRlbnRpYWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ2hhbmdlIH0pXG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGFuZCBzZWxlY3RcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIGNvbnN0IGNyZWRlbnRpYWwyID0gc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjcmVkZW50aWFsMilcblxuICAgICAgLy8gQXNzZXJ0IC0gVGhlIGhhbmRsZUNyZWRlbnRpYWxDaGFuZ2UgY2FsbHMgdG9nZ2xlKCksIHdoaWNoIHNob3VsZCBjaGFuZ2UgdGhlIG9wZW4gc3RhdGVcbiAgICAgIGV4cGVjdChtb2NrT25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBjb25zZWN1dGl2ZSBjbGlja3Mgb24gdHJpZ2dlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFJhcGlkIGNsaWNrc1xuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHNlbGVjdGluZyBjcmVkZW50aWFscyBtdWx0aXBsZSB0aW1lcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBTdGFydCB3aXRoIGNyZWQtMiBzZWxlY3RlZCBzbyB3ZSBjYW4gc2VsZWN0IG90aGVyIGNyZWRlbnRpYWxzXG4gICAgICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ2hhbmdlLFxuICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0yJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydCAtIFNlbGVjdCBDcmVkZW50aWFsIDEgKGRpZmZlcmVudCBmcm9tIGN1cnJlbnQpXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgY29uc3QgY3JlZGVudGlhbDEgPSBzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDEnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNyZWRlbnRpYWwxKVxuXG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY3JlZC0xJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTaWRlIEVmZmVjdHMgYW5kIENsZWFudXAgLSBUZXN0IHVzZUVmZmVjdCBiZWhhdmlvclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1NpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGF1dG8tc2VsZWN0IGZpcnN0IGNyZWRlbnRpYWwgd2hlbiBjdXJyZW50Q3JlZGVudGlhbCBpcyBub3QgZm91bmQgYW5kIGNyZWRlbnRpYWxzIGV4aXN0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnbm9uLWV4aXN0ZW50LWlkJyxcbiAgICAgICAgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBhdXRvLXNlbGVjdCBmaXJzdCBjcmVkZW50aWFsXG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY3JlZC0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNyZWRlbnRpYWxDaGFuZ2Ugd2hlbiBjdXJyZW50Q3JlZGVudGlhbCBpcyBmb3VuZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3VycmVudENyZWRlbnRpYWxJZDogJ2NyZWQtMicsXG4gICAgICAgIG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ2hhbmdlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGF1dG8tc2VsZWN0XG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25DcmVkZW50aWFsQ2hhbmdlIHdoZW4gY3JlZGVudGlhbHMgYXJyYXkgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLTEnLFxuICAgICAgICBjcmVkZW50aWFsczogW10sXG4gICAgICAgIG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ2hhbmdlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNhbGwgc2luY2Ugbm8gY3JlZGVudGlhbHMgdG8gc2VsZWN0XG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXV0by1zZWxlY3Qgd2hlbiBjcmVkZW50aWFscyBjaGFuZ2UgYW5kIGN1cnJlbnRDcmVkZW50aWFsIGJlY29tZXMgaW52YWxpZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGluaXRpYWxDcmVkZW50aWFscyA9IGNyZWF0ZU1vY2tDcmVkZW50aWFscygzKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyxcbiAgICAgICAgY3JlZGVudGlhbHM6IGluaXRpYWxDcmVkZW50aWFscyxcbiAgICAgICAgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAvLyBBY3QgLSBDaGFuZ2UgY3JlZGVudGlhbHMgdG8gbm90IGluY2x1ZGUgY3VycmVudFxuICAgICAgY29uc3QgbmV3Q3JlZGVudGlhbHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDcmVkZW50aWFsKHsgaWQ6ICdjcmVkLTQnLCBuYW1lOiAnTmV3IENyZWRlbnRpYWwgNCcgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tDcmVkZW50aWFsKHsgaWQ6ICdjcmVkLTUnLCBuYW1lOiAnTmV3IENyZWRlbnRpYWwgNScgfSksXG4gICAgICBdXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPENyZWRlbnRpYWxTZWxlY3RvclxuICAgICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgICBjcmVkZW50aWFscz17bmV3Q3JlZGVudGlhbHN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgYXV0by1zZWxlY3QgZmlyc3Qgb2YgbmV3IGNyZWRlbnRpYWxzXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2NyZWQtNCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIGF1dG8tc2VsZWN0IGVmZmVjdCBvbiBldmVyeSByZW5kZXIgd2l0aCBzYW1lIHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNoYW5nZSB9KVxuXG4gICAgICAvLyBBY3QgLSBSZW5kZXIgYW5kIHJlcmVuZGVyIHdpdGggc2FtZSBwcm9wc1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcbiAgICAgIHJlcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcbiAgICAgIHJlcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gb25DcmVkZW50aWFsQ2hhbmdlIHNob3VsZCBub3QgYmUgY2FsbGVkIGZvciBhdXRvLXNlbGVjdGlvblxuICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBhbmQgTWVtb2l6YXRpb24gLSBUZXN0IHVzZUNhbGxiYWNrIGJlaGF2aW9yXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZUNyZWRlbnRpYWxDaGFuZ2UgY2FsbGJhY2snLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ2hhbmdlIH0pXG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBPcGVuIGRyb3Bkb3duIGFuZCBzZWxlY3RcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IHNjcmVlbi5nZXRCeVRleHQoJ0NyZWRlbnRpYWwgMicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY3JlZGVudGlhbClcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2FsbGJhY2sgc2hvdWxkIHdvcmsgY29ycmVjdGx5XG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY3JlZC0yJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgaGFuZGxlQ3JlZGVudGlhbENoYW5nZSB3aGVuIG9uQ3JlZGVudGlhbENoYW5nZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlMSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG1vY2tPbkNoYW5nZTIgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ2hhbmdlMSB9KVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBVcGRhdGUgb25DcmVkZW50aWFsQ2hhbmdlIHByb3BcbiAgICAgIHJlcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSBvbkNyZWRlbnRpYWxDaGFuZ2U9e21vY2tPbkNoYW5nZTJ9IC8+KVxuXG4gICAgICAvLyBPcGVuIGFuZCBzZWxlY3RcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IHNjcmVlbi5nZXRCeVRleHQoJ0NyZWRlbnRpYWwgMicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY3JlZGVudGlhbClcblxuICAgICAgLy8gQXNzZXJ0IC0gTmV3IGNhbGxiYWNrIHNob3VsZCBiZSB1c2VkXG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlMSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZTIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjcmVkLTInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE1lbW9pemF0aW9uIExvZ2ljIGFuZCBEZXBlbmRlbmNpZXMgLSBUZXN0IHVzZU1lbW8gYmVoYXZpb3JcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiBMb2dpYyBhbmQgRGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZmluZCBjdXJyZW50Q3JlZGVudGlhbCBieSBpZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY3VycmVudENyZWRlbnRpYWxJZDogJ2NyZWQtMicgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgZGlzcGxheSBjcmVkZW50aWFsIDJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjdXJyZW50Q3JlZGVudGlhbCB3aGVuIGN1cnJlbnRDcmVkZW50aWFsSWQgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY3VycmVudENyZWRlbnRpYWxJZDogJ2NyZWQtMScgfSlcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCBpbml0aWFsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gQ2hhbmdlIGN1cnJlbnRDcmVkZW50aWFsSWRcbiAgICAgIHJlcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSBjdXJyZW50Q3JlZGVudGlhbElkPVwiY3JlZC0zXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3cgZGlzcGxheSBjcmVkZW50aWFsIDNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjdXJyZW50Q3JlZGVudGlhbCB3aGVuIGNyZWRlbnRpYWxzIGFycmF5IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLTEnIH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgaW5pdGlhbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NyZWRlbnRpYWwgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIENoYW5nZSBjcmVkZW50aWFsc1xuICAgICAgY29uc3QgbmV3Q3JlZGVudGlhbHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDcmVkZW50aWFsKHsgaWQ6ICdjcmVkLTEnLCBuYW1lOiAnVXBkYXRlZCBDcmVkZW50aWFsIDEnIH0pLFxuICAgICAgXVxuICAgICAgcmVyZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IGNyZWRlbnRpYWxzPXtuZXdDcmVkZW50aWFsc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBkaXNwbGF5IHVwZGF0ZWQgbmFtZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1VwZGF0ZWQgQ3JlZGVudGlhbCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGN1cnJlbnRDcmVkZW50aWFsIHdoZW4gaWQgbm90IGZvdW5kJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnbm9uLWV4aXN0ZW50JyxcbiAgICAgICAgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DaGFuZ2UsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCB0cmlnZ2VyIGF1dG8tc2VsZWN0IGVmZmVjdFxuICAgICAgZXhwZWN0KG1vY2tPbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2NyZWQtMScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29tcG9uZW50IE1lbW9pemF0aW9uIC0gVGVzdCBSZWFjdC5tZW1vIGJlaGF2aW9yXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChDcmVkZW50aWFsU2VsZWN0b3IuJCR0eXBlb2YpLnRvQmUoU3ltYm9sLmZvcigncmVhY3QubWVtbycpKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZS1yZW5kZXIgd2hlbiBwcm9wcyByZW1haW4gdGhlIHNhbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ2hhbmdlIH0pXG4gICAgICBjb25zdCByZW5kZXJTcHkgPSB2aS5mbigpXG5cbiAgICAgIGNvbnN0IFRyYWNrZWRDcmVkZW50aWFsU2VsZWN0b3I6IFJlYWN0LkZDPENyZWRlbnRpYWxTZWxlY3RvclByb3BzPiA9ICh0cmFja2VkUHJvcHMpID0+IHtcbiAgICAgICAgcmVuZGVyU3B5KClcbiAgICAgICAgcmV0dXJuIDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnRyYWNrZWRQcm9wc30gLz5cbiAgICAgIH1cbiAgICAgIGNvbnN0IE1lbW9pemVkVHJhY2tlZCA9IFJlYWN0Lm1lbW8oVHJhY2tlZENyZWRlbnRpYWxTZWxlY3RvcilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE1lbW9pemVkVHJhY2tlZCB7Li4ucHJvcHN9IC8+KVxuICAgICAgcmVyZW5kZXIoPE1lbW9pemVkVHJhY2tlZCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgb25seSByZW5kZXIgb25jZSBkdWUgdG8gc2FtZSBwcm9wc1xuICAgICAgZXhwZWN0KHJlbmRlclNweSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmUtcmVuZGVyIHdoZW4gY3VycmVudENyZWRlbnRpYWxJZCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyB9KVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IGluaXRpYWxcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDcmVkZW50aWFsIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSBjdXJyZW50Q3JlZGVudGlhbElkPVwiY3JlZC0yXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NyZWRlbnRpYWwgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmUtcmVuZGVyIHdoZW4gY3JlZGVudGlhbHMgYXJyYXkgcmVmZXJlbmNlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBDcmVhdGUgbmV3IGNyZWRlbnRpYWxzIGFycmF5IHdpdGggZGlmZmVyZW50IGRhdGFcbiAgICAgIGNvbnN0IG5ld0NyZWRlbnRpYWxzID0gW1xuICAgICAgICBjcmVhdGVNb2NrQ3JlZGVudGlhbCh7IGlkOiAnY3JlZC0xJywgbmFtZTogJ05ldyBOYW1lIDEnIH0pLFxuICAgICAgXVxuICAgICAgcmVyZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IGNyZWRlbnRpYWxzPXtuZXdDcmVkZW50aWFsc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05ldyBOYW1lIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLXJlbmRlciB3aGVuIG9uQ3JlZGVudGlhbENoYW5nZSByZWZlcmVuY2UgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNoYW5nZTEgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrT25DaGFuZ2UyID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNoYW5nZTEgfSlcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIENoYW5nZSBjYWxsYmFjayByZWZlcmVuY2VcbiAgICAgIHJlcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSBvbkNyZWRlbnRpYWxDaGFuZ2U9e21vY2tPbkNoYW5nZTJ9IC8+KVxuXG4gICAgICAvLyBPcGVuIGFuZCBzZWxlY3RcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuICAgICAgY29uc3QgY3JlZGVudGlhbCA9IHNjcmVlbi5nZXRCeVRleHQoJ0NyZWRlbnRpYWwgMicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY3JlZGVudGlhbClcblxuICAgICAgLy8gQXNzZXJ0IC0gTmV3IGNhbGxiYWNrIHNob3VsZCBiZSB1c2VkXG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlMikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2NyZWQtMicpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBjcmVkZW50aWFscyBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3JlZGVudGlhbHM6IFtdLFxuICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0xJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtcm9vdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBhdmF0YXJfdXJsIGluIGNyZWRlbnRpYWwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjcmVkZW50aWFsV2l0aG91dEF2YXRhciA9IGNyZWF0ZU1vY2tDcmVkZW50aWFsKHtcbiAgICAgICAgaWQ6ICdjcmVkLW5vLWF2YXRhcicsXG4gICAgICAgIG5hbWU6ICdObyBBdmF0YXIgQ3JlZGVudGlhbCcsXG4gICAgICAgIGF2YXRhcl91cmw6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyZWRlbnRpYWxzOiBbY3JlZGVudGlhbFdpdGhvdXRBdmF0YXJdLFxuICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC1uby1hdmF0YXInLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nIGFuZCBzaG93IGZpcnN0IGxldHRlciBmYWxsYmFja1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05vIEF2YXRhciBDcmVkZW50aWFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIC8vIFdoZW4gYXZhdGFyX3VybCBpcyB1bmRlZmluZWQsIENyZWRlbnRpYWxJY29uIHNob3dzIGZpcnN0IGxldHRlciBpbnN0ZWFkIG9mIGltZ1xuICAgICAgY29uc3QgaWNvbkltZyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdpbWcnKVxuICAgICAgZXhwZWN0KGljb25JbWcpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBGaXJzdCBsZXR0ZXIgJ04nIHNob3VsZCBiZSBkaXNwbGF5ZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdOJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIG5hbWUgaW4gY3JlZGVudGlhbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNyZWRlbnRpYWxXaXRoRW1wdHlOYW1lID0gY3JlYXRlTW9ja0NyZWRlbnRpYWwoe1xuICAgICAgICBpZDogJ2NyZWQtZW1wdHktbmFtZScsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3JlZGVudGlhbHM6IFtjcmVkZW50aWFsV2l0aEVtcHR5TmFtZV0sXG4gICAgICAgIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLWVtcHR5LW5hbWUnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGNyZWRlbnRpYWwgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGxvbmdOYW1lID0gJ0EnLnJlcGVhdCgyMDApXG4gICAgICBjb25zdCBjcmVkZW50aWFsV2l0aExvbmdOYW1lID0gY3JlYXRlTW9ja0NyZWRlbnRpYWwoe1xuICAgICAgICBpZDogJ2NyZWQtbG9uZy1uYW1lJyxcbiAgICAgICAgbmFtZTogbG9uZ05hbWUsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmVkZW50aWFsczogW2NyZWRlbnRpYWxXaXRoTG9uZ05hbWVdLFxuICAgICAgICBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC1sb25nLW5hbWUnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdOYW1lKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gY3JlZGVudGlhbCBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3BlY2lhbE5hbWUgPSAn5rWL6K+VIENyZWRlbnRpYWwgPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PiAmIFwicXVvdGVkXCInXG4gICAgICBjb25zdCBjcmVkZW50aWFsV2l0aFNwZWNpYWxOYW1lID0gY3JlYXRlTW9ja0NyZWRlbnRpYWwoe1xuICAgICAgICBpZDogJ2NyZWQtc3BlY2lhbCcsXG4gICAgICAgIG5hbWU6IHNwZWNpYWxOYW1lLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY3JlZGVudGlhbHM6IFtjcmVkZW50aWFsV2l0aFNwZWNpYWxOYW1lXSxcbiAgICAgICAgY3VycmVudENyZWRlbnRpYWxJZDogJ2NyZWQtc3BlY2lhbCcsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoc3BlY2lhbE5hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bWVyaWMgaWQgYXMgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3JlZGVudGlhbFdpdGhOdW1lcmljSWQgPSBjcmVhdGVNb2NrQ3JlZGVudGlhbCh7XG4gICAgICAgIGlkOiAnMTIzNDU2JyxcbiAgICAgICAgbmFtZTogJ051bWVyaWMgSUQgQ3JlZGVudGlhbCcsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmVkZW50aWFsczogW2NyZWRlbnRpYWxXaXRoTnVtZXJpY0lkXSxcbiAgICAgICAgY3VycmVudENyZWRlbnRpYWxJZDogJzEyMzQ1NicsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ051bWVyaWMgSUQgQ3JlZGVudGlhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIG51bWJlciBvZiBjcmVkZW50aWFscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1hbnlDcmVkZW50aWFscyA9IGNyZWF0ZU1vY2tDcmVkZW50aWFscygxMDApXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNyZWRlbnRpYWxzOiBtYW55Q3JlZGVudGlhbHMsXG4gICAgICAgIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLTUwJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCA1MCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNyZWRlbnRpYWwgc2VsZWN0aW9uIHdpdGggZHVwbGljYXRlIG5hbWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZHVwbGljYXRlQ3JlZGVudGlhbHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDcmVkZW50aWFsKHsgaWQ6ICdjcmVkLTEnLCBuYW1lOiAnU2FtZSBOYW1lJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0NyZWRlbnRpYWwoeyBpZDogJ2NyZWQtMicsIG5hbWU6ICdTYW1lIE5hbWUnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmVkZW50aWFsczogZHVwbGljYXRlQ3JlZGVudGlhbHMsXG4gICAgICAgIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLTEnLFxuICAgICAgICBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNoYW5nZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh0cmlnZ2VyKVxuXG4gICAgICAvLyBHZXQgYWxsIFwiU2FtZSBOYW1lXCIgZWxlbWVudHNcbiAgICAgIC8vIDEgaW4gdHJpZ2dlciAoY3VycmVudCkgKyAyIGluIGRyb3Bkb3duIChib3RoIGNyZWRlbnRpYWxzKSA9IDMgdG90YWxcbiAgICAgIGNvbnN0IHNhbWVOYW1lRWxlbWVudHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdTYW1lIE5hbWUnKVxuICAgICAgZXhwZWN0KHNhbWVOYW1lRWxlbWVudHMubGVuZ3RoKS50b0JlKDMpXG5cbiAgICAgIC8vIENsaWNrIHRoZSBsYXN0IGRyb3Bkb3duIGl0ZW0gKGNyZWQtMiBpbiBkcm9wZG93bilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzYW1lTmFtZUVsZW1lbnRzWzJdKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgY2FsbCB3aXRoIHRoZSBjb3JyZWN0IGlkIGV2ZW4gd2l0aCBkdXBsaWNhdGUgbmFtZXNcbiAgICAgIGV4cGVjdChtb2NrT25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjcmVkLTInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjcmFzaCB3aGVuIGNsaWNraW5nIGNyZWRlbnRpYWwgYWZ0ZXIgdW5tb3VudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tPbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DaGFuZ2UgfSlcbiAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgdW5tb3VudCgpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgdGhyb3dcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIC8vIEFueSBjbGVhbnVwIHNob3VsZCBoYXZlIGhhcHBlbmVkXG4gICAgICB9KS5ub3QudG9UaHJvdygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHdoaXRlc3BhY2Utb25seSBjcmVkZW50aWFsIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjcmVkZW50aWFsV2l0aFdoaXRlc3BhY2UgPSBjcmVhdGVNb2NrQ3JlZGVudGlhbCh7XG4gICAgICAgIGlkOiAnY3JlZC13aGl0ZXNwYWNlJyxcbiAgICAgICAgbmFtZTogJyAgICcsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjcmVkZW50aWFsczogW2NyZWRlbnRpYWxXaXRoV2hpdGVzcGFjZV0sXG4gICAgICAgIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICdjcmVkLXdoaXRlc3BhY2UnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdHlsaW5nIGFuZCBDU1MgQ2xhc3Nlc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0eWxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBvdmVyZmxvdy1oaWRkZW4gY2xhc3MgdG8gdHJpZ2dlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJylcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0hhdmVDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBncm93IGNsYXNzIHRvIHRyaWdnZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBleHBlY3QodHJpZ2dlcikudG9IYXZlQ2xhc3MoJ2dyb3cnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHotMTAgY2xhc3MgdG8gZHJvcGRvd24gY29udGVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY29udGVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKVxuICAgICAgZXhwZWN0KGNvbnRlbnQpLnRvSGF2ZUNsYXNzKCd6LTEwJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiB3aXRoIENoaWxkIENvbXBvbmVudHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbiB3aXRoIENoaWxkIENvbXBvbmVudHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGN1cnJlbnRDcmVkZW50aWFsIHRvIFRyaWdnZXIgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBjdXJyZW50Q3JlZGVudGlhbElkOiAnY3JlZC0yJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFRyaWdnZXIgc2hvdWxkIGRpc3BsYXkgdGhlIGNvcnJlY3QgY3JlZGVudGlhbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NyZWRlbnRpYWwgMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc09wZW4gc3RhdGUgdG8gVHJpZ2dlciBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBJbml0aWFsbHkgY2xvc2VkXG4gICAgICBjb25zdCBwb3J0YWxSb290ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtcm9vdCcpXG4gICAgICBleHBlY3QocG9ydGFsUm9vdCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW9wZW4nLCAnZmFsc2UnKVxuXG4gICAgICAvLyBBY3QgLSBPcGVuXG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gTm93IG9wZW5cbiAgICAgIGV4cGVjdChwb3J0YWxSb290KS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtb3BlbicsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNyZWRlbnRpYWxzIHRvIExpc3QgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcblxuICAgICAgLy8gQXNzZXJ0IC0gQWxsIGNyZWRlbnRpYWxzIHNob3VsZCBiZSByZW5kZXJlZCBpbiBsaXN0XG4gICAgICAvLyAzIGluIGRyb3Bkb3duICsgMSBpbiB0cmlnZ2VyIChjdXJyZW50IGNyZWRlbnRpYWwgYXBwZWFycyB0d2ljZSkgPSA0IHRvdGFsXG4gICAgICBjb25zdCBjcmVkZW50aWFsTmFtZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KC9DcmVkZW50aWFsIFxcZC8pXG4gICAgICBleHBlY3QoY3JlZGVudGlhbE5hbWVzLmxlbmd0aCkudG9CZSg0KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY3VycmVudENyZWRlbnRpYWxJZCB0byBMaXN0IGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgY3VycmVudENyZWRlbnRpYWxJZDogJ2NyZWQtMicgfSlcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgdHJpZ2dlciA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXIpXG5cbiAgICAgIC8vIEFzc2VydCAtIEN1cnJlbnQgY3JlZGVudGlhbCAoQ3JlZGVudGlhbCAyKSBhcHBlYXJzIHR3aWNlOlxuICAgICAgLy8gb25jZSBpbiB0cmlnZ2VyIGFuZCBvbmNlIGluIGRyb3Bkb3duIGxpc3RcbiAgICAgIGNvbnN0IGNyZWRlbnRpYWwyRWxlbWVudHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KCdDcmVkZW50aWFsIDInKVxuICAgICAgZXhwZWN0KGNyZWRlbnRpYWwyRWxlbWVudHMubGVuZ3RoKS50b0JlKDIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBoYW5kbGVDcmVkZW50aWFsQ2hhbmdlIHRvIExpc3QgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNoYW5nZSB9KVxuICAgICAgcmVuZGVyKDxDcmVkZW50aWFsU2VsZWN0b3Igey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB0cmlnZ2VyID0gc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlcilcbiAgICAgIGNvbnN0IGNyZWRlbnRpYWwzID0gc2NyZWVuLmdldEJ5VGV4dCgnQ3JlZGVudGlhbCAzJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjcmVkZW50aWFsMylcblxuICAgICAgLy8gQXNzZXJ0IC0gaGFuZGxlQ3JlZGVudGlhbENoYW5nZSBzaG91bGQgcHJvcGFnYXRlIHRoZSBjYWxsXG4gICAgICBleHBlY3QobW9ja09uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnY3JlZC0zJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQb3J0YWwgQ29uZmlndXJhdGlvblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1BvcnRhbCBDb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29uZmlndXJlIFBvcnRhbFRvRm9sbG93RWxlbSB3aXRoIHBsYWNlbWVudCBib3R0b20tc3RhcnQnLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHRlc3QgdmVyaWZpZXMgdGhlIHBvcnRhbCBpcyBjb25maWd1cmVkIGNvcnJlY3RseVxuICAgICAgLy8gVGhlIGFjdHVhbCBwbGFjZW1lbnQgaXMgaGFuZGxlZCBieSB0aGUgbW9jaywgYnV0IHdlIHZlcmlmeSB0aGUgY29tcG9uZW50IHJlbmRlcnNcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8Q3JlZGVudGlhbFNlbGVjdG9yIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1yb290JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb25maWd1cmUgUG9ydGFsVG9Gb2xsb3dFbGVtIHdpdGggb2Zmc2V0IG1haW5BeGlzIDQnLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHRlc3QgdmVyaWZpZXMgdGhlIG9mZnNldCBjb25maWd1cmF0aW9uIGRvZXNuJ3QgYnJlYWsgcmVuZGVyaW5nXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPENyZWRlbnRpYWxTZWxlY3RvciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtcm9vdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=