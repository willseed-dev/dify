import type { NotionPage } from '@/models/common';
import type { CrawlResultItem, CustomFile, FullDocumentDetail } from '@/models/datasets';
import { DataSourceType } from '@/models/datasets';
export type UsePreviewStateOptions = {
    dataSourceType: DataSourceType;
    files: CustomFile[];
    notionPages: NotionPage[];
    websitePages: CrawlResultItem[];
    documentDetail?: FullDocumentDetail;
    datasetId?: string;
};
export declare const usePreviewState: (options: UsePreviewStateOptions) => {
    previewFile: any;
    setPreviewFile: any;
    previewNotionPage: any;
    setPreviewNotionPage: any;
    previewWebsitePage: any;
    setPreviewWebsitePage: any;
    getPreviewPickerItems: any;
    getPreviewPickerValue: any;
    handlePreviewChange: any;
};
export type PreviewState = ReturnType<typeof usePreviewState>;
