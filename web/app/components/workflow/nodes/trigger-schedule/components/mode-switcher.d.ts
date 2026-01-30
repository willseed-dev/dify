import type { ScheduleMode } from '../types';
type ModeSwitcherProps = {
    mode: ScheduleMode;
    onChange: (mode: ScheduleMode) => void;
};
declare const ModeSwitcher: ({ mode, onChange }: ModeSwitcherProps) => any;
export default ModeSwitcher;
