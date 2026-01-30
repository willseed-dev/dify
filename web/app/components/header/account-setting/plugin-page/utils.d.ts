import { ValidatedStatus } from '../key-validator/declarations';
export declare const validatePluginKey: (pluginType: string, body: any) => Promise<{
    status: ValidatedStatus;
}>;
export declare const updatePluginKey: (pluginType: string, body: any) => Promise<{
    status: ValidatedStatus;
}>;
