import type { ReactNode } from 'react';
export type IRadioProps = {
    className?: string;
    labelClassName?: string;
    children?: string | ReactNode;
    checked?: boolean;
    value?: string | number | boolean;
    disabled?: boolean;
    onChange?: (e?: IRadioProps['value']) => void;
};
export default function Radio({ className, labelClassName, children, checked, value, disabled, onChange, }: IRadioProps): React.JSX.Element;
