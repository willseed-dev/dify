"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadStates = exports.Playground = void 0;
const react_1 = require("react");
const types_1 = require("@/app/components/workflow/types");
const app_1 = require("@/types/app");
const file_list_1 = require("./file-uploader-in-chat-input/file-list");
const SAMPLE_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\'><rect width=\'160\' height=\'160\' rx=\'16\' fill=\'#D1E9FF\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'20\' fill=\'#1F2937\'>IMG</text></svg>';
const filesSample = [
    {
        id: '1',
        name: 'Project Brief.pdf',
        size: 256000,
        type: 'application/pdf',
        progress: 100,
        transferMethod: app_1.TransferMethod.local_file,
        supportFileType: types_1.SupportUploadFileTypes.document,
        url: '',
    },
    {
        id: '2',
        name: 'Design.png',
        size: 128000,
        type: 'image/png',
        progress: 100,
        transferMethod: app_1.TransferMethod.local_file,
        supportFileType: types_1.SupportUploadFileTypes.image,
        base64Url: SAMPLE_IMAGE,
    },
    {
        id: '3',
        name: 'Voiceover.mp3',
        size: 512000,
        type: 'audio/mpeg',
        progress: 45,
        transferMethod: app_1.TransferMethod.remote_url,
        supportFileType: types_1.SupportUploadFileTypes.audio,
        url: '',
    },
];
const meta = {
    title: 'Base/Data Display/FileList',
    component: file_list_1.FileList,
    parameters: {
        docs: {
            description: {
                component: 'Renders a responsive gallery of uploaded files, handling icons, previews, and progress states.',
            },
        },
    },
    tags: ['autodocs'],
    args: {
        files: filesSample,
    },
};
exports.default = meta;
const FileListPlayground = (args) => {
    const [items, setItems] = (0, react_1.useState)(args.files || []);
    return (<div className="rounded-2xl border border-divider-subtle bg-components-panel-bg p-4">
      <file_list_1.FileList {...args} files={items} onRemove={fileId => setItems(list => list.filter(file => file.id !== fileId))}/>
    </div>);
};
exports.Playground = {
    render: args => <FileListPlayground {...args}/>,
    parameters: {
        docs: {
            source: {
                language: 'tsx',
                code: `
const [files, setFiles] = useState(initialFiles)

<FileList files={files} onRemove={(id) => setFiles(list => list.filter(file => file.id !== id))} />
        `.trim(),
            },
        },
    },
};
exports.UploadStates = {
    args: {
        files: filesSample.map(file => ({ ...file, progress: file.id === '3' ? 45 : 100 })),
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1saXN0LnN0b3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlLWxpc3Quc3Rvcmllcy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsaUNBQWdDO0FBQ2hDLDJEQUF3RTtBQUN4RSxxQ0FBNEM7QUFDNUMsdUVBQWtFO0FBRWxFLE1BQU0sWUFBWSxHQUFHLDJUQUEyVCxDQUFBO0FBRWhWLE1BQU0sV0FBVyxHQUFpQjtJQUNoQztRQUNFLEVBQUUsRUFBRSxHQUFHO1FBQ1AsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsUUFBUSxFQUFFLEdBQUc7UUFDYixjQUFjLEVBQUUsb0JBQWMsQ0FBQyxVQUFVO1FBQ3pDLGVBQWUsRUFBRSw4QkFBc0IsQ0FBQyxRQUFRO1FBQ2hELEdBQUcsRUFBRSxFQUFFO0tBQ1I7SUFDRDtRQUNFLEVBQUUsRUFBRSxHQUFHO1FBQ1AsSUFBSSxFQUFFLFlBQVk7UUFDbEIsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsV0FBVztRQUNqQixRQUFRLEVBQUUsR0FBRztRQUNiLGNBQWMsRUFBRSxvQkFBYyxDQUFDLFVBQVU7UUFDekMsZUFBZSxFQUFFLDhCQUFzQixDQUFDLEtBQUs7UUFDN0MsU0FBUyxFQUFFLFlBQVk7S0FDeEI7SUFDRDtRQUNFLEVBQUUsRUFBRSxHQUFHO1FBQ1AsSUFBSSxFQUFFLGVBQWU7UUFDckIsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsWUFBWTtRQUNsQixRQUFRLEVBQUUsRUFBRTtRQUNaLGNBQWMsRUFBRSxvQkFBYyxDQUFDLFVBQVU7UUFDekMsZUFBZSxFQUFFLDhCQUFzQixDQUFDLEtBQUs7UUFDN0MsR0FBRyxFQUFFLEVBQUU7S0FDUjtDQUNGLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSw0QkFBNEI7SUFDbkMsU0FBUyxFQUFFLG9CQUFRO0lBQ25CLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsZ0dBQWdHO2FBQzVHO1NBQ0Y7S0FDRjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsV0FBVztLQUNuQjtDQUM4QixDQUFBO0FBRWpDLGtCQUFlLElBQUksQ0FBQTtBQUduQixNQUFNLGtCQUFrQixHQUFHLENBQUMsSUFBMkMsRUFBRSxFQUFFO0lBQ3pFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFlLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUE7SUFFbEUsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxRUFBcUUsQ0FDbEY7TUFBQSxDQUFDLG9CQUFRLENBQ1AsSUFBSSxJQUFJLENBQUMsQ0FDVCxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDYixRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFFbEY7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFWSxRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLElBQUksSUFBSSxDQUFDLEVBQUc7SUFDaEQsVUFBVSxFQUFFO1FBQ1YsSUFBSSxFQUFFO1lBQ0osTUFBTSxFQUFFO2dCQUNOLFFBQVEsRUFBRSxLQUFLO2dCQUNmLElBQUksRUFBRTs7OztTQUlMLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsWUFBWSxHQUFVO0lBQ2pDLElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3BGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB0eXBlIHsgRmlsZUVudGl0eSB9IGZyb20gJy4vdHlwZXMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgU3VwcG9ydFVwbG9hZEZpbGVUeXBlcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IHsgRmlsZUxpc3QgfSBmcm9tICcuL2ZpbGUtdXBsb2FkZXItaW4tY2hhdC1pbnB1dC9maWxlLWxpc3QnXG5cbmNvbnN0IFNBTVBMRV9JTUFHRSA9ICdkYXRhOmltYWdlL3N2Zyt4bWw7dXRmOCw8c3ZnIHhtbG5zPVxcJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFwnIHdpZHRoPVxcJzE2MFxcJyBoZWlnaHQ9XFwnMTYwXFwnPjxyZWN0IHdpZHRoPVxcJzE2MFxcJyBoZWlnaHQ9XFwnMTYwXFwnIHJ4PVxcJzE2XFwnIGZpbGw9XFwnI0QxRTlGRlxcJy8+PHRleHQgeD1cXCc1MCVcXCcgeT1cXCc1MCVcXCcgZG9taW5hbnQtYmFzZWxpbmU9XFwnbWlkZGxlXFwnIHRleHQtYW5jaG9yPVxcJ21pZGRsZVxcJyBmb250LWZhbWlseT1cXCdzYW5zLXNlcmlmXFwnIGZvbnQtc2l6ZT1cXCcyMFxcJyBmaWxsPVxcJyMxRjI5MzdcXCc+SU1HPC90ZXh0Pjwvc3ZnPidcblxuY29uc3QgZmlsZXNTYW1wbGU6IEZpbGVFbnRpdHlbXSA9IFtcbiAge1xuICAgIGlkOiAnMScsXG4gICAgbmFtZTogJ1Byb2plY3QgQnJpZWYucGRmJyxcbiAgICBzaXplOiAyNTYwMDAsXG4gICAgdHlwZTogJ2FwcGxpY2F0aW9uL3BkZicsXG4gICAgcHJvZ3Jlc3M6IDEwMCxcbiAgICB0cmFuc2Zlck1ldGhvZDogVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSxcbiAgICBzdXBwb3J0RmlsZVR5cGU6IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMuZG9jdW1lbnQsXG4gICAgdXJsOiAnJyxcbiAgfSxcbiAge1xuICAgIGlkOiAnMicsXG4gICAgbmFtZTogJ0Rlc2lnbi5wbmcnLFxuICAgIHNpemU6IDEyODAwMCxcbiAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICBwcm9ncmVzczogMTAwLFxuICAgIHRyYW5zZmVyTWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlLFxuICAgIHN1cHBvcnRGaWxlVHlwZTogU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5pbWFnZSxcbiAgICBiYXNlNjRVcmw6IFNBTVBMRV9JTUFHRSxcbiAgfSxcbiAge1xuICAgIGlkOiAnMycsXG4gICAgbmFtZTogJ1ZvaWNlb3Zlci5tcDMnLFxuICAgIHNpemU6IDUxMjAwMCxcbiAgICB0eXBlOiAnYXVkaW8vbXBlZycsXG4gICAgcHJvZ3Jlc3M6IDQ1LFxuICAgIHRyYW5zZmVyTWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5yZW1vdGVfdXJsLFxuICAgIHN1cHBvcnRGaWxlVHlwZTogU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5hdWRpbyxcbiAgICB1cmw6ICcnLFxuICB9LFxuXVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRGF0YSBEaXNwbGF5L0ZpbGVMaXN0JyxcbiAgY29tcG9uZW50OiBGaWxlTGlzdCxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1JlbmRlcnMgYSByZXNwb25zaXZlIGdhbGxlcnkgb2YgdXBsb2FkZWQgZmlsZXMsIGhhbmRsaW5nIGljb25zLCBwcmV2aWV3cywgYW5kIHByb2dyZXNzIHN0YXRlcy4nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ3M6IHtcbiAgICBmaWxlczogZmlsZXNTYW1wbGUsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBGaWxlTGlzdD5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5jb25zdCBGaWxlTGlzdFBsYXlncm91bmQgPSAoYXJnczogUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIEZpbGVMaXN0PikgPT4ge1xuICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9IHVzZVN0YXRlPEZpbGVFbnRpdHlbXT4oYXJncy5maWxlcyB8fCBbXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC0yeGwgYm9yZGVyIGJvcmRlci1kaXZpZGVyLXN1YnRsZSBiZy1jb21wb25lbnRzLXBhbmVsLWJnIHAtNFwiPlxuICAgICAgPEZpbGVMaXN0XG4gICAgICAgIHsuLi5hcmdzfVxuICAgICAgICBmaWxlcz17aXRlbXN9XG4gICAgICAgIG9uUmVtb3ZlPXtmaWxlSWQgPT4gc2V0SXRlbXMobGlzdCA9PiBsaXN0LmZpbHRlcihmaWxlID0+IGZpbGUuaWQgIT09IGZpbGVJZCkpfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7XG4gIHJlbmRlcjogYXJncyA9PiA8RmlsZUxpc3RQbGF5Z3JvdW5kIHsuLi5hcmdzfSAvPixcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIHNvdXJjZToge1xuICAgICAgICBsYW5ndWFnZTogJ3RzeCcsXG4gICAgICAgIGNvZGU6IGBcbmNvbnN0IFtmaWxlcywgc2V0RmlsZXNdID0gdXNlU3RhdGUoaW5pdGlhbEZpbGVzKVxuXG48RmlsZUxpc3QgZmlsZXM9e2ZpbGVzfSBvblJlbW92ZT17KGlkKSA9PiBzZXRGaWxlcyhsaXN0ID0+IGxpc3QuZmlsdGVyKGZpbGUgPT4gZmlsZS5pZCAhPT0gaWQpKX0gLz5cbiAgICAgICAgYC50cmltKCksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBVcGxvYWRTdGF0ZXM6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgZmlsZXM6IGZpbGVzU2FtcGxlLm1hcChmaWxlID0+ICh7IC4uLmZpbGUsIHByb2dyZXNzOiBmaWxlLmlkID09PSAnMycgPyA0NSA6IDEwMCB9KSksXG4gIH0sXG59XG4iXX0=