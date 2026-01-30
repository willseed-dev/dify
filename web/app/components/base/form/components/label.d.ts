export type LabelProps = {
    htmlFor: string;
    label: string;
    isRequired?: boolean;
    showOptional?: boolean;
    tooltip?: string;
    className?: string;
};
declare const Label: ({ htmlFor, label, isRequired, showOptional, tooltip, className, }: LabelProps) => any;
export default Label;
