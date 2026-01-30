import type { CreateKnowledgeBaseReq } from './declarations';
type ExternalKnowledgeBaseCreateProps = {
    onConnect: (formValue: CreateKnowledgeBaseReq) => void;
    loading: boolean;
};
declare const ExternalKnowledgeBaseCreate: React.FC<ExternalKnowledgeBaseCreateProps>;
export default ExternalKnowledgeBaseCreate;
