import type { Collection } from '../types';
type Props = {
    collection: Collection;
    onHide: () => void;
    onRefreshData: () => void;
};
declare const ProviderDetail: ({ collection, onHide, onRefreshData, }: Props) => any;
export default ProviderDetail;
