import type { FC } from 'react';
import type { ParentChildConfig } from '../hooks';
import type { DataSourceType, FileIndexingEstimateResponse } from '@/models/datasets';
import { ChunkingMode } from '@/models/datasets';
type PreviewPanelProps = {
    isMobile: boolean;
    dataSourceType: DataSourceType;
    currentDocForm: ChunkingMode;
    estimate?: FileIndexingEstimateResponse;
    parentChildConfig: ParentChildConfig;
    isSetting?: boolean;
    pickerFiles: Array<{
        id: string;
        name: string;
        extension: string;
    }>;
    pickerValue: {
        id: string;
        name: string;
        extension: string;
    };
    isIdle: boolean;
    isPending: boolean;
    onPickerChange: (selected: {
        id: string;
        name: string;
    }) => void;
};
export declare const PreviewPanel: FC<PreviewPanelProps>;
export {};
