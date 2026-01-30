import type { StateCreator } from 'zustand';
import type { EnvironmentVariable } from '@/app/components/workflow/types';
export type EnvVariableSliceShape = {
    showEnvPanel: boolean;
    setShowEnvPanel: (showEnvPanel: boolean) => void;
    environmentVariables: EnvironmentVariable[];
    setEnvironmentVariables: (environmentVariables: EnvironmentVariable[]) => void;
    envSecrets: Record<string, string>;
    setEnvSecrets: (envSecrets: Record<string, string>) => void;
};
export declare const createEnvVariableSlice: StateCreator<EnvVariableSliceShape>;
