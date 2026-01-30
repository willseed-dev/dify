import type { DefaultModel, Model } from '@/app/components/header/account-setting/model-provider-page/declarations';
import { IndexingType } from '../../create/step-two';
type ShowMultiModalTipProps = {
    embeddingModel: DefaultModel;
    rerankingEnable: boolean;
    rerankModel: {
        rerankingProviderName: string;
        rerankingModelName: string;
    };
    indexMethod: IndexingType | undefined;
    embeddingModelList: Model[];
    rerankModelList: Model[];
};
export declare const checkShowMultiModalTip: ({ embeddingModel, rerankingEnable, rerankModel, indexMethod, embeddingModelList, rerankModelList, }: ShowMultiModalTipProps) => boolean;
export {};
