import type { CrawlResultItem } from '@/models/datasets';
type WebsitePreviewProps = {
    currentWebsite: CrawlResultItem;
    hidePreview: () => void;
};
declare const WebsitePreview: ({ currentWebsite, hidePreview, }: WebsitePreviewProps) => any;
export default WebsitePreview;
