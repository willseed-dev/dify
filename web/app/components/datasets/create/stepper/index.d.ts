import type { FC } from 'react';
import type { Step } from './step';
export type StepperProps = {
    steps: Step[];
    activeIndex: number;
};
export declare const Stepper: FC<StepperProps>;
