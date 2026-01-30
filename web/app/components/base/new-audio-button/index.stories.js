"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const react_1 = require("react");
const _1 = require(".");
const audio_player_manager_mock_1 = require("../../../../.storybook/utils/audio-player-manager.mock");
(0, audio_player_manager_mock_1.ensureMockAudioManager)();
const StoryWrapper = (props) => {
    (0, react_1.useEffect)(() => {
        (0, audio_player_manager_mock_1.ensureMockAudioManager)();
    }, []);
    return (<div className="flex items-center justify-center space-x-3">
      <_1.default {...props}/>
      <span className="text-xs text-gray-500">Audio toggle using ActionButton styling</span>
    </div>);
};
const meta = {
    title: 'Base/General/NewAudioButton',
    component: _1.default,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Updated audio playback trigger styled with `ActionButton`. Behaves like the legacy audio button but adopts the new button design system.',
            },
        },
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/apps/demo-app/text-to-audio',
                params: { appId: 'demo-app' },
            },
        },
    },
    argTypes: {
        id: {
            control: 'text',
            description: 'Message identifier used by the audio request.',
        },
        value: {
            control: 'text',
            description: 'Prompt or response text that will be converted to speech.',
        },
        voice: {
            control: 'text',
            description: 'Voice profile for the generated speech.',
        },
    },
};
exports.default = meta;
exports.Default = {
    render: args => <StoryWrapper {...args}/>,
    args: {
        id: 'message-1',
        value: 'Listen to the latest assistant message.',
        voice: 'alloy',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFpQztBQUNqQyx3QkFBd0I7QUFDeEIsc0dBQStGO0FBRS9GLElBQUEsa0RBQXNCLEdBQUUsQ0FBQTtBQUV4QixNQUFNLFlBQVksR0FBRyxDQUFDLEtBQXNDLEVBQUUsRUFBRTtJQUM5RCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsSUFBQSxrREFBc0IsR0FBRSxDQUFBO0lBQzFCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUVOLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNENBQTRDLENBQ3pEO01BQUEsQ0FBQyxVQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDcEI7TUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsdUNBQXVDLEVBQUUsSUFBSSxDQUN2RjtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLDZCQUE2QjtJQUNwQyxTQUFTLEVBQUUsVUFBUTtJQUNuQixJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSwwSUFBMEk7YUFDdEo7U0FDRjtRQUNELE1BQU0sRUFBRTtZQUNOLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsOEJBQThCO2dCQUN4QyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO2FBQzlCO1NBQ0Y7S0FDRjtJQUNELFFBQVEsRUFBRTtRQUNSLEVBQUUsRUFBRTtZQUNGLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLCtDQUErQztTQUM3RDtRQUNELEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLDJEQUEyRDtTQUN6RTtRQUNELEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLHlDQUF5QztTQUN2RDtLQUNGO0NBQzhCLENBQUE7QUFFakMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxPQUFPLEdBQVU7SUFDNUIsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRztJQUMxQyxJQUFJLEVBQUU7UUFDSixFQUFFLEVBQUUsV0FBVztRQUNmLEtBQUssRUFBRSx5Q0FBeUM7UUFDaEQsS0FBSyxFQUFFLE9BQU87S0FDZjtDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1ldGEsIFN0b3J5T2JqIH0gZnJvbSAnQHN0b3J5Ym9vay9uZXh0anMnXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudFByb3BzIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBBdWRpb0J0biBmcm9tICcuJ1xuaW1wb3J0IHsgZW5zdXJlTW9ja0F1ZGlvTWFuYWdlciB9IGZyb20gJy4uLy4uLy4uLy4uLy5zdG9yeWJvb2svdXRpbHMvYXVkaW8tcGxheWVyLW1hbmFnZXIubW9jaydcblxuZW5zdXJlTW9ja0F1ZGlvTWFuYWdlcigpXG5cbmNvbnN0IFN0b3J5V3JhcHBlciA9IChwcm9wczogQ29tcG9uZW50UHJvcHM8dHlwZW9mIEF1ZGlvQnRuPikgPT4ge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGVuc3VyZU1vY2tBdWRpb01hbmFnZXIoKVxuICB9LCBbXSlcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgc3BhY2UteC0zXCI+XG4gICAgICA8QXVkaW9CdG4gey4uLnByb3BzfSAvPlxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+QXVkaW8gdG9nZ2xlIHVzaW5nIEFjdGlvbkJ1dHRvbiBzdHlsaW5nPC9zcGFuPlxuICAgIDwvZGl2PlxuICApXG59XG5cbmNvbnN0IG1ldGEgPSB7XG4gIHRpdGxlOiAnQmFzZS9HZW5lcmFsL05ld0F1ZGlvQnV0dG9uJyxcbiAgY29tcG9uZW50OiBBdWRpb0J0bixcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBwYXJhbWV0ZXJzOiB7XG4gICAgbGF5b3V0OiAnY2VudGVyZWQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ1VwZGF0ZWQgYXVkaW8gcGxheWJhY2sgdHJpZ2dlciBzdHlsZWQgd2l0aCBgQWN0aW9uQnV0dG9uYC4gQmVoYXZlcyBsaWtlIHRoZSBsZWdhY3kgYXVkaW8gYnV0dG9uIGJ1dCBhZG9wdHMgdGhlIG5ldyBidXR0b24gZGVzaWduIHN5c3RlbS4nLFxuICAgICAgfSxcbiAgICB9LFxuICAgIG5leHRqczoge1xuICAgICAgYXBwRGlyZWN0b3J5OiB0cnVlLFxuICAgICAgbmF2aWdhdGlvbjoge1xuICAgICAgICBwYXRobmFtZTogJy9hcHBzL2RlbW8tYXBwL3RleHQtdG8tYXVkaW8nLFxuICAgICAgICBwYXJhbXM6IHsgYXBwSWQ6ICdkZW1vLWFwcCcgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYXJnVHlwZXM6IHtcbiAgICBpZDoge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdNZXNzYWdlIGlkZW50aWZpZXIgdXNlZCBieSB0aGUgYXVkaW8gcmVxdWVzdC4nLFxuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJvbXB0IG9yIHJlc3BvbnNlIHRleHQgdGhhdCB3aWxsIGJlIGNvbnZlcnRlZCB0byBzcGVlY2guJyxcbiAgICB9LFxuICAgIHZvaWNlOiB7XG4gICAgICBjb250cm9sOiAndGV4dCcsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ZvaWNlIHByb2ZpbGUgZm9yIHRoZSBnZW5lcmF0ZWQgc3BlZWNoLicsXG4gICAgfSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEF1ZGlvQnRuPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxTdG9yeVdyYXBwZXIgey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgaWQ6ICdtZXNzYWdlLTEnLFxuICAgIHZhbHVlOiAnTGlzdGVuIHRvIHRoZSBsYXRlc3QgYXNzaXN0YW50IG1lc3NhZ2UuJyxcbiAgICB2b2ljZTogJ2FsbG95JyxcbiAgfSxcbn1cbiJdfQ==