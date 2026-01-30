import type { JSX } from 'react';
export type Operation = {
    id: string;
    title: string;
    icon: JSX.Element;
    onClick: () => void;
    type?: 'divider';
};
type AppOperationsProps = {
    gap: number;
    operations?: Operation[];
    primaryOperations?: Operation[];
    secondaryOperations?: Operation[];
};
declare const AppOperations: ({ operations, primaryOperations, secondaryOperations, gap, }: AppOperationsProps) => any;
export default AppOperations;
