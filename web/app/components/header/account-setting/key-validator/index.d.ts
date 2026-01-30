import type { Form, KeyFrom, Status, ValidateValue } from './declarations';
export type KeyValidatorProps = {
    type: string;
    title: React.ReactNode;
    status: Status;
    forms: Form[];
    keyFrom: KeyFrom;
    onSave: (v: ValidateValue) => Promise<boolean | undefined>;
    disabled?: boolean;
};
declare const KeyValidator: ({ type, title, status, forms, keyFrom, onSave, disabled, }: KeyValidatorProps) => any;
export default KeyValidator;
