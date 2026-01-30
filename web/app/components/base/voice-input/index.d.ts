type VoiceInputTypes = {
    onConverted: (text: string) => void;
    onCancel: () => void;
    wordTimestamps?: string;
};
declare const VoiceInput: ({ onCancel, onConverted, wordTimestamps, }: VoiceInputTypes) => any;
export default VoiceInput;
