import type { FC } from 'react';
type TagInputProps = {
    items: string[];
    onChange: (items: string[]) => void;
    disableRemove?: boolean;
    disableAdd?: boolean;
    customizedConfirmKey?: 'Enter' | 'Tab';
    isInWorkflow?: boolean;
    placeholder?: string;
    required?: boolean;
    inputClassName?: string;
};
declare const TagInput: FC<TagInputProps>;
export default TagInput;
