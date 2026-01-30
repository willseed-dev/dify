import type { FC } from 'react';
type StepTwoFooterProps = {
    isSetting?: boolean;
    isCreating: boolean;
    onPrevious: () => void;
    onCreate: () => void;
    onCancel?: () => void;
};
export declare const StepTwoFooter: FC<StepTwoFooterProps>;
export {};
