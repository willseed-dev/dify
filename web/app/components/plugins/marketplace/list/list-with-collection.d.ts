import type { MarketplaceCollection } from '../types';
import type { Plugin } from '@/app/components/plugins/types';
type ListWithCollectionProps = {
    marketplaceCollections: MarketplaceCollection[];
    marketplaceCollectionPluginsMap: Record<string, Plugin[]>;
    showInstallButton?: boolean;
    cardContainerClassName?: string;
    cardRender?: (plugin: Plugin) => React.JSX.Element | null;
};
declare const ListWithCollection: ({ marketplaceCollections, marketplaceCollectionPluginsMap, showInstallButton, cardContainerClassName, cardRender, }: ListWithCollectionProps) => any;
export default ListWithCollection;
