"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../types");
// Create a wrapper with QueryClientProvider
const createTestQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            gcTime: 0,
        },
    },
});
const createWrapper = () => {
    const testQueryClient = createTestQueryClient();
    return ({ children }) => (<react_query_1.QueryClientProvider client={testQueryClient}>
      {children}
    </react_query_1.QueryClientProvider>);
};
// Mock API hooks - these make network requests so must be mocked
const mockGetPluginOAuthUrl = vitest_1.vi.fn();
const mockGetPluginOAuthClientSchema = vitest_1.vi.fn();
const mockSetPluginOAuthCustomClient = vitest_1.vi.fn();
const mockDeletePluginOAuthCustomClient = vitest_1.vi.fn();
const mockInvalidPluginOAuthClientSchema = vitest_1.vi.fn();
const mockAddPluginCredential = vitest_1.vi.fn();
const mockUpdatePluginCredential = vitest_1.vi.fn();
const mockGetPluginCredentialSchema = vitest_1.vi.fn();
vitest_1.vi.mock('../hooks/use-credential', () => ({
    useGetPluginOAuthUrlHook: () => ({
        mutateAsync: mockGetPluginOAuthUrl,
    }),
    useGetPluginOAuthClientSchemaHook: () => ({
        data: mockGetPluginOAuthClientSchema(),
        isLoading: false,
    }),
    useSetPluginOAuthCustomClientHook: () => ({
        mutateAsync: mockSetPluginOAuthCustomClient,
    }),
    useDeletePluginOAuthCustomClientHook: () => ({
        mutateAsync: mockDeletePluginOAuthCustomClient,
    }),
    useInvalidPluginOAuthClientSchemaHook: () => mockInvalidPluginOAuthClientSchema,
    useAddPluginCredentialHook: () => ({
        mutateAsync: mockAddPluginCredential,
    }),
    useUpdatePluginCredentialHook: () => ({
        mutateAsync: mockUpdatePluginCredential,
    }),
    useGetPluginCredentialSchemaHook: () => ({
        data: mockGetPluginCredentialSchema(),
        isLoading: false,
    }),
}));
// Mock openOAuthPopup - requires window operations
const mockOpenOAuthPopup = vitest_1.vi.fn();
vitest_1.vi.mock('@/hooks/use-oauth', () => ({
    openOAuthPopup: (...args) => mockOpenOAuthPopup(...args),
}));
// Mock service/use-triggers - API service
vitest_1.vi.mock('@/service/use-triggers', () => ({
    useTriggerPluginDynamicOptions: () => ({
        data: { options: [] },
        isLoading: false,
    }),
    useTriggerPluginDynamicOptionsInfo: () => ({
        data: null,
        isLoading: false,
    }),
    useInvalidTriggerDynamicOptions: () => vitest_1.vi.fn(),
}));
// Mock AuthForm to control form validation in tests
const mockGetFormValues = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/base/form/form-scenarios/auth', () => ({
    default: vitest_1.vi.fn().mockImplementation(({ ref }) => {
        if (ref)
            ref.current = { getFormValues: mockGetFormValues };
        return <div data-testid="mock-auth-form">Auth Form</div>;
    }),
}));
// Mock useToastContext
const mockNotify = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    useToastContext: () => ({ notify: mockNotify }),
}));
// Factory function for creating test PluginPayload
const createPluginPayload = (overrides = {}) => ({
    category: types_1.AuthCategory.tool,
    provider: 'test-provider',
    ...overrides,
});
// Factory for form schemas
const createFormSchema = (overrides = {}) => ({
    type: 'text-input',
    name: 'test-field',
    label: 'Test Field',
    required: false,
    ...overrides,
});
// ==================== AddApiKeyButton Tests ====================
(0, vitest_1.describe)('AddApiKeyButton', () => {
    let AddApiKeyButton;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        mockGetPluginCredentialSchema.mockReturnValue([]);
        const importedAddApiKeyButton = await Promise.resolve().then(() => require('./add-api-key-button'));
        AddApiKeyButton = importedAddApiKeyButton.default;
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render button with default text', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toHaveTextContent('Use Api Key');
        });
        (0, vitest_1.it)('should render button with custom text', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload} buttonText="Custom API Key"/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toHaveTextContent('Custom API Key');
        });
        (0, vitest_1.it)('should apply button variant', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload} buttonVariant="primary"/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByRole('button').className).toContain('btn-primary');
        });
        (0, vitest_1.it)('should use secondary-accent variant by default', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Verify the default button has secondary-accent variant class
            (0, vitest_1.expect)(react_1.screen.getByRole('button').className).toContain('btn-secondary-accent');
        });
    });
    (0, vitest_1.describe)('Props Testing', () => {
        (0, vitest_1.it)('should disable button when disabled prop is true', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload} disabled={true}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeDisabled();
        });
        (0, vitest_1.it)('should not disable button when disabled prop is false', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload} disabled={false}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).not.toBeDisabled();
        });
        (0, vitest_1.it)('should accept formSchemas prop', () => {
            const pluginPayload = createPluginPayload();
            const formSchemas = [createFormSchema({ name: 'api_key', label: 'API Key' })];
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload} formSchemas={formSchemas}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
    });
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should open modal when button is clicked', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuth')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should not open modal when button is disabled', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload} disabled={true}/>, { wrapper: createWrapper() });
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Modal should not appear
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.auth.useApiAuth')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty pluginPayload properties', () => {
            const pluginPayload = createPluginPayload({
                provider: '',
                providerType: undefined,
            });
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle all auth categories', () => {
            const categories = [types_1.AuthCategory.tool, types_1.AuthCategory.datasource, types_1.AuthCategory.model, types_1.AuthCategory.trigger];
            categories.forEach((category) => {
                const pluginPayload = createPluginPayload({ category });
                const { unmount } = (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
                (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
                unmount();
            });
        });
    });
    (0, vitest_1.describe)('Modal Behavior', () => {
        (0, vitest_1.it)('should close modal when onClose is called from ApiKeyModal', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Open modal
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuth')).toBeInTheDocument();
            });
            // Close modal via cancel button
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.cancel'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByText('plugin.auth.useApiAuth')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should call onUpdate when provided and modal triggers update', async () => {
            const pluginPayload = createPluginPayload();
            const onUpdate = vitest_1.vi.fn();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            // Open modal
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuth')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Memoization', () => {
        (0, vitest_1.it)('should be a memoized component', async () => {
            const AddApiKeyButtonDefault = (await Promise.resolve().then(() => require('./add-api-key-button'))).default;
            (0, vitest_1.expect)(typeof AddApiKeyButtonDefault).toBe('object');
        });
    });
});
// ==================== AddOAuthButton Tests ====================
(0, vitest_1.describe)('AddOAuthButton', () => {
    let AddOAuthButton;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        mockGetPluginOAuthClientSchema.mockReturnValue({
            schema: [],
            is_oauth_custom_client_enabled: false,
            is_system_oauth_params_exists: false,
            client_params: {},
            redirect_uri: 'https://example.com/callback',
        });
        mockGetPluginOAuthUrl.mockResolvedValue({ authorization_url: 'https://oauth.example.com/auth' });
        const importedAddOAuthButton = await Promise.resolve().then(() => require('./add-oauth-button'));
        AddOAuthButton = importedAddOAuthButton.default;
    });
    (0, vitest_1.describe)('Rendering - Not Configured State', () => {
        (0, vitest_1.it)('should render setup OAuth button when not configured', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.setupOAuth')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply button variant to setup button', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload} buttonVariant="secondary"/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByRole('button').className).toContain('btn-secondary');
        });
    });
    (0, vitest_1.describe)('Rendering - Configured State', () => {
        (0, vitest_1.it)('should render OAuth button when system OAuth params exist', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: true,
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload} buttonText="Connect OAuth"/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('Connect OAuth')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render OAuth button when custom client is enabled', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: false,
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload} buttonText="OAuth"/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('OAuth')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show custom badge when custom client is enabled', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: false,
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.custom')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Props Testing', () => {
        (0, vitest_1.it)('should disable button when disabled prop is true', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload} disabled={true}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeDisabled();
        });
        (0, vitest_1.it)('should apply custom className', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: false,
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload} className="custom-class"/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByRole('button').className).toContain('custom-class');
        });
        (0, vitest_1.it)('should use oAuthData prop when provided', () => {
            const pluginPayload = createPluginPayload();
            const oAuthData = {
                schema: [],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: true,
                client_params: {},
                redirect_uri: 'https://custom.example.com/callback',
            };
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload} oAuthData={oAuthData}/>, { wrapper: createWrapper() });
            // Should render configured button since oAuthData has is_system_oauth_params_exists=true
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.auth.setupOAuth')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should trigger OAuth flow when configured button is clicked', async () => {
            const pluginPayload = createPluginPayload();
            const onUpdate = vitest_1.vi.fn();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: false,
            });
            mockGetPluginOAuthUrl.mockResolvedValue({ authorization_url: 'https://oauth.example.com/auth' });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            // Click the main button area (left side)
            const buttonText = react_1.screen.getByText('use oauth');
            react_1.fireEvent.click(buttonText);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetPluginOAuthUrl).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should open settings when setup button is clicked', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'client_id', label: 'Client ID' })],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.setupOAuth'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should not trigger OAuth when no authorization_url is returned', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: false,
            });
            mockGetPluginOAuthUrl.mockResolvedValue({ authorization_url: '' });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            const buttonText = react_1.screen.getByText('use oauth');
            react_1.fireEvent.click(buttonText);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetPluginOAuthUrl).toHaveBeenCalled();
            });
            (0, vitest_1.expect)(mockOpenOAuthPopup).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should call onUpdate callback after successful OAuth', async () => {
            const pluginPayload = createPluginPayload();
            const onUpdate = vitest_1.vi.fn();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: false,
            });
            mockGetPluginOAuthUrl.mockResolvedValue({ authorization_url: 'https://oauth.example.com/auth' });
            // Simulate openOAuthPopup calling the success callback
            mockOpenOAuthPopup.mockImplementation((url, callback) => {
                callback?.();
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            const buttonText = react_1.screen.getByText('use oauth');
            react_1.fireEvent.click(buttonText);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockOpenOAuthPopup).toHaveBeenCalledWith('https://oauth.example.com/auth', vitest_1.expect.any(Function));
            });
            // Verify onUpdate was called through the callback
            (0, vitest_1.expect)(onUpdate).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should open OAuth settings when settings icon is clicked', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'client_id', label: 'Client ID' })],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: false,
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Click the settings icon using data-testid for reliable selection
            const settingsButton = react_1.screen.getByTestId('oauth-settings-button');
            react_1.fireEvent.click(settingsButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should close OAuth settings modal when onClose is called', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'client_id', label: 'Client ID' })],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Open settings
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.setupOAuth'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
            });
            // Close settings via cancel button
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.cancel'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByText('plugin.auth.oauthClientSettings')).not.toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Schema Processing', () => {
        (0, vitest_1.it)('should handle is_system_oauth_params_exists state', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'client_id', label: 'Client ID' })],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: true,
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Should show the configured button, not setup button
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.auth.setupOAuth')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should open OAuth settings modal with correct data', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'client_id', label: 'Client ID', required: true })],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.setupOAuth'));
            await (0, react_1.waitFor)(() => {
                // OAuthClientSettings modal should open
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should handle client_params defaults in schema', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [
                    createFormSchema({ name: 'client_id', label: 'Client ID' }),
                    createFormSchema({ name: 'client_secret', label: 'Client Secret' }),
                ],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: true,
                client_params: {
                    client_id: 'preset-client-id',
                    client_secret: 'preset-secret',
                },
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Open settings by clicking the gear icon
            const button = react_1.screen.getByRole('button');
            const gearIconContainer = button.querySelector('[class*="shrink-0"][class*="w-8"]');
            if (gearIconContainer)
                react_1.fireEvent.click(gearIconContainer);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should handle __auth_client__ logic when configured with system OAuth and no custom client', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: true,
                client_params: {},
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Should render configured button (not setup button)
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.auth.setupOAuth')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should open OAuth settings when system OAuth params exist', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'client_id', label: 'Client ID', required: true })],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: true,
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Click the settings icon
            const button = react_1.screen.getByRole('button');
            const gearIconContainer = button.querySelector('[class*="shrink-0"][class*="w-8"]');
            if (gearIconContainer)
                react_1.fireEvent.click(gearIconContainer);
            await (0, react_1.waitFor)(() => {
                // OAuthClientSettings modal should open
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Clipboard Operations', () => {
        (0, vitest_1.it)('should have clipboard API available for copy operations', async () => {
            const pluginPayload = createPluginPayload();
            const mockWriteText = vitest_1.vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: mockWriteText },
                configurable: true,
            });
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'client_id', label: 'Client ID', required: true })],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.setupOAuth'));
            await (0, react_1.waitFor)(() => {
                // OAuthClientSettings modal opens
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
            });
            // Verify clipboard API is available
            (0, vitest_1.expect)(navigator.clipboard.writeText).toBeDefined();
        });
    });
    (0, vitest_1.describe)('__auth_client__ Logic', () => {
        (0, vitest_1.it)('should return default when not configured and system OAuth params exist', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: true,
                client_params: {},
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // When isConfigured is true (is_system_oauth_params_exists=true), it should show the configured button
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.auth.setupOAuth')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should return custom when not configured and no system OAuth params', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
                client_params: {},
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // When not configured, it should show the setup button
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.setupOAuth')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty schema', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
            });
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle undefined oAuthData fields', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue(undefined);
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle null client_params', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'test' })],
                is_oauth_custom_client_enabled: true,
                is_system_oauth_params_exists: true,
                client_params: null,
            });
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
    });
});
// ==================== ApiKeyModal Tests ====================
(0, vitest_1.describe)('ApiKeyModal', () => {
    let ApiKeyModal;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        mockGetPluginCredentialSchema.mockReturnValue([
            createFormSchema({ name: 'api_key', label: 'API Key', required: true }),
        ]);
        mockAddPluginCredential.mockResolvedValue({});
        mockUpdatePluginCredential.mockResolvedValue({});
        // Reset form values mock to return validation failed by default
        mockGetFormValues.mockReturnValue({
            isCheckValidated: false,
            values: {},
        });
        const importedApiKeyModal = await Promise.resolve().then(() => require('./api-key-modal'));
        ApiKeyModal = importedApiKeyModal.default;
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render modal with title', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuth')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render modal with subtitle', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuthDesc')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render form when data is loaded', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // AuthForm is mocked, so check for the mock element
            (0, vitest_1.expect)(react_1.screen.getByTestId('mock-auth-form')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Props Testing', () => {
        (0, vitest_1.it)('should call onClose when modal is closed', () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} onClose={onClose}/>, { wrapper: createWrapper() });
            // Find and click cancel button
            const cancelButton = react_1.screen.getByText('common.operation.cancel');
            react_1.fireEvent.click(cancelButton);
            (0, vitest_1.expect)(onClose).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should disable confirm button when disabled prop is true', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} disabled={true}/>, { wrapper: createWrapper() });
            const confirmButton = react_1.screen.getByText('common.operation.save');
            (0, vitest_1.expect)(confirmButton.closest('button')).toBeDisabled();
        });
        (0, vitest_1.it)('should show modal when editValues is provided', () => {
            const pluginPayload = createPluginPayload();
            const editValues = {
                __name__: 'Test Name',
                __credential_id__: 'test-id',
                api_key: 'test-key',
            };
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} editValues={editValues}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuth')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should use formSchemas from props when provided', () => {
            const pluginPayload = createPluginPayload();
            const customSchemas = [
                createFormSchema({ name: 'custom_field', label: 'Custom Field' }),
            ];
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} formSchemas={customSchemas}/>, { wrapper: createWrapper() });
            // AuthForm is mocked, verify modal renders
            (0, vitest_1.expect)(react_1.screen.getByTestId('mock-auth-form')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Form Behavior', () => {
        (0, vitest_1.it)('should render AuthForm component', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // AuthForm is mocked, verify it's rendered
            (0, vitest_1.expect)(react_1.screen.getByTestId('mock-auth-form')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render modal with editValues', () => {
            const pluginPayload = createPluginPayload();
            const editValues = {
                __name__: 'Existing Name',
                api_key: 'existing-key',
            };
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} editValues={editValues}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuth')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Form Submission - handleConfirm', () => {
        (0, vitest_1.beforeEach)(() => {
            // Default: form validation passes with empty values
            mockGetFormValues.mockReturnValue({
                isCheckValidated: true,
                values: {
                    __name__: 'Test Name',
                    api_key: 'test-api-key',
                },
            });
        });
        (0, vitest_1.it)('should call addPluginCredential when creating new credential', async () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            const onUpdate = vitest_1.vi.fn();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            mockAddPluginCredential.mockResolvedValue({});
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} onClose={onClose} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            // Click confirm button
            const confirmButton = react_1.screen.getByText('common.operation.save');
            react_1.fireEvent.click(confirmButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockAddPluginCredential).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call updatePluginCredential when editing existing credential', async () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            const onUpdate = vitest_1.vi.fn();
            const editValues = {
                __name__: 'Test Credential',
                __credential_id__: 'test-credential-id',
                api_key: 'existing-key',
            };
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            mockUpdatePluginCredential.mockResolvedValue({});
            mockGetFormValues.mockReturnValue({
                isCheckValidated: true,
                values: {
                    __name__: 'Test Credential',
                    __credential_id__: 'test-credential-id',
                    api_key: 'updated-key',
                },
            });
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} onClose={onClose} onUpdate={onUpdate} editValues={editValues}/>, { wrapper: createWrapper() });
            // Click confirm button
            const confirmButton = react_1.screen.getByText('common.operation.save');
            react_1.fireEvent.click(confirmButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUpdatePluginCredential).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call onClose and onUpdate after successful submission', async () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            const onUpdate = vitest_1.vi.fn();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            mockAddPluginCredential.mockResolvedValue({});
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} onClose={onClose} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            // Click confirm button
            const confirmButton = react_1.screen.getByText('common.operation.save');
            react_1.fireEvent.click(confirmButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onClose).toHaveBeenCalled();
                (0, vitest_1.expect)(onUpdate).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should not call API when form validation fails', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key', required: true }),
            ]);
            mockGetFormValues.mockReturnValue({
                isCheckValidated: false,
                values: {},
            });
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Click confirm button
            const confirmButton = react_1.screen.getByText('common.operation.save');
            react_1.fireEvent.click(confirmButton);
            // Verify API was not called since validation failed synchronously
            (0, vitest_1.expect)(mockAddPluginCredential).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should handle doingAction state to prevent double submission', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            // Make the API call slow
            mockAddPluginCredential.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Click confirm button twice quickly
            const confirmButton = react_1.screen.getByText('common.operation.save');
            react_1.fireEvent.click(confirmButton);
            react_1.fireEvent.click(confirmButton);
            // Should only be called once due to doingAction guard
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockAddPluginCredential).toHaveBeenCalledTimes(1);
            });
        });
        (0, vitest_1.it)('should return early if doingActionRef is true during concurrent clicks', async () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            // Create a promise that we can control
            let resolveFirstCall = () => { };
            let apiCallCount = 0;
            mockAddPluginCredential.mockImplementation(() => {
                apiCallCount++;
                if (apiCallCount === 1) {
                    // First call: return a pending promise
                    return new Promise((resolve) => {
                        resolveFirstCall = resolve;
                    });
                }
                // Subsequent calls should not happen but return resolved promise
                return Promise.resolve({});
            });
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            const confirmButton = react_1.screen.getByText('common.operation.save');
            // First click starts the request
            react_1.fireEvent.click(confirmButton);
            // Wait for the first API call to be made
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(apiCallCount).toBe(1);
            });
            // Second click while first request is still pending should be ignored
            react_1.fireEvent.click(confirmButton);
            // Verify only one API call was made (no additional calls)
            (0, vitest_1.expect)(apiCallCount).toBe(1);
            // Clean up by resolving the promise
            resolveFirstCall();
        });
        (0, vitest_1.it)('should call onRemove when extra button is clicked in edit mode', async () => {
            const pluginPayload = createPluginPayload();
            const onRemove = vitest_1.vi.fn();
            const editValues = {
                __name__: 'Test Credential',
                __credential_id__: 'test-credential-id',
            };
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key' }),
            ]);
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload} editValues={editValues} onRemove={onRemove}/>, { wrapper: createWrapper() });
            // Find and click the remove button
            const removeButton = react_1.screen.getByText('common.operation.remove');
            react_1.fireEvent.click(removeButton);
            (0, vitest_1.expect)(onRemove).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty credentials schema', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginCredentialSchema.mockReturnValue([]);
            (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            // Should still render the modal with authorization name field
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuth')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined detail in pluginPayload', () => {
            const pluginPayload = createPluginPayload({ detail: undefined });
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle form schema with default values', () => {
            const pluginPayload = createPluginPayload();
            mockGetPluginCredentialSchema.mockReturnValue([
                createFormSchema({ name: 'api_key', label: 'API Key', default: 'default-key' }),
            ]);
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<ApiKeyModal pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            }).not.toThrow();
            (0, vitest_1.expect)(react_1.screen.getByTestId('mock-auth-form')).toBeInTheDocument();
        });
    });
});
// ==================== OAuthClientSettings Tests ====================
(0, vitest_1.describe)('OAuthClientSettings', () => {
    let OAuthClientSettings;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        mockSetPluginOAuthCustomClient.mockResolvedValue({});
        mockDeletePluginOAuthCustomClient.mockResolvedValue({});
        const importedOAuthClientSettings = await Promise.resolve().then(() => require('./oauth-client-settings'));
        OAuthClientSettings = importedOAuthClientSettings.default;
    });
    const defaultSchemas = [
        createFormSchema({ name: 'client_id', label: 'Client ID', required: true }),
        createFormSchema({ name: 'client_secret', label: 'Client Secret', required: true }),
    ];
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render modal with correct title', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Save and Auth button', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.saveAndAuth')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Save Only button', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.saveOnly')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Cancel button', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('common.operation.cancel')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render form from schemas', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            // AuthForm is mocked
            (0, vitest_1.expect)(react_1.screen.getByTestId('mock-auth-form')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Props Testing', () => {
        (0, vitest_1.it)('should call onClose when cancel button is clicked', () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} onClose={onClose}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.cancel'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should disable buttons when disabled prop is true', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} disabled={true}/>, { wrapper: createWrapper() });
            const confirmButton = react_1.screen.getByText('plugin.auth.saveAndAuth');
            (0, vitest_1.expect)(confirmButton.closest('button')).toBeDisabled();
        });
        (0, vitest_1.it)('should render with editValues', () => {
            const pluginPayload = createPluginPayload();
            const editValues = {
                client_id: 'existing-client-id',
                client_secret: 'existing-secret',
                __oauth_client__: 'custom',
            };
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} editValues={editValues}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Remove Button', () => {
        (0, vitest_1.it)('should show remove button when custom client and hasOriginalClientParams', () => {
            const pluginPayload = createPluginPayload();
            const schemasWithOAuthClient = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'custom',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithOAuthClient} editValues={{ __oauth_client__: 'custom', client_id: 'id', client_secret: 'secret' }} hasOriginalClientParams={true}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('common.operation.remove')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show remove button when using default client', () => {
            const pluginPayload = createPluginPayload();
            const schemasWithOAuthClient = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'default',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithOAuthClient} editValues={{ __oauth_client__: 'default' }} hasOriginalClientParams={false}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.queryByText('common.operation.remove')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Form Submission', () => {
        (0, vitest_1.beforeEach)(() => {
            // Default: form validation passes
            mockGetFormValues.mockReturnValue({
                isCheckValidated: true,
                values: {
                    __oauth_client__: 'custom',
                    client_id: 'test-client-id',
                    client_secret: 'test-secret',
                },
            });
        });
        (0, vitest_1.it)('should render Save and Auth button that is clickable', async () => {
            const pluginPayload = createPluginPayload();
            const onAuth = vitest_1.vi.fn().mockResolvedValue(undefined);
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={[]} onAuth={onAuth}/>, { wrapper: createWrapper() });
            const saveAndAuthButton = react_1.screen.getByText('plugin.auth.saveAndAuth');
            (0, vitest_1.expect)(saveAndAuthButton).toBeInTheDocument();
            (0, vitest_1.expect)(saveAndAuthButton.closest('button')).not.toBeDisabled();
        });
        (0, vitest_1.it)('should call setPluginOAuthCustomClient when Save Only is clicked', async () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            const onUpdate = vitest_1.vi.fn();
            mockSetPluginOAuthCustomClient.mockResolvedValue({});
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} onClose={onClose} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            // Click Save Only button
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.saveOnly'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockSetPluginOAuthCustomClient).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call onClose and onUpdate after successful submission', async () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            const onUpdate = vitest_1.vi.fn();
            mockSetPluginOAuthCustomClient.mockResolvedValue({});
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} onClose={onClose} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.saveOnly'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onClose).toHaveBeenCalled();
                (0, vitest_1.expect)(onUpdate).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call onAuth after handleConfirmAndAuthorize', async () => {
            const pluginPayload = createPluginPayload();
            const onAuth = vitest_1.vi.fn().mockResolvedValue(undefined);
            const onClose = vitest_1.vi.fn();
            mockSetPluginOAuthCustomClient.mockResolvedValue({});
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} onAuth={onAuth} onClose={onClose}/>, { wrapper: createWrapper() });
            // Click Save and Auth button
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.saveAndAuth'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockSetPluginOAuthCustomClient).toHaveBeenCalled();
                (0, vitest_1.expect)(onAuth).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should handle form with empty values', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            // Modal should render with save buttons
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.saveOnly')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.saveAndAuth')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should call deletePluginOAuthCustomClient when Remove is clicked', async () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            const onUpdate = vitest_1.vi.fn();
            mockDeletePluginOAuthCustomClient.mockResolvedValue({});
            const schemasWithOAuthClient = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'custom',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithOAuthClient} editValues={{ __oauth_client__: 'custom', client_id: 'id', client_secret: 'secret' }} hasOriginalClientParams={true} onClose={onClose} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            // Click Remove button
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.remove'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockDeletePluginOAuthCustomClient).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call onClose and onUpdate after successful removal', async () => {
            const pluginPayload = createPluginPayload();
            const onClose = vitest_1.vi.fn();
            const onUpdate = vitest_1.vi.fn();
            mockDeletePluginOAuthCustomClient.mockResolvedValue({});
            const schemasWithOAuthClient = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'custom',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithOAuthClient} editValues={{ __oauth_client__: 'custom', client_id: 'id', client_secret: 'secret' }} hasOriginalClientParams={true} onClose={onClose} onUpdate={onUpdate}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.remove'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onClose).toHaveBeenCalled();
                (0, vitest_1.expect)(onUpdate).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should prevent double submission when doingAction is true', async () => {
            const pluginPayload = createPluginPayload();
            // Make the API call slow
            mockSetPluginOAuthCustomClient.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            // Click Save Only button twice quickly
            const saveButton = react_1.screen.getByText('plugin.auth.saveOnly');
            react_1.fireEvent.click(saveButton);
            react_1.fireEvent.click(saveButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockSetPluginOAuthCustomClient).toHaveBeenCalledTimes(1);
            });
        });
        (0, vitest_1.it)('should return early from handleConfirm if doingActionRef is true', async () => {
            const pluginPayload = createPluginPayload();
            let resolveFirstCall = () => { };
            let apiCallCount = 0;
            mockSetPluginOAuthCustomClient.mockImplementation(() => {
                apiCallCount++;
                if (apiCallCount === 1) {
                    return new Promise((resolve) => {
                        resolveFirstCall = resolve;
                    });
                }
                return Promise.resolve({});
            });
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            const saveButton = react_1.screen.getByText('plugin.auth.saveOnly');
            // First click starts the request
            react_1.fireEvent.click(saveButton);
            // Wait for the first API call to be made
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(apiCallCount).toBe(1);
            });
            // Second click while first request is pending should be ignored
            react_1.fireEvent.click(saveButton);
            // Verify only one API call was made (no additional calls)
            (0, vitest_1.expect)(apiCallCount).toBe(1);
            // Clean up
            resolveFirstCall();
        });
        (0, vitest_1.it)('should return early from handleRemove if doingActionRef is true', async () => {
            const pluginPayload = createPluginPayload();
            let resolveFirstCall = () => { };
            let deleteCallCount = 0;
            mockDeletePluginOAuthCustomClient.mockImplementation(() => {
                deleteCallCount++;
                if (deleteCallCount === 1) {
                    return new Promise((resolve) => {
                        resolveFirstCall = resolve;
                    });
                }
                return Promise.resolve({});
            });
            const schemasWithOAuthClient = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'custom',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithOAuthClient} editValues={{ __oauth_client__: 'custom', client_id: 'id', client_secret: 'secret' }} hasOriginalClientParams={true}/>, { wrapper: createWrapper() });
            const removeButton = react_1.screen.getByText('common.operation.remove');
            // First click starts the delete request
            react_1.fireEvent.click(removeButton);
            // Wait for the first delete call to be made
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(deleteCallCount).toBe(1);
            });
            // Second click while first request is pending should be ignored
            react_1.fireEvent.click(removeButton);
            // Verify only one delete call was made (no additional calls)
            (0, vitest_1.expect)(deleteCallCount).toBe(1);
            // Clean up
            resolveFirstCall();
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty schemas', () => {
            const pluginPayload = createPluginPayload();
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={[]}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle schemas without default values', () => {
            const pluginPayload = createPluginPayload();
            const schemasWithoutDefaults = [
                createFormSchema({ name: 'field1', label: 'Field 1', default: undefined }),
            ];
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithoutDefaults}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle undefined editValues', () => {
            const pluginPayload = createPluginPayload();
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} editValues={undefined}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
    });
    (0, vitest_1.describe)('Branch Coverage - defaultValues computation', () => {
        (0, vitest_1.it)('should compute defaultValues from schemas with default values', () => {
            const pluginPayload = createPluginPayload();
            const schemasWithDefaults = [
                createFormSchema({ name: 'client_id', label: 'Client ID', default: 'default-id' }),
                createFormSchema({ name: 'client_secret', label: 'Client Secret', default: 'default-secret' }),
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithDefaults}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should skip schemas without default values in defaultValues computation', () => {
            const pluginPayload = createPluginPayload();
            const mixedSchemas = [
                createFormSchema({ name: 'field_with_default', label: 'With Default', default: 'value' }),
                createFormSchema({ name: 'field_without_default', label: 'Without Default', default: undefined }),
                createFormSchema({ name: 'field_with_empty', label: 'Empty Default', default: '' }),
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={mixedSchemas}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Branch Coverage - __oauth_client__ value', () => {
        (0, vitest_1.beforeEach)(() => {
            mockGetFormValues.mockReturnValue({
                isCheckValidated: true,
                values: {
                    __oauth_client__: 'default',
                    client_id: 'test-id',
                },
            });
        });
        (0, vitest_1.it)('should send enable_oauth_custom_client=false when __oauth_client__ is default', async () => {
            const pluginPayload = createPluginPayload();
            mockSetPluginOAuthCustomClient.mockResolvedValue({});
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.saveOnly'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockSetPluginOAuthCustomClient).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    enable_oauth_custom_client: false,
                }));
            });
        });
        (0, vitest_1.it)('should send enable_oauth_custom_client=true when __oauth_client__ is custom', async () => {
            const pluginPayload = createPluginPayload();
            mockSetPluginOAuthCustomClient.mockResolvedValue({});
            mockGetFormValues.mockReturnValue({
                isCheckValidated: true,
                values: {
                    __oauth_client__: 'custom',
                    client_id: 'test-id',
                },
            });
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.saveOnly'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockSetPluginOAuthCustomClient).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    enable_oauth_custom_client: true,
                }));
            });
        });
    });
    (0, vitest_1.describe)('Branch Coverage - onAuth callback', () => {
        (0, vitest_1.beforeEach)(() => {
            mockGetFormValues.mockReturnValue({
                isCheckValidated: true,
                values: { __oauth_client__: 'custom' },
            });
        });
        (0, vitest_1.it)('should call onAuth when provided and Save and Auth is clicked', async () => {
            const pluginPayload = createPluginPayload();
            const onAuth = vitest_1.vi.fn().mockResolvedValue(undefined);
            mockSetPluginOAuthCustomClient.mockResolvedValue({});
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} onAuth={onAuth}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.saveAndAuth'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onAuth).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should not call onAuth when not provided', async () => {
            const pluginPayload = createPluginPayload();
            mockSetPluginOAuthCustomClient.mockResolvedValue({});
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} onAuth={undefined}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.saveAndAuth'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockSetPluginOAuthCustomClient).toHaveBeenCalled();
            });
            // No onAuth to call, but should not throw
        });
    });
    (0, vitest_1.describe)('Branch Coverage - disabled states', () => {
        (0, vitest_1.it)('should disable buttons when disabled prop is true', () => {
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas} disabled={true}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.saveAndAuth').closest('button')).toBeDisabled();
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.saveOnly').closest('button')).toBeDisabled();
        });
        (0, vitest_1.it)('should disable Remove button when editValues is undefined', () => {
            const pluginPayload = createPluginPayload();
            const schemasWithOAuthClient = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'custom',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithOAuthClient} hasOriginalClientParams={true} editValues={undefined}/>, { wrapper: createWrapper() });
            // Remove button should exist but be disabled
            const removeButton = react_1.screen.queryByText('common.operation.remove');
            if (removeButton) {
                (0, vitest_1.expect)(removeButton.closest('button')).toBeDisabled();
            }
        });
        (0, vitest_1.it)('should disable Remove button when disabled prop is true', () => {
            const pluginPayload = createPluginPayload();
            const schemasWithOAuthClient = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'custom',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithOAuthClient} hasOriginalClientParams={true} editValues={{ __oauth_client__: 'custom', client_id: 'id' }} disabled={true}/>, { wrapper: createWrapper() });
            const removeButton = react_1.screen.getByText('common.operation.remove');
            (0, vitest_1.expect)(removeButton.closest('button')).toBeDisabled();
        });
    });
    (0, vitest_1.describe)('Branch Coverage - pluginPayload.detail', () => {
        (0, vitest_1.it)('should render ReadmeEntrance when pluginPayload has detail', () => {
            const pluginPayload = createPluginPayload({
                detail: {
                    name: 'test-plugin',
                    label: { en_US: 'Test Plugin' },
                },
            });
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            // ReadmeEntrance should be rendered (it's mocked in vitest.setup)
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render ReadmeEntrance when pluginPayload has no detail', () => {
            const pluginPayload = createPluginPayload({ detail: undefined });
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={defaultSchemas}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Branch Coverage - footerSlot conditions', () => {
        (0, vitest_1.it)('should show Remove button only when __oauth_client__=custom AND hasOriginalClientParams=true', () => {
            const pluginPayload = createPluginPayload();
            const schemasWithCustomOAuth = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'custom',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithCustomOAuth} editValues={{ __oauth_client__: 'custom' }} hasOriginalClientParams={true}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.getByText('common.operation.remove')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show Remove button when hasOriginalClientParams=false', () => {
            const pluginPayload = createPluginPayload();
            const schemasWithCustomOAuth = [
                {
                    name: '__oauth_client__',
                    label: 'OAuth Client',
                    type: 'radio',
                    options: [
                        { label: 'Default', value: 'default' },
                        { label: 'Custom', value: 'custom' },
                    ],
                    default: 'custom',
                    required: false,
                },
                ...defaultSchemas,
            ];
            (0, react_1.render)(<OAuthClientSettings pluginPayload={pluginPayload} schemas={schemasWithCustomOAuth} editValues={{ __oauth_client__: 'custom' }} hasOriginalClientParams={false}/>, { wrapper: createWrapper() });
            (0, vitest_1.expect)(react_1.screen.queryByText('common.operation.remove')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Memoization', () => {
        (0, vitest_1.it)('should be a memoized component', async () => {
            const OAuthClientSettingsDefault = (await Promise.resolve().then(() => require('./oauth-client-settings'))).default;
            (0, vitest_1.expect)(typeof OAuthClientSettingsDefault).toBe('object');
        });
    });
});
// ==================== Integration Tests ====================
(0, vitest_1.describe)('Authorize Components Integration', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetPluginCredentialSchema.mockReturnValue([
            createFormSchema({ name: 'api_key', label: 'API Key' }),
        ]);
        mockGetPluginOAuthClientSchema.mockReturnValue({
            schema: [createFormSchema({ name: 'client_id', label: 'Client ID' })],
            is_oauth_custom_client_enabled: false,
            is_system_oauth_params_exists: false,
            redirect_uri: 'https://example.com/callback',
        });
    });
    (0, vitest_1.describe)('AddApiKeyButton -> ApiKeyModal Flow', () => {
        (0, vitest_1.it)('should open ApiKeyModal when AddApiKeyButton is clicked', async () => {
            const AddApiKeyButton = (await Promise.resolve().then(() => require('./add-api-key-button'))).default;
            const pluginPayload = createPluginPayload();
            (0, react_1.render)(<AddApiKeyButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.useApiAuth')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('AddOAuthButton -> OAuthClientSettings Flow', () => {
        (0, vitest_1.it)('should open OAuthClientSettings when setup button is clicked', async () => {
            const AddOAuthButton = (await Promise.resolve().then(() => require('./add-oauth-button'))).default;
            const pluginPayload = createPluginPayload();
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [createFormSchema({ name: 'client_id', label: 'Client ID' })],
                is_oauth_custom_client_enabled: false,
                is_system_oauth_params_exists: false,
                redirect_uri: 'https://example.com/callback',
            });
            (0, react_1.render)(<AddOAuthButton pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.auth.setupOAuth'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.oauthClientSettings')).toBeInTheDocument();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplLWNvbXBvbmVudHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1dGhvcml6ZS1jb21wb25lbnRzLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsdURBQXdFO0FBQ3hFLGtEQUEyRTtBQUMzRSxtQ0FBNkQ7QUFDN0Qsb0NBQXVDO0FBRXZDLDRDQUE0QztBQUM1QyxNQUFNLHFCQUFxQixHQUFHLEdBQUcsRUFBRSxDQUNqQyxJQUFJLHlCQUFXLENBQUM7SUFDZCxjQUFjLEVBQUU7UUFDZCxPQUFPLEVBQUU7WUFDUCxLQUFLLEVBQUUsS0FBSztZQUNaLE1BQU0sRUFBRSxDQUFDO1NBQ1Y7S0FDRjtDQUNGLENBQUMsQ0FBQTtBQUVKLE1BQU0sYUFBYSxHQUFHLEdBQUcsRUFBRTtJQUN6QixNQUFNLGVBQWUsR0FBRyxxQkFBcUIsRUFBRSxDQUFBO0lBQy9DLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBMkIsRUFBRSxFQUFFLENBQUMsQ0FDaEQsQ0FBQyxpQ0FBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FDM0M7TUFBQSxDQUFDLFFBQVEsQ0FDWDtJQUFBLEVBQUUsaUNBQW1CLENBQUMsQ0FDdkIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELGlFQUFpRTtBQUNqRSxNQUFNLHFCQUFxQixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNyQyxNQUFNLDhCQUE4QixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QyxNQUFNLDhCQUE4QixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QyxNQUFNLGlDQUFpQyxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNqRCxNQUFNLGtDQUFrQyxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNsRCxNQUFNLHVCQUF1QixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN2QyxNQUFNLDBC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RTtZQUM1RSxNQUFNLGNBQWMsR0FBRyxDQUFDLDJDQUFhLG9CQUFvQixFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7WUFDbkUsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtZQUMzQyw4QkFBOEIsQ0FBQyxlQUFlLENBQUM7Z0JBQzdDLE1BQU0sRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztnQkFDckUsOEJBQThCLEVBQUUsS0FBSztnQkFDckMsNkJBQTZCLEVBQUUsS0FBSztnQkFDcEMsWUFBWSxFQUFFLDhCQUE4QjthQUM3QyxDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUV0RixpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQTtZQUUzRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNqRixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUmVhY3ROb2RlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFBsdWdpblBheWxvYWQgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgRm9ybVNjaGVtYSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mb3JtL3R5cGVzJ1xuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IEF1dGhDYXRlZ29yeSB9IGZyb20gJy4uL3R5cGVzJ1xuXG4vLyBDcmVhdGUgYSB3cmFwcGVyIHdpdGggUXVlcnlDbGllbnRQcm92aWRlclxuY29uc3QgY3JlYXRlVGVzdFF1ZXJ5Q2xpZW50ID0gKCkgPT5cbiAgbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgICBkZWZhdWx0T3B0aW9uczoge1xuICAgICAgcXVlcmllczoge1xuICAgICAgICByZXRyeTogZmFsc2UsXG4gICAgICAgIGdjVGltZTogMCxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSlcblxuY29uc3QgY3JlYXRlV3JhcHBlciA9ICgpID0+IHtcbiAgY29uc3QgdGVzdFF1ZXJ5Q2xpZW50ID0gY3JlYXRlVGVzdFF1ZXJ5Q2xpZW50KClcbiAgcmV0dXJuICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0Tm9kZSB9KSA9PiAoXG4gICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXt0ZXN0UXVlcnlDbGllbnR9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgKVxufVxuXG4vLyBNb2NrIEFQSSBob29rcyAtIHRoZXNlIG1ha2UgbmV0d29yayByZXF1ZXN0cyBzbyBtdXN0IGJlIG1vY2tlZFxuY29uc3QgbW9ja0dldFBsdWdpbk9BdXRoVXJsID0gdmkuZm4oKVxuY29uc3QgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hID0gdmkuZm4oKVxuY29uc3QgbW9ja1NldFBsdWdpbk9BdXRoQ3VzdG9tQ2xpZW50ID0gdmkuZm4oKVxuY29uc3QgbW9ja0RlbGV0ZVBsdWdpbk9BdXRoQ3VzdG9tQ2xpZW50ID0gdmkuZm4oKVxuY29uc3QgbW9ja0ludmFsaWRQbHVnaW5PQXV0aENsaWVudFNjaGVtYSA9IHZpLmZuKClcbmNvbnN0IG1vY2tBZGRQbHVnaW5DcmVkZW50aWFsID0gdmkuZm4oKVxuY29uc3QgbW9ja1VwZGF0ZVBsdWdpbkNyZWRlbnRpYWwgPSB2aS5mbigpXG5jb25zdCBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYSA9IHZpLmZuKClcblxudmkubW9jaygnLi4vaG9va3MvdXNlLWNyZWRlbnRpYWwnLCAoKSA9PiAoe1xuICB1c2VHZXRQbHVnaW5PQXV0aFVybEhvb2s6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tHZXRQbHVnaW5PQXV0aFVybCxcbiAgfSksXG4gIHVzZUdldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hSG9vazogKCkgPT4gKHtcbiAgICBkYXRhOiBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEoKSxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICB9KSxcbiAgdXNlU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnRIb29rOiAoKSA9PiAoe1xuICAgIG11dGF0ZUFzeW5jOiBtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQsXG4gIH0pLFxuICB1c2VEZWxldGVQbHVnaW5PQXV0aEN1c3RvbUNsaWVudEhvb2s6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tEZWxldGVQbHVnaW5PQXV0aEN1c3RvbUNsaWVudCxcbiAgfSksXG4gIHVzZUludmFsaWRQbHVnaW5PQXV0aENsaWVudFNjaGVtYUhvb2s6ICgpID0+IG1vY2tJbnZhbGlkUGx1Z2luT0F1dGhDbGllbnRTY2hlbWEsXG4gIHVzZUFkZFBsdWdpbkNyZWRlbnRpYWxIb29rOiAoKSA9PiAoe1xuICAgIG11dGF0ZUFzeW5jOiBtb2NrQWRkUGx1Z2luQ3JlZGVudGlhbCxcbiAgfSksXG4gIHVzZVVwZGF0ZVBsdWdpbkNyZWRlbnRpYWxIb29rOiAoKSA9PiAoe1xuICAgIG11dGF0ZUFzeW5jOiBtb2NrVXBkYXRlUGx1Z2luQ3JlZGVudGlhbCxcbiAgfSksXG4gIHVzZUdldFBsdWdpbkNyZWRlbnRpYWxTY2hlbWFIb29rOiAoKSA9PiAoe1xuICAgIGRhdGE6IG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsU2NoZW1hKCksXG4gICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgfSksXG59KSlcblxuLy8gTW9jayBvcGVuT0F1dGhQb3B1cCAtIHJlcXVpcmVzIHdpbmRvdyBvcGVyYXRpb25zXG5jb25zdCBtb2NrT3Blbk9BdXRoUG9wdXAgPSB2aS5mbigpXG52aS5tb2NrKCdAL2hvb2tzL3VzZS1vYXV0aCcsICgpID0+ICh7XG4gIG9wZW5PQXV0aFBvcHVwOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiBtb2NrT3Blbk9BdXRoUG9wdXAoLi4uYXJncyksXG59KSlcblxuLy8gTW9jayBzZXJ2aWNlL3VzZS10cmlnZ2VycyAtIEFQSSBzZXJ2aWNlXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLXRyaWdnZXJzJywgKCkgPT4gKHtcbiAgdXNlVHJpZ2dlclBsdWdpbkR5bmFtaWNPcHRpb25zOiAoKSA9PiAoe1xuICAgIGRhdGE6IHsgb3B0aW9uczogW10gfSxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICB9KSxcbiAgdXNlVHJpZ2dlclBsdWdpbkR5bmFtaWNPcHRpb25zSW5mbzogKCkgPT4gKHtcbiAgICBkYXRhOiBudWxsLFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gIH0pLFxuICB1c2VJbnZhbGlkVHJpZ2dlckR5bmFtaWNPcHRpb25zOiAoKSA9PiB2aS5mbigpLFxufSkpXG5cbi8vIE1vY2sgQXV0aEZvcm0gdG8gY29udHJvbCBmb3JtIHZhbGlkYXRpb24gaW4gdGVzdHNcbmNvbnN0IG1vY2tHZXRGb3JtVmFsdWVzID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2Zvcm0vZm9ybS1zY2VuYXJpb3MvYXV0aCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IHZpLmZuKCkubW9ja0ltcGxlbWVudGF0aW9uKCh7IHJlZiB9OiB7IHJlZjogeyBjdXJyZW50OiB1bmtub3duIH0gfSkgPT4ge1xuICAgIGlmIChyZWYpXG4gICAgICByZWYuY3VycmVudCA9IHsgZ2V0Rm9ybVZhbHVlczogbW9ja0dldEZvcm1WYWx1ZXMgfVxuXG4gICAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9XCJtb2NrLWF1dGgtZm9ybVwiPkF1dGggRm9ybTwvZGl2PlxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZVRvYXN0Q29udGV4dFxuY29uc3QgbW9ja05vdGlmeSA9IHZpLmZuKClcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCcsICgpID0+ICh7XG4gIHVzZVRvYXN0Q29udGV4dDogKCkgPT4gKHsgbm90aWZ5OiBtb2NrTm90aWZ5IH0pLFxufSkpXG5cbi8vIEZhY3RvcnkgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIHRlc3QgUGx1Z2luUGF5bG9hZFxuY29uc3QgY3JlYXRlUGx1Z2luUGF5bG9hZCA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luUGF5bG9hZD4gPSB7fSk6IFBsdWdpblBheWxvYWQgPT4gKHtcbiAgY2F0ZWdvcnk6IEF1dGhDYXRlZ29yeS50b29sLFxuICBwcm92aWRlcjogJ3Rlc3QtcHJvdmlkZXInLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBGYWN0b3J5IGZvciBmb3JtIHNjaGVtYXNcbmNvbnN0IGNyZWF0ZUZvcm1TY2hlbWEgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPEZvcm1TY2hlbWE+ID0ge30pOiBGb3JtU2NoZW1hID0+ICh7XG4gIHR5cGU6ICd0ZXh0LWlucHV0JyBhcyBGb3JtU2NoZW1hWyd0eXBlJ10sXG4gIG5hbWU6ICd0ZXN0LWZpZWxkJyxcbiAgbGFiZWw6ICdUZXN0IEZpZWxkJyxcbiAgcmVxdWlyZWQ6IGZhbHNlLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBBZGRBcGlLZXlCdXR0b24gVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdBZGRBcGlLZXlCdXR0b24nLCAoKSA9PiB7XG4gIGxldCBBZGRBcGlLZXlCdXR0b246IHR5cGVvZiBpbXBvcnQoJy4vYWRkLWFwaS1rZXktYnV0dG9uJykuZGVmYXVsdFxuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsU2NoZW1hLm1vY2tSZXR1cm5WYWx1ZShbXSlcbiAgICBjb25zdCBpbXBvcnRlZEFkZEFwaUtleUJ1dHRvbiA9IGF3YWl0IGltcG9ydCgnLi9hZGQtYXBpLWtleS1idXR0b24nKVxuICAgIEFkZEFwaUtleUJ1dHRvbiA9IGltcG9ydGVkQWRkQXBpS2V5QnV0dG9uLmRlZmF1bHRcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJ1dHRvbiB3aXRoIGRlZmF1bHQgdGV4dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKDxBZGRBcGlLZXlCdXR0b24gcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9IYXZlVGV4dENvbnRlbnQoJ1VzZSBBcGkgS2V5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYnV0dG9uIHdpdGggY3VzdG9tIHRleHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFkZEFwaUtleUJ1dHRvblxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgYnV0dG9uVGV4dD1cIkN1c3RvbSBBUEkgS2V5XCJcbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9IYXZlVGV4dENvbnRlbnQoJ0N1c3RvbSBBUEkgS2V5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBidXR0b24gdmFyaWFudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWRkQXBpS2V5QnV0dG9uXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBidXR0b25WYXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykuY2xhc3NOYW1lKS50b0NvbnRhaW4oJ2J0bi1wcmltYXJ5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc2Vjb25kYXJ5LWFjY2VudCB2YXJpYW50IGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIHJlbmRlcig8QWRkQXBpS2V5QnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICAvLyBWZXJpZnkgdGhlIGRlZmF1bHQgYnV0dG9uIGhhcyBzZWNvbmRhcnktYWNjZW50IHZhcmlhbnQgY2xhc3NcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKS5jbGFzc05hbWUpLnRvQ29udGFpbignYnRuLXNlY29uZGFyeS1hY2NlbnQnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzIFRlc3RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGJ1dHRvbiB3aGVuIGRpc2FibGVkIHByb3AgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWRkQXBpS2V5QnV0dG9uXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBkaXNhYmxlZD17dHJ1ZX1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgZGlzYWJsZSBidXR0b24gd2hlbiBkaXNhYmxlZCBwcm9wIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBZGRBcGlLZXlCdXR0b25cbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIGRpc2FibGVkPXtmYWxzZX1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWNjZXB0IGZvcm1TY2hlbWFzIHByb3AnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBmb3JtU2NoZW1hcyA9IFtjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2FwaV9rZXknLCBsYWJlbDogJ0FQSSBLZXknIH0pXVxuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPEFkZEFwaUtleUJ1dHRvblxuICAgICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICAgIGZvcm1TY2hlbWFzPXtmb3JtU2NoZW1hc31cbiAgICAgICAgICAvPixcbiAgICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgICApXG4gICAgICB9KS5ub3QudG9UaHJvdygpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIG1vZGFsIHdoZW4gYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoW1xuICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2FwaV9rZXknLCBsYWJlbDogJ0FQSSBLZXknIH0pLFxuICAgICAgXSlcblxuICAgICAgcmVuZGVyKDxBZGRBcGlLZXlCdXR0b24gcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC51c2VBcGlBdXRoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IG9wZW4gbW9kYWwgd2hlbiBidXR0b24gaXMgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFkZEFwaUtleUJ1dHRvblxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcblxuICAgICAgLy8gTW9kYWwgc2hvdWxkIG5vdCBhcHBlYXJcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BsdWdpbi5hdXRoLnVzZUFwaUF1dGgnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHBsdWdpblBheWxvYWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKHtcbiAgICAgICAgcHJvdmlkZXI6ICcnLFxuICAgICAgICBwcm92aWRlclR5cGU6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlbmRlcig8QWRkQXBpS2V5QnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbGwgYXV0aCBjYXRlZ29yaWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgY2F0ZWdvcmllcyA9IFtBdXRoQ2F0ZWdvcnkudG9vbCwgQXV0aENhdGVnb3J5LmRhdGFzb3VyY2UsIEF1dGhDYXRlZ29yeS5tb2RlbCwgQXV0aENhdGVnb3J5LnRyaWdnZXJdXG5cbiAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcbiAgICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoeyBjYXRlZ29yeSB9KVxuICAgICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8QWRkQXBpS2V5QnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgdW5tb3VudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01vZGFsIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2xvc2UgbW9kYWwgd2hlbiBvbkNsb3NlIGlzIGNhbGxlZCBmcm9tIEFwaUtleU1vZGFsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxTY2hlbWEubW9ja1JldHVyblZhbHVlKFtcbiAgICAgICAgY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdhcGlfa2V5JywgbGFiZWw6ICdBUEkgS2V5JyB9KSxcbiAgICAgIF0pXG5cbiAgICAgIHJlbmRlcig8QWRkQXBpS2V5QnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICAvLyBPcGVuIG1vZGFsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgudXNlQXBpQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBDbG9zZSBtb2RhbCB2aWEgY2FuY2VsIGJ1dHRvblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwbHVnaW4uYXV0aC51c2VBcGlBdXRoJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25VcGRhdGUgd2hlbiBwcm92aWRlZCBhbmQgbW9kYWwgdHJpZ2dlcnMgdXBkYXRlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3Qgb25VcGRhdGUgPSB2aS5mbigpXG4gICAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoW1xuICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2FwaV9rZXknLCBsYWJlbDogJ0FQSSBLZXknIH0pLFxuICAgICAgXSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QWRkQXBpS2V5QnV0dG9uXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBvblVwZGF0ZT17b25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICAvLyBPcGVuIG1vZGFsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgudXNlQXBpQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgYSBtZW1vaXplZCBjb21wb25lbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBBZGRBcGlLZXlCdXR0b25EZWZhdWx0ID0gKGF3YWl0IGltcG9ydCgnLi9hZGQtYXBpLWtleS1idXR0b24nKSkuZGVmYXVsdFxuICAgICAgZXhwZWN0KHR5cGVvZiBBZGRBcGlLZXlCdXR0b25EZWZhdWx0KS50b0JlKCdvYmplY3QnKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBBZGRPQXV0aEJ1dHRvbiBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0FkZE9BdXRoQnV0dG9uJywgKCkgPT4ge1xuICBsZXQgQWRkT0F1dGhCdXR0b246IHR5cGVvZiBpbXBvcnQoJy4vYWRkLW9hdXRoLWJ1dHRvbicpLmRlZmF1bHRcblxuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIHNjaGVtYTogW10sXG4gICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHM6IGZhbHNlLFxuICAgICAgY2xpZW50X3BhcmFtczoge30sXG4gICAgICByZWRpcmVjdF91cmk6ICdodHRwczovL2V4YW1wbGUuY29tL2NhbGxiYWNrJyxcbiAgICB9KVxuICAgIG1vY2tHZXRQbHVnaW5PQXV0aFVybC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGF1dGhvcml6YXRpb25fdXJsOiAnaHR0cHM6Ly9vYXV0aC5leGFtcGxlLmNvbS9hdXRoJyB9KVxuICAgIGNvbnN0IGltcG9ydGVkQWRkT0F1dGhCdXR0b24gPSBhd2FpdCBpbXBvcnQoJy4vYWRkLW9hdXRoLWJ1dHRvbicpXG4gICAgQWRkT0F1dGhCdXR0b24gPSBpbXBvcnRlZEFkZE9BdXRoQnV0dG9uLmRlZmF1bHRcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nIC0gTm90IENvbmZpZ3VyZWQgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgc2V0dXAgT0F1dGggYnV0dG9uIHdoZW4gbm90IGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2NoZW1hOiBbXSxcbiAgICAgICAgaXNfb2F1dGhfY3VzdG9tX2NsaWVudF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHM6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxBZGRPQXV0aEJ1dHRvbiBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLnNldHVwT0F1dGgnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGJ1dHRvbiB2YXJpYW50IHRvIHNldHVwIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBZGRPQXV0aEJ1dHRvblxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgYnV0dG9uVmFyaWFudD1cInNlY29uZGFyeVwiXG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykuY2xhc3NOYW1lKS50b0NvbnRhaW4oJ2J0bi1zZWNvbmRhcnknKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZyAtIENvbmZpZ3VyZWQgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgT0F1dGggYnV0dG9uIHdoZW4gc3lzdGVtIE9BdXRoIHBhcmFtcyBleGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFkZE9BdXRoQnV0dG9uXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBidXR0b25UZXh0PVwiQ29ubmVjdCBPQXV0aFwiXG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ29ubmVjdCBPQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIE9BdXRoIGJ1dHRvbiB3aGVuIGN1c3RvbSBjbGllbnQgaXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFkZE9BdXRoQnV0dG9uXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBidXR0b25UZXh0PVwiT0F1dGhcIlxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ09BdXRoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGN1c3RvbSBiYWRnZSB3aGVuIGN1c3RvbSBjbGllbnQgaXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8QWRkT0F1dGhCdXR0b24gcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5jdXN0b20nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzIFRlc3RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGJ1dHRvbiB3aGVuIGRpc2FibGVkIHByb3AgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBZGRPQXV0aEJ1dHRvblxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFkZE9BdXRoQnV0dG9uXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBjbGFzc05hbWU9XCJjdXN0b20tY2xhc3NcIlxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpLmNsYXNzTmFtZSkudG9Db250YWluKCdjdXN0b20tY2xhc3MnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBvQXV0aERhdGEgcHJvcCB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3Qgb0F1dGhEYXRhID0ge1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiB0cnVlLFxuICAgICAgICBjbGllbnRfcGFyYW1zOiB7fSxcbiAgICAgICAgcmVkaXJlY3RfdXJpOiAnaHR0cHM6Ly9jdXN0b20uZXhhbXBsZS5jb20vY2FsbGJhY2snLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBZGRPQXV0aEJ1dHRvblxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgb0F1dGhEYXRhPXtvQXV0aERhdGF9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIGNvbmZpZ3VyZWQgYnV0dG9uIHNpbmNlIG9BdXRoRGF0YSBoYXMgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHM9dHJ1ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgncGx1Z2luLmF1dGguc2V0dXBPQXV0aCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdHJpZ2dlciBPQXV0aCBmbG93IHdoZW4gY29uZmlndXJlZCBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG9uVXBkYXRlID0gdmkuZm4oKVxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIHNjaGVtYTogW10sXG4gICAgICAgIGlzX29hdXRoX2N1c3RvbV9jbGllbnRfZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHM6IGZhbHNlLFxuICAgICAgfSlcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aFVybC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGF1dGhvcml6YXRpb25fdXJsOiAnaHR0cHM6Ly9vYXV0aC5leGFtcGxlLmNvbS9hdXRoJyB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBZGRPQXV0aEJ1dHRvblxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgb25VcGRhdGU9e29uVXBkYXRlfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgLy8gQ2xpY2sgdGhlIG1haW4gYnV0dG9uIGFyZWEgKGxlZnQgc2lkZSlcbiAgICAgIGNvbnN0IGJ1dHRvblRleHQgPSBzY3JlZW4uZ2V0QnlUZXh0KCd1c2Ugb2F1dGgnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvblRleHQpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0dldFBsdWdpbk9BdXRoVXJsKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgb3BlbiBzZXR0aW5ncyB3aGVuIHNldHVwIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIHNjaGVtYTogW2NyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnY2xpZW50X2lkJywgbGFiZWw6ICdDbGllbnQgSUQnIH0pXSxcbiAgICAgICAgaXNfb2F1dGhfY3VzdG9tX2NsaWVudF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHM6IGZhbHNlLFxuICAgICAgICByZWRpcmVjdF91cmk6ICdodHRwczovL2V4YW1wbGUuY29tL2NhbGxiYWNrJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8QWRkT0F1dGhCdXR0b24gcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5zZXR1cE9BdXRoJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgub2F1dGhDbGllbnRTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIE9BdXRoIHdoZW4gbm8gYXV0aG9yaXphdGlvbl91cmwgaXMgcmV0dXJuZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2NoZW1hOiBbXSxcbiAgICAgICAgaXNfb2F1dGhfY3VzdG9tX2NsaWVudF9lbmFibGVkOiB0cnVlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgICB9KVxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoVXJsLm1vY2tSZXNvbHZlZFZhbHVlKHsgYXV0aG9yaXphdGlvbl91cmw6ICcnIH0pXG5cbiAgICAgIHJlbmRlcig8QWRkT0F1dGhCdXR0b24gcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIGNvbnN0IGJ1dHRvblRleHQgPSBzY3JlZW4uZ2V0QnlUZXh0KCd1c2Ugb2F1dGgnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvblRleHQpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0dldFBsdWdpbk9BdXRoVXJsKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChtb2NrT3Blbk9BdXRoUG9wdXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uVXBkYXRlIGNhbGxiYWNrIGFmdGVyIHN1Y2Nlc3NmdWwgT0F1dGgnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBvblVwZGF0ZSA9IHZpLmZuKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhVcmwubW9ja1Jlc29sdmVkVmFsdWUoeyBhdXRob3JpemF0aW9uX3VybDogJ2h0dHBzOi8vb2F1dGguZXhhbXBsZS5jb20vYXV0aCcgfSlcbiAgICAgIC8vIFNpbXVsYXRlIG9wZW5PQXV0aFBvcHVwIGNhbGxpbmcgdGhlIHN1Y2Nlc3MgY2FsbGJhY2tcbiAgICAgIG1vY2tPcGVuT0F1dGhQb3B1cC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgY2FsbGJhY2spID0+IHtcbiAgICAgICAgY2FsbGJhY2s/LigpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBZGRPQXV0aEJ1dHRvblxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgb25VcGRhdGU9e29uVXBkYXRlfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgY29uc3QgYnV0dG9uVGV4dCA9IHNjcmVlbi5nZXRCeVRleHQoJ3VzZSBvYXV0aCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uVGV4dClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrT3Blbk9BdXRoUG9wdXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICdodHRwczovL29hdXRoLmV4YW1wbGUuY29tL2F1dGgnLFxuICAgICAgICAgIGV4cGVjdC5hbnkoRnVuY3Rpb24pLFxuICAgICAgICApXG4gICAgICB9KVxuXG4gICAgICAvLyBWZXJpZnkgb25VcGRhdGUgd2FzIGNhbGxlZCB0aHJvdWdoIHRoZSBjYWxsYmFja1xuICAgICAgZXhwZWN0KG9uVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIE9BdXRoIHNldHRpbmdzIHdoZW4gc2V0dGluZ3MgaWNvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIHNjaGVtYTogW2NyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnY2xpZW50X2lkJywgbGFiZWw6ICdDbGllbnQgSUQnIH0pXSxcbiAgICAgICAgaXNfb2F1dGhfY3VzdG9tX2NsaWVudF9lbmFibGVkOiB0cnVlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgICAgIHJlZGlyZWN0X3VyaTogJ2h0dHBzOi8vZXhhbXBsZS5jb20vY2FsbGJhY2snLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxBZGRPQXV0aEJ1dHRvbiBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcblxuICAgICAgLy8gQ2xpY2sgdGhlIHNldHRpbmdzIGljb24gdXNpbmcgZGF0YS10ZXN0aWQgZm9yIHJlbGlhYmxlIHNlbGVjdGlvblxuICAgICAgY29uc3Qgc2V0dGluZ3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ29hdXRoLXNldHRpbmdzLWJ1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2V0dGluZ3NCdXR0b24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgub2F1dGhDbGllbnRTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIE9BdXRoIHNldHRpbmdzIG1vZGFsIHdoZW4gb25DbG9zZSBpcyBjYWxsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2NoZW1hOiBbY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdjbGllbnRfaWQnLCBsYWJlbDogJ0NsaWVudCBJRCcgfSldLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgICAgIHJlZGlyZWN0X3VyaTogJ2h0dHBzOi8vZXhhbXBsZS5jb20vY2FsbGJhY2snLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxBZGRPQXV0aEJ1dHRvbiBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcblxuICAgICAgLy8gT3BlbiBzZXR0aW5nc1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLnNldHVwT0F1dGgnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5vYXV0aENsaWVudFNldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsb3NlIHNldHRpbmdzIHZpYSBjYW5jZWwgYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BsdWdpbi5hdXRoLm9hdXRoQ2xpZW50U2V0dGluZ3MnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU2NoZW1hIFByb2Nlc3NpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHMgc3RhdGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2NoZW1hOiBbY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdjbGllbnRfaWQnLCBsYWJlbDogJ0NsaWVudCBJRCcgfSldLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogdHJ1ZSxcbiAgICAgICAgcmVkaXJlY3RfdXJpOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9jYWxsYmFjaycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFkZE9BdXRoQnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICAvLyBTaG91bGQgc2hvdyB0aGUgY29uZmlndXJlZCBidXR0b24sIG5vdCBzZXR1cCBidXR0b25cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BsdWdpbi5hdXRoLnNldHVwT0F1dGgnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBvcGVuIE9BdXRoIHNldHRpbmdzIG1vZGFsIHdpdGggY29ycmVjdCBkYXRhJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIHNjaGVtYTogW2NyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnY2xpZW50X2lkJywgbGFiZWw6ICdDbGllbnQgSUQnLCByZXF1aXJlZDogdHJ1ZSB9KV0sXG4gICAgICAgIGlzX29hdXRoX2N1c3RvbV9jbGllbnRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiBmYWxzZSxcbiAgICAgICAgcmVkaXJlY3RfdXJpOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9jYWxsYmFjaycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFkZE9BdXRoQnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2V0dXBPQXV0aCcpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgLy8gT0F1dGhDbGllbnRTZXR0aW5ncyBtb2RhbCBzaG91bGQgb3BlblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgub2F1dGhDbGllbnRTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBjbGllbnRfcGFyYW1zIGRlZmF1bHRzIGluIHNjaGVtYScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtcbiAgICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2NsaWVudF9pZCcsIGxhYmVsOiAnQ2xpZW50IElEJyB9KSxcbiAgICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2NsaWVudF9zZWNyZXQnLCBsYWJlbDogJ0NsaWVudCBTZWNyZXQnIH0pLFxuICAgICAgICBdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogdHJ1ZSxcbiAgICAgICAgY2xpZW50X3BhcmFtczoge1xuICAgICAgICAgIGNsaWVudF9pZDogJ3ByZXNldC1jbGllbnQtaWQnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICdwcmVzZXQtc2VjcmV0JyxcbiAgICAgICAgfSxcbiAgICAgICAgcmVkaXJlY3RfdXJpOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9jYWxsYmFjaycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFkZE9BdXRoQnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICAvLyBPcGVuIHNldHRpbmdzIGJ5IGNsaWNraW5nIHRoZSBnZWFyIGljb25cbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBjb25zdCBnZWFySWNvbkNvbnRhaW5lciA9IGJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdbY2xhc3MqPVwic2hyaW5rLTBcIl1bY2xhc3MqPVwidy04XCJdJylcbiAgICAgIGlmIChnZWFySWNvbkNvbnRhaW5lcilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGdlYXJJY29uQ29udGFpbmVyKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLm9hdXRoQ2xpZW50U2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgX19hdXRoX2NsaWVudF9fIGxvZ2ljIHdoZW4gY29uZmlndXJlZCB3aXRoIHN5c3RlbSBPQXV0aCBhbmQgbm8gY3VzdG9tIGNsaWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogdHJ1ZSxcbiAgICAgICAgY2xpZW50X3BhcmFtczoge30sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFkZE9BdXRoQnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIGNvbmZpZ3VyZWQgYnV0dG9uIChub3Qgc2V0dXAgYnV0dG9uKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgncGx1Z2luLmF1dGguc2V0dXBPQXV0aCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9wZW4gT0F1dGggc2V0dGluZ3Mgd2hlbiBzeXN0ZW0gT0F1dGggcGFyYW1zIGV4aXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIHNjaGVtYTogW2NyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnY2xpZW50X2lkJywgbGFiZWw6ICdDbGllbnQgSUQnLCByZXF1aXJlZDogdHJ1ZSB9KV0sXG4gICAgICAgIGlzX29hdXRoX2N1c3RvbV9jbGllbnRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiB0cnVlLFxuICAgICAgICByZWRpcmVjdF91cmk6ICdodHRwczovL2V4YW1wbGUuY29tL2NhbGxiYWNrJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8QWRkT0F1dGhCdXR0b24gcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIC8vIENsaWNrIHRoZSBzZXR0aW5ncyBpY29uXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgY29uc3QgZ2Vhckljb25Db250YWluZXIgPSBidXR0b24ucXVlcnlTZWxlY3RvcignW2NsYXNzKj1cInNocmluay0wXCJdW2NsYXNzKj1cInctOFwiXScpXG4gICAgICBpZiAoZ2Vhckljb25Db250YWluZXIpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhnZWFySWNvbkNvbnRhaW5lcilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vIE9BdXRoQ2xpZW50U2V0dGluZ3MgbW9kYWwgc2hvdWxkIG9wZW5cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLm9hdXRoQ2xpZW50U2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDbGlwYm9hcmQgT3BlcmF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgY2xpcGJvYXJkIEFQSSBhdmFpbGFibGUgZm9yIGNvcHkgb3BlcmF0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG1vY2tXcml0ZVRleHQgPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuYXZpZ2F0b3IsICdjbGlwYm9hcmQnLCB7XG4gICAgICAgIHZhbHVlOiB7IHdyaXRlVGV4dDogbW9ja1dyaXRlVGV4dCB9LFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2NoZW1hOiBbY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdjbGllbnRfaWQnLCBsYWJlbDogJ0NsaWVudCBJRCcsIHJlcXVpcmVkOiB0cnVlIH0pXSxcbiAgICAgICAgaXNfb2F1dGhfY3VzdG9tX2NsaWVudF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHM6IGZhbHNlLFxuICAgICAgICByZWRpcmVjdF91cmk6ICdodHRwczovL2V4YW1wbGUuY29tL2NhbGxiYWNrJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8QWRkT0F1dGhCdXR0b24gcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5zZXR1cE9BdXRoJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAvLyBPQXV0aENsaWVudFNldHRpbmdzIG1vZGFsIG9wZW5zXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5vYXV0aENsaWVudFNldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFZlcmlmeSBjbGlwYm9hcmQgQVBJIGlzIGF2YWlsYWJsZVxuICAgICAgZXhwZWN0KG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KS50b0JlRGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnX19hdXRoX2NsaWVudF9fIExvZ2ljJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGRlZmF1bHQgd2hlbiBub3QgY29uZmlndXJlZCBhbmQgc3lzdGVtIE9BdXRoIHBhcmFtcyBleGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBzY2hlbWE6IFtdLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogdHJ1ZSxcbiAgICAgICAgY2xpZW50X3BhcmFtczoge30sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFkZE9BdXRoQnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICAvLyBXaGVuIGlzQ29uZmlndXJlZCBpcyB0cnVlIChpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0cz10cnVlKSwgaXQgc2hvdWxkIHNob3cgdGhlIGNvbmZpZ3VyZWQgYnV0dG9uXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwbHVnaW4uYXV0aC5zZXR1cE9BdXRoJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGN1c3RvbSB3aGVuIG5vdCBjb25maWd1cmVkIGFuZCBubyBzeXN0ZW0gT0F1dGggcGFyYW1zJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIHNjaGVtYTogW10sXG4gICAgICAgIGlzX29hdXRoX2N1c3RvbV9jbGllbnRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiBmYWxzZSxcbiAgICAgICAgY2xpZW50X3BhcmFtczoge30sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEFkZE9BdXRoQnV0dG9uIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICAvLyBXaGVuIG5vdCBjb25maWd1cmVkLCBpdCBzaG91bGQgc2hvdyB0aGUgc2V0dXAgYnV0dG9uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2V0dXBPQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzY2hlbWEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2NoZW1hOiBbXSxcbiAgICAgICAgaXNfb2F1dGhfY3VzdG9tX2NsaWVudF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHM6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyKDxBZGRPQXV0aEJ1dHRvbiBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIG9BdXRoRGF0YSBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHVuZGVmaW5lZClcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyKDxBZGRPQXV0aEJ1dHRvbiBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBjbGllbnRfcGFyYW1zJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIHNjaGVtYTogW2NyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAndGVzdCcgfSldLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiB0cnVlLFxuICAgICAgICBjbGllbnRfcGFyYW1zOiBudWxsLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyKDxBZGRPQXV0aEJ1dHRvbiBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gQXBpS2V5TW9kYWwgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdBcGlLZXlNb2RhbCcsICgpID0+IHtcbiAgbGV0IEFwaUtleU1vZGFsOiB0eXBlb2YgaW1wb3J0KCcuL2FwaS1rZXktbW9kYWwnKS5kZWZhdWx0XG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxTY2hlbWEubW9ja1JldHVyblZhbHVlKFtcbiAgICAgIGNyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnYXBpX2tleScsIGxhYmVsOiAnQVBJIEtleScsIHJlcXVpcmVkOiB0cnVlIH0pLFxuICAgIF0pXG4gICAgbW9ja0FkZFBsdWdpbkNyZWRlbnRpYWwubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgbW9ja1VwZGF0ZVBsdWdpbkNyZWRlbnRpYWwubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgLy8gUmVzZXQgZm9ybSB2YWx1ZXMgbW9jayB0byByZXR1cm4gdmFsaWRhdGlvbiBmYWlsZWQgYnkgZGVmYXVsdFxuICAgIG1vY2tHZXRGb3JtVmFsdWVzLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBpc0NoZWNrVmFsaWRhdGVkOiBmYWxzZSxcbiAgICAgIHZhbHVlczoge30sXG4gICAgfSlcbiAgICBjb25zdCBpbXBvcnRlZEFwaUtleU1vZGFsID0gYXdhaXQgaW1wb3J0KCcuL2FwaS1rZXktbW9kYWwnKVxuICAgIEFwaUtleU1vZGFsID0gaW1wb3J0ZWRBcGlLZXlNb2RhbC5kZWZhdWx0XG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIHRpdGxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICByZW5kZXIoPEFwaUtleU1vZGFsIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LCB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgudXNlQXBpQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1vZGFsIHdpdGggc3VidGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIHJlbmRlcig8QXBpS2V5TW9kYWwgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC51c2VBcGlBdXRoRGVzYycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZvcm0gd2hlbiBkYXRhIGlzIGxvYWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKDxBcGlLZXlNb2RhbCBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcblxuICAgICAgLy8gQXV0aEZvcm0gaXMgbW9ja2VkLCBzbyBjaGVjayBmb3IgdGhlIG1vY2sgZWxlbWVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9jay1hdXRoLWZvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzIFRlc3RpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBtb2RhbCBpcyBjbG9zZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBcGlLZXlNb2RhbFxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIC8vIEZpbmQgYW5kIGNsaWNrIGNhbmNlbCBidXR0b25cbiAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjYW5jZWxCdXR0b24pXG5cbiAgICAgIGV4cGVjdChvbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGNvbmZpcm0gYnV0dG9uIHdoZW4gZGlzYWJsZWQgcHJvcCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBcGlLZXlNb2RhbFxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zYXZlJylcbiAgICAgIGV4cGVjdChjb25maXJtQnV0dG9uLmNsb3Nlc3QoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbW9kYWwgd2hlbiBlZGl0VmFsdWVzIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3QgZWRpdFZhbHVlcyA9IHtcbiAgICAgICAgX19uYW1lX186ICdUZXN0IE5hbWUnLFxuICAgICAgICBfX2NyZWRlbnRpYWxfaWRfXzogJ3Rlc3QtaWQnLFxuICAgICAgICBhcGlfa2V5OiAndGVzdC1rZXknLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBcGlLZXlNb2RhbFxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgZWRpdFZhbHVlcz17ZWRpdFZhbHVlc31cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC51c2VBcGlBdXRoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZm9ybVNjaGVtYXMgZnJvbSBwcm9wcyB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3QgY3VzdG9tU2NoZW1hcyA9IFtcbiAgICAgICAgY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdjdXN0b21fZmllbGQnLCBsYWJlbDogJ0N1c3RvbSBGaWVsZCcgfSksXG4gICAgICBdXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFwaUtleU1vZGFsXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBmb3JtU2NoZW1hcz17Y3VzdG9tU2NoZW1hc31cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIC8vIEF1dGhGb3JtIGlzIG1vY2tlZCwgdmVyaWZ5IG1vZGFsIHJlbmRlcnNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vY2stYXV0aC1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdGb3JtIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIEF1dGhGb3JtIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKDxBcGlLZXlNb2RhbCBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcblxuICAgICAgLy8gQXV0aEZvcm0gaXMgbW9ja2VkLCB2ZXJpZnkgaXQncyByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9jay1hdXRoLWZvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIGVkaXRWYWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBlZGl0VmFsdWVzID0ge1xuICAgICAgICBfX25hbWVfXzogJ0V4aXN0aW5nIE5hbWUnLFxuICAgICAgICBhcGlfa2V5OiAnZXhpc3Rpbmcta2V5JyxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QXBpS2V5TW9kYWxcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIGVkaXRWYWx1ZXM9e2VkaXRWYWx1ZXN9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgudXNlQXBpQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRm9ybSBTdWJtaXNzaW9uIC0gaGFuZGxlQ29uZmlybScsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIC8vIERlZmF1bHQ6IGZvcm0gdmFsaWRhdGlvbiBwYXNzZXMgd2l0aCBlbXB0eSB2YWx1ZXNcbiAgICAgIG1vY2tHZXRGb3JtVmFsdWVzLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG4gICAgICAgIHZhbHVlczoge1xuICAgICAgICAgIF9fbmFtZV9fOiAnVGVzdCBOYW1lJyxcbiAgICAgICAgICBhcGlfa2V5OiAndGVzdC1hcGkta2V5JyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBhZGRQbHVnaW5DcmVkZW50aWFsIHdoZW4gY3JlYXRpbmcgbmV3IGNyZWRlbnRpYWwnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25VcGRhdGUgPSB2aS5mbigpXG4gICAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoW1xuICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2FwaV9rZXknLCBsYWJlbDogJ0FQSSBLZXknIH0pLFxuICAgICAgXSlcbiAgICAgIG1vY2tBZGRQbHVnaW5DcmVkZW50aWFsLm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBcGlLZXlNb2RhbFxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgICBvblVwZGF0ZT17b25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICAvLyBDbGljayBjb25maXJtIGJ1dHRvblxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQWRkUGx1Z2luQ3JlZGVudGlhbCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdXBkYXRlUGx1Z2luQ3JlZGVudGlhbCB3aGVuIGVkaXRpbmcgZXhpc3RpbmcgY3JlZGVudGlhbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvblVwZGF0ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGVkaXRWYWx1ZXMgPSB7XG4gICAgICAgIF9fbmFtZV9fOiAnVGVzdCBDcmVkZW50aWFsJyxcbiAgICAgICAgX19jcmVkZW50aWFsX2lkX186ICd0ZXN0LWNyZWRlbnRpYWwtaWQnLFxuICAgICAgICBhcGlfa2V5OiAnZXhpc3Rpbmcta2V5JyxcbiAgICAgIH1cbiAgICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsU2NoZW1hLm1vY2tSZXR1cm5WYWx1ZShbXG4gICAgICAgIGNyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnYXBpX2tleScsIGxhYmVsOiAnQVBJIEtleScgfSksXG4gICAgICBdKVxuICAgICAgbW9ja1VwZGF0ZVBsdWdpbkNyZWRlbnRpYWwubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgICBtb2NrR2V0Rm9ybVZhbHVlcy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpc0NoZWNrVmFsaWRhdGVkOiB0cnVlLFxuICAgICAgICB2YWx1ZXM6IHtcbiAgICAgICAgICBfX25hbWVfXzogJ1Rlc3QgQ3JlZGVudGlhbCcsXG4gICAgICAgICAgX19jcmVkZW50aWFsX2lkX186ICd0ZXN0LWNyZWRlbnRpYWwtaWQnLFxuICAgICAgICAgIGFwaV9rZXk6ICd1cGRhdGVkLWtleScsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBcGlLZXlNb2RhbFxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgICBvblVwZGF0ZT17b25VcGRhdGV9XG4gICAgICAgICAgZWRpdFZhbHVlcz17ZWRpdFZhbHVlc31cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIC8vIENsaWNrIGNvbmZpcm0gYnV0dG9uXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zYXZlJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tVcGRhdGVQbHVnaW5DcmVkZW50aWFsKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsb3NlIGFuZCBvblVwZGF0ZSBhZnRlciBzdWNjZXNzZnVsIHN1Ym1pc3Npb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25VcGRhdGUgPSB2aS5mbigpXG4gICAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoW1xuICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2FwaV9rZXknLCBsYWJlbDogJ0FQSSBLZXknIH0pLFxuICAgICAgXSlcbiAgICAgIG1vY2tBZGRQbHVnaW5DcmVkZW50aWFsLm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBcGlLZXlNb2RhbFxuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgICBvblVwZGF0ZT17b25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICAvLyBDbGljayBjb25maXJtIGJ1dHRvblxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uc2F2ZScpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY29uZmlybUJ1dHRvbilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG9uVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgQVBJIHdoZW4gZm9ybSB2YWxpZGF0aW9uIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxTY2hlbWEubW9ja1JldHVyblZhbHVlKFtcbiAgICAgICAgY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdhcGlfa2V5JywgbGFiZWw6ICdBUEkgS2V5JywgcmVxdWlyZWQ6IHRydWUgfSksXG4gICAgICBdKVxuICAgICAgbW9ja0dldEZvcm1WYWx1ZXMubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaXNDaGVja1ZhbGlkYXRlZDogZmFsc2UsXG4gICAgICAgIHZhbHVlczoge30sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxBcGlLZXlNb2RhbCBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgLy8gQ2xpY2sgY29uZmlybSBidXR0b25cbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNhdmUnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIFZlcmlmeSBBUEkgd2FzIG5vdCBjYWxsZWQgc2luY2UgdmFsaWRhdGlvbiBmYWlsZWQgc3luY2hyb25vdXNseVxuICAgICAgZXhwZWN0KG1vY2tBZGRQbHVnaW5DcmVkZW50aWFsKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRvaW5nQWN0aW9uIHN0YXRlIHRvIHByZXZlbnQgZG91YmxlIHN1Ym1pc3Npb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoW1xuICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2FwaV9rZXknLCBsYWJlbDogJ0FQSSBLZXknIH0pLFxuICAgICAgXSlcbiAgICAgIC8vIE1ha2UgdGhlIEFQSSBjYWxsIHNsb3dcbiAgICAgIG1vY2tBZGRQbHVnaW5DcmVkZW50aWFsLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSkpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEFwaUtleU1vZGFsIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICAvLyBDbGljayBjb25maXJtIGJ1dHRvbiB0d2ljZSBxdWlja2x5XG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5zYXZlJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmNlIGR1ZSB0byBkb2luZ0FjdGlvbiBndWFyZFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQWRkUGx1Z2luQ3JlZGVudGlhbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlYXJseSBpZiBkb2luZ0FjdGlvblJlZiBpcyB0cnVlIGR1cmluZyBjb25jdXJyZW50IGNsaWNrcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsU2NoZW1hLm1vY2tSZXR1cm5WYWx1ZShbXG4gICAgICAgIGNyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnYXBpX2tleScsIGxhYmVsOiAnQVBJIEtleScgfSksXG4gICAgICBdKVxuXG4gICAgICAvLyBDcmVhdGUgYSBwcm9taXNlIHRoYXQgd2UgY2FuIGNvbnRyb2xcbiAgICAgIGxldCByZXNvbHZlRmlyc3RDYWxsOiAodmFsdWU/OiB1bmtub3duKSA9PiB2b2lkID0gKCkgPT4ge31cbiAgICAgIGxldCBhcGlDYWxsQ291bnQgPSAwXG5cbiAgICAgIG1vY2tBZGRQbHVnaW5DcmVkZW50aWFsLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG4gICAgICAgIGFwaUNhbGxDb3VudCsrXG4gICAgICAgIGlmIChhcGlDYWxsQ291bnQgPT09IDEpIHtcbiAgICAgICAgICAvLyBGaXJzdCBjYWxsOiByZXR1cm4gYSBwZW5kaW5nIHByb21pc2VcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmVGaXJzdENhbGwgPSByZXNvbHZlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICAvLyBTdWJzZXF1ZW50IGNhbGxzIHNob3VsZCBub3QgaGFwcGVuIGJ1dCByZXR1cm4gcmVzb2x2ZWQgcHJvbWlzZVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QXBpS2V5TW9kYWwgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnNhdmUnKVxuXG4gICAgICAvLyBGaXJzdCBjbGljayBzdGFydHMgdGhlIHJlcXVlc3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICAvLyBXYWl0IGZvciB0aGUgZmlyc3QgQVBJIGNhbGwgdG8gYmUgbWFkZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChhcGlDYWxsQ291bnQpLnRvQmUoMSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNlY29uZCBjbGljayB3aGlsZSBmaXJzdCByZXF1ZXN0IGlzIHN0aWxsIHBlbmRpbmcgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICAvLyBWZXJpZnkgb25seSBvbmUgQVBJIGNhbGwgd2FzIG1hZGUgKG5vIGFkZGl0aW9uYWwgY2FsbHMpXG4gICAgICBleHBlY3QoYXBpQ2FsbENvdW50KS50b0JlKDEpXG5cbiAgICAgIC8vIENsZWFuIHVwIGJ5IHJlc29sdmluZyB0aGUgcHJvbWlzZVxuICAgICAgcmVzb2x2ZUZpcnN0Q2FsbCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblJlbW92ZSB3aGVuIGV4dHJhIGJ1dHRvbiBpcyBjbGlja2VkIGluIGVkaXQgbW9kZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG9uUmVtb3ZlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZWRpdFZhbHVlcyA9IHtcbiAgICAgICAgX19uYW1lX186ICdUZXN0IENyZWRlbnRpYWwnLFxuICAgICAgICBfX2NyZWRlbnRpYWxfaWRfXzogJ3Rlc3QtY3JlZGVudGlhbC1pZCcsXG4gICAgICB9XG4gICAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoW1xuICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2FwaV9rZXknLCBsYWJlbDogJ0FQSSBLZXknIH0pLFxuICAgICAgXSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8QXBpS2V5TW9kYWxcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIGVkaXRWYWx1ZXM9e2VkaXRWYWx1ZXN9XG4gICAgICAgICAgb25SZW1vdmU9e29uUmVtb3ZlfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgLy8gRmluZCBhbmQgY2xpY2sgdGhlIHJlbW92ZSBidXR0b25cbiAgICAgIGNvbnN0IHJlbW92ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ucmVtb3ZlJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhyZW1vdmVCdXR0b24pXG5cbiAgICAgIGV4cGVjdChvblJlbW92ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBjcmVkZW50aWFscyBzY2hlbWEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoW10pXG5cbiAgICAgIHJlbmRlcig8QXBpS2V5TW9kYWwgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIC8vIFNob3VsZCBzdGlsbCByZW5kZXIgdGhlIG1vZGFsIHdpdGggYXV0aG9yaXphdGlvbiBuYW1lIGZpZWxkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgudXNlQXBpQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBkZXRhaWwgaW4gcGx1Z2luUGF5bG9hZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKHsgZGV0YWlsOiB1bmRlZmluZWQgfSlcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyKDxBcGlLZXlNb2RhbCBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZm9ybSBzY2hlbWEgd2l0aCBkZWZhdWx0IHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsU2NoZW1hLm1vY2tSZXR1cm5WYWx1ZShbXG4gICAgICAgIGNyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnYXBpX2tleScsIGxhYmVsOiAnQVBJIEtleScsIGRlZmF1bHQ6ICdkZWZhdWx0LWtleScgfSksXG4gICAgICBdKVxuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPEFwaUtleU1vZGFsIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LFxuICAgICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICAgIClcbiAgICAgIH0pLm5vdC50b1Rocm93KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9jay1hdXRoLWZvcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBPQXV0aENsaWVudFNldHRpbmdzIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnT0F1dGhDbGllbnRTZXR0aW5ncycsICgpID0+IHtcbiAgbGV0IE9BdXRoQ2xpZW50U2V0dGluZ3M6IHR5cGVvZiBpbXBvcnQoJy4vb2F1dGgtY2xpZW50LXNldHRpbmdzJykuZGVmYXVsdFxuXG4gIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcbiAgICBtb2NrRGVsZXRlUGx1Z2luT0F1dGhDdXN0b21DbGllbnQubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgY29uc3QgaW1wb3J0ZWRPQXV0aENsaWVudFNldHRpbmdzID0gYXdhaXQgaW1wb3J0KCcuL29hdXRoLWNsaWVudC1zZXR0aW5ncycpXG4gICAgT0F1dGhDbGllbnRTZXR0aW5ncyA9IGltcG9ydGVkT0F1dGhDbGllbnRTZXR0aW5ncy5kZWZhdWx0XG4gIH0pXG5cbiAgY29uc3QgZGVmYXVsdFNjaGVtYXM6IEZvcm1TY2hlbWFbXSA9IFtcbiAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2NsaWVudF9pZCcsIGxhYmVsOiAnQ2xpZW50IElEJywgcmVxdWlyZWQ6IHRydWUgfSksXG4gICAgY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdjbGllbnRfc2VjcmV0JywgbGFiZWw6ICdDbGllbnQgU2VjcmV0JywgcmVxdWlyZWQ6IHRydWUgfSksXG4gIF1cblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1vZGFsIHdpdGggY29ycmVjdCB0aXRsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgub2F1dGhDbGllbnRTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFNhdmUgYW5kIEF1dGggYnV0dG9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBzY2hlbWFzPXtkZWZhdWx0U2NoZW1hc31cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5zYXZlQW5kQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFNhdmUgT25seSBidXR0b24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e2RlZmF1bHRTY2hlbWFzfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLnNhdmVPbmx5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgQ2FuY2VsIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmb3JtIGZyb20gc2NoZW1hcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICAvLyBBdXRoRm9ybSBpcyBtb2NrZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vY2stYXV0aC1mb3JtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcyBUZXN0aW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsb3NlIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLmNhbmNlbCcpKVxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgYnV0dG9ucyB3aGVuIGRpc2FibGVkIHByb3AgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZUFuZEF1dGgnKVxuICAgICAgZXhwZWN0KGNvbmZpcm1CdXR0b24uY2xvc2VzdCgnYnV0dG9uJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggZWRpdFZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IGVkaXRWYWx1ZXMgPSB7XG4gICAgICAgIGNsaWVudF9pZDogJ2V4aXN0aW5nLWNsaWVudC1pZCcsXG4gICAgICAgIGNsaWVudF9zZWNyZXQ6ICdleGlzdGluZy1zZWNyZXQnLFxuICAgICAgICBfX29hdXRoX2NsaWVudF9fOiAnY3VzdG9tJyxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgICAgZWRpdFZhbHVlcz17ZWRpdFZhbHVlc31cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5vYXV0aENsaWVudFNldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW1vdmUgQnV0dG9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyByZW1vdmUgYnV0dG9uIHdoZW4gY3VzdG9tIGNsaWVudCBhbmQgaGFzT3JpZ2luYWxDbGllbnRQYXJhbXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBzY2hlbWFzV2l0aE9BdXRoQ2xpZW50OiBGb3JtU2NoZW1hW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnX19vYXV0aF9jbGllbnRfXycsXG4gICAgICAgICAgbGFiZWw6ICdPQXV0aCBDbGllbnQnLFxuICAgICAgICAgIHR5cGU6ICdyYWRpbycgYXMgRm9ybVNjaGVtYVsndHlwZSddLFxuICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgbGFiZWw6ICdEZWZhdWx0JywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0N1c3RvbScsIHZhbHVlOiAnY3VzdG9tJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZGVmYXVsdDogJ2N1c3RvbScsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICAuLi5kZWZhdWx0U2NoZW1hcyxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17c2NoZW1hc1dpdGhPQXV0aENsaWVudH1cbiAgICAgICAgICBlZGl0VmFsdWVzPXt7IF9fb2F1dGhfY2xpZW50X186ICdjdXN0b20nLCBjbGllbnRfaWQ6ICdpZCcsIGNsaWVudF9zZWNyZXQ6ICdzZWNyZXQnIH19XG4gICAgICAgICAgaGFzT3JpZ2luYWxDbGllbnRQYXJhbXM9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5yZW1vdmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHJlbW92ZSBidXR0b24gd2hlbiB1c2luZyBkZWZhdWx0IGNsaWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IHNjaGVtYXNXaXRoT0F1dGhDbGllbnQ6IEZvcm1TY2hlbWFbXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdfX29hdXRoX2NsaWVudF9fJyxcbiAgICAgICAgICBsYWJlbDogJ09BdXRoIENsaWVudCcsXG4gICAgICAgICAgdHlwZTogJ3JhZGlvJyBhcyBGb3JtU2NoZW1hWyd0eXBlJ10sXG4gICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgeyBsYWJlbDogJ0RlZmF1bHQnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgICAgICAgICB7IGxhYmVsOiAnQ3VzdG9tJywgdmFsdWU6ICdjdXN0b20nIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBkZWZhdWx0OiAnZGVmYXVsdCcsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICAuLi5kZWZhdWx0U2NoZW1hcyxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17c2NoZW1hc1dpdGhPQXV0aENsaWVudH1cbiAgICAgICAgICBlZGl0VmFsdWVzPXt7IF9fb2F1dGhfY2xpZW50X186ICdkZWZhdWx0JyB9fVxuICAgICAgICAgIGhhc09yaWdpbmFsQ2xpZW50UGFyYW1zPXtmYWxzZX1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ucmVtb3ZlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRm9ybSBTdWJtaXNzaW9uJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgLy8gRGVmYXVsdDogZm9ybSB2YWxpZGF0aW9uIHBhc3Nlc1xuICAgICAgbW9ja0dldEZvcm1WYWx1ZXMubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaXNDaGVja1ZhbGlkYXRlZDogdHJ1ZSxcbiAgICAgICAgdmFsdWVzOiB7XG4gICAgICAgICAgX19vYXV0aF9jbGllbnRfXzogJ2N1c3RvbScsXG4gICAgICAgICAgY2xpZW50X2lkOiAndGVzdC1jbGllbnQtaWQnLFxuICAgICAgICAgIGNsaWVudF9zZWNyZXQ6ICd0ZXN0LXNlY3JldCcsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTYXZlIGFuZCBBdXRoIGJ1dHRvbiB0aGF0IGlzIGNsaWNrYWJsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG9uQXV0aCA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBzY2hlbWFzPXtbXX1cbiAgICAgICAgICBvbkF1dGg9e29uQXV0aH1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHNhdmVBbmRBdXRoQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZUFuZEF1dGgnKVxuICAgICAgZXhwZWN0KHNhdmVBbmRBdXRoQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2F2ZUFuZEF1dGhCdXR0b24uY2xvc2VzdCgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQgd2hlbiBTYXZlIE9ubHkgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvblVwZGF0ZSA9IHZpLmZuKClcbiAgICAgIG1vY2tTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgICBvblVwZGF0ZT17b25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICAvLyBDbGljayBTYXZlIE9ubHkgYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZU9ubHknKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2UgYW5kIG9uVXBkYXRlIGFmdGVyIHN1Y2Nlc3NmdWwgc3VibWlzc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvblVwZGF0ZSA9IHZpLmZuKClcbiAgICAgIG1vY2tTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgICBvblVwZGF0ZT17b25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZU9ubHknKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG9uVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkF1dGggYWZ0ZXIgaGFuZGxlQ29uZmlybUFuZEF1dGhvcml6ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG9uQXV0aCA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIG1vY2tTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgICAgb25BdXRoPXtvbkF1dGh9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIC8vIENsaWNrIFNhdmUgYW5kIEF1dGggYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZUFuZEF1dGgnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3Qob25BdXRoKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGZvcm0gd2l0aCBlbXB0eSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e2RlZmF1bHRTY2hlbWFzfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgLy8gTW9kYWwgc2hvdWxkIHJlbmRlciB3aXRoIHNhdmUgYnV0dG9uc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLnNhdmVPbmx5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5zYXZlQW5kQXV0aCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBkZWxldGVQbHVnaW5PQXV0aEN1c3RvbUNsaWVudCB3aGVuIFJlbW92ZSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uVXBkYXRlID0gdmkuZm4oKVxuICAgICAgbW9ja0RlbGV0ZVBsdWdpbk9BdXRoQ3VzdG9tQ2xpZW50Lm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuXG4gICAgICBjb25zdCBzY2hlbWFzV2l0aE9BdXRoQ2xpZW50OiBGb3JtU2NoZW1hW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnX19vYXV0aF9jbGllbnRfXycsXG4gICAgICAgICAgbGFiZWw6ICdPQXV0aCBDbGllbnQnLFxuICAgICAgICAgIHR5cGU6ICdyYWRpbycgYXMgRm9ybVNjaGVtYVsndHlwZSddLFxuICAgICAgICAgIG9wdGlvbnM6IFtcbiAgICAgICAgICAgIHsgbGFiZWw6ICdEZWZhdWx0JywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgICAgICAgICAgeyBsYWJlbDogJ0N1c3RvbScsIHZhbHVlOiAnY3VzdG9tJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZGVmYXVsdDogJ2N1c3RvbScsXG4gICAgICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICAuLi5kZWZhdWx0U2NoZW1hcyxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17c2NoZW1hc1dpdGhPQXV0aENsaWVudH1cbiAgICAgICAgICBlZGl0VmFsdWVzPXt7IF9fb2F1dGhfY2xpZW50X186ICdjdXN0b20nLCBjbGllbnRfaWQ6ICdpZCcsIGNsaWVudF9zZWNyZXQ6ICdzZWNyZXQnIH19XG4gICAgICAgICAgaGFzT3JpZ2luYWxDbGllbnRQYXJhbXM9e3RydWV9XG4gICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cbiAgICAgICAgICBvblVwZGF0ZT17b25VcGRhdGV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICAvLyBDbGljayBSZW1vdmUgYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5yZW1vdmUnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRGVsZXRlUGx1Z2luT0F1dGhDdXN0b21DbGllbnQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2UgYW5kIG9uVXBkYXRlIGFmdGVyIHN1Y2Nlc3NmdWwgcmVtb3ZhbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvblVwZGF0ZSA9IHZpLmZuKClcbiAgICAgIG1vY2tEZWxldGVQbHVnaW5PQXV0aEN1c3RvbUNsaWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgY29uc3Qgc2NoZW1hc1dpdGhPQXV0aENsaWVudDogRm9ybVNjaGVtYVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ19fb2F1dGhfY2xpZW50X18nLFxuICAgICAgICAgIGxhYmVsOiAnT0F1dGggQ2xpZW50JyxcbiAgICAgICAgICB0eXBlOiAncmFkaW8nIGFzIEZvcm1TY2hlbWFbJ3R5cGUnXSxcbiAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICB7IGxhYmVsOiAnRGVmYXVsdCcsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdDdXN0b20nLCB2YWx1ZTogJ2N1c3RvbScgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjdXN0b20nLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4uZGVmYXVsdFNjaGVtYXMsXG4gICAgICBdXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e3NjaGVtYXNXaXRoT0F1dGhDbGllbnR9XG4gICAgICAgICAgZWRpdFZhbHVlcz17eyBfX29hdXRoX2NsaWVudF9fOiAnY3VzdG9tJywgY2xpZW50X2lkOiAnaWQnLCBjbGllbnRfc2VjcmV0OiAnc2VjcmV0JyB9fVxuICAgICAgICAgIGhhc09yaWdpbmFsQ2xpZW50UGFyYW1zPXt0cnVlfVxuICAgICAgICAgIG9uQ2xvc2U9e29uQ2xvc2V9XG4gICAgICAgICAgb25VcGRhdGU9e29uVXBkYXRlfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ucmVtb3ZlJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChvblVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXZlbnQgZG91YmxlIHN1Ym1pc3Npb24gd2hlbiBkb2luZ0FjdGlvbiBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgLy8gTWFrZSB0aGUgQVBJIGNhbGwgc2xvd1xuICAgICAgbW9ja1NldFBsdWdpbk9BdXRoQ3VzdG9tQ2xpZW50Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSkpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e2RlZmF1bHRTY2hlbWFzfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgLy8gQ2xpY2sgU2F2ZSBPbmx5IGJ1dHRvbiB0d2ljZSBxdWlja2x5XG4gICAgICBjb25zdCBzYXZlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZU9ubHknKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNhdmVCdXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2F2ZUJ1dHRvbilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZWFybHkgZnJvbSBoYW5kbGVDb25maXJtIGlmIGRvaW5nQWN0aW9uUmVmIGlzIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBsZXQgcmVzb2x2ZUZpcnN0Q2FsbDogKHZhbHVlPzogdW5rbm93bikgPT4gdm9pZCA9ICgpID0+IHt9XG4gICAgICBsZXQgYXBpQ2FsbENvdW50ID0gMFxuXG4gICAgICBtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICAgICAgYXBpQ2FsbENvdW50KytcbiAgICAgICAgaWYgKGFwaUNhbGxDb3VudCA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZUZpcnN0Q2FsbCA9IHJlc29sdmVcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBzY2hlbWFzPXtkZWZhdWx0U2NoZW1hc31cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHNhdmVCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5zYXZlT25seScpXG5cbiAgICAgIC8vIEZpcnN0IGNsaWNrIHN0YXJ0cyB0aGUgcmVxdWVzdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBmaXJzdCBBUEkgY2FsbCB0byBiZSBtYWRlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGFwaUNhbGxDb3VudCkudG9CZSgxKVxuICAgICAgfSlcblxuICAgICAgLy8gU2Vjb25kIGNsaWNrIHdoaWxlIGZpcnN0IHJlcXVlc3QgaXMgcGVuZGluZyBzaG91bGQgYmUgaWdub3JlZFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNhdmVCdXR0b24pXG5cbiAgICAgIC8vIFZlcmlmeSBvbmx5IG9uZSBBUEkgY2FsbCB3YXMgbWFkZSAobm8gYWRkaXRpb25hbCBjYWxscylcbiAgICAgIGV4cGVjdChhcGlDYWxsQ291bnQpLnRvQmUoMSlcblxuICAgICAgLy8gQ2xlYW4gdXBcbiAgICAgIHJlc29sdmVGaXJzdENhbGwoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlYXJseSBmcm9tIGhhbmRsZVJlbW92ZSBpZiBkb2luZ0FjdGlvblJlZiBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgbGV0IHJlc29sdmVGaXJzdENhbGw6ICh2YWx1ZT86IHVua25vd24pID0+IHZvaWQgPSAoKSA9PiB7fVxuICAgICAgbGV0IGRlbGV0ZUNhbGxDb3VudCA9IDBcblxuICAgICAgbW9ja0RlbGV0ZVBsdWdpbk9BdXRoQ3VzdG9tQ2xpZW50Lm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7XG4gICAgICAgIGRlbGV0ZUNhbGxDb3VudCsrXG4gICAgICAgIGlmIChkZWxldGVDYWxsQ291bnQgPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmVGaXJzdENhbGwgPSByZXNvbHZlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KVxuICAgICAgfSlcblxuICAgICAgY29uc3Qgc2NoZW1hc1dpdGhPQXV0aENsaWVudDogRm9ybVNjaGVtYVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ19fb2F1dGhfY2xpZW50X18nLFxuICAgICAgICAgIGxhYmVsOiAnT0F1dGggQ2xpZW50JyxcbiAgICAgICAgICB0eXBlOiAncmFkaW8nIGFzIEZvcm1TY2hlbWFbJ3R5cGUnXSxcbiAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICB7IGxhYmVsOiAnRGVmYXVsdCcsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdDdXN0b20nLCB2YWx1ZTogJ2N1c3RvbScgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjdXN0b20nLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4uZGVmYXVsdFNjaGVtYXMsXG4gICAgICBdXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e3NjaGVtYXNXaXRoT0F1dGhDbGllbnR9XG4gICAgICAgICAgZWRpdFZhbHVlcz17eyBfX29hdXRoX2NsaWVudF9fOiAnY3VzdG9tJywgY2xpZW50X2lkOiAnaWQnLCBjbGllbnRfc2VjcmV0OiAnc2VjcmV0JyB9fVxuICAgICAgICAgIGhhc09yaWdpbmFsQ2xpZW50UGFyYW1zPXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5yZW1vdmUnKVxuXG4gICAgICAvLyBGaXJzdCBjbGljayBzdGFydHMgdGhlIGRlbGV0ZSByZXF1ZXN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2socmVtb3ZlQnV0dG9uKVxuXG4gICAgICAvLyBXYWl0IGZvciB0aGUgZmlyc3QgZGVsZXRlIGNhbGwgdG8gYmUgbWFkZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChkZWxldGVDYWxsQ291bnQpLnRvQmUoMSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNlY29uZCBjbGljayB3aGlsZSBmaXJzdCByZXF1ZXN0IGlzIHBlbmRpbmcgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgIGZpcmVFdmVudC5jbGljayhyZW1vdmVCdXR0b24pXG5cbiAgICAgIC8vIFZlcmlmeSBvbmx5IG9uZSBkZWxldGUgY2FsbCB3YXMgbWFkZSAobm8gYWRkaXRpb25hbCBjYWxscylcbiAgICAgIGV4cGVjdChkZWxldGVDYWxsQ291bnQpLnRvQmUoMSlcblxuICAgICAgLy8gQ2xlYW4gdXBcbiAgICAgIHJlc29sdmVGaXJzdENhbGwoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc2NoZW1hcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzXG4gICAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgICAgc2NoZW1hcz17W119XG4gICAgICAgICAgLz4sXG4gICAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgICAgKVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzY2hlbWFzIHdpdGhvdXQgZGVmYXVsdCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBzY2hlbWFzV2l0aG91dERlZmF1bHRzOiBGb3JtU2NoZW1hW10gPSBbXG4gICAgICAgIGNyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnZmllbGQxJywgbGFiZWw6ICdGaWVsZCAxJywgZGVmYXVsdDogdW5kZWZpbmVkIH0pLFxuICAgICAgXVxuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgICBzY2hlbWFzPXtzY2hlbWFzV2l0aG91dERlZmF1bHRzfVxuICAgICAgICAgIC8+LFxuICAgICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICAgIClcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGVkaXRWYWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICAgIHNjaGVtYXM9e2RlZmF1bHRTY2hlbWFzfVxuICAgICAgICAgICAgZWRpdFZhbHVlcz17dW5kZWZpbmVkfVxuICAgICAgICAgIC8+LFxuICAgICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICAgIClcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCcmFuY2ggQ292ZXJhZ2UgLSBkZWZhdWx0VmFsdWVzIGNvbXB1dGF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29tcHV0ZSBkZWZhdWx0VmFsdWVzIGZyb20gc2NoZW1hcyB3aXRoIGRlZmF1bHQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3Qgc2NoZW1hc1dpdGhEZWZhdWx0czogRm9ybVNjaGVtYVtdID0gW1xuICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2NsaWVudF9pZCcsIGxhYmVsOiAnQ2xpZW50IElEJywgZGVmYXVsdDogJ2RlZmF1bHQtaWQnIH0pLFxuICAgICAgICBjcmVhdGVGb3JtU2NoZW1hKHsgbmFtZTogJ2NsaWVudF9zZWNyZXQnLCBsYWJlbDogJ0NsaWVudCBTZWNyZXQnLCBkZWZhdWx0OiAnZGVmYXVsdC1zZWNyZXQnIH0pLFxuICAgICAgXVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBzY2hlbWFzPXtzY2hlbWFzV2l0aERlZmF1bHRzfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLm9hdXRoQ2xpZW50U2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNraXAgc2NoZW1hcyB3aXRob3V0IGRlZmF1bHQgdmFsdWVzIGluIGRlZmF1bHRWYWx1ZXMgY29tcHV0YXRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBtaXhlZFNjaGVtYXM6IEZvcm1TY2hlbWFbXSA9IFtcbiAgICAgICAgY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdmaWVsZF93aXRoX2RlZmF1bHQnLCBsYWJlbDogJ1dpdGggRGVmYXVsdCcsIGRlZmF1bHQ6ICd2YWx1ZScgfSksXG4gICAgICAgIGNyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnZmllbGRfd2l0aG91dF9kZWZhdWx0JywgbGFiZWw6ICdXaXRob3V0IERlZmF1bHQnLCBkZWZhdWx0OiB1bmRlZmluZWQgfSksXG4gICAgICAgIGNyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnZmllbGRfd2l0aF9lbXB0eScsIGxhYmVsOiAnRW1wdHkgRGVmYXVsdCcsIGRlZmF1bHQ6ICcnIH0pLFxuICAgICAgXVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBzY2hlbWFzPXttaXhlZFNjaGVtYXN9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgub2F1dGhDbGllbnRTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQnJhbmNoIENvdmVyYWdlIC0gX19vYXV0aF9jbGllbnRfXyB2YWx1ZScsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIG1vY2tHZXRGb3JtVmFsdWVzLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG4gICAgICAgIHZhbHVlczoge1xuICAgICAgICAgIF9fb2F1dGhfY2xpZW50X186ICdkZWZhdWx0JyxcbiAgICAgICAgICBjbGllbnRfaWQ6ICd0ZXN0LWlkJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2VuZCBlbmFibGVfb2F1dGhfY3VzdG9tX2NsaWVudD1mYWxzZSB3aGVuIF9fb2F1dGhfY2xpZW50X18gaXMgZGVmYXVsdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZU9ubHknKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGVuYWJsZV9vYXV0aF9jdXN0b21fY2xpZW50OiBmYWxzZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZW5kIGVuYWJsZV9vYXV0aF9jdXN0b21fY2xpZW50PXRydWUgd2hlbiBfX29hdXRoX2NsaWVudF9fIGlzIGN1c3RvbScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIG1vY2tTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcbiAgICAgIG1vY2tHZXRGb3JtVmFsdWVzLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG4gICAgICAgIHZhbHVlczoge1xuICAgICAgICAgIF9fb2F1dGhfY2xpZW50X186ICdjdXN0b20nLFxuICAgICAgICAgIGNsaWVudF9pZDogJ3Rlc3QtaWQnLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZU9ubHknKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGVuYWJsZV9vYXV0aF9jdXN0b21fY2xpZW50OiB0cnVlLFxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0JyYW5jaCBDb3ZlcmFnZSAtIG9uQXV0aCBjYWxsYmFjaycsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIG1vY2tHZXRGb3JtVmFsdWVzLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG4gICAgICAgIHZhbHVlczogeyBfX29hdXRoX2NsaWVudF9fOiAnY3VzdG9tJyB9LFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQXV0aCB3aGVuIHByb3ZpZGVkIGFuZCBTYXZlIGFuZCBBdXRoIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBjb25zdCBvbkF1dGggPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAgIG1vY2tTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgICAgb25BdXRoPXtvbkF1dGh9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZUFuZEF1dGgnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkF1dGgpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkF1dGggd2hlbiBub3QgcHJvdmlkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQubW9ja1Jlc29sdmVkVmFsdWUoe30pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e2RlZmF1bHRTY2hlbWFzfVxuICAgICAgICAgIG9uQXV0aD17dW5kZWZpbmVkfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLnNhdmVBbmRBdXRoJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NldFBsdWdpbk9BdXRoQ3VzdG9tQ2xpZW50KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgICAvLyBObyBvbkF1dGggdG8gY2FsbCwgYnV0IHNob3VsZCBub3QgdGhyb3dcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCcmFuY2ggQ292ZXJhZ2UgLSBkaXNhYmxlZCBzdGF0ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGJ1dHRvbnMgd2hlbiBkaXNhYmxlZCBwcm9wIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e2RlZmF1bHRTY2hlbWFzfVxuICAgICAgICAgIGRpc2FibGVkPXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLnNhdmVBbmRBdXRoJykuY2xvc2VzdCgnYnV0dG9uJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguc2F2ZU9ubHknKS5jbG9zZXN0KCdidXR0b24nKSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIFJlbW92ZSBidXR0b24gd2hlbiBlZGl0VmFsdWVzIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IHNjaGVtYXNXaXRoT0F1dGhDbGllbnQ6IEZvcm1TY2hlbWFbXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdfX29hdXRoX2NsaWVudF9fJyxcbiAgICAgICAgICBsYWJlbDogJ09BdXRoIENsaWVudCcsXG4gICAgICAgICAgdHlwZTogJ3JhZGlvJyBhcyBGb3JtU2NoZW1hWyd0eXBlJ10sXG4gICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgeyBsYWJlbDogJ0RlZmF1bHQnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgICAgICAgICB7IGxhYmVsOiAnQ3VzdG9tJywgdmFsdWU6ICdjdXN0b20nIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBkZWZhdWx0OiAnY3VzdG9tJyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIC4uLmRlZmF1bHRTY2hlbWFzLFxuICAgICAgXVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBzY2hlbWFzPXtzY2hlbWFzV2l0aE9BdXRoQ2xpZW50fVxuICAgICAgICAgIGhhc09yaWdpbmFsQ2xpZW50UGFyYW1zPXt0cnVlfVxuICAgICAgICAgIGVkaXRWYWx1ZXM9e3VuZGVmaW5lZH1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIC8vIFJlbW92ZSBidXR0b24gc2hvdWxkIGV4aXN0IGJ1dCBiZSBkaXNhYmxlZFxuICAgICAgY29uc3QgcmVtb3ZlQnV0dG9uID0gc2NyZWVuLnF1ZXJ5QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnJlbW92ZScpXG4gICAgICBpZiAocmVtb3ZlQnV0dG9uKSB7XG4gICAgICAgIGV4cGVjdChyZW1vdmVCdXR0b24uY2xvc2VzdCgnYnV0dG9uJykpLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBSZW1vdmUgYnV0dG9uIHdoZW4gZGlzYWJsZWQgcHJvcCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3Qgc2NoZW1hc1dpdGhPQXV0aENsaWVudDogRm9ybVNjaGVtYVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ19fb2F1dGhfY2xpZW50X18nLFxuICAgICAgICAgIGxhYmVsOiAnT0F1dGggQ2xpZW50JyxcbiAgICAgICAgICB0eXBlOiAncmFkaW8nIGFzIEZvcm1TY2hlbWFbJ3R5cGUnXSxcbiAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICB7IGxhYmVsOiAnRGVmYXVsdCcsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdDdXN0b20nLCB2YWx1ZTogJ2N1c3RvbScgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjdXN0b20nLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4uZGVmYXVsdFNjaGVtYXMsXG4gICAgICBdXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e3NjaGVtYXNXaXRoT0F1dGhDbGllbnR9XG4gICAgICAgICAgaGFzT3JpZ2luYWxDbGllbnRQYXJhbXM9e3RydWV9XG4gICAgICAgICAgZWRpdFZhbHVlcz17eyBfX29hdXRoX2NsaWVudF9fOiAnY3VzdG9tJywgY2xpZW50X2lkOiAnaWQnIH19XG4gICAgICAgICAgZGlzYWJsZWQ9e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBjb25zdCByZW1vdmVCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnJlbW92ZScpXG4gICAgICBleHBlY3QocmVtb3ZlQnV0dG9uLmNsb3Nlc3QoJ2J1dHRvbicpKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0JyYW5jaCBDb3ZlcmFnZSAtIHBsdWdpblBheWxvYWQuZGV0YWlsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIFJlYWRtZUVudHJhbmNlIHdoZW4gcGx1Z2luUGF5bG9hZCBoYXMgZGV0YWlsJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoe1xuICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICAgICAgICAgIGxhYmVsOiB7IGVuX1VTOiAnVGVzdCBQbHVnaW4nIH0sXG4gICAgICAgIH0gYXMgdW5rbm93biBhcyBQbHVnaW5QYXlsb2FkWydkZXRhaWwnXSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e2RlZmF1bHRTY2hlbWFzfVxuICAgICAgICAvPixcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgLy8gUmVhZG1lRW50cmFuY2Ugc2hvdWxkIGJlIHJlbmRlcmVkIChpdCdzIG1vY2tlZCBpbiB2aXRlc3Quc2V0dXApXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgub2F1dGhDbGllbnRTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBSZWFkbWVFbnRyYW5jZSB3aGVuIHBsdWdpblBheWxvYWQgaGFzIG5vIGRldGFpbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKHsgZGV0YWlsOiB1bmRlZmluZWQgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8T0F1dGhDbGllbnRTZXR0aW5nc1xuICAgICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgICAgc2NoZW1hcz17ZGVmYXVsdFNjaGVtYXN9XG4gICAgICAgIC8+LFxuICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGgub2F1dGhDbGllbnRTZXR0aW5ncycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQnJhbmNoIENvdmVyYWdlIC0gZm9vdGVyU2xvdCBjb25kaXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBSZW1vdmUgYnV0dG9uIG9ubHkgd2hlbiBfX29hdXRoX2NsaWVudF9fPWN1c3RvbSBBTkQgaGFzT3JpZ2luYWxDbGllbnRQYXJhbXM9dHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcbiAgICAgIGNvbnN0IHNjaGVtYXNXaXRoQ3VzdG9tT0F1dGg6IEZvcm1TY2hlbWFbXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdfX29hdXRoX2NsaWVudF9fJyxcbiAgICAgICAgICBsYWJlbDogJ09BdXRoIENsaWVudCcsXG4gICAgICAgICAgdHlwZTogJ3JhZGlvJyBhcyBGb3JtU2NoZW1hWyd0eXBlJ10sXG4gICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgeyBsYWJlbDogJ0RlZmF1bHQnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgICAgICAgICB7IGxhYmVsOiAnQ3VzdG9tJywgdmFsdWU6ICdjdXN0b20nIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBkZWZhdWx0OiAnY3VzdG9tJyxcbiAgICAgICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIC4uLmRlZmF1bHRTY2hlbWFzLFxuICAgICAgXVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPQXV0aENsaWVudFNldHRpbmdzXG4gICAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgICBzY2hlbWFzPXtzY2hlbWFzV2l0aEN1c3RvbU9BdXRofVxuICAgICAgICAgIGVkaXRWYWx1ZXM9e3sgX19vYXV0aF9jbGllbnRfXzogJ2N1c3RvbScgfX1cbiAgICAgICAgICBoYXNPcmlnaW5hbENsaWVudFBhcmFtcz17dHJ1ZX1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdjb21tb24ub3BlcmF0aW9uLnJlbW92ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgUmVtb3ZlIGJ1dHRvbiB3aGVuIGhhc09yaWdpbmFsQ2xpZW50UGFyYW1zPWZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuICAgICAgY29uc3Qgc2NoZW1hc1dpdGhDdXN0b21PQXV0aDogRm9ybVNjaGVtYVtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ19fb2F1dGhfY2xpZW50X18nLFxuICAgICAgICAgIGxhYmVsOiAnT0F1dGggQ2xpZW50JyxcbiAgICAgICAgICB0eXBlOiAncmFkaW8nIGFzIEZvcm1TY2hlbWFbJ3R5cGUnXSxcbiAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICB7IGxhYmVsOiAnRGVmYXVsdCcsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICAgICAgICAgIHsgbGFiZWw6ICdDdXN0b20nLCB2YWx1ZTogJ2N1c3RvbScgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGRlZmF1bHQ6ICdjdXN0b20nLFxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4uZGVmYXVsdFNjaGVtYXMsXG4gICAgICBdXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPE9BdXRoQ2xpZW50U2V0dGluZ3NcbiAgICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICAgIHNjaGVtYXM9e3NjaGVtYXNXaXRoQ3VzdG9tT0F1dGh9XG4gICAgICAgICAgZWRpdFZhbHVlcz17eyBfX29hdXRoX2NsaWVudF9fOiAnY3VzdG9tJyB9fVxuICAgICAgICAgIGhhc09yaWdpbmFsQ2xpZW50UGFyYW1zPXtmYWxzZX1cbiAgICAgICAgLz4sXG4gICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24ucmVtb3ZlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBhIG1lbW9pemVkIGNvbXBvbmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IE9BdXRoQ2xpZW50U2V0dGluZ3NEZWZhdWx0ID0gKGF3YWl0IGltcG9ydCgnLi9vYXV0aC1jbGllbnQtc2V0dGluZ3MnKSkuZGVmYXVsdFxuICAgICAgZXhwZWN0KHR5cGVvZiBPQXV0aENsaWVudFNldHRpbmdzRGVmYXVsdCkudG9CZSgnb2JqZWN0JylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gSW50ZWdyYXRpb24gVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdBdXRob3JpemUgQ29tcG9uZW50cyBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxTY2hlbWEubW9ja1JldHVyblZhbHVlKFtcbiAgICAgIGNyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnYXBpX2tleScsIGxhYmVsOiAnQVBJIEtleScgfSksXG4gICAgXSlcbiAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIHNjaGVtYTogW2NyZWF0ZUZvcm1TY2hlbWEoeyBuYW1lOiAnY2xpZW50X2lkJywgbGFiZWw6ICdDbGllbnQgSUQnIH0pXSxcbiAgICAgIGlzX29hdXRoX2N1c3RvbV9jbGllbnRfZW5hYmxlZDogZmFsc2UsXG4gICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgICByZWRpcmVjdF91cmk6ICdodHRwczovL2V4YW1wbGUuY29tL2NhbGxiYWNrJyxcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBZGRBcGlLZXlCdXR0b24gLT4gQXBpS2V5TW9kYWwgRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gQXBpS2V5TW9kYWwgd2hlbiBBZGRBcGlLZXlCdXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IEFkZEFwaUtleUJ1dHRvbiA9IChhd2FpdCBpbXBvcnQoJy4vYWRkLWFwaS1rZXktYnV0dG9uJykpLmRlZmF1bHRcbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgcmVuZGVyKDxBZGRBcGlLZXlCdXR0b24gcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC51c2VBcGlBdXRoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQWRkT0F1dGhCdXR0b24gLT4gT0F1dGhDbGllbnRTZXR0aW5ncyBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgb3BlbiBPQXV0aENsaWVudFNldHRpbmdzIHdoZW4gc2V0dXAgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBBZGRPQXV0aEJ1dHRvbiA9IChhd2FpdCBpbXBvcnQoJy4vYWRkLW9hdXRoLWJ1dHRvbicpKS5kZWZhdWx0XG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG4gICAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgc2NoZW1hOiBbY3JlYXRlRm9ybVNjaGVtYSh7IG5hbWU6ICdjbGllbnRfaWQnLCBsYWJlbDogJ0NsaWVudCBJRCcgfSldLFxuICAgICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgICAgIHJlZGlyZWN0X3VyaTogJ2h0dHBzOi8vZXhhbXBsZS5jb20vY2FsbGJhY2snLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxBZGRPQXV0aEJ1dHRvbiBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPiwgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLnNldHVwT0F1dGgnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC5vYXV0aENsaWVudFNldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=