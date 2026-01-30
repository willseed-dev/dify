export type AnnotationItemBasic = {
    message_id?: string;
    question: string;
    answer: string;
};
export type AnnotationItem = {
    id: string;
    question: string;
    answer: string;
    created_at: number;
    hit_count: number;
};
export type AnnotationCreateResponse = AnnotationItem & {
    account?: {
        name?: string;
    };
};
export type HitHistoryItem = {
    id: string;
    question: string;
    match: string;
    response: string;
    source: string;
    score: number;
    created_at: number;
};
export type EmbeddingModelConfig = {
    embedding_provider_name: string;
    embedding_model_name: string;
};
export declare enum AnnotationEnableStatus {
    enable = "enable",
    disable = "disable"
}
export declare enum JobStatus {
    waiting = "waiting",
    processing = "processing",
    completed = "completed"
}
