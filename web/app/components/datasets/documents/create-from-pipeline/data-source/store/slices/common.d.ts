import type { StateCreator } from 'zustand';
export type CommonShape = {
    currentNodeIdRef: React.RefObject<string>;
    currentCredentialId: string;
    setCurrentCredentialId: (credentialId: string) => void;
    currentCredentialIdRef: React.RefObject<string>;
};
export declare const createCommonSlice: StateCreator<CommonShape>;
