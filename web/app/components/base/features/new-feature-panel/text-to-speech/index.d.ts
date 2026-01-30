import type { OnFeaturesChange } from '@/app/components/base/features/types';
type Props = {
    disabled: boolean;
    onChange?: OnFeaturesChange;
};
declare const TextToSpeech: ({ disabled, onChange, }: Props) => any;
export default TextToSpeech;
