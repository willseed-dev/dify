import type { FC } from 'react';
import type { CreateExternalAPIReq, FormSchema } from '../declarations';
type FormProps = {
    className?: string;
    itemClassName?: string;
    fieldLabelClassName?: string;
    value: CreateExternalAPIReq;
    onChange: (val: CreateExternalAPIReq) => void;
    formSchemas: FormSchema[];
    inputClassName?: string;
};
declare const Form: FC<FormProps>;
export default Form;
