import type { TagKey } from './constants';
export declare const getValidTagKeys: (tags: TagKey[]) => ("search" | "image" | "other" | "education" | "agent" | "rag" | "design" | "videos" | "weather" | "finance" | "travel" | "social" | "news" | "medical" | "productivity" | "business" | "entertainment" | "utilities")[];
export declare const getValidCategoryKeys: (category?: string) => import("./types").PluginCategoryEnum | "bundle" | undefined;
export declare const getDocsUrl: (locale: string, path: string) => string;
