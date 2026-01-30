"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisabledState = exports.ClickPopover = exports.HoverPopover = void 0;
const react_1 = require("react");
const _1 = require(".");
const PopoverContent = ({ title, description, onClose }) => {
    return (<div className="flex min-w-[220px] flex-col gap-2 p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-text-tertiary">
        {title}
      </div>
      <p className="text-sm leading-5 text-text-secondary">{description}</p>
      <button type="button" className="self-start rounded-md border border-divider-subtle px-2 py-1 text-xs font-medium text-text-tertiary hover:bg-state-base-hover" onClick={onClose}>
        Dismiss
      </button>
    </div>);
};
const Template = ({ trigger = 'hover', position = 'bottom', manualClose, disabled, }) => {
    const [hoverHint] = (0, react_1.useState)(trigger === 'hover'
        ? 'Hover over the badge to reveal quick tips.'
        : 'Click the badge to open the contextual menu.');
    return (<div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <p className="text-sm text-text-secondary">{hoverHint}</p>
      <div className="flex flex-wrap items-center gap-6">
        <_1.default trigger={trigger} position={position} manualClose={manualClose} disabled={disabled} btnElement={<span className="text-xs font-medium text-text-secondary">Popover trigger</span>} htmlContent={(<PopoverContent title={trigger === 'hover' ? 'Quick help' : 'More actions'} description={trigger === 'hover'
                ? 'Use hover-triggered popovers for light contextual hints and inline docs.'
                : 'Click-triggered popovers are ideal for menus that require user decisions.'}/>)}/>
      </div>
    </div>);
};
const meta = {
    title: 'Base/Feedback/Popover',
    component: Template,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Headless UI popover wrapper supporting hover and click triggers. These examples highlight alignment controls and manual closing.',
            },
        },
    },
    argTypes: {
        trigger: {
            control: 'radio',
            options: ['hover', 'click'],
        },
        position: {
            control: 'radio',
            options: ['bottom', 'bl', 'br'],
        },
        manualClose: { control: 'boolean' },
        disabled: { control: 'boolean' },
    },
    args: {
        trigger: 'hover',
        position: 'bottom',
        manualClose: false,
        disabled: false,
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.HoverPopover = {};
exports.ClickPopover = {
    args: {
        trigger: 'click',
        position: 'br',
    },
};
exports.DisabledState = {
    args: {
        disabled: true,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBNkI7QUFVN0IsTUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUF1QixFQUFFLEVBQUU7SUFDOUUsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FDcEQ7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0VBQXNFLENBQ25GO1FBQUEsQ0FBQyxLQUFLLENBQ1I7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FDckU7TUFBQSxDQUFDLE1BQU0sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQywrSEFBK0gsQ0FDekksT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBRWpCOztNQUNGLEVBQUUsTUFBTSxDQUNWO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxRQUFRLEdBQUcsQ0FBQyxFQUNoQixPQUFPLEdBQUcsT0FBTyxFQUNqQixRQUFRLEdBQUcsUUFBUSxFQUNuQixXQUFXLEVBQ1gsUUFBUSxHQU1ULEVBQUUsRUFBRTtJQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQzFCLE9BQU8sS0FBSyxPQUFPO1FBQ2pCLENBQUMsQ0FBQyw0Q0FBNEM7UUFDOUMsQ0FBQyxDQUFDLDhDQUE4QyxDQUNuRCxDQUFBO0lBRUQsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5R0FBeUcsQ0FDdEg7TUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQ3pEO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLG1DQUFtQyxDQUNoRDtRQUFBLENBQUMsVUFBYSxDQUNaLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUNqQixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDbkIsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQ3pCLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNuQixVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUNBQXlDLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQzdGLFdBQVcsQ0FBQyxDQUFDLENBQ1gsQ0FBQyxjQUFjLENBQ2IsS0FBSyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FDM0QsV0FBVyxDQUFDLENBQUMsT0FBTyxLQUFLLE9BQU87Z0JBQzlCLENBQUMsQ0FBQywwRUFBMEU7Z0JBQzVFLENBQUMsQ0FBQywyRUFBMkUsQ0FBQyxFQUNoRixDQUNILENBQUMsRUFFTjtNQUFBLEVBQUUsR0FBRyxDQUNQO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsdUJBQXVCO0lBQzlCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsa0lBQWtJO2FBQzlJO1NBQ0Y7S0FDRjtJQUNELFFBQVEsRUFBRTtRQUNSLE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7U0FDNUI7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztTQUNoQztRQUNELFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7UUFDbkMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtLQUNqQztJQUNELElBQUksRUFBRTtRQUNKLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLFdBQVcsRUFBRSxLQUFLO1FBQ2xCLFFBQVEsRUFBRSxLQUFLO0tBQ2hCO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ2EsQ0FBQTtBQUVqQyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLFlBQVksR0FBVSxFQUFFLENBQUE7QUFFeEIsUUFBQSxZQUFZLEdBQVU7SUFDakMsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFLE9BQU87UUFDaEIsUUFBUSxFQUFFLElBQUk7S0FDZjtDQUNGLENBQUE7QUFFWSxRQUFBLGFBQWEsR0FBVTtJQUNsQyxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsSUFBSTtLQUNmO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQ3VzdG9tUG9wb3ZlciBmcm9tICcuJ1xuXG50eXBlIFBvcG92ZXJDb250ZW50UHJvcHMgPSB7XG4gIG9wZW4/OiBib29sZWFuXG4gIG9uQ2xvc2U/OiAoKSA9PiB2b2lkXG4gIG9uQ2xpY2s/OiAoKSA9PiB2b2lkXG4gIHRpdGxlOiBzdHJpbmdcbiAgZGVzY3JpcHRpb246IHN0cmluZ1xufVxuXG5jb25zdCBQb3BvdmVyQ29udGVudCA9ICh7IHRpdGxlLCBkZXNjcmlwdGlvbiwgb25DbG9zZSB9OiBQb3BvdmVyQ29udGVudFByb3BzKSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IG1pbi13LVsyMjBweF0gZmxleC1jb2wgZ2FwLTIgcC0zXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1zZW1pYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMTJlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIHt0aXRsZX1cbiAgICAgIDwvZGl2PlxuICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSBsZWFkaW5nLTUgdGV4dC10ZXh0LXNlY29uZGFyeVwiPntkZXNjcmlwdGlvbn08L3A+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJzZWxmLXN0YXJ0IHJvdW5kZWQtbWQgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBweC0yIHB5LTEgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXRleHQtdGVydGlhcnkgaG92ZXI6Ymctc3RhdGUtYmFzZS1ob3ZlclwiXG4gICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICA+XG4gICAgICAgIERpc21pc3NcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IFRlbXBsYXRlID0gKHtcbiAgdHJpZ2dlciA9ICdob3ZlcicsXG4gIHBvc2l0aW9uID0gJ2JvdHRvbScsXG4gIG1hbnVhbENsb3NlLFxuICBkaXNhYmxlZCxcbn06IHtcbiAgdHJpZ2dlcj86ICdjbGljaycgfCAnaG92ZXInXG4gIHBvc2l0aW9uPzogJ2JvdHRvbScgfCAnYmwnIHwgJ2JyJ1xuICBtYW51YWxDbG9zZT86IGJvb2xlYW5cbiAgZGlzYWJsZWQ/OiBib29sZWFuXG59KSA9PiB7XG4gIGNvbnN0IFtob3ZlckhpbnRdID0gdXNlU3RhdGUoXG4gICAgdHJpZ2dlciA9PT0gJ2hvdmVyJ1xuICAgICAgPyAnSG92ZXIgb3ZlciB0aGUgYmFkZ2UgdG8gcmV2ZWFsIHF1aWNrIHRpcHMuJ1xuICAgICAgOiAnQ2xpY2sgdGhlIGJhZGdlIHRvIG9wZW4gdGhlIGNvbnRleHR1YWwgbWVudS4nLFxuICApXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy1mdWxsIG1heC13LWxnIGZsZXgtY29sIGdhcC00IHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTZcIj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC10ZXh0LXNlY29uZGFyeVwiPntob3ZlckhpbnR9PC9wPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBpdGVtcy1jZW50ZXIgZ2FwLTZcIj5cbiAgICAgICAgPEN1c3RvbVBvcG92ZXJcbiAgICAgICAgICB0cmlnZ2VyPXt0cmlnZ2VyfVxuICAgICAgICAgIHBvc2l0aW9uPXtwb3NpdGlvbn1cbiAgICAgICAgICBtYW51YWxDbG9zZT17bWFudWFsQ2xvc2V9XG4gICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgIGJ0bkVsZW1lbnQ9ezxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1tZWRpdW0gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlBvcG92ZXIgdHJpZ2dlcjwvc3Bhbj59XG4gICAgICAgICAgaHRtbENvbnRlbnQ9eyhcbiAgICAgICAgICAgIDxQb3BvdmVyQ29udGVudFxuICAgICAgICAgICAgICB0aXRsZT17dHJpZ2dlciA9PT0gJ2hvdmVyJyA/ICdRdWljayBoZWxwJyA6ICdNb3JlIGFjdGlvbnMnfVxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17dHJpZ2dlciA9PT0gJ2hvdmVyJ1xuICAgICAgICAgICAgICAgID8gJ1VzZSBob3Zlci10cmlnZ2VyZWQgcG9wb3ZlcnMgZm9yIGxpZ2h0IGNvbnRleHR1YWwgaGludHMgYW5kIGlubGluZSBkb2NzLidcbiAgICAgICAgICAgICAgICA6ICdDbGljay10cmlnZ2VyZWQgcG9wb3ZlcnMgYXJlIGlkZWFsIGZvciBtZW51cyB0aGF0IHJlcXVpcmUgdXNlciBkZWNpc2lvbnMuJ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9GZWVkYmFjay9Qb3BvdmVyJyxcbiAgY29tcG9uZW50OiBUZW1wbGF0ZSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2NlbnRlcmVkJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdIZWFkbGVzcyBVSSBwb3BvdmVyIHdyYXBwZXIgc3VwcG9ydGluZyBob3ZlciBhbmQgY2xpY2sgdHJpZ2dlcnMuIFRoZXNlIGV4YW1wbGVzIGhpZ2hsaWdodCBhbGlnbm1lbnQgY29udHJvbHMgYW5kIG1hbnVhbCBjbG9zaW5nLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGFyZ1R5cGVzOiB7XG4gICAgdHJpZ2dlcjoge1xuICAgICAgY29udHJvbDogJ3JhZGlvJyxcbiAgICAgIG9wdGlvbnM6IFsnaG92ZXInLCAnY2xpY2snXSxcbiAgICB9LFxuICAgIHBvc2l0aW9uOiB7XG4gICAgICBjb250cm9sOiAncmFkaW8nLFxuICAgICAgb3B0aW9uczogWydib3R0b20nLCAnYmwnLCAnYnInXSxcbiAgICB9LFxuICAgIG1hbnVhbENsb3NlOiB7IGNvbnRyb2w6ICdib29sZWFuJyB9LFxuICAgIGRpc2FibGVkOiB7IGNvbnRyb2w6ICdib29sZWFuJyB9LFxuICB9LFxuICBhcmdzOiB7XG4gICAgdHJpZ2dlcjogJ2hvdmVyJyxcbiAgICBwb3NpdGlvbjogJ2JvdHRvbScsXG4gICAgbWFudWFsQ2xvc2U6IGZhbHNlLFxuICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgVGVtcGxhdGU+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IEhvdmVyUG9wb3ZlcjogU3RvcnkgPSB7fVxuXG5leHBvcnQgY29uc3QgQ2xpY2tQb3BvdmVyOiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIHRyaWdnZXI6ICdjbGljaycsXG4gICAgcG9zaXRpb246ICdicicsXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBEaXNhYmxlZFN0YXRlOiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIGRpc2FibGVkOiB0cnVlLFxuICB9LFxufVxuIl19