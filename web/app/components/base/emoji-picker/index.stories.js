"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const meta = {
    title: 'Base/Data Entry/EmojiPicker',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Modal-based emoji selector that powers the icon picker. Supports search, background swatches, and confirmation callbacks.',
            },
        },
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/apps/demo-app/emoji-picker',
                params: { appId: 'demo-app' },
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
const EmojiPickerDemo = () => {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [selection, setSelection] = (0, react_1.useState)(null);
    return (<div className="flex min-h-[320px] flex-col items-start gap-4 px-6 py-8 md:px-12">
      <button type="button" className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700" onClick={() => setOpen(true)}>
        Open emoji picker…
      </button>

      <div className="rounded-lg border border-divider-subtle bg-components-panel-bg p-4 text-sm text-text-secondary shadow-sm">
        <div className="font-medium text-text-primary">Selection preview</div>
        <pre className="mt-2 max-h-44 overflow-auto rounded-md bg-background-default-subtle p-3 font-mono text-xs leading-tight text-text-primary">
          {selection ? JSON.stringify(selection, null, 2) : 'No emoji selected yet.'}
        </pre>
      </div>

      {open && (<_1.default onSelect={(emoji, background) => {
                setSelection({ emoji, background });
                setOpen(false);
            }} onClose={() => setOpen(false)}/>)}
    </div>);
};
exports.Playground = {
    render: () => <EmojiPickerDemo />,
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
const [open, setOpen] = useState(false)
const [selection, setSelection] = useState<{ emoji: string; background: string } | null>(null)

return (
  <>
    <button onClick={() => setOpen(true)}>Open emoji picker…</button>
    {open && (
      <EmojiPicker
        onSelect={(emoji, background) => {
          setSelection({ emoji, background })
          setOpen(false)
        }}
        onClose={() => setOpen(false)}
      />
    )}
  </>
)
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBMkI7QUFFM0IsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsNkJBQTZCO0lBQ3BDLFNBQVMsRUFBRSxVQUFXO0lBQ3RCLFVBQVUsRUFBRTtRQUNWLE1BQU0sRUFBRSxZQUFZO1FBQ3BCLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsMkhBQTJIO2FBQ3ZJO1NBQ0Y7UUFDRCxNQUFNLEVBQUU7WUFDTixZQUFZLEVBQUUsSUFBSTtZQUNsQixVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLDZCQUE2QjtnQkFDdkMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTthQUM5QjtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDZ0IsQ0FBQTtBQUVwQyxrQkFBZSxJQUFJLENBQUE7QUFHbkIsTUFBTSxlQUFlLEdBQUcsR0FBRyxFQUFFO0lBQzNCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3ZDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUErQyxJQUFJLENBQUMsQ0FBQTtJQUU5RixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtFQUFrRSxDQUMvRTtNQUFBLENBQUMsTUFBTSxDQUNMLElBQUksQ0FBQyxRQUFRLENBQ2IsU0FBUyxDQUFDLG1HQUFtRyxDQUM3RyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FFN0I7O01BQ0YsRUFBRSxNQUFNLENBRVI7O01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBHQUEwRyxDQUN2SDtRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQ3JFO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDJIQUEySCxDQUN4STtVQUFBLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHdCQUF3QixDQUM1RTtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBRUw7O01BQUEsQ0FBQyxJQUFJLElBQUksQ0FDUCxDQUFDLFVBQVcsQ0FDVixRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRTtnQkFDOUIsWUFBWSxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUE7Z0JBQ25DLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoQixDQUFDLENBQUMsQ0FDRixPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDOUIsQ0FDSCxDQUNIO0lBQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRVksUUFBQSxVQUFVLEdBQVU7SUFDL0IsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLEFBQUQsRUFBRztJQUNqQyxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FrQkwsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBFbW9qaVBpY2tlciBmcm9tICcuJ1xuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRGF0YSBFbnRyeS9FbW9qaVBpY2tlcicsXG4gIGNvbXBvbmVudDogRW1vamlQaWNrZXIsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdmdWxsc2NyZWVuJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdNb2RhbC1iYXNlZCBlbW9qaSBzZWxlY3RvciB0aGF0IHBvd2VycyB0aGUgaWNvbiBwaWNrZXIuIFN1cHBvcnRzIHNlYXJjaCwgYmFja2dyb3VuZCBzd2F0Y2hlcywgYW5kIGNvbmZpcm1hdGlvbiBjYWxsYmFja3MuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBuZXh0anM6IHtcbiAgICAgIGFwcERpcmVjdG9yeTogdHJ1ZSxcbiAgICAgIG5hdmlnYXRpb246IHtcbiAgICAgICAgcGF0aG5hbWU6ICcvYXBwcy9kZW1vLWFwcC9lbW9qaS1waWNrZXInLFxuICAgICAgICBwYXJhbXM6IHsgYXBwSWQ6ICdkZW1vLWFwcCcgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgRW1vamlQaWNrZXI+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuY29uc3QgRW1vamlQaWNrZXJEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgW3NlbGVjdGlvbiwgc2V0U2VsZWN0aW9uXSA9IHVzZVN0YXRlPHsgZW1vamk6IHN0cmluZywgYmFja2dyb3VuZDogc3RyaW5nIH0gfCBudWxsPihudWxsKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IG1pbi1oLVszMjBweF0gZmxleC1jb2wgaXRlbXMtc3RhcnQgZ2FwLTQgcHgtNiBweS04IG1kOnB4LTEyXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLW1kIGJnLXByaW1hcnktNjAwIHB4LTQgcHktMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtd2hpdGUgc2hhZG93LXNtIGhvdmVyOmJnLXByaW1hcnktNzAwXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0T3Blbih0cnVlKX1cbiAgICAgID5cbiAgICAgICAgT3BlbiBlbW9qaSBwaWNrZXLigKZcbiAgICAgIDwvYnV0dG9uPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNCB0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnkgc2hhZG93LXNtXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9udC1tZWRpdW0gdGV4dC10ZXh0LXByaW1hcnlcIj5TZWxlY3Rpb24gcHJldmlldzwvZGl2PlxuICAgICAgICA8cHJlIGNsYXNzTmFtZT1cIm10LTIgbWF4LWgtNDQgb3ZlcmZsb3ctYXV0byByb3VuZGVkLW1kIGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGUgcC0zIGZvbnQtbW9ubyB0ZXh0LXhzIGxlYWRpbmctdGlnaHQgdGV4dC10ZXh0LXByaW1hcnlcIj5cbiAgICAgICAgICB7c2VsZWN0aW9uID8gSlNPTi5zdHJpbmdpZnkoc2VsZWN0aW9uLCBudWxsLCAyKSA6ICdObyBlbW9qaSBzZWxlY3RlZCB5ZXQuJ31cbiAgICAgICAgPC9wcmU+XG4gICAgICA8L2Rpdj5cblxuICAgICAge29wZW4gJiYgKFxuICAgICAgICA8RW1vamlQaWNrZXJcbiAgICAgICAgICBvblNlbGVjdD17KGVtb2ppLCBiYWNrZ3JvdW5kKSA9PiB7XG4gICAgICAgICAgICBzZXRTZWxlY3Rpb24oeyBlbW9qaSwgYmFja2dyb3VuZCB9KVxuICAgICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE9wZW4oZmFsc2UpfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPEVtb2ppUGlja2VyRGVtbyAvPixcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbmNvbnN0IFtvcGVuLCBzZXRPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKVxuY29uc3QgW3NlbGVjdGlvbiwgc2V0U2VsZWN0aW9uXSA9IHVzZVN0YXRlPHsgZW1vamk6IHN0cmluZzsgYmFja2dyb3VuZDogc3RyaW5nIH0gfCBudWxsPihudWxsKVxuXG5yZXR1cm4gKFxuICA8PlxuICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0T3Blbih0cnVlKX0+T3BlbiBlbW9qaSBwaWNrZXLigKY8L2J1dHRvbj5cbiAgICB7b3BlbiAmJiAoXG4gICAgICA8RW1vamlQaWNrZXJcbiAgICAgICAgb25TZWxlY3Q9eyhlbW9qaSwgYmFja2dyb3VuZCkgPT4ge1xuICAgICAgICAgIHNldFNlbGVjdGlvbih7IGVtb2ppLCBiYWNrZ3JvdW5kIH0pXG4gICAgICAgICAgc2V0T3BlbihmYWxzZSlcbiAgICAgICAgfX1cbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0T3BlbihmYWxzZSl9XG4gICAgICAvPlxuICAgICl9XG4gIDwvPlxuKVxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cbiJdfQ==