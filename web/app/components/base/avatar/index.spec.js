"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
describe('Avatar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering tests - verify component renders correctly in different states
    describe('Rendering', () => {
        it('should render img element with correct alt and src when avatar URL is provided', () => {
            const avatarUrl = 'https://example.com/avatar.jpg';
            const props = { name: 'John Doe', avatar: avatarUrl };
            (0, react_1.render)(<index_1.default {...props}/>);
            const img = react_1.screen.getByRole('img', { name: 'John Doe' });
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', avatarUrl);
        });
        it('should render fallback div with uppercase initial when avatar is null', () => {
            const props = { name: 'alice', avatar: null };
            (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.queryByRole('img')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('A')).toBeInTheDocument();
        });
    });
    // Props tests - verify all props are applied correctly
    describe('Props', () => {
        describe('size prop', () => {
            it.each([
                { size: undefined, expected: '30px', label: 'default (30px)' },
                { size: 50, expected: '50px', label: 'custom (50px)' },
            ])('should apply $label size to img element', ({ size, expected }) => {
                const props = { name: 'Test', avatar: 'https://example.com/avatar.jpg', size };
                (0, react_1.render)(<index_1.default {...props}/>);
                expect(react_1.screen.getByRole('img')).toHaveStyle({
                    width: expected,
                    height: expected,
                    fontSize: expected,
                    lineHeight: expected,
                });
            });
            it('should apply size to fallback div when avatar is null', () => {
                const props = { name: 'Test', avatar: null, size: 40 };
                (0, react_1.render)(<index_1.default {...props}/>);
                const textElement = react_1.screen.getByText('T');
                const outerDiv = textElement.parentElement;
                expect(outerDiv).toHaveStyle({ width: '40px', height: '40px' });
            });
        });
        describe('className prop', () => {
            it('should merge className with default avatar classes on img', () => {
                const props = {
                    name: 'Test',
                    avatar: 'https://example.com/avatar.jpg',
                    className: 'custom-class',
                };
                (0, react_1.render)(<index_1.default {...props}/>);
                const img = react_1.screen.getByRole('img');
                expect(img).toHaveClass('custom-class');
                expect(img).toHaveClass('shrink-0', 'flex', 'items-center', 'rounded-full', 'bg-primary-600');
            });
            it('should merge className with default avatar classes on fallback div', () => {
                const props = {
                    name: 'Test',
                    avatar: null,
                    className: 'my-custom-class',
                };
                (0, react_1.render)(<index_1.default {...props}/>);
                const textElement = react_1.screen.getByText('T');
                const outerDiv = textElement.parentElement;
                expect(outerDiv).toHaveClass('my-custom-class');
                expect(outerDiv).toHaveClass('shrink-0', 'flex', 'items-center', 'rounded-full', 'bg-primary-600');
            });
        });
        describe('textClassName prop', () => {
            it('should apply textClassName to the initial text element', () => {
                const props = {
                    name: 'Test',
                    avatar: null,
                    textClassName: 'custom-text-class',
                };
                (0, react_1.render)(<index_1.default {...props}/>);
                const textElement = react_1.screen.getByText('T');
                expect(textElement).toHaveClass('custom-text-class');
                expect(textElement).toHaveClass('scale-[0.4]', 'text-center', 'text-white');
            });
        });
    });
    // State Management tests - verify useState and useEffect behavior
    describe('State Management', () => {
        it('should switch to fallback when image fails to load', async () => {
            const props = { name: 'John', avatar: 'https://example.com/broken.jpg' };
            (0, react_1.render)(<index_1.default {...props}/>);
            const img = react_1.screen.getByRole('img');
            react_1.fireEvent.error(img);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByRole('img')).not.toBeInTheDocument();
            });
            expect(react_1.screen.getByText('J')).toBeInTheDocument();
        });
        it('should reset error state when avatar URL changes', async () => {
            const initialProps = { name: 'John', avatar: 'https://example.com/broken.jpg' };
            const { rerender } = (0, react_1.render)(<index_1.default {...initialProps}/>);
            const img = react_1.screen.getByRole('img');
            // First, trigger error
            react_1.fireEvent.error(img);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByRole('img')).not.toBeInTheDocument();
            });
            expect(react_1.screen.getByText('J')).toBeInTheDocument();
            rerender(<index_1.default name="John" avatar="https://example.com/new-avatar.jpg"/>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByRole('img')).toBeInTheDocument();
            });
            expect(react_1.screen.queryByText('J')).not.toBeInTheDocument();
        });
        it('should not reset error state if avatar becomes null', async () => {
            const initialProps = { name: 'John', avatar: 'https://example.com/broken.jpg' };
            const { rerender } = (0, react_1.render)(<index_1.default {...initialProps}/>);
            // Trigger error
            react_1.fireEvent.error(react_1.screen.getByRole('img'));
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('J')).toBeInTheDocument();
            });
            rerender(<index_1.default name="John" avatar={null}/>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByRole('img')).not.toBeInTheDocument();
            });
            expect(react_1.screen.getByText('J')).toBeInTheDocument();
        });
    });
    // Event Handlers tests - verify onError callback behavior
    describe('Event Handlers', () => {
        it('should call onError with true when image fails to load', () => {
            const onErrorMock = vi.fn();
            const props = {
                name: 'John',
                avatar: 'https://example.com/broken.jpg',
                onError: onErrorMock,
            };
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.error(react_1.screen.getByRole('img'));
            expect(onErrorMock).toHaveBeenCalledTimes(1);
            expect(onErrorMock).toHaveBeenCalledWith(true);
        });
        it('should call onError with false when image loads successfully', () => {
            const onErrorMock = vi.fn();
            const props = {
                name: 'John',
                avatar: 'https://example.com/avatar.jpg',
                onError: onErrorMock,
            };
            (0, react_1.render)(<index_1.default {...props}/>);
            react_1.fireEvent.load(react_1.screen.getByRole('img'));
            expect(onErrorMock).toHaveBeenCalledTimes(1);
            expect(onErrorMock).toHaveBeenCalledWith(false);
        });
        it('should not throw when onError is not provided', async () => {
            const props = { name: 'John', avatar: 'https://example.com/broken.jpg' };
            (0, react_1.render)(<index_1.default {...props}/>);
            expect(() => react_1.fireEvent.error(react_1.screen.getByRole('img'))).not.toThrow();
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText('J')).toBeInTheDocument();
            });
        });
    });
    // Edge Cases tests - verify handling of unusual inputs
    describe('Edge Cases', () => {
        it('should handle empty string name gracefully', () => {
            const props = { name: '', avatar: null };
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Note: Using querySelector here because empty name produces no visible text,
            // making semantic queries (getByRole, getByText) impossible
            const textElement = container.querySelector('.text-white');
            expect(textElement).toBeInTheDocument();
            expect(textElement.textContent).toBe('');
        });
        it.each([
            { name: '中文名', expected: '中', label: 'Chinese characters' },
            { name: '123User', expected: '1', label: 'number' },
        ])('should display first character when name starts with $label', ({ name, expected }) => {
            const props = { name, avatar: null };
            (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.getByText(expected)).toBeInTheDocument();
        });
        it('should handle empty string avatar as falsy value', () => {
            const props = { name: 'Test', avatar: '' };
            (0, react_1.render)(<index_1.default {...props}/>);
            expect(react_1.screen.queryByRole('img')).not.toBeInTheDocument();
            expect(react_1.screen.getByText('T')).toBeInTheDocument();
        });
        it('should handle undefined className and textClassName', () => {
            const props = { name: 'Test', avatar: null };
            (0, react_1.render)(<index_1.default {...props}/>);
            const textElement = react_1.screen.getByText('T');
            const outerDiv = textElement.parentElement;
            expect(outerDiv).toHaveClass('shrink-0', 'flex', 'items-center', 'rounded-full', 'bg-primary-600');
        });
        it.each([
            { size: 0, expected: '0px', label: 'zero' },
            { size: 1000, expected: '1000px', label: 'very large' },
        ])('should handle $label size value', ({ size, expected }) => {
            const props = { name: 'Test', avatar: null, size };
            (0, react_1.render)(<index_1.default {...props}/>);
            const textElement = react_1.screen.getByText('T');
            const outerDiv = textElement.parentElement;
            expect(outerDiv).toHaveStyle({ width: expected, height: expected });
        });
    });
    // Combined props tests - verify props work together correctly
    describe('Combined Props', () => {
        it('should apply all props correctly when used together', () => {
            const onErrorMock = vi.fn();
            const props = {
                name: 'Test User',
                avatar: 'https://example.com/avatar.jpg',
                size: 64,
                className: 'custom-avatar',
                onError: onErrorMock,
            };
            (0, react_1.render)(<index_1.default {...props}/>);
            const img = react_1.screen.getByRole('img');
            expect(img).toHaveAttribute('alt', 'Test User');
            expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
            expect(img).toHaveStyle({ width: '64px', height: '64px' });
            expect(img).toHaveClass('custom-avatar');
            // Trigger load to verify onError callback
            react_1.fireEvent.load(img);
            expect(onErrorMock).toHaveBeenCalledWith(false);
        });
        it('should apply all fallback props correctly when used together', () => {
            const props = {
                name: 'Fallback User',
                avatar: null,
                size: 48,
                className: 'fallback-custom',
                textClassName: 'custom-text-style',
            };
            (0, react_1.render)(<index_1.default {...props}/>);
            const textElement = react_1.screen.getByText('F');
            const outerDiv = textElement.parentElement;
            expect(outerDiv).toHaveClass('fallback-custom');
            expect(outerDiv).toHaveStyle({ width: '48px', height: '48px' });
            expect(textElement).toHaveClass('custom-text-style');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTJFO0FBQzNFLG1DQUE0QjtBQUU1QixRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsMkVBQTJFO0lBQzNFLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxnRkFBZ0YsRUFBRSxHQUFHLEVBQUU7WUFDeEYsTUFBTSxTQUFTLEdBQUcsZ0NBQWdDLENBQUE7WUFDbEQsTUFBTSxLQUFLLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQTtZQUVyRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUU3QixNQUFNLEdBQUcsR0FBRyxjQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1lBQ3pELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQy9CLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQy9DLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtZQUMvRSxNQUFNLEtBQUssR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFBO1lBRTdDLElBQUEsY0FBTSxFQUFDLENBQUMsZUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTdC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QUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7WUFDL0QsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBQ3RELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IEF2YXRhciBmcm9tICcuL2luZGV4J1xuXG5kZXNjcmliZSgnQXZhdGFyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBSZW5kZXJpbmcgdGVzdHMgLSB2ZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgY29ycmVjdGx5IGluIGRpZmZlcmVudCBzdGF0ZXNcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpbWcgZWxlbWVudCB3aXRoIGNvcnJlY3QgYWx0IGFuZCBzcmMgd2hlbiBhdmF0YXIgVVJMIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXZhdGFyVXJsID0gJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLmpwZydcbiAgICAgIGNvbnN0IHByb3BzID0geyBuYW1lOiAnSm9obiBEb2UnLCBhdmF0YXI6IGF2YXRhclVybCB9XG5cbiAgICAgIHJlbmRlcig8QXZhdGFyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGltZyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2ltZycsIHsgbmFtZTogJ0pvaG4gRG9lJyB9KVxuICAgICAgZXhwZWN0KGltZykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGltZykudG9IYXZlQXR0cmlidXRlKCdzcmMnLCBhdmF0YXJVcmwpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZhbGxiYWNrIGRpdiB3aXRoIHVwcGVyY2FzZSBpbml0aWFsIHdoZW4gYXZhdGFyIGlzIG51bGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IHsgbmFtZTogJ2FsaWNlJywgYXZhdGFyOiBudWxsIH1cblxuICAgICAgcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnaW1nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBQcm9wcyB0ZXN0cyAtIHZlcmlmeSBhbGwgcHJvcHMgYXJlIGFwcGxpZWQgY29ycmVjdGx5XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnc2l6ZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQuZWFjaChbXG4gICAgICAgIHsgc2l6ZTogdW5kZWZpbmVkLCBleHBlY3RlZDogJzMwcHgnLCBsYWJlbDogJ2RlZmF1bHQgKDMwcHgpJyB9LFxuICAgICAgICB7IHNpemU6IDUwLCBleHBlY3RlZDogJzUwcHgnLCBsYWJlbDogJ2N1c3RvbSAoNTBweCknIH0sXG4gICAgICBdKSgnc2hvdWxkIGFwcGx5ICRsYWJlbCBzaXplIHRvIGltZyBlbGVtZW50JywgKHsgc2l6ZSwgZXhwZWN0ZWQgfSkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IHsgbmFtZTogJ1Rlc3QnLCBhdmF0YXI6ICdodHRwczovL2V4YW1wbGUuY29tL2F2YXRhci5qcGcnLCBzaXplIH1cblxuICAgICAgICByZW5kZXIoPEF2YXRhciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdpbWcnKSkudG9IYXZlU3R5bGUoe1xuICAgICAgICAgIHdpZHRoOiBleHBlY3RlZCxcbiAgICAgICAgICBoZWlnaHQ6IGV4cGVjdGVkLFxuICAgICAgICAgIGZvbnRTaXplOiBleHBlY3RlZCxcbiAgICAgICAgICBsaW5lSGVpZ2h0OiBleHBlY3RlZCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgc2l6ZSB0byBmYWxsYmFjayBkaXYgd2hlbiBhdmF0YXIgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSB7IG5hbWU6ICdUZXN0JywgYXZhdGFyOiBudWxsLCBzaXplOiA0MCB9XG5cbiAgICAgICAgcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICBjb25zdCB0ZXh0RWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ1QnKVxuICAgICAgICBjb25zdCBvdXRlckRpdiA9IHRleHRFbGVtZW50LnBhcmVudEVsZW1lbnQgYXMgSFRNTEVsZW1lbnRcbiAgICAgICAgZXhwZWN0KG91dGVyRGl2KS50b0hhdmVTdHlsZSh7IHdpZHRoOiAnNDBweCcsIGhlaWdodDogJzQwcHgnIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnY2xhc3NOYW1lIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIG1lcmdlIGNsYXNzTmFtZSB3aXRoIGRlZmF1bHQgYXZhdGFyIGNsYXNzZXMgb24gaW1nJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgICAgYXZhdGFyOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIuanBnJyxcbiAgICAgICAgICBjbGFzc05hbWU6ICdjdXN0b20tY2xhc3MnLFxuICAgICAgICB9XG5cbiAgICAgICAgcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICBjb25zdCBpbWcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdpbWcnKVxuICAgICAgICBleHBlY3QoaW1nKS50b0hhdmVDbGFzcygnY3VzdG9tLWNsYXNzJylcbiAgICAgICAgZXhwZWN0KGltZykudG9IYXZlQ2xhc3MoJ3Nocmluay0wJywgJ2ZsZXgnLCAnaXRlbXMtY2VudGVyJywgJ3JvdW5kZWQtZnVsbCcsICdiZy1wcmltYXJ5LTYwMCcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG1lcmdlIGNsYXNzTmFtZSB3aXRoIGRlZmF1bHQgYXZhdGFyIGNsYXNzZXMgb24gZmFsbGJhY2sgZGl2JywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgICBuYW1lOiAnVGVzdCcsXG4gICAgICAgICAgYXZhdGFyOiBudWxsLFxuICAgICAgICAgIGNsYXNzTmFtZTogJ215LWN1c3RvbS1jbGFzcycsXG4gICAgICAgIH1cblxuICAgICAgICByZW5kZXIoPEF2YXRhciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIGNvbnN0IHRleHRFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgnVCcpXG4gICAgICAgIGNvbnN0IG91dGVyRGl2ID0gdGV4dEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudFxuICAgICAgICBleHBlY3Qob3V0ZXJEaXYpLnRvSGF2ZUNsYXNzKCdteS1jdXN0b20tY2xhc3MnKVxuICAgICAgICBleHBlY3Qob3V0ZXJEaXYpLnRvSGF2ZUNsYXNzKCdzaHJpbmstMCcsICdmbGV4JywgJ2l0ZW1zLWNlbnRlcicsICdyb3VuZGVkLWZ1bGwnLCAnYmctcHJpbWFyeS02MDAnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3RleHRDbGFzc05hbWUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYXBwbHkgdGV4dENsYXNzTmFtZSB0byB0aGUgaW5pdGlhbCB0ZXh0IGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgICAgICBhdmF0YXI6IG51bGwsXG4gICAgICAgICAgdGV4dENsYXNzTmFtZTogJ2N1c3RvbS10ZXh0LWNsYXNzJyxcbiAgICAgICAgfVxuXG4gICAgICAgIHJlbmRlcig8QXZhdGFyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgY29uc3QgdGV4dEVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUJylcbiAgICAgICAgZXhwZWN0KHRleHRFbGVtZW50KS50b0hhdmVDbGFzcygnY3VzdG9tLXRleHQtY2xhc3MnKVxuICAgICAgICBleHBlY3QodGV4dEVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdzY2FsZS1bMC40XScsICd0ZXh0LWNlbnRlcicsICd0ZXh0LXdoaXRlJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IHRlc3RzIC0gdmVyaWZ5IHVzZVN0YXRlIGFuZCB1c2VFZmZlY3QgYmVoYXZpb3JcbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzd2l0Y2ggdG8gZmFsbGJhY2sgd2hlbiBpbWFnZSBmYWlscyB0byBsb2FkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSB7IG5hbWU6ICdKb2huJywgYXZhdGFyOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9icm9rZW4uanBnJyB9XG4gICAgICByZW5kZXIoPEF2YXRhciB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW1nID0gc2NyZWVuLmdldEJ5Um9sZSgnaW1nJylcblxuICAgICAgZmlyZUV2ZW50LmVycm9yKGltZylcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2ltZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdKJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXNldCBlcnJvciBzdGF0ZSB3aGVuIGF2YXRhciBVUkwgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGluaXRpYWxQcm9wcyA9IHsgbmFtZTogJ0pvaG4nLCBhdmF0YXI6ICdodHRwczovL2V4YW1wbGUuY29tL2Jyb2tlbi5qcGcnIH1cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8QXZhdGFyIHsuLi5pbml0aWFsUHJvcHN9IC8+KVxuICAgICAgY29uc3QgaW1nID0gc2NyZWVuLmdldEJ5Um9sZSgnaW1nJylcblxuICAgICAgLy8gRmlyc3QsIHRyaWdnZXIgZXJyb3JcbiAgICAgIGZpcmVFdmVudC5lcnJvcihpbWcpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnaW1nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0onKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8QXZhdGFyIG5hbWU9XCJKb2huXCIgYXZhdGFyPVwiaHR0cHM6Ly9leGFtcGxlLmNvbS9uZXctYXZhdGFyLmpwZ1wiIC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2ltZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnSicpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZXNldCBlcnJvciBzdGF0ZSBpZiBhdmF0YXIgYmVjb21lcyBudWxsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgaW5pdGlhbFByb3BzID0geyBuYW1lOiAnSm9obicsIGF2YXRhcjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYnJva2VuLmpwZycgfVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxBdmF0YXIgey4uLmluaXRpYWxQcm9wc30gLz4pXG5cbiAgICAgIC8vIFRyaWdnZXIgZXJyb3JcbiAgICAgIGZpcmVFdmVudC5lcnJvcihzY3JlZW4uZ2V0QnlSb2xlKCdpbWcnKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnSicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICByZXJlbmRlcig8QXZhdGFyIG5hbWU9XCJKb2huXCIgYXZhdGFyPXtudWxsfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2ltZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdKJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vIEV2ZW50IEhhbmRsZXJzIHRlc3RzIC0gdmVyaWZ5IG9uRXJyb3IgY2FsbGJhY2sgYmVoYXZpb3JcbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkVycm9yIHdpdGggdHJ1ZSB3aGVuIGltYWdlIGZhaWxzIHRvIGxvYWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkVycm9yTW9jayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBuYW1lOiAnSm9obicsXG4gICAgICAgIGF2YXRhcjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYnJva2VuLmpwZycsXG4gICAgICAgIG9uRXJyb3I6IG9uRXJyb3JNb2NrLFxuICAgICAgfVxuICAgICAgcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmVycm9yKHNjcmVlbi5nZXRCeVJvbGUoJ2ltZycpKVxuXG4gICAgICBleHBlY3Qob25FcnJvck1vY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uRXJyb3JNb2NrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25FcnJvciB3aXRoIGZhbHNlIHdoZW4gaW1hZ2UgbG9hZHMgc3VjY2Vzc2Z1bGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25FcnJvck1vY2sgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgbmFtZTogJ0pvaG4nLFxuICAgICAgICBhdmF0YXI6ICdodHRwczovL2V4YW1wbGUuY29tL2F2YXRhci5qcGcnLFxuICAgICAgICBvbkVycm9yOiBvbkVycm9yTW9jayxcbiAgICAgIH1cbiAgICAgIHJlbmRlcig8QXZhdGFyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5sb2FkKHNjcmVlbi5nZXRCeVJvbGUoJ2ltZycpKVxuXG4gICAgICBleHBlY3Qob25FcnJvck1vY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uRXJyb3JNb2NrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdGhyb3cgd2hlbiBvbkVycm9yIGlzIG5vdCBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0geyBuYW1lOiAnSm9obicsIGF2YXRhcjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYnJva2VuLmpwZycgfVxuICAgICAgcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KCgpID0+IGZpcmVFdmVudC5lcnJvcihzY3JlZW4uZ2V0QnlSb2xlKCdpbWcnKSkpLm5vdC50b1Rocm93KClcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnSicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRWRnZSBDYXNlcyB0ZXN0cyAtIHZlcmlmeSBoYW5kbGluZyBvZiB1bnVzdWFsIGlucHV0c1xuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgbmFtZSBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSB7IG5hbWU6ICcnLCBhdmF0YXI6IG51bGwgfVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gTm90ZTogVXNpbmcgcXVlcnlTZWxlY3RvciBoZXJlIGJlY2F1c2UgZW1wdHkgbmFtZSBwcm9kdWNlcyBubyB2aXNpYmxlIHRleHQsXG4gICAgICAvLyBtYWtpbmcgc2VtYW50aWMgcXVlcmllcyAoZ2V0QnlSb2xlLCBnZXRCeVRleHQpIGltcG9zc2libGVcbiAgICAgIGNvbnN0IHRleHRFbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXdoaXRlJykgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdCh0ZXh0RWxlbWVudCkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHRleHRFbGVtZW50LnRleHRDb250ZW50KS50b0JlKCcnKVxuICAgIH0pXG5cbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgbmFtZTogJ+S4reaWh+WQjScsIGV4cGVjdGVkOiAn5LitJywgbGFiZWw6ICdDaGluZXNlIGNoYXJhY3RlcnMnIH0sXG4gICAgICB7IG5hbWU6ICcxMjNVc2VyJywgZXhwZWN0ZWQ6ICcxJywgbGFiZWw6ICdudW1iZXInIH0sXG4gICAgXSkoJ3Nob3VsZCBkaXNwbGF5IGZpcnN0IGNoYXJhY3RlciB3aGVuIG5hbWUgc3RhcnRzIHdpdGggJGxhYmVsJywgKHsgbmFtZSwgZXhwZWN0ZWQgfSkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSB7IG5hbWUsIGF2YXRhcjogbnVsbCB9XG5cbiAgICAgIHJlbmRlcig8QXZhdGFyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGV4cGVjdGVkKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgYXZhdGFyIGFzIGZhbHN5IHZhbHVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSB7IG5hbWU6ICdUZXN0JywgYXZhdGFyOiAnJyBhcyBzdHJpbmcgfCBudWxsIH1cblxuICAgICAgcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnaW1nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBjbGFzc05hbWUgYW5kIHRleHRDbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IHsgbmFtZTogJ1Rlc3QnLCBhdmF0YXI6IG51bGwgfVxuXG4gICAgICByZW5kZXIoPEF2YXRhciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCB0ZXh0RWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ1QnKVxuICAgICAgY29uc3Qgb3V0ZXJEaXYgPSB0ZXh0RWxlbWVudC5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qob3V0ZXJEaXYpLnRvSGF2ZUNsYXNzKCdzaHJpbmstMCcsICdmbGV4JywgJ2l0ZW1zLWNlbnRlcicsICdyb3VuZGVkLWZ1bGwnLCAnYmctcHJpbWFyeS02MDAnKVxuICAgIH0pXG5cbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgc2l6ZTogMCwgZXhwZWN0ZWQ6ICcwcHgnLCBsYWJlbDogJ3plcm8nIH0sXG4gICAgICB7IHNpemU6IDEwMDAsIGV4cGVjdGVkOiAnMTAwMHB4JywgbGFiZWw6ICd2ZXJ5IGxhcmdlJyB9LFxuICAgIF0pKCdzaG91bGQgaGFuZGxlICRsYWJlbCBzaXplIHZhbHVlJywgKHsgc2l6ZSwgZXhwZWN0ZWQgfSkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSB7IG5hbWU6ICdUZXN0JywgYXZhdGFyOiBudWxsLCBzaXplIH1cblxuICAgICAgcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgY29uc3QgdGV4dEVsZW1lbnQgPSBzY3JlZW4uZ2V0QnlUZXh0KCdUJylcbiAgICAgIGNvbnN0IG91dGVyRGl2ID0gdGV4dEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KG91dGVyRGl2KS50b0hhdmVTdHlsZSh7IHdpZHRoOiBleHBlY3RlZCwgaGVpZ2h0OiBleHBlY3RlZCB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gQ29tYmluZWQgcHJvcHMgdGVzdHMgLSB2ZXJpZnkgcHJvcHMgd29yayB0b2dldGhlciBjb3JyZWN0bHlcbiAgZGVzY3JpYmUoJ0NvbWJpbmVkIFByb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgYWxsIHByb3BzIGNvcnJlY3RseSB3aGVuIHVzZWQgdG9nZXRoZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkVycm9yTW9jayA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0ge1xuICAgICAgICBuYW1lOiAnVGVzdCBVc2VyJyxcbiAgICAgICAgYXZhdGFyOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIuanBnJyxcbiAgICAgICAgc2l6ZTogNjQsXG4gICAgICAgIGNsYXNzTmFtZTogJ2N1c3RvbS1hdmF0YXInLFxuICAgICAgICBvbkVycm9yOiBvbkVycm9yTW9jayxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxBdmF0YXIgey4uLnByb3BzfSAvPilcblxuICAgICAgY29uc3QgaW1nID0gc2NyZWVuLmdldEJ5Um9sZSgnaW1nJylcbiAgICAgIGV4cGVjdChpbWcpLnRvSGF2ZUF0dHJpYnV0ZSgnYWx0JywgJ1Rlc3QgVXNlcicpXG4gICAgICBleHBlY3QoaW1nKS50b0hhdmVBdHRyaWJ1dGUoJ3NyYycsICdodHRwczovL2V4YW1wbGUuY29tL2F2YXRhci5qcGcnKVxuICAgICAgZXhwZWN0KGltZykudG9IYXZlU3R5bGUoeyB3aWR0aDogJzY0cHgnLCBoZWlnaHQ6ICc2NHB4JyB9KVxuICAgICAgZXhwZWN0KGltZykudG9IYXZlQ2xhc3MoJ2N1c3RvbS1hdmF0YXInKVxuXG4gICAgICAvLyBUcmlnZ2VyIGxvYWQgdG8gdmVyaWZ5IG9uRXJyb3IgY2FsbGJhY2tcbiAgICAgIGZpcmVFdmVudC5sb2FkKGltZylcbiAgICAgIGV4cGVjdChvbkVycm9yTW9jaykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgYWxsIGZhbGxiYWNrIHByb3BzIGNvcnJlY3RseSB3aGVuIHVzZWQgdG9nZXRoZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgICAgbmFtZTogJ0ZhbGxiYWNrIFVzZXInLFxuICAgICAgICBhdmF0YXI6IG51bGwsXG4gICAgICAgIHNpemU6IDQ4LFxuICAgICAgICBjbGFzc05hbWU6ICdmYWxsYmFjay1jdXN0b20nLFxuICAgICAgICB0ZXh0Q2xhc3NOYW1lOiAnY3VzdG9tLXRleHQtc3R5bGUnLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEF2YXRhciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCB0ZXh0RWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ0YnKVxuICAgICAgY29uc3Qgb3V0ZXJEaXYgPSB0ZXh0RWxlbWVudC5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50XG4gICAgICBleHBlY3Qob3V0ZXJEaXYpLnRvSGF2ZUNsYXNzKCdmYWxsYmFjay1jdXN0b20nKVxuICAgICAgZXhwZWN0KG91dGVyRGl2KS50b0hhdmVTdHlsZSh7IHdpZHRoOiAnNDhweCcsIGhlaWdodDogJzQ4cHgnIH0pXG4gICAgICBleHBlY3QodGV4dEVsZW1lbnQpLnRvSGF2ZUNsYXNzKCdjdXN0b20tdGV4dC1zdHlsZScpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=