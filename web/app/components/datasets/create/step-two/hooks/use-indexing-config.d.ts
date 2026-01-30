import type { DefaultModel } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { RetrievalConfig } from '@/types/app';
export declare enum IndexingType {
    QUALIFIED = "high_quality",
    ECONOMICAL = "economy"
}
export type UseIndexingConfigOptions = {
    initialIndexType?: IndexingType;
    initialEmbeddingModel?: DefaultModel;
    initialRetrievalConfig?: RetrievalConfig;
    isAPIKeySet: boolean;
    hasSetIndexType: boolean;
};
export declare const useIndexingConfig: (options: UseIndexingConfigOptions) => {
    indexType: any;
    setIndexType: any;
    hasSetIndexType: boolean;
    getIndexingTechnique: () => any;
    embeddingModel: any;
    setEmbeddingModel: any;
    embeddingModelList: any;
    defaultEmbeddingModel: any;
    retrievalConfig: any;
    setRetrievalConfig: any;
    rerankModelList: any;
    rerankDefaultModel: any;
    isRerankDefaultModelValid: any;
    showMultiModalTip: any;
};
export type IndexingConfig = ReturnType<typeof useIndexingConfig>;
