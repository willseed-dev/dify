import type { FC } from 'react';
export type Step = {
    name: string;
};
export type StepperStepProps = Step & {
    index: number;
    activeIndex: number;
};
export declare const StepperStep: FC<StepperStepProps>;
