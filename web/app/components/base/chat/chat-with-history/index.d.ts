import type { FC } from 'react';
import type { InstalledApp } from '@/models/explore';
export type ChatWithHistoryWrapProps = {
    installedAppInfo?: InstalledApp;
    className?: string;
};
declare const ChatWithHistoryWrapWithCheckToken: FC<ChatWithHistoryWrapProps>;
export default ChatWithHistoryWrapWithCheckToken;
