import * as React from 'react';
type Props = {
    icon: any;
    title: any;
    tooltip?: any;
    value: any;
    description?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    onChange?: (state: any) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};
declare const FeatureCard: ({ icon, title, tooltip, value, description, children, disabled, onChange, onMouseEnter, onMouseLeave, }: Props) => any;
export default FeatureCard;
