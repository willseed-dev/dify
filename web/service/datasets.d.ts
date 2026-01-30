import type { CreateExternalAPIReq } from '@/app/components/datasets/external-api/declarations';
import type { CreateKnowledgeBaseReq } from '@/app/components/datasets/external-knowledge-base/create/declarations';
import type { ApiKeysListResponse, CreateApiKeyResponse } from '@/models/app';
import type { CommonResponse, DataSourceNotionWorkspace } from '@/models/common';
import type { CreateDocumentReq, createDocumentResponse, DataSet, DataSetListResponse, ErrorDocsResponse, ExternalAPIDeleteResponse, ExternalAPIItem, ExternalAPIListResponse, ExternalAPIUsage, ExternalKnowledgeBaseHitTestingResponse, ExternalKnowledgeItem, FetchDatasetsParams, FileIndexingEstimateResponse, HitTestingRecordsResponse, HitTestingResponse, IndexingEstimateParams, IndexingEstimateResponse, IndexingStatusBatchResponse, IndexingStatusResponse, ProcessRuleResponse, RelatedAppResponse } from '@/models/datasets';
import type { RetrievalConfig } from '@/types/app';
type CommonDocReq = {
    datasetId: string;
    documentId: string;
};
type BatchReq = {
    datasetId: string;
    batchId: string;
};
export type SortType = 'created_at' | 'hit_count' | '-created_at' | '-hit_count';
export type MetadataType = 'all' | 'only' | 'without';
export declare const fetchDatasetDetail: (datasetId: string) => Promise<DataSet>;
export declare const updateDatasetSetting: ({ datasetId, body, }: {
    datasetId: string;
    body: Partial<Pick<DataSet, "name" | "description" | "permission" | "partial_member_list" | "indexing_technique" | "retrieval_model" | "embedding_model" | "embedding_model_provider" | "icon_info" | "doc_form">>;
}) => Promise<DataSet>;
export declare const fetchDatasetRelatedApps: (datasetId: string) => Promise<RelatedAppResponse>;
export declare const fetchDatasets: ({ url, params }: FetchDatasetsParams) => Promise<DataSetListResponse>;
export declare const createEmptyDataset: ({ name }: {
    name: string;
}) => Promise<DataSet>;
export declare const checkIsUsedInApp: (id: string) => Promise<{
    is_using: boolean;
}>;
export declare const deleteDataset: (datasetID: string) => Promise<DataSet>;
export declare const fetchExternalAPIList: ({ url }: {
    url: string;
}) => Promise<ExternalAPIListResponse>;
export declare const fetchExternalAPI: ({ apiTemplateId }: {
    apiTemplateId: string;
}) => Promise<ExternalAPIItem>;
export declare const updateExternalAPI: ({ apiTemplateId, body }: {
    apiTemplateId: string;
    body: ExternalAPIItem;
}) => Promise<ExternalAPIItem>;
export declare const deleteExternalAPI: ({ apiTemplateId }: {
    apiTemplateId: string;
}) => Promise<ExternalAPIDeleteResponse>;
export declare const checkUsageExternalAPI: ({ apiTemplateId }: {
    apiTemplateId: string;
}) => Promise<ExternalAPIUsage>;
export declare const createExternalAPI: ({ body }: {
    body: CreateExternalAPIReq;
}) => Promise<ExternalAPIItem>;
export declare const createExternalKnowledgeBase: ({ body }: {
    body: CreateKnowledgeBaseReq;
}) => Promise<ExternalKnowledgeItem>;
export declare const fetchDefaultProcessRule: ({ url }: {
    url: string;
}) => Promise<ProcessRuleResponse>;
export declare const fetchProcessRule: ({ params: { documentId } }: {
    params: {
        documentId: string;
    };
}) => Promise<ProcessRuleResponse>;
export declare const createFirstDocument: ({ body }: {
    body: CreateDocumentReq;
}) => Promise<createDocumentResponse>;
export declare const createDocument: ({ datasetId, body }: {
    datasetId: string;
    body: CreateDocumentReq;
}) => Promise<createDocumentResponse>;
export declare const fetchIndexingEstimate: ({ datasetId, documentId }: CommonDocReq) => Promise<IndexingEstimateResponse>;
export declare const fetchIndexingEstimateBatch: ({ datasetId, batchId }: BatchReq) => Promise<IndexingEstimateResponse>;
export declare const fetchIndexingStatus: ({ datasetId, documentId }: CommonDocReq) => Promise<IndexingStatusResponse>;
export declare const fetchIndexingStatusBatch: ({ datasetId, batchId }: BatchReq) => Promise<IndexingStatusBatchResponse>;
export declare const renameDocumentName: ({ datasetId, documentId, name }: CommonDocReq & {
    name: string;
}) => Promise<CommonResponse>;
export declare const pauseDocIndexing: ({ datasetId, documentId }: CommonDocReq) => Promise<CommonResponse>;
export declare const resumeDocIndexing: ({ datasetId, documentId }: CommonDocReq) => Promise<CommonResponse>;
export declare const preImportNotionPages: ({ url, datasetId }: {
    url: string;
    datasetId?: string;
}) => Promise<{
    notion_info: DataSourceNotionWorkspace[];
}>;
export declare const modifyDocMetadata: ({ datasetId, documentId, body }: CommonDocReq & {
    body: {
        doc_type: string;
        doc_metadata: Record<string, any>;
    };
}) => Promise<CommonResponse>;
export declare const hitTesting: ({ datasetId, queryText, retrieval_model }: {
    datasetId: string;
    queryText: string;
    retrieval_model: RetrievalConfig;
}) => Promise<HitTestingResponse>;
export declare const externalKnowledgeBaseHitTesting: ({ datasetId, query, external_retrieval_model }: {
    datasetId: string;
    query: string;
    external_retrieval_model: {
        top_k: number;
        score_threshold: number;
        score_threshold_enabled: boolean;
    };
}) => Promise<ExternalKnowledgeBaseHitTestingResponse>;
export declare const fetchTestingRecords: ({ datasetId, params }: {
    datasetId: string;
    params: {
        page: number;
        limit: number;
    };
}) => Promise<HitTestingRecordsResponse>;
export declare const fetchFileIndexingEstimate: (body: IndexingEstimateParams) => Promise<FileIndexingEstimateResponse>;
export declare const fetchNotionPagePreview: ({ pageID, pageType, credentialID }: {
    pageID: string;
    pageType: string;
    credentialID: string;
}) => Promise<{
    content: string;
}>;
export declare const fetchApiKeysList: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<ApiKeysListResponse>;
export declare const delApikey: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<CommonResponse>;
export declare const createApikey: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<CreateApiKeyResponse>;
export declare const fetchDataSources: () => Promise<CommonResponse>;
export declare const createDataSourceApiKeyBinding: (body: Record<string, any>) => Promise<CommonResponse>;
export declare const removeDataSourceApiKeyBinding: (id: string) => Promise<CommonResponse>;
export declare const createFirecrawlTask: (body: Record<string, any>) => Promise<CommonResponse>;
export declare const checkFirecrawlTaskStatus: (jobId: string) => Promise<CommonResponse>;
export declare const createJinaReaderTask: (body: Record<string, any>) => Promise<CommonResponse>;
export declare const checkJinaReaderTaskStatus: (jobId: string) => Promise<CommonResponse>;
export declare const createWatercrawlTask: (body: Record<string, any>) => Promise<CommonResponse>;
export declare const checkWatercrawlTaskStatus: (jobId: string) => Promise<CommonResponse>;
export type FileTypesRes = {
    allowed_extensions: string[];
};
export declare const fetchSupportFileTypes: ({ url }: {
    url: string;
}) => Promise<FileTypesRes>;
export declare const getErrorDocs: ({ datasetId }: {
    datasetId: string;
}) => Promise<ErrorDocsResponse>;
export declare const retryErrorDocs: ({ datasetId, document_ids }: {
    datasetId: string;
    document_ids: string[];
}) => Promise<CommonResponse>;
export {};
