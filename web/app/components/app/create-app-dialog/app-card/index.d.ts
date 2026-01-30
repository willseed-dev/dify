import type { App } from '@/models/explore';
export type AppCardProps = {
    app: App;
    canCreate: boolean;
    onCreate: () => void;
};
declare const AppCard: ({ app, canCreate, onCreate, }: AppCardProps) => any;
export default AppCard;
