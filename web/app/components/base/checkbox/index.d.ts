type CheckboxProps = {
    id?: string;
    checked?: boolean;
    onCheck?: (event: React.MouseEvent<HTMLDivElement>) => void;
    className?: string;
    disabled?: boolean;
    indeterminate?: boolean;
};
declare const Checkbox: ({ id, checked, onCheck, className, disabled, indeterminate, }: CheckboxProps) => any;
export default Checkbox;
