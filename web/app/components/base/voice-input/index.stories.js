"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesShowcase = exports.FormWithVoice = exports.NoteTaking = exports.SearchWithVoice = exports.ChatInputWithVoice = exports.RecordingState = exports.Default = void 0;
const react_1 = require("react");
// Mock component since VoiceInput requires browser APIs and service dependencies
const VoiceInputMock = ({ onConverted, onCancel }) => {
    const [state, setState] = (0, react_1.useState)('recording');
    const [duration, setDuration] = (0, react_1.useState)(0);
    // Simulate recording
    (0, react_1.useState)(() => {
        const interval = setInterval(() => {
            setDuration(d => d + 1);
        }, 1000);
        return () => clearInterval(interval);
    });
    const handleStop = () => {
        setState('converting');
        setTimeout(() => {
            onConverted('This is simulated transcribed text from voice input.');
        }, 2000);
    };
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return (<div className="relative h-16 w-full overflow-hidden rounded-xl border-2 border-primary-600">
      <div className="absolute inset-[1.5px] flex items-center overflow-hidden rounded-[10.5px] bg-primary-25 py-[14px] pl-[14.5px] pr-[6.5px]">
        {/* Waveform visualization placeholder */}
        <div className="absolute bottom-0 left-0 flex h-4 w-full items-end gap-[3px] px-2">
          {Array.from({ length: 40 }).map((_, i) => (<div key={i} className="w-[2px] rounded-t bg-blue-200" style={{
                height: `${Math.random() * 100}%`,
                animation: state === 'recording' ? 'pulse 1s infinite' : 'none',
            }}/>))}
        </div>

        {state === 'converting' && (<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"/>)}

        <div className="z-10 grow">
          {state === 'recording' && (<div className="text-sm text-gray-500">Speaking...</div>)}
          {state === 'converting' && (<div className="text-sm text-gray-500">Converting to text...</div>)}
        </div>

        {state === 'recording' && (<div className="mr-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-primary-100" onClick={handleStop}>
            <div className="h-5 w-5 rounded bg-primary-600"/>
          </div>)}

        {state === 'converting' && (<div className="mr-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-gray-200" onClick={onCancel}>
            <span className="text-lg text-gray-500">×</span>
          </div>)}

        <div className={`w-[45px] pl-1 text-xs font-medium ${duration > 500 ? 'text-red-600' : 'text-gray-700'}`}>
          {`0${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`}
        </div>
      </div>
    </div>);
};
const meta = {
    title: 'Base/Data Entry/VoiceInput',
    component: VoiceInputMock,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Voice input component for recording audio and converting speech to text. Features waveform visualization, recording timer (max 10 minutes), and audio-to-text conversion using js-audio-recorder.\n\n**Note:** This is a simplified mock for Storybook. The actual component requires microphone permissions and audio-to-text API.',
            },
        },
    },
    tags: ['autodocs'],
};
exports.default = meta;
// Basic demo
const VoiceInputDemo = () => {
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    const [transcription, setTranscription] = (0, react_1.useState)('');
    const handleStartRecording = () => {
        setIsRecording(true);
        setTranscription('');
    };
    const handleConverted = (text) => {
        setTranscription(text);
        setIsRecording(false);
    };
    const handleCancel = () => {
        setIsRecording(false);
        setTranscription('');
    };
    return (<div style={{ width: '600px' }}>
      {!isRecording && (<button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700" onClick={handleStartRecording}>
          🎤 Start Voice Recording
        </button>)}

      {isRecording && (<VoiceInputMock onConverted={handleConverted} onCancel={handleCancel}/>)}

      {transcription && (<div className="mt-4 rounded-lg bg-gray-50 p-4">
          <div className="mb-2 text-xs font-medium text-gray-600">Transcription:</div>
          <div className="text-sm text-gray-800">{transcription}</div>
        </div>)}
    </div>);
};
// Default state
exports.Default = {
    render: () => <VoiceInputDemo />,
};
// Recording state
exports.RecordingState = {
    render: () => (<div style={{ width: '600px' }}>
      <VoiceInputMock onConverted={() => console.log('Converted')} onCancel={() => console.log('Cancelled')}/>
      <div className="mt-3 text-xs text-gray-500">
        Recording in progress with live waveform visualization
      </div>
    </div>),
};
// Real-world example - Chat input with voice
const ChatInputWithVoiceDemo = () => {
    const [message, setMessage] = (0, react_1.useState)('');
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    return (<div style={{ width: '700px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Chat Interface</h3>

      {/* Existing messages */}
      <div className="mb-4 h-64 space-y-3 overflow-y-auto">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm text-white">
            U
          </div>
          <div className="flex-1">
            <div className="rounded-lg bg-gray-100 p-3 text-sm">
              Hello! How can I help you today?
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm text-white">
            A
          </div>
          <div className="flex-1">
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              I can assist you with various tasks. What would you like to know?
            </div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-3">
        {!isRecording
            ? (<div className="flex gap-2">
                <input type="text" className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm" placeholder="Type a message..." value={message} onChange={e => setMessage(e.target.value)}/>
                <button className="rounded-lg bg-gray-100 px-4 py-3 hover:bg-gray-200" onClick={() => setIsRecording(true)} title="Voice input">
                  🎤
                </button>
                <button className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                  Send
                </button>
              </div>)
            : (<VoiceInputMock onConverted={(text) => {
                    setMessage(text);
                    setIsRecording(false);
                }} onCancel={() => setIsRecording(false)}/>)}
      </div>
    </div>);
};
exports.ChatInputWithVoice = {
    render: () => <ChatInputWithVoiceDemo />,
};
// Real-world example - Search with voice
const SearchWithVoiceDemo = () => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    return (<div style={{ width: '700px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Voice Search</h3>

      {!isRecording
            ? (<div className="flex gap-2">
              <div className="relative flex-1">
                <input type="text" className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-sm" placeholder="Search or use voice..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>
              <button className="rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700" onClick={() => setIsRecording(true)}>
                🎤 Voice Search
              </button>
            </div>)
            : (<VoiceInputMock onConverted={(text) => {
                    setSearchQuery(text);
                    setIsRecording(false);
                }} onCancel={() => setIsRecording(false)}/>)}

      {searchQuery && !isRecording && (<div className="mt-4 rounded-lg bg-blue-50 p-4">
          <div className="mb-2 text-xs font-medium text-blue-900">
            Searching for:
            {' '}
            <strong>{searchQuery}</strong>
          </div>
        </div>)}
    </div>);
};
exports.SearchWithVoice = {
    render: () => <SearchWithVoiceDemo />,
};
// Real-world example - Note taking
const NoteTakingDemo = () => {
    const [notes, setNotes] = (0, react_1.useState)([]);
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    return (<div style={{ width: '700px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Voice Notes</h3>
        <span className="text-sm text-gray-500">
          {notes.length}
          {' '}
          notes
        </span>
      </div>

      <div className="mb-4">
        {!isRecording
            ? (<button className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-3 font-medium text-white hover:bg-red-600" onClick={() => setIsRecording(true)}>
                <span className="text-xl">🎤</span>
                Record Voice Note
              </button>)
            : (<VoiceInputMock onConverted={(text) => {
                    setNotes([...notes, text]);
                    setIsRecording(false);
                }} onCancel={() => setIsRecording(false)}/>)}
      </div>

      <div className="max-h-80 space-y-2 overflow-y-auto">
        {notes.length === 0
            ? (<div className="py-12 text-center text-gray-400">
                No notes yet. Click the button above to start recording.
              </div>)
            : (notes.map((note, index) => (<div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 text-xs text-gray-500">
                        Note
                        {index + 1}
                      </div>
                      <div className="text-sm text-gray-800">{note}</div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500" onClick={() => setNotes(notes.filter((_, i) => i !== index))}>
                      ×
                    </button>
                  </div>
                </div>)))}
      </div>
    </div>);
};
exports.NoteTaking = {
    render: () => <NoteTakingDemo />,
};
// Real-world example - Form with voice
const FormWithVoiceDemo = () => {
    const [formData, setFormData] = (0, react_1.useState)({
        name: '',
        description: '',
    });
    const [activeField, setActiveField] = (0, react_1.useState)(null);
    return (<div style={{ width: '600px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Create Product</h3>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Product Name
          </label>
          {activeField === 'name'
            ? (<VoiceInputMock onConverted={(text) => {
                    setFormData({ ...formData, name: text });
                    setActiveField(null);
                }} onCancel={() => setActiveField(null)}/>)
            : (<div className="flex gap-2">
                  <input type="text" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Enter product name..." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}/>
                  <button className="rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200" onClick={() => setActiveField('name')}>
                    🎤
                  </button>
                </div>)}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description
          </label>
          {activeField === 'description'
            ? (<VoiceInputMock onConverted={(text) => {
                    setFormData({ ...formData, description: text });
                    setActiveField(null);
                }} onCancel={() => setActiveField(null)}/>)
            : (<div className="space-y-2">
                  <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={4} placeholder="Enter product description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}/>
                  <button className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200" onClick={() => setActiveField('description')}>
                    🎤 Use Voice Input
                  </button>
                </div>)}
        </div>

        <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Create Product
        </button>
      </div>
    </div>);
};
exports.FormWithVoice = {
    render: () => <FormWithVoiceDemo />,
};
// Features showcase
exports.FeaturesShowcase = {
    render: () => (<div style={{ width: '700px' }} className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Voice Input Features</h3>

      <div className="mb-6">
        <VoiceInputMock onConverted={() => undefined} onCancel={() => undefined}/>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="mb-2 text-sm font-medium text-blue-900">🎤 Audio Recording</div>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• Uses js-audio-recorder for browser-based recording</li>
            <li>• 16kHz sample rate, 16-bit, mono channel</li>
            <li>• Converts to MP3 format for transmission</li>
          </ul>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <div className="mb-2 text-sm font-medium text-green-900">📊 Waveform Visualization</div>
          <ul className="space-y-1 text-xs text-green-800">
            <li>• Real-time audio level display using Canvas API</li>
            <li>• Animated bars showing voice amplitude</li>
            <li>• Visual feedback during recording</li>
          </ul>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <div className="mb-2 text-sm font-medium text-purple-900">⏱️ Time Limits</div>
          <ul className="space-y-1 text-xs text-purple-800">
            <li>• Maximum recording duration: 10 minutes (600 seconds)</li>
            <li>• Timer turns red after 8:20 (500 seconds)</li>
            <li>• Automatic stop at max duration</li>
          </ul>
        </div>

        <div className="rounded-lg bg-orange-50 p-4">
          <div className="mb-2 text-sm font-medium text-orange-900">🔄 Audio-to-Text Conversion</div>
          <ul className="space-y-1 text-xs text-orange-800">
            <li>• Server-side speech-to-text processing</li>
            <li>• Optional word timestamps support</li>
            <li>• Loading state during conversion</li>
          </ul>
        </div>
      </div>
    </div>),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3Rvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnN0b3JpZXMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUFnQztBQUVoQyxpRkFBaUY7QUFDakYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQU8sRUFBRSxFQUFFO0lBQ3hELE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsSUFBQSxnQkFBUSxFQUFzQyxXQUFXLENBQUMsQ0FBQTtJQUNwRixNQUFNLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxHQUFHLElBQUEsZ0JBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQTtJQUUzQyxxQkFBcUI7SUFDckIsSUFBQSxnQkFBUSxFQUFDLEdBQUcsRUFBRTtRQUNaLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDaEMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3pCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNSLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3RDLENBQUMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxVQUFVLEdBQUcsR0FBRyxFQUFFO1FBQ3RCLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN0QixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsV0FBVyxDQUFDLHNEQUFzRCxDQUFDLENBQUE7UUFDckUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ1YsQ0FBQyxDQUFBO0lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUE7SUFDekMsTUFBTSxPQUFPLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQTtJQUU3QixPQUFPLENBQ0wsQ0FBQyxHQUFHLENBQUMsU0FBUyxD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RUFBRSxDQUFDLGdDQUFnQyxFQUFFLEVBQUUsQ0FDMUM7VUFBQSxFQUFFLEVBQUUsQ0FDTjtRQUFBLEVBQUUsR0FBRyxDQUVMOztRQUFBLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FDMUM7VUFBQSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMENBQTBDLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxDQUMxRjtVQUFBLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FDL0M7WUFBQSxDQUFDLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxFQUFFLENBQy9DO1lBQUEsQ0FBQyxFQUFFLENBQUMsa0NBQWtDLEVBQUUsRUFBRSxDQUMxQztZQUFBLENBQUMsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEVBQUUsQ0FDM0M7VUFBQSxFQUFFLEVBQUUsQ0FDTjtRQUFBLEVBQUUsR0FBRyxDQUNQO01BQUEsRUFBRSxHQUFHLENBQ1A7SUFBQSxFQUFFLEdBQUcsQ0FBQyxDQUNQO0NBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWV0YSwgU3RvcnlPYmogfSBmcm9tICdAc3Rvcnlib29rL25leHRqcydcbmltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5cbi8vIE1vY2sgY29tcG9uZW50IHNpbmNlIFZvaWNlSW5wdXQgcmVxdWlyZXMgYnJvd3NlciBBUElzIGFuZCBzZXJ2aWNlIGRlcGVuZGVuY2llc1xuY29uc3QgVm9pY2VJbnB1dE1vY2sgPSAoeyBvbkNvbnZlcnRlZCwgb25DYW5jZWwgfTogYW55KSA9PiB7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGU8J2lkbGUnIHwgJ3JlY29yZGluZycgfCAnY29udmVydGluZyc+KCdyZWNvcmRpbmcnKVxuICBjb25zdCBbZHVyYXRpb24sIHNldER1cmF0aW9uXSA9IHVzZVN0YXRlKDApXG5cbiAgLy8gU2ltdWxhdGUgcmVjb3JkaW5nXG4gIHVzZVN0YXRlKCgpID0+IHtcbiAgICBjb25zdCBpbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgIHNldER1cmF0aW9uKGQgPT4gZCArIDEpXG4gICAgfSwgMTAwMClcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcbiAgfSlcblxuICBjb25zdCBoYW5kbGVTdG9wID0gKCkgPT4ge1xuICAgIHNldFN0YXRlKCdjb252ZXJ0aW5nJylcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIG9uQ29udmVydGVkKCdUaGlzIGlzIHNpbXVsYXRlZCB0cmFuc2NyaWJlZCB0ZXh0IGZyb20gdm9pY2UgaW5wdXQuJylcbiAgICB9LCAyMDAwKVxuICB9XG5cbiAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoZHVyYXRpb24gLyA2MClcbiAgY29uc3Qgc2Vjb25kcyA9IGR1cmF0aW9uICUgNjBcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgaC0xNiB3LWZ1bGwgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQteGwgYm9yZGVyLTIgYm9yZGVyLXByaW1hcnktNjAwXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LVsxLjVweF0gZmxleCBpdGVtcy1jZW50ZXIgb3ZlcmZsb3ctaGlkZGVuIHJvdW5kZWQtWzEwLjVweF0gYmctcHJpbWFyeS0yNSBweS1bMTRweF0gcGwtWzE0LjVweF0gcHItWzYuNXB4XVwiPlxuICAgICAgICB7LyogV2F2ZWZvcm0gdmlzdWFsaXphdGlvbiBwbGFjZWhvbGRlciAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMCBsZWZ0LTAgZmxleCBoLTQgdy1mdWxsIGl0ZW1zLWVuZCBnYXAtWzNweF0gcHgtMlwiPlxuICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiA0MCB9KS5tYXAoKF8sIGkpID0+IChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LVsycHhdIHJvdW5kZWQtdCBiZy1ibHVlLTIwMFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtNYXRoLnJhbmRvbSgpICogMTAwfSVgLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogc3RhdGUgPT09ICdyZWNvcmRpbmcnID8gJ3B1bHNlIDFzIGluZmluaXRlJyA6ICdub25lJyxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtzdGF0ZSA9PT0gJ2NvbnZlcnRpbmcnICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1yLTIgaC00IHctNCBhbmltYXRlLXNwaW4gcm91bmRlZC1mdWxsIGJvcmRlci0yIGJvcmRlci1wcmltYXJ5LTcwMCBib3JkZXItdC10cmFuc3BhcmVudFwiIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ6LTEwIGdyb3dcIj5cbiAgICAgICAgICB7c3RhdGUgPT09ICdyZWNvcmRpbmcnICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+U3BlYWtpbmcuLi48L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIHtzdGF0ZSA9PT0gJ2NvbnZlcnRpbmcnICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+Q29udmVydGluZyB0byB0ZXh0Li4uPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3N0YXRlID09PSAncmVjb3JkaW5nJyAmJiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibXItMSBmbGV4IGgtOCB3LTggY3Vyc29yLXBvaW50ZXIgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtbGcgaG92ZXI6YmctcHJpbWFyeS0xMDBcIlxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlU3RvcH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtNSB3LTUgcm91bmRlZCBiZy1wcmltYXJ5LTYwMFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAge3N0YXRlID09PSAnY29udmVydGluZycgJiYgKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTEgZmxleCBoLTggdy04IGN1cnNvci1wb2ludGVyIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciByb3VuZGVkLWxnIGhvdmVyOmJnLWdyYXktMjAwXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2FuY2VsfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbGcgdGV4dC1ncmF5LTUwMFwiPsOXPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdy1bNDVweF0gcGwtMSB0ZXh0LXhzIGZvbnQtbWVkaXVtICR7ZHVyYXRpb24gPiA1MDAgPyAndGV4dC1yZWQtNjAwJyA6ICd0ZXh0LWdyYXktNzAwJ31gfT5cbiAgICAgICAgICB7YDAke21pbnV0ZXN9OiR7c2Vjb25kcyA+PSAxMCA/IHNlY29uZHMgOiBgMCR7c2Vjb25kc31gfWB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuY29uc3QgbWV0YSA9IHtcbiAgdGl0bGU6ICdCYXNlL0RhdGEgRW50cnkvVm9pY2VJbnB1dCcsXG4gIGNvbXBvbmVudDogVm9pY2VJbnB1dE1vY2ssXG4gIHBhcmFtZXRlcnM6IHtcbiAgICBsYXlvdXQ6ICdjZW50ZXJlZCcsXG4gICAgZG9jczoge1xuICAgICAgZGVzY3JpcHRpb246IHtcbiAgICAgICAgY29tcG9uZW50OiAnVm9pY2UgaW5wdXQgY29tcG9uZW50IGZvciByZWNvcmRpbmcgYXVkaW8gYW5kIGNvbnZlcnRpbmcgc3BlZWNoIHRvIHRleHQuIEZlYXR1cmVzIHdhdmVmb3JtIHZpc3VhbGl6YXRpb24sIHJlY29yZGluZyB0aW1lciAobWF4IDEwIG1pbnV0ZXMpLCBhbmQgYXVkaW8tdG8tdGV4dCBjb252ZXJzaW9uIHVzaW5nIGpzLWF1ZGlvLXJlY29yZGVyLlxcblxcbioqTm90ZToqKiBUaGlzIGlzIGEgc2ltcGxpZmllZCBtb2NrIGZvciBTdG9yeWJvb2suIFRoZSBhY3R1YWwgY29tcG9uZW50IHJlcXVpcmVzIG1pY3JvcGhvbmUgcGVybWlzc2lvbnMgYW5kIGF1ZGlvLXRvLXRleHQgQVBJLicsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHRhZ3M6IFsnYXV0b2RvY3MnXSxcbn0gc2F0aXNmaWVzIE1ldGE8dHlwZW9mIFZvaWNlSW5wdXRNb2NrPlxuXG5leHBvcnQgZGVmYXVsdCBtZXRhXG50eXBlIFN0b3J5ID0gU3RvcnlPYmo8dHlwZW9mIG1ldGE+XG5cbi8vIEJhc2ljIGRlbW9cbmNvbnN0IFZvaWNlSW5wdXREZW1vID0gKCkgPT4ge1xuICBjb25zdCBbaXNSZWNvcmRpbmcsIHNldElzUmVjb3JkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbdHJhbnNjcmlwdGlvbiwgc2V0VHJhbnNjcmlwdGlvbl0gPSB1c2VTdGF0ZSgnJylcblxuICBjb25zdCBoYW5kbGVTdGFydFJlY29yZGluZyA9ICgpID0+IHtcbiAgICBzZXRJc1JlY29yZGluZyh0cnVlKVxuICAgIHNldFRyYW5zY3JpcHRpb24oJycpXG4gIH1cblxuICBjb25zdCBoYW5kbGVDb252ZXJ0ZWQgPSAodGV4dDogc3RyaW5nKSA9PiB7XG4gICAgc2V0VHJhbnNjcmlwdGlvbih0ZXh0KVxuICAgIHNldElzUmVjb3JkaW5nKGZhbHNlKVxuICB9XG5cbiAgY29uc3QgaGFuZGxlQ2FuY2VsID0gKCkgPT4ge1xuICAgIHNldElzUmVjb3JkaW5nKGZhbHNlKVxuICAgIHNldFRyYW5zY3JpcHRpb24oJycpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc2MDBweCcgfX0+XG4gICAgICB7IWlzUmVjb3JkaW5nICYmIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCByb3VuZGVkLWxnIGJnLWJsdWUtNjAwIHB4LTQgcHktMyBmb250LW1lZGl1bSB0ZXh0LXdoaXRlIGhvdmVyOmJnLWJsdWUtNzAwXCJcbiAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVTdGFydFJlY29yZGluZ31cbiAgICAgICAgPlxuICAgICAgICAgIPCfjqQgU3RhcnQgVm9pY2UgUmVjb3JkaW5nXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKX1cblxuICAgICAge2lzUmVjb3JkaW5nICYmIChcbiAgICAgICAgPFZvaWNlSW5wdXRNb2NrXG4gICAgICAgICAgb25Db252ZXJ0ZWQ9e2hhbmRsZUNvbnZlcnRlZH1cbiAgICAgICAgICBvbkNhbmNlbD17aGFuZGxlQ2FuY2VsfVxuICAgICAgICAvPlxuICAgICAgKX1cblxuICAgICAge3RyYW5zY3JpcHRpb24gJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTQgcm91bmRlZC1sZyBiZy1ncmF5LTUwIHAtNFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMiB0ZXh0LXhzIGZvbnQtbWVkaXVtIHRleHQtZ3JheS02MDBcIj5UcmFuc2NyaXB0aW9uOjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktODAwXCI+e3RyYW5zY3JpcHRpb259PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG4vLyBEZWZhdWx0IHN0YXRlXG5leHBvcnQgY29uc3QgRGVmYXVsdDogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPFZvaWNlSW5wdXREZW1vIC8+LFxufVxuXG4vLyBSZWNvcmRpbmcgc3RhdGVcbmV4cG9ydCBjb25zdCBSZWNvcmRpbmdTdGF0ZTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gKFxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICc2MDBweCcgfX0+XG4gICAgICA8Vm9pY2VJbnB1dE1vY2tcbiAgICAgICAgb25Db252ZXJ0ZWQ9eygpID0+IGNvbnNvbGUubG9nKCdDb252ZXJ0ZWQnKX1cbiAgICAgICAgb25DYW5jZWw9eygpID0+IGNvbnNvbGUubG9nKCdDYW5jZWxsZWQnKX1cbiAgICAgIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTMgdGV4dC14cyB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgIFJlY29yZGluZyBpbiBwcm9ncmVzcyB3aXRoIGxpdmUgd2F2ZWZvcm0gdmlzdWFsaXphdGlvblxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICksXG59XG5cbi8vIFJlYWwtd29ybGQgZXhhbXBsZSAtIENoYXQgaW5wdXQgd2l0aCB2b2ljZVxuY29uc3QgQ2hhdElucHV0V2l0aFZvaWNlRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW21lc3NhZ2UsIHNldE1lc3NhZ2VdID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtpc1JlY29yZGluZywgc2V0SXNSZWNvcmRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNzAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPkNoYXQgSW50ZXJmYWNlPC9oMz5cblxuICAgICAgey8qIEV4aXN0aW5nIG1lc3NhZ2VzICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00IGgtNjQgc3BhY2UteS0zIG92ZXJmbG93LXktYXV0b1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTNcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaC04IHctOCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIGJnLWJsdWUtNTAwIHRleHQtc20gdGV4dC13aGl0ZVwiPlxuICAgICAgICAgICAgVVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYmctZ3JheS0xMDAgcC0zIHRleHQtc21cIj5cbiAgICAgICAgICAgICAgSGVsbG8hIEhvdyBjYW4gSSBoZWxwIHlvdSB0b2RheT9cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0zXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtOCB3LTggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJvdW5kZWQtZnVsbCBiZy1ncmVlbi01MDAgdGV4dC1zbSB0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAgICBBXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTFcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBiZy1ibHVlLTUwIHAtMyB0ZXh0LXNtXCI+XG4gICAgICAgICAgICAgIEkgY2FuIGFzc2lzdCB5b3Ugd2l0aCB2YXJpb3VzIHRhc2tzLiBXaGF0IHdvdWxkIHlvdSBsaWtlIHRvIGtub3c/XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIElucHV0IGFyZWEgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICB7IWlzUmVjb3JkaW5nXG4gICAgICAgICAgPyAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBnYXAtMlwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleC0xIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBweC00IHB5LTMgdGV4dC1zbVwiXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlR5cGUgYSBtZXNzYWdlLi4uXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXttZXNzYWdlfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0TWVzc2FnZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJnLWdyYXktMTAwIHB4LTQgcHktMyBob3ZlcjpiZy1ncmF5LTIwMFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc1JlY29yZGluZyh0cnVlKX1cbiAgICAgICAgICAgICAgICAgIHRpdGxlPVwiVm9pY2UgaW5wdXRcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIPCfjqRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYmctYmx1ZS02MDAgcHgtNiBweS0zIHRleHQtd2hpdGUgaG92ZXI6YmctYmx1ZS03MDBcIj5cbiAgICAgICAgICAgICAgICAgIFNlbmRcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgOiAoXG4gICAgICAgICAgICAgIDxWb2ljZUlucHV0TW9ja1xuICAgICAgICAgICAgICAgIG9uQ29udmVydGVkPXsodGV4dDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICBzZXRNZXNzYWdlKHRleHQpXG4gICAgICAgICAgICAgICAgICBzZXRJc1JlY29yZGluZyhmYWxzZSlcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiBzZXRJc1JlY29yZGluZyhmYWxzZSl9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IENoYXRJbnB1dFdpdGhWb2ljZTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPENoYXRJbnB1dFdpdGhWb2ljZURlbW8gLz4sXG59XG5cbi8vIFJlYWwtd29ybGQgZXhhbXBsZSAtIFNlYXJjaCB3aXRoIHZvaWNlXG5jb25zdCBTZWFyY2hXaXRoVm9pY2VEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbc2VhcmNoUXVlcnksIHNldFNlYXJjaFF1ZXJ5XSA9IHVzZVN0YXRlKCcnKVxuICBjb25zdCBbaXNSZWNvcmRpbmcsIHNldElzUmVjb3JkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzcwMHB4JyB9fSBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0yMDAgYmctd2hpdGUgcC02XCI+XG4gICAgICA8aDMgY2xhc3NOYW1lPVwibWItNCB0ZXh0LWxnIGZvbnQtc2VtaWJvbGRcIj5Wb2ljZSBTZWFyY2g8L2gzPlxuXG4gICAgICB7IWlzUmVjb3JkaW5nXG4gICAgICAgID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC0yXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleC0xXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLWdyYXktMzAwIHB4LTQgcHktMyBwbC0xMCB0ZXh0LXNtXCJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiU2VhcmNoIG9yIHVzZSB2b2ljZS4uLlwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoUXVlcnl9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRTZWFyY2hRdWVyeShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBsZWZ0LTMgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHRleHQtZ3JheS00MDBcIj5cbiAgICAgICAgICAgICAgICAgIPCflI1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBiZy1ibHVlLTYwMCBweC00IHB5LTMgdGV4dC13aGl0ZSBob3ZlcjpiZy1ibHVlLTcwMFwiXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNSZWNvcmRpbmcodHJ1ZSl9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICDwn46kIFZvaWNlIFNlYXJjaFxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgOiAoXG4gICAgICAgICAgICA8Vm9pY2VJbnB1dE1vY2tcbiAgICAgICAgICAgICAgb25Db252ZXJ0ZWQ9eyh0ZXh0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRTZWFyY2hRdWVyeSh0ZXh0KVxuICAgICAgICAgICAgICAgIHNldElzUmVjb3JkaW5nKGZhbHNlKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbkNhbmNlbD17KCkgPT4gc2V0SXNSZWNvcmRpbmcoZmFsc2UpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuXG4gICAgICB7c2VhcmNoUXVlcnkgJiYgIWlzUmVjb3JkaW5nICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC00IHJvdW5kZWQtbGcgYmctYmx1ZS01MCBwLTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTIgdGV4dC14cyBmb250LW1lZGl1bSB0ZXh0LWJsdWUtOTAwXCI+XG4gICAgICAgICAgICBTZWFyY2hpbmcgZm9yOlxuICAgICAgICAgICAgeycgJ31cbiAgICAgICAgICAgIDxzdHJvbmc+e3NlYXJjaFF1ZXJ5fTwvc3Ryb25nPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IFNlYXJjaFdpdGhWb2ljZTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPFNlYXJjaFdpdGhWb2ljZURlbW8gLz4sXG59XG5cbi8vIFJlYWwtd29ybGQgZXhhbXBsZSAtIE5vdGUgdGFraW5nXG5jb25zdCBOb3RlVGFraW5nRGVtbyA9ICgpID0+IHtcbiAgY29uc3QgW25vdGVzLCBzZXROb3Rlc10gPSB1c2VTdGF0ZTxzdHJpbmdbXT4oW10pXG4gIGNvbnN0IFtpc1JlY29yZGluZywgc2V0SXNSZWNvcmRpbmddID0gdXNlU3RhdGUoZmFsc2UpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNzAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItNCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZFwiPlZvaWNlIE5vdGVzPC9oMz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNTAwXCI+XG4gICAgICAgICAge25vdGVzLmxlbmd0aH1cbiAgICAgICAgICB7JyAnfVxuICAgICAgICAgIG5vdGVzXG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTRcIj5cbiAgICAgICAgeyFpc1JlY29yZGluZ1xuICAgICAgICAgID8gKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCB3LWZ1bGwgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIHJvdW5kZWQtbGcgYmctcmVkLTUwMCBweC00IHB5LTMgZm9udC1tZWRpdW0gdGV4dC13aGl0ZSBob3ZlcjpiZy1yZWQtNjAwXCJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJc1JlY29yZGluZyh0cnVlKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteGxcIj7wn46kPC9zcGFuPlxuICAgICAgICAgICAgICAgIFJlY29yZCBWb2ljZSBOb3RlXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogKFxuICAgICAgICAgICAgICA8Vm9pY2VJbnB1dE1vY2tcbiAgICAgICAgICAgICAgICBvbkNvbnZlcnRlZD17KHRleHQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgc2V0Tm90ZXMoWy4uLm5vdGVzLCB0ZXh0XSlcbiAgICAgICAgICAgICAgICAgIHNldElzUmVjb3JkaW5nKGZhbHNlKVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldElzUmVjb3JkaW5nKGZhbHNlKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtaC04MCBzcGFjZS15LTIgb3ZlcmZsb3cteS1hdXRvXCI+XG4gICAgICAgIHtub3Rlcy5sZW5ndGggPT09IDBcbiAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJweS0xMiB0ZXh0LWNlbnRlciB0ZXh0LWdyYXktNDAwXCI+XG4gICAgICAgICAgICAgICAgTm8gbm90ZXMgeWV0LiBDbGljayB0aGUgYnV0dG9uIGFib3ZlIHRvIHN0YXJ0IHJlY29yZGluZy5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApXG4gICAgICAgICAgOiAoXG4gICAgICAgICAgICAgIG5vdGVzLm1hcCgobm90ZSwgaW5kZXgpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2IGtleT17aW5kZXh9IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy1ncmF5LTUwIHAtM1wiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLXN0YXJ0IGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMSB0ZXh0LXhzIHRleHQtZ3JheS01MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIE5vdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHtpbmRleCArIDF9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS04MDBcIj57bm90ZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNDAwIGhvdmVyOnRleHQtcmVkLTUwMFwiXG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Tm90ZXMobm90ZXMuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpbmRleCkpfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgw5dcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgTm90ZVRha2luZzogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPE5vdGVUYWtpbmdEZW1vIC8+LFxufVxuXG4vLyBSZWFsLXdvcmxkIGV4YW1wbGUgLSBGb3JtIHdpdGggdm9pY2VcbmNvbnN0IEZvcm1XaXRoVm9pY2VEZW1vID0gKCkgPT4ge1xuICBjb25zdCBbZm9ybURhdGEsIHNldEZvcm1EYXRhXSA9IHVzZVN0YXRlKHtcbiAgICBuYW1lOiAnJyxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gIH0pXG4gIGNvbnN0IFthY3RpdmVGaWVsZCwgc2V0QWN0aXZlRmllbGRdID0gdXNlU3RhdGU8J25hbWUnIHwgJ2Rlc2NyaXB0aW9uJyB8IG51bGw+KG51bGwpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNjAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPkNyZWF0ZSBQcm9kdWN0PC9oMz5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWItMiBibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS03MDBcIj5cbiAgICAgICAgICAgIFByb2R1Y3QgTmFtZVxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAge2FjdGl2ZUZpZWxkID09PSAnbmFtZSdcbiAgICAgICAgICAgID8gKFxuICAgICAgICAgICAgICAgIDxWb2ljZUlucHV0TW9ja1xuICAgICAgICAgICAgICAgICAgb25Db252ZXJ0ZWQ9eyh0ZXh0OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0Rm9ybURhdGEoeyAuLi5mb3JtRGF0YSwgbmFtZTogdGV4dCB9KVxuICAgICAgICAgICAgICAgICAgICBzZXRBY3RpdmVGaWVsZChudWxsKVxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiBzZXRBY3RpdmVGaWVsZChudWxsKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXgtMSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItZ3JheS0zMDAgcHgtMyBweS0yIHRleHQtc21cIlxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHByb2R1Y3QgbmFtZS4uLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5uYW1lfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRGb3JtRGF0YSh7IC4uLmZvcm1EYXRhLCBuYW1lOiBlLnRhcmdldC52YWx1ZSB9KX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYmctZ3JheS0xMDAgcHgtMyBweS0yIGhvdmVyOmJnLWdyYXktMjAwXCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlRmllbGQoJ25hbWUnKX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAg8J+OpFxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1iLTIgYmxvY2sgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWdyYXktNzAwXCI+XG4gICAgICAgICAgICBEZXNjcmlwdGlvblxuICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAge2FjdGl2ZUZpZWxkID09PSAnZGVzY3JpcHRpb24nXG4gICAgICAgICAgICA/IChcbiAgICAgICAgICAgICAgICA8Vm9pY2VJbnB1dE1vY2tcbiAgICAgICAgICAgICAgICAgIG9uQ29udmVydGVkPXsodGV4dDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHNldEZvcm1EYXRhKHsgLi4uZm9ybURhdGEsIGRlc2NyaXB0aW9uOiB0ZXh0IH0pXG4gICAgICAgICAgICAgICAgICAgIHNldEFjdGl2ZUZpZWxkKG51bGwpXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25DYW5jZWw9eygpID0+IHNldEFjdGl2ZUZpZWxkKG51bGwpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTMwMCBweC0zIHB5LTIgdGV4dC1zbVwiXG4gICAgICAgICAgICAgICAgICAgIHJvd3M9ezR9XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgcHJvZHVjdCBkZXNjcmlwdGlvbi4uLlwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtmb3JtRGF0YS5kZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0Rm9ybURhdGEoeyAuLi5mb3JtRGF0YSwgZGVzY3JpcHRpb246IGUudGFyZ2V0LnZhbHVlIH0pfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHJvdW5kZWQtbGcgYmctZ3JheS0xMDAgcHgtMyBweS0yIHRleHQtc20gaG92ZXI6YmctZ3JheS0yMDBcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVGaWVsZCgnZGVzY3JpcHRpb24nKX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAg8J+OpCBVc2UgVm9pY2UgSW5wdXRcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInctZnVsbCByb3VuZGVkLWxnIGJnLWJsdWUtNjAwIHB4LTQgcHktMiB0ZXh0LXdoaXRlIGhvdmVyOmJnLWJsdWUtNzAwXCI+XG4gICAgICAgICAgQ3JlYXRlIFByb2R1Y3RcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgY29uc3QgRm9ybVdpdGhWb2ljZTogU3RvcnkgPSB7XG4gIHJlbmRlcjogKCkgPT4gPEZvcm1XaXRoVm9pY2VEZW1vIC8+LFxufVxuXG4vLyBGZWF0dXJlcyBzaG93Y2FzZVxuZXhwb3J0IGNvbnN0IEZlYXR1cmVzU2hvd2Nhc2U6IFN0b3J5ID0ge1xuICByZW5kZXI6ICgpID0+IChcbiAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnNzAwcHgnIH19IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1ncmF5LTIwMCBiZy13aGl0ZSBwLTZcIj5cbiAgICAgIDxoMyBjbGFzc05hbWU9XCJtYi00IHRleHQtbGcgZm9udC1zZW1pYm9sZFwiPlZvaWNlIElucHV0IEZlYXR1cmVzPC9oMz5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi02XCI+XG4gICAgICAgIDxWb2ljZUlucHV0TW9ja1xuICAgICAgICAgIG9uQ29udmVydGVkPXsoKSA9PiB1bmRlZmluZWR9XG4gICAgICAgICAgb25DYW5jZWw9eygpID0+IHVuZGVmaW5lZH1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdW5kZWQtbGcgYmctYmx1ZS01MCBwLTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LWJsdWUtOTAwXCI+8J+OpCBBdWRpbyBSZWNvcmRpbmc8L2Rpdj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwic3BhY2UteS0xIHRleHQteHMgdGV4dC1ibHVlLTgwMFwiPlxuICAgICAgICAgICAgPGxpPuKAoiBVc2VzIGpzLWF1ZGlvLXJlY29yZGVyIGZvciBicm93c2VyLWJhc2VkIHJlY29yZGluZzwvbGk+XG4gICAgICAgICAgICA8bGk+4oCiIDE2a0h6IHNhbXBsZSByYXRlLCAxNi1iaXQsIG1vbm8gY2hhbm5lbDwvbGk+XG4gICAgICAgICAgICA8bGk+4oCiIENvbnZlcnRzIHRvIE1QMyBmb3JtYXQgZm9yIHRyYW5zbWlzc2lvbjwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJnLWdyZWVuLTUwIHAtNFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWItMiB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JlZW4tOTAwXCI+8J+TiiBXYXZlZm9ybSBWaXN1YWxpemF0aW9uPC9kaXY+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInNwYWNlLXktMSB0ZXh0LXhzIHRleHQtZ3JlZW4tODAwXCI+XG4gICAgICAgICAgICA8bGk+4oCiIFJlYWwtdGltZSBhdWRpbyBsZXZlbCBkaXNwbGF5IHVzaW5nIENhbnZhcyBBUEk8L2xpPlxuICAgICAgICAgICAgPGxpPuKAoiBBbmltYXRlZCBiYXJzIHNob3dpbmcgdm9pY2UgYW1wbGl0dWRlPC9saT5cbiAgICAgICAgICAgIDxsaT7igKIgVmlzdWFsIGZlZWRiYWNrIGR1cmluZyByZWNvcmRpbmc8L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm91bmRlZC1sZyBiZy1wdXJwbGUtNTAgcC00XCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0yIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1wdXJwbGUtOTAwXCI+4o+x77iPIFRpbWUgTGltaXRzPC9kaXY+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInNwYWNlLXktMSB0ZXh0LXhzIHRleHQtcHVycGxlLTgwMFwiPlxuICAgICAgICAgICAgPGxpPuKAoiBNYXhpbXVtIHJlY29yZGluZyBkdXJhdGlvbjogMTAgbWludXRlcyAoNjAwIHNlY29uZHMpPC9saT5cbiAgICAgICAgICAgIDxsaT7igKIgVGltZXIgdHVybnMgcmVkIGFmdGVyIDg6MjAgKDUwMCBzZWNvbmRzKTwvbGk+XG4gICAgICAgICAgICA8bGk+4oCiIEF1dG9tYXRpYyBzdG9wIGF0IG1heCBkdXJhdGlvbjwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLWxnIGJnLW9yYW5nZS01MCBwLTRcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTIgdGV4dC1zbSBmb250LW1lZGl1bSB0ZXh0LW9yYW5nZS05MDBcIj7wn5SEIEF1ZGlvLXRvLVRleHQgQ29udmVyc2lvbjwvZGl2PlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJzcGFjZS15LTEgdGV4dC14cyB0ZXh0LW9yYW5nZS04MDBcIj5cbiAgICAgICAgICAgIDxsaT7igKIgU2VydmVyLXNpZGUgc3BlZWNoLXRvLXRleHQgcHJvY2Vzc2luZzwvbGk+XG4gICAgICAgICAgICA8bGk+4oCiIE9wdGlvbmFsIHdvcmQgdGltZXN0YW1wcyBzdXBwb3J0PC9saT5cbiAgICAgICAgICAgIDxsaT7igKIgTG9hZGluZyBzdGF0ZSBkdXJpbmcgY29udmVyc2lvbjwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKSxcbn1cbiJdfQ==