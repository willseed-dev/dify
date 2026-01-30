import type { StrategyDetail } from '@/app/components/plugins/types';
import type { Locale } from '@/i18n-config';
type Props = {
    provider: {
        author: string;
        name: string;
        description: Record<Locale, string>;
        tenant_id: string;
        icon: string;
        label: Record<Locale, string>;
        tags: string[];
    };
    detail: StrategyDetail;
};
declare const StrategyItem: ({ provider, detail, }: Props) => any;
export default StrategyItem;
