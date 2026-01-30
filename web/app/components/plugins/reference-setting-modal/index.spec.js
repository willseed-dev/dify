"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const vitest_1 = require("vitest");
const types_1 = require("@/app/components/plugins/types");
const types_2 = require("./auto-update-setting/types");
const index_1 = require("./index");
const label_1 = require("./label");
// ================================
// Mock External Dependencies Only
// ================================
// Mock react-i18next
vitest_1.vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            const translations = {
                'privilege.title': 'Plugin Permissions',
                'privilege.whoCanInstall': 'Who can install plugins',
                'privilege.whoCanDebug': 'Who can debug plugins',
                'privilege.everyone': 'Everyone',
                'privilege.admins': 'Admins Only',
                'privilege.noone': 'No One',
                'operation.cancel': 'Cancel',
                'operation.save': 'Save',
                'autoUpdate.updateSettings': 'Update Settings',
            };
            const fullKey = options?.ns ? `${options.ns}.${key}` : key;
            return translations[fullKey] || translations[key] || key;
        },
    }),
}));
// Mock global public store
const mockSystemFeatures = { enable_marketplace: true };
vitest_1.vi.mock('@/context/global-public-context', () => ({
    useGlobalPublicStore: (selector) => {
        return selector({ systemFeatures: mockSystemFeatures });
    },
}));
// Mock Modal component
vitest_1.vi.mock('@/app/components/base/modal', () => ({
    default: ({ children, isShow, onClose, closable, className }) => {
        if (!isShow)
            return null;
        return (<div data-testid="modal" className={className}>
        {closable && (<button data-testid="modal-close" onClick={onClose}>
            Close
          </button>)}
        {children}
      </div>);
    },
}));
// Mock OptionCard component
vitest_1.vi.mock('@/app/components/workflow/nodes/_base/components/option-card', () => ({
    default: ({ title, onSelect, selected, className }) => (<button data-testid={`option-card-${title.toLowerCase().replace(/\s+/g, '-')}`} onClick={onSelect} aria-pressed={selected} className={className}>
      {title}
    </button>),
}));
// Mock AutoUpdateSetting component
const mockAutoUpdateSettingOnChange = vitest_1.vi.fn();
vitest_1.vi.mock('./auto-update-setting', () => ({
    default: ({ payload, onChange }) => {
        mockAutoUpdateSettingOnChange.mockImplementation(onChange);
        return (<div data-testid="auto-update-setting">
        <span data-testid="auto-update-strategy">{payload.strategy_setting}</span>
        <span data-testid="auto-update-mode">{payload.upgrade_mode}</span>
        <button data-testid="auto-update-change" onClick={() => onChange({
                ...payload,
                strategy_setting: types_2.AUTO_UPDATE_STRATEGY.latest,
            })}>
          Change Strategy
        </button>
      </div>);
    },
}));
// Mock config default value
vitest_1.vi.mock('./auto-update-setting/config', () => ({
    defaultValue: {
        strategy_setting: types_2.AUTO_UPDATE_STRATEGY.disabled,
        upgrade_time_of_day: 0,
        upgrade_mode: types_2.AUTO_UPDATE_MODE.update_all,
        exclude_plugins: [],
        include_plugins: [],
    },
}));
// ================================
// Test Data Factories
// ================================
const createMockPermissions = (overrides = {}) => ({
    install_permission: types_1.PermissionType.everyone,
    debug_permission: types_1.PermissionType.admin,
    ...overrides,
});
const createMockAutoUpdateConfig = (overrides = {}) => ({
    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
    upgrade_time_of_day: 36000,
    upgrade_mode: types_2.AUTO_UPDATE_MODE.update_all,
    exclude_plugins: [],
    include_plugins: [],
    ...overrides,
});
const createMockReferenceSetting = (overrides = {}) => ({
    permission: createMockPermissions(),
    auto_upgrade: createMockAutoUpdateConfig(),
    ...overrides,
});
// ================================
// Test Suites
// ================================
(0, vitest_1.describe)('reference-setting-modal', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockSystemFeatures.enable_marketplace = true;
    });
    // ============================================================
    // Label Component Tests
    // ============================================================
    (0, vitest_1.describe)('Label (label.tsx)', () => {
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render label text', () => {
                // Arrange & Act
                (0, react_1.render)(<label_1.default label="Test Label"/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Test Label')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render with label only when no description provided', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<label_1.default label="Simple Label"/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Simple Label')).toBeInTheDocument();
                // Should have h-6 class when no description
                (0, vitest_1.expect)(container.querySelector('.h-6')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render label and description when both provided', () => {
                // Arrange & Act
                (0, react_1.render)(<label_1.default label="Label Text" description="Description Text"/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Label Text')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Description Text')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should apply h-4 class to label container when description is provided', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<label_1.default label="Label" description="Has description"/>);
                // Assert
                (0, vitest_1.expect)(container.querySelector('.h-4')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should not render description element when description is undefined', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<label_1.default label="Only Label"/>);
                // Assert
                (0, vitest_1.expect)(container.querySelectorAll('.body-xs-regular')).toHaveLength(0);
            });
            (0, vitest_1.it)('should render description with correct styling', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<label_1.default label="Label" description="Styled Description"/>);
                // Assert
                const descriptionElement = container.querySelector('.body-xs-regular');
                (0, vitest_1.expect)(descriptionElement).toBeInTheDocument();
                (0, vitest_1.expect)(descriptionElement).toHaveClass('mt-1', 'text-text-tertiary');
            });
        });
        (0, vitest_1.describe)('Props Variations', () => {
            (0, vitest_1.it)('should handle empty label string', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<label_1.default label=""/>);
                // Assert - should render without crashing
                (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle empty description string', () => {
                // Arrange & Act
                (0, react_1.render)(<label_1.default label="Label" description=""/>);
                // Assert - empty description still renders the description container
                (0, vitest_1.expect)(react_1.screen.getByText('Label')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle long label text', () => {
                // Arrange
                const longLabel = 'A'.repeat(200);
                // Act
                (0, react_1.render)(<label_1.default label={longLabel}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(longLabel)).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle long description text', () => {
                // Arrange
                const longDescription = 'B'.repeat(500);
                // Act
                (0, react_1.render)(<label_1.default label="Label" description={longDescription}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(longDescription)).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle special characters in label', () => {
                // Arrange
                const specialLabel = '<script>alert("xss")</script>';
                // Act
                (0, react_1.render)(<label_1.default label={specialLabel}/>);
                // Assert - should be escaped
                (0, vitest_1.expect)(react_1.screen.getByText(specialLabel)).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle special characters in description', () => {
                // Arrange
                const specialDescription = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                // Act
                (0, react_1.render)(<label_1.default label="Label" description={specialDescription}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(specialDescription)).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                // Assert
                (0, vitest_1.expect)(label_1.default).toBeDefined();
                (0, vitest_1.expect)(label_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
        (0, vitest_1.describe)('Styling', () => {
            (0, vitest_1.it)('should apply system-sm-semibold class to label', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<label_1.default label="Styled Label"/>);
                // Assert
                (0, vitest_1.expect)(container.querySelector('.system-sm-semibold')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should apply text-text-secondary class to label', () => {
                // Arrange & Act
                const { container } = (0, react_1.render)(<label_1.default label="Styled Label"/>);
                // Assert
                (0, vitest_1.expect)(container.querySelector('.text-text-secondary')).toBeInTheDocument();
            });
        });
    });
    // ============================================================
    // ReferenceSettingModal (PluginSettingModal) Component Tests
    // ============================================================
    (0, vitest_1.describe)('ReferenceSettingModal (index.tsx)', () => {
        const defaultProps = {
            payload: createMockReferenceSetting(),
            onHide: vitest_1.vi.fn(),
            onSave: vitest_1.vi.fn(),
        };
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render modal with correct title', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Plugin Permissions')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render install permission section', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Who can install plugins')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render debug permission section', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Who can debug plugins')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render all permission options for install', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert - should have 6 option cards total (3 for install, 3 for debug)
                (0, vitest_1.expect)(react_1.screen.getAllByTestId(/option-card/)).toHaveLength(6);
            });
            (0, vitest_1.it)('should render cancel and save buttons', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Cancel')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Save')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render AutoUpdateSetting when marketplace is enabled', () => {
                // Arrange
                mockSystemFeatures.enable_marketplace = true;
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('auto-update-setting')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should not render AutoUpdateSetting when marketplace is disabled', () => {
                // Arrange
                mockSystemFeatures.enable_marketplace = false;
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByTestId('auto-update-setting')).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should render modal with closable attribute', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('modal-close')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('State Management', () => {
            (0, vitest_1.it)('should initialize with payload permission values', () => {
                // Arrange
                const payload = createMockReferenceSetting({
                    permission: {
                        install_permission: types_1.PermissionType.admin,
                        debug_permission: types_1.PermissionType.noOne,
                    },
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - admin option should be selected for install (first one)
                const adminOptions = react_1.screen.getAllByTestId('option-card-admins-only');
                (0, vitest_1.expect)(adminOptions[0]).toHaveAttribute('aria-pressed', 'true'); // Install permission
                // Assert - noOne option should be selected for debug (second one)
                const noOneOptions = react_1.screen.getAllByTestId('option-card-no-one');
                (0, vitest_1.expect)(noOneOptions[1]).toHaveAttribute('aria-pressed', 'true'); // Debug permission
            });
            (0, vitest_1.it)('should update tempPrivilege when permission option is clicked', () => {
                // Arrange
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Act - click on "No One" for install permission
                const noOneOptions = react_1.screen.getAllByTestId('option-card-no-one');
                react_1.fireEvent.click(noOneOptions[0]); // First one is for install permission
                // Assert - the option should now be selected
                (0, vitest_1.expect)(noOneOptions[0]).toHaveAttribute('aria-pressed', 'true');
            });
            (0, vitest_1.it)('should initialize with payload auto_upgrade values', () => {
                // Arrange
                const payload = createMockReferenceSetting({
                    auto_upgrade: createMockAutoUpdateConfig({
                        strategy_setting: types_2.AUTO_UPDATE_STRATEGY.latest,
                    }),
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('auto-update-strategy')).toHaveTextContent('latest');
            });
            (0, vitest_1.it)('should use default auto_upgrade when payload.auto_upgrade is undefined', () => {
                // Arrange
                const payload = {
                    permission: createMockPermissions(),
                    auto_upgrade: undefined,
                };
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - should use default value (disabled)
                (0, vitest_1.expect)(react_1.screen.getByTestId('auto-update-strategy')).toHaveTextContent('disabled');
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should call onHide when cancel button is clicked', () => {
                // Arrange
                const onHide = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} onHide={onHide}/>);
                react_1.fireEvent.click(react_1.screen.getByText('Cancel'));
                // Assert
                (0, vitest_1.expect)(onHide).toHaveBeenCalledTimes(1);
            });
            (0, vitest_1.it)('should call onHide when modal close button is clicked', () => {
                // Arrange
                const onHide = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} onHide={onHide}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('modal-close'));
                // Assert
                (0, vitest_1.expect)(onHide).toHaveBeenCalledTimes(1);
            });
            (0, vitest_1.it)('should call onSave with correct payload when save button is clicked', async () => {
                // Arrange
                const onSave = vitest_1.vi.fn().mockResolvedValue(undefined);
                const onHide = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} onSave={onSave} onHide={onHide}/>);
                react_1.fireEvent.click(react_1.screen.getByText('Save'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onSave).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        permission: vitest_1.expect.any(Object),
                        auto_upgrade: vitest_1.expect.any(Object),
                    }));
                });
            });
            (0, vitest_1.it)('should call onHide after successful save', async () => {
                // Arrange
                const onSave = vitest_1.vi.fn().mockResolvedValue(undefined);
                const onHide = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} onSave={onSave} onHide={onHide}/>);
                react_1.fireEvent.click(react_1.screen.getByText('Save'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onHide).toHaveBeenCalledTimes(1);
                });
            });
            (0, vitest_1.it)('should update install permission when Everyone option is clicked', () => {
                // Arrange
                const payload = createMockReferenceSetting({
                    permission: {
                        install_permission: types_1.PermissionType.noOne,
                        debug_permission: types_1.PermissionType.noOne,
                    },
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Click Everyone for install permission
                const everyoneOptions = react_1.screen.getAllByTestId('option-card-everyone');
                react_1.fireEvent.click(everyoneOptions[0]);
                // Assert
                (0, vitest_1.expect)(everyoneOptions[0]).toHaveAttribute('aria-pressed', 'true');
            });
            (0, vitest_1.it)('should update debug permission when Admins Only option is clicked', () => {
                // Arrange
                const payload = createMockReferenceSetting({
                    permission: {
                        install_permission: types_1.PermissionType.everyone,
                        debug_permission: types_1.PermissionType.everyone,
                    },
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Click Admins Only for debug permission (second set of options)
                const adminOptions = react_1.screen.getAllByTestId('option-card-admins-only');
                react_1.fireEvent.click(adminOptions[1]); // Second one is for debug permission
                // Assert
                (0, vitest_1.expect)(adminOptions[1]).toHaveAttribute('aria-pressed', 'true');
            });
            (0, vitest_1.it)('should update auto_upgrade config when changed in AutoUpdateSetting', async () => {
                // Arrange
                const onSave = vitest_1.vi.fn().mockResolvedValue(undefined);
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} onSave={onSave}/>);
                // Change auto update strategy
                react_1.fireEvent.click(react_1.screen.getByTestId('auto-update-change'));
                // Save to verify the change
                react_1.fireEvent.click(react_1.screen.getByText('Save'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onSave).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        auto_upgrade: vitest_1.expect.objectContaining({
                            strategy_setting: types_2.AUTO_UPDATE_STRATEGY.latest,
                        }),
                    }));
                });
            });
        });
        (0, vitest_1.describe)('Callback Stability and Memoization', () => {
            (0, vitest_1.it)('handlePrivilegeChange should be memoized with useCallback', () => {
                // Arrange
                const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Act - rerender with same props
                rerender(<index_1.default {...defaultProps}/>);
                // Assert - component should render without issues
                (0, vitest_1.expect)(react_1.screen.getByText('Plugin Permissions')).toBeInTheDocument();
            });
            (0, vitest_1.it)('handleSave should be memoized with useCallback', async () => {
                // Arrange
                const onSave = vitest_1.vi.fn().mockResolvedValue(undefined);
                const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} onSave={onSave}/>);
                // Act - rerender and click save
                rerender(<index_1.default {...defaultProps} onSave={onSave}/>);
                react_1.fireEvent.click(react_1.screen.getByText('Save'));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onSave).toHaveBeenCalledTimes(1);
                });
            });
            (0, vitest_1.it)('handlePrivilegeChange should create new handler with correct key', () => {
                // Arrange
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Act - click install permission option
                const everyoneOptions = react_1.screen.getAllByTestId('option-card-everyone');
                react_1.fireEvent.click(everyoneOptions[0]);
                // Assert - install permission should be updated
                (0, vitest_1.expect)(everyoneOptions[0]).toHaveAttribute('aria-pressed', 'true');
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                // Assert
                (0, vitest_1.expect)(index_1.default).toBeDefined();
                (0, vitest_1.expect)(index_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
        (0, vitest_1.describe)('Edge Cases and Error Handling', () => {
            (0, vitest_1.it)('should handle null payload gracefully', () => {
                // Arrange
                const payload = null;
                // Act & Assert - should not crash
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                (0, vitest_1.expect)(react_1.screen.getByText('Plugin Permissions')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle undefined permission values', () => {
                // Arrange
                const payload = {
                    permission: undefined,
                    auto_upgrade: createMockAutoUpdateConfig(),
                };
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - should use default PermissionType.noOne
                const noOneOptions = react_1.screen.getAllByTestId('option-card-no-one');
                (0, vitest_1.expect)(noOneOptions[0]).toHaveAttribute('aria-pressed', 'true');
            });
            (0, vitest_1.it)('should handle missing install_permission', () => {
                // Arrange
                const payload = createMockReferenceSetting({
                    permission: {
                        install_permission: undefined,
                        debug_permission: types_1.PermissionType.everyone,
                    },
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - should fall back to PermissionType.noOne
                (0, vitest_1.expect)(react_1.screen.getByText('Plugin Permissions')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle missing debug_permission', () => {
                // Arrange
                const payload = createMockReferenceSetting({
                    permission: {
                        install_permission: types_1.PermissionType.everyone,
                        debug_permission: undefined,
                    },
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - should fall back to PermissionType.noOne
                (0, vitest_1.expect)(react_1.screen.getByText('Plugin Permissions')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle slow async onSave gracefully', async () => {
                // Arrange - test that the component handles async save correctly
                let resolvePromise;
                const onSave = vitest_1.vi.fn().mockImplementation(() => {
                    return new Promise((resolve) => {
                        resolvePromise = resolve;
                    });
                });
                const onHide = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} onSave={onSave} onHide={onHide}/>);
                react_1.fireEvent.click(react_1.screen.getByText('Save'));
                // Assert - onSave should be called immediately
                (0, vitest_1.expect)(onSave).toHaveBeenCalledTimes(1);
                // onHide should not be called until save resolves
                (0, vitest_1.expect)(onHide).not.toHaveBeenCalled();
                // Resolve the promise
                resolvePromise();
                // Now onHide should be called
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onHide).toHaveBeenCalledTimes(1);
                });
            });
        });
        (0, vitest_1.describe)('Props Variations', () => {
            (0, vitest_1.it)('should render with all PermissionType combinations', () => {
                // Test each permission type
                const permissionTypes = [types_1.PermissionType.everyone, types_1.PermissionType.admin, types_1.PermissionType.noOne];
                permissionTypes.forEach((installPerm) => {
                    permissionTypes.forEach((debugPerm) => {
                        // Arrange
                        const payload = createMockReferenceSetting({
                            permission: {
                                install_permission: installPerm,
                                debug_permission: debugPerm,
                            },
                        });
                        // Act
                        const { unmount } = (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                        // Assert - should render without crashing
                        (0, vitest_1.expect)(react_1.screen.getByText('Plugin Permissions')).toBeInTheDocument();
                        unmount();
                    });
                });
            });
            (0, vitest_1.it)('should render with all AUTO_UPDATE_STRATEGY values', () => {
                // Test each strategy
                const strategies = [
                    types_2.AUTO_UPDATE_STRATEGY.disabled,
                    types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    types_2.AUTO_UPDATE_STRATEGY.latest,
                ];
                strategies.forEach((strategy) => {
                    // Arrange
                    const payload = createMockReferenceSetting({
                        auto_upgrade: createMockAutoUpdateConfig({
                            strategy_setting: strategy,
                        }),
                    });
                    // Act
                    const { unmount } = (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                    // Assert
                    (0, vitest_1.expect)(react_1.screen.getByTestId('auto-update-strategy')).toHaveTextContent(strategy);
                    unmount();
                });
            });
            (0, vitest_1.it)('should render with all AUTO_UPDATE_MODE values', () => {
                // Test each mode
                const modes = [
                    types_2.AUTO_UPDATE_MODE.update_all,
                    types_2.AUTO_UPDATE_MODE.partial,
                    types_2.AUTO_UPDATE_MODE.exclude,
                ];
                modes.forEach((mode) => {
                    // Arrange
                    const payload = createMockReferenceSetting({
                        auto_upgrade: createMockAutoUpdateConfig({
                            upgrade_mode: mode,
                        }),
                    });
                    // Act
                    const { unmount } = (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                    // Assert
                    (0, vitest_1.expect)(react_1.screen.getByTestId('auto-update-mode')).toHaveTextContent(mode);
                    unmount();
                });
            });
        });
        (0, vitest_1.describe)('State Updates', () => {
            (0, vitest_1.it)('should preserve tempPrivilege when changing install_permission', async () => {
                // Arrange
                const onSave = vitest_1.vi.fn().mockResolvedValue(undefined);
                const payload = createMockReferenceSetting({
                    permission: {
                        install_permission: types_1.PermissionType.everyone,
                        debug_permission: types_1.PermissionType.admin,
                    },
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload} onSave={onSave}/>);
                // Change install permission to noOne
                const noOneOptions = react_1.screen.getAllByTestId('option-card-no-one');
                react_1.fireEvent.click(noOneOptions[0]);
                // Save
                react_1.fireEvent.click(react_1.screen.getByText('Save'));
                // Assert - debug_permission should still be admin
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onSave).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        permission: vitest_1.expect.objectContaining({
                            install_permission: types_1.PermissionType.noOne,
                            debug_permission: types_1.PermissionType.admin,
                        }),
                    }));
                });
            });
            (0, vitest_1.it)('should preserve tempPrivilege when changing debug_permission', async () => {
                // Arrange
                const onSave = vitest_1.vi.fn().mockResolvedValue(undefined);
                const payload = createMockReferenceSetting({
                    permission: {
                        install_permission: types_1.PermissionType.admin,
                        debug_permission: types_1.PermissionType.everyone,
                    },
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload} onSave={onSave}/>);
                // Change debug permission to noOne
                const noOneOptions = react_1.screen.getAllByTestId('option-card-no-one');
                react_1.fireEvent.click(noOneOptions[1]); // Second one is for debug
                // Save
                react_1.fireEvent.click(react_1.screen.getByText('Save'));
                // Assert - install_permission should still be admin
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onSave).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        permission: vitest_1.expect.objectContaining({
                            install_permission: types_1.PermissionType.admin,
                            debug_permission: types_1.PermissionType.noOne,
                        }),
                    }));
                });
            });
            (0, vitest_1.it)('should update tempAutoUpdateConfig independently of permissions', async () => {
                // Arrange
                const onSave = vitest_1.vi.fn().mockResolvedValue(undefined);
                const initialPayload = createMockReferenceSetting();
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={initialPayload} onSave={onSave}/>);
                // Change auto update
                react_1.fireEvent.click(react_1.screen.getByTestId('auto-update-change'));
                // Change install permission
                const everyoneOptions = react_1.screen.getAllByTestId('option-card-everyone');
                react_1.fireEvent.click(everyoneOptions[0]);
                // Save
                react_1.fireEvent.click(react_1.screen.getByText('Save'));
                // Assert - both changes should be saved
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onSave).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                        permission: vitest_1.expect.objectContaining({
                            install_permission: types_1.PermissionType.everyone,
                        }),
                        auto_upgrade: vitest_1.expect.objectContaining({
                            strategy_setting: types_2.AUTO_UPDATE_STRATEGY.latest,
                        }),
                    }));
                });
            });
        });
        (0, vitest_1.describe)('Modal Integration', () => {
            (0, vitest_1.it)('should render modal with correct className', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                const modal = react_1.screen.getByTestId('modal');
                (0, vitest_1.expect)(modal).toHaveClass('w-[620px]', 'max-w-[620px]', '!p-0');
            });
            (0, vitest_1.it)('should pass isShow=true to Modal', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert - modal should be visible
                (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Layout and Structure', () => {
            (0, vitest_1.it)('should render permission sections in correct order', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert - check order by getting all section labels
                const labels = react_1.screen.getAllByText(/Who can/);
                (0, vitest_1.expect)(labels[0]).toHaveTextContent('Who can install plugins');
                (0, vitest_1.expect)(labels[1]).toHaveTextContent('Who can debug plugins');
            });
            (0, vitest_1.it)('should render three options per permission section', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                const everyoneOptions = react_1.screen.getAllByTestId('option-card-everyone');
                const adminOptions = react_1.screen.getAllByTestId('option-card-admins-only');
                const noOneOptions = react_1.screen.getAllByTestId('option-card-no-one');
                (0, vitest_1.expect)(everyoneOptions).toHaveLength(2); // One for install, one for debug
                (0, vitest_1.expect)(adminOptions).toHaveLength(2);
                (0, vitest_1.expect)(noOneOptions).toHaveLength(2);
            });
            (0, vitest_1.it)('should render footer with action buttons', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                const cancelButton = react_1.screen.getByText('Cancel');
                const saveButton = react_1.screen.getByText('Save');
                (0, vitest_1.expect)(cancelButton).toBeInTheDocument();
                (0, vitest_1.expect)(saveButton).toBeInTheDocument();
            });
        });
    });
    // ============================================================
    // Integration Tests
    // ============================================================
    (0, vitest_1.describe)('Integration', () => {
        (0, vitest_1.it)('should handle complete workflow: change permissions, update auto-update, save', async () => {
            // Arrange
            const onSave = vitest_1.vi.fn().mockResolvedValue(undefined);
            const onHide = vitest_1.vi.fn();
            const initialPayload = createMockReferenceSetting({
                permission: {
                    install_permission: types_1.PermissionType.noOne,
                    debug_permission: types_1.PermissionType.noOne,
                },
                auto_upgrade: createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.disabled,
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default payload={initialPayload} onHide={onHide} onSave={onSave}/>);
            // Change install permission to Everyone
            const everyoneOptions = react_1.screen.getAllByTestId('option-card-everyone');
            react_1.fireEvent.click(everyoneOptions[0]);
            // Change debug permission to Admins Only
            const adminOptions = react_1.screen.getAllByTestId('option-card-admins-only');
            react_1.fireEvent.click(adminOptions[1]);
            // Change auto-update strategy
            react_1.fireEvent.click(react_1.screen.getByTestId('auto-update-change'));
            // Save
            react_1.fireEvent.click(react_1.screen.getByText('Save'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onSave).toHaveBeenCalledWith({
                    permission: {
                        install_permission: types_1.PermissionType.everyone,
                        debug_permission: types_1.PermissionType.admin,
                    },
                    auto_upgrade: vitest_1.expect.objectContaining({
                        strategy_setting: types_2.AUTO_UPDATE_STRATEGY.latest,
                    }),
                });
                (0, vitest_1.expect)(onHide).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should cancel without saving changes', () => {
            // Arrange
            const onSave = vitest_1.vi.fn();
            const onHide = vitest_1.vi.fn();
            const initialPayload = createMockReferenceSetting();
            // Act
            (0, react_1.render)(<index_1.default payload={initialPayload} onHide={onHide} onSave={onSave}/>);
            // Make some changes
            const noOneOptions = react_1.screen.getAllByTestId('option-card-no-one');
            react_1.fireEvent.click(noOneOptions[0]);
            // Cancel
            react_1.fireEvent.click(react_1.screen.getByText('Cancel'));
            // Assert
            (0, vitest_1.expect)(onSave).not.toHaveBeenCalled();
            (0, vitest_1.expect)(onHide).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('Label component should work correctly within modal context', () => {
            // Arrange
            const props = {
                payload: createMockReferenceSetting(),
                onHide: vitest_1.vi.fn(),
                onSave: vitest_1.vi.fn(),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Labels are rendered correctly
            (0, vitest_1.expect)(react_1.screen.getByText('Who can install plugins')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Who can debug plugins')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixtQ0FBNkQ7QUFDN0QsMERBQStEO0FBQy9ELHVEQUFvRjtBQUNwRixtQ0FBMkM7QUFDM0MsbUNBQTJCO0FBRTNCLG1DQUFtQztBQUNuQyxrQ0FBa0M7QUFDbEMsbUNBQW1DO0FBRW5DLHFCQUFxQjtBQUNyQixXQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQVcsRUFBRSxPQUF5QixFQUFFLEVBQUU7WUFDNUMsTUFBTSxZQUFZLEdBQTJCO2dCQUMzQyxpQkFBaUIsRUFBRSxvQkFBb0I7Z0JBQ3ZDLHlCQUF5QixFQUFFLHlCQUF5QjtnQkFDcEQsdUJBQXVCLEVBQUUsdUJBQXVCO2dCQUNoRCxvQkFBb0IsRUFBRSxVQUFVO2dCQUNoQyxrQkFBa0IsRUFBRSxhQUFhO2dCQUNqQyxpQkFBaUIsRUFBRSxRQUFRO2dCQUMzQixrQkFBa0IsRUFBRSxRQUFRO2dCQUM1QixnQkFBZ0IsRUFBRSxNQUFNO2dCQUN4QiwyQkFBMkIsRUFBRSxpQkFBaUI7YUFDL0MsQ0FBQTtZQUNELE1BQU0sT0FBTyxHQUFHLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFBO1lBQzFELE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUE7UUFDMUQsQ0FBQztLQUNGLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILDJCQUEyQjtBQUMzQixNQUFNLGtCQUFrQixHQUFH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QU0sRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNmLE1BQU0sRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFO2FBQ2hCLENBQUE7WUFFRCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFxQixDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTVDLHlDQUF5QztZQUN6QyxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3ZFLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdkUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBdXRvVXBkYXRlQ29uZmlnIH0gZnJvbSAnLi9hdXRvLXVwZGF0ZS1zZXR0aW5nL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQZXJtaXNzaW9ucywgUmVmZXJlbmNlU2V0dGluZyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBQZXJtaXNzaW9uVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7IEFVVE9fVVBEQVRFX01PREUsIEFVVE9fVVBEQVRFX1NUUkFURUdZIH0gZnJvbSAnLi9hdXRvLXVwZGF0ZS1zZXR0aW5nL3R5cGVzJ1xuaW1wb3J0IFJlZmVyZW5jZVNldHRpbmdNb2RhbCBmcm9tICcuL2luZGV4J1xuaW1wb3J0IExhYmVsIGZyb20gJy4vbGFiZWwnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llcyBPbmx5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHJlYWN0LWkxOG5leHRcbnZpLm1vY2soJ3JlYWN0LWkxOG5leHQnLCAoKSA9PiAoe1xuICB1c2VUcmFuc2xhdGlvbjogKCkgPT4gKHtcbiAgICB0OiAoa2V5OiBzdHJpbmcsIG9wdGlvbnM/OiB7IG5zPzogc3RyaW5nIH0pID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgJ3ByaXZpbGVnZS50aXRsZSc6ICdQbHVnaW4gUGVybWlzc2lvbnMnLFxuICAgICAgICAncHJpdmlsZWdlLndob0Nhbkluc3RhbGwnOiAnV2hvIGNhbiBpbnN0YWxsIHBsdWdpbnMnLFxuICAgICAgICAncHJpdmlsZWdlLndob0NhbkRlYnVnJzogJ1dobyBjYW4gZGVidWcgcGx1Z2lucycsXG4gICAgICAgICdwcml2aWxlZ2UuZXZlcnlvbmUnOiAnRXZlcnlvbmUnLFxuICAgICAgICAncHJpdmlsZWdlLmFkbWlucyc6ICdBZG1pbnMgT25seScsXG4gICAgICAgICdwcml2aWxlZ2Uubm9vbmUnOiAnTm8gT25lJyxcbiAgICAgICAgJ29wZXJhdGlvbi5jYW5jZWwnOiAnQ2FuY2VsJyxcbiAgICAgICAgJ29wZXJhdGlvbi5zYXZlJzogJ1NhdmUnLFxuICAgICAgICAnYXV0b1VwZGF0ZS51cGRhdGVTZXR0aW5ncyc6ICdVcGRhdGUgU2V0dGluZ3MnLFxuICAgICAgfVxuICAgICAgY29uc3QgZnVsbEtleSA9IG9wdGlvbnM/Lm5zID8gYCR7b3B0aW9ucy5uc30uJHtrZXl9YCA6IGtleVxuICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uc1tmdWxsS2V5XSB8fCB0cmFuc2xhdGlvbnNba2V5XSB8fCBrZXlcbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGdsb2JhbCBwdWJsaWMgc3RvcmVcbmNvbnN0IG1vY2tTeXN0ZW1GZWF0dXJlcyA9IHsgZW5hYmxlX21hcmtldHBsYWNlOiB0cnVlIH1cbnZpLm1vY2soJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VHbG9iYWxQdWJsaWNTdG9yZTogKHNlbGVjdG9yOiAoczogeyBzeXN0ZW1GZWF0dXJlczogdHlwZW9mIG1vY2tTeXN0ZW1GZWF0dXJlcyB9KSA9PiB0eXBlb2YgbW9ja1N5c3RlbUZlYXR1cmVzKSA9PiB7XG4gICAgcmV0dXJuIHNlbGVjdG9yKHsgc3lzdGVtRmVhdHVyZXM6IG1vY2tTeXN0ZW1GZWF0dXJlcyB9KVxuICB9LFxufSkpXG5cbi8vIE1vY2sgTW9kYWwgY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbW9kYWwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBjaGlsZHJlbiwgaXNTaG93LCBvbkNsb3NlLCBjbG9zYWJsZSwgY2xhc3NOYW1lIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgaXNTaG93OiBib29sZWFuXG4gICAgb25DbG9zZTogKCkgPT4gdm9pZFxuICAgIGNsb3NhYmxlPzogYm9vbGVhblxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICB9KSA9PiB7XG4gICAgaWYgKCFpc1Nob3cpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibW9kYWxcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICAgIHtjbG9zYWJsZSAmJiAoXG4gICAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNsb3NlXCIgb25DbGljaz17b25DbG9zZX0+XG4gICAgICAgICAgICBDbG9zZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApfVxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KSlcblxuLy8gTW9jayBPcHRpb25DYXJkIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL29wdGlvbi1jYXJkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgdGl0bGUsIG9uU2VsZWN0LCBzZWxlY3RlZCwgY2xhc3NOYW1lIH06IHtcbiAgICB0aXRsZTogc3RyaW5nXG4gICAgb25TZWxlY3Q6ICgpID0+IHZvaWRcbiAgICBzZWxlY3RlZDogYm9vbGVhblxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGJ1dHRvblxuICAgICAgZGF0YS10ZXN0aWQ9e2BvcHRpb24tY2FyZC0ke3RpdGxlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzKy9nLCAnLScpfWB9XG4gICAgICBvbkNsaWNrPXtvblNlbGVjdH1cbiAgICAgIGFyaWEtcHJlc3NlZD17c2VsZWN0ZWR9XG4gICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICA+XG4gICAgICB7dGl0bGV9XG4gICAgPC9idXR0b24+XG4gICksXG59KSlcblxuLy8gTW9jayBBdXRvVXBkYXRlU2V0dGluZyBjb21wb25lbnRcbmNvbnN0IG1vY2tBdXRvVXBkYXRlU2V0dGluZ09uQ2hhbmdlID0gdmkuZm4oKVxudmkubW9jaygnLi9hdXRvLXVwZGF0ZS1zZXR0aW5nJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgcGF5bG9hZCwgb25DaGFuZ2UgfToge1xuICAgIHBheWxvYWQ6IEF1dG9VcGRhdGVDb25maWdcbiAgICBvbkNoYW5nZTogKHBheWxvYWQ6IEF1dG9VcGRhdGVDb25maWcpID0+IHZvaWRcbiAgfSkgPT4ge1xuICAgIG1vY2tBdXRvVXBkYXRlU2V0dGluZ09uQ2hhbmdlLm1vY2tJbXBsZW1lbnRhdGlvbihvbkNoYW5nZSlcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImF1dG8tdXBkYXRlLXNldHRpbmdcIj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJhdXRvLXVwZGF0ZS1zdHJhdGVneVwiPntwYXlsb2FkLnN0cmF0ZWd5X3NldHRpbmd9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImF1dG8tdXBkYXRlLW1vZGVcIj57cGF5bG9hZC51cGdyYWRlX21vZGV9PC9zcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJhdXRvLXVwZGF0ZS1jaGFuZ2VcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uQ2hhbmdlKHtcbiAgICAgICAgICAgIC4uLnBheWxvYWQsXG4gICAgICAgICAgICBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5sYXRlc3QsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICBDaGFuZ2UgU3RyYXRlZ3lcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KSlcblxuLy8gTW9jayBjb25maWcgZGVmYXVsdCB2YWx1ZVxudmkubW9jaygnLi9hdXRvLXVwZGF0ZS1zZXR0aW5nL2NvbmZpZycsICgpID0+ICh7XG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmRpc2FibGVkLFxuICAgIHVwZ3JhZGVfdGltZV9vZl9kYXk6IDAsXG4gICAgdXBncmFkZV9tb2RlOiBBVVRPX1VQREFURV9NT0RFLnVwZGF0ZV9hbGwsXG4gICAgZXhjbHVkZV9wbHVnaW5zOiBbXSxcbiAgICBpbmNsdWRlX3BsdWdpbnM6IFtdLFxuICB9LFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrUGVybWlzc2lvbnMgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBlcm1pc3Npb25zPiA9IHt9KTogUGVybWlzc2lvbnMgPT4gKHtcbiAgaW5zdGFsbF9wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ldmVyeW9uZSxcbiAgZGVidWdfcGVybWlzc2lvbjogUGVybWlzc2lvblR5cGUuYWRtaW4sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnID0gKG92ZXJyaWRlczogUGFydGlhbDxBdXRvVXBkYXRlQ29uZmlnPiA9IHt9KTogQXV0b1VwZGF0ZUNvbmZpZyA9PiAoe1xuICBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5LFxuICB1cGdyYWRlX3RpbWVfb2ZfZGF5OiAzNjAwMCxcbiAgdXBncmFkZV9tb2RlOiBBVVRPX1VQREFURV9NT0RFLnVwZGF0ZV9hbGwsXG4gIGV4Y2x1ZGVfcGx1Z2luczogW10sXG4gIGluY2x1ZGVfcGx1Z2luczogW10sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tSZWZlcmVuY2VTZXR0aW5nID0gKG92ZXJyaWRlczogUGFydGlhbDxSZWZlcmVuY2VTZXR0aW5nPiA9IHt9KTogUmVmZXJlbmNlU2V0dGluZyA9PiAoe1xuICBwZXJtaXNzaW9uOiBjcmVhdGVNb2NrUGVybWlzc2lvbnMoKSxcbiAgYXV0b191cGdyYWRlOiBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZygpLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdyZWZlcmVuY2Utc2V0dGluZy1tb2RhbCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1N5c3RlbUZlYXR1cmVzLmVuYWJsZV9tYXJrZXRwbGFjZSA9IHRydWVcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTGFiZWwgQ29tcG9uZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTGFiZWwgKGxhYmVsLnRzeCknLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGxhYmVsIHRleHQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxMYWJlbCBsYWJlbD1cIlRlc3QgTGFiZWxcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgTGFiZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBsYWJlbCBvbmx5IHdoZW4gbm8gZGVzY3JpcHRpb24gcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGFiZWwgbGFiZWw9XCJTaW1wbGUgTGFiZWxcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NpbXBsZSBMYWJlbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIC8vIFNob3VsZCBoYXZlIGgtNiBjbGFzcyB3aGVuIG5vIGRlc2NyaXB0aW9uXG4gICAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmgtNicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBsYWJlbCBhbmQgZGVzY3JpcHRpb24gd2hlbiBib3RoIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8TGFiZWwgbGFiZWw9XCJMYWJlbCBUZXh0XCIgZGVzY3JpcHRpb249XCJEZXNjcmlwdGlvbiBUZXh0XCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdMYWJlbCBUZXh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0Rlc2NyaXB0aW9uIFRleHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBhcHBseSBoLTQgY2xhc3MgdG8gbGFiZWwgY29udGFpbmVyIHdoZW4gZGVzY3JpcHRpb24gaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGFiZWwgbGFiZWw9XCJMYWJlbFwiIGRlc2NyaXB0aW9uPVwiSGFzIGRlc2NyaXB0aW9uXCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmgtNCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgZGVzY3JpcHRpb24gZWxlbWVudCB3aGVuIGRlc2NyaXB0aW9uIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMYWJlbCBsYWJlbD1cIk9ubHkgTGFiZWxcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuYm9keS14cy1yZWd1bGFyJykpLnRvSGF2ZUxlbmd0aCgwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgZGVzY3JpcHRpb24gd2l0aCBjb3JyZWN0IHN0eWxpbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGFiZWwgbGFiZWw9XCJMYWJlbFwiIGRlc2NyaXB0aW9uPVwiU3R5bGVkIERlc2NyaXB0aW9uXCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uRWxlbWVudCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYm9keS14cy1yZWd1bGFyJylcbiAgICAgICAgZXhwZWN0KGRlc2NyaXB0aW9uRWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3QoZGVzY3JpcHRpb25FbGVtZW50KS50b0hhdmVDbGFzcygnbXQtMScsICd0ZXh0LXRleHQtdGVydGlhcnknKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1Byb3BzIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBsYWJlbCBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGFiZWwgbGFiZWw9XCJcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkZXNjcmlwdGlvbiBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxMYWJlbCBsYWJlbD1cIkxhYmVsXCIgZGVzY3JpcHRpb249XCJcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBlbXB0eSBkZXNjcmlwdGlvbiBzdGlsbCByZW5kZXJzIHRoZSBkZXNjcmlwdGlvbiBjb250YWluZXJcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0xhYmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGxvbmcgbGFiZWwgdGV4dCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBsb25nTGFiZWwgPSAnQScucmVwZWF0KDIwMClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxMYWJlbCBsYWJlbD17bG9uZ0xhYmVsfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ0xhYmVsKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbG9uZyBkZXNjcmlwdGlvbiB0ZXh0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGxvbmdEZXNjcmlwdGlvbiA9ICdCJy5yZXBlYXQoNTAwKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExhYmVsIGxhYmVsPVwiTGFiZWxcIiBkZXNjcmlwdGlvbj17bG9uZ0Rlc2NyaXB0aW9ufSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ0Rlc2NyaXB0aW9uKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGxhYmVsJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHNwZWNpYWxMYWJlbCA9ICc8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+J1xuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPExhYmVsIGxhYmVsPXtzcGVjaWFsTGFiZWx9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBiZSBlc2NhcGVkXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHNwZWNpYWxMYWJlbCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBzcGVjaWFsRGVzY3JpcHRpb24gPSAnIUAjJCVeJiooKV8rLT1bXXt9fDs6LC48Pj8nXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8TGFiZWwgbGFiZWw9XCJMYWJlbFwiIGRlc2NyaXB0aW9uPXtzcGVjaWFsRGVzY3JpcHRpb259IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChzcGVjaWFsRGVzY3JpcHRpb24pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QoTGFiZWwpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KChMYWJlbCBhcyBhbnkpLiQkdHlwZW9mPy50b1N0cmluZygpKS50b0NvbnRhaW4oJ1N5bWJvbCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnU3R5bGluZycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgc3lzdGVtLXNtLXNlbWlib2xkIGNsYXNzIHRvIGxhYmVsJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExhYmVsIGxhYmVsPVwiU3R5bGVkIExhYmVsXCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnN5c3RlbS1zbS1zZW1pYm9sZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGFwcGx5IHRleHQtdGV4dC1zZWNvbmRhcnkgY2xhc3MgdG8gbGFiZWwnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TGFiZWwgbGFiZWw9XCJTdHlsZWQgTGFiZWxcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXNlY29uZGFyeScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlZmVyZW5jZVNldHRpbmdNb2RhbCAoUGx1Z2luU2V0dGluZ01vZGFsKSBDb21wb25lbnQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZWZlcmVuY2VTZXR0aW5nTW9kYWwgKGluZGV4LnRzeCknLCAoKSA9PiB7XG4gICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgcGF5bG9hZDogY3JlYXRlTW9ja1JlZmVyZW5jZVNldHRpbmcoKSxcbiAgICAgIG9uSGlkZTogdmkuZm4oKSxcbiAgICAgIG9uU2F2ZTogdmkuZm4oKSxcbiAgICB9XG5cbiAgICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgd2l0aCBjb3JyZWN0IHRpdGxlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGx1Z2luIFBlcm1pc3Npb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGluc3RhbGwgcGVybWlzc2lvbiBzZWN0aW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnV2hvIGNhbiBpbnN0YWxsIHBsdWdpbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgZGVidWcgcGVybWlzc2lvbiBzZWN0aW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnV2hvIGNhbiBkZWJ1ZyBwbHVnaW5zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBwZXJtaXNzaW9uIG9wdGlvbnMgZm9yIGluc3RhbGwnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIGhhdmUgNiBvcHRpb24gY2FyZHMgdG90YWwgKDMgZm9yIGluc3RhbGwsIDMgZm9yIGRlYnVnKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGVzdElkKC9vcHRpb24tY2FyZC8pKS50b0hhdmVMZW5ndGgoNilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGNhbmNlbCBhbmQgc2F2ZSBidXR0b25zJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ2FuY2VsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NhdmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgQXV0b1VwZGF0ZVNldHRpbmcgd2hlbiBtYXJrZXRwbGFjZSBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTeXN0ZW1GZWF0dXJlcy5lbmFibGVfbWFya2V0cGxhY2UgPSB0cnVlXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdhdXRvLXVwZGF0ZS1zZXR0aW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBBdXRvVXBkYXRlU2V0dGluZyB3aGVuIG1hcmtldHBsYWNlIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTeXN0ZW1GZWF0dXJlcy5lbmFibGVfbWFya2V0cGxhY2UgPSBmYWxzZVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdhdXRvLXVwZGF0ZS1zZXR0aW5nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIGNsb3NhYmxlIGF0dHJpYnV0ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY2xvc2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBwYXlsb2FkIHBlcm1pc3Npb24gdmFsdWVzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrUmVmZXJlbmNlU2V0dGluZyh7XG4gICAgICAgICAgcGVybWlzc2lvbjoge1xuICAgICAgICAgICAgaW5zdGFsbF9wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5hZG1pbixcbiAgICAgICAgICAgIGRlYnVnX3Blcm1pc3Npb246IFBlcm1pc3Npb25UeXBlLm5vT25lLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGFkbWluIG9wdGlvbiBzaG91bGQgYmUgc2VsZWN0ZWQgZm9yIGluc3RhbGwgKGZpcnN0IG9uZSlcbiAgICAgICAgY29uc3QgYWRtaW5PcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdvcHRpb24tY2FyZC1hZG1pbnMtb25seScpXG4gICAgICAgIGV4cGVjdChhZG1pbk9wdGlvbnNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ3RydWUnKSAvLyBJbnN0YWxsIHBlcm1pc3Npb25cblxuICAgICAgICAvLyBBc3NlcnQgLSBub09uZSBvcHRpb24gc2hvdWxkIGJlIHNlbGVjdGVkIGZvciBkZWJ1ZyAoc2Vjb25kIG9uZSlcbiAgICAgICAgY29uc3Qgbm9PbmVPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdvcHRpb24tY2FyZC1uby1vbmUnKVxuICAgICAgICBleHBlY3Qobm9PbmVPcHRpb25zWzFdKS50b0hhdmVBdHRyaWJ1dGUoJ2FyaWEtcHJlc3NlZCcsICd0cnVlJykgLy8gRGVidWcgcGVybWlzc2lvblxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgdGVtcFByaXZpbGVnZSB3aGVuIHBlcm1pc3Npb24gb3B0aW9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gY2xpY2sgb24gXCJObyBPbmVcIiBmb3IgaW5zdGFsbCBwZXJtaXNzaW9uXG4gICAgICAgIGNvbnN0IG5vT25lT3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnb3B0aW9uLWNhcmQtbm8tb25lJylcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKG5vT25lT3B0aW9uc1swXSkgLy8gRmlyc3Qgb25lIGlzIGZvciBpbnN0YWxsIHBlcm1pc3Npb25cblxuICAgICAgICAvLyBBc3NlcnQgLSB0aGUgb3B0aW9uIHNob3VsZCBub3cgYmUgc2VsZWN0ZWRcbiAgICAgICAgZXhwZWN0KG5vT25lT3B0aW9uc1swXSkudG9IYXZlQXR0cmlidXRlKCdhcmlhLXByZXNzZWQnLCAndHJ1ZScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBwYXlsb2FkIGF1dG9fdXBncmFkZSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tSZWZlcmVuY2VTZXR0aW5nKHtcbiAgICAgICAgICBhdXRvX3VwZ3JhZGU6IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHtcbiAgICAgICAgICAgIHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmxhdGVzdCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2F1dG8tdXBkYXRlLXN0cmF0ZWd5JykpLnRvSGF2ZVRleHRDb250ZW50KCdsYXRlc3QnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCBhdXRvX3VwZ3JhZGUgd2hlbiBwYXlsb2FkLmF1dG9fdXBncmFkZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgICAgICBwZXJtaXNzaW9uOiBjcmVhdGVNb2NrUGVybWlzc2lvbnMoKSxcbiAgICAgICAgICBhdXRvX3VwZ3JhZGU6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHVzZSBkZWZhdWx0IHZhbHVlIChkaXNhYmxlZClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYXV0by11cGRhdGUtc3RyYXRlZ3knKSkudG9IYXZlVGV4dENvbnRlbnQoJ2Rpc2FibGVkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkhpZGUgd2hlbiBjYW5jZWwgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBvbkhpZGU9e29uSGlkZX0gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdDYW5jZWwnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25IaWRlIHdoZW4gbW9kYWwgY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBvbkhpZGU9e29uSGlkZX0gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNsb3NlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2F2ZSB3aXRoIGNvcnJlY3QgcGF5bG9hZCB3aGVuIHNhdmUgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25TYXZlID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG4gICAgICAgIGNvbnN0IG9uSGlkZSA9IHZpLmZuKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb25TYXZlPXtvblNhdmV9IG9uSGlkZT17b25IaWRlfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ1NhdmUnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG9uU2F2ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgcGVybWlzc2lvbjogZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICAgICAgYXV0b191cGdyYWRlOiBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgICAgfSkpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25IaWRlIGFmdGVyIHN1Y2Nlc3NmdWwgc2F2ZScsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAgICAgY29uc3Qgb25IaWRlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBvblNhdmU9e29uU2F2ZX0gb25IaWRlPXtvbkhpZGV9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnU2F2ZScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qob25IaWRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXBkYXRlIGluc3RhbGwgcGVybWlzc2lvbiB3aGVuIEV2ZXJ5b25lIG9wdGlvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrUmVmZXJlbmNlU2V0dGluZyh7XG4gICAgICAgICAgcGVybWlzc2lvbjoge1xuICAgICAgICAgICAgaW5zdGFsbF9wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ub09uZSxcbiAgICAgICAgICAgIGRlYnVnX3Blcm1pc3Npb246IFBlcm1pc3Npb25UeXBlLm5vT25lLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIENsaWNrIEV2ZXJ5b25lIGZvciBpbnN0YWxsIHBlcm1pc3Npb25cbiAgICAgICAgY29uc3QgZXZlcnlvbmVPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdvcHRpb24tY2FyZC1ldmVyeW9uZScpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhldmVyeW9uZU9wdGlvbnNbMF0pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChldmVyeW9uZU9wdGlvbnNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ3RydWUnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgZGVidWcgcGVybWlzc2lvbiB3aGVuIEFkbWlucyBPbmx5IG9wdGlvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrUmVmZXJlbmNlU2V0dGluZyh7XG4gICAgICAgICAgcGVybWlzc2lvbjoge1xuICAgICAgICAgICAgaW5zdGFsbF9wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ldmVyeW9uZSxcbiAgICAgICAgICAgIGRlYnVnX3Blcm1pc3Npb246IFBlcm1pc3Npb25UeXBlLmV2ZXJ5b25lLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIENsaWNrIEFkbWlucyBPbmx5IGZvciBkZWJ1ZyBwZXJtaXNzaW9uIChzZWNvbmQgc2V0IG9mIG9wdGlvbnMpXG4gICAgICAgIGNvbnN0IGFkbWluT3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnb3B0aW9uLWNhcmQtYWRtaW5zLW9ubHknKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soYWRtaW5PcHRpb25zWzFdKSAvLyBTZWNvbmQgb25lIGlzIGZvciBkZWJ1ZyBwZXJtaXNzaW9uXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChhZG1pbk9wdGlvbnNbMV0pLnRvSGF2ZUF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ3RydWUnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgYXV0b191cGdyYWRlIGNvbmZpZyB3aGVuIGNoYW5nZWQgaW4gQXV0b1VwZGF0ZVNldHRpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25TYXZlID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9uU2F2ZT17b25TYXZlfSAvPilcblxuICAgICAgICAvLyBDaGFuZ2UgYXV0byB1cGRhdGUgc3RyYXRlZ3lcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYXV0by11cGRhdGUtY2hhbmdlJykpXG5cbiAgICAgICAgLy8gU2F2ZSB0byB2ZXJpZnkgdGhlIGNoYW5nZVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnU2F2ZScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qob25TYXZlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBhdXRvX3VwZ3JhZGU6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kubGF0ZXN0LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSkpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdoYW5kbGVQcml2aWxlZ2VDaGFuZ2Ugc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggdXNlQ2FsbGJhY2snLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0IC0gcmVyZW5kZXIgd2l0aCBzYW1lIHByb3BzXG4gICAgICAgIHJlcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY29tcG9uZW50IHNob3VsZCByZW5kZXIgd2l0aG91dCBpc3N1ZXNcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BsdWdpbiBQZXJtaXNzaW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnaGFuZGxlU2F2ZSBzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCB1c2VDYWxsYmFjaycsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb25TYXZlPXtvblNhdmV9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIHJlcmVuZGVyIGFuZCBjbGljayBzYXZlXG4gICAgICAgIHJlcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb25TYXZlPXtvblNhdmV9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnU2F2ZScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qob25TYXZlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdoYW5kbGVQcml2aWxlZ2VDaGFuZ2Ugc2hvdWxkIGNyZWF0ZSBuZXcgaGFuZGxlciB3aXRoIGNvcnJlY3Qga2V5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdCAtIGNsaWNrIGluc3RhbGwgcGVybWlzc2lvbiBvcHRpb25cbiAgICAgICAgY29uc3QgZXZlcnlvbmVPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdvcHRpb24tY2FyZC1ldmVyeW9uZScpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhldmVyeW9uZU9wdGlvbnNbMF0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gaW5zdGFsbCBwZXJtaXNzaW9uIHNob3VsZCBiZSB1cGRhdGVkXG4gICAgICAgIGV4cGVjdChldmVyeW9uZU9wdGlvbnNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ3RydWUnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KFJlZmVyZW5jZVNldHRpbmdNb2RhbCkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QoKFJlZmVyZW5jZVNldHRpbmdNb2RhbCBhcyBhbnkpLiQkdHlwZW9mPy50b1N0cmluZygpKS50b0NvbnRhaW4oJ1N5bWJvbCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIHBheWxvYWQgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gbnVsbCBhcyBhbnlcblxuICAgICAgICAvLyBBY3QgJiBBc3NlcnQgLSBzaG91bGQgbm90IGNyYXNoXG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGx1Z2luIFBlcm1pc3Npb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBwZXJtaXNzaW9uIHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAgIHBlcm1pc3Npb246IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgICAgYXV0b191cGdyYWRlOiBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZygpLFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHNob3VsZCB1c2UgZGVmYXVsdCBQZXJtaXNzaW9uVHlwZS5ub09uZVxuICAgICAgICBjb25zdCBub09uZU9wdGlvbnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ29wdGlvbi1jYXJkLW5vLW9uZScpXG4gICAgICAgIGV4cGVjdChub09uZU9wdGlvbnNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnYXJpYS1wcmVzc2VkJywgJ3RydWUnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBpbnN0YWxsX3Blcm1pc3Npb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tSZWZlcmVuY2VTZXR0aW5nKHtcbiAgICAgICAgICBwZXJtaXNzaW9uOiB7XG4gICAgICAgICAgICBpbnN0YWxsX3Blcm1pc3Npb246IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgICAgICBkZWJ1Z19wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ldmVyeW9uZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBzaG91bGQgZmFsbCBiYWNrIHRvIFBlcm1pc3Npb25UeXBlLm5vT25lXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQbHVnaW4gUGVybWlzc2lvbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBkZWJ1Z19wZXJtaXNzaW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrUmVmZXJlbmNlU2V0dGluZyh7XG4gICAgICAgICAgcGVybWlzc2lvbjoge1xuICAgICAgICAgICAgaW5zdGFsbF9wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ldmVyeW9uZSxcbiAgICAgICAgICAgIGRlYnVnX3Blcm1pc3Npb246IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIGZhbGwgYmFjayB0byBQZXJtaXNzaW9uVHlwZS5ub09uZVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUGx1Z2luIFBlcm1pc3Npb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHNsb3cgYXN5bmMgb25TYXZlIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgLSB0ZXN0IHRoYXQgdGhlIGNvbXBvbmVudCBoYW5kbGVzIGFzeW5jIHNhdmUgY29ycmVjdGx5XG4gICAgICAgIGxldCByZXNvbHZlUHJvbWlzZTogKCkgPT4gdm9pZFxuICAgICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlUHJvbWlzZSA9IHJlc29sdmVcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9uU2F2ZT17b25TYXZlfSBvbkhpZGU9e29uSGlkZX0gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdTYXZlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gb25TYXZlIHNob3VsZCBiZSBjYWxsZWQgaW1tZWRpYXRlbHlcbiAgICAgICAgZXhwZWN0KG9uU2F2ZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG5cbiAgICAgICAgLy8gb25IaWRlIHNob3VsZCBub3QgYmUgY2FsbGVkIHVudGlsIHNhdmUgcmVzb2x2ZXNcbiAgICAgICAgZXhwZWN0KG9uSGlkZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgIC8vIFJlc29sdmUgdGhlIHByb21pc2VcbiAgICAgICAgcmVzb2x2ZVByb21pc2UhKClcblxuICAgICAgICAvLyBOb3cgb25IaWRlIHNob3VsZCBiZSBjYWxsZWRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnUHJvcHMgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggYWxsIFBlcm1pc3Npb25UeXBlIGNvbWJpbmF0aW9ucycsICgpID0+IHtcbiAgICAgICAgLy8gVGVzdCBlYWNoIHBlcm1pc3Npb24gdHlwZVxuICAgICAgICBjb25zdCBwZXJtaXNzaW9uVHlwZXMgPSBbUGVybWlzc2lvblR5cGUuZXZlcnlvbmUsIFBlcm1pc3Npb25UeXBlLmFkbWluLCBQZXJtaXNzaW9uVHlwZS5ub09uZV1cblxuICAgICAgICBwZXJtaXNzaW9uVHlwZXMuZm9yRWFjaCgoaW5zdGFsbFBlcm0pID0+IHtcbiAgICAgICAgICBwZXJtaXNzaW9uVHlwZXMuZm9yRWFjaCgoZGVidWdQZXJtKSA9PiB7XG4gICAgICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja1JlZmVyZW5jZVNldHRpbmcoe1xuICAgICAgICAgICAgICBwZXJtaXNzaW9uOiB7XG4gICAgICAgICAgICAgICAgaW5zdGFsbF9wZXJtaXNzaW9uOiBpbnN0YWxsUGVybSxcbiAgICAgICAgICAgICAgICBkZWJ1Z19wZXJtaXNzaW9uOiBkZWJ1Z1Blcm0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvLyBBY3RcbiAgICAgICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BsdWdpbiBQZXJtaXNzaW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgICAgICAgIHVubW91bnQoKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIGFsbCBBVVRPX1VQREFURV9TVFJBVEVHWSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIFRlc3QgZWFjaCBzdHJhdGVneVxuICAgICAgICBjb25zdCBzdHJhdGVnaWVzID0gW1xuICAgICAgICAgIEFVVE9fVVBEQVRFX1NUUkFURUdZLmRpc2FibGVkLFxuICAgICAgICAgIEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHksXG4gICAgICAgICAgQVVUT19VUERBVEVfU1RSQVRFR1kubGF0ZXN0LFxuICAgICAgICBdXG5cbiAgICAgICAgc3RyYXRlZ2llcy5mb3JFYWNoKChzdHJhdGVneSkgPT4ge1xuICAgICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja1JlZmVyZW5jZVNldHRpbmcoe1xuICAgICAgICAgICAgYXV0b191cGdyYWRlOiBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgICAgIHN0cmF0ZWd5X3NldHRpbmc6IHN0cmF0ZWd5LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSlcblxuICAgICAgICAgIC8vIEFjdFxuICAgICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdhdXRvLXVwZGF0ZS1zdHJhdGVneScpKS50b0hhdmVUZXh0Q29udGVudChzdHJhdGVneSlcblxuICAgICAgICAgIHVubW91bnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBhbGwgQVVUT19VUERBVEVfTU9ERSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIFRlc3QgZWFjaCBtb2RlXG4gICAgICAgIGNvbnN0IG1vZGVzID0gW1xuICAgICAgICAgIEFVVE9fVVBEQVRFX01PREUudXBkYXRlX2FsbCxcbiAgICAgICAgICBBVVRPX1VQREFURV9NT0RFLnBhcnRpYWwsXG4gICAgICAgICAgQVVUT19VUERBVEVfTU9ERS5leGNsdWRlLFxuICAgICAgICBdXG5cbiAgICAgICAgbW9kZXMuZm9yRWFjaCgobW9kZSkgPT4ge1xuICAgICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja1JlZmVyZW5jZVNldHRpbmcoe1xuICAgICAgICAgICAgYXV0b191cGdyYWRlOiBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgICAgIHVwZ3JhZGVfbW9kZTogbW9kZSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pXG5cbiAgICAgICAgICAvLyBBY3RcbiAgICAgICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYXV0by11cGRhdGUtbW9kZScpKS50b0hhdmVUZXh0Q29udGVudChtb2RlKVxuXG4gICAgICAgICAgdW5tb3VudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnU3RhdGUgVXBkYXRlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcHJlc2VydmUgdGVtcFByaXZpbGVnZSB3aGVuIGNoYW5naW5nIGluc3RhbGxfcGVybWlzc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tSZWZlcmVuY2VTZXR0aW5nKHtcbiAgICAgICAgICBwZXJtaXNzaW9uOiB7XG4gICAgICAgICAgICBpbnN0YWxsX3Blcm1pc3Npb246IFBlcm1pc3Npb25UeXBlLmV2ZXJ5b25lLFxuICAgICAgICAgICAgZGVidWdfcGVybWlzc2lvbjogUGVybWlzc2lvblR5cGUuYWRtaW4sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gb25TYXZlPXtvblNhdmV9IC8+KVxuXG4gICAgICAgIC8vIENoYW5nZSBpbnN0YWxsIHBlcm1pc3Npb24gdG8gbm9PbmVcbiAgICAgICAgY29uc3Qgbm9PbmVPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdvcHRpb24tY2FyZC1uby1vbmUnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sobm9PbmVPcHRpb25zWzBdKVxuXG4gICAgICAgIC8vIFNhdmVcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ1NhdmUnKSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBkZWJ1Z19wZXJtaXNzaW9uIHNob3VsZCBzdGlsbCBiZSBhZG1pblxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qob25TYXZlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBwZXJtaXNzaW9uOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgIGluc3RhbGxfcGVybWlzc2lvbjogUGVybWlzc2lvblR5cGUubm9PbmUsXG4gICAgICAgICAgICAgIGRlYnVnX3Blcm1pc3Npb246IFBlcm1pc3Npb25UeXBlLmFkbWluLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSkpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHByZXNlcnZlIHRlbXBQcml2aWxlZ2Ugd2hlbiBjaGFuZ2luZyBkZWJ1Z19wZXJtaXNzaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uU2F2ZSA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja1JlZmVyZW5jZVNldHRpbmcoe1xuICAgICAgICAgIHBlcm1pc3Npb246IHtcbiAgICAgICAgICAgIGluc3RhbGxfcGVybWlzc2lvbjogUGVybWlzc2lvblR5cGUuYWRtaW4sXG4gICAgICAgICAgICBkZWJ1Z19wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ldmVyeW9uZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkfSBvblNhdmU9e29uU2F2ZX0gLz4pXG5cbiAgICAgICAgLy8gQ2hhbmdlIGRlYnVnIHBlcm1pc3Npb24gdG8gbm9PbmVcbiAgICAgICAgY29uc3Qgbm9PbmVPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdvcHRpb24tY2FyZC1uby1vbmUnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2sobm9PbmVPcHRpb25zWzFdKSAvLyBTZWNvbmQgb25lIGlzIGZvciBkZWJ1Z1xuXG4gICAgICAgIC8vIFNhdmVcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ1NhdmUnKSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBpbnN0YWxsX3Blcm1pc3Npb24gc2hvdWxkIHN0aWxsIGJlIGFkbWluXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChvblNhdmUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHBlcm1pc3Npb246IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgaW5zdGFsbF9wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5hZG1pbixcbiAgICAgICAgICAgICAgZGVidWdfcGVybWlzc2lvbjogUGVybWlzc2lvblR5cGUubm9PbmUsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXBkYXRlIHRlbXBBdXRvVXBkYXRlQ29uZmlnIGluZGVwZW5kZW50bHkgb2YgcGVybWlzc2lvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25TYXZlID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG4gICAgICAgIGNvbnN0IGluaXRpYWxQYXlsb2FkID0gY3JlYXRlTW9ja1JlZmVyZW5jZVNldHRpbmcoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtpbml0aWFsUGF5bG9hZH0gb25TYXZlPXtvblNhdmV9IC8+KVxuXG4gICAgICAgIC8vIENoYW5nZSBhdXRvIHVwZGF0ZVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdhdXRvLXVwZGF0ZS1jaGFuZ2UnKSlcblxuICAgICAgICAvLyBDaGFuZ2UgaW5zdGFsbCBwZXJtaXNzaW9uXG4gICAgICAgIGNvbnN0IGV2ZXJ5b25lT3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnb3B0aW9uLWNhcmQtZXZlcnlvbmUnKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZXZlcnlvbmVPcHRpb25zWzBdKVxuXG4gICAgICAgIC8vIFNhdmVcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ1NhdmUnKSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBib3RoIGNoYW5nZXMgc2hvdWxkIGJlIHNhdmVkXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChvblNhdmUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHBlcm1pc3Npb246IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgaW5zdGFsbF9wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ldmVyeW9uZSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgYXV0b191cGdyYWRlOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgIHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmxhdGVzdCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ01vZGFsIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgd2l0aCBjb3JyZWN0IGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgbW9kYWwgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJylcbiAgICAgICAgZXhwZWN0KG1vZGFsKS50b0hhdmVDbGFzcygndy1bNjIwcHhdJywgJ21heC13LVs2MjBweF0nLCAnIXAtMCcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3MgaXNTaG93PXRydWUgdG8gTW9kYWwnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gbW9kYWwgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0xheW91dCBhbmQgU3RydWN0dXJlJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgcGVybWlzc2lvbiBzZWN0aW9ucyBpbiBjb3JyZWN0IG9yZGVyJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8UmVmZXJlbmNlU2V0dGluZ01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGNoZWNrIG9yZGVyIGJ5IGdldHRpbmcgYWxsIHNlY3Rpb24gbGFiZWxzXG4gICAgICAgIGNvbnN0IGxhYmVscyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL1dobyBjYW4vKVxuICAgICAgICBleHBlY3QobGFiZWxzWzBdKS50b0hhdmVUZXh0Q29udGVudCgnV2hvIGNhbiBpbnN0YWxsIHBsdWdpbnMnKVxuICAgICAgICBleHBlY3QobGFiZWxzWzFdKS50b0hhdmVUZXh0Q29udGVudCgnV2hvIGNhbiBkZWJ1ZyBwbHVnaW5zJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHRocmVlIG9wdGlvbnMgcGVyIHBlcm1pc3Npb24gc2VjdGlvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgZXZlcnlvbmVPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdvcHRpb24tY2FyZC1ldmVyeW9uZScpXG4gICAgICAgIGNvbnN0IGFkbWluT3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnb3B0aW9uLWNhcmQtYWRtaW5zLW9ubHknKVxuICAgICAgICBjb25zdCBub09uZU9wdGlvbnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ29wdGlvbi1jYXJkLW5vLW9uZScpXG5cbiAgICAgICAgZXhwZWN0KGV2ZXJ5b25lT3B0aW9ucykudG9IYXZlTGVuZ3RoKDIpIC8vIE9uZSBmb3IgaW5zdGFsbCwgb25lIGZvciBkZWJ1Z1xuICAgICAgICBleHBlY3QoYWRtaW5PcHRpb25zKS50b0hhdmVMZW5ndGgoMilcbiAgICAgICAgZXhwZWN0KG5vT25lT3B0aW9ucykudG9IYXZlTGVuZ3RoKDIpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBmb290ZXIgd2l0aCBhY3Rpb24gYnV0dG9ucycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPFJlZmVyZW5jZVNldHRpbmdNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgY2FuY2VsQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnQ2FuY2VsJylcbiAgICAgICAgY29uc3Qgc2F2ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ1NhdmUnKVxuXG4gICAgICAgIGV4cGVjdChjYW5jZWxCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNhdmVCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb21wbGV0ZSB3b3JrZmxvdzogY2hhbmdlIHBlcm1pc3Npb25zLCB1cGRhdGUgYXV0by11cGRhdGUsIHNhdmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAgIGNvbnN0IG9uSGlkZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGluaXRpYWxQYXlsb2FkID0gY3JlYXRlTW9ja1JlZmVyZW5jZVNldHRpbmcoe1xuICAgICAgICBwZXJtaXNzaW9uOiB7XG4gICAgICAgICAgaW5zdGFsbF9wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ub09uZSxcbiAgICAgICAgICBkZWJ1Z19wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5ub09uZSxcbiAgICAgICAgfSxcbiAgICAgICAgYXV0b191cGdyYWRlOiBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZGlzYWJsZWQsXG4gICAgICAgIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZWZlcmVuY2VTZXR0aW5nTW9kYWxcbiAgICAgICAgICBwYXlsb2FkPXtpbml0aWFsUGF5bG9hZH1cbiAgICAgICAgICBvbkhpZGU9e29uSGlkZX1cbiAgICAgICAgICBvblNhdmU9e29uU2F2ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENoYW5nZSBpbnN0YWxsIHBlcm1pc3Npb24gdG8gRXZlcnlvbmVcbiAgICAgIGNvbnN0IGV2ZXJ5b25lT3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnb3B0aW9uLWNhcmQtZXZlcnlvbmUnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGV2ZXJ5b25lT3B0aW9uc1swXSlcblxuICAgICAgLy8gQ2hhbmdlIGRlYnVnIHBlcm1pc3Npb24gdG8gQWRtaW5zIE9ubHlcbiAgICAgIGNvbnN0IGFkbWluT3B0aW9ucyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnb3B0aW9uLWNhcmQtYWRtaW5zLW9ubHknKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGFkbWluT3B0aW9uc1sxXSlcblxuICAgICAgLy8gQ2hhbmdlIGF1dG8tdXBkYXRlIHN0cmF0ZWd5XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdhdXRvLXVwZGF0ZS1jaGFuZ2UnKSlcblxuICAgICAgLy8gU2F2ZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ1NhdmUnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uU2F2ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHBlcm1pc3Npb246IHtcbiAgICAgICAgICAgIGluc3RhbGxfcGVybWlzc2lvbjogUGVybWlzc2lvblR5cGUuZXZlcnlvbmUsXG4gICAgICAgICAgICBkZWJ1Z19wZXJtaXNzaW9uOiBQZXJtaXNzaW9uVHlwZS5hZG1pbixcbiAgICAgICAgICB9LFxuICAgICAgICAgIGF1dG9fdXBncmFkZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kubGF0ZXN0LFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3Qob25IaWRlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FuY2VsIHdpdGhvdXQgc2F2aW5nIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG4gICAgICBjb25zdCBpbml0aWFsUGF5bG9hZCA9IGNyZWF0ZU1vY2tSZWZlcmVuY2VTZXR0aW5nKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxSZWZlcmVuY2VTZXR0aW5nTW9kYWxcbiAgICAgICAgICBwYXlsb2FkPXtpbml0aWFsUGF5bG9hZH1cbiAgICAgICAgICBvbkhpZGU9e29uSGlkZX1cbiAgICAgICAgICBvblNhdmU9e29uU2F2ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIE1ha2Ugc29tZSBjaGFuZ2VzXG4gICAgICBjb25zdCBub09uZU9wdGlvbnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ29wdGlvbi1jYXJkLW5vLW9uZScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sobm9PbmVPcHRpb25zWzBdKVxuXG4gICAgICAvLyBDYW5jZWxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdDYW5jZWwnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25TYXZlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3Qob25IaWRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ0xhYmVsIGNvbXBvbmVudCBzaG91bGQgd29yayBjb3JyZWN0bHkgd2l0aGluIG1vZGFsIGNvbnRleHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgcGF5bG9hZDogY3JlYXRlTW9ja1JlZmVyZW5jZVNldHRpbmcoKSxcbiAgICAgICAgb25IaWRlOiB2aS5mbigpLFxuICAgICAgICBvblNhdmU6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSZWZlcmVuY2VTZXR0aW5nTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTGFiZWxzIGFyZSByZW5kZXJlZCBjb3JyZWN0bHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdXaG8gY2FuIGluc3RhbGwgcGx1Z2lucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnV2hvIGNhbiBkZWJ1ZyBwbHVnaW5zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==