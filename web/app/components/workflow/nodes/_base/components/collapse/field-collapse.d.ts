import type { ReactNode } from 'react';
type FieldCollapseProps = {
    title: string;
    children: ReactNode;
    collapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
    operations?: ReactNode;
};
declare const FieldCollapse: ({ title, children, collapsed, onCollapse, operations, }: FieldCollapseProps) => any;
export default FieldCollapse;
