"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const datasets_1 = require("@/models/datasets");
const chunk_card_1 = require("./chunk-card");
const index_1 = require("./index");
const q_a_item_1 = require("./q-a-item");
const types_1 = require("./types");
// =============================================================================
// Test Data Factories
// =============================================================================
const createGeneralChunks = (overrides = []) => {
    if (overrides.length > 0)
        return overrides;
    return [
        'This is the first chunk of text content.',
        'This is the second chunk with different content.',
        'Third chunk here with more text.',
    ];
};
const createParentChildChunk = (overrides = {}) => ({
    child_contents: ['Child content 1', 'Child content 2'],
    parent_content: 'This is the parent content that contains the children.',
    parent_mode: 'paragraph',
    ...overrides,
});
const createParentChildChunks = (overrides = {}) => ({
    parent_child_chunks: [
        createParentChildChunk(),
        createParentChildChunk({
            child_contents: ['Another child 1', 'Another child 2', 'Another child 3'],
            parent_content: 'Another parent content here.',
        }),
    ],
    parent_mode: 'paragraph',
    ...overrides,
});
const createQAChunk = (overrides = {}) => ({
    question: 'What is the answer to life?',
    answer: 'The answer is 42.',
    ...overrides,
});
const createQAChunks = (overrides = {}) => ({
    qa_chunks: [
        createQAChunk(),
        createQAChunk({
            question: 'How does this work?',
            answer: 'It works by processing data.',
        }),
    ],
    ...overrides,
});
// =============================================================================
// QAItem Component Tests
// =============================================================================
describe('QAItem', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for basic rendering of QAItem component
    describe('Rendering', () => {
        it('should render question type with Q prefix', () => {
            // Arrange & Act
            (0, react_1.render)(<q_a_item_1.default type={types_1.QAItemType.Question} text="What is this?"/>);
            // Assert
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
            expect(react_1.screen.getByText('What is this?')).toBeInTheDocument();
        });
        it('should render answer type with A prefix', () => {
            // Arrange & Act
            (0, react_1.render)(<q_a_item_1.default type={types_1.QAItemType.Answer} text="This is the answer."/>);
            // Assert
            expect(react_1.screen.getByText('A')).toBeInTheDocument();
            expect(react_1.screen.getByText('This is the answer.')).toBeInTheDocument();
        });
    });
    // Tests for different prop variations
    describe('Props', () => {
        it('should render with empty text', () => {
            // Arrange & Act
            (0, react_1.render)(<q_a_item_1.default type={types_1.QAItemType.Question} text=""/>);
            // Assert
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
        });
        it('should render with long text content', () => {
            // Arrange
            const longText = 'A'.repeat(1000);
            // Act
            (0, react_1.render)(<q_a_item_1.default type={types_1.QAItemType.Answer} text={longText}/>);
            // Assert
            expect(react_1.screen.getByText(longText)).toBeInTheDocument();
        });
        it('should render with special characters in text', () => {
            // Arrange
            const specialText = '<script>alert("xss")</script> & "quotes" \'apostrophe\'';
            // Act
            (0, react_1.render)(<q_a_item_1.default type={types_1.QAItemType.Question} text={specialText}/>);
            // Assert
            expect(react_1.screen.getByText(specialText)).toBeInTheDocument();
        });
    });
    // Tests for memoization behavior
    describe('Memoization', () => {
        it('should be memoized with React.memo', () => {
            // Arrange & Act
            const { rerender } = (0, react_1.render)(<q_a_item_1.default type={types_1.QAItemType.Question} text="Test"/>);
            // Assert - component should render consistently
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test')).toBeInTheDocument();
            // Rerender with same props - should not cause issues
            rerender(<q_a_item_1.default type={types_1.QAItemType.Question} text="Test"/>);
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
        });
    });
});
// =============================================================================
// ChunkCard Component Tests
// =============================================================================
describe('ChunkCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for basic rendering with different chunk types
    describe('Rendering', () => {
        it('should render text chunk type correctly', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="This is plain text content." wordCount={27} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText('This is plain text content.')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-01/)).toBeInTheDocument();
        });
        it('should render QA chunk type with question and answer', () => {
            // Arrange
            const qaContent = {
                question: 'What is React?',
                answer: 'React is a JavaScript library.',
            };
            // Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.qa} content={qaContent} wordCount={45} positionId={2}/>);
            // Assert
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
            expect(react_1.screen.getByText('What is React?')).toBeInTheDocument();
            expect(react_1.screen.getByText('A')).toBeInTheDocument();
            expect(react_1.screen.getByText('React is a JavaScript library.')).toBeInTheDocument();
        });
        it('should render parent-child chunk type with child contents', () => {
            // Arrange
            const childContents = ['Child 1 content', 'Child 2 content'];
            // Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" content={childContents} wordCount={50} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText('Child 1 content')).toBeInTheDocument();
            expect(react_1.screen.getByText('Child 2 content')).toBeInTheDocument();
            expect(react_1.screen.getByText('C-1')).toBeInTheDocument();
            expect(react_1.screen.getByText('C-2')).toBeInTheDocument();
        });
    });
    // Tests for parent mode variations
    describe('Parent Mode Variations', () => {
        it('should show Parent-Chunk label prefix for paragraph mode', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" content={['Child content']} wordCount={13} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText(/Parent-Chunk-01/)).toBeInTheDocument();
        });
        it('should hide segment index tag for full-doc mode', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.parentChild} parentMode="full-doc" content={['Child content']} wordCount={13} positionId={1}/>);
            // Assert - should not show Chunk or Parent-Chunk label
            expect(react_1.screen.queryByText(/Chunk/)).not.toBeInTheDocument();
            expect(react_1.screen.queryByText(/Parent-Chunk/)).not.toBeInTheDocument();
        });
        it('should show Chunk label prefix for text mode', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Text content" wordCount={12} positionId={5}/>);
            // Assert
            expect(react_1.screen.getByText(/Chunk-05/)).toBeInTheDocument();
        });
    });
    // Tests for word count display
    describe('Word Count Display', () => {
        it('should display formatted word count', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Some content" wordCount={1234} positionId={1}/>);
            // Assert - formatNumber(1234) returns '1,234'
            expect(react_1.screen.getByText(/1,234/)).toBeInTheDocument();
        });
        it('should display word count with character translation key', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Some content" wordCount={100} positionId={1}/>);
            // Assert - translation key is returned as-is by mock
            expect(react_1.screen.getByText(/100\s+(?:\S.*)?characters/)).toBeInTheDocument();
        });
        it('should not display word count info for full-doc mode', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.parentChild} parentMode="full-doc" content={['Child']} wordCount={500} positionId={1}/>);
            // Assert - the header with word count should be hidden
            expect(react_1.screen.queryByText(/500/)).not.toBeInTheDocument();
        });
    });
    // Tests for position ID variations
    describe('Position ID', () => {
        it('should handle numeric position ID', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Content" wordCount={7} positionId={42}/>);
            // Assert
            expect(react_1.screen.getByText(/Chunk-42/)).toBeInTheDocument();
        });
        it('should handle string position ID', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Content" wordCount={7} positionId="99"/>);
            // Assert
            expect(react_1.screen.getByText(/Chunk-99/)).toBeInTheDocument();
        });
        it('should pad single digit position ID', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Content" wordCount={7} positionId={3}/>);
            // Assert
            expect(react_1.screen.getByText(/Chunk-03/)).toBeInTheDocument();
        });
    });
    // Tests for memoization dependencies
    describe('Memoization', () => {
        it('should update isFullDoc memo when parentMode changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" content={['Child']} wordCount={5} positionId={1}/>);
            // Assert - paragraph mode shows label
            expect(react_1.screen.getByText(/Parent-Chunk/)).toBeInTheDocument();
            // Act - change to full-doc
            rerender(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.parentChild} parentMode="full-doc" content={['Child']} wordCount={5} positionId={1}/>);
            // Assert - full-doc mode hides label
            expect(react_1.screen.queryByText(/Parent-Chunk/)).not.toBeInTheDocument();
        });
        it('should update contentElement memo when content changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Initial content" wordCount={15} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText('Initial content')).toBeInTheDocument();
            // Act
            rerender(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Updated content" wordCount={15} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText('Updated content')).toBeInTheDocument();
            expect(react_1.screen.queryByText('Initial content')).not.toBeInTheDocument();
        });
        it('should update contentElement memo when chunkType changes', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="Text content" wordCount={12} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText('Text content')).toBeInTheDocument();
            // Act - change to QA type
            const qaContent = { question: 'Q?', answer: 'A.' };
            rerender(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.qa} content={qaContent} wordCount={4} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
            expect(react_1.screen.getByText('Q?')).toBeInTheDocument();
        });
    });
    // Tests for edge cases
    describe('Edge Cases', () => {
        it('should handle empty child contents array', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" content={[]} wordCount={0} positionId={1}/>);
            // Assert - should render without errors
            expect(react_1.screen.getByText(/Parent-Chunk-01/)).toBeInTheDocument();
        });
        it('should handle QA chunk with empty strings', () => {
            // Arrange
            const emptyQA = { question: '', answer: '' };
            // Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.qa} content={emptyQA} wordCount={0} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText('Q')).toBeInTheDocument();
            expect(react_1.screen.getByText('A')).toBeInTheDocument();
        });
        it('should handle very long content', () => {
            // Arrange
            const longContent = 'A'.repeat(10000);
            // Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content={longContent} wordCount={10000} positionId={1}/>);
            // Assert
            expect(react_1.screen.getByText(longContent)).toBeInTheDocument();
        });
        it('should handle zero word count', () => {
            // Arrange & Act
            (0, react_1.render)(<chunk_card_1.default chunkType={datasets_1.ChunkingMode.text} content="" wordCount={0} positionId={1}/>);
            // Assert - formatNumber returns falsy for 0, so it shows 0
            expect(react_1.screen.getByText(/0\s+(?:\S.*)?characters/)).toBeInTheDocument();
        });
    });
});
// =============================================================================
// ChunkCardList Component Tests
// =============================================================================
describe('ChunkCardList', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for rendering with different chunk types
    describe('Rendering', () => {
        it('should render text chunks correctly', () => {
            // Arrange
            const chunks = createGeneralChunks();
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert
            expect(react_1.screen.getByText(chunks[0])).toBeInTheDocument();
            expect(react_1.screen.getByText(chunks[1])).toBeInTheDocument();
            expect(react_1.screen.getByText(chunks[2])).toBeInTheDocument();
        });
        it('should render parent-child chunks correctly', () => {
            // Arrange
            const chunks = createParentChildChunks();
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" chunkInfo={chunks}/>);
            // Assert - should render child contents from parent-child chunks
            expect(react_1.screen.getByText('Child content 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Child content 2')).toBeInTheDocument();
            expect(react_1.screen.getByText('Another child 1')).toBeInTheDocument();
        });
        it('should render QA chunks correctly', () => {
            // Arrange
            const chunks = createQAChunks();
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.qa} chunkInfo={chunks}/>);
            // Assert
            expect(react_1.screen.getByText('What is the answer to life?')).toBeInTheDocument();
            expect(react_1.screen.getByText('The answer is 42.')).toBeInTheDocument();
            expect(react_1.screen.getByText('How does this work?')).toBeInTheDocument();
            expect(react_1.screen.getByText('It works by processing data.')).toBeInTheDocument();
        });
    });
    // Tests for chunkList memoization
    describe('Memoization - chunkList', () => {
        it('should extract chunks from GeneralChunks for text mode', () => {
            // Arrange
            const chunks = ['Chunk 1', 'Chunk 2'];
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert
            expect(react_1.screen.getByText('Chunk 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Chunk 2')).toBeInTheDocument();
        });
        it('should extract parent_child_chunks from ParentChildChunks for parentChild mode', () => {
            // Arrange
            const chunks = createParentChildChunks({
                parent_child_chunks: [
                    createParentChildChunk({ child_contents: ['Specific child'] }),
                ],
            });
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" chunkInfo={chunks}/>);
            // Assert
            expect(react_1.screen.getByText('Specific child')).toBeInTheDocument();
        });
        it('should extract qa_chunks from QAChunks for qa mode', () => {
            // Arrange
            const chunks = {
                qa_chunks: [
                    { question: 'Specific Q', answer: 'Specific A' },
                ],
            };
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.qa} chunkInfo={chunks}/>);
            // Assert
            expect(react_1.screen.getByText('Specific Q')).toBeInTheDocument();
            expect(react_1.screen.getByText('Specific A')).toBeInTheDocument();
        });
        it('should update chunkList when chunkInfo changes', () => {
            // Arrange
            const initialChunks = createGeneralChunks(['Initial chunk']);
            const { rerender } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={initialChunks}/>);
            // Assert initial state
            expect(react_1.screen.getByText('Initial chunk')).toBeInTheDocument();
            // Act - update chunks
            const updatedChunks = createGeneralChunks(['Updated chunk']);
            rerender(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={updatedChunks}/>);
            // Assert updated state
            expect(react_1.screen.getByText('Updated chunk')).toBeInTheDocument();
            expect(react_1.screen.queryByText('Initial chunk')).not.toBeInTheDocument();
        });
    });
    // Tests for getWordCount function
    describe('Word Count Calculation', () => {
        it('should calculate word count for text chunks using string length', () => {
            // Arrange - "Hello" has 5 characters
            const chunks = createGeneralChunks(['Hello']);
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert - word count should be 5 (string length)
            expect(react_1.screen.getByText(/5\s+(?:\S.*)?characters/)).toBeInTheDocument();
        });
        it('should calculate word count for parent-child chunks using parent_content length', () => {
            // Arrange - parent_content length determines word count
            const chunks = createParentChildChunks({
                parent_child_chunks: [
                    createParentChildChunk({
                        parent_content: 'Parent', // 6 characters
                        child_contents: ['Child'],
                    }),
                ],
            });
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" chunkInfo={chunks}/>);
            // Assert - word count should be 6 (parent_content length)
            expect(react_1.screen.getByText(/6\s+(?:\S.*)?characters/)).toBeInTheDocument();
        });
        it('should calculate word count for QA chunks using question + answer length', () => {
            // Arrange - "Hi" (2) + "Bye" (3) = 5
            const chunks = {
                qa_chunks: [
                    { question: 'Hi', answer: 'Bye' },
                ],
            };
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.qa} chunkInfo={chunks}/>);
            // Assert - word count should be 5 (question.length + answer.length)
            expect(react_1.screen.getByText(/5\s+(?:\S.*)?characters/)).toBeInTheDocument();
        });
    });
    // Tests for position ID assignment
    describe('Position ID', () => {
        it('should assign 1-based position IDs to chunks', () => {
            // Arrange
            const chunks = createGeneralChunks(['First', 'Second', 'Third']);
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert - position IDs should be 1, 2, 3
            expect(react_1.screen.getByText(/Chunk-01/)).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-02/)).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-03/)).toBeInTheDocument();
        });
    });
    // Tests for className prop
    describe('Custom className', () => {
        it('should apply custom className to container', () => {
            // Arrange
            const chunks = createGeneralChunks(['Test']);
            // Act
            const { container } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks} className="custom-class"/>);
            // Assert
            expect(container.firstChild).toHaveClass('custom-class');
        });
        it('should merge custom className with default classes', () => {
            // Arrange
            const chunks = createGeneralChunks(['Test']);
            // Act
            const { container } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks} className="my-custom-class"/>);
            // Assert - should have both default and custom classes
            expect(container.firstChild).toHaveClass('flex');
            expect(container.firstChild).toHaveClass('w-full');
            expect(container.firstChild).toHaveClass('flex-col');
            expect(container.firstChild).toHaveClass('my-custom-class');
        });
        it('should render without className prop', () => {
            // Arrange
            const chunks = createGeneralChunks(['Test']);
            // Act
            const { container } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert - should have default classes
            expect(container.firstChild).toHaveClass('flex');
            expect(container.firstChild).toHaveClass('w-full');
        });
    });
    // Tests for parentMode prop
    describe('Parent Mode', () => {
        it('should pass parentMode to ChunkCard for parent-child type', () => {
            // Arrange
            const chunks = createParentChildChunks();
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" chunkInfo={chunks}/>);
            // Assert - paragraph mode shows Parent-Chunk label
            expect(react_1.screen.getAllByText(/Parent-Chunk/).length).toBeGreaterThan(0);
        });
        it('should handle full-doc parentMode', () => {
            // Arrange
            const chunks = createParentChildChunks();
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.parentChild} parentMode="full-doc" chunkInfo={chunks}/>);
            // Assert - full-doc mode hides chunk labels
            expect(react_1.screen.queryByText(/Parent-Chunk/)).not.toBeInTheDocument();
            expect(react_1.screen.queryByText(/Chunk-/)).not.toBeInTheDocument();
        });
        it('should not use parentMode for text type', () => {
            // Arrange
            const chunks = createGeneralChunks(['Text']);
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} parentMode="full-doc" // Should be ignored
             chunkInfo={chunks}/>);
            // Assert - should show Chunk label, not affected by parentMode
            expect(react_1.screen.getByText(/Chunk-01/)).toBeInTheDocument();
        });
    });
    // Tests for edge cases
    describe('Edge Cases', () => {
        it('should handle empty GeneralChunks array', () => {
            // Arrange
            const chunks = [];
            // Act
            const { container } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert - should render empty container
            expect(container.firstChild).toBeInTheDocument();
            expect(container.firstChild?.childNodes.length).toBe(0);
        });
        it('should handle empty ParentChildChunks', () => {
            // Arrange
            const chunks = {
                parent_child_chunks: [],
                parent_mode: 'paragraph',
            };
            // Act
            const { container } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" chunkInfo={chunks}/>);
            // Assert
            expect(container.firstChild).toBeInTheDocument();
            expect(container.firstChild?.childNodes.length).toBe(0);
        });
        it('should handle empty QAChunks', () => {
            // Arrange
            const chunks = {
                qa_chunks: [],
            };
            // Act
            const { container } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.qa} chunkInfo={chunks}/>);
            // Assert
            expect(container.firstChild).toBeInTheDocument();
            expect(container.firstChild?.childNodes.length).toBe(0);
        });
        it('should handle single item in chunks', () => {
            // Arrange
            const chunks = createGeneralChunks(['Single chunk']);
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert
            expect(react_1.screen.getByText('Single chunk')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-01/)).toBeInTheDocument();
        });
        it('should handle large number of chunks', () => {
            // Arrange
            const chunks = Array.from({ length: 100 }, (_, i) => `Chunk number ${i + 1}`);
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert
            expect(react_1.screen.getByText('Chunk number 1')).toBeInTheDocument();
            expect(react_1.screen.getByText('Chunk number 100')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-100/)).toBeInTheDocument();
        });
    });
    // Tests for key uniqueness
    describe('Key Generation', () => {
        it('should generate unique keys for chunks', () => {
            // Arrange - chunks with same content
            const chunks = createGeneralChunks(['Same content', 'Same content', 'Same content']);
            // Act
            const { container } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={chunks}/>);
            // Assert - all three should render (keys are based on chunkType-index)
            const chunkCards = container.querySelectorAll('.bg-components-panel-bg');
            expect(chunkCards.length).toBe(3);
        });
    });
});
// =============================================================================
// Integration Tests
// =============================================================================
describe('ChunkCardList Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Tests for complete workflow scenarios
    describe('Complete Workflows', () => {
        it('should render complete text chunking workflow', () => {
            // Arrange
            const textChunks = createGeneralChunks([
                'First paragraph of the document.',
                'Second paragraph with more information.',
                'Final paragraph concluding the content.',
            ]);
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={textChunks}/>);
            // Assert
            expect(react_1.screen.getByText('First paragraph of the document.')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-01/)).toBeInTheDocument();
            // "First paragraph of the document." = 32 characters
            expect(react_1.screen.getByText(/32\s+(?:\S.*)?characters/)).toBeInTheDocument();
            expect(react_1.screen.getByText('Second paragraph with more information.')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-02/)).toBeInTheDocument();
            expect(react_1.screen.getByText('Final paragraph concluding the content.')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-03/)).toBeInTheDocument();
        });
        it('should render complete parent-child chunking workflow', () => {
            // Arrange
            const parentChildChunks = createParentChildChunks({
                parent_child_chunks: [
                    {
                        parent_content: 'Main section about React components and their lifecycle.',
                        child_contents: [
                            'React components are building blocks.',
                            'Lifecycle methods control component behavior.',
                        ],
                        parent_mode: 'paragraph',
                    },
                ],
            });
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" chunkInfo={parentChildChunks}/>);
            // Assert
            expect(react_1.screen.getByText('React components are building blocks.')).toBeInTheDocument();
            expect(react_1.screen.getByText('Lifecycle methods control component behavior.')).toBeInTheDocument();
            expect(react_1.screen.getByText('C-1')).toBeInTheDocument();
            expect(react_1.screen.getByText('C-2')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Parent-Chunk-01/)).toBeInTheDocument();
        });
        it('should render complete QA chunking workflow', () => {
            // Arrange
            const qaChunks = createQAChunks({
                qa_chunks: [
                    {
                        question: 'What is Dify?',
                        answer: 'Dify is an open-source LLM application development platform.',
                    },
                    {
                        question: 'How do I get started?',
                        answer: 'You can start by installing the platform using Docker.',
                    },
                ],
            });
            // Act
            (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.qa} chunkInfo={qaChunks}/>);
            // Assert
            const qLabels = react_1.screen.getAllByText('Q');
            const aLabels = react_1.screen.getAllByText('A');
            expect(qLabels.length).toBe(2);
            expect(aLabels.length).toBe(2);
            expect(react_1.screen.getByText('What is Dify?')).toBeInTheDocument();
            expect(react_1.screen.getByText('Dify is an open-source LLM application development platform.')).toBeInTheDocument();
            expect(react_1.screen.getByText('How do I get started?')).toBeInTheDocument();
            expect(react_1.screen.getByText('You can start by installing the platform using Docker.')).toBeInTheDocument();
        });
    });
    // Tests for type switching scenarios
    describe('Type Switching', () => {
        it('should handle switching from text to QA type', () => {
            // Arrange
            const textChunks = createGeneralChunks(['Text content']);
            const qaChunks = createQAChunks();
            const { rerender } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={textChunks}/>);
            // Assert initial text state
            expect(react_1.screen.getByText('Text content')).toBeInTheDocument();
            // Act - switch to QA
            rerender(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.qa} chunkInfo={qaChunks}/>);
            // Assert QA state
            expect(react_1.screen.queryByText('Text content')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('What is the answer to life?')).toBeInTheDocument();
        });
        it('should handle switching from text to parent-child type', () => {
            // Arrange
            const textChunks = createGeneralChunks(['Simple text']);
            const parentChildChunks = createParentChildChunks();
            const { rerender } = (0, react_1.render)(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.text} chunkInfo={textChunks}/>);
            // Assert initial state
            expect(react_1.screen.getByText('Simple text')).toBeInTheDocument();
            expect(react_1.screen.getByText(/Chunk-01/)).toBeInTheDocument();
            // Act - switch to parent-child
            rerender(<index_1.ChunkCardList chunkType={datasets_1.ChunkingMode.parentChild} parentMode="paragraph" chunkInfo={parentChildChunks}/>);
            // Assert parent-child state
            expect(react_1.screen.queryByText('Simple text')).not.toBeInTheDocument();
            // Multiple Parent-Chunk elements exist, so use getAllByText
            expect(react_1.screen.getAllByText(/Parent-Chunk/).length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELGdEQUFnRDtBQUNoRCw2Q0FBb0M7QUFDcEMsbUNBQXVDO0FBQ3ZDLHlDQUErQjtBQUMvQixtQ0FBb0M7QUFFcEMsZ0ZBQWdGO0FBQ2hGLHNCQUFzQjtBQUN0QixnRkFBZ0Y7QUFFaEYsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLFlBQXNCLEVBQUUsRUFBaUIsRUFBRTtJQUN0RSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUN0QixPQUFPLFNBQVMsQ0FBQTtJQUNsQixPQUFPO1FBQ0wsMENBQTBDO1FBQzFDLGtEQUFrRDtRQUNsRCxrQ0FBa0M7S0FDbkMsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxZQUF1QyxFQUFFLEVBQW9CLEVBQUUsQ0FBQyxDQUFDO0lBQy9GLGNBQWMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDO0lBQ3RELGNBQWMsRUFBRSx3REFBd0Q7SUFDeEUsV0FBVyxFQUFFLFdBQVc7SUFDeEIsR0FBRyxTQUFTO0NBQ2IsQ0FBQyxDQUFBO0FBRUYsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLFlBQXdDLEVBQUUsRUFBcUIsRUFBRSxDQUFDLENBQUM7SUFDbEcsbUJBQW1CLEVBQUU7UUFDbkIsc0JBQXNCLEVBQUU7UUFDeEIsc0JBQXNCLENBQUM7WUFDckIsY0FBYyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUM7WUFDekUsY0FBYyxFQUFFLDhCQUE4QjtTQUMvQyxDQUFDO0tBQ0g7SUFDRCxXQUFXLEVBQUUsV0FBVztJQUN4QixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRixNQUFNLGFBQWEsR0FBRyxDQUFDLFlBQThCLEVBQUUsRUFBVyxFQUFFLENBQUMsQ0FBQztJ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QyxDQUFDLFVBQVUsQ0FBQyxFQUN0QixDQUNILENBQUE7WUFFRCx1QkFBdUI7WUFDdkIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzNELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUV4RCwrQkFBK0I7WUFDL0IsUUFBUSxDQUNOLENBQUMscUJBQWEsQ0FDWixTQUFTLENBQUMsQ0FBQyx1QkFBWSxDQUFDLFdBQVcsQ0FBQyxDQUNwQyxVQUFVLENBQUMsV0FBVyxDQUN0QixTQUFTLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUM3QixDQUNILENBQUE7WUFFRCw0QkFBNEI7WUFDNUIsTUFBTSxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNqRSw0REFBNEQ7WUFDNUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgR2VuZXJhbENodW5rcywgUGFyZW50Q2hpbGRDaHVuaywgUGFyZW50Q2hpbGRDaHVua3MsIFFBQ2h1bmssIFFBQ2h1bmtzIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB7IHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IENodW5raW5nTW9kZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IENodW5rQ2FyZCBmcm9tICcuL2NodW5rLWNhcmQnXG5pbXBvcnQgeyBDaHVua0NhcmRMaXN0IH0gZnJvbSAnLi9pbmRleCdcbmltcG9ydCBRQUl0ZW0gZnJvbSAnLi9xLWEtaXRlbSdcbmltcG9ydCB7IFFBSXRlbVR5cGUgfSBmcm9tICcuL3R5cGVzJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEZhY3Rvcmllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlR2VuZXJhbENodW5rcyA9IChvdmVycmlkZXM6IHN0cmluZ1tdID0gW10pOiBHZW5lcmFsQ2h1bmtzID0+IHtcbiAgaWYgKG92ZXJyaWRlcy5sZW5ndGggPiAwKVxuICAgIHJldHVybiBvdmVycmlkZXNcbiAgcmV0dXJuIFtcbiAgICAnVGhpcyBpcyB0aGUgZmlyc3QgY2h1bmsgb2YgdGV4dCBjb250ZW50LicsXG4gICAgJ1RoaXMgaXMgdGhlIHNlY29uZCBjaHVuayB3aXRoIGRpZmZlcmVudCBjb250ZW50LicsXG4gICAgJ1RoaXJkIGNodW5rIGhlcmUgd2l0aCBtb3JlIHRleHQuJyxcbiAgXVxufVxuXG5jb25zdCBjcmVhdGVQYXJlbnRDaGlsZENodW5rID0gKG92ZXJyaWRlczogUGFydGlhbDxQYXJlbnRDaGlsZENodW5rPiA9IHt9KTogUGFyZW50Q2hpbGRDaHVuayA9PiAoe1xuICBjaGlsZF9jb250ZW50czogWydDaGlsZCBjb250ZW50IDEnLCAnQ2hpbGQgY29udGVudCAyJ10sXG4gIHBhcmVudF9jb250ZW50OiAnVGhpcyBpcyB0aGUgcGFyZW50IGNvbnRlbnQgdGhhdCBjb250YWlucyB0aGUgY2hpbGRyZW4uJyxcbiAgcGFyZW50X21vZGU6ICdwYXJhZ3JhcGgnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVQYXJlbnRDaGlsZENodW5rcyA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGFyZW50Q2hpbGRDaHVua3M+ID0ge30pOiBQYXJlbnRDaGlsZENodW5rcyA9PiAoe1xuICBwYXJlbnRfY2hpbGRfY2h1bmtzOiBbXG4gICAgY3JlYXRlUGFyZW50Q2hpbGRDaHVuaygpLFxuICAgIGNyZWF0ZVBhcmVudENoaWxkQ2h1bmsoe1xuICAgICAgY2hpbGRfY29udGVudHM6IFsnQW5vdGhlciBjaGlsZCAxJywgJ0Fub3RoZXIgY2hpbGQgMicsICdBbm90aGVyIGNoaWxkIDMnXSxcbiAgICAgIHBhcmVudF9jb250ZW50OiAnQW5vdGhlciBwYXJlbnQgY29udGVudCBoZXJlLicsXG4gICAgfSksXG4gIF0sXG4gIHBhcmVudF9tb2RlOiAncGFyYWdyYXBoJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlUUFDaHVuayA9IChvdmVycmlkZXM6IFBhcnRpYWw8UUFDaHVuaz4gPSB7fSk6IFFBQ2h1bmsgPT4gKHtcbiAgcXVlc3Rpb246ICdXaGF0IGlzIHRoZSBhbnN3ZXIgdG8gbGlmZT8nLFxuICBhbnN3ZXI6ICdUaGUgYW5zd2VyIGlzIDQyLicsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZVFBQ2h1bmtzID0gKG92ZXJyaWRlczogUGFydGlhbDxRQUNodW5rcz4gPSB7fSk6IFFBQ2h1bmtzID0+ICh7XG4gIHFhX2NodW5rczogW1xuICAgIGNyZWF0ZVFBQ2h1bmsoKSxcbiAgICBjcmVhdGVRQUNodW5rKHtcbiAgICAgIHF1ZXN0aW9uOiAnSG93IGRvZXMgdGhpcyB3b3JrPycsXG4gICAgICBhbnN3ZXI6ICdJdCB3b3JrcyBieSBwcm9jZXNzaW5nIGRhdGEuJyxcbiAgICB9KSxcbiAgXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFFBSXRlbSBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdRQUl0ZW0nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBiYXNpYyByZW5kZXJpbmcgb2YgUUFJdGVtIGNvbXBvbmVudFxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHF1ZXN0aW9uIHR5cGUgd2l0aCBRIHByZWZpeCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UUFJdGVtIHR5cGU9e1FBSXRlbVR5cGUuUXVlc3Rpb259IHRleHQ9XCJXaGF0IGlzIHRoaXM/XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1doYXQgaXMgdGhpcz8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBhbnN3ZXIgdHlwZSB3aXRoIEEgcHJlZml4JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxRQUl0ZW0gdHlwZT17UUFJdGVtVHlwZS5BbnN3ZXJ9IHRleHQ9XCJUaGlzIGlzIHRoZSBhbnN3ZXIuXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RoaXMgaXMgdGhlIGFuc3dlci4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGRpZmZlcmVudCBwcm9wIHZhcmlhdGlvbnNcbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggZW1wdHkgdGV4dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UUFJdGVtIHR5cGU9e1FBSXRlbVR5cGUuUXVlc3Rpb259IHRleHQ9XCJcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggbG9uZyB0ZXh0IGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nVGV4dCA9ICdBJy5yZXBlYXQoMTAwMClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFFBSXRlbSB0eXBlPXtRQUl0ZW1UeXBlLkFuc3dlcn0gdGV4dD17bG9uZ1RleHR9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGxvbmdUZXh0KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB0ZXh0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc3BlY2lhbFRleHQgPSAnPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PiAmIFwicXVvdGVzXCIgXFwnYXBvc3Ryb3BoZVxcJydcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFFBSXRlbSB0eXBlPXtRQUl0ZW1UeXBlLlF1ZXN0aW9ufSB0ZXh0PXtzcGVjaWFsVGV4dH0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoc3BlY2lhbFRleHQpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgbWVtb2l6YXRpb24gYmVoYXZpb3JcbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxRQUl0ZW0gdHlwZT17UUFJdGVtVHlwZS5RdWVzdGlvbn0gdGV4dD1cIlRlc3RcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gY29tcG9uZW50IHNob3VsZCByZW5kZXIgY29uc2lzdGVudGx5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggc2FtZSBwcm9wcyAtIHNob3VsZCBub3QgY2F1c2UgaXNzdWVzXG4gICAgICByZXJlbmRlcig8UUFJdGVtIHR5cGU9e1FBSXRlbVR5cGUuUXVlc3Rpb259IHRleHQ9XCJUZXN0XCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDaHVua0NhcmQgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnQ2h1bmtDYXJkJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgYmFzaWMgcmVuZGVyaW5nIHdpdGggZGlmZmVyZW50IGNodW5rIHR5cGVzXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGV4dCBjaHVuayB0eXBlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY29udGVudD1cIlRoaXMgaXMgcGxhaW4gdGV4dCBjb250ZW50LlwiXG4gICAgICAgICAgd29yZENvdW50PXsyN31cbiAgICAgICAgICBwb3NpdGlvbklkPXsxfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGhpcyBpcyBwbGFpbiB0ZXh0IGNvbnRlbnQuJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9DaHVuay0wMS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFFBIGNodW5rIHR5cGUgd2l0aCBxdWVzdGlvbiBhbmQgYW5zd2VyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcWFDb250ZW50OiBRQUNodW5rID0ge1xuICAgICAgICBxdWVzdGlvbjogJ1doYXQgaXMgUmVhY3Q/JyxcbiAgICAgICAgYW5zd2VyOiAnUmVhY3QgaXMgYSBKYXZhU2NyaXB0IGxpYnJhcnkuJyxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5xYX1cbiAgICAgICAgICBjb250ZW50PXtxYUNvbnRlbnR9XG4gICAgICAgICAgd29yZENvdW50PXs0NX1cbiAgICAgICAgICBwb3NpdGlvbklkPXsyfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnV2hhdCBpcyBSZWFjdD8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1JlYWN0IGlzIGEgSmF2YVNjcmlwdCBsaWJyYXJ5LicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhcmVudC1jaGlsZCBjaHVuayB0eXBlIHdpdGggY2hpbGQgY29udGVudHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjaGlsZENvbnRlbnRzID0gWydDaGlsZCAxIGNvbnRlbnQnLCAnQ2hpbGQgMiBjb250ZW50J11cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwicGFyYWdyYXBoXCJcbiAgICAgICAgICBjb250ZW50PXtjaGlsZENvbnRlbnRzfVxuICAgICAgICAgIHdvcmRDb3VudD17NTB9XG4gICAgICAgICAgcG9zaXRpb25JZD17MX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NoaWxkIDEgY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ2hpbGQgMiBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0MtMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgcGFyZW50IG1vZGUgdmFyaWF0aW9uc1xuICBkZXNjcmliZSgnUGFyZW50IE1vZGUgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgUGFyZW50LUNodW5rIGxhYmVsIHByZWZpeCBmb3IgcGFyYWdyYXBoIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwicGFyYWdyYXBoXCJcbiAgICAgICAgICBjb250ZW50PXtbJ0NoaWxkIGNvbnRlbnQnXX1cbiAgICAgICAgICB3b3JkQ291bnQ9ezEzfVxuICAgICAgICAgIHBvc2l0aW9uSWQ9ezF9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9QYXJlbnQtQ2h1bmstMDEvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhpZGUgc2VnbWVudCBpbmRleCB0YWcgZm9yIGZ1bGwtZG9jIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwiZnVsbC1kb2NcIlxuICAgICAgICAgIGNvbnRlbnQ9e1snQ2hpbGQgY29udGVudCddfVxuICAgICAgICAgIHdvcmRDb3VudD17MTN9XG4gICAgICAgICAgcG9zaXRpb25JZD17MX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBub3Qgc2hvdyBDaHVuayBvciBQYXJlbnQtQ2h1bmsgbGFiZWxcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL0NodW5rLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9QYXJlbnQtQ2h1bmsvKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IENodW5rIGxhYmVsIHByZWZpeCBmb3IgdGV4dCBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkXG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjb250ZW50PVwiVGV4dCBjb250ZW50XCJcbiAgICAgICAgICB3b3JkQ291bnQ9ezEyfVxuICAgICAgICAgIHBvc2l0aW9uSWQ9ezV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9DaHVuay0wNS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3Igd29yZCBjb3VudCBkaXNwbGF5XG4gIGRlc2NyaWJlKCdXb3JkIENvdW50IERpc3BsYXknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGZvcm1hdHRlZCB3b3JkIGNvdW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkXG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjb250ZW50PVwiU29tZSBjb250ZW50XCJcbiAgICAgICAgICB3b3JkQ291bnQ9ezEyMzR9XG4gICAgICAgICAgcG9zaXRpb25JZD17MX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGZvcm1hdE51bWJlcigxMjM0KSByZXR1cm5zICcxLDIzNCdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC8xLDIzNC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSB3b3JkIGNvdW50IHdpdGggY2hhcmFjdGVyIHRyYW5zbGF0aW9uIGtleScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY29udGVudD1cIlNvbWUgY29udGVudFwiXG4gICAgICAgICAgd29yZENvdW50PXsxMDB9XG4gICAgICAgICAgcG9zaXRpb25JZD17MX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHRyYW5zbGF0aW9uIGtleSBpcyByZXR1cm5lZCBhcy1pcyBieSBtb2NrXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMTAwXFxzKyg/OlxcUy4qKT9jaGFyYWN0ZXJzLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgZGlzcGxheSB3b3JkIGNvdW50IGluZm8gZm9yIGZ1bGwtZG9jIG1vZGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwiZnVsbC1kb2NcIlxuICAgICAgICAgIGNvbnRlbnQ9e1snQ2hpbGQnXX1cbiAgICAgICAgICB3b3JkQ291bnQ9ezUwMH1cbiAgICAgICAgICBwb3NpdGlvbklkPXsxfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gdGhlIGhlYWRlciB3aXRoIHdvcmQgY291bnQgc2hvdWxkIGJlIGhpZGRlblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvNTAwLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgcG9zaXRpb24gSUQgdmFyaWF0aW9uc1xuICBkZXNjcmliZSgnUG9zaXRpb24gSUQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVtZXJpYyBwb3NpdGlvbiBJRCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY29udGVudD1cIkNvbnRlbnRcIlxuICAgICAgICAgIHdvcmRDb3VudD17N31cbiAgICAgICAgICBwb3NpdGlvbklkPXs0Mn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rLTQyLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RyaW5nIHBvc2l0aW9uIElEJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkXG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjb250ZW50PVwiQ29udGVudFwiXG4gICAgICAgICAgd29yZENvdW50PXs3fVxuICAgICAgICAgIHBvc2l0aW9uSWQ9XCI5OVwiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9DaHVuay05OS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFkIHNpbmdsZSBkaWdpdCBwb3NpdGlvbiBJRCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY29udGVudD1cIkNvbnRlbnRcIlxuICAgICAgICAgIHdvcmRDb3VudD17N31cbiAgICAgICAgICBwb3NpdGlvbklkPXszfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2h1bmstMDMvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIG1lbW9pemF0aW9uIGRlcGVuZGVuY2llc1xuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgaXNGdWxsRG9jIG1lbW8gd2hlbiBwYXJlbnRNb2RlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwicGFyYWdyYXBoXCJcbiAgICAgICAgICBjb250ZW50PXtbJ0NoaWxkJ119XG4gICAgICAgICAgd29yZENvdW50PXs1fVxuICAgICAgICAgIHBvc2l0aW9uSWQ9ezF9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBwYXJhZ3JhcGggbW9kZSBzaG93cyBsYWJlbFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL1BhcmVudC1DaHVuay8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEFjdCAtIGNoYW5nZSB0byBmdWxsLWRvY1xuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwiZnVsbC1kb2NcIlxuICAgICAgICAgIGNvbnRlbnQ9e1snQ2hpbGQnXX1cbiAgICAgICAgICB3b3JkQ291bnQ9ezV9XG4gICAgICAgICAgcG9zaXRpb25JZD17MX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGZ1bGwtZG9jIG1vZGUgaGlkZXMgbGFiZWxcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL1BhcmVudC1DaHVuay8pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjb250ZW50RWxlbWVudCBtZW1vIHdoZW4gY29udGVudCBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkXG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjb250ZW50PVwiSW5pdGlhbCBjb250ZW50XCJcbiAgICAgICAgICB3b3JkQ291bnQ9ezE1fVxuICAgICAgICAgIHBvc2l0aW9uSWQ9ezF9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdJbml0aWFsIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkXG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjb250ZW50PVwiVXBkYXRlZCBjb250ZW50XCJcbiAgICAgICAgICB3b3JkQ291bnQ9ezE1fVxuICAgICAgICAgIHBvc2l0aW9uSWQ9ezF9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdVcGRhdGVkIGNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnSW5pdGlhbCBjb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGNvbnRlbnRFbGVtZW50IG1lbW8gd2hlbiBjaHVua1R5cGUgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY29udGVudD1cIlRleHQgY29udGVudFwiXG4gICAgICAgICAgd29yZENvdW50PXsxMn1cbiAgICAgICAgICBwb3NpdGlvbklkPXsxfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGV4dCBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gY2hhbmdlIHRvIFFBIHR5cGVcbiAgICAgIGNvbnN0IHFhQ29udGVudDogUUFDaHVuayA9IHsgcXVlc3Rpb246ICdRPycsIGFuc3dlcjogJ0EuJyB9XG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnFhfVxuICAgICAgICAgIGNvbnRlbnQ9e3FhQ29udGVudH1cbiAgICAgICAgICB3b3JkQ291bnQ9ezR9XG4gICAgICAgICAgcG9zaXRpb25JZD17MX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1EnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1E/JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBlZGdlIGNhc2VzXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNoaWxkIGNvbnRlbnRzIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkXG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUucGFyZW50Q2hpbGR9XG4gICAgICAgICAgcGFyZW50TW9kZT1cInBhcmFncmFwaFwiXG4gICAgICAgICAgY29udGVudD17W119XG4gICAgICAgICAgd29yZENvdW50PXswfVxuICAgICAgICAgIHBvc2l0aW9uSWQ9ezF9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvUGFyZW50LUNodW5rLTAxLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgUUEgY2h1bmsgd2l0aCBlbXB0eSBzdHJpbmdzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZW1wdHlRQTogUUFDaHVuayA9IHsgcXVlc3Rpb246ICcnLCBhbnN3ZXI6ICcnIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5xYX1cbiAgICAgICAgICBjb250ZW50PXtlbXB0eVFBfVxuICAgICAgICAgIHdvcmRDb3VudD17MH1cbiAgICAgICAgICBwb3NpdGlvbklkPXsxfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBjb250ZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbG9uZ0NvbnRlbnQgPSAnQScucmVwZWF0KDEwMDAwKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY29udGVudD17bG9uZ0NvbnRlbnR9XG4gICAgICAgICAgd29yZENvdW50PXsxMDAwMH1cbiAgICAgICAgICBwb3NpdGlvbklkPXsxfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nQ29udGVudCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgemVybyB3b3JkIGNvdW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkXG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjb250ZW50PVwiXCJcbiAgICAgICAgICB3b3JkQ291bnQ9ezB9XG4gICAgICAgICAgcG9zaXRpb25JZD17MX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGZvcm1hdE51bWJlciByZXR1cm5zIGZhbHN5IGZvciAwLCBzbyBpdCBzaG93cyAwXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMFxccysoPzpcXFMuKik/Y2hhcmFjdGVycy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDaHVua0NhcmRMaXN0IENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ0NodW5rQ2FyZExpc3QnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciByZW5kZXJpbmcgd2l0aCBkaWZmZXJlbnQgY2h1bmsgdHlwZXNcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0ZXh0IGNodW5rcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjaHVua3MgPSBjcmVhdGVHZW5lcmFsQ2h1bmtzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoY2h1bmtzWzBdKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoY2h1bmtzWzFdKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoY2h1bmtzWzJdKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwYXJlbnQtY2hpbGQgY2h1bmtzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNodW5rcyA9IGNyZWF0ZVBhcmVudENoaWxkQ2h1bmtzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUucGFyZW50Q2hpbGR9XG4gICAgICAgICAgcGFyZW50TW9kZT1cInBhcmFncmFwaFwiXG4gICAgICAgICAgY2h1bmtJbmZvPXtjaHVua3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgcmVuZGVyIGNoaWxkIGNvbnRlbnRzIGZyb20gcGFyZW50LWNoaWxkIGNodW5rc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NoaWxkIGNvbnRlbnQgMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ2hpbGQgY29udGVudCAyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdBbm90aGVyIGNoaWxkIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBRQSBjaHVua3MgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2h1bmtzID0gY3JlYXRlUUFDaHVua3MoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5xYX1cbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1doYXQgaXMgdGhlIGFuc3dlciB0byBsaWZlPycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGhlIGFuc3dlciBpcyA0Mi4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0hvdyBkb2VzIHRoaXMgd29yaz8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0l0IHdvcmtzIGJ5IHByb2Nlc3NpbmcgZGF0YS4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGNodW5rTGlzdCBtZW1vaXphdGlvblxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gLSBjaHVua0xpc3QnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IGNodW5rcyBmcm9tIEdlbmVyYWxDaHVua3MgZm9yIHRleHQgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNodW5rczogR2VuZXJhbENodW5rcyA9IFsnQ2h1bmsgMScsICdDaHVuayAyJ11cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NodW5rIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NodW5rIDInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGV4dHJhY3QgcGFyZW50X2NoaWxkX2NodW5rcyBmcm9tIFBhcmVudENoaWxkQ2h1bmtzIGZvciBwYXJlbnRDaGlsZCBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2h1bmtzID0gY3JlYXRlUGFyZW50Q2hpbGRDaHVua3Moe1xuICAgICAgICBwYXJlbnRfY2hpbGRfY2h1bmtzOiBbXG4gICAgICAgICAgY3JlYXRlUGFyZW50Q2hpbGRDaHVuayh7IGNoaWxkX2NvbnRlbnRzOiBbJ1NwZWNpZmljIGNoaWxkJ10gfSksXG4gICAgICAgIF0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwicGFyYWdyYXBoXCJcbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NwZWNpZmljIGNoaWxkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IHFhX2NodW5rcyBmcm9tIFFBQ2h1bmtzIGZvciBxYSBtb2RlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2h1bmtzOiBRQUNodW5rcyA9IHtcbiAgICAgICAgcWFfY2h1bmtzOiBbXG4gICAgICAgICAgeyBxdWVzdGlvbjogJ1NwZWNpZmljIFEnLCBhbnN3ZXI6ICdTcGVjaWZpYyBBJyB9LFxuICAgICAgICBdLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5xYX1cbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NwZWNpZmljIFEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NwZWNpZmljIEEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjaHVua0xpc3Qgd2hlbiBjaHVua0luZm8gY2hhbmdlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluaXRpYWxDaHVua3MgPSBjcmVhdGVHZW5lcmFsQ2h1bmtzKFsnSW5pdGlhbCBjaHVuayddKVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjaHVua0luZm89e2luaXRpYWxDaHVua3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgaW5pdGlhbCBzdGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0luaXRpYWwgY2h1bmsnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSB1cGRhdGUgY2h1bmtzXG4gICAgICBjb25zdCB1cGRhdGVkQ2h1bmtzID0gY3JlYXRlR2VuZXJhbENodW5rcyhbJ1VwZGF0ZWQgY2h1bmsnXSlcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkTGlzdFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY2h1bmtJbmZvPXt1cGRhdGVkQ2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IHVwZGF0ZWQgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdVcGRhdGVkIGNodW5rJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0luaXRpYWwgY2h1bmsnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBnZXRXb3JkQ291bnQgZnVuY3Rpb25cbiAgZGVzY3JpYmUoJ1dvcmQgQ291bnQgQ2FsY3VsYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgd29yZCBjb3VudCBmb3IgdGV4dCBjaHVua3MgdXNpbmcgc3RyaW5nIGxlbmd0aCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBcIkhlbGxvXCIgaGFzIDUgY2hhcmFjdGVyc1xuICAgICAgY29uc3QgY2h1bmtzID0gY3JlYXRlR2VuZXJhbENodW5rcyhbJ0hlbGxvJ10pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkTGlzdFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY2h1bmtJbmZvPXtjaHVua3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSB3b3JkIGNvdW50IHNob3VsZCBiZSA1IChzdHJpbmcgbGVuZ3RoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzVcXHMrKD86XFxTLiopP2NoYXJhY3RlcnMvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGN1bGF0ZSB3b3JkIGNvdW50IGZvciBwYXJlbnQtY2hpbGQgY2h1bmtzIHVzaW5nIHBhcmVudF9jb250ZW50IGxlbmd0aCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBwYXJlbnRfY29udGVudCBsZW5ndGggZGV0ZXJtaW5lcyB3b3JkIGNvdW50XG4gICAgICBjb25zdCBjaHVua3MgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rcyh7XG4gICAgICAgIHBhcmVudF9jaGlsZF9jaHVua3M6IFtcbiAgICAgICAgICBjcmVhdGVQYXJlbnRDaGlsZENodW5rKHtcbiAgICAgICAgICAgIHBhcmVudF9jb250ZW50OiAnUGFyZW50JywgLy8gNiBjaGFyYWN0ZXJzXG4gICAgICAgICAgICBjaGlsZF9jb250ZW50czogWydDaGlsZCddLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUucGFyZW50Q2hpbGR9XG4gICAgICAgICAgcGFyZW50TW9kZT1cInBhcmFncmFwaFwiXG4gICAgICAgICAgY2h1bmtJbmZvPXtjaHVua3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSB3b3JkIGNvdW50IHNob3VsZCBiZSA2IChwYXJlbnRfY29udGVudCBsZW5ndGgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvNlxccysoPzpcXFMuKik/Y2hhcmFjdGVycy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsY3VsYXRlIHdvcmQgY291bnQgZm9yIFFBIGNodW5rcyB1c2luZyBxdWVzdGlvbiArIGFuc3dlciBsZW5ndGgnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gXCJIaVwiICgyKSArIFwiQnllXCIgKDMpID0gNVxuICAgICAgY29uc3QgY2h1bmtzOiBRQUNodW5rcyA9IHtcbiAgICAgICAgcWFfY2h1bmtzOiBbXG4gICAgICAgICAgeyBxdWVzdGlvbjogJ0hpJywgYW5zd2VyOiAnQnllJyB9LFxuICAgICAgICBdLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5xYX1cbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIHdvcmQgY291bnQgc2hvdWxkIGJlIDUgKHF1ZXN0aW9uLmxlbmd0aCArIGFuc3dlci5sZW5ndGgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvNVxccysoPzpcXFMuKik/Y2hhcmFjdGVycy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgcG9zaXRpb24gSUQgYXNzaWdubWVudFxuICBkZXNjcmliZSgnUG9zaXRpb24gSUQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhc3NpZ24gMS1iYXNlZCBwb3NpdGlvbiBJRHMgdG8gY2h1bmtzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2h1bmtzID0gY3JlYXRlR2VuZXJhbENodW5rcyhbJ0ZpcnN0JywgJ1NlY29uZCcsICdUaGlyZCddKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS50ZXh0fVxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gcG9zaXRpb24gSURzIHNob3VsZCBiZSAxLCAyLCAzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2h1bmstMDEvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rLTAyLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9DaHVuay0wMy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgY2xhc3NOYW1lIHByb3BcbiAgZGVzY3JpYmUoJ0N1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gY2xhc3NOYW1lIHRvIGNvbnRhaW5lcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNodW5rcyA9IGNyZWF0ZUdlbmVyYWxDaHVua3MoWydUZXN0J10pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS50ZXh0fVxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImN1c3RvbS1jbGFzc1wiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ2N1c3RvbS1jbGFzcycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgY3VzdG9tIGNsYXNzTmFtZSB3aXRoIGRlZmF1bHQgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNodW5rcyA9IGNyZWF0ZUdlbmVyYWxDaHVua3MoWydUZXN0J10pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS50ZXh0fVxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAgIGNsYXNzTmFtZT1cIm15LWN1c3RvbS1jbGFzc1wiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgaGF2ZSBib3RoIGRlZmF1bHQgYW5kIGN1c3RvbSBjbGFzc2VzXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdmbGV4JylcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ3ctZnVsbCcpXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdmbGV4LWNvbCcpXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdteS1jdXN0b20tY2xhc3MnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNsYXNzTmFtZSBwcm9wJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2h1bmtzID0gY3JlYXRlR2VuZXJhbENodW5rcyhbJ1Rlc3QnXSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkTGlzdFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnRleHR9XG4gICAgICAgICAgY2h1bmtJbmZvPXtjaHVua3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgaGF2ZSBkZWZhdWx0IGNsYXNzZXNcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ2ZsZXgnKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygndy1mdWxsJylcbiAgICB9KVxuICB9KVxuXG4gIC8vIFRlc3RzIGZvciBwYXJlbnRNb2RlIHByb3BcbiAgZGVzY3JpYmUoJ1BhcmVudCBNb2RlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBwYXJlbnRNb2RlIHRvIENodW5rQ2FyZCBmb3IgcGFyZW50LWNoaWxkIHR5cGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjaHVua3MgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkTGlzdFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnBhcmVudENoaWxkfVxuICAgICAgICAgIHBhcmVudE1vZGU9XCJwYXJhZ3JhcGhcIlxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gcGFyYWdyYXBoIG1vZGUgc2hvd3MgUGFyZW50LUNodW5rIGxhYmVsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgvUGFyZW50LUNodW5rLykubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZnVsbC1kb2MgcGFyZW50TW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNodW5rcyA9IGNyZWF0ZVBhcmVudENoaWxkQ2h1bmtzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUucGFyZW50Q2hpbGR9XG4gICAgICAgICAgcGFyZW50TW9kZT1cImZ1bGwtZG9jXCJcbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGZ1bGwtZG9jIG1vZGUgaGlkZXMgY2h1bmsgbGFiZWxzXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9QYXJlbnQtQ2h1bmsvKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL0NodW5rLS8pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB1c2UgcGFyZW50TW9kZSBmb3IgdGV4dCB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2h1bmtzID0gY3JlYXRlR2VuZXJhbENodW5rcyhbJ1RleHQnXSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwiZnVsbC1kb2NcIiAvLyBTaG91bGQgYmUgaWdub3JlZFxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHNob3cgQ2h1bmsgbGFiZWwsIG5vdCBhZmZlY3RlZCBieSBwYXJlbnRNb2RlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2h1bmstMDEvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIGVkZ2UgY2FzZXNcbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgR2VuZXJhbENodW5rcyBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNodW5rczogR2VuZXJhbENodW5rcyA9IFtdXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS50ZXh0fVxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHJlbmRlciBlbXB0eSBjb250YWluZXJcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkPy5jaGlsZE5vZGVzLmxlbmd0aCkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBQYXJlbnRDaGlsZENodW5rcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNodW5rczogUGFyZW50Q2hpbGRDaHVua3MgPSB7XG4gICAgICAgIHBhcmVudF9jaGlsZF9jaHVua3M6IFtdLFxuICAgICAgICBwYXJlbnRfbW9kZTogJ3BhcmFncmFwaCcsXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5wYXJlbnRDaGlsZH1cbiAgICAgICAgICBwYXJlbnRNb2RlPVwicGFyYWdyYXBoXCJcbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQ/LmNoaWxkTm9kZXMubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IFFBQ2h1bmtzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2h1bmtzOiBRQUNodW5rcyA9IHtcbiAgICAgICAgcWFfY2h1bmtzOiBbXSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8Q2h1bmtDYXJkTGlzdFxuICAgICAgICAgIGNodW5rVHlwZT17Q2h1bmtpbmdNb2RlLnFhfVxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZD8uY2hpbGROb2Rlcy5sZW5ndGgpLnRvQmUoMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2luZ2xlIGl0ZW0gaW4gY2h1bmtzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgY2h1bmtzID0gY3JlYXRlR2VuZXJhbENodW5rcyhbJ1NpbmdsZSBjaHVuayddKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS50ZXh0fVxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2luZ2xlIGNodW5rJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9DaHVuay0wMS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIG51bWJlciBvZiBjaHVua3MnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBjaHVua3MgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMDAgfSwgKF8sIGkpID0+IGBDaHVuayBudW1iZXIgJHtpICsgMX1gKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS50ZXh0fVxuICAgICAgICAgIGNodW5rSW5mbz17Y2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ2h1bmsgbnVtYmVyIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NodW5rIG51bWJlciAxMDAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rLTEwMC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBUZXN0cyBmb3Iga2V5IHVuaXF1ZW5lc3NcbiAgZGVzY3JpYmUoJ0tleSBHZW5lcmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZ2VuZXJhdGUgdW5pcXVlIGtleXMgZm9yIGNodW5rcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBjaHVua3Mgd2l0aCBzYW1lIGNvbnRlbnRcbiAgICAgIGNvbnN0IGNodW5rcyA9IGNyZWF0ZUdlbmVyYWxDaHVua3MoWydTYW1lIGNvbnRlbnQnLCAnU2FtZSBjb250ZW50JywgJ1NhbWUgY29udGVudCddKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjaHVua0luZm89e2NodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCAtIGFsbCB0aHJlZSBzaG91bGQgcmVuZGVyIChrZXlzIGFyZSBiYXNlZCBvbiBjaHVua1R5cGUtaW5kZXgpXG4gICAgICBjb25zdCBjaHVua0NhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5iZy1jb21wb25lbnRzLXBhbmVsLWJnJylcbiAgICAgIGV4cGVjdChjaHVua0NhcmRzLmxlbmd0aCkudG9CZSgzKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW50ZWdyYXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdDaHVua0NhcmRMaXN0IEludGVncmF0aW9uJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBUZXN0cyBmb3IgY29tcGxldGUgd29ya2Zsb3cgc2NlbmFyaW9zXG4gIGRlc2NyaWJlKCdDb21wbGV0ZSBXb3JrZmxvd3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29tcGxldGUgdGV4dCBjaHVua2luZyB3b3JrZmxvdycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHRleHRDaHVua3MgPSBjcmVhdGVHZW5lcmFsQ2h1bmtzKFtcbiAgICAgICAgJ0ZpcnN0IHBhcmFncmFwaCBvZiB0aGUgZG9jdW1lbnQuJyxcbiAgICAgICAgJ1NlY29uZCBwYXJhZ3JhcGggd2l0aCBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgICAgICdGaW5hbCBwYXJhZ3JhcGggY29uY2x1ZGluZyB0aGUgY29udGVudC4nLFxuICAgICAgXSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjaHVua0luZm89e3RleHRDaHVua3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdGaXJzdCBwYXJhZ3JhcGggb2YgdGhlIGRvY3VtZW50LicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2h1bmstMDEvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gXCJGaXJzdCBwYXJhZ3JhcGggb2YgdGhlIGRvY3VtZW50LlwiID0gMzIgY2hhcmFjdGVyc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzMyXFxzKyg/OlxcUy4qKT9jaGFyYWN0ZXJzLykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlY29uZCBwYXJhZ3JhcGggd2l0aCBtb3JlIGluZm9ybWF0aW9uLicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvQ2h1bmstMDIvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRmluYWwgcGFyYWdyYXBoIGNvbmNsdWRpbmcgdGhlIGNvbnRlbnQuJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9DaHVuay0wMy8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbXBsZXRlIHBhcmVudC1jaGlsZCBjaHVua2luZyB3b3JrZmxvdycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBhcmVudENoaWxkQ2h1bmtzID0gY3JlYXRlUGFyZW50Q2hpbGRDaHVua3Moe1xuICAgICAgICBwYXJlbnRfY2hpbGRfY2h1bmtzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGFyZW50X2NvbnRlbnQ6ICdNYWluIHNlY3Rpb24gYWJvdXQgUmVhY3QgY29tcG9uZW50cyBhbmQgdGhlaXIgbGlmZWN5Y2xlLicsXG4gICAgICAgICAgICBjaGlsZF9jb250ZW50czogW1xuICAgICAgICAgICAgICAnUmVhY3QgY29tcG9uZW50cyBhcmUgYnVpbGRpbmcgYmxvY2tzLicsXG4gICAgICAgICAgICAgICdMaWZlY3ljbGUgbWV0aG9kcyBjb250cm9sIGNvbXBvbmVudCBiZWhhdmlvci4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHBhcmVudF9tb2RlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUucGFyZW50Q2hpbGR9XG4gICAgICAgICAgcGFyZW50TW9kZT1cInBhcmFncmFwaFwiXG4gICAgICAgICAgY2h1bmtJbmZvPXtwYXJlbnRDaGlsZENodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1JlYWN0IGNvbXBvbmVudHMgYXJlIGJ1aWxkaW5nIGJsb2Nrcy4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0xpZmVjeWNsZSBtZXRob2RzIGNvbnRyb2wgY29tcG9uZW50IGJlaGF2aW9yLicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQy0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDLTInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL1BhcmVudC1DaHVuay0wMS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbXBsZXRlIFFBIGNodW5raW5nIHdvcmtmbG93JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcWFDaHVua3MgPSBjcmVhdGVRQUNodW5rcyh7XG4gICAgICAgIHFhX2NodW5rczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHF1ZXN0aW9uOiAnV2hhdCBpcyBEaWZ5PycsXG4gICAgICAgICAgICBhbnN3ZXI6ICdEaWZ5IGlzIGFuIG9wZW4tc291cmNlIExMTSBhcHBsaWNhdGlvbiBkZXZlbG9wbWVudCBwbGF0Zm9ybS4nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcXVlc3Rpb246ICdIb3cgZG8gSSBnZXQgc3RhcnRlZD8nLFxuICAgICAgICAgICAgYW5zd2VyOiAnWW91IGNhbiBzdGFydCBieSBpbnN0YWxsaW5nIHRoZSBwbGF0Zm9ybSB1c2luZyBEb2NrZXIuJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUucWF9XG4gICAgICAgICAgY2h1bmtJbmZvPXtxYUNodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcUxhYmVscyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJ1EnKVxuICAgICAgY29uc3QgYUxhYmVscyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJ0EnKVxuICAgICAgZXhwZWN0KHFMYWJlbHMubGVuZ3RoKS50b0JlKDIpXG4gICAgICBleHBlY3QoYUxhYmVscy5sZW5ndGgpLnRvQmUoMilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1doYXQgaXMgRGlmeT8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RpZnkgaXMgYW4gb3Blbi1zb3VyY2UgTExNIGFwcGxpY2F0aW9uIGRldmVsb3BtZW50IHBsYXRmb3JtLicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnSG93IGRvIEkgZ2V0IHN0YXJ0ZWQ/JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdZb3UgY2FuIHN0YXJ0IGJ5IGluc3RhbGxpbmcgdGhlIHBsYXRmb3JtIHVzaW5nIERvY2tlci4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVGVzdHMgZm9yIHR5cGUgc3dpdGNoaW5nIHNjZW5hcmlvc1xuICBkZXNjcmliZSgnVHlwZSBTd2l0Y2hpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3dpdGNoaW5nIGZyb20gdGV4dCB0byBRQSB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdGV4dENodW5rcyA9IGNyZWF0ZUdlbmVyYWxDaHVua3MoWydUZXh0IGNvbnRlbnQnXSlcbiAgICAgIGNvbnN0IHFhQ2h1bmtzID0gY3JlYXRlUUFDaHVua3MoKVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUudGV4dH1cbiAgICAgICAgICBjaHVua0luZm89e3RleHRDaHVua3N9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgaW5pdGlhbCB0ZXh0IHN0YXRlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGV4dCBjb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gc3dpdGNoIHRvIFFBXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS5xYX1cbiAgICAgICAgICBjaHVua0luZm89e3FhQ2h1bmtzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IFFBIHN0YXRlXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdUZXh0IGNvbnRlbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdXaGF0IGlzIHRoZSBhbnN3ZXIgdG8gbGlmZT8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzd2l0Y2hpbmcgZnJvbSB0ZXh0IHRvIHBhcmVudC1jaGlsZCB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgdGV4dENodW5rcyA9IGNyZWF0ZUdlbmVyYWxDaHVua3MoWydTaW1wbGUgdGV4dCddKVxuICAgICAgY29uc3QgcGFyZW50Q2hpbGRDaHVua3MgPSBjcmVhdGVQYXJlbnRDaGlsZENodW5rcygpXG5cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENodW5rQ2FyZExpc3RcbiAgICAgICAgICBjaHVua1R5cGU9e0NodW5raW5nTW9kZS50ZXh0fVxuICAgICAgICAgIGNodW5rSW5mbz17dGV4dENodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCBpbml0aWFsIHN0YXRlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2ltcGxlIHRleHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL0NodW5rLTAxLykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQWN0IC0gc3dpdGNoIHRvIHBhcmVudC1jaGlsZFxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxDaHVua0NhcmRMaXN0XG4gICAgICAgICAgY2h1bmtUeXBlPXtDaHVua2luZ01vZGUucGFyZW50Q2hpbGR9XG4gICAgICAgICAgcGFyZW50TW9kZT1cInBhcmFncmFwaFwiXG4gICAgICAgICAgY2h1bmtJbmZvPXtwYXJlbnRDaGlsZENodW5rc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIEFzc2VydCBwYXJlbnQtY2hpbGQgc3RhdGVcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ1NpbXBsZSB0ZXh0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBNdWx0aXBsZSBQYXJlbnQtQ2h1bmsgZWxlbWVudHMgZXhpc3QsIHNvIHVzZSBnZXRBbGxCeVRleHRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXh0KC9QYXJlbnQtQ2h1bmsvKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG4gIH0pXG59KVxuIl19