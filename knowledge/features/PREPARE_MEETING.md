# Prepare Meeting Feature Specification

## Overview

The "Prepare meeting" feature helps users generate structured meeting notes for 1:1 meetings with their manager by analyzing activities from a selected date range and contexts. The system uses OpenAI to intelligently group and summarize tasks into a professional meeting agenda format.

## User Journey

1. User clicks "Prepare meeting" button from the main interface
2. User selects date range (start and end dates)
3. User selects which contexts to include
4. User submits the form
5. System gathers all activities from the selected date range and contexts
6. System sends data to OpenAI with a specialized prompt
7. User receives formatted meeting notes organized by themes/blocks
8. User can copy, edit, or export the generated notes

## Web Application Implementation

### UI Components

#### Entry Point
- **Location**: Main navigation or activities page header
- **Button**: Primary action button labeled "Prepare meeting" with icon (e.g., `Users` or `Presentation` from lucide-react)
- **Keyboard shortcut**: `Alt+M` or `Cmd+M` for quick access

#### Meeting Preparation Form Page
- **Route**: `/prepare-meeting`
- **Layout**: Similar to `/export` page structure
- **Components**:
  ```
  Card with:
  - Header: "Prepare Meeting Notes"
  - Description: "Generate structured notes for your 1:1 meeting"

  Form sections:
  1. Date Range Selection
     - Start date picker (default: 1 week ago)
     - End date picker (default: today)
     - Quick presets: "Last week", "Last 2 weeks", "Last month", "Custom"

  2. Context Selection
     - Checkbox list of all user contexts
     - "Select All" / "Deselect All" toggle
     - Visual indicators showing context icons and names

  3. Meeting Type (optional enhancement)
     - Radio buttons: "1:1 with manager", "Team update", "Project review"
     - Default: "1:1 with manager"

  4. Additional Options
     - Include time spent: checkbox (default: true)
     - Include notes: checkbox (default: true)
     - Group by context: checkbox (default: false)

  5. Submit Button
     - "Generate Meeting Notes" with loading state
     - Disabled until required fields are selected
  ```

#### Results Display
- **Component**: Modal or new page section
- **Features**:
  - Formatted markdown preview
  - Copy to clipboard button
  - Download as markdown file
  - Edit in place capability
  - "Regenerate" button for different variations
  - "Save as template" for future use

### Frontend Implementation Details

#### New Files to Create:
```
webapp/src/routes/prepare-meeting.tsx
webapp/src/components/meeting-notes-display.tsx
webapp/src/utils/meeting.ts
```

#### State Management:
- Add to `userStore.ts`:
  - `generateMeetingNotes` action
  - `meetingNotes` state field
  - Loading and error states

#### API Integration:
```typescript
// webapp/src/utils/api.ts
meeting: {
  prepare: async (data: MeetingPrepareRequest) => {
    const response = await fetch(`${API_BASE_URL}/api/meetings/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}
```

## API Implementation

### Endpoint Specification

#### POST `/api/meetings/prepare`
**Request Body:**
```json
{
  "start_date": "2024-01-15",
  "end_date": "2024-01-22",
  "context_ids": [1, 2, 3],
  "meeting_type": "manager_1on1",
  "include_time": true,
  "include_notes": true,
  "group_by_context": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "meeting_123",
    "generated_at": "2024-01-22T10:30:00Z",
    "date_range": {
      "start": "2024-01-15",
      "end": "2024-01-22"
    },
    "total_activities": 45,
    "total_time_minutes": 2400,
    "notes": {
      "markdown": "# Meeting Notes - January 22, 2024\n\n## Completed Tasks\n...",
      "sections": [
        {
          "title": "Completed Tasks",
          "items": ["Task 1", "Task 2"],
          "context": "Development"
        }
      ]
    },
    "metadata": {
      "contexts_included": ["Development", "Meetings", "Learning"],
      "activities_processed": 45,
      "ai_model": "gpt-4o-mini",
      "processing_time_ms": 2500
    }
  }
}
```

### Backend Implementation Details

#### New Files:
```
api/app/Http/Controllers/Api/MeetingController.php
api/app/Services/MeetingPreparationService.php
api/app/Services/OpenAIService.php (enhance existing or create)
api/app/Http/Requests/PrepareMeetingRequest.php
api/tests/Feature/MeetingPreparationTest.php
```

#### Controller Implementation:
```php
// MeetingController.php
public function prepare(PrepareMeetingRequest $request)
{
    $activities = Activity::where('user_id', auth()->id())
        ->whereBetween('date', [$request->start_date, $request->end_date])
        ->whereIn('context_id', $request->context_ids)
        ->with(['context'])
        ->get();

    $meetingNotes = app(MeetingPreparationService::class)
        ->prepare($activities, $request->all());

    return response()->json([
        'success' => true,
        'data' => $meetingNotes
    ]);
}
```

### OpenAI Integration

#### Prompt Template:
```
You are an expert assistant helping prepare notes for a 1:1 meeting with a manager.

Given the following activities from [date_range], create structured meeting notes that:
1. Group related activities into logical themes/projects
2. Highlight key accomplishments and progress
3. Identify blockers or challenges faced
4. Suggest discussion points for the meeting
5. Format as clear, concise bullet points

Activities data:
[activities_json]

Additional context:
- Total time spent: [total_time]
- Contexts included: [contexts]
- Meeting type: [meeting_type]

Generate professional meeting notes in the following structure:
1. Key Accomplishments (grouped by theme)
2. Work in Progress
3. Blockers/Challenges
4. Topics for Discussion
5. Next Steps/Plans

Keep the tone professional but conversational. Focus on impact and outcomes rather than just task lists.
```

#### Service Implementation:
```php
// MeetingPreparationService.php
class MeetingPreparationService
{
    public function prepare(Collection $activities, array $options): array
    {
        $prompt = $this->buildPrompt($activities, $options);
        $response = $this->openAI->chat($prompt);

        return [
            'notes' => $this->parseResponse($response),
            'metadata' => $this->buildMetadata($activities)
        ];
    }
}
```

## iOS App Implementation

### User Interface

#### Entry Points:
1. Tab bar item or navigation button
2. 3D Touch/Haptic Touch quick action
3. Widget action (iOS 14+)

#### Screens:

##### Meeting Preparation Screen
```swift
struct MeetingPreparationView: View {
    @State private var startDate = Date().addingDays(-7)
    @State private var endDate = Date()
    @State private var selectedContexts: Set<Context> = []
    @State private var isGenerating = false

    var body: some View {
        NavigationView {
            Form {
                Section("Date Range") {
                    DatePicker("Start Date", selection: $startDate)
                    DatePicker("End Date", selection: $endDate)
                    // Quick selection buttons
                }

                Section("Contexts") {
                    ForEach(contexts) { context in
                        MultipleSelectionRow(
                            context: context,
                            isSelected: selectedContexts.contains(context)
                        )
                    }
                }

                Section {
                    Button("Generate Meeting Notes") {
                        generateNotes()
                    }
                    .disabled(!isValid)
                }
            }
            .navigationTitle("Prepare Meeting")
        }
    }
}
```

##### Results Display Screen
```swift
struct MeetingNotesView: View {
    let notes: MeetingNotes

    var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                // Formatted notes display
                // Share button
                // Copy button
                // Save to Files option
            }
        }
    }
}
```

### iOS-Specific Features

1. **Share Sheet Integration**: Export to Notes, Mail, Slack, etc.
2. **Shortcuts App Integration**: Create automated meeting prep workflows
3. **Calendar Integration**: Suggest date ranges based on upcoming meetings
4. **Notification**: Optional reminder to prepare before recurring meetings
5. **Offline Support**: Cache generated notes for offline access

### API Integration
```swift
class MeetingService {
    func prepareMeetingNotes(
        startDate: Date,
        endDate: Date,
        contexts: [Context]
    ) async throws -> MeetingNotes {
        let request = PrepareMeetingRequest(
            startDate: startDate,
            endDate: endDate,
            contextIds: contexts.map(\.id)
        )

        return try await apiClient.post("/api/meetings/prepare", body: request)
    }
}
```

## CLI App Implementation

### Command Structure

```bash
# Basic usage
lifebuffer meeting prepare --start 2024-01-15 --end 2024-01-22

# With options
lifebuffer meeting prepare \
  --start 2024-01-15 \
  --end 2024-01-22 \
  --contexts "Development,Meetings" \
  --output meeting-notes.md \
  --format markdown

# Interactive mode
lifebuffer meeting prepare -i

# Quick presets
lifebuffer meeting prepare --last-week
lifebuffer meeting prepare --last-month
```

### CLI Options

```
Options:
  -s, --start DATE          Start date (YYYY-MM-DD)
  -e, --end DATE            End date (YYYY-MM-DD)
  -c, --contexts LIST       Comma-separated context names or IDs
  -t, --type TYPE           Meeting type (1on1, team, project)
  -o, --output FILE         Save notes to file
  -f, --format FORMAT       Output format (markdown, text, html)
  --include-time            Include time spent (default: true)
  --include-notes           Include activity notes (default: true)
  --group-by-context        Group by context (default: false)
  -i, --interactive         Interactive mode with prompts
  --last-week               Use last 7 days
  --last-month              Use last 30 days
  --copy                    Copy to clipboard
  --open                    Open in default editor
```

### Output Examples

```markdown
# Terminal Output (simplified)
$ lifebuffer meeting prepare --last-week

Generating meeting notes...
Date range: 2024-01-15 to 2024-01-22
Contexts: All (5 contexts)
Activities found: 45
Total time: 40 hours

PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
MEETING NOTES - January 22, 2024
PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP

## KEY ACCOMPLISHMENTS

### Development (24 hours)
" Completed API refactoring for v2.0
" Implemented OAuth authentication
" Fixed 5 critical bugs in production

### Client Work (8 hours)
" Delivered Phase 1 of Project X
" Conducted 3 client meetings

## IN PROGRESS
" Database optimization (60% complete)
" Documentation updates

## BLOCKERS
" Waiting for design approval on new features
" Need access to staging environment

## DISCUSSION TOPICS
" Resource allocation for Q2
" Technical debt prioritization
" Team expansion plans

Notes saved to: meeting-notes-2024-01-22.md
Copied to clipboard 
```

### CLI Implementation Details

```python
# cli/commands/meeting.py
class MeetingCommand:
    def prepare(self, args):
        # Validate inputs
        if args.interactive:
            args = self.interactive_prompt()

        # Fetch activities
        activities = self.api.get_activities(
            start=args.start,
            end=args.end,
            contexts=args.contexts
        )

        # Generate notes
        notes = self.api.prepare_meeting(activities)

        # Output handling
        if args.output:
            self.save_to_file(notes, args.output)

        if args.copy:
            self.copy_to_clipboard(notes)

        if args.open:
            self.open_in_editor(notes)

        # Display in terminal
        self.display_formatted(notes, args.format)
```

## Database Considerations

### Optional: Meeting History Table
```sql
CREATE TABLE meeting_preparations (
    id BIGINT PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    generated_at TIMESTAMP,
    date_range_start DATE,
    date_range_end DATE,
    context_ids JSON,
    notes_markdown TEXT,
    notes_json JSON,
    metadata JSON,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

Benefits:
- Track meeting prep history
- Analyze patterns over time
- Reuse/reference previous meetings
- Template creation from past meetings

## Security & Privacy

1. **Data Processing**: Activities never leave the server; only processed notes are returned
2. **OpenAI Integration**:
   - No PII in prompts
   - Use user IDs, not names
   - Implement prompt sanitization
3. **Rate Limiting**: Limit API calls per user (e.g., 10 preparations per day)
4. **Audit Logging**: Track all meeting preparation requests
5. **Data Retention**: Optional auto-deletion of preparation history after X days

## Performance Optimization

1. **Caching Strategy**:
   - Cache frequently used date ranges
   - Store recent preparations for quick access
   - Implement Redis caching for API responses

2. **Batch Processing**:
   - Process large activity sets in chunks
   - Implement progress indicators for long operations

3. **OpenAI Optimization**:
   - Use GPT-4o-mini for cost efficiency
   - Implement token limits (max 2000 tokens per request)
   - Consider response streaming for large outputs

## Future Enhancements

1. **Meeting Templates**: Save and reuse meeting formats
2. **Calendar Integration**: Auto-detect upcoming meetings
3. **Team Rollups**: Aggregate team member updates for managers
4. **Feedback Loop**: Rate and improve generated notes
5. **Multi-language Support**: Generate notes in different languages
6. **Export Formats**: PDF, DOCX, Confluence, Notion
7. **AI Customization**: Train on company-specific terminology
8. **Recurring Meetings**: Auto-generate for weekly/monthly 1:1s
9. **Insights Dashboard**: Trends and patterns from meeting history
10. **Integration with Meeting Tools**: Direct export to Zoom, Teams, Google Meet notes

## Success Metrics

1. **Usage Metrics**:
   - Number of meetings prepared per user
   - Frequency of use (weekly/monthly)
   - Feature adoption rate

2. **Quality Metrics**:
   - User satisfaction ratings
   - Time saved per meeting
   - Regeneration rate (indicates initial quality)

3. **Business Impact**:
   - Meeting effectiveness scores
   - Manager feedback ratings
   - User retention correlation

## Testing Requirements

### Unit Tests
- Date range validation
- Context filtering logic
- OpenAI prompt generation
- Response parsing

### Integration Tests
- Full flow from request to response
- Error handling for OpenAI failures
- Rate limiting behavior
- Authentication and authorization

### E2E Tests
- Web app: Complete user journey
- iOS app: UI automation tests
- CLI: Command execution tests

### Load Tests
- Concurrent meeting preparations
- Large activity dataset processing
- OpenAI API rate limit handling

## Rollout Strategy

1. **Phase 1**: Beta release to power users
2. **Phase 2**: Web app implementation
3. **Phase 3**: iOS app integration
4. **Phase 4**: CLI tool support
5. **Phase 5**: Advanced features (templates, insights)

## Documentation Requirements

1. User guide with examples
2. API documentation
3. Video tutorial
4. FAQ section
5. Best practices guide for effective meetings