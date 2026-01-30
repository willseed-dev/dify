import type { ScheduleFrequency } from '../types';
type FrequencySelectorProps = {
    frequency: ScheduleFrequency;
    onChange: (frequency: ScheduleFrequency) => void;
};
declare const FrequencySelector: ({ frequency, onChange }: FrequencySelectorProps) => any;
export default FrequencySelector;
