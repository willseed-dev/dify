/**
 * Utility functions for form data handling in trigger plugin components
 */
/**
 * Sanitizes form values by converting null/undefined to empty strings
 * This ensures React form inputs don't receive null values which can cause warnings
 */
export declare const sanitizeFormValues: (values: Record<string, any>) => Record<string, string>;
/**
 * Deep sanitizes form values while preserving nested objects structure
 * Useful for complex form schemas with nested properties
 */
export declare const deepSanitizeFormValues: (values: Record<string, any>, visited?: WeakSet<WeakKey>) => Record<string, any>;
/**
 * Validates required fields in form data
 * Returns the first missing required field or null if all are present
 */
export declare const findMissingRequiredField: (formData: Record<string, any>, requiredFields: Array<{
    name: string;
    label: any;
}>) => {
    name: string;
    label: any;
} | null;
