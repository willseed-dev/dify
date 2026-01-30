"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const avatar_1 = require("@/app/components/base/icons/src/public/avatar");
const question_1 = require("./question");
const meta = {
    title: 'Base/Other/Chat Question',
    component: question_1.default,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {},
    args: {},
};
exports.default = meta;
exports.Default = {
    args: {
        item: {
            id: '1',
            isAnswer: false,
            content: 'You are a helpful assistant.',
        },
        theme: undefined,
        questionIcon: (<div className="h-full w-full rounded-full border-[0.5px] border-black/5">
        <avatar_1.User className="h-full w-full"/>
      </div>),
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb24uc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInF1ZXN0aW9uLnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBLDBFQUFvRTtBQUNwRSx5Q0FBaUM7QUFFakMsTUFBTSxJQUFJLEdBQUc7SUFDWCxLQUFLLEVBQUUsMEJBQTBCO0lBQ2pDLFNBQVMsRUFBRSxrQkFBUTtJQUNuQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsVUFBVTtLQUNuQjtJQUNELElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQztJQUNsQixRQUFRLEVBQUUsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFO0NBQ3VCLENBQUE7QUFFakMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxPQUFPLEdBQVU7SUFDNUIsSUFBSSxFQUFFO1FBQ0osSUFBSSxFQUFFO1lBQ0osRUFBRSxFQUFFLEdBQUc7WUFDUCxRQUFRLEVBQUUsS0FBSztZQUNmLE9BQU8sRUFBRSw4QkFBOEI7U0FDckI7UUFDcEIsS0FBSyxFQUFFLFNBQVM7UUFDaEIsWUFBWSxFQUFFLENBQ1osQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBEQUEwRCxDQUN2RTtRQUFBLENBQUMsYUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQ2pDO01BQUEsRUFBRSxHQUFHLENBQUMsQ0FDUDtLQUNGO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcblxuaW1wb3J0IHR5cGUgeyBDaGF0SXRlbSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvcHVibGljL2F2YXRhcidcbmltcG9ydCBRdWVzdGlvbiBmcm9tICcuL3F1ZXN0aW9uJ1xuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvT3RoZXIvQ2hhdCBRdWVzdGlvbicsXG4gIGNvbXBvbmVudDogUXVlc3Rpb24sXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgYXJnVHlwZXM6IHt9LFxuICBhcmdzOiB7fSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFF1ZXN0aW9uPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHtcbiAgYXJnczoge1xuICAgIGl0ZW06IHtcbiAgICAgIGlkOiAnMScsXG4gICAgICBpc0Fuc3dlcjogZmFsc2UsXG4gICAgICBjb250ZW50OiAnWW91IGFyZSBhIGhlbHBmdWwgYXNzaXN0YW50LicsXG4gICAgfSBzYXRpc2ZpZXMgQ2hhdEl0ZW0sXG4gICAgdGhlbWU6IHVuZGVmaW5lZCxcbiAgICBxdWVzdGlvbkljb246IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC1mdWxsIHctZnVsbCByb3VuZGVkLWZ1bGwgYm9yZGVyLVswLjVweF0gYm9yZGVyLWJsYWNrLzVcIj5cbiAgICAgICAgPFVzZXIgY2xhc3NOYW1lPVwiaC1mdWxsIHctZnVsbFwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICApLFxuICB9LFxufVxuIl19