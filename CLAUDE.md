# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LifeBuffer is a cross-platform life tracking app with:

- **Backend API**: Laravel 12 (PHP 8.2+) - Located in `/api`
- **Frontend Web App**: TanStack Start with React 19 - Located in `/webapp`
- **Landing Page**: React 19 with Vite and Tailwind CSS v4 - Located in `/landing`
- **Key Features**: Activity logging, voice input, AI categorization, flexible reporting
- **Deployment**: Upsun cloud platform with multi-app orchestration

## Essential Commands

Never change any code when the user asks to commit!

### API (Laravel) Development

```bash
# In /api directory
cd api

# Install dependencies
composer install
npm install

# Set up environment
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed  # If seeders exist

# Development server (runs multiple services concurrently)
composer dev
# This runs: server, queue worker, logs (pail), and vite

# Run tests
composer test
# Or directly: php artisan test
# Run specific test files: php artisan test --filter=ActivityTest
# Run with testing environment: php artisan test --env=testing

# Code formatting
php artisan pint

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Web App (TanStack Start) Development

```bash
# In /webapp directory
cd webapp

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env to add your OAuth client ID

# Development server
pnpm dev

# Build for production
pnpm build

# Type checking
tsc --noEmit

# Start production server
pnpm start
```

### Landing Page Development

```bash
# In /landing directory
cd landing

# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking and linting
tsc --noEmit
pnpm lint
```

## Architecture Overview

### API Architecture (Laravel)

- **MVC Pattern**: Controllers in `app/Http/Controllers`, Models in `app/Models`
- **API Routes**: Define in `routes/api.php` (create if not exists)
- **Database**: PostgreSQL (production), SQLite (development)
- **Queue System**: Background job processing configured
- **Real-time Logs**: Laravel Pail for development logging

### Web App Architecture (TanStack Start)

- **Routing**: File-based routing in `src/routes/`
- **Components**: Organized in `src/components/`
- **State Management**: Use TanStack Query for server state
- **Styling**: Tailwind CSS v3 (note: not v4 as specified in rules)
- **Type Safety**: Strict TypeScript configuration enabled
- **Environment Variables**: Configured via `.env` file with `VITE_` prefix

### Landing Page Architecture (React + Vite)

- **Routing**: TanStack Router for type-safe routing
- **Components**: Shadcn/ui component library in `src/components/`
- **Styling**: Tailwind CSS v4 with utility-first approach
- **Type Safety**: Strict TypeScript configuration enabled
- **Build Tool**: Vite for fast development and optimized production builds

## Development Guidelines

### API Development Rules

Follow rules in `/rules/laravel.md`

1. **Controllers**: Keep thin, delegate business logic to services
2. **Models**: Use Eloquent relationships and accessors/mutators
3. **Validation**: Use Form Requests for complex validation
4. **API Responses**: Return consistent JSON structure
5. **Testing**: Write feature and unit tests using Pest

### Frontend Development Rules

1. **Components**: Follow rules in `/rules/react.md`
2. **TypeScript**: Strict mode enabled, avoid `any`
3. **Styling**: Use Tailwind classes with proper organization
4. **Routing**: Leverage TanStack Router's type-safe routing
5. **State**: Prefer server state (TanStack Query) over client state

## Key Implementation Areas

### Authentication (OAuth 2.0 with PKCE) ✅ Implemented

- **Backend**: Laravel Passport for OAuth server
- **Frontend**: Custom PKCE implementation with SHA-256 fallback for non-HTTPS environments
- **Key Files**:
  - Frontend: `webapp/src/utils/auth.tsx`, `webapp/src/routes/auth.callback.tsx`
  - Backend: OAuth routes handled by Laravel Passport
- **Setup**: Run `sail artisan passport:client --public` to create OAuth clients

### Activity Management ✅ Implemented

- **Models**: `Activity`, `Context`, `Day` with proper relationships
- **API Endpoints**: Full CRUD operations with Laravel policies for authorization
  - `POST /api/activities` - Create new activities with validation
  - `PUT /api/activities/{id}` - Update existing activities
  - `DELETE /api/activities/{id}` - Soft delete activities
- **Frontend Components**:
  - `ActivityModal`: Complete activity editing/creation with auto-save functionality
  - Activity list with context filtering and status management
  - "New activity" button in Activities card header
  - Real-time cache updates using TanStack Store
- **Keyboard Shortcuts**: Press 'c' to create new activity
- **Key Files**:
  - Backend: `api/app/Http/Controllers/Api/ActivityController.php`
  - Frontend: `webapp/src/components/activity-modal.tsx`
  - Store: `webapp/src/stores/userStore.ts`
  - Shortcuts: `webapp/src/hooks/useKeyboardShortcuts.ts`

### Context Management ✅ Implemented

- **Features**: Create, update, delete contexts with emoji icons
- **Filtering**: Sidebar context filter with visual selection indicators
- **Validation**: Prevent duplicate context names per user
- **Components**:
  - `AddContextModal`: Context creation with emoji picker
  - `Contexts`: Sidebar component with filtering functionality
- **Key Files**:
  - Backend: `api/app/Http/Controllers/Api/ContextController.php`
  - Frontend: `webapp/src/components/add-context-modal.tsx`, `webapp/src/components/contexts.tsx`

### Day Notes Management ✅ Implemented

- **Features**: Markdown-enabled notes with live preview and editing
- **Components**: `EditableMarkdown` with view/edit toggle
- **Functionality**:
  - Click to edit, save/cancel options
  - Keyboard shortcuts (Ctrl+Enter to save, Esc to cancel)
  - Copy to clipboard functionality
  - Real-time preview using react-markdown
- **Key Files**:
  - Backend: `api/app/Http/Controllers/Api/DayController.php`
  - Frontend: `webapp/src/components/editable-markdown.tsx`

### Security & Authorization ✅ Implemented

- **Laravel Policies**: Complete authorization system for Day, Activity, and Context models
- **Features**: User-scoped data access, proper 403 responses
- **Key Files**:
  - `api/app/Policies/DayPolicy.php`
  - `api/app/Policies/ActivityPolicy.php`
  - `api/app/Policies/ContextPolicy.php`

### State Management ✅ Implemented

- **TanStack Store**: Centralized state management with intelligent caching
- **Features**:
  - Day-based cache system for activities and notes
  - Context filtering state
  - Real-time updates across components
  - Background data fetching for recent days

### Keyboard Shortcuts ✅ Implemented

- **System**: Custom React hook for keyboard shortcut management
- **Features**:
  - Intelligent input detection (doesn't trigger in form fields)
  - Support for modifier keys (Ctrl, Alt, Shift, Meta)
  - Extensible shortcut registration system
  - Modal-aware shortcuts (disabled when modals are open)
- **Available Shortcuts**:
  - `c` - Create new activity
  - `v` - Voice record new activity
  - `e` - Edit selected activity
  - `d` - Delete selected activity (with confirmation)
  - `↑/↓` - Navigate between activities
  - `←/→` - Navigate between days
  - `Escape` - Close modals/cancel actions
- **Modal Navigation**:
  - `↑/↓` - Navigate form fields (activity modal)
  - `Tab` - Navigate form fields
  - `Enter` - Submit forms
  - `←/→` - Navigate buttons (delete modal)
  - `v` - Start/stop recording (voice modal)
- **Key Files**:
  - Hook: `webapp/src/hooks/useKeyboardShortcuts.ts`
  - Integration: `webapp/src/routes/index.tsx`
  - Modal: `webapp/src/components/keyboard-shortcuts-modal.tsx`

### Voice Input & AI Processing ✅ Implemented

- **Frontend**: Web Audio API integration with real-time visualization
- **Backend**: OpenAI Whisper + GPT-4o-mini processing pipeline
- **Features**:
  - One-touch recording with 't' keyboard shortcut
  - Real-time audio wave visualization during recording
  - Intelligent title/notes extraction from speech
  - 60-second recording limit with countdown
  - Multiple audio format support (WebM Opus, WAV, MP3, M4A, OGG)
  - Comprehensive error handling with manual fallback
- **AI Integration**:
  - Whisper API for high-quality speech-to-text
  - GPT-4o-mini for smart content structuring
  - Automatic title extraction (5-8 words)
  - Context-aware notes generation
- **Key Files**:
  - Frontend: `webapp/src/components/voice-recording-modal.tsx`
  - Backend: `api/app/Http/Controllers/Api/ActivityController.php`
  - API: `POST /api/activities/voice`
  - Tests: `api/tests/Feature/VoiceActivityTest.php`
  - Documentation: `VOICE_RECORDING.md`

### Reporting System 🚧 Planned

- Backend: Report generation service with templates
- Export Formats: Implement CSV, JSON, and formatted text
- Frontend: Report builder interface

## Testing Commands

### API Tests

LifeBuffer uses **Pest** testing framework for clean, expressive tests.

```bash
cd api

# Run all tests
php artisan test

# Run specific test file
php artisan test --filter=ActivityTest

# Run with testing environment (uses SQLite in-memory)
php artisan test --env=testing

# Run tests in parallel
php artisan test --parallel

# Run tests with coverage
php artisan test --coverage
```

**Test Coverage**:
- **Activity API**: Comprehensive CRUD operations testing
  - Activity creation with validation
  - Activity updates with authorization
  - Activity deletion with policies
  - Context relationship validation
  - User authorization checks
- **Voice Recording API**: Complete voice processing pipeline testing
  - File upload validation (type, size, format)
  - OpenAI Whisper API integration testing
  - ChatGPT API processing and fallback scenarios
  - Error handling and cleanup verification
  - Multiple audio format support testing
- **Test Factories**: Available for User, Activity, Context, and Day models
- **Test Environment**: Configured with SQLite in-memory database and array drivers

**Key Test Files**:
- `tests/Feature/ActivityTest.php` - Activity API endpoint tests
- `tests/Feature/VoiceActivityTest.php` - Voice recording endpoint tests
- `tests/TestCase.php` - Base test configuration
- `database/factories/` - Model factories for testing
- `.env.testing` - Testing environment configuration

### Frontend Tests

```bash
cd webapp
# Test runner not yet configured (Vitest recommended for future implementation)
# Type checking available:
tsc --noEmit
```

## Deployment (Upsun Platform)

### Production Architecture

LifeBuffer is deployed on Upsun cloud platform with the following structure:

```yaml
applications:
  api:          # Laravel backend (PHP 8.4)
  webapp:       # React frontend (Node.js 22)
  landing:      # Marketing site (Node.js 22)

services:
  postgresql:   # Database (PostgreSQL 17)
  redis:        # Cache and sessions (Redis 7.0)
```

### Production URLs
- **Landing Page**: `https://lifebuffer.com` (marketing site)
- **Web App**: `https://app.lifebuffer.com` (main application)
- **API**: `https://api.lifebuffer.com` (backend services)

## Environment Configuration

### API (.env - Development)

Key variables to configure:

- `APP_URL`
- `DB_CONNECTION` (sqlite default)
- `QUEUE_CONNECTION`
- `OPENAI_API_KEY` - Required for voice recording feature (Whisper + GPT-4o-mini)

### API (.environment - Production/Upsun)

Production uses Upsun environment variables:
- Database: `$DATABASE_*` variables (PostgreSQL)
- Redis: `$REDIS_*` variables
- Sessions: Redis-backed with secure cookies
- HTTPS: Enforced across all domains

### Web App

- Configure API endpoint in environment
- Set up authentication tokens
- Configure feature flags

### Landing Page

- Static site served from `/landing/dist`
- No environment variables required
- Optimized build with Vite

## Component Architecture

### Core UI Components ✅ Implemented

- **ActivityModal**: Full-featured activity editing modal with auto-save
  - Status dropdown with shadcn components
  - Context selection with real-time filtering
  - Time input with smart parsing
  - Auto-save on blur with unsaved changes indicator
  
- **AddContextModal**: Context creation with rich UX
  - Emoji picker with 40+ predefined options
  - Duplicate name validation
  - Keyboard shortcuts support
  
- **EditableMarkdown**: Versatile markdown editor
  - View/edit mode toggle
  - Live markdown preview with react-markdown
  - Copy to clipboard functionality
  - Keyboard shortcuts (Ctrl+Enter, Esc)
  
- **Contexts Sidebar**: Smart context filtering
  - Visual selection indicators (bg-primary/text-primary-foreground)
  - "All" option for resetting filters
  - Click-to-filter functionality
  
### shadcn/ui Components Added
  
- `Dialog`: Modal dialogs for activity and context forms
- `Textarea`: Multi-line text input for notes and descriptions
- Enhanced `Calendar`: Date selection with proper styling
- `DropdownMenu`: Used for status selection in activity modal

### State Management Patterns

- **TanStack Store**: Centralized state with actions and selectors
- **Cache-first approach**: Immediate UI updates with background sync
- **Optimistic updates**: UI responds instantly, API syncs in background
- **Error handling**: Graceful error states with user feedback

### Landing Page Structure

The landing page is located in `/landing` and serves as the marketing website:

```
landing/
├── src/
│   ├── routes/          # TanStack Router pages
│   │   ├── __root.tsx   # Layout and navigation
│   │   ├── terms.tsx    # Terms of service
│   │   ├── privacy.tsx  # Privacy policy
│   │   └── security.tsx # Security information
│   ├── components/      # React components
│   │   ├── UseCases.tsx
│   │   ├── SocialProof.tsx
│   │   ├── ProblemSolution.tsx
│   │   └── Security.tsx
│   └── assets/          # Images and static files
├── public/              # Static assets (screenshots, icons)
├── dist/                # Built files (served in production)
└── marketing-specs.md   # Marketing content specifications
```

**Key Features:**
- React 19 with TanStack Router for type-safe routing
- Tailwind CSS v4 for modern styling
- Shadcn/ui components for consistent design
- Responsive design optimized for all devices
- Marketing content focused on professional users
- Legal pages (terms, privacy, security)

**Deployment:**
- Built with Vite during Upsun deployment
- Served as static files from `/dist` directory
- Available at `https://lifebuffer.com`

## Common Tasks

### OAuth Setup

1. Run migrations: `sail artisan migrate`
2. Create OAuth client: `sail artisan passport:client --public --name="App Name" --redirect_uri="http://localhost:3000/auth/callback"`
3. Add the generated client ID to `webapp/.env`:
   ```
   VITE_API_BASE_URL=http://api.lifebuffer.test
   VITE_CLIENT_ID=your-generated-client-id
   ```
4. For multiple domains, update redirect URIs:
   ```php
   sail artisan tinker --execute="\\Laravel\\Passport\\Client::find('client-id')->update(['redirect_uris' => json_encode(['http://localhost:3000/auth/callback', 'http://app.lifebuffer.test/auth/callback'])])"
   ```

### Adding New API Endpoint

1. Create controller: `sail artisan make:controller NameController`
2. Define routes in `routes/api.php`
3. Create request validation: `sail artisan make:request NameRequest`
4. Write tests in `tests/Feature/`

### Adding New Frontend Route

1. Create file in `src/routes/`
2. Export route component
3. Type-safe params automatically inferred
4. Add navigation links as needed

### Database Changes

1. Create migration: `sail artisan make:migration create_table_name`
2. Define schema changes
3. Run: `sail artisan migrate`
4. Update models and relationships

## Performance Considerations

- Use database indexing for frequently queried fields
- Implement caching for expensive operations
- Use queue jobs for time-consuming tasks
- Optimize frontend bundle with code splitting

## Security Notes

- API authentication setup required
- CORS configuration in `config/cors.php`
- Rate limiting configured in `routes/api.php`
- Input validation on all user data
- XSS protection via React's default escaping
