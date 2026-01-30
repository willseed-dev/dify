import type { ScheduleTriggerNodeType } from './types';
declare const useConfig: (id: string, payload: ScheduleTriggerNodeType) => {
    readOnly: any;
    inputs: any;
    setInputs: any;
    handleModeChange: any;
    handleFrequencyChange: any;
    handleCronExpressionChange: any;
    handleWeekdaysChange: any;
    handleTimeChange: any;
    handleOnMinuteChange: any;
};
export default useConfig;
