import { DifyClient } from "./base";
import type { CompletionRequest, CompletionResponse } from "../types/completion";
import type { DifyResponse, DifyStream } from "../types/common";
export declare class CompletionClient extends DifyClient {
    createCompletionMessage(request: CompletionRequest): Promise<DifyResponse<CompletionResponse> | DifyStream<CompletionResponse>>;
    createCompletionMessage(inputs: Record<string, unknown>, user: string, stream?: boolean, files?: Array<Record<string, unknown>> | null): Promise<DifyResponse<CompletionResponse> | DifyStream<CompletionResponse>>;
    stopCompletionMessage(taskId: string, user: string): Promise<DifyResponse<CompletionResponse>>;
    stop(taskId: string, user: string): Promise<DifyResponse<CompletionResponse>>;
    runWorkflow(inputs: Record<string, unknown>, user: string, stream?: boolean): Promise<DifyResponse<Record<string, unknown>> | DifyStream<Record<string, unknown>>>;
}
