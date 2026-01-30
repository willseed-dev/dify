import * as React from 'react';
type ApiItem = {
    value: string;
    name: string;
    url: string;
};
type ExternalApiSelectProps = {
    items: ApiItem[];
    value?: string;
    onSelect: (item: ApiItem) => void;
};
declare const ExternalApiSelect: React.FC<ExternalApiSelectProps>;
export default ExternalApiSelect;
