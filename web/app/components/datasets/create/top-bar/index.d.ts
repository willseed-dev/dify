import type { FC } from 'react';
import type { StepperProps } from '../stepper';
export type TopBarProps = Pick<StepperProps, 'activeIndex'> & {
    className?: string;
    datasetId?: string;
};
export declare const TopBar: FC<TopBarProps>;
