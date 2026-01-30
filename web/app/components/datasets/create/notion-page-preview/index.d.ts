import type { NotionPage } from '@/models/common';
type IProps = {
    currentPage?: NotionPage;
    notionCredentialId: string;
    hidePreview: () => void;
};
declare const NotionPagePreview: ({ currentPage, notionCredentialId, hidePreview, }: IProps) => any;
export default NotionPagePreview;
