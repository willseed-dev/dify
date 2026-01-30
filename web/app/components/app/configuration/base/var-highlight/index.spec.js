"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const index_1 = require("./index");
describe('VarHighlight', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    // Rendering highlighted variable tags
    describe('Rendering', () => {
        it('should render braces around the variable name with default styles', () => {
            // Arrange
            const props = { name: 'userInput' };
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('userInput')).toBeInTheDocument();
            expect(react_1.screen.getAllByText('{{')[0]).toBeInTheDocument();
            expect(react_1.screen.getAllByText('}}')[0]).toBeInTheDocument();
            // CSS modules add a hash to class names, so we check that the class attribute contains 'item'
            const firstChild = container.firstChild;
            expect(firstChild.className).toContain('item');
        });
        it('should apply custom class names when provided', () => {
            // Arrange
            const props = { name: 'custom', className: 'mt-2' };
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(container.firstChild).toHaveClass('mt-2');
        });
    });
    // Escaping HTML via helper
    describe('varHighlightHTML', () => {
        it('should escape dangerous characters before returning HTML string', () => {
            // Arrange
            const props = { name: '<script>alert(\'xss\')</script>' };
            // Act
            const html = (0, index_1.varHighlightHTML)(props);
            // Assert
            expect(html).toContain('&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;');
            expect(html).not.toContain('<script>');
        });
        it('should include custom class names in the wrapper element', () => {
            // Arrange
            const props = { name: 'data', className: 'text-primary' };
            // Act
            const html = (0, index_1.varHighlightHTML)(props);
            // Assert
            // CSS modules add a hash to class names, so the class attribute may contain _item_xxx
            expect(html).toContain('text-primary');
            expect(html).toContain('item');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXVEO0FBQ3ZELG1DQUF3RDtBQUV4RCxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0lBRUYsc0NBQXNDO0lBQ3RDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7WUFDM0UsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFBO1lBRW5DLE1BQU07WUFDTixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFZLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFekQsU0FBUztZQUNULE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN6RCxNQUFNLENBQUMsY0FBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDeEQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3hELDhGQUE4RjtZQUM5RixNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBeUIsQ0FBQTtZQUN0RCxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNoRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7WUFDdkQsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLENBQUE7WUFFbkQsTUFBTTtZQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQVksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUV6RCxTQUFTO1lBQ1QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDJCQUEyQjtJQUMzQixRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLEVBQUUsQ0FBQyxpRUFBaUUsRUFBRSxHQUFHLEVBQUU7WUFDekUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLGlDQUFpQyxFQUFFLENBQUE7WUFFekQsTUFBTTtZQUNOLE1BQU0sSUFBSSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUE7WUFFcEMsU0FBUztZQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsbURBQW1ELENBQUMsQ0FBQTtZQUMzRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUN4QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7WUFDbEUsVUFBVTtZQUNWLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLENBQUE7WUFFekQsTUFBTTtZQUNOLE1BQU0sSUFBSSxHQUFHLElBQUEsd0JBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUE7WUFFcEMsU0FBUztZQUNULHNGQUFzRjtZQUN0RixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDaEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IFZhckhpZ2hsaWdodCwgeyB2YXJIaWdobGlnaHRIVE1MIH0gZnJvbSAnLi9pbmRleCdcblxuZGVzY3JpYmUoJ1ZhckhpZ2hsaWdodCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gUmVuZGVyaW5nIGhpZ2hsaWdodGVkIHZhcmlhYmxlIHRhZ3NcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBicmFjZXMgYXJvdW5kIHRoZSB2YXJpYWJsZSBuYW1lIHdpdGggZGVmYXVsdCBzdHlsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgbmFtZTogJ3VzZXJJbnB1dCcgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFZhckhpZ2hsaWdodCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd1c2VySW5wdXQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRBbGxCeVRleHQoJ3t7JylbMF0pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXh0KCd9fScpWzBdKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBDU1MgbW9kdWxlcyBhZGQgYSBoYXNoIHRvIGNsYXNzIG5hbWVzLCBzbyB3ZSBjaGVjayB0aGF0IHRoZSBjbGFzcyBhdHRyaWJ1dGUgY29udGFpbnMgJ2l0ZW0nXG4gICAgICBjb25zdCBmaXJzdENoaWxkID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChmaXJzdENoaWxkLmNsYXNzTmFtZSkudG9Db250YWluKCdpdGVtJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gY2xhc3MgbmFtZXMgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyBuYW1lOiAnY3VzdG9tJywgY2xhc3NOYW1lOiAnbXQtMicgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFZhckhpZ2hsaWdodCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9IYXZlQ2xhc3MoJ210LTInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gRXNjYXBpbmcgSFRNTCB2aWEgaGVscGVyXG4gIGRlc2NyaWJlKCd2YXJIaWdobGlnaHRIVE1MJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZXNjYXBlIGRhbmdlcm91cyBjaGFyYWN0ZXJzIGJlZm9yZSByZXR1cm5pbmcgSFRNTCBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IHsgbmFtZTogJzxzY3JpcHQ+YWxlcnQoXFwneHNzXFwnKTwvc2NyaXB0PicgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IGh0bWwgPSB2YXJIaWdobGlnaHRIVE1MKHByb3BzKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChodG1sKS50b0NvbnRhaW4oJyZsdDtzY3JpcHQmZ3Q7YWxlcnQoJiMzOTt4c3MmIzM5OykmbHQ7L3NjcmlwdCZndDsnKVxuICAgICAgZXhwZWN0KGh0bWwpLm5vdC50b0NvbnRhaW4oJzxzY3JpcHQ+JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpbmNsdWRlIGN1c3RvbSBjbGFzcyBuYW1lcyBpbiB0aGUgd3JhcHBlciBlbGVtZW50JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSB7IG5hbWU6ICdkYXRhJywgY2xhc3NOYW1lOiAndGV4dC1wcmltYXJ5JyB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgaHRtbCA9IHZhckhpZ2hsaWdodEhUTUwocHJvcHMpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgLy8gQ1NTIG1vZHVsZXMgYWRkIGEgaGFzaCB0byBjbGFzcyBuYW1lcywgc28gdGhlIGNsYXNzIGF0dHJpYnV0ZSBtYXkgY29udGFpbiBfaXRlbV94eHhcbiAgICAgIGV4cGVjdChodG1sKS50b0NvbnRhaW4oJ3RleHQtcHJpbWFyeScpXG4gICAgICBleHBlY3QoaHRtbCkudG9Db250YWluKCdpdGVtJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==