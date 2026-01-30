import type { ReactNode } from 'react';
export type TRadioGroupProps = {
    children?: ReactNode | ReactNode[];
    value?: string | number | boolean;
    className?: string;
    onChange?: (value: any) => void;
};
export default function Group({ children, value, onChange, className }: TRadioGroupProps): React.JSX.Element;
