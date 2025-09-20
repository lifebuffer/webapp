# LifeBuffer API Documentation

## Overview

The LifeBuffer API provides RESTful endpoints for managing activities, contexts, day notes, and voice recordings. All endpoints require OAuth 2.0 authentication with Bearer tokens.

**Base URL:** `http://api.lifebuffer.test`

## Authentication

All API endpoints require authentication using OAuth 2.0 Bearer tokens.

```http
Authorization: Bearer {access_token}
```

## Voice Recording Endpoint

### Create Activity from Voice Recording

Create a new activity by uploading an audio recording that will be processed using OpenAI's Whisper and GPT-4o-mini.

**Endpoint:** `POST /api/activities/voice`

**Content-Type:** `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audio` | File | Yes | Audio file (webm, wav, mp3, m4a, ogg, max 10MB) |

#### Response

**Success (200 OK):**
```json
{
  "title": "Fix authentication bug",
  "notes": "The password validation is not working correctly and users cannot sign in with valid credentials.",
  "transcript": "Fix the authentication bug in the login system. The password validation is not working correctly and users cannot sign in with valid credentials."
}
```

**Response Fields:**
- `title` (string): Extracted activity title (5-8 words)
- `notes` (string|null): Detailed notes extracted from longer recordings
- `transcript` (string): Full speech-to-text transcription

#### Error Responses

**Validation Error (422 Unprocessable Entity):**
```json
{
  "errors": {
    "audio": [
      "The audio field is required.",
      "The audio must be a file of type: webm, wav, mp3, m4a, ogg.",
      "The audio may not be greater than 10240 kilobytes."
    ]
  }
}
```

**Processing Error (422 Unprocessable Entity):**
```json
{
  "error": "Could not transcribe audio. Please try again."
}
```

**Server Error (500 Internal Server Error):**
```json
{
  "error": "Failed to process voice recording. Please try again."
}
```

**Authentication Error (401 Unauthorized):**
```json
{
  "message": "Unauthenticated."
}
```

#### Processing Logic

1. **Audio Upload Validation**
   - File type must be: webm, wav, mp3, m4a, or ogg
   - File size must be ≤ 10MB
   - File is stored temporarily during processing

2. **Speech-to-Text Processing**
   - Audio sent to OpenAI Whisper API
   - Uses `whisper-1` model with English language setting
   - Temperature set to 0 for accuracy

3. **Content Extraction**
   - **Short transcripts** (< 8 words): Used directly as title
   - **Longer transcripts**: Processed with GPT-4o-mini to extract:
     - Concise title (5-8 words)
     - Detailed notes (additional context)

4. **Fallback Processing**
   - If OpenAI APIs fail, automatic rule-based text splitting
   - Graceful degradation ensures functionality without AI

#### Example Usage

**cURL:**
```bash
curl -X POST \
  http://api.lifebuffer.test/api/activities/voice \
  -H 'Authorization: Bearer your_access_token' \
  -F 'audio=@recording.webm'
```

**JavaScript (FormData):**
```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'recording.webm');

const response = await fetch('/api/activities/voice', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
  body: formData,
});

const result = await response.json();
```

#### Audio Format Requirements

**Supported Formats:**
- **WebM Opus** (preferred): Best compression and quality
- **WAV**: Uncompressed, larger files
- **MP3**: Good compression, widely supported
- **M4A**: Apple format, good quality
- **OGG**: Open source format

**Recommended Settings:**
- **Sample Rate**: 16kHz (sufficient for speech)
- **Bit Rate**: 16kbps (good quality/size balance)
- **Channels**: Mono (speech doesn't need stereo)
- **Duration**: Maximum 60 seconds

#### Rate Limiting

- Voice processing is computationally expensive
- Consider implementing rate limits based on:
  - Requests per user per minute
  - Total processing time per user per hour
  - File size quotas

#### Error Handling Best Practices

1. **Client-Side Validation**
   ```javascript
   // Validate file before upload
   if (file.size > 10 * 1024 * 1024) {
     throw new Error('File too large (max 10MB)');
   }

   const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/ogg'];
   if (!allowedTypes.includes(file.type)) {
     throw new Error('Unsupported audio format');
   }
   ```

2. **Server Response Handling**
   ```javascript
   try {
     const result = await uploadVoiceRecording(audioFile);
     // Create activity with result.title and result.notes
   } catch (error) {
     if (error.status === 422) {
       // Show validation errors or transcription failure
       showManualEntryDialog();
     } else {
       // Show generic error and retry option
       showErrorMessage('Processing failed. Please try again.');
     }
   }
   ```

#### Security Considerations

**File Security:**
- Temporary files are automatically deleted after processing
- Audio content is never permanently stored
- File type validation prevents malicious uploads

**API Security:**
- OpenAI API key stored securely in environment variables
- Request/response logging for debugging (without audio content)
- Proper error handling without exposing internal details

**Privacy:**
- Audio files processed transiently
- Transcripts included in response for transparency
- No long-term storage of voice data

#### Performance Optimization

**Client-Side:**
- Compress audio before upload when possible
- Show progress indicators during upload/processing
- Implement timeout handling for long-running requests

**Server-Side:**
- Efficient temporary file management
- Connection pooling for OpenAI API requests
- Async processing for better throughput

#### Testing

The voice endpoint includes comprehensive test coverage:

```php
// Test successful processing
$response = $this->postJson('/api/activities/voice', [
    'audio' => UploadedFile::fake()->create('test.webm', 1000, 'audio/webm')
]);

$response->assertStatus(200)
         ->assertJsonStructure(['title', 'notes', 'transcript']);
```

See `tests/Feature/VoiceActivityTest.php` for complete test suite.

## Integration Examples

### Frontend Integration

```typescript
// Voice recording modal component
const processVoiceRecording = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  try {
    const response = await api.activities.createFromVoice(formData);

    // Create activity with processed content
    await userActions.createActivity({
      title: response.title,
      notes: response.notes || undefined,
      status: 'new',
      date: getTodayString(),
    });

  } catch (error) {
    // Handle errors gracefully
    showManualEntryDialog();
  }
};
```

### Mobile App Integration

```swift
// iOS example using URLSession
func uploadVoiceRecording(audioData: Data) {
    let url = URL(string: "http://api.lifebuffer.test/api/activities/voice")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

    let boundary = UUID().uuidString
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

    let body = createMultipartBody(audioData: audioData, boundary: boundary)
    request.httpBody = body

    URLSession.shared.dataTask(with: request) { data, response, error in
        // Handle response
    }.resume()
}
```

## Related Endpoints

### Standard Activity Management

**Create Activity (Manual):**
```http
POST /api/activities
Content-Type: application/json

{
  "title": "Manual activity title",
  "notes": "Optional notes",
  "status": "new",
  "time": 60,
  "context_id": 1,
  "date": "2024-01-15"
}
```

**Update Activity:**
```http
PUT /api/activities/{id}
Content-Type: application/json

{
  "title": "Updated title",
  "status": "done"
}
```

**Delete Activity:**
```http
DELETE /api/activities/{id}
```

This voice recording endpoint significantly enhances the LifeBuffer API by enabling natural, speech-based activity creation with intelligent AI processing.