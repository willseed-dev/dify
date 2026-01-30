import type { ModelParameterRule } from '@/app/components/header/account-setting/model-provider-page/declarations';
export declare const API_PREFIX: any;
export declare const PUBLIC_API_PREFIX: any;
export declare const MARKETPLACE_API_PREFIX: any;
export declare const MARKETPLACE_URL_PREFIX: any;
export declare const IS_CE_EDITION: boolean;
export declare const IS_CLOUD_EDITION: boolean;
export declare const AMPLITUDE_API_KEY: any;
export declare const IS_DEV: boolean;
export declare const IS_PROD: boolean;
export declare const SUPPORT_MAIL_LOGIN: boolean;
export declare const TONE_LIST: readonly [{
    readonly id: 1;
    readonly name: "Creative";
    readonly config: {
        readonly temperature: 0.8;
        readonly top_p: 0.9;
        readonly presence_penalty: 0.1;
        readonly frequency_penalty: 0.1;
    };
}, {
    readonly id: 2;
    readonly name: "Balanced";
    readonly config: {
        readonly temperature: 0.5;
        readonly top_p: 0.85;
        readonly presence_penalty: 0.2;
        readonly frequency_penalty: 0.3;
    };
}, {
    readonly id: 3;
    readonly name: "Precise";
    readonly config: {
        readonly temperature: 0.2;
        readonly top_p: 0.75;
        readonly presence_penalty: 0.5;
        readonly frequency_penalty: 0.5;
    };
}, {
    readonly id: 4;
    readonly name: "Custom";
    readonly config: undefined;
}];
export declare const DEFAULT_CHAT_PROMPT_CONFIG: {
    prompt: {
        role: any;
        text: string;
    }[];
};
export declare const DEFAULT_COMPLETION_PROMPT_CONFIG: {
    prompt: {
        text: string;
    };
    conversation_histories_role: {
        user_prefix: string;
        assistant_prefix: string;
    };
};
export declare const getMaxToken: (modelId: string) => 8000 | 4000;
export declare const LOCALE_COOKIE_NAME = "locale";
export declare const BATCH_CONCURRENCY: number;
export declare const CSRF_COOKIE_NAME: () => "csrf_token" | "__Host-csrf_token";
export declare const CSRF_HEADER_NAME = "X-CSRF-Token";
export declare const ACCESS_TOKEN_LOCAL_STORAGE_NAME = "access_token";
export declare const PASSPORT_LOCAL_STORAGE_NAME: (appCode: string) => string;
export declare const PASSPORT_HEADER_NAME = "X-App-Passport";
export declare const WEB_APP_SHARE_CODE_HEADER_NAME = "X-App-Code";
export declare const DEFAULT_VALUE_MAX_LEN = 48;
export declare const DEFAULT_PARAGRAPH_VALUE_MAX_LEN = 1000;
export declare const zhRegex: RegExp;
export declare const emojiRegex: RegExp;
export declare const emailRegex: RegExp;
export declare const getMaxVarNameLength: (value: string) => 8 | 30;
export declare const MAX_VAR_KEY_LENGTH = 30;
export declare const MAX_PROMPT_MESSAGE_LENGTH = 10;
export declare const VAR_ITEM_TEMPLATE: {
    key: string;
    name: string;
    type: string;
    max_length: number;
    required: boolean;
};
export declare const VAR_ITEM_TEMPLATE_IN_WORKFLOW: {
    variable: string;
    label: string;
    type: any;
    max_length: number;
    required: boolean;
    options: never[];
};
export declare const VAR_ITEM_TEMPLATE_IN_PIPELINE: {
    variable: string;
    label: string;
    type: any;
    max_length: number;
    required: boolean;
    options: never[];
};
export declare const appDefaultIconBackground = "#D5F5F6";
export declare const NEED_REFRESH_APP_LIST_KEY = "needRefreshAppList";
export declare const DATASET_DEFAULT: {
    top_k: number;
    score_threshold: number;
};
export declare const APP_PAGE_LIMIT = 10;
export declare const ANNOTATION_DEFAULT: {
    score_threshold: number;
};
export declare const DEFAULT_AGENT_SETTING: {
    enabled: boolean;
    max_iteration: number;
    strategy: any;
    tools: never[];
};
export declare const DEFAULT_AGENT_PROMPT: {
    chat: string;
    completion: string;
};
export declare const VAR_REGEX: RegExp;
export declare const resetReg: () => number;
export declare const DISABLE_UPLOAD_IMAGE_AS_ICON: boolean;
export declare const GITHUB_ACCESS_TOKEN: string;
export declare const SUPPORT_INSTALL_LOCAL_FILE_EXTENSIONS = ".difypkg,.difybndl";
export declare const FULL_DOC_PREVIEW_LENGTH = 50;
export declare const JSON_SCHEMA_MAX_DEPTH = 10;
export declare const MAX_TOOLS_NUM: number;
export declare const MAX_PARALLEL_LIMIT: number;
export declare const TEXT_GENERATION_TIMEOUT_MS: number;
export declare const LOOP_NODE_MAX_COUNT: number;
export declare const MAX_ITERATIONS_NUM: number;
export declare const MAX_TREE_DEPTH: number;
export declare const ALLOW_UNSAFE_DATA_SCHEME: boolean;
export declare const ENABLE_WEBSITE_JINAREADER: boolean;
export declare const ENABLE_WEBSITE_FIRECRAWL: boolean;
export declare const ENABLE_WEBSITE_WATERCRAWL: boolean;
export declare const ENABLE_SINGLE_DOLLAR_LATEX: boolean;
export declare const VALUE_SELECTOR_DELIMITER = "@@@";
export declare const validPassword: RegExp;
export declare const ZENDESK_WIDGET_KEY: any;
export declare const ZENDESK_FIELD_IDS: {
    ENVIRONMENT: any;
    VERSION: any;
    EMAIL: any;
    WORKSPACE_ID: any;
    PLAN: any;
};
export declare const APP_VERSION: any;
export declare const IS_MARKETPLACE: boolean;
export declare const RAG_PIPELINE_PREVIEW_CHUNK_NUM = 20;
export declare const PROVIDER_WITH_PRESET_TONE: string[];
export declare const STOP_PARAMETER_RULE: ModelParameterRule;
export declare const PARTNER_STACK_CONFIG: {
    cookieName: string;
    saveCookieDays: number;
};
