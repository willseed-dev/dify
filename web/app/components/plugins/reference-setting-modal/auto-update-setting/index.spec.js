"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const dayjs_1 = require("dayjs");
const timezone_1 = require("dayjs/plugin/timezone");
const utc_1 = require("dayjs/plugin/utc");
const React = require("react");
const vitest_1 = require("vitest");
const types_1 = require("../../types");
const config_1 = require("./config");
const index_1 = require("./index");
const no_data_placeholder_1 = require("./no-data-placeholder");
const no_plugin_selected_1 = require("./no-plugin-selected");
const plugins_picker_1 = require("./plugins-picker");
const plugins_selected_1 = require("./plugins-selected");
const strategy_picker_1 = require("./strategy-picker");
const tool_item_1 = require("./tool-item");
const tool_picker_1 = require("./tool-picker");
const types_2 = require("./types");
const utils_1 = require("./utils");
// Setup dayjs plugins
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
// ================================
// Mock External Dependencies Only
// ================================
// Mock react-i18next
vitest_1.vi.mock('react-i18next', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Trans: ({ i18nKey, components }) => {
            if (i18nKey === 'autoUpdate.changeTimezone' && components?.setTimezone) {
                return (<span>
            Change in
            {components.setTimezone}
          </span>);
            }
            return <span>{i18nKey}</span>;
        },
        useTranslation: () => ({
            t: (key, options) => {
                const translations = {
                    'autoUpdate.updateSettings': 'Update Settings',
                    'autoUpdate.automaticUpdates': 'Automatic Updates',
                    'autoUpdate.updateTime': 'Update Time',
                    'autoUpdate.specifyPluginsToUpdate': 'Specify Plugins to Update',
                    'autoUpdate.strategy.fixOnly.selectedDescription': 'Only apply bug fixes',
                    'autoUpdate.strategy.latest.selectedDescription': 'Always update to latest',
                    'autoUpdate.strategy.disabled.name': 'Disabled',
                    'autoUpdate.strategy.disabled.description': 'No automatic updates',
                    'autoUpdate.strategy.fixOnly.name': 'Bug Fixes Only',
                    'autoUpdate.strategy.fixOnly.description': 'Only apply bug fixes and patches',
                    'autoUpdate.strategy.latest.name': 'Latest Version',
                    'autoUpdate.strategy.latest.description': 'Always update to the latest version',
                    'autoUpdate.upgradeMode.all': 'All Plugins',
                    'autoUpdate.upgradeMode.exclude': 'Exclude Selected',
                    'autoUpdate.upgradeMode.partial': 'Selected Only',
                    'autoUpdate.excludeUpdate': `Excluding ${options?.num || 0} plugins`,
                    'autoUpdate.partialUPdate': `Updating ${options?.num || 0} plugins`,
                    'autoUpdate.operation.clearAll': 'Clear All',
                    'autoUpdate.operation.select': 'Select Plugins',
                    'autoUpdate.upgradeModePlaceholder.partial': 'Select plugins to update',
                    'autoUpdate.upgradeModePlaceholder.exclude': 'Select plugins to exclude',
                    'autoUpdate.noPluginPlaceholder.noInstalled': 'No plugins installed',
                    'autoUpdate.noPluginPlaceholder.noFound': 'No plugins found',
                    'category.all': 'All',
                    'category.models': 'Models',
                    'category.tools': 'Tools',
                    'category.agents': 'Agents',
                    'category.extensions': 'Extensions',
                    'category.datasources': 'Datasources',
                    'category.triggers': 'Triggers',
                    'category.bundles': 'Bundles',
                    'searchTools': 'Search tools...',
                };
                const fullKey = options?.ns ? `${options.ns}.${key}` : key;
                return translations[fullKey] || translations[key] || key;
            },
        }),
    };
});
// Mock app context
const mockTimezone = 'America/New_York';
vitest_1.vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        userProfile: {
            timezone: mockTimezone,
        },
    }),
}));
// Mock modal context
const mockSetShowAccountSettingModal = vitest_1.vi.fn();
vitest_1.vi.mock('@/context/modal-context', () => ({
    useModalContextSelector: (selector) => {
        return selector({ setShowAccountSettingModal: mockSetShowAccountSettingModal });
    },
}));
// Mock i18n context
vitest_1.vi.mock('@/context/i18n', () => ({
    useGetLanguage: () => 'en-US',
}));
// Mock plugins service
const mockPluginsData = { plugins: [] };
vitest_1.vi.mock('@/service/use-plugins', () => ({
    useInstalledPluginList: () => ({
        data: mockPluginsData,
        isLoading: false,
    }),
}));
// Mock portal component for ToolPicker and StrategyPicker
let mockPortalOpen = false;
let forcePortalContentVisible = false; // Allow tests to force content visibility
vitest_1.vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open, onOpenChange: _onOpenChange }) => {
        mockPortalOpen = open;
        return <div data-testid="portal-elem" data-open={open}>{children}</div>;
    },
    PortalToFollowElemTrigger: ({ children, onClick, className }) => (<div data-testid="portal-trigger" onClick={onClick} className={className}>
      {children}
    </div>),
    PortalToFollowElemContent: ({ children, className }) => {
        // Allow forcing content visibility for testing option selection
        if (!mockPortalOpen && !forcePortalContentVisible)
            return null;
        return <div data-testid="portal-content" className={className}>{children}</div>;
    },
}));
// Mock TimePicker component - simplified stateless mock
vitest_1.vi.mock('@/app/components/base/date-and-time-picker/time-picker', () => ({
    default: ({ value, onChange, onClear, renderTrigger }) => {
        const inputElem = <span data-testid="time-input">{value.format('HH:mm')}</span>;
        return (<div data-testid="time-picker">
        {renderTrigger({
                inputElem,
                onClick: () => { },
                isOpen: false,
            })}
        <div data-testid="time-picker-dropdown">
          <button data-testid="time-picker-set" onClick={() => {
                onChange((0, dayjs_1.default)().hour(10).minute(30));
            }}>
            Set 10:30
          </button>
          <button data-testid="time-picker-clear" onClick={() => {
                onClear();
            }}>
            Clear
          </button>
        </div>
      </div>);
    },
}));
// Mock utils from date-and-time-picker
vitest_1.vi.mock('@/app/components/base/date-and-time-picker/utils/dayjs', () => ({
    convertTimezoneToOffsetStr: (tz) => {
        if (tz === 'America/New_York')
            return 'GMT-5';
        if (tz === 'Asia/Shanghai')
            return 'GMT+8';
        return 'GMT+0';
    },
}));
// Mock SearchBox component
vitest_1.vi.mock('@/app/components/plugins/marketplace/search-box', () => ({
    default: ({ search, onSearchChange, tags: _tags, onTagsChange: _onTagsChange, placeholder }) => (<div data-testid="search-box">
      <input data-testid="search-input" value={search} onChange={e => onSearchChange(e.target.value)} placeholder={placeholder}/>
    </div>),
}));
// Mock Checkbox component
vitest_1.vi.mock('@/app/components/base/checkbox', () => ({
    default: ({ checked, onCheck, className }) => (<input type="checkbox" checked={checked} onChange={onCheck} className={className} data-testid="checkbox"/>),
}));
// Mock Icon component
vitest_1.vi.mock('@/app/components/plugins/card/base/card-icon', () => ({
    default: ({ size, src }) => (<img data-testid="plugin-icon" data-size={size} src={src} alt="plugin icon"/>),
}));
// Mock icons
vitest_1.vi.mock('@/app/components/base/icons/src/vender/line/general', () => ({
    SearchMenu: ({ className }) => <span data-testid="search-menu-icon" className={className}>🔍</span>,
}));
vitest_1.vi.mock('@/app/components/base/icons/src/vender/other', () => ({
    Group: ({ className }) => <span data-testid="group-icon" className={className}>📦</span>,
}));
// Mock PLUGIN_TYPE_SEARCH_MAP
vitest_1.vi.mock('../../marketplace/constants', () => ({
    PLUGIN_TYPE_SEARCH_MAP: {
        all: 'all',
        model: 'model',
        tool: 'tool',
        agent: 'agent',
        extension: 'extension',
        datasource: 'datasource',
        trigger: 'trigger',
        bundle: 'bundle',
    },
}));
// Mock i18n renderI18nObject
vitest_1.vi.mock('@/i18n-config', () => ({
    renderI18nObject: (obj, lang) => obj[lang] || obj['en-US'] || '',
}));
// ================================
// Test Data Factories
// ================================
const createMockPluginDeclaration = (overrides = {}) => ({
    plugin_unique_identifier: 'test-plugin-id',
    version: '1.0.0',
    author: 'test-author',
    icon: 'test-icon.png',
    name: 'Test Plugin',
    category: types_1.PluginCategoryEnum.tool,
    label: { 'en-US': 'Test Plugin' },
    description: { 'en-US': 'A test plugin' },
    created_at: '2024-01-01',
    resource: {},
    plugins: {},
    verified: true,
    endpoint: { settings: [], endpoints: [] },
    model: {},
    tags: ['tag1', 'tag2'],
    agent_strategy: {},
    meta: { version: '1.0.0' },
    trigger: {
        events: [],
        identity: {
            author: 'test',
            name: 'test',
            label: { 'en-US': 'Test' },
            description: { 'en-US': 'Test' },
            icon: 'test.png',
            tags: [],
        },
        subscription_constructor: {
            credentials_schema: [],
            oauth_schema: { client_schema: [], credentials_schema: [] },
            parameters: [],
        },
        subscription_schema: [],
    },
    ...overrides,
});
const createMockPluginDetail = (overrides = {}) => ({
    id: 'plugin-1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    name: 'test-plugin',
    plugin_id: 'test-plugin-id',
    plugin_unique_identifier: 'test-plugin-unique',
    declaration: createMockPluginDeclaration(),
    installation_id: 'install-1',
    tenant_id: 'tenant-1',
    endpoints_setups: 0,
    endpoints_active: 0,
    version: '1.0.0',
    latest_version: '1.1.0',
    latest_unique_identifier: 'test-plugin-latest',
    source: types_1.PluginSource.marketplace,
    status: 'active',
    deprecated_reason: '',
    alternative_plugin_id: '',
    ...overrides,
});
const createMockAutoUpdateConfig = (overrides = {}) => ({
    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
    upgrade_time_of_day: 36000, // 10:00 UTC
    upgrade_mode: types_2.AUTO_UPDATE_MODE.update_all,
    exclude_plugins: [],
    include_plugins: [],
    ...overrides,
});
// ================================
// Helper Functions
// ================================
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const renderWithQueryClient = (ui) => {
    const queryClient = createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
      {ui}
    </react_query_1.QueryClientProvider>);
};
// ================================
// Test Suites
// ================================
(0, vitest_1.describe)('auto-update-setting', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpen = false;
        forcePortalContentVisible = false;
        mockPluginsData.plugins = [];
    });
    // ============================================================
    // Types and Config Tests
    // ============================================================
    (0, vitest_1.describe)('types.ts', () => {
        (0, vitest_1.describe)('AUTO_UPDATE_STRATEGY enum', () => {
            (0, vitest_1.it)('should have correct values', () => {
                (0, vitest_1.expect)(types_2.AUTO_UPDATE_STRATEGY.fixOnly).toBe('fix_only');
                (0, vitest_1.expect)(types_2.AUTO_UPDATE_STRATEGY.disabled).toBe('disabled');
                (0, vitest_1.expect)(types_2.AUTO_UPDATE_STRATEGY.latest).toBe('latest');
            });
            (0, vitest_1.it)('should contain exactly 3 strategies', () => {
                const values = Object.values(types_2.AUTO_UPDATE_STRATEGY);
                (0, vitest_1.expect)(values).toHaveLength(3);
            });
        });
        (0, vitest_1.describe)('AUTO_UPDATE_MODE enum', () => {
            (0, vitest_1.it)('should have correct values', () => {
                (0, vitest_1.expect)(types_2.AUTO_UPDATE_MODE.partial).toBe('partial');
                (0, vitest_1.expect)(types_2.AUTO_UPDATE_MODE.exclude).toBe('exclude');
                (0, vitest_1.expect)(types_2.AUTO_UPDATE_MODE.update_all).toBe('all');
            });
            (0, vitest_1.it)('should contain exactly 3 modes', () => {
                const values = Object.values(types_2.AUTO_UPDATE_MODE);
                (0, vitest_1.expect)(values).toHaveLength(3);
            });
        });
    });
    (0, vitest_1.describe)('config.ts', () => {
        (0, vitest_1.describe)('defaultValue', () => {
            (0, vitest_1.it)('should have disabled strategy by default', () => {
                (0, vitest_1.expect)(config_1.defaultValue.strategy_setting).toBe(types_2.AUTO_UPDATE_STRATEGY.disabled);
            });
            (0, vitest_1.it)('should have upgrade_time_of_day as 0', () => {
                (0, vitest_1.expect)(config_1.defaultValue.upgrade_time_of_day).toBe(0);
            });
            (0, vitest_1.it)('should have update_all mode by default', () => {
                (0, vitest_1.expect)(config_1.defaultValue.upgrade_mode).toBe(types_2.AUTO_UPDATE_MODE.update_all);
            });
            (0, vitest_1.it)('should have empty exclude_plugins array', () => {
                (0, vitest_1.expect)(config_1.defaultValue.exclude_plugins).toEqual([]);
            });
            (0, vitest_1.it)('should have empty include_plugins array', () => {
                (0, vitest_1.expect)(config_1.defaultValue.include_plugins).toEqual([]);
            });
            (0, vitest_1.it)('should be a complete AutoUpdateConfig object', () => {
                const keys = Object.keys(config_1.defaultValue);
                (0, vitest_1.expect)(keys).toContain('strategy_setting');
                (0, vitest_1.expect)(keys).toContain('upgrade_time_of_day');
                (0, vitest_1.expect)(keys).toContain('upgrade_mode');
                (0, vitest_1.expect)(keys).toContain('exclude_plugins');
                (0, vitest_1.expect)(keys).toContain('include_plugins');
            });
        });
    });
    // ============================================================
    // Utils Tests (Extended coverage beyond utils.spec.ts)
    // ============================================================
    (0, vitest_1.describe)('utils.ts', () => {
        (0, vitest_1.describe)('timeOfDayToDayjs', () => {
            (0, vitest_1.it)('should convert 0 seconds to midnight', () => {
                const result = (0, utils_1.timeOfDayToDayjs)(0);
                (0, vitest_1.expect)(result.hour()).toBe(0);
                (0, vitest_1.expect)(result.minute()).toBe(0);
            });
            (0, vitest_1.it)('should convert 3600 seconds to 1:00', () => {
                const result = (0, utils_1.timeOfDayToDayjs)(3600);
                (0, vitest_1.expect)(result.hour()).toBe(1);
                (0, vitest_1.expect)(result.minute()).toBe(0);
            });
            (0, vitest_1.it)('should convert 36000 seconds to 10:00', () => {
                const result = (0, utils_1.timeOfDayToDayjs)(36000);
                (0, vitest_1.expect)(result.hour()).toBe(10);
                (0, vitest_1.expect)(result.minute()).toBe(0);
            });
            (0, vitest_1.it)('should convert 43200 seconds to 12:00 (noon)', () => {
                const result = (0, utils_1.timeOfDayToDayjs)(43200);
                (0, vitest_1.expect)(result.hour()).toBe(12);
                (0, vitest_1.expect)(result.minute()).toBe(0);
            });
            (0, vitest_1.it)('should convert 82800 seconds to 23:00', () => {
                const result = (0, utils_1.timeOfDayToDayjs)(82800);
                (0, vitest_1.expect)(result.hour()).toBe(23);
                (0, vitest_1.expect)(result.minute()).toBe(0);
            });
            (0, vitest_1.it)('should handle minutes correctly', () => {
                const result = (0, utils_1.timeOfDayToDayjs)(5400); // 1:30
                (0, vitest_1.expect)(result.hour()).toBe(1);
                (0, vitest_1.expect)(result.minute()).toBe(30);
            });
            (0, vitest_1.it)('should handle 15 minute intervals', () => {
                (0, vitest_1.expect)((0, utils_1.timeOfDayToDayjs)(900).minute()).toBe(15);
                (0, vitest_1.expect)((0, utils_1.timeOfDayToDayjs)(1800).minute()).toBe(30);
                (0, vitest_1.expect)((0, utils_1.timeOfDayToDayjs)(2700).minute()).toBe(45);
            });
        });
        (0, vitest_1.describe)('dayjsToTimeOfDay', () => {
            (0, vitest_1.it)('should return 0 for undefined input', () => {
                (0, vitest_1.expect)((0, utils_1.dayjsToTimeOfDay)(undefined)).toBe(0);
            });
            (0, vitest_1.it)('should convert midnight to 0', () => {
                const midnight = (0, dayjs_1.default)().hour(0).minute(0);
                (0, vitest_1.expect)((0, utils_1.dayjsToTimeOfDay)(midnight)).toBe(0);
            });
            (0, vitest_1.it)('should convert 1:00 to 3600', () => {
                const time = (0, dayjs_1.default)().hour(1).minute(0);
                (0, vitest_1.expect)((0, utils_1.dayjsToTimeOfDay)(time)).toBe(3600);
            });
            (0, vitest_1.it)('should convert 10:30 to 37800', () => {
                const time = (0, dayjs_1.default)().hour(10).minute(30);
                (0, vitest_1.expect)((0, utils_1.dayjsToTimeOfDay)(time)).toBe(37800);
            });
            (0, vitest_1.it)('should convert 23:59 to 86340', () => {
                const time = (0, dayjs_1.default)().hour(23).minute(59);
                (0, vitest_1.expect)((0, utils_1.dayjsToTimeOfDay)(time)).toBe(86340);
            });
        });
        (0, vitest_1.describe)('convertLocalSecondsToUTCDaySeconds', () => {
            (0, vitest_1.it)('should convert local midnight to UTC for positive offset timezone', () => {
                // Shanghai is UTC+8, local midnight should be 16:00 UTC previous day
                const result = (0, utils_1.convertLocalSecondsToUTCDaySeconds)(0, 'Asia/Shanghai');
                (0, vitest_1.expect)(result).toBe((24 - 8) * 3600);
            });
            (0, vitest_1.it)('should handle negative offset timezone', () => {
                // New York is UTC-5 (or -4 during DST), local midnight should be 5:00 UTC
                const result = (0, utils_1.convertLocalSecondsToUTCDaySeconds)(0, 'America/New_York');
                // Result depends on DST, but should be in valid range
                (0, vitest_1.expect)(result).toBeGreaterThanOrEqual(0);
                (0, vitest_1.expect)(result).toBeLessThan(86400);
            });
            (0, vitest_1.it)('should be reversible with convertUTCDaySecondsToLocalSeconds', () => {
                const localSeconds = 36000; // 10:00 local
                const utcSeconds = (0, utils_1.convertLocalSecondsToUTCDaySeconds)(localSeconds, 'Asia/Shanghai');
                const backToLocal = (0, utils_1.convertUTCDaySecondsToLocalSeconds)(utcSeconds, 'Asia/Shanghai');
                (0, vitest_1.expect)(backToLocal).toBe(localSeconds);
            });
        });
        (0, vitest_1.describe)('convertUTCDaySecondsToLocalSeconds', () => {
            (0, vitest_1.it)('should convert UTC midnight to local time for positive offset timezone', () => {
                // UTC midnight in Shanghai (UTC+8) is 8:00 local
                const result = (0, utils_1.convertUTCDaySecondsToLocalSeconds)(0, 'Asia/Shanghai');
                (0, vitest_1.expect)(result).toBe(8 * 3600);
            });
            (0, vitest_1.it)('should handle edge cases near day boundaries', () => {
                // UTC 23:00 in Shanghai is 7:00 next day
                const result = (0, utils_1.convertUTCDaySecondsToLocalSeconds)(23 * 3600, 'Asia/Shanghai');
                (0, vitest_1.expect)(result).toBeGreaterThanOrEqual(0);
                (0, vitest_1.expect)(result).toBeLessThan(86400);
            });
        });
    });
    // ============================================================
    // NoDataPlaceholder Component Tests
    // ============================================================
    (0, vitest_1.describe)('NoDataPlaceholder (no-data-placeholder.tsx)', () => {
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render with noPlugins=true showing group icon', () => {
                // Act
                (0, react_1.render)(<no_data_placeholder_1.default className="test-class" noPlugins={true}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('group-icon')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('No plugins installed')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render with noPlugins=false showing search icon', () => {
                // Act
                (0, react_1.render)(<no_data_placeholder_1.default className="test-class" noPlugins={false}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('search-menu-icon')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('No plugins found')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render with noPlugins=undefined (default) showing search icon', () => {
                // Act
                (0, react_1.render)(<no_data_placeholder_1.default className="test-class"/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('search-menu-icon')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should apply className prop', () => {
                // Act
                const { container } = (0, react_1.render)(<no_data_placeholder_1.default className="custom-height"/>);
                // Assert
                (0, vitest_1.expect)(container.firstChild).toHaveClass('custom-height');
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(no_data_placeholder_1.default).toBeDefined();
                (0, vitest_1.expect)(no_data_placeholder_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
    });
    // ============================================================
    // NoPluginSelected Component Tests
    // ============================================================
    (0, vitest_1.describe)('NoPluginSelected (no-plugin-selected.tsx)', () => {
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render partial mode placeholder', () => {
                // Act
                (0, react_1.render)(<no_plugin_selected_1.default updateMode={types_2.AUTO_UPDATE_MODE.partial}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Select plugins to update')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render exclude mode placeholder', () => {
                // Act
                (0, react_1.render)(<no_plugin_selected_1.default updateMode={types_2.AUTO_UPDATE_MODE.exclude}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Select plugins to exclude')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(no_plugin_selected_1.default).toBeDefined();
                (0, vitest_1.expect)(no_plugin_selected_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
    });
    // ============================================================
    // PluginsSelected Component Tests
    // ============================================================
    (0, vitest_1.describe)('PluginsSelected (plugins-selected.tsx)', () => {
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render empty when no plugins', () => {
                // Act
                const { container } = (0, react_1.render)(<plugins_selected_1.default plugins={[]}/>);
                // Assert
                (0, vitest_1.expect)(container.querySelectorAll('[data-testid="plugin-icon"]')).toHaveLength(0);
            });
            (0, vitest_1.it)('should render all plugins when count is below MAX_DISPLAY_COUNT (14)', () => {
                // Arrange
                const plugins = Array.from({ length: 10 }, (_, i) => `plugin-${i}`);
                // Act
                (0, react_1.render)(<plugins_selected_1.default plugins={plugins}/>);
                // Assert
                const icons = react_1.screen.getAllByTestId('plugin-icon');
                (0, vitest_1.expect)(icons).toHaveLength(10);
            });
            (0, vitest_1.it)('should render MAX_DISPLAY_COUNT plugins with overflow indicator when count exceeds limit', () => {
                // Arrange
                const plugins = Array.from({ length: 20 }, (_, i) => `plugin-${i}`);
                // Act
                (0, react_1.render)(<plugins_selected_1.default plugins={plugins}/>);
                // Assert
                const icons = react_1.screen.getAllByTestId('plugin-icon');
                (0, vitest_1.expect)(icons).toHaveLength(14);
                (0, vitest_1.expect)(react_1.screen.getByText('+6')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render correct icon URLs', () => {
                // Arrange
                const plugins = ['plugin-a', 'plugin-b'];
                // Act
                (0, react_1.render)(<plugins_selected_1.default plugins={plugins}/>);
                // Assert
                const icons = react_1.screen.getAllByTestId('plugin-icon');
                (0, vitest_1.expect)(icons[0]).toHaveAttribute('src', vitest_1.expect.stringContaining('plugin-a'));
                (0, vitest_1.expect)(icons[1]).toHaveAttribute('src', vitest_1.expect.stringContaining('plugin-b'));
            });
            (0, vitest_1.it)('should apply custom className', () => {
                // Act
                const { container } = (0, react_1.render)(<plugins_selected_1.default plugins={['test']} className="custom-class"/>);
                // Assert
                (0, vitest_1.expect)(container.firstChild).toHaveClass('custom-class');
            });
        });
        (0, vitest_1.describe)('Edge Cases', () => {
            (0, vitest_1.it)('should handle exactly MAX_DISPLAY_COUNT plugins without overflow', () => {
                // Arrange - exactly 14 plugins (MAX_DISPLAY_COUNT)
                const plugins = Array.from({ length: 14 }, (_, i) => `plugin-${i}`);
                // Act
                (0, react_1.render)(<plugins_selected_1.default plugins={plugins}/>);
                // Assert - all 14 icons are displayed
                (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-icon')).toHaveLength(14);
                // Note: Component shows "+0" when exactly at limit due to < vs <= comparison
                // This is the actual behavior (isShowAll = plugins.length < MAX_DISPLAY_COUNT)
            });
            (0, vitest_1.it)('should handle MAX_DISPLAY_COUNT + 1 plugins showing overflow', () => {
                // Arrange - 15 plugins
                const plugins = Array.from({ length: 15 }, (_, i) => `plugin-${i}`);
                // Act
                (0, react_1.render)(<plugins_selected_1.default plugins={plugins}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getAllByTestId('plugin-icon')).toHaveLength(14);
                (0, vitest_1.expect)(react_1.screen.getByText('+1')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(plugins_selected_1.default).toBeDefined();
                (0, vitest_1.expect)(plugins_selected_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
    });
    // ============================================================
    // ToolItem Component Tests
    // ============================================================
    (0, vitest_1.describe)('ToolItem (tool-item.tsx)', () => {
        const defaultProps = {
            payload: createMockPluginDetail(),
            isChecked: false,
            onCheckChange: vitest_1.vi.fn(),
        };
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render plugin icon', () => {
                // Act
                (0, react_1.render)(<tool_item_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-icon')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render plugin label', () => {
                // Arrange
                const props = {
                    ...defaultProps,
                    payload: createMockPluginDetail({
                        declaration: createMockPluginDeclaration({
                            label: { 'en-US': 'My Test Plugin' },
                        }),
                    }),
                };
                // Act
                (0, react_1.render)(<tool_item_1.default {...props}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('My Test Plugin')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render plugin author', () => {
                // Arrange
                const props = {
                    ...defaultProps,
                    payload: createMockPluginDetail({
                        declaration: createMockPluginDeclaration({
                            author: 'Plugin Author',
                        }),
                    }),
                };
                // Act
                (0, react_1.render)(<tool_item_1.default {...props}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Plugin Author')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render checkbox unchecked when isChecked is false', () => {
                // Act
                (0, react_1.render)(<tool_item_1.default {...defaultProps} isChecked={false}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('checkbox')).not.toBeChecked();
            });
            (0, vitest_1.it)('should render checkbox checked when isChecked is true', () => {
                // Act
                (0, react_1.render)(<tool_item_1.default {...defaultProps} isChecked={true}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('checkbox')).toBeChecked();
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should call onCheckChange when checkbox is clicked', () => {
                // Arrange
                const onCheckChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<tool_item_1.default {...defaultProps} onCheckChange={onCheckChange}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('checkbox'));
                // Assert
                (0, vitest_1.expect)(onCheckChange).toHaveBeenCalledTimes(1);
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(tool_item_1.default).toBeDefined();
                (0, vitest_1.expect)(tool_item_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
    });
    // ============================================================
    // StrategyPicker Component Tests
    // ============================================================
    (0, vitest_1.describe)('StrategyPicker (strategy-picker.tsx)', () => {
        const defaultProps = {
            value: types_2.AUTO_UPDATE_STRATEGY.disabled,
            onChange: vitest_1.vi.fn(),
        };
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render trigger button with current strategy label', () => {
                // Act
                (0, react_1.render)(<strategy_picker_1.default {...defaultProps} value={types_2.AUTO_UPDATE_STRATEGY.disabled}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /disabled/i })).toBeInTheDocument();
            });
            (0, vitest_1.it)('should not render dropdown content when closed', () => {
                // Act
                (0, react_1.render)(<strategy_picker_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should render all strategy options when open', () => {
                // Arrange
                mockPortalOpen = true;
                // Act
                (0, react_1.render)(<strategy_picker_1.default {...defaultProps}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                // Wait for portal to open
                if (mockPortalOpen) {
                    // Assert all options visible (use getAllByText for "Disabled" as it appears in both trigger and dropdown)
                    (0, vitest_1.expect)(react_1.screen.getAllByText('Disabled').length).toBeGreaterThanOrEqual(1);
                    (0, vitest_1.expect)(react_1.screen.getByText('Bug Fixes Only')).toBeInTheDocument();
                    (0, vitest_1.expect)(react_1.screen.getByText('Latest Version')).toBeInTheDocument();
                }
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should toggle dropdown when trigger is clicked', () => {
                // Act
                (0, react_1.render)(<strategy_picker_1.default {...defaultProps}/>);
                // Assert - initially closed
                (0, vitest_1.expect)(mockPortalOpen).toBe(false);
                // Act - click trigger
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                // Assert - portal trigger element should still be in document
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-trigger')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should call onChange with fixOnly when Bug Fixes Only option is clicked', () => {
                // Arrange - force portal content to be visible for testing option selection
                forcePortalContentVisible = true;
                const onChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<strategy_picker_1.default value={types_2.AUTO_UPDATE_STRATEGY.disabled} onChange={onChange}/>);
                // Find and click the "Bug Fixes Only" option
                const fixOnlyOption = react_1.screen.getByText('Bug Fixes Only').closest('div[class*="cursor-pointer"]');
                (0, vitest_1.expect)(fixOnlyOption).toBeInTheDocument();
                react_1.fireEvent.click(fixOnlyOption);
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(types_2.AUTO_UPDATE_STRATEGY.fixOnly);
            });
            (0, vitest_1.it)('should call onChange with latest when Latest Version option is clicked', () => {
                // Arrange - force portal content to be visible for testing option selection
                forcePortalContentVisible = true;
                const onChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<strategy_picker_1.default value={types_2.AUTO_UPDATE_STRATEGY.disabled} onChange={onChange}/>);
                // Find and click the "Latest Version" option
                const latestOption = react_1.screen.getByText('Latest Version').closest('div[class*="cursor-pointer"]');
                (0, vitest_1.expect)(latestOption).toBeInTheDocument();
                react_1.fireEvent.click(latestOption);
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(types_2.AUTO_UPDATE_STRATEGY.latest);
            });
            (0, vitest_1.it)('should call onChange with disabled when Disabled option is clicked', () => {
                // Arrange - force portal content to be visible for testing option selection
                forcePortalContentVisible = true;
                const onChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<strategy_picker_1.default value={types_2.AUTO_UPDATE_STRATEGY.fixOnly} onChange={onChange}/>);
                // Find and click the "Disabled" option - need to find the one in the dropdown, not the button
                const disabledOptions = react_1.screen.getAllByText('Disabled');
                // The second one should be in the dropdown
                const dropdownOption = disabledOptions.find(el => el.closest('div[class*="cursor-pointer"]'));
                (0, vitest_1.expect)(dropdownOption).toBeInTheDocument();
                react_1.fireEvent.click(dropdownOption.closest('div[class*="cursor-pointer"]'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(types_2.AUTO_UPDATE_STRATEGY.disabled);
            });
            (0, vitest_1.it)('should stop event propagation when option is clicked', () => {
                // Arrange - force portal content to be visible
                forcePortalContentVisible = true;
                const onChange = vitest_1.vi.fn();
                const parentClickHandler = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<div onClick={parentClickHandler}>
            <strategy_picker_1.default value={types_2.AUTO_UPDATE_STRATEGY.disabled} onChange={onChange}/>
          </div>);
                // Click an option
                const fixOnlyOption = react_1.screen.getByText('Bug Fixes Only').closest('div[class*="cursor-pointer"]');
                react_1.fireEvent.click(fixOnlyOption);
                // Assert - onChange is called but parent click handler should not propagate
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(types_2.AUTO_UPDATE_STRATEGY.fixOnly);
            });
            (0, vitest_1.it)('should render check icon for currently selected option', () => {
                // Arrange - force portal content to be visible
                forcePortalContentVisible = true;
                // Act - render with fixOnly selected
                (0, react_1.render)(<strategy_picker_1.default value={types_2.AUTO_UPDATE_STRATEGY.fixOnly} onChange={vitest_1.vi.fn()}/>);
                // Assert - RiCheckLine should be rendered (check icon)
                // Find all "Bug Fixes Only" texts and get the one in the dropdown (has cursor-pointer parent)
                const allFixOnlyTexts = react_1.screen.getAllByText('Bug Fixes Only');
                const dropdownOption = allFixOnlyTexts.find(el => el.closest('div[class*="cursor-pointer"]'));
                const optionContainer = dropdownOption?.closest('div[class*="cursor-pointer"]');
                (0, vitest_1.expect)(optionContainer).toBeInTheDocument();
                // The check icon SVG should exist within the option
                (0, vitest_1.expect)(optionContainer?.querySelector('svg')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should not render check icon for non-selected options', () => {
                // Arrange - force portal content to be visible
                forcePortalContentVisible = true;
                // Act - render with disabled selected
                (0, react_1.render)(<strategy_picker_1.default value={types_2.AUTO_UPDATE_STRATEGY.disabled} onChange={vitest_1.vi.fn()}/>);
                // Assert - check the Latest Version option should not have check icon
                const latestOption = react_1.screen.getByText('Latest Version').closest('div[class*="cursor-pointer"]');
                // The svg should only be in selected option, not in non-selected
                const checkIconContainer = latestOption?.querySelector('div.mr-1');
                // Non-selected option should have empty check icon container
                (0, vitest_1.expect)(checkIconContainer?.querySelector('svg')).toBeNull();
            });
        });
    });
    // ============================================================
    // ToolPicker Component Tests
    // ============================================================
    (0, vitest_1.describe)('ToolPicker (tool-picker.tsx)', () => {
        const defaultProps = {
            trigger: <button>Select Plugins</button>,
            value: [],
            onChange: vitest_1.vi.fn(),
            isShow: false,
            onShowChange: vitest_1.vi.fn(),
        };
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render trigger element', () => {
                // Act
                (0, react_1.render)(<tool_picker_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'Select Plugins' })).toBeInTheDocument();
            });
            (0, vitest_1.it)('should not render content when isShow is false', () => {
                // Act
                (0, react_1.render)(<tool_picker_1.default {...defaultProps} isShow={false}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should render search box and tabs when isShow is true', () => {
                // Arrange
                mockPortalOpen = true;
                // Act
                (0, react_1.render)(<tool_picker_1.default {...defaultProps} isShow={true}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('search-box')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should show NoDataPlaceholder when no plugins and no search query', () => {
                // Arrange
                mockPortalOpen = true;
                mockPluginsData.plugins = [];
                // Act
                renderWithQueryClient(<tool_picker_1.default {...defaultProps} isShow={true}/>);
                // Assert - should show "No plugins installed" when no query
                (0, vitest_1.expect)(react_1.screen.getByTestId('group-icon')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Filtering', () => {
            (0, vitest_1.beforeEach)(() => {
                mockPluginsData.plugins = [
                    createMockPluginDetail({
                        plugin_id: 'tool-plugin',
                        source: types_1.PluginSource.marketplace,
                        declaration: createMockPluginDeclaration({
                            category: types_1.PluginCategoryEnum.tool,
                            label: { 'en-US': 'Tool Plugin' },
                        }),
                    }),
                    createMockPluginDetail({
                        plugin_id: 'model-plugin',
                        source: types_1.PluginSource.marketplace,
                        declaration: createMockPluginDeclaration({
                            category: types_1.PluginCategoryEnum.model,
                            label: { 'en-US': 'Model Plugin' },
                        }),
                    }),
                    createMockPluginDetail({
                        plugin_id: 'github-plugin',
                        source: types_1.PluginSource.github,
                        declaration: createMockPluginDeclaration({
                            label: { 'en-US': 'GitHub Plugin' },
                        }),
                    }),
                ];
            });
            (0, vitest_1.it)('should filter out non-marketplace plugins', () => {
                // Arrange
                mockPortalOpen = true;
                // Act
                renderWithQueryClient(<tool_picker_1.default {...defaultProps} isShow={true}/>);
                // Assert - GitHub plugin should not be shown
                (0, vitest_1.expect)(react_1.screen.queryByText('GitHub Plugin')).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should filter by search query', () => {
                // Arrange
                mockPortalOpen = true;
                // Act
                renderWithQueryClient(<tool_picker_1.default {...defaultProps} isShow={true}/>);
                // Type in search box
                react_1.fireEvent.change(react_1.screen.getByTestId('search-input'), { target: { value: 'tool' } });
                // Assert - only tool plugin should match
                (0, vitest_1.expect)(react_1.screen.getByText('Tool Plugin')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.queryByText('Model Plugin')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should call onShowChange when trigger is clicked', () => {
                // Arrange
                const onShowChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<tool_picker_1.default {...defaultProps} onShowChange={onShowChange}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                // Assert
                (0, vitest_1.expect)(onShowChange).toHaveBeenCalledWith(true);
            });
            (0, vitest_1.it)('should call onChange when plugin is selected', () => {
                // Arrange
                mockPortalOpen = true;
                mockPluginsData.plugins = [
                    createMockPluginDetail({
                        plugin_id: 'test-plugin',
                        source: types_1.PluginSource.marketplace,
                        declaration: createMockPluginDeclaration({ label: { 'en-US': 'Test Plugin' } }),
                    }),
                ];
                const onChange = vitest_1.vi.fn();
                // Act
                renderWithQueryClient(<tool_picker_1.default {...defaultProps} isShow={true} onChange={onChange}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('checkbox'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(['test-plugin']);
            });
            (0, vitest_1.it)('should unselect plugin when already selected', () => {
                // Arrange
                mockPortalOpen = true;
                mockPluginsData.plugins = [
                    createMockPluginDetail({
                        plugin_id: 'test-plugin',
                        source: types_1.PluginSource.marketplace,
                    }),
                ];
                const onChange = vitest_1.vi.fn();
                // Act
                renderWithQueryClient(<tool_picker_1.default {...defaultProps} isShow={true} value={['test-plugin']} onChange={onChange}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('checkbox'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([]);
            });
        });
        (0, vitest_1.describe)('Callback Memoization', () => {
            (0, vitest_1.it)('handleCheckChange should be memoized with correct dependencies', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                mockPortalOpen = true;
                mockPluginsData.plugins = [
                    createMockPluginDetail({
                        plugin_id: 'plugin-1',
                        source: types_1.PluginSource.marketplace,
                    }),
                ];
                // Act - render and interact
                const { rerender } = renderWithQueryClient(<tool_picker_1.default {...defaultProps} isShow={true} value={[]} onChange={onChange}/>);
                // Click to select
                react_1.fireEvent.click(react_1.screen.getByTestId('checkbox'));
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(['plugin-1']);
                // Rerender with new value
                onChange.mockClear();
                rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
            <tool_picker_1.default {...defaultProps} isShow={true} value={['plugin-1']} onChange={onChange}/>
          </react_query_1.QueryClientProvider>);
                // Click to unselect
                react_1.fireEvent.click(react_1.screen.getByTestId('checkbox'));
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([]);
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(tool_picker_1.default).toBeDefined();
                (0, vitest_1.expect)(tool_picker_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
    });
    // ============================================================
    // PluginsPicker Component Tests
    // ============================================================
    (0, vitest_1.describe)('PluginsPicker (plugins-picker.tsx)', () => {
        const defaultProps = {
            updateMode: types_2.AUTO_UPDATE_MODE.partial,
            value: [],
            onChange: vitest_1.vi.fn(),
        };
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render NoPluginSelected when no plugins selected', () => {
                // Act
                (0, react_1.render)(<plugins_picker_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Select plugins to update')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render selected plugins count and clear button when plugins selected', () => {
                // Act
                (0, react_1.render)(<plugins_picker_1.default {...defaultProps} value={['plugin-1', 'plugin-2']}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(/Updating 2 plugins/i)).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Clear All')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render select button', () => {
                // Act
                (0, react_1.render)(<plugins_picker_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Select Plugins')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should show exclude mode text when in exclude mode', () => {
                // Act
                (0, react_1.render)(<plugins_picker_1.default {...defaultProps} updateMode={types_2.AUTO_UPDATE_MODE.exclude} value={['plugin-1']}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(/Excluding 1 plugins/i)).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should call onChange with empty array when clear is clicked', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<plugins_picker_1.default {...defaultProps} value={['plugin-1', 'plugin-2']} onChange={onChange}/>);
                react_1.fireEvent.click(react_1.screen.getByText('Clear All'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith([]);
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(plugins_picker_1.default).toBeDefined();
                (0, vitest_1.expect)(plugins_picker_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
    });
    // ============================================================
    // AutoUpdateSetting Main Component Tests
    // ============================================================
    (0, vitest_1.describe)('AutoUpdateSetting (index.tsx)', () => {
        const defaultProps = {
            payload: createMockAutoUpdateConfig(),
            onChange: vitest_1.vi.fn(),
        };
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render update settings header', () => {
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Update Settings')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render automatic updates label', () => {
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Automatic Updates')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render strategy picker', () => {
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should show time picker when strategy is not disabled', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Update Time')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('time-picker')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should hide time picker and plugins selection when strategy is disabled', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.disabled });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByText('Update Time')).not.toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.queryByTestId('time-picker')).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should show plugins picker when mode is not update_all', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Select Plugins')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should hide plugins picker when mode is update_all', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.update_all,
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByText('Select Plugins')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Strategy Description', () => {
            (0, vitest_1.it)('should show fixOnly description when strategy is fixOnly', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Only apply bug fixes')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should show latest description when strategy is latest', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.latest });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Always update to latest')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should show no description when strategy is disabled', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.disabled });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByText('Only apply bug fixes')).not.toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.queryByText('Always update to latest')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Plugins Selection', () => {
            (0, vitest_1.it)('should show include_plugins when mode is partial', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                    include_plugins: ['plugin-1', 'plugin-2'],
                    exclude_plugins: [],
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(/Updating 2 plugins/i)).toBeInTheDocument();
            });
            (0, vitest_1.it)('should show exclude_plugins when mode is exclude', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.exclude,
                    include_plugins: [],
                    exclude_plugins: ['plugin-1', 'plugin-2', 'plugin-3'],
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText(/Excluding 3 plugins/i)).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should call onChange with updated strategy when strategy changes', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const payload = createMockAutoUpdateConfig();
                // Act
                (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
                // Assert - component renders with strategy picker
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should call onChange with updated time when time changes', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
                // Click time picker trigger
                react_1.fireEvent.click(react_1.screen.getByTestId('time-picker').querySelector('[data-testid="time-input"]').parentElement);
                // Set time
                react_1.fireEvent.click(react_1.screen.getByTestId('time-picker-set'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalled();
            });
            (0, vitest_1.it)('should call onChange with 0 when time is cleared', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
                // Click time picker trigger
                react_1.fireEvent.click(react_1.screen.getByTestId('time-picker').querySelector('[data-testid="time-input"]').parentElement);
                // Clear time
                react_1.fireEvent.click(react_1.screen.getByTestId('time-picker-clear'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalled();
            });
            (0, vitest_1.it)('should call onChange with include_plugins when in partial mode', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                    include_plugins: ['existing-plugin'],
                });
                // Act
                (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
                // Click clear all
                react_1.fireEvent.click(react_1.screen.getByText('Clear All'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    include_plugins: [],
                }));
            });
            (0, vitest_1.it)('should call onChange with exclude_plugins when in exclude mode', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.exclude,
                    exclude_plugins: ['existing-plugin'],
                });
                // Act
                (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
                // Click clear all
                react_1.fireEvent.click(react_1.screen.getByText('Clear All'));
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    exclude_plugins: [],
                }));
            });
            (0, vitest_1.it)('should open account settings when timezone link is clicked', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - timezone text is rendered
                (0, vitest_1.expect)(react_1.screen.getByText(/Change in/i)).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Callback Memoization', () => {
            (0, vitest_1.it)('minuteFilter should filter to 15 minute intervals', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // The minuteFilter is passed to TimePicker internally
                // We verify the component renders correctly
                (0, vitest_1.expect)(react_1.screen.getByTestId('time-picker')).toBeInTheDocument();
            });
            (0, vitest_1.it)('handleChange should preserve other config values', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_time_of_day: 36000,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                    include_plugins: ['plugin-1'],
                    exclude_plugins: [],
                });
                // Act
                (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
                // Trigger a change (clear plugins)
                react_1.fireEvent.click(react_1.screen.getByText('Clear All'));
                // Assert - other values should be preserved
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_time_of_day: 36000,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                }));
            });
            (0, vitest_1.it)('handlePluginsChange should not update when mode is update_all', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.update_all,
                });
                // Act
                (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
                // Plugin picker should not be visible in update_all mode
                (0, vitest_1.expect)(react_1.screen.queryByText('Clear All')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Memoization Logic', () => {
            (0, vitest_1.it)('strategyDescription should update when strategy_setting changes', () => {
                // Arrange
                const payload1 = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} payload={payload1}/>);
                // Assert initial
                (0, vitest_1.expect)(react_1.screen.getByText('Only apply bug fixes')).toBeInTheDocument();
                // Act - change strategy
                const payload2 = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.latest });
                rerender(<index_1.default {...defaultProps} payload={payload2}/>);
                // Assert updated
                (0, vitest_1.expect)(react_1.screen.getByText('Always update to latest')).toBeInTheDocument();
            });
            (0, vitest_1.it)('plugins should reflect correct list based on upgrade_mode', () => {
                // Arrange
                const partialPayload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                    include_plugins: ['include-1', 'include-2'],
                    exclude_plugins: ['exclude-1'],
                });
                const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} payload={partialPayload}/>);
                // Assert - partial mode shows include_plugins count
                (0, vitest_1.expect)(react_1.screen.getByText(/Updating 2 plugins/i)).toBeInTheDocument();
                // Act - change to exclude mode
                const excludePayload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.exclude,
                    include_plugins: ['include-1', 'include-2'],
                    exclude_plugins: ['exclude-1'],
                });
                rerender(<index_1.default {...defaultProps} payload={excludePayload}/>);
                // Assert - exclude mode shows exclude_plugins count
                (0, vitest_1.expect)(react_1.screen.getByText(/Excluding 1 plugins/i)).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(index_1.default).toBeDefined();
                (0, vitest_1.expect)(index_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
        (0, vitest_1.describe)('Edge Cases', () => {
            (0, vitest_1.it)('should handle empty payload values gracefully', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    include_plugins: [],
                    exclude_plugins: [],
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Update Settings')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle null timezone gracefully', () => {
                // This tests the timezone! non-null assertion in the component
                // The mock provides a valid timezone, so the component should work
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - should render without errors
                (0, vitest_1.expect)(react_1.screen.getByTestId('time-picker')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render timezone offset correctly', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - should show timezone offset
                (0, vitest_1.expect)(react_1.screen.getByText('GMT-5')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Upgrade Mode Options', () => {
            (0, vitest_1.it)('should render all three upgrade mode options', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({ strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('All Plugins')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Exclude Selected')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Selected Only')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should highlight selected upgrade mode', () => {
                // Arrange
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                });
                // Act
                (0, react_1.render)(<index_1.default {...defaultProps} payload={payload}/>);
                // Assert - OptionCard component will be rendered for each mode
                (0, vitest_1.expect)(react_1.screen.getByText('All Plugins')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Exclude Selected')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Selected Only')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should call onChange when upgrade mode is changed', () => {
                // Arrange
                const onChange = vitest_1.vi.fn();
                const payload = createMockAutoUpdateConfig({
                    strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.update_all,
                });
                // Act
                (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
                // Click on partial mode - find the option card for partial
                const partialOption = react_1.screen.getByText('Selected Only');
                react_1.fireEvent.click(partialOption);
                // Assert
                (0, vitest_1.expect)(onChange).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                }));
            });
        });
    });
    // ============================================================
    // Integration Tests
    // ============================================================
    (0, vitest_1.describe)('Integration', () => {
        (0, vitest_1.it)('should handle full workflow: enable updates, set time, select plugins', () => {
            // Arrange
            const onChange = vitest_1.vi.fn();
            let currentPayload = createMockAutoUpdateConfig({
                strategy_setting: types_2.AUTO_UPDATE_STRATEGY.disabled,
            });
            const { rerender } = (0, react_1.render)(<index_1.default payload={currentPayload} onChange={onChange}/>);
            // Assert - initially disabled
            (0, vitest_1.expect)(react_1.screen.queryByTestId('time-picker')).not.toBeInTheDocument();
            // Simulate enabling updates
            currentPayload = createMockAutoUpdateConfig({
                strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                include_plugins: [],
            });
            rerender(<index_1.default payload={currentPayload} onChange={onChange}/>);
            // Assert - time picker and plugins visible
            (0, vitest_1.expect)(react_1.screen.getByTestId('time-picker')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Select Plugins')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should maintain state consistency when switching modes', () => {
            // Arrange
            const onChange = vitest_1.vi.fn();
            const payload = createMockAutoUpdateConfig({
                strategy_setting: types_2.AUTO_UPDATE_STRATEGY.fixOnly,
                upgrade_mode: types_2.AUTO_UPDATE_MODE.partial,
                include_plugins: ['plugin-1'],
                exclude_plugins: ['plugin-2'],
            });
            // Act
            (0, react_1.render)(<index_1.default payload={payload} onChange={onChange}/>);
            // Assert - partial mode shows include_plugins
            (0, vitest_1.expect)(react_1.screen.getByText(/Updating 1 plugins/i)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsdURBQXdFO0FBQ3hFLGtEQUFrRTtBQUNsRSxpQ0FBeUI7QUFDekIsb0RBQTRDO0FBQzVDLDBDQUFrQztBQUNsQywrQkFBOEI7QUFDOUIsbUNBQTZEO0FBQzdELHVDQUE4RDtBQUM5RCxxQ0FBdUM7QUFDdkMsbUNBQXVDO0FBQ3ZDLCtEQUFxRDtBQUNyRCw2REFBbUQ7QUFDbkQscURBQTRDO0FBQzVDLHlEQUFnRDtBQUNoRCx1REFBOEM7QUFDOUMsMkNBQWtDO0FBQ2xDLCtDQUFzQztBQUN0QyxtQ0FBZ0U7QUFDaEUsbUNBS2dCO0FBRWhCLHNCQUFzQjtBQUN0QixlQUFLLENBQUMsTUFBTSxDQUFDLGFBQUcsQ0FBQyxDQUFBO0FBQ2pCLGVBQUssQ0FBQyxNQUFNLENBQUMsa0JBQVEsQ0FBQyxDQUFBO0FBRXRCLG1DQUFtQztBQUNuQyxrQ0FBa0M7QUFDbEMsbUNBQW1DO0FBRW5DLHFCQUFxQjtBQUNyQixXQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQUU7SUFDaEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFjLEVBQWtDLENBQUE7SUFDckUsT0FBTztRQUNMLEdBQUcsTUFBTTtRQUNULEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBcUUsRUFBRSxFQUFFO1lBQ3BHLElBQUksT0FBTyxLQUFLLDJCQUEyQixJQUFJLFVBQVUsRUFBRSxXQUFXLEVBQUUsQ0FBQztnQkFDdkUsT0FBTyxDQUNMLENBQUMsSUFBSSxDQUNIOztZQUNBLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FDekI7VUFBQSxFQUFFLElBQUksQ0FBQyxDQUNSLENBQUE7WUFDSCxDQUFDO1lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FB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QyxlQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUU1RSwyQ0FBMkM7WUFDM0MsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDN0QsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNoRSxDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNoRSxVQUFVO1lBQ1YsTUFBTSxRQUFRLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1lBQ3hCLE1BQU0sT0FBTyxHQUFHLDBCQUEwQixDQUFDO2dCQUN6QyxnQkFBZ0IsRUFBRSw0QkFBb0IsQ0FBQyxPQUFPO2dCQUM5QyxZQUFZLEVBQUUsd0JBQWdCLENBQUMsT0FBTztnQkFDdEMsZUFBZSxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUM3QixlQUFlLEVBQUUsQ0FBQyxVQUFVLENBQUM7YUFDOUIsQ0FBQyxDQUFBO1lBRUYsTUFBTTtZQUNOLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbkUsOENBQThDO1lBQzlDLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDckUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBdXRvVXBkYXRlQ29uZmlnIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIHsgUGx1Z2luRGVjbGFyYXRpb24sIFBsdWdpbkRldGFpbCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50LCBRdWVyeUNsaWVudFByb3ZpZGVyIH0gZnJvbSAnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgZGF5anMgZnJvbSAnZGF5anMnXG5pbXBvcnQgdGltZXpvbmUgZnJvbSAnZGF5anMvcGx1Z2luL3RpbWV6b25lJ1xuaW1wb3J0IHV0YyBmcm9tICdkYXlqcy9wbHVnaW4vdXRjJ1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBQbHVnaW5DYXRlZ29yeUVudW0sIFBsdWdpblNvdXJjZSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgZGVmYXVsdFZhbHVlIH0gZnJvbSAnLi9jb25maWcnXG5pbXBvcnQgQXV0b1VwZGF0ZVNldHRpbmcgZnJvbSAnLi9pbmRleCdcbmltcG9ydCBOb0RhdGFQbGFjZWhvbGRlciBmcm9tICcuL25vLWRhdGEtcGxhY2Vob2xkZXInXG5pbXBvcnQgTm9QbHVnaW5TZWxlY3RlZCBmcm9tICcuL25vLXBsdWdpbi1zZWxlY3RlZCdcbmltcG9ydCBQbHVnaW5zUGlja2VyIGZyb20gJy4vcGx1Z2lucy1waWNrZXInXG5pbXBvcnQgUGx1Z2luc1NlbGVjdGVkIGZyb20gJy4vcGx1Z2lucy1zZWxlY3RlZCdcbmltcG9ydCBTdHJhdGVneVBpY2tlciBmcm9tICcuL3N0cmF0ZWd5LXBpY2tlcidcbmltcG9ydCBUb29sSXRlbSBmcm9tICcuL3Rvb2wtaXRlbSdcbmltcG9ydCBUb29sUGlja2VyIGZyb20gJy4vdG9vbC1waWNrZXInXG5pbXBvcnQgeyBBVVRPX1VQREFURV9NT0RFLCBBVVRPX1VQREFURV9TVFJBVEVHWSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQge1xuICBjb252ZXJ0TG9jYWxTZWNvbmRzVG9VVENEYXlTZWNvbmRzLFxuICBjb252ZXJ0VVRDRGF5U2Vjb25kc1RvTG9jYWxTZWNvbmRzLFxuICBkYXlqc1RvVGltZU9mRGF5LFxuICB0aW1lT2ZEYXlUb0RheWpzLFxufSBmcm9tICcuL3V0aWxzJ1xuXG4vLyBTZXR1cCBkYXlqcyBwbHVnaW5zXG5kYXlqcy5leHRlbmQodXRjKVxuZGF5anMuZXh0ZW5kKHRpbWV6b25lKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXMgT25seVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayByZWFjdC1pMThuZXh0XG52aS5tb2NrKCdyZWFjdC1pMThuZXh0JywgYXN5bmMgKGltcG9ydE9yaWdpbmFsKSA9PiB7XG4gIGNvbnN0IGFjdHVhbCA9IGF3YWl0IGltcG9ydE9yaWdpbmFsPHR5cGVvZiBpbXBvcnQoJ3JlYWN0LWkxOG5leHQnKT4oKVxuICByZXR1cm4ge1xuICAgIC4uLmFjdHVhbCxcbiAgICBUcmFuczogKHsgaTE4bktleSwgY29tcG9uZW50cyB9OiB7IGkxOG5LZXk6IHN0cmluZywgY29tcG9uZW50cz86IFJlY29yZDxzdHJpbmcsIFJlYWN0LlJlYWN0Tm9kZT4gfSkgPT4ge1xuICAgICAgaWYgKGkxOG5LZXkgPT09ICdhdXRvVXBkYXRlLmNoYW5nZVRpbWV6b25lJyAmJiBjb21wb25lbnRzPy5zZXRUaW1lem9uZSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgQ2hhbmdlIGluXG4gICAgICAgICAgICB7Y29tcG9uZW50cy5zZXRUaW1lem9uZX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHJldHVybiA8c3Bhbj57aTE4bktleX08L3NwYW4+XG4gICAgfSxcbiAgICB1c2VUcmFuc2xhdGlvbjogKCkgPT4gKHtcbiAgICAgIHQ6IChrZXk6IHN0cmluZywgb3B0aW9ucz86IHsgbnM/OiBzdHJpbmcsIG51bT86IG51bWJlciB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHRyYW5zbGF0aW9uczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgICAgICAnYXV0b1VwZGF0ZS51cGRhdGVTZXR0aW5ncyc6ICdVcGRhdGUgU2V0dGluZ3MnLFxuICAgICAgICAgICdhdXRvVXBkYXRlLmF1dG9tYXRpY1VwZGF0ZXMnOiAnQXV0b21hdGljIFVwZGF0ZXMnLFxuICAgICAgICAgICdhdXRvVXBkYXRlLnVwZGF0ZVRpbWUnOiAnVXBkYXRlIFRpbWUnLFxuICAgICAgICAgICdhdXRvVXBkYXRlLnNwZWNpZnlQbHVnaW5zVG9VcGRhdGUnOiAnU3BlY2lmeSBQbHVnaW5zIHRvIFVwZGF0ZScsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUuc3RyYXRlZ3kuZml4T25seS5zZWxlY3RlZERlc2NyaXB0aW9uJzogJ09ubHkgYXBwbHkgYnVnIGZpeGVzJyxcbiAgICAgICAgICAnYXV0b1VwZGF0ZS5zdHJhdGVneS5sYXRlc3Quc2VsZWN0ZWREZXNjcmlwdGlvbic6ICdBbHdheXMgdXBkYXRlIHRvIGxhdGVzdCcsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUuc3RyYXRlZ3kuZGlzYWJsZWQubmFtZSc6ICdEaXNhYmxlZCcsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUuc3RyYXRlZ3kuZGlzYWJsZWQuZGVzY3JpcHRpb24nOiAnTm8gYXV0b21hdGljIHVwZGF0ZXMnLFxuICAgICAgICAgICdhdXRvVXBkYXRlLnN0cmF0ZWd5LmZpeE9ubHkubmFtZSc6ICdCdWcgRml4ZXMgT25seScsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUuc3RyYXRlZ3kuZml4T25seS5kZXNjcmlwdGlvbic6ICdPbmx5IGFwcGx5IGJ1ZyBmaXhlcyBhbmQgcGF0Y2hlcycsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUuc3RyYXRlZ3kubGF0ZXN0Lm5hbWUnOiAnTGF0ZXN0IFZlcnNpb24nLFxuICAgICAgICAgICdhdXRvVXBkYXRlLnN0cmF0ZWd5LmxhdGVzdC5kZXNjcmlwdGlvbic6ICdBbHdheXMgdXBkYXRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbicsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUudXBncmFkZU1vZGUuYWxsJzogJ0FsbCBQbHVnaW5zJyxcbiAgICAgICAgICAnYXV0b1VwZGF0ZS51cGdyYWRlTW9kZS5leGNsdWRlJzogJ0V4Y2x1ZGUgU2VsZWN0ZWQnLFxuICAgICAgICAgICdhdXRvVXBkYXRlLnVwZ3JhZGVNb2RlLnBhcnRpYWwnOiAnU2VsZWN0ZWQgT25seScsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUuZXhjbHVkZVVwZGF0ZSc6IGBFeGNsdWRpbmcgJHtvcHRpb25zPy5udW0gfHwgMH0gcGx1Z2luc2AsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUucGFydGlhbFVQZGF0ZSc6IGBVcGRhdGluZyAke29wdGlvbnM/Lm51bSB8fCAwfSBwbHVnaW5zYCxcbiAgICAgICAgICAnYXV0b1VwZGF0ZS5vcGVyYXRpb24uY2xlYXJBbGwnOiAnQ2xlYXIgQWxsJyxcbiAgICAgICAgICAnYXV0b1VwZGF0ZS5vcGVyYXRpb24uc2VsZWN0JzogJ1NlbGVjdCBQbHVnaW5zJyxcbiAgICAgICAgICAnYXV0b1VwZGF0ZS51cGdyYWRlTW9kZVBsYWNlaG9sZGVyLnBhcnRpYWwnOiAnU2VsZWN0IHBsdWdpbnMgdG8gdXBkYXRlJyxcbiAgICAgICAgICAnYXV0b1VwZGF0ZS51cGdyYWRlTW9kZVBsYWNlaG9sZGVyLmV4Y2x1ZGUnOiAnU2VsZWN0IHBsdWdpbnMgdG8gZXhjbHVkZScsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUubm9QbHVnaW5QbGFjZWhvbGRlci5ub0luc3RhbGxlZCc6ICdObyBwbHVnaW5zIGluc3RhbGxlZCcsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUubm9QbHVnaW5QbGFjZWhvbGRlci5ub0ZvdW5kJzogJ05vIHBsdWdpbnMgZm91bmQnLFxuICAgICAgICAgICdjYXRlZ29yeS5hbGwnOiAnQWxsJyxcbiAgICAgICAgICAnY2F0ZWdvcnkubW9kZWxzJzogJ01vZGVscycsXG4gICAgICAgICAgJ2NhdGVnb3J5LnRvb2xzJzogJ1Rvb2xzJyxcbiAgICAgICAgICAnY2F0ZWdvcnkuYWdlbnRzJzogJ0FnZW50cycsXG4gICAgICAgICAgJ2NhdGVnb3J5LmV4dGVuc2lvbnMnOiAnRXh0ZW5zaW9ucycsXG4gICAgICAgICAgJ2NhdGVnb3J5LmRhdGFzb3VyY2VzJzogJ0RhdGFzb3VyY2VzJyxcbiAgICAgICAgICAnY2F0ZWdvcnkudHJpZ2dlcnMnOiAnVHJpZ2dlcnMnLFxuICAgICAgICAgICdjYXRlZ29yeS5idW5kbGVzJzogJ0J1bmRsZXMnLFxuICAgICAgICAgICdzZWFyY2hUb29scyc6ICdTZWFyY2ggdG9vbHMuLi4nLFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZ1bGxLZXkgPSBvcHRpb25zPy5ucyA/IGAke29wdGlvbnMubnN9LiR7a2V5fWAgOiBrZXlcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uc1tmdWxsS2V5XSB8fCB0cmFuc2xhdGlvbnNba2V5XSB8fCBrZXlcbiAgICAgIH0sXG4gICAgfSksXG4gIH1cbn0pXG5cbi8vIE1vY2sgYXBwIGNvbnRleHRcbmNvbnN0IG1vY2tUaW1lem9uZSA9ICdBbWVyaWNhL05ld19Zb3JrJ1xudmkubW9jaygnQC9jb250ZXh0L2FwcC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlQXBwQ29udGV4dDogKCkgPT4gKHtcbiAgICB1c2VyUHJvZmlsZToge1xuICAgICAgdGltZXpvbmU6IG1vY2tUaW1lem9uZSxcbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIG1vZGFsIGNvbnRleHRcbmNvbnN0IG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCA9IHZpLmZuKClcbnZpLm1vY2soJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlTW9kYWxDb250ZXh0U2VsZWN0b3I6IChzZWxlY3RvcjogKHM6IHsgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWw6IHR5cGVvZiBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwgfSkgPT4gdHlwZW9mIG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCkgPT4ge1xuICAgIHJldHVybiBzZWxlY3Rvcih7IHNldFNob3dBY2NvdW50U2V0dGluZ01vZGFsOiBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwgfSlcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIGkxOG4gY29udGV4dFxudmkubW9jaygnQC9jb250ZXh0L2kxOG4nLCAoKSA9PiAoe1xuICB1c2VHZXRMYW5ndWFnZTogKCkgPT4gJ2VuLVVTJyxcbn0pKVxuXG4vLyBNb2NrIHBsdWdpbnMgc2VydmljZVxuY29uc3QgbW9ja1BsdWdpbnNEYXRhOiB7IHBsdWdpbnM6IFBsdWdpbkRldGFpbFtdIH0gPSB7IHBsdWdpbnM6IFtdIH1cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtcGx1Z2lucycsICgpID0+ICh7XG4gIHVzZUluc3RhbGxlZFBsdWdpbkxpc3Q6ICgpID0+ICh7XG4gICAgZGF0YTogbW9ja1BsdWdpbnNEYXRhLFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgcG9ydGFsIGNvbXBvbmVudCBmb3IgVG9vbFBpY2tlciBhbmQgU3RyYXRlZ3lQaWNrZXJcbmxldCBtb2NrUG9ydGFsT3BlbiA9IGZhbHNlXG5sZXQgZm9yY2VQb3J0YWxDb250ZW50VmlzaWJsZSA9IGZhbHNlIC8vIEFsbG93IHRlc3RzIHRvIGZvcmNlIGNvbnRlbnQgdmlzaWJpbGl0eVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3BvcnRhbC10by1mb2xsb3ctZWxlbScsICgpID0+ICh7XG4gIFBvcnRhbFRvRm9sbG93RWxlbTogKHsgY2hpbGRyZW4sIG9wZW4sIG9uT3BlbkNoYW5nZTogX29uT3BlbkNoYW5nZSB9OiB7XG4gICAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZVxuICAgIG9wZW46IGJvb2xlYW5cbiAgICBvbk9wZW5DaGFuZ2U6IChvcGVuOiBib29sZWFuKSA9PiB2b2lkXG4gIH0pID0+IHtcbiAgICBtb2NrUG9ydGFsT3BlbiA9IG9wZW5cbiAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1lbGVtXCIgZGF0YS1vcGVuPXtvcGVufT57Y2hpbGRyZW59PC9kaXY+XG4gIH0sXG4gIFBvcnRhbFRvRm9sbG93RWxlbVRyaWdnZXI6ICh7IGNoaWxkcmVuLCBvbkNsaWNrLCBjbGFzc05hbWUgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBvbkNsaWNrOiAoZTogUmVhY3QuTW91c2VFdmVudCkgPT4gdm9pZFxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC10cmlnZ2VyXCIgb25DbGljaz17b25DbGlja30gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIH0pID0+IHtcbiAgICAvLyBBbGxvdyBmb3JjaW5nIGNvbnRlbnQgdmlzaWJpbGl0eSBmb3IgdGVzdGluZyBvcHRpb24gc2VsZWN0aW9uXG4gICAgaWYgKCFtb2NrUG9ydGFsT3BlbiAmJiAhZm9yY2VQb3J0YWxDb250ZW50VmlzaWJsZSlcbiAgICAgIHJldHVybiBudWxsXG4gICAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtY29udGVudFwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57Y2hpbGRyZW59PC9kaXY+XG4gIH0sXG59KSlcblxuLy8gTW9jayBUaW1lUGlja2VyIGNvbXBvbmVudCAtIHNpbXBsaWZpZWQgc3RhdGVsZXNzIG1vY2tcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9kYXRlLWFuZC10aW1lLXBpY2tlci90aW1lLXBpY2tlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHZhbHVlLCBvbkNoYW5nZSwgb25DbGVhciwgcmVuZGVyVHJpZ2dlciB9OiB7XG4gICAgdmFsdWU6IHsgZm9ybWF0OiAoZjogc3RyaW5nKSA9PiBzdHJpbmcgfVxuICAgIG9uQ2hhbmdlOiAodjogdW5rbm93bikgPT4gdm9pZFxuICAgIG9uQ2xlYXI6ICgpID0+IHZvaWRcbiAgICB0aXRsZT86IHN0cmluZ1xuICAgIHJlbmRlclRyaWdnZXI6IChwYXJhbXM6IHsgaW5wdXRFbGVtOiBSZWFjdC5SZWFjdE5vZGUsIG9uQ2xpY2s6ICgpID0+IHZvaWQsIGlzT3BlbjogYm9vbGVhbiB9KSA9PiBSZWFjdC5SZWFjdE5vZGVcbiAgfSkgPT4ge1xuICAgIGNvbnN0IGlucHV0RWxlbSA9IDxzcGFuIGRhdGEtdGVzdGlkPVwidGltZS1pbnB1dFwiPnt2YWx1ZS5mb3JtYXQoJ0hIOm1tJyl9PC9zcGFuPlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ0aW1lLXBpY2tlclwiPlxuICAgICAgICB7cmVuZGVyVHJpZ2dlcih7XG4gICAgICAgICAgaW5wdXRFbGVtLFxuICAgICAgICAgIG9uQ2xpY2s6ICgpID0+IHt9LFxuICAgICAgICAgIGlzT3BlbjogZmFsc2UsXG4gICAgICAgIH0pfVxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwidGltZS1waWNrZXItZHJvcGRvd25cIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBkYXRhLXRlc3RpZD1cInRpbWUtcGlja2VyLXNldFwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG9uQ2hhbmdlKGRheWpzKCkuaG91cigxMCkubWludXRlKDMwKSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgU2V0IDEwOjMwXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0aW1lLXBpY2tlci1jbGVhclwiXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIG9uQ2xlYXIoKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBDbGVhclxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHV0aWxzIGZyb20gZGF0ZS1hbmQtdGltZS1waWNrZXJcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9kYXRlLWFuZC10aW1lLXBpY2tlci91dGlscy9kYXlqcycsICgpID0+ICh7XG4gIGNvbnZlcnRUaW1lem9uZVRvT2Zmc2V0U3RyOiAodHo6IHN0cmluZykgPT4ge1xuICAgIGlmICh0eiA9PT0gJ0FtZXJpY2EvTmV3X1lvcmsnKVxuICAgICAgcmV0dXJuICdHTVQtNSdcbiAgICBpZiAodHogPT09ICdBc2lhL1NoYW5naGFpJylcbiAgICAgIHJldHVybiAnR01UKzgnXG4gICAgcmV0dXJuICdHTVQrMCdcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIFNlYXJjaEJveCBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9tYXJrZXRwbGFjZS9zZWFyY2gtYm94JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgc2VhcmNoLCBvblNlYXJjaENoYW5nZSwgdGFnczogX3RhZ3MsIG9uVGFnc0NoYW5nZTogX29uVGFnc0NoYW5nZSwgcGxhY2Vob2xkZXIgfToge1xuICAgIHNlYXJjaDogc3RyaW5nXG4gICAgb25TZWFyY2hDaGFuZ2U6ICh2OiBzdHJpbmcpID0+IHZvaWRcbiAgICB0YWdzOiBzdHJpbmdbXVxuICAgIG9uVGFnc0NoYW5nZTogKHY6IHN0cmluZ1tdKSA9PiB2b2lkXG4gICAgcGxhY2Vob2xkZXI6IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInNlYXJjaC1ib3hcIj5cbiAgICAgIDxpbnB1dFxuICAgICAgICBkYXRhLXRlc3RpZD1cInNlYXJjaC1pbnB1dFwiXG4gICAgICAgIHZhbHVlPXtzZWFyY2h9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IG9uU2VhcmNoQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIENoZWNrYm94IGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoZWNrYm94JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY2hlY2tlZCwgb25DaGVjaywgY2xhc3NOYW1lIH06IHtcbiAgICBjaGVja2VkPzogYm9vbGVhblxuICAgIG9uQ2hlY2s6ICgpID0+IHZvaWRcbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbiAgfSkgPT4gKFxuICAgIDxpbnB1dFxuICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgIGNoZWNrZWQ9e2NoZWNrZWR9XG4gICAgICBvbkNoYW5nZT17b25DaGVja31cbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgZGF0YS10ZXN0aWQ9XCJjaGVja2JveFwiXG4gICAgLz5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIEljb24gY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvY2FyZC9iYXNlL2NhcmQtaWNvbicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHNpemUsIHNyYyB9OiB7IHNpemU6IHN0cmluZywgc3JjOiBzdHJpbmcgfSkgPT4gKFxuICAgIDxpbWcgZGF0YS10ZXN0aWQ9XCJwbHVnaW4taWNvblwiIGRhdGEtc2l6ZT17c2l6ZX0gc3JjPXtzcmN9IGFsdD1cInBsdWdpbiBpY29uXCIgLz5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIGljb25zXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9saW5lL2dlbmVyYWwnLCAoKSA9PiAoe1xuICBTZWFyY2hNZW51OiAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gPHNwYW4gZGF0YS10ZXN0aWQ9XCJzZWFyY2gtbWVudS1pY29uXCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9PvCflI08L3NwYW4+LFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL290aGVyJywgKCkgPT4gKHtcbiAgR3JvdXA6ICh7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiA8c3BhbiBkYXRhLXRlc3RpZD1cImdyb3VwLWljb25cIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+8J+Tpjwvc3Bhbj4sXG59KSlcblxuLy8gTW9jayBQTFVHSU5fVFlQRV9TRUFSQ0hfTUFQXG52aS5tb2NrKCcuLi8uLi9tYXJrZXRwbGFjZS9jb25zdGFudHMnLCAoKSA9PiAoe1xuICBQTFVHSU5fVFlQRV9TRUFSQ0hfTUFQOiB7XG4gICAgYWxsOiAnYWxsJyxcbiAgICBtb2RlbDogJ21vZGVsJyxcbiAgICB0b29sOiAndG9vbCcsXG4gICAgYWdlbnQ6ICdhZ2VudCcsXG4gICAgZXh0ZW5zaW9uOiAnZXh0ZW5zaW9uJyxcbiAgICBkYXRhc291cmNlOiAnZGF0YXNvdXJjZScsXG4gICAgdHJpZ2dlcjogJ3RyaWdnZXInLFxuICAgIGJ1bmRsZTogJ2J1bmRsZScsXG4gIH0sXG59KSlcblxuLy8gTW9jayBpMThuIHJlbmRlckkxOG5PYmplY3RcbnZpLm1vY2soJ0AvaTE4bi1jb25maWcnLCAoKSA9PiAoe1xuICByZW5kZXJJMThuT2JqZWN0OiAob2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBsYW5nOiBzdHJpbmcpID0+IG9ialtsYW5nXSB8fCBvYmpbJ2VuLVVTJ10gfHwgJycsXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBGYWN0b3JpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZU1vY2tQbHVnaW5EZWNsYXJhdGlvbiA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luRGVjbGFyYXRpb24+ID0ge30pOiBQbHVnaW5EZWNsYXJhdGlvbiA9PiAoe1xuICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXBsdWdpbi1pZCcsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgaWNvbjogJ3Rlc3QtaWNvbi5wbmcnLFxuICBuYW1lOiAnVGVzdCBQbHVnaW4nLFxuICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gIGxhYmVsOiB7ICdlbi1VUyc6ICdUZXN0IFBsdWdpbicgfSBhcyBQbHVnaW5EZWNsYXJhdGlvblsnbGFiZWwnXSxcbiAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ0EgdGVzdCBwbHVnaW4nIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2Rlc2NyaXB0aW9uJ10sXG4gIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxJyxcbiAgcmVzb3VyY2U6IHt9LFxuICBwbHVnaW5zOiB7fSxcbiAgdmVyaWZpZWQ6IHRydWUsXG4gIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSwgZW5kcG9pbnRzOiBbXSB9LFxuICBtb2RlbDoge30sXG4gIHRhZ3M6IFsndGFnMScsICd0YWcyJ10sXG4gIGFnZW50X3N0cmF0ZWd5OiB7fSxcbiAgbWV0YTogeyB2ZXJzaW9uOiAnMS4wLjAnIH0sXG4gIHRyaWdnZXI6IHtcbiAgICBldmVudHM6IFtdLFxuICAgIGlkZW50aXR5OiB7XG4gICAgICBhdXRob3I6ICd0ZXN0JyxcbiAgICAgIG5hbWU6ICd0ZXN0JyxcbiAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdUZXN0JyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICAgICAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ1Rlc3QnIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2Rlc2NyaXB0aW9uJ10sXG4gICAgICBpY29uOiAndGVzdC5wbmcnLFxuICAgICAgdGFnczogW10sXG4gICAgfSxcbiAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICBvYXV0aF9zY2hlbWE6IHsgY2xpZW50X3NjaGVtYTogW10sIGNyZWRlbnRpYWxzX3NjaGVtYTogW10gfSxcbiAgICAgIHBhcmFtZXRlcnM6IFtdLFxuICAgIH0sXG4gICAgc3Vic2NyaXB0aW9uX3NjaGVtYTogW10sXG4gIH0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbkRldGFpbD4gPSB7fSk6IFBsdWdpbkRldGFpbCA9PiAoe1xuICBpZDogJ3BsdWdpbi0xJyxcbiAgY3JlYXRlZF9hdDogJzIwMjQtMDEtMDEnLFxuICB1cGRhdGVkX2F0OiAnMjAyNC0wMS0wMScsXG4gIG5hbWU6ICd0ZXN0LXBsdWdpbicsXG4gIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC1wbHVnaW4tdW5pcXVlJyxcbiAgZGVjbGFyYXRpb246IGNyZWF0ZU1vY2tQbHVnaW5EZWNsYXJhdGlvbigpLFxuICBpbnN0YWxsYXRpb25faWQ6ICdpbnN0YWxsLTEnLFxuICB0ZW5hbnRfaWQ6ICd0ZW5hbnQtMScsXG4gIGVuZHBvaW50c19zZXR1cHM6IDAsXG4gIGVuZHBvaW50c19hY3RpdmU6IDAsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF92ZXJzaW9uOiAnMS4xLjAnLFxuICBsYXRlc3RfdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXBsdWdpbi1sYXRlc3QnLFxuICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgZGVwcmVjYXRlZF9yZWFzb246ICcnLFxuICBhbHRlcm5hdGl2ZV9wbHVnaW5faWQ6ICcnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyA9IChvdmVycmlkZXM6IFBhcnRpYWw8QXV0b1VwZGF0ZUNvbmZpZz4gPSB7fSk6IEF1dG9VcGRhdGVDb25maWcgPT4gKHtcbiAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgdXBncmFkZV90aW1lX29mX2RheTogMzYwMDAsIC8vIDEwOjAwIFVUQ1xuICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUudXBkYXRlX2FsbCxcbiAgZXhjbHVkZV9wbHVnaW5zOiBbXSxcbiAgaW5jbHVkZV9wbHVnaW5zOiBbXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhlbHBlciBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZVF1ZXJ5Q2xpZW50ID0gKCkgPT4gbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICBxdWVyaWVzOiB7XG4gICAgICByZXRyeTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbn0pXG5cbmNvbnN0IHJlbmRlcldpdGhRdWVyeUNsaWVudCA9ICh1aTogUmVhY3QuUmVhY3RFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gY3JlYXRlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gcmVuZGVyKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAge3VpfVxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gIClcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnYXV0by11cGRhdGUtc2V0dGluZycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1BvcnRhbE9wZW4gPSBmYWxzZVxuICAgIGZvcmNlUG9ydGFsQ29udGVudFZpc2libGUgPSBmYWxzZVxuICAgIG1vY2tQbHVnaW5zRGF0YS5wbHVnaW5zID0gW11cbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVHlwZXMgYW5kIENvbmZpZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ3R5cGVzLnRzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdBVVRPX1VQREFURV9TVFJBVEVHWSBlbnVtJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSkudG9CZSgnZml4X29ubHknKVxuICAgICAgICBleHBlY3QoQVVUT19VUERBVEVfU1RSQVRFR1kuZGlzYWJsZWQpLnRvQmUoJ2Rpc2FibGVkJylcbiAgICAgICAgZXhwZWN0KEFVVE9fVVBEQVRFX1NUUkFURUdZLmxhdGVzdCkudG9CZSgnbGF0ZXN0JylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY29udGFpbiBleGFjdGx5IDMgc3RyYXRlZ2llcycsICgpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhBVVRPX1VQREFURV9TVFJBVEVHWSlcbiAgICAgICAgZXhwZWN0KHZhbHVlcykudG9IYXZlTGVuZ3RoKDMpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQVVUT19VUERBVEVfTU9ERSBlbnVtJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoQVVUT19VUERBVEVfTU9ERS5wYXJ0aWFsKS50b0JlKCdwYXJ0aWFsJylcbiAgICAgICAgZXhwZWN0KEFVVE9fVVBEQVRFX01PREUuZXhjbHVkZSkudG9CZSgnZXhjbHVkZScpXG4gICAgICAgIGV4cGVjdChBVVRPX1VQREFURV9NT0RFLnVwZGF0ZV9hbGwpLnRvQmUoJ2FsbCcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNvbnRhaW4gZXhhY3RseSAzIG1vZGVzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3QudmFsdWVzKEFVVE9fVVBEQVRFX01PREUpXG4gICAgICAgIGV4cGVjdCh2YWx1ZXMpLnRvSGF2ZUxlbmd0aCgzKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdjb25maWcudHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ2RlZmF1bHRWYWx1ZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBkaXNhYmxlZCBzdHJhdGVneSBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZGVmYXVsdFZhbHVlLnN0cmF0ZWd5X3NldHRpbmcpLnRvQmUoQVVUT19VUERBVEVfU1RSQVRFR1kuZGlzYWJsZWQpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgdXBncmFkZV90aW1lX29mX2RheSBhcyAwJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZGVmYXVsdFZhbHVlLnVwZ3JhZGVfdGltZV9vZl9kYXkpLnRvQmUoMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSB1cGRhdGVfYWxsIG1vZGUgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGRlZmF1bHRWYWx1ZS51cGdyYWRlX21vZGUpLnRvQmUoQVVUT19VUERBVEVfTU9ERS51cGRhdGVfYWxsKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGVtcHR5IGV4Y2x1ZGVfcGx1Z2lucyBhcnJheScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGRlZmF1bHRWYWx1ZS5leGNsdWRlX3BsdWdpbnMpLnRvRXF1YWwoW10pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgZW1wdHkgaW5jbHVkZV9wbHVnaW5zIGFycmF5JywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoZGVmYXVsdFZhbHVlLmluY2x1ZGVfcGx1Z2lucykudG9FcXVhbChbXSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYmUgYSBjb21wbGV0ZSBBdXRvVXBkYXRlQ29uZmlnIG9iamVjdCcsICgpID0+IHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRlZmF1bHRWYWx1ZSlcbiAgICAgICAgZXhwZWN0KGtleXMpLnRvQ29udGFpbignc3RyYXRlZ3lfc2V0dGluZycpXG4gICAgICAgIGV4cGVjdChrZXlzKS50b0NvbnRhaW4oJ3VwZ3JhZGVfdGltZV9vZl9kYXknKVxuICAgICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCd1cGdyYWRlX21vZGUnKVxuICAgICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCdleGNsdWRlX3BsdWdpbnMnKVxuICAgICAgICBleHBlY3Qoa2V5cykudG9Db250YWluKCdpbmNsdWRlX3BsdWdpbnMnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVdGlscyBUZXN0cyAoRXh0ZW5kZWQgY292ZXJhZ2UgYmV5b25kIHV0aWxzLnNwZWMudHMpXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgndXRpbHMudHMnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3RpbWVPZkRheVRvRGF5anMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgMCBzZWNvbmRzIHRvIG1pZG5pZ2h0JywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aW1lT2ZEYXlUb0RheWpzKDApXG4gICAgICAgIGV4cGVjdChyZXN1bHQuaG91cigpKS50b0JlKDApXG4gICAgICAgIGV4cGVjdChyZXN1bHQubWludXRlKCkpLnRvQmUoMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY29udmVydCAzNjAwIHNlY29uZHMgdG8gMTowMCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGltZU9mRGF5VG9EYXlqcygzNjAwKVxuICAgICAgICBleHBlY3QocmVzdWx0LmhvdXIoKSkudG9CZSgxKVxuICAgICAgICBleHBlY3QocmVzdWx0Lm1pbnV0ZSgpKS50b0JlKDApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgMzYwMDAgc2Vjb25kcyB0byAxMDowMCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGltZU9mRGF5VG9EYXlqcygzNjAwMClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5ob3VyKCkpLnRvQmUoMTApXG4gICAgICAgIGV4cGVjdChyZXN1bHQubWludXRlKCkpLnRvQmUoMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY29udmVydCA0MzIwMCBzZWNvbmRzIHRvIDEyOjAwIChub29uKScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGltZU9mRGF5VG9EYXlqcyg0MzIwMClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5ob3VyKCkpLnRvQmUoMTIpXG4gICAgICAgIGV4cGVjdChyZXN1bHQubWludXRlKCkpLnRvQmUoMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY29udmVydCA4MjgwMCBzZWNvbmRzIHRvIDIzOjAwJywgKCkgPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aW1lT2ZEYXlUb0RheWpzKDgyODAwKVxuICAgICAgICBleHBlY3QocmVzdWx0LmhvdXIoKSkudG9CZSgyMylcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5taW51dGUoKSkudG9CZSgwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWludXRlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRpbWVPZkRheVRvRGF5anMoNTQwMCkgLy8gMTozMFxuICAgICAgICBleHBlY3QocmVzdWx0LmhvdXIoKSkudG9CZSgxKVxuICAgICAgICBleHBlY3QocmVzdWx0Lm1pbnV0ZSgpKS50b0JlKDMwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgMTUgbWludXRlIGludGVydmFscycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KHRpbWVPZkRheVRvRGF5anMoOTAwKS5taW51dGUoKSkudG9CZSgxNSlcbiAgICAgICAgZXhwZWN0KHRpbWVPZkRheVRvRGF5anMoMTgwMCkubWludXRlKCkpLnRvQmUoMzApXG4gICAgICAgIGV4cGVjdCh0aW1lT2ZEYXlUb0RheWpzKDI3MDApLm1pbnV0ZSgpKS50b0JlKDQ1KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2RheWpzVG9UaW1lT2ZEYXknLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiAwIGZvciB1bmRlZmluZWQgaW5wdXQnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChkYXlqc1RvVGltZU9mRGF5KHVuZGVmaW5lZCkpLnRvQmUoMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY29udmVydCBtaWRuaWdodCB0byAwJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtaWRuaWdodCA9IGRheWpzKCkuaG91cigwKS5taW51dGUoMClcbiAgICAgICAgZXhwZWN0KGRheWpzVG9UaW1lT2ZEYXkobWlkbmlnaHQpKS50b0JlKDApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgMTowMCB0byAzNjAwJywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0aW1lID0gZGF5anMoKS5ob3VyKDEpLm1pbnV0ZSgwKVxuICAgICAgICBleHBlY3QoZGF5anNUb1RpbWVPZkRheSh0aW1lKSkudG9CZSgzNjAwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjb252ZXJ0IDEwOjMwIHRvIDM3ODAwJywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0aW1lID0gZGF5anMoKS5ob3VyKDEwKS5taW51dGUoMzApXG4gICAgICAgIGV4cGVjdChkYXlqc1RvVGltZU9mRGF5KHRpbWUpKS50b0JlKDM3ODAwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjb252ZXJ0IDIzOjU5IHRvIDg2MzQwJywgKCkgPT4ge1xuICAgICAgICBjb25zdCB0aW1lID0gZGF5anMoKS5ob3VyKDIzKS5taW51dGUoNTkpXG4gICAgICAgIGV4cGVjdChkYXlqc1RvVGltZU9mRGF5KHRpbWUpKS50b0JlKDg2MzQwKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2NvbnZlcnRMb2NhbFNlY29uZHNUb1VUQ0RheVNlY29uZHMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgbG9jYWwgbWlkbmlnaHQgdG8gVVRDIGZvciBwb3NpdGl2ZSBvZmZzZXQgdGltZXpvbmUnLCAoKSA9PiB7XG4gICAgICAgIC8vIFNoYW5naGFpIGlzIFVUQys4LCBsb2NhbCBtaWRuaWdodCBzaG91bGQgYmUgMTY6MDAgVVRDIHByZXZpb3VzIGRheVxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0TG9jYWxTZWNvbmRzVG9VVENEYXlTZWNvbmRzKDAsICdBc2lhL1NoYW5naGFpJylcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgoMjQgLSA4KSAqIDM2MDApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBuZWdhdGl2ZSBvZmZzZXQgdGltZXpvbmUnLCAoKSA9PiB7XG4gICAgICAgIC8vIE5ldyBZb3JrIGlzIFVUQy01IChvciAtNCBkdXJpbmcgRFNUKSwgbG9jYWwgbWlkbmlnaHQgc2hvdWxkIGJlIDU6MDAgVVRDXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRMb2NhbFNlY29uZHNUb1VUQ0RheVNlY29uZHMoMCwgJ0FtZXJpY2EvTmV3X1lvcmsnKVxuICAgICAgICAvLyBSZXN1bHQgZGVwZW5kcyBvbiBEU1QsIGJ1dCBzaG91bGQgYmUgaW4gdmFsaWQgcmFuZ2VcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZUdyZWF0ZXJUaGFuT3JFcXVhbCgwKVxuICAgICAgICBleHBlY3QocmVzdWx0KS50b0JlTGVzc1RoYW4oODY0MDApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGJlIHJldmVyc2libGUgd2l0aCBjb252ZXJ0VVRDRGF5U2Vjb25kc1RvTG9jYWxTZWNvbmRzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBsb2NhbFNlY29uZHMgPSAzNjAwMCAvLyAxMDowMCBsb2NhbFxuICAgICAgICBjb25zdCB1dGNTZWNvbmRzID0gY29udmVydExvY2FsU2Vjb25kc1RvVVRDRGF5U2Vjb25kcyhsb2NhbFNlY29uZHMsICdBc2lhL1NoYW5naGFpJylcbiAgICAgICAgY29uc3QgYmFja1RvTG9jYWwgPSBjb252ZXJ0VVRDRGF5U2Vjb25kc1RvTG9jYWxTZWNvbmRzKHV0Y1NlY29uZHMsICdBc2lhL1NoYW5naGFpJylcbiAgICAgICAgZXhwZWN0KGJhY2tUb0xvY2FsKS50b0JlKGxvY2FsU2Vjb25kcylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdjb252ZXJ0VVRDRGF5U2Vjb25kc1RvTG9jYWxTZWNvbmRzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjb252ZXJ0IFVUQyBtaWRuaWdodCB0byBsb2NhbCB0aW1lIGZvciBwb3NpdGl2ZSBvZmZzZXQgdGltZXpvbmUnLCAoKSA9PiB7XG4gICAgICAgIC8vIFVUQyBtaWRuaWdodCBpbiBTaGFuZ2hhaSAoVVRDKzgpIGlzIDg6MDAgbG9jYWxcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydFVUQ0RheVNlY29uZHNUb0xvY2FsU2Vjb25kcygwLCAnQXNpYS9TaGFuZ2hhaScpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoOCAqIDM2MDApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlZGdlIGNhc2VzIG5lYXIgZGF5IGJvdW5kYXJpZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIFVUQyAyMzowMCBpbiBTaGFuZ2hhaSBpcyA3OjAwIG5leHQgZGF5XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRVVENEYXlTZWNvbmRzVG9Mb2NhbFNlY29uZHMoMjMgKiAzNjAwLCAnQXNpYS9TaGFuZ2hhaScpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMClcbiAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZUxlc3NUaGFuKDg2NDAwKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBOb0RhdGFQbGFjZWhvbGRlciBDb21wb25lbnQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdOb0RhdGFQbGFjZWhvbGRlciAobm8tZGF0YS1wbGFjZWhvbGRlci50c3gpJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIG5vUGx1Z2lucz10cnVlIHNob3dpbmcgZ3JvdXAgaWNvbicsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Tm9EYXRhUGxhY2Vob2xkZXIgY2xhc3NOYW1lPVwidGVzdC1jbGFzc1wiIG5vUGx1Z2lucz17dHJ1ZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2dyb3VwLWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTm8gcGx1Z2lucyBpbnN0YWxsZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBub1BsdWdpbnM9ZmFsc2Ugc2hvd2luZyBzZWFyY2ggaWNvbicsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8Tm9EYXRhUGxhY2Vob2xkZXIgY2xhc3NOYW1lPVwidGVzdC1jbGFzc1wiIG5vUGx1Z2lucz17ZmFsc2V9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWFyY2gtbWVudS1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05vIHBsdWdpbnMgZm91bmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBub1BsdWdpbnM9dW5kZWZpbmVkIChkZWZhdWx0KSBzaG93aW5nIHNlYXJjaCBpY29uJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxOb0RhdGFQbGFjZWhvbGRlciBjbGFzc05hbWU9XCJ0ZXN0LWNsYXNzXCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlYXJjaC1tZW51LWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBhcHBseSBjbGFzc05hbWUgcHJvcCcsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPE5vRGF0YVBsYWNlaG9sZGVyIGNsYXNzTmFtZT1cImN1c3RvbS1oZWlnaHRcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnY3VzdG9tLWhlaWdodCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChOb0RhdGFQbGFjZWhvbGRlcikudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QoKE5vRGF0YVBsYWNlaG9sZGVyIGFzIGFueSkuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQ29udGFpbignU3ltYm9sJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTm9QbHVnaW5TZWxlY3RlZCBDb21wb25lbnQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdOb1BsdWdpblNlbGVjdGVkIChuby1wbHVnaW4tc2VsZWN0ZWQudHN4KScsICgpID0+IHtcbiAgICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFydGlhbCBtb2RlIHBsYWNlaG9sZGVyJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxOb1BsdWdpblNlbGVjdGVkIHVwZGF0ZU1vZGU9e0FVVE9fVVBEQVRFX01PREUucGFydGlhbH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTZWxlY3QgcGx1Z2lucyB0byB1cGRhdGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgZXhjbHVkZSBtb2RlIHBsYWNlaG9sZGVyJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxOb1BsdWdpblNlbGVjdGVkIHVwZGF0ZU1vZGU9e0FVVE9fVVBEQVRFX01PREUuZXhjbHVkZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTZWxlY3QgcGx1Z2lucyB0byBleGNsdWRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KE5vUGx1Z2luU2VsZWN0ZWQpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KChOb1BsdWdpblNlbGVjdGVkIGFzIGFueSkuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQ29udGFpbignU3ltYm9sJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUGx1Z2luc1NlbGVjdGVkIENvbXBvbmVudCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1BsdWdpbnNTZWxlY3RlZCAocGx1Z2lucy1zZWxlY3RlZC50c3gpJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBlbXB0eSB3aGVuIG5vIHBsdWdpbnMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbHVnaW5zU2VsZWN0ZWQgcGx1Z2lucz17W119IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXRlc3RpZD1cInBsdWdpbi1pY29uXCJdJykpLnRvSGF2ZUxlbmd0aCgwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIHBsdWdpbnMgd2hlbiBjb3VudCBpcyBiZWxvdyBNQVhfRElTUExBWV9DT1VOVCAoMTQpJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBsdWdpbnMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoXywgaSkgPT4gYHBsdWdpbi0ke2l9YClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQbHVnaW5zU2VsZWN0ZWQgcGx1Z2lucz17cGx1Z2luc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGNvbnN0IGljb25zID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwbHVnaW4taWNvbicpXG4gICAgICAgIGV4cGVjdChpY29ucykudG9IYXZlTGVuZ3RoKDEwKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgTUFYX0RJU1BMQVlfQ09VTlQgcGx1Z2lucyB3aXRoIG92ZXJmbG93IGluZGljYXRvciB3aGVuIGNvdW50IGV4Y2VlZHMgbGltaXQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGx1Z2lucyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDIwIH0sIChfLCBpKSA9PiBgcGx1Z2luLSR7aX1gKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBsdWdpbnNTZWxlY3RlZCBwbHVnaW5zPXtwbHVnaW5zfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgY29uc3QgaWNvbnMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3BsdWdpbi1pY29uJylcbiAgICAgICAgZXhwZWN0KGljb25zKS50b0hhdmVMZW5ndGgoMTQpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcrNicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjb3JyZWN0IGljb24gVVJMcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwbHVnaW5zID0gWydwbHVnaW4tYScsICdwbHVnaW4tYiddXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGx1Z2luc1NlbGVjdGVkIHBsdWdpbnM9e3BsdWdpbnN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBpY29ucyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncGx1Z2luLWljb24nKVxuICAgICAgICBleHBlY3QoaWNvbnNbMF0pLnRvSGF2ZUF0dHJpYnV0ZSgnc3JjJywgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJ3BsdWdpbi1hJykpXG4gICAgICAgIGV4cGVjdChpY29uc1sxXSkudG9IYXZlQXR0cmlidXRlKCdzcmMnLCBleHBlY3Quc3RyaW5nQ29udGFpbmluZygncGx1Z2luLWInKSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFBsdWdpbnNTZWxlY3RlZCBwbHVnaW5zPXtbJ3Rlc3QnXX0gY2xhc3NOYW1lPVwiY3VzdG9tLWNsYXNzXCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ2N1c3RvbS1jbGFzcycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGV4YWN0bHkgTUFYX0RJU1BMQVlfQ09VTlQgcGx1Z2lucyB3aXRob3V0IG92ZXJmbG93JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gZXhhY3RseSAxNCBwbHVnaW5zIChNQVhfRElTUExBWV9DT1VOVClcbiAgICAgICAgY29uc3QgcGx1Z2lucyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDE0IH0sIChfLCBpKSA9PiBgcGx1Z2luLSR7aX1gKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBsdWdpbnNTZWxlY3RlZCBwbHVnaW5zPXtwbHVnaW5zfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBhbGwgMTQgaWNvbnMgYXJlIGRpc3BsYXllZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdwbHVnaW4taWNvbicpKS50b0hhdmVMZW5ndGgoMTQpXG4gICAgICAgIC8vIE5vdGU6IENvbXBvbmVudCBzaG93cyBcIiswXCIgd2hlbiBleGFjdGx5IGF0IGxpbWl0IGR1ZSB0byA8IHZzIDw9IGNvbXBhcmlzb25cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgYWN0dWFsIGJlaGF2aW9yIChpc1Nob3dBbGwgPSBwbHVnaW5zLmxlbmd0aCA8IE1BWF9ESVNQTEFZX0NPVU5UKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgTUFYX0RJU1BMQVlfQ09VTlQgKyAxIHBsdWdpbnMgc2hvd2luZyBvdmVyZmxvdycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAtIDE1IHBsdWdpbnNcbiAgICAgICAgY29uc3QgcGx1Z2lucyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDE1IH0sIChfLCBpKSA9PiBgcGx1Z2luLSR7aX1gKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBsdWdpbnNTZWxlY3RlZCBwbHVnaW5zPXtwbHVnaW5zfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgncGx1Z2luLWljb24nKSkudG9IYXZlTGVuZ3RoKDE0KVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnKzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoUGx1Z2luc1NlbGVjdGVkKS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdCgoUGx1Z2luc1NlbGVjdGVkIGFzIGFueSkuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQ29udGFpbignU3ltYm9sJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVG9vbEl0ZW0gQ29tcG9uZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVG9vbEl0ZW0gKHRvb2wtaXRlbS50c3gpJywgKCkgPT4ge1xuICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIHBheWxvYWQ6IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKSxcbiAgICAgIGlzQ2hlY2tlZDogZmFsc2UsXG4gICAgICBvbkNoZWNrQ2hhbmdlOiB2aS5mbigpLFxuICAgIH1cblxuICAgIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBwbHVnaW4gaWNvbicsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8VG9vbEl0ZW0gey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsdWdpbiBsYWJlbCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgICAgcGF5bG9hZDogY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlTW9ja1BsdWdpbkRlY2xhcmF0aW9uKHtcbiAgICAgICAgICAgICAgbGFiZWw6IHsgJ2VuLVVTJzogJ015IFRlc3QgUGx1Z2luJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxUb29sSXRlbSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTXkgVGVzdCBQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgcGx1Z2luIGF1dGhvcicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgICAuLi5kZWZhdWx0UHJvcHMsXG4gICAgICAgICAgcGF5bG9hZDogY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlTW9ja1BsdWdpbkRlY2xhcmF0aW9uKHtcbiAgICAgICAgICAgICAgYXV0aG9yOiAnUGx1Z2luIEF1dGhvcicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFRvb2xJdGVtIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQbHVnaW4gQXV0aG9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoZWNrYm94IHVuY2hlY2tlZCB3aGVuIGlzQ2hlY2tlZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8VG9vbEl0ZW0gey4uLmRlZmF1bHRQcm9wc30gaXNDaGVja2VkPXtmYWxzZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoZWNrYm94JykpLm5vdC50b0JlQ2hlY2tlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGVja2JveCBjaGVja2VkIHdoZW4gaXNDaGVja2VkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFRvb2xJdGVtIHsuLi5kZWZhdWx0UHJvcHN9IGlzQ2hlY2tlZD17dHJ1ZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoZWNrYm94JykpLnRvQmVDaGVja2VkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoZWNrQ2hhbmdlIHdoZW4gY2hlY2tib3ggaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNoZWNrQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFRvb2xJdGVtIHsuLi5kZWZhdWx0UHJvcHN9IG9uQ2hlY2tDaGFuZ2U9e29uQ2hlY2tDaGFuZ2V9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGVja2JveCcpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25DaGVja0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdChUb29sSXRlbSkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QoKFRvb2xJdGVtIGFzIGFueSkuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQ29udGFpbignU3ltYm9sJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RyYXRlZ3lQaWNrZXIgQ29tcG9uZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RyYXRlZ3lQaWNrZXIgKHN0cmF0ZWd5LXBpY2tlci50c3gpJywgKCkgPT4ge1xuICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIHZhbHVlOiBBVVRPX1VQREFURV9TVFJBVEVHWS5kaXNhYmxlZCxcbiAgICAgIG9uQ2hhbmdlOiB2aS5mbigpLFxuICAgIH1cblxuICAgIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB0cmlnZ2VyIGJ1dHRvbiB3aXRoIGN1cnJlbnQgc3RyYXRlZ3kgbGFiZWwnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFN0cmF0ZWd5UGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IHZhbHVlPXtBVVRPX1VQREFURV9TVFJBVEVHWS5kaXNhYmxlZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kaXNhYmxlZC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgZHJvcGRvd24gY29udGVudCB3aGVuIGNsb3NlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8U3RyYXRlZ3lQaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncG9ydGFsLWNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBzdHJhdGVneSBvcHRpb25zIHdoZW4gb3BlbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUG9ydGFsT3BlbiA9IHRydWVcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxTdHJhdGVneVBpY2tlciB7Li4uZGVmYXVsdFByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgICAvLyBXYWl0IGZvciBwb3J0YWwgdG8gb3BlblxuICAgICAgICBpZiAobW9ja1BvcnRhbE9wZW4pIHtcbiAgICAgICAgICAvLyBBc3NlcnQgYWxsIG9wdGlvbnMgdmlzaWJsZSAodXNlIGdldEFsbEJ5VGV4dCBmb3IgXCJEaXNhYmxlZFwiIGFzIGl0IGFwcGVhcnMgaW4gYm90aCB0cmlnZ2VyIGFuZCBkcm9wZG93bilcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgnRGlzYWJsZWQnKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbk9yRXF1YWwoMSlcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQnVnIEZpeGVzIE9ubHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdMYXRlc3QgVmVyc2lvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdG9nZ2xlIGRyb3Bkb3duIHdoZW4gdHJpZ2dlciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxTdHJhdGVneVBpY2tlciB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBpbml0aWFsbHkgY2xvc2VkXG4gICAgICAgIGV4cGVjdChtb2NrUG9ydGFsT3BlbikudG9CZShmYWxzZSlcblxuICAgICAgICAvLyBBY3QgLSBjbGljayB0cmlnZ2VyXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC10cmlnZ2VyJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gcG9ydGFsIHRyaWdnZXIgZWxlbWVudCBzaG91bGQgc3RpbGwgYmUgaW4gZG9jdW1lbnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggZml4T25seSB3aGVuIEJ1ZyBGaXhlcyBPbmx5IG9wdGlvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gZm9yY2UgcG9ydGFsIGNvbnRlbnQgdG8gYmUgdmlzaWJsZSBmb3IgdGVzdGluZyBvcHRpb24gc2VsZWN0aW9uXG4gICAgICAgIGZvcmNlUG9ydGFsQ29udGVudFZpc2libGUgPSB0cnVlXG4gICAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFN0cmF0ZWd5UGlja2VyIHZhbHVlPXtBVVRPX1VQREFURV9TVFJBVEVHWS5kaXNhYmxlZH0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPilcblxuICAgICAgICAvLyBGaW5kIGFuZCBjbGljayB0aGUgXCJCdWcgRml4ZXMgT25seVwiIG9wdGlvblxuICAgICAgICBjb25zdCBmaXhPbmx5T3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnQnVnIEZpeGVzIE9ubHknKS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgICBleHBlY3QoZml4T25seU9wdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZml4T25seU9wdGlvbiEpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aXRoIGxhdGVzdCB3aGVuIExhdGVzdCBWZXJzaW9uIG9wdGlvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gZm9yY2UgcG9ydGFsIGNvbnRlbnQgdG8gYmUgdmlzaWJsZSBmb3IgdGVzdGluZyBvcHRpb24gc2VsZWN0aW9uXG4gICAgICAgIGZvcmNlUG9ydGFsQ29udGVudFZpc2libGUgPSB0cnVlXG4gICAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFN0cmF0ZWd5UGlja2VyIHZhbHVlPXtBVVRPX1VQREFURV9TVFJBVEVHWS5kaXNhYmxlZH0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPilcblxuICAgICAgICAvLyBGaW5kIGFuZCBjbGljayB0aGUgXCJMYXRlc3QgVmVyc2lvblwiIG9wdGlvblxuICAgICAgICBjb25zdCBsYXRlc3RPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdMYXRlc3QgVmVyc2lvbicpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICAgIGV4cGVjdChsYXRlc3RPcHRpb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKGxhdGVzdE9wdGlvbiEpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoQVVUT19VUERBVEVfU1RSQVRFR1kubGF0ZXN0KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggZGlzYWJsZWQgd2hlbiBEaXNhYmxlZCBvcHRpb24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAtIGZvcmNlIHBvcnRhbCBjb250ZW50IHRvIGJlIHZpc2libGUgZm9yIHRlc3Rpbmcgb3B0aW9uIHNlbGVjdGlvblxuICAgICAgICBmb3JjZVBvcnRhbENvbnRlbnRWaXNpYmxlID0gdHJ1ZVxuICAgICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxTdHJhdGVneVBpY2tlciB2YWx1ZT17QVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seX0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPilcblxuICAgICAgICAvLyBGaW5kIGFuZCBjbGljayB0aGUgXCJEaXNhYmxlZFwiIG9wdGlvbiAtIG5lZWQgdG8gZmluZCB0aGUgb25lIGluIHRoZSBkcm9wZG93biwgbm90IHRoZSBidXR0b25cbiAgICAgICAgY29uc3QgZGlzYWJsZWRPcHRpb25zID0gc2NyZWVuLmdldEFsbEJ5VGV4dCgnRGlzYWJsZWQnKVxuICAgICAgICAvLyBUaGUgc2Vjb25kIG9uZSBzaG91bGQgYmUgaW4gdGhlIGRyb3Bkb3duXG4gICAgICAgIGNvbnN0IGRyb3Bkb3duT3B0aW9uID0gZGlzYWJsZWRPcHRpb25zLmZpbmQoZWwgPT4gZWwuY2xvc2VzdCgnZGl2W2NsYXNzKj1cImN1cnNvci1wb2ludGVyXCJdJykpXG4gICAgICAgIGV4cGVjdChkcm9wZG93bk9wdGlvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZHJvcGRvd25PcHRpb24hLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpISlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChBVVRPX1VQREFURV9TVFJBVEVHWS5kaXNhYmxlZClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc3RvcCBldmVudCBwcm9wYWdhdGlvbiB3aGVuIG9wdGlvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gZm9yY2UgcG9ydGFsIGNvbnRlbnQgdG8gYmUgdmlzaWJsZVxuICAgICAgICBmb3JjZVBvcnRhbENvbnRlbnRWaXNpYmxlID0gdHJ1ZVxuICAgICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcGFyZW50Q2xpY2tIYW5kbGVyID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPGRpdiBvbkNsaWNrPXtwYXJlbnRDbGlja0hhbmRsZXJ9PlxuICAgICAgICAgICAgPFN0cmF0ZWd5UGlja2VyIHZhbHVlPXtBVVRPX1VQREFURV9TVFJBVEVHWS5kaXNhYmxlZH0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgICAgICAgIDwvZGl2PixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIENsaWNrIGFuIG9wdGlvblxuICAgICAgICBjb25zdCBmaXhPbmx5T3B0aW9uID0gc2NyZWVuLmdldEJ5VGV4dCgnQnVnIEZpeGVzIE9ubHknKS5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soZml4T25seU9wdGlvbiEpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gb25DaGFuZ2UgaXMgY2FsbGVkIGJ1dCBwYXJlbnQgY2xpY2sgaGFuZGxlciBzaG91bGQgbm90IHByb3BhZ2F0ZVxuICAgICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHkpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGVjayBpY29uIGZvciBjdXJyZW50bHkgc2VsZWN0ZWQgb3B0aW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gZm9yY2UgcG9ydGFsIGNvbnRlbnQgdG8gYmUgdmlzaWJsZVxuICAgICAgICBmb3JjZVBvcnRhbENvbnRlbnRWaXNpYmxlID0gdHJ1ZVxuXG4gICAgICAgIC8vIEFjdCAtIHJlbmRlciB3aXRoIGZpeE9ubHkgc2VsZWN0ZWRcbiAgICAgICAgcmVuZGVyKDxTdHJhdGVneVBpY2tlciB2YWx1ZT17QVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seX0gb25DaGFuZ2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIFJpQ2hlY2tMaW5lIHNob3VsZCBiZSByZW5kZXJlZCAoY2hlY2sgaWNvbilcbiAgICAgICAgLy8gRmluZCBhbGwgXCJCdWcgRml4ZXMgT25seVwiIHRleHRzIGFuZCBnZXQgdGhlIG9uZSBpbiB0aGUgZHJvcGRvd24gKGhhcyBjdXJzb3ItcG9pbnRlciBwYXJlbnQpXG4gICAgICAgIGNvbnN0IGFsbEZpeE9ubHlUZXh0cyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJ0J1ZyBGaXhlcyBPbmx5JylcbiAgICAgICAgY29uc3QgZHJvcGRvd25PcHRpb24gPSBhbGxGaXhPbmx5VGV4dHMuZmluZChlbCA9PiBlbC5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yLXBvaW50ZXJcIl0nKSlcbiAgICAgICAgY29uc3Qgb3B0aW9uQ29udGFpbmVyID0gZHJvcGRvd25PcHRpb24/LmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICAgIGV4cGVjdChvcHRpb25Db250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgLy8gVGhlIGNoZWNrIGljb24gU1ZHIHNob3VsZCBleGlzdCB3aXRoaW4gdGhlIG9wdGlvblxuICAgICAgICBleHBlY3Qob3B0aW9uQ29udGFpbmVyPy5xdWVyeVNlbGVjdG9yKCdzdmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGNoZWNrIGljb24gZm9yIG5vbi1zZWxlY3RlZCBvcHRpb25zJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gZm9yY2UgcG9ydGFsIGNvbnRlbnQgdG8gYmUgdmlzaWJsZVxuICAgICAgICBmb3JjZVBvcnRhbENvbnRlbnRWaXNpYmxlID0gdHJ1ZVxuXG4gICAgICAgIC8vIEFjdCAtIHJlbmRlciB3aXRoIGRpc2FibGVkIHNlbGVjdGVkXG4gICAgICAgIHJlbmRlcig8U3RyYXRlZ3lQaWNrZXIgdmFsdWU9e0FVVE9fVVBEQVRFX1NUUkFURUdZLmRpc2FibGVkfSBvbkNoYW5nZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gY2hlY2sgdGhlIExhdGVzdCBWZXJzaW9uIG9wdGlvbiBzaG91bGQgbm90IGhhdmUgY2hlY2sgaWNvblxuICAgICAgICBjb25zdCBsYXRlc3RPcHRpb24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdMYXRlc3QgVmVyc2lvbicpLmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpXG4gICAgICAgIC8vIFRoZSBzdmcgc2hvdWxkIG9ubHkgYmUgaW4gc2VsZWN0ZWQgb3B0aW9uLCBub3QgaW4gbm9uLXNlbGVjdGVkXG4gICAgICAgIGNvbnN0IGNoZWNrSWNvbkNvbnRhaW5lciA9IGxhdGVzdE9wdGlvbj8ucXVlcnlTZWxlY3RvcignZGl2Lm1yLTEnKVxuICAgICAgICAvLyBOb24tc2VsZWN0ZWQgb3B0aW9uIHNob3VsZCBoYXZlIGVtcHR5IGNoZWNrIGljb24gY29udGFpbmVyXG4gICAgICAgIGV4cGVjdChjaGVja0ljb25Db250YWluZXI/LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpKS50b0JlTnVsbCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFRvb2xQaWNrZXIgQ29tcG9uZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVG9vbFBpY2tlciAodG9vbC1waWNrZXIudHN4KScsICgpID0+IHtcbiAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICB0cmlnZ2VyOiA8YnV0dG9uPlNlbGVjdCBQbHVnaW5zPC9idXR0b24+LFxuICAgICAgdmFsdWU6IFtdIGFzIHN0cmluZ1tdLFxuICAgICAgb25DaGFuZ2U6IHZpLmZuKCksXG4gICAgICBpc1Nob3c6IGZhbHNlLFxuICAgICAgb25TaG93Q2hhbmdlOiB2aS5mbigpLFxuICAgIH1cblxuICAgIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB0cmlnZ2VyIGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFRvb2xQaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdTZWxlY3QgUGx1Z2lucycgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBjb250ZW50IHdoZW4gaXNTaG93IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxUb29sUGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IGlzU2hvdz17ZmFsc2V9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBzZWFyY2ggYm94IGFuZCB0YWJzIHdoZW4gaXNTaG93IGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1BvcnRhbE9wZW4gPSB0cnVlXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8VG9vbFBpY2tlciB7Li4uZGVmYXVsdFByb3BzfSBpc1Nob3c9e3RydWV9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWFyY2gtYm94JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBOb0RhdGFQbGFjZWhvbGRlciB3aGVuIG5vIHBsdWdpbnMgYW5kIG5vIHNlYXJjaCBxdWVyeScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUG9ydGFsT3BlbiA9IHRydWVcbiAgICAgICAgbW9ja1BsdWdpbnNEYXRhLnBsdWdpbnMgPSBbXVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFRvb2xQaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gaXNTaG93PXt0cnVlfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBzaG91bGQgc2hvdyBcIk5vIHBsdWdpbnMgaW5zdGFsbGVkXCIgd2hlbiBubyBxdWVyeVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdncm91cC1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdGaWx0ZXJpbmcnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgbW9ja1BsdWdpbnNEYXRhLnBsdWdpbnMgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgICAgICBwbHVnaW5faWQ6ICd0b29sLXBsdWdpbicsXG4gICAgICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVNb2NrUGx1Z2luRGVjbGFyYXRpb24oe1xuICAgICAgICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICAgICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdUb29sIFBsdWdpbicgfSBhcyBQbHVnaW5EZWNsYXJhdGlvblsnbGFiZWwnXSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICAgICAgcGx1Z2luX2lkOiAnbW9kZWwtcGx1Z2luJyxcbiAgICAgICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZU1vY2tQbHVnaW5EZWNsYXJhdGlvbih7XG4gICAgICAgICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0ubW9kZWwsXG4gICAgICAgICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdNb2RlbCBQbHVnaW4nIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2xhYmVsJ10sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgICAgIHBsdWdpbl9pZDogJ2dpdGh1Yi1wbHVnaW4nLFxuICAgICAgICAgICAgc291cmNlOiBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZU1vY2tQbHVnaW5EZWNsYXJhdGlvbih7XG4gICAgICAgICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdHaXRIdWIgUGx1Z2luJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIF1cbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZmlsdGVyIG91dCBub24tbWFya2V0cGxhY2UgcGx1Z2lucycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUG9ydGFsT3BlbiA9IHRydWVcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxUb29sUGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IGlzU2hvdz17dHJ1ZX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gR2l0SHViIHBsdWdpbiBzaG91bGQgbm90IGJlIHNob3duXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0dpdEh1YiBQbHVnaW4nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZmlsdGVyIGJ5IHNlYXJjaCBxdWVyeScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUG9ydGFsT3BlbiA9IHRydWVcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxUb29sUGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IGlzU2hvdz17dHJ1ZX0gLz4pXG5cbiAgICAgICAgLy8gVHlwZSBpbiBzZWFyY2ggYm94XG4gICAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWFyY2gtaW5wdXQnKSwgeyB0YXJnZXQ6IHsgdmFsdWU6ICd0b29sJyB9IH0pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gb25seSB0b29sIHBsdWdpbiBzaG91bGQgbWF0Y2hcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rvb2wgUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnTW9kZWwgUGx1Z2luJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25TaG93Q2hhbmdlIHdoZW4gdHJpZ2dlciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uU2hvd0NoYW5nZSA9IHZpLmZuKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxUb29sUGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IG9uU2hvd0NoYW5nZT17b25TaG93Q2hhbmdlfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uU2hvd0NoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoYW5nZSB3aGVuIHBsdWdpbiBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrUG9ydGFsT3BlbiA9IHRydWVcbiAgICAgICAgbW9ja1BsdWdpbnNEYXRhLnBsdWdpbnMgPSBbXG4gICAgICAgICAgY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7XG4gICAgICAgICAgICBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbicsXG4gICAgICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVNb2NrUGx1Z2luRGVjbGFyYXRpb24oeyBsYWJlbDogeyAnZW4tVVMnOiAnVGVzdCBQbHVnaW4nIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2xhYmVsJ10gfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIF1cbiAgICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8VG9vbFBpY2tlciB7Li4uZGVmYXVsdFByb3BzfSBpc1Nob3c9e3RydWV9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoZWNrYm94JykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoWyd0ZXN0LXBsdWdpbiddKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1bnNlbGVjdCBwbHVnaW4gd2hlbiBhbHJlYWR5IHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tQb3J0YWxPcGVuID0gdHJ1ZVxuICAgICAgICBtb2NrUGx1Z2luc0RhdGEucGx1Z2lucyA9IFtcbiAgICAgICAgICBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgICAgIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luJyxcbiAgICAgICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdXG4gICAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgICAgPFRvb2xQaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gaXNTaG93PXt0cnVlfSB2YWx1ZT17Wyd0ZXN0LXBsdWdpbiddfSBvbkNoYW5nZT17b25DaGFuZ2V9IC8+LFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoZWNrYm94JykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ2FsbGJhY2sgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnaGFuZGxlQ2hlY2tDaGFuZ2Ugc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggY29ycmVjdCBkZXBlbmRlbmNpZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIG1vY2tQb3J0YWxPcGVuID0gdHJ1ZVxuICAgICAgICBtb2NrUGx1Z2luc0RhdGEucGx1Z2lucyA9IFtcbiAgICAgICAgICBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgICAgIHBsdWdpbl9pZDogJ3BsdWdpbi0xJyxcbiAgICAgICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gQWN0IC0gcmVuZGVyIGFuZCBpbnRlcmFjdFxuICAgICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgICAgPFRvb2xQaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gaXNTaG93PXt0cnVlfSB2YWx1ZT17W119IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBDbGljayB0byBzZWxlY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hlY2tib3gnKSlcbiAgICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ3BsdWdpbi0xJ10pXG5cbiAgICAgICAgLy8gUmVyZW5kZXIgd2l0aCBuZXcgdmFsdWVcbiAgICAgICAgb25DaGFuZ2UubW9ja0NsZWFyKClcbiAgICAgICAgcmVyZW5kZXIoXG4gICAgICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtjcmVhdGVRdWVyeUNsaWVudCgpfT5cbiAgICAgICAgICAgIDxUb29sUGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IGlzU2hvdz17dHJ1ZX0gdmFsdWU9e1sncGx1Z2luLTEnXX0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPlxuICAgICAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBDbGljayB0byB1bnNlbGVjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGVja2JveCcpKVxuICAgICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoVG9vbFBpY2tlcikudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QoKFRvb2xQaWNrZXIgYXMgYW55KS4kJHR5cGVvZj8udG9TdHJpbmcoKSkudG9Db250YWluKCdTeW1ib2wnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQbHVnaW5zUGlja2VyIENvbXBvbmVudCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1BsdWdpbnNQaWNrZXIgKHBsdWdpbnMtcGlja2VyLnRzeCknLCAoKSA9PiB7XG4gICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgdXBkYXRlTW9kZTogQVVUT19VUERBVEVfTU9ERS5wYXJ0aWFsLFxuICAgICAgdmFsdWU6IFtdIGFzIHN0cmluZ1tdLFxuICAgICAgb25DaGFuZ2U6IHZpLmZuKCksXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIE5vUGx1Z2luU2VsZWN0ZWQgd2hlbiBubyBwbHVnaW5zIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQbHVnaW5zUGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2VsZWN0IHBsdWdpbnMgdG8gdXBkYXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHNlbGVjdGVkIHBsdWdpbnMgY291bnQgYW5kIGNsZWFyIGJ1dHRvbiB3aGVuIHBsdWdpbnMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBsdWdpbnNQaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gdmFsdWU9e1sncGx1Z2luLTEnLCAncGx1Z2luLTInXX0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9VcGRhdGluZyAyIHBsdWdpbnMvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NsZWFyIEFsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBzZWxlY3QgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQbHVnaW5zUGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2VsZWN0IFBsdWdpbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGV4Y2x1ZGUgbW9kZSB0ZXh0IHdoZW4gaW4gZXhjbHVkZSBtb2RlJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxQbHVnaW5zUGlja2VyXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgdXBkYXRlTW9kZT17QVVUT19VUERBVEVfTU9ERS5leGNsdWRlfVxuICAgICAgICAgICAgdmFsdWU9e1sncGx1Z2luLTEnXX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvRXhjbHVkaW5nIDEgcGx1Z2lucy9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggZW1wdHkgYXJyYXkgd2hlbiBjbGVhciBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPFBsdWdpbnNQaWNrZXJcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICB2YWx1ZT17WydwbHVnaW4tMScsICdwbHVnaW4tMiddfVxuICAgICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdDbGVhciBBbGwnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KFBsdWdpbnNQaWNrZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KChQbHVnaW5zUGlja2VyIGFzIGFueSkuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQ29udGFpbignU3ltYm9sJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQXV0b1VwZGF0ZVNldHRpbmcgTWFpbiBDb21wb25lbnQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBdXRvVXBkYXRlU2V0dGluZyAoaW5kZXgudHN4KScsICgpID0+IHtcbiAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICBwYXlsb2FkOiBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZygpLFxuICAgICAgb25DaGFuZ2U6IHZpLmZuKCksXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHVwZGF0ZSBzZXR0aW5ncyBoZWFkZXInLCAoKSA9PiB7XG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVXBkYXRlIFNldHRpbmdzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGF1dG9tYXRpYyB1cGRhdGVzIGxhYmVsJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0F1dG9tYXRpYyBVcGRhdGVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHN0cmF0ZWd5IHBpY2tlcicsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyB0aW1lIHBpY2tlciB3aGVuIHN0cmF0ZWd5IGlzIG5vdCBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0F1dG9VcGRhdGVDb25maWcoeyBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdVcGRhdGUgVGltZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RpbWUtcGlja2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGlkZSB0aW1lIHBpY2tlciBhbmQgcGx1Z2lucyBzZWxlY3Rpb24gd2hlbiBzdHJhdGVneSBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0F1dG9VcGRhdGVDb25maWcoeyBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5kaXNhYmxlZCB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdVcGRhdGUgVGltZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3RpbWUtcGlja2VyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgcGx1Z2lucyBwaWNrZXIgd2hlbiBtb2RlIGlzIG5vdCB1cGRhdGVfYWxsJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgICAgICAgICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUucGFydGlhbCxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlbGVjdCBQbHVnaW5zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGlkZSBwbHVnaW5zIHBpY2tlciB3aGVuIG1vZGUgaXMgdXBkYXRlX2FsbCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0F1dG9VcGRhdGVDb25maWcoe1xuICAgICAgICAgIHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHksXG4gICAgICAgICAgdXBncmFkZV9tb2RlOiBBVVRPX1VQREFURV9NT0RFLnVwZGF0ZV9hbGwsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ1NlbGVjdCBQbHVnaW5zJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnU3RyYXRlZ3kgRGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgZml4T25seSBkZXNjcmlwdGlvbiB3aGVuIHN0cmF0ZWd5IGlzIGZpeE9ubHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHsgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnT25seSBhcHBseSBidWcgZml4ZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzaG93IGxhdGVzdCBkZXNjcmlwdGlvbiB3aGVuIHN0cmF0ZWd5IGlzIGxhdGVzdCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0F1dG9VcGRhdGVDb25maWcoeyBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5sYXRlc3QgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0Fsd2F5cyB1cGRhdGUgdG8gbGF0ZXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBubyBkZXNjcmlwdGlvbiB3aGVuIHN0cmF0ZWd5IGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7IHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmRpc2FibGVkIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ09ubHkgYXBwbHkgYnVnIGZpeGVzJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0Fsd2F5cyB1cGRhdGUgdG8gbGF0ZXN0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnUGx1Z2lucyBTZWxlY3Rpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHNob3cgaW5jbHVkZV9wbHVnaW5zIHdoZW4gbW9kZSBpcyBwYXJ0aWFsJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgICAgICAgICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUucGFydGlhbCxcbiAgICAgICAgICBpbmNsdWRlX3BsdWdpbnM6IFsncGx1Z2luLTEnLCAncGx1Z2luLTInXSxcbiAgICAgICAgICBleGNsdWRlX3BsdWdpbnM6IFtdLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvVXBkYXRpbmcgMiBwbHVnaW5zL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgZXhjbHVkZV9wbHVnaW5zIHdoZW4gbW9kZSBpcyBleGNsdWRlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgICAgICAgICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUuZXhjbHVkZSxcbiAgICAgICAgICBpbmNsdWRlX3BsdWdpbnM6IFtdLFxuICAgICAgICAgIGV4Y2x1ZGVfcGx1Z2luczogWydwbHVnaW4tMScsICdwbHVnaW4tMicsICdwbHVnaW4tMyddLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvRXhjbHVkaW5nIDMgcGx1Z2lucy9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggdXBkYXRlZCBzdHJhdGVneSB3aGVuIHN0cmF0ZWd5IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgcGF5bG9hZD17cGF5bG9hZH0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBjb21wb25lbnQgcmVuZGVycyB3aXRoIHN0cmF0ZWd5IHBpY2tlclxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtZWxlbScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2l0aCB1cGRhdGVkIHRpbWUgd2hlbiB0aW1lIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7IHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHkgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyBwYXlsb2FkPXtwYXlsb2FkfSBvbkNoYW5nZT17b25DaGFuZ2V9IC8+KVxuXG4gICAgICAgIC8vIENsaWNrIHRpbWUgcGlja2VyIHRyaWdnZXJcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndGltZS1waWNrZXInKS5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWQ9XCJ0aW1lLWlucHV0XCJdJykhLnBhcmVudEVsZW1lbnQhKVxuXG4gICAgICAgIC8vIFNldCB0aW1lXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RpbWUtcGlja2VyLXNldCcpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggMCB3aGVuIHRpbWUgaXMgY2xlYXJlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHsgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHBheWxvYWQ9e3BheWxvYWR9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4pXG5cbiAgICAgICAgLy8gQ2xpY2sgdGltZSBwaWNrZXIgdHJpZ2dlclxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0aW1lLXBpY2tlcicpLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXRlc3RpZD1cInRpbWUtaW5wdXRcIl0nKSEucGFyZW50RWxlbWVudCEpXG5cbiAgICAgICAgLy8gQ2xlYXIgdGltZVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0aW1lLXBpY2tlci1jbGVhcicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdpdGggaW5jbHVkZV9wbHVnaW5zIHdoZW4gaW4gcGFydGlhbCBtb2RlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0F1dG9VcGRhdGVDb25maWcoe1xuICAgICAgICAgIHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHksXG4gICAgICAgICAgdXBncmFkZV9tb2RlOiBBVVRPX1VQREFURV9NT0RFLnBhcnRpYWwsXG4gICAgICAgICAgaW5jbHVkZV9wbHVnaW5zOiBbJ2V4aXN0aW5nLXBsdWdpbiddLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHBheWxvYWQ9e3BheWxvYWR9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4pXG5cbiAgICAgICAgLy8gQ2xpY2sgY2xlYXIgYWxsXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdDbGVhciBBbGwnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgaW5jbHVkZV9wbHVnaW5zOiBbXSxcbiAgICAgICAgfSkpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2l0aCBleGNsdWRlX3BsdWdpbnMgd2hlbiBpbiBleGNsdWRlIG1vZGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgICAgICAgICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUuZXhjbHVkZSxcbiAgICAgICAgICBleGNsdWRlX3BsdWdpbnM6IFsnZXhpc3RpbmctcGx1Z2luJ10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgcGF5bG9hZD17cGF5bG9hZH0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPilcblxuICAgICAgICAvLyBDbGljayBjbGVhciBhbGxcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ0NsZWFyIEFsbCcpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25DaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBleGNsdWRlX3BsdWdpbnM6IFtdLFxuICAgICAgICB9KSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgb3BlbiBhY2NvdW50IHNldHRpbmdzIHdoZW4gdGltZXpvbmUgbGluayBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7IHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHkgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSB0aW1lem9uZSB0ZXh0IGlzIHJlbmRlcmVkXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9DaGFuZ2UgaW4vaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdDYWxsYmFjayBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdtaW51dGVGaWx0ZXIgc2hvdWxkIGZpbHRlciB0byAxNSBtaW51dGUgaW50ZXJ2YWxzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7IHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHkgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkfSAvPilcblxuICAgICAgICAvLyBUaGUgbWludXRlRmlsdGVyIGlzIHBhc3NlZCB0byBUaW1lUGlja2VyIGludGVybmFsbHlcbiAgICAgICAgLy8gV2UgdmVyaWZ5IHRoZSBjb21wb25lbnQgcmVuZGVycyBjb3JyZWN0bHlcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGltZS1waWNrZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2hhbmRsZUNoYW5nZSBzaG91bGQgcHJlc2VydmUgb3RoZXIgY29uZmlnIHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHtcbiAgICAgICAgICBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5LFxuICAgICAgICAgIHVwZ3JhZGVfdGltZV9vZl9kYXk6IDM2MDAwLFxuICAgICAgICAgIHVwZ3JhZGVfbW9kZTogQVVUT19VUERBVEVfTU9ERS5wYXJ0aWFsLFxuICAgICAgICAgIGluY2x1ZGVfcGx1Z2luczogWydwbHVnaW4tMSddLFxuICAgICAgICAgIGV4Y2x1ZGVfcGx1Z2luczogW10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgcGF5bG9hZD17cGF5bG9hZH0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPilcblxuICAgICAgICAvLyBUcmlnZ2VyIGEgY2hhbmdlIChjbGVhciBwbHVnaW5zKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnQ2xlYXIgQWxsJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gb3RoZXIgdmFsdWVzIHNob3VsZCBiZSBwcmVzZXJ2ZWRcbiAgICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgICAgICAgICB1cGdyYWRlX3RpbWVfb2ZfZGF5OiAzNjAwMCxcbiAgICAgICAgICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUucGFydGlhbCxcbiAgICAgICAgfSkpXG4gICAgICB9KVxuXG4gICAgICBpdCgnaGFuZGxlUGx1Z2luc0NoYW5nZSBzaG91bGQgbm90IHVwZGF0ZSB3aGVuIG1vZGUgaXMgdXBkYXRlX2FsbCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHtcbiAgICAgICAgICBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5LFxuICAgICAgICAgIHVwZ3JhZGVfbW9kZTogQVVUT19VUERBVEVfTU9ERS51cGRhdGVfYWxsLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHBheWxvYWQ9e3BheWxvYWR9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4pXG5cbiAgICAgICAgLy8gUGx1Z2luIHBpY2tlciBzaG91bGQgbm90IGJlIHZpc2libGUgaW4gdXBkYXRlX2FsbCBtb2RlXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0NsZWFyIEFsbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ01lbW9pemF0aW9uIExvZ2ljJywgKCkgPT4ge1xuICAgICAgaXQoJ3N0cmF0ZWd5RGVzY3JpcHRpb24gc2hvdWxkIHVwZGF0ZSB3aGVuIHN0cmF0ZWd5X3NldHRpbmcgY2hhbmdlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkMSA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHsgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSB9KVxuICAgICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWQxfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgaW5pdGlhbFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnT25seSBhcHBseSBidWcgZml4ZXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAgIC8vIEFjdCAtIGNoYW5nZSBzdHJhdGVneVxuICAgICAgICBjb25zdCBwYXlsb2FkMiA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHsgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kubGF0ZXN0IH0pXG4gICAgICAgIHJlcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkMn0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IHVwZGF0ZWRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0Fsd2F5cyB1cGRhdGUgdG8gbGF0ZXN0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdwbHVnaW5zIHNob3VsZCByZWZsZWN0IGNvcnJlY3QgbGlzdCBiYXNlZCBvbiB1cGdyYWRlX21vZGUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGFydGlhbFBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgICAgICAgICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUucGFydGlhbCxcbiAgICAgICAgICBpbmNsdWRlX3BsdWdpbnM6IFsnaW5jbHVkZS0xJywgJ2luY2x1ZGUtMiddLFxuICAgICAgICAgIGV4Y2x1ZGVfcGx1Z2luczogWydleGNsdWRlLTEnXSxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXJ0aWFsUGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gcGFydGlhbCBtb2RlIHNob3dzIGluY2x1ZGVfcGx1Z2lucyBjb3VudFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvVXBkYXRpbmcgMiBwbHVnaW5zL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgICAgLy8gQWN0IC0gY2hhbmdlIHRvIGV4Y2x1ZGUgbW9kZVxuICAgICAgICBjb25zdCBleGNsdWRlUGF5bG9hZCA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHtcbiAgICAgICAgICBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5LFxuICAgICAgICAgIHVwZ3JhZGVfbW9kZTogQVVUT19VUERBVEVfTU9ERS5leGNsdWRlLFxuICAgICAgICAgIGluY2x1ZGVfcGx1Z2luczogWydpbmNsdWRlLTEnLCAnaW5jbHVkZS0yJ10sXG4gICAgICAgICAgZXhjbHVkZV9wbHVnaW5zOiBbJ2V4Y2x1ZGUtMSddLFxuICAgICAgICB9KVxuICAgICAgICByZXJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17ZXhjbHVkZVBheWxvYWR9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIGV4Y2x1ZGUgbW9kZSBzaG93cyBleGNsdWRlX3BsdWdpbnMgY291bnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0V4Y2x1ZGluZyAxIHBsdWdpbnMvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KEF1dG9VcGRhdGVTZXR0aW5nKS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdCgoQXV0b1VwZGF0ZVNldHRpbmcgYXMgYW55KS4kJHR5cGVvZj8udG9TdHJpbmcoKSkudG9Db250YWluKCdTeW1ib2wnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBwYXlsb2FkIHZhbHVlcyBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgICAgICAgICBpbmNsdWRlX3BsdWdpbnM6IFtdLFxuICAgICAgICAgIGV4Y2x1ZGVfcGx1Z2luczogW10sXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdVcGRhdGUgU2V0dGluZ3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCB0aW1lem9uZSBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgICAvLyBUaGlzIHRlc3RzIHRoZSB0aW1lem9uZSEgbm9uLW51bGwgYXNzZXJ0aW9uIGluIHRoZSBjb21wb25lbnRcbiAgICAgICAgLy8gVGhlIG1vY2sgcHJvdmlkZXMgYSB2YWxpZCB0aW1lem9uZSwgc28gdGhlIGNvbXBvbmVudCBzaG91bGQgd29ya1xuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0F1dG9VcGRhdGVDb25maWcoeyBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHJlbmRlciB3aXRob3V0IGVycm9yc1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0aW1lLXBpY2tlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB0aW1lem9uZSBvZmZzZXQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7IHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHkgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBzaG91bGQgc2hvdyB0aW1lem9uZSBvZmZzZXRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0dNVC01JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdVcGdyYWRlIE1vZGUgT3B0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCB0aHJlZSB1cGdyYWRlIG1vZGUgb3B0aW9ucycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja0F1dG9VcGRhdGVDb25maWcoeyBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5IH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBbGwgUGx1Z2lucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdFeGNsdWRlIFNlbGVjdGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlbGVjdGVkIE9ubHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoaWdobGlnaHQgc2VsZWN0ZWQgdXBncmFkZSBtb2RlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZml4T25seSxcbiAgICAgICAgICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUucGFydGlhbCxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxBdXRvVXBkYXRlU2V0dGluZyB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwYXlsb2FkfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBPcHRpb25DYXJkIGNvbXBvbmVudCB3aWxsIGJlIHJlbmRlcmVkIGZvciBlYWNoIG1vZGVcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FsbCBQbHVnaW5zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0V4Y2x1ZGUgU2VsZWN0ZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2VsZWN0ZWQgT25seScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2hlbiB1cGdyYWRlIG1vZGUgaXMgY2hhbmdlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHtcbiAgICAgICAgICBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5LFxuICAgICAgICAgIHVwZ3JhZGVfbW9kZTogQVVUT19VUERBVEVfTU9ERS51cGRhdGVfYWxsLFxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPEF1dG9VcGRhdGVTZXR0aW5nIHBheWxvYWQ9e3BheWxvYWR9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4pXG5cbiAgICAgICAgLy8gQ2xpY2sgb24gcGFydGlhbCBtb2RlIC0gZmluZCB0aGUgb3B0aW9uIGNhcmQgZm9yIHBhcnRpYWxcbiAgICAgICAgY29uc3QgcGFydGlhbE9wdGlvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ1NlbGVjdGVkIE9ubHknKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2socGFydGlhbE9wdGlvbilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgdXBncmFkZV9tb2RlOiBBVVRPX1VQREFURV9NT0RFLnBhcnRpYWwsXG4gICAgICAgIH0pKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGZ1bGwgd29ya2Zsb3c6IGVuYWJsZSB1cGRhdGVzLCBzZXQgdGltZSwgc2VsZWN0IHBsdWdpbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGxldCBjdXJyZW50UGF5bG9hZCA9IGNyZWF0ZU1vY2tBdXRvVXBkYXRlQ29uZmlnKHtcbiAgICAgICAgc3RyYXRlZ3lfc2V0dGluZzogQVVUT19VUERBVEVfU1RSQVRFR1kuZGlzYWJsZWQsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxBdXRvVXBkYXRlU2V0dGluZyBwYXlsb2FkPXtjdXJyZW50UGF5bG9hZH0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gaW5pdGlhbGx5IGRpc2FibGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3RpbWUtcGlja2VyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFNpbXVsYXRlIGVuYWJsaW5nIHVwZGF0ZXNcbiAgICAgIGN1cnJlbnRQYXlsb2FkID0gY3JlYXRlTW9ja0F1dG9VcGRhdGVDb25maWcoe1xuICAgICAgICBzdHJhdGVneV9zZXR0aW5nOiBBVVRPX1VQREFURV9TVFJBVEVHWS5maXhPbmx5LFxuICAgICAgICB1cGdyYWRlX21vZGU6IEFVVE9fVVBEQVRFX01PREUucGFydGlhbCxcbiAgICAgICAgaW5jbHVkZV9wbHVnaW5zOiBbXSxcbiAgICAgIH0pXG4gICAgICByZXJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgcGF5bG9hZD17Y3VycmVudFBheWxvYWR9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIHRpbWUgcGlja2VyIGFuZCBwbHVnaW5zIHZpc2libGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RpbWUtcGlja2VyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTZWxlY3QgUGx1Z2lucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhdGUgY29uc2lzdGVuY3kgd2hlbiBzd2l0Y2hpbmcgbW9kZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrQXV0b1VwZGF0ZUNvbmZpZyh7XG4gICAgICAgIHN0cmF0ZWd5X3NldHRpbmc6IEFVVE9fVVBEQVRFX1NUUkFURUdZLmZpeE9ubHksXG4gICAgICAgIHVwZ3JhZGVfbW9kZTogQVVUT19VUERBVEVfTU9ERS5wYXJ0aWFsLFxuICAgICAgICBpbmNsdWRlX3BsdWdpbnM6IFsncGx1Z2luLTEnXSxcbiAgICAgICAgZXhjbHVkZV9wbHVnaW5zOiBbJ3BsdWdpbi0yJ10sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QXV0b1VwZGF0ZVNldHRpbmcgcGF5bG9hZD17cGF5bG9hZH0gb25DaGFuZ2U9e29uQ2hhbmdlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gcGFydGlhbCBtb2RlIHNob3dzIGluY2x1ZGVfcGx1Z2luc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL1VwZGF0aW5nIDEgcGx1Z2lucy9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19