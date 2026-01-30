import type { AgentLogDetailRequest, AgentLogDetailResponse, ChatMessagesRequest, ChatMessagesResponse, LogMessageAnnotationsRequest, LogMessageAnnotationsResponse, LogMessageFeedbacksRequest, LogMessageFeedbacksResponse, WorkflowRunDetailResponse } from '@/models/log';
import type { NodeTracingListResponse } from '@/types/workflow';
export declare const fetchChatMessages: ({ url, params }: {
    url: string;
    params: ChatMessagesRequest;
}) => Promise<ChatMessagesResponse>;
export declare const updateLogMessageFeedbacks: ({ url, body }: {
    url: string;
    body: LogMessageFeedbacksRequest;
}) => Promise<LogMessageFeedbacksResponse>;
export declare const updateLogMessageAnnotations: ({ url, body }: {
    url: string;
    body: LogMessageAnnotationsRequest;
}) => Promise<LogMessageAnnotationsResponse>;
export declare const fetchRunDetail: (url: string) => Promise<WorkflowRunDetailResponse>;
export declare const fetchTracingList: ({ url }: {
    url: string;
}) => Promise<NodeTracingListResponse>;
export declare const fetchAgentLogDetail: ({ appID, params }: {
    appID: string;
    params: AgentLogDetailRequest;
}) => Promise<AgentLogDetailResponse>;
