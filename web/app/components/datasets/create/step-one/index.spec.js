"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const type_1 = require("@/app/components/billing/type");
const datasets_1 = require("@/models/datasets");
const components_1 = require("./components");
const hooks_1 = require("./hooks");
const index_1 = require("./index");
// ==========================================
// Mock External Dependencies
// ==========================================
// Mock config for website crawl features
vi.mock('@/config', () => ({
    ENABLE_WEBSITE_FIRECRAWL: true,
    ENABLE_WEBSITE_JINAREADER: false,
    ENABLE_WEBSITE_WATERCRAWL: false,
}));
// Mock dataset detail context
let mockDatasetDetail;
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (selector) => {
        return selector({ dataset: mockDatasetDetail });
    },
}));
// Mock provider context
let mockPlan = {
    type: type_1.Plan.professional,
    usage: { vectorSpace: 50, buildApps: 0, documentsUploadQuota: 0, vectorStorageQuota: 0 },
    total: { vectorSpace: 100, buildApps: 0, documentsUploadQuota: 0, vectorStorageQuota: 0 },
};
let mockEnableBilling = false;
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        plan: mockPlan,
        enableBilling: mockEnableBilling,
    }),
}));
// Mock child components
vi.mock('../file-uploader', () => ({
    default: ({ onPreview, fileList }) => (<div data-testid="file-uploader">
      <span data-testid="file-count">{fileList.length}</span>
      <button data-testid="preview-file" onClick={() => onPreview(new File(['test'], 'test.txt'))}>
        Preview
      </button>
    </div>),
}));
vi.mock('../website', () => ({
    default: ({ onPreview }) => (<div data-testid="website">
      <button data-testid="preview-website" onClick={() => onPreview({ title: 'Test', markdown: '', description: '', source_url: 'https://test.com' })}>
        Preview Website
      </button>
    </div>),
}));
vi.mock('../empty-dataset-creation-modal', () => ({
    default: ({ show, onHide }) => (show
        ? (<div data-testid="empty-dataset-modal">
            <button data-testid="close-modal" onClick={onHide}>Close</button>
          </div>)
        : null),
}));
// NotionConnector is a base component - imported directly without mock
// It only depends on i18n which is globally mocked
vi.mock('@/app/components/base/notion-page-selector', () => ({
    NotionPageSelector: ({ onPreview }) => (<div data-testid="notion-page-selector">
      <button data-testid="preview-notion" onClick={() => onPreview({ page_id: 'page-1', type: 'page' })}>
        Preview Notion
      </button>
    </div>),
}));
vi.mock('@/app/components/billing/vector-space-full', () => ({
    default: () => <div data-testid="vector-space-full">Vector Space Full</div>,
}));
vi.mock('@/app/components/billing/plan-upgrade-modal', () => ({
    default: ({ show, onClose }) => (show
        ? (<div data-testid="plan-upgrade-modal">
            <button data-testid="close-upgrade-modal" onClick={onClose}>Close</button>
          </div>)
        : null),
}));
vi.mock('../file-preview', () => ({
    default: ({ file, hidePreview }) => (<div data-testid="file-preview">
      <span>{file.name}</span>
      <button data-testid="hide-file-preview" onClick={hidePreview}>Hide</button>
    </div>),
}));
vi.mock('../notion-page-preview', () => ({
    default: ({ currentPage, hidePreview }) => (<div data-testid="notion-page-preview">
      <span>{currentPage.page_id}</span>
      <button data-testid="hide-notion-preview" onClick={hidePreview}>Hide</button>
    </div>),
}));
// WebsitePreview is a sibling component without API dependencies - imported directly
// It only depends on i18n which is globally mocked
vi.mock('./upgrade-card', () => ({
    default: () => <div data-testid="upgrade-card">Upgrade Card</div>,
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockCustomFile = (overrides = {}) => {
    const file = new File(['test content'], overrides.name ?? 'test.txt', { type: 'text/plain' });
    return Object.assign(file, {
        id: overrides.id ?? 'uploaded-id',
        extension: 'txt',
        mime_type: 'text/plain',
        created_by: 'user-1',
        created_at: Date.now(),
    });
};
const createMockFileItem = (overrides = {}) => ({
    fileID: `file-${Date.now()}`,
    file: createMockCustomFile(overrides.file),
    progress: 100,
    ...overrides,
});
const createMockNotionPage = (overrides = {}) => ({
    page_id: `page-${Date.now()}`,
    type: 'page',
    ...overrides,
});
const createMockCrawlResult = (overrides = {}) => ({
    title: 'Test Page',
    markdown: 'Test content',
    description: 'Test description',
    source_url: 'https://example.com',
    ...overrides,
});
const createMockDataSourceAuth = (overrides = {}) => ({
    credential_id: 'cred-1',
    provider: 'notion_datasource',
    plugin_id: 'plugin-1',
    credentials_list: [{ id: 'cred-1', name: 'Workspace 1' }],
    ...overrides,
});
const defaultProps = {
    dataSourceType: datasets_1.DataSourceType.FILE,
    dataSourceTypeDisable: false,
    onSetting: vi.fn(),
    files: [],
    updateFileList: vi.fn(),
    updateFile: vi.fn(),
    notionPages: [],
    notionCredentialId: '',
    updateNotionPages: vi.fn(),
    updateNotionCredentialId: vi.fn(),
    onStepChange: vi.fn(),
    changeType: vi.fn(),
    websitePages: [],
    updateWebsitePages: vi.fn(),
    onWebsiteCrawlProviderChange: vi.fn(),
    onWebsiteCrawlJobIdChange: vi.fn(),
    crawlOptions: {
        crawl_sub_pages: true,
        only_main_content: true,
        includes: '',
        excludes: '',
        limit: 10,
        max_depth: '',
        use_sitemap: true,
    },
    onCrawlOptionsChange: vi.fn(),
    authedDataSourceList: [],
};
// ==========================================
// usePreviewState Hook Tests
// ==========================================
describe('usePreviewState Hook', () => {
    // --------------------------------------------------------------------------
    // Initial State Tests
    // --------------------------------------------------------------------------
    describe('Initial State', () => {
        it('should initialize with all preview states undefined', () => {
            // Arrange & Act
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            // Assert
            expect(result.current.currentFile).toBeUndefined();
            expect(result.current.currentNotionPage).toBeUndefined();
            expect(result.current.currentWebsite).toBeUndefined();
        });
    });
    // --------------------------------------------------------------------------
    // File Preview Tests
    // --------------------------------------------------------------------------
    describe('File Preview', () => {
        it('should show file preview when showFilePreview is called', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const mockFile = new File(['test'], 'test.txt');
            // Act
            (0, react_1.act)(() => {
                result.current.showFilePreview(mockFile);
            });
            // Assert
            expect(result.current.currentFile).toBe(mockFile);
        });
        it('should hide file preview when hideFilePreview is called', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const mockFile = new File(['test'], 'test.txt');
            (0, react_1.act)(() => {
                result.current.showFilePreview(mockFile);
            });
            // Act
            (0, react_1.act)(() => {
                result.current.hideFilePreview();
            });
            // Assert
            expect(result.current.currentFile).toBeUndefined();
        });
    });
    // --------------------------------------------------------------------------
    // Notion Page Preview Tests
    // --------------------------------------------------------------------------
    describe('Notion Page Preview', () => {
        it('should show notion page preview when showNotionPagePreview is called', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const mockPage = createMockNotionPage();
            // Act
            (0, react_1.act)(() => {
                result.current.showNotionPagePreview(mockPage);
            });
            // Assert
            expect(result.current.currentNotionPage).toBe(mockPage);
        });
        it('should hide notion page preview when hideNotionPagePreview is called', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const mockPage = createMockNotionPage();
            (0, react_1.act)(() => {
                result.current.showNotionPagePreview(mockPage);
            });
            // Act
            (0, react_1.act)(() => {
                result.current.hideNotionPagePreview();
            });
            // Assert
            expect(result.current.currentNotionPage).toBeUndefined();
        });
    });
    // --------------------------------------------------------------------------
    // Website Preview Tests
    // --------------------------------------------------------------------------
    describe('Website Preview', () => {
        it('should show website preview when showWebsitePreview is called', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const mockWebsite = createMockCrawlResult();
            // Act
            (0, react_1.act)(() => {
                result.current.showWebsitePreview(mockWebsite);
            });
            // Assert
            expect(result.current.currentWebsite).toBe(mockWebsite);
        });
        it('should hide website preview when hideWebsitePreview is called', () => {
            // Arrange
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const mockWebsite = createMockCrawlResult();
            (0, react_1.act)(() => {
                result.current.showWebsitePreview(mockWebsite);
            });
            // Act
            (0, react_1.act)(() => {
                result.current.hideWebsitePreview();
            });
            // Assert
            expect(result.current.currentWebsite).toBeUndefined();
        });
    });
    // --------------------------------------------------------------------------
    // Callback Stability Tests (Memoization)
    // --------------------------------------------------------------------------
    describe('Callback Stability', () => {
        it('should maintain stable showFilePreview callback reference', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const initialCallback = result.current.showFilePreview;
            // Act
            rerender();
            // Assert
            expect(result.current.showFilePreview).toBe(initialCallback);
        });
        it('should maintain stable hideFilePreview callback reference', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const initialCallback = result.current.hideFilePreview;
            // Act
            rerender();
            // Assert
            expect(result.current.hideFilePreview).toBe(initialCallback);
        });
        it('should maintain stable showNotionPagePreview callback reference', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const initialCallback = result.current.showNotionPagePreview;
            // Act
            rerender();
            // Assert
            expect(result.current.showNotionPagePreview).toBe(initialCallback);
        });
        it('should maintain stable hideNotionPagePreview callback reference', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const initialCallback = result.current.hideNotionPagePreview;
            // Act
            rerender();
            // Assert
            expect(result.current.hideNotionPagePreview).toBe(initialCallback);
        });
        it('should maintain stable showWebsitePreview callback reference', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const initialCallback = result.current.showWebsitePreview;
            // Act
            rerender();
            // Assert
            expect(result.current.showWebsitePreview).toBe(initialCallback);
        });
        it('should maintain stable hideWebsitePreview callback reference', () => {
            // Arrange
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)());
            const initialCallback = result.current.hideWebsitePreview;
            // Act
            rerender();
            // Assert
            expect(result.current.hideWebsitePreview).toBe(initialCallback);
        });
    });
});
// ==========================================
// DataSourceTypeSelector Component Tests
// ==========================================
describe('DataSourceTypeSelector', () => {
    const defaultSelectorProps = {
        currentType: datasets_1.DataSourceType.FILE,
        disabled: false,
        onChange: vi.fn(),
        onClearPreviews: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render all data source options when web is enabled', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.DataSourceTypeSelector {...defaultSelectorProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.file')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.notion')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.web')).toBeInTheDocument();
        });
        it('should highlight active type', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<components_1.DataSourceTypeSelector {...defaultSelectorProps} currentType={datasets_1.DataSourceType.NOTION}/>);
            // Assert - The active item should have the active class
            const items = container.querySelectorAll('[class*="dataSourceItem"]');
            expect(items.length).toBeGreaterThan(0);
        });
    });
    // --------------------------------------------------------------------------
    // User Interactions Tests
    // --------------------------------------------------------------------------
    describe('User Interactions', () => {
        it('should call onChange when a type is clicked', () => {
            // Arrange
            const onChange = vi.fn();
            (0, react_1.render)(<components_1.DataSourceTypeSelector {...defaultSelectorProps} onChange={onChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.notion'));
            // Assert
            expect(onChange).toHaveBeenCalledWith(datasets_1.DataSourceType.NOTION);
        });
        it('should call onClearPreviews when a type is clicked', () => {
            // Arrange
            const onClearPreviews = vi.fn();
            (0, react_1.render)(<components_1.DataSourceTypeSelector {...defaultSelectorProps} onClearPreviews={onClearPreviews}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.web'));
            // Assert
            expect(onClearPreviews).toHaveBeenCalledWith(datasets_1.DataSourceType.WEB);
        });
        it('should not call onChange when disabled', () => {
            // Arrange
            const onChange = vi.fn();
            (0, react_1.render)(<components_1.DataSourceTypeSelector {...defaultSelectorProps} disabled onChange={onChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.notion'));
            // Assert
            expect(onChange).not.toHaveBeenCalled();
        });
        it('should not call onClearPreviews when disabled', () => {
            // Arrange
            const onClearPreviews = vi.fn();
            (0, react_1.render)(<components_1.DataSourceTypeSelector {...defaultSelectorProps} disabled onClearPreviews={onClearPreviews}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.notion'));
            // Assert
            expect(onClearPreviews).not.toHaveBeenCalled();
        });
    });
});
// ==========================================
// NextStepButton Component Tests
// ==========================================
describe('NextStepButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render with correct label', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.NextStepButton disabled={false} onClick={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.button')).toBeInTheDocument();
        });
        it('should render with arrow icon', () => {
            // Arrange & Act
            const { container } = (0, react_1.render)(<components_1.NextStepButton disabled={false} onClick={vi.fn()}/>);
            // Assert
            const svgIcon = container.querySelector('svg');
            expect(svgIcon).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Props Tests
    // --------------------------------------------------------------------------
    describe('Props', () => {
        it('should be disabled when disabled prop is true', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.NextStepButton disabled onClick={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeDisabled();
        });
        it('should be enabled when disabled prop is false', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.NextStepButton disabled={false} onClick={vi.fn()}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).not.toBeDisabled();
        });
        it('should call onClick when clicked and not disabled', () => {
            // Arrange
            const onClick = vi.fn();
            (0, react_1.render)(<components_1.NextStepButton disabled={false} onClick={onClick}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(onClick).toHaveBeenCalledTimes(1);
        });
        it('should not call onClick when clicked and disabled', () => {
            // Arrange
            const onClick = vi.fn();
            (0, react_1.render)(<components_1.NextStepButton disabled onClick={onClick}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Assert
            expect(onClick).not.toHaveBeenCalled();
        });
    });
});
// ==========================================
// PreviewPanel Component Tests
// ==========================================
describe('PreviewPanel', () => {
    const defaultPreviewProps = {
        currentFile: undefined,
        currentNotionPage: undefined,
        currentWebsite: undefined,
        notionCredentialId: 'cred-1',
        isShowPlanUpgradeModal: false,
        hideFilePreview: vi.fn(),
        hideNotionPagePreview: vi.fn(),
        hideWebsitePreview: vi.fn(),
        hidePlanUpgradeModal: vi.fn(),
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // --------------------------------------------------------------------------
    // Conditional Rendering Tests
    // --------------------------------------------------------------------------
    describe('Conditional Rendering', () => {
        it('should not render FilePreview when currentFile is undefined', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps}/>);
            // Assert
            expect(react_1.screen.queryByTestId('file-preview')).not.toBeInTheDocument();
        });
        it('should render FilePreview when currentFile is defined', () => {
            // Arrange
            const file = new File(['test'], 'test.txt');
            // Act
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} currentFile={file}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-preview')).toBeInTheDocument();
        });
        it('should not render NotionPagePreview when currentNotionPage is undefined', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps}/>);
            // Assert
            expect(react_1.screen.queryByTestId('notion-page-preview')).not.toBeInTheDocument();
        });
        it('should render NotionPagePreview when currentNotionPage is defined', () => {
            // Arrange
            const page = createMockNotionPage();
            // Act
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} currentNotionPage={page}/>);
            // Assert
            expect(react_1.screen.getByTestId('notion-page-preview')).toBeInTheDocument();
        });
        it('should not render WebsitePreview when currentWebsite is undefined', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps}/>);
            // Assert - pagePreview is the title shown in WebsitePreview
            expect(react_1.screen.queryByText('datasetCreation.stepOne.pagePreview')).not.toBeInTheDocument();
        });
        it('should render WebsitePreview when currentWebsite is defined', () => {
            // Arrange
            const website = createMockCrawlResult();
            // Act
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} currentWebsite={website}/>);
            // Assert - Check for the preview title and source URL
            expect(react_1.screen.getByText('datasetCreation.stepOne.pagePreview')).toBeInTheDocument();
            expect(react_1.screen.getByText(website.source_url)).toBeInTheDocument();
        });
        it('should not render PlanUpgradeModal when isShowPlanUpgradeModal is false', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} isShowPlanUpgradeModal={false}/>);
            // Assert
            expect(react_1.screen.queryByTestId('plan-upgrade-modal')).not.toBeInTheDocument();
        });
        it('should render PlanUpgradeModal when isShowPlanUpgradeModal is true', () => {
            // Arrange & Act
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} isShowPlanUpgradeModal/>);
            // Assert
            expect(react_1.screen.getByTestId('plan-upgrade-modal')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Event Handler Tests
    // --------------------------------------------------------------------------
    describe('Event Handlers', () => {
        it('should call hideFilePreview when file preview close is clicked', () => {
            // Arrange
            const hideFilePreview = vi.fn();
            const file = new File(['test'], 'test.txt');
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} currentFile={file} hideFilePreview={hideFilePreview}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('hide-file-preview'));
            // Assert
            expect(hideFilePreview).toHaveBeenCalledTimes(1);
        });
        it('should call hideNotionPagePreview when notion preview close is clicked', () => {
            // Arrange
            const hideNotionPagePreview = vi.fn();
            const page = createMockNotionPage();
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} currentNotionPage={page} hideNotionPagePreview={hideNotionPagePreview}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('hide-notion-preview'));
            // Assert
            expect(hideNotionPagePreview).toHaveBeenCalledTimes(1);
        });
        it('should call hideWebsitePreview when website preview close is clicked', () => {
            // Arrange
            const hideWebsitePreview = vi.fn();
            const website = createMockCrawlResult();
            const { container } = (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} currentWebsite={website} hideWebsitePreview={hideWebsitePreview}/>);
            // Act - Find the close button (div with cursor-pointer class containing the XMarkIcon)
            const closeButton = container.querySelector('.cursor-pointer');
            expect(closeButton).toBeInTheDocument();
            react_1.fireEvent.click(closeButton);
            // Assert
            expect(hideWebsitePreview).toHaveBeenCalledTimes(1);
        });
        it('should call hidePlanUpgradeModal when modal close is clicked', () => {
            // Arrange
            const hidePlanUpgradeModal = vi.fn();
            (0, react_1.render)(<components_1.PreviewPanel {...defaultPreviewProps} isShowPlanUpgradeModal hidePlanUpgradeModal={hidePlanUpgradeModal}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('close-upgrade-modal'));
            // Assert
            expect(hidePlanUpgradeModal).toHaveBeenCalledTimes(1);
        });
    });
});
// ==========================================
// StepOne Component Tests
// ==========================================
describe('StepOne', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockDatasetDetail = undefined;
        mockPlan = {
            type: type_1.Plan.professional,
            usage: { vectorSpace: 50, buildApps: 0, documentsUploadQuota: 0, vectorStorageQuota: 0 },
            total: { vectorSpace: 100, buildApps: 0, documentsUploadQuota: 0, vectorStorageQuota: 0 },
        };
        mockEnableBilling = false;
    });
    // --------------------------------------------------------------------------
    // Rendering Tests
    // --------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.steps.one')).toBeInTheDocument();
        });
        it('should render DataSourceTypeSelector when not editing existing dataset', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.file')).toBeInTheDocument();
        });
        it('should render FileUploader when dataSourceType is FILE', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.FILE}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-uploader')).toBeInTheDocument();
        });
        it('should render NotionConnector when dataSourceType is NOTION and not authenticated', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION}/>);
            // Assert - NotionConnector shows sync title and connect button
            expect(react_1.screen.getByText('datasetCreation.stepOne.notionSyncTitle')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.connect/i })).toBeInTheDocument();
        });
        it('should render NotionPageSelector when dataSourceType is NOTION and authenticated', () => {
            // Arrange
            const authedDataSourceList = [createMockDataSourceAuth()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION} authedDataSourceList={authedDataSourceList}/>);
            // Assert
            expect(react_1.screen.getByTestId('notion-page-selector')).toBeInTheDocument();
        });
        it('should render Website when dataSourceType is WEB', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.WEB}/>);
            // Assert
            expect(react_1.screen.getByTestId('website')).toBeInTheDocument();
        });
        it('should render empty dataset creation link when no datasetId', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepOne.emptyDatasetCreation')).toBeInTheDocument();
        });
        it('should not render empty dataset creation link when datasetId exists', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} datasetId="dataset-123"/>);
            // Assert
            expect(react_1.screen.queryByText('datasetCreation.stepOne.emptyDatasetCreation')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Props Tests
    // --------------------------------------------------------------------------
    describe('Props', () => {
        it('should pass files to FileUploader', () => {
            // Arrange
            const files = [createMockFileItem()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} files={files}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-count')).toHaveTextContent('1');
        });
        it('should call onSetting when NotionConnector connect button is clicked', () => {
            // Arrange
            const onSetting = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION} onSetting={onSetting}/>);
            // Act - The NotionConnector's button calls onSetting
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.connect/i }));
            // Assert
            expect(onSetting).toHaveBeenCalledTimes(1);
        });
        it('should call changeType when data source type is changed', () => {
            // Arrange
            const changeType = vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} changeType={changeType}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.notion'));
            // Assert
            expect(changeType).toHaveBeenCalledWith(datasets_1.DataSourceType.NOTION);
        });
    });
    // --------------------------------------------------------------------------
    // State Management Tests
    // --------------------------------------------------------------------------
    describe('State Management', () => {
        it('should open empty dataset modal when link is clicked', () => {
            // Arrange
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByText('datasetCreation.stepOne.emptyDatasetCreation'));
            // Assert
            expect(react_1.screen.getByTestId('empty-dataset-modal')).toBeInTheDocument();
        });
        it('should close empty dataset modal when close is clicked', () => {
            // Arrange
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByText('datasetCreation.stepOne.emptyDatasetCreation'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('close-modal'));
            // Assert
            expect(react_1.screen.queryByTestId('empty-dataset-modal')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Memoization Tests
    // --------------------------------------------------------------------------
    describe('Memoization', () => {
        it('should correctly compute isNotionAuthed based on authedDataSourceList', () => {
            // Arrange - No auth
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION}/>);
            // NotionConnector shows the sync title when not authenticated
            expect(react_1.screen.getByText('datasetCreation.stepOne.notionSyncTitle')).toBeInTheDocument();
            // Act - Add auth
            const authedDataSourceList = [createMockDataSourceAuth()];
            rerender(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION} authedDataSourceList={authedDataSourceList}/>);
            // Assert
            expect(react_1.screen.getByTestId('notion-page-selector')).toBeInTheDocument();
        });
        it('should correctly compute fileNextDisabled when files are empty', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} files={[]}/>);
            // Assert - Button should be disabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should correctly compute fileNextDisabled when files are loaded', () => {
            // Arrange
            const files = [createMockFileItem()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} files={files}/>);
            // Assert - Button should be enabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).not.toBeDisabled();
        });
        it('should correctly compute fileNextDisabled when some files are not uploaded', () => {
            // Arrange - Create a file item without id (not yet uploaded)
            const file = new File(['test'], 'test.txt', { type: 'text/plain' });
            const fileItem = {
                fileID: 'temp-id',
                file: Object.assign(file, { id: undefined, extension: 'txt', mime_type: 'text/plain' }),
                progress: 0,
            };
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} files={[fileItem]}/>);
            // Assert - Button should be disabled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
    });
    // --------------------------------------------------------------------------
    // Callback Tests
    // --------------------------------------------------------------------------
    describe('Callbacks', () => {
        it('should call onStepChange when next button is clicked with valid files', () => {
            // Arrange
            const onStepChange = vi.fn();
            const files = [createMockFileItem()];
            (0, react_1.render)(<index_1.default {...defaultProps} files={files} onStepChange={onStepChange}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(onStepChange).toHaveBeenCalledTimes(1);
        });
        it('should show plan upgrade modal when batch upload not supported and multiple files', () => {
            // Arrange
            mockEnableBilling = true;
            mockPlan.type = type_1.Plan.sandbox;
            const files = [createMockFileItem(), createMockFileItem()];
            (0, react_1.render)(<index_1.default {...defaultProps} files={files}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(react_1.screen.getByTestId('plan-upgrade-modal')).toBeInTheDocument();
        });
        it('should show upgrade card when in sandbox plan with files', () => {
            // Arrange
            mockEnableBilling = true;
            mockPlan.type = type_1.Plan.sandbox;
            const files = [createMockFileItem()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} files={files}/>);
            // Assert
            expect(react_1.screen.getByTestId('upgrade-card')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Vector Space Full Tests
    // --------------------------------------------------------------------------
    describe('Vector Space Full', () => {
        it('should show VectorSpaceFull when vector space is full and billing is enabled', () => {
            // Arrange
            mockEnableBilling = true;
            mockPlan.usage.vectorSpace = 100;
            mockPlan.total.vectorSpace = 100;
            const files = [createMockFileItem()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} files={files}/>);
            // Assert
            expect(react_1.screen.getByTestId('vector-space-full')).toBeInTheDocument();
        });
        it('should disable next button when vector space is full', () => {
            // Arrange
            mockEnableBilling = true;
            mockPlan.usage.vectorSpace = 100;
            mockPlan.total.vectorSpace = 100;
            const files = [createMockFileItem()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} files={files}/>);
            // Assert
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
    });
    // --------------------------------------------------------------------------
    // Preview Integration Tests
    // --------------------------------------------------------------------------
    describe('Preview Integration', () => {
        it('should show file preview when file preview button is clicked', () => {
            // Arrange
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-file'));
            // Assert
            expect(react_1.screen.getByTestId('file-preview')).toBeInTheDocument();
        });
        it('should hide file preview when hide button is clicked', () => {
            // Arrange
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-file'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('hide-file-preview'));
            // Assert
            expect(react_1.screen.queryByTestId('file-preview')).not.toBeInTheDocument();
        });
        it('should show notion page preview when preview button is clicked', () => {
            // Arrange
            const authedDataSourceList = [createMockDataSourceAuth()];
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION} authedDataSourceList={authedDataSourceList}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-notion'));
            // Assert
            expect(react_1.screen.getByTestId('notion-page-preview')).toBeInTheDocument();
        });
        it('should show website preview when preview button is clicked', () => {
            // Arrange
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.WEB}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-website'));
            // Assert - Check for pagePreview title which is shown by WebsitePreview
            expect(react_1.screen.getByText('datasetCreation.stepOne.pagePreview')).toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Edge Cases
    // --------------------------------------------------------------------------
    describe('Edge Cases', () => {
        it('should handle empty notionPages array', () => {
            // Arrange
            const authedDataSourceList = [createMockDataSourceAuth()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION} notionPages={[]} authedDataSourceList={authedDataSourceList}/>);
            // Assert - Button should be disabled when no pages selected
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should handle empty websitePages array', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.WEB} websitePages={[]}/>);
            // Assert - Button should be disabled when no pages crawled
            expect(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i })).toBeDisabled();
        });
        it('should handle empty authedDataSourceList', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION} authedDataSourceList={[]}/>);
            // Assert - Should show NotionConnector with connect button
            expect(react_1.screen.getByText('datasetCreation.stepOne.notionSyncTitle')).toBeInTheDocument();
        });
        it('should handle authedDataSourceList without notion credentials', () => {
            // Arrange
            const authedDataSourceList = [createMockDataSourceAuth({ credentials_list: [] })];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION} authedDataSourceList={authedDataSourceList}/>);
            // Assert - Should show NotionConnector with connect button
            expect(react_1.screen.getByText('datasetCreation.stepOne.notionSyncTitle')).toBeInTheDocument();
        });
        it('should clear previews when switching data source types', () => {
            // Arrange
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-file'));
            expect(react_1.screen.getByTestId('file-preview')).toBeInTheDocument();
            // Act - Change to NOTION
            react_1.fireEvent.click(react_1.screen.getByText('datasetCreation.stepOne.dataSourceType.notion'));
            // Assert - File preview should be cleared
            expect(react_1.screen.queryByTestId('file-preview')).not.toBeInTheDocument();
        });
    });
    // --------------------------------------------------------------------------
    // Integration Tests
    // --------------------------------------------------------------------------
    describe('Integration', () => {
        it('should complete file upload flow', () => {
            // Arrange
            const onStepChange = vi.fn();
            const files = [createMockFileItem()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} files={files} onStepChange={onStepChange}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(onStepChange).toHaveBeenCalled();
        });
        it('should complete notion page selection flow', () => {
            // Arrange
            const onStepChange = vi.fn();
            const authedDataSourceList = [createMockDataSourceAuth()];
            const notionPages = [createMockNotionPage()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.NOTION} authedDataSourceList={authedDataSourceList} notionPages={notionPages} onStepChange={onStepChange}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(onStepChange).toHaveBeenCalled();
        });
        it('should complete website crawl flow', () => {
            // Arrange
            const onStepChange = vi.fn();
            const websitePages = [createMockCrawlResult()];
            // Act
            (0, react_1.render)(<index_1.default {...defaultProps} dataSourceType={datasets_1.DataSourceType.WEB} websitePages={websitePages} onStepChange={onStepChange}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /datasetCreation.stepOne.button/i }));
            // Assert
            expect(onStepChange).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esa0RBQW1GO0FBQ25GLHdEQUFvRDtBQUNwRCxnREFBa0Q7QUFDbEQsNkNBQW1GO0FBQ25GLG1DQUF5QztBQUN6QyxtQ0FBNkI7QUFFN0IsNkNBQTZDO0FBQzdDLDZCQUE2QjtBQUM3Qiw2Q0FBNkM7QUFFN0MseUNBQXlDO0FBQ3pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekIsd0JBQXdCLEVBQUUsSUFBSTtJQUM5Qix5QkFBeUIsRUFBRSxLQUFLO0lBQ2hDLHlCQUF5QixFQUFFLEtBQUs7Q0FDakMsQ0FBQyxDQUFDLENBQUE7QUFFSCw4QkFBOEI7QUFDOUIsSUFBSSxpQkFBc0MsQ0FBQTtBQUMxQyxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekMsbUNBQW1DLEVBQUUsQ0FBQyxRQUEwRSxFQUFFLEVBQUU7UUFDbEgsT0FBTyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFBO0lBQ2pELENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILHdCQUF3QjtBQUN4QixJQUFJLFFBQVEsR0FBRztJQUNiLElBQUksRUFBRSxXQUFJLENBQUMsWUFBWTtJQUN2QixLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLENBQUMsRUFBRTtJQUN4RixLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLENBQUMsRUFBRTtDQUMxRixDQUFBO0FBQ0QsSUFBSSxpQkFB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QUUsRUFBRSxDQUFBO1lBQzVCLE1BQU0sWUFBWSxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFBO1lBRTlDLE1BQU07WUFDTixJQUFBLGNBQU0sRUFDSixDQUFDLGVBQU8sQ0FDTixJQUFJLFlBQVksQ0FBQyxDQUNqQixjQUFjLENBQUMsQ0FBQyx5QkFBYyxDQUFDLEdBQUcsQ0FBQyxDQUNuQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FDM0IsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQzNCLENBQ0gsQ0FBQTtZQUNELGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLGlDQUFpQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBRXhGLFNBQVM7WUFDVCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtRQUN6QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IERhdGFTb3VyY2VBdXRoIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL2RhdGEtc291cmNlLXBhZ2UtbmV3L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBOb3Rpb25QYWdlIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHR5cGUgeyBDcmF3bE9wdGlvbnMsIENyYXdsUmVzdWx0SXRlbSwgRGF0YVNldCwgRmlsZUl0ZW0gfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IGFjdCwgZmlyZUV2ZW50LCByZW5kZXIsIHJlbmRlckhvb2ssIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBQbGFuIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgeyBEYXRhU291cmNlVHlwZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgRGF0YVNvdXJjZVR5cGVTZWxlY3RvciwgTmV4dFN0ZXBCdXR0b24sIFByZXZpZXdQYW5lbCB9IGZyb20gJy4vY29tcG9uZW50cydcbmltcG9ydCB7IHVzZVByZXZpZXdTdGF0ZSB9IGZyb20gJy4vaG9va3MnXG5pbXBvcnQgU3RlcE9uZSBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgRXh0ZXJuYWwgRGVwZW5kZW5jaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBjb25maWcgZm9yIHdlYnNpdGUgY3Jhd2wgZmVhdHVyZXNcbnZpLm1vY2soJ0AvY29uZmlnJywgKCkgPT4gKHtcbiAgRU5BQkxFX1dFQlNJVEVfRklSRUNSQVdMOiB0cnVlLFxuICBFTkFCTEVfV0VCU0lURV9KSU5BUkVBREVSOiBmYWxzZSxcbiAgRU5BQkxFX1dFQlNJVEVfV0FURVJDUkFXTDogZmFsc2UsXG59KSlcblxuLy8gTW9jayBkYXRhc2V0IGRldGFpbCBjb250ZXh0XG5sZXQgbW9ja0RhdGFzZXREZXRhaWw6IERhdGFTZXQgfCB1bmRlZmluZWRcbnZpLm1vY2soJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCcsICgpID0+ICh7XG4gIHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yOiAoc2VsZWN0b3I6IChzdGF0ZTogeyBkYXRhc2V0OiBEYXRhU2V0IHwgdW5kZWZpbmVkIH0pID0+IERhdGFTZXQgfCB1bmRlZmluZWQpID0+IHtcbiAgICByZXR1cm4gc2VsZWN0b3IoeyBkYXRhc2V0OiBtb2NrRGF0YXNldERldGFpbCB9KVxuICB9LFxufSkpXG5cbi8vIE1vY2sgcHJvdmlkZXIgY29udGV4dFxubGV0IG1vY2tQbGFuID0ge1xuICB0eXBlOiBQbGFuLnByb2Zlc3Npb25hbCxcbiAgdXNhZ2U6IHsgdmVjdG9yU3BhY2U6IDUwLCBidWlsZEFwcHM6IDAsIGRvY3VtZW50c1VwbG9hZFF1b3RhOiAwLCB2ZWN0b3JTdG9yYWdlUXVvdGE6IDAgfSxcbiAgdG90YWw6IHsgdmVjdG9yU3BhY2U6IDEwMCwgYnVpbGRBcHBzOiAwLCBkb2N1bWVudHNVcGxvYWRRdW90YTogMCwgdmVjdG9yU3RvcmFnZVF1b3RhOiAwIH0sXG59XG5sZXQgbW9ja0VuYWJsZUJpbGxpbmcgPSBmYWxzZVxuXG52aS5tb2NrKCdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCcsICgpID0+ICh7XG4gIHVzZVByb3ZpZGVyQ29udGV4dDogKCkgPT4gKHtcbiAgICBwbGFuOiBtb2NrUGxhbixcbiAgICBlbmFibGVCaWxsaW5nOiBtb2NrRW5hYmxlQmlsbGluZyxcbiAgfSksXG59KSlcblxuLy8gTW9jayBjaGlsZCBjb21wb25lbnRzXG52aS5tb2NrKCcuLi9maWxlLXVwbG9hZGVyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgb25QcmV2aWV3LCBmaWxlTGlzdCB9OiB7IG9uUHJldmlldzogKGZpbGU6IEZpbGUpID0+IHZvaWQsIGZpbGVMaXN0OiBGaWxlSXRlbVtdIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiZmlsZS11cGxvYWRlclwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLWNvdW50XCI+e2ZpbGVMaXN0Lmxlbmd0aH08L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwicHJldmlldy1maWxlXCIgb25DbGljaz17KCkgPT4gb25QcmV2aWV3KG5ldyBGaWxlKFsndGVzdCddLCAndGVzdC50eHQnKSl9PlxuICAgICAgICBQcmV2aWV3XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCcuLi93ZWJzaXRlJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgb25QcmV2aWV3IH06IHsgb25QcmV2aWV3OiAoaXRlbTogQ3Jhd2xSZXN1bHRJdGVtKSA9PiB2b2lkIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwid2Vic2l0ZVwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cInByZXZpZXctd2Vic2l0ZVwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uUHJldmlldyh7IHRpdGxlOiAnVGVzdCcsIG1hcmtkb3duOiAnJywgZGVzY3JpcHRpb246ICcnLCBzb3VyY2VfdXJsOiAnaHR0cHM6Ly90ZXN0LmNvbScgfSl9XG4gICAgICA+XG4gICAgICAgIFByZXZpZXcgV2Vic2l0ZVxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxudmkubW9jaygnLi4vZW1wdHktZGF0YXNldC1jcmVhdGlvbi1tb2RhbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHNob3csIG9uSGlkZSB9OiB7IHNob3c6IGJvb2xlYW4sIG9uSGlkZTogKCkgPT4gdm9pZCB9KSA9PiAoXG4gICAgc2hvd1xuICAgICAgPyAoXG4gICAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImVtcHR5LWRhdGFzZXQtbW9kYWxcIj5cbiAgICAgICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJjbG9zZS1tb2RhbFwiIG9uQ2xpY2s9e29uSGlkZX0+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKVxuICAgICAgOiBudWxsXG4gICksXG59KSlcblxuLy8gTm90aW9uQ29ubmVjdG9yIGlzIGEgYmFzZSBjb21wb25lbnQgLSBpbXBvcnRlZCBkaXJlY3RseSB3aXRob3V0IG1vY2tcbi8vIEl0IG9ubHkgZGVwZW5kcyBvbiBpMThuIHdoaWNoIGlzIGdsb2JhbGx5IG1vY2tlZFxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvbm90aW9uLXBhZ2Utc2VsZWN0b3InLCAoKSA9PiAoe1xuICBOb3Rpb25QYWdlU2VsZWN0b3I6ICh7IG9uUHJldmlldyB9OiB7IG9uUHJldmlldzogKHBhZ2U6IE5vdGlvblBhZ2UpID0+IHZvaWQgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJub3Rpb24tcGFnZS1zZWxlY3RvclwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cInByZXZpZXctbm90aW9uXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gb25QcmV2aWV3KHsgcGFnZV9pZDogJ3BhZ2UtMScsIHR5cGU6ICdwYWdlJyB9IGFzIE5vdGlvblBhZ2UpfVxuICAgICAgPlxuICAgICAgICBQcmV2aWV3IE5vdGlvblxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3ZlY3Rvci1zcGFjZS1mdWxsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cInZlY3Rvci1zcGFjZS1mdWxsXCI+VmVjdG9yIFNwYWNlIEZ1bGw8L2Rpdj4sXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3BsYW4tdXBncmFkZS1tb2RhbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHNob3csIG9uQ2xvc2UgfTogeyBzaG93OiBib29sZWFuLCBvbkNsb3NlOiAoKSA9PiB2b2lkIH0pID0+IChcbiAgICBzaG93XG4gICAgICA/IChcbiAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicGxhbi11cGdyYWRlLW1vZGFsXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiY2xvc2UtdXBncmFkZS1tb2RhbFwiIG9uQ2xpY2s9e29uQ2xvc2V9PkNsb3NlPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICAgIDogbnVsbFxuICApLFxufSkpXG5cbnZpLm1vY2soJy4uL2ZpbGUtcHJldmlldycsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGZpbGUsIGhpZGVQcmV2aWV3IH06IHsgZmlsZTogRmlsZSwgaGlkZVByZXZpZXc6ICgpID0+IHZvaWQgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJmaWxlLXByZXZpZXdcIj5cbiAgICAgIDxzcGFuPntmaWxlLm5hbWV9PC9zcGFuPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImhpZGUtZmlsZS1wcmV2aWV3XCIgb25DbGljaz17aGlkZVByZXZpZXd9PkhpZGU8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCcuLi9ub3Rpb24tcGFnZS1wcmV2aWV3JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY3VycmVudFBhZ2UsIGhpZGVQcmV2aWV3IH06IHsgY3VycmVudFBhZ2U6IE5vdGlvblBhZ2UsIGhpZGVQcmV2aWV3OiAoKSA9PiB2b2lkIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibm90aW9uLXBhZ2UtcHJldmlld1wiPlxuICAgICAgPHNwYW4+e2N1cnJlbnRQYWdlLnBhZ2VfaWR9PC9zcGFuPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImhpZGUtbm90aW9uLXByZXZpZXdcIiBvbkNsaWNrPXtoaWRlUHJldmlld30+SGlkZTwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIFdlYnNpdGVQcmV2aWV3IGlzIGEgc2libGluZyBjb21wb25lbnQgd2l0aG91dCBBUEkgZGVwZW5kZW5jaWVzIC0gaW1wb3J0ZWQgZGlyZWN0bHlcbi8vIEl0IG9ubHkgZGVwZW5kcyBvbiBpMThuIHdoaWNoIGlzIGdsb2JhbGx5IG1vY2tlZFxuXG52aS5tb2NrKCcuL3VwZ3JhZGUtY2FyZCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IDxkaXYgZGF0YS10ZXN0aWQ9XCJ1cGdyYWRlLWNhcmRcIj5VcGdyYWRlIENhcmQ8L2Rpdj4sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgQnVpbGRlcnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrQ3VzdG9tRmlsZSA9IChvdmVycmlkZXM6IHsgaWQ/OiBzdHJpbmcsIG5hbWU/OiBzdHJpbmcgfSA9IHt9KSA9PiB7XG4gIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShbJ3Rlc3QgY29udGVudCddLCBvdmVycmlkZXMubmFtZSA/PyAndGVzdC50eHQnLCB7IHR5cGU6ICd0ZXh0L3BsYWluJyB9KVxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihmaWxlLCB7XG4gICAgaWQ6IG92ZXJyaWRlcy5pZCA/PyAndXBsb2FkZWQtaWQnLFxuICAgIGV4dGVuc2lvbjogJ3R4dCcsXG4gICAgbWltZV90eXBlOiAndGV4dC9wbGFpbicsXG4gICAgY3JlYXRlZF9ieTogJ3VzZXItMScsXG4gICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgfSlcbn1cblxuY29uc3QgY3JlYXRlTW9ja0ZpbGVJdGVtID0gKG92ZXJyaWRlczogUGFydGlhbDxGaWxlSXRlbT4gPSB7fSk6IEZpbGVJdGVtID0+ICh7XG4gIGZpbGVJRDogYGZpbGUtJHtEYXRlLm5vdygpfWAsXG4gIGZpbGU6IGNyZWF0ZU1vY2tDdXN0b21GaWxlKG92ZXJyaWRlcy5maWxlIGFzIHsgaWQ/OiBzdHJpbmcsIG5hbWU/OiBzdHJpbmcgfSksXG4gIHByb2dyZXNzOiAxMDAsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tOb3Rpb25QYWdlID0gKG92ZXJyaWRlczogUGFydGlhbDxOb3Rpb25QYWdlPiA9IHt9KTogTm90aW9uUGFnZSA9PiAoe1xuICBwYWdlX2lkOiBgcGFnZS0ke0RhdGUubm93KCl9YCxcbiAgdHlwZTogJ3BhZ2UnLFxuICAuLi5vdmVycmlkZXMsXG59IGFzIE5vdGlvblBhZ2UpXG5cbmNvbnN0IGNyZWF0ZU1vY2tDcmF3bFJlc3VsdCA9IChvdmVycmlkZXM6IFBhcnRpYWw8Q3Jhd2xSZXN1bHRJdGVtPiA9IHt9KTogQ3Jhd2xSZXN1bHRJdGVtID0+ICh7XG4gIHRpdGxlOiAnVGVzdCBQYWdlJyxcbiAgbWFya2Rvd246ICdUZXN0IGNvbnRlbnQnLFxuICBkZXNjcmlwdGlvbjogJ1Rlc3QgZGVzY3JpcHRpb24nLFxuICBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tEYXRhU291cmNlQXV0aCA9IChvdmVycmlkZXM6IFBhcnRpYWw8RGF0YVNvdXJjZUF1dGg+ID0ge30pOiBEYXRhU291cmNlQXV0aCA9PiAoe1xuICBjcmVkZW50aWFsX2lkOiAnY3JlZC0xJyxcbiAgcHJvdmlkZXI6ICdub3Rpb25fZGF0YXNvdXJjZScsXG4gIHBsdWdpbl9pZDogJ3BsdWdpbi0xJyxcbiAgY3JlZGVudGlhbHNfbGlzdDogW3sgaWQ6ICdjcmVkLTEnLCBuYW1lOiAnV29ya3NwYWNlIDEnIH1dLFxuICAuLi5vdmVycmlkZXMsXG59IGFzIERhdGFTb3VyY2VBdXRoKVxuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5GSUxFLFxuICBkYXRhU291cmNlVHlwZURpc2FibGU6IGZhbHNlLFxuICBvblNldHRpbmc6IHZpLmZuKCksXG4gIGZpbGVzOiBbXSBhcyBGaWxlSXRlbVtdLFxuICB1cGRhdGVGaWxlTGlzdDogdmkuZm4oKSxcbiAgdXBkYXRlRmlsZTogdmkuZm4oKSxcbiAgbm90aW9uUGFnZXM6IFtdIGFzIE5vdGlvblBhZ2VbXSxcbiAgbm90aW9uQ3JlZGVudGlhbElkOiAnJyxcbiAgdXBkYXRlTm90aW9uUGFnZXM6IHZpLmZuKCksXG4gIHVwZGF0ZU5vdGlvbkNyZWRlbnRpYWxJZDogdmkuZm4oKSxcbiAgb25TdGVwQ2hhbmdlOiB2aS5mbigpLFxuICBjaGFuZ2VUeXBlOiB2aS5mbigpLFxuICB3ZWJzaXRlUGFnZXM6IFtdIGFzIENyYXdsUmVzdWx0SXRlbVtdLFxuICB1cGRhdGVXZWJzaXRlUGFnZXM6IHZpLmZuKCksXG4gIG9uV2Vic2l0ZUNyYXdsUHJvdmlkZXJDaGFuZ2U6IHZpLmZuKCksXG4gIG9uV2Vic2l0ZUNyYXdsSm9iSWRDaGFuZ2U6IHZpLmZuKCksXG4gIGNyYXdsT3B0aW9uczoge1xuICAgIGNyYXdsX3N1Yl9wYWdlczogdHJ1ZSxcbiAgICBvbmx5X21haW5fY29udGVudDogdHJ1ZSxcbiAgICBpbmNsdWRlczogJycsXG4gICAgZXhjbHVkZXM6ICcnLFxuICAgIGxpbWl0OiAxMCxcbiAgICBtYXhfZGVwdGg6ICcnLFxuICAgIHVzZV9zaXRlbWFwOiB0cnVlLFxuICB9IGFzIENyYXdsT3B0aW9ucyxcbiAgb25DcmF3bE9wdGlvbnNDaGFuZ2U6IHZpLmZuKCksXG4gIGF1dGhlZERhdGFTb3VyY2VMaXN0OiBbXSBhcyBEYXRhU291cmNlQXV0aFtdLFxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIHVzZVByZXZpZXdTdGF0ZSBIb29rIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCd1c2VQcmV2aWV3U3RhdGUgSG9vaycsICgpID0+IHtcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5pdGlhbCBTdGF0ZSBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSW5pdGlhbCBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBhbGwgcHJldmlldyBzdGF0ZXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUHJldmlld1N0YXRlKCkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmN1cnJlbnRGaWxlKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jdXJyZW50Tm90aW9uUGFnZSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudFdlYnNpdGUpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRmlsZSBQcmV2aWV3IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdGaWxlIFByZXZpZXcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGZpbGUgcHJldmlldyB3aGVuIHNob3dGaWxlUHJldmlldyBpcyBjYWxsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoKSlcbiAgICAgIGNvbnN0IG1vY2tGaWxlID0gbmV3IEZpbGUoWyd0ZXN0J10sICd0ZXN0LnR4dCcpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2hvd0ZpbGVQcmV2aWV3KG1vY2tGaWxlKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudEZpbGUpLnRvQmUobW9ja0ZpbGUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBmaWxlIHByZXZpZXcgd2hlbiBoaWRlRmlsZVByZXZpZXcgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUHJldmlld1N0YXRlKCkpXG4gICAgICBjb25zdCBtb2NrRmlsZSA9IG5ldyBGaWxlKFsndGVzdCddLCAndGVzdC50eHQnKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zaG93RmlsZVByZXZpZXcobW9ja0ZpbGUpXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmhpZGVGaWxlUHJldmlldygpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jdXJyZW50RmlsZSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBOb3Rpb24gUGFnZSBQcmV2aWV3IFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdOb3Rpb24gUGFnZSBQcmV2aWV3JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBub3Rpb24gcGFnZSBwcmV2aWV3IHdoZW4gc2hvd05vdGlvblBhZ2VQcmV2aWV3IGlzIGNhbGxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVByZXZpZXdTdGF0ZSgpKVxuICAgICAgY29uc3QgbW9ja1BhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2hvd05vdGlvblBhZ2VQcmV2aWV3KG1vY2tQYWdlKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudE5vdGlvblBhZ2UpLnRvQmUobW9ja1BhZ2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBub3Rpb24gcGFnZSBwcmV2aWV3IHdoZW4gaGlkZU5vdGlvblBhZ2VQcmV2aWV3IGlzIGNhbGxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVByZXZpZXdTdGF0ZSgpKVxuICAgICAgY29uc3QgbW9ja1BhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSgpXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNob3dOb3Rpb25QYWdlUHJldmlldyhtb2NrUGFnZSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGlkZU5vdGlvblBhZ2VQcmV2aWV3KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmN1cnJlbnROb3Rpb25QYWdlKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFdlYnNpdGUgUHJldmlldyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnV2Vic2l0ZSBQcmV2aWV3JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyB3ZWJzaXRlIHByZXZpZXcgd2hlbiBzaG93V2Vic2l0ZVByZXZpZXcgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUHJldmlld1N0YXRlKCkpXG4gICAgICBjb25zdCBtb2NrV2Vic2l0ZSA9IGNyZWF0ZU1vY2tDcmF3bFJlc3VsdCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2hvd1dlYnNpdGVQcmV2aWV3KG1vY2tXZWJzaXRlKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudFdlYnNpdGUpLnRvQmUobW9ja1dlYnNpdGUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSB3ZWJzaXRlIHByZXZpZXcgd2hlbiBoaWRlV2Vic2l0ZVByZXZpZXcgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUHJldmlld1N0YXRlKCkpXG4gICAgICBjb25zdCBtb2NrV2Vic2l0ZSA9IGNyZWF0ZU1vY2tDcmF3bFJlc3VsdCgpXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNob3dXZWJzaXRlUHJldmlldyhtb2NrV2Vic2l0ZSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGlkZVdlYnNpdGVQcmV2aWV3KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmN1cnJlbnRXZWJzaXRlKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBUZXN0cyAoTWVtb2l6YXRpb24pXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgc2hvd0ZpbGVQcmV2aWV3IGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoKSlcbiAgICAgIGNvbnN0IGluaXRpYWxDYWxsYmFjayA9IHJlc3VsdC5jdXJyZW50LnNob3dGaWxlUHJldmlld1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2hvd0ZpbGVQcmV2aWV3KS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGlkZUZpbGVQcmV2aWV3IGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoKSlcbiAgICAgIGNvbnN0IGluaXRpYWxDYWxsYmFjayA9IHJlc3VsdC5jdXJyZW50LmhpZGVGaWxlUHJldmlld1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaGlkZUZpbGVQcmV2aWV3KS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgc2hvd05vdGlvblBhZ2VQcmV2aWV3IGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoKSlcbiAgICAgIGNvbnN0IGluaXRpYWxDYWxsYmFjayA9IHJlc3VsdC5jdXJyZW50LnNob3dOb3Rpb25QYWdlUHJldmlld1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2hvd05vdGlvblBhZ2VQcmV2aWV3KS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGlkZU5vdGlvblBhZ2VQcmV2aWV3IGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoKSlcbiAgICAgIGNvbnN0IGluaXRpYWxDYWxsYmFjayA9IHJlc3VsdC5jdXJyZW50LmhpZGVOb3Rpb25QYWdlUHJldmlld1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaGlkZU5vdGlvblBhZ2VQcmV2aWV3KS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgc2hvd1dlYnNpdGVQcmV2aWV3IGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoKSlcbiAgICAgIGNvbnN0IGluaXRpYWxDYWxsYmFjayA9IHJlc3VsdC5jdXJyZW50LnNob3dXZWJzaXRlUHJldmlld1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2hvd1dlYnNpdGVQcmV2aWV3KS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGlkZVdlYnNpdGVQcmV2aWV3IGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoKSlcbiAgICAgIGNvbnN0IGluaXRpYWxDYWxsYmFjayA9IHJlc3VsdC5jdXJyZW50LmhpZGVXZWJzaXRlUHJldmlld1xuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaGlkZVdlYnNpdGVQcmV2aWV3KS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBEYXRhU291cmNlVHlwZVNlbGVjdG9yIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnRGF0YVNvdXJjZVR5cGVTZWxlY3RvcicsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFNlbGVjdG9yUHJvcHMgPSB7XG4gICAgY3VycmVudFR5cGU6IERhdGFTb3VyY2VUeXBlLkZJTEUsXG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuICAgIG9uQ2hhbmdlOiB2aS5mbigpLFxuICAgIG9uQ2xlYXJQcmV2aWV3czogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCBkYXRhIHNvdXJjZSBvcHRpb25zIHdoZW4gd2ViIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPERhdGFTb3VyY2VUeXBlU2VsZWN0b3Igey4uLmRlZmF1bHRTZWxlY3RvclByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZGF0YVNvdXJjZVR5cGUuZmlsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZGF0YVNvdXJjZVR5cGUubm90aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5kYXRhU291cmNlVHlwZS53ZWInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhpZ2hsaWdodCBhY3RpdmUgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxEYXRhU291cmNlVHlwZVNlbGVjdG9yIHsuLi5kZWZhdWx0U2VsZWN0b3JQcm9wc30gY3VycmVudFR5cGU9e0RhdGFTb3VyY2VUeXBlLk5PVElPTn0gLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIFRoZSBhY3RpdmUgaXRlbSBzaG91bGQgaGF2ZSB0aGUgYWN0aXZlIGNsYXNzXG4gICAgICBjb25zdCBpdGVtcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdbY2xhc3MqPVwiZGF0YVNvdXJjZUl0ZW1cIl0nKVxuICAgICAgZXhwZWN0KGl0ZW1zLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2hhbmdlIHdoZW4gYSB0eXBlIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RGF0YVNvdXJjZVR5cGVTZWxlY3RvciB7Li4uZGVmYXVsdFNlbGVjdG9yUHJvcHN9IG9uQ2hhbmdlPXtvbkNoYW5nZX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmRhdGFTb3VyY2VUeXBlLm5vdGlvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoRGF0YVNvdXJjZVR5cGUuTk9USU9OKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbGVhclByZXZpZXdzIHdoZW4gYSB0eXBlIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNsZWFyUHJldmlld3MgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPERhdGFTb3VyY2VUeXBlU2VsZWN0b3Igey4uLmRlZmF1bHRTZWxlY3RvclByb3BzfSBvbkNsZWFyUHJldmlld3M9e29uQ2xlYXJQcmV2aWV3c30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmRhdGFTb3VyY2VUeXBlLndlYicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNsZWFyUHJldmlld3MpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKERhdGFTb3VyY2VUeXBlLldFQilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNoYW5nZSB3aGVuIGRpc2FibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25DaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPERhdGFTb3VyY2VUeXBlU2VsZWN0b3Igey4uLmRlZmF1bHRTZWxlY3RvclByb3BzfSBkaXNhYmxlZCBvbkNoYW5nZT17b25DaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5kYXRhU291cmNlVHlwZS5ub3Rpb24nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25DaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNsZWFyUHJldmlld3Mgd2hlbiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2xlYXJQcmV2aWV3cyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8RGF0YVNvdXJjZVR5cGVTZWxlY3RvciB7Li4uZGVmYXVsdFNlbGVjdG9yUHJvcHN9IGRpc2FibGVkIG9uQ2xlYXJQcmV2aWV3cz17b25DbGVhclByZXZpZXdzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZGF0YVNvdXJjZVR5cGUubm90aW9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2xlYXJQcmV2aWV3cykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE5leHRTdGVwQnV0dG9uIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnTmV4dFN0ZXBCdXR0b24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggY29ycmVjdCBsYWJlbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8TmV4dFN0ZXBCdXR0b24gZGlzYWJsZWQ9e2ZhbHNlfSBvbkNsaWNrPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aCBhcnJvdyBpY29uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TmV4dFN0ZXBCdXR0b24gZGlzYWJsZWQ9e2ZhbHNlfSBvbkNsaWNrPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBzdmdJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICBleHBlY3Qoc3ZnSWNvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgZGlzYWJsZWQgd2hlbiBkaXNhYmxlZCBwcm9wIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPE5leHRTdGVwQnV0dG9uIGRpc2FibGVkIG9uQ2xpY2s9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBiZSBlbmFibGVkIHdoZW4gZGlzYWJsZWQgcHJvcCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8TmV4dFN0ZXBCdXR0b24gZGlzYWJsZWQ9e2ZhbHNlfSBvbkNsaWNrPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbGljayB3aGVuIGNsaWNrZWQgYW5kIG5vdCBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ2xpY2sgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPE5leHRTdGVwQnV0dG9uIGRpc2FibGVkPXtmYWxzZX0gb25DbGljaz17b25DbGlja30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNsaWNrIHdoZW4gY2xpY2tlZCBhbmQgZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBvbkNsaWNrID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxOZXh0U3RlcEJ1dHRvbiBkaXNhYmxlZCBvbkNsaWNrPXtvbkNsaWNrfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uQ2xpY2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQcmV2aWV3UGFuZWwgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdQcmV2aWV3UGFuZWwnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcmV2aWV3UHJvcHMgPSB7XG4gICAgY3VycmVudEZpbGU6IHVuZGVmaW5lZCBhcyBGaWxlIHwgdW5kZWZpbmVkLFxuICAgIGN1cnJlbnROb3Rpb25QYWdlOiB1bmRlZmluZWQgYXMgTm90aW9uUGFnZSB8IHVuZGVmaW5lZCxcbiAgICBjdXJyZW50V2Vic2l0ZTogdW5kZWZpbmVkIGFzIENyYXdsUmVzdWx0SXRlbSB8IHVuZGVmaW5lZCxcbiAgICBub3Rpb25DcmVkZW50aWFsSWQ6ICdjcmVkLTEnLFxuICAgIGlzU2hvd1BsYW5VcGdyYWRlTW9kYWw6IGZhbHNlLFxuICAgIGhpZGVGaWxlUHJldmlldzogdmkuZm4oKSxcbiAgICBoaWRlTm90aW9uUGFnZVByZXZpZXc6IHZpLmZuKCksXG4gICAgaGlkZVdlYnNpdGVQcmV2aWV3OiB2aS5mbigpLFxuICAgIGhpZGVQbGFuVXBncmFkZU1vZGFsOiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29uZGl0aW9uYWwgUmVuZGVyaW5nIFRlc3RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDb25kaXRpb25hbCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIEZpbGVQcmV2aWV3IHdoZW4gY3VycmVudEZpbGUgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxQcmV2aWV3UGFuZWwgey4uLmRlZmF1bHRQcmV2aWV3UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZmlsZS1wcmV2aWV3JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEZpbGVQcmV2aWV3IHdoZW4gY3VycmVudEZpbGUgaXMgZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShbJ3Rlc3QnXSwgJ3Rlc3QudHh0JylcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByZXZpZXdQcm9wc30gY3VycmVudEZpbGU9e2ZpbGV9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtcHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBOb3Rpb25QYWdlUHJldmlldyB3aGVuIGN1cnJlbnROb3Rpb25QYWdlIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UHJldmlld1BhbmVsIHsuLi5kZWZhdWx0UHJldmlld1Byb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ25vdGlvbi1wYWdlLXByZXZpZXcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTm90aW9uUGFnZVByZXZpZXcgd2hlbiBjdXJyZW50Tm90aW9uUGFnZSBpcyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByZXZpZXdQcm9wc30gY3VycmVudE5vdGlvblBhZ2U9e3BhZ2V9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ25vdGlvbi1wYWdlLXByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgV2Vic2l0ZVByZXZpZXcgd2hlbiBjdXJyZW50V2Vic2l0ZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByZXZpZXdQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIHBhZ2VQcmV2aWV3IGlzIHRoZSB0aXRsZSBzaG93biBpbiBXZWJzaXRlUHJldmlld1xuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUucGFnZVByZXZpZXcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgV2Vic2l0ZVByZXZpZXcgd2hlbiBjdXJyZW50V2Vic2l0ZSBpcyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgd2Vic2l0ZSA9IGNyZWF0ZU1vY2tDcmF3bFJlc3VsdCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQcmV2aWV3UGFuZWwgey4uLmRlZmF1bHRQcmV2aWV3UHJvcHN9IGN1cnJlbnRXZWJzaXRlPXt3ZWJzaXRlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQ2hlY2sgZm9yIHRoZSBwcmV2aWV3IHRpdGxlIGFuZCBzb3VyY2UgVVJMXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUucGFnZVByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQod2Vic2l0ZS5zb3VyY2VfdXJsKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgUGxhblVwZ3JhZGVNb2RhbCB3aGVuIGlzU2hvd1BsYW5VcGdyYWRlTW9kYWwgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByZXZpZXdQcm9wc30gaXNTaG93UGxhblVwZ3JhZGVNb2RhbD17ZmFsc2V9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncGxhbi11cGdyYWRlLW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFBsYW5VcGdyYWRlTW9kYWwgd2hlbiBpc1Nob3dQbGFuVXBncmFkZU1vZGFsIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByZXZpZXdQcm9wc30gaXNTaG93UGxhblVwZ3JhZGVNb2RhbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbGFuLXVwZ3JhZGUtbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gRXZlbnQgSGFuZGxlciBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnRXZlbnQgSGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhpZGVGaWxlUHJldmlldyB3aGVuIGZpbGUgcHJldmlldyBjbG9zZSBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGlkZUZpbGVQcmV2aWV3ID0gdmkuZm4oKVxuICAgICAgY29uc3QgZmlsZSA9IG5ldyBGaWxlKFsndGVzdCddLCAndGVzdC50eHQnKVxuICAgICAgcmVuZGVyKDxQcmV2aWV3UGFuZWwgey4uLmRlZmF1bHRQcmV2aWV3UHJvcHN9IGN1cnJlbnRGaWxlPXtmaWxlfSBoaWRlRmlsZVByZXZpZXc9e2hpZGVGaWxlUHJldmlld30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaGlkZS1maWxlLXByZXZpZXcnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGlkZUZpbGVQcmV2aWV3KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhpZGVOb3Rpb25QYWdlUHJldmlldyB3aGVuIG5vdGlvbiBwcmV2aWV3IGNsb3NlIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoaWRlTm90aW9uUGFnZVByZXZpZXcgPSB2aS5mbigpXG4gICAgICBjb25zdCBwYWdlID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoKVxuICAgICAgcmVuZGVyKDxQcmV2aWV3UGFuZWwgey4uLmRlZmF1bHRQcmV2aWV3UHJvcHN9IGN1cnJlbnROb3Rpb25QYWdlPXtwYWdlfSBoaWRlTm90aW9uUGFnZVByZXZpZXc9e2hpZGVOb3Rpb25QYWdlUHJldmlld30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaGlkZS1ub3Rpb24tcHJldmlldycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoaWRlTm90aW9uUGFnZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGlkZVdlYnNpdGVQcmV2aWV3IHdoZW4gd2Vic2l0ZSBwcmV2aWV3IGNsb3NlIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBoaWRlV2Vic2l0ZVByZXZpZXcgPSB2aS5mbigpXG4gICAgICBjb25zdCB3ZWJzaXRlID0gY3JlYXRlTW9ja0NyYXdsUmVzdWx0KClcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByZXZpZXdQcm9wc30gY3VycmVudFdlYnNpdGU9e3dlYnNpdGV9IGhpZGVXZWJzaXRlUHJldmlldz17aGlkZVdlYnNpdGVQcmV2aWV3fSAvPilcblxuICAgICAgLy8gQWN0IC0gRmluZCB0aGUgY2xvc2UgYnV0dG9uIChkaXYgd2l0aCBjdXJzb3ItcG9pbnRlciBjbGFzcyBjb250YWluaW5nIHRoZSBYTWFya0ljb24pXG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3Vyc29yLXBvaW50ZXInKVxuICAgICAgZXhwZWN0KGNsb3NlQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soY2xvc2VCdXR0b24hKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChoaWRlV2Vic2l0ZVByZXZpZXcpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGlkZVBsYW5VcGdyYWRlTW9kYWwgd2hlbiBtb2RhbCBjbG9zZSBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaGlkZVBsYW5VcGdyYWRlTW9kYWwgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByZXZpZXdQcm9wc30gaXNTaG93UGxhblVwZ3JhZGVNb2RhbCBoaWRlUGxhblVwZ3JhZGVNb2RhbD17aGlkZVBsYW5VcGdyYWRlTW9kYWx9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nsb3NlLXVwZ3JhZGUtbW9kYWwnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoaGlkZVBsYW5VcGdyYWRlTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFN0ZXBPbmUgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdTdGVwT25lJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrRGF0YXNldERldGFpbCA9IHVuZGVmaW5lZFxuICAgIG1vY2tQbGFuID0ge1xuICAgICAgdHlwZTogUGxhbi5wcm9mZXNzaW9uYWwsXG4gICAgICB1c2FnZTogeyB2ZWN0b3JTcGFjZTogNTAsIGJ1aWxkQXBwczogMCwgZG9jdW1lbnRzVXBsb2FkUXVvdGE6IDAsIHZlY3RvclN0b3JhZ2VRdW90YTogMCB9LFxuICAgICAgdG90YWw6IHsgdmVjdG9yU3BhY2U6IDEwMCwgYnVpbGRBcHBzOiAwLCBkb2N1bWVudHNVcGxvYWRRdW90YTogMCwgdmVjdG9yU3RvcmFnZVF1b3RhOiAwIH0sXG4gICAgfVxuICAgIG1vY2tFbmFibGVCaWxsaW5nID0gZmFsc2VcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcHMub25lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRGF0YVNvdXJjZVR5cGVTZWxlY3RvciB3aGVuIG5vdCBlZGl0aW5nIGV4aXN0aW5nIGRhdGFzZXQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmRhdGFTb3VyY2VUeXBlLmZpbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBGaWxlVXBsb2FkZXIgd2hlbiBkYXRhU291cmNlVHlwZSBpcyBGSUxFJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGRhdGFTb3VyY2VUeXBlPXtEYXRhU291cmNlVHlwZS5GSUxFfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLXVwbG9hZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTm90aW9uQ29ubmVjdG9yIHdoZW4gZGF0YVNvdXJjZVR5cGUgaXMgTk9USU9OIGFuZCBub3QgYXV0aGVudGljYXRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBkYXRhU291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuTk9USU9OfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTm90aW9uQ29ubmVjdG9yIHNob3dzIHN5bmMgdGl0bGUgYW5kIGNvbm5lY3QgYnV0dG9uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUubm90aW9uU3luY1RpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5jb25uZWN0L2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTm90aW9uUGFnZVNlbGVjdG9yIHdoZW4gZGF0YVNvdXJjZVR5cGUgaXMgTk9USU9OIGFuZCBhdXRoZW50aWNhdGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgYXV0aGVkRGF0YVNvdXJjZUxpc3QgPSBbY3JlYXRlTW9ja0RhdGFTb3VyY2VBdXRoKCldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGRhdGFTb3VyY2VUeXBlPXtEYXRhU291cmNlVHlwZS5OT1RJT059IGF1dGhlZERhdGFTb3VyY2VMaXN0PXthdXRoZWREYXRhU291cmNlTGlzdH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbm90aW9uLXBhZ2Utc2VsZWN0b3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBXZWJzaXRlIHdoZW4gZGF0YVNvdXJjZVR5cGUgaXMgV0VCJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGRhdGFTb3VyY2VUeXBlPXtEYXRhU291cmNlVHlwZS5XRUJ9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3dlYnNpdGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlbXB0eSBkYXRhc2V0IGNyZWF0aW9uIGxpbmsgd2hlbiBubyBkYXRhc2V0SWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmVtcHR5RGF0YXNldENyZWF0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIGVtcHR5IGRhdGFzZXQgY3JlYXRpb24gbGluayB3aGVuIGRhdGFzZXRJZCBleGlzdHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gZGF0YXNldElkPVwiZGF0YXNldC0xMjNcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5lbXB0eURhdGFzZXRDcmVhdGlvbicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJvcHMgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBmaWxlcyB0byBGaWxlVXBsb2FkZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBmaWxlcyA9IFtjcmVhdGVNb2NrRmlsZUl0ZW0oKV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gZmlsZXM9e2ZpbGVzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2V0dGluZyB3aGVuIE5vdGlvbkNvbm5lY3RvciBjb25uZWN0IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TZXR0aW5nID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGRhdGFTb3VyY2VUeXBlPXtEYXRhU291cmNlVHlwZS5OT1RJT059IG9uU2V0dGluZz17b25TZXR0aW5nfSAvPilcblxuICAgICAgLy8gQWN0IC0gVGhlIE5vdGlvbkNvbm5lY3RvcidzIGJ1dHRvbiBjYWxscyBvblNldHRpbmdcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5jb25uZWN0L2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG9uU2V0dGluZykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBjaGFuZ2VUeXBlIHdoZW4gZGF0YSBzb3VyY2UgdHlwZSBpcyBjaGFuZ2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2hhbmdlVHlwZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBjaGFuZ2VUeXBlPXtjaGFuZ2VUeXBlfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZGF0YVNvdXJjZVR5cGUubm90aW9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNoYW5nZVR5cGUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKERhdGFTb3VyY2VUeXBlLk5PVElPTilcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFN0YXRlIE1hbmFnZW1lbnQgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIGVtcHR5IGRhdGFzZXQgbW9kYWwgd2hlbiBsaW5rIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmVtcHR5RGF0YXNldENyZWF0aW9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZW1wdHktZGF0YXNldC1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xvc2UgZW1wdHkgZGF0YXNldCBtb2RhbCB3aGVuIGNsb3NlIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuZW1wdHlEYXRhc2V0Q3JlYXRpb24nKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1tb2RhbCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZW1wdHktZGF0YXNldC1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IGNvbXB1dGUgaXNOb3Rpb25BdXRoZWQgYmFzZWQgb24gYXV0aGVkRGF0YVNvdXJjZUxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gTm8gYXV0aFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGRhdGFTb3VyY2VUeXBlPXtEYXRhU291cmNlVHlwZS5OT1RJT059IC8+KVxuICAgICAgLy8gTm90aW9uQ29ubmVjdG9yIHNob3dzIHRoZSBzeW5jIHRpdGxlIHdoZW4gbm90IGF1dGhlbnRpY2F0ZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5ub3Rpb25TeW5jVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBBZGQgYXV0aFxuICAgICAgY29uc3QgYXV0aGVkRGF0YVNvdXJjZUxpc3QgPSBbY3JlYXRlTW9ja0RhdGFTb3VyY2VBdXRoKCldXG4gICAgICByZXJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBkYXRhU291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuTk9USU9OfSBhdXRoZWREYXRhU291cmNlTGlzdD17YXV0aGVkRGF0YVNvdXJjZUxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ25vdGlvbi1wYWdlLXNlbGVjdG9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgY29tcHV0ZSBmaWxlTmV4dERpc2FibGVkIHdoZW4gZmlsZXMgYXJlIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGVzPXtbXX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEJ1dHRvbiBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgY29tcHV0ZSBmaWxlTmV4dERpc2FibGVkIHdoZW4gZmlsZXMgYXJlIGxvYWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGZpbGVzID0gW2NyZWF0ZU1vY2tGaWxlSXRlbSgpXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBmaWxlcz17ZmlsZXN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBCdXR0b24gc2hvdWxkIGJlIGVuYWJsZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IGNvbXB1dGUgZmlsZU5leHREaXNhYmxlZCB3aGVuIHNvbWUgZmlsZXMgYXJlIG5vdCB1cGxvYWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBDcmVhdGUgYSBmaWxlIGl0ZW0gd2l0aG91dCBpZCAobm90IHlldCB1cGxvYWRlZClcbiAgICAgIGNvbnN0IGZpbGUgPSBuZXcgRmlsZShbJ3Rlc3QnXSwgJ3Rlc3QudHh0JywgeyB0eXBlOiAndGV4dC9wbGFpbicgfSlcbiAgICAgIGNvbnN0IGZpbGVJdGVtOiBGaWxlSXRlbSA9IHtcbiAgICAgICAgZmlsZUlEOiAndGVtcC1pZCcsXG4gICAgICAgIGZpbGU6IE9iamVjdC5hc3NpZ24oZmlsZSwgeyBpZDogdW5kZWZpbmVkLCBleHRlbnNpb246ICd0eHQnLCBtaW1lX3R5cGU6ICd0ZXh0L3BsYWluJyB9KSxcbiAgICAgICAgcHJvZ3Jlc3M6IDAsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGVzPXtbZmlsZUl0ZW1dfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ2FsbGJhY2sgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdGVwQ2hhbmdlIHdoZW4gbmV4dCBidXR0b24gaXMgY2xpY2tlZCB3aXRoIHZhbGlkIGZpbGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgb25TdGVwQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZmlsZXMgPSBbY3JlYXRlTW9ja0ZpbGVJdGVtKCldXG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gZmlsZXM9e2ZpbGVzfSBvblN0ZXBDaGFuZ2U9e29uU3RlcENoYW5nZX0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvblN0ZXBDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgcGxhbiB1cGdyYWRlIG1vZGFsIHdoZW4gYmF0Y2ggdXBsb2FkIG5vdCBzdXBwb3J0ZWQgYW5kIG11bHRpcGxlIGZpbGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0VuYWJsZUJpbGxpbmcgPSB0cnVlXG4gICAgICBtb2NrUGxhbi50eXBlID0gUGxhbi5zYW5kYm94XG4gICAgICBjb25zdCBmaWxlcyA9IFtjcmVhdGVNb2NrRmlsZUl0ZW0oKSwgY3JlYXRlTW9ja0ZpbGVJdGVtKCldXG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gZmlsZXM9e2ZpbGVzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGxhbi11cGdyYWRlLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHVwZ3JhZGUgY2FyZCB3aGVuIGluIHNhbmRib3ggcGxhbiB3aXRoIGZpbGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0VuYWJsZUJpbGxpbmcgPSB0cnVlXG4gICAgICBtb2NrUGxhbi50eXBlID0gUGxhbi5zYW5kYm94XG4gICAgICBjb25zdCBmaWxlcyA9IFtjcmVhdGVNb2NrRmlsZUl0ZW0oKV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gZmlsZXM9e2ZpbGVzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd1cGdyYWRlLWNhcmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gVmVjdG9yIFNwYWNlIEZ1bGwgVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1ZlY3RvciBTcGFjZSBGdWxsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBWZWN0b3JTcGFjZUZ1bGwgd2hlbiB2ZWN0b3Igc3BhY2UgaXMgZnVsbCBhbmQgYmlsbGluZyBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0VuYWJsZUJpbGxpbmcgPSB0cnVlXG4gICAgICBtb2NrUGxhbi51c2FnZS52ZWN0b3JTcGFjZSA9IDEwMFxuICAgICAgbW9ja1BsYW4udG90YWwudmVjdG9yU3BhY2UgPSAxMDBcbiAgICAgIGNvbnN0IGZpbGVzID0gW2NyZWF0ZU1vY2tGaWxlSXRlbSgpXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBmaWxlcz17ZmlsZXN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlY3Rvci1zcGFjZS1mdWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIG5leHQgYnV0dG9uIHdoZW4gdmVjdG9yIHNwYWNlIGlzIGZ1bGwnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRW5hYmxlQmlsbGluZyA9IHRydWVcbiAgICAgIG1vY2tQbGFuLnVzYWdlLnZlY3RvclNwYWNlID0gMTAwXG4gICAgICBtb2NrUGxhbi50b3RhbC52ZWN0b3JTcGFjZSA9IDEwMFxuICAgICAgY29uc3QgZmlsZXMgPSBbY3JlYXRlTW9ja0ZpbGVJdGVtKCldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGVzPXtmaWxlc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUHJldmlldyBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUHJldmlldyBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgZmlsZSBwcmV2aWV3IHdoZW4gZmlsZSBwcmV2aWV3IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctZmlsZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtcHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBmaWxlIHByZXZpZXcgd2hlbiBoaWRlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJldmlldy1maWxlJykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaGlkZS1maWxlLXByZXZpZXcnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2ZpbGUtcHJldmlldycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbm90aW9uIHBhZ2UgcHJldmlldyB3aGVuIHByZXZpZXcgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBhdXRoZWREYXRhU291cmNlTGlzdCA9IFtjcmVhdGVNb2NrRGF0YVNvdXJjZUF1dGgoKV1cbiAgICAgIHJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBkYXRhU291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuTk9USU9OfSBhdXRoZWREYXRhU291cmNlTGlzdD17YXV0aGVkRGF0YVNvdXJjZUxpc3R9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctbm90aW9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbm90aW9uLXBhZ2UtcHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB3ZWJzaXRlIHByZXZpZXcgd2hlbiBwcmV2aWV3IGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGRhdGFTb3VyY2VUeXBlPXtEYXRhU291cmNlVHlwZS5XRUJ9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctd2Vic2l0ZScpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBDaGVjayBmb3IgcGFnZVByZXZpZXcgdGl0bGUgd2hpY2ggaXMgc2hvd24gYnkgV2Vic2l0ZVByZXZpZXdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5wYWdlUHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFZGdlIENhc2VzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IG5vdGlvblBhZ2VzIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgYXV0aGVkRGF0YVNvdXJjZUxpc3QgPSBbY3JlYXRlTW9ja0RhdGFTb3VyY2VBdXRoKCldXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxTdGVwT25lIHsuLi5kZWZhdWx0UHJvcHN9IGRhdGFTb3VyY2VUeXBlPXtEYXRhU291cmNlVHlwZS5OT1RJT059IG5vdGlvblBhZ2VzPXtbXX0gYXV0aGVkRGF0YVNvdXJjZUxpc3Q9e2F1dGhlZERhdGFTb3VyY2VMaXN0fSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZCB3aGVuIG5vIHBhZ2VzIHNlbGVjdGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvZGF0YXNldENyZWF0aW9uLnN0ZXBPbmUuYnV0dG9uL2kgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHdlYnNpdGVQYWdlcyBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBkYXRhU291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuV0VCfSB3ZWJzaXRlUGFnZXM9e1tdfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZCB3aGVuIG5vIHBhZ2VzIGNyYXdsZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgYXV0aGVkRGF0YVNvdXJjZUxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gZGF0YVNvdXJjZVR5cGU9e0RhdGFTb3VyY2VUeXBlLk5PVElPTn0gYXV0aGVkRGF0YVNvdXJjZUxpc3Q9e1tdfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHNob3cgTm90aW9uQ29ubmVjdG9yIHdpdGggY29ubmVjdCBidXR0b25cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5ub3Rpb25TeW5jVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhdXRoZWREYXRhU291cmNlTGlzdCB3aXRob3V0IG5vdGlvbiBjcmVkZW50aWFscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGF1dGhlZERhdGFTb3VyY2VMaXN0ID0gW2NyZWF0ZU1vY2tEYXRhU291cmNlQXV0aCh7IGNyZWRlbnRpYWxzX2xpc3Q6IFtdIH0pXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBkYXRhU291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuTk9USU9OfSBhdXRoZWREYXRhU291cmNlTGlzdD17YXV0aGVkRGF0YVNvdXJjZUxpc3R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBOb3Rpb25Db25uZWN0b3Igd2l0aCBjb25uZWN0IGJ1dHRvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLm5vdGlvblN5bmNUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2xlYXIgcHJldmlld3Mgd2hlbiBzd2l0Y2hpbmcgZGF0YSBzb3VyY2UgdHlwZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPFN0ZXBPbmUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwcmV2aWV3LWZpbGUnKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtcHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIENoYW5nZSB0byBOT1RJT05cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5kYXRhU291cmNlVHlwZS5ub3Rpb24nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gRmlsZSBwcmV2aWV3IHNob3VsZCBiZSBjbGVhcmVkXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2ZpbGUtcHJldmlldycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29tcGxldGUgZmlsZSB1cGxvYWQgZmxvdycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uU3RlcENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGZpbGVzID0gW2NyZWF0ZU1vY2tGaWxlSXRlbSgpXVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8U3RlcE9uZSB7Li4uZGVmYXVsdFByb3BzfSBmaWxlcz17ZmlsZXN9IG9uU3RlcENoYW5nZT17b25TdGVwQ2hhbmdlfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25TdGVwQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wbGV0ZSBub3Rpb24gcGFnZSBzZWxlY3Rpb24gZmxvdycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uU3RlcENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGF1dGhlZERhdGFTb3VyY2VMaXN0ID0gW2NyZWF0ZU1vY2tEYXRhU291cmNlQXV0aCgpXVxuICAgICAgY29uc3Qgbm90aW9uUGFnZXMgPSBbY3JlYXRlTW9ja05vdGlvblBhZ2UoKV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTdGVwT25lXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBkYXRhU291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuTk9USU9OfVxuICAgICAgICAgIGF1dGhlZERhdGFTb3VyY2VMaXN0PXthdXRoZWREYXRhU291cmNlTGlzdH1cbiAgICAgICAgICBub3Rpb25QYWdlcz17bm90aW9uUGFnZXN9XG4gICAgICAgICAgb25TdGVwQ2hhbmdlPXtvblN0ZXBDaGFuZ2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2RhdGFzZXRDcmVhdGlvbi5zdGVwT25lLmJ1dHRvbi9pIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvblN0ZXBDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIHdlYnNpdGUgY3Jhd2wgZmxvdycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uU3RlcENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHdlYnNpdGVQYWdlcyA9IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHQoKV1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxTdGVwT25lXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBkYXRhU291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuV0VCfVxuICAgICAgICAgIHdlYnNpdGVQYWdlcz17d2Vic2l0ZVBhZ2VzfVxuICAgICAgICAgIG9uU3RlcENoYW5nZT17b25TdGVwQ2hhbmdlfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9kYXRhc2V0Q3JlYXRpb24uc3RlcE9uZS5idXR0b24vaSB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qob25TdGVwQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==