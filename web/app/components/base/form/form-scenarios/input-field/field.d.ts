import type { InputFieldConfiguration } from './types';
type InputFieldProps = {
    initialData?: Record<string, any>;
    config: InputFieldConfiguration;
};
declare const InputField: ({ initialData, config, }: InputFieldProps) => any;
export default InputField;
