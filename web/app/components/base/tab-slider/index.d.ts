import type { FC, ReactNode } from 'react';
type Option = {
    value: string;
    text: ReactNode;
};
type TabSliderProps = {
    className?: string;
    value: string;
    itemClassName?: string | ((active: boolean) => string);
    onChange: (v: string) => void;
    options: Option[];
};
declare const TabSlider: FC<TabSliderProps>;
export default TabSlider;
