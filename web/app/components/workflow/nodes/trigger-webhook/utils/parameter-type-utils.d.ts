import { VarType } from '@/app/components/workflow/types';
/**
 * Type guard to check if a string is a valid parameter type
 */
export declare const isValidParameterType: (type: string) => type is VarType;
export declare const normalizeParameterType: (input: string | undefined | null) => VarType;
/**
 * Gets display name for parameter types in UI components
 */
export declare const getParameterTypeDisplayName: (type: VarType) => string;
/**
 * Gets available parameter types based on content type
 * Provides context-aware type filtering for different webhook content types
 */
export declare const getAvailableParameterTypes: (contentType?: string) => VarType[];
/**
 * Creates type options for UI select components
 */
export declare const createParameterTypeOptions: (contentType?: string) => {
    name: string;
    value: VarType;
}[];
