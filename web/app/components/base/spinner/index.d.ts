import type { FC } from 'react';
import * as React from 'react';
type Props = {
    loading?: boolean;
    className?: string;
    children?: React.ReactNode | string;
};
declare const Spinner: FC<Props>;
export default Spinner;
