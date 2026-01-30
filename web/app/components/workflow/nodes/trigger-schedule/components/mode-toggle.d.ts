import type { ScheduleMode } from '../types';
type ModeToggleProps = {
    mode: ScheduleMode;
    onChange: (mode: ScheduleMode) => void;
};
declare const ModeToggle: ({ mode, onChange }: ModeToggleProps) => any;
export default ModeToggle;
