import type { I18nKeysWithPrefix } from '@/types/i18n';
type EncryptedKey = I18nKeysWithPrefix<'common', 'provider.encrypted.'>;
type Props = {
    className?: string;
    frontTextKey?: EncryptedKey;
    backTextKey?: EncryptedKey;
};
export declare const EncryptedBottom: (props: Props) => any;
export {};
