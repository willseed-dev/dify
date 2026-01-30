import type { MultipleRetrievalConfig } from './types';
import type { DataSet, SelectedDatasetsMode } from '@/models/datasets';
import { WeightedScoreEnum } from '@/models/datasets';
export declare const checkNodeValid: () => boolean;
export declare const getSelectedDatasetsMode: (datasets?: DataSet[]) => SelectedDatasetsMode;
export declare const getMultipleRetrievalConfig: (multipleRetrievalConfig: MultipleRetrievalConfig, selectedDatasets: DataSet[], originalDatasets: DataSet[], fallbackRerankModel?: {
    provider?: string;
    model?: string;
}) => {
    top_k: any;
    score_threshold: number | null | undefined;
    reranking_mode: any;
    reranking_model: {
        provider: string;
        model: string;
    } | undefined;
    weights: {
        weight_type: WeightedScoreEnum;
        vector_setting: {
            vector_weight: number;
            embedding_provider_name: string;
            embedding_model_name: string;
        };
        keyword_setting: {
            keyword_weight: number;
        };
    } | undefined;
    reranking_enable: boolean | undefined;
};
export declare const checkoutRerankModelConfiguredInRetrievalSettings: (datasets: DataSet[], multipleRetrievalConfig?: MultipleRetrievalConfig) => any;
