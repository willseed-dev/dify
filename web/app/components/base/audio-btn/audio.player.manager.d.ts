import AudioPlayer from '@/app/components/base/audio-btn/audio';
declare global {
    interface AudioPlayerManager {
        instance: AudioPlayerManager;
    }
}
export declare class AudioPlayerManager {
    private static instance;
    private audioPlayers;
    private msgId;
    static getInstance(): AudioPlayerManager;
    getAudioPlayer(url: string, isPublic: boolean, id: string | undefined, msgContent: string | null | undefined, voice: string | undefined, callback: ((event: string) => void) | null): AudioPlayer;
    resetMsgId(msgId: string): void;
}
