import type { NotionPage } from '@/models/common';
import type { CrawlResultItem } from '@/models/datasets';
type PreviewPanelProps = {
    currentFile: File | undefined;
    currentNotionPage: NotionPage | undefined;
    currentWebsite: CrawlResultItem | undefined;
    notionCredentialId: string;
    isShowPlanUpgradeModal: boolean;
    hideFilePreview: () => void;
    hideNotionPagePreview: () => void;
    hideWebsitePreview: () => void;
    hidePlanUpgradeModal: () => void;
};
/**
 * Right panel component for displaying file, notion page, or website previews.
 */
declare function PreviewPanel({ currentFile, currentNotionPage, currentWebsite, notionCredentialId, isShowPlanUpgradeModal, hideFilePreview, hideNotionPagePreview, hideWebsitePreview, hidePlanUpgradeModal, }: PreviewPanelProps): any;
export default PreviewPanel;
