import type { BinaryStream, DifyClientConfig, DifyResponse, MessageFeedbackRequest, QueryParams, RequestMethod, TextToAudioRequest } from "../types/common";
import { HttpClient } from "../http/client";
export declare class DifyClient {
    protected http: HttpClient;
    constructor(config: string | DifyClientConfig | HttpClient, baseUrl?: string);
    updateApiKey(apiKey: string): void;
    getHttpClient(): HttpClient;
    sendRequest(method: RequestMethod, endpoint: string, data?: unknown, params?: QueryParams | null, stream?: boolean, headerParams?: Record<string, string>): ReturnType<HttpClient["requestRaw"]>;
    getRoot(): Promise<DifyResponse<unknown>>;
    getApplicationParameters(user?: string): Promise<DifyResponse<unknown>>;
    getParameters(user?: string): Promise<DifyResponse<unknown>>;
    getMeta(user?: string): Promise<DifyResponse<unknown>>;
    messageFeedback(request: MessageFeedbackRequest): Promise<DifyResponse<Record<string, unknown>>>;
    messageFeedback(messageId: string, rating: "like" | "dislike" | null, user: string, content?: string): Promise<DifyResponse<Record<string, unknown>>>;
    getInfo(user?: string): Promise<DifyResponse<unknown>>;
    getSite(user?: string): Promise<DifyResponse<unknown>>;
    fileUpload(form: unknown, user: string): Promise<DifyResponse<unknown>>;
    filePreview(fileId: string, user: string, asAttachment?: boolean): Promise<DifyResponse<Buffer>>;
    audioToText(form: unknown, user: string): Promise<DifyResponse<unknown>>;
    textToAudio(request: TextToAudioRequest): Promise<DifyResponse<Buffer> | BinaryStream>;
    textToAudio(text: string, user: string, streaming?: boolean, voice?: string): Promise<DifyResponse<Buffer> | BinaryStream>;
}
