"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteOnly = exports.Playground = void 0;
const react_1 = require("react");
const toast_1 = require("@/app/components/base/toast");
const types_1 = require("@/app/components/workflow/types");
const app_1 = require("@/types/app");
const _1 = require(".");
const file_list_1 = require("../file-uploader-in-chat-input/file-list");
const store_1 = require("../store");
const mockFiles = [
    {
        id: '1',
        name: 'Dataset.csv',
        size: 64000,
        type: 'text/csv',
        progress: 100,
        transferMethod: app_1.TransferMethod.local_file,
        supportFileType: types_1.SupportUploadFileTypes.document,
    },
];
const chatUploadConfig = {
    enabled: true,
    allowed_file_upload_methods: [app_1.TransferMethod.local_file, app_1.TransferMethod.remote_url],
    allowed_file_types: ['image', 'document'],
    number_limits: 3,
};
const ChatInputDemo = ({ initialFiles = mockFiles, ...props }) => {
    const [files, setFiles] = (0, react_1.useState)(initialFiles);
    return (<toast_1.ToastProvider>
      <store_1.FileContextProvider value={files} onChange={setFiles}>
        <div className="w-[360px] rounded-2xl border border-divider-subtle bg-components-panel-bg p-4">
          <div className="mb-3 text-xs text-text-secondary">Simulated chat input</div>
          <div className="flex items-center gap-2">
            <_1.default {...props}/>
            <div className="flex-1 rounded-lg border border-divider-subtle bg-background-default-subtle p-2 text-xs text-text-tertiary">Type a message...</div>
          </div>
          <div className="mt-4">
            <file_list_1.FileList files={files}/>
          </div>
        </div>
      </store_1.FileContextProvider>
    </toast_1.ToastProvider>);
};
const meta = {
    title: 'Base/Data Entry/FileUploaderInChatInput',
    component: ChatInputDemo,
    parameters: {
        docs: {
            description: {
                component: 'Attachment trigger suited for chat inputs. Demonstrates integration with the shared file store and preview list.',
            },
        },
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/chats/demo',
                params: { appId: 'demo-app' },
            },
        },
    },
    tags: ['autodocs'],
    args: {
        fileConfig: chatUploadConfig,
        initialFiles: mockFiles,
    },
};
exports.default = meta;
exports.Playground = {
    render: args => <ChatInputDemo {...args}/>,
};
exports.RemoteOnly = {
    args: {
        fileConfig: {
            ...chatUploadConfig,
            allowed_file_upload_methods: [app_1.TransferMethod.remote_url],
        },
        initialFiles: [],
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLGlDQUFnQztBQUNoQyx1REFBMkQ7QUFDM0QsMkRBQXdFO0FBQ3hFLHFDQUE0QztBQUM1Qyx3QkFBdUM7QUFDdkMsd0VBQW1FO0FBQ25FLG9DQUE4QztBQUU5QyxNQUFNLFNBQVMsR0FBaUI7SUFDOUI7UUFDRSxFQUFFLEVBQUUsR0FBRztRQUNQLElBQUksRUFBRSxhQUFhO1FBQ25CLElBQUksRUFBRSxLQUFLO1FBQ1gsSUFBSSxFQUFFLFVBQVU7UUFDaEIsUUFBUSxFQUFFLEdBQUc7UUFDYixjQUFjLEVBQUUsb0JBQWMsQ0FBQyxVQUFVO1FBQ3pDLGVBQWUsRUFBRSw4QkFBc0IsQ0FBQyxRQUFRO0tBQ2pEO0NBQ0YsQ0FBQTtBQUVELE1BQU0sZ0JBQWdCLEdBQWU7SUFDbkMsT0FBTyxFQUFFLElBQUk7SUFDYiwyQkFBMkIsRUFBRSxDQUFDLG9CQUFjLENBQUMsVUFBVSxFQUFFLG9CQUFjLENBQUMsVUFBVSxDQUFDO0lBQ25GLGtCQUFrQixFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztJQUN6QyxhQUFhLEVBQUUsQ0FBQztDQUNqQixDQUFBO0FBTUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxFQUFFLFlBQVksR0FBRyxTQUFTLEVBQUUsR0FBRyxLQUFLLEVBQXNCLEVBQUUsRUFBRTtJQUNuRixNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBZSxZQUFZLENBQUMsQ0FBQTtJQUU5RCxPQUFPLENBQ0wsQ0FBQyxxQkFBYSxDQUNaO01BQUEsQ0FBQywyQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FDcEQ7UUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsK0VBQStFLENBQzVGO1VBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGtDQUFrQyxDQUFDLG9CQUFvQixFQUFFLEdBQUcsQ0FDM0U7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQ3RDO1lBQUEsQ0FBQyxVQUF1QixDQUFDLElBQUksS0FBSyxDQUFDLEVBQ25DO1lBQUEsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDRHQUE0RyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FDcEo7VUFBQSxFQUFFLEdBQUcsQ0FDTDtVQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ25CO1lBQUEsQ0FBQyxvQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUN6QjtVQUFBLEVBQUUsR0FBRyxDQUNQO1FBQUEsRUFBRSxHQUFHLENBQ1A7TUFBQSxFQUFFLDJCQUFtQixDQUN2QjtJQUFBLEVBQUUscUJBQWEsQ0FBQyxDQUNqQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBRUQsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUseUNBQXlDO0lBQ2hELFNBQVMsRUFBRSxhQUFhO0lBQ3hCLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRTtZQUNKLFdBQVcsRUFBRTtnQkFDWCxTQUFTLEVBQUUsa0hBQWtIO2FBQzlIO1NBQ0Y7UUFDRCxNQUFNLEVBQUU7WUFDTixZQUFZLEVBQUUsSUFBSTtZQUNsQixVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUU7YUFDOUI7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLFVBQVUsRUFBRSxnQkFBZ0I7UUFDNUIsWUFBWSxFQUFFLFNBQVM7S0FDeEI7Q0FDbUMsQ0FBQTtBQUV0QyxrQkFBZSxJQUFJLENBQUE7QUFHTixRQUFBLFVBQVUsR0FBVTtJQUMvQixNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUFHO0NBQzVDLENBQUE7QUFFWSxRQUFBLFVBQVUsR0FBVTtJQUMvQixJQUFJLEVBQUU7UUFDSixVQUFVLEVBQUU7WUFDVixHQUFHLGdCQUFnQjtZQUNuQiwyQkFBMkIsRUFBRSxDQUFDLG9CQUFjLENBQUMsVUFBVSxDQUFDO1NBQ3pEO1FBQ0QsWUFBWSxFQUFFLEVBQUU7S0FDakI7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHR5cGUgeyBGaWxlRW50aXR5IH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEZpbGVVcGxvYWQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMvdHlwZXMnXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgVG9hc3RQcm92aWRlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7IFN1cHBvcnRVcGxvYWRGaWxlVHlwZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IHsgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCBGaWxlVXBsb2FkZXJJbkNoYXRJbnB1dCBmcm9tICcuJ1xuaW1wb3J0IHsgRmlsZUxpc3QgfSBmcm9tICcuLi9maWxlLXVwbG9hZGVyLWluLWNoYXQtaW5wdXQvZmlsZS1saXN0J1xuaW1wb3J0IHsgRmlsZUNvbnRleHRQcm92aWRlciB9IGZyb20gJy4uL3N0b3JlJ1xuXG5jb25zdCBtb2NrRmlsZXM6IEZpbGVFbnRpdHlbXSA9IFtcbiAge1xuICAgIGlkOiAnMScsXG4gICAgbmFtZTogJ0RhdGFzZXQuY3N2JyxcbiAgICBzaXplOiA2NDAwMCxcbiAgICB0eXBlOiAndGV4dC9jc3YnLFxuICAgIHByb2dyZXNzOiAxMDAsXG4gICAgdHJhbnNmZXJNZXRob2Q6IFRyYW5zZmVyTWV0aG9kLmxvY2FsX2ZpbGUsXG4gICAgc3VwcG9ydEZpbGVUeXBlOiBTdXBwb3J0VXBsb2FkRmlsZVR5cGVzLmRvY3VtZW50LFxuICB9LFxuXVxuXG5jb25zdCBjaGF0VXBsb2FkQ29uZmlnOiBGaWxlVXBsb2FkID0ge1xuICBlbmFibGVkOiB0cnVlLFxuICBhbGxvd2VkX2ZpbGVfdXBsb2FkX21ldGhvZHM6IFtUcmFuc2Zlck1ldGhvZC5sb2NhbF9maWxlLCBUcmFuc2Zlck1ldGhvZC5yZW1vdGVfdXJsXSxcbiAgYWxsb3dlZF9maWxlX3R5cGVzOiBbJ2ltYWdlJywgJ2RvY3VtZW50J10sXG4gIG51bWJlcl9saW1pdHM6IDMsXG59XG5cbnR5cGUgQ2hhdElucHV0RGVtb1Byb3BzID0gUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIEZpbGVVcGxvYWRlckluQ2hhdElucHV0PiAmIHtcbiAgaW5pdGlhbEZpbGVzPzogRmlsZUVudGl0eVtdXG59XG5cbmNvbnN0IENoYXRJbnB1dERlbW8gPSAoeyBpbml0aWFsRmlsZXMgPSBtb2NrRmlsZXMsIC4uLnByb3BzIH06IENoYXRJbnB1dERlbW9Qcm9wcykgPT4ge1xuICBjb25zdCBbZmlsZXMsIHNldEZpbGVzXSA9IHVzZVN0YXRlPEZpbGVFbnRpdHlbXT4oaW5pdGlhbEZpbGVzKVxuXG4gIHJldHVybiAoXG4gICAgPFRvYXN0UHJvdmlkZXI+XG4gICAgICA8RmlsZUNvbnRleHRQcm92aWRlciB2YWx1ZT17ZmlsZXN9IG9uQ2hhbmdlPXtzZXRGaWxlc30+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1bMzYwcHhdIHJvdW5kZWQtMnhsIGJvcmRlciBib3JkZXItZGl2aWRlci1zdWJ0bGUgYmctY29tcG9uZW50cy1wYW5lbC1iZyBwLTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTMgdGV4dC14cyB0ZXh0LXRleHQtc2Vjb25kYXJ5XCI+U2ltdWxhdGVkIGNoYXQgaW5wdXQ8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8RmlsZVVwbG9hZGVySW5DaGF0SW5wdXQgey4uLnByb3BzfSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWRpdmlkZXItc3VidGxlIGJnLWJhY2tncm91bmQtZGVmYXVsdC1zdWJ0bGUgcC0yIHRleHQteHMgdGV4dC10ZXh0LXRlcnRpYXJ5XCI+VHlwZSBhIG1lc3NhZ2UuLi48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTRcIj5cbiAgICAgICAgICAgIDxGaWxlTGlzdCBmaWxlcz17ZmlsZXN9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9GaWxlQ29udGV4dFByb3ZpZGVyPlxuICAgIDwvVG9hc3RQcm92aWRlcj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRGF0YSBFbnRyeS9GaWxlVXBsb2FkZXJJbkNoYXRJbnB1dCcsXG4gIGNvbXBvbmVudDogQ2hhdElucHV0RGVtbyxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0F0dGFjaG1lbnQgdHJpZ2dlciBzdWl0ZWQgZm9yIGNoYXQgaW5wdXRzLiBEZW1vbnN0cmF0ZXMgaW50ZWdyYXRpb24gd2l0aCB0aGUgc2hhcmVkIGZpbGUgc3RvcmUgYW5kIHByZXZpZXcgbGlzdC4nLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG5leHRqczoge1xuICAgICAgYXBwRGlyZWN0b3J5OiB0cnVlLFxuICAgICAgbmF2aWdhdGlvbjoge1xuICAgICAgICBwYXRobmFtZTogJy9jaGF0cy9kZW1vJyxcbiAgICAgICAgcGFyYW1zOiB7IGFwcElkOiAnZGVtby1hcHAnIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnczoge1xuICAgIGZpbGVDb25maWc6IGNoYXRVcGxvYWRDb25maWcsXG4gICAgaW5pdGlhbEZpbGVzOiBtb2NrRmlsZXMsXG4gIH0sXG59IHNhdGlzZmllcyBNZXRhPHR5cGVvZiBDaGF0SW5wdXREZW1vPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBQbGF5Z3JvdW5kOiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxDaGF0SW5wdXREZW1vIHsuLi5hcmdzfSAvPixcbn1cblxuZXhwb3J0IGNvbnN0IFJlbW90ZU9ubHk6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgZmlsZUNvbmZpZzoge1xuICAgICAgLi4uY2hhdFVwbG9hZENvbmZpZyxcbiAgICAgIGFsbG93ZWRfZmlsZV91cGxvYWRfbWV0aG9kczogW1RyYW5zZmVyTWV0aG9kLnJlbW90ZV91cmxdLFxuICAgIH0sXG4gICAgaW5pdGlhbEZpbGVzOiBbXSxcbiAgfSxcbn1cbiJdfQ==