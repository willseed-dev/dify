"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const vitest_1 = require("vitest");
const types_1 = require("@/app/components/workflow/block-selector/types");
// Import after mocks
const oauth_client_1 = require("./oauth-client");
// ============================================================================
// Mock Factory Functions
// ============================================================================
function createMockOAuthConfig(overrides = {}) {
    return {
        configured: true,
        custom_configured: false,
        custom_enabled: false,
        system_configured: true,
        redirect_uri: 'https://example.com/oauth/callback',
        params: {
            client_id: 'default-client-id',
            client_secret: 'default-client-secret',
        },
        oauth_client_schema: [
            { name: 'client_id', type: 'text-input', required: true, label: { 'en-US': 'Client ID' } },
            { name: 'client_secret', type: 'secret-input', required: true, label: { 'en-US': 'Client Secret' } },
        ],
        ...overrides,
    };
}
function createMockPluginDetail(overrides = {}) {
    return {
        plugin_id: 'test-plugin-id',
        provider: 'test-provider',
        name: 'Test Plugin',
        ...overrides,
    };
}
function createMockSubscriptionBuilder(overrides = {}) {
    return {
        id: 'builder-123',
        name: 'Test Builder',
        provider: 'test-provider',
        credential_type: types_1.TriggerCredentialTypeEnum.Oauth2,
        credentials: {},
        endpoint: 'https://example.com/callback',
        parameters: {},
        properties: {},
        workflows_in_use: 0,
        ...overrides,
    };
}
// ============================================================================
// Mock Setup
// ============================================================================
// Mock plugin store
const mockPluginDetail = createMockPluginDetail();
const mockUsePluginStore = vitest_1.vi.fn(() => mockPluginDetail);
vitest_1.vi.mock('../../store', () => ({
    usePluginStore: () => mockUsePluginStore(),
}));
// Mock service hooks
const mockInitiateOAuth = vitest_1.vi.fn();
const mockVerifyBuilder = vitest_1.vi.fn();
const mockConfigureOAuth = vitest_1.vi.fn();
const mockDeleteOAuth = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-triggers', () => ({
    useInitiateTriggerOAuth: () => ({
        mutate: mockInitiateOAuth,
    }),
    useVerifyAndUpdateTriggerSubscriptionBuilder: () => ({
        mutate: mockVerifyBuilder,
    }),
    useConfigureTriggerOAuth: () => ({
        mutate: mockConfigureOAuth,
    }),
    useDeleteTriggerOAuth: () => ({
        mutate: mockDeleteOAuth,
    }),
}));
// Mock OAuth popup
const mockOpenOAuthPopup = vitest_1.vi.fn();
vitest_1.vi.mock('@/hooks/use-oauth', () => ({
    openOAuthPopup: (url, callback) => mockOpenOAuthPopup(url, callback),
}));
// Mock toast
const mockToastNotify = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: (params) => mockToastNotify(params),
    },
}));
// Mock clipboard API
const mockClipboardWriteText = vitest_1.vi.fn();
Object.assign(navigator, {
    clipboard: {
        writeText: mockClipboardWriteText,
    },
});
// Mock Modal component
vitest_1.vi.mock('@/app/components/base/modal/modal', () => ({
    default: ({ children, onClose, onConfirm, onCancel, title, confirmButtonText, cancelButtonText, footerSlot, onExtraButtonClick, extraButtonText, }) => (<div data-testid="modal">
      <div data-testid="modal-title">{title}</div>
      <div data-testid="modal-content">{children}</div>
      <div data-testid="modal-footer">
        {footerSlot}
        {extraButtonText && (<button data-testid="modal-extra" onClick={onExtraButtonClick}>{extraButtonText}</button>)}
        {cancelButtonText && (<button data-testid="modal-cancel" onClick={onCancel}>{cancelButtonText}</button>)}
        <button data-testid="modal-confirm" onClick={onConfirm}>{confirmButtonText}</button>
        <button data-testid="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>),
}));
// Mock Button component
vitest_1.vi.mock('@/app/components/base/button', () => ({
    default: ({ children, onClick, variant, className }) => (<button data-testid={`button-${variant || 'default'}`} onClick={onClick} className={className}>
      {children}
    </button>),
}));
// Configurable form mock values
let mockFormValues = {
    values: { client_id: 'test-client-id', client_secret: 'test-client-secret' },
    isCheckValidated: true,
};
const setMockFormValues = (values) => {
    mockFormValues = values;
};
vitest_1.vi.mock('@/app/components/base/form/components/base', () => ({
    BaseForm: React.forwardRef(({ formSchemas }, ref) => {
        React.useImperativeHandle(ref, () => ({
            getFormValues: () => mockFormValues,
        }));
        return (<div data-testid="base-form">
        {formSchemas.map(schema => (<input key={schema.name} data-testid={`form-field-${schema.name}`} name={schema.name} defaultValue={schema.default || ''}/>))}
      </div>);
    }),
}));
// Mock OptionCard component
vitest_1.vi.mock('@/app/components/workflow/nodes/_base/components/option-card', () => ({
    default: ({ title, onSelect, selected, className }) => (<div data-testid={`option-card-${title}`} onClick={onSelect} className={`${className} ${selected ? 'selected' : ''}`} data-selected={selected}>
      {title}
    </div>),
}));
// ============================================================================
// Test Suites
// ============================================================================
(0, vitest_1.describe)('OAuthClientSettingsModal', () => {
    const defaultProps = {
        oauthConfig: createMockOAuthConfig(),
        onClose: vitest_1.vi.fn(),
        showOAuthCreateModal: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockUsePluginStore.mockReturnValue(mockPluginDetail);
        mockClipboardWriteText.mockResolvedValue(undefined);
        // Reset form values to default
        setMockFormValues({
            values: { client_id: 'test-client-id', client_secret: 'test-client-secret' },
            isCheckValidated: true,
        });
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render modal with correct title', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-title')).toHaveTextContent('pluginTrigger.modal.oauth.title');
        });
        (0, vitest_1.it)('should render client type selector when system_configured is true', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.default')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render client type selector when system_configured is false', () => {
            const configWithoutSystemConfigured = createMockOAuthConfig({
                system_configured: false,
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithoutSystemConfigured}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.default')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render redirect URI info when custom client type is selected', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTrigger.modal.oauthRedirectInfo')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('https://example.com/oauth/callback')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render client form when custom type is selected', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('base-form')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show remove button when custom_enabled and params exist', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('common.operation.remove')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Client Type Selection', () => {
        (0, vitest_1.it)('should default to Default client type when system_configured is true', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            const defaultCard = react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.default');
            (0, vitest_1.expect)(defaultCard).toHaveAttribute('data-selected', 'true');
        });
        (0, vitest_1.it)('should switch to Custom client type when Custom card is clicked', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            const customCard = react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom');
            react_1.fireEvent.click(customCard);
            (0, vitest_1.expect)(customCard).toHaveAttribute('data-selected', 'true');
        });
        (0, vitest_1.it)('should switch back to Default client type when Default card is clicked', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            const customCard = react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom');
            react_1.fireEvent.click(customCard);
            const defaultCard = react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.default');
            react_1.fireEvent.click(defaultCard);
            (0, vitest_1.expect)(defaultCard).toHaveAttribute('data-selected', 'true');
        });
    });
    (0, vitest_1.describe)('Copy Redirect URI', () => {
        (0, vitest_1.it)('should copy redirect URI when copy button is clicked', async () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            const copyButton = react_1.screen.getByText('common.operation.copy');
            react_1.fireEvent.click(copyButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockClipboardWriteText).toHaveBeenCalledWith('https://example.com/oauth/callback');
            });
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'success',
                message: 'common.actionMsg.copySuccessfully',
            });
        });
    });
    (0, vitest_1.describe)('OAuth Authorization Flow', () => {
        (0, vitest_1.it)('should initiate OAuth when confirm button is clicked', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            (0, vitest_1.expect)(mockConfigureOAuth).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should open OAuth popup after successful configuration', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onSuccess }) => {
                onSuccess({
                    authorization_url: 'https://oauth.example.com/authorize',
                    subscription_builder: createMockSubscriptionBuilder(),
                });
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            (0, vitest_1.expect)(mockOpenOAuthPopup).toHaveBeenCalledWith('https://oauth.example.com/authorize', vitest_1.expect.any(Function));
        });
        (0, vitest_1.it)('should show success toast and close modal when OAuth callback succeeds', () => {
            const mockOnClose = vitest_1.vi.fn();
            const mockShowOAuthCreateModal = vitest_1.vi.fn();
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onSuccess }) => {
                const builder = createMockSubscriptionBuilder();
                onSuccess({
                    authorization_url: 'https://oauth.example.com/authorize',
                    subscription_builder: builder,
                });
            });
            mockOpenOAuthPopup.mockImplementation((url, callback) => {
                callback({ success: true });
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} onClose={mockOnClose} showOAuthCreateModal={mockShowOAuthCreateModal}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'success',
                message: 'pluginTrigger.modal.oauth.authorization.authSuccess',
            });
            (0, vitest_1.expect)(mockOnClose).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should show error toast when OAuth initiation fails', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onError }) => {
                onError(new Error('OAuth failed'));
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'pluginTrigger.modal.oauth.authorization.authFailed',
            });
        });
    });
    (0, vitest_1.describe)('Save Only Flow', () => {
        (0, vitest_1.it)('should save configuration without authorization when cancel button is clicked', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            (0, vitest_1.expect)(mockConfigureOAuth).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                provider: 'test-provider',
                enabled: false,
            }), vitest_1.expect.any(Object));
        });
        (0, vitest_1.it)('should show success toast when save only succeeds', () => {
            const mockOnClose = vitest_1.vi.fn();
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} onClose={mockOnClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'success',
                message: 'pluginTrigger.modal.oauth.save.success',
            });
            (0, vitest_1.expect)(mockOnClose).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Remove OAuth Configuration', () => {
        (0, vitest_1.it)('should call deleteOAuth when remove button is clicked', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            const removeButton = react_1.screen.getByText('common.operation.remove');
            react_1.fireEvent.click(removeButton);
            (0, vitest_1.expect)(mockDeleteOAuth).toHaveBeenCalledWith('test-provider', vitest_1.expect.any(Object));
        });
        (0, vitest_1.it)('should show success toast when remove succeeds', () => {
            const mockOnClose = vitest_1.vi.fn();
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            mockDeleteOAuth.mockImplementation((provider, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled} onClose={mockOnClose}/>);
            const removeButton = react_1.screen.getByText('common.operation.remove');
            react_1.fireEvent.click(removeButton);
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'success',
                message: 'pluginTrigger.modal.oauth.remove.success',
            });
            (0, vitest_1.expect)(mockOnClose).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should show error toast when remove fails', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            mockDeleteOAuth.mockImplementation((provider, { onError }) => {
                onError(new Error('Delete failed'));
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            const removeButton = react_1.screen.getByText('common.operation.remove');
            react_1.fireEvent.click(removeButton);
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Delete failed',
            });
        });
    });
    (0, vitest_1.describe)('Modal Actions', () => {
        (0, vitest_1.it)('should call onClose when close button is clicked', () => {
            const mockOnClose = vitest_1.vi.fn();
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} onClose={mockOnClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-close'));
            (0, vitest_1.expect)(mockOnClose).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should call onClose when extra button (cancel) is clicked', () => {
            const mockOnClose = vitest_1.vi.fn();
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} onClose={mockOnClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-extra'));
            (0, vitest_1.expect)(mockOnClose).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Button Text States', () => {
        (0, vitest_1.it)('should show default button text initially', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('plugin.auth.saveAndAuth');
        });
        (0, vitest_1.it)('should show save only button text', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-cancel')).toHaveTextContent('plugin.auth.saveOnly');
        });
    });
    (0, vitest_1.describe)('OAuth Client Schema', () => {
        (0, vitest_1.it)('should populate form with existing params values', () => {
            const configWithParams = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: {
                    client_id: 'existing-client-id',
                    client_secret: 'existing-client-secret',
                },
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithParams}/>);
            const clientIdInput = react_1.screen.getByTestId('form-field-client_id');
            const clientSecretInput = react_1.screen.getByTestId('form-field-client_secret');
            (0, vitest_1.expect)(clientIdInput.defaultValue).toBe('existing-client-id');
            (0, vitest_1.expect)(clientSecretInput.defaultValue).toBe('existing-client-secret');
        });
        (0, vitest_1.it)('should handle empty oauth_client_schema', () => {
            const configWithEmptySchema = createMockOAuthConfig({
                system_configured: false,
                oauth_client_schema: [],
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithEmptySchema}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('base-form')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle undefined oauthConfig', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={undefined}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle missing provider', () => {
            const detailWithoutProvider = createMockPluginDetail({ provider: '' });
            mockUsePluginStore.mockReturnValue(detailWithoutProvider);
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Authorization Status Polling', () => {
        (0, vitest_1.it)('should initiate polling setup after OAuth starts', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onSuccess }) => {
                onSuccess({
                    authorization_url: 'https://oauth.example.com/authorize',
                    subscription_builder: createMockSubscriptionBuilder(),
                });
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // Verify OAuth flow was initiated
            (0, vitest_1.expect)(mockInitiateOAuth).toHaveBeenCalledWith('test-provider', vitest_1.expect.any(Object));
        });
        (0, vitest_1.it)('should continue polling when verifyBuilder returns an error', async () => {
            vitest_1.vi.useFakeTimers();
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onSuccess }) => {
                onSuccess({
                    authorization_url: 'https://oauth.example.com/authorize',
                    subscription_builder: createMockSubscriptionBuilder(),
                });
            });
            mockVerifyBuilder.mockImplementation((params, { onError }) => {
                onError(new Error('Verify failed'));
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            vitest_1.vi.advanceTimersByTime(3000);
            (0, vitest_1.expect)(mockVerifyBuilder).toHaveBeenCalled();
            // Should still be in pending state (polling continues)
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('pluginTrigger.modal.common.authorizing');
            vitest_1.vi.useRealTimers();
        });
    });
    (0, vitest_1.describe)('getErrorMessage helper', () => {
        (0, vitest_1.it)('should extract error message from Error object', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            mockDeleteOAuth.mockImplementation((provider, { onError }) => {
                onError(new Error('Custom error message'));
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.remove'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Custom error message',
            });
        });
        (0, vitest_1.it)('should extract error message from object with message property', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            mockDeleteOAuth.mockImplementation((provider, { onError }) => {
                onError({ message: 'Object error message' });
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.remove'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Object error message',
            });
        });
        (0, vitest_1.it)('should use fallback message when error has no message', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            mockDeleteOAuth.mockImplementation((provider, { onError }) => {
                onError({});
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.remove'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'pluginTrigger.modal.oauth.remove.failed',
            });
        });
        (0, vitest_1.it)('should use fallback when error.message is not a string', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            mockDeleteOAuth.mockImplementation((provider, { onError }) => {
                onError({ message: 123 });
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.remove'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'pluginTrigger.modal.oauth.remove.failed',
            });
        });
        (0, vitest_1.it)('should use fallback when error.message is empty string', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            mockDeleteOAuth.mockImplementation((provider, { onError }) => {
                onError({ message: '' });
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.remove'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'pluginTrigger.modal.oauth.remove.failed',
            });
        });
    });
    (0, vitest_1.describe)('OAuth callback edge cases', () => {
        (0, vitest_1.it)('should not show success toast when OAuth callback returns falsy data', () => {
            const mockOnClose = vitest_1.vi.fn();
            const mockShowOAuthCreateModal = vitest_1.vi.fn();
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onSuccess }) => {
                onSuccess({
                    authorization_url: 'https://oauth.example.com/authorize',
                    subscription_builder: createMockSubscriptionBuilder(),
                });
            });
            mockOpenOAuthPopup.mockImplementation((url, callback) => {
                callback(null);
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} onClose={mockOnClose} showOAuthCreateModal={mockShowOAuthCreateModal}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // Should not show success toast or call callbacks
            (0, vitest_1.expect)(mockToastNotify).not.toHaveBeenCalledWith(vitest_1.expect.objectContaining({ message: 'pluginTrigger.modal.oauth.authorization.authSuccess' }));
            (0, vitest_1.expect)(mockShowOAuthCreateModal).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Custom Client Type Save Flow', () => {
        (0, vitest_1.it)('should send enabled: true when custom client type is selected', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            // Switch to custom
            const customCard = react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom');
            react_1.fireEvent.click(customCard);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            (0, vitest_1.expect)(mockConfigureOAuth).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                enabled: true,
            }), vitest_1.expect.any(Object));
        });
        (0, vitest_1.it)('should send enabled: false when default client type is selected', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            // Default is already selected
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            (0, vitest_1.expect)(mockConfigureOAuth).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                enabled: false,
            }), vitest_1.expect.any(Object));
        });
    });
    (0, vitest_1.describe)('OAuth Client Schema Default Values', () => {
        (0, vitest_1.it)('should set default values from params to schema', () => {
            const configWithParams = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: {
                    client_id: 'my-client-id',
                    client_secret: 'my-client-secret',
                },
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithParams}/>);
            const clientIdInput = react_1.screen.getByTestId('form-field-client_id');
            const clientSecretInput = react_1.screen.getByTestId('form-field-client_secret');
            (0, vitest_1.expect)(clientIdInput.defaultValue).toBe('my-client-id');
            (0, vitest_1.expect)(clientSecretInput.defaultValue).toBe('my-client-secret');
        });
        (0, vitest_1.it)('should return empty array when oauth_client_schema is empty', () => {
            const configWithEmptySchema = createMockOAuthConfig({
                system_configured: false,
                oauth_client_schema: [],
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithEmptySchema}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('base-form')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should skip setting default when schema name is not in params', () => {
            const configWithPartialParams = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                params: {
                    client_id: 'my-client-id',
                    client_secret: '', // empty value - will not be set as default
                },
                oauth_client_schema: [
                    { name: 'client_id', type: 'text-input', required: true, label: { 'en-US': 'Client ID' } },
                    { name: 'client_secret', type: 'secret-input', required: true, label: { 'en-US': 'Client Secret' } },
                    { name: 'extra_param', type: 'text-input', required: false, label: { 'en-US': 'Extra Param' } },
                ],
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithPartialParams}/>);
            const clientIdInput = react_1.screen.getByTestId('form-field-client_id');
            (0, vitest_1.expect)(clientIdInput.defaultValue).toBe('my-client-id');
            // client_secret should have empty default since value is empty
            const clientSecretInput = react_1.screen.getByTestId('form-field-client_secret');
            (0, vitest_1.expect)(clientSecretInput.defaultValue).toBe('');
        });
    });
    (0, vitest_1.describe)('Confirm Button Text States', () => {
        (0, vitest_1.it)('should show saveAndAuth text by default', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('plugin.auth.saveAndAuth');
        });
        (0, vitest_1.it)('should show authorizing text when authorization is pending', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation(() => {
                // Don't call callback - stays pending
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('pluginTrigger.modal.common.authorizing');
        });
    });
    (0, vitest_1.describe)('Authorization Failed Status', () => {
        (0, vitest_1.it)('should set authorization status to Failed when OAuth initiation fails', () => {
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onError }) => {
                onError(new Error('OAuth failed'));
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // After failure, button text should return to default
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('plugin.auth.saveAndAuth');
        });
    });
    (0, vitest_1.describe)('Redirect URI Display', () => {
        (0, vitest_1.it)('should not show redirect URI info when redirect_uri is empty', () => {
            const configWithEmptyRedirectUri = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                redirect_uri: '',
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithEmptyRedirectUri}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('pluginTrigger.modal.oauthRedirectInfo')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should show redirect URI info when custom type and redirect_uri exists', () => {
            const configWithRedirectUri = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: true,
                redirect_uri: 'https://my-app.com/oauth/callback',
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithRedirectUri}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTrigger.modal.oauthRedirectInfo')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('https://my-app.com/oauth/callback')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Remove Button Visibility', () => {
        (0, vitest_1.it)('should not show remove button when custom_enabled is false', () => {
            const configWithCustomDisabled = createMockOAuthConfig({
                system_configured: false,
                custom_enabled: false,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomDisabled}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('common.operation.remove')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show remove button when default client type is selected', () => {
            const configWithCustomEnabled = createMockOAuthConfig({
                system_configured: true,
                custom_enabled: true,
                params: { client_id: 'test-id', client_secret: 'test-secret' },
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps} oauthConfig={configWithCustomEnabled}/>);
            // Default is selected by default when system_configured is true
            (0, vitest_1.expect)(react_1.screen.queryByText('common.operation.remove')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('OAuth Client Title', () => {
        (0, vitest_1.it)('should render client type title', () => {
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTrigger.subscription.addType.options.oauth.clientTitle')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Form Validation on Custom Save', () => {
        (0, vitest_1.it)('should not call configureOAuth when form validation fails', () => {
            setMockFormValues({
                values: { client_id: '', client_secret: '' },
                isCheckValidated: false,
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            // Switch to custom type
            const customCard = react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom');
            react_1.fireEvent.click(customCard);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            // Should not call configureOAuth because form validation failed
            (0, vitest_1.expect)(mockConfigureOAuth).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Client Params Hidden Value Transform', () => {
        (0, vitest_1.it)('should transform client_id to hidden when unchanged', () => {
            setMockFormValues({
                values: { client_id: 'default-client-id', client_secret: 'new-secret' },
                isCheckValidated: true,
            });
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            // Switch to custom type
            react_1.fireEvent.click(react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom'));
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            (0, vitest_1.expect)(mockConfigureOAuth).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                client_params: vitest_1.expect.objectContaining({
                    client_id: '[__HIDDEN__]',
                    client_secret: 'new-secret',
                }),
            }), vitest_1.expect.any(Object));
        });
        (0, vitest_1.it)('should transform client_secret to hidden when unchanged', () => {
            setMockFormValues({
                values: { client_id: 'new-id', client_secret: 'default-client-secret' },
                isCheckValidated: true,
            });
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            // Switch to custom type
            react_1.fireEvent.click(react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom'));
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            (0, vitest_1.expect)(mockConfigureOAuth).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                client_params: vitest_1.expect.objectContaining({
                    client_id: 'new-id',
                    client_secret: '[__HIDDEN__]',
                }),
            }), vitest_1.expect.any(Object));
        });
        (0, vitest_1.it)('should transform both client_id and client_secret to hidden when both unchanged', () => {
            setMockFormValues({
                values: { client_id: 'default-client-id', client_secret: 'default-client-secret' },
                isCheckValidated: true,
            });
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            // Switch to custom type
            react_1.fireEvent.click(react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom'));
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            (0, vitest_1.expect)(mockConfigureOAuth).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                client_params: vitest_1.expect.objectContaining({
                    client_id: '[__HIDDEN__]',
                    client_secret: '[__HIDDEN__]',
                }),
            }), vitest_1.expect.any(Object));
        });
        (0, vitest_1.it)('should send new values when both changed', () => {
            setMockFormValues({
                values: { client_id: 'new-client-id', client_secret: 'new-client-secret' },
                isCheckValidated: true,
            });
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            // Switch to custom type
            react_1.fireEvent.click(react_1.screen.getByTestId('option-card-pluginTrigger.subscription.addType.options.oauth.custom'));
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-cancel'));
            (0, vitest_1.expect)(mockConfigureOAuth).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                client_params: vitest_1.expect.objectContaining({
                    client_id: 'new-client-id',
                    client_secret: 'new-client-secret',
                }),
            }), vitest_1.expect.any(Object));
        });
    });
    (0, vitest_1.describe)('Polling Verification Success', () => {
        (0, vitest_1.it)('should call verifyBuilder and update status on success', async () => {
            vitest_1.vi.useFakeTimers({ shouldAdvanceTime: true });
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onSuccess }) => {
                onSuccess({
                    authorization_url: 'https://oauth.example.com/authorize',
                    subscription_builder: createMockSubscriptionBuilder(),
                });
            });
            mockVerifyBuilder.mockImplementation((params, { onSuccess }) => {
                onSuccess({ verified: true });
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // Advance timer to trigger polling
            await vitest_1.vi.advanceTimersByTimeAsync(3000);
            (0, vitest_1.expect)(mockVerifyBuilder).toHaveBeenCalled();
            // Button text should show waitingJump after verified
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('pluginTrigger.modal.oauth.authorization.waitingJump');
            });
            vitest_1.vi.useRealTimers();
        });
        (0, vitest_1.it)('should continue polling when not verified', async () => {
            vitest_1.vi.useFakeTimers({ shouldAdvanceTime: true });
            mockConfigureOAuth.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockInitiateOAuth.mockImplementation((provider, { onSuccess }) => {
                onSuccess({
                    authorization_url: 'https://oauth.example.com/authorize',
                    subscription_builder: createMockSubscriptionBuilder(),
                });
            });
            mockVerifyBuilder.mockImplementation((params, { onSuccess }) => {
                onSuccess({ verified: false });
            });
            (0, react_1.render)(<oauth_client_1.OAuthClientSettingsModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // First poll
            await vitest_1.vi.advanceTimersByTimeAsync(3000);
            (0, vitest_1.expect)(mockVerifyBuilder).toHaveBeenCalledTimes(1);
            // Second poll
            await vitest_1.vi.advanceTimersByTimeAsync(3000);
            (0, vitest_1.expect)(mockVerifyBuilder).toHaveBeenCalledTimes(2);
            // Should still be in authorizing state
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('pluginTrigger.modal.common.authorizing');
            vitest_1.vi.useRealTimers();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGgtY2xpZW50LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvYXV0aC1jbGllbnQuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrREFBMkU7QUFDM0UsK0JBQThCO0FBQzlCLG1DQUF3RTtBQUN4RSwwRUFBMEY7QUFFMUYscUJBQXFCO0FBQ3JCLGlEQUF5RDtBQVl6RCwrRUFBK0U7QUFDL0UseUJBQXlCO0FBQ3pCLCtFQUErRTtBQUUvRSxTQUFTLHFCQUFxQixDQUFDLFlBQXlDLEVBQUU7SUFDeEUsT0FBTztRQUNMLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsY0FBYyxFQUFFLEtBQUs7UUFDckIsaUJBQWlCLEVBQUUsSUFBSTtRQUN2QixZQUFZLEVBQUUsb0NBQW9DO1FBQ2xELE1BQU0sRUFBRTtZQUNOLFNBQVMsRUFBRSxtQkFBbUI7WUFDOUIsYUFBYSxFQUFFLHVCQUF1QjtTQUN2QztRQUNELG1CQUFtQixFQUFFO1lBQ25CLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsWUFBdUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQWEsRUFBRTtZQUNoSCxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLGNBQXlCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFhLEVBQUU7U0FDOUU7UUFDOUMsR0FBRyxTQUFTO0tBQ2IsQ0FBQTtBQUNILENBQUM7QUFFRCxTQUFTLHNCQUFzQixDQUFDLFlBQW1DLEVBQUU7SUFDbkUsT0FBTztRQUNMLFNBQVMsRUFBRSxnQkFBZ0I7UUFDM0IsUUFBUSxFQUFFLGVBQWU7UUFDekIsSUFBSSxFQUFFLGFBQWE7UUFDbkIsR0FBRyxTQUFTO0tBQ2IsQ0FBQTtBQUNILENBQUM7QUFFRCxTQUFTLDZCQUE2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Q0FBQTtZQUVsRCx1Q0FBdUM7WUFDdkMsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLHdDQUF3QyxDQUFDLENBQUE7WUFFdkcsV0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgVHJpZ2dlck9BdXRoQ29uZmlnLCBUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgYWZ0ZXJFYWNoLCBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90eXBlcydcblxuLy8gSW1wb3J0IGFmdGVyIG1vY2tzXG5pbXBvcnQgeyBPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgfSBmcm9tICcuL29hdXRoLWNsaWVudCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVHlwZSBEZWZpbml0aW9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG50eXBlIFBsdWdpbkRldGFpbCA9IHtcbiAgcGx1Z2luX2lkOiBzdHJpbmdcbiAgcHJvdmlkZXI6IHN0cmluZ1xuICBuYW1lOiBzdHJpbmdcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBGYWN0b3J5IEZ1bmN0aW9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjcmVhdGVNb2NrT0F1dGhDb25maWcob3ZlcnJpZGVzOiBQYXJ0aWFsPFRyaWdnZXJPQXV0aENvbmZpZz4gPSB7fSk6IFRyaWdnZXJPQXV0aENvbmZpZyB7XG4gIHJldHVybiB7XG4gICAgY29uZmlndXJlZDogdHJ1ZSxcbiAgICBjdXN0b21fY29uZmlndXJlZDogZmFsc2UsXG4gICAgY3VzdG9tX2VuYWJsZWQ6IGZhbHNlLFxuICAgIHN5c3RlbV9jb25maWd1cmVkOiB0cnVlLFxuICAgIHJlZGlyZWN0X3VyaTogJ2h0dHBzOi8vZXhhbXBsZS5jb20vb2F1dGgvY2FsbGJhY2snLFxuICAgIHBhcmFtczoge1xuICAgICAgY2xpZW50X2lkOiAnZGVmYXVsdC1jbGllbnQtaWQnLFxuICAgICAgY2xpZW50X3NlY3JldDogJ2RlZmF1bHQtY2xpZW50LXNlY3JldCcsXG4gICAgfSxcbiAgICBvYXV0aF9jbGllbnRfc2NoZW1hOiBbXG4gICAgICB7IG5hbWU6ICdjbGllbnRfaWQnLCB0eXBlOiAndGV4dC1pbnB1dCcgYXMgdW5rbm93biwgcmVxdWlyZWQ6IHRydWUsIGxhYmVsOiB7ICdlbi1VUyc6ICdDbGllbnQgSUQnIH0gYXMgdW5rbm93biB9LFxuICAgICAgeyBuYW1lOiAnY2xpZW50X3NlY3JldCcsIHR5cGU6ICdzZWNyZXQtaW5wdXQnIGFzIHVua25vd24sIHJlcXVpcmVkOiB0cnVlLCBsYWJlbDogeyAnZW4tVVMnOiAnQ2xpZW50IFNlY3JldCcgfSBhcyB1bmtub3duIH0sXG4gICAgXSBhcyBUcmlnZ2VyT0F1dGhDb25maWdbJ29hdXRoX2NsaWVudF9zY2hlbWEnXSxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9ja1BsdWdpbkRldGFpbChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luRGV0YWlsPiA9IHt9KTogUGx1Z2luRGV0YWlsIHtcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcsXG4gICAgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyJyxcbiAgICBuYW1lOiAnVGVzdCBQbHVnaW4nLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcihvdmVycmlkZXM6IFBhcnRpYWw8VHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXI+ID0ge30pOiBUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlciB7XG4gIHJldHVybiB7XG4gICAgaWQ6ICdidWlsZGVyLTEyMycsXG4gICAgbmFtZTogJ1Rlc3QgQnVpbGRlcicsXG4gICAgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyJyxcbiAgICBjcmVkZW50aWFsX3R5cGU6IFRyaWdnZXJDcmVkZW50aWFsVHlwZUVudW0uT2F1dGgyLFxuICAgIGNyZWRlbnRpYWxzOiB7fSxcbiAgICBlbmRwb2ludDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vY2FsbGJhY2snLFxuICAgIHBhcmFtZXRlcnM6IHt9LFxuICAgIHByb3BlcnRpZXM6IHt9LFxuICAgIHdvcmtmbG93c19pbl91c2U6IDAsXG4gICAgLi4ub3ZlcnJpZGVzLFxuICB9XG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgU2V0dXBcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBwbHVnaW4gc3RvcmVcbmNvbnN0IG1vY2tQbHVnaW5EZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcbmNvbnN0IG1vY2tVc2VQbHVnaW5TdG9yZSA9IHZpLmZuKCgpID0+IG1vY2tQbHVnaW5EZXRhaWwpXG52aS5tb2NrKCcuLi8uLi9zdG9yZScsICgpID0+ICh7XG4gIHVzZVBsdWdpblN0b3JlOiAoKSA9PiBtb2NrVXNlUGx1Z2luU3RvcmUoKSxcbn0pKVxuXG4vLyBNb2NrIHNlcnZpY2UgaG9va3NcbmNvbnN0IG1vY2tJbml0aWF0ZU9BdXRoID0gdmkuZm4oKVxuY29uc3QgbW9ja1ZlcmlmeUJ1aWxkZXIgPSB2aS5mbigpXG5jb25zdCBtb2NrQ29uZmlndXJlT0F1dGggPSB2aS5mbigpXG5jb25zdCBtb2NrRGVsZXRlT0F1dGggPSB2aS5mbigpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtdHJpZ2dlcnMnLCAoKSA9PiAoe1xuICB1c2VJbml0aWF0ZVRyaWdnZXJPQXV0aDogKCkgPT4gKHtcbiAgICBtdXRhdGU6IG1vY2tJbml0aWF0ZU9BdXRoLFxuICB9KSxcbiAgdXNlVmVyaWZ5QW5kVXBkYXRlVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXI6ICgpID0+ICh7XG4gICAgbXV0YXRlOiBtb2NrVmVyaWZ5QnVpbGRlcixcbiAgfSksXG4gIHVzZUNvbmZpZ3VyZVRyaWdnZXJPQXV0aDogKCkgPT4gKHtcbiAgICBtdXRhdGU6IG1vY2tDb25maWd1cmVPQXV0aCxcbiAgfSksXG4gIHVzZURlbGV0ZVRyaWdnZXJPQXV0aDogKCkgPT4gKHtcbiAgICBtdXRhdGU6IG1vY2tEZWxldGVPQXV0aCxcbiAgfSksXG59KSlcblxuLy8gTW9jayBPQXV0aCBwb3B1cFxuY29uc3QgbW9ja09wZW5PQXV0aFBvcHVwID0gdmkuZm4oKVxudmkubW9jaygnQC9ob29rcy91c2Utb2F1dGgnLCAoKSA9PiAoe1xuICBvcGVuT0F1dGhQb3B1cDogKHVybDogc3RyaW5nLCBjYWxsYmFjazogKGRhdGE6IHVua25vd24pID0+IHZvaWQpID0+IG1vY2tPcGVuT0F1dGhQb3B1cCh1cmwsIGNhbGxiYWNrKSxcbn0pKVxuXG4vLyBNb2NrIHRvYXN0XG5jb25zdCBtb2NrVG9hc3ROb3RpZnkgPSB2aS5mbigpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgbm90aWZ5OiAocGFyYW1zOiB1bmtub3duKSA9PiBtb2NrVG9hc3ROb3RpZnkocGFyYW1zKSxcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIGNsaXBib2FyZCBBUElcbmNvbnN0IG1vY2tDbGlwYm9hcmRXcml0ZVRleHQgPSB2aS5mbigpXG5PYmplY3QuYXNzaWduKG5hdmlnYXRvciwge1xuICBjbGlwYm9hcmQ6IHtcbiAgICB3cml0ZVRleHQ6IG1vY2tDbGlwYm9hcmRXcml0ZVRleHQsXG4gIH0sXG59KVxuXG4vLyBNb2NrIE1vZGFsIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL21vZGFsL21vZGFsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICBjaGlsZHJlbixcbiAgICBvbkNsb3NlLFxuICAgIG9uQ29uZmlybSxcbiAgICBvbkNhbmNlbCxcbiAgICB0aXRsZSxcbiAgICBjb25maXJtQnV0dG9uVGV4dCxcbiAgICBjYW5jZWxCdXR0b25UZXh0LFxuICAgIGZvb3RlclNsb3QsXG4gICAgb25FeHRyYUJ1dHRvbkNsaWNrLFxuICAgIGV4dHJhQnV0dG9uVGV4dCxcbiAgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBvbkNsb3NlOiAoKSA9PiB2b2lkXG4gICAgb25Db25maXJtOiAoKSA9PiB2b2lkXG4gICAgb25DYW5jZWw6ICgpID0+IHZvaWRcbiAgICB0aXRsZTogc3RyaW5nXG4gICAgY29uZmlybUJ1dHRvblRleHQ6IHN0cmluZ1xuICAgIGNhbmNlbEJ1dHRvblRleHQ/OiBzdHJpbmdcbiAgICBmb290ZXJTbG90PzogUmVhY3QuUmVhY3ROb2RlXG4gICAgb25FeHRyYUJ1dHRvbkNsaWNrPzogKCkgPT4gdm9pZFxuICAgIGV4dHJhQnV0dG9uVGV4dD86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cIm1vZGFsXCI+XG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibW9kYWwtdGl0bGVcIj57dGl0bGV9PC9kaXY+XG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibW9kYWwtY29udGVudFwiPntjaGlsZHJlbn08L2Rpdj5cbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtb2RhbC1mb290ZXJcIj5cbiAgICAgICAge2Zvb3RlclNsb3R9XG4gICAgICAgIHtleHRyYUJ1dHRvblRleHQgJiYgKFxuICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1leHRyYVwiIG9uQ2xpY2s9e29uRXh0cmFCdXR0b25DbGlja30+e2V4dHJhQnV0dG9uVGV4dH08L2J1dHRvbj5cbiAgICAgICAgKX1cbiAgICAgICAge2NhbmNlbEJ1dHRvblRleHQgJiYgKFxuICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jYW5jZWxcIiBvbkNsaWNrPXtvbkNhbmNlbH0+e2NhbmNlbEJ1dHRvblRleHR9PC9idXR0b24+XG4gICAgICAgICl9XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jb25maXJtXCIgb25DbGljaz17b25Db25maXJtfT57Y29uZmlybUJ1dHRvblRleHR9PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJtb2RhbC1jbG9zZVwiIG9uQ2xpY2s9e29uQ2xvc2V9PkNsb3NlPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIEJ1dHRvbiBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9idXR0b24nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBjaGlsZHJlbiwgb25DbGljaywgdmFyaWFudCwgY2xhc3NOYW1lIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgb25DbGljaz86ICgpID0+IHZvaWRcbiAgICB2YXJpYW50Pzogc3RyaW5nXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8YnV0dG9uXG4gICAgICBkYXRhLXRlc3RpZD17YGJ1dHRvbi0ke3ZhcmlhbnQgfHwgJ2RlZmF1bHQnfWB9XG4gICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvYnV0dG9uPlxuICApLFxufSkpXG4vLyBDb25maWd1cmFibGUgZm9ybSBtb2NrIHZhbHVlc1xubGV0IG1vY2tGb3JtVmFsdWVzOiB7IHZhbHVlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgaXNDaGVja1ZhbGlkYXRlZDogYm9vbGVhbiB9ID0ge1xuICB2YWx1ZXM6IHsgY2xpZW50X2lkOiAndGVzdC1jbGllbnQtaWQnLCBjbGllbnRfc2VjcmV0OiAndGVzdC1jbGllbnQtc2VjcmV0JyB9LFxuICBpc0NoZWNrVmFsaWRhdGVkOiB0cnVlLFxufVxuY29uc3Qgc2V0TW9ja0Zvcm1WYWx1ZXMgPSAodmFsdWVzOiB0eXBlb2YgbW9ja0Zvcm1WYWx1ZXMpID0+IHtcbiAgbW9ja0Zvcm1WYWx1ZXMgPSB2YWx1ZXNcbn1cblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0vY29tcG9uZW50cy9iYXNlJywgKCkgPT4gKHtcbiAgQmFzZUZvcm06IFJlYWN0LmZvcndhcmRSZWYoKFxuICAgIHsgZm9ybVNjaGVtYXMgfTogeyBmb3JtU2NoZW1hczogQXJyYXk8eyBuYW1lOiBzdHJpbmcsIGRlZmF1bHQ/OiBzdHJpbmcgfT4gfSxcbiAgICByZWY6IFJlYWN0LkZvcndhcmRlZFJlZjx7IGdldEZvcm1WYWx1ZXM6ICgpID0+IHsgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBpc0NoZWNrVmFsaWRhdGVkOiBib29sZWFuIH0gfT4sXG4gICkgPT4ge1xuICAgIFJlYWN0LnVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCAoKSA9PiAoe1xuICAgICAgZ2V0Rm9ybVZhbHVlczogKCkgPT4gbW9ja0Zvcm1WYWx1ZXMsXG4gICAgfSkpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJiYXNlLWZvcm1cIj5cbiAgICAgICAge2Zvcm1TY2hlbWFzLm1hcChzY2hlbWEgPT4gKFxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAga2V5PXtzY2hlbWEubmFtZX1cbiAgICAgICAgICAgIGRhdGEtdGVzdGlkPXtgZm9ybS1maWVsZC0ke3NjaGVtYS5uYW1lfWB9XG4gICAgICAgICAgICBuYW1lPXtzY2hlbWEubmFtZX1cbiAgICAgICAgICAgIGRlZmF1bHRWYWx1ZT17c2NoZW1hLmRlZmF1bHQgfHwgJyd9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgT3B0aW9uQ2FyZCBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvX2Jhc2UvY29tcG9uZW50cy9vcHRpb24tY2FyZCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHRpdGxlLCBvblNlbGVjdCwgc2VsZWN0ZWQsIGNsYXNzTmFtZSB9OiB7XG4gICAgdGl0bGU6IHN0cmluZ1xuICAgIG9uU2VsZWN0OiAoKSA9PiB2b2lkXG4gICAgc2VsZWN0ZWQ6IGJvb2xlYW5cbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbiAgfSkgPT4gKFxuICAgIDxkaXZcbiAgICAgIGRhdGEtdGVzdGlkPXtgb3B0aW9uLWNhcmQtJHt0aXRsZX1gfVxuICAgICAgb25DbGljaz17b25TZWxlY3R9XG4gICAgICBjbGFzc05hbWU9e2Ake2NsYXNzTmFtZX0gJHtzZWxlY3RlZCA/ICdzZWxlY3RlZCcgOiAnJ31gfVxuICAgICAgZGF0YS1zZWxlY3RlZD17c2VsZWN0ZWR9XG4gICAgPlxuICAgICAge3RpdGxlfVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdPQXV0aENsaWVudFNldHRpbmdzTW9kYWwnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBvYXV0aENvbmZpZzogY3JlYXRlTW9ja09BdXRoQ29uZmlnKCksXG4gICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICBzaG93T0F1dGhDcmVhdGVNb2RhbDogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUobW9ja1BsdWdpbkRldGFpbClcbiAgICBtb2NrQ2xpcGJvYXJkV3JpdGVUZXh0Lm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAvLyBSZXNldCBmb3JtIHZhbHVlcyB0byBkZWZhdWx0XG4gICAgc2V0TW9ja0Zvcm1WYWx1ZXMoe1xuICAgICAgdmFsdWVzOiB7IGNsaWVudF9pZDogJ3Rlc3QtY2xpZW50LWlkJywgY2xpZW50X3NlY3JldDogJ3Rlc3QtY2xpZW50LXNlY3JldCcgfSxcbiAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG4gICAgfSlcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgd2l0aCBjb3JyZWN0IHRpdGxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLXRpdGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoLnRpdGxlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xpZW50IHR5cGUgc2VsZWN0b3Igd2hlbiBzeXN0ZW1fY29uZmlndXJlZCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1jYXJkLXBsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmFkZFR5cGUub3B0aW9ucy5vYXV0aC5kZWZhdWx0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1jYXJkLXBsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmFkZFR5cGUub3B0aW9ucy5vYXV0aC5jdXN0b20nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgY2xpZW50IHR5cGUgc2VsZWN0b3Igd2hlbiBzeXN0ZW1fY29uZmlndXJlZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhvdXRTeXN0ZW1Db25maWd1cmVkID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhvdXRTeXN0ZW1Db25maWd1cmVkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdvcHRpb24tY2FyZC1wbHVnaW5UcmlnZ2VyLnN1YnNjcmlwdGlvbi5hZGRUeXBlLm9wdGlvbnMub2F1dGguZGVmYXVsdCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZWRpcmVjdCBVUkkgaW5mbyB3aGVuIGN1c3RvbSBjbGllbnQgdHlwZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhDdXN0b21FbmFibGVkID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoQ3VzdG9tRW5hYmxlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoUmVkaXJlY3RJbmZvJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL2V4YW1wbGUuY29tL29hdXRoL2NhbGxiYWNrJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xpZW50IGZvcm0gd2hlbiBjdXN0b20gdHlwZSBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhDdXN0b21FbmFibGVkID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoQ3VzdG9tRW5hYmxlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Jhc2UtZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyByZW1vdmUgYnV0dG9uIHdoZW4gY3VzdG9tX2VuYWJsZWQgYW5kIHBhcmFtcyBleGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhDdXN0b21FbmFibGVkID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcGFyYW1zOiB7IGNsaWVudF9pZDogJ3Rlc3QtaWQnLCBjbGllbnRfc2VjcmV0OiAndGVzdC1zZWNyZXQnIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBvYXV0aENvbmZpZz17Y29uZmlnV2l0aEN1c3RvbUVuYWJsZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5yZW1vdmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NsaWVudCBUeXBlIFNlbGVjdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRlZmF1bHQgdG8gRGVmYXVsdCBjbGllbnQgdHlwZSB3aGVuIHN5c3RlbV9jb25maWd1cmVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgZGVmYXVsdENhcmQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1jYXJkLXBsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmFkZFR5cGUub3B0aW9ucy5vYXV0aC5kZWZhdWx0JylcbiAgICAgIGV4cGVjdChkZWZhdWx0Q2FyZCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHN3aXRjaCB0byBDdXN0b20gY2xpZW50IHR5cGUgd2hlbiBDdXN0b20gY2FyZCBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGN1c3RvbUNhcmQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1jYXJkLXBsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmFkZFR5cGUub3B0aW9ucy5vYXV0aC5jdXN0b20nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGN1c3RvbUNhcmQpXG5cbiAgICAgIGV4cGVjdChjdXN0b21DYXJkKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc2VsZWN0ZWQnLCAndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3dpdGNoIGJhY2sgdG8gRGVmYXVsdCBjbGllbnQgdHlwZSB3aGVuIERlZmF1bHQgY2FyZCBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGN1c3RvbUNhcmQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1jYXJkLXBsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmFkZFR5cGUub3B0aW9ucy5vYXV0aC5jdXN0b20nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGN1c3RvbUNhcmQpXG5cbiAgICAgIGNvbnN0IGRlZmF1bHRDYXJkID0gc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tY2FyZC1wbHVnaW5UcmlnZ2VyLnN1YnNjcmlwdGlvbi5hZGRUeXBlLm9wdGlvbnMub2F1dGguZGVmYXVsdCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZGVmYXVsdENhcmQpXG5cbiAgICAgIGV4cGVjdChkZWZhdWx0Q2FyZCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXNlbGVjdGVkJywgJ3RydWUnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvcHkgUmVkaXJlY3QgVVJJJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29weSByZWRpcmVjdCBVUkkgd2hlbiBjb3B5IGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnV2l0aEN1c3RvbUVuYWJsZWQgPSBjcmVhdGVNb2NrT0F1dGhDb25maWcoe1xuICAgICAgICBzeXN0ZW1fY29uZmlndXJlZDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9lbmFibGVkOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhDdXN0b21FbmFibGVkfSAvPilcblxuICAgICAgY29uc3QgY29weUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY29weScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29weUJ1dHRvbilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ2xpcGJvYXJkV3JpdGVUZXh0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnaHR0cHM6Ly9leGFtcGxlLmNvbS9vYXV0aC9jYWxsYmFjaycpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogJ2NvbW1vbi5hY3Rpb25Nc2cuY29weVN1Y2Nlc3NmdWxseScsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ09BdXRoIEF1dGhvcml6YXRpb24gRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYXRlIE9BdXRoIHdoZW4gY29uZmlybSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIG1vY2tDb25maWd1cmVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgZXhwZWN0KG1vY2tDb25maWd1cmVPQXV0aCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgb3BlbiBPQXV0aCBwb3B1cCBhZnRlciBzdWNjZXNzZnVsIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgICBtb2NrQ29uZmlndXJlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG4gICAgICBtb2NrSW5pdGlhdGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHByb3ZpZGVyLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2Vzcyh7XG4gICAgICAgICAgYXV0aG9yaXphdGlvbl91cmw6ICdodHRwczovL29hdXRoLmV4YW1wbGUuY29tL2F1dGhvcml6ZScsXG4gICAgICAgICAgc3Vic2NyaXB0aW9uX2J1aWxkZXI6IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKCksXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICBleHBlY3QobW9ja09wZW5PQXV0aFBvcHVwKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgJ2h0dHBzOi8vb2F1dGguZXhhbXBsZS5jb20vYXV0aG9yaXplJyxcbiAgICAgICAgZXhwZWN0LmFueShGdW5jdGlvbiksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBzdWNjZXNzIHRvYXN0IGFuZCBjbG9zZSBtb2RhbCB3aGVuIE9BdXRoIGNhbGxiYWNrIHN1Y2NlZWRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja09uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBtb2NrU2hvd09BdXRoQ3JlYXRlTW9kYWwgPSB2aS5mbigpXG5cbiAgICAgIG1vY2tDb25maWd1cmVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcbiAgICAgIG1vY2tJbml0aWF0ZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocHJvdmlkZXIsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgICAgb25TdWNjZXNzKHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uX3VybDogJ2h0dHBzOi8vb2F1dGguZXhhbXBsZS5jb20vYXV0aG9yaXplJyxcbiAgICAgICAgICBzdWJzY3JpcHRpb25fYnVpbGRlcjogYnVpbGRlcixcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBtb2NrT3Blbk9BdXRoUG9wdXAubW9ja0ltcGxlbWVudGF0aW9uKCh1cmwsIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKHsgc3VjY2VzczogdHJ1ZSB9KVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBvbkNsb3NlPXttb2NrT25DbG9zZX1cbiAgICAgICAgICBzaG93T0F1dGhDcmVhdGVNb2RhbD17bW9ja1Nob3dPQXV0aENyZWF0ZU1vZGFsfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgbWVzc2FnZTogJ3BsdWdpblRyaWdnZXIubW9kYWwub2F1dGguYXV0aG9yaXphdGlvbi5hdXRoU3VjY2VzcycsXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHRvYXN0IHdoZW4gT0F1dGggaW5pdGlhdGlvbiBmYWlscycsICgpID0+IHtcbiAgICAgIG1vY2tDb25maWd1cmVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcbiAgICAgIG1vY2tJbml0aWF0ZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocHJvdmlkZXIsIHsgb25FcnJvciB9KSA9PiB7XG4gICAgICAgIG9uRXJyb3IobmV3IEVycm9yKCdPQXV0aCBmYWlsZWQnKSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIGV4cGVjdChtb2NrVG9hc3ROb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ3BsdWdpblRyaWdnZXIubW9kYWwub2F1dGguYXV0aG9yaXphdGlvbi5hdXRoRmFpbGVkJyxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU2F2ZSBPbmx5IEZsb3cnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzYXZlIGNvbmZpZ3VyYXRpb24gd2l0aG91dCBhdXRob3JpemF0aW9uIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgbW9ja0NvbmZpZ3VyZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY2FuY2VsJykpXG5cbiAgICAgIGV4cGVjdChtb2NrQ29uZmlndXJlT0F1dGgpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyJyxcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHN1Y2Nlc3MgdG9hc3Qgd2hlbiBzYXZlIG9ubHkgc3VjY2VlZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrT25DbG9zZSA9IHZpLmZuKClcbiAgICAgIG1vY2tDb25maWd1cmVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb25DbG9zZT17bW9ja09uQ2xvc2V9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jYW5jZWwnKSlcblxuICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgIG1lc3NhZ2U6ICdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoLnNhdmUuc3VjY2VzcycsXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW1vdmUgT0F1dGggQ29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgZGVsZXRlT0F1dGggd2hlbiByZW1vdmUgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb25maWdXaXRoQ3VzdG9tRW5hYmxlZCA9IGNyZWF0ZU1vY2tPQXV0aENvbmZpZyh7XG4gICAgICAgIHN5c3RlbV9jb25maWd1cmVkOiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIHBhcmFtczogeyBjbGllbnRfaWQ6ICd0ZXN0LWlkJywgY2xpZW50X3NlY3JldDogJ3Rlc3Qtc2VjcmV0JyB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhDdXN0b21FbmFibGVkfSAvPilcblxuICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5yZW1vdmUnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJlbW92ZUJ1dHRvbilcblxuICAgICAgZXhwZWN0KG1vY2tEZWxldGVPQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICd0ZXN0LXByb3ZpZGVyJyxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgc3VjY2VzcyB0b2FzdCB3aGVuIHJlbW92ZSBzdWNjZWVkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgY29uZmlnV2l0aEN1c3RvbUVuYWJsZWQgPSBjcmVhdGVNb2NrT0F1dGhDb25maWcoe1xuICAgICAgICBzeXN0ZW1fY29uZmlndXJlZDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9lbmFibGVkOiB0cnVlLFxuICAgICAgICBwYXJhbXM6IHsgY2xpZW50X2lkOiAndGVzdC1pZCcsIGNsaWVudF9zZWNyZXQ6ICd0ZXN0LXNlY3JldCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIG1vY2tEZWxldGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHByb3ZpZGVyLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWxcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIG9hdXRoQ29uZmlnPXtjb25maWdXaXRoQ3VzdG9tRW5hYmxlZH1cbiAgICAgICAgICBvbkNsb3NlPXttb2NrT25DbG9zZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ucmVtb3ZlJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhyZW1vdmVCdXR0b24pXG5cbiAgICAgIGV4cGVjdChtb2NrVG9hc3ROb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICBtZXNzYWdlOiAncGx1Z2luVHJpZ2dlci5tb2RhbC5vYXV0aC5yZW1vdmUuc3VjY2VzcycsXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG1vY2tPbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHRvYXN0IHdoZW4gcmVtb3ZlIGZhaWxzJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnV2l0aEN1c3RvbUVuYWJsZWQgPSBjcmVhdGVNb2NrT0F1dGhDb25maWcoe1xuICAgICAgICBzeXN0ZW1fY29uZmlndXJlZDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9lbmFibGVkOiB0cnVlLFxuICAgICAgICBwYXJhbXM6IHsgY2xpZW50X2lkOiAndGVzdC1pZCcsIGNsaWVudF9zZWNyZXQ6ICd0ZXN0LXNlY3JldCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIG1vY2tEZWxldGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHByb3ZpZGVyLCB7IG9uRXJyb3IgfSkgPT4ge1xuICAgICAgICBvbkVycm9yKG5ldyBFcnJvcignRGVsZXRlIGZhaWxlZCcpKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhDdXN0b21FbmFibGVkfSAvPilcblxuICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5yZW1vdmUnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHJlbW92ZUJ1dHRvbilcblxuICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnRGVsZXRlIGZhaWxlZCcsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01vZGFsIEFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBjbG9zZSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb25DbG9zZT17bW9ja09uQ2xvc2V9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jbG9zZScpKVxuXG4gICAgICBleHBlY3QobW9ja09uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIGV4dHJhIGJ1dHRvbiAoY2FuY2VsKSBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja09uQ2xvc2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBvbkNsb3NlPXttb2NrT25DbG9zZX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWV4dHJhJykpXG5cbiAgICAgIGV4cGVjdChtb2NrT25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQnV0dG9uIFRleHQgU3RhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBkZWZhdWx0IGJ1dHRvbiB0ZXh0IGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW4uYXV0aC5zYXZlQW5kQXV0aCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBzYXZlIG9ubHkgYnV0dG9uIHRleHQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY2FuY2VsJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW4uYXV0aC5zYXZlT25seScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnT0F1dGggQ2xpZW50IFNjaGVtYScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBvcHVsYXRlIGZvcm0gd2l0aCBleGlzdGluZyBwYXJhbXMgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnV2l0aFBhcmFtcyA9IGNyZWF0ZU1vY2tPQXV0aENvbmZpZyh7XG4gICAgICAgIHN5c3RlbV9jb25maWd1cmVkOiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ2V4aXN0aW5nLWNsaWVudC1pZCcsXG4gICAgICAgICAgY2xpZW50X3NlY3JldDogJ2V4aXN0aW5nLWNsaWVudC1zZWNyZXQnLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhQYXJhbXN9IC8+KVxuXG4gICAgICBjb25zdCBjbGllbnRJZElucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLWNsaWVudF9pZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIGNvbnN0IGNsaWVudFNlY3JldElucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLWNsaWVudF9zZWNyZXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG5cbiAgICAgIGV4cGVjdChjbGllbnRJZElucHV0LmRlZmF1bHRWYWx1ZSkudG9CZSgnZXhpc3RpbmctY2xpZW50LWlkJylcbiAgICAgIGV4cGVjdChjbGllbnRTZWNyZXRJbnB1dC5kZWZhdWx0VmFsdWUpLnRvQmUoJ2V4aXN0aW5nLWNsaWVudC1zZWNyZXQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBvYXV0aF9jbGllbnRfc2NoZW1hJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnV2l0aEVtcHR5U2NoZW1hID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBvYXV0aF9jbGllbnRfc2NoZW1hOiBbXSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoRW1wdHlTY2hlbWF9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2Jhc2UtZm9ybScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIG9hdXRoQ29uZmlnJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e3VuZGVmaW5lZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBwcm92aWRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhvdXRQcm92aWRlciA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoeyBwcm92aWRlcjogJycgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aG91dFByb3ZpZGVyKVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0F1dGhvcml6YXRpb24gU3RhdHVzIFBvbGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbml0aWF0ZSBwb2xsaW5nIHNldHVwIGFmdGVyIE9BdXRoIHN0YXJ0cycsICgpID0+IHtcbiAgICAgIG1vY2tDb25maWd1cmVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcbiAgICAgIG1vY2tJbml0aWF0ZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocHJvdmlkZXIsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uX3VybDogJ2h0dHBzOi8vb2F1dGguZXhhbXBsZS5jb20vYXV0aG9yaXplJyxcbiAgICAgICAgICBzdWJzY3JpcHRpb25fYnVpbGRlcjogY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoKSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIC8vIFZlcmlmeSBPQXV0aCBmbG93IHdhcyBpbml0aWF0ZWRcbiAgICAgIGV4cGVjdChtb2NrSW5pdGlhdGVPQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICd0ZXN0LXByb3ZpZGVyJyxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbnRpbnVlIHBvbGxpbmcgd2hlbiB2ZXJpZnlCdWlsZGVyIHJldHVybnMgYW4gZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgICB2aS51c2VGYWtlVGltZXJzKClcbiAgICAgIG1vY2tDb25maWd1cmVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcbiAgICAgIG1vY2tJbml0aWF0ZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocHJvdmlkZXIsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uX3VybDogJ2h0dHBzOi8vb2F1dGguZXhhbXBsZS5jb20vYXV0aG9yaXplJyxcbiAgICAgICAgICBzdWJzY3JpcHRpb25fYnVpbGRlcjogY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoKSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBtb2NrVmVyaWZ5QnVpbGRlci5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvbkVycm9yIH0pID0+IHtcbiAgICAgICAgb25FcnJvcihuZXcgRXJyb3IoJ1ZlcmlmeSBmYWlsZWQnKSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIHZpLmFkdmFuY2VUaW1lcnNCeVRpbWUoMzAwMClcbiAgICAgIGV4cGVjdChtb2NrVmVyaWZ5QnVpbGRlcikudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIC8vIFNob3VsZCBzdGlsbCBiZSBpbiBwZW5kaW5nIHN0YXRlIChwb2xsaW5nIGNvbnRpbnVlcylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpblRyaWdnZXIubW9kYWwuY29tbW9uLmF1dGhvcml6aW5nJylcblxuICAgICAgdmkudXNlUmVhbFRpbWVycygpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0RXJyb3JNZXNzYWdlIGhlbHBlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGV4dHJhY3QgZXJyb3IgbWVzc2FnZSBmcm9tIEVycm9yIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhDdXN0b21FbmFibGVkID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcGFyYW1zOiB7IGNsaWVudF9pZDogJ3Rlc3QtaWQnLCBjbGllbnRfc2VjcmV0OiAndGVzdC1zZWNyZXQnIH0sXG4gICAgICB9KVxuXG4gICAgICBtb2NrRGVsZXRlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwcm92aWRlciwgeyBvbkVycm9yIH0pID0+IHtcbiAgICAgICAgb25FcnJvcihuZXcgRXJyb3IoJ0N1c3RvbSBlcnJvciBtZXNzYWdlJykpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBvYXV0aENvbmZpZz17Y29uZmlnV2l0aEN1c3RvbUVuYWJsZWR9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5yZW1vdmUnKSlcblxuICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICBtZXNzYWdlOiAnQ3VzdG9tIGVycm9yIG1lc3NhZ2UnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IGVycm9yIG1lc3NhZ2UgZnJvbSBvYmplY3Qgd2l0aCBtZXNzYWdlIHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnV2l0aEN1c3RvbUVuYWJsZWQgPSBjcmVhdGVNb2NrT0F1dGhDb25maWcoe1xuICAgICAgICBzeXN0ZW1fY29uZmlndXJlZDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9lbmFibGVkOiB0cnVlLFxuICAgICAgICBwYXJhbXM6IHsgY2xpZW50X2lkOiAndGVzdC1pZCcsIGNsaWVudF9zZWNyZXQ6ICd0ZXN0LXNlY3JldCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIG1vY2tEZWxldGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHByb3ZpZGVyLCB7IG9uRXJyb3IgfSkgPT4ge1xuICAgICAgICBvbkVycm9yKHsgbWVzc2FnZTogJ09iamVjdCBlcnJvciBtZXNzYWdlJyB9KVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhDdXN0b21FbmFibGVkfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ucmVtb3ZlJykpXG5cbiAgICAgIGV4cGVjdChtb2NrVG9hc3ROb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ09iamVjdCBlcnJvciBtZXNzYWdlJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGZhbGxiYWNrIG1lc3NhZ2Ugd2hlbiBlcnJvciBoYXMgbm8gbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhDdXN0b21FbmFibGVkID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcGFyYW1zOiB7IGNsaWVudF9pZDogJ3Rlc3QtaWQnLCBjbGllbnRfc2VjcmV0OiAndGVzdC1zZWNyZXQnIH0sXG4gICAgICB9KVxuXG4gICAgICBtb2NrRGVsZXRlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwcm92aWRlciwgeyBvbkVycm9yIH0pID0+IHtcbiAgICAgICAgb25FcnJvcih7fSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoQ3VzdG9tRW5hYmxlZH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnJlbW92ZScpKVxuXG4gICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoLnJlbW92ZS5mYWlsZWQnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZmFsbGJhY2sgd2hlbiBlcnJvci5tZXNzYWdlIGlzIG5vdCBhIHN0cmluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhDdXN0b21FbmFibGVkID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcGFyYW1zOiB7IGNsaWVudF9pZDogJ3Rlc3QtaWQnLCBjbGllbnRfc2VjcmV0OiAndGVzdC1zZWNyZXQnIH0sXG4gICAgICB9KVxuXG4gICAgICBtb2NrRGVsZXRlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwcm92aWRlciwgeyBvbkVycm9yIH0pID0+IHtcbiAgICAgICAgb25FcnJvcih7IG1lc3NhZ2U6IDEyMyB9KVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhDdXN0b21FbmFibGVkfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ucmVtb3ZlJykpXG5cbiAgICAgIGV4cGVjdChtb2NrVG9hc3ROb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ3BsdWdpblRyaWdnZXIubW9kYWwub2F1dGgucmVtb3ZlLmZhaWxlZCcsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBmYWxsYmFjayB3aGVuIGVycm9yLm1lc3NhZ2UgaXMgZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnV2l0aEN1c3RvbUVuYWJsZWQgPSBjcmVhdGVNb2NrT0F1dGhDb25maWcoe1xuICAgICAgICBzeXN0ZW1fY29uZmlndXJlZDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9lbmFibGVkOiB0cnVlLFxuICAgICAgICBwYXJhbXM6IHsgY2xpZW50X2lkOiAndGVzdC1pZCcsIGNsaWVudF9zZWNyZXQ6ICd0ZXN0LXNlY3JldCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIG1vY2tEZWxldGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHByb3ZpZGVyLCB7IG9uRXJyb3IgfSkgPT4ge1xuICAgICAgICBvbkVycm9yKHsgbWVzc2FnZTogJycgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoQ3VzdG9tRW5hYmxlZH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnJlbW92ZScpKVxuXG4gICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoLnJlbW92ZS5mYWlsZWQnLFxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdPQXV0aCBjYWxsYmFjayBlZGdlIGNhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHNob3cgc3VjY2VzcyB0b2FzdCB3aGVuIE9BdXRoIGNhbGxiYWNrIHJldHVybnMgZmFsc3kgZGF0YScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja1Nob3dPQXV0aENyZWF0ZU1vZGFsID0gdmkuZm4oKVxuXG4gICAgICBtb2NrQ29uZmlndXJlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG4gICAgICBtb2NrSW5pdGlhdGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHByb3ZpZGVyLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2Vzcyh7XG4gICAgICAgICAgYXV0aG9yaXphdGlvbl91cmw6ICdodHRwczovL29hdXRoLmV4YW1wbGUuY29tL2F1dGhvcml6ZScsXG4gICAgICAgICAgc3Vic2NyaXB0aW9uX2J1aWxkZXI6IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKCksXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgbW9ja09wZW5PQXV0aFBvcHVwLm1vY2tJbXBsZW1lbnRhdGlvbigodXJsLCBjYWxsYmFjaykgPT4ge1xuICAgICAgICBjYWxsYmFjayhudWxsKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBvbkNsb3NlPXttb2NrT25DbG9zZX1cbiAgICAgICAgICBzaG93T0F1dGhDcmVhdGVNb2RhbD17bW9ja1Nob3dPQXV0aENyZWF0ZU1vZGFsfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICAvLyBTaG91bGQgbm90IHNob3cgc3VjY2VzcyB0b2FzdCBvciBjYWxsIGNhbGxiYWNrc1xuICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkubm90LnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IG1lc3NhZ2U6ICdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoLmF1dGhvcml6YXRpb24uYXV0aFN1Y2Nlc3MnIH0pLFxuICAgICAgKVxuICAgICAgZXhwZWN0KG1vY2tTaG93T0F1dGhDcmVhdGVNb2RhbCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0N1c3RvbSBDbGllbnQgVHlwZSBTYXZlIEZsb3cnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzZW5kIGVuYWJsZWQ6IHRydWUgd2hlbiBjdXN0b20gY2xpZW50IHR5cGUgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrQ29uZmlndXJlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBTd2l0Y2ggdG8gY3VzdG9tXG4gICAgICBjb25zdCBjdXN0b21DYXJkID0gc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tY2FyZC1wbHVnaW5UcmlnZ2VyLnN1YnNjcmlwdGlvbi5hZGRUeXBlLm9wdGlvbnMub2F1dGguY3VzdG9tJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjdXN0b21DYXJkKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jYW5jZWwnKSlcblxuICAgICAgZXhwZWN0KG1vY2tDb25maWd1cmVPQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNlbmQgZW5hYmxlZDogZmFsc2Ugd2hlbiBkZWZhdWx0IGNsaWVudCB0eXBlIGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgbW9ja0NvbmZpZ3VyZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gRGVmYXVsdCBpcyBhbHJlYWR5IHNlbGVjdGVkXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jYW5jZWwnKSlcblxuICAgICAgZXhwZWN0KG1vY2tDb25maWd1cmVPQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdPQXV0aCBDbGllbnQgU2NoZW1hIERlZmF1bHQgVmFsdWVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2V0IGRlZmF1bHQgdmFsdWVzIGZyb20gcGFyYW1zIHRvIHNjaGVtYScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhQYXJhbXMgPSBjcmVhdGVNb2NrT0F1dGhDb25maWcoe1xuICAgICAgICBzeXN0ZW1fY29uZmlndXJlZDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9lbmFibGVkOiB0cnVlLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICBjbGllbnRfaWQ6ICdteS1jbGllbnQtaWQnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICdteS1jbGllbnQtc2VjcmV0JyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoUGFyYW1zfSAvPilcblxuICAgICAgY29uc3QgY2xpZW50SWRJbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1jbGllbnRfaWQnKSBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgICBjb25zdCBjbGllbnRTZWNyZXRJbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1jbGllbnRfc2VjcmV0JykgYXMgSFRNTElucHV0RWxlbWVudFxuXG4gICAgICBleHBlY3QoY2xpZW50SWRJbnB1dC5kZWZhdWx0VmFsdWUpLnRvQmUoJ215LWNsaWVudC1pZCcpXG4gICAgICBleHBlY3QoY2xpZW50U2VjcmV0SW5wdXQuZGVmYXVsdFZhbHVlKS50b0JlKCdteS1jbGllbnQtc2VjcmV0JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgd2hlbiBvYXV0aF9jbGllbnRfc2NoZW1hIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnV2l0aEVtcHR5U2NoZW1hID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBvYXV0aF9jbGllbnRfc2NoZW1hOiBbXSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoRW1wdHlTY2hlbWF9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2Jhc2UtZm9ybScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNraXAgc2V0dGluZyBkZWZhdWx0IHdoZW4gc2NoZW1hIG5hbWUgaXMgbm90IGluIHBhcmFtcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhQYXJ0aWFsUGFyYW1zID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgY2xpZW50X2lkOiAnbXktY2xpZW50LWlkJyxcbiAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnJywgLy8gZW1wdHkgdmFsdWUgLSB3aWxsIG5vdCBiZSBzZXQgYXMgZGVmYXVsdFxuICAgICAgICB9LFxuICAgICAgICBvYXV0aF9jbGllbnRfc2NoZW1hOiBbXG4gICAgICAgICAgeyBuYW1lOiAnY2xpZW50X2lkJywgdHlwZTogJ3RleHQtaW5wdXQnIGFzIHVua25vd24sIHJlcXVpcmVkOiB0cnVlLCBsYWJlbDogeyAnZW4tVVMnOiAnQ2xpZW50IElEJyB9IGFzIHVua25vd24gfSxcbiAgICAgICAgICB7IG5hbWU6ICdjbGllbnRfc2VjcmV0JywgdHlwZTogJ3NlY3JldC1pbnB1dCcgYXMgdW5rbm93biwgcmVxdWlyZWQ6IHRydWUsIGxhYmVsOiB7ICdlbi1VUyc6ICdDbGllbnQgU2VjcmV0JyB9IGFzIHVua25vd24gfSxcbiAgICAgICAgICB7IG5hbWU6ICdleHRyYV9wYXJhbScsIHR5cGU6ICd0ZXh0LWlucHV0JyBhcyB1bmtub3duLCByZXF1aXJlZDogZmFsc2UsIGxhYmVsOiB7ICdlbi1VUyc6ICdFeHRyYSBQYXJhbScgfSBhcyB1bmtub3duIH0sXG4gICAgICAgIF0gYXMgVHJpZ2dlck9BdXRoQ29uZmlnWydvYXV0aF9jbGllbnRfc2NoZW1hJ10sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBvYXV0aENvbmZpZz17Y29uZmlnV2l0aFBhcnRpYWxQYXJhbXN9IC8+KVxuXG4gICAgICBjb25zdCBjbGllbnRJZElucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLWNsaWVudF9pZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIGV4cGVjdChjbGllbnRJZElucHV0LmRlZmF1bHRWYWx1ZSkudG9CZSgnbXktY2xpZW50LWlkJylcblxuICAgICAgLy8gY2xpZW50X3NlY3JldCBzaG91bGQgaGF2ZSBlbXB0eSBkZWZhdWx0IHNpbmNlIHZhbHVlIGlzIGVtcHR5XG4gICAgICBjb25zdCBjbGllbnRTZWNyZXRJbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1jbGllbnRfc2VjcmV0JykgYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgZXhwZWN0KGNsaWVudFNlY3JldElucHV0LmRlZmF1bHRWYWx1ZSkudG9CZSgnJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDb25maXJtIEJ1dHRvbiBUZXh0IFN0YXRlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgc2F2ZUFuZEF1dGggdGV4dCBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpbi5hdXRoLnNhdmVBbmRBdXRoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGF1dGhvcml6aW5nIHRleHQgd2hlbiBhdXRob3JpemF0aW9uIGlzIHBlbmRpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrQ29uZmlndXJlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG4gICAgICBtb2NrSW5pdGlhdGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgICAgICAvLyBEb24ndCBjYWxsIGNhbGxiYWNrIC0gc3RheXMgcGVuZGluZ1xuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKS50b0hhdmVUZXh0Q29udGVudCgncGx1Z2luVHJpZ2dlci5tb2RhbC5jb21tb24uYXV0aG9yaXppbmcnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0F1dGhvcml6YXRpb24gRmFpbGVkIFN0YXR1cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNldCBhdXRob3JpemF0aW9uIHN0YXR1cyB0byBGYWlsZWQgd2hlbiBPQXV0aCBpbml0aWF0aW9uIGZhaWxzJywgKCkgPT4ge1xuICAgICAgbW9ja0NvbmZpZ3VyZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuICAgICAgbW9ja0luaXRpYXRlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwcm92aWRlciwgeyBvbkVycm9yIH0pID0+IHtcbiAgICAgICAgb25FcnJvcihuZXcgRXJyb3IoJ09BdXRoIGZhaWxlZCcpKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgLy8gQWZ0ZXIgZmFpbHVyZSwgYnV0dG9uIHRleHQgc2hvdWxkIHJldHVybiB0byBkZWZhdWx0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW4uYXV0aC5zYXZlQW5kQXV0aCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVkaXJlY3QgVVJJIERpc3BsYXknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyByZWRpcmVjdCBVUkkgaW5mbyB3aGVuIHJlZGlyZWN0X3VyaSBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhFbXB0eVJlZGlyZWN0VXJpID0gY3JlYXRlTW9ja09BdXRoQ29uZmlnKHtcbiAgICAgICAgc3lzdGVtX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICBjdXN0b21fZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgcmVkaXJlY3RfdXJpOiAnJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoRW1wdHlSZWRpcmVjdFVyaX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BsdWdpblRyaWdnZXIubW9kYWwub2F1dGhSZWRpcmVjdEluZm8nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHJlZGlyZWN0IFVSSSBpbmZvIHdoZW4gY3VzdG9tIHR5cGUgYW5kIHJlZGlyZWN0X3VyaSBleGlzdHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb25maWdXaXRoUmVkaXJlY3RVcmkgPSBjcmVhdGVNb2NrT0F1dGhDb25maWcoe1xuICAgICAgICBzeXN0ZW1fY29uZmlndXJlZDogZmFsc2UsXG4gICAgICAgIGN1c3RvbV9lbmFibGVkOiB0cnVlLFxuICAgICAgICByZWRpcmVjdF91cmk6ICdodHRwczovL215LWFwcC5jb20vb2F1dGgvY2FsbGJhY2snLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhSZWRpcmVjdFVyaX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoUmVkaXJlY3RJbmZvJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL215LWFwcC5jb20vb2F1dGgvY2FsbGJhY2snKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbW92ZSBCdXR0b24gVmlzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHJlbW92ZSBidXR0b24gd2hlbiBjdXN0b21fZW5hYmxlZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbmZpZ1dpdGhDdXN0b21EaXNhYmxlZCA9IGNyZWF0ZU1vY2tPQXV0aENvbmZpZyh7XG4gICAgICAgIHN5c3RlbV9jb25maWd1cmVkOiBmYWxzZSxcbiAgICAgICAgY3VzdG9tX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBwYXJhbXM6IHsgY2xpZW50X2lkOiAndGVzdC1pZCcsIGNsaWVudF9zZWNyZXQ6ICd0ZXN0LXNlY3JldCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IG9hdXRoQ29uZmlnPXtjb25maWdXaXRoQ3VzdG9tRGlzYWJsZWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnJlbW92ZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHJlbW92ZSBidXR0b24gd2hlbiBkZWZhdWx0IGNsaWVudCB0eXBlIGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29uZmlnV2l0aEN1c3RvbUVuYWJsZWQgPSBjcmVhdGVNb2NrT0F1dGhDb25maWcoe1xuICAgICAgICBzeXN0ZW1fY29uZmlndXJlZDogdHJ1ZSxcbiAgICAgICAgY3VzdG9tX2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIHBhcmFtczogeyBjbGllbnRfaWQ6ICd0ZXN0LWlkJywgY2xpZW50X3NlY3JldDogJ3Rlc3Qtc2VjcmV0JyB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gb2F1dGhDb25maWc9e2NvbmZpZ1dpdGhDdXN0b21FbmFibGVkfSAvPilcblxuICAgICAgLy8gRGVmYXVsdCBpcyBzZWxlY3RlZCBieSBkZWZhdWx0IHdoZW4gc3lzdGVtX2NvbmZpZ3VyZWQgaXMgdHJ1ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5yZW1vdmUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdPQXV0aCBDbGllbnQgVGl0bGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xpZW50IHR5cGUgdGl0bGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmFkZFR5cGUub3B0aW9ucy5vYXV0aC5jbGllbnRUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRm9ybSBWYWxpZGF0aW9uIG9uIEN1c3RvbSBTYXZlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgY29uZmlndXJlT0F1dGggd2hlbiBmb3JtIHZhbGlkYXRpb24gZmFpbHMnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrRm9ybVZhbHVlcyh7XG4gICAgICAgIHZhbHVlczogeyBjbGllbnRfaWQ6ICcnLCBjbGllbnRfc2VjcmV0OiAnJyB9LFxuICAgICAgICBpc0NoZWNrVmFsaWRhdGVkOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBTd2l0Y2ggdG8gY3VzdG9tIHR5cGVcbiAgICAgIGNvbnN0IGN1c3RvbUNhcmQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbi1jYXJkLXBsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmFkZFR5cGUub3B0aW9ucy5vYXV0aC5jdXN0b20nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGN1c3RvbUNhcmQpXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNhbmNlbCcpKVxuXG4gICAgICAvLyBTaG91bGQgbm90IGNhbGwgY29uZmlndXJlT0F1dGggYmVjYXVzZSBmb3JtIHZhbGlkYXRpb24gZmFpbGVkXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ3VyZU9BdXRoKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ2xpZW50IFBhcmFtcyBIaWRkZW4gVmFsdWUgVHJhbnNmb3JtJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdHJhbnNmb3JtIGNsaWVudF9pZCB0byBoaWRkZW4gd2hlbiB1bmNoYW5nZWQnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrRm9ybVZhbHVlcyh7XG4gICAgICAgIHZhbHVlczogeyBjbGllbnRfaWQ6ICdkZWZhdWx0LWNsaWVudC1pZCcsIGNsaWVudF9zZWNyZXQ6ICduZXctc2VjcmV0JyB9LFxuICAgICAgICBpc0NoZWNrVmFsaWRhdGVkOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIG1vY2tDb25maWd1cmVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFN3aXRjaCB0byBjdXN0b20gdHlwZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9uLWNhcmQtcGx1Z2luVHJpZ2dlci5zdWJzY3JpcHRpb24uYWRkVHlwZS5vcHRpb25zLm9hdXRoLmN1c3RvbScpKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jYW5jZWwnKSlcblxuICAgICAgZXhwZWN0KG1vY2tDb25maWd1cmVPQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBjbGllbnRfcGFyYW1zOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBjbGllbnRfaWQ6ICdbX19ISURERU5fX10nLFxuICAgICAgICAgICAgY2xpZW50X3NlY3JldDogJ25ldy1zZWNyZXQnLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyYW5zZm9ybSBjbGllbnRfc2VjcmV0IHRvIGhpZGRlbiB3aGVuIHVuY2hhbmdlZCcsICgpID0+IHtcbiAgICAgIHNldE1vY2tGb3JtVmFsdWVzKHtcbiAgICAgICAgdmFsdWVzOiB7IGNsaWVudF9pZDogJ25ldy1pZCcsIGNsaWVudF9zZWNyZXQ6ICdkZWZhdWx0LWNsaWVudC1zZWNyZXQnIH0sXG4gICAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG4gICAgICB9KVxuICAgICAgbW9ja0NvbmZpZ3VyZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gU3dpdGNoIHRvIGN1c3RvbSB0eXBlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tY2FyZC1wbHVnaW5UcmlnZ2VyLnN1YnNjcmlwdGlvbi5hZGRUeXBlLm9wdGlvbnMub2F1dGguY3VzdG9tJykpXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNhbmNlbCcpKVxuXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ3VyZU9BdXRoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGNsaWVudF9wYXJhbXM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGNsaWVudF9pZDogJ25ldy1pZCcsXG4gICAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnW19fSElEREVOX19dJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSksXG4gICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2Zvcm0gYm90aCBjbGllbnRfaWQgYW5kIGNsaWVudF9zZWNyZXQgdG8gaGlkZGVuIHdoZW4gYm90aCB1bmNoYW5nZWQnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrRm9ybVZhbHVlcyh7XG4gICAgICAgIHZhbHVlczogeyBjbGllbnRfaWQ6ICdkZWZhdWx0LWNsaWVudC1pZCcsIGNsaWVudF9zZWNyZXQ6ICdkZWZhdWx0LWNsaWVudC1zZWNyZXQnIH0sXG4gICAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG4gICAgICB9KVxuICAgICAgbW9ja0NvbmZpZ3VyZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gU3dpdGNoIHRvIGN1c3RvbSB0eXBlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb24tY2FyZC1wbHVnaW5UcmlnZ2VyLnN1YnNjcmlwdGlvbi5hZGRUeXBlLm9wdGlvbnMub2F1dGguY3VzdG9tJykpXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNhbmNlbCcpKVxuXG4gICAgICBleHBlY3QobW9ja0NvbmZpZ3VyZU9BdXRoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIGNsaWVudF9wYXJhbXM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGNsaWVudF9pZDogJ1tfX0hJRERFTl9fXScsXG4gICAgICAgICAgICBjbGllbnRfc2VjcmV0OiAnW19fSElEREVOX19dJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSksXG4gICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZW5kIG5ldyB2YWx1ZXMgd2hlbiBib3RoIGNoYW5nZWQnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrRm9ybVZhbHVlcyh7XG4gICAgICAgIHZhbHVlczogeyBjbGllbnRfaWQ6ICduZXctY2xpZW50LWlkJywgY2xpZW50X3NlY3JldDogJ25ldy1jbGllbnQtc2VjcmV0JyB9LFxuICAgICAgICBpc0NoZWNrVmFsaWRhdGVkOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIG1vY2tDb25maWd1cmVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFN3aXRjaCB0byBjdXN0b20gdHlwZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9uLWNhcmQtcGx1Z2luVHJpZ2dlci5zdWJzY3JpcHRpb24uYWRkVHlwZS5vcHRpb25zLm9hdXRoLmN1c3RvbScpKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jYW5jZWwnKSlcblxuICAgICAgZXhwZWN0KG1vY2tDb25maWd1cmVPQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBjbGllbnRfcGFyYW1zOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBjbGllbnRfaWQ6ICduZXctY2xpZW50LWlkJyxcbiAgICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICduZXctY2xpZW50LXNlY3JldCcsXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pLFxuICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICApXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUG9sbGluZyBWZXJpZmljYXRpb24gU3VjY2VzcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgdmVyaWZ5QnVpbGRlciBhbmQgdXBkYXRlIHN0YXR1cyBvbiBzdWNjZXNzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgdmkudXNlRmFrZVRpbWVycyh7IHNob3VsZEFkdmFuY2VUaW1lOiB0cnVlIH0pXG4gICAgICBtb2NrQ29uZmlndXJlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG4gICAgICBtb2NrSW5pdGlhdGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKHByb3ZpZGVyLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2Vzcyh7XG4gICAgICAgICAgYXV0aG9yaXphdGlvbl91cmw6ICdodHRwczovL29hdXRoLmV4YW1wbGUuY29tL2F1dGhvcml6ZScsXG4gICAgICAgICAgc3Vic2NyaXB0aW9uX2J1aWxkZXI6IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKCksXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgbW9ja1ZlcmlmeUJ1aWxkZXIubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKHsgdmVyaWZpZWQ6IHRydWUgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIC8vIEFkdmFuY2UgdGltZXIgdG8gdHJpZ2dlciBwb2xsaW5nXG4gICAgICBhd2FpdCB2aS5hZHZhbmNlVGltZXJzQnlUaW1lQXN5bmMoMzAwMClcblxuICAgICAgZXhwZWN0KG1vY2tWZXJpZnlCdWlsZGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgLy8gQnV0dG9uIHRleHQgc2hvdWxkIHNob3cgd2FpdGluZ0p1bXAgYWZ0ZXIgdmVyaWZpZWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoLmF1dGhvcml6YXRpb24ud2FpdGluZ0p1bXAnKVxuICAgICAgfSlcblxuICAgICAgdmkudXNlUmVhbFRpbWVycygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29udGludWUgcG9sbGluZyB3aGVuIG5vdCB2ZXJpZmllZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHZpLnVzZUZha2VUaW1lcnMoeyBzaG91bGRBZHZhbmNlVGltZTogdHJ1ZSB9KVxuICAgICAgbW9ja0NvbmZpZ3VyZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuICAgICAgbW9ja0luaXRpYXRlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChwcm92aWRlciwgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3Moe1xuICAgICAgICAgIGF1dGhvcml6YXRpb25fdXJsOiAnaHR0cHM6Ly9vYXV0aC5leGFtcGxlLmNvbS9hdXRob3JpemUnLFxuICAgICAgICAgIHN1YnNjcmlwdGlvbl9idWlsZGVyOiBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIG1vY2tWZXJpZnlCdWlsZGVyLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2Vzcyh7IHZlcmlmaWVkOiBmYWxzZSB9KVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgLy8gRmlyc3QgcG9sbFxuICAgICAgYXdhaXQgdmkuYWR2YW5jZVRpbWVyc0J5VGltZUFzeW5jKDMwMDApXG4gICAgICBleHBlY3QobW9ja1ZlcmlmeUJ1aWxkZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICAvLyBTZWNvbmQgcG9sbFxuICAgICAgYXdhaXQgdmkuYWR2YW5jZVRpbWVyc0J5VGltZUFzeW5jKDMwMDApXG4gICAgICBleHBlY3QobW9ja1ZlcmlmeUJ1aWxkZXIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuXG4gICAgICAvLyBTaG91bGQgc3RpbGwgYmUgaW4gYXV0aG9yaXppbmcgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpblRyaWdnZXIubW9kYWwuY29tbW9uLmF1dGhvcml6aW5nJylcblxuICAgICAgdmkudXNlUmVhbFRpbWVycygpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=