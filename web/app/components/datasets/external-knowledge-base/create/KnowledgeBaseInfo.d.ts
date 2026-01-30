import * as React from 'react';
type KnowledgeBaseInfoProps = {
    name: string;
    description?: string;
    onChange: (data: {
        name?: string;
        description?: string;
    }) => void;
};
declare const KnowledgeBaseInfo: React.FC<KnowledgeBaseInfoProps>;
export default KnowledgeBaseInfo;
