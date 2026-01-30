import type { FormData } from './form/types';
import type { InputVar } from '@/models/pipeline';
export declare const convertToInputFieldFormData: (data?: InputVar) => FormData;
export declare const convertFormDataToINputField: (data: FormData) => InputVar;
