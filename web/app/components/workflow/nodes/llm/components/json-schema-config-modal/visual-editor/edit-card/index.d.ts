import type { FC } from 'react';
import type { SchemaEnumType } from '../../../../types';
import { ArrayType, Type } from '../../../../types';
export type EditData = {
    name: string;
    type: Type | ArrayType;
    required: boolean;
    description?: string;
    enum?: SchemaEnumType;
};
type EditCardProps = {
    fields: EditData;
    depth: number;
    path: string[];
    parentPath: string[];
};
declare const EditCard: FC<EditCardProps>;
export default EditCard;
