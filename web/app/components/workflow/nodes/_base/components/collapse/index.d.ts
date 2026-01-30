import type { ReactNode } from 'react';
export { default as FieldCollapse } from './field-collapse';
type CollapseProps = {
    disabled?: boolean;
    trigger: React.JSX.Element | ((collapseIcon: React.JSX.Element | null) => React.JSX.Element);
    children: React.JSX.Element;
    collapsed?: boolean;
    onCollapse?: (collapsed: boolean) => void;
    operations?: ReactNode;
    hideCollapseIcon?: boolean;
};
declare const Collapse: ({ disabled, trigger, children, collapsed, onCollapse, operations, hideCollapseIcon, }: CollapseProps) => any;
export default Collapse;
