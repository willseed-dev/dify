declare global {
    interface Window {
        ManagedMediaSource: any;
    }
}
export default class AudioPlayer {
    mediaSource: MediaSource | null;
    audio: HTMLAudioElement;
    audioContext: AudioContext;
    sourceBuffer?: any;
    cacheBuffers: ArrayBuffer[];
    pauseTimer: number | null;
    msgId: string | undefined;
    msgContent: string | null | undefined;
    voice: string | undefined;
    isLoadData: boolean;
    url: string;
    isPublic: boolean;
    callback: ((event: string) => void) | null;
    constructor(streamUrl: string, isPublic: boolean, msgId: string | undefined, msgContent: string | null | undefined, voice: string | undefined, callback: ((event: string) => void) | null);
    resetMsgId(msgId: string): void;
    private listenMediaSource;
    setCallback(callback: ((event: string) => void) | null): void;
    private loadAudio;
    playAudio(): void;
    private theEndOfStream;
    private finishStream;
    playAudioWithAudio(audio: string, play?: boolean): Promise<void>;
    pauseAudio(): void;
    private receiveAudioData;
    private byteArrayToArrayBuffer;
}
