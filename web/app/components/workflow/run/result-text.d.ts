import type { FC } from 'react';
type ResultTextProps = {
    isRunning?: boolean;
    outputs?: any;
    error?: string;
    onClick?: () => void;
    allFiles?: any[];
};
declare const ResultText: FC<ResultTextProps>;
export default ResultText;
