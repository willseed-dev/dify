import * as React from 'react';
type ExternalApiSelectionProps = {
    external_knowledge_api_id: string;
    external_knowledge_id: string;
    onChange: (data: {
        external_knowledge_api_id?: string;
        external_knowledge_id?: string;
    }) => void;
};
declare const ExternalApiSelection: React.FC<ExternalApiSelectionProps>;
export default ExternalApiSelection;
