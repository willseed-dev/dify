"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("./types");
// ==================== Mock Setup ====================
// Mock API hooks for credential operations
const mockGetPluginCredentialInfo = vitest_1.vi.fn();
const mockDeletePluginCredential = vitest_1.vi.fn();
const mockSetPluginDefaultCredential = vitest_1.vi.fn();
const mockUpdatePluginCredential = vitest_1.vi.fn();
const mockInvalidPluginCredentialInfo = vitest_1.vi.fn();
const mockGetPluginOAuthUrl = vitest_1.vi.fn();
const mockGetPluginOAuthClientSchema = vitest_1.vi.fn();
const mockSetPluginOAuthCustomClient = vitest_1.vi.fn();
const mockDeletePluginOAuthCustomClient = vitest_1.vi.fn();
const mockInvalidPluginOAuthClientSchema = vitest_1.vi.fn();
const mockAddPluginCredential = vitest_1.vi.fn();
const mockGetPluginCredentialSchema = vitest_1.vi.fn();
const mockInvalidToolsByType = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-plugins-auth', () => ({
    useGetPluginCredentialInfo: (url) => ({
        data: url ? mockGetPluginCredentialInfo() : undefined,
        isLoading: false,
    }),
    useDeletePluginCredential: () => ({
        mutateAsync: mockDeletePluginCredential,
    }),
    useSetPluginDefaultCredential: () => ({
        mutateAsync: mockSetPluginDefaultCredential,
    }),
    useUpdatePluginCredential: () => ({
        mutateAsync: mockUpdatePluginCredential,
    }),
    useInvalidPluginCredentialInfo: () => mockInvalidPluginCredentialInfo,
    useGetPluginOAuthUrl: () => ({
        mutateAsync: mockGetPluginOAuthUrl,
    }),
    useGetPluginOAuthClientSchema: () => ({
        data: mockGetPluginOAuthClientSchema(),
        isLoading: false,
    }),
    useSetPluginOAuthCustomClient: () => ({
        mutateAsync: mockSetPluginOAuthCustomClient,
    }),
    useDeletePluginOAuthCustomClient: () => ({
        mutateAsync: mockDeletePluginOAuthCustomClient,
    }),
    useInvalidPluginOAuthClientSchema: () => mockInvalidPluginOAuthClientSchema,
    useAddPluginCredential: () => ({
        mutateAsync: mockAddPluginCredential,
    }),
    useGetPluginCredentialSchema: () => ({
        data: mockGetPluginCredentialSchema(),
        isLoading: false,
    }),
}));
vitest_1.vi.mock('@/service/use-tools', () => ({
    useInvalidToolsByType: () => mockInvalidToolsByType,
}));
// Mock AppContext
const mockIsCurrentWorkspaceManager = vitest_1.vi.fn();
vitest_1.vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        isCurrentWorkspaceManager: mockIsCurrentWorkspaceManager(),
    }),
}));
// Mock toast context
const mockNotify = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    useToastContext: () => ({
        notify: mockNotify,
    }),
}));
// Mock openOAuthPopup
vitest_1.vi.mock('@/hooks/use-oauth', () => ({
    openOAuthPopup: vitest_1.vi.fn(),
}));
// Mock service/use-triggers
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
// ==================== Test Utilities ====================
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
// Factory functions for test data
const createPluginPayload = (overrides = {}) => ({
    category: types_1.AuthCategory.tool,
    provider: 'test-provider',
    ...overrides,
});
const createCredential = (overrides = {}) => ({
    id: 'test-credential-id',
    name: 'Test Credential',
    provider: 'test-provider',
    credential_type: types_1.CredentialTypeEnum.API_KEY,
    is_default: false,
    credentials: { api_key: 'test-key' },
    ...overrides,
});
const createCredentialList = (count, overrides = []) => {
    return Array.from({ length: count }, (_, i) => createCredential({
        id: `credential-${i}`,
        name: `Credential ${i}`,
        is_default: i === 0,
        ...overrides[i],
    }));
};
// ==================== Index Exports Tests ====================
(0, vitest_1.describe)('Index Exports', () => {
    (0, vitest_1.it)('should export all required components and hooks', async () => {
        const exports = await Promise.resolve().then(() => require('./index'));
        (0, vitest_1.expect)(exports.AddApiKeyButton).toBeDefined();
        (0, vitest_1.expect)(exports.AddOAuthButton).toBeDefined();
        (0, vitest_1.expect)(exports.ApiKeyModal).toBeDefined();
        (0, vitest_1.expect)(exports.Authorized).toBeDefined();
        (0, vitest_1.expect)(exports.AuthorizedInDataSourceNode).toBeDefined();
        (0, vitest_1.expect)(exports.AuthorizedInNode).toBeDefined();
        (0, vitest_1.expect)(exports.usePluginAuth).toBeDefined();
        (0, vitest_1.expect)(exports.PluginAuth).toBeDefined();
        (0, vitest_1.expect)(exports.PluginAuthInAgent).toBeDefined();
        (0, vitest_1.expect)(exports.PluginAuthInDataSourceNode).toBeDefined();
    });
    (0, vitest_1.it)('should export AuthCategory enum', async () => {
        const exports = await Promise.resolve().then(() => require('./index'));
        (0, vitest_1.expect)(exports.AuthCategory).toBeDefined();
        (0, vitest_1.expect)(exports.AuthCategory.tool).toBe('tool');
        (0, vitest_1.expect)(exports.AuthCategory.datasource).toBe('datasource');
        (0, vitest_1.expect)(exports.AuthCategory.model).toBe('model');
        (0, vitest_1.expect)(exports.AuthCategory.trigger).toBe('trigger');
    });
    (0, vitest_1.it)('should export CredentialTypeEnum', async () => {
        const exports = await Promise.resolve().then(() => require('./index'));
        (0, vitest_1.expect)(exports.CredentialTypeEnum).toBeDefined();
        (0, vitest_1.expect)(exports.CredentialTypeEnum.OAUTH2).toBe('oauth2');
        (0, vitest_1.expect)(exports.CredentialTypeEnum.API_KEY).toBe('api-key');
    });
});
// ==================== Types Tests ====================
(0, vitest_1.describe)('Types', () => {
    (0, vitest_1.describe)('AuthCategory enum', () => {
        (0, vitest_1.it)('should have correct values', () => {
            (0, vitest_1.expect)(types_1.AuthCategory.tool).toBe('tool');
            (0, vitest_1.expect)(types_1.AuthCategory.datasource).toBe('datasource');
            (0, vitest_1.expect)(types_1.AuthCategory.model).toBe('model');
            (0, vitest_1.expect)(types_1.AuthCategory.trigger).toBe('trigger');
        });
        (0, vitest_1.it)('should have exactly 4 categories', () => {
            const values = Object.values(types_1.AuthCategory);
            (0, vitest_1.expect)(values).toHaveLength(4);
        });
    });
    (0, vitest_1.describe)('CredentialTypeEnum', () => {
        (0, vitest_1.it)('should have correct values', () => {
            (0, vitest_1.expect)(types_1.CredentialTypeEnum.OAUTH2).toBe('oauth2');
            (0, vitest_1.expect)(types_1.CredentialTypeEnum.API_KEY).toBe('api-key');
        });
        (0, vitest_1.it)('should have exactly 2 types', () => {
            const values = Object.values(types_1.CredentialTypeEnum);
            (0, vitest_1.expect)(values).toHaveLength(2);
        });
    });
    (0, vitest_1.describe)('Credential type', () => {
        (0, vitest_1.it)('should allow creating valid credentials', () => {
            const credential = {
                id: 'test-id',
                name: 'Test',
                provider: 'test-provider',
                is_default: true,
            };
            (0, vitest_1.expect)(credential.id).toBe('test-id');
            (0, vitest_1.expect)(credential.is_default).toBe(true);
        });
        (0, vitest_1.it)('should allow optional fields', () => {
            const credential = {
                id: 'test-id',
                name: 'Test',
                provider: 'test-provider',
                is_default: false,
                credential_type: types_1.CredentialTypeEnum.API_KEY,
                credentials: { key: 'value' },
                isWorkspaceDefault: true,
                from_enterprise: false,
                not_allowed_to_use: false,
            };
            (0, vitest_1.expect)(credential.credential_type).toBe(types_1.CredentialTypeEnum.API_KEY);
            (0, vitest_1.expect)(credential.isWorkspaceDefault).toBe(true);
        });
    });
    (0, vitest_1.describe)('PluginPayload type', () => {
        (0, vitest_1.it)('should allow creating valid plugin payload', () => {
            const payload = {
                category: types_1.AuthCategory.tool,
                provider: 'test-provider',
            };
            (0, vitest_1.expect)(payload.category).toBe(types_1.AuthCategory.tool);
        });
        (0, vitest_1.it)('should allow optional fields', () => {
            const payload = {
                category: types_1.AuthCategory.datasource,
                provider: 'test-provider',
                providerType: 'builtin',
                detail: undefined,
            };
            (0, vitest_1.expect)(payload.providerType).toBe('builtin');
        });
    });
});
// ==================== Utils Tests ====================
(0, vitest_1.describe)('Utils', () => {
    (0, vitest_1.describe)('transformFormSchemasSecretInput', () => {
        (0, vitest_1.it)('should transform secret input values to hidden format', async () => {
            const { transformFormSchemasSecretInput } = await Promise.resolve().then(() => require('./utils'));
            const secretNames = ['api_key', 'secret_token'];
            const values = {
                api_key: 'actual-key',
                secret_token: 'actual-token',
                public_key: 'public-value',
            };
            const result = transformFormSchemasSecretInput(secretNames, values);
            (0, vitest_1.expect)(result.api_key).toBe('[__HIDDEN__]');
            (0, vitest_1.expect)(result.secret_token).toBe('[__HIDDEN__]');
            (0, vitest_1.expect)(result.public_key).toBe('public-value');
        });
        (0, vitest_1.it)('should not transform empty secret values', async () => {
            const { transformFormSchemasSecretInput } = await Promise.resolve().then(() => require('./utils'));
            const secretNames = ['api_key'];
            const values = {
                api_key: '',
                public_key: 'public-value',
            };
            const result = transformFormSchemasSecretInput(secretNames, values);
            (0, vitest_1.expect)(result.api_key).toBe('');
            (0, vitest_1.expect)(result.public_key).toBe('public-value');
        });
        (0, vitest_1.it)('should not transform undefined secret values', async () => {
            const { transformFormSchemasSecretInput } = await Promise.resolve().then(() => require('./utils'));
            const secretNames = ['api_key'];
            const values = {
                public_key: 'public-value',
            };
            const result = transformFormSchemasSecretInput(secretNames, values);
            (0, vitest_1.expect)(result.api_key).toBeUndefined();
            (0, vitest_1.expect)(result.public_key).toBe('public-value');
        });
        (0, vitest_1.it)('should handle empty secret names array', async () => {
            const { transformFormSchemasSecretInput } = await Promise.resolve().then(() => require('./utils'));
            const secretNames = [];
            const values = {
                api_key: 'actual-key',
                public_key: 'public-value',
            };
            const result = transformFormSchemasSecretInput(secretNames, values);
            (0, vitest_1.expect)(result.api_key).toBe('actual-key');
            (0, vitest_1.expect)(result.public_key).toBe('public-value');
        });
        (0, vitest_1.it)('should handle empty values object', async () => {
            const { transformFormSchemasSecretInput } = await Promise.resolve().then(() => require('./utils'));
            const secretNames = ['api_key'];
            const values = {};
            const result = transformFormSchemasSecretInput(secretNames, values);
            (0, vitest_1.expect)(Object.keys(result)).toHaveLength(0);
        });
        (0, vitest_1.it)('should preserve original values object immutably', async () => {
            const { transformFormSchemasSecretInput } = await Promise.resolve().then(() => require('./utils'));
            const secretNames = ['api_key'];
            const values = {
                api_key: 'actual-key',
                public_key: 'public-value',
            };
            transformFormSchemasSecretInput(secretNames, values);
            (0, vitest_1.expect)(values.api_key).toBe('actual-key');
        });
        (0, vitest_1.it)('should handle null-ish values correctly', async () => {
            const { transformFormSchemasSecretInput } = await Promise.resolve().then(() => require('./utils'));
            const secretNames = ['api_key', 'null_key'];
            const values = {
                api_key: null,
                null_key: 0,
            };
            const result = transformFormSchemasSecretInput(secretNames, values);
            // null is preserved as-is to represent an explicitly unset secret, not masked as [__HIDDEN__]
            (0, vitest_1.expect)(result.api_key).toBe(null);
            // numeric values like 0 are also preserved; only non-empty string secrets are transformed
            (0, vitest_1.expect)(result.null_key).toBe(0);
        });
    });
});
// ==================== useGetApi Hook Tests ====================
(0, vitest_1.describe)('useGetApi Hook', () => {
    (0, vitest_1.describe)('tool category', () => {
        (0, vitest_1.it)('should return correct API endpoints for tool category', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                category: types_1.AuthCategory.tool,
                provider: 'test-tool',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialInfo).toBe('/workspaces/current/tool-provider/builtin/test-tool/credential/info');
            (0, vitest_1.expect)(apiMap.setDefaultCredential).toBe('/workspaces/current/tool-provider/builtin/test-tool/default-credential');
            (0, vitest_1.expect)(apiMap.getCredentials).toBe('/workspaces/current/tool-provider/builtin/test-tool/credentials');
            (0, vitest_1.expect)(apiMap.addCredential).toBe('/workspaces/current/tool-provider/builtin/test-tool/add');
            (0, vitest_1.expect)(apiMap.updateCredential).toBe('/workspaces/current/tool-provider/builtin/test-tool/update');
            (0, vitest_1.expect)(apiMap.deleteCredential).toBe('/workspaces/current/tool-provider/builtin/test-tool/delete');
            (0, vitest_1.expect)(apiMap.getOauthUrl).toBe('/oauth/plugin/test-tool/tool/authorization-url');
            (0, vitest_1.expect)(apiMap.getOauthClientSchema).toBe('/workspaces/current/tool-provider/builtin/test-tool/oauth/client-schema');
            (0, vitest_1.expect)(apiMap.setCustomOauthClient).toBe('/workspaces/current/tool-provider/builtin/test-tool/oauth/custom-client');
            (0, vitest_1.expect)(apiMap.deleteCustomOAuthClient).toBe('/workspaces/current/tool-provider/builtin/test-tool/oauth/custom-client');
        });
        (0, vitest_1.it)('should return getCredentialSchema function for tool category', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                category: types_1.AuthCategory.tool,
                provider: 'test-tool',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialSchema(types_1.CredentialTypeEnum.API_KEY)).toBe('/workspaces/current/tool-provider/builtin/test-tool/credential/schema/api-key');
            (0, vitest_1.expect)(apiMap.getCredentialSchema(types_1.CredentialTypeEnum.OAUTH2)).toBe('/workspaces/current/tool-provider/builtin/test-tool/credential/schema/oauth2');
        });
    });
    (0, vitest_1.describe)('datasource category', () => {
        (0, vitest_1.it)('should return correct API endpoints for datasource category', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                category: types_1.AuthCategory.datasource,
                provider: 'test-datasource',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialInfo).toBe('');
            (0, vitest_1.expect)(apiMap.setDefaultCredential).toBe('/auth/plugin/datasource/test-datasource/default');
            (0, vitest_1.expect)(apiMap.getCredentials).toBe('/auth/plugin/datasource/test-datasource');
            (0, vitest_1.expect)(apiMap.addCredential).toBe('/auth/plugin/datasource/test-datasource');
            (0, vitest_1.expect)(apiMap.updateCredential).toBe('/auth/plugin/datasource/test-datasource/update');
            (0, vitest_1.expect)(apiMap.deleteCredential).toBe('/auth/plugin/datasource/test-datasource/delete');
            (0, vitest_1.expect)(apiMap.getOauthUrl).toBe('/oauth/plugin/test-datasource/datasource/get-authorization-url');
            (0, vitest_1.expect)(apiMap.getOauthClientSchema).toBe('');
            (0, vitest_1.expect)(apiMap.setCustomOauthClient).toBe('/auth/plugin/datasource/test-datasource/custom-client');
            (0, vitest_1.expect)(apiMap.deleteCustomOAuthClient).toBe('/auth/plugin/datasource/test-datasource/custom-client');
        });
        (0, vitest_1.it)('should return empty string for getCredentialSchema in datasource', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                category: types_1.AuthCategory.datasource,
                provider: 'test-datasource',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialSchema(types_1.CredentialTypeEnum.API_KEY)).toBe('');
        });
    });
    (0, vitest_1.describe)('other categories', () => {
        (0, vitest_1.it)('should return empty strings for model category', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                category: types_1.AuthCategory.model,
                provider: 'test-model',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialInfo).toBe('');
            (0, vitest_1.expect)(apiMap.setDefaultCredential).toBe('');
            (0, vitest_1.expect)(apiMap.getCredentials).toBe('');
            (0, vitest_1.expect)(apiMap.addCredential).toBe('');
            (0, vitest_1.expect)(apiMap.updateCredential).toBe('');
            (0, vitest_1.expect)(apiMap.deleteCredential).toBe('');
            (0, vitest_1.expect)(apiMap.getCredentialSchema(types_1.CredentialTypeEnum.API_KEY)).toBe('');
        });
        (0, vitest_1.it)('should return empty strings for trigger category', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                category: types_1.AuthCategory.trigger,
                provider: 'test-trigger',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialInfo).toBe('');
            (0, vitest_1.expect)(apiMap.setDefaultCredential).toBe('');
        });
    });
    (0, vitest_1.describe)('edge cases', () => {
        (0, vitest_1.it)('should handle empty provider', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                category: types_1.AuthCategory.tool,
                provider: '',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialInfo).toBe('/workspaces/current/tool-provider/builtin//credential/info');
        });
        (0, vitest_1.it)('should handle special characters in provider name', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                category: types_1.AuthCategory.tool,
                provider: 'test-provider_v2',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialInfo).toContain('test-provider_v2');
        });
    });
});
// ==================== usePluginAuth Hook Tests ====================
(0, vitest_1.describe)('usePluginAuth Hook', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockIsCurrentWorkspaceManager.mockReturnValue(true);
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [],
            allow_custom_token: true,
        });
    });
    (0, vitest_1.it)('should return isAuthorized false when no credentials', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.isAuthorized).toBe(false);
        (0, vitest_1.expect)(result.current.credentials).toHaveLength(0);
    });
    (0, vitest_1.it)('should return isAuthorized true when credentials exist', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [createCredential()],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.isAuthorized).toBe(true);
        (0, vitest_1.expect)(result.current.credentials).toHaveLength(1);
    });
    (0, vitest_1.it)('should return canOAuth true when oauth2 is supported', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [types_1.CredentialTypeEnum.OAUTH2],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.canOAuth).toBe(true);
        (0, vitest_1.expect)(result.current.canApiKey).toBe(false);
    });
    (0, vitest_1.it)('should return canApiKey true when api-key is supported', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.canOAuth).toBe(false);
        (0, vitest_1.expect)(result.current.canApiKey).toBe(true);
    });
    (0, vitest_1.it)('should return both canOAuth and canApiKey when both supported', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [types_1.CredentialTypeEnum.OAUTH2, types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.canOAuth).toBe(true);
        (0, vitest_1.expect)(result.current.canApiKey).toBe(true);
    });
    (0, vitest_1.it)('should return disabled true when user is not workspace manager', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        mockIsCurrentWorkspaceManager.mockReturnValue(false);
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.disabled).toBe(true);
    });
    (0, vitest_1.it)('should return disabled false when user is workspace manager', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        mockIsCurrentWorkspaceManager.mockReturnValue(true);
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.disabled).toBe(false);
    });
    (0, vitest_1.it)('should return notAllowCustomCredential based on allow_custom_token', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [],
            allow_custom_token: false,
        });
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.notAllowCustomCredential).toBe(true);
    });
    (0, vitest_1.it)('should return invalidPluginCredentialInfo function', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(typeof result.current.invalidPluginCredentialInfo).toBe('function');
    });
    (0, vitest_1.it)('should not fetch when enable is false', async () => {
        const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, false), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.isAuthorized).toBe(false);
        (0, vitest_1.expect)(result.current.credentials).toHaveLength(0);
    });
});
// ==================== usePluginAuthAction Hook Tests ====================
(0, vitest_1.describe)('usePluginAuthAction Hook', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockDeletePluginCredential.mockResolvedValue({});
        mockSetPluginDefaultCredential.mockResolvedValue({});
        mockUpdatePluginCredential.mockResolvedValue({});
    });
    (0, vitest_1.it)('should return all action handlers', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
            wrapper: createWrapper(),
        });
        (0, vitest_1.expect)(result.current.doingAction).toBe(false);
        (0, vitest_1.expect)(typeof result.current.handleSetDoingAction).toBe('function');
        (0, vitest_1.expect)(typeof result.current.openConfirm).toBe('function');
        (0, vitest_1.expect)(typeof result.current.closeConfirm).toBe('function');
        (0, vitest_1.expect)(result.current.deleteCredentialId).toBe(null);
        (0, vitest_1.expect)(typeof result.current.setDeleteCredentialId).toBe('function');
        (0, vitest_1.expect)(typeof result.current.handleConfirm).toBe('function');
        (0, vitest_1.expect)(result.current.editValues).toBe(null);
        (0, vitest_1.expect)(typeof result.current.setEditValues).toBe('function');
        (0, vitest_1.expect)(typeof result.current.handleEdit).toBe('function');
        (0, vitest_1.expect)(typeof result.current.handleRemove).toBe('function');
        (0, vitest_1.expect)(typeof result.current.handleSetDefault).toBe('function');
        (0, vitest_1.expect)(typeof result.current.handleRename).toBe('function');
    });
    (0, vitest_1.it)('should open and close confirm dialog', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
            wrapper: createWrapper(),
        });
        (0, react_1.act)(() => {
            result.current.openConfirm('test-credential-id');
        });
        (0, vitest_1.expect)(result.current.deleteCredentialId).toBe('test-credential-id');
        (0, react_1.act)(() => {
            result.current.closeConfirm();
        });
        (0, vitest_1.expect)(result.current.deleteCredentialId).toBe(null);
    });
    (0, vitest_1.it)('should handle edit with values', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
            wrapper: createWrapper(),
        });
        const editValues = { key: 'value' };
        (0, react_1.act)(() => {
            result.current.handleEdit('test-id', editValues);
        });
        (0, vitest_1.expect)(result.current.editValues).toEqual(editValues);
    });
    (0, vitest_1.it)('should handle confirm delete', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const onUpdate = vitest_1.vi.fn();
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload, onUpdate), {
            wrapper: createWrapper(),
        });
        (0, react_1.act)(() => {
            result.current.openConfirm('test-credential-id');
        });
        await (0, react_1.act)(async () => {
            await result.current.handleConfirm();
        });
        (0, vitest_1.expect)(mockDeletePluginCredential).toHaveBeenCalledWith({ credential_id: 'test-credential-id' });
        (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
            type: 'success',
            message: 'common.api.actionSuccess',
        });
        (0, vitest_1.expect)(onUpdate).toHaveBeenCalled();
        (0, vitest_1.expect)(result.current.deleteCredentialId).toBe(null);
    });
    (0, vitest_1.it)('should not confirm delete when no credential id', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
            wrapper: createWrapper(),
        });
        await (0, react_1.act)(async () => {
            await result.current.handleConfirm();
        });
        (0, vitest_1.expect)(mockDeletePluginCredential).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should handle set default', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const onUpdate = vitest_1.vi.fn();
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload, onUpdate), {
            wrapper: createWrapper(),
        });
        await (0, react_1.act)(async () => {
            await result.current.handleSetDefault('test-credential-id');
        });
        (0, vitest_1.expect)(mockSetPluginDefaultCredential).toHaveBeenCalledWith('test-credential-id');
        (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
            type: 'success',
            message: 'common.api.actionSuccess',
        });
        (0, vitest_1.expect)(onUpdate).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should handle rename', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const onUpdate = vitest_1.vi.fn();
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload, onUpdate), {
            wrapper: createWrapper(),
        });
        await (0, react_1.act)(async () => {
            await result.current.handleRename({
                credential_id: 'test-credential-id',
                name: 'New Name',
            });
        });
        (0, vitest_1.expect)(mockUpdatePluginCredential).toHaveBeenCalledWith({
            credential_id: 'test-credential-id',
            name: 'New Name',
        });
        (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
            type: 'success',
            message: 'common.api.actionSuccess',
        });
        (0, vitest_1.expect)(onUpdate).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should prevent concurrent actions', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
            wrapper: createWrapper(),
        });
        (0, react_1.act)(() => {
            result.current.handleSetDoingAction(true);
        });
        (0, react_1.act)(() => {
            result.current.openConfirm('test-credential-id');
        });
        await (0, react_1.act)(async () => {
            await result.current.handleConfirm();
        });
        // Should not call delete when already doing action
        (0, vitest_1.expect)(mockDeletePluginCredential).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should handle remove after edit', async () => {
        const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
        const pluginPayload = createPluginPayload();
        const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
            wrapper: createWrapper(),
        });
        (0, react_1.act)(() => {
            result.current.handleEdit('test-credential-id', { key: 'value' });
        });
        (0, react_1.act)(() => {
            result.current.handleRemove();
        });
        (0, vitest_1.expect)(result.current.deleteCredentialId).toBe('test-credential-id');
    });
});
// ==================== PluginAuth Component Tests ====================
(0, vitest_1.describe)('PluginAuth Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockIsCurrentWorkspaceManager.mockReturnValue(true);
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        mockGetPluginOAuthClientSchema.mockReturnValue({
            schema: [],
            is_oauth_custom_client_enabled: false,
            is_system_oauth_params_exists: false,
        });
    });
    (0, vitest_1.it)('should render Authorize when not authorized', async () => {
        const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
        // Should render authorize button
        (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should render Authorized when authorized and no children', async () => {
        const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [createCredential()],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
        // Should render authorized content
        (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should render children when authorized and children provided', async () => {
        const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [createCredential()],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload}>
        <div data-testid="custom-children">Custom Content</div>
      </PluginAuth>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(react_1.screen.getByTestId('custom-children')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('Custom Content')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should apply className when not authorized', async () => {
        const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
        const pluginPayload = createPluginPayload();
        const { container } = (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload} className="custom-class"/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(container.firstChild).toHaveClass('custom-class');
    });
    (0, vitest_1.it)('should not apply className when authorized', async () => {
        const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [createCredential()],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        const { container } = (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload} className="custom-class"/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(container.firstChild).not.toHaveClass('custom-class');
    });
    (0, vitest_1.it)('should be memoized', async () => {
        const PluginAuthModule = await Promise.resolve().then(() => require('./plugin-auth'));
        (0, vitest_1.expect)(typeof PluginAuthModule.default).toBe('object');
    });
});
// ==================== PluginAuthInAgent Component Tests ====================
(0, vitest_1.describe)('PluginAuthInAgent Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockIsCurrentWorkspaceManager.mockReturnValue(true);
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [createCredential()],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        mockGetPluginOAuthClientSchema.mockReturnValue({
            schema: [],
            is_oauth_custom_client_enabled: false,
            is_system_oauth_params_exists: false,
        });
    });
    (0, vitest_1.it)('should render Authorize when not authorized', async () => {
        const PluginAuthInAgent = (await Promise.resolve().then(() => require('./plugin-auth-in-agent'))).default;
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuthInAgent pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should render Authorized with workspace default when authorized', async () => {
        const PluginAuthInAgent = (await Promise.resolve().then(() => require('./plugin-auth-in-agent'))).default;
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuthInAgent pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.workspaceDefault')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should show credential name when credentialId is provided', async () => {
        const PluginAuthInAgent = (await Promise.resolve().then(() => require('./plugin-auth-in-agent'))).default;
        const credential = createCredential({ id: 'selected-id', name: 'Selected Credential' });
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [credential],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuthInAgent pluginPayload={pluginPayload} credentialId="selected-id"/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(react_1.screen.getByText('Selected Credential')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should show auth removed when credential not found', async () => {
        const PluginAuthInAgent = (await Promise.resolve().then(() => require('./plugin-auth-in-agent'))).default;
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [createCredential()],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuthInAgent pluginPayload={pluginPayload} credentialId="non-existent-id"/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.authRemoved')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should show unavailable when credential is not allowed to use', async () => {
        const PluginAuthInAgent = (await Promise.resolve().then(() => require('./plugin-auth-in-agent'))).default;
        const credential = createCredential({
            id: 'unavailable-id',
            name: 'Unavailable Credential',
            not_allowed_to_use: true,
            from_enterprise: false,
        });
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [credential],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuthInAgent pluginPayload={pluginPayload} credentialId="unavailable-id"/>, { wrapper: createWrapper() });
        // Check that button text contains unavailable
        const button = react_1.screen.getByRole('button');
        (0, vitest_1.expect)(button.textContent).toContain('plugin.auth.unavailable');
    });
    (0, vitest_1.it)('should call onAuthorizationItemClick when item is clicked', async () => {
        const PluginAuthInAgent = (await Promise.resolve().then(() => require('./plugin-auth-in-agent'))).default;
        const onAuthorizationItemClick = vitest_1.vi.fn();
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuthInAgent pluginPayload={pluginPayload} onAuthorizationItemClick={onAuthorizationItemClick}/>, { wrapper: createWrapper() });
        // Click to open popup
        const buttons = react_1.screen.getAllByRole('button');
        react_1.fireEvent.click(buttons[0]);
        // Verify popup is opened (there will be multiple buttons after opening)
        (0, vitest_1.expect)(react_1.screen.getAllByRole('button').length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should trigger handleAuthorizationItemClick and close popup when authorization item is clicked', async () => {
        const PluginAuthInAgent = (await Promise.resolve().then(() => require('./plugin-auth-in-agent'))).default;
        const onAuthorizationItemClick = vitest_1.vi.fn();
        const credential = createCredential({ id: 'test-cred-id', name: 'Test Credential' });
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [credential],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuthInAgent pluginPayload={pluginPayload} onAuthorizationItemClick={onAuthorizationItemClick}/>, { wrapper: createWrapper() });
        // Click trigger button to open popup
        const triggerButton = react_1.screen.getByRole('button');
        react_1.fireEvent.click(triggerButton);
        // Find and click the workspace default item in the dropdown
        // There will be multiple elements with this text, we need the one in the popup (not the trigger)
        const workspaceDefaultItems = react_1.screen.getAllByText('plugin.auth.workspaceDefault');
        // The second one is in the popup list (first one is the trigger button)
        const popupItem = workspaceDefaultItems.length > 1 ? workspaceDefaultItems[1] : workspaceDefaultItems[0];
        react_1.fireEvent.click(popupItem);
        // Verify onAuthorizationItemClick was called with empty string for workspace default
        (0, vitest_1.expect)(onAuthorizationItemClick).toHaveBeenCalledWith('');
    });
    (0, vitest_1.it)('should call onAuthorizationItemClick with credential id when specific credential is clicked', async () => {
        const PluginAuthInAgent = (await Promise.resolve().then(() => require('./plugin-auth-in-agent'))).default;
        const onAuthorizationItemClick = vitest_1.vi.fn();
        const credential = createCredential({
            id: 'specific-cred-id',
            name: 'Specific Credential',
            credential_type: types_1.CredentialTypeEnum.API_KEY,
        });
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [credential],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<PluginAuthInAgent pluginPayload={pluginPayload} onAuthorizationItemClick={onAuthorizationItemClick}/>, { wrapper: createWrapper() });
        // Click trigger button to open popup
        const triggerButton = react_1.screen.getByRole('button');
        react_1.fireEvent.click(triggerButton);
        // Find and click the specific credential item - there might be multiple "Specific Credential" texts
        const credentialItems = react_1.screen.getAllByText('Specific Credential');
        // Click the one in the popup (usually the last one if trigger shows different text)
        const popupItem = credentialItems[credentialItems.length - 1];
        react_1.fireEvent.click(popupItem);
        // Verify onAuthorizationItemClick was called with the credential id
        (0, vitest_1.expect)(onAuthorizationItemClick).toHaveBeenCalledWith('specific-cred-id');
    });
    (0, vitest_1.it)('should be memoized', async () => {
        const PluginAuthInAgentModule = await Promise.resolve().then(() => require('./plugin-auth-in-agent'));
        (0, vitest_1.expect)(typeof PluginAuthInAgentModule.default).toBe('object');
    });
});
// ==================== PluginAuthInDataSourceNode Component Tests ====================
(0, vitest_1.describe)('PluginAuthInDataSourceNode Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should render connect button when not authorized', async () => {
        const PluginAuthInDataSourceNode = (await Promise.resolve().then(() => require('./plugin-auth-in-datasource-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<PluginAuthInDataSourceNode isAuthorized={false} onJumpToDataSourcePage={onJumpToDataSourcePage}/>);
        const button = react_1.screen.getByRole('button');
        (0, vitest_1.expect)(button).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('common.integrations.connect')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should call onJumpToDataSourcePage when connect button is clicked', async () => {
        const PluginAuthInDataSourceNode = (await Promise.resolve().then(() => require('./plugin-auth-in-datasource-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<PluginAuthInDataSourceNode isAuthorized={false} onJumpToDataSourcePage={onJumpToDataSourcePage}/>);
        react_1.fireEvent.click(react_1.screen.getByRole('button'));
        (0, vitest_1.expect)(onJumpToDataSourcePage).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)('should render children when authorized', async () => {
        const PluginAuthInDataSourceNode = (await Promise.resolve().then(() => require('./plugin-auth-in-datasource-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<PluginAuthInDataSourceNode isAuthorized={true} onJumpToDataSourcePage={onJumpToDataSourcePage}>
        <div data-testid="children-content">Authorized Content</div>
      </PluginAuthInDataSourceNode>);
        (0, vitest_1.expect)(react_1.screen.getByTestId('children-content')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('Authorized Content')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.queryByRole('button')).not.toBeInTheDocument();
    });
    (0, vitest_1.it)('should not render connect button when authorized', async () => {
        const PluginAuthInDataSourceNode = (await Promise.resolve().then(() => require('./plugin-auth-in-datasource-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<PluginAuthInDataSourceNode isAuthorized={true} onJumpToDataSourcePage={onJumpToDataSourcePage}/>);
        (0, vitest_1.expect)(react_1.screen.queryByRole('button')).not.toBeInTheDocument();
    });
    (0, vitest_1.it)('should not render children when not authorized', async () => {
        const PluginAuthInDataSourceNode = (await Promise.resolve().then(() => require('./plugin-auth-in-datasource-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<PluginAuthInDataSourceNode isAuthorized={false} onJumpToDataSourcePage={onJumpToDataSourcePage}>
        <div data-testid="children-content">Authorized Content</div>
      </PluginAuthInDataSourceNode>);
        (0, vitest_1.expect)(react_1.screen.queryByTestId('children-content')).not.toBeInTheDocument();
    });
    (0, vitest_1.it)('should handle undefined isAuthorized (falsy)', async () => {
        const PluginAuthInDataSourceNode = (await Promise.resolve().then(() => require('./plugin-auth-in-datasource-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<PluginAuthInDataSourceNode onJumpToDataSourcePage={onJumpToDataSourcePage}>
        <div data-testid="children-content">Content</div>
      </PluginAuthInDataSourceNode>);
        // isAuthorized is undefined, which is falsy, so connect button should be shown
        (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.queryByTestId('children-content')).not.toBeInTheDocument();
    });
    (0, vitest_1.it)('should be memoized', async () => {
        const PluginAuthInDataSourceNodeModule = await Promise.resolve().then(() => require('./plugin-auth-in-datasource-node'));
        (0, vitest_1.expect)(typeof PluginAuthInDataSourceNodeModule.default).toBe('object');
    });
});
// ==================== AuthorizedInDataSourceNode Component Tests ====================
(0, vitest_1.describe)('AuthorizedInDataSourceNode Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should render with singular authorization text when authorizationsNum is 1', async () => {
        const AuthorizedInDataSourceNode = (await Promise.resolve().then(() => require('./authorized-in-data-source-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<AuthorizedInDataSourceNode authorizationsNum={1} onJumpToDataSourcePage={onJumpToDataSourcePage}/>);
        (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.authorization')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should render with plural authorizations text when authorizationsNum > 1', async () => {
        const AuthorizedInDataSourceNode = (await Promise.resolve().then(() => require('./authorized-in-data-source-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<AuthorizedInDataSourceNode authorizationsNum={3} onJumpToDataSourcePage={onJumpToDataSourcePage}/>);
        (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.authorizations')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should call onJumpToDataSourcePage when button is clicked', async () => {
        const AuthorizedInDataSourceNode = (await Promise.resolve().then(() => require('./authorized-in-data-source-node'))).default;
        const onJumpToDataSourcePage = vitest_1.vi.fn();
        (0, react_1.render)(<AuthorizedInDataSourceNode authorizationsNum={1} onJumpToDataSourcePage={onJumpToDataSourcePage}/>);
        react_1.fireEvent.click(react_1.screen.getByRole('button'));
        (0, vitest_1.expect)(onJumpToDataSourcePage).toHaveBeenCalledTimes(1);
    });
    (0, vitest_1.it)('should render with green indicator', async () => {
        const AuthorizedInDataSourceNode = (await Promise.resolve().then(() => require('./authorized-in-data-source-node'))).default;
        const { container } = (0, react_1.render)(<AuthorizedInDataSourceNode authorizationsNum={1} onJumpToDataSourcePage={vitest_1.vi.fn()}/>);
        // Check that indicator component is rendered
        (0, vitest_1.expect)(container.querySelector('.mr-1\\.5')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should handle authorizationsNum of 0', async () => {
        const AuthorizedInDataSourceNode = (await Promise.resolve().then(() => require('./authorized-in-data-source-node'))).default;
        (0, react_1.render)(<AuthorizedInDataSourceNode authorizationsNum={0} onJumpToDataSourcePage={vitest_1.vi.fn()}/>);
        // 0 is not > 1, so should show singular
        (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.authorization')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should be memoized', async () => {
        const AuthorizedInDataSourceNodeModule = await Promise.resolve().then(() => require('./authorized-in-data-source-node'));
        (0, vitest_1.expect)(typeof AuthorizedInDataSourceNodeModule.default).toBe('object');
    });
});
// ==================== AuthorizedInNode Component Tests ====================
(0, vitest_1.describe)('AuthorizedInNode Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockIsCurrentWorkspaceManager.mockReturnValue(true);
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [createCredential({ is_default: true })],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        mockGetPluginOAuthClientSchema.mockReturnValue({
            schema: [],
            is_oauth_custom_client_enabled: false,
            is_system_oauth_params_exists: false,
        });
    });
    (0, vitest_1.it)('should render with workspace default when no credentialId', async () => {
        const AuthorizedInNode = (await Promise.resolve().then(() => require('./authorized-in-node'))).default;
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<AuthorizedInNode pluginPayload={pluginPayload} onAuthorizationItemClick={vitest_1.vi.fn()}/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.workspaceDefault')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should render credential name when credentialId matches', async () => {
        const AuthorizedInNode = (await Promise.resolve().then(() => require('./authorized-in-node'))).default;
        const credential = createCredential({ id: 'selected-id', name: 'My Credential' });
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [credential],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<AuthorizedInNode pluginPayload={pluginPayload} onAuthorizationItemClick={vitest_1.vi.fn()} credentialId="selected-id"/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(react_1.screen.getByText('My Credential')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should show auth removed when credentialId not found', async () => {
        const AuthorizedInNode = (await Promise.resolve().then(() => require('./authorized-in-node'))).default;
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [createCredential()],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<AuthorizedInNode pluginPayload={pluginPayload} onAuthorizationItemClick={vitest_1.vi.fn()} credentialId="non-existent"/>, { wrapper: createWrapper() });
        (0, vitest_1.expect)(react_1.screen.getByText('plugin.auth.authRemoved')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should show unavailable when credential is not allowed', async () => {
        const AuthorizedInNode = (await Promise.resolve().then(() => require('./authorized-in-node'))).default;
        const credential = createCredential({
            id: 'unavailable-id',
            not_allowed_to_use: true,
            from_enterprise: false,
        });
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [credential],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<AuthorizedInNode pluginPayload={pluginPayload} onAuthorizationItemClick={vitest_1.vi.fn()} credentialId="unavailable-id"/>, { wrapper: createWrapper() });
        // Check that button text contains unavailable
        const button = react_1.screen.getByRole('button');
        (0, vitest_1.expect)(button.textContent).toContain('plugin.auth.unavailable');
    });
    (0, vitest_1.it)('should show unavailable when default credential is not allowed', async () => {
        const AuthorizedInNode = (await Promise.resolve().then(() => require('./authorized-in-node'))).default;
        const credential = createCredential({
            is_default: true,
            not_allowed_to_use: true,
        });
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [credential],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<AuthorizedInNode pluginPayload={pluginPayload} onAuthorizationItemClick={vitest_1.vi.fn()}/>, { wrapper: createWrapper() });
        // Check that button text contains unavailable
        const button = react_1.screen.getByRole('button');
        (0, vitest_1.expect)(button.textContent).toContain('plugin.auth.unavailable');
    });
    (0, vitest_1.it)('should call onAuthorizationItemClick when clicking', async () => {
        const AuthorizedInNode = (await Promise.resolve().then(() => require('./authorized-in-node'))).default;
        const onAuthorizationItemClick = vitest_1.vi.fn();
        const pluginPayload = createPluginPayload();
        (0, react_1.render)(<AuthorizedInNode pluginPayload={pluginPayload} onAuthorizationItemClick={onAuthorizationItemClick}/>, { wrapper: createWrapper() });
        // Click to open the popup
        const buttons = react_1.screen.getAllByRole('button');
        react_1.fireEvent.click(buttons[0]);
        // The popup should be open now - there will be multiple buttons after opening
        (0, vitest_1.expect)(react_1.screen.getAllByRole('button').length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should be memoized', async () => {
        const AuthorizedInNodeModule = await Promise.resolve().then(() => require('./authorized-in-node'));
        (0, vitest_1.expect)(typeof AuthorizedInNodeModule.default).toBe('object');
    });
});
// ==================== useCredential Hooks Tests ====================
(0, vitest_1.describe)('useCredential Hooks', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [],
            allow_custom_token: true,
        });
    });
    (0, vitest_1.describe)('useGetPluginCredentialInfoHook', () => {
        (0, vitest_1.it)('should return credential info when enabled', async () => {
            const { useGetPluginCredentialInfoHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            mockGetPluginCredentialInfo.mockReturnValue({
                credentials: [createCredential()],
                supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
                allow_custom_token: true,
            });
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useGetPluginCredentialInfoHook(pluginPayload, true), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(result.current.data).toBeDefined();
            (0, vitest_1.expect)(result.current.data?.credentials).toHaveLength(1);
        });
        (0, vitest_1.it)('should not fetch when disabled', async () => {
            const { useGetPluginCredentialInfoHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useGetPluginCredentialInfoHook(pluginPayload, false), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(result.current.data).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('useDeletePluginCredentialHook', () => {
        (0, vitest_1.it)('should return mutateAsync function', async () => {
            const { useDeletePluginCredentialHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useDeletePluginCredentialHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(typeof result.current.mutateAsync).toBe('function');
        });
    });
    (0, vitest_1.describe)('useInvalidPluginCredentialInfoHook', () => {
        (0, vitest_1.it)('should return invalidation function that calls both invalidators', async () => {
            const { useInvalidPluginCredentialInfoHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload({ providerType: 'builtin' });
            const { result } = (0, react_1.renderHook)(() => useInvalidPluginCredentialInfoHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(typeof result.current).toBe('function');
            result.current();
            (0, vitest_1.expect)(mockInvalidPluginCredentialInfo).toHaveBeenCalled();
            (0, vitest_1.expect)(mockInvalidToolsByType).toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('useSetPluginDefaultCredentialHook', () => {
        (0, vitest_1.it)('should return mutateAsync function', async () => {
            const { useSetPluginDefaultCredentialHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useSetPluginDefaultCredentialHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(typeof result.current.mutateAsync).toBe('function');
        });
    });
    (0, vitest_1.describe)('useGetPluginCredentialSchemaHook', () => {
        (0, vitest_1.it)('should return schema data', async () => {
            const { useGetPluginCredentialSchemaHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            mockGetPluginCredentialSchema.mockReturnValue([{ name: 'api_key', type: 'string' }]);
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useGetPluginCredentialSchemaHook(pluginPayload, types_1.CredentialTypeEnum.API_KEY), { wrapper: createWrapper() });
            (0, vitest_1.expect)(result.current.data).toBeDefined();
        });
    });
    (0, vitest_1.describe)('useAddPluginCredentialHook', () => {
        (0, vitest_1.it)('should return mutateAsync function', async () => {
            const { useAddPluginCredentialHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useAddPluginCredentialHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(typeof result.current.mutateAsync).toBe('function');
        });
    });
    (0, vitest_1.describe)('useUpdatePluginCredentialHook', () => {
        (0, vitest_1.it)('should return mutateAsync function', async () => {
            const { useUpdatePluginCredentialHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useUpdatePluginCredentialHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(typeof result.current.mutateAsync).toBe('function');
        });
    });
    (0, vitest_1.describe)('useGetPluginOAuthUrlHook', () => {
        (0, vitest_1.it)('should return mutateAsync function', async () => {
            const { useGetPluginOAuthUrlHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useGetPluginOAuthUrlHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(typeof result.current.mutateAsync).toBe('function');
        });
    });
    (0, vitest_1.describe)('useGetPluginOAuthClientSchemaHook', () => {
        (0, vitest_1.it)('should return schema data', async () => {
            const { useGetPluginOAuthClientSchemaHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            mockGetPluginOAuthClientSchema.mockReturnValue({
                schema: [],
                is_oauth_custom_client_enabled: true,
            });
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useGetPluginOAuthClientSchemaHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(result.current.data).toBeDefined();
        });
    });
    (0, vitest_1.describe)('useSetPluginOAuthCustomClientHook', () => {
        (0, vitest_1.it)('should return mutateAsync function', async () => {
            const { useSetPluginOAuthCustomClientHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useSetPluginOAuthCustomClientHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(typeof result.current.mutateAsync).toBe('function');
        });
    });
    (0, vitest_1.describe)('useDeletePluginOAuthCustomClientHook', () => {
        (0, vitest_1.it)('should return mutateAsync function', async () => {
            const { useDeletePluginOAuthCustomClientHook } = await Promise.resolve().then(() => require('./hooks/use-credential'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => useDeletePluginOAuthCustomClientHook(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(typeof result.current.mutateAsync).toBe('function');
        });
    });
});
// ==================== Edge Cases and Error Handling ====================
(0, vitest_1.describe)('Edge Cases and Error Handling', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockIsCurrentWorkspaceManager.mockReturnValue(true);
        mockGetPluginCredentialInfo.mockReturnValue({
            credentials: [],
            supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
            allow_custom_token: true,
        });
        mockGetPluginOAuthClientSchema.mockReturnValue({
            schema: [],
            is_oauth_custom_client_enabled: false,
            is_system_oauth_params_exists: false,
        });
    });
    (0, vitest_1.describe)('PluginAuth edge cases', () => {
        (0, vitest_1.it)('should handle empty provider gracefully', async () => {
            const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
            const pluginPayload = createPluginPayload({ provider: '' });
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
        (0, vitest_1.it)('should handle tool and datasource auth categories with button', async () => {
            const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
            // Tool and datasource categories should render with API support
            const categoriesWithApi = [types_1.AuthCategory.tool];
            for (const category of categoriesWithApi) {
                const pluginPayload = createPluginPayload({ category });
                const { unmount } = (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
                (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
                unmount();
            }
        });
        (0, vitest_1.it)('should handle model and trigger categories without throwing', async () => {
            const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
            // Model and trigger categories have empty API endpoints, so they render without buttons
            const categoriesWithoutApi = [types_1.AuthCategory.model, types_1.AuthCategory.trigger];
            for (const category of categoriesWithoutApi) {
                const pluginPayload = createPluginPayload({ category });
                (0, vitest_1.expect)(() => {
                    const { unmount } = (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
                    unmount();
                }).not.toThrow();
            }
        });
        (0, vitest_1.it)('should handle undefined detail', async () => {
            const PluginAuth = (await Promise.resolve().then(() => require('./plugin-auth'))).default;
            const pluginPayload = createPluginPayload({ detail: undefined });
            (0, vitest_1.expect)(() => {
                (0, react_1.render)(<PluginAuth pluginPayload={pluginPayload}/>, { wrapper: createWrapper() });
            }).not.toThrow();
        });
    });
    (0, vitest_1.describe)('usePluginAuthAction error handling', () => {
        (0, vitest_1.it)('should handle delete error gracefully', async () => {
            const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
            mockDeletePluginCredential.mockRejectedValue(new Error('Delete failed'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
                wrapper: createWrapper(),
            });
            (0, react_1.act)(() => {
                result.current.openConfirm('test-id');
            });
            // Should not throw, error is caught
            await (0, vitest_1.expect)((0, react_1.act)(async () => {
                await result.current.handleConfirm();
            })).rejects.toThrow('Delete failed');
            // Action state should be reset
            (0, vitest_1.expect)(result.current.doingAction).toBe(false);
        });
        (0, vitest_1.it)('should handle set default error gracefully', async () => {
            const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
            mockSetPluginDefaultCredential.mockRejectedValue(new Error('Set default failed'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
                wrapper: createWrapper(),
            });
            await (0, vitest_1.expect)((0, react_1.act)(async () => {
                await result.current.handleSetDefault('test-id');
            })).rejects.toThrow('Set default failed');
            (0, vitest_1.expect)(result.current.doingAction).toBe(false);
        });
        (0, vitest_1.it)('should handle rename error gracefully', async () => {
            const { usePluginAuthAction } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth-action'));
            mockUpdatePluginCredential.mockRejectedValue(new Error('Rename failed'));
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => usePluginAuthAction(pluginPayload), {
                wrapper: createWrapper(),
            });
            await (0, vitest_1.expect)((0, react_1.act)(async () => {
                await result.current.handleRename({ credential_id: 'test-id', name: 'New Name' });
            })).rejects.toThrow('Rename failed');
            (0, vitest_1.expect)(result.current.doingAction).toBe(false);
        });
    });
    (0, vitest_1.describe)('Credential list edge cases', () => {
        (0, vitest_1.it)('should handle large credential lists', async () => {
            const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
            const largeCredentialList = createCredentialList(100);
            mockGetPluginCredentialInfo.mockReturnValue({
                credentials: largeCredentialList,
                supported_credential_types: [types_1.CredentialTypeEnum.API_KEY],
                allow_custom_token: true,
            });
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(result.current.isAuthorized).toBe(true);
            (0, vitest_1.expect)(result.current.credentials).toHaveLength(100);
        });
        (0, vitest_1.it)('should handle mixed credential types', async () => {
            const { usePluginAuth } = await Promise.resolve().then(() => require('./hooks/use-plugin-auth'));
            const mixedCredentials = [
                createCredential({ id: '1', credential_type: types_1.CredentialTypeEnum.API_KEY }),
                createCredential({ id: '2', credential_type: types_1.CredentialTypeEnum.OAUTH2 }),
                createCredential({ id: '3', credential_type: undefined }),
            ];
            mockGetPluginCredentialInfo.mockReturnValue({
                credentials: mixedCredentials,
                supported_credential_types: [types_1.CredentialTypeEnum.API_KEY, types_1.CredentialTypeEnum.OAUTH2],
                allow_custom_token: true,
            });
            const pluginPayload = createPluginPayload();
            const { result } = (0, react_1.renderHook)(() => usePluginAuth(pluginPayload, true), {
                wrapper: createWrapper(),
            });
            (0, vitest_1.expect)(result.current.credentials).toHaveLength(3);
            (0, vitest_1.expect)(result.current.canOAuth).toBe(true);
            (0, vitest_1.expect)(result.current.canApiKey).toBe(true);
        });
    });
    (0, vitest_1.describe)('Boundary conditions', () => {
        (0, vitest_1.it)('should handle special characters in provider name', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const pluginPayload = createPluginPayload({
                provider: 'test-provider_v2.0',
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialInfo).toContain('test-provider_v2.0');
        });
        (0, vitest_1.it)('should handle very long provider names', async () => {
            const { useGetApi } = await Promise.resolve().then(() => require('./hooks/use-get-api'));
            const longProvider = 'a'.repeat(200);
            const pluginPayload = createPluginPayload({
                provider: longProvider,
            });
            const apiMap = useGetApi(pluginPayload);
            (0, vitest_1.expect)(apiMap.getCredentialInfo).toContain(longProvider);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsdURBQXdFO0FBQ3hFLGtEQUFtRjtBQUNuRixtQ0FBNkQ7QUFDN0QsbUNBQTBEO0FBRTFELHVEQUF1RDtBQUV2RCwyQ0FBMkM7QUFDM0MsTUFBTSwyQkFBMkIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDM0MsTUFBTSwwQkFBMEIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUMsTUFBTSw4QkFBOEIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDOUMsTUFBTSwwQkFBMEIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUMsTUFBTSwrQkFBK0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDL0MsTUFBTSxxQkFBcUIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDckMsTUFBTSw4QkFBOEIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDOUMsTUFBTSw4QkFBOEIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDOUMsTUFBTSxpQ0FBaUMsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDakQsTUFBTSxrQ0FBa0MsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDbEQsTUFBTSx1QkFBdUIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDdkMsTUFBTSw2QkFBNkIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDN0MsTUFBTSxzQkFBc0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFdEMsV0FBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLDBCQUEwQixFQUFFLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDckQsU0FBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQztJQUNGLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDaEMsV0FBVyxFQUFFLDBCQUEwQjtLQUN4QyxDQUFDO0lBQ0YsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNwQyxXQUFXLEVBQUUsOEJBQThCO0tBQzVDLENBQUM7SUFDRix5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLFdBQVcsRUFBRSwwQkFBMEI7S0FDeEMsQ0FBQztJQUNGLDhCQUE4QixFQUFFLEdBQUcsRUFBRSxDQUFDLCtCQUErQjtJQUNyRSxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLFdBQVcsRUFBRSxxQkFBcUI7S0FDbkMsQ0FBQztJQUNGLDZCQUE2QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDcEMsSUFBSSxFQUFFLDhCQUE4QixFQUFFO1FBQ3RDLFNBQVMsRUFBRSxLQUFLO0tBQ2pCLENBQUM7SUFDRiw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3BDLFdBQVcsRUFBRSw4QkFBOEI7S0FDNUMsQ0FBQztJQUNGLGdDQUFnQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkMsV0FBVyxFQUFFLGlDQUFpQztLQUMvQyxDQUFDO0lBQ0YsaUNBQWlDLEVBQUUsR0FBRyxFQUFFLENBQUMsa0NBQWtDO0lBQzNFLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDN0IsV0FBVyxFQUFFLHVCQUF1QjtLQUNyQyxDQUFDO0lBQ0YsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNuQyxJQUFJLEVBQUUsNkJBQTZCLEVBQUU7UUFDckMsU0FBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsV0FBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLHFCQUFxQixFQUFFLEdBQUcsRUFBRSxDQUFDLHNCQUFzQjtDQUNwRCxDQUFDLENBQUMsQ0FBQTtBQUVILGtCQUFrQjtBQUNsQixNQUFNLDZCQUE2QixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM3QyxXQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEMsYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDcEIseUJBQXlCLEVBQUUsNkJBQTZCLEVBQUU7S0FDM0QsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgscUJBQXFCO0FBQ3JCLE1BQU0sVUFBVSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMxQixXQUFFLENBQUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdEIsTUFBTSxFQUFFLFVBQVU7S0FDbkIsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsc0JBQXNCO0FBQ3RCLFdBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNsQyxjQUFjLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTtDQUN4QixDQUFDLENBQUMsQ0FBQTtBQUVILDRCQUE0QjtBQUM1QixXQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkMsOEJBQThCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNyQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFO1FBQ3JCLFNBQVMsRUFBRSxLQUFLO0tBQ2pCLENBQUM7SUFDRixrQ0FBa0MsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLEtBQUs7S0FDakIsQ0FBQztJQUNGLCtCQUErQixFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDL0MsQ0FBQyxDQUFDLENBQUE7QUFFSCwyREFBMkQ7QUFFM0QsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLEVBQUUsQ0FDakMsSUFBSSx5QkFBVyxDQUFDO0lBQ2QsY0FBYyxFQUFFO1FBQ2QsT0FBTyxFQUFFO1lBQ1AsS0FBSyxFQUFFLEtBQUs7WUFDWixNQUFNLEVBQUUsQ0FBQztTQUNWO0tBQ0Y7Q0FDRixDQUFDLENBQUE7QUFFSixNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7SUFDekIsTUFBTSxlQUFlLEdBQUcscUJBQXFCLEVBQUUsQ0FBQTtJQUMvQyxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQTJCLEVBQUUsRUFBRSxDQUFDLENBQ2hELENBQUMsaUNBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQzNDO01BQUEsQ0FBQyxRQUFRLENBQ1g7SUFBQSxFQUFFLGlDQUFtQixDQUFDLENBQ3ZCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQ0FBa0M7QUFDbEMsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFlBQW9DLEVBQUUsRUFBaUIsRUFBRSxDQUFDLENBQUM7SUFDdEYsUUFBUSxFQUFFLG9CQUFZLENBQUMsSUFBSTtJQUMzQixRQUFRLEVBQUUsZUFBZTtJQUN6QixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRixNQUFNLGdCQUFnQixHQUFHLENBQUMsWUFBaUMsRUFBRSxFQUFjLEVBQUUsQ0FBQyxDQUFDO0lBQzdFLEVBQUUsRUFBRSxvQkFBb0I7SUFDeEIsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixRQUFRLEVBQUUsZUFBZTtJQUN6QixlQUFlLEVBQUUsMEJBQWtCLENBQUMsT0FBTztJQUMzQyxVQUFVLEVBQUUsS0FBSztJQUNqQixXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFO0lBQ3BDLEdBQUcsU0FBUztDQUNiLENBQUMsQ0FBQTtBQUVGLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxLQUFhLEVBQUUsWUFBbUMsRUFBRSxFQUFnQixFQUFFO0lBQ2xHLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDO1FBQzlELEVBQUUsRUFBRSxjQUFjLENBQUMsRUFBRTtRQUNyQixJQUFJLEVBQUUsY0FBYyxDQUFDLEVBQUU7UUFDdkIsVUFBVSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ25CLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUNoQixDQUFDLENBQUMsQ0FBQTtBQUNMLENBQUMsQ0FBQTtBQUVELGdFQUFnRTtBQUNoRSxJQUFBLGlCQUFRLEVBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixJQUFBLFdBQUUsRUFBQyxpREFBaUQsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMvRCxNQUFNLE9BQU8sR0FBRywyQ0FBYSxTQUFTLEVBQUMsQ0FBQTtRQUV2QyxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDN0MsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQzVDLElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUN6QyxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDeEMsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDeEQsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsV0FBVyxFQUFFLENBQUE7UUFDOUMsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQzNDLElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUN4QyxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUMvQyxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUMxRCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLGlDQUFpQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQy9DLE1BQU0sT0FBTyxHQUFHLDJDQUFhLFNBQVMsRUFBQyxDQUFBO1FBRXZDLElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUMxQyxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM5QyxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUMxRCxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNoRCxJQUFBLGVBQU0sRUFBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN0RCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLGtDQUFrQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2hELE1BQU0sT0FBTyxHQUFHLDJDQUFhLFNBQVMsRUFBQyxDQUFBO1FBRXZDLElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2hELElBQUEsZUFBTSxFQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDeEQsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUM1RCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsd0RBQXdEO0FBQ3hELElBQUEsaUJBQVEsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLElBQUEsaUJBQVEsRUFBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsSUFBQSxXQUFFLEVBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1lBQ3BDLElBQUEsZUFBTSxFQUFDLG9CQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3RDLElBQUEsZUFBTSxFQUFDLG9CQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQ2xELElBQUEsZUFBTSxFQUFDLG9CQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ3hDLElBQUEsZUFBTSxFQUFDLG9CQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsb0JBQVksQ0FBQyxDQUFBO1lBQzFDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxJQUFBLFdBQUUsRUFBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsSUFBQSxlQUFNLEVBQUMsMEJBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ2hELElBQUEsZUFBTSxFQUFDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNwRCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtZQUNyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLDBCQUFrQixDQUFDLENBQUE7WUFDaEQsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2hDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLElBQUEsV0FBRSxFQUFDLHlDQUF5QyxFQUFFLEdBQUcsRUFBRTtZQUNqRCxNQUFNLFVBQVUsR0FBZTtnQkFDN0IsRUFBRSxFQUFFLFNBQVM7Z0JBQ2IsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFVBQVUsRUFBRSxJQUFJO2FBQ2pCLENBQUE7WUFDRCxJQUFBLGVBQU0sRUFBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ3JDLElBQUEsZUFBTSxFQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDMUMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw4QkFBOEIsRUFBRSxHQUFHLEVBQUU7WUFDdEMsTUFBTSxVQUFVLEdBQWU7Z0JBQzdCLEVBQUUsRUFBRSxTQUFTO2dCQUNiLElBQUksRUFBRSxNQUFNO2dCQUNaLFFBQVEsRUFBRSxlQUFlO2dCQUN6QixVQUFVLEVBQUUsS0FBSztnQkFDakIsZUFBZSxFQUFFLDBCQUFrQixDQUFDLE9BQU87Z0JBQzNDLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUU7Z0JBQzdCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixrQkFBa0IsRUFBRSxLQUFLO2FBQzFCLENBQUE7WUFDRCxJQUFBLGVBQU0sRUFBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ25FLElBQUEsZUFBTSxFQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUNsQyxJQUFBLFdBQUUsRUFBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsTUFBTSxPQUFPLEdBQWtCO2dCQUM3QixRQUFRLEVBQUUsb0JBQVksQ0FBQyxJQUFJO2dCQUMzQixRQUFRLEVBQUUsZUFBZTthQUMxQixDQUFBO1lBQ0QsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sT0FBTyxHQUFrQjtnQkFDN0IsUUFBUSxFQUFFLG9CQUFZLENBQUMsVUFBVTtnQkFDakMsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLFlBQVksRUFBRSxTQUFTO2dCQUN2QixNQUFNLEVBQUUsU0FBUzthQUNsQixDQUFBO1lBQ0QsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUM5QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRix3REFBd0Q7QUFDeEQsSUFBQSxpQkFBUSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsSUFBQSxpQkFBUSxFQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxJQUFBLFdBQUUsRUFBQyx1REFBdUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNyRSxNQUFNLEVBQUUsK0JBQStCLEVBQUUsR0FBRywyQ0FBYSxTQUFTLEVBQUMsQ0FBQTtZQUVuRSxNQUFNLFdBQVcsR0FBRyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQTtZQUMvQyxNQUFNLE1BQU0sR0FBRztnQkFDYixPQUFPLEVBQUUsWUFBWTtnQkFDckIsWUFBWSxFQUFFLGNBQWM7Z0JBQzVCLFVBQVUsRUFBRSxjQUFjO2FBQzNCLENBQUE7WUFFRCxNQUFNLE1BQU0sR0FBRywrQkFBK0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFFbkUsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtZQUMzQyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBQ2hELElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDaEQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQywwQ0FBMEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN4RCxNQUFNLEVBQUUsK0JBQStCLEVBQUUsR0FBRywyQ0FBYSxTQUFTLEVBQUMsQ0FBQTtZQUVuRSxNQUFNLFdBQVcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQy9CLE1BQU0sTUFBTSxHQUFHO2dCQUNiLE9BQU8sRUFBRSxFQUFFO2dCQUNYLFVBQVUsRUFBRSxjQUFjO2FBQzNCLENBQUE7WUFFRCxNQUFNLE1BQU0sR0FBRywrQkFBK0IsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFFbkUsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUMvQixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ2hELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsOENBQThDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDNUQsTUFBTSxFQUFFLCtCQUErQixFQUFFLEdBQUcsMkNBQWEsU0FBUyxFQUFDLENBQUE7WUFFbkUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUMvQixNQUFNLE1BQU0sR0FBRztnQkFDYixVQUFVLEVBQUUsY0FBYzthQUMzQixDQUFBO1lBRUQsTUFBTSxNQUFNLEdBQUcsK0JBQStCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBRW5FLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUN0QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ2hELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsd0NBQXdDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDdEQsTUFBTSxFQUFFLCtCQUErQixFQUFFLEdBQUcsMkNBQWEsU0FBUyxFQUFDLENBQUE7WUFFbkUsTUFBTSxXQUFXLEdBQWEsRUFBRSxDQUFBO1lBQ2hDLE1BQU0sTUFBTSxHQUFHO2dCQUNiLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixVQUFVLEVBQUUsY0FBYzthQUMzQixDQUFBO1lBRUQsTUFBTSxNQUFNLEdBQUcsK0JBQStCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBRW5FLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDekMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUNoRCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLG1DQUFtQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2pELE1BQU0sRUFBRSwrQkFBK0IsRUFBRSxHQUFHLDJDQUFhLFNBQVMsRUFBQyxDQUFBO1lBRW5FLE1BQU0sV0FBVyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDL0IsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFBO1lBRWpCLE1BQU0sTUFBTSxHQUFHLCtCQUErQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQTtZQUVuRSxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzdDLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsa0RBQWtELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDaEUsTUFBTSxFQUFFLCtCQUErQixFQUFFLEdBQUcsMkNBQWEsU0FBUyxFQUFDLENBQUE7WUFFbkUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUMvQixNQUFNLE1BQU0sR0FBRztnQkFDYixPQUFPLEVBQUUsWUFBWTtnQkFDckIsVUFBVSxFQUFFLGNBQWM7YUFDM0IsQ0FBQTtZQUVELCtCQUErQixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQTtZQUVwRCxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBQzNDLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMseUNBQXlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDdkQsTUFBTSxFQUFFLCtCQUErQixFQUFFLEdBQUcsMkNBQWEsU0FBUyxFQUFDLENBQUE7WUFFbkUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUE7WUFDM0MsTUFBTSxNQUFNLEdBQUc7Z0JBQ2IsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsUUFBUSxFQUFFLENBQUM7YUFDWixDQUFBO1lBRUQsTUFBTSxNQUFNLEdBQUcsK0JBQStCLENBQUMsV0FBVyxFQUFFLE1BQWlDLENBQUMsQ0FBQTtZQUU5Riw4RkFBOEY7WUFDOUYsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQywwRkFBMEY7WUFDMUYsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixpRUFBaUU7QUFDakUsSUFBQSxpQkFBUSxFQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtJQUM5QixJQUFBLGlCQUFRLEVBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUM3QixJQUFBLFdBQUUsRUFBQyx1REFBdUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNyRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsMkNBQWEscUJBQXFCLEVBQUMsQ0FBQTtZQUV6RCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztnQkFDeEMsUUFBUSxFQUFFLG9CQUFZLENBQUMsSUFBSTtnQkFDM0IsUUFBUSxFQUFFLFdBQVc7YUFDdEIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRXZDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxxRUFBcUUsQ0FBQyxDQUFBO1lBQzVHLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyx3RUFBd0UsQ0FBQyxDQUFBO1lBQ2xILElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUMsaUVBQWlFLENBQUMsQ0FBQTtZQUNyRyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLHlEQUF5RCxDQUFDLENBQUE7WUFDNUYsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLDREQUE0RCxDQUFDLENBQUE7WUFDbEcsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLDREQUE0RCxDQUFDLENBQUE7WUFDbEcsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFBO1lBQ2pGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO1lBQ25ILElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO1lBQ25ILElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO1FBQ3hILENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsOERBQThELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDNUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLDJDQUFhLHFCQUFxQixFQUFDLENBQUE7WUFFekQsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUM7Z0JBQ3hDLFFBQVEsRUFBRSxvQkFBWSxDQUFDLElBQUk7Z0JBQzNCLFFBQVEsRUFBRSxXQUFXO2FBQ3RCLENBQUMsQ0FBQTtZQUVGLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUV2QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2pFLCtFQUErRSxDQUNoRixDQUFBO1lBQ0QsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLDBCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUNoRSw4RUFBOEUsQ0FDL0UsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLElBQUEsV0FBRSxFQUFDLDZEQUE2RCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzNFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRywyQ0FBYSxxQkFBcUIsRUFBQyxDQUFBO1lBRXpELE1BQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDO2dCQUN4QyxRQUFRLEVBQUUsb0JBQVksQ0FBQyxVQUFVO2dCQUNqQyxRQUFRLEVBQUUsaUJBQWlCO2FBQzVCLENBQUMsQ0FBQTtZQUVGLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUV2QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDekMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUE7WUFDM0YsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFBO1lBQzdFLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQTtZQUM1RSxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtZQUN0RixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtZQUN0RixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGdFQUFnRSxDQUFDLENBQUE7WUFDakcsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQzVDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFBO1lBQ2pHLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFBO1FBQ3RHLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsa0VBQWtFLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDaEYsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLDJDQUFhLHFCQUFxQixFQUFDLENBQUE7WUFFekQsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUM7Z0JBQ3hDLFFBQVEsRUFBRSxvQkFBWSxDQUFDLFVBQVU7Z0JBQ2pDLFFBQVEsRUFBRSxpQkFBaUI7YUFDNUIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRXZDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN6RSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxJQUFBLFdBQUUsRUFBQyxnREFBZ0QsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM5RCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsMkNBQWEscUJBQXFCLEVBQUMsQ0FBQTtZQUV6RCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztnQkFDeEMsUUFBUSxFQUFFLG9CQUFZLENBQUMsS0FBSztnQkFDNUIsUUFBUSxFQUFFLFlBQVk7YUFDdkIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBRXZDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN6QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDNUMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN0QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3JDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN4QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDeEMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3pFLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsa0RBQWtELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDaEUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLDJDQUFhLHFCQUFxQixFQUFDLENBQUE7WUFFekQsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUM7Z0JBQ3hDLFFBQVEsRUFBRSxvQkFBWSxDQUFDLE9BQU87Z0JBQzlCLFFBQVEsRUFBRSxjQUFjO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUV2QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDekMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtRQUMxQixJQUFBLFdBQUUsRUFBQyw4QkFBOEIsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1QyxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsMkNBQWEscUJBQXFCLEVBQUMsQ0FBQTtZQUV6RCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztnQkFDeEMsUUFBUSxFQUFFLG9CQUFZLENBQUMsSUFBSTtnQkFDM0IsUUFBUSxFQUFFLEVBQUU7YUFDYixDQUFDLENBQUE7WUFFRixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFdkMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDLDREQUE0RCxDQUFDLENBQUE7UUFDckcsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxtREFBbUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNqRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsMkNBQWEscUJBQXFCLEVBQUMsQ0FBQTtZQUV6RCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQztnQkFDeEMsUUFBUSxFQUFFLG9CQUFZLENBQUMsSUFBSTtnQkFDM0IsUUFBUSxFQUFFLGtCQUFrQjthQUM3QixDQUFDLENBQUE7WUFFRixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUE7WUFFdkMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYscUVBQXFFO0FBQ3JFLElBQUEsaUJBQVEsRUFBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDbEMsSUFBQSxtQkFBVSxFQUFDLEdBQUcsRUFBRTtRQUNkLFdBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUNsQiw2QkFBNkIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbkQsMkJBQTJCLENBQUMsZUFBZSxDQUFDO1lBQzFDLFdBQVcsRUFBRSxFQUFFO1lBQ2YsMEJBQTBCLEVBQUUsRUFBRTtZQUM5QixrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsc0RBQXNELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLDJDQUFhLHlCQUF5QixFQUFDLENBQUE7UUFFakUsMkJBQTJCLENBQUMsZUFBZSxDQUFDO1lBQzFDLFdBQVcsRUFBRSxFQUFFO1lBQ2YsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUM7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQy9DLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3BELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsd0RBQXdELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLDJDQUFhLHlCQUF5QixFQUFDLENBQUE7UUFFakUsMkJBQTJCLENBQUMsZUFBZSxDQUFDO1lBQzFDLFdBQVcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDakMsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUM7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzlDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3BELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsc0RBQXNELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLDJDQUFhLHlCQUF5QixFQUFDLENBQUE7UUFFakUsMkJBQTJCLENBQUMsZUFBZSxDQUFDO1lBQzFDLFdBQVcsRUFBRSxFQUFFO1lBQ2YsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDdkQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzFDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsd0RBQXdELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLDJDQUFhLHlCQUF5QixFQUFDLENBQUE7UUFFakUsMkJBQTJCLENBQUMsZUFBZSxDQUFDO1lBQzFDLFdBQVcsRUFBRSxFQUFFO1lBQ2YsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUM7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzNDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzdDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsK0RBQStELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDN0UsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLDJDQUFhLHlCQUF5QixFQUFDLENBQUE7UUFFakUsMkJBQTJCLENBQUMsZUFBZSxDQUFDO1lBQzFDLFdBQVcsRUFBRSxFQUFFO1lBQ2YsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxNQUFNLEVBQUUsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ25GLGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDdEUsT0FBTyxFQUFFLGFBQWEsRUFBRTtTQUN6QixDQUFDLENBQUE7UUFFRixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMxQyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM3QyxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLGdFQUFnRSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzlFLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRywyQ0FBYSx5QkFBeUIsRUFBQyxDQUFBO1FBRWpFLDZCQUE2QixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUVwRCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsNkRBQTZELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDM0UsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLDJDQUFhLHlCQUF5QixFQUFDLENBQUE7UUFFakUsNkJBQTZCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRW5ELE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUU7U0FDekIsQ0FBQyxDQUFBO1FBRUYsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDN0MsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxvRUFBb0UsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRixNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsMkNBQWEseUJBQXlCLEVBQUMsQ0FBQTtRQUVqRSwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLEVBQUU7WUFDZiwwQkFBMEIsRUFBRSxFQUFFO1lBQzlCLGtCQUFrQixFQUFFLEtBQUs7U0FDMUIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDdEUsT0FBTyxFQUFFLGFBQWEsRUFBRTtTQUN6QixDQUFDLENBQUE7UUFFRixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEUsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLDJDQUFhLHlCQUF5QixFQUFDLENBQUE7UUFFakUsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDdEUsT0FBTyxFQUFFLGFBQWEsRUFBRTtTQUN6QixDQUFDLENBQUE7UUFFRixJQUFBLGVBQU0sRUFBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDNUUsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyx1Q0FBdUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNyRCxNQUFNLEVBQUUsYUFBYSxFQUFFLEdBQUcsMkNBQWEseUJBQXlCLEVBQUMsQ0FBQTtRQUVqRSxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQy9DLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3BELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRiwyRUFBMkU7QUFDM0UsSUFBQSxpQkFBUSxFQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtJQUN4QyxJQUFBLG1CQUFVLEVBQUMsR0FBRyxFQUFFO1FBQ2QsV0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLDBCQUEwQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELDhCQUE4QixDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3BELDBCQUEwQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2xELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsbUNBQW1DLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDakQsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsMkNBQWEsZ0NBQWdDLEVBQUMsQ0FBQTtRQUU5RSxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDdEUsT0FBTyxFQUFFLGFBQWEsRUFBRTtTQUN6QixDQUFDLENBQUE7UUFFRixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM5QyxJQUFBLGVBQU0sRUFBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbkUsSUFBQSxlQUFNLEVBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUMxRCxJQUFBLGVBQU0sRUFBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzNELElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDcEQsSUFBQSxlQUFNLEVBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3BFLElBQUEsZUFBTSxFQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDNUQsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDNUMsSUFBQSxlQUFNLEVBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUM1RCxJQUFBLGVBQU0sRUFBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3pELElBQUEsZUFBTSxFQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDM0QsSUFBQSxlQUFNLEVBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQy9ELElBQUEsZUFBTSxFQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDN0QsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxzQ0FBc0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNwRCxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRywyQ0FBYSxnQ0FBZ0MsRUFBQyxDQUFBO1FBRTlFLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtZQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFFcEUsSUFBQSxXQUFHLEVBQUMsR0FBRyxFQUFFO1lBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUMvQixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEQsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxnQ0FBZ0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM5QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRywyQ0FBYSxnQ0FBZ0MsRUFBQyxDQUFBO1FBRTlFLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLE1BQU0sVUFBVSxHQUFHLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFBO1FBRW5DLElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtZQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ3ZELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsOEJBQThCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUMsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsMkNBQWEsZ0NBQWdDLEVBQUMsQ0FBQTtRQUU5RSxNQUFNLFFBQVEsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7UUFDeEIsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsRUFBRTtZQUNoRixPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtZQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLG9CQUFvQixDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLElBQUEsV0FBRyxFQUFDLEtBQUssSUFBSSxFQUFFO1lBQ25CLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUN0QyxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsZUFBTSxFQUFDLDBCQUEwQixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxhQUFhLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFBO1FBQ2hHLElBQUEsZUFBTSxFQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO1lBQ3RDLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLDBCQUEwQjtTQUNwQyxDQUFDLENBQUE7UUFDRixJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ25DLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEQsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxpREFBaUQsRUFBRSxLQUFLLElBQUksRUFBRTtRQUMvRCxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRywyQ0FBYSxnQ0FBZ0MsRUFBQyxDQUFBO1FBRTlFLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLE1BQU0sSUFBQSxXQUFHLEVBQUMsS0FBSyxJQUFJLEVBQUU7WUFDbkIsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ3RDLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxlQUFNLEVBQUMsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtJQUMzRCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDJCQUEyQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3pDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLDJDQUFhLGdDQUFnQyxFQUFDLENBQUE7UUFFOUUsTUFBTSxRQUFRLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBQ3hCLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLEVBQUU7WUFDaEYsT0FBTyxFQUFFLGFBQWEsRUFBRTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLElBQUEsV0FBRyxFQUFDLEtBQUssSUFBSSxFQUFFO1lBQ25CLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1FBQzdELENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxlQUFNLEVBQUMsOEJBQThCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1FBQ2pGLElBQUEsZUFBTSxFQUFDLFVBQVUsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO1lBQ3RDLElBQUksRUFBRSxTQUFTO1lBQ2YsT0FBTyxFQUFFLDBCQUEwQjtTQUNwQyxDQUFDLENBQUE7UUFDRixJQUFBLGVBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0lBQ3JDLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsc0JBQXNCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDcEMsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsMkNBQWEsZ0NBQWdDLEVBQUMsQ0FBQTtRQUU5RSxNQUFNLFFBQVEsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7UUFDeEIsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsRUFBRTtZQUNoRixPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLE1BQU0sSUFBQSxXQUFHLEVBQUMsS0FBSyxJQUFJLEVBQUU7WUFDbkIsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQztnQkFDaEMsYUFBYSxFQUFFLG9CQUFvQjtnQkFDbkMsSUFBSSxFQUFFLFVBQVU7YUFDakIsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLGVBQU0sRUFBQywwQkFBMEIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO1lBQ3RELGFBQWEsRUFBRSxvQkFBb0I7WUFDbkMsSUFBSSxFQUFFLFVBQVU7U0FDakIsQ0FBQyxDQUFBO1FBQ0YsSUFBQSxlQUFNLEVBQUMsVUFBVSxDQUFDLENBQUMsb0JBQW9CLENBQUM7WUFDdEMsSUFBSSxFQUFFLFNBQVM7WUFDZixPQUFPLEVBQUUsMEJBQTBCO1NBQ3BDLENBQUMsQ0FBQTtRQUNGLElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7SUFDckMsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxtQ0FBbUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNqRCxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRywyQ0FBYSxnQ0FBZ0MsRUFBQyxDQUFBO1FBRTlFLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtZQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDM0MsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUcsRUFBQyxHQUFHLEVBQUU7WUFDUCxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1FBQ2xELENBQUMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxJQUFBLFdBQUcsRUFBQyxLQUFLLElBQUksRUFBRTtZQUNuQixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDdEMsQ0FBQyxDQUFDLENBQUE7UUFFRixtREFBbUQ7UUFDbkQsSUFBQSxlQUFNLEVBQUMsMEJBQTBCLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtJQUMzRCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLGlDQUFpQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQy9DLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLDJDQUFhLGdDQUFnQyxFQUFDLENBQUE7UUFFOUUsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUU7U0FDekIsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFHLEVBQUMsR0FBRyxFQUFFO1lBQ1AsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNuRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRyxFQUFDLEdBQUcsRUFBRTtZQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUE7UUFDL0IsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFDdEUsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLHVFQUF1RTtBQUN2RSxJQUFBLGlCQUFRLEVBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLElBQUEsbUJBQVUsRUFBQyxHQUFHLEVBQUU7UUFDZCxXQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDbEIsNkJBQTZCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ25ELDJCQUEyQixDQUFDLGVBQWUsQ0FBQztZQUMxQyxXQUFXLEVBQUUsRUFBRTtZQUNmLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBQ0YsOEJBQThCLENBQUMsZUFBZSxDQUFDO1lBQzdDLE1BQU0sRUFBRSxFQUFFO1lBQ1YsOEJBQThCLEVBQUUsS0FBSztZQUNyQyw2QkFBNkIsRUFBRSxLQUFLO1NBQ3JDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsNkNBQTZDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDM0QsTUFBTSxVQUFVLEdBQUcsQ0FBQywyQ0FBYSxlQUFlLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUUxRCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLElBQUEsY0FBTSxFQUNKLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFHLEVBQzVDLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7UUFFRCxpQ0FBaUM7UUFDakMsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFDeEQsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQywwREFBMEQsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN4RSxNQUFNLFVBQVUsR0FBRyxDQUFDLDJDQUFhLGVBQWUsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTFELDJCQUEyQixDQUFDLGVBQWUsQ0FBQztZQUMxQyxXQUFXLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ2pDLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxJQUFBLGNBQU0sRUFDSixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRyxFQUM1QyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1FBRUQsbUNBQW1DO1FBQ25DLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQ3hELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsOERBQThELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUUsTUFBTSxVQUFVLEdBQUcsQ0FBQywyQ0FBYSxlQUFlLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUUxRCwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNqQywwQkFBMEIsRUFBRSxDQUFDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUN4RCxrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsSUFBQSxjQUFNLEVBQ0osQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQ3ZDO1FBQUEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsRUFBRSxHQUFHLENBQ3hEO01BQUEsRUFBRSxVQUFVLENBQUMsRUFDYixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1FBRUQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNqRSxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQ2hFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDMUQsTUFBTSxVQUFVLEdBQUcsQ0FBQywyQ0FBYSxlQUFlLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUUxRCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFDMUIsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRyxFQUNyRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1FBRUQsSUFBQSxlQUFNLEVBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUMxRCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDRDQUE0QyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzFELE1BQU0sVUFBVSxHQUFHLENBQUMsMkNBQWEsZUFBZSxFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFMUQsMkJBQTJCLENBQUMsZUFBZSxDQUFDO1lBQzFDLFdBQVcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDakMsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUM7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFDMUIsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRyxFQUNyRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1FBRUQsSUFBQSxlQUFNLEVBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDOUQsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxvQkFBb0IsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsQyxNQUFNLGdCQUFnQixHQUFHLDJDQUFhLGVBQWUsRUFBQyxDQUFBO1FBQ3RELElBQUEsZUFBTSxFQUFDLE9BQU8sZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3hELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRiw4RUFBOEU7QUFDOUUsSUFBQSxpQkFBUSxFQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtJQUMzQyxJQUFBLG1CQUFVLEVBQUMsR0FBRyxFQUFFO1FBQ2QsV0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLDZCQUE2QixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNuRCwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNqQywwQkFBMEIsRUFBRSxDQUFDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUN4RCxrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQTtRQUNGLDhCQUE4QixDQUFDLGVBQWUsQ0FBQztZQUM3QyxNQUFNLEVBQUUsRUFBRTtZQUNWLDhCQUE4QixFQUFFLEtBQUs7WUFDckMsNkJBQTZCLEVBQUUsS0FBSztTQUNyQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDZDQUE2QyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzNELE1BQU0saUJBQWlCLEdBQUcsQ0FBQywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTFFLDJCQUEyQixDQUFDLGVBQWUsQ0FBQztZQUMxQyxXQUFXLEVBQUUsRUFBRTtZQUNmLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxJQUFBLGNBQU0sRUFDSixDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFHLEVBQ25ELEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7UUFFRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUN4RCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLGlFQUFpRSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQy9FLE1BQU0saUJBQWlCLEdBQUcsQ0FBQywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTFFLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsSUFBQSxjQUFNLEVBQ0osQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRyxFQUNuRCxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1FBRUQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdEQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUM5RSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDJEQUEyRCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3pFLE1BQU0saUJBQWlCLEdBQUcsQ0FBQywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTFFLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZGLDJCQUEyQixDQUFDLGVBQWUsQ0FBQztZQUMxQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDekIsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUM7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLElBQUEsY0FBTSxFQUNKLENBQUMsaUJBQWlCLENBQ2hCLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUM3QixZQUFZLENBQUMsYUFBYSxFQUMxQixFQUNGLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7UUFFRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQ3JFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsb0RBQW9ELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEUsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLDJDQUFhLHdCQUF3QixFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFMUUsMkJBQTJCLENBQUMsZUFBZSxDQUFDO1lBQzFDLFdBQVcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDakMsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUM7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLElBQUEsY0FBTSxFQUNKLENBQUMsaUJBQWlCLENBQ2hCLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUM3QixZQUFZLENBQUMsaUJBQWlCLEVBQzlCLEVBQ0YsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FDN0IsQ0FBQTtRQUVELElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFDekUsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQywrREFBK0QsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM3RSxNQUFNLGlCQUFpQixHQUFHLENBQUMsMkNBQWEsd0JBQXdCLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUUxRSxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztZQUNsQyxFQUFFLEVBQUUsZ0JBQWdCO1lBQ3BCLElBQUksRUFBRSx3QkFBd0I7WUFDOUIsa0JBQWtCLEVBQUUsSUFBSTtZQUN4QixlQUFlLEVBQUUsS0FBSztTQUN2QixDQUFDLENBQUE7UUFDRiwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ3pCLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxJQUFBLGNBQU0sRUFDSixDQUFDLGlCQUFpQixDQUNoQixhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FDN0IsWUFBWSxDQUFDLGdCQUFnQixFQUM3QixFQUNGLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7UUFFRCw4Q0FBOEM7UUFDOUMsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUE7SUFDakUsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQywyREFBMkQsRUFBRSxLQUFLLElBQUksRUFBRTtRQUN6RSxNQUFNLGlCQUFpQixHQUFHLENBQUMsMkNBQWEsd0JBQXdCLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUUxRSxNQUFNLHdCQUF3QixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtRQUN4QyxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLElBQUEsY0FBTSxFQUNKLENBQUMsaUJBQWlCLENBQ2hCLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUM3Qix3QkFBd0IsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLEVBQ25ELEVBQ0YsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FDN0IsQ0FBQTtRQUVELHNCQUFzQjtRQUN0QixNQUFNLE9BQU8sR0FBRyxjQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzdDLGlCQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRTNCLHdFQUF3RTtRQUN4RSxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNqRSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLGdHQUFnRyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzlHLE1BQU0saUJBQWlCLEdBQUcsQ0FBQywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTFFLE1BQU0sd0JBQXdCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBQ3hDLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFBO1FBQ3BGLDJCQUEyQixDQUFDLGVBQWUsQ0FBQztZQUMxQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDekIsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUM7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLElBQUEsY0FBTSxFQUNKLENBQUMsaUJBQWlCLENBQ2hCLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUM3Qix3QkFBd0IsQ0FBQyxDQUFDLHdCQUF3QixDQUFDLEVBQ25ELEVBQ0YsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FDN0IsQ0FBQTtRQUVELHFDQUFxQztRQUNyQyxNQUFNLGFBQWEsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ2hELGlCQUFTLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRTlCLDREQUE0RDtRQUM1RCxpR0FBaUc7UUFDakcsTUFBTSxxQkFBcUIsR0FBRyxjQUFNLENBQUMsWUFBWSxDQUFDLDhCQUE4QixDQUFDLENBQUE7UUFDakYsd0VBQXdFO1FBQ3hFLE1BQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN4RyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUUxQixxRkFBcUY7UUFDckYsSUFBQSxlQUFNLEVBQUMsd0JBQXdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMzRCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDZGQUE2RixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzNHLE1BQU0saUJBQWlCLEdBQUcsQ0FBQywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTFFLE1BQU0sd0JBQXdCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBQ3hDLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDO1lBQ2xDLEVBQUUsRUFBRSxrQkFBa0I7WUFDdEIsSUFBSSxFQUFFLHFCQUFxQjtZQUMzQixlQUFlLEVBQUUsMEJBQWtCLENBQUMsT0FBTztTQUM1QyxDQUFDLENBQUE7UUFDRiwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ3pCLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxJQUFBLGNBQU0sRUFDSixDQUFDLGlCQUFpQixDQUNoQixhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FDN0Isd0JBQXdCLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxFQUNuRCxFQUNGLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7UUFFRCxxQ0FBcUM7UUFDckMsTUFBTSxhQUFhLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUU5QixvR0FBb0c7UUFDcEcsTUFBTSxlQUFlLEdBQUcsY0FBTSxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO1FBQ2xFLG9GQUFvRjtRQUNwRixNQUFNLFNBQVMsR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM3RCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUUxQixvRUFBb0U7UUFDcEUsSUFBQSxlQUFNLEVBQUMsd0JBQXdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBQzNFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsb0JBQW9CLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEMsTUFBTSx1QkFBdUIsR0FBRywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFBO1FBQ3RFLElBQUEsZUFBTSxFQUFDLE9BQU8sdUJBQXVCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQy9ELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRix1RkFBdUY7QUFDdkYsSUFBQSxpQkFBUSxFQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtJQUNwRCxJQUFBLG1CQUFVLEVBQUMsR0FBRyxFQUFFO1FBQ2QsV0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsa0RBQWtELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDaEUsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLDJDQUFhLGtDQUFrQyxFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFN0YsTUFBTSxzQkFBc0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7UUFFdEMsSUFBQSxjQUFNLEVBQ0osQ0FBQywwQkFBMEIsQ0FDekIsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ3BCLHNCQUFzQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFDL0MsQ0FDSCxDQUFBO1FBRUQsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xDLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7SUFDN0UsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxtRUFBbUUsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNqRixNQUFNLDBCQUEwQixHQUFHLENBQUMsMkNBQWEsa0NBQWtDLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUU3RixNQUFNLHNCQUFzQixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtRQUV0QyxJQUFBLGNBQU0sRUFDSixDQUFDLDBCQUEwQixDQUN6QixZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDcEIsc0JBQXNCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxFQUMvQyxDQUNILENBQUE7UUFFRCxpQkFBUyxDQUFDLEtBQUssQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDM0MsSUFBQSxlQUFNLEVBQUMsc0JBQXNCLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLHdDQUF3QyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3RELE1BQU0sMEJBQTBCLEdBQUcsQ0FBQywyQ0FBYSxrQ0FBa0MsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTdGLE1BQU0sc0JBQXNCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBRXRDLElBQUEsY0FBTSxFQUNKLENBQUMsMEJBQTBCLENBQ3pCLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUNuQixzQkFBc0IsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBRS9DO1FBQUEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FDN0Q7TUFBQSxFQUFFLDBCQUEwQixDQUFDLENBQzlCLENBQUE7UUFFRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ2xFLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDbEUsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQzlELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsa0RBQWtELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDaEUsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLDJDQUFhLGtDQUFrQyxFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFN0YsTUFBTSxzQkFBc0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7UUFFdEMsSUFBQSxjQUFNLEVBQ0osQ0FBQywwQkFBMEIsQ0FDekIsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQ25CLHNCQUFzQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFDL0MsQ0FDSCxDQUFBO1FBRUQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQzlELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsZ0RBQWdELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDOUQsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLDJDQUFhLGtDQUFrQyxFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFN0YsTUFBTSxzQkFBc0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7UUFFdEMsSUFBQSxjQUFNLEVBQ0osQ0FBQywwQkFBMEIsQ0FDekIsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ3BCLHNCQUFzQixDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FFL0M7UUFBQSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUM3RDtNQUFBLEVBQUUsMEJBQTBCLENBQUMsQ0FDOUIsQ0FBQTtRQUVELElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQzFFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsOENBQThDLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUQsTUFBTSwwQkFBMEIsR0FBRyxDQUFDLDJDQUFhLGtDQUFrQyxFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFN0YsTUFBTSxzQkFBc0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7UUFFdEMsSUFBQSxjQUFNLEVBQ0osQ0FBQywwQkFBMEIsQ0FDekIsc0JBQXNCLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUUvQztRQUFBLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUNsRDtNQUFBLEVBQUUsMEJBQTBCLENBQUMsQ0FDOUIsQ0FBQTtRQUVELCtFQUErRTtRQUMvRSxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN0RCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUMxRSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLG9CQUFvQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2xDLE1BQU0sZ0NBQWdDLEdBQUcsMkNBQWEsa0NBQWtDLEVBQUMsQ0FBQTtRQUN6RixJQUFBLGVBQU0sRUFBQyxPQUFPLGdDQUFnQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN4RSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsdUZBQXVGO0FBQ3ZGLElBQUEsaUJBQVEsRUFBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7SUFDcEQsSUFBQSxtQkFBVSxFQUFDLEdBQUcsRUFBRTtRQUNkLFdBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDRFQUE0RSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQzFGLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQywyQ0FBYSxrQ0FBa0MsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTdGLE1BQU0sc0JBQXNCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBRXRDLElBQUEsY0FBTSxFQUNKLENBQUMsMEJBQTBCLENBQ3pCLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3JCLHNCQUFzQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFDL0MsQ0FDSCxDQUFBO1FBRUQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdEQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUMzRSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDBFQUEwRSxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hGLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQywyQ0FBYSxrQ0FBa0MsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTdGLE1BQU0sc0JBQXNCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBRXRDLElBQUEsY0FBTSxFQUNKLENBQUMsMEJBQTBCLENBQ3pCLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3JCLHNCQUFzQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFDL0MsQ0FDSCxDQUFBO1FBRUQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUM1RSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDJEQUEyRCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3pFLE1BQU0sMEJBQTBCLEdBQUcsQ0FBQywyQ0FBYSxrQ0FBa0MsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTdGLE1BQU0sc0JBQXNCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBRXRDLElBQUEsY0FBTSxFQUNKLENBQUMsMEJBQTBCLENBQ3pCLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3JCLHNCQUFzQixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFDL0MsQ0FDSCxDQUFBO1FBRUQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQzNDLElBQUEsZUFBTSxFQUFDLHNCQUFzQixDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDekQsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRCxNQUFNLDBCQUEwQixHQUFHLENBQUMsMkNBQWEsa0NBQWtDLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUU3RixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQzFCLENBQUMsMEJBQTBCLENBQ3pCLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3JCLHNCQUFzQixDQUFDLENBQUMsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQ2hDLENBQ0gsQ0FBQTtRQUVELDZDQUE2QztRQUM3QyxJQUFBLGVBQU0sRUFBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUNsRSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLHNDQUFzQyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BELE1BQU0sMEJBQTBCLEdBQUcsQ0FBQywyQ0FBYSxrQ0FBa0MsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRTdGLElBQUEsY0FBTSxFQUNKLENBQUMsMEJBQTBCLENBQ3pCLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ3JCLHNCQUFzQixDQUFDLENBQUMsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQ2hDLENBQ0gsQ0FBQTtRQUVELHdDQUF3QztRQUN4QyxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQzNFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsb0JBQW9CLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEMsTUFBTSxnQ0FBZ0MsR0FBRywyQ0FBYSxrQ0FBa0MsRUFBQyxDQUFBO1FBQ3pGLElBQUEsZUFBTSxFQUFDLE9BQU8sZ0NBQWdDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3hFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRiw2RUFBNkU7QUFDN0UsSUFBQSxpQkFBUSxFQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtJQUMxQyxJQUFBLG1CQUFVLEVBQUMsR0FBRyxFQUFFO1FBQ2QsV0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLDZCQUE2QixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNuRCwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNyRCwwQkFBMEIsRUFBRSxDQUFDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUN4RCxrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQTtRQUNGLDhCQUE4QixDQUFDLGVBQWUsQ0FBQztZQUM3QyxNQUFNLEVBQUUsRUFBRTtZQUNWLDhCQUE4QixFQUFFLEtBQUs7WUFDckMsNkJBQTZCLEVBQUUsS0FBSztTQUNyQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLDJEQUEyRCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3pFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQywyQ0FBYSxzQkFBc0IsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRXZFLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7UUFFM0MsSUFBQSxjQUFNLEVBQ0osQ0FBQyxnQkFBZ0IsQ0FDZixhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FDN0Isd0JBQXdCLENBQUMsQ0FBQyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFDbEMsRUFDRixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1FBRUQsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUM5RSxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLHlEQUF5RCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3ZFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQywyQ0FBYSxzQkFBc0IsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRXZFLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQTtRQUNqRiwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ3pCLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxJQUFBLGNBQU0sRUFDSixDQUFDLGdCQUFnQixDQUNmLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUM3Qix3QkFBd0IsQ0FBQyxDQUFDLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUNsQyxZQUFZLENBQUMsYUFBYSxFQUMxQixFQUNGLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7UUFFRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUMvRCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLHNEQUFzRCxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQywyQ0FBYSxzQkFBc0IsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBRXZFLDJCQUEyQixDQUFDLGVBQWUsQ0FBQztZQUMxQyxXQUFXLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ2pDLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxJQUFBLGNBQU0sRUFDSixDQUFDLGdCQUFnQixDQUNmLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUM3Qix3QkFBd0IsQ0FBQyxDQUFDLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUNsQyxZQUFZLENBQUMsY0FBYyxFQUMzQixFQUNGLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7UUFFRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQ3pFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsd0RBQXdELEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDdEUsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLDJDQUFhLHNCQUFzQixFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFdkUsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7WUFDbEMsRUFBRSxFQUFFLGdCQUFnQjtZQUNwQixrQkFBa0IsRUFBRSxJQUFJO1lBQ3hCLGVBQWUsRUFBRSxLQUFLO1NBQ3ZCLENBQUMsQ0FBQTtRQUNGLDJCQUEyQixDQUFDLGVBQWUsQ0FBQztZQUMxQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDekIsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLENBQUM7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLElBQUEsY0FBTSxFQUNKLENBQUMsZ0JBQWdCLENBQ2YsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQzdCLHdCQUF3QixDQUFDLENBQUMsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ2xDLFlBQVksQ0FBQyxnQkFBZ0IsRUFDN0IsRUFDRixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1FBRUQsOENBQThDO1FBQzlDLE1BQU0sTUFBTSxHQUFHLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDekMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0lBQ2pFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsZ0VBQWdFLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDOUUsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLDJDQUFhLHNCQUFzQixFQUFDLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFFdkUsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7WUFDbEMsVUFBVSxFQUFFLElBQUk7WUFDaEIsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7UUFDRiwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ3pCLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO1lBQ3hELGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtRQUUzQyxJQUFBLGNBQU0sRUFDSixDQUFDLGdCQUFnQixDQUNmLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUM3Qix3QkFBd0IsQ0FBQyxDQUFDLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUNsQyxFQUNGLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7UUFFRCw4Q0FBOEM7UUFDOUMsTUFBTSxNQUFNLEdBQUcsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN6QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLHlCQUF5QixDQUFDLENBQUE7SUFDakUsQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLFdBQUUsRUFBQyxvREFBb0QsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNsRSxNQUFNLGdCQUFnQixHQUFHLENBQUMsMkNBQWEsc0JBQXNCLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtRQUV2RSxNQUFNLHdCQUF3QixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtRQUN4QyxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1FBRTNDLElBQUEsY0FBTSxFQUNKLENBQUMsZ0JBQWdCLENBQ2YsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQzdCLHdCQUF3QixDQUFDLENBQUMsd0JBQXdCLENBQUMsRUFDbkQsRUFDRixFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1FBRUQsMEJBQTBCO1FBQzFCLE1BQU0sT0FBTyxHQUFHLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDN0MsaUJBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFM0IsOEVBQThFO1FBQzlFLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2pFLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsb0JBQW9CLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDbEMsTUFBTSxzQkFBc0IsR0FBRywyQ0FBYSxzQkFBc0IsRUFBQyxDQUFBO1FBQ25FLElBQUEsZUFBTSxFQUFDLE9BQU8sc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzlELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixzRUFBc0U7QUFDdEUsSUFBQSxpQkFBUSxFQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUNuQyxJQUFBLG1CQUFVLEVBQUMsR0FBRyxFQUFFO1FBQ2QsV0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLDJCQUEyQixDQUFDLGVBQWUsQ0FBQztZQUMxQyxXQUFXLEVBQUUsRUFBRTtZQUNmLDBCQUEwQixFQUFFLEVBQUU7WUFDOUIsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsaUJBQVEsRUFBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsSUFBQSxXQUFFLEVBQUMsNENBQTRDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDMUQsTUFBTSxFQUFFLDhCQUE4QixFQUFFLEdBQUcsMkNBQWEsd0JBQXdCLEVBQUMsQ0FBQTtZQUVqRiwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7Z0JBQzFDLFdBQVcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBQ2pDLDBCQUEwQixFQUFFLENBQUMsMEJBQWtCLENBQUMsT0FBTyxDQUFDO2dCQUN4RCxrQkFBa0IsRUFBRSxJQUFJO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZGLE9BQU8sRUFBRSxhQUFhLEVBQUU7YUFDekIsQ0FBQyxDQUFBO1lBRUYsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUN6QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxnQ0FBZ0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM5QyxNQUFNLEVBQUUsOEJBQThCLEVBQUUsR0FBRywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFBO1lBRWpGLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyw4QkFBOEIsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ3hGLE9BQU8sRUFBRSxhQUFhLEVBQUU7YUFDekIsQ0FBQyxDQUFBO1lBRUYsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUM3QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtRQUM3QyxJQUFBLFdBQUUsRUFBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsRCxNQUFNLEVBQUUsNkJBQTZCLEVBQUUsR0FBRywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFBO1lBRWhGLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyw2QkFBNkIsQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDaEYsT0FBTyxFQUFFLGFBQWEsRUFBRTthQUN6QixDQUFDLENBQUE7WUFFRixJQUFBLGVBQU0sRUFBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1FBQ2xELElBQUEsV0FBRSxFQUFDLGtFQUFrRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2hGLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxHQUFHLDJDQUFhLHdCQUF3QixFQUFDLENBQUE7WUFFckYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtZQUV0RSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLGtDQUFrQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNyRixPQUFPLEVBQUUsYUFBYSxFQUFFO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLElBQUEsZUFBTSxFQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUU5QyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7WUFFaEIsSUFBQSxlQUFNLEVBQUMsK0JBQStCLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1lBQzFELElBQUEsZUFBTSxFQUFDLHNCQUFzQixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxJQUFBLFdBQUUsRUFBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsRCxNQUFNLEVBQUUsaUNBQWlDLEVBQUUsR0FBRywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFBO1lBRXBGLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDcEYsT0FBTyxFQUFFLGFBQWEsRUFBRTthQUN6QixDQUFDLENBQUE7WUFFRixJQUFBLGVBQU0sRUFBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1FBQ2hELElBQUEsV0FBRSxFQUFDLDJCQUEyQixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE1BQU0sRUFBRSxnQ0FBZ0MsRUFBRSxHQUFHLDJDQUFhLHdCQUF3QixFQUFDLENBQUE7WUFFbkYsNkJBQTZCLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFcEYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtZQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUMzQixHQUFHLEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQyxhQUFhLEVBQUUsMEJBQWtCLENBQUMsT0FBTyxDQUFDLEVBQ2pGLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxFQUFFLENBQzdCLENBQUE7WUFFRCxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQzNDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQzFDLElBQUEsV0FBRSxFQUFDLG9DQUFvQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2xELE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxHQUFHLDJDQUFhLHdCQUF3QixFQUFDLENBQUE7WUFFN0UsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtZQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLDBCQUEwQixDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUM3RSxPQUFPLEVBQUUsYUFBYSxFQUFFO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLElBQUEsZUFBTSxFQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsaUJBQVEsRUFBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDN0MsSUFBQSxXQUFFLEVBQUMsb0NBQW9DLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEQsTUFBTSxFQUFFLDZCQUE2QixFQUFFLEdBQUcsMkNBQWEsd0JBQXdCLEVBQUMsQ0FBQTtZQUVoRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1lBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsNkJBQTZCLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ2hGLE9BQU8sRUFBRSxhQUFhLEVBQUU7YUFDekIsQ0FBQyxDQUFBO1lBRUYsSUFBQSxlQUFNLEVBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxpQkFBUSxFQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRTtRQUN4QyxJQUFBLFdBQUUsRUFBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsRCxNQUFNLEVBQUUsd0JBQXdCLEVBQUUsR0FBRywyQ0FBYSx3QkFBd0IsRUFBQyxDQUFBO1lBRTNFLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDM0UsT0FBTyxFQUFFLGFBQWEsRUFBRTthQUN6QixDQUFDLENBQUE7WUFFRixJQUFBLGVBQU0sRUFBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQ2pELElBQUEsV0FBRSxFQUFDLDJCQUEyQixFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3pDLE1BQU0sRUFBRSxpQ0FBaUMsRUFBRSxHQUFHLDJDQUFhLHdCQUF3QixFQUFDLENBQUE7WUFFcEYsOEJBQThCLENBQUMsZUFBZSxDQUFDO2dCQUM3QyxNQUFNLEVBQUUsRUFBRTtnQkFDViw4QkFBOEIsRUFBRSxJQUFJO2FBQ3JDLENBQUMsQ0FBQTtZQUVGLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDcEYsT0FBTyxFQUFFLGFBQWEsRUFBRTthQUN6QixDQUFDLENBQUE7WUFFRixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQzNDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQ2pELElBQUEsV0FBRSxFQUFDLG9DQUFvQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2xELE1BQU0sRUFBRSxpQ0FBaUMsRUFBRSxHQUFHLDJDQUFhLHdCQUF3QixFQUFDLENBQUE7WUFFcEYsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtZQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLGlDQUFpQyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUNwRixPQUFPLEVBQUUsYUFBYSxFQUFFO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLElBQUEsZUFBTSxFQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsaUJBQVEsRUFBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDcEQsSUFBQSxXQUFFLEVBQUMsb0NBQW9DLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDbEQsTUFBTSxFQUFFLG9DQUFvQyxFQUFFLEdBQUcsMkNBQWEsd0JBQXdCLEVBQUMsQ0FBQTtZQUV2RixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1lBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsb0NBQW9DLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ3ZGLE9BQU8sRUFBRSxhQUFhLEVBQUU7YUFDekIsQ0FBQyxDQUFBO1lBRUYsSUFBQSxlQUFNLEVBQUMsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRiwwRUFBMEU7QUFDMUUsSUFBQSxpQkFBUSxFQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUM3QyxJQUFBLG1CQUFVLEVBQUMsR0FBRyxFQUFFO1FBQ2QsV0FBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLDZCQUE2QixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNuRCwyQkFBMkIsQ0FBQyxlQUFlLENBQUM7WUFDMUMsV0FBVyxFQUFFLEVBQUU7WUFDZiwwQkFBMEIsRUFBRSxDQUFDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUN4RCxrQkFBa0IsRUFBRSxJQUFJO1NBQ3pCLENBQUMsQ0FBQTtRQUNGLDhCQUE4QixDQUFDLGVBQWUsQ0FBQztZQUM3QyxNQUFNLEVBQUUsRUFBRTtZQUNWLDhCQUE4QixFQUFFLEtBQUs7WUFDckMsNkJBQTZCLEVBQUUsS0FBSztTQUNyQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsaUJBQVEsRUFBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDckMsSUFBQSxXQUFFLEVBQUMseUNBQXlDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDdkQsTUFBTSxVQUFVLEdBQUcsQ0FBQywyQ0FBYSxlQUFlLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtZQUUxRCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBRTNELElBQUEsZUFBTSxFQUFDLEdBQUcsRUFBRTtnQkFDVixJQUFBLGNBQU0sRUFDSixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRyxFQUM1QyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ2xCLENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsK0RBQStELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDN0UsTUFBTSxVQUFVLEdBQUcsQ0FBQywyQ0FBYSxlQUFlLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtZQUUxRCxnRUFBZ0U7WUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLG9CQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFN0MsS0FBSyxNQUFNLFFBQVEsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO2dCQUN6QyxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7Z0JBRXZELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFDeEIsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUcsRUFDNUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FDN0IsQ0FBQTtnQkFFRCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtnQkFFdEQsT0FBTyxFQUFFLENBQUE7WUFDWCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw2REFBNkQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMzRSxNQUFNLFVBQVUsR0FBRyxDQUFDLDJDQUFhLGVBQWUsRUFBQyxDQUFDLENBQUMsT0FBTyxDQUFBO1lBRTFELHdGQUF3RjtZQUN4RixNQUFNLG9CQUFvQixHQUFHLENBQUMsb0JBQVksQ0FBQyxLQUFLLEVBQUUsb0JBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUV2RSxLQUFLLE1BQU0sUUFBUSxJQUFJLG9CQUFvQixFQUFFLENBQUM7Z0JBQzVDLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtnQkFFdkQsSUFBQSxlQUFNLEVBQUMsR0FBRyxFQUFFO29CQUNWLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFDeEIsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUcsRUFDNUMsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLEVBQUUsQ0FDN0IsQ0FBQTtvQkFDRCxPQUFPLEVBQUUsQ0FBQTtnQkFDWCxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDbEIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFBO1FBRUYsSUFBQSxXQUFFLEVBQUMsZ0NBQWdDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDOUMsTUFBTSxVQUFVLEdBQUcsQ0FBQywyQ0FBYSxlQUFlLEVBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQTtZQUUxRCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1lBRWhFLElBQUEsZUFBTSxFQUFDLEdBQUcsRUFBRTtnQkFDVixJQUFBLGNBQU0sRUFDSixDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRyxFQUM1QyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsRUFBRSxDQUM3QixDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ2xCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1FBQ2xELElBQUEsV0FBRSxFQUFDLHVDQUF1QyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3JELE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLDJDQUFhLGdDQUFnQyxFQUFDLENBQUE7WUFFOUUsMEJBQTBCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtZQUV4RSxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1lBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUU7YUFDekIsQ0FBQyxDQUFBO1lBRUYsSUFBQSxXQUFHLEVBQUMsR0FBRyxFQUFFO2dCQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ3ZDLENBQUMsQ0FBQyxDQUFBO1lBRUYsb0NBQW9DO1lBQ3BDLE1BQU0sSUFBQSxlQUFNLEVBQ1YsSUFBQSxXQUFHLEVBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2IsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBQ3RDLENBQUMsQ0FBQyxDQUNILENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUVsQywrQkFBK0I7WUFDL0IsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDaEQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyw0Q0FBNEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMxRCxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRywyQ0FBYSxnQ0FBZ0MsRUFBQyxDQUFBO1lBRTlFLDhCQUE4QixDQUFDLGlCQUFpQixDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQTtZQUVqRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1lBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ3RFLE9BQU8sRUFBRSxhQUFhLEVBQUU7YUFDekIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxJQUFBLGVBQU0sRUFDVixJQUFBLFdBQUcsRUFBQyxLQUFLLElBQUksRUFBRTtnQkFDYixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDbEQsQ0FBQyxDQUFDLENBQ0gsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUE7WUFFdkMsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDaEQsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyx1Q0FBdUMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNyRCxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRywyQ0FBYSxnQ0FBZ0MsRUFBQyxDQUFBO1lBRTlFLDBCQUEwQixDQUFDLGlCQUFpQixDQUFDLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7WUFFeEUsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQTtZQUUzQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLE1BQU0sSUFBQSxlQUFNLEVBQ1YsSUFBQSxXQUFHLEVBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2IsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7WUFDbkYsQ0FBQyxDQUFDLENBQ0gsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBRWxDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2hELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQzFDLElBQUEsV0FBRSxFQUFDLHNDQUFzQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3BELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRywyQ0FBYSx5QkFBeUIsRUFBQyxDQUFBO1lBRWpFLE1BQU0sbUJBQW1CLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDckQsMkJBQTJCLENBQUMsZUFBZSxDQUFDO2dCQUMxQyxXQUFXLEVBQUUsbUJBQW1CO2dCQUNoQywwQkFBMEIsRUFBRSxDQUFDLDBCQUFrQixDQUFDLE9BQU8sQ0FBQztnQkFDeEQsa0JBQWtCLEVBQUUsSUFBSTthQUN6QixDQUFDLENBQUE7WUFFRixNQUFNLGFBQWEsR0FBRyxtQkFBbUIsRUFBRSxDQUFBO1lBRTNDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDdEUsT0FBTyxFQUFFLGFBQWEsRUFBRTthQUN6QixDQUFDLENBQUE7WUFFRixJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM5QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUN0RCxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHNDQUFzQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3BELE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRywyQ0FBYSx5QkFBeUIsRUFBQyxDQUFBO1lBRWpFLE1BQU0sZ0JBQWdCLEdBQUc7Z0JBQ3ZCLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsMEJBQWtCLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzFFLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsMEJBQWtCLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3pFLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLENBQUM7YUFDMUQsQ0FBQTtZQUNELDJCQUEyQixDQUFDLGVBQWUsQ0FBQztnQkFDMUMsV0FBVyxFQUFFLGdCQUFnQjtnQkFDN0IsMEJBQTBCLEVBQUUsQ0FBQywwQkFBa0IsQ0FBQyxPQUFPLEVBQUUsMEJBQWtCLENBQUMsTUFBTSxDQUFDO2dCQUNuRixrQkFBa0IsRUFBRSxJQUFJO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLE1BQU0sYUFBYSxHQUFHLG1CQUFtQixFQUFFLENBQUE7WUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsa0JBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFO2FBQ3pCLENBQUMsQ0FBQTtZQUVGLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xELElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzFDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzdDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixJQUFBLGlCQUFRLEVBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLElBQUEsV0FBRSxFQUFDLG1EQUFtRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2pFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRywyQ0FBYSxxQkFBcUIsRUFBQyxDQUFBO1lBRXpELE1BQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDO2dCQUN4QyxRQUFRLEVBQUUsb0JBQW9CO2FBQy9CLENBQUMsQ0FBQTtZQUVGLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUV2QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdDQUF3QyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3RELE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRywyQ0FBYSxxQkFBcUIsRUFBQyxDQUFBO1lBRXpELE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDcEMsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUM7Z0JBQ3hDLFFBQVEsRUFBRSxZQUFZO2FBQ3ZCLENBQUMsQ0FBQTtZQUVGLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUV2QyxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUE7UUFDMUQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBSZWFjdE5vZGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgQ3JlZGVudGlhbCwgUGx1Z2luUGF5bG9hZCB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGFjdCwgZmlyZUV2ZW50LCByZW5kZXIsIHJlbmRlckhvb2ssIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBBdXRoQ2F0ZWdvcnksIENyZWRlbnRpYWxUeXBlRW51bSB9IGZyb20gJy4vdHlwZXMnXG5cbi8vID09PT09PT09PT09PT09PT09PT09IE1vY2sgU2V0dXAgPT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBBUEkgaG9va3MgZm9yIGNyZWRlbnRpYWwgb3BlcmF0aW9uc1xuY29uc3QgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvID0gdmkuZm4oKVxuY29uc3QgbW9ja0RlbGV0ZVBsdWdpbkNyZWRlbnRpYWwgPSB2aS5mbigpXG5jb25zdCBtb2NrU2V0UGx1Z2luRGVmYXVsdENyZWRlbnRpYWwgPSB2aS5mbigpXG5jb25zdCBtb2NrVXBkYXRlUGx1Z2luQ3JlZGVudGlhbCA9IHZpLmZuKClcbmNvbnN0IG1vY2tJbnZhbGlkUGx1Z2luQ3JlZGVudGlhbEluZm8gPSB2aS5mbigpXG5jb25zdCBtb2NrR2V0UGx1Z2luT0F1dGhVcmwgPSB2aS5mbigpXG5jb25zdCBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEgPSB2aS5mbigpXG5jb25zdCBtb2NrU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQgPSB2aS5mbigpXG5jb25zdCBtb2NrRGVsZXRlUGx1Z2luT0F1dGhDdXN0b21DbGllbnQgPSB2aS5mbigpXG5jb25zdCBtb2NrSW52YWxpZFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hID0gdmkuZm4oKVxuY29uc3QgbW9ja0FkZFBsdWdpbkNyZWRlbnRpYWwgPSB2aS5mbigpXG5jb25zdCBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYSA9IHZpLmZuKClcbmNvbnN0IG1vY2tJbnZhbGlkVG9vbHNCeVR5cGUgPSB2aS5mbigpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtcGx1Z2lucy1hdXRoJywgKCkgPT4gKHtcbiAgdXNlR2V0UGx1Z2luQ3JlZGVudGlhbEluZm86ICh1cmw6IHN0cmluZykgPT4gKHtcbiAgICBkYXRhOiB1cmwgPyBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8oKSA6IHVuZGVmaW5lZCxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICB9KSxcbiAgdXNlRGVsZXRlUGx1Z2luQ3JlZGVudGlhbDogKCkgPT4gKHtcbiAgICBtdXRhdGVBc3luYzogbW9ja0RlbGV0ZVBsdWdpbkNyZWRlbnRpYWwsXG4gIH0pLFxuICB1c2VTZXRQbHVnaW5EZWZhdWx0Q3JlZGVudGlhbDogKCkgPT4gKHtcbiAgICBtdXRhdGVBc3luYzogbW9ja1NldFBsdWdpbkRlZmF1bHRDcmVkZW50aWFsLFxuICB9KSxcbiAgdXNlVXBkYXRlUGx1Z2luQ3JlZGVudGlhbDogKCkgPT4gKHtcbiAgICBtdXRhdGVBc3luYzogbW9ja1VwZGF0ZVBsdWdpbkNyZWRlbnRpYWwsXG4gIH0pLFxuICB1c2VJbnZhbGlkUGx1Z2luQ3JlZGVudGlhbEluZm86ICgpID0+IG1vY2tJbnZhbGlkUGx1Z2luQ3JlZGVudGlhbEluZm8sXG4gIHVzZUdldFBsdWdpbk9BdXRoVXJsOiAoKSA9PiAoe1xuICAgIG11dGF0ZUFzeW5jOiBtb2NrR2V0UGx1Z2luT0F1dGhVcmwsXG4gIH0pLFxuICB1c2VHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYTogKCkgPT4gKHtcbiAgICBkYXRhOiBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEoKSxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICB9KSxcbiAgdXNlU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnQ6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudCxcbiAgfSksXG4gIHVzZURlbGV0ZVBsdWdpbk9BdXRoQ3VzdG9tQ2xpZW50OiAoKSA9PiAoe1xuICAgIG11dGF0ZUFzeW5jOiBtb2NrRGVsZXRlUGx1Z2luT0F1dGhDdXN0b21DbGllbnQsXG4gIH0pLFxuICB1c2VJbnZhbGlkUGx1Z2luT0F1dGhDbGllbnRTY2hlbWE6ICgpID0+IG1vY2tJbnZhbGlkUGx1Z2luT0F1dGhDbGllbnRTY2hlbWEsXG4gIHVzZUFkZFBsdWdpbkNyZWRlbnRpYWw6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tBZGRQbHVnaW5DcmVkZW50aWFsLFxuICB9KSxcbiAgdXNlR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYTogKCkgPT4gKHtcbiAgICBkYXRhOiBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbFNjaGVtYSgpLFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gIH0pLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtdG9vbHMnLCAoKSA9PiAoe1xuICB1c2VJbnZhbGlkVG9vbHNCeVR5cGU6ICgpID0+IG1vY2tJbnZhbGlkVG9vbHNCeVR5cGUsXG59KSlcblxuLy8gTW9jayBBcHBDb250ZXh0XG5jb25zdCBtb2NrSXNDdXJyZW50V29ya3NwYWNlTWFuYWdlciA9IHZpLmZuKClcbnZpLm1vY2soJ0AvY29udGV4dC9hcHAtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZUFwcENvbnRleHQ6ICgpID0+ICh7XG4gICAgaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlcjogbW9ja0lzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXIoKSxcbiAgfSksXG59KSlcblxuLy8gTW9jayB0b2FzdCBjb250ZXh0XG5jb25zdCBtb2NrTm90aWZ5ID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0JywgKCkgPT4gKHtcbiAgdXNlVG9hc3RDb250ZXh0OiAoKSA9PiAoe1xuICAgIG5vdGlmeTogbW9ja05vdGlmeSxcbiAgfSksXG59KSlcblxuLy8gTW9jayBvcGVuT0F1dGhQb3B1cFxudmkubW9jaygnQC9ob29rcy91c2Utb2F1dGgnLCAoKSA9PiAoe1xuICBvcGVuT0F1dGhQb3B1cDogdmkuZm4oKSxcbn0pKVxuXG4vLyBNb2NrIHNlcnZpY2UvdXNlLXRyaWdnZXJzXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLXRyaWdnZXJzJywgKCkgPT4gKHtcbiAgdXNlVHJpZ2dlclBsdWdpbkR5bmFtaWNPcHRpb25zOiAoKSA9PiAoe1xuICAgIGRhdGE6IHsgb3B0aW9uczogW10gfSxcbiAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICB9KSxcbiAgdXNlVHJpZ2dlclBsdWdpbkR5bmFtaWNPcHRpb25zSW5mbzogKCkgPT4gKHtcbiAgICBkYXRhOiBudWxsLFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gIH0pLFxuICB1c2VJbnZhbGlkVHJpZ2dlckR5bmFtaWNPcHRpb25zOiAoKSA9PiB2aS5mbigpLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFRlc3QgVXRpbGl0aWVzID09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZVRlc3RRdWVyeUNsaWVudCA9ICgpID0+XG4gIG5ldyBRdWVyeUNsaWVudCh7XG4gICAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICAgIHF1ZXJpZXM6IHtcbiAgICAgICAgcmV0cnk6IGZhbHNlLFxuICAgICAgICBnY1RpbWU6IDAsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pXG5cbmNvbnN0IGNyZWF0ZVdyYXBwZXIgPSAoKSA9PiB7XG4gIGNvbnN0IHRlc3RRdWVyeUNsaWVudCA9IGNyZWF0ZVRlc3RRdWVyeUNsaWVudCgpXG4gIHJldHVybiAoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdE5vZGUgfSkgPT4gKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17dGVzdFF1ZXJ5Q2xpZW50fT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+XG4gIClcbn1cblxuLy8gRmFjdG9yeSBmdW5jdGlvbnMgZm9yIHRlc3QgZGF0YVxuY29uc3QgY3JlYXRlUGx1Z2luUGF5bG9hZCA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luUGF5bG9hZD4gPSB7fSk6IFBsdWdpblBheWxvYWQgPT4gKHtcbiAgY2F0ZWdvcnk6IEF1dGhDYXRlZ29yeS50b29sLFxuICBwcm92aWRlcjogJ3Rlc3QtcHJvdmlkZXInLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVDcmVkZW50aWFsID0gKG92ZXJyaWRlczogUGFydGlhbDxDcmVkZW50aWFsPiA9IHt9KTogQ3JlZGVudGlhbCA9PiAoe1xuICBpZDogJ3Rlc3QtY3JlZGVudGlhbC1pZCcsXG4gIG5hbWU6ICdUZXN0IENyZWRlbnRpYWwnLFxuICBwcm92aWRlcjogJ3Rlc3QtcHJvdmlkZXInLFxuICBjcmVkZW50aWFsX3R5cGU6IENyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZLFxuICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgY3JlZGVudGlhbHM6IHsgYXBpX2tleTogJ3Rlc3Qta2V5JyB9LFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVDcmVkZW50aWFsTGlzdCA9IChjb3VudDogbnVtYmVyLCBvdmVycmlkZXM6IFBhcnRpYWw8Q3JlZGVudGlhbD5bXSA9IFtdKTogQ3JlZGVudGlhbFtdID0+IHtcbiAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PiBjcmVhdGVDcmVkZW50aWFsKHtcbiAgICBpZDogYGNyZWRlbnRpYWwtJHtpfWAsXG4gICAgbmFtZTogYENyZWRlbnRpYWwgJHtpfWAsXG4gICAgaXNfZGVmYXVsdDogaSA9PT0gMCxcbiAgICAuLi5vdmVycmlkZXNbaV0sXG4gIH0pKVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBJbmRleCBFeHBvcnRzIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnSW5kZXggRXhwb3J0cycsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBleHBvcnQgYWxsIHJlcXVpcmVkIGNvbXBvbmVudHMgYW5kIGhvb2tzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IGV4cG9ydHMgPSBhd2FpdCBpbXBvcnQoJy4vaW5kZXgnKVxuXG4gICAgZXhwZWN0KGV4cG9ydHMuQWRkQXBpS2V5QnV0dG9uKS50b0JlRGVmaW5lZCgpXG4gICAgZXhwZWN0KGV4cG9ydHMuQWRkT0F1dGhCdXR0b24pLnRvQmVEZWZpbmVkKClcbiAgICBleHBlY3QoZXhwb3J0cy5BcGlLZXlNb2RhbCkudG9CZURlZmluZWQoKVxuICAgIGV4cGVjdChleHBvcnRzLkF1dGhvcml6ZWQpLnRvQmVEZWZpbmVkKClcbiAgICBleHBlY3QoZXhwb3J0cy5BdXRob3JpemVkSW5EYXRhU291cmNlTm9kZSkudG9CZURlZmluZWQoKVxuICAgIGV4cGVjdChleHBvcnRzLkF1dGhvcml6ZWRJbk5vZGUpLnRvQmVEZWZpbmVkKClcbiAgICBleHBlY3QoZXhwb3J0cy51c2VQbHVnaW5BdXRoKS50b0JlRGVmaW5lZCgpXG4gICAgZXhwZWN0KGV4cG9ydHMuUGx1Z2luQXV0aCkudG9CZURlZmluZWQoKVxuICAgIGV4cGVjdChleHBvcnRzLlBsdWdpbkF1dGhJbkFnZW50KS50b0JlRGVmaW5lZCgpXG4gICAgZXhwZWN0KGV4cG9ydHMuUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGUpLnRvQmVEZWZpbmVkKClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGV4cG9ydCBBdXRoQ2F0ZWdvcnkgZW51bScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBleHBvcnRzID0gYXdhaXQgaW1wb3J0KCcuL2luZGV4JylcblxuICAgIGV4cGVjdChleHBvcnRzLkF1dGhDYXRlZ29yeSkudG9CZURlZmluZWQoKVxuICAgIGV4cGVjdChleHBvcnRzLkF1dGhDYXRlZ29yeS50b29sKS50b0JlKCd0b29sJylcbiAgICBleHBlY3QoZXhwb3J0cy5BdXRoQ2F0ZWdvcnkuZGF0YXNvdXJjZSkudG9CZSgnZGF0YXNvdXJjZScpXG4gICAgZXhwZWN0KGV4cG9ydHMuQXV0aENhdGVnb3J5Lm1vZGVsKS50b0JlKCdtb2RlbCcpXG4gICAgZXhwZWN0KGV4cG9ydHMuQXV0aENhdGVnb3J5LnRyaWdnZXIpLnRvQmUoJ3RyaWdnZXInKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgZXhwb3J0IENyZWRlbnRpYWxUeXBlRW51bScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBleHBvcnRzID0gYXdhaXQgaW1wb3J0KCcuL2luZGV4JylcblxuICAgIGV4cGVjdChleHBvcnRzLkNyZWRlbnRpYWxUeXBlRW51bSkudG9CZURlZmluZWQoKVxuICAgIGV4cGVjdChleHBvcnRzLkNyZWRlbnRpYWxUeXBlRW51bS5PQVVUSDIpLnRvQmUoJ29hdXRoMicpXG4gICAgZXhwZWN0KGV4cG9ydHMuQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVkpLnRvQmUoJ2FwaS1rZXknKVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gVHlwZXMgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdUeXBlcycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0F1dGhDYXRlZ29yeSBlbnVtJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHZhbHVlcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChBdXRoQ2F0ZWdvcnkudG9vbCkudG9CZSgndG9vbCcpXG4gICAgICBleHBlY3QoQXV0aENhdGVnb3J5LmRhdGFzb3VyY2UpLnRvQmUoJ2RhdGFzb3VyY2UnKVxuICAgICAgZXhwZWN0KEF1dGhDYXRlZ29yeS5tb2RlbCkudG9CZSgnbW9kZWwnKVxuICAgICAgZXhwZWN0KEF1dGhDYXRlZ29yeS50cmlnZ2VyKS50b0JlKCd0cmlnZ2VyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGV4YWN0bHkgNCBjYXRlZ29yaWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhBdXRoQ2F0ZWdvcnkpXG4gICAgICBleHBlY3QodmFsdWVzKS50b0hhdmVMZW5ndGgoNClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDcmVkZW50aWFsVHlwZUVudW0nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KENyZWRlbnRpYWxUeXBlRW51bS5PQVVUSDIpLnRvQmUoJ29hdXRoMicpXG4gICAgICBleHBlY3QoQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVkpLnRvQmUoJ2FwaS1rZXknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgZXhhY3RseSAyIHR5cGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhDcmVkZW50aWFsVHlwZUVudW0pXG4gICAgICBleHBlY3QodmFsdWVzKS50b0hhdmVMZW5ndGgoMilcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDcmVkZW50aWFsIHR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBjcmVhdGluZyB2YWxpZCBjcmVkZW50aWFscycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNyZWRlbnRpYWw6IENyZWRlbnRpYWwgPSB7XG4gICAgICAgIGlkOiAndGVzdC1pZCcsXG4gICAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgICAgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyJyxcbiAgICAgICAgaXNfZGVmYXVsdDogdHJ1ZSxcbiAgICAgIH1cbiAgICAgIGV4cGVjdChjcmVkZW50aWFsLmlkKS50b0JlKCd0ZXN0LWlkJylcbiAgICAgIGV4cGVjdChjcmVkZW50aWFsLmlzX2RlZmF1bHQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBvcHRpb25hbCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjcmVkZW50aWFsOiBDcmVkZW50aWFsID0ge1xuICAgICAgICBpZDogJ3Rlc3QtaWQnLFxuICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gICAgICAgIGlzX2RlZmF1bHQ6IGZhbHNlLFxuICAgICAgICBjcmVkZW50aWFsX3R5cGU6IENyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZLFxuICAgICAgICBjcmVkZW50aWFsczogeyBrZXk6ICd2YWx1ZScgfSxcbiAgICAgICAgaXNXb3Jrc3BhY2VEZWZhdWx0OiB0cnVlLFxuICAgICAgICBmcm9tX2VudGVycHJpc2U6IGZhbHNlLFxuICAgICAgICBub3RfYWxsb3dlZF90b191c2U6IGZhbHNlLFxuICAgICAgfVxuICAgICAgZXhwZWN0KGNyZWRlbnRpYWwuY3JlZGVudGlhbF90eXBlKS50b0JlKENyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZKVxuICAgICAgZXhwZWN0KGNyZWRlbnRpYWwuaXNXb3Jrc3BhY2VEZWZhdWx0KS50b0JlKHRydWUpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUGx1Z2luUGF5bG9hZCB0eXBlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYWxsb3cgY3JlYXRpbmcgdmFsaWQgcGx1Z2luIHBheWxvYWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkOiBQbHVnaW5QYXlsb2FkID0ge1xuICAgICAgICBjYXRlZ29yeTogQXV0aENhdGVnb3J5LnRvb2wsXG4gICAgICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gICAgICB9XG4gICAgICBleHBlY3QocGF5bG9hZC5jYXRlZ29yeSkudG9CZShBdXRoQ2F0ZWdvcnkudG9vbClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBvcHRpb25hbCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkOiBQbHVnaW5QYXlsb2FkID0ge1xuICAgICAgICBjYXRlZ29yeTogQXV0aENhdGVnb3J5LmRhdGFzb3VyY2UsXG4gICAgICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gICAgICAgIHByb3ZpZGVyVHlwZTogJ2J1aWx0aW4nLFxuICAgICAgICBkZXRhaWw6IHVuZGVmaW5lZCxcbiAgICAgIH1cbiAgICAgIGV4cGVjdChwYXlsb2FkLnByb3ZpZGVyVHlwZSkudG9CZSgnYnVpbHRpbicpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFV0aWxzIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnVXRpbHMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCd0cmFuc2Zvcm1Gb3JtU2NoZW1hc1NlY3JldElucHV0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdHJhbnNmb3JtIHNlY3JldCBpbnB1dCB2YWx1ZXMgdG8gaGlkZGVuIGZvcm1hdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhbnNmb3JtRm9ybVNjaGVtYXNTZWNyZXRJbnB1dCB9ID0gYXdhaXQgaW1wb3J0KCcuL3V0aWxzJylcblxuICAgICAgY29uc3Qgc2VjcmV0TmFtZXMgPSBbJ2FwaV9rZXknLCAnc2VjcmV0X3Rva2VuJ11cbiAgICAgIGNvbnN0IHZhbHVlcyA9IHtcbiAgICAgICAgYXBpX2tleTogJ2FjdHVhbC1rZXknLFxuICAgICAgICBzZWNyZXRfdG9rZW46ICdhY3R1YWwtdG9rZW4nLFxuICAgICAgICBwdWJsaWNfa2V5OiAncHVibGljLXZhbHVlJyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtRm9ybVNjaGVtYXNTZWNyZXRJbnB1dChzZWNyZXROYW1lcywgdmFsdWVzKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmFwaV9rZXkpLnRvQmUoJ1tfX0hJRERFTl9fXScpXG4gICAgICBleHBlY3QocmVzdWx0LnNlY3JldF90b2tlbikudG9CZSgnW19fSElEREVOX19dJylcbiAgICAgIGV4cGVjdChyZXN1bHQucHVibGljX2tleSkudG9CZSgncHVibGljLXZhbHVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdHJhbnNmb3JtIGVtcHR5IHNlY3JldCB2YWx1ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHRyYW5zZm9ybUZvcm1TY2hlbWFzU2VjcmV0SW5wdXQgfSA9IGF3YWl0IGltcG9ydCgnLi91dGlscycpXG5cbiAgICAgIGNvbnN0IHNlY3JldE5hbWVzID0gWydhcGlfa2V5J11cbiAgICAgIGNvbnN0IHZhbHVlcyA9IHtcbiAgICAgICAgYXBpX2tleTogJycsXG4gICAgICAgIHB1YmxpY19rZXk6ICdwdWJsaWMtdmFsdWUnLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1Gb3JtU2NoZW1hc1NlY3JldElucHV0KHNlY3JldE5hbWVzLCB2YWx1ZXMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuYXBpX2tleSkudG9CZSgnJylcbiAgICAgIGV4cGVjdChyZXN1bHQucHVibGljX2tleSkudG9CZSgncHVibGljLXZhbHVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdHJhbnNmb3JtIHVuZGVmaW5lZCBzZWNyZXQgdmFsdWVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0cmFuc2Zvcm1Gb3JtU2NoZW1hc1NlY3JldElucHV0IH0gPSBhd2FpdCBpbXBvcnQoJy4vdXRpbHMnKVxuXG4gICAgICBjb25zdCBzZWNyZXROYW1lcyA9IFsnYXBpX2tleSddXG4gICAgICBjb25zdCB2YWx1ZXMgPSB7XG4gICAgICAgIHB1YmxpY19rZXk6ICdwdWJsaWMtdmFsdWUnLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1Gb3JtU2NoZW1hc1NlY3JldElucHV0KHNlY3JldE5hbWVzLCB2YWx1ZXMpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuYXBpX2tleSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QocmVzdWx0LnB1YmxpY19rZXkpLnRvQmUoJ3B1YmxpYy12YWx1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHNlY3JldCBuYW1lcyBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhbnNmb3JtRm9ybVNjaGVtYXNTZWNyZXRJbnB1dCB9ID0gYXdhaXQgaW1wb3J0KCcuL3V0aWxzJylcblxuICAgICAgY29uc3Qgc2VjcmV0TmFtZXM6IHN0cmluZ1tdID0gW11cbiAgICAgIGNvbnN0IHZhbHVlcyA9IHtcbiAgICAgICAgYXBpX2tleTogJ2FjdHVhbC1rZXknLFxuICAgICAgICBwdWJsaWNfa2V5OiAncHVibGljLXZhbHVlJyxcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gdHJhbnNmb3JtRm9ybVNjaGVtYXNTZWNyZXRJbnB1dChzZWNyZXROYW1lcywgdmFsdWVzKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmFwaV9rZXkpLnRvQmUoJ2FjdHVhbC1rZXknKVxuICAgICAgZXhwZWN0KHJlc3VsdC5wdWJsaWNfa2V5KS50b0JlKCdwdWJsaWMtdmFsdWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB2YWx1ZXMgb2JqZWN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB0cmFuc2Zvcm1Gb3JtU2NoZW1hc1NlY3JldElucHV0IH0gPSBhd2FpdCBpbXBvcnQoJy4vdXRpbHMnKVxuXG4gICAgICBjb25zdCBzZWNyZXROYW1lcyA9IFsnYXBpX2tleSddXG4gICAgICBjb25zdCB2YWx1ZXMgPSB7fVxuXG4gICAgICBjb25zdCByZXN1bHQgPSB0cmFuc2Zvcm1Gb3JtU2NoZW1hc1NlY3JldElucHV0KHNlY3JldE5hbWVzLCB2YWx1ZXMpXG5cbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhyZXN1bHQpKS50b0hhdmVMZW5ndGgoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBvcmlnaW5hbCB2YWx1ZXMgb2JqZWN0IGltbXV0YWJseScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdHJhbnNmb3JtRm9ybVNjaGVtYXNTZWNyZXRJbnB1dCB9ID0gYXdhaXQgaW1wb3J0KCcuL3V0aWxzJylcblxuICAgICAgY29uc3Qgc2VjcmV0TmFtZXMgPSBbJ2FwaV9rZXknXVxuICAgICAgY29uc3QgdmFsdWVzID0ge1xuICAgICAgICBhcGlfa2V5OiAnYWN0dWFsLWtleScsXG4gICAgICAgIHB1YmxpY19rZXk6ICdwdWJsaWMtdmFsdWUnLFxuICAgICAgfVxuXG4gICAgICB0cmFuc2Zvcm1Gb3JtU2NoZW1hc1NlY3JldElucHV0KHNlY3JldE5hbWVzLCB2YWx1ZXMpXG5cbiAgICAgIGV4cGVjdCh2YWx1ZXMuYXBpX2tleSkudG9CZSgnYWN0dWFsLWtleScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwtaXNoIHZhbHVlcyBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHRyYW5zZm9ybUZvcm1TY2hlbWFzU2VjcmV0SW5wdXQgfSA9IGF3YWl0IGltcG9ydCgnLi91dGlscycpXG5cbiAgICAgIGNvbnN0IHNlY3JldE5hbWVzID0gWydhcGlfa2V5JywgJ251bGxfa2V5J11cbiAgICAgIGNvbnN0IHZhbHVlcyA9IHtcbiAgICAgICAgYXBpX2tleTogbnVsbCxcbiAgICAgICAgbnVsbF9rZXk6IDAsXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRyYW5zZm9ybUZvcm1TY2hlbWFzU2VjcmV0SW5wdXQoc2VjcmV0TmFtZXMsIHZhbHVlcyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilcblxuICAgICAgLy8gbnVsbCBpcyBwcmVzZXJ2ZWQgYXMtaXMgdG8gcmVwcmVzZW50IGFuIGV4cGxpY2l0bHkgdW5zZXQgc2VjcmV0LCBub3QgbWFza2VkIGFzIFtfX0hJRERFTl9fXVxuICAgICAgZXhwZWN0KHJlc3VsdC5hcGlfa2V5KS50b0JlKG51bGwpXG4gICAgICAvLyBudW1lcmljIHZhbHVlcyBsaWtlIDAgYXJlIGFsc28gcHJlc2VydmVkOyBvbmx5IG5vbi1lbXB0eSBzdHJpbmcgc2VjcmV0cyBhcmUgdHJhbnNmb3JtZWRcbiAgICAgIGV4cGVjdChyZXN1bHQubnVsbF9rZXkpLnRvQmUoMClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gdXNlR2V0QXBpIEhvb2sgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCd1c2VHZXRBcGkgSG9vaycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3Rvb2wgY2F0ZWdvcnknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBBUEkgZW5kcG9pbnRzIGZvciB0b29sIGNhdGVnb3J5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VHZXRBcGkgfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtZ2V0LWFwaScpXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKHtcbiAgICAgICAgY2F0ZWdvcnk6IEF1dGhDYXRlZ29yeS50b29sLFxuICAgICAgICBwcm92aWRlcjogJ3Rlc3QtdG9vbCcsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBhcGlNYXAgPSB1c2VHZXRBcGkocGx1Z2luUGF5bG9hZClcblxuICAgICAgZXhwZWN0KGFwaU1hcC5nZXRDcmVkZW50aWFsSW5mbykudG9CZSgnL3dvcmtzcGFjZXMvY3VycmVudC90b29sLXByb3ZpZGVyL2J1aWx0aW4vdGVzdC10b29sL2NyZWRlbnRpYWwvaW5mbycpXG4gICAgICBleHBlY3QoYXBpTWFwLnNldERlZmF1bHRDcmVkZW50aWFsKS50b0JlKCcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi90ZXN0LXRvb2wvZGVmYXVsdC1jcmVkZW50aWFsJylcbiAgICAgIGV4cGVjdChhcGlNYXAuZ2V0Q3JlZGVudGlhbHMpLnRvQmUoJy93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluL3Rlc3QtdG9vbC9jcmVkZW50aWFscycpXG4gICAgICBleHBlY3QoYXBpTWFwLmFkZENyZWRlbnRpYWwpLnRvQmUoJy93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluL3Rlc3QtdG9vbC9hZGQnKVxuICAgICAgZXhwZWN0KGFwaU1hcC51cGRhdGVDcmVkZW50aWFsKS50b0JlKCcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi90ZXN0LXRvb2wvdXBkYXRlJylcbiAgICAgIGV4cGVjdChhcGlNYXAuZGVsZXRlQ3JlZGVudGlhbCkudG9CZSgnL3dvcmtzcGFjZXMvY3VycmVudC90b29sLXByb3ZpZGVyL2J1aWx0aW4vdGVzdC10b29sL2RlbGV0ZScpXG4gICAgICBleHBlY3QoYXBpTWFwLmdldE9hdXRoVXJsKS50b0JlKCcvb2F1dGgvcGx1Z2luL3Rlc3QtdG9vbC90b29sL2F1dGhvcml6YXRpb24tdXJsJylcbiAgICAgIGV4cGVjdChhcGlNYXAuZ2V0T2F1dGhDbGllbnRTY2hlbWEpLnRvQmUoJy93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluL3Rlc3QtdG9vbC9vYXV0aC9jbGllbnQtc2NoZW1hJylcbiAgICAgIGV4cGVjdChhcGlNYXAuc2V0Q3VzdG9tT2F1dGhDbGllbnQpLnRvQmUoJy93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluL3Rlc3QtdG9vbC9vYXV0aC9jdXN0b20tY2xpZW50JylcbiAgICAgIGV4cGVjdChhcGlNYXAuZGVsZXRlQ3VzdG9tT0F1dGhDbGllbnQpLnRvQmUoJy93b3Jrc3BhY2VzL2N1cnJlbnQvdG9vbC1wcm92aWRlci9idWlsdGluL3Rlc3QtdG9vbC9vYXV0aC9jdXN0b20tY2xpZW50JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZ2V0Q3JlZGVudGlhbFNjaGVtYSBmdW5jdGlvbiBmb3IgdG9vbCBjYXRlZ29yeScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlR2V0QXBpIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLWdldC1hcGknKVxuXG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCh7XG4gICAgICAgIGNhdGVnb3J5OiBBdXRoQ2F0ZWdvcnkudG9vbCxcbiAgICAgICAgcHJvdmlkZXI6ICd0ZXN0LXRvb2wnLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgYXBpTWFwID0gdXNlR2V0QXBpKHBsdWdpblBheWxvYWQpXG5cbiAgICAgIGV4cGVjdChhcGlNYXAuZ2V0Q3JlZGVudGlhbFNjaGVtYShDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWSkpLnRvQmUoXG4gICAgICAgICcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi90ZXN0LXRvb2wvY3JlZGVudGlhbC9zY2hlbWEvYXBpLWtleScsXG4gICAgICApXG4gICAgICBleHBlY3QoYXBpTWFwLmdldENyZWRlbnRpYWxTY2hlbWEoQ3JlZGVudGlhbFR5cGVFbnVtLk9BVVRIMikpLnRvQmUoXG4gICAgICAgICcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi90ZXN0LXRvb2wvY3JlZGVudGlhbC9zY2hlbWEvb2F1dGgyJyxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdkYXRhc291cmNlIGNhdGVnb3J5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgQVBJIGVuZHBvaW50cyBmb3IgZGF0YXNvdXJjZSBjYXRlZ29yeScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlR2V0QXBpIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLWdldC1hcGknKVxuXG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCh7XG4gICAgICAgIGNhdGVnb3J5OiBBdXRoQ2F0ZWdvcnkuZGF0YXNvdXJjZSxcbiAgICAgICAgcHJvdmlkZXI6ICd0ZXN0LWRhdGFzb3VyY2UnLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgYXBpTWFwID0gdXNlR2V0QXBpKHBsdWdpblBheWxvYWQpXG5cbiAgICAgIGV4cGVjdChhcGlNYXAuZ2V0Q3JlZGVudGlhbEluZm8pLnRvQmUoJycpXG4gICAgICBleHBlY3QoYXBpTWFwLnNldERlZmF1bHRDcmVkZW50aWFsKS50b0JlKCcvYXV0aC9wbHVnaW4vZGF0YXNvdXJjZS90ZXN0LWRhdGFzb3VyY2UvZGVmYXVsdCcpXG4gICAgICBleHBlY3QoYXBpTWFwLmdldENyZWRlbnRpYWxzKS50b0JlKCcvYXV0aC9wbHVnaW4vZGF0YXNvdXJjZS90ZXN0LWRhdGFzb3VyY2UnKVxuICAgICAgZXhwZWN0KGFwaU1hcC5hZGRDcmVkZW50aWFsKS50b0JlKCcvYXV0aC9wbHVnaW4vZGF0YXNvdXJjZS90ZXN0LWRhdGFzb3VyY2UnKVxuICAgICAgZXhwZWN0KGFwaU1hcC51cGRhdGVDcmVkZW50aWFsKS50b0JlKCcvYXV0aC9wbHVnaW4vZGF0YXNvdXJjZS90ZXN0LWRhdGFzb3VyY2UvdXBkYXRlJylcbiAgICAgIGV4cGVjdChhcGlNYXAuZGVsZXRlQ3JlZGVudGlhbCkudG9CZSgnL2F1dGgvcGx1Z2luL2RhdGFzb3VyY2UvdGVzdC1kYXRhc291cmNlL2RlbGV0ZScpXG4gICAgICBleHBlY3QoYXBpTWFwLmdldE9hdXRoVXJsKS50b0JlKCcvb2F1dGgvcGx1Z2luL3Rlc3QtZGF0YXNvdXJjZS9kYXRhc291cmNlL2dldC1hdXRob3JpemF0aW9uLXVybCcpXG4gICAgICBleHBlY3QoYXBpTWFwLmdldE9hdXRoQ2xpZW50U2NoZW1hKS50b0JlKCcnKVxuICAgICAgZXhwZWN0KGFwaU1hcC5zZXRDdXN0b21PYXV0aENsaWVudCkudG9CZSgnL2F1dGgvcGx1Z2luL2RhdGFzb3VyY2UvdGVzdC1kYXRhc291cmNlL2N1c3RvbS1jbGllbnQnKVxuICAgICAgZXhwZWN0KGFwaU1hcC5kZWxldGVDdXN0b21PQXV0aENsaWVudCkudG9CZSgnL2F1dGgvcGx1Z2luL2RhdGFzb3VyY2UvdGVzdC1kYXRhc291cmNlL2N1c3RvbS1jbGllbnQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBzdHJpbmcgZm9yIGdldENyZWRlbnRpYWxTY2hlbWEgaW4gZGF0YXNvdXJjZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlR2V0QXBpIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLWdldC1hcGknKVxuXG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCh7XG4gICAgICAgIGNhdGVnb3J5OiBBdXRoQ2F0ZWdvcnkuZGF0YXNvdXJjZSxcbiAgICAgICAgcHJvdmlkZXI6ICd0ZXN0LWRhdGFzb3VyY2UnLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgYXBpTWFwID0gdXNlR2V0QXBpKHBsdWdpblBheWxvYWQpXG5cbiAgICAgIGV4cGVjdChhcGlNYXAuZ2V0Q3JlZGVudGlhbFNjaGVtYShDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWSkpLnRvQmUoJycpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnb3RoZXIgY2F0ZWdvcmllcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBlbXB0eSBzdHJpbmdzIGZvciBtb2RlbCBjYXRlZ29yeScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlR2V0QXBpIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLWdldC1hcGknKVxuXG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCh7XG4gICAgICAgIGNhdGVnb3J5OiBBdXRoQ2F0ZWdvcnkubW9kZWwsXG4gICAgICAgIHByb3ZpZGVyOiAndGVzdC1tb2RlbCcsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBhcGlNYXAgPSB1c2VHZXRBcGkocGx1Z2luUGF5bG9hZClcblxuICAgICAgZXhwZWN0KGFwaU1hcC5nZXRDcmVkZW50aWFsSW5mbykudG9CZSgnJylcbiAgICAgIGV4cGVjdChhcGlNYXAuc2V0RGVmYXVsdENyZWRlbnRpYWwpLnRvQmUoJycpXG4gICAgICBleHBlY3QoYXBpTWFwLmdldENyZWRlbnRpYWxzKS50b0JlKCcnKVxuICAgICAgZXhwZWN0KGFwaU1hcC5hZGRDcmVkZW50aWFsKS50b0JlKCcnKVxuICAgICAgZXhwZWN0KGFwaU1hcC51cGRhdGVDcmVkZW50aWFsKS50b0JlKCcnKVxuICAgICAgZXhwZWN0KGFwaU1hcC5kZWxldGVDcmVkZW50aWFsKS50b0JlKCcnKVxuICAgICAgZXhwZWN0KGFwaU1hcC5nZXRDcmVkZW50aWFsU2NoZW1hKENyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZKSkudG9CZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgc3RyaW5ncyBmb3IgdHJpZ2dlciBjYXRlZ29yeScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlR2V0QXBpIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLWdldC1hcGknKVxuXG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCh7XG4gICAgICAgIGNhdGVnb3J5OiBBdXRoQ2F0ZWdvcnkudHJpZ2dlcixcbiAgICAgICAgcHJvdmlkZXI6ICd0ZXN0LXRyaWdnZXInLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgYXBpTWFwID0gdXNlR2V0QXBpKHBsdWdpblBheWxvYWQpXG5cbiAgICAgIGV4cGVjdChhcGlNYXAuZ2V0Q3JlZGVudGlhbEluZm8pLnRvQmUoJycpXG4gICAgICBleHBlY3QoYXBpTWFwLnNldERlZmF1bHRDcmVkZW50aWFsKS50b0JlKCcnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2VkZ2UgY2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcHJvdmlkZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZUdldEFwaSB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1nZXQtYXBpJylcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoe1xuICAgICAgICBjYXRlZ29yeTogQXV0aENhdGVnb3J5LnRvb2wsXG4gICAgICAgIHByb3ZpZGVyOiAnJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGFwaU1hcCA9IHVzZUdldEFwaShwbHVnaW5QYXlsb2FkKVxuXG4gICAgICBleHBlY3QoYXBpTWFwLmdldENyZWRlbnRpYWxJbmZvKS50b0JlKCcvd29ya3NwYWNlcy9jdXJyZW50L3Rvb2wtcHJvdmlkZXIvYnVpbHRpbi8vY3JlZGVudGlhbC9pbmZvJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHByb3ZpZGVyIG5hbWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZUdldEFwaSB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1nZXQtYXBpJylcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoe1xuICAgICAgICBjYXRlZ29yeTogQXV0aENhdGVnb3J5LnRvb2wsXG4gICAgICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcl92MicsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBhcGlNYXAgPSB1c2VHZXRBcGkocGx1Z2luUGF5bG9hZClcblxuICAgICAgZXhwZWN0KGFwaU1hcC5nZXRDcmVkZW50aWFsSW5mbykudG9Db250YWluKCd0ZXN0LXByb3ZpZGVyX3YyJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gdXNlUGx1Z2luQXV0aCBIb29rIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgndXNlUGx1Z2luQXV0aCBIb29rJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSXNDdXJyZW50V29ya3NwYWNlTWFuYWdlci5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGlzQXV0aG9yaXplZCBmYWxzZSB3aGVuIG5vIGNyZWRlbnRpYWxzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aCB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aCcpXG5cbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVldLFxuICAgICAgYWxsb3dfY3VzdG9tX3Rva2VuOiB0cnVlLFxuICAgIH0pXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoKHBsdWdpblBheWxvYWQsIHRydWUpLCB7XG4gICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgfSlcblxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5pc0F1dGhvcml6ZWQpLnRvQmUoZmFsc2UpXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmNyZWRlbnRpYWxzKS50b0hhdmVMZW5ndGgoMClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJldHVybiBpc0F1dGhvcml6ZWQgdHJ1ZSB3aGVuIGNyZWRlbnRpYWxzIGV4aXN0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aCB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aCcpXG5cbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlYXRlQ3JlZGVudGlhbCgpXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVldLFxuICAgICAgYWxsb3dfY3VzdG9tX3Rva2VuOiB0cnVlLFxuICAgIH0pXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoKHBsdWdpblBheWxvYWQsIHRydWUpLCB7XG4gICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgfSlcblxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5pc0F1dGhvcml6ZWQpLnRvQmUodHJ1ZSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3JlZGVudGlhbHMpLnRvSGF2ZUxlbmd0aCgxKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGNhbk9BdXRoIHRydWUgd2hlbiBvYXV0aDIgaXMgc3VwcG9ydGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aCB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aCcpXG5cbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbQ3JlZGVudGlhbFR5cGVFbnVtLk9BVVRIMl0sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IHRydWUsXG4gICAgfSlcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVBsdWdpbkF1dGgocGx1Z2luUGF5bG9hZCwgdHJ1ZSksIHtcbiAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICB9KVxuXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmNhbk9BdXRoKS50b0JlKHRydWUpXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmNhbkFwaUtleSkudG9CZShmYWxzZSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJldHVybiBjYW5BcGlLZXkgdHJ1ZSB3aGVuIGFwaS1rZXkgaXMgc3VwcG9ydGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aCB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aCcpXG5cbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVldLFxuICAgICAgYWxsb3dfY3VzdG9tX3Rva2VuOiB0cnVlLFxuICAgIH0pXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoKHBsdWdpblBheWxvYWQsIHRydWUpLCB7XG4gICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgfSlcblxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jYW5PQXV0aCkudG9CZShmYWxzZSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY2FuQXBpS2V5KS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYm90aCBjYW5PQXV0aCBhbmQgY2FuQXBpS2V5IHdoZW4gYm90aCBzdXBwb3J0ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyB1c2VQbHVnaW5BdXRoIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLXBsdWdpbi1hdXRoJylcblxuICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsSW5mby5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgY3JlZGVudGlhbHM6IFtdLFxuICAgICAgc3VwcG9ydGVkX2NyZWRlbnRpYWxfdHlwZXM6IFtDcmVkZW50aWFsVHlwZUVudW0uT0FVVEgyLCBDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWV0sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IHRydWUsXG4gICAgfSlcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVBsdWdpbkF1dGgocGx1Z2luUGF5bG9hZCwgdHJ1ZSksIHtcbiAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICB9KVxuXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmNhbk9BdXRoKS50b0JlKHRydWUpXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmNhbkFwaUtleSkudG9CZSh0cnVlKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGRpc2FibGVkIHRydWUgd2hlbiB1c2VyIGlzIG5vdCB3b3Jrc3BhY2UgbWFuYWdlcicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHVzZVBsdWdpbkF1dGggfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtcGx1Z2luLWF1dGgnKVxuXG4gICAgbW9ja0lzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXIubW9ja1JldHVyblZhbHVlKGZhbHNlKVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aChwbHVnaW5QYXlsb2FkLCB0cnVlKSwge1xuICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgIH0pXG5cbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZGlzYWJsZWQpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJldHVybiBkaXNhYmxlZCBmYWxzZSB3aGVuIHVzZXIgaXMgd29ya3NwYWNlIG1hbmFnZXInLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyB1c2VQbHVnaW5BdXRoIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLXBsdWdpbi1hdXRoJylcblxuICAgIG1vY2tJc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aChwbHVnaW5QYXlsb2FkLCB0cnVlKSwge1xuICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgIH0pXG5cbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZGlzYWJsZWQpLnRvQmUoZmFsc2UpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gbm90QWxsb3dDdXN0b21DcmVkZW50aWFsIGJhc2VkIG9uIGFsbG93X2N1c3RvbV90b2tlbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHVzZVBsdWdpbkF1dGggfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtcGx1Z2luLWF1dGgnKVxuXG4gICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBjcmVkZW50aWFsczogW10sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW10sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IGZhbHNlLFxuICAgIH0pXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoKHBsdWdpblBheWxvYWQsIHRydWUpLCB7XG4gICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgfSlcblxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5ub3RBbGxvd0N1c3RvbUNyZWRlbnRpYWwpLnRvQmUodHJ1ZSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJldHVybiBpbnZhbGlkUGx1Z2luQ3JlZGVudGlhbEluZm8gZnVuY3Rpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyB1c2VQbHVnaW5BdXRoIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLXBsdWdpbi1hdXRoJylcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVBsdWdpbkF1dGgocGx1Z2luUGF5bG9hZCwgdHJ1ZSksIHtcbiAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICB9KVxuXG4gICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudC5pbnZhbGlkUGx1Z2luQ3JlZGVudGlhbEluZm8pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIG5vdCBmZXRjaCB3aGVuIGVuYWJsZSBpcyBmYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHVzZVBsdWdpbkF1dGggfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtcGx1Z2luLWF1dGgnKVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aChwbHVnaW5QYXlsb2FkLCBmYWxzZSksIHtcbiAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICB9KVxuXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmlzQXV0aG9yaXplZCkudG9CZShmYWxzZSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3JlZGVudGlhbHMpLnRvSGF2ZUxlbmd0aCgwKVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gdXNlUGx1Z2luQXV0aEFjdGlvbiBIb29rIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgndXNlUGx1Z2luQXV0aEFjdGlvbiBIb29rJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrRGVsZXRlUGx1Z2luQ3JlZGVudGlhbC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcbiAgICBtb2NrU2V0UGx1Z2luRGVmYXVsdENyZWRlbnRpYWwubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgbW9ja1VwZGF0ZVBsdWdpbkNyZWRlbnRpYWwubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gYWxsIGFjdGlvbiBoYW5kbGVycycsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHVzZVBsdWdpbkF1dGhBY3Rpb24gfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtcGx1Z2luLWF1dGgtYWN0aW9uJylcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVBsdWdpbkF1dGhBY3Rpb24ocGx1Z2luUGF5bG9hZCksIHtcbiAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICB9KVxuXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRvaW5nQWN0aW9uKS50b0JlKGZhbHNlKVxuICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQuaGFuZGxlU2V0RG9pbmdBY3Rpb24pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICBleHBlY3QodHlwZW9mIHJlc3VsdC5jdXJyZW50Lm9wZW5Db25maXJtKS50b0JlKCdmdW5jdGlvbicpXG4gICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudC5jbG9zZUNvbmZpcm0pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZGVsZXRlQ3JlZGVudGlhbElkKS50b0JlKG51bGwpXG4gICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudC5zZXREZWxldGVDcmVkZW50aWFsSWQpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICBleHBlY3QodHlwZW9mIHJlc3VsdC5jdXJyZW50LmhhbmRsZUNvbmZpcm0pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZWRpdFZhbHVlcykudG9CZShudWxsKVxuICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQuc2V0RWRpdFZhbHVlcykudG9CZSgnZnVuY3Rpb24nKVxuICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQuaGFuZGxlRWRpdCkudG9CZSgnZnVuY3Rpb24nKVxuICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQuaGFuZGxlUmVtb3ZlKS50b0JlKCdmdW5jdGlvbicpXG4gICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudC5oYW5kbGVTZXREZWZhdWx0KS50b0JlKCdmdW5jdGlvbicpXG4gICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudC5oYW5kbGVSZW5hbWUpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIG9wZW4gYW5kIGNsb3NlIGNvbmZpcm0gZGlhbG9nJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aEFjdGlvbiB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aC1hY3Rpb24nKVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aEFjdGlvbihwbHVnaW5QYXlsb2FkKSwge1xuICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgIH0pXG5cbiAgICBhY3QoKCkgPT4ge1xuICAgICAgcmVzdWx0LmN1cnJlbnQub3BlbkNvbmZpcm0oJ3Rlc3QtY3JlZGVudGlhbC1pZCcpXG4gICAgfSlcblxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kZWxldGVDcmVkZW50aWFsSWQpLnRvQmUoJ3Rlc3QtY3JlZGVudGlhbC1pZCcpXG5cbiAgICBhY3QoKCkgPT4ge1xuICAgICAgcmVzdWx0LmN1cnJlbnQuY2xvc2VDb25maXJtKClcbiAgICB9KVxuXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRlbGV0ZUNyZWRlbnRpYWxJZCkudG9CZShudWxsKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIGVkaXQgd2l0aCB2YWx1ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyB1c2VQbHVnaW5BdXRoQWN0aW9uIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLXBsdWdpbi1hdXRoLWFjdGlvbicpXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoQWN0aW9uKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgfSlcblxuICAgIGNvbnN0IGVkaXRWYWx1ZXMgPSB7IGtleTogJ3ZhbHVlJyB9XG5cbiAgICBhY3QoKCkgPT4ge1xuICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlRWRpdCgndGVzdC1pZCcsIGVkaXRWYWx1ZXMpXG4gICAgfSlcblxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5lZGl0VmFsdWVzKS50b0VxdWFsKGVkaXRWYWx1ZXMpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgY29uZmlybSBkZWxldGUnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyB1c2VQbHVnaW5BdXRoQWN0aW9uIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLXBsdWdpbi1hdXRoLWFjdGlvbicpXG5cbiAgICBjb25zdCBvblVwZGF0ZSA9IHZpLmZuKClcbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoQWN0aW9uKHBsdWdpblBheWxvYWQsIG9uVXBkYXRlKSwge1xuICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgIH0pXG5cbiAgICBhY3QoKCkgPT4ge1xuICAgICAgcmVzdWx0LmN1cnJlbnQub3BlbkNvbmZpcm0oJ3Rlc3QtY3JlZGVudGlhbC1pZCcpXG4gICAgfSlcblxuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCByZXN1bHQuY3VycmVudC5oYW5kbGVDb25maXJtKClcbiAgICB9KVxuXG4gICAgZXhwZWN0KG1vY2tEZWxldGVQbHVnaW5DcmVkZW50aWFsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IGNyZWRlbnRpYWxfaWQ6ICd0ZXN0LWNyZWRlbnRpYWwtaWQnIH0pXG4gICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgIG1lc3NhZ2U6ICdjb21tb24uYXBpLmFjdGlvblN1Y2Nlc3MnLFxuICAgIH0pXG4gICAgZXhwZWN0KG9uVXBkYXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZGVsZXRlQ3JlZGVudGlhbElkKS50b0JlKG51bGwpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBub3QgY29uZmlybSBkZWxldGUgd2hlbiBubyBjcmVkZW50aWFsIGlkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aEFjdGlvbiB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aC1hY3Rpb24nKVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aEFjdGlvbihwbHVnaW5QYXlsb2FkKSwge1xuICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgIH0pXG5cbiAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgcmVzdWx0LmN1cnJlbnQuaGFuZGxlQ29uZmlybSgpXG4gICAgfSlcblxuICAgIGV4cGVjdChtb2NrRGVsZXRlUGx1Z2luQ3JlZGVudGlhbCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHNldCBkZWZhdWx0JywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aEFjdGlvbiB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aC1hY3Rpb24nKVxuXG4gICAgY29uc3Qgb25VcGRhdGUgPSB2aS5mbigpXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aEFjdGlvbihwbHVnaW5QYXlsb2FkLCBvblVwZGF0ZSksIHtcbiAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICB9KVxuXG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHJlc3VsdC5jdXJyZW50LmhhbmRsZVNldERlZmF1bHQoJ3Rlc3QtY3JlZGVudGlhbC1pZCcpXG4gICAgfSlcblxuICAgIGV4cGVjdChtb2NrU2V0UGx1Z2luRGVmYXVsdENyZWRlbnRpYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0ZXN0LWNyZWRlbnRpYWwtaWQnKVxuICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICBtZXNzYWdlOiAnY29tbW9uLmFwaS5hY3Rpb25TdWNjZXNzJyxcbiAgICB9KVxuICAgIGV4cGVjdChvblVwZGF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgcmVuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aEFjdGlvbiB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aC1hY3Rpb24nKVxuXG4gICAgY29uc3Qgb25VcGRhdGUgPSB2aS5mbigpXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aEFjdGlvbihwbHVnaW5QYXlsb2FkLCBvblVwZGF0ZSksIHtcbiAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICB9KVxuXG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHJlc3VsdC5jdXJyZW50LmhhbmRsZVJlbmFtZSh7XG4gICAgICAgIGNyZWRlbnRpYWxfaWQ6ICd0ZXN0LWNyZWRlbnRpYWwtaWQnLFxuICAgICAgICBuYW1lOiAnTmV3IE5hbWUnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZXhwZWN0KG1vY2tVcGRhdGVQbHVnaW5DcmVkZW50aWFsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICBjcmVkZW50aWFsX2lkOiAndGVzdC1jcmVkZW50aWFsLWlkJyxcbiAgICAgIG5hbWU6ICdOZXcgTmFtZScsXG4gICAgfSlcbiAgICBleHBlY3QobW9ja05vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgbWVzc2FnZTogJ2NvbW1vbi5hcGkuYWN0aW9uU3VjY2VzcycsXG4gICAgfSlcbiAgICBleHBlY3Qob25VcGRhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcHJldmVudCBjb25jdXJyZW50IGFjdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyB1c2VQbHVnaW5BdXRoQWN0aW9uIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLXBsdWdpbi1hdXRoLWFjdGlvbicpXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoQWN0aW9uKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgfSlcblxuICAgIGFjdCgoKSA9PiB7XG4gICAgICByZXN1bHQuY3VycmVudC5oYW5kbGVTZXREb2luZ0FjdGlvbih0cnVlKVxuICAgIH0pXG5cbiAgICBhY3QoKCkgPT4ge1xuICAgICAgcmVzdWx0LmN1cnJlbnQub3BlbkNvbmZpcm0oJ3Rlc3QtY3JlZGVudGlhbC1pZCcpXG4gICAgfSlcblxuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCByZXN1bHQuY3VycmVudC5oYW5kbGVDb25maXJtKClcbiAgICB9KVxuXG4gICAgLy8gU2hvdWxkIG5vdCBjYWxsIGRlbGV0ZSB3aGVuIGFscmVhZHkgZG9pbmcgYWN0aW9uXG4gICAgZXhwZWN0KG1vY2tEZWxldGVQbHVnaW5DcmVkZW50aWFsKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgcmVtb3ZlIGFmdGVyIGVkaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgeyB1c2VQbHVnaW5BdXRoQWN0aW9uIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLXBsdWdpbi1hdXRoLWFjdGlvbicpXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoQWN0aW9uKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgfSlcblxuICAgIGFjdCgoKSA9PiB7XG4gICAgICByZXN1bHQuY3VycmVudC5oYW5kbGVFZGl0KCd0ZXN0LWNyZWRlbnRpYWwtaWQnLCB7IGtleTogJ3ZhbHVlJyB9KVxuICAgIH0pXG5cbiAgICBhY3QoKCkgPT4ge1xuICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlUmVtb3ZlKClcbiAgICB9KVxuXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRlbGV0ZUNyZWRlbnRpYWxJZCkudG9CZSgndGVzdC1jcmVkZW50aWFsLWlkJylcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFBsdWdpbkF1dGggQ29tcG9uZW50IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnUGx1Z2luQXV0aCBDb21wb25lbnQnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tJc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsSW5mby5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgY3JlZGVudGlhbHM6IFtdLFxuICAgICAgc3VwcG9ydGVkX2NyZWRlbnRpYWxfdHlwZXM6IFtDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWV0sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IHRydWUsXG4gICAgfSlcbiAgICBtb2NrR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWEubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIHNjaGVtYTogW10sXG4gICAgICBpc19vYXV0aF9jdXN0b21fY2xpZW50X2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgaXNfc3lzdGVtX29hdXRoX3BhcmFtc19leGlzdHM6IGZhbHNlLFxuICAgIH0pXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgQXV0aG9yaXplIHdoZW4gbm90IGF1dGhvcml6ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgUGx1Z2luQXV0aCA9IChhd2FpdCBpbXBvcnQoJy4vcGx1Z2luLWF1dGgnKSkuZGVmYXVsdFxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPFBsdWdpbkF1dGggcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sXG4gICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgIClcblxuICAgIC8vIFNob3VsZCByZW5kZXIgYXV0aG9yaXplIGJ1dHRvblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIEF1dGhvcml6ZWQgd2hlbiBhdXRob3JpemVkIGFuZCBubyBjaGlsZHJlbicsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBQbHVnaW5BdXRoID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aCcpKS5kZWZhdWx0XG5cbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlYXRlQ3JlZGVudGlhbCgpXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVldLFxuICAgICAgYWxsb3dfY3VzdG9tX3Rva2VuOiB0cnVlLFxuICAgIH0pXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICByZW5kZXIoXG4gICAgICA8UGx1Z2luQXV0aCBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPixcbiAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgKVxuXG4gICAgLy8gU2hvdWxkIHJlbmRlciBhdXRob3JpemVkIGNvbnRlbnRcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciBjaGlsZHJlbiB3aGVuIGF1dGhvcml6ZWQgYW5kIGNoaWxkcmVuIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGggPSAoYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoJykpLmRlZmF1bHRcblxuICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsSW5mby5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgY3JlZGVudGlhbHM6IFtjcmVhdGVDcmVkZW50aWFsKCldLFxuICAgICAgc3VwcG9ydGVkX2NyZWRlbnRpYWxfdHlwZXM6IFtDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWV0sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IHRydWUsXG4gICAgfSlcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIHJlbmRlcihcbiAgICAgIDxQbHVnaW5BdXRoIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9PlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY3VzdG9tLWNoaWxkcmVuXCI+Q3VzdG9tIENvbnRlbnQ8L2Rpdj5cbiAgICAgIDwvUGx1Z2luQXV0aD4sXG4gICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgIClcblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1jaGlsZHJlbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0N1c3RvbSBDb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGFwcGx5IGNsYXNzTmFtZSB3aGVuIG5vdCBhdXRob3JpemVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGggPSAoYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoJykpLmRlZmF1bHRcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICA8UGx1Z2luQXV0aCBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSBjbGFzc05hbWU9XCJjdXN0b20tY2xhc3NcIiAvPixcbiAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgKVxuXG4gICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnY3VzdG9tLWNsYXNzJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIG5vdCBhcHBseSBjbGFzc05hbWUgd2hlbiBhdXRob3JpemVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGggPSAoYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoJykpLmRlZmF1bHRcblxuICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsSW5mby5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgY3JlZGVudGlhbHM6IFtjcmVhdGVDcmVkZW50aWFsKCldLFxuICAgICAgc3VwcG9ydGVkX2NyZWRlbnRpYWxfdHlwZXM6IFtDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWV0sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IHRydWUsXG4gICAgfSlcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICA8UGx1Z2luQXV0aCBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSBjbGFzc05hbWU9XCJjdXN0b20tY2xhc3NcIiAvPixcbiAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgKVxuXG4gICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS5ub3QudG9IYXZlQ2xhc3MoJ2N1c3RvbS1jbGFzcycpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBQbHVnaW5BdXRoTW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoJylcbiAgICBleHBlY3QodHlwZW9mIFBsdWdpbkF1dGhNb2R1bGUuZGVmYXVsdCkudG9CZSgnb2JqZWN0JylcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFBsdWdpbkF1dGhJbkFnZW50IENvbXBvbmVudCBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1BsdWdpbkF1dGhJbkFnZW50IENvbXBvbmVudCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0lzQ3VycmVudFdvcmtzcGFjZU1hbmFnZXIubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBjcmVkZW50aWFsczogW2NyZWF0ZUNyZWRlbnRpYWwoKV0sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgc2NoZW1hOiBbXSxcbiAgICAgIGlzX29hdXRoX2N1c3RvbV9jbGllbnRfZW5hYmxlZDogZmFsc2UsXG4gICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciBBdXRob3JpemUgd2hlbiBub3QgYXV0aG9yaXplZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBQbHVnaW5BdXRoSW5BZ2VudCA9IChhd2FpdCBpbXBvcnQoJy4vcGx1Z2luLWF1dGgtaW4tYWdlbnQnKSkuZGVmYXVsdFxuXG4gICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBjcmVkZW50aWFsczogW10sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPFBsdWdpbkF1dGhJbkFnZW50IHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LFxuICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICApXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciBBdXRob3JpemVkIHdpdGggd29ya3NwYWNlIGRlZmF1bHQgd2hlbiBhdXRob3JpemVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkFnZW50ID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1hZ2VudCcpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICByZW5kZXIoXG4gICAgICA8UGx1Z2luQXV0aEluQWdlbnQgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sXG4gICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgIClcblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uYXV0aC53b3Jrc3BhY2VEZWZhdWx0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHNob3cgY3JlZGVudGlhbCBuYW1lIHdoZW4gY3JlZGVudGlhbElkIGlzIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkFnZW50ID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1hZ2VudCcpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBjcmVkZW50aWFsID0gY3JlYXRlQ3JlZGVudGlhbCh7IGlkOiAnc2VsZWN0ZWQtaWQnLCBuYW1lOiAnU2VsZWN0ZWQgQ3JlZGVudGlhbCcgfSlcbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlZGVudGlhbF0sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPFBsdWdpbkF1dGhJbkFnZW50XG4gICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgIGNyZWRlbnRpYWxJZD1cInNlbGVjdGVkLWlkXCJcbiAgICAgIC8+LFxuICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICApXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2VsZWN0ZWQgQ3JlZGVudGlhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBzaG93IGF1dGggcmVtb3ZlZCB3aGVuIGNyZWRlbnRpYWwgbm90IGZvdW5kJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkFnZW50ID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1hZ2VudCcpKS5kZWZhdWx0XG5cbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlYXRlQ3JlZGVudGlhbCgpXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVldLFxuICAgICAgYWxsb3dfY3VzdG9tX3Rva2VuOiB0cnVlLFxuICAgIH0pXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICByZW5kZXIoXG4gICAgICA8UGx1Z2luQXV0aEluQWdlbnRcbiAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgY3JlZGVudGlhbElkPVwibm9uLWV4aXN0ZW50LWlkXCJcbiAgICAgIC8+LFxuICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICApXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguYXV0aFJlbW92ZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgc2hvdyB1bmF2YWlsYWJsZSB3aGVuIGNyZWRlbnRpYWwgaXMgbm90IGFsbG93ZWQgdG8gdXNlJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkFnZW50ID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1hZ2VudCcpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBjcmVkZW50aWFsID0gY3JlYXRlQ3JlZGVudGlhbCh7XG4gICAgICBpZDogJ3VuYXZhaWxhYmxlLWlkJyxcbiAgICAgIG5hbWU6ICdVbmF2YWlsYWJsZSBDcmVkZW50aWFsJyxcbiAgICAgIG5vdF9hbGxvd2VkX3RvX3VzZTogdHJ1ZSxcbiAgICAgIGZyb21fZW50ZXJwcmlzZTogZmFsc2UsXG4gICAgfSlcbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlZGVudGlhbF0sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPFBsdWdpbkF1dGhJbkFnZW50XG4gICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgIGNyZWRlbnRpYWxJZD1cInVuYXZhaWxhYmxlLWlkXCJcbiAgICAgIC8+LFxuICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICApXG5cbiAgICAvLyBDaGVjayB0aGF0IGJ1dHRvbiB0ZXh0IGNvbnRhaW5zIHVuYXZhaWxhYmxlXG4gICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICBleHBlY3QoYnV0dG9uLnRleHRDb250ZW50KS50b0NvbnRhaW4oJ3BsdWdpbi5hdXRoLnVuYXZhaWxhYmxlJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNhbGwgb25BdXRob3JpemF0aW9uSXRlbUNsaWNrIHdoZW4gaXRlbSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkFnZW50ID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1hZ2VudCcpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2sgPSB2aS5mbigpXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPFBsdWdpbkF1dGhJbkFnZW50XG4gICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgIG9uQXV0aG9yaXphdGlvbkl0ZW1DbGljaz17b25BdXRob3JpemF0aW9uSXRlbUNsaWNrfVxuICAgICAgLz4sXG4gICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgIClcblxuICAgIC8vIENsaWNrIHRvIG9wZW4gcG9wdXBcbiAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICBmaXJlRXZlbnQuY2xpY2soYnV0dG9uc1swXSlcblxuICAgIC8vIFZlcmlmeSBwb3B1cCBpcyBvcGVuZWQgKHRoZXJlIHdpbGwgYmUgbXVsdGlwbGUgYnV0dG9ucyBhZnRlciBvcGVuaW5nKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgdHJpZ2dlciBoYW5kbGVBdXRob3JpemF0aW9uSXRlbUNsaWNrIGFuZCBjbG9zZSBwb3B1cCB3aGVuIGF1dGhvcml6YXRpb24gaXRlbSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkFnZW50ID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1hZ2VudCcpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2sgPSB2aS5mbigpXG4gICAgY29uc3QgY3JlZGVudGlhbCA9IGNyZWF0ZUNyZWRlbnRpYWwoeyBpZDogJ3Rlc3QtY3JlZC1pZCcsIG5hbWU6ICdUZXN0IENyZWRlbnRpYWwnIH0pXG4gICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBjcmVkZW50aWFsczogW2NyZWRlbnRpYWxdLFxuICAgICAgc3VwcG9ydGVkX2NyZWRlbnRpYWxfdHlwZXM6IFtDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWV0sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IHRydWUsXG4gICAgfSlcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIHJlbmRlcihcbiAgICAgIDxQbHVnaW5BdXRoSW5BZ2VudFxuICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICBvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2s9e29uQXV0aG9yaXphdGlvbkl0ZW1DbGlja31cbiAgICAgIC8+LFxuICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICApXG5cbiAgICAvLyBDbGljayB0cmlnZ2VyIGJ1dHRvbiB0byBvcGVuIHBvcHVwXG4gICAgY29uc3QgdHJpZ2dlckJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgZmlyZUV2ZW50LmNsaWNrKHRyaWdnZXJCdXR0b24pXG5cbiAgICAvLyBGaW5kIGFuZCBjbGljayB0aGUgd29ya3NwYWNlIGRlZmF1bHQgaXRlbSBpbiB0aGUgZHJvcGRvd25cbiAgICAvLyBUaGVyZSB3aWxsIGJlIG11bHRpcGxlIGVsZW1lbnRzIHdpdGggdGhpcyB0ZXh0LCB3ZSBuZWVkIHRoZSBvbmUgaW4gdGhlIHBvcHVwIChub3QgdGhlIHRyaWdnZXIpXG4gICAgY29uc3Qgd29ya3NwYWNlRGVmYXVsdEl0ZW1zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgncGx1Z2luLmF1dGgud29ya3NwYWNlRGVmYXVsdCcpXG4gICAgLy8gVGhlIHNlY29uZCBvbmUgaXMgaW4gdGhlIHBvcHVwIGxpc3QgKGZpcnN0IG9uZSBpcyB0aGUgdHJpZ2dlciBidXR0b24pXG4gICAgY29uc3QgcG9wdXBJdGVtID0gd29ya3NwYWNlRGVmYXVsdEl0ZW1zLmxlbmd0aCA+IDEgPyB3b3Jrc3BhY2VEZWZhdWx0SXRlbXNbMV0gOiB3b3Jrc3BhY2VEZWZhdWx0SXRlbXNbMF1cbiAgICBmaXJlRXZlbnQuY2xpY2socG9wdXBJdGVtKVxuXG4gICAgLy8gVmVyaWZ5IG9uQXV0aG9yaXphdGlvbkl0ZW1DbGljayB3YXMgY2FsbGVkIHdpdGggZW1wdHkgc3RyaW5nIGZvciB3b3Jrc3BhY2UgZGVmYXVsdFxuICAgIGV4cGVjdChvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcnKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgY2FsbCBvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2sgd2l0aCBjcmVkZW50aWFsIGlkIHdoZW4gc3BlY2lmaWMgY3JlZGVudGlhbCBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkFnZW50ID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1hZ2VudCcpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2sgPSB2aS5mbigpXG4gICAgY29uc3QgY3JlZGVudGlhbCA9IGNyZWF0ZUNyZWRlbnRpYWwoe1xuICAgICAgaWQ6ICdzcGVjaWZpYy1jcmVkLWlkJyxcbiAgICAgIG5hbWU6ICdTcGVjaWZpYyBDcmVkZW50aWFsJyxcbiAgICAgIGNyZWRlbnRpYWxfdHlwZTogQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVksXG4gICAgfSlcbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlZGVudGlhbF0sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPFBsdWdpbkF1dGhJbkFnZW50XG4gICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgIG9uQXV0aG9yaXphdGlvbkl0ZW1DbGljaz17b25BdXRob3JpemF0aW9uSXRlbUNsaWNrfVxuICAgICAgLz4sXG4gICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgIClcblxuICAgIC8vIENsaWNrIHRyaWdnZXIgYnV0dG9uIHRvIG9wZW4gcG9wdXBcbiAgICBjb25zdCB0cmlnZ2VyQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICBmaXJlRXZlbnQuY2xpY2sodHJpZ2dlckJ1dHRvbilcblxuICAgIC8vIEZpbmQgYW5kIGNsaWNrIHRoZSBzcGVjaWZpYyBjcmVkZW50aWFsIGl0ZW0gLSB0aGVyZSBtaWdodCBiZSBtdWx0aXBsZSBcIlNwZWNpZmljIENyZWRlbnRpYWxcIiB0ZXh0c1xuICAgIGNvbnN0IGNyZWRlbnRpYWxJdGVtcyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJ1NwZWNpZmljIENyZWRlbnRpYWwnKVxuICAgIC8vIENsaWNrIHRoZSBvbmUgaW4gdGhlIHBvcHVwICh1c3VhbGx5IHRoZSBsYXN0IG9uZSBpZiB0cmlnZ2VyIHNob3dzIGRpZmZlcmVudCB0ZXh0KVxuICAgIGNvbnN0IHBvcHVwSXRlbSA9IGNyZWRlbnRpYWxJdGVtc1tjcmVkZW50aWFsSXRlbXMubGVuZ3RoIC0gMV1cbiAgICBmaXJlRXZlbnQuY2xpY2socG9wdXBJdGVtKVxuXG4gICAgLy8gVmVyaWZ5IG9uQXV0aG9yaXphdGlvbkl0ZW1DbGljayB3YXMgY2FsbGVkIHdpdGggdGhlIGNyZWRlbnRpYWwgaWRcbiAgICBleHBlY3Qob25BdXRob3JpemF0aW9uSXRlbUNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnc3BlY2lmaWMtY3JlZC1pZCcpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBQbHVnaW5BdXRoSW5BZ2VudE1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1hZ2VudCcpXG4gICAgZXhwZWN0KHR5cGVvZiBQbHVnaW5BdXRoSW5BZ2VudE1vZHVsZS5kZWZhdWx0KS50b0JlKCdvYmplY3QnKVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGUgQ29tcG9uZW50IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGUgQ29tcG9uZW50JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciBjb25uZWN0IGJ1dHRvbiB3aGVuIG5vdCBhdXRob3JpemVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkRhdGFTb3VyY2VOb2RlID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1kYXRhc291cmNlLW5vZGUnKSkuZGVmYXVsdFxuXG4gICAgY29uc3Qgb25KdW1wVG9EYXRhU291cmNlUGFnZSA9IHZpLmZuKClcblxuICAgIHJlbmRlcihcbiAgICAgIDxQbHVnaW5BdXRoSW5EYXRhU291cmNlTm9kZVxuICAgICAgICBpc0F1dGhvcml6ZWQ9e2ZhbHNlfVxuICAgICAgICBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlPXtvbkp1bXBUb0RhdGFTb3VyY2VQYWdlfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICBleHBlY3QoYnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5pbnRlZ3JhdGlvbnMuY29ubmVjdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBjYWxsIG9uSnVtcFRvRGF0YVNvdXJjZVBhZ2Ugd2hlbiBjb25uZWN0IGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkRhdGFTb3VyY2VOb2RlID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1kYXRhc291cmNlLW5vZGUnKSkuZGVmYXVsdFxuXG4gICAgY29uc3Qgb25KdW1wVG9EYXRhU291cmNlUGFnZSA9IHZpLmZuKClcblxuICAgIHJlbmRlcihcbiAgICAgIDxQbHVnaW5BdXRoSW5EYXRhU291cmNlTm9kZVxuICAgICAgICBpc0F1dGhvcml6ZWQ9e2ZhbHNlfVxuICAgICAgICBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlPXtvbkp1bXBUb0RhdGFTb3VyY2VQYWdlfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuICAgIGV4cGVjdChvbkp1bXBUb0RhdGFTb3VyY2VQYWdlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciBjaGlsZHJlbiB3aGVuIGF1dGhvcml6ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoLWluLWRhdGFzb3VyY2Utbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlID0gdmkuZm4oKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPFBsdWdpbkF1dGhJbkRhdGFTb3VyY2VOb2RlXG4gICAgICAgIGlzQXV0aG9yaXplZD17dHJ1ZX1cbiAgICAgICAgb25KdW1wVG9EYXRhU291cmNlUGFnZT17b25KdW1wVG9EYXRhU291cmNlUGFnZX1cbiAgICAgID5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImNoaWxkcmVuLWNvbnRlbnRcIj5BdXRob3JpemVkIENvbnRlbnQ8L2Rpdj5cbiAgICAgIDwvUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGU+LFxuICAgIClcblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoaWxkcmVuLWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBdXRob3JpemVkIENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbm90IHJlbmRlciBjb25uZWN0IGJ1dHRvbiB3aGVuIGF1dGhvcml6ZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoLWluLWRhdGFzb3VyY2Utbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlID0gdmkuZm4oKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPFBsdWdpbkF1dGhJbkRhdGFTb3VyY2VOb2RlXG4gICAgICAgIGlzQXV0aG9yaXplZD17dHJ1ZX1cbiAgICAgICAgb25KdW1wVG9EYXRhU291cmNlUGFnZT17b25KdW1wVG9EYXRhU291cmNlUGFnZX1cbiAgICAgIC8+LFxuICAgIClcblxuICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgbm90IHJlbmRlciBjaGlsZHJlbiB3aGVuIG5vdCBhdXRob3JpemVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkRhdGFTb3VyY2VOb2RlID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1kYXRhc291cmNlLW5vZGUnKSkuZGVmYXVsdFxuXG4gICAgY29uc3Qgb25KdW1wVG9EYXRhU291cmNlUGFnZSA9IHZpLmZuKClcblxuICAgIHJlbmRlcihcbiAgICAgIDxQbHVnaW5BdXRoSW5EYXRhU291cmNlTm9kZVxuICAgICAgICBpc0F1dGhvcml6ZWQ9e2ZhbHNlfVxuICAgICAgICBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlPXtvbkp1bXBUb0RhdGFTb3VyY2VQYWdlfVxuICAgICAgPlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY2hpbGRyZW4tY29udGVudFwiPkF1dGhvcml6ZWQgQ29udGVudDwvZGl2PlxuICAgICAgPC9QbHVnaW5BdXRoSW5EYXRhU291cmNlTm9kZT4sXG4gICAgKVxuXG4gICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdjaGlsZHJlbi1jb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGlzQXV0aG9yaXplZCAoZmFsc3kpJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkRhdGFTb3VyY2VOb2RlID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aC1pbi1kYXRhc291cmNlLW5vZGUnKSkuZGVmYXVsdFxuXG4gICAgY29uc3Qgb25KdW1wVG9EYXRhU291cmNlUGFnZSA9IHZpLmZuKClcblxuICAgIHJlbmRlcihcbiAgICAgIDxQbHVnaW5BdXRoSW5EYXRhU291cmNlTm9kZVxuICAgICAgICBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlPXtvbkp1bXBUb0RhdGFTb3VyY2VQYWdlfVxuICAgICAgPlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY2hpbGRyZW4tY29udGVudFwiPkNvbnRlbnQ8L2Rpdj5cbiAgICAgIDwvUGx1Z2luQXV0aEluRGF0YVNvdXJjZU5vZGU+LFxuICAgIClcblxuICAgIC8vIGlzQXV0aG9yaXplZCBpcyB1bmRlZmluZWQsIHdoaWNoIGlzIGZhbHN5LCBzbyBjb25uZWN0IGJ1dHRvbiBzaG91bGQgYmUgc2hvd25cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NoaWxkcmVuLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGJlIG1lbW9pemVkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IFBsdWdpbkF1dGhJbkRhdGFTb3VyY2VOb2RlTW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoLWluLWRhdGFzb3VyY2Utbm9kZScpXG4gICAgZXhwZWN0KHR5cGVvZiBQbHVnaW5BdXRoSW5EYXRhU291cmNlTm9kZU1vZHVsZS5kZWZhdWx0KS50b0JlKCdvYmplY3QnKVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gQXV0aG9yaXplZEluRGF0YVNvdXJjZU5vZGUgQ29tcG9uZW50IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnQXV0aG9yaXplZEluRGF0YVNvdXJjZU5vZGUgQ29tcG9uZW50JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHNpbmd1bGFyIGF1dGhvcml6YXRpb24gdGV4dCB3aGVuIGF1dGhvcml6YXRpb25zTnVtIGlzIDEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgQXV0aG9yaXplZEluRGF0YVNvdXJjZU5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tZGF0YS1zb3VyY2Utbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlID0gdmkuZm4oKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPEF1dGhvcml6ZWRJbkRhdGFTb3VyY2VOb2RlXG4gICAgICAgIGF1dGhvcml6YXRpb25zTnVtPXsxfVxuICAgICAgICBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlPXtvbkp1bXBUb0RhdGFTb3VyY2VQYWdlfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLmF1dGhvcml6YXRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggcGx1cmFsIGF1dGhvcml6YXRpb25zIHRleHQgd2hlbiBhdXRob3JpemF0aW9uc051bSA+IDEnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgQXV0aG9yaXplZEluRGF0YVNvdXJjZU5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tZGF0YS1zb3VyY2Utbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlID0gdmkuZm4oKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPEF1dGhvcml6ZWRJbkRhdGFTb3VyY2VOb2RlXG4gICAgICAgIGF1dGhvcml6YXRpb25zTnVtPXszfVxuICAgICAgICBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlPXtvbkp1bXBUb0RhdGFTb3VyY2VQYWdlfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLmF1dGhvcml6YXRpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNhbGwgb25KdW1wVG9EYXRhU291cmNlUGFnZSB3aGVuIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IEF1dGhvcml6ZWRJbkRhdGFTb3VyY2VOb2RlID0gKGF3YWl0IGltcG9ydCgnLi9hdXRob3JpemVkLWluLWRhdGEtc291cmNlLW5vZGUnKSkuZGVmYXVsdFxuXG4gICAgY29uc3Qgb25KdW1wVG9EYXRhU291cmNlUGFnZSA9IHZpLmZuKClcblxuICAgIHJlbmRlcihcbiAgICAgIDxBdXRob3JpemVkSW5EYXRhU291cmNlTm9kZVxuICAgICAgICBhdXRob3JpemF0aW9uc051bT17MX1cbiAgICAgICAgb25KdW1wVG9EYXRhU291cmNlUGFnZT17b25KdW1wVG9EYXRhU291cmNlUGFnZX1cbiAgICAgIC8+LFxuICAgIClcblxuICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcbiAgICBleHBlY3Qob25KdW1wVG9EYXRhU291cmNlUGFnZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBncmVlbiBpbmRpY2F0b3InLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgQXV0aG9yaXplZEluRGF0YVNvdXJjZU5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tZGF0YS1zb3VyY2Utbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgPEF1dGhvcml6ZWRJbkRhdGFTb3VyY2VOb2RlXG4gICAgICAgIGF1dGhvcml6YXRpb25zTnVtPXsxfVxuICAgICAgICBvbkp1bXBUb0RhdGFTb3VyY2VQYWdlPXt2aS5mbigpfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgLy8gQ2hlY2sgdGhhdCBpbmRpY2F0b3IgY29tcG9uZW50IGlzIHJlbmRlcmVkXG4gICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubXItMVxcXFwuNScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgYXV0aG9yaXphdGlvbnNOdW0gb2YgMCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBBdXRob3JpemVkSW5EYXRhU291cmNlTm9kZSA9IChhd2FpdCBpbXBvcnQoJy4vYXV0aG9yaXplZC1pbi1kYXRhLXNvdXJjZS1ub2RlJykpLmRlZmF1bHRcblxuICAgIHJlbmRlcihcbiAgICAgIDxBdXRob3JpemVkSW5EYXRhU291cmNlTm9kZVxuICAgICAgICBhdXRob3JpemF0aW9uc051bT17MH1cbiAgICAgICAgb25KdW1wVG9EYXRhU291cmNlUGFnZT17dmkuZm4oKX1cbiAgICAgIC8+LFxuICAgIClcblxuICAgIC8vIDAgaXMgbm90ID4gMSwgc28gc2hvdWxkIHNob3cgc2luZ3VsYXJcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmF1dGguYXV0aG9yaXphdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBBdXRob3JpemVkSW5EYXRhU291cmNlTm9kZU1vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi9hdXRob3JpemVkLWluLWRhdGEtc291cmNlLW5vZGUnKVxuICAgIGV4cGVjdCh0eXBlb2YgQXV0aG9yaXplZEluRGF0YVNvdXJjZU5vZGVNb2R1bGUuZGVmYXVsdCkudG9CZSgnb2JqZWN0JylcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IEF1dGhvcml6ZWRJbk5vZGUgQ29tcG9uZW50IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnQXV0aG9yaXplZEluTm9kZSBDb21wb25lbnQnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tJc0N1cnJlbnRXb3Jrc3BhY2VNYW5hZ2VyLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsSW5mby5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgY3JlZGVudGlhbHM6IFtjcmVhdGVDcmVkZW50aWFsKHsgaXNfZGVmYXVsdDogdHJ1ZSB9KV0sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuICAgIG1vY2tHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgc2NoZW1hOiBbXSxcbiAgICAgIGlzX29hdXRoX2N1c3RvbV9jbGllbnRfZW5hYmxlZDogZmFsc2UsXG4gICAgICBpc19zeXN0ZW1fb2F1dGhfcGFyYW1zX2V4aXN0czogZmFsc2UsXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHdvcmtzcGFjZSBkZWZhdWx0IHdoZW4gbm8gY3JlZGVudGlhbElkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IEF1dGhvcml6ZWRJbk5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICByZW5kZXIoXG4gICAgICA8QXV0aG9yaXplZEluTm9kZVxuICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICBvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2s9e3ZpLmZuKCl9XG4gICAgICAvPixcbiAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgKVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLndvcmtzcGFjZURlZmF1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIGNyZWRlbnRpYWwgbmFtZSB3aGVuIGNyZWRlbnRpYWxJZCBtYXRjaGVzJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IEF1dGhvcml6ZWRJbk5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBjcmVkZW50aWFsID0gY3JlYXRlQ3JlZGVudGlhbCh7IGlkOiAnc2VsZWN0ZWQtaWQnLCBuYW1lOiAnTXkgQ3JlZGVudGlhbCcgfSlcbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlZGVudGlhbF0sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPEF1dGhvcml6ZWRJbk5vZGVcbiAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgb25BdXRob3JpemF0aW9uSXRlbUNsaWNrPXt2aS5mbigpfVxuICAgICAgICBjcmVkZW50aWFsSWQ9XCJzZWxlY3RlZC1pZFwiXG4gICAgICAvPixcbiAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgKVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IENyZWRlbnRpYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgc2hvdyBhdXRoIHJlbW92ZWQgd2hlbiBjcmVkZW50aWFsSWQgbm90IGZvdW5kJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IEF1dGhvcml6ZWRJbk5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tbm9kZScpKS5kZWZhdWx0XG5cbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlYXRlQ3JlZGVudGlhbCgpXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVldLFxuICAgICAgYWxsb3dfY3VzdG9tX3Rva2VuOiB0cnVlLFxuICAgIH0pXG5cbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICByZW5kZXIoXG4gICAgICA8QXV0aG9yaXplZEluTm9kZVxuICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICBvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2s9e3ZpLmZuKCl9XG4gICAgICAgIGNyZWRlbnRpYWxJZD1cIm5vbi1leGlzdGVudFwiXG4gICAgICAvPixcbiAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgKVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5hdXRoLmF1dGhSZW1vdmVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHNob3cgdW5hdmFpbGFibGUgd2hlbiBjcmVkZW50aWFsIGlzIG5vdCBhbGxvd2VkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IEF1dGhvcml6ZWRJbk5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBjcmVkZW50aWFsID0gY3JlYXRlQ3JlZGVudGlhbCh7XG4gICAgICBpZDogJ3VuYXZhaWxhYmxlLWlkJyxcbiAgICAgIG5vdF9hbGxvd2VkX3RvX3VzZTogdHJ1ZSxcbiAgICAgIGZyb21fZW50ZXJwcmlzZTogZmFsc2UsXG4gICAgfSlcbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbY3JlZGVudGlhbF0sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZXSxcbiAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICB9KVxuXG4gICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgcmVuZGVyKFxuICAgICAgPEF1dGhvcml6ZWRJbk5vZGVcbiAgICAgICAgcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH1cbiAgICAgICAgb25BdXRob3JpemF0aW9uSXRlbUNsaWNrPXt2aS5mbigpfVxuICAgICAgICBjcmVkZW50aWFsSWQ9XCJ1bmF2YWlsYWJsZS1pZFwiXG4gICAgICAvPixcbiAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgKVxuXG4gICAgLy8gQ2hlY2sgdGhhdCBidXR0b24gdGV4dCBjb250YWlucyB1bmF2YWlsYWJsZVxuICAgIGNvbnN0IGJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpXG4gICAgZXhwZWN0KGJ1dHRvbi50ZXh0Q29udGVudCkudG9Db250YWluKCdwbHVnaW4uYXV0aC51bmF2YWlsYWJsZScpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBzaG93IHVuYXZhaWxhYmxlIHdoZW4gZGVmYXVsdCBjcmVkZW50aWFsIGlzIG5vdCBhbGxvd2VkJywgYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IEF1dGhvcml6ZWRJbk5vZGUgPSAoYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tbm9kZScpKS5kZWZhdWx0XG5cbiAgICBjb25zdCBjcmVkZW50aWFsID0gY3JlYXRlQ3JlZGVudGlhbCh7XG4gICAgICBpc19kZWZhdWx0OiB0cnVlLFxuICAgICAgbm90X2FsbG93ZWRfdG9fdXNlOiB0cnVlLFxuICAgIH0pXG4gICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBjcmVkZW50aWFsczogW2NyZWRlbnRpYWxdLFxuICAgICAgc3VwcG9ydGVkX2NyZWRlbnRpYWxfdHlwZXM6IFtDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWV0sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IHRydWUsXG4gICAgfSlcblxuICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgIHJlbmRlcihcbiAgICAgIDxBdXRob3JpemVkSW5Ob2RlXG4gICAgICAgIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9XG4gICAgICAgIG9uQXV0aG9yaXphdGlvbkl0ZW1DbGljaz17dmkuZm4oKX1cbiAgICAgIC8+LFxuICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICApXG5cbiAgICAvLyBDaGVjayB0aGF0IGJ1dHRvbiB0ZXh0IGNvbnRhaW5zIHVuYXZhaWxhYmxlXG4gICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICBleHBlY3QoYnV0dG9uLnRleHRDb250ZW50KS50b0NvbnRhaW4oJ3BsdWdpbi5hdXRoLnVuYXZhaWxhYmxlJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNhbGwgb25BdXRob3JpemF0aW9uSXRlbUNsaWNrIHdoZW4gY2xpY2tpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgQXV0aG9yaXplZEluTm9kZSA9IChhd2FpdCBpbXBvcnQoJy4vYXV0aG9yaXplZC1pbi1ub2RlJykpLmRlZmF1bHRcblxuICAgIGNvbnN0IG9uQXV0aG9yaXphdGlvbkl0ZW1DbGljayA9IHZpLmZuKClcbiAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICByZW5kZXIoXG4gICAgICA8QXV0aG9yaXplZEluTm9kZVxuICAgICAgICBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfVxuICAgICAgICBvbkF1dGhvcml6YXRpb25JdGVtQ2xpY2s9e29uQXV0aG9yaXphdGlvbkl0ZW1DbGlja31cbiAgICAgIC8+LFxuICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICApXG5cbiAgICAvLyBDbGljayB0byBvcGVuIHRoZSBwb3B1cFxuICAgIGNvbnN0IGJ1dHRvbnMgPSBzY3JlZW4uZ2V0QWxsQnlSb2xlKCdidXR0b24nKVxuICAgIGZpcmVFdmVudC5jbGljayhidXR0b25zWzBdKVxuXG4gICAgLy8gVGhlIHBvcHVwIHNob3VsZCBiZSBvcGVuIG5vdyAtIHRoZXJlIHdpbGwgYmUgbXVsdGlwbGUgYnV0dG9ucyBhZnRlciBvcGVuaW5nXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVJvbGUoJ2J1dHRvbicpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCcsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBBdXRob3JpemVkSW5Ob2RlTW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuL2F1dGhvcml6ZWQtaW4tbm9kZScpXG4gICAgZXhwZWN0KHR5cGVvZiBBdXRob3JpemVkSW5Ob2RlTW9kdWxlLmRlZmF1bHQpLnRvQmUoJ29iamVjdCcpXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSB1c2VDcmVkZW50aWFsIEhvb2tzIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgndXNlQ3JlZGVudGlhbCBIb29rcycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBjcmVkZW50aWFsczogW10sXG4gICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW10sXG4gICAgICBhbGxvd19jdXN0b21fdG9rZW46IHRydWUsXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgndXNlR2V0UGx1Z2luQ3JlZGVudGlhbEluZm9Ib29rJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNyZWRlbnRpYWwgaW5mbyB3aGVuIGVuYWJsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZUdldFBsdWdpbkNyZWRlbnRpYWxJbmZvSG9vayB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1jcmVkZW50aWFsJylcblxuICAgICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGNyZWRlbnRpYWxzOiBbY3JlYXRlQ3JlZGVudGlhbCgpXSxcbiAgICAgICAgc3VwcG9ydGVkX2NyZWRlbnRpYWxfdHlwZXM6IFtDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWV0sXG4gICAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlR2V0UGx1Z2luQ3JlZGVudGlhbEluZm9Ib29rKHBsdWdpblBheWxvYWQsIHRydWUpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kYXRhKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZGF0YT8uY3JlZGVudGlhbHMpLnRvSGF2ZUxlbmd0aCgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBmZXRjaCB3aGVuIGRpc2FibGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VHZXRQbHVnaW5DcmVkZW50aWFsSW5mb0hvb2sgfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtY3JlZGVudGlhbCcpXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlR2V0UGx1Z2luQ3JlZGVudGlhbEluZm9Ib29rKHBsdWdpblBheWxvYWQsIGZhbHNlKSwge1xuICAgICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZGF0YSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgndXNlRGVsZXRlUGx1Z2luQ3JlZGVudGlhbEhvb2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbXV0YXRlQXN5bmMgZnVuY3Rpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZURlbGV0ZVBsdWdpbkNyZWRlbnRpYWxIb29rIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLWNyZWRlbnRpYWwnKVxuXG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCgpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZURlbGV0ZVBsdWdpbkNyZWRlbnRpYWxIb29rKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQubXV0YXRlQXN5bmMpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd1c2VJbnZhbGlkUGx1Z2luQ3JlZGVudGlhbEluZm9Ib29rJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGludmFsaWRhdGlvbiBmdW5jdGlvbiB0aGF0IGNhbGxzIGJvdGggaW52YWxpZGF0b3JzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VJbnZhbGlkUGx1Z2luQ3JlZGVudGlhbEluZm9Ib29rIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLWNyZWRlbnRpYWwnKVxuXG4gICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCh7IHByb3ZpZGVyVHlwZTogJ2J1aWx0aW4nIH0pXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUludmFsaWRQbHVnaW5DcmVkZW50aWFsSW5mb0hvb2socGx1Z2luUGF5bG9hZCksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudCkudG9CZSgnZnVuY3Rpb24nKVxuXG4gICAgICByZXN1bHQuY3VycmVudCgpXG5cbiAgICAgIGV4cGVjdChtb2NrSW52YWxpZFBsdWdpbkNyZWRlbnRpYWxJbmZvKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrSW52YWxpZFRvb2xzQnlUeXBlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd1c2VTZXRQbHVnaW5EZWZhdWx0Q3JlZGVudGlhbEhvb2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbXV0YXRlQXN5bmMgZnVuY3Rpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZVNldFBsdWdpbkRlZmF1bHRDcmVkZW50aWFsSG9vayB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1jcmVkZW50aWFsJylcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZXRQbHVnaW5EZWZhdWx0Q3JlZGVudGlhbEhvb2socGx1Z2luUGF5bG9hZCksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudC5tdXRhdGVBc3luYykudG9CZSgnZnVuY3Rpb24nKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3VzZUdldFBsdWdpbkNyZWRlbnRpYWxTY2hlbWFIb29rJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHNjaGVtYSBkYXRhJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VHZXRQbHVnaW5DcmVkZW50aWFsU2NoZW1hSG9vayB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1jcmVkZW50aWFsJylcblxuICAgICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxTY2hlbWEubW9ja1JldHVyblZhbHVlKFt7IG5hbWU6ICdhcGlfa2V5JywgdHlwZTogJ3N0cmluZycgfV0pXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soXG4gICAgICAgICgpID0+IHVzZUdldFBsdWdpbkNyZWRlbnRpYWxTY2hlbWFIb29rKHBsdWdpblBheWxvYWQsIENyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZKSxcbiAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRhdGEpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd1c2VBZGRQbHVnaW5DcmVkZW50aWFsSG9vaycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBtdXRhdGVBc3luYyBmdW5jdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlQWRkUGx1Z2luQ3JlZGVudGlhbEhvb2sgfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtY3JlZGVudGlhbCcpXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlQWRkUGx1Z2luQ3JlZGVudGlhbEhvb2socGx1Z2luUGF5bG9hZCksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudC5tdXRhdGVBc3luYykudG9CZSgnZnVuY3Rpb24nKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3VzZVVwZGF0ZVBsdWdpbkNyZWRlbnRpYWxIb29rJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIG11dGF0ZUFzeW5jIGZ1bmN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VVcGRhdGVQbHVnaW5DcmVkZW50aWFsSG9vayB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1jcmVkZW50aWFsJylcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VVcGRhdGVQbHVnaW5DcmVkZW50aWFsSG9vayhwbHVnaW5QYXlsb2FkKSwge1xuICAgICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QodHlwZW9mIHJlc3VsdC5jdXJyZW50Lm11dGF0ZUFzeW5jKS50b0JlKCdmdW5jdGlvbicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgndXNlR2V0UGx1Z2luT0F1dGhVcmxIb29rJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIG11dGF0ZUFzeW5jIGZ1bmN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VHZXRQbHVnaW5PQXV0aFVybEhvb2sgfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtY3JlZGVudGlhbCcpXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlR2V0UGx1Z2luT0F1dGhVcmxIb29rKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQubXV0YXRlQXN5bmMpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd1c2VHZXRQbHVnaW5PQXV0aENsaWVudFNjaGVtYUhvb2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gc2NoZW1hIGRhdGEnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZUdldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hSG9vayB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1jcmVkZW50aWFsJylcblxuICAgICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIHNjaGVtYTogW10sXG4gICAgICAgIGlzX29hdXRoX2N1c3RvbV9jbGllbnRfZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlR2V0UGx1Z2luT0F1dGhDbGllbnRTY2hlbWFIb29rKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kYXRhKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgndXNlU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnRIb29rJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIG11dGF0ZUFzeW5jIGZ1bmN0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VTZXRQbHVnaW5PQXV0aEN1c3RvbUNsaWVudEhvb2sgfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtY3JlZGVudGlhbCcpXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2V0UGx1Z2luT0F1dGhDdXN0b21DbGllbnRIb29rKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQubXV0YXRlQXN5bmMpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd1c2VEZWxldGVQbHVnaW5PQXV0aEN1c3RvbUNsaWVudEhvb2snLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbXV0YXRlQXN5bmMgZnVuY3Rpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZURlbGV0ZVBsdWdpbk9BdXRoQ3VzdG9tQ2xpZW50SG9vayB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1jcmVkZW50aWFsJylcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEZWxldGVQbHVnaW5PQXV0aEN1c3RvbUNsaWVudEhvb2socGx1Z2luUGF5bG9hZCksIHtcbiAgICAgICAgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHR5cGVvZiByZXN1bHQuY3VycmVudC5tdXRhdGVBc3luYykudG9CZSgnZnVuY3Rpb24nKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZyA9PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSXNDdXJyZW50V29ya3NwYWNlTWFuYWdlci5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICBtb2NrR2V0UGx1Z2luQ3JlZGVudGlhbEluZm8ubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGNyZWRlbnRpYWxzOiBbXSxcbiAgICAgIHN1cHBvcnRlZF9jcmVkZW50aWFsX3R5cGVzOiBbQ3JlZGVudGlhbFR5cGVFbnVtLkFQSV9LRVldLFxuICAgICAgYWxsb3dfY3VzdG9tX3Rva2VuOiB0cnVlLFxuICAgIH0pXG4gICAgbW9ja0dldFBsdWdpbk9BdXRoQ2xpZW50U2NoZW1hLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBzY2hlbWE6IFtdLFxuICAgICAgaXNfb2F1dGhfY3VzdG9tX2NsaWVudF9lbmFibGVkOiBmYWxzZSxcbiAgICAgIGlzX3N5c3RlbV9vYXV0aF9wYXJhbXNfZXhpc3RzOiBmYWxzZSxcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQbHVnaW5BdXRoIGVkZ2UgY2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcHJvdmlkZXIgZ3JhY2VmdWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IFBsdWdpbkF1dGggPSAoYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoJykpLmRlZmF1bHRcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoeyBwcm92aWRlcjogJycgfSlcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxQbHVnaW5BdXRoIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LFxuICAgICAgICAgIHsgd3JhcHBlcjogY3JlYXRlV3JhcHBlcigpIH0sXG4gICAgICAgIClcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdG9vbCBhbmQgZGF0YXNvdXJjZSBhdXRoIGNhdGVnb3JpZXMgd2l0aCBidXR0b24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBQbHVnaW5BdXRoID0gKGF3YWl0IGltcG9ydCgnLi9wbHVnaW4tYXV0aCcpKS5kZWZhdWx0XG5cbiAgICAgIC8vIFRvb2wgYW5kIGRhdGFzb3VyY2UgY2F0ZWdvcmllcyBzaG91bGQgcmVuZGVyIHdpdGggQVBJIHN1cHBvcnRcbiAgICAgIGNvbnN0IGNhdGVnb3JpZXNXaXRoQXBpID0gW0F1dGhDYXRlZ29yeS50b29sXVxuXG4gICAgICBmb3IgKGNvbnN0IGNhdGVnb3J5IG9mIGNhdGVnb3JpZXNXaXRoQXBpKSB7XG4gICAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKHsgY2F0ZWdvcnkgfSlcblxuICAgICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcihcbiAgICAgICAgICA8UGx1Z2luQXV0aCBwbHVnaW5QYXlsb2FkPXtwbHVnaW5QYXlsb2FkfSAvPixcbiAgICAgICAgICB7IHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSB9LFxuICAgICAgICApXG5cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgICAgdW5tb3VudCgpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1vZGVsIGFuZCB0cmlnZ2VyIGNhdGVnb3JpZXMgd2l0aG91dCB0aHJvd2luZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IFBsdWdpbkF1dGggPSAoYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoJykpLmRlZmF1bHRcblxuICAgICAgLy8gTW9kZWwgYW5kIHRyaWdnZXIgY2F0ZWdvcmllcyBoYXZlIGVtcHR5IEFQSSBlbmRwb2ludHMsIHNvIHRoZXkgcmVuZGVyIHdpdGhvdXQgYnV0dG9uc1xuICAgICAgY29uc3QgY2F0ZWdvcmllc1dpdGhvdXRBcGkgPSBbQXV0aENhdGVnb3J5Lm1vZGVsLCBBdXRoQ2F0ZWdvcnkudHJpZ2dlcl1cblxuICAgICAgZm9yIChjb25zdCBjYXRlZ29yeSBvZiBjYXRlZ29yaWVzV2l0aG91dEFwaSkge1xuICAgICAgICBjb25zdCBwbHVnaW5QYXlsb2FkID0gY3JlYXRlUGx1Z2luUGF5bG9hZCh7IGNhdGVnb3J5IH0pXG5cbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcihcbiAgICAgICAgICAgIDxQbHVnaW5BdXRoIHBsdWdpblBheWxvYWQ9e3BsdWdpblBheWxvYWR9IC8+LFxuICAgICAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgICAgICApXG4gICAgICAgICAgdW5tb3VudCgpXG4gICAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGRldGFpbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IFBsdWdpbkF1dGggPSAoYXdhaXQgaW1wb3J0KCcuL3BsdWdpbi1hdXRoJykpLmRlZmF1bHRcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoeyBkZXRhaWw6IHVuZGVmaW5lZCB9KVxuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPFBsdWdpbkF1dGggcGx1Z2luUGF5bG9hZD17cGx1Z2luUGF5bG9hZH0gLz4sXG4gICAgICAgICAgeyB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCkgfSxcbiAgICAgICAgKVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3VzZVBsdWdpbkF1dGhBY3Rpb24gZXJyb3IgaGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGVsZXRlIGVycm9yIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZVBsdWdpbkF1dGhBY3Rpb24gfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtcGx1Z2luLWF1dGgtYWN0aW9uJylcblxuICAgICAgbW9ja0RlbGV0ZVBsdWdpbkNyZWRlbnRpYWwubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdEZWxldGUgZmFpbGVkJykpXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aEFjdGlvbihwbHVnaW5QYXlsb2FkKSwge1xuICAgICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5vcGVuQ29uZmlybSgndGVzdC1pZCcpXG4gICAgICB9KVxuXG4gICAgICAvLyBTaG91bGQgbm90IHRocm93LCBlcnJvciBpcyBjYXVnaHRcbiAgICAgIGF3YWl0IGV4cGVjdChcbiAgICAgICAgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCByZXN1bHQuY3VycmVudC5oYW5kbGVDb25maXJtKClcbiAgICAgICAgfSksXG4gICAgICApLnJlamVjdHMudG9UaHJvdygnRGVsZXRlIGZhaWxlZCcpXG5cbiAgICAgIC8vIEFjdGlvbiBzdGF0ZSBzaG91bGQgYmUgcmVzZXRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kb2luZ0FjdGlvbikudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2V0IGRlZmF1bHQgZXJyb3IgZ3JhY2VmdWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aEFjdGlvbiB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aC1hY3Rpb24nKVxuXG4gICAgICBtb2NrU2V0UGx1Z2luRGVmYXVsdENyZWRlbnRpYWwubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdTZXQgZGVmYXVsdCBmYWlsZWQnKSlcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoQWN0aW9uKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IGV4cGVjdChcbiAgICAgICAgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCByZXN1bHQuY3VycmVudC5oYW5kbGVTZXREZWZhdWx0KCd0ZXN0LWlkJylcbiAgICAgICAgfSksXG4gICAgICApLnJlamVjdHMudG9UaHJvdygnU2V0IGRlZmF1bHQgZmFpbGVkJylcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRvaW5nQWN0aW9uKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByZW5hbWUgZXJyb3IgZ3JhY2VmdWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgdXNlUGx1Z2luQXV0aEFjdGlvbiB9ID0gYXdhaXQgaW1wb3J0KCcuL2hvb2tzL3VzZS1wbHVnaW4tYXV0aC1hY3Rpb24nKVxuXG4gICAgICBtb2NrVXBkYXRlUGx1Z2luQ3JlZGVudGlhbC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ1JlbmFtZSBmYWlsZWQnKSlcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoQWN0aW9uKHBsdWdpblBheWxvYWQpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IGV4cGVjdChcbiAgICAgICAgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgICBhd2FpdCByZXN1bHQuY3VycmVudC5oYW5kbGVSZW5hbWUoeyBjcmVkZW50aWFsX2lkOiAndGVzdC1pZCcsIG5hbWU6ICdOZXcgTmFtZScgfSlcbiAgICAgICAgfSksXG4gICAgICApLnJlamVjdHMudG9UaHJvdygnUmVuYW1lIGZhaWxlZCcpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kb2luZ0FjdGlvbikudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDcmVkZW50aWFsIGxpc3QgZWRnZSBjYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsYXJnZSBjcmVkZW50aWFsIGxpc3RzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VQbHVnaW5BdXRoIH0gPSBhd2FpdCBpbXBvcnQoJy4vaG9va3MvdXNlLXBsdWdpbi1hdXRoJylcblxuICAgICAgY29uc3QgbGFyZ2VDcmVkZW50aWFsTGlzdCA9IGNyZWF0ZUNyZWRlbnRpYWxMaXN0KDEwMClcbiAgICAgIG1vY2tHZXRQbHVnaW5DcmVkZW50aWFsSW5mby5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBjcmVkZW50aWFsczogbGFyZ2VDcmVkZW50aWFsTGlzdCxcbiAgICAgICAgc3VwcG9ydGVkX2NyZWRlbnRpYWxfdHlwZXM6IFtDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWV0sXG4gICAgICAgIGFsbG93X2N1c3RvbV90b2tlbjogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUGx1Z2luQXV0aChwbHVnaW5QYXlsb2FkLCB0cnVlKSwge1xuICAgICAgICB3cmFwcGVyOiBjcmVhdGVXcmFwcGVyKCksXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNBdXRob3JpemVkKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3JlZGVudGlhbHMpLnRvSGF2ZUxlbmd0aCgxMDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1peGVkIGNyZWRlbnRpYWwgdHlwZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHVzZVBsdWdpbkF1dGggfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtcGx1Z2luLWF1dGgnKVxuXG4gICAgICBjb25zdCBtaXhlZENyZWRlbnRpYWxzID0gW1xuICAgICAgICBjcmVhdGVDcmVkZW50aWFsKHsgaWQ6ICcxJywgY3JlZGVudGlhbF90eXBlOiBDcmVkZW50aWFsVHlwZUVudW0uQVBJX0tFWSB9KSxcbiAgICAgICAgY3JlYXRlQ3JlZGVudGlhbCh7IGlkOiAnMicsIGNyZWRlbnRpYWxfdHlwZTogQ3JlZGVudGlhbFR5cGVFbnVtLk9BVVRIMiB9KSxcbiAgICAgICAgY3JlYXRlQ3JlZGVudGlhbCh7IGlkOiAnMycsIGNyZWRlbnRpYWxfdHlwZTogdW5kZWZpbmVkIH0pLFxuICAgICAgXVxuICAgICAgbW9ja0dldFBsdWdpbkNyZWRlbnRpYWxJbmZvLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGNyZWRlbnRpYWxzOiBtaXhlZENyZWRlbnRpYWxzLFxuICAgICAgICBzdXBwb3J0ZWRfY3JlZGVudGlhbF90eXBlczogW0NyZWRlbnRpYWxUeXBlRW51bS5BUElfS0VZLCBDcmVkZW50aWFsVHlwZUVudW0uT0FVVEgyXSxcbiAgICAgICAgYWxsb3dfY3VzdG9tX3Rva2VuOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQbHVnaW5BdXRoKHBsdWdpblBheWxvYWQsIHRydWUpLCB7XG4gICAgICAgIHdyYXBwZXI6IGNyZWF0ZVdyYXBwZXIoKSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jcmVkZW50aWFscykudG9IYXZlTGVuZ3RoKDMpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY2FuT0F1dGgpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jYW5BcGlLZXkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCb3VuZGFyeSBjb25kaXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBwcm92aWRlciBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VHZXRBcGkgfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtZ2V0LWFwaScpXG5cbiAgICAgIGNvbnN0IHBsdWdpblBheWxvYWQgPSBjcmVhdGVQbHVnaW5QYXlsb2FkKHtcbiAgICAgICAgcHJvdmlkZXI6ICd0ZXN0LXByb3ZpZGVyX3YyLjAnLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgYXBpTWFwID0gdXNlR2V0QXBpKHBsdWdpblBheWxvYWQpXG5cbiAgICAgIGV4cGVjdChhcGlNYXAuZ2V0Q3JlZGVudGlhbEluZm8pLnRvQ29udGFpbigndGVzdC1wcm92aWRlcl92Mi4wJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIHByb3ZpZGVyIG5hbWVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyB1c2VHZXRBcGkgfSA9IGF3YWl0IGltcG9ydCgnLi9ob29rcy91c2UtZ2V0LWFwaScpXG5cbiAgICAgIGNvbnN0IGxvbmdQcm92aWRlciA9ICdhJy5yZXBlYXQoMjAwKVxuICAgICAgY29uc3QgcGx1Z2luUGF5bG9hZCA9IGNyZWF0ZVBsdWdpblBheWxvYWQoe1xuICAgICAgICBwcm92aWRlcjogbG9uZ1Byb3ZpZGVyLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgYXBpTWFwID0gdXNlR2V0QXBpKHBsdWdpblBheWxvYWQpXG5cbiAgICAgIGV4cGVjdChhcGlNYXAuZ2V0Q3JlZGVudGlhbEluZm8pLnRvQ29udGFpbihsb25nUHJvdmlkZXIpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=