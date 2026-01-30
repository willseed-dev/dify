import type { useMarketplace } from './hooks';
type MarketplaceProps = {
    searchPluginText: string;
    filterPluginTags: string[];
    isMarketplaceArrowVisible: boolean;
    showMarketplacePanel: () => void;
    marketplaceContext: ReturnType<typeof useMarketplace>;
};
declare const Marketplace: ({ searchPluginText, filterPluginTags, isMarketplaceArrowVisible, showMarketplacePanel, marketplaceContext, }: MarketplaceProps) => any;
export default Marketplace;
