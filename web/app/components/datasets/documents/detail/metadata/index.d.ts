import type { FC, ReactNode } from 'react';
import type { inputType } from '@/hooks/use-metadata';
import type { FullDocumentDetail } from '@/models/datasets';
type IFieldInfoProps = {
    label: string;
    value?: string;
    valueIcon?: ReactNode;
    displayedValue?: string;
    defaultValue?: string;
    showEdit?: boolean;
    inputType?: inputType;
    selectOptions?: Array<{
        value: string;
        name: string;
    }>;
    onUpdate?: (v: any) => void;
};
export declare const FieldInfo: FC<IFieldInfoProps>;
type IMetadataProps = {
    docDetail?: FullDocumentDetail;
    loading: boolean;
    onUpdate: () => void;
};
declare const Metadata: FC<IMetadataProps>;
export default Metadata;
