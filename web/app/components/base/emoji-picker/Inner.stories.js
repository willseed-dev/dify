"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const Inner_1 = require("./Inner");
const meta = {
    title: 'Base/Data Entry/EmojiPickerInner',
    component: Inner_1.default,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Core emoji grid with search and style swatches. Use this when embedding the selector inline without a modal frame.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
const InnerDemo = () => {
    const [selection, setSelection] = (0, react_1.useState)(null);
    return (<div className="flex h-[520px] flex-col gap-4 rounded-xl border border-divider-subtle bg-components-panel-bg p-6 shadow-lg">
      <Inner_1.default onSelect={(emoji, background) => setSelection({ emoji, background })} className="flex-1 overflow-hidden rounded-xl border border-divider-subtle bg-white"/>
      <div className="rounded-lg border border-divider-subtle bg-background-default-subtle p-3 text-xs text-text-secondary">
        <div className="font-medium text-text-primary">Latest selection</div>
        <pre className="mt-1 max-h-40 overflow-auto font-mono">
          {selection ? JSON.stringify(selection, null, 2) : 'Tap an emoji to set background options.'}
        </pre>
      </div>
    </div>);
};
exports.Playground = {
    render: () => <InnerDemo />,
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
const [selection, setSelection] = useState<{ emoji: string; background: string } | null>(null)

return (
  <EmojiPickerInner onSelect={(emoji, background) => setSelection({ emoji, background })} />
)
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5uZXIuc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIklubmVyLnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyxtQ0FBc0M7QUFFdEMsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsa0NBQWtDO0lBQ3pDLFNBQVMsRUFBRSxlQUFnQjtJQUMzQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsWUFBWTtRQUNwQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLG9IQUFvSDthQUNoSTtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7Q0FDcUIsQ0FBQTtBQUV6QyxrQkFBZSxJQUFJLENBQUE7QUFHbkIsTUFBTSxTQUFTLEdBQUcsR0FBRyxFQUFFO0lBQ3JCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUErQyxJQUFJLENBQUMsQ0FBQTtJQUU5RixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRHQUE0RyxDQUN6SDtNQUFBLENBQUMsZUFBZ0IsQ0FDZixRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQ3JFLFNBQVMsQ0FBQyx5RUFBeUUsRUFFckY7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsc0dBQXNHLENBQ25IO1FBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLCtCQUErQixDQUFDLGdCQUFnQixFQUFFLEdBQUcsQ0FDcEU7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsdUNBQXVDLENBQ3BEO1VBQUEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMseUNBQXlDLENBQzdGO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVZLFFBQUEsVUFBVSxHQUFVO0lBQy9CLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxBQUFELEVBQUc7SUFDM0IsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7Ozs7O1NBTUwsQ0FBQyxJQUFJLEVBQUU7YUFDVDtTQUNGO0tBQ0Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBFbW9qaVBpY2tlcklubmVyIGZyb20gJy4vSW5uZXInXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIEVudHJ5L0Vtb2ppUGlja2VySW5uZXInLFxuICBjb21wb25lbnQ6IEVtb2ppUGlja2VySW5uZXIsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdmdWxsc2NyZWVuJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdDb3JlIGVtb2ppIGdyaWQgd2l0aCBzZWFyY2ggYW5kIHN0eWxlIHN3YXRjaGVzLiBVc2UgdGhpcyB3aGVuIGVtYmVkZGluZyB0aGUgc2VsZWN0b3IgaW5saW5lIHdpdGhvdXQgYSBtb2RhbCBmcmFtZS4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBFbW9qaVBpY2tlcklubmVyPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmNvbnN0IElubmVyRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW3NlbGVjdGlvbiwgc2V0U2VsZWN0aW9uXSA9IHVzZVN0YXRlPHsgZW1vamk6IHN0cmluZywgYmFja2dyb3VuZDogc3RyaW5nIH0gfCBudWxsPihudWxsKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtWzUyMHB4XSBmbGV4LWNvbCBnYXAtNCByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTYgc2hhZG93LWxnXCI+XG4gICAgICA8RW1vamlQaWNrZXJJbm5lclxuICAgICAgICBvblNlbGVjdD17KGVtb2ppLCBiYWNrZ3JvdW5kKSA9PiBzZXRTZWxlY3Rpb24oeyBlbW9qaSwgYmFja2dyb3VuZCB9KX1cbiAgICAgICAgY2xhc3NOYW1lPVwiZmxleC0xIG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctd2hpdGVcIlxuICAgICAgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGUgcC0zIHRleHQteHMgdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvbnQtbWVkaXVtIHRleHQtdGV4dC1wcmltYXJ5XCI+TGF0ZXN0IHNlbGVjdGlvbjwvZGl2PlxuICAgICAgICA8cHJlIGNsYXNzTmFtZT1cIm10LTEgbWF4LWgtNDAgb3ZlcmZsb3ctYXV0byBmb250LW1vbm9cIj5cbiAgICAgICAgICB7c2VsZWN0aW9uID8gSlNPTi5zdHJpbmdpZnkoc2VsZWN0aW9uLCBudWxsLCAyKSA6ICdUYXAgYW4gZW1vamkgdG8gc2V0IGJhY2tncm91bmQgb3B0aW9ucy4nfVxuICAgICAgICA8L3ByZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiAoKSA9PiA8SW5uZXJEZW1vIC8+LFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuY29uc3QgW3NlbGVjdGlvbiwgc2V0U2VsZWN0aW9uXSA9IHVzZVN0YXRlPHsgZW1vamk6IHN0cmluZzsgYmFja2dyb3VuZDogc3RyaW5nIH0gfCBudWxsPihudWxsKVxuXG5yZXR1cm4gKFxuICA8RW1vamlQaWNrZXJJbm5lciBvblNlbGVjdD17KGVtb2ppLCBiYWNrZ3JvdW5kKSA9PiBzZXRTZWxlY3Rpb24oeyBlbW9qaSwgYmFja2dyb3VuZCB9KX0gLz5cbilcbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59XG4iXX0=