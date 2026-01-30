import type { Option } from './type';
import { ChunkStructureEnum } from '../../types';
export declare const useChunkStructure: () => {
    options: Option[];
    optionMap: Record<ChunkStructureEnum, Option>;
};
