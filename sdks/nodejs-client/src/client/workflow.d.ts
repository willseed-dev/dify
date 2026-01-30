import { DifyClient } from "./base";
import type { WorkflowRunRequest, WorkflowRunResponse } from "../types/workflow";
import type { DifyResponse, DifyStream } from "../types/common";
export declare class WorkflowClient extends DifyClient {
    run(request: WorkflowRunRequest): Promise<DifyResponse<WorkflowRunResponse> | DifyStream<WorkflowRunResponse>>;
    run(inputs: Record<string, unknown>, user: string, stream?: boolean): Promise<DifyResponse<WorkflowRunResponse> | DifyStream<WorkflowRunResponse>>;
    runById(workflowId: string, request: WorkflowRunRequest): Promise<DifyResponse<WorkflowRunResponse> | DifyStream<WorkflowRunResponse>>;
    getRun(workflowRunId: string): Promise<DifyResponse<WorkflowRunResponse>>;
    stop(taskId: string, user: string): Promise<DifyResponse<WorkflowRunResponse>>;
    /**
     * Get workflow execution logs with filtering options.
     *
     * Note: The backend API filters by `createdByEndUserSessionId` (end user session ID)
     * or `createdByAccount` (account ID), not by a generic `user` parameter.
     */
    getLogs(options?: {
        keyword?: string;
        status?: string;
        createdAtBefore?: string;
        createdAtAfter?: string;
        createdByEndUserSessionId?: string;
        createdByAccount?: string;
        page?: number;
        limit?: number;
        startTime?: string;
        endTime?: string;
    }): Promise<DifyResponse<Record<string, unknown>>>;
}
