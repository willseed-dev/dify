import type { CrawlResultItem } from '@/models/datasets';
type IProps = {
    payload: CrawlResultItem;
    hidePreview: () => void;
};
declare const WebsitePreview: ({ payload, hidePreview, }: IProps) => any;
export default WebsitePreview;
