"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const test_1 = require("storybook/test");
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/FloatRightContainer',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Wrapper that renders content in a drawer on mobile and inline on desktop. Useful for responsive settings panels.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
const ContainerDemo = () => {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    return (<div className="flex h-[360px] flex-col gap-4 bg-background-default-subtle p-6">
      <div className="flex items-center gap-3">
        <button type="button" className="rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
          Open panel
        </button>
        <label className="flex items-center gap-1 text-xs text-text-secondary">
          <input type="checkbox" checked={isMobile} onChange={e => setIsMobile(e.target.checked)}/>
          Simulate mobile
        </label>
      </div>

      <_1.default isMobile={isMobile} isOpen={open} onClose={() => setOpen(false)} title="Responsive panel" description="Switch the toggle to see drawer vs inline behaviour." mask>
        <div className="rounded-xl border border-divider-subtle bg-components-panel-bg p-4 text-xs text-text-secondary">
          <p className="mb-2 text-sm text-text-primary">Panel Content</p>
          <p>
            On desktop, this block renders inline when `isOpen` is true. On mobile it appears inside the drawer wrapper.
          </p>
        </div>
      </_1.default>
    </div>);
};
exports.Playground = {
    render: () => <ContainerDemo />,
    args: {
        isMobile: false,
        isOpen: false,
        onClose: (0, test_1.fn)(),
        children: null,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx5Q0FBbUM7QUFDbkMsd0JBQW1DO0FBRW5DLE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLG1DQUFtQztJQUMxQyxTQUFTLEVBQUUsVUFBbUI7SUFDOUIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFlBQVk7UUFDcEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSxrSEFBa0g7YUFDOUg7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ3dCLENBQUE7QUFFNUMsa0JBQWUsSUFBSSxDQUFBO0FBR25CLE1BQU0sYUFBYSxHQUFHLEdBQUcsRUFBRTtJQUN6QixNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUN2QyxNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUUvQyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGdFQUFnRSxDQUM3RTtNQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsQ0FDdEM7UUFBQSxDQUFDLE1BQU0sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQyxxR0FBcUcsQ0FDL0csT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBRTdCOztRQUNGLEVBQUUsTUFBTSxDQUNSO1FBQUEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLHFEQUFxRCxDQUNwRTtVQUFBLENBQUMsS0FBSyxDQUNKLElBQUksQ0FBQyxVQUFVLENBQ2YsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQ2xCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFFL0M7O1FBQ0YsRUFBRSxLQUFLLENBQ1Q7TUFBQSxFQUFFLEdBQUcsQ0FFTDs7TUFBQSxDQUFDLFVBQW1CLENBQ2xCLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUNuQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDYixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDOUIsS0FBSyxDQUFDLGtCQUFrQixDQUN4QixXQUFXLENBQUMsc0RBQXNELENBQ2xFLElBQUksQ0FFSjtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxnR0FBZ0csQ0FDN0c7VUFBQSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FDOUQ7VUFBQSxDQUFDLENBQUMsQ0FDQTs7VUFDRixFQUFFLENBQUMsQ0FDTDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxVQUFtQixDQUN2QjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVZLFFBQUEsVUFBVSxHQUFVO0lBQy9CLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxBQUFELEVBQUc7SUFDL0IsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFLEtBQUs7UUFDZixNQUFNLEVBQUUsS0FBSztRQUNiLE9BQU8sRUFBRSxJQUFBLFNBQUUsR0FBRTtRQUNiLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGZuIH0gZnJvbSAnc3Rvcnlib29rL3Rlc3QnXG5pbXBvcnQgRmxvYXRSaWdodENvbnRhaW5lciBmcm9tICcuJ1xuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRmVlZGJhY2svRmxvYXRSaWdodENvbnRhaW5lcicsXG4gIGNvbXBvbmVudDogRmxvYXRSaWdodENvbnRhaW5lcixcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2Z1bGxzY3JlZW4nLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1dyYXBwZXIgdGhhdCByZW5kZXJzIGNvbnRlbnQgaW4gYSBkcmF3ZXIgb24gbW9iaWxlIGFuZCBpbmxpbmUgb24gZGVza3RvcC4gVXNlZnVsIGZvciByZXNwb25zaXZlIHNldHRpbmdzIHBhbmVscy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBGbG9hdFJpZ2h0Q29udGFpbmVyPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmNvbnN0IENvbnRhaW5lckRlbW8gPSAoKSA9PiB7XG4gIGNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbaXNNb2JpbGUsIHNldElzTW9iaWxlXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtWzM2MHB4XSBmbGV4LWNvbCBnYXAtNCBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlIHAtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBiZy1wcmltYXJ5LTYwMCBweC0zIHB5LTEuNSB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtd2hpdGUgc2hhZG93LXNtIGhvdmVyOmJnLXByaW1hcnktNzAwXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfVxuICAgICAgICA+XG4gICAgICAgICAgT3BlbiBwYW5lbFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRleHQteHMgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIGNoZWNrZWQ9e2lzTW9iaWxlfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0SXNNb2JpbGUoZS50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgLz5cbiAgICAgICAgICBTaW11bGF0ZSBtb2JpbGVcbiAgICAgICAgPC9sYWJlbD5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8RmxvYXRSaWdodENvbnRhaW5lclxuICAgICAgICBpc01vYmlsZT17aXNNb2JpbGV9XG4gICAgICAgIGlzT3Blbj17b3Blbn1cbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0T3BlbihmYWxzZSl9XG4gICAgICAgIHRpdGxlPVwiUmVzcG9uc2l2ZSBwYW5lbFwiXG4gICAgICAgIGRlc2NyaXB0aW9uPVwiU3dpdGNoIHRoZSB0b2dnbGUgdG8gc2VlIGRyYXdlciB2cyBpbmxpbmUgYmVoYXZpb3VyLlwiXG4gICAgICAgIG1hc2tcbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTQgdGV4dC14cyB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwibWItMiB0ZXh0LXNtIHRleHQtdGV4dC1wcmltYXJ5XCI+UGFuZWwgQ29udGVudDwvcD5cbiAgICAgICAgICA8cD5cbiAgICAgICAgICAgIE9uIGRlc2t0b3AsIHRoaXMgYmxvY2sgcmVuZGVycyBpbmxpbmUgd2hlbiBgaXNPcGVuYCBpcyB0cnVlLiBPbiBtb2JpbGUgaXQgYXBwZWFycyBpbnNpZGUgdGhlIGRyYXdlciB3cmFwcGVyLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0Zsb2F0UmlnaHRDb250YWluZXI+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IDxDb250YWluZXJEZW1vIC8+LFxuICBhcmdzOiB7XG4gICAgaXNNb2JpbGU6IGZhbHNlLFxuICAgIGlzT3BlbjogZmFsc2UsXG4gICAgb25DbG9zZTogZm4oKSxcbiAgICBjaGlsZHJlbjogbnVsbCxcbiAgfSxcbn1cbiJdfQ==