type WeekdaySelectorProps = {
    selectedDays: string[];
    onChange: (days: string[]) => void;
};
declare const WeekdaySelector: ({ selectedDays, onChange }: WeekdaySelectorProps) => any;
export default WeekdaySelector;
