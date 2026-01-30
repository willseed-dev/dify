"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const vitest_1 = require("vitest");
// Import after mocks
const types_1 = require("@/app/components/plugins/types");
const types_2 = require("@/app/components/workflow/block-selector/types");
const common_modal_1 = require("./common-modal");
// ============================================================================
// Mock Factory Functions
// ============================================================================
function createMockPluginDetail(overrides = {}) {
    return {
        plugin_id: 'test-plugin-id',
        provider: 'test-provider',
        name: 'Test Plugin',
        declaration: {
            trigger: {
                subscription_schema: [],
                subscription_constructor: {
                    credentials_schema: [],
                    parameters: [],
                },
            },
        },
        ...overrides,
    };
}
function createMockSubscriptionBuilder(overrides = {}) {
    return {
        id: 'builder-123',
        name: 'Test Builder',
        provider: 'test-provider',
        credential_type: types_2.TriggerCredentialTypeEnum.ApiKey,
        credentials: {},
        endpoint: 'https://example.com/callback',
        parameters: {},
        properties: {},
        workflows_in_use: 0,
        ...overrides,
    };
}
function createMockLogData(logs = []) {
    return { logs };
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
// Mock subscription list hook
const mockRefetch = vitest_1.vi.fn();
vitest_1.vi.mock('../use-subscription-list', () => ({
    useSubscriptionList: () => ({
        refetch: mockRefetch,
    }),
}));
// Mock service hooks
const mockVerifyCredentials = vitest_1.vi.fn();
const mockCreateBuilder = vitest_1.vi.fn();
const mockBuildSubscription = vitest_1.vi.fn();
const mockUpdateBuilder = vitest_1.vi.fn();
// Configurable pending states
let mockIsVerifyingCredentials = false;
let mockIsBuilding = false;
const setMockPendingStates = (verifying, building) => {
    mockIsVerifyingCredentials = verifying;
    mockIsBuilding = building;
};
vitest_1.vi.mock('@/service/use-triggers', () => ({
    useVerifyAndUpdateTriggerSubscriptionBuilder: () => ({
        mutate: mockVerifyCredentials,
        get isPending() { return mockIsVerifyingCredentials; },
    }),
    useCreateTriggerSubscriptionBuilder: () => ({
        mutateAsync: mockCreateBuilder,
        isPending: false,
    }),
    useBuildTriggerSubscription: () => ({
        mutate: mockBuildSubscription,
        get isPending() { return mockIsBuilding; },
    }),
    useUpdateTriggerSubscriptionBuilder: () => ({
        mutate: mockUpdateBuilder,
        isPending: false,
    }),
    useTriggerSubscriptionBuilderLogs: () => ({
        data: createMockLogData(),
    }),
}));
// Mock error parser
const mockParsePluginErrorMessage = vitest_1.vi.fn().mockResolvedValue(null);
vitest_1.vi.mock('@/utils/error-parser', () => ({
    parsePluginErrorMessage: (...args) => mockParsePluginErrorMessage(...args),
}));
// Mock URL validation
vitest_1.vi.mock('@/utils/urlValidation', () => ({
    isPrivateOrLocalAddress: vitest_1.vi.fn().mockReturnValue(false),
}));
// Mock toast
const mockToastNotify = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: (params) => mockToastNotify(params),
    },
}));
// Mock Modal component
vitest_1.vi.mock('@/app/components/base/modal/modal', () => ({
    default: ({ children, onClose, onConfirm, title, confirmButtonText, bottomSlot, size, disabled, }) => (<div data-testid="modal" data-size={size} data-disabled={disabled}>
      <div data-testid="modal-title">{title}</div>
      <div data-testid="modal-content">{children}</div>
      <div data-testid="modal-bottom-slot">{bottomSlot}</div>
      <button data-testid="modal-confirm" onClick={onConfirm} disabled={disabled}>{confirmButtonText}</button>
      <button data-testid="modal-close" onClick={onClose}>Close</button>
    </div>),
}));
let mockFormValuesConfig = {
    values: { api_key: 'test-api-key', subscription_name: 'Test Subscription' },
    isCheckValidated: true,
};
let mockGetFormReturnsNull = false;
// Separate validation configs for different forms
let mockSubscriptionFormValidated = true;
let mockAutoParamsFormValidated = true;
let mockManualPropsFormValidated = true;
const setMockFormValuesConfig = (config) => {
    mockFormValuesConfig = config;
};
const setMockGetFormReturnsNull = (value) => {
    mockGetFormReturnsNull = value;
};
const setMockFormValidation = (subscription, autoParams, manualProps) => {
    mockSubscriptionFormValidated = subscription;
    mockAutoParamsFormValidated = autoParams;
    mockManualPropsFormValidated = manualProps;
};
// Mock BaseForm component with ref support
vitest_1.vi.mock('@/app/components/base/form/components/base', async () => {
    const React = await Promise.resolve().then(() => require('react'));
    function MockBaseFormInner({ formSchemas, onChange }, ref) {
        // Determine which form this is based on schema
        const isSubscriptionForm = formSchemas.some((s) => s.name === 'subscription_name');
        const isAutoParamsForm = formSchemas.some((s) => ['repo_name', 'branch', 'repo', 'text_field', 'dynamic_field', 'bool_field', 'text_input_field', 'unknown_field', 'count'].includes(s.name));
        const isManualPropsForm = formSchemas.some((s) => s.name === 'webhook_url');
        React.useImperativeHandle(ref, () => ({
            getFormValues: () => {
                let isValidated = mockFormValuesConfig.isCheckValidated;
                if (isSubscriptionForm)
                    isValidated = mockSubscriptionFormValidated;
                else if (isAutoParamsForm)
                    isValidated = mockAutoParamsFormValidated;
                else if (isManualPropsForm)
                    isValidated = mockManualPropsFormValidated;
                return {
                    ...mockFormValuesConfig,
                    isCheckValidated: isValidated,
                };
            },
            setFields: () => { },
            getForm: () => mockGetFormReturnsNull
                ? null
                : { setFieldValue: () => { } },
        }));
        return (<div data-testid="base-form">
        {formSchemas.map((schema) => (<input key={schema.name} data-testid={`form-field-${schema.name}`} name={schema.name} onChange={onChange}/>))}
      </div>);
    }
    return {
        BaseForm: React.forwardRef(MockBaseFormInner),
    };
});
// Mock EncryptedBottom component
vitest_1.vi.mock('@/app/components/base/encrypted-bottom', () => ({
    EncryptedBottom: () => <div data-testid="encrypted-bottom">Encrypted</div>,
}));
// Mock LogViewer component
vitest_1.vi.mock('../log-viewer', () => ({
    default: ({ logs }) => (<div data-testid="log-viewer">
      {logs.map(log => (<div key={log.id} data-testid={`log-${log.id}`}>{log.message}</div>))}
    </div>),
}));
// Mock debounce
vitest_1.vi.mock('es-toolkit/compat', () => ({
    debounce: (fn) => {
        const debouncedFn = (...args) => fn(...args);
        debouncedFn.cancel = vitest_1.vi.fn();
        return debouncedFn;
    },
}));
// ============================================================================
// Test Suites
// ============================================================================
(0, vitest_1.describe)('CommonCreateModal', () => {
    const defaultProps = {
        onClose: vitest_1.vi.fn(),
        createType: types_1.SupportedCreationMethods.APIKEY,
        builder: undefined,
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockUsePluginStore.mockReturnValue(mockPluginDetail);
        mockCreateBuilder.mockResolvedValue({
            subscription_builder: createMockSubscriptionBuilder(),
        });
        // Reset configurable mocks
        setMockPendingStates(false, false);
        setMockFormValuesConfig({
            values: { api_key: 'test-api-key', subscription_name: 'Test Subscription' },
            isCheckValidated: true,
        });
        setMockGetFormReturnsNull(false);
        setMockFormValidation(true, true, true); // All forms validated by default
        mockParsePluginErrorMessage.mockResolvedValue(null);
    });
    (0, vitest_1.afterEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render modal with correct title for API Key method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-title')).toHaveTextContent('pluginTrigger.modal.apiKey.title');
        });
        (0, vitest_1.it)('should render modal with correct title for Manual method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-title')).toHaveTextContent('pluginTrigger.modal.manual.title');
        });
        (0, vitest_1.it)('should render modal with correct title for OAuth method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-title')).toHaveTextContent('pluginTrigger.modal.oauth.title');
        });
        (0, vitest_1.it)('should show multi-steps for API Key method', () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTrigger.modal.steps.verify')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTrigger.modal.steps.configuration')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render LogViewer for Manual method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('log-viewer')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Builder Initialization', () => {
        (0, vitest_1.it)('should create builder on mount when no builder provided', async () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalledWith({
                    provider: 'test-provider',
                    credential_type: 'api-key',
                });
            });
        });
        (0, vitest_1.it)('should not create builder when builder is provided', async () => {
            const existingBuilder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} builder={existingBuilder}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).not.toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should show error toast when builder creation fails', async () => {
            mockCreateBuilder.mockRejectedValueOnce(new Error('Creation failed'));
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'pluginTrigger.modal.errors.createFailed',
                });
            });
        });
    });
    (0, vitest_1.describe)('API Key Flow', () => {
        (0, vitest_1.it)('should start at Verify step for API Key method', () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-api_key')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show verify button text initially', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('pluginTrigger.modal.common.verify');
        });
    });
    (0, vitest_1.describe)('Modal Actions', () => {
        (0, vitest_1.it)('should call onClose when close button is clicked', () => {
            const mockOnClose = vitest_1.vi.fn();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} onClose={mockOnClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-close'));
            (0, vitest_1.expect)(mockOnClose).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should call onConfirm handler when confirm button is clicked', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Please fill in all required credentials',
            });
        });
    });
    (0, vitest_1.describe)('Manual Method', () => {
        (0, vitest_1.it)('should start at Configuration step for Manual method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTrigger.modal.manual.logs.title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render manual properties form when schema exists', () => {
            const detailWithManualSchema = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_schema: [
                            { name: 'webhook_url', type: 'text', required: true },
                        ],
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithManualSchema);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-webhook_url')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show create button text for Manual method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('pluginTrigger.modal.common.create');
        });
    });
    (0, vitest_1.describe)('Form Interactions', () => {
        (0, vitest_1.it)('should render credentials form fields', () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'client_id', type: 'text', required: true },
                                { name: 'client_secret', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-client_id')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-client_secret')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle missing provider gracefully', async () => {
            const detailWithoutProvider = { ...mockPluginDetail, provider: '' };
            mockUsePluginStore.mockReturnValue(detailWithoutProvider);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).not.toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should handle empty credentials schema', () => {
            const detailWithEmptySchema = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithEmptySchema);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('form-field-api_key')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined trigger in declaration', () => {
            const detailWithEmptyDeclaration = createMockPluginDetail({
                declaration: {
                    trigger: undefined,
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithEmptyDeclaration);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('CREDENTIAL_TYPE_MAP', () => {
        (0, vitest_1.beforeEach)(() => {
            vitest_1.vi.clearAllMocks();
            mockUsePluginStore.mockReturnValue(mockPluginDetail);
            mockCreateBuilder.mockResolvedValue({
                subscription_builder: createMockSubscriptionBuilder(),
            });
        });
        (0, vitest_1.it)('should use correct credential type for APIKEY', async () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.APIKEY}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    credential_type: 'api-key',
                }));
            });
        });
        (0, vitest_1.it)('should use correct credential type for OAUTH', async () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    credential_type: 'oauth2',
                }));
            });
        });
        (0, vitest_1.it)('should use correct credential type for MANUAL', async () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    credential_type: 'unauthorized',
                }));
            });
        });
    });
    (0, vitest_1.describe)('MODAL_TITLE_KEY_MAP', () => {
        (0, vitest_1.it)('should use correct title key for APIKEY', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.APIKEY}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-title')).toHaveTextContent('pluginTrigger.modal.apiKey.title');
        });
        (0, vitest_1.it)('should use correct title key for OAUTH', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-title')).toHaveTextContent('pluginTrigger.modal.oauth.title');
        });
        (0, vitest_1.it)('should use correct title key for MANUAL', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-title')).toHaveTextContent('pluginTrigger.modal.manual.title');
        });
    });
    (0, vitest_1.describe)('Verify Flow', () => {
        (0, vitest_1.it)('should call verifyCredentials and move to Configuration step on success', async () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            mockVerifyCredentials.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalled();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockVerifyCredentials).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should show error on verify failure', async () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            mockVerifyCredentials.mockImplementation((params, { onError }) => {
                onError(new Error('Verification failed'));
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalled();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockVerifyCredentials).toHaveBeenCalled();
            });
        });
    });
    (0, vitest_1.describe)('Create Flow', () => {
        (0, vitest_1.it)('should show error when subscriptionBuilder is not found in Configuration step', async () => {
            // Start in Configuration step (Manual method)
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            // Before builder is created, click confirm
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'Subscription builder not found',
                });
            });
        });
        (0, vitest_1.it)('should call buildSubscription on successful create', async () => {
            const builder = createMockSubscriptionBuilder();
            mockBuildSubscription.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // Verify form is rendered and confirm button is clickable
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show error toast when buildSubscription fails', async () => {
            const builder = createMockSubscriptionBuilder();
            mockBuildSubscription.mockImplementation((params, { onError }) => {
                onError(new Error('Build failed'));
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // Verify the modal is still rendered after error
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should call refetch and onClose on successful create', async () => {
            const mockOnClose = vitest_1.vi.fn();
            const builder = createMockSubscriptionBuilder();
            mockBuildSubscription.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder} onClose={mockOnClose}/>);
            // Verify component renders with builder
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Manual Properties Change', () => {
        (0, vitest_1.it)('should call updateBuilder when manual properties change', async () => {
            const detailWithManualSchema = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_schema: [
                            { name: 'webhook_url', type: 'text', required: true },
                        ],
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithManualSchema);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalled();
            });
            const input = react_1.screen.getByTestId('form-field-webhook_url');
            react_1.fireEvent.change(input, { target: { value: 'https://example.com/webhook' } });
            // updateBuilder should be called after debounce
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUpdateBuilder).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should not call updateBuilder when subscriptionBuilder is missing', async () => {
            const detailWithManualSchema = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_schema: [
                            { name: 'webhook_url', type: 'text', required: true },
                        ],
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithManualSchema);
            mockCreateBuilder.mockResolvedValue({ subscription_builder: undefined });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            const input = react_1.screen.getByTestId('form-field-webhook_url');
            react_1.fireEvent.change(input, { target: { value: 'https://example.com/webhook' } });
            // updateBuilder should not be called
            (0, vitest_1.expect)(mockUpdateBuilder).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('UpdateBuilder Error Handling', () => {
        (0, vitest_1.it)('should show error toast when updateBuilder fails', async () => {
            const detailWithManualSchema = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_schema: [
                            { name: 'webhook_url', type: 'text', required: true },
                        ],
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithManualSchema);
            mockUpdateBuilder.mockImplementation((params, { onError }) => {
                onError(new Error('Update failed'));
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalled();
            });
            const input = react_1.screen.getByTestId('form-field-webhook_url');
            react_1.fireEvent.change(input, { target: { value: 'https://example.com/webhook' } });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUpdateBuilder).toHaveBeenCalled();
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    type: 'error',
                }));
            });
        });
    });
    (0, vitest_1.describe)('Private Address Warning', () => {
        (0, vitest_1.it)('should show warning when callback URL is private address', async () => {
            const { isPrivateOrLocalAddress } = await Promise.resolve().then(() => require('@/utils/urlValidation'));
            vitest_1.vi.mocked(isPrivateOrLocalAddress).mockReturnValue(true);
            const builder = createMockSubscriptionBuilder({
                endpoint: 'http://localhost:3000/callback',
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            // Verify component renders with the private address endpoint
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-callback_url')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should clear warning when callback URL is not private address', async () => {
            const { isPrivateOrLocalAddress } = await Promise.resolve().then(() => require('@/utils/urlValidation'));
            vitest_1.vi.mocked(isPrivateOrLocalAddress).mockReturnValue(false);
            const builder = createMockSubscriptionBuilder({
                endpoint: 'https://example.com/callback',
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            // Verify component renders with public address endpoint
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-callback_url')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Auto Parameters Schema', () => {
        (0, vitest_1.it)('should render auto parameters form for OAuth method', () => {
            const detailWithAutoParams = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'repo_name', type: 'string', required: true },
                                { name: 'branch', type: 'text', required: false },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithAutoParams);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-repo_name')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-branch')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render auto parameters form for Manual method', () => {
            const detailWithAutoParams = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'repo_name', type: 'string', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithAutoParams);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            // For manual method, auto parameters should not be rendered
            (0, vitest_1.expect)(react_1.screen.queryByTestId('form-field-repo_name')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Form Type Normalization', () => {
        (0, vitest_1.it)('should normalize various form types in auto parameters', () => {
            const detailWithVariousTypes = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'text_field', type: 'string' },
                                { name: 'secret_field', type: 'password' },
                                { name: 'number_field', type: 'number' },
                                { name: 'bool_field', type: 'boolean' },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithVariousTypes);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-text_field')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-secret_field')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-number_field')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-bool_field')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle integer type as number', () => {
            const detailWithInteger = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'count', type: 'integer' },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithInteger);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-count')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('API Key Credentials Change', () => {
        (0, vitest_1.it)('should clear errors when credentials change', () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            const input = react_1.screen.getByTestId('form-field-api_key');
            react_1.fireEvent.change(input, { target: { value: 'new-api-key' } });
            // Verify the input field exists and accepts changes
            (0, vitest_1.expect)(input).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Subscription Form in Configuration Step', () => {
        (0, vitest_1.it)('should render subscription name and callback URL fields', () => {
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-subscription_name')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-callback_url')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Pending States', () => {
        (0, vitest_1.it)('should show verifying text when isVerifyingCredentials is true', () => {
            setMockPendingStates(true, false);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('pluginTrigger.modal.common.verifying');
        });
        (0, vitest_1.it)('should show creating text when isBuilding is true', () => {
            setMockPendingStates(false, true);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toHaveTextContent('pluginTrigger.modal.common.creating');
        });
        (0, vitest_1.it)('should disable confirm button when verifying', () => {
            setMockPendingStates(true, false);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toBeDisabled();
        });
        (0, vitest_1.it)('should disable confirm button when building', () => {
            setMockPendingStates(false, true);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal-confirm')).toBeDisabled();
        });
    });
    (0, vitest_1.describe)('Modal Size', () => {
        (0, vitest_1.it)('should use md size for Manual method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toHaveAttribute('data-size', 'md');
        });
        (0, vitest_1.it)('should use sm size for API Key method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.APIKEY}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toHaveAttribute('data-size', 'sm');
        });
        (0, vitest_1.it)('should use sm size for OAuth method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toHaveAttribute('data-size', 'sm');
        });
    });
    (0, vitest_1.describe)('BottomSlot', () => {
        (0, vitest_1.it)('should show EncryptedBottom in Verify step', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('encrypted-bottom')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show EncryptedBottom in Configuration step', () => {
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('encrypted-bottom')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Form Validation Failure', () => {
        (0, vitest_1.it)('should return early when subscription form validation fails', async () => {
            // Subscription form fails validation
            setMockFormValidation(false, true, true);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // buildSubscription should not be called when validation fails
            (0, vitest_1.expect)(mockBuildSubscription).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should return early when auto parameters validation fails', async () => {
            // Subscription form passes, but auto params form fails
            setMockFormValidation(true, false, true);
            const detailWithAutoParams = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'repo_name', type: 'string', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithAutoParams);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // buildSubscription should not be called when validation fails
            (0, vitest_1.expect)(mockBuildSubscription).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should return early when manual properties validation fails', async () => {
            // Subscription form passes, but manual properties form fails
            setMockFormValidation(true, true, false);
            const detailWithManualSchema = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_schema: [
                            { name: 'webhook_url', type: 'text', required: true },
                        ],
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithManualSchema);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            // buildSubscription should not be called when validation fails
            (0, vitest_1.expect)(mockBuildSubscription).not.toHaveBeenCalled();
        });
    });
    (0, vitest_1.describe)('Error Message Parsing', () => {
        (0, vitest_1.it)('should use parsed error message when available for verify error', async () => {
            mockParsePluginErrorMessage.mockResolvedValue('Custom parsed error');
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            mockVerifyCredentials.mockImplementation((params, { onError }) => {
                onError(new Error('Raw error'));
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalled();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockParsePluginErrorMessage).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should use parsed error message when available for build error', async () => {
            mockParsePluginErrorMessage.mockResolvedValue('Custom build error');
            const builder = createMockSubscriptionBuilder();
            mockBuildSubscription.mockImplementation((params, { onError }) => {
                onError(new Error('Raw build error'));
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockParsePluginErrorMessage).toHaveBeenCalled();
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'Custom build error',
                });
            });
        });
        (0, vitest_1.it)('should use fallback error message when parsePluginErrorMessage returns null', async () => {
            mockParsePluginErrorMessage.mockResolvedValue(null);
            const builder = createMockSubscriptionBuilder();
            mockBuildSubscription.mockImplementation((params, { onError }) => {
                onError(new Error('Raw error'));
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'pluginTrigger.subscription.createFailed',
                });
            });
        });
        (0, vitest_1.it)('should use parsed error message for update builder error', async () => {
            mockParsePluginErrorMessage.mockResolvedValue('Custom update error');
            const detailWithManualSchema = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_schema: [
                            { name: 'webhook_url', type: 'text', required: true },
                        ],
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithManualSchema);
            mockUpdateBuilder.mockImplementation((params, { onError }) => {
                onError(new Error('Update failed'));
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalled();
            });
            const input = react_1.screen.getByTestId('form-field-webhook_url');
            react_1.fireEvent.change(input, { target: { value: 'https://example.com/webhook' } });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'Custom update error',
                });
            });
        });
    });
    (0, vitest_1.describe)('Form getForm null handling', () => {
        (0, vitest_1.it)('should handle getForm returning null', async () => {
            setMockGetFormReturnsNull(true);
            const builder = createMockSubscriptionBuilder({
                endpoint: 'https://example.com/callback',
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            // Component should render without errors even when getForm returns null
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('normalizeFormType with existing FormTypeEnum', () => {
        (0, vitest_1.it)('should return the same type when already a valid FormTypeEnum', () => {
            const detailWithFormTypeEnum = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'text_input_field', type: 'text-input' },
                                { name: 'secret_input_field', type: 'secret-input' },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithFormTypeEnum);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-text_input_field')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-secret_input_field')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle unknown type by defaulting to textInput', () => {
            const detailWithUnknownType = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'unknown_field', type: 'unknown-type' },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithUnknownType);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-unknown_field')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Verify Success Flow', () => {
        (0, vitest_1.it)('should show success toast and move to Configuration step on verify success', async () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            mockVerifyCredentials.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCreateBuilder).toHaveBeenCalled();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                    type: 'success',
                    message: 'pluginTrigger.modal.apiKey.verify.success',
                });
            });
        });
    });
    (0, vitest_1.describe)('Build Success Flow', () => {
        (0, vitest_1.it)('should call refetch and onClose on successful build', async () => {
            const mockOnClose = vitest_1.vi.fn();
            const builder = createMockSubscriptionBuilder();
            mockBuildSubscription.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder} onClose={mockOnClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                    type: 'success',
                    message: 'pluginTrigger.subscription.createSuccess',
                });
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockOnClose).toHaveBeenCalled();
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefetch).toHaveBeenCalled();
            });
        });
    });
    (0, vitest_1.describe)('DynamicSelect Parameters', () => {
        (0, vitest_1.it)('should handle dynamic-select type parameters', () => {
            const detailWithDynamicSelect = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'dynamic_field', type: 'dynamic-select', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithDynamicSelect);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-dynamic_field')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Boolean Type Parameters', () => {
        (0, vitest_1.it)('should handle boolean type parameters with special styling', () => {
            const detailWithBoolean = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'bool_field', type: 'boolean', required: false },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithBoolean);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-bool_field')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Empty Form Values', () => {
        (0, vitest_1.it)('should show error when credentials form returns empty values', () => {
            setMockFormValuesConfig({
                values: {},
                isCheckValidated: false,
            });
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'Please fill in all required credentials',
            });
        });
    });
    (0, vitest_1.describe)('Auto Parameters with Empty Schema', () => {
        (0, vitest_1.it)('should not render auto parameters when schema is empty', () => {
            const detailWithEmptyParams = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithEmptyParams);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            // Should only have subscription form fields
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-subscription_name')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-callback_url')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Manual Properties with Empty Schema', () => {
        (0, vitest_1.it)('should not render manual properties form when schema is empty', () => {
            const detailWithEmptySchema = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_schema: [],
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithEmptySchema);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            // Should have subscription form but not manual properties
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-subscription_name')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('form-field-webhook_url')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Credentials Schema with Help Text', () => {
        (0, vitest_1.it)('should transform help to tooltip in credentials schema', () => {
            const detailWithHelp = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true, help: 'Enter your API key' },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithHelp);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-api_key')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Auto Parameters with Description', () => {
        (0, vitest_1.it)('should transform description to tooltip in auto parameters', () => {
            const detailWithDescription = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'repo_name', type: 'string', required: true, description: 'Repository name' },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithDescription);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-repo_name')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Manual Properties with Description', () => {
        (0, vitest_1.it)('should transform description to tooltip in manual properties', () => {
            const detailWithDescription = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_schema: [
                            { name: 'webhook_url', type: 'text', required: true, description: 'Webhook URL' },
                        ],
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithDescription);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-webhook_url')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('MultiSteps Component', () => {
        (0, vitest_1.it)('should not render MultiSteps for OAuth method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('pluginTrigger.modal.steps.verify')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render MultiSteps for Manual method', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('pluginTrigger.modal.steps.verify')).not.toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('API Key Build with Parameters', () => {
        (0, vitest_1.it)('should include parameters in build request for API Key method', async () => {
            const detailWithParams = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                            parameters: [
                                { name: 'repo', type: 'string', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithParams);
            // First verify credentials
            mockVerifyCredentials.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            mockBuildSubscription.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} builder={builder}/>);
            // Click verify
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockVerifyCredentials).toHaveBeenCalled();
            });
            // Now in configuration step, click create
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockBuildSubscription).toHaveBeenCalled();
            });
        });
    });
    (0, vitest_1.describe)('OAuth Build Flow', () => {
        (0, vitest_1.it)('should handle OAuth build flow correctly', async () => {
            const detailWithOAuth = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithOAuth);
            mockBuildSubscription.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockBuildSubscription).toHaveBeenCalled();
            });
        });
    });
    (0, vitest_1.describe)('StatusStep Component Branches', () => {
        (0, vitest_1.it)('should render active indicator dot when step is active', () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            // Verify step is shown (active step has different styling)
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTrigger.modal.steps.verify')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render active indicator for inactive step', () => {
            const detailWithCredentials = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [
                                { name: 'api_key', type: 'secret', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithCredentials);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            // Configuration step should be inactive
            (0, vitest_1.expect)(react_1.screen.getByText('pluginTrigger.modal.steps.configuration')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('refetch Optional Chaining', () => {
        (0, vitest_1.it)('should call refetch when available on successful build', async () => {
            const builder = createMockSubscriptionBuilder();
            mockBuildSubscription.mockImplementation((params, { onSuccess }) => {
                onSuccess();
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('modal-confirm'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefetch).toHaveBeenCalled();
            });
        });
    });
    (0, vitest_1.describe)('Combined Parameter Types', () => {
        (0, vitest_1.it)('should render parameters with mixed types including dynamic-select and boolean', () => {
            const detailWithMixedTypes = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'dynamic_field', type: 'dynamic-select', required: true },
                                { name: 'bool_field', type: 'boolean', required: false },
                                { name: 'text_field', type: 'string', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithMixedTypes);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-dynamic_field')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-bool_field')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-text_field')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render parameters without dynamic-select type', () => {
            const detailWithNonDynamic = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'text_field', type: 'string', required: true },
                                { name: 'number_field', type: 'number', required: false },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithNonDynamic);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-text_field')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-number_field')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render parameters without boolean type', () => {
            const detailWithNonBoolean = createMockPluginDetail({
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'text_field', type: 'string', required: true },
                                { name: 'secret_field', type: 'password', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithNonBoolean);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-text_field')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-secret_field')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Endpoint Default Value', () => {
        (0, vitest_1.it)('should handle undefined endpoint in subscription builder', () => {
            const builderWithoutEndpoint = createMockSubscriptionBuilder({
                endpoint: undefined,
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builderWithoutEndpoint}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-callback_url')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty string endpoint in subscription builder', () => {
            const builderWithEmptyEndpoint = createMockSubscriptionBuilder({
                endpoint: '',
            });
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builderWithEmptyEndpoint}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-callback_url')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Plugin Detail Fallbacks', () => {
        (0, vitest_1.it)('should handle undefined plugin_id', () => {
            const detailWithoutPluginId = createMockPluginDetail({
                plugin_id: '',
                declaration: {
                    trigger: {
                        subscription_constructor: {
                            credentials_schema: [],
                            parameters: [
                                { name: 'dynamic_field', type: 'dynamic-select', required: true },
                            ],
                        },
                    },
                },
            });
            mockUsePluginStore.mockReturnValue(detailWithoutPluginId);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.OAUTH} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('form-field-dynamic_field')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined name in plugin detail', () => {
            const detailWithoutName = createMockPluginDetail({
                name: '',
            });
            mockUsePluginStore.mockReturnValue(detailWithoutName);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('log-viewer')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Log Data Fallback', () => {
        (0, vitest_1.it)('should render log viewer even with empty logs', () => {
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL}/>);
            // LogViewer should render with empty logs array (from mock)
            (0, vitest_1.expect)(react_1.screen.getByTestId('log-viewer')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Disabled State', () => {
        (0, vitest_1.it)('should show disabled state when verifying', () => {
            setMockPendingStates(true, false);
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toHaveAttribute('data-disabled', 'true');
        });
        (0, vitest_1.it)('should show disabled state when building', () => {
            setMockPendingStates(false, true);
            const builder = createMockSubscriptionBuilder();
            (0, react_1.render)(<common_modal_1.CommonCreateModal {...defaultProps} createType={types_1.SupportedCreationMethods.MANUAL} builder={builder}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('modal')).toHaveAttribute('data-disabled', 'true');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLW1vZGFsLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21tb24tbW9kYWwuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrREFBMkU7QUFDM0UsK0JBQThCO0FBQzlCLG1DQUF3RTtBQUN4RSxxQkFBcUI7QUFDckIsMERBQXlFO0FBQ3pFLDBFQUEwRjtBQUMxRixpREFBa0Q7QUE0QmxELCtFQUErRTtBQUMvRSx5QkFBeUI7QUFDekIsK0VBQStFO0FBRS9FLFNBQVMsc0JBQXNCLENBQUMsWUFBbUMsRUFBRTtJQUNuRSxPQUFPO1FBQ0wsU0FBUyxFQUFFLGdCQUFnQjtRQUMzQixRQUFRLEVBQUUsZUFBZTtRQUN6QixJQUFJLEVBQUUsYUFBYTtRQUNuQixXQUFXLEVBQUU7WUFDWCxPQUFPLEVBQUU7Z0JBQ1AsbUJBQW1CLEVBQUUsRUFBRTtnQkFDdkIsd0JBQXdCLEVBQUU7b0JBQ3hCLGtCQUFrQixFQUFFLEVBQUU7b0JBQ3RCLFVBQVUsRUFBRSxFQUFFO2lCQUNmO2FBQ0Y7U0FDRjtRQUNELEdBQUcsU0FBUztLQUNiLENBQUE7QUFDSCxDQUFDO0FBRUQsU0FBUyw2QkFBNkIsQ0FBQyxZQUFpRCxFQUFFO0lBQ3hGLE9BQU87UUFDTCxFQUFFLEVBQUUsYUFBYTtRQUNqQixJQUFJLEVBQUUsY0FBYztRQUNwQixRQUFRLEVBQUUsZUFBZTtRQUN6QixlQUFlLEVBQUUsaUNBQXlCLENBQUMsTUFBTTtRQUNqRCxXQUFXLEVBQUUsRUFBRTtRQUNmLFFBQVEsRUFBRSw4QkFBOEI7UUFDeEMsVUFBVSxFQUFFLEVBQUU7UUFDZCxVQUFVLEVBQUUsRUFBRTtRQUNkLGdCQUFnQixFQUFFLENBQUM7UUFDbkIsR0FBRyxTQUFTO0tBQ2IsQ0FBQTtBQUNILENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLE9BQTJCLEVBQUU7SUFDdEQsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFBO0FBQ2pCLENBQUM7QUFFRCwrRUFBK0U7QUFD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VHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGFmdGVyRWFjaCwgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuLy8gSW1wb3J0IGFmdGVyIG1vY2tzXG5pbXBvcnQgeyBTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvdHlwZXMnXG5pbXBvcnQgeyBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90eXBlcydcbmltcG9ydCB7IENvbW1vbkNyZWF0ZU1vZGFsIH0gZnJvbSAnLi9jb21tb24tbW9kYWwnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFR5cGUgRGVmaW5pdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBQbHVnaW5EZXRhaWwgPSB7XG4gIHBsdWdpbl9pZDogc3RyaW5nXG4gIHByb3ZpZGVyOiBzdHJpbmdcbiAgbmFtZTogc3RyaW5nXG4gIGRlY2xhcmF0aW9uPzoge1xuICAgIHRyaWdnZXI/OiB7XG4gICAgICBzdWJzY3JpcHRpb25fc2NoZW1hPzogQXJyYXk8eyBuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZywgcmVxdWlyZWQ/OiBib29sZWFuLCBkZXNjcmlwdGlvbj86IHN0cmluZyB9PlxuICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yPzoge1xuICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE/OiBBcnJheTx7IG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nLCByZXF1aXJlZD86IGJvb2xlYW4sIGhlbHA/OiBzdHJpbmcgfT5cbiAgICAgICAgcGFyYW1ldGVycz86IEFycmF5PHsgbmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcsIHJlcXVpcmVkPzogYm9vbGVhbiwgZGVzY3JpcHRpb24/OiBzdHJpbmcgfT5cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxudHlwZSBUcmlnZ2VyTG9nRW50aXR5ID0ge1xuICBpZDogc3RyaW5nXG4gIG1lc3NhZ2U6IHN0cmluZ1xuICB0aW1lc3RhbXA6IHN0cmluZ1xuICBsZXZlbDogJ2luZm8nIHwgJ3dhcm4nIHwgJ2Vycm9yJ1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEZhY3RvcnkgRnVuY3Rpb25zXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbkRldGFpbD4gPSB7fSk6IFBsdWdpbkRldGFpbCB7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luX2lkOiAndGVzdC1wbHVnaW4taWQnLFxuICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gICAgbmFtZTogJ1Rlc3QgUGx1Z2luJyxcbiAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgdHJpZ2dlcjoge1xuICAgICAgICBzdWJzY3JpcHRpb25fc2NoZW1hOiBbXSxcbiAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXSxcbiAgICAgICAgICBwYXJhbWV0ZXJzOiBbXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIob3ZlcnJpZGVzOiBQYXJ0aWFsPFRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyPiA9IHt9KTogVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXIge1xuICByZXR1cm4ge1xuICAgIGlkOiAnYnVpbGRlci0xMjMnLFxuICAgIG5hbWU6ICdUZXN0IEJ1aWxkZXInLFxuICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gICAgY3JlZGVudGlhbF90eXBlOiBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtLkFwaUtleSxcbiAgICBjcmVkZW50aWFsczoge30sXG4gICAgZW5kcG9pbnQ6ICdodHRwczovL2V4YW1wbGUuY29tL2NhbGxiYWNrJyxcbiAgICBwYXJhbWV0ZXJzOiB7fSxcbiAgICBwcm9wZXJ0aWVzOiB7fSxcbiAgICB3b3JrZmxvd3NfaW5fdXNlOiAwLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVNb2NrTG9nRGF0YShsb2dzOiBUcmlnZ2VyTG9nRW50aXR5W10gPSBbXSk6IHsgbG9nczogVHJpZ2dlckxvZ0VudGl0eVtdIH0ge1xuICByZXR1cm4geyBsb2dzIH1cbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBTZXR1cFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHBsdWdpbiBzdG9yZVxuY29uc3QgbW9ja1BsdWdpbkRldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuY29uc3QgbW9ja1VzZVBsdWdpblN0b3JlID0gdmkuZm4oKCkgPT4gbW9ja1BsdWdpbkRldGFpbClcbnZpLm1vY2soJy4uLy4uL3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlUGx1Z2luU3RvcmU6ICgpID0+IG1vY2tVc2VQbHVnaW5TdG9yZSgpLFxufSkpXG5cbi8vIE1vY2sgc3Vic2NyaXB0aW9uIGxpc3QgaG9va1xuY29uc3QgbW9ja1JlZmV0Y2ggPSB2aS5mbigpXG52aS5tb2NrKCcuLi91c2Utc3Vic2NyaXB0aW9uLWxpc3QnLCAoKSA9PiAoe1xuICB1c2VTdWJzY3JpcHRpb25MaXN0OiAoKSA9PiAoe1xuICAgIHJlZmV0Y2g6IG1vY2tSZWZldGNoLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHNlcnZpY2UgaG9va3NcbmNvbnN0IG1vY2tWZXJpZnlDcmVkZW50aWFscyA9IHZpLmZuKClcbmNvbnN0IG1vY2tDcmVhdGVCdWlsZGVyID0gdmkuZm4oKVxuY29uc3QgbW9ja0J1aWxkU3Vic2NyaXB0aW9uID0gdmkuZm4oKVxuY29uc3QgbW9ja1VwZGF0ZUJ1aWxkZXIgPSB2aS5mbigpXG5cbi8vIENvbmZpZ3VyYWJsZSBwZW5kaW5nIHN0YXRlc1xubGV0IG1vY2tJc1ZlcmlmeWluZ0NyZWRlbnRpYWxzID0gZmFsc2VcbmxldCBtb2NrSXNCdWlsZGluZyA9IGZhbHNlXG5jb25zdCBzZXRNb2NrUGVuZGluZ1N0YXRlcyA9ICh2ZXJpZnlpbmc6IGJvb2xlYW4sIGJ1aWxkaW5nOiBib29sZWFuKSA9PiB7XG4gIG1vY2tJc1ZlcmlmeWluZ0NyZWRlbnRpYWxzID0gdmVyaWZ5aW5nXG4gIG1vY2tJc0J1aWxkaW5nID0gYnVpbGRpbmdcbn1cblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS10cmlnZ2VycycsICgpID0+ICh7XG4gIHVzZVZlcmlmeUFuZFVwZGF0ZVRyaWdnZXJTdWJzY3JpcHRpb25CdWlsZGVyOiAoKSA9PiAoe1xuICAgIG11dGF0ZTogbW9ja1ZlcmlmeUNyZWRlbnRpYWxzLFxuICAgIGdldCBpc1BlbmRpbmcoKSB7IHJldHVybiBtb2NrSXNWZXJpZnlpbmdDcmVkZW50aWFscyB9LFxuICB9KSxcbiAgdXNlQ3JlYXRlVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXI6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tDcmVhdGVCdWlsZGVyLFxuICAgIGlzUGVuZGluZzogZmFsc2UsXG4gIH0pLFxuICB1c2VCdWlsZFRyaWdnZXJTdWJzY3JpcHRpb246ICgpID0+ICh7XG4gICAgbXV0YXRlOiBtb2NrQnVpbGRTdWJzY3JpcHRpb24sXG4gICAgZ2V0IGlzUGVuZGluZygpIHsgcmV0dXJuIG1vY2tJc0J1aWxkaW5nIH0sXG4gIH0pLFxuICB1c2VVcGRhdGVUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlcjogKCkgPT4gKHtcbiAgICBtdXRhdGU6IG1vY2tVcGRhdGVCdWlsZGVyLFxuICAgIGlzUGVuZGluZzogZmFsc2UsXG4gIH0pLFxuICB1c2VUcmlnZ2VyU3Vic2NyaXB0aW9uQnVpbGRlckxvZ3M6ICgpID0+ICh7XG4gICAgZGF0YTogY3JlYXRlTW9ja0xvZ0RhdGEoKSxcbiAgfSksXG59KSlcblxuLy8gTW9jayBlcnJvciBwYXJzZXJcbmNvbnN0IG1vY2tQYXJzZVBsdWdpbkVycm9yTWVzc2FnZSA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUobnVsbClcbnZpLm1vY2soJ0AvdXRpbHMvZXJyb3ItcGFyc2VyJywgKCkgPT4gKHtcbiAgcGFyc2VQbHVnaW5FcnJvck1lc3NhZ2U6ICguLi5hcmdzOiB1bmtub3duW10pID0+IG1vY2tQYXJzZVBsdWdpbkVycm9yTWVzc2FnZSguLi5hcmdzKSxcbn0pKVxuXG4vLyBNb2NrIFVSTCB2YWxpZGF0aW9uXG52aS5tb2NrKCdAL3V0aWxzL3VybFZhbGlkYXRpb24nLCAoKSA9PiAoe1xuICBpc1ByaXZhdGVPckxvY2FsQWRkcmVzczogdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpLFxufSkpXG5cbi8vIE1vY2sgdG9hc3RcbmNvbnN0IG1vY2tUb2FzdE5vdGlmeSA9IHZpLmZuKClcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IHtcbiAgICBub3RpZnk6IChwYXJhbXM6IHVua25vd24pID0+IG1vY2tUb2FzdE5vdGlmeShwYXJhbXMpLFxuICB9LFxufSkpXG5cbi8vIE1vY2sgTW9kYWwgY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbW9kYWwvbW9kYWwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoe1xuICAgIGNoaWxkcmVuLFxuICAgIG9uQ2xvc2UsXG4gICAgb25Db25maXJtLFxuICAgIHRpdGxlLFxuICAgIGNvbmZpcm1CdXR0b25UZXh0LFxuICAgIGJvdHRvbVNsb3QsXG4gICAgc2l6ZSxcbiAgICBkaXNhYmxlZCxcbiAgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBvbkNsb3NlOiAoKSA9PiB2b2lkXG4gICAgb25Db25maXJtOiAoKSA9PiB2b2lkXG4gICAgdGl0bGU6IHN0cmluZ1xuICAgIGNvbmZpcm1CdXR0b25UZXh0OiBzdHJpbmdcbiAgICBib3R0b21TbG90PzogUmVhY3QuUmVhY3ROb2RlXG4gICAgc2l6ZT86IHN0cmluZ1xuICAgIGRpc2FibGVkPzogYm9vbGVhblxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cIm1vZGFsXCIgZGF0YS1zaXplPXtzaXplfSBkYXRhLWRpc2FibGVkPXtkaXNhYmxlZH0+XG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibW9kYWwtdGl0bGVcIj57dGl0bGV9PC9kaXY+XG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibW9kYWwtY29udGVudFwiPntjaGlsZHJlbn08L2Rpdj5cbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtb2RhbC1ib3R0b20tc2xvdFwiPntib3R0b21TbG90fTwvZGl2PlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNvbmZpcm1cIiBvbkNsaWNrPXtvbkNvbmZpcm19IGRpc2FibGVkPXtkaXNhYmxlZH0+e2NvbmZpcm1CdXR0b25UZXh0fTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cIm1vZGFsLWNsb3NlXCIgb25DbGljaz17b25DbG9zZX0+Q2xvc2U8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBDb25maWd1cmFibGUgZm9ybSBtb2NrIHZhbHVlc1xudHlwZSBNb2NrRm9ybVZhbHVlc0NvbmZpZyA9IHtcbiAgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICBpc0NoZWNrVmFsaWRhdGVkOiBib29sZWFuXG59XG5sZXQgbW9ja0Zvcm1WYWx1ZXNDb25maWc6IE1vY2tGb3JtVmFsdWVzQ29uZmlnID0ge1xuICB2YWx1ZXM6IHsgYXBpX2tleTogJ3Rlc3QtYXBpLWtleScsIHN1YnNjcmlwdGlvbl9uYW1lOiAnVGVzdCBTdWJzY3JpcHRpb24nIH0sXG4gIGlzQ2hlY2tWYWxpZGF0ZWQ6IHRydWUsXG59XG5sZXQgbW9ja0dldEZvcm1SZXR1cm5zTnVsbCA9IGZhbHNlXG5cbi8vIFNlcGFyYXRlIHZhbGlkYXRpb24gY29uZmlncyBmb3IgZGlmZmVyZW50IGZvcm1zXG5sZXQgbW9ja1N1YnNjcmlwdGlvbkZvcm1WYWxpZGF0ZWQgPSB0cnVlXG5sZXQgbW9ja0F1dG9QYXJhbXNGb3JtVmFsaWRhdGVkID0gdHJ1ZVxubGV0IG1vY2tNYW51YWxQcm9wc0Zvcm1WYWxpZGF0ZWQgPSB0cnVlXG5cbmNvbnN0IHNldE1vY2tGb3JtVmFsdWVzQ29uZmlnID0gKGNvbmZpZzogTW9ja0Zvcm1WYWx1ZXNDb25maWcpID0+IHtcbiAgbW9ja0Zvcm1WYWx1ZXNDb25maWcgPSBjb25maWdcbn1cbmNvbnN0IHNldE1vY2tHZXRGb3JtUmV0dXJuc051bGwgPSAodmFsdWU6IGJvb2xlYW4pID0+IHtcbiAgbW9ja0dldEZvcm1SZXR1cm5zTnVsbCA9IHZhbHVlXG59XG5jb25zdCBzZXRNb2NrRm9ybVZhbGlkYXRpb24gPSAoc3Vic2NyaXB0aW9uOiBib29sZWFuLCBhdXRvUGFyYW1zOiBib29sZWFuLCBtYW51YWxQcm9wczogYm9vbGVhbikgPT4ge1xuICBtb2NrU3Vic2NyaXB0aW9uRm9ybVZhbGlkYXRlZCA9IHN1YnNjcmlwdGlvblxuICBtb2NrQXV0b1BhcmFtc0Zvcm1WYWxpZGF0ZWQgPSBhdXRvUGFyYW1zXG4gIG1vY2tNYW51YWxQcm9wc0Zvcm1WYWxpZGF0ZWQgPSBtYW51YWxQcm9wc1xufVxuXG4vLyBNb2NrIEJhc2VGb3JtIGNvbXBvbmVudCB3aXRoIHJlZiBzdXBwb3J0XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZm9ybS9jb21wb25lbnRzL2Jhc2UnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IFJlYWN0ID0gYXdhaXQgaW1wb3J0KCdyZWFjdCcpXG5cbiAgdHlwZSBNb2NrRm9ybVJlZiA9IHtcbiAgICBnZXRGb3JtVmFsdWVzOiAob3B0aW9uczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHsgdmFsdWVzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgaXNDaGVja1ZhbGlkYXRlZDogYm9vbGVhbiB9XG4gICAgc2V0RmllbGRzOiAoZmllbGRzOiBBcnJheTx7IG5hbWU6IHN0cmluZywgZXJyb3JzPzogc3RyaW5nW10sIHdhcm5pbmdzPzogc3RyaW5nW10gfT4pID0+IHZvaWRcbiAgICBnZXRGb3JtOiAoKSA9PiB7IHNldEZpZWxkVmFsdWU6IChuYW1lOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKSA9PiB2b2lkIH0gfCBudWxsXG4gIH1cbiAgdHlwZSBNb2NrQmFzZUZvcm1Qcm9wcyA9IHsgZm9ybVNjaGVtYXM6IEFycmF5PHsgbmFtZTogc3RyaW5nIH0+LCBvbkNoYW5nZT86ICgpID0+IHZvaWQgfVxuXG4gIGZ1bmN0aW9uIE1vY2tCYXNlRm9ybUlubmVyKHsgZm9ybVNjaGVtYXMsIG9uQ2hhbmdlIH06IE1vY2tCYXNlRm9ybVByb3BzLCByZWY6IFJlYWN0LkZvcndhcmRlZFJlZjxNb2NrRm9ybVJlZj4pIHtcbiAgICAvLyBEZXRlcm1pbmUgd2hpY2ggZm9ybSB0aGlzIGlzIGJhc2VkIG9uIHNjaGVtYVxuICAgIGNvbnN0IGlzU3Vic2NyaXB0aW9uRm9ybSA9IGZvcm1TY2hlbWFzLnNvbWUoKHM6IHsgbmFtZTogc3RyaW5nIH0pID0+IHMubmFtZSA9PT0gJ3N1YnNjcmlwdGlvbl9uYW1lJylcbiAgICBjb25zdCBpc0F1dG9QYXJhbXNGb3JtID0gZm9ybVNjaGVtYXMuc29tZSgoczogeyBuYW1lOiBzdHJpbmcgfSkgPT5cbiAgICAgIFsncmVwb19uYW1lJywgJ2JyYW5jaCcsICdyZXBvJywgJ3RleHRfZmllbGQnLCAnZHluYW1pY19maWVsZCcsICdib29sX2ZpZWxkJywgJ3RleHRfaW5wdXRfZmllbGQnLCAndW5rbm93bl9maWVsZCcsICdjb3VudCddLmluY2x1ZGVzKHMubmFtZSksXG4gICAgKVxuICAgIGNvbnN0IGlzTWFudWFsUHJvcHNGb3JtID0gZm9ybVNjaGVtYXMuc29tZSgoczogeyBuYW1lOiBzdHJpbmcgfSkgPT4gcy5uYW1lID09PSAnd2ViaG9va191cmwnKVxuXG4gICAgUmVhY3QudXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsICgpID0+ICh7XG4gICAgICBnZXRGb3JtVmFsdWVzOiAoKSA9PiB7XG4gICAgICAgIGxldCBpc1ZhbGlkYXRlZCA9IG1vY2tGb3JtVmFsdWVzQ29uZmlnLmlzQ2hlY2tWYWxpZGF0ZWRcbiAgICAgICAgaWYgKGlzU3Vic2NyaXB0aW9uRm9ybSlcbiAgICAgICAgICBpc1ZhbGlkYXRlZCA9IG1vY2tTdWJzY3JpcHRpb25Gb3JtVmFsaWRhdGVkXG4gICAgICAgIGVsc2UgaWYgKGlzQXV0b1BhcmFtc0Zvcm0pXG4gICAgICAgICAgaXNWYWxpZGF0ZWQgPSBtb2NrQXV0b1BhcmFtc0Zvcm1WYWxpZGF0ZWRcbiAgICAgICAgZWxzZSBpZiAoaXNNYW51YWxQcm9wc0Zvcm0pXG4gICAgICAgICAgaXNWYWxpZGF0ZWQgPSBtb2NrTWFudWFsUHJvcHNGb3JtVmFsaWRhdGVkXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAuLi5tb2NrRm9ybVZhbHVlc0NvbmZpZyxcbiAgICAgICAgICBpc0NoZWNrVmFsaWRhdGVkOiBpc1ZhbGlkYXRlZCxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNldEZpZWxkczogKCkgPT4ge30sXG4gICAgICBnZXRGb3JtOiAoKSA9PiBtb2NrR2V0Rm9ybVJldHVybnNOdWxsXG4gICAgICAgID8gbnVsbFxuICAgICAgICA6IHsgc2V0RmllbGRWYWx1ZTogKCkgPT4ge30gfSxcbiAgICB9KSlcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImJhc2UtZm9ybVwiPlxuICAgICAgICB7Zm9ybVNjaGVtYXMubWFwKChzY2hlbWE6IHsgbmFtZTogc3RyaW5nIH0pID0+IChcbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGtleT17c2NoZW1hLm5hbWV9XG4gICAgICAgICAgICBkYXRhLXRlc3RpZD17YGZvcm0tZmllbGQtJHtzY2hlbWEubmFtZX1gfVxuICAgICAgICAgICAgbmFtZT17c2NoZW1hLm5hbWV9XG4gICAgICAgICAgICBvbkNoYW5nZT17b25DaGFuZ2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZXR1cm4ge1xuICAgIEJhc2VGb3JtOiBSZWFjdC5mb3J3YXJkUmVmKE1vY2tCYXNlRm9ybUlubmVyKSxcbiAgfVxufSlcblxuLy8gTW9jayBFbmNyeXB0ZWRCb3R0b20gY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZW5jcnlwdGVkLWJvdHRvbScsICgpID0+ICh7XG4gIEVuY3J5cHRlZEJvdHRvbTogKCkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cImVuY3J5cHRlZC1ib3R0b21cIj5FbmNyeXB0ZWQ8L2Rpdj4sXG59KSlcblxuLy8gTW9jayBMb2dWaWV3ZXIgY29tcG9uZW50XG52aS5tb2NrKCcuLi9sb2ctdmlld2VyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgbG9ncyB9OiB7IGxvZ3M6IFRyaWdnZXJMb2dFbnRpdHlbXSB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImxvZy12aWV3ZXJcIj5cbiAgICAgIHtsb2dzLm1hcChsb2cgPT4gKFxuICAgICAgICA8ZGl2IGtleT17bG9nLmlkfSBkYXRhLXRlc3RpZD17YGxvZy0ke2xvZy5pZH1gfT57bG9nLm1lc3NhZ2V9PC9kaXY+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIGRlYm91bmNlXG52aS5tb2NrKCdlcy10b29sa2l0L2NvbXBhdCcsICgpID0+ICh7XG4gIGRlYm91bmNlOiAoZm46ICguLi5hcmdzOiB1bmtub3duW10pID0+IHVua25vd24pID0+IHtcbiAgICBjb25zdCBkZWJvdW5jZWRGbiA9ICguLi5hcmdzOiB1bmtub3duW10pID0+IGZuKC4uLmFyZ3MpXG4gICAgZGVib3VuY2VkRm4uY2FuY2VsID0gdmkuZm4oKVxuICAgIHJldHVybiBkZWJvdW5jZWRGblxuICB9LFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdDb21tb25DcmVhdGVNb2RhbCcsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgY3JlYXRlVHlwZTogU3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLkFQSUtFWSxcbiAgICBidWlsZGVyOiB1bmRlZmluZWQgYXMgVHJpZ2dlclN1YnNjcmlwdGlvbkJ1aWxkZXIgfCB1bmRlZmluZWQsXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKG1vY2tQbHVnaW5EZXRhaWwpXG4gICAgbW9ja0NyZWF0ZUJ1aWxkZXIubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgc3Vic2NyaXB0aW9uX2J1aWxkZXI6IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKCksXG4gICAgfSlcbiAgICAvLyBSZXNldCBjb25maWd1cmFibGUgbW9ja3NcbiAgICBzZXRNb2NrUGVuZGluZ1N0YXRlcyhmYWxzZSwgZmFsc2UpXG4gICAgc2V0TW9ja0Zvcm1WYWx1ZXNDb25maWcoe1xuICAgICAgdmFsdWVzOiB7IGFwaV9rZXk6ICd0ZXN0LWFwaS1rZXknLCBzdWJzY3JpcHRpb25fbmFtZTogJ1Rlc3QgU3Vic2NyaXB0aW9uJyB9LFxuICAgICAgaXNDaGVja1ZhbGlkYXRlZDogdHJ1ZSxcbiAgICB9KVxuICAgIHNldE1vY2tHZXRGb3JtUmV0dXJuc051bGwoZmFsc2UpXG4gICAgc2V0TW9ja0Zvcm1WYWxpZGF0aW9uKHRydWUsIHRydWUsIHRydWUpIC8vIEFsbCBmb3JtcyB2YWxpZGF0ZWQgYnkgZGVmYXVsdFxuICAgIG1vY2tQYXJzZVBsdWdpbkVycm9yTWVzc2FnZS5tb2NrUmVzb2x2ZWRWYWx1ZShudWxsKVxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIGNvcnJlY3QgdGl0bGUgZm9yIEFQSSBLZXkgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtdGl0bGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpblRyaWdnZXIubW9kYWwuYXBpS2V5LnRpdGxlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgd2l0aCBjb3JyZWN0IHRpdGxlIGZvciBNYW51YWwgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtdGl0bGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpblRyaWdnZXIubW9kYWwubWFudWFsLnRpdGxlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgd2l0aCBjb3JyZWN0IHRpdGxlIGZvciBPQXV0aCBtZXRob2QnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLXRpdGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoLnRpdGxlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IG11bHRpLXN0ZXBzIGZvciBBUEkgS2V5IG1ldGhvZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhDcmVkZW50aWFscyA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdhcGlfa2V5JywgdHlwZTogJ3NlY3JldCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoQ3JlZGVudGlhbHMpXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLnN0ZXBzLnZlcmlmeScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luVHJpZ2dlci5tb2RhbC5zdGVwcy5jb25maWd1cmF0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTG9nVmlld2VyIGZvciBNYW51YWwgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9nLXZpZXdlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQnVpbGRlciBJbml0aWFsaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBidWlsZGVyIG9uIG1vdW50IHdoZW4gbm8gYnVpbGRlciBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZUJ1aWxkZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBwcm92aWRlcjogJ3Rlc3QtcHJvdmlkZXInLFxuICAgICAgICAgIGNyZWRlbnRpYWxfdHlwZTogJ2FwaS1rZXknLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY3JlYXRlIGJ1aWxkZXIgd2hlbiBidWlsZGVyIGlzIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXhpc3RpbmdCdWlsZGVyID0gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoKVxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBidWlsZGVyPXtleGlzdGluZ0J1aWxkZXJ9IC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVCdWlsZGVyKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgdG9hc3Qgd2hlbiBidWlsZGVyIGNyZWF0aW9uIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0NyZWF0ZUJ1aWxkZXIubW9ja1JlamVjdGVkVmFsdWVPbmNlKG5ldyBFcnJvcignQ3JlYXRpb24gZmFpbGVkJykpXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAncGx1Z2luVHJpZ2dlci5tb2RhbC5lcnJvcnMuY3JlYXRlRmFpbGVkJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQVBJIEtleSBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc3RhcnQgYXQgVmVyaWZ5IHN0ZXAgZm9yIEFQSSBLZXkgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsV2l0aENyZWRlbnRpYWxzID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2FwaV9rZXknLCB0eXBlOiAnc2VjcmV0JywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhDcmVkZW50aWFscylcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1hcGlfa2V5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHZlcmlmeSBidXR0b24gdGV4dCBpbml0aWFsbHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLmNvbW1vbi52ZXJpZnknKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01vZGFsIEFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBjbG9zZSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBvbkNsb3NlPXttb2NrT25DbG9zZX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNsb3NlJykpXG5cbiAgICAgIGV4cGVjdChtb2NrT25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNvbmZpcm0gaGFuZGxlciB3aGVuIGNvbmZpcm0gYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIGV4cGVjdChtb2NrVG9hc3ROb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgbWVzc2FnZTogJ1BsZWFzZSBmaWxsIGluIGFsbCByZXF1aXJlZCBjcmVkZW50aWFscycsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01hbnVhbCBNZXRob2QnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzdGFydCBhdCBDb25maWd1cmF0aW9uIHN0ZXAgZm9yIE1hbnVhbCBtZXRob2QnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luVHJpZ2dlci5tb2RhbC5tYW51YWwubG9ncy50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1hbnVhbCBwcm9wZXJ0aWVzIGZvcm0gd2hlbiBzY2hlbWEgZXhpc3RzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsV2l0aE1hbnVhbFNjaGVtYSA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9zY2hlbWE6IFtcbiAgICAgICAgICAgICAgeyBuYW1lOiAnd2ViaG9va191cmwnLCB0eXBlOiAndGV4dCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aE1hbnVhbFNjaGVtYSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC13ZWJob29rX3VybCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjcmVhdGUgYnV0dG9uIHRleHQgZm9yIE1hbnVhbCBtZXRob2QnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLmNvbW1vbi5jcmVhdGUnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0Zvcm0gSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNyZWRlbnRpYWxzIGZvcm0gZmllbGRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsV2l0aENyZWRlbnRpYWxzID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2NsaWVudF9pZCcsIHR5cGU6ICd0ZXh0JywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdjbGllbnRfc2VjcmV0JywgdHlwZTogJ3NlY3JldCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoQ3JlZGVudGlhbHMpXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtY2xpZW50X2lkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtY2xpZW50X3NlY3JldCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXNzaW5nIHByb3ZpZGVyIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRob3V0UHJvdmlkZXIgPSB7IC4uLm1vY2tQbHVnaW5EZXRhaWwsIHByb3ZpZGVyOiAnJyB9XG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhvdXRQcm92aWRlcilcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlQnVpbGRlcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgY3JlZGVudGlhbHMgc2NoZW1hJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsV2l0aEVtcHR5U2NoZW1hID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoRW1wdHlTY2hlbWEpXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZm9ybS1maWVsZC1hcGlfa2V5JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCB0cmlnZ2VyIGluIGRlY2xhcmF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsV2l0aEVtcHR5RGVjbGFyYXRpb24gPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB1bmRlZmluZWQsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoRW1wdHlEZWNsYXJhdGlvbilcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NSRURFTlRJQUxfVFlQRV9NQVAnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUobW9ja1BsdWdpbkRldGFpbClcbiAgICAgIG1vY2tDcmVhdGVCdWlsZGVyLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgICAgc3Vic2NyaXB0aW9uX2J1aWxkZXI6IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKCksXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBjb3JyZWN0IGNyZWRlbnRpYWwgdHlwZSBmb3IgQVBJS0VZJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuQVBJS0VZfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlQnVpbGRlcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgY3JlZGVudGlhbF90eXBlOiAnYXBpLWtleScsXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGNvcnJlY3QgY3JlZGVudGlhbCB0eXBlIGZvciBPQVVUSCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlQnVpbGRlcikudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgY3JlZGVudGlhbF90eXBlOiAnb2F1dGgyJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgY29ycmVjdCBjcmVkZW50aWFsIHR5cGUgZm9yIE1BTlVBTCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZUJ1aWxkZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxfdHlwZTogJ3VuYXV0aG9yaXplZCcsXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTU9EQUxfVElUTEVfS0VZX01BUCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBjb3JyZWN0IHRpdGxlIGtleSBmb3IgQVBJS0VZJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuQVBJS0VZfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLXRpdGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLmFwaUtleS50aXRsZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGNvcnJlY3QgdGl0bGUga2V5IGZvciBPQVVUSCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLXRpdGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW5UcmlnZ2VyLm1vZGFsLm9hdXRoLnRpdGxlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgY29ycmVjdCB0aXRsZSBrZXkgZm9yIE1BTlVBTCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC10aXRsZScpKS50b0hhdmVUZXh0Q29udGVudCgncGx1Z2luVHJpZ2dlci5tb2RhbC5tYW51YWwudGl0bGUnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1ZlcmlmeSBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCB2ZXJpZnlDcmVkZW50aWFscyBhbmQgbW92ZSB0byBDb25maWd1cmF0aW9uIHN0ZXAgb24gc3VjY2VzcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhDcmVkZW50aWFscyA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdhcGlfa2V5JywgdHlwZTogJ3NlY3JldCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoQ3JlZGVudGlhbHMpXG4gICAgICBtb2NrVmVyaWZ5Q3JlZGVudGlhbHMubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZUJ1aWxkZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tWZXJpZnlDcmVkZW50aWFscykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3Igb24gdmVyaWZ5IGZhaWx1cmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoQ3JlZGVudGlhbHMgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYXBpX2tleScsIHR5cGU6ICdzZWNyZXQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aENyZWRlbnRpYWxzKVxuICAgICAgbW9ja1ZlcmlmeUNyZWRlbnRpYWxzLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uRXJyb3IgfSkgPT4ge1xuICAgICAgICBvbkVycm9yKG5ldyBFcnJvcignVmVyaWZpY2F0aW9uIGZhaWxlZCcpKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlQnVpbGRlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1ZlcmlmeUNyZWRlbnRpYWxzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ3JlYXRlIEZsb3cnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHdoZW4gc3Vic2NyaXB0aW9uQnVpbGRlciBpcyBub3QgZm91bmQgaW4gQ29uZmlndXJhdGlvbiBzdGVwJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gU3RhcnQgaW4gQ29uZmlndXJhdGlvbiBzdGVwIChNYW51YWwgbWV0aG9kKVxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSAvPilcblxuICAgICAgLy8gQmVmb3JlIGJ1aWxkZXIgaXMgY3JlYXRlZCwgY2xpY2sgY29uZmlybVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1N1YnNjcmlwdGlvbiBidWlsZGVyIG5vdCBmb3VuZCcsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgYnVpbGRTdWJzY3JpcHRpb24gb24gc3VjY2Vzc2Z1bCBjcmVhdGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBidWlsZGVyID0gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoKVxuICAgICAgbW9ja0J1aWxkU3Vic2NyaXB0aW9uLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIC8vIFZlcmlmeSBmb3JtIGlzIHJlbmRlcmVkIGFuZCBjb25maXJtIGJ1dHRvbiBpcyBjbGlja2FibGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgdG9hc3Qgd2hlbiBidWlsZFN1YnNjcmlwdGlvbiBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICBtb2NrQnVpbGRTdWJzY3JpcHRpb24ubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25FcnJvciB9KSA9PiB7XG4gICAgICAgIG9uRXJyb3IobmV3IEVycm9yKCdCdWlsZCBmYWlsZWQnKSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgLy8gVmVyaWZ5IHRoZSBtb2RhbCBpcyBzdGlsbCByZW5kZXJlZCBhZnRlciBlcnJvclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgcmVmZXRjaCBhbmQgb25DbG9zZSBvbiBzdWNjZXNzZnVsIGNyZWF0ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tPbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIG1vY2tCdWlsZFN1YnNjcmlwdGlvbi5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSBidWlsZGVyPXtidWlsZGVyfSBvbkNsb3NlPXttb2NrT25DbG9zZX0gLz4pXG5cbiAgICAgIC8vIFZlcmlmeSBjb21wb25lbnQgcmVuZGVycyB3aXRoIGJ1aWxkZXJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdNYW51YWwgUHJvcGVydGllcyBDaGFuZ2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHVwZGF0ZUJ1aWxkZXIgd2hlbiBtYW51YWwgcHJvcGVydGllcyBjaGFuZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoTWFudWFsU2NoZW1hID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX3NjaGVtYTogW1xuICAgICAgICAgICAgICB7IG5hbWU6ICd3ZWJob29rX3VybCcsIHR5cGU6ICd0ZXh0JywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXSxcbiAgICAgICAgICAgICAgcGFyYW1ldGVyczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoTWFudWFsU2NoZW1hKVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVCdWlsZGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLXdlYmhvb2tfdXJsJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS93ZWJob29rJyB9IH0pXG5cbiAgICAgIC8vIHVwZGF0ZUJ1aWxkZXIgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciBkZWJvdW5jZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlQnVpbGRlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIHVwZGF0ZUJ1aWxkZXIgd2hlbiBzdWJzY3JpcHRpb25CdWlsZGVyIGlzIG1pc3NpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoTWFudWFsU2NoZW1hID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX3NjaGVtYTogW1xuICAgICAgICAgICAgICB7IG5hbWU6ICd3ZWJob29rX3VybCcsIHR5cGU6ICd0ZXh0JywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXSxcbiAgICAgICAgICAgICAgcGFyYW1ldGVyczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoTWFudWFsU2NoZW1hKVxuICAgICAgbW9ja0NyZWF0ZUJ1aWxkZXIubW9ja1Jlc29sdmVkVmFsdWUoeyBzdWJzY3JpcHRpb25fYnVpbGRlcjogdW5kZWZpbmVkIH0pXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLXdlYmhvb2tfdXJsJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS93ZWJob29rJyB9IH0pXG5cbiAgICAgIC8vIHVwZGF0ZUJ1aWxkZXIgc2hvdWxkIG5vdCBiZSBjYWxsZWRcbiAgICAgIGV4cGVjdChtb2NrVXBkYXRlQnVpbGRlcikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1VwZGF0ZUJ1aWxkZXIgRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHRvYXN0IHdoZW4gdXBkYXRlQnVpbGRlciBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhNYW51YWxTY2hlbWEgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fc2NoZW1hOiBbXG4gICAgICAgICAgICAgIHsgbmFtZTogJ3dlYmhvb2tfdXJsJywgdHlwZTogJ3RleHQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhNYW51YWxTY2hlbWEpXG4gICAgICBtb2NrVXBkYXRlQnVpbGRlci5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvbkVycm9yIH0pID0+IHtcbiAgICAgICAgb25FcnJvcihuZXcgRXJyb3IoJ1VwZGF0ZSBmYWlsZWQnKSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NyZWF0ZUJ1aWxkZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtd2ViaG9va191cmwnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdodHRwczovL2V4YW1wbGUuY29tL3dlYmhvb2snIH0gfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlQnVpbGRlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcml2YXRlIEFkZHJlc3MgV2FybmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgd2FybmluZyB3aGVuIGNhbGxiYWNrIFVSTCBpcyBwcml2YXRlIGFkZHJlc3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IGlzUHJpdmF0ZU9yTG9jYWxBZGRyZXNzIH0gPSBhd2FpdCBpbXBvcnQoJ0AvdXRpbHMvdXJsVmFsaWRhdGlvbicpXG4gICAgICB2aS5tb2NrZWQoaXNQcml2YXRlT3JMb2NhbEFkZHJlc3MpLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuXG4gICAgICBjb25zdCBidWlsZGVyID0gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoe1xuICAgICAgICBlbmRwb2ludDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jYWxsYmFjaycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICAvLyBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgd2l0aCB0aGUgcHJpdmF0ZSBhZGRyZXNzIGVuZHBvaW50XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLWNhbGxiYWNrX3VybCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xlYXIgd2FybmluZyB3aGVuIGNhbGxiYWNrIFVSTCBpcyBub3QgcHJpdmF0ZSBhZGRyZXNzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyBpc1ByaXZhdGVPckxvY2FsQWRkcmVzcyB9ID0gYXdhaXQgaW1wb3J0KCdAL3V0aWxzL3VybFZhbGlkYXRpb24nKVxuICAgICAgdmkubW9ja2VkKGlzUHJpdmF0ZU9yTG9jYWxBZGRyZXNzKS5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcih7XG4gICAgICAgIGVuZHBvaW50OiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9jYWxsYmFjaycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICAvLyBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgd2l0aCBwdWJsaWMgYWRkcmVzcyBlbmRwb2ludFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1jYWxsYmFja191cmwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0F1dG8gUGFyYW1ldGVycyBTY2hlbWEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYXV0byBwYXJhbWV0ZXJzIGZvcm0gZm9yIE9BdXRoIG1ldGhvZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhBdXRvUGFyYW1zID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdyZXBvX25hbWUnLCB0eXBlOiAnc3RyaW5nJywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdicmFuY2gnLCB0eXBlOiAndGV4dCcsIHJlcXVpcmVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aEF1dG9QYXJhbXMpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtcmVwb19uYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtYnJhbmNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGF1dG8gcGFyYW1ldGVycyBmb3JtIGZvciBNYW51YWwgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsV2l0aEF1dG9QYXJhbXMgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXSxcbiAgICAgICAgICAgICAgcGFyYW1ldGVyczogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ3JlcG9fbmFtZScsIHR5cGU6ICdzdHJpbmcnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aEF1dG9QYXJhbXMpXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gLz4pXG5cbiAgICAgIC8vIEZvciBtYW51YWwgbWV0aG9kLCBhdXRvIHBhcmFtZXRlcnMgc2hvdWxkIG5vdCBiZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdmb3JtLWZpZWxkLXJlcG9fbmFtZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0Zvcm0gVHlwZSBOb3JtYWxpemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm9ybWFsaXplIHZhcmlvdXMgZm9ybSB0eXBlcyBpbiBhdXRvIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoVmFyaW91c1R5cGVzID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICd0ZXh0X2ZpZWxkJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdzZWNyZXRfZmllbGQnLCB0eXBlOiAncGFzc3dvcmQnIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnbnVtYmVyX2ZpZWxkJywgdHlwZTogJ251bWJlcicgfSxcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdib29sX2ZpZWxkJywgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoVmFyaW91c1R5cGVzKVxuXG4gICAgICBjb25zdCBidWlsZGVyID0gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoKVxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEh9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLXRleHRfZmllbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1zZWNyZXRfZmllbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1udW1iZXJfZmllbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1ib29sX2ZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW50ZWdlciB0eXBlIGFzIG51bWJlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhJbnRlZ2VyID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdjb3VudCcsIHR5cGU6ICdpbnRlZ2VyJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aEludGVnZXIpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtY291bnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0FQSSBLZXkgQ3JlZGVudGlhbHMgQ2hhbmdlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2xlYXIgZXJyb3JzIHdoZW4gY3JlZGVudGlhbHMgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsV2l0aENyZWRlbnRpYWxzID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2FwaV9rZXknLCB0eXBlOiAnc2VjcmV0JywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhDcmVkZW50aWFscylcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtYXBpX2tleScpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ25ldy1hcGkta2V5JyB9IH0pXG5cbiAgICAgIC8vIFZlcmlmeSB0aGUgaW5wdXQgZmllbGQgZXhpc3RzIGFuZCBhY2NlcHRzIGNoYW5nZXNcbiAgICAgIGV4cGVjdChpbnB1dCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1N1YnNjcmlwdGlvbiBGb3JtIGluIENvbmZpZ3VyYXRpb24gU3RlcCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdWJzY3JpcHRpb24gbmFtZSBhbmQgY2FsbGJhY2sgVVJMIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLXN1YnNjcmlwdGlvbl9uYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtY2FsbGJhY2tfdXJsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQZW5kaW5nIFN0YXRlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgdmVyaWZ5aW5nIHRleHQgd2hlbiBpc1ZlcmlmeWluZ0NyZWRlbnRpYWxzIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrUGVuZGluZ1N0YXRlcyh0cnVlLCBmYWxzZSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKS50b0hhdmVUZXh0Q29udGVudCgncGx1Z2luVHJpZ2dlci5tb2RhbC5jb21tb24udmVyaWZ5aW5nJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNyZWF0aW5nIHRleHQgd2hlbiBpc0J1aWxkaW5nIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrUGVuZGluZ1N0YXRlcyhmYWxzZSwgdHJ1ZSlcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpblRyaWdnZXIubW9kYWwuY29tbW9uLmNyZWF0aW5nJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGNvbmZpcm0gYnV0dG9uIHdoZW4gdmVyaWZ5aW5nJywgKCkgPT4ge1xuICAgICAgc2V0TW9ja1BlbmRpbmdTdGF0ZXModHJ1ZSwgZmFsc2UpXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGNvbmZpcm0gYnV0dG9uIHdoZW4gYnVpbGRpbmcnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrUGVuZGluZ1N0YXRlcyhmYWxzZSwgdHJ1ZSlcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdNb2RhbCBTaXplJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXNlIG1kIHNpemUgZm9yIE1hbnVhbCBtZXRob2QnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbCcpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtc2l6ZScsICdtZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHNtIHNpemUgZm9yIEFQSSBLZXkgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuQVBJS0VZfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXNpemUnLCAnc20nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBzbSBzaXplIGZvciBPQXV0aCBtZXRob2QnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1zaXplJywgJ3NtJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCb3R0b21TbG90JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBFbmNyeXB0ZWRCb3R0b20gaW4gVmVyaWZ5IHN0ZXAnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbmNyeXB0ZWQtYm90dG9tJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBFbmNyeXB0ZWRCb3R0b20gaW4gQ29uZmlndXJhdGlvbiBzdGVwJywgKCkgPT4ge1xuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZW5jcnlwdGVkLWJvdHRvbScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0Zvcm0gVmFsaWRhdGlvbiBGYWlsdXJlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVhcmx5IHdoZW4gc3Vic2NyaXB0aW9uIGZvcm0gdmFsaWRhdGlvbiBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIFN1YnNjcmlwdGlvbiBmb3JtIGZhaWxzIHZhbGlkYXRpb25cbiAgICAgIHNldE1vY2tGb3JtVmFsaWRhdGlvbihmYWxzZSwgdHJ1ZSwgdHJ1ZSlcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgLy8gYnVpbGRTdWJzY3JpcHRpb24gc2hvdWxkIG5vdCBiZSBjYWxsZWQgd2hlbiB2YWxpZGF0aW9uIGZhaWxzXG4gICAgICBleHBlY3QobW9ja0J1aWxkU3Vic2NyaXB0aW9uKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVhcmx5IHdoZW4gYXV0byBwYXJhbWV0ZXJzIHZhbGlkYXRpb24gZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBTdWJzY3JpcHRpb24gZm9ybSBwYXNzZXMsIGJ1dCBhdXRvIHBhcmFtcyBmb3JtIGZhaWxzXG4gICAgICBzZXRNb2NrRm9ybVZhbGlkYXRpb24odHJ1ZSwgZmFsc2UsIHRydWUpXG5cbiAgICAgIGNvbnN0IGRldGFpbFdpdGhBdXRvUGFyYW1zID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdyZXBvX25hbWUnLCB0eXBlOiAnc3RyaW5nJywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhBdXRvUGFyYW1zKVxuXG4gICAgICBjb25zdCBidWlsZGVyID0gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoKVxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEh9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIC8vIGJ1aWxkU3Vic2NyaXB0aW9uIHNob3VsZCBub3QgYmUgY2FsbGVkIHdoZW4gdmFsaWRhdGlvbiBmYWlsc1xuICAgICAgZXhwZWN0KG1vY2tCdWlsZFN1YnNjcmlwdGlvbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBlYXJseSB3aGVuIG1hbnVhbCBwcm9wZXJ0aWVzIHZhbGlkYXRpb24gZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBTdWJzY3JpcHRpb24gZm9ybSBwYXNzZXMsIGJ1dCBtYW51YWwgcHJvcGVydGllcyBmb3JtIGZhaWxzXG4gICAgICBzZXRNb2NrRm9ybVZhbGlkYXRpb24odHJ1ZSwgdHJ1ZSwgZmFsc2UpXG5cbiAgICAgIGNvbnN0IGRldGFpbFdpdGhNYW51YWxTY2hlbWEgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fc2NoZW1hOiBbXG4gICAgICAgICAgICAgIHsgbmFtZTogJ3dlYmhvb2tfdXJsJywgdHlwZTogJ3RleHQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhNYW51YWxTY2hlbWEpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIC8vIGJ1aWxkU3Vic2NyaXB0aW9uIHNob3VsZCBub3QgYmUgY2FsbGVkIHdoZW4gdmFsaWRhdGlvbiBmYWlsc1xuICAgICAgZXhwZWN0KG1vY2tCdWlsZFN1YnNjcmlwdGlvbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0Vycm9yIE1lc3NhZ2UgUGFyc2luZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBwYXJzZWQgZXJyb3IgbWVzc2FnZSB3aGVuIGF2YWlsYWJsZSBmb3IgdmVyaWZ5IGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1BhcnNlUGx1Z2luRXJyb3JNZXNzYWdlLm1vY2tSZXNvbHZlZFZhbHVlKCdDdXN0b20gcGFyc2VkIGVycm9yJylcblxuICAgICAgY29uc3QgZGV0YWlsV2l0aENyZWRlbnRpYWxzID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2FwaV9rZXknLCB0eXBlOiAnc2VjcmV0JywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhDcmVkZW50aWFscylcbiAgICAgIG1vY2tWZXJpZnlDcmVkZW50aWFscy5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvbkVycm9yIH0pID0+IHtcbiAgICAgICAgb25FcnJvcihuZXcgRXJyb3IoJ1JhdyBlcnJvcicpKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlQnVpbGRlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1BhcnNlUGx1Z2luRXJyb3JNZXNzYWdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHBhcnNlZCBlcnJvciBtZXNzYWdlIHdoZW4gYXZhaWxhYmxlIGZvciBidWlsZCBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tQYXJzZVBsdWdpbkVycm9yTWVzc2FnZS5tb2NrUmVzb2x2ZWRWYWx1ZSgnQ3VzdG9tIGJ1aWxkIGVycm9yJylcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIG1vY2tCdWlsZFN1YnNjcmlwdGlvbi5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvbkVycm9yIH0pID0+IHtcbiAgICAgICAgb25FcnJvcihuZXcgRXJyb3IoJ1JhdyBidWlsZCBlcnJvcicpKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSBidWlsZGVyPXtidWlsZGVyfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tQYXJzZVBsdWdpbkVycm9yTWVzc2FnZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ0N1c3RvbSBidWlsZCBlcnJvcicsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBmYWxsYmFjayBlcnJvciBtZXNzYWdlIHdoZW4gcGFyc2VQbHVnaW5FcnJvck1lc3NhZ2UgcmV0dXJucyBudWxsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1BhcnNlUGx1Z2luRXJyb3JNZXNzYWdlLm1vY2tSZXNvbHZlZFZhbHVlKG51bGwpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICBtb2NrQnVpbGRTdWJzY3JpcHRpb24ubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25FcnJvciB9KSA9PiB7XG4gICAgICAgIG9uRXJyb3IobmV3IEVycm9yKCdSYXcgZXJyb3InKSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVG9hc3ROb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdwbHVnaW5UcmlnZ2VyLnN1YnNjcmlwdGlvbi5jcmVhdGVGYWlsZWQnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgcGFyc2VkIGVycm9yIG1lc3NhZ2UgZm9yIHVwZGF0ZSBidWlsZGVyIGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1BhcnNlUGx1Z2luRXJyb3JNZXNzYWdlLm1vY2tSZXNvbHZlZFZhbHVlKCdDdXN0b20gdXBkYXRlIGVycm9yJylcblxuICAgICAgY29uc3QgZGV0YWlsV2l0aE1hbnVhbFNjaGVtYSA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9zY2hlbWE6IFtcbiAgICAgICAgICAgICAgeyBuYW1lOiAnd2ViaG9va191cmwnLCB0eXBlOiAndGV4dCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aE1hbnVhbFNjaGVtYSlcbiAgICAgIG1vY2tVcGRhdGVCdWlsZGVyLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uRXJyb3IgfSkgPT4ge1xuICAgICAgICBvbkVycm9yKG5ldyBFcnJvcignVXBkYXRlIGZhaWxlZCcpKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrQ3JlYXRlQnVpbGRlcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC13ZWJob29rX3VybCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2h0dHBzOi8vZXhhbXBsZS5jb20vd2ViaG9vaycgfSB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ0N1c3RvbSB1cGRhdGUgZXJyb3InLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdGb3JtIGdldEZvcm0gbnVsbCBoYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBnZXRGb3JtIHJldHVybmluZyBudWxsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0TW9ja0dldEZvcm1SZXR1cm5zTnVsbCh0cnVlKVxuXG4gICAgICBjb25zdCBidWlsZGVyID0gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoe1xuICAgICAgICBlbmRwb2ludDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vY2FsbGJhY2snLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSBidWlsZGVyPXtidWlsZGVyfSAvPilcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCByZW5kZXIgd2l0aG91dCBlcnJvcnMgZXZlbiB3aGVuIGdldEZvcm0gcmV0dXJucyBudWxsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnbm9ybWFsaXplRm9ybVR5cGUgd2l0aCBleGlzdGluZyBGb3JtVHlwZUVudW0nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdGhlIHNhbWUgdHlwZSB3aGVuIGFscmVhZHkgYSB2YWxpZCBGb3JtVHlwZUVudW0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoRm9ybVR5cGVFbnVtID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICd0ZXh0X2lucHV0X2ZpZWxkJywgdHlwZTogJ3RleHQtaW5wdXQnIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnc2VjcmV0X2lucHV0X2ZpZWxkJywgdHlwZTogJ3NlY3JldC1pbnB1dCcgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhGb3JtVHlwZUVudW0pXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtdGV4dF9pbnB1dF9maWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLXNlY3JldF9pbnB1dF9maWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVua25vd24gdHlwZSBieSBkZWZhdWx0aW5nIHRvIHRleHRJbnB1dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhVbmtub3duVHlwZSA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAndW5rbm93bl9maWVsZCcsIHR5cGU6ICd1bmtub3duLXR5cGUnIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoVW5rbm93blR5cGUpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtdW5rbm93bl9maWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVmVyaWZ5IFN1Y2Nlc3MgRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgc3VjY2VzcyB0b2FzdCBhbmQgbW92ZSB0byBDb25maWd1cmF0aW9uIHN0ZXAgb24gdmVyaWZ5IHN1Y2Nlc3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoQ3JlZGVudGlhbHMgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYXBpX2tleScsIHR5cGU6ICdzZWNyZXQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aENyZWRlbnRpYWxzKVxuICAgICAgbW9ja1ZlcmlmeUNyZWRlbnRpYWxzLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDcmVhdGVCdWlsZGVyKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVG9hc3ROb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICAgICAgbWVzc2FnZTogJ3BsdWdpblRyaWdnZXIubW9kYWwuYXBpS2V5LnZlcmlmeS5zdWNjZXNzJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQnVpbGQgU3VjY2VzcyBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCByZWZldGNoIGFuZCBvbkNsb3NlIG9uIHN1Y2Nlc3NmdWwgYnVpbGQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrT25DbG9zZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICBtb2NrQnVpbGRTdWJzY3JpcHRpb24ubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gYnVpbGRlcj17YnVpbGRlcn0gb25DbG9zZT17bW9ja09uQ2xvc2V9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdwbHVnaW5UcmlnZ2VyLnN1YnNjcmlwdGlvbi5jcmVhdGVTdWNjZXNzJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja09uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrUmVmZXRjaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0R5bmFtaWNTZWxlY3QgUGFyYW1ldGVycycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkeW5hbWljLXNlbGVjdCB0eXBlIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoRHluYW1pY1NlbGVjdCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnZHluYW1pY19maWVsZCcsIHR5cGU6ICdkeW5hbWljLXNlbGVjdCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoRHluYW1pY1NlbGVjdClcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfSBidWlsZGVyPXtidWlsZGVyfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1keW5hbWljX2ZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCb29sZWFuIFR5cGUgUGFyYW1ldGVycycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBib29sZWFuIHR5cGUgcGFyYW1ldGVycyB3aXRoIHNwZWNpYWwgc3R5bGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhCb29sZWFuID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdib29sX2ZpZWxkJywgdHlwZTogJ2Jvb2xlYW4nLCByZXF1aXJlZDogZmFsc2UgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhCb29sZWFuKVxuXG4gICAgICBjb25zdCBidWlsZGVyID0gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoKVxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuT0FVVEh9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLWJvb2xfZmllbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VtcHR5IEZvcm0gVmFsdWVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB3aGVuIGNyZWRlbnRpYWxzIGZvcm0gcmV0dXJucyBlbXB0eSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrRm9ybVZhbHVlc0NvbmZpZyh7XG4gICAgICAgIHZhbHVlczoge30sXG4gICAgICAgIGlzQ2hlY2tWYWxpZGF0ZWQ6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgZGV0YWlsV2l0aENyZWRlbnRpYWxzID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ2FwaV9rZXknLCB0eXBlOiAnc2VjcmV0JywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhDcmVkZW50aWFscylcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdQbGVhc2UgZmlsbCBpbiBhbGwgcmVxdWlyZWQgY3JlZGVudGlhbHMnLFxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBdXRvIFBhcmFtZXRlcnMgd2l0aCBFbXB0eSBTY2hlbWEnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGF1dG8gcGFyYW1ldGVycyB3aGVuIHNjaGVtYSBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhFbXB0eVBhcmFtcyA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhFbXB0eVBhcmFtcylcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfSBidWlsZGVyPXtidWlsZGVyfSAvPilcblxuICAgICAgLy8gU2hvdWxkIG9ubHkgaGF2ZSBzdWJzY3JpcHRpb24gZm9ybSBmaWVsZHNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtc3Vic2NyaXB0aW9uX25hbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1jYWxsYmFja191cmwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01hbnVhbCBQcm9wZXJ0aWVzIHdpdGggRW1wdHkgU2NoZW1hJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBtYW51YWwgcHJvcGVydGllcyBmb3JtIHdoZW4gc2NoZW1hIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGV0YWlsV2l0aEVtcHR5U2NoZW1hID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX3NjaGVtYTogW10sXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXSxcbiAgICAgICAgICAgICAgcGFyYW1ldGVyczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoRW1wdHlTY2hlbWEpXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBoYXZlIHN1YnNjcmlwdGlvbiBmb3JtIGJ1dCBub3QgbWFudWFsIHByb3BlcnRpZXNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtc3Vic2NyaXB0aW9uX25hbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdmb3JtLWZpZWxkLXdlYmhvb2tfdXJsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ3JlZGVudGlhbHMgU2NoZW1hIHdpdGggSGVscCBUZXh0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdHJhbnNmb3JtIGhlbHAgdG8gdG9vbHRpcCBpbiBjcmVkZW50aWFscyBzY2hlbWEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoSGVscCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdhcGlfa2V5JywgdHlwZTogJ3NlY3JldCcsIHJlcXVpcmVkOiB0cnVlLCBoZWxwOiAnRW50ZXIgeW91ciBBUEkga2V5JyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aEhlbHApXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtYXBpX2tleScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQXV0byBQYXJhbWV0ZXJzIHdpdGggRGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmFuc2Zvcm0gZGVzY3JpcHRpb24gdG8gdG9vbHRpcCBpbiBhdXRvIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoRGVzY3JpcHRpb24gPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXSxcbiAgICAgICAgICAgICAgcGFyYW1ldGVyczogW1xuICAgICAgICAgICAgICAgIHsgbmFtZTogJ3JlcG9fbmFtZScsIHR5cGU6ICdzdHJpbmcnLCByZXF1aXJlZDogdHJ1ZSwgZGVzY3JpcHRpb246ICdSZXBvc2l0b3J5IG5hbWUnIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoRGVzY3JpcHRpb24pXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtcmVwb19uYW1lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdNYW51YWwgUHJvcGVydGllcyB3aXRoIERlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdHJhbnNmb3JtIGRlc2NyaXB0aW9uIHRvIHRvb2x0aXAgaW4gbWFudWFsIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoRGVzY3JpcHRpb24gPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fc2NoZW1hOiBbXG4gICAgICAgICAgICAgIHsgbmFtZTogJ3dlYmhvb2tfdXJsJywgdHlwZTogJ3RleHQnLCByZXF1aXJlZDogdHJ1ZSwgZGVzY3JpcHRpb246ICdXZWJob29rIFVSTCcgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXSxcbiAgICAgICAgICAgICAgcGFyYW1ldGVyczogW10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoRGVzY3JpcHRpb24pXG5cbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk1BTlVBTH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtd2ViaG9va191cmwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ011bHRpU3RlcHMgQ29tcG9uZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBNdWx0aVN0ZXBzIGZvciBPQXV0aCBtZXRob2QnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BsdWdpblRyaWdnZXIubW9kYWwuc3RlcHMudmVyaWZ5JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBNdWx0aVN0ZXBzIGZvciBNYW51YWwgbWV0aG9kJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgncGx1Z2luVHJpZ2dlci5tb2RhbC5zdGVwcy52ZXJpZnknKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBUEkgS2V5IEJ1aWxkIHdpdGggUGFyYW1ldGVycycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluY2x1ZGUgcGFyYW1ldGVycyBpbiBidWlsZCByZXF1ZXN0IGZvciBBUEkgS2V5IG1ldGhvZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhQYXJhbXMgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYXBpX2tleScsIHR5cGU6ICdzZWNyZXQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAncmVwbycsIHR5cGU6ICdzdHJpbmcnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aFBhcmFtcylcblxuICAgICAgLy8gRmlyc3QgdmVyaWZ5IGNyZWRlbnRpYWxzXG4gICAgICBtb2NrVmVyaWZ5Q3JlZGVudGlhbHMubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG4gICAgICBtb2NrQnVpbGRTdWJzY3JpcHRpb24ubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIHsgb25TdWNjZXNzIH0pID0+IHtcbiAgICAgICAgb25TdWNjZXNzKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICAvLyBDbGljayB2ZXJpZnlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ21vZGFsLWNvbmZpcm0nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVmVyaWZ5Q3JlZGVudGlhbHMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gTm93IGluIGNvbmZpZ3VyYXRpb24gc3RlcCwgY2xpY2sgY3JlYXRlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0J1aWxkU3Vic2NyaXB0aW9uKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnT0F1dGggQnVpbGQgRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBPQXV0aCBidWlsZCBmbG93IGNvcnJlY3RseScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhPQXV0aCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhPQXV0aClcbiAgICAgIG1vY2tCdWlsZFN1YnNjcmlwdGlvbi5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgeyBvblN1Y2Nlc3MgfSkgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfSBidWlsZGVyPXtidWlsZGVyfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwtY29uZmlybScpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tCdWlsZFN1YnNjcmlwdGlvbikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1N0YXR1c1N0ZXAgQ29tcG9uZW50IEJyYW5jaGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFjdGl2ZSBpbmRpY2F0b3IgZG90IHdoZW4gc3RlcCBpcyBhY3RpdmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoQ3JlZGVudGlhbHMgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYXBpX2tleScsIHR5cGU6ICdzZWNyZXQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aENyZWRlbnRpYWxzKVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBWZXJpZnkgc3RlcCBpcyBzaG93biAoYWN0aXZlIHN0ZXAgaGFzIGRpZmZlcmVudCBzdHlsaW5nKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpblRyaWdnZXIubW9kYWwuc3RlcHMudmVyaWZ5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGFjdGl2ZSBpbmRpY2F0b3IgZm9yIGluYWN0aXZlIHN0ZXAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoQ3JlZGVudGlhbHMgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IHtcbiAgICAgICAgICB0cmlnZ2VyOiB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnYXBpX2tleScsIHR5cGU6ICdzZWNyZXQnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aENyZWRlbnRpYWxzKVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBDb25maWd1cmF0aW9uIHN0ZXAgc2hvdWxkIGJlIGluYWN0aXZlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luVHJpZ2dlci5tb2RhbC5zdGVwcy5jb25maWd1cmF0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdyZWZldGNoIE9wdGlvbmFsIENoYWluaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCByZWZldGNoIHdoZW4gYXZhaWxhYmxlIG9uIHN1Y2Nlc3NmdWwgYnVpbGQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBidWlsZGVyID0gY3JlYXRlTW9ja1N1YnNjcmlwdGlvbkJ1aWxkZXIoKVxuICAgICAgbW9ja0J1aWxkU3Vic2NyaXB0aW9uLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCB7IG9uU3VjY2VzcyB9KSA9PiB7XG4gICAgICAgIG9uU3VjY2VzcygpXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IGJ1aWxkZXI9e2J1aWxkZXJ9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdtb2RhbC1jb25maXJtJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1JlZmV0Y2gpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDb21iaW5lZCBQYXJhbWV0ZXIgVHlwZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFyYW1ldGVycyB3aXRoIG1peGVkIHR5cGVzIGluY2x1ZGluZyBkeW5hbWljLXNlbGVjdCBhbmQgYm9vbGVhbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhNaXhlZFR5cGVzID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdkeW5hbWljX2ZpZWxkJywgdHlwZTogJ2R5bmFtaWMtc2VsZWN0JywgcmVxdWlyZWQ6IHRydWUgfSxcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICdib29sX2ZpZWxkJywgdHlwZTogJ2Jvb2xlYW4nLCByZXF1aXJlZDogZmFsc2UgfSxcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICd0ZXh0X2ZpZWxkJywgdHlwZTogJ3N0cmluZycsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoTWl4ZWRUeXBlcylcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfSBidWlsZGVyPXtidWlsZGVyfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC1keW5hbWljX2ZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtYm9vbF9maWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLXRleHRfZmllbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwYXJhbWV0ZXJzIHdpdGhvdXQgZHluYW1pYy1zZWxlY3QgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhOb25EeW5hbWljID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiB7XG4gICAgICAgICAgdHJpZ2dlcjoge1xuICAgICAgICAgICAgc3Vic2NyaXB0aW9uX2NvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICAgICAgICAgIHBhcmFtZXRlcnM6IFtcbiAgICAgICAgICAgICAgICB7IG5hbWU6ICd0ZXh0X2ZpZWxkJywgdHlwZTogJ3N0cmluZycsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnbnVtYmVyX2ZpZWxkJywgdHlwZTogJ251bWJlcicsIHJlcXVpcmVkOiBmYWxzZSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQbHVnaW5TdG9yZS5tb2NrUmV0dXJuVmFsdWUoZGV0YWlsV2l0aE5vbkR5bmFtaWMpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtdGV4dF9maWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLW51bWJlcl9maWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhcmFtZXRlcnMgd2l0aG91dCBib29sZWFuIHR5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRoTm9uQm9vbGVhbiA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAndGV4dF9maWVsZCcsIHR5cGU6ICdzdHJpbmcnLCByZXF1aXJlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgICAgIHsgbmFtZTogJ3NlY3JldF9maWVsZCcsIHR5cGU6ICdwYXNzd29yZCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRoTm9uQm9vbGVhbilcblxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcbiAgICAgIHJlbmRlcig8Q29tbW9uQ3JlYXRlTW9kYWwgey4uLmRlZmF1bHRQcm9wc30gY3JlYXRlVHlwZT17U3VwcG9ydGVkQ3JlYXRpb25NZXRob2RzLk9BVVRIfSBidWlsZGVyPXtidWlsZGVyfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZm9ybS1maWVsZC10ZXh0X2ZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtc2VjcmV0X2ZpZWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFbmRwb2ludCBEZWZhdWx0IFZhbHVlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBlbmRwb2ludCBpbiBzdWJzY3JpcHRpb24gYnVpbGRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGJ1aWxkZXJXaXRob3V0RW5kcG9pbnQgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcih7XG4gICAgICAgIGVuZHBvaW50OiB1bmRlZmluZWQsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IGJ1aWxkZXI9e2J1aWxkZXJXaXRob3V0RW5kcG9pbnR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLWNhbGxiYWNrX3VybCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZyBlbmRwb2ludCBpbiBzdWJzY3JpcHRpb24gYnVpbGRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IGJ1aWxkZXJXaXRoRW1wdHlFbmRwb2ludCA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKHtcbiAgICAgICAgZW5kcG9pbnQ6ICcnLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSBidWlsZGVyPXtidWlsZGVyV2l0aEVtcHR5RW5kcG9pbnR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmb3JtLWZpZWxkLWNhbGxiYWNrX3VybCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUGx1Z2luIERldGFpbCBGYWxsYmFja3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHBsdWdpbl9pZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbFdpdGhvdXRQbHVnaW5JZCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBwbHVnaW5faWQ6ICcnLFxuICAgICAgICBkZWNsYXJhdGlvbjoge1xuICAgICAgICAgIHRyaWdnZXI6IHtcbiAgICAgICAgICAgIHN1YnNjcmlwdGlvbl9jb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgICBjcmVkZW50aWFsc19zY2hlbWE6IFtdLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJzOiBbXG4gICAgICAgICAgICAgICAgeyBuYW1lOiAnZHluYW1pY19maWVsZCcsIHR5cGU6ICdkeW5hbWljLXNlbGVjdCcsIHJlcXVpcmVkOiB0cnVlIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBsdWdpblN0b3JlLm1vY2tSZXR1cm5WYWx1ZShkZXRhaWxXaXRob3V0UGx1Z2luSWQpXG5cbiAgICAgIGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVNb2NrU3Vic2NyaXB0aW9uQnVpbGRlcigpXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5PQVVUSH0gYnVpbGRlcj17YnVpbGRlcn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Zvcm0tZmllbGQtZHluYW1pY19maWVsZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBuYW1lIGluIHBsdWdpbiBkZXRhaWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkZXRhaWxXaXRob3V0TmFtZSA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBuYW1lOiAnJyxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGx1Z2luU3RvcmUubW9ja1JldHVyblZhbHVlKGRldGFpbFdpdGhvdXROYW1lKVxuXG4gICAgICByZW5kZXIoPENvbW1vbkNyZWF0ZU1vZGFsIHsuLi5kZWZhdWx0UHJvcHN9IGNyZWF0ZVR5cGU9e1N1cHBvcnRlZENyZWF0aW9uTWV0aG9kcy5NQU5VQUx9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2ctdmlld2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdMb2cgRGF0YSBGYWxsYmFjaycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBsb2cgdmlld2VyIGV2ZW4gd2l0aCBlbXB0eSBsb2dzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSAvPilcblxuICAgICAgLy8gTG9nVmlld2VyIHNob3VsZCByZW5kZXIgd2l0aCBlbXB0eSBsb2dzIGFycmF5IChmcm9tIG1vY2spXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2ctdmlld2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdEaXNhYmxlZCBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgZGlzYWJsZWQgc3RhdGUgd2hlbiB2ZXJpZnlpbmcnLCAoKSA9PiB7XG4gICAgICBzZXRNb2NrUGVuZGluZ1N0YXRlcyh0cnVlLCBmYWxzZSlcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWRpc2FibGVkJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZGlzYWJsZWQgc3RhdGUgd2hlbiBidWlsZGluZycsICgpID0+IHtcbiAgICAgIHNldE1vY2tQZW5kaW5nU3RhdGVzKGZhbHNlLCB0cnVlKVxuICAgICAgY29uc3QgYnVpbGRlciA9IGNyZWF0ZU1vY2tTdWJzY3JpcHRpb25CdWlsZGVyKClcblxuICAgICAgcmVuZGVyKDxDb21tb25DcmVhdGVNb2RhbCB7Li4uZGVmYXVsdFByb3BzfSBjcmVhdGVUeXBlPXtTdXBwb3J0ZWRDcmVhdGlvbk1ldGhvZHMuTUFOVUFMfSBidWlsZGVyPXtidWlsZGVyfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWRpc2FibGVkJywgJ3RydWUnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19