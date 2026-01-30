import type { FC } from 'react';
import type { StrategyDetail as StrategyDetailType } from '@/app/components/plugins/types';
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
    detail: StrategyDetailType;
    onHide: () => void;
};
declare const StrategyDetail: FC<Props>;
export default StrategyDetail;
