"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default = void 0;
const _1 = require(".");
const AUDIO_SOURCES = [
    'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
];
const meta = {
    title: 'Base/Data Display/AudioGallery',
    component: _1.default,
    parameters: {
        docs: {
            description: {
                component: 'List of audio players that render waveform previews and playback controls for each source.',
            },
            source: {
                language: 'tsx',
                code: `
<AudioGallery
  srcs={[
    'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
  ]}
/>
        `.trim(),
            },
        },
    },
    tags: ['autodocs'],
    args: {
        srcs: AUDIO_SOURCES,
    },
};
exports.default = meta;
exports.Default = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdCQUE0QjtBQUU1QixNQUFNLGFBQWEsR0FBRztJQUNwQiw2RUFBNkU7Q0FDOUUsQ0FBQTtBQUVELE1BQU0sSUFBSSxHQUFHO0lBQ1gsS0FBSyxFQUFFLGdDQUFnQztJQUN2QyxTQUFTLEVBQUUsVUFBWTtJQUN2QixVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUU7WUFDSixXQUFXLEVBQUU7Z0JBQ1gsU0FBUyxFQUFFLDRGQUE0RjthQUN4RztZQUNELE1BQU0sRUFBRTtnQkFDTixRQUFRLEVBQUUsS0FBSztnQkFDZixJQUFJLEVBQUU7Ozs7OztTQU1MLENBQUMsSUFBSSxFQUFFO2FBQ1Q7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDO0lBQ2xCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxhQUFhO0tBQ3BCO0NBQ2tDLENBQUE7QUFFckMsa0JBQWUsSUFBSSxDQUFBO0FBR04sUUFBQSxPQUFPLEdBQVUsRUFBRSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhLCBTdG9yeU9iaiB9IGZyb20gJ0BzdG9yeWJvb2svbmV4dGpzJ1xuaW1wb3J0IEF1ZGlvR2FsbGVyeSBmcm9tICcuJ1xuXG5jb25zdCBBVURJT19TT1VSQ0VTID0gW1xuICAnaHR0cHM6Ly9pbnRlcmFjdGl2ZS1leGFtcGxlcy5tZG4ubW96aWxsYS5uZXQvbWVkaWEvY2MwLWF1ZGlvL3QtcmV4LXJvYXIubXAzJyxcbl1cblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRGlzcGxheS9BdWRpb0dhbGxlcnknLFxuICBjb21wb25lbnQ6IEF1ZGlvR2FsbGVyeSxcbiAgcGFyYW1ldGVyczoge1xuICAgIGRvY3M6IHtcbiAgICAgIGRlc2NyaXB0aW9uOiB7XG4gICAgICAgIGNvbXBvbmVudDogJ0xpc3Qgb2YgYXVkaW8gcGxheWVycyB0aGF0IHJlbmRlciB3YXZlZm9ybSBwcmV2aWV3cyBhbmQgcGxheWJhY2sgY29udHJvbHMgZm9yIGVhY2ggc291cmNlLicsXG4gICAgICB9LFxuICAgICAgc291cmNlOiB7XG4gICAgICAgIGxhbmd1YWdlOiAndHN4JyxcbiAgICAgICAgY29kZTogYFxuPEF1ZGlvR2FsbGVyeVxuICBzcmNzPXtbXG4gICAgJ2h0dHBzOi8vaW50ZXJhY3RpdmUtZXhhbXBsZXMubWRuLm1vemlsbGEubmV0L21lZGlhL2NjMC1hdWRpby90LXJleC1yb2FyLm1wMycsXG4gIF19XG4vPlxuICAgICAgICBgLnRyaW0oKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGFnczogWydhdXRvZG9jcyddLFxuICBhcmdzOiB7XG4gICAgc3JjczogQVVESU9fU09VUkNFUyxcbiAgfSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIEF1ZGlvR2FsbGVyeT5cblxuZXhwb3J0IGRlZmF1bHQgbWV0YVxudHlwZSBTdG9yeSA9IFN0b3J5T2JqPHR5cGVvZiBtZXRhPlxuXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7fVxuIl19