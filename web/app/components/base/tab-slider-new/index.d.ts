import type { FC } from 'react';
type Option = {
    value: string;
    text: string;
    icon?: React.ReactNode;
};
type TabSliderProps = {
    className?: string;
    value: string;
    onChange: (v: string) => void;
    options: Option[];
};
declare const TabSliderNew: FC<TabSliderProps>;
export default TabSliderNew;
