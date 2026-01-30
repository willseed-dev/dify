import type { FC } from 'react';
import * as React from 'react';
type TooltipProps = {
    data: number | string;
    text: string;
    icon: React.ReactNode;
};
declare const Tooltip: FC<TooltipProps>;
export default Tooltip;
