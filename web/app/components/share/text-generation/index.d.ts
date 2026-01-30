import type { FC } from 'react';
import type { InstalledApp } from '@/models/explore';
export type IMainProps = {
    isInstalledApp?: boolean;
    installedAppInfo?: InstalledApp;
    isWorkflow?: boolean;
};
declare const TextGeneration: FC<IMainProps>;
export default TextGeneration;
