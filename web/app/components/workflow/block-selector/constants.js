"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOCKS = exports.ENTRY_NODE_TYPES = exports.START_BLOCKS = exports.DEFAULT_FILE_EXTENSIONS_IN_LOCAL_FILE_DATA_SOURCE = exports.BLOCK_CLASSIFICATIONS = void 0;
const types_1 = require("../types");
const types_2 = require("./types");
exports.BLOCK_CLASSIFICATIONS = [
    types_2.BlockClassificationEnum.Default,
    types_2.BlockClassificationEnum.QuestionUnderstand,
    types_2.BlockClassificationEnum.Logic,
    types_2.BlockClassificationEnum.Transform,
    types_2.BlockClassificationEnum.Utilities,
];
exports.DEFAULT_FILE_EXTENSIONS_IN_LOCAL_FILE_DATA_SOURCE = [
    'txt',
    'markdown',
    'mdx',
    'pdf',
    'html',
    'xlsx',
    'xls',
    'vtt',
    'properties',
    'doc',
    'docx',
    'csv',
    'eml',
    'msg',
    'pptx',
    'xml',
    'epub',
    'ppt',
    'md',
];
exports.START_BLOCKS = [
    {
        classification: types_2.BlockClassificationEnum.Default,
        type: types_1.BlockEnum.Start,
        title: 'User Input',
        description: 'Traditional start node for user input',
    },
    {
        classification: types_2.BlockClassificationEnum.Default,
        type: types_1.BlockEnum.TriggerSchedule,
        title: 'Schedule Trigger',
        description: 'Time-based workflow trigger',
    },
    {
        classification: types_2.BlockClassificationEnum.Default,
        type: types_1.BlockEnum.TriggerWebhook,
        title: 'Webhook Trigger',
        description: 'HTTP callback trigger',
    },
];
exports.ENTRY_NODE_TYPES = [
    types_1.BlockEnum.Start,
    types_1.BlockEnum.TriggerSchedule,
    types_1.BlockEnum.TriggerWebhook,
    types_1.BlockEnum.TriggerPlugin,
];
exports.BLOCKS = [
    {
        classification: types_2.BlockClassificationEnum.Default,
        type: types_1.BlockEnum.LLM,
        title: 'LLM',
    },
    {
        classification: types_2.BlockClassificationEnum.Default,
        type: types_1.BlockEnum.KnowledgeRetrieval,
        title: 'Knowledge Retrieval',
    },
    {
        classification: types_2.BlockClassificationEnum.Default,
        type: types_1.BlockEnum.End,
        title: 'End',
    },
    {
        classification: types_2.BlockClassificationEnum.Default,
        type: types_1.BlockEnum.Answer,
        title: 'Direct Answer',
    },
    {
        classification: types_2.BlockClassificationEnum.QuestionUnderstand,
        type: types_1.BlockEnum.QuestionClassifier,
        title: 'Question Classifier',
    },
    {
        classification: types_2.BlockClassificationEnum.Logic,
        type: types_1.BlockEnum.IfElse,
        title: 'IF/ELSE',
    },
    {
        classification: types_2.BlockClassificationEnum.Logic,
        type: types_1.BlockEnum.LoopEnd,
        title: 'Exit Loop',
        description: '',
    },
    {
        classification: types_2.BlockClassificationEnum.Logic,
        type: types_1.BlockEnum.Iteration,
        title: 'Iteration',
    },
    {
        classification: types_2.BlockClassificationEnum.Logic,
        type: types_1.BlockEnum.Loop,
        title: 'Loop',
    },
    {
        classification: types_2.BlockClassificationEnum.Transform,
        type: types_1.BlockEnum.Code,
        title: 'Code',
    },
    {
        classification: types_2.BlockClassificationEnum.Transform,
        type: types_1.BlockEnum.TemplateTransform,
        title: 'Templating Transform',
    },
    {
        classification: types_2.BlockClassificationEnum.Transform,
        type: types_1.BlockEnum.VariableAggregator,
        title: 'Variable Aggregator',
    },
    {
        classification: types_2.BlockClassificationEnum.Transform,
        type: types_1.BlockEnum.DocExtractor,
        title: 'Doc Extractor',
    },
    {
        classification: types_2.BlockClassificationEnum.Transform,
        type: types_1.BlockEnum.Assigner,
        title: 'Variable Assigner',
    },
    {
        classification: types_2.BlockClassificationEnum.Transform,
        type: types_1.BlockEnum.ParameterExtractor,
        title: 'Parameter Extractor',
    },
    {
        classification: types_2.BlockClassificationEnum.Utilities,
        type: types_1.BlockEnum.HttpRequest,
        title: 'HTTP Request',
    },
    {
        classification: types_2.BlockClassificationEnum.Utilities,
        type: types_1.BlockEnum.ListFilter,
        title: 'List Filter',
    },
    {
        classification: types_2.BlockClassificationEnum.Default,
        type: types_1.BlockEnum.Agent,
        title: 'Agent',
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uc3RhbnRzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxvQ0FBb0M7QUFDcEMsbUNBQWlEO0FBRXBDLFFBQUEscUJBQXFCLEdBQUc7SUFDbkMsK0JBQXVCLENBQUMsT0FBTztJQUMvQiwrQkFBdUIsQ0FBQyxrQkFBa0I7SUFDMUMsK0JBQXVCLENBQUMsS0FBSztJQUM3QiwrQkFBdUIsQ0FBQyxTQUFTO0lBQ2pDLCtCQUF1QixDQUFDLFNBQVM7Q0FDekIsQ0FBQTtBQUVHLFFBQUEsaURBQWlELEdBQUc7SUFDL0QsS0FBSztJQUNMLFVBQVU7SUFDVixLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07SUFDTixNQUFNO0lBQ04sS0FBSztJQUNMLEtBQUs7SUFDTCxZQUFZO0lBQ1osS0FBSztJQUNMLE1BQU07SUFDTixLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxNQUFNO0lBQ04sS0FBSztJQUNMLE1BQU07SUFDTixLQUFLO0lBQ0wsSUFBSTtDQUNMLENBQUE7QUFFWSxRQUFBLFlBQVksR0FBRztJQUMxQjtRQUNFLGNBQWMsRUFBRSwrQkFBdUIsQ0FBQyxPQUFPO1FBQy9DLElBQUksRUFBRSxpQkFBUyxDQUFDLEtBQUs7UUFDckIsS0FBSyxFQUFFLFlBQVk7UUFDbkIsV0FBVyxFQUFFLHVDQUF1QztLQUNyRDtJQUNEO1FBQ0UsY0FBYyxFQUFFLCtCQUF1QixDQUFDLE9BQU87UUFDL0MsSUFBSSxFQUFFLGlCQUFTLENBQUMsZUFBZTtRQUMvQixLQUFLLEVBQUUsa0JBQWtCO1FBQ3pCLFdBQVcsRUFBRSw2QkFBNkI7S0FDM0M7SUFDRDtRQUNFLGNBQWMsRUFBRSwrQkFBdUIsQ0FBQyxPQUFPO1FBQy9DLElBQUksRUFBRSxpQkFBUyxDQUFDLGNBQWM7UUFDOUIsS0FBSyxFQUFFLGlCQUFpQjtRQUN4QixXQUFXLEVBQUUsdUJBQXVCO0tBQ3JDO0NBQ2tDLENBQUE7QUFF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YUFBYTtLQUNyQjtJQUNEO1FBQ0UsY0FBYyxFQUFFLCtCQUF1QixDQUFDLE9BQU87UUFDL0MsSUFBSSxFQUFFLGlCQUFTLENBQUMsS0FBSztRQUNyQixLQUFLLEVBQUUsT0FBTztLQUNmO0NBQ2tDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IEJsb2NrIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBCbG9ja0VudW0gfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB7IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGNvbnN0IEJMT0NLX0NMQVNTSUZJQ0FUSU9OUyA9IFtcbiAgQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uRGVmYXVsdCxcbiAgQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uUXVlc3Rpb25VbmRlcnN0YW5kLFxuICBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5Mb2dpYyxcbiAgQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uVHJhbnNmb3JtLFxuICBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5VdGlsaXRpZXMsXG5dIGFzIGNvbnN0XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0ZJTEVfRVhURU5TSU9OU19JTl9MT0NBTF9GSUxFX0RBVEFfU09VUkNFID0gW1xuICAndHh0JyxcbiAgJ21hcmtkb3duJyxcbiAgJ21keCcsXG4gICdwZGYnLFxuICAnaHRtbCcsXG4gICd4bHN4JyxcbiAgJ3hscycsXG4gICd2dHQnLFxuICAncHJvcGVydGllcycsXG4gICdkb2MnLFxuICAnZG9jeCcsXG4gICdjc3YnLFxuICAnZW1sJyxcbiAgJ21zZycsXG4gICdwcHR4JyxcbiAgJ3htbCcsXG4gICdlcHViJyxcbiAgJ3BwdCcsXG4gICdtZCcsXG5dXG5cbmV4cG9ydCBjb25zdCBTVEFSVF9CTE9DS1MgPSBbXG4gIHtcbiAgICBjbGFzc2lmaWNhdGlvbjogQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uRGVmYXVsdCxcbiAgICB0eXBlOiBCbG9ja0VudW0uU3RhcnQsXG4gICAgdGl0bGU6ICdVc2VyIElucHV0JyxcbiAgICBkZXNjcmlwdGlvbjogJ1RyYWRpdGlvbmFsIHN0YXJ0IG5vZGUgZm9yIHVzZXIgaW5wdXQnLFxuICB9LFxuICB7XG4gICAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLkRlZmF1bHQsXG4gICAgdHlwZTogQmxvY2tFbnVtLlRyaWdnZXJTY2hlZHVsZSxcbiAgICB0aXRsZTogJ1NjaGVkdWxlIFRyaWdnZXInLFxuICAgIGRlc2NyaXB0aW9uOiAnVGltZS1iYXNlZCB3b3JrZmxvdyB0cmlnZ2VyJyxcbiAgfSxcbiAge1xuICAgIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5EZWZhdWx0LFxuICAgIHR5cGU6IEJsb2NrRW51bS5UcmlnZ2VyV2ViaG9vayxcbiAgICB0aXRsZTogJ1dlYmhvb2sgVHJpZ2dlcicsXG4gICAgZGVzY3JpcHRpb246ICdIVFRQIGNhbGxiYWNrIHRyaWdnZXInLFxuICB9LFxuXSBhcyBjb25zdCBzYXRpc2ZpZXMgcmVhZG9ubHkgQmxvY2tbXVxuXG5leHBvcnQgY29uc3QgRU5UUllfTk9ERV9UWVBFUyA9IFtcbiAgQmxvY2tFbnVtLlN0YXJ0LFxuICBCbG9ja0VudW0uVHJpZ2dlclNjaGVkdWxlLFxuICBCbG9ja0VudW0uVHJpZ2dlcldlYmhvb2ssXG4gIEJsb2NrRW51bS5UcmlnZ2VyUGx1Z2luLFxuXSBhcyBjb25zdFxuXG5leHBvcnQgY29uc3QgQkxPQ0tTID0gW1xuICB7XG4gICAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLkRlZmF1bHQsXG4gICAgdHlwZTogQmxvY2tFbnVtLkxMTSxcbiAgICB0aXRsZTogJ0xMTScsXG4gIH0sXG4gIHtcbiAgICBjbGFzc2lmaWNhdGlvbjogQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uRGVmYXVsdCxcbiAgICB0eXBlOiBCbG9ja0VudW0uS25vd2xlZGdlUmV0cmlldmFsLFxuICAgIHRpdGxlOiAnS25vd2xlZGdlIFJldHJpZXZhbCcsXG4gIH0sXG4gIHtcbiAgICBjbGFzc2lmaWNhdGlvbjogQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uRGVmYXVsdCxcbiAgICB0eXBlOiBCbG9ja0VudW0uRW5kLFxuICAgIHRpdGxlOiAnRW5kJyxcbiAgfSxcbiAge1xuICAgIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5EZWZhdWx0LFxuICAgIHR5cGU6IEJsb2NrRW51bS5BbnN3ZXIsXG4gICAgdGl0bGU6ICdEaXJlY3QgQW5zd2VyJyxcbiAgfSxcbiAge1xuICAgIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5RdWVzdGlvblVuZGVyc3RhbmQsXG4gICAgdHlwZTogQmxvY2tFbnVtLlF1ZXN0aW9uQ2xhc3NpZmllcixcbiAgICB0aXRsZTogJ1F1ZXN0aW9uIENsYXNzaWZpZXInLFxuICB9LFxuICB7XG4gICAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLkxvZ2ljLFxuICAgIHR5cGU6IEJsb2NrRW51bS5JZkVsc2UsXG4gICAgdGl0bGU6ICdJRi9FTFNFJyxcbiAgfSxcbiAge1xuICAgIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5Mb2dpYyxcbiAgICB0eXBlOiBCbG9ja0VudW0uTG9vcEVuZCxcbiAgICB0aXRsZTogJ0V4aXQgTG9vcCcsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICB9LFxuICB7XG4gICAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLkxvZ2ljLFxuICAgIHR5cGU6IEJsb2NrRW51bS5JdGVyYXRpb24sXG4gICAgdGl0bGU6ICdJdGVyYXRpb24nLFxuICB9LFxuICB7XG4gICAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLkxvZ2ljLFxuICAgIHR5cGU6IEJsb2NrRW51bS5Mb29wLFxuICAgIHRpdGxlOiAnTG9vcCcsXG4gIH0sXG4gIHtcbiAgICBjbGFzc2lmaWNhdGlvbjogQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uVHJhbnNmb3JtLFxuICAgIHR5cGU6IEJsb2NrRW51bS5Db2RlLFxuICAgIHRpdGxlOiAnQ29kZScsXG4gIH0sXG4gIHtcbiAgICBjbGFzc2lmaWNhdGlvbjogQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uVHJhbnNmb3JtLFxuICAgIHR5cGU6IEJsb2NrRW51bS5UZW1wbGF0ZVRyYW5zZm9ybSxcbiAgICB0aXRsZTogJ1RlbXBsYXRpbmcgVHJhbnNmb3JtJyxcbiAgfSxcbiAge1xuICAgIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5UcmFuc2Zvcm0sXG4gICAgdHlwZTogQmxvY2tFbnVtLlZhcmlhYmxlQWdncmVnYXRvcixcbiAgICB0aXRsZTogJ1ZhcmlhYmxlIEFnZ3JlZ2F0b3InLFxuICB9LFxuICB7XG4gICAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLlRyYW5zZm9ybSxcbiAgICB0eXBlOiBCbG9ja0VudW0uRG9jRXh0cmFjdG9yLFxuICAgIHRpdGxlOiAnRG9jIEV4dHJhY3RvcicsXG4gIH0sXG4gIHtcbiAgICBjbGFzc2lmaWNhdGlvbjogQmxvY2tDbGFzc2lmaWNhdGlvbkVudW0uVHJhbnNmb3JtLFxuICAgIHR5cGU6IEJsb2NrRW51bS5Bc3NpZ25lcixcbiAgICB0aXRsZTogJ1ZhcmlhYmxlIEFzc2lnbmVyJyxcbiAgfSxcbiAge1xuICAgIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5UcmFuc2Zvcm0sXG4gICAgdHlwZTogQmxvY2tFbnVtLlBhcmFtZXRlckV4dHJhY3RvcixcbiAgICB0aXRsZTogJ1BhcmFtZXRlciBFeHRyYWN0b3InLFxuICB9LFxuICB7XG4gICAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLlV0aWxpdGllcyxcbiAgICB0eXBlOiBCbG9ja0VudW0uSHR0cFJlcXVlc3QsXG4gICAgdGl0bGU6ICdIVFRQIFJlcXVlc3QnLFxuICB9LFxuICB7XG4gICAgY2xhc3NpZmljYXRpb246IEJsb2NrQ2xhc3NpZmljYXRpb25FbnVtLlV0aWxpdGllcyxcbiAgICB0eXBlOiBCbG9ja0VudW0uTGlzdEZpbHRlcixcbiAgICB0aXRsZTogJ0xpc3QgRmlsdGVyJyxcbiAgfSxcbiAge1xuICAgIGNsYXNzaWZpY2F0aW9uOiBCbG9ja0NsYXNzaWZpY2F0aW9uRW51bS5EZWZhdWx0LFxuICAgIHR5cGU6IEJsb2NrRW51bS5BZ2VudCxcbiAgICB0aXRsZTogJ0FnZW50JyxcbiAgfSxcbl0gYXMgY29uc3Qgc2F0aXNmaWVzIHJlYWRvbmx5IEJsb2NrW11cbiJdfQ==