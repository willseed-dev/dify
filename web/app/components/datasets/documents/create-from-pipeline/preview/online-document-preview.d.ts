import type { NotionPage } from '@/models/common';
type OnlineDocumentPreviewProps = {
    currentPage: NotionPage;
    datasourceNodeId: string;
    hidePreview: () => void;
};
declare const OnlineDocumentPreview: ({ currentPage, datasourceNodeId, hidePreview, }: OnlineDocumentPreviewProps) => any;
export default OnlineDocumentPreview;
