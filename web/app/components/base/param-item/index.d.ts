import type { FC } from 'react';
type Props = {
    className?: string;
    id: string;
    name: string;
    noTooltip?: boolean;
    tip?: string;
    value: number;
    enable: boolean;
    step?: number;
    min?: number;
    max: number;
    onChange: (key: string, value: number) => void;
    hasSwitch?: boolean;
    onSwitchChange?: (key: string, enable: boolean) => void;
};
declare const ParamItem: FC<Props>;
export default ParamItem;
