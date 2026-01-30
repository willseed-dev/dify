import type { StateCreator } from 'zustand';
import type { VersionHistory } from '@/types/workflow';
export type VersionSliceShape = {
    draftUpdatedAt: number;
    setDraftUpdatedAt: (draftUpdatedAt: number) => void;
    publishedAt: number;
    setPublishedAt: (publishedAt: number) => void;
    currentVersion: VersionHistory | null;
    setCurrentVersion: (currentVersion: VersionHistory) => void;
    isRestoring: boolean;
    setIsRestoring: (isRestoring: boolean) => void;
};
export declare const createVersionSlice: StateCreator<VersionSliceShape>;
