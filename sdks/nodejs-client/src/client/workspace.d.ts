import { DifyClient } from "./base";
import type { WorkspaceModelType, WorkspaceModelsResponse } from "../types/workspace";
import type { DifyResponse } from "../types/common";
export declare class WorkspaceClient extends DifyClient {
    getModelsByType(modelType: WorkspaceModelType): Promise<DifyResponse<WorkspaceModelsResponse>>;
}
