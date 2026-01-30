import { ErrorHandleTypeEnum } from './types';
type ErrorHandleTypeSelectorProps = {
    value: ErrorHandleTypeEnum;
    onSelected: (value: ErrorHandleTypeEnum) => void;
};
declare const ErrorHandleTypeSelector: ({ value, onSelected, }: ErrorHandleTypeSelectorProps) => any;
export default ErrorHandleTypeSelector;
