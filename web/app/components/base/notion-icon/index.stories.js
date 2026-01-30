"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultIcon = exports.PageImage = exports.PageEmoji = exports.WorkspaceInitials = exports.WorkspaceIcon = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/General/NotionIcon',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Renders workspace and page icons returned from Notion APIs, falling back to text initials or the default document glyph.',
            },
        },
    },
    tags: ['autodocs'],
    args: {
        type: 'workspace',
        name: 'Knowledge Base',
        src: 'https://cloud.dify.ai/logo/logo.svg',
    },
};
exports.default = meta;
exports.WorkspaceIcon = {
    render: args => (<div className="flex items-center gap-3 rounded-lg border border-divider-subtle bg-components-panel-bg p-4">
      <_1.default {...args}/>
      <span className="text-sm text-text-secondary">Workspace icon pulled from a remote URL.</span>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<NotionIcon
  type="workspace"
  name="Knowledge Base"
  src="https://cloud.dify.ai/logo/logo.svg"
/>`
                    .trim(),
            },
        },
    },
};
exports.WorkspaceInitials = {
    render: args => (<div className="flex items-center gap-3 rounded-lg border border-divider-subtle bg-components-panel-bg p-4">
      <_1.default {...args} src={null} name="Operations"/>
      <span className="text-sm text-text-secondary">Fallback initial rendered when no icon URL is available.</span>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<NotionIcon type="workspace" name="Operations" src={null} />`
                    .trim(),
            },
        },
    },
};
exports.PageEmoji = {
    render: args => (<div className="flex items-center gap-3 rounded-lg border border-divider-subtle bg-components-panel-bg p-4">
      <_1.default {...args} type="page" src={{ type: 'emoji', emoji: '🧠', url: '' }}/>
      <span className="text-sm text-text-secondary">Page-level emoji icon returned by the API.</span>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<NotionIcon type="page" src={{ type: 'emoji', emoji: '🧠' }} />`
                    .trim(),
            },
        },
    },
};
exports.PageImage = {
    render: args => (<div className="flex items-center gap-3 rounded-lg border border-divider-subtle bg-components-panel-bg p-4">
      <_1.default {...args} type="page" src={{ type: 'url', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=80&q=60', emoji: '' }}/>
      <span className="text-sm text-text-secondary">Page icon resolved from an image URL.</span>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<NotionIcon
  type="page"
  src={{ type: 'url', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=80&q=60' }}
/>`
                    .trim(),
            },
        },
    },
};
exports.DefaultIcon = {
    render: args => (<div className="flex items-center gap-3 rounded-lg border border-divider-subtle bg-components-panel-bg p-4">
      <_1.default {...args} type="page" src={undefined}/>
      <span className="text-sm text-text-secondary">When neither emoji nor URL is provided, the generic document icon is shown.</span>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<NotionIcon type="page" src={undefined} />`
                    .trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUEwQjtBQUUxQixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx5QkFBeUI7SUFDaEMsU0FBUyxFQUFFLFVBQVU7SUFDckIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSwwSEFBMEg7YUFDdEk7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxXQUFXO1FBQ2pCLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsR0FBRyxFQUFFLHFDQUFxQztLQUMzQztDQUNnQyxDQUFBO0FBRW5DLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsYUFBYSxHQUFVO0lBQ2xDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ2QsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRGQUE0RixDQUN6RztNQUFBLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQ3JCO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLHdDQUF3QyxFQUFFLElBQUksQ0FDOUY7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7Ozs7R0FLWDtxQkFDUSxJQUFJLEVBQUU7YUFDVjtTQUNGO0tBQ0Y7Q0FDRixDQUFBO0FBRVksUUFBQSxpQkFBaUIsR0FBVTtJQUN0QyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0RkFBNEYsQ0FDekc7TUFBQSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQ2xEO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLHdEQUF3RCxFQUFFLElBQUksQ0FDOUc7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs2REFDK0M7cUJBQ2xELElBQUksRUFBRTthQUNWO1NBQ0Y7S0FDRjtDQUNGLENBQUE7QUFFWSxRQUFBLFNBQVMsR0FBVTtJQUM5QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0RkFBNEYsQ0FDekc7TUFBQSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQy9FO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLDBDQUEwQyxFQUFFLElBQUksQ0FDaEc7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0lBQ0QsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTtnRUFDa0Q7cUJBQ3JELElBQUksRUFBRTthQUNWO1NBQ0Y7S0FDRjtDQUNGLENBQUE7QUFFWSxRQUFBLFNBQVMsR0FBVTtJQUM5QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUNkLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw0RkFBNEYsQ0FDekc7TUFBQSxDQUFDLFVBQVUsQ0FDVCxJQUFJLElBQUksQ0FBQyxDQUNULElBQUksQ0FBQyxNQUFNLENBQ1gsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSw2RkFBNkYsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFFdEk7TUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMscUNBQXFDLEVBQUUsSUFBSSxDQUMzRjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOzs7O0dBSVg7cUJBQ1EsSUFBSSxFQUFFO2FBQ1Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsV0FBVyxHQUFVO0lBQ2hDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ2QsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRGQUE0RixDQUN6RztNQUFBLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFDakQ7TUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsNkJBQTZCLENBQUMsMkVBQTJFLEVBQUUsSUFBSSxDQUNqSTtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOzJDQUM2QjtxQkFDaEMsSUFBSSxFQUFFO2FBQ1Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCBOb3Rpb25JY29uIGZyb20gJy4nXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9HZW5lcmFsL05vdGlvbkljb24nLFxuICBjb21wb25lbnQ6IE5vdGlvbkljb24sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdSZW5kZXJzIHdvcmtzcGFjZSBhbmQgcGFnZSBpY29ucyByZXR1cm5lZCBmcm9tIE5vdGlvbiBBUElzLCBmYWxsaW5nIGJhY2sgdG8gdGV4dCBpbml0aWFscyBvciB0aGUgZGVmYXVsdCBkb2N1bWVudCBnbHlwaC4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ3M6IHtcbiAgICB0eXBlOiAnd29ya3NwYWNlJyxcbiAgICBuYW1lOiAnS25vd2xlZGdlIEJhc2UnLFxuICAgIHNyYzogJ2h0dHBzOi8vY2xvdWQuZGlmeS5haS9sb2dvL2xvZ28uc3ZnJyxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIE5vdGlvbkljb24+XG5cbmV4cG9ydCBkZWZhdWx0IG1ldGFcbnR5cGUgU3RvcnkgPSBTdG9yeU9iajx0eXBlb2YgbWV0YT5cblxuZXhwb3J0IGNvbnN0IFdvcmtzcGFjZUljb246IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC00XCI+XG4gICAgICA8Tm90aW9uSWNvbiB7Li4uYXJnc30gLz5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC10ZXh0LXNlY29uZGFyeVwiPldvcmtzcGFjZSBpY29uIHB1bGxlZCBmcm9tIGEgcmVtb3RlIFVSTC48L3NwYW4+XG4gICAgPC9kaXY+XG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48Tm90aW9uSWNvblxuICB0eXBlPVwid29ya3NwYWNlXCJcbiAgbmFtZT1cIktub3dsZWRnZSBCYXNlXCJcbiAgc3JjPVwiaHR0cHM6Ly9jbG91ZC5kaWZ5LmFpL2xvZ28vbG9nby5zdmdcIlxuLz5gXG4gICAgICAgICAgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IFdvcmtzcGFjZUluaXRpYWxzOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNFwiPlxuICAgICAgPE5vdGlvbkljb24gey4uLmFyZ3N9IHNyYz17bnVsbH0gbmFtZT1cIk9wZXJhdGlvbnNcIiAvPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+RmFsbGJhY2sgaW5pdGlhbCByZW5kZXJlZCB3aGVuIG5vIGljb24gVVJMIGlzIGF2YWlsYWJsZS48L3NwYW4+XG4gICAgPC9kaXY+XG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48Tm90aW9uSWNvbiB0eXBlPVwid29ya3NwYWNlXCIgbmFtZT1cIk9wZXJhdGlvbnNcIiBzcmM9e251bGx9IC8+YFxuICAgICAgICAgIC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBQYWdlRW1vamk6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWNvbXBvbmVudHMtcGFuZWwtYmcgcC00XCI+XG4gICAgICA8Tm90aW9uSWNvbiB7Li4uYXJnc30gdHlwZT1cInBhZ2VcIiBzcmM9e3sgdHlwZTogJ2Vtb2ppJywgZW1vamk6ICfwn6egJywgdXJsOiAnJyB9fSAvPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+UGFnZS1sZXZlbCBlbW9qaSBpY29uIHJldHVybmVkIGJ5IHRoZSBBUEkuPC9zcGFuPlxuICAgIDwvZGl2PlxuICApLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPE5vdGlvbkljb24gdHlwZT1cInBhZ2VcIiBzcmM9e3sgdHlwZTogJ2Vtb2ppJywgZW1vamk6ICfwn6egJyB9fSAvPmBcbiAgICAgICAgICAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgUGFnZUltYWdlOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNFwiPlxuICAgICAgPE5vdGlvbkljb25cbiAgICAgICAgey4uLmFyZ3N9XG4gICAgICAgIHR5cGU9XCJwYWdlXCJcbiAgICAgICAgc3JjPXt7IHR5cGU6ICd1cmwnLCB1cmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUyMTczNzYwNDg5My1kMTRjYzIzN2YxMWQ/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MCZxPTYwJywgZW1vamk6ICcnIH19XG4gICAgICAvPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+UGFnZSBpY29uIHJlc29sdmVkIGZyb20gYW4gaW1hZ2UgVVJMLjwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbjxOb3Rpb25JY29uXG4gIHR5cGU9XCJwYWdlXCJcbiAgc3JjPXt7IHR5cGU6ICd1cmwnLCB1cmw6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTUyMTczNzYwNDg5My1kMTRjYzIzN2YxMWQ/YXV0bz1mb3JtYXQmZml0PWNyb3Amdz04MCZxPTYwJyB9fVxuLz5gXG4gICAgICAgICAgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IERlZmF1bHRJY29uOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNFwiPlxuICAgICAgPE5vdGlvbkljb24gey4uLmFyZ3N9IHR5cGU9XCJwYWdlXCIgc3JjPXt1bmRlZmluZWR9IC8+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtdGV4dC1zZWNvbmRhcnlcIj5XaGVuIG5laXRoZXIgZW1vamkgbm9yIFVSTCBpcyBwcm92aWRlZCwgdGhlIGdlbmVyaWMgZG9jdW1lbnQgaWNvbiBpcyBzaG93bi48L3NwYW4+XG4gICAgPC9kaXY+XG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48Tm90aW9uSWNvbiB0eXBlPVwicGFnZVwiIHNyYz17dW5kZWZpbmVkfSAvPmBcbiAgICAgICAgICAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuIl19