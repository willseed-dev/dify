import type { DefaultModelResponse, Model } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { RetrievalConfig } from '@/types/app';
export declare const isReRankModelSelected: ({ retrievalConfig, rerankModelList, indexMethod, }: {
    retrievalConfig: RetrievalConfig;
    rerankModelList: Model[];
    indexMethod?: string;
}) => boolean;
export declare const ensureRerankModelSelected: ({ rerankDefaultModel, indexMethod, retrievalConfig, }: {
    rerankDefaultModel: DefaultModelResponse;
    retrievalConfig: RetrievalConfig;
    indexMethod?: string;
}) => any;
