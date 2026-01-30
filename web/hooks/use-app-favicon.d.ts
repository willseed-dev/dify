import type { AppIconType } from '@/types/app';
type UseAppFaviconOptions = {
    enable?: boolean;
    icon_type?: AppIconType | null;
    icon?: string;
    icon_background?: string | null;
    icon_url?: string | null;
};
export declare function useAppFavicon(options: UseAppFaviconOptions): void;
export {};
