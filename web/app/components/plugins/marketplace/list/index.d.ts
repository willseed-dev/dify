import type { Plugin } from '../../types';
import type { MarketplaceCollection } from '../types';
type ListProps = {
    marketplaceCollections: MarketplaceCollection[];
    marketplaceCollectionPluginsMap: Record<string, Plugin[]>;
    plugins?: Plugin[];
    showInstallButton?: boolean;
    cardContainerClassName?: string;
    cardRender?: (plugin: Plugin) => React.JSX.Element | null;
    emptyClassName?: string;
};
declare const List: ({ marketplaceCollections, marketplaceCollectionPluginsMap, plugins, showInstallButton, cardContainerClassName, cardRender, emptyClassName, }: ListProps) => any;
export default List;
