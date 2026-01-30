import type { NotionPage } from '@/models/common';
import type { CrawlResultItem } from '@/models/datasets';
export type PreviewState = {
    currentFile: File | undefined;
    currentNotionPage: NotionPage | undefined;
    currentWebsite: CrawlResultItem | undefined;
};
export type PreviewActions = {
    showFilePreview: (file: File) => void;
    hideFilePreview: () => void;
    showNotionPagePreview: (page: NotionPage) => void;
    hideNotionPagePreview: () => void;
    showWebsitePreview: (website: CrawlResultItem) => void;
    hideWebsitePreview: () => void;
};
export type UsePreviewStateReturn = PreviewState & PreviewActions;
/**
 * Custom hook for managing preview state across different data source types.
 * Handles file, notion page, and website preview visibility.
 */
declare function usePreviewState(): UsePreviewStateReturn;
export default usePreviewState;
