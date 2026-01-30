import type { DefaultValueForm } from './types';
type DefaultValueProps = {
    forms: DefaultValueForm[];
    onFormChange: (form: DefaultValueForm) => void;
};
declare const DefaultValue: ({ forms, onFormChange, }: DefaultValueProps) => any;
export default DefaultValue;
