import type { FC } from 'react';
import type { QueryParam } from './index';
import type { I18nKeysByPrefix } from '@/types/i18n';
type TimePeriodName = I18nKeysByPrefix<'appLog', 'filter.period.'>;
export declare const TIME_PERIOD_MAPPING: {
    [key: string]: {
        value: number;
        name: TimePeriodName;
    };
};
type IFilterProps = {
    queryParams: QueryParam;
    setQueryParams: (v: QueryParam) => void;
};
declare const Filter: FC<IFilterProps>;
export default Filter;
