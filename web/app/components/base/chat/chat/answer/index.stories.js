"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithMarkdownSVG = exports.WithMarkdownContent = exports.WithWorkflowProcess = exports.Basic = void 0;
const types_1 = require("@/app/components/workflow/types");
const _1 = require(".");
const markdownContent_1 = require("./__mocks__/markdownContent");
const markdownContentSVG_1 = require("./__mocks__/markdownContentSVG");
const meta = {
    title: 'Base/Other/Chat Answer',
    component: _1.default,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        noChatInput: { control: 'boolean', description: 'If set to true, some buttons that are supposed to be shown on hover will not be displayed.' },
        responding: { control: 'boolean', description: 'Indicates if the answer is being generated.' },
        showPromptLog: { control: 'boolean', description: 'If set to true, the prompt log button will be shown on hover.' },
    },
    args: {
        noChatInput: false,
        responding: false,
        showPromptLog: false,
    },
};
exports.default = meta;
const mockedBaseChatItem = {
    id: '1',
    isAnswer: true,
    content: 'Hello, how can I assist you today?',
};
const mockedWorkflowProcess = {
    status: types_1.WorkflowRunningStatus.Succeeded,
    tracing: [],
};
exports.Basic = {
    args: {
        item: mockedBaseChatItem,
        question: mockedBaseChatItem.content,
        index: 0,
    },
    render: (args) => {
        return (<div className="w-full px-10 py-5">
        <_1.default {...args}/>
      </div>);
    },
};
exports.WithWorkflowProcess = {
    args: {
        item: {
            ...mockedBaseChatItem,
            workflowProcess: mockedWorkflowProcess,
        },
        question: mockedBaseChatItem.content,
        index: 0,
    },
    render: (args) => {
        return (<div className="w-full px-10 py-5">
        <_1.default {...args}/>
      </div>);
    },
};
exports.WithMarkdownContent = {
    args: {
        item: {
            ...mockedBaseChatItem,
            content: markdownContent_1.markdownContent,
        },
        question: mockedBaseChatItem.content,
        index: 0,
    },
    render: (args) => {
        return (<div className="w-full px-10 py-5">
        <_1.default {...args}/>
      </div>);
    },
};
exports.WithMarkdownSVG = {
    args: {
        item: {
            ...mockedBaseChatItem,
            content: markdownContentSVG_1.markdownContentSVG,
        },
        question: mockedBaseChatItem.content,
        index: 0,
    },
    render: (args) => {
        return (<div className="w-full px-10 py-5">
        <_1.default {...args}/>
      </div>);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDJEQUF1RTtBQUN2RSx3QkFBc0I7QUFDdEIsaUVBQTZEO0FBQzdELHVFQUFtRTtBQUVuRSxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSx3QkFBd0I7SUFDL0IsU0FBUyxFQUFFLFVBQU07SUFDakIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFlBQVk7S0FDckI7SUFDRCxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsUUFBUSxFQUFFO1FBQ1IsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsNEZBQTRGLEVBQUU7UUFDOUksVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsNkNBQTZDLEVBQUU7UUFDOUYsYUFBYSxFQUFFLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsK0RBQStELEVBQUU7S0FDcEg7SUFDRCxJQUFJLEVBQUU7UUFDSixXQUFXLEVBQUUsS0FBSztRQUNsQixVQUFVLEVBQUUsS0FBSztRQUNqQixhQUFhLEVBQUUsS0FBSztLQUNyQjtDQUM0QixDQUFBO0FBRS9CLGtCQUFlLElBQUksQ0FBQTtBQUduQixNQUFNLGtCQUFrQixHQUFHO0lBQ3pCLEVBQUUsRUFBRSxHQUFHO0lBQ1AsUUFBUSxFQUFFLElBQUk7SUFDZCxPQUFPLEVBQUUsb0NBQW9DO0NBQzNCLENBQUE7QUFFcEIsTUFBTSxxQkFBcUIsR0FBRztJQUM1QixNQUFNLEVBQUUsNkJBQXFCLENBQUMsU0FBUztJQUN2QyxPQUFPLEVBQUUsRUFBRTtDQUNaLENBQUE7QUFFWSxRQUFBLEtBQUssR0FBVTtJQUMxQixJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPO1FBQ3BDLEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFDRCxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNmLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQ2hDO1FBQUEsQ0FBQyxVQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsRUFDbkI7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsbUJBQW1CLEdBQVU7SUFDeEMsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFO1lBQ0osR0FBRyxrQkFBa0I7WUFDckIsZUFBZSxFQUFFLHFCQUFxQjtTQUN2QztRQUNELFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPO1FBQ3BDLEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFDRCxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNmLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQ2hDO1FBQUEsQ0FBQyxVQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsRUFDbkI7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsbUJBQW1CLEdBQVU7SUFDeEMsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFO1lBQ0osR0FBRyxrQkFBa0I7WUFDckIsT0FBTyxFQUFFLGlDQUFlO1NBQ3pCO1FBQ0QsUUFBUSxFQUFFLGtCQUFrQixDQUFDLE9BQU87UUFDcEMsS0FBSyxFQUFFLENBQUM7S0FDVDtJQUNELE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ2YsT0FBTyxDQUNMLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FDaEM7UUFBQSxDQUFDLFVBQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxFQUNuQjtNQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtJQUNILENBQUM7Q0FDRixDQUFBO0FBRVksUUFBQSxlQUFlLEdBQVU7SUFDcEMsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFO1lBQ0osR0FBRyxrQkFBa0I7WUFDckIsT0FBTyxFQUFFLHVDQUFrQjtTQUM1QjtRQUNELFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxPQUFPO1FBQ3BDLEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFDRCxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNmLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQ2hDO1FBQUEsQ0FBQyxVQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsRUFDbkI7TUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7SUFDSCxDQUFDO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB0eXBlIHsgQ2hhdEl0ZW0gfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IFdvcmtmbG93UnVubmluZ1N0YXR1cyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgQW5zd2VyIGZyb20gJy4nXG5pbXBvcnQgeyBtYXJrZG93bkNvbnRlbnQgfSBmcm9tICcuL19fbW9ja3NfXy9tYXJrZG93bkNvbnRlbnQnXG5pbXBvcnQgeyBtYXJrZG93bkNvbnRlbnRTVkcgfSBmcm9tICcuL19fbW9ja3NfXy9tYXJrZG93bkNvbnRlbnRTVkcnXG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9PdGhlci9DaGF0IEFuc3dlcicsXG4gIGNvbXBvbmVudDogQW5zd2VyLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnZnVsbHNjcmVlbicsXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnVHlwZXM6IHtcbiAgICBub0NoYXRJbnB1dDogeyBjb250cm9sOiAnYm9vbGVhbicsIGRlc2NyaXB0aW9uOiAnSWYgc2V0IHRvIHRydWUsIHNvbWUgYnV0dG9ucyB0aGF0IGFyZSBzdXBwb3NlZCB0byBiZSBzaG93biBvbiBob3ZlciB3aWxsIG5vdCBiZSBkaXNwbGF5ZWQuJyB9LFxuICAgIHJlc3BvbmRpbmc6IHsgY29udHJvbDogJ2Jvb2xlYW4nLCBkZXNjcmlwdGlvbjogJ0luZGljYXRlcyBpZiB0aGUgYW5zd2VyIGlzIGJlaW5nIGdlbmVyYXRlZC4nIH0sXG4gICAgc2hvd1Byb21wdExvZzogeyBjb250cm9sOiAnYm9vbGVhbicsIGRlc2NyaXB0aW9uOiAnSWYgc2V0IHRvIHRydWUsIHRoZSBwcm9tcHQgbG9nIGJ1dHRvbiB3aWxsIGJlIHNob3duIG9uIGhvdmVyLicgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIG5vQ2hhdElucHV0OiBmYWxzZSxcbiAgICByZXNwb25kaW5nOiBmYWxzZSxcbiAgICBzaG93UHJvbXB0TG9nOiBmYWxzZSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEFuc3dlcj5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5jb25zdCBtb2NrZWRCYXNlQ2hhdEl0ZW0gPSB7XG4gIGlkOiAnMScsXG4gIGlzQW5zd2VyOiB0cnVlLFxuICBjb250ZW50OiAnSGVsbG8sIGhvdyBjYW4gSSBhc3Npc3QgeW91IHRvZGF5PycsXG59IHNhdGlzZmllcyBDaGF0SXRlbVxuXG5jb25zdCBtb2NrZWRXb3JrZmxvd1Byb2Nlc3MgPSB7XG4gIHN0YXR1czogV29ya2Zsb3dSdW5uaW5nU3RhdHVzLlN1Y2NlZWRlZCxcbiAgdHJhY2luZzogW10sXG59XG5cbmV4cG9ydCBjb25zdCBCYXNpYzogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICBpdGVtOiBtb2NrZWRCYXNlQ2hhdEl0ZW0sXG4gICAgcXVlc3Rpb246IG1vY2tlZEJhc2VDaGF0SXRlbS5jb250ZW50LFxuICAgIGluZGV4OiAwLFxuICB9LFxuICByZW5kZXI6IChhcmdzKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIHB4LTEwIHB5LTVcIj5cbiAgICAgICAgPEFuc3dlciB7Li4uYXJnc30gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn1cblxuZXhwb3J0IGNvbnN0IFdpdGhXb3JrZmxvd1Byb2Nlc3M6IFN0b3J5ID0ge1xuICBhcmdzOiB7XG4gICAgaXRlbToge1xuICAgICAgLi4ubW9ja2VkQmFzZUNoYXRJdGVtLFxuICAgICAgd29ya2Zsb3dQcm9jZXNzOiBtb2NrZWRXb3JrZmxvd1Byb2Nlc3MsXG4gICAgfSxcbiAgICBxdWVzdGlvbjogbW9ja2VkQmFzZUNoYXRJdGVtLmNvbnRlbnQsXG4gICAgaW5kZXg6IDAsXG4gIH0sXG4gIHJlbmRlcjogKGFyZ3MpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtMTAgcHktNVwiPlxuICAgICAgICA8QW5zd2VyIHsuLi5hcmdzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgV2l0aE1hcmtkb3duQ29udGVudDogU3RvcnkgPSB7XG4gIGFyZ3M6IHtcbiAgICBpdGVtOiB7XG4gICAgICAuLi5tb2NrZWRCYXNlQ2hhdEl0ZW0sXG4gICAgICBjb250ZW50OiBtYXJrZG93bkNvbnRlbnQsXG4gICAgfSxcbiAgICBxdWVzdGlvbjogbW9ja2VkQmFzZUNoYXRJdGVtLmNvbnRlbnQsXG4gICAgaW5kZXg6IDAsXG4gIH0sXG4gIHJlbmRlcjogKGFyZ3MpID0+IHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgcHgtMTAgcHktNVwiPlxuICAgICAgICA8QW5zd2VyIHsuLi5hcmdzfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufVxuXG5leHBvcnQgY29uc3QgV2l0aE1hcmtkb3duU1ZHOiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIGl0ZW06IHtcbiAgICAgIC4uLm1vY2tlZEJhc2VDaGF0SXRlbSxcbiAgICAgIGNvbnRlbnQ6IG1hcmtkb3duQ29udGVudFNWRyxcbiAgICB9LFxuICAgIHF1ZXN0aW9uOiBtb2NrZWRCYXNlQ2hhdEl0ZW0uY29udGVudCxcbiAgICBpbmRleDogMCxcbiAgfSxcbiAgcmVuZGVyOiAoYXJncykgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBweC0xMCBweS01XCI+XG4gICAgICAgIDxBbnN3ZXIgey4uLmFyZ3N9IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59XG4iXX0=