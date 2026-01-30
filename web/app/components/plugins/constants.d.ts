import { PluginCategoryEnum } from './types';
export declare const tagKeys: readonly ["agent", "rag", "search", "image", "videos", "weather", "finance", "design", "travel", "social", "news", "medical", "productivity", "education", "business", "entertainment", "utilities", "other"];
export type TagKey = typeof tagKeys[number];
export declare const categoryKeys: readonly [PluginCategoryEnum.model, PluginCategoryEnum.tool, PluginCategoryEnum.datasource, PluginCategoryEnum.agent, PluginCategoryEnum.extension, "bundle", PluginCategoryEnum.trigger];
export type CategoryKey = typeof categoryKeys[number];
