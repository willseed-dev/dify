"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureMockAudioManager = void 0;
const audio_player_manager_1 = require("@/app/components/base/audio-btn/audio.player.manager");
class MockAudioPlayer {
    constructor() {
        this.callback = null;
    }
    setCallback(callback) {
        this.callback = callback;
    }
    playAudio() {
        this.clearTimer();
        this.callback?.('play');
        this.finishTimer = setTimeout(() => {
            this.callback?.('ended');
        }, 2000);
    }
    pauseAudio() {
        this.clearTimer();
        this.callback?.('paused');
    }
    clearTimer() {
        if (this.finishTimer)
            clearTimeout(this.finishTimer);
    }
}
class MockAudioPlayerManager {
    constructor() {
        this.player = new MockAudioPlayer();
    }
    getAudioPlayer(_url, _isPublic, _id, _msgContent, _voice, callback) {
        this.player.setCallback(callback);
        return this.player;
    }
    resetMsgId() {
        // No-op for the mock
    }
}
const ensureMockAudioManager = () => {
    const managerAny = audio_player_manager_1.AudioPlayerManager;
    if (managerAny.__isStorybookMockInstalled)
        return;
    const mock = new MockAudioPlayerManager();
    managerAny.getInstance = () => mock;
    managerAny.__isStorybookMockInstalled = true;
};
exports.ensureMockAudioManager = ensureMockAudioManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVkaW8tcGxheWVyLW1hbmFnZXIubW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF1ZGlvLXBsYXllci1tYW5hZ2VyLm1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0ZBQXlGO0FBSXpGLE1BQU0sZUFBZTtJQUFyQjtRQUNVLGFBQVEsR0FBbUIsSUFBSSxDQUFBO0lBd0J6QyxDQUFDO0lBckJRLFdBQVcsQ0FBQyxRQUF3QjtRQUN6QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtJQUMxQixDQUFDO0lBRU0sU0FBUztRQUNkLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUMxQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDVixDQUFDO0lBRU0sVUFBVTtRQUNmLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDM0IsQ0FBQztJQUVPLFVBQVU7UUFDaEIsSUFBSSxJQUFJLENBQUMsV0FBVztZQUNsQixZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7Q0FDRjtBQUVELE1BQU0sc0JBQXNCO0lBQTVCO1FBQ21CLFdBQU0sR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFBO0lBaUJqRCxDQUFDO0lBZlEsY0FBYyxDQUNuQixJQUFZLEVBQ1osU0FBa0IsRUFDbEIsR0FBdUIsRUFDdkIsV0FBc0MsRUFDdEMsTUFBMEIsRUFDMUIsUUFBd0I7UUFFeEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDakMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3BCLENBQUM7SUFFTSxVQUFVO1FBQ2YscUJBQXFCO0lBQ3ZCLENBQUM7Q0FDRjtBQUVNLE1BQU0sc0JBQXNCLEdBQUcsR0FBRyxFQUFFO0lBQ3pDLE1BQU0sVUFBVSxHQUFHLHlDQUdsQixDQUFBO0lBRUQsSUFBSSxVQUFVLENBQUMsMEJBQTBCO1FBQ3ZDLE9BQU07SUFFUixNQUFNLElBQUksR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUE7SUFDekMsVUFBVSxDQUFDLFdBQVcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFxQyxDQUFBO0lBQ3BFLFVBQVUsQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUE7QUFDOUMsQ0FBQyxDQUFBO0FBWlksUUFBQSxzQkFBc0IsMEJBWWxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXVkaW9QbGF5ZXJNYW5hZ2VyIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2F1ZGlvLWJ0bi9hdWRpby5wbGF5ZXIubWFuYWdlcidcblxudHlwZSBQbGF5ZXJDYWxsYmFjayA9ICgoZXZlbnQ6IHN0cmluZykgPT4gdm9pZCkgfCBudWxsXG5cbmNsYXNzIE1vY2tBdWRpb1BsYXllciB7XG4gIHByaXZhdGUgY2FsbGJhY2s6IFBsYXllckNhbGxiYWNrID0gbnVsbFxuICBwcml2YXRlIGZpbmlzaFRpbWVyPzogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD5cblxuICBwdWJsaWMgc2V0Q2FsbGJhY2soY2FsbGJhY2s6IFBsYXllckNhbGxiYWNrKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrXG4gIH1cblxuICBwdWJsaWMgcGxheUF1ZGlvKCkge1xuICAgIHRoaXMuY2xlYXJUaW1lcigpXG4gICAgdGhpcy5jYWxsYmFjaz8uKCdwbGF5JylcbiAgICB0aGlzLmZpbmlzaFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmNhbGxiYWNrPy4oJ2VuZGVkJylcbiAgICB9LCAyMDAwKVxuICB9XG5cbiAgcHVibGljIHBhdXNlQXVkaW8oKSB7XG4gICAgdGhpcy5jbGVhclRpbWVyKClcbiAgICB0aGlzLmNhbGxiYWNrPy4oJ3BhdXNlZCcpXG4gIH1cblxuICBwcml2YXRlIGNsZWFyVGltZXIoKSB7XG4gICAgaWYgKHRoaXMuZmluaXNoVGltZXIpXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5maW5pc2hUaW1lcilcbiAgfVxufVxuXG5jbGFzcyBNb2NrQXVkaW9QbGF5ZXJNYW5hZ2VyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBwbGF5ZXIgPSBuZXcgTW9ja0F1ZGlvUGxheWVyKClcblxuICBwdWJsaWMgZ2V0QXVkaW9QbGF5ZXIoXG4gICAgX3VybDogc3RyaW5nLFxuICAgIF9pc1B1YmxpYzogYm9vbGVhbixcbiAgICBfaWQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBfbXNnQ29udGVudDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCxcbiAgICBfdm9pY2U6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBjYWxsYmFjazogUGxheWVyQ2FsbGJhY2ssXG4gICkge1xuICAgIHRoaXMucGxheWVyLnNldENhbGxiYWNrKGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzLnBsYXllclxuICB9XG5cbiAgcHVibGljIHJlc2V0TXNnSWQoKSB7XG4gICAgLy8gTm8tb3AgZm9yIHRoZSBtb2NrXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGVuc3VyZU1vY2tBdWRpb01hbmFnZXIgPSAoKSA9PiB7XG4gIGNvbnN0IG1hbmFnZXJBbnkgPSBBdWRpb1BsYXllck1hbmFnZXIgYXMgdW5rbm93biBhcyB7XG4gICAgZ2V0SW5zdGFuY2U6ICgpID0+IEF1ZGlvUGxheWVyTWFuYWdlclxuICAgIF9faXNTdG9yeWJvb2tNb2NrSW5zdGFsbGVkPzogYm9vbGVhblxuICB9XG5cbiAgaWYgKG1hbmFnZXJBbnkuX19pc1N0b3J5Ym9va01vY2tJbnN0YWxsZWQpXG4gICAgcmV0dXJuXG5cbiAgY29uc3QgbW9jayA9IG5ldyBNb2NrQXVkaW9QbGF5ZXJNYW5hZ2VyKClcbiAgbWFuYWdlckFueS5nZXRJbnN0YW5jZSA9ICgpID0+IG1vY2sgYXMgdW5rbm93biBhcyBBdWRpb1BsYXllck1hbmFnZXJcbiAgbWFuYWdlckFueS5fX2lzU3Rvcnlib29rTW9ja0luc3RhbGxlZCA9IHRydWVcbn1cbiJdfQ==