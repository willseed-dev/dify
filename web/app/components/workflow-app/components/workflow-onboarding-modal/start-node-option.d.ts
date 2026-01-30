import type { FC, ReactNode } from 'react';
type StartNodeOptionProps = {
    icon: ReactNode;
    title: string;
    subtitle?: string;
    description: string;
    onClick: () => void;
};
declare const StartNodeOption: FC<StartNodeOptionProps>;
export default StartNodeOption;
