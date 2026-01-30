import type { BaseConfiguration } from './types';
type BaseFieldProps = {
    initialData?: Record<string, any>;
    config: BaseConfiguration;
};
declare const BaseField: ({ initialData, config, }: BaseFieldProps) => any;
export default BaseField;
