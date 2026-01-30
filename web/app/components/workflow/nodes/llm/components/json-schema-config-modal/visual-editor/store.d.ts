import type { SchemaRoot } from '../../../types';
type VisualEditorStore = {
    hoveringProperty: string | null;
    setHoveringProperty: (propertyPath: string | null) => void;
    isAddingNewField: boolean;
    setIsAddingNewField: (isAdding: boolean) => void;
    advancedEditing: boolean;
    setAdvancedEditing: (isEditing: boolean) => void;
    backupSchema: SchemaRoot | null;
    setBackupSchema: (schema: SchemaRoot | null) => void;
};
export declare const createVisualEditorStore: () => any;
export declare const useVisualEditorStore: <T>(selector: (state: VisualEditorStore) => T) => T;
export {};
