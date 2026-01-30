import type { ThoughtItem } from '@/app/components/base/chat/chat/type';
import type { FileEntity } from '@/app/components/base/file-uploader/types';
import type { VisionFile } from '@/types/app';
export declare const sortAgentSorts: (list: ThoughtItem[]) => ThoughtItem[];
export declare const addFileInfos: (list: ThoughtItem[], messageFiles: (FileEntity | VisionFile)[]) => any[];
