import * as React from 'react';
type TabProps<T> = {
    Icon: React.ComponentType<{
        isActive: boolean;
    }>;
    value: T;
    label: string;
    isActive: boolean;
    onClick: (value: T) => void;
};
declare const Tab: <T>({ Icon, value, label, isActive, onClick, }: TabProps<T>) => any;
declare const _default: typeof Tab;
export default _default;
