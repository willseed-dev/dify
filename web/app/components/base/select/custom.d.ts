import type { PortalToFollowElemOptions } from '@/app/components/base/portal-to-follow-elem';
export type Option = {
    label: string;
    value: string;
};
export type CustomSelectProps<T extends Option> = {
    options: T[];
    value?: string;
    onChange?: (value: string) => void;
    containerProps?: PortalToFollowElemOptions & {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
    };
    triggerProps?: {
        className?: string;
    };
    popupProps?: {
        wrapperClassName?: string;
        className?: string;
        itemClassName?: string;
        title?: string;
    };
    CustomTrigger?: (option: T | undefined, open: boolean) => React.JSX.Element;
    CustomOption?: (option: T, selected: boolean) => React.JSX.Element;
};
declare const CustomSelect: <T extends Option>({ options, value, onChange, containerProps, triggerProps, popupProps, CustomTrigger, CustomOption, }: CustomSelectProps<T>) => any;
export default CustomSelect;
