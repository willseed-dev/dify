import type { AnyFormApi } from '@tanstack/react-form';
import type { BaseFieldProps } from '.';
import type { FormRef, FormSchema } from '@/app/components/base/form/types';
export type BaseFormProps = {
    formSchemas?: FormSchema[];
    defaultValues?: Record<string, any>;
    formClassName?: string;
    ref?: FormRef;
    disabled?: boolean;
    formFromProps?: AnyFormApi;
    onChange?: (field: string, value: any) => void;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    preventDefaultSubmit?: boolean;
} & Pick<BaseFieldProps, 'fieldClassName' | 'labelClassName' | 'inputContainerClassName' | 'inputClassName'>;
declare const _default: any;
export default _default;
