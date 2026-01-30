import * as React from 'react';
type SubscriptionSelectorProps = {
    selectedId?: string;
    onSelect?: ({ id, name }: {
        id: string;
        name: string;
    }) => void;
};
export declare const SubscriptionSelectorView: React.FC<SubscriptionSelectorProps>;
export {};
