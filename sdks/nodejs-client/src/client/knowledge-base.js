"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeBaseClient = void 0;
const base_1 = require("./base");
const validation_1 = require("./validation");
const dify_error_1 = require("../errors/dify-error");
const form_data_1 = require("../http/form-data");
const warned = new Set();
const warnOnce = (message) => {
    if (warned.has(message)) {
        return;
    }
    warned.add(message);
    console.warn(message);
};
const ensureFormData = (form, context) => {
    if (!(0, form_data_1.isFormData)(form)) {
        throw new dify_error_1.FileUploadError(`${context} requires FormData`);
    }
};
const ensureNonEmptyArray = (value, name) => {
    if (!Array.isArray(value) || value.length === 0) {
        throw new dify_error_1.ValidationError(`${name} must be a non-empty array`);
    }
};
const warnPipelineRoutes = () => {
    warnOnce("RAG pipeline endpoints may be unavailable unless the service API registers dataset/rag_pipeline routes.");
};
class KnowledgeBaseClient extends base_1.DifyClient {
    async listDatasets(options) {
        (0, validation_1.ensureOptionalInt)(options?.page, "page");
        (0, validation_1.ensureOptionalInt)(options?.limit, "limit");
        (0, validation_1.ensureOptionalString)(options?.keyword, "keyword");
        (0, validation_1.ensureOptionalBoolean)(options?.includeAll, "includeAll");
        const query = {
            page: options?.page,
            limit: options?.limit,
            keyword: options?.keyword ?? undefined,
            include_all: options?.includeAll ?? undefined,
        };
        if (options?.tagIds && options.tagIds.length > 0) {
            (0, validation_1.ensureStringArray)(options.tagIds, "tagIds");
            query.tag_ids = options.tagIds;
        }
        return this.http.request({
            method: "GET",
            path: "/datasets",
            query,
        });
    }
    async createDataset(request) {
        (0, validation_1.ensureNonEmptyString)(request.name, "name");
        return this.http.request({
            method: "POST",
            path: "/datasets",
            data: request,
        });
    }
    async getDataset(datasetId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}`,
        });
    }
    async updateDataset(datasetId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        if (request.name !== undefined && request.name !== null) {
            (0, validation_1.ensureNonEmptyString)(request.name, "name");
        }
        return this.http.request({
            method: "PATCH",
            path: `/datasets/${datasetId}`,
            data: request,
        });
    }
    async deleteDataset(datasetId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        return this.http.request({
            method: "DELETE",
            path: `/datasets/${datasetId}`,
        });
    }
    async updateDocumentStatus(datasetId, action, documentIds) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(action, "action");
        (0, validation_1.ensureStringArray)(documentIds, "documentIds");
        return this.http.request({
            method: "PATCH",
            path: `/datasets/${datasetId}/documents/status/${action}`,
            data: {
                document_ids: documentIds,
            },
        });
    }
    async listTags() {
        return this.http.request({
            method: "GET",
            path: "/datasets/tags",
        });
    }
    async createTag(request) {
        (0, validation_1.ensureNonEmptyString)(request.name, "name");
        return this.http.request({
            method: "POST",
            path: "/datasets/tags",
            data: request,
        });
    }
    async updateTag(request) {
        (0, validation_1.ensureNonEmptyString)(request.tag_id, "tag_id");
        (0, validation_1.ensureNonEmptyString)(request.name, "name");
        return this.http.request({
            method: "PATCH",
            path: "/datasets/tags",
            data: request,
        });
    }
    async deleteTag(request) {
        (0, validation_1.ensureNonEmptyString)(request.tag_id, "tag_id");
        return this.http.request({
            method: "DELETE",
            path: "/datasets/tags",
            data: request,
        });
    }
    async bindTags(request) {
        (0, validation_1.ensureStringArray)(request.tag_ids, "tag_ids");
        (0, validation_1.ensureNonEmptyString)(request.target_id, "target_id");
        return this.http.request({
            method: "POST",
            path: "/datasets/tags/binding",
            data: request,
        });
    }
    async unbindTags(request) {
        (0, validation_1.ensureNonEmptyString)(request.tag_id, "tag_id");
        (0, validation_1.ensureNonEmptyString)(request.target_id, "target_id");
        return this.http.request({
            method: "POST",
            path: "/datasets/tags/unbinding",
            data: request,
        });
    }
    async getDatasetTags(datasetId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/tags`,
        });
    }
    async createDocumentByText(datasetId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(request.name, "name");
        (0, validation_1.ensureNonEmptyString)(request.text, "text");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/document/create_by_text`,
            data: request,
        });
    }
    async updateDocumentByText(datasetId, documentId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        if (request.name !== undefined && request.name !== null) {
            (0, validation_1.ensureNonEmptyString)(request.name, "name");
        }
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/documents/${documentId}/update_by_text`,
            data: request,
        });
    }
    async createDocumentByFile(datasetId, form) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        ensureFormData(form, "createDocumentByFile");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/document/create_by_file`,
            data: form,
        });
    }
    async updateDocumentByFile(datasetId, documentId, form) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        ensureFormData(form, "updateDocumentByFile");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/documents/${documentId}/update_by_file`,
            data: form,
        });
    }
    async listDocuments(datasetId, options) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureOptionalInt)(options?.page, "page");
        (0, validation_1.ensureOptionalInt)(options?.limit, "limit");
        (0, validation_1.ensureOptionalString)(options?.keyword, "keyword");
        (0, validation_1.ensureOptionalString)(options?.status, "status");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/documents`,
            query: {
                page: options?.page,
                limit: options?.limit,
                keyword: options?.keyword ?? undefined,
                status: options?.status ?? undefined,
            },
        });
    }
    async getDocument(datasetId, documentId, options) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        if (options?.metadata) {
            const allowed = new Set(["all", "only", "without"]);
            if (!allowed.has(options.metadata)) {
                throw new dify_error_1.ValidationError("metadata must be one of all, only, without");
            }
        }
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/documents/${documentId}`,
            query: {
                metadata: options?.metadata ?? undefined,
            },
        });
    }
    async deleteDocument(datasetId, documentId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        return this.http.request({
            method: "DELETE",
            path: `/datasets/${datasetId}/documents/${documentId}`,
        });
    }
    async getDocumentIndexingStatus(datasetId, batch) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(batch, "batch");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/documents/${batch}/indexing-status`,
        });
    }
    async createSegments(datasetId, documentId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        ensureNonEmptyArray(request.segments, "segments");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/documents/${documentId}/segments`,
            data: request,
        });
    }
    async listSegments(datasetId, documentId, options) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        (0, validation_1.ensureOptionalInt)(options?.page, "page");
        (0, validation_1.ensureOptionalInt)(options?.limit, "limit");
        (0, validation_1.ensureOptionalString)(options?.keyword, "keyword");
        if (options?.status && options.status.length > 0) {
            (0, validation_1.ensureStringArray)(options.status, "status");
        }
        const query = {
            page: options?.page,
            limit: options?.limit,
            keyword: options?.keyword ?? undefined,
        };
        if (options?.status && options.status.length > 0) {
            query.status = options.status;
        }
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/documents/${documentId}/segments`,
            query,
        });
    }
    async getSegment(datasetId, documentId, segmentId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        (0, validation_1.ensureNonEmptyString)(segmentId, "segmentId");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/documents/${documentId}/segments/${segmentId}`,
        });
    }
    async updateSegment(datasetId, documentId, segmentId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        (0, validation_1.ensureNonEmptyString)(segmentId, "segmentId");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/documents/${documentId}/segments/${segmentId}`,
            data: request,
        });
    }
    async deleteSegment(datasetId, documentId, segmentId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        (0, validation_1.ensureNonEmptyString)(segmentId, "segmentId");
        return this.http.request({
            method: "DELETE",
            path: `/datasets/${datasetId}/documents/${documentId}/segments/${segmentId}`,
        });
    }
    async createChildChunk(datasetId, documentId, segmentId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        (0, validation_1.ensureNonEmptyString)(segmentId, "segmentId");
        (0, validation_1.ensureNonEmptyString)(request.content, "content");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/documents/${documentId}/segments/${segmentId}/child_chunks`,
            data: request,
        });
    }
    async listChildChunks(datasetId, documentId, segmentId, options) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        (0, validation_1.ensureNonEmptyString)(segmentId, "segmentId");
        (0, validation_1.ensureOptionalInt)(options?.page, "page");
        (0, validation_1.ensureOptionalInt)(options?.limit, "limit");
        (0, validation_1.ensureOptionalString)(options?.keyword, "keyword");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/documents/${documentId}/segments/${segmentId}/child_chunks`,
            query: {
                page: options?.page,
                limit: options?.limit,
                keyword: options?.keyword ?? undefined,
            },
        });
    }
    async updateChildChunk(datasetId, documentId, segmentId, childChunkId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        (0, validation_1.ensureNonEmptyString)(segmentId, "segmentId");
        (0, validation_1.ensureNonEmptyString)(childChunkId, "childChunkId");
        (0, validation_1.ensureNonEmptyString)(request.content, "content");
        return this.http.request({
            method: "PATCH",
            path: `/datasets/${datasetId}/documents/${documentId}/segments/${segmentId}/child_chunks/${childChunkId}`,
            data: request,
        });
    }
    async deleteChildChunk(datasetId, documentId, segmentId, childChunkId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(documentId, "documentId");
        (0, validation_1.ensureNonEmptyString)(segmentId, "segmentId");
        (0, validation_1.ensureNonEmptyString)(childChunkId, "childChunkId");
        return this.http.request({
            method: "DELETE",
            path: `/datasets/${datasetId}/documents/${documentId}/segments/${segmentId}/child_chunks/${childChunkId}`,
        });
    }
    async listMetadata(datasetId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/metadata`,
        });
    }
    async createMetadata(datasetId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(request.name, "name");
        (0, validation_1.ensureNonEmptyString)(request.type, "type");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/metadata`,
            data: request,
        });
    }
    async updateMetadata(datasetId, metadataId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(metadataId, "metadataId");
        (0, validation_1.ensureNonEmptyString)(request.name, "name");
        return this.http.request({
            method: "PATCH",
            path: `/datasets/${datasetId}/metadata/${metadataId}`,
            data: request,
        });
    }
    async deleteMetadata(datasetId, metadataId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(metadataId, "metadataId");
        return this.http.request({
            method: "DELETE",
            path: `/datasets/${datasetId}/metadata/${metadataId}`,
        });
    }
    async listBuiltInMetadata(datasetId) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/metadata/built-in`,
        });
    }
    async updateBuiltInMetadata(datasetId, action) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(action, "action");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/metadata/built-in/${action}`,
        });
    }
    async updateDocumentsMetadata(datasetId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        ensureNonEmptyArray(request.operation_data, "operation_data");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/documents/metadata`,
            data: request,
        });
    }
    async hitTesting(datasetId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        if (request.query !== undefined && request.query !== null) {
            (0, validation_1.ensureOptionalString)(request.query, "query");
        }
        if (request.attachment_ids && request.attachment_ids.length > 0) {
            (0, validation_1.ensureStringArray)(request.attachment_ids, "attachment_ids");
        }
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/hit-testing`,
            data: request,
        });
    }
    async retrieve(datasetId, request) {
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/retrieve`,
            data: request,
        });
    }
    async listDatasourcePlugins(datasetId, options) {
        warnPipelineRoutes();
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureOptionalBoolean)(options?.isPublished, "isPublished");
        return this.http.request({
            method: "GET",
            path: `/datasets/${datasetId}/pipeline/datasource-plugins`,
            query: {
                is_published: options?.isPublished ?? undefined,
            },
        });
    }
    async runDatasourceNode(datasetId, nodeId, request) {
        warnPipelineRoutes();
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(nodeId, "nodeId");
        (0, validation_1.ensureNonEmptyString)(request.datasource_type, "datasource_type");
        return this.http.requestStream({
            method: "POST",
            path: `/datasets/${datasetId}/pipeline/datasource/nodes/${nodeId}/run`,
            data: request,
        });
    }
    async runPipeline(datasetId, request) {
        warnPipelineRoutes();
        (0, validation_1.ensureNonEmptyString)(datasetId, "datasetId");
        (0, validation_1.ensureNonEmptyString)(request.datasource_type, "datasource_type");
        (0, validation_1.ensureNonEmptyString)(request.start_node_id, "start_node_id");
        const shouldStream = request.response_mode === "streaming";
        if (shouldStream) {
            return this.http.requestStream({
                method: "POST",
                path: `/datasets/${datasetId}/pipeline/run`,
                data: request,
            });
        }
        return this.http.request({
            method: "POST",
            path: `/datasets/${datasetId}/pipeline/run`,
            data: request,
        });
    }
    async uploadPipelineFile(form) {
        warnPipelineRoutes();
        ensureFormData(form, "uploadPipelineFile");
        return this.http.request({
            method: "POST",
            path: "/datasets/pipeline/file-upload",
            data: form,
        });
    }
}
exports.KnowledgeBaseClient = KnowledgeBaseClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia25vd2xlZGdlLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrbm93bGVkZ2UtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBb0M7QUFnQ3BDLDZDQU1zQjtBQUN0QixxREFBd0U7QUFDeEUsaURBQStDO0FBRS9DLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7QUFDakMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFlLEVBQVEsRUFBRTtJQUN6QyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztRQUN4QixPQUFPO0lBQ1QsQ0FBQztJQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QixDQUFDLENBQUM7QUFFRixNQUFNLGNBQWMsR0FBRyxDQUFDLElBQWEsRUFBRSxPQUFlLEVBQVEsRUFBRTtJQUM5RCxJQUFJLENBQUMsSUFBQSxzQkFBVSxFQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDdEIsTUFBTSxJQUFJLDRCQUFlLENBQUMsR0FBRyxPQUFPLG9CQUFvQixDQUFDLENBQUM7SUFDNUQsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxLQUFjLEVBQUUsSUFBWSxFQUFRLEVBQUU7SUFDakUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNoRCxNQUFNLElBQUksNEJBQWUsQ0FBQyxHQUFHLElBQUksNEJBQTRCLENBQUMsQ0FBQztJQUNqRSxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxrQkFBa0IsR0FBRyxHQUFTLEVBQUU7SUFDcEMsUUFBUSxDQUNOLHlHQUF5RyxDQUMxRyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FB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LE9BQU8sQ0FBQztZQUN2QixNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSxnQ0FBZ0M7WUFDdEMsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUE1bkJELGtEQTRuQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaWZ5Q2xpZW50IH0gZnJvbSBcIi4vYmFzZVwiO1xuaW1wb3J0IHR5cGUge1xuICBEYXRhc2V0Q3JlYXRlUmVxdWVzdCxcbiAgRGF0YXNldExpc3RPcHRpb25zLFxuICBEYXRhc2V0VGFnQmluZGluZ1JlcXVlc3QsXG4gIERhdGFzZXRUYWdDcmVhdGVSZXF1ZXN0LFxuICBEYXRhc2V0VGFnRGVsZXRlUmVxdWVzdCxcbiAgRGF0YXNldFRhZ1VuYmluZGluZ1JlcXVlc3QsXG4gIERhdGFzZXRUYWdVcGRhdGVSZXF1ZXN0LFxuICBEYXRhc2V0VXBkYXRlUmVxdWVzdCxcbiAgRG9jdW1lbnRHZXRPcHRpb25zLFxuICBEb2N1bWVudExpc3RPcHRpb25zLFxuICBEb2N1bWVudFN0YXR1c0FjdGlvbixcbiAgRG9jdW1lbnRUZXh0Q3JlYXRlUmVxdWVzdCxcbiAgRG9jdW1lbnRUZXh0VXBkYXRlUmVxdWVzdCxcbiAgU2VnbWVudENyZWF0ZVJlcXVlc3QsXG4gIFNlZ21lbnRMaXN0T3B0aW9ucyxcbiAgU2VnbWVudFVwZGF0ZVJlcXVlc3QsXG4gIENoaWxkQ2h1bmtDcmVhdGVSZXF1ZXN0LFxuICBDaGlsZENodW5rTGlzdE9wdGlvbnMsXG4gIENoaWxkQ2h1bmtVcGRhdGVSZXF1ZXN0LFxuICBNZXRhZGF0YUNyZWF0ZVJlcXVlc3QsXG4gIE1ldGFkYXRhT3BlcmF0aW9uUmVxdWVzdCxcbiAgTWV0YWRhdGFVcGRhdGVSZXF1ZXN0LFxuICBIaXRUZXN0aW5nUmVxdWVzdCxcbiAgRGF0YXNvdXJjZVBsdWdpbkxpc3RPcHRpb25zLFxuICBEYXRhc291cmNlTm9kZVJ1blJlcXVlc3QsXG4gIFBpcGVsaW5lUnVuUmVxdWVzdCxcbiAgS25vd2xlZGdlQmFzZVJlc3BvbnNlLFxuICBQaXBlbGluZVN0cmVhbUV2ZW50LFxufSBmcm9tIFwiLi4vdHlwZXMva25vd2xlZGdlLWJhc2VcIjtcbmltcG9ydCB0eXBlIHsgRGlmeVJlc3BvbnNlLCBEaWZ5U3RyZWFtLCBRdWVyeVBhcmFtcyB9IGZyb20gXCIuLi90eXBlcy9jb21tb25cIjtcbmltcG9ydCB7XG4gIGVuc3VyZU5vbkVtcHR5U3RyaW5nLFxuICBlbnN1cmVPcHRpb25hbEJvb2xlYW4sXG4gIGVuc3VyZU9wdGlvbmFsSW50LFxuICBlbnN1cmVPcHRpb25hbFN0cmluZyxcbiAgZW5zdXJlU3RyaW5nQXJyYXksXG59IGZyb20gXCIuL3ZhbGlkYXRpb25cIjtcbmltcG9ydCB7IEZpbGVVcGxvYWRFcnJvciwgVmFsaWRhdGlvbkVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9kaWZ5LWVycm9yXCI7XG5pbXBvcnQgeyBpc0Zvcm1EYXRhIH0gZnJvbSBcIi4uL2h0dHAvZm9ybS1kYXRhXCI7XG5cbmNvbnN0IHdhcm5lZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuY29uc3Qgd2Fybk9uY2UgPSAobWVzc2FnZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gIGlmICh3YXJuZWQuaGFzKG1lc3NhZ2UpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHdhcm5lZC5hZGQobWVzc2FnZSk7XG4gIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbn07XG5cbmNvbnN0IGVuc3VyZUZvcm1EYXRhID0gKGZvcm06IHVua25vd24sIGNvbnRleHQ6IHN0cmluZyk6IHZvaWQgPT4ge1xuICBpZiAoIWlzRm9ybURhdGEoZm9ybSkpIHtcbiAgICB0aHJvdyBuZXcgRmlsZVVwbG9hZEVycm9yKGAke2NvbnRleHR9IHJlcXVpcmVzIEZvcm1EYXRhYCk7XG4gIH1cbn07XG5cbmNvbnN0IGVuc3VyZU5vbkVtcHR5QXJyYXkgPSAodmFsdWU6IHVua25vd24sIG5hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpIHx8IHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoYCR7bmFtZX0gbXVzdCBiZSBhIG5vbi1lbXB0eSBhcnJheWApO1xuICB9XG59O1xuXG5jb25zdCB3YXJuUGlwZWxpbmVSb3V0ZXMgPSAoKTogdm9pZCA9PiB7XG4gIHdhcm5PbmNlKFxuICAgIFwiUkFHIHBpcGVsaW5lIGVuZHBvaW50cyBtYXkgYmUgdW5hdmFpbGFibGUgdW5sZXNzIHRoZSBzZXJ2aWNlIEFQSSByZWdpc3RlcnMgZGF0YXNldC9yYWdfcGlwZWxpbmUgcm91dGVzLlwiXG4gICk7XG59O1xuXG5leHBvcnQgY2xhc3MgS25vd2xlZGdlQmFzZUNsaWVudCBleHRlbmRzIERpZnlDbGllbnQge1xuICBhc3luYyBsaXN0RGF0YXNldHMoXG4gICAgb3B0aW9ucz86IERhdGFzZXRMaXN0T3B0aW9uc1xuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlT3B0aW9uYWxJbnQob3B0aW9ucz8ucGFnZSwgXCJwYWdlXCIpO1xuICAgIGVuc3VyZU9wdGlvbmFsSW50KG9wdGlvbnM/LmxpbWl0LCBcImxpbWl0XCIpO1xuICAgIGVuc3VyZU9wdGlvbmFsU3RyaW5nKG9wdGlvbnM/LmtleXdvcmQsIFwia2V5d29yZFwiKTtcbiAgICBlbnN1cmVPcHRpb25hbEJvb2xlYW4ob3B0aW9ucz8uaW5jbHVkZUFsbCwgXCJpbmNsdWRlQWxsXCIpO1xuXG4gICAgY29uc3QgcXVlcnk6IFF1ZXJ5UGFyYW1zID0ge1xuICAgICAgcGFnZTogb3B0aW9ucz8ucGFnZSxcbiAgICAgIGxpbWl0OiBvcHRpb25zPy5saW1pdCxcbiAgICAgIGtleXdvcmQ6IG9wdGlvbnM/LmtleXdvcmQgPz8gdW5kZWZpbmVkLFxuICAgICAgaW5jbHVkZV9hbGw6IG9wdGlvbnM/LmluY2x1ZGVBbGwgPz8gdW5kZWZpbmVkLFxuICAgIH07XG5cbiAgICBpZiAob3B0aW9ucz8udGFnSWRzICYmIG9wdGlvbnMudGFnSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGVuc3VyZVN0cmluZ0FycmF5KG9wdGlvbnMudGFnSWRzLCBcInRhZ0lkc1wiKTtcbiAgICAgIHF1ZXJ5LnRhZ19pZHMgPSBvcHRpb25zLnRhZ0lkcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgcGF0aDogXCIvZGF0YXNldHNcIixcbiAgICAgIHF1ZXJ5LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlRGF0YXNldChcbiAgICByZXF1ZXN0OiBEYXRhc2V0Q3JlYXRlUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC5uYW1lLCBcIm5hbWVcIik7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBwYXRoOiBcIi9kYXRhc2V0c1wiLFxuICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldERhdGFzZXQoZGF0YXNldElkOiBzdHJpbmcpOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH1gLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlRGF0YXNldChcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICByZXF1ZXN0OiBEYXRhc2V0VXBkYXRlUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBpZiAocmVxdWVzdC5uYW1lICE9PSB1bmRlZmluZWQgJiYgcmVxdWVzdC5uYW1lICE9PSBudWxsKSB7XG4gICAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhyZXF1ZXN0Lm5hbWUsIFwibmFtZVwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH1gLFxuICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRlbGV0ZURhdGFzZXQoZGF0YXNldElkOiBzdHJpbmcpOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH1gLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlRG9jdW1lbnRTdGF0dXMoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgYWN0aW9uOiBEb2N1bWVudFN0YXR1c0FjdGlvbixcbiAgICBkb2N1bWVudElkczogc3RyaW5nW11cbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoYWN0aW9uLCBcImFjdGlvblwiKTtcbiAgICBlbnN1cmVTdHJpbmdBcnJheShkb2N1bWVudElkcywgXCJkb2N1bWVudElkc1wiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvc3RhdHVzLyR7YWN0aW9ufWAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGRvY3VtZW50X2lkczogZG9jdW1lbnRJZHMsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbGlzdFRhZ3MoKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBcIi9kYXRhc2V0cy90YWdzXCIsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBjcmVhdGVUYWcoXG4gICAgcmVxdWVzdDogRGF0YXNldFRhZ0NyZWF0ZVJlcXVlc3RcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHJlcXVlc3QubmFtZSwgXCJuYW1lXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogXCIvZGF0YXNldHMvdGFnc1wiLFxuICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIHVwZGF0ZVRhZyhcbiAgICByZXF1ZXN0OiBEYXRhc2V0VGFnVXBkYXRlUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC50YWdfaWQsIFwidGFnX2lkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHJlcXVlc3QubmFtZSwgXCJuYW1lXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgIHBhdGg6IFwiL2RhdGFzZXRzL3RhZ3NcIixcbiAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBkZWxldGVUYWcoXG4gICAgcmVxdWVzdDogRGF0YXNldFRhZ0RlbGV0ZVJlcXVlc3RcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHJlcXVlc3QudGFnX2lkLCBcInRhZ19pZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgcGF0aDogXCIvZGF0YXNldHMvdGFnc1wiLFxuICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGJpbmRUYWdzKFxuICAgIHJlcXVlc3Q6IERhdGFzZXRUYWdCaW5kaW5nUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlU3RyaW5nQXJyYXkocmVxdWVzdC50YWdfaWRzLCBcInRhZ19pZHNcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC50YXJnZXRfaWQsIFwidGFyZ2V0X2lkXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogXCIvZGF0YXNldHMvdGFncy9iaW5kaW5nXCIsXG4gICAgICBkYXRhOiByZXF1ZXN0LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdW5iaW5kVGFncyhcbiAgICByZXF1ZXN0OiBEYXRhc2V0VGFnVW5iaW5kaW5nUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC50YWdfaWQsIFwidGFnX2lkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHJlcXVlc3QudGFyZ2V0X2lkLCBcInRhcmdldF9pZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IFwiL2RhdGFzZXRzL3RhZ3MvdW5iaW5kaW5nXCIsXG4gICAgICBkYXRhOiByZXF1ZXN0LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0RGF0YXNldFRhZ3MoXG4gICAgZGF0YXNldElkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L3RhZ3NgLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlRG9jdW1lbnRCeVRleHQoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgcmVxdWVzdDogRG9jdW1lbnRUZXh0Q3JlYXRlUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhyZXF1ZXN0Lm5hbWUsIFwibmFtZVwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhyZXF1ZXN0LnRleHQsIFwidGV4dFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L2RvY3VtZW50L2NyZWF0ZV9ieV90ZXh0YCxcbiAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVEb2N1bWVudEJ5VGV4dChcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBkb2N1bWVudElkOiBzdHJpbmcsXG4gICAgcmVxdWVzdDogRG9jdW1lbnRUZXh0VXBkYXRlUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkb2N1bWVudElkLCBcImRvY3VtZW50SWRcIik7XG4gICAgaWYgKHJlcXVlc3QubmFtZSAhPT0gdW5kZWZpbmVkICYmIHJlcXVlc3QubmFtZSAhPT0gbnVsbCkge1xuICAgICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC5uYW1lLCBcIm5hbWVcIik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vZG9jdW1lbnRzLyR7ZG9jdW1lbnRJZH0vdXBkYXRlX2J5X3RleHRgLFxuICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZURvY3VtZW50QnlGaWxlKFxuICAgIGRhdGFzZXRJZDogc3RyaW5nLFxuICAgIGZvcm06IHVua25vd25cbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlRm9ybURhdGEoZm9ybSwgXCJjcmVhdGVEb2N1bWVudEJ5RmlsZVwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L2RvY3VtZW50L2NyZWF0ZV9ieV9maWxlYCxcbiAgICAgIGRhdGE6IGZvcm0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVEb2N1bWVudEJ5RmlsZShcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBkb2N1bWVudElkOiBzdHJpbmcsXG4gICAgZm9ybTogdW5rbm93blxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkb2N1bWVudElkLCBcImRvY3VtZW50SWRcIik7XG4gICAgZW5zdXJlRm9ybURhdGEoZm9ybSwgXCJ1cGRhdGVEb2N1bWVudEJ5RmlsZVwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L2RvY3VtZW50cy8ke2RvY3VtZW50SWR9L3VwZGF0ZV9ieV9maWxlYCxcbiAgICAgIGRhdGE6IGZvcm0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBsaXN0RG9jdW1lbnRzKFxuICAgIGRhdGFzZXRJZDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBEb2N1bWVudExpc3RPcHRpb25zXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIGVuc3VyZU9wdGlvbmFsSW50KG9wdGlvbnM/LnBhZ2UsIFwicGFnZVwiKTtcbiAgICBlbnN1cmVPcHRpb25hbEludChvcHRpb25zPy5saW1pdCwgXCJsaW1pdFwiKTtcbiAgICBlbnN1cmVPcHRpb25hbFN0cmluZyhvcHRpb25zPy5rZXl3b3JkLCBcImtleXdvcmRcIik7XG4gICAgZW5zdXJlT3B0aW9uYWxTdHJpbmcob3B0aW9ucz8uc3RhdHVzLCBcInN0YXR1c1wiKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHNgLFxuICAgICAgcXVlcnk6IHtcbiAgICAgICAgcGFnZTogb3B0aW9ucz8ucGFnZSxcbiAgICAgICAgbGltaXQ6IG9wdGlvbnM/LmxpbWl0LFxuICAgICAgICBrZXl3b3JkOiBvcHRpb25zPy5rZXl3b3JkID8/IHVuZGVmaW5lZCxcbiAgICAgICAgc3RhdHVzOiBvcHRpb25zPy5zdGF0dXMgPz8gdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldERvY3VtZW50KFxuICAgIGRhdGFzZXRJZDogc3RyaW5nLFxuICAgIGRvY3VtZW50SWQ6IHN0cmluZyxcbiAgICBvcHRpb25zPzogRG9jdW1lbnRHZXRPcHRpb25zXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRvY3VtZW50SWQsIFwiZG9jdW1lbnRJZFwiKTtcbiAgICBpZiAob3B0aW9ucz8ubWV0YWRhdGEpIHtcbiAgICAgIGNvbnN0IGFsbG93ZWQgPSBuZXcgU2V0KFtcImFsbFwiLCBcIm9ubHlcIiwgXCJ3aXRob3V0XCJdKTtcbiAgICAgIGlmICghYWxsb3dlZC5oYXMob3B0aW9ucy5tZXRhZGF0YSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcIm1ldGFkYXRhIG11c3QgYmUgb25lIG9mIGFsbCwgb25seSwgd2l0aG91dFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L2RvY3VtZW50cy8ke2RvY3VtZW50SWR9YCxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIG1ldGFkYXRhOiBvcHRpb25zPy5tZXRhZGF0YSA/PyB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZGVsZXRlRG9jdW1lbnQoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgZG9jdW1lbnRJZDogc3RyaW5nXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRvY3VtZW50SWQsIFwiZG9jdW1lbnRJZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vZG9jdW1lbnRzLyR7ZG9jdW1lbnRJZH1gLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0RG9jdW1lbnRJbmRleGluZ1N0YXR1cyhcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBiYXRjaDogc3RyaW5nXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGJhdGNoLCBcImJhdGNoXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtiYXRjaH0vaW5kZXhpbmctc3RhdHVzYCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZVNlZ21lbnRzKFxuICAgIGRhdGFzZXRJZDogc3RyaW5nLFxuICAgIGRvY3VtZW50SWQ6IHN0cmluZyxcbiAgICByZXF1ZXN0OiBTZWdtZW50Q3JlYXRlUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkb2N1bWVudElkLCBcImRvY3VtZW50SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlBcnJheShyZXF1ZXN0LnNlZ21lbnRzLCBcInNlZ21lbnRzXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vZG9jdW1lbnRzLyR7ZG9jdW1lbnRJZH0vc2VnbWVudHNgLFxuICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGxpc3RTZWdtZW50cyhcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBkb2N1bWVudElkOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IFNlZ21lbnRMaXN0T3B0aW9uc1xuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkb2N1bWVudElkLCBcImRvY3VtZW50SWRcIik7XG4gICAgZW5zdXJlT3B0aW9uYWxJbnQob3B0aW9ucz8ucGFnZSwgXCJwYWdlXCIpO1xuICAgIGVuc3VyZU9wdGlvbmFsSW50KG9wdGlvbnM/LmxpbWl0LCBcImxpbWl0XCIpO1xuICAgIGVuc3VyZU9wdGlvbmFsU3RyaW5nKG9wdGlvbnM/LmtleXdvcmQsIFwia2V5d29yZFwiKTtcbiAgICBpZiAob3B0aW9ucz8uc3RhdHVzICYmIG9wdGlvbnMuc3RhdHVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGVuc3VyZVN0cmluZ0FycmF5KG9wdGlvbnMuc3RhdHVzLCBcInN0YXR1c1wiKTtcbiAgICB9XG5cbiAgICBjb25zdCBxdWVyeTogUXVlcnlQYXJhbXMgPSB7XG4gICAgICBwYWdlOiBvcHRpb25zPy5wYWdlLFxuICAgICAgbGltaXQ6IG9wdGlvbnM/LmxpbWl0LFxuICAgICAga2V5d29yZDogb3B0aW9ucz8ua2V5d29yZCA/PyB1bmRlZmluZWQsXG4gICAgfTtcbiAgICBpZiAob3B0aW9ucz8uc3RhdHVzICYmIG9wdGlvbnMuc3RhdHVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHF1ZXJ5LnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfS9zZWdtZW50c2AsXG4gICAgICBxdWVyeSxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldFNlZ21lbnQoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgZG9jdW1lbnRJZDogc3RyaW5nLFxuICAgIHNlZ21lbnRJZDogc3RyaW5nXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRvY3VtZW50SWQsIFwiZG9jdW1lbnRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhzZWdtZW50SWQsIFwic2VnbWVudElkXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfS9zZWdtZW50cy8ke3NlZ21lbnRJZH1gLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlU2VnbWVudChcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBkb2N1bWVudElkOiBzdHJpbmcsXG4gICAgc2VnbWVudElkOiBzdHJpbmcsXG4gICAgcmVxdWVzdDogU2VnbWVudFVwZGF0ZVJlcXVlc3RcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZG9jdW1lbnRJZCwgXCJkb2N1bWVudElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHNlZ21lbnRJZCwgXCJzZWdtZW50SWRcIik7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfS9zZWdtZW50cy8ke3NlZ21lbnRJZH1gLFxuICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGRlbGV0ZVNlZ21lbnQoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgZG9jdW1lbnRJZDogc3RyaW5nLFxuICAgIHNlZ21lbnRJZDogc3RyaW5nXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRvY3VtZW50SWQsIFwiZG9jdW1lbnRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhzZWdtZW50SWQsIFwic2VnbWVudElkXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfS9zZWdtZW50cy8ke3NlZ21lbnRJZH1gLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlQ2hpbGRDaHVuayhcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBkb2N1bWVudElkOiBzdHJpbmcsXG4gICAgc2VnbWVudElkOiBzdHJpbmcsXG4gICAgcmVxdWVzdDogQ2hpbGRDaHVua0NyZWF0ZVJlcXVlc3RcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZG9jdW1lbnRJZCwgXCJkb2N1bWVudElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHNlZ21lbnRJZCwgXCJzZWdtZW50SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC5jb250ZW50LCBcImNvbnRlbnRcIik7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfS9zZWdtZW50cy8ke3NlZ21lbnRJZH0vY2hpbGRfY2h1bmtzYCxcbiAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBsaXN0Q2hpbGRDaHVua3MoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgZG9jdW1lbnRJZDogc3RyaW5nLFxuICAgIHNlZ21lbnRJZDogc3RyaW5nLFxuICAgIG9wdGlvbnM/OiBDaGlsZENodW5rTGlzdE9wdGlvbnNcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZG9jdW1lbnRJZCwgXCJkb2N1bWVudElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHNlZ21lbnRJZCwgXCJzZWdtZW50SWRcIik7XG4gICAgZW5zdXJlT3B0aW9uYWxJbnQob3B0aW9ucz8ucGFnZSwgXCJwYWdlXCIpO1xuICAgIGVuc3VyZU9wdGlvbmFsSW50KG9wdGlvbnM/LmxpbWl0LCBcImxpbWl0XCIpO1xuICAgIGVuc3VyZU9wdGlvbmFsU3RyaW5nKG9wdGlvbnM/LmtleXdvcmQsIFwia2V5d29yZFwiKTtcblxuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfS9zZWdtZW50cy8ke3NlZ21lbnRJZH0vY2hpbGRfY2h1bmtzYCxcbiAgICAgIHF1ZXJ5OiB7XG4gICAgICAgIHBhZ2U6IG9wdGlvbnM/LnBhZ2UsXG4gICAgICAgIGxpbWl0OiBvcHRpb25zPy5saW1pdCxcbiAgICAgICAga2V5d29yZDogb3B0aW9ucz8ua2V5d29yZCA/PyB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlQ2hpbGRDaHVuayhcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBkb2N1bWVudElkOiBzdHJpbmcsXG4gICAgc2VnbWVudElkOiBzdHJpbmcsXG4gICAgY2hpbGRDaHVua0lkOiBzdHJpbmcsXG4gICAgcmVxdWVzdDogQ2hpbGRDaHVua1VwZGF0ZVJlcXVlc3RcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZG9jdW1lbnRJZCwgXCJkb2N1bWVudElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHNlZ21lbnRJZCwgXCJzZWdtZW50SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoY2hpbGRDaHVua0lkLCBcImNoaWxkQ2h1bmtJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhyZXF1ZXN0LmNvbnRlbnQsIFwiY29udGVudFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfS9zZWdtZW50cy8ke3NlZ21lbnRJZH0vY2hpbGRfY2h1bmtzLyR7Y2hpbGRDaHVua0lkfWAsXG4gICAgICBkYXRhOiByZXF1ZXN0LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZGVsZXRlQ2hpbGRDaHVuayhcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBkb2N1bWVudElkOiBzdHJpbmcsXG4gICAgc2VnbWVudElkOiBzdHJpbmcsXG4gICAgY2hpbGRDaHVua0lkOiBzdHJpbmdcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZG9jdW1lbnRJZCwgXCJkb2N1bWVudElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHNlZ21lbnRJZCwgXCJzZWdtZW50SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoY2hpbGRDaHVua0lkLCBcImNoaWxkQ2h1bmtJZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vZG9jdW1lbnRzLyR7ZG9jdW1lbnRJZH0vc2VnbWVudHMvJHtzZWdtZW50SWR9L2NoaWxkX2NodW5rcy8ke2NoaWxkQ2h1bmtJZH1gLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgbGlzdE1ldGFkYXRhKFxuICAgIGRhdGFzZXRJZDogc3RyaW5nXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9tZXRhZGF0YWAsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBjcmVhdGVNZXRhZGF0YShcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICByZXF1ZXN0OiBNZXRhZGF0YUNyZWF0ZVJlcXVlc3RcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC5uYW1lLCBcIm5hbWVcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC50eXBlLCBcInR5cGVcIik7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9tZXRhZGF0YWAsXG4gICAgICBkYXRhOiByZXF1ZXN0LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlTWV0YWRhdGEoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgbWV0YWRhdGFJZDogc3RyaW5nLFxuICAgIHJlcXVlc3Q6IE1ldGFkYXRhVXBkYXRlUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhtZXRhZGF0YUlkLCBcIm1ldGFkYXRhSWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC5uYW1lLCBcIm5hbWVcIik7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vbWV0YWRhdGEvJHttZXRhZGF0YUlkfWAsXG4gICAgICBkYXRhOiByZXF1ZXN0LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZGVsZXRlTWV0YWRhdGEoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgbWV0YWRhdGFJZDogc3RyaW5nXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKG1ldGFkYXRhSWQsIFwibWV0YWRhdGFJZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vbWV0YWRhdGEvJHttZXRhZGF0YUlkfWAsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBsaXN0QnVpbHRJbk1ldGFkYXRhKFxuICAgIGRhdGFzZXRJZDogc3RyaW5nXG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiR0VUXCIsXG4gICAgICBwYXRoOiBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9tZXRhZGF0YS9idWlsdC1pbmAsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVCdWlsdEluTWV0YWRhdGEoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgYWN0aW9uOiBcImVuYWJsZVwiIHwgXCJkaXNhYmxlXCJcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoYWN0aW9uLCBcImFjdGlvblwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L21ldGFkYXRhL2J1aWx0LWluLyR7YWN0aW9ufWAsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVEb2N1bWVudHNNZXRhZGF0YShcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICByZXF1ZXN0OiBNZXRhZGF0YU9wZXJhdGlvblJlcXVlc3RcbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKGRhdGFzZXRJZCwgXCJkYXRhc2V0SWRcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlBcnJheShyZXF1ZXN0Lm9wZXJhdGlvbl9kYXRhLCBcIm9wZXJhdGlvbl9kYXRhXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vZG9jdW1lbnRzL21ldGFkYXRhYCxcbiAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBoaXRUZXN0aW5nKFxuICAgIGRhdGFzZXRJZDogc3RyaW5nLFxuICAgIHJlcXVlc3Q6IEhpdFRlc3RpbmdSZXF1ZXN0XG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4+IHtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhkYXRhc2V0SWQsIFwiZGF0YXNldElkXCIpO1xuICAgIGlmIChyZXF1ZXN0LnF1ZXJ5ICE9PSB1bmRlZmluZWQgJiYgcmVxdWVzdC5xdWVyeSAhPT0gbnVsbCkge1xuICAgICAgZW5zdXJlT3B0aW9uYWxTdHJpbmcocmVxdWVzdC5xdWVyeSwgXCJxdWVyeVwiKTtcbiAgICB9XG4gICAgaWYgKHJlcXVlc3QuYXR0YWNobWVudF9pZHMgJiYgcmVxdWVzdC5hdHRhY2htZW50X2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICBlbnN1cmVTdHJpbmdBcnJheShyZXF1ZXN0LmF0dGFjaG1lbnRfaWRzLCBcImF0dGFjaG1lbnRfaWRzXCIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L2hpdC10ZXN0aW5nYCxcbiAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyByZXRyaWV2ZShcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICByZXF1ZXN0OiBIaXRUZXN0aW5nUmVxdWVzdFxuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L3JldHJpZXZlYCxcbiAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBsaXN0RGF0YXNvdXJjZVBsdWdpbnMoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgb3B0aW9ucz86IERhdGFzb3VyY2VQbHVnaW5MaXN0T3B0aW9uc1xuICApOiBQcm9taXNlPERpZnlSZXNwb25zZTxLbm93bGVkZ2VCYXNlUmVzcG9uc2U+PiB7XG4gICAgd2FyblBpcGVsaW5lUm91dGVzKCk7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVPcHRpb25hbEJvb2xlYW4ob3B0aW9ucz8uaXNQdWJsaXNoZWQsIFwiaXNQdWJsaXNoZWRcIik7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0KHtcbiAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L3BpcGVsaW5lL2RhdGFzb3VyY2UtcGx1Z2luc2AsXG4gICAgICBxdWVyeToge1xuICAgICAgICBpc19wdWJsaXNoZWQ6IG9wdGlvbnM/LmlzUHVibGlzaGVkID8/IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBydW5EYXRhc291cmNlTm9kZShcbiAgICBkYXRhc2V0SWQ6IHN0cmluZyxcbiAgICBub2RlSWQ6IHN0cmluZyxcbiAgICByZXF1ZXN0OiBEYXRhc291cmNlTm9kZVJ1blJlcXVlc3RcbiAgKTogUHJvbWlzZTxEaWZ5U3RyZWFtPFBpcGVsaW5lU3RyZWFtRXZlbnQ+PiB7XG4gICAgd2FyblBpcGVsaW5lUm91dGVzKCk7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhub2RlSWQsIFwibm9kZUlkXCIpO1xuICAgIGVuc3VyZU5vbkVtcHR5U3RyaW5nKHJlcXVlc3QuZGF0YXNvdXJjZV90eXBlLCBcImRhdGFzb3VyY2VfdHlwZVwiKTtcbiAgICByZXR1cm4gdGhpcy5odHRwLnJlcXVlc3RTdHJlYW08UGlwZWxpbmVTdHJlYW1FdmVudD4oe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L3BpcGVsaW5lL2RhdGFzb3VyY2Uvbm9kZXMvJHtub2RlSWR9L3J1bmAsXG4gICAgICBkYXRhOiByZXF1ZXN0LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgcnVuUGlwZWxpbmUoXG4gICAgZGF0YXNldElkOiBzdHJpbmcsXG4gICAgcmVxdWVzdDogUGlwZWxpbmVSdW5SZXF1ZXN0XG4gICk6IFByb21pc2U8RGlmeVJlc3BvbnNlPEtub3dsZWRnZUJhc2VSZXNwb25zZT4gfCBEaWZ5U3RyZWFtPFBpcGVsaW5lU3RyZWFtRXZlbnQ+PiB7XG4gICAgd2FyblBpcGVsaW5lUm91dGVzKCk7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcoZGF0YXNldElkLCBcImRhdGFzZXRJZFwiKTtcbiAgICBlbnN1cmVOb25FbXB0eVN0cmluZyhyZXF1ZXN0LmRhdGFzb3VyY2VfdHlwZSwgXCJkYXRhc291cmNlX3R5cGVcIik7XG4gICAgZW5zdXJlTm9uRW1wdHlTdHJpbmcocmVxdWVzdC5zdGFydF9ub2RlX2lkLCBcInN0YXJ0X25vZGVfaWRcIik7XG4gICAgY29uc3Qgc2hvdWxkU3RyZWFtID0gcmVxdWVzdC5yZXNwb25zZV9tb2RlID09PSBcInN0cmVhbWluZ1wiO1xuICAgIGlmIChzaG91bGRTdHJlYW0pIHtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdFN0cmVhbTxQaXBlbGluZVN0cmVhbUV2ZW50Pih7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L3BpcGVsaW5lL3J1bmAsXG4gICAgICAgIGRhdGE6IHJlcXVlc3QsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5yZXF1ZXN0PEtub3dsZWRnZUJhc2VSZXNwb25zZT4oe1xuICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgIHBhdGg6IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L3BpcGVsaW5lL3J1bmAsXG4gICAgICBkYXRhOiByZXF1ZXN0LFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgdXBsb2FkUGlwZWxpbmVGaWxlKFxuICAgIGZvcm06IHVua25vd25cbiAgKTogUHJvbWlzZTxEaWZ5UmVzcG9uc2U8S25vd2xlZGdlQmFzZVJlc3BvbnNlPj4ge1xuICAgIHdhcm5QaXBlbGluZVJvdXRlcygpO1xuICAgIGVuc3VyZUZvcm1EYXRhKGZvcm0sIFwidXBsb2FkUGlwZWxpbmVGaWxlXCIpO1xuICAgIHJldHVybiB0aGlzLmh0dHAucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgcGF0aDogXCIvZGF0YXNldHMvcGlwZWxpbmUvZmlsZS11cGxvYWRcIixcbiAgICAgIGRhdGE6IGZvcm0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==