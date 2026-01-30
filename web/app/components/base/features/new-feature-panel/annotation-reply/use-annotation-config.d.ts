import type { EmbeddingModelConfig } from '@/app/components/app/annotation/type';
import type { AnnotationReplyConfig } from '@/models/debug';
type Params = {
    appId: string;
    annotationConfig: AnnotationReplyConfig;
    setAnnotationConfig: (annotationConfig: AnnotationReplyConfig) => void;
};
declare const useAnnotationConfig: ({ appId, annotationConfig, setAnnotationConfig, }: Params) => {
    handleEnableAnnotation: (embeddingModel: EmbeddingModelConfig, score?: number) => Promise<void>;
    handleDisableAnnotation: (embeddingModel: EmbeddingModelConfig) => Promise<void>;
    isShowAnnotationConfigInit: any;
    setIsShowAnnotationConfigInit: (isShow: boolean) => void;
    isShowAnnotationFullModal: any;
    setIsShowAnnotationFullModal: any;
    setScore: (score: number, embeddingModel?: EmbeddingModelConfig) => void;
};
export default useAnnotationConfig;
