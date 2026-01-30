import type { FC } from 'react';
import type { ToolCall } from '@/models/log';
type Props = {
    toolCall: ToolCall;
    isLLM: boolean;
    isFinal?: boolean;
    tokens?: number;
    observation?: any;
    finalAnswer?: any;
};
declare const ToolCallItem: FC<Props>;
export default ToolCallItem;
