import type { StateCreator } from 'zustand';
import type { CrawlResult, CrawlResultItem } from '@/models/datasets';
import { CrawlStep } from '@/models/datasets';
export type WebsiteCrawlSliceShape = {
    websitePages: CrawlResultItem[];
    setWebsitePages: (pages: CrawlResultItem[]) => void;
    currentWebsite: CrawlResultItem | undefined;
    setCurrentWebsite: (website: CrawlResultItem | undefined) => void;
    crawlResult: CrawlResult | undefined;
    setCrawlResult: (result: CrawlResult | undefined) => void;
    step: CrawlStep;
    setStep: (step: CrawlStep) => void;
    previewIndex: number;
    setPreviewIndex: (index: number) => void;
    previewWebsitePageRef: React.RefObject<CrawlResultItem | undefined>;
};
export declare const createWebsiteCrawlSlice: StateCreator<WebsiteCrawlSliceShape>;
