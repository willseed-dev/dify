import type { AnyFieldApi } from '@tanstack/react-form';
import type { FieldState, FormSchema } from '@/app/components/base/form/types';
export type BaseFieldProps = {
    fieldClassName?: string;
    labelClassName?: string;
    inputContainerClassName?: string;
    inputClassName?: string;
    formSchema: FormSchema;
    field: AnyFieldApi;
    disabled?: boolean;
    onChange?: (field: string, value: any) => void;
    fieldState?: FieldState;
};
declare const _default: any;
export default _default;
