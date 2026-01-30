import type { FC } from 'react';
export type Props = {
    className?: string;
    current: number;
    onChange: (cur: number) => void;
    total: number;
    limit?: number;
    onLimitChange?: (limit: number) => void;
};
declare const CustomizedPagination: FC<Props>;
export default CustomizedPagination;
