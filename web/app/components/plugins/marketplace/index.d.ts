import type { SearchParams } from 'nuqs';
type MarketplaceProps = {
    showInstallButton?: boolean;
    pluginTypeSwitchClassName?: string;
    /**
     * Pass the search params from the request to prefetch data on the server
     * and preserve the search params in the URL.
     */
    searchParams?: Promise<SearchParams>;
};
declare const Marketplace: ({ showInstallButton, pluginTypeSwitchClassName, searchParams, }: MarketplaceProps) => Promise<any>;
export default Marketplace;
