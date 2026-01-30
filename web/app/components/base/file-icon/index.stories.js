"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = exports.Default = void 0;
const _1 = require(".");
const meta = {
    title: 'Base/General/FileIcon',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'Maps a file extension to the appropriate SVG icon used across upload and attachment surfaces.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'text',
            description: 'File extension or identifier used to resolve the icon.',
        },
        className: {
            control: 'text',
            description: 'Custom classes passed to the SVG wrapper.',
        },
    },
    args: {
        type: 'pdf',
        className: 'h-10 w-10',
    },
};
exports.default = meta;
exports.Default = {
    render: args => (<div className="flex items-center gap-4 rounded-lg border border-divider-subtle bg-components-panel-bg p-4">
      <_1.default {...args}/>
      <span className="text-sm text-text-secondary">
        Extension:
        {args.type}
      </span>
    </div>),
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
<FileIcon type="pdf" className="h-10 w-10" />
        `.trim(),
            },
        },
    },
};
exports.Gallery = {
    render: () => {
        const examples = ['pdf', 'docx', 'xlsx', 'csv', 'json', 'md', 'txt', 'html', 'notion', 'unknown'];
        return (<div className="grid grid-cols-5 gap-4 rounded-lg border border-divider-subtle bg-components-panel-bg p-4">
        {examples.map(type => (<div key={type} className="flex flex-col items-center gap-1">
            <_1.default type={type} className="h-9 w-9"/>
            <span className="text-xs uppercase text-text-tertiary">{type}</span>
          </div>))}
      </div>);
    },
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
{['pdf','docx','xlsx','csv','json','md','txt','html','notion','unknown'].map(type => (
  <FileIcon key={type} type={type} className="h-9 w-9" />
))}
        `.trim(),
            },
        },
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUF3QjtBQUV4QixNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx1QkFBdUI7SUFDOUIsU0FBUyxFQUFFLFVBQVE7SUFDbkIsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSwrRkFBK0Y7YUFDM0c7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLHdEQUF3RDtTQUN0RTtRQUNELFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLDJDQUEyQztTQUN6RDtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFLEtBQUs7UUFDWCxTQUFTLEVBQUUsV0FBVztLQUN2QjtDQUM4QixDQUFBO0FBRWpDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsT0FBTyxHQUFVO0lBQzVCLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ2QsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRGQUE0RixDQUN6RztNQUFBLENBQUMsVUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQ25CO01BQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUMzQzs7UUFDQSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQ1o7TUFBQSxFQUFFLElBQUksQ0FDUjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsSUFBSSxFQUFFOztTQUVMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsT0FBTyxHQUFVO0lBQzVCLE1BQU0sRUFBRSxHQUFHLEVBQUU7UUFDWCxNQUFNLFFBQVEsR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBQ2pHLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMkZBQTJGLENBQ3hHO1FBQUEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FDcEIsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUMxRDtZQUFBLENBQUMsVUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQ3pDO1lBQUEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUNyRTtVQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQyxDQUNKO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUCxDQUFBO0lBQ0gsQ0FBQztJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7U0FJTCxDQUFDLElBQUksRUFBRTthQUNUO1NBQ0Y7S0FDRjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgRmlsZUljb24gZnJvbSAnLidcblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0dlbmVyYWwvRmlsZUljb24nLFxuICBjb21wb25lbnQ6IEZpbGVJY29uLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnTWFwcyBhIGZpbGUgZXh0ZW5zaW9uIHRvIHRoZSBhcHByb3ByaWF0ZSBTVkcgaWNvbiB1c2VkIGFjcm9zcyB1cGxvYWQgYW5kIGF0dGFjaG1lbnQgc3VyZmFjZXMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdUeXBlczoge1xuICAgIHR5cGU6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRmlsZSBleHRlbnNpb24gb3IgaWRlbnRpZmllciB1c2VkIHRvIHJlc29sdmUgdGhlIGljb24uJyxcbiAgICB9LFxuICAgIGNsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdDdXN0b20gY2xhc3NlcyBwYXNzZWQgdG8gdGhlIFNWRyB3cmFwcGVyLicsXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHR5cGU6ICdwZGYnLFxuICAgIGNsYXNzTmFtZTogJ2gtMTAgdy0xMCcsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBGaWxlSWNvbj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTRcIj5cbiAgICAgIDxGaWxlSWNvbiB7Li4uYXJnc30gLz5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC10ZXh0LXNlY29uZGFyeVwiPlxuICAgICAgICBFeHRlbnNpb246XG4gICAgICAgIHthcmdzLnR5cGV9XG4gICAgICA8L3NwYW4+XG4gICAgPC9kaXY+XG4gICksXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBkb2NzOiB7XG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgbGFuZ3VhZ2U6ICd0c3gnLFxuICAgICAgICBjb2RlOiBgXG48RmlsZUljb24gdHlwZT1cInBkZlwiIGNsYXNzTmFtZT1cImgtMTAgdy0xMFwiIC8+XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgR2FsbGVyeTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4ge1xuICAgIGNvbnN0IGV4YW1wbGVzID0gWydwZGYnLCAnZG9jeCcsICd4bHN4JywgJ2NzdicsICdqc29uJywgJ21kJywgJ3R4dCcsICdodG1sJywgJ25vdGlvbicsICd1bmtub3duJ11cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy01IGdhcC00IHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNFwiPlxuICAgICAgICB7ZXhhbXBsZXMubWFwKHR5cGUgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXt0eXBlfSBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxuICAgICAgICAgICAgPEZpbGVJY29uIHR5cGU9e3R5cGV9IGNsYXNzTmFtZT1cImgtOSB3LTlcIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB1cHBlcmNhc2UgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+e3R5cGV9PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbntbJ3BkZicsJ2RvY3gnLCd4bHN4JywnY3N2JywnanNvbicsJ21kJywndHh0JywnaHRtbCcsJ25vdGlvbicsJ3Vua25vd24nXS5tYXAodHlwZSA9PiAoXG4gIDxGaWxlSWNvbiBrZXk9e3R5cGV9IHR5cGU9e3R5cGV9IGNsYXNzTmFtZT1cImgtOSB3LTlcIiAvPlxuKSl9XG4gICAgICAgIGAudHJpbSgpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufVxuIl19