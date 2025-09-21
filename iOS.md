# LifeBuffer iOS App Specification

## Overview

LifeBuffer iOS is a native iPhone app for comprehensive life tracking, featuring offline-first architecture with seamless API synchronization. Built with SwiftUI and the latest Swift features, optimized for portrait iPhone displays.

**Target**: iOS 17.0+ (to leverage latest SwiftUI features)
**Language**: Swift 5.9+ with Swift Concurrency
**UI Framework**: SwiftUI
**Architecture**: MVVM with Repository Pattern

## Core Features

### 1. Authentication System

#### OAuth 2.0 with PKCE Implementation
```swift
// Required OAuth configuration
struct OAuthConfig {
    let baseURL: String // User configurable, default: "https://app.lifebuffer.com"
    let clientId: String // From Laravel Passport
    let redirectURI: "lifebuffer://auth/callback"
    let scopes: ["*"]
    let authorizationEndpoint: "/oauth/authorize"
    let tokenEndpoint: "/oauth/token"
}
```

**Implementation Requirements:**
- Use ASWebAuthenticationSession for OAuth flow
- Generate code verifier (128 chars) and challenge (SHA256 base64url)
- Store tokens in iOS Keychain
- Implement token refresh with automatic retry
- Handle biometric authentication for app access (Face ID/Touch ID)
- **Server Selection**: Allow users to configure custom LifeBuffer server URL

**Security:**
- All tokens stored in Keychain with kSecAttrAccessibleWhenUnlockedThisDeviceOnly
- Implement certificate pinning for API requests
- Clear session on app backgrounding after 5 minutes

### 2. Data Models & Core Data Schema

#### Core Data Entities

**User Entity:**
```swift
@NSManaged public var id: UUID
@NSManaged public var name: String
@NSManaged public var email: String
@NSManaged public var createdAt: Date
@NSManaged public var updatedAt: Date
@NSManaged public var activities: NSSet
@NSManaged public var contexts: NSSet
@NSManaged public var days: NSSet
```

**Activity Entity:**
```swift
@NSManaged public var id: UUID
@NSManaged public var serverId: String? // API ID for sync
@NSManaged public var title: String
@NSManaged public var notes: String?
@NSManaged public var status: String // "new", "in_progress", "done"
@NSManaged public var time: Int32 // minutes
@NSManaged public var date: Date
@NSManaged public var createdAt: Date
@NSManaged public var updatedAt: Date
@NSManaged public var deletedAt: Date?
@NSManaged public var syncStatus: Int16 // 0: synced, 1: pending, 2: conflict
@NSManaged public var context: Context?
@NSManaged public var day: Day
@NSManaged public var user: User
```

**Context Entity:**
```swift
@NSManaged public var id: UUID
@NSManaged public var serverId: Int32?
@NSManaged public var name: String
@NSManaged public var icon: String // Emoji
@NSManaged public var color: String // Hex color
@NSManaged public var sortOrder: Int32
@NSManaged public var createdAt: Date
@NSManaged public var updatedAt: Date
@NSManaged public var deletedAt: Date?
@NSManaged public var syncStatus: Int16
@NSManaged public var activities: NSSet
@NSManaged public var user: User
```

**Day Entity:**
```swift
@NSManaged public var id: UUID
@NSManaged public var date: Date // Unique per user
@NSManaged public var notes: String? // Markdown
@NSManaged public var mood: Int16? // 1-5 scale
@NSManaged public var createdAt: Date
@NSManaged public var updatedAt: Date
@NSManaged public var syncStatus: Int16
@NSManaged public var activities: NSSet
@NSManaged public var user: User
```

**VoiceRecording Entity (temporary storage):**
```swift
@NSManaged public var id: UUID
@NSManaged public var audioData: Data
@NSManaged public var duration: Double
@NSManaged public var createdAt: Date
@NSManaged public var processedTitle: String?
@NSManaged public var processedNotes: String?
@NSManaged public var processingStatus: Int16 // 0: pending, 1: processing, 2: completed, 3: failed
```

### 3. UI/UX Requirements

#### Screen Layouts (Portrait iPhone)

**1. Today View (Main Screen)**
```
┌─────────────────────────────┐
│     [Date Navigation]       │
│   ← October 20, 2025 →      │
├─────────────────────────────┤
│  Quick Stats                │
│  ○ 3 done  ○ 2 in progress │
├─────────────────────────────┤
│  [+ Voice] [+ Manual] [▶️]   │
├─────────────────────────────┤
│  Activities List            │
│  ┌───────────────────────┐  │
│  │ [▶️] [✓] Morning workout │  │
│  │     🏃 Context • 30m   │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ [▶️] [→] Project plan  │  │
│  │     💼 Work • 45m      │  │
│  └───────────────────────┘  │
├─────────────────────────────┤
│  Day Notes                  │
│  [Tap to add notes...]      │
└─────────────────────────────┘
   [Today] [Contexts] [Profile]
```

**2. Activity Detail View (Modal)**
```
┌─────────────────────────────┐
│  [Cancel]  Activity  [Save] │
├─────────────────────────────┤
│  Title                      │
│  [_____________________]    │
│                             │
│  Status                     │
│  [New ▼] [In Progress] [✓] │
│                             │
│  Context                    │
│  [Select Context ▼]         │
│                             │
│  Time Spent                 │
│  [0h] [30m] [▶️ Timer]       │
│                             │
│  Notes                      │
│  [_____________________]    │
│  [_____________________]    │
│                             │
│  [Delete Activity]          │
└─────────────────────────────┘
```

**3. Voice Recording View (Modal)**
```
┌─────────────────────────────┐
│        [Cancel]             │
├─────────────────────────────┤
│                             │
│     🎙️ Recording...         │
│                             │
│    ░░░░▓▓▓▓████▓▓░░░       │
│    (Audio Waveform)         │
│                             │
│      00:15 / 01:00          │
│                             │
│    [Tap to Stop]            │
│                             │
└─────────────────────────────┘
```

**4. Timer View (Modal)**
```
┌─────────────────────────────┐
│     [Cancel]  Timer         │
├─────────────────────────────┤
│  Project Planning Meeting   │
│                             │
│       ⏱️ 15:23              │
│                             │
│  Previously: 45m            │
│                             │
│  [⏸️ Pause] [✅ Complete]    │
│                             │
│  Space: Play/Pause          │
│  Enter: Complete            │
└─────────────────────────────┘
```

**5. Contexts View**
```
┌─────────────────────────────┐
│  [Back]  Contexts  [Add]    │
├─────────────────────────────┤
│  All Activities             │
├─────────────────────────────┤
│  💼 Work (12)               │
│  🏃 Fitness (8)             │
│  📚 Learning (5)            │
│  🏠 Personal (15)           │
│  [+ Add Context]            │
└─────────────────────────────┘
```

**6. Profile & Settings**
```
┌─────────────────────────────┐
│  [Back]    Profile          │
├─────────────────────────────┤
│  John Doe                   │
│  john@example.com           │
├─────────────────────────────┤
│  Settings                   │
│  ├─ Server Settings        │
│  ├─ Notifications          │
│  ├─ Export Data            │
│  ├─ Sync Status            │
│  ├─ Face ID                │
│  └─ About                  │
├─────────────────────────────┤
│  [Sign Out]                 │
└─────────────────────────────┘
```

**7. Server Settings View**
```
┌─────────────────────────────┐
│  [Back]  Server Settings    │
├─────────────────────────────┤
│  Server URL                 │
│  [https://app.lifebuffer.com]│
│                             │
│  ⚠️ Changing server will    │
│  sign you out and clear     │
│  local data                 │
│                             │
│  [Test Connection]          │
│  [Save & Restart]           │
└─────────────────────────────┘
```

#### Design Guidelines

**Colors:**
- Primary: System Blue
- Success: System Green
- Warning: System Orange
- Error: System Red
- Background: SystemBackground
- Secondary: SystemGray variants

**Typography:**
- Title: SF Pro Display Bold 28pt
- Heading: SF Pro Display Semibold 20pt
- Body: SF Pro Text Regular 17pt
- Caption: SF Pro Text Regular 13pt

**Components:**
- Use native iOS components (List, Form, Sheet, Alert)
- Haptic feedback for all interactions
- Swipe actions for activities (edit, delete, change status)
- Pull-to-refresh for sync
- Long press for context menus

### 4. Voice Recording Implementation

#### Audio Recording Setup
```swift
import AVFoundation

class VoiceRecorder: NSObject, ObservableObject {
    private var audioRecorder: AVAudioRecorder?
    private var audioSession: AVAudioSession

    // Configuration
    let maxDuration: TimeInterval = 60.0
    let audioFormat: [AVFormatIDKey: Any] = [
        AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
        AVSampleRateKey: 44100,
        AVNumberOfChannelsKey: 1,
        AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]
}
```

**Features:**
- Real-time audio level monitoring for waveform visualization
- Automatic stop at 60 seconds
- Background audio session handling
- Compression to reduce file size before upload
- Local caching of recordings until processed

#### Voice Processing Pipeline
1. Record audio locally (max 60s)
2. Compress to M4A format
3. Upload to API endpoint `/api/activities/voice`
4. Receive processed title and notes
5. Pre-fill activity creation form
6. Delete local audio after successful processing

**Error Handling:**
- Microphone permission denied → Show settings prompt
- Recording failed → Fallback to manual entry
- Processing failed → Save locally, retry later
- Network unavailable → Queue for later processing

### 5. Offline Sync Architecture

#### Sync Strategy

**Conflict Resolution Rules:**
1. Last-write-wins for simple properties
2. Server priority for deletions
3. Merge strategy for notes (append local to server)
4. User prompt for title conflicts

**Sync Flow:**
```swift
protocol SyncEngine {
    func performFullSync() async throws
    func syncEntity<T: SyncableEntity>(_ entity: T) async throws
    func resolveConflict<T: SyncableEntity>(_ local: T, _ remote: T) async -> T
    func queueForSync<T: SyncableEntity>(_ entity: T)
}
```

**Sync Triggers:**
- App launch
- App foreground
- Pull-to-refresh
- After local changes (debounced 2s)
- Network reconnection
- Every 5 minutes when active

**Offline Capabilities:**
- Full CRUD operations cached locally
- Queue management for pending changes
- Automatic retry with exponential backoff
- Batch sync to minimize API calls
- Incremental sync using timestamps

#### Data Flow
```
Local Change → Core Data → Sync Queue → API
                   ↑            ↓
              Conflict ← Sync Engine
                   ↓            ↑
            Resolution → Update Local
```

### 6. API Integration Layer

#### Network Manager
```swift
class APIClient {
    static let shared = APIClient()
    private var baseURL: URL
    private let session: URLSession

    init() {
        // Load server URL from UserDefaults, default to production
        let serverURL = UserDefaults.standard.string(forKey: "serverURL") ?? "https://app.lifebuffer.com"
        self.baseURL = URL(string: serverURL)!
        self.session = URLSession.shared
    }

    func updateServerURL(_ urlString: String) throws {
        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }
        self.baseURL = url
        UserDefaults.standard.set(urlString, forKey: "serverURL")
    }

    // Endpoints
    func fetchToday(date: Date) async throws -> TodayResponse
    func fetchRecentDays(from: Date) async throws -> RecentDaysResponse
    func createActivity(_ activity: ActivityRequest) async throws -> Activity
    func updateActivity(id: String, _ activity: ActivityRequest) async throws -> Activity
    func deleteActivity(id: String) async throws
    func processVoice(audioData: Data) async throws -> VoiceResponse
    func fetchContexts() async throws -> [Context]
    func updateDayNotes(date: Date, notes: String) async throws -> Day
    func testConnection() async throws -> Bool
}
```

**Request/Response Models:**
- Use Codable for all API models
- Snake_case to camelCase conversion
- ISO8601 date formatting
- Automatic token refresh on 401

**Error Handling:**
```swift
enum APIError: LocalizedError {
    case unauthorized
    case networkUnavailable
    case serverError(Int)
    case decodingError
    case validationError([String: String])
    case invalidURL
    case connectionFailed
}
```

### 7. Features Implementation Details

#### Activity Management
- **Create**: Voice or manual with title, notes, context, time
- **Update**: Inline editing with auto-save after 2s debounce
- **Delete**: Swipe to delete with undo option (5s)
- **Status**: Tap to cycle through new → in_progress → done
- **Timer**: Tap play button to start timer, auto-sets status to in_progress
- **Time Tracking**: Additive time logging, rounds up to minutes
- **Batch Operations**: Select multiple for bulk status change

#### Context Management
- **Emoji Picker**: Native iOS emoji keyboard
- **Color Coding**: 12 predefined colors
- **Sorting**: Manual drag-to-reorder
- **Filtering**: Tap context to filter activities
- **Usage Stats**: Show activity count per context

#### Day Notes
- **Markdown Support**: Bold, italic, lists, links
- **Preview/Edit Toggle**: Tap to edit, save to preview
- **Auto-save**: After 3s of inactivity
- **Templates**: Quick insert common patterns
- **Export**: Share as PDF or Markdown

#### Keyboard Shortcuts (iPad with keyboard)
- `Cmd+N`: New activity
- `Cmd+V`: Start voice recording (changed from Cmd+R)
- `Cmd+T`: Start timer for selected activity
- `Cmd+F`: Search activities
- `Cmd+,`: Settings
- `Arrow keys`: Navigate days
- `Space`: Toggle activity status (or play/pause timer in modal)

#### Notifications
- **Daily Reminder**: "Don't forget to log your activities!"
- **Weekly Summary**: "You completed X activities this week"
- **Streak Tracking**: "You're on a 7-day streak!"
- **Context Suggestions**: Based on time of day

### 8. Advanced Features

#### Widget Support
- **Today Widget**: Show today's activities count
- **Quick Actions**: Add activity directly from widget
- **Lock Screen Widget**: Current activity status

#### Shortcuts Integration
- "Log activity" voice command
- "Start voice recording" shortcut
- "Start timer" for specific activity
- "Show today's activities" query
- "Mark as done" automation
- "How much time spent on X" query

#### Watch App (Future)
- Quick activity logging
- Voice recording
- Timer controls (start/pause/complete)
- Today view
- Complications with timer status

### 9. Technical Implementation

#### Project Structure
```
LifeBuffer/
├── App/
│   ├── LifeBufferApp.swift
│   └── AppDelegate.swift
├── Core/
│   ├── Authentication/
│   ├── Networking/
│   ├── Database/
│   └── Sync/
├── Features/
│   ├── Today/
│   ├── Activities/
│   ├── Timer/
│   ├── Contexts/
│   ├── Voice/
│   ├── Settings/
│   └── Profile/
├── Shared/
│   ├── Models/
│   ├── Views/
│   ├── ViewModels/
│   └── Utilities/
└── Resources/
    ├── Assets.xcassets
    └── Localizable.strings
```

#### Dependencies (Swift Package Manager)
```swift
// Package.swift dependencies
.package(url: "https://github.com/kishikawakatsumi/KeychainAccess.git", from: "4.2.0")
.package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0") // Optional
```

#### Key iOS APIs Used
- **Core Data**: Offline storage
- **CloudKit**: Optional backup (future)
- **AVFoundation**: Audio recording
- **Combine**: Reactive programming
- **SwiftUI**: UI framework
- **WidgetKit**: Home screen widgets
- **UserNotifications**: Local notifications
- **BackgroundTasks**: Background sync

### 10. Testing Strategy

#### Unit Tests
- Core Data operations (100% coverage)
- Sync engine logic
- Date/time calculations
- API response parsing
- Conflict resolution

#### UI Tests
- Authentication flow
- Activity CRUD operations
- Voice recording flow
- Timer functionality (start/pause/complete)
- Context filtering
- Day navigation
- Server configuration and connection testing

#### Integration Tests
- API communication
- Offline/online transitions
- Sync scenarios
- Token refresh

### 11. Performance Optimization

- **Image Caching**: For context icons
- **Lazy Loading**: Activities load in batches of 50
- **Background Sync**: Use BGProcessingTask
- **Memory Management**: Proper cleanup of audio buffers
- **Database Indexing**: On date, user_id, sync_status

### 12. Security & Privacy

- **Encryption**: Core Data SQLite encryption
- **Keychain**: Secure token storage
- **Biometric Auth**: Face ID/Touch ID
- **Privacy Policy**: In-app display required
- **Data Export**: User can export all data
- **Account Deletion**: Full data removal option

### 13. Deployment

#### App Store Requirements
- **Screenshots**: 6.7", 6.1", 5.5" displays
- **App Icon**: 1024x1024
- **Description**: Focus on productivity and privacy
- **Keywords**: life tracking, productivity, voice notes
- **Age Rating**: 4+
- **Categories**: Productivity, Lifestyle

#### Version Strategy
- **1.0**: Core features (activities, contexts, sync)
- **1.1**: Voice recording
- **1.2**: Widgets and Shortcuts
- **1.3**: iPad optimization
- **2.0**: Watch app

### 14. Analytics & Monitoring

#### Key Metrics
- Daily active users
- Activities created per user
- Voice vs manual creation ratio
- Sync success rate
- Crash-free sessions

#### Error Tracking
- Implement Crashlytics or similar
- Custom error logging for sync failures
- Performance monitoring for API calls

### 15. Accessibility

- **VoiceOver**: Full support with labels
- **Dynamic Type**: Respect system font size
- **Reduce Motion**: Alternative animations
- **Color Blind**: Don't rely on color alone
- **Voice Control**: Support voice commands

## Implementation Notes

### Critical First Steps
1. Set up Core Data models and migrations
2. Implement server configuration and storage
3. Implement OAuth authentication flow
4. Build offline-first sync engine
5. Create main UI screens
6. Add voice recording capability
7. Add timer functionality
8. Test sync conflict scenarios

### API Endpoints Reference
```
POST   /oauth/token          - Token exchange
GET    /api/profile          - User profile
GET    /api/today/{date}     - Day data
GET    /api/recent           - Recent days
POST   /api/activities       - Create activity
PUT    /api/activities/{id}  - Update activity
DELETE /api/activities/{id}  - Delete activity
POST   /api/activities/voice - Process voice
GET    /api/contexts         - List contexts
POST   /api/contexts         - Create context
PUT    /api/contexts/{id}    - Update context
DELETE /api/contexts/{id}    - Delete context
PUT    /api/days/{date}      - Update day notes
POST   /api/export           - Export data
```

### Voice Processing Format
```swift
// Request
let formData = MultipartFormData()
formData.append(audioData, withName: "audio", fileName: "recording.m4a", mimeType: "audio/m4a")
formData.append(Data("\(Date())".utf8), withName: "date")

// Response
struct VoiceResponse: Codable {
    let title: String
    let notes: String?
    let context: String?
    let suggestedTime: Int?
}
```

## Development Timeline Estimate

- **Week 1-2**: Project setup, Core Data, Authentication
- **Week 3-4**: Main UI screens, Navigation
- **Week 5-6**: Sync engine, Conflict resolution
- **Week 7**: Voice recording and processing
- **Week 8**: Testing, Polish, Bug fixes
- **Week 9**: Beta testing, Performance optimization
- **Week 10**: App Store submission preparation

## Success Criteria

1. **Reliability**: 99.9% crash-free sessions
2. **Performance**: App launch < 1 second
3. **Sync**: Changes appear within 5 seconds
4. **Offline**: Full functionality without network
5. **Battery**: < 5% daily battery usage
6. **Storage**: < 50MB app size, < 100MB data

## Conclusion

This specification provides a complete blueprint for building LifeBuffer iOS. The app prioritizes offline-first architecture, seamless sync, and iOS-native user experience. Focus on core features first, then enhance with voice and advanced capabilities.

Remember: Build with Swift Concurrency (async/await), use SwiftUI for all UI, follow iOS Human Interface Guidelines, and test thoroughly on all iPhone sizes.