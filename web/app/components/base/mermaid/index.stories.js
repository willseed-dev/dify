"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const _1 = require(".");
const SAMPLE = `
flowchart LR
  A[User Message] --> B{Agent decides}
  B -->|Needs tool| C[Search Tool]
  C --> D[Combine result]
  B -->|Direct answer| D
  D --> E[Send response]
`;
const MermaidDemo = ({ theme = 'light', }) => {
    const [currentTheme, setCurrentTheme] = (0, react_1.useState)(theme);
    return (<div className="flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-divider-subtle bg-components-panel-bg p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-text-tertiary">
        <span>Mermaid diagram</span>
        <button type="button" className="rounded-md border border-divider-subtle bg-background-default px-3 py-1 text-xs font-medium text-text-secondary hover:bg-state-base-hover" onClick={() => setCurrentTheme(prev => (prev === 'light' ? 'dark' : 'light'))}>
          Toggle theme
        </button>
      </div>
      <_1.default PrimitiveCode={SAMPLE.trim()} theme={currentTheme}/>
    </div>);
};
const meta = {
    title: 'Base/Data Display/Mermaid',
    component: MermaidDemo,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Mermaid renderer with custom theme toggle and caching. Useful for visualizing agent flows.',
            },
        },
    },
    argTypes: {
        theme: {
            control: 'inline-radio',
            options: ['light', 'dark'],
        },
    },
    args: {
        theme: 'light',
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUNoQyx3QkFBeUI7QUFFekIsTUFBTSxNQUFNLEdBQUc7Ozs7Ozs7Q0FPZCxDQUFBO0FBRUQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxFQUNuQixLQUFLLEdBQUcsT0FBTyxHQUdoQixFQUFFLEVBQUU7SUFDSCxNQUFNLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBbUIsS0FBSyxDQUFDLENBQUE7SUFFekUsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwR0FBMEcsQ0FDdkg7TUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMEZBQTBGLENBQ3ZHO1FBQUEsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FDM0I7UUFBQSxDQUFDLE1BQU0sQ0FDTCxJQUFJLENBQUMsUUFBUSxDQUNiLFNBQVMsQ0FBQywySUFBMkksQ0FDckosT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FFOUU7O1FBQ0YsRUFBRSxNQUFNLENBQ1Y7TUFBQSxFQUFFLEdBQUcsQ0FDTDtNQUFBLENBQUMsVUFBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUMvRDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLDJCQUEyQjtJQUNsQyxTQUFTLEVBQUUsV0FBVztJQUN0QixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLDRGQUE0RjthQUN4RztTQUNGO0tBQ0Y7SUFDRCxRQUFRLEVBQUU7UUFDUixLQUFLLEVBQUU7WUFDTCxPQUFPLEVBQUUsY0FBYztZQUN2QixPQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1NBQzNCO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsT0FBTztLQUNmO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ2dCLENBQUE7QUFFcEMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxVQUFVLEdBQVUsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBGbG93Y2hhcnQgZnJvbSAnLidcblxuY29uc3QgU0FNUExFID0gYFxuZmxvd2NoYXJ0IExSXG4gIEFbVXNlciBNZXNzYWdlXSAtLT4gQntBZ2VudCBkZWNpZGVzfVxuICBCIC0tPnxOZWVkcyB0b29sfCBDW1NlYXJjaCBUb29sXVxuICBDIC0tPiBEW0NvbWJpbmUgcmVzdWx0XVxuICBCIC0tPnxEaXJlY3QgYW5zd2VyfCBEXG4gIEQgLS0+IEVbU2VuZCByZXNwb25zZV1cbmBcblxuY29uc3QgTWVybWFpZERlbW8gPSAoe1xuICB0aGVtZSA9ICdsaWdodCcsXG59OiB7XG4gIHRoZW1lPzogJ2xpZ2h0JyB8ICdkYXJrJ1xufSkgPT4ge1xuICBjb25zdCBbY3VycmVudFRoZW1lLCBzZXRDdXJyZW50VGhlbWVdID0gdXNlU3RhdGU8J2xpZ2h0JyB8ICdkYXJrJz4odGhlbWUpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggdy1mdWxsIG1heC13LTN4bCBmbGV4LWNvbCBnYXAtNCByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC02XCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy1bMC4xOGVtXSB0ZXh0LXRleHQtdGVydGlhcnlcIj5cbiAgICAgICAgPHNwYW4+TWVybWFpZCBkaWFncmFtPC9zcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1tZCBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdCBweC0zIHB5LTEgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LXRleHQtc2Vjb25kYXJ5IGhvdmVyOmJnLXN0YXRlLWJhc2UtaG92ZXJcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEN1cnJlbnRUaGVtZShwcmV2ID0+IChwcmV2ID09PSAnbGlnaHQnID8gJ2RhcmsnIDogJ2xpZ2h0JykpfVxuICAgICAgICA+XG4gICAgICAgICAgVG9nZ2xlIHRoZW1lXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8Rmxvd2NoYXJ0IFByaW1pdGl2ZUNvZGU9e1NBTVBMRS50cmltKCl9IHRoZW1lPXtjdXJyZW50VGhlbWV9IC8+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRGlzcGxheS9NZXJtYWlkJyxcbiAgY29tcG9uZW50OiBNZXJtYWlkRGVtbyxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2NlbnRlcmVkJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdNZXJtYWlkIHJlbmRlcmVyIHdpdGggY3VzdG9tIHRoZW1lIHRvZ2dsZSBhbmQgY2FjaGluZy4gVXNlZnVsIGZvciB2aXN1YWxpemluZyBhZ2VudCBmbG93cy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBhcmdUeXBlczoge1xuICAgIHRoZW1lOiB7XG4gICAgICBjb250cm9sOiAnaW5saW5lLXJhZGlvJyxcbiAgICAgIG9wdGlvbnM6IFsnbGlnaHQnLCAnZGFyayddLFxuICAgIH0sXG4gIH0sXG4gIGFyZ3M6IHtcbiAgICB0aGVtZTogJ2xpZ2h0JyxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgTWVybWFpZERlbW8+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge31cbiJdfQ==