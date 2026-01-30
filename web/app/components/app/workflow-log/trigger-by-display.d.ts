import type { FC } from 'react';
import type { TriggerMetadata } from '@/models/log';
import { WorkflowRunTriggeredFrom } from '@/models/log';
type TriggerByDisplayProps = {
    triggeredFrom: WorkflowRunTriggeredFrom;
    className?: string;
    showText?: boolean;
    triggerMetadata?: TriggerMetadata;
};
declare const TriggerByDisplay: FC<TriggerByDisplayProps>;
export default TriggerByDisplay;
