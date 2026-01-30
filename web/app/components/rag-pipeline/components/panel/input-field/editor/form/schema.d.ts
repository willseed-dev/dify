import type { TFunction } from 'i18next';
import type { SchemaOptions } from './types';
import { PipelineInputVarType } from '@/models/pipeline';
export declare const TEXT_MAX_LENGTH = 256;
export declare const TransferMethod: any;
export declare const SupportedFileTypes: any;
export declare const createInputFieldSchema: (type: PipelineInputVarType, t: TFunction, options: SchemaOptions) => any;
