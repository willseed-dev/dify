import type { AppDetailResponse } from '@/models/app';
import type { AppSSO } from '@/types/app';
import type { I18nKeysByPrefix } from '@/types/i18n';
export type ITriggerCardProps = {
    appInfo: AppDetailResponse & Partial<AppSSO>;
    onToggleResult?: (err: Error | null, message?: I18nKeysByPrefix<'common', 'actionMsg.'>) => void;
};
declare function TriggerCard({ appInfo, onToggleResult }: ITriggerCardProps): any;
export default TriggerCard;
