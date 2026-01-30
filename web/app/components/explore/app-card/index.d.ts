import type { App } from '@/models/explore';
export type AppCardProps = {
    app: App;
    canCreate: boolean;
    onCreate: () => void;
    isExplore: boolean;
};
declare const AppCard: ({ app, canCreate, onCreate, isExplore, }: AppCardProps) => any;
export default AppCard;
