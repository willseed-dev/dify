"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const index_1 = require("./index");
// Mock next/dynamic to return synchronous components immediately
vi.mock('next/dynamic', () => ({
    default: (loader, _options) => {
        let Component = null;
        // Try to resolve the loader synchronously for mocked modules
        try {
            const result = loader();
            if (result && typeof result.then === 'function') {
                // For async modules, we need to handle them specially
                // This will work with vi.mock since mocks resolve synchronously
                result.then((mod) => {
                    Component = (mod.default || mod);
                });
            }
            else if (result) {
                Component = (result.default || result);
            }
        }
        catch {
            // If the module can't be resolved, Component stays null
        }
        // Return a simple wrapper that renders the component or null
        const DynamicComponent = React.forwardRef((props, ref) => {
            // For mocked modules, Component should already be set
            if (Component)
                return <Component {...props} ref={ref}/>;
            return null;
        });
        DynamicComponent.displayName = 'DynamicComponent';
        return DynamicComponent;
    },
}));
// Mock workflow store
let mockHistoryWorkflowData = null;
let mockShowDebugAndPreviewPanel = false;
let mockShowGlobalVariablePanel = false;
let mockShowInputFieldPanel = false;
let mockShowInputFieldPreviewPanel = false;
let mockInputFieldEditPanelProps = null;
let mockPipelineId = 'test-pipeline-123';
vi.mock('@/app/components/workflow/store', () => ({
    useStore: (selector) => {
        const state = {
            historyWorkflowData: mockHistoryWorkflowData,
            showDebugAndPreviewPanel: mockShowDebugAndPreviewPanel,
            showGlobalVariablePanel: mockShowGlobalVariablePanel,
            showInputFieldPanel: mockShowInputFieldPanel,
            showInputFieldPreviewPanel: mockShowInputFieldPreviewPanel,
            inputFieldEditPanelProps: mockInputFieldEditPanelProps,
            pipelineId: mockPipelineId,
        };
        return selector(state);
    },
}));
// Mock Panel component to capture props and render children
let capturedPanelProps = null;
vi.mock('@/app/components/workflow/panel', () => ({
    default: (props) => {
        capturedPanelProps = props;
        return (<div data-testid="workflow-panel">
        <div data-testid="panel-left">{props.components?.left}</div>
        <div data-testid="panel-right">{props.components?.right}</div>
      </div>);
    },
}));
// Mock Record component
vi.mock('@/app/components/workflow/panel/record', () => ({
    default: () => <div data-testid="record-panel">Record Panel</div>,
}));
// Mock TestRunPanel component
vi.mock('@/app/components/rag-pipeline/components/panel/test-run', () => ({
    default: () => <div data-testid="test-run-panel">Test Run Panel</div>,
}));
// Mock InputFieldPanel component
vi.mock('./input-field', () => ({
    default: () => <div data-testid="input-field-panel">Input Field Panel</div>,
}));
// Mock InputFieldEditorPanel component
const mockInputFieldEditorProps = vi.fn();
vi.mock('./input-field/editor', () => ({
    default: (props) => {
        mockInputFieldEditorProps(props);
        return <div data-testid="input-field-editor-panel">Input Field Editor Panel</div>;
    },
}));
// Mock PreviewPanel component
vi.mock('./input-field/preview', () => ({
    default: () => <div data-testid="preview-panel">Preview Panel</div>,
}));
// Mock GlobalVariablePanel component
vi.mock('@/app/components/workflow/panel/global-variable-panel', () => ({
    default: () => <div data-testid="global-variable-panel">Global Variable Panel</div>,
}));
const setupMocks = (options) => {
    mockHistoryWorkflowData = options?.historyWorkflowData ?? null;
    mockShowDebugAndPreviewPanel = options?.showDebugAndPreviewPanel ?? false;
    mockShowGlobalVariablePanel = options?.showGlobalVariablePanel ?? false;
    mockShowInputFieldPanel = options?.showInputFieldPanel ?? false;
    mockShowInputFieldPreviewPanel = options?.showInputFieldPreviewPanel ?? false;
    mockInputFieldEditPanelProps = options?.inputFieldEditPanelProps ?? null;
    mockPipelineId = options?.pipelineId ?? 'test-pipeline-123';
    capturedPanelProps = null;
};
// ============================================================================
// RagPipelinePanel Component Tests
// ============================================================================
describe('RagPipelinePanel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    // -------------------------------------------------------------------------
    // Rendering Tests
    // -------------------------------------------------------------------------
    describe('Rendering', () => {
        it('should render without crashing', async () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('workflow-panel')).toBeInTheDocument();
            });
        });
        it('should render Panel component with correct structure', async () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('panel-left')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('panel-right')).toBeInTheDocument();
            });
        });
        it('should pass versionHistoryPanelProps to Panel', async () => {
            // Arrange
            setupMocks({ pipelineId: 'my-pipeline-456' });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(capturedPanelProps?.versionHistoryPanelProps).toBeDefined();
                expect(capturedPanelProps?.versionHistoryPanelProps?.getVersionListUrl).toBe('/rag/pipelines/my-pipeline-456/workflows');
            });
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests - versionHistoryPanelProps
    // -------------------------------------------------------------------------
    describe('Memoization - versionHistoryPanelProps', () => {
        it('should compute correct getVersionListUrl based on pipelineId', async () => {
            // Arrange
            setupMocks({ pipelineId: 'pipeline-abc' });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(capturedPanelProps?.versionHistoryPanelProps?.getVersionListUrl).toBe('/rag/pipelines/pipeline-abc/workflows');
            });
        });
        it('should compute correct deleteVersionUrl function', async () => {
            // Arrange
            setupMocks({ pipelineId: 'pipeline-xyz' });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                const deleteUrl = capturedPanelProps?.versionHistoryPanelProps?.deleteVersionUrl?.('version-1');
                expect(deleteUrl).toBe('/rag/pipelines/pipeline-xyz/workflows/version-1');
            });
        });
        it('should compute correct updateVersionUrl function', async () => {
            // Arrange
            setupMocks({ pipelineId: 'pipeline-def' });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                const updateUrl = capturedPanelProps?.versionHistoryPanelProps?.updateVersionUrl?.('version-2');
                expect(updateUrl).toBe('/rag/pipelines/pipeline-def/workflows/version-2');
            });
        });
        it('should set latestVersionId to empty string', async () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(capturedPanelProps?.versionHistoryPanelProps?.latestVersionId).toBe('');
            });
        });
    });
    // -------------------------------------------------------------------------
    // Memoization Tests - panelProps
    // -------------------------------------------------------------------------
    describe('Memoization - panelProps', () => {
        it('should pass components.left to Panel', async () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(capturedPanelProps?.components?.left).toBeDefined();
            });
        });
        it('should pass components.right to Panel', async () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(capturedPanelProps?.components?.right).toBeDefined();
            });
        });
        it('should pass versionHistoryPanelProps to panelProps', async () => {
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(capturedPanelProps?.versionHistoryPanelProps).toBeDefined();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Component Memoization Tests (React.memo)
    // -------------------------------------------------------------------------
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', async () => {
            // The component should not break when re-rendered
            const { rerender } = (0, react_1.render)(<index_1.default />);
            // Act - rerender without prop changes
            rerender(<index_1.default />);
            // Assert - component should still render correctly
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('workflow-panel')).toBeInTheDocument();
            });
        });
    });
});
// ============================================================================
// RagPipelinePanelOnRight Component Tests
// ============================================================================
describe('RagPipelinePanelOnRight', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    // -------------------------------------------------------------------------
    // Conditional Rendering - Record Panel
    // -------------------------------------------------------------------------
    describe('Record Panel Conditional Rendering', () => {
        it('should render Record panel when historyWorkflowData exists', async () => {
            // Arrange
            setupMocks({ historyWorkflowData: { id: 'history-1' } });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('record-panel')).toBeInTheDocument();
            });
        });
        it('should not render Record panel when historyWorkflowData is null', async () => {
            // Arrange
            setupMocks({ historyWorkflowData: null });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('record-panel')).not.toBeInTheDocument();
            });
        });
        it('should not render Record panel when historyWorkflowData is undefined', async () => {
            // Arrange
            setupMocks({ historyWorkflowData: undefined });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('record-panel')).not.toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Conditional Rendering - TestRun Panel
    // -------------------------------------------------------------------------
    describe('TestRun Panel Conditional Rendering', () => {
        it('should render TestRun panel when showDebugAndPreviewPanel is true', async () => {
            // Arrange
            setupMocks({ showDebugAndPreviewPanel: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('test-run-panel')).toBeInTheDocument();
            });
        });
        it('should not render TestRun panel when showDebugAndPreviewPanel is false', async () => {
            // Arrange
            setupMocks({ showDebugAndPreviewPanel: false });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('test-run-panel')).not.toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Conditional Rendering - GlobalVariable Panel
    // -------------------------------------------------------------------------
    describe('GlobalVariable Panel Conditional Rendering', () => {
        it('should render GlobalVariable panel when showGlobalVariablePanel is true', async () => {
            // Arrange
            setupMocks({ showGlobalVariablePanel: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('global-variable-panel')).toBeInTheDocument();
            });
        });
        it('should not render GlobalVariable panel when showGlobalVariablePanel is false', async () => {
            // Arrange
            setupMocks({ showGlobalVariablePanel: false });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('global-variable-panel')).not.toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Multiple Panels Rendering
    // -------------------------------------------------------------------------
    describe('Multiple Panels Rendering', () => {
        it('should render all right panels when all conditions are true', async () => {
            // Arrange
            setupMocks({
                historyWorkflowData: { id: 'history-1' },
                showDebugAndPreviewPanel: true,
                showGlobalVariablePanel: true,
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('record-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('test-run-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('global-variable-panel')).toBeInTheDocument();
            });
        });
        it('should render no right panels when all conditions are false', async () => {
            // Arrange
            setupMocks({
                historyWorkflowData: null,
                showDebugAndPreviewPanel: false,
                showGlobalVariablePanel: false,
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('record-panel')).not.toBeInTheDocument();
                expect(react_1.screen.queryByTestId('test-run-panel')).not.toBeInTheDocument();
                expect(react_1.screen.queryByTestId('global-variable-panel')).not.toBeInTheDocument();
            });
        });
        it('should render only Record and TestRun panels', async () => {
            // Arrange
            setupMocks({
                historyWorkflowData: { id: 'history-1' },
                showDebugAndPreviewPanel: true,
                showGlobalVariablePanel: false,
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('record-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('test-run-panel')).toBeInTheDocument();
                expect(react_1.screen.queryByTestId('global-variable-panel')).not.toBeInTheDocument();
            });
        });
    });
});
// ============================================================================
// RagPipelinePanelOnLeft Component Tests
// ============================================================================
describe('RagPipelinePanelOnLeft', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    // -------------------------------------------------------------------------
    // Conditional Rendering - Preview Panel
    // -------------------------------------------------------------------------
    describe('Preview Panel Conditional Rendering', () => {
        it('should render Preview panel when showInputFieldPreviewPanel is true', async () => {
            // Arrange
            setupMocks({ showInputFieldPreviewPanel: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('preview-panel')).toBeInTheDocument();
            });
        });
        it('should not render Preview panel when showInputFieldPreviewPanel is false', async () => {
            // Arrange
            setupMocks({ showInputFieldPreviewPanel: false });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('preview-panel')).not.toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Conditional Rendering - InputFieldEditor Panel
    // -------------------------------------------------------------------------
    describe('InputFieldEditor Panel Conditional Rendering', () => {
        it('should render InputFieldEditor panel when inputFieldEditPanelProps is provided', async () => {
            // Arrange
            const editProps = {
                onClose: vi.fn(),
                onSubmit: vi.fn(),
                initialData: { variable: 'test' },
            };
            setupMocks({ inputFieldEditPanelProps: editProps });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('input-field-editor-panel')).toBeInTheDocument();
            });
        });
        it('should not render InputFieldEditor panel when inputFieldEditPanelProps is null', async () => {
            // Arrange
            setupMocks({ inputFieldEditPanelProps: null });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('input-field-editor-panel')).not.toBeInTheDocument();
            });
        });
        it('should pass props to InputFieldEditor panel', async () => {
            // Arrange
            const editProps = {
                onClose: vi.fn(),
                onSubmit: vi.fn(),
                initialData: { variable: 'test_var', label: 'Test Label' },
            };
            setupMocks({ inputFieldEditPanelProps: editProps });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockInputFieldEditorProps).toHaveBeenCalledWith(expect.objectContaining({
                    onClose: editProps.onClose,
                    onSubmit: editProps.onSubmit,
                    initialData: editProps.initialData,
                }));
            });
        });
    });
    // -------------------------------------------------------------------------
    // Conditional Rendering - InputField Panel
    // -------------------------------------------------------------------------
    describe('InputField Panel Conditional Rendering', () => {
        it('should render InputField panel when showInputFieldPanel is true', async () => {
            // Arrange
            setupMocks({ showInputFieldPanel: true });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('input-field-panel')).toBeInTheDocument();
            });
        });
        it('should not render InputField panel when showInputFieldPanel is false', async () => {
            // Arrange
            setupMocks({ showInputFieldPanel: false });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('input-field-panel')).not.toBeInTheDocument();
            });
        });
    });
    // -------------------------------------------------------------------------
    // Multiple Panels Rendering
    // -------------------------------------------------------------------------
    describe('Multiple Left Panels Rendering', () => {
        it('should render all left panels when all conditions are true', async () => {
            // Arrange
            setupMocks({
                showInputFieldPreviewPanel: true,
                inputFieldEditPanelProps: { onClose: vi.fn(), onSubmit: vi.fn() },
                showInputFieldPanel: true,
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('preview-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('input-field-editor-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('input-field-panel')).toBeInTheDocument();
            });
        });
        it('should render no left panels when all conditions are false', async () => {
            // Arrange
            setupMocks({
                showInputFieldPreviewPanel: false,
                inputFieldEditPanelProps: null,
                showInputFieldPanel: false,
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByTestId('preview-panel')).not.toBeInTheDocument();
                expect(react_1.screen.queryByTestId('input-field-editor-panel')).not.toBeInTheDocument();
                expect(react_1.screen.queryByTestId('input-field-panel')).not.toBeInTheDocument();
            });
        });
        it('should render only Preview and InputField panels', async () => {
            // Arrange
            setupMocks({
                showInputFieldPreviewPanel: true,
                inputFieldEditPanelProps: null,
                showInputFieldPanel: true,
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('preview-panel')).toBeInTheDocument();
                expect(react_1.screen.queryByTestId('input-field-editor-panel')).not.toBeInTheDocument();
                expect(react_1.screen.getByTestId('input-field-panel')).toBeInTheDocument();
            });
        });
    });
});
// ============================================================================
// Edge Cases Tests
// ============================================================================
describe('Edge Cases', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    // -------------------------------------------------------------------------
    // Empty/Undefined Values
    // -------------------------------------------------------------------------
    describe('Empty/Undefined Values', () => {
        it('should handle empty pipelineId gracefully', async () => {
            // Arrange
            setupMocks({ pipelineId: '' });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(capturedPanelProps?.versionHistoryPanelProps?.getVersionListUrl).toBe('/rag/pipelines//workflows');
            });
        });
        it('should handle special characters in pipelineId', async () => {
            // Arrange
            setupMocks({ pipelineId: 'pipeline-with-special_chars.123' });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(capturedPanelProps?.versionHistoryPanelProps?.getVersionListUrl).toBe('/rag/pipelines/pipeline-with-special_chars.123/workflows');
            });
        });
    });
    // -------------------------------------------------------------------------
    // Props Spreading Tests
    // -------------------------------------------------------------------------
    describe('Props Spreading', () => {
        it('should correctly spread inputFieldEditPanelProps to editor component', async () => {
            // Arrange
            const customProps = {
                onClose: vi.fn(),
                onSubmit: vi.fn(),
                initialData: {
                    variable: 'custom_var',
                    label: 'Custom Label',
                    type: 'text',
                },
                extraProp: 'extra-value',
            };
            setupMocks({ inputFieldEditPanelProps: customProps });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockInputFieldEditorProps).toHaveBeenCalledWith(expect.objectContaining({
                    extraProp: 'extra-value',
                }));
            });
        });
    });
    // -------------------------------------------------------------------------
    // State Combinations
    // -------------------------------------------------------------------------
    describe('State Combinations', () => {
        it('should handle all panels visible simultaneously', async () => {
            // Arrange
            setupMocks({
                historyWorkflowData: { id: 'h1' },
                showDebugAndPreviewPanel: true,
                showGlobalVariablePanel: true,
                showInputFieldPreviewPanel: true,
                inputFieldEditPanelProps: { onClose: vi.fn(), onSubmit: vi.fn() },
                showInputFieldPanel: true,
            });
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert - All panels should be visible
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('record-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('test-run-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('global-variable-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('preview-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('input-field-editor-panel')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('input-field-panel')).toBeInTheDocument();
            });
        });
    });
});
// ============================================================================
// URL Generator Functions Tests
// ============================================================================
describe('URL Generator Functions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    it('should return consistent URLs for same versionId', async () => {
        // Arrange
        setupMocks({ pipelineId: 'stable-pipeline' });
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert
        await (0, react_1.waitFor)(() => {
            const deleteUrl1 = capturedPanelProps?.versionHistoryPanelProps?.deleteVersionUrl?.('version-x');
            const deleteUrl2 = capturedPanelProps?.versionHistoryPanelProps?.deleteVersionUrl?.('version-x');
            expect(deleteUrl1).toBe(deleteUrl2);
        });
    });
    it('should return different URLs for different versionIds', async () => {
        // Arrange
        setupMocks({ pipelineId: 'stable-pipeline' });
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert
        await (0, react_1.waitFor)(() => {
            const deleteUrl1 = capturedPanelProps?.versionHistoryPanelProps?.deleteVersionUrl?.('version-1');
            const deleteUrl2 = capturedPanelProps?.versionHistoryPanelProps?.deleteVersionUrl?.('version-2');
            expect(deleteUrl1).not.toBe(deleteUrl2);
            expect(deleteUrl1).toBe('/rag/pipelines/stable-pipeline/workflows/version-1');
            expect(deleteUrl2).toBe('/rag/pipelines/stable-pipeline/workflows/version-2');
        });
    });
});
// ============================================================================
// Type Safety Tests
// ============================================================================
describe('Type Safety', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    it('should pass correct PanelProps structure', async () => {
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert - Check structure matches PanelProps
        await (0, react_1.waitFor)(() => {
            expect(capturedPanelProps).toHaveProperty('components');
            expect(capturedPanelProps).toHaveProperty('versionHistoryPanelProps');
            expect(capturedPanelProps?.components).toHaveProperty('left');
            expect(capturedPanelProps?.components).toHaveProperty('right');
        });
    });
    it('should pass correct versionHistoryPanelProps structure', async () => {
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert
        await (0, react_1.waitFor)(() => {
            expect(capturedPanelProps?.versionHistoryPanelProps).toHaveProperty('getVersionListUrl');
            expect(capturedPanelProps?.versionHistoryPanelProps).toHaveProperty('deleteVersionUrl');
            expect(capturedPanelProps?.versionHistoryPanelProps).toHaveProperty('updateVersionUrl');
            expect(capturedPanelProps?.versionHistoryPanelProps).toHaveProperty('latestVersionId');
        });
    });
});
// ============================================================================
// Performance Tests
// ============================================================================
describe('Performance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    it('should handle multiple rerenders without issues', async () => {
        // Arrange
        const { rerender } = (0, react_1.render)(<index_1.default />);
        // Act - Multiple rerenders
        for (let i = 0; i < 10; i++)
            rerender(<index_1.default />);
        // Assert - Component should still work
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByTestId('workflow-panel')).toBeInTheDocument();
        });
    });
});
// ============================================================================
// Integration Tests
// ============================================================================
describe('Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupMocks();
    });
    it('should pass correct components to Panel', async () => {
        // Arrange
        setupMocks({
            historyWorkflowData: { id: 'h1' },
            showInputFieldPanel: true,
        });
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert
        await (0, react_1.waitFor)(() => {
            expect(capturedPanelProps?.components?.left).toBeDefined();
            expect(capturedPanelProps?.components?.right).toBeDefined();
            // Check that the components are React elements
            expect(React.isValidElement(capturedPanelProps?.components?.left)).toBe(true);
            expect(React.isValidElement(capturedPanelProps?.components?.right)).toBe(true);
        });
    });
    it('should correctly consume all store selectors', async () => {
        // Arrange
        setupMocks({
            historyWorkflowData: { id: 'test-history' },
            showDebugAndPreviewPanel: true,
            showGlobalVariablePanel: true,
            showInputFieldPanel: true,
            showInputFieldPreviewPanel: true,
            inputFieldEditPanelProps: { onClose: vi.fn(), onSubmit: vi.fn() },
            pipelineId: 'integration-test-pipeline',
        });
        // Act
        (0, react_1.render)(<index_1.default />);
        // Assert - All store-dependent rendering should work
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByTestId('record-panel')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('test-run-panel')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('global-variable-panel')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('input-field-panel')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('preview-panel')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('input-field-editor-panel')).toBeInTheDocument();
            expect(capturedPanelProps?.versionHistoryPanelProps?.getVersionListUrl).toBe('/rag/pipelines/integration-test-pipeline/workflows');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWdFO0FBQ2hFLCtCQUE4QjtBQUM5QixtQ0FBc0M7QUFhdEMsaUVBQWlFO0FBQ2pFLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDN0IsT0FBTyxFQUFFLENBQUMsTUFBNkIsRUFBRSxRQUFrQyxFQUFFLEVBQUU7UUFDN0UsSUFBSSxTQUFTLEdBQXdELElBQUksQ0FBQTtRQUV6RSw2REFBNkQ7UUFDN0QsSUFBSSxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxFQUFxQixDQUFBO1lBQzFDLElBQUksTUFBTSxJQUFJLE9BQVEsTUFBaUMsQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFLENBQUM7Z0JBQzVFLHNEQUFzRDtnQkFDdEQsZ0VBQWdFO2dCQUMvRCxNQUFpQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWtCLEVBQUUsRUFBRTtvQkFDN0QsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQWlELENBQUE7Z0JBQ2xGLENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQztpQkFDSSxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixTQUFTLEdBQUcsQ0FBRSxNQUF3QixDQUFDLE9BQU8sSUFBSSxNQUFNLENBQWlELENBQUE7WUFDM0csQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUM7WUFDTCx3REFBd0Q7UUFDMUQsQ0FBQztRQUVELDZEQUE2RDtRQUM3RCxNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUE4QixFQUFFLEdBQXVCLEVBQUUsRUFBRTtZQUNwRyxzREFBc0Q7WUFDdEQsSUFBSSxTQUFTO2dCQUNYLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLENB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QUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGFuZWxQcm9wcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcGFuZWwnXG5pbXBvcnQgeyByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSYWdQaXBlbGluZVBhbmVsIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgRXh0ZXJuYWwgRGVwZW5kZW5jaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIFR5cGUgZGVmaW5pdGlvbnMgZm9yIGR5bmFtaWMgbW9kdWxlXG50eXBlIER5bmFtaWNNb2R1bGUgPSB7XG4gIGRlZmF1bHQ/OiBSZWFjdC5Db21wb25lbnRUeXBlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PlxufVxuXG50eXBlIFByb21pc2VPck1vZHVsZSA9IFByb21pc2U8RHluYW1pY01vZHVsZT4gfCBEeW5hbWljTW9kdWxlXG5cbi8vIE1vY2sgbmV4dC9keW5hbWljIHRvIHJldHVybiBzeW5jaHJvbm91cyBjb21wb25lbnRzIGltbWVkaWF0ZWx5XG52aS5tb2NrKCduZXh0L2R5bmFtaWMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAobG9hZGVyOiAoKSA9PiBQcm9taXNlT3JNb2R1bGUsIF9vcHRpb25zPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICBsZXQgQ29tcG9uZW50OiBSZWFjdC5Db21wb25lbnRUeXBlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB8IG51bGwgPSBudWxsXG5cbiAgICAvLyBUcnkgdG8gcmVzb2x2ZSB0aGUgbG9hZGVyIHN5bmNocm9ub3VzbHkgZm9yIG1vY2tlZCBtb2R1bGVzXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGxvYWRlcigpIGFzIFByb21pc2VPck1vZHVsZVxuICAgICAgaWYgKHJlc3VsdCAmJiB0eXBlb2YgKHJlc3VsdCBhcyBQcm9taXNlPER5bmFtaWNNb2R1bGU+KS50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIEZvciBhc3luYyBtb2R1bGVzLCB3ZSBuZWVkIHRvIGhhbmRsZSB0aGVtIHNwZWNpYWxseVxuICAgICAgICAvLyBUaGlzIHdpbGwgd29yayB3aXRoIHZpLm1vY2sgc2luY2UgbW9ja3MgcmVzb2x2ZSBzeW5jaHJvbm91c2x5XG4gICAgICAgIChyZXN1bHQgYXMgUHJvbWlzZTxEeW5hbWljTW9kdWxlPikudGhlbigobW9kOiBEeW5hbWljTW9kdWxlKSA9PiB7XG4gICAgICAgICAgQ29tcG9uZW50ID0gKG1vZC5kZWZhdWx0IHx8IG1vZCkgYXMgUmVhY3QuQ29tcG9uZW50VHlwZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj5cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJlc3VsdCkge1xuICAgICAgICBDb21wb25lbnQgPSAoKHJlc3VsdCBhcyBEeW5hbWljTW9kdWxlKS5kZWZhdWx0IHx8IHJlc3VsdCkgYXMgUmVhY3QuQ29tcG9uZW50VHlwZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj5cbiAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgLy8gSWYgdGhlIG1vZHVsZSBjYW4ndCBiZSByZXNvbHZlZCwgQ29tcG9uZW50IHN0YXlzIG51bGxcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBzaW1wbGUgd3JhcHBlciB0aGF0IHJlbmRlcnMgdGhlIGNvbXBvbmVudCBvciBudWxsXG4gICAgY29uc3QgRHluYW1pY0NvbXBvbmVudCA9IFJlYWN0LmZvcndhcmRSZWYoKHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgcmVmOiBSZWFjdC5SZWY8dW5rbm93bj4pID0+IHtcbiAgICAgIC8vIEZvciBtb2NrZWQgbW9kdWxlcywgQ29tcG9uZW50IHNob3VsZCBhbHJlYWR5IGJlIHNldFxuICAgICAgaWYgKENvbXBvbmVudClcbiAgICAgICAgcmV0dXJuIDxDb21wb25lbnQgey4uLnByb3BzfSByZWY9e3JlZn0gLz5cblxuICAgICAgcmV0dXJuIG51bGxcbiAgICB9KVxuXG4gICAgRHluYW1pY0NvbXBvbmVudC5kaXNwbGF5TmFtZSA9ICdEeW5hbWljQ29tcG9uZW50J1xuICAgIHJldHVybiBEeW5hbWljQ29tcG9uZW50XG4gIH0sXG59KSlcblxuLy8gTW9jayB3b3JrZmxvdyBzdG9yZVxubGV0IG1vY2tIaXN0b3J5V29ya2Zsb3dEYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgPSBudWxsXG5sZXQgbW9ja1Nob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCA9IGZhbHNlXG5sZXQgbW9ja1Nob3dHbG9iYWxWYXJpYWJsZVBhbmVsID0gZmFsc2VcbmxldCBtb2NrU2hvd0lucHV0RmllbGRQYW5lbCA9IGZhbHNlXG5sZXQgbW9ja1Nob3dJbnB1dEZpZWxkUHJldmlld1BhbmVsID0gZmFsc2VcbmxldCBtb2NrSW5wdXRGaWVsZEVkaXRQYW5lbFByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgPSBudWxsXG5sZXQgbW9ja1BpcGVsaW5lSWQgPSAndGVzdC1waXBlbGluZS0xMjMnXG5cbnR5cGUgTW9ja1N0b3JlU3RhdGUgPSB7XG4gIGhpc3RvcnlXb3JrZmxvd0RhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbFxuICBzaG93RGVidWdBbmRQcmV2aWV3UGFuZWw6IGJvb2xlYW5cbiAgc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWw6IGJvb2xlYW5cbiAgc2hvd0lucHV0RmllbGRQYW5lbDogYm9vbGVhblxuICBzaG93SW5wdXRGaWVsZFByZXZpZXdQYW5lbDogYm9vbGVhblxuICBpbnB1dEZpZWxkRWRpdFBhbmVsUHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbFxuICBwaXBlbGluZUlkOiBzdHJpbmdcbn1cblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZScsICgpID0+ICh7XG4gIHVzZVN0b3JlOiAoc2VsZWN0b3I6IChzdGF0ZTogTW9ja1N0b3JlU3RhdGUpID0+IHVua25vd24pID0+IHtcbiAgICBjb25zdCBzdGF0ZTogTW9ja1N0b3JlU3RhdGUgPSB7XG4gICAgICBoaXN0b3J5V29ya2Zsb3dEYXRhOiBtb2NrSGlzdG9yeVdvcmtmbG93RGF0YSxcbiAgICAgIHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbDogbW9ja1Nob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCxcbiAgICAgIHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiBtb2NrU2hvd0dsb2JhbFZhcmlhYmxlUGFuZWwsXG4gICAgICBzaG93SW5wdXRGaWVsZFBhbmVsOiBtb2NrU2hvd0lucHV0RmllbGRQYW5lbCxcbiAgICAgIHNob3dJbnB1dEZpZWxkUHJldmlld1BhbmVsOiBtb2NrU2hvd0lucHV0RmllbGRQcmV2aWV3UGFuZWwsXG4gICAgICBpbnB1dEZpZWxkRWRpdFBhbmVsUHJvcHM6IG1vY2tJbnB1dEZpZWxkRWRpdFBhbmVsUHJvcHMsXG4gICAgICBwaXBlbGluZUlkOiBtb2NrUGlwZWxpbmVJZCxcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yKHN0YXRlKVxuICB9LFxufSkpXG5cbi8vIE1vY2sgUGFuZWwgY29tcG9uZW50IHRvIGNhcHR1cmUgcHJvcHMgYW5kIHJlbmRlciBjaGlsZHJlblxubGV0IGNhcHR1cmVkUGFuZWxQcm9wczogUGFuZWxQcm9wcyB8IG51bGwgPSBudWxsXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3BhbmVsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBQYW5lbFByb3BzKSA9PiB7XG4gICAgY2FwdHVyZWRQYW5lbFByb3BzID0gcHJvcHNcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cIndvcmtmbG93LXBhbmVsXCI+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwYW5lbC1sZWZ0XCI+e3Byb3BzLmNvbXBvbmVudHM/LmxlZnR9PC9kaXY+XG4gICAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwYW5lbC1yaWdodFwiPntwcm9wcy5jb21wb25lbnRzPy5yaWdodH08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIFJlY29yZCBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvcGFuZWwvcmVjb3JkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cInJlY29yZC1wYW5lbFwiPlJlY29yZCBQYW5lbDwvZGl2Pixcbn0pKVxuXG4vLyBNb2NrIFRlc3RSdW5QYW5lbCBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcmFnLXBpcGVsaW5lL2NvbXBvbmVudHMvcGFuZWwvdGVzdC1ydW4nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwidGVzdC1ydW4tcGFuZWxcIj5UZXN0IFJ1biBQYW5lbDwvZGl2Pixcbn0pKVxuXG4vLyBNb2NrIElucHV0RmllbGRQYW5lbCBjb21wb25lbnRcbnZpLm1vY2soJy4vaW5wdXQtZmllbGQnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwiaW5wdXQtZmllbGQtcGFuZWxcIj5JbnB1dCBGaWVsZCBQYW5lbDwvZGl2Pixcbn0pKVxuXG4vLyBNb2NrIElucHV0RmllbGRFZGl0b3JQYW5lbCBjb21wb25lbnRcbmNvbnN0IG1vY2tJbnB1dEZpZWxkRWRpdG9yUHJvcHMgPSB2aS5mbigpXG52aS5tb2NrKCcuL2lucHV0LWZpZWxkL2VkaXRvcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICBtb2NrSW5wdXRGaWVsZEVkaXRvclByb3BzKHByb3BzKVxuICAgIHJldHVybiA8ZGl2IGRhdGEtdGVzdGlkPVwiaW5wdXQtZmllbGQtZWRpdG9yLXBhbmVsXCI+SW5wdXQgRmllbGQgRWRpdG9yIFBhbmVsPC9kaXY+XG4gIH0sXG59KSlcblxuLy8gTW9jayBQcmV2aWV3UGFuZWwgY29tcG9uZW50XG52aS5tb2NrKCcuL2lucHV0LWZpZWxkL3ByZXZpZXcnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwicHJldmlldy1wYW5lbFwiPlByZXZpZXcgUGFuZWw8L2Rpdj4sXG59KSlcblxuLy8gTW9jayBHbG9iYWxWYXJpYWJsZVBhbmVsIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9wYW5lbC9nbG9iYWwtdmFyaWFibGUtcGFuZWwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwiZ2xvYmFsLXZhcmlhYmxlLXBhbmVsXCI+R2xvYmFsIFZhcmlhYmxlIFBhbmVsPC9kaXY+LFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhlbHBlciBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxudHlwZSBTZXR1cE1vY2tPcHRpb25zID0ge1xuICBoaXN0b3J5V29ya2Zsb3dEYXRhPzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsXG4gIHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbD86IGJvb2xlYW5cbiAgc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWw/OiBib29sZWFuXG4gIHNob3dJbnB1dEZpZWxkUGFuZWw/OiBib29sZWFuXG4gIHNob3dJbnB1dEZpZWxkUHJldmlld1BhbmVsPzogYm9vbGVhblxuICBpbnB1dEZpZWxkRWRpdFBhbmVsUHJvcHM/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGxcbiAgcGlwZWxpbmVJZD86IHN0cmluZ1xufVxuXG5jb25zdCBzZXR1cE1vY2tzID0gKG9wdGlvbnM/OiBTZXR1cE1vY2tPcHRpb25zKSA9PiB7XG4gIG1vY2tIaXN0b3J5V29ya2Zsb3dEYXRhID0gb3B0aW9ucz8uaGlzdG9yeVdvcmtmbG93RGF0YSA/PyBudWxsXG4gIG1vY2tTaG93RGVidWdBbmRQcmV2aWV3UGFuZWwgPSBvcHRpb25zPy5zaG93RGVidWdBbmRQcmV2aWV3UGFuZWwgPz8gZmFsc2VcbiAgbW9ja1Nob3dHbG9iYWxWYXJpYWJsZVBhbmVsID0gb3B0aW9ucz8uc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWwgPz8gZmFsc2VcbiAgbW9ja1Nob3dJbnB1dEZpZWxkUGFuZWwgPSBvcHRpb25zPy5zaG93SW5wdXRGaWVsZFBhbmVsID8/IGZhbHNlXG4gIG1vY2tTaG93SW5wdXRGaWVsZFByZXZpZXdQYW5lbCA9IG9wdGlvbnM/LnNob3dJbnB1dEZpZWxkUHJldmlld1BhbmVsID8/IGZhbHNlXG4gIG1vY2tJbnB1dEZpZWxkRWRpdFBhbmVsUHJvcHMgPSBvcHRpb25zPy5pbnB1dEZpZWxkRWRpdFBhbmVsUHJvcHMgPz8gbnVsbFxuICBtb2NrUGlwZWxpbmVJZCA9IG9wdGlvbnM/LnBpcGVsaW5lSWQgPz8gJ3Rlc3QtcGlwZWxpbmUtMTIzJ1xuICBjYXB0dXJlZFBhbmVsUHJvcHMgPSBudWxsXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFJhZ1BpcGVsaW5lUGFuZWwgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdSYWdQaXBlbGluZVBhbmVsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBzZXR1cE1vY2tzKClcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd3b3JrZmxvdy1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBQYW5lbCBjb21wb25lbnQgd2l0aCBjb3JyZWN0IHN0cnVjdHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYW5lbC1sZWZ0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFuZWwtcmlnaHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcyB0byBQYW5lbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBwaXBlbGluZUlkOiAnbXktcGlwZWxpbmUtNDU2JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNhcHR1cmVkUGFuZWxQcm9wcz8udmVyc2lvbkhpc3RvcnlQYW5lbFByb3BzKS50b0JlRGVmaW5lZCgpXG4gICAgICAgIGV4cGVjdChjYXB0dXJlZFBhbmVsUHJvcHM/LnZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcz8uZ2V0VmVyc2lvbkxpc3RVcmwpLnRvQmUoXG4gICAgICAgICAgJy9yYWcvcGlwZWxpbmVzL215LXBpcGVsaW5lLTQ1Ni93b3JrZmxvd3MnLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBNZW1vaXphdGlvbiBUZXN0cyAtIHZlcnNpb25IaXN0b3J5UGFuZWxQcm9wc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiAtIHZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbXB1dGUgY29ycmVjdCBnZXRWZXJzaW9uTGlzdFVybCBiYXNlZCBvbiBwaXBlbGluZUlkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IHBpcGVsaW5lSWQ6ICdwaXBlbGluZS1hYmMnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHM/LmdldFZlcnNpb25MaXN0VXJsKS50b0JlKFxuICAgICAgICAgICcvcmFnL3BpcGVsaW5lcy9waXBlbGluZS1hYmMvd29ya2Zsb3dzJyxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGNvcnJlY3QgZGVsZXRlVmVyc2lvblVybCBmdW5jdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBwaXBlbGluZUlkOiAncGlwZWxpbmUteHl6JyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgZGVsZXRlVXJsID0gY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHM/LmRlbGV0ZVZlcnNpb25Vcmw/LigndmVyc2lvbi0xJylcbiAgICAgICAgZXhwZWN0KGRlbGV0ZVVybCkudG9CZSgnL3JhZy9waXBlbGluZXMvcGlwZWxpbmUteHl6L3dvcmtmbG93cy92ZXJzaW9uLTEnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIGNvcnJlY3QgdXBkYXRlVmVyc2lvblVybCBmdW5jdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBwaXBlbGluZUlkOiAncGlwZWxpbmUtZGVmJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgdXBkYXRlVXJsID0gY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHM/LnVwZGF0ZVZlcnNpb25Vcmw/LigndmVyc2lvbi0yJylcbiAgICAgICAgZXhwZWN0KHVwZGF0ZVVybCkudG9CZSgnL3JhZy9waXBlbGluZXMvcGlwZWxpbmUtZGVmL3dvcmtmbG93cy92ZXJzaW9uLTInKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZXQgbGF0ZXN0VmVyc2lvbklkIHRvIGVtcHR5IHN0cmluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHM/LmxhdGVzdFZlcnNpb25JZCkudG9CZSgnJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzIC0gcGFuZWxQcm9wc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiAtIHBhbmVsUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvbXBvbmVudHMubGVmdCB0byBQYW5lbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2FwdHVyZWRQYW5lbFByb3BzPy5jb21wb25lbnRzPy5sZWZ0KS50b0JlRGVmaW5lZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY29tcG9uZW50cy5yaWdodCB0byBQYW5lbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2FwdHVyZWRQYW5lbFByb3BzPy5jb21wb25lbnRzPy5yaWdodCkudG9CZURlZmluZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcyB0byBwYW5lbFByb3BzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjYXB0dXJlZFBhbmVsUHJvcHM/LnZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcykudG9CZURlZmluZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29tcG9uZW50IE1lbW9pemF0aW9uIFRlc3RzIChSZWFjdC5tZW1vKVxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIFRoZSBjb21wb25lbnQgc2hvdWxkIG5vdCBicmVhayB3aGVuIHJlLXJlbmRlcmVkXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFjdCAtIHJlcmVuZGVyIHdpdGhvdXQgcHJvcCBjaGFuZ2VzXG4gICAgICByZXJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gY29tcG9uZW50IHNob3VsZCBzdGlsbCByZW5kZXIgY29ycmVjdGx5XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnd29ya2Zsb3ctcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUmFnUGlwZWxpbmVQYW5lbE9uUmlnaHQgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdSYWdQaXBlbGluZVBhbmVsT25SaWdodCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgc2V0dXBNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb25kaXRpb25hbCBSZW5kZXJpbmcgLSBSZWNvcmQgUGFuZWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnUmVjb3JkIFBhbmVsIENvbmRpdGlvbmFsIFJlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBSZWNvcmQgcGFuZWwgd2hlbiBoaXN0b3J5V29ya2Zsb3dEYXRhIGV4aXN0cycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBoaXN0b3J5V29ya2Zsb3dEYXRhOiB7IGlkOiAnaGlzdG9yeS0xJyB9IH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWNvcmQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIFJlY29yZCBwYW5lbCB3aGVuIGhpc3RvcnlXb3JrZmxvd0RhdGEgaXMgbnVsbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBoaXN0b3J5V29ya2Zsb3dEYXRhOiBudWxsIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3JlY29yZC1wYW5lbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIFJlY29yZCBwYW5lbCB3aGVuIGhpc3RvcnlXb3JrZmxvd0RhdGEgaXMgdW5kZWZpbmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IGhpc3RvcnlXb3JrZmxvd0RhdGE6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdyZWNvcmQtcGFuZWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbmRpdGlvbmFsIFJlbmRlcmluZyAtIFRlc3RSdW4gUGFuZWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnVGVzdFJ1biBQYW5lbCBDb25kaXRpb25hbCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgVGVzdFJ1biBwYW5lbCB3aGVuIHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbDogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGVzdC1ydW4tcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIFRlc3RSdW4gcGFuZWwgd2hlbiBzaG93RGVidWdBbmRQcmV2aWV3UGFuZWwgaXMgZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHsgc2hvd0RlYnVnQW5kUHJldmlld1BhbmVsOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCd0ZXN0LXJ1bi1wYW5lbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29uZGl0aW9uYWwgUmVuZGVyaW5nIC0gR2xvYmFsVmFyaWFibGUgUGFuZWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnR2xvYmFsVmFyaWFibGUgUGFuZWwgQ29uZGl0aW9uYWwgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIEdsb2JhbFZhcmlhYmxlIHBhbmVsIHdoZW4gc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWwgaXMgdHJ1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBzaG93R2xvYmFsVmFyaWFibGVQYW5lbDogdHJ1ZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZ2xvYmFsLXZhcmlhYmxlLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBHbG9iYWxWYXJpYWJsZSBwYW5lbCB3aGVuIHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsIGlzIGZhbHNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdnbG9iYWwtdmFyaWFibGUtcGFuZWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIE11bHRpcGxlIFBhbmVscyBSZW5kZXJpbmdcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnTXVsdGlwbGUgUGFuZWxzIFJlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgcmlnaHQgcGFuZWxzIHdoZW4gYWxsIGNvbmRpdGlvbnMgYXJlIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgaGlzdG9yeVdvcmtmbG93RGF0YTogeyBpZDogJ2hpc3RvcnktMScgfSxcbiAgICAgICAgc2hvd0RlYnVnQW5kUHJldmlld1BhbmVsOiB0cnVlLFxuICAgICAgICBzaG93R2xvYmFsVmFyaWFibGVQYW5lbDogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWNvcmQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0ZXN0LXJ1bi1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2dsb2JhbC12YXJpYWJsZS1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBubyByaWdodCBwYW5lbHMgd2hlbiBhbGwgY29uZGl0aW9ucyBhcmUgZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgaGlzdG9yeVdvcmtmbG93RGF0YTogbnVsbCxcbiAgICAgICAgc2hvd0RlYnVnQW5kUHJldmlld1BhbmVsOiBmYWxzZSxcbiAgICAgICAgc2hvd0dsb2JhbFZhcmlhYmxlUGFuZWw6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmVjb3JkLXBhbmVsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgndGVzdC1ydW4tcGFuZWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdnbG9iYWwtdmFyaWFibGUtcGFuZWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG9ubHkgUmVjb3JkIGFuZCBUZXN0UnVuIHBhbmVscycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBoaXN0b3J5V29ya2Zsb3dEYXRhOiB7IGlkOiAnaGlzdG9yeS0xJyB9LFxuICAgICAgICBzaG93RGVidWdBbmRQcmV2aWV3UGFuZWw6IHRydWUsXG4gICAgICAgIHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWNvcmQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0ZXN0LXJ1bi1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZ2xvYmFsLXZhcmlhYmxlLXBhbmVsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBSYWdQaXBlbGluZVBhbmVsT25MZWZ0IENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnUmFnUGlwZWxpbmVQYW5lbE9uTGVmdCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgc2V0dXBNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBDb25kaXRpb25hbCBSZW5kZXJpbmcgLSBQcmV2aWV3IFBhbmVsXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ1ByZXZpZXcgUGFuZWwgQ29uZGl0aW9uYWwgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIFByZXZpZXcgcGFuZWwgd2hlbiBzaG93SW5wdXRGaWVsZFByZXZpZXdQYW5lbCBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IHNob3dJbnB1dEZpZWxkUHJldmlld1BhbmVsOiB0cnVlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwcmV2aWV3LXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBQcmV2aWV3IHBhbmVsIHdoZW4gc2hvd0lucHV0RmllbGRQcmV2aWV3UGFuZWwgaXMgZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHsgc2hvd0lucHV0RmllbGRQcmV2aWV3UGFuZWw6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3ByZXZpZXctcGFuZWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIENvbmRpdGlvbmFsIFJlbmRlcmluZyAtIElucHV0RmllbGRFZGl0b3IgUGFuZWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBkZXNjcmliZSgnSW5wdXRGaWVsZEVkaXRvciBQYW5lbCBDb25kaXRpb25hbCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5wdXRGaWVsZEVkaXRvciBwYW5lbCB3aGVuIGlucHV0RmllbGRFZGl0UGFuZWxQcm9wcyBpcyBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGVkaXRQcm9wcyA9IHtcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWJtaXQ6IHZpLmZuKCksXG4gICAgICAgIGluaXRpYWxEYXRhOiB7IHZhcmlhYmxlOiAndGVzdCcgfSxcbiAgICAgIH1cbiAgICAgIHNldHVwTW9ja3MoeyBpbnB1dEZpZWxkRWRpdFBhbmVsUHJvcHM6IGVkaXRQcm9wcyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtZmllbGQtZWRpdG9yLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBJbnB1dEZpZWxkRWRpdG9yIHBhbmVsIHdoZW4gaW5wdXRGaWVsZEVkaXRQYW5lbFByb3BzIGlzIG51bGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHsgaW5wdXRGaWVsZEVkaXRQYW5lbFByb3BzOiBudWxsIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2lucHV0LWZpZWxkLWVkaXRvci1wYW5lbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHByb3BzIHRvIElucHV0RmllbGRFZGl0b3IgcGFuZWwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBlZGl0UHJvcHMgPSB7XG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VibWl0OiB2aS5mbigpLFxuICAgICAgICBpbml0aWFsRGF0YTogeyB2YXJpYWJsZTogJ3Rlc3RfdmFyJywgbGFiZWw6ICdUZXN0IExhYmVsJyB9LFxuICAgICAgfVxuICAgICAgc2V0dXBNb2Nrcyh7IGlucHV0RmllbGRFZGl0UGFuZWxQcm9wczogZWRpdFByb3BzIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0lucHV0RmllbGRFZGl0b3JQcm9wcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgb25DbG9zZTogZWRpdFByb3BzLm9uQ2xvc2UsXG4gICAgICAgICAgICBvblN1Ym1pdDogZWRpdFByb3BzLm9uU3VibWl0LFxuICAgICAgICAgICAgaW5pdGlhbERhdGE6IGVkaXRQcm9wcy5pbml0aWFsRGF0YSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQ29uZGl0aW9uYWwgUmVuZGVyaW5nIC0gSW5wdXRGaWVsZCBQYW5lbFxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdJbnB1dEZpZWxkIFBhbmVsIENvbmRpdGlvbmFsIFJlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJbnB1dEZpZWxkIHBhbmVsIHdoZW4gc2hvd0lucHV0RmllbGRQYW5lbCBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IHNob3dJbnB1dEZpZWxkUGFuZWw6IHRydWUgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lucHV0LWZpZWxkLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBJbnB1dEZpZWxkIHBhbmVsIHdoZW4gc2hvd0lucHV0RmllbGRQYW5lbCBpcyBmYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3MoeyBzaG93SW5wdXRGaWVsZFBhbmVsOiBmYWxzZSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdpbnB1dC1maWVsZC1wYW5lbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gTXVsdGlwbGUgUGFuZWxzIFJlbmRlcmluZ1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdNdWx0aXBsZSBMZWZ0IFBhbmVscyBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGxlZnQgcGFuZWxzIHdoZW4gYWxsIGNvbmRpdGlvbnMgYXJlIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc2hvd0lucHV0RmllbGRQcmV2aWV3UGFuZWw6IHRydWUsXG4gICAgICAgIGlucHV0RmllbGRFZGl0UGFuZWxQcm9wczogeyBvbkNsb3NlOiB2aS5mbigpLCBvblN1Ym1pdDogdmkuZm4oKSB9LFxuICAgICAgICBzaG93SW5wdXRGaWVsZFBhbmVsOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1lZGl0b3ItcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBubyBsZWZ0IHBhbmVscyB3aGVuIGFsbCBjb25kaXRpb25zIGFyZSBmYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwTW9ja3Moe1xuICAgICAgICBzaG93SW5wdXRGaWVsZFByZXZpZXdQYW5lbDogZmFsc2UsXG4gICAgICAgIGlucHV0RmllbGRFZGl0UGFuZWxQcm9wczogbnVsbCxcbiAgICAgICAgc2hvd0lucHV0RmllbGRQYW5lbDogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwcmV2aWV3LXBhbmVsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnaW5wdXQtZmllbGQtZWRpdG9yLXBhbmVsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnaW5wdXQtZmllbGQtcGFuZWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG9ubHkgUHJldmlldyBhbmQgSW5wdXRGaWVsZCBwYW5lbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHtcbiAgICAgICAgc2hvd0lucHV0RmllbGRQcmV2aWV3UGFuZWw6IHRydWUsXG4gICAgICAgIGlucHV0RmllbGRFZGl0UGFuZWxQcm9wczogbnVsbCxcbiAgICAgICAgc2hvd0lucHV0RmllbGRQYW5lbDogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwcmV2aWV3LXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdpbnB1dC1maWVsZC1lZGl0b3ItcGFuZWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtZmllbGQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRWRnZSBDYXNlcyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgc2V0dXBNb2NrcygpXG4gIH0pXG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBFbXB0eS9VbmRlZmluZWQgVmFsdWVzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgZGVzY3JpYmUoJ0VtcHR5L1VuZGVmaW5lZCBWYWx1ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcGlwZWxpbmVJZCBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7IHBpcGVsaW5lSWQ6ICcnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHM/LmdldFZlcnNpb25MaXN0VXJsKS50b0JlKFxuICAgICAgICAgICcvcmFnL3BpcGVsaW5lcy8vd29ya2Zsb3dzJyxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHBpcGVsaW5lSWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBzZXR1cE1vY2tzKHsgcGlwZWxpbmVJZDogJ3BpcGVsaW5lLXdpdGgtc3BlY2lhbF9jaGFycy4xMjMnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHM/LmdldFZlcnNpb25MaXN0VXJsKS50b0JlKFxuICAgICAgICAgICcvcmFnL3BpcGVsaW5lcy9waXBlbGluZS13aXRoLXNwZWNpYWxfY2hhcnMuMTIzL3dvcmtmbG93cycsXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFByb3BzIFNwcmVhZGluZyBUZXN0c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdQcm9wcyBTcHJlYWRpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgc3ByZWFkIGlucHV0RmllbGRFZGl0UGFuZWxQcm9wcyB0byBlZGl0b3IgY29tcG9uZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY3VzdG9tUHJvcHMgPSB7XG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VibWl0OiB2aS5mbigpLFxuICAgICAgICBpbml0aWFsRGF0YToge1xuICAgICAgICAgIHZhcmlhYmxlOiAnY3VzdG9tX3ZhcicsXG4gICAgICAgICAgbGFiZWw6ICdDdXN0b20gTGFiZWwnLFxuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgfSxcbiAgICAgICAgZXh0cmFQcm9wOiAnZXh0cmEtdmFsdWUnLFxuICAgICAgfVxuICAgICAgc2V0dXBNb2Nrcyh7IGlucHV0RmllbGRFZGl0UGFuZWxQcm9wczogY3VzdG9tUHJvcHMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW5wdXRGaWVsZEVkaXRvclByb3BzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBleHRyYVByb3A6ICdleHRyYS12YWx1ZScsXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFN0YXRlIENvbWJpbmF0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGRlc2NyaWJlKCdTdGF0ZSBDb21iaW5hdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWxsIHBhbmVscyB2aXNpYmxlIHNpbXVsdGFuZW91c2x5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgc2V0dXBNb2Nrcyh7XG4gICAgICAgIGhpc3RvcnlXb3JrZmxvd0RhdGE6IHsgaWQ6ICdoMScgfSxcbiAgICAgICAgc2hvd0RlYnVnQW5kUHJldmlld1BhbmVsOiB0cnVlLFxuICAgICAgICBzaG93R2xvYmFsVmFyaWFibGVQYW5lbDogdHJ1ZSxcbiAgICAgICAgc2hvd0lucHV0RmllbGRQcmV2aWV3UGFuZWw6IHRydWUsXG4gICAgICAgIGlucHV0RmllbGRFZGl0UGFuZWxQcm9wczogeyBvbkNsb3NlOiB2aS5mbigpLCBvblN1Ym1pdDogdmkuZm4oKSB9LFxuICAgICAgICBzaG93SW5wdXRGaWVsZFBhbmVsOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEFsbCBwYW5lbHMgc2hvdWxkIGJlIHZpc2libGVcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWNvcmQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0ZXN0LXJ1bi1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2dsb2JhbC12YXJpYWJsZS1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1lZGl0b3ItcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnB1dC1maWVsZC1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBVUkwgR2VuZXJhdG9yIEZ1bmN0aW9ucyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnVVJMIEdlbmVyYXRvciBGdW5jdGlvbnMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHNldHVwTW9ja3MoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGNvbnNpc3RlbnQgVVJMcyBmb3Igc2FtZSB2ZXJzaW9uSWQnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIHNldHVwTW9ja3MoeyBwaXBlbGluZUlkOiAnc3RhYmxlLXBpcGVsaW5lJyB9KVxuXG4gICAgLy8gQWN0XG4gICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICBjb25zdCBkZWxldGVVcmwxID0gY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHM/LmRlbGV0ZVZlcnNpb25Vcmw/LigndmVyc2lvbi14JylcbiAgICAgIGNvbnN0IGRlbGV0ZVVybDIgPSBjYXB0dXJlZFBhbmVsUHJvcHM/LnZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcz8uZGVsZXRlVmVyc2lvblVybD8uKCd2ZXJzaW9uLXgnKVxuICAgICAgZXhwZWN0KGRlbGV0ZVVybDEpLnRvQmUoZGVsZXRlVXJsMilcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGRpZmZlcmVudCBVUkxzIGZvciBkaWZmZXJlbnQgdmVyc2lvbklkcycsIGFzeW5jICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgc2V0dXBNb2Nrcyh7IHBpcGVsaW5lSWQ6ICdzdGFibGUtcGlwZWxpbmUnIH0pXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgIGNvbnN0IGRlbGV0ZVVybDEgPSBjYXB0dXJlZFBhbmVsUHJvcHM/LnZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcz8uZGVsZXRlVmVyc2lvblVybD8uKCd2ZXJzaW9uLTEnKVxuICAgICAgY29uc3QgZGVsZXRlVXJsMiA9IGNhcHR1cmVkUGFuZWxQcm9wcz8udmVyc2lvbkhpc3RvcnlQYW5lbFByb3BzPy5kZWxldGVWZXJzaW9uVXJsPy4oJ3ZlcnNpb24tMicpXG4gICAgICBleHBlY3QoZGVsZXRlVXJsMSkubm90LnRvQmUoZGVsZXRlVXJsMilcbiAgICAgIGV4cGVjdChkZWxldGVVcmwxKS50b0JlKCcvcmFnL3BpcGVsaW5lcy9zdGFibGUtcGlwZWxpbmUvd29ya2Zsb3dzL3ZlcnNpb24tMScpXG4gICAgICBleHBlY3QoZGVsZXRlVXJsMikudG9CZSgnL3JhZy9waXBlbGluZXMvc3RhYmxlLXBpcGVsaW5lL3dvcmtmbG93cy92ZXJzaW9uLTInKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUeXBlIFNhZmV0eSBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnVHlwZSBTYWZldHknLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIHNldHVwTW9ja3MoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IFBhbmVsUHJvcHMgc3RydWN0dXJlJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEFjdFxuICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgIC8vIEFzc2VydCAtIENoZWNrIHN0cnVjdHVyZSBtYXRjaGVzIFBhbmVsUHJvcHNcbiAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgIGV4cGVjdChjYXB0dXJlZFBhbmVsUHJvcHMpLnRvSGF2ZVByb3BlcnR5KCdjb21wb25lbnRzJylcbiAgICAgIGV4cGVjdChjYXB0dXJlZFBhbmVsUHJvcHMpLnRvSGF2ZVByb3BlcnR5KCd2ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHMnKVxuICAgICAgZXhwZWN0KGNhcHR1cmVkUGFuZWxQcm9wcz8uY29tcG9uZW50cykudG9IYXZlUHJvcGVydHkoJ2xlZnQnKVxuICAgICAgZXhwZWN0KGNhcHR1cmVkUGFuZWxQcm9wcz8uY29tcG9uZW50cykudG9IYXZlUHJvcGVydHkoJ3JpZ2h0JylcbiAgICB9KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IHZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcyBzdHJ1Y3R1cmUnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gQWN0XG4gICAgcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICBleHBlY3QoY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHMpLnRvSGF2ZVByb3BlcnR5KCdnZXRWZXJzaW9uTGlzdFVybCcpXG4gICAgICBleHBlY3QoY2FwdHVyZWRQYW5lbFByb3BzPy52ZXJzaW9uSGlzdG9yeVBhbmVsUHJvcHMpLnRvSGF2ZVByb3BlcnR5KCdkZWxldGVWZXJzaW9uVXJsJylcbiAgICAgIGV4cGVjdChjYXB0dXJlZFBhbmVsUHJvcHM/LnZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcykudG9IYXZlUHJvcGVydHkoJ3VwZGF0ZVZlcnNpb25VcmwnKVxuICAgICAgZXhwZWN0KGNhcHR1cmVkUGFuZWxQcm9wcz8udmVyc2lvbkhpc3RvcnlQYW5lbFByb3BzKS50b0hhdmVQcm9wZXJ0eSgnbGF0ZXN0VmVyc2lvbklkJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUGVyZm9ybWFuY2UgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ1BlcmZvcm1hbmNlJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBzZXR1cE1vY2tzKClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSByZXJlbmRlcnMgd2l0aG91dCBpc3N1ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgIC8vIEFjdCAtIE11bHRpcGxlIHJlcmVuZGVyc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKylcbiAgICAgIHJlcmVuZGVyKDxSYWdQaXBlbGluZVBhbmVsIC8+KVxuXG4gICAgLy8gQXNzZXJ0IC0gQ29tcG9uZW50IHNob3VsZCBzdGlsbCB3b3JrXG4gICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd3b3JrZmxvdy1wYW5lbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEludGVncmF0aW9uIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdJbnRlZ3JhdGlvbiBUZXN0cycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgc2V0dXBNb2NrcygpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgY29tcG9uZW50cyB0byBQYW5lbCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgc2V0dXBNb2Nrcyh7XG4gICAgICBoaXN0b3J5V29ya2Zsb3dEYXRhOiB7IGlkOiAnaDEnIH0sXG4gICAgICBzaG93SW5wdXRGaWVsZFBhbmVsOiB0cnVlLFxuICAgIH0pXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXIoPFJhZ1BpcGVsaW5lUGFuZWwgLz4pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgIGV4cGVjdChjYXB0dXJlZFBhbmVsUHJvcHM/LmNvbXBvbmVudHM/LmxlZnQpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChjYXB0dXJlZFBhbmVsUHJvcHM/LmNvbXBvbmVudHM/LnJpZ2h0KS50b0JlRGVmaW5lZCgpXG5cbiAgICAgIC8vIENoZWNrIHRoYXQgdGhlIGNvbXBvbmVudHMgYXJlIFJlYWN0IGVsZW1lbnRzXG4gICAgICBleHBlY3QoUmVhY3QuaXNWYWxpZEVsZW1lbnQoY2FwdHVyZWRQYW5lbFByb3BzPy5jb21wb25lbnRzPy5sZWZ0KSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KFJlYWN0LmlzVmFsaWRFbGVtZW50KGNhcHR1cmVkUGFuZWxQcm9wcz8uY29tcG9uZW50cz8ucmlnaHQpKS50b0JlKHRydWUpXG4gICAgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNvcnJlY3RseSBjb25zdW1lIGFsbCBzdG9yZSBzZWxlY3RvcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gQXJyYW5nZVxuICAgIHNldHVwTW9ja3Moe1xuICAgICAgaGlzdG9yeVdvcmtmbG93RGF0YTogeyBpZDogJ3Rlc3QtaGlzdG9yeScgfSxcbiAgICAgIHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbDogdHJ1ZSxcbiAgICAgIHNob3dHbG9iYWxWYXJpYWJsZVBhbmVsOiB0cnVlLFxuICAgICAgc2hvd0lucHV0RmllbGRQYW5lbDogdHJ1ZSxcbiAgICAgIHNob3dJbnB1dEZpZWxkUHJldmlld1BhbmVsOiB0cnVlLFxuICAgICAgaW5wdXRGaWVsZEVkaXRQYW5lbFByb3BzOiB7IG9uQ2xvc2U6IHZpLmZuKCksIG9uU3VibWl0OiB2aS5mbigpIH0sXG4gICAgICBwaXBlbGluZUlkOiAnaW50ZWdyYXRpb24tdGVzdC1waXBlbGluZScsXG4gICAgfSlcblxuICAgIC8vIEFjdFxuICAgIHJlbmRlcig8UmFnUGlwZWxpbmVQYW5lbCAvPilcblxuICAgIC8vIEFzc2VydCAtIEFsbCBzdG9yZS1kZXBlbmRlbnQgcmVuZGVyaW5nIHNob3VsZCB3b3JrXG4gICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWNvcmQtcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGVzdC1ydW4tcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZ2xvYmFsLXZhcmlhYmxlLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lucHV0LWZpZWxkLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctcGFuZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5wdXQtZmllbGQtZWRpdG9yLXBhbmVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjYXB0dXJlZFBhbmVsUHJvcHM/LnZlcnNpb25IaXN0b3J5UGFuZWxQcm9wcz8uZ2V0VmVyc2lvbkxpc3RVcmwpLnRvQmUoXG4gICAgICAgICcvcmFnL3BpcGVsaW5lcy9pbnRlZ3JhdGlvbi10ZXN0LXBpcGVsaW5lL3dvcmtmbG93cycsXG4gICAgICApXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=