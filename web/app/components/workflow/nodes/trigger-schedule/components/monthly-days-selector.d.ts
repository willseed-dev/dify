type MonthlyDaysSelectorProps = {
    selectedDays: (number | 'last')[];
    onChange: (days: (number | 'last')[]) => void;
};
declare const MonthlyDaysSelector: ({ selectedDays, onChange }: MonthlyDaysSelectorProps) => any;
export default MonthlyDaysSelector;
