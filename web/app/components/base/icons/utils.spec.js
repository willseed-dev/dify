"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const utils_1 = require("./utils");
describe('generate icon base utils', () => {
    describe('normalizeAttrs', () => {
        it('should normalize class to className', () => {
            const attrs = { class: 'test-class' };
            const result = (0, utils_1.normalizeAttrs)(attrs);
            expect(result).toEqual({ className: 'test-class' });
        });
        it('should normalize style string to style object', () => {
            const attrs = { style: 'color:red;font-size:14px;' };
            const result = (0, utils_1.normalizeAttrs)(attrs);
            expect(result).toEqual({ style: { color: 'red', fontSize: '14px' } });
        });
        it('should handle attributes with dashes and colons', () => {
            const attrs = { 'data-test': 'value', 'xlink:href': 'url' };
            const result = (0, utils_1.normalizeAttrs)(attrs);
            expect(result).toEqual({ dataTest: 'value', xlinkHref: 'url' });
        });
    });
    describe('generate', () => {
        it('should generate React elements from AbstractNode', () => {
            const node = {
                name: 'div',
                attributes: { class: 'container' },
                children: [
                    {
                        name: 'span',
                        attributes: { style: 'color:blue;' },
                        children: [],
                    },
                ],
            };
            const { container } = (0, react_1.render)((0, utils_1.generate)(node, 'key'));
            // to svg element
            expect(container.firstChild).toHaveClass('container');
            expect(container.querySelector('span')).toHaveStyle({ color: 'rgb(0, 0, 255)' });
        });
        // add not has children
        it('should generate React elements without children', () => {
            const node = {
                name: 'div',
                attributes: { class: 'container' },
            };
            const { container } = (0, react_1.render)((0, utils_1.generate)(node, 'key'));
            // to svg element
            expect(container.firstChild).toHaveClass('container');
        });
        it('should merge rootProps when provided', () => {
            const node = {
                name: 'div',
                attributes: { class: 'container' },
                children: [],
            };
            const rootProps = { id: 'root' };
            const { container } = (0, react_1.render)((0, utils_1.generate)(node, 'key', rootProps));
            expect(container.querySelector('div')).toHaveAttribute('id', 'root');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrREFBK0M7QUFDL0MsbUNBQWtEO0FBRWxELFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7SUFDeEMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUM5QixFQUFFLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1lBQzdDLE1BQU0sS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFBO1lBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUEsc0JBQWMsRUFBQyxLQUFLLENBQUMsQ0FBQTtZQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUE7UUFDckQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELE1BQU0sS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFFLDJCQUEyQixFQUFFLENBQUE7WUFDcEQsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBYyxFQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDdkUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELE1BQU0sS0FBSyxHQUFHLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLENBQUE7WUFDM0QsTUFBTSxNQUFNLEdBQUcsSUFBQSxzQkFBYyxFQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQ2pFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtRQUN4QixFQUFFLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1lBQzFELE1BQU0sSUFBSSxHQUFpQjtnQkFDekIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtnQkFDbEMsUUFBUSxFQUFFO29CQUNSO3dCQUNFLElBQUksRUFBRSxNQUFNO3dCQUNaLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUU7d0JBQ3BDLFFBQVEsRUFBRSxFQUFFO3FCQUNiO2lCQUNGO2FBQ0YsQ0FBQTtZQUVELE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxJQUFBLGdCQUFRLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7WUFDbkQsaUJBQWlCO1lBQ2pCLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ3JELE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQTtRQUNsRixDQUFDLENBQUMsQ0FBQTtRQUVGLHVCQUF1QjtRQUN2QixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELE1BQU0sSUFBSSxHQUFpQjtnQkFDekIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTthQUNuQyxDQUFBO1lBQ0QsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUEsZ0JBQVEsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQTtZQUNuRCxpQkFBaUI7WUFDakIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDdkQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLE1BQU0sSUFBSSxHQUFpQjtnQkFDekIsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtnQkFDbEMsUUFBUSxFQUFFLEVBQUU7YUFDYixDQUFBO1lBRUQsTUFBTSxTQUFTLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUE7WUFDaEMsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLElBQUEsZ0JBQVEsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7WUFDOUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO1FBQ3RFLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQWJzdHJhY3ROb2RlIH0gZnJvbSAnLi91dGlscydcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBnZW5lcmF0ZSwgbm9ybWFsaXplQXR0cnMgfSBmcm9tICcuL3V0aWxzJ1xuXG5kZXNjcmliZSgnZ2VuZXJhdGUgaWNvbiBiYXNlIHV0aWxzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnbm9ybWFsaXplQXR0cnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3JtYWxpemUgY2xhc3MgdG8gY2xhc3NOYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXR0cnMgPSB7IGNsYXNzOiAndGVzdC1jbGFzcycgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gbm9ybWFsaXplQXR0cnMoYXR0cnMpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHsgY2xhc3NOYW1lOiAndGVzdC1jbGFzcycgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3JtYWxpemUgc3R5bGUgc3RyaW5nIHRvIHN0eWxlIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGF0dHJzID0geyBzdHlsZTogJ2NvbG9yOnJlZDtmb250LXNpemU6MTRweDsnIH1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IG5vcm1hbGl6ZUF0dHJzKGF0dHJzKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7IHN0eWxlOiB7IGNvbG9yOiAncmVkJywgZm9udFNpemU6ICcxNHB4JyB9IH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGF0dHJpYnV0ZXMgd2l0aCBkYXNoZXMgYW5kIGNvbG9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGF0dHJzID0geyAnZGF0YS10ZXN0JzogJ3ZhbHVlJywgJ3hsaW5rOmhyZWYnOiAndXJsJyB9XG4gICAgICBjb25zdCByZXN1bHQgPSBub3JtYWxpemVBdHRycyhhdHRycylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoeyBkYXRhVGVzdDogJ3ZhbHVlJywgeGxpbmtIcmVmOiAndXJsJyB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2dlbmVyYXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZ2VuZXJhdGUgUmVhY3QgZWxlbWVudHMgZnJvbSBBYnN0cmFjdE5vZGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlOiBBYnN0cmFjdE5vZGUgPSB7XG4gICAgICAgIG5hbWU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAnY29udGFpbmVyJyB9LFxuICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdzcGFuJyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHsgc3R5bGU6ICdjb2xvcjpibHVlOycgfSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKGdlbmVyYXRlKG5vZGUsICdrZXknKSlcbiAgICAgIC8vIHRvIHN2ZyBlbGVtZW50XG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdjb250YWluZXInKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzcGFuJykpLnRvSGF2ZVN0eWxlKHsgY29sb3I6ICdyZ2IoMCwgMCwgMjU1KScgfSlcbiAgICB9KVxuXG4gICAgLy8gYWRkIG5vdCBoYXMgY2hpbGRyZW5cbiAgICBpdCgnc2hvdWxkIGdlbmVyYXRlIFJlYWN0IGVsZW1lbnRzIHdpdGhvdXQgY2hpbGRyZW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCBub2RlOiBBYnN0cmFjdE5vZGUgPSB7XG4gICAgICAgIG5hbWU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7IGNsYXNzOiAnY29udGFpbmVyJyB9LFxuICAgICAgfVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihnZW5lcmF0ZShub2RlLCAna2V5JykpXG4gICAgICAvLyB0byBzdmcgZWxlbWVudFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0hhdmVDbGFzcygnY29udGFpbmVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtZXJnZSByb290UHJvcHMgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG5vZGU6IEFic3RyYWN0Tm9kZSA9IHtcbiAgICAgICAgbmFtZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHsgY2xhc3M6ICdjb250YWluZXInIH0sXG4gICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgIH1cblxuICAgICAgY29uc3Qgcm9vdFByb3BzID0geyBpZDogJ3Jvb3QnIH1cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoZ2VuZXJhdGUobm9kZSwgJ2tleScsIHJvb3RQcm9wcykpXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2RpdicpKS50b0hhdmVBdHRyaWJ1dGUoJ2lkJywgJ3Jvb3QnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19