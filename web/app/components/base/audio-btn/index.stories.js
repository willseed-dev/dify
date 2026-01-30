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
      <span className="text-xs text-gray-500">Click to toggle playback</span>
    </div>);
};
const meta = {
    title: 'Base/General/AudioBtn',
    component: _1.default,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Audio playback toggle that streams assistant responses. The story uses a mocked audio player so you can inspect loading and playback states without calling the real API.',
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
            description: 'Message identifier used to scope the audio stream.',
        },
        value: {
            control: 'text',
            description: 'Text content that would be converted to speech.',
        },
        voice: {
            control: 'text',
            description: 'Voice profile used for playback.',
        },
        isAudition: {
            control: 'boolean',
            description: 'Switches to the audition style with minimal padding.',
        },
        className: {
            control: 'text',
            description: 'Optional custom class for the wrapper.',
        },
    },
};
exports.default = meta;
exports.Default = {
    render: args => <StoryWrapper {...args}/>,
    args: {
        id: 'message-1',
        value: 'This is an audio preview for the current assistant response.',
        voice: 'alloy',
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFpQztBQUNqQyx3QkFBd0I7QUFDeEIsc0dBQStGO0FBRS9GLElBQUEsa0RBQXNCLEdBQUUsQ0FBQTtBQUV4QixNQUFNLFlBQVksR0FBRyxDQUFDLEtBQXNDLEVBQUUsRUFBRTtJQUM5RCxJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsSUFBQSxrREFBc0IsR0FBRSxDQUFBO0lBQzFCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUVOLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsNENBQTRDLENBQ3pEO01BQUEsQ0FBQyxVQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsRUFDcEI7TUFBQSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUN4RTtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1AsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLHVCQUF1QjtJQUM5QixTQUFTLEVBQUUsVUFBUTtJQUNuQixJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEIsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLFVBQVU7UUFDbEIsSUFBSSxFQUFFO1lBQ0osV0FBVyxFQUFFO2dCQUNYLFNBQVMsRUFBRSwyS0FBMks7YUFDdkw7U0FDRjtRQUNELE1BQU0sRUFBRTtZQUNOLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUUsOEJBQThCO2dCQUN4QyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFO2FBQzlCO1NBQ0Y7S0FDRjtJQUNELFFBQVEsRUFBRTtRQUNSLEVBQUUsRUFBRTtZQUNGLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLG9EQUFvRDtTQUNsRTtRQUNELEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLGlEQUFpRDtTQUMvRDtRQUNELEtBQUssRUFBRTtZQUNMLE9BQU8sRUFBRSxNQUFNO1lBQ2YsV0FBVyxFQUFFLGtDQUFrQztTQUNoRDtRQUNELFVBQVUsRUFBRTtZQUNWLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLFdBQVcsRUFBRSxzREFBc0Q7U0FDcEU7UUFDRCxTQUFTLEVBQUU7WUFDVCxPQUFPLEVBQUUsTUFBTTtZQUNmLFdBQVcsRUFBRSx3Q0FBd0M7U0FDdEQ7S0FDRjtDQUM4QixDQUFBO0FBRWpDLGtCQUFlLElBQUksQ0FBQTtBQUdOLFFBQUEsT0FBTyxHQUFVO0lBQzVCLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUc7SUFDMUMsSUFBSSxFQUFFO1FBQ0osRUFBRSxFQUFFLFdBQVc7UUFDZixLQUFLLEVBQUUsOERBQThEO1FBQ3JFLEtBQUssRUFBRSxPQUFPO0tBQ2Y7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHR5cGUgeyBDb21wb25lbnRQcm9wcyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQXVkaW9CdG4gZnJvbSAnLidcbmltcG9ydCB7IGVuc3VyZU1vY2tBdWRpb01hbmFnZXIgfSBmcm9tICcuLi8uLi8uLi8uLi8uc3Rvcnlib29rL3V0aWxzL2F1ZGlvLXBsYXllci1tYW5hZ2VyLm1vY2snXG5cbmVuc3VyZU1vY2tBdWRpb01hbmFnZXIoKVxuXG5jb25zdCBTdG9yeVdyYXBwZXIgPSAocHJvcHM6IENvbXBvbmVudFByb3BzPHR5cGVvZiBBdWRpb0J0bj4pID0+IHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBlbnN1cmVNb2NrQXVkaW9NYW5hZ2VyKClcbiAgfSwgW10pXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHNwYWNlLXgtM1wiPlxuICAgICAgPEF1ZGlvQnRuIHsuLi5wcm9wc30gLz5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPkNsaWNrIHRvIHRvZ2dsZSBwbGF5YmFjazwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvR2VuZXJhbC9BdWRpb0J0bicsXG4gIGNvbXBvbmVudDogQXVkaW9CdG4sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGxheW91dDogJ2NlbnRlcmVkJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdBdWRpbyBwbGF5YmFjayB0b2dnbGUgdGhhdCBzdHJlYW1zIGFzc2lzdGFudCByZXNwb25zZXMuIFRoZSBzdG9yeSB1c2VzIGEgbW9ja2VkIGF1ZGlvIHBsYXllciBzbyB5b3UgY2FuIGluc3BlY3QgbG9hZGluZyBhbmQgcGxheWJhY2sgc3RhdGVzIHdpdGhvdXQgY2FsbGluZyB0aGUgcmVhbCBBUEkuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBuZXh0anM6IHtcbiAgICAgIGFwcERpcmVjdG9yeTogdHJ1ZSxcbiAgICAgIG5hdmlnYXRpb246IHtcbiAgICAgICAgcGF0aG5hbWU6ICcvYXBwcy9kZW1vLWFwcC90ZXh0LXRvLWF1ZGlvJyxcbiAgICAgICAgcGFyYW1zOiB7IGFwcElkOiAnZGVtby1hcHAnIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIGFyZ1R5cGVzOiB7XG4gICAgaWQ6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTWVzc2FnZSBpZGVudGlmaWVyIHVzZWQgdG8gc2NvcGUgdGhlIGF1ZGlvIHN0cmVhbS4nLFxuICAgIH0sXG4gICAgdmFsdWU6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGV4dCBjb250ZW50IHRoYXQgd291bGQgYmUgY29udmVydGVkIHRvIHNwZWVjaC4nLFxuICAgIH0sXG4gICAgdm9pY2U6IHtcbiAgICAgIGNvbnRyb2w6ICd0ZXh0JyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnVm9pY2UgcHJvZmlsZSB1c2VkIGZvciBwbGF5YmFjay4nLFxuICAgIH0sXG4gICAgaXNBdWRpdGlvbjoge1xuICAgICAgY29udHJvbDogJ2Jvb2xlYW4nLFxuICAgICAgZGVzY3JpcHRpb246ICdTd2l0Y2hlcyB0byB0aGUgYXVkaXRpb24gc3R5bGUgd2l0aCBtaW5pbWFsIHBhZGRpbmcuJyxcbiAgICB9LFxuICAgIGNsYXNzTmFtZToge1xuICAgICAgY29udHJvbDogJ3RleHQnLFxuICAgICAgZGVzY3JpcHRpb246ICdPcHRpb25hbCBjdXN0b20gY2xhc3MgZm9yIHRoZSB3cmFwcGVyLicsXG4gICAgfSxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEF1ZGlvQnRuPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbmV4cG9ydCBjb25zdCBEZWZhdWx0OiBTdG9yeSA9IHtcbiAgcmVuZGVyOiBhcmdzID0+IDxTdG9yeVdyYXBwZXIgey4uLmFyZ3N9IC8+LFxuICBhcmdzOiB7XG4gICAgaWQ6ICdtZXNzYWdlLTEnLFxuICAgIHZhbHVlOiAnVGhpcyBpcyBhbiBhdWRpbyBwcmV2aWV3IGZvciB0aGUgY3VycmVudCBhc3Npc3RhbnQgcmVzcG9uc2UuJyxcbiAgICB2b2ljZTogJ2FsbG95JyxcbiAgfSxcbn1cbiJdfQ==