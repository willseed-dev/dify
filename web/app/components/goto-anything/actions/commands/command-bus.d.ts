export type CommandHandler = (args?: Record<string, any>) => void | Promise<void>;
export declare const executeCommand: (name: string, args?: Record<string, any>) => Promise<void>;
export declare const registerCommands: (map: Record<string, CommandHandler>) => void;
export declare const unregisterCommands: (names: string[]) => void;
