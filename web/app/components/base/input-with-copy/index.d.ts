import type { InputProps } from '../input';
export type InputWithCopyProps = {
    showCopyButton?: boolean;
    copyValue?: string;
    onCopy?: (value: string) => void;
} & Omit<InputProps, 'showClearIcon' | 'onCopy'>;
declare const InputWithCopy: any;
export default InputWithCopy;
