import type { ValidatedStatusState } from './declarations';
type KeyInputProps = {
    value?: string;
    name: string;
    placeholder: string;
    className?: string;
    onChange: (v: string) => void;
    onFocus?: () => void;
    validating: boolean;
    validatedStatusState: ValidatedStatusState;
};
declare const KeyInput: ({ value, name, placeholder, className, onChange, onFocus, validating, validatedStatusState, }: KeyInputProps) => any;
export default KeyInput;
