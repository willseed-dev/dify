"use strict";
/**
 * XSS Prevention Test Suite
 *
 * This test verifies that the XSS vulnerabilities in block-input and support-var-input
 * components have been properly fixed by replacing dangerouslySetInnerHTML with safe React rendering.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const block_input_1 = require("../app/components/base/block-input");
const support_var_input_1 = require("../app/components/workflow/nodes/_base/components/support-var-input");
// Mock styles
vi.mock('../app/components/app/configuration/base/var-highlight/style.module.css', () => ({
    default: {
        item: 'mock-item-class',
    },
}));
describe('XSS Prevention - Block Input and Support Var Input Security', () => {
    afterEach(() => {
        (0, react_1.cleanup)();
    });
    describe('BlockInput Component Security', () => {
        it('should safely render malicious variable names without executing scripts', () => {
            const testInput = 'user@test.com{{<script>alert("XSS")</script>}}';
            const { container } = (0, react_1.render)(<block_input_1.default value={testInput} readonly={true}/>);
            const scriptElements = container.querySelectorAll('script');
            expect(scriptElements).toHaveLength(0);
            const textContent = container.textContent;
            expect(textContent).toContain('<script>');
        });
        it('should preserve legitimate variable highlighting', () => {
            const legitimateInput = 'Hello {{userName}} welcome to {{appName}}';
            const { container } = (0, react_1.render)(<block_input_1.default value={legitimateInput} readonly={true}/>);
            const textContent = container.textContent;
            expect(textContent).toContain('userName');
            expect(textContent).toContain('appName');
        });
    });
    describe('SupportVarInput Component Security', () => {
        it('should safely render malicious variable names without executing scripts', () => {
            const testInput = 'test@evil.com{{<img src=x onerror=alert(1)>}}';
            const { container } = (0, react_1.render)(<support_var_input_1.default value={testInput} readonly={true}/>);
            const scriptElements = container.querySelectorAll('script');
            const imgElements = container.querySelectorAll('img');
            expect(scriptElements).toHaveLength(0);
            expect(imgElements).toHaveLength(0);
            const textContent = container.textContent;
            expect(textContent).toContain('<img');
        });
    });
    describe('React Automatic Escaping Verification', () => {
        it('should confirm React automatic escaping works correctly', () => {
            const TestComponent = () => <span>{'<script>alert("xss")</script>'}</span>;
            const { container } = (0, react_1.render)(<TestComponent />);
            const spanElement = container.querySelector('span');
            const scriptElements = container.querySelectorAll('script');
            expect(spanElement?.textContent).toBe('<script>alert("xss")</script>');
            expect(scriptElements).toHaveLength(0);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHNzLXByZXZlbnRpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInhzcy1wcmV2ZW50aW9uLnRlc3QudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRzs7QUFFSCxrREFBd0Q7QUFDeEQsK0JBQThCO0FBQzlCLG9FQUEyRDtBQUMzRCwyR0FBaUc7QUFFakcsY0FBYztBQUNkLEVBQUUsQ0FBQyxJQUFJLENBQUMseUVBQXlFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4RixPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsaUJBQWlCO0tBQ3hCO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCxRQUFRLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO0lBQzNFLFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDYixJQUFBLGVBQU8sR0FBRSxDQUFBO0lBQ1gsQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQzdDLEVBQUUsQ0FBQyx5RUFBeUUsRUFBRSxHQUFHLEVBQUU7WUFDakYsTUFBTSxTQUFTLEdBQUcsZ0RBQWdELENBQUE7WUFDbEUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMscUJBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFOUUsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzNELE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFFdEMsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQTtZQUN6QyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzNDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxNQUFNLGVBQWUsR0FBRywyQ0FBMkMsQ0FBQTtZQUNuRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxxQkFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVwRixNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFBO1lBQ3pDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDekMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUMxQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUNsRCxFQUFFLENBQUMseUVBQXlFLEVBQUUsR0FBRyxFQUFFO1lBQ2pGLE1BQU0sU0FBUyxHQUFHLCtDQUErQyxDQUFBO1lBQ2pFLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLDJCQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRW5GLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUMzRCxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUE7WUFFckQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN0QyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBRW5DLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUE7WUFDekMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtRQUNyRCxFQUFFLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1lBQ2pFLE1BQU0sYUFBYSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsK0JBQStCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUMxRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxhQUFhLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUUvQyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ25ELE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUUzRCxNQUFNLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1lBQ3RFLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDeEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBYU1MgUHJldmVudGlvbiBUZXN0IFN1aXRlXG4gKlxuICogVGhpcyB0ZXN0IHZlcmlmaWVzIHRoYXQgdGhlIFhTUyB2dWxuZXJhYmlsaXRpZXMgaW4gYmxvY2staW5wdXQgYW5kIHN1cHBvcnQtdmFyLWlucHV0XG4gKiBjb21wb25lbnRzIGhhdmUgYmVlbiBwcm9wZXJseSBmaXhlZCBieSByZXBsYWNpbmcgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwgd2l0aCBzYWZlIFJlYWN0IHJlbmRlcmluZy5cbiAqL1xuXG5pbXBvcnQgeyBjbGVhbnVwLCByZW5kZXIgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQmxvY2tJbnB1dCBmcm9tICcuLi9hcHAvY29tcG9uZW50cy9iYXNlL2Jsb2NrLWlucHV0J1xuaW1wb3J0IFN1cHBvcnRWYXJJbnB1dCBmcm9tICcuLi9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL3N1cHBvcnQtdmFyLWlucHV0J1xuXG4vLyBNb2NrIHN0eWxlc1xudmkubW9jaygnLi4vYXBwL2NvbXBvbmVudHMvYXBwL2NvbmZpZ3VyYXRpb24vYmFzZS92YXItaGlnaGxpZ2h0L3N0eWxlLm1vZHVsZS5jc3MnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgaXRlbTogJ21vY2staXRlbS1jbGFzcycsXG4gIH0sXG59KSlcblxuZGVzY3JpYmUoJ1hTUyBQcmV2ZW50aW9uIC0gQmxvY2sgSW5wdXQgYW5kIFN1cHBvcnQgVmFyIElucHV0IFNlY3VyaXR5JywgKCkgPT4ge1xuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGNsZWFudXAoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdCbG9ja0lucHV0IENvbXBvbmVudCBTZWN1cml0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNhZmVseSByZW5kZXIgbWFsaWNpb3VzIHZhcmlhYmxlIG5hbWVzIHdpdGhvdXQgZXhlY3V0aW5nIHNjcmlwdHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ZXN0SW5wdXQgPSAndXNlckB0ZXN0LmNvbXt7PHNjcmlwdD5hbGVydChcIlhTU1wiKTwvc2NyaXB0Pn19J1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8QmxvY2tJbnB1dCB2YWx1ZT17dGVzdElucHV0fSByZWFkb25seT17dHJ1ZX0gLz4pXG5cbiAgICAgIGNvbnN0IHNjcmlwdEVsZW1lbnRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdCcpXG4gICAgICBleHBlY3Qoc2NyaXB0RWxlbWVudHMpLnRvSGF2ZUxlbmd0aCgwKVxuXG4gICAgICBjb25zdCB0ZXh0Q29udGVudCA9IGNvbnRhaW5lci50ZXh0Q29udGVudFxuICAgICAgZXhwZWN0KHRleHRDb250ZW50KS50b0NvbnRhaW4oJzxzY3JpcHQ+JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBsZWdpdGltYXRlIHZhcmlhYmxlIGhpZ2hsaWdodGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGxlZ2l0aW1hdGVJbnB1dCA9ICdIZWxsbyB7e3VzZXJOYW1lfX0gd2VsY29tZSB0byB7e2FwcE5hbWV9fSdcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEJsb2NrSW5wdXQgdmFsdWU9e2xlZ2l0aW1hdGVJbnB1dH0gcmVhZG9ubHk9e3RydWV9IC8+KVxuXG4gICAgICBjb25zdCB0ZXh0Q29udGVudCA9IGNvbnRhaW5lci50ZXh0Q29udGVudFxuICAgICAgZXhwZWN0KHRleHRDb250ZW50KS50b0NvbnRhaW4oJ3VzZXJOYW1lJylcbiAgICAgIGV4cGVjdCh0ZXh0Q29udGVudCkudG9Db250YWluKCdhcHBOYW1lJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdTdXBwb3J0VmFySW5wdXQgQ29tcG9uZW50IFNlY3VyaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2FmZWx5IHJlbmRlciBtYWxpY2lvdXMgdmFyaWFibGUgbmFtZXMgd2l0aG91dCBleGVjdXRpbmcgc2NyaXB0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHRlc3RJbnB1dCA9ICd0ZXN0QGV2aWwuY29te3s8aW1nIHNyYz14IG9uZXJyb3I9YWxlcnQoMSk+fX0nXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTdXBwb3J0VmFySW5wdXQgdmFsdWU9e3Rlc3RJbnB1dH0gcmVhZG9ubHk9e3RydWV9IC8+KVxuXG4gICAgICBjb25zdCBzY3JpcHRFbGVtZW50cyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQnKVxuICAgICAgY29uc3QgaW1nRWxlbWVudHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnaW1nJylcblxuICAgICAgZXhwZWN0KHNjcmlwdEVsZW1lbnRzKS50b0hhdmVMZW5ndGgoMClcbiAgICAgIGV4cGVjdChpbWdFbGVtZW50cykudG9IYXZlTGVuZ3RoKDApXG5cbiAgICAgIGNvbnN0IHRleHRDb250ZW50ID0gY29udGFpbmVyLnRleHRDb250ZW50XG4gICAgICBleHBlY3QodGV4dENvbnRlbnQpLnRvQ29udGFpbignPGltZycpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVhY3QgQXV0b21hdGljIEVzY2FwaW5nIFZlcmlmaWNhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbmZpcm0gUmVhY3QgYXV0b21hdGljIGVzY2FwaW5nIHdvcmtzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IFRlc3RDb21wb25lbnQgPSAoKSA9PiA8c3Bhbj57JzxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nfTwvc3Bhbj5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFRlc3RDb21wb25lbnQgLz4pXG5cbiAgICAgIGNvbnN0IHNwYW5FbGVtZW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4nKVxuICAgICAgY29uc3Qgc2NyaXB0RWxlbWVudHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0JylcblxuICAgICAgZXhwZWN0KHNwYW5FbGVtZW50Py50ZXh0Q29udGVudCkudG9CZSgnPHNjcmlwdD5hbGVydChcInhzc1wiKTwvc2NyaXB0PicpXG4gICAgICBleHBlY3Qoc2NyaXB0RWxlbWVudHMpLnRvSGF2ZUxlbmd0aCgwKVxuICAgIH0pXG4gIH0pXG59KVxuXG5leHBvcnQge31cbiJdfQ==