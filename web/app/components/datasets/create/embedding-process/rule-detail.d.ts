import type { FC } from 'react';
import type { ProcessRuleResponse } from '@/models/datasets';
import { RETRIEVE_METHOD } from '@/types/app';
type RuleDetailProps = {
    sourceData?: ProcessRuleResponse;
    indexingType?: string;
    retrievalMethod?: RETRIEVE_METHOD;
};
declare const RuleDetail: FC<RuleDetailProps>;
export default RuleDetail;
