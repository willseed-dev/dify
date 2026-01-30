import type { FC } from 'react';
type InputProps = {
    value?: string;
    onChange: (v: string) => void;
    onFocus?: () => void;
    placeholder?: string;
    validated?: boolean;
    className?: string;
    disabled?: boolean;
    type?: string;
    min?: number;
    max?: number;
};
declare const Input: FC<InputProps>;
export default Input;
