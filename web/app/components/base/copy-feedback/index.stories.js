"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/CopyFeedback',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Copy-to-clipboard button that shows instant feedback and a tooltip. Includes the original ActionButton wrapper and the newer ghost-button variant.',
            },
        },
    },
    tags: ['autodocs'],
    args: {
        content: 'acc-3f92fa',
    },
};
exports.default = meta;
const CopyDemo = ({ content }) => {
    const [value] = (0, react_1.useState)(content);
    return (<div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>Client ID:</span>
        <span className="rounded bg-background-default-subtle px-2 py-1 font-mono text-xs text-text-primary">{value}</span>
        <_1.default content={value}/>
      </div>
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <span>Use the new ghost variant:</span>
        <_1.CopyFeedbackNew content={value}/>
      </div>
    </div>);
};
exports.Playground = {
    render: args => <CopyDemo content={args.content}/>,
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<CopyFeedback content="acc-3f92fa" />
<CopyFeedbackNew content="acc-3f92fa" />
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBaUQ7QUFFakQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsNEJBQTRCO0lBQ25DLFNBQVMsRUFBRSxVQUFZO0lBQ3ZCLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsb0pBQW9KO2FBQ2hLO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixJQUFJLEVBQUU7UUFDSixPQUFPLEVBQUUsWUFBWTtLQUN0QjtDQUNrQyxDQUFBO0FBRXJDLGtCQUFlLElBQUksQ0FBQTtBQUduQixNQUFNLFFBQVEsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUF1QixFQUFFLEVBQUU7SUFDcEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxPQUFPLENBQUMsQ0FBQTtJQUNqQyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUNsQztNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxREFBcUQsQ0FDbEU7UUFBQSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUN0QjtRQUFBLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxvRkFBb0YsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FDbEg7UUFBQSxDQUFDLFVBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFDL0I7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxREFBcUQsQ0FDbEU7UUFBQSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxJQUFJLENBQ3RDO1FBQUEsQ0FBQyxrQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUNsQztNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRVksUUFBQSxVQUFVLEdBQVU7SUFDL0IsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFHO0lBQ25ELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7OztTQUdMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29weUZlZWRiYWNrLCB7IENvcHlGZWVkYmFja05ldyB9IGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9Db3B5RmVlZGJhY2snLFxuICBjb21wb25lbnQ6IENvcHlGZWVkYmFjayxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0NvcHktdG8tY2xpcGJvYXJkIGJ1dHRvbiB0aGF0IHNob3dzIGluc3RhbnQgZmVlZGJhY2sgYW5kIGEgdG9vbHRpcC4gSW5jbHVkZXMgdGhlIG9yaWdpbmFsIEFjdGlvbkJ1dHRvbiB3cmFwcGVyIGFuZCB0aGUgbmV3ZXIgZ2hvc3QtYnV0dG9uIHZhcmlhbnQuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdzOiB7XG4gICAgY29udGVudDogJ2FjYy0zZjkyZmEnLFxuICB9LFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgQ29weUZlZWRiYWNrPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmNvbnN0IENvcHlEZW1vID0gKHsgY29udGVudCB9OiB7IGNvbnRlbnQ6IHN0cmluZyB9KSA9PiB7XG4gIGNvbnN0IFt2YWx1ZV0gPSB1c2VTdGF0ZShjb250ZW50KVxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtNFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5cbiAgICAgICAgPHNwYW4+Q2xpZW50IElEOjwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicm91bmRlZCBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlIHB4LTIgcHktMSBmb250LW1vbm8gdGV4dC14cyB0ZXh0LXRleHQtcHJpbWFyeVwiPnt2YWx1ZX08L3NwYW4+XG4gICAgICAgIDxDb3B5RmVlZGJhY2sgY29udGVudD17dmFsdWV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgIDxzcGFuPlVzZSB0aGUgbmV3IGdob3N0IHZhcmlhbnQ6PC9zcGFuPlxuICAgICAgICA8Q29weUZlZWRiYWNrTmV3IGNvbnRlbnQ9e3ZhbHVlfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPENvcHlEZW1vIGNvbnRlbnQ9e2FyZ3MuY29udGVudH0gLz4sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48Q29weUZlZWRiYWNrIGNvbnRlbnQ9XCJhY2MtM2Y5MmZhXCIgLz5cbjxDb3B5RmVlZGJhY2tOZXcgY29udGVudD1cImFjYy0zZjkyZmFcIiAvPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==