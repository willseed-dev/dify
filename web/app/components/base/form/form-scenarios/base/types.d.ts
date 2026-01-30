import type { Option } from '../../../select/pure';
import type { CustomActionsProps } from '../../components/form/actions';
import type { TransferMethod } from '@/types/app';
export declare enum BaseFieldType {
    textInput = "text-input",
    paragraph = "paragraph",
    numberInput = "number-input",
    checkbox = "checkbox",
    select = "select",
    file = "file",
    fileList = "file-list"
}
export type ShowCondition = {
    variable: string;
    value: any;
};
export type NumberConfiguration = {
    max?: number;
    min?: number;
    unit?: string;
};
export type SelectConfiguration = {
    options: Option[];
    popupProps?: {
        wrapperClassName?: string;
        className?: string;
        itemClassName?: string;
        title?: string;
    };
};
export type FileConfiguration = {
    allowedFileTypes: string[];
    allowedFileExtensions: string[];
    allowedFileUploadMethods: TransferMethod[];
};
export type BaseConfiguration = {
    label: string;
    variable: string;
    maxLength?: number;
    placeholder?: string;
    required: boolean;
    showOptional?: boolean;
    showConditions: ShowCondition[];
    type: BaseFieldType;
    tooltip?: string;
} & NumberConfiguration & Partial<SelectConfiguration> & Partial<FileConfiguration>;
export type BaseFormProps = {
    initialData?: Record<string, any>;
    configurations: BaseConfiguration[];
    CustomActions?: (props: CustomActionsProps) => React.ReactNode;
    onSubmit: (value: Record<string, any>) => void;
};
