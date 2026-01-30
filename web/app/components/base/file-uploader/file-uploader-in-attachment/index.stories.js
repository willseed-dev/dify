"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disabled = exports.Playground = void 0;
const react_1 = require("react");
const test_1 = require("storybook/test");
const types_1 = require("@/app/components/base/features/types");
const toast_1 = require("@/app/components/base/toast");
const types_2 = require("@/app/components/workflow/types");
const app_1 = require("@/types/app");
const index_1 = require("./index");
const SAMPLE_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'128\' height=\'128\'><rect width=\'128\' height=\'128\' rx=\'16\' fill=\'#E0F2FE\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' font-size=\'18\' fill=\'#1F2937\'>IMG</text></svg>';
const mockFiles = [
    {
        id: 'file-1',
        name: 'Requirements.pdf',
        size: 256000,
        type: 'application/pdf',
        progress: 100,
        transferMethod: app_1.TransferMethod.local_file,
        supportFileType: types_2.SupportUploadFileTypes.document,
        url: '',
    },
    {
        id: 'file-2',
        name: 'Interface.png',
        size: 128000,
        type: 'image/png',
        progress: 100,
        transferMethod: app_1.TransferMethod.local_file,
        supportFileType: types_2.SupportUploadFileTypes.image,
        base64Url: SAMPLE_IMAGE,
    },
    {
        id: 'file-3',
        name: 'Voiceover.mp3',
        size: 512000,
        type: 'audio/mpeg',
        progress: 35,
        transferMethod: app_1.TransferMethod.remote_url,
        supportFileType: types_2.SupportUploadFileTypes.audio,
        url: '',
    },
];
const fileConfig = {
    enabled: true,
    allowed_file_upload_methods: [app_1.TransferMethod.local_file, app_1.TransferMethod.remote_url],
    allowed_file_types: ['document', 'image', 'audio'],
    number_limits: 5,
    preview_config: { mode: types_1.PreviewMode.NewPage, file_type_list: ['pdf', 'png'] },
};
const meta = {
    title: 'Base/Data Entry/FileUploaderInAttachment',
    component: index_1.default,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Attachment-style uploader that supports local files and remote links. Demonstrates upload progress, re-upload, and preview actions.',
            },
        },
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/apps/demo-app/uploads',
                params: { appId: 'demo-app' },
            },
        },
    },
    tags: ['autodocs'],
    args: {
        fileConfig,
    },
};
exports.default = meta;
const AttachmentDemo = (props) => {
    const [files, setFiles] = (0, react_1.useState)(mockFiles);
    return (<toast_1.ToastProvider>
      <div className="w-[320px] rounded-2xl border border-divider-subtle bg-components-panel-bg p-4 shadow-xs">
        <index_1.default {...props} value={files} onChange={setFiles}/>
      </div>
    </toast_1.ToastProvider>);
};
exports.Playground = {
    render: args => <AttachmentDemo {...args}/>,
    args: {
        onChange: (0, test_1.fn)(),
    },
};
exports.Disabled = {
    render: args => <AttachmentDemo {...args} isDisabled/>,
    args: {
        onChange: (0, test_1.fn)(),
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLGlDQUFnQztBQUNoQyx5Q0FBbUM7QUFDbkMsZ0VBQWtFO0FBQ2xFLHVEQUEyRDtBQUMzRCwyREFBd0U7QUFDeEUscUNBQTRDO0FBQzVDLG1DQUFxRDtBQUVyRCxNQUFNLFlBQVksR0FBRywyVEFBMlQsQ0FBQTtBQUVoVixNQUFNLFNBQVMsR0FBaUI7SUFDOUI7UUFDRSxFQUFFLEVBQUUsUUFBUTtRQUNaLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsaUJBQWlCO1FBQ3ZCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsY0FBYyxFQUFFLG9CQUFjLENBQUMsVUFBVTtRQUN6QyxlQUFlLEVBQUUsOEJBQXNCLENBQUMsUUFBUTtRQUNoRCxHQUFHLEVBQUUsRUFBRTtLQUNSO0lBQ0Q7UUFDRSxFQUFFLEVBQUUsUUFBUTtRQUNaLElBQUksRUFBRSxlQUFlO1FBQ3JCLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFdBQVc7UUFDakIsUUFBUSxFQUFFLEdBQUc7UUFDYixjQUFjLEVBQUUsb0JBQWMsQ0FBQyxVQUFVO1FBQ3pDLGVBQWUsRUFBRSw4QkFBc0IsQ0FBQyxLQUFLO1FBQzdDLFNBQVMsRUFBRSxZQUFZO0tBQ3hCO0lBQ0Q7UUFDRSxFQUFFLEVBQUUsUUFBUTtRQUNaLElBQUksRUFBRSxlQUFlO1FBQ3JCLElBQUksRUFBRSxNQUFNO1FBQ1osSUFBSSxFQUFFLFlBQVk7UUFDbEIsUUFBUSxFQUFFLEVBQUU7UUFDWixjQUFjLEVBQUUsb0JBQWMsQ0FBQyxVQUFVO1FBQ3pDLGVBQWUsRUFBRSw4QkFBc0IsQ0FBQyxLQUFLO1FBQzdDLEdBQUcsRUFBRSxFQUFFO0tBQ1I7Q0FDRixDQUFBO0FBRUQsTUFBTSxVQUFVLEdBQWU7SUFDN0IsT0FBTyxFQUFFLElBQUk7SUFDYiwyQkFBMkIsRUFBRSxDQUFDLG9CQUFjLENBQUMsVUFBVSxFQUFFLG9CQUFjLENBQUMsVUFBVSxDQUFDO0lBQ25GLGtCQUFrQixFQUFFLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFDbEQsYUFBYSxFQUFFLENBQUM7SUFDaEIsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLG1CQUFXLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRTtDQUM5RSxDQUFBO0FBRUQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsMENBQTBDO0lBQ2pELFNBQVMsRUFBRSxlQUErQjtJQUMxQyxVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtRQUNsQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLHFJQUFxSTthQUNqSjtTQUNGO1FBQ0QsTUFBTSxFQUFFO1lBQ04sWUFBWSxFQUFFLElBQUk7WUFDbEIsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7YUFDOUI7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLFVBQVU7S0FDWDtDQUNxRCxDQUFBO0FBRXhELGtCQUFlLElBQUksQ0FBQTtBQUduQixNQUFNLGNBQWMsR0FBRyxDQUFDLEtBQW1FLEVBQUUsRUFBRTtJQUM3RixNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBZSxTQUFTLENBQUMsQ0FBQTtJQUUzRCxPQUFPLENBQ0wsQ0FBQyxxQkFBYSxDQUNaO01BQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHlGQUF5RixDQUN0RztRQUFBLENBQUMsZUFBK0IsQ0FDOUIsSUFBSSxLQUFLLENBQUMsQ0FDVixLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FDYixRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFFdkI7TUFBQSxFQUFFLEdBQUcsQ0FDUDtJQUFBLEVBQUUscUJBQWEsQ0FBQyxDQUNqQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRVksUUFBQSxVQUFVLEdBQVU7SUFDL0IsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztJQUM1QyxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsSUFBQSxTQUFFLEdBQUU7S0FDZjtDQUNGLENBQUE7QUFFWSxRQUFBLFFBQVEsR0FBVTtJQUM3QixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRztJQUN2RCxJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUUsSUFBQSxTQUFFLEdBQUU7S0FDZjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgdHlwZSB7IEZpbGVFbnRpdHkgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgRmlsZVVwbG9hZCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mZWF0dXJlcy90eXBlcydcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBmbiB9IGZyb20gJ3N0b3J5Ym9vay90ZXN0J1xuaW1wb3J0IHsgUHJldmlld01vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMvdHlwZXMnXG5pbXBvcnQgeyBUb2FzdFByb3ZpZGVyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgU3VwcG9ydFVwbG9hZEZpbGVUeXBlcyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBUcmFuc2Zlck1ldGhvZCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IEZpbGVVcGxvYWRlckluQXR0YWNobWVudFdyYXBwZXIgZnJvbSAnLi9pbmRleCdcblxuY29uc3QgU0FNUExFX0lNQUdFID0gJ2RhdGE6aW1hZ2Uvc3ZnK3htbDt1dGY4LDxzdmcgeG1sbnM9XFwnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXCcgd2lkdGg9XFwnMTI4XFwnIGhlaWdodD1cXCcxMjhcXCc+PHJlY3Qgd2lkdGg9XFwnMTI4XFwnIGhlaWdodD1cXCcxMjhcXCcgcng9XFwnMTZcXCcgZmlsbD1cXCcjRTBGMkZFXFwnLz48dGV4dCB4PVxcJzUwJVxcJyB5PVxcJzUwJVxcJyBkb21pbmFudC1iYXNlbGluZT1cXCdtaWRkbGVcXCcgdGV4dC1hbmNob3I9XFwnbWlkZGxlXFwnIGZvbnQtZmFtaWx5PVxcJ3NhbnMtc2VyaWZcXCcgZm9udC1zaXplPVxcJzE4XFwnIGZpbGw9XFwnIzFGMjkzN1xcJz5JTUc8L3RleHQ+PC9zdmc+J1xuXG5jb25zdCBtb2NrRmlsZXM6IEZpbGVFbnRpdHlbXSA9IFtcbiAge1xuICAgIGlkOiAnZmlsZS0xJyxcbiAgICBuYW1lOiAnUmVxdWlyZW1lbnRzLnBkZicsXG4gICAgc2l6ZTogMjU2MDAwLFxuICAgIHR5cGU6ICdhcHBsaWNhdGlvbi9wZGYnLFxuICAgIHByb2dyZXNzOiAxMDAsXG4gICAgdHJhbnNmZXJNZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgc3VwcG9ydEZpbGVUeXBlOiBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmRvY3VtZW50LFxuICAgIHVybDogJycsXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZpbGUtMicsXG4gICAgbmFtZTogJ0ludGVyZmFjZS5wbmcnLFxuICAgIHNpemU6IDEyODAwMCxcbiAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICBwcm9ncmVzczogMTAwLFxuICAgIHRyYW5zZmVyTWV0aG9kOiBUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlLFxuICAgIHN1cHBvcnRGaWxlVHlwZTogU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5pbWFnZSxcbiAgICBiYXNlNjRVcmw6IFNBTVBMRV9JTUFHRSxcbiAgfSxcbiAge1xuICAgIGlkOiAnZmlsZS0zJyxcbiAgICBuYW1lOiAnVm9pY2VvdmVyLm1wMycsXG4gICAgc2l6ZTogNTEyMDAwLFxuICAgIHR5cGU6ICdhdWRpby9tcGVnJyxcbiAgICBwcm9ncmVzczogMzUsXG4gICAgdHJhbnNmZXJNZXRob2Q6IFRyYW5zZmVyTWV0aG9kLnJlbW90ZV91cmwsXG4gICAgc3VwcG9ydEZpbGVUeXBlOiBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmF1ZGlvLFxuICAgIHVybDogJycsXG4gIH0sXG5dXG5cbmNvbnN0IGZpbGVDb25maWc6IEZpbGVVcGxvYWQgPSB7XG4gIGVuYWJsZWQ6IHRydWUsXG4gIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogW1RyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsIFRyYW5zZmVyTWV0aG9kLnJlbW90ZV91cmxdLFxuICBhbGxvd2VkX2ZpbGVfdHlwZXM6IFsnZG9jdW1lbnQnLCAnaW1hZ2UnLCAnYXVkaW8nXSxcbiAgbnVtYmVyX2xpbWl0czogNSxcbiAgcHJldmlld19jb25maWc6IHsgbW9kZTogUHJldmlld01vZGUuTmV3UGFnZSwgZmlsZV90eXBlX2xpc3Q6IFsncGRmJywgJ3BuZyddIH0sXG59XG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9EYXRhIEVudHJ5L0ZpbGVVcGxvYWRlckluQXR0YWNobWVudCcsXG4gIGNvbXBvbmVudDogRmlsZVVwbG9hZGVySW5BdHRhY2htZW50V3JhcHBlcixcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2NlbnRlcmVkJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdBdHRhY2htZW50LXN0eWxlIHVwbG9hZGVyIHRoYXQgc3VwcG9ydHMgbG9jYWwgZmlsZXMgYW5kIHJlbW90ZSBsaW5rcy4gRGVtb25zdHJhdGVzIHVwbG9hZCBwcm9ncmVzcywgcmUtdXBsb2FkLCBhbmQgcHJldmlldyBhY3Rpb25zLicsXG4gICAgICB9LFxuICAgIH0sXG4gICAgbmV4dGpzOiB7XG4gICAgICBhcHBEaXJlY3Rvcnk6IHRydWUsXG4gICAgICBuYXZpZ2F0aW9uOiB7XG4gICAgICAgIHBhdGhuYW1lOiAnL2FwcHMvZGVtby1hcHAvdXBsb2FkcycsXG4gICAgICAgIHBhcmFtczogeyBhcHBJZDogJ2RlbW8tYXBwJyB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICB0YWdzOiBbJ2F1dG9kb2NzJ10sXG4gIGFyZ3M6IHtcbiAgICBmaWxlQ29uZmlnLFxuICB9LFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgRmlsZVVwbG9hZGVySW5BdHRhY2htZW50V3JhcHBlcj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5jb25zdCBBdHRhY2htZW50RGVtbyA9IChwcm9wczogUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIEZpbGVVcGxvYWRlckluQXR0YWNobWVudFdyYXBwZXI+KSA9PiB7XG4gIGNvbnN0IFtmaWxlcywgc2V0RmlsZXNdID0gdXNlU3RhdGU8RmlsZUVudGl0eVtdPihtb2NrRmlsZXMpXG5cbiAgcmV0dXJuIChcbiAgICA8VG9hc3RQcm92aWRlcj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1bMzIwcHhdIHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTQgc2hhZG93LXhzXCI+XG4gICAgICAgIDxGaWxlVXBsb2FkZXJJbkF0dGFjaG1lbnRXcmFwcGVyXG4gICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICAgIHZhbHVlPXtmaWxlc31cbiAgICAgICAgICBvbkNoYW5nZT17c2V0RmlsZXN9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L1RvYXN0UHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFBsYXlncm91bmQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEF0dGFjaG1lbnREZW1vIHsuLi5hcmdzfSAvPixcbiAgYXJnczoge1xuICAgIG9uQ2hhbmdlOiBmbigpLFxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgRGlzYWJsZWQ6IFN0b3J5ID0ge1xuICByZW5kZXI6IGFyZ3MgPT4gPEF0dGFjaG1lbnREZW1vIHsuLi5hcmdzfSBpc0Rpc2FibGVkIC8+LFxuICBhcmdzOiB7XG4gICAgb25DaGFuZ2U6IGZuKCksXG4gIH0sXG59XG4iXX0=