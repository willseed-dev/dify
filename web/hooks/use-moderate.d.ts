import type { ModerationService } from '@/models/common';
export declare const useModerate: (content: string, stop: boolean, moderationService: (text: string) => ReturnType<ModerationService>, separateLength?: number) => any;
