type Props = {
    currentModel: any;
    language: string;
    voice: string;
    onChange: (language: string, voice: string) => void;
};
declare const TTSParamsPanel: ({ currentModel, language, voice, onChange, }: Props) => any;
export default TTSParamsPanel;
