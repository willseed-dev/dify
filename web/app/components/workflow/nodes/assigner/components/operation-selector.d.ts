import type { FC } from 'react';
import type { WriteMode } from '../types';
import type { Item } from '../utils';
import type { VarType } from '@/app/components/workflow/types';
type OperationSelectorProps = {
    value: string | number;
    onSelect: (value: Item) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    popupClassName?: string;
    assignedVarType?: VarType;
    writeModeTypes?: WriteMode[];
    writeModeTypesArr?: WriteMode[];
    writeModeTypesNum?: WriteMode[];
};
declare const OperationSelector: FC<OperationSelectorProps>;
export default OperationSelector;
