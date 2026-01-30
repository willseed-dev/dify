"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playground = void 0;
const react_1 = require("react");
const store_1 = require("@/app/components/app/store");
const _1 = require(".");
const mockLogItem = {
    id: 'message-1',
    isAnswer: true,
    content: 'Summarize our meeting notes about launch blockers.',
    log: [
        {
            role: 'system',
            text: 'You are an assistant that extracts key launch blockers from the dialogue.',
        },
        {
            role: 'user',
            text: 'Team discussed QA, marketing assets, and infra readiness. Highlight risks.',
        },
        {
            role: 'assistant',
            text: 'Blocking items:\n1. QA needs staging data by Friday.\n2. Marketing awaiting final visuals.\n3. Infra rollout still missing approval.',
        },
    ],
};
const usePromptLogMocks = () => {
    (0, react_1.useEffect)(() => {
        store_1.useStore.getState().setCurrentLogItem(mockLogItem);
        return () => {
            store_1.useStore.getState().setCurrentLogItem(undefined);
        };
    }, []);
};
const PromptLogPreview = (props) => {
    usePromptLogMocks();
    return (<div className="relative min-h-[540px] w-full bg-background-default-subtle p-6">
      <_1.default {...props} currentLogItem={mockLogItem}/>
    </div>);
};
const meta = {
    title: 'Base/Feedback/PromptLogModal',
    component: PromptLogPreview,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Shows the prompt and message transcript used for a chat completion, with copy-to-clipboard support for single prompts.',
            },
        },
    },
    args: {
        width: 960,
        onCancel: () => {
            console.log('Prompt log closed');
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
exports.Playground = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFpQztBQUNqQyxzREFBcUQ7QUFDckQsd0JBQThCO0FBSTlCLE1BQU0sV0FBVyxHQUFjO0lBQzdCLEVBQUUsRUFBRSxXQUFXO0lBQ2YsUUFBUSxFQUFFLElBQUk7SUFDZCxPQUFPLEVBQUUsb0RBQW9EO0lBQzdELEdBQUcsRUFBRTtRQUNIO1lBQ0UsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsMkVBQTJFO1NBQ2xGO1FBQ0Q7WUFDRSxJQUFJLEVBQUUsTUFBTTtZQUNaLElBQUksRUFBRSw0RUFBNEU7U0FDbkY7UUFDRDtZQUNFLElBQUksRUFBRSxXQUFXO1lBQ2pCLElBQUksRUFBRSxzSUFBc0k7U0FDN0k7S0FDRjtDQUNGLENBQUE7QUFFRCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRTtJQUM3QixJQUFBLGlCQUFTLEVBQUMsR0FBRyxFQUFFO1FBQ2IsZ0JBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUNsRCxPQUFPLEdBQUcsRUFBRTtZQUNWLGdCQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDbEQsQ0FBQyxDQUFBO0lBQ0gsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ1IsQ0FBQyxDQUFBO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEtBQTBCLEVBQUUsRUFBRTtJQUN0RCxpQkFBaUIsRUFBRSxDQUFBO0lBRW5CLE9BQU8sQ0FDTCxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0VBQWdFLENBQzdFO01BQUEsQ0FBQyxVQUFjLENBQ2IsSUFBSSxLQUFLLENBQUMsQ0FDVixjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFFaEM7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxNQUFNLElBQUksR0FBRztJQUNYLEtBQUssRUFBRSw4QkFBOEI7SUFDckMsU0FBUyxFQUFFLGdCQUFnQjtJQUMzQixVQUFVLEVBQUU7UUFDVixNQUFNLEVBQUUsWUFBWTtRQUNwQixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLHdIQUF3SDthQUNwSTtTQUNGO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixLQUFLLEVBQUUsR0FBRztRQUNWLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFDbEMsQ0FBQztLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0NBQ3FCLENBQUE7QUFFekMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxVQUFVLEdBQVUsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IHR5cGUgeyBJQ2hhdEl0ZW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvY2hhdC9jaGF0L3R5cGUnXG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9hcHAvc3RvcmUnXG5pbXBvcnQgUHJvbXB0TG9nTW9kYWwgZnJvbSAnLidcblxudHlwZSBQcm9tcHRMb2dNb2RhbFByb3BzID0gUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIFByb21wdExvZ01vZGFsPlxuXG5jb25zdCBtb2NrTG9nSXRlbTogSUNoYXRJdGVtID0ge1xuICBpZDogJ21lc3NhZ2UtMScsXG4gIGlzQW5zd2VyOiB0cnVlLFxuICBjb250ZW50OiAnU3VtbWFyaXplIG91ciBtZWV0aW5nIG5vdGVzIGFib3V0IGxhdW5jaCBibG9ja2Vycy4nLFxuICBsb2c6IFtcbiAgICB7XG4gICAgICByb2xlOiAnc3lzdGVtJyxcbiAgICAgIHRleHQ6ICdZb3UgYXJlIGFuIGFzc2lzdGFudCB0aGF0IGV4dHJhY3RzIGtleSBsYXVuY2ggYmxvY2tlcnMgZnJvbSB0aGUgZGlhbG9ndWUuJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHJvbGU6ICd1c2VyJyxcbiAgICAgIHRleHQ6ICdUZWFtIGRpc2N1c3NlZCBRQSwgbWFya2V0aW5nIGFzc2V0cywgYW5kIGluZnJhIHJlYWRpbmVzcy4gSGlnaGxpZ2h0IHJpc2tzLicsXG4gICAgfSxcbiAgICB7XG4gICAgICByb2xlOiAnYXNzaXN0YW50JyxcbiAgICAgIHRleHQ6ICdCbG9ja2luZyBpdGVtczpcXG4xLiBRQSBuZWVkcyBzdGFnaW5nIGRhdGEgYnkgRnJpZGF5LlxcbjIuIE1hcmtldGluZyBhd2FpdGluZyBmaW5hbCB2aXN1YWxzLlxcbjMuIEluZnJhIHJvbGxvdXQgc3RpbGwgbWlzc2luZyBhcHByb3ZhbC4nLFxuICAgIH0sXG4gIF0sXG59XG5cbmNvbnN0IHVzZVByb21wdExvZ01vY2tzID0gKCkgPT4ge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHVzZVN0b3JlLmdldFN0YXRlKCkuc2V0Q3VycmVudExvZ0l0ZW0obW9ja0xvZ0l0ZW0pXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHVzZVN0b3JlLmdldFN0YXRlKCkuc2V0Q3VycmVudExvZ0l0ZW0odW5kZWZpbmVkKVxuICAgIH1cbiAgfSwgW10pXG59XG5cbmNvbnN0IFByb21wdExvZ1ByZXZpZXcgPSAocHJvcHM6IFByb21wdExvZ01vZGFsUHJvcHMpID0+IHtcbiAgdXNlUHJvbXB0TG9nTW9ja3MoKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSBtaW4taC1bNTQwcHhdIHctZnVsbCBiZy1iYWNrZ3JvdW5kLWRlZmF1bHQtc3VidGxlIHAtNlwiPlxuICAgICAgPFByb21wdExvZ01vZGFsXG4gICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgY3VycmVudExvZ0l0ZW09e21vY2tMb2dJdGVtfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5jb25zdCBtZXRhID0ge1xuICB0aXRsZTogJ0Jhc2UvRmVlZGJhY2svUHJvbXB0TG9nTW9kYWwnLFxuICBjb21wb25lbnQ6IFByb21wdExvZ1ByZXZpZXcsXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdmdWxsc2NyZWVuJyxcbiAgICBkb2NzOiB7XG4gICAgICBkZXNjcmlwdGlvbjoge1xuICAgICAgICBjb21wb25lbnQ6ICdTaG93cyB0aGUgcHJvbXB0IGFuZCBtZXNzYWdlIHRyYW5zY3JpcHQgdXNlZCBmb3IgYSBjaGF0IGNvbXBsZXRpb24sIHdpdGggY29weS10by1jbGlwYm9hcmQgc3VwcG9ydCBmb3Igc2luZ2xlIHByb21wdHMuJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYXJnczoge1xuICAgIHdpZHRoOiA5NjAsXG4gICAgb25DYW5jZWw6ICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdQcm9tcHQgbG9nIGNsb3NlZCcpXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxufSBzYXRpc2ZpZXMgTWV0YTx0eXBlb2YgUHJvbXB0TG9nUHJldmlldz5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgUGxheWdyb3VuZDogU3RvcnkgPSB7fVxuIl19