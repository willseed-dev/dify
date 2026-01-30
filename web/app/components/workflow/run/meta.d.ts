import type { FC } from 'react';
type Props = {
    status: string;
    executor?: string;
    startTime?: number;
    time?: number;
    tokens?: number;
    steps?: number;
    showSteps?: boolean;
};
declare const MetaData: FC<Props>;
export default MetaData;
