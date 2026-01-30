import type { AnnotationEnableStatus, AnnotationItemBasic, EmbeddingModelConfig } from '@/app/components/app/annotation/type';
export declare const fetchAnnotationConfig: (appId: string) => Promise<any>;
export declare const updateAnnotationStatus: (appId: string, action: AnnotationEnableStatus, embeddingModel?: EmbeddingModelConfig, score?: number) => Promise<any>;
export declare const updateAnnotationScore: (appId: string, settingId: string, score: number) => Promise<any>;
export declare const queryAnnotationJobStatus: (appId: string, action: AnnotationEnableStatus, jobId: string) => Promise<any>;
export declare const fetchAnnotationList: (appId: string, params: Record<string, any>) => Promise<any>;
export declare const fetchExportAnnotationList: (appId: string) => Promise<any>;
export declare const addAnnotation: (appId: string, body: AnnotationItemBasic) => Promise<any>;
export declare const annotationBatchImport: ({ url, body }: {
    url: string;
    body: FormData;
}) => Promise<{
    job_id: string;
    job_status: string;
}>;
export declare const checkAnnotationBatchImportProgress: ({ jobID, appId }: {
    jobID: string;
    appId: string;
}) => Promise<{
    job_id: string;
    job_status: string;
}>;
export declare const editAnnotation: (appId: string, annotationId: string, body: AnnotationItemBasic) => Promise<any>;
export declare const delAnnotation: (appId: string, annotationId: string) => Promise<any>;
export declare const delAnnotations: (appId: string, annotationIds: string[]) => Promise<any>;
export declare const fetchHitHistoryList: (appId: string, annotationId: string, params: Record<string, any>) => Promise<any>;
export declare const clearAllAnnotations: (appId: string) => Promise<any>;
