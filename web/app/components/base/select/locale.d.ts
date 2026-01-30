type ISelectProps = {
    items: Array<{
        value: string;
        name: string;
    }>;
    value?: string;
    className?: string;
    onChange?: (value: string) => void;
};
export default function Select({ items, value, onChange, }: ISelectProps): any;
export {};
