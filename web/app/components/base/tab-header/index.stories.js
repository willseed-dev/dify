"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const items = [
    { id: 'overview', name: 'Overview' },
    { id: 'playground', name: 'Playground' },
    { id: 'changelog', name: 'Changelog', extra: <span className="ml-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-600">New</span> },
    { id: 'docs', name: 'Docs', isRight: true },
    { id: 'settings', name: 'Settings', isRight: true, disabled: true },
];
const TabHeaderDemo = ({ initialTab = 'overview', }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)(initialTab);
    return (<div className="flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-text-tertiary">
        <span>Tabs</span>
        <code className="rounded-md bg-background-default px-2 py-1 text-[11px] text-text-tertiary">
          active="
          {activeTab}
          "
        </code>
      </div>
      <_1.default items={items} value={activeTab} onChange={setActiveTab}/>
    </div>);
};
const meta = {
    title: 'Base/Navigation/TabHeader',
    component: TabHeaderDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Two-sided header tabs with optional right-aligned actions. Disabled items illustrate read-only states.',
            },
        },
    },
    argTypes: {
        initialTab: {
            control: 'radio',
            options: items.map(item => item.id),
        },
    },
    args: {
        initialTab: 'overview',
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFnQztBQUNoQyx3QkFBeUI7QUFFekIsTUFBTSxLQUFLLEdBQTZCO0lBQ3RDLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO0lBQ3BDLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFO0lBQ3hDLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsc0VBQXNFLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFO0lBQ2hKLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7SUFDM0MsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO0NBQ3BFLENBQUE7QUFFRCxNQUFNLGFBQWEsR0FBRyxDQUFDLEVBQ3JCLFVBQVUsR0FBRyxVQUFVLEdBR3hCLEVBQUUsRUFBRTtJQUNILE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLFVBQVUsQ0FBQyxDQUFBO0lBRXRELE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEdBQTBHLENBQ3ZIO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBGQUEwRixDQUN2RztRQUFBLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQ2hCO1FBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDJFQUEyRSxDQUN6Rjs7VUFDQSxDQUFDLFNBQVMsQ0FDVjs7UUFDRixFQUFFLElBQUksQ0FDUjtNQUFBLEVBQUUsR0FBRyxDQUNMO01BQUEsQ0FBQyxVQUFTLENBQ1IsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQ2IsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQ2pCLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUUzQjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLDJCQUEyQjtJQUNsQyxTQUFTLEVBQUUsYUFBYTtJQUN4QixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLHdHQUF3RzthQUNwSDtTQUNGO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixVQUFVLEVBQUU7WUFDVixPQUFPLEVBQUUsT0FBTztZQUNoQixPQUFPLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDcEM7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLFVBQVUsRUFBRSxVQUFVO0tBQ3ZCO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ2tCLENBQUE7QUFFdEMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxVQUFVLEdBQVUsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHR5cGUgeyBJVGFiSGVhZGVyUHJvcHMgfSBmcm9tICcuJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBUYWJIZWFkZXIgZnJvbSAnLidcblxuY29uc3QgaXRlbXM6IElUYWJIZWFkZXJQcm9wc1snaXRlbXMnXSA9IFtcbiAgeyBpZDogJ292ZXJ2aWV3JywgbmFtZTogJ092ZXJ2aWV3JyB9LFxuICB7IGlkOiAncGxheWdyb3VuZCcsIG5hbWU6ICdQbGF5Z3JvdW5kJyB9LFxuICB7IGlkOiAnY2hhbmdlbG9nJywgbmFtZTogJ0NoYW5nZWxvZycsIGV4dHJhOiA8c3BhbiBjbGFzc05hbWU9XCJtbC0xIHJvdW5kZWQtZnVsbCBiZy1wcmltYXJ5LTUwIHB4LTIgcHktMC41IHRleHQteHMgdGV4dC1wcmltYXJ5LTYwMFwiPk5ldzwvc3Bhbj4gfSxcbiAgeyBpZDogJ2RvY3MnLCBuYW1lOiAnRG9jcycsIGlzUmlnaHQ6IHRydWUgfSxcbiAgeyBpZDogJ3NldHRpbmdzJywgbmFtZTogJ1NldHRpbmdzJywgaXNSaWdodDogdHJ1ZSwgZGlzYWJsZWQ6IHRydWUgfSxcbl1cblxuY29uc3QgVGFiSGVhZGVyRGVtbyA9ICh7XG4gIGluaXRpYWxUYWIgPSAnb3ZlcnZpZXcnLFxufToge1xuICBpbml0aWFsVGFiPzogc3RyaW5nXG59KSA9PiB7XG4gIGNvbnN0IFthY3RpdmVUYWIsIHNldEFjdGl2ZVRhYl0gPSB1c2VTdGF0ZShpbml0aWFsVGFiKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHctZnVsbCBtYXgtdy0zeGwgZmxleC1jb2wgZ2FwLTYgcm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNlwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMThlbV0gdGV4dC10ZXh0LXRlcnRpYXJ5XCI+XG4gICAgICAgIDxzcGFuPlRhYnM8L3NwYW4+XG4gICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cInJvdW5kZWQtbWQgYmctYmFja2dyb3VuZC1kZWZhdWx0IHB4LTIgcHktMSB0ZXh0LVsxMXB4XSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgICBhY3RpdmU9XCJcbiAgICAgICAgICB7YWN0aXZlVGFifVxuICAgICAgICAgIFwiXG4gICAgICAgIDwvY29kZT5cbiAgICAgIDwvZGl2PlxuICAgICAgPFRhYkhlYWRlclxuICAgICAgICBpdGVtcz17aXRlbXN9XG4gICAgICAgIHZhbHVlPXthY3RpdmVUYWJ9XG4gICAgICAgIG9uQ2hhbmdlPXtzZXRBY3RpdmVUYWJ9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9OYXZpZ2F0aW9uL1RhYkhlYWRlcicsXG4gIGNvbXBvbmVudDogVGFiSGVhZGVyRGVtbyxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2NlbnRlcmVkJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdUd28tc2lkZWQgaGVhZGVyIHRhYnMgd2l0aCBvcHRpb25hbCByaWdodC1hbGlnbmVkIGFjdGlvbnMuIERpc2FibGVkIGl0ZW1zIGlsbHVzdHJhdGUgcmVhZC1vbmx5IHN0YXRlcy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIGluaXRpYWxUYWI6IHtcbiAgICAgIGNvbnRyb2w6ICdyYWRpbycsXG4gICAgICBvcHRpb25zOiBpdGVtcy5tYXAoaXRlbSA9PiBpdGVtLmlkKSxcbiAgICB9LFxuICB9LFxuICBhcmdzOiB7XG4gICAgaW5pdGlhbFRhYjogJ292ZXJ2aWV3JyxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgVGFiSGVhZGVyRGVtbz5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7fVxuIl19