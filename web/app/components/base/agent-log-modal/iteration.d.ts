import type { FC } from 'react';
import type { AgentIteration } from '@/models/log';
type Props = {
    isFinal: boolean;
    index: number;
    iterationInfo: AgentIteration;
};
declare const Iteration: FC<Props>;
export default Iteration;
