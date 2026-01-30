"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview ErrorBoundary component for React.
 * This component was extracted from the main markdown renderer.
 * It catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the crashed component tree.
 * Primarily used around complex rendering logic like ECharts or SVG within Markdown.
 */
const React = require("react");
const react_1 = require("react");
// **Add an ECharts runtime error handler
// Avoid error #7832 (Crash when ECharts accesses undefined objects)
// This can happen when a component attempts to access an undefined object that references an unregistered map, causing the program to crash.
class ErrorBoundary extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true });
        console.error(error, errorInfo);
    }
    render() {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        if (this.state.hasError) {
            return (<div>
          Oops! An error occurred. This could be due to an ECharts runtime error or invalid SVG content.
          <br />
          (see the browser console for more information)
        </div>);
        }
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        return this.props.children;
    }
}
exports.default = ErrorBoundary;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItYm91bmRhcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlcnJvci1ib3VuZGFyeS50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQkFBOEI7QUFDOUIsaUNBQWlDO0FBQ2pDLHlDQUF5QztBQUN6QyxvRUFBb0U7QUFDcEUsNklBQTZJO0FBRTdJLE1BQXFCLGFBQWMsU0FBUSxpQkFBUztJQUNsRCxZQUFZLEtBQVU7UUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsS0FBVSxFQUFFLFNBQWM7UUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ2pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFBO0lBQ2pDLENBQUM7SUFFRCxNQUFNO1FBQ0osNkNBQTZDO1FBQzdDLG1CQUFtQjtRQUNuQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDeEIsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUNGOztVQUNBLENBQUMsRUFBRSxDQUFDLEFBQUQsRUFDSDs7UUFDRixFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7UUFDSCxDQUFDO1FBQ0QsNkNBQTZDO1FBQzdDLG1CQUFtQjtRQUNuQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFBO0lBQzVCLENBQUM7Q0FDRjtBQTNCRCxnQ0EyQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgRXJyb3JCb3VuZGFyeSBjb21wb25lbnQgZm9yIFJlYWN0LlxuICogVGhpcyBjb21wb25lbnQgd2FzIGV4dHJhY3RlZCBmcm9tIHRoZSBtYWluIG1hcmtkb3duIHJlbmRlcmVyLlxuICogSXQgY2F0Y2hlcyBKYXZhU2NyaXB0IGVycm9ycyBhbnl3aGVyZSBpbiBpdHMgY2hpbGQgY29tcG9uZW50IHRyZWUsXG4gKiBsb2dzIHRob3NlIGVycm9ycywgYW5kIGRpc3BsYXlzIGEgZmFsbGJhY2sgVUkgaW5zdGVhZCBvZiB0aGUgY3Jhc2hlZCBjb21wb25lbnQgdHJlZS5cbiAqIFByaW1hcmlseSB1c2VkIGFyb3VuZCBjb21wbGV4IHJlbmRlcmluZyBsb2dpYyBsaWtlIEVDaGFydHMgb3IgU1ZHIHdpdGhpbiBNYXJrZG93bi5cbiAqL1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbi8vICoqQWRkIGFuIEVDaGFydHMgcnVudGltZSBlcnJvciBoYW5kbGVyXG4vLyBBdm9pZCBlcnJvciAjNzgzMiAoQ3Jhc2ggd2hlbiBFQ2hhcnRzIGFjY2Vzc2VzIHVuZGVmaW5lZCBvYmplY3RzKVxuLy8gVGhpcyBjYW4gaGFwcGVuIHdoZW4gYSBjb21wb25lbnQgYXR0ZW1wdHMgdG8gYWNjZXNzIGFuIHVuZGVmaW5lZCBvYmplY3QgdGhhdCByZWZlcmVuY2VzIGFuIHVucmVnaXN0ZXJlZCBtYXAsIGNhdXNpbmcgdGhlIHByb2dyYW0gdG8gY3Jhc2guXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVycm9yQm91bmRhcnkgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wczogYW55KSB7XG4gICAgc3VwZXIocHJvcHMpXG4gICAgdGhpcy5zdGF0ZSA9IHsgaGFzRXJyb3I6IGZhbHNlIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZENhdGNoKGVycm9yOiBhbnksIGVycm9ySW5mbzogYW55KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGhhc0Vycm9yOiB0cnVlIH0pXG4gICAgY29uc29sZS5lcnJvcihlcnJvciwgZXJyb3JJbmZvKVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB0cy9iYW4tdHMtY29tbWVudFxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNFcnJvcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICBPb3BzISBBbiBlcnJvciBvY2N1cnJlZC4gVGhpcyBjb3VsZCBiZSBkdWUgdG8gYW4gRUNoYXJ0cyBydW50aW1lIGVycm9yIG9yIGludmFsaWQgU1ZHIGNvbnRlbnQuXG4gICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgKHNlZSB0aGUgYnJvd3NlciBjb25zb2xlIGZvciBtb3JlIGluZm9ybWF0aW9uKVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHRzL2Jhbi10cy1jb21tZW50XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgIHJldHVybiB0aGlzLnByb3BzLmNoaWxkcmVuXG4gIH1cbn1cbiJdfQ==