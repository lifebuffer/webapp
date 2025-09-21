# Voice Recording Feature Documentation

## Overview

The Voice Recording feature allows users to create activities by speaking instead of typing. The system uses OpenAI's Whisper API for speech-to-text conversion and GPT-4o-mini for intelligent content processing, automatically creating well-structured activities with appropriate titles and notes.

## Features

### Core Functionality
- **One-touch recording**: Press 'v' to start/stop recording
- **Real-time visual feedback**: Audio wave visualization during recording
- **Intelligent processing**: AI-powered title and notes extraction
- **Multiple audio formats**: WebM Opus (preferred), WAV, MP3, M4A, OGG
- **60-second limit**: Automatic stop after 1 minute
- **Error handling**: Graceful fallbacks and user feedback

### User Experience
- **Auto-start**: Recording begins immediately when modal opens
- **Visual states**: Clear indicators for requesting, recording, processing
- **Progress feedback**: Countdown timer and audio level display
- **Keyboard shortcuts**: 'v' to toggle, Escape to cancel
- **Error recovery**: Manual entry option on processing failures

## Technical Architecture

### Frontend Components

#### VoiceRecordingModal
```typescript
interface VoiceRecordingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onError: () => void; // Fallback to manual entry
}
```

**Key Features:**
- Web Audio API integration with MediaRecorder
- Real-time audio level monitoring with AnalyserNode
- WebM Opus recording with fallback to supported formats
- Automatic cleanup of audio streams and contexts
- TypeScript-safe with comprehensive error handling

#### Audio Recording Configuration
```typescript
const audioConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: 16000, // Optimized for speech recognition
};

const mediaRecorderOptions = {
  mimeType: 'audio/webm;codecs=opus',
  audioBitsPerSecond: 16000, // Good quality for speech
};
```

### Backend Implementation

#### API Endpoint
```php
POST /api/activities/voice
Content-Type: multipart/form-data
Authorization: Bearer {access_token}

Parameters:
- audio: File (required) - Audio file (webm, wav, mp3, m4a, ogg, max 10MB)

Response:
{
  "title": "Extracted activity title",
  "notes": "Detailed notes (optional)",
  "transcript": "Full transcription for debugging"
}
```

#### Processing Pipeline

1. **File Validation**
   - File type validation (webm, wav, mp3, m4a, ogg)
   - Size limit check (10MB maximum)
   - Temporary storage with automatic cleanup

2. **Speech-to-Text (Whisper API)**
   ```php
   POST https://api.openai.com/v1/audio/transcriptions
   {
     "model": "whisper-1",
     "language": "en",
     "response_format": "json",
     "temperature": 0
   }
   ```

3. **Content Processing (GPT-4o-mini)**
   - **Short transcripts** (< 8 words): Used directly as title
   - **Longer transcripts**: AI extraction of title and notes
   ```php
   POST https://api.openai.com/v1/chat/completions
   {
     "model": "gpt-4o-mini",
     "temperature": 0.3,
     "response_format": {"type": "json_object"}
   }
   ```

## Configuration

### Environment Variables

```bash
# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-your-api-key-here
```

### Service Configuration
```php
// config/services.php
'openai' => [
    'api_key' => env('OPENAI_API_KEY'),
],
```

## Usage Instructions

### For Users

1. **Start Recording**
   - Press 'v' key anywhere in the application
   - Grant microphone permission when prompted
   - Recording starts automatically

2. **During Recording**
   - Speak clearly and naturally
   - Visual wave animation shows audio levels
   - Countdown timer displays remaining time
   - Press 'v' again to stop early

3. **Processing**
   - System shows "Processing..." state
   - AI transcribes and structures content
   - Activity is created automatically

4. **Error Handling**
   - If processing fails, manual entry dialog appears
   - User can try again or enter activity manually

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `v` | Start/stop voice recording |
| `v` (in modal) | Toggle recording state |
| `Escape` | Cancel recording and close modal |

## AI Processing Logic

### Title Extraction
- **Short recordings** (< 8 words): Full transcript becomes title
- **Long recordings**: AI extracts 5-8 word summary as title

### Notes Generation
- **Short recordings**: No notes generated
- **Long recordings**: Additional context and details extracted as notes

### Example Processing

**Input:** "Fix the authentication bug in the login system. The password validation is not working correctly and users cannot sign in with valid credentials."

**Output:**
```json
{
  "title": "Fix authentication bug",
  "notes": "The password validation is not working correctly and users cannot sign in with valid credentials.",
  "transcript": "Fix the authentication bug in the login system. The password validation is not working correctly and users cannot sign in with valid credentials."
}
```

## Error Handling

### Frontend Error States
- **Permission Denied**: Clear message with retry option
- **Recording Failed**: Technical error with retry option
- **Processing Failed**: Network/API error with manual entry fallback
- **Empty Transcription**: No speech detected, retry or manual entry

### Backend Error Handling
- **Missing OpenAI API Key**: Graceful fallback to manual text splitting
- **Whisper API Failure**: Detailed logging with user-friendly error message
- **ChatGPT API Failure**: Automatic fallback to rule-based text processing
- **File Processing Errors**: Cleanup and clear error reporting

### Fallback Mechanisms
1. **API Unavailable**: Manual text splitting for title/notes
2. **Malformed AI Response**: Rule-based content processing
3. **Network Issues**: Clear error messages with retry options
4. **Permission Issues**: Instructions for enabling microphone access

## Browser Compatibility

### Supported Browsers
- **Chrome/Edge**: Full support (WebM Opus)
- **Firefox**: Full support (WebM Opus)
- **Safari**: WebM with fallback to supported formats
- **Mobile browsers**: Device-dependent audio format support

### Required APIs
- **MediaDevices.getUserMedia()**: Microphone access
- **MediaRecorder API**: Audio recording
- **Web Audio API**: Audio level monitoring
- **FileReader API**: Audio file handling

### Graceful Degradation
- Automatic format detection and fallback
- Clear error messages for unsupported browsers
- Manual entry option always available

## Performance Considerations

### Frontend Optimization
- **Memory Management**: Proper cleanup of audio contexts and streams
- **File Size**: 16kbps recording optimized for speech
- **Real-time Processing**: Efficient audio level calculation
- **Network**: Compressed audio upload with progress indication

### Backend Optimization
- **Temporary Storage**: Automatic file cleanup after processing
- **API Caching**: Consider caching for repeated transcriptions
- **Error Logging**: Structured logging for debugging
- **Rate Limiting**: API usage monitoring and limits

## Security Considerations

### Data Privacy
- **Temporary Storage**: Audio files deleted immediately after processing
- **No Persistence**: Audio data never permanently stored
- **API Security**: Secure OpenAI API key management
- **User Consent**: Clear microphone permission requests

### Input Validation
- **File Type Validation**: Strict MIME type checking
- **File Size Limits**: 10MB maximum to prevent abuse
- **Content Filtering**: Consider inappropriate content detection
- **Rate Limiting**: Prevent API abuse with request limits

## Testing

### Comprehensive Test Suite

The voice recording feature includes extensive tests covering:

#### Backend Tests (`VoiceActivityTest.php`)
- ✅ **Complete voice processing workflow**
- ✅ **Short transcript handling**
- ✅ **Audio file validation** (type, size, format)
- ✅ **Whisper API failure handling**
- ✅ **Empty transcription handling**
- ✅ **ChatGPT API failure graceful fallback**
- ✅ **Authentication requirements**
- ✅ **Temporary file cleanup**
- ✅ **Malformed AI response handling**
- ✅ **Multiple audio format support**

#### Test Execution
```bash
# Run all voice recording tests
cd api
php artisan test --filter=VoiceActivityTest

# Run specific test
php artisan test --filter=it_can_create_activity_from_voice_recording

# Run with coverage
php artisan test --coverage --filter=VoiceActivityTest
```

### Frontend Testing Strategy
```typescript
// Mock Web Audio API
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
};

// Mock getUserMedia
navigator.mediaDevices.getUserMedia = jest.fn().mockResolvedValue(mockStream);

// Test recording states
test('should transition through recording states correctly', () => {
  // Test implementation
});
```

## Troubleshooting

### Common Issues

1. **Microphone Permission Denied**
   - **Symptom**: Modal shows permission error
   - **Solution**: Enable microphone in browser settings
   - **Prevention**: Clear permission request messaging

2. **No Audio Detected**
   - **Symptom**: Empty transcription returned
   - **Solution**: Check microphone levels, speak louder
   - **Prevention**: Audio level monitoring and feedback

3. **Processing Failures**
   - **Symptom**: "Failed to process" error
   - **Solution**: Check network connection, retry
   - **Prevention**: Robust error handling and fallbacks

4. **Poor Transcription Quality**
   - **Symptom**: Incorrect or garbled text
   - **Solution**: Speak clearly, reduce background noise
   - **Prevention**: Audio preprocessing and noise cancellation

### Debugging

#### Frontend Debugging
```typescript
// Enable verbose logging
localStorage.setItem('voice-debug', 'true');

// Check audio levels
console.log('Audio level:', audioLevel);

// Monitor recording state
console.log('Recording state:', state);
```

#### Backend Debugging
```php
// Enable detailed logging
Log::channel('voice')->info('Processing audio', [
    'file_size' => $audioFile->getSize(),
    'mime_type' => $audioFile->getMimeType(),
]);

// Check API responses
Log::channel('voice')->debug('Whisper response', $whisperResponse);
```

## Future Enhancements

### Planned Features
- **Language Detection**: Auto-detect spoken language
- **Speaker Recognition**: Multi-user voice identification
- **Custom Vocabularies**: Domain-specific term recognition
- **Voice Commands**: Navigate app with voice commands
- **Offline Support**: Local speech recognition fallback

### Performance Improvements
- **Streaming**: Real-time transcription during recording
- **Compression**: Advanced audio compression techniques
- **Caching**: Smart caching of AI responses
- **Batch Processing**: Handle multiple recordings efficiently

### User Experience
- **Voice Training**: Personalized recognition improvement
- **Shortcuts**: Voice-activated app shortcuts
- **Integration**: Voice notes for existing activities
- **Analytics**: Usage patterns and optimization insights

## Conclusion

The Voice Recording feature significantly enhances LifeBuffer's accessibility and user experience by enabling quick, natural activity creation through speech. The robust implementation handles edge cases gracefully while providing excellent performance and user feedback.

The feature is production-ready with comprehensive testing, error handling, and documentation, making it a valuable addition to the LifeBuffer ecosystem.