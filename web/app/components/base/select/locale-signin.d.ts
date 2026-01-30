type ISelectProps = {
    items: Array<{
        value: string;
        name: string;
    }>;
    value?: string;
    className?: string;
    onChange?: (value: string) => void;
};
export default function LocaleSigninSelect({ items, value, onChange, }: ISelectProps): any;
export {};
