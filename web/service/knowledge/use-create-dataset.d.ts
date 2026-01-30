import type { MutationOptions } from '@tanstack/react-query';
import type { IndexingType } from '@/app/components/datasets/create/step-two';
import type { DataSourceProvider, NotionPage } from '@/models/common';
import type { ChunkingMode, CrawlOptions, CrawlResultItem, CreateDatasetReq, CreateDatasetResponse, CreateDocumentReq, createDocumentResponse, CustomFile, DataSourceType, FileIndexingEstimateResponse, NotionInfo, ProcessRule, ProcessRuleResponse } from '@/models/datasets';
export declare const getNotionInfo: (notionPages: NotionPage[], credentialId: string) => NotionInfo[];
export declare const getWebsiteInfo: (opts: {
    websiteCrawlProvider: DataSourceProvider;
    websiteCrawlJobId: string;
    websitePages: CrawlResultItem[];
    crawlOptions?: CrawlOptions;
}) => {
    provider: DataSourceProvider;
    job_id: string;
    urls: any[];
    only_main_content: any;
};
type GetFileIndexingEstimateParamsOptionBase = {
    docForm: ChunkingMode;
    docLanguage: string;
    indexingTechnique: IndexingType;
    processRule: ProcessRule;
    dataset_id: string;
};
type GetFileIndexingEstimateParamsOptionFile = GetFileIndexingEstimateParamsOptionBase & {
    dataSourceType: DataSourceType.FILE;
    files: CustomFile[];
};
export declare const useFetchFileIndexingEstimateForFile: (options: GetFileIndexingEstimateParamsOptionFile, mutationOptions?: MutationOptions<FileIndexingEstimateResponse>) => any;
type GetFileIndexingEstimateParamsOptionNotion = GetFileIndexingEstimateParamsOptionBase & {
    dataSourceType: DataSourceType.NOTION;
    notionPages: NotionPage[];
    credential_id: string;
};
export declare const useFetchFileIndexingEstimateForNotion: (options: GetFileIndexingEstimateParamsOptionNotion, mutationOptions?: MutationOptions<FileIndexingEstimateResponse>) => any;
type GetFileIndexingEstimateParamsOptionWeb = GetFileIndexingEstimateParamsOptionBase & {
    dataSourceType: DataSourceType.WEB;
    websitePages: CrawlResultItem[];
    crawlOptions?: CrawlOptions;
    websiteCrawlProvider: DataSourceProvider;
    websiteCrawlJobId: string;
};
export declare const useFetchFileIndexingEstimateForWeb: (options: GetFileIndexingEstimateParamsOptionWeb, mutationOptions?: MutationOptions<FileIndexingEstimateResponse>) => any;
export declare const useCreateFirstDocument: (mutationOptions?: MutationOptions<createDocumentResponse, Error, CreateDocumentReq>) => any;
export declare const useCreateDocument: (datasetId: string, mutationOptions?: MutationOptions<createDocumentResponse, Error, CreateDocumentReq>) => any;
export declare const useFetchDefaultProcessRule: (mutationOptions?: MutationOptions<ProcessRuleResponse, Error, string>) => any;
export declare const useCreatePipelineDataset: (mutationOptions?: MutationOptions<CreateDatasetResponse, Error>) => any;
export declare const useCreatePipelineDatasetFromCustomized: (mutationOptions?: MutationOptions<CreateDatasetResponse, Error, CreateDatasetReq>) => any;
export {};
