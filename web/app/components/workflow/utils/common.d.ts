export declare const isMac: () => boolean;
export declare const getKeyboardKeyNameBySystem: (key: string) => string;
export declare const getKeyboardKeyCodeBySystem: (key: string) => string;
export declare const isEventTargetInputArea: (target: HTMLElement) => true | undefined;
/**
 * Format workflow run identifier using finished_at timestamp
 * @param finishedAt - Unix timestamp in seconds
 * @param fallbackText - Text to show when finishedAt is not available (default: 'Running')
 * @returns Formatted string like " (14:30:25)" or " (Running)"
 */
export declare const formatWorkflowRunIdentifier: (finishedAt?: number, fallbackText?: string) => string;
