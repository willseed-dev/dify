import type { CustomCollectionBackend, WorkflowToolProviderRequest } from '@/app/components/tools/types';
export declare const fetchCollectionList: () => Promise<any>;
export declare const fetchCollectionDetail: (collectionName: string) => Promise<any>;
export declare const fetchBuiltInToolList: (collectionName: string) => Promise<any>;
export declare const fetchCustomToolList: (collectionName: string) => Promise<any>;
export declare const fetchModelToolList: (collectionName: string) => Promise<any>;
export declare const fetchWorkflowToolList: (appID: string) => Promise<any>;
export declare const fetchBuiltInToolCredentialSchema: (collectionName: string) => Promise<any>;
export declare const fetchBuiltInToolCredential: (collectionName: string) => Promise<any>;
export declare const updateBuiltInToolCredential: (collectionName: string, credential: Record<string, any>) => Promise<any>;
export declare const removeBuiltInToolCredential: (collectionName: string) => Promise<any>;
export declare const parseParamsSchema: (schema: string) => Promise<any>;
export declare const fetchCustomCollection: (collectionName: string) => Promise<any>;
export declare const createCustomCollection: (collection: CustomCollectionBackend) => Promise<any>;
export declare const updateCustomCollection: (collection: CustomCollectionBackend) => Promise<any>;
export declare const removeCustomCollection: (collectionName: string) => Promise<any>;
export declare const importSchemaFromURL: (url: string) => Promise<any>;
export declare const testAPIAvailable: (payload: any) => Promise<any>;
export declare const createWorkflowToolProvider: (payload: WorkflowToolProviderRequest & {
    workflow_app_id: string;
}) => Promise<any>;
export declare const saveWorkflowToolProvider: (payload: WorkflowToolProviderRequest & Partial<{
    workflow_app_id: string;
    workflow_tool_id: string;
}>) => Promise<any>;
export declare const fetchWorkflowToolDetailByAppID: (appID: string) => Promise<any>;
export declare const fetchWorkflowToolDetail: (toolID: string) => Promise<any>;
export declare const deleteWorkflowTool: (toolID: string) => Promise<any>;
