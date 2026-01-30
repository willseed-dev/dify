import type { InputFieldConfiguration } from './types';
type InputFieldProps = {
    initialData?: Record<string, any>;
    config: InputFieldConfiguration;
};
declare const NodePanelField: ({ initialData, config, }: InputFieldProps) => any;
export default NodePanelField;
