import type { ModelAndParameter } from '../configuration/debug/types';
import type { InputVar, Variable } from '@/app/components/workflow/types';
export type AppPublisherProps = {
    disabled?: boolean;
    publishDisabled?: boolean;
    publishedAt?: number;
    /** only needed in workflow / chatflow mode */
    draftUpdatedAt?: number;
    debugWithMultipleModel?: boolean;
    multipleModelConfigs?: ModelAndParameter[];
    /** modelAndParameter is passed when debugWithMultipleModel is true */
    onPublish?: (params?: any) => Promise<any> | any;
    onRestore?: () => Promise<any> | any;
    onToggle?: (state: boolean) => void;
    crossAxisOffset?: number;
    toolPublished?: boolean;
    inputs?: InputVar[];
    outputs?: Variable[];
    onRefreshData?: () => void;
    workflowToolAvailable?: boolean;
    missingStartNode?: boolean;
    hasTriggerNode?: boolean;
    startNodeLimitExceeded?: boolean;
};
declare const _default: any;
export default _default;
