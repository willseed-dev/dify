"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFooter = exports.Playground = void 0;
const react_1 = require("react");
const test_1 = require("storybook/test");
const _1 = require(".");
const meta = {
    title: 'Base/Feedback/Drawer',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Sliding panel built on Headless UI dialog primitives. Supports optional mask, custom footer, and close behaviour.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
const DrawerDemo = (props) => {
    const [open, setOpen] = (0, react_1.useState)(false);
    return (<div className="flex h-[400px] items-center justify-center bg-background-default-subtle">
      <button type="button" className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
        Open drawer
      </button>

      <_1.default {...props} isOpen={open} onClose={() => setOpen(false)} title={props.title ?? 'Edit configuration'} description={props.description ?? 'Adjust settings in the side panel and save.'} footer={props.footer ?? undefined}>
        <div className="mt-4 space-y-3 text-sm text-text-secondary">
          <p>
            This example renders arbitrary content inside the drawer body. Use it for contextual forms, settings, or informational panels.
          </p>
          <div className="rounded-lg border border-divider-subtle bg-components-panel-bg p-3 text-xs">
            Content area
          </div>
        </div>
      </_1.default>
    </div>);
};
exports.Playground = {
    render: args => <DrawerDemo {...args}/>,
    args: {
        children: null,
        isOpen: false,
        onClose: (0, test_1.fn)(),
    },
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
const [open, setOpen] = useState(false)

<Drawer
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Edit configuration"
  description="Adjust settings in the side panel and save."
>
  ...
</Drawer>
        `.trim(),
            },
        },
    },
};
exports.CustomFooter = {
    render: args => (<DrawerDemo {...args} footer={(<div className="mt-6 flex justify-end gap-2">
          <button className="rounded-md border border-divider-subtle px-3 py-1.5 text-sm text-text-secondary" onClick={() => args.onCancel?.()}>Discard</button>
          <button className="rounded-md bg-primary-600 px-3 py-1.5 text-sm text-white">Save changes</button>
        </div>)}/>),
    args: {
        children: null,
        isOpen: false,
        onClose: (0, test_1.fn)(),
    },
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<Drawer footer={<CustomFooter />}>
  ...
</Drawer>
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx5Q0FBbUM7QUFDbkMsd0JBQXNCO0FBRXRCLE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLHNCQUFzQjtJQUM3QixTQUFTLEVBQUUsVUFBTTtJQUNqQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsWUFBWTtRQUNwQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLG1IQUFtSDthQUMvSDtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDVyxDQUFBO0FBRS9CLGtCQUFlLElBQUksQ0FBQTtBQUduQixNQUFNLFVBQVUsR0FBRyxDQUFDLEtBQTBDLEVBQUUsRUFBRTtJQUNoRSxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUV2QyxPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlFQUF5RSxDQUN0RjtNQUFBLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLG1HQUFtRyxDQUM3RyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FFN0I7O01BQ0YsRUFBRSxNQUFNLENBRVI7O01BQUEsQ0FBQyxVQUFNLENBQ0wsSUFBSSxLQUFLLENBQUMsQ0FDVixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FDYixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDOUIsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxvQkFBb0IsQ0FBQyxDQUMzQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLDZDQUE2QyxDQUFDLENBQ2hGLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLENBRWxDO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRDQUE0QyxDQUN6RDtVQUFBLENBQUMsQ0FBQyxDQUNBOztVQUNGLEVBQUUsQ0FBQyxDQUNIO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRFQUE0RSxDQUN6Rjs7VUFDRixFQUFFLEdBQUcsQ0FDUDtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxVQUFNLENBQ1Y7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0lBQ3hDLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsSUFBQSxTQUFFLEdBQUU7S0FDZDtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7Ozs7Ozs7O1NBV0wsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7Q0FDRixDQUFBO0FBRVksUUFBQSxZQUFZLEdBQVU7SUFDakMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDZCxDQUFDLFVBQVUsQ0FDVCxJQUFJLElBQUksQ0FBQyxDQUNULE1BQU0sQ0FBQyxDQUFDLENBQ04sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUMxQztVQUFBLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxpRkFBaUYsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQ3JKO1VBQUEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLDBEQUEwRCxDQUFDLFlBQVksRUFBRSxNQUFNLENBQ25HO1FBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFDLEVBQ0YsQ0FDSDtJQUNELElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRSxJQUFJO1FBQ2QsTUFBTSxFQUFFLEtBQUs7UUFDYixPQUFPLEVBQUUsSUFBQSxTQUFFLEdBQUU7S0FDZDtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7U0FJTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgZm4gfSBmcm9tICdzdG9yeWJvb2svdGVzdCdcbmltcG9ydCBEcmF3ZXIgZnJvbSAnLidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0ZlZWRiYWNrL0RyYXdlcicsXG4gIGNvbXBvbmVudDogRHJhd2VyLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnZnVsbHNjcmVlbicsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnU2xpZGluZyBwYW5lbCBidWlsdCBvbiBIZWFkbGVzcyBVSSBkaWFsb2cgcHJpbWl0aXZlcy4gU3VwcG9ydHMgb3B0aW9uYWwgbWFzaywgY3VzdG9tIGZvb3RlciwgYW5kIGNsb3NlIGJlaGF2aW91ci4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBEcmF3ZXI+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuY29uc3QgRHJhd2VyRGVtbyA9IChwcm9wczogUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIERyYXdlcj4pID0+IHtcbiAgY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC1bNDAwcHhdIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLW1kIGJnLXByaW1hcnktNjAwIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtd2hpdGUgc2hhZG93LXNtIGhvdmVyOmJnLXByaW1hcnktNzAwXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3Blbih0cnVlKX1cbiAgICAgID5cbiAgICAgICAgT3BlbiBkcmF3ZXJcbiAgICAgIDwvYnV0dG9uPlxuXG4gICAgICA8RHJhd2VyXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgaXNPcGVuPXtvcGVufVxuICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRPcGVuKGZhbHNlKX1cbiAgICAgICAgdGl0bGU9e3Byb3BzLnRpdGxlID8/ICdFZGl0IGNvbmZpZ3VyYXRpb24nfVxuICAgICAgICBkZXNjcmlwdGlvbj17cHJvcHMuZGVzY3JpcHRpb24gPz8gJ0FkanVzdCBzZXR0aW5ncyBpbiB0aGUgc2lkZSBwYW5lbCBhbmQgc2F2ZS4nfVxuICAgICAgICBmb290ZXI9e3Byb3BzLmZvb3RlciA/PyB1bmRlZmluZWR9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNCBzcGFjZS15LTMgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+XG4gICAgICAgICAgPHA+XG4gICAgICAgICAgICBUaGlzIGV4YW1wbGUgcmVuZGVycyBhcmJpdHJhcnkgY29udGVudCBpbnNpZGUgdGhlIGRyYXdlciBib2R5LiBVc2UgaXQgZm9yIGNvbnRleHR1YWwgZm9ybXMsIHNldHRpbmdzLCBvciBpbmZvcm1hdGlvbmFsIHBhbmVscy5cbiAgICAgICAgICA8L3A+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTMgdGV4dC14c1wiPlxuICAgICAgICAgICAgQ29udGVudCBhcmVhXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9EcmF3ZXI+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPERyYXdlckRlbW8gey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgY2hpbGRyZW46IG51bGwsXG4gICAgaXNPcGVuOiBmYWxzZSxcbiAgICBvbkNsb3NlOiBmbigpLFxuICB9LFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuY29uc3QgW29wZW4sIHNldE9wZW5dID0gdXNlU3RhdGUoZmFsc2UpXG5cbjxEcmF3ZXJcbiAgaXNPcGVuPXtvcGVufVxuICBvbkNsb3NlPXsoKSA9PiBzZXRPcGVuKGZhbHNlKX1cbiAgdGl0bGU9XCJFZGl0IGNvbmZpZ3VyYXRpb25cIlxuICBkZXNjcmlwdGlvbj1cIkFkanVzdCBzZXR0aW5ncyBpbiB0aGUgc2lkZSBwYW5lbCBhbmQgc2F2ZS5cIlxuPlxuICAuLi5cbjwvRHJhd2VyPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IEN1c3RvbUZvb3RlcjogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiAoXG4gICAgPERyYXdlckRlbW9cbiAgICAgIHsuLi5hcmdzfVxuICAgICAgZm9vdGVyPXsoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtNiBmbGV4IGp1c3RpZnktZW5kIGdhcC0yXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJyb3VuZGVkLW1kIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgcHgtMyBweS0xLjUgdGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCIgb25DbGljaz17KCkgPT4gYXJncy5vbkNhbmNlbD8uKCl9PkRpc2NhcmQ8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctcHJpbWFyeS02MDAgcHgtMyBweS0xLjUgdGV4dC1zbSB0ZXh0LXdoaXRlXCI+U2F2ZSBjaGFuZ2VzPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAvPlxuICApLFxuICBhcmdzOiB7XG4gICAgY2hpbGRyZW46IG51bGwsXG4gICAgaXNPcGVuOiBmYWxzZSxcbiAgICBvbkNsb3NlOiBmbigpLFxuICB9LFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPERyYXdlciBmb290ZXI9ezxDdXN0b21Gb290ZXIgLz59PlxuICAuLi5cbjwvRHJhd2VyPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==