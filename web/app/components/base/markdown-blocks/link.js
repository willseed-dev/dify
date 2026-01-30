"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview Link component for rendering <a> tags in Markdown.
 * Extracted from the main markdown renderer for modularity.
 * Handles special rendering for "abbr:" type links for interactive chat actions.
 */
const React = require("react");
const context_1 = require("@/app/components/base/chat/chat/context");
const utils_1 = require("./utils");
const Link = ({ node, children, ...props }) => {
    const { onSend } = (0, context_1.useChatContext)();
    const commonClassName = 'cursor-pointer underline !decoration-primary-700 decoration-dashed';
    if (node.properties?.href && node.properties.href?.toString().startsWith('abbr')) {
        const hidden_text = decodeURIComponent(node.properties.href.toString().split('abbr:')[1]);
        return <abbr className={commonClassName} onClick={() => onSend?.(hidden_text)} title={node.children[0]?.value || ''}>{node.children[0]?.value || ''}</abbr>;
    }
    else {
        const href = props.href || node.properties?.href;
        if (href && /^#[\w-]+$/.test(href.toString())) {
            const handleClick = (e) => {
                e.preventDefault();
                // scroll to target element if exists within the answer container
                const answerContainer = e.currentTarget.closest('.chat-answer-container');
                if (answerContainer) {
                    const targetId = CSS.escape(href.toString().substring(1));
                    const targetElement = answerContainer.querySelector(`[id="${targetId}"]`);
                    if (targetElement)
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            };
            return <a href={href} onClick={handleClick} className={commonClassName}>{children || 'ScrollView'}</a>;
        }
        if (!href || !(0, utils_1.isValidUrl)(href))
            return <span>{children}</span>;
        return <a href={href} target="_blank" rel="noopener noreferrer" className={commonClassName}>{children || 'Download'}</a>;
    }
};
exports.default = Link;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpbmsudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7R0FJRztBQUNILCtCQUE4QjtBQUM5QixxRUFBd0U7QUFDeEUsbUNBQW9DO0FBRXBDLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxFQUFPLEVBQUUsRUFBRTtJQUNqRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSx3QkFBYyxHQUFFLENBQUE7SUFDbkMsTUFBTSxlQUFlLEdBQUcsb0VBQW9FLENBQUE7SUFDNUYsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNqRixNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUV6RixPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUM3SixDQUFDO1NBQ0ksQ0FBQztRQUNKLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUE7UUFDaEQsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzlDLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBc0MsRUFBRSxFQUFFO2dCQUM3RCxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7Z0JBQ2xCLGlFQUFpRTtnQkFDakUsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtnQkFFekUsSUFBSSxlQUFlLEVBQUUsQ0FBQztvQkFDcEIsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQ3pELE1BQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxRQUFRLElBQUksQ0FBQyxDQUFBO29CQUN6RSxJQUFJLGFBQWE7d0JBQ2YsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO2dCQUN4RCxDQUFDO1lBQ0gsQ0FBQyxDQUFBO1lBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN4RyxDQUFDO1FBRUQsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUEsa0JBQVUsRUFBQyxJQUFJLENBQUM7WUFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1FBRWhDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDMUgsQ0FBQztBQUNILENBQUMsQ0FBQTtBQUVELGtCQUFlLElBQUksQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVvdmVydmlldyBMaW5rIGNvbXBvbmVudCBmb3IgcmVuZGVyaW5nIDxhPiB0YWdzIGluIE1hcmtkb3duLlxuICogRXh0cmFjdGVkIGZyb20gdGhlIG1haW4gbWFya2Rvd24gcmVuZGVyZXIgZm9yIG1vZHVsYXJpdHkuXG4gKiBIYW5kbGVzIHNwZWNpYWwgcmVuZGVyaW5nIGZvciBcImFiYnI6XCIgdHlwZSBsaW5rcyBmb3IgaW50ZXJhY3RpdmUgY2hhdCBhY3Rpb25zLlxuICovXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZUNoYXRDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2NoYXQvY2hhdC9jb250ZXh0J1xuaW1wb3J0IHsgaXNWYWxpZFVybCB9IGZyb20gJy4vdXRpbHMnXG5cbmNvbnN0IExpbmsgPSAoeyBub2RlLCBjaGlsZHJlbiwgLi4ucHJvcHMgfTogYW55KSA9PiB7XG4gIGNvbnN0IHsgb25TZW5kIH0gPSB1c2VDaGF0Q29udGV4dCgpXG4gIGNvbnN0IGNvbW1vbkNsYXNzTmFtZSA9ICdjdXJzb3ItcG9pbnRlciB1bmRlcmxpbmUgIWRlY29yYXRpb24tcHJpbWFyeS03MDAgZGVjb3JhdGlvbi1kYXNoZWQnXG4gIGlmIChub2RlLnByb3BlcnRpZXM/LmhyZWYgJiYgbm9kZS5wcm9wZXJ0aWVzLmhyZWY/LnRvU3RyaW5nKCkuc3RhcnRzV2l0aCgnYWJicicpKSB7XG4gICAgY29uc3QgaGlkZGVuX3RleHQgPSBkZWNvZGVVUklDb21wb25lbnQobm9kZS5wcm9wZXJ0aWVzLmhyZWYudG9TdHJpbmcoKS5zcGxpdCgnYWJicjonKVsxXSlcblxuICAgIHJldHVybiA8YWJiciBjbGFzc05hbWU9e2NvbW1vbkNsYXNzTmFtZX0gb25DbGljaz17KCkgPT4gb25TZW5kPy4oaGlkZGVuX3RleHQpfSB0aXRsZT17bm9kZS5jaGlsZHJlblswXT8udmFsdWUgfHwgJyd9Pntub2RlLmNoaWxkcmVuWzBdPy52YWx1ZSB8fCAnJ308L2FiYnI+XG4gIH1cbiAgZWxzZSB7XG4gICAgY29uc3QgaHJlZiA9IHByb3BzLmhyZWYgfHwgbm9kZS5wcm9wZXJ0aWVzPy5ocmVmXG4gICAgaWYgKGhyZWYgJiYgL14jW1xcdy1dKyQvLnRlc3QoaHJlZi50b1N0cmluZygpKSkge1xuICAgICAgY29uc3QgaGFuZGxlQ2xpY2sgPSAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MQW5jaG9yRWxlbWVudD4pID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIC8vIHNjcm9sbCB0byB0YXJnZXQgZWxlbWVudCBpZiBleGlzdHMgd2l0aGluIHRoZSBhbnN3ZXIgY29udGFpbmVyXG4gICAgICAgIGNvbnN0IGFuc3dlckNvbnRhaW5lciA9IGUuY3VycmVudFRhcmdldC5jbG9zZXN0KCcuY2hhdC1hbnN3ZXItY29udGFpbmVyJylcblxuICAgICAgICBpZiAoYW5zd2VyQ29udGFpbmVyKSB7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0SWQgPSBDU1MuZXNjYXBlKGhyZWYudG9TdHJpbmcoKS5zdWJzdHJpbmcoMSkpXG4gICAgICAgICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGFuc3dlckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke3RhcmdldElkfVwiXWApXG4gICAgICAgICAgaWYgKHRhcmdldEVsZW1lbnQpXG4gICAgICAgICAgICB0YXJnZXRFbGVtZW50LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiA8YSBocmVmPXtocmVmfSBvbkNsaWNrPXtoYW5kbGVDbGlja30gY2xhc3NOYW1lPXtjb21tb25DbGFzc05hbWV9PntjaGlsZHJlbiB8fCAnU2Nyb2xsVmlldyd9PC9hPlxuICAgIH1cblxuICAgIGlmICghaHJlZiB8fCAhaXNWYWxpZFVybChocmVmKSlcbiAgICAgIHJldHVybiA8c3Bhbj57Y2hpbGRyZW59PC9zcGFuPlxuXG4gICAgcmV0dXJuIDxhIGhyZWY9e2hyZWZ9IHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBjbGFzc05hbWU9e2NvbW1vbkNsYXNzTmFtZX0+e2NoaWxkcmVuIHx8ICdEb3dubG9hZCd9PC9hPlxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExpbmtcbiJdfQ==