import type { FC } from 'react';
import type { WebhookParameter } from '../types';
type ParameterTableProps = {
    title: string;
    parameters: WebhookParameter[];
    onChange: (params: WebhookParameter[]) => void;
    readonly?: boolean;
    placeholder?: string;
    contentType?: string;
};
declare const ParameterTable: FC<ParameterTableProps>;
export default ParameterTable;
