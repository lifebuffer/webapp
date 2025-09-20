# LifeBuffer

A flexible life tracking app that helps professionals capture, organize, and recall their daily activities with minimal friction.

## Overview

LifeBuffer is designed for knowledge workers who need to track accomplishments for 1-on-1s, standups, and performance reviews. Unlike complex productivity systems, LifeBuffer emphasizes simplicity and AI augmentation to make activity tracking effortless.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: TanStack Start with React 19
- **Database**: SQLite (default)
- **Styling**: Tailwind CSS

## Quick Start

### Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- pnpm

### Backend Setup

```bash
cd api
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
composer dev
```

### Frontend Setup

```bash
cd webapp
pnpm install
pnpm dev
```

## Features

### ✅ Implemented Features

- **Activity Management**: Complete CRUD operations with auto-save functionality
  - Create activities via "New activity" button or keyboard shortcut ('c')
  - Real-time editing with auto-save on blur
  - Status management (new, in progress, done)
  - Time tracking with smart parsing (e.g., "2h 30m")
- **Context Organization**: Create and filter activities by context with emoji support
- **Day Notes**: Markdown-enabled notes with live preview and editing
- **Date Navigation**: Smart date selection with intelligent caching
- **Keyboard Shortcuts**: Streamlined workflow with customizable shortcuts
- **Voice Input**: Complete AI-powered voice recording with intelligent processing
  - Press 't' to start voice recording with real-time audio visualization
  - OpenAI Whisper integration for speech-to-text transcription
  - GPT-4o-mini for intelligent title and notes extraction
  - Automatic activity creation with success notifications
- **Security**: Laravel policies and OAuth authentication with PKCE
- **Real-Time Updates**: Automatic cache management and state synchronization
- **Comprehensive Testing**: Full API test coverage with Pest framework

### 🚧 Planned Features

- **AI Categorization**: Smart activity organization and suggestions
- **Flexible Reporting**: Export activities to multiple formats (CSV, JSON, PDF)
- **Mobile Support**: Progressive web app capabilities
- **Team Features**: Shared contexts and collaborative tracking

## Testing

### API Tests

The backend uses **Pest** testing framework for comprehensive API testing:

```bash
cd api

# Run all tests
php artisan test

# Run specific test suite
php artisan test --filter=ActivityTest

# Run with testing environment (faster, uses in-memory SQLite)
php artisan test --env=testing
```

**Test Coverage:**
- Activity CRUD operations with validation
- Voice recording API with OpenAI integration testing
- User authorization and security policies
- Context relationships and permissions
- Complete API endpoint testing

### Frontend Tests

Type checking is available for the frontend:

```bash
cd webapp
tsc --noEmit
```

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and [PRODUCT_SPECS.md](./PRODUCT_SPECS.md) for full product specifications.

## License

Private project - All rights reserved