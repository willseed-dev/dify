export declare function ensureNonEmptyString(value: unknown, name: string): asserts value is string;
/**
 * Validates optional string fields that must be non-empty when provided.
 * Use this for fields like `name` that are optional but should not be empty strings.
 *
 * For filter parameters that accept empty strings (e.g., `keyword: ""`),
 * use `validateParams` which allows empty strings for optional params.
 */
export declare function ensureOptionalString(value: unknown, name: string): void;
export declare function ensureOptionalInt(value: unknown, name: string): void;
export declare function ensureOptionalBoolean(value: unknown, name: string): void;
export declare function ensureStringArray(value: unknown, name: string): void;
export declare function ensureOptionalStringArray(value: unknown, name: string): void;
export declare function ensureRating(value: unknown): void;
export declare function validateParams(params: Record<string, unknown>): void;
