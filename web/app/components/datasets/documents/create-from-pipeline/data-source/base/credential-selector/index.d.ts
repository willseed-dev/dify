import type { DataSourceCredential } from '@/types/pipeline';
export type CredentialSelectorProps = {
    currentCredentialId: string;
    onCredentialChange: (credentialId: string) => void;
    credentials: Array<DataSourceCredential>;
};
declare const _default: any;
export default _default;
