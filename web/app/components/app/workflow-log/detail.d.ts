import type { FC } from 'react';
type ILogDetail = {
    runID: string;
    onClose: () => void;
    canReplay?: boolean;
};
declare const DetailPanel: FC<ILogDetail>;
export default DetailPanel;
