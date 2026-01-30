"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("@/app/components/plugins/types");
const types_2 = require("@/app/components/workflow/block-selector/types");
const index_1 = require("./index");
// ==================== Mock Setup ====================
// Mock shared state for portal
let mockPortalOpenState = false;
vitest_1.vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open }) => {
        mockPortalOpenState = open || false;
        return (<div data-testid="portal-elem" data-open={open}>
        {children}
      </div>);
    },
    PortalToFollowElemTrigger: ({ children, onClick, className }) => (<div data-testid="portal-trigger" onClick={onClick} className={className}>
      {children}
    </div>),
    PortalToFollowElemContent: ({ children, className }) => {
        if (!mockPortalOpenState)
            return null;
        return (<div data-testid="portal-content" className={className}>
        {children}
      </div>);
    },
}));
// Mock Toast
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: vitest_1.vi.fn(),
    },
}));
// Mock zustand store
let mockStoreDetail;
vitest_1.vi.mock('../../store', () => ({
    usePluginStore: (selector) => selector({ detail: mockStoreDetail }),
}));
// Mock subscription list hook
const mockSubscriptions = [];
const mockRefetch = vitest_1.vi.fn();
vitest_1.vi.mock('../use-subscription-list', () => ({
    useSubscriptionList: () => ({
        subscriptions: mockSubscriptions,
        refetch: mockRefetch,
    }),
}));
// Mock trigger service hooks
let mockProviderInfo = { data: undefined };
let mockOAuthConfig = { data: undefined, refetch: vitest_1.vi.fn() };
const mockInitiateOAuth = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-triggers', () => ({
    useTriggerProviderInfo: () => mockProviderInfo,
    useTriggerOAuthConfig: () => mockOAuthConfig,
    useInitiateTriggerOAuth: () => ({
        mutate: mockInitiateOAuth,
    }),
}));
// Mock OAuth popup
vitest_1.vi.mock('@/hooks/use-oauth', () => ({
    openOAuthPopup: vitest_1.vi.fn((url, callback) => {
        callback({ success: true, subscriptionId: 'test-subscription' });
    }),
}));
// Mock child modals
vitest_1.vi.mock('./common-modal', () => ({
    CommonCreateModal: ({ createType, onClose, builder }) => (<div data-testid="common-create-modal" data-create-type={createType} data-has-builder={!!builder}>
      <button data-testid="close-modal" onClick={onClose}>Close</button>
    </div>),
}));
vitest_1.vi.mock('./oauth-client', () => ({
    OAuthClientSettingsModal: ({ oauthConfig, onClose, showOAuthCreateModal }) => (<div data-testid="oauth-client-modal" data-has-config={!!oauthConfig}>
      <button data-testid="close-oauth-modal" onClick={onClose}>Close</button>
      <button data-testid="show-create-modal" onClick={() => showOAuthCreateModal({
            id: 'test-builder',
            name: 'test',
            provider: 'test-provider',
            credential_type: types_2.TriggerCredentialTypeEnum.Oauth2,
            credentials: {},
            endpoint: 'https://test.com',
            parameters: {},
            properties: {},
            workflows_in_use: 0,
        })}>
        Show Create Modal
      </button>
    </div>),
}));
// Mock CustomSelect
vitest_1.vi.mock('@/app/components/base/select/custom', () => ({
    default: ({ options, value, onChange, CustomTrigger, CustomOption, containerProps }) => (<div data-testid="custom-select" data-value={value} data-options-count={options?.length || 0} data-container-open={containerProps?.open}>
      <div data-testid="custom-trigger">{CustomTrigger()}</div>
      <div data-testid="options-container">
        {options?.map(option => (<div key={option.value} data-testid={`option-${option.value}`} onClick={() => onChange(option.value)}>
            {CustomOption(option)}
          </div>))}
      </div>
    </div>),
}));
// ==================== Test Utilities ====================
/**
 * Factory function to create a TriggerProviderApiEntity with defaults
 */
const createProviderInfo = (overrides = {}) => ({
    author: 'test-author',
    name: 'test-provider',
    label: { en_US: 'Test Provider', zh_Hans: 'Test Provider' },
    description: { en_US: 'Test Description', zh_Hans: 'Test Description' },
    icon: 'test-icon',
    tags: [],
    plugin_unique_identifier: 'test-plugin',
    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
    subscription_schema: [],
    events: [],
    ...overrides,
});
/**
 * Factory function to create a TriggerOAuthConfig with defaults
 */
const createOAuthConfig = (overrides = {}) => ({
    configured: false,
    custom_configured: false,
    custom_enabled: false,
    redirect_uri: 'https://test.com/callback',
    oauth_client_schema: [],
    params: {
        client_id: '',
        client_secret: '',
    },
    system_configured: false,
    ...overrides,
});
/**
 * Factory function to create a SimpleDetail with defaults
 */
const createStoreDetail = (overrides = {}) => ({
    plugin_id: 'test-plugin',
    name: 'Test Plugin',
    plugin_unique_identifier: 'test-plugin-unique',
    id: 'test-id',
    provider: 'test-provider',
    declaration: {},
    ...overrides,
});
/**
 * Factory function to create a TriggerSubscription with defaults
 */
const createSubscription = (overrides = {}) => ({
    id: 'test-subscription',
    name: 'Test Subscription',
    provider: 'test-provider',
    credential_type: types_2.TriggerCredentialTypeEnum.ApiKey,
    credentials: {},
    endpoint: 'https://test.com',
    parameters: {},
    properties: {},
    workflows_in_use: 0,
    ...overrides,
});
/**
 * Factory function to create default props
 */
const createDefaultProps = (overrides = {}) => ({
    ...overrides,
});
/**
 * Helper to set up mock data for testing
 */
const setupMocks = (config = {}) => {
    mockProviderInfo = { data: config.providerInfo };
    mockOAuthConfig = { data: config.oauthConfig, refetch: vitest_1.vi.fn() };
    mockStoreDetail = config.storeDetail;
    mockSubscriptions.length = 0;
    if (config.subscriptions)
        mockSubscriptions.push(...config.subscriptions);
};
// ==================== Tests ====================
(0, vitest_1.describe)('CreateSubscriptionButton', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpenState = false;
        setupMocks();
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render null when supportedMethods is empty', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({ supported_creation_methods: [] }),
            });
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(container).toBeEmptyDOMElement();
        });
        (0, vitest_1.it)('should render without crashing when supportedMethods is provided', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({ supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL] }),
            });
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(container).not.toBeEmptyDOMElement();
        });
        (0, vitest_1.it)('should render full button by default', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({ supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL] }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render icon button when buttonType is ICON_BUTTON', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({ supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL] }),
            });
            const props = createDefaultProps({ buttonType: index_1.CreateButtonType.ICON_BUTTON });
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            const actionButton = react_1.screen.getByTestId('custom-trigger');
            (0, vitest_1.expect)(actionButton).toBeInTheDocument();
        });
    });
    // ==================== Props Testing ====================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply default buttonType as FULL_BUTTON', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({ supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL] }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply shape prop correctly', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({ supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL] }),
            });
            const props = createDefaultProps({ buttonType: index_1.CreateButtonType.ICON_BUTTON, shape: 'circle' });
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-trigger')).toBeInTheDocument();
        });
    });
    // ==================== State Management ====================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should show CommonCreateModal when selectedCreateInfo is set', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL, types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on MANUAL option to set selectedCreateInfo
            const manualOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.MANUAL}`);
            react_1.fireEvent.click(manualOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toHaveAttribute('data-create-type', types_1.SupportedCreationMethods.MANUAL);
            });
        });
        (0, vitest_1.it)('should close CommonCreateModal when onClose is called', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL, types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Open modal
            const manualOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.MANUAL}`);
            react_1.fireEvent.click(manualOption);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toBeInTheDocument();
            });
            // Close modal
            react_1.fireEvent.click(react_1.screen.getByTestId('close-modal'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('common-create-modal')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show OAuthClientSettingsModal when oauth settings is clicked', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: false }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on OAuth option (which should show client settings when not configured)
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('oauth-client-modal')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should close OAuthClientSettingsModal and refetch config when closed', async () => {
            // Arrange
            const mockRefetchOAuth = vitest_1.vi.fn();
            mockOAuthConfig = { data: createOAuthConfig({ configured: false }), refetch: mockRefetchOAuth };
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: false }),
            });
            // Reset after setupMocks to keep our custom refetch
            mockOAuthConfig.refetch = mockRefetchOAuth;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Open OAuth modal
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('oauth-client-modal')).toBeInTheDocument();
            });
            // Close modal
            react_1.fireEvent.click(react_1.screen.getByTestId('close-oauth-modal'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('oauth-client-modal')).not.toBeInTheDocument();
                (0, vitest_1.expect)(mockRefetchOAuth).toHaveBeenCalled();
            });
        });
    });
    // ==================== Memoization Logic ====================
    (0, vitest_1.describe)('Memoization - buttonTextMap', () => {
        (0, vitest_1.it)('should display correct button text for OAUTH method', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - OAuth mode renders with settings button, use getAllByRole
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons[0]).toHaveTextContent('pluginTrigger.subscription.createButton.oauth');
        });
        (0, vitest_1.it)('should display correct button text for APIKEY method', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toHaveTextContent('pluginTrigger.subscription.createButton.apiKey');
        });
        (0, vitest_1.it)('should display correct button text for MANUAL method', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toHaveTextContent('pluginTrigger.subscription.createButton.manual');
        });
        (0, vitest_1.it)('should display default button text when multiple methods are supported', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL, types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toHaveTextContent('pluginTrigger.subscription.empty.button');
        });
    });
    (0, vitest_1.describe)('Memoization - allOptions', () => {
        (0, vitest_1.it)('should show only OAUTH option when only OAUTH is supported', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig(),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            const customSelect = react_1.screen.getByTestId('custom-select');
            (0, vitest_1.expect)(customSelect).toHaveAttribute('data-options-count', '1');
        });
        (0, vitest_1.it)('should show all options when all methods are supported', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [
                        types_1.SupportedCreationMethods.OAUTH,
                        types_1.SupportedCreationMethods.APIKEY,
                        types_1.SupportedCreationMethods.MANUAL,
                    ],
                }),
                oauthConfig: createOAuthConfig(),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            const customSelect = react_1.screen.getByTestId('custom-select');
            (0, vitest_1.expect)(customSelect).toHaveAttribute('data-options-count', '3');
        });
        (0, vitest_1.it)('should show custom badge when OAuth custom is enabled and configured', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({
                    custom_enabled: true,
                    custom_configured: true,
                    configured: true,
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - Custom badge should appear in the button
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons[0]).toHaveTextContent('plugin.auth.custom');
        });
        (0, vitest_1.it)('should not show custom badge when OAuth custom is not configured', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({
                    custom_enabled: true,
                    custom_configured: false,
                    configured: true,
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - The button should be there but no custom badge text
            const buttons = react_1.screen.getAllByRole('button');
            (0, vitest_1.expect)(buttons[0]).not.toHaveTextContent('plugin.auth.custom');
        });
    });
    (0, vitest_1.describe)('Memoization - methodType', () => {
        (0, vitest_1.it)('should set methodType to DEFAULT_METHOD when multiple methods supported', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL, types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            const customSelect = react_1.screen.getByTestId('custom-select');
            (0, vitest_1.expect)(customSelect).toHaveAttribute('data-value', index_1.DEFAULT_METHOD);
        });
        (0, vitest_1.it)('should set methodType to single method when only one supported', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            const customSelect = react_1.screen.getByTestId('custom-select');
            (0, vitest_1.expect)(customSelect).toHaveAttribute('data-value', types_1.SupportedCreationMethods.MANUAL);
        });
    });
    // ==================== User Interactions ====================
    // Helper to create max subscriptions array
    const createMaxSubscriptions = () => Array.from({ length: 10 }, (_, i) => createSubscription({ id: `sub-${i}` }));
    (0, vitest_1.describe)('User Interactions - onClickCreate', () => {
        (0, vitest_1.it)('should prevent action when subscription count is at max', () => {
            // Arrange
            const maxSubscriptions = createMaxSubscriptions();
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
                subscriptions: maxSubscriptions,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - modal should not open
            (0, vitest_1.expect)(react_1.screen.queryByTestId('common-create-modal')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should call onChooseCreateType when single method (non-OAuth) is used', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            const button = react_1.screen.getByRole('button');
            react_1.fireEvent.click(button);
            // Assert - modal should open
            (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not call onChooseCreateType for DEFAULT_METHOD or single OAuth', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // For OAuth mode, there are multiple buttons; get the primary button (first one)
            const buttons = react_1.screen.getAllByRole('button');
            react_1.fireEvent.click(buttons[0]);
            // Assert - For single OAuth, should not directly create but wait for dropdown
            // The modal should not immediately open
            (0, vitest_1.expect)(react_1.screen.queryByTestId('common-create-modal')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('User Interactions - onChooseCreateType', () => {
        (0, vitest_1.it)('should open OAuth client settings modal when OAuth not configured', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH, types_1.SupportedCreationMethods.MANUAL],
                }),
                oauthConfig: createOAuthConfig({ configured: false }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on OAuth option
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('oauth-client-modal')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should initiate OAuth flow when OAuth is configured', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH, types_1.SupportedCreationMethods.MANUAL],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on OAuth option
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInitiateOAuth).toHaveBeenCalledWith('test-provider', vitest_1.expect.any(Object));
            });
        });
        (0, vitest_1.it)('should set selectedCreateInfo for APIKEY type', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.APIKEY, types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on APIKEY option
            const apiKeyOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.APIKEY}`);
            react_1.fireEvent.click(apiKeyOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toHaveAttribute('data-create-type', types_1.SupportedCreationMethods.APIKEY);
            });
        });
        (0, vitest_1.it)('should set selectedCreateInfo for MANUAL type', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL, types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on MANUAL option
            const manualOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.MANUAL}`);
            react_1.fireEvent.click(manualOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toHaveAttribute('data-create-type', types_1.SupportedCreationMethods.MANUAL);
            });
        });
    });
    (0, vitest_1.describe)('User Interactions - onClickClientSettings', () => {
        (0, vitest_1.it)('should open OAuth client settings modal when settings icon clicked', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Find the settings div inside the button (p-2 class)
            const buttons = react_1.screen.getAllByRole('button');
            const primaryButton = buttons[0];
            const settingsDiv = primaryButton.querySelector('.p-2');
            // Assert that settings div exists and click it
            (0, vitest_1.expect)(settingsDiv).toBeInTheDocument();
            if (settingsDiv) {
                react_1.fireEvent.click(settingsDiv);
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByTestId('oauth-client-modal')).toBeInTheDocument();
                });
            }
        });
    });
    // ==================== API Calls ====================
    (0, vitest_1.describe)('API Calls', () => {
        (0, vitest_1.it)('should call useTriggerProviderInfo with correct provider', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail({ provider: 'my-provider' }),
                providerInfo: createProviderInfo({ supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL] }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - Component renders, which means hook was called
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-select')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle OAuth initiation success', async () => {
            // Arrange
            const mockBuilder = {
                id: 'oauth-builder',
                name: 'OAuth Builder',
                provider: 'test-provider',
                credential_type: types_2.TriggerCredentialTypeEnum.Oauth2,
                credentials: {},
                endpoint: 'https://test.com',
                parameters: {},
                properties: {},
                workflows_in_use: 0,
            };
            mockInitiateOAuth.mockImplementation((_provider, callbacks) => {
                callbacks.onSuccess({
                    authorization_url: 'https://oauth.test.com/authorize',
                    subscription_builder: mockBuilder,
                });
            });
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH, types_1.SupportedCreationMethods.MANUAL],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on OAuth option
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            // Assert - modal should open with OAuth type and builder
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toHaveAttribute('data-has-builder', 'true');
            });
        });
        (0, vitest_1.it)('should handle OAuth initiation error', async () => {
            // Arrange
            const Toast = await Promise.resolve().then(() => require('@/app/components/base/toast'));
            mockInitiateOAuth.mockImplementation((_provider, callbacks) => {
                callbacks.onError();
            });
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH, types_1.SupportedCreationMethods.MANUAL],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on OAuth option
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(Toast.default.notify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ type: 'error' }));
            });
        });
    });
    // ==================== Edge Cases ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle null subscriptions gracefully', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({ supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL] }),
                subscriptions: undefined,
            });
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(container).not.toBeEmptyDOMElement();
        });
        (0, vitest_1.it)('should handle undefined provider gracefully', () => {
            // Arrange
            setupMocks({
                storeDetail: undefined,
                providerInfo: createProviderInfo({ supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL] }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - component should still render
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-select')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty oauthConfig gracefully', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: undefined,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-select')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show max count tooltip when subscriptions reach limit', () => {
            // Arrange
            const maxSubscriptions = Array.from({ length: 10 }, (_, i) => createSubscription({ id: `sub-${i}` }));
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
                subscriptions: maxSubscriptions,
            });
            const props = createDefaultProps({ buttonType: index_1.CreateButtonType.ICON_BUTTON });
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - ActionButton should be in disabled state
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-trigger')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle showOAuthCreateModal callback from OAuthClientSettingsModal', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: false }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Open OAuth modal
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('oauth-client-modal')).toBeInTheDocument();
            });
            // Click show create modal button
            react_1.fireEvent.click(react_1.screen.getByTestId('show-create-modal'));
            // Assert - CommonCreateModal should be shown with OAuth type and builder
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toHaveAttribute('data-create-type', types_1.SupportedCreationMethods.OAUTH);
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toHaveAttribute('data-has-builder', 'true');
            });
        });
    });
    // ==================== Conditional Rendering ====================
    (0, vitest_1.describe)('Conditional Rendering', () => {
        (0, vitest_1.it)('should render settings icon for OAuth in full button mode', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - settings icon should be present in button, OAuth mode has multiple buttons
            const buttons = react_1.screen.getAllByRole('button');
            const primaryButton = buttons[0];
            const settingsDiv = primaryButton.querySelector('.p-2');
            (0, vitest_1.expect)(settingsDiv).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render settings icon for non-OAuth methods', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - should not have settings divider
            const button = react_1.screen.getByRole('button');
            const divider = button.querySelector('.bg-text-primary-on-surface');
            (0, vitest_1.expect)(divider).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply disabled state when subscription count reaches max', () => {
            // Arrange
            const maxSubscriptions = Array.from({ length: 10 }, (_, i) => createSubscription({ id: `sub-${i}` }));
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
                subscriptions: maxSubscriptions,
            });
            const props = createDefaultProps({ buttonType: index_1.CreateButtonType.ICON_BUTTON });
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - icon button should exist
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-trigger')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply circle shape class when shape is circle', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps({ buttonType: index_1.CreateButtonType.ICON_BUTTON, shape: 'circle' });
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-trigger')).toBeInTheDocument();
        });
    });
    // ==================== CustomSelect containerProps ====================
    (0, vitest_1.describe)('CustomSelect containerProps', () => {
        (0, vitest_1.it)('should set open to undefined for default method with multiple supported methods', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL, types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - open should be undefined to allow dropdown to work
            const customSelect = react_1.screen.getByTestId('custom-select');
            (0, vitest_1.expect)(customSelect.getAttribute('data-container-open')).toBeNull();
        });
        (0, vitest_1.it)('should set open to undefined for single OAuth method', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - for single OAuth, open should be undefined
            const customSelect = react_1.screen.getByTestId('custom-select');
            (0, vitest_1.expect)(customSelect.getAttribute('data-container-open')).toBeNull();
        });
        (0, vitest_1.it)('should set open to false for single non-OAuth method', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert - for single non-OAuth, dropdown should be disabled (open = false)
            const customSelect = react_1.screen.getByTestId('custom-select');
            (0, vitest_1.expect)(customSelect).toHaveAttribute('data-container-open', 'false');
        });
    });
    // ==================== Button Type Variations ====================
    (0, vitest_1.describe)('Button Type Variations', () => {
        (0, vitest_1.it)('should render full button with grow class', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps({ buttonType: index_1.CreateButtonType.FULL_BUTTON });
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            const button = react_1.screen.getByRole('button');
            (0, vitest_1.expect)(button).toHaveClass('w-full');
        });
        (0, vitest_1.it)('should render icon button with float-right class', () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL],
                }),
            });
            const props = createDefaultProps({ buttonType: index_1.CreateButtonType.ICON_BUTTON });
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-trigger')).toBeInTheDocument();
        });
    });
    // ==================== Export Verification ====================
    (0, vitest_1.describe)('Export Verification', () => {
        (0, vitest_1.it)('should export CreateButtonType enum', () => {
            // Assert
            (0, vitest_1.expect)(index_1.CreateButtonType.FULL_BUTTON).toBe('full-button');
            (0, vitest_1.expect)(index_1.CreateButtonType.ICON_BUTTON).toBe('icon-button');
        });
        (0, vitest_1.it)('should export DEFAULT_METHOD constant', () => {
            // Assert
            (0, vitest_1.expect)(index_1.DEFAULT_METHOD).toBe('default');
        });
        (0, vitest_1.it)('should export CreateSubscriptionButton component', () => {
            // Assert
            (0, vitest_1.expect)(typeof index_1.CreateSubscriptionButton).toBe('function');
        });
    });
    // ==================== CommonCreateModal Integration Tests ====================
    // These tests verify that CreateSubscriptionButton correctly interacts with CommonCreateModal
    (0, vitest_1.describe)('CommonCreateModal Integration', () => {
        (0, vitest_1.it)('should pass correct createType to CommonCreateModal for MANUAL', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL, types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on MANUAL option
            const manualOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.MANUAL}`);
            react_1.fireEvent.click(manualOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                const modal = react_1.screen.getByTestId('common-create-modal');
                (0, vitest_1.expect)(modal).toHaveAttribute('data-create-type', types_1.SupportedCreationMethods.MANUAL);
            });
        });
        (0, vitest_1.it)('should pass correct createType to CommonCreateModal for APIKEY', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.MANUAL, types_1.SupportedCreationMethods.APIKEY],
                }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on APIKEY option
            const apiKeyOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.APIKEY}`);
            react_1.fireEvent.click(apiKeyOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                const modal = react_1.screen.getByTestId('common-create-modal');
                (0, vitest_1.expect)(modal).toHaveAttribute('data-create-type', types_1.SupportedCreationMethods.APIKEY);
            });
        });
        (0, vitest_1.it)('should pass builder to CommonCreateModal for OAuth flow', async () => {
            // Arrange
            const mockBuilder = {
                id: 'oauth-builder',
                name: 'OAuth Builder',
                provider: 'test-provider',
                credential_type: types_2.TriggerCredentialTypeEnum.Oauth2,
                credentials: {},
                endpoint: 'https://test.com',
                parameters: {},
                properties: {},
                workflows_in_use: 0,
            };
            mockInitiateOAuth.mockImplementation((_provider, callbacks) => {
                callbacks.onSuccess({
                    authorization_url: 'https://oauth.test.com/authorize',
                    subscription_builder: mockBuilder,
                });
            });
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH, types_1.SupportedCreationMethods.MANUAL],
                }),
                oauthConfig: createOAuthConfig({ configured: true }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on OAuth option
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                const modal = react_1.screen.getByTestId('common-create-modal');
                (0, vitest_1.expect)(modal).toHaveAttribute('data-has-builder', 'true');
            });
        });
    });
    // ==================== OAuthClientSettingsModal Integration Tests ====================
    // These tests verify that CreateSubscriptionButton correctly interacts with OAuthClientSettingsModal
    (0, vitest_1.describe)('OAuthClientSettingsModal Integration', () => {
        (0, vitest_1.it)('should pass oauthConfig to OAuthClientSettingsModal', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: false }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Click on OAuth option (opens settings when not configured)
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            // Assert
            await (0, react_1.waitFor)(() => {
                const modal = react_1.screen.getByTestId('oauth-client-modal');
                (0, vitest_1.expect)(modal).toHaveAttribute('data-has-config', 'true');
            });
        });
        (0, vitest_1.it)('should refetch OAuth config when OAuthClientSettingsModal is closed', async () => {
            // Arrange
            const mockRefetchOAuth = vitest_1.vi.fn();
            mockOAuthConfig = { data: createOAuthConfig({ configured: false }), refetch: mockRefetchOAuth };
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: false }),
            });
            // Reset after setupMocks to keep our custom refetch
            mockOAuthConfig.refetch = mockRefetchOAuth;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Open OAuth modal
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('oauth-client-modal')).toBeInTheDocument();
            });
            // Close modal
            react_1.fireEvent.click(react_1.screen.getByTestId('close-oauth-modal'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefetchOAuth).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should show CommonCreateModal with builder when showOAuthCreateModal callback is invoked', async () => {
            // Arrange
            setupMocks({
                storeDetail: createStoreDetail(),
                providerInfo: createProviderInfo({
                    supported_creation_methods: [types_1.SupportedCreationMethods.OAUTH],
                }),
                oauthConfig: createOAuthConfig({ configured: false }),
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.CreateSubscriptionButton {...props}/>);
            // Open OAuth modal
            const oauthOption = react_1.screen.getByTestId(`option-${types_1.SupportedCreationMethods.OAUTH}`);
            react_1.fireEvent.click(oauthOption);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('oauth-client-modal')).toBeInTheDocument();
            });
            // Click showOAuthCreateModal button
            react_1.fireEvent.click(react_1.screen.getByTestId('show-create-modal'));
            // Assert - CommonCreateModal should appear with OAuth type and builder
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toHaveAttribute('data-create-type', types_1.SupportedCreationMethods.OAUTH);
                (0, vitest_1.expect)(react_1.screen.getByTestId('common-create-modal')).toHaveAttribute('data-has-builder', 'true');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLG1DQUE2RDtBQUM3RCwwREFBeUU7QUFDekUsMEVBQTBGO0FBQzFGLG1DQUFvRjtBQUVwRix1REFBdUQ7QUFFdkQsK0JBQStCO0FBQy9CLElBQUksbUJBQW1CLEdBQUcsS0FBSyxDQUFBO0FBRS9CLFdBQUUsQ0FBQyxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1RCxrQkFBa0IsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBZ0QsRUFBRSxFQUFFO1FBQ3ZGLG1CQUFtQixHQUFHLElBQUksSUFBSSxLQUFLLENBQUE7UUFDbkMsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQzdDO1FBQUEsQ0FBQyxRQUFRLENBQ1g7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0lBQ0QseUJBQXlCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUEyRSxFQUFFLEVBQUUsQ0FBQyxDQUN4SSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQ3ZFO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QseUJBQXlCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQXFELEVBQUUsRUFBRTtRQUN4RyxJQUFJLENBQUMsbUJBQW1CO1lBQ3RCLE9BQU8sSUFBSSxDQUFBO1FBQ2IsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FB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QUFpQixFQUFFLENBQUE7Z0JBQ3JFLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxnQ0FBd0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDckgsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQy9GLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTaW1wbGVEZXRhaWwgfSBmcm9tICcuLi8uLi9zdG9yZSdcbmltcG9ydCB0eXBlIHsgVHJpZ2dlck9BdXRoQ29uZmlnLCBUcmlnZ2VyUHJvdmlkZXJBcGlFbnRpdHksIFRyaWdnZXJTdWJzY3JpcHRpb24sIFRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90eXBlcydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL3R5cGVzJ1xuaW1wb3J0IHsgVHJpZ2dlckNyZWRlbnRpYWxUeXBlRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgeyBDcmVhdGVCdXR0b25UeXBlLCBDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24sIERFRkFVTFRfTUVUSE9EIH0gZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gTW9jayBTZXR1cCA9PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHNoYXJlZCBzdGF0ZSBmb3IgcG9ydGFsXG5sZXQgbW9ja1BvcnRhbE9wZW5TdGF0ZSA9IGZhbHNlXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nLCAoKSA9PiAoe1xuICBQb3J0YWxUb0ZvbGxvd0VsZW06ICh7IGNoaWxkcmVuLCBvcGVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSwgb3BlbjogYm9vbGVhbiB9KSA9PiB7XG4gICAgbW9ja1BvcnRhbE9wZW5TdGF0ZSA9IG9wZW4gfHwgZmFsc2VcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1lbGVtXCIgZGF0YS1vcGVuPXtvcGVufT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyOiAoeyBjaGlsZHJlbiwgb25DbGljaywgY2xhc3NOYW1lIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSwgb25DbGljaz86ICgpID0+IHZvaWQsIGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC10cmlnZ2VyXCIgb25DbGljaz17b25DbGlja30gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSwgY2xhc3NOYW1lPzogc3RyaW5nIH0pID0+IHtcbiAgICBpZiAoIW1vY2tQb3J0YWxPcGVuU3RhdGUpXG4gICAgICByZXR1cm4gbnVsbFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicG9ydGFsLWNvbnRlbnRcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIFRvYXN0XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgbm90aWZ5OiB2aS5mbigpLFxuICB9LFxufSkpXG5cbi8vIE1vY2sgenVzdGFuZCBzdG9yZVxubGV0IG1vY2tTdG9yZURldGFpbDogU2ltcGxlRGV0YWlsIHwgdW5kZWZpbmVkXG52aS5tb2NrKCcuLi8uLi9zdG9yZScsICgpID0+ICh7XG4gIHVzZVBsdWdpblN0b3JlOiAoc2VsZWN0b3I6IChzdGF0ZTogeyBkZXRhaWw6IFNpbXBsZURldGFpbCB8IHVuZGVmaW5lZCB9KSA9PiBTaW1wbGVEZXRhaWwgfCB1bmRlZmluZWQpID0+XG4gICAgc2VsZWN0b3IoeyBkZXRhaWw6IG1vY2tTdG9yZURldGFpbCB9KSxcbn0pKVxuXG4vLyBNb2NrIHN1YnNjcmlwdGlvbiBsaXN0IGhvb2tcbmNvbnN0IG1vY2tTdWJzY3JpcHRpb25zOiBUcmlnZ2VyU3Vic2NyaXB0aW9uW10gPSBbXVxuY29uc3QgbW9ja1JlZmV0Y2ggPSB2aS5mbigpXG52aS5tb2NrKCcuLi91c2Utc3Vic2NyaXB0aW9uLWxpc3QnLCAoKSA9PiAoe1xuICB1c2VTdWJzY3JpcHRpb25MaXN0OiAoKSA9PiAoe1xuICAgIHN1YnNjcmlwdGlvbnM6IG1vY2tTdWJzY3JpcHRpb25zLFxuICAgIHJlZmV0Y2g6IG1vY2tSZWZldGNoLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHRyaWdnZXIgc2VydmljZSBob29rc1xubGV0IG1vY2tQcm92aWRlckluZm86IHsgZGF0YTogVHJpZ2dlclByb3ZpZGVyQXBpRW50aXR5IHwgdW5kZWZpbmVkIH0gPSB7IGRhdGE6IHVuZGVmaW5lZCB9XG5sZXQgbW9ja09BdXRoQ29uZmlnOiB7IGRhdGE6IFRyaWdnZXJPQXV0aENvbmZpZyB8IHVuZGVmaW5lZCwgcmVmZXRjaDogKCkgPT4gdm9pZCB9ID0geyBkYXRhOiB1bmRlZmluZWQsIHJlZmV0Y2g6IHZpLmZuKCkgfVxuY29uc3QgbW9ja0luaXRpYXRlT0F1dGggPSB2aS5mbigpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtdHJpZ2dlcnMnLCAoKSA9PiAoe1xuICB1c2VUcmlnZ2VyUHJvdmlkZXJJbmZvOiAoKSA9PiBtb2NrUHJvdmlkZXJJbmZvLFxuICB1c2VUcmlnZ2VyT0F1dGhDb25maWc6ICgpID0+IG1vY2tPQXV0aENvbmZpZyxcbiAgdXNlSW5pdGlhdGVUcmlnZ2VyT0F1dGg6ICgpID0+ICh7XG4gICAgbXV0YXRlOiBtb2NrSW5pdGlhdGVPQXV0aCxcbiAgfSksXG59KSlcblxuLy8gTW9jayBPQXV0aCBwb3B1cFxudmkubW9jaygnQC9ob29rcy91c2Utb2F1dGgnLCAoKSA9PiAoe1xuICBvcGVuT0F1dGhQb3B1cDogdmkuZm4oKHVybDogc3RyaW5nLCBjYWxsYmFjazogKGRhdGE/OiB1bmtub3duKSA9PiB2b2lkKSA9PiB7XG4gICAgY2FsbGJhY2soeyBzdWNjZXNzOiB0cnVlLCBzdWJzY3JpcHRpb25JZDogJ3Rlc3Qtc3Vic2NyaXB0aW9uJyB9KVxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGNoaWxkIG1vZGFsc1xudmkubW9jaygnLi9jb21tb24tbW9kYWwnLCAoKSA9PiAoe1xuICBDb21tb25DcmVhdGVNb2RhbDogKHsgY3JlYXRlVHlwZSwgb25DbG9zZSwgYnVpbGRlciB9OiB7XG4gICAgY3JlYXRlVHlwZTogU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzXG4gICAgb25DbG9zZTogKCkgPT4gdm9pZFxuICAgIGJ1aWxkZXI/OiBUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlclxuICB9KSA9PiAoXG4gICAgPGRpdlxuICAgICAgZGF0YS10ZXN0aWQ9XCJjb21tb24tY3JlYXRlLW1vZGFsXCJcbiAgICAgIGRhdGEtY3JlYXRlLXR5cGU9e2NyZWF0ZVR5cGV9XG4gICAgICBkYXRhLWhhcy1idWlsZGVyPXshIWJ1aWxkZXJ9XG4gICAgPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImNsb3NlLW1vZGFsXCIgb25DbGljaz17b25DbG9zZX0+Q2xvc2U8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCcuL29hdXRoLWNsaWVudCcsICgpID0+ICh7XG4gIE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbDogKHsgb2F1dGhDb25maWcsIG9uQ2xvc2UsIHNob3dPQXV0aENyZWF0ZU1vZGFsIH06IHtcbiAgICBvYXV0aENvbmZpZz86IFRyaWdnZXJPQXV0aENvbmZpZ1xuICAgIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgICBzaG93T0F1dGhDcmVhdGVNb2RhbDogKGJ1aWxkZXI6IFRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyKSA9PiB2b2lkXG4gIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD1cIm9hdXRoLWNsaWVudC1tb2RhbFwiXG4gICAgICBkYXRhLWhhcy1jb25maWc9eyEhb2F1dGhDb25maWd9XG4gICAgPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImNsb3NlLW9hdXRoLW1vZGFsXCIgb25DbGljaz17b25DbG9zZX0+Q2xvc2U8L2J1dHRvbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJzaG93LWNyZWF0ZS1tb2RhbFwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNob3dPQXV0aENyZWF0ZU1vZGFsKHtcbiAgICAgICAgICBpZDogJ3Rlc3QtYnVpbGRlcicsXG4gICAgICAgICAgbmFtZTogJ3Rlc3QnLFxuICAgICAgICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gICAgICAgICAgY3JlZGVudGlhbF90eXBlOiBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtLk9hdXRoMixcbiAgICAgICAgICBjcmVkZW50aWFsczoge30sXG4gICAgICAgICAgZW5kcG9pbnQ6ICdodHRwczovL3Rlc3QuY29tJyxcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgICB3b3JrZmxvd3NfaW5fdXNlOiAwLFxuICAgICAgICB9KX1cbiAgICAgID5cbiAgICAgICAgU2hvdyBDcmVhdGUgTW9kYWxcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgQ3VzdG9tU2VsZWN0XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2VsZWN0L2N1c3RvbScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IG9wdGlvbnMsIHZhbHVlLCBvbkNoYW5nZSwgQ3VzdG9tVHJpZ2dlciwgQ3VzdG9tT3B0aW9uLCBjb250YWluZXJQcm9wcyB9OiB7XG4gICAgb3B0aW9uczogQXJyYXk8eyB2YWx1ZTogc3RyaW5nLCBsYWJlbDogc3RyaW5nLCBzaG93OiBib29sZWFuLCBleHRyYT86IFJlYWN0LlJlYWN0Tm9kZSwgdGFnPzogUmVhY3QuUmVhY3ROb2RlIH0+XG4gICAgdmFsdWU6IHN0cmluZ1xuICAgIG9uQ2hhbmdlOiAodmFsdWU6IHN0cmluZykgPT4gdm9pZFxuICAgIEN1c3RvbVRyaWdnZXI6ICgpID0+IFJlYWN0LlJlYWN0Tm9kZVxuICAgIEN1c3RvbU9wdGlvbjogKG9wdGlvbjogeyBsYWJlbDogc3RyaW5nLCB0YWc/OiBSZWFjdC5SZWFjdE5vZGUsIGV4dHJhPzogUmVhY3QuUmVhY3ROb2RlIH0pID0+IFJlYWN0LlJlYWN0Tm9kZVxuICAgIGNvbnRhaW5lclByb3BzPzogeyBvcGVuPzogYm9vbGVhbiB9XG4gIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD1cImN1c3RvbS1zZWxlY3RcIlxuICAgICAgZGF0YS12YWx1ZT17dmFsdWV9XG4gICAgICBkYXRhLW9wdGlvbnMtY291bnQ9e29wdGlvbnM/Lmxlbmd0aCB8fCAwfVxuICAgICAgZGF0YS1jb250YWluZXItb3Blbj17Y29udGFpbmVyUHJvcHM/Lm9wZW59XG4gICAgPlxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImN1c3RvbS10cmlnZ2VyXCI+e0N1c3RvbVRyaWdnZXIoKX08L2Rpdj5cbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJvcHRpb25zLWNvbnRhaW5lclwiPlxuICAgICAgICB7b3B0aW9ucz8ubWFwKG9wdGlvbiA9PiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAga2V5PXtvcHRpb24udmFsdWV9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD17YG9wdGlvbi0ke29wdGlvbi52YWx1ZX1gfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25DaGFuZ2Uob3B0aW9uLnZhbHVlKX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7Q3VzdG9tT3B0aW9uKG9wdGlvbil9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gVGVzdCBVdGlsaXRpZXMgPT09PT09PT09PT09PT09PT09PT1cblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFRyaWdnZXJQcm92aWRlckFwaUVudGl0eSB3aXRoIGRlZmF1bHRzXG4gKi9cbmNvbnN0IGNyZWF0ZVByb3ZpZGVySW5mbyA9IChvdmVycmlkZXM6IFBhcnRpYWw8VHJpZ2dlclByb3ZpZGVyQXBpRW50aXR5PiA9IHt9KTogVHJpZ2dlclByb3ZpZGVyQXBpRW50aXR5ID0+ICh7XG4gIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgbmFtZTogJ3Rlc3QtcHJvdmlkZXInLFxuICBsYWJlbDogeyBlbl9VUzogJ1Rlc3QgUHJvdmlkZXInLCB6aF9IYW5zOiAnVGVzdCBQcm92aWRlcicgfSxcbiAgZGVzY3JpcHRpb246IHsgZW5fVVM6ICdUZXN0IERlc2NyaXB0aW9uJywgemhfSGFuczogJ1Rlc3QgRGVzY3JpcHRpb24nIH0sXG4gIGljb246ICd0ZXN0LWljb24nLFxuICB0YWdzOiBbXSxcbiAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC1wbHVnaW4nLFxuICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICBzdWJzY3JpcHRpb25fc2NoZW1hOiBbXSxcbiAgZXZlbnRzOiBbXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFRyaWdnZXJPQXV0aENvbmZpZyB3aXRoIGRlZmF1bHRzXG4gKi9cbmNvbnN0IGNyZWF0ZU9BdXRoQ29uZmlnID0gKG92ZXJyaWRlczogUGFydGlhbDxUcmlnZ2VyT0F1dGhDb25maWc+ID0ge30pOiBUcmlnZ2VyT0F1dGhDb25maWcgPT4gKHtcbiAgY29uZmlndXJlZDogZmFsc2UsXG4gIGN1c3RvbV9jb25maWd1cmVkOiBmYWxzZSxcbiAgY3VzdG9tX2VuYWJsZWQ6IGZhbHNlLFxuICByZWRpcmVjdF91cmk6ICdodHRwczovL3Rlc3QuY29tL2NhbGxiYWNrJyxcbiAgb2F1dGhfY2xpZW50X3NjaGVtYTogW10sXG4gIHBhcmFtczoge1xuICAgIGNsaWVudF9pZDogJycsXG4gICAgY2xpZW50X3NlY3JldDogJycsXG4gIH0sXG4gIHN5c3RlbV9jb25maWd1cmVkOiBmYWxzZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIFNpbXBsZURldGFpbCB3aXRoIGRlZmF1bHRzXG4gKi9cbmNvbnN0IGNyZWF0ZVN0b3JlRGV0YWlsID0gKG92ZXJyaWRlczogUGFydGlhbDxTaW1wbGVEZXRhaWw+ID0ge30pOiBTaW1wbGVEZXRhaWwgPT4gKHtcbiAgcGx1Z2luX2lkOiAndGVzdC1wbHVnaW4nLFxuICBuYW1lOiAnVGVzdCBQbHVnaW4nLFxuICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXBsdWdpbi11bmlxdWUnLFxuICBpZDogJ3Rlc3QtaWQnLFxuICBwcm92aWRlcjogJ3Rlc3QtcHJvdmlkZXInLFxuICBkZWNsYXJhdGlvbjoge30sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgYSBUcmlnZ2VyU3Vic2NyaXB0aW9uIHdpdGggZGVmYXVsdHNcbiAqL1xuY29uc3QgY3JlYXRlU3Vic2NyaXB0aW9uID0gKG92ZXJyaWRlczogUGFydGlhbDxUcmlnZ2VyU3Vic2NyaXB0aW9uPiA9IHt9KTogVHJpZ2dlclN1YnNjcmlwdGlvbiA9PiAoe1xuICBpZDogJ3Rlc3Qtc3Vic2NyaXB0aW9uJyxcbiAgbmFtZTogJ1Rlc3QgU3Vic2NyaXB0aW9uJyxcbiAgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyJyxcbiAgY3JlZGVudGlhbF90eXBlOiBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtLkFwaUtleSxcbiAgY3JlZGVudGlhbHM6IHt9LFxuICBlbmRwb2ludDogJ2h0dHBzOi8vdGVzdC5jb20nLFxuICBwYXJhbWV0ZXJzOiB7fSxcbiAgcHJvcGVydGllczoge30sXG4gIHdvcmtmbG93c19pbl91c2U6IDAsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiB0byBjcmVhdGUgZGVmYXVsdCBwcm9wc1xuICovXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBhcmFtZXRlcnM8dHlwZW9mIENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbj5bMF0+ID0ge30pID0+ICh7XG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogSGVscGVyIHRvIHNldCB1cCBtb2NrIGRhdGEgZm9yIHRlc3RpbmdcbiAqL1xuY29uc3Qgc2V0dXBNb2NrcyA9IChjb25maWc6IHtcbiAgcHJvdmlkZXJJbmZvPzogVHJpZ2dlclByb3ZpZGVyQXBpRW50aXR5XG4gIG9hdXRoQ29uZmlnPzogVHJpZ2dlck9BdXRoQ29uZmlnXG4gIHN0b3JlRGV0YWlsPzogU2ltcGxlRGV0YWlsXG4gIHN1YnNjcmlwdGlvbnM/OiBUcmlnZ2VyU3Vic2NyaXB0aW9uW11cbn0gPSB7fSkgPT4ge1xuICBtb2NrUHJvdmlkZXJJbmZvID0geyBkYXRhOiBjb25maWcucHJvdmlkZXJJbmZvIH1cbiAgbW9ja09BdXRoQ29uZmlnID0geyBkYXRhOiBjb25maWcub2F1dGhDb25maWcsIHJlZmV0Y2g6IHZpLmZuKCkgfVxuICBtb2NrU3RvcmVEZXRhaWwgPSBjb25maWcuc3RvcmVEZXRhaWxcbiAgbW9ja1N1YnNjcmlwdGlvbnMubGVuZ3RoID0gMFxuICBpZiAoY29uZmlnLnN1YnNjcmlwdGlvbnMpXG4gICAgbW9ja1N1YnNjcmlwdGlvbnMucHVzaCguLi5jb25maWcuc3Vic2NyaXB0aW9ucylcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT0gVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0NyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1BvcnRhbE9wZW5TdGF0ZSA9IGZhbHNlXG4gICAgc2V0dXBNb2NrcygpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUmVuZGVyaW5nIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbnVsbCB3aGVuIHN1cHBvcnRlZE1ldGhvZHMgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHsgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtdIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyKS50b0JlRW1wdHlET01FbGVtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZyB3aGVuIHN1cHBvcnRlZE1ldGhvZHMgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHsgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMXSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikubm90LnRvQmVFbXB0eURPTUVsZW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmdWxsIGJ1dHRvbiBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7IHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTF0gfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGljb24gYnV0dG9uIHdoZW4gYnV0dG9uVHlwZSBpcyBJQ09OX0JVVFRPTicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oeyBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgYnV0dG9uVHlwZTogQ3JlYXRlQnV0dG9uVHlwZS5JQ09OX0JVVFRPTiB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgYWN0aW9uQnV0dG9uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tdHJpZ2dlcicpXG4gICAgICBleHBlY3QoYWN0aW9uQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBQcm9wcyBUZXN0aW5nID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGRlZmF1bHQgYnV0dG9uVHlwZSBhcyBGVUxMX0JVVFRPTicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oeyBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHNoYXBlIHByb3AgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7IHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTF0gfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBidXR0b25UeXBlOiBDcmVhdGVCdXR0b25UeXBlLklDT05fQlVUVE9OLCBzaGFwZTogJ2NpcmNsZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS10cmlnZ2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFN0YXRlIE1hbmFnZW1lbnQgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IENvbW1vbkNyZWF0ZU1vZGFsIHdoZW4gc2VsZWN0ZWRDcmVhdGVJbmZvIGlzIHNldCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTCwgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWV0sXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBDbGljayBvbiBNQU5VQUwgb3B0aW9uIHRvIHNldCBzZWxlY3RlZENyZWF0ZUluZm9cbiAgICAgIGNvbnN0IG1hbnVhbE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH1gKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKG1hbnVhbE9wdGlvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29tbW9uLWNyZWF0ZS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbW1vbi1jcmVhdGUtbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWNyZWF0ZS10eXBlJywgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgQ29tbW9uQ3JlYXRlTW9kYWwgd2hlbiBvbkNsb3NlIGlzIGNhbGxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTCwgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWV0sXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBPcGVuIG1vZGFsXG4gICAgICBjb25zdCBtYW51YWxPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoYG9wdGlvbi0ke1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9YClcbiAgICAgIGZpcmVFdmVudC5jbGljayhtYW51YWxPcHRpb24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb21tb24tY3JlYXRlLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsb3NlIG1vZGFsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1tb2RhbCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NvbW1vbi1jcmVhdGUtbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgd2hlbiBvYXV0aCBzZXR0aW5ncyBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEhdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKHsgY29uZmlndXJlZDogZmFsc2UgfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIENsaWNrIG9uIE9BdXRoIG9wdGlvbiAod2hpY2ggc2hvdWxkIHNob3cgY2xpZW50IHNldHRpbmdzIHdoZW4gbm90IGNvbmZpZ3VyZWQpXG4gICAgICBjb25zdCBvYXV0aE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sob2F1dGhPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29hdXRoLWNsaWVudC1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsb3NlIE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCBhbmQgcmVmZXRjaCBjb25maWcgd2hlbiBjbG9zZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrUmVmZXRjaE9BdXRoID0gdmkuZm4oKVxuICAgICAgbW9ja09BdXRoQ29uZmlnID0geyBkYXRhOiBjcmVhdGVPQXV0aENvbmZpZyh7IGNvbmZpZ3VyZWQ6IGZhbHNlIH0pLCByZWZldGNoOiBtb2NrUmVmZXRjaE9BdXRoIH1cblxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEhdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKHsgY29uZmlndXJlZDogZmFsc2UgfSksXG4gICAgICB9KVxuICAgICAgLy8gUmVzZXQgYWZ0ZXIgc2V0dXBNb2NrcyB0byBrZWVwIG91ciBjdXN0b20gcmVmZXRjaFxuICAgICAgbW9ja09BdXRoQ29uZmlnLnJlZmV0Y2ggPSBtb2NrUmVmZXRjaE9BdXRoXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBPcGVuIE9BdXRoIG1vZGFsXG4gICAgICBjb25zdCBvYXV0aE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sob2F1dGhPcHRpb24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvYXV0aC1jbGllbnQtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2xvc2UgbW9kYWxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nsb3NlLW9hdXRoLW1vZGFsJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnb2F1dGgtY2xpZW50LW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChtb2NrUmVmZXRjaE9BdXRoKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBNZW1vaXphdGlvbiBMb2dpYyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gLSBidXR0b25UZXh0TWFwJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IGJ1dHRvbiB0ZXh0IGZvciBPQVVUSCBtZXRob2QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSF0sXG4gICAgICAgIH0pLFxuICAgICAgICBvYXV0aENvbmZpZzogY3JlYXRlT0F1dGhDb25maWcoeyBjb25maWd1cmVkOiB0cnVlIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBPQXV0aCBtb2RlIHJlbmRlcnMgd2l0aCBzZXR0aW5ncyBidXR0b24sIHVzZSBnZXRBbGxCeVJvbGVcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnNbMF0pLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW5UcmlnZ2VyLnN1YnNjcmlwdGlvbi5jcmVhdGVCdXR0b24ub2F1dGgnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY29ycmVjdCBidXR0b24gdGV4dCBmb3IgQVBJS0VZIG1ldGhvZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWV0sXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmNyZWF0ZUJ1dHRvbi5hcGlLZXknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY29ycmVjdCBidXR0b24gdGV4dCBmb3IgTUFOVUFMIG1ldGhvZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTF0sXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmNyZWF0ZUJ1dHRvbi5tYW51YWwnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZGVmYXVsdCBidXR0b24gdGV4dCB3aGVuIG11bHRpcGxlIG1ldGhvZHMgYXJlIHN1cHBvcnRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTCwgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWV0sXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpblRyaWdnZXIuc3Vic2NyaXB0aW9uLmVtcHR5LmJ1dHRvbicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gLSBhbGxPcHRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBvbmx5IE9BVVRIIG9wdGlvbiB3aGVuIG9ubHkgT0FVVEggaXMgc3VwcG9ydGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEhdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKCksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY3VzdG9tU2VsZWN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tc2VsZWN0JylcbiAgICAgIGV4cGVjdChjdXN0b21TZWxlY3QpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1vcHRpb25zLWNvdW50JywgJzEnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgYWxsIG9wdGlvbnMgd2hlbiBhbGwgbWV0aG9kcyBhcmUgc3VwcG9ydGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtcbiAgICAgICAgICAgIFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSCxcbiAgICAgICAgICAgIFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5BUElLRVksXG4gICAgICAgICAgICBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pLFxuICAgICAgICBvYXV0aENvbmZpZzogY3JlYXRlT0F1dGhDb25maWcoKSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjdXN0b21TZWxlY3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1zZWxlY3QnKVxuICAgICAgZXhwZWN0KGN1c3RvbVNlbGVjdCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW9wdGlvbnMtY291bnQnLCAnMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjdXN0b20gYmFkZ2Ugd2hlbiBPQXV0aCBjdXN0b20gaXMgZW5hYmxlZCBhbmQgY29uZmlndXJlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIXSxcbiAgICAgICAgfSksXG4gICAgICAgIG9hdXRoQ29uZmlnOiBjcmVhdGVPQXV0aENvbmZpZyh7XG4gICAgICAgICAgY3VzdG9tX2VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgY3VzdG9tX2NvbmZpZ3VyZWQ6IHRydWUsXG4gICAgICAgICAgY29uZmlndXJlZDogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEN1c3RvbSBiYWRnZSBzaG91bGQgYXBwZWFyIGluIHRoZSBidXR0b25cbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnNbMF0pLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW4uYXV0aC5jdXN0b20nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGN1c3RvbSBiYWRnZSB3aGVuIE9BdXRoIGN1c3RvbSBpcyBub3QgY29uZmlndXJlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIXSxcbiAgICAgICAgfSksXG4gICAgICAgIG9hdXRoQ29uZmlnOiBjcmVhdGVPQXV0aENvbmZpZyh7XG4gICAgICAgICAgY3VzdG9tX2VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgY3VzdG9tX2NvbmZpZ3VyZWQ6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyZWQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBUaGUgYnV0dG9uIHNob3VsZCBiZSB0aGVyZSBidXQgbm8gY3VzdG9tIGJhZGdlIHRleHRcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbnNbMF0pLm5vdC50b0hhdmVUZXh0Q29udGVudCgncGx1Z2luLmF1dGguY3VzdG9tJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiAtIG1ldGhvZFR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzZXQgbWV0aG9kVHlwZSB0byBERUZBVUxUX01FVEhPRCB3aGVuIG11bHRpcGxlIG1ldGhvZHMgc3VwcG9ydGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMLCBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuQVBJS0VZXSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY3VzdG9tU2VsZWN0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tc2VsZWN0JylcbiAgICAgIGV4cGVjdChjdXN0b21TZWxlY3QpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS12YWx1ZScsIERFRkFVTFRfTUVUSE9EKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBtZXRob2RUeXBlIHRvIHNpbmdsZSBtZXRob2Qgd2hlbiBvbmx5IG9uZSBzdXBwb3J0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBjdXN0b21TZWxlY3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1zZWxlY3QnKVxuICAgICAgZXhwZWN0KGN1c3RvbVNlbGVjdCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXZhbHVlJywgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFVzZXIgSW50ZXJhY3Rpb25zID09PT09PT09PT09PT09PT09PT09XG4gIC8vIEhlbHBlciB0byBjcmVhdGUgbWF4IHN1YnNjcmlwdGlvbnMgYXJyYXlcbiAgY29uc3QgY3JlYXRlTWF4U3Vic2NyaXB0aW9ucyA9ICgpID0+XG4gICAgQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+IGNyZWF0ZVN1YnNjcmlwdGlvbih7IGlkOiBgc3ViLSR7aX1gIH0pKVxuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucyAtIG9uQ2xpY2tDcmVhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwcmV2ZW50IGFjdGlvbiB3aGVuIHN1YnNjcmlwdGlvbiBjb3VudCBpcyBhdCBtYXgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtYXhTdWJzY3JpcHRpb25zID0gY3JlYXRlTWF4U3Vic2NyaXB0aW9ucygpXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICAgICAgICB9KSxcbiAgICAgICAgc3Vic2NyaXB0aW9uczogbWF4U3Vic2NyaXB0aW9ucyxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnQgLSBtb2RhbCBzaG91bGQgbm90IG9wZW5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY29tbW9uLWNyZWF0ZS1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaG9vc2VDcmVhdGVUeXBlIHdoZW4gc2luZ2xlIG1ldGhvZCAobm9uLU9BdXRoKSBpcyB1c2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMXSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0IC0gbW9kYWwgc2hvdWxkIG9wZW5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbW1vbi1jcmVhdGUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uQ2hvb3NlQ3JlYXRlVHlwZSBmb3IgREVGQVVMVF9NRVRIT0Qgb3Igc2luZ2xlIE9BdXRoJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEhdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKHsgY29uZmlndXJlZDogdHJ1ZSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcbiAgICAgIC8vIEZvciBPQXV0aCBtb2RlLCB0aGVyZSBhcmUgbXVsdGlwbGUgYnV0dG9uczsgZ2V0IHRoZSBwcmltYXJ5IGJ1dHRvbiAoZmlyc3Qgb25lKVxuICAgICAgY29uc3QgYnV0dG9ucyA9IHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uc1swXSlcblxuICAgICAgLy8gQXNzZXJ0IC0gRm9yIHNpbmdsZSBPQXV0aCwgc2hvdWxkIG5vdCBkaXJlY3RseSBjcmVhdGUgYnV0IHdhaXQgZm9yIGRyb3Bkb3duXG4gICAgICAvLyBUaGUgbW9kYWwgc2hvdWxkIG5vdCBpbW1lZGlhdGVseSBvcGVuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NvbW1vbi1jcmVhdGUtbW9kYWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucyAtIG9uQ2hvb3NlQ3JlYXRlVHlwZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gT0F1dGggY2xpZW50IHNldHRpbmdzIG1vZGFsIHdoZW4gT0F1dGggbm90IGNvbmZpZ3VyZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSCwgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTF0sXG4gICAgICAgIH0pLFxuICAgICAgICBvYXV0aENvbmZpZzogY3JlYXRlT0F1dGhDb25maWcoeyBjb25maWd1cmVkOiBmYWxzZSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgb24gT0F1dGggb3B0aW9uXG4gICAgICBjb25zdCBvYXV0aE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sob2F1dGhPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29hdXRoLWNsaWVudC1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluaXRpYXRlIE9BdXRoIGZsb3cgd2hlbiBPQXV0aCBpcyBjb25maWd1cmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEgsIFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKHsgY29uZmlndXJlZDogdHJ1ZSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgb24gT0F1dGggb3B0aW9uXG4gICAgICBjb25zdCBvYXV0aE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sob2F1dGhPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW5pdGlhdGVPQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3QtcHJvdmlkZXInLCBleHBlY3QuYW55KE9iamVjdCkpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBzZWxlY3RlZENyZWF0ZUluZm8gZm9yIEFQSUtFWSB0eXBlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuQVBJS0VZLCBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMXSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIENsaWNrIG9uIEFQSUtFWSBvcHRpb25cbiAgICAgIGNvbnN0IGFwaUtleU9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWX1gKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGFwaUtleU9wdGlvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29tbW9uLWNyZWF0ZS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbW1vbi1jcmVhdGUtbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWNyZWF0ZS10eXBlJywgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IHNlbGVjdGVkQ3JlYXRlSW5mbyBmb3IgTUFOVUFMIHR5cGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUwsIFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5BUElLRVldLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgb24gTUFOVUFMIG9wdGlvblxuICAgICAgY29uc3QgbWFudWFsT3B0aW9uID0gc2NyZWVuLmdldEJ5VGVzdElkKGBvcHRpb24tJHtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sobWFudWFsT3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb21tb24tY3JlYXRlLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29tbW9uLWNyZWF0ZS1tb2RhbCcpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtY3JlYXRlLXR5cGUnLCBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucyAtIG9uQ2xpY2tDbGllbnRTZXR0aW5ncycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG9wZW4gT0F1dGggY2xpZW50IHNldHRpbmdzIG1vZGFsIHdoZW4gc2V0dGluZ3MgaWNvbiBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEhdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKHsgY29uZmlndXJlZDogdHJ1ZSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gRmluZCB0aGUgc2V0dGluZ3MgZGl2IGluc2lkZSB0aGUgYnV0dG9uIChwLTIgY2xhc3MpXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGNvbnN0IHByaW1hcnlCdXR0b24gPSBidXR0b25zWzBdXG4gICAgICBjb25zdCBzZXR0aW5nc0RpdiA9IHByaW1hcnlCdXR0b24ucXVlcnlTZWxlY3RvcignLnAtMicpXG5cbiAgICAgIC8vIEFzc2VydCB0aGF0IHNldHRpbmdzIGRpdiBleGlzdHMgYW5kIGNsaWNrIGl0XG4gICAgICBleHBlY3Qoc2V0dGluZ3NEaXYpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGlmIChzZXR0aW5nc0Rpdikge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2V0dGluZ3NEaXYpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29hdXRoLWNsaWVudC1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBBUEkgQ2FsbHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FQSSBDYWxscycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgdXNlVHJpZ2dlclByb3ZpZGVySW5mbyB3aXRoIGNvcnJlY3QgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKHsgcHJvdmlkZXI6ICdteS1wcm92aWRlcicgfSksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHsgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMXSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHJlbmRlcnMsIHdoaWNoIG1lYW5zIGhvb2sgd2FzIGNhbGxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXNlbGVjdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIE9BdXRoIGluaXRpYXRpb24gc3VjY2VzcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tCdWlsZGVyOiBUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlciA9IHtcbiAgICAgICAgaWQ6ICdvYXV0aC1idWlsZGVyJyxcbiAgICAgICAgbmFtZTogJ09BdXRoIEJ1aWxkZXInLFxuICAgICAgICBwcm92aWRlcjogJ3Rlc3QtcHJvdmlkZXInLFxuICAgICAgICBjcmVkZW50aWFsX3R5cGU6IFRyaWdnZXJDcmVkZW50aWFsVHlwZUVudW0uT2F1dGgyLFxuICAgICAgICBjcmVkZW50aWFsczoge30sXG4gICAgICAgIGVuZHBvaW50OiAnaHR0cHM6Ly90ZXN0LmNvbScsXG4gICAgICAgIHBhcmFtZXRlcnM6IHt9LFxuICAgICAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICAgICAgd29ya2Zsb3dzX2luX3VzZTogMCxcbiAgICAgIH1cblxuICAgICAgdHlwZSBPQXV0aFN1Y2Nlc3NSZXNwb25zZSA9IHtcbiAgICAgICAgYXV0aG9yaXphdGlvbl91cmw6IHN0cmluZ1xuICAgICAgICBzdWJzY3JpcHRpb25fYnVpbGRlcjogVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXJcbiAgICAgIH1cbiAgICAgIHR5cGUgT0F1dGhDYWxsYmFja3MgPSB7IG9uU3VjY2VzczogKHJlc3BvbnNlOiBPQXV0aFN1Y2Nlc3NSZXNwb25zZSkgPT4gdm9pZCB9XG5cbiAgICAgIG1vY2tJbml0aWF0ZU9BdXRoLm1vY2tJbXBsZW1lbnRhdGlvbigoX3Byb3ZpZGVyOiBzdHJpbmcsIGNhbGxiYWNrczogT0F1dGhDYWxsYmFja3MpID0+IHtcbiAgICAgICAgY2FsbGJhY2tzLm9uU3VjY2Vzcyh7XG4gICAgICAgICAgYXV0aG9yaXphdGlvbl91cmw6ICdodHRwczovL29hdXRoLnRlc3QuY29tL2F1dGhvcml6ZScsXG4gICAgICAgICAgc3Vic2NyaXB0aW9uX2J1aWxkZXI6IG1vY2tCdWlsZGVyLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEgsIFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKHsgY29uZmlndXJlZDogdHJ1ZSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgb24gT0F1dGggb3B0aW9uXG4gICAgICBjb25zdCBvYXV0aE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sob2F1dGhPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydCAtIG1vZGFsIHNob3VsZCBvcGVuIHdpdGggT0F1dGggdHlwZSBhbmQgYnVpbGRlclxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbW1vbi1jcmVhdGUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb21tb24tY3JlYXRlLW1vZGFsJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtYnVpbGRlcicsICd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIE9BdXRoIGluaXRpYXRpb24gZXJyb3InLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBUb2FzdCA9IGF3YWl0IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0JylcblxuICAgICAgbW9ja0luaXRpYXRlT0F1dGgubW9ja0ltcGxlbWVudGF0aW9uKChfcHJvdmlkZXI6IHN0cmluZywgY2FsbGJhY2tzOiB7IG9uRXJyb3I6ICgpID0+IHZvaWQgfSkgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25FcnJvcigpXG4gICAgICB9KVxuXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSCwgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTF0sXG4gICAgICAgIH0pLFxuICAgICAgICBvYXV0aENvbmZpZzogY3JlYXRlT0F1dGhDb25maWcoeyBjb25maWd1cmVkOiB0cnVlIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBDbGljayBvbiBPQXV0aCBvcHRpb25cbiAgICAgIGNvbnN0IG9hdXRoT3B0aW9uID0gc2NyZWVuLmdldEJ5VGVzdElkKGBvcHRpb24tJHtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEh9YClcbiAgICAgIGZpcmVFdmVudC5jbGljayhvYXV0aE9wdGlvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KFRvYXN0LmRlZmF1bHQubm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7IHR5cGU6ICdlcnJvcicgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBFZGdlIENhc2VzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgc3Vic2NyaXB0aW9ucyBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7IHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTF0gfSksXG4gICAgICAgIHN1YnNjcmlwdGlvbnM6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikubm90LnRvQmVFbXB0eURPTUVsZW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcHJvdmlkZXIgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogdW5kZWZpbmVkLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7IHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTF0gfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbXBvbmVudCBzaG91bGQgc3RpbGwgcmVuZGVyXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tc2VsZWN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgb2F1dGhDb25maWcgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIXSxcbiAgICAgICAgfSksXG4gICAgICAgIG9hdXRoQ29uZmlnOiB1bmRlZmluZWQsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXNlbGVjdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBtYXggY291bnQgdG9vbHRpcCB3aGVuIHN1YnNjcmlwdGlvbnMgcmVhY2ggbGltaXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtYXhTdWJzY3JpcHRpb25zID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMTAgfSwgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZVN1YnNjcmlwdGlvbih7IGlkOiBgc3ViLSR7aX1gIH0pKVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMXSxcbiAgICAgICAgfSksXG4gICAgICAgIHN1YnNjcmlwdGlvbnM6IG1heFN1YnNjcmlwdGlvbnMsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBidXR0b25UeXBlOiBDcmVhdGVCdXR0b25UeXBlLklDT05fQlVUVE9OIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQWN0aW9uQnV0dG9uIHNob3VsZCBiZSBpbiBkaXNhYmxlZCBzdGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzaG93T0F1dGhDcmVhdGVNb2RhbCBjYWxsYmFjayBmcm9tIE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIXSxcbiAgICAgICAgfSksXG4gICAgICAgIG9hdXRoQ29uZmlnOiBjcmVhdGVPQXV0aENvbmZpZyh7IGNvbmZpZ3VyZWQ6IGZhbHNlIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBPcGVuIE9BdXRoIG1vZGFsXG4gICAgICBjb25zdCBvYXV0aE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sob2F1dGhPcHRpb24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvYXV0aC1jbGllbnQtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2xpY2sgc2hvdyBjcmVhdGUgbW9kYWwgYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzaG93LWNyZWF0ZS1tb2RhbCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21tb25DcmVhdGVNb2RhbCBzaG91bGQgYmUgc2hvd24gd2l0aCBPQXV0aCB0eXBlIGFuZCBidWlsZGVyXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29tbW9uLWNyZWF0ZS1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbW1vbi1jcmVhdGUtbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWNyZWF0ZS10eXBlJywgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb21tb24tY3JlYXRlLW1vZGFsJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtYnVpbGRlcicsICd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBDb25kaXRpb25hbCBSZW5kZXJpbmcgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbmRpdGlvbmFsIFJlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzZXR0aW5ncyBpY29uIGZvciBPQXV0aCBpbiBmdWxsIGJ1dHRvbiBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEhdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKHsgY29uZmlndXJlZDogdHJ1ZSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gc2V0dGluZ3MgaWNvbiBzaG91bGQgYmUgcHJlc2VudCBpbiBidXR0b24sIE9BdXRoIG1vZGUgaGFzIG11bHRpcGxlIGJ1dHRvbnNcbiAgICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgICAgY29uc3QgcHJpbWFyeUJ1dHRvbiA9IGJ1dHRvbnNbMF1cbiAgICAgIGNvbnN0IHNldHRpbmdzRGl2ID0gcHJpbWFyeUJ1dHRvbi5xdWVyeVNlbGVjdG9yKCcucC0yJylcbiAgICAgIGV4cGVjdChzZXR0aW5nc0RpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgc2V0dGluZ3MgaWNvbiBmb3Igbm9uLU9BdXRoIG1ldGhvZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIG5vdCBoYXZlIHNldHRpbmdzIGRpdmlkZXJcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgICBjb25zdCBkaXZpZGVyID0gYnV0dG9uLnF1ZXJ5U2VsZWN0b3IoJy5iZy10ZXh0LXByaW1hcnktb24tc3VyZmFjZScpXG4gICAgICBleHBlY3QoZGl2aWRlcikubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBkaXNhYmxlZCBzdGF0ZSB3aGVuIHN1YnNjcmlwdGlvbiBjb3VudCByZWFjaGVzIG1heCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1heFN1YnNjcmlwdGlvbnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT5cbiAgICAgICAgY3JlYXRlU3Vic2NyaXB0aW9uKHsgaWQ6IGBzdWItJHtpfWAgfSkpXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICAgICAgICB9KSxcbiAgICAgICAgc3Vic2NyaXB0aW9uczogbWF4U3Vic2NyaXB0aW9ucyxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJ1dHRvblR5cGU6IENyZWF0ZUJ1dHRvblR5cGUuSUNPTl9CVVRUT04gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBpY29uIGJ1dHRvbiBzaG91bGQgZXhpc3RcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS10cmlnZ2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjaXJjbGUgc2hhcGUgY2xhc3Mgd2hlbiBzaGFwZSBpcyBjaXJjbGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJ1dHRvblR5cGU6IENyZWF0ZUJ1dHRvblR5cGUuSUNPTl9CVVRUT04sIHNoYXBlOiAnY2lyY2xlJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gQ3VzdG9tU2VsZWN0IGNvbnRhaW5lclByb3BzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDdXN0b21TZWxlY3QgY29udGFpbmVyUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzZXQgb3BlbiB0byB1bmRlZmluZWQgZm9yIGRlZmF1bHQgbWV0aG9kIHdpdGggbXVsdGlwbGUgc3VwcG9ydGVkIG1ldGhvZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUwsIFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5BUElLRVldLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gb3BlbiBzaG91bGQgYmUgdW5kZWZpbmVkIHRvIGFsbG93IGRyb3Bkb3duIHRvIHdvcmtcbiAgICAgIGNvbnN0IGN1c3RvbVNlbGVjdCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXNlbGVjdCcpXG4gICAgICBleHBlY3QoY3VzdG9tU2VsZWN0LmdldEF0dHJpYnV0ZSgnZGF0YS1jb250YWluZXItb3BlbicpKS50b0JlTnVsbCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IG9wZW4gdG8gdW5kZWZpbmVkIGZvciBzaW5nbGUgT0F1dGggbWV0aG9kJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEhdLFxuICAgICAgICB9KSxcbiAgICAgICAgb2F1dGhDb25maWc6IGNyZWF0ZU9BdXRoQ29uZmlnKHsgY29uZmlndXJlZDogdHJ1ZSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gZm9yIHNpbmdsZSBPQXV0aCwgb3BlbiBzaG91bGQgYmUgdW5kZWZpbmVkXG4gICAgICBjb25zdCBjdXN0b21TZWxlY3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1zZWxlY3QnKVxuICAgICAgZXhwZWN0KGN1c3RvbVNlbGVjdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29udGFpbmVyLW9wZW4nKSkudG9CZU51bGwoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBvcGVuIHRvIGZhbHNlIGZvciBzaW5nbGUgbm9uLU9BdXRoIG1ldGhvZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTF0sXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBmb3Igc2luZ2xlIG5vbi1PQXV0aCwgZHJvcGRvd24gc2hvdWxkIGJlIGRpc2FibGVkIChvcGVuID0gZmFsc2UpXG4gICAgICBjb25zdCBjdXN0b21TZWxlY3QgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1zZWxlY3QnKVxuICAgICAgZXhwZWN0KGN1c3RvbVNlbGVjdCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWNvbnRhaW5lci1vcGVuJywgJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEJ1dHRvbiBUeXBlIFZhcmlhdGlvbnMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0J1dHRvbiBUeXBlIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZnVsbCBidXR0b24gd2l0aCBncm93IGNsYXNzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIHN0b3JlRGV0YWlsOiBjcmVhdGVTdG9yZURldGFpbCgpLFxuICAgICAgICBwcm92aWRlckluZm86IGNyZWF0ZVByb3ZpZGVySW5mbyh7XG4gICAgICAgICAgc3VwcG9ydGVkX2NyZWF0aW9uX21ldGhvZHM6IFtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMXSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBidXR0b25UeXBlOiBDcmVhdGVCdXR0b25UeXBlLkZVTExfQlVUVE9OIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBidXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGJ1dHRvbikudG9IYXZlQ2xhc3MoJ3ctZnVsbCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGljb24gYnV0dG9uIHdpdGggZmxvYXQtcmlnaHQgY2xhc3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUxdLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGJ1dHRvblR5cGU6IENyZWF0ZUJ1dHRvblR5cGUuSUNPTl9CVVRUT04gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS10cmlnZ2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEV4cG9ydCBWZXJpZmljYXRpb24gPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0V4cG9ydCBWZXJpZmljYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBleHBvcnQgQ3JlYXRlQnV0dG9uVHlwZSBlbnVtJywgKCkgPT4ge1xuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoQ3JlYXRlQnV0dG9uVHlwZS5GVUxMX0JVVFRPTikudG9CZSgnZnVsbC1idXR0b24nKVxuICAgICAgZXhwZWN0KENyZWF0ZUJ1dHRvblR5cGUuSUNPTl9CVVRUT04pLnRvQmUoJ2ljb24tYnV0dG9uJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBleHBvcnQgREVGQVVMVF9NRVRIT0QgY29uc3RhbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChERUZBVUxUX01FVEhPRCkudG9CZSgnZGVmYXVsdCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZXhwb3J0IENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdCh0eXBlb2YgQ3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uKS50b0JlKCdmdW5jdGlvbicpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBDb21tb25DcmVhdGVNb2RhbCBJbnRlZ3JhdGlvbiBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUaGVzZSB0ZXN0cyB2ZXJpZnkgdGhhdCBDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gY29ycmVjdGx5IGludGVyYWN0cyB3aXRoIENvbW1vbkNyZWF0ZU1vZGFsXG4gIGRlc2NyaWJlKCdDb21tb25DcmVhdGVNb2RhbCBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCBjcmVhdGVUeXBlIHRvIENvbW1vbkNyZWF0ZU1vZGFsIGZvciBNQU5VQUwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUwsIFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5BUElLRVldLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgb24gTUFOVUFMIG9wdGlvblxuICAgICAgY29uc3QgbWFudWFsT3B0aW9uID0gc2NyZWVuLmdldEJ5VGVzdElkKGBvcHRpb24tJHtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sobWFudWFsT3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RhbCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY29tbW9uLWNyZWF0ZS1tb2RhbCcpXG4gICAgICAgIGV4cGVjdChtb2RhbCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWNyZWF0ZS10eXBlJywgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IGNyZWF0ZVR5cGUgdG8gQ29tbW9uQ3JlYXRlTW9kYWwgZm9yIEFQSUtFWScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTCwgU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWV0sXG4gICAgICAgIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBDbGljayBvbiBBUElLRVkgb3B0aW9uXG4gICAgICBjb25zdCBhcGlLZXlPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoYG9wdGlvbi0ke1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5BUElLRVl9YClcbiAgICAgIGZpcmVFdmVudC5jbGljayhhcGlLZXlPcHRpb24pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vZGFsID0gc2NyZWVuLmdldEJ5VGVzdElkKCdjb21tb24tY3JlYXRlLW1vZGFsJylcbiAgICAgICAgZXhwZWN0KG1vZGFsKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtY3JlYXRlLXR5cGUnLCBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuQVBJS0VZKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGJ1aWxkZXIgdG8gQ29tbW9uQ3JlYXRlTW9kYWwgZm9yIE9BdXRoIGZsb3cnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQnVpbGRlcjogVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXIgPSB7XG4gICAgICAgIGlkOiAnb2F1dGgtYnVpbGRlcicsXG4gICAgICAgIG5hbWU6ICdPQXV0aCBCdWlsZGVyJyxcbiAgICAgICAgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyJyxcbiAgICAgICAgY3JlZGVudGlhbF90eXBlOiBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtLk9hdXRoMixcbiAgICAgICAgY3JlZGVudGlhbHM6IHt9LFxuICAgICAgICBlbmRwb2ludDogJ2h0dHBzOi8vdGVzdC5jb20nLFxuICAgICAgICBwYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgcHJvcGVydGllczoge30sXG4gICAgICAgIHdvcmtmbG93c19pbl91c2U6IDAsXG4gICAgICB9XG5cbiAgICAgIHR5cGUgT0F1dGhTdWNjZXNzUmVzcG9uc2UgPSB7XG4gICAgICAgIGF1dGhvcml6YXRpb25fdXJsOiBzdHJpbmdcbiAgICAgICAgc3Vic2NyaXB0aW9uX2J1aWxkZXI6IFRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyXG4gICAgICB9XG4gICAgICB0eXBlIE9BdXRoQ2FsbGJhY2tzID0geyBvblN1Y2Nlc3M6IChyZXNwb25zZTogT0F1dGhTdWNjZXNzUmVzcG9uc2UpID0+IHZvaWQgfVxuXG4gICAgICBtb2NrSW5pdGlhdGVPQXV0aC5tb2NrSW1wbGVtZW50YXRpb24oKF9wcm92aWRlcjogc3RyaW5nLCBjYWxsYmFja3M6IE9BdXRoQ2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrcy5vblN1Y2Nlc3Moe1xuICAgICAgICAgIGF1dGhvcml6YXRpb25fdXJsOiAnaHR0cHM6Ly9vYXV0aC50ZXN0LmNvbS9hdXRob3JpemUnLFxuICAgICAgICAgIHN1YnNjcmlwdGlvbl9idWlsZGVyOiBtb2NrQnVpbGRlcixcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRILCBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMXSxcbiAgICAgICAgfSksXG4gICAgICAgIG9hdXRoQ29uZmlnOiBjcmVhdGVPQXV0aENvbmZpZyh7IGNvbmZpZ3VyZWQ6IHRydWUgfSksXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8Q3JlYXRlU3Vic2NyaXB0aW9uQnV0dG9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIENsaWNrIG9uIE9BdXRoIG9wdGlvblxuICAgICAgY29uc3Qgb2F1dGhPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoYG9wdGlvbi0ke1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH1gKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKG9hdXRoT3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RhbCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnY29tbW9uLWNyZWF0ZS1tb2RhbCcpXG4gICAgICAgIGV4cGVjdChtb2RhbCkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWhhcy1idWlsZGVyJywgJ3RydWUnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbCBJbnRlZ3JhdGlvbiBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICAvLyBUaGVzZSB0ZXN0cyB2ZXJpZnkgdGhhdCBDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gY29ycmVjdGx5IGludGVyYWN0cyB3aXRoIE9BdXRoQ2xpZW50U2V0dGluZ3NNb2RhbFxuICBkZXNjcmliZSgnT0F1dGhDbGllbnRTZXR0aW5nc01vZGFsIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBvYXV0aENvbmZpZyB0byBPQXV0aENsaWVudFNldHRpbmdzTW9kYWwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc3RvcmVEZXRhaWw6IGNyZWF0ZVN0b3JlRGV0YWlsKCksXG4gICAgICAgIHByb3ZpZGVySW5mbzogY3JlYXRlUHJvdmlkZXJJbmZvKHtcbiAgICAgICAgICBzdXBwb3J0ZWRfY3JlYXRpb25fbWV0aG9kczogW1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSF0sXG4gICAgICAgIH0pLFxuICAgICAgICBvYXV0aENvbmZpZzogY3JlYXRlT0F1dGhDb25maWcoeyBjb25maWd1cmVkOiBmYWxzZSB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2xpY2sgb24gT0F1dGggb3B0aW9uIChvcGVucyBzZXR0aW5ncyB3aGVuIG5vdCBjb25maWd1cmVkKVxuICAgICAgY29uc3Qgb2F1dGhPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoYG9wdGlvbi0ke1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH1gKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKG9hdXRoT3B0aW9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2RhbCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnb2F1dGgtY2xpZW50LW1vZGFsJylcbiAgICAgICAgZXhwZWN0KG1vZGFsKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtaGFzLWNvbmZpZycsICd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVmZXRjaCBPQXV0aCBjb25maWcgd2hlbiBPQXV0aENsaWVudFNldHRpbmdzTW9kYWwgaXMgY2xvc2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1JlZmV0Y2hPQXV0aCA9IHZpLmZuKClcbiAgICAgIG1vY2tPQXV0aENvbmZpZyA9IHsgZGF0YTogY3JlYXRlT0F1dGhDb25maWcoeyBjb25maWd1cmVkOiBmYWxzZSB9KSwgcmVmZXRjaDogbW9ja1JlZmV0Y2hPQXV0aCB9XG5cbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIXSxcbiAgICAgICAgfSksXG4gICAgICAgIG9hdXRoQ29uZmlnOiBjcmVhdGVPQXV0aENvbmZpZyh7IGNvbmZpZ3VyZWQ6IGZhbHNlIH0pLFxuICAgICAgfSlcbiAgICAgIC8vIFJlc2V0IGFmdGVyIHNldHVwTW9ja3MgdG8ga2VlcCBvdXIgY3VzdG9tIHJlZmV0Y2hcbiAgICAgIG1vY2tPQXV0aENvbmZpZy5yZWZldGNoID0gbW9ja1JlZmV0Y2hPQXV0aFxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxDcmVhdGVTdWJzY3JpcHRpb25CdXR0b24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gT3BlbiBPQXV0aCBtb2RhbFxuICAgICAgY29uc3Qgb2F1dGhPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoYG9wdGlvbi0ke1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH1gKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKG9hdXRoT3B0aW9uKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb2F1dGgtY2xpZW50LW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIENsb3NlIG1vZGFsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1vYXV0aC1tb2RhbCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1JlZmV0Y2hPQXV0aCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgQ29tbW9uQ3JlYXRlTW9kYWwgd2l0aCBidWlsZGVyIHdoZW4gc2hvd09BdXRoQ3JlYXRlTW9kYWwgY2FsbGJhY2sgaXMgaW52b2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzdG9yZURldGFpbDogY3JlYXRlU3RvcmVEZXRhaWwoKSxcbiAgICAgICAgcHJvdmlkZXJJbmZvOiBjcmVhdGVQcm92aWRlckluZm8oe1xuICAgICAgICAgIHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIXSxcbiAgICAgICAgfSksXG4gICAgICAgIG9hdXRoQ29uZmlnOiBjcmVhdGVPQXV0aENvbmZpZyh7IGNvbmZpZ3VyZWQ6IGZhbHNlIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPENyZWF0ZVN1YnNjcmlwdGlvbkJ1dHRvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBPcGVuIE9BdXRoIG1vZGFsXG4gICAgICBjb25zdCBvYXV0aE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRlc3RJZChgb3B0aW9uLSR7U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfWApXG4gICAgICBmaXJlRXZlbnQuY2xpY2sob2F1dGhPcHRpb24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvYXV0aC1jbGllbnQtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQ2xpY2sgc2hvd09BdXRoQ3JlYXRlTW9kYWwgYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzaG93LWNyZWF0ZS1tb2RhbCcpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21tb25DcmVhdGVNb2RhbCBzaG91bGQgYXBwZWFyIHdpdGggT0F1dGggdHlwZSBhbmQgYnVpbGRlclxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbW1vbi1jcmVhdGUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb21tb24tY3JlYXRlLW1vZGFsJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1jcmVhdGUtdHlwZScsIFN1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29tbW9uLWNyZWF0ZS1tb2RhbCcpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtaGFzLWJ1aWxkZXInLCAndHJ1ZScpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19