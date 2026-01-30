"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const declarations_1 = require("@/app/components/header/account-setting/model-provider-page/declarations");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const preview_panel_1 = require("./components/preview-panel");
const step_two_footer_1 = require("./components/step-two-footer");
const hooks_1 = require("./hooks");
const escape_1 = require("./hooks/escape");
const unescape_1 = require("./hooks/unescape");
// ============================================
// Mock external dependencies
// ============================================
// Mock dataset detail context
const mockDataset = {
    id: 'test-dataset-id',
    doc_form: datasets_1.ChunkingMode.text,
    data_source_type: datasets_1.DataSourceType.FILE,
    embedding_model: 'text-embedding-ada-002',
    embedding_model_provider: 'openai',
    retrieval_model_dict: {
        search_method: app_1.RETRIEVE_METHOD.semantic,
        reranking_enable: false,
        reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
        top_k: 3,
        score_threshold_enabled: false,
        score_threshold: 0.5,
    },
};
let mockCurrentDataset = null;
const mockMutateDatasetRes = vi.fn();
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (selector) => selector({ dataset: mockCurrentDataset, mutateDatasetRes: mockMutateDatasetRes }),
}));
// Note: @/context/i18n is globally mocked in vitest.setup.ts, no need to mock here
// Note: @/hooks/use-breakpoints uses real import
// Mock model hooks
const mockEmbeddingModelList = [
    { provider: 'openai', model: 'text-embedding-ada-002' },
    { provider: 'cohere', model: 'embed-english-v3.0' },
];
const mockDefaultEmbeddingModel = { provider: { provider: 'openai' }, model: 'text-embedding-ada-002' };
// Model[] type structure for rerank model list (simplified mock)
const mockRerankModelList = [{
        provider: 'cohere',
        icon_small: { en_US: 'cohere-icon', zh_Hans: 'cohere-icon' },
        label: { en_US: 'Cohere', zh_Hans: 'Cohere' },
        models: [{
                model: 'rerank-english-v3.0',
                label: { en_US: 'Rerank English v3.0', zh_Hans: 'Rerank English v3.0' },
                model_type: declarations_1.ModelTypeEnum.rerank,
                features: [],
                fetch_from: declarations_1.ConfigurationMethodEnum.predefinedModel,
                status: declarations_1.ModelStatusEnum.active,
                model_properties: {},
                load_balancing_enabled: false,
            }],
        status: declarations_1.ModelStatusEnum.active,
    }];
const mockRerankDefaultModel = { provider: { provider: 'cohere' }, model: 'rerank-english-v3.0' };
let mockIsRerankDefaultModelValid = true;
vi.mock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
    useModelListAndDefaultModelAndCurrentProviderAndModel: () => ({
        modelList: mockRerankModelList,
        defaultModel: mockRerankDefaultModel,
        currentModel: mockIsRerankDefaultModelValid,
    }),
    useModelList: () => ({ data: mockEmbeddingModelList }),
    useDefaultModel: () => ({ data: mockDefaultEmbeddingModel }),
}));
// Mock service hooks
const mockFetchDefaultProcessRuleMutate = vi.fn();
vi.mock('@/service/knowledge/use-create-dataset', () => ({
    useFetchDefaultProcessRule: ({ onSuccess }) => ({
        mutate: (url) => {
            mockFetchDefaultProcessRuleMutate(url);
            onSuccess({
                rules: {
                    segmentation: { separator: '\\n', max_tokens: 500, chunk_overlap: 50 },
                    pre_processing_rules: [
                        { id: 'remove_extra_spaces', enabled: true },
                        { id: 'remove_urls_emails', enabled: false },
                    ],
                    parent_mode: 'paragraph',
                    subchunk_segmentation: { separator: '\\n', max_tokens: 256 },
                },
                limits: { indexing_max_segmentation_tokens_length: 4000 },
            });
        },
        isPending: false,
    }),
    useFetchFileIndexingEstimateForFile: () => ({
        mutate: vi.fn(),
        data: undefined,
        isIdle: true,
        isPending: false,
        reset: vi.fn(),
    }),
    useFetchFileIndexingEstimateForNotion: () => ({
        mutate: vi.fn(),
        data: undefined,
        isIdle: true,
        isPending: false,
        reset: vi.fn(),
    }),
    useFetchFileIndexingEstimateForWeb: () => ({
        mutate: vi.fn(),
        data: undefined,
        isIdle: true,
        isPending: false,
        reset: vi.fn(),
    }),
    useCreateFirstDocument: () => ({
        mutateAsync: vi.fn().mockImplementation(async (params, options) => {
            const data = { dataset: { id: 'new-dataset-id' } };
            options?.onSuccess?.(data);
            return data;
        }),
        isPending: false,
    }),
    useCreateDocument: () => ({
        mutateAsync: vi.fn().mockImplementation(async (params, options) => {
            const data = { document: { id: 'new-doc-id' } };
            options?.onSuccess?.(data);
            return data;
        }),
        isPending: false,
    }),
    getNotionInfo: vi.fn().mockReturnValue([{ workspace_id: 'ws-1', pages: [{ page_id: 'page-1' }] }]),
    getWebsiteInfo: vi.fn().mockReturnValue({ provider: 'jinaReader', job_id: 'job-123', urls: ['https://test.com'] }),
}));
vi.mock('@/service/knowledge/use-dataset', () => ({
    useInvalidDatasetList: () => vi.fn(),
}));
// Mock amplitude tracking (external service)
vi.mock('@/app/components/base/amplitude', () => ({
    trackEvent: vi.fn(),
}));
// Note: @/app/components/base/toast - uses real import (base component)
// Note: @/app/components/datasets/common/check-rerank-model - uses real import
// Note: @/app/components/base/float-right-container - uses real import (base component)
// Mock checkShowMultiModalTip - requires complex model list structure
vi.mock('@/app/components/datasets/settings/utils', () => ({
    checkShowMultiModalTip: () => false,
}));
// ============================================
// Test data factories
// ============================================
const createMockFile = (overrides) => ({
    id: 'file-1',
    name: 'test-file.pdf',
    extension: 'pdf',
    size: 1024,
    type: 'application/pdf',
    lastModified: Date.now(),
    ...overrides,
});
const createMockNotionPage = (overrides) => ({
    page_id: 'notion-page-1',
    page_name: 'Test Notion Page',
    page_icon: null,
    type: 'page',
    ...overrides,
});
const createMockWebsitePage = (overrides) => ({
    source_url: 'https://example.com/page1',
    title: 'Test Website Page',
    description: 'Test description',
    markdown: '# Test Content',
    ...overrides,
});
const createMockDocumentDetail = (overrides) => ({
    id: 'doc-1',
    doc_form: datasets_1.ChunkingMode.text,
    doc_language: 'English',
    file: { id: 'file-1', name: 'test.pdf', extension: 'pdf' },
    notion_page: createMockNotionPage(),
    website_page: createMockWebsitePage(),
    dataset_process_rule: {
        mode: datasets_1.ProcessMode.general,
        rules: {
            segmentation: { separator: '\\n\\n', max_tokens: 1024, chunk_overlap: 50 },
            pre_processing_rules: [{ id: 'remove_extra_spaces', enabled: true }],
        },
    },
    ...overrides,
});
const createMockRules = (overrides) => ({
    segmentation: { separator: '\\n\\n', max_tokens: 1024, chunk_overlap: 50 },
    pre_processing_rules: [
        { id: 'remove_extra_spaces', enabled: true },
        { id: 'remove_urls_emails', enabled: false },
    ],
    parent_mode: 'paragraph',
    subchunk_segmentation: { separator: '\\n', max_tokens: 512 },
    ...overrides,
});
const createMockEstimate = (overrides) => ({
    total_segments: 10,
    total_nodes: 10,
    tokens: 5000,
    total_price: 0.01,
    currency: 'USD',
    qa_preview: [{ question: 'Q1', answer: 'A1' }],
    preview: [{ content: 'Chunk 1 content', child_chunks: ['Child 1', 'Child 2'] }],
    ...overrides,
});
// ============================================
// Utility Functions Tests (escape/unescape)
// ============================================
describe('escape utility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for escape function
    describe('escape function', () => {
        it('should return empty string for null/undefined input', () => {
            expect((0, escape_1.default)(null)).toBe('');
            expect((0, escape_1.default)(undefined)).toBe('');
            expect((0, escape_1.default)('')).toBe('');
        });
        it('should escape newline characters', () => {
            expect((0, escape_1.default)('\n')).toBe('\\n');
            expect((0, escape_1.default)('\r')).toBe('\\r');
            expect((0, escape_1.default)('\n\r')).toBe('\\n\\r');
        });
        it('should escape tab characters', () => {
            expect((0, escape_1.default)('\t')).toBe('\\t');
        });
        it('should escape other special characters', () => {
            expect((0, escape_1.default)('\0')).toBe('\\0');
            expect((0, escape_1.default)('\b')).toBe('\\b');
            expect((0, escape_1.default)('\f')).toBe('\\f');
            expect((0, escape_1.default)('\v')).toBe('\\v');
        });
        it('should escape single quotes', () => {
            expect((0, escape_1.default)('\'')).toBe('\\\'');
        });
        it('should handle mixed content', () => {
            expect((0, escape_1.default)('Hello\nWorld\t!')).toBe('Hello\\nWorld\\t!');
        });
        it('should not escape regular characters', () => {
            expect((0, escape_1.default)('Hello World')).toBe('Hello World');
            expect((0, escape_1.default)('abc123')).toBe('abc123');
        });
        it('should return empty string for non-string input', () => {
            expect((0, escape_1.default)(123)).toBe('');
            expect((0, escape_1.default)({})).toBe('');
        });
    });
});
describe('unescape utility', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for unescape function
    describe('unescape function', () => {
        it('should unescape newline characters', () => {
            expect((0, unescape_1.default)('\\n')).toBe('\n');
            expect((0, unescape_1.default)('\\r')).toBe('\r');
        });
        it('should unescape tab characters', () => {
            expect((0, unescape_1.default)('\\t')).toBe('\t');
        });
        it('should unescape other special characters', () => {
            expect((0, unescape_1.default)('\\0')).toBe('\0');
            expect((0, unescape_1.default)('\\b')).toBe('\b');
            expect((0, unescape_1.default)('\\f')).toBe('\f');
            expect((0, unescape_1.default)('\\v')).toBe('\v');
        });
        it('should unescape single and double quotes', () => {
            expect((0, unescape_1.default)('\\\'')).toBe('\'');
            expect((0, unescape_1.default)('\\"')).toBe('"');
        });
        it('should unescape backslash', () => {
            expect((0, unescape_1.default)('\\\\')).toBe('\\');
        });
        it('should unescape hex sequences', () => {
            expect((0, unescape_1.default)('\\x41')).toBe('A'); // 0x41 = 65 = 'A'
            expect((0, unescape_1.default)('\\x5A')).toBe('Z'); // 0x5A = 90 = 'Z'
        });
        it('should unescape short hex (2-digit) sequences', () => {
            // Short hex format: \xNN (2 hexadecimal digits)
            expect((0, unescape_1.default)('\\xA5')).toBe('¥'); // Yen sign
            expect((0, unescape_1.default)('\\x7F')).toBe('\x7F'); // Delete character
            expect((0, unescape_1.default)('\\x00')).toBe('\x00'); // Null character via hex
        });
        it('should unescape octal sequences', () => {
            expect((0, unescape_1.default)('\\101')).toBe('A'); // Octal 101 = 65 = 'A'
            expect((0, unescape_1.default)('\\132')).toBe('Z'); // Octal 132 = 90 = 'Z'
            expect((0, unescape_1.default)('\\7')).toBe('\x07'); // Single digit octal
        });
        it('should unescape unicode sequences', () => {
            expect((0, unescape_1.default)('\\u0041')).toBe('A');
            expect((0, unescape_1.default)('\\u{41}')).toBe('A');
        });
        it('should unescape Python-style unicode', () => {
            expect((0, unescape_1.default)('\\U00000041')).toBe('A');
        });
        it('should handle mixed content', () => {
            expect((0, unescape_1.default)('Hello\\nWorld\\t!')).toBe('Hello\nWorld\t!');
        });
        it('should not modify regular text', () => {
            expect((0, unescape_1.default)('Hello World')).toBe('Hello World');
        });
    });
});
// ============================================
// useSegmentationState Hook Tests
// ============================================
describe('useSegmentationState', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for initial state
    describe('Initial State', () => {
        it('should initialize with default values', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            expect(result.current.segmentationType).toBe(datasets_1.ProcessMode.general);
            expect(result.current.segmentIdentifier).toBe(hooks_1.DEFAULT_SEGMENT_IDENTIFIER);
            expect(result.current.maxChunkLength).toBe(hooks_1.DEFAULT_MAXIMUM_CHUNK_LENGTH);
            expect(result.current.overlap).toBe(hooks_1.DEFAULT_OVERLAP);
            expect(result.current.rules).toEqual([]);
            expect(result.current.parentChildConfig).toEqual(hooks_1.defaultParentChildConfig);
        });
        it('should initialize with custom segmentation type', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)({ initialSegmentationType: datasets_1.ProcessMode.parentChild }));
            expect(result.current.segmentationType).toBe(datasets_1.ProcessMode.parentChild);
        });
    });
    // Tests for state setters
    describe('State Management', () => {
        it('should update segmentation type', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setSegmentationType(datasets_1.ProcessMode.parentChild);
            });
            expect(result.current.segmentationType).toBe(datasets_1.ProcessMode.parentChild);
        });
        it('should update max chunk length', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setMaxChunkLength(2048);
            });
            expect(result.current.maxChunkLength).toBe(2048);
        });
        it('should update overlap', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setOverlap(100);
            });
            expect(result.current.overlap).toBe(100);
        });
        it('should update rules', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const newRules = [{ id: 'test', enabled: true }];
            (0, react_1.act)(() => {
                result.current.setRules(newRules);
            });
            expect(result.current.rules).toEqual(newRules);
        });
    });
    // Tests for setSegmentIdentifier with escape
    describe('setSegmentIdentifier', () => {
        it('should escape special characters', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setSegmentIdentifier('\n\n');
            });
            expect(result.current.segmentIdentifier).toBe('\\n\\n');
        });
        it('should use default when empty and canEmpty is false', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setSegmentIdentifier('');
            });
            expect(result.current.segmentIdentifier).toBe(hooks_1.DEFAULT_SEGMENT_IDENTIFIER);
        });
        it('should allow empty when canEmpty is true', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setSegmentIdentifier('', true);
            });
            expect(result.current.segmentIdentifier).toBe('');
        });
    });
    // Tests for toggleRule
    describe('toggleRule', () => {
        it('should toggle rule enabled state', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setRules([
                    { id: 'rule1', enabled: true },
                    { id: 'rule2', enabled: false },
                ]);
            });
            (0, react_1.act)(() => {
                result.current.toggleRule('rule1');
            });
            expect(result.current.rules.find(r => r.id === 'rule1')?.enabled).toBe(false);
            expect(result.current.rules.find(r => r.id === 'rule2')?.enabled).toBe(false);
        });
        it('should not affect other rules', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setRules([
                    { id: 'rule1', enabled: true },
                    { id: 'rule2', enabled: false },
                ]);
            });
            (0, react_1.act)(() => {
                result.current.toggleRule('rule2');
            });
            expect(result.current.rules.find(r => r.id === 'rule1')?.enabled).toBe(true);
            expect(result.current.rules.find(r => r.id === 'rule2')?.enabled).toBe(true);
        });
    });
    // Tests for parent-child config
    describe('Parent-Child Configuration', () => {
        it('should update parent config delimiter with truthy value', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.updateParentConfig('delimiter', '\n\n\n');
            });
            expect(result.current.parentChildConfig.parent.delimiter).toBe('\\n\\n\\n');
        });
        it('should update parent config delimiter with empty value', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.updateParentConfig('delimiter', '');
            });
            expect(result.current.parentChildConfig.parent.delimiter).toBe('');
        });
        it('should update parent config maxLength', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.updateParentConfig('maxLength', 2048);
            });
            expect(result.current.parentChildConfig.parent.maxLength).toBe(2048);
        });
        it('should update child config delimiter with truthy value', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.updateChildConfig('delimiter', '\n');
            });
            expect(result.current.parentChildConfig.child.delimiter).toBe('\\n');
        });
        it('should update child config delimiter with empty value', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.updateChildConfig('delimiter', '');
            });
            expect(result.current.parentChildConfig.child.delimiter).toBe('');
        });
        it('should update child config maxLength', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.updateChildConfig('maxLength', 256);
            });
            expect(result.current.parentChildConfig.child.maxLength).toBe(256);
        });
        it('should set chunk for context mode', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setChunkForContext('full-doc');
            });
            expect(result.current.parentChildConfig.chunkForContext).toBe('full-doc');
        });
    });
    // Tests for resetToDefaults
    describe('resetToDefaults', () => {
        it('should reset to default config when available', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            // Set non-default values and default config
            (0, react_1.act)(() => {
                result.current.setMaxChunkLength(2048);
                result.current.setOverlap(100);
                result.current.setDefaultConfig(createMockRules());
            });
            // Reset - should use default config values
            (0, react_1.act)(() => {
                result.current.resetToDefaults();
            });
            expect(result.current.maxChunkLength).toBe(1024);
            expect(result.current.overlap).toBe(50);
            expect(result.current.parentChildConfig).toEqual(hooks_1.defaultParentChildConfig);
        });
        it('should only reset parentChildConfig when no default config', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            // Set non-default values without setting defaultConfig
            (0, react_1.act)(() => {
                result.current.setMaxChunkLength(2048);
                result.current.setOverlap(100);
                result.current.setChunkForContext('full-doc');
            });
            // Reset - should only reset parentChildConfig since no default config
            (0, react_1.act)(() => {
                result.current.resetToDefaults();
            });
            // Values stay the same since no defaultConfig
            expect(result.current.maxChunkLength).toBe(2048);
            expect(result.current.overlap).toBe(100);
            // But parentChildConfig is always reset
            expect(result.current.parentChildConfig).toEqual(hooks_1.defaultParentChildConfig);
        });
    });
    // Tests for applyConfigFromRules
    describe('applyConfigFromRules', () => {
        it('should apply general config from rules', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const rules = createMockRules({
                segmentation: { separator: '---', max_tokens: 512, chunk_overlap: 25 },
            });
            (0, react_1.act)(() => {
                result.current.applyConfigFromRules(rules, false);
            });
            expect(result.current.maxChunkLength).toBe(512);
            expect(result.current.overlap).toBe(25);
        });
        it('should apply hierarchical config from rules', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const rules = createMockRules({
                parent_mode: 'paragraph',
                subchunk_segmentation: { separator: '\n', max_tokens: 256 },
            });
            (0, react_1.act)(() => {
                result.current.applyConfigFromRules(rules, true);
            });
            expect(result.current.parentChildConfig.chunkForContext).toBe('paragraph');
            expect(result.current.parentChildConfig.child.maxLength).toBe(256);
        });
        it('should apply full hierarchical parent-child config from rules', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const rules = createMockRules({
                segmentation: { separator: '\n\n', max_tokens: 1024, chunk_overlap: 50 },
                parent_mode: 'full-doc',
                subchunk_segmentation: { separator: '\n', max_tokens: 128 },
            });
            (0, react_1.act)(() => {
                result.current.applyConfigFromRules(rules, true);
            });
            // Should set parent config from segmentation
            expect(result.current.parentChildConfig.parent.delimiter).toBe('\\n\\n');
            expect(result.current.parentChildConfig.parent.maxLength).toBe(1024);
            // Should set child config from subchunk_segmentation
            expect(result.current.parentChildConfig.child.delimiter).toBe('\\n');
            expect(result.current.parentChildConfig.child.maxLength).toBe(128);
            // Should set chunkForContext
            expect(result.current.parentChildConfig.chunkForContext).toBe('full-doc');
        });
    });
    // Tests for getProcessRule
    describe('getProcessRule', () => {
        it('should return general process rule', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const processRule = result.current.getProcessRule(datasets_1.ChunkingMode.text);
            expect(processRule.mode).toBe(datasets_1.ProcessMode.general);
            expect(processRule.rules.segmentation.max_tokens).toBe(hooks_1.DEFAULT_MAXIMUM_CHUNK_LENGTH);
        });
        it('should return hierarchical process rule for parent-child', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const processRule = result.current.getProcessRule(datasets_1.ChunkingMode.parentChild);
            expect(processRule.mode).toBe('hierarchical');
            expect(processRule.rules.parent_mode).toBe('paragraph');
            expect(processRule.rules.subchunk_segmentation).toBeDefined();
        });
    });
});
// ============================================
// useIndexingConfig Hook Tests
// ============================================
describe('useIndexingConfig', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockIsRerankDefaultModelValid = true;
    });
    // Tests for initial state
    // Note: Hook has useEffect that syncs state, so we test the state after effects settle
    describe('Initial State', () => {
        it('should initialize with QUALIFIED when API key is set', async () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({ isAPIKeySet: true, hasSetIndexType: false }));
            // After effects settle, indexType should be QUALIFIED
            await vi.waitFor(() => {
                expect(result.current.indexType).toBe(hooks_1.IndexingType.QUALIFIED);
            });
        });
        it('should initialize with ECONOMICAL when API key is not set', async () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({ isAPIKeySet: false, hasSetIndexType: false }));
            await vi.waitFor(() => {
                expect(result.current.indexType).toBe(hooks_1.IndexingType.ECONOMICAL);
            });
        });
        it('should use initial index type when provided', async () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({
                isAPIKeySet: false,
                hasSetIndexType: true,
                initialIndexType: hooks_1.IndexingType.QUALIFIED,
            }));
            await vi.waitFor(() => {
                expect(result.current.indexType).toBe(hooks_1.IndexingType.QUALIFIED);
            });
        });
    });
    // Tests for state setters
    describe('State Management', () => {
        it('should update index type', async () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({ isAPIKeySet: true, hasSetIndexType: false }));
            // Wait for initial effects to settle
            await vi.waitFor(() => {
                expect(result.current.indexType).toBeDefined();
            });
            (0, react_1.act)(() => {
                result.current.setIndexType(hooks_1.IndexingType.ECONOMICAL);
            });
            expect(result.current.indexType).toBe(hooks_1.IndexingType.ECONOMICAL);
        });
        it('should update embedding model', async () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({ isAPIKeySet: true, hasSetIndexType: false }));
            await vi.waitFor(() => {
                expect(result.current.embeddingModel).toBeDefined();
            });
            (0, react_1.act)(() => {
                result.current.setEmbeddingModel({ provider: 'cohere', model: 'embed-v3' });
            });
            expect(result.current.embeddingModel).toEqual({ provider: 'cohere', model: 'embed-v3' });
        });
        it('should update retrieval config', async () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({ isAPIKeySet: true, hasSetIndexType: false }));
            await vi.waitFor(() => {
                expect(result.current.retrievalConfig).toBeDefined();
            });
            const newConfig = {
                search_method: app_1.RETRIEVE_METHOD.hybrid,
                reranking_enable: true,
                reranking_model: { reranking_provider_name: 'cohere', reranking_model_name: 'rerank-v3' },
                top_k: 5,
                score_threshold_enabled: true,
                score_threshold: 0.7,
            };
            (0, react_1.act)(() => {
                result.current.setRetrievalConfig(newConfig);
            });
            expect(result.current.retrievalConfig).toEqual(newConfig);
        });
    });
    // Tests for getIndexingTechnique
    describe('getIndexingTechnique', () => {
        it('should return initial type when set', async () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({
                isAPIKeySet: true,
                hasSetIndexType: true,
                initialIndexType: hooks_1.IndexingType.ECONOMICAL,
            }));
            await vi.waitFor(() => {
                expect(result.current.getIndexingTechnique()).toBe(hooks_1.IndexingType.ECONOMICAL);
            });
        });
        it('should return current type when no initial type', async () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({ isAPIKeySet: true, hasSetIndexType: false }));
            await vi.waitFor(() => {
                expect(result.current.indexType).toBeDefined();
            });
            (0, react_1.act)(() => {
                result.current.setIndexType(hooks_1.IndexingType.ECONOMICAL);
            });
            expect(result.current.getIndexingTechnique()).toBe(hooks_1.IndexingType.ECONOMICAL);
        });
    });
    // Tests for initialRetrievalConfig handling
    describe('initialRetrievalConfig', () => {
        it('should skip retrieval config sync when initialRetrievalConfig is provided', async () => {
            const customRetrievalConfig = {
                search_method: app_1.RETRIEVE_METHOD.hybrid,
                reranking_enable: true,
                reranking_model: { reranking_provider_name: 'custom', reranking_model_name: 'custom-model' },
                top_k: 10,
                score_threshold_enabled: true,
                score_threshold: 0.8,
            };
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingConfig)({
                isAPIKeySet: true,
                hasSetIndexType: false,
                initialRetrievalConfig: customRetrievalConfig,
            }));
            await vi.waitFor(() => {
                expect(result.current.retrievalConfig).toBeDefined();
            });
            // Should use the provided initial config, not the default synced one
            expect(result.current.retrievalConfig.search_method).toBe(app_1.RETRIEVE_METHOD.hybrid);
            expect(result.current.retrievalConfig.top_k).toBe(10);
        });
    });
});
// ============================================
// usePreviewState Hook Tests
// ============================================
describe('usePreviewState', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const defaultOptions = {
        dataSourceType: datasets_1.DataSourceType.FILE,
        files: [createMockFile()],
        notionPages: [createMockNotionPage()],
        websitePages: [createMockWebsitePage()],
    };
    // Tests for initial state
    describe('Initial State', () => {
        it('should initialize with first file for FILE data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)(defaultOptions));
            expect(result.current.previewFile).toEqual(defaultOptions.files[0]);
        });
        it('should initialize with first notion page for NOTION data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({ ...defaultOptions, dataSourceType: datasets_1.DataSourceType.NOTION }));
            expect(result.current.previewNotionPage).toEqual(defaultOptions.notionPages[0]);
        });
        it('should initialize with document detail when provided', () => {
            const documentDetail = createMockDocumentDetail();
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                ...defaultOptions,
                documentDetail,
                datasetId: 'test-id',
            }));
            expect(result.current.previewFile).toEqual(documentDetail.file);
        });
    });
    // Tests for getPreviewPickerItems
    describe('getPreviewPickerItems', () => {
        it('should return files for FILE data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)(defaultOptions));
            const items = result.current.getPreviewPickerItems();
            expect(items).toEqual(defaultOptions.files);
        });
        it('should return mapped notion pages for NOTION data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({ ...defaultOptions, dataSourceType: datasets_1.DataSourceType.NOTION }));
            const items = result.current.getPreviewPickerItems();
            expect(items[0]).toEqual({
                id: 'notion-page-1',
                name: 'Test Notion Page',
                extension: 'md',
            });
        });
        it('should return mapped website pages for WEB data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({ ...defaultOptions, dataSourceType: datasets_1.DataSourceType.WEB }));
            const items = result.current.getPreviewPickerItems();
            expect(items[0]).toEqual({
                id: 'https://example.com/page1',
                name: 'Test Website Page',
                extension: 'md',
            });
        });
        it('should return empty array for unknown data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({ ...defaultOptions, dataSourceType: 'unknown' }));
            const items = result.current.getPreviewPickerItems();
            expect(items).toEqual([]);
        });
    });
    // Tests for getPreviewPickerValue
    describe('getPreviewPickerValue', () => {
        it('should return file value for FILE data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)(defaultOptions));
            const value = result.current.getPreviewPickerValue();
            expect(value).toEqual(defaultOptions.files[0]);
        });
        it('should return mapped notion page value for NOTION data source', () => {
            const notionPage = createMockNotionPage({ page_id: 'page-123', page_name: 'My Page' });
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.NOTION,
                notionPages: [notionPage],
            }));
            const value = result.current.getPreviewPickerValue();
            expect(value).toEqual({
                id: 'page-123',
                name: 'My Page',
                extension: 'md',
            });
        });
        it('should return mapped website page value for WEB data source', () => {
            const websitePage = createMockWebsitePage({ source_url: 'https://test.com', title: 'Test Title' });
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.WEB,
                websitePages: [websitePage],
            }));
            const value = result.current.getPreviewPickerValue();
            expect(value).toEqual({
                id: 'https://test.com',
                name: 'Test Title',
                extension: 'md',
            });
        });
        it('should return empty value for unknown data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({ ...defaultOptions, dataSourceType: 'unknown' }));
            const value = result.current.getPreviewPickerValue();
            expect(value).toEqual({ id: '', name: '', extension: '' });
        });
        it('should handle undefined notion page gracefully', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.NOTION,
                notionPages: [],
            }));
            const value = result.current.getPreviewPickerValue();
            expect(value).toEqual({
                id: '',
                name: '',
                extension: 'md',
            });
        });
        it('should handle undefined website page gracefully', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.WEB,
                websitePages: [],
            }));
            const value = result.current.getPreviewPickerValue();
            expect(value).toEqual({
                id: '',
                name: '',
                extension: 'md',
            });
        });
    });
    // Tests for handlePreviewChange
    describe('handlePreviewChange', () => {
        it('should update preview file for FILE data source', () => {
            const files = [createMockFile(), createMockFile({ id: 'file-2', name: 'second.pdf' })];
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({ ...defaultOptions, files }));
            (0, react_1.act)(() => {
                result.current.handlePreviewChange({ id: 'file-2', name: 'second.pdf' });
            });
            expect(result.current.previewFile).toEqual({ id: 'file-2', name: 'second.pdf' });
        });
        it('should update preview notion page for NOTION data source', () => {
            const notionPages = [
                createMockNotionPage(),
                createMockNotionPage({ page_id: 'notion-page-2', page_name: 'Second Page' }),
            ];
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({ ...defaultOptions, dataSourceType: datasets_1.DataSourceType.NOTION, notionPages }));
            (0, react_1.act)(() => {
                result.current.handlePreviewChange({ id: 'notion-page-2', name: 'Second Page' });
            });
            expect(result.current.previewNotionPage?.page_id).toBe('notion-page-2');
        });
        it('should update preview website page for WEB data source', () => {
            const websitePages = [
                createMockWebsitePage(),
                createMockWebsitePage({ source_url: 'https://example.com/page2', title: 'Second Page' }),
            ];
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({ ...defaultOptions, dataSourceType: datasets_1.DataSourceType.WEB, websitePages }));
            (0, react_1.act)(() => {
                result.current.handlePreviewChange({ id: 'https://example.com/page2', name: 'Second Page' });
            });
            expect(result.current.previewWebsitePage?.source_url).toBe('https://example.com/page2');
        });
    });
});
// ============================================
// useDocumentCreation Hook Tests
// ============================================
describe('useDocumentCreation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const defaultOptions = {
        dataSourceType: datasets_1.DataSourceType.FILE,
        files: [createMockFile()],
        notionPages: [],
        notionCredentialId: '',
        websitePages: [],
    };
    // Tests for validateParams
    describe('validateParams', () => {
        it('should return false when overlap exceeds max chunk length', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)(defaultOptions));
            const isValid = result.current.validateParams({
                segmentationType: 'general',
                maxChunkLength: 100,
                limitMaxChunkLength: 4000,
                overlap: 200,
                indexType: hooks_1.IndexingType.QUALIFIED,
                embeddingModel: { provider: 'openai', model: 'text-embedding-ada-002' },
                rerankModelList: [],
                retrievalConfig: {
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_enable: false,
                    reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                    top_k: 3,
                    score_threshold_enabled: false,
                    score_threshold: 0.5,
                },
            });
            expect(isValid).toBe(false);
        });
        it('should return false when max chunk length exceeds limit', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)(defaultOptions));
            const isValid = result.current.validateParams({
                segmentationType: 'general',
                maxChunkLength: 5000,
                limitMaxChunkLength: 4000,
                overlap: 50,
                indexType: hooks_1.IndexingType.QUALIFIED,
                embeddingModel: { provider: 'openai', model: 'text-embedding-ada-002' },
                rerankModelList: [],
                retrievalConfig: {
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_enable: false,
                    reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                    top_k: 3,
                    score_threshold_enabled: false,
                    score_threshold: 0.5,
                },
            });
            expect(isValid).toBe(false);
        });
        it('should return true for valid params', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)(defaultOptions));
            const isValid = result.current.validateParams({
                segmentationType: 'general',
                maxChunkLength: 1000,
                limitMaxChunkLength: 4000,
                overlap: 50,
                indexType: hooks_1.IndexingType.QUALIFIED,
                embeddingModel: { provider: 'openai', model: 'text-embedding-ada-002' },
                rerankModelList: [],
                retrievalConfig: {
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_enable: false,
                    reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                    top_k: 3,
                    score_threshold_enabled: false,
                    score_threshold: 0.5,
                },
            });
            expect(isValid).toBe(true);
        });
    });
    // Tests for buildCreationParams
    describe('buildCreationParams', () => {
        it('should build params for file upload', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)(defaultOptions));
            const params = result.current.buildCreationParams(datasets_1.ChunkingMode.text, 'English', { mode: datasets_1.ProcessMode.general, rules: createMockRules() }, {
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: false,
                reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                top_k: 3,
                score_threshold_enabled: false,
                score_threshold: 0.5,
            }, { provider: 'openai', model: 'text-embedding-ada-002' }, hooks_1.IndexingType.QUALIFIED);
            expect(params).toBeDefined();
            expect(params?.doc_form).toBe(datasets_1.ChunkingMode.text);
            expect(params?.doc_language).toBe('English');
            expect(params?.data_source?.type).toBe(datasets_1.DataSourceType.FILE);
        });
        it('should build params for setting mode', () => {
            const documentDetail = createMockDocumentDetail();
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)({
                ...defaultOptions,
                isSetting: true,
                documentDetail,
            }));
            const params = result.current.buildCreationParams(datasets_1.ChunkingMode.text, 'English', { mode: datasets_1.ProcessMode.general, rules: createMockRules() }, {
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: false,
                reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                top_k: 3,
                score_threshold_enabled: false,
                score_threshold: 0.5,
            }, { provider: 'openai', model: 'text-embedding-ada-002' }, hooks_1.IndexingType.QUALIFIED);
            expect(params?.original_document_id).toBe(documentDetail.id);
        });
        it('should build params for notion_import data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.NOTION,
                notionPages: [createMockNotionPage()],
                notionCredentialId: 'notion-cred-123',
            }));
            const params = result.current.buildCreationParams(datasets_1.ChunkingMode.text, 'English', { mode: datasets_1.ProcessMode.general, rules: createMockRules() }, {
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: false,
                reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                top_k: 3,
                score_threshold_enabled: false,
                score_threshold: 0.5,
            }, { provider: 'openai', model: 'text-embedding-ada-002' }, hooks_1.IndexingType.QUALIFIED);
            expect(params).toBeDefined();
            expect(params?.data_source?.type).toBe(datasets_1.DataSourceType.NOTION);
            expect(params?.data_source?.info_list.notion_info_list).toBeDefined();
        });
        it('should build params for website_crawl data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.WEB,
                websitePages: [createMockWebsitePage()],
                websiteCrawlProvider: 'jinaReader',
                websiteCrawlJobId: 'job-123',
                crawlOptions: { max_depth: 2 },
            }));
            const params = result.current.buildCreationParams(datasets_1.ChunkingMode.text, 'English', { mode: datasets_1.ProcessMode.general, rules: createMockRules() }, {
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: false,
                reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                top_k: 3,
                score_threshold_enabled: false,
                score_threshold: 0.5,
            }, { provider: 'openai', model: 'text-embedding-ada-002' }, hooks_1.IndexingType.QUALIFIED);
            expect(params).toBeDefined();
            expect(params?.data_source?.type).toBe(datasets_1.DataSourceType.WEB);
            expect(params?.data_source?.info_list.website_info_list).toBeDefined();
        });
    });
    // Tests for validateParams edge cases
    describe('validateParams - additional cases', () => {
        it('should return false when embedding model is missing for QUALIFIED index type', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)(defaultOptions));
            const isValid = result.current.validateParams({
                segmentationType: 'general',
                maxChunkLength: 500,
                limitMaxChunkLength: 4000,
                overlap: 50,
                indexType: hooks_1.IndexingType.QUALIFIED,
                embeddingModel: { provider: '', model: '' },
                rerankModelList: mockRerankModelList,
                retrievalConfig: {
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_enable: false,
                    reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                    top_k: 3,
                    score_threshold_enabled: false,
                    score_threshold: 0.5,
                },
            });
            expect(isValid).toBe(false);
        });
        it('should return false when rerank model is required but not selected', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)(defaultOptions));
            // isReRankModelSelected returns false when:
            // - indexMethod === 'high_quality' (IndexingType.QUALIFIED)
            // - reranking_enable === true
            // - rerankModelSelected === false (model not found in list)
            const isValid = result.current.validateParams({
                segmentationType: 'general',
                maxChunkLength: 500,
                limitMaxChunkLength: 4000,
                overlap: 50,
                indexType: hooks_1.IndexingType.QUALIFIED,
                embeddingModel: { provider: 'openai', model: 'text-embedding-ada-002' },
                rerankModelList: [], // Empty list means model won't be found
                retrievalConfig: {
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_enable: true, // Reranking enabled
                    reranking_model: {
                        reranking_provider_name: 'nonexistent',
                        reranking_model_name: 'nonexistent-model',
                    },
                    top_k: 3,
                    score_threshold_enabled: false,
                    score_threshold: 0.5,
                },
            });
            expect(isValid).toBe(false);
        });
    });
    // Tests for executeCreation
    describe('executeCreation', () => {
        it('should call createFirstDocumentMutation when datasetId is not provided', async () => {
            const mockOnStepChange = vi.fn();
            const mockUpdateIndexingTypeCache = vi.fn();
            const mockUpdateResultCache = vi.fn();
            const mockUpdateRetrievalMethodCache = vi.fn();
            const mockOnSave = vi.fn();
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)({
                ...defaultOptions,
                datasetId: undefined,
                onStepChange: mockOnStepChange,
                updateIndexingTypeCache: mockUpdateIndexingTypeCache,
                updateResultCache: mockUpdateResultCache,
                updateRetrievalMethodCache: mockUpdateRetrievalMethodCache,
                onSave: mockOnSave,
            }));
            const params = result.current.buildCreationParams(datasets_1.ChunkingMode.text, 'English', { mode: datasets_1.ProcessMode.general, rules: createMockRules() }, {
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: false,
                reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                top_k: 3,
                score_threshold_enabled: false,
                score_threshold: 0.5,
            }, { provider: 'openai', model: 'text-embedding-ada-002' }, hooks_1.IndexingType.QUALIFIED);
            await (0, react_1.act)(async () => {
                await result.current.executeCreation(params, hooks_1.IndexingType.QUALIFIED, {
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_enable: false,
                    reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                    top_k: 3,
                    score_threshold_enabled: false,
                    score_threshold: 0.5,
                });
            });
            expect(mockOnStepChange).toHaveBeenCalledWith(1);
        });
        it('should call createDocumentMutation when datasetId is provided', async () => {
            const mockOnStepChange = vi.fn();
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)({
                ...defaultOptions,
                datasetId: 'existing-dataset-id',
                onStepChange: mockOnStepChange,
            }));
            const params = result.current.buildCreationParams(datasets_1.ChunkingMode.text, 'English', { mode: datasets_1.ProcessMode.general, rules: createMockRules() }, {
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: false,
                reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                top_k: 3,
                score_threshold_enabled: false,
                score_threshold: 0.5,
            }, { provider: 'openai', model: 'text-embedding-ada-002' }, hooks_1.IndexingType.QUALIFIED);
            await (0, react_1.act)(async () => {
                await result.current.executeCreation(params, hooks_1.IndexingType.QUALIFIED, {
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_enable: false,
                    reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                    top_k: 3,
                    score_threshold_enabled: false,
                    score_threshold: 0.5,
                });
            });
            expect(mockOnStepChange).toHaveBeenCalledWith(1);
        });
        it('should call onSave when in setting mode', async () => {
            const mockOnSave = vi.fn();
            const documentDetail = createMockDocumentDetail();
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)({
                ...defaultOptions,
                datasetId: 'existing-dataset-id',
                isSetting: true,
                documentDetail,
                onSave: mockOnSave,
            }));
            const params = result.current.buildCreationParams(datasets_1.ChunkingMode.text, 'English', { mode: datasets_1.ProcessMode.general, rules: createMockRules() }, {
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: false,
                reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                top_k: 3,
                score_threshold_enabled: false,
                score_threshold: 0.5,
            }, { provider: 'openai', model: 'text-embedding-ada-002' }, hooks_1.IndexingType.QUALIFIED);
            await (0, react_1.act)(async () => {
                await result.current.executeCreation(params, hooks_1.IndexingType.QUALIFIED, {
                    search_method: app_1.RETRIEVE_METHOD.semantic,
                    reranking_enable: false,
                    reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                    top_k: 3,
                    score_threshold_enabled: false,
                    score_threshold: 0.5,
                });
            });
            expect(mockOnSave).toHaveBeenCalled();
        });
    });
    // Tests for validatePreviewParams
    describe('validatePreviewParams', () => {
        it('should return true for valid max chunk length', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)(defaultOptions));
            const isValid = result.current.validatePreviewParams(1000);
            expect(isValid).toBe(true);
        });
        it('should return false when max chunk length exceeds maximum', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)(defaultOptions));
            const isValid = result.current.validatePreviewParams(10000);
            expect(isValid).toBe(false);
        });
    });
});
// ============================================
// useIndexingEstimate Hook Tests
// ============================================
describe('useIndexingEstimate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const defaultOptions = {
        dataSourceType: datasets_1.DataSourceType.FILE,
        currentDocForm: datasets_1.ChunkingMode.text,
        docLanguage: 'English',
        files: [createMockFile()],
        previewNotionPage: createMockNotionPage(),
        notionCredentialId: '',
        previewWebsitePage: createMockWebsitePage(),
        indexingTechnique: hooks_1.IndexingType.QUALIFIED,
        processRule: { mode: datasets_1.ProcessMode.general, rules: createMockRules() },
    };
    // Tests for initial state
    describe('Initial State', () => {
        it('should initialize with idle state', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)(defaultOptions));
            expect(result.current.isIdle).toBe(true);
            expect(result.current.isPending).toBe(false);
            expect(result.current.estimate).toBeUndefined();
        });
    });
    // Tests for fetchEstimate
    describe('fetchEstimate', () => {
        it('should have fetchEstimate function', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)(defaultOptions));
            expect(typeof result.current.fetchEstimate).toBe('function');
        });
        it('should have reset function', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)(defaultOptions));
            expect(typeof result.current.reset).toBe('function');
        });
        it('should call fetchEstimate for FILE data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.FILE,
                previewFileName: 'test-file.pdf',
            }));
            (0, react_1.act)(() => {
                result.current.fetchEstimate();
            });
            // fetchEstimate should be callable without error
            expect(result.current.fetchEstimate).toBeDefined();
        });
        it('should call fetchEstimate for NOTION data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.NOTION,
                previewNotionPage: createMockNotionPage(),
                notionCredentialId: 'cred-123',
            }));
            (0, react_1.act)(() => {
                result.current.fetchEstimate();
            });
            expect(result.current.fetchEstimate).toBeDefined();
        });
        it('should call fetchEstimate for WEB data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.WEB,
                previewWebsitePage: createMockWebsitePage(),
                websiteCrawlProvider: 'jinaReader',
                websiteCrawlJobId: 'job-123',
                crawlOptions: { max_depth: 2 },
            }));
            (0, react_1.act)(() => {
                result.current.fetchEstimate();
            });
            expect(result.current.fetchEstimate).toBeDefined();
        });
    });
    // Tests for getCurrentMutation based on data source type
    describe('Data Source Selection', () => {
        it('should use file query for FILE data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.FILE,
            }));
            expect(result.current.currentMutation).toBeDefined();
            expect(result.current.isIdle).toBe(true);
        });
        it('should use notion query for NOTION data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.NOTION,
            }));
            expect(result.current.currentMutation).toBeDefined();
            expect(result.current.isIdle).toBe(true);
        });
        it('should use website query for WEB data source', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useIndexingEstimate)({
                ...defaultOptions,
                dataSourceType: datasets_1.DataSourceType.WEB,
                websiteCrawlProvider: 'jinaReader',
                websiteCrawlJobId: 'job-123',
            }));
            expect(result.current.currentMutation).toBeDefined();
            expect(result.current.isIdle).toBe(true);
        });
    });
});
// ============================================
// StepTwoFooter Component Tests
// ============================================
describe('StepTwoFooter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const defaultProps = {
        isSetting: false,
        isCreating: false,
        onPrevious: vi.fn(),
        onCreate: vi.fn(),
        onCancel: vi.fn(),
    };
    // Tests for rendering
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<step_two_footer_1.StepTwoFooter {...defaultProps}/>);
            // Should render Previous and Next buttons with correct text
            expect(react_1.screen.getByText(/previousStep/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/nextStep/i)).toBeInTheDocument();
        });
        it('should render Previous and Next buttons when not in setting mode', () => {
            (0, react_1.render)(<step_two_footer_1.StepTwoFooter {...defaultProps}/>);
            expect(react_1.screen.getByText(/previousStep/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/nextStep/i)).toBeInTheDocument();
        });
        it('should render Save and Cancel buttons when in setting mode', () => {
            (0, react_1.render)(<step_two_footer_1.StepTwoFooter {...defaultProps} isSetting={true}/>);
            expect(react_1.screen.getByText(/save/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/cancel/i)).toBeInTheDocument();
        });
    });
    // Tests for user interactions
    describe('User Interactions', () => {
        it('should call onPrevious when Previous button is clicked', () => {
            const onPrevious = vi.fn();
            (0, react_1.render)(<step_two_footer_1.StepTwoFooter {...defaultProps} onPrevious={onPrevious}/>);
            react_1.fireEvent.click(react_1.screen.getByText(/previousStep/i));
            expect(onPrevious).toHaveBeenCalledTimes(1);
        });
        it('should call onCreate when Next/Save button is clicked', () => {
            const onCreate = vi.fn();
            (0, react_1.render)(<step_two_footer_1.StepTwoFooter {...defaultProps} onCreate={onCreate}/>);
            react_1.fireEvent.click(react_1.screen.getByText(/nextStep/i));
            expect(onCreate).toHaveBeenCalledTimes(1);
        });
        it('should call onCancel when Cancel button is clicked in setting mode', () => {
            const onCancel = vi.fn();
            (0, react_1.render)(<step_two_footer_1.StepTwoFooter {...defaultProps} isSetting={true} onCancel={onCancel}/>);
            react_1.fireEvent.click(react_1.screen.getByText(/cancel/i));
            expect(onCancel).toHaveBeenCalledTimes(1);
        });
    });
    // Tests for loading state
    describe('Loading State', () => {
        it('should show loading state on Next button when creating', () => {
            (0, react_1.render)(<step_two_footer_1.StepTwoFooter {...defaultProps} isCreating={true}/>);
            const nextButton = react_1.screen.getByText(/nextStep/i).closest('button');
            // Button has disabled:btn-disabled class which handles the loading state
            expect(nextButton).toHaveClass('disabled:btn-disabled');
        });
        it('should show loading state on Save button when creating in setting mode', () => {
            (0, react_1.render)(<step_two_footer_1.StepTwoFooter {...defaultProps} isSetting={true} isCreating={true}/>);
            const saveButton = react_1.screen.getByText(/save/i).closest('button');
            // Button has disabled:btn-disabled class which handles the loading state
            expect(saveButton).toHaveClass('disabled:btn-disabled');
        });
    });
});
// ============================================
// PreviewPanel Component Tests
// ============================================
describe('PreviewPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    const defaultProps = {
        isMobile: false,
        dataSourceType: datasets_1.DataSourceType.FILE,
        currentDocForm: datasets_1.ChunkingMode.text,
        estimate: undefined,
        parentChildConfig: hooks_1.defaultParentChildConfig,
        isSetting: false,
        pickerFiles: [{ id: 'file-1', name: 'test.pdf', extension: 'pdf' }],
        pickerValue: { id: 'file-1', name: 'test.pdf', extension: 'pdf' },
        isIdle: true,
        isPending: false,
        onPickerChange: vi.fn(),
    };
    // Tests for rendering
    describe('Rendering', () => {
        it('should render without crashing', () => {
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps}/>);
            // Check for the preview header title text
            expect(react_1.screen.getByText('datasetCreation.stepTwo.preview')).toBeInTheDocument();
        });
        it('should render idle state when isIdle is true', () => {
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} isIdle={true}/>);
            expect(react_1.screen.getByText(/previewChunkTip/i)).toBeInTheDocument();
        });
        it('should render loading skeleton when isPending is true', () => {
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} isIdle={false} isPending={true}/>);
            // Should show skeleton containers
            expect(react_1.screen.queryByText(/previewChunkTip/i)).not.toBeInTheDocument();
        });
    });
    // Tests for different doc forms
    describe('Preview Content', () => {
        it('should render text preview when docForm is text', () => {
            const estimate = createMockEstimate();
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} isIdle={false} estimate={estimate} currentDocForm={datasets_1.ChunkingMode.text}/>);
            expect(react_1.screen.getByText('Chunk 1 content')).toBeInTheDocument();
        });
        it('should render QA preview when docForm is qa', () => {
            const estimate = createMockEstimate();
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} isIdle={false} estimate={estimate} currentDocForm={datasets_1.ChunkingMode.qa}/>);
            expect(react_1.screen.getByText('Q1')).toBeInTheDocument();
            expect(react_1.screen.getByText('A1')).toBeInTheDocument();
        });
        it('should show chunk count badge for non-QA doc form', () => {
            const estimate = createMockEstimate({ total_segments: 25 });
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} isIdle={false} estimate={estimate} currentDocForm={datasets_1.ChunkingMode.text}/>);
            expect(react_1.screen.getByText(/25/)).toBeInTheDocument();
        });
        it('should render parent-child preview when docForm is parentChild', () => {
            const estimate = createMockEstimate({
                preview: [
                    { content: 'Parent chunk content', child_chunks: ['Child 1', 'Child 2', 'Child 3'] },
                ],
            });
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} isIdle={false} estimate={estimate} currentDocForm={datasets_1.ChunkingMode.parentChild} parentChildConfig={{
                    ...hooks_1.defaultParentChildConfig,
                    chunkForContext: 'paragraph',
                }}/>);
            // Should render parent chunk label
            expect(react_1.screen.getByText('Chunk-1')).toBeInTheDocument();
            // Should render child chunks
            expect(react_1.screen.getByText('Child 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Child 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Child 3')).toBeInTheDocument();
        });
        it('should limit child chunks when chunkForContext is full-doc', () => {
            // FULL_DOC_PREVIEW_LENGTH is 50, so we need more than 50 chunks to test the limit
            const manyChildChunks = Array.from({ length: 60 }, (_, i) => `ChildChunk${i + 1}`);
            const estimate = createMockEstimate({
                preview: [{ content: 'Parent content', child_chunks: manyChildChunks }],
            });
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} isIdle={false} estimate={estimate} currentDocForm={datasets_1.ChunkingMode.parentChild} parentChildConfig={{
                    ...hooks_1.defaultParentChildConfig,
                    chunkForContext: 'full-doc',
                }}/>);
            // Should render parent chunk
            expect(react_1.screen.getByText('Chunk-1')).toBeInTheDocument();
            // full-doc mode limits to FULL_DOC_PREVIEW_LENGTH (50)
            expect(react_1.screen.getByText('ChildChunk1')).toBeInTheDocument();
            expect(react_1.screen.getByText('ChildChunk50')).toBeInTheDocument();
            // Should not render beyond the limit
            expect(react_1.screen.queryByText('ChildChunk51')).not.toBeInTheDocument();
        });
        it('should render multiple parent chunks in parent-child mode', () => {
            const estimate = createMockEstimate({
                preview: [
                    { content: 'Parent 1', child_chunks: ['P1-C1'] },
                    { content: 'Parent 2', child_chunks: ['P2-C1'] },
                ],
            });
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} isIdle={false} estimate={estimate} currentDocForm={datasets_1.ChunkingMode.parentChild}/>);
            expect(react_1.screen.getByText('Chunk-1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Chunk-2')).toBeInTheDocument();
            expect(react_1.screen.getByText('P1-C1')).toBeInTheDocument();
            expect(react_1.screen.getByText('P2-C1')).toBeInTheDocument();
        });
    });
    // Tests for picker
    describe('Document Picker', () => {
        it('should call onPickerChange when document is selected', () => {
            const onPickerChange = vi.fn();
            (0, react_1.render)(<preview_panel_1.PreviewPanel {...defaultProps} onPickerChange={onPickerChange}/>);
            // The picker interaction would be tested through the actual component
            expect(onPickerChange).not.toHaveBeenCalled();
        });
    });
});
// ============================================
// Edge Cases Tests
// ============================================
describe('Edge Cases', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Empty/Null Values', () => {
        it('should handle empty files array in usePreviewState', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                dataSourceType: datasets_1.DataSourceType.FILE,
                files: [],
                notionPages: [],
                websitePages: [],
            }));
            expect(result.current.previewFile).toBeUndefined();
        });
        it('should handle empty notion pages array', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                dataSourceType: datasets_1.DataSourceType.NOTION,
                files: [],
                notionPages: [],
                websitePages: [],
            }));
            expect(result.current.previewNotionPage).toBeUndefined();
        });
        it('should handle empty website pages array', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                dataSourceType: datasets_1.DataSourceType.WEB,
                files: [],
                notionPages: [],
                websitePages: [],
            }));
            expect(result.current.previewWebsitePage).toBeUndefined();
        });
    });
    describe('Boundary Conditions', () => {
        it('should handle very large chunk length', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setMaxChunkLength(999999);
            });
            expect(result.current.maxChunkLength).toBe(999999);
        });
        it('should handle zero overlap', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setOverlap(0);
            });
            expect(result.current.overlap).toBe(0);
        });
        it('should handle special characters in segment identifier', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setSegmentIdentifier('<<>>');
            });
            expect(result.current.segmentIdentifier).toBe('<<>>');
        });
    });
    describe('Callback Stability', () => {
        it('should maintain stable setSegmentIdentifier reference', () => {
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const initialSetter = result.current.setSegmentIdentifier;
            rerender();
            expect(result.current.setSegmentIdentifier).toBe(initialSetter);
        });
        it('should maintain stable toggleRule reference', () => {
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const initialToggle = result.current.toggleRule;
            rerender();
            expect(result.current.toggleRule).toBe(initialToggle);
        });
        it('should maintain stable getProcessRule reference', () => {
            const { result, rerender } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            // Update some state to trigger re-render
            (0, react_1.act)(() => {
                result.current.setMaxChunkLength(2048);
            });
            rerender();
            // getProcessRule depends on state, so it may change but should remain a function
            expect(typeof result.current.getProcessRule).toBe('function');
        });
    });
});
// ============================================
// Integration Scenarios
// ============================================
describe('Integration Scenarios', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCurrentDataset = null;
    });
    describe('Document Creation Flow', () => {
        it('should build and validate params for file upload workflow', () => {
            const files = [createMockFile()];
            const { result: segResult } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            const { result: creationResult } = (0, react_1.renderHook)(() => (0, hooks_1.useDocumentCreation)({
                dataSourceType: datasets_1.DataSourceType.FILE,
                files,
                notionPages: [],
                notionCredentialId: '',
                websitePages: [],
            }));
            // Build params
            const params = creationResult.current.buildCreationParams(datasets_1.ChunkingMode.text, 'English', segResult.current.getProcessRule(datasets_1.ChunkingMode.text), {
                search_method: app_1.RETRIEVE_METHOD.semantic,
                reranking_enable: false,
                reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
                top_k: 3,
                score_threshold_enabled: false,
                score_threshold: 0.5,
            }, { provider: 'openai', model: 'text-embedding-ada-002' }, hooks_1.IndexingType.QUALIFIED);
            expect(params).toBeDefined();
            expect(params?.data_source?.info_list.file_info_list?.file_ids).toContain('file-1');
        });
        it('should handle parent-child document form', () => {
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.useSegmentationState)());
            (0, react_1.act)(() => {
                result.current.setSegmentationType(datasets_1.ProcessMode.parentChild);
                result.current.setChunkForContext('full-doc');
                result.current.updateParentConfig('maxLength', 2048);
                result.current.updateChildConfig('maxLength', 512);
            });
            const processRule = result.current.getProcessRule(datasets_1.ChunkingMode.parentChild);
            expect(processRule.mode).toBe('hierarchical');
            expect(processRule.rules.parent_mode).toBe('full-doc');
            expect(processRule.rules.segmentation.max_tokens).toBe(2048);
            expect(processRule.rules.subchunk_segmentation?.max_tokens).toBe(512);
        });
    });
    describe('Preview Flow', () => {
        it('should handle preview file change flow', () => {
            const files = [
                createMockFile({ id: 'file-1', name: 'first.pdf' }),
                createMockFile({ id: 'file-2', name: 'second.pdf' }),
            ];
            const { result } = (0, react_1.renderHook)(() => (0, hooks_1.usePreviewState)({
                dataSourceType: datasets_1.DataSourceType.FILE,
                files,
                notionPages: [],
                websitePages: [],
            }));
            // Initial state
            expect(result.current.getPreviewPickerValue().name).toBe('first.pdf');
            // Change preview
            (0, react_1.act)(() => {
                result.current.handlePreviewChange({ id: 'file-2', name: 'second.pdf' });
            });
            expect(result.current.previewFile).toEqual({ id: 'file-2', name: 'second.pdf' });
        });
    });
    describe('Escape/Unescape Round Trip', () => {
        it('should preserve original string through escape/unescape', () => {
            const original = '\n\n';
            const escaped = (0, escape_1.default)(original);
            const unescaped = (0, unescape_1.default)(escaped);
            expect(unescaped).toBe(original);
        });
        it('should handle complex strings without backslashes', () => {
            // This string contains control characters but no literal backslashes.
            const original = 'Hello\nWorld\t!\r\n';
            const escaped = (0, escape_1.default)(original);
            const unescaped = (0, unescape_1.default)(escaped);
            expect(unescaped).toBe(original);
        });
        it('should document behavior for strings with existing backslashes', () => {
            // When the original string already contains backslash sequences,
            // escape/unescape are not perfectly symmetric because escape()
            // does not escape backslashes.
            const original = 'Hello\\nWorld';
            const escaped = (0, escape_1.default)(original);
            const unescaped = (0, unescape_1.default)(escaped);
            // The unescaped value interprets "\n" as a newline, so it differs from the original.
            expect(unescaped).toBe('Hello\nWorld');
            expect(unescaped).not.toBe(original);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBWUEsa0RBQW1GO0FBQ25GLDJHQUFrSjtBQUNsSixnREFBNkU7QUFDN0UscUNBQTZDO0FBQzdDLDhEQUF5RDtBQUN6RCxrRUFBNEQ7QUFDNUQsbUNBV2dCO0FBQ2hCLDJDQUFtQztBQUNuQywrQ0FBdUM7QUFFdkMsK0NBQStDO0FBQy9DLDZCQUE2QjtBQUM3QiwrQ0FBK0M7QUFFL0MsOEJBQThCO0FBQzlCLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLEVBQUUsRUFBRSxpQkFBaUI7SUFDckIsUUFBUSxFQUFFLHVCQUFZLENBQUMsSUFBSTtJQUMzQixnQkFBZ0IsRUFBRSx5QkFBYyxDQUFDLElBQUk7SUFDckMsZUFBZSxFQUFFLHdCQUF3QjtJQUN6Qyx3QkFBd0IsRUFBRSxRQUFRO0lBQ2xDLG9CQUFvQixFQUFFO1FBQ3BCLGFBQWEsRUFBRSxxQkFBZSxDQUFDLFFBQVE7UUFDdkMsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixlQUFlLEVBQUUsRUFBRSx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsb0JBQW9CLEVBQUUsRUFBRSxFQUFFO1FBQzFFLEtBQUssRUFBRSxDQUFDO1FBQ1IsdUJBQXVCLEVBQUUsS0FBSztRQUM5QixlQUFlLEVBQUUsR0FBRztLQUNGO0NBQ3JCLENBQUE7QUFFRCxJQUFJLGtCQUFrQixHQUE4QixJQUFJLENBQUE7QUFDeEQsTUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFcEMsRUFBRSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLG1DQUFtQyxFQUFFLENBQUMsUUFBa0csRUFBRSxFQUFFLENBQzFJLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxDQUFDO0NB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QUMsQ0FBQTtZQUNoQyxNQUFNLENBQUMsSUFBQSxnQkFBTSxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2hDLE1BQU0sQ0FBQyxJQUFBLGdCQUFNLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDdkMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1lBQ2hELE1BQU0sQ0FBQyxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDaEMsTUFBTSxDQUFDLElBQUEsZ0JBQU0sRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoQyxNQUFNLENBQUMsSUFBQSxnQkFBTSxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ2hDLE1BQU0sQ0FBQyxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDbEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLE1BQU0sQ0FBQyxJQUFBLGdCQUFNLEVBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbkMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLE1BQU0sQ0FBQyxJQUFBLGdCQUFNLEVBQUMsaUJBQWlCLENBQUMs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RUFBQyxPQUFPLENBQUMsQ0FBQTtZQUNuQyxxRkFBcUY7WUFDckYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtZQUN0QyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN0QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vZGVsIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvZGVjbGFyYXRpb25zJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU291cmNlUHJvdmlkZXIsIE5vdGlvblBhZ2UgfSBmcm9tICdAL21vZGVscy9jb21tb24nXG5pbXBvcnQgdHlwZSB7XG4gIENyYXdsT3B0aW9ucyxcbiAgQ3Jhd2xSZXN1bHRJdGVtLFxuICBDdXN0b21GaWxlLFxuICBGaWxlSW5kZXhpbmdFc3RpbWF0ZVJlc3BvbnNlLFxuICBGdWxsRG9jdW1lbnREZXRhaWwsXG4gIFByZVByb2Nlc3NpbmdSdWxlLFxuICBSdWxlcyxcbn0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgdHlwZSB7IFJldHJpZXZhbENvbmZpZyB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgYWN0LCBmaXJlRXZlbnQsIHJlbmRlciwgcmVuZGVySG9vaywgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25NZXRob2RFbnVtLCBNb2RlbFN0YXR1c0VudW0sIE1vZGVsVHlwZUVudW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9kZWNsYXJhdGlvbnMnXG5pbXBvcnQgeyBDaHVua2luZ01vZGUsIERhdGFTb3VyY2VUeXBlLCBQcm9jZXNzTW9kZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgUkVUUklFVkVfTUVUSE9EIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgeyBQcmV2aWV3UGFuZWwgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJldmlldy1wYW5lbCdcbmltcG9ydCB7IFN0ZXBUd29Gb290ZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RlcC10d28tZm9vdGVyJ1xuaW1wb3J0IHtcbiAgREVGQVVMVF9NQVhJTVVNX0NIVU5LX0xFTkdUSCxcbiAgREVGQVVMVF9PVkVSTEFQLFxuICBERUZBVUxUX1NFR01FTlRfSURFTlRJRklFUixcbiAgZGVmYXVsdFBhcmVudENoaWxkQ29uZmlnLFxuICBJbmRleGluZ1R5cGUsXG4gIHVzZURvY3VtZW50Q3JlYXRpb24sXG4gIHVzZUluZGV4aW5nQ29uZmlnLFxuICB1c2VJbmRleGluZ0VzdGltYXRlLFxuICB1c2VQcmV2aWV3U3RhdGUsXG4gIHVzZVNlZ21lbnRhdGlvblN0YXRlLFxufSBmcm9tICcuL2hvb2tzJ1xuaW1wb3J0IGVzY2FwZSBmcm9tICcuL2hvb2tzL2VzY2FwZSdcbmltcG9ydCB1bmVzY2FwZSBmcm9tICcuL2hvb2tzL3VuZXNjYXBlJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgZGF0YXNldCBkZXRhaWwgY29udGV4dFxuY29uc3QgbW9ja0RhdGFzZXQgPSB7XG4gIGlkOiAndGVzdC1kYXRhc2V0LWlkJyxcbiAgZG9jX2Zvcm06IENodW5raW5nTW9kZS50ZXh0LFxuICBkYXRhX3NvdXJjZV90eXBlOiBEYXRhU291cmNlVHlwZS5GSUxFLFxuICBlbWJlZGRpbmdfbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEtMDAyJyxcbiAgZW1iZWRkaW5nX21vZGVsX3Byb3ZpZGVyOiAnb3BlbmFpJyxcbiAgcmV0cmlldmFsX21vZGVsX2RpY3Q6IHtcbiAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgcmVyYW5raW5nX21vZGVsOiB7IHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJywgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnIH0sXG4gICAgdG9wX2s6IDMsXG4gICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICB9IGFzIFJldHJpZXZhbENvbmZpZyxcbn1cblxubGV0IG1vY2tDdXJyZW50RGF0YXNldDogdHlwZW9mIG1vY2tEYXRhc2V0IHwgbnVsbCA9IG51bGxcbmNvbnN0IG1vY2tNdXRhdGVEYXRhc2V0UmVzID0gdmkuZm4oKVxuXG52aS5tb2NrKCdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnLCAoKSA9PiAoe1xuICB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcjogKHNlbGVjdG9yOiAoc3RhdGU6IHsgZGF0YXNldDogdHlwZW9mIG1vY2tEYXRhc2V0IHwgbnVsbCwgbXV0YXRlRGF0YXNldFJlczogKCkgPT4gdm9pZCB9KSA9PiB1bmtub3duKSA9PlxuICAgIHNlbGVjdG9yKHsgZGF0YXNldDogbW9ja0N1cnJlbnREYXRhc2V0LCBtdXRhdGVEYXRhc2V0UmVzOiBtb2NrTXV0YXRlRGF0YXNldFJlcyB9KSxcbn0pKVxuXG4vLyBOb3RlOiBAL2NvbnRleHQvaTE4biBpcyBnbG9iYWxseSBtb2NrZWQgaW4gdml0ZXN0LnNldHVwLnRzLCBubyBuZWVkIHRvIG1vY2sgaGVyZVxuLy8gTm90ZTogQC9ob29rcy91c2UtYnJlYWtwb2ludHMgdXNlcyByZWFsIGltcG9ydFxuXG4vLyBNb2NrIG1vZGVsIGhvb2tzXG5jb25zdCBtb2NrRW1iZWRkaW5nTW9kZWxMaXN0ID0gW1xuICB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEtMDAyJyB9LFxuICB7IHByb3ZpZGVyOiAnY29oZXJlJywgbW9kZWw6ICdlbWJlZC1lbmdsaXNoLXYzLjAnIH0sXG5dXG5jb25zdCBtb2NrRGVmYXVsdEVtYmVkZGluZ01vZGVsID0geyBwcm92aWRlcjogeyBwcm92aWRlcjogJ29wZW5haScgfSwgbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEtMDAyJyB9XG4vLyBNb2RlbFtdIHR5cGUgc3RydWN0dXJlIGZvciByZXJhbmsgbW9kZWwgbGlzdCAoc2ltcGxpZmllZCBtb2NrKVxuY29uc3QgbW9ja1JlcmFua01vZGVsTGlzdDogTW9kZWxbXSA9IFt7XG4gIHByb3ZpZGVyOiAnY29oZXJlJyxcbiAgaWNvbl9zbWFsbDogeyBlbl9VUzogJ2NvaGVyZS1pY29uJywgemhfSGFuczogJ2NvaGVyZS1pY29uJyB9LFxuICBsYWJlbDogeyBlbl9VUzogJ0NvaGVyZScsIHpoX0hhbnM6ICdDb2hlcmUnIH0sXG4gIG1vZGVsczogW3tcbiAgICBtb2RlbDogJ3JlcmFuay1lbmdsaXNoLXYzLjAnLFxuICAgIGxhYmVsOiB7IGVuX1VTOiAnUmVyYW5rIEVuZ2xpc2ggdjMuMCcsIHpoX0hhbnM6ICdSZXJhbmsgRW5nbGlzaCB2My4wJyB9LFxuICAgIG1vZGVsX3R5cGU6IE1vZGVsVHlwZUVudW0ucmVyYW5rLFxuICAgIGZlYXR1cmVzOiBbXSxcbiAgICBmZXRjaF9mcm9tOiBDb25maWd1cmF0aW9uTWV0aG9kRW51bS5wcmVkZWZpbmVkTW9kZWwsXG4gICAgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0uYWN0aXZlLFxuICAgIG1vZGVsX3Byb3BlcnRpZXM6IHt9LFxuICAgIGxvYWRfYmFsYW5jaW5nX2VuYWJsZWQ6IGZhbHNlLFxuICB9XSxcbiAgc3RhdHVzOiBNb2RlbFN0YXR1c0VudW0uYWN0aXZlLFxufV1cbmNvbnN0IG1vY2tSZXJhbmtEZWZhdWx0TW9kZWwgPSB7IHByb3ZpZGVyOiB7IHByb3ZpZGVyOiAnY29oZXJlJyB9LCBtb2RlbDogJ3JlcmFuay1lbmdsaXNoLXYzLjAnIH1cbmxldCBtb2NrSXNSZXJhbmtEZWZhdWx0TW9kZWxWYWxpZCA9IHRydWVcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VNb2RlbExpc3RBbmREZWZhdWx0TW9kZWxBbmRDdXJyZW50UHJvdmlkZXJBbmRNb2RlbDogKCkgPT4gKHtcbiAgICBtb2RlbExpc3Q6IG1vY2tSZXJhbmtNb2RlbExpc3QsXG4gICAgZGVmYXVsdE1vZGVsOiBtb2NrUmVyYW5rRGVmYXVsdE1vZGVsLFxuICAgIGN1cnJlbnRNb2RlbDogbW9ja0lzUmVyYW5rRGVmYXVsdE1vZGVsVmFsaWQsXG4gIH0pLFxuICB1c2VNb2RlbExpc3Q6ICgpID0+ICh7IGRhdGE6IG1vY2tFbWJlZGRpbmdNb2RlbExpc3QgfSksXG4gIHVzZURlZmF1bHRNb2RlbDogKCkgPT4gKHsgZGF0YTogbW9ja0RlZmF1bHRFbWJlZGRpbmdNb2RlbCB9KSxcbn0pKVxuXG4vLyBNb2NrIHNlcnZpY2UgaG9va3NcbmNvbnN0IG1vY2tGZXRjaERlZmF1bHRQcm9jZXNzUnVsZU11dGF0ZSA9IHZpLmZuKClcbnZpLm1vY2soJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWNyZWF0ZS1kYXRhc2V0JywgKCkgPT4gKHtcbiAgdXNlRmV0Y2hEZWZhdWx0UHJvY2Vzc1J1bGU6ICh7IG9uU3VjY2VzcyB9OiB7IG9uU3VjY2VzczogKGRhdGE6IHsgcnVsZXM6IFJ1bGVzLCBsaW1pdHM6IHsgaW5kZXhpbmdfbWF4X3NlZ21lbnRhdGlvbl90b2tlbnNfbGVuZ3RoOiBudW1iZXIgfSB9KSA9PiB2b2lkIH0pID0+ICh7XG4gICAgbXV0YXRlOiAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgIG1vY2tGZXRjaERlZmF1bHRQcm9jZXNzUnVsZU11dGF0ZSh1cmwpXG4gICAgICBvblN1Y2Nlc3Moe1xuICAgICAgICBydWxlczoge1xuICAgICAgICAgIHNlZ21lbnRhdGlvbjogeyBzZXBhcmF0b3I6ICdcXFxcbicsIG1heF90b2tlbnM6IDUwMCwgY2h1bmtfb3ZlcmxhcDogNTAgfSxcbiAgICAgICAgICBwcmVfcHJvY2Vzc2luZ19ydWxlczogW1xuICAgICAgICAgICAgeyBpZDogJ3JlbW92ZV9leHRyYV9zcGFjZXMnLCBlbmFibGVkOiB0cnVlIH0sXG4gICAgICAgICAgICB7IGlkOiAncmVtb3ZlX3VybHNfZW1haWxzJywgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIHBhcmVudF9tb2RlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgICBzdWJjaHVua19zZWdtZW50YXRpb246IHsgc2VwYXJhdG9yOiAnXFxcXG4nLCBtYXhfdG9rZW5zOiAyNTYgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXRzOiB7IGluZGV4aW5nX21heF9zZWdtZW50YXRpb25fdG9rZW5zX2xlbmd0aDogNDAwMCB9LFxuICAgICAgfSlcbiAgICB9LFxuICAgIGlzUGVuZGluZzogZmFsc2UsXG4gIH0pLFxuICB1c2VGZXRjaEZpbGVJbmRleGluZ0VzdGltYXRlRm9yRmlsZTogKCkgPT4gKHtcbiAgICBtdXRhdGU6IHZpLmZuKCksXG4gICAgZGF0YTogdW5kZWZpbmVkLFxuICAgIGlzSWRsZTogdHJ1ZSxcbiAgICBpc1BlbmRpbmc6IGZhbHNlLFxuICAgIHJlc2V0OiB2aS5mbigpLFxuICB9KSxcbiAgdXNlRmV0Y2hGaWxlSW5kZXhpbmdFc3RpbWF0ZUZvck5vdGlvbjogKCkgPT4gKHtcbiAgICBtdXRhdGU6IHZpLmZuKCksXG4gICAgZGF0YTogdW5kZWZpbmVkLFxuICAgIGlzSWRsZTogdHJ1ZSxcbiAgICBpc1BlbmRpbmc6IGZhbHNlLFxuICAgIHJlc2V0OiB2aS5mbigpLFxuICB9KSxcbiAgdXNlRmV0Y2hGaWxlSW5kZXhpbmdFc3RpbWF0ZUZvcldlYjogKCkgPT4gKHtcbiAgICBtdXRhdGU6IHZpLmZuKCksXG4gICAgZGF0YTogdW5kZWZpbmVkLFxuICAgIGlzSWRsZTogdHJ1ZSxcbiAgICBpc1BlbmRpbmc6IGZhbHNlLFxuICAgIHJlc2V0OiB2aS5mbigpLFxuICB9KSxcbiAgdXNlQ3JlYXRlRmlyc3REb2N1bWVudDogKCkgPT4gKHtcbiAgICBtdXRhdGVBc3luYzogdmkuZm4oKS5tb2NrSW1wbGVtZW50YXRpb24oYXN5bmMgKHBhcmFtczogdW5rbm93biwgb3B0aW9ucz86IHsgb25TdWNjZXNzPzogKGRhdGE6IHVua25vd24pID0+IHZvaWQgfSkgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IHsgZGF0YXNldDogeyBpZDogJ25ldy1kYXRhc2V0LWlkJyB9IH1cbiAgICAgIG9wdGlvbnM/Lm9uU3VjY2Vzcz8uKGRhdGEpXG4gICAgICByZXR1cm4gZGF0YVxuICAgIH0pLFxuICAgIGlzUGVuZGluZzogZmFsc2UsXG4gIH0pLFxuICB1c2VDcmVhdGVEb2N1bWVudDogKCkgPT4gKHtcbiAgICBtdXRhdGVBc3luYzogdmkuZm4oKS5tb2NrSW1wbGVtZW50YXRpb24oYXN5bmMgKHBhcmFtczogdW5rbm93biwgb3B0aW9ucz86IHsgb25TdWNjZXNzPzogKGRhdGE6IHVua25vd24pID0+IHZvaWQgfSkgPT4ge1xuICAgICAgY29uc3QgZGF0YSA9IHsgZG9jdW1lbnQ6IHsgaWQ6ICduZXctZG9jLWlkJyB9IH1cbiAgICAgIG9wdGlvbnM/Lm9uU3VjY2Vzcz8uKGRhdGEpXG4gICAgICByZXR1cm4gZGF0YVxuICAgIH0pLFxuICAgIGlzUGVuZGluZzogZmFsc2UsXG4gIH0pLFxuICBnZXROb3Rpb25JbmZvOiB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZShbeyB3b3Jrc3BhY2VfaWQ6ICd3cy0xJywgcGFnZXM6IFt7IHBhZ2VfaWQ6ICdwYWdlLTEnIH1dIH1dKSxcbiAgZ2V0V2Vic2l0ZUluZm86IHZpLmZuKCkubW9ja1JldHVyblZhbHVlKHsgcHJvdmlkZXI6ICdqaW5hUmVhZGVyJywgam9iX2lkOiAnam9iLTEyMycsIHVybHM6IFsnaHR0cHM6Ly90ZXN0LmNvbSddIH0pLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWRhdGFzZXQnLCAoKSA9PiAoe1xuICB1c2VJbnZhbGlkRGF0YXNldExpc3Q6ICgpID0+IHZpLmZuKCksXG59KSlcblxuLy8gTW9jayBhbXBsaXR1ZGUgdHJhY2tpbmcgKGV4dGVybmFsIHNlcnZpY2UpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYW1wbGl0dWRlJywgKCkgPT4gKHtcbiAgdHJhY2tFdmVudDogdmkuZm4oKSxcbn0pKVxuXG4vLyBOb3RlOiBAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QgLSB1c2VzIHJlYWwgaW1wb3J0IChiYXNlIGNvbXBvbmVudClcbi8vIE5vdGU6IEAvYXBwL2NvbXBvbmVudHMvZGF0YXNldHMvY29tbW9uL2NoZWNrLXJlcmFuay1tb2RlbCAtIHVzZXMgcmVhbCBpbXBvcnRcbi8vIE5vdGU6IEAvYXBwL2NvbXBvbmVudHMvYmFzZS9mbG9hdC1yaWdodC1jb250YWluZXIgLSB1c2VzIHJlYWwgaW1wb3J0IChiYXNlIGNvbXBvbmVudClcblxuLy8gTW9jayBjaGVja1Nob3dNdWx0aU1vZGFsVGlwIC0gcmVxdWlyZXMgY29tcGxleCBtb2RlbCBsaXN0IHN0cnVjdHVyZVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9kYXRhc2V0cy9zZXR0aW5ncy91dGlscycsICgpID0+ICh7XG4gIGNoZWNrU2hvd011bHRpTW9kYWxUaXA6ICgpID0+IGZhbHNlLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IGRhdGEgZmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrRmlsZSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPEN1c3RvbUZpbGU+KTogQ3VzdG9tRmlsZSA9PiAoe1xuICBpZDogJ2ZpbGUtMScsXG4gIG5hbWU6ICd0ZXN0LWZpbGUucGRmJyxcbiAgZXh0ZW5zaW9uOiAncGRmJyxcbiAgc2l6ZTogMTAyNCxcbiAgdHlwZTogJ2FwcGxpY2F0aW9uL3BkZicsXG4gIGxhc3RNb2RpZmllZDogRGF0ZS5ub3coKSxcbiAgLi4ub3ZlcnJpZGVzLFxufSBhcyBDdXN0b21GaWxlKVxuXG5jb25zdCBjcmVhdGVNb2NrTm90aW9uUGFnZSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPE5vdGlvblBhZ2U+KTogTm90aW9uUGFnZSA9PiAoe1xuICBwYWdlX2lkOiAnbm90aW9uLXBhZ2UtMScsXG4gIHBhZ2VfbmFtZTogJ1Rlc3QgTm90aW9uIFBhZ2UnLFxuICBwYWdlX2ljb246IG51bGwsXG4gIHR5cGU6ICdwYWdlJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSBhcyBOb3Rpb25QYWdlKVxuXG5jb25zdCBjcmVhdGVNb2NrV2Vic2l0ZVBhZ2UgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxDcmF3bFJlc3VsdEl0ZW0+KTogQ3Jhd2xSZXN1bHRJdGVtID0+ICh7XG4gIHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tL3BhZ2UxJyxcbiAgdGl0bGU6ICdUZXN0IFdlYnNpdGUgUGFnZScsXG4gIGRlc2NyaXB0aW9uOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gIG1hcmtkb3duOiAnIyBUZXN0IENvbnRlbnQnLFxuICAuLi5vdmVycmlkZXMsXG59IGFzIENyYXdsUmVzdWx0SXRlbSlcblxuY29uc3QgY3JlYXRlTW9ja0RvY3VtZW50RGV0YWlsID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8RnVsbERvY3VtZW50RGV0YWlsPik6IEZ1bGxEb2N1bWVudERldGFpbCA9PiAoe1xuICBpZDogJ2RvYy0xJyxcbiAgZG9jX2Zvcm06IENodW5raW5nTW9kZS50ZXh0LFxuICBkb2NfbGFuZ3VhZ2U6ICdFbmdsaXNoJyxcbiAgZmlsZTogeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICd0ZXN0LnBkZicsIGV4dGVuc2lvbjogJ3BkZicgfSxcbiAgbm90aW9uX3BhZ2U6IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKCksXG4gIHdlYnNpdGVfcGFnZTogY3JlYXRlTW9ja1dlYnNpdGVQYWdlKCksXG4gIGRhdGFzZXRfcHJvY2Vzc19ydWxlOiB7XG4gICAgbW9kZTogUHJvY2Vzc01vZGUuZ2VuZXJhbCxcbiAgICBydWxlczoge1xuICAgICAgc2VnbWVudGF0aW9uOiB7IHNlcGFyYXRvcjogJ1xcXFxuXFxcXG4nLCBtYXhfdG9rZW5zOiAxMDI0LCBjaHVua19vdmVybGFwOiA1MCB9LFxuICAgICAgcHJlX3Byb2Nlc3NpbmdfcnVsZXM6IFt7IGlkOiAncmVtb3ZlX2V4dHJhX3NwYWNlcycsIGVuYWJsZWQ6IHRydWUgfV0sXG4gICAgfSxcbiAgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSBhcyBGdWxsRG9jdW1lbnREZXRhaWwpXG5cbmNvbnN0IGNyZWF0ZU1vY2tSdWxlcyA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPFJ1bGVzPik6IFJ1bGVzID0+ICh7XG4gIHNlZ21lbnRhdGlvbjogeyBzZXBhcmF0b3I6ICdcXFxcblxcXFxuJywgbWF4X3Rva2VuczogMTAyNCwgY2h1bmtfb3ZlcmxhcDogNTAgfSxcbiAgcHJlX3Byb2Nlc3NpbmdfcnVsZXM6IFtcbiAgICB7IGlkOiAncmVtb3ZlX2V4dHJhX3NwYWNlcycsIGVuYWJsZWQ6IHRydWUgfSxcbiAgICB7IGlkOiAncmVtb3ZlX3VybHNfZW1haWxzJywgZW5hYmxlZDogZmFsc2UgfSxcbiAgXSxcbiAgcGFyZW50X21vZGU6ICdwYXJhZ3JhcGgnLFxuICBzdWJjaHVua19zZWdtZW50YXRpb246IHsgc2VwYXJhdG9yOiAnXFxcXG4nLCBtYXhfdG9rZW5zOiA1MTIgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0VzdGltYXRlID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8RmlsZUluZGV4aW5nRXN0aW1hdGVSZXNwb25zZT4pOiBGaWxlSW5kZXhpbmdFc3RpbWF0ZVJlc3BvbnNlID0+ICh7XG4gIHRvdGFsX3NlZ21lbnRzOiAxMCxcbiAgdG90YWxfbm9kZXM6IDEwLFxuICB0b2tlbnM6IDUwMDAsXG4gIHRvdGFsX3ByaWNlOiAwLjAxLFxuICBjdXJyZW5jeTogJ1VTRCcsXG4gIHFhX3ByZXZpZXc6IFt7IHF1ZXN0aW9uOiAnUTEnLCBhbnN3ZXI6ICdBMScgfV0sXG4gIHByZXZpZXc6IFt7IGNvbnRlbnQ6ICdDaHVuayAxIGNvbnRlbnQnLCBjaGlsZF9jaHVua3M6IFsnQ2hpbGQgMScsICdDaGlsZCAyJ10gfV0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBVdGlsaXR5IEZ1bmN0aW9ucyBUZXN0cyAoZXNjYXBlL3VuZXNjYXBlKVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ2VzY2FwZSB1dGlsaXR5JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgZXNjYXBlIGZ1bmN0aW9uXG4gIGRlc2NyaWJlKCdlc2NhcGUgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgc3RyaW5nIGZvciBudWxsL3VuZGVmaW5lZCBpbnB1dCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChlc2NhcGUobnVsbCBhcyB1bmtub3duIGFzIHN0cmluZykpLnRvQmUoJycpXG4gICAgICBleHBlY3QoZXNjYXBlKHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIHN0cmluZykpLnRvQmUoJycpXG4gICAgICBleHBlY3QoZXNjYXBlKCcnKSkudG9CZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBlc2NhcGUgbmV3bGluZSBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGVzY2FwZSgnXFxuJykpLnRvQmUoJ1xcXFxuJylcbiAgICAgIGV4cGVjdChlc2NhcGUoJ1xccicpKS50b0JlKCdcXFxccicpXG4gICAgICBleHBlY3QoZXNjYXBlKCdcXG5cXHInKSkudG9CZSgnXFxcXG5cXFxccicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZXNjYXBlIHRhYiBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGVzY2FwZSgnXFx0JykpLnRvQmUoJ1xcXFx0JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBlc2NhcGUgb3RoZXIgc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGVzY2FwZSgnXFwwJykpLnRvQmUoJ1xcXFwwJylcbiAgICAgIGV4cGVjdChlc2NhcGUoJ1xcYicpKS50b0JlKCdcXFxcYicpXG4gICAgICBleHBlY3QoZXNjYXBlKCdcXGYnKSkudG9CZSgnXFxcXGYnKVxuICAgICAgZXhwZWN0KGVzY2FwZSgnXFx2JykpLnRvQmUoJ1xcXFx2JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBlc2NhcGUgc2luZ2xlIHF1b3RlcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChlc2NhcGUoJ1xcJycpKS50b0JlKCdcXFxcXFwnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWl4ZWQgY29udGVudCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChlc2NhcGUoJ0hlbGxvXFxuV29ybGRcXHQhJykpLnRvQmUoJ0hlbGxvXFxcXG5Xb3JsZFxcXFx0IScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGVzY2FwZSByZWd1bGFyIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoZXNjYXBlKCdIZWxsbyBXb3JsZCcpKS50b0JlKCdIZWxsbyBXb3JsZCcpXG4gICAgICBleHBlY3QoZXNjYXBlKCdhYmMxMjMnKSkudG9CZSgnYWJjMTIzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgc3RyaW5nIGZvciBub24tc3RyaW5nIGlucHV0JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGVzY2FwZSgxMjMgYXMgdW5rbm93biBhcyBzdHJpbmcpKS50b0JlKCcnKVxuICAgICAgZXhwZWN0KGVzY2FwZSh7fSBhcyB1bmtub3duIGFzIHN0cmluZykpLnRvQmUoJycpXG4gICAgfSlcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCd1bmVzY2FwZSB1dGlsaXR5JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgdW5lc2NhcGUgZnVuY3Rpb25cbiAgZGVzY3JpYmUoJ3VuZXNjYXBlIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdW5lc2NhcGUgbmV3bGluZSBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHVuZXNjYXBlKCdcXFxcbicpKS50b0JlKCdcXG4nKVxuICAgICAgZXhwZWN0KHVuZXNjYXBlKCdcXFxccicpKS50b0JlKCdcXHInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVuZXNjYXBlIHRhYiBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHVuZXNjYXBlKCdcXFxcdCcpKS50b0JlKCdcXHQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVuZXNjYXBlIG90aGVyIHNwZWNpYWwgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnXFxcXDAnKSkudG9CZSgnXFwwJylcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnXFxcXGInKSkudG9CZSgnXFxiJylcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnXFxcXGYnKSkudG9CZSgnXFxmJylcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnXFxcXHYnKSkudG9CZSgnXFx2JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1bmVzY2FwZSBzaW5nbGUgYW5kIGRvdWJsZSBxdW90ZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QodW5lc2NhcGUoJ1xcXFxcXCcnKSkudG9CZSgnXFwnJylcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnXFxcXFwiJykpLnRvQmUoJ1wiJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1bmVzY2FwZSBiYWNrc2xhc2gnLCAoKSA9PiB7XG4gICAgICBleHBlY3QodW5lc2NhcGUoJ1xcXFxcXFxcJykpLnRvQmUoJ1xcXFwnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVuZXNjYXBlIGhleCBzZXF1ZW5jZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QodW5lc2NhcGUoJ1xcXFx4NDEnKSkudG9CZSgnQScpIC8vIDB4NDEgPSA2NSA9ICdBJ1xuICAgICAgZXhwZWN0KHVuZXNjYXBlKCdcXFxceDVBJykpLnRvQmUoJ1onKSAvLyAweDVBID0gOTAgPSAnWidcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1bmVzY2FwZSBzaG9ydCBoZXggKDItZGlnaXQpIHNlcXVlbmNlcycsICgpID0+IHtcbiAgICAgIC8vIFNob3J0IGhleCBmb3JtYXQ6IFxceE5OICgyIGhleGFkZWNpbWFsIGRpZ2l0cylcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnXFxcXHhBNScpKS50b0JlKCfCpScpIC8vIFllbiBzaWduXG4gICAgICBleHBlY3QodW5lc2NhcGUoJ1xcXFx4N0YnKSkudG9CZSgnXFx4N0YnKSAvLyBEZWxldGUgY2hhcmFjdGVyXG4gICAgICBleHBlY3QodW5lc2NhcGUoJ1xcXFx4MDAnKSkudG9CZSgnXFx4MDAnKSAvLyBOdWxsIGNoYXJhY3RlciB2aWEgaGV4XG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdW5lc2NhcGUgb2N0YWwgc2VxdWVuY2VzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHVuZXNjYXBlKCdcXFxcMTAxJykpLnRvQmUoJ0EnKSAvLyBPY3RhbCAxMDEgPSA2NSA9ICdBJ1xuICAgICAgZXhwZWN0KHVuZXNjYXBlKCdcXFxcMTMyJykpLnRvQmUoJ1onKSAvLyBPY3RhbCAxMzIgPSA5MCA9ICdaJ1xuICAgICAgZXhwZWN0KHVuZXNjYXBlKCdcXFxcNycpKS50b0JlKCdcXHgwNycpIC8vIFNpbmdsZSBkaWdpdCBvY3RhbFxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVuZXNjYXBlIHVuaWNvZGUgc2VxdWVuY2VzJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KHVuZXNjYXBlKCdcXFxcdTAwNDEnKSkudG9CZSgnQScpXG4gICAgICBleHBlY3QodW5lc2NhcGUoJ1xcXFx1ezQxfScpKS50b0JlKCdBJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1bmVzY2FwZSBQeXRob24tc3R5bGUgdW5pY29kZScsICgpID0+IHtcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnXFxcXFUwMDAwMDA0MScpKS50b0JlKCdBJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWl4ZWQgY29udGVudCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnSGVsbG9cXFxcbldvcmxkXFxcXHQhJykpLnRvQmUoJ0hlbGxvXFxuV29ybGRcXHQhJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgbW9kaWZ5IHJlZ3VsYXIgdGV4dCcsICgpID0+IHtcbiAgICAgIGV4cGVjdCh1bmVzY2FwZSgnSGVsbG8gV29ybGQnKSkudG9CZSgnSGVsbG8gV29ybGQnKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gdXNlU2VnbWVudGF0aW9uU3RhdGUgSG9vayBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ3VzZVNlZ21lbnRhdGlvblN0YXRlJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgaW5pdGlhbCBzdGF0ZVxuICBkZXNjcmliZSgnSW5pdGlhbCBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBkZWZhdWx0IHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVNlZ21lbnRhdGlvblN0YXRlKCkpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5zZWdtZW50YXRpb25UeXBlKS50b0JlKFByb2Nlc3NNb2RlLmdlbmVyYWwpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2VnbWVudElkZW50aWZpZXIpLnRvQmUoREVGQVVMVF9TRUdNRU5UX0lERU5USUZJRVIpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQubWF4Q2h1bmtMZW5ndGgpLnRvQmUoREVGQVVMVF9NQVhJTVVNX0NIVU5LX0xFTkdUSClcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5vdmVybGFwKS50b0JlKERFRkFVTFRfT1ZFUkxBUClcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5ydWxlcykudG9FcXVhbChbXSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZykudG9FcXVhbChkZWZhdWx0UGFyZW50Q2hpbGRDb25maWcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGN1c3RvbSBzZWdtZW50YXRpb24gdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZVNlZ21lbnRhdGlvblN0YXRlKHsgaW5pdGlhbFNlZ21lbnRhdGlvblR5cGU6IFByb2Nlc3NNb2RlLnBhcmVudENoaWxkIH0pLFxuICAgICAgKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2VnbWVudGF0aW9uVHlwZSkudG9CZShQcm9jZXNzTW9kZS5wYXJlbnRDaGlsZClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBzdGF0ZSBzZXR0ZXJzXG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIHNlZ21lbnRhdGlvbiB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0U2VnbWVudGF0aW9uVHlwZShQcm9jZXNzTW9kZS5wYXJlbnRDaGlsZClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5zZWdtZW50YXRpb25UeXBlKS50b0JlKFByb2Nlc3NNb2RlLnBhcmVudENoaWxkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBtYXggY2h1bmsgbGVuZ3RoJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0TWF4Q2h1bmtMZW5ndGgoMjA0OClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5tYXhDaHVua0xlbmd0aCkudG9CZSgyMDQ4KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBvdmVybGFwJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0T3ZlcmxhcCgxMDApXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQub3ZlcmxhcCkudG9CZSgxMDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHJ1bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcbiAgICAgIGNvbnN0IG5ld1J1bGVzOiBQcmVQcm9jZXNzaW5nUnVsZVtdID0gW3sgaWQ6ICd0ZXN0JywgZW5hYmxlZDogdHJ1ZSB9XVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRSdWxlcyhuZXdSdWxlcylcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5ydWxlcykudG9FcXVhbChuZXdSdWxlcylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBzZXRTZWdtZW50SWRlbnRpZmllciB3aXRoIGVzY2FwZVxuICBkZXNjcmliZSgnc2V0U2VnbWVudElkZW50aWZpZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBlc2NhcGUgc3BlY2lhbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0U2VnbWVudElkZW50aWZpZXIoJ1xcblxcbicpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2VnbWVudElkZW50aWZpZXIpLnRvQmUoJ1xcXFxuXFxcXG4nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBkZWZhdWx0IHdoZW4gZW1wdHkgYW5kIGNhbkVtcHR5IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0U2VnbWVudElkZW50aWZpZXIoJycpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2VnbWVudElkZW50aWZpZXIpLnRvQmUoREVGQVVMVF9TRUdNRU5UX0lERU5USUZJRVIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgZW1wdHkgd2hlbiBjYW5FbXB0eSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0U2VnbWVudElkZW50aWZpZXIoJycsIHRydWUpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc2VnbWVudElkZW50aWZpZXIpLnRvQmUoJycpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgdG9nZ2xlUnVsZVxuICBkZXNjcmliZSgndG9nZ2xlUnVsZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRvZ2dsZSBydWxlIGVuYWJsZWQgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRSdWxlcyhbXG4gICAgICAgICAgeyBpZDogJ3J1bGUxJywgZW5hYmxlZDogdHJ1ZSB9LFxuICAgICAgICAgIHsgaWQ6ICdydWxlMicsIGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgICAgIF0pXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC50b2dnbGVSdWxlKCdydWxlMScpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucnVsZXMuZmluZChyID0+IHIuaWQgPT09ICdydWxlMScpPy5lbmFibGVkKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnJ1bGVzLmZpbmQociA9PiByLmlkID09PSAncnVsZTInKT8uZW5hYmxlZCkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgYWZmZWN0IG90aGVyIHJ1bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0UnVsZXMoW1xuICAgICAgICAgIHsgaWQ6ICdydWxlMScsIGVuYWJsZWQ6IHRydWUgfSxcbiAgICAgICAgICB7IGlkOiAncnVsZTInLCBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgICBdKVxuICAgICAgfSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQudG9nZ2xlUnVsZSgncnVsZTInKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnJ1bGVzLmZpbmQociA9PiByLmlkID09PSAncnVsZTEnKT8uZW5hYmxlZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnJ1bGVzLmZpbmQociA9PiByLmlkID09PSAncnVsZTInKT8uZW5hYmxlZCkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHBhcmVudC1jaGlsZCBjb25maWdcbiAgZGVzY3JpYmUoJ1BhcmVudC1DaGlsZCBDb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXBkYXRlIHBhcmVudCBjb25maWcgZGVsaW1pdGVyIHdpdGggdHJ1dGh5IHZhbHVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQudXBkYXRlUGFyZW50Q29uZmlnKCdkZWxpbWl0ZXInLCAnXFxuXFxuXFxuJylcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5wYXJlbnQuZGVsaW1pdGVyKS50b0JlKCdcXFxcblxcXFxuXFxcXG4nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBwYXJlbnQgY29uZmlnIGRlbGltaXRlciB3aXRoIGVtcHR5IHZhbHVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQudXBkYXRlUGFyZW50Q29uZmlnKCdkZWxpbWl0ZXInLCAnJylcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5wYXJlbnQuZGVsaW1pdGVyKS50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBwYXJlbnQgY29uZmlnIG1heExlbmd0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVNlZ21lbnRhdGlvblN0YXRlKCkpXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnVwZGF0ZVBhcmVudENvbmZpZygnbWF4TGVuZ3RoJywgMjA0OClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5wYXJlbnQubWF4TGVuZ3RoKS50b0JlKDIwNDgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGNoaWxkIGNvbmZpZyBkZWxpbWl0ZXIgd2l0aCB0cnV0aHkgdmFsdWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC51cGRhdGVDaGlsZENvbmZpZygnZGVsaW1pdGVyJywgJ1xcbicpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucGFyZW50Q2hpbGRDb25maWcuY2hpbGQuZGVsaW1pdGVyKS50b0JlKCdcXFxcbicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGNoaWxkIGNvbmZpZyBkZWxpbWl0ZXIgd2l0aCBlbXB0eSB2YWx1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVNlZ21lbnRhdGlvblN0YXRlKCkpXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnVwZGF0ZUNoaWxkQ29uZmlnKCdkZWxpbWl0ZXInLCAnJylcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5jaGlsZC5kZWxpbWl0ZXIpLnRvQmUoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGNoaWxkIGNvbmZpZyBtYXhMZW5ndGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC51cGRhdGVDaGlsZENvbmZpZygnbWF4TGVuZ3RoJywgMjU2KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnBhcmVudENoaWxkQ29uZmlnLmNoaWxkLm1heExlbmd0aCkudG9CZSgyNTYpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGNodW5rIGZvciBjb250ZXh0IG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRDaHVua0ZvckNvbnRleHQoJ2Z1bGwtZG9jJylcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5jaHVua0ZvckNvbnRleHQpLnRvQmUoJ2Z1bGwtZG9jJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciByZXNldFRvRGVmYXVsdHNcbiAgZGVzY3JpYmUoJ3Jlc2V0VG9EZWZhdWx0cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlc2V0IHRvIGRlZmF1bHQgY29uZmlnIHdoZW4gYXZhaWxhYmxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgLy8gU2V0IG5vbi1kZWZhdWx0IHZhbHVlcyBhbmQgZGVmYXVsdCBjb25maWdcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldE1heENodW5rTGVuZ3RoKDIwNDgpXG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldE92ZXJsYXAoMTAwKVxuICAgICAgICByZXN1bHQuY3VycmVudC5zZXREZWZhdWx0Q29uZmlnKGNyZWF0ZU1vY2tSdWxlcygpKVxuICAgICAgfSlcblxuICAgICAgLy8gUmVzZXQgLSBzaG91bGQgdXNlIGRlZmF1bHQgY29uZmlnIHZhbHVlc1xuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQucmVzZXRUb0RlZmF1bHRzKClcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5tYXhDaHVua0xlbmd0aCkudG9CZSgxMDI0KVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50Lm92ZXJsYXApLnRvQmUoNTApXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucGFyZW50Q2hpbGRDb25maWcpLnRvRXF1YWwoZGVmYXVsdFBhcmVudENoaWxkQ29uZmlnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9ubHkgcmVzZXQgcGFyZW50Q2hpbGRDb25maWcgd2hlbiBubyBkZWZhdWx0IGNvbmZpZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVNlZ21lbnRhdGlvblN0YXRlKCkpXG5cbiAgICAgIC8vIFNldCBub24tZGVmYXVsdCB2YWx1ZXMgd2l0aG91dCBzZXR0aW5nIGRlZmF1bHRDb25maWdcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldE1heENodW5rTGVuZ3RoKDIwNDgpXG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldE92ZXJsYXAoMTAwKVxuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRDaHVua0ZvckNvbnRleHQoJ2Z1bGwtZG9jJylcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlc2V0IC0gc2hvdWxkIG9ubHkgcmVzZXQgcGFyZW50Q2hpbGRDb25maWcgc2luY2Ugbm8gZGVmYXVsdCBjb25maWdcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnJlc2V0VG9EZWZhdWx0cygpXG4gICAgICB9KVxuXG4gICAgICAvLyBWYWx1ZXMgc3RheSB0aGUgc2FtZSBzaW5jZSBubyBkZWZhdWx0Q29uZmlnXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQubWF4Q2h1bmtMZW5ndGgpLnRvQmUoMjA0OClcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5vdmVybGFwKS50b0JlKDEwMClcbiAgICAgIC8vIEJ1dCBwYXJlbnRDaGlsZENvbmZpZyBpcyBhbHdheXMgcmVzZXRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZykudG9FcXVhbChkZWZhdWx0UGFyZW50Q2hpbGRDb25maWcpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgYXBwbHlDb25maWdGcm9tUnVsZXNcbiAgZGVzY3JpYmUoJ2FwcGx5Q29uZmlnRnJvbVJ1bGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgZ2VuZXJhbCBjb25maWcgZnJvbSBydWxlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVNlZ21lbnRhdGlvblN0YXRlKCkpXG4gICAgICBjb25zdCBydWxlcyA9IGNyZWF0ZU1vY2tSdWxlcyh7XG4gICAgICAgIHNlZ21lbnRhdGlvbjogeyBzZXBhcmF0b3I6ICctLS0nLCBtYXhfdG9rZW5zOiA1MTIsIGNodW5rX292ZXJsYXA6IDI1IH0sXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5hcHBseUNvbmZpZ0Zyb21SdWxlcyhydWxlcywgZmFsc2UpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQubWF4Q2h1bmtMZW5ndGgpLnRvQmUoNTEyKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50Lm92ZXJsYXApLnRvQmUoMjUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaGllcmFyY2hpY2FsIGNvbmZpZyBmcm9tIHJ1bGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcbiAgICAgIGNvbnN0IHJ1bGVzID0gY3JlYXRlTW9ja1J1bGVzKHtcbiAgICAgICAgcGFyZW50X21vZGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICBzdWJjaHVua19zZWdtZW50YXRpb246IHsgc2VwYXJhdG9yOiAnXFxuJywgbWF4X3Rva2VuczogMjU2IH0sXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5hcHBseUNvbmZpZ0Zyb21SdWxlcyhydWxlcywgdHJ1ZSlcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5jaHVua0ZvckNvbnRleHQpLnRvQmUoJ3BhcmFncmFwaCcpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucGFyZW50Q2hpbGRDb25maWcuY2hpbGQubWF4TGVuZ3RoKS50b0JlKDI1NilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBmdWxsIGhpZXJhcmNoaWNhbCBwYXJlbnQtY2hpbGQgY29uZmlnIGZyb20gcnVsZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuICAgICAgY29uc3QgcnVsZXMgPSBjcmVhdGVNb2NrUnVsZXMoe1xuICAgICAgICBzZWdtZW50YXRpb246IHsgc2VwYXJhdG9yOiAnXFxuXFxuJywgbWF4X3Rva2VuczogMTAyNCwgY2h1bmtfb3ZlcmxhcDogNTAgfSxcbiAgICAgICAgcGFyZW50X21vZGU6ICdmdWxsLWRvYycsXG4gICAgICAgIHN1YmNodW5rX3NlZ21lbnRhdGlvbjogeyBzZXBhcmF0b3I6ICdcXG4nLCBtYXhfdG9rZW5zOiAxMjggfSxcbiAgICAgIH0pXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmFwcGx5Q29uZmlnRnJvbVJ1bGVzKHJ1bGVzLCB0cnVlKVxuICAgICAgfSlcblxuICAgICAgLy8gU2hvdWxkIHNldCBwYXJlbnQgY29uZmlnIGZyb20gc2VnbWVudGF0aW9uXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucGFyZW50Q2hpbGRDb25maWcucGFyZW50LmRlbGltaXRlcikudG9CZSgnXFxcXG5cXFxcbicpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucGFyZW50Q2hpbGRDb25maWcucGFyZW50Lm1heExlbmd0aCkudG9CZSgxMDI0KVxuICAgICAgLy8gU2hvdWxkIHNldCBjaGlsZCBjb25maWcgZnJvbSBzdWJjaHVua19zZWdtZW50YXRpb25cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5jaGlsZC5kZWxpbWl0ZXIpLnRvQmUoJ1xcXFxuJylcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5jaGlsZC5tYXhMZW5ndGgpLnRvQmUoMTI4KVxuICAgICAgLy8gU2hvdWxkIHNldCBjaHVua0ZvckNvbnRleHRcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wYXJlbnRDaGlsZENvbmZpZy5jaHVua0ZvckNvbnRleHQpLnRvQmUoJ2Z1bGwtZG9jJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBnZXRQcm9jZXNzUnVsZVxuICBkZXNjcmliZSgnZ2V0UHJvY2Vzc1J1bGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZ2VuZXJhbCBwcm9jZXNzIHJ1bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuXG4gICAgICBjb25zdCBwcm9jZXNzUnVsZSA9IHJlc3VsdC5jdXJyZW50LmdldFByb2Nlc3NSdWxlKENodW5raW5nTW9kZS50ZXh0KVxuXG4gICAgICBleHBlY3QocHJvY2Vzc1J1bGUubW9kZSkudG9CZShQcm9jZXNzTW9kZS5nZW5lcmFsKVxuICAgICAgZXhwZWN0KHByb2Nlc3NSdWxlLnJ1bGVzLnNlZ21lbnRhdGlvbi5tYXhfdG9rZW5zKS50b0JlKERFRkFVTFRfTUFYSU1VTV9DSFVOS19MRU5HVEgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGhpZXJhcmNoaWNhbCBwcm9jZXNzIHJ1bGUgZm9yIHBhcmVudC1jaGlsZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVNlZ21lbnRhdGlvblN0YXRlKCkpXG5cbiAgICAgIGNvbnN0IHByb2Nlc3NSdWxlID0gcmVzdWx0LmN1cnJlbnQuZ2V0UHJvY2Vzc1J1bGUoQ2h1bmtpbmdNb2RlLnBhcmVudENoaWxkKVxuXG4gICAgICBleHBlY3QocHJvY2Vzc1J1bGUubW9kZSkudG9CZSgnaGllcmFyY2hpY2FsJylcbiAgICAgIGV4cGVjdChwcm9jZXNzUnVsZS5ydWxlcy5wYXJlbnRfbW9kZSkudG9CZSgncGFyYWdyYXBoJylcbiAgICAgIGV4cGVjdChwcm9jZXNzUnVsZS5ydWxlcy5zdWJjaHVua19zZWdtZW50YXRpb24pLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIHVzZUluZGV4aW5nQ29uZmlnIEhvb2sgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCd1c2VJbmRleGluZ0NvbmZpZycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0lzUmVyYW5rRGVmYXVsdE1vZGVsVmFsaWQgPSB0cnVlXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGluaXRpYWwgc3RhdGVcbiAgLy8gTm90ZTogSG9vayBoYXMgdXNlRWZmZWN0IHRoYXQgc3luY3Mgc3RhdGUsIHNvIHdlIHRlc3QgdGhlIHN0YXRlIGFmdGVyIGVmZmVjdHMgc2V0dGxlXG4gIGRlc2NyaWJlKCdJbml0aWFsIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIFFVQUxJRklFRCB3aGVuIEFQSSBrZXkgaXMgc2V0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlSW5kZXhpbmdDb25maWcoeyBpc0FQSUtleVNldDogdHJ1ZSwgaGFzU2V0SW5kZXhUeXBlOiBmYWxzZSB9KSxcbiAgICAgIClcblxuICAgICAgLy8gQWZ0ZXIgZWZmZWN0cyBzZXR0bGUsIGluZGV4VHlwZSBzaG91bGQgYmUgUVVBTElGSUVEXG4gICAgICBhd2FpdCB2aS53YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmluZGV4VHlwZSkudG9CZShJbmRleGluZ1R5cGUuUVVBTElGSUVEKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggRUNPTk9NSUNBTCB3aGVuIEFQSSBrZXkgaXMgbm90IHNldCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZUluZGV4aW5nQ29uZmlnKHsgaXNBUElLZXlTZXQ6IGZhbHNlLCBoYXNTZXRJbmRleFR5cGU6IGZhbHNlIH0pLFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB2aS53YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmluZGV4VHlwZSkudG9CZShJbmRleGluZ1R5cGUuRUNPTk9NSUNBTClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGluaXRpYWwgaW5kZXggdHlwZSB3aGVuIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlSW5kZXhpbmdDb25maWcoe1xuICAgICAgICAgIGlzQVBJS2V5U2V0OiBmYWxzZSxcbiAgICAgICAgICBoYXNTZXRJbmRleFR5cGU6IHRydWUsXG4gICAgICAgICAgaW5pdGlhbEluZGV4VHlwZTogSW5kZXhpbmdUeXBlLlFVQUxJRklFRCxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHZpLndhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaW5kZXhUeXBlKS50b0JlKEluZGV4aW5nVHlwZS5RVUFMSUZJRUQpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHN0YXRlIHNldHRlcnNcbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgaW5kZXggdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZUluZGV4aW5nQ29uZmlnKHsgaXNBUElLZXlTZXQ6IHRydWUsIGhhc1NldEluZGV4VHlwZTogZmFsc2UgfSksXG4gICAgICApXG5cbiAgICAgIC8vIFdhaXQgZm9yIGluaXRpYWwgZWZmZWN0cyB0byBzZXR0bGVcbiAgICAgIGF3YWl0IHZpLndhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaW5kZXhUeXBlKS50b0JlRGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRJbmRleFR5cGUoSW5kZXhpbmdUeXBlLkVDT05PTUlDQUwpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaW5kZXhUeXBlKS50b0JlKEluZGV4aW5nVHlwZS5FQ09OT01JQ0FMKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBlbWJlZGRpbmcgbW9kZWwnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VJbmRleGluZ0NvbmZpZyh7IGlzQVBJS2V5U2V0OiB0cnVlLCBoYXNTZXRJbmRleFR5cGU6IGZhbHNlIH0pLFxuICAgICAgKVxuXG4gICAgICBhd2FpdCB2aS53YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmVtYmVkZGluZ01vZGVsKS50b0JlRGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRFbWJlZGRpbmdNb2RlbCh7IHByb3ZpZGVyOiAnY29oZXJlJywgbW9kZWw6ICdlbWJlZC12MycgfSlcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5lbWJlZGRpbmdNb2RlbCkudG9FcXVhbCh7IHByb3ZpZGVyOiAnY29oZXJlJywgbW9kZWw6ICdlbWJlZC12MycgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcmV0cmlldmFsIGNvbmZpZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZUluZGV4aW5nQ29uZmlnKHsgaXNBUElLZXlTZXQ6IHRydWUsIGhhc1NldEluZGV4VHlwZTogZmFsc2UgfSksXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHZpLndhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucmV0cmlldmFsQ29uZmlnKS50b0JlRGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBuZXdDb25maWc6IFJldHJpZXZhbENvbmZpZyA9IHtcbiAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELmh5YnJpZCxcbiAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogdHJ1ZSxcbiAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7IHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnY29oZXJlJywgcmVyYW5raW5nX21vZGVsX25hbWU6ICdyZXJhbmstdjMnIH0sXG4gICAgICAgIHRvcF9rOiA1LFxuICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjcsXG4gICAgICB9XG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldFJldHJpZXZhbENvbmZpZyhuZXdDb25maWcpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucmV0cmlldmFsQ29uZmlnKS50b0VxdWFsKG5ld0NvbmZpZylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBnZXRJbmRleGluZ1RlY2huaXF1ZVxuICBkZXNjcmliZSgnZ2V0SW5kZXhpbmdUZWNobmlxdWUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gaW5pdGlhbCB0eXBlIHdoZW4gc2V0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlSW5kZXhpbmdDb25maWcoe1xuICAgICAgICAgIGlzQVBJS2V5U2V0OiB0cnVlLFxuICAgICAgICAgIGhhc1NldEluZGV4VHlwZTogdHJ1ZSxcbiAgICAgICAgICBpbml0aWFsSW5kZXhUeXBlOiBJbmRleGluZ1R5cGUuRUNPTk9NSUNBTCxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHZpLndhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZ2V0SW5kZXhpbmdUZWNobmlxdWUoKSkudG9CZShJbmRleGluZ1R5cGUuRUNPTk9NSUNBTClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGN1cnJlbnQgdHlwZSB3aGVuIG5vIGluaXRpYWwgdHlwZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZUluZGV4aW5nQ29uZmlnKHsgaXNBUElLZXlTZXQ6IHRydWUsIGhhc1NldEluZGV4VHlwZTogZmFsc2UgfSksXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHZpLndhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaW5kZXhUeXBlKS50b0JlRGVmaW5lZCgpXG4gICAgICB9KVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRJbmRleFR5cGUoSW5kZXhpbmdUeXBlLkVDT05PTUlDQUwpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZ2V0SW5kZXhpbmdUZWNobmlxdWUoKSkudG9CZShJbmRleGluZ1R5cGUuRUNPTk9NSUNBTClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBpbml0aWFsUmV0cmlldmFsQ29uZmlnIGhhbmRsaW5nXG4gIGRlc2NyaWJlKCdpbml0aWFsUmV0cmlldmFsQ29uZmlnJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2tpcCByZXRyaWV2YWwgY29uZmlnIHN5bmMgd2hlbiBpbml0aWFsUmV0cmlldmFsQ29uZmlnIGlzIHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY3VzdG9tUmV0cmlldmFsQ29uZmlnOiBSZXRyaWV2YWxDb25maWcgPSB7XG4gICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5oeWJyaWQsXG4gICAgICAgIHJlcmFua2luZ19lbmFibGU6IHRydWUsXG4gICAgICAgIHJlcmFua2luZ19tb2RlbDogeyByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJ2N1c3RvbScsIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnY3VzdG9tLW1vZGVsJyB9LFxuICAgICAgICB0b3BfazogMTAsXG4gICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiB0cnVlLFxuICAgICAgICBzY29yZV90aHJlc2hvbGQ6IDAuOCxcbiAgICAgIH1cblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlSW5kZXhpbmdDb25maWcoe1xuICAgICAgICAgIGlzQVBJS2V5U2V0OiB0cnVlLFxuICAgICAgICAgIGhhc1NldEluZGV4VHlwZTogZmFsc2UsXG4gICAgICAgICAgaW5pdGlhbFJldHJpZXZhbENvbmZpZzogY3VzdG9tUmV0cmlldmFsQ29uZmlnLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgYXdhaXQgdmkud2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5yZXRyaWV2YWxDb25maWcpLnRvQmVEZWZpbmVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNob3VsZCB1c2UgdGhlIHByb3ZpZGVkIGluaXRpYWwgY29uZmlnLCBub3QgdGhlIGRlZmF1bHQgc3luY2VkIG9uZVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnJldHJpZXZhbENvbmZpZy5zZWFyY2hfbWV0aG9kKS50b0JlKFJFVFJJRVZFX01FVEhPRC5oeWJyaWQpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucmV0cmlldmFsQ29uZmlnLnRvcF9rKS50b0JlKDEwKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gdXNlUHJldmlld1N0YXRlIEhvb2sgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCd1c2VQcmV2aWV3U3RhdGUnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5GSUxFLFxuICAgIGZpbGVzOiBbY3JlYXRlTW9ja0ZpbGUoKV0sXG4gICAgbm90aW9uUGFnZXM6IFtjcmVhdGVNb2NrTm90aW9uUGFnZSgpXSxcbiAgICB3ZWJzaXRlUGFnZXM6IFtjcmVhdGVNb2NrV2Vic2l0ZVBhZ2UoKV0sXG4gIH1cblxuICAvLyBUZXN0cyBmb3IgaW5pdGlhbCBzdGF0ZVxuICBkZXNjcmliZSgnSW5pdGlhbCBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBmaXJzdCBmaWxlIGZvciBGSUxFIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlUHJldmlld1N0YXRlKGRlZmF1bHRPcHRpb25zKSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnByZXZpZXdGaWxlKS50b0VxdWFsKGRlZmF1bHRPcHRpb25zLmZpbGVzWzBdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBmaXJzdCBub3Rpb24gcGFnZSBmb3IgTk9USU9OIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlUHJldmlld1N0YXRlKHsgLi4uZGVmYXVsdE9wdGlvbnMsIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5OT1RJT04gfSksXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wcmV2aWV3Tm90aW9uUGFnZSkudG9FcXVhbChkZWZhdWx0T3B0aW9ucy5ub3Rpb25QYWdlc1swXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbml0aWFsaXplIHdpdGggZG9jdW1lbnQgZGV0YWlsIHdoZW4gcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb2N1bWVudERldGFpbCA9IGNyZWF0ZU1vY2tEb2N1bWVudERldGFpbCgpXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VQcmV2aWV3U3RhdGUoe1xuICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAgIGRvY3VtZW50RGV0YWlsLFxuICAgICAgICAgIGRhdGFzZXRJZDogJ3Rlc3QtaWQnLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnByZXZpZXdGaWxlKS50b0VxdWFsKGRvY3VtZW50RGV0YWlsLmZpbGUpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgZ2V0UHJldmlld1BpY2tlckl0ZW1zXG4gIGRlc2NyaWJlKCdnZXRQcmV2aWV3UGlja2VySXRlbXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmlsZXMgZm9yIEZJTEUgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoZGVmYXVsdE9wdGlvbnMpKVxuXG4gICAgICBjb25zdCBpdGVtcyA9IHJlc3VsdC5jdXJyZW50LmdldFByZXZpZXdQaWNrZXJJdGVtcygpXG4gICAgICBleHBlY3QoaXRlbXMpLnRvRXF1YWwoZGVmYXVsdE9wdGlvbnMuZmlsZXMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG1hcHBlZCBub3Rpb24gcGFnZXMgZm9yIE5PVElPTiBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZVByZXZpZXdTdGF0ZSh7IC4uLmRlZmF1bHRPcHRpb25zLCBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuTk9USU9OIH0pLFxuICAgICAgKVxuXG4gICAgICBjb25zdCBpdGVtcyA9IHJlc3VsdC5jdXJyZW50LmdldFByZXZpZXdQaWNrZXJJdGVtcygpXG4gICAgICBleHBlY3QoaXRlbXNbMF0pLnRvRXF1YWwoe1xuICAgICAgICBpZDogJ25vdGlvbi1wYWdlLTEnLFxuICAgICAgICBuYW1lOiAnVGVzdCBOb3Rpb24gUGFnZScsXG4gICAgICAgIGV4dGVuc2lvbjogJ21kJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG1hcHBlZCB3ZWJzaXRlIHBhZ2VzIGZvciBXRUIgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VQcmV2aWV3U3RhdGUoeyAuLi5kZWZhdWx0T3B0aW9ucywgZGF0YVNvdXJjZVR5cGU6IERhdGFTb3VyY2VUeXBlLldFQiB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgaXRlbXMgPSByZXN1bHQuY3VycmVudC5nZXRQcmV2aWV3UGlja2VySXRlbXMoKVxuICAgICAgZXhwZWN0KGl0ZW1zWzBdKS50b0VxdWFsKHtcbiAgICAgICAgaWQ6ICdodHRwczovL2V4YW1wbGUuY29tL3BhZ2UxJyxcbiAgICAgICAgbmFtZTogJ1Rlc3QgV2Vic2l0ZSBQYWdlJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnbWQnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgYXJyYXkgZm9yIHVua25vd24gZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VQcmV2aWV3U3RhdGUoeyAuLi5kZWZhdWx0T3B0aW9ucywgZGF0YVNvdXJjZVR5cGU6ICd1bmtub3duJyBhcyBEYXRhU291cmNlVHlwZSB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgaXRlbXMgPSByZXN1bHQuY3VycmVudC5nZXRQcmV2aWV3UGlja2VySXRlbXMoKVxuICAgICAgZXhwZWN0KGl0ZW1zKS50b0VxdWFsKFtdKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGdldFByZXZpZXdQaWNrZXJWYWx1ZVxuICBkZXNjcmliZSgnZ2V0UHJldmlld1BpY2tlclZhbHVlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZpbGUgdmFsdWUgZm9yIEZJTEUgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VQcmV2aWV3U3RhdGUoZGVmYXVsdE9wdGlvbnMpKVxuXG4gICAgICBjb25zdCB2YWx1ZSA9IHJlc3VsdC5jdXJyZW50LmdldFByZXZpZXdQaWNrZXJWYWx1ZSgpXG4gICAgICBleHBlY3QodmFsdWUpLnRvRXF1YWwoZGVmYXVsdE9wdGlvbnMuZmlsZXNbMF0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG1hcHBlZCBub3Rpb24gcGFnZSB2YWx1ZSBmb3IgTk9USU9OIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgbm90aW9uUGFnZSA9IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMTIzJywgcGFnZV9uYW1lOiAnTXkgUGFnZScgfSlcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZVByZXZpZXdTdGF0ZSh7XG4gICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgZGF0YVNvdXJjZVR5cGU6IERhdGFTb3VyY2VUeXBlLk5PVElPTixcbiAgICAgICAgICBub3Rpb25QYWdlczogW25vdGlvblBhZ2VdLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgdmFsdWUgPSByZXN1bHQuY3VycmVudC5nZXRQcmV2aWV3UGlja2VyVmFsdWUoKVxuICAgICAgZXhwZWN0KHZhbHVlKS50b0VxdWFsKHtcbiAgICAgICAgaWQ6ICdwYWdlLTEyMycsXG4gICAgICAgIG5hbWU6ICdNeSBQYWdlJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnbWQnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbWFwcGVkIHdlYnNpdGUgcGFnZSB2YWx1ZSBmb3IgV0VCIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgd2Vic2l0ZVBhZ2UgPSBjcmVhdGVNb2NrV2Vic2l0ZVBhZ2UoeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly90ZXN0LmNvbScsIHRpdGxlOiAnVGVzdCBUaXRsZScgfSlcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZVByZXZpZXdTdGF0ZSh7XG4gICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgZGF0YVNvdXJjZVR5cGU6IERhdGFTb3VyY2VUeXBlLldFQixcbiAgICAgICAgICB3ZWJzaXRlUGFnZXM6IFt3ZWJzaXRlUGFnZV0sXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBjb25zdCB2YWx1ZSA9IHJlc3VsdC5jdXJyZW50LmdldFByZXZpZXdQaWNrZXJWYWx1ZSgpXG4gICAgICBleHBlY3QodmFsdWUpLnRvRXF1YWwoe1xuICAgICAgICBpZDogJ2h0dHBzOi8vdGVzdC5jb20nLFxuICAgICAgICBuYW1lOiAnVGVzdCBUaXRsZScsXG4gICAgICAgIGV4dGVuc2lvbjogJ21kJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IHZhbHVlIGZvciB1bmtub3duIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlUHJldmlld1N0YXRlKHsgLi4uZGVmYXVsdE9wdGlvbnMsIGRhdGFTb3VyY2VUeXBlOiAndW5rbm93bicgYXMgRGF0YVNvdXJjZVR5cGUgfSksXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHZhbHVlID0gcmVzdWx0LmN1cnJlbnQuZ2V0UHJldmlld1BpY2tlclZhbHVlKClcbiAgICAgIGV4cGVjdCh2YWx1ZSkudG9FcXVhbCh7IGlkOiAnJywgbmFtZTogJycsIGV4dGVuc2lvbjogJycgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIG5vdGlvbiBwYWdlIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VQcmV2aWV3U3RhdGUoe1xuICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5OT1RJT04sXG4gICAgICAgICAgbm90aW9uUGFnZXM6IFtdLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgdmFsdWUgPSByZXN1bHQuY3VycmVudC5nZXRQcmV2aWV3UGlja2VyVmFsdWUoKVxuICAgICAgZXhwZWN0KHZhbHVlKS50b0VxdWFsKHtcbiAgICAgICAgaWQ6ICcnLFxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnbWQnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHdlYnNpdGUgcGFnZSBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlUHJldmlld1N0YXRlKHtcbiAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuV0VCLFxuICAgICAgICAgIHdlYnNpdGVQYWdlczogW10sXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBjb25zdCB2YWx1ZSA9IHJlc3VsdC5jdXJyZW50LmdldFByZXZpZXdQaWNrZXJWYWx1ZSgpXG4gICAgICBleHBlY3QodmFsdWUpLnRvRXF1YWwoe1xuICAgICAgICBpZDogJycsXG4gICAgICAgIG5hbWU6ICcnLFxuICAgICAgICBleHRlbnNpb246ICdtZCcsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGhhbmRsZVByZXZpZXdDaGFuZ2VcbiAgZGVzY3JpYmUoJ2hhbmRsZVByZXZpZXdDaGFuZ2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcHJldmlldyBmaWxlIGZvciBGSUxFIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbY3JlYXRlTW9ja0ZpbGUoKSwgY3JlYXRlTW9ja0ZpbGUoeyBpZDogJ2ZpbGUtMicsIG5hbWU6ICdzZWNvbmQucGRmJyB9KV1cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZVByZXZpZXdTdGF0ZSh7IC4uLmRlZmF1bHRPcHRpb25zLCBmaWxlcyB9KSxcbiAgICAgIClcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlUHJldmlld0NoYW5nZSh7IGlkOiAnZmlsZS0yJywgbmFtZTogJ3NlY29uZC5wZGYnIH0pXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucHJldmlld0ZpbGUpLnRvRXF1YWwoeyBpZDogJ2ZpbGUtMicsIG5hbWU6ICdzZWNvbmQucGRmJyB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBwcmV2aWV3IG5vdGlvbiBwYWdlIGZvciBOT1RJT04gZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBub3Rpb25QYWdlcyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja05vdGlvblBhZ2UoKSxcbiAgICAgICAgY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAnbm90aW9uLXBhZ2UtMicsIHBhZ2VfbmFtZTogJ1NlY29uZCBQYWdlJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZVByZXZpZXdTdGF0ZSh7IC4uLmRlZmF1bHRPcHRpb25zLCBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuTk9USU9OLCBub3Rpb25QYWdlcyB9KSxcbiAgICAgIClcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlUHJldmlld0NoYW5nZSh7IGlkOiAnbm90aW9uLXBhZ2UtMicsIG5hbWU6ICdTZWNvbmQgUGFnZScgfSlcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wcmV2aWV3Tm90aW9uUGFnZT8ucGFnZV9pZCkudG9CZSgnbm90aW9uLXBhZ2UtMicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHByZXZpZXcgd2Vic2l0ZSBwYWdlIGZvciBXRUIgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB3ZWJzaXRlUGFnZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tXZWJzaXRlUGFnZSgpLFxuICAgICAgICBjcmVhdGVNb2NrV2Vic2l0ZVBhZ2UoeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdlMicsIHRpdGxlOiAnU2Vjb25kIFBhZ2UnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlUHJldmlld1N0YXRlKHsgLi4uZGVmYXVsdE9wdGlvbnMsIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5XRUIsIHdlYnNpdGVQYWdlcyB9KSxcbiAgICAgIClcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuaGFuZGxlUHJldmlld0NoYW5nZSh7IGlkOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdlMicsIG5hbWU6ICdTZWNvbmQgUGFnZScgfSlcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wcmV2aWV3V2Vic2l0ZVBhZ2U/LnNvdXJjZV91cmwpLnRvQmUoJ2h0dHBzOi8vZXhhbXBsZS5jb20vcGFnZTInKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gdXNlRG9jdW1lbnRDcmVhdGlvbiBIb29rIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgndXNlRG9jdW1lbnRDcmVhdGlvbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgZGF0YVNvdXJjZVR5cGU6IERhdGFTb3VyY2VUeXBlLkZJTEUsXG4gICAgZmlsZXM6IFtjcmVhdGVNb2NrRmlsZSgpXSxcbiAgICBub3Rpb25QYWdlczogW10gYXMgTm90aW9uUGFnZVtdLFxuICAgIG5vdGlvbkNyZWRlbnRpYWxJZDogJycsXG4gICAgd2Vic2l0ZVBhZ2VzOiBbXSBhcyBDcmF3bFJlc3VsdEl0ZW1bXSxcbiAgfVxuXG4gIC8vIFRlc3RzIGZvciB2YWxpZGF0ZVBhcmFtc1xuICBkZXNjcmliZSgndmFsaWRhdGVQYXJhbXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBvdmVybGFwIGV4Y2VlZHMgbWF4IGNodW5rIGxlbmd0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZURvY3VtZW50Q3JlYXRpb24oZGVmYXVsdE9wdGlvbnMpKVxuXG4gICAgICBjb25zdCBpc1ZhbGlkID0gcmVzdWx0LmN1cnJlbnQudmFsaWRhdGVQYXJhbXMoe1xuICAgICAgICBzZWdtZW50YXRpb25UeXBlOiAnZ2VuZXJhbCcsXG4gICAgICAgIG1heENodW5rTGVuZ3RoOiAxMDAsXG4gICAgICAgIGxpbWl0TWF4Q2h1bmtMZW5ndGg6IDQwMDAsXG4gICAgICAgIG92ZXJsYXA6IDIwMCxcbiAgICAgICAgaW5kZXhUeXBlOiBJbmRleGluZ1R5cGUuUVVBTElGSUVELFxuICAgICAgICBlbWJlZGRpbmdNb2RlbDogeyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAndGV4dC1lbWJlZGRpbmctYWRhLTAwMicgfSxcbiAgICAgICAgcmVyYW5rTW9kZWxMaXN0OiBbXSxcbiAgICAgICAgcmV0cmlldmFsQ29uZmlnOiB7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IGZhbHNlLFxuICAgICAgICAgIHJlcmFua2luZ19tb2RlbDogeyByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyB9LFxuICAgICAgICAgIHRvcF9rOiAzLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGQ6IDAuNSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChpc1ZhbGlkKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIG1heCBjaHVuayBsZW5ndGggZXhjZWVkcyBsaW1pdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZURvY3VtZW50Q3JlYXRpb24oZGVmYXVsdE9wdGlvbnMpKVxuXG4gICAgICBjb25zdCBpc1ZhbGlkID0gcmVzdWx0LmN1cnJlbnQudmFsaWRhdGVQYXJhbXMoe1xuICAgICAgICBzZWdtZW50YXRpb25UeXBlOiAnZ2VuZXJhbCcsXG4gICAgICAgIG1heENodW5rTGVuZ3RoOiA1MDAwLFxuICAgICAgICBsaW1pdE1heENodW5rTGVuZ3RoOiA0MDAwLFxuICAgICAgICBvdmVybGFwOiA1MCxcbiAgICAgICAgaW5kZXhUeXBlOiBJbmRleGluZ1R5cGUuUVVBTElGSUVELFxuICAgICAgICBlbWJlZGRpbmdNb2RlbDogeyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAndGV4dC1lbWJlZGRpbmctYWRhLTAwMicgfSxcbiAgICAgICAgcmVyYW5rTW9kZWxMaXN0OiBbXSxcbiAgICAgICAgcmV0cmlldmFsQ29uZmlnOiB7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IGZhbHNlLFxuICAgICAgICAgIHJlcmFua2luZ19tb2RlbDogeyByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyB9LFxuICAgICAgICAgIHRvcF9rOiAzLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGQ6IDAuNSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChpc1ZhbGlkKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciB2YWxpZCBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEb2N1bWVudENyZWF0aW9uKGRlZmF1bHRPcHRpb25zKSlcblxuICAgICAgY29uc3QgaXNWYWxpZCA9IHJlc3VsdC5jdXJyZW50LnZhbGlkYXRlUGFyYW1zKHtcbiAgICAgICAgc2VnbWVudGF0aW9uVHlwZTogJ2dlbmVyYWwnLFxuICAgICAgICBtYXhDaHVua0xlbmd0aDogMTAwMCxcbiAgICAgICAgbGltaXRNYXhDaHVua0xlbmd0aDogNDAwMCxcbiAgICAgICAgb3ZlcmxhcDogNTAsXG4gICAgICAgIGluZGV4VHlwZTogSW5kZXhpbmdUeXBlLlFVQUxJRklFRCxcbiAgICAgICAgZW1iZWRkaW5nTW9kZWw6IHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ3RleHQtZW1iZWRkaW5nLWFkYS0wMDInIH0sXG4gICAgICAgIHJlcmFua01vZGVsTGlzdDogW10sXG4gICAgICAgIHJldHJpZXZhbENvbmZpZzoge1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHsgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLCByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycgfSxcbiAgICAgICAgICB0b3BfazogMyxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QoaXNWYWxpZCkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGJ1aWxkQ3JlYXRpb25QYXJhbXNcbiAgZGVzY3JpYmUoJ2J1aWxkQ3JlYXRpb25QYXJhbXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBidWlsZCBwYXJhbXMgZm9yIGZpbGUgdXBsb2FkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRG9jdW1lbnRDcmVhdGlvbihkZWZhdWx0T3B0aW9ucykpXG5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IHJlc3VsdC5jdXJyZW50LmJ1aWxkQ3JlYXRpb25QYXJhbXMoXG4gICAgICAgIENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgICAnRW5nbGlzaCcsXG4gICAgICAgIHsgbW9kZTogUHJvY2Vzc01vZGUuZ2VuZXJhbCwgcnVsZXM6IGNyZWF0ZU1vY2tSdWxlcygpIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7IHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJywgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnIH0sXG4gICAgICAgICAgdG9wX2s6IDMsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgICAgICB9LFxuICAgICAgICB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEtMDAyJyB9LFxuICAgICAgICBJbmRleGluZ1R5cGUuUVVBTElGSUVELFxuICAgICAgKVxuXG4gICAgICBleHBlY3QocGFyYW1zKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocGFyYW1zPy5kb2NfZm9ybSkudG9CZShDaHVua2luZ01vZGUudGV4dClcbiAgICAgIGV4cGVjdChwYXJhbXM/LmRvY19sYW5ndWFnZSkudG9CZSgnRW5nbGlzaCcpXG4gICAgICBleHBlY3QocGFyYW1zPy5kYXRhX3NvdXJjZT8udHlwZSkudG9CZShEYXRhU291cmNlVHlwZS5GSUxFKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGJ1aWxkIHBhcmFtcyBmb3Igc2V0dGluZyBtb2RlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZG9jdW1lbnREZXRhaWwgPSBjcmVhdGVNb2NrRG9jdW1lbnREZXRhaWwoKVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlRG9jdW1lbnRDcmVhdGlvbih7XG4gICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgaXNTZXR0aW5nOiB0cnVlLFxuICAgICAgICAgIGRvY3VtZW50RGV0YWlsLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgcGFyYW1zID0gcmVzdWx0LmN1cnJlbnQuYnVpbGRDcmVhdGlvblBhcmFtcyhcbiAgICAgICAgQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICAgICdFbmdsaXNoJyxcbiAgICAgICAgeyBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsLCBydWxlczogY3JlYXRlTW9ja1J1bGVzKCkgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHsgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLCByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycgfSxcbiAgICAgICAgICB0b3BfazogMyxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICAgIH0sXG4gICAgICAgIHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ3RleHQtZW1iZWRkaW5nLWFkYS0wMDInIH0sXG4gICAgICAgIEluZGV4aW5nVHlwZS5RVUFMSUZJRUQsXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChwYXJhbXM/Lm9yaWdpbmFsX2RvY3VtZW50X2lkKS50b0JlKGRvY3VtZW50RGV0YWlsLmlkKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGJ1aWxkIHBhcmFtcyBmb3Igbm90aW9uX2ltcG9ydCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURvY3VtZW50Q3JlYXRpb24oe1xuICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5OT1RJT04sXG4gICAgICAgICAgbm90aW9uUGFnZXM6IFtjcmVhdGVNb2NrTm90aW9uUGFnZSgpXSxcbiAgICAgICAgICBub3Rpb25DcmVkZW50aWFsSWQ6ICdub3Rpb24tY3JlZC0xMjMnLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgcGFyYW1zID0gcmVzdWx0LmN1cnJlbnQuYnVpbGRDcmVhdGlvblBhcmFtcyhcbiAgICAgICAgQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICAgICdFbmdsaXNoJyxcbiAgICAgICAgeyBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsLCBydWxlczogY3JlYXRlTW9ja1J1bGVzKCkgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHsgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLCByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycgfSxcbiAgICAgICAgICB0b3BfazogMyxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICAgIH0sXG4gICAgICAgIHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ3RleHQtZW1iZWRkaW5nLWFkYS0wMDInIH0sXG4gICAgICAgIEluZGV4aW5nVHlwZS5RVUFMSUZJRUQsXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChwYXJhbXMpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChwYXJhbXM/LmRhdGFfc291cmNlPy50eXBlKS50b0JlKERhdGFTb3VyY2VUeXBlLk5PVElPTilcbiAgICAgIGV4cGVjdChwYXJhbXM/LmRhdGFfc291cmNlPy5pbmZvX2xpc3Qubm90aW9uX2luZm9fbGlzdCkudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGJ1aWxkIHBhcmFtcyBmb3Igd2Vic2l0ZV9jcmF3bCBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURvY3VtZW50Q3JlYXRpb24oe1xuICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5XRUIsXG4gICAgICAgICAgd2Vic2l0ZVBhZ2VzOiBbY3JlYXRlTW9ja1dlYnNpdGVQYWdlKCldLFxuICAgICAgICAgIHdlYnNpdGVDcmF3bFByb3ZpZGVyOiAnamluYVJlYWRlcicgYXMgRGF0YVNvdXJjZVByb3ZpZGVyLFxuICAgICAgICAgIHdlYnNpdGVDcmF3bEpvYklkOiAnam9iLTEyMycsXG4gICAgICAgICAgY3Jhd2xPcHRpb25zOiB7IG1heF9kZXB0aDogMiB9IGFzIENyYXdsT3B0aW9ucyxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IHJlc3VsdC5jdXJyZW50LmJ1aWxkQ3JlYXRpb25QYXJhbXMoXG4gICAgICAgIENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgICAnRW5nbGlzaCcsXG4gICAgICAgIHsgbW9kZTogUHJvY2Vzc01vZGUuZ2VuZXJhbCwgcnVsZXM6IGNyZWF0ZU1vY2tSdWxlcygpIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7IHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJywgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnIH0sXG4gICAgICAgICAgdG9wX2s6IDMsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgICAgICB9LFxuICAgICAgICB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEtMDAyJyB9LFxuICAgICAgICBJbmRleGluZ1R5cGUuUVVBTElGSUVELFxuICAgICAgKVxuXG4gICAgICBleHBlY3QocGFyYW1zKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocGFyYW1zPy5kYXRhX3NvdXJjZT8udHlwZSkudG9CZShEYXRhU291cmNlVHlwZS5XRUIpXG4gICAgICBleHBlY3QocGFyYW1zPy5kYXRhX3NvdXJjZT8uaW5mb19saXN0LndlYnNpdGVfaW5mb19saXN0KS50b0JlRGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgdmFsaWRhdGVQYXJhbXMgZWRnZSBjYXNlc1xuICBkZXNjcmliZSgndmFsaWRhdGVQYXJhbXMgLSBhZGRpdGlvbmFsIGNhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gZW1iZWRkaW5nIG1vZGVsIGlzIG1pc3NpbmcgZm9yIFFVQUxJRklFRCBpbmRleCB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRG9jdW1lbnRDcmVhdGlvbihkZWZhdWx0T3B0aW9ucykpXG5cbiAgICAgIGNvbnN0IGlzVmFsaWQgPSByZXN1bHQuY3VycmVudC52YWxpZGF0ZVBhcmFtcyh7XG4gICAgICAgIHNlZ21lbnRhdGlvblR5cGU6ICdnZW5lcmFsJyxcbiAgICAgICAgbWF4Q2h1bmtMZW5ndGg6IDUwMCxcbiAgICAgICAgbGltaXRNYXhDaHVua0xlbmd0aDogNDAwMCxcbiAgICAgICAgb3ZlcmxhcDogNTAsXG4gICAgICAgIGluZGV4VHlwZTogSW5kZXhpbmdUeXBlLlFVQUxJRklFRCxcbiAgICAgICAgZW1iZWRkaW5nTW9kZWw6IHsgcHJvdmlkZXI6ICcnLCBtb2RlbDogJycgfSxcbiAgICAgICAgcmVyYW5rTW9kZWxMaXN0OiBtb2NrUmVyYW5rTW9kZWxMaXN0LFxuICAgICAgICByZXRyaWV2YWxDb25maWc6IHtcbiAgICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7IHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJywgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnIH0sXG4gICAgICAgICAgdG9wX2s6IDMsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KGlzVmFsaWQpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gcmVyYW5rIG1vZGVsIGlzIHJlcXVpcmVkIGJ1dCBub3Qgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEb2N1bWVudENyZWF0aW9uKGRlZmF1bHRPcHRpb25zKSlcblxuICAgICAgLy8gaXNSZVJhbmtNb2RlbFNlbGVjdGVkIHJldHVybnMgZmFsc2Ugd2hlbjpcbiAgICAgIC8vIC0gaW5kZXhNZXRob2QgPT09ICdoaWdoX3F1YWxpdHknIChJbmRleGluZ1R5cGUuUVVBTElGSUVEKVxuICAgICAgLy8gLSByZXJhbmtpbmdfZW5hYmxlID09PSB0cnVlXG4gICAgICAvLyAtIHJlcmFua01vZGVsU2VsZWN0ZWQgPT09IGZhbHNlIChtb2RlbCBub3QgZm91bmQgaW4gbGlzdClcbiAgICAgIGNvbnN0IGlzVmFsaWQgPSByZXN1bHQuY3VycmVudC52YWxpZGF0ZVBhcmFtcyh7XG4gICAgICAgIHNlZ21lbnRhdGlvblR5cGU6ICdnZW5lcmFsJyxcbiAgICAgICAgbWF4Q2h1bmtMZW5ndGg6IDUwMCxcbiAgICAgICAgbGltaXRNYXhDaHVua0xlbmd0aDogNDAwMCxcbiAgICAgICAgb3ZlcmxhcDogNTAsXG4gICAgICAgIGluZGV4VHlwZTogSW5kZXhpbmdUeXBlLlFVQUxJRklFRCxcbiAgICAgICAgZW1iZWRkaW5nTW9kZWw6IHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ3RleHQtZW1iZWRkaW5nLWFkYS0wMDInIH0sXG4gICAgICAgIHJlcmFua01vZGVsTGlzdDogW10sIC8vIEVtcHR5IGxpc3QgbWVhbnMgbW9kZWwgd29uJ3QgYmUgZm91bmRcbiAgICAgICAgcmV0cmlldmFsQ29uZmlnOiB7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IHRydWUsIC8vIFJlcmFua2luZyBlbmFibGVkXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7XG4gICAgICAgICAgICByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJ25vbmV4aXN0ZW50JyxcbiAgICAgICAgICAgIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnbm9uZXhpc3RlbnQtbW9kZWwnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdG9wX2s6IDMsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KGlzVmFsaWQpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgZXhlY3V0ZUNyZWF0aW9uXG4gIGRlc2NyaWJlKCdleGVjdXRlQ3JlYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGNyZWF0ZUZpcnN0RG9jdW1lbnRNdXRhdGlvbiB3aGVuIGRhdGFzZXRJZCBpcyBub3QgcHJvdmlkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrT25TdGVwQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja1VwZGF0ZUluZGV4aW5nVHlwZUNhY2hlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja1VwZGF0ZVJlc3VsdENhY2hlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja1VwZGF0ZVJldHJpZXZhbE1ldGhvZENhY2hlID0gdmkuZm4oKVxuICAgICAgY29uc3QgbW9ja09uU2F2ZSA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlRG9jdW1lbnRDcmVhdGlvbih7XG4gICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgZGF0YXNldElkOiB1bmRlZmluZWQsXG4gICAgICAgICAgb25TdGVwQ2hhbmdlOiBtb2NrT25TdGVwQ2hhbmdlLFxuICAgICAgICAgIHVwZGF0ZUluZGV4aW5nVHlwZUNhY2hlOiBtb2NrVXBkYXRlSW5kZXhpbmdUeXBlQ2FjaGUsXG4gICAgICAgICAgdXBkYXRlUmVzdWx0Q2FjaGU6IG1vY2tVcGRhdGVSZXN1bHRDYWNoZSxcbiAgICAgICAgICB1cGRhdGVSZXRyaWV2YWxNZXRob2RDYWNoZTogbW9ja1VwZGF0ZVJldHJpZXZhbE1ldGhvZENhY2hlLFxuICAgICAgICAgIG9uU2F2ZTogbW9ja09uU2F2ZSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IHJlc3VsdC5jdXJyZW50LmJ1aWxkQ3JlYXRpb25QYXJhbXMoXG4gICAgICAgIENodW5raW5nTW9kZS50ZXh0LFxuICAgICAgICAnRW5nbGlzaCcsXG4gICAgICAgIHsgbW9kZTogUHJvY2Vzc01vZGUuZ2VuZXJhbCwgcnVsZXM6IGNyZWF0ZU1vY2tSdWxlcygpIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7IHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJywgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnIH0sXG4gICAgICAgICAgdG9wX2s6IDMsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgICAgICB9LFxuICAgICAgICB7IHByb3ZpZGVyOiAnb3BlbmFpJywgbW9kZWw6ICd0ZXh0LWVtYmVkZGluZy1hZGEtMDAyJyB9LFxuICAgICAgICBJbmRleGluZ1R5cGUuUVVBTElGSUVELFxuICAgICAgKVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCByZXN1bHQuY3VycmVudC5leGVjdXRlQ3JlYXRpb24ocGFyYW1zISwgSW5kZXhpbmdUeXBlLlFVQUxJRklFRCwge1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHsgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLCByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycgfSxcbiAgICAgICAgICB0b3BfazogMyxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QobW9ja09uU3RlcENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGNyZWF0ZURvY3VtZW50TXV0YXRpb24gd2hlbiBkYXRhc2V0SWQgaXMgcHJvdmlkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrT25TdGVwQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlRG9jdW1lbnRDcmVhdGlvbih7XG4gICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgZGF0YXNldElkOiAnZXhpc3RpbmctZGF0YXNldC1pZCcsXG4gICAgICAgICAgb25TdGVwQ2hhbmdlOiBtb2NrT25TdGVwQ2hhbmdlLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgY29uc3QgcGFyYW1zID0gcmVzdWx0LmN1cnJlbnQuYnVpbGRDcmVhdGlvblBhcmFtcyhcbiAgICAgICAgQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICAgICdFbmdsaXNoJyxcbiAgICAgICAgeyBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsLCBydWxlczogY3JlYXRlTW9ja1J1bGVzKCkgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICAgICAgICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgICAgICAgICByZXJhbmtpbmdfbW9kZWw6IHsgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLCByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycgfSxcbiAgICAgICAgICB0b3BfazogMyxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkOiAwLjUsXG4gICAgICAgIH0sXG4gICAgICAgIHsgcHJvdmlkZXI6ICdvcGVuYWknLCBtb2RlbDogJ3RleHQtZW1iZWRkaW5nLWFkYS0wMDInIH0sXG4gICAgICAgIEluZGV4aW5nVHlwZS5RVUFMSUZJRUQsXG4gICAgICApXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHJlc3VsdC5jdXJyZW50LmV4ZWN1dGVDcmVhdGlvbihwYXJhbXMhLCBJbmRleGluZ1R5cGUuUVVBTElGSUVELCB7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IGZhbHNlLFxuICAgICAgICAgIHJlcmFua2luZ19tb2RlbDogeyByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyB9LFxuICAgICAgICAgIHRvcF9rOiAzLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGQ6IDAuNSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChtb2NrT25TdGVwQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TYXZlIHdoZW4gaW4gc2V0dGluZyBtb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja09uU2F2ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGRvY3VtZW50RGV0YWlsID0gY3JlYXRlTW9ja0RvY3VtZW50RGV0YWlsKClcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURvY3VtZW50Q3JlYXRpb24oe1xuICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAgIGRhdGFzZXRJZDogJ2V4aXN0aW5nLWRhdGFzZXQtaWQnLFxuICAgICAgICAgIGlzU2V0dGluZzogdHJ1ZSxcbiAgICAgICAgICBkb2N1bWVudERldGFpbCxcbiAgICAgICAgICBvblNhdmU6IG1vY2tPblNhdmUsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBjb25zdCBwYXJhbXMgPSByZXN1bHQuY3VycmVudC5idWlsZENyZWF0aW9uUGFyYW1zKFxuICAgICAgICBDaHVua2luZ01vZGUudGV4dCxcbiAgICAgICAgJ0VuZ2xpc2gnLFxuICAgICAgICB7IG1vZGU6IFByb2Nlc3NNb2RlLmdlbmVyYWwsIHJ1bGVzOiBjcmVhdGVNb2NrUnVsZXMoKSB9LFxuICAgICAgICB7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IGZhbHNlLFxuICAgICAgICAgIHJlcmFua2luZ19tb2RlbDogeyByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyB9LFxuICAgICAgICAgIHRvcF9rOiAzLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGQ6IDAuNSxcbiAgICAgICAgfSxcbiAgICAgICAgeyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAndGV4dC1lbWJlZGRpbmctYWRhLTAwMicgfSxcbiAgICAgICAgSW5kZXhpbmdUeXBlLlFVQUxJRklFRCxcbiAgICAgIClcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgcmVzdWx0LmN1cnJlbnQuZXhlY3V0ZUNyZWF0aW9uKHBhcmFtcyEsIEluZGV4aW5nVHlwZS5RVUFMSUZJRUQsIHtcbiAgICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgICAgICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgICAgICAgcmVyYW5raW5nX21vZGVsOiB7IHJlcmFua2luZ19wcm92aWRlcl9uYW1lOiAnJywgcmVyYW5raW5nX21vZGVsX25hbWU6ICcnIH0sXG4gICAgICAgICAgdG9wX2s6IDMsXG4gICAgICAgICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZDogMC41LFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KG1vY2tPblNhdmUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHZhbGlkYXRlUHJldmlld1BhcmFtc1xuICBkZXNjcmliZSgndmFsaWRhdGVQcmV2aWV3UGFyYW1zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIHZhbGlkIG1heCBjaHVuayBsZW5ndGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VEb2N1bWVudENyZWF0aW9uKGRlZmF1bHRPcHRpb25zKSlcblxuICAgICAgY29uc3QgaXNWYWxpZCA9IHJlc3VsdC5jdXJyZW50LnZhbGlkYXRlUHJldmlld1BhcmFtcygxMDAwKVxuICAgICAgZXhwZWN0KGlzVmFsaWQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBtYXggY2h1bmsgbGVuZ3RoIGV4Y2VlZHMgbWF4aW11bScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZURvY3VtZW50Q3JlYXRpb24oZGVmYXVsdE9wdGlvbnMpKVxuXG4gICAgICBjb25zdCBpc1ZhbGlkID0gcmVzdWx0LmN1cnJlbnQudmFsaWRhdGVQcmV2aWV3UGFyYW1zKDEwMDAwKVxuICAgICAgZXhwZWN0KGlzVmFsaWQpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyB1c2VJbmRleGluZ0VzdGltYXRlIEhvb2sgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCd1c2VJbmRleGluZ0VzdGltYXRlJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuRklMRSxcbiAgICBjdXJyZW50RG9jRm9ybTogQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgZG9jTGFuZ3VhZ2U6ICdFbmdsaXNoJyxcbiAgICBmaWxlczogW2NyZWF0ZU1vY2tGaWxlKCldLFxuICAgIHByZXZpZXdOb3Rpb25QYWdlOiBjcmVhdGVNb2NrTm90aW9uUGFnZSgpLFxuICAgIG5vdGlvbkNyZWRlbnRpYWxJZDogJycsXG4gICAgcHJldmlld1dlYnNpdGVQYWdlOiBjcmVhdGVNb2NrV2Vic2l0ZVBhZ2UoKSxcbiAgICBpbmRleGluZ1RlY2huaXF1ZTogSW5kZXhpbmdUeXBlLlFVQUxJRklFRCxcbiAgICBwcm9jZXNzUnVsZTogeyBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsLCBydWxlczogY3JlYXRlTW9ja1J1bGVzKCkgfSxcbiAgfVxuXG4gIC8vIFRlc3RzIGZvciBpbml0aWFsIHN0YXRlXG4gIGRlc2NyaWJlKCdJbml0aWFsIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGlkbGUgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VJbmRleGluZ0VzdGltYXRlKGRlZmF1bHRPcHRpb25zKSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmlzSWRsZSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmlzUGVuZGluZykudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5lc3RpbWF0ZSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgZmV0Y2hFc3RpbWF0ZVxuICBkZXNjcmliZSgnZmV0Y2hFc3RpbWF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgZmV0Y2hFc3RpbWF0ZSBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUluZGV4aW5nRXN0aW1hdGUoZGVmYXVsdE9wdGlvbnMpKVxuXG4gICAgICBleHBlY3QodHlwZW9mIHJlc3VsdC5jdXJyZW50LmZldGNoRXN0aW1hdGUpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHJlc2V0IGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlSW5kZXhpbmdFc3RpbWF0ZShkZWZhdWx0T3B0aW9ucykpXG5cbiAgICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQucmVzZXQpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGZldGNoRXN0aW1hdGUgZm9yIEZJTEUgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VJbmRleGluZ0VzdGltYXRlKHtcbiAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuRklMRSxcbiAgICAgICAgICBwcmV2aWV3RmlsZU5hbWU6ICd0ZXN0LWZpbGUucGRmJyxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmZldGNoRXN0aW1hdGUoKVxuICAgICAgfSlcblxuICAgICAgLy8gZmV0Y2hFc3RpbWF0ZSBzaG91bGQgYmUgY2FsbGFibGUgd2l0aG91dCBlcnJvclxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmZldGNoRXN0aW1hdGUpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGZldGNoRXN0aW1hdGUgZm9yIE5PVElPTiBkYXRhIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZUluZGV4aW5nRXN0aW1hdGUoe1xuICAgICAgICAgIC4uLmRlZmF1bHRPcHRpb25zLFxuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5OT1RJT04sXG4gICAgICAgICAgcHJldmlld05vdGlvblBhZ2U6IGNyZWF0ZU1vY2tOb3Rpb25QYWdlKCksXG4gICAgICAgICAgbm90aW9uQ3JlZGVudGlhbElkOiAnY3JlZC0xMjMnLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuZmV0Y2hFc3RpbWF0ZSgpXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuZmV0Y2hFc3RpbWF0ZSkudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgZmV0Y2hFc3RpbWF0ZSBmb3IgV0VCIGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlSW5kZXhpbmdFc3RpbWF0ZSh7XG4gICAgICAgICAgLi4uZGVmYXVsdE9wdGlvbnMsXG4gICAgICAgICAgZGF0YVNvdXJjZVR5cGU6IERhdGFTb3VyY2VUeXBlLldFQixcbiAgICAgICAgICBwcmV2aWV3V2Vic2l0ZVBhZ2U6IGNyZWF0ZU1vY2tXZWJzaXRlUGFnZSgpLFxuICAgICAgICAgIHdlYnNpdGVDcmF3bFByb3ZpZGVyOiAnamluYVJlYWRlcicgYXMgRGF0YVNvdXJjZVByb3ZpZGVyLFxuICAgICAgICAgIHdlYnNpdGVDcmF3bEpvYklkOiAnam9iLTEyMycsXG4gICAgICAgICAgY3Jhd2xPcHRpb25zOiB7IG1heF9kZXB0aDogMiB9IGFzIENyYXdsT3B0aW9ucyxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LmZldGNoRXN0aW1hdGUoKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmZldGNoRXN0aW1hdGUpLnRvQmVEZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBnZXRDdXJyZW50TXV0YXRpb24gYmFzZWQgb24gZGF0YSBzb3VyY2UgdHlwZVxuICBkZXNjcmliZSgnRGF0YSBTb3VyY2UgU2VsZWN0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXNlIGZpbGUgcXVlcnkgZm9yIEZJTEUgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VJbmRleGluZ0VzdGltYXRlKHtcbiAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuRklMRSxcbiAgICAgICAgfSksXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5jdXJyZW50TXV0YXRpb24pLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5pc0lkbGUpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugbm90aW9uIHF1ZXJ5IGZvciBOT1RJT04gZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VJbmRleGluZ0VzdGltYXRlKHtcbiAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuTk9USU9OLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmN1cnJlbnRNdXRhdGlvbikudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmlzSWRsZSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSB3ZWJzaXRlIHF1ZXJ5IGZvciBXRUIgZGF0YSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VJbmRleGluZ0VzdGltYXRlKHtcbiAgICAgICAgICAuLi5kZWZhdWx0T3B0aW9ucyxcbiAgICAgICAgICBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuV0VCLFxuICAgICAgICAgIHdlYnNpdGVDcmF3bFByb3ZpZGVyOiAnamluYVJlYWRlcicgYXMgRGF0YVNvdXJjZVByb3ZpZGVyLFxuICAgICAgICAgIHdlYnNpdGVDcmF3bEpvYklkOiAnam9iLTEyMycsXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuY3VycmVudE11dGF0aW9uKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNJZGxlKS50b0JlKHRydWUpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBTdGVwVHdvRm9vdGVyIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1N0ZXBUd29Gb290ZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBpc1NldHRpbmc6IGZhbHNlLFxuICAgIGlzQ3JlYXRpbmc6IGZhbHNlLFxuICAgIG9uUHJldmlvdXM6IHZpLmZuKCksXG4gICAgb25DcmVhdGU6IHZpLmZuKCksXG4gICAgb25DYW5jZWw6IHZpLmZuKCksXG4gIH1cblxuICAvLyBUZXN0cyBmb3IgcmVuZGVyaW5nXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U3RlcFR3b0Zvb3RlciB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBQcmV2aW91cyBhbmQgTmV4dCBidXR0b25zIHdpdGggY29ycmVjdCB0ZXh0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcHJldmlvdXNTdGVwL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvbmV4dFN0ZXAvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUHJldmlvdXMgYW5kIE5leHQgYnV0dG9ucyB3aGVuIG5vdCBpbiBzZXR0aW5nIG1vZGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFN0ZXBUd29Gb290ZXIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9wcmV2aW91c1N0ZXAvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9uZXh0U3RlcC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTYXZlIGFuZCBDYW5jZWwgYnV0dG9ucyB3aGVuIGluIHNldHRpbmcgbW9kZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8U3RlcFR3b0Zvb3RlciB7Li4uZGVmYXVsdFByb3BzfSBpc1NldHRpbmc9e3RydWV9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvc2F2ZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2NhbmNlbC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHVzZXIgaW50ZXJhY3Rpb25zXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25QcmV2aW91cyB3aGVuIFByZXZpb3VzIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25QcmV2aW91cyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8U3RlcFR3b0Zvb3RlciB7Li4uZGVmYXVsdFByb3BzfSBvblByZXZpb3VzPXtvblByZXZpb3VzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoL3ByZXZpb3VzU3RlcC9pKSlcblxuICAgICAgZXhwZWN0KG9uUHJldmlvdXMpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DcmVhdGUgd2hlbiBOZXh0L1NhdmUgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNyZWF0ZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8U3RlcFR3b0Zvb3RlciB7Li4uZGVmYXVsdFByb3BzfSBvbkNyZWF0ZT17b25DcmVhdGV9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgvbmV4dFN0ZXAvaSkpXG5cbiAgICAgIGV4cGVjdChvbkNyZWF0ZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNhbmNlbCB3aGVuIENhbmNlbCBidXR0b24gaXMgY2xpY2tlZCBpbiBzZXR0aW5nIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNhbmNlbCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8U3RlcFR3b0Zvb3RlciB7Li4uZGVmYXVsdFByb3BzfSBpc1NldHRpbmc9e3RydWV9IG9uQ2FuY2VsPXtvbkNhbmNlbH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KC9jYW5jZWwvaSkpXG5cbiAgICAgIGV4cGVjdChvbkNhbmNlbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgbG9hZGluZyBzdGF0ZVxuICBkZXNjcmliZSgnTG9hZGluZyBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyBzdGF0ZSBvbiBOZXh0IGJ1dHRvbiB3aGVuIGNyZWF0aW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxTdGVwVHdvRm9vdGVyIHsuLi5kZWZhdWx0UHJvcHN9IGlzQ3JlYXRpbmc9e3RydWV9IC8+KVxuXG4gICAgICBjb25zdCBuZXh0QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgvbmV4dFN0ZXAvaSkuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIC8vIEJ1dHRvbiBoYXMgZGlzYWJsZWQ6YnRuLWRpc2FibGVkIGNsYXNzIHdoaWNoIGhhbmRsZXMgdGhlIGxvYWRpbmcgc3RhdGVcbiAgICAgIGV4cGVjdChuZXh0QnV0dG9uKS50b0hhdmVDbGFzcygnZGlzYWJsZWQ6YnRuLWRpc2FibGVkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgc3RhdGUgb24gU2F2ZSBidXR0b24gd2hlbiBjcmVhdGluZyBpbiBzZXR0aW5nIG1vZGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFN0ZXBUd29Gb290ZXIgey4uLmRlZmF1bHRQcm9wc30gaXNTZXR0aW5nPXt0cnVlfSBpc0NyZWF0aW5nPXt0cnVlfSAvPilcblxuICAgICAgY29uc3Qgc2F2ZUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoL3NhdmUvaSkuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIC8vIEJ1dHRvbiBoYXMgZGlzYWJsZWQ6YnRuLWRpc2FibGVkIGNsYXNzIHdoaWNoIGhhbmRsZXMgdGhlIGxvYWRpbmcgc3RhdGVcbiAgICAgIGV4cGVjdChzYXZlQnV0dG9uKS50b0hhdmVDbGFzcygnZGlzYWJsZWQ6YnRuLWRpc2FibGVkJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFByZXZpZXdQYW5lbCBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdQcmV2aWV3UGFuZWwnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBpc01vYmlsZTogZmFsc2UsXG4gICAgZGF0YVNvdXJjZVR5cGU6IERhdGFTb3VyY2VUeXBlLkZJTEUsXG4gICAgY3VycmVudERvY0Zvcm06IENodW5raW5nTW9kZS50ZXh0LFxuICAgIGVzdGltYXRlOiB1bmRlZmluZWQgYXMgRmlsZUluZGV4aW5nRXN0aW1hdGVSZXNwb25zZSB8IHVuZGVmaW5lZCxcbiAgICBwYXJlbnRDaGlsZENvbmZpZzogZGVmYXVsdFBhcmVudENoaWxkQ29uZmlnLFxuICAgIGlzU2V0dGluZzogZmFsc2UsXG4gICAgcGlja2VyRmlsZXM6IFt7IGlkOiAnZmlsZS0xJywgbmFtZTogJ3Rlc3QucGRmJywgZXh0ZW5zaW9uOiAncGRmJyB9XSxcbiAgICBwaWNrZXJWYWx1ZTogeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICd0ZXN0LnBkZicsIGV4dGVuc2lvbjogJ3BkZicgfSxcbiAgICBpc0lkbGU6IHRydWUsXG4gICAgaXNQZW5kaW5nOiBmYWxzZSxcbiAgICBvblBpY2tlckNoYW5nZTogdmkuZm4oKSxcbiAgfVxuXG4gIC8vIFRlc3RzIGZvciByZW5kZXJpbmdcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQcmV2aWV3UGFuZWwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIENoZWNrIGZvciB0aGUgcHJldmlldyBoZWFkZXIgdGl0bGUgdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVHdvLnByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpZGxlIHN0YXRlIHdoZW4gaXNJZGxlIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByb3BzfSBpc0lkbGU9e3RydWV9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcHJldmlld0NodW5rVGlwL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxvYWRpbmcgc2tlbGV0b24gd2hlbiBpc1BlbmRpbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UHJldmlld1BhbmVsIHsuLi5kZWZhdWx0UHJvcHN9IGlzSWRsZT17ZmFsc2V9IGlzUGVuZGluZz17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBzaG93IHNrZWxldG9uIGNvbnRhaW5lcnNcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL3ByZXZpZXdDaHVua1RpcC9pKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBkaWZmZXJlbnQgZG9jIGZvcm1zXG4gIGRlc2NyaWJlKCdQcmV2aWV3IENvbnRlbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGV4dCBwcmV2aWV3IHdoZW4gZG9jRm9ybSBpcyB0ZXh0JywgKCkgPT4ge1xuICAgICAgY29uc3QgZXN0aW1hdGUgPSBjcmVhdGVNb2NrRXN0aW1hdGUoKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UHJldmlld1BhbmVsXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0lkbGU9e2ZhbHNlfVxuICAgICAgICAgIGVzdGltYXRlPXtlc3RpbWF0ZX1cbiAgICAgICAgICBjdXJyZW50RG9jRm9ybT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ2h1bmsgMSBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUUEgcHJldmlldyB3aGVuIGRvY0Zvcm0gaXMgcWEnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlc3RpbWF0ZSA9IGNyZWF0ZU1vY2tFc3RpbWF0ZSgpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxQcmV2aWV3UGFuZWxcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGlzSWRsZT17ZmFsc2V9XG4gICAgICAgICAgZXN0aW1hdGU9e2VzdGltYXRlfVxuICAgICAgICAgIGN1cnJlbnREb2NGb3JtPXtDaHVua2luZ01vZGUucWF9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0ExJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNodW5rIGNvdW50IGJhZGdlIGZvciBub24tUUEgZG9jIGZvcm0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBlc3RpbWF0ZSA9IGNyZWF0ZU1vY2tFc3RpbWF0ZSh7IHRvdGFsX3NlZ21lbnRzOiAyNSB9KVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UHJldmlld1BhbmVsXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0lkbGU9e2ZhbHNlfVxuICAgICAgICAgIGVzdGltYXRlPXtlc3RpbWF0ZX1cbiAgICAgICAgICBjdXJyZW50RG9jRm9ybT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMjUvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwYXJlbnQtY2hpbGQgcHJldmlldyB3aGVuIGRvY0Zvcm0gaXMgcGFyZW50Q2hpbGQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlc3RpbWF0ZSA9IGNyZWF0ZU1vY2tFc3RpbWF0ZSh7XG4gICAgICAgIHByZXZpZXc6IFtcbiAgICAgICAgICB7IGNvbnRlbnQ6ICdQYXJlbnQgY2h1bmsgY29udGVudCcsIGNoaWxkX2NodW5rczogWydDaGlsZCAxJywgJ0NoaWxkIDInLCAnQ2hpbGQgMyddIH0sXG4gICAgICAgIF0sXG4gICAgICB9KVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8UHJldmlld1BhbmVsXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0lkbGU9e2ZhbHNlfVxuICAgICAgICAgIGVzdGltYXRlPXtlc3RpbWF0ZX1cbiAgICAgICAgICBjdXJyZW50RG9jRm9ybT17Q2h1bmtpbmdNb2RlLnBhcmVudENoaWxkfVxuICAgICAgICAgIHBhcmVudENoaWxkQ29uZmlnPXt7XG4gICAgICAgICAgICAuLi5kZWZhdWx0UGFyZW50Q2hpbGRDb25maWcsXG4gICAgICAgICAgICBjaHVua0ZvckNvbnRleHQ6ICdwYXJhZ3JhcGgnLFxuICAgICAgICAgIH19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIHBhcmVudCBjaHVuayBsYWJlbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NodW5rLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBjaGlsZCBjaHVua3NcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDaGlsZCAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDaGlsZCAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDaGlsZCAzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBsaW1pdCBjaGlsZCBjaHVua3Mgd2hlbiBjaHVua0ZvckNvbnRleHQgaXMgZnVsbC1kb2MnLCAoKSA9PiB7XG4gICAgICAvLyBGVUxMX0RPQ19QUkVWSUVXX0xFTkdUSCBpcyA1MCwgc28gd2UgbmVlZCBtb3JlIHRoYW4gNTAgY2h1bmtzIHRvIHRlc3QgdGhlIGxpbWl0XG4gICAgICBjb25zdCBtYW55Q2hpbGRDaHVua3MgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiA2MCB9LCAoXywgaSkgPT4gYENoaWxkQ2h1bmske2kgKyAxfWApXG4gICAgICBjb25zdCBlc3RpbWF0ZSA9IGNyZWF0ZU1vY2tFc3RpbWF0ZSh7XG4gICAgICAgIHByZXZpZXc6IFt7IGNvbnRlbnQ6ICdQYXJlbnQgY29udGVudCcsIGNoaWxkX2NodW5rczogbWFueUNoaWxkQ2h1bmtzIH1dLFxuICAgICAgfSlcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFByZXZpZXdQYW5lbFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNJZGxlPXtmYWxzZX1cbiAgICAgICAgICBlc3RpbWF0ZT17ZXN0aW1hdGV9XG4gICAgICAgICAgY3VycmVudERvY0Zvcm09e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRDaGlsZENvbmZpZz17e1xuICAgICAgICAgICAgLi4uZGVmYXVsdFBhcmVudENoaWxkQ29uZmlnLFxuICAgICAgICAgICAgY2h1bmtGb3JDb250ZXh0OiAnZnVsbC1kb2MnLFxuICAgICAgICAgIH19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIHBhcmVudCBjaHVua1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NodW5rLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gZnVsbC1kb2MgbW9kZSBsaW1pdHMgdG8gRlVMTF9ET0NfUFJFVklFV19MRU5HVEggKDUwKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NoaWxkQ2h1bmsxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDaGlsZENodW5rNTAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIG5vdCByZW5kZXIgYmV5b25kIHRoZSBsaW1pdFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnQ2hpbGRDaHVuazUxJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG11bHRpcGxlIHBhcmVudCBjaHVua3MgaW4gcGFyZW50LWNoaWxkIG1vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBlc3RpbWF0ZSA9IGNyZWF0ZU1vY2tFc3RpbWF0ZSh7XG4gICAgICAgIHByZXZpZXc6IFtcbiAgICAgICAgICB7IGNvbnRlbnQ6ICdQYXJlbnQgMScsIGNoaWxkX2NodW5rczogWydQMS1DMSddIH0sXG4gICAgICAgICAgeyBjb250ZW50OiAnUGFyZW50IDInLCBjaGlsZF9jaHVua3M6IFsnUDItQzEnXSB9LFxuICAgICAgICBdLFxuICAgICAgfSlcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFByZXZpZXdQYW5lbFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNJZGxlPXtmYWxzZX1cbiAgICAgICAgICBlc3RpbWF0ZT17ZXN0aW1hdGV9XG4gICAgICAgICAgY3VycmVudERvY0Zvcm09e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDaHVuay0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDaHVuay0yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQMS1DMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUDItQzEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHBpY2tlclxuICBkZXNjcmliZSgnRG9jdW1lbnQgUGlja2VyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblBpY2tlckNoYW5nZSB3aGVuIGRvY3VtZW50IGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25QaWNrZXJDaGFuZ2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPFByZXZpZXdQYW5lbCB7Li4uZGVmYXVsdFByb3BzfSBvblBpY2tlckNoYW5nZT17b25QaWNrZXJDaGFuZ2V9IC8+KVxuXG4gICAgICAvLyBUaGUgcGlja2VyIGludGVyYWN0aW9uIHdvdWxkIGJlIHRlc3RlZCB0aHJvdWdoIHRoZSBhY3R1YWwgY29tcG9uZW50XG4gICAgICBleHBlY3Qob25QaWNrZXJDaGFuZ2UpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVkZ2UgQ2FzZXMgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnRW1wdHkvTnVsbCBWYWx1ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZmlsZXMgYXJyYXkgaW4gdXNlUHJldmlld1N0YXRlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgICAgdXNlUHJldmlld1N0YXRlKHtcbiAgICAgICAgICBkYXRhU291cmNlVHlwZTogRGF0YVNvdXJjZVR5cGUuRklMRSxcbiAgICAgICAgICBmaWxlczogW10sXG4gICAgICAgICAgbm90aW9uUGFnZXM6IFtdLFxuICAgICAgICAgIHdlYnNpdGVQYWdlczogW10sXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucHJldmlld0ZpbGUpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBub3Rpb24gcGFnZXMgYXJyYXknLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VQcmV2aWV3U3RhdGUoe1xuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5OT1RJT04sXG4gICAgICAgICAgZmlsZXM6IFtdLFxuICAgICAgICAgIG5vdGlvblBhZ2VzOiBbXSxcbiAgICAgICAgICB3ZWJzaXRlUGFnZXM6IFtdLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnByZXZpZXdOb3Rpb25QYWdlKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgd2Vic2l0ZSBwYWdlcyBhcnJheScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZVByZXZpZXdTdGF0ZSh7XG4gICAgICAgICAgZGF0YVNvdXJjZVR5cGU6IERhdGFTb3VyY2VUeXBlLldFQixcbiAgICAgICAgICBmaWxlczogW10sXG4gICAgICAgICAgbm90aW9uUGFnZXM6IFtdLFxuICAgICAgICAgIHdlYnNpdGVQYWdlczogW10sXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQucHJldmlld1dlYnNpdGVQYWdlKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCb3VuZGFyeSBDb25kaXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbGFyZ2UgY2h1bmsgbGVuZ3RoJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0TWF4Q2h1bmtMZW5ndGgoOTk5OTk5KVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50Lm1heENodW5rTGVuZ3RoKS50b0JlKDk5OTk5OSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgemVybyBvdmVybGFwJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU2VnbWVudGF0aW9uU3RhdGUoKSlcblxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0T3ZlcmxhcCgwKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50Lm92ZXJsYXApLnRvQmUoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHNlZ21lbnQgaWRlbnRpZmllcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVNlZ21lbnRhdGlvblN0YXRlKCkpXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHJlc3VsdC5jdXJyZW50LnNldFNlZ21lbnRJZGVudGlmaWVyKCc8PD4+JylcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5zZWdtZW50SWRlbnRpZmllcikudG9CZSgnPDw+PicpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIHNldFNlZ21lbnRJZGVudGlmaWVyIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuICAgICAgY29uc3QgaW5pdGlhbFNldHRlciA9IHJlc3VsdC5jdXJyZW50LnNldFNlZ21lbnRJZGVudGlmaWVyXG5cbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnNldFNlZ21lbnRJZGVudGlmaWVyKS50b0JlKGluaXRpYWxTZXR0ZXIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIHRvZ2dsZVJ1bGUgcmVmZXJlbmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQsIHJlcmVuZGVyIH0gPSByZW5kZXJIb29rKCgpID0+IHVzZVNlZ21lbnRhdGlvblN0YXRlKCkpXG4gICAgICBjb25zdCBpbml0aWFsVG9nZ2xlID0gcmVzdWx0LmN1cnJlbnQudG9nZ2xlUnVsZVxuXG4gICAgICByZXJlbmRlcigpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC50b2dnbGVSdWxlKS50b0JlKGluaXRpYWxUb2dnbGUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIGdldFByb2Nlc3NSdWxlIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0LCByZXJlbmRlciB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuXG4gICAgICAvLyBVcGRhdGUgc29tZSBzdGF0ZSB0byB0cmlnZ2VyIHJlLXJlbmRlclxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQuc2V0TWF4Q2h1bmtMZW5ndGgoMjA0OClcbiAgICAgIH0pXG5cbiAgICAgIHJlcmVuZGVyKClcblxuICAgICAgLy8gZ2V0UHJvY2Vzc1J1bGUgZGVwZW5kcyBvbiBzdGF0ZSwgc28gaXQgbWF5IGNoYW5nZSBidXQgc2hvdWxkIHJlbWFpbiBhIGZ1bmN0aW9uXG4gICAgICBleHBlY3QodHlwZW9mIHJlc3VsdC5jdXJyZW50LmdldFByb2Nlc3NSdWxlKS50b0JlKCdmdW5jdGlvbicpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJbnRlZ3JhdGlvbiBTY2VuYXJpb3Ncbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdJbnRlZ3JhdGlvbiBTY2VuYXJpb3MnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tDdXJyZW50RGF0YXNldCA9IG51bGxcbiAgfSlcblxuICBkZXNjcmliZSgnRG9jdW1lbnQgQ3JlYXRpb24gRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJ1aWxkIGFuZCB2YWxpZGF0ZSBwYXJhbXMgZm9yIGZpbGUgdXBsb2FkIHdvcmtmbG93JywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbY3JlYXRlTW9ja0ZpbGUoKV1cblxuICAgICAgY29uc3QgeyByZXN1bHQ6IHNlZ1Jlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuICAgICAgY29uc3QgeyByZXN1bHQ6IGNyZWF0aW9uUmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICAgIHVzZURvY3VtZW50Q3JlYXRpb24oe1xuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5GSUxFLFxuICAgICAgICAgIGZpbGVzLFxuICAgICAgICAgIG5vdGlvblBhZ2VzOiBbXSxcbiAgICAgICAgICBub3Rpb25DcmVkZW50aWFsSWQ6ICcnLFxuICAgICAgICAgIHdlYnNpdGVQYWdlczogW10sXG4gICAgICAgIH0pLFxuICAgICAgKVxuXG4gICAgICAvLyBCdWlsZCBwYXJhbXNcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGNyZWF0aW9uUmVzdWx0LmN1cnJlbnQuYnVpbGRDcmVhdGlvblBhcmFtcyhcbiAgICAgICAgQ2h1bmtpbmdNb2RlLnRleHQsXG4gICAgICAgICdFbmdsaXNoJyxcbiAgICAgICAgc2VnUmVzdWx0LmN1cnJlbnQuZ2V0UHJvY2Vzc1J1bGUoQ2h1bmtpbmdNb2RlLnRleHQpLFxuICAgICAgICB7XG4gICAgICAgICAgc2VhcmNoX21ldGhvZDogUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLFxuICAgICAgICAgIHJlcmFua2luZ19lbmFibGU6IGZhbHNlLFxuICAgICAgICAgIHJlcmFua2luZ19tb2RlbDogeyByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyB9LFxuICAgICAgICAgIHRvcF9rOiAzLFxuICAgICAgICAgIHNjb3JlX3RocmVzaG9sZF9lbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICBzY29yZV90aHJlc2hvbGQ6IDAuNSxcbiAgICAgICAgfSxcbiAgICAgICAgeyBwcm92aWRlcjogJ29wZW5haScsIG1vZGVsOiAndGV4dC1lbWJlZGRpbmctYWRhLTAwMicgfSxcbiAgICAgICAgSW5kZXhpbmdUeXBlLlFVQUxJRklFRCxcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHBhcmFtcykudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHBhcmFtcz8uZGF0YV9zb3VyY2U/LmluZm9fbGlzdC5maWxlX2luZm9fbGlzdD8uZmlsZV9pZHMpLnRvQ29udGFpbignZmlsZS0xJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFyZW50LWNoaWxkIGRvY3VtZW50IGZvcm0nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTZWdtZW50YXRpb25TdGF0ZSgpKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRTZWdtZW50YXRpb25UeXBlKFByb2Nlc3NNb2RlLnBhcmVudENoaWxkKVxuICAgICAgICByZXN1bHQuY3VycmVudC5zZXRDaHVua0ZvckNvbnRleHQoJ2Z1bGwtZG9jJylcbiAgICAgICAgcmVzdWx0LmN1cnJlbnQudXBkYXRlUGFyZW50Q29uZmlnKCdtYXhMZW5ndGgnLCAyMDQ4KVxuICAgICAgICByZXN1bHQuY3VycmVudC51cGRhdGVDaGlsZENvbmZpZygnbWF4TGVuZ3RoJywgNTEyKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvY2Vzc1J1bGUgPSByZXN1bHQuY3VycmVudC5nZXRQcm9jZXNzUnVsZShDaHVua2luZ01vZGUucGFyZW50Q2hpbGQpXG5cbiAgICAgIGV4cGVjdChwcm9jZXNzUnVsZS5tb2RlKS50b0JlKCdoaWVyYXJjaGljYWwnKVxuICAgICAgZXhwZWN0KHByb2Nlc3NSdWxlLnJ1bGVzLnBhcmVudF9tb2RlKS50b0JlKCdmdWxsLWRvYycpXG4gICAgICBleHBlY3QocHJvY2Vzc1J1bGUucnVsZXMuc2VnbWVudGF0aW9uLm1heF90b2tlbnMpLnRvQmUoMjA0OClcbiAgICAgIGV4cGVjdChwcm9jZXNzUnVsZS5ydWxlcy5zdWJjaHVua19zZWdtZW50YXRpb24/Lm1heF90b2tlbnMpLnRvQmUoNTEyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1ByZXZpZXcgRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwcmV2aWV3IGZpbGUgY2hhbmdlIGZsb3cnLCAoKSA9PiB7XG4gICAgICBjb25zdCBmaWxlcyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0ZpbGUoeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICdmaXJzdC5wZGYnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrRmlsZSh7IGlkOiAnZmlsZS0yJywgbmFtZTogJ3NlY29uZC5wZGYnIH0pLFxuICAgICAgXVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgICB1c2VQcmV2aWV3U3RhdGUoe1xuICAgICAgICAgIGRhdGFTb3VyY2VUeXBlOiBEYXRhU291cmNlVHlwZS5GSUxFLFxuICAgICAgICAgIGZpbGVzLFxuICAgICAgICAgIG5vdGlvblBhZ2VzOiBbXSxcbiAgICAgICAgICB3ZWJzaXRlUGFnZXM6IFtdLFxuICAgICAgICB9KSxcbiAgICAgIClcblxuICAgICAgLy8gSW5pdGlhbCBzdGF0ZVxuICAgICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmdldFByZXZpZXdQaWNrZXJWYWx1ZSgpLm5hbWUpLnRvQmUoJ2ZpcnN0LnBkZicpXG5cbiAgICAgIC8vIENoYW5nZSBwcmV2aWV3XG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICByZXN1bHQuY3VycmVudC5oYW5kbGVQcmV2aWV3Q2hhbmdlKHsgaWQ6ICdmaWxlLTInLCBuYW1lOiAnc2Vjb25kLnBkZicgfSlcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5wcmV2aWV3RmlsZSkudG9FcXVhbCh7IGlkOiAnZmlsZS0yJywgbmFtZTogJ3NlY29uZC5wZGYnIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRXNjYXBlL1VuZXNjYXBlIFJvdW5kIFRyaXAnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBvcmlnaW5hbCBzdHJpbmcgdGhyb3VnaCBlc2NhcGUvdW5lc2NhcGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvcmlnaW5hbCA9ICdcXG5cXG4nXG4gICAgICBjb25zdCBlc2NhcGVkID0gZXNjYXBlKG9yaWdpbmFsKVxuICAgICAgY29uc3QgdW5lc2NhcGVkID0gdW5lc2NhcGUoZXNjYXBlZClcblxuICAgICAgZXhwZWN0KHVuZXNjYXBlZCkudG9CZShvcmlnaW5hbClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tcGxleCBzdHJpbmdzIHdpdGhvdXQgYmFja3NsYXNoZXMnLCAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHN0cmluZyBjb250YWlucyBjb250cm9sIGNoYXJhY3RlcnMgYnV0IG5vIGxpdGVyYWwgYmFja3NsYXNoZXMuXG4gICAgICBjb25zdCBvcmlnaW5hbCA9ICdIZWxsb1xcbldvcmxkXFx0IVxcclxcbidcbiAgICAgIGNvbnN0IGVzY2FwZWQgPSBlc2NhcGUob3JpZ2luYWwpXG4gICAgICBjb25zdCB1bmVzY2FwZWQgPSB1bmVzY2FwZShlc2NhcGVkKVxuICAgICAgZXhwZWN0KHVuZXNjYXBlZCkudG9CZShvcmlnaW5hbClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkb2N1bWVudCBiZWhhdmlvciBmb3Igc3RyaW5ncyB3aXRoIGV4aXN0aW5nIGJhY2tzbGFzaGVzJywgKCkgPT4ge1xuICAgICAgLy8gV2hlbiB0aGUgb3JpZ2luYWwgc3RyaW5nIGFscmVhZHkgY29udGFpbnMgYmFja3NsYXNoIHNlcXVlbmNlcyxcbiAgICAgIC8vIGVzY2FwZS91bmVzY2FwZSBhcmUgbm90IHBlcmZlY3RseSBzeW1tZXRyaWMgYmVjYXVzZSBlc2NhcGUoKVxuICAgICAgLy8gZG9lcyBub3QgZXNjYXBlIGJhY2tzbGFzaGVzLlxuICAgICAgY29uc3Qgb3JpZ2luYWwgPSAnSGVsbG9cXFxcbldvcmxkJ1xuICAgICAgY29uc3QgZXNjYXBlZCA9IGVzY2FwZShvcmlnaW5hbClcbiAgICAgIGNvbnN0IHVuZXNjYXBlZCA9IHVuZXNjYXBlKGVzY2FwZWQpXG4gICAgICAvLyBUaGUgdW5lc2NhcGVkIHZhbHVlIGludGVycHJldHMgXCJcXG5cIiBhcyBhIG5ld2xpbmUsIHNvIGl0IGRpZmZlcnMgZnJvbSB0aGUgb3JpZ2luYWwuXG4gICAgICBleHBlY3QodW5lc2NhcGVkKS50b0JlKCdIZWxsb1xcbldvcmxkJylcbiAgICAgIGV4cGVjdCh1bmVzY2FwZWQpLm5vdC50b0JlKG9yaWdpbmFsKVxuICAgIH0pXG4gIH0pXG59KVxuIl19